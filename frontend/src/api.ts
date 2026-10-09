import { ApiError, type Api } from './apiTypes'
import { demoApi } from './demo/demoApi'
import type { Cart, Customer, Order, Restaurant, SignupInput } from './types'

export { ApiError } from './apiTypes'

/** True for the public GitHub Pages build, which runs without a backend. */
export const IS_DEMO = import.meta.env.VITE_DEMO === 'true'

const BASE = '/api'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(BASE + path, {
    credentials: 'same-origin',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  if (!response.ok) {
    let message = response.statusText || `Request failed (${response.status})`
    try {
      const problem = (await response.json()) as { detail?: string }
      if (problem.detail) message = problem.detail
    } catch {
      // Body was empty or not JSON; keep the status text.
    }
    throw new ApiError(response.status, message)
  }
  if (response.status === 204) return undefined as T
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

const json = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) })

export const httpApi: Api = {
  me: () => request<Customer>('/auth/me'),
  // Credentials go in the request body. The course version put them in the URL query string.
  login: (email, password) => request<Customer>('/auth/login', json({ email, password })),
  signup: (input: SignupInput) => request<Customer>('/auth/signup', json(input)),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  restaurants: () => request<Restaurant[]>('/restaurants'),
  cart: () => request<Cart>('/cart'),
  addToCart: (menuItemId) => request<Cart>('/cart/items', json({ menuItemId })),
  removeFromCart: (menuItemId) => request<Cart>(`/cart/items/${menuItemId}`, { method: 'DELETE' }),
  checkout: () => request<Order>('/orders', { method: 'POST' }),
  orders: () => request<Order[]>('/orders'),
}

export const api: Api = IS_DEMO ? demoApi : httpApi
