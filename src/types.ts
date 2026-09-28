export type UserRole = 'student' | 'club' | 'system_admin';

export type ActivityStatus = 'approved' | 'pending' | 'rejected';
export type ClubStatus = 'approved' | 'pending' | 'rejected' | 'suspended' | 'deleted';

export interface Category {
  id: string;
  name: string; // e.g. ความกตัญญู, การรู้วินัย, ...
  target: number;
  description: string;
  iconName: string;
  color: string;
}

export interface DeedLog {
  id: string | number;
  categoryId: string;
  title: string;
  score: number;
  date: string;
  notes?: string;
  location?: string;
}

export interface CategorySummary extends Category {
  currentScore: number;
  isComplete: boolean;
  progressPercent: number;
}

export interface ActivityComment {
  id: number | string;
  user: string;
  text: string;
  timestamp?: string;
}

export interface Activity {
  id: number | string;
  title: string;
  date: string;
  time?: string;
  club: string;
  tag?: string;
  category: string;
  location?: string;
  goodnessCategory?: string;
  goodnessPoints: number;
  currentParticipants: number;
  maxParticipants: number;
  likes: number;
  comments: ActivityComment[];
  img: string;
  desc?: string;
  status: ActivityStatus;
  rejectReason?: string;
  attendanceList?: string[]; // student IDs that checked in
}

export interface ClubComment {
  id: number | string;
  user: string;
  text: string;
  timestamp?: string;
}

export interface Club {
  id: number | string;
  name: string;
  icon?: any;
  category: string;
  members: number;
  likes: number;
  comments: ClubComment[];
  desc: string;
  img: string;
  status: ClubStatus;
  advisor?: string;
  founder?: string;
  contactEmail?: string;
  contactPhone?: string;
  tag?: string;
  isNew?: boolean;
  deletedAt?: number; // timestamp when deleted (3-day recovery window)
  previousStatus?: ClubStatus;
}

export interface ClubProposal {
  id: string | number;
  clubName: string;
  category: string;
  description: string;
  advisor: string;
  proposerName: string;
  proposerStudentId: string;
  proposerMajor: string;
  proposerEmail?: string;
  foundingMembers: string[];
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  credentials?: {
    username: string;
    password: string;
  };
  emailSent?: boolean;
}

export interface Member {
  id: string;
  clubName: string;
  studentId: string;
  name: string;
  major: string;
  joinDate: string;
  status: string;
  role: string;
}

export interface PolicyRule {
  id: string;
  title: string;
  section: string;
  content: string;
  updatedDate: string;
}

export interface AppNotification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'activity' | 'club' | 'goodness' | 'system';
}

export const DEFAULT_POLICIES: PolicyRule[] = [
  {
    id: 'pol-1',
    title: 'เกณฑ์การจัดตั้งชมรมใหม่ (New Club Establishment Guidelines)',
    section: 'หมวดที่ 1: การจัดตั้งและบริหารงานชมรม',
    content: 'นักศึกษาที่ประสงค์จะจัดตั้งชมรมใหม่ ต้องมีสมาชิกผู้ริเริ่มก่อตั้งไม่น้อยกว่า 3 คน โดยต้องมีอาจารย์ที่ปรึกษาประจำชมรมที่เป็นอาจารย์ประจำมหาวิทยาลัยวลัยลักษณ์อย่างน้อย 1 ท่าน พร้อมยื่นเอกสารระบุวัตถุประสงค์ แผนงานประจำปี และธรรมนูญชมรมผ่านระบบสารสนเทศนี้ เพื่อรอการพิจารณาอนุมัติจากส่วนส่งเสริมและพัฒนานักศึกษา',
    updatedDate: '2026-07-01',
  },
  {
    id: 'pol-2',
    title: 'มาตรฐานความปลอดภัยและจริยธรรมในกิจกรรม (Safety & Ethical Standards)',
    section: 'หมวดที่ 2: มาตรฐานกิจกรรมและความปลอดภัย',
    content: 'ทุกกิจกรรมของชมรมต้องไม่มีเนื้อหาหรือการกระทำที่ขัดต่อกฎหมาย ขัดต่อระเบียบมหาวิทยาลัย หรือเสี่ยงต่ออันตรายทางร่างกายและจิตใจ ห้ามมีกิจกรรมรับน้องที่ไม่สร้างสรรค์หรือการบังคับเข้าร่วม กิจกรรมที่มีการเดินทางนอกพื้นที่มหาวิทยาลัยต้องยื่นขออนุญาตล่วงหน้าอย่างน้อย 14 วันทำการพร้อมประกันอุบัติเหตุ',
    updatedDate: '2026-06-15',
  },
  {
    id: 'pol-3',
    title: 'เกณฑ์การอนุมัติและบันทึกคะแนนความดี (Goodness Score Criteria)',
    section: 'หมวดที่ 3: เกณฑ์คะแนนความดีและกิจกรรมนักศึกษา',
    content: 'ชมรมที่จัดกิจกรรมที่สอดคล้องกับ 5 ด้านความดี (ความกตัญญู, การรู้วินัย, การมีจิตอาสา, การพัฒนาภาวะผู้นำ, ความรักชาติ) สามารถเสนอขอรับการจัดสรรคะแนนความดีได้ครั้งละ 5 - 20 คะแนน โดยประธานชมรมมีหน้าที่เช็คชื่อผู้เข้าร่วมจริงผ่านระบบภายใน 48 ชั่วโมงหลังสิ้นสุดกิจกรรมเพื่อให้ระบบคำนวณคะแนนแก่นักศึกษาโดยอัตโนมัติ',
    updatedDate: '2026-07-10',
  },
  {
    id: 'pol-4',
    title: 'การประเมินสถานะและความต่อเนื่องของชมรม (Annual Club Review)',
    section: 'หมวดที่ 4: การประเมินผลและการคงสถานะ',
    content: 'ชมรมต้องจัดกิจกรรมอย่างน้อย 2 ครั้งต่อปีการศึกษา และมีสมาชิกเข้าร่วมกิจกรรมไม่น้อยกว่า 10 คน หากไม่มีกิจกรรมตลอด 1 ปีการศึกษา สถานะชมรมจะถูกปรับเป็น "รอพิจารณา (Suspended)" และอาจถูกยุบชมรมหากไม่มีการชี้แจงภายใน 30 วัน',
    updatedDate: '2026-05-20',
  },
];

export const INITIAL_PROPOSALS: ClubProposal[] = [
  {
    id: 'prop-1',
    clubName: 'ชมรมพัฒนาซอฟต์แวร์และ AI (WU Dev & AI Club)',
    category: 'วิชาการ',
    description: 'มุ่งเน้นการเสริมสร้างทักษะการเขียนโปรแกรม การประกวด Hackathon และการประยุกต์ใช้เทคโนโลยี AI สมัยใหม่เพื่อการศึกษาและวิจัย พร้อมจัด Workshop แบ่งปันความรู้แก่นักศึกษาทุกสำนักวิชา',
    advisor: 'อ.ดร. นันทกร ธรรมาภิบาล (สำนักวิชาสารสนเทศศาสตร์)',
    proposerName: 'นายธนาธิป สิทธิโชค',
    proposerStudentId: '68102045',
    proposerMajor: 'วิศวกรรมซอฟต์แวร์ ปี 3',
    foundingMembers: ['นายธนาธิป สิทธิโชค', 'นางสาวพิมพ์ชนก รัตนวรรณ', 'นายกิตติคุณ มั่งมี'],
    submittedDate: '24 ก.ค. 2026',
    status: 'pending',
  },
  {
    id: 'prop-2',
    clubName: 'ชมรมอนุรักษ์ธรรมชาติและสิ่งแวดล้อมวลัยลักษณ์ (WU Green Earth)',
    category: 'จิตอาสา',
    description: 'รวมกลุ่มนักศึกษาที่มีใจรักสิ่งแวดล้อม รณรงค์การลดขยะพลาสติกในรั้วมหาวิทยาลัย ปลูกป่าชายเลน และทำกิจกรรมจิตอาสาฟื้นฟูธรรมชาติรอบอุทยานวลัยลักษณ์',
    advisor: 'ผศ.ดร. สุภาภรณ์ ชูเจริญ (สำนักวิชาวิทยาศาสตร์)',
    proposerName: 'นางสาวจริยา มหาสมุทร',
    proposerStudentId: '68105088',
    proposerMajor: 'วิทยาศาสตร์สิ่งแวดล้อม ปี 2',
    foundingMembers: ['นางสาวจริยา มหาสมุทร', 'นายภัทรดนัย บุญช่วย', 'นางสาวชนิกา จันทร์ดี'],
    submittedDate: '22 ก.ค. 2026',
    status: 'pending',
  },
  {
    id: 'prop-3',
    clubName: 'ชมรมดนตรีและสันทนาการ (WU Acoustic & Jam Club)',
    category: 'บันเทิง',
    description: 'สร้างสรรค์พื้นที่ทางดนตรีสำหรับนักศึกษาทุกระดับฝีมือ จัดคอนเสิร์ตขนาดเล็กในสวน และร่วมเล่นดนตรีเปิดหมวกเพื่อการกุศล',
    advisor: 'อ. ธีรภัทร เสนาะเสียง (สำนักวิชาศิลปศาสตร์)',
    proposerName: 'นายก้องเกียรติ ไพเราะ',
    proposerStudentId: '67103321',
    proposerMajor: 'นิเทศศาสตร์ ปี 3',
    foundingMembers: ['นายก้องเกียรติ ไพเราะ', 'นายศิรวิชญ์ บรรเลง', 'นางสาวดวงกมล แสนสุข'],
    submittedDate: '15 ก.ค. 2026',
    status: 'approved',
    adminNotes: 'ผ่านเกณฑ์เรียบร้อย มีอาจารย์ที่ปรึกษารับรองครบถ้วน',
  },
];

export interface CancellationReport {
  id: string;
  activityId: number | string;
  activityTitle: string;
  clubName: string;
  studentId: string;
  studentName: string;
  studentMajor?: string;
  reason: string;
  timestamp: string;
  createdAt: number;
}

