const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\.map\s*\(\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>\s*(?:\{[^}]*return\s*)?(\<[a-zA-Z0-9_.]+(\s+[^>]+)?\>)/gs;

let match;
while ((match = regex.exec(content)) !== null) {
  const openingTag = match[1];
  if (!openingTag.includes('key=')) {
    console.log(`Missing key around index ${match.index}:`);
    console.log(openingTag);
  }
}
