import { ShoppingCartOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Badge, Button, Layout, Space, Spin, Typography } from 'antd'
import { useState } from 'react'
import { ApiError, IS_DEMO, api } from './api'
import AuthPanel from './components/AuthPanel'
import DemoBanner from './components/DemoBanner'
import CartDrawer from './components/CartDrawer'
import MenuBrowser from './components/MenuBrowser'
import OrdersDrawer from './components/OrdersDrawer'

const { Header, Content } = Layout

export default function App() {
  const queryClient = useQueryClient()
  const [cartOpen, setCartOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)

  const me = useQuery({ queryKey: ['me'], queryFn: api.me })
  const loggedIn = me.isSuccess
  const cart = useQuery({ queryKey: ['cart'], queryFn: api.cart, enabled: loggedIn })

  const logout = useMutation({
    mutationFn: api.logout,
    onSuccess: () => queryClient.resetQueries(),
  })

  const cartCount = cart.data?.items.reduce((sum, line) => sum + line.quantity, 0) ?? 0
  const notLoggedIn = me.isError && me.error instanceof ApiError && me.error.status === 401

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="app-header">
        <Typography.Title level={3}>OnlineOrder</Typography.Title>
        {loggedIn && (
          <Space wrap>
            <Button icon={<UnorderedListOutlined />} onClick={() => setOrdersOpen(true)}>
              Orders
            </Button>
            <Badge count={cartCount} size="small">
              <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => setCartOpen(true)}>
                Cart
              </Button>
            </Badge>
            <Button onClick={() => logout.mutate()} loading={logout.isPending}>
              Log out
            </Button>
          </Space>
        )}
      </Header>
      <Content className="app-content">
        {IS_DEMO && <DemoBanner />}
        {me.isPending && <Spin />}
        {notLoggedIn && <AuthPanel />}
        {me.isError && !notLoggedIn && (
          <Typography.Text type="danger">Could not reach the server: {me.error.message}</Typography.Text>
        )}
        {loggedIn && (
          <>
            <Typography.Paragraph>Hi {me.data.firstName}, what would you like to eat?</Typography.Paragraph>
            <MenuBrowser />
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <OrdersDrawer open={ordersOpen} onClose={() => setOrdersOpen(false)} />
          </>
        )}
      </Content>
    </Layout>
  )
}
