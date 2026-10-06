import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../app/tokens.css',import.meta.url),'utf8');
const colors=Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{3,6})/gi)].map(m=>[m[1],m[2]]));
function luminance(hex){if(hex.length===4)hex="#"+[...hex.slice(1)].map(c=>c+c).join("");const values=hex.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return values[0]*.2126+values[1]*.7152+values[2]*.0722;}
function ratio(a,b){const [light,dark]=[luminance(colors[a]),luminance(colors[b])].sort((x,y)=>y-x);return(light+.05)/(dark+.05);}
const checks=[...['bg','surface','accent-soft','notice'].flatMap(bg=>[['ink',bg,4.5],['muted',bg,4.5],['accent',bg,4.5],['control-border',bg,3]]),['surface','accent',4.5],['error','surface',4.5],['surface','error',4.5],['error','error-surface',4.5],['ink','error-surface',4.5],['muted','error-surface',4.5],['accent','error-surface',4.5],['control-border','error-surface',3]];
let failed=false;for(const [fg,bg,min]of checks){const value=ratio(fg,bg);if(value<min){failed=true;process.stderr.write(`FAIL ${fg}/${bg}: ${value.toFixed(2)} < ${min}\n`);}}
if(failed)process.exitCode=1;else process.stdout.write(`${checks.length} token contrast checks passed.\n`);
