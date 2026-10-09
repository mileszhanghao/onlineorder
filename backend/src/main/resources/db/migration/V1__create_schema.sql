CREATE TABLE customers
(
    id         BIGSERIAL PRIMARY KEY,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    enabled    BOOLEAN NOT NULL DEFAULT TRUE,
    first_name TEXT,
    last_name  TEXT
);

-- Spring Security reads roles from here (JdbcUserDetailsManager).
CREATE TABLE authorities
(
    id        BIGSERIAL PRIMARY KEY,
    email     TEXT NOT NULL REFERENCES customers (email) ON DELETE CASCADE,
    authority TEXT NOT NULL
);

CREATE TABLE restaurants
(
    id        BIGSERIAL PRIMARY KEY,
    name      TEXT NOT NULL,
    address   TEXT,
    phone     TEXT,
    image_url TEXT
);

CREATE TABLE menu_items
(
    id            BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT         NOT NULL REFERENCES restaurants (id) ON DELETE CASCADE,
    name          TEXT           NOT NULL,
    description   TEXT,
    price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url     TEXT
);

CREATE INDEX idx_menu_items_restaurant ON menu_items (restaurant_id);

CREATE TABLE carts
(
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL UNIQUE REFERENCES customers (id) ON DELETE CASCADE
);

-- One row per (cart, menu item). The UNIQUE constraint is what makes the
-- add-to-cart upsert atomic: concurrent adds increment quantity instead of
-- racing to insert duplicate rows.
CREATE TABLE cart_items
(
    id           BIGSERIAL PRIMARY KEY,
    cart_id      BIGINT         NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
    menu_item_id BIGINT         NOT NULL REFERENCES menu_items (id) ON DELETE CASCADE,
    unit_price   NUMERIC(10, 2) NOT NULL,
    quantity     INTEGER        NOT NULL CHECK (quantity > 0),
    UNIQUE (cart_id, menu_item_id)
);

CREATE TABLE orders
(
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT         NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    total_price NUMERIC(10, 2) NOT NULL,
    status      TEXT           NOT NULL,
    created_at  TIMESTAMPTZ    NOT NULL
);

CREATE INDEX idx_orders_customer ON orders (customer_id, created_at DESC);

-- Order lines copy the item name and price at checkout time, so order
-- history stays correct even if the menu changes later.
CREATE TABLE order_lines
(
    id             BIGSERIAL PRIMARY KEY,
    order_id       BIGINT         NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    menu_item_id   BIGINT,
    menu_item_name TEXT           NOT NULL,
    unit_price     NUMERIC(10, 2) NOT NULL,
    quantity       INTEGER        NOT NULL CHECK (quantity > 0)
);
