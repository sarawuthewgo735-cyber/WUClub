const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `const MOCK_NAMES = ['นายสมชาย ใจดี', 'นางสาวสมหญิง รักเรียน', 'นายใจกล้า หาญชัย', 'นางสาวมานี มีนา', 'นายสมศักดิ์ มักจะ', 'นางสาวกานดา นารี', 'นายวิทวัส เก่งการ', 'นางสาววิไลลักษณ์ สมศรี', 'นายเจษฎา ปัญญาไว', 'นางสาวพิมพา น่ารัก'];
const MOCK_MAJORS = ['เทคโนโลยีสารสนเทศ ปี 1', 'เทคโนโลยีสารสนเทศ ปี 2', 'วิศวกรรมคอมพิวเตอร์ ปี 1', 'วิศวกรรมคอมพิวเตอร์ ปี 2', 'บัญชี ปี 1', 'บัญชี ปี 2', 'นิเทศศาสตร์ ปี 1', 'นิเทศศาสตร์ ปี 2'];

const INITIAL_MEMBERS = INITIAL_CLUBS.flatMap(club => 
    Array.from({ length: club.members }, (_, i) => ({
        id: \`\${club.id}-\${i + 1}\`,
        clubName: club.name,
        studentId: \`6810\${(i + 1).toString().padStart(3, '0')}\`,
        name: MOCK_NAMES[i % MOCK_NAMES.length] + (i >= MOCK_NAMES.length ? \` \${i + 1}\` : ''),
        major: MOCK_MAJORS[i % MOCK_MAJORS.length],
        joinDate: \`\${(i % 28) + 1} มิ.ย. 2026\`,
        status: 'ปกติ',
        role: i === 0 ? 'ประธาน' : i === 1 ? 'รองประธาน' : i === 2 ? 'เหรัญญิก' : 'สมาชิก'
    }))
);`;

content = content.replace(/const MOCK_NAMES = \[\'นายสมชาย ใจดี\'.*?\}\)\);/s, replacement);
fs.writeFileSync('src/App.tsx', content);
console.log('done');
