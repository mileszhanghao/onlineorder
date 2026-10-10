package com.mileszhang.siuyeh.order;

import com.mileszhang.siuyeh.cart.CartLine;
import com.mileszhang.siuyeh.cart.CartRepository;
import com.mileszhang.siuyeh.common.BadRequestException;
import com.mileszhang.siuyeh.customer.CustomerEntity;
import com.mileszhang.siuyeh.customer.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    private static final String EMAIL = "a@example.com";
    private static final Instant NOW = Instant.parse("2026-10-09T20:00:00Z");

    @Mock
    private CartRepository cartRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private CustomerService customerService;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(cartRepository, orderRepository, customerService,
                Clock.fixed(NOW, ZoneOffset.UTC));
        when(customerService.getByEmail(EMAIL)).thenReturn(new CustomerEntity(1L, EMAIL, "x", true, "A", "B"));
        when(cartRepository.findCartId(1L)).thenReturn(Optional.of(10L));
    }

    @Test
    void checkout_createsOrderWithSnapshotOfCartLines() {
        when(cartRepository.removeAll(10L)).thenReturn(List.of(
                new CartLine(1L, 1L, "Noodles", new BigDecimal("15.50"), 2),
                new CartLine(2L, 1L, "Tea", new BigDecimal("3.75"), 1)));
        when(orderRepository.insertOrder(1L, new BigDecimal("34.75"), "PLACED", NOW)).thenReturn(500L);

        OrderDto order = orderService.checkout(EMAIL);

        assertThat(order.id()).isEqualTo(500L);
        assertThat(order.totalPrice()).isEqualByComparingTo("34.75");
        assertThat(order.createdAt()).isEqualTo(NOW);
        assertThat(order.lines()).hasSize(2);
        verify(orderRepository).insertLine(500L, new OrderDto.Line(1L, "Noodles", new BigDecimal("15.50"), 2));
        verify(orderRepository).insertLine(500L, new OrderDto.Line(2L, "Tea", new BigDecimal("3.75"), 1));
    }

    @Test
    void checkout_emptyCart_isRejected_andNoOrderIsWritten() {
        when(cartRepository.removeAll(10L)).thenReturn(List.of());

        assertThatThrownBy(() -> orderService.checkout(EMAIL))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Cart is empty");
        verify(orderRepository, never()).insertOrder(anyLong(), any(), anyString(), any());
    }
}
