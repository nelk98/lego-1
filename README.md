# Lego

供独立业务仓库消费的多端基础设施 monorepo，覆盖 Web / 桌面后台、原生客户端、小程序和 H5。架构基线见 [架构文档](docs/architecture.md)。

当前包含工程骨架、Web Playground、B 端订单管理，以及面向 iOS / Android、小程序、H5 的 C 端移动示例。六个公共包提供目录、独立入口、ESM 库构建和归档检查；请求、会话、状态管理、SchemaForm、共享主题 token 和 UI 包仍未实现。示例中的页面、局部主题变量和交互暂时留在 examples 内。

## 环境与启动

- Node.js：使用 `.node-version` 指定的 22.13.0。
- pnpm：10.2.0，与根 `package.json` 的 `packageManager` 保持一致。
- 提交并使用 `pnpm-lock.yaml`；CI 和复现构建使用冻结锁文件安装。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

启动后打开：

| 页面       | 地址                              | 内容                                   |
| ---------- | --------------------------------- | -------------------------------------- |
| Playground | http://127.0.0.1:5173/            | 六包入口总览及模块调试入口             |
| B 端示例   | http://127.0.0.1:5173/admin.html  | 订单搜索、状态筛选、新建校验与详情     |
| C 端 H5    | http://127.0.0.1:5173/client.html | 商品分类与搜索、收藏、购物袋和模拟结算 |

初次启动会先构建六包，公共包源码修改后自动重建，页面由 Vite 更新。完整校验运行 `pnpm check:ci`。

B 端 Web 使用 HeroUI + Tailwind CSS + Sass，C 端 H5 使用自建 React 组件 + UnoCSS + Sass。三个 Web 页面使用独立 HTML 和样式入口；B 端与 H5 示例支持浅色、深色切换，共用本地主题偏好。示例业务数据只在页面内存中保存，刷新即重置。C 端 H5 是手机布局，桌面展示居中的移动预览。iOS / Android 使用独立 Expo / React Native 示例，小程序使用独立 Taro 示例。Zustand、TanStack Query 和 Electron 随对应公共模块或端侧应用接入。参见 [Web Playground 使用说明](examples/playground-web/README.md)。

原生与小程序的启动条件及操作见 [Native 示例](examples/playground-native/README.md)和[微信小程序示例](examples/playground-mini/README.md)。各应用独立锁定兼容的 React 版本。原生示例需使用匹配 SDK 的 Expo Go 或已配置的模拟器；小程序需通过微信开发者工具运行。依赖安装、JS 导出和小程序编译均不能替代这些宿主中的运行验证。

## 目录

| 目录                         | 职责                                               |
| ---------------------------- | -------------------------------------------------- |
| `packages/core`              | 请求、会话、权限、状态及查询等通用逻辑             |
| `packages/platform`          | 平台契约、环境配置及 Web、桌面、Native、小程序适配 |
| `packages/schema-form`       | 无 UI 内核、React 绑定与校验适配                   |
| `packages/styles`            | 设计 token、主题、平台输出和 Sass 工具             |
| `packages/ui-admin`          | 后续 HeroUI 封装、布局与管理端表单渲染             |
| `packages/ui-client`         | 后续 Web、Native、小程序自建组件与表单渲染         |
| `tooling`                    | 共享 TypeScript、lint 和库构建规范                 |
| `examples/playground-web`    | Web 调试入口、B 端订单及 C 端手机 H5 示例          |
| `examples/playground-native` | Expo / React Native 的 iOS、Android 手机示例       |
| `examples/playground-mini`   | Taro 微信小程序手机示例                            |
| `examples`                   | 各端独立的私有集成验证应用，不新增公共包           |
| `templates`                  | 后续业务应用初始化模板                             |
| `docs`                       | 架构与工程决策                                     |

首期用目录和子路径划分模块，不按每项能力拆包。`@lego/*` 是暂定 scope；当前六包均为 `private: true`、`0.0.0`，尚未连接发布 Registry。

## 常用命令

| 命令                      | 用途                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `pnpm dev`                | 构建并监听公共包，启动 Web Playground                          |
| `pnpm build`              | 构建六包、Web、原生 JS 资源和微信小程序                        |
| `pnpm dev:native`         | 启动 Expo Metro，端口 8081                                     |
| `pnpm dev:ios`            | 启动 Expo 并尝试打开已配置的 iOS 模拟器                        |
| `pnpm dev:android`        | 启动 Expo 并尝试打开已配置的 Android 模拟器                    |
| `pnpm dev:mini`           | 监听构建微信小程序                                             |
| `pnpm build:native`       | 导出 iOS / Android JS 与资源，不生成安装包                     |
| `pnpm build:mini`         | 生产构建微信小程序                                             |
| `pnpm build:playground`   | 构建 Playground 及其依赖                                       |
| `pnpm preview:playground` | 本地预览已构建的 Playground，端口 4173                         |
| `pnpm typecheck`          | 检查 TypeScript 类型                                           |
| `pnpm lint`               | 检查代码规范与约定的依赖边界                                   |
| `pnpm format`             | 格式化受管理文件                                               |
| `pnpm format:check`       | 检查格式，不修改文件                                           |
| `pnpm clean`              | 清理各包构建产物                                               |
| `pnpm check`              | 顺序执行格式、lint、类型、构建及包产物检查                     |
| `pnpm verify:packages`    | 检查包的导出与产物；需已有构建产物                             |
| `pnpm verify:pack`        | 构建并打包六包，在临时消费者中安装归档，验证入口导入和类型解析 |
| `pnpm changeset`          | 创建后续版本变更记录                                           |

暂不引入测试框架，也没有包功能测试；当前检查针对工程配置、各示例编译和六包归档消费能力。模拟器、真机和微信开发者工具中的交互仍需分别验证。实现公共功能时再添加相应的单元测试与端侧验证。

## 包与依赖约定

- 通过各包 `exports` 中的明确子路径消费模块；不建立聚合所有平台的根入口，不引用其他包的私有 `src` 路径。
- 新增跨包导入时，在消费包中声明对应的 `workspace:*` 依赖，让包管理和 Turbo 获取真实依赖图。
- 使用 `import type` 表达类型依赖；NodeNext ESM 的相对导入使用输出文件扩展名，例如源文件中写 `./helper.js`。
- 公共包当前没有运行时功能依赖，React、HeroUI、React Native 和 Taro 等页面依赖按应用分别安装。公共包首次接入 React、平台 SDK 或 UI / 状态库时，再按实际入口声明 dependency 或 peer dependency，验证最终消费者依赖解析。
- 纯逻辑不得直接访问 DOM、Node、Native 或小程序全局；平台功能通过契约与独立入口接入。
- 手写样式使用 Sass，不使用 CSS Modules。B 端示例只加载 Tailwind / HeroUI，C 端 H5 只加载 UnoCSS；Native 使用 StyleSheet，小程序使用 Sass；公共样式包的 token 和端侧适配仍待实现。样式相关包保留必要样式副作用；新增初始化或注册副作用时重新检查 `sideEffects`。

## 构建与交付边界

公共包构建使用 TypeScript NodeNext 编译，保留 ESM 模块和独立入口；Web 示例使用 Vite，原生示例使用 Metro / Expo 导出 JS 与资源，小程序使用 Taro 编译微信小程序产物。当前公共模块仍是占位，尚未证明实际功能的 tree shaking 效果或各端运行时兼容性。原生导出不生成 `.ipa` / `.apk`，小程序编译不执行上传发布。详见 [构建说明](tooling/build/README.md)。

Tailwind / HeroUI 与 UnoCSS 已在 Web Playground 的 B 端与 H5 页面分别接入，Sass 与 Tailwind 保持独立入口。原生页面使用 StyleSheet，小程序页面当前使用 Sass，UnoCSS 小程序适配仍待接入与验证。共享主题 token 生成、公共 UI 封装、可复用的工具链预设与 Electron 应用仍在后续范围。当前 Vite、Metro / Expo、Taro 配置服务各自示例，示例中的主题切换不代表公共主题体系已完成。

Changesets 已建立版本管理配置，使用 restricted 访问策略；私有包允许版本更新但不打 tag。当前没有发布命令和 Registry 配置。正式发布前必须确定 scope、Registry、权限与可发布包，再调整包的 private 状态。`pnpm pack` 仅验证本地归档，不会发布包。
