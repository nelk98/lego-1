import { useState } from 'react'
import * as core from '@lego/core/utils'
import * as platform from '@lego/platform/web'
import * as schemaForm from '@lego/schema-form/core'
import * as tokens from '@lego/styles/tokens'
import * as admin from '@lego/ui-admin/components'
import * as client from '@lego/ui-client/web'

type Section = 'overview' | 'theme' | 'schema-form' | 'admin' | 'client'

const navigation: { id: Section; label: string; mark: string }[] = [
  { id: 'overview', label: '总览', mark: '01' },
  { id: 'theme', label: '主题与 Token', mark: '02' },
  { id: 'schema-form', label: 'SchemaForm', mark: '03' },
  { id: 'admin', label: '管理端 UI', mark: '04' },
  { id: 'client', label: '客户端 UI', mark: '05' },
]

const packages = [
  {
    name: 'core',
    title: '公共逻辑',
    description: '平台无关的请求、会话、权限与状态接入。',
    entry: '@lego/core/utils',
    exports: Object.keys(core).length,
    symbol: '{ }',
  },
  {
    name: 'platform',
    title: '平台适配',
    description: '环境配置与平台能力契约的 Web 接入位置。',
    entry: '@lego/platform/web',
    exports: Object.keys(platform).length,
    symbol: '↗',
  },
  {
    name: 'schema-form',
    title: '表单内核',
    description: '无 UI 的 SchemaForm，渲染由各端接入。',
    entry: '@lego/schema-form/core',
    exports: Object.keys(schemaForm).length,
    symbol: '≡',
  },
  {
    name: 'styles',
    title: '设计基础',
    description: '共享 Token、深浅主题、品牌与状态色。',
    entry: '@lego/styles/tokens',
    exports: Object.keys(tokens).length,
    symbol: '◐',
  },
  {
    name: 'ui-admin',
    title: '管理端组件',
    description: 'HeroUI 拓展、后台布局与管理端表单渲染器。',
    entry: '@lego/ui-admin/components',
    exports: Object.keys(admin).length,
    symbol: '⊞',
  },
  {
    name: 'ui-client',
    title: '客户端组件',
    description: '自建客户端组件；本工作台连接 Web 入口。',
    entry: '@lego/ui-client/web',
    exports: Object.keys(client).length,
    symbol: '▯',
  },
]

const cssEntries = [
  '@lego/styles/styles.css',
  '@lego/ui-admin/styles.css',
  '@lego/ui-client/web/styles.css',
]

const details = {
  theme: {
    eyebrow: 'DESIGN FOUNDATIONS',
    title: '主题与 Token',
    description: '在这里验证同一套设计语义，如何映射到不同品牌、模式和交互状态。',
    entry: '@lego/styles/tokens',
    responsibilities: [
      ['Token 分层', '连接原始值、语义值与组件 Token，展示引用关系。'],
      ['模式与品牌', '接入 light / dark 模式和品牌覆盖，验证语义一致性。'],
      ['跨端输出', '检查 Web CSS 变量与各端适配产物，保持共同的 Token 来源。'],
    ],
    note: '当前页面使用 Playground 自身的 Sass 样式。它不是主题 Token 的运行示例。',
  },
  'schema-form': {
    eyebrow: 'HEADLESS FORM ENGINE',
    title: 'SchemaForm',
    description: '表单行为与视图分离，让一份 Schema 可以由不同平台自行渲染。',
    entry: '@lego/schema-form/core',
    responsibilities: [
      ['无 UI 内核', '接入 Schema、字段状态、校验与联动，独立于组件库。'],
      ['框架绑定', '由 React 绑定订阅内核变化，连接页面生命周期。'],
      ['各端渲染器', '在管理端与客户端分别验证字段映射、布局和交互。'],
    ],
    note: '此处预留 Schema 编辑区、渲染预览与状态检查区；当前没有表单引擎或渲染器。',
  },
  admin: {
    eyebrow: 'ADMIN INTERFACE',
    title: '管理端 UI',
    description: '为 Web 后台与桌面端后台建立一致的组件和布局使用方式。',
    entry: '@lego/ui-admin/components',
    responsibilities: [
      ['基础组件', '接入 HeroUI 封装与扩展，记录组件状态和使用约定。'],
      ['后台布局', '验证导航、内容容器与页面组合，复用主题语义。'],
      ['表单渲染', '连接 SchemaForm 内核与管理端字段组件。'],
    ],
    note: '已提供 HeroUI 订单管理示例，支持搜索、筛选、新建和详情查看。公共 UI 包与桌面壳能力仍待实现。',
  },
  client: {
    eyebrow: 'CLIENT INTERFACE',
    title: '客户端 UI',
    description: 'C 端以手机为使用场景，覆盖 iOS、Android、小程序与 H5。',
    entry: '@lego/ui-client/web',
    responsibilities: [
      ['H5 组件', '手机优先的页面、底部导航与触控交互；桌面仅用于预览。'],
      ['表单渲染', '连接客户端字段组件与共用的 SchemaForm 内核。'],
      ['其他平台', '原生与小程序组件在对应的运行环境中独立验证。'],
    ],
    note: '此处打开手机 H5 示例。iOS / Android 使用独立 Expo 应用，小程序使用独立 Taro 应用；公共组件包仍待接入。',
  },
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ConnectionBadge() {
  return (
    <span className="connection-badge">
      <span aria-hidden="true" />
      导入成功
    </span>
  )
}

function Overview({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const exportCount = packages.reduce((total, item) => total + item.exports, 0)

  return (
    <>
      <section className="intro" aria-labelledby="overview-title">
        <div className="eyebrow">ONE WORKSPACE. SHARED FOUNDATIONS.</div>
        <h1 id="overview-title">
          把公共能力，
          <br className="mobile-break" />
          放在一起验证。
        </h1>
        <p>
          这是 LEGO 的 Web
          开发工作台。连接工作区中的公共包，为后续组件、主题与表单能力提供集成验证入口。
        </p>
        <div className="intro-actions">
          <a className="primary-button" href="./admin.html">
            打开 B 端示例 <ArrowIcon />
          </a>
          <a className="primary-button" href="./client.html">
            打开 C 端 H5 <ArrowIcon />
          </a>
          <a className="primary-button" href="#package-entries">
            查看包入口 <ArrowIcon />
          </a>
          <span className="stage-note">当前阶段 · 工程骨架</span>
        </div>
      </section>

      <section className="workspace-stats" aria-label="工作区入口统计">
        <div>
          <span className="stat-value">{packages.length.toString().padStart(2, '0')}</span>
          <span className="stat-label">已导入包入口</span>
        </div>
        <div>
          <span className="stat-value">{cssEntries.length.toString().padStart(2, '0')}</span>
          <span className="stat-label">已接入 CSS 入口</span>
        </div>
        <div>
          <span className="stat-value">{exportCount.toString().padStart(2, '0')}</span>
          <span className="stat-label">当前运行时导出</span>
        </div>
        <p>
          入口已接通，功能待实现。
          <br />
          统计来自当前导入的模块命名空间。
        </p>
      </section>

      <section id="package-entries" className="package-section" aria-labelledby="packages-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WORKSPACE PACKAGES</span>
            <h2 id="packages-title">六个包，各司其职</h2>
          </div>
          <span className="subtle-tag">公共子路径导入</span>
        </div>
        <div className="package-grid">
          {packages.map((item) => (
            <article className="package-card" key={item.name}>
              <div className="package-card-heading">
                <span className="package-symbol" aria-hidden="true">
                  {item.symbol}
                </span>
                <ConnectionBadge />
              </div>
              <h3>
                {item.title} <span>{item.name}</span>
              </h3>
              <p>{item.description}</p>
              <div className="package-card-footer">
                <code>{item.entry}</code>
                <span>
                  <b>{item.exports}</b> 导出
                </span>
              </div>
            </article>
          ))}
        </div>
        <p className="section-footnote">
          “导入成功”仅表示公共入口可被解析和加载；导出数量不代表功能完成度。
        </p>
      </section>

      <div className="bottom-grid">
        <section className="integration-panel" aria-labelledby="css-title">
          <div className="panel-heading">
            <h2 id="css-title">样式入口</h2>
            <span className="subtle-tag">CSS</span>
          </div>
          <p>通过包的公共样式入口导入，当前样式内容仍为占位。</p>
          <ul className="css-entry-list">
            {cssEntries.map((entry) => (
              <li key={entry}>
                <span aria-hidden="true">✓</span>
                <code>{entry}</code>
              </li>
            ))}
          </ul>
        </section>
        <section className="next-panel" aria-labelledby="next-title">
          <span className="eyebrow">NEXT CONNECTION</span>
          <h2 id="next-title">从设计基础开始</h2>
          <p>查看主题与 Token 的接入位置，逐步为各端组件建立共同语言。</p>
          <button className="text-button" onClick={() => onNavigate('theme')}>
            查看主题规划 <ArrowIcon />
          </button>
        </section>
      </div>
    </>
  )
}

function Detail({ section }: { section: Exclude<Section, 'overview'> }) {
  const detail = details[section]
  const connectedPackage = packages.find((item) => item.entry === detail.entry)
  const demoUrl =
    section === 'admin' ? './admin.html' : section === 'client' ? './client.html' : null

  return (
    <>
      <section className="intro detail-intro" aria-labelledby="detail-title">
        <div className="eyebrow">{detail.eyebrow}</div>
        <h1 id="detail-title">{detail.title}</h1>
        <p>{detail.description}</p>
      </section>

      <section className="entry-banner" aria-label="当前模块入口">
        <div>
          <span className="eyebrow">CONNECTED ENTRY</span>
          <code>{detail.entry}</code>
        </div>
        <div className="entry-banner-status">
          <ConnectionBadge />
          <span>{connectedPackage?.exports ?? 0} 个运行时导出</span>
        </div>
      </section>

      <section className="placeholder-panel" aria-labelledby="placeholder-title">
        <span className="placeholder-symbol" aria-hidden="true">
          +
        </span>
        <span className="subtle-tag">{demoUrl ? '交互示例' : '待接入'}</span>
        <h2 id="placeholder-title">{demoUrl ? '示例页面已就绪' : '入口已接通，功能待实现'}</h2>
        <p>{detail.note}</p>
        {demoUrl && (
          <a className="primary-button" href={demoUrl}>
            打开{section === 'admin' ? ' B ' : ' C '}端示例 <ArrowIcon />
          </a>
        )}
      </section>

      <section aria-labelledby="responsibilities-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">INTEGRATION PLAN</span>
            <h2 id="responsibilities-title">后续接入职责</h2>
          </div>
        </div>
        <div className="responsibility-grid">
          {detail.responsibilities.map(([title, description], index) => (
            <article className="responsibility-card" key={title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export function App() {
  const [section, setSection] = useState<Section>('overview')
  const currentLabel = navigation.find((item) => item.id === section)?.label

  function navigate(next: Section) {
    setSection(next)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return (
    <div className="playground">
      <a className="skip-link" href="#main-content">
        跳转到内容
      </a>
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={() => navigate('overview')}
          aria-label="LEGO 开发工作台首页"
        >
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>
            lego<span className="brand-caption">INFRASTRUCTURE LAB</span>
          </span>
        </a>
        <div className="workspace-label">
          <span aria-hidden="true" />
          Web playground<span className="local-label">LOCAL</span>
        </div>
        <nav aria-label="工作台导航">
          <p className="nav-label">开发工作台</p>
          {navigation.map((item) => (
            <button
              className={`nav-item${section === item.id ? ' is-active' : ''}`}
              key={item.id}
              aria-current={section === item.id ? 'page' : undefined}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-mark" aria-hidden="true">
                {item.mark}
              </span>
              {item.label}
              {section === item.id && <span className="nav-active-dot" aria-hidden="true" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="scope-note">
            <span className="scope-symbol" aria-hidden="true">
              ⌘
            </span>
            <h2>一个轻量的验证环境</h2>
            <p>从真实的包入口开始，逐步接入可运行的示例。</p>
            <code>examples/playground-web</code>
          </div>
          <div className="sidebar-footer">
            <span>LEGO WORKSPACE</span>
            <span>v0.0.0</span>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Playground</span>
            <span aria-hidden="true">/</span>
            <strong>{currentLabel}</strong>
          </div>
          <span className="runtime-label">
            <span aria-hidden="true" />
            Web · React · Vite
          </span>
        </header>
        <main id="main-content" tabIndex={-1}>
          {section === 'overview' ? (
            <Overview onNavigate={navigate} />
          ) : (
            <Detail section={section} />
          )}
          <footer className="page-footer">
            <span>LEGO · 基础设施开发工作台</span>
            <span>公共入口验证 / 功能逐步接入</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
