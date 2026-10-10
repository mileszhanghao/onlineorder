import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { App as AntApp } from 'antd'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <AntApp>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </AntApp>,
  )
}

function routeFetch(routes: Record<string, { status: number; body?: unknown }>) {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const route = routes[String(input)]
    if (!route) return new Response(null, { status: 404 })
    return new Response(route.body === undefined ? null : JSON.stringify(route.body), { status: route.status })
  })
}

afterEach(() => vi.restoreAllMocks())

describe('App', () => {
  it('shows the login form when the session is not authenticated', async () => {
    routeFetch({ '/api/auth/me': { status: 401 } })

    renderApp()

    expect(await screen.findByRole('button', { name: 'Log in' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /cart/i })).not.toBeInTheDocument()
  })

  it('greets a logged-in customer and shows the first restaurant menu', async () => {
    routeFetch({
      '/api/auth/me': { status: 200, body: { id: 1, email: 'm@x.com', firstName: 'Miles', lastName: 'Z' } },
      '/api/cart': { status: 200, body: { items: [], totalPrice: 0 } },
      '/api/restaurants': {
        status: 200,
        body: [
          {
            id: 1,
            name: '九龍夜 Kowloon Nights',
            address: 'Cha chaan teng · U District, Seattle',
            phone: '555',
            imageUrl: null,
            menuItems: [{ id: 1, name: 'Egg Tarts (3) · 蛋撻', description: 'Wobbly custard', price: 6.5, imageUrl: null }],
          },
        ],
      },
    })

    renderApp()

    expect(await screen.findByText(/Hi Miles/)).toBeInTheDocument()
    expect(await screen.findByText('Egg Tarts (3)')).toBeInTheDocument()
    expect(screen.getByText('蛋撻')).toBeInTheDocument()
    expect(screen.getByText('$6.50')).toBeInTheDocument()
  })
})
