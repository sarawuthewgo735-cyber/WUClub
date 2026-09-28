const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// DetailView signature
code = code.replace(/const DetailView = \(\{ item, onBack, onRegister, isAlreadyRegistered, onUpdateItem, onLike, isAlreadyLiked \}\) => \{/,
    'const DetailView = ({ item, onBack, onRegister, isAlreadyRegistered, onUpdateItem, onLike, isAlreadyLiked, language }) => {');

// Fix DetailView translations
const detailsContentReplacements = [
    {
        from: /<h3 className="text-xl font-bold text-gray-800 mb-4">รายละเอียด<\/h3>/,
        to: `<h3 className="text-xl font-bold text-gray-800 mb-4">{language === 'th' ? 'รายละเอียด' : 'Details'}</h3>`
    },
    {
        from: /\{item\.desc \|\| 'พบกับกิจกรรมที่น่าสนใจมากมายที่จะทำให้คุณได้พัฒนาทักษะและรู้จักเพื่อนใหม่ มาร่วมเป็นส่วนหนึ่งของประสบการณ์ที่ดีในรั้วมหาวิทยาลัยวลัยลักษณ์ด้วยกันนะคะ'\}/,
        to: `{item.desc || (language === 'th' ? 'พบกับกิจกรรมที่น่าสนใจมากมายที่จะทำให้คุณได้พัฒนาทักษะและรู้จักเพื่อนใหม่ มาร่วมเป็นส่วนหนึ่งของประสบการณ์ที่ดีในรั้วมหาวิทยาลัยวลัยลักษณ์ด้วยกันนะคะ' : 'Discover exciting activities to develop your skills and meet new friends. Join us and be part of a great experience at Walailak University.')}`
    },
    {
        from: /<h3 className="text-lg font-bold text-gray-800 mb-4">รูปภาพบรรยากาศ<\/h3>/,
        to: `<h3 className="text-lg font-bold text-gray-800 mb-4">{language === 'th' ? 'รูปภาพบรรยากาศ' : 'Gallery'}</h3>`
    },
    {
        from: /<h3 className="text-lg font-bold text-gray-800 mb-6">ความคิดเห็นและการมีส่วนร่วม<\/h3>/,
        to: `<h3 className="text-lg font-bold text-gray-800 mb-6">{language === 'th' ? 'ความคิดเห็นและการมีส่วนร่วม' : 'Comments & Engagement'}</h3>`
    },
    {
        from: /\{Number\(item\.likes\) \|\| 0\} ถูกใจ/,
        to: `{Number(item.likes) || 0} {language === 'th' ? 'ถูกใจ' : 'Likes'}`
    },
    {
        from: /<p className="text-gray-400 italic text-sm">ยังไม่มีความคิดเห็น เป็นคนแรกที่คอมเมนต์สิ!<\/p>/,
        to: `<p className="text-gray-400 italic text-sm">{language === 'th' ? 'ยังไม่มีความคิดเห็น เป็นคนแรกที่คอมเมนต์สิ!' : 'No comments yet. Be the first to comment!'}</p>`
    },
    {
        from: /placeholder="เขียนความคิดเห็นของคุณ..."/,
        to: `placeholder={language === 'th' ? "เขียนความคิดเห็นของคุณ..." : "Write your comment..."}`
    },
    {
        from: /<h4 className="font-bold text-gray-800 mb-4">ข้อมูลสำคัญ<\/h4>/,
        to: `<h4 className="font-bold text-gray-800 mb-4">{language === 'th' ? 'ข้อมูลสำคัญ' : 'Key Information'}</h4>`
    },
    {
        from: /<p className="text-xs text-gray-400">จำนวนสมาชิก<\/p>/,
        to: `<p className="text-xs text-gray-400">{language === 'th' ? 'จำนวนสมาชิก' : 'Members'}</p>`
    },
    {
        from: /\{item\.members\} คน/,
        to: `{item.members} {language === 'th' ? 'คน' : 'people'}`
    },
    {
        from: /<p className="text-xs text-gray-400">วันที่จัดกิจกรรม<\/p>/,
        to: `<p className="text-xs text-gray-400">{language === 'th' ? 'วันที่จัดกิจกรรม' : 'Date'}</p>`
    },
    {
        from: /<p className="text-xs text-gray-400">สถานที่<\/p>/,
        to: `<p className="text-xs text-gray-400">{language === 'th' ? 'สถานที่' : 'Location'}</p>`
    },
    {
        from: /\{item\.location \|\| 'มหาวิทยาลัยวลัยลักษณ์'\}/,
        to: `{item.location || (language === 'th' ? 'มหาวิทยาลัยวลัยลักษณ์' : 'Walailak University')}`
    },
    {
        from: /<p className="text-xs text-gray-400">เวลา<\/p>/,
        to: `<p className="text-xs text-gray-400">{language === 'th' ? 'เวลา' : 'Time'}</p>`
    },
    {
        from: /<p className="text-xs text-gray-400">ผู้เข้าร่วม<\/p>/,
        to: `<p className="text-xs text-gray-400">{language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'}</p>`
    },
    {
        from: /\{item\.currentParticipants\} \/ \{item\.maxParticipants\} คน/,
        to: `{item.currentParticipants} / {item.maxParticipants} {language === 'th' ? 'คน' : 'people'}`
    },
    {
        from: /คะแนนความดี/,
        to: `{language === 'th' ? 'คะแนนความดี' : 'Goodness Points'}`
    },
    {
        from: /\{isPersonal \? 'กิจกรรมส่วนตัว \(ปฏิทิน\)' : \(isAlreadyRegistered \? \(isClub \? 'สมัครแล้ว' : 'ลงทะเบียนสำเร็จแล้ว'\) : isFull \? 'ผู้เข้าร่วมเต็มแล้ว' : \(isClub \? 'สมัครเข้าร่วมชมรม' : 'ลงทะเบียนเข้าร่วมกิจกรรม'\)\)\}/,
        to: `{isPersonal ? (language === 'th' ? 'กิจกรรมส่วนตัว (ปฏิทิน)' : 'Personal Activity') : (isAlreadyRegistered ? (isClub ? (language === 'th' ? 'สมัครแล้ว' : 'Joined') : (language === 'th' ? 'ลงทะเบียนสำเร็จแล้ว' : 'Registered')) : isFull ? (language === 'th' ? 'ผู้เข้าร่วมเต็มแล้ว' : 'Full') : (isClub ? (language === 'th' ? 'สมัครเข้าร่วมชมรม' : 'Join Club') : (language === 'th' ? 'ลงทะเบียนเข้าร่วมกิจกรรม' : 'Register')))}`
    },
    {
        from: /<h4 className="font-bold text-gray-800 mb-4">ช่องทางติดต่อ<\/h4>/,
        to: `<h4 className="font-bold text-gray-800 mb-4">{language === 'th' ? 'ช่องทางติดต่อ' : 'Contact Options'}</h4>`
    }
];

detailsContentReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

// Update DetailView call
code = code.replace(/<DetailView \n                        item=\{selectedItem\}\n                        onBack=\{\(\) => setSelectedItem\(null\)\}\n                        onRegister=\{handleRegister\}\n                        isAlreadyRegistered=\{isRegistered\}\n                        onUpdateItem=\{handleUpdateItem\}\n                        onLike=\{handleLike\}\n                        isAlreadyLiked=\{isLiked\}\n                    \/>/, 
    `<DetailView 
                        item={selectedItem}
                        onBack={() => setSelectedItem(null)}
                        onRegister={handleRegister}
                        isAlreadyRegistered={isRegistered}
                        onUpdateItem={handleUpdateItem}
                        onLike={handleLike}
                        isAlreadyLiked={isLiked}
                        language={language}
                    />`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched DetailView");
