import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, api } from './api'
import { formatPrice } from './format'

function mockFetch(status: number, body?: unknown) {
  const text = body === undefined ? '' : JSON.stringify(body)
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(text || null, { status }))
}

afterEach(() => vi.restoreAllMocks())

describe('api client', () => {
  it('sends login credentials in the JSON body, not the URL', async () => {
    const fetchSpy = mockFetch(200, { id: 1, email: 'a@b.com', firstName: 'A', lastName: 'B' })

    await api.login('a@b.com', 'secret-password')

    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('/api/auth/login')
    expect(String(url)).not.toContain('secret-password')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual({ email: 'a@b.com', password: 'secret-password' })
  })

  it('surfaces the problem-detail message and status on errors', async () => {
    mockFetch(400, { status: 400, detail: 'Cart is empty' })

    const error = await api.checkout().catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 400, message: 'Cart is empty' })
  })

  it('handles empty 204 responses', async () => {
    mockFetch(204)
    await expect(api.logout()).resolves.toBeUndefined()
  })
})

describe('formatPrice', () => {
  it('formats US dollars with cents', () => {
    expect(formatPrice(38.75)).toBe('$38.75')
    expect(formatPrice(31)).toBe('$31.00')
  })
})
