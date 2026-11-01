const {Plugin,TFile,Notice,Modal,FuzzySuggestModal}=require('obsidian');
function validate(p){
 if(!p.vault||typeof p.filepath!=='string'||!p.filepath.endsWith('.md')||/[\\:*?"<>|\u0000-\u001f]/.test(p.filepath)||p.filepath.split('/').some(s=>!s||s==='.'||s==='..'||s.startsWith('.')||s!==s.trim()))throw Error('需要可见的库内 Markdown 文件路径');
}
async function existing(app,p){
 validate(p);
 const v=app.vault;
 if(v.getName()!==p.vault)throw Error('Vault 不匹配，未写入');
 const f=v.getAbstractFileByPath(p.filepath);
 if(!(f instanceof TFile)||f.path!==p.filepath||f.extension!=='md')throw Error('目标文件不存在，未写入；不会创建');
 const stat=await v.adapter.stat(p.filepath);
 if(!stat||stat.type!=='file'||v.getAbstractFileByPath(p.filepath)!==f)throw Error('目标文件已失效，未写入');
 return f;
}
async function appendExisting(app,p){
 if(typeof p.data!=='string'||!p.data.trim())throw Error('正文为空');
 const file=await existing(app,p);
 await app.vault.process(file,original=>{
  if(file.path!==p.filepath||app.vault.getAbstractFileByPath(p.filepath)!==file)throw Error('目标发生变化，未写入');
  return original+'\n\n'+p.data;
 });
}
class ExportModal extends Modal{
 constructor(app,text){super(app);this.text=text}
 onOpen(){this.contentEl.createEl('h2',{text:'已有笔记配置'});this.contentEl.createEl('p',{text:'复制下方配置到Grace‘s Voice 分类设置。仅来自当前库中已存在的文件；写入时仍会重新检查。'});const area=this.contentEl.createEl('textarea');area.value=this.text;area.readOnly=true;area.style.cssText='width:100%;min-height:180px';area.onclick=()=>area.select();const b=this.contentEl.createEl('button',{text:'复制配置'});b.onclick=async()=>{try{await navigator.clipboard.writeText(this.text);new Notice('已复制配置')}catch{area.select();new Notice('请长按或使用系统复制')}}}
 onClose(){this.contentEl.empty()}
}
class Picker extends FuzzySuggestModal{
 getItems(){return this.app.vault.getMarkdownFiles()}
 getItemText(f){return f.path}
 async onChooseItem(f){try{const p={vault:this.app.vault.getName(),filepath:f.path};await existing(this.app,p);new ExportModal(this.app,JSON.stringify({format:'grace-existing-target-v1',vaultName:p.vault,filePath:p.filepath},null,2)).open()}catch(e){new Notice(e.message)}}
}
// Exact destination allowlist; never redirect to arbitrary supplied websites.
function validatePick(p){
 const u=new URL(p.callback);
 if(!['https://graces-voice.yufeiyu.chatgpt.site/','https://graceautoman-ui.github.io/graces-voice/'].includes(u.origin+u.pathname)||u.username||u.password||u.search||u.hash)throw Error('返回地址不受支持');
 if(typeof p.request!=='string'||!/^[a-f0-9-]{36}$/i.test(p.request))throw Error('选择请求无效');
 return u;
}
function resultLink(p,vaultName,filePath){const u=validatePick(p);validate({vault:vaultName,filepath:filePath});u.hash='grace-bind='+encodeURIComponent(JSON.stringify({version:1,requestId:p.request,vaultName,filePath}));return u.href;}
class ReturnModal extends Modal{
 constructor(app,url,path){super(app);this.url=url;this.path=path}
 onOpen(){this.contentEl.createEl('h2',{text:'笔记已选择'});this.contentEl.createEl('p',{text:this.path});this.contentEl.createEl('p',{text:'已尝试返回 Grace。若未跳转，点击下方返回按钮。若打开了另一浏览器，复制返回链接，再到原应用的“取回选择结果”中粘贴。'});
 const open=this.contentEl.createEl('button',{text:'返回 Grace'});open.onclick=()=>window.open(this.url,'_external');
 const area=this.contentEl.createEl('textarea');area.value=this.url;area.readOnly=true;area.style.cssText='width:100%;min-height:90px;margin-top:16px';area.onclick=()=>area.select();
 const copy=this.contentEl.createEl('button',{text:'复制返回链接'});copy.onclick=async()=>{try{await navigator.clipboard.writeText(this.url);new Notice('已复制，请回到原来的 Grace 页面取回结果')}catch{area.select();new Notice('请长按或使用系统复制')}};
 }
 onClose(){this.contentEl.empty()}
}
class BindingPicker extends FuzzySuggestModal{
 constructor(app,params){super(app);this.params=params;this.setPlaceholder('选择接收记录的已有笔记')}
 getItems(){return this.app.vault.getMarkdownFiles().filter(f=>{try{validate({vault:this.app.vault.getName(),filepath:f.path});return true}catch{return false}})}
 getItemText(f){return f.path}
 async onChooseItem(file){if(this.returning)return;this.returning=true;try{if(this.params.vault&&this.params.vault!==this.app.vault.getName())throw Error('当前 Vault 与网页设置不一致');await existing(this.app,{vault:this.app.vault.getName(),filepath:file.path});const url=resultLink(this.params,this.app.vault.getName(),file.path);new ReturnModal(this.app,url,file.path).open();window.open(url,'_external')}catch(e){this.returning=false;new Notice('Grace：'+e.message,8000)}}
}
module.exports=class GraceExistingAppend extends Plugin{
 onload(){
  this.registerObsidianProtocolHandler('grace-pick',p=>{try{validatePick(p);if(p.vault&&p.vault!==this.app.vault.getName())throw Error('当前 Vault 与网页设置不一致');new BindingPicker(this.app,p).open()}catch(e){this.returning=false;new Notice('Grace：'+e.message,8000)}});
  this.addCommand({id:'export-target',name:'选择已有笔记并导出配置',callback:()=>new Picker(this.app).open()});
  this.registerObsidianProtocolHandler('grace-append',async p=>{
   try{await appendExisting(this.app,p);new Notice('已追加到本机笔记；不代表 iCloud 同步完成',7000)}
   catch(e){new Notice('Grace：'+e.message+'。请回Grace‘s Voice修正配置后重新写入。',10000)}
  });
 }
};
// Export actual handler for isolated tests; no mocked production replacement.
module.exports.appendExisting=appendExisting;

module.exports.validatePick=validatePick;module.exports.resultLink=resultLink;module.exports.BindingPicker=BindingPicker;
