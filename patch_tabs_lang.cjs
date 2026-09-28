const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update tab declarations
code = code.replace(/const ActivitiesTab = \(\{ onViewDetail, activities \}\) => \{/, 'const ActivitiesTab = ({ onViewDetail, activities, language }) => {');
code = code.replace(/const ClubsTab = \(\{ onViewDetail, clubs \}\) => \{/, 'const ClubsTab = ({ onViewDetail, clubs, language }) => {');
code = code.replace(/const GoodnessTab = \(\) => \{/, 'const GoodnessTab = ({ language }) => {');

// Update tab usage in App.tsx
code = code.replace(/<ActivitiesTab onViewDetail=\{setSelectedItem\} activities=\{globalActivities\} \/>/, '<ActivitiesTab onViewDetail={setSelectedItem} activities={globalActivities} language={language} />');
code = code.replace(/<ClubsTab onViewDetail=\{setSelectedItem\} clubs=\{globalClubs\} \/>/, '<ClubsTab onViewDetail={setSelectedItem} clubs={globalClubs} language={language} />');
code = code.replace(/<GoodnessTab \/>/, '<GoodnessTab language={language} />');

fs.writeFileSync('src/App.tsx', code);
console.log("Patched tab language props");
