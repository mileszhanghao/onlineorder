package com.mileszhang.siuyeh.order;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final JdbcClient jdbc;

    public OrderRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public long insertOrder(long customerId, BigDecimal total, String status, Instant createdAt) {
        return jdbc.sql("""
                        INSERT INTO orders (customer_id, total_price, status, created_at)
                        VALUES (:customerId, :total, :status, :createdAt)
                        RETURNING id
                        """)
                .param("customerId", customerId)
                .param("total", total)
                .param("status", status)
                .param("createdAt", Timestamp.from(createdAt))
                .query(Long.class)
                .single();
    }

    public void insertLine(long orderId, OrderDto.Line line) {
        jdbc.sql("""
                        INSERT INTO order_lines (order_id, menu_item_id, menu_item_name, unit_price, quantity)
                        VALUES (:orderId, :menuItemId, :name, :unitPrice, :quantity)
                        """)
                .param("orderId", orderId)
                .param("menuItemId", line.menuItemId())
                .param("name", line.name())
                .param("unitPrice", line.unitPrice())
                .param("quantity", line.quantity())
                .update();
    }

    /** Newest first. Two queries total: the orders, then all their lines. */
    public List<OrderDto> findByCustomer(long customerId) {
        record Header(long id, BigDecimal total, String status, Instant createdAt) {
        }
        List<Header> headers = jdbc.sql("""
                        SELECT id, total_price, status, created_at FROM orders
                        WHERE customer_id = :customerId
                        ORDER BY created_at DESC, id DESC
                        """)
                .param("customerId", customerId)
                .query((rs, n) -> new Header(rs.getLong("id"), rs.getBigDecimal("total_price"),
                        rs.getString("status"), rs.getTimestamp("created_at").toInstant()))
                .list();
        if (headers.isEmpty()) {
            return List.of();
        }

        Map<Long, List<OrderDto.Line>> linesByOrder = new LinkedHashMap<>();
        jdbc.sql("""
                        SELECT ol.order_id, ol.menu_item_id, ol.menu_item_name, ol.unit_price, ol.quantity
                        FROM order_lines ol
                        JOIN orders o ON o.id = ol.order_id
                        WHERE o.customer_id = :customerId
                        ORDER BY ol.id
                        """)
                .param("customerId", customerId)
                .query(rs -> {
                    long menuItemId = rs.getLong("menu_item_id");
                    Long nullableMenuItemId = rs.wasNull() ? null : menuItemId;
                    linesByOrder.computeIfAbsent(rs.getLong("order_id"), k -> new ArrayList<>())
                            .add(new OrderDto.Line(nullableMenuItemId, rs.getString("menu_item_name"),
                                    rs.getBigDecimal("unit_price"), rs.getInt("quantity")));
                });

        return headers.stream()
                .map(h -> new OrderDto(h.id(), h.total(), h.status(), h.createdAt(),
                        linesByOrder.getOrDefault(h.id(), List.of())))
                .toList();
    }

    public Optional<OrderDto> findByIdForCustomer(long orderId, long customerId) {
        return findByCustomer(customerId).stream()
                .filter(o -> o.id() == orderId)
                .findFirst();
    }
}
