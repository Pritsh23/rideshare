package com.rideshare.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional; // Required for deletion

import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.entity.Ride;
import com.rideshare.entity.User;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;
import com.rideshare.repository.PaymentRepository; // Required for cleanup

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository; // Injected for cancel logic

    @PostMapping("/create/{rideId}")
    public Booking createBooking(@PathVariable Long rideId,
                                 @RequestParam int seats,
                                 Principal principal) {

        User passenger = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // Driver cannot book their own ride
        if (ride.getDriver().getId().equals(passenger.getId())) {
            throw new RuntimeException("Drivers cannot book their own rides.");
        }

        int currentBooked = (ride.getBookedSeats() == null) ? 0 : ride.getBookedSeats();
        int totalSeats = (ride.getTotalSeats() == null) ? 0 : ride.getTotalSeats();
        int available = totalSeats - currentBooked;

        if (available < seats) {
            throw new RuntimeException("Not enough seats available.");
        }

        // Update ride seats
        int newBookedCount = currentBooked + seats;
        ride.setBookedSeats(newBookedCount);
        ride.setAvailableSeats(totalSeats - newBookedCount);
        rideRepository.save(ride);

        // Build new Booking
        Booking booking = Booking.builder()
                .ride(ride)
                .passenger(passenger)
                .seatsBooked(seats)
                .status(BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    @GetMapping("/my")
    public List<Booking> myBookings(Principal principal) {
        return bookingRepository.findByPassengerEmail(principal.getName());
    }

    @GetMapping("/driver")
    public List<Booking> driverBookings(Principal principal) {
        return bookingRepository.findByRideDriverEmail(principal.getName());
    }

    @PutMapping("/{bookingId}/status")
    public Booking updateBookingStatus(@PathVariable Long bookingId,
                                       @RequestParam BookingStatus status,
                                       Principal principal) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getRide().getDriver().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Not authorized.");
        }

        // Restore seats if rejected
        if (status == BookingStatus.REJECTED && booking.getStatus() != BookingStatus.REJECTED) {
            Ride ride = booking.getRide();
            int currentBooked = (ride.getBookedSeats() == null) ? 0 : ride.getBookedSeats();
            ride.setBookedSeats(Math.max(0, currentBooked - booking.getSeatsBooked()));
            ride.setAvailableSeats(ride.getTotalSeats() - ride.getBookedSeats());
            rideRepository.save(ride);
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    @DeleteMapping("/{bookingId}")
    @Transactional
    public String cancelBooking(@PathVariable Long bookingId, Principal principal) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getPassenger().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Not authorized to cancel this booking.");
        }

        Ride ride = booking.getRide();

        // 1. Restore seats to ride
        int currentBooked = (ride.getBookedSeats() == null) ? 0 : ride.getBookedSeats();
        ride.setBookedSeats(Math.max(0, currentBooked - booking.getSeatsBooked()));
        ride.setAvailableSeats(ride.getTotalSeats() - ride.getBookedSeats());
        rideRepository.save(ride);

        // 2. Remove associated Payment record by rideId
        paymentRepository.deleteByRideId(ride.getId());

        // 3. Delete the booking
        bookingRepository.delete(booking);

        return "Booking and payment records removed successfully";
    }
}