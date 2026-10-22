# 拾物 Native Playground

真正使用 React Native 原生视图的移动端示例，目标为 **iOS / Android**。不把浏览器中的手机尺寸页面当作原生 App；H5 与小程序分别由其他 Playground 验证。

## 技术与范围

- Expo 58.0.17 + React Native 0.88.0 + React 19.3.0，使用 Expo 官方模板和 `bundledNativeModules.json` 对应的版本组合。
- 显式锁定 `react-dom@19.3.0`，使 Expo 工具链的可选 Web peer 与此应用的 React 版本一致，避免 pnpm 复用后台的 `react-dom@19.3.1` 导致严格 peer 检查失败。当前原生入口不导入 React DOM，也没有启用 React Native Web。
- `View`、`Text`、`Pressable`、`TextInput`、`ScrollView`、`Modal` 自建界面，`StyleSheet` 定义原生样式，不使用第三方组件库。
- `react-native-safe-area-context` 仅负责刘海屏、状态栏及底部手势区安全距离。
- 商品搜索、分类、收藏、购物袋增减与移除、金额计算、模拟下单、深浅色切换。
- 商品插画由原生 View 几何图形绘制，无远程图片依赖。
- 商品、订单、主题和购物袋均为示例内存状态；重启后重置。没有登录、接口、支付或发货。
- 这里的局部状态和颜色对象用于验证端侧交互，尚未实现公共六包中的状态封装、共享 token 或 SchemaForm。

原生样式使用实际颜色和数值，不能直接复用 Web 的 CSS 变量、Sass 或 UnoCSS 类名。未来从 `@lego/styles` 主题源生成原生主题对象，再通过 `@lego/ui-client/native` 封装可复用组件。

## 启动

在仓库根目录执行：

```sh
pnpm install
pnpm --filter @lego/playground-native dev
```

Metro 端口为 `8081`，默认通过本机局域网地址提供 bundle。用支持此 SDK 的 Expo Go 打开终端二维码；手机与开发机需要能互相访问。Expo Go 的版本必须与 Expo SDK 相匹配。

### 手动下载 Expo Go

SDK 58 当前对应 Expo Go **58.0.5**。本次环境准备时，官方大文件下载超时，尚未安装 Expo Go；可手动下载后安装到对应模拟器：

- [iOS Simulator 安装包（`.tar.gz`，约 148 MiB）](https://github.com/expo/expo-go-releases/releases/download/Expo-Go-58.0.5/Expo-Go-58.0.5.tar.gz)，解压后安装其中的 `.app`；此包不用于 iPhone 真机。
- [Android 安装包（`.apk`，约 215 MiB）](https://github.com/expo/expo-go-releases/releases/download/Expo-Go-58.0.5/Expo-Go-58.0.5.apk)，可安装到 Android 模拟器或设备。

安装 JavaScript 依赖、启动 Metro 和执行下述 bundle 导出均不需要 Expo Go；使用本示例的 `ios` / `android` 命令在模拟器中打开界面需要安装配套 Expo Go。开发构建是另一条原生运行路径，不包含在这里的 JS 导出步骤中。

已安装对应开发环境时，也可直接打开模拟器：

```sh
# macOS、Xcode 与已安装的 iOS Simulator runtime
pnpm --filter @lego/playground-native ios

# Android Studio、Android SDK、Java 与已创建的 AVD
pnpm --filter @lego/playground-native android
```

这两个命令启动 Metro 并尝试在模拟器打开 Expo Go，不等于编译或发布原生安装包。使用现有运行中的 Metro 时可在其终端按 `i` / `a`，避免启动第二个同端口服务。若需要原生编译，应根据 Expo SDK 58 / React Native 0.88 的要求配置 Xcode、Android SDK 等工具，再使用 `expo run:ios` / `expo run:android`；不要把 Metro 可启动当作本机已满足原生编译条件。

## 检查与产物

```sh
pnpm --filter @lego/playground-native typecheck
pnpm --filter @lego/playground-native lint
pnpm --filter @lego/playground-native build
```

`build` 使用 `expo export --platform ios --platform android`，将两个原生目标的 JavaScript / Hermes bundle 导出至 `dist/`，可验证 Metro 的解析与打包。它不产生 `.ipa` / `.apk`，也不能替代模拟器、真机交互和正式安装包验证。无需安装 Xcode 或 Android SDK 即可执行此导出。

Expo 自动识别 pnpm workspace；当前不覆写 Metro resolver，不把 Web 应用的 React 或 Vite 配置强加到原生项目。此目录暂未依赖公共六包，以免把尚未实现的 Native API 伪装成可用功能。

参考：[Expo SDK 版本兼容表](https://docs.expo.dev/versions/latest/)、[Expo monorepo](https://docs.expo.dev/guides/monorepos/)、[Expo CLI](https://docs.expo.dev/more/expo-cli/)。
