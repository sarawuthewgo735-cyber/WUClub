const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const DetailView = \(\{ item, onBack, onRegister, isAlreadyRegistered, onUpdateItem, onLike, isAlreadyLiked \}\) => \{[\s\S]*?const isClub = item\.type === 'club';[\s\S]*?const Icon = item\.icon \|\| Activity;[\s\S]*?const isFull = !isClub && \(item\.currentParticipants >= item\.maxParticipants\);/;

const replacement = `const DetailView = ({ item, onBack, onRegister, isAlreadyRegistered, onUpdateItem, onLike, isAlreadyLiked }) => {
    const isClub = item.type === 'club';
    const isPersonal = item.type === 'personal';
    const Icon = item.icon || Activity;
    const isFull = !isClub && !isPersonal && (item.currentParticipants >= item.maxParticipants);`;

if(code.match(regex)) {
    code = code.replace(regex, replacement);
    
    // Also patch the button and comments area for personal events
    const regex2 = /\{isClub \? 'สมัครสมาชิกชมรม' : \(isAlreadyRegistered \? 'ลงทะเบียนแล้ว' : \(isFull \? 'เต็มแล้ว' : 'ลงทะเบียนเข้าร่วมกิจกรรม'\)\)\}/;
    const replacement2 = `{isClub ? 'สมัครสมาชิกชมรม' : (isPersonal ? 'กิจกรรมส่วนตัว' : (isAlreadyRegistered ? 'ลงทะเบียนแล้ว' : (isFull ? 'เต็มแล้ว' : 'ลงทะเบียนเข้าร่วมกิจกรรม')))}`;
    code = code.replace(regex2, replacement2);
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched DetailView successfully");
} else {
    console.log("Regex not found for DetailView");
}
