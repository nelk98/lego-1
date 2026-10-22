import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import '../demo/theme.css'
import '@lego/ui-admin/styles.css'
import { DemoToolbar } from '../demo/DemoToolbar'
import { AdminDemo } from './AdminDemo'

const root = document.getElementById('root')
if (!root) throw new Error('未找到 B 端示例挂载节点。')

createRoot(root).render(
  <StrictMode>
    <DemoToolbar current="admin" />
    <AdminDemo />
  </StrictMode>,
)
