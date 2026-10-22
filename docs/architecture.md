# Lego 多端基础设施架构

更新日期：2026-10-23

Lego 是供独立业务仓库使用的多端研发基础设施 monorepo，覆盖 Web 管理后台、桌面管理后台、iOS / Android 客户端、小程序和 H5。它提供工程规范、平台适配、公共能力、自建组件、SchemaForm 和主题 token，通过版本化包交付给业务仓库。

本文确定架构基线及模块边界，作为工程初始化与后续实现的依据。目录树包含后续目标结构，接口示例是设计草案，不代表已实现的 API。

当前工程已建立 pnpm workspace、六包目录与占位子路径、共享规范、TypeScript ESM 库构建、独立 Sass 构建、Changesets 配置及包归档消费检查。React + Vite Web Playground 包含总览、B 端订单管理和 C 端手机 H5 三个独立 HTML 入口：B 端接入 HeroUI + Tailwind CSS，H5 采用自建组件 + UnoCSS，均配合 Sass。Web 示例提供局部交互、浅深色切换和本地主题偏好，业务数据仅存在页面内存中。另有 Expo / React Native 的 iOS、Android 示例和 Taro 微信小程序示例，各自使用平台基础组件构建移动页面。端侧配置、JS 导出和小程序编译不等于模拟器、真机或微信开发者工具中的运行验证。

六包暂为 private，尚未连接 Registry。具体平台适配、状态管理、SchemaForm、共享主题 token、公共 UI 包、应用模板和可复用的端侧构建预设均未实现；示例局部逻辑不作为这些能力的公共实现。当前范围与操作命令见[仓库说明](../README.md)、[各端 Playground](../examples/README.md)及[构建说明](../tooling/build/README.md)。

## 1 架构决策

| 事项           | 当前基线                                                                          |
| -------------- | --------------------------------------------------------------------------------- |
| 仓库关系       | 基础设施仓库与业务仓库分离，使用版本化包连接                                      |
| 主要语言与框架 | TypeScript + React 技术体系                                                       |
| 工程管理       | pnpm workspace + Turborepo                                                        |
| 包发布         | Changesets + 私有 npm Registry                                                    |
| 管理端 UI      | HeroUI + 自行封装和扩展，不采用 Ant Design                                        |
| 客户端 UI      | 基于平台基础组件自建，暂不引入第三方组件库                                        |
| 手写样式       | Sass，不采用 CSS Modules                                                          |
| 原子样式       | 后台使用 Tailwind CSS；H5 / 小程序使用 UnoCSS，每个应用默认只运行一套原子样式引擎 |
| CSS-in-JS      | 不作为必需依赖；Web 有明确需求时可选择 Emotion 替代相关组件的 Sass                |
| 公共包粒度     | 首期六个包，内部通过目录与子路径导出隔离模块                                      |
| 环境与构建     | 平台接口注入 + 构建时选择实现；静态常量仅处理局部差异，运行时查询实际能力         |
| 客户端状态     | Zustand，纯逻辑使用 vanilla store，React 绑定独立导出                             |
| 服务端状态     | TanStack Query，跨端请求与生命周期通过适配接入                                    |
| SchemaForm     | 纯 TypeScript 内核 + React 绑定 + 各端渲染器                                      |
| 主题体系       | 统一 token 源，支持浅色、深色、品牌和状态，各端分别适配                           |

“后台”在本文中指管理端界面；“原生客户端”按 React Native 构建的 iOS / Android App 规划，不代表使用 Swift / Kotlin 分别实现整套界面。服务端业务系统、数据库和云资源部署不在当前范围内。

具体依赖版本在初始化时根据 React、HeroUI、Expo、React Native、Taro 的兼容组合锁定，不统一追随各库的 latest。

## 2 仓库职责与依赖边界

### 2.1 基础设施与业务的分工

| 能力       | Lego 基础设施仓库                                             | 业务仓库                                       |
| ---------- | ------------------------------------------------------------- | ---------------------------------------------- |
| 请求       | transport 接口、超时、取消、错误模型、可配置请求策略          | 业务接口和业务 API SDK                         |
| 会话       | 会话生命周期、刷新协调、凭证存储接口                          | 登录接口、渠道登录流程、登录页面               |
| 权限       | 权限计算机制、路由接入点、展示控制                            | 角色、权限码、审批规则                         |
| 平台能力   | 网络、存储、文件、通知及宿主能力适配                          | 调用这些能力的业务流程                         |
| 环境与状态 | 配置契约、构建预设、store 与 QueryClient 工厂、恢复与清理机制 | 部署参数、业务 store、query keys、缓存失效规则 |
| UI         | 通用组件、管理端布局、基础交互                                | 商品卡片、订单表格等业务组件                   |
| SchemaForm | 表单协议、状态引擎、校验机制、渲染接入                        | 具体表单定义、业务校验器、提交处理             |
| 主题       | token 结构、默认品牌、深浅模式、平台映射                      | 产品品牌配置及必要的业务主题扩展               |
| 工程       | 可复用配置、模板、包构建和发布机制                            | 产品构建参数、部署配置、应用签名               |

订单、支付、会员、客户等领域逻辑，即使被多个端复用，也优先留在业务仓库内部共享。进入 Lego 的依据是其契约能否跨产品成立。

### 2.2 共享原则

共享数据模型、协议、平台无关逻辑和设计语义；按运行环境实现 UI 与平台能力。Web 与桌面后台可以共享大量页面，Native 与小程序优先共享逻辑及 token。

各应用入口负责组装能力。公共逻辑不直接访问 `window`、`localStorage`、`wx.*`、Electron IPC 或 Native API，而是接收平台接口与回调。

前端权限仅负责交互与展示，数据权限和租户隔离必须由服务端执行。

## 3 技术栈

| 层级或端      | 选型                                 | 说明                                                             |
| ------------- | ------------------------------------ | ---------------------------------------------------------------- |
| 公共逻辑      | TypeScript                           | 核心模块不依赖 UI 框架和特定宿主                                 |
| Web 管理后台  | React + Vite + React Router + HeroUI | 通过 ui-admin 统一主题和扩展组件                                 |
| 桌面管理后台  | Electron + 复用 Web 管理端 UI        | 主进程、preload 与 renderer 分开；只通过受控 bridge 暴露宿主能力 |
| iOS / Android | React Native + Expo                  | 使用平台基础组件自建 UI，原生能力按需接入                        |
| 小程序        | Taro + React                         | 先明确目标小程序平台，再验证能力和样式兼容性                     |
| H5            | React + Vite                         | 与小程序页面高度同构时，可采用 Taro H5                           |
| 客户端状态    | Zustand                              | 跨组件客户端状态；vanilla 与 React 接入分开                      |
| 服务端状态    | TanStack Query                       | 请求缓存、失效、刷新和 mutation；不替代 transport                |
| 工程规范      | ESLint + Prettier + TypeScript       | 按 Web、Native、库等场景共享配置                                 |
| 测试          | Vitest + Web Playwright              | 内核测试与各端集成验证分开；Native / 小程序补充真实运行环境验证  |
| 发布          | Changesets + 私有 npm Registry       | 独立业务仓库按版本消费                                           |

桌面当前按 Electron 规划。Tauri 只作为后续有明确包体或 Rust 集成需求时的备选，不同时维护两套桌面宿主。Expo 官方支持 workspace monorepo；实际项目仍需验证原生依赖版本和自动链接行为。[Expo monorepo 文档](https://docs.expo.dev/guides/monorepos/)

HeroUI v3 当前要求 React 19+ 和 Tailwind CSS v4。该要求用于管理端选型，不意味着强制所有端使用同一个 React 主版本；各应用必须保持内部 React 实例一致，公共 React 包以 peer dependencies 表达兼容范围。[HeroUI Quick Start](https://heroui.com/en/docs/react/getting-started/quick-start)

## 4 目录结构与包划分

### 4.1 基础设施仓库

```text
lego/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── http/
│   │       ├── session/
│   │       ├── access/
│   │       ├── state/          # Zustand vanilla 工厂；react/ 为可选绑定
│   │       ├── query/          # QueryClient 工厂；react/ 为可选绑定
│   │       └── utils/
│   ├── platform/
│   │   └── src/
│   │       ├── contracts/
│   │       ├── env/            # 配置类型、校验与能力描述，不直接读取宿主全局
│   │       ├── web/
│   │       ├── desktop/
│   │       │   ├── main/
│   │       │   ├── preload/
│   │       │   └── renderer/
│   │       ├── native/
│   │       └── mini/
│   ├── schema-form/
│   │   └── src/
│   │       ├── core/
│   │       ├── react/
│   │       └── validators/
│   ├── styles/
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   ├── adapters/
│   │   │   ├── runtime/
│   │   │   └── sass/
│   │   └── scripts/
│   ├── ui-admin/
│   │   └── src/
│   │       ├── components/
│   │       ├── layouts/
│   │       └── schema-form/
│   └── ui-client/
│       └── src/
│           ├── web/
│           ├── native/
│           └── mini/
├── tooling/                    # lint、tsconfig 与生成工具
│   └── build/                  # 各工具链的平台解析、常量替换及产物检查预设
├── examples/                   # 各端最小集成验证应用
│   ├── playground-web/         # Vite 多页：总览、B 端订单、手机 H5
│   │   ├── index.html
│   │   ├── admin.html          # HeroUI + Tailwind CSS + Sass
│   │   └── client.html         # 自建 React 组件 + UnoCSS + Sass
│   ├── playground-native/      # Expo / React Native：iOS + Android
│   └── playground-mini/        # Taro：微信小程序
├── templates/                  # 业务应用初始化模板，按阶段补齐
├── docs/
│   └── architecture.md
├── .changeset/
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

| 包          | 职责与边界                                                          |
| ----------- | ------------------------------------------------------------------- |
| core        | 通用请求、会话、权限、状态与查询工厂；纯逻辑与 React 绑定按入口隔离 |
| platform    | 环境配置与能力契约、各端实现；不同运行环境通过独立入口隔离          |
| schema-form | 表单内核、React 绑定与校验适配；不包含 UI 和主题依赖                |
| styles      | token、样式预设、主题解析及平台输出；不依赖 UI 组件                 |
| ui-admin    | HeroUI 封装、后台布局和管理端 SchemaForm 渲染器                     |
| ui-client   | 各端自建基础组件和客户端 SchemaForm 渲染器                          |

目录承担模块划分，package 承担依赖、构建与发布边界。首期不按每项能力拆包；当某个端需要独立版本、依赖或构建流程时再拆分。

`examples` 验证基础设施，不承载真实业务；`templates` 提供初始骨架。需要持续升级的能力必须留在依赖包中，避免依赖复制模板获得后续修复。

### 4.2 子路径导出与依赖方向

包名暂以 `@lego/*` 示意，实际发布 scope 待 Registry 配置时确定。计划提供以下独立入口：

```text
@lego/platform/contracts
@lego/platform/env
@lego/platform/web
@lego/platform/desktop/renderer
@lego/platform/native
@lego/platform/mini
@lego/core/state
@lego/core/state/react
@lego/core/query
@lego/core/query/react
@lego/schema-form/core
@lego/schema-form/react
@lego/ui-admin/schema-form
@lego/ui-client/web
@lego/ui-client/native
@lego/ui-client/mini
```

依赖规则如下：

- core 可以依赖 platform 的纯契约入口，不能依赖具体适配器。
- core/state 使用 zustand/vanilla，core/query 使用 @tanstack/query-core；React hooks 和 Provider 仅从对应 react 子路径引入。
- platform 的契约层不依赖 core；适配器实现契约，避免形成反向循环依赖。
- schema-form 内核保持平台无关，React 绑定只依赖 React 和内核。
- UI 包可以消费 core、schema-form 和 styles；应用入口负责注入具体平台实现。
- styles 的 token 数据与解析逻辑保持纯净；框架或平台相关入口分别构建。
- 不设置聚合所有端的根入口，不让 Web 解析 Native 模块，也不让客户端安装 HeroUI 作为运行依赖。

各子路径必须有明确的 `exports`、类型声明和构建入口。React、HeroUI、React Native、Taro 等按实际使用声明 peer dependencies；可选平台依赖的声明、打包排除与消费方式必须经过最小应用验证。不要仅依赖 tree shaking 来隔离运行环境，也不通过仓库别名引用其他包的私有 `src` 文件。

### 4.3 业务仓库参考结构

```text
business/
├── apps/
│   ├── admin-web/
│   ├── admin-desktop/
│   ├── native/
│   ├── miniapp/
│   └── h5/
└── packages/
    ├── api-client/              # 业务 API 与生成类型
    ├── domain/                  # 跨端领域模型和规则
    ├── features-admin/          # Web 与桌面共用管理端流程
    └── features-consumer/       # C 端共享逻辑，UI 按环境拆分
```

## 5 样式方案

### 5.1 各端分工

| 场景             | 样式方案                                       |
| ---------------- | ---------------------------------------------- |
| Web 与桌面后台   | Tailwind CSS + HeroUI；复杂自定义样式使用 Sass |
| 独立 H5          | UnoCSS + Sass                                  |
| 小程序与 Taro H5 | UnoCSS + Sass，经目标平台适配和验证            |
| React Native     | StyleSheet + 解析后的主题对象                  |

同一应用默认只使用一套原子样式引擎。UnoCSS 的类名与 Tailwind 相似，不代表其插件、主题和生成结果可以直接替换 HeroUI 所需的 Tailwind 构建链路。

当前 Web Playground 用独立 HTML 与样式入口展示两套链路，B 端页面只加载 Tailwind / HeroUI，C 端 H5 页面只加载 UnoCSS。它们共用私有示例工作区，未增加公共包，也未将 HeroUI 引入公共客户端包。独立 Native 示例使用 StyleSheet；微信小程序示例当前使用 Sass，UnoCSS 的小程序适配属于后续工作，仍须按上表目标验证。

不使用 CSS Modules。Sass 组件样式采用 `lego-` 前缀和 BEM 命名，例如 `.lego-field__label`，限制嵌套层级和覆盖范围。组件源码旁保留样式文件，公共 token、mixins 和预设放在 styles 包。

### 5.2 Tailwind 与 Sass 独立构建

Tailwind CSS v4 官方不按 Sass、Less 等预处理器链路设计。后台采用独立入口：`utilities.css` 进入 Tailwind / HeroUI 构建，`components.scss` 通过 Sass 编译，两份 CSS 由应用统一加载。[Tailwind 兼容性文档](https://tailwindcss.com/docs/compatibility)

Sass 中不导入 Tailwind、不混写 Tailwind 指令；Sass 仅消费标准 CSS Variables。项目统一约定 theme、base、components、utilities 等 CSS layer 的顺序，让组件默认样式与应用覆盖规则可预测，避免无分层的全局样式意外压过工具类。

发布组件时，手写 Sass 随包交付编译后的 CSS；原子工具类另行选择预生成 CSS 或要求消费端扫描已发布的类名来源，源码扫描不能替代 Sass 编译。后台接入文档需要说明样式导入以及 Tailwind `@source` 等配置；动态工具类使用完整类名映射，不能依赖任意字符串拼接。[Tailwind 源码扫描文档](https://tailwindcss.com/docs/detecting-classes-in-source-files)

小程序需要单独验证选择器、单位转换、预设 CSS、组件样式隔离和主题变量继承。不能将浏览器 CSS 或 CSS-in-JS 的运行机制直接视作小程序能力。

### 5.3 CSS-in-JS 的使用边界

Sass 是默认手写样式方案。需要用 props 组织复杂 Web 组件样式时，可选用 Emotion 的 styled API，替代相关组件的 Sass；不默认同时安装 Emotion 与 styled-components，也不让同一组件的主要规则分散到多套系统。

HeroUI 支持 CSS-in-JS 扩展，但该能力不改变客户端自建 UI 的约定，也不意味着 CSS-in-JS 能统一所有端。[HeroUI Styling](https://heroui.com/en/docs/react/getting-started/styling)

## 6 SchemaForm 设计

### 6.1 三层结构

| 层         | 提供能力                                     | 位置                  |
| ---------- | -------------------------------------------- | --------------------- |
| 无 UI 内核 | 值、字段状态、校验、联动、提交生命周期和订阅 | schema-form/core      |
| React 绑定 | Provider、hooks、字段订阅与生命周期衔接      | schema-form/react     |
| 平台渲染器 | 组件映射、布局、平台事件转换、错误呈现       | ui-admin 或 ui-client |

内核必须能在不加载 React、DOM、Native 或小程序运行时的情况下使用和测试。React 绑定不访问 DOM，各端仍需验证订阅与生命周期行为。

### 6.2 内核职责

- 管理 values、initialValues、dirty、touched、errors 和提交状态。
- 支持嵌套字段路径、数组操作与稳定字段身份。
- 执行同步和异步校验，支持校验触发策略与统一错误结构。
- 计算字段显隐、禁用、只读和动态必填等状态。
- 根据显式依赖执行联动，区分派生状态与写入其他字段值的动作。
- 提供 validate、reset、submit 等操作，以及字段级订阅。
- 将提交处理交给应用提供的回调，不包含业务 URL、具体接口或平台请求实现。

组件、CSS、布局、焦点、滚动、软键盘和平台事件对象由渲染器处理。内核可以返回错误字段路径或发出语义事件，由渲染器决定如何定位与展示。

### 6.3 表单定义与展示定义分离

共享 `formDefinition` 描述数据类型、默认值、校验和联动。每端 `uiSchema` 描述字段顺序、标签、widget、分组与布局。组件映射由各端 widget registry 提供。

以下为结构草案，不是已发布 API：

```ts
const formDefinition = {
  fields: {
    name: {
      type: 'string',
      initialValue: '',
      validators: [{ name: 'required' }],
    },
    quantity: {
      type: 'number',
      initialValue: 1,
      validators: [{ name: 'min', value: 1 }],
    },
  },
}

const adminUiSchema = {
  fields: [
    { path: ['name'], widget: 'text', label: '名称' },
    { path: ['quantity'], widget: 'number', label: '数量' },
  ],
}
```

共享定义不引用 HeroUI 组件、Web className 或某一端的布局参数。同一个 `select` widget 可以在后台表现为下拉框，在 Native 表现为选择页，在小程序表现为 Picker。

渲染器读取 value、errors、touched、dirty、visible、disabled、readonly、required 等状态，并将平台事件转换为 `setValue(value)`、`markTouched()` 一类语义操作。数字、日期、附件等字段的原始输入与最终业务值需要明确转换边界。

### 6.4 校验与扩展机制

第一阶段采用小型内部表单协议，不承诺完整实现 JSON Schema。JSON Schema 可以用于数据结构与部分校验，但不能独自承担完整交互、联动和布局。后续按需要增加 JSON Schema 或其他校验器适配，不同时引入多套重复规则体系。

业务校验器和联动动作通过注册表注入。若将来支持服务端下发 schema，使用 validator / action ID 引用已注册逻辑，不执行 schema 中携带的任意 JavaScript。远程定义的版本迁移和发布系统属于后续范围。

内核只维护一份表单状态，不同时与另一套表单库各自维护 values、errors 和提交状态。

SchemaForm 状态属于每个表单实例，不放进应用全局 Zustand store。内核底层是否复用 vanilla store 属于实现选择，不对外暴露任意写状态的底层 StoreApi，也不影响其纯 TypeScript 契约。

### 6.5 实现前需要明确的行为

| 场景       | 设计要求                                                                             |
| ---------- | ------------------------------------------------------------------------------------ |
| 隐藏字段   | 值保留、参与校验、参与提交分别配置；默认策略在实现内核前确定，不能从视觉隐藏直接推断 |
| 字段卸载   | 组件临时卸载与数据字段删除区分，避免换页或折叠后意外丢值                             |
| 数组操作   | 索引表示数据位置，稳定 item key 表示身份；插入、删除和排序后迁移字段状态             |
| 异步校验   | 只接受当前值对应的最新结果；取消与结果版本检查配合使用                               |
| 提交       | 针对一致的数据快照校验和提交，明确校验期间编辑及重复提交的处理                       |
| 联动       | 声明依赖、检测循环、批量更新；区分计算结果和主动写值                                 |
| 输入中间态 | 允许数字、日期等编辑过程中的暂时不完整输入，转换与最终校验分离                       |
| 服务端错误 | 允许按字段路径回填错误，和本地错误使用统一呈现接口                                   |
| 性能       | 字段级订阅；独立字段变化不要求全表单重新渲染                                         |

### 6.6 首期范围

首期支持基础字段、嵌套对象、简单数组、同步和异步校验、条件显隐与必填、基础联动、提交、重置及字段级订阅。先实现 HeroUI 管理端与一个客户端渲染器，使用同一份定义验证跨端边界。

拖拽设计器、任意表达式语言、远程 schema 编辑发布系统和复杂递归表单不进入首期。

## 7 主题与 token 体系

### 7.1 三层 token

| 层级       | 内容                                       | 示例                                                       |
| ---------- | ------------------------------------------ | ---------------------------------------------------------- |
| 基础值     | 中性色阶、品牌色阶、反馈色阶、尺寸等原始值 | palette.neutral.100、palette.brand.600、spacing.4          |
| 语义 token | 按用途描述颜色与尺寸                       | color.bg.surface、color.text.primary、color.border.default |
| 组件 token | 需要独立调整的组件参数                     | input.border.invalid、button.primary.bg.hover              |

组件优先使用语义 token，仅在需要独立控制时引入组件 token。浅色和深色模式使用相同名称，仅改变值或引用。各端不分别维护独立色表。

### 7.2 主题维度

主题配置包括以下独立维度：

- mode：light、dark、system。system 是用户偏好，实际解析结果为 light 或 dark。
- brand：默认品牌及后续产品品牌。品牌提供色板和必要的语义覆盖。
- density：comfortable、compact。首期可只实现默认档，保留扩展位置。

模式、品牌和密度独立组合，避免为每种组合复制整份 token。组合后的对比度与组件状态仍需验证。首期不锁定最终品牌色值，先定义结构和映射方式。

### 7.3 颜色与状态覆盖

| 类别       | 覆盖内容                                                   |
| ---------- | ---------------------------------------------------------- |
| 背景       | 页面、容器、浮层、弱背景、遮罩                             |
| 文本与图标 | 主要、次要、弱化、禁用、反色、链接                         |
| 边框与焦点 | 默认、弱分隔、强调、焦点环                                 |
| 品牌操作   | 主操作、次操作、弱背景、品牌前景                           |
| 反馈语义   | success、warning、danger、info                             |
| 交互状态   | default、hover、pressed、focus-visible、disabled、selected |
| 表单状态   | invalid、readonly、checked、indeterminate                  |
| 其他基础值 | 字体、字号、字重、行高、间距、圆角、阴影、层级、动效       |

品牌和反馈颜色分别定义，不将绿色品牌自动等同于成功语义。品牌色组与反馈色组按需提供 solid、onSolid、subtle、onSubtle、border；交互状态在相应动作或组件上补充 hover、pressed 等值。

solid 与 onSolid、subtle 与 onSubtle 成对定义背景和前景，不默认品牌按钮始终使用白字。深色主题需要独立设计表面层级、分隔线、焦点与阴影，不通过反转颜色生成。

禁用状态使用专用前景、背景和边框，避免只降低整个组件的透明度。错误、选中和焦点可以同时存在，组件需要明确组合规则。loading 主要控制行为、图标和动画，不强制为其增加专属颜色。

颜色与状态的映射应同时配合文案、图标和交互语义，尤其是错误与成功反馈。对比度验证覆盖实际背景、前景和状态组合。

### 7.4 styles 包内部结构

```text
packages/styles/
├── src/
│   ├── tokens/
│   │   ├── primitives.ts
│   │   ├── brands/
│   │   │   └── default.ts
│   │   ├── semantic.ts
│   │   ├── modes/
│   │   │   ├── light.ts
│   │   │   └── dark.ts
│   │   └── components/
│   ├── adapters/
│   │   ├── heroui.ts
│   │   ├── tailwind.ts
│   │   ├── unocss.ts
│   │   └── native.ts
│   ├── runtime/
│   └── sass/
└── scripts/
    └── build-tokens.ts
```

以可序列化的 TypeScript 数据作为 token 源，构建时生成各端消费格式。生成产物不手工修改。编译时检查引用、缺失值及深浅模式结构的一致性。

| 消费方             | 输出或接入方式                                                                     |
| ------------------ | ---------------------------------------------------------------------------------- |
| Sass               | 引用生成的 `--lego-*` CSS Variables；Sass 变量用于编译期工具，不承担运行时主题切换 |
| Tailwind 与 UnoCSS | 将语义工具类映射到相同 CSS Variables                                               |
| Emotion            | Web 优先引用相同 CSS Variables；需要对象时从统一源生成                             |
| HeroUI             | 通过适配层把 Lego 语义 token 映射到 HeroUI 变量                                    |
| React Native       | 输出解析后的实际颜色、数值和平台样式，不传入 CSS var 字符串                        |
| 小程序             | 根据目标平台生成变量或主题类，并验证组件作用域、继承与兼容性                       |

共享语义不意味着各端使用完全相同的单位、字体和阴影表示；这些内容由适配层转换。HeroUI 支持基于 CSS Variables 的主题配置，业务组件优先引用 Lego 的语义名称。[HeroUI Theming](https://heroui.com/en/docs/react/getting-started/theming)

### 7.5 运行时主题管理

主题运行时区分用户选择与解析后的主题，负责模式解析、主题变化订阅以及品牌切换。系统外观监听、偏好持久化和实际应用样式由平台接口或端侧适配完成。

Web 在首次绘制前应用已保存的主题；若后续引入 SSR，再统一处理服务端初始主题与 hydration。Portal 弹窗、下拉等挂载节点必须位于正确的主题作用域，局部主题需要同步到对应浮层。

Native 使用主题对象更新与系统外观订阅；小程序需要同步页面、独立组件及受平台限制的界面颜色。退出 system 模式后，系统外观变化不覆盖用户显式选择。

SchemaForm 内核不依赖 styles，只输出 invalid、disabled 等状态。渲染器把这些状态映射为各端组件和主题 token。

## 8 环境封装与构建优化

### 8.1 环境维度

环境描述分开处理构建目标、优化模式、部署配置和运行时能力，避免一个 `isWeb` 或 `isProd` 承担多种含义。

| 维度                    | 示例                                                               | 决定的行为                   |
| ----------------------- | ------------------------------------------------------------------ | ---------------------------- |
| 构建目标 buildTarget    | web、desktop-renderer、desktop-main、desktop-preload、native、mini | 选择入口、依赖和产物类型     |
| 平台细分                | native 的 iOS / Android、mini 的目标平台                           | 平台文件或具体适配实现       |
| 优化模式 buildMode      | development、production                                            | 调试分支、开发工具和优化策略 |
| 部署配置 appEnv         | local、staging、production                                         | API 地址、公开配置和部署标识 |
| 运行时能力 capabilities | 网络、权限、宿主版本、文件选择或分享是否可用                       | 实际调用方式与降级处理       |

预发布环境也可以生成经过 production 优化的构建。Vite 的 mode 与 NODE_ENV 等工具链概念由构建预设显式映射到上述维度，不能直接等同。[Vite 环境与模式文档](https://vite.dev/guide/env-and-mode)

platform/env 提供平台无关的配置类型、解析与校验；应用入口负责从当前宿主取得配置并注入。库模块不在顶层读取 `process.env`、`import.meta.env`、window 或小程序全局对象。打入客户端的配置均视为公开信息，不承担服务端密钥存储。

### 8.2 平台差异的处理顺序

| 差异                           | 采用机制                             | 示例                           |
| ------------------------------ | ------------------------------------ | ------------------------------ |
| 业务流程相同，底层 API 不同    | 共用逻辑 + 接口注入                  | 会话模块接收不同平台的凭证存储 |
| 模块实现或依赖明显不同         | 显式平台入口，或构建时解析到单个实现 | 文件选择、通知、桌面 bridge    |
| 不引入平台专属依赖的局部差异   | 静态构建常量 + 死代码消除            | 开发日志、调试面板开关         |
| 同一产物内能力因设备或权限变化 | 运行时能力查询与错误处理             | 分享可用性、摄像头授权         |

例如“保存表单草稿”的公共流程只调用注入的 storage 接口；Web、Native、小程序各自实现存储。页面和领域逻辑无需重复判断平台。运行时能力查询用于正确执行和降级，不承诺减少包体。

### 8.3 构建时选择实现

首期以应用入口显式导入 `@lego/platform/web`、`/native`、`/mini` 等子路径为基础。共享业务模块接收统一接口。需要相同 import 路径时，可以在应用或模板层设置适配器 alias，在模块依赖图建立前指向单个实现；发布库不能依赖消费方未声明的私有 alias。

conditional exports 和平台文件后缀是进一步简化接入的工具，需要逐工具链验证，不能假设一份配置自动适用于 Vite、Metro、Taro。

| 工具链       | 接入策略                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------- |
| Vite         | 使用 define、alias 与经验证的 resolve.conditions；开发、构建与测试保持解析一致                |
| Metro / Expo | 在受支持的位置使用平台文件解析或精确子路径，必要时配置 resolver；不直接套用 Vite 常量替换规则 |
| Taro         | 在 Taro 应用及适配层使用其 TARO_ENV 和多端机制，具体解析方式以锁定版本验证结果为准            |
| Electron     | main、preload、renderer 分别构建；renderer 不直接导入 Node 或主进程模块                       |

Vite 提供静态常量替换与条件导出解析配置。[Vite Shared Options](https://vite.dev/config/shared-options)

Metro 命中 package exports 后，使用指定的精确目标文件，不再为该目标自动追加 `.ios`、`.android` 或 `.native` 后缀。包入口与内部平台文件解析需分别设计。[Metro Package Exports](https://metrobundler.dev/docs/package-exports/)

### 8.4 条件编译与公开包边界

计划在 tooling/build 中统一构建参数及类型声明，再分别适配各构建工具。拟议常量可以使用 `__LEGO_TARGET__`、`__LEGO_DEV__` 等名称，但只有对应替换规则配置并验证后才可使用；它们不是平台自动提供的全局变量。

少量条件直接使用可静态替换的字面常量。将判断隐藏在普通运行时函数、动态配置对象或复杂属性访问后，不能假设构建器一定能折叠分支。

条件分支中的代码若涉及另一个平台的 SDK，应改为平台入口隔离。先静态导入所有端模块、再用 if 判断，可能在死代码消除前就触发解析失败或保留副作用。动态 import 可以延迟加载或拆分产物，也不等于彻底排除另一端依赖。

公共纯逻辑包的发布产物不残留未解析的自定义宏、Vite 专属环境访问或消费应用专属配置。平台专用入口可以遵循已文档化的目标工具链约定；纯库运行时需要的配置通过参数注入。

### 8.5 Tree shaking 与体积控制

- 纯逻辑库优先发布可静态分析的 ESM，保留独立模块或提供多入口，避免预先打成包含所有平台的单一 bundle。
- 避免模块顶层自动注册、启动监听、创建全局客户端和修改全局对象；通过显式初始化函数完成，并返回清理方式。
- 类型依赖使用 import type；平台 SDK 和 React 等运行依赖在库构建中按规则 external，并声明依赖。external 只是推迟由消费方解析，不能替代平台隔离。
- 准确声明 sideEffects。只有确实无副作用的模块可以删除；CSS、polyfill 和必要注册模块需明确保留，不能对含样式的整个包无条件标记 false。
- ui-admin 的大型扩展组件和客户端可选能力通过独立子路径消费；页面级分包采用目标平台支持的机制。

ESM 和副作用声明能帮助构建器删除无用代码；错误的 sideEffects 配置也可能删除实际需要的 CSS。[webpack Tree Shaking](https://webpack.js.org/guides/tree-shaking)

这些是可优化的包结构约定，不承诺所有工具链具有相同裁剪能力。Metro 与 Taro 的效果以最终 release 产物验证；平台入口隔离始终是基础保障。

### 8.6 构建缓存与验收

影响产物的 target、平台细分、buildMode、公开配置、静态功能开关和编译配置都纳入 Turborepo 缓存输入。不同平台使用隔离的输出目录；仅构建工具运行需要、且不影响产物的凭证不进入客户端配置。

验收从实际发布归档安装到最小应用，检查生产产物不包含其他平台 SDK、开发分支及未替换宏，样式和必要副作用仍然存在。为各端建立模块清单和体积基线；修改入口、条件或构建配置后重新比较，而非仅检查开发模式能否运行。

## 9 状态管理

### 9.1 选型与状态所有权

新增状态管理基线为 Zustand + TanStack Query。两者分别管理客户端状态与服务端资源，SchemaForm 继续拥有独立表单状态；不引入一个覆盖所有状态的大型全局 store。

| 状态类型             | 管理方式                    | 示例                                   |
| -------------------- | --------------------------- | -------------------------------------- |
| 组件局部状态         | React useState / useReducer | 弹窗开关、临时选中、局部交互           |
| 跨组件客户端状态     | Zustand                     | 工作区选择、跨页面流程、布局偏好       |
| 服务端资源与请求缓存 | TanStack Query              | 列表、详情、分页请求、更新后的缓存失效 |
| 表单编辑状态         | SchemaForm 实例             | values、errors、touched、submitting    |
| 可分享的导航参数     | 各端路由状态                | 页面筛选、排序、页码及深链接参数       |
| 主题偏好和解析主题   | styles/runtime              | mode、brand、resolvedMode              |
| 会话状态与凭证       | core/session                | 身份状态、凭证生命周期、刷新协调       |

同一份可变状态只设一个所有者。请求结果不长期复制到 Zustand；主题和会话可在内部使用 vanilla store，但应用不再维护另一份同名状态。SchemaForm 在编辑开始时建立草稿，后续服务端刷新是否覆盖草稿由业务明确决定，不做双向自动同步。

### 9.2 Zustand 的封装边界

core/state 提供轻量的 store 工厂、选择器使用约定及持久化接入点；实际业务 store 留在业务仓库。使用 `zustand/vanilla` 保持非 UI 部分独立，hooks 从 core/state/react 单独导出。Zustand 的 createStore 提供普通 store API，可供 React 之外的逻辑订阅。[Zustand createStore](https://zustand.docs.pmnd.rs/reference/apis/create-store.html)

不把 Zustand 的所有 API 重新包装成另一套框架。封装集中在应用实例生命周期、存储适配、退出清理和工程约定；组件使用选择器订阅所需切片，避免无差别订阅整个 store。

store 由应用创建并注入，禁止包导入时建立共享业务单例。桌面不同窗口和进程各有自己的内存状态，需要同步时通过明确定义的 bridge 消息完成；不能假设同一个模块意味着共享内存。若后续加入 SSR，则按请求创建实例，避免用户之间共享状态。

### 9.3 TanStack Query 的封装边界

core/query 基于 `@tanstack/query-core` 提供 QueryClient 工厂和通用配置；core/query/react 单独提供 React Provider 接入，业务可使用原生 query hooks。React 绑定与 query-core 锁定匹配版本，确保应用解析到同一份 query-core 模块和同一客户端实例，避免 focusManager、onlineManager 分裂。Provider 与业务 hooks 使用同一份 `@tanstack/react-query`，库构建不内嵌其副本，也不把 hooks 强行藏在通用请求函数之后。

业务仓库定义 query keys、queryFn、mutationFn、失效规则和乐观更新。Query 层调用业务 API，业务 API 再通过 core/http 与平台 transport 执行请求。Query 管理缓存和请求生命周期，http 管理传输、错误归一化及会话接入。

需要区分两层重试职责，避免 Query 与 http 的自动重试相乘；默认不自动重试非幂等 mutation，会话刷新协调保持单一入口。QueryClient 通过工厂按应用或隔离上下文创建，不在公共模块顶层建立全局实例。

| 跨端适配点     | 处理方式                                                                            |
| -------------- | ----------------------------------------------------------------------------------- |
| 网络请求与取消 | queryFn 使用统一业务 API；平台 transport 将取消语义映射到实际请求，声明不支持的能力 |
| 应用前后台     | Web、Native、小程序分别接入应用生命周期，不假设都存在 window                        |
| 网络恢复       | 将平台网络状态接入 onlineManager，明确初始状态及事件解绑                            |
| 焦点与页面恢复 | 应用前后台接入 focusManager；页面重新出现是否刷新由业务策略决定                     |
| 缓存持久化     | 按需启用，与普通 store 持久化分开配置，不默认持久化所有接口数据                     |

TanStack Query 的 React Native 接入需要为网络恢复和应用焦点行为配置对应平台事件。[TanStack Query React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)

Taro 小程序计划通过其生命周期和网络事件接入；React hooks、订阅、取消与打包行为需在锁定的 Taro 版本上验证，不将“使用 React”视为自动兼容的证明。

### 9.4 持久化与会话隔离

持久化通过 platform 存储接口注入，避免公共 store 默认绑定 localStorage。只保存白名单字段，配置版本与迁移，并暴露恢复就绪状态。异步存储恢复未完成时，不把默认值当成已恢复的用户选择，也不提前覆盖旧数据。[Zustand 持久化文档](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data)

凭证由 session 的独立存储策略处理，不混入普通偏好持久化或调试状态。当前用户的服务端资料由 Query cache 管理，会话模块只保存必要的身份与生命周期信息。

账户和租户相关的 query keys、持久化 key 明确隔离维度。退出、换账号或切换租户时，协调取消旧请求、清理相关缓存、重置业务 store，防止旧请求结果或旧持久化数据进入新会话。全局网络和前后台监听在应用启动时集中安装，并明确所有者和清理时机。

会话切换维护身份作用域或代际标识。不支持取消的请求、未完成的持久化恢复和后台写入，在应用结果前检查其仍属于当前作用域。切换时处理对应持久化数据与会话订阅，避免已退出账户的数据被迟到写入重新保存；应用级网络监听不因切换而重复安装。

## 10 跨仓库交付

仓库内部通过 workspace 依赖协作，业务仓库通过私有 Registry 安装发布版本并提交 lockfile。联调使用预发布版本或包归档产物，避免长期依赖本机路径。

Changesets 管理版本变化与发布说明；公共接口发生破坏性变化时提供迁移说明。Turborepo 调度构建、检查和测试，不能替代平台工具链、应用签名与安装包发布流程。[Turborepo 包发布文档](https://turborepo.dev/docs/guides/publishing-libraries)

可发布包需要稳定入口、类型声明和明确的样式交付方式。原生相关包可能需要同时发布源码或平台文件，不能把所有包强行打成同一种 JS 产物。

CI 验证实际打包产物在独立消费应用中可安装、可编译，覆盖遗漏文件、未声明依赖、CSS 缺失和错误平台依赖等问题。Registry 产品、CI 平台、包 scope 与凭证配置在工程初始化阶段确定。

## 11 分阶段落地与验收

### 11.1 第一阶段

建立 workspace、基础规范和包发布链路；实现最小平台接口、环境与构建预设、请求与会话能力；接入 Zustand 与 Query 工厂及状态隔离约定；建立 token 源和默认品牌的 light / dark 模式；实现 SchemaForm MVP 与最小管理端示例。

并行验证 Native 和小程序对公共包的导入、请求、会话及主题消费能力。SchemaForm 选择一个客户端完成第二个渲染器，不要求首期同时实现所有端的完整组件库。

### 11.2 核心验收场景

| 对象       | 验收重点                                                                     |
| ---------- | ---------------------------------------------------------------------------- |
| 包边界     | 导入纯内核不加载 React 或平台 SDK；各端只解析自身依赖                        |
| 环境与构建 | 相同接口解析到目标实现，生产产物排除其他平台依赖和调试分支，缓存不串目标     |
| 状态管理   | store 与 QueryClient 生命周期隔离、异步恢复正确、会话切换后旧结果不回流      |
| 发布产物   | 独立业务示例可安装并构建，组件样式完整                                       |
| SchemaForm | 同一份定义在后台和一个客户端运行，覆盖条件字段、数组明细、异步校验与提交     |
| 字段行为   | 隐藏策略、数组重排、异步竞态、输入转换和服务端错误符合约定                   |
| 主题       | Button、Input、Panel 和反馈提示在浅色与深色下保持可读，覆盖主要交互状态      |
| 主题运行时 | 切换、持久化、跟随系统、浮层作用域及首屏主题正确                             |
| 样式链路   | Tailwind / HeroUI 与 Sass 独立构建后覆盖顺序稳定，小程序样式满足目标平台限制 |

后续阶段补齐桌面宿主能力、更多客户端组件和渲染器、应用模板与产品品牌扩展。公共组件从真实业务重复需求中提取，避免首期预建完整组件体系。

## 12 落地前待确定事项

以下事项不改变当前架构基线，但需要在对应模块实现前确定或验证：

| 事项            | 需要确定的内容                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------- |
| 版本组合        | Node、pnpm、React、HeroUI、Expo、React Native、Taro 与构建工具兼容范围                          |
| 目标平台        | 桌面操作系统、移动系统最低版本、具体小程序平台与 H5 浏览器范围                                  |
| 构建适配        | 各工具链常量替换、平台文件和 exports 的解析顺序、公开配置注入、tree shaking 产物与缓存输入      |
| 状态管理        | Zustand 与 TanStack Query 版本组合、Taro 原型、缓存时效与重试策略、持久化恢复及账号租户切换流程 |
| 桌面能力        | 打印、外设、文件、更新等真实需求及 Electron 原型验证                                            |
| H5 形态         | 独立 React H5 与 Taro H5 的业务划分，有无 SEO / SSR 需求                                        |
| SchemaForm 协议 | 字段路径与错误结构、隐藏字段默认策略、输入转换、提交期间编辑行为及校验适配器                    |
| 品牌视觉        | 默认品牌色阶、字体、尺寸、深浅主题具体值及对比度验证                                            |
| 样式交付        | Sass 产物的导入方式、工具类预生成或消费端扫描的具体约定，以及 CSS layers 集成验证               |
| 发布设施        | 私有 Registry、包 scope、CI 平台和发布权限                                                      |

后续新增决策更新本文；影响包边界、核心协议或平台路线的变更，另行记录架构决策及迁移影响。
