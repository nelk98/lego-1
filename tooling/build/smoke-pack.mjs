import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { javascriptExports, listPackages, run, runPnpm } from './workspace.mjs'

const temporary = await mkdtemp(join(tmpdir(), 'lego-pack-'))

try {
  const packages = await listPackages()
  const archives = join(temporary, 'archives')
  const consumer = join(temporary, 'consumer')
  await mkdir(archives)
  await mkdir(consumer)

  const dependencies = {}
  for (const { root, manifest } of packages) {
    const destination = join(archives, manifest.name.split('/').at(-1))
    await mkdir(destination)
    runPnpm(['pack', '--pack-destination', destination], root)
    const files = (await readdir(destination)).filter((file) => file.endsWith('.tgz'))
    assert.equal(files.length, 1, `${manifest.name} 未生成唯一归档。`)
    dependencies[manifest.name] = `file:${join(destination, files[0])}`
  }

  await writeFile(
    join(consumer, 'package.json'),
    JSON.stringify({ name: 'lego-pack-consumer', private: true, type: 'module', dependencies }),
  )
  runPnpm(['install', '--ignore-scripts', '--ignore-workspace', '--offline'], consumer)

  const imports = packages.flatMap(({ manifest }) =>
    javascriptExports(manifest).map(([subpath]) => `${manifest.name}${subpath.slice(1)}`),
  )
  // 当前入口仅占位，可全部在 Node 导入；接入宿主 SDK 后需改为各端独立 smoke。
  const runtime = `
    import assert from 'node:assert/strict';
    for (const specifier of ${JSON.stringify(imports)}) {
      const exported = await import(specifier);
      assert.equal(typeof exported, 'object');
    }
    console.log('归档消费验证：${imports.length} 个 ESM 入口导入成功。');
  `
  await writeFile(join(consumer, 'smoke.mjs'), runtime)
  await writeFile(
    join(consumer, 'smoke.ts'),
    imports
      .map(
        (specifier, index) => `import * as entry${index} from '${specifier}';\nvoid entry${index};`,
      )
      .join('\n'),
  )
  await writeFile(
    join(consumer, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022'],
        types: [],
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
        noEmit: true,
      },
      include: ['smoke.ts'],
    }),
  )

  for (const { manifest } of packages) {
    const installed = join(consumer, 'node_modules', manifest.name)
    const entries = await readdir(installed)
    assert.ok(entries.includes('dist'), `${manifest.name} 归档缺少 dist。`)
    assert.ok(!entries.includes('src') && !entries.includes('tooling'), '归档混入仓库源码。')
    for (const target of Object.values(manifest.exports)) {
      if (typeof target === 'string' && target.endsWith('.css')) {
        await readFile(join(installed, target))
      }
    }
  }

  run(process.execPath, ['smoke.mjs'], consumer)
  run(
    process.execPath,
    [fileURLToPath(import.meta.resolve('typescript/bin/tsc')), '--project', 'tsconfig.json'],
    consumer,
  )
  console.log('六包归档的独立安装、类型解析和 CSS 文件检查通过。')
} finally {
  await rm(temporary, { recursive: true, force: true })
}
