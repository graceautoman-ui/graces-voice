/* Device-to-device configuration only. Never serializes records or drafts. */
(function(root){
const FORMAT='grace-voice-config';
function validate(raw){
 if(!raw||raw.format!==FORMAT||raw.version!==1)throw Error('请选择 Grace‘s Voice 导出的分类配置文件');
 const c=raw.config;if(!c||typeof c.vault!=='string'||c.vault.length>255||!Array.isArray(c.groups)||c.groups.length>200)throw Error('配置格式不正确');
 const ids=new Set(),names=new Set();let count=0;
 const id=v=>{if(typeof v!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(v)||ids.has(v))throw Error('分类 ID 无效或重复');ids.add(v);return v};
 const name=v=>{if(typeof v!=='string'||!v.trim()||v!==v.trim()||v.length>80||/[\u0000-\u001f]/.test(v))throw Error('分类名称无效');return v};
 const groups=c.groups.map(g=>{if(!g||!Array.isArray(g.children))throw Error('分类结构无效');const gid=id(g.id),n=name(g.name);if(names.has(n))throw Error('一级分类名称重复');names.add(n);const childNames=new Set();return {id:gid,name:n,children:g.children.map(ch=>{if(++count>2000||!ch)throw Error('二级分类数量或结构无效');const cid=id(ch.id),cn=name(ch.name);if(childNames.has(cn))throw Error('二级分类名称重复');childNames.add(cn);Core.target(c.vault,ch.path);return {id:cid,name:cn,path:ch.path}})}});
 if(c.vault)Core.target(c.vault,'validation.md');return {vault:c.vault,groups};
}
function pack(c){return {format:FORMAT,version:1,exportedAt:new Date().toISOString(),config:validate({format:FORMAT,version:1,config:c})}}
function parse(text){if(text.length>2000000)throw Error('配置文件过大');let raw;try{raw=JSON.parse(text.replace(/^\uFEFF/,''))}catch{throw Error('文件不是有效 JSON，请重新选择导出的配置')}return validate(raw)}
function merge(current,incoming){
 if(current.vault&&incoming.vault!==current.vault&&(current.groups.length||current.records?.length||current.draft?.body))throw Error('两个设备的 Vault 不一致，已停止导入。请核对库名称后重试');
 const next={vault:incoming.vault,groups:structuredClone(current.groups)};
 for(const g of incoming.groups){let local=next.groups.find(x=>x.id===g.id);if(next.groups.some(x=>x.id!==g.id&&x.name===g.name))throw Error('存在同名但不同 ID 的一级分类「'+g.name+'」，未覆盖原分类');if(!local){local={id:g.id,name:g.name,children:[]};next.groups.push(local)}local.name=g.name;for(const ch of g.children){if(next.groups.some(x=>x.id!==g.id&&x.children.some(c=>c.id===ch.id)))throw Error('分类所属关系冲突，未导入');if(local.children.some(c=>c.id!==ch.id&&c.name===ch.name))throw Error('存在同名但不同 ID 的二级分类「'+ch.name+'」，未覆盖原分类');const existing=local.children.find(c=>c.id===ch.id);if(existing)Object.assign(existing,ch);else local.children.push({...ch})}}
 return validate({format:FORMAT,version:1,config:next});
}
root.ConfigTransfer={pack,parse,merge};if(typeof module!=='undefined')module.exports=root.ConfigTransfer;
})(typeof window==='undefined'?globalThis:window);
