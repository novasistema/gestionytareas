import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  Calendar, 
  User, 
  AlertCircle, 
  Wrench, 
  Boxes, 
  Truck, 
  Store, 
  ShoppingCart, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { Department, HardwareTask, TaskPriority, TaskStep } from '../types';
import { FERRETERIA_PRESETS } from '../data/presets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: HardwareTask | null;
}

export const TaskModal: React.FC<Props> = ({ isOpen, onClose, initialTask }) => {
  const { createTask, updateTask, tasks } = useTasks();
  const { allUsers } = useAuth();

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [department, setDepartment] = useState<Department>(initialTask?.department || 'deposito');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'media');
  const [assignedToUid, setAssignedToUid] = useState(initialTask?.assignedToUid || (allUsers[0]?.uid || ''));
  const [estimatedMinutes, setEstimatedMinutes] = useState(initialTask?.estimatedMinutes || 30);
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || new Date().toISOString().split('T')[0]);
  
  // Step by step list
  const [steps, setSteps] = useState<TaskStep[]>(
    initialTask?.steps || [
      { id: `step_1`, text: '', completed: false },
      { id: `step_2`, text: '', completed: false }
    ]
  );
  const [newStepText, setNewStepText] = useState('');
  const [showPresets, setShowPresets] = useState(!initialTask);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (presetIndex: number) => {
    const preset = FERRETERIA_PRESETS[presetIndex];
    if (!preset) return;
    setTitle(preset.title);
    setDescription(preset.description);
    setDepartment(preset.department);
    setPriority(preset.priority);
    setEstimatedMinutes(preset.estimatedMinutes);
    setSteps(
      preset.steps.map((text, idx) => ({
        id: `step_${Date.now()}_${idx}`,
        text,
        completed: false
      }))
    );
    setShowPresets(false);
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    setSteps([
      ...steps,
      {
        id: `step_${Date.now()}`,
        text: newStepText.trim(),
        completed: false
      }
    ]);
    setNewStepText('');
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor ingresa un título para la tarea.');
      return;
    }

    const validSteps = steps.filter(s => s.text.trim().length > 0);
    if (validSteps.length === 0) {
      setErrorMsg('Debes agregar al menos 1 paso a paso para guiar al responsable.');
      return;
    }

    const assignedUser = allUsers.find(u => u.uid === assignedToUid);

    setSaving(true);
    setErrorMsg('');

    try {
      if (initialTask) {
        await updateTask(initialTask.id, {
          title: title.trim(),
          description: description.trim(),
          department,
          priority,
          assignedToUid,
          assignedToName: assignedUser?.displayName || 'Personal',
          assignedToRole: assignedUser?.role,
          estimatedMinutes: Number(estimatedMinutes),
          dueDate,
          steps: validSteps
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          department,
          priority,
          status: 'pendiente',
          assignedToUid,
          assignedToName: assignedUser?.displayName || 'Personal',
          assignedToRole: assignedUser?.role,
          estimatedMinutes: Number(estimatedMinutes),
          dueDate,
          steps: validSteps
        });
      }
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar la tarea');
    } finally {
      setSaving(false);
    }
  };

  // Helper to count active tasks per user
  const getUserActiveTasksCount = (uid: string) => {
    return tasks.filter(t => t.assignedToUid === uid && t.status !== 'completada').length;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-900 border-0 sm:border border-zinc-800 rounded-none sm:rounded-2xl w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                {initialTask ? 'Editar Tarea de Ferretería' : 'Nueva Tarea y Delegación'}
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400">
                Organiza actividades y delega con instrucciones paso a paso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ferretería Presets Banner */}
        {!initialTask && (
          <div className="px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>¿Quieres ahorrar tiempo? Usa plantillas habituales de ferretería.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
            >
              {showPresets ? 'Ocultar Plantillas' : 'Ver Plantillas'}
            </button>
          </div>
        )}

        {/* Preset Cards Drawer */}
        {showPresets && !initialTask && (
          <div className="p-4 bg-zinc-950/70 border-b border-zinc-800 max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FERRETERIA_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(idx)}
                className="text-left p-2.5 rounded-xl border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/80 transition-all group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">
                    {preset.title}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{preset.description}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500">
                  <span className="capitalize">{preset.department}</span>
                  <span>•</span>
                  <span>{preset.steps.length} pasos</span>
                  <span>•</span>
                  <span>{preset.estimatedMinutes} min</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Título de la Actividad / Tarea *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Recepción y conteo de pedido de tornillería y tirafondos"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm sm:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
              />
            </div>

          {/* Department and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Sector / Departamento
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="inventario">📦 Control de Inventario y Stock</option>
                <option value="deposito">🚚 Depósito y Recepción</option>
                <option value="mostrador">🏬 Mostrador y Atención al Público</option>
                <option value="compras">📋 Compras y Proveedores</option>
                <option value="mantenimiento">🛠️ Mantenimiento y Cerrajería</option>
                <option value="despacho">🛵 Despacho y Envíos a Obras</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="baja">Baja - Puede esperar</option>
                <option value="media">Media - Para el turno</option>
                <option value="alta">Alta - Importante hoy</option>
                <option value="urgente">🚨 Urgente - Resolver de inmediato</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Descripción o Instrucciones Generales
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Detalles sobre herramientas necesarias, remitos o precauciones..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Delegation & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Delegar a (Responsable) *
              </label>
              <select
                value={assignedToUid}
                onChange={(e) => setAssignedToUid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {allUsers.map((u) => {
                  const count = getUserActiveTasksCount(u.uid);
                  return (
                    <option key={u.uid} value={u.uid}>
                      {u.displayName} ({u.role}) - {count} activas
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Tiempo Estimado (minutos)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
                <Clock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Fecha Límite
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
                <Calendar className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Step-by-Step Checklist Builder */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-zinc-200">
                  Pasos a Paso para el Responsable ({steps.length})
                </label>
                <p className="text-[11px] text-zinc-400">
                  La clave para ganar tiempo es dejar los pasos claros para que el empleado no tenga que preguntarte todo.
                </p>
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2 mb-3">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2 group">
                  <span className="w-6 text-center text-xs font-mono font-semibold text-zinc-500">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={step.text}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].text = e.target.value;
                      setSteps(updated);
                    }}
                    placeholder={`Paso ${idx + 1}...`}
                    className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveStep(idx, 'up')}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === steps.length - 1}
                      onClick={() => handleMoveStep(idx, 'down')}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add step input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                placeholder="Escribe otro paso y presiona Enter o Agregar..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar Paso
              </button>
            </div>
          </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="p-3.5 sm:p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Wrench className="w-4 h-4" />
              {saving ? 'Guardando...' : initialTask ? 'Actualizar Tarea' : 'Delegar Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
