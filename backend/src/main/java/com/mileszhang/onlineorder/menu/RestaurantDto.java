package com.mileszhang.onlineorder.menu;

import java.util.List;

public record RestaurantDto(
        Long id,
        String name,
        String address,
        String phone,
        String imageUrl,
        List<MenuItemDto> menuItems
) {

    static RestaurantDto from(RestaurantEntity entity, List<MenuItemDto> menuItems) {
        return new RestaurantDto(entity.id(), entity.name(), entity.address(), entity.phone(),
                entity.imageUrl(), menuItems);
    }
}
