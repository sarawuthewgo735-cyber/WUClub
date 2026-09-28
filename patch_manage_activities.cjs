const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const tCat = "translateCategory(act.goodnessCategory, language)";

// In ManageActivitiesTab, add language prop
code = code.replace(/const ManageActivitiesTab = \(\{ activities, setActivities, clubName \}\) => \{/, 'const ManageActivitiesTab = ({ activities, setActivities, clubName, language }) => {');
code = code.replace(/const DashboardTab = \(\{ activities, clubName \}\) => \{/, 'const DashboardTab = ({ activities, clubName, language }) => {');

// Update usage of ManageActivitiesTab and DashboardTab inside App component
code = code.replace(/<ManageActivitiesTab activities=\{globalActivities\} setActivities=\{setGlobalActivities\} clubName=\{loginClubName\} \/>/, 
    '<ManageActivitiesTab activities={globalActivities} setActivities={setGlobalActivities} clubName={loginClubName} language={language} />');
code = code.replace(/<DashboardTab activities=\{globalActivities\} clubName=\{loginClubName\} \/>/,
    '<DashboardTab activities={globalActivities} clubName={loginClubName} language={language} />');

// Language translation for ManageActivitiesTab headers and labels
const manageTabReplacements = [
    {
        from: /<h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">จัดการกิจกรรมทั้งหมด<\/h2>/,
        to: `<h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{language === 'th' ? 'จัดการกิจกรรมทั้งหมด' : 'Manage All Activities'}</h2>`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">ชื่อกิจกรรม<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'ชื่อกิจกรรม' : 'Activity Name'}</th>`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">วันที่จัด<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'วันที่จัด' : 'Date'}</th>`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">ผู้เข้าร่วม<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600">{language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'}</th>`
    },
    {
        from: /<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600 text-right">จัดการ<\/th>/,
        to: `<th className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-gray-600 text-right">{language === 'th' ? 'จัดการ' : 'Manage'}</th>`
    },
    {
        from: /<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 mt-2">แก้ไขกิจกรรม<\/h3>/,
        to: `<h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 mt-2">{language === 'th' ? 'แก้ไขกิจกรรม' : 'Edit Activity'}</h3>`
    },
    {
        from: /<button onClick=\{handleSaveEdit\} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 mt-4 shadow-md transition-colors">บันทึกการแก้ไข<\/button>/,
        to: `<button onClick={handleSaveEdit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 mt-4 shadow-md transition-colors">{language === 'th' ? 'บันทึกการแก้ไข' : 'Save Changes'}</button>`
    }
];
manageTabReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

fs.writeFileSync('src/App.tsx', code);
console.log("Patched ManageActivitiesTab");
