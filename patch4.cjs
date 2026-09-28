const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const ProfileTab = \(\{ preferences, onEditPrefs, profileImg, onProfileImgChange \}\) => \([\s\S]*?    <\/div>\s*\);/m;

const replacement = `const ProfileTab = ({ preferences, onEditPrefs, profileImg, onProfileImgChange, loginRole, clubName }) => {
    const isClub = loginRole === 'club';
    return (
    <div className="p-4 md:p-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">โปรไฟล์ของฉัน</h2>
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 mb-6 md:mb-8 text-center md:text-left">
            <label className="cursor-pointer relative group w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-indigo-50 flex items-center justify-center bg-indigo-500 text-white text-3xl md:text-4xl font-bold shadow-md overflow-hidden flex-shrink-0">
                {profileImg ? <img src={profileImg} alt="profile" className="w-full h-full object-cover" /> : (isClub ? <Utensils size={48}/> : "JE")}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onProfileImgChange(URL.createObjectURL(file));
                }} />
            </label>
            <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">{isClub ? (clubName || 'ชมรมทำอาหาร') : 'เจ๊ร่า ซอยเคลิ้ม'}</h3>
                <p className="text-gray-500 mt-1 text-sm md:text-lg">{isClub ? 'ผู้ดูแลชมรม' : 'IT ปี 2 • รหัสนักศึกษา: 681xxxx'}</p>
            </div>
        </div>

        {isClub ? (
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h4 className="font-bold text-gray-800 text-lg md:text-xl">ข้อมูลชมรม (Club Information)</h4>
                </div>
                <div className="space-y-4 text-left">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">หมวดหมู่</p>
                        <p className="text-gray-800">ไลฟ์สไตล์</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">รายละเอียดชมรม</p>
                        <p className="text-gray-800 leading-relaxed">ชมรมที่รวบรวมคนรักการทำอาหาร มาร่วมแชร์สูตรอาหารและทำกิจกรรมร่วมกัน</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h4 className="font-bold text-gray-800 text-lg md:text-xl">ความสนใจของคุณ (Preferences)</h4>
                    <button onClick={onEditPrefs} className="w-full md:w-auto text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center justify-center bg-indigo-50 px-4 py-2.5 rounded-xl transition-colors">แก้ไขความสนใจ</button>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                    {preferences && preferences.length > 0 ? preferences.map(pref => (
                        <span key={pref} className="bg-indigo-500 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-sm">{pref}</span>
                    )) : <span className="text-gray-400 italic text-sm">ยังไม่ได้ระบุความสนใจ</span>}
                </div>
            </div>
        )}
    </div>
    );
};`;

if (code.match(regex)) {
    fs.writeFileSync('src/App.tsx', code.replace(regex, replacement));
    console.log("Patched successfully");
} else {
    console.log("Could not find match");
}
