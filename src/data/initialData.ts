import { Category, DeedLog } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'gratitude',
    name: 'ความกตัญญู',
    target: 10,
    description: 'การแสดงออกถึงความเคารพ กตัญญูรู้คุณต่อผู้มีพระคุณ พ่อแม่ ครูอาจารย์ และสถาบัน',
    iconName: 'HeartHandshake',
    color: '#EC4899', // pink
  },
  {
    id: 'discipline',
    name: 'การรู้วินัย',
    target: 14,
    description: 'การปฏิบัติตามระเบียบข้อบังคับ ตรงต่อเวลา มีความรับผิดชอบต่อหน้าที่',
    iconName: 'ShieldCheck',
    color: '#3B82F6', // blue
  },
  {
    id: 'volunteer',
    name: 'การมีใจอาสา',
    target: 33,
    description: 'การช่วยเหลือผู้อื่น ทำประโยชน์เพื่อส่วนรวมโดยไม่มุ่งหวังผลตอบแทน',
    iconName: 'HandHeart',
    color: '#10B981', // emerald
  },
  {
    id: 'leadership',
    name: 'การพัฒนาภาวะผู้นำ',
    target: 33,
    description: 'การนำกิจกรรม ทำงานร่วมกับผู้อื่น พัฒนาทักษะการตัดสินใจและการแก้ปัญหา',
    iconName: 'Award',
    color: '#8B5CF6', // purple
  },
  {
    id: 'patriotism',
    name: 'ความรักชาติ',
    target: 10,
    description: 'การส่งเสริมวัฒนธรรมไทย เข้าร่วมพิธีสำคัญ และทำบำเพ็ญประโยชน์เพื่อประเทศชาติ',
    iconName: 'Flag',
    color: '#F59E0B', // amber
  },
];

export const INITIAL_DEED_LOGS: DeedLog[] = [
  // ความกตัญญู (14.075)
  {
    id: 'log-1',
    categoryId: 'gratitude',
    title: 'ช่วยงานบ้านและดูแลบิดามารดาประจำสัปดาห์',
    score: 10,
    date: '2026-07-01',
    notes: 'ทำความสะอาดบ้าน จัดเตรียมภัตตาหาร/อาหารเย็น',
  },
  {
    id: 'log-2',
    categoryId: 'gratitude',
    title: 'เข้าร่วมกิจกรรมวันไหว้ครูและแสดงความกตัญญู',
    score: 4.075,
    date: '2026-07-10',
    notes: 'ร่วมจัดพานไหว้ครูประจำสถาบัน',
  },

  // การรู้วินัย (31.675)
  {
    id: 'log-3',
    categoryId: 'discipline',
    title: 'ปฏิบัติตามกฎระเบียบและเข้าเช็คอินตรงเวลาตลอดเดือน',
    score: 20,
    date: '2026-07-05',
    notes: 'ไม่มีประวัติเข้าสายหรือขาดกิจกรรม',
  },
  {
    id: 'log-4',
    categoryId: 'discipline',
    title: 'ช่วยจัดระเบียบห้องเรียนและพื้นที่ส่วนกลาง',
    score: 11.675,
    date: '2026-07-15',
    notes: 'ทำความสะอาดและจัดเก็บอุปกรณ์อย่างเป็นระเบียบ',
  },

  // การมีใจอาสา (132.315)
  {
    id: 'log-5',
    categoryId: 'volunteer',
    title: 'ร่วมกิจกรรมบำเพ็ญประโยชน์เก็บขยะและปรับภูมิทัศน์ชุมชน',
    score: 80,
    date: '2026-07-02',
    notes: 'กิจกรรมอาสาสมัครชุมชนร่วมกับเพื่อนๆ',
  },
  {
    id: 'log-6',
    categoryId: 'volunteer',
    title: 'ช่วยบริจาคสิ่งของและแจกอาหารให้ผู้ยากไร้',
    score: 52.315,
    date: '2026-07-12',
    notes: 'ร่วมกับมูลนิธิในท้องถิ่น',
  },

  // การพัฒนาภาวะผู้นำ (50.275)
  {
    id: 'log-7',
    categoryId: 'leadership',
    title: 'เป็นหัวหน้าทีมจัดโครงการอบรมเชิงปฏิบัติการ',
    score: 30,
    date: '2026-07-08',
    notes: 'วางแผน ดำเนินงาน และประเมินผลโครงการ',
  },
  {
    id: 'log-8',
    categoryId: 'leadership',
    title: 'นำเสนอผลงานและประสานงานกลุ่มกิจกรรม',
    score: 20.275,
    date: '2026-07-18',
    notes: 'ควบคุมการประชุมและมอบหมายหน้าที่อย่างเป็นระบบ',
  },

  // ความรักชาติ (17.91)
  {
    id: 'log-9',
    categoryId: 'patriotism',
    title: ' เข้าร่วมพิธีทางศาสนาและวันสำคัญทางราชการ',
    score: 10,
    date: '2026-07-04',
    notes: 'พิธีเคารพธงชาติและสวดมนต์ร่วมกัน',
  },
  {
    id: 'log-10',
    categoryId: 'patriotism',
    title: 'ร่วมกิจกรรมอนุรักษ์ศิลปวัฒนธรรมและภูมิปัญญาท้องถิ่น',
    score: 7.91,
    date: '2026-07-14',
    notes: 'สืบสานงานหัตถกรรมไทยและเผยแพร่ความรู้',
  },
];
