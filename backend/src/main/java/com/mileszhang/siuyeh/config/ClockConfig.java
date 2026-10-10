package com.mileszhang.siuyeh.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
public class ClockConfig {

    /** Injected instead of calling Instant.now() directly, so tests can pin the time. */
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
