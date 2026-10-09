package com.mileszhang.onlineorder.menu;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/restaurants")
    public List<RestaurantDto> getRestaurants() {
        return menuService.getRestaurants();
    }

    @GetMapping("/restaurants/{restaurantId}/menu")
    public List<MenuItemDto> getMenu(@PathVariable long restaurantId) {
        return menuService.getMenu(restaurantId);
    }
}
