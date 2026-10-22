import { Button, Input, ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import './index.scss'

type Category = '全部' | '日用好物' | '居家生活' | '出行随身'
type Tab = '发现' | '收藏' | '购物袋'
type Product = {
  id: string
  name: string
  note: string
  category: Category
  price: number
  art: string
  label: string
}

const products: Product[] = [
  {
    id: 'cup',
    name: '晨光陶瓷杯',
    note: '把日常，慢慢装满',
    category: '日用好物',
    price: 89,
    art: 'cup',
    label: '日常之选',
  },
  {
    id: 'lamp',
    name: '蘑菇小夜灯',
    note: '为夜晚留一盏温柔',
    category: '居家生活',
    price: 239,
    art: 'lamp',
    label: '人气好物',
  },
  {
    id: 'bag',
    name: '漫游帆布袋',
    note: '轻装出门，随心走走',
    category: '出行随身',
    price: 129,
    art: 'bag',
    label: '轻盈随行',
  },
  {
    id: 'book',
    name: '留白手帐本',
    note: '记录生活的小片段',
    category: '日用好物',
    price: 59,
    art: 'book',
    label: '灵感日常',
  },
  {
    id: 'bottle',
    name: '山野随行杯',
    note: '带上热爱，去远一点',
    category: '出行随身',
    price: 159,
    art: 'bottle',
    label: '秋日上新',
  },
  {
    id: 'vase',
    name: '岛屿花器',
    note: '把自然带回家',
    category: '居家生活',
    price: 169,
    art: 'vase',
    label: '自在角落',
  },
]
const categories: Category[] = ['全部', '日用好物', '居家生活', '出行随身']
const money = (value: number) => `¥${value.toFixed(2)}`

function ProductArt({ product }: { product: Product }) {
  return (
    <View className={`product-art product-art--${product.art}`}>
      <View className="art-shadow" />
      <View className={`art-object art-object--${product.art}`}>
        <View className="art-detail" />
      </View>
    </View>
  )
}

export default function Index() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return Taro.getStorageSync('lego-mini-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  const [tab, setTab] = useState<Tab>('发现')
  const [category, setCategory] = useState<Category>('全部')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const [notice, setNotice] = useState('')
  const [order, setOrder] = useState<{ amount: number; count: number; id: string } | null>(null)

  useEffect(() => {
    try {
      Taro.setStorageSync('lego-mini-theme', theme)
    } catch {
      /* Storage is optional for this demo. */
    }
    void Taro.setNavigationBarColor({
      frontColor: theme === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: theme === 'dark' ? '#18251e' : '#f5f3eb',
    })
  }, [theme])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 2400)
    return () => clearTimeout(timer)
  }, [notice])

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (tab !== '收藏' || favorites.includes(product.id)) &&
          (category === '全部' || product.category === category) &&
          `${product.name}${product.note}`.includes(search.trim()),
      ),
    [category, search, tab, favorites],
  )
  const cartProducts = products.filter((product) => (cart[product.id] ?? 0) > 0)
  const count = cartProducts.reduce((sum, product) => sum + (cart[product.id] ?? 0), 0)
  const total = cartProducts.reduce(
    (sum, product) => sum + product.price * (cart[product.id] ?? 0),
    0,
  )

  function switchTab(next: Tab) {
    setTab(next)
    setCategory('全部')
    setSearch('')
    void Taro.pageScrollTo({ scrollTop: 0, duration: 0 })
  }
  function toggleFavorite(product: Product) {
    const saved = favorites.includes(product.id)
    setFavorites((current) =>
      saved ? current.filter((id) => id !== product.id) : [...current, product.id],
    )
    setNotice(saved ? '已取消收藏' : '已加入心愿清单')
  }
  function addToCart(product: Product) {
    if ((cart[product.id] ?? 0) >= 99) {
      setNotice('每件商品最多添加 99 件')
      return
    }
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }))
    setOrder(null)
    setNotice(`${product.name} 已加入购物袋`)
  }
  function updateQuantity(id: string, delta: number) {
    setCart((current) => ({
      ...current,
      [id]: Math.min(99, Math.max(0, (current[id] ?? 0) + delta)),
    }))
  }
  function checkout() {
    if (count === 0) return
    setOrder({ amount: total, count, id: `SW${Date.now().toString().slice(-8)}` })
    setCart({})
  }

  return (
    <View className={`shop shop--${theme}`}>
      <View className="shop-heading">
        <View>
          <Text className="eyebrow">LITTLE THINGS, GOOD DAYS</Text>
          <View className="brand-name">
            拾物<Text className="brand-word">SHIWU</Text>
          </View>
        </View>
        <Button
          className="theme-button"
          ariaLabel={theme === 'light' ? '切换深色模式' : '切换浅色模式'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '☾' : '☀'}
        </Button>
      </View>

      {tab !== '购物袋' ? (
        <>
          <View className="search-bar">
            <Text className="search-mark">⌕</Text>
            <Input
              className="search-input"
              value={search}
              placeholder="搜一搜，让日常更美好的小物"
              placeholderClass="search-placeholder"
              ariaLabel="搜索商品"
              onInput={(event) => setSearch(event.detail.value)}
            />
            {search && (
              <Button className="search-clear" ariaLabel="清空搜索" onClick={() => setSearch('')}>
                ×
              </Button>
            )}
          </View>
          {tab === '发现' && !search && (
            <View className="hero">
              <View className="hero-copy">
                <Text className="hero-kicker">SLOW LIVING · VOL. 01</Text>
                <View className="hero-title">
                  日常有光，<View>生活有物。</View>
                </View>
                <Text className="hero-note">为平凡的日子，挑一点喜欢。</Text>
                <Button
                  className="hero-action"
                  onClick={() => {
                    setCategory('居家生活')
                    void Taro.pageScrollTo({ selector: '#catalog', duration: 250 })
                  }}
                >
                  探索居家好物 <Text>↗</Text>
                </Button>
              </View>
              <View className="hero-art">
                <View className="hero-circle" />
                <View className="hero-vase" />
                <View className="hero-stem" />
                <View className="hero-leaf hero-leaf--one" />
                <View className="hero-leaf hero-leaf--two" />
                <View className="hero-ball" />
              </View>
              <Text className="hero-number">VOL. 01</Text>
            </View>
          )}
          <View className="catalog-heading" id="catalog">
            <View>
              <Text className="section-kicker">
                {tab === '收藏' ? 'YOUR WISHLIST' : 'CURATED FOR YOU'}
              </Text>
              <View className="section-title">{tab === '收藏' ? '心动收藏' : '发现好物'}</View>
            </View>
            <Text className="result-count">{visibleProducts.length} 件好物</Text>
          </View>
          <ScrollView scrollX className="categories" showScrollbar={false}>
            <View className="category-row">
              {categories.map((item) => (
                <Button
                  key={item}
                  className={`category-chip ${category === item ? 'category-chip--active' : ''}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </Button>
              ))}
            </View>
          </ScrollView>
          {visibleProducts.length ? (
            <View className="product-grid">
              {visibleProducts.map((product) => (
                <View className="product-card" key={product.id}>
                  <View className="product-visual">
                    <ProductArt product={product} />
                    <Text className="product-label">{product.label}</Text>
                    <Button
                      className={`favorite-button ${favorites.includes(product.id) ? 'favorite-button--active' : ''}`}
                      ariaLabel={`${favorites.includes(product.id) ? '取消收藏' : '收藏'}${product.name}`}
                      onClick={() => toggleFavorite(product)}
                    >
                      {favorites.includes(product.id) ? '♥' : '♡'}
                    </Button>
                  </View>
                  <View className="product-name">{product.name}</View>
                  <Text className="product-note">{product.note}</Text>
                  <View className="product-bottom">
                    <Text className="product-price">
                      ¥{product.price}
                      <Text className="price-decimal">.00</Text>
                    </Text>
                    <Button
                      className="add-button"
                      ariaLabel={`添加${product.name}到购物袋`}
                      onClick={() => addToCart(product)}
                    >
                      ＋
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="empty-state">
              <Text className="empty-icon">{tab === '收藏' ? '♡' : '⌕'}</Text>
              <View className="empty-title">
                {tab === '收藏' && !favorites.length ? '收藏一点喜欢' : '还没有找到这件好物'}
              </View>
              <Text className="empty-note">
                {tab === '收藏' && !favorites.length
                  ? '点一下商品上的爱心，留住心动瞬间。'
                  : '换个关键词，或看看全部分类。'}
              </Text>
              <Button
                className="secondary-button"
                onClick={() => {
                  setSearch('')
                  setCategory('全部')
                  setTab('发现')
                }}
              >
                去发现好物 →
              </Button>
            </View>
          )}
          <View className="catalog-end">
            <View className="end-line" />
            <Text>少一点将就，多一点喜欢</Text>
            <View className="end-line" />
          </View>
        </>
      ) : (
        <>
          <View className="catalog-heading cart-heading">
            <View>
              <Text className="section-kicker">A BAG OF GOOD THINGS</Text>
              <View className="section-title">我的购物袋</View>
            </View>
            <Text className="result-count">{count} 件商品</Text>
          </View>
          {order && (
            <View className="order-card">
              <Text className="order-check">✓</Text>
              <View className="empty-title">好物已备好，期待下次相遇</View>
              <Text className="empty-note">演示订单 {order.id}</Text>
              <View className="order-amount">
                {order.count} 件商品 · {money(order.amount)}
              </View>
              <Text className="demo-disclaimer">这是本地模拟订单，不会付款或发货。</Text>
              <Button className="secondary-button" onClick={() => switchTab('发现')}>
                继续逛逛 →
              </Button>
            </View>
          )}
          {cartProducts.length > 0 ? (
            <>
              <View className="cart-list">
                {cartProducts.map((product) => (
                  <View className="cart-item" key={product.id}>
                    <View className="cart-art">
                      <ProductArt product={product} />
                    </View>
                    <View className="cart-info">
                      <View className="cart-item-top">
                        <Text className="product-name">{product.name}</Text>
                        <Button
                          className="remove-button"
                          ariaLabel={`移除${product.name}`}
                          onClick={() => setCart((current) => ({ ...current, [product.id]: 0 }))}
                        >
                          ×
                        </Button>
                      </View>
                      <Text className="product-note">{product.note}</Text>
                      <View className="cart-item-bottom">
                        <Text className="product-price">¥{product.price}</Text>
                        <View className="quantity-control">
                          <Button
                            ariaLabel={`减少${product.name}数量`}
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            −
                          </Button>
                          <Text>{cart[product.id]}</Text>
                          <Button
                            ariaLabel={`增加${product.name}数量`}
                            disabled={(cart[product.id] ?? 0) >= 99}
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            ＋
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              <View className="cart-summary">
                <View className="summary-row">
                  <Text>商品小计</Text>
                  <Text>{money(total)}</Text>
                </View>
                <View className="summary-row">
                  <Text>运费</Text>
                  <Text className="free-shipping">包邮</Text>
                </View>
                <View className="summary-total">
                  <Text>合计</Text>
                  <Text>{money(total)}</Text>
                </View>
                <Button className="checkout-button" onClick={checkout}>
                  模拟下单 · {count} 件<Text>→</Text>
                </Button>
                <Text className="demo-disclaimer">仅用于交互体验，无真实付款、库存或物流。</Text>
              </View>
            </>
          ) : (
            !order && (
              <View className="empty-state cart-empty">
                <Text className="empty-icon">♧</Text>
                <View className="empty-title">给生活添一点好物</View>
                <Text className="empty-note">购物袋还是空的，去发现你的小小心动。</Text>
                <Button className="secondary-button" onClick={() => switchTab('发现')}>
                  开始逛逛 →
                </Button>
              </View>
            )
          )}
        </>
      )}
      <View className="demo-note">LEGO 移动端示例 · 微信小程序</View>
      {notice && <View className="notice">{notice}</View>}
      <View className="tabbar">
        {(['发现', '收藏', '购物袋'] as Tab[]).map((item) => (
          <Button
            key={item}
            className={`tabbar-item ${tab === item ? 'tabbar-item--active' : ''}`}
            onClick={() => switchTab(item)}
          >
            <View className="tabbar-icon">
              {item === '发现' ? '⌂' : item === '收藏' ? '♡' : '♧'}
              {item === '购物袋' && count > 0 && (
                <Text className="cart-badge">{count > 99 ? '99+' : count}</Text>
              )}
            </View>
            <Text>{item}</Text>
          </Button>
        ))}
      </View>
    </View>
  )
}
