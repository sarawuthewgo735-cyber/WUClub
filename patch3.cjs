const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<table className="w-full text-left">([\s\S]*?)<\/table>/;
const match = regex.exec(code);

if (match) {
    const replacement = `<table className="w-full text-left min-w-max">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-3 md:py-4 px-2 text-xs md:text-sm">ด้าน</th>
                                        <th className="py-3 md:py-4 px-2 text-center text-xs md:text-sm">เป้าหมาย</th>
                                        <th className="py-3 md:py-4 px-2 text-center text-xs md:text-sm">ปัจจุบัน</th>
                                        <th className="py-3 md:py-4 px-2 md:px-4 text-center text-xs md:text-sm">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_GOODNESS_STATS.map((stat) => (
                                        <tr key={stat.id} className="border-b border-gray-50">
                                            <td className="py-4 md:py-5 px-2 font-bold text-gray-700 text-sm md:text-base whitespace-nowrap">{stat.name}</td>
                                            <td className="py-4 md:py-5 px-2 text-center font-mono text-gray-500 text-sm md:text-base">{stat.target.toFixed(3)}</td>
                                            <td className="py-4 md:py-5 px-2 text-center font-mono font-semibold text-sm md:text-base">{stat.current.toFixed(3)}</td>
                                            <td className="py-4 md:py-5 px-2 md:px-4 text-center">
                                                {stat.current >= stat.target ? (
                                                    <span className="text-green-600 font-bold bg-green-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs whitespace-nowrap">ผ่านเกณฑ์</span>
                                                ) : (
                                                    <span className="text-amber-600 font-bold bg-amber-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs whitespace-nowrap">กำลังเก็บ</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>`;
    fs.writeFileSync('src/App.tsx', code.replace(regex, replacement));
    console.log("Patched successfully");
} else {
    console.log("Could not find match");
}
