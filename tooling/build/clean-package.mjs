import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { readPackage } from './workspace.mjs'

const { root, manifest } = await readPackage(process.cwd())
await rm(join(root, 'dist'), { recursive: true, force: true })
console.log(`Cleaned ${manifest.name}/dist`)
