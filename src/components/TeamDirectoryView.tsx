import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  LogIn,
  Check,
  AlertCircle,
  Trash2,
  X
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { sound } from '../services/sound';

export const TeamDirectoryView: React.FC = () => {
  const { allUsers, currentUser, switchActiveProfile, createUserProfile, deleteStaffMember, isOwner } = useAuth();
  const { tasks } = useTasks();

  const [showAddModal, setShowAddModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('mostrador');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresa el nombre del colaborador');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const generatedEmail = email.trim() || `${name.toLowerCase().trim().replace(/[^a-z0-9]/g, '.')}@ferreteria.local`;
      await createUserProfile(name.trim(), generatedEmail, role, phone.trim());
      sound.playNotification();
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPhone('');
    } catch (err: unknown) {
      console.error('Error creating staff:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar el colaborador. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;
    setDeleting(true);
    try {
      await deleteStaffMember(staffToDelete.uid);
      sound.playNotification();
      setStaffToDelete(null);
    } catch (err) {
      console.error('Error deleting staff:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'dueño':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Dueño / Admin</span>;
      case 'encargado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">Encargado de Sucursal</span>;
      case 'deposito':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">Depósito & Recepción</span>;
      case 'mostrador':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ventas & Mostrador</span>;
      case 'compras':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">Gestión de Compras</span>;
    }
  };

  const getStatusIndicator = (status: UserProfile['status']) => {
    switch (status) {
      case 'disponible':
        return <span className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Disponible</span>;
      case 'ocupado':
        return <span className="flex items-center gap-1.5 text-xs text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> En Tarea / Ocupado</span>;
      default:
        return <span className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="w-2 h-2 rounded-full bg-zinc-600" /> En Pausa</span>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Personal de la Empresa • Ferretería Bruzzone</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
            Equipo de Ferretería & Carga Operativa
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Consulta el estado de cada colaborador y delega tareas sin sobrecargar a nadie.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg('');
            setShowAddModal(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all self-start sm:self-auto shadow-lg shadow-amber-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Agregar Colaborador</span>
        </button>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 flex flex-col my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4 shrink-0">
              <div className="flex items-center gap-2 font-bold text-zinc-100 text-base">
                <UserPlus className="w-5 h-5 text-amber-500" />
                <span>Registrar Nuevo Colaborador</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Marcelo Fernández"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm sm:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Puesto / Rol en la Ferretería *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm sm:text-xs text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="mostrador">Mostrador y Atención al Público</option>
                  <option value="deposito">Depósito y Control de Stock</option>
                  <option value="encargado">Encargado de Sucursal</option>
                  <option value="compras">Encargado de Compras</option>
                  <option value="dueño">Dueño / Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcelo@ferreteria.local"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm sm:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Teléfono / WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 11 5566-7788"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm sm:text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{saving ? 'Guardando...' : 'Crear Colaborador'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allUsers.map((staff) => {
          const userTasks = tasks.filter(t => t.assignedToUid === staff.uid);
          const activeCount = userTasks.filter(t => t.status !== 'completada').length;
          const completedCount = userTasks.filter(t => t.status === 'completada').length;
          const isMe = currentUser?.uid === staff.uid;

          return (
            <div
              key={staff.uid}
              className={`p-5 rounded-2xl border transition-all ${
                isMe 
                  ? 'bg-zinc-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {staff.avatar ? (
                      <img 
                        src={staff.avatar} 
                        alt={staff.displayName} 
                        className="w-12 h-12 rounded-2xl object-cover border border-zinc-700" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-bold text-base flex items-center justify-center border border-amber-500/30">
                        {staff.displayName.charAt(0)}
                      </div>
                    )}
                    {isMe && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-[10px] font-bold" title="Sesión activa">
                        ✓
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-100 text-sm">{staff.displayName}</h4>
                      {isMe && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          (Tú)
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {getRoleBadge(staff.role)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIndicator(staff.status)}
                  {/* Delete button */}
                  {allUsers.length > 1 && (
                    <button
                      onClick={() => setStaffToDelete(staff)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                      title={`Eliminar a ${staff.displayName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                {staff.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{staff.phone}</span>
                  </div>
                )}
                {staff.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                )}
              </div>

              {/* Workload Metrics & Switch Profile */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Activas: <strong className="text-zinc-200">{activeCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Completadas: <strong className="text-zinc-200">{completedCount}</strong></span>
                  </div>
                </div>

                {!isMe && (
                  <button
                    onClick={() => switchActiveProfile(staff)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span>Usar Turno</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Staff Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-100">¿Eliminar Colaborador?</h3>
                <p className="text-xs text-zinc-400">Esta acción dará de baja al empleado.</p>
              </div>
            </div>

            <div className="text-xs text-zinc-300 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 mb-4 space-y-1">
              <p>
                Colaborador: <strong className="text-zinc-100">{staffToDelete.displayName}</strong>
              </p>
              <p className="text-zinc-400">
                Rol: <span className="capitalize">{staffToDelete.role}</span>
              </p>
              {currentUser?.uid === staffToDelete.uid && (
                <p className="text-amber-400 font-medium pt-1 text-[11px]">
                  ⚠️ Estás usando este turno actualmente. Al eliminarlo se cambiará automáticamente al perfil del dueño.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setStaffToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'Eliminando...' : 'Sí, Eliminar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
