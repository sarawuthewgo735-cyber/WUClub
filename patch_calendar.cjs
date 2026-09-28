const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">[\s\S]*?<h3 className="font-bold text-gray-800 mb-4 text-sm md:text-base">ปฏิทินกิจกรรม \(ต\.ค\. 26\)<\/h3>[\s\S]*?<div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">\{days\.map\(d => <div key=\{d\} className="text-\[10px\] md:text-xs text-gray-400 font-medium">\{d\}<\/div>\)\}<\/div>[\s\S]*?<div className="grid grid-cols-7 gap-1 md:gap-2 text-center">[\s\S]*?\{dates\.map\(\(d, i\) => \{[\s\S]*?const targetDateStr = \`\$\{d\} ต\.ค\. 2026\`;[\s\S]*?const dayEvents = activities\.filter\(act => act\.date === targetDateStr\);[\s\S]*?const hasEvent = dayEvents\.length > 0;[\s\S]*?const isToday = d === 24;[\s\S]*?return \([\s\S]*?<div key=\{i\}[\s\S]*?onClick=\{\(\) => \{ if \(hasEvent\) \{ setSelectedDate\(targetDateStr\); setDateEvents\(dayEvents\); \} \}\}[\s\S]*?className=\{[\s\S]*?\}>[\s\S]*?\{d\}[\s\S]*?\{hasEvent && !isToday && <span className="absolute bottom-0\.5 md:bottom-1 w-1 h-1 bg-teal-500 rounded-full"><\/span>\}[\s\S]*?<\/div>[\s\S]*?\)[\s\S]*?\}\)\}[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const replacement = `<div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-sm md:text-base">ปฏิทินกิจกรรม</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={prevMonth} className="text-gray-400 hover:text-indigo-500"><ChevronLeft size={18} /></button>
                                <span className="text-sm font-semibold w-16 text-center">{monthNames[currentMonth]} {(currentYear % 100).toString()}</span>
                                <button onClick={nextMonth} className="text-gray-400 hover:text-indigo-500"><ChevronRight size={18} /></button>
                                <button onClick={() => setShowAddEvent(true)} className="ml-2 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors">+</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">{days.map(d => <div key={d} className="text-[10px] md:text-xs text-gray-400 font-medium">{d}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                            {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
                                <div key={\`empty-\${i}\`} className="h-7 w-7 md:h-8 md:w-8"></div>
                            ))}
                            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, i) => {
                                const d = i + 1;
                                const targetDateStr = \`\${d} \${monthNames[currentMonth]} \${currentYear}\`;
                                // For mock activities format is slightly different e.g., 24 ต.ค. 2026. monthNames[9] is ต.ค.
                                const allEvents = [...activities, ...personalEvents];
                                const dayEvents = allEvents.filter(act => {
                                    if(act.type === 'personal') return act.date === \`\${currentYear}-\${(currentMonth+1).toString().padStart(2, '0')}-\${d.toString().padStart(2, '0')}\`;
                                    return act.date === targetDateStr;
                                });
                                const hasEvent = dayEvents.length > 0;
                                const isToday = d === 24 && currentMonth === 9 && currentYear === 2026;

                                return (
                                    <div key={d} 
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
                        
                        {showAddEvent && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 rounded-3xl p-4 flex flex-col justify-center animate-in fade-in zoom-in duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800 text-sm">เพิ่มกิจกรรมส่วนตัว</h4>
                                    <button onClick={() => setShowAddEvent(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                                </div>
                                <input type="text" placeholder="ชื่องาน..." value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-indigo-500" />
                                <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-indigo-500" />
                                <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-indigo-500" />
                                <button onClick={handleAddEvent} className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-bold hover:bg-indigo-700">บันทึก</button>
                            </div>
                        )}
                    </div>`;

if(code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched calendar UI successfully");
} else {
    console.log("Regex not found for calendar UI");
}
