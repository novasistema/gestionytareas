import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Check } from 'lucide-react';

export const EmployeeQuickSwitcher: React.FC = () => {
  const { allUsers, currentUser, switchActiveProfile } = useAuth();

  if (allUsers.length <= 1) return null;

  return (
    <div className="bg-zinc-950/80 border-b border-zinc-800/80 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between text-xs overflow-x-auto gap-2 sm:gap-3 no-scrollbar">
      <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-400 shrink-0">
        <Users className="w-3.5 h-3.5 text-amber-500" />
        <span className="font-semibold text-zinc-300 text-[11px] sm:text-xs">
          <span className="hidden sm:inline">Terminal Ferretería Bruzzone: </span>
          <span className="sm:hidden">Turno: </span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {allUsers.map((user) => {
          const isSelected = currentUser?.uid === user.uid;
          return (
            <button
              key={user.uid}
              onClick={() => switchActiveProfile(user)}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                user.status === 'disponible' ? 'bg-emerald-500' :
                user.status === 'ocupado' ? 'bg-amber-500' : 'bg-zinc-500'
              }`} />
              <span>{user.displayName.split(' ')[0]}</span>
              <span className={`text-[10px] uppercase font-mono ${isSelected ? 'text-zinc-900 opacity-80' : 'text-zinc-500'}`}>
                ({user.role})
              </span>
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
