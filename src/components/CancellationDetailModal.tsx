import React from 'react';
import { X, UserX, Clock, FileText, AlertCircle } from 'lucide-react';
import { CancellationReport } from '../types';

interface CancellationDetailModalProps {
  isOpen: boolean;
  activityTitle: string;
  reports: CancellationReport[];
  language: string;
  onClose: () => void;
}

export const CancellationDetailModal: React.FC<CancellationDetailModalProps> = ({
  isOpen,
  activityTitle,
  reports,
  language,
  onClose,
}) => {
  if (!isOpen) return null;
  const isTh = language === 'th';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-gray-100 transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-rose-100 text-rose-600">
            <UserX size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {isTh ? 'รายชื่อและเหตุผลการยกเลิกกิจกรรม' : 'Cancellation Reports & Reasons'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                {reports.length} {isTh ? 'คน' : 'students'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {isTh ? 'กิจกรรม:' : 'Activity:'} <span className="font-semibold text-gray-800">{activityTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3 my-2">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <AlertCircle size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">
                {isTh ? 'ยังไม่มีนักศึกษายกเลิกกิจกรรมนี้' : 'No cancellations recorded for this activity.'}
              </p>
            </div>
          ) : (
            reports.map((report) => (
              <div 
                key={report.id} 
                className="p-4 rounded-2xl bg-slate-50 border border-gray-100 hover:border-rose-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {report.studentName?.slice(0, 2) || 'ST'}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <span>{report.studentName}</span>
                        <span className="text-xs text-gray-500 font-mono bg-white px-2 py-0.5 rounded-md border border-gray-200">
                          {report.studentId}
                        </span>
                      </div>
                      {report.studentMajor && (
                        <p className="text-[11px] text-gray-500">{report.studentMajor}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 sm:text-right shrink-0">
                    <Clock size={12} />
                    <span>{report.timestamp}</span>
                  </div>
                </div>

                <div className="mt-2.5 p-3 rounded-xl bg-white border border-rose-100 text-xs text-gray-800 flex items-start gap-2 shadow-2xs">
                  <FileText size={15} className="text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold text-rose-700 block mb-0.5">
                      {isTh ? 'เหตุผลที่ระบุ:' : 'Reason stated:'}
                    </span>
                    <p className="text-gray-700 leading-relaxed font-medium">{report.reason}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold transition-colors cursor-pointer"
          >
            {isTh ? 'ปิดหน้าต่าง' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
