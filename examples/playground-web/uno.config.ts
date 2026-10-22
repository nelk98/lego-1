import type { UserConfig } from '@unocss/core'
import presetMini from '@unocss/preset-mini'

export default {
  presets: [presetMini()],
  content: {
    pipeline: { include: [/\/src\/client\/.*\.[jt]sx?($|\?)/] },
  },
} satisfies UserConfig
