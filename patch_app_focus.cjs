const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [focusTimer, setFocusTimer] = useState<{
    endeavor: Endeavor | null;
    isActive: boolean;
    isPaused: boolean;
    totalSeconds: number;
    secondsRemaining: number;
  }>({
    endeavor: null,
    isActive: false,
    isPaused: false,
    totalSeconds: 25 * 60,
    secondsRemaining: 25 * 60,
  });`;

const replacementState = `  const [focusTimer, setFocusTimer] = useState<{
    endeavor: Endeavor | null;
    isActive: boolean;
    isPaused: boolean;
    totalSeconds: number;
    secondsRemaining: number;
    mode: "pomodoro" | "deep" | "shortBreak";
    soundMode: "none" | "binaural" | "noise" | "rain";
    volume: number;
    sessionNotes: string;
  }>({
    endeavor: null,
    isActive: false,
    isPaused: false,
    totalSeconds: 25 * 60,
    secondsRemaining: 25 * 60,
    mode: "pomodoro",
    soundMode: "none",
    volume: 0.2,
    sessionNotes: "",
  });`;

if (content.includes(targetState)) {
    content = content.replace(targetState, replacementState);
    console.log("Patched App.tsx state");
} else {
    console.log("Could not find state in App.tsx");
}

const targetFocusModeRender = `                <FocusMode
                  endeavors={endeavors}
                  initialEndeavor={focusTargetEndeavor}
                  onFinishSession={handleFinishFocusSession}
                />`;

const replacementFocusModeRender = `                <FocusMode
                  endeavors={endeavors}
                  focusTimer={focusTimer}
                  setFocusTimer={setFocusTimer}
                  onFinishSession={handleFinishFocusSession}
                />`;

if (content.includes(targetFocusModeRender)) {
    content = content.replace(targetFocusModeRender, replacementFocusModeRender);
    console.log("Patched App.tsx FocusMode render");
} else {
    console.log("Could not find FocusMode render in App.tsx");
}

fs.writeFileSync('src/App.tsx', content);
