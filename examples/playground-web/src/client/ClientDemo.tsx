import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './client.scss'

type ProductKind = 'cup' | 'lamp' | 'bag' | 'headphones' | 'notebook' | 'vase'
type Category = '全部好物' | '居家日常' | '随身好物' | '灵感办公'
type Product = {
  id: string
  name: string
  subtitle: string
  price: number
  category: Category
  kind: ProductKind
  color: string
  label?: string
}

const products: Product[] = [
  {
    id: 'cup',
    name: '山间 · 手作陶瓷杯',
    subtitle: '温润釉面 / 350 ml',
    price: 89,
    category: '居家日常',
    kind: 'cup',
    color: 'cream',
    label: '人气之选',
  },
  {
    id: 'lamp',
    name: '暮光 · 蘑菇台灯',
    subtitle: '柔和暖光 / 可调亮度',
    price: 269,
    category: '居家日常',
    kind: 'lamp',
    color: 'peach',
    label: '本周上新',
  },
  {
    id: 'bag',
    name: '漫游 · 日常帆布袋',
    subtitle: '原色棉帆布 / 大容量',
    price: 129,
    category: '随身好物',
    kind: 'bag',
    color: 'sage',
  },
  {
    id: 'headphones',
    name: '留白 · 无线耳机',
    subtitle: '奶油白 / 轻盈随行',
    price: 399,
    category: '随身好物',
    kind: 'headphones',
    color: 'lavender',
  },
  {
    id: 'notebook',
    name: '片刻 · 灵感手账',
    subtitle: '森林绿 / 细腻书写',
    price: 59,
    category: '灵感办公',
    kind: 'notebook',
    color: 'sand',
    label: '编辑推荐',
  },
  {
    id: 'vase',
    name: '野趣 · 侘寂花器',
    subtitle: '天然肌理 / 手工烧制',
    price: 159,
    category: '居家日常',
    kind: 'vase',
    color: 'rose',
  },
]
const categories: Category[] = ['全部好物', '居家日常', '随身好物', '灵感办公']
const currency = (value: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value)

function Icon({
  name,
  size = 20,
}: {
  name:
    | 'search'
    | 'heart'
    | 'bag'
    | 'arrow'
    | 'close'
    | 'minus'
    | 'plus'
    | 'check'
    | 'leaf'
    | 'home'
    | 'grid'
    | 'user'
  size?: number
}) {
  const paths: Record<typeof name, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3V10Z" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    heart: (
      <path d="M20.8 4.8a5.3 5.3 0 0 0-7.5 0L12 6.1l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.7a5.3 5.3 0 0 0 0-7.5Z" />
    ),
    bag: (
      <>
        <path d="M5 7h14l1.5 14h-17L5 7Z" />
        <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16M14 6l6 6-6 6" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M5 12h14M12 5v14" />,
    check: <path d="m5 12 4.5 4.5L19 7" />,
    leaf: (
      <>
        <path d="M20 3C7 1 1 9 6 16c7 5 15-1 14-13Z" />
        <path d="M4 21 15 10" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function ProductArt({ kind }: { kind: ProductKind }) {
  const id = useId().replaceAll(':', '')
  return (
    <svg className="client-product-art" viewBox="0 0 320 250" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={`${id}-ceramic`}
          x1="90"
          y1="90"
          x2="230"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EEE6D6" />
          <stop offset=".45" stopColor="#DCD2BC" />
          <stop offset="1" stopColor="#C3B597" />
        </linearGradient>
        <linearGradient
          id={`${id}-metal`}
          x1="120"
          y1="50"
          x2="210"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF4DE" />
          <stop offset="1" stopColor="#DDC9A9" />
        </linearGradient>
        <linearGradient
          id={`${id}-green`}
          x1="100"
          y1="60"
          x2="220"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6B8065" />
          <stop offset="1" stopColor="#334E3D" />
        </linearGradient>
      </defs>
      <ellipse
        cx="163"
        cy="214"
        rx={kind === 'headphones' ? 71 : 67}
        ry="9"
        fill="#312C22"
        opacity=".09"
      />
      {kind === 'cup' && (
        <g transform="rotate(-7 160 150)">
          <path d="M212 102c56-8 55 69 6 68" stroke="#BBAE91" strokeWidth="16" />
          <path d="M213 102c48-5 48 57 7 59" stroke="#E2D8C3" strokeWidth="9" />
          <path d="m91 89 13 100c4 33 104 33 109 0l12-100Z" fill={`url(#${id}-ceramic)`} />
          <ellipse cx="158" cy="89" rx="67" ry="18" fill="#F3EDDF" />
          <ellipse cx="158" cy="90" rx="57" ry="12" fill="#A29277" />
          <ellipse cx="158" cy="94" rx="54" ry="8" fill="#66513B" />
          <path
            d="m106 112 7 68"
            stroke="#FFF8E9"
            strokeWidth="5"
            strokeLinecap="round"
            opacity=".65"
          />
          <path d="M136 151c10 6 21 6 31 0" stroke="#8B8D69" strokeWidth="2" />
          <path
            d="M150 145v-14m0 5c-6-7-14-3-10 1 3 2 7 1 10-1Zm1-3c5-8 13-4 9 0-3 3-6 2-9 0Z"
            stroke="#8B8D69"
            strokeWidth="1.7"
          />
        </g>
      )}
      {kind === 'lamp' && (
        <>
          <ellipse cx="160" cy="207" rx="47" ry="10" fill="#BD664B" />
          <path d="M145 119h30l9 80c2 15-50 15-48 0l9-80Z" fill="#DA8C6B" />
          <path d="M148 133h8l-3 62" stroke="#F0AA86" strokeWidth="5" opacity=".7" />
          <path d="M69 125a91 91 0 0 1 182 0c0 20-182 20-182 0Z" fill="#D68463" />
          <path
            d="M80 115c4-39 36-67 74-68"
            stroke="#EAA583"
            strokeWidth="7"
            strokeLinecap="round"
            opacity=".8"
          />
          <ellipse cx="160" cy="125" rx="91" ry="17" fill="#AB5D43" />
          <ellipse cx="160" cy="126" rx="77" ry="9" fill="#F7D4A3" />
          <path d="M185 202c17-1 33 7 48 10" stroke="#9B735C" strokeWidth="2" />
        </>
      )}
      {kind === 'bag' && (
        <>
          <path d="M122 95V70c0-49 77-49 77 0v25" stroke="#B6A78A" strokeWidth="13" />
          <path d="M122 95V70c0-49 77-49 77 0v25" stroke="#E0D3B9" strokeWidth="8" />
          <path d="M86 84h148l-6 125H93L86 84Z" fill={`url(#${id}-ceramic)`} />
          <path
            d="m97 95 5 106h117l6-106"
            stroke="#B8A98D"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <path d="m90 87 15 120m126-120-15 120" stroke="#B7AA8D" opacity=".55" />
          <path d="M134 142c17-19 35-17 51 0-16 21-34 23-51 0Z" stroke="#53664C" strokeWidth="2" />
          <path d="M144 142h31m-16-10v20" stroke="#53664C" strokeWidth="1.7" />
          <text
            x="160"
            y="174"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="14"
            letterSpacing="4"
            fill="#53664C"
          >
            SHIWU
          </text>
        </>
      )}
      {kind === 'headphones' && (
        <g transform="rotate(-9 160 135)">
          <path d="M95 151v-37a65 65 0 0 1 130 0v37" stroke="#BFBAB0" strokeWidth="19" />
          <path d="M95 132v-18a65 65 0 0 1 130 0v18" stroke="#F4F0E6" strokeWidth="15" />
          <path
            d="M111 85c20-28 70-28 91 0"
            stroke="#DFD8CC"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <rect x="84" y="124" width="39" height="80" rx="18" fill="#B6B2AA" />
          <rect x="82" y="124" width="29" height="78" rx="14" fill={`url(#${id}-metal)`} />
          <rect x="196" y="124" width="39" height="80" rx="18" fill="#B6B2AA" />
          <rect x="208" y="124" width="29" height="78" rx="14" fill={`url(#${id}-metal)`} />
          <path d="M91 143v40m137-40v40" stroke="#FFF9EB" strokeWidth="3" strokeLinecap="round" />
          <circle cx="222" cy="190" r="2" fill="#7C8370" />
        </g>
      )}
      {kind === 'notebook' && (
        <g transform="rotate(-13 160 135)">
          <path d="M105 58h113v148H105a8 8 0 0 1-8-8V66a8 8 0 0 1 8-8Z" fill="#DDD6C1" />
          <path
            d="M105 51h111v148H105a9 9 0 0 1-9-9V60a9 9 0 0 1 9-9Z"
            fill={`url(#${id}-green)`}
          />
          <path d="M108 51v148" stroke="#2D4938" strokeWidth="2" />
          <path d="M201 51v148" stroke="#283C2D" strokeWidth="5" />
          <path d="M168 198v20l8-5 8 5v-20" fill="#CA9A62" />
          <rect x="129" y="90" width="50" height="52" rx="1" stroke="#D6CDAA" opacity=".75" />
          <text
            x="154"
            y="112"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="9"
            letterSpacing="2"
            fill="#E2D8B7"
          >
            LITTLE
          </text>
          <text
            x="154"
            y="127"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="8"
            letterSpacing="1"
            fill="#E2D8B7"
          >
            MOMENTS
          </text>
          <path d="m225 81 5 108" stroke="#B28C57" strokeWidth="7" strokeLinecap="round" />
          <path d="m230 189 1 12 4-12" fill="#574832" />
        </g>
      )}
      {kind === 'vase' && (
        <>
          <path d="m162 127-13-89m15 91 35-87m-38 84-42-64" stroke="#8F8862" strokeWidth="2.5" />
          <path
            d="M146 59c-28 2-32-23-33-29 23-1 34 12 33 29Zm9 23c22-2 24-20 23-29-20 0-28 12-23 29Zm29-3c26 7 37-12 40-22-21-7-36 3-40 22Zm-47 7c-23 9-37-5-44-17 20-9 35-3 44 17Z"
            fill="#7C8B66"
          />
          <path
            d="M148 117h26v24c0 12 36 13 38 44 3 37-107 37-104 0 2-31 40-32 40-44v-24Z"
            fill={`url(#${id}-ceramic)`}
          />
          <ellipse cx="161" cy="118" rx="14" ry="4" fill="#B4A386" />
          <path
            d="M133 163c-22 13-13 30-9 35"
            stroke="#F2EADD"
            strokeWidth="5"
            strokeLinecap="round"
            opacity=".6"
          />
          <path
            d="M132 191h1m8-15h1m36 15h1m-25-33h1m35 19h1m-34 20h1"
            stroke="#A99A80"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}

function HeroScene() {
  return (
    <svg
      className="client-hero-scene"
      viewBox="0 0 600 440"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      role="img"
      aria-label="阳光下的绿叶、陶瓷杯与蘑菇台灯，组成一个安静的日常角落"
    >
      <defs>
        <linearGradient
          id="client-room"
          x1="0"
          y1="0"
          x2="600"
          y2="440"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E9E4D8" />
          <stop offset="1" stopColor="#C5C4AD" />
        </linearGradient>
        <linearGradient
          id="client-table"
          x1="80"
          y1="280"
          x2="510"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CBA983" />
          <stop offset="1" stopColor="#A67E59" />
        </linearGradient>
        <linearGradient
          id="client-shade"
          x1="290"
          y1="85"
          x2="470"
          y2="225"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EEE1BB" />
          <stop offset="1" stopColor="#CCB688" />
        </linearGradient>
      </defs>
      <path fill="url(#client-room)" d="M0 0h600v440H0z" />
      <path d="M332-40h167L335 440H168L332-40Z" fill="#FFF8DE" opacity=".38" />
      <path d="M534-40h70L440 440h-70L534-40Z" fill="#FFF8DE" opacity=".36" />
      <path d="M0 324h600" stroke="#A9AB91" opacity=".3" />
      <rect x="57" y="47" width="121" height="150" rx="1" fill="#C6BDA5" />
      <rect x="65" y="55" width="105" height="134" fill="#F2EDE0" />
      <path d="M86 155c0-67 56-78 64-15-22-26-44-17-64 15Z" fill="#7C8D6C" />
      <circle cx="139" cy="86" r="13" fill="#C5A376" />
      <path d="m80 175 72-33" stroke="#A7AE8B" strokeWidth="2" />
      <ellipse cx="301" cy="368" rx="224" ry="24" fill="#55513C" opacity=".12" />
      <path d="M93 301h407v28H93z" fill="#A47D57" />
      <path d="m115 324-10 116h19l21-116m307 0 18 116h19l-8-116" fill="#A7835D" />
      <ellipse cx="296" cy="298" rx="215" ry="51" fill="url(#client-table)" />
      <ellipse cx="296" cy="293" rx="215" ry="47" fill="#D1B18C" />
      <path
        d="M101 300c90 28 264 35 382-2M119 282c95 18 209 27 328 9"
        stroke="#B8956E"
        opacity=".4"
      />
      <ellipse cx="378" cy="288" rx="69" ry="14" fill="#9C815C" opacity=".28" />
      <ellipse cx="368" cy="279" rx="45" ry="11" fill="#A99A73" />
      <path d="M357 179h24l9 91c2 14-44 14-43 0l10-91Z" fill="#D5C197" />
      <path d="M278 180a90 90 0 0 1 180 0c0 19-180 19-180 0Z" fill="url(#client-shade)" />
      <ellipse cx="368" cy="180" rx="90" ry="16" fill="#A69A77" />
      <ellipse cx="368" cy="180" rx="77" ry="10" fill="#FAE9B6" />
      <path
        d="M291 160c9-40 35-61 63-64"
        stroke="#FFF3D3"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".45"
      />
      <path d="m146 282 2-129m1 72 29-75m-30 62-31-54" stroke="#6C7850" strokeWidth="3" />
      <path
        d="M148 184c-39 2-53-21-56-42 34-4 57 14 56 42Zm7 13c-4-33 23-53 47-54 1 33-17 55-47 54Zm-5-34c-29-15-30-44-20-64 25 14 33 39 20 64Zm-12 63c-34 6-49-14-55-34 31-9 53 4 55 34Zm18 13c3-31 30-44 51-40-7 30-27 43-51 40Z"
        fill="#526C48"
      />
      <path
        d="M145 180c-10-16-25-29-40-32m59 40 24-31m-44 63-44-20"
        stroke="#8F9E71"
        strokeWidth="1.5"
      />
      <path d="M116 247h63l-7 54c-1 10-47 10-49 0l-7-54Z" fill="#B5AA8B" />
      <ellipse cx="147" cy="247" rx="32" ry="8" fill="#958C6E" />
      <path d="M126 257h42m-40 12h38m-36 12h34m-32 12h30" stroke="#C9BDA1" strokeWidth="2" />
      <g transform="rotate(-8 255 291)">
        <path d="m198 282 83-8 27 22-86 9-24-23Z" fill="#3F5A43" />
        <path d="m221 305 86-9v7l-86 9v-7Z" fill="#E0D8C0" />
        <path d="m199 282 22 23v7l-22-23v-7Z" fill="#284530" />
      </g>
      <ellipse cx="245" cy="272" rx="32" ry="7" fill="#A08A68" opacity=".2" />
      <path d="M261 236c29-5 30 29 5 29" stroke="#EAE1CB" strokeWidth="7" />
      <path d="m217 234 5 34c2 12 42 12 44 0l4-34h-53Z" fill="#E7DDC5" />
      <ellipse cx="244" cy="234" rx="27" ry="7" fill="#F5EDDB" />
      <ellipse cx="244" cy="235" rx="21" ry="4" fill="#816448" />
      <path
        d="M548 342c-11-25-35-31-50-21-17 12-22 45-25 73h127v-57c-17-13-40-12-52 5Z"
        fill="#677B58"
      />
      <path d="m501 392 21-49m23 49 21-48" stroke="#8B9A75" strokeWidth="2" />
    </svg>
  )
}

type MobileTab = 'home' | 'categories' | 'favorites' | 'account'
type DemoOrder = { number: string; total: number; count: number }
const mobileTabs: { id: MobileTab; label: string; icon: 'home' | 'grid' | 'heart' | 'user' }[] = [
  { id: 'home', label: '首页', icon: 'home' },
  { id: 'categories', label: '分类', icon: 'grid' },
  { id: 'favorites', label: '心愿单', icon: 'heart' },
  { id: 'account', label: '我的', icon: 'user' },
]

export function ClientDemo() {
  const [tab, setTab] = useState<MobileTab>('home')
  const [category, setCategory] = useState<Category>('全部好物')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const favoritesOnly = tab === 'favorites'
  const [cart, setCart] = useState<Record<string, number>>({})
  const [notice, setNotice] = useState('')
  const [order, setOrder] = useState<DemoOrder | null>(null)
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const orderSequence = useRef(1)
  const bagRef = useRef<HTMLDialogElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const shownProducts = products.filter(
    (product) =>
      (category === '全部好物' || category === product.category) &&
      (!favoritesOnly || favorites.includes(product.id)) &&
      `${product.name}${product.subtitle}${product.category}`.includes(search.trim()),
  )
  const cartProducts = products.filter((product) => (cart[product.id] ?? 0) > 0)
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const subtotal = cartProducts.reduce(
    (sum, product) => sum + product.price * (cart[product.id] ?? 0),
    0,
  )

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  function navigate(next: MobileTab) {
    setTab(next)
    setCategory('全部好物')
    setSearch('')
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  function resetFilters() {
    navigate('home')
  }

  function selectCategory(next: Category) {
    setTab('categories')
    setCategory(next)
    setSearch('')
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  function addToBag(product: Product) {
    if ((cart[product.id] ?? 0) >= 99) {
      setNotice('每款商品最多添加 99 件')
      return
    }
    setCart((previous) => ({ ...previous, [product.id]: (previous[product.id] ?? 0) + 1 }))
    setNotice(`已将「${product.name}」加入购物袋`)
  }

  function changeQuantity(id: string, delta: number) {
    setCart((previous) => ({
      ...previous,
      [id]: Math.max(0, Math.min(99, (previous[id] ?? 0) + delta)),
    }))
  }

  function openBag() {
    setOrder(null)
    if (!bagRef.current?.open) bagRef.current?.showModal()
  }

  function checkout() {
    if (cartCount === 0) return
    const nextOrder = {
      number: `SW-DEMO-${String(orderSequence.current++).padStart(3, '0')}`,
      total: subtotal,
      count: cartCount,
    }
    setOrder(nextOrder)
    setOrders((previous) => [nextOrder, ...previous])
    setCart({})
  }

  return (
    <div className="client-demo">
      <a className="client-skip" href="#client-mobile-content">
        跳转到内容
      </a>
      <header className="client-header">
        <div className="client-header-top flex items-center">
          {tab === 'home' ? (
            <button
              type="button"
              className="client-wordmark"
              aria-label="拾物首页"
              onClick={resetFilters}
            >
              <span>
                拾物<span className="client-wordmark-dot">.</span>
              </span>
              <small>把喜欢，装进每一天</small>
            </button>
          ) : (
            <div className="client-page-title">
              {tab === 'categories' ? '发现好物' : tab === 'favorites' ? '我的心愿单' : '我的拾物'}
              <span>
                {tab === 'categories'
                  ? '按日常，慢慢挑选'
                  : tab === 'favorites'
                    ? `${favorites.length} 份小喜欢`
                    : '日常的小美好，都在这里'}
              </span>
            </div>
          )}
          <button
            className="client-icon-button client-bag-trigger"
            type="button"
            aria-label={`打开购物袋，${cartCount} 件商品`}
            onClick={openBag}
          >
            <Icon name="bag" size={23} />
            <span className="client-bag-count">{cartCount}</span>
          </button>
        </div>
        {tab !== 'account' && (
          <label className="client-search">
            <Icon name="search" size={18} />
            <span className="client-visually-hidden">搜索商品</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={favoritesOnly ? '在心愿单里找找' : '找找你的小喜欢'}
            />
            <span className="client-search-hint">好物在这里</span>
          </label>
        )}
      </header>
      <main
        className="client-mobile-content"
        id="client-mobile-content"
        ref={contentRef}
        tabIndex={-1}
      >
        {tab === 'home' && !search.trim() && (
          <>
            <section className="client-hero" aria-labelledby="client-title">
              <div className="client-hero-copy">
                <p className="client-eyebrow">THE EVERYDAY EDIT</p>
                <h1 id="client-title">
                  寻常日子，
                  <br />
                  也有<span>小小喜欢。</span>
                </h1>
                <p>把日子过成喜欢的样子。</p>
                <button
                  type="button"
                  className="client-hero-link"
                  onClick={() => selectCategory('居家日常')}
                >
                  探索居家好物
                  <Icon name="arrow" size={15} />
                </button>
              </div>
              <div className="client-hero-visual">
                <HeroScene />
              </div>
              <span className="client-hero-pagination">01 / 日常特辑</span>
            </section>
            <nav className="client-quick-categories" aria-label="快捷分类">
              {categories.map((item, index) => (
                <button type="button" key={item} onClick={() => selectCategory(item)}>
                  <span>
                    <Icon
                      name={
                        index === 0 ? 'grid' : index === 1 ? 'leaf' : index === 2 ? 'bag' : 'home'
                      }
                      size={24}
                    />
                  </span>
                  {item}
                </button>
              ))}
            </nav>
            <div className="client-curation-note">
              <span>
                <Icon name="leaf" size={14} />
                认真选物
              </span>
              <i />
              <span>自然相伴</span>
              <i />
              <span>好物长用</span>
              <span className="client-curation-en">SHIWU SELECT</span>
            </div>
          </>
        )}

        {tab === 'categories' && !search.trim() && (
          <section className="client-category-feature" aria-label="商品分类">
            <div>
              <p className="client-eyebrow">FIND YOUR EVERYDAY</p>
              <h1>每一种日常，都有小喜欢。</h1>
            </div>
            <div className="client-category-tiles">
              {categories.slice(1).map((item, index) => (
                <button
                  type="button"
                  key={item}
                  className={category === item ? 'is-selected' : ''}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  <ProductArt kind={index === 0 ? 'cup' : index === 1 ? 'bag' : 'notebook'} />
                  <strong>{item}</strong>
                  <span>
                    {products.filter((product) => product.category === item).length} 件好物
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === 'favorites' && (
          <div className="client-wishlist-note">
            <Icon name="heart" size={20} />
            <div>
              <h1>喜欢的，慢慢收集。</h1>
              <p>点亮爱心，把每一次心动留在这里。</p>
            </div>
          </div>
        )}

        {tab !== 'account' ? (
          <section
            className="client-products-section"
            id="client-products"
            aria-labelledby="client-products-title"
          >
            <div className="client-section-heading">
              <div>
                <p className="client-eyebrow">
                  {favoritesOnly ? 'YOUR LITTLE FAVORITES' : 'THOUGHTFULLY PICKED'}
                </p>
                <h2 id="client-products-title">
                  {favoritesOnly
                    ? '我的小喜欢'
                    : search.trim()
                      ? '找到这些好物'
                      : tab === 'categories'
                        ? category
                        : '为你拾选'}
                </h2>
              </div>
              <span>{shownProducts.length} 件好物</span>
            </div>
            {!favoritesOnly && (
              <div className="client-category-list" aria-label="筛选商品分类">
                {categories.map((item) => (
                  <button
                    type="button"
                    className={`client-category${category === item ? ' is-selected' : ''}`}
                    key={item}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
            <span className="client-visually-hidden" role="status">
              {shownProducts.length} 件好物{search.trim() && `，搜索“${search.trim()}”`}
            </span>
            <div className="client-product-grid">
              {shownProducts.map((product) => (
                <article className="client-product-card" key={product.id}>
                  <div className={`client-product-image client-product-image--${product.color}`}>
                    <ProductArt kind={product.kind} />
                    {product.label && <span className="client-product-label">{product.label}</span>}
                    <button
                      type="button"
                      className={`client-product-favorite${favorites.includes(product.id) ? ' is-favorite' : ''}`}
                      aria-label={`${favorites.includes(product.id) ? '取消收藏' : '收藏'}${product.name}`}
                      aria-pressed={favorites.includes(product.id)}
                      onClick={() =>
                        setFavorites((previous) =>
                          previous.includes(product.id)
                            ? previous.filter((id) => id !== product.id)
                            : [...previous, product.id],
                        )
                      }
                    >
                      <Icon name="heart" size={19} />
                    </button>
                  </div>
                  <div className="client-product-info">
                    <p className="client-product-category">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="client-product-subtitle">{product.subtitle}</p>
                    <div className="client-product-bottom">
                      <span className="client-price">{currency(product.price)}</span>
                      <button
                        type="button"
                        className="client-add-button"
                        onClick={() => addToBag(product)}
                        aria-label={`将${product.name}加入购物袋`}
                      >
                        <Icon name="plus" size={17} />
                        <span>加入购物袋</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {shownProducts.length === 0 && (
              <div className="client-empty">
                <Icon name={favoritesOnly ? 'heart' : 'search'} size={32} />
                <h3>{favoritesOnly ? '把喜欢的好物，留在这里' : '还没有找到这份小喜欢'}</h3>
                <p>
                  {favoritesOnly
                    ? '点击商品右上角的爱心，即可加入心愿单。'
                    : '试试搜索“陶瓷杯”“台灯”，或换一个分类。'}
                </p>
                <button className="client-secondary-button" type="button" onClick={resetFilters}>
                  看看全部好物
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="client-account" aria-labelledby="client-account-title">
            <div className="client-profile-card">
              <span className="client-profile-avatar">
                <Icon name="user" size={28} />
              </span>
              <div>
                <h1 id="client-account-title">你好，生活收藏家</h1>
                <p>访客模式 · 无需登录</p>
              </div>
              <span className="client-demo-tag">演示</span>
            </div>
            <div className="client-account-stats">
              <button type="button" onClick={() => navigate('favorites')}>
                <strong>{favorites.length}</strong>
                <span>我的心愿单</span>
              </button>
              <button type="button" onClick={openBag}>
                <strong>{cartCount}</strong>
                <span>购物袋好物</span>
              </button>
              <a href="#client-orders">
                <strong>{orders.length}</strong>
                <span>演示订单</span>
              </a>
            </div>
            <section className="client-orders" id="client-orders">
              <div className="client-section-heading">
                <h2>我的演示订单</h2>
                <span>仅本次会话</span>
              </div>
              {orders.length === 0 ? (
                <div className="client-empty">
                  <Icon name="bag" size={32} />
                  <h3>还没有订单</h3>
                  <p>挑一件喜欢的好物，体验一次模拟结算。</p>
                  <button className="client-secondary-button" type="button" onClick={resetFilters}>
                    去逛逛
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
              ) : (
                <ul className="client-order-history">
                  {orders.map((item) => (
                    <li key={item.number}>
                      <div>
                        <strong>{item.number}</strong>
                        <span>演示完成</span>
                      </div>
                      <p>
                        {item.count} 件好物 · 演示金额 {currency(item.total)}
                      </p>
                      <small>实际支付 ¥0，不会配送</small>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <div className="client-account-note">
              <Icon name="leaf" size={23} />
              <h2>只留下，真正喜欢的。</h2>
              <p>
                这是移动端 H5 交互示例。收藏、购物袋与订单仅保存在本次页面会话中，刷新后会重置。
              </p>
            </div>
          </section>
        )}
        <p className="client-local-note">拾物 SHIWU · 示例商品，无真实支付与配送</p>
      </main>
      <nav className="client-bottom-tabs" aria-label="移动端主导航">
        {mobileTabs.map((item) => (
          <button
            type="button"
            key={item.id}
            className={tab === item.id ? 'is-active' : ''}
            aria-current={tab === item.id ? 'page' : undefined}
            onClick={() => navigate(item.id)}
          >
            <span>
              <Icon name={item.icon} size={22} />
              {item.id === 'favorites' && favorites.length > 0 && <i />}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
      <div
        className={`client-toast${notice ? ' is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <Icon name="check" size={18} />
            {notice}
          </>
        )}
      </div>
      <dialog
        ref={bagRef}
        className="client-bag-dialog"
        aria-labelledby="client-bag-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) bagRef.current?.close()
        }}
      >
        <div className="client-bag-content">
          <div className="client-bag-heading">
            <div>
              <p className="client-eyebrow">YOUR LITTLE FAVORITES</p>
              <h2 id="client-bag-title">
                {order ? '演示订单已生成' : '我的购物袋'}
                {!order && <span>{cartCount}</span>}
              </h2>
            </div>
            <button
              type="button"
              className="client-icon-button"
              aria-label="关闭购物袋"
              onClick={() => bagRef.current?.close()}
            >
              <Icon name="close" />
            </button>
          </div>
          {order ? (
            <div className="client-order-success">
              <span className="client-order-check">
                <Icon name="check" size={32} />
              </span>
              <h3>把这份小喜欢，记下了。</h3>
              <p>这是一次本地模拟结算，不会支付或发货。</p>
              <dl>
                <div>
                  <dt>演示订单</dt>
                  <dd>{order.number}</dd>
                </div>
                <div>
                  <dt>商品数量</dt>
                  <dd>{order.count} 件</dd>
                </div>
                <div>
                  <dt>演示金额</dt>
                  <dd>{currency(order.total)}</dd>
                </div>
                <div>
                  <dt>实际付款</dt>
                  <dd>¥0 · 无真实支付</dd>
                </div>
              </dl>
              <button
                type="button"
                className="client-primary-button"
                onClick={() => bagRef.current?.close()}
              >
                继续逛逛
                <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : cartCount === 0 ? (
            <div className="client-empty client-bag-empty">
              <Icon name="bag" size={42} />
              <h3>购物袋里，还在等一份喜欢</h3>
              <p>从一只杯子，或一盏温暖的灯开始吧。</p>
              <button
                type="button"
                className="client-primary-button"
                onClick={() => bagRef.current?.close()}
              >
                去发现好物
                <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : (
            <>
              <ul className="client-bag-items">
                {cartProducts.map((product) => (
                  <li className="client-bag-item" key={product.id}>
                    <div className={`client-bag-image client-product-image--${product.color}`}>
                      <ProductArt kind={product.kind} />
                    </div>
                    <div className="client-bag-item-info">
                      <h3>{product.name}</h3>
                      <p>{product.subtitle}</p>
                      <strong>{currency(product.price)}</strong>
                      <div className="client-bag-item-actions">
                        <div className="client-quantity-control">
                          <button
                            type="button"
                            aria-label={`减少${product.name}数量`}
                            onClick={() => changeQuantity(product.id, -1)}
                          >
                            <Icon name="minus" size={14} />
                          </button>
                          <output aria-label={`${product.name}数量`}>{cart[product.id]}</output>
                          <button
                            type="button"
                            aria-label={`增加${product.name}数量`}
                            disabled={(cart[product.id] ?? 0) >= 99}
                            onClick={() => changeQuantity(product.id, 1)}
                          >
                            <Icon name="plus" size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="client-remove-button"
                          aria-label={`从购物袋移除${product.name}`}
                          onClick={() => setCart((previous) => ({ ...previous, [product.id]: 0 }))}
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="client-checkout">
                <div>
                  <span>商品合计（{cartCount} 件）</span>
                  <strong>{currency(subtotal)}</strong>
                </div>
                <p>仅演示交互流程，不产生真实支付或配送。</p>
                <button type="button" className="client-primary-button" onClick={checkout}>
                  生成演示订单
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  )
}
