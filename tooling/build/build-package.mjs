import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'
import { readPackage, run } from './workspace.mjs'

const { root, manifest } = await readPackage(process.cwd())
await rm(join(root, 'dist'), { recursive: true, force: true })

run(
  process.execPath,
  [fileURLToPath(import.meta.resolve('typescript/bin/tsc')), '--project', 'tsconfig.build.json'],
  root,
)

// Sass 使用独立编译链路，不在 SCSS 中混入 Tailwind 指令。
const styleEntries = {
  '@lego/styles': [['src/sass/index.scss', 'dist/styles.css']],
  '@lego/ui-admin': [['src/styles.scss', 'dist/styles.css']],
  '@lego/ui-client': [
    ['src/web/styles.scss', 'dist/web/styles.css'],
    ['src/mini/styles.scss', 'dist/mini/styles.css'],
  ],
}

for (const [source, destination] of styleEntries[manifest.name] ?? []) {
  const result = sass.compile(join(root, source), { style: 'expanded', sourceMap: false })
  const output = join(root, destination)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, result.css)
}

console.log(`Built ${manifest.name}: ESM、类型声明及已声明的 Sass 产物。`)
