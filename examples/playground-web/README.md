# Web Playground

本仓库的 Web 调试与交互示例，使用 React 19、Vite 8、TypeScript 和 Sass。三个 HTML 入口位于同一个私有工作区：总览、B 端订单管理、C 端手机 H5。

## 启动

在仓库根目录执行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开以下地址，页面顶部可相互切换：

| 页面            | 开发地址                          |
| --------------- | --------------------------------- |
| Playground 总览 | http://127.0.0.1:5173/            |
| B 端订单管理    | http://127.0.0.1:5173/admin.html  |
| C 端手机 H5     | http://127.0.0.1:5173/client.html |

端口被占用时直接报错，不自动切换端口。开发服务只监听本机。

`pnpm dev` 由 Turbo 先构建六个依赖包，再启动 Vite；Turbo watch 负责公共包源码变化后的重建，Vite 负责页面热更新。包的新增导出或依赖变更后建议重启。不要使用指向其他包 `src` 的 alias 绕开构建。

生产构建与预览：

```sh
pnpm build:playground
pnpm preview:playground
```

构建输出为 `examples/playground-web/dist`，包含三个 HTML 入口。预览地址为 http://127.0.0.1:4173，B / C 页面路径仍为 `/admin.html` 和 `/client.html`。预览不会自动构建，修改后需先重新构建。

## 当前内容

- 总览：实际导入六包的 Web / 纯逻辑公共入口，显示导出数量。
- 主题、SchemaForm、管理端 UI、客户端 UI：预留调试入口，说明后续接入职责。
- 通过公共 CSS 子路径加载 styles、ui-admin 和 ui-client/web 的构建产物。
- B 端：HeroUI 3.2.6 + Tailwind CSS 4.3.3 + Sass，展示订单搜索、状态筛选、新建订单校验和详情。
- C 端 H5：以 430px 以内的手机界面为主，桌面居中预览；自建 React 组件 + UnoCSS 66.11（preset-mini）+ Sass，使用原创 SVG 商品插画，支持分类、搜索、收藏、购物袋增减与移除、模拟结算。
- B 端与 H5 页面提供浅色、深色切换，并共用本地主题偏好；存储不可用时仍可在当前页面切换。

订单、收藏、购物袋等数据只在各自页面内存中保存，刷新后重置；模拟结算不提交真实订单或发起支付。页面使用局部 React 状态，尚未接入 Zustand、TanStack Query 或 SchemaForm。

当前公共包的入口和 CSS 仍为空占位，因此“入口已接通”只表示模块路径可消费，不表示功能可用。示例的 UI、CSS Variables 和主题切换均位于 Playground 内，后续随公共模块实现逐步替换。

## 样式与运行边界

每个 HTML 使用独立模块和样式入口。B 端只加载 Tailwind / HeroUI，C 端 H5 只加载 UnoCSS；两套原子样式不进入同一个页面。Sass 独立处理手写样式，不导入 Tailwind 指令，也不使用 CSS Modules。

多个入口共用一个开发服务器和依赖安装范围，不代表客户端的独立应用需要 HeroUI。正式业务应用和公共包需按实际导入声明各自依赖。

不导入 Native、小程序和 Electron 宿主入口。iOS / Android 使用 [Native 示例](../playground-native/README.md)，微信小程序使用 [Mini 示例](../playground-mini/README.md)；Web Playground 不代替对应端侧验证。

## 后续添加示例

Playground 保持 TypeScript `strict` 和完整声明检查；由于当前 HeroUI / React Aria 声明的可选属性不兼容 `exactOptionalPropertyTypes`，仅在此应用关闭该额外选项。六个公共包仍使用原有严格配置，未开启 `skipLibCheck`。

根 `package.json` 的 `pnpm.packageExtensions` 为当前 HeroUI、React Aria / Spectrum、React Stately、React Types Shared 与 input-otp 补充缺失的可选 `@types/react` peer。这样 Web 使用本工作区的 React 19 类型，小程序仍使用其 React 18 类型，避免第三方声明从提升目录意外取到另一端的类型。扩展限定到当前版本，升级对应依赖时应重新检查并移除已由上游修复的条目。

Vite React 插件的可选类型引用还会解析 Native 工具链安装的 `babel-plugin-react-compiler@1.0.0`。该版本的声明引用了未声明的 Babel 类型与 Zod 4，因此通过同一 `packageExtensions` 补齐；`patches/babel-plugin-react-compiler@1.0.0.patch` 仅显式导入 `node:perf_hooks` 的 `PerformanceMeasure` 类型。此修复不修改编译器运行时代码，也不在 Web 启用 React Compiler。完整声明检查用于持续验证这些兼容补丁。

1. 在公共包实现能力并声明实际依赖，维护 `exports` 和 `sideEffects`。
2. 在对应页面通过公开子路径接入最小可交互示例。
3. 覆盖基本状态、异常状态和键盘操作；主题与组件接入后再添加视觉回归。
4. 执行 `pnpm check:ci`，同时验证开发联动和生产预览。

工具链依据：[Vite 环境要求](https://vite.dev/guide/)、[Vite monorepo 依赖处理](https://vite.dev/guide/dep-pre-bundling)、[Turbo watch](https://turborepo.dev/docs/reference/watch)。
