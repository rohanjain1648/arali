import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import {
  BellRing,
  CheckCheck,
  Sparkles,
  Clock,
  ShieldAlert,
  Check,
  Filter,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { activeUser } = useUser();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ASSIGNMENT' | 'REMINDER'>('ALL');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'ASSIGNMENT') return n.type === 'ASSIGNMENT';
    if (filter === 'REMINDER') return n.type === 'REMINDER';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              TARGETED RECIPIENT: {activeUser?.name}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-brand-400" />
            Notification Center & Event Logs
          </h2>
          <p className="text-xs text-slate-400">All notifications persisted in SQLite database for {activeUser?.email}</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-brand-400 hover:text-brand-300 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        <Filter className="w-4 h-4 text-slate-500 mr-2" />
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'UNREAD'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setFilter('ASSIGNMENT')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'ASSIGNMENT'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Assignments
        </button>

        <button
          onClick={() => setFilter('REMINDER')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'REMINDER'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Background Worker Reminders
        </button>
      </div>

      {/* Notification Stream */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BellRing className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">No notifications found in this view</p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const isAssignment = n.type === 'ASSIGNMENT';
            const isReminder = n.type === 'REMINDER';

            return (
              <div
                key={n.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  !n.isRead ? 'bg-brand-950/20' : 'hover:bg-slate-900/30'
                }`}
              >
                {/* Icon */}
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    isAssignment
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                      : isReminder
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  {isAssignment ? (
                    <Sparkles className="w-5 h-5" />
                  ) : isReminder ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-brand-400 border border-slate-700">
                      {n.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {n.entityType}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-auto">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold ${!n.isRead ? 'text-white' : 'text-slate-200'}`}>
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                </div>

                {/* Mark as read button */}
                {!n.isRead ? (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-brand-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Read
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 px-2 py-1 rounded bg-slate-900 shrink-0">
                    Read
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
