package com.mileszhang.onlineorder.cart;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Cart persistence written as plain SQL with {@link JdbcClient}. The two
 * interesting statements are the upsert in {@link #addOne} and the
 * DELETE ... RETURNING in {@link #removeAll}; both rely on PostgreSQL row
 * locks instead of a read-modify-write in Java.
 */
@Repository
public class CartRepository {

    private static final RowMapper<CartLine> CART_LINE = (rs, rowNum) -> new CartLine(
            rs.getLong("menu_item_id"),
            rs.getLong("restaurant_id"),
            rs.getString("name"),
            rs.getBigDecimal("unit_price"),
            rs.getInt("quantity"));

    private final JdbcClient jdbc;

    public CartRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public void createForCustomer(long customerId) {
        jdbc.sql("INSERT INTO carts (customer_id) VALUES (:customerId)")
                .param("customerId", customerId)
                .update();
    }

    public Optional<Long> findCartId(long customerId) {
        return jdbc.sql("SELECT id FROM carts WHERE customer_id = :customerId")
                .param("customerId", customerId)
                .query(Long.class)
                .optional();
    }

    /**
     * Adds one unit in a single statement. The course version read the row,
     * incremented in Java and wrote it back, so two simultaneous clicks could
     * both read quantity=1 and both write 2. ON CONFLICT makes the database
     * do the increment while holding the row lock.
     */
    public void addOne(long cartId, long menuItemId, BigDecimal unitPrice) {
        jdbc.sql("""
                        INSERT INTO cart_items (cart_id, menu_item_id, unit_price, quantity)
                        VALUES (:cartId, :menuItemId, :unitPrice, 1)
                        ON CONFLICT (cart_id, menu_item_id)
                        DO UPDATE SET quantity = cart_items.quantity + 1
                        """)
                .param("cartId", cartId)
                .param("menuItemId", menuItemId)
                .param("unitPrice", unitPrice)
                .update();
    }

    /** Removes one unit; deletes the line when its quantity reaches zero. */
    public boolean removeOne(long cartId, long menuItemId) {
        int updated = jdbc.sql("""
                        UPDATE cart_items SET quantity = quantity - 1
                        WHERE cart_id = :cartId AND menu_item_id = :menuItemId AND quantity > 1
                        """)
                .param("cartId", cartId)
                .param("menuItemId", menuItemId)
                .update();
        if (updated > 0) {
            return true;
        }
        int deleted = jdbc.sql("DELETE FROM cart_items WHERE cart_id = :cartId AND menu_item_id = :menuItemId")
                .param("cartId", cartId)
                .param("menuItemId", menuItemId)
                .update();
        return deleted > 0;
    }

    public List<CartLine> findLines(long cartId) {
        return jdbc.sql("""
                        SELECT ci.menu_item_id, m.restaurant_id, m.name, ci.unit_price, ci.quantity
                        FROM cart_items ci
                        JOIN menu_items m ON m.id = ci.menu_item_id
                        WHERE ci.cart_id = :cartId
                        ORDER BY ci.id
                        """)
                .param("cartId", cartId)
                .query(CART_LINE)
                .list();
    }

    /**
     * Empties the cart and returns exactly the rows that were removed, in one
     * statement. An add-to-cart that lands mid-checkout either waits for this
     * delete or creates a fresh row afterwards, so nothing is silently lost.
     */
    public List<CartLine> removeAll(long cartId) {
        return jdbc.sql("""
                        WITH removed AS (
                            DELETE FROM cart_items WHERE cart_id = :cartId
                            RETURNING id, menu_item_id, unit_price, quantity
                        )
                        SELECT r.menu_item_id, m.restaurant_id, m.name, r.unit_price, r.quantity
                        FROM removed r
                        JOIN menu_items m ON m.id = r.menu_item_id
                        ORDER BY r.id
                        """)
                .param("cartId", cartId)
                .query(CART_LINE)
                .list();
    }
}
