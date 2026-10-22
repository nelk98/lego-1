# @lego/ui-admin

HeroUI 封装、管理端布局与 SchemaForm 渲染器。

管理端计划采用 HeroUI + Tailwind，复杂手写样式使用 Sass。组件消费 styles 的语义 token；SchemaForm 渲染器消费无 UI 内核。此处只建立目录，没有组件、布局或第三方 UI 集成。

## 子路径入口

- `@lego/ui-admin/components`
- `@lego/ui-admin/layouts`
- `@lego/ui-admin/schema-form`

Sass 构建产物入口：

- `@lego/ui-admin/styles.css`

不提供聚合根入口。TypeScript 入口目前仅包含空模块占位，不代表已有可调用 API；构建输出 ESM 和类型声明。

## 工程与依赖

在仓库根执行 `pnpm --filter @lego/ui-admin build`、`typecheck` 或 `lint`。共享工具由根工作区提供，包内不重复安装构建依赖。

实现时根据兼容矩阵声明 React、HeroUI 等 peer。不要让这些依赖进入客户端或纯逻辑入口。

当前所有入口均未引用运行时依赖，也没有跨包实现依赖。`@lego` 只是暂定 scope；Registry、scope 和发布策略确定前保留 `private: true`，正式发布准备完成后再解除。

架构边界参见 [架构文档](../../docs/architecture.md)。
