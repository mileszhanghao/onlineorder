import { useQuery } from '@tanstack/react-query'
import { Card, Drawer, Empty, List, Tag, Typography } from 'antd'
import { api } from '../api'
import { formatDateTime, formatPrice } from '../format'

interface Props {
  open: boolean
  onClose: () => void
}

export default function OrdersDrawer({ open, onClose }: Props) {
  const orders = useQuery({ queryKey: ['orders'], queryFn: api.orders, enabled: open })

  return (
    <Drawer title="Order history" open={open} onClose={onClose}>
      <List
        loading={orders.isPending && open}
        dataSource={orders.data ?? []}
        locale={{ emptyText: <Empty description="No orders yet" /> }}
        renderItem={(order) => (
          <List.Item>
            <Card
              size="small"
              style={{ width: '100%' }}
              title={`Order #${order.id}`}
              extra={<Tag color="green">{order.status}</Tag>}
            >
              <Typography.Text type="secondary">{formatDateTime(order.createdAt)}</Typography.Text>
              <ul style={{ paddingLeft: 20 }}>
                {order.lines.map((line, i) => (
                  <li key={i}>
                    {line.quantity} × {line.name} — {formatPrice(line.unitPrice * line.quantity)}
                  </li>
                ))}
              </ul>
              <Typography.Text strong>Total: {formatPrice(order.totalPrice)}</Typography.Text>
            </Card>
          </List.Item>
        )}
      />
    </Drawer>
  )
}
