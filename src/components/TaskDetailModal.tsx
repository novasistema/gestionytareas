import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  AlertTriangle, 
  Boxes, 
  Truck, 
  Store, 
  ShoppingCart, 
  Wrench, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Check, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { HardwareTask, TaskStatus } from '../types';

interface Props {
  task: HardwareTask | null;
  onClose: () => void;
  onEdit: (task: HardwareTask) => void;
}

export const TaskDetailModal: React.FC<Props> = ({ task, onClose, onEdit }) => {
  const { toggleTaskStep, updateTaskStatus, deleteTask } = useTasks();
  const { currentUser, isOwner } = useAuth();
  
  const [showBlockerInput, setShowBlockerInput] = useState(false);
  const [blockerReason, setBlockerReason] = useState('');
  const [stepNoteInput, setStepNoteInput] = useState<{ [stepId: string]: string }>({});
  const [activeStepNoteId, setActiveStepNoteId] = useState<string | null>(null);

  if (!task) return null;

  const completedSteps = task.steps.filter(s => s.completed).length;
  const progressPercent = task.steps.length > 0 
    ? Math.round((completedSteps / task.steps.length) * 100) 
    : 0;

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

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgente':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> Urgente</span>;
      case 'alta':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">Alta</span>;
      case 'media':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Media</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">Baja</span>;
    }
  };

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case 'pendiente':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">Pendiente</span>;
      case 'en_progreso':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">En Progreso</span>;
      case 'en_revision':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">En Revisión</span>;
      case 'completada':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completada</span>;
      case 'bloqueada':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">Bloqueada</span>;
    }
  };

  const handleBlockTask = async () => {
    if (!blockerReason.trim()) return;
    await updateTaskStatus(task.id, 'bloqueada', blockerReason.trim());
    setShowBlockerInput(false);
    setBlockerReason('');
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      await deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-900 border-0 sm:border border-zinc-800 rounded-none sm:rounded-2xl w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-zinc-950 border-b border-zinc-800 flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 capitalize">
                {getDepartmentIcon(task.department)}
                {task.department}
              </span>
              {getPriorityBadge(task.priority)}
              {getStatusBadge(task.status)}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug break-words">
              {task.title}
            </h2>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="text-zinc-400 hover:text-amber-400 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              title="Editar Tarea"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-zinc-400 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                title="Eliminar Tarea"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 pb-28 sm:pb-6">

          {/* Blocked Alert Banner if blocked */}
          {task.status === 'bloqueada' && task.blockerReason && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Tarea Bloqueada / Inconveniente Reportado
                </h4>
                <p className="text-xs text-red-200 mt-1">{task.blockerReason}</p>
                <p className="text-[11px] text-red-400/80 mt-2">
                  El responsable necesita ayuda o material para continuar.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div className="text-xs text-zinc-300 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 leading-relaxed">
              {task.description}
            </div>
          )}

          {/* Meta Information Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                Responsable
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  {task.assignedToName?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{task.assignedToName}</p>
                  <p className="text-[10px] text-zinc-500 capitalize">{task.assignedToRole || 'Equipo'}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                Tiempo Estimado
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{task.estimatedMinutes || 30} minutos</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                Fecha Límite
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>{task.dueDate || 'Sin fecha'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                Creada Por
              </span>
              <div className="text-xs font-semibold text-zinc-200 truncate">
                {task.createdByName}
              </div>
            </div>
          </div>

          {/* Interactive Step-by-Step Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Checklist Paso a Paso
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-300">
                  {completedSteps} de {task.steps.length} ({progressPercent}%)
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">
                Haz clic en cada paso al completarlo
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full transition-all duration-300 ${
                  progressPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Steps interactive list */}
            <div className="space-y-2.5">
              {task.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    step.completed
                      ? 'bg-zinc-950/50 border-emerald-500/20 text-zinc-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTaskStep(task.id, step.id)}
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                        step.completed
                          ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-sm shadow-emerald-500/30'
                          : 'border-zinc-700 hover:border-amber-500 bg-zinc-900'
                      }`}
                    >
                      {step.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium leading-relaxed ${step.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                        <span className="font-mono text-zinc-500 font-bold mr-1">{idx + 1}.</span> {step.text}
                      </p>

                      {step.completed && (
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-400/80">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completado {step.completedByName ? `por ${step.completedByName}` : ''}</span>
                        </div>
                      )}

                      {/* Step notes if present */}
                      {step.notes && (
                        <div className="mt-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                          <span className="font-semibold text-zinc-400">Nota: </span>
                          {step.notes}
                        </div>
                      )}

                      {/* Add note drawer for this step */}
                      {activeStepNoteId === step.id ? (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={stepNoteInput[step.id] || ''}
                            onChange={(e) => setStepNoteInput({ ...stepNoteInput, [step.id]: e.target.value })}
                            placeholder="Añadir aclaración o detalle técnico del paso..."
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              await toggleTaskStep(task.id, step.id, stepNoteInput[step.id]);
                              setActiveStepNoteId(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold"
                          >
                            Guardar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStepNoteId(step.id);
                            setStepNoteInput({ ...stepNoteInput, [step.id]: step.notes || '' });
                          }}
                          className="mt-1 text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          {step.notes ? 'Editar nota de este paso' : 'Agregar nota de control'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blocker reporting input box */}
          {showBlockerInput && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Reportar Inconveniente / Falta de Material
                </span>
                <button
                  type="button"
                  onClick={() => setShowBlockerInput(false)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={blockerReason}
                onChange={(e) => setBlockerReason(e.target.value)}
                placeholder="Explica qué bloquea esta tarea (ej: 'No hay stock de tornillos 8x1 en depósito', 'Se rompió la mecha', 'Falta autorización de precio')..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-red-500/30 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlockerInput(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleBlockTask}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Notificar Bloqueo
                </button>
              </div>
            </div>
          )}

          {/* Quick Status Changers */}
          <div className="pt-4 border-t border-zinc-800">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
              Cambiar Estado Operativo
            </span>
            <div className="flex flex-wrap gap-2">
              {task.status !== 'en_progreso' && (
                <button
                  type="button"
                  onClick={() => updateTaskStatus(task.id, 'en_progreso')}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Iniciar / En Progreso
                </button>
              )}

              {task.status !== 'en_revision' && (
                <button
                  type="button"
                  onClick={() => updateTaskStatus(task.id, 'en_revision')}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold transition-colors"
                >
                  Pedir Revisión
                </button>
              )}

              {task.status !== 'completada' && (
                <button
                  type="button"
                  onClick={() => updateTaskStatus(task.id, 'completada')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dar por Completada
                </button>
              )}

              {task.status !== 'bloqueada' && !showBlockerInput && (
                <button
                  type="button"
                  onClick={() => setShowBlockerInput(true)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Reportar Bloqueo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
