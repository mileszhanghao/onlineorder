package com.mileszhang.onlineorder.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderDto(Long id, BigDecimal totalPrice, String status, Instant createdAt, List<Line> lines) {

    public record Line(Long menuItemId, String name, BigDecimal unitPrice, int quantity) {
    }
}
