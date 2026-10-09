package com.mileszhang.onlineorder.menu;

import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface MenuItemRepository extends ListCrudRepository<MenuItemEntity, Long> {

    List<MenuItemEntity> findByRestaurantIdOrderById(Long restaurantId);
}
