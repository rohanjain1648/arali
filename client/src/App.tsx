import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { AssignModal } from './components/AssignModal';
import { Dashboard } from './pages/Dashboard';
import { CompaniesPage } from './pages/CompaniesPage';
import { ContactsPage } from './pages/ContactsPage';
import { NotificationsPage } from './pages/NotificationsPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [assignCompanyId, setAssignCompanyId] = useState<string | undefined>(undefined);
  const [assignContactId, setAssignContactId] = useState<string | undefined>(undefined);

  const handleOpenAssignModal = (companyId?: string, contactId?: string) => {
    setAssignCompanyId(companyId);
    setAssignContactId(contactId);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenAssignModal={() => handleOpenAssignModal()}
        onNavigateNotifications={() => setActiveTab('notifications')}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Page Views */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenAssignModal={handleOpenAssignModal}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'companies' && (
            <CompaniesPage onOpenAssignModal={handleOpenAssignModal} />
          )}

          {activeTab === 'contacts' && (
            <ContactsPage onOpenAssignModal={handleOpenAssignModal} />
          )}

          {activeTab === 'notifications' && <NotificationsPage />}
        </main>
      </div>

      {/* Global Assign Entity Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          // Trigger any required refreshes if needed
        }}
        initialCompanyId={assignCompanyId}
        initialContactId={assignContactId}
      />

      {/* Global Toast Alert Overlay */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <UserProvider>
      <SocketProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </SocketProvider>
    </UserProvider>
  );
};

export default App;
