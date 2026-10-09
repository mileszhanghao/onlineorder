import type { Cart, Customer, Order, Restaurant, SignupInput } from './types'

const BASE = '/api'

/** Error carrying the HTTP status and the server's problem-detail message. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

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

export const api = {
  me: () => request<Customer>('/auth/me'),
  // Credentials go in the request body. The course version put them in the URL query string.
  login: (email: string, password: string) => request<Customer>('/auth/login', json({ email, password })),
  signup: (input: SignupInput) => request<Customer>('/auth/signup', json(input)),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  restaurants: () => request<Restaurant[]>('/restaurants'),
  cart: () => request<Cart>('/cart'),
  addToCart: (menuItemId: number) => request<Cart>('/cart/items', json({ menuItemId })),
  removeFromCart: (menuItemId: number) => request<Cart>(`/cart/items/${menuItemId}`, { method: 'DELETE' }),
  checkout: () => request<Order>('/orders', { method: 'POST' }),
  orders: () => request<Order[]>('/orders'),
}
