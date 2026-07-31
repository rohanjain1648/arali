import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { useNotifications } from '../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import { api } from '../services/api';
import {
  Bell,
  UserCheck,
  Zap,
  Radio,
  ChevronDown,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface NavbarProps {
  onOpenAssignModal: () => void;
  onNavigateNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssignModal, onNavigateNotifications }) => {
  const { users, activeUser, setActiveUser } = useUser();
  const { isConnected } = useSocket();
  const { unreadCount } = useNotifications();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [triggeringWorker, setTriggeringWorker] = useState(false);

  const handleTriggerBackground = async () => {
    if (!activeUser) return;
    setTriggeringWorker(true);
    try {
      await api.triggerBackgroundJob('FOLLOWUP_REMINDER', activeUser.id);
    } catch (err) {
      console.error('Failed to trigger background job:', err);
    } finally {
      setTriggeringWorker(false);
    }
  };

  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
            Arali <span className="text-brand-400 font-normal text-xs px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30">Live CRM</span>
          </h1>
          <p className="text-[11px] text-slate-400">Real-Time Targeted Notification Engine</p>
        </div>
      </div>

      {/* Center Controls & Actions */}
      <div className="flex items-center gap-3">
        {/* Socket Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isConnected ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isConnected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
            <Radio className="w-3 h-3 text-slate-400" />
            {isConnected ? 'Real-Time Connected' : 'Connecting...'}
          </span>
        </div>

        {/* Trigger Background Worker Button */}
        <button
          onClick={handleTriggerBackground}
          disabled={triggeringWorker}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          title="Simulate background cron worker creating a notification"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${triggeringWorker ? 'animate-spin' : ''}`} />
          Run Background Job
        </button>

        {/* New Assignment Action Button */}
        <button
          onClick={onOpenAssignModal}
          className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/30 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Assign Entity
        </button>
      </div>

      {/* Right Controls: User Switcher & Notification Bell */}
      <div className="flex items-center gap-4">
        {/* User Switcher (CRITICAL FOR DEMO TESTING) */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left group"
          >
            {activeUser?.avatarUrl ? (
              <img
                src={activeUser.avatarUrl}
                alt={activeUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-brand-400">
                {activeUser?.name.charAt(0)}
              </div>
            )}
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                {activeUser?.name}
                <span className="text-[10px] font-semibold text-brand-400 bg-brand-500/10 px-1.5 rounded">
                  {activeUser?.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{activeUser?.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
          </button>

          {/* User Switcher Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 z-50 p-2 animate-slide-down">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-brand-400" />
                  Simulate Active User View
                </p>
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setActiveUser(u);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                      activeUser?.id === u.id
                        ? 'bg-brand-500/20 border border-brand-500/30 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <img
                      src={u.avatarUrl || 'https://via.placeholder.com/32'}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.role} • {u.title || 'Team Member'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all relative group"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-300 group-hover:text-brand-400 transition-colors" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-extrabold text-white ring-2 ring-slate-950 animate-bounce-once">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Menu */}
          <NotificationDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onViewAllClick={onNavigateNotifications}
          />
        </div>
      </div>
    </header>
  );
};
