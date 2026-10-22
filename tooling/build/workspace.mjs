import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

export const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url))
export const packagesRoot = join(workspaceRoot, 'packages')

export async function readPackage(directory) {
  const root = resolve(directory)
  if (dirname(root) !== resolve(packagesRoot)) {
    throw new Error('包构建和清理命令必须在当前仓库的 packages/<name> 中运行。')
  }
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  return { root, manifest }
}

export async function listPackages() {
  const entries = await readdir(packagesRoot, { withFileTypes: true })
  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => readPackage(join(packagesRoot, entry.name))),
  )
}

export function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} 执行失败，退出码 ${result.status ?? result.signal}`)
  }
}

// 通过启动本脚本的 pnpm CLI 执行，避免 Windows .cmd 与全局版本差异。
export function runPnpm(args, cwd) {
  const cli = process.env.npm_execpath
  if (!cli || !/pnpm/i.test(cli)) {
    throw new Error('请通过 pnpm 脚本运行打包验证。')
  }
  run(process.execPath, [cli, ...args], cwd)
}

export function javascriptExports(manifest) {
  return Object.entries(manifest.exports ?? {}).filter(
    ([, target]) => typeof target === 'object' && typeof target.import === 'string',
  )
}
