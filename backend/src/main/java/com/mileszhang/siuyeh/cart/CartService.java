package com.mileszhang.siuyeh.cart;

import com.mileszhang.siuyeh.common.NotFoundException;
import com.mileszhang.siuyeh.customer.CustomerService;
import com.mileszhang.siuyeh.menu.MenuItemEntity;
import com.mileszhang.siuyeh.menu.MenuService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CustomerService customerService;
    private final MenuService menuService;

    public CartService(CartRepository cartRepository, CustomerService customerService, MenuService menuService) {
        this.cartRepository = cartRepository;
        this.customerService = customerService;
        this.menuService = menuService;
    }

    public long cartIdFor(String email) {
        long customerId = customerService.getByEmail(email).id();
        return cartRepository.findCartId(customerId)
                .orElseThrow(() -> new NotFoundException("Cart not found"));
    }

    public CartDto getCart(String email) {
        return CartDto.from(cartRepository.findLines(cartIdFor(email)));
    }

    @Transactional
    public CartDto addItem(String email, long menuItemId) {
        long cartId = cartIdFor(email);
        MenuItemEntity item = menuService.getMenuItem(menuItemId);
        cartRepository.addOne(cartId, item.id(), item.price());
        return CartDto.from(cartRepository.findLines(cartId));
    }

    @Transactional
    public CartDto removeItem(String email, long menuItemId) {
        long cartId = cartIdFor(email);
        if (!cartRepository.removeOne(cartId, menuItemId)) {
            throw new NotFoundException("Item " + menuItemId + " is not in the cart");
        }
        return CartDto.from(cartRepository.findLines(cartId));
    }
}
