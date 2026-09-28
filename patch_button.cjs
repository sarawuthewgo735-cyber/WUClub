const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldButtonRegex = /<button onClick=\{\(\) => setLanguage\(language === 'th' \? 'en' : 'th'\)\} className="flex items-center justify-center gap-1\.5 px-3 md:px-4 py-2 md:py-2\.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-medium rounded-full transition-colors text-xs md:text-sm flex-shrink-0 cursor-pointer">\n                            <Languages size=\{18\} \/>\n                            <span>\{language === 'th' \? 'th Thai' : 'us English'\}<\/span>\n                        <\/button>/;

const newButton = `<button onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold rounded-full transition-colors text-sm flex-shrink-0 cursor-pointer border border-gray-200 shadow-sm">
                            <Languages size={18} />
                            <span>{language === 'th' ? 'th Thai' : 'us English'}</span>
                        </button>`;

code = code.replace(oldButtonRegex, newButton);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched button style");
