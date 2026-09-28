import React, { useState } from 'react';
import { X, Sparkles, Building2, User, BookOpen, Users, Phone, Mail } from 'lucide-react';
import { ClubProposal } from '../types';

interface ClubRegistrationModalProps {
  onClose: () => void;
  onSubmit: (proposal: Omit<ClubProposal, 'id' | 'submittedDate' | 'status'>) => void;
  language: string;
  studentName?: string;
  studentId?: string;
  studentMajor?: string;
  studentEmail?: string;
}

export const ClubRegistrationModal: React.FC<ClubRegistrationModalProps> = ({
  onClose,
  onSubmit,
  language,
  studentName,
  studentId,
  studentMajor,
  studentEmail,
}) => {
  const [clubName, setClubName] = useState('');
  const [category, setCategory] = useState('ไลฟ์สไตล์');
  const [description, setDescription] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [proposerName, setProposerName] = useState(studentName || 'นักศึกษา');
  const [proposerStudentId, setProposerStudentId] = useState(studentId || '68101001');
  const [proposerMajor, setProposerMajor] = useState(studentMajor || 'เทคโนโลยีสารสนเทศ ปี 2');
  const [proposerEmail, setProposerEmail] = useState(
    studentEmail || (studentId ? `${studentId.trim()}@mail.wu.ac.th` : 'student@mail.wu.ac.th')
  );
  const [foundingMembersText, setFoundingMembersText] = useState('1. นายสมชาย ใจดี\n2. นางสาวสมหญิง รักเรียน\n3. นายใจกล้า หาญชัย');
  const [error, setError] = useState('');

  const categories = ['ไลฟ์สไตล์', 'กีฬา', 'ศิลปะ', 'วิชาการ', 'จิตอาสา', 'บันเทิง'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim()) {
      setError(language === 'th' ? 'กรุณากรอกชื่อชมรมที่ต้องการจัดตั้ง' : 'Please enter club name');
      return;
    }
    if (!description.trim()) {
      setError(language === 'th' ? 'กรุณาระบุวัตถุประสงค์และรายละเอียดของชมรม' : 'Please enter description');
      return;
    }
    if (!advisor.trim()) {
      setError(language === 'th' ? 'กรุณาระบุอาจารย์ที่ปรึกษาชมรม' : 'Please specify club advisor');
      return;
    }

    const members = foundingMembersText
      .split('\n')
      .map(m => m.replace(/^[0-9]+[.)\s]*/, '').trim())
      .filter(m => m.length > 0);

    if (members.length < 3) {
      setError(language === 'th' ? 'ต้องมีผู้ร่วมก่อตั้งอย่างน้อย 3 คนตามระเบียบมหาวิทยาลัย' : 'At least 3 founding members are required');
      return;
    }

    if (proposerEmail && !proposerEmail.includes('@')) {
      setError(language === 'th' ? 'กรุณากรอกอีเมลที่ถูกต้องเพื่อรับข้อมูลยืนยันและรหัสผ่านชมรม' : 'Please provide a valid email to receive confirmation & credentials');
      return;
    }

    onSubmit({
      clubName: clubName.trim(),
      category,
      description: description.trim(),
      advisor: advisor.trim(),
      proposerName: proposerName.trim(),
      proposerStudentId: proposerStudentId.trim(),
      proposerMajor: proposerMajor.trim(),
      proposerEmail: proposerEmail.trim(),
      foundingMembers: members,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto my-6 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              {language === 'th' ? 'ยื่นคำขอจัดตั้งชมรมใหม่' : 'Propose New Club'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {language === 'th'
                ? 'คำขอจะถูกส่งต่อไปยังฝ่ายพัฒนานักศึกษาและ System Admin เพื่อพิจารณาอนุมัติ'
                : 'Your proposal will be reviewed by Student Affairs and System Admin'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
              {language === 'th' ? 'ชื่อชมรมที่ต้องการจัดตั้ง *' : 'Club Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={language === 'th' ? 'เช่น ชมรมพัฒนาซอฟต์แวร์และ AI (WU Tech)' : 'e.g., WU Tech & AI'}
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
                {language === 'th' ? 'หมวดหมู่ชมรม' : 'Category'}
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
                {language === 'th' ? 'อาจารย์ที่ปรึกษาชมรม *' : 'Club Advisor *'}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'th' ? 'ชื่อ-สกุล และสำนักวิชา' : 'Advisor name & school'}
                value={advisor}
                onChange={e => setAdvisor(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
              {language === 'th' ? 'วัตถุประสงค์และรายละเอียดกิจกรรมที่จะจัด *' : 'Objectives & Description *'}
            </label>
            <textarea
              rows={3}
              required
              placeholder={language === 'th' ? 'ระบุเป้าหมาย ประโยชน์ต่อนักศึกษา และกิจกรรมหลักที่วางแผนจัด...' : 'State goals, benefits, and planned activities...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <User size={16} className="text-indigo-600" />
              {language === 'th' ? 'ข้อมูลผู้ยื่นคำขอ (ผู้ประสานงานหลัก)' : 'Proposer Information'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-0.5">{language === 'th' ? 'ชื่อ-นามสกุล' : 'Name'}</label>
                <input
                  type="text"
                  value={proposerName}
                  onChange={e => setProposerName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-0.5">{language === 'th' ? 'รหัสนักศึกษา' : 'Student ID'}</label>
                <input
                  type="text"
                  value={proposerStudentId}
                  onChange={e => setProposerStudentId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-0.5">{language === 'th' ? 'สาขา / ชั้นปี' : 'Major & Year'}</label>
                <input
                  type="text"
                  value={proposerMajor}
                  onChange={e => setProposerMajor(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none"
                />
              </div>
            </div>

            {/* Email Field for Confirmation & Club Credentials */}
            <div className="pt-1">
              <label className="text-[11px] font-medium text-gray-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-indigo-900">
                  <Mail size={13} className="text-indigo-600" />
                  {language === 'th' ? 'อีเมลสำหรับรับผลการอนุมัติและรหัสผ่านชมรม *' : 'Email for Confirmation & Password *'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {language === 'th' ? 'เช่น อีเมลมหาวิทยาลัย (@mail.wu.ac.th)' : 'e.g. @mail.wu.ac.th'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="student@mail.wu.ac.th"
                  value={proposerEmail}
                  onChange={e => setProposerEmail(e.target.value)}
                  className="w-full bg-white border border-indigo-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none text-gray-800"
                />
                <Mail size={14} className="absolute left-3 top-2.5 text-indigo-400 pointer-events-none" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                {language === 'th'
                  ? '✉️ เมื่อฝ่ายพัฒนานักศึกษาอนุมัติ ระบบจะส่งอีเมลยืนยันพร้อมแนบรหัสผ่านบัญชีผู้ดูแลชมรมไปยังที่อยู่อีเมลนี้'
                  : '✉️ When approved, credentials and confirmation will be sent to this email.'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
              {language === 'th' ? 'รายชื่อสมาชิกผู้ร่วมก่อตั้ง (อย่างน้อย 3 คน คนละบรรทัด) *' : 'Founding Members (At least 3) *'}
            </label>
            <textarea
              rows={3}
              required
              value={foundingMembersText}
              onChange={e => setFoundingMembersText(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={16} />
              {language === 'th' ? 'ส่งคำขอจัดตั้งชมรม' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
