package com.mileszhang.onlineorder.customer;

import jakarta.validation.constraints.NotBlank;

/** Credentials travel in the JSON body, never in the URL. */
public record LoginRequest(
        @NotBlank String email,
        @NotBlank String password
) {
}
