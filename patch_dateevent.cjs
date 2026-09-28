const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /onClick=\{\(\) => \{ onClose\(\); onViewDetail\(\{\.\.\.act, type: 'activity'\}\); \}\}/;
const replacement = `onClick={() => { onClose(); onViewDetail({...act, type: act.type || 'activity'}); }}`;

if(code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched DateEventModal successfully");
} else {
    console.log("Regex not found for DateEventModal");
}
