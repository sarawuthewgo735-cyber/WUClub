const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dashboardTabReplacements = [
    {
        from: /<h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">แดชบอร์ด<\/h2>/,
        to: `<h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">{language === 'th' ? 'แดชบอร์ด' : 'Dashboard'}</h2>`
    },
    {
        from: /<p className="text-xs md:text-sm text-gray-500 font-medium">กิจกรรมทั้งหมด<\/p>/,
        to: `<p className="text-xs md:text-sm text-gray-500 font-medium">{language === 'th' ? 'กิจกรรมทั้งหมด' : 'Total Activities'}</p>`
    },
    {
        from: /<p className="text-xs md:text-sm text-gray-500 font-medium">ผู้เข้าร่วมรวม<\/p>/,
        to: `<p className="text-xs md:text-sm text-gray-500 font-medium">{language === 'th' ? 'ผู้เข้าร่วมรวม' : 'Total Participants'}</p>`
    },
    {
        from: /<h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">กิจกรรมที่กำลังจะจัด<\/h3>/,
        to: `<h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">{language === 'th' ? 'กิจกรรมที่กำลังจะจัด' : 'Upcoming Activities'}</h3>`
    },
    {
        from: /<p className="text-\[10px\] md:text-xs text-indigo-600 font-medium mt-1">ผู้เข้าร่วม \{act\.currentParticipants\}\/\{act\.maxParticipants\} คน<\/p>/g,
        to: `<p className="text-[10px] md:text-xs text-indigo-600 font-medium mt-1">{language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'} {act.currentParticipants}/{act.maxParticipants} {language === 'th' ? 'คน' : 'people'}</p>`
    },
    {
        from: /ยังไม่มีกิจกรรม<\/div>/,
        to: `{language === 'th' ? 'ยังไม่มีกิจกรรม' : 'No activities'}</div>`
    },
    {
        from: /<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 mt-2">เพิ่มกิจกรรมใหม่<\/h3>/,
        to: `<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 mt-2">{language === 'th' ? 'เพิ่มกิจกรรมใหม่' : 'Add New Activity'}</h3>`
    },
    {
        from: /<button onClick=\{handleSaveActivity\} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 mt-2 shadow-md transition-colors">บันทึกกิจกรรม<\/button>/,
        to: `<button onClick={handleSaveActivity} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 mt-2 shadow-md transition-colors">{language === 'th' ? 'บันทึกกิจกรรม' : 'Save Activity'}</button>`
    }
];
dashboardTabReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

fs.writeFileSync('src/App.tsx', code);
console.log("Patched DashboardTab");
