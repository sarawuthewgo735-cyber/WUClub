const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    /const ClubDashboardTab = \(\{ activities, setActivities, clubName, members \}\) => \{/,
    'const ClubDashboardTab = ({ activities, setActivities, clubName, members, language }) => {'
);
code = code.replace(
    /<ClubDashboardTab activities=\{globalActivities\} setActivities=\{setGlobalActivities\} clubName=\{loginClubName\} members=\{globalMembers\} \/>/,
    '<ClubDashboardTab activities={globalActivities} setActivities={setGlobalActivities} clubName={loginClubName} members={globalMembers} language={language} />'
);

fs.writeFileSync('src/App.tsx', code);
