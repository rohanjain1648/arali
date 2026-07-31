import { prisma } from '../db/prisma';
import { sendTargetedNotification } from '../sockets/socketManager';

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type?: 'ASSIGNMENT' | 'REMINDER' | 'SYSTEM' | 'FOLLOWUP';
  entityType?: 'COMPANY' | 'CONTACT' | 'GENERAL';
  entityId?: string;
}

export class NotificationService {
  /**
   * Persist notification in database and emit real-time event to targeted user
   */
  static async createAndDispatch(data: CreateNotificationDTO) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'ASSIGNMENT',
        entityType: data.entityType || 'GENERAL',
        entityId: data.entityId,
        isRead: false,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // ⚡ Real-Time Socket Emission strictly targeted to target user's room
    sendTargetedNotification(data.userId, notification);

    return notification;
  }

  static async getUserNotifications(userId: string, unreadOnly = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId, // Ensure ownership check
      },
      data: {
        isRead: true,
      },
    });
    return notification;
  }

  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
