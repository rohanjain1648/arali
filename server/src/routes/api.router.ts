import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import * as CompanyController from '../controllers/company.controller';
import * as ContactController from '../controllers/contact.controller';
import * as AssignmentController from '../controllers/assignment.controller';
import * as NotificationController from '../controllers/notification.controller';
import * as BackgroundController from '../controllers/background.controller';

const router = Router();

// Users
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);

// Companies
router.get('/companies', CompanyController.getCompanies);
router.post('/companies', CompanyController.createCompany);
router.put('/companies/:id', CompanyController.updateCompany);
router.delete('/companies/:id', CompanyController.deleteCompany);

// Contacts
router.get('/contacts', ContactController.getContacts);
router.post('/contacts', ContactController.createContact);
router.put('/contacts/:id', ContactController.updateContact);
router.delete('/contacts/:id', ContactController.deleteContact);

// Assignments
router.get('/assignments', AssignmentController.getAssignments);
router.post('/assignments', AssignmentController.createAssignment);
router.delete('/assignments/:id', AssignmentController.deleteAssignment);

// Notifications
router.get('/notifications/user/:userId', NotificationController.getUserNotifications);
router.get('/notifications/user/:userId/unread-count', NotificationController.getUnreadCount);
router.patch('/notifications/:id/read', NotificationController.markAsRead);
router.patch('/notifications/mark-all-read', NotificationController.markAllAsRead);

// Background Worker Trigger
router.post('/background/trigger', BackgroundController.triggerBackgroundJob);

export default router;
