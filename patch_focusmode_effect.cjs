const fs = require('fs');
let content = fs.readFileSync('src/components/FocusMode.tsx', 'utf8');

const targetEffect = `  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isActive) {
      setIsActive(false);
      focusAudio.stop();
      setSoundMode("none");
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      if (selectedEndeavorId) {
        onFinishSession(selectedEndeavorId, durationMinutes, sessionNotes);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeftSeconds, selectedEndeavorId, durationMinutes, sessionNotes, onFinishSession]);`;

const replacementEffect = `  // Timer Tick is handled by App.tsx
  useEffect(() => {
    if (timeLeftSeconds === 0 && soundMode !== "none") {
      focusAudio.stop();
      setSoundMode("none");
    }
  }, [timeLeftSeconds, soundMode]);`;

if (content.includes(targetEffect)) {
    content = content.replace(targetEffect, replacementEffect);
    console.log("Patched FocusMode Effect!");
} else {
    console.log("Could not find FocusMode Effect again!");
}

fs.writeFileSync('src/components/FocusMode.tsx', content);
