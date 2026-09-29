import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Sparkles, 
  Boxes, 
  Truck, 
  Store, 
  ShoppingCart, 
  Wrench 
} from 'lucide-react';
import { Department } from '../types';

interface Props {
  search: string;
  setSearch: (s: string) => void;
  department: string;
  setDepartment: (d: string) => void;
  assignee: string;
  setAssignee: (a: string) => void;
  status?: string;
  setStatus?: (s: string) => void;
  showStatusFilter?: boolean;
}

export const TaskFiltersBar: React.FC<Props> = ({
  search,
  setSearch,
  department,
  setDepartment,
  assignee,
  setAssignee,
  status,
  setStatus,
  showStatusFilter
}) => {
  const { allUsers } = useAuth();
  const { seedSampleHardwareTasks, tasks } = useTasks();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 sm:p-4 mb-4 sm:mb-6 shadow-md space-y-2.5 sm:space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por actividad, material, responsable..."
            className="w-full pl-9 pr-4 py-2 sm:py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-zinc-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Selectors (Scrollable horizontally on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-800 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los Sectores</option>
              <option value="inventario">📦 Inventario</option>
              <option value="deposito">🚚 Depósito</option>
              <option value="mostrador">🏬 Mostrador</option>
              <option value="compras">📋 Compras</option>
              <option value="mantenimiento">🛠️ Mantenimiento</option>
              <option value="despacho">🛵 Despacho</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-800 shrink-0">
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Todo el Equipo</option>
              {allUsers.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.displayName} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter (if list view) */}
          {showStatusFilter && setStatus && (
            <div className="bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-800 shrink-0">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Todos los Estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="en_progreso">En Progreso</option>
                <option value="en_revision">En Revisión</option>
                <option value="completada">Completadas</option>
                <option value="bloqueada">Bloqueadas</option>
              </select>
            </div>
          )}

          {/* Seed button if user wants more examples */}
          {tasks.length <= 2 && (
            <button
              onClick={() => seedSampleHardwareTasks()}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              title="Cargar tareas típicas de ferretería"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Ejemplos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
