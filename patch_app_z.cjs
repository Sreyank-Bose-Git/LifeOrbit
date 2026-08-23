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

patchFile('src/App.tsx', [
    [
        'active:scale-95 transition-all duration-150 shrink-0 ${',
        'active:scale-95 transition-all duration-150 shrink-0 relative z-0 hover:z-10 ${'
    ]
]);
