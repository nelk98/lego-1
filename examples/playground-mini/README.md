# 微信小程序 Playground

这是 C 端移动应用的微信小程序示例，使用 Taro 4.3、React 18 和 Sass，由 `View`、`Text`、`Input`、`Button`、`ScrollView` 等平台基础组件组合界面，没有第三方 UI 组件库。它不是把桌面商城缩小后嵌入 WebView；构建产物是微信小程序的 `app.json`、WXML、WXSS 和 JS。

示例包含发现页、商品搜索与分类、收藏、购物袋数量调整、移除商品、模拟下单、浅色/深色模式。商品及订单状态只在当前运行内存中保存，主题偏好使用 Taro 存储 API 保存；没有后端、真实支付或物流。插画由本地样式绘制，不请求外部图片。

## 本地运行

在仓库根目录安装依赖后执行：

```sh
pnpm --filter @lego/playground-mini dev
```

在微信开发者工具中导入 `examples/playground-mini` 项目目录。根目录的 `project.config.json` 将 `miniprogramRoot` 指向生成的 `dist/`；也可在工具中直接选择编译产物 `dist/`。编译任务保持 watch 后，修改源码会重新生成小程序文件。

配置使用 `touristappid` 占位，仅供本地无账号演示；若当前开发者工具要求 AppID，使用你自己的测试号或小程序 AppID。需要微信登录、真机调试或平台服务时，按开发者工具要求配置合法的 AppID；不要提交密钥。当前页面不调用支付或账号接口。

```sh
pnpm --filter @lego/playground-mini build
pnpm --filter @lego/playground-mini typecheck
pnpm --filter @lego/playground-mini lint
```

生产编译成功只代表产物生成，通过微信开发者工具或真机运行后才能确认宿主运行效果。本包暂时只配置微信小程序；其他小程序平台需补充对应的 Taro 平台插件和宿主配置。

## 工程边界

- 与原生 iOS / Android 示例、H5 示例分别构建，避免混用 DOM、React Native 与小程序宿主组件。
- Taro 4.3 的 React peer 约束为 `^18`，本包独立锁定 React 18.3.1 和对应类型，不跟随 Web 后台的 React 19。
- Taro 的 webpack5 runner 要求 webpack 5.91.0，本包匹配该版本，暂不启用依赖预构建。runner 同时声明样式编译器 peer，本包显式安装 Less 4 和 Stylus 以满足工具链依赖；页面仍只使用 Sass。
- 根目录将 `schema-utils@^4` 固定在 4.7.0：4.8.x 新增 `webpack ^5.112.0` peer，与 Taro 的 webpack 5.91.0 约束不兼容。4.7.0 满足相关 loader / plugin 的 4.x 版本范围；升级 Taro 构建链后应重新评估并移除此 override，严格 peer 检查保持开启。
- TypeScript 配置针对 Taro 应用独立设置，保留 `strict` 与源码检查。`skipLibCheck` 用于兼容 Taro 工具链及多种宿主类型声明；公共六个包的严格配置不变。
- 主题 token 与商城状态属于本地示例，尚未接入公共 `@lego/styles`、`@lego/core`、SchemaForm 或正式状态管理模块。
- 不采用 CSS Modules。Sass 的 `px` 由 Taro 按 750 设计宽度转换为小程序适配单位，安全区使用 `env(safe-area-inset-bottom)`。

配置依据：[Taro 编译配置](https://docs.taro.zone/docs/config/)、[配置详情](https://docs.taro.zone/docs/config-detail/)、[目录结构](https://docs.taro.zone/docs/folder/)。
