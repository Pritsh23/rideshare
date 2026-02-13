package com.rideshare.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.DriverRequest;
import com.rideshare.service.DriverRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/driver")
@RequiredArgsConstructor
public class DriverRequestController {

    private final DriverRequestService service;

    // Passenger applies
    @PostMapping("/apply")
    public DriverRequest apply(@RequestParam String licenseNumber,
                               @RequestParam String vehicleNumber,
                               Principal principal) {

        return service.applyForDriver(
                principal.getName(),
                licenseNumber,
                vehicleNumber
        );
    }
}