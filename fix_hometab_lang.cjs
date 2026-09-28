const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix activities map
code = code.replace(
    /<span className="absolute top-3 right-3 bg-indigo-500 text-white text-\[10px\] font-bold px-2 py-1 rounded-md z-10 shadow-sm">\{act\.category\}<\/span>/,
    '<span className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">{translateCategory(act.category, language)}</span>'
);
code = code.replace(
    /\{act\.goodnessCategory && act\.goodnessCategory !== '-' && \(\s*<p className="text-xs md:text-sm text-indigo-600 flex items-center font-medium"><Award size=\{15\} className="mr-2"\/> ได้คะแนนด้าน\{act\.goodnessCategory\} \(\+\{act\.goodnessPoints\}\)<\/p>\s*\)\}/,
    `{act.goodnessCategory && act.goodnessCategory !== '-' && (
                                                    <p className="text-xs md:text-sm text-indigo-600 flex items-center font-medium"><Award size={15} className="mr-2"/> {language === 'th' ? 'ได้คะแนนด้าน' : 'Points in '}{translateCategory(act.goodnessCategory, language)} (+{act.goodnessPoints})</p>
                                                )}`
);
code = code.replace(
    /<p className="text-xs md:text-sm flex items-center font-medium text-emerald-600">\s*<Users size=\{15\} className="mr-2"\/> ผู้เข้าร่วม \{act\.currentParticipants\}\/\{act\.maxParticipants\} คน\s*<\/p>/,
    `<p className="text-xs md:text-sm flex items-center font-medium text-emerald-600">
                                                    <Users size={15} className="mr-2"/> {language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'} {act.currentParticipants}/{act.maxParticipants} {language === 'th' ? 'คน' : 'people'}
                                                </p>`
);
code = code.replace(
    /ไม่พบกิจกรรมที่ค้นหา/,
    `{language === 'th' ? 'ไม่พบกิจกรรมที่ค้นหา' : 'No activities found'}`
);
// Fix clubs titles
code = code.replace(
    /\{isSearching \? \`ผลการค้นหาชมรม: "\$\{searchQuery\}"\` :\s*\(\(preferences && preferences\.length > 0 && !noMatchClub\) \? '✨ ชมรมที่น่าสนใจตามความชอบของคุณ' : 'ชมรมที่น่าสนใจ'\)\}/,
    `{isSearching ? (language === 'th' ? \`ผลการค้นหาชมรม: "\${searchQuery}"\` : \`Search results: "\${searchQuery}"\`) :
                                  ((preferences && preferences.length > 0 && !noMatchClub) ? (language === 'th' ? '✨ ชมรมที่น่าสนใจตามความชอบของคุณ' : '✨ Recommended clubs for you') : (language === 'th' ? 'ชมรมที่น่าสนใจ' : 'Interesting clubs'))}`
);
code = code.replace(
    /\{showAllClubs \? 'ย่อลง' : 'ดูทั้งหมด'\}/,
    `{showAllClubs ? (language === 'th' ? 'ย่อลง' : 'Show less') : (language === 'th' ? 'ดูทั้งหมด' : 'View all')}`
);
code = code.replace(
    /<span className="mr-2 text-lg">💡<\/span> ไม่มีกิจกรรมที่ตรงกับความชอบของคุณ ระบบจึงแนะนำกิจกรรมทั้งหมดแทน/,
    `<span className="mr-2 text-lg">💡</span> {language === 'th' ? 'ไม่มีกิจกรรมที่ตรงกับความชอบของคุณ ระบบจึงแนะนำกิจกรรมทั้งหมดแทน' : 'No activities match your preferences. Showing all activities instead.'}`
);
code = code.replace(
    /<span className="mr-2 text-lg">💡<\/span> ไม่มีชมรมที่ตรงกับความชอบของคุณ ระบบจึงแนะนำชมรมทั้งหมดแทน/,
    `<span className="mr-2 text-lg">💡</span> {language === 'th' ? 'ไม่มีชมรมที่ตรงกับความชอบของคุณ ระบบจึงแนะนำชมรมทั้งหมดแทน' : 'No clubs match your preferences. Showing all clubs instead.'}`
);

// Fix clubs map
code = code.replace(
    /<span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-\[9px\] md:text-\[10px\] font-bold px-2 py-1 rounded-md z-10">\{club\.category\}<\/span>/,
    '<span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-md z-10">{translateCategory(club.category, language)}</span>'
);
code = code.replace(
    /<span className="text-\[10px\] md:text-xs text-gray-500">\{club\.members\} สมาชิก<\/span>/,
    '<span className="text-[10px] md:text-xs text-gray-500">{club.members} {language === \'th\' ? \'สมาชิก\' : \'members\'}</span>'
);
code = code.replace(
    /ไม่พบชมรมที่ค้นหา/,
    `{language === 'th' ? 'ไม่พบชมรมที่ค้นหา' : 'No clubs found'}`
);


fs.writeFileSync('src/App.tsx', code);
console.log("Patched HomeTab");
