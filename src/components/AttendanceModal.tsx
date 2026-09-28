import React, { useState } from 'react';
import { X, CheckCircle2, Award, UserCheck, AlertCircle } from 'lucide-react';
import { Activity, Member } from '../types';
import { DEFAULT_STUDENT_PROFILES } from '../utils/studentData';

interface AttendanceModalProps {
  activity: Activity;
  members: Member[];
  onClose: () => void;
  onConfirmAttendance: (activityId: string | number, checkedInStudentIds: string[]) => void;
  language: string;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  activity,
  members,
  onClose,
  onConfirmAttendance,
  language,
}) => {
  // Candidate students who registered
  const registeredCount = activity.currentParticipants || 4;
  
  // Build a roster of students registered for this event with matching student IDs
  const defaultList = Object.values(DEFAULT_STUDENT_PROFILES);
  const initialRoster = Array.from({ length: Math.max(4, Math.min(registeredCount, 8)) }, (_, i) => {
    if (i < defaultList.length) {
      const student = defaultList[i];
      return {
        studentId: student.id,
        name: student.name,
        major: `${student.major} ${student.year}`,
        isCheckedIn: (activity.attendanceList || []).includes(student.id) || i === 0,
      };
    }
    const studentId = `68101${(i + 1).toString().padStart(3, '0')}`;
    const matchedMember = members.find(m => m.studentId === studentId);
    return {
      studentId,
      name: matchedMember ? matchedMember.name : `นักศึกษา วลัยลักษณ์ ${i + 1}`,
      major: matchedMember ? matchedMember.major : 'สำนักวิชาสารสนเทศศาสตร์ ปี 1',
      isCheckedIn: (activity.attendanceList || []).includes(studentId),
    };
  });

  const [roster, setRoster] = useState(initialRoster);

  const toggleCheckIn = (studentId: string) => {
    setRoster(prev =>
      prev.map(item =>
        item.studentId === studentId ? { ...item, isCheckedIn: !item.isCheckedIn } : item
      )
    );
  };

  const checkInAll = () => {
    setRoster(prev => prev.map(item => ({ ...item, isCheckedIn: true })));
  };

  const handleSave = () => {
    const checkedIds = roster.filter(r => r.isCheckedIn).map(r => r.studentId);
    onConfirmAttendance(activity.id, checkedIds);
  };

  const checkedCount = roster.filter(r => r.isCheckedIn).length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto my-6 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
            <UserCheck size={26} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              {language === 'th' ? 'เช็คชื่อและยืนยันการรับคะแนนความดี' : 'Attendance & Score Verification'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {activity.title} • {activity.date}
            </p>
          </div>
        </div>

        {activity.goodnessCategory && activity.goodnessCategory !== '-' ? (
          <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-indigo-900 mb-5">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-indigo-600" />
              <span>
                {language === 'th' ? 'เกณฑ์คะแนนความดี:' : 'Goodness Reward:'}{' '}
                <strong>{activity.goodnessCategory}</strong> (+{activity.goodnessPoints} คะแนน)
              </span>
            </div>
            <span className="bg-white px-2.5 py-1 rounded-full text-indigo-700 font-bold text-xs shadow-xs">
              ยืนยันแล้ว {checkedCount}/{roster.length} คน
            </span>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-xs sm:text-sm text-amber-800 mb-5 flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600" />
            <span>{language === 'th' ? 'กิจกรรมนี้ไม่ได้ผูกคะแนนความดี (เช็คชื่อเพื่อบันทึกประวัติเข้าร่วม)' : 'No goodness points tied to this event'}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-800">
            {language === 'th' ? 'รายชื่อผู้ลงทะเบียนเข้าร่วม' : 'Registered Students'}
          </h4>
          <button
            type="button"
            onClick={checkInAll}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {language === 'th' ? '✓ เช็คชื่อทุกคน' : '✓ Check-in All'}
          </button>
        </div>

        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100 max-h-72 overflow-y-auto">
          {roster.map(student => (
            <div
              key={student.studentId}
              onClick={() => toggleCheckIn(student.studentId)}
              className={`p-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                student.isCheckedIn ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    student.isCheckedIn
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-gray-500'
                  }`}
                >
                  {student.isCheckedIn ? '✓' : student.name.charAt(0)}
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-gray-800">{student.name}</h5>
                  <p className="text-[11px] text-gray-500">{student.studentId} • {student.major}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  student.isCheckedIn
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-gray-500'
                }`}
              >
                {student.isCheckedIn
                  ? (language === 'th' ? 'เข้าเช็คชื่อแล้ว' : 'Checked-in')
                  : (language === 'th' ? 'ยังไม่เช็คชื่อ' : 'Pending')}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            {language === 'th' ? 'บันทึกการเช็คชื่อ' : 'Confirm Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};
