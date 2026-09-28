const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let regex1 = /<div onClick=\{\(\) => \{ if\(loginRole === 'student'\) setCurrentTab\('profile'\); \}\} className=\{\`bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-3 border border-gray-100 transition-colors \$\{loginRole === 'student' \? 'cursor-pointer hover:border-indigo-300' : ''\}\`\}>/;
let rep1 = `<div onClick={() => setCurrentTab('profile')} className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-3 border border-gray-100 transition-colors cursor-pointer hover:border-indigo-300">`;
if(code.match(regex1)) {
    code = code.replace(regex1, rep1);
} else {
    console.log("Could not find regex1");
}

let regex2 = /<div className="flex items-center gap-3">[\s\S]*?\{loginRole === 'student' \? \([\s\S]*?<button onClick=\{\(\) => \{ setCurrentTab\('profile'\); setSelectedItem\(null\); \}\} className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm hover:opacity-80 transition-opacity overflow-hidden">[\s\S]*?\{profileImg \? <img src=\{profileImg\} alt="profile" className="w-full h-full object-cover" \/> : "JE"\}[\s\S]*?<\/button>[\s\S]*?\) : \([\s\S]*?<label className="cursor-pointer relative group w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm overflow-hidden">[\s\S]*?\{profileImg \? <img src=\{profileImg\} alt="profile" className="w-full h-full object-cover" \/> : <Utensils size=\{14\}\/>\}[\s\S]*?<input type="file" accept="image\/\*" className="hidden" onChange=\{\(e\) => \{[\s\S]*?const file = e\.target\.files\?\.\[0\];[\s\S]*?if \(file\) setProfileImg\(URL\.createObjectURL\(file\)\);[\s\S]*?\}\} \/>[\s\S]*?<\/label>[\s\S]*?\)\]?\}/;
let rep2 = `<div className="flex items-center gap-3">
                    <button onClick={() => { setCurrentTab('profile'); setSelectedItem(null); }} className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-80 transition-opacity overflow-hidden \${loginRole === 'student' ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-500'}\`}>
                        {profileImg ? <img src={profileImg} alt="profile" className="w-full h-full object-cover" /> : (loginRole === 'student' ? "JE" : <Utensils size={14}/>)}
                    </button>`;
if(code.match(regex2)) {
    code = code.replace(regex2, rep2);
} else {
    console.log("Could not find regex2");
}

let regex3 = /<ProfileTab preferences=\{userPrefs\} onEditPrefs=\{\(\) => setShowPrefsModal\(true\)\} profileImg=\{profileImg\} onProfileImgChange=\{setProfileImg\} \/>/;
let rep3 = `<ProfileTab preferences={userPrefs} onEditPrefs={() => setShowPrefsModal(true)} profileImg={profileImg} onProfileImgChange={setProfileImg} loginRole={loginRole} clubName={clubName} />`;
if(code.match(regex3)) {
    code = code.replace(regex3, rep3);
} else {
    console.log("Could not find regex3");
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched everything!");
