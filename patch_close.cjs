const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetSearch = /onClose=\{\(\) =>\s+setFocusTimer\(\(prev\) => \(\{\s+\.\.\.prev,\s+isActive: false,\s+isPaused: false,\s+\}\)\)\s+\}/;

const replacement = `onClose={() => {
            setFocusTimer((prev) => ({
              ...prev,
              isActive: false,
              isPaused: false,
              soundMode: "none"
            }));
            focusAudio.stop();
          }}`;

content = content.replace(targetSearch, replacement);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx onClose");
