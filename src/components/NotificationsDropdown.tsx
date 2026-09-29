import React from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  X 
} from 'lucide-react';
import { AppNotification } from '../types';

interface Props {
  onClose: () => void;
  onSelectTask: (taskId: string) => void;
}

export const NotificationsDropdown: React.FC<Props> = ({ onClose, onSelectTask }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useTasks();

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'task_assigned':
        return <UserCheck className="w-4 h-4 text-amber-500" />;
      case 'step_completed':
        return <CheckCheck className="w-4 h-4 text-emerald-500" />;
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'task_blocked':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Hace ${diffHours} h`;
      return new Date(isoString).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="px-4 py-3 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-sm text-zinc-100">Notificaciones del Equipo</h3>
        </div>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={() => markAllNotificationsRead()}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Marcar leídas
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-zinc-800/60">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 text-zinc-600 opacity-50" />
            No hay notificaciones pendientes
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.taskId) {
                  onSelectTask(notif.taskId);
                  onClose();
                }
              }}
              className={`p-3 transition-colors cursor-pointer flex gap-3 items-start ${
                notif.read ? 'bg-zinc-900/40 opacity-70 hover:bg-zinc-850' : 'bg-zinc-800/60 hover:bg-zinc-800'
              }`}
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-800 border border-zinc-700/50">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-200 line-clamp-1">
                  {notif.taskTitle}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500">
                  <span>{formatTime(notif.createdAt)}</span>
                  <span>•</span>
                  <span>Por {notif.createdByName}</span>
                </div>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer test notification action */}
      <div className="p-2.5 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between text-xs">
        <button
          onClick={async () => {
            const { sound } = await import('../services/sound');
            const { pushNotifications } = await import('../services/pushNotifications');
            sound.playNotification();
            pushNotifications.showNotification(
              'Ferretería Bruzzone 🔔',
              '¡Notificación de prueba activa! Recibirás alertas de tareas y actividades en tu celular.',
              { tag: 'test-notif' }
            );
          }}
          className="w-full py-1.5 px-3 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-amber-400 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Probar Notificación en este Celular</span>
        </button>
      </div>
    </div>
  );
};
