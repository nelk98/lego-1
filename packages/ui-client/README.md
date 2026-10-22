# @lego/ui-client

Web、Native 与小程序自建基础组件及 SchemaForm 渲染器。

三端按子路径隔离，自建组件，不采用第三方客户端组件库。Web / 小程序使用 UnoCSS + Sass；Native 使用 StyleSheet 和主题对象，不产生 CSS。每端预留 components 与 schema-form 目录。

## 子路径入口

- `@lego/ui-client/web`
- `@lego/ui-client/native`
- `@lego/ui-client/mini`

Sass 构建产物入口：

- `@lego/ui-client/web/styles.css`
- `@lego/ui-client/mini/styles.css`

不提供聚合根入口。TypeScript 入口目前仅包含空模块占位，不代表已有可调用 API；构建输出 ESM 和类型声明。

## 工程与依赖

在仓库根执行 `pnpm --filter @lego/ui-client build`、`typecheck` 或 `lint`。共享工具由根工作区提供，包内不重复安装构建依赖。

实现时按端声明 React、React Native、Taro 等 peer，并验证可选平台依赖。客户端不依赖 HeroUI，不能设置聚合三个端的根导出。

当前所有入口均未引用运行时依赖，也没有跨包实现依赖。`@lego` 只是暂定 scope；Registry、scope 和发布策略确定前保留 `private: true`，正式发布准备完成后再解除。

架构边界参见 [架构文档](../../docs/architecture.md)。
