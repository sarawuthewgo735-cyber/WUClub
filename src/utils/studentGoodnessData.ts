export interface GoodnessHistoryItem {
    id: string | number;
    title: string;
    points: number;
    date: string;
    category: string;
}

export interface GoodnessCategoryStat {
    id: number;
    name: string;
    target: number;
    current: number;
}

// เกณฑ์เป้าหมายคะแนนความดี 5 ด้านของมหาวิทยาลัยวลัยลักษณ์
export const BASE_WU_GOODNESS_TARGETS: GoodnessCategoryStat[] = [
    { id: 1, name: 'ความกตัญญู', target: 10, current: 0 },
    { id: 2, name: 'การรู้วินัย', target: 14, current: 0 },
    { id: 3, name: 'การมีจิตอาสา', target: 33, current: 0 },
    { id: 4, name: 'การพัฒนาภาวะผู้นำ', target: 33, current: 0 },
    { id: 5, name: 'ความรักชาติ', target: 10, current: 0 },
];

export const INITIAL_GOODNESS_HISTORY_BY_STUDENT: Record<string, GoodnessHistoryItem[]> = {
    '68101001': [
        { id: 'gh-101-1', title: 'เข้าร่วมค่ายอาสาพัฒนาโรงเรียน', points: 132.315, date: '15 ต.ค. 2026', category: 'การมีจิตอาสา' },
        { id: 'gh-101-2', title: 'สตาฟงานวิ่ง Wailailak Run', points: 50.275, date: '10 ต.ค. 2026', category: 'การพัฒนาภาวะผู้นำ' },
        { id: 'gh-101-3', title: 'บริจาคโลหิต', points: 31.675, date: '1 ต.ค. 2026', category: 'การรู้วินัย' },
        { id: 'gh-101-4', title: 'เข้าร่วมฟังบรรยายพิเศษ', points: 14.075, date: '25 ก.ย. 2026', category: 'ความกตัญญู' },
        { id: 'gh-101-5', title: 'กิจกรรมอนุรักษ์', points: 17.91, date: '20 ก.ย. 2026', category: 'ความรักชาติ' },
    ],
    '68101002': [
        { id: 'gh-102-1', title: 'กิจกรรมจิตอาสาพัฒนาห้องปฏิบัติการ AI', points: 25.0, date: '18 ก.ย. 2026', category: 'การมีจิตอาสา' },
        { id: 'gh-102-2', title: 'อบรมระเบียบวินัยและจรรยาบรรณวิชาชีพ', points: 17.5, date: '5 ก.ย. 2026', category: 'การรู้วินัย' },
        { id: 'gh-102-3', title: 'พิธีไหว้ครูและแสดงมุทิตาจิต', points: 10.0, date: '28 ส.ค. 2026', category: 'ความกตัญญู' },
    ],
    '68101003': [
        { id: 'gh-103-1', title: 'หัวหน้าทีมค่ายเสริมสร้างภาวะผู้นำนักศึกษา', points: 45.0, date: '14 ต.ค. 2026', category: 'การพัฒนาภาวะผู้นำ' },
        { id: 'gh-103-2', title: 'อาสาช่วยงานศูนย์บรรณสารและสื่อการศึกษา', points: 35.5, date: '2 ต.ค. 2026', category: 'การมีจิตอาสา' },
        { id: 'gh-103-3', title: 'กิจกรรมสืบสานประเพณีและวัฒนธรรมไทย', points: 20.0, date: '21 ก.ย. 2026', category: 'ความกตัญญู' },
        { id: 'gh-103-4', title: 'กิจกรรมวันเยาวชนแห่งชาติ เทิดทูนสถาบัน', points: 12.0, date: '15 ก.ย. 2026', category: 'ความรักชาติ' },
    ],
    '68101004': [
        { id: 'gh-104-1', title: 'เข้าร่วมอบรมระเบียบวินัยนักศึกษาใหม่', points: 14.0, date: '12 ก.ย. 2026', category: 'การรู้วินัย' },
        { id: 'gh-104-2', title: 'กิจกรรมปฐมนิเทศและวันไหว้ครู', points: 14.0, date: '1 ก.ย. 2026', category: 'ความกตัญญู' },
    ],
};

export const INITIAL_GOODNESS_STATS_BY_STUDENT: Record<string, GoodnessCategoryStat[]> = {
    '68101001': [
        { id: 1, name: 'ความกตัญญู', target: 10, current: 14.075 },
        { id: 2, name: 'การรู้วินัย', target: 14, current: 31.675 },
        { id: 3, name: 'การมีจิตอาสา', target: 33, current: 132.315 },
        { id: 4, name: 'การพัฒนาภาวะผู้นำ', target: 33, current: 50.275 },
        { id: 5, name: 'ความรักชาติ', target: 10, current: 17.91 },
    ],
    '68101002': [
        { id: 1, name: 'ความกตัญญู', target: 10, current: 10.0 },
        { id: 2, name: 'การรู้วินัย', target: 14, current: 17.5 },
        { id: 3, name: 'การมีจิตอาสา', target: 33, current: 25.0 },
        { id: 4, name: 'การพัฒนาภาวะผู้นำ', target: 33, current: 0.0 },
        { id: 5, name: 'ความรักชาติ', target: 10, current: 0.0 },
    ],
    '68101003': [
        { id: 1, name: 'ความกตัญญู', target: 10, current: 20.0 },
        { id: 2, name: 'การรู้วินัย', target: 14, current: 0.0 },
        { id: 3, name: 'การมีจิตอาสา', target: 33, current: 35.5 },
        { id: 4, name: 'การพัฒนาภาวะผู้นำ', target: 33, current: 45.0 },
        { id: 5, name: 'ความรักชาติ', target: 10, current: 12.0 },
    ],
    '68101004': [
        { id: 1, name: 'ความกตัญญู', target: 10, current: 14.0 },
        { id: 2, name: 'การรู้วินัย', target: 14, current: 14.0 },
        { id: 3, name: 'การมีจิตอาสา', target: 33, current: 0.0 },
        { id: 4, name: 'การพัฒนาภาวะผู้นำ', target: 33, current: 0.0 },
        { id: 5, name: 'ความรักชาติ', target: 10, current: 0.0 },
    ],
};

export function createBlankGoodnessStats(): GoodnessCategoryStat[] {
    return BASE_WU_GOODNESS_TARGETS.map(item => ({ ...item, current: 0 }));
}

export function getStudentGoodnessHistory(
    studentId: string, 
    map?: Record<string, GoodnessHistoryItem[]>
): GoodnessHistoryItem[] {
    const sId = (studentId || '').trim();
    if (map && map[sId]) {
        return map[sId];
    }
    if (INITIAL_GOODNESS_HISTORY_BY_STUDENT[sId]) {
        return INITIAL_GOODNESS_HISTORY_BY_STUDENT[sId];
    }
    return [];
}

export function getStudentGoodnessStats(
    studentId: string, 
    map?: Record<string, GoodnessCategoryStat[]>
): GoodnessCategoryStat[] {
    const sId = (studentId || '').trim();
    if (map && map[sId]) {
        return map[sId];
    }
    if (INITIAL_GOODNESS_STATS_BY_STUDENT[sId]) {
        return INITIAL_GOODNESS_STATS_BY_STUDENT[sId];
    }
    return createBlankGoodnessStats();
}
