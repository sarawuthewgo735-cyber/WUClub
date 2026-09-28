const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    /<DetailView \s*item=\{selectedItem\} \s*onBack=\{\(\) => setSelectedItem\(null\)\} \s*onRegister=\{handleRegisterItem\}\s*isAlreadyRegistered=\{selectedItem\.type === 'activity' \? joinedActivities\.includes\(selectedItem\.id\) : joinedClubs\.includes\(selectedItem\.id\)\}\s*onUpdateItem=\{handleUpdateItem\}\s*onLike=\{handleLikeItem\}\s*isAlreadyLiked=\{selectedItem\.type === 'activity' \? likedActivities\.includes\(selectedItem\.id\) : likedClubs\.includes\(selectedItem\.id\)\}\s*\/>/m,
    `<DetailView 
                        item={selectedItem} 
                        onBack={() => setSelectedItem(null)} 
                        onRegister={handleRegisterItem}
                        isAlreadyRegistered={selectedItem.type === 'activity' ? joinedActivities.includes(selectedItem.id) : joinedClubs.includes(selectedItem.id)}
                        onUpdateItem={handleUpdateItem}
                        onLike={handleLikeItem}
                        isAlreadyLiked={selectedItem.type === 'activity' ? likedActivities.includes(selectedItem.id) : likedClubs.includes(selectedItem.id)}
                        language={language}
                    />`
);

fs.writeFileSync('src/App.tsx', code);
