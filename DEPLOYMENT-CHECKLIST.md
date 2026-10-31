# 子路径部署检查清单

准备日期：2026-10-31。基于现有独立部署源码 v1.1.0。未访问真实用户数据库、未修改旧网站、未推送或发布。

| 项目 | 处理/结论 |
|---|---|
| HTML/CSS/脚本/图标链接 | 原本为相对路径；保留，在 /graces-voice/ 下解析 |
| setup 返回设置链接 | ./#settings，保留 |
| 页面路由 | hash 路由，保留，无需服务器 rewrite |
| Manifest id | 从 / 改为 ./，避免识别成账号根站的 PWA |
| start_url / scope | 均为 ./，解析为 /graces-voice/ |
| Manifest 图标 | 相对 Manifest 的 icon-192.png、icon-512.png |
| SW 注册 | app.js 中 ./sw.js，默认 scope 为 /graces-voice/，保持不变 |
| SW 预缓存 | 从 SW 所在目录构造绝对资源 URL，包含 /graces-voice/ 和 /graces-voice/index.html |
| SW 请求匹配 | 仅匹配自身预缓存资源完整地址，不按文件名误匹配其他目录 |
| SW 缓存清理 | 缓存名加入项目路径，仅清理本项目版本，不清理同 origin 其他项目缓存 |
| 更新行为 | 保留等旧标签页关闭再激活；修改资源后需要更新 CACHE 版本 |
| 离线范围 | 安装缓存完成后首页/本地历史/配置可用；插件 ZIP 未加入缓存，下载需联网 |
| IndexedDB | store.js 字节保持一致；不清空、不覆盖、不自动迁移数据库 |
| Obsidian 插件 | main.js、manifest.json、下载 ZIP 字节保持一致 |
| .nojekyll | 已提供，发布时确认未遗漏 |
| 公开内容 | 只复制运行所需静态资产/插件源码/原安装说明及公开部署说明；无 .git、.openai、凭据、私人笔记、数据 JSON、内部测试、迁移脚本 |

## 硬编码与已知功能限制

1. `plugin/grace-existing-append/main.js` 的 validatePick 固定允许 `https://graces-voice.yufeiyu.chatgpt.site` 且 path=/；ZIP 内同一代码也存在。按要求原样保留。这个域名是产品配置，不是密钥。
2. `binding.js` 的 request 用 `new URL('/', origin)` 构造回跳，parse 只接受 path=/；它没有硬编码 Sites 域名，但包含根路径假设。两者均未修改。将来不仅需要改插件 origin，还要允许 /graces-voice/ 并同步网页请求/解析；仅放开域名不能解决问题。
3. “去 Obsidian 选择笔记 → 自动返回”和“取回选择结果”在新站不能作为完整闭环使用。现有导入分类/粘贴旧配置保留，可用于手工配置。
4. `grace-append` 不依赖网页域名；已有文件检查、只追加、本地先保存、重新写入及重复风险提示保持。未进行真实笔记写入测试。
5. 新旧域名存储完全隔离；历史/草稿仍在旧站，不会被本包迁移或删除。旧站完整备份恢复仍为正式切换前置项。
6. 免费托管不等于大陆稳定免 VPN；需实际网络验收。

## 验证边界与发布后验收

本地代码检查：相对资源都存在；Manifest 解析到正确子路径；SW 通过模拟 install/activate/fetch 验证预缓存、离线命中、项目隔离；UI/数据层/插件与原源码比对一致。测试文件保存在准备目录外层，不进入公开包。

未进行 GitHub 线上访问、真实浏览器安装或 iPhone 真机离线验收。发布后检查：
- /graces-voice/ 与 /graces-voice/index.html 均加载；CSS、JS、图标、manifest、sw 均 HTTP 200 且类型正确。
- 375/390px 与桌面页面、所有菜单、分类导入/导出与草稿恢复正常。
- 首次联网缓存后关闭重开、断网访问，再本地记录；不能只看 navigator.onLine 判定失败。
- 不清旧数据；只在自己指定的测试笔记手动验证追加、错误路径拒绝与本地保留。
- 切换前先完成完整数据备份，不能把当前包误当无损迁移已完成。
