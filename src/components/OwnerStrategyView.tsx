import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  ShoppingBag, 
  Plus, 
  Building2, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink, 
  Trash2, 
  Tag, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { SupplierLead } from '../types';

export const OwnerStrategyView: React.FC = () => {
  const { supplierLeads, createSupplierLead, updateSupplierLead, deleteSupplierLead, stats } = useTasks();
  const { allUsers } = useAuth();

  const [showAddLead, setShowAddLead] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [category, setCategory] = useState('Bulonería y Fijaciones');
  const [contactInfo, setContactInfo] = useState('');
  const [priceNotes, setPriceNotes] = useState('');
  const [potentialSavings, setPotentialSavings] = useState('');
  const [status, setStatus] = useState<SupplierLead['status']>('contacto_inicial');
  const [saving, setSaving] = useState(false);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim()) return;

    setSaving(true);
    try {
      await createSupplierLead({
        supplierName: supplierName.trim(),
        category,
        contactInfo: contactInfo.trim(),
        priceNotes: priceNotes.trim(),
        potentialSavings: potentialSavings.trim(),
        status
      });
      setShowAddLead(false);
      setSupplierName('');
      setContactInfo('');
      setPriceNotes('');
      setPotentialSavings('');
    } catch (err) {
      console.warn('Error saving lead:', err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (s: SupplierLead['status']) => {
    switch (s) {
      case 'contacto_inicial':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">Contacto Inicial</span>;
      case 'cotizacion_recibida':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">Cotización Recibida</span>;
      case 'analizando':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Comparando Precios</span>;
      case 'aprobado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Proveedor Aprobado</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-24 md:pb-8">
      {/* Hero: Tiempo Ganado por Delegación */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/15 via-zinc-900 to-zinc-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espacio Estratégico de Dirección • Ferretería Bruzzone</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Tu tiempo libre para hacer crecer Ferretería Bruzzone
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Al delegar las operaciones rutinarias con pasos claros al equipo de mostrador y depósito, recuperas el control de tu agenda para negociar mejores precios de compra y descubrir proveedores más rentables.
            </p>
          </div>

          <button
            onClick={() => setShowAddLead(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 active:scale-95 transition-all shrink-0 self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Proveedor / Cotización</span>
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-zinc-800/80">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Tiempo Ganado</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-zinc-100">
              {stats.hoursDelegatedSaved} <span className="text-xs sm:text-sm font-semibold text-amber-400">horas</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">Ahorradas en tareas delegadas</p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Tareas Resueltas</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-zinc-100">
              {stats.completedTasks}
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">Sin requerir tu intervención</p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Equipo Operativo</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-zinc-100">
              {allUsers.length} <span className="text-xs sm:text-sm font-normal text-zinc-400">personas</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">Mostrador, depósito y compras</p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
              <Building2 className="w-4 h-4 text-purple-500" />
              <span>Proveedores en Radar</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-zinc-100">
              {supplierLeads.length}
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">Oportunidades de compra activa</p>
          </div>
        </div>
      </div>

      {/* Supplier Form Modal */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-900 border-0 sm:border border-zinc-800 rounded-none sm:rounded-2xl w-full max-w-xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl flex flex-col p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-800 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm sm:text-base">Registrar Nuevo Proveedor / Cotización</h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400">Compara cotizaciones para mejorar el margen de la ferretería</p>
                </div>
              </div>
              <button onClick={() => setShowAddLead(false)} className="text-zinc-400 hover:text-zinc-200 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="flex-1 overflow-y-auto space-y-3.5 sm:space-y-4 pr-1">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nombre de la Empresa / Distribuidor *
                </label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Ej: Mayorista Sanitarios del Plata / Bulonería Argentina S.A."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Rubro de Ferretería
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bulonería y Fijaciones">Bulonería y Fijaciones</option>
                    <option value="Herramientas Eléctricas y Manuales">Herramientas Eléctricas y Manuales</option>
                    <option value="Plomería, Gas y Termofusión">Plomería, Gas y Termofusión</option>
                    <option value="Electricidad e Iluminación">Electricidad e Iluminación</option>
                    <option value="Pinturería y Químicos">Pinturería y Químicos</option>
                    <option value="Cerrajería y Seguridad">Cerrajería y Seguridad</option>
                    <option value="Construcción y Áridos">Construcción y Áridos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Estado de Negociación
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as SupplierLead['status'])}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="contacto_inicial">Contacto Inicial</option>
                    <option value="cotizacion_recibida">Cotización Recibida</option>
                    <option value="analizando">Comparando Precios</option>
                    <option value="aprobado">Proveedor Aprobado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Contacto (Teléfono, WhatsApp, Vendedor, Email)
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Ej: Marcelo (Vendedor) +54 9 11 5544-3322 / ventas@proveedor.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Notas de Precios, Descuentos y Condiciones de Pago
                </label>
                <textarea
                  value={priceNotes}
                  onChange={(e) => setPriceNotes(e.target.value)}
                  rows={3}
                  placeholder="Ej: Ofrecen 20% de descuento por bulto cerrado de tirafondos. Pago a 30-60 días. Entrega en 48hs sin costo de flete."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Ahorro Potencial Estimado (Opcional)
                </label>
                <input
                  type="text"
                  value={potentialSavings}
                  onChange={(e) => setPotentialSavings(e.target.value)}
                  placeholder="Ej: Ahorro aprox: 15% vs distribuidor anterior ($250.000/mes)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddLead(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
                >
                  {saving ? 'Guardando...' : 'Guardar Proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              Directorio de Nuevos Proveedores & Comparativas
            </h3>
            <p className="text-xs text-zinc-400">
              Registra llamadas, listas de precios mayoristas y cotizaciones para maximizar tus márgenes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supplierLeads.length === 0 ? (
            <div className="col-span-2 py-12 text-center bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800">
              <Building2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-300">
                No tienes proveedores registrados todavía
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Haz clic en "Nuevo Proveedor / Cotización" para empezar a registrar tus contactos estratégicos.
              </p>
            </div>
          ) : (
            supplierLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all space-y-3.5 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {lead.category}
                      </span>
                      {getStatusBadge(lead.status)}
                    </div>
                    <h4 className="text-base font-bold text-zinc-100">
                      {lead.supplierName}
                    </h4>
                  </div>
                  <button
                    onClick={() => deleteSupplierLead(lead.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {lead.contactInfo && (
                  <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                    <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{lead.contactInfo}</span>
                  </div>
                )}

                {lead.priceNotes && (
                  <p className="text-xs text-zinc-400 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/60 leading-relaxed">
                    {lead.priceNotes}
                  </p>
                )}

                {lead.potentialSavings && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                    <DollarSign className="w-4 h-4" />
                    <span>{lead.potentialSavings}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500">
                    Registrado {new Date(lead.createdAt).toLocaleDateString('es-AR')}
                  </span>
                  <select
                    value={lead.status}
                    onChange={(e) => updateSupplierLead(lead.id, { status: e.target.value as SupplierLead['status'] })}
                    className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="contacto_inicial">Contacto Inicial</option>
                    <option value="cotizacion_recibida">Cotización Recibida</option>
                    <option value="analizando">Comparando</option>
                    <option value="aprobado">Aprobado</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
