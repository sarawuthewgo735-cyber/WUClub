const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">\s*<div><h2 className="text-xl md:text-2xl font-bold text-gray-800">สวัสดีค่ะ, เจ๊ร่า 👋<\/h2><p className="text-sm md:text-base text-gray-500 mt-1">วันนี้มีกิจกรรมที่คุณอาจสนใจตรงกับความชอบของคุณ<\/p><\/div>\s*<div className="relative w-full md:w-auto">\s*<Search size=\{20\} className="absolute left-4 top-1\/2 transform -translate-y-1\/2 text-gray-400" \/>\s*<input type="text" placeholder="ค้นหาชมรม, กิจกรรม\.\.\." value=\{searchQuery\} onChange=\{\(e\) => setSearchQuery\(e.target.value\)\} className="w-full md:w-72 bg-white border border-gray-200 rounded-full py-2\.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500\/50" \/>\s*<\/div>\s*<\/div>/;

const replacement = `<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <div><h2 className="text-xl md:text-2xl font-bold text-gray-800">สวัสดีค่ะ, เจ๊ร่า 👋</h2><p className="text-sm md:text-base text-gray-500 mt-1">วันนี้มีกิจกรรมที่คุณอาจสนใจตรงกับความชอบของคุณ</p></div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-auto flex-1 md:flex-none">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="ค้นหาชมรม, กิจกรรม..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-72 bg-white border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <button className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </div>`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched search bar successfully");
} else {
    console.log("Could not find regex for search bar");
}
