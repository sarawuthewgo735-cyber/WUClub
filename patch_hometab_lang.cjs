const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    /<div><h2 className="text-xl md:text-2xl font-bold text-gray-800">สวัสดีค่ะ, เจ๊ร่า 👋<\/h2><p className="text-sm md:text-base text-gray-500 mt-1">วันนี้มีกิจกรรมที่คุณอาจสนใจตรงกับความชอบของคุณ<\/p><\/div>/,
    `<div><h2 className="text-xl md:text-2xl font-bold text-gray-800">{language === 'th' ? 'สวัสดีค่ะ, เจ๊ร่า 👋' : 'Hello, Sarah 👋'}</h2><p className="text-sm md:text-base text-gray-500 mt-1">{language === 'th' ? 'วันนี้มีกิจกรรมที่คุณอาจสนใจตรงกับความชอบของคุณ' : 'Today, there are activities you might be interested in based on your preferences.'}</p></div>`
);

code = code.replace(
    /\{isSearching \? \`ผลการค้นหากิจกรรม: "\$\{searchQuery\}"\` : \n                                \(\(preferences && preferences\.length > 0 && !noMatchAct\) \? '✨ กิจกรรมแนะนำตามความสนใจของคุณ' : 'กิจกรรมแนะนำสำหรับคุณ'\)\}/,
    `{isSearching ? \`\${language === 'th' ? 'ผลการค้นหากิจกรรม' : 'Search results'}: "\${searchQuery}"\` : 
                                ((preferences && preferences.length > 0 && !noMatchAct) ? (language === 'th' ? '✨ กิจกรรมแนะนำตามความสนใจของคุณ' : '✨ Recommended activities for you') : (language === 'th' ? 'กิจกรรมแนะนำสำหรับคุณ' : 'Recommended activities'))}`
);

code = code.replace(
    /<h3 className="text-indigo-100 text-sm font-semibold mb-1">คะแนนความดีของคุณ<\/h3>/,
    `<h3 className="text-indigo-100 text-sm font-semibold mb-1">{language === 'th' ? 'คะแนนความดีของคุณ' : 'Your Goodness Points'}</h3>`
);

code = code.replace(
    /<span className="text-sm opacity-80 mb-1">คะแนน<\/span>/,
    `<span className="text-sm opacity-80 mb-1">{language === 'th' ? 'คะแนน' : 'Points'}</span>`
);

code = code.replace(
    /<div className="flex items-center text-xs font-semibold text-indigo-200">ดูรายละเอียด <ChevronRight size=\{14\} className="ml-1"\/><\/div>/,
    `<div className="flex items-center text-xs font-semibold text-indigo-200">{language === 'th' ? 'ดูรายละเอียด' : 'View Details'} <ChevronRight size={14} className="ml-1"/></div>`
);

code = code.replace(
    /<h3 className="font-bold text-gray-800 text-sm md:text-base">ปฏิทินกิจกรรม<\/h3>/,
    `<h3 className="font-bold text-gray-800 text-sm md:text-base">{language === 'th' ? 'ปฏิทินกิจกรรม' : 'Activity Calendar'}</h3>`
);

code = code.replace(
    /<h4 className="font-bold text-gray-800">การแจ้งเตือน<\/h4>/,
    `<h4 className="font-bold text-gray-800">{language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}</h4>`
);

code = code.replace(
    /\{showAllActs \? 'ย่อลง' : 'ดูทั้งหมด'\}/,
    `{showAllActs ? (language === 'th' ? 'ย่อลง' : 'Show less') : (language === 'th' ? 'ดูทั้งหมด' : 'View all')}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched HomeTab language");
