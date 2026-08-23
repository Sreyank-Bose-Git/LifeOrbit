const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `  // Save new or edited endeavor
  const handleSaveEndeavor = (incoming: any) => {
    const isNew = !incoming.id;
    const finalEndeavor: Endeavor = isNew
      ? {
          ...incoming,
          id: \`end-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: {},
          streakCount: 0,
          bestStreak: 0,
        }
      : incoming;

    const exists = endeavors.some((e) => e.id === finalEndeavor.id);
    let updated: Endeavor[];
    if (exists) {
      updated = endeavors.map((e) => (e.id === finalEndeavor.id ? finalEndeavor : e));
      showToast(\`Updated "\${finalEndeavor.title}"\`);
    } else {
      updated = [finalEndeavor, ...endeavors];
      awardXP(50, \`Created endeavor "\${finalEndeavor.title}"\`);
      showToast(\`Created "\${finalEndeavor.title}"\`);
    }
    setEndeavors(updated);
    storage.saveEndeavors(updated);
    if (selectedEndeavorForDetail && selectedEndeavorForDetail.id === finalEndeavor.id) {
      setSelectedEndeavorForDetail(finalEndeavor);
    }
  };`;

const startIndex = content.indexOf('// Save new or edited endeavor');
const endIndex = content.indexOf('// Delete endeavor');

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.substring(0, startIndex) + replacement + '\n\n  ' + content.substring(endIndex);
    fs.writeFileSync('src/App.tsx', newContent);
    console.log("Patched!");
} else {
    console.log("Could not find start or end index!");
}
