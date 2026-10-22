import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'virtual:uno.css'
import '../demo/theme.css'
import '@lego/ui-client/web/styles.css'
import { DemoToolbar } from '../demo/DemoToolbar'
import { ClientDemo } from './ClientDemo'

const root = document.getElementById('root')
if (!root) throw new Error('未找到 C 端示例挂载节点。')

createRoot(root).render(
  <StrictMode>
    <DemoToolbar current="client" />
    <ClientDemo />
  </StrictMode>,
)
