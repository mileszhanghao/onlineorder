import { PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Button, Card, Empty, Skeleton, Typography } from 'antd'
import { useState } from 'react'
import { api } from '../api'
import { formatPrice, splitName } from '../format'
import type { MenuItem, Restaurant } from '../types'

function RestaurantTab({ r, active, onClick }: { r: Restaurant; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`spot ${active ? 'spot-active' : ''}`} onClick={onClick} aria-pressed={active}>
      {r.imageUrl && <img src={r.imageUrl} alt="" loading="lazy" />}
      <span>
        <strong>{r.name}</strong>
        <small>{r.address?.split(' · ')[0]}</small>
      </span>
    </button>
  )
}

function DishCard({ item, adding, onAdd }: { item: MenuItem; adding: boolean; onAdd: () => void }) {
  const [english, chinese] = splitName(item.name)
  return (
    <Card
      className="dish"
      cover={
        item.imageUrl ? (
          <img src={item.imageUrl} alt={english} loading="lazy" className="dish-photo" />
        ) : (
          <div className="dish-photo dish-photo-empty">宵</div>
        )
      }
    >
      <div className="dish-title">
        <Typography.Text strong>{english}</Typography.Text>
        {chinese && <span className="dish-zh">{chinese}</span>}
      </div>
      <Typography.Paragraph type="secondary" className="dish-desc">
        {item.description}
      </Typography.Paragraph>
      <div className="dish-footer">
        <Typography.Text strong className="dish-price">
          {formatPrice(item.price)}
        </Typography.Text>
        <Button
          type="primary"
          shape="round"
          aria-label={`Add ${item.name} to cart`}
          icon={<PlusOutlined />}
          loading={adding}
          onClick={onAdd}
        >
          Add
        </Button>
      </div>
    </Card>
  )
}

export default function MenuBrowser() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const restaurants = useQuery({ queryKey: ['restaurants'], queryFn: api.restaurants })
  const [selectedId, setSelectedId] = useState<number>()

  const addToCart = useMutation({
    mutationFn: api.addToCart,
    onSuccess: (cart, itemId) => {
      queryClient.setQueryData(['cart'], cart)
      const line = cart.items.find((l) => l.menuItemId === itemId)
      message.success(line ? `${splitName(line.name)[0]} × ${line.quantity} in your cart` : 'Added to cart')
    },
    onError: (error) => message.error(error.message),
  })

  if (restaurants.isPending) return <Skeleton active />
  if (!restaurants.data?.length) return <Empty description="No restaurants are open right now" />

  const restaurant = restaurants.data.find((r) => r.id === selectedId) ?? restaurants.data[0]
  const details = restaurant.address?.split(' · ') ?? []

  return (
    <div className="menu">
      <nav className="spots" aria-label="Restaurants">
        {restaurants.data.map((r) => (
          <RestaurantTab key={r.id} r={r} active={r.id === restaurant.id} onClick={() => setSelectedId(r.id)} />
        ))}
      </nav>

      <header className="spot-hero">
        <Typography.Title level={2}>{restaurant.name}</Typography.Title>
        <Typography.Text type="secondary">
          {[...details, restaurant.phone].filter(Boolean).join(' · ')}
        </Typography.Text>
      </header>

      {restaurant.menuItems.length ? (
        <div className="dishes">
          {restaurant.menuItems.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              adding={addToCart.isPending && addToCart.variables === item.id}
              onAdd={() => addToCart.mutate(item.id)}
            />
          ))}
        </div>
      ) : (
        <Empty description="No menu items" />
      )}
    </div>
  )
}
