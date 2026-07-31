import { User, Company, Contact, Assignment, Notification } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'An unexpected error occurred' }));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Users
  getUsers: (): Promise<User[]> => 
    fetch(`${API_BASE}/users`).then(handleResponse<User[]>),

  getUserById: (id: string): Promise<User> =>
    fetch(`${API_BASE}/users/${id}`).then(handleResponse<User>),

  createUser: (data: Partial<User>): Promise<User> =>
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse<User>),

  // Companies
  getCompanies: (): Promise<Company[]> =>
    fetch(`${API_BASE}/companies`).then(handleResponse<Company[]>),

  createCompany: (data: Partial<Company>): Promise<Company> =>
    fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse<Company>),

  updateCompany: (id: string, data: Partial<Company>): Promise<Company> =>
    fetch(`${API_BASE}/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse<Company>),

  deleteCompany: (id: string): Promise<{ message: string }> =>
    fetch(`${API_BASE}/companies/${id}`, { method: 'DELETE' }).then(handleResponse<{ message: string }>),

  // Contacts
  getContacts: (): Promise<Contact[]> =>
    fetch(`${API_BASE}/contacts`).then(handleResponse<Contact[]>),

  createContact: (data: Partial<Contact>): Promise<Contact> =>
    fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse<Contact>),

  updateContact: (id: string, data: Partial<Contact>): Promise<Contact> =>
    fetch(`${API_BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse<Contact>),

  deleteContact: (id: string): Promise<{ message: string }> =>
    fetch(`${API_BASE}/contacts/${id}`, { method: 'DELETE' }).then(handleResponse<{ message: string }>),

  // Assignments
  getAssignments: (): Promise<Assignment[]> =>
    fetch(`${API_BASE}/assignments`).then(handleResponse<Assignment[]>),

  createAssignment: (data: {
    userId: string;
    assignedByUserId: string;
    role: string;
    companyId?: string;
    contactId?: string;
  }): Promise<Assignment> =>
    fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse<Assignment>),

  deleteAssignment: (id: string): Promise<{ message: string }> =>
    fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' }).then(handleResponse<{ message: string }>),

  // Notifications
  getUserNotifications: (userId: string, unreadOnly = false): Promise<Notification[]> =>
    fetch(`${API_BASE}/notifications/user/${userId}${unreadOnly ? '?unread=true' : ''}`).then(handleResponse<Notification[]>),

  getUnreadCount: (userId: string): Promise<{ unreadCount: number }> =>
    fetch(`${API_BASE}/notifications/user/${userId}/unread-count`).then(handleResponse<{ unreadCount: number }>),

  markAsRead: (id: string, userId: string): Promise<{ message: string }> =>
    fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).then(handleResponse<{ message: string }>),

  markAllAsRead: (userId: string): Promise<{ message: string }> =>
    fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).then(handleResponse<{ message: string }>),

  // Background Trigger
  triggerBackgroundJob: (jobType: string, targetUserId: string): Promise<any> =>
    fetch(`${API_BASE}/background/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobType, targetUserId }),
    }).then(handleResponse<any>),
};
