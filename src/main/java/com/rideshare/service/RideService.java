package com.rideshare.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rideshare.dto.RideRequestDTO;
import com.rideshare.dto.RideResponseDTO;
import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.entity.Ride;
import com.rideshare.entity.RideStatus;
import com.rideshare.entity.User;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
public RideResponseDTO createRide(RideRequestDTO dto,
                                   String driverEmail) {

    User driver = userRepository.findByEmail(driverEmail)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

    Ride ride = Ride.builder()
            .source(dto.getSource())
            .destination(dto.getDestination())
            .departureTime(dto.getDepartureTime())
            .pricePerSeat(dto.getPricePerSeat())
            .totalSeats(dto.getTotalSeats())
            .availableSeats(dto.getTotalSeats())
            .status(RideStatus.CREATED)
            .driver(driver)
            .build();

    Ride saved = rideRepository.save(ride);

    return RideResponseDTO.builder()
            .id(saved.getId())
            .source(saved.getSource())
            .destination(saved.getDestination())
            .departureTime(saved.getDepartureTime())
            .pricePerSeat(saved.getPricePerSeat())
            .availableSeats(saved.getAvailableSeats())
            .status(saved.getStatus())
            .build();
}

    @Transactional
public Ride updateRideStatus(Long rideId,
                             RideStatus status,
                             String driverEmail) {

    Ride ride = rideRepository.findById(rideId)
            .orElseThrow(() -> new RuntimeException("Ride not found"));

    User driver = userRepository.findByEmail(driverEmail)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

    if (!ride.getDriver().getId().equals(driver.getId())) {
        throw new RuntimeException("Not your ride");
    }

    ride.setStatus(status);

    // If completed → mark all ACCEPTED bookings as COMPLETED
    if (status == RideStatus.COMPLETED) {

        List<Booking> bookings =
                bookingRepository.findByRideIdAndStatus(
                        rideId,
                        BookingStatus.ACCEPTED
                );

        bookings.forEach(b -> b.setStatus(BookingStatus.COMPLETED));
    }

    return rideRepository.save(ride);
}
@Cacheable("rides")
public List<RideResponseDTO> searchRides(String source,
                                         String destination,
                                         LocalDateTime date,
                                         Double maxPrice) {

    List<Ride> rides =
            rideRepository.searchRides(source, destination, date, maxPrice);

    return rides.stream()
            .map(r -> RideResponseDTO.builder()
                    .id(r.getId())
                    .source(r.getSource())
                    .destination(r.getDestination())
                    .departureTime(r.getDepartureTime())
                    .pricePerSeat(r.getPricePerSeat())
                    .availableSeats(r.getAvailableSeats())
                    .status(r.getStatus())
                    .build())
            .toList();
}

}
