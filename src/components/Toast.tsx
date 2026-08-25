import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-[99999] flex flex-col gap-2 max-w-sm w-auto sm:w-full dir-rtl pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between p-4 rounded-2xl bg-[#121928]/95 border border-[#232F46] shadow-2xl backdrop-blur-md animate-slide-up text-right pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            {t.type === 'success' && <CheckCircle size={20} className="text-emerald-400 shrink-0" />}
            {t.type === 'info' && <Info size={20} className="text-[#D97757] shrink-0" />}
            {t.type === 'error' && <AlertCircle size={20} className="text-rose-400 shrink-0" />}
            <span className="text-xs font-semibold text-white">{t.message}</span>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-white transition-colors mr-2"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
