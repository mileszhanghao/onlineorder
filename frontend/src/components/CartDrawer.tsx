import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Button, Drawer, Empty, List, Space, Typography } from 'antd'
import { api } from '../api'
import { formatPrice } from '../format'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const cart = useQuery({ queryKey: ['cart'], queryFn: api.cart, enabled: open })

  const onCartChanged = { onSuccess: (data: unknown) => queryClient.setQueryData(['cart'], data) }
  const add = useMutation({ mutationFn: api.addToCart, ...onCartChanged })
  const remove = useMutation({ mutationFn: api.removeFromCart, ...onCartChanged })

  const checkout = useMutation({
    mutationFn: api.checkout,
    onSuccess: (order) => {
      message.success(`Order #${order.id} placed — ${formatPrice(order.totalPrice)}`)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      onClose()
    },
    onError: (error) => message.error(error.message),
  })

  const items = cart.data?.items ?? []
  const busy = add.isPending || remove.isPending

  return (
    <Drawer
      title="My cart"
      open={open}
      onClose={onClose}
      size="default"
      footer={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Text strong>Total: {formatPrice(cart.data?.totalPrice ?? 0)}</Typography.Text>
          <Button
            type="primary"
            onClick={() => checkout.mutate()}
            loading={checkout.isPending}
            disabled={items.length === 0 || busy}
          >
            Place order
          </Button>
        </Space>
      }
    >
      <List
        loading={cart.isPending}
        dataSource={items}
        locale={{ emptyText: <Empty description="Your cart is empty" /> }}
        renderItem={(line) => (
          <List.Item
            actions={[
              <Button
                key="minus"
                size="small"
                aria-label={`Remove one ${line.name}`}
                icon={<MinusOutlined />}
                disabled={busy}
                onClick={() => remove.mutate(line.menuItemId)}
              />,
              <Typography.Text key="qty">{line.quantity}</Typography.Text>,
              <Button
                key="plus"
                size="small"
                aria-label={`Add one ${line.name}`}
                icon={<PlusOutlined />}
                disabled={busy}
                onClick={() => add.mutate(line.menuItemId)}
              />,
            ]}
          >
            <List.Item.Meta title={line.name} description={formatPrice(line.lineTotal)} />
          </List.Item>
        )}
      />
    </Drawer>
  )
}
