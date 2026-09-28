import React, { useState } from 'react';
import { X, ShieldCheck, BookOpen, Clock, Award, FileText, CheckCircle2 } from 'lucide-react';
import { PolicyRule } from '../types';

interface PolicyModalProps {
  onClose: () => void;
  policies: PolicyRule[];
  language: string;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  onClose,
  policies,
  language,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const filteredPolicies = selectedSection === 'all'
    ? policies
    : policies.filter(p => p.section.includes(selectedSection));

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto my-6 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              {language === 'th' ? 'ระเบียบและข้อบังคับชมรม ม.วลัยลักษณ์' : 'Walailak University Club Policies'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {language === 'th'
                ? 'แนวปฏิบัติอย่างเป็นทางการสำหรับการจัดตั้งชมรม มาตรฐานความปลอดภัย และเกณฑ์คะแนนความดี'
                : 'Official guidelines for club founding, activity safety standards, and goodness criteria'}
            </p>
          </div>
        </div>

        {/* Categories / Quick Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedSection('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSection === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
            }`}
          >
            {language === 'th' ? 'ทั้งหมด' : 'All'}
          </button>
          <button
            onClick={() => setSelectedSection('หมวดที่ 1')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSection === 'หมวดที่ 1'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
            }`}
          >
            {language === 'th' ? 'หมวด 1: จัดตั้งชมรม' : 'Section 1: Founding'}
          </button>
          <button
            onClick={() => setSelectedSection('หมวดที่ 2')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSection === 'หมวดที่ 2'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
            }`}
          >
            {language === 'th' ? 'หมวด 2: ความปลอดภัย' : 'Section 2: Safety'}
          </button>
          <button
            onClick={() => setSelectedSection('หมวดที่ 3')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSection === 'หมวดที่ 3'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
            }`}
          >
            {language === 'th' ? 'หมวด 3: คะแนนความดี' : 'Section 3: Goodness'}
          </button>
        </div>

        {/* Policy list */}
        <div className="space-y-4">
          {filteredPolicies.map(policy => (
            <div
              key={policy.id}
              className="p-5 bg-slate-50 rounded-2xl border border-gray-200/80 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                  {policy.section}
                </span>
                <span className="text-[11px] text-gray-400">
                  {language === 'th' ? `อัปเดต: ${policy.updatedDate}` : `Updated: ${policy.updatedDate}`}
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-2">
                {policy.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {policy.content}
              </p>
            </div>
          ))}
        </div>

        {/* Five Pillars Summary Box */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100">
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
            <Award size={18} className="text-teal-600" />
            {language === 'th' ? 'สรุปเป้าหมายคะแนนความดี 5 ด้าน (ม.วลัยลักษณ์)' : '5 Goodness Pillars Target'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center mt-3">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-teal-100/50">
              <span className="text-xs font-bold text-pink-600 block">กตัญญู</span>
              <span className="text-xs text-gray-500">เป้าหมาย 10</span>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-xs border border-teal-100/50">
              <span className="text-xs font-bold text-blue-600 block">รู้วินัย</span>
              <span className="text-xs text-gray-500">เป้าหมาย 14</span>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-xs border border-teal-100/50">
              <span className="text-xs font-bold text-emerald-600 block">จิตอาสา</span>
              <span className="text-xs text-gray-500">เป้าหมาย 33</span>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-xs border border-teal-100/50">
              <span className="text-xs font-bold text-purple-600 block">ผู้นำ</span>
              <span className="text-xs text-gray-500">เป้าหมาย 33</span>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-xs border border-teal-100/50 col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-amber-600 block">รักชาติ</span>
              <span className="text-xs text-gray-500">เป้าหมาย 10</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            {language === 'th' ? 'รับทราบและปิด' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
