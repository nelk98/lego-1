# 版本管理

使用 `pnpm changeset` 记录包的变化，使用 `pnpm changeset:version` 更新版本与 changelog。

六个包当前为 private，占位 scope 为 `@lego`。Registry 与正式 scope 确定、首批功能可交付后再调整发布配置。本仓库没有自动发布任务，初始化不执行版本更新或发布。

Changesets 的分支比较以 `main` 为基线；使用前应确保该分支已存在并同步到本地。
