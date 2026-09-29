import React from 'react';
import { LayoutGrid, ListTodo, UserCheck, TrendingUp, Users, Plus } from 'lucide-react';
import { MainView } from './Navbar';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  activeView: MainView;
  setActiveView: (view: MainView) => void;
  onOpenNewTaskModal: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  activeView,
  setActiveView,
  onOpenNewTaskModal
}) => {
  const { tasks, unreadNotificationsCount } = useTasks();
  const { currentUser } = useAuth();

  const myActiveTasksCount = tasks.filter(
    t => t.assignedToUid === currentUser?.uid && t.status !== 'completada'
  ).length;

  return (
    <>
      {/* Floating Action Button (FAB) for fast mobile task creation */}
      <button
        onClick={onOpenNewTaskModal}
        className="md:hidden fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-2xl shadow-amber-500/50 flex items-center justify-center active:scale-95 transition-all border-2 border-zinc-950"
        aria-label="Nueva Tarea"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/90 pb-safe">
        <div className="flex items-center justify-around h-16 px-1">
          {/* Tab: Kanban */}
          <button
            onClick={() => setActiveView('kanban')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors relative ${
              activeView === 'kanban' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeView === 'kanban' ? 'bg-amber-500/15' : ''}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Tablero</span>
            {activeView === 'kanban' && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Tab: Lista */}
          <button
            onClick={() => setActiveView('list')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors relative ${
              activeView === 'list' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeView === 'list' ? 'bg-amber-500/15' : ''}`}>
              <ListTodo className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Lista</span>
            {activeView === 'list' && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Tab: Mis Tareas (Center Hero Tab for shopfloor staff) */}
          <button
            onClick={() => setActiveView('my-tasks')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors relative ${
              activeView === 'my-tasks' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all relative ${activeView === 'my-tasks' ? 'bg-amber-500/15' : ''}`}>
              <UserCheck className="w-5 h-5" />
              {myActiveTasksCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-amber-500 text-zinc-950 text-[9px] font-black rounded-full shadow-sm">
                  {myActiveTasksCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Mis Tareas</span>
            {activeView === 'my-tasks' && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Tab: Compras / Dueño */}
          <button
            onClick={() => setActiveView('strategy')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors relative ${
              activeView === 'strategy' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeView === 'strategy' ? 'bg-amber-500/15' : ''}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Compras</span>
            {activeView === 'strategy' && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Tab: Equipo */}
          <button
            onClick={() => setActiveView('team')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors relative ${
              activeView === 'team' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeView === 'team' ? 'bg-amber-500/15' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Equipo</span>
            {activeView === 'team' && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
