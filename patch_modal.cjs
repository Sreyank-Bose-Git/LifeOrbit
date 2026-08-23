const fs = require('fs');
let content = fs.readFileSync('src/components/CreateEndeavorModal.tsx', 'utf8');

const target = 'color === c ? "ring-2 ring-offset-2 ring-offset-[#141414] ring-emerald-400 scale-110" : ""';
const replacement = 'color === c ? "ring-2 ring-offset-2 ring-offset-[#141414] ring-emerald-400 scale-110 relative z-10" : "relative z-0"';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/CreateEndeavorModal.tsx', content);
    console.log("Patched CreateEndeavorModal.tsx");
}
