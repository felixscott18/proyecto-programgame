const fs = require('fs');
const path = require('path');
const lockPath = path.join(process.cwd(), 'package-lock.json');
const data = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const bad = [];
function walk(obj, key) {
  if (obj && typeof obj === 'object') {
    if (Object.prototype.hasOwnProperty.call(obj, 'version')) {
      const version = obj.version;
      if (typeof version !== 'string' || version.trim() === '') {
        bad.push({ key, version });
      }
    }
    for (const k of Object.keys(obj)) {
      walk(obj[k], key ? `${key}.${k}` : k);
    }
  }
}
walk(data, '');
console.log('bad count', bad.length);
bad.slice(0, 200).forEach((item) => {
  console.log(item.key, JSON.stringify(item.version));
});
