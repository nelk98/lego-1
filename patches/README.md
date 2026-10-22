# 依赖补丁

`unconfig@7.5.0.patch` 仅修正 `dist/index.d.mts`：`createConfigLoader().load()` 的 `force` 参数错误引用了未定义的 `Args` 类型。依据该版本实现中的 `force = false`，改为可选 `boolean`，不修改运行时代码。

补丁由 `pnpm patch` / `pnpm patch-commit` 生成，已登记在根 `package.json` 和锁文件中，安装时自动应用。这样可以继续检查完整的依赖声明，而不启用 `skipLibCheck`。升级 UnoCSS / unconfig 后，应确认上游修复并移除此补丁。
