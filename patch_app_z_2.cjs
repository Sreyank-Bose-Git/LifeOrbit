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

patchFile('src/components/EndeavorCard.tsx', [
    [
        'day.isToday ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"',
        'day.isToday ? "cursor-pointer hover:scale-110 active:scale-95 relative z-10" : "cursor-default relative z-0"'
    ]
]);
