package com.mileszhang.onlineorder.customer;

import com.mileszhang.onlineorder.cart.CartRepository;
import com.mileszhang.onlineorder.common.ConflictException;
import com.mileszhang.onlineorder.common.NotFoundException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CartRepository cartRepository;
    private final UserDetailsManager userDetailsManager;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository,
                           CartRepository cartRepository,
                           UserDetailsManager userDetailsManager,
                           PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.cartRepository = cartRepository;
        this.userDetailsManager = userDetailsManager;
        this.passwordEncoder = passwordEncoder;
    }

    /** Creates the login, the customer profile and an empty cart in one transaction. */
    @Transactional
    public CustomerDto signUp(SignupRequest request) {
        String email = normalize(request.email());
        if (customerRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists");
        }
        UserDetails user = User.builder()
                .username(email)
                .password(passwordEncoder.encode(request.password()))
                .roles("USER")
                .build();
        try {
            userDetailsManager.createUser(user);
        } catch (DuplicateKeyException e) {
            // Two sign-ups with the same email raced past the exists check.
            throw new ConflictException("An account with this email already exists");
        }
        customerRepository.updateNameByEmail(email, request.firstName().trim(), request.lastName().trim());
        CustomerEntity customer = getByEmail(email);
        cartRepository.createForCustomer(customer.id());
        return CustomerDto.from(customer);
    }

    public CustomerEntity getByEmail(String email) {
        return customerRepository.findByEmail(normalize(email))
                .orElseThrow(() -> new NotFoundException("Customer not found"));
    }

    public CustomerDto getProfile(String email) {
        return CustomerDto.from(getByEmail(email));
    }

    public static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
