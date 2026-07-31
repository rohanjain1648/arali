import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, Sparkles, Clock, ShieldAlert, Check, ArrowRight } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAllClick: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onViewAllClick,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.isRead : true
  );

  return (
    <div className="absolute right-0 mt-3 w-96 glass-panel rounded-2xl shadow-2xl border border-slate-700/60 z-50 overflow-hidden animate-slide-down">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-sm text-slate-100">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-0.5 font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800/60 bg-slate-950/40 px-3 pt-2">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-brand-500 text-brand-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-brand-500 text-brand-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium">No notifications in this view</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const isAssignment = notification.type === 'ASSIGNMENT';
            const isReminder = notification.type === 'REMINDER';

            return (
              <div
                key={notification.id}
                className={`p-3.5 hover:bg-slate-800/30 transition-colors flex gap-3 items-start group ${
                  !notification.isRead ? 'bg-brand-950/20' : ''
                }`}
              >
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isAssignment
                      ? 'bg-brand-500/20 text-brand-400'
                      : isReminder
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {isAssignment ? (
                    <Sparkles className="w-4 h-4" />
                  ) : isReminder ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                </div>

                {/* Main details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className={`text-xs font-semibold truncate ${
                      !notification.isRead ? 'text-slate-100' : 'text-slate-300'
                    }`}>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {notification.message}
                  </p>
                </div>

                {/* Mark as read tick button */}
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as Read"
                    className="p-1 rounded-md text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors shrink-0"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-center">
        <button
          onClick={() => {
            onViewAllClick();
            onClose();
          }}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 transition-colors"
        >
          View Notification History
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
