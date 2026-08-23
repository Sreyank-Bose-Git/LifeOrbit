const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = `import { Endeavor, UserProfileAccount, ProgressLog, TimeBlock, StatMetrics } from "./types";`;
const replacementImport = `import { Endeavor, UserProfileAccount, ProgressLog, TimeBlock, StatMetrics } from "./types";
import { focusAudio } from "./lib/audio";`;

content = content.replace(targetImport, replacementImport);

const targetHandleFinish = `  // Finish focus session
  const handleFinishFocusSession = (endeavorId: string, durationMinutes: number, notes: string) => {`;
const replacementHandleFinish = `  // Finish focus session
  const handleFinishFocusSession = (endeavorId: string, durationMinutes: number, notes: string) => {
    focusAudio.stop();`;

content = content.replace(targetHandleFinish, replacementHandleFinish);

const targetMiniComplete = `          onComplete={() => {
            confetti({ particleCount: 80, spread: 70 });
            if (focusTimer.endeavor) {
              handleQuickLog(focusTimer.endeavor, 1, "Completed sprint via mini-player");
            }
            awardXP(100, "Mini-player focus sprint completed!");
            setFocusTimer((prev) => ({
              ...prev,
              isActive: false,
              isPaused: false,
              secondsRemaining: prev.totalSeconds,
              soundMode: "none"
            }));
            focusAudio.stop();
          }}`;

const targetMiniCompleteSearch = /onComplete=\{\(\) => \{\s+confetti\(\{ particleCount: 80, spread: 70 \}\);\s+if \(focusTimer\.endeavor\) \{\s+handleQuickLog\(focusTimer\.endeavor, 1, "Completed sprint via mini-player"\);\s+\}\s+awardXP\(100, "Mini-player focus sprint completed!"\);\s+setFocusTimer\(\(prev\) => \(\{\s+\.\.\.prev,\s+isActive: false,\s+isPaused: false,\s+secondsRemaining: prev\.totalSeconds,\s+\}\)\);\s+\}\}/;

content = content.replace(targetMiniCompleteSearch, targetMiniComplete);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App audio!");
