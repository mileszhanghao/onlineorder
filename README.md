# OnlineOrder

A food-ordering web app. Customers sign up, browse restaurant menus, build a cart and place orders, then view their order history.

**Stack:** Java 21 · Spring Boot 3.5 (Web, Security, Data JDBC, Validation, Cache) · PostgreSQL 16 · Flyway · Caffeine · React 19 + TypeScript · Vite · Ant Design · TanStack Query · JUnit 5 · Mockito · Testcontainers · Vitest · Docker Compose · GitHub Actions

## Background

I first built this app in 2025 following LaiOffer's OnlineOrder course: Spring Boot, Spring Data JDBC, PostgreSQL, Spring Security form login, Caffeine caching, Mockito unit tests, a React front end, and deployment to AWS (ECR + App Runner + RDS).

In 2026 I rebuilt it from scratch. The goal was to fix the problems I found when re-reading the original code, and to bring the tooling up to what teams use today. The rebuild was developed with AI pair-programming assistance (Claude).

## What changed from the course version, and why

| Problem in the course version | What the rebuild does |
|---|---|
| The login request put the username and password in the URL query string, where they end up in server logs and browser history. | Credentials go in a JSON request body (`POST /auth/login`). |
| The roles query selected a column called `authorities` from the `authorities` table. PostgreSQL treats that name as a reference to the whole row, so every user's role was the string `(1,email,ROLE_USER)`. Nothing failed, because no endpoint checked roles. | The query selects the real `authority` column. A test asserts that a new user has exactly `ROLE_USER`. |
| Money was stored as `Double`, so cents could drift (`0.1 + 0.2 != 0.3`). | `NUMERIC(10,2)` in the database and `BigDecimal` in Java. |
| Add-to-cart read the quantity in Java, added 1 and wrote it back. Two clicks at the same moment could both read 1 and both write 2. The cart total was stored the same way. | Add-to-cart is one `INSERT ... ON CONFLICT DO UPDATE SET quantity = quantity + 1`, so PostgreSQL does the increment under a row lock. The total is computed from the cart lines instead of being stored. An integration test fires 20 concurrent adds and expects quantity 20. |
| Checkout only cleared the cart, so no order was ever saved. | Checkout creates an `orders` row plus `order_lines` that copy each item's name and price, all in one transaction. Cart lines are removed with `DELETE ... RETURNING`, so the order contains exactly what was removed, even if another request touches the cart at the same moment. |
| `findById(...).get()` threw a 500 for unknown IDs. | Domain exceptions are mapped to 400/401/404/409 responses in RFC 9457 problem format. |
| The schema was dropped and recreated by an init script on every start. | Versioned Flyway migrations. |
| Only service-level unit tests with mocked repositories. | Mockito unit tests, plus integration tests that run the real SQL against PostgreSQL 16 in Testcontainers. |
| Create React App, class components, antd 4. | Vite, TypeScript, function components and hooks, antd, and TanStack Query for server state. |

## Architecture

```
React (Vite) ──/api──► Spring Boot ──► PostgreSQL
                         │
                         ├─ customer/  sign-up, JSON login, session auth
                         ├─ menu/      restaurants and menus (cached 60s in Caffeine)
                         ├─ cart/      cart lines (JdbcClient, upsert)
                         └─ order/     checkout and order history
```

Controllers handle HTTP, services hold the business rules and transactions, and repositories own the SQL. Simple tables use Spring Data JDBC repositories. The cart and order queries are hand-written SQL through `JdbcClient`, because they depend on PostgreSQL features (`ON CONFLICT`, `DELETE ... RETURNING`).

## API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | – | Create account and empty cart |
| POST | `/auth/login` | – | Start a session (JSON body) |
| POST | `/auth/logout` | ✓ | End the session |
| GET | `/auth/me` | ✓ | Current customer |
| GET | `/restaurants` | – | All restaurants with menus |
| GET | `/restaurants/{id}/menu` | – | One restaurant's menu |
| GET | `/cart` | ✓ | Current cart with total |
| POST | `/cart/items` | ✓ | Add one unit `{ "menuItemId": 1 }` |
| DELETE | `/cart/items/{menuItemId}` | ✓ | Remove one unit |
| POST | `/orders` | ✓ | Check out the cart |
| GET | `/orders` | ✓ | Order history, newest first |
| GET | `/orders/{id}` | ✓ | One of your own orders |

Interactive docs: `http://localhost:8080/swagger-ui.html`

## Running it

**Everything in Docker:**

```bash
docker compose up --build
# open http://localhost:3000
```

**Developing locally:**

```bash
docker compose up db                 # PostgreSQL on :5432
cd backend && ./gradlew bootRun      # API on :8080
cd frontend && npm install && npm run dev   # UI on :5173, proxies /api to :8080
```

## Tests

```bash
cd backend && ./gradlew test     # unit + Testcontainers integration tests (needs Docker)
cd frontend && npm test          # Vitest + Testing Library
```

GitHub Actions runs both suites on every push.

## Design notes

- **Sessions instead of JWT.** The browser keeps an `HttpOnly`, `SameSite=Strict` session cookie, and the front end is served from the same origin as the API. That avoids storing tokens in JavaScript.
- **CSRF.** Spring's CSRF token is turned off. The `SameSite=Strict` cookie is what stops other sites from sending authenticated requests. Before deploying where the API and UI have different origins, I'd turn on token-based CSRF protection.
- **Caching only the menu.** Restaurant menus are read on every page load and rarely change, so they are cached for 60 seconds. Carts change on every click and are not cached, which avoids serving a stale cart.
