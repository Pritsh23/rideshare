package com.rideshare.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.entity.Payment;
import com.rideshare.entity.PaymentMethod;
import com.rideshare.entity.PaymentStatus;
import com.rideshare.entity.Ride;
import com.rideshare.entity.RideStatus;
import com.rideshare.entity.User;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.PaymentRepository;
import com.rideshare.repository.RideRepository;
import com.rideshare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final RideRepository rideRepo;
    private final UserRepository userRepo;
    private final BookingRepository bookingRepo;

    private static final double COMMISSION_RATE = 0.20; // 20%

    @Transactional
    public Payment completePayment(Long bookingId, PaymentMethod method) {

        // ✅ Get booking
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // ✅ Only allow if ACCEPTED
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Payment not allowed");
        }

        Ride ride = booking.getRide();
        User driver = ride.getDriver();
        User passenger = booking.getPassenger();

        // ✅ Calculate fare (based on seats)
        double pricePerSeat = (ride.getPricePerSeat() == null) ? 0.0 : ride.getPricePerSeat();
        int seats = booking.getSeatsBooked();

        double fare = pricePerSeat * seats;
        double commission = fare * COMMISSION_RATE;
        double driverAmount = fare - commission;

        // ✅ Wallet handling
        double currentBalance = (driver.getWalletBalance() == null) ? 0.0 : driver.getWalletBalance();

        if (method == PaymentMethod.COD) {
            // Driver got cash → platform takes commission
            driver.setWalletBalance(currentBalance - commission);
        } else {
            // Online → driver gets share
            driver.setWalletBalance(currentBalance + driverAmount);
        }

        userRepo.save(driver);

        // ✅ Create Payment
        Payment payment = Payment.builder()
                .booking(booking)
                .ride(ride)
                .driver(driver)
                .passenger(passenger)
                .amount(fare)
                .commission(commission)
                .driverAmount(driverAmount)
                .method(method)
                .status(PaymentStatus.SUCCESS)
                .build();

        paymentRepo.save(payment);

        // ✅ AUTO COMPLETE FLOW
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepo.save(booking);

        ride.setStatus(RideStatus.COMPLETED);
        rideRepo.save(ride);

        return payment;
    }

    // ✅ Wallet API
    public Double getDriverWallet(Long driverId) {
        User driver = userRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        return (driver.getWalletBalance() == null) ? 0.0 : driver.getWalletBalance();
    }
}