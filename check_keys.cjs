const fs = require('fs');

function checkFile(file) {
    const code = fs.readFileSync(file, 'utf8');
    let lines = code.split('\n');

    for(let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.map(')) {
        for(let j = i; j < i + 10 && j < lines.length; j++) {
        if (lines[j].includes('<') && !lines[j].includes('key=') && !lines[j].includes('/>') && !lines[j].includes('</')) {
            console.log(`[${file}] Possible missing key around line ${j+1}: ${lines[j]}`);
        }
        }
    }
    }
}

const glob = require('glob');
const files = glob.sync('src/**/*.tsx');
files.forEach(checkFile);
