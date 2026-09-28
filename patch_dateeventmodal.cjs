const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const DateEventModal = \(\{ date, events, onClose, onViewDetail \}\) => \{/, 'const DateEventModal = ({ date, events, onClose, onViewDetail, language }) => {');
code = code.replace(/<DateEventModal date=\{selectedDate\} events=\{dateEvents\} onClose=\{\(\) => setSelectedDate\(null\)\} onViewDetail=\{onViewDetail\} \/>/, '<DateEventModal date={selectedDate} events={dateEvents} onClose={() => setSelectedDate(null)} onViewDetail={onViewDetail} language={language} />');
code = code.replace(/<div><h2 className="text-xl font-bold text-gray-800">กิจกรรมวันที่<\/h2><p className="text-teal-600 font-semibold">\{date\}<\/p><\/div>/, 
    `<div><h2 className="text-xl font-bold text-gray-800">{language === 'th' ? 'กิจกรรมวันที่' : 'Events on '}</h2><p className="text-teal-600 font-semibold">{date}</p></div>`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched DateEventModal");
