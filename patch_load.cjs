const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const loadedEndeavors = storage.getEndeavors(currentActiveId);`;
const replacement = `    const loadedEndeavors = storage.getEndeavors(currentActiveId).map(e => ({
      ...e,
      id: e.id || \`end-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
      history: e.history || {},
      streakCount: e.streakCount || 0,
      bestStreak: e.bestStreak || 0,
      milestones: e.milestones || [],
    }));`;

if (content.includes(target)) {
    fs.writeFileSync('src/App.tsx', content.replace(target, replacement));
    console.log("Patched!");
} else {
    console.log("Could not find target!");
}
