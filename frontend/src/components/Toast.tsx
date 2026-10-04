import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Toast as ToastType } from '../types';

interface Props {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-green-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-blue-500" />,
  warning: <AlertTriangle size={18} className="text-yellow-500" />,
};

const borders = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  warning: 'border-l-yellow-400',
};

export default function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 bg-white rounded-xl shadow-lg px-4 py-3 border-l-4 ${borders[toast.type]} animate-slide-up`}
    >
      <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
      <p className="text-sm text-dark flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 text-dark/30 hover:text-dark transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

