// Static copy only; no bundler and no runtime dependencies.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);
const v=JSON.parse(fs.readFileSync('versions.json'));
for(const k of ['web','plugin','minimumPlugin'])if(!/^\d+\.\d+\.\d+$/.test(v[k]))throw Error('Invalid version '+k);
if(JSON.parse(fs.readFileSync('plugin/grace-existing-append/manifest.json')).version!==v.plugin)throw Error('Plugin version mismatch');
const allowed=['.nojekyll','app.js','binding.js','brand-icon.svg','config-transfer.js','core.js','design-system.css','icon-192.png','icon-512.png','index.html','manifest.webmanifest','setup.html','store.js','sw.js'];
if(JSON.stringify(fs.readdirSync('web').sort())!==JSON.stringify(allowed.sort()))throw Error('Unexpected public file; review allowlist');
const sha=cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.rmSync('dist',{recursive:true,force:true});fs.cpSync('web','dist',{recursive:true});
const sw=fs.readFileSync('dist/sw.js','utf8');fs.writeFileSync('dist/sw.js',sw.replace(/const CACHE=PREFIX\+[^;]+;/,`const CACHE=PREFIX+'web-${v.web}-${sha}';`));
fs.writeFileSync('dist/release.json',JSON.stringify({web:v.web,plugin:v.plugin,commit:sha})+'\n');
console.log('Prepared web-only artifact',sha);
