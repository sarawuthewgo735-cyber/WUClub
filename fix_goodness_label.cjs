const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
    /label: language === 'th' \? '\{language === 'th' \? 'คะแนนความดี' : 'Goodness Points'\}' : 'Goodness'/,
    "label: language === 'th' ? 'คะแนนความดี' : 'Goodness'"
);
fs.writeFileSync('src/App.tsx', code);
