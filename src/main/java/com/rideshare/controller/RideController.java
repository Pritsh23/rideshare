package com.rideshare.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.dto.RideResponseDTO;
import com.rideshare.entity.Ride;
import com.rideshare.entity.RideStatus;
import com.rideshare.entity.User;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;
import com.rideshare.service.RideService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final RideService rideService;

    // 🚀 1. Create a Ride
    @PostMapping("/create")
    public Ride createRide(@RequestBody Ride ride, Principal principal) {
        User driver = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        ride.setDriver(driver);
        // Ensure bookedSeats starts at 0 to prevent NullPointerException during booking
        ride.setBookedSeats(0); 
        ride.setAvailableSeats(ride.getTotalSeats());
        ride.setStatus(RideStatus.CREATED);

        return rideRepository.save(ride);
    }

    // 🔍 2. Search for Rides
    @GetMapping("/search")
    public List<RideResponseDTO> searchRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
            @RequestParam Double maxPrice) {

        return rideService.searchRides(source, destination, date, maxPrice);
    }

    // 🚗 3. Fetch "My Offered Rides" for the Driver
   @GetMapping("/my")
public List<Ride> getMyRides(Principal principal) {
    User driver = userRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Remove the "CREATED" filter to see all your rides
    return rideRepository.findByDriverId(driver.getId());
}
}