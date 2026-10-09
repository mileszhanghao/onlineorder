export interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  imageUrl: string | null
}

export interface Restaurant {
  id: number
  name: string
  address: string | null
  phone: string | null
  imageUrl: string | null
  menuItems: MenuItem[]
}

export interface CartLine {
  menuItemId: number
  restaurantId: number
  name: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Cart {
  items: CartLine[]
  totalPrice: number
}

export interface OrderLine {
  menuItemId: number | null
  name: string
  unitPrice: number
  quantity: number
}

export interface Order {
  id: number
  totalPrice: number
  status: string
  createdAt: string
  lines: OrderLine[]
}

export interface SignupInput {
  email: string
  password: string
  firstName: string
  lastName: string
}
