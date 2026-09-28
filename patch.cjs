const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = `<div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><Icon size={24} className="md:w-7 md:h-7" /></div>`;
const endStr = `<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">กิจกรรมทั้งหมด</h3>`;

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = startStr + `
                                            <div><h4 className="font-bold text-gray-800 text-xs md:text-sm mt-1">{club.name}</h4><span className="text-[10px] md:text-xs text-gray-500">{club.members} สมาชิก</span></div>
                                        </div>
                                    );
                                })}
                             </div>
                         ) : (<div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">ไม่พบชมรมที่ค้นหา</div>)}
                    </section>
                </div>

                <div className="col-span-1 space-y-6">
                    <div className="bg-indigo-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                        <h3 className="text-indigo-100 text-sm font-semibold mb-1">คะแนนความดีของคุณ</h3>
                        <div className="flex items-end gap-2 mb-4"><span className="text-4xl font-bold">{totalPoints.toFixed(2)}</span><span className="text-sm opacity-80 mb-1">คะแนน</span></div>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 text-sm md:text-base">ปฏิทินกิจกรรม (ต.ค. 26)</h3>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">{days.map(d => <div key={d} className="text-[10px] md:text-xs text-gray-400 font-medium">{d}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                            {dates.map((d, i) => {
                                const targetDateStr = \`\${d} ต.ค. 2026\`;
                                const dayEvents = activities.filter(act => act.date === targetDateStr);
                                const hasEvent = dayEvents.length > 0;
                                const isToday = d === 24;

                                return (
                                    <div key={i} 
                                        onClick={() => { if (hasEvent) { setSelectedDate(targetDateStr); setDateEvents(dayEvents); } }}
                                        className={\`h-7 w-7 md:h-8 md:w-8 mx-auto flex items-center justify-center rounded-full text-xs md:text-sm relative transition-all
                                        \${isToday ? 'bg-indigo-500 text-white font-bold shadow-md' : 'text-gray-700 hover:bg-slate-100'}
                                        \${hasEvent ? 'cursor-pointer hover:ring-2 hover:ring-teal-200' : 'cursor-default'}
                                    \`}>
                                        {d}
                                        {hasEvent && !isToday && <span className="absolute bottom-0.5 md:bottom-1 w-1 h-1 bg-teal-500 rounded-full"></span>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- แก้ไข: อัปเดต ActivitiesTab ให้ซ่อนกิจกรรมที่เต็มแล้ว ---
const ActivitiesTab = ({ onViewDetail, activities }) => {
    const availableActivities = activities.filter(act => act.currentParticipants < act.maxParticipants);

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
            ` + endStr;
            
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex + endStr.length);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find start or end index");
}
