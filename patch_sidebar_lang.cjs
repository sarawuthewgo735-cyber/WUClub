const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const sidebarRegex = /const Sidebar = \(\{ currentTab, setCurrentTab, onLogout, loginRole, loginClubName, profileImg, onProfileImgChange \}\) => \{([\s\S]*?)const clubNav = /;
code = code.replace(sidebarRegex, `const Sidebar = ({ currentTab, setCurrentTab, onLogout, loginRole, loginClubName, profileImg, onProfileImgChange, language }) => {
    const studentNav = [
        { id: 'home', icon: Home, label: language === 'th' ? 'หน้าหลัก' : 'Home' },
        { id: 'activities', icon: Calendar, label: language === 'th' ? 'กิจกรรมทั้งหมด' : 'Activities' },
        { id: 'clubs', icon: Users, label: language === 'th' ? 'ชมรม' : 'Clubs' },
        { id: 'goodness', icon: Star, label: language === 'th' ? 'คะแนนความดี' : 'Goodness' },
    ];

    const clubNav = `);

const clubNavRegex = /const clubNav = \[([\s\S]*?)\];/;
code = code.replace(clubNavRegex, `const clubNav = [
        { id: 'club_dashboard', icon: Home, label: language === 'th' ? 'แดชบอร์ดชมรม' : 'Dashboard' },
        { id: 'manage_activities', icon: Calendar, label: language === 'th' ? 'จัดการกิจกรรม' : 'Manage Activities' },
        { id: 'manage_members', icon: Users, label: language === 'th' ? 'รายชื่อสมาชิก' : 'Members' },
    ];`);

const bottomNavRegex = /<nav className="flex justify-around items-center p-2">\n                \{navItems\.map\(item => \{([\s\S]*?)<span className="text-\[10px\] font-medium">\{item\.label\}<\/span>/;
code = code.replace(bottomNavRegex, `<nav className="flex justify-around items-center p-2">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id && !selectedItem;
                    return (
                        <button key={item.id} onClick={() => { setCurrentTab(item.id); setSelectedItem(null); }} className={\`flex flex-col items-center p-2 rounded-xl w-16 transition-colors \${isActive ? 'text-indigo-600' : 'text-gray-400'}\`}>
                            <Icon size={24} className={isActive ? 'mb-1' : 'mb-1 opacity-70'} />
                            <span className="text-[10px] font-medium">{item.label}</span>`);

const bottomNavPropsRegex = /<nav className="flex justify-around items-center p-2">/g; // oops, I don't need to change bottom Nav Props because I just need to pass language into Sidebar and to bottom nav?
// wait, bottom nav in mobile is rendered in App.tsx!

fs.writeFileSync('src/App.tsx', code);
console.log("Patched Sidebar language partially");
