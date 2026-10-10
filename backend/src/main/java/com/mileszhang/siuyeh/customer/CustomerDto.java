package com.mileszhang.siuyeh.customer;

public record CustomerDto(Long id, String email, String firstName, String lastName) {

    static CustomerDto from(CustomerEntity entity) {
        return new CustomerDto(entity.id(), entity.email(), entity.firstName(), entity.lastName());
    }
}
