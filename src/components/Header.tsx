import React from 'react';
import { Award, Plus, RotateCcw, Share2 } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onResetData: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onResetData,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              ระบบคะแนนความดี
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              ติดตามสรุปคะแนนความดีสะสมแยกตามด้าน
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="รีเซ็ตเป็นค่าเริ่มต้นจากรูปภาพ"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span className="hidden md:inline">คืนค่าเริ่มต้น</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="พิมพ / พิมพ์สรุปรายงาน"
          >
            <Share2 className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">พิมพ์รายงาน</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>บันทึกความดี</span>
          </button>
        </div>
      </div>
    </header>
  );
};
