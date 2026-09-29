import React from 'react';
import { useTasks } from '../context/TaskContext';
import { HardwareTask } from '../types';
import { 
  Boxes, 
  Truck, 
  Store, 
  ShoppingCart, 
  Wrench, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3,
  Check,
  ChevronRight,
  Calendar
} from 'lucide-react';

interface Props {
  onSelectTask: (task: HardwareTask) => void;
  onEditTask: (task: HardwareTask) => void;
  filterDepartment?: string;
  filterAssignee?: string;
  filterSearch?: string;
  filterStatus?: string;
}

export const TaskListView: React.FC<Props> = ({
  onSelectTask,
  onEditTask,
  filterDepartment,
  filterAssignee,
  filterSearch,
  filterStatus
}) => {
  const { tasks, updateTaskStatus } = useTasks();

  const filteredTasks = tasks.filter(task => {
    if (filterDepartment && filterDepartment !== 'all' && task.department !== filterDepartment) {
      return false;
    }
    if (filterAssignee && filterAssignee !== 'all' && task.assignedToUid !== filterAssignee) {
      return false;
    }
    if (filterStatus && filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchAssignee = task.assignedToName?.toLowerCase().includes(q);
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

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgente':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> Urgente</span>;
      case 'alta':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">Alta</span>;
      case 'media':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">Media</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] text-zinc-500 border border-zinc-800">Baja</span>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'pendiente':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">Pendiente</span>;
      case 'en_progreso':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">En Progreso</span>;
      case 'en_revision':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">En Revisión</span>;
      case 'completada':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completada</span>;
      case 'bloqueada':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Bloqueada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Mobile Card View (md:hidden) */}
      <div className="md:hidden space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-xs">
            No se encontraron tareas con los filtros seleccionados
          </div>
        ) : (
          filteredTasks.map((task) => {
            const completedSteps = task.steps.filter(s => s.completed).length;
            const totalSteps = task.steps.length;
            const stepPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md space-y-3 active:scale-[0.99] transition-transform cursor-pointer"
              >
                {/* Header: Dept, Priority, Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 capitalize">
                    {getDepartmentIcon(task.department)}
                    {task.department}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-sm font-bold text-zinc-100 leading-snug">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Steps Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Avance: {completedSteps} de {totalSteps} pasos</span>
                    <span className="font-bold text-amber-400">{stepPercent}%</span>
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

                {/* Footer info & actions */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/30">
                      {task.assignedToName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs text-zinc-300 font-medium">
                      {task.assignedToName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {task.status !== 'completada' && (
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task.id, 'completada')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Completar</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">Actividad / Tarea</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Avance Pasos</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No se encontraron tareas con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const completedSteps = task.steps.filter(s => s.completed).length;
                  const totalSteps = task.steps.length;
                  const stepPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

                  return (
                    <tr
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Title & Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {task.description}
                          </div>
                        )}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-zinc-300 capitalize text-xs">
                          {getDepartmentIcon(task.department)}
                          {task.department}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                            {task.assignedToName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-zinc-200">{task.assignedToName}</div>
                            <div className="text-[10px] text-zinc-500 capitalize">{task.assignedToRole}</div>
                          </div>
                        </div>
                      </td>

                      {/* Step progress */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="w-28 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400">
                            <span>{completedSteps}/{totalSteps} pasos</span>
                            <span className="font-semibold">{stepPercent}%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                stepPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${stepPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>

                      {/* Actions */}
                      <td 
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {task.status !== 'completada' ? (
                            <button
                              type="button"
                              onClick={() => updateTaskStatus(task.id, 'completada')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                              title="Completar Tarea"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => onEditTask(task)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
