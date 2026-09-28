const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const homeReplacements = [
    {
        from: /<span className="text-\[10px\] md:text-xs text-teal-600 font-semibold bg-teal-50 px-2 md:px-3 py-1 rounded-full">\{act\.club\}<\/span>/g,
        to: `<span className="text-[10px] md:text-xs text-teal-600 font-semibold bg-teal-50 px-2 md:px-3 py-1 rounded-full">{act.club}</span>`
    },
    {
        from: /<p className="text-xs md:text-sm text-indigo-600 flex items-center font-medium"><Award size=\{14\} className="mr-2"\/> ได้คะแนนด้าน\{act\.goodnessCategory\} \(\+\{act\.goodnessPoints\}\)<\/p>/g,
        to: `<p className="text-xs md:text-sm text-indigo-600 flex items-center font-medium"><Award size={14} className="mr-2"/> {language === 'th' ? 'ได้คะแนนด้าน' : 'Points in '}{translateCategory(act.goodnessCategory, language)} (+{act.goodnessPoints})</p>`
    },
    {
        from: /<Users size=\{14\} className="mr-2"\/> ผู้เข้าร่วม \{act\.currentParticipants\}\/\{act\.maxParticipants\} คน/g,
        to: `<Users size={14} className="mr-2"/> {language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'} {act.currentParticipants}/{act.maxParticipants} {language === 'th' ? 'คน' : 'people'}`
    },
    {
        from: /<h3 className="font-bold text-gray-800 mb-4 md:mb-6 text-sm md:text-base">✨ ชมรมที่น่าสนใจตามความชอบของคุณ<\/h3>/,
        to: `<h3 className="font-bold text-gray-800 mb-4 md:mb-6 text-sm md:text-base">{language === 'th' ? '✨ ชมรมที่น่าสนใจตามความชอบของคุณ' : '✨ Recommended Clubs for You'}</h3>`
    },
    {
        from: /<span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-\[9px\] md:text-\[10px\] font-bold px-1\.5 py-0\.5 md:px-2 md:py-1 rounded-md z-10">\{club\.category\}<\/span>/,
        to: `<span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md z-10">{translateCategory(club.category, language)}</span>`
    }
];

homeReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

fs.writeFileSync('src/App.tsx', code);
console.log("Patched HomeTab components");
