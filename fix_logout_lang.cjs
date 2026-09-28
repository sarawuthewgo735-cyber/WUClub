const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
    /<LogOut size=\{20\} \/> ออกจากระบบ/,
    "<LogOut size={20} /> {language === 'th' ? 'ออกจากระบบ' : 'Logout'}"
);
fs.writeFileSync('src/App.tsx', code);
