import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { Company, Contact, Assignment } from '../types';
import {
  Building2,
  Users,
  Sparkles,
  BellRing,
  ArrowUpRight,
  UserCheck,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  onOpenAssignModal: (companyId?: string, contactId?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenAssignModal, onNavigateTab }) => {
  const { activeUser } = useUser();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [compData, contData, assignData] = await Promise.all([
        api.getCompanies(),
        api.getContacts(),
        api.getAssignments(),
      ]);
      setCompanies(compData);
      setContacts(contData);
      setAssignments(assignData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = companies.reduce((sum, c) => sum + c.annualRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-brand-500/30 bg-gradient-to-r from-brand-950/40 via-slate-900/60 to-slate-950/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                ACTIVE USER SESSION
              </span>
              <span className="text-xs text-slate-400 font-medium">{activeUser?.role}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back, {activeUser?.name}! 👋
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              You are currently viewing the system as <strong className="text-brand-400">{activeUser?.name}</strong>. Any assignments made to this user will trigger instant WebSocket notifications in real-time.
            </p>
          </div>

          <button
            onClick={() => onOpenAssignModal()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            Assign Company or Contact
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('companies')}
          className="p-5 rounded-2xl glass-card hover:bg-slate-900/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Companies</span>
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{companies.length}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              ${(totalRevenue / 1000000).toFixed(1)}M Val
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('contacts')}
          className="p-5 rounded-2xl glass-card hover:bg-slate-900/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Contacts</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{contacts.length}</span>
            <span className="text-xs font-medium text-indigo-400">Active Directory</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl glass-card hover:bg-slate-900/60 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Assignments</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{assignments.length}</span>
            <span className="text-xs font-medium text-emerald-400">Across Team</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('notifications')}
          className="p-5 rounded-2xl glass-card hover:bg-slate-900/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unread Alerts</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{unreadCount}</span>
            <span className="text-xs font-medium text-purple-400">
              {unreadCount > 0 ? 'Action Required' : 'All Read'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Assignments & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Assignments Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Recent System Assignments
              </h3>
              <p className="text-xs text-slate-400">Role-based ownership records synced in database</p>
            </div>
            <button
              onClick={() => onOpenAssignModal()}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              + New Assignment
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden">
            {assignments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <UserCheck className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No assignments created yet</p>
              </div>
            ) : (
              assignments.slice(0, 5).map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 font-bold shrink-0">
                      {a.company ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Users className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          {a.company ? a.company.name : `${a.contact?.firstName} ${a.contact?.lastName}`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 font-bold rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/30">
                          {a.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Assigned to <strong className="text-slate-200">{a.user.name}</strong> by {a.assignedByUser.name}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium shrink-0">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: User's Targeted Live Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-400" />
                Your Live Notifications
              </h3>
              <p className="text-xs text-slate-400">Targeted stream for {activeUser?.name}</p>
            </div>
            <button
              onClick={() => onNavigateTab('notifications')}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View All
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <BellRing className="w-6 h-6 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No notifications for {activeUser?.name}</p>
              </div>
            ) : (
              notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all ${
                    !n.isRead
                      ? 'bg-brand-950/30 border-brand-500/30'
                      : 'bg-slate-900/40 border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-400">
                      {n.type}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{n.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">{n.message}</p>

                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="mt-2 text-[10px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Mark Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
