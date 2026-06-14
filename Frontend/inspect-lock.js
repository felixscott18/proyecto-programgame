const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package-lock.json'), 'utf8'));
const bad = [];
function walk(obj, key) {
  if (obj && typeof obj === 'object') {
    if (Object.prototype.hasOwnProperty.call(obj, 'version')) {
      const v = obj.version;
      if (typeof v !== 'string' || v.trim() === '') {
        bad.push({ key, version: v });
      }
    }
    for (const k of Object.keys(obj)) walk(obj[k], key ? `${key}.${k}` : k);
  }
}
walk(data, '');
console.log('bad count', bad.length);
for (const item of bad.slice(0, 200)) {
  console.log(`${item.key}: ${JSON.stringify(item.version)}`);
}
