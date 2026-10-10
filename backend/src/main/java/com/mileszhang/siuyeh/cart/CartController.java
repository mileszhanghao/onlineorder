package com.mileszhang.siuyeh.cart;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartDto getCart(@AuthenticationPrincipal UserDetails user) {
        return cartService.getCart(user.getUsername());
    }

    @PostMapping("/items")
    public CartDto addItem(@AuthenticationPrincipal UserDetails user, @Valid @RequestBody AddToCartRequest body) {
        return cartService.addItem(user.getUsername(), body.menuItemId());
    }

    @DeleteMapping("/items/{menuItemId}")
    public CartDto removeItem(@AuthenticationPrincipal UserDetails user, @PathVariable long menuItemId) {
        return cartService.removeItem(user.getUsername(), menuItemId);
    }
}
