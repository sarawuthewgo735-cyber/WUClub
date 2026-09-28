const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const actReplacements = [
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
        from: /<p className="text-base md:text-lg font-semibold">ยังไม่มีกิจกรรมที่เปิดรับสมัครในขณะนี้<\/p>/g,
        to: `<p className="text-base md:text-lg font-semibold">{language === 'th' ? 'ยังไม่มีกิจกรรมที่เปิดรับสมัครในขณะนี้' : 'No available activities at the moment'}</p>`
    }
];

actReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

// also fix HomeTab that might have similar texts in Activity cards
// The above regexes with 'g' flag should catch HomeTab if the strings are identical.

fs.writeFileSync('src/App.tsx', code);
console.log("Patched ActivitiesTab");
