# 各端 Playground

C 端以手机为使用场景，覆盖 iOS、Android、小程序和 H5；B 端当前提供 Web 后台，桌面宿主后续接入。三个私有示例应用不改变六个公共包的划分。

| 应用                                             | 运行目标                            | 启动                                                  |
| ------------------------------------------------ | ----------------------------------- | ----------------------------------------------------- |
| [Web Playground](playground-web/README.md)       | 总览、B 端 HeroUI 后台、C 端手机 H5 | `pnpm dev`                                            |
| [Native Playground](playground-native/README.md) | Expo / React Native，iOS 与 Android | `pnpm dev:native`、`pnpm dev:ios`、`pnpm dev:android` |
| [Mini Playground](playground-mini/README.md)     | Taro 微信小程序                     | `pnpm dev:mini` 后用微信开发者工具打开项目            |

H5 在桌面居中展示手机预览。原生页面使用 React Native 基础组件，小程序使用 Taro 基础组件，均不使用第三方 UI 组件库；三者按各自的宿主独立渲染和构建。

示例以商品浏览、搜索、收藏、购物袋和模拟订单验证交互；业务数据仅在本地内存中，刷新 / 重启即重置，不发起支付。H5 与小程序分别保存本端主题偏好，Native 主题暂为内存状态。当前三个 C 端示例的局部状态、主题和数据各自定义，后续再通过 core、styles、platform、ui-client 的公共能力统一；SchemaForm 和共享状态管理仍是占位。

Web 构建、Native JS 导出和小程序编译用于检查对应工具链。原生页面需要在匹配 SDK 的 Expo Go 或模拟器中运行，小程序需要在微信开发者工具中运行；配置和编译产物本身不代表宿主运行已通过。原生安装包、签名、真机兼容性与小程序发布需要另行验证。`pnpm verify:pack` 继续用独立临时消费者检查六个公共包的归档，不能替代端侧运行验证。
