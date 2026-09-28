const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const ManageMembersTab = \(\{ clubName, members \}\) => \{/, 'const ManageMembersTab = ({ clubName, members, language }) => {');

code = code.replace(/<ManageMembersTab clubName=\{loginClubName\} members=\{globalMembers\} \/>/, '<ManageMembersTab clubName={loginClubName} members={globalMembers} language={language} />');

const membersTabReplacements = [
    {
        from: /<h2 className="text-xl md:text-2xl font-bold text-gray-800">รายชื่อสมาชิกชมรม<\/h2>/,
        to: `<h2 className="text-xl md:text-2xl font-bold text-gray-800">{language === 'th' ? 'รายชื่อสมาชิกชมรม' : 'Club Members'}</h2>`
    },
    {
        from: /placeholder="ค้นหาชื่อ, รหัสนักศึกษา..."/,
        to: `placeholder={language === 'th' ? "ค้นหาชื่อ, รหัสนักศึกษา..." : "Search name, student ID..."}`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">รหัสนักศึกษา<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'รหัสนักศึกษา' : 'Student ID'}</th>`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">ชื่อ-สกุล<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'ชื่อ-สกุล' : 'Name'}</th>`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600 hidden sm:table-cell">สำนักวิชา<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600 hidden sm:table-cell">{language === 'th' ? 'สำนักวิชา' : 'School/Major'}</th>`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">วันที่เข้าร่วม<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">{language === 'th' ? 'วันที่เข้าร่วม' : 'Joined Date'}</th>`
    },
    {
        from: /<td colSpan=\{4\} className="py-8 text-center text-gray-500">ไม่พบรายชื่อสมาชิก<\/td>/,
        to: `<td colSpan={4} className="py-8 text-center text-gray-500">{language === 'th' ? 'ไม่พบรายชื่อสมาชิก' : 'No members found'}</td>`
    }
];
membersTabReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

fs.writeFileSync('src/App.tsx', code);
console.log("Patched ManageMembersTab");
