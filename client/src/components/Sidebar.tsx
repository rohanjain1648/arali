import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  BellRing,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { unreadCount } = useNotifications();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'notifications', label: 'Notification Center', icon: BellRing, badge: unreadCount },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-6">
        {/* Navigation Menu */}
        <div>
          <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/25 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-brand-700'
                        : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Architecture Specs Box */}
        <div className="p-3.5 rounded-2xl glass-card bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-brand-400" />
            <h4 className="text-xs font-bold text-slate-200">System Architecture</h4>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              Targeted Socket Rooms (`user:id`)
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              SQLite DB Persistence (Prisma)
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              Node-Cron Background Worker
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
        Arali CRM System • Production Architecture
      </div>
    </aside>
  );
};
