import type { Cart, Customer, Order, Restaurant, SignupInput } from './types'

/** Error carrying the HTTP status and the server's problem-detail message. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** The operations the UI needs; implemented by the HTTP client and by the demo. */
export interface Api {
  me(): Promise<Customer>
  login(email: string, password: string): Promise<Customer>
  signup(input: SignupInput): Promise<Customer>
  logout(): Promise<void>
  restaurants(): Promise<Restaurant[]>
  cart(): Promise<Cart>
  addToCart(menuItemId: number): Promise<Cart>
  removeFromCart(menuItemId: number): Promise<Cart>
  checkout(): Promise<Order>
  orders(): Promise<Order[]>
}
