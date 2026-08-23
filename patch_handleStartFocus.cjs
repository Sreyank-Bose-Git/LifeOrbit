const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleStartFocus = (endeavor: Endeavor) => {
    setFocusTargetEndeavor(endeavor);
    setFocusTimer({
      endeavor,
      isActive: true,
      isPaused: false,
      totalSeconds: 25 * 60,
      secondsRemaining: 25 * 60,
    });
    setActiveTab("focus");
    showToast(\`Focus sprint armed for \${endeavor.title}\`);
  };`;

const replacement = `  const handleStartFocus = (endeavor: Endeavor) => {
    setFocusTargetEndeavor(endeavor);
    setFocusTimer((prev) => ({
      ...prev,
      endeavor,
      isActive: true,
      isPaused: false,
      totalSeconds: 25 * 60,
      secondsRemaining: 25 * 60,
      mode: "pomodoro",
    }));
    setActiveTab("focus");
    showToast(\`Focus sprint armed for \${endeavor.title}\`);
  };`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    console.log("Patched handleStartFocus!");
} else {
    console.log("Could not find handleStartFocus in App.tsx");
}
fs.writeFileSync('src/App.tsx', content);
