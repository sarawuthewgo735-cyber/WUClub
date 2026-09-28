const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update LoginScreen signature
code = code.replace(/const LoginScreen = \(\{ onLogin \}\) => \{/, 'const LoginScreen = ({ onLogin, language, setLanguage }) => {');

// 2. Add language toggle button and update texts
const loginContentRegex = /<div className="w-full md:w-1\/2 p-8 md:p-12 flex flex-col justify-center relative">([\s\S]*?)<h2 className="text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">เข้าสู่ระบบ<\/h2>\s*<p className="text-gray-500 mb-8 text-sm text-center md:text-left">กรุณากรอกข้อมูลเพื่อดำเนินการต่อ<\/p>/;
const newLoginContent = `<div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-6 right-6">
                        <button onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold rounded-full transition-colors text-sm cursor-pointer border border-gray-200 shadow-sm">
                            <Languages size={18} />
                            <span>{language === 'th' ? 'th Thai' : 'us English'}</span>
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 mt-8 md:mt-0 text-center md:text-left">{language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}</h2>
                    <p className="text-gray-500 mb-8 text-sm text-center md:text-left">{language === 'th' ? 'กรุณากรอกข้อมูลเพื่อดำเนินการต่อ' : 'Please enter your details to proceed'}</p>`;
code = code.replace(loginContentRegex, newLoginContent);

// 3. Update error message
code = code.replace(/setError\('ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง'\);/, `setError(language === 'th' ? 'ชื่อบัญชีหรือรหัสผ่านไม่ถูกต้อง' : 'Invalid username or password');`);

// 4. Update role buttons
code = code.replace(/>นักศึกษา<\/button>/, `>{language === 'th' ? 'นักศึกษา' : 'Student'}</button>`);
code = code.replace(/>ชมรม<\/button>/, `>{language === 'th' ? 'ชมรม' : 'Club'}</button>`);

// 5. Update input labels
code = code.replace(/<label className="text-sm font-semibold text-gray-600 mb-2 block">ชื่อผู้ใช้งาน \(Student ID\)<\/label>/, `<label className="text-sm font-semibold text-gray-600 mb-2 block">{language === 'th' ? 'ชื่อผู้ใช้งาน (Student ID)' : 'Username (Student ID)'}</label>`);
code = code.replace(/<label className="text-sm font-semibold text-gray-600 mb-2 block">ชื่อบัญชีชมรม \(Club ID\)<\/label>/, `<label className="text-sm font-semibold text-gray-600 mb-2 block">{language === 'th' ? 'ชื่อบัญชีชมรม (Club ID)' : 'Username (Club ID)'}</label>`);
code = code.replace(/<label className="text-sm font-semibold text-gray-600 mb-2 block">รหัสผ่าน<\/label>/, `<label className="text-sm font-semibold text-gray-600 mb-2 block">{language === 'th' ? 'รหัสผ่าน' : 'Password'}</label>`);

// 6. Update login button
code = code.replace(/>เข้าสู่ระบบ <ArrowRight size=\{18\} \/><\/button>/, `>{language === 'th' ? 'เข้าสู่ระบบ' : 'Login'} <ArrowRight size={18} /></button>`);

// 7. Update Left Panel texts
code = code.replace(/<h1 className="text-4xl md:text-5xl font-bold mb-4">ยินดีต้อนรับสู่<br\/>WU Club<\/h1>/, `<h1 className="text-4xl md:text-5xl font-bold mb-4">{language === 'th' ? 'ยินดีต้อนรับสู่' : 'Welcome to'}<br/>WU Club</h1>`);
code = code.replace(/<p className="text-base md:text-lg opacity-90">ระบบศูนย์รวมชมรมและกิจกรรม<br\/>มหาวิทยาลัยวลัยลักษณ์<\/p>/, `<p className="text-base md:text-lg opacity-90">{language === 'th' ? 'ระบบศูนย์รวมชมรมและกิจกรรม' : 'Club and Activity Center'}<br/>{language === 'th' ? 'มหาวิทยาลัยวลัยลักษณ์' : 'Walailak University'}</p>`);

// 8. Update LoginScreen call in App component
code = code.replace(/return <LoginScreen onLogin=\{handleLogin\} \/>;/, `return <LoginScreen onLogin={handleLogin} language={language} setLanguage={setLanguage} />;`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched LoginScreen");
