import { PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Button, Card, Empty, List, Select, Space, Typography } from 'antd'
import { useState } from 'react'
import { api } from '../api'
import { formatPrice } from '../format'

export default function MenuBrowser() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const restaurants = useQuery({ queryKey: ['restaurants'], queryFn: api.restaurants })
  const [selectedId, setSelectedId] = useState<number>()

  const addToCart = useMutation({
    mutationFn: api.addToCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart)
      message.success('Added to cart')
    },
    onError: (error) => message.error(error.message),
  })

  const restaurant = restaurants.data?.find((r) => r.id === selectedId) ?? restaurants.data?.[0]

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Select
        style={{ width: '100%', maxWidth: 360 }}
        placeholder="Choose a restaurant"
        loading={restaurants.isPending}
        value={restaurant?.id}
        onChange={setSelectedId}
        options={restaurants.data?.map((r) => ({ value: r.id, label: r.name }))}
      />
      {restaurant && (
        <Typography.Text type="secondary">
          {restaurant.address} · {restaurant.phone}
        </Typography.Text>
      )}
      <List
        loading={restaurants.isPending}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={restaurant?.menuItems ?? []}
        locale={{ emptyText: <Empty description="No menu items" /> }}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.name}
              extra={
                <Button
                  type="primary"
                  shape="circle"
                  aria-label={`Add ${item.name} to cart`}
                  icon={<PlusOutlined />}
                  loading={addToCart.isPending && addToCart.variables === item.id}
                  onClick={() => addToCart.mutate(item.id)}
                />
              }
            >
              <Typography.Paragraph type="secondary" style={{ minHeight: 44 }}>
                {item.description}
              </Typography.Paragraph>
              <Typography.Text strong>{formatPrice(item.price)}</Typography.Text>
            </Card>
          </List.Item>
        )}
      />
    </Space>
  )
}
