# @lego/styles

共享设计 token、深浅主题、品牌状态色及各端样式适配。

tokens 预留基础值、语义、品牌、light / dark 和组件级 token。runtime 预留主题解析与切换；adapters 按消费端隔离。Sass 使用 CSS Variables，Tailwind 与 Sass 分开构建；Native 使用解析后的主题对象。当前未定义颜色、主题行为或框架配置。

## 子路径入口

- `@lego/styles/tokens`
- `@lego/styles/runtime`
- `@lego/styles/adapters/heroui`
- `@lego/styles/adapters/tailwind`
- `@lego/styles/adapters/unocss`
- `@lego/styles/adapters/native`

Sass 构建产物入口：

- `@lego/styles/styles.css`

不提供聚合根入口。TypeScript 入口目前仅包含空模块占位，不代表已有可调用 API；构建输出 ESM 和类型声明。

## 工程与依赖

在仓库根执行 `pnpm --filter @lego/styles build`、`typecheck` 或 `lint`。共享工具由根工作区提供，包内不重复安装构建依赖。

实现适配器时再声明对应框架的 peer；当前不安装 HeroUI、Tailwind、UnoCSS 或 Native 运行时。

当前所有入口均未引用运行时依赖，也没有跨包实现依赖。`@lego` 只是暂定 scope；Registry、scope 和发布策略确定前保留 `private: true`，正式发布准备完成后再解除。

架构边界参见 [架构文档](../../docs/architecture.md)。
