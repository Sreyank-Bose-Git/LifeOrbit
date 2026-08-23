const fs = require('fs');
let content = fs.readFileSync('src/components/FocusMode.tsx', 'utf8');

const targetProps = `interface FocusModeProps {
  endeavors: Endeavor[];
  initialEndeavor?: Endeavor | null;
  onFinishSession: (endeavorId: string, durationMinutes: number, notes: string) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  endeavors,
  initialEndeavor,
  onFinishSession,
}) => {
  const [selectedEndeavorId, setSelectedEndeavorId] = useState(
    initialEndeavor?.id || endeavors[0]?.id || ""
  );
  const [mode, setMode] = useState<"pomodoro" | "deep" | "shortBreak">("pomodoro");
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundMode, setSoundMode] = useState<"none" | "binaural" | "noise" | "rain">("none");
  const [volume, setVolume] = useState(0.2);
  const [sessionNotes, setSessionNotes] = useState("");

  const activeEndeavor = endeavors.find((e) => e.id === selectedEndeavorId);

  // Sync initialEndeavor if changed
  useEffect(() => {
    if (initialEndeavor) {
      setSelectedEndeavorId(initialEndeavor.id);
    }
  }, [initialEndeavor]);`;

const replacementProps = `interface FocusModeProps {
  endeavors: Endeavor[];
  focusTimer: {
    endeavor: Endeavor | null;
    isActive: boolean;
    isPaused: boolean;
    totalSeconds: number;
    secondsRemaining: number;
    mode: "pomodoro" | "deep" | "shortBreak";
    soundMode: "none" | "binaural" | "noise" | "rain";
    volume: number;
    sessionNotes: string;
  };
  setFocusTimer: React.Dispatch<React.SetStateAction<any>>;
  onFinishSession: (endeavorId: string, durationMinutes: number, notes: string) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  endeavors,
  focusTimer,
  setFocusTimer,
  onFinishSession,
}) => {
  const { endeavor: activeEndeavor, isActive, isPaused, totalSeconds, secondsRemaining: timeLeftSeconds, mode, soundMode, volume, sessionNotes } = focusTimer;
  const selectedEndeavorId = activeEndeavor?.id || endeavors[0]?.id || "";
  const durationMinutes = Math.floor(totalSeconds / 60);

  const setSelectedEndeavorId = (id: string) => {
    const e = endeavors.find((x) => x.id === id) || null;
    setFocusTimer((prev: any) => ({ ...prev, endeavor: e }));
  };

  const setMode = (newMode: "pomodoro" | "deep" | "shortBreak") => {
    setFocusTimer((prev: any) => ({ ...prev, mode: newMode }));
  };

  const setDurationMinutes = (minutes: number) => {
    setFocusTimer((prev: any) => ({ ...prev, totalSeconds: minutes * 60 }));
  };

  const setTimeLeftSeconds = (seconds: number | ((prev: number) => number)) => {
    setFocusTimer((prev: any) => ({ ...prev, secondsRemaining: typeof seconds === 'function' ? seconds(prev.secondsRemaining) : seconds }));
  };

  const setIsActive = (active: boolean) => {
    setFocusTimer((prev: any) => {
        if (!active) {
            // we are pausing, wait, in App.tsx isActive = true means timer runs, isPaused = false means runs.
            // if we are stopping the timer we want isActive = false
            return { ...prev, isActive: active, isPaused: false };
        } else {
            // starting the timer
            return { ...prev, isActive: active, isPaused: false };
        }
    });
  };

  const setSoundMode = (soundMode: "none" | "binaural" | "noise" | "rain") => {
    setFocusTimer((prev: any) => ({ ...prev, soundMode }));
  };

  const setVolume = (volume: number) => {
    setFocusTimer((prev: any) => ({ ...prev, volume }));
  };

  const setSessionNotes = (notes: string | ((prev: string) => string)) => {
    setFocusTimer((prev: any) => ({ ...prev, sessionNotes: typeof notes === 'function' ? notes(prev.sessionNotes) : notes }));
  };`;

if (content.includes(targetProps)) {
    content = content.replace(targetProps, replacementProps);
    console.log("Patched FocusMode Props!");
} else {
    console.log("Could not find FocusMode Props!");
}

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

const replacementEffect = `  // Timer Tick is now handled centrally by App.tsx so FocusMode doesn't duplicate intervals!
  // BUT we need to handle completion audio stop and confetti because App.tsx might not know about audio.
  // Actually App.tsx handles completion. We can just sync audio here.
  useEffect(() => {
    if (timeLeftSeconds === 0 && soundMode !== "none") {
      focusAudio.stop();
      setSoundMode("none");
    }
  }, [timeLeftSeconds, soundMode]);
`;

if (content.includes(targetEffect)) {
    content = content.replace(targetEffect, replacementEffect);
    console.log("Patched FocusMode Effect!");
} else {
    console.log("Could not find FocusMode Effect!");
}

const targetIsActiveButton = `            onClick={() => setIsActive(!isActive)}
            className={\`w-16 h-16 rounded-2xl flex items-center justify-center text-black font-bold shadow-xl hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 \${
              isActive
                ? "bg-amber-400 hover:bg-amber-300 shadow-amber-900/30"
                : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-950/40"
            }\`}
            title={isActive ? "Pause Focus Timer" : "Start Focus Timer"}
          >
            {isActive ? <Pause className="w-7 h-7 stroke-[2.5]" /> : <Play className="w-7 h-7 ml-0.5 stroke-[2.5]" />}`;

const replacementIsActiveButton = `            onClick={() => {
                setFocusTimer((prev: any) => ({ ...prev, isPaused: !prev.isPaused, isActive: true }))
            }}
            className={\`w-16 h-16 rounded-2xl flex items-center justify-center text-black font-bold shadow-xl hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 \${
              !isPaused && isActive
                ? "bg-amber-400 hover:bg-amber-300 shadow-amber-900/30"
                : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-950/40"
            }\`}
            title={!isPaused && isActive ? "Pause Focus Timer" : "Start Focus Timer"}
          >
            {!isPaused && isActive ? <Pause className="w-7 h-7 stroke-[2.5]" /> : <Play className="w-7 h-7 ml-0.5 stroke-[2.5]" />}`;

if (content.includes(targetIsActiveButton)) {
    content = content.replace(targetIsActiveButton, replacementIsActiveButton);
    console.log("Patched FocusMode Start/Pause Button!");
} else {
    console.log("Could not find FocusMode Start/Pause Button!");
}

fs.writeFileSync('src/components/FocusMode.tsx', content);
