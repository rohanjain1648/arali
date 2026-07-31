import { Request, Response } from 'express';
import { CRMService } from '../services/crm.service';

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await CRMService.getCompanies();
    res.json(companies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await CRMService.createCompany(req.body);
    res.status(201).json(company);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company = await CRMService.updateCompany(req.params.id, req.body);
    res.json(company);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    await CRMService.deleteCompany(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
