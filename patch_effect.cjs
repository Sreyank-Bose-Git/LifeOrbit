const fs = require('fs');
let content = fs.readFileSync('src/components/FocusMode.tsx', 'utf8');

const effectRegex = /\/\/ Timer Tick[\s\S]*?\]\);/
const replacementEffect = `// Timer Tick is handled by App.tsx
  useEffect(() => {
    if (timeLeftSeconds === 0 && soundMode !== "none") {
      focusAudio.stop();
      setSoundMode("none");
    }
  }, [timeLeftSeconds, soundMode]);`;

content = content.replace(effectRegex, replacementEffect);
fs.writeFileSync('src/components/FocusMode.tsx', content);
console.log("Patched!");
