const fs = require('fs');
let content = fs.readFileSync('src/lib/storage.ts', 'utf8');

const target = `return parsed.map((e: any) => ({
        ...e,
        createdAt: e.createdAt || new Date().toISOString(),
        updatedAt: e.updatedAt || new Date().toISOString(),
      }));`;

const replacement = `return parsed.map((e: any) => ({
        ...e,
        createdAt: e.createdAt || new Date().toISOString(),
        updatedAt: e.updatedAt || new Date().toISOString(),
        history: e.history || {},
        streakCount: e.streakCount || 0,
        bestStreak: e.bestStreak || 0,
      }));`;

if (content.includes(target)) {
    fs.writeFileSync('src/lib/storage.ts', content.replace(target, replacement));
    console.log("Patched storage!");
} else {
    console.log("Not found in storage.ts");
}
