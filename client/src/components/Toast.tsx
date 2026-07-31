import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, ShieldAlert, Clock, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, markAsRead } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map(({ id, notification }) => {
        const isAssignment = notification.type === 'ASSIGNMENT';
        const isReminder = notification.type === 'REMINDER';

        return (
          <div
            key={id}
            className="pointer-events-auto glass-panel p-4 rounded-xl shadow-2xl border border-brand-500/40 animate-slide-down flex gap-3.5 items-start relative overflow-hidden group"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-500/20 rounded-full blur-xl group-hover:bg-brand-500/30 transition-all duration-300 pointer-events-none" />

            {/* Left Icon Indicator */}
            <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
              isAssignment 
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' 
                : isReminder 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}>
              {isAssignment ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : isReminder ? (
                <Clock className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {notification.type} • LIVE
                </span>
                <span className="text-xs text-slate-400">Just now</span>
              </div>
              <h4 className="font-semibold text-slate-100 text-sm leading-tight truncate">
                {notification.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                {notification.message}
              </p>
              
              <div className="mt-2.5 flex items-center gap-3">
                <button
                  onClick={() => {
                    markAsRead(notification.id);
                    dismissToast(id);
                  }}
                  className="text-xs font-medium text-brand-400 hover:text-brand-300 hover:underline flex items-center gap-1"
                >
                  Mark as Read
                </button>
              </div>
            </div>

            {/* Dismiss Close X Button */}
            <button
              onClick={() => dismissToast(id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
