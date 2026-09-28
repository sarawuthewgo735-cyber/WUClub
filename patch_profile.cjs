const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const ProfileTab = \(\{ preferences, onEditPrefs, profileImg, onProfileImgChange, loginRole, clubName \}\) => \{/, 'const ProfileTab = ({ preferences, onEditPrefs, profileImg, onProfileImgChange, loginRole, clubName, language }) => {');
code = code.replace(/<ProfileTab preferences=\{userPrefs\} onEditPrefs=\{\(\) => setShowPrefsModal\(true\)\} profileImg=\{profileImg\} onProfileImgChange=\{setProfileImg\} loginRole=\{loginRole\} clubName=\{loginClubName\} \/>/g, 
    '<ProfileTab preferences={userPrefs} onEditPrefs={() => setShowPrefsModal(true)} profileImg={profileImg} onProfileImgChange={setProfileImg} loginRole={loginRole} clubName={loginClubName} language={language} />');

const profileTabReplacements = [
    {
        from: /<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">โปรไฟล์ของฉัน<\/h2>/,
        to: `<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">{language === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile'}</h2>`
    },
    {
        from: /<p className="text-gray-500 mb-4">\{isClub \? 'ประธานชมรม' : 'สำนักวิชาสารสนเทศศาสตร์'\}<\/p>/,
        to: `<p className="text-gray-500 mb-4">{isClub ? (language === 'th' ? 'ประธานชมรม' : 'Club President') : (language === 'th' ? 'สำนักวิชาสารสนเทศศาสตร์' : 'School of Informatics')}</p>`
    },
    {
        from: /<h3 className="font-bold text-gray-800 mb-3">ข้อมูลติดต่อ<\/h3>/,
        to: `<h3 className="font-bold text-gray-800 mb-3">{language === 'th' ? 'ข้อมูลติดต่อ' : 'Contact Information'}</h3>`
    },
    {
        from: /<h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">ความสนใจของฉัน <button onClick=\{onEditPrefs\} className="text-indigo-600 text-sm font-medium hover:underline flex items-center"><Edit2 size=\{14\} className="mr-1"\/> แก้ไข<\/button><\/h3>/,
        to: `<h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">{language === 'th' ? 'ความสนใจของฉัน' : 'My Interests'} <button onClick={onEditPrefs} className="text-indigo-600 text-sm font-medium hover:underline flex items-center"><Edit2 size={14} className="mr-1"/> {language === 'th' ? 'แก้ไข' : 'Edit'}</button></h3>`
    },
    {
        from: /<span key=\{idx\} className="px-3 py-1\.5 bg-indigo-50 text-indigo-700 text-xs md:text-sm font-semibold rounded-full border border-indigo-100">\{pref\}<\/span>/g,
        to: `<span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs md:text-sm font-semibold rounded-full border border-indigo-100">{translateCategory(pref, language)}</span>`
    },
    {
        from: /<div className="p-8 flex items-center justify-center h-full text-gray-400"><h2>กำลังพัฒนา\.\.\.<\/h2><\/div>/g,
        to: `<div className="p-8 flex items-center justify-center h-full text-gray-400"><h2>{language === 'th' ? 'กำลังพัฒนา...' : 'Coming soon...'}</h2></div>`
    }
];

profileTabReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

fs.writeFileSync('src/App.tsx', code);
console.log("Patched ProfileTab");
