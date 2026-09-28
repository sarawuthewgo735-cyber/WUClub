import React from 'react';
import { CategorySummary } from '../types';
import { PlusCircle, CheckCircle2, ListChecks, Sparkles } from 'lucide-react';

interface ScoreHeroCardProps {
  totalScore: number;
  totalTarget: number;
  categories: CategorySummary[];
  onOpenAddDeed: () => void;
  onScrollToTable: () => void;
}

export const ScoreHeroCard: React.FC<ScoreHeroCardProps> = ({
  totalScore,
  totalTarget,
  categories,
  onOpenAddDeed,
  onScrollToTable,
}) => {
  const completedCount = categories.filter((c) => c.isComplete).length;
  const isAllComplete = completedCount === categories.length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-200 border border-indigo-400/30">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center text-center">
        {/* Title Header */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/20 mb-6">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span className="text-sm sm:text-base font-medium text-white/95 tracking-wide">
            คะแนนความดีสะสมของคุณ
          </span>
        </div>

        {/* Central White Score Circle */}
        <div className="relative my-2 flex h-48 w-48 sm:h-56 sm:w-56 flex-col items-center justify-center rounded-full bg-white shadow-2xl shadow-indigo-900/30 ring-8 ring-white/20 transition-transform duration-300 hover:scale-105">
          <span className="text-4xl sm:text-5xl font-black text-indigo-600 tracking-tight">
            {Number.isInteger(totalScore) ? totalScore : totalScore.toFixed(2)}
          </span>
          <span className="mt-1 text-sm sm:text-base font-semibold text-slate-500">
            คะแนน
          </span>
        </div>

        {/* REPLACED BADGE: Replaced "ระดับ: เหรียญทอง (Gold)" with Good Deed Category Progress Summary */}
        <div className="mt-6 w-full max-w-md">
          {/* Category Quick Status Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm transition-all ${
                  cat.isComplete
                    ? 'bg-emerald-500/20 border-emerald-300/40 text-emerald-100'
                    : 'bg-white/10 border-white/20 text-white/90'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                <span>{cat.name}</span>
                <span className="font-bold opacity-90">
                  ({cat.currentScore.toFixed(1)})
                </span>
              </div>
            ))}
          </div>

          {/* Overall Status Banner */}
          <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 py-2.5 backdrop-blur-md border border-white/25 text-white shadow-sm font-semibold text-sm sm:text-base">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            <span>
              สถานะภาพรวม:{' '}
              {totalScore >= totalTarget ? (
                <strong className="text-emerald-200">ผ่านเกณฑ์เป้าหมาย ({completedCount}/{categories.length} ด้าน)</strong>
              ) : (
                <strong className="text-amber-200">สะสมต่ออีก {(totalTarget - totalScore).toFixed(2)} คะแนน</strong>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAddDeed}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-indigo-600 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            <PlusCircle className="h-5 w-5 text-indigo-600" />
            <span>บันทึกความดีเพิ่ม</span>
          </button>

          <button
            onClick={onScrollToTable}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700/60 px-5 py-2.5 font-medium text-white border border-white/20 backdrop-blur-sm shadow-sm transition-all hover:bg-indigo-700/80 active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            <ListChecks className="h-5 w-5 text-indigo-200" />
            <span>ดูคะแนนความดีแต่ละด้าน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
