package com.rideshare.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rideshare.repository.RideRepository;

@Service
public class RideCleanupService {

    private final RideRepository rideRepository;

    public RideCleanupService(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    // Runs every hour to check for old rides
    @Scheduled(fixedRate = 3600000) 
    @Transactional
    public void deleteOldRides() {
        // Calculate the time 24 hours ago
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);
        
        // Delete rides where departureTime is older than 24 hours
        rideRepository.deleteByDepartureTimeBefore(threshold);
        
        System.out.println("Auto-Cleanup: Deleted rides that departed before " + threshold);
    }
}