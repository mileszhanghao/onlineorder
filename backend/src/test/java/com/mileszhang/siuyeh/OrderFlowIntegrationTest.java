package com.mileszhang.siuyeh;

import com.mileszhang.siuyeh.cart.CartService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class OrderFlowIntegrationTest extends IntegrationTestBase {

    private static final String PASSWORD = "correct-horse-battery";

    @Autowired
    private MockMvc mvc;
    @Autowired
    private CartService cartService;
    @Autowired
    private JdbcUserDetailsManager userDetailsManager;

    @Test
    void restaurantsAreSeededAndPublic() throws Exception {
        mvc.perform(get("/restaurants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].menuItems", hasSize(6)))
                .andExpect(jsonPath("$[0].menuItems[0].imageUrl").isNotEmpty());
    }

    @Test
    void unknownRestaurant_is404() throws Exception {
        mvc.perform(get("/restaurants/9999/menu")).andExpect(status().isNotFound());
    }

    @Test
    void cartRequiresLogin() throws Exception {
        mvc.perform(get("/cart")).andExpect(status().isUnauthorized());
    }

    @Test
    void fullFlow_signup_login_addToCart_checkout_history() throws Exception {
        String email = newEmail();
        signUp(email);
        MockHttpSession session = login(email);

        mvc.perform(post("/cart/items").session(session).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"menuItemId\": 1}"))
                .andExpect(status().isOk());
        mvc.perform(post("/cart/items").session(session).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"menuItemId\": 1}"))
                .andExpect(status().isOk());
        mvc.perform(post("/cart/items").session(session).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"menuItemId\": 4}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(2)))
                .andExpect(jsonPath("$.items[0].quantity").value(2))
                // 2 x 14.50 (wonton noodles) + 6.50 (egg tarts)
                .andExpect(jsonPath("$.totalPrice").value(35.50));

        mvc.perform(delete("/cart/items/4").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.totalPrice").value(29.00));

        mvc.perform(post("/orders").session(session))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PLACED"))
                .andExpect(jsonPath("$.totalPrice").value(29.00))
                .andExpect(jsonPath("$.lines[0].name").value("Shrimp Wonton Noodles · 鮮蝦雲吞麵"));

        mvc.perform(get("/cart").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)));
        mvc.perform(get("/orders").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void checkoutWithEmptyCart_is400() throws Exception {
        String email = newEmail();
        signUp(email);
        mvc.perform(post("/orders").session(login(email))).andExpect(status().isBadRequest());
    }

    @Test
    void cannotReadAnotherCustomersOrder() throws Exception {
        String alice = newEmail();
        signUp(alice);
        MockHttpSession aliceSession = login(alice);
        mvc.perform(post("/cart/items").session(aliceSession).contentType(MediaType.APPLICATION_JSON)
                .content("{\"menuItemId\": 2}"));
        MvcResult order = mvc.perform(post("/orders").session(aliceSession)).andReturn();
        String orderId = com.jayway.jsonpath.JsonPath.read(order.getResponse().getContentAsString(), "$.id").toString();

        String bob = newEmail();
        signUp(bob);
        mvc.perform(get("/orders/" + orderId).session(login(bob))).andExpect(status().isNotFound());
        mvc.perform(get("/orders/" + orderId).session(aliceSession)).andExpect(status().isOk());
    }

    @Test
    void duplicateSignup_is409_andInvalidSignup_is400() throws Exception {
        String email = newEmail();
        signUp(email);
        mvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON).content(signupJson(email)))
                .andExpect(status().isConflict());
        mvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"not-an-email\",\"password\":\"short\",\"firstName\":\"\",\"lastName\":\"X\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void wrongPassword_is401() throws Exception {
        String email = newEmail();
        signUp(email);
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signedUpUserHasRoleUser() {
        String email = newEmail();
        try {
            signUp(email);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        List<String> roles = userDetailsManager.loadUserByUsername(email).getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        assertThat(roles).containsExactly("ROLE_USER");
    }

    @Test
    void concurrentAddsToTheSameItem_loseNoUpdates() throws Exception {
        String email = newEmail();
        signUp(email);
        int threads = 20;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<?>> futures = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            futures.add(pool.submit(() -> {
                start.await();
                cartService.addItem(email, 5L);
                return null;
            }));
        }
        start.countDown();
        for (Future<?> f : futures) {
            f.get();
        }
        pool.shutdown();

        assertThat(cartService.getCart(email).items())
                .singleElement()
                .satisfies(line -> assertThat(line.quantity()).isEqualTo(threads));
    }

    private static String newEmail() {
        return "user-" + UUID.randomUUID() + "@example.com";
    }

    private static String signupJson(String email) {
        return "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD
                + "\",\"firstName\":\"Test\",\"lastName\":\"User\"}";
    }

    private void signUp(String email) throws Exception {
        mvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON).content(signupJson(email)))
                .andExpect(status().isCreated());
    }

    private MockHttpSession login(String email) throws Exception {
        MvcResult result = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andReturn();
        return (MockHttpSession) result.getRequest().getSession(false);
    }
}
