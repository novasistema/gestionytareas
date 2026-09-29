import React, { useEffect, useState } from 'react';
import { AppNotification } from '../types';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, UserCheck, X } from 'lucide-react';

interface Props {
  notification: AppNotification | null;
  onOpenTask: (taskId: string) => void;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<Props> = ({
  notification,
  onOpenTask,
  onDismiss
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'task_assigned':
        return <UserCheck className="w-5 h-5 text-amber-500" />;
      case 'step_completed':
        return <CheckCheck className="w-5 h-5 text-emerald-500" />;
      case 'task_completed':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'task_blocked':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed top-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-top-4 duration-200">
      <div
        onClick={() => {
          if (notification.taskId) {
            onOpenTask(notification.taskId);
            onDismiss();
          }
        }}
        className="p-3.5 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl shadow-black/80 flex items-start gap-3 cursor-pointer hover:border-amber-500 active:scale-[0.99] transition-all"
      >
        <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/60 shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              {notification.type === 'task_assigned' ? 'Nueva Tarea Asignada' :
               notification.type === 'step_completed' ? 'Avance en Tarea' :
               notification.type === 'task_blocked' ? 'Alerta de Bloqueo' :
               notification.type === 'task_completed' ? 'Tarea Finalizada' : 'Nueva Notificación'}
            </span>
            <span className="text-[10px] text-zinc-500">Ahora</span>
          </div>

          <h4 className="text-xs font-bold text-zinc-100 truncate mt-0.5">
            {notification.taskTitle}
          </h4>

          <p className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2 leading-snug">
            {notification.message}
          </p>

          <p className="text-[10px] text-amber-400/80 mt-1 font-medium">
            Toca aquí para ver los pasos →
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
