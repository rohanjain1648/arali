import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const unreadOnly = req.query.unread === 'true';

    const notifications = await NotificationService.getUserNotifications(userId, unreadOnly);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const count = await NotificationService.getUnreadCount(userId);
    res.json({ unreadCount: count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required to verify ownership.' });
    }

    await NotificationService.markAsRead(id, userId);
    res.json({ message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }

    await NotificationService.markAllAsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
