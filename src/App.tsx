import React, { useState, useEffect, useRef, useMemo } from 'react';
import Markdown from 'react-markdown';
import { 
    Utensils, Activity as ActivityIcon, Dices, Camera, Music, HeartHandshake,
    Search, Home, Calendar, Users, Bot, Sparkles, X, Send,
    ArrowRight, Bell, ChevronRight, ChevronLeft, ArrowLeft, MapPin, ClipboardList,
    Bookmark, LogOut, Clock, Heart, Footprints, MessageCircle,
    Star, Award, BookOpen, User, CheckCircle2, Edit, Trash2,
    Languages, ShieldCheck, FileText, UserCheck, Plus, Building2, AlertCircle, UserX,
    LogIn, ExternalLink
} from 'lucide-react';

import { ClubProposal, PolicyRule, AppNotification, Activity, Club, Member, CancellationReport } from './types';
import { INITIAL_POLICIES, INITIAL_PROPOSALS, INITIAL_NOTIFICATIONS } from './data/extendedData';
import { SystemAdminDashboard, getCategoryIcon } from './components/SystemAdminDashboard';
import { ClubRegistrationModal } from './components/ClubRegistrationModal';
import { PolicyModal } from './components/PolicyModal';
import { AttendanceModal } from './components/AttendanceModal';
import { ConfirmModal } from './components/ConfirmModal';
import { CancelActivityModal } from './components/CancelActivityModal';
import { CancellationDetailModal } from './components/CancellationDetailModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
    STORAGE_KEYS, 
    getStorageItem, 
    setStorageItem, 
    saveClubsToStorage, 
    loadClubsFromStorage, 
    loadActivitiesFromStorage, 
    clearAllWuStorage 
} from './utils/storage';
import { 
    StudentProfile, 
    DEFAULT_STUDENT_PROFILES, 
    getStudentProfile 
} from './utils/studentData';
import {
    INITIAL_GOODNESS_HISTORY_BY_STUDENT,
    INITIAL_GOODNESS_STATS_BY_STUDENT,
    getStudentGoodnessHistory,
    getStudentGoodnessStats,
    GoodnessHistoryItem,
    GoodnessCategoryStat
} from './utils/studentGoodnessData';

const translateCategory = (cat, lang) => {
    if (lang === 'th') return cat;
    const map = {
        'การมีจิตอาสา': 'Volunteering',
        'การพัฒนาภาวะผู้นำ': 'Leadership',
        'การรู้วินัย': 'Discipline',
        'ความกตัญญู': 'Gratitude',
        'ความรักชาติ': 'Patriotism',
        'ไลฟ์สไตล์': 'Lifestyle',
        'กีฬา': 'Sports',
        'บันเทิง': 'Entertainment',
        'ศิลปะ': 'Arts',
        'วิชาการ': 'Academics',
        'จิตอาสา': 'Volunteering',
        'ทั้งหมด': 'All'
    };
    return map[cat] || cat;
};

const CATEGORIES = ['ไลฟ์สไตล์', 'กีฬา', 'บันเทิง', 'ศิลปะ', 'วิชาการ', 'จิตอาสา'];

// --- เพิ่ม likes, comments, และ status เข้าไปในข้อมูลตั้งต้น ---
const INITIAL_CLUBS = [
    { id: 1, name: 'ชมรมทำอาหาร', icon: Utensils, category: 'ไลฟ์สไตล์', members: 50, likes: 85, comments: [{id: 1, user: 'สมหญิง รักเรียน', text: 'อยากทำเค้กเป็นจังเลยค่ะ'}], desc: 'รวมพลคนชอบเข้าครัว ไม่ว่าจะทำอาหารคาวหรือหวาน มาแชร์สูตรและลงมือทำไปด้วยกัน', img: 'https://placehold.co/600x400/fecdd3/881337?text=Cooking+Club', status: 'approved', advisor: 'อ.อร่อย ดีเลิศ (สำนักวิชาการจัดการ)' },
    { id: 2, name: 'ชมรมวิ่ง (WU Run)', icon: ActivityIcon, category: 'กีฬา', members: 350, likes: 210, comments: [], desc: 'เพื่อสุขภาพที่ดี วิ่งรอบสระน้ำวลัยลักษณ์ทุกเย็นวันพุธและศุกร์', img: 'https://placehold.co/600x400/bbf7d0/14532d?text=Running+Club', status: 'approved', advisor: 'ผศ.ดร.ว่องไว แข็งแรง (สำนักวิชาสหเวชศาสตร์)' },
    { id: 3, name: 'ชมรมบอร์ดเกม', icon: Dices, category: 'บันเทิง', members: 85, likes: 42, comments: [{id: 1, user: 'ใจกล้า หาญชัย', text: 'มีเกม Werewolf ไหมครับ'}], desc: 'ผ่อนคลายความเครียดจากการเรียน มาลับสมองและทำความรู้จักเพื่อนใหม่ผ่านบอร์ดเกม', img: 'https://placehold.co/600x400/fef08a/713f12?text=Board+Games', status: 'approved', advisor: 'อ.ปัญญา เลิศคิด (สำนักวิชาสารสนเทศศาสตร์)' },
    { id: 4, name: 'ชมรมถ่ายภาพ', icon: Camera, category: 'ศิลปะ', members: 210, likes: 156, comments: [], desc: 'สอนตั้งแต่พื้นฐานจนถึงขั้นโปร ออกทริปถ่ายภาพสถานที่สวยๆ ในมอ', img: 'https://placehold.co/600x400/e9d5ff/4c1d95?text=Photo+Club', status: 'approved', advisor: 'ผศ.ศิลป์ สร้างสรรค์ (สำนักวิชาสถาปัตยกรรมศาสตร์)' },
    { id: 5, name: 'ชมรมดนตรีสากล', icon: Music, category: 'ศิลปะ', members: 400, likes: 320, comments: [], desc: 'เล่นดนตรี ร้องเพลง ฟอร์มวงเพื่อแสดงในงานต่างๆ ของมหาวิทยาลัย', img: 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Music+Club', status: 'approved', advisor: 'อ.ไพเราะ เสนาะจิต (ศูนย์วัฒนธรรม)' },
    { id: 6, name: 'ชมรมอาสาพัฒนา', icon: HeartHandshake, category: 'จิตอาสา', members: 500, likes: 450, comments: [{id: 1, user: 'สมชาย ใจดี', text: 'ชมรมนี้ได้ทำกิจกรรมดีๆ เยอะมาก แนะนำเลย'}], desc: 'ทำกิจกรรมเพื่อสังคม พัฒนาโรงเรียนและชุมชนรอบข้าง', img: 'https://placehold.co/600x400/fed7aa/7c2d12?text=Volunteer+Club', status: 'approved', advisor: 'ดร.เกื้อกูล สังคม (ฝ่ายพัฒนานักศึกษา)' },
];

const formatRelativeThaiDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const INITIAL_ACTIVITIES = [
    { id: 1, title: 'Wailailak Run for Fun', date: formatRelativeThaiDate(2), club: 'ชมรมวิ่ง (WU Run)', tag: 'แนะนำ', category: 'กีฬา', goodnessCategory: 'การพัฒนาภาวะผู้นำ', goodnessPoints: 50, currentParticipants: 40, maxParticipants: 80, likes: 120, comments: [{id: 1, user: 'มานี มีนา', text: 'ไปวิ่งด้วยคนค่ะ'}], img: 'https://placehold.co/600x300/a7f3d0/065f46?text=Run+For+Fun', status: 'approved', location: 'รอบสระน้ำวลัยลักษณ์' },
    { id: 2, title: 'เวิร์คช็อปทำเค้กวันเกิด', date: formatRelativeThaiDate(5), club: 'ชมรมทำอาหาร', tag: 'กิจกรรมใหม่', category: 'ไลฟ์สไตล์', goodnessCategory: 'การรู้วินัย', goodnessPoints: 10, currentParticipants: 18, maxParticipants: 20, likes: 65, comments: [], img: 'https://placehold.co/600x300/fbcfe8/831843?text=Cake+Workshop', status: 'approved', location: 'ห้องปฏิบัติการอาหาร อาคารปฏิบัติการ 3' },
    { id: 3, title: 'Boardgame Night', date: formatRelativeThaiDate(8), club: 'ชมรมบอร์ดเกม', tag: 'กำลังฮิต', category: 'บันเทิง', goodnessCategory: 'การมีจิตอาสา', goodnessPoints: 5, currentParticipants: 15, maxParticipants: 30, likes: 34, comments: [{id: 1, user: 'ใจกล้า หาญชัย', text: 'เจอกันครับทุกคน'}], img: 'https://placehold.co/600x300/fde047/854d0e?text=Boardgame+Night', status: 'approved', location: 'ลานกิจกรรม อาคารไทยบุรี' },
    { id: 4, title: 'ทริปถ่ายภาพเมืองเก่า', date: formatRelativeThaiDate(14), club: 'ชมรมถ่ายภาพ', tag: 'น่าสนใจ', category: 'ศิลปะ', goodnessCategory: 'ความกตัญญู', goodnessPoints: 15, currentParticipants: 12, maxParticipants: 25, likes: 88, comments: [], img: 'https://placehold.co/600x300/e9d5ff/4c1d95?text=Photo+Trip', status: 'approved', location: 'ย่านเมืองเก่านครศรีธรรมราช' },
    { id: 5, title: 'Music Festival', date: formatRelativeThaiDate(20), club: 'ชมรมดนตรีสากล', tag: 'ใหญ่มาก', category: 'ศิลปะ', goodnessCategory: 'การพัฒนาภาวะผู้นำ', goodnessPoints: 30, currentParticipants: 150, maxParticipants: 300, likes: 250, comments: [], img: 'https://placehold.co/600x300/bfdbfe/1e3a8a?text=Music+Festival', status: 'approved', location: 'หอประชุมใหญ่ อาคารไทยบุรี' },
    { id: 6, title: 'ค่ายอาสาพัฒนาโรงเรียน', date: formatRelativeThaiDate(27), club: 'ชมรมอาสาพัฒนา', tag: 'แนะนำ', category: 'จิตอาสา', goodnessCategory: 'การมีจิตอาสา', goodnessPoints: 60, currentParticipants: 45, maxParticipants: 50, likes: 300, comments: [], img: 'https://placehold.co/600x300/fed7aa/7c2d12?text=Volunteer+Camp', status: 'approved', location: 'โรงเรียนบ้านดอนคาก อ.ท่าศาลา' },
    // กิจกรรมรออนุมัติสำหรับผู้ดูแลระบบทดสอบ Approval Workflow
    { id: 7, title: 'WU Acoustic Night 2026', date: formatRelativeThaiDate(32), club: 'ชมรมดนตรีสากล', tag: 'รออนุมัติ', category: 'ศิลปะ', goodnessCategory: 'การพัฒนาภาวะผู้นำ', goodnessPoints: 20, currentParticipants: 0, maxParticipants: 100, likes: 0, comments: [], img: 'https://placehold.co/600x300/bfdbfe/1e3a8a?text=Acoustic+Night', status: 'pending', location: 'ลานเวทีกิจกรรม อาคารกิจกรรมนักศึกษา' },
    { id: 8, title: 'แข่งสตรีทบาสเกตบอล 3x3 ต้านยาเสพติด', date: formatRelativeThaiDate(36), club: 'ชมรมวิ่ง (WU Run)', tag: 'รออนุมัติ', category: 'กีฬา', goodnessCategory: 'การรู้วินัย', goodnessPoints: 15, currentParticipants: 0, maxParticipants: 60, likes: 0, comments: [], img: 'https://placehold.co/600x300/bbf7d0/14532d?text=Street+Basketball', status: 'pending', location: 'สนามบาสเกตบอลกลางแจ้ง' },
];

const MOCK_NAMES = ['นายสมชาย ใจดี', 'นางสาวสมหญิง รักเรียน', 'นายใจกล้า หาญชัย', 'นางสาวมานี มีนา', 'นายสมศักดิ์ มักจะ', 'นางสาวกานดา นารี', 'นายวิทวัส เก่งการ', 'นางสาววิไลลักษณ์ สมศรี', 'นายเจษฎา ปัญญาไว', 'นางสาวพิมพา น่ารัก'];
const MOCK_MAJORS = ['เทคโนโลยีสารสนเทศ ปี 1', 'เทคโนโลยีสารสนเทศ ปี 2', 'วิศวกรรมคอมพิวเตอร์ ปี 1', 'วิศวกรรมคอมพิวเตอร์ ปี 2', 'บัญชี ปี 1', 'บัญชี ปี 2', 'นิเทศศาสตร์ ปี 1', 'นิเทศศาสตร์ ปี 2'];

const INITIAL_MEMBERS = INITIAL_CLUBS.flatMap(club => 
    Array.from({ length: club.members }, (_, i) => ({
        id: `${club.id}-${i + 1}`,
        clubName: club.name,
        studentId: `6810${(i + 1).toString().padStart(3, '0')}`,
        name: MOCK_NAMES[i % MOCK_NAMES.length] + (i >= MOCK_NAMES.length ? ` ${i + 1}` : ''),
        major: MOCK_MAJORS[i % MOCK_MAJORS.length],
        joinDate: `${(i % 28) + 1} มิ.ย. 2026`,
        status: 'ปกติ',
        role: i === 0 ? 'ประธาน' : i === 1 ? 'รองประธาน' : i === 2 ? 'เหรัญญิก' : 'สมาชิก'
    }))
);



const CLUB_CREDENTIALS = {
    'club_cooking': { password: 'wu_cooking26', name: 'ชมรมทำอาหาร' },
    'club_run': { password: 'wu_run26', name: 'ชมรมวิ่ง (WU Run)' },
    'club_boardgame': { password: 'wu_boardgame26', name: 'ชมรมบอร์ดเกม' },
    'club_photo': { password: 'wu_photo26', name: 'ชมรมถ่ายภาพ' },
    'club_music': { password: 'wu_music26', name: 'ชมรมดนตรีสากล' },
    'club_volunteer': { password: 'wu_volunteer26', name: 'ชมรมอาสาพัฒนา' },
};

const ADMIN_CREDENTIALS = {
    'admin_wu': { password: 'wu_admin26', name: 'ฝ่ายพัฒนานักศึกษา' },
};

const LoginScreen = ({ 
    onLogin, 
    language, 
    setLanguage, 
    clubs = [], 
    clubCredentials = CLUB_CREDENTIALS,
    userPreferencesMap = {},
    goodnessHistoryMap = {},
    onExploreClubs
}: {
    onLogin: (role: string, clubName: string | null, studentId?: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
    clubs?: any[];
    clubCredentials?: Record<string, { password: string; name: string; isNew?: boolean }>;
    userPreferencesMap?: Record<string, string[]>;
    goodnessHistoryMap?: Record<string, GoodnessHistoryItem[]>;
    onExploreClubs?: () => void;
}) => {
    const [role, setRole] = useState('student');
    const [studentId, setStudentId] = useState('68101001');
    const [username, setUsername] = useState('club_cooking');
    const [password, setPassword] = useState('wu_cooking26');
    const [error, setError] = useState('');

    const activeClubCreds = clubCredentials || CLUB_CREDENTIALS;

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setError('');
        if (newRole === 'student') {
            setUsername('68101001');
            setPassword('student123');
        } else if (newRole === 'club') {
            const firstClubKey = Object.keys(activeClubCreds)[0] || 'club_cooking';
            setUsername(firstClubKey);
            setPassword(activeClubCreds[firstClubKey]?.password || 'wu_cooking26');
        } else if (newRole === 'system_admin') {
            setUsername('admin_wu');
            setPassword('wu_admin26');
        }
    };

    const currentClubCred = activeClubCreds[username];
    const targetClubObj = clubs?.find(c => 
        (currentClubCred && c.name === currentClubCred.name) || 
        c.id === username.replace('club_', '') || 
        c.name === username
    );
    const isTargetClubSuspended = Boolean(targetClubObj && targetClubObj.status === 'suspended');
    const isTargetClubDeleted = Boolean(targetClubObj && targetClubObj.status === 'deleted');

    const handleLoginClick = () => {
        setError('');
        if (role === 'student') {
            const cleanId = studentId.trim();
            if (!cleanId) {
                setError(language === 'th' ? 'กรุณาระบุรหัสนักศึกษา' : 'Please enter student ID');
                return;
            }
            onLogin('student', null, cleanId);
        } else if (role === 'club') {
            const club = activeClubCreds[username];
            if (club && club.password === password) {
                const targetClub = clubs?.find(c => c.name === club.name || c.id === username.replace('club_', ''));
                if (targetClub && targetClub.status === 'deleted') {
                    setError(
                        language === 'th' 
                            ? `🗑️ ไม่สามารถเข้าสู่ระบบได้: ชมรม "${club.name}" ถูกลบออกจากระบบแล้ว (อยู่ในถังขยะและสามารถกู้คืนได้ภายใน 3 วันโดยฝ่ายพัฒนานักศึกษา)` 
                            : `🗑️ Access Denied: Club "${club.name}" has been deleted and moved to trash (3-day recovery window active).`
                    );
                    return;
                }
                if (targetClub && targetClub.status === 'suspended') {
                    setError(
                        language === 'th' 
                            ? `⛔ ไม่สามารถเข้าสู่ระบบได้: ชมรม "${club.name}" ถูกฝ่ายพัฒนานักศึกษาสั่งระงับการดำเนินงานชั่วคราว จึงไม่อนุญาตให้เข้าใช้งานระบบหรือโพสต์กิจกรรม (กรุณาติดต่อผู้ดูแลระบบ)` 
                            : `⛔ Access Denied: Club "${club.name}" is suspended by university administration. System access and activity posting are disabled.`
                    );
                    return;
                }
                onLogin('club', club.name);
            } else {
                setError(language === 'th' ? 'ชื่อบัญชีหรือรหัสผ่านชมรมไม่ถูกต้อง (สามารถคลิกเลือกจากปุ่มลัดด้านล่างเพื่อทดสอบ)' : 'Invalid club credentials');
            }
        } else if (role === 'system_admin') {
            const admin = ADMIN_CREDENTIALS[username];
            if (admin && admin.password === password) {
                onLogin('system_admin', admin.name);
            } else {
                setError(language === 'th' ? 'ชื่อบัญชีหรือรหัสผ่านผู้ดูแลระบบไม่ถูกต้อง (admin_wu / wu_admin26)' : 'Invalid admin credentials');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
            <div className="w-full max-w-4xl bg-white min-h-[600px] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-500 to-teal-400 p-8 md:p-12 text-white flex flex-col justify-center md:justify-between relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-teal-200 opacity-20 rounded-full blur-3xl"></div>
                    
                    <div className="z-10 text-center md:text-left">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6 backdrop-blur-sm border border-white/30">
                            <span className="text-2xl font-bold text-white">WU</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{language === 'th' ? 'ยินดีต้อนรับสู่' : 'Welcome to'}<br/>WU Club</h1>
                        <p className="text-base md:text-lg opacity-90">{language === 'th' ? 'ระบบศูนย์รวมชมรม กิจกรรม และคะแนนความดี' : 'Club, Activity & Goodness Points Center'}<br/>{language === 'th' ? 'มหาวิทยาลัยวลัยลักษณ์' : 'Walailak University'}</p>
                    </div>

                    <div className="z-10 mt-8 md:mt-0 pt-6 border-t border-white/20 text-xs opacity-80">
                        Walailak University Student Affairs & Club Governance
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-6 right-6">
                        <button onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold rounded-full transition-colors text-sm cursor-pointer border border-gray-200 shadow-sm">
                            <Languages size={18} />
                            <span>{language === 'th' ? 'th Thai' : 'us English'}</span>
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 mt-8 md:mt-0 text-center md:text-left">{language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}</h2>
                    <p className="text-gray-500 mb-6 text-sm text-center md:text-left">{language === 'th' ? 'เลือกบทบาทเพื่อเข้าสู่ระบบงาน' : 'Choose your role to proceed'}</p>

                    <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
                        <button onClick={() => handleRoleChange('student')} className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{language === 'th' ? 'นักศึกษา' : 'Student'}</button>
                        <button onClick={() => handleRoleChange('club')} className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${role === 'club' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{language === 'th' ? 'ชมรม' : 'Club'}</button>
                        <button onClick={() => handleRoleChange('system_admin')} className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${role === 'system_admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{language === 'th' ? 'ผู้ดูแลระบบ' : 'Admin'}</button>
                    </div>

                    <div className="space-y-4">
                        {role === 'student' ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1.5 block">
                                        {language === 'th' ? 'รหัสนักศึกษา (Student ID)' : 'Student ID'}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={studentId} 
                                        onChange={(e) => { setStudentId(e.target.value); setError(''); }} 
                                        placeholder="เช่น 68101001" 
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                                    />
                                </div>

                                <div className="pt-0.5">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[11px] text-gray-500 font-semibold">
                                            {language === 'th' ? 'ตัวอย่างรหัสนักศึกษาสำหรับเข้าใช้งาน:' : 'Sample student accounts to try:'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.values(DEFAULT_STUDENT_PROFILES).map(demo => {
                                            const savedPref = userPreferencesMap[demo.id];
                                            const hasPref = savedPref && Array.isArray(savedPref) && savedPref.length > 0;
                                            const isSelected = studentId === demo.id;
                                            const demoGoodnessList = getStudentGoodnessHistory(demo.id, goodnessHistoryMap);
                                            const demoGoodnessPts = demoGoodnessList.reduce((sum, item) => sum + (Number(item.points) || 0), 0);
                                            return (
                                                <button
                                                    key={demo.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setStudentId(demo.id);
                                                        setError('');
                                                    }}
                                                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                        isSelected 
                                                            ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400/20' 
                                                            : 'bg-slate-50 border-gray-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs text-gray-800">{demo.id}</span>
                                                        <span className="text-[10px] text-gray-400">{demo.year}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-600 truncate mt-0.5">{demo.name}</p>
                                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200 inline-block">
                                                            ★ {demoGoodnessPts.toFixed(1)} คะแนน
                                                        </span>
                                                        {hasPref ? (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold inline-block truncate max-w-full">
                                                                {savedPref[0]}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-semibold inline-block truncate max-w-full">
                                                                ยังไม่ระบุความชอบ
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed">
                                        💡 {language === 'th' 
                                            ? 'สามารถคลิกเลือกรหัสนักศึกษาเพื่อทดสอบเข้าสู่ระบบ โดยประวัติกิจกรรมและคะแนนความดีจะแสดงตามรหัสที่เลือก' 
                                            : 'Click any student ID to demo login. History and goodness points will reflect the selected student.'}
                                    </p>
                                </div>
                            </div>
                        ) : role === 'club' ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1.5 block">{language === 'th' ? 'ชื่อบัญชีชมรม (Club ID)' : 'Club ID'}</label>
                                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="เช่น club_cooking" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                </div>
                                
                                 <div className="pt-0.5">
                                    <span className="text-[11px] text-gray-500 font-semibold block mb-1.5">{language === 'th' ? 'เลือกบัญชีชมรมสำหรับทดสอบ:' : 'Select club demo:'}</span>
                                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                                        {Object.entries(activeClubCreds).map(([uKey, cred]: [string, any]) => {
                                            const cObj = clubs?.find(c => c.name === cred.name);
                                            const isSusp = cObj?.status === 'suspended';
                                            const isDel = cObj?.status === 'deleted';
                                            return (
                                                <button
                                                    key={uKey}
                                                    type="button"
                                                    onClick={() => {
                                                        setUsername(uKey);
                                                        setPassword(cred.password);
                                                        setError('');
                                                    }}
                                                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                                                        username === uKey 
                                                            ? (isDel ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold' : 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold')
                                                            : (isDel ? 'bg-rose-50/40 border-rose-200 text-rose-600 line-through opacity-70 hover:opacity-100' : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100')
                                                    }`}
                                                >
                                                    <span>{cred.name}</span>
                                                    {isDel ? (
                                                        <span className="px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-700 text-[9px] font-bold no-underline">ถังขยะ</span>
                                                    ) : isSusp ? (
                                                        <span className="px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-700 text-[9px] font-bold">ระงับ</span>
                                                    ) : cred.isNew ? (
                                                        <span className="px-1.5 py-0.2 rounded-sm bg-purple-100 text-purple-700 text-[9px] font-bold">✨ ใหม่</span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-700 text-[9px] font-bold">ปกติ</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {isTargetClubDeleted && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                                        <Trash2 size={16} className="text-rose-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">{language === 'th' ? '🗑️ ชมรมนี้ถูกลบโดยผู้ดูแลระบบ' : '🗑️ Club Deleted by Administration'}</p>
                                            <p className="mt-0.5 text-[11px] leading-relaxed">
                                                {language === 'th' 
                                                    ? 'ชมรมนี้อยู่ในถังขยะและซ่อนออกจากหน้านักศึกษาแล้ว (สามารถกู้คืนได้ภายใน 3 วันโดยฝ่ายพัฒนานักศึกษา)' 
                                                    : 'Moved to trash and hidden from students. Can be restored within 3 days by admin.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isTargetClubSuspended && !isTargetClubDeleted && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                                        <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">{language === 'th' ? '⚠️ ชมรมนี้ถูกระงับการดำเนินงานชั่วคราว' : '⚠️ Club Operation Suspended'}</p>
                                            <p className="mt-0.5 text-[11px] leading-relaxed">{language === 'th' ? 'ฝ่ายพัฒนานักศึกษามีคำสั่งระงับการดำเนินงาน จึงไม่สามารถเข้าสู่ระบบหรือโพสต์กิจกรรมได้' : 'Suspended by administration. Login and activity creation are locked.'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1.5 block">{language === 'th' ? 'ชื่อบัญชีผู้ดูแลส่วนกลาง (Admin ID)' : 'System Admin ID'}</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin_wu" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                            </div>
                        )}
                        <div>
                            <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-1.5 block">{language === 'th' ? 'รหัสผ่าน' : 'Password'}</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                        </div>
                        
                        {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl leading-relaxed">{error}</div>}
                        
                        <button 
                            onClick={handleLoginClick} 
                            className={`w-full font-bold rounded-xl py-3 mt-2 shadow-md transition-colors flex justify-center items-center gap-2 cursor-pointer ${
                                role === 'club' && isTargetClubSuspended 
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                            {language === 'th' ? 'เข้าสู่ระบบ' : 'Login'} <ArrowRight size={18} />
                        </button>

                        <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 space-y-1">
                            <span className="font-bold text-gray-700 block">🔑 {language === 'th' ? 'ข้อมูลสำหรับทดสอบระบบ:' : 'Demo credentials:'}</span>
                            <p>• {language === 'th' ? 'นักศึกษา: คลิกเข้าสู่ระบบได้ทันที' : 'Student: Click Login directly'}</p>
                            <p>• {language === 'th' ? 'ชมรม: club_cooking / wu_cooking26 (ชมรมทำอาหาร)' : 'Club: club_cooking / wu_cooking26'}</p>
                            <p>• {language === 'th' ? 'ผู้ดูแลระบบ: admin_wu / wu_admin26 (ระงับ/เปิดชมรมได้ที่แท็บชมรม)' : 'Admin: admin_wu / wu_admin26'}</p>
                        </div>

                        {/* ปุ่มดูชมรมทั้งหมดที่มุมล่างขวาของกล่องล็อกอิน ลิ้งไปยัง https://www.wusab.net/clubs */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                                {language === 'th' ? 'ยังไม่พร้อมเข้าสู่ระบบ?' : 'Want to explore first?'}
                            </span>
                            <a
                                href="https://www.wusab.net/clubs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs sm:text-sm border border-indigo-200 transition-all cursor-pointer shadow-xs active:scale-95 group"
                            >
                                <Users size={15} />
                                <span>{language === 'th' ? 'ดูชมรมทั้งหมด' : 'Browse All Clubs'}</span>
                                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ currentTab, setCurrentTab, onLogout, loginRole, loginClubName, profileImg, onProfileImgChange, language, onOpenPolicies, studentId, studentName, studentInitials }: {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    onLogout: () => void;
    loginRole: string;
    loginClubName: string;
    profileImg: any;
    onProfileImgChange: (img: any) => void;
    language: string;
    onOpenPolicies: () => void;
    studentId?: string;
    studentName?: string;
    studentInitials?: string;
}) => {
    const studentNav = [
        { id: 'home', icon: Home, label: language === 'th' ? 'หน้าหลัก' : 'Home' },
        { id: 'activities', icon: Calendar, label: language === 'th' ? 'กิจกรรมทั้งหมด' : 'Activities' },
        { id: 'clubs', icon: Users, label: language === 'th' ? 'ชมรม' : 'Clubs' },
        { id: 'goodness', icon: Star, label: language === 'th' ? 'คะแนนความดี' : 'Goodness' },
    ];

    const clubNav = [
        { id: 'club_dashboard', icon: Home, label: language === 'th' ? 'แดชบอร์ดชมรม' : 'Dashboard' },
        { id: 'manage_activities', icon: Calendar, label: language === 'th' ? 'จัดการกิจกรรม' : 'Manage Activities' },
        { id: 'manage_members', icon: Users, label: language === 'th' ? 'รายชื่อสมาชิก' : 'Members' },
    ];

    const adminNav = [
        { id: 'admin_dashboard', icon: ShieldCheck, label: language === 'th' ? 'แดชบอร์ดผู้ดูแล' : 'Admin Portal' },
        { id: 'admin_activities', icon: Calendar, label: language === 'th' ? 'อนุมัติกิจกรรม' : 'Approve Activities' },
        { id: 'admin_proposals', icon: Building2, label: language === 'th' ? 'คำขอจัดตั้งชมรม' : 'Club Proposals' },
        { id: 'admin_clubs', icon: Users, label: language === 'th' ? 'จัดการชมรมทั้งหมด' : 'Manage Clubs' },
        { id: 'admin_policies', icon: BookOpen, label: language === 'th' ? 'ระเบียบและเกณฑ์' : 'Policies' },
    ];

    const navItems = loginRole === 'system_admin' ? adminNav : (loginRole === 'club' ? clubNav : studentNav);

    return (
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3 border-b border-gray-100 cursor-pointer" onClick={() => setCurrentTab(loginRole === 'system_admin' ? 'admin_dashboard' : (loginRole === 'club' ? 'club_dashboard' : 'home')) }>
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md"><span className="font-bold text-white text-sm">WU</span></div>
                <div>
                    <h1 className="text-lg font-bold text-gray-800 leading-tight">WU Club</h1>
                    <span className="text-[10px] text-gray-400 font-semibold block">{loginRole === 'system_admin' ? 'System Admin' : (loginRole === 'club' ? 'Club Portal' : 'Student Portal')}</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                        <button key={item.id} onClick={() => setCurrentTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' : 'text-gray-500 hover:bg-slate-50 hover:text-gray-700'}`}>
                            <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                {/* ปุ่มเปิดดูกฎระเบียบและข้อบังคับมหาวิทยาลัย */}
                <button
                    onClick={onOpenPolicies}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 mb-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors border border-gray-200/80 cursor-pointer"
                >
                    <FileText size={16} className="text-indigo-600 shrink-0" />
                    <span>{language === 'th' ? 'ระเบียบและเกณฑ์คะแนน' : 'Rules & Guidelines'}</span>
                </button>

                <div onClick={() => setCurrentTab('profile')} className="bg-slate-50 rounded-2xl p-3.5 mb-3 flex items-center gap-3 border border-gray-100 transition-colors cursor-pointer hover:border-indigo-300">
                    <label className="cursor-pointer relative group w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 overflow-hidden flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        {profileImg ? (
                            <img src={profileImg} alt="profile" className="w-full h-full object-cover" />
                        ) : loginRole === 'system_admin' ? (
                            <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center"><ShieldCheck size={18} /></div>
                        ) : loginRole === 'club' ? (
                            <Utensils size={18} />
                        ) : (
                            <div className="w-full h-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">{studentInitials || 'ST'}</div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={14} className="text-white" />
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onProfileImgChange(URL.createObjectURL(file));
                        }} />
                    </label>
                    <div className="overflow-hidden">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                            {loginRole === 'system_admin' ? 'ฝ่ายพัฒนานักศึกษา' : (loginRole === 'club' ? loginClubName : (studentName || `นักศึกษา (${studentId || '68101001'})`))}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate">
                            {loginRole === 'system_admin' ? 'ผู้ดูแลส่วนกลาง (Admin)' : (loginRole === 'club' ? 'ผู้ดูแลชมรม (Club)' : `รหัส: ${studentId || '68101001'}`)}
                        </p>
                    </div>
                </div>
                <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-semibold text-xs sm:text-sm cursor-pointer"><LogOut size={18} /> {language === 'th' ? 'ออกจากระบบ' : 'Logout'}</button>
            </div>
        </div>
    );
};

// --- แก้ไข 1: บันทึกข้อมูลสถานที่ ถ้าไม่กรอกให้เป็น มหาวิทยาลัยวลัยลักษณ์ ---
const ClubDashboardTab = ({ activities, setActivities, clubName, members, language, onShowToast, isSuspended = false, cancellationReports = [] }: {
    activities: any[];
    setActivities: any;
    clubName: string;
    members: any[];
    language: string;
    onShowToast?: any;
    isSuspended?: boolean;
    cancellationReports?: CancellationReport[];
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '', goodnessCategory: '', goodnessPoints: '', desc: '', maxParticipants: '' });
    const [cancellationFilterAct, setCancellationFilterAct] = useState<string>('all');

    const clubActivities = activities.filter(act => act.club === clubName);
    const myClubCancellations = cancellationReports.filter(r => r.clubName === clubName);
    const filteredCancellations = cancellationFilterAct === 'all' 
        ? myClubCancellations 
        : myClubCancellations.filter(r => String(r.activityId) === cancellationFilterAct || r.activityTitle === cancellationFilterAct);

    const handleSaveActivity = () => {
        if (isSuspended) {
            if (onShowToast) onShowToast(language === 'th' ? 'ไม่สามารถสร้างกิจกรรมได้ เนื่องจากชมรมถูกระงับการดำเนินงานชั่วคราว' : 'Cannot create activity. Club is suspended.', 'error');
            return;
        }

        let formattedDate = 'เร็วๆ นี้';
        if(formData.date) {
            const d = new Date(formData.date);
            const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
            formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        const newActivity = {
            id: Date.now(),
            title: formData.title || 'กิจกรรมใหม่ที่ยังไม่ได้ตั้งชื่อ',
            date: formattedDate,
            club: clubName,
            tag: 'มาใหม่',
            category: 'ไลฟ์สไตล์',
            location: formData.location.trim() !== '' ? formData.location : 'มหาวิทยาลัยวลัยลักษณ์', 
            goodnessCategory: formData.goodnessCategory || '-',
            goodnessPoints: formData.goodnessCategory ? (Number(formData.goodnessPoints) || 0) : 0,
            currentParticipants: 0,
            maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : 50,
            likes: 0,
            comments: [],
            img: 'https://placehold.co/600x300/fbcfe8/831843?text=New+Event',
            desc: formData.desc,
            status: 'pending',
            attendanceList: [],
        };

        setActivities([...activities, newActivity]);
        setShowAddModal(false);
        setFormData({ title: '', date: '', time: '', location: '', goodnessCategory: '', goodnessPoints: '', desc: '', maxParticipants: '' });
        if (onShowToast) {
            onShowToast(language === 'th' ? 'สร้างกิจกรรมสำเร็จ! กิจกรรมถูกส่งไปยังฝ่ายพัฒนานักศึกษาเพื่อรอการอนุมัติ' : 'Activity submitted for university approval', 'success');
        }
    };

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-300 relative">
            {isSuspended && (
                <div className="mb-6 p-4 md:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs animate-in fade-in">
                    <AlertCircle size={22} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-bold text-base text-rose-900">
                            {language === 'th' ? '⚠️ ชมรมนี้ถูกฝ่ายพัฒนานักศึกษาสั่งระงับการดำเนินงานชั่วคราว' : '⚠️ Club Operation Temporarily Suspended'}
                        </h4>
                        <p className="text-xs sm:text-sm text-rose-700 mt-1 leading-relaxed">
                            {language === 'th' 
                                ? 'เนื่องจากถูกระงับการดำเนินงาน จึงไม่อนุญาตให้สร้างกิจกรรมใหม่ แก้ไขข้อมูล หรือรับสมัครสมาชิกในขณะนี้ กรุณาติดต่อฝ่ายพัฒนานักศึกษา มหาวิทยาลัยวลัยลักษณ์ เพื่อขอข้อมูลเพิ่มเติม' 
                                : 'Due to administrative suspension, creating activities, editing events, and accepting new members are locked. Please contact student affairs.'}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">แดชบอร์ดจัดการชมรม (Admin)</h2>
                        {isSuspended && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs">
                                {language === 'th' ? 'ถูกระงับ' : 'Suspended'}
                            </span>
                        )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{clubName} • ภาพรวมและการจัดการกิจกรรม</p>
                </div>
                <button 
                    onClick={() => {
                        if (isSuspended) {
                            if (onShowToast) onShowToast(language === 'th' ? 'ไม่สามารถสร้างกิจกรรมได้ เนื่องจากชมรมถูกระงับการดำเนินงาน' : 'Club is suspended. Cannot create activity.', 'error');
                            return;
                        }
                        setShowAddModal(true);
                    }} 
                    disabled={isSuspended}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-xl md:rounded-full font-semibold shadow-md transition-colors flex items-center justify-center gap-2 ${
                        isSuspended 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95'
                    }`}
                >
                    <span className="text-xl leading-none">+</span> {isSuspended ? (language === 'th' ? 'ชมรมถูกระงับ (สร้างไม่ได้)' : 'Suspended (Locked)') : (language === 'th' ? 'สร้างกิจกรรมใหม่' : 'Create Activity')}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Users size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">{language === 'th' ? 'สมาชิกทั้งหมด' : 'Total Members'}</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-800">{members.filter(m => m.clubName === clubName).length} {language === 'th' ? 'คน' : 'members'}</p>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <Calendar size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">{language === 'th' ? 'กิจกรรมที่จัด' : 'Club Events'}</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-800">{clubActivities.length} {language === 'th' ? 'งาน' : 'events'}</p>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Bookmark size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">{language === 'th' ? 'ยอดลงทะเบียนรวม' : 'Registrations'}</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-800">{clubActivities.reduce((acc, curr) => acc + (Number(curr.currentParticipants) || 0), 0)} {language === 'th' ? 'คน' : 'people'}</p>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <UserX size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">{language === 'th' ? 'ยกเลิกลงทะเบียน' : 'Cancellations'}</p>
                        <p className="text-xl md:text-2xl font-bold text-rose-600">{myClubCancellations.length} {language === 'th' ? 'คน' : 'reports'}</p>
                    </div>
                </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">{language === 'th' ? 'กิจกรรมที่กำลังจะจัด' : 'Upcoming Activities'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {clubActivities.map((act) => (
                    <div key={act.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                        <img src={act.img} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0" alt="" />
                        <div className="flex-1 overflow-hidden">
                            <h4 className="font-bold text-gray-800 text-sm md:text-base truncate">{act.title}</h4>
                            <p className="text-xs md:text-sm text-gray-500 flex items-center mt-1"><Clock size={14} className="mr-1"/> {act.date}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] md:text-xs text-indigo-600 font-medium">{language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'} {act.currentParticipants}/{act.maxParticipants} {language === 'th' ? 'คน' : 'people'}</p>
                                {act.status === 'approved' ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={11} /> {language === 'th' ? 'อนุมัติแล้ว' : 'Approved'}
                                    </span>
                                ) : act.status === 'rejected' ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold flex items-center gap-1" title={act.rejectReason || 'ไม่อนุมัติ'}>
                                        <X size={11} /> {language === 'th' ? 'ไม่อนุมัติ' : 'Rejected'}
                                    </span>
                                ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center gap-1">
                                        <Clock size={11} /> {language === 'th' ? 'รอ Admin อนุมัติ' : 'Pending Approval'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {clubActivities.length === 0 && <div className="col-span-1 md:col-span-2 text-center text-gray-400 py-8 border border-dashed rounded-xl">{language === 'th' ? 'ยังไม่มีกิจกรรม' : 'No activities'}</div>}
            </div>

            {/* ส่วนแสดงเหตุผลการยกเลิกกิจกรรมจากนักศึกษา (ส่งมายังชมรม) */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                <UserX size={18} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-800">
                                {language === 'th' ? 'เหตุผลการยกเลิกกิจกรรมจากนักศึกษา' : 'Activity Cancellation Reasons from Students'}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                                {filteredCancellations.length} {language === 'th' ? 'รายการ' : 'reports'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {language === 'th' ? 'ระบบรวบรวมเหตุผลที่นักศึกษาระบุก่อนกดยกเลิกลงทะเบียนกิจกรรมของชมรม' : 'Real-time reasons given by students when cancelling registration'}
                        </p>
                    </div>

                    {myClubCancellations.length > 0 && (
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 font-semibold">{language === 'th' ? 'กรองกิจกรรม:' : 'Filter:'}</label>
                            <select 
                                value={cancellationFilterAct} 
                                onChange={(e) => setCancellationFilterAct(e.target.value)}
                                className="bg-slate-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/30"
                            >
                                <option value="all">{language === 'th' ? 'ทุกกิจกรรม' : 'All Events'}</option>
                                {clubActivities.map((act) => (
                                    <option key={act.id} value={String(act.id)}>{act.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {filteredCancellations.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400 opacity-80" />
                        <p className="text-sm font-semibold text-gray-700">
                            {language === 'th' ? 'ยังไม่มีนักศึกษายกเลิกกิจกรรม' : 'No cancellation reports yet'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {language === 'th' ? 'เมื่อมีนักศึกษายกเลิกการลงทะเบียน ข้อมูลพร้อมเหตุผลจะถูกส่งมาแสดงที่นี่ทันที' : 'When students cancel registrations, reasons will appear here instantly.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredCancellations.map((report) => (
                            <div key={report.id} className="p-4 md:p-5 rounded-2xl bg-slate-50 border border-gray-100 hover:border-rose-200 transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                                {report.studentName?.slice(0, 2) || 'ST'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-gray-900">{report.studentName}</span>
                                                    <span className="text-xs font-mono font-semibold bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-600">
                                                        {report.studentId}
                                                    </span>
                                                </div>
                                                {report.studentMajor && (
                                                    <p className="text-[11px] text-gray-500">{report.studentMajor}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
                                            <Clock size={12} />
                                            {report.timestamp}
                                        </span>
                                    </div>

                                    <div className="mb-2.5">
                                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                                            📌 {report.activityTitle}
                                        </span>
                                    </div>

                                    <div className="p-3 bg-white rounded-xl border border-rose-100 text-xs text-gray-800 shadow-2xs">
                                        <div className="flex items-start gap-1.5">
                                            <FileText size={14} className="text-rose-500 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <span className="font-semibold text-rose-700 block mb-0.5">
                                                    {language === 'th' ? 'เหตุผลที่ขอยกเลิก:' : 'Cancellation Reason:'}
                                                </span>
                                                <p className="text-gray-700 font-medium leading-relaxed">{report.reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 mt-2">{language === 'th' ? 'เพิ่มกิจกรรมใหม่' : 'Add New Activity'}</h3>
                        
                        <div className="space-y-4">
                            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'ชื่อกิจกรรม' : 'Activity Name'}</label><input type="text" placeholder={language === 'th' ? "เช่น เวิร์คช็อปทำเค้ก" : "e.g., Cake Workshop"} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'วันที่จัดงาน' : 'Date'}</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'เวลา' : 'Time'}</label><input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'สถานที่' : 'Location'}</label><input type="text" placeholder={language === 'th' ? "ถ้าไม่ระบุจะขึ้นว่า มหาวิทยาลัยวลัยลักษณ์" : "Default: Walailak University"} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนผู้เข้าร่วม (คน)' : 'Max Participants'}</label><input type="number" placeholder="เช่น 50" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'หมวดหมู่คะแนนความดี' : 'Goodness Category'}</label>
                                    <select value={formData.goodnessCategory} onChange={e => setFormData({...formData, goodnessCategory: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none">
                                        <option value="">{language === 'th' ? '-- ไม่ระบุ --' : '-- None --'}</option>
                                        <option value="ความกตัญญู">ความกตัญญู</option>
                                        <option value="การรู้วินัย">การรู้วินัย</option>
                                        <option value="การมีจิตอาสา">การมีจิตอาสา</option>
                                        <option value="การพัฒนาภาวะผู้นำ">การพัฒนาภาวะผู้นำ</option>
                                        <option value="ความรักชาติ">ความรักชาติ</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนคะแนน' : 'Points'}</label>
                                    <input type="number" placeholder="เช่น 10" value={formData.goodnessPoints} onChange={e => setFormData({...formData, goodnessPoints: e.target.value})} disabled={!formData.goodnessCategory} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50 disabled:bg-gray-100" />
                                </div>
                            </div>
                            
                            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'รายละเอียด' : 'Details'}</label><textarea rows={3} placeholder={language === 'th' ? "อธิบายเกี่ยวกับกิจกรรม..." : "Describe the activity..."} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"></textarea></div>
                            
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                                <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold">{language === 'th' ? 'ขั้นตอนการอนุมัติกิจกรรม:' : 'Activity Approval Workflow:'}</span>
                                    <p className="mt-0.5 text-[11px] text-amber-700 leading-relaxed">
                                        {language === 'th'
                                            ? 'เมื่อกดบันทึก ข้อมูลกิจกรรมจะถูกส่งไปยังฝ่ายพัฒนานักศึกษา (Admin ระบบ) เพื่อตรวจสอบความถูกต้องก่อน เมื่อได้รับการอนุมัติแล้ว กิจกรรมจึงจะปรากฏบนหน้านักศึกษา'
                                            : 'Submitted activities will be reviewed by Student Affairs (System Admin) before being published to the student portal.'}
                                    </p>
                                </div>
                            </div>

                            <button onClick={handleSaveActivity} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 mt-2 shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2">
                                <Send size={16} />
                                <span>{language === 'th' ? 'ส่งกิจกรรมขออนุมัติเผยแพร่' : 'Submit Activity for Approval'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
// --- แก้ไข 2: เพิ่มช่องแก้ไขสถานที่ ใน Modal การแก้ไขกิจกรรม ---
const ManageActivitiesTab = ({ activities, setActivities, clubName, language, onOpenAttendance, onShowToast, isSuspended = false, cancellationReports = [] }: {
    activities: any[];
    setActivities: any;
    clubName: string;
    language: string;
    onOpenAttendance?: any;
    onShowToast?: any;
    isSuspended?: boolean;
    cancellationReports?: CancellationReport[];
}) => {
    const clubActivities = activities.filter(act => act.club === clubName);
    const [editingAct, setEditingAct] = useState<any>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<any>(null);
    const [viewingCancellationAct, setViewingCancellationAct] = useState<any>(null);

    const handleDelete = (id) => {
        if (isSuspended) {
            if (onShowToast) onShowToast(language === 'th' ? 'ไม่สามารถลบกิจกรรมได้ เนื่องจากชมรมถูกระงับการดำเนินงานชั่วคราว' : 'Cannot delete activity. Club is suspended.', 'error');
            return;
        }
        setDeleteTargetId(id);
    };

    const confirmDeleteActivity = () => {
        if (deleteTargetId !== null) {
            setActivities(activities.filter(act => act.id !== deleteTargetId));
            if (onShowToast) onShowToast(language === 'th' ? 'ลบกิจกรรมสำเร็จ' : 'Activity deleted', 'info');
            setDeleteTargetId(null);
        }
    };

    const handleSaveEdit = () => {
        if (isSuspended) {
            if (onShowToast) onShowToast(language === 'th' ? 'ไม่สามารถแก้ไขกิจกรรมได้ เนื่องจากชมรมถูกระงับการดำเนินงานชั่วคราว' : 'Cannot edit activity. Club is suspended.', 'error');
            return;
        }
        const updatedAct = {
            ...editingAct,
            location: editingAct.location && editingAct.location.trim() !== '' ? editingAct.location : 'มหาวิทยาลัยวลัยลักษณ์',
            maxParticipants: editingAct.maxParticipants ? Number(editingAct.maxParticipants) : 50
        };
        setActivities(activities.map(act => act.id === editingAct.id ? updatedAct : act));
        setEditingAct(null);
        if (onShowToast) onShowToast(language === 'th' ? 'บันทึกการแก้ไขเรียบร้อยแล้ว' : 'Changes saved successfully', 'success');
    };

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-300 relative">
            {isSuspended && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs animate-in fade-in">
                    <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm text-rose-900">{language === 'th' ? '⚠️ ชมรมนี้ถูกฝ่ายพัฒนานักศึกษาสั่งระงับการดำเนินงานชั่วคราว' : '⚠️ Club Operation Temporarily Suspended'}</h4>
                        <p className="text-xs text-rose-700 mt-0.5">{language === 'th' ? 'ฟังก์ชันแก้ไข ลบกิจกรรม หรือเช็คชื่อผู้เข้าร่วม ถูกระงับการใช้งานชั่วคราว' : 'Editing, deleting, or taking attendance are locked while the club is suspended.'}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{language === 'th' ? 'จัดการกิจกรรมทั้งหมด' : 'Manage All Activities'}</h2>
                        {isSuspended && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs">
                                {language === 'th' ? 'ถูกระงับ' : 'Suspended'}
                            </span>
                        )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">{language === 'th' ? 'ติดตามสถานะการอนุมัติ ตรวจดูเหตุผลการยกเลิก แก้ไขข้อมูล และเช็คชื่อตัดคะแนนความดี' : 'Track approvals, review cancellation reasons, edit events, and perform attendance'}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-gray-100">
                            <tr>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'ชื่อกิจกรรม' : 'Activity Name'}</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'วันที่จัด' : 'Date'}</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'}</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'สถานะอนุมัติ' : 'Approval Status'}</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'เหตุผลยกเลิก' : 'Cancellations'}</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600 text-right">{language === 'th' ? 'จัดการ' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clubActivities.map(act => {
                                const actCancellations = cancellationReports.filter(r => String(r.activityId) === String(act.id));
                                return (
                                <tr key={act.id} className="border-b border-gray-50 hover:bg-slate-50/50">
                                    <td className="py-3 px-4 md:py-4 md:px-6">
                                        <div className="font-bold text-gray-800 text-sm md:text-base">{act.title}</div>
                                        <div className="text-[10px] md:text-xs text-gray-500 mt-1">
                                            {act.goodnessCategory && act.goodnessCategory !== '-' ? `+${act.goodnessPoints} ${act.goodnessCategory}` : (language === 'th' ? 'ไม่มีคะแนนความดี' : 'No goodness points')}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-600">{act.date}</td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                        <span className="bg-indigo-50 text-indigo-600 font-semibold px-2 md:px-3 py-1 rounded-full">{act.currentParticipants}/{act.maxParticipants}</span>
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                        {act.status === 'approved' ? (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-xs">
                                                <CheckCircle2 size={13} /> {language === 'th' ? 'อนุมัติแล้ว' : 'Approved'}
                                            </span>
                                        ) : act.status === 'rejected' ? (
                                            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-full text-xs" title={act.rejectReason || 'ไม่อนุมัติ'}>
                                                <X size={13} /> {language === 'th' ? 'ไม่อนุมัติ' : 'Rejected'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full text-xs">
                                                <Clock size={13} /> {language === 'th' ? 'รออนุมัติ' : 'Pending'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                        {actCancellations.length > 0 ? (
                                            <button 
                                                type="button"
                                                onClick={() => setViewingCancellationAct(act)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                                                title={language === 'th' ? 'ดูรายชื่อและเหตุผลที่นักศึกษายกเลิกกิจกรรมนี้' : 'View cancellation reasons'}
                                            >
                                                <UserX size={13} />
                                                <span>{actCancellations.length} {language === 'th' ? 'คน (ดูเหตุผล)' : 'reports'}</span>
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">{language === 'th' ? 'ไม่มีการยกเลิก' : 'None'}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-right">
                                        <button 
                                            onClick={() => {
                                                if (isSuspended) {
                                                    if (onShowToast) onShowToast(language === 'th' ? 'ไม่สามารถเช็คชื่อได้ เนื่องจากชมรมถูกระงับการดำเนินงานชั่วคราว' : 'Club is suspended.', 'error');
                                                    return;
                                                }
                                                onOpenAttendance && onOpenAttendance(act);
                                            }}
                                            disabled={isSuspended}
                                            title={isSuspended ? (language === 'th' ? 'ชมรมถูกระงับการดำเนินงาน' : 'Suspended') : (language === 'th' ? 'เช็คชื่อผู้เข้าร่วมและตัดคะแนนความดี' : 'Check Attendance & Award Points')}
                                            className={`p-1.5 md:p-2 rounded-lg transition-colors mr-1 md:mr-2 ${isSuspended ? 'text-gray-300 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50 cursor-pointer'}`}
                                        >
                                            <UserCheck size={16} className="md:w-5 md:h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (isSuspended) {
                                                    if (onShowToast) onShowToast(language === 'th' ? 'ไม่สามารถแก้ไขได้ เนื่องจากชมรมถูกระงับการดำเนินงานชั่วคราว' : 'Club is suspended.', 'error');
                                                    return;
                                                }
                                                setEditingAct({...act});
                                            }} 
                                            disabled={isSuspended}
                                            title={isSuspended ? (language === 'th' ? 'ชมรมถูกระงับการดำเนินงาน' : 'Suspended') : (language === 'th' ? 'แก้ไขกิจกรรม' : 'Edit')}
                                            className={`p-1.5 md:p-2 rounded-lg transition-colors mr-1 md:mr-2 ${isSuspended ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50 cursor-pointer'}`}
                                        >
                                            <Edit size={16} className="md:w-5 md:h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(act.id)} 
                                            disabled={isSuspended}
                                            title={isSuspended ? (language === 'th' ? 'ชมรมถูกระงับการดำเนินงาน' : 'Suspended') : (language === 'th' ? 'ลบกิจกรรม' : 'Delete')}
                                            className={`p-1.5 md:p-2 rounded-lg transition-colors ${isSuspended ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 cursor-pointer'}`}
                                        >
                                            <Trash2 size={16} className="md:w-5 md:h-5"/>
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                            {clubActivities.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">{language === 'th' ? 'ยังไม่มีกิจกรรมในระบบ' : 'No activities found'}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingAct && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setEditingAct(null)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 mt-2">{language === 'th' ? 'แก้ไขกิจกรรม' : 'Edit Activity'}</h3>
                        
                        <div className="space-y-4">
                            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'ชื่อกิจกรรม' : 'Activity Name'}</label><input type="text" value={editingAct.title} onChange={e => setEditingAct({...editingAct, title: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'วันที่และเวลาจัดงาน' : 'Date & Time'}</label><input type="text" value={editingAct.date} onChange={e => setEditingAct({...editingAct, date: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'สถานที่' : 'Location'}</label><input type="text" value={editingAct.location || ''} onChange={e => setEditingAct({...editingAct, location: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนผู้เข้าร่วม (คน)' : 'Max Participants'}</label><input type="number" value={editingAct.maxParticipants || ''} onChange={e => setEditingAct({...editingAct, maxParticipants: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'หมวดหมู่คะแนนความดี' : 'Goodness Category'}</label>
                                    <select value={editingAct.goodnessCategory || '-'} onChange={e => setEditingAct({...editingAct, goodnessCategory: e.target.value, goodnessPoints: e.target.value === '-' ? 0 : editingAct.goodnessPoints })} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none">
                                        <option value="-">-- ไม่ระบุ / ไม่มีคะแนนความดี --</option>
                                        <option value="ความกตัญญู">ความกตัญญู</option>
                                        <option value="การรู้วินัย">การรู้วินัย</option>
                                        <option value="การมีจิตอาสา">การมีจิตอาสา</option>
                                        <option value="การพัฒนาภาวะผู้นำ">การพัฒนาภาวะผู้นำ</option>
                                        <option value="ความรักชาติ">ความรักชาติ</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนคะแนน' : 'Points'}</label>
                                    <input type="number" value={editingAct.goodnessPoints} onChange={e => setEditingAct({...editingAct, goodnessPoints: Number(e.target.value)})} disabled={editingAct.goodnessCategory === '-' || !editingAct.goodnessCategory} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50 disabled:bg-gray-100" />
                                </div>
                            </div>
                            
                            <button onClick={handleSaveEdit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 mt-2 shadow-md transition-colors">บันทึกการแก้ไข</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteTargetId !== null}
                title={language === 'th' ? 'ยืนยันการลบกิจกรรม' : 'Confirm Delete Activity'}
                message={language === 'th' ? 'คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้? การลบจะไม่สามารถกู้คืนได้' : 'Are you sure you want to delete this activity? This cannot be undone.'}
                confirmText={language === 'th' ? 'ยืนยันลบ' : 'Delete'}
                cancelText={language === 'th' ? 'ยกเลิก' : 'Cancel'}
                confirmVariant="danger"
                onConfirm={confirmDeleteActivity}
                onCancel={() => setDeleteTargetId(null)}
            />

            {viewingCancellationAct && (
                <CancellationDetailModal
                    isOpen={!!viewingCancellationAct}
                    activityTitle={viewingCancellationAct.title}
                    reports={cancellationReports.filter(r => String(r.activityId) === String(viewingCancellationAct.id))}
                    language={language}
                    onClose={() => setViewingCancellationAct(null)}
                />
            )}
        </div>
    );
};
// --- แก้ไข 3: อัปเดตหน้าจัดการรายชื่อสมาชิก ให้โชว์เฉพาะคนในชมรม ---
// --- แก้ไข 2: เพิ่มคอลัมน์ "ตำแหน่ง" ในตารางรายชื่อสมาชิก ---
const ManageMembersTab = ({ clubName, members, language, isSuspended = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const clubMembers = members.filter(member => member.clubName === clubName);
    
    const filteredMembers = clubMembers.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.studentId.includes(searchQuery) ||
        (member.major && member.major.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-300">
            {isSuspended && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs animate-in fade-in">
                    <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm text-rose-900">{language === 'th' ? '⚠️ ชมรมนี้ถูกฝ่ายพัฒนานักศึกษาสั่งระงับการดำเนินงานชั่วคราว' : '⚠️ Club Operation Temporarily Suspended'}</h4>
                        <p className="text-xs text-rose-700 mt-0.5">{language === 'th' ? 'การรับสมาชิกใหม่และสถานะสมาชิกถูกระงับชั่วคราวตามคำสั่งฝ่ายพัฒนานักศึกษา' : 'Membership registrations and roster modifications are paused while suspended.'}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{language === 'th' ? 'รายชื่อสมาชิกชมรม' : 'Club Members'}</h2>
                        {isSuspended && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs">
                                {language === 'th' ? 'ถูกระงับ' : 'Suspended'}
                            </span>
                        )}
                    </div>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="ค้นหารหัสนักศึกษา, ชื่อ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-auto pl-10 pr-4 py-2.5 md:py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                    />
                </div>
            </div>
            
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* เพิ่ม overflow-x-auto ตรงนี้เพื่อให้ตารางเลื่อนซ้ายขวาได้ */}
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-gray-100">
                            <tr>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'รหัสนักศึกษา' : 'Student ID'}</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">ชื่อ-นามสกุล</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">ตำแหน่ง</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">สำนักวิชา</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">วันที่เข้าร่วม</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map(member => (
                                <tr key={member.id} className="border-b border-gray-50 hover:bg-slate-50/50">
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-mono text-gray-600">{member.studentId}</td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-bold text-gray-800">{member.name}</td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                        <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${
                                            member.role === 'ประธาน' ? 'bg-purple-100 text-purple-700' : 
                                            member.role === 'สมาชิก' ? 'bg-slate-100 text-slate-700' : 
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {member.role || 'สมาชิก'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-500">{member.major}</td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-500">{member.joinDate}</td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                        <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${member.status === 'ปกติ' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">ไม่พบรายชื่อสมาชิกที่ค้นหา</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- ระบบเลือกความชอบใน Local Storage แยกตามไอดี (1 ไอดี ต่อ 1 ความชอบ) ---
interface PreferencesModalProps {
    currentPrefs?: string[];
    onSave: (prefs: string[]) => void;
    isMandatory?: boolean;
    language: string;
    studentId?: string;
    onClose?: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ 
    currentPrefs = [], 
    onSave, 
    isMandatory = false, 
    language, 
    studentId,
    onClose 
}) => {
    // กำหนดให้เลือกได้ 1 ความชอบต่อ 1 บัญชี (Single Choice)
    const initialPref = currentPrefs && currentPrefs.length > 0 ? currentPrefs[0] : '';
    const isInitialInStandard = CATEGORIES.includes(initialPref);

    const [selectedCategory, setSelectedCategory] = useState<string>(isInitialInStandard ? initialPref : '');
    const [isOtherSelected, setIsOtherSelected] = useState<boolean>(!isInitialInStandard && initialPref !== '');
    const [otherText, setOtherText] = useState<string>(!isInitialInStandard ? initialPref : '');

    const handleSelectCategory = (cat: string) => {
        if (selectedCategory === cat) {
            setSelectedCategory('');
        } else {
            setSelectedCategory(cat);
            setIsOtherSelected(false);
            setOtherText('');
        }
    };

    const handleSelectOther = () => {
        if (isOtherSelected) {
            setIsOtherSelected(false);
            setOtherText('');
        } else {
            setSelectedCategory('');
            setIsOtherSelected(true);
        }
    };

    const handleSave = () => {
        let chosen = '';
        if (isOtherSelected && otherText.trim() !== '') {
            chosen = otherText.trim();
        } else if (selectedCategory) {
            chosen = selectedCategory;
        }
        if (chosen) {
            onSave([chosen]);
        }
    };

    const isSaveDisabled = !selectedCategory && (!isOtherSelected || otherText.trim() === '');

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
                {!isMandatory && onClose && (
                    <button 
                        onClick={onClose} 
                        type="button"
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                )}

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Sparkles size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {language === 'th' ? 'เลือกความสนใจของคุณ' : 'Choose Your Interests'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        {studentId && (
                            <span className="inline-block px-2.5 py-0.5 mb-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-xs mr-1 border border-indigo-100">
                                {language === 'th' ? `รหัสนักศึกษา: ${studentId}` : `Student ID: ${studentId}`}
                            </span>
                        )}
                        <br />
                        {language === 'th' 
                            ? 'เลือกสิ่งที่คุณชอบ เพื่อให้เราแนะนำกิจกรรมที่ใช่!' 
                            : 'Choose what you like so we can recommend the right activities!'}
                    </p>
                </div>
                
                {/* ปุ่มเลือกหมวดหมู่ 3 คอลัมน์ ตรงตามรูปภาพ */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                    {CATEGORIES.map(cat => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button 
                                key={cat} 
                                type="button"
                                onClick={() => handleSelectCategory(cat)} 
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 relative cursor-pointer active:scale-95 ${
                                    isSelected 
                                        ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 font-bold shadow-xs' 
                                        : 'border-gray-100 hover:border-indigo-200 text-gray-700 bg-white hover:bg-slate-50/50'
                                }`}
                            >
                                {isSelected && <CheckCircle2 size={18} className="absolute top-2 right-2 text-indigo-600" />}
                                <span className="font-semibold text-sm">{translateCategory(cat, language)}</span>
                            </button>
                        );
                    })}
                    
                    {/* ปุ่มสำหรับเลือก "อื่นๆ" */}
                    <button 
                        type="button"
                        onClick={handleSelectOther} 
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 relative cursor-pointer active:scale-95 ${
                            isOtherSelected 
                                ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 font-bold shadow-xs' 
                                : 'border-gray-100 hover:border-indigo-200 text-gray-700 bg-white hover:bg-slate-50/50'
                        }`}
                    >
                        {isOtherSelected && <CheckCircle2 size={18} className="absolute top-2 right-2 text-indigo-600" />}
                        <span className="font-semibold text-sm">{language === 'th' ? 'อื่นๆ' : 'Other'}</span>
                    </button>
                </div>

                {/* แสดงช่องกรอกข้อความเมื่อกดปุ่ม "อื่นๆ" */}
                {isOtherSelected && (
                    <div className="mb-5 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            {language === 'th' ? 'ระบุความสนใจที่คุณชอบ (1 อย่าง):' : 'Enter your custom preference (1 choice):'}
                        </label>
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="โปรดระบุความสนใจของคุณ (เช่น เขียนโปรแกรม, ถ่ายวิดีโอ)..." 
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isSaveDisabled) {
                                    handleSave();
                                }
                            }}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>
                )}

                <button 
                    type="button"
                    onClick={handleSave} 
                    disabled={isSaveDisabled} 
                    className={`w-full font-bold rounded-xl py-3.5 shadow-md transition-all mt-2 cursor-pointer ${
                        isSaveDisabled 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98 shadow-indigo-200'
                    }`}
                >
                    {language === 'th' ? 'บันทึกข้อมูล' : 'Save'}
                </button>
            </div>
        </div>
    );
};

interface ProfileTabProps {
    preferences?: any[];
    onEditPrefs?: () => void;
    profileImg?: any;
    onProfileImgChange?: (img: any) => void;
    loginRole?: string;
    clubName?: string;
    language?: string;
    activities?: any[];
    joinedActivities?: any[];
    clubs?: any[];
    joinedClubs?: any[];
    onViewDetail?: (item: any) => void;
    onCancelRegister?: (item: any, reason?: string) => void;
    onNavigateTab?: (tab: string) => void;
    studentId?: string;
    studentName?: string;
    studentYear?: string;
    studentMajor?: string;
    studentInitials?: string;
    onUpdateStudentName?: (newName: string) => void;
    totalGoodnessPoints?: number;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
    preferences = [], 
    onEditPrefs, 
    profileImg, 
    onProfileImgChange = () => {}, 
    loginRole, 
    clubName, 
    language,
    activities = [],
    joinedActivities = [],
    clubs = [],
    joinedClubs = [],
    onViewDetail,
    onCancelRegister,
    onNavigateTab,
    studentId,
    studentName,
    studentYear,
    studentMajor,
    studentInitials,
    onUpdateStudentName,
    totalGoodnessPoints = 0
}) => {
    const isClub = loginRole === 'club';
    const [confirmCancelTarget, setConfirmCancelTarget] = useState<any>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(studentName || '');

    useEffect(() => {
        setNameInput(studentName || '');
    }, [studentName]);

    const myRegisteredActivities = activities.filter(act => joinedActivities.some(id => String(id) === String(act.id)));
    const myJoinedClubs = clubs.filter(c => joinedClubs.some(id => String(id) === String(c.id)));

    return (
    <div className="p-4 md:p-8 animate-in fade-in duration-300 max-w-4xl mx-auto space-y-6 md:space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{language === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile'}</h2>
        
        {/* User Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 text-center md:text-left">
            <label className="cursor-pointer relative group w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-indigo-50 flex items-center justify-center bg-indigo-500 text-white text-2xl md:text-3xl font-bold shadow-md overflow-hidden flex-shrink-0">
                {profileImg ? <img src={profileImg} alt="profile" className="w-full h-full object-cover" /> : (isClub ? <Utensils size={48}/> : (studentInitials || 'ST'))}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onProfileImgChange(URL.createObjectURL(file));
                }} />
            </label>
            <div className="flex-1">
                {isClub ? (
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{clubName || 'ชมรมทำอาหาร'}</h3>
                ) : isEditingName ? (
                    <div className="flex flex-wrap items-center gap-2 mb-1 justify-center md:justify-start">
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="px-3 py-1 text-sm md:text-base font-bold text-gray-800 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="กรอกชื่อ-นามสกุล"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (nameInput.trim() && onUpdateStudentName) {
                                    onUpdateStudentName(nameInput.trim());
                                }
                                setIsEditingName(false);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                        >
                            {language === 'th' ? 'บันทึก' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setNameInput(studentName || '');
                                setIsEditingName(false);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        >
                            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                            {studentName || `นักศึกษา (${studentId || '68101001'})`}
                        </h3>
                        {onUpdateStudentName && (
                            <button
                                type="button"
                                onClick={() => setIsEditingName(true)}
                                className="text-gray-400 hover:text-indigo-600 p-1 rounded-md transition-colors cursor-pointer"
                                title={language === 'th' ? 'แก้ไขชื่อ' : 'Edit name'}
                            >
                                <Edit size={16} />
                            </button>
                        )}
                    </div>
                )}
                <p className="text-gray-500 mt-1 text-sm md:text-lg">
                    {isClub ? 'ผู้ดูแลชมรม' : `${studentMajor || 'เทคโนโลยีสารสนเทศ'} ${studentYear || 'ปี 2'} • รหัสนักศึกษา: ${studentId || '68101001'}`}
                </p>
                {!isClub && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs md:text-sm font-semibold">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            <span>{language === 'th' ? 'คะแนนความดีสะสม:' : 'Goodness:'} {totalGoodnessPoints.toFixed(2)} {language === 'th' ? 'คะแนน' : 'pts'}</span>
                        </div>
                        {onNavigateTab && (
                            <button
                                type="button"
                                onClick={() => onNavigateTab('goodness')}
                                className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                            >
                                {language === 'th' ? 'ดูรายละเอียดคะแนน →' : 'View details →'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>

        {isClub ? (
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h4 className="font-bold text-gray-800 text-lg md:text-xl">ข้อมูลชมรม (Club Information)</h4>
                </div>
                <div className="space-y-4 text-left">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">หมวดหมู่</p>
                        <p className="text-gray-800">ไลฟ์สไตล์</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">รายละเอียดชมรม</p>
                        <p className="text-gray-800 leading-relaxed">ชมรมที่รวบรวมคนรักการทำอาหาร มาร่วมแชร์สูตรอาหารและทำกิจกรรมร่วมกัน</p>
                    </div>
                </div>
            </div>
        ) : (
            <>
                {/* กิจกรรมที่ลงทะเบียนไว้ พร้อมปุ่มยกเลิก */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2.5">
                            <Calendar className="text-indigo-600" size={22} />
                            <h4 className="font-bold text-gray-800 text-lg md:text-xl">
                                {language === 'th' ? 'กิจกรรมที่ลงทะเบียนไว้' : 'My Registered Activities'}
                            </h4>
                            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                                {myRegisteredActivities.length}
                            </span>
                        </div>
                        {onNavigateTab && (
                            <button 
                                onClick={() => onNavigateTab('activities')}
                                className="text-xs md:text-sm text-indigo-600 font-semibold hover:underline"
                            >
                                {language === 'th' ? 'ดูกิจกรรมทั้งหมด' : 'Browse All'}
                            </button>
                        )}
                    </div>

                    {myRegisteredActivities.length > 0 ? (
                        <div className="space-y-3.5">
                            {myRegisteredActivities.map(act => (
                                <div 
                                    key={act.id} 
                                    className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div 
                                        className="flex items-center gap-3.5 flex-1 cursor-pointer"
                                        onClick={() => onViewDetail && onViewDetail({ ...act, type: 'activity' })}
                                    >
                                        <img src={act.img} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-200" />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">{act.club}</span>
                                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> {language === 'th' ? 'ลงทะเบียนแล้ว' : 'Registered'}
                                                </span>
                                            </div>
                                            <h5 className="font-bold text-gray-800 text-sm md:text-base mt-1 truncate hover:text-indigo-600 transition-colors">{act.title}</h5>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Clock size={12} className="text-gray-400" /> {act.date}</span>
                                                {act.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-gray-400" /> {act.location}</span>}
                                                {act.goodnessPoints > 0 && (
                                                    <span className="text-indigo-600 font-medium flex items-center gap-1">
                                                        <Award size={12} /> +{act.goodnessPoints} คะแนน
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                        <button
                                            type="button"
                                            onClick={() => onViewDetail && onViewDetail({ ...act, type: 'activity' })}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                                        >
                                            {language === 'th' ? 'รายละเอียด' : 'Details'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmCancelTarget({ ...act, type: 'activity' })}
                                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                                        >
                                            <X size={13} />
                                            <span>{language === 'th' ? 'ยกเลิกกิจกรรม' : 'Cancel'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm font-medium">{language === 'th' ? 'ยังไม่ได้ลงทะเบียนกิจกรรมใดๆ' : 'No registered activities yet'}</p>
                            {onNavigateTab && (
                                <button
                                    onClick={() => onNavigateTab('activities')}
                                    className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold rounded-xl transition-colors inline-block"
                                >
                                    {language === 'th' ? 'ค้นหากิจกรรมที่น่าสนใจ' : 'Find Activities'}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* ชมรมที่เป็นสมาชิก */}
                {myJoinedClubs.length > 0 && (
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2.5 mb-6">
                            <Users className="text-teal-600" size={22} />
                            <h4 className="font-bold text-gray-800 text-lg md:text-xl">
                                {language === 'th' ? 'ชมรมที่เป็นสมาชิก' : 'My Clubs'}
                            </h4>
                            <span className="px-2.5 py-0.5 text-xs font-bold bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                                {myJoinedClubs.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {myJoinedClubs.map(club => (
                                <div key={club.id} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between gap-3">
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer min-w-0"
                                        onClick={() => onViewDetail && onViewDetail({ ...club, type: 'club' })}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                                            {club.name.substring(0, 2)}
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="font-bold text-gray-800 text-sm truncate hover:text-teal-700">{club.name}</h5>
                                            <p className="text-xs text-gray-500">{club.category} • {club.members} สมาชิก</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmCancelTarget({ ...club, type: 'club' })}
                                        className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer active:scale-95"
                                    >
                                        {language === 'th' ? 'ออก' : 'Leave'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ความสนใจของคุณ */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg md:text-xl">{language === 'th' ? 'ความสนใจของคุณ (Preferences)' : 'Preferences'}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                {language === 'th' 
                                    ? 'ความสนใจที่คุณเลือกไว้สำหรับแนะนำกิจกรรมที่ตรงใจ' 
                                    : 'Your selected preference for personalized activity recommendations'}
                            </p>
                        </div>
                        <div>
                            <button 
                                type="button"
                                onClick={onEditPrefs} 
                                className="w-full md:w-auto text-indigo-600 hover:text-indigo-800 text-xs md:text-sm font-bold flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                            >
                                {language === 'th' ? 'แก้ไขความชอบ' : 'Edit Preference'}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        {preferences && preferences.length > 0 ? preferences.map(pref => (
                            <span key={pref} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs flex items-center gap-1.5">
                                <Sparkles size={16} />
                                <span>{pref}</span>
                            </span>
                        )) : (
                            <div className="text-gray-400 italic text-sm flex items-center gap-2">
                                <span>{language === 'th' ? 'ยังไม่ได้ระบุความสนใจสำหรับรหัสนี้' : 'No preference set for this ID'}</span>
                                <button type="button" onClick={onEditPrefs} className="text-indigo-600 underline font-semibold not-italic text-xs cursor-pointer">
                                    {language === 'th' ? 'เลือกเลย' : 'Choose now'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}

        {confirmCancelTarget?.type === 'club' ? (
            <ConfirmModal
                isOpen={!!confirmCancelTarget}
                title={language === 'th' ? 'ยืนยันการออกจากชมรม' : 'Leave Club'}
                message={language === 'th' ? `คุณต้องการยกเลิกการเป็นสมาชิกชมรม "${confirmCancelTarget?.name}" ใช่หรือไม่?` : `Are you sure you want to leave "${confirmCancelTarget?.name}"?`}
                confirmText={language === 'th' ? 'ยืนยันออกจากชมรม' : 'Leave Club'}
                cancelText={language === 'th' ? 'ปิด' : 'Close'}
                confirmVariant="danger"
                onConfirm={() => {
                    if (confirmCancelTarget && onCancelRegister) {
                        onCancelRegister(confirmCancelTarget);
                    }
                    setConfirmCancelTarget(null);
                }}
                onCancel={() => setConfirmCancelTarget(null)}
            />
        ) : (
            <CancelActivityModal
                isOpen={!!confirmCancelTarget}
                activityTitle={confirmCancelTarget?.title || confirmCancelTarget?.name || ''}
                clubName={confirmCancelTarget?.club}
                language={language}
                onConfirm={(reason) => {
                    if (confirmCancelTarget && onCancelRegister) {
                        onCancelRegister(confirmCancelTarget, reason);
                    }
                    setConfirmCancelTarget(null);
                }}
                onCancel={() => setConfirmCancelTarget(null)}
            />
        )}
    </div>
    );
};
const DateEventModal = ({ date, events, onClose, onViewDetail, language }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center"><Calendar size={24} /></div>
                    <div><h2 className="text-xl font-bold text-gray-800">{language === 'th' ? 'กิจกรรมวันที่' : 'Events on '}</h2><p className="text-teal-600 font-semibold">{date}</p></div>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {events.map((act) => (
                        <div key={act.id} onClick={() => { onClose(); onViewDetail({...act, type: act.type || 'activity'}); }} className="bg-slate-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:border-teal-300 hover:shadow-md transition-all flex gap-4 items-center">
                            <img src={act.img} className="w-16 h-16 rounded-xl object-cover" alt="" />
                            <div className="flex-1">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-700">{act.club}</span>
                                <h4 className="font-bold text-gray-800 text-sm mt-1">{act.title}</h4>
                            </div>
                            <ChevronRight size={20} className="text-gray-300" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- แก้ไข: อัปเดต HomeTab ให้รองรับการค้นหาจากความสนใจที่พิมพ์เอง (Custom Preferences) ---
// --- แก้ไข: อัปเดต HomeTab ให้รองรับการแจ้งเตือนเมื่อไม่มีความชอบที่ตรงกับระบบ ---
// --- แก้ไข: อัปเดต HomeTab ให้กรองกิจกรรมที่เต็มแล้วออกจากการแนะนำและการค้นหา ---
const HomeTab = ({ 
    onViewDetail, 
    preferences, 
    onViewAll, 
    activities, 
    clubs, 
    personalEvents = [], 
    setPersonalEvents, 
    language, 
    setLanguage, 
    studentName,
    goodnessHistory,
    goodnessPoints
}: {
    onViewDetail: (item: any) => void;
    preferences: any[];
    onViewAll: (tab: string) => void;
    activities: any[];
    clubs: any[];
    personalEvents?: any[];
    setPersonalEvents?: any;
    language: string;
    setLanguage: (lang: string) => void;
    studentName?: string;
    goodnessHistory?: GoodnessHistoryItem[];
    goodnessPoints?: number;
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications = [
        { id: 1, text: 'กิจกรรม "พัฒนาชุมชนรอบมอ" ได้รับการอนุมัติแล้ว', time: '10 นาทีที่แล้ว' },
        { id: 2, text: 'ชมรมวิ่งมีประกาศใหม่: วันนี้งดวิ่ง', time: '2 ชั่วโมงที่แล้ว' },
    ];
    // ใช้วันที่ปัจจุบันตามเวลาจริงเสมอ (Real-time dynamic current date)
    const now = new Date();
    const todayDay = now.getDate();
    const todayMonth = now.getMonth(); // 0-indexed
    const todayYear = now.getFullYear();

    const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });

    const goToToday = () => {
        const d = new Date();
        setCurrentMonth(d.getMonth());
        setCurrentYear(d.getFullYear());
    };
    const isShowingCurrentMonth = currentMonth === todayMonth && currentYear === todayYear;
    
    const handleAddEvent = () => {
        if(newEvent.title && newEvent.date) {
            setPersonalEvents([...personalEvents, {
                id: Date.now(),
                title: newEvent.title,
                date: newEvent.date,
                time: newEvent.time,
                type: 'personal',
                club: 'กิจกรรมส่วนตัว',
                img: 'https://placehold.co/400x300/f8fafc/64748b?text=Personal+Event'
            }]);
            setShowAddEvent(false);
            setNewEvent({ title: '', date: '', time: '' });
        }
    };
    
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
    
    const nextMonth = () => {
        if(currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else setCurrentMonth(currentMonth + 1);
    };
    
    const prevMonth = () => {
        if(currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else setCurrentMonth(currentMonth - 1);
    };
    
    const monthNamesTh = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNames = language === 'th' ? monthNamesTh : monthNamesEn;

    const days = language === 'th' ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const dates = Array.from({length: 31}, (_, i) => i + 1);
    
    const totalPoints = goodnessPoints !== undefined 
        ? goodnessPoints 
        : (goodnessHistory || []).reduce((sum, item) => sum + (Number(item?.points) || 0), 0);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(null); 
    const [dateEvents, setDateEvents] = useState([]); 

    const [showAllActs, setShowAllActs] = useState(false);
    const [showAllClubs, setShowAllClubs] = useState(false);

    const isSearching = searchQuery.trim() !== '';
    const lowerQuery = searchQuery.toLowerCase();

    // ชมรมที่ยังไม่ถูกลบ (หากชมรมถูกลบ status === 'deleted' จะไม่แสดงในฝั่งนักศึกษา)
    const activeClubs = clubs.filter(c => c.status !== 'deleted');

    // กิจกรรมที่แสดงในฝั่งนักศึกษา:
    // 1. ต้องผ่านการอนุมัติจาก Admin แล้วเท่านั้น (status === 'approved')
    // 2. ชมรมเจ้าของกิจกรรมต้องไม่ถูกลบ
    // 3. กิจกรรมยังไม่เต็ม
    const availableActivities = activities.filter(act => {
        if (act.status !== 'approved') return false;
        if (act.currentParticipants >= act.maxParticipants) return false;
        const hostClub = clubs.find(c => c.name === act.club);
        if (hostClub && hostClub.status === 'deleted') return false;
        return true;
    });

    let baseActivities = availableActivities;
    let noMatchAct = false;

    if (isSearching) {
        baseActivities = availableActivities.filter(act => act.title.toLowerCase().includes(lowerQuery) || act.club.toLowerCase().includes(lowerQuery) || act.category.toLowerCase().includes(lowerQuery));
    } else if (preferences && preferences.length > 0) {
        const filteredActs = availableActivities.filter(act => {
            return preferences.some(pref => {
                const p = pref.toLowerCase();
                return act.category.toLowerCase().includes(p) || act.title.toLowerCase().includes(p) || act.club.toLowerCase().includes(p);
            });
        });
        if (filteredActs.length === 0) {
            noMatchAct = true; 
            baseActivities = availableActivities; 
        } else {
            baseActivities = filteredActs;
        }
    }

    const displayActivities = (isSearching || showAllActs) ? baseActivities : baseActivities.slice(0, 2);
    const hasMoreActivities = !isSearching && baseActivities.length > 2;

    let baseClubs = activeClubs;
    let noMatchClub = false; 

    // หาชมรมที่เพิ่งได้รับการอนุมัติจัดตั้งใหม่ และไม่ถูกลบ
    const newApprovedClubs = activeClubs.filter(c => c.isNew || c.tag === 'ชมรมเปิดใหม่');

    if (isSearching) {
        baseClubs = activeClubs.filter(club => club.name.toLowerCase().includes(lowerQuery) || club.category.toLowerCase().includes(lowerQuery));
    } else if (preferences && preferences.length > 0) {
        const filteredClubs = activeClubs.filter(club => {
            return preferences.some(pref => {
                const p = pref.toLowerCase();
                return club.category.toLowerCase().includes(p) || club.name.toLowerCase().includes(p) || club.desc.toLowerCase().includes(p);
            });
        });
        if (filteredClubs.length === 0) {
            noMatchClub = true; 
            baseClubs = activeClubs; 
        } else {
            baseClubs = filteredClubs;
        }

        // นำชมรมเปิดใหม่ที่เพิ่งได้รับการอนุมัติ ขึ้นมาแนะนำไว้ด้านหน้าสุดเสมอ
        if (newApprovedClubs.length > 0) {
            const nonNewClubs = baseClubs.filter(c => !c.isNew && c.tag !== 'ชมรมเปิดใหม่');
            baseClubs = [...newApprovedClubs, ...nonNewClubs];
        }
    } else {
        // หากยังไม่ได้เลือกความชอบ นำชมรมเปิดใหม่ขึ้นแสดงด้านหน้าสุดเช่นกัน
        if (newApprovedClubs.length > 0) {
            const nonNewClubs = activeClubs.filter(c => !c.isNew && c.tag !== 'ชมรมเปิดใหม่');
            baseClubs = [...newApprovedClubs, ...nonNewClubs];
        }
    }

    const displayClubs = (isSearching || showAllClubs) ? baseClubs : baseClubs.slice(0, 3);
    const hasMoreClubs = !isSearching && baseClubs.length > 3;

    return (
        // เปลี่ยน p-8 เป็น p-4 md:p-8 สำหรับมือถือ
        <div className="p-4 md:p-8 animate-in fade-in duration-300">
            {selectedDate && (
                <DateEventModal date={selectedDate} events={dateEvents} onClose={() => setSelectedDate(null)} onViewDetail={onViewDetail} language={language} />
            )}

            {/* เรียงช่องค้นหาลงมาบรรทัดใหม่บนมือถือ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <div><h2 className="text-xl md:text-2xl font-bold text-gray-800">{language === 'th' ? `สวัสดีค่ะ, ${studentName || 'นักศึกษา'} 👋` : `Hello, ${studentName || 'Student'} 👋`}</h2><p className="text-sm md:text-base text-gray-500 mt-1">{language === 'th' ? 'วันนี้มีกิจกรรมที่คุณอาจสนใจตรงกับความชอบของคุณ' : 'Today, there are activities you might be interested in based on your preferences.'}</p></div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold rounded-full transition-colors text-sm flex-shrink-0 cursor-pointer border border-gray-200 shadow-sm">
                            <Languages size={18} />
                            <span>{language === 'th' ? 'th Thai' : 'us English'}</span>
                        </button>
                        <div className="relative w-full md:w-auto flex-1 md:flex-none">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder={language === 'th' ? "ค้นหาชมรม, กิจกรรม..." : "Search clubs, events..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-72 bg-white border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-slate-50">
                                    <h4 className="font-bold text-gray-800">{language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}</h4>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <p className="text-sm text-gray-800">{notif.text}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ปรับให้เป็น 1 คอลัมน์บนมือถือ 3 คอลัมน์บนจอใหญ่ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="col-span-1 lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base md:text-lg font-bold text-gray-800">
                                {isSearching ? `${language === 'th' ? 'ผลการค้นหากิจกรรม' : 'Search results'}: "${searchQuery}"` : 
                                ((preferences && preferences.length > 0 && !noMatchAct) ? (language === 'th' ? '✨ กิจกรรมแนะนำตามความสนใจของคุณ' : '✨ Recommended activities for you') : (language === 'th' ? 'กิจกรรมแนะนำสำหรับคุณ' : 'Recommended activities'))}
                            </h3>
                            {hasMoreActivities && (
                                <button onClick={() => setShowAllActs(!showAllActs)} className="text-xs md:text-sm text-indigo-500 font-medium hover:underline cursor-pointer">{showAllActs ? (language === 'th' ? 'ย่อลง' : 'Show less') : (language === 'th' ? 'ดูทั้งหมด' : 'View all')}</button>
                            )}
                        </div>
                        
                        {noMatchAct && (
                            <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs md:text-sm border border-amber-100 flex items-center shadow-sm">
                                <span className="mr-2 text-lg">💡</span> {language === 'th' ? 'ไม่มีกิจกรรมที่ตรงกับความชอบของคุณ ระบบจึงแนะนำกิจกรรมทั้งหมดแทน' : 'No activities match your preferences. Showing all activities instead.'}
                            </div>
                        )}

                        {displayActivities.length > 0 ? (
                            // ปรับเป็น 1 คอลัมน์บนมือถือ 2 คอลัมน์จอใหญ่
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayActivities.map(act => (
                                    <div key={act.id} onClick={() => onViewDetail({...act, type: 'activity'})} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group relative flex flex-col">
                                        <span className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">{translateCategory(act.category, language)}</span>
                                        <div className="h-32 md:h-40 bg-gray-200 relative overflow-hidden flex-shrink-0"><img src={act.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt=""/></div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h4 className="font-bold text-gray-800 text-base md:text-lg truncate">{act.title}</h4>
                                            <div className="mt-3 space-y-1.5 mt-auto">
                                                <p className="text-xs md:text-sm text-gray-500 flex items-center"><Calendar size={15} className="mr-2 text-gray-400"/>{act.date}</p>
                                                {act.goodnessCategory && act.goodnessCategory !== '-' && (
                                                    <p className="text-xs md:text-sm text-indigo-600 flex items-center font-medium"><Award size={15} className="mr-2"/> {language === 'th' ? 'ได้คะแนนด้าน' : 'Points in '}{translateCategory(act.goodnessCategory, language)} (+{act.goodnessPoints})</p>
                                                )}
                                                <p className="text-xs md:text-sm flex items-center font-medium text-emerald-600">
                                                    <Users size={15} className="mr-2"/> {language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'} {act.currentParticipants}/{act.maxParticipants} {language === 'th' ? 'คน' : 'people'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (<div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">{language === 'th' ? 'ไม่พบกิจกรรมที่ค้นหา' : 'No activities found'}</div>)}
                    </section>

                    <section>
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="text-base md:text-lg font-bold text-gray-800">
                                 {isSearching ? (language === 'th' ? `ผลการค้นหาชมรม: "${searchQuery}"` : `Search results: "${searchQuery}"`) :
                                  ((preferences && preferences.length > 0 && !noMatchClub) ? (language === 'th' ? '✨ ชมรมที่น่าสนใจตามความชอบของคุณ' : '✨ Recommended clubs for you') : (language === 'th' ? 'ชมรมที่น่าสนใจ' : 'Interesting clubs'))}
                             </h3>
                             {hasMoreClubs && (
                                 <button onClick={() => setShowAllClubs(!showAllClubs)} className="text-xs md:text-sm text-indigo-500 font-medium hover:underline cursor-pointer">{showAllClubs ? (language === 'th' ? 'ย่อลง' : 'Show less') : (language === 'th' ? 'ดูทั้งหมด' : 'View all')}</button>
                             )}
                         </div>

                         {noMatchClub && (
                             <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs md:text-sm border border-amber-100 flex items-center shadow-sm">
                                 <span className="mr-2 text-lg">💡</span> {language === 'th' ? 'ไม่มีชมรมที่ตรงกับความชอบของคุณ ระบบจึงแนะนำชมรมทั้งหมดแทน' : 'No clubs match your preferences. Showing all clubs instead.'}
                             </div>
                         )}

                         {displayClubs.length > 0 ? (
                             // ปรับเป็น 2 คอลัมน์บนมือถือ 3 คอลัมน์บนแท็บเล็ต
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                 {displayClubs.map(club => {
                                    const Icon = club.icon || getCategoryIcon(club.category, club.name) || Users;
                                    const isNewClub = club.isNew || club.tag === 'ชมรมเปิดใหม่';
                                    return (
                                        <div key={club.id} onClick={() => onViewDetail({...club, type: 'club'})} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all text-center relative overflow-hidden group">
                                            <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-md z-10">{translateCategory(club.category, language)}</span>
                                            {isNewClub && (
                                                <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] md:text-[10px] font-extrabold px-2 py-0.5 rounded-md z-10 shadow-xs animate-pulse">
                                                    {language === 'th' ? '✨ เปิดใหม่' : '✨ New'}
                                                </span>
                                            )}
                                            {club.status === 'suspended' && (
                                                <span className="absolute top-2 left-2 bg-rose-100 text-rose-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
                                                    {language === 'th' ? 'ถูกระงับ' : 'Suspended'}
                                                </span>
                                            )}
                                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><Icon size={24} className="md:w-7 md:h-7" /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-xs md:text-sm mt-1 flex items-center justify-center gap-1">
                                                    <span>{club.name}</span>
                                                </h4>
                                                <span className="text-[10px] md:text-xs text-gray-500">{club.members} {language === 'th' ? 'สมาชิก' : 'members'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                             </div>
                         ) : (<div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">{language === 'th' ? 'ไม่พบชมรมที่ค้นหา' : 'No clubs found'}</div>)}
                    </section>
                </div>

                <div className="col-span-1 space-y-6">
                    <div onClick={() => onViewAll('goodness')} className="bg-indigo-500 hover:bg-indigo-600 transition-colors cursor-pointer rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
                        <h3 className="text-indigo-100 text-sm font-semibold mb-1">{language === 'th' ? 'คะแนนความดีของคุณ' : 'Your Goodness Points'}</h3>
                        <div className="flex items-end gap-2 mb-4"><span className="text-4xl font-bold">{totalPoints.toFixed(2)}</span><span className="text-sm opacity-80 mb-1">{language === 'th' ? 'คะแนน' : 'Points'}</span></div>
                        <div className="flex items-center text-xs font-semibold text-indigo-200">{language === 'th' ? 'ดูรายละเอียด' : 'View Details'} <ChevronRight size={14} className="ml-1"/></div>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 relative">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-800 text-sm md:text-base">{language === 'th' ? 'ปฏิทินกิจกรรม' : 'Activity Calendar'}</h3>
                                {!isShowingCurrentMonth && (
                                    <button 
                                        onClick={goToToday}
                                        className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold cursor-pointer transition-colors"
                                        title={language === 'th' ? 'กลับมาเดือนปัจจุบัน' : 'Back to current month'}
                                    >
                                        {language === 'th' ? 'วันนี้' : 'Today'}
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={prevMonth} className="text-gray-400 hover:text-indigo-500 cursor-pointer p-0.5"><ChevronLeft size={18} /></button>
                                <span className="text-sm font-semibold w-16 text-center">{monthNames[currentMonth]} {(currentYear % 100).toString().padStart(2, '0')}</span>
                                <button onClick={nextMonth} className="text-gray-400 hover:text-indigo-500 cursor-pointer p-0.5"><ChevronRight size={18} /></button>
                                <button 
                                    onClick={() => {
                                        const defaultDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
                                        setNewEvent({ title: '', date: defaultDate, time: '09:00' });
                                        setShowAddEvent(true);
                                    }} 
                                    className="ml-1 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors cursor-pointer text-sm font-bold" 
                                    title={language === 'th' ? 'เพิ่มกิจกรรมส่วนตัว' : 'Add personal event'}
                                >+</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">{days.map(d => <div key={d} className="text-[10px] md:text-xs text-gray-400 font-medium">{d}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                            {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-7 w-7 md:h-8 md:w-8"></div>
                            ))}
                            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, i) => {
                                const d = i + 1;
                                const targetDateStr = `${d} ${monthNames[currentMonth]} ${currentYear}`;
                                const targetDateTh = `${d} ${monthNamesTh[currentMonth]} ${currentYear}`;
                                const targetDateEn = `${d} ${monthNamesEn[currentMonth]} ${currentYear}`;
                                const targetIso = `${currentYear}-${(currentMonth+1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                                
                                const approvedActivities = activities.filter(act => {
                                    if (act.status !== 'approved') return false;
                                    const hostClub = clubs.find(c => c.name === act.club);
                                    return !hostClub || hostClub.status !== 'deleted';
                                });
                                const allEvents = [...approvedActivities, ...personalEvents];
                                const dayEvents = allEvents.filter(act => {
                                    if(act.type === 'personal') return act.date === targetIso || act.date === targetDateTh || act.date === targetDateEn;
                                    return act.date === targetDateStr || act.date === targetDateTh || act.date === targetDateEn || act.date === targetIso;
                                });
                                const hasEvent = dayEvents.length > 0;
                                const isToday = (d === todayDay && currentMonth === todayMonth && currentYear === todayYear);

                                return (
                                    <div key={d} 
                                        onClick={() => { 
                                            if (hasEvent) { 
                                                setSelectedDate(targetDateStr); 
                                                setDateEvents(dayEvents); 
                                            } 
                                        }}
                                        className={`h-7 w-7 md:h-8 md:w-8 mx-auto flex items-center justify-center rounded-full text-xs md:text-sm relative transition-all
                                        ${isToday ? 'bg-indigo-600 text-white font-bold shadow-md ring-2 ring-indigo-200' : 'text-gray-700 hover:bg-slate-100'}
                                        ${hasEvent ? 'cursor-pointer hover:ring-2 hover:ring-teal-200' : 'cursor-default'}
                                    `}>
                                        {d}
                                        {hasEvent && !isToday && <span className="absolute bottom-0.5 md:bottom-1 w-1 h-1 bg-teal-500 rounded-full"></span>}
                                        {hasEvent && isToday && <span className="absolute bottom-0.5 md:bottom-1 w-1 h-1 bg-white rounded-full"></span>}
                                    </div>
                                )
                            })}
                        </div>
                        
                        {showAddEvent && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 rounded-3xl p-4 flex flex-col justify-center animate-in fade-in zoom-in duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800 text-sm">เพิ่มกิจกรรมส่วนตัว</h4>
                                    <button onClick={() => setShowAddEvent(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                                </div>
                                <input type="text" placeholder="ชื่องาน..." value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-indigo-500" />
                                <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-indigo-500" />
                                <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-indigo-500" />
                                <button onClick={handleAddEvent} className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-bold hover:bg-indigo-700 cursor-pointer">บันทึก</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- แก้ไข: อัปเดต ActivitiesTab ให้ซ่อนกิจกรรมที่เต็มแล้ว (ยกเว้นกิจกรรมที่ผู้ใช้ลงทะเบียนไว้แล้ว) กิจกรรมที่รออนุมัติ และกิจกรรมของชมรมที่ถูกลบ ---
const ActivitiesTab = ({ onViewDetail, activities, language, clubs = [], joinedActivities = [] }) => {
    const availableActivities = activities.filter(act => {
        if (act.status !== 'approved') return false;
        if (!joinedActivities.includes(act.id) && act.currentParticipants >= act.maxParticipants) return false;
        const hostClub = clubs.find(c => c.name === act.club);
        if (hostClub && hostClub.status === 'deleted') return false;
        return true;
    });

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{language === 'th' ? 'กิจกรรมทั้งหมด' : 'All Activities'}</h3>
            
            {availableActivities.length > 0 ? (
                // ปรับเป็น 1 คอลัมน์บนมือถือ 2 คอลัมน์จอใหญ่
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {availableActivities.map((act, idx) => {
                        const isUserRegistered = joinedActivities.some(id => String(id) === String(act.id));
                        return (
                            // ปรับจากแนวนอน เป็นเรียงซ้อนกันบนมือถือ แล้วเป็นแนวนอนบนจอใหญ่ (flex-col md:flex-row)
                            <div key={idx} onClick={() => onViewDetail({...act, type: 'activity'})} className={`bg-white p-4 md:p-5 rounded-2xl shadow-sm border flex flex-col sm:flex-row gap-4 sm:gap-5 items-start cursor-pointer hover:shadow-md transition-all ${isUserRegistered ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-gray-100 hover:border-indigo-200'}`}>
                                <img src={act.img} className="w-full sm:w-28 h-40 sm:h-28 rounded-xl object-cover flex-shrink-0 border border-gray-100" alt="" />
                                <div className="flex-1 overflow-hidden w-full">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] md:text-xs text-teal-600 font-semibold bg-teal-50 px-2 md:px-3 py-1 rounded-full">{act.club}</span>
                                        {isUserRegistered && (
                                            <span className="text-[10px] md:text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle2 size={12} /> {language === 'th' ? 'ลงทะเบียนแล้ว' : 'Registered'}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-base md:text-lg text-gray-800 mt-2 truncate">{act.title}</h4>
                                    <div className="mt-2.5 space-y-1.5">
                                        <p className="text-xs md:text-sm text-gray-500 flex items-center"><Clock size={14} className="mr-2 text-gray-400"/> {act.date}</p>
                                        <p className="text-xs md:text-sm text-indigo-600 flex items-center font-medium"><Award size={14} className="mr-2"/> {language === 'th' ? 'ได้คะแนนด้าน' : 'Points in '}{translateCategory(act.goodnessCategory, language)} (+{act.goodnessPoints})</p>
                                        <p className="text-xs md:text-sm flex items-center font-medium text-emerald-600">
                                            <Users size={14} className="mr-2"/> {language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'} {act.currentParticipants}/{act.maxParticipants} {language === 'th' ? 'คน' : 'people'}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center h-full"><ChevronRight size={24} className="text-gray-300" /></div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="p-10 md:p-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-200 border-dashed">
                    <p className="text-base md:text-lg font-semibold">{language === 'th' ? 'ไม่มีกิจกรรมที่เปิดรับสมัครในขณะนี้' : 'No activities available at the moment'}</p>
                </div>
            )}
        </div>
    );
};


const ClubsTab = ({ onViewDetail, clubs, language, onOpenProposal }) => {
    const filterCategories = ['ทั้งหมด', 'ไลฟ์สไตล์', 'กีฬา', 'ศิลปะ', 'วิชาการ', 'จิตอาสา', 'บันเทิง'];
    const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
    // ซ่อนชมรมที่ถูกลบออกจากฝั่งนักศึกษา
    const activeClubs = clubs.filter(c => c.status !== 'deleted');
    const filteredClubs = activeCategory === 'ทั้งหมด' ? activeClubs : activeClubs.filter(club => club.category === activeCategory);

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{language === 'th' ? 'ค้นหาชมรม' : 'Find Clubs'}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{language === 'th' ? 'สำรวจชมรมและองค์กรกิจกรรมนักศึกษามหาวิทยาลัยวลัยลักษณ์' : 'Explore Walailak University student clubs & organizations'}</p>
                </div>
                {onOpenProposal && (
                    <button 
                        onClick={onOpenProposal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>{language === 'th' ? 'ยื่นขอจัดตั้งชมรมใหม่' : 'Propose New Club'}</span>
                    </button>
                )}
            </div>
            {/* ทำให้เลื่อนปัดซ้ายขวาได้บนมือถือ */}
            <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                {filterCategories.map((cat, i) => (
                    <button key={i} onClick={() => setActiveCategory(cat)} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-slate-50'}`}>{cat}</button>
                ))}
            </div>
            {filteredClubs.length > 0 ? (
                // ปรับเป็น 2 คอลัมน์บนมือถือ, 3 คอลัมน์บนแท็บเล็ต, 4 คอลัมน์บนจอใหญ่
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredClubs.map(club => {
                        const Icon = club.icon || getCategoryIcon(club.category, club.name) || Users;
                        const isNewClub = club.isNew || club.tag === 'ชมรมเปิดใหม่';
                        return (
                            <div key={club.id} onClick={() => onViewDetail({...club, type: 'club'})} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 md:gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all text-center group relative overflow-hidden">
                                <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md z-10">{translateCategory(club.category, language)}</span>
                                {isNewClub && (
                                    <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] md:text-[10px] font-extrabold px-2 py-0.5 rounded-md z-10 shadow-xs animate-pulse">
                                        {language === 'th' ? '✨ เปิดใหม่' : '✨ New'}
                                    </span>
                                )}
                                {club.status === 'suspended' && (
                                    <span className="absolute top-2 left-2 bg-rose-100 text-rose-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md z-10">
                                        {language === 'th' ? 'ถูกระงับ' : 'Suspended'}
                                    </span>
                                )}
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><Icon size={24} className="md:w-8 md:h-8" /></div>
                                <div><h4 className="font-bold text-gray-800 mb-0.5 md:mb-1 text-sm md:text-base">{club.name}</h4><span className="text-xs text-gray-500 flex items-center justify-center gap-1"><Users size={12}/> {club.members} {language === 'th' ? 'คน' : 'people'}</span></div>
                            </div>
                        );
                    })}
                </div>
            ) : (<div className="p-10 md:p-16 text-center text-gray-400 bg-white rounded-2xl md:rounded-3xl border border-gray-200 border-dashed"><p className="text-base md:text-lg font-semibold">{language === 'th' ? 'ยังไม่มีชมรมในหมวดหมู่นี้' : 'No clubs in this category'}</p></div>)}
        </div>
    );
};
interface GoodnessTabProps {
    language: string;
    studentId?: string;
    studentName?: string;
    studentMajor?: string;
    studentYear?: string;
    studentInitials?: string;
    goodnessHistory?: GoodnessHistoryItem[];
    goodnessStats?: GoodnessCategoryStat[];
    onNavigateTab?: (tab: string) => void;
    onOpenPolicyModal?: () => void;
}

const GoodnessTab: React.FC<GoodnessTabProps> = ({ 
    language, 
    studentId = '68101001',
    studentName = 'นักศึกษา',
    studentMajor = 'สำนักวิชาสารสนเทศศาสตร์',
    studentYear = 'ปี 2',
    studentInitials = 'ST',
    goodnessHistory = [], 
    goodnessStats = [],
    onNavigateTab,
    onOpenPolicyModal
}) => {
    const [showAllHistory, setShowAllHistory] = useState(false);
    const totalPoints = goodnessHistory.reduce((sum, item) => sum + (Number(item?.points) || 0), 0);
    const displayedHistory = showAllHistory ? goodnessHistory : goodnessHistory.slice(0, 4);

    const passedCount = goodnessStats.filter(stat => (stat.current || 0) >= stat.target).length;
    const totalCategoryCount = goodnessStats.length || 5;

    // Walailak University graduation minimum threshold is 100 points
    const graduationTarget = 100;
    const overallProgressPercent = Math.min(100, (totalPoints / graduationTarget) * 100);

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-300 max-w-7xl mx-auto space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-indigo-600 font-semibold">
                            {language === 'th' ? 'มหาวิทยาลัยวลัยลักษณ์' : 'Walailak University'}
                        </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        {language === 'th' ? 'ระบบคะแนนความดี' : 'Goodness Points System'}
                    </h2>
                </div>

                {/* Current Student Profile Box */}
                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                        {studentInitials || 'ST'}
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-sm">{studentName}</span>
                            <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-gray-200 text-indigo-700">
                                {studentId}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {studentMajor} {studentYear ? `• ${studentYear}` : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 md:gap-8">
                {/* Hero Cumulative Points Card */}
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden w-full">
                    <div className="absolute top-[-40px] right-[-40px] w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 bg-purple-400/20 rounded-full blur-3xl"></div>
                    
                    <div className="flex items-center gap-2 mb-2 z-10">
                        <span className="text-xs font-semibold text-indigo-100 bg-white/15 px-3.5 py-1 rounded-full backdrop-blur-md border border-white/20">
                            {language === 'th' ? `ผ่านเกณฑ์ ${passedCount}/${totalCategoryCount} ด้าน` : `Passed ${passedCount}/${totalCategoryCount} Pillars`}
                        </span>
                    </div>

                    <h3 className="text-indigo-100 mb-4 md:mb-6 font-medium text-base md:text-lg z-10 text-center">
                        {language === 'th' ? `คะแนนความดีสะสมของคุณ (${studentName})` : `Cumulative Goodness Points for ${studentName}`}
                    </h3>

                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white flex flex-col items-center justify-center border-4 border-indigo-200 shadow-2xl z-10 transition-transform hover:scale-105">
                        <span className="text-4xl md:text-5xl font-black text-indigo-600 tracking-tight">
                            {totalPoints.toFixed(2)}
                        </span>
                        <span className="text-gray-500 font-semibold mt-1 text-sm md:text-base">
                            {language === 'th' ? 'คะแนนความดี' : 'Goodness Points'}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-1 font-mono">
                            ID: {studentId}
                        </span>
                    </div>

                    {/* Graduation Progress Indicator */}
                    <div className="w-full max-w-md mt-6 z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-indigo-100 font-medium">
                                {language === 'th' ? 'เกณฑ์มาตรฐานขั้นต่ำเพื่อสำเร็จการศึกษา (100 คะแนน)' : 'Minimum Graduation Target (100 pts)'}
                            </span>
                            <span className="font-bold text-white font-mono">
                                {Math.round(overallProgressPercent)}%
                            </span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className="bg-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                                style={{ width: `${overallProgressPercent}%` }}
                            ></div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-indigo-200">
                            {totalPoints >= graduationTarget ? (
                                <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                                    <CheckCircle2 size={13} />
                                    {language === 'th' ? 'สะสมครบเกณฑ์ขั้นต่ำ 100 คะแนนแล้ว' : 'Met minimum 100 pts requirement'}
                                </span>
                            ) : (
                                <span>
                                    {language === 'th' 
                                        ? `ต้องการอีก ${(graduationTarget - totalPoints).toFixed(2)} คะแนน เพื่อครบเกณฑ์` 
                                        : `Needs ${(graduationTarget - totalPoints).toFixed(2)} more pts`}
                                </span>
                            )}
                            {onOpenPolicyModal && (
                                <button 
                                    onClick={onOpenPolicyModal}
                                    className="underline hover:text-white transition-colors cursor-pointer"
                                >
                                    {language === 'th' ? 'อ่านเกณฑ์มหาวิทยาลัย' : 'View Guidelines'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                    {/* Left: Points History for this Student ID */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 h-fit overflow-hidden">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg md:text-xl text-gray-800">
                                    {language === 'th' ? 'ประวัติการรับคะแนน' : 'Points History'}
                                </h3>
                                <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                                    {goodnessHistory.length}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400 font-mono">
                                ID: {studentId}
                            </span>
                        </div>

                        {goodnessHistory.length === 0 ? (
                            <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-gray-200">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-3 shadow-xs">
                                    <Award size={28} />
                                </div>
                                <h4 className="font-bold text-gray-800 text-base mb-1">
                                    {language === 'th' ? 'ยังไม่มีประวัติการรับคะแนนความดี' : 'No Points History Yet'}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-4 leading-relaxed">
                                    {language === 'th'
                                        ? `รหัสนักศึกษา ${studentId} ยังไม่มีประวัติคะแนนความดี เมื่อเข้าร่วมกิจกรรมและเช็คชื่อผ่านแล้ว คะแนนจะบันทึกที่นี่โดยอัตโนมัติ`
                                        : `Student ID ${studentId} has no points history yet. Attend activities and check-in to accumulate points here.`}
                                </p>
                                {onNavigateTab && (
                                    <button
                                        type="button"
                                        onClick={() => onNavigateTab('activities')}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                                    >
                                        <Sparkles size={15} />
                                        {language === 'th' ? 'สำรวจกิจกรรมสะสมคะแนน' : 'Explore Activities'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 md:space-y-4">
                                {displayedHistory.map((item) => {
                                    let Icon = Award;
                                    let iconBg = 'bg-teal-50 text-teal-600';
                                    if(item.category === 'การมีจิตอาสา') { Icon = HeartHandshake; iconBg = 'bg-rose-50 text-rose-600'; }
                                    else if(item.category === 'การรู้วินัย') { Icon = Heart; iconBg = 'bg-amber-50 text-amber-600'; }
                                    else if(item.category === 'การพัฒนาภาวะผู้นำ') { Icon = Users; iconBg = 'bg-indigo-50 text-indigo-600'; }
                                    else if(item.category === 'ความกตัญญู') { Icon = BookOpen; iconBg = 'bg-blue-50 text-blue-600'; }
                                    
                                    return (
                                        <div key={item.id} className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-gray-100 flex items-start justify-between hover:bg-slate-100/80 transition-colors gap-2">
                                            <div className="flex items-start md:items-center gap-3 md:gap-4 overflow-hidden">
                                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-0 ${iconBg}`}>
                                                    <Icon size={18} className="md:w-5 md:h-5 w-4 h-4" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-bold text-gray-800 mb-0.5 md:mb-1 text-sm md:text-base break-words">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs md:text-sm text-gray-500">
                                                        {item.date} <span className="hidden sm:inline">•</span> <br className="sm:hidden" />
                                                        <span className="text-indigo-600 font-semibold">{translateCategory(item.category, language)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-emerald-600 font-bold text-sm md:text-lg flex-shrink-0 mt-1 md:mt-0 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 font-mono">
                                                +{Number(item.points).toFixed(3)}
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {goodnessHistory.length > 4 && (
                                    <button 
                                        onClick={() => setShowAllHistory(!showAllHistory)} 
                                        className="w-full py-2.5 md:py-3 mt-2 text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-sm cursor-pointer"
                                    >
                                        {showAllHistory 
                                            ? (language === 'th' ? 'ซ่อนประวัติบางส่วน' : 'Show Less') 
                                            : (language === 'th' ? `ดูประวัติทั้งหมด (${goodnessHistory.length} รายการ)` : `View All History (${goodnessHistory.length})`)}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Points by Category for this Student ID */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 h-fit overflow-hidden">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div>
                                <h3 className="font-bold text-lg md:text-xl text-gray-800">
                                    {language === 'th' ? 'รายละเอียดคะแนนแต่ละด้าน' : 'Points by Category'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {language === 'th' ? 'เกณฑ์คะแนนความดี 5 ด้าน ม.วลัยลักษณ์' : '5 WU Goodness Pillars'}
                                </p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                {passedCount}/{totalCategoryCount} {language === 'th' ? 'ด้านผ่านแล้ว' : 'passed'}
                            </span>
                        </div>

                        <div className="overflow-x-auto pb-2">
                            <table className="w-full text-left min-w-max">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100 text-xs md:text-sm">
                                        <th className="py-3 px-2">{language === 'th' ? 'ด้าน' : 'Category'}</th>
                                        <th className="py-3 px-2 text-center">{language === 'th' ? 'เป้าหมาย' : 'Target'}</th>
                                        <th className="py-3 px-2 text-center">{language === 'th' ? 'ปัจจุบัน' : 'Current'}</th>
                                        <th className="py-3 px-2 text-center">{language === 'th' ? 'ความคืบหน้า' : 'Progress'}</th>
                                        <th className="py-3 px-2 text-center">{language === 'th' ? 'สถานะ' : 'Status'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {goodnessStats.map((stat) => {
                                        const isPassed = (stat.current || 0) >= stat.target;
                                        const percent = Math.min(100, Math.round(((stat.current || 0) / stat.target) * 100));
                                        return (
                                            <tr key={stat.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3.5 px-2 font-bold text-gray-800 whitespace-nowrap">
                                                    {translateCategory(stat.name, language)}
                                                </td>
                                                <td className="py-3.5 px-2 text-center font-mono text-gray-500">
                                                    {stat.target.toFixed(1)}
                                                </td>
                                                <td className="py-3.5 px-2 text-center font-mono font-bold text-indigo-600">
                                                    {(stat.current || 0).toFixed(3)}
                                                </td>
                                                <td className="py-3.5 px-2 text-center w-28">
                                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                                                        {percent}%
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-2 text-center">
                                                    {isPassed ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-xs whitespace-nowrap border border-emerald-100">
                                                            <CheckCircle2 size={12} />
                                                            {language === 'th' ? 'ผ่านเกณฑ์' : 'Passed'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full text-xs whitespace-nowrap border border-amber-200">
                                                            {language === 'th' ? `ขาด ${(stat.target - stat.current).toFixed(1)}` : `Need ${(stat.target - stat.current).toFixed(1)}`}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span>
                                {language === 'th' 
                                    ? `ข้อมูลคำนวณเฉพาะรหัสนักศึกษา: ${studentId}` 
                                    : `Calculated exclusively for Student ID: ${studentId}`}
                            </span>
                            {onOpenPolicyModal && (
                                <button
                                    onClick={onOpenPolicyModal}
                                    className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                                >
                                    {language === 'th' ? 'ระเบียบเกณฑ์คะแนน' : 'Guidelines'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- แก้ไข: รับ onUpdateItem เข้ามาเพื่ออัปเดตไลก์/คอมเมนต์ในระบบกลาง ---
// --- แก้ไข: อัปเดตหน้า DetailView ให้ระบบไลก์และคอมเมนต์คำนวณตัวเลขได้ถูกต้อง ---
// --- หน้า DetailView ที่อัปเดตปุ่มไลก์ให้กดได้ครั้งเดียว ---
// สังเกตว่ามีการรับ prop onLike และ isAlreadyLiked เพิ่มเข้ามา
// --- แก้ไข: รองรับการยกเลิกการลงทะเบียนกิจกรรม/ชมรม ---
const DetailView = ({ item, onBack, onRegister, onCancelRegister, isAlreadyRegistered, onUpdateItem, onLike, isAlreadyLiked, language, clubs = [], currentUserName }: {
    item: any;
    onBack: () => void;
    onRegister: (item: any) => void;
    onCancelRegister: (item: any, reason?: string) => void;
    isAlreadyRegistered: boolean;
    onUpdateItem: (item: any) => void;
    onLike: (item: any) => void;
    isAlreadyLiked: boolean;
    language: string;
    clubs?: any[];
    currentUserName?: string;
}) => {
    const isClub = item.type === 'club';
    const isPersonal = item.type === 'personal';
    const Icon = item.icon || getCategoryIcon(item.category, item.name) || (isClub ? Users : ActivityIcon);
    const isFull = !isClub && !isPersonal && (item.currentParticipants >= item.maxParticipants);
    const isClubSuspended = isClub 
        ? (item.status === 'suspended') 
        : (clubs?.find(c => c.name === item.club)?.status === 'suspended');
    const isClubDeleted = isClub 
        ? (item.status === 'deleted') 
        : (clubs?.find(c => c.name === item.club)?.status === 'deleted');

    const [newComment, setNewComment] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleButtonClick = () => {
        if (!isAlreadyRegistered && !isFull && !isClubSuspended && !isClubDeleted) {
            onRegister(item);
        }
    };

    // ฟังก์ชันกดไลก์ (เอาเงื่อนไขการบล็อกออก เพื่อให้กดซ้ำได้)
    const handleLikeClick = () => {
        onLike(item); 
    };

    const submitComment = () => {
        if (!newComment.trim()) return;
        const updatedItem = {
            ...item,
            comments: [...(item.comments || []), { id: Date.now(), user: currentUserName || 'นักศึกษา', text: newComment }]
        };
        setNewComment('');
        onUpdateItem(updatedItem); 
    };

    return (
        <div className="bg-slate-50 min-h-full animate-in slide-in-from-right duration-300 relative pb-20">
            <div className="h-80 w-full relative">
                <img src={item.img} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <button onClick={onBack} className="absolute top-8 left-8 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"><ArrowLeft size={20} /></button>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="text-white">
                        {isClub ? <span className="text-sm font-semibold bg-indigo-500 px-3 py-1 rounded-full">{item.category}</span> : <span className="text-sm font-semibold bg-teal-500 px-3 py-1 rounded-full">{item.category}</span>}
                        <h1 className="text-4xl font-bold mt-3 text-white">{item.name || item.title}</h1>
                    </div>
                    {isClub && <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-lg rotate-3"><Icon size={32} /></div>}
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 -mt-4">
                <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 z-10 flex flex-col order-2 lg:order-1">
                    {isClub && (item.isNew || item.tag === 'ชมรมเปิดใหม่') && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200 rounded-2xl flex items-start gap-3.5 shadow-2xs">
                            <span className="text-2xl mt-0.5">✨</span>
                            <div>
                                <h4 className="text-sm font-bold text-purple-900">
                                    {language === 'th' ? '🎉 ชมรมใหม่ที่ได้รับอนุมัติการจัดตั้งอย่างเป็นทางการ' : '🎉 Newly Approved University Club'}
                                </h4>
                                <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                                    {language === 'th' 
                                        ? 'ได้รับการอนุมัติคำขอจัดตั้งชมรมจากฝ่ายพัฒนานักศึกษา และเปิดรับสมัครสมาชิกพร้อมจัดกิจกรรมในระบบ WU Club แล้ว' 
                                        : 'Official club proposal approved by Student Affairs. Now welcoming new student members!'}
                                </p>
                            </div>
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{language === 'th' ? 'รายละเอียด' : 'Details'}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{item.desc || (language === 'th' ? 'พบกับกิจกรรมที่น่าสนใจมากมายที่จะทำให้คุณได้พัฒนาทักษะและรู้จักเพื่อนใหม่ มาร่วมเป็นส่วนหนึ่งของประสบการณ์ที่ดีในรั้วมหาวิทยาลัยวลัยลักษณ์ด้วยกันนะคะ' : 'Discover exciting activities to develop your skills and meet new friends. Join us and be part of a great experience at Walailak University.')}</p>
                    <div className="mt-8 mb-8">
                         <h3 className="text-lg font-bold text-gray-800 mb-4">{language === 'th' ? 'รูปภาพบรรยากาศ' : 'Gallery'}</h3>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="h-48 bg-slate-200 rounded-xl overflow-hidden"><img src="https://placehold.co/400x300/e2e8f0/64748b?text=Photo+1" className="w-full h-full object-cover"/></div>
                             <div className="h-48 bg-slate-200 rounded-xl overflow-hidden"><img src="https://placehold.co/400x300/e2e8f0/64748b?text=Photo+2" className="w-full h-full object-cover"/></div>
                         </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">{language === 'th' ? 'ความคิดเห็นและการมีส่วนร่วม' : 'Comments & Engagement'}</h3>
                        
                        <div className="flex items-center gap-4 mb-8">
                            {/* เอา disabled ออก เพื่อให้สามารถกดกี่ครั้งก็ได้ */}
                            <button 
                                onClick={handleLikeClick} 
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${isAlreadyLiked ? 'bg-pink-50 text-pink-600' : 'bg-slate-50 text-gray-600 hover:bg-slate-100 active:scale-95'}`}
                            >
                                <Heart size={20} className={isAlreadyLiked ? 'fill-pink-500 text-pink-500' : ''} /> 
                                {Number(item.likes) || 0} {language === 'th' ? 'ถูกใจ' : 'Likes'}
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {(item.comments || []).length > 0 ? (
                                item.comments.map((comment, idx) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex gap-4">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            {comment.user.substring(0, 1)}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-sm text-gray-800">{comment.user}</h5>
                                            <p className="text-gray-600 mt-1 text-sm">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 italic text-sm">{language === 'th' ? 'ยังไม่มีความคิดเห็น เป็นคนแรกที่คอมเมนต์สิ!' : 'No comments yet. Be the first to comment!'}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder={language === 'th' ? "เขียนความคิดเห็นของคุณ..." : "Write your comment..."} 
                                className="flex-1 bg-slate-100 border-none rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                            />
                            <button onClick={submitComment} className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition-colors flex-shrink-0">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80 space-y-6 z-10 order-1 lg:order-2">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-4">{language === 'th' ? 'ข้อมูลสำคัญ' : 'Key Information'}</h4>
                        <div className="space-y-4">
                            {isClub ? (
                                <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mr-3"><Users size={20} /></div><div><p className="text-xs text-gray-400">{language === 'th' ? 'จำนวนสมาชิก' : 'Members'}</p><p className="font-semibold">{item.members} {language === 'th' ? 'คน' : 'people'}</p></div></div>
                            ) : (
                                <>
                                    <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mr-3"><Calendar size={20} /></div><div><p className="text-xs text-gray-400">{language === 'th' ? 'วันที่จัดกิจกรรม' : 'Date'}</p><p className="font-semibold">{item.date}</p></div></div>
                                    <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 mr-3"><MapPin size={20} /></div><div><p className="text-xs text-gray-400">{language === 'th' ? 'สถานที่' : 'Location'}</p><p className="font-semibold">{item.location || (language === 'th' ? 'มหาวิทยาลัยวลัยลักษณ์' : 'Walailak University')}</p></div></div>
                                    {isPersonal ? (
                                        <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3"><Clock size={20} /></div><div><p className="text-xs text-gray-400">{language === 'th' ? 'เวลา' : 'Time'}</p><p className="font-semibold">{item.time || '-'}</p></div></div>
                                    ) : (
                                        <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3"><Users size={20} /></div><div><p className="text-xs text-gray-400">{language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'}</p><p className={`font-semibold ${isFull ? 'text-red-500' : ''}`}>{item.currentParticipants} / {item.maxParticipants} {language === 'th' ? 'คน' : 'people'}</p></div></div>
                                    )}
                                    {item.goodnessCategory !== '-' && (
                                        <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 mr-3"><Award size={20} /></div><div><p className="text-xs text-gray-400">คะแนนความดี (+{item.goodnessPoints})</p><p className="font-semibold">{item.goodnessCategory}</p></div></div>
                                    )}
                                 </>
                            )}
                        </div>

                        {isClubDeleted && (
                            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
                                <Trash2 size={18} className="text-rose-600 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <p className="font-bold text-rose-900">{language === 'th' ? '🗑️ ชมรมนี้ถูกลบโดยผู้ดูแลระบบ' : '🗑️ Club Deleted by Admin'}</p>
                                    <p className="text-rose-700 mt-0.5 leading-normal">{language === 'th' ? 'ชมรมนี้อยู่ในถังขยะและมีระยะเวลารอกู้คืนภายใน 3 วัน จึงงดให้บริการแก่นักศึกษา' : 'Club deleted and currently in 3-day recovery trash.'}</p>
                                </div>
                            </div>
                        )}

                        {isClubSuspended && !isClubDeleted && (
                            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
                                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <p className="font-bold text-rose-900">{language === 'th' ? 'ชมรมนี้ถูกระงับการดำเนินงานชั่วคราว' : 'Club Suspended'}</p>
                                    <p className="text-rose-700 mt-0.5 leading-normal">{language === 'th' ? 'งดรับสมัครสมาชิกและงดลงทะเบียนกิจกรรมตามคำสั่งฝ่ายพัฒนานักศึกษา' : 'Registration is locked during suspension.'}</p>
                                </div>
                            </div>
                        )}
                        
                        {isAlreadyRegistered ? (
                            <div className="mt-6 space-y-2.5">
                                <div className="w-full font-bold rounded-xl py-3 bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-sm text-base">
                                    <CheckCircle2 size={20} />
                                    <span>{isClub ? (language === 'th' ? 'สมัครเป็นสมาชิกแล้ว' : 'Joined Club') : (language === 'th' ? 'ลงทะเบียนสำเร็จแล้ว' : 'Registered')}</span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setShowCancelModal(true)}
                                    className="w-full font-semibold rounded-xl py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
                                >
                                    <X size={16} />
                                    <span>{isClub ? (language === 'th' ? 'ยกเลิกการเป็นสมาชิกชมรม' : 'Leave Club') : (language === 'th' ? 'ยกเลิกการลงทะเบียนกิจกรรม' : 'Cancel Registration')}</span>
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleButtonClick}
                                disabled={isFull || isPersonal || isClubSuspended || isClubDeleted}
                                className={`w-full font-bold rounded-xl py-3 mt-6 shadow-md transition-all ${
                                    isClubDeleted || isClubSuspended
                                        ? 'bg-rose-100 text-rose-700 border border-rose-200 cursor-not-allowed shadow-none'
                                        : isPersonal 
                                        ? 'bg-indigo-100 text-indigo-500 cursor-default shadow-none' 
                                        : isFull 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                                }`}
                            >
                                {isClubDeleted
                                    ? (language === 'th' ? 'ชมรมถูกลบ (อยู่ในถังขยะ)' : 'Club in Trash')
                                    : isClubSuspended
                                    ? (language === 'th' ? 'ชมรมถูกระงับ (งดรับสมัคร)' : 'Suspended (Unavailable)')
                                    : isPersonal 
                                    ? (language === 'th' ? 'กิจกรรมส่วนตัว (ปฏิทิน)' : 'Personal Activity') 
                                    : isFull 
                                    ? (language === 'th' ? 'ผู้เข้าร่วมเต็มแล้ว' : 'Full') 
                                    : (isClub ? (language === 'th' ? 'สมัครเข้าร่วมชมรม' : 'Join Club') : (language === 'th' ? 'ลงทะเบียนเข้าร่วมกิจกรรม' : 'Register'))}
                            </button>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-4">{language === 'th' ? 'ช่องทางติดต่อ' : 'Contact Options'}</h4>
                        <div className="flex justify-around">
                            <a href="#" className="w-12 h-12 bg-green-500 hover:bg-green-600 transition-colors text-white rounded-full flex items-center justify-center shadow-sm"><MessageCircle size={24} /></a>
                            <a href="#" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-full flex items-center justify-center shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                            <a href="#" className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 hover:opacity-90 transition-opacity text-white rounded-full flex items-center justify-center shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
                        </div>
                    </div>
                </div>
            </div>

            {isClub ? (
                <ConfirmModal
                    isOpen={showCancelModal}
                    title={language === 'th' ? 'ยืนยันการออกจากชมรม' : 'Leave Club Confirmation'}
                    message={language === 'th' ? `คุณต้องการยกเลิกการเป็นสมาชิกชมรม "${item.name}" ใช่หรือไม่?` : `Are you sure you want to leave "${item.name}"?`}
                    confirmText={language === 'th' ? 'ยืนยันออกจากชมรม' : 'Leave Club'}
                    cancelText={language === 'th' ? 'ย้อนกลับ' : 'Back'}
                    confirmVariant="danger"
                    onConfirm={() => {
                        setShowCancelModal(false);
                        onCancelRegister?.(item);
                    }}
                    onCancel={() => setShowCancelModal(false)}
                />
            ) : (
                <CancelActivityModal
                    isOpen={showCancelModal}
                    activityTitle={item.title || item.name || ''}
                    clubName={item.club}
                    language={language}
                    onConfirm={(reason) => {
                        setShowCancelModal(false);
                        onCancelRegister?.(item, reason);
                    }}
                    onCancel={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
};


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGuestBrowsingClubs, setIsGuestBrowsingClubs] = useState(false);
    const [language, setLanguage] = useState('th');
    const [loginRole, setLoginRole] = useState('student');
    const [loginClubName, setLoginClubName] = useState('');
    const [currentTab, setCurrentTab] = useState('home');
    const [profileImg, setProfileImg] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showChatbot, setShowChatbot] = useState(false);

    // --- Local Storage Persistence สำหรับชมรมและกิจกรรม (ข้อมูลคงอยู่ถาวรในเครื่อง) ---
    const [globalClubs, setGlobalClubs] = useState<Club[]>(() => 
        loadClubsFromStorage(INITIAL_CLUBS as unknown as Club[], getCategoryIcon)
    );
    const [globalActivities, setGlobalActivities] = useState<Activity[]>(() => 
        loadActivitiesFromStorage(INITIAL_ACTIVITIES as unknown as Activity[])
    );
    const [globalMembers, setGlobalMembers] = useState<Member[]>(() => 
        getStorageItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS)
    );
    const [globalProposals, setGlobalProposals] = useState<ClubProposal[]>(() => 
        getStorageItem(STORAGE_KEYS.PROPOSALS, INITIAL_PROPOSALS)
    );
    const [globalPolicies, setGlobalPolicies] = useState<PolicyRule[]>(() => 
        getStorageItem(STORAGE_KEYS.POLICIES, INITIAL_POLICIES)
    );
    // --- จัดการประวัติและสถิติคะแนนความดีแยกตามรหัสนักศึกษา (1 ID ต่อ 1 ข้อมูล) ---
    const [goodnessHistoryByStudent, setGoodnessHistoryByStudent] = useState<Record<string, GoodnessHistoryItem[]>>(() => {
        const saved = getStorageItem<Record<string, GoodnessHistoryItem[]> | null>(STORAGE_KEYS.GOODNESS_HISTORY_BY_STUDENT, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        return INITIAL_GOODNESS_HISTORY_BY_STUDENT;
    });

    const [goodnessStatsByStudent, setGoodnessStatsByStudent] = useState<Record<string, GoodnessCategoryStat[]>>(() => {
        const saved = getStorageItem<Record<string, GoodnessCategoryStat[]> | null>(STORAGE_KEYS.GOODNESS_STATS_BY_STUDENT, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        return INITIAL_GOODNESS_STATS_BY_STUDENT;
    });
    const [clubCredentials, setClubCredentials] = useState<Record<string, { password: string; name: string; isNew?: boolean }>>(() => 
        getStorageItem(STORAGE_KEYS.CREDENTIALS, CLUB_CREDENTIALS)
    );

    // --- จัดการรหัสนักศึกษาและความชอบแยกตามรหัส ---
    const [currentStudentId, setCurrentStudentId] = useState<string>(() => 
        getStorageItem(STORAGE_KEYS.CURRENT_STUDENT_ID, '68101001')
    );
    const [userPrefsMap, setUserPrefsMap] = useState<Record<string, string[]>>(() => {
        const saved = getStorageItem<Record<string, string[]> | null>(STORAGE_KEYS.USER_PREFERENCES, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        return {
            '68101001': ['กีฬา'],
            '68101002': ['ไลฟ์สไตล์']
        };
    });
    const [userPrefs, setUserPrefs] = useState<string[]>([]);
    const [showPrefsModal, setShowPrefsModal] = useState(false);
    const [isFirstLogin, setIsFirstLogin] = useState(true); 

    // --- บันทึกรายงานการยกเลิกกิจกรรมพร้อมเหตุผลจากนักศึกษา เพื่อส่งให้ชมรมดู ---
    const [globalCancellationReports, setGlobalCancellationReports] = useState<CancellationReport[]>(() => {
        const saved = getStorageItem<CancellationReport[] | null>(STORAGE_KEYS.CANCELLATION_REPORTS, null);
        if (saved && Array.isArray(saved)) return saved;
        return [
            {
                id: 'cancel-initial-1',
                activityId: 3,
                activityTitle: 'Boardgame Night',
                clubName: 'ชมรมบอร์ดเกม',
                studentId: '68101003',
                studentName: 'อลิสา ปัญญางาม',
                studentMajor: 'การบัญชี ปี 1',
                reason: 'ติดเรียนชดเชยวิชาบังคับช่วงเย็น ไม่สามารถเดินทางมาร่วมงานได้',
                timestamp: '22 ก.ย. 2569 16:40 น.',
                createdAt: Date.now() - 7200000,
            }
        ];
    });

    // --- จัดการโปรไฟล์นักศึกษาแยกตามรหัส (แก้ไขชื่อเฉพาะไอดีตนเองได้) ---
    const [studentProfilesMap, setStudentProfilesMap] = useState<Record<string, StudentProfile>>(() => {
        const saved = getStorageItem<Record<string, StudentProfile> | null>(STORAGE_KEYS.STUDENT_PROFILES, null);
        if (saved && typeof saved === 'object') return { ...DEFAULT_STUDENT_PROFILES, ...saved };
        return DEFAULT_STUDENT_PROFILES;
    });

    // --- ข้อมูลที่ผูกกับรหัสนักศึกษา: กิจกรรมที่ลงทะเบียน / ชมรมที่เข้าร่วม / ไลก์ / ปฏิทินส่วนตัว แยกตามรหัสเด็ดขาด ---
    const [joinedActivitiesByStudent, setJoinedActivitiesByStudent] = useState<Record<string, any[]>>(() => {
        const saved = getStorageItem<Record<string, any[]> | null>(STORAGE_KEYS.JOINED_ACTIVITIES_BY_STUDENT, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        // ป้องกันข้อมูลหลุดไปหาคนอื่น: กิจกรรมเดิมผูกกับ 68101001 เท่านั้น ส่วนคนอื่นเริ่มต้นเป็น []
        const oldJoined = getStorageItem<any[]>(STORAGE_KEYS.JOINED_ACTIVITIES, [1]);
        return {
            '68101001': Array.isArray(oldJoined) ? oldJoined : [1],
            '68101002': [],
            '68101003': [],
            '68101004': []
        };
    });

    const [joinedClubsByStudent, setJoinedClubsByStudent] = useState<Record<string, any[]>>(() => {
        const saved = getStorageItem<Record<string, any[]> | null>(STORAGE_KEYS.JOINED_CLUBS_BY_STUDENT, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        // ป้องกันข้อมูลหลุดไปหาคนอื่น: ชมรมเดิมผูกกับ 68101001 เท่านั้น ส่วนคนอื่นเริ่มต้นเป็น []
        const oldJoined = getStorageItem<any[]>(STORAGE_KEYS.JOINED_CLUBS, [1]);
        return {
            '68101001': Array.isArray(oldJoined) ? oldJoined : [1],
            '68101002': [],
            '68101003': [],
            '68101004': []
        };
    });

    const [likedActivitiesByStudent, setLikedActivitiesByStudent] = useState<Record<string, any[]>>(() => {
        const saved = getStorageItem<Record<string, any[]> | null>(STORAGE_KEYS.LIKED_ACTIVITIES_BY_STUDENT, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        const old = getStorageItem<any[]>(STORAGE_KEYS.LIKED_ACTIVITIES, []);
        return {
            '68101001': Array.isArray(old) ? old : [],
            '68101002': [],
            '68101003': [],
            '68101004': []
        };
    });

    const [likedClubsByStudent, setLikedClubsByStudent] = useState<Record<string, any[]>>(() => {
        const saved = getStorageItem<Record<string, any[]> | null>(STORAGE_KEYS.LIKED_CLUBS_BY_STUDENT, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        const old = getStorageItem<any[]>(STORAGE_KEYS.LIKED_CLUBS, []);
        return {
            '68101001': Array.isArray(old) ? old : [],
            '68101002': [],
            '68101003': [],
            '68101004': []
        };
    });

    const [personalEventsByStudent, setPersonalEventsByStudent] = useState<Record<string, any[]>>(() => {
        const saved = getStorageItem<Record<string, any[]> | null>(STORAGE_KEYS.PERSONAL_EVENTS_BY_STUDENT, null);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
        const old = getStorageItem<any[]>(STORAGE_KEYS.PERSONAL_EVENTS, []);
        return {
            '68101001': Array.isArray(old) ? old : [],
            '68101002': [],
            '68101003': [],
            '68101004': []
        };
    });

    // ดึงโปรไฟล์และข้อมูลเฉพาะของรหัสนักศึกษาปัจจุบัน (Active Student)
    const activeStudentId = (currentStudentId || '68101001').trim();
    const currentStudent = getStudentProfile(activeStudentId, studentProfilesMap);

    // ดึงข้อมูลคะแนนความดีเฉพาะรหัสนักศึกษาปัจจุบัน (1 ID ต่อ 1 ข้อมูล)
    const activeStudentGoodnessHistory = useMemo(() => {
        return getStudentGoodnessHistory(activeStudentId, goodnessHistoryByStudent);
    }, [activeStudentId, goodnessHistoryByStudent]);

    const activeStudentGoodnessStats = useMemo(() => {
        return getStudentGoodnessStats(activeStudentId, goodnessStatsByStudent);
    }, [activeStudentId, goodnessStatsByStudent]);

    const activeStudentTotalGoodnessPoints = useMemo(() => {
        return activeStudentGoodnessHistory.reduce((sum, item) => sum + (Number(item?.points) || 0), 0);
    }, [activeStudentGoodnessHistory]);

    const joinedActivities = joinedActivitiesByStudent[activeStudentId] || [];
    const joinedClubs = joinedClubsByStudent[activeStudentId] || [];
    const likedActivities = likedActivitiesByStudent[activeStudentId] || [];
    const likedClubs = likedClubsByStudent[activeStudentId] || [];
    const globalPersonalEvents = personalEventsByStudent[activeStudentId] || [];

    const setJoinedActivities = (updater: any[] | ((prev: any[]) => any[])) => {
        setJoinedActivitiesByStudent(prevMap => {
            const currentList = prevMap[activeStudentId] || [];
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;
            return { ...prevMap, [activeStudentId]: nextList };
        });
    };

    const setJoinedClubs = (updater: any[] | ((prev: any[]) => any[])) => {
        setJoinedClubsByStudent(prevMap => {
            const currentList = prevMap[activeStudentId] || [];
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;
            return { ...prevMap, [activeStudentId]: nextList };
        });
    };

    const setLikedActivities = (updater: any[] | ((prev: any[]) => any[])) => {
        setLikedActivitiesByStudent(prevMap => {
            const currentList = prevMap[activeStudentId] || [];
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;
            return { ...prevMap, [activeStudentId]: nextList };
        });
    };

    const setLikedClubs = (updater: any[] | ((prev: any[]) => any[])) => {
        setLikedClubsByStudent(prevMap => {
            const currentList = prevMap[activeStudentId] || [];
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;
            return { ...prevMap, [activeStudentId]: nextList };
        });
    };

    const setGlobalPersonalEvents = (updater: any[] | ((prev: any[]) => any[])) => {
        setPersonalEventsByStudent(prevMap => {
            const currentList = prevMap[activeStudentId] || [];
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;
            return { ...prevMap, [activeStudentId]: nextList };
        });
    };

    const handleUpdateStudentName = (newName: string) => {
        if (!newName.trim()) return;
        const trimmed = newName.trim();
        setStudentProfilesMap(prev => ({
            ...prev,
            [activeStudentId]: {
                ...currentStudent,
                name: trimmed,
                initials: trimmed.slice(0, 2)
            }
        }));
        showToast(language === 'th' ? `อัปเดตชื่อเป็น "${trimmed}" เรียบร้อยแล้ว` : 'Name updated successfully', 'success');
    };

    // Sync การเปลี่ยนแปลงลงใน Local Storage โดยอัตโนมัติ
    useEffect(() => {
        saveClubsToStorage(globalClubs);
    }, [globalClubs]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.ACTIVITIES, globalActivities);
    }, [globalActivities]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.MEMBERS, globalMembers);
    }, [globalMembers]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.PROPOSALS, globalProposals);
    }, [globalProposals]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.POLICIES, globalPolicies);
    }, [globalPolicies]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.GOODNESS_HISTORY_BY_STUDENT, goodnessHistoryByStudent);
    }, [goodnessHistoryByStudent]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.GOODNESS_STATS_BY_STUDENT, goodnessStatsByStudent);
    }, [goodnessStatsByStudent]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.CREDENTIALS, clubCredentials);
    }, [clubCredentials]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.JOINED_ACTIVITIES_BY_STUDENT, joinedActivitiesByStudent);
        setStorageItem(STORAGE_KEYS.JOINED_ACTIVITIES, joinedActivities);
    }, [joinedActivitiesByStudent, joinedActivities]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.JOINED_CLUBS_BY_STUDENT, joinedClubsByStudent);
        setStorageItem(STORAGE_KEYS.JOINED_CLUBS, joinedClubs);
    }, [joinedClubsByStudent, joinedClubs]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.LIKED_ACTIVITIES_BY_STUDENT, likedActivitiesByStudent);
        setStorageItem(STORAGE_KEYS.LIKED_ACTIVITIES, likedActivities);
    }, [likedActivitiesByStudent, likedActivities]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.LIKED_CLUBS_BY_STUDENT, likedClubsByStudent);
        setStorageItem(STORAGE_KEYS.LIKED_CLUBS, likedClubs);
    }, [likedClubsByStudent, likedClubs]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.PERSONAL_EVENTS_BY_STUDENT, personalEventsByStudent);
        setStorageItem(STORAGE_KEYS.PERSONAL_EVENTS, globalPersonalEvents);
    }, [personalEventsByStudent, globalPersonalEvents]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.STUDENT_PROFILES, studentProfilesMap);
    }, [studentProfilesMap]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.CURRENT_STUDENT_ID, currentStudentId);
    }, [currentStudentId]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.USER_PREFERENCES, userPrefsMap);
    }, [userPrefsMap]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.CANCELLATION_REPORTS, globalCancellationReports);
    }, [globalCancellationReports]);

    const handleResetStorageData = () => {
        clearAllWuStorage();
        setGlobalClubs(INITIAL_CLUBS as unknown as Club[]);
        setGlobalActivities(INITIAL_ACTIVITIES as unknown as Activity[]);
        setGlobalMembers(INITIAL_MEMBERS);
        setGlobalProposals(INITIAL_PROPOSALS);
        setGlobalPolicies(INITIAL_POLICIES);
        setClubCredentials(CLUB_CREDENTIALS);
        setGoodnessHistoryByStudent(INITIAL_GOODNESS_HISTORY_BY_STUDENT);
        setGoodnessStatsByStudent(INITIAL_GOODNESS_STATS_BY_STUDENT);
        setGlobalCancellationReports([]);
        setJoinedActivitiesByStudent({
            '68101001': [1],
            '68101002': [],
            '68101003': [],
            '68101004': []
        });
        setJoinedClubsByStudent({
            '68101001': [1],
            '68101002': [],
            '68101003': [],
            '68101004': []
        });
        setLikedActivitiesByStudent({
            '68101001': [],
            '68101002': [],
            '68101003': [],
            '68101004': []
        });
        setLikedClubsByStudent({
            '68101001': [],
            '68101002': [],
            '68101003': [],
            '68101004': []
        });
        setPersonalEventsByStudent({
            '68101001': [],
            '68101002': [],
            '68101003': [],
            '68101004': []
        });
        setStudentProfilesMap(DEFAULT_STUDENT_PROFILES);
        setUserPrefsMap({
            '68101001': ['กีฬา'],
            '68101002': ['ไลฟ์สไตล์']
        });
        setUserPrefs([]);
        setCurrentStudentId('68101001');
        showToast(language === 'th' ? 'คืนค่าข้อมูลเริ่มต้นเรียบร้อยแล้ว' : 'Reset to default data successfully', 'success');
    };

    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [attendanceActivity, setAttendanceActivity] = useState<Activity | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const handleAddClubCredential = (username: string, cred: { password: string; name: string; isNew?: boolean }) => {
        setClubCredentials(prev => ({
            ...prev,
            [username]: cred,
        }));
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
        setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleConfirmAttendance = (activityId: number, attendedStudentIds: string[]) => {
        const act = globalActivities.find(a => a.id === activityId);
        if (!act) return;

        setGlobalActivities(prev => prev.map(a => 
            a.id === activityId 
                ? { ...a, attendanceList: Array.from(new Set([...(a.attendanceList || []), ...attendedStudentIds])) } 
                : a
        ));

        if (act.goodnessCategory && act.goodnessCategory !== '-' && act.goodnessPoints > 0) {
            const pts = Number(act.goodnessPoints) || 0;
            const todayStr = 'วันนี้';

            setGoodnessHistoryByStudent(prevMap => {
                const updatedMap = { ...prevMap };
                attendedStudentIds.forEach((sid, index) => {
                    const studentHistory = updatedMap[sid] ? [...updatedMap[sid]] : [];
                    const newRecord: GoodnessHistoryItem = {
                        id: `gh-${sid}-${activityId}-${Date.now()}-${index}`,
                        title: act.title,
                        category: act.goodnessCategory,
                        points: pts,
                        date: todayStr
                    };
                    updatedMap[sid] = [newRecord, ...studentHistory];
                });
                return updatedMap;
            });

            setGoodnessStatsByStudent(prevMap => {
                const updatedStatsMap = { ...prevMap };
                attendedStudentIds.forEach((sid) => {
                    const studentStats = getStudentGoodnessStats(sid, updatedStatsMap);
                    updatedStatsMap[sid] = studentStats.map(stat => 
                        stat.name === act.goodnessCategory 
                            ? { ...stat, current: Number((stat.current + pts).toFixed(3)) }
                            : stat
                    );
                });
                return updatedStatsMap;
            });
        }

        setAttendanceActivity(null);
        showToast(
            language === 'th' 
                ? `บันทึกการเช็คชื่อ ${attendedStudentIds.length} คน และตัดคะแนนความดีเข้า ID รายบุคคลเรียบร้อยแล้ว` 
                : `Recorded attendance for ${attendedStudentIds.length} students and awarded goodness points per ID`, 
            'success'
        );
    };

    const [chatHistory, setChatHistory] = useState([{ sender: 'ai', text: 'มีอะไรให้ช่วยแนะนำไหมคะ? 😊' }]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatContainerRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, showChatbot]);

    const getClientSmartReply = (input: string) => {
        const msg = (input || '').toLowerCase();
        if (msg.includes('คะแนน') || msg.includes('ความดี') || msg.includes('เกณฑ์') || msg.includes('5 ด้าน')) {
            return `🌟 **เกณฑ์การสะสมคะแนนความดี 5 ด้าน มหาวิทยาลัยวลัยลักษณ์** (เป้าหมายรวม 100 คะแนน เพื่อสำเร็จการศึกษา):

1. **การมีจิตอาสา** - เป้าหมาย 33 คะแนน
2. **การพัฒนาภาวะผู้นำ** - เป้าหมาย 33 คะแนน
3. **การรู้วินัย** - เป้าหมาย 14 คะแนน
4. **ความกตัญญู** - เป้าหมาย 10 คะแนน
5. **ความรักชาติ** - เป้าหมาย 10 คะแนน

💡 ข้อมูลคะแนนความดีของคุณ (${activeStudentId}) สะสมแล้ว: ${activeStudentTotalGoodnessPoints.toFixed(2)} คะแนน สามารถเข้าร่วมกิจกรรมของชมรมต่างๆ เพื่อสะสมคะแนนในแต่ละด้านได้ตลอดปีการศึกษาครับ!`;
        }
        if (msg.includes('กิจกรรม') || msg.includes('activity') || msg.includes('แนะนำกิจกรรม') || msg.includes('แนะนำ')) {
            const userNeeds = activeStudentGoodnessStats.filter(s => s.current < s.target).map(s => `${s.name} (ขาดอีก ${(s.target - s.current).toFixed(1)})`);
            const acts = globalActivities.slice(0, 3);
            const actList = acts.map(a => `• **${a.title}** (ชมรม${a.club}) - วันที่ ${a.date} (+${a.goodnessPoints} ด้าน${a.goodnessCategory})`).join('\n');
            return `กิจกรรมแนะนำใน ม.วลัยลักษณ์ ตอนนี้ครับ ✨\n\n${actList}\n\n${userNeeds.length > 0 ? `🎯 **ด้านที่แนะนำให้เก็บเพิ่ม**: ${userNeeds.join(', ')}\n` : ''}สามารถกดดูรายละเอียดและลงทะเบียนในแท็บ "กิจกรรม" ได้เลยครับ! 😊`;
        }
        if (msg.includes('ชมรม') || msg.includes('club')) {
            const clubList = globalClubs.slice(0, 3).map(c => `• **${c.name}** (${c.category}): ${c.desc}`).join('\n');
            return `ชมรมยอดนิยมที่น่าสนใจใน ม.วลัยลักษณ์ ครับ 🏛️✨\n\n${clubList}\n\nสนใจเข้าร่วมชมรมไหน ไปที่แท็บ "ค้นหาชมรม" เพื่อกดสมัครได้เลยครับ!`;
        }
        if (msg.includes('ระเบียบ') || msg.includes('จัดตั้ง') || msg.includes('เวลา')) {
            return `📌 **ระเบียบกิจกรรมและชมรม ม.วลัยลักษณ์**:
• **เวลาจัดกิจกรรม**: 06:00 - 21:00 น. (กิจกรรมนอกสถานที่ต้องขออนุญาตล่วงหน้า 14 วันทำการ)
• **การขอจัดตั้งชมรมใหม่**: ต้องมีผู้ร่วมก่อตั้งไม่น้อยกว่า 3 คน และมีอาจารย์ที่ปรึกษาประจำชมรม 1 คน ยื่นคำขอผ่านระบบได้เลยครับ!`;
        }
        return `สวัสดีครับ! WU AI ยินดีช่วยเหลือครับ ✨ สามารถสอบถามเกี่ยวกับ:\n• แนะนำกิจกรรมและชมรมที่ตรงความชอบ\n• เกณฑ์คะแนนความดี 5 ด้าน (รวม 100 คะแนน)\n• ระเบียบการจัดกิจกรรมและการขอจัดตั้งชมรม\nสอบถามได้ตลอดเลยนะครับ! 😊`;
    };

    const handleSendChat = async (presetText?: string) => {
        const textToSend = (typeof presetText === 'string' ? presetText : chatInput).trim();
        if (!textToSend || isChatLoading) return;
        
        setChatInput('');
        setChatHistory(prev => [...prev, { sender: 'user', text: textToSend }]);
        setIsChatLoading(true);

        try {
            const contextData = loginRole === 'student' ? {
                studentId: activeStudentId,
                studentName: currentStudent.name,
                preferences: userPrefs,
                goodnessStats: activeStudentGoodnessStats,
                goodnessHistory: activeStudentGoodnessHistory,
                totalGoodnessPoints: activeStudentTotalGoodnessPoints,
                clubs: globalClubs.map(c => ({ name: c.name, category: c.category, desc: c.desc })),
                activities: globalActivities.map(a => ({ title: a.title, club: a.club, category: a.category, date: a.date, goodnessCategory: a.goodnessCategory, goodnessPoints: a.goodnessPoints, currentParticipants: a.currentParticipants, maxParticipants: a.maxParticipants }))
            } : {
                clubName: loginClubName,
                activities: globalActivities.filter(a => a.club === loginClubName).map(a => ({ title: a.title, category: a.category }))
            };

            const controller = new AbortController();
            const timeoutTimer = setTimeout(() => controller.abort(), 12000);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    message: textToSend,
                    role: loginRole,
                    context: contextData,
                    stream: true
                })
            });

            clearTimeout(timeoutTimer);

            if (!response.ok) {
                const smartReply = getClientSmartReply(textToSend);
                setChatHistory(prev => [...prev, { sender: 'ai', text: smartReply }]);
                return;
            }

            let accumulated = '';
            let hasStreamed = false;

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let lineBuffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    lineBuffer += decoder.decode(value, { stream: true });
                    const lines = lineBuffer.split('\n');
                    lineBuffer = lines.pop() || '';

                    for (const rawLine of lines) {
                        const line = rawLine.trim();
                        if (!line.startsWith('data:')) continue;
                        const dataStr = line.replace(/^data:\s*/, '').trim();
                        if (dataStr === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.text) {
                                accumulated += parsed.text;
                                if (!hasStreamed) {
                                    hasStreamed = true;
                                    setIsChatLoading(false); // Immediate visual feedback
                                    setChatHistory(prev => [...prev, { sender: 'ai', text: accumulated }]);
                                } else {
                                    setChatHistory(prev => {
                                        const next = [...prev];
                                        next[next.length - 1] = { sender: 'ai', text: accumulated };
                                        return next;
                                    });
                                }
                            }
                        } catch {
                            // Ignore non-json lines
                        }
                    }
                }

                // Process any trailing line left in lineBuffer
                if (lineBuffer.trim().startsWith('data:')) {
                    const dataStr = lineBuffer.trim().replace(/^data:\s*/, '').trim();
                    if (dataStr !== '[DONE]') {
                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.text) {
                                accumulated += parsed.text;
                                if (!hasStreamed) {
                                    hasStreamed = true;
                                    setIsChatLoading(false);
                                    setChatHistory(prev => [...prev, { sender: 'ai', text: accumulated }]);
                                } else {
                                    setChatHistory(prev => {
                                        const next = [...prev];
                                        next[next.length - 1] = { sender: 'ai', text: accumulated };
                                        return next;
                                    });
                                }
                            }
                        } catch {}
                    }
                }
            }

            if (!hasStreamed || !accumulated.trim()) {
                const smartReply = getClientSmartReply(textToSend);
                setChatHistory(prev => [...prev, { sender: 'ai', text: smartReply }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const smartReply = getClientSmartReply(textToSend);
            setChatHistory(prev => [...prev, { sender: 'ai', text: smartReply }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleLogin = (role: string, clubName: string | null, studentId?: string) => {
        setIsLoggedIn(true);
        setLoginRole(role);
        if (role === 'club') {
            setLoginClubName(clubName || '');
            setCurrentTab('club_dashboard');
        } else if (role === 'system_admin') {
            setCurrentTab('admin_dashboard');
        } else if (role === 'student') {
            const sId = (studentId || currentStudentId || '68101001').trim();
            setCurrentStudentId(sId);
            setStorageItem(STORAGE_KEYS.CURRENT_STUDENT_ID, sId);
            setCurrentTab('home');

            // ตรวจสอบความชอบของรหัสนักศึกษานี้ใน Local Storage
            const savedPref = userPrefsMap[sId];
            if (savedPref && Array.isArray(savedPref) && savedPref.length > 0) {
                // ไอดีนี้มีบันทึกความชอบไว้แล้ว -> โหลดมาใช้
                setUserPrefs(savedPref);
                setIsFirstLogin(false);
                setShowPrefsModal(false);
            } else {
                // ไอดีนี้ยังไม่มีความชอบ หรือเป็น ID ใหม่ -> ต้องเลือกความชอบใหม่!
                setUserPrefs([]);
                setIsFirstLogin(true);
                setShowPrefsModal(true);
            }
        }
    };

    const handleSaveUserPrefs = (prefs: string[]) => {
        const sId = currentStudentId || '68101001';
        const updatedMap = {
            ...userPrefsMap,
            [sId]: prefs,
        };
        setUserPrefsMap(updatedMap);
        setStorageItem(STORAGE_KEYS.USER_PREFERENCES, updatedMap);
        setUserPrefs(prefs);
        setShowPrefsModal(false);
        setIsFirstLogin(false);
        showToast(
            language === 'th' 
                ? `บันทึกความชอบสำหรับรหัส ${sId} เรียบร้อยแล้ว (${prefs.join(', ')})` 
                : `Preference saved for student ID ${sId} (${prefs.join(', ')})`,
            'success'
        );
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsFirstLogin(false); 
        setUserPrefs([]); 
        setShowPrefsModal(false);
        setChatHistory([{ sender: 'ai', text: 'มีอะไรให้ช่วยแนะนำไหมคะ? 😊' }]);
        setChatInput('');
        setShowChatbot(false);
        setLoginClubName('');
        setProfileImg(null);
    };

    const handleRegisterItem = (itemToRegister) => {
        const targetId = String(itemToRegister.id);
        if (itemToRegister.type === 'activity') {
            const hostingClub = globalClubs.find(c => c.name === itemToRegister.club);
            if (hostingClub && hostingClub.status === 'suspended') {
                showToast(language === 'th' ? 'ไม่สามารถลงทะเบียนได้ เนื่องจากชมรมเจ้าของกิจกรรมถูกระงับการดำเนินงาน' : 'Cannot register. Organizing club is suspended.', 'error');
                return;
            }
            if (!joinedActivities.some(id => String(id) === targetId)) {
                setJoinedActivities([...joinedActivities, itemToRegister.id]);
                const updatedActivities = globalActivities.map(act => 
                    String(act.id) === targetId ? { ...act, currentParticipants: (Number(act.currentParticipants) || 0) + 1 } : act
                );
                setGlobalActivities(updatedActivities);
                setSelectedItem({ ...itemToRegister, currentParticipants: (Number(itemToRegister.currentParticipants) || 0) + 1 });
                showToast(language === 'th' ? 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ!' : 'Activity registration successful!', 'success');
            }
        } else if (itemToRegister.type === 'club') {
            if (itemToRegister.status === 'suspended') {
                showToast(language === 'th' ? 'ไม่สามารถสมัครเข้าชมรมนี้ได้ เนื่องจากชมรมถูกระงับการดำเนินงานชั่วคราว' : 'Cannot join. Club is suspended.', 'error');
                return;
            }
            if (!joinedClubs.some(id => String(id) === targetId)) {
                setJoinedClubs([...joinedClubs, itemToRegister.id]);
                const updatedClubs = globalClubs.map(club => 
                    String(club.id) === targetId ? { ...club, members: (Number(club.members) || 0) + 1 } : club
                );
                setGlobalClubs(updatedClubs);
                
                const newMember = {
                    id: Date.now().toString(),
                    clubName: itemToRegister.name,
                    studentId: activeStudentId,
                    name: currentStudent.name, 
                    major: `${currentStudent.major} ${currentStudent.year}`,
                    joinDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }), 
                    status: 'ปกติ',
                    role: 'สมาชิก'
                };
                setGlobalMembers([newMember, ...globalMembers]); 
                setSelectedItem({ ...itemToRegister, members: (Number(itemToRegister.members) || 0) + 1 });
                showToast(language === 'th' ? 'สมัครเข้าร่วมชมรมสำเร็จ!' : 'Joined club successfully!', 'success');
            }
        }
    };

    const handleCancelRegisterItem = (itemToCancel: any, reason?: string) => {
        if (!itemToCancel) return;
        const targetId = String(itemToCancel.id);
        const isClub = itemToCancel.type === 'club' || (itemToCancel.type !== 'activity' && !itemToCancel.title && !!itemToCancel.name);

        if (!isClub) {
            setJoinedActivities(prev => prev.filter(id => String(id) !== targetId));
            const updatedActivities = globalActivities.map(act => 
                String(act.id) === targetId 
                    ? { 
                        ...act, 
                        currentParticipants: Math.max(0, (Number(act.currentParticipants) || 1) - 1),
                        attendanceList: (act.attendanceList || []).filter((sid: string) => sid !== activeStudentId)
                      } 
                    : act
            );
            setGlobalActivities(updatedActivities);
            setSelectedItem(prev => prev && String(prev.id) === targetId ? { 
                ...prev, 
                currentParticipants: Math.max(0, (Number(prev.currentParticipants) || 1) - 1) 
            } : prev);

            // บันทึกรายงานการยกเลิกและส่งเหตุผลไปยังชมรมเจ้าของกิจกรรม
            const cancelReason = (reason && reason.trim()) ? reason.trim() : (language === 'th' ? 'ไม่ได้ระบุเหตุผล' : 'No reason specified');
            const now = new Date();
            const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
            const formattedTimestamp = `${now.getDate()} ${thaiMonths[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

            const newReport: CancellationReport = {
                id: `cancel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                activityId: itemToCancel.id,
                activityTitle: itemToCancel.title || itemToCancel.name || 'กิจกรรม',
                clubName: itemToCancel.club || 'ชมรม',
                studentId: activeStudentId,
                studentName: currentStudent.name,
                studentMajor: `${currentStudent.major} ${currentStudent.year}`,
                reason: cancelReason,
                timestamp: formattedTimestamp,
                createdAt: Date.now()
            };

            setGlobalCancellationReports(prev => [newReport, ...prev]);

            showToast(
                language === 'th' 
                    ? `ยกเลิกการลงทะเบียน "${itemToCancel.title || itemToCancel.name || ''}" และส่งเหตุผลให้ชมรมแล้ว` 
                    : `Cancelled registration for "${itemToCancel.title || itemToCancel.name || ''}" and sent reason to club`, 
                'info'
            );
        } else {
            setJoinedClubs(prev => prev.filter(id => String(id) !== targetId));
            const updatedClubs = globalClubs.map(club => 
                String(club.id) === targetId 
                    ? { ...club, members: Math.max(0, (Number(club.members) || 1) - 1) } 
                    : club
            );
            setGlobalClubs(updatedClubs);
            setGlobalMembers(prev => prev.filter(m => !(m.clubName === itemToCancel.name && m.studentId === activeStudentId)));
            setSelectedItem(prev => prev && String(prev.id) === targetId ? { 
                ...prev, 
                members: Math.max(0, (Number(prev.members) || 1) - 1) 
            } : prev);
            showToast(
                language === 'th' 
                    ? `ยกเลิกการเป็นสมาชิกชมรม "${itemToCancel.name || ''}" เรียบร้อยแล้ว` 
                    : `Left club "${itemToCancel.name || ''}"`, 
                'info'
            );
        }
    };

    const handleLikeItem = (itemToLike) => {
        if (itemToLike.type === 'activity') {
            const isLiked = likedActivities.includes(itemToLike.id);
            
            if (isLiked) {
                setLikedActivities(likedActivities.filter(id => id !== itemToLike.id));
                const updatedItem = { ...itemToLike, likes: Math.max(0, (Number(itemToLike.likes) || 0) - 1) };
                setGlobalActivities(globalActivities.map(act => act.id === itemToLike.id ? updatedItem : act));
                setSelectedItem(updatedItem);
            } else {
                setLikedActivities([...likedActivities, itemToLike.id]);
                const updatedItem = { ...itemToLike, likes: (Number(itemToLike.likes) || 0) + 1 };
                setGlobalActivities(globalActivities.map(act => act.id === itemToLike.id ? updatedItem : act));
                setSelectedItem(updatedItem);
            }
        } else if (itemToLike.type === 'club') {
            const isLiked = likedClubs.includes(itemToLike.id);
            
            if (isLiked) {
                setLikedClubs(likedClubs.filter(id => id !== itemToLike.id));
                const updatedItem = { ...itemToLike, likes: Math.max(0, (Number(itemToLike.likes) || 0) - 1) };
                setGlobalClubs(globalClubs.map(club => club.id === itemToLike.id ? updatedItem : club));
                setSelectedItem(updatedItem);
            } else {
                setLikedClubs([...likedClubs, itemToLike.id]);
                const updatedItem = { ...itemToLike, likes: (Number(itemToLike.likes) || 0) + 1 };
                setGlobalClubs(globalClubs.map(club => club.id === itemToLike.id ? updatedItem : club));
                setSelectedItem(updatedItem);
            }
        }
    };
    
    const handleUpdateItem = (updatedItem) => {
        if (updatedItem.type === 'activity') {
            setGlobalActivities(globalActivities.map(act => act.id === updatedItem.id ? updatedItem : act));
        } else if (updatedItem.type === 'club') {
            setGlobalClubs(globalClubs.map(club => club.id === updatedItem.id ? updatedItem : club));
        }
        setSelectedItem(updatedItem); 
    };

    if (!isLoggedIn) {
        if (isGuestBrowsingClubs) {
            return (
                <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative text-gray-900">
                    <ToastContainer toasts={toasts} onRemove={removeToast} />

                    {/* Guest Navigation Bar */}
                    <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-xs">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                            <div 
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => setSelectedItem(null)}
                            >
                                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md text-white font-bold text-sm">
                                    WU
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-bold text-base sm:text-lg text-gray-800">WU Club</h1>
                                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-100">
                                            {language === 'th' ? 'โหมดผู้เยี่ยมชม (Guest)' : 'Guest Mode'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 hidden sm:block">
                                        {language === 'th' ? 'มหาวิทยาลัยวลัยลักษณ์ • สำรวจชมรมทั้งหมด' : 'Walailak University • Browse All Clubs'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <button 
                                    onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-gray-200"
                                >
                                    <Languages size={15} />
                                    <span className="uppercase font-bold">{language}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsGuestBrowsingClubs(false);
                                        setSelectedItem(null);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer hover:shadow-md active:scale-95"
                                >
                                    <LogIn size={16} />
                                    <span>{language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Guest Banner */}
                    <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 text-white py-6 sm:py-8 px-4 sm:px-6">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-2">
                                    <Sparkles size={14} />
                                    <span>{language === 'th' ? 'สำรวจชมรมทั้งหมดโดยไม่ต้องเข้าสู่ระบบ' : 'Explore all clubs without logging in'}</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {language === 'th' ? 'ชมรมทั้งหมด มหาวิทยาลัยวลัยลักษณ์' : 'Walailak University Student Clubs'}
                                </h2>
                                <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl leading-relaxed">
                                    {language === 'th' 
                                        ? 'สามารถกดดูรายละเอียดชมรมได้ทุกชมรม หากต้องการสมัครเป็นสมาชิกชมรม กรุณาเข้าสู่ระบบ' 
                                        : 'Click on any club to view full details. To apply for membership, please log in.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsGuestBrowsingClubs(false);
                                    setSelectedItem(null);
                                }}
                                className="shrink-0 px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
                            >
                                <LogIn size={16} />
                                <span>{language === 'th' ? 'เข้าสู่ระบบเพื่อสมัครชมรม' : 'Login to Join Clubs'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 max-w-7xl mx-auto w-full p-2 sm:p-4 pb-20">
                        {selectedItem ? (
                            <DetailView 
                                item={selectedItem}
                                onBack={() => setSelectedItem(null)}
                                onRegister={(item) => {
                                    setIsGuestBrowsingClubs(false);
                                    setSelectedItem(null);
                                    showToast(
                                        language === 'th' 
                                            ? `กรุณาเข้าสู่ระบบก่อนสมัครสมาชิกชมรม "${item.name || item.title}"` 
                                            : `Please log in before joining "${item.name || item.title}"`,
                                        'info'
                                    );
                                }}
                                onCancelRegister={() => {}}
                                isAlreadyRegistered={false}
                                onUpdateItem={handleUpdateItem}
                                onLike={handleLikeItem}
                                isAlreadyLiked={likedClubs.includes(selectedItem?.id)}
                                language={language}
                                clubs={globalClubs}
                                currentUserName="ผู้เยี่ยมชม (Guest)"
                            />
                        ) : (
                            <ClubsTab 
                                clubs={globalClubs}
                                language={language}
                                onViewDetail={(item) => setSelectedItem(item)}
                                onOpenProposal={() => {
                                    setIsGuestBrowsingClubs(false);
                                    showToast(
                                        language === 'th' ? 'กรุณาเข้าสู่ระบบก่อนยื่นคำขอจัดตั้งชมรมใหม่' : 'Please log in before proposing a new club',
                                        'info'
                                    );
                                }}
                            />
                        )}
                    </main>

                    {/* Floating Bottom Bar: Back to Login */}
                    <div className="fixed bottom-6 right-6 z-40">
                        <button
                            type="button"
                            onClick={() => {
                                setIsGuestBrowsingClubs(false);
                                setSelectedItem(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm"
                        >
                            <ArrowLeft size={16} />
                            <span>{language === 'th' ? 'กลับไปหน้าเข้าสู่ระบบ' : 'Back to Login'}</span>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <LoginScreen 
                onLogin={handleLogin} 
                language={language} 
                setLanguage={setLanguage} 
                clubs={globalClubs} 
                clubCredentials={clubCredentials} 
                userPreferencesMap={userPrefsMap}
                goodnessHistoryMap={goodnessHistoryByStudent}
                onExploreClubs={() => {
                    setIsGuestBrowsingClubs(true);
                    setSelectedItem(null);
                }}
            />
        );
    }

return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-gray-900 overflow-hidden relative">
            
            {showPrefsModal && (
                <PreferencesModal 
                    currentPrefs={userPrefs} 
                    studentId={currentStudentId}
                    onSave={handleSaveUserPrefs} 
                    isMandatory={isFirstLogin} 
                    language={language} 
                    onClose={() => setShowPrefsModal(false)}
                />
            )}

            <div className="hidden md:block">
                <Sidebar 
                    currentTab={currentTab} 
                    setCurrentTab={(tab) => { setCurrentTab(tab); setSelectedItem(null); }} 
                    onLogout={handleLogout} 
                    loginRole={loginRole} 
                    loginClubName={loginClubName} 
                    profileImg={profileImg} 
                    onProfileImgChange={setProfileImg} 
                    language={language} 
                    onOpenPolicies={() => setShowPolicyModal(true)}
                    studentId={activeStudentId}
                    studentName={currentStudent.name}
                    studentInitials={currentStudent.initials}
                />
            </div>

            {/* แถบด้านบนสำหรับมือถือ (Top Bar) เพื่อเข้าโปรไฟล์และออกจากระบบ */}
            <div className="md:hidden flex justify-between items-center bg-white px-5 py-3 border-b border-gray-100 shadow-sm z-30 sticky top-0">
                <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => { 
                        setCurrentTab(loginRole === 'system_admin' ? 'admin_dashboard' : (loginRole === 'club' ? 'club_dashboard' : 'home')); 
                        setSelectedItem(null); 
                    }}
                >
                    <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-lg flex items-center justify-center shadow-md"><span className="font-bold text-white text-[10px]">WU</span></div>
                    <h1 className="text-lg font-bold text-gray-800">WU Club</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setCurrentTab('profile'); setSelectedItem(null); }} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-80 transition-opacity overflow-hidden ${loginRole === 'system_admin' ? 'bg-indigo-600 text-white' : loginRole === 'student' ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-500'}`}>
                        {profileImg ? (
                            <img src={profileImg} alt="profile" className="w-full h-full object-cover" />
                        ) : loginRole === 'system_admin' ? (
                            <ShieldCheck size={14} />
                        ) : loginRole === 'student' ? (
                            (currentStudent.initials || 'ST')
                        ) : (
                            <Utensils size={14}/>
                        )}
                    </button>
                    <button onClick={handleLogout} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"><LogOut size={18} /></button>
                </div>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center p-2 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                {(loginRole === 'system_admin' ? [
                    { id: 'admin_dashboard', icon: ShieldCheck, label: language === 'th' ? 'ภาพรวม' : 'Overview' },
                    { id: 'admin_activities', icon: Calendar, label: language === 'th' ? 'อนุมัติงาน' : 'Approvals' },
                    { id: 'admin_proposals', icon: Building2, label: language === 'th' ? 'คำขอชมรม' : 'Proposals' },
                    { id: 'admin_clubs', icon: Users, label: language === 'th' ? 'ชมรม' : 'Clubs' },
                    { id: 'admin_policies', icon: BookOpen, label: language === 'th' ? 'ระเบียบ' : 'Policies' },
                ] : loginRole === 'student' ? [
                    { id: 'home', icon: Home, label: language === 'th' ? 'หน้าหลัก' : 'Home' },
                    { id: 'activities', icon: Calendar, label: language === 'th' ? 'กิจกรรม' : 'Activities' },
                    { id: 'clubs', icon: Users, label: language === 'th' ? 'ชมรม' : 'Clubs' },
                    { id: 'goodness', icon: Star, label: language === 'th' ? 'คะแนน' : 'Goodness' },
                ] : [
                    { id: 'club_dashboard', icon: Home, label: language === 'th' ? 'แดชบอร์ด' : 'Dashboard' },
                    { id: 'manage_activities', icon: Calendar, label: language === 'th' ? 'กิจกรรม' : 'Activities' },
                    { id: 'manage_members', icon: Users, label: language === 'th' ? 'สมาชิก' : 'Members' },
                ]).map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id && !selectedItem;
                    return (
                        <button key={item.id} onClick={() => { setCurrentTab(item.id); setSelectedItem(null); }} className={`flex flex-col items-center p-2 rounded-xl transition-colors cursor-pointer ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <Icon size={22} className={isActive ? 'mb-1' : 'mb-1 opacity-70'} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    )
                })}
            </div>
            
            <div className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
                {selectedItem ? (
                    <DetailView 
                        item={selectedItem} 
                        onBack={() => setSelectedItem(null)} 
                        onRegister={handleRegisterItem}
                        onCancelRegister={handleCancelRegisterItem}
                        isAlreadyRegistered={selectedItem.type === 'activity' ? joinedActivities.some(id => String(id) === String(selectedItem.id)) : joinedClubs.some(id => String(id) === String(selectedItem.id))}
                        onUpdateItem={handleUpdateItem}
                        onLike={handleLikeItem}
                        isAlreadyLiked={selectedItem.type === 'activity' ? likedActivities.some(id => String(id) === String(selectedItem.id)) : likedClubs.some(id => String(id) === String(selectedItem.id))}
                        language={language}
                        clubs={globalClubs}
                        currentUserName={currentStudent.name}
                    />
                ) : loginRole === 'system_admin' ? (
                    <SystemAdminDashboard
                        activities={globalActivities}
                        setActivities={setGlobalActivities}
                        clubs={globalClubs}
                        setClubs={setGlobalClubs}
                        proposals={globalProposals}
                        setProposals={setGlobalProposals}
                        policies={globalPolicies}
                        setPolicies={setGlobalPolicies}
                        language={language}
                        onShowToast={showToast}
                        currentNavTab={currentTab}
                        onNavTabChange={setCurrentTab}
                        onAddClubCredential={handleAddClubCredential}
                        onResetStorage={handleResetStorageData}
                    />
                ) : loginRole === 'club' ? (
                    (() => {
                        const isCurrentClubSuspended = globalClubs.find(c => c.name === loginClubName)?.status === 'suspended';
                        return currentTab === 'club_dashboard' ? (
                            <ClubDashboardTab 
                                activities={globalActivities} 
                                setActivities={setGlobalActivities} 
                                clubName={loginClubName} 
                                members={globalMembers} 
                                language={language} 
                                onShowToast={showToast}
                                isSuspended={isCurrentClubSuspended}
                                cancellationReports={globalCancellationReports}
                            />
                        ) : currentTab === 'manage_activities' ? (
                            <ManageActivitiesTab 
                                activities={globalActivities} 
                                setActivities={setGlobalActivities} 
                                clubName={loginClubName} 
                                language={language} 
                                onOpenAttendance={(act) => setAttendanceActivity(act)}
                                onShowToast={showToast}
                                isSuspended={isCurrentClubSuspended}
                                cancellationReports={globalCancellationReports}
                            />
                        ) : currentTab === 'manage_members' ? (
                            <ManageMembersTab 
                                clubName={loginClubName} 
                                members={globalMembers} 
                                language={language} 
                                isSuspended={isCurrentClubSuspended}
                            />
                        ) : currentTab === 'profile' ? (
                            <ProfileTab 
                                preferences={userPrefs} 
                                onEditPrefs={() => setShowPrefsModal(true)} 
                                profileImg={profileImg} 
                                onProfileImgChange={setProfileImg} 
                                loginRole={loginRole} 
                                clubName={loginClubName} 
                                language={language}
                                studentId={activeStudentId}
                                studentName={currentStudent.name}
                            />
                        ) : (
                            <div className="p-8 flex items-center justify-center h-full text-gray-400"><h2>{language === 'th' ? 'กำลังพัฒนา...' : 'Coming soon...'}</h2></div>
                        );
                    })()
                ) : currentTab === 'home' ? (
                    <HomeTab 
                        onViewDetail={setSelectedItem} 
                        preferences={userPrefs} 
                        onViewAll={setCurrentTab} 
                        activities={globalActivities} 
                        clubs={globalClubs} 
                        personalEvents={globalPersonalEvents} 
                        setPersonalEvents={setGlobalPersonalEvents} 
                        language={language} 
                        setLanguage={setLanguage}
                        studentName={currentStudent.name}
                        goodnessHistory={activeStudentGoodnessHistory}
                        goodnessPoints={activeStudentTotalGoodnessPoints}
                    />
                ) : currentTab === 'profile' ? (
                    <ProfileTab 
                        preferences={userPrefs} 
                        onEditPrefs={() => setShowPrefsModal(true)} 
                        profileImg={profileImg} 
                        onProfileImgChange={setProfileImg} 
                        loginRole={loginRole} 
                        clubName={loginClubName} 
                        language={language} 
                        activities={globalActivities}
                        joinedActivities={joinedActivities}
                        clubs={globalClubs}
                        joinedClubs={joinedClubs}
                        onViewDetail={setSelectedItem}
                        onCancelRegister={handleCancelRegisterItem}
                        onNavigateTab={setCurrentTab}
                        studentId={activeStudentId}
                        studentName={currentStudent.name}
                        studentYear={currentStudent.year}
                        studentMajor={currentStudent.major}
                        studentInitials={currentStudent.initials}
                        onUpdateStudentName={handleUpdateStudentName}
                        totalGoodnessPoints={activeStudentTotalGoodnessPoints}
                    />
                ) : currentTab === 'activities' ? (
                    <ActivitiesTab 
                        onViewDetail={setSelectedItem} 
                        activities={globalActivities} 
                        language={language} 
                        clubs={globalClubs} 
                        joinedActivities={joinedActivities}
                    />
                ) : currentTab === 'clubs' ? (
                    <ClubsTab onViewDetail={setSelectedItem} clubs={globalClubs} language={language} onOpenProposal={() => setShowProposalModal(true)} />
                ) : currentTab === 'goodness' ? (
                    <GoodnessTab 
                        language={language} 
                        studentId={activeStudentId}
                        studentName={currentStudent.name}
                        studentMajor={currentStudent.major}
                        studentYear={currentStudent.year}
                        studentInitials={currentStudent.initials}
                        goodnessHistory={activeStudentGoodnessHistory} 
                        goodnessStats={activeStudentGoodnessStats}
                        onNavigateTab={setCurrentTab}
                        onOpenPolicyModal={() => setShowPolicyModal(true)}
                    />
                ) : (
                    <div className="p-8 flex items-center justify-center h-full text-gray-400"><h2>{language === 'th' ? 'กำลังพัฒนา...' : 'Coming soon...'}</h2></div>
                )}
            </div>

            {/* Modal Dialogs */}
            {showPolicyModal && (
                <PolicyModal 
                    onClose={() => setShowPolicyModal(false)}
                    policies={globalPolicies}
                    language={language}
                />
            )}

            {showProposalModal && (
                <ClubRegistrationModal
                    onClose={() => setShowProposalModal(false)}
                    onSubmit={(newPropData) => {
                        const newProposal: ClubProposal = {
                            id: `prop-${Date.now()}`,
                            ...newPropData,
                            submittedDate: 'วันนี้',
                            status: 'pending',
                        };
                        setGlobalProposals(prev => [newProposal, ...prev]);
                        setShowProposalModal(false);
                        showToast(
                            language === 'th' 
                                ? `ยื่นคำขอจัดตั้งชมรมเรียบร้อยแล้ว (จะส่งผลและรหัสผ่านไปที่ ${newPropData.proposerEmail || 'อีเมลของคุณ'})` 
                                : `Club proposal submitted. Confirmation and credentials will be sent to ${newPropData.proposerEmail || 'your email'}`, 
                            'success'
                        );
                    }}
                    language={language}
                    studentName={currentStudent.name}
                    studentId={activeStudentId}
                    studentMajor={`${currentStudent.major} ${currentStudent.year}`}
                    studentEmail={`${activeStudentId}@mail.wu.ac.th`}
                />
            )}

            {attendanceActivity && (
                <AttendanceModal
                    activity={attendanceActivity}
                    members={globalMembers}
                    onClose={() => setAttendanceActivity(null)}
                    onConfirmAttendance={handleConfirmAttendance}
                    language={language}
                />
            )}

            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <button onClick={() => setShowChatbot(!showChatbot)} className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-teal-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-40 cursor-pointer">
                <Bot size={28} className="md:w-8 md:h-8" />
            </button>

            {showChatbot && (
                <div className="fixed bottom-36 md:bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] sm:w-84 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-4">
                    <div className="bg-gradient-to-r from-indigo-600 to-teal-500 p-3.5 text-white flex justify-between items-center shadow-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span className="font-bold text-sm flex items-center gap-1.5"><Sparkles size={17}/>WU AI Assistant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setChatHistory([{ sender: 'ai', text: language === 'th' ? 'มีอะไรให้ช่วยแนะนำไหมคะ? 😊' : 'How can I assist you with clubs and activities? 😊' }])}
                                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors text-xs cursor-pointer"
                                title="ล้างการสนทนา"
                            >
                                <Trash2 size={15} />
                            </button>
                            <button onClick={() => setShowChatbot(false)} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <div ref={chatContainerRef} className="p-3.5 h-72 md:h-80 overflow-y-auto bg-slate-50 text-sm flex flex-col gap-3">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-2xl shadow-2xs max-w-[88%] text-[13.5px] leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white self-end rounded-tr-xs' : 'bg-white border border-slate-200/60 text-slate-800 self-start rounded-tl-xs markdown-body'}`}>
                                <Markdown>{msg.text}</Markdown>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-slate-200/60 shadow-2xs text-slate-500 self-start flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                                <span className="ml-1 text-slate-400">{language === 'th' ? 'กำลังประมวลผลคำตอบ...' : 'Thinking...'}</span>
                            </div>
                        )}
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="px-3 py-1.5 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => handleSendChat(language === 'th' ? 'แนะนำกิจกรรมหน่อย' : 'Recommend some activities')}
                            className="shrink-0 text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full border border-slate-200 transition-colors cursor-pointer"
                        >
                            🎯 {language === 'th' ? 'แนะนำกิจกรรม' : 'Activities'}
                        </button>
                        <button
                            onClick={() => handleSendChat(language === 'th' ? 'เกณฑ์คะแนนความดี 5 ด้าน' : 'Goodness score criteria')}
                            className="shrink-0 text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full border border-slate-200 transition-colors cursor-pointer"
                        >
                            🌟 {language === 'th' ? 'คะแนนความดี' : 'Goodness Score'}
                        </button>
                        <button
                            onClick={() => handleSendChat(language === 'th' ? 'แนะนำชมรมยอดนิยม' : 'Recommend popular clubs')}
                            className="shrink-0 text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full border border-slate-200 transition-colors cursor-pointer"
                        >
                            🏛️ {language === 'th' ? 'แนะนำชมรม' : 'Clubs'}
                        </button>
                    </div>

                    <div className="p-2.5 border-t border-slate-100 flex gap-2 bg-white items-center">
                        <input 
                            type="text" 
                            placeholder={language === 'th' ? "พิมพ์ข้อความ เช่น แนะนำกิจกรรม..." : "Ask WU AI something..."} 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            className="flex-1 text-xs sm:text-sm bg-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                        />
                        <button 
                            onClick={() => handleSendChat()} 
                            disabled={isChatLoading || !chatInput.trim()} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 sm:p-2.5 rounded-full disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}