const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetEffect = `  // Persistent Focus Timer Countdown Engine
  useEffect(() => {
    let interval: any = null;
    if (focusTimer.isActive && !focusTimer.isPaused && focusTimer.secondsRemaining > 0) {
      interval = setInterval(() => {
        setFocusTimer((prev) => {
          if (prev.secondsRemaining <= 1) {
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
            if (prev.endeavor) {
              handleQuickLog(prev.endeavor, 1, "Completed deep focus sprint!");
            }
            awardXP(125, "Deep focus sprint achieved!");
            showToast("Deep focus session completed! +125 XP");
            return {
              ...prev,
              isActive: false,
              isPaused: false,
              secondsRemaining: prev.totalSeconds,
            };
          }
          return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isActive, focusTimer.isPaused, focusTimer.secondsRemaining]);`;

const replacementEffect = `  // Persistent Focus Timer Countdown Engine
  useEffect(() => {
    let interval: any = null;
    if (focusTimer.isActive && !focusTimer.isPaused && focusTimer.secondsRemaining > 0) {
      interval = setInterval(() => {
        setFocusTimer((prev) => ({ ...prev, secondsRemaining: prev.secondsRemaining - 1 }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isActive, focusTimer.isPaused, focusTimer.secondsRemaining]);

  // Handle Focus Timer Completion
  useEffect(() => {
    if (focusTimer.isActive && focusTimer.secondsRemaining === 0) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      if (focusTimer.endeavor) {
        const durationMinutes = Math.floor(focusTimer.totalSeconds / 60);
        handleFinishFocusSession(focusTimer.endeavor.id, durationMinutes, focusTimer.sessionNotes || "Completed deep focus sprint!");
      }
      setFocusTimer(prev => ({
        ...prev,
        isActive: false,
        isPaused: false,
        secondsRemaining: prev.totalSeconds
      }));
    }
  }, [focusTimer.secondsRemaining, focusTimer.isActive]);`;

content = content.replace(targetEffect, replacementEffect);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx timer logic!");
