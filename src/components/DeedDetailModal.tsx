import React from 'react';
import { CategorySummary, DeedLog } from '../types';
import { X, Trash2, Calendar, PlusCircle, CheckCircle2, Award } from 'lucide-react';

interface DeedDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategorySummary | null;
  logs: DeedLog[];
  onDeleteLog: (logId: string) => void;
  onAddLogClick: (catId: string) => void;
}

export const DeedDetailModal: React.FC<DeedDetailModalProps> = ({
  isOpen,
  onClose,
  category,
  logs,
  onDeleteLog,
  onAddLogClick,
}) => {
  if (!isOpen || !category) return null;

  const categoryLogs = logs.filter((log) => log.categoryId === category.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div
          className="p-6 text-white flex items-center justify-between"
          style={{ backgroundColor: category.color || '#4f46e5' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-white/90" />
              <h3 className="text-xl font-bold">{category.name}</h3>
            </div>
            <p className="text-xs text-white/80 mt-1 max-w-md">
              {category.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-black/20 p-1.5 text-white hover:bg-black/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress summary banner */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-xs text-slate-500 block">คะแนนสะสม</span>
              <span className="font-bold text-slate-800 text-lg">
                {category.currentScore % 1 === 0
                  ? category.currentScore
                  : category.currentScore.toFixed(3)}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-500 block">เป้าหมาย</span>
              <span className="font-bold text-slate-700 text-lg">
                {category.target}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {category.isComplete ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-700 text-xs">
                <CheckCircle2 className="h-4 w-4" /> ครบตามเป้าหมายแล้ว
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800 text-xs">
                ขาดอีก {(category.target - category.currentScore).toFixed(2)} คะแนน
              </span>
            )}

            <button
              onClick={() => {
                onClose();
                onAddLogClick(category.id);
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              เพิ่มรายการ
            </button>
          </div>
        </div>

        {/* Logs List Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            ประวัติการบันทึกกิจกรรม ({categoryLogs.length} รายการ)
          </h4>

          {categoryLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">ยังไม่มีรายการบันทึกในด้านนี้</p>
              <button
                onClick={() => {
                  onClose();
                  onAddLogClick(category.id);
                }}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
              >
                + เพิ่มรายการแรกเลย
              </button>
            </div>
          ) : (
            categoryLogs.map((log) => (
              <div
                key={log.id}
                className="group flex items-start justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:border-slate-200 transition-all"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-base">
                      {log.title}
                    </span>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
                      +{log.score % 1 === 0 ? log.score : log.score.toFixed(3)} คะแนน
                    </span>
                  </div>
                  {log.notes && (
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {log.notes}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{log.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteLog(String(log.id))}
                  className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors opacity-80 group-hover:opacity-100"
                  title="ลบรายการนี้"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
