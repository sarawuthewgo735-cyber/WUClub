import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const duration = toast.duration || 3500;
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Unconditional auto-dismiss timer so it NEVER gets stuck
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onRemove(toast.id);
      }, 250);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onRemove]);

  const handleManualClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 150);
  };

  let bg = 'bg-slate-900 text-white';
  let icon = <Info className="text-blue-400 shrink-0" size={18} />;
  let barBg = 'bg-blue-400/60';

  if (toast.type === 'success') {
    bg = 'bg-emerald-600 text-white';
    icon = <CheckCircle2 className="text-white shrink-0" size={18} />;
    barBg = 'bg-white/50';
  } else if (toast.type === 'error') {
    bg = 'bg-rose-600 text-white';
    icon = <AlertCircle className="text-white shrink-0" size={18} />;
    barBg = 'bg-white/50';
  } else if (toast.type === 'warning') {
    bg = 'bg-amber-600 text-white';
    icon = <AlertCircle className="text-white shrink-0" size={18} />;
    barBg = 'bg-white/50';
  }

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-black/20 border border-white/20 ${bg} transition-all duration-200 text-xs sm:text-sm font-medium ${
        isExiting ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-in slide-in-from-top-3'
      }`}
    >
      <div className="flex items-center gap-2.5 flex-1 pr-2">
        {icon}
        <span className="leading-snug break-words">{toast.message}</span>
      </div>
      <button
        onClick={handleManualClose}
        aria-label="ปิดการแจ้งเตือน"
        className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer shrink-0"
      >
        <X size={16} />
      </button>

      {/* Visual progress line */}
      <div
        className={`absolute bottom-0 left-0 h-1 ${barBg}`}
        style={{
          width: '100%',
          animation: `shrinkWidth ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[300] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};
