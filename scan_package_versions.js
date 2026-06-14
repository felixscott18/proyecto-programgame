const fs = require('fs');
const path = require('path');
function findFiles(dir, results=[]){
  const list = fs.readdirSync(dir, {withFileTypes:true});
  for(const entry of list){
    const full = path.join(dir, entry.name);
    if(entry.isDirectory()){
      // skip node_modules to speed up
      if(entry.name === 'node_modules') continue;
      findFiles(full, results);
    } else if(entry.isFile() && entry.name === 'package.json'){
      results.push(full);
    }
  }
  return results;
}
const root = path.join(__dirname, 'Frontend');
const files = findFiles(root, []);
const invalid = [];
for(const f of files){
  try{
    const j = JSON.parse(fs.readFileSync(f,'utf8'));
    const v = j.version;
    if(typeof v !== 'string' || v.trim()==='') invalid.push({file:f, version:v});
  }catch(e){ invalid.push({file:f, error: String(e)});
  }
}
console.log(JSON.stringify({checked: files.length, invalid}, null, 2));
