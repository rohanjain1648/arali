import { prisma } from '../db/prisma';
import { NotificationService } from './notification.service';

export interface CreateAssignmentDTO {
  userId: string;          // Target user being assigned
  assignedByUserId: string;// Admin/User performing assignment
  role: string;            // E.g. "Account Executive", "Lead Manager", "Technical Lead"
  companyId?: string;      // Optional company ID
  contactId?: string;      // Optional contact ID
}

export class AssignmentService {
  static async createAssignment(data: CreateAssignmentDTO) {
    if (!data.companyId && !data.contactId) {
      throw new Error('An assignment must target either a Company or a Contact.');
    }

    // Fetch details of target user, assigning user, company or contact
    const [targetUser, assignerUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.userId } }),
      prisma.user.findUnique({ where: { id: data.assignedByUserId } }),
    ]);

    if (!targetUser) throw new Error('Target user not found');
    if (!assignerUser) throw new Error('Assigner user not found');

    let company = null;
    let contact = null;

    if (data.companyId) {
      company = await prisma.company.findUnique({ where: { id: data.companyId } });
      if (!company) throw new Error('Company not found');
    }

    if (data.contactId) {
      contact = await prisma.contact.findUnique({
        where: { id: data.contactId },
        include: { company: true },
      });
      if (!contact) throw new Error('Contact not found');
    }

    // Persist assignment record in database
    const assignment = await prisma.assignment.create({
      data: {
        userId: data.userId,
        assignedByUserId: data.assignedByUserId,
        role: data.role,
        companyId: data.companyId || null,
        contactId: data.contactId || null,
      },
      include: {
        user: true,
        assignedByUser: true,
        company: true,
        contact: {
          include: { company: true }
        }
      }
    });

    // Construct targeted live notification
    let title = '';
    let message = '';
    let entityType: 'COMPANY' | 'CONTACT' = 'COMPANY';
    let entityId = '';

    if (company) {
      entityType = 'COMPANY';
      entityId = company.id;
      title = 'New Company Assignment';
      message = `You have been assigned to ${company.name} as ${data.role} by ${assignerUser.name}.`;
    } else if (contact) {
      entityType = 'CONTACT';
      entityId = contact.id;
      title = 'New Contact Assignment';
      const companyContext = contact.company ? ` (${contact.company.name})` : '';
      message = `You have been assigned to contact ${contact.firstName} ${contact.lastName}${companyContext} as ${data.role} by ${assignerUser.name}.`;
    }

    // Dispatch notification to database AND target user's real-time room
    await NotificationService.createAndDispatch({
      userId: data.userId,
      title,
      message,
      type: 'ASSIGNMENT',
      entityType,
      entityId,
    });

    return assignment;
  }

  static async getAllAssignments() {
    return await prisma.assignment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        assignedByUser: { select: { id: true, name: true, email: true } },
        company: true,
        contact: { include: { company: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async removeAssignment(assignmentId: string) {
    return await prisma.assignment.delete({
      where: { id: assignmentId },
    });
  }
}
