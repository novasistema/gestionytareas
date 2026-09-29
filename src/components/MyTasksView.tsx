import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Check, 
  AlertTriangle, 
  Boxes, 
  Truck, 
  Store, 
  ShoppingCart, 
  Wrench, 
  Flame, 
  ArrowRight, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HardwareTask } from '../types';

interface Props {
  onSelectTask: (task: HardwareTask) => void;
}

export const MyTasksView: React.FC<Props> = ({ onSelectTask }) => {
  const { tasks, toggleTaskStep, updateTaskStatus } = useTasks();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'activas' | 'completadas'>('activas');
  const [collapsedTasks, setCollapsedTasks] = useState<{ [id: string]: boolean }>({});

  const myTasks = tasks.filter(t => t.assignedToUid === currentUser?.uid);
  const activeTasks = myTasks.filter(t => t.status !== 'completada');
  const completedTasks = myTasks.filter(t => t.status === 'completada');

  const displayedTasks = activeTab === 'activas' ? activeTasks : completedTasks;

  const toggleCollapse = (taskId: string) => {
    setCollapsedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'inventario': return <Boxes className="w-4 h-4 text-emerald-400" />;
      case 'deposito': return <Truck className="w-4 h-4 text-blue-400" />;
      case 'mostrador': return <Store className="w-4 h-4 text-amber-400" />;
      case 'compras': return <ShoppingCart className="w-4 h-4 text-purple-400" />;
      case 'mantenimiento': return <Wrench className="w-4 h-4 text-orange-400" />;
      default: return <Truck className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Mi Turno Operativo • Ferretería Bruzzone</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
            Hola, {currentUser?.displayName} 👋
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tienes {activeTasks.length} {activeTasks.length === 1 ? 'actividad asignada' : 'actividades asignadas'} para completar paso a paso.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab('activas')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'activas'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pendientes ({activeTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completadas')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'completadas'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Completadas ({completedTasks.length})
          </button>
        </div>
      </div>

      {/* Task List with inline checklist */}
      <div className="space-y-4">
        {displayedTasks.length === 0 ? (
          <div className="py-16 text-center bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-300">
              {activeTab === 'activas' 
                ? '¡Excelente trabajo! No tienes tareas pendientes.' 
                : 'Aún no has completado tareas en esta sesión.'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {activeTab === 'activas' ? 'Puedes ayudar en mostrador o consultar al encargado.' : ''}
            </p>
          </div>
        ) : (
          displayedTasks.map((task) => {
            const completedSteps = task.steps.filter(s => s.completed).length;
            const totalSteps = task.steps.length;
            const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
            const isCollapsed = collapsedTasks[task.id];

            return (
              <div
                key={task.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-3 bg-zinc-950/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 capitalize">
                        {getDepartmentIcon(task.department)}
                        {task.department}
                      </span>
                      {task.priority === 'urgente' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Urgente
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {task.estimatedMinutes || 30} min
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectTask(task)}
                      className="text-base font-bold text-zinc-100 hover:text-amber-400 cursor-pointer transition-colors"
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleCollapse(task.id)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 pt-3 pb-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                    <span>Avance: {completedSteps} de {totalSteps} pasos</span>
                    <span className="font-bold text-amber-400">{percent}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        percent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Step by step checklist inline */}
                {!isCollapsed && (
                  <div className="p-5 pt-3 space-y-2 border-t border-zinc-800/60 mt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Paso a paso a realizar:
                    </p>
                    {task.steps.map((step, idx) => (
                      <div
                        key={step.id}
                        onClick={() => toggleTaskStep(task.id, step.id)}
                        className={`p-3.5 sm:p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all active:scale-[0.99] select-none ${
                          step.completed
                            ? 'bg-emerald-950/20 border-emerald-500/20 text-zinc-400'
                            : 'bg-zinc-950 border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-950/80 active:bg-zinc-900'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                            step.completed
                              ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-sm'
                              : 'border-zinc-700 bg-zinc-900 group-hover:border-amber-500'
                          }`}
                        >
                          {step.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-xs font-medium leading-relaxed ${step.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                            <span className="font-mono text-zinc-500 font-bold mr-1">{idx + 1}.</span> {step.text}
                          </p>
                          {step.notes && (
                            <p className="text-[11px] text-zinc-400 mt-1 italic">
                              Nota: {step.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Quick completion or review action */}
                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onSelectTask(task)}
                        className="text-xs text-zinc-400 hover:text-zinc-200 font-medium"
                      >
                        Ver detalles completos
                      </button>

                      {task.status !== 'completada' ? (
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(task.id, 'completada')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Finalizar Tarea
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Tarea Finalizada
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
