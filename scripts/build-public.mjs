import {build} from 'vite';
import {cpSync,mkdirSync,readFileSync,writeFileSync,readdirSync,existsSync,rmSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('.');const out=resolve(root,existsSync(resolve(root,'.openai/hosting.json'))?'dist':'dist-public');
mkdirSync(resolve(root,'public/fonts'),{recursive:true});cpSync(resolve(root,'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),resolve(root,'public/fonts/inter-latin.woff2'));
await build({root:resolve(root,'public-app'),publicDir:resolve(root,'public'),configFile:false,resolve:{alias:{'@':root,'next/link':resolve(root,'public-app/navigation.tsx'),'next/navigation':resolve(root,'public-app/navigation.tsx'),'next/image':resolve(root,'public-app/image.tsx')}},define:{'process.env.NEXT_PUBLIC_PUBLIC_EDITION':JSON.stringify('true')},css:{postcss:root},build:{outDir:out,emptyOutDir:true,rolldownOptions:{onwarn(warning,warn){if(warning.code!=='MODULE_LEVEL_DIRECTIVE')warn(warning);}}}});
mkdirSync(resolve(out,'fonts'),{recursive:true});cpSync(resolve(root,'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),resolve(out,'fonts/inter-latin.woff2'));
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?files(resolve(dir,item.name)):[resolve(dir,item.name)]);}
const paths=files(out).filter(p=>!p.endsWith('/sw.js'));const digest=createHash('sha256');for(const path of paths)digest.update(readFileSync(path));
const urls=['/',...paths.map(p=>'/'+relative(out,p).split('\\').join('/'))];
writeFileSync(resolve(out,'sw.js'),`const CACHE='murajaah-${digest.digest('hex').slice(0,16)}';const ASSETS=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('murajaah-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;const known=ASSETS.includes(url.pathname);if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));else if(known)event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});
`);
if(existsSync(resolve(root,'public-site/.openai/hosting.json'))){const release=resolve(root,'public-site');rmSync(resolve(release,'dist'),{recursive:true,force:true});cpSync(out,resolve(release,'dist'),{recursive:true});
 for(const dir of ['app','components','lib','public','public-app','scripts'])cpSync(resolve(root,dir),resolve(release,dir),{recursive:true,filter:source=>!source.includes('/.local-ai')&&!source.endsWith('/AGENTS.md')});
 for(const file of ['package.json','package-lock.json','postcss.config.mjs','tsconfig.json','README.md'])cpSync(resolve(root,file),resolve(release,file));
 writeFileSync(resolve(release,'.gitignore'),'node_modules/\ndist-public/\n.env*\n.next/\n*.tsbuildinfo\n');
 const manifest=JSON.parse(readFileSync(resolve(release,'.openai/hosting.json'),'utf8'));manifest.static={directory:'dist'};writeFileSync(resolve(release,'.openai/hosting.json'),JSON.stringify(manifest,null,2)+'\n');
}
console.log('Public offline edition built. No server secrets or personal browser data included.');
