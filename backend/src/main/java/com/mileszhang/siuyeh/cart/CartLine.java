package com.mileszhang.siuyeh.cart;

import java.math.BigDecimal;

public record CartLine(
        Long menuItemId,
        Long restaurantId,
        String name,
        BigDecimal unitPrice,
        int quantity
) {

    public BigDecimal lineTotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
