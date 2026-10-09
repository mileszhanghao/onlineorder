package com.mileszhang.onlineorder.order;

import com.mileszhang.onlineorder.cart.CartLine;
import com.mileszhang.onlineorder.cart.CartRepository;
import com.mileszhang.onlineorder.common.BadRequestException;
import com.mileszhang.onlineorder.common.NotFoundException;
import com.mileszhang.onlineorder.customer.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;

@Service
public class OrderService {

    static final String STATUS_PLACED = "PLACED";

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final Clock clock;

    public OrderService(CartRepository cartRepository,
                        OrderRepository orderRepository,
                        CustomerService customerService,
                        Clock clock) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.customerService = customerService;
        this.clock = clock;
    }

    /**
     * Turns the cart into an order. The course version only cleared the cart,
     * so nothing was ever recorded. Everything here runs in one transaction:
     * if inserting the order fails, the cart rows come back.
     */
    @Transactional
    public OrderDto checkout(String email) {
        long customerId = customerService.getByEmail(email).id();
        long cartId = cartRepository.findCartId(customerId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));

        List<CartLine> lines = cartRepository.removeAll(cartId);
        if (lines.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        BigDecimal total = lines.stream().map(CartLine::lineTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        Instant now = Instant.now(clock);
        long orderId = orderRepository.insertOrder(customerId, total, STATUS_PLACED, now);

        List<OrderDto.Line> orderLines = lines.stream()
                .map(l -> new OrderDto.Line(l.menuItemId(), l.name(), l.unitPrice(), l.quantity()))
                .toList();
        orderLines.forEach(line -> orderRepository.insertLine(orderId, line));

        return new OrderDto(orderId, total, STATUS_PLACED, now, orderLines);
    }

    public List<OrderDto> getOrders(String email) {
        return orderRepository.findByCustomer(customerService.getByEmail(email).id());
    }

    public OrderDto getOrder(String email, long orderId) {
        long customerId = customerService.getByEmail(email).id();
        // Scoped by customer: asking for someone else's order id is a 404, not a leak.
        return orderRepository.findByIdForCustomer(orderId, customerId)
                .orElseThrow(() -> new NotFoundException("Order " + orderId + " not found"));
    }
}
