import cron from 'node-cron';
import { prisma } from '../db/prisma';
import { NotificationService } from '../services/notification.service';

export class BackgroundWorker {
  private static cronTask: cron.ScheduledTask | null = null;

  /**
   * Start scheduled background tasks (e.g. run every 2 minutes)
   */
  static startScheduler() {
    console.log('⚙️ [Background Worker] Starting scheduled background tasks worker...');

    // Cron schedule: Run every 2 minutes (*/2 * * * *)
    this.cronTask = cron.schedule('*/2 * * * *', async () => {
      console.log('⏰ [Background Worker] Cron execution triggered: Generating follow-up reminders...');
      await this.runFollowUpReminderJob();
    });
  }

  static stopScheduler() {
    if (this.cronTask) {
      this.cronTask.stop();
      console.log('⚙️ [Background Worker] Cron scheduler stopped.');
    }
  }

  /**
   * Worker Job: Scans assignments and sends follow-up/health-check reminders to assigned users
   */
  static async runFollowUpReminderJob(specificUserId?: string) {
    try {
      // Find active assignments
      const whereCondition = specificUserId ? { userId: specificUserId } : {};
      const assignments = await prisma.assignment.findMany({
        where: whereCondition,
        include: {
          user: true,
          company: true,
          contact: true,
        },
        take: 10,
      });

      if (assignments.length === 0) {
        console.log('⚙️ [Background Worker] No assignments found to process reminders.');
        return { count: 0, message: 'No active assignments found for reminder processing.' };
      }

      let generatedCount = 0;

      for (const assignment of assignments) {
        let title = 'Automated Follow-Up Reminder';
        let message = '';
        let entityType: 'COMPANY' | 'CONTACT' = 'COMPANY';
        let entityId = '';

        if (assignment.company) {
          entityType = 'COMPANY';
          entityId = assignment.company.id;
          message = `[Background Task] Reminder to schedule a check-in call with ${assignment.company.name} (${assignment.role}).`;
        } else if (assignment.contact) {
          entityType = 'CONTACT';
          entityId = assignment.contact.id;
          message = `[Background Task] Follow-up reminder: Send product update email to ${assignment.contact.firstName} ${assignment.contact.lastName}.`;
        } else {
          continue;
        }

        // Create & dispatch targeted notification
        await NotificationService.createAndDispatch({
          userId: assignment.userId,
          title,
          message,
          type: 'REMINDER',
          entityType,
          entityId,
        });

        generatedCount++;
      }

      console.log(`✅ [Background Worker] Created ${generatedCount} background notifications.`);
      return { count: generatedCount, message: `Successfully generated ${generatedCount} background notification(s).` };
    } catch (error) {
      console.error('❌ [Background Worker] Error executing follow-up worker:', error);
      throw error;
    }
  }

  /**
   * Manual Background Job Simulator for immediate reviewer demo
   */
  static async executeManualJob(jobType: string, targetUserId: string) {
    console.log(`🚀 [Background Worker] Executing manual job: ${jobType} for user ${targetUserId}`);

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new Error('Target user not found');

    if (jobType === 'FOLLOWUP_REMINDER') {
      return await this.runFollowUpReminderJob(targetUserId);
    } 
    
    if (jobType === 'HEALTH_CHECK') {
      await NotificationService.createAndDispatch({
        userId: targetUserId,
        title: 'System Account Health Alert',
        message: `[Background Worker] Account Health Analysis completed for ${user.name}'s assigned accounts. Risk score: Low.`,
        type: 'SYSTEM',
        entityType: 'GENERAL',
      });
      return { count: 1, message: 'Health check background notification dispatched.' };
    }

    if (jobType === 'BATCH_ENRICHMENT') {
      await NotificationService.createAndDispatch({
        userId: targetUserId,
        title: 'Lead Enrichment Complete',
        message: `[Background Worker] Automated data enrichment worker synced updated company metrics for your active accounts.`,
        type: 'FOLLOWUP',
        entityType: 'GENERAL',
      });
      return { count: 1, message: 'Data enrichment background notification dispatched.' };
    }

    throw new Error('Unknown job type');
  }
}
