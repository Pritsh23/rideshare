package com.rideshare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rideshare.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByDriverId(Long driverId);

    Optional<Payment> findByRideId(Long rideId);

    // ✅ Change this from deleteByBookingId to deleteByRideId
    void deleteByRideId(Long rideId); 

    Optional<Payment> findByBookingId(Long bookingId);
   
}