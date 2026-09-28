const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /disabled=\{isAlreadyRegistered \|\| isFull\}/;
const replacement = `disabled={isAlreadyRegistered || isFull || isPersonal}`;

code = code.replace(regex, replacement);

const regex2 = /\{isAlreadyRegistered \? \(isClub \? 'สมัครแล้ว' : 'ลงทะเบียนสำเร็จแล้ว'\) : \s*isFull \? 'ผู้เข้าร่วมเต็มแล้ว' : \s*\(isClub \? 'สมัครเข้าร่วมชมรม' : 'ลงทะเบียนเข้าร่วมกิจกรรม'\)\}/;
const replacement2 = `{isPersonal ? 'กิจกรรมส่วนตัว (ปฏิทิน)' : (isAlreadyRegistered ? (isClub ? 'สมัครแล้ว' : 'ลงทะเบียนสำเร็จแล้ว') : isFull ? 'ผู้เข้าร่วมเต็มแล้ว' : (isClub ? 'สมัครเข้าร่วมชมรม' : 'ลงทะเบียนเข้าร่วมกิจกรรม'))}`;

code = code.replace(regex2, replacement2);

const regex3 = /className=\{\`w-full font-bold rounded-xl py-3 mt-6 shadow-md transition-all \s*\$\{isAlreadyRegistered \? 'bg-green-500 text-white cursor-default shadow-none' : \s*isFull \? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : \s*'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'\}\`\}/;
const replacement3 = `className={\`w-full font-bold rounded-xl py-3 mt-6 shadow-md transition-all \${isPersonal ? 'bg-indigo-100 text-indigo-500 cursor-default shadow-none' : isAlreadyRegistered ? 'bg-green-500 text-white cursor-default shadow-none' : isFull ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}\`}`;

code = code.replace(regex3, replacement3);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched DetailView button successfully");
