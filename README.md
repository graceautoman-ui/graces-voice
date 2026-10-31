# Grace’s Voice — GitHub Pages 部署版

这是现有 v1.1.0 的子路径部署准备版本，不是重新开发。只调整 Manifest 应用标识和 Service Worker 缓存作用范围。设计、业务、IndexedDB 与插件保持原样。

预计入口：`https://<GitHub用户名>.github.io/graces-voice/`。

## 发布步骤

1. 在自己的 GitHub 账户新建 **Public** 仓库，名称准确填写 `graces-voice`。GitHub Free 的 Pages 支持公开仓库；仓库会公开源码，不要上传私人笔记、数据备份或密钥。
2. 上传本文件所在文件夹的**所有内容**到仓库根目录。根目录应直接看到 `index.html`、`sw.js`、`manifest.webmanifest`、`.nojekyll` 和 `plugin/`，不要再套一层 graces-voice 或 dist。
3. `.nojekyll` 是隐藏的空文件；若网页上传遗漏，使用 Add file → Create new file 创建名为 `.nojekyll` 的文件（可填一行说明），提交到 main。
4. 打开 Settings → Pages → Build and deployment → Source 选择 **Deploy from a branch**；Branch 选择 **main**，文件夹选择 **/(root)**，点击 Save。无需安装依赖或填写构建命令，不需要自定义域名或 CNAME。
5. 等 GitHub Actions 中 Pages 部署完成，以 Settings → Pages 给出的 HTTPS 链接为准。确认启用 Enforce HTTPS（如显示该选项）。
6. 首次联网访问，等待设置页“离线资源已就绪”，关闭后重开，再断网验证首页/历史/保存。iPhone 使用 Safari 打开新链接 → 分享 → 添加到主屏幕。Mac 可在支持的浏览器中安装或收藏。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 发布前必须知道

- **本版本没有解决选笔记自动返回。** 按要求，插件与回跳代码未修改。当前网页仍将回跳地址构造为当前 origin 的 `/`，插件只接受旧 Sites 域名的 `/`。因此新站点击“去 Obsidian 选择笔记”会被原插件拒绝，不能把它当作新站可用功能。需要下一阶段同时适配插件白名单、网页回跳路径和回跳解析。
- 临时配置方法仍保留：在原站导出分类，在新站导入；或在 Obsidian 命令面板运行“选择已有笔记并导出配置”，在二级分类中展开“兼容旧插件：粘贴配置”粘贴。现有 `grace-append` 写入协议与域名无关，不受上述返回限制，但真实设备仍需验证。
- **不等于历史迁移版。** 新域名不能读取旧 Sites 的 IndexedDB；现有配置导出不含历史/草稿。不要删除旧 PWA、清理旧站数据或把分类导出当完整备份。
- IndexedDB 名称和结构保持原样。如果同一个 `<用户名>.github.io` 域名下其他应用也使用 `grace-voice` 数据库，它们可能共享数据；路径不是数据库隔离边界。请勿在同一 origin 部署另一份同数据库名但不兼容的应用。
- GitHub Pages 不承诺中国大陆所有网络稳定免 VPN，需用实际手机流量与 Wi-Fi 测试。本轮未创建仓库、上传或发布，因此没有线上/真机验证结论。

更多检查结果见 `DEPLOYMENT-CHECKLIST.md`。
