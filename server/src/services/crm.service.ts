import { prisma } from '../db/prisma';

export class CRMService {
  // Users
  static async getUsers() {
    return await prisma.user.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            assignmentsReceived: true,
            notifications: { where: { isRead: false } }
          }
        }
      }
    });
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        assignmentsReceived: {
          include: {
            company: true,
            contact: { include: { company: true } },
            assignedByUser: { select: { id: true, name: true } }
          }
        }
      }
    });
  }

  static async createUser(data: { name: string; email: string; role?: string; title?: string; avatarUrl?: string }) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || 'SALES_REP',
        title: data.title || 'Account Representative',
        avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      }
    });
  }

  // Companies
  static async getCompanies() {
    return await prisma.company.findMany({
      include: {
        contacts: true,
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
            assignedByUser: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async createCompany(data: { name: string; industry: string; annualRevenue?: number; status?: string; website?: string; phone?: string }) {
    return await prisma.company.create({
      data: {
        name: data.name,
        industry: data.industry,
        annualRevenue: data.annualRevenue || 0,
        status: data.status || 'PROSPECT',
        website: data.website,
        phone: data.phone,
      }
    });
  }

  static async updateCompany(id: string, data: any) {
    return await prisma.company.update({
      where: { id },
      data
    });
  }

  static async deleteCompany(id: string) {
    return await prisma.company.delete({
      where: { id }
    });
  }

  // Contacts
  static async getContacts() {
    return await prisma.contact.findMany({
      include: {
        company: true,
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
            assignedByUser: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async createContact(data: { firstName: string; lastName: string; email: string; phone?: string; title?: string; companyId?: string }) {
    return await prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        title: data.title,
        companyId: data.companyId || null,
      },
      include: {
        company: true
      }
    });
  }

  static async updateContact(id: string, data: any) {
    return await prisma.contact.update({
      where: { id },
      data,
      include: { company: true }
    });
  }

  static async deleteContact(id: string) {
    return await prisma.contact.delete({
      where: { id }
    });
  }
}
