package com.mileszhang.siuyeh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SiuYehApplication {

    public static void main(String[] args) {
        SpringApplication.run(SiuYehApplication.class, args);
    }
}
