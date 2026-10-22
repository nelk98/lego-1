import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { builtinModules } from 'node:module'

const pureFiles = [
  'packages/core/src/**/*.{ts,tsx}',
  'packages/schema-form/src/core/**/*.{ts,tsx}',
  'packages/schema-form/src/validators/**/*.{ts,tsx}',
  'packages/platform/src/contracts/**/*.{ts,tsx}',
  'packages/platform/src/env/**/*.{ts,tsx}',
  'packages/styles/src/tokens/**/*.{ts,tsx}',
  'packages/styles/src/runtime/**/*.{ts,tsx}',
]

const privateSources = {
  group: [
    '@lego/*/src/**',
    '**/packages/*/src/**',
    ...['core', 'platform', 'schema-form', 'styles', 'ui-admin', 'ui-client'].map(
      (name) => `**/${name}/src/**`,
    ),
  ],
  message: '跨包引用必须使用已声明的公共子路径，不能直接引用其他包的 src。',
}

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/coverage/**', '**/.expo/**'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['packages/**/*.{ts,tsx}', 'examples/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-imports': ['error', { patterns: [privateSources] }],
    },
  },
  {
    files: ['examples/*/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['examples/*/*.config.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: pureFiles,
    ignores: ['packages/core/src/**/react/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            ...builtinModules.map((name) => ({
              name,
              message: '纯逻辑入口不依赖 Node.js 宿主模块，请通过平台契约注入。',
            })),
            {
              name: 'zustand',
              message: '纯逻辑入口使用 zustand/vanilla，React 绑定放在独立入口。',
            },
          ],
          patterns: [
            privateSources,
            {
              group: [
                'node:*',
                'react',
                'react/*',
                'react-dom',
                'react-dom/*',
                'react-native',
                'react-native/*',
                'electron',
                '@tarojs/*',
                '@heroui/*',
                '@lego/ui-*',
                '@lego/platform/web',
                '@lego/platform/web/**',
                '@lego/platform/native',
                '@lego/platform/native/**',
                '@lego/platform/mini',
                '@lego/platform/mini/**',
                '@lego/platform/desktop/**',
                '@tanstack/react-query',
                '@lego/core/state/react',
                '@lego/core/state/react/**',
                '@lego/core/query/react',
                '@lego/core/query/react/**',
                '@lego/schema-form/react',
                '@lego/schema-form/react/**',
                '**/react',
                '**/react/**',
              ],
              message: '纯逻辑入口不能依赖 UI 或平台实现；使用纯接口、vanilla 或独立 React 入口。',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'sessionStorage',
        'process',
        'wx',
        '__LEGO_TARGET__',
        '__LEGO_DEV__',
      ],
    },
  },
  prettier,
])
