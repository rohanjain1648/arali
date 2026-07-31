import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignment.service';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { userId, assignedByUserId, role, companyId, contactId } = req.body;
    
    if (!userId || !assignedByUserId || !role) {
      return res.status(400).json({ error: 'userId, assignedByUserId, and role are required fields.' });
    }

    const assignment = await AssignmentService.createAssignment({
      userId,
      assignedByUserId,
      role,
      companyId,
      contactId,
    });

    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await AssignmentService.getAllAssignments();
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    await AssignmentService.removeAssignment(req.params.id);
    res.json({ message: 'Assignment removed' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
