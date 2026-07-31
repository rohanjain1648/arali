import { Request, Response } from 'express';
import { CRMService } from '../services/crm.service';

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await CRMService.getContacts();
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const contact = await CRMService.createContact(req.body);
    res.status(201).json(contact);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const contact = await CRMService.updateContact(req.params.id, req.body);
    res.json(contact);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    await CRMService.deleteContact(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
