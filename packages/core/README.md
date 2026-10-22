# @lego/core

平台无关公共逻辑、客户端状态与服务端状态接入。

请求、会话和权限等流程只依赖纯契约及注入的能力。未来 state 使用 Zustand vanilla，query 使用 TanStack Query core；React 绑定只从各自的 react 子路径导出。禁止依赖具体平台实现或 UI 包。

## 子路径入口

- `@lego/core/http`
- `@lego/core/session`
- `@lego/core/access`
- `@lego/core/utils`
- `@lego/core/state`
- `@lego/core/state/react`
- `@lego/core/query`
- `@lego/core/query/react`

不提供聚合根入口。TypeScript 入口目前仅包含空模块占位，不代表已有可调用 API；构建输出 ESM 和类型声明。

## 工程与依赖

在仓库根执行 `pnpm --filter @lego/core build`、`typecheck` 或 `lint`。共享工具由根工作区提供，包内不重复安装构建依赖。

未来按真实导入添加 Zustand、TanStack Query 与 React 依赖；React 绑定保持可选，不通过根入口引入。

当前所有入口均未引用运行时依赖，也没有跨包实现依赖。`@lego` 只是暂定 scope；Registry、scope 和发布策略确定前保留 `private: true`，正式发布准备完成后再解除。

架构边界参见 [架构文档](../../docs/architecture.md)。
