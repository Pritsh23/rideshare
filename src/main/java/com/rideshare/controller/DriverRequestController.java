package com.rideshare.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.DriverRequest;
import com.rideshare.repository.DriverRequestRepository;
import com.rideshare.service.DriverRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
public class DriverRequestController {

    private final DriverRequestService service;
  private final DriverRequestRepository driverRequestRepository;;

    // Passenger applies
    @PostMapping("/apply")
    public DriverRequest apply(@RequestParam String licenseNumber,
                               @RequestParam String vehicleNumber,
                               Principal principal) {

                                    if (principal == null) {
        throw new RuntimeException("User not logged in");
    }

        return service.applyForDriver(
                principal.getName(),
                licenseNumber,
                vehicleNumber
        );

    }
 @GetMapping("/me")
public ResponseEntity<?> getDriver(Principal principal) {

    if (principal == null) {
        return ResponseEntity.status(401).body("Not logged in");
    }

    String email = principal.getName();

    DriverRequest driver = driverRequestRepository.findByEmail(email)
            .orElse(null);

    return ResponseEntity.ok(driver);
}

    
}