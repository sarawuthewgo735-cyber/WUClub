const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update Sidebar props if not already updated
const sidebarPropsRegex = /<Sidebar currentTab=\{currentTab\} setCurrentTab=\{setCurrentTab\} onLogout=\{\(\) => setIsLoggedIn\(false\)\} loginRole=\{loginRole\} loginClubName=\{loginClubName\} profileImg=\{profileImg\} onProfileImgChange=\{setProfileImg\} \/>/;
code = code.replace(sidebarPropsRegex, `<Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={() => setIsLoggedIn(false)} loginRole={loginRole} loginClubName={loginClubName} profileImg={profileImg} onProfileImgChange={setProfileImg} language={language} />`);

const bottomNavRegex = /\{\(loginRole === 'student' \? \[\s*\{ id: 'home', icon: Home, label: 'หน้าหลัก' \},\s*\{ id: 'activities', icon: Calendar, label: 'กิจกรรม' \},\s*\{ id: 'clubs', icon: Users, label: 'ชมรม' \},\s*\{ id: 'goodness', icon: Star, label: 'คะแนน' \},\s*\] : \[\s*\{ id: 'club_dashboard', icon: Home, label: 'แดชบอร์ด' \},\s*\{ id: 'manage_activities', icon: Calendar, label: 'กิจกรรม' \},\s*\{ id: 'manage_members', icon: Users, label: 'สมาชิก' \},\s*\]\)\.map\(item => \{/g;
const bottomNavReplace = `{(loginRole === 'student' ? [
                    { id: 'home', icon: Home, label: language === 'th' ? 'หน้าหลัก' : 'Home' },
                    { id: 'activities', icon: Calendar, label: language === 'th' ? 'กิจกรรม' : 'Activities' },
                    { id: 'clubs', icon: Users, label: language === 'th' ? 'ชมรม' : 'Clubs' },
                    { id: 'goodness', icon: Star, label: language === 'th' ? 'คะแนน' : 'Goodness' },
                ] : [
                    { id: 'club_dashboard', icon: Home, label: language === 'th' ? 'แดชบอร์ด' : 'Dashboard' },
                    { id: 'manage_activities', icon: Calendar, label: language === 'th' ? 'กิจกรรม' : 'Activities' },
                    { id: 'manage_members', icon: Users, label: language === 'th' ? 'สมาชิก' : 'Members' },
                ]).map(item => {`;
code = code.replace(bottomNavRegex, bottomNavReplace);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched bottom nav");
