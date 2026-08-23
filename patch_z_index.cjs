const fs = require('fs');

function patchFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    let patched = false;
    for (const [target, replacement] of replacements) {
        if (content.includes(target)) {
            content = content.replace(target, replacement);
            patched = true;
        }
    }
    if (patched) {
        fs.writeFileSync(file, content);
        console.log(`Patched ${file}`);
    }
}

patchFile('src/components/InsightsView.tsx', [
    [
        'hover:scale-105 active:scale-95 cursor-pointer select-none ${bg}`}',
        'hover:scale-105 active:scale-95 cursor-pointer select-none relative z-0 hover:z-10 ${bg}`}'
    ]
]);

patchFile('src/components/EndeavorCard.tsx', [
    [
        'shadow-xs group-hover:scale-105 transition-transform duration-200 cursor-pointer"',
        'shadow-xs group-hover:scale-105 transition-transform duration-200 cursor-pointer relative z-0 group-hover:z-10"'
    ],
    [
        'm.completed ? "bg-emerald-500 text-black scale-105" : "border border-white/20 bg-transparent hover:border-white/40"',
        'm.completed ? "bg-emerald-500 text-black scale-105 relative z-10" : "border border-white/20 bg-transparent hover:border-white/40 relative z-0"'
    ]
]);

patchFile('src/components/Sidebar.tsx', [
    [
        'shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-12 transition-all`}',
        'shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-12 transition-all relative z-0 group-hover:z-10`}'
    ],
    [
        'border-white/10 shrink-0 group-hover:scale-105 transition-transform"',
        'border-white/10 shrink-0 group-hover:scale-105 transition-transform relative z-0 group-hover:z-10"'
    ]
]);

patchFile('src/components/MiniFocusPlayer.tsx', [
    [
        'shrink-0 cursor-pointer relative overflow-hidden transition group-hover:scale-105"',
        'shrink-0 cursor-pointer relative overflow-hidden transition group-hover:scale-105 z-0 group-hover:z-10"'
    ]
]);

patchFile('src/components/TimelineView.tsx', [
    [
        'active:scale-90 hover:scale-105 transition-all duration-150 ${',
        'active:scale-90 hover:scale-105 transition-all duration-150 relative z-0 hover:z-10 ${'
    ]
]);

patchFile('src/components/FocusMode.tsx', [
    [
        'shadow-xl hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 ${',
        'shadow-xl hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 relative z-0 hover:z-10 ${'
    ]
]);
