package com.rideshare.service;

import org.springframework.stereotype.Service;

import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.entity.Ride;
import com.rideshare.entity.User;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public Booking bookRide(Long rideId, int seats, String email) {

        User passenger = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getAvailableSeats() < seats) {
            throw new RuntimeException("Not enough seats available");
        }

        ride.setAvailableSeats(ride.getAvailableSeats() - seats);

        Booking booking = Booking.builder()
                .ride(ride)
                .passenger(passenger)
                .seatsBooked(seats)
                .status(BookingStatus.PENDING)
                .build();

        rideRepository.save(ride);
        return bookingRepository.save(booking);
    }

    @Transactional
public Booking updateBookingStatus(Long bookingId,
                                   BookingStatus status,
                                   String driverEmail) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    Ride ride = booking.getRide();

    User driver = userRepository.findByEmail(driverEmail)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

    // Check driver owns the ride
    if (!ride.getDriver().getId().equals(driver.getId())) {
        throw new RuntimeException("You are not authorized for this ride");
    }

    // Booking must be PENDING
    if (!booking.getStatus().equals(BookingStatus.PENDING)) {
        throw new RuntimeException("Booking already processed");
    }

    if (status == BookingStatus.REJECTED) {
        // return seats
        ride.setAvailableSeats(
                ride.getAvailableSeats() + booking.getSeatsBooked()
        );
        rideRepository.save(ride);
    }

    booking.setStatus(status);

    return bookingRepository.save(booking);
}

}
