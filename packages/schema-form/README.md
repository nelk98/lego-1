# @lego/schema-form

无 UI 的 SchemaForm 内核、React 绑定与校验接入。

core 预留值、字段状态、校验、联动、提交与订阅能力，不依赖 React、DOM、主题或平台 SDK。react 只提供框架绑定；渲染器留在 ui-admin 和 ui-client。validators 不预选校验库。

## 子路径入口

- `@lego/schema-form/core`
- `@lego/schema-form/react`
- `@lego/schema-form/validators`

不提供聚合根入口。TypeScript 入口目前仅包含空模块占位，不代表已有可调用 API；构建输出 ESM 和类型声明。

## 工程与依赖

在仓库根执行 `pnpm --filter @lego/schema-form build`、`typecheck` 或 `lint`。共享工具由根工作区提供，包内不重复安装构建依赖。

实现 React 绑定时再声明 React peer；校验器依赖按实际采用的适配器添加。纯内核不得因此加载可选依赖。

当前所有入口均未引用运行时依赖，也没有跨包实现依赖。`@lego` 只是暂定 scope；Registry、scope 和发布策略确定前保留 `private: true`，正式发布准备完成后再解除。

架构边界参见 [架构文档](../../docs/architecture.md)。
