package com.mileszhang.siuyeh.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartDto(List<Line> items, BigDecimal totalPrice) {

    public record Line(Long menuItemId, Long restaurantId, String name, BigDecimal unitPrice,
                       int quantity, BigDecimal lineTotal) {
    }

    public static CartDto from(List<CartLine> lines) {
        List<Line> items = lines.stream()
                .map(l -> new Line(l.menuItemId(), l.restaurantId(), l.name(), l.unitPrice(),
                        l.quantity(), l.lineTotal()))
                .toList();
        BigDecimal total = lines.stream()
                .map(CartLine::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartDto(items, total);
    }
}
