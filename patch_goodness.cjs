const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const tCat = `const translateCategory = (cat, lang) => {
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
};`;

// Let's add translateCategory function below the imports
code = code.replace(/const CATEGORIES = /, `${tCat}\n\nconst CATEGORIES = `);

// Translate GoodnessTab
const goodnessContentReplacements = [
    {
        from: /<h3 className="text-indigo-100 mb-4 md:mb-6 font-medium text-lg md:text-xl z-10 text-center">คะแนนความดีสะสมของคุณ<\/h3>/,
        to: `<h3 className="text-indigo-100 mb-4 md:mb-6 font-medium text-lg md:text-xl z-10 text-center">{language === 'th' ? 'คะแนนความดีสะสมของคุณ' : 'Your Cumulative Goodness Points'}</h3>`
    },
    {
        from: /<span className="text-gray-500 font-medium mt-2 text-base md:text-lg">คะแนน<\/span>/,
        to: `<span className="text-gray-500 font-medium mt-2 text-base md:text-lg">{language === 'th' ? 'คะแนน' : 'Points'}</span>`
    },
    {
        from: /<span className="text-indigo-600 font-semibold">\{item\.category\}<\/span>/,
        to: `<span className="text-indigo-600 font-semibold">{translateCategory(item.category, language)}</span>`
    },
    {
        from: /\{showAllHistory \? 'ซ่อนประวัติบางส่วน' : \`ดูประวัติทั้งหมด \(\$\{MOCK_GOODNESS_HISTORY\.length\}\)\`\}/,
        to: `{showAllHistory ? (language === 'th' ? 'ซ่อนประวัติบางส่วน' : 'Show Less') : (language === 'th' ? \`ดูประวัติทั้งหมด (\${MOCK_GOODNESS_HISTORY.length})\` : \`View All History (\${MOCK_GOODNESS_HISTORY.length})\`)}`
    },
    {
        from: /<h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6">รายละเอียดคะแนนแต่ละด้าน<\/h3>/,
        to: `<h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6">{language === 'th' ? 'รายละเอียดคะแนนแต่ละด้าน' : 'Points by Category'}</h3>`
    },
    {
        from: /<th className="py-3 md:py-4 px-2 text-xs md:text-sm">ด้าน<\/th>/,
        to: `<th className="py-3 md:py-4 px-2 text-xs md:text-sm">{language === 'th' ? 'ด้าน' : 'Category'}</th>`
    },
    {
        from: /<th className="py-3 md:py-4 px-2 text-center text-xs md:text-sm">เป้าหมาย<\/th>/,
        to: `<th className="py-3 md:py-4 px-2 text-center text-xs md:text-sm">{language === 'th' ? 'เป้าหมาย' : 'Target'}</th>`
    },
    {
        from: /<th className="py-3 md:py-4 px-2 text-center text-xs md:text-sm">ปัจจุบัน<\/th>/,
        to: `<th className="py-3 md:py-4 px-2 text-center text-xs md:text-sm">{language === 'th' ? 'ปัจจุบัน' : 'Current'}</th>`
    },
    {
        from: /<th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-sm">สถานะ<\/th>/,
        to: `<th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-sm">{language === 'th' ? 'สถานะ' : 'Status'}</th>`
    },
    {
        from: /<td className="py-4 md:py-5 px-2 font-bold text-gray-700 text-sm md:text-base whitespace-nowrap">\{stat\.name\}<\/td>/,
        to: `<td className="py-4 md:py-5 px-2 font-bold text-gray-700 text-sm md:text-base whitespace-nowrap">{translateCategory(stat.name, language)}</td>`
    },
    {
        from: /<span className="text-green-600 font-bold bg-green-50 px-3 md:px-4 py-1 md:py-1\.5 rounded-full text-xs whitespace-nowrap">ผ่านเกณฑ์<\/span>/,
        to: `<span className="text-green-600 font-bold bg-green-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs whitespace-nowrap">{language === 'th' ? 'ผ่านเกณฑ์' : 'Passed'}</span>`
    },
    {
        from: /<span className="text-amber-600 font-bold bg-amber-50 px-3 md:px-4 py-1 md:py-1\.5 rounded-full text-xs whitespace-nowrap">กำลังเก็บ<\/span>/,
        to: `<span className="text-amber-600 font-bold bg-amber-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs whitespace-nowrap">{language === 'th' ? 'กำลังเก็บ' : 'In Progress'}</span>`
    }
];

goodnessContentReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

// Translate ClubsTab texts
code = code.replace(/<span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-\[9px\] md:text-\[10px\] font-bold px-1\.5 py-0\.5 md:px-2 md:py-1 rounded-md z-10">\{club\.category\}<\/span>/,
    `<span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md z-10">{translateCategory(club.category, language)}</span>`);
code = code.replace(/<span className="text-xs text-gray-500 flex items-center justify-center gap-1"><Users size=\{12\}\/> \{club\.members\} คน<\/span>/,
    `<span className="text-xs text-gray-500 flex items-center justify-center gap-1"><Users size={12}/> {club.members} {language === 'th' ? 'คน' : 'people'}</span>`);
code = code.replace(/<p className="text-base md:text-lg font-semibold">ยังไม่มีชมรมในหมวดหมู่นี้<\/p>/,
    `<p className="text-base md:text-lg font-semibold">{language === 'th' ? 'ยังไม่มีชมรมในหมวดหมู่นี้' : 'No clubs in this category'}</p>`);
code = code.replace(/\{cat\}/, `{translateCategory(cat, language)}`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched GoodnessTab and ClubsTab");
