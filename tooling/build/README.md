# 库构建约定

当前目录服务于六个公共包的库构建、清理和产物检查。Web Playground 的 Vite 配置位于 `examples/playground-web`，不在本目录；Expo 和 Taro 示例配置分别位于 `examples/playground-native` 和 `examples/playground-mini`。可复用的 Vite、Metro / Expo、Taro 平台构建预设尚未抽取，Electron 应用打包配置尚未提供。

## 当前产物

- 使用共享 TypeScript 配置和包内构建配置，以 NodeNext 解析并输出 ESM。
- 保留源码模块结构，输出 JavaScript、类型声明和对应映射文件。
- 以包 `exports` 定义显式子路径，检查构建后的入口与声明存在。
- Sass 独立编译，提供后续手写样式的交付链路。Tailwind 不进入 Sass 编译链路；公共包的主题 token 和原子样式产物尚未实现。Web Playground 的 B 端与 H5 页面已通过独立入口分别接入 Tailwind / HeroUI 和 UnoCSS。
- 清理只作用于工程生成的构建产物，源码与 lockfile 不属于清理对象。

`tsc` 不负责 bundling、压缩、条件分支裁剪或 tree shaking。保留 ESM、多入口和准确的 `sideEffects` 为未来消费端优化提供条件，并不构成优化效果的证明。

## 平台差异

当前采用 `@lego/platform/web`、`@lego/platform/native` 等显式子路径建立边界；入口仍是占位模块。公共流程后续通过注入的契约使用能力。

各工具链的示例配置与后续公共能力如下：

| 工具链       | 当前配置与待实现内容                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| Vite         | 已有 Playground 开发 / 生产构建；平台 alias、define、条件解析仍待接入                 |
| Metro / Expo | 已配置移动示例与 JS 导出命令；公共包 exports、平台文件解析及原生 release 产物仍待验证 |
| Taro         | 已配置微信小程序示例；公共包平台常量、多端解析及 UnoCSS 样式适配仍待实现与验证        |
| Electron     | main、preload、renderer 独立构建与依赖边界                                            |

不在公共库中预先声明或使用 `__LEGO_TARGET__`、`__LEGO_DEV__` 等宏；只有替换规则和产物检查就绪后才能引入。公共产物不得要求消费者猜测未替换变量的含义。

平台 alias 应在应用或模板层建立，并在依赖图生成前选中具体实现。发布库不依赖私有 alias，也不通过同时导入多端 SDK 再运行时判断来隔离平台。

## 新增构建配置时

1. 为实际导入声明 workspace、运行时或 peer 依赖，不能只设置 TypeScript paths。
2. ESM 相对导入显式使用 `.js` 等输出扩展名，避免仅在开发工具中可解析。
3. 共享配置与影响产物的环境变量纳入 Turbo 缓存输入；新增平台输出需采用独立目录。
4. 样式、polyfill、必要注册等副作用要准确标记，不能因为文件扩展名为 JavaScript 就默认无副作用。
5. 重新执行格式、lint、类型、构建和归档消费检查；端侧配置还需要对应应用的生产构建验证。

## 检查范围

`pnpm verify:packages` 检查六包 manifest、导出与本地产物。`pnpm verify:pack` 从真实归档建立临时消费者，验证安装、ESM 子路径导入和 TypeScript 解析，防止仅在 workspace 中可用。`pnpm build` 同时构建 Web、导出 Native JS 资源并编译微信小程序；`pnpm dev` 使用 Turbo watch 先构建依赖包，再启动 Vite 并监听后续包源码变化。

目前六个公共包的功能入口均为 `export {}`；包检查结果只证明工程骨架和归档结构可用。Web 示例需验证开发运行与多页生产构建；Native JS 导出需配合模拟器或真机验证，小程序编译需配合微信开发者工具验证。Expo 导出不生成原生安装包，Taro 编译不上传发布。后续向公共包加入实际依赖、样式和平台 API 后，必须扩展对应检查，并以真实 release 产物验证平台隔离、调试分支裁剪、样式保留和体积变化。
