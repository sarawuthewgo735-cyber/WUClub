const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const modalReplacements = [
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">ชื่อกิจกรรม<\/label>/,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'ชื่อกิจกรรม' : 'Activity Name'}</label>`
    },
    {
        from: /placeholder="เช่น เวิร์คช็อปทำเค้ก"/,
        to: `placeholder={language === 'th' ? "เช่น เวิร์คช็อปทำเค้ก" : "e.g., Cake Workshop"}`
    },
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">วันที่จัดงาน<\/label>/,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'วันที่จัดงาน' : 'Date'}</label>`
    },
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">เวลา<\/label>/g,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'เวลา' : 'Time'}</label>`
    },
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">สถานที่<\/label>/,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'สถานที่' : 'Location'}</label>`
    },
    {
        from: /placeholder="ถ้าไม่ระบุจะขึ้นว่า มหาวิทยาลัยวลัยลักษณ์"/,
        to: `placeholder={language === 'th' ? "ถ้าไม่ระบุจะขึ้นว่า มหาวิทยาลัยวลัยลักษณ์" : "Default: Walailak University"}`
    },
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">จำนวนผู้เข้าร่วม \(คน\)<\/label>/,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนผู้เข้าร่วม (คน)' : 'Max Participants'}</label>`
    },
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">หมวดหมู่คะแนนความดี<\/label>/,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'หมวดหมู่คะแนนความดี' : 'Goodness Category'}</label>`
    },
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">จำนวนคะแนน<\/label>/,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนคะแนน' : 'Points'}</label>`
    },
    {
        from: /<label className="text-sm font-semibold text-gray-700 mb-1 block">รายละเอียด<\/label>/,
        to: `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'รายละเอียด' : 'Details'}</label>`
    },
    {
        from: /placeholder="อธิบายเกี่ยวกับกิจกรรม\.\.\."/,
        to: `placeholder={language === 'th' ? "อธิบายเกี่ยวกับกิจกรรม..." : "Describe the activity..."}`
    },
    {
        from: /<option value="">-- ไม่ระบุ --<\/option>/,
        to: `<option value="">{language === 'th' ? '-- ไม่ระบุ --' : '-- None --'}</option>`
    },
    {
        from: /<option value="-">-- ไม่ระบุ --<\/option>/,
        to: `<option value="-">{language === 'th' ? '-- ไม่ระบุ --' : '-- None --'}</option>`
    }
];

modalReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

// also for edit activity modal
code = code.replace(/<label className="text-sm font-semibold text-gray-700 mb-1 block">ชื่อกิจกรรม<\/label>/g, `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'ชื่อกิจกรรม' : 'Activity Name'}</label>`);
code = code.replace(/<label className="text-sm font-semibold text-gray-700 mb-1 block">วันที่และเวลาจัดงาน<\/label>/, `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'วันที่และเวลาจัดงาน' : 'Date & Time'}</label>`);
code = code.replace(/<label className="text-sm font-semibold text-gray-700 mb-1 block">สถานที่<\/label>/g, `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'สถานที่' : 'Location'}</label>`);
code = code.replace(/<label className="text-sm font-semibold text-gray-700 mb-1 block">จำนวนผู้เข้าร่วม \(คน\)<\/label>/g, `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนผู้เข้าร่วม (คน)' : 'Max Participants'}</label>`);
code = code.replace(/<label className="text-sm font-semibold text-gray-700 mb-1 block">หมวดหมู่คะแนนความดี<\/label>/g, `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'หมวดหมู่คะแนนความดี' : 'Goodness Category'}</label>`);
code = code.replace(/<label className="text-sm font-semibold text-gray-700 mb-1 block">จำนวนคะแนน<\/label>/g, `<label className="text-sm font-semibold text-gray-700 mb-1 block">{language === 'th' ? 'จำนวนคะแนน' : 'Points'}</label>`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched club dashboard modals");
