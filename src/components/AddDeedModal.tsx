import React, { useState } from 'react';
import { Category } from '../types';
import { X, Check, Calendar, Plus, Award } from 'lucide-react';

interface AddDeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialCategoryId?: string;
  onSave: (deed: {
    categoryId: string;
    title: string;
    score: number;
    date: string;
    notes?: string;
  }) => void;
}

export const AddDeedModal: React.FC<AddDeedModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialCategoryId,
  onSave,
}) => {
  if (!isOpen) return null;

  const [categoryId, setCategoryId] = useState<string>(
    initialCategoryId || categories[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [score, setScore] = useState<string>('5');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedScore = parseFloat(score);
    if (!title.trim() || isNaN(parsedScore) || parsedScore <= 0) return;

    onSave({
      categoryId,
      title: title.trim(),
      score: parsedScore,
      date,
      notes: notes.trim() || undefined,
    });

    // Reset and close
    setTitle('');
    setScore('5');
    setNotes('');
    onClose();
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                บันทึกคะแนนความดีใหม่
              </h3>
              <p className="text-xs text-slate-500">
                กรอกข้อมูลการทำความดีเพื่อเพิ่มคะแนนสะสม
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Select Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              เลือกด้านความดี *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (เป้าหมาย: {cat.target} คะแนน)
                </option>
              ))}
            </select>
            {selectedCategory && (
              <p className="mt-1 text-xs text-slate-500 italic">
                {selectedCategory.description}
              </p>
            )}
          </div>

          {/* Activity Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              ชือกิจกรรม / การทำความดี *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น เข้าร่วมกิจกรรมจิตอาสาทำความสะอาดชุมชน"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Score */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                คะแนนที่ได้รับ *
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-bold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                วันที่ทำกิจกรรม
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              หมายเหตุ / รายละเอียดเพิ่มเติม
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น มีรูปภาพประกอบหรือหนังสือรับรอง"
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <Check className="h-4 w-4" />
              บันทึกคะแนน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
