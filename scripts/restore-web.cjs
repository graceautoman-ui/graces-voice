// Local rollback preparation only. Run on a temporary branch after approval.
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');process.chdir(path.resolve(__dirname,'..'));
const ref=process.argv[2];if(!ref||! /^[a-f0-9]{7,40}$/.test(ref))throw Error('Pass a verified stable commit SHA');
const branch=cp.execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim();if(!branch||branch==='main')throw Error('Use a temporary branch');
if(cp.execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim())throw Error('Working tree must be clean');
const files=fs.readdirSync('web');const staged=files.map(n=>[n,cp.execFileSync('git',['show',`${ref}:web/${n}`])]);
const old=JSON.parse(cp.execFileSync('git',['show',`${ref}:versions.json`],{encoding:'utf8'}));const current=JSON.parse(fs.readFileSync('versions.json'));current.web=old.web;
for(const [n,b] of staged)fs.writeFileSync('web/'+n,b);fs.writeFileSync('versions.json',JSON.stringify(current,null,2)+'\n');console.log('Restored web locally only. Run tests/build, update CHANGELOG, obtain confirmation before merging. Plugin unchanged.');
