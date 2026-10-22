# @lego/platform

环境配置、平台能力契约与各运行环境的独立适配入口。

contracts 与 env 保持无宿主依赖。Web、Native、小程序与 Electron main / preload / renderer 独立导出；应用入口选择并注入平台能力，不在公共入口中导入所有平台 SDK。

## 子路径入口

- `@lego/platform/contracts`
- `@lego/platform/env`
- `@lego/platform/web`
- `@lego/platform/desktop/main`
- `@lego/platform/desktop/preload`
- `@lego/platform/desktop/renderer`
- `@lego/platform/native`
- `@lego/platform/mini`

不提供聚合根入口。TypeScript 入口目前仅包含空模块占位，不代表已有可调用 API；构建输出 ESM 和类型声明。

## 工程与依赖

在仓库根执行 `pnpm --filter @lego/platform build`、`typecheck` 或 `lint`。共享工具由根工作区提供，包内不重复安装构建依赖。

未来仅在使用相应适配器时添加 Electron、React Native、Expo、Taro 等依赖声明，并验证可选 peer 与目标工具链解析行为。

当前所有入口均未引用运行时依赖，也没有跨包实现依赖。`@lego` 只是暂定 scope；Registry、scope 和发布策略确定前保留 `private: true`，正式发布准备完成后再解除。

架构边界参见 [架构文档](../../docs/architecture.md)。
