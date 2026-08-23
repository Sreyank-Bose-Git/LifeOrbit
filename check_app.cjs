const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const mapCalls = content.split('.map(');
for (let i = 1; i < mapCalls.length; i++) {
    const chunk = mapCalls[i];
    const arrowIndex = chunk.indexOf('=>');
    if (arrowIndex !== -1) {
        let afterArrow = chunk.substring(arrowIndex + 2);
        // find first '<'
        const tagIndex = afterArrow.indexOf('<');
        if (tagIndex !== -1 && tagIndex < 200) {
            const tagCloseIndex = afterArrow.indexOf('>', tagIndex);
            if (tagCloseIndex !== -1) {
                console.log(afterArrow.substring(tagIndex, tagCloseIndex + 1));
            }
        }
    }
}
