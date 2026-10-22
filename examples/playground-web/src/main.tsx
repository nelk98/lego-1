import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@lego/styles/styles.css'
import '@lego/ui-admin/styles.css'
import '@lego/ui-client/web/styles.css'
import { App } from './App'
import './styles.scss'

const root = document.getElementById('root')

if (!root) {
  throw new Error('未找到 Playground 挂载节点。')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
