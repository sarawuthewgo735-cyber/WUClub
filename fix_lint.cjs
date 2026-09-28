const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix 1: Add Languages to import
code = code.replace(/\} from 'lucide-react';/, ', Languages } from \'lucide-react\';');

// Fix 2: Add language prop to Sidebar
code = code.replace(/<Sidebar currentTab=\{currentTab\} setCurrentTab=\{\(tab\) => \{ setCurrentTab\(tab\); setSelectedItem\(null\); \}\} onLogout=\{handleLogout\} loginRole=\{loginRole\} loginClubName=\{loginClubName\} profileImg=\{profileImg\} onProfileImgChange=\{setProfileImg\} \/>/, 
`<Sidebar currentTab={currentTab} setCurrentTab={(tab) => { setCurrentTab(tab); setSelectedItem(null); }} onLogout={handleLogout} loginRole={loginRole} loginClubName={loginClubName} profileImg={profileImg} onProfileImgChange={setProfileImg} language={language} />`);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed lint errors");
