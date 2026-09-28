const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3"><Users size=\{20\} \/><\/div><div><p className="text-xs text-gray-400">ผู้เข้าร่วม<\/p><p className=\{\`font-semibold \$\{isFull \? 'text-red-500' : ''\}\`\}>\{item\.currentParticipants\} \/ \{item\.maxParticipants\} คน<\/p><\/div><\/div>/;

const replacement = `{isPersonal ? (
                                        <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3"><Clock size={20} /></div><div><p className="text-xs text-gray-400">เวลา</p><p className="font-semibold">{item.time || '-'}</p></div></div>
                                    ) : (
                                        <div className="flex items-center text-gray-600"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3"><Users size={20} /></div><div><p className="text-xs text-gray-400">ผู้เข้าร่วม</p><p className={\`font-semibold \${isFull ? 'text-red-500' : ''}\`}>{item.currentParticipants} / {item.maxParticipants} คน</p></div></div>
                                    )}`;

if(code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched DetailView participants successfully");
} else {
    console.log("Regex not found for DetailView participants");
}
