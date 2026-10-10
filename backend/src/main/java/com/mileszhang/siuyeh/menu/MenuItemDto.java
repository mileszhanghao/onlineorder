package com.mileszhang.siuyeh.menu;

import java.math.BigDecimal;

public record MenuItemDto(Long id, String name, String description, BigDecimal price, String imageUrl) {

    static MenuItemDto from(MenuItemEntity entity) {
        return new MenuItemDto(entity.id(), entity.name(), entity.description(), entity.price(), entity.imageUrl());
    }
}
