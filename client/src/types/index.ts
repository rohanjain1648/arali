export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'SALES_REP';
  title?: string;
  avatarUrl?: string;
  createdAt: string;
  _count?: {
    assignmentsReceived: number;
    notifications: number;
  };
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  annualRevenue: number;
  status: 'LEAD' | 'PROSPECT' | 'CUSTOMER' | 'CHURNED';
  website?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  contacts?: Contact[];
  assignments?: Assignment[];
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  status: string;
  companyId?: string;
  company?: Company;
  createdAt: string;
  updatedAt: string;
  assignments?: Assignment[];
}

export interface Assignment {
  id: string;
  role: string;
  userId: string;
  user: User;
  assignedByUserId: string;
  assignedByUser: User;
  companyId?: string;
  company?: Company;
  contactId?: string;
  contact?: Contact;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ASSIGNMENT' | 'REMINDER' | 'SYSTEM' | 'FOLLOWUP';
  entityType: 'COMPANY' | 'CONTACT' | 'GENERAL';
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}
