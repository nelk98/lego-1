import { useMemo, useState } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const products = [
  {
    id: 'cup',
    name: '山岚陶瓷杯',
    note: '手心里的温度',
    category: '居家',
    price: 89,
    color: '#e9e0ce',
    label: '人气好物',
  },
  {
    id: 'lamp',
    name: '微光桌灯',
    note: '留一盏灯给自己',
    category: '居家',
    price: 239,
    color: '#e3e7d8',
    label: '编辑推荐',
  },
  {
    id: 'bag',
    name: '日常帆布袋',
    note: '轻装，慢慢走',
    category: '出行',
    price: 69,
    color: '#dfdfce',
    label: '轻盈随行',
  },
  {
    id: 'book',
    name: '留白手账本',
    note: '记录平凡的好日子',
    category: '文具',
    price: 49,
    color: '#e6d9d1',
    label: '本周上新',
  },
  {
    id: 'bottle',
    name: '随行保温瓶',
    note: '把温暖带在身边',
    category: '出行',
    price: 129,
    color: '#dbe4e0',
    label: '旅途常伴',
  },
  {
    id: 'box',
    name: '木色收纳盒',
    note: '给小物一个家',
    category: '居家',
    price: 119,
    color: '#e8decd',
    label: '自然材质',
  },
] as const

const categories = ['全部', '居家', '出行', '文具'] as const
type Product = (typeof products)[number]
type ProductId = Product['id']
type Category = (typeof categories)[number]
type Cart = Partial<Record<ProductId, number>>

// 示例局部 token；公共 @lego/styles 主题适配器仍按架构文档独立实现。
const themes = {
  light: {
    background: '#f8f6f0',
    surface: '#ffffff',
    mutedSurface: '#efede5',
    text: '#233d30',
    muted: '#768074',
    border: '#e4e6dd',
    brand: '#345b45',
    brandText: '#ffffff',
    soft: '#e6ecdf',
    danger: '#a85145',
  },
  dark: {
    background: '#171f1a',
    surface: '#222c25',
    mutedSurface: '#2b352e',
    text: '#edf2e7',
    muted: '#abb6a7',
    border: '#39443b',
    brand: '#b7d5ad',
    brandText: '#203828',
    soft: '#344534',
    danger: '#efb4a6',
  },
}
type Theme = typeof themes.light

function ProductArt({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[artStyles.canvas, { backgroundColor: product.color }, compact && artStyles.compact]}
    >
      <View style={[artStyles.shadow, compact && { width: 50, bottom: 12 }]} />
      <View style={compact ? artStyles.smallDrawing : artStyles.drawing}>
        {product.id === 'cup' && (
          <>
            <View style={artStyles.cupHandle} />
            <View style={artStyles.cup} />
            <View style={artStyles.cupRim} />
          </>
        )}
        {product.id === 'lamp' && (
          <>
            <View style={artStyles.lampStem} />
            <View style={artStyles.lampBase} />
            <View style={artStyles.lampShade} />
          </>
        )}
        {product.id === 'bag' && (
          <>
            <View style={artStyles.bagHandle} />
            <View style={artStyles.bag} />
            <Text style={artStyles.bagLogo}>SHIWU</Text>
          </>
        )}
        {product.id === 'book' && (
          <>
            <View style={artStyles.bookPages} />
            <View style={artStyles.book} />
            <View style={artStyles.bookSpine} />
            <Text style={artStyles.bookLabel}>NOTES{'\n'}/ 2026</Text>
          </>
        )}
        {product.id === 'bottle' && (
          <>
            <View style={artStyles.bottleCap} />
            <View style={artStyles.bottle} />
            <View style={artStyles.bottleLine} />
          </>
        )}
        {product.id === 'box' && (
          <>
            <View style={artStyles.box} />
            <View style={artStyles.boxLid} />
            <View style={artStyles.boxHandle} />
          </>
        )}
      </View>
    </View>
  )
}

function Shop() {
  const preferredTheme = useColorScheme()
  const [dark, setDark] = useState(preferredTheme === 'dark')
  const theme = dark ? themes.dark : themes.light
  const styles = useMemo(() => createStyles(theme), [theme])
  const [tab, setTab] = useState<'home' | 'favorites'>('home')
  const [category, setCategory] = useState<Category>('全部')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<ProductId[]>([])
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [orderCount, setOrderCount] = useState(0)

  const filteredProducts = products.filter(
    (product) =>
      (tab !== 'favorites' || favorites.includes(product.id)) &&
      (category === '全部' || product.category === category) &&
      `${product.name} ${product.note}`.includes(query.trim()),
  )
  const bagProducts = products.filter((product) => (cart[product.id] ?? 0) > 0)
  const bagCount = bagProducts.reduce((count, product) => count + (cart[product.id] ?? 0), 0)
  const subtotal = bagProducts.reduce(
    (sum, product) => sum + product.price * (cart[product.id] ?? 0),
    0,
  )

  function addToCart(product: Product) {
    const current = cart[product.id] ?? 0
    if (current >= 99) {
      setMessage('每件商品最多添加 99 件')
      return
    }
    setCart((items) => ({ ...items, [product.id]: Math.min(99, (items[product.id] ?? 0) + 1) }))
    setMessage(`${product.name}已加入购物袋`)
  }

  function changeQuantity(id: ProductId, amount: number) {
    setCart((items) => ({ ...items, [id]: Math.min(99, Math.max(0, (items[id] ?? 0) + amount)) }))
  }

  function checkout() {
    if (bagCount === 0) return
    setMessage(
      `模拟订单 SW${String(orderCount + 1).padStart(4, '0')} 已生成，共 ${bagCount} 件 / ¥${subtotal}。未产生真实支付。`,
    )
    setOrderCount((count) => count + 1)
    setCart({})
    setCartOpen(false)
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>
            拾物 <Text style={styles.english}>SHIWU</Text>
          </Text>
          <Text style={styles.caption}>把喜欢，放进日常</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dark ? '切换浅色模式' : '切换深色模式'}
          onPress={() => setDark((value) => !value)}
          style={styles.themeButton}
        >
          <Text style={styles.themeIcon}>{dark ? '☀' : '☾'}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.platformRow}>
          <View style={styles.dot} />
          <Text style={styles.platformText}>
            {Platform.OS === 'ios' ? 'iOS' : 'Android'} 原生示例 · 自建组件
          </Text>
          <Text style={styles.issue}>VOL. 01</Text>
        </View>
        {tab === 'home' && (
          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>THE EVERYDAY EDIT</Text>
              <Text style={styles.heroTitle}>日子慢一点，{'\n'}喜欢多一点。</Text>
              <Text style={styles.heroNote}>从一件好物，开始好好生活。</Text>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>本周生活提案 ↗</Text>
              </View>
            </View>
            <View accessible={false} style={styles.heroArt}>
              <View style={styles.heroCircle} />
              <View style={styles.heroCupHandle} />
              <View style={styles.heroCup} />
              <View style={styles.heroPlate} />
            </View>
          </View>
        )}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            accessibilityLabel="搜索商品"
            placeholder="搜索一件喜欢的好物"
            placeholderTextColor={theme.muted}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: category === item }}
              accessibilityLabel={`分类：${item}`}
              style={[styles.category, category === item && styles.categorySelected]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextSelected]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{tab === 'home' ? '今日精选' : '我的收藏'}</Text>
          <Text style={styles.sectionNote}>{filteredProducts.length} 件心意好物</Text>
        </View>
        {message !== '' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="关闭提示"
            onPress={() => setMessage('')}
            style={styles.message}
          >
            <Text accessibilityLiveRegion="polite" style={styles.messageText}>
              {message}
            </Text>
            <Text style={styles.messageText}>×</Text>
          </Pressable>
        )}
        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImage}>
                <ProductArt product={product} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${favorites.includes(product.id) ? '取消收藏' : '收藏'}${product.name}`}
                  accessibilityState={{ selected: favorites.includes(product.id) }}
                  hitSlop={6}
                  onPress={() =>
                    setFavorites((items) =>
                      items.includes(product.id)
                        ? items.filter((id) => id !== product.id)
                        : [...items, product.id],
                    )
                  }
                  style={styles.favorite}
                >
                  <Text style={styles.favoriteIcon}>
                    {favorites.includes(product.id) ? '♥' : '♡'}
                  </Text>
                </Pressable>
                <View style={styles.productTag}>
                  <Text style={styles.productTagText}>{product.label}</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productNote}>{product.note}</Text>
                <View style={styles.productBottom}>
                  <Text style={styles.price}>
                    <Text style={styles.currency}>¥ </Text>
                    {product.price}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`将${product.name}加入购物袋`}
                    hitSlop={5}
                    onPress={() => addToCart(product)}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>＋</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
        {filteredProducts.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>♡</Text>
            <Text style={styles.emptyTitle}>
              {tab === 'favorites' && favorites.length === 0
                ? '把喜欢的好物收藏起来'
                : '没有找到匹配的好物'}
            </Text>
            <Text style={styles.emptyNote}>
              {tab === 'favorites' && favorites.length === 0
                ? '点击商品上的爱心，下次来这里找。'
                : '试试其他关键词或商品分类。'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setQuery('')
                setCategory('全部')
                setTab('home')
              }}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>看看全部好物</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.footnote}>
          <Text style={styles.footnoteTitle}>少一点，刚刚好。</Text>
          <Text style={styles.footnoteText}>本地演示商品 · 不产生真实交易</Text>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.tabBarSafe}>
        <View style={styles.tabBar}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'home' }}
            accessibilityLabel="逛逛"
            onPress={() => {
              setTab('home')
              setQuery('')
              setCategory('全部')
            }}
            style={styles.tab}
          >
            <Text style={[styles.tabIcon, tab === 'home' && styles.tabActive]}>⌂</Text>
            <Text style={[styles.tabText, tab === 'home' && styles.tabActive]}>逛逛</Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'favorites' }}
            accessibilityLabel={`收藏，${favorites.length}件`}
            onPress={() => {
              setTab('favorites')
              setQuery('')
              setCategory('全部')
            }}
            style={styles.tab}
          >
            <Text style={[styles.tabIcon, tab === 'favorites' && styles.tabActive]}>♡</Text>
            <Text style={[styles.tabText, tab === 'favorites' && styles.tabActive]}>收藏</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`购物袋，${bagCount}件商品`}
            onPress={() => {
              setCartOpen(true)
              setMessage('')
            }}
            style={styles.tab}
          >
            <View>
              <Text style={styles.tabIcon}>♧</Text>
              {bagCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{bagCount > 99 ? '99+' : bagCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.tabText}>购物袋</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal visible={cartOpen} animationType="slide" onRequestClose={() => setCartOpen(false)}>
        <SafeAreaView style={styles.screen}>
          <View style={styles.bagHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="关闭购物袋"
              onPress={() => setCartOpen(false)}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>
              我的购物袋 <Text style={styles.caption}>({bagCount})</Text>
            </Text>
            <View style={styles.backButton} />
          </View>
          <ScrollView contentContainerStyle={styles.bagContent}>
            <Text style={styles.bagIntro}>好物不必太多，喜欢的刚刚好。</Text>
            {bagProducts.map((product) => (
              <View key={product.id} style={styles.bagRow}>
                <View style={styles.bagArt}>
                  <ProductArt product={product} compact />
                </View>
                <View style={styles.bagInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productNote}>{product.note}</Text>
                  <Text style={styles.bagPrice}>¥{product.price}</Text>
                  <View style={styles.quantityRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`减少${product.name}数量`}
                      hitSlop={6}
                      onPress={() => changeQuantity(product.id, -1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityText}>−</Text>
                    </Pressable>
                    <Text
                      accessibilityLabel={`${product.name}数量 ${cart[product.id] ?? 0}`}
                      style={styles.quantityValue}
                    >
                      {cart[product.id] ?? 0}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`增加${product.name}数量`}
                      hitSlop={6}
                      accessibilityState={{ disabled: (cart[product.id] ?? 0) >= 99 }}
                      disabled={(cart[product.id] ?? 0) >= 99}
                      onPress={() => changeQuantity(product.id, 1)}
                      style={[
                        styles.quantityButton,
                        (cart[product.id] ?? 0) >= 99 && styles.disabled,
                      ]}
                    >
                      <Text style={styles.quantityText}>＋</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`移除${product.name}`}
                      onPress={() => setCart((items) => ({ ...items, [product.id]: 0 }))}
                      style={styles.remove}
                    >
                      <Text style={styles.removeText}>移除</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            {bagCount === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>♧</Text>
                <Text style={styles.emptyTitle}>购物袋还是空的</Text>
                <Text style={styles.emptyNote}>去发现一件让日常更美好的小物。</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setCartOpen(false)
                    setTab('home')
                  }}
                  style={styles.emptyButton}
                >
                  <Text style={styles.emptyButtonText}>继续逛逛</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
          <View style={styles.checkout}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>合计 · {bagCount} 件</Text>
              <Text style={styles.totalPrice}>¥{subtotal}</Text>
            </View>
            <Text style={styles.checkoutNote}>
              仅模拟下单，不支付、不发货；重启应用会清空数据。
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="模拟下单"
              accessibilityState={{ disabled: bagCount === 0 }}
              disabled={bagCount === 0}
              style={[styles.checkoutButton, bagCount === 0 && styles.disabled]}
              onPress={checkout}
            >
              <Text style={styles.checkoutButtonText}>模拟下单 →</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Shop />
    </SafeAreaProvider>
  )
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingHorizontal: 22,
      paddingTop: 14,
      paddingBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    wordmark: { fontSize: 25, fontWeight: '700', color: theme.text, letterSpacing: 2 },
    english: { fontSize: 11, letterSpacing: 3, fontWeight: '500' },
    caption: { fontSize: 11, color: theme.muted, letterSpacing: 1, marginTop: 4 },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.border,
      borderWidth: 1,
    },
    themeIcon: { fontSize: 25, color: theme.text },
    body: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    platformRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 15 },
    dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: theme.brand },
    platformText: { fontSize: 10, color: theme.muted, letterSpacing: 1 },
    issue: { marginLeft: 'auto', fontSize: 9, color: theme.muted, letterSpacing: 2 },
    hero: {
      minHeight: 190,
      borderRadius: 20,
      backgroundColor: '#34533d',
      overflow: 'hidden',
      flexDirection: 'row',
      marginBottom: 21,
    },
    heroCopy: { padding: 22, zIndex: 2, flex: 1 },
    heroEyebrow: { fontSize: 8, letterSpacing: 2, color: '#ccdac3', marginBottom: 13 },
    heroTitle: {
      fontSize: 25,
      lineHeight: 35,
      color: '#f5f4e6',
      fontWeight: '600',
      letterSpacing: 1,
    },
    heroNote: { fontSize: 10, color: '#d4dfce', marginTop: 9 },
    heroPill: {
      alignSelf: 'flex-start',
      marginTop: 15,
      borderBottomWidth: 1,
      borderColor: '#a4b69a',
      paddingBottom: 4,
    },
    heroPillText: { fontSize: 10, color: '#e8efdf' },
    heroArt: { position: 'absolute', width: 120, height: 190, right: 0, bottom: 0, opacity: 0.95 },
    heroCircle: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: '#5f7857',
      right: -22,
      top: 22,
    },
    heroCup: {
      width: 60,
      height: 72,
      backgroundColor: '#d9d3bb',
      position: 'absolute',
      top: 82,
      left: 25,
      borderBottomLeftRadius: 17,
      borderBottomRightRadius: 17,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderTopColor: '#eee5ca',
      borderTopWidth: 6,
    },
    heroCupHandle: {
      width: 33,
      height: 39,
      borderWidth: 8,
      borderColor: '#d9d3bb',
      borderRadius: 17,
      position: 'absolute',
      top: 90,
      right: 15,
    },
    heroPlate: {
      position: 'absolute',
      bottom: 23,
      left: 12,
      width: 90,
      height: 10,
      backgroundColor: '#b6bb99',
      borderRadius: 45,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      backgroundColor: theme.surface,
      borderRadius: 13,
      paddingHorizontal: 14,
      borderColor: theme.border,
      borderWidth: 1,
    },
    searchIcon: { fontSize: 27, color: theme.muted, marginRight: 9 },
    searchInput: { flex: 1, fontSize: 12, color: theme.text, height: 46, paddingVertical: 0 },
    categories: { gap: 10, paddingVertical: 18 },
    category: {
      paddingHorizontal: 21,
      paddingVertical: 10,
      borderRadius: 22,
      backgroundColor: theme.mutedSurface,
    },
    categorySelected: { backgroundColor: theme.brand },
    categoryText: { color: theme.muted, fontSize: 12 },
    categoryTextSelected: { color: theme.brandText, fontWeight: '600' },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 3,
      marginBottom: 15,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.text, letterSpacing: 1 },
    sectionNote: { color: theme.muted, fontSize: 10 },
    message: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      padding: 12,
      borderRadius: 10,
      backgroundColor: theme.soft,
      marginBottom: 14,
    },
    messageText: { color: theme.text, fontSize: 11, lineHeight: 18, flexShrink: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 13 },
    productCard: {
      width: '47%',
      flexGrow: 1,
      maxWidth: '49%',
      backgroundColor: theme.surface,
      borderRadius: 15,
      overflow: 'hidden',
      marginBottom: 2,
    },
    productImage: { position: 'relative' },
    favorite: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 33,
      height: 33,
      borderRadius: 17,
      backgroundColor: '#ffffffd9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoriteIcon: { fontSize: 24, color: '#3a5841' },
    productTag: {
      position: 'absolute',
      bottom: 9,
      left: 9,
      backgroundColor: '#ffffffc9',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
    },
    productTagText: { fontSize: 8, color: '#4f5c48' },
    productInfo: { padding: 12 },
    productName: { fontSize: 13, fontWeight: '600', color: theme.text },
    productNote: { fontSize: 10, color: theme.muted, marginTop: 5 },
    productBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    price: { fontSize: 19, fontWeight: '600', color: theme.text },
    currency: { fontSize: 11 },
    addButton: {
      width: 34,
      height: 34,
      backgroundColor: theme.soft,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: { fontSize: 23, color: theme.text },
    empty: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 10 },
    emptyIcon: { color: theme.muted, fontSize: 48 },
    emptyTitle: { color: theme.text, fontSize: 16, marginTop: 14 },
    emptyNote: {
      color: theme.muted,
      fontSize: 12,
      lineHeight: 20,
      textAlign: 'center',
      marginTop: 10,
    },
    emptyButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 22,
      backgroundColor: theme.soft,
      marginTop: 20,
    },
    emptyButtonText: { color: theme.text, fontSize: 12 },
    footnote: { alignItems: 'center', paddingVertical: 30, gap: 9 },
    footnoteTitle: { fontSize: 13, letterSpacing: 3, color: theme.muted },
    footnoteText: { fontSize: 9, color: theme.muted },
    tabBarSafe: { backgroundColor: theme.surface, borderTopWidth: 1, borderColor: theme.border },
    tabBar: { flexDirection: 'row', height: 62, alignItems: 'center' },
    tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 48 },
    tabIcon: { fontSize: 26, lineHeight: 30, color: theme.muted },
    tabText: { fontSize: 10, color: theme.muted },
    tabActive: { color: theme.brand, fontWeight: '700' },
    badge: {
      position: 'absolute',
      top: -3,
      right: -15,
      minWidth: 17,
      height: 17,
      paddingHorizontal: 3,
      borderRadius: 9,
      backgroundColor: theme.brand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: { color: theme.brandText, fontSize: 9, fontWeight: '600' },
    bagHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 36, color: theme.text },
    bagContent: { paddingHorizontal: 20, paddingBottom: 20 },
    bagIntro: { fontSize: 12, color: theme.muted, paddingVertical: 24 },
    bagRow: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      padding: 13,
      borderRadius: 15,
      gap: 14,
      marginBottom: 14,
    },
    bagArt: { width: 90, height: 110, borderRadius: 10, overflow: 'hidden' },
    bagInfo: { flex: 1, paddingVertical: 3 },
    bagPrice: { fontSize: 16, color: theme.text, fontWeight: '600', marginTop: 11 },
    quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 7,
      backgroundColor: theme.mutedSurface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: { fontSize: 17, color: theme.text },
    quantityValue: { width: 32, textAlign: 'center', fontSize: 12, color: theme.text },
    remove: { marginLeft: 'auto', paddingVertical: 8, paddingLeft: 8 },
    removeText: { fontSize: 10, color: theme.muted },
    checkout: {
      padding: 20,
      backgroundColor: theme.surface,
      borderTopColor: theme.border,
      borderTopWidth: 1,
    },
    totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    totalLabel: { color: theme.text, fontSize: 13 },
    totalPrice: { color: theme.text, fontSize: 27, fontWeight: '600' },
    checkoutNote: { color: theme.muted, fontSize: 10, lineHeight: 17, marginVertical: 10 },
    checkoutButton: {
      height: 50,
      borderRadius: 13,
      backgroundColor: theme.brand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkoutButtonText: {
      color: theme.brandText,
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 2,
    },
    disabled: { opacity: 0.4 },
  })
}

const artStyles = StyleSheet.create({
  canvas: { height: 155, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  compact: { height: 110 },
  drawing: { width: 130, height: 140 },
  smallDrawing: { width: 130, height: 140, transform: [{ scale: 0.65 }] },
  shadow: {
    position: 'absolute',
    bottom: 20,
    width: 80,
    height: 10,
    borderRadius: 50,
    backgroundColor: '#53492d1a',
  },
  cup: {
    position: 'absolute',
    left: 26,
    top: 42,
    width: 65,
    height: 68,
    backgroundColor: '#a2ac8b',
    borderBottomLeftRadius: 19,
    borderBottomRightRadius: 19,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  cupHandle: {
    position: 'absolute',
    left: 78,
    top: 50,
    width: 34,
    height: 40,
    borderRadius: 18,
    borderWidth: 8,
    borderColor: '#909e79',
  },
  cupRim: {
    position: 'absolute',
    left: 26,
    top: 39,
    width: 65,
    height: 10,
    borderRadius: 32,
    backgroundColor: '#c4c9af',
    borderColor: '#8d9877',
    borderWidth: 3,
  },
  lampShade: {
    position: 'absolute',
    left: 24,
    top: 32,
    width: 85,
    height: 43,
    backgroundColor: '#b5aa87',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  lampStem: {
    position: 'absolute',
    left: 63,
    top: 64,
    width: 7,
    height: 46,
    backgroundColor: '#877f63',
  },
  lampBase: {
    position: 'absolute',
    left: 43,
    top: 107,
    width: 48,
    height: 9,
    backgroundColor: '#9c9270',
    borderRadius: 20,
  },
  bag: {
    position: 'absolute',
    left: 25,
    top: 51,
    width: 78,
    height: 65,
    backgroundColor: '#f2e9d3',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: '#c8bd9f',
    borderWidth: 1,
  },
  bagHandle: {
    position: 'absolute',
    left: 45,
    top: 24,
    width: 38,
    height: 48,
    borderWidth: 6,
    borderColor: '#cabf9f',
    borderRadius: 20,
  },
  bagLogo: {
    position: 'absolute',
    left: 43,
    top: 79,
    fontSize: 9,
    color: '#69785a',
    letterSpacing: 1,
  },
  bookPages: {
    position: 'absolute',
    left: 39,
    top: 33,
    width: 60,
    height: 86,
    backgroundColor: '#eee7db',
    borderRadius: 3,
  },
  book: {
    position: 'absolute',
    left: 32,
    top: 27,
    width: 64,
    height: 89,
    backgroundColor: '#a57663',
    borderRadius: 4,
  },
  bookSpine: {
    position: 'absolute',
    left: 39,
    top: 27,
    width: 2,
    height: 89,
    backgroundColor: '#805344',
  },
  bookLabel: {
    position: 'absolute',
    left: 49,
    top: 53,
    color: '#f0dac3',
    fontSize: 10,
    lineHeight: 17,
    letterSpacing: 1,
  },
  bottle: {
    position: 'absolute',
    left: 44,
    top: 41,
    width: 45,
    height: 79,
    borderRadius: 13,
    backgroundColor: '#7c9b93',
  },
  bottleCap: {
    position: 'absolute',
    left: 49,
    top: 23,
    width: 35,
    height: 25,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: '#46695f',
  },
  bottleLine: {
    position: 'absolute',
    left: 50,
    top: 51,
    width: 4,
    height: 55,
    backgroundColor: '#b8cdc4',
    borderRadius: 2,
  },
  box: {
    position: 'absolute',
    left: 24,
    top: 60,
    width: 84,
    height: 50,
    backgroundColor: '#b49a72',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  boxLid: {
    position: 'absolute',
    left: 20,
    top: 49,
    width: 92,
    height: 16,
    backgroundColor: '#d0b58c',
    borderRadius: 5,
  },
  boxHandle: {
    position: 'absolute',
    left: 54,
    top: 77,
    width: 24,
    height: 8,
    backgroundColor: '#887352',
    borderRadius: 4,
  },
})
