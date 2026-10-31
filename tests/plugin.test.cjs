const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class TFile{constructor(path){this.path=path;this.extension='md'}}
const context={module:{exports:{}},require:()=>({Plugin:class{},TFile,Notice:class{},Modal:class{},FuzzySuggestModal:class{}})};
vm.runInNewContext(fs.readFileSync(__dirname+'/../plugin/grace-existing-append/main.js','utf8'),context);
const append=context.module.exports.appendExisting;
function fixture(){const f=new TFile('测试/已有.md');let body='原始内容\r\n不应删除  ',calls=0,exists=true;const app={vault:{getName:()=> '测试库',getAbstractFileByPath:p=>exists&&p===f.path?f:null,adapter:{stat:async()=>exists?{type:'file'}:null},process:async(file,fn)=>{calls++;body=fn(body)}}};return {app,f,get body(){return body},get calls(){return calls},remove(){exists=false}}}
const p={vault:'测试库',filepath:'测试/已有.md',data:'中文\n100% & + # ? 😀\r\n保留空格  '};
test('existing: original prefix and exact Unicode multiline suffix',async()=>{const x=fixture();const original=x.body;await append(x.app,p);assert.equal(x.body,original+'\n\n'+p.data);assert.equal(x.calls,1)});
for(const [name,over] of Object.entries({missing:{filepath:'不存在/新文件.md'},wrongVault:{vault:'错误库'},traversal:{filepath:'../已有.md'},hidden:{filepath:'.obsidian/config.md'},empty:{data:'  '},nonMarkdown:{filepath:'测试/已有.txt'}}))test(name+' refuses before writer',async()=>{const x=fixture();await assert.rejects(append(x.app,{...p,...over}));assert.equal(x.calls,0)});
test('file deleted after binding',async()=>{const x=fixture();x.remove();await assert.rejects(append(x.app,p));assert.equal(x.calls,0)});
test('stale cache but no disk file',async()=>{const x=fixture();x.app.vault.adapter.stat=async()=>null;await assert.rejects(append(x.app,p));assert.equal(x.calls,0)});
test('renamed between checks and process',async()=>{const x=fixture();x.app.vault.process=async(f,fn)=>{f.path='其他.md';fn(x.body)};await assert.rejects(append(x.app,p))});
test('no create or low-level write API is referenced',()=>{const s=fs.readFileSync(__dirname+'/../plugin/grace-existing-append/main.js','utf8');assert.doesNotMatch(s,/\.(create|createFolder|write|writeBinary|modify|append)\s*\(/)});
