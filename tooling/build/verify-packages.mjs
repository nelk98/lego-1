import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { listPackages } from './workspace.mjs'

const packages = await listPackages()
assert.equal(packages.length, 6, '当前应有六个工作区包。')
let checked = 0

for (const { root, manifest } of packages) {
  assert.equal(manifest.type, 'module', `${manifest.name} 必须发布 ESM。`)
  assert.ok(!manifest.exports['.'], `${manifest.name} 不应提供跨端聚合入口。`)

  for (const [subpath, target] of Object.entries(manifest.exports)) {
    assert.ok(subpath.startsWith('./'), `无效子路径：${subpath}`)
    if (typeof target === 'object') {
      assert.ok(target.types?.endsWith('.d.ts'), `${subpath} 缺少类型入口。`)
      assert.ok(target.import?.endsWith('.js'), `${subpath} 缺少 ESM 入口。`)
    }
    const files = typeof target === 'string' ? [target] : Object.values(target)
    for (const file of new Set(files)) {
      assert.ok(file.startsWith('./dist/') && !file.includes('..'), `入口必须指向 dist：${file}`)
      assert.ok((await stat(join(root, file))).isFile(), `缺少产物：${file}`)
      if (file.endsWith('.js')) {
        const code = await readFile(join(root, file), 'utf8')
        assert.doesNotMatch(
          code,
          /__LEGO_(?:TARGET|DEV)__|import\.meta\.env/,
          '纯库产物残留环境宏。',
        )
      }
      if (file.endsWith('.css')) {
        assert.ok(Array.isArray(manifest.sideEffects), `${manifest.name} 必须保留 CSS 副作用。`)
        assert.ok(
          manifest.sideEffects.includes('**/*.css'),
          `${manifest.name} 缺少 CSS 副作用声明。`,
        )
      }
    }
    checked += 1
  }
}

console.log(`已验证 ${packages.length} 个包、${checked} 个子路径的产物和类型入口。`)
