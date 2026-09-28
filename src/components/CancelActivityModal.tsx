import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Check, FileText } from 'lucide-react';

interface CancelActivityModalProps {
  isOpen: boolean;
  activityTitle: string;
  clubName?: string;
  language: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const PRESET_REASONS_TH = [
  'ติดเรียน / ติดสอบ',
  'ติดธุระด่วนกะทันหัน',
  'ปัญหาสุขภาพ / ไม่สบาย',
  'เวลาชนกับกิจกรรมอื่น',
  'การเดินทางไม่สะดวก',
  'อื่นๆ (ระบุเอง)',
];

const PRESET_REASONS_EN = [
  'Class / Exam Conflict',
  'Urgent Personal Matter',
  'Health Issue / Unwell',
  'Time Conflict with Other Event',
  'Transportation Issue',
  'Other (Specify)',
];

export const CancelActivityModal: React.FC<CancelActivityModalProps> = ({
  isOpen,
  activityTitle,
  clubName,
  language,
  onConfirm,
  onCancel,
}) => {
  const isTh = language === 'th';
  const presets = isTh ? PRESET_REASONS_TH : PRESET_REASONS_EN;

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset('');
      setCustomReason('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setErrorMessage('');
  };

  const handleConfirm = () => {
    const trimmedCustom = customReason.trim();
    const isOther = selectedPreset === 'อื่นๆ (ระบุเอง)' || selectedPreset === 'Other (Specify)';

    if (!selectedPreset && !trimmedCustom) {
      setErrorMessage(
        isTh
          ? 'กรุณาเลือกหรือระบุเหตุผลการยกเลิก เพื่อแจ้งให้ชมรมทราบ'
          : 'Please select or provide a reason for cancellation.'
      );
      return;
    }

    if (isOther && !trimmedCustom) {
      setErrorMessage(
        isTh
          ? 'กรุณาระบุรายละเอียดเหตุผลของคุณในช่องข้อความ'
          : 'Please provide details for your reason in the text box.'
      );
      return;
    }

    let finalReason = '';
    if (isOther) {
      finalReason = trimmedCustom;
    } else if (selectedPreset && trimmedCustom) {
      finalReason = `${selectedPreset}: ${trimmedCustom}`;
    } else if (selectedPreset) {
      finalReason = selectedPreset;
    } else {
      finalReason = trimmedCustom;
    }

    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-gray-100 transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-rose-100 text-rose-600">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {isTh ? 'ยืนยันการยกเลิกกิจกรรม' : 'Confirm Activity Cancellation'}
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {isTh ? (
                <>
                  คุณต้องการยกเลิกการลงทะเบียนกิจกรรม
                  <span className="font-semibold text-gray-900 block mt-0.5">"{activityTitle}"</span>
                  ใช่หรือไม่?
                </>
              ) : (
                <>
                  Are you sure you want to cancel registration for
                  <span className="font-semibold text-gray-900 block mt-0.5">"{activityTitle}"</span>?
                </>
              )}
            </p>
            <p className="text-xs text-rose-600 font-medium mt-1">
              {isTh
                ? 'ระบบจะลดจำนวนผู้เข้าร่วมลง 1 คนทันที และส่งเหตุผลแจ้งไปยังชมรม'
                : 'Participant count will decrease by 1 and the reason will be reported to the club.'}
              {clubName && <span className="font-bold"> ({clubName})</span>}
            </p>
          </div>
        </div>

        {/* ส่วนระบุเหตุผล */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <FileText size={14} className="text-rose-500" />
            <span>{isTh ? 'กรุณาระบุเหตุผลที่ขอยกเลิก (จำเป็น)' : 'Reason for Cancellation (Required)'}</span>
            <span className="text-rose-500">*</span>
          </label>

          {/* Quick choices */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {presets.map((preset) => {
              const isSelected = selectedPreset === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`text-left text-xs p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <span className="truncate pr-1">{preset}</span>
                  {isSelected && <Check size={14} className="text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Textarea for custom reason or more details */}
          <div className="mt-2">
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={
                isTh
                  ? selectedPreset === 'อื่นๆ (ระบุเอง)'
                    ? 'กรุณาพิมพ์เหตุผลของคุณที่นี่...'
                    : 'ระบุรายละเอียดเพิ่มเติม (ถ้ามี) เช่น มีสอบย่อยกะทันหัน หรือติดงานกลุ่ม...'
                  : selectedPreset === 'Other (Specify)'
                  ? 'Please describe your reason here...'
                  : 'Additional details (optional)...'
              }
              className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition-colors text-gray-800"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 font-semibold mt-1.5 animate-in fade-in flex items-center gap-1">
              <span>⚠️ {errorMessage}</span>
            </p>
          )}

          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 flex items-start gap-2">
            <span className="text-rose-500 text-base leading-none">ℹ️</span>
            <span>
              {isTh
                ? 'ข้อมูลเหตุผลนี้จะถูกส่งไปยังแดชบอร์ดของชมรมผู้จัดกิจกรรมทันที เพื่อให้ชมรมนำไปปรับปรุงและบริหารจัดการจำนวนที่นั่ง'
                : 'This reason will be instantly dispatched to the club dashboard so coordinators can adjust attendance.'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {isTh ? 'ปิด' : 'Close'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md shadow-rose-200 bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>{isTh ? 'ยืนยันยกเลิกกิจกรรม' : 'Confirm Cancel'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
