package com.rideshare.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.rideshare.entity.*;
import com.rideshare.repository.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    // 🚀 1. Passenger books a ride
    @PostMapping("/create/{rideId}")
    public Booking createBooking(@PathVariable Long rideId,
                                 @RequestParam int seats,
                                 Principal principal) {

        User passenger = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getAvailableSeats() < seats) {
            throw new RuntimeException("Not enough seats available");
        }

        // ✅ update ride seats
        ride.setBookedSeats(ride.getBookedSeats() + seats);
        ride.setAvailableSeats(ride.getTotalSeats() - ride.getBookedSeats());
        rideRepository.save(ride);

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(seats);
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }
    

    // 👤 2. Passenger sees their bookings
    @GetMapping("/my")
    public List<Booking> myBookings(Principal principal) {
        return bookingRepository.findByPassengerEmail(principal.getName());
    }

    // 🚗 3. Driver sees bookings for his rides
    @GetMapping("/driver")
    public List<Booking> driverBookings(Principal principal) {
        return bookingRepository.findByRideDriverEmail(principal.getName());
    }

    // 🔥 4. Driver accepts/rejects booking
@PutMapping("/{bookingId}/status")
public Booking updateBookingStatus(@PathVariable Long bookingId,
                                   @RequestParam BookingStatus status,
                                   Principal principal) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    String driverEmail = booking.getRide().getDriver().getEmail();

    if (!driverEmail.equals(principal.getName())) {
        throw new RuntimeException("Not allowed");
    }

    // 🔄 restore seats if rejected
    if (status == BookingStatus.REJECTED) {
        Ride ride = booking.getRide();

        ride.setBookedSeats(ride.getBookedSeats() - booking.getSeatsBooked());
        ride.setAvailableSeats(ride.getTotalSeats() - ride.getBookedSeats());

        rideRepository.save(ride);
    }

    booking.setStatus(status);

    return bookingRepository.save(booking);
}
    // ❌ 5. Cancel booking (Passenger)
    @DeleteMapping("/{bookingId}")
    public String cancelBooking(@PathVariable Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Ride ride = booking.getRide();

        // 🔄 restore seats
        ride.setBookedSeats(ride.getBookedSeats() - booking.getSeatsBooked());
        ride.setAvailableSeats(ride.getTotalSeats() - ride.getBookedSeats());

        rideRepository.save(ride);

        bookingRepository.delete(booking);

        return "Booking cancelled successfully";
    }
}