const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const \[userPrefs, setUserPrefs\] = useState\(\[\]\);/;
const replacement = `const [userPrefs, setUserPrefs] = useState([]);
    const [globalPersonalEvents, setGlobalPersonalEvents] = useState([]);`;

if(code.match(regex)) {
    code = code.replace(regex, replacement);
    
    // update HomeTab usage
    const homeTabRegex = /<HomeTab onViewDetail=\{setSelectedItem\} preferences=\{userPrefs\} onViewAll=\{setCurrentTab\} activities=\{globalActivities\} clubs=\{globalClubs\} \/>/g;
    const homeTabReplacement = `<HomeTab onViewDetail={setSelectedItem} preferences={userPrefs} onViewAll={setCurrentTab} activities={globalActivities} clubs={globalClubs} personalEvents={globalPersonalEvents} setPersonalEvents={setGlobalPersonalEvents} />`;
    code = code.replace(homeTabRegex, homeTabReplacement);
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched App state successfully");
} else {
    console.log("Regex not found for App state");
}
