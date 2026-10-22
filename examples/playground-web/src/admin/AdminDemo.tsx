import { Button, Input, Label, Modal, TextField } from '@heroui/react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './admin.scss'

type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled'
type Order = {
  id: string
  customer: string
  company: string
  product: string
  quantity: number
  unitPrice: number
  status: OrderStatus
  createdAt: string
}

const statusLabels: Record<OrderStatus, string> = {
  pending: '待发货',
  shipping: '运输中',
  completed: '已完成',
  cancelled: '已取消',
}

const products = [
  { id: 'lamp', name: '弧光 · 桌面灯', price: 399 },
  { id: 'headphones', name: '静界 · 无线耳机', price: 899 },
  { id: 'speaker', name: '回声 · 蓝牙音箱', price: 599 },
  { id: 'clock', name: '时序 · 桌面时钟', price: 259 },
]

const initialOrders: Order[] = [
  {
    id: 'LG20261023008',
    customer: '林予安',
    company: '禾木设计工作室',
    product: '弧光 · 桌面灯',
    quantity: 8,
    unitPrice: 399,
    status: 'pending',
    createdAt: '2026-10-23 14:32',
  },
  {
    id: 'LG20261023007',
    customer: '陈一帆',
    company: '独立客户',
    product: '静界 · 无线耳机',
    quantity: 2,
    unitPrice: 899,
    status: 'shipping',
    createdAt: '2026-10-23 13:18',
  },
  {
    id: 'LG20261023006',
    customer: '周闻溪',
    company: '方寸空间',
    product: '回声 · 蓝牙音箱',
    quantity: 5,
    unitPrice: 599,
    status: 'completed',
    createdAt: '2026-10-23 11:46',
  },
  {
    id: 'LG20261023005',
    customer: '许知远',
    company: '知物科技',
    product: '时序 · 桌面时钟',
    quantity: 12,
    unitPrice: 259,
    status: 'pending',
    createdAt: '2026-10-23 10:24',
  },
  {
    id: 'LG20261023004',
    customer: '苏晴',
    company: '独立客户',
    product: '弧光 · 桌面灯',
    quantity: 1,
    unitPrice: 399,
    status: 'completed',
    createdAt: '2026-10-23 09:52',
  },
  {
    id: 'LG20261022003',
    customer: '王屿',
    company: '青山品牌咨询',
    product: '静界 · 无线耳机',
    quantity: 6,
    unitPrice: 899,
    status: 'shipping',
    createdAt: '2026-10-22 16:37',
  },
  {
    id: 'LG20261022002',
    customer: '李思南',
    company: '独立客户',
    product: '回声 · 蓝牙音箱',
    quantity: 1,
    unitPrice: 599,
    status: 'cancelled',
    createdAt: '2026-10-22 15:08',
  },
  {
    id: 'LG20261022001',
    customer: '赵明',
    company: '原点创意',
    product: '弧光 · 桌面灯',
    quantity: 10,
    unitPrice: 399,
    status: 'completed',
    createdAt: '2026-10-22 11:20',
  },
]

const money = (amount: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(amount)

function AdminIcon({
  kind,
  className = '',
}: {
  kind: 'grid' | 'orders' | 'arrow' | 'plus' | 'box' | 'search' | 'check'
  className?: string
}) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    orders: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    arrow: (
      <>
        <path d="m5 15 5-5 4 4 6-8M14 6h6v6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    box: (
      <>
        <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
        <path d="m3 7 9 4 9-4M12 11v10M7.5 5l9 4" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  }
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`admin-status admin-status--${status}`}>
      <span />
      {statusLabels[status]}
    </span>
  )
}

export function AdminDemo() {
  const [orders, setOrders] = useState(initialOrders)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [creating, setCreating] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [customer, setCustomer] = useState('')
  const [productId, setProductId] = useState('lamp')
  const [quantity, setQuantity] = useState('1')
  const [errors, setErrors] = useState({ customer: '', quantity: '' })
  const [announcement, setAnnouncement] = useState('')

  const filteredOrders = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return orders.filter(
      (order) =>
        (status === 'all' || order.status === status) &&
        (!needle ||
          `${order.id} ${order.customer} ${order.company}`.toLocaleLowerCase().includes(needle)),
    )
  }, [orders, query, status])
  const revenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.unitPrice * order.quantity, 0)
  const pendingCount = orders.filter((order) => order.status === 'pending').length
  const completedCount = orders.filter((order) => order.status === 'completed').length
  const product = products.find((item) => item.id === productId) ?? products[0]!
  const quantityNumber = Number(quantity)
  const validQuantity =
    Number.isInteger(quantityNumber) && quantityNumber >= 1 && quantityNumber <= 99

  function startOrder() {
    setCustomer('')
    setProductId('lamp')
    setQuantity('1')
    setErrors({ customer: '', quantity: '' })
    setCreating(true)
  }

  function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const customerError =
      customer.trim().length < 2 || customer.trim().length > 30
        ? '请输入 2–30 个字符的客户姓名。'
        : ''
    const quantityError = validQuantity ? '' : '数量必须为 1–99 之间的整数。'
    setErrors({ customer: customerError, quantity: quantityError })
    if (customerError || quantityError) return
    const order: Order = {
      id: `LG20261023${String(orders.length + 1).padStart(3, '0')}`,
      customer: customer.trim(),
      company: '新建演示客户',
      product: product.name,
      quantity: quantityNumber,
      unitPrice: product.price,
      status: 'pending',
      createdAt: '2026-10-23 15:00',
    }
    setOrders((current) => [order, ...current])
    setQuery('')
    setStatus('all')
    setCreating(false)
    setAnnouncement(`订单 ${order.id} 已创建，金额 ${money(order.unitPrice * order.quantity)}。`)
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="管理后台导航">
        <a href="#admin-overview" className="admin-brand">
          <span className="admin-brand__mark">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>
            LEGO <strong>Commerce</strong>
          </span>
        </a>
        <div className="admin-workspace">
          <span className="admin-workspace__avatar">L</span>
          <div>
            <strong>生活方式商店</strong>
            <span>品牌运营工作空间</span>
          </div>
          <span className="admin-workspace__indicator" />
        </div>
        <p className="admin-nav-label">工作空间</p>
        <nav className="admin-nav">
          <a href="#admin-overview">
            <AdminIcon kind="grid" />
            经营概览
          </a>
          <a href="#admin-orders" className="admin-nav__active">
            <AdminIcon kind="orders" />
            订单管理<span>{orders.length}</span>
          </a>
        </nav>
        <div className="admin-sidebar-note">
          <span className="admin-sidebar-note__tag">SANDBOX</span>
          <strong>从一个好用的后台开始</strong>
          <p>搜索、筛选与创建订单，体验完整的管理流程。</p>
          <span>本地演示 · 刷新后重置</span>
        </div>
        <div className="admin-profile">
          <span>林</span>
          <div>
            <strong>林小满</strong>
            <small>演示管理员</small>
          </div>
          <span className="admin-profile__online" />
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <span>
            工作空间 <span>/</span> <strong>订单管理</strong>
          </span>
          <span className="admin-demo-tag">
            <span />
            演示数据
          </span>
        </header>
        <div className="admin-content">
          <section id="admin-overview" className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">COMMERCE / ORDERS</p>
              <h1>
                订单管理<span>每一份订单，井然有序。</span>
              </h1>
              <p>了解经营动态，让订单从创建到交付顺畅流转。</p>
            </div>
            <Button className="admin-primary-button" onPress={startOrder}>
              <AdminIcon kind="plus" />
              新建订单
            </Button>
          </section>

          <section className="admin-metrics" aria-label="订单统计">
            <article className="admin-metric admin-metric--featured">
              <div>
                <span>订单总额</span>
                <AdminIcon kind="arrow" />
              </div>
              <strong>{money(revenue)}</strong>
              <p>
                <span className="admin-metric__dot" />
                不含已取消订单
              </p>
              <svg viewBox="0 0 180 48" aria-hidden="true">
                <path
                  d="M0 43 20 34 40 39 60 22 80 29 100 16 120 21 140 6 160 14 180 2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </article>
            <article className="admin-metric">
              <div>
                <span>全部订单</span>
                <span className="admin-metric__icon">
                  <AdminIcon kind="orders" />
                </span>
              </div>
              <strong>
                {orders.length}
                <small>笔</small>
              </strong>
              <p>当前演示数据的订单总数</p>
            </article>
            <article className="admin-metric">
              <div>
                <span>待发货</span>
                <span className="admin-metric__icon admin-metric__icon--amber">
                  <AdminIcon kind="box" />
                </span>
              </div>
              <strong>
                {pendingCount}
                <small>笔</small>
              </strong>
              <p>
                <span className="admin-metric__dot admin-metric__dot--amber" />
                等待安排发货
              </p>
            </article>
            <article className="admin-metric">
              <div>
                <span>已完成</span>
                <span className="admin-metric__icon">
                  <AdminIcon kind="check" />
                </span>
              </div>
              <strong>
                {completedCount}
                <small>笔</small>
              </strong>
              <p>已顺利送达客户</p>
            </article>
          </section>

          <section className="admin-insight" aria-label="经营提示">
            <span className="admin-insight__icon">
              <AdminIcon kind="arrow" />
            </span>
            <div>
              <strong>把时间留给更重要的事</strong>
              <span>
                当前有 {pendingCount} 笔订单待发货。选择状态筛选，快速找到需要处理的订单。
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="admin-text-button"
              onPress={() => {
                setStatus('pending')
                setQuery('')
                document
                  .getElementById('admin-orders')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              查看待发货 <span aria-hidden="true">→</span>
            </Button>
          </section>

          <section
            id="admin-orders"
            className="admin-order-panel"
            aria-labelledby="admin-orders-heading"
          >
            <div className="admin-panel-heading">
              <div>
                <h2 id="admin-orders-heading">
                  全部订单 <span>{orders.length}</span>
                </h2>
                <p>示例业务日期：2026 年 10 月 22–23 日</p>
              </div>
              <span className="admin-local-state">
                <span />
                仅保存在当前页面
              </span>
            </div>
            <div className="admin-filters">
              <TextField
                value={query}
                onChange={setQuery}
                className="admin-search"
                aria-label="搜索订单"
              >
                <Label className="admin-sr-only">搜索订单</Label>
                <AdminIcon kind="search" />
                <Input className="admin-search__input" placeholder="搜索客户姓名、公司或订单号…" />
              </TextField>
              <label className="admin-status-filter">
                <span>订单状态</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="all">全部状态</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {(query || status !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="admin-text-button"
                  onPress={() => {
                    setQuery('')
                    setStatus('all')
                  }}
                >
                  重置筛选
                </Button>
              )}
            </div>
            {announcement && (
              <p className="admin-announcement" role="status">
                <AdminIcon kind="check" />
                {announcement}
              </p>
            )}
            <div className="admin-table-scroll">
              <table className="admin-table">
                <caption className="admin-sr-only">
                  订单列表，共 {filteredOrders.length} 笔匹配订单
                </caption>
                <thead>
                  <tr>
                    <th scope="col">订单 / 创建时间</th>
                    <th scope="col">客户</th>
                    <th scope="col">商品</th>
                    <th scope="col">金额</th>
                    <th scope="col">状态</th>
                    <th scope="col">
                      <span className="admin-sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order.id}>
                      <td>
                        <strong className="admin-order-id">{order.id}</strong>
                        <span className="admin-cell-subtle">{order.createdAt}</span>
                      </td>
                      <td>
                        <div className="admin-customer">
                          <span className={`admin-avatar admin-avatar--${index % 4}`}>
                            {order.customer.slice(0, 1)}
                          </span>
                          <div>
                            <strong>{order.customer}</strong>
                            <span className="admin-cell-subtle">{order.company}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong className="admin-product-name">{order.product}</strong>
                        <span className="admin-cell-subtle">数量 × {order.quantity}</span>
                      </td>
                      <td>
                        <strong className="admin-amount">
                          {money(order.unitPrice * order.quantity)}
                        </strong>
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="admin-detail-button"
                          aria-label={`查看订单 ${order.id} 详情`}
                          onPress={() => setSelectedOrder(order)}
                        >
                          详情 <span aria-hidden="true">↗</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="admin-empty">
                  <AdminIcon kind="search" />
                  <strong>没有找到匹配的订单</strong>
                  <p>试试其他关键词，或清除状态筛选。</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onPress={() => {
                      setQuery('')
                      setStatus('all')
                    }}
                  >
                    显示全部订单
                  </Button>
                </div>
              )}
            </div>
            <footer className="admin-table-footer">
              <span>
                显示 {filteredOrders.length} 笔，共 {orders.length} 笔订单
              </span>
              <span>金额单位：人民币 CNY</span>
            </footer>
          </section>
          <footer className="admin-page-footer">
            <span>
              LEGO COMMERCE <span>业务体验示例</span>
            </span>
            <span>HeroUI · React · 本地交互</span>
          </footer>
        </div>
      </main>

      {/* External buttons control these dialogs, so use Backdrop without a DialogTrigger root. */}
      <Modal.Backdrop isOpen={creating} onOpenChange={setCreating} className="admin-modal-backdrop">
        <Modal.Container size="md">
          <Modal.Dialog className="admin-modal">
            <Modal.CloseTrigger aria-label="关闭新建订单" />
            <Modal.Header>
              <p className="admin-eyebrow">NEW ORDER</p>
              <Modal.Heading>新建订单</Modal.Heading>
              <p className="admin-modal-description">创建一笔本地演示订单，体验基础业务流程。</p>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={createOrder} noValidate className="admin-order-form">
                <TextField
                  value={customer}
                  onChange={setCustomer}
                  isRequired
                  isInvalid={Boolean(errors.customer)}
                  validationBehavior="aria"
                  className="admin-field"
                >
                  <Label>客户姓名</Label>
                  <Input
                    className="admin-form-input"
                    placeholder="请输入客户姓名"
                    maxLength={30}
                    aria-describedby={errors.customer ? 'admin-customer-error' : undefined}
                  />
                  {errors.customer && (
                    <p className="admin-field-error" id="admin-customer-error" role="alert">
                      {errors.customer}
                    </p>
                  )}
                </TextField>
                <label className="admin-field">
                  <span>选择商品</span>
                  <select
                    className="admin-form-input"
                    value={productId}
                    onChange={(event) => setProductId(event.target.value)}
                  >
                    {products.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name} · {money(item.price)}
                      </option>
                    ))}
                  </select>
                </label>
                <TextField
                  value={quantity}
                  onChange={setQuantity}
                  isRequired
                  isInvalid={Boolean(errors.quantity)}
                  validationBehavior="aria"
                  className="admin-field"
                >
                  <Label>购买数量</Label>
                  <Input
                    className="admin-form-input"
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    aria-describedby={errors.quantity ? 'admin-quantity-error' : undefined}
                  />
                  {errors.quantity && (
                    <p className="admin-field-error" id="admin-quantity-error" role="alert">
                      {errors.quantity}
                    </p>
                  )}
                </TextField>
                <div className="admin-form-total">
                  <span>
                    订单合计<small>新订单默认状态为「待发货」</small>
                  </span>
                  <strong>{validQuantity ? money(product.price * quantityNumber) : '—'}</strong>
                </div>
                <p className="admin-form-note">
                  演示日期固定为 2026-10-23；数据仅保存在当前页面，刷新后重置。
                </p>
                <div className="admin-form-actions">
                  <Button variant="secondary" type="button" onPress={() => setCreating(false)}>
                    取消
                  </Button>
                  <Button className="admin-primary-button" type="submit">
                    创建订单
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <Modal.Backdrop
        isOpen={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null)
        }}
        className="admin-modal-backdrop"
      >
        <Modal.Container size="md">
          <Modal.Dialog className="admin-modal">
            <Modal.CloseTrigger aria-label="关闭订单详情" />
            <Modal.Header>
              <p className="admin-eyebrow">ORDER DETAILS</p>
              <Modal.Heading>订单详情</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {selectedOrder && (
                <div className="admin-detail">
                  <div className="admin-detail__identity">
                    <strong>{selectedOrder.id}</strong>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <dl>
                    <div>
                      <dt>客户姓名</dt>
                      <dd>{selectedOrder.customer}</dd>
                    </div>
                    <div>
                      <dt>客户组织</dt>
                      <dd>{selectedOrder.company}</dd>
                    </div>
                    <div>
                      <dt>创建时间</dt>
                      <dd>{selectedOrder.createdAt}（演示）</dd>
                    </div>
                    <div>
                      <dt>商品名称</dt>
                      <dd>{selectedOrder.product}</dd>
                    </div>
                    <div>
                      <dt>商品单价</dt>
                      <dd>{money(selectedOrder.unitPrice)}</dd>
                    </div>
                    <div>
                      <dt>购买数量</dt>
                      <dd>{selectedOrder.quantity} 件</dd>
                    </div>
                  </dl>
                  <div className="admin-form-total">
                    <span>订单总额</span>
                    <strong>{money(selectedOrder.unitPrice * selectedOrder.quantity)}</strong>
                  </div>
                  <p className="admin-form-note">
                    此处展示本地订单数据，尚未连接支付、物流或真实业务服务。
                  </p>
                  <Button fullWidth variant="secondary" onPress={() => setSelectedOrder(null)}>
                    关闭详情
                  </Button>
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  )
}
