import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Share, PlusSquare, X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already installed or dismissed, hide
  if (isInstalled || dismissed) {
    return null;
  }

  // Only show if installable on Android/Desktop or on iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Mobile Floating Install Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border-b border-amber-500/30 px-3 py-2.5 flex items-center justify-between text-xs gap-2 animate-in fade-in duration-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-zinc-100 truncate">
              Instala Ferretería Bruzzone en tu celular
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              Accede rápido desde el inicio y recibe notificaciones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isInstallable && (
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Share className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
            title="Cerrar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-100">
                <Smartphone className="w-4 h-4 text-amber-500" />
                <span>Instalar en iPhone o iPad</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-zinc-400 hover:text-zinc-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="p-2 rounded-lg bg-zinc-800 text-blue-400 font-bold shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-100">1. Toca el botón Compartir</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">En la barra inferior de Safari en tu iPhone.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 font-bold shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-100">2. "Agregar a pantalla de inicio"</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Desplázate hacia abajo y selecciona esta opción.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-zinc-100">3. ¡Listo!</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Tendrás el icono de Ferretería Bruzzone en tu pantalla principal.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
