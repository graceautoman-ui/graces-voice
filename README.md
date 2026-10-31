# Grace’s Voice GitHub Pages 1.1.2 更新

地址：https://graceautoman-ui.github.io/graces-voice/

## 网页更新

将本目录内容上传 graces-voice 仓库根目录（index.html 直接位于根目录），保留 .nojekyll；Pages 使用 main / (root)。本次仅交付文件，尚未上传或发布。插件与网页必须一起更新才能完成新地址回跳。无需修改旧站网页；新插件兼容旧站。

## Mac 插件更新

1. 解压 grace-existing-append.zip。
2. 在 Obsidian 设置 → 第三方插件中暂时关闭 Grace Existing Append。
3. 打开实际 Vault 的 .obsidian/plugins/grace-existing-append/，仅替换 main.js 和 manifest.json；不要替换整个 .obsidian 或笔记文件夹，不要改其他插件文件。
4. 重新启用插件，确认显示版本 1.1.2。要求 Obsidian ≥1.9.10。

## iPhone 插件更新

- 若与 Mac 共用 iCloud Vault 和相同配置目录：Mac 更新后等待两个插件文件同步，手机重新打开 Obsidian，关闭再开启插件并核对版本 1.1.2。不能只凭笔记已同步认定插件也同步完成。
- 若手机使用独立 Vault/配置目录：需要把 ZIP 内两个文件复制到手机实际 Vault 的 .obsidian/plugins/grace-existing-append/；不要放到 iCloud Drive 顶层或可见笔记目录。系统文件选择器可能隐藏 .obsidian，优先通过对应的 Mac iCloud Vault 更新。
- 手机若仍显示“0 个插件”，说明安装/同步未就绪，这次网页更新不会自动安装插件；不要清理数据或重建 Vault。先核对配置目录与两个文件是否到位。

## 使用

联网打开更新后的网页，关闭旧标签/PWA再重新进入，不清缓存数据。分类 → 编辑二级分类 → 去 Obsidian 选择笔记 → 选好返回 → 保存。新站从 #settings 进入也不会跳回 github.io 根目录。

若 iPhone 打开 Safari 而非原 PWA，复制返回链接，回原应用“继续配置目标笔记 → 取回选择结果”。原站和新站数据仍各自保存在对应浏览器；本次不迁移历史。

测试范围与验收步骤见 DEPLOYMENT-CHECKLIST.md。当前包不含私人笔记、用户数据或密钥。
