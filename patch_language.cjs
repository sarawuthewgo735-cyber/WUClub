const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add language state to App
const appRegex = /export default function App\(\) \{\n    const \[isLoggedIn, setIsLoggedIn\] = useState\(false\);/;
code = code.replace(appRegex, `export default function App() {\n    const [isLoggedIn, setIsLoggedIn] = useState(false);\n    const [language, setLanguage] = useState('th');`);

// Add Languages icon import if missing
if (!code.includes('Languages')) {
    code = code.replace('import { Search, Home, User, Heart, Calendar, ArrowLeft, ArrowRight, MessageCircle, Info, ThumbsUp, MessageSquare, Send, CheckCircle2, MapPin, Users, Phone, Mail, Clock, Plus, Trash2, Edit2, Check, X, Camera, FileText, Share2, Bell, ChevronRight, ChevronLeft, MoreHorizontal, Settings, LogOut, Shield, Award, CalendarDays, BookOpen, Star, HelpCircle } from "lucide-react";', 
    'import { Search, Home, User, Heart, Calendar, ArrowLeft, ArrowRight, MessageCircle, Info, ThumbsUp, MessageSquare, Send, CheckCircle2, MapPin, Users, Phone, Mail, Clock, Plus, Trash2, Edit2, Check, X, Camera, FileText, Share2, Bell, ChevronRight, ChevronLeft, MoreHorizontal, Settings, LogOut, Shield, Award, CalendarDays, BookOpen, Star, HelpCircle, Languages } from "lucide-react";');
}

// Update HomeTab props
const hometabRegex = /const HomeTab = \(\{ onViewDetail, preferences, onViewAll, activities, clubs, personalEvents = \[\], setPersonalEvents \}\) => \{/;
code = code.replace(hometabRegex, `const HomeTab = ({ onViewDetail, preferences, onViewAll, activities, clubs, personalEvents = [], setPersonalEvents, language, setLanguage }) => {`);

// Add the button to HomeTab
const searchRegex = /<div className="relative w-full md:w-auto flex-1 md:flex-none">\n                        <Search size=\{20\} className="absolute left-4 top-1\/2 transform -translate-y-1\/2 text-gray-400" \/>\n                        <input type="text" placeholder="ค้นหาชมรม, กิจกรรม..."/;
code = code.replace(searchRegex, `<button onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} className="flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-medium rounded-full transition-colors text-xs md:text-sm flex-shrink-0 cursor-pointer">
                            <Languages size={18} />
                            <span>{language === 'th' ? 'th Thai' : 'us English'}</span>
                        </button>\n                        <div className="relative w-full md:w-auto flex-1 md:flex-none">\n                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />\n                        <input type="text" placeholder={language === 'th' ? "ค้นหาชมรม, กิจกรรม..." : "Search clubs, events..."}`);

// Pass language down from App to HomeTab
const homeTabCallRegex = /<HomeTab onViewDetail=\{setSelectedItem\} preferences=\{userPrefs\} onViewAll=\{setCurrentTab\} activities=\{globalActivities\} clubs=\{globalClubs\} personalEvents=\{globalPersonalEvents\} setPersonalEvents=\{setGlobalPersonalEvents\} \/>/;
code = code.replace(homeTabCallRegex, `<HomeTab onViewDetail={setSelectedItem} preferences={userPrefs} onViewAll={setCurrentTab} activities={globalActivities} clubs={globalClubs} personalEvents={globalPersonalEvents} setPersonalEvents={setGlobalPersonalEvents} language={language} setLanguage={setLanguage} />`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched language toggle");
