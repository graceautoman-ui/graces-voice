/* Pure business rules; no filesystem or network operations. */
(function(root){
function target(vault,path){if(typeof vault!=='string'||!vault.trim()||vault!==vault.trim())throw Error('请填写正确的 Vault 名称');if(typeof path!=='string'||!path.endsWith('.md')||/[\\:*?"<>|\u0000-\u001f]/.test(path)||path.split('/').some(p=>!p||p==='.'||p==='..'||p.startsWith('.')||p!==p.trim()))throw Error('目标必须是库内已有 Markdown 文件');}
function mapping(config,gid,cid){const g=config.groups.find(g=>g.id===gid),c=g?.children.find(c=>c.id===cid);if(!g||!c)throw Error('原分类已删除，无法重新写入；原文仍保留在历史中');target(config.vault,c.path);return {g,c,vault:config.vault,path:c.path}}
function time(t){const d=new Date(t),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`}
function markdown(r){return `${r.localTime} | ${r.parent}/${r.child}\n\n${r.body}\n\n---\n`}
function record(draft,config,id,t=Date.now()){if(!draft.body.trim())throw Error('请输入记录内容');if(!draft.gid)throw Error('请选择一级分类');if(!draft.cid)throw Error('请选择二级分类');const m=mapping(config,draft.gid,draft.cid);return {id,time:t,localTime:time(t),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,offset:-new Date(t).getTimezoneOffset(),body:draft.body,gid:m.g.id,cid:m.c.id,parent:m.g.name,child:m.c.name,vault:m.vault,path:m.path,status:'local',attemptCount:0};}
function uri(r,m){target(m.vault,m.path);return 'obsidian://grace-append?'+Object.entries({vault:m.vault,filepath:m.path,data:markdown(r)}).map(([k,v])=>k+'='+encodeURIComponent(v)).join('&')}
function imported(raw){let m;try{m=JSON.parse(raw)}catch{throw Error('请粘贴 Obsidian 插件导出的配置')}if(m.format!=='grace-existing-target-v1')throw Error('不是有效的笔记配置');target(m.vaultName,m.filePath);return {vault:m.vaultName,path:m.filePath}}
root.Core={target,mapping,time,markdown,record,uri,imported};if(typeof module!=='undefined')module.exports=root.Core;
})(typeof window==='undefined'?globalThis:window);
