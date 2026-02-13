package com.rideshare.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;
import com.rideshare.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/passenger/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final BookingService bookingService;
    

@PostMapping("/book/{rideId}")
public Booking bookRide(@PathVariable Long rideId,
                        @RequestParam int seats,
                        Principal principal) {

    return bookingService.bookRide(rideId, seats, principal.getName());
}
@PutMapping("/update/{bookingId}")
public Booking updateBooking(@PathVariable Long bookingId,
                             @RequestParam BookingStatus status,
                             Principal principal) {

    return bookingService.updateBookingStatus(
            bookingId,
            status,
            principal.getName()
    );
}

}
