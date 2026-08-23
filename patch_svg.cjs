const fs = require('fs');
let content = fs.readFileSync('src/components/FocusMode.tsx', 'utf8');

const targetSVG = `<svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-white/5 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-emerald-500 stroke-current transition-all duration-500 ease-linear"
              strokeWidth="10"
              strokeDasharray="276"
              strokeDashoffset={276 * (1 - progressRatio)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>`;

const replacementSVG = `<svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-white/5 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-emerald-500 stroke-current transition-all duration-500 ease-linear drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              strokeWidth="8"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 * (1 - progressRatio)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>`;

if (content.includes(targetSVG)) {
    fs.writeFileSync('src/components/FocusMode.tsx', content.replace(targetSVG, replacementSVG));
    console.log("Patched SVG!");
} else {
    console.log("Could not find SVG in FocusMode.tsx");
}
