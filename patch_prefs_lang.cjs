const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const PreferencesModal = \(\{ currentPrefs, onSave, isMandatory \}\) => \{/, 'const PreferencesModal = ({ currentPrefs, onSave, isMandatory, language }) => {');
code = code.replace(/<PreferencesModal currentPrefs=\{userPrefs\} onSave=\{\(prefs\) => \{ setUserPrefs\(prefs\); setShowPrefsModal\(false\); setIsFirstLogin\(false\); \}\} isMandatory=\{isFirstLogin\} \/>/, 
    '<PreferencesModal currentPrefs={userPrefs} onSave={(prefs) => { setUserPrefs(prefs); setShowPrefsModal(false); setIsFirstLogin(false); }} isMandatory={isFirstLogin} language={language} />');
code = code.replace(/<PreferencesModal currentPrefs=\{userPrefs\} onSave=\{\(prefs\) => \{ setUserPrefs\(prefs\); setShowPrefsModal\(false\); \}\} isMandatory=\{false\} \/>/,
    '<PreferencesModal currentPrefs={userPrefs} onSave={(prefs) => { setUserPrefs(prefs); setShowPrefsModal(false); }} isMandatory={false} language={language} />'); // Just in case it's called elsewhere

const prefsTabReplacements = [
    {
        from: /<h2 className="text-2xl font-bold text-gray-800">เลือกความสนใจของคุณ<\/h2>/,
        to: `<h2 className="text-2xl font-bold text-gray-800">{language === 'th' ? 'เลือกความสนใจของคุณ' : 'Choose Your Interests'}</h2>`
    },
    {
        from: /\{isMandatory \? 'เลือกสิ่งที่คุณชอบ เพื่อให้เราแนะนำกิจกรรมที่ใช่!' : 'อัปเดตความสนใจของคุณ เพื่อปรับปรุงการแนะนำ'\}/,
        to: `{isMandatory ? (language === 'th' ? 'เลือกสิ่งที่คุณชอบ เพื่อให้เราแนะนำกิจกรรมที่ใช่!' : 'Choose what you like so we can recommend the right activities!') : (language === 'th' ? 'อัปเดตความสนใจของคุณ เพื่อปรับปรุงการแนะนำ' : 'Update your interests to improve recommendations')}`
    },
    {
        from: /<span className="font-semibold text-sm">\{cat\}<\/span>/,
        to: `<span className="font-semibold text-sm">{translateCategory(cat, language)}</span>`
    },
    {
        from: /<span className="font-semibold text-sm">อื่นๆ<\/span>/,
        to: `<span className="font-semibold text-sm">{language === 'th' ? 'อื่นๆ' : 'Other'}</span>`
    },
    {
        from: /placeholder="ระบุความสนใจอื่นๆ ที่คุณชอบ\.\.\."/,
        to: `placeholder={language === 'th' ? "ระบุความสนใจอื่นๆ ที่คุณชอบ..." : "Specify other interests..."}`
    },
    {
        from: /<button onClick=\{handleSave\} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-4 shadow-lg transition-all text-lg active:scale-95">เริ่มใช้งาน<\/button>/,
        to: `<button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-4 shadow-lg transition-all text-lg active:scale-95">{language === 'th' ? 'เริ่มใช้งาน' : 'Get Started'}</button>`
    }
];
prefsTabReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

fs.writeFileSync('src/App.tsx', code);
console.log("Patched PreferencesModal");
