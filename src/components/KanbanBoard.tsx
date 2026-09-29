import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  HardwareTask, 
  TaskStatus 
} from '../types';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  Truck, 
  Store, 
  ShoppingCart, 
  Wrench, 
  Flame, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Check
} from 'lucide-react';

interface Props {
  onSelectTask: (task: HardwareTask) => void;
  filterDepartment?: string;
  filterAssignee?: string;
  filterSearch?: string;
}

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string; border: string; dot: string }[] = [
  { id: 'pendiente', label: 'Pendientes', color: 'text-zinc-400', bg: 'bg-zinc-900/50', border: 'border-zinc-800', dot: 'bg-zinc-400' },
  { id: 'en_progreso', label: 'En Progreso', color: 'text-blue-400', bg: 'bg-blue-950/20', border: 'border-blue-900/30', dot: 'bg-blue-400' },
  { id: 'en_revision', label: 'En Revisión', color: 'text-purple-400', bg: 'bg-purple-950/20', border: 'border-purple-900/30', dot: 'bg-purple-400' },
  { id: 'completada', label: 'Completadas', color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-900/30', dot: 'bg-emerald-400' },
  { id: 'bloqueada', label: 'Bloqueadas', color: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-900/30', dot: 'bg-red-400' }
];

export const KanbanBoard: React.FC<Props> = ({ 
  onSelectTask, 
  filterDepartment, 
  filterAssignee, 
  filterSearch 
}) => {
  const { tasks, updateTaskStatus } = useTasks();
  const [mobileSelectedCol, setMobileSelectedCol] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    if (filterDepartment && filterDepartment !== 'all' && task.department !== filterDepartment) {
      return false;
    }
    if (filterAssignee && filterAssignee !== 'all' && task.assignedToUid !== filterAssignee) {
      return false;
    }
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchAssignee = task.assignedToName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee) return false;
    }
    return true;
  });

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'inventario': return <Boxes className="w-3.5 h-3.5 text-emerald-400" />;
      case 'deposito': return <Truck className="w-3.5 h-3.5 text-blue-400" />;
      case 'mostrador': return <Store className="w-3.5 h-3.5 text-amber-400" />;
      case 'compras': return <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />;
      case 'mantenimiento': return <Wrench className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Truck className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const getPriorityTag = (p: string) => {
    switch (p) {
      case 'urgente':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-0.5"><Flame className="w-3 h-3" /> Urgente</span>;
      case 'alta':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">Alta</span>;
      case 'media':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">Media</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] text-zinc-500 border border-zinc-800">Baja</span>;
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'pendiente': return 'en_progreso';
      case 'en_progreso': return 'en_revision';
      case 'en_revision': return 'completada';
      case 'bloqueada': return 'en_progreso';
      default: return null;
    }
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'en_progreso': return 'pendiente';
      case 'en_revision': return 'en_progreso';
      case 'completada': return 'en_revision';
      default: return null;
    }
  };

  const visibleColumns = mobileSelectedCol === 'all'
    ? COLUMNS
    : COLUMNS.filter(c => c.id === mobileSelectedCol);

  return (
    <div className="space-y-4">
      {/* Mobile Column Switcher (Pills) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setMobileSelectedCol('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            mobileSelectedCol === 'all'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          Todas ({filteredTasks.length})
        </button>

        {COLUMNS.map(col => {
          const count = filteredTasks.filter(t => t.status === col.id).length;
          const isSelected = mobileSelectedCol === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setMobileSelectedCol(col.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-zinc-800 text-zinc-100 border border-amber-500 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
              <span>{col.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-950 text-zinc-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Grid */}
      <div className={`grid gap-4 pb-20 md:pb-6 ${
        mobileSelectedCol === 'all'
          ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5 overflow-x-auto'
          : 'grid-cols-1'
      }`}>
        {visibleColumns.map((col) => {
          const columnTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} p-3.5 min-w-[280px] ${
                mobileSelectedCol === 'all' ? 'md:h-[calc(100vh-220px)]' : 'min-h-[400px]'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                  {columnTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
                {columnTasks.length === 0 ? (
                  <div className="h-28 border-2 border-dashed border-zinc-800/60 rounded-xl flex items-center justify-center text-xs text-zinc-600">
                    Sin tareas en esta etapa
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const completedSteps = task.steps.filter(s => s.completed).length;
                    const totalSteps = task.steps.length;
                    const stepPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                    const nextStatus = getNextStatus(task.status);
                    const prevStatus = getPrevStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className="group p-4 rounded-xl bg-zinc-900 border border-zinc-800/90 hover:border-amber-500/50 hover:shadow-lg hover:shadow-black/40 transition-all cursor-pointer space-y-3 active:scale-[0.99]"
                      >
                        {/* Card Top: Department & Priority */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 capitalize">
                            {getDepartmentIcon(task.department)}
                            {task.department}
                          </span>
                          {getPriorityTag(task.priority)}
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                          {task.title}
                        </h4>

                        {/* Blocker alert preview if blocked */}
                        {task.status === 'bloqueada' && task.blockerReason && (
                          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span>{task.blockerReason}</span>
                          </div>
                        )}

                        {/* Steps Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                            <span>Pasos: {completedSteps}/{totalSteps}</span>
                            <span className="font-semibold text-amber-400">{stepPercent}%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                stepPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${stepPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Card Footer: Assignee & Quick Move */}
                        <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/30 shrink-0">
                              {task.assignedToName?.charAt(0) || 'U'}
                            </div>
                            <span className="text-xs text-zinc-300 truncate max-w-[120px]">
                              {task.assignedToName}
                            </span>
                          </div>

                          {/* Quick Status Shift Buttons (Larger touch targets for mobile) */}
                          <div 
                            className="flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {prevStatus && (
                              <button
                                type="button"
                                onClick={() => updateTaskStatus(task.id, prevStatus)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 active:scale-95 transition-all"
                                title={`Mover a ${prevStatus}`}
                                aria-label="Mover a estado anterior"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {nextStatus && (
                              <button
                                type="button"
                                onClick={() => updateTaskStatus(task.id, nextStatus)}
                                className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 hover:text-amber-300 font-semibold text-xs active:scale-95 transition-all flex items-center gap-1 border border-amber-500/30"
                                title={`Mover a ${nextStatus}`}
                                aria-label="Avanzar estado"
                              >
                                <span className="text-[10px] hidden sm:inline">Avanzar</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
