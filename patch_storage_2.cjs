const fs = require('fs');
let content = fs.readFileSync('src/lib/storage.ts', 'utf8');

const target = `      return JSON.parse(data);
    } catch {
      return INITIAL_ENDEAVORS_WORK;
    }`;

const replacement = `      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map((e: any) => ({
          ...e,
          history: e.history || {},
          streakCount: e.streakCount || 0,
          bestStreak: e.bestStreak || 0,
          milestones: e.milestones || []
        }));
      }
      return parsed;
    } catch {
      return INITIAL_ENDEAVORS_WORK;
    }`;

if (content.includes(target)) {
    fs.writeFileSync('src/lib/storage.ts', content.replace(target, replacement));
    console.log("Patched storage!");
} else {
    console.log("Not found in storage.ts");
}
