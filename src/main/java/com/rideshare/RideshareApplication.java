package com.rideshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // ✅ This enables the background cleanup task
public class RideshareApplication {

    public static void main(String[] args) {
        SpringApplication.run(RideshareApplication.class, args);
    }

}