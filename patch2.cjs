const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="p-8 animate-in fade-in duration-300 max-w-7xl mx-auto">([\s\S]*?)<div className="overflow-x-auto">/g;

const match = regex.exec(code);

if (match) {
    const replacement = `<div className="p-4 md:p-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ระบบคะแนนความดี</h2>
            <div className="flex flex-col gap-4 md:gap-8">
                <div className="bg-indigo-500 rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-white shadow-lg relative overflow-hidden w-full">
                    <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <h3 className="text-indigo-100 mb-4 md:mb-6 font-medium text-lg md:text-xl z-10 text-center">คะแนนความดีสะสมของคุณ</h3>
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white flex flex-col items-center justify-center border-4 border-indigo-200 shadow-inner z-10">
                        <span className="text-5xl md:text-6xl font-bold text-indigo-500">{totalPoints.toFixed(2)}</span>
                        <span className="text-gray-500 font-medium mt-2 text-base md:text-lg">คะแนน</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 h-fit overflow-hidden">
                        <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6">ประวัติการรับคะแนน</h3>
                        <div className="space-y-3 md:space-y-4">
                            {displayedHistory.map((item) => {
                                let Icon = Award;
                                if(item.category === 'การมีจิตอาสา') Icon = HeartHandshake;
                                if(item.category === 'การรู้วินัย') Icon = Heart;
                                if(item.category === 'การพัฒนาภาวะผู้นำ') Icon = Users;
                                if(item.category === 'ความกตัญญู') Icon = BookOpen;
                                
                                return (
                                    <div key={item.id} className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-gray-100 flex items-start justify-between hover:bg-slate-100 transition-colors gap-2">
                                        <div className="flex items-start md:items-center gap-3 md:gap-4 overflow-hidden">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0 mt-1 md:mt-0"><Icon size={18} className="md:w-5 md:h-5 w-4 h-4" /></div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-gray-800 mb-0.5 md:mb-1 text-sm md:text-base break-words">{item.title}</h4>
                                                <p className="text-xs md:text-sm text-gray-500">{item.date} <span className="hidden sm:inline">•</span> <br className="sm:hidden" /><span className="text-indigo-600 font-semibold">{item.category}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-teal-600 font-bold text-sm md:text-xl flex-shrink-0 mt-1 md:mt-0">+{item.points.toFixed(3)}</div>
                                    </div>
                                )
                            })}
                            
                            {MOCK_GOODNESS_HISTORY.length > 3 && (
                                <button 
                                    onClick={() => setShowAllHistory(!showAllHistory)} 
                                    className="w-full py-2.5 md:py-3 mt-2 text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-sm"
                                >
                                    {showAllHistory ? 'ซ่อนประวัติบางส่วน' : \`ดูประวัติทั้งหมด (\${MOCK_GOODNESS_HISTORY.length})\`}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 h-fit overflow-hidden">
                        <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6">รายละเอียดคะแนนแต่ละด้าน</h3>
                        <div className="overflow-x-auto pb-2">`;
    fs.writeFileSync('src/App.tsx', code.replace(regex, replacement));
    console.log("Patched successfully");
} else {
    console.log("Could not match GoodnessTab");
}
