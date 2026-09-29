import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { sound } from '../services/sound';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Logo } from './Logo';
import { 
  Wrench, 
  Plus, 
  Bell, 
  Volume2, 
  VolumeX, 
  LayoutGrid, 
  ListTodo, 
  UserCheck, 
  TrendingUp, 
  Users, 
  Wifi, 
  WifiOff, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  ShieldCheck,
  Flame,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { UserStatus } from '../types';

export type MainView = 'kanban' | 'list' | 'my-tasks' | 'strategy' | 'team';

interface Props {
  activeView: MainView;
  setActiveView: (view: MainView) => void;
  onOpenNewTaskModal: () => void;
  onSelectTaskFromNotif: (taskId: string) => void;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  setActiveView,
  onOpenNewTaskModal,
  onSelectTaskFromNotif
}) => {
  const { currentUser, firebaseUser, loginWithGoogle, logout, updateMyStatus, isOnline } = useAuth();
  const { unreadNotificationsCount, tasks, notificationPermission, requestNotificationPermission } = useTasks();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  const myActiveTasksCount = tasks.filter(
    t => t.assignedToUid === currentUser?.uid && t.status !== 'completada'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Sync Status */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90 py-1" 
              onClick={() => setActiveView('kanban')}
              title="Ferretería Bruzzone - Inicio"
            >
              {/* White badge container matching the official company card */}
              <div className="bg-white px-2.5 py-1 rounded-xl shadow-md border border-zinc-700/40 flex items-center h-10">
                <Logo variant="full" invertForDark={false} className="h-7 w-auto" />
              </div>
            </div>

            {/* Cloud Sync Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-300">Firebase Conectado</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-400">Sin Conexión</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Desktop only - mobile uses MobileBottomNav) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeView === 'kanban'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablero</span> Kanban
            </button>

            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeView === 'list'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>

            <button
              onClick={() => setActiveView('my-tasks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeView === 'my-tasks'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mis Tareas</span>
              {myActiveTasksCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeView === 'my-tasks' ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {myActiveTasksCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('strategy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeView === 'strategy'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm font-bold'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-zinc-800'
              }`}
              title="Módulo especial para ganar tiempo y buscar proveedores"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Panel Dueño:</span> Compras
            </button>

            <button
              onClick={() => setActiveView('team')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeView === 'team'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Equipo</span>
            </button>
          </nav>

          {/* Right Actions: Sound, Notifs, New Task, Profile */}
          <div className="flex items-center gap-2">
            
            {/* Audio notifications toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'
              }`}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos de alerta'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative flex items-center gap-1.5" ref={notifRef}>
              {notificationPermission !== 'granted' && (
                <button
                  onClick={() => requestNotificationPermission()}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all animate-pulse"
                  title="Activar notificaciones en este celular o navegador"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[11px]">Activar Alertas</span>
                </button>
              )}

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
                title="Notificaciones en tiempo real"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-zinc-950 text-[10px] font-extrabold rounded-full animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationsDropdown
                  onClose={() => setShowNotifications(false)}
                  onSelectTask={(taskId) => {
                    onSelectTaskFromNotif(taskId);
                    setShowNotifications(false);
                  }}
                />
              )}
            </div>

            {/* New Task Button (Desktop only, mobile has FAB) */}
            <button
              onClick={onOpenNewTaskModal}
              className="hidden md:flex px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Nueva Tarea</span>
            </button>

            {/* User Profile dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-zinc-200 line-clamp-1">
                    {currentUser?.displayName}
                  </p>
                  <p className="text-[10px] text-zinc-500 capitalize">{currentUser?.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="pb-3 border-b border-zinc-800">
                    <p className="text-xs font-bold text-zinc-100">{currentUser?.displayName}</p>
                    <p className="text-[11px] text-zinc-400">{currentUser?.email}</p>
                    <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                      Rol: {currentUser?.role}
                    </span>
                  </div>

                  {/* Status Picker */}
                  <div className="py-2.5 border-b border-zinc-800">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Mi Estado Actual
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {(['disponible', 'ocupado', 'ausente'] as UserStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateMyStatus(st)}
                          className={`py-1 rounded text-[11px] capitalize font-medium transition-colors ${
                            currentUser?.status === st
                              ? 'bg-amber-500 text-zinc-950 font-bold'
                              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {st === 'ausente' ? 'Pausa' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notifications permission quick action */}
                  {notificationPermission !== 'granted' && (
                    <div className="py-2 border-b border-zinc-800">
                      <button
                        onClick={async () => {
                          await requestNotificationPermission();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Activar Notificaciones del Celular
                      </button>
                    </div>
                  )}

                  {/* Auth Actions */}
                  <div className="pt-2 space-y-1">
                    {!firebaseUser ? (
                      <button
                        onClick={async () => {
                          try {
                            await loginWithGoogle();
                            setShowUserMenu(false);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Vincular con Cuenta Google
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          await logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Cerrar Sesión Google
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
