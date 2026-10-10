import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_EMAIL, DEMO_PASSWORD, demoApi, resetDemo } from './demoApi'

beforeEach(() => resetDemo())

describe('demo API', () => {
  it('requires login before reading the cart', async () => {
    await expect(demoApi.cart()).rejects.toMatchObject({ status: 401 })
  })

  it('mirrors the backend flow: add, remove, checkout, history', async () => {
    await demoApi.login(DEMO_EMAIL, DEMO_PASSWORD)
    await demoApi.addToCart(1)
    await demoApi.addToCart(1)
    let cart = await demoApi.addToCart(4)
    expect(cart.totalPrice).toBe(35.5)

    cart = await demoApi.removeFromCart(4)
    expect(cart.items).toHaveLength(1)
    expect(cart.totalPrice).toBe(29)

    const order = await demoApi.checkout()
    expect(order).toMatchObject({ status: 'PLACED', totalPrice: 29 })
    expect((await demoApi.cart()).items).toHaveLength(0)
    expect(await demoApi.orders()).toHaveLength(1)
  })

  it('rejects checkout of an empty cart and duplicate sign-ups', async () => {
    await demoApi.login(DEMO_EMAIL, DEMO_PASSWORD)
    await expect(demoApi.checkout()).rejects.toMatchObject({ status: 400, message: 'Cart is empty' })
    await expect(
      demoApi.signup({ email: DEMO_EMAIL, password: 'whatever1', firstName: 'A', lastName: 'B' }),
    ).rejects.toMatchObject({ status: 409 })
  })

  it('rejects a wrong password', async () => {
    await expect(demoApi.login(DEMO_EMAIL, 'nope')).rejects.toMatchObject({ status: 401 })
  })
})
