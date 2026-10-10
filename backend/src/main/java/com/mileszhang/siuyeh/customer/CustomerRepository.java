package com.mileszhang.siuyeh.customer;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;

import java.util.Optional;

public interface CustomerRepository extends ListCrudRepository<CustomerEntity, Long> {

    Optional<CustomerEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE customers SET first_name = :firstName, last_name = :lastName WHERE email = :email")
    void updateNameByEmail(String email, String firstName, String lastName);
}
