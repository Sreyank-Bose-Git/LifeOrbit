const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `selectedCategory === "all" ? "scale-105" : "opacity-75 hover:opacity-100"`;
const replacement1 = `selectedCategory === "all" ? "scale-105 relative z-10" : "opacity-75 hover:opacity-100 relative z-0 hover:z-10"`;

const target2 = `isSelected ? "scale-105" : "opacity-75 hover:opacity-100"`;
const replacement2 = `isSelected ? "scale-105 relative z-10" : "opacity-75 hover:opacity-100 relative z-0 hover:z-10"`;

if (content.includes(target1)) {
    content = content.replace(target1, replacement1);
} else {
    console.log("Not found target1");
}

if (content.includes(target2)) {
    content = content.replace(target2, replacement2);
} else {
    console.log("Not found target2");
}

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx scale z-index!");
