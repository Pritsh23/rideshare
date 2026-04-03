package com.rideshare.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.DriverRequest;
import com.rideshare.service.DriverRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
public class DriverRequestController {

    private final DriverRequestService service;

    // Passenger applies
    @PostMapping("/apply")
    public DriverRequest apply(@RequestParam String licenseNumber,
                               @RequestParam String vehicleNumber,
                               Principal principal) {

        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }

        return service.applyForDriver(
                principal.getName(),
                licenseNumber,
                vehicleNumber
        );

    }
    // Driver views their application status
    @GetMapping("/application-status")
    public DriverRequest getApplicationStatus(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }
        return service.getDriverRequestStatus(principal.getName());
    }

    @GetMapping("/me")
    public DriverRequest getMe(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("User not authenticated");
        }
        return service.getDriverRequestStatus(principal.getName());
    }
    
}