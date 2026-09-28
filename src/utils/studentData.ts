export interface StudentProfile {
    id: string;
    name: string;
    year: string;
    major: string;
    initials: string;
}

export const DEFAULT_STUDENT_PROFILES: Record<string, StudentProfile> = {
    '68101001': {
        id: '68101001',
        name: 'เจ๊ร่า ซอยเคลิ้ม',
        year: 'ปี 2',
        major: 'เทคโนโลยีสารสนเทศ',
        initials: 'เจ๊'
    },
    '68101002': {
        id: '68101002',
        name: 'สมชาย สายลุย',
        year: 'ปี 1',
        major: 'วิศวกรรมคอมพิวเตอร์และ AI',
        initials: 'สม'
    },
    '68101003': {
        id: '68101003',
        name: 'กิตติยา วงศ์สว่าง',
        year: 'ปี 3',
        major: 'การจัดการสารสนเทศและดิจิทัล',
        initials: 'กิต'
    },
    '68101004': {
        id: '68101004',
        name: 'ธนากร มุ่งมั่น',
        year: 'ปี 1',
        major: 'วิทยาการคอมพิวเตอร์',
        initials: 'ธน'
    },
};

export function getStudentProfile(
    studentId: string, 
    customMap?: Record<string, StudentProfile>
): StudentProfile {
    const sId = (studentId || '').trim();
    if (customMap && customMap[sId]) {
        return customMap[sId];
    }
    if (DEFAULT_STUDENT_PROFILES[sId]) {
        return DEFAULT_STUDENT_PROFILES[sId];
    }
    const shortName = sId ? `นักศึกษา (${sId})` : 'นักศึกษา';
    const init = sId ? sId.slice(-2) : 'ST';
    return {
        id: sId || '68101001',
        name: shortName,
        year: 'ปี 1',
        major: 'สำนักวิชาสารสนเทศศาสตร์',
        initials: init
    };
}
