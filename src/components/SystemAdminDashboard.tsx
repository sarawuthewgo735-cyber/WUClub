import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Calendar,
  Users,
  Award,
  AlertCircle,
  Search,
  Eye,
  Plus,
  BookOpen,
  Filter,
  Check,
  X,
  MapPin,
  Trash2,
  Copy,
  KeyRound,
  Laptop,
  Trophy,
  Sparkles,
  Gamepad2,
  HeartHandshake,
  Music,
  Camera,
  Coffee,
  CheckCheck,
  RotateCcw,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import { Activity, Club, ClubProposal, PolicyRule } from '../types';

export const getCategoryIcon = (category: string = '', name: string = '') => {
  const text = (category + ' ' + name).toLowerCase();
  if (text.includes('ai') || text.includes('tech') || text.includes('ซอฟต์แวร์') || text.includes('สารสนเทศ') || text.includes('คอมพิวเตอร์') || text.includes('วิชาการ')) {
    return Laptop;
  }
  if (text.includes('กาแฟ') || text.includes('coffee') || text.includes('เครื่องดื่ม') || text.includes('อาหาร') || text.includes('cooking')) {
    return Coffee;
  }
  if (text.includes('กีฬา') || text.includes('วิ่ง') || text.includes('run') || text.includes('sport')) {
    return Trophy;
  }
  if (text.includes('เกม') || text.includes('game') || text.includes('บอร์ดเกม')) {
    return Gamepad2;
  }
  if (text.includes('ดนตรี') || text.includes('เพลง') || text.includes('music')) {
    return Music;
  }
  if (text.includes('ถ่ายภาพ') || text.includes('photo') || text.includes('กล้อง')) {
    return Camera;
  }
  if (text.includes('จิตอาสา') || text.includes('อาสา') || text.includes('volunteer')) {
    return HeartHandshake;
  }
  if (text.includes('ศิลปะ') || text.includes('art') || text.includes('สร้างสรรค์')) {
    return Sparkles;
  }
  return Users;
};

export const generateClubCredentials = (clubName: string) => {
  const nameLower = clubName.toLowerCase();
  let slug = 'club';
  if (nameLower.includes('ai') || nameLower.includes('tech') || nameLower.includes('ซอฟต์แวร์')) {
    slug = 'tech_ai';
  } else if (nameLower.includes('กาแฟ') || nameLower.includes('coffee')) {
    slug = 'coffee';
  } else if (nameLower.includes('วิ่ง') || nameLower.includes('run')) {
    slug = 'running';
  } else if (nameLower.includes('บอร์ดเกม') || nameLower.includes('game')) {
    slug = 'games';
  } else if (nameLower.includes('ดนตรี') || nameLower.includes('music')) {
    slug = 'music';
  } else if (nameLower.includes('อาสา') || nameLower.includes('volunteer')) {
    slug = 'volunteer';
  } else if (nameLower.includes('ถ่ายภาพ') || nameLower.includes('photo')) {
    slug = 'photo';
  } else {
    const englishMatch = clubName.match(/[a-zA-Z0-9]+/g);
    slug = englishMatch ? englishMatch.join('_').toLowerCase().slice(0, 10) : `new_${Math.floor(100 + Math.random() * 900)}`;
  }

  const username = `club_${slug}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const password = `wu_${slug.replace(/[^a-z0-9]/g, '').slice(0, 6)}${randomSuffix}`;
  return { username, password };
};

interface SystemAdminDashboardProps {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
  proposals: ClubProposal[];
  setProposals: React.Dispatch<React.SetStateAction<ClubProposal[]>>;
  policies: PolicyRule[];
  setPolicies: React.Dispatch<React.SetStateAction<PolicyRule[]>>;
  language: string;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  currentNavTab?: string;
  onNavTabChange?: (tab: string) => void;
  onAddClubCredential?: (username: string, cred: { password: string; name: string; isNew?: boolean }) => void;
  onResetStorage?: () => void;
}

export const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({
  activities,
  setActivities,
  clubs,
  setClubs,
  proposals,
  setProposals,
  policies,
  setPolicies,
  language,
  onShowToast,
  currentNavTab,
  onNavTabChange,
  onAddClubCredential,
  onResetStorage,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity_approvals' | 'club_proposals' | 'manage_clubs' | 'policies'>('overview');
  const [credentialsModal, setCredentialsModal] = useState<{
    clubName: string;
    category: string;
    proposerName: string;
    proposerStudentId: string;
    proposerEmail?: string;
    advisor: string;
    username: string;
    password: string;
    emailSent?: boolean;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (currentNavTab === 'admin_activities') setActiveTab('activity_approvals');
    else if (currentNavTab === 'admin_proposals') setActiveTab('club_proposals');
    else if (currentNavTab === 'admin_clubs') setActiveTab('manage_clubs');
    else if (currentNavTab === 'admin_policies') setActiveTab('policies');
    else if (currentNavTab === 'admin_dashboard') setActiveTab('overview');
  }, [currentNavTab]);

  const handleTabSwitch = (tab: 'overview' | 'activity_approvals' | 'club_proposals' | 'manage_clubs' | 'policies') => {
    setActiveTab(tab);
    if (onNavTabChange) {
      if (tab === 'overview') onNavTabChange('admin_dashboard');
      else if (tab === 'activity_approvals') onNavTabChange('admin_activities');
      else if (tab === 'club_proposals') onNavTabChange('admin_proposals');
      else if (tab === 'manage_clubs') onNavTabChange('admin_clubs');
      else if (tab === 'policies') onNavTabChange('admin_policies');
    }
  };
  const [selectedProposal, setSelectedProposal] = useState<ClubProposal | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTargetType, setRejectTargetType] = useState<'activity' | 'proposal'>('activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [clubSubTab, setClubSubTab] = useState<'active' | 'trash'>('active');
  const [clubToDelete, setClubToDelete] = useState<Club | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<Club | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityStatusFilter, setActivityStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // New policy state
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    section: 'หมวดที่ 1: การจัดตั้งและบริหารงานชมรม',
    content: '',
  });

  const pendingActivities = activities.filter(a => a.status === 'pending');
  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const totalStudents = clubs.reduce((acc, c) => acc + (c.members || 0), 0);

  // Approval handlers
  const handleApproveActivity = (activityId: string | number) => {
    setActivities(prev =>
      prev.map(act => (act.id === activityId ? { ...act, status: 'approved' } : act))
    );
    onShowToast(
      language === 'th' ? 'อนุมัติกิจกรรมเรียบร้อยแล้ว กิจกรรมจะแสดงสู่สาธารณะ' : 'Activity approved successfully',
      'success'
    );
    setSelectedActivity(null);
  };

  const handleDeleteActivity = (activity: Activity) => {
    setActivities(prev => prev.filter(act => act.id !== activity.id));
    setActivityToDelete(null);
    onShowToast(
      language === 'th'
        ? `ลบกิจกรรม "${activity.title}" ออกจากระบบเรียบร้อยแล้ว`
        : `Activity "${activity.title}" deleted successfully`,
      'info'
    );
  };

  const filteredActivities = activities.filter(act => {
    const matchesFilter = activityStatusFilter === 'all' || act.status === activityStatusFilter;
    const matchesSearch = !activitySearchQuery.trim() ||
      act.title.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
      act.club.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
      (act.location && act.location.toLowerCase().includes(activitySearchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleOpenRejectActivity = (act: Activity) => {
    setSelectedActivity(act);
    setRejectTargetType('activity');
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleApproveProposal = (proposal: ClubProposal) => {
    // Generate official club credentials
    const { username, password } = generateClubCredentials(proposal.clubName);
    const categoryIcon = getCategoryIcon(proposal.category, proposal.clubName);
    const targetEmail = proposal.proposerEmail || `${proposal.proposerStudentId}@mail.wu.ac.th`;

    // 1. Mark proposal as approved and save credentials & emailSent flag
    setProposals(prev =>
      prev.map(p =>
        p.id === proposal.id
          ? {
              ...p,
              status: 'approved',
              credentials: { username, password },
              proposerEmail: targetEmail,
              emailSent: true,
            }
          : p
      )
    );

    // 2. Add to active clubs with category icon and new club tag
    const newClub: Club = {
      id: Date.now(),
      name: proposal.clubName,
      icon: categoryIcon,
      category: proposal.category,
      members: Math.max(proposal.foundingMembers?.length || 5, 5),
      likes: 1,
      comments: [
        { id: 1, user: 'ฝ่ายพัฒนานักศึกษา', text: 'ยินดีต้อนรับชมรมใหม่สู่มหาวิทยาลัยวลัยลักษณ์ 🎉' }
      ],
      desc: proposal.description,
      img: 'https://placehold.co/600x400/c7d2fe/312e81?text=' + encodeURIComponent(proposal.clubName),
      status: 'approved',
      advisor: proposal.advisor,
      founder: `${proposal.proposerName} (${proposal.proposerStudentId})`,
      tag: 'ชมรมเปิดใหม่',
      isNew: true,
    };

    setClubs(prev => [newClub, ...prev]);

    // 3. Register credentials to system login registry
    if (onAddClubCredential) {
      onAddClubCredential(username, {
        password,
        name: proposal.clubName,
        isNew: true,
      });
    }

    // 4. Open credentials dialog
    setCredentialsModal({
      clubName: proposal.clubName,
      category: proposal.category,
      proposerName: proposal.proposerName,
      proposerStudentId: proposal.proposerStudentId,
      proposerEmail: targetEmail,
      advisor: proposal.advisor,
      username,
      password,
      emailSent: true,
    });

    onShowToast(
      language === 'th'
        ? `อนุมัติ "${proposal.clubName}" สำเร็จ และส่งข้อมูลยืนยันพร้อมรหัสผ่านไปที่ ${targetEmail} แล้ว!`
        : `Approved "${proposal.clubName}" & dispatched confirmation and login credentials to ${targetEmail}!`,
      'success'
    );
    setSelectedProposal(null);
  };

  const handleOpenRejectProposal = (prop: ClubProposal) => {
    setSelectedProposal(prop);
    setRejectTargetType('proposal');
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (rejectTargetType === 'activity' && selectedActivity) {
      setActivities(prev =>
        prev.map(act =>
          act.id === selectedActivity.id
            ? { ...act, status: 'rejected', rejectReason: rejectReason || 'ไม่ผ่านเกณฑ์มาตรฐานมหาวิทยาลัย' }
            : act
        )
      );
      onShowToast(
        language === 'th' ? 'ส่งผลการปฏิเสธกิจกรรมพร้อมข้อเสนอแนะแล้ว' : 'Activity rejected with feedback',
        'info'
      );
    } else if (rejectTargetType === 'proposal' && selectedProposal) {
      setProposals(prev =>
        prev.map(p =>
          p.id === selectedProposal.id
            ? { ...p, status: 'rejected', adminNotes: rejectReason || 'ไม่ผ่านเกณฑ์การจัดตั้งชมรม' }
            : p
        )
      );
      onShowToast(
        language === 'th' ? 'ปฏิเสธคำขอจัดตั้งชมรมเรียบร้อยแล้ว' : 'Proposal rejected',
        'info'
      );
    }
    setShowRejectModal(false);
  };

  const handleToggleClubStatus = (clubId: string | number) => {
    setClubs(prev =>
      prev.map(c => {
        if (c.id === clubId) {
          const newStatus = c.status === 'suspended' ? 'approved' : 'suspended';
          onShowToast(
            newStatus === 'suspended'
              ? (language === 'th' ? `ระงับการดำเนินงานชมรม "${c.name}" ชั่วคราว` : `Club suspended`)
              : (language === 'th' ? `ปลดระงับและเปิดการดำเนินงานชมรม "${c.name}"` : `Club activated`),
            'info'
          );
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const handleDeleteClub = (club: Club) => {
    setClubs(prev =>
      prev.map(c => {
        if (c.id === club.id) {
          return {
            ...c,
            status: 'deleted',
            deletedAt: Date.now(),
            previousStatus: c.status !== 'deleted' ? c.status : 'approved',
          };
        }
        return c;
      })
    );
    setClubToDelete(null);
    onShowToast(
      language === 'th'
        ? `ลบชมรม "${club.name}" เรียบร้อยแล้ว ย้ายไปที่ถังขยะ (สามารถกู้คืนได้ภายใน 3 วัน)`
        : `Club "${club.name}" moved to trash. Can be restored within 3 days.`,
      'info'
    );
  };

  const handleRestoreClub = (clubId: string | number) => {
    const target = clubs.find(c => c.id === clubId);
    setClubs(prev =>
      prev.map(c => {
        if (c.id === clubId) {
          const restoredStatus = (c.previousStatus && c.previousStatus !== 'deleted') ? c.previousStatus : 'approved';
          const updated = { ...c, status: restoredStatus };
          delete updated.deletedAt;
          delete updated.previousStatus;
          return updated;
        }
        return c;
      })
    );
    onShowToast(
      language === 'th'
        ? `กู้คืนชมรม "${target?.name || ''}" สำเร็จ! ชมรมกลับมาแสดงในระบบนักศึกษาตามปกติ`
        : `Club restored successfully and is now active for students.`,
      'success'
    );
  };

  const handlePermanentDeleteClub = (clubId: string | number) => {
    const target = clubs.find(c => c.id === clubId);
    setClubs(prev => prev.filter(c => c.id !== clubId));
    setPermanentDeleteTarget(null);
    onShowToast(
      language === 'th'
        ? `ลบชมรม "${target?.name || ''}" ถาวรเรียบร้อยแล้ว`
        : `Club permanently deleted.`,
      'info'
    );
  };

  const getRecoveryTimeInfo = (deletedAt?: number) => {
    if (!deletedAt) return { text: language === 'th' ? '3 วัน' : '3 days', isExpired: false, percent: 100 };
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - deletedAt;
    const remaining = THREE_DAYS_MS - elapsed;
    if (remaining <= 0) {
      return { text: language === 'th' ? 'หมดระยะเวลากู้คืน (เกิน 3 วัน)' : 'Recovery window expired', isExpired: true, percent: 0 };
    }
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    let text = '';
    if (days > 0) {
      text = language === 'th' ? `เหลือเวลา ${days} วัน ${hours} ชม.` : `${days}d ${hours}h left`;
    } else if (hours > 0) {
      text = language === 'th' ? `เหลือเวลา ${hours} ชม. ${minutes} นาที` : `${hours}h ${minutes}m left`;
    } else {
      text = language === 'th' ? `เหลือเวลา ${Math.max(1, minutes)} นาที` : `${Math.max(1, minutes)}m left`;
    }
    const percent = Math.max(0, Math.min(100, Math.round((remaining / THREE_DAYS_MS) * 100)));
    return { text, isExpired: false, percent };
  };

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicy.title.trim() || !newPolicy.content.trim()) return;

    const created: PolicyRule = {
      id: `pol-${Date.now()}`,
      title: newPolicy.title.trim(),
      section: newPolicy.section,
      content: newPolicy.content.trim(),
      updatedDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setPolicies(prev => [...prev, created]);
    setShowAddPolicy(false);
    setNewPolicy({ title: '', section: 'หมวดที่ 1: การจัดตั้งและบริหารงานชมรม', content: '' });
    onShowToast(language === 'th' ? 'เพิ่มข้อบังคับและประกาศใหม่เรียบร้อยแล้ว' : 'Policy published', 'success');
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>{language === 'th' ? 'ระบบผู้ดูแลส่วนกลาง (System Administrator)' : 'System Admin Portal'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{language === 'th' ? 'Local Storage: บันทึกข้อมูลถาวร' : 'Local Storage: Active'}</span>
              {onResetStorage && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(language === 'th' ? 'ต้องการคืนค่าข้อมูลเริ่มต้นของระบบทั้งหมดใช่หรือไม่? ข้อมูลชมรมและกิจกรรมที่สร้างใหม่จะถูกล้างกลับสู่ค่าตัวอย่าง' : 'Reset all system clubs and activities to factory default?')) {
                      onResetStorage();
                    }
                  }}
                  className="ml-1 px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-semibold cursor-pointer transition-colors"
                  title={language === 'th' ? 'รีเซ็ตข้อมูลตัวอย่าง' : 'Reset sample data'}
                >
                  {language === 'th' ? 'รีเซ็ต' : 'Reset'}
                </button>
              )}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
            {language === 'th' ? 'ศูนย์ควบคุมและอนุมัติระบบ' : 'Admin Operations & Approvals'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {language === 'th'
              ? 'กำกับดูแลกิจกรรม ตรวจสอบคำขอจัดตั้งชมรม และจัดการนโยบายส่วนกลาง มหาวิทยาลัยวลัยลักษณ์'
              : 'Institutional oversight, proposal approvals, and policy governance at Walailak University'}
          </p>
        </div>

        {/* Quick Tabs Nav */}
        <div className="flex p-1 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-x-auto max-w-full">
          <button
            onClick={() => handleTabSwitch('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'th' ? 'ภาพรวม' : 'Overview'}
          </button>
          <button
            onClick={() => handleTabSwitch('activity_approvals')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
              activeTab === 'activity_approvals' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'th' ? 'อนุมัติกิจกรรม' : 'Activities'}
            {pendingActivities.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingActivities.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabSwitch('club_proposals')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
              activeTab === 'club_proposals' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'th' ? 'คำขอจัดตั้งชมรม' : 'Club Proposals'}
            {pendingProposals.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {pendingProposals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabSwitch('manage_clubs')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'manage_clubs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'th' ? 'จัดการชมรม' : 'All Clubs'}
          </button>
          <button
            onClick={() => handleTabSwitch('policies')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'policies' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'th' ? 'นโยบายและเกณฑ์' : 'Policies'}
          </button>
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Building2 size={20} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{language === 'th' ? 'ชมรมทั้งหมด' : 'Total Clubs'}</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{clubs.length}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Calendar size={20} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{language === 'th' ? 'กิจกรรมในระบบ' : 'Total Activities'}</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{activities.length}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{language === 'th' ? 'สมาชิกรวม' : 'Total Memberships'}</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{totalStudents}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs bg-amber-50/30">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <p className="text-xs text-amber-800 font-medium">{language === 'th' ? 'กิจกรรมรออนุมัติ' : 'Pending Activities'}</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{pendingActivities.length}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs bg-rose-50/30 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                <AlertCircle size={20} />
              </div>
              <p className="text-xs text-rose-800 font-medium">{language === 'th' ? 'คำขอจัดตั้งชมรม' : 'Pending Clubs'}</p>
              <p className="text-2xl font-black text-rose-700 mt-1">{pendingProposals.length}</p>
            </div>
          </div>

          {/* Action Queues Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Activities Quick Review */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base md:text-lg text-gray-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  {language === 'th' ? 'กิจกรรมที่รอการพิจารณาอนุมัติ' : 'Pending Activity Approvals'}
                </h3>
                <button
                  onClick={() => handleTabSwitch('activity_approvals')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  {language === 'th' ? 'ดูทั้งหมด' : 'View all'} ({pendingActivities.length})
                </button>
              </div>

              {pendingActivities.length > 0 ? (
                <div className="space-y-3">
                  {pendingActivities.slice(0, 3).map(act => (
                    <div key={act.id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">{act.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{act.club} • {act.date}</p>
                        {act.goodnessCategory && act.goodnessCategory !== '-' && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            +{act.goodnessPoints} {act.goodnessCategory}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleApproveActivity(act.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          {language === 'th' ? 'อนุมัติ' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleOpenRejectActivity(act)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          {language === 'th' ? 'ปฏิเสธ' : 'Reject'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivityToDelete(act)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={language === 'th' ? 'ลบกิจกรรม' : 'Delete Activity'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                  <p className="text-sm font-medium">{language === 'th' ? 'ไม่มีกิจกรรมค้างตรวจสอบในระบบ' : 'No pending activities'}</p>
                </div>
              )}
            </div>

            {/* Pending Proposals Quick Review */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base md:text-lg text-gray-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  {language === 'th' ? 'คำขอจัดตั้งชมรมใหม่จากนักศึกษา' : 'New Club Proposals'}
                </h3>
                <button
                  onClick={() => handleTabSwitch('club_proposals')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  {language === 'th' ? 'ดูทั้งหมด' : 'View all'} ({pendingProposals.length})
                </button>
              </div>

              {pendingProposals.length > 0 ? (
                <div className="space-y-3">
                  {pendingProposals.slice(0, 3).map(prop => (
                    <div key={prop.id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">{prop.clubName}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {prop.category} • ยื่นโดย: {prop.proposerName}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">อ.ที่ปรึกษา: {prop.advisor}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleApproveProposal(prop)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          {language === 'th' ? 'อนุมัติ' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleOpenRejectProposal(prop)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          {language === 'th' ? 'ปฏิเสธ' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                  <p className="text-sm font-medium">{language === 'th' ? 'ไม่มีคำขอจัดตั้งชมรมค้างตรวจสอบ' : 'No pending proposals'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ACTIVITY APPROVALS */}
      {activeTab === 'activity_approvals' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {language === 'th' ? 'ตรวจสอบและอนุมัติกิจกรรมชมรม' : 'Activity Approval Queue'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {language === 'th' ? 'กิจกรรมที่ได้รับอนุมัติจะปรากฏในหน้าค้นหากิจกรรมของนักศึกษาทันที สามารถอนุมัติ ปฏิเสธ หรือลบกิจกรรมได้' : 'Review, approve, reject, or delete club activities across the campus'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                {pendingActivities.length} {language === 'th' ? 'รายการรออนุมัติ' : 'Pending'}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {language === 'th' ? 'ทั้งหมด' : 'Total'} {activities.length} {language === 'th' ? 'กิจกรรม' : 'events'}
              </span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto">
              <button
                type="button"
                onClick={() => setActivityStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activityStatusFilter === 'all'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'th' ? 'ทั้งหมด' : 'All'} ({activities.length})
              </button>
              <button
                type="button"
                onClick={() => setActivityStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activityStatusFilter === 'pending'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{language === 'th' ? 'รออนุมัติ' : 'Pending'}</span>
                {pendingActivities.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                    {pendingActivities.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActivityStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activityStatusFilter === 'approved'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'th' ? 'อนุมัติแล้ว' : 'Approved'} ({activities.filter(a => a.status === 'approved').length})
              </button>
              <button
                type="button"
                onClick={() => setActivityStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activityStatusFilter === 'rejected'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'th' ? 'ปฏิเสธ' : 'Rejected'} ({activities.filter(a => a.status === 'rejected').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={activitySearchQuery}
                onChange={e => setActivitySearchQuery(e.target.value)}
                placeholder={language === 'th' ? 'ค้นหากิจกรรม, ชมรม, สถานที่...' : 'Search activities, clubs, venues...'}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              {activitySearchQuery && (
                <button
                  type="button"
                  onClick={() => setActivitySearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-gray-100 text-xs font-semibold text-gray-500">
                <tr>
                  <th className="py-3 px-4">{language === 'th' ? 'กิจกรรม / ชมรม' : 'Activity / Club'}</th>
                  <th className="py-3 px-4">{language === 'th' ? 'วันเวลาและสถานที่' : 'Date & Venue'}</th>
                  <th className="py-3 px-4">{language === 'th' ? 'คะแนนความดี' : 'Goodness'}</th>
                  <th className="py-3 px-4">{language === 'th' ? 'สถานะ' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{language === 'th' ? 'ดำเนินการ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredActivities.map(act => (
                  <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-800">{act.title}</div>
                      <div className="text-xs text-indigo-600 font-medium mt-0.5">{act.club}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">
                      <div>{act.date}</div>
                      <div className="text-gray-400 mt-0.5">{act.location || 'มหาวิทยาลัยวลัยลักษณ์'}</div>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      {act.goodnessCategory && act.goodnessCategory !== '-' ? (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                          +{act.goodnessPoints} {act.goodnessCategory}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {act.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                          {language === 'th' ? 'อนุมัติแล้ว' : 'Approved'}
                        </span>
                      ) : act.status === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs" title={act.rejectReason}>
                          {language === 'th' ? 'ปฏิเสธ' : 'Rejected'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs animate-pulse">
                          {language === 'th' ? 'รออนุมัติ' : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {act.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveActivity(act.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                              {language === 'th' ? 'อนุมัติ' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleOpenRejectActivity(act)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              {language === 'th' ? 'ปฏิเสธ' : 'Reject'}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 font-mono mr-1">
                            {act.status === 'approved' ? '✓ เผยแพร่แล้ว' : '✕ ไม่อนุมัติ'}
                          </span>
                        )}

                        {/* Delete Activity Button */}
                        <button
                          type="button"
                          onClick={() => setActivityToDelete(act)}
                          className="px-2.5 py-1.5 text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                          title={language === 'th' ? 'ลบกิจกรรมนี้ออกจากระบบ' : 'Delete this activity'}
                        >
                          <Trash2 size={13} />
                          <span>{language === 'th' ? 'ลบ' : 'Delete'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredActivities.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">
                        {language === 'th' ? 'ไม่พบกิจกรรมตามเงื่อนไขที่เลือก' : 'No activities found matching criteria'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: CLUB PROPOSALS */}
      {activeTab === 'club_proposals' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {language === 'th' ? 'คำขอจัดตั้งชมรมใหม่จากนักศึกษา' : 'Club Founding Proposals'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {language === 'th'
                  ? 'ตรวจสอบรายชื่อผู้ร่วมก่อตั้ง วัตถุประสงค์ และอาจารย์ที่ปรึกษาตามระเบียบมหาวิทยาลัย'
                  : 'Review founding members, goals, and faculty advisor compliance'}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
              {pendingProposals.length} {language === 'th' ? 'คำขอรอพิจารณา' : 'Pending Requests'}
            </span>
          </div>

          <div className="space-y-4">
            {proposals.map(prop => (
              <div
                key={prop.id}
                className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-gray-200/80 hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        {prop.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        ยื่นเมื่อ: {prop.submittedDate}
                      </span>
                      {prop.status === 'approved' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                          {language === 'th' ? 'อนุมัติจัดตั้งแล้ว' : 'Approved'}
                        </span>
                      )}
                      {prop.status === 'rejected' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                          {language === 'th' ? 'ปฏิเสธคำขอ' : 'Rejected'}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{prop.clubName}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed max-w-3xl">
                      {prop.description}
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                      <div>
                        <strong>{language === 'th' ? 'อาจารย์ที่ปรึกษา:' : 'Advisor:'}</strong> {prop.advisor}
                      </div>
                      <div>
                        <strong>{language === 'th' ? 'ผู้ยื่นคำขอ:' : 'Proposer:'}</strong> {prop.proposerName} ({prop.proposerStudentId})
                      </div>
                      <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                        <strong>{language === 'th' ? 'อีเมลรับรหัสผ่าน:' : 'Notification Email:'}</strong>{' '}
                        <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <Mail size={12} className="text-indigo-600" />
                          {prop.proposerEmail || `${prop.proposerStudentId}@mail.wu.ac.th`}
                        </span>
                        {prop.emailSent && (
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Check size={10} />
                            {language === 'th' ? 'ส่งรหัสผ่านแล้ว' : 'Email Sent'}
                          </span>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <strong>{language === 'th' ? 'ผู้ร่วมก่อตั้ง:' : 'Founders:'}</strong>{' '}
                        {prop.foundingMembers.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {prop.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveProposal(prop)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <Check size={16} />
                          {language === 'th' ? 'อนุมัติจัดตั้ง' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleOpenRejectProposal(prop)}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <X size={16} />
                          {language === 'th' ? 'ปฏิเสธ' : 'Reject'}
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                          {prop.status === 'approved' ? '✓ อนุมัติแล้ว' : '✕ ไม่อนุมัติ'}
                        </span>
                        {prop.status === 'approved' && prop.credentials && (
                          <button
                            onClick={() => {
                              setCredentialsModal({
                                clubName: prop.clubName,
                                category: prop.category,
                                proposerName: prop.proposerName,
                                proposerStudentId: prop.proposerStudentId,
                                proposerEmail: prop.proposerEmail || `${prop.proposerStudentId}@mail.wu.ac.th`,
                                advisor: prop.advisor,
                                username: prop.credentials!.username,
                                password: prop.credentials!.password,
                                emailSent: true,
                              });
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <KeyRound size={14} />
                            <span>{language === 'th' ? 'ดูรหัสเข้าสู่ระบบ' : 'View Credentials'}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: MANAGE CLUBS */}
      {activeTab === 'manage_clubs' && (() => {
        const activeClubs = clubs.filter(c => c.status !== 'deleted');
        const deletedClubs = clubs.filter(c => c.status === 'deleted');
        const filteredActiveClubs = activeClubs.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const filteredDeletedClubs = deletedClubs.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {language === 'th' ? 'การจัดการบัญชีรายชื่อชมรม' : 'Club Directory Governance'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {language === 'th' ? 'ตรวจสอบสถานะ ระงับการใช้งาน หรือลบชมรม (สามารถกู้คืนได้ภายใน 3 วัน)' : 'Manage, suspend, or delete clubs with 3-day recovery safeguard'}
                </p>
              </div>
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder={language === 'th' ? 'ค้นหาชื่อชมรม...' : 'Search clubs...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none"
                />
              </div>
            </div>

            {/* Sub Tabs: Active vs Deleted/Trash */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4 mb-6">
              <button
                type="button"
                onClick={() => setClubSubTab('active')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  clubSubTab === 'active'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                <Building2 size={16} />
                <span>{language === 'th' ? 'ชมรมที่ดำเนินงาน' : 'Active Clubs'}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${clubSubTab === 'active' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {activeClubs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setClubSubTab('trash')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  clubSubTab === 'trash'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                <Trash2 size={16} />
                <span>{language === 'th' ? 'ถังขยะชมรม (กู้คืนได้ภายใน 3 วัน)' : 'Trash (3-Day Recovery)'}</span>
                {deletedClubs.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-rose-100 text-rose-700 font-bold">
                    {deletedClubs.length}
                  </span>
                )}
              </button>
            </div>

            {/* Active Clubs Table */}
            {clubSubTab === 'active' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-gray-100 text-xs font-semibold text-gray-500">
                    <tr>
                      <th className="py-3 px-4">{language === 'th' ? 'ชื่อชมรม' : 'Club Name'}</th>
                      <th className="py-3 px-4">{language === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                      <th className="py-3 px-4">{language === 'th' ? 'สมาชิก' : 'Members'}</th>
                      <th className="py-3 px-4">{language === 'th' ? 'สถานะชมรม' : 'Status'}</th>
                      <th className="py-3 px-4 text-right">{language === 'th' ? 'จัดการ' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredActiveClubs.length > 0 ? (
                      filteredActiveClubs.map(club => (
                        <tr key={club.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-4 font-bold text-gray-800">
                            {club.name}
                            {club.advisor && (
                              <div className="text-xs text-gray-400 font-normal mt-0.5">ที่ปรึกษา: {club.advisor}</div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs">
                            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                              {club.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-mono text-gray-600">
                            {club.members} {language === 'th' ? 'คน' : 'people'}
                          </td>
                          <td className="py-4 px-4">
                            {club.status === 'suspended' ? (
                              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs">
                                {language === 'th' ? 'ถูกระงับชั่วคราว' : 'Suspended'}
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                                {language === 'th' ? 'เปิดใช้งานปกติ' : 'Active'}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleClubStatus(club.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                  club.status === 'suspended'
                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                }`}
                              >
                                {club.status === 'suspended'
                                  ? (language === 'th' ? 'ปลดระงับ' : 'Reactivate')
                                  : (language === 'th' ? 'ระงับชมรม' : 'Suspend')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setClubToDelete(club)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center gap-1"
                                title={language === 'th' ? 'ลบชมรม (สามารถกู้คืนได้ภายใน 3 วัน)' : 'Delete club (recoverable within 3 days)'}
                              >
                                <Trash2 size={13} />
                                <span>{language === 'th' ? 'ลบชมรม' : 'Delete'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                          {language === 'th' ? 'ไม่พบข้อมูลชมรม' : 'No clubs found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Deleted Clubs / Trash Table */}
            {clubSubTab === 'trash' && (
              <div>
                <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold">
                      {language === 'th' ? '🛡️ ระบบป้องกันความผิดพลาด (นโยบายกู้คืนภายใน 3 วัน): ' : '🛡️ 3-Day Grace Period Safeguard: '}
                    </span>
                    {language === 'th'
                      ? 'ชมรมที่ถูกลบจะถูกซ่อนออกจากหน้านักศึกษาทันที แต่ข้อมูลจะยังคงถูกเก็บรักษาไว้เป็นเวลา 3 วัน (72 ชั่วโมง) ก่อนระบบจะลบถาวร ผู้ดูแลสามารถกด "กู้คืนชมรม" ได้ตลอดเวลาหากต้องการนำชมรมกลับมาเปิดให้บริการ'
                      : 'Deleted clubs are immediately hidden from the student portal, but retained here for 3 days (72 hours). You can restore them anytime to undo accidental deletions.'}
                  </div>
                </div>

                {filteredDeletedClubs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-gray-100 text-xs font-semibold text-gray-500">
                        <tr>
                          <th className="py-3 px-4">{language === 'th' ? 'ชื่อชมรม' : 'Club Name'}</th>
                          <th className="py-3 px-4">{language === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                          <th className="py-3 px-4">{language === 'th' ? 'เวลาที่ลบ' : 'Deleted At'}</th>
                          <th className="py-3 px-4">{language === 'th' ? 'ระยะเวลากู้คืนที่เหลือ' : 'Recovery Window'}</th>
                          <th className="py-3 px-4 text-right">{language === 'th' ? 'การจัดการ' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredDeletedClubs.map(club => {
                          const timeInfo = getRecoveryTimeInfo(club.deletedAt);
                          const deletedDateStr = club.deletedAt
                            ? new Date(club.deletedAt).toLocaleString('th-TH', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-';

                          return (
                            <tr key={club.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-4 px-4 font-bold text-gray-800">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400 line-through">{club.name}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                    {language === 'th' ? 'ถูกลบ' : 'Deleted'}
                                  </span>
                                </div>
                                {club.advisor && (
                                  <div className="text-xs text-gray-400 font-normal mt-0.5">ที่ปรึกษา: {club.advisor}</div>
                                )}
                              </td>
                              <td className="py-4 px-4 text-xs">
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-gray-600 font-medium">
                                  {club.category}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-xs font-mono text-gray-500">
                                {deletedDateStr}
                              </td>
                              <td className="py-4 px-4 text-xs">
                                <div className="space-y-1">
                                  <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full ${
                                    timeInfo.isExpired
                                      ? 'bg-gray-100 text-gray-500'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    <Clock size={12} />
                                    {timeInfo.text}
                                  </span>
                                  <div className="w-28 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${timeInfo.percent > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                      style={{ width: `${timeInfo.percent}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleRestoreClub(club.id)}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                                  >
                                    <RotateCcw size={13} />
                                    <span>{language === 'th' ? 'กู้คืนชมรม' : 'Restore'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPermanentDeleteTarget(club)}
                                    className="px-2.5 py-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                                    title={language === 'th' ? 'ลบถาวรทันที' : 'Delete permanently'}
                                  >
                                    {language === 'th' ? 'ลบถาวร' : 'Delete'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-400 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
                    <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-gray-700">
                      {language === 'th' ? 'ไม่มีรายการชมรมในถังขยะ' : 'No deleted clubs in trash'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {language === 'th' ? 'ชมรมที่ถูกลบทั้งหมดจะสามารถกู้คืนได้ที่นี่ภายใน 3 วัน' : 'Deleted clubs can be restored here within 3 days'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* VIEW: POLICIES */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {language === 'th' ? 'ข้อบังคับและเกณฑ์คะแนนความดี มหาวิทยาลัยวลัยลักษณ์' : 'University Policies & Criteria'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {language === 'th' ? 'ประกาศทางการที่เผยแพร่ให้นักศึกษาและชมรมยึดถือปฏิบัติ' : 'Official regulatory notices displayed to students and clubs'}
              </p>
            </div>
            <button
              onClick={() => setShowAddPolicy(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={16} />
              {language === 'th' ? 'เพิ่มระเบียบ/เกณฑ์ใหม่' : 'Add Policy'}
            </button>
          </div>

          <div className="space-y-4">
            {policies.map(pol => (
              <div key={pol.id} className="p-5 bg-slate-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {pol.section}
                  </span>
                  <span>อัปเดต: {pol.updatedDate}</span>
                </div>
                <h4 className="font-bold text-base text-gray-800 mb-1">{pol.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{pol.content}</p>
              </div>
            ))}
          </div>

          {/* Add Policy Modal */}
          {showAddPolicy && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-gray-100">
                <button
                  onClick={() => setShowAddPolicy(false)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {language === 'th' ? 'ประกาศระเบียบหรือเกณฑ์คะแนนใหม่' : 'Publish New Policy'}
                </h3>
                <form onSubmit={handleAddPolicy} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">หมวดหมู่</label>
                    <select
                      value={newPolicy.section}
                      onChange={e => setNewPolicy({ ...newPolicy, section: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    >
                      <option value="หมวดที่ 1: การจัดตั้งและบริหารงานชมรม">หมวดที่ 1: การจัดตั้งและบริหารงานชมรม</option>
                      <option value="หมวดที่ 2: ความปลอดภัยและเวลาการจัดกิจกรรม">หมวดที่ 2: ความปลอดภัยและเวลาการจัดกิจกรรม</option>
                      <option value="หมวดที่ 3: เกณฑ์การให้คะแนนความดี 5 ด้าน">หมวดที่ 3: เกณฑ์การให้คะแนนความดี 5 ด้าน</option>
                      <option value="หมวดที่ 4: สิทธิประโยชน์และการจัดสรรงบประมาณ">หมวดที่ 4: สิทธิประโยชน์และการจัดสรรงบประมาณ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">หัวข้อประกาศ</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น เกณฑ์การส่งรายงานผลกิจกรรมประจำปี"
                      value={newPolicy.title}
                      onChange={e => setNewPolicy({ ...newPolicy, title: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">เนื้อหาและข้อกำหนด</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="ระบุข้อกำหนด..."
                      value={newPolicy.content}
                      onChange={e => setNewPolicy({ ...newPolicy, content: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddPolicy(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
                    >
                      ประกาศนโยบาย
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setShowRejectModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {language === 'th' ? 'ระบุเหตุผลในการปฏิเสธ' : 'Specify Rejection Reason'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {language === 'th'
                ? 'ข้อความนี้จะถูกส่งกลับไปยังผู้ยื่นคำขอเพื่อนำไปแก้ไขหรือปรับปรุง'
                : 'This feedback will be sent back to the applicant'}
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder={language === 'th' ? 'เช่น ข้อมูลอาจารย์ที่ปรึกษายังไม่ครบถ้วน หรือช่วงเวลาจัดกิจกรรมทับซ้อน...' : 'e.g., Incomplete advisor documentation...'}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500/50 outline-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                {language === 'th' ? 'ยืนยันการปฏิเสธ' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Created / View Credentials Modal */}
      {credentialsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[130] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95">
            <button
              onClick={() => setCredentialsModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {language === 'th' ? 'อนุมัติจัดตั้งชมรมสำเร็จ' : 'Club Approved Successfully'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                  {credentialsModal.clubName}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">
              {language === 'th'
                ? 'ระบบได้สร้างบัญชีผู้ดูแลชมรม และบรรจุชมรมเข้าสู่ระบบแนะนำชมรมสำหรับนักศึกษาเรียบร้อยแล้ว ประธานชมรมสามารถใช้รหัสด้านล่างนี้ในการเข้าสู่ระบบจัดการชมรมได้ทันที'
                : 'Club registered and login credentials generated. The club is now featured in the student club recommendations.'}
            </p>

            {/* Credentials Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mb-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="text-xs font-semibold text-gray-500">{language === 'th' ? 'ชื่อผู้ขอจัดตั้ง / ประธานชมรม' : 'President'}:</span>
                <span className="text-xs font-bold text-gray-800">{credentialsModal.proposerName} ({credentialsModal.proposerStudentId})</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="text-xs font-semibold text-gray-500">{language === 'th' ? 'อาจารย์ที่ปรึกษา' : 'Advisor'}:</span>
                <span className="text-xs text-gray-700">{credentialsModal.advisor}</span>
              </div>

              {/* Email Delivery Notification Banner */}
              <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-start gap-2.5">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                  <Mail size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[11px] font-bold text-indigo-900">
                      {language === 'th' ? 'ส่งข้อมูลและรหัสผ่านไปยังอีเมลแล้ว' : 'Credentials Dispatched to Email'}
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Check size={10} />
                      {language === 'th' ? 'ส่งสำเร็จ' : 'Delivered'}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-medium text-indigo-800 truncate mt-0.5">
                    {credentialsModal.proposerEmail || `${credentialsModal.proposerStudentId}@mail.wu.ac.th`}
                  </p>
                  <p className="text-[10px] text-indigo-600/90 mt-1">
                    {language === 'th' 
                      ? 'ระบบได้ส่งอีเมลยืนยันผลการอนุมัติ พร้อม Username และ Password ให้ผู้ยื่นคำขอเรียบร้อยแล้ว' 
                      : 'Confirmation email containing credentials was successfully sent to the proposer.'}
                  </p>
                </div>
              </div>

              {/* Username field */}
              <div className="pt-1">
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  {language === 'th' ? 'ชื่อบัญชีเข้าสู่ระบบ (Club ID / Username)' : 'Club Username'}
                </label>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3.5 py-2">
                  <code className="text-sm font-mono font-bold text-indigo-700">{credentialsModal.username}</code>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(credentialsModal.username);
                      }
                      setCopiedKey('username');
                      setTimeout(() => setCopiedKey(null), 2000);
                      onShowToast(language === 'th' ? 'คัดลอกชื่อบัญชีแล้ว' : 'Copied username', 'info');
                    }}
                    className="p-1.5 hover:bg-slate-100 text-gray-500 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title="Copy Username"
                  >
                    {copiedKey === 'username' ? <CheckCheck size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    <span className="text-[11px]">{copiedKey === 'username' ? (language === 'th' ? 'คัดลอกแล้ว' : 'Copied') : (language === 'th' ? 'คัดลอก' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  {language === 'th' ? 'รหัสผ่านเข้าสู่ระบบ (Default Password)' : 'Default Password'}
                </label>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3.5 py-2">
                  <code className="text-sm font-mono font-bold text-emerald-700">{credentialsModal.password}</code>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(credentialsModal.password);
                      }
                      setCopiedKey('password');
                      setTimeout(() => setCopiedKey(null), 2000);
                      onShowToast(language === 'th' ? 'คัดลอกรหัสผ่านแล้ว' : 'Copied password', 'info');
                    }}
                    className="p-1.5 hover:bg-slate-100 text-gray-500 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title="Copy Password"
                  >
                    {copiedKey === 'password' ? <CheckCheck size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    <span className="text-[11px]">{copiedKey === 'password' ? (language === 'th' ? 'คัดลอกแล้ว' : 'Copied') : (language === 'th' ? 'คัดลอก' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  const targetEmail = credentialsModal.proposerEmail || `${credentialsModal.proposerStudentId}@mail.wu.ac.th`;
                  onShowToast(
                    language === 'th' 
                      ? `ส่งอีเมลรหัสผ่านซ้ำไปยัง ${targetEmail} เรียบร้อยแล้ว` 
                      : `Credentials email resent to ${targetEmail}`,
                    'info'
                  );
                }}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Resend confirmation email"
              >
                <Mail size={15} />
                <span>{language === 'th' ? 'ส่งอีเมลซ้ำ' : 'Resend Email'}</span>
              </button>
              <button
                onClick={() => {
                  const targetEmail = credentialsModal.proposerEmail || `${credentialsModal.proposerStudentId}@mail.wu.ac.th`;
                  const allText = `ข้อมูลบัญชีผู้ดูแลชมรม: ${credentialsModal.clubName}\nชื่อบัญชี (Username): ${credentialsModal.username}\nรหัสผ่าน (Password): ${credentialsModal.password}\nผู้ยื่น: ${credentialsModal.proposerName} (${credentialsModal.proposerStudentId})\nอีเมลผู้รับ: ${targetEmail}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(allText);
                  }
                  setCopiedKey('all');
                  setTimeout(() => setCopiedKey(null), 2000);
                  onShowToast(language === 'th' ? 'คัดลอกข้อมูลทั้งหมดเรียบร้อยแล้ว' : 'All credentials copied', 'success');
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedKey === 'all' ? <CheckCheck size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{language === 'th' ? 'คัดลอกข้อมูลทั้งหมด' : 'Copy All Details'}</span>
              </button>
              <button
                onClick={() => setCredentialsModal(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                {language === 'th' ? 'รับทราบและปิด' : 'Acknowledge & Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE ACTIVITY CONFIRMATION */}
      {activityToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <Trash2 size={28} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'th' ? 'ยืนยันการลบกิจกรรม' : 'Confirm Activity Deletion'}
            </h3>

            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 mb-4">
              <h4 className="font-bold text-gray-900 text-base">{activityToDelete.title}</h4>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                {language === 'th' ? 'จัดโดยชมรม:' : 'Organized by:'} {activityToDelete.club}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-gray-400" />
                  {activityToDelete.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-gray-400" />
                  {activityToDelete.location || 'มหาวิทยาลัยวลัยลักษณ์'}
                </span>
                {activityToDelete.goodnessCategory && activityToDelete.goodnessCategory !== '-' && (
                  <span className="flex items-center gap-1 text-indigo-600 font-bold">
                    <Award size={13} />
                    +{activityToDelete.goodnessPoints} {activityToDelete.goodnessCategory}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 space-y-2 mb-6">
              <div className="flex items-start gap-2 text-rose-700 font-medium">
                <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'th'
                    ? 'คำเตือน: กิจกรรมนี้จะถูกลบออกจากระบบอย่างถาวร จะไม่แสดงในปฏิทินหรือหน้ารายการกิจกรรมของนักศึกษาอีกต่อไป'
                    : 'Warning: This activity will be permanently deleted from the system and will no longer appear on student portals or calendars.'}
                </span>
              </div>
              {activityToDelete.currentParticipants > 0 && (
                <div className="flex items-start gap-2 text-amber-700 font-medium bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                  <Users size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    {language === 'th'
                      ? `มีนักศึกษาลงทะเบียนเข้าร่วมกิจกรรมนี้แล้ว ${activityToDelete.currentParticipants} คน การลบจะยกเลิกการลงทะเบียนทั้งหมด`
                      : `${activityToDelete.currentParticipants} students currently registered. Deleting will cancel all registrations.`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActivityToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteActivity(activityToDelete)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={15} />
                <span>{language === 'th' ? 'ยืนยันลบกิจกรรม' : 'Confirm Delete Activity'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CLUB CONFIRMATION (3-Day Grace Period) */}
      {clubToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <Trash2 size={28} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'th' ? 'ยืนยันการลบชมรม' : 'Confirm Club Deletion'}
            </h3>
            <p className="text-sm font-semibold text-gray-800 bg-rose-50/70 p-3 rounded-xl border border-rose-100 mb-4">
              {clubToDelete.name} ({clubToDelete.category})
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 space-y-2 mb-6">
              <div className="flex items-start gap-2 text-gray-700 font-medium">
                <span className="text-rose-500 font-bold">•</span>
                <span>{language === 'th' ? 'ชมรมนี้จะถูกซ่อนออกจากหน้านักศึกษาทันที กิจกรรมของชมรมจะไม่แสดงสู่สาธารณะ' : 'This club and its activities will be immediately hidden from the student portal.'}</span>
              </div>
              <div className="flex items-start gap-2 text-emerald-700 font-medium bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'th'
                    ? 'ระบบป้องกันความผิดพลาด: ข้อมูลจะถูกเก็บไว้ใน "ถังขยะชมรม" และสามารถกดกู้คืนได้ภายใน 3 วัน (72 ชั่วโมง) ก่อนระบบลบถาวร'
                    : 'Safeguard active: Data is moved to trash and can be restored anytime within 3 days (72 hours).'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setClubToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClub(clubToDelete)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={15} />
                <span>{language === 'th' ? 'ยืนยันการลบ (กู้คืนได้ภายใน 3 วัน)' : 'Confirm Delete (3-Day Recovery)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PERMANENT DELETE CONFIRMATION */}
      {permanentDeleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {language === 'th' ? 'ลบชมรมอย่างถาวรทันที?' : 'Permanently Delete Club?'}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              {language === 'th'
                ? `คุณแน่ใจหรือไม่ว่าต้องการลบชมรม "${permanentDeleteTarget.name}" อย่างถาวร? การกระทำนี้ไม่สามารถย้อนกลับหรือกู้คืนได้อีก`
                : `Are you sure you want to permanently delete "${permanentDeleteTarget.name}"? This action cannot be undone.`}
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPermanentDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDeleteClub(permanentDeleteTarget.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                {language === 'th' ? 'ยืนยันลบถาวร' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
