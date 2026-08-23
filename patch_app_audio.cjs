const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = `import React, { useState, useEffect, useMemo } from "react";`;
const replacementImport = `import React, { useState, useEffect, useMemo } from "react";
import { focusAudio } from "./lib/audio";`;

content = content.replace(targetImport, replacementImport);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched!");
