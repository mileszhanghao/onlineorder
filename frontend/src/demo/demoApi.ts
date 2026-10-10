// In-browser stand-in for the Spring Boot API, used only by the public demo
// build (VITE_DEMO=true). It mirrors the backend's rules — one cart per
// customer, add/remove one unit at a time, checkout snapshots prices into an
// order — and keeps everything in this browser's localStorage.
import { ApiError, type Api } from '../apiTypes'
import type { Cart, CartLine, Customer, Order, Restaurant, SignupInput } from '../types'
import { DEMO_RESTAURANTS } from './seed'

interface StoredUser extends Customer {
  password: string
}

interface DemoState {
  users: StoredUser[]
  session: string | null
  carts: Record<string, CartLine[]>
  orders: Record<string, Order[]>
  nextOrderId: number
}

const KEY = 'siuyeh-demo-v1'
export const DEMO_EMAIL = 'demo@example.com'
export const DEMO_PASSWORD = 'demo-password'

function initialState(): DemoState {
  return {
    users: [{ id: 1, email: DEMO_EMAIL, password: DEMO_PASSWORD, firstName: 'Demo', lastName: 'User' }],
    session: null,
    carts: { [DEMO_EMAIL]: [] },
    orders: { [DEMO_EMAIL]: [] },
    nextOrderId: 1,
  }
}

let memoryState: DemoState | null = null

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as DemoState
  } catch {
    // Storage blocked (private mode etc.): fall back to in-memory state.
  }
  memoryState ??= initialState()
  return memoryState
}

function save(state: DemoState) {
  memoryState = state
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Ignore; in-memory copy still works for this page view.
  }
}

const delay = () => new Promise((resolve) => setTimeout(resolve, 150))
const round2 = (n: number) => Math.round(n * 100) / 100

function requireUser(state: DemoState): StoredUser {
  const user = state.users.find((u) => u.email === state.session)
  if (!user) throw new ApiError(401, 'Unauthorized')
  return user
}

function publicCustomer({ password: _password, ...customer }: StoredUser): Customer {
  return customer
}

function toCart(lines: CartLine[]): Cart {
  return { items: lines, totalPrice: round2(lines.reduce((sum, l) => sum + l.lineTotal, 0)) }
}

function findMenuItem(menuItemId: number) {
  for (const restaurant of DEMO_RESTAURANTS) {
    const item = restaurant.menuItems.find((m) => m.id === menuItemId)
    if (item) return { item, restaurantId: restaurant.id }
  }
  throw new ApiError(404, `Menu item ${menuItemId} not found`)
}

export const demoApi: Api = {
  async me() {
    await delay()
    return publicCustomer(requireUser(load()))
  },

  async login(email, password) {
    await delay()
    const state = load()
    const user = state.users.find((u) => u.email === email.trim().toLowerCase())
    if (!user || user.password !== password) throw new ApiError(401, 'Invalid email or password')
    state.session = user.email
    save(state)
    return publicCustomer(user)
  },

  async signup(input: SignupInput) {
    await delay()
    const state = load()
    const email = input.email.trim().toLowerCase()
    if (state.users.some((u) => u.email === email)) {
      throw new ApiError(409, 'An account with this email already exists')
    }
    const user: StoredUser = { ...input, email, id: state.users.length + 1 }
    state.users.push(user)
    state.carts[email] = []
    state.orders[email] = []
    save(state)
    return publicCustomer(user)
  },

  async logout() {
    await delay()
    const state = load()
    state.session = null
    save(state)
  },

  async restaurants(): Promise<Restaurant[]> {
    await delay()
    return DEMO_RESTAURANTS
  },

  async cart() {
    await delay()
    const state = load()
    return toCart(state.carts[requireUser(state).email] ?? [])
  },

  async addToCart(menuItemId) {
    await delay()
    const state = load()
    const { email } = requireUser(state)
    const { item, restaurantId } = findMenuItem(menuItemId)
    const lines = state.carts[email] ?? []
    const line = lines.find((l) => l.menuItemId === menuItemId)
    if (line) {
      line.quantity += 1
      line.lineTotal = round2(line.unitPrice * line.quantity)
    } else {
      lines.push({ menuItemId, restaurantId, name: item.name, unitPrice: item.price, quantity: 1, lineTotal: item.price })
    }
    state.carts[email] = lines
    save(state)
    return toCart(lines)
  },

  async removeFromCart(menuItemId) {
    await delay()
    const state = load()
    const { email } = requireUser(state)
    const lines = state.carts[email] ?? []
    const line = lines.find((l) => l.menuItemId === menuItemId)
    if (!line) throw new ApiError(404, `Item ${menuItemId} is not in the cart`)
    line.quantity -= 1
    line.lineTotal = round2(line.unitPrice * line.quantity)
    state.carts[email] = lines.filter((l) => l.quantity > 0)
    save(state)
    return toCart(state.carts[email])
  },

  async checkout() {
    await delay()
    const state = load()
    const { email } = requireUser(state)
    const lines = state.carts[email] ?? []
    if (lines.length === 0) throw new ApiError(400, 'Cart is empty')
    const order: Order = {
      id: state.nextOrderId++,
      totalPrice: toCart(lines).totalPrice,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      lines: lines.map((l) => ({ menuItemId: l.menuItemId, name: l.name, unitPrice: l.unitPrice, quantity: l.quantity })),
    }
    state.orders[email] = [order, ...(state.orders[email] ?? [])]
    state.carts[email] = []
    save(state)
    return order
  },

  async orders() {
    await delay()
    const state = load()
    return state.orders[requireUser(state).email] ?? []
  },
}

export function resetDemo() {
  memoryState = null
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
