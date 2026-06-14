const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'Frontend', 'package-lock.json');
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
const invalid = [];
function walk(obj, pathArr) {
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      if (k === 'version') {
        const v = obj[k];
        if (typeof v !== 'string' || !/^\d+\.\d+\.\d+/.test(v)) {
          invalid.push({ path: pathArr.join('/'), value: v });
        }
      } else {
        walk(obj[k], pathArr.concat(k));
      }
    }
  }
}
walk(j, []);
console.log(JSON.stringify(invalid, null, 2));
