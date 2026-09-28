const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /const HomeTab = \(\{ onViewDetail, preferences, onViewAll, activities, clubs, personalEvents = \[\], setPersonalEvents \}\) => \{/;
const replacement1 = `const HomeTab = ({ onViewDetail, preferences, onViewAll, activities, clubs, personalEvents = [], setPersonalEvents }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications = [
        { id: 1, text: 'กิจกรรม "พัฒนาชุมชนรอบมอ" ได้รับการอนุมัติแล้ว', time: '10 นาทีที่แล้ว' },
        { id: 2, text: 'ชมรมวิ่งมีประกาศใหม่: วันนี้งดวิ่ง', time: '2 ชั่วโมงที่แล้ว' },
    ];`;

code = code.replace(regex1, replacement1);

const regex2 = /<button className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer">[\s\S]*?<Bell size=\{20\} className="text-gray-600" \/>[\s\S]*?<span className="absolute top-2 right-2\.5 w-2\.5 h-2\.5 bg-red-500 rounded-full border-2 border-white"><\/span>[\s\S]*?<\/button>/;
const replacement2 = `<div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-slate-50">
                                    <h4 className="font-bold text-gray-800">การแจ้งเตือน</h4>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <p className="text-sm text-gray-800">{notif.text}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>`;

code = code.replace(regex2, replacement2);

const regex3 = /<div className="bg-indigo-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">[\s\S]*?<div className="absolute top-\[-20px\] right-\[-20px\] w-24 h-24 bg-white opacity-10 rounded-full blur-xl"><\/div>[\s\S]*?<h3 className="text-indigo-100 text-sm font-semibold mb-1">คะแนนความดีของคุณ<\/h3>[\s\S]*?<div className="flex items-end gap-2 mb-4"><span className="text-4xl font-bold">\{totalPoints\.toFixed\(2\)\}<\/span><span className="text-sm opacity-80 mb-1">คะแนน<\/span><\/div>[\s\S]*?<\/div>/;
const replacement3 = `<div onClick={() => onViewAll('goodness')} className="bg-indigo-500 hover:bg-indigo-600 transition-colors cursor-pointer rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
                        <h3 className="text-indigo-100 text-sm font-semibold mb-1">คะแนนความดีของคุณ</h3>
                        <div className="flex items-end gap-2 mb-4"><span className="text-4xl font-bold">{totalPoints.toFixed(2)}</span><span className="text-sm opacity-80 mb-1">คะแนน</span></div>
                        <div className="flex items-center text-xs font-semibold text-indigo-200">ดูรายละเอียด <ChevronRight size={14} className="ml-1"/></div>
                    </div>`;

code = code.replace(regex3, replacement3);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched HomeTab notifications and goodness card");
