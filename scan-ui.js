const fs = require('fs');
const path = require('path');
const root = path.join('client','src');
const results = [];
function walk(dir){
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    const p = path.join(dir,item.name);
    if(item.isDirectory()) walk(p);
    else if(/\.jsx?$/.test(item.name)){
      const content = fs.readFileSync(p,'utf8');
      const lines = content.split(/\r?\n/);
      for(let i=0;i<lines.length;i++){
        const line = lines[i];
        const matched = line.match(/("([^"]*[A-Za-z][^"]*)"|'([^']*[A-Za-z][^']*)')/g);
        if(!matched) continue;
        for(const m of matched){
          const txt = m.slice(1, -1);
          if(/\b(import|from|require|const|let|var|function|=>|return|className|class |style=|src=|href=|path=|api|http|https|@mui|react-bootstrap|react-router|axios|redux|dispatch|navigate)\b/i.test(txt)) continue;
          if(/^[A-Za-z0-9_\/\.]+$/.test(txt)) continue;
          if(txt.length < 2) continue;
          if(/\b[A-Za-z]{6,}\b/.test(txt) || /\s/.test(txt)){
            results.push({file:p,line:i+1,text:txt});
          }
        }
      }
    }
  }
}
walk(root);
results.sort((a,b)=>a.file.localeCompare(b.file)||a.line-b.line);
for(const r of results){
  console.log(`${r.file}:${r.line}: ${r.text}`);
}
console.log('TOTAL', results.length);
