import { Request, Response } from 'express';
import { BackgroundWorker } from '../workers/backgroundWorker';

export const triggerBackgroundJob = async (req: Request, res: Response) => {
  try {
    const { jobType, targetUserId } = req.body;

    if (!jobType || !targetUserId) {
      return res.status(400).json({ error: 'jobType and targetUserId are required.' });
    }

    const result = await BackgroundWorker.executeManualJob(jobType, targetUserId);
    res.json({
      success: true,
      jobType,
      targetUserId,
      result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
