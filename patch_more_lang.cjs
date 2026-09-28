const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Translate Dashboard headers
code = code.replace(/<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">กิจกรรมทั้งหมด<\/h3>/, 
    `<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{language === 'th' ? 'กิจกรรมทั้งหมด' : 'All Activities'}</h3>`);

code = code.replace(/<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">ค้นหาชมรม<\/h3>/, 
    `<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{language === 'th' ? 'ค้นหาชมรม' : 'Find Clubs'}</h3>`);

code = code.replace(/<h2 className="text-2xl font-bold text-gray-800 mb-6">ระบบคะแนนความดี<\/h2>/, 
    `<h2 className="text-2xl font-bold text-gray-800 mb-6">{language === 'th' ? 'ระบบคะแนนความดี' : 'Goodness Points System'}</h2>`);

code = code.replace(/<h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6">ประวัติการรับคะแนน<\/h3>/, 
    `<h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6">{language === 'th' ? 'ประวัติการรับคะแนน' : 'Points History'}</h3>`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched more language headers");
