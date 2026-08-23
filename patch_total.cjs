const fs = require('fs');
let content = fs.readFileSync('src/components/FocusMode.tsx', 'utf8');

const target = `  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const totalSeconds = durationMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeftSeconds) / totalSeconds : 0;`;

const replacement = `  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - Math.max(0, timeLeftSeconds)) / totalSeconds : 0;`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/FocusMode.tsx', content);
console.log("Patched!");
