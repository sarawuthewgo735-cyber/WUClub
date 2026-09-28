import React from 'react';
import { CategorySummary } from '../types';
import { CheckCircle2, Clock, Info, PlusCircle, Eye } from 'lucide-react';

interface CategoryTableProps {
  categories: CategorySummary[];
  totalTarget: number;
  totalScore: number;
  onSelectCategory: (catId: string) => void;
  onAddDeedForCategory: (catId: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  totalTarget,
  totalScore,
  onSelectCategory,
  onAddDeedForCategory,
}) => {
  const isTotalPassed = totalScore >= totalTarget;

  return (
    <div id="category-table-section" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all">
      {/* Table Header / Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-indigo-600 inline-block" />
            คะแนนความดี แต่ละด้าน
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            สรุปผลคะแนนสะสมเปรียบเทียบกับเป้าหมายที่กำหนดในแต่ละด้าน
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <Info className="h-3.5 w-3.5 text-slate-500" />
            เกณฑ์ผ่านรวม: {totalTarget} คะแนน
          </span>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 text-sm font-semibold">
              <th className="py-3 px-4 sm:px-6 w-5/12">ด้าน</th>
              <th className="py-3 px-4 sm:px-6 text-center w-2/12">เป้าหมาย</th>
              <th className="py-3 px-4 sm:px-6 text-center w-2.5/12">คะแนนรวม</th>
              <th className="py-3 px-4 sm:px-6 text-center w-2.5/12">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-base">
            {categories.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => onSelectCategory(item.id)}
              >
                {/* Category Name & Progress Bar */}
                <td className="py-4 px-4 sm:px-6 font-medium text-slate-800">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-indigo-600 hover:underline flex items-center gap-1"
                        title="ดูรายละเอียดรายการ"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        ดูรายละเอียด
                      </button>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(item.progressPercent, 100)}%`,
                          backgroundColor: item.color || '#4f46e5',
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Target */}
                <td className="py-4 px-4 sm:px-6 text-center font-medium text-slate-600">
                  {item.target}
                </td>

                {/* Total Score */}
                <td className="py-4 px-4 sm:px-6 text-center font-semibold text-slate-800">
                  {item.currentScore % 1 === 0
                    ? item.currentScore
                    : item.currentScore.toFixed(3)}
                </td>

                {/* Status */}
                <td className="py-4 px-4 sm:px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {item.isComplete ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-base">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ครบแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600 text-sm">
                        <Clock className="h-4 w-4 text-amber-500" />
                        ยังไม่ครบ ({item.currentScore.toFixed(1)}/{item.target})
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddDeedForCategory(item.id);
                      }}
                      className="ml-1 p-1 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                      title="เพิ่มคะแนนด้านนี้"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Footer Total Row matching Image 2 */}
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50/70 text-slate-900 font-bold text-base">
              <td className="py-4 px-4 sm:px-6 text-center sm:text-left font-bold text-slate-900">
                รวม
              </td>
              <td className="py-4 px-4 sm:px-6 text-center font-bold text-slate-800">
                {totalTarget}
              </td>
              <td className="py-4 px-4 sm:px-6 text-center font-bold text-slate-900 text-lg">
                {totalScore % 1 === 0 ? totalScore : totalScore.toFixed(2)}
              </td>
              <td className="py-4 px-4 sm:px-6 text-center">
                {isTotalPassed ? (
                  <span className="font-bold text-emerald-600 text-lg">
                    ผ่าน
                  </span>
                ) : (
                  <span className="font-bold text-amber-600 text-base">
                    ยังไม่ผ่าน
                  </span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
