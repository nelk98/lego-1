import { useEffect, useState } from 'react'

type Mode = 'light' | 'dark'

function initialMode(): Mode {
  try {
    const saved = localStorage.getItem('lego-demo-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // 禁用存储时仍允许当前页面切换主题。
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function DemoToolbar({ current }: { current: 'admin' | 'client' }) {
  const [mode, setMode] = useState<Mode>(initialMode)

  useEffect(() => {
    document.documentElement.dataset.demoTheme = mode
    document.documentElement.classList.toggle('dark', mode === 'dark')
    document.documentElement.classList.toggle('light', mode === 'light')
    try {
      localStorage.setItem('lego-demo-theme', mode)
    } catch {
      // 主题偏好不影响示例的其他交互。
    }
  }, [mode])

  return (
    <header className="demo-toolbar">
      <a className="demo-toolbar__brand" href="./">
        lego <span>EXAMPLES</span>
      </a>
      <nav aria-label="切换示例" className="demo-toolbar__nav">
        <a href="./admin.html" aria-current={current === 'admin' ? 'page' : undefined}>
          B 端工作台
        </a>
        <a href="./client.html" aria-current={current === 'client' ? 'page' : undefined}>
          C 端 H5
        </a>
      </nav>
      <div className="demo-toolbar__actions">
        <span className="demo-toolbar__notice">本地演示</span>
        <button
          className="demo-toolbar__theme"
          type="button"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          aria-label={mode === 'light' ? '切换为深色模式' : '切换为浅色模式'}
        >
          <span aria-hidden="true">{mode === 'light' ? '◐' : '☼'}</span>
          {mode === 'light' ? '深色' : '浅色'}
        </button>
      </div>
    </header>
  )
}
