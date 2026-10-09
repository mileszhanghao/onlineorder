package com.mileszhang.onlineorder.cart;

import com.mileszhang.onlineorder.common.NotFoundException;
import com.mileszhang.onlineorder.customer.CustomerEntity;
import com.mileszhang.onlineorder.customer.CustomerService;
import com.mileszhang.onlineorder.menu.MenuItemEntity;
import com.mileszhang.onlineorder.menu.MenuService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    private static final String EMAIL = "a@example.com";
    private static final long CUSTOMER_ID = 7L;
    private static final long CART_ID = 70L;

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CustomerService customerService;
    @Mock
    private MenuService menuService;

    private CartService cartService;

    @BeforeEach
    void setUp() {
        cartService = new CartService(cartRepository, customerService, menuService);
        when(customerService.getByEmail(EMAIL))
                .thenReturn(new CustomerEntity(CUSTOMER_ID, EMAIL, "x", true, "A", "B"));
        when(cartRepository.findCartId(CUSTOMER_ID)).thenReturn(Optional.of(CART_ID));
    }

    @Test
    void addItem_usesCurrentMenuPrice_andReturnsUpdatedCart() {
        MenuItemEntity item = new MenuItemEntity(3L, 1L, "Dumplings", "", new BigDecimal("10.00"), null);
        when(menuService.getMenuItem(3L)).thenReturn(item);
        when(cartRepository.findLines(CART_ID)).thenReturn(List.of(
                new CartLine(3L, 1L, "Dumplings", new BigDecimal("10.00"), 2)));

        CartDto cart = cartService.addItem(EMAIL, 3L);

        verify(cartRepository).addOne(CART_ID, 3L, new BigDecimal("10.00"));
        assertThat(cart.totalPrice()).isEqualByComparingTo("20.00");
        assertThat(cart.items()).singleElement().satisfies(line -> assertThat(line.quantity()).isEqualTo(2));
    }

    @Test
    void addItem_unknownMenuItem_doesNotTouchCart() {
        when(menuService.getMenuItem(99L)).thenThrow(new NotFoundException("Menu item 99 not found"));

        assertThatThrownBy(() -> cartService.addItem(EMAIL, 99L)).isInstanceOf(NotFoundException.class);
        verify(cartRepository, never()).addOne(anyLong(), anyLong(), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void removeItem_notInCart_isNotFound() {
        when(cartRepository.removeOne(CART_ID, 5L)).thenReturn(false);

        assertThatThrownBy(() -> cartService.removeItem(EMAIL, 5L)).isInstanceOf(NotFoundException.class);
    }

    @Test
    void cartTotal_usesExactDecimalArithmetic() {
        // 0.1 + 0.2 != 0.3 with double; BigDecimal keeps cents exact.
        when(cartRepository.findLines(CART_ID)).thenReturn(List.of(
                new CartLine(1L, 1L, "A", new BigDecimal("0.10"), 1),
                new CartLine(2L, 1L, "B", new BigDecimal("0.20"), 1)));

        assertThat(cartService.getCart(EMAIL).totalPrice()).isEqualByComparingTo("0.30");
    }
}
