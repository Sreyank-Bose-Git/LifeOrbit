const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const regex = /\.map\s*\(\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>\s*(?:\{[^}]*return\s*)?(\<[a-zA-Z0-9_.]+(\s+[^>]+)?\>)/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(match[1]);
}
