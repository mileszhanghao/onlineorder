package com.mileszhang.siuyeh.menu;

import com.mileszhang.siuyeh.common.NotFoundException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public MenuService(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    /**
     * Every visitor hits this list and it rarely changes, so it is cached in
     * Caffeine for 60 seconds. Two queries total (no N+1): all restaurants,
     * all menu items, grouped in memory.
     */
    @Cacheable("restaurants")
    public List<RestaurantDto> getRestaurants() {
        Map<Long, List<MenuItemDto>> itemsByRestaurant = menuItemRepository.findAll().stream()
                .sorted(Comparator.comparing(MenuItemEntity::id))
                .collect(Collectors.groupingBy(MenuItemEntity::restaurantId,
                        Collectors.mapping(MenuItemDto::from, Collectors.toList())));
        return restaurantRepository.findAll().stream()
                .sorted(Comparator.comparing(RestaurantEntity::id))
                .map(r -> RestaurantDto.from(r, itemsByRestaurant.getOrDefault(r.id(), List.of())))
                .toList();
    }

    public List<MenuItemDto> getMenu(long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new NotFoundException("Restaurant " + restaurantId + " not found");
        }
        return menuItemRepository.findByRestaurantIdOrderById(restaurantId).stream()
                .map(MenuItemDto::from)
                .toList();
    }

    public MenuItemEntity getMenuItem(long menuItemId) {
        return menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new NotFoundException("Menu item " + menuItemId + " not found"));
    }
}
