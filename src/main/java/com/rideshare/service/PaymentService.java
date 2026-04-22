package com.rideshare.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rideshare.entity.Payment;
import com.rideshare.entity.PaymentMethod;
import com.rideshare.entity.PaymentStatus;
import com.rideshare.entity.Ride;
import com.rideshare.entity.User;
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

    private static final double COMMISSION_RATE = 0.20; // 20%

    @Transactional // ✅ Added to ensure wallet update and payment record save happen together
    public Payment completePayment(Long rideId, PaymentMethod method) {

        Ride ride = rideRepo.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // Use price per seat (adjust this if you support multiple seats in one payment)
        double fare = (ride.getPricePerSeat() == null) ? 0.0 : ride.getPricePerSeat();
        double commission = fare * COMMISSION_RATE;
        double driverAmount = fare - commission;

        User driver = ride.getDriver();

        // ⭐ FIX: Handle null wallet balance safely
        double currentBalance = (driver.getWalletBalance() == null) ? 0.0 : driver.getWalletBalance();

        // ⭐ WALLET LOGIC
        if (method == PaymentMethod.COD) {
            // Driver received full cash directly from passenger → Platform deducts commission from wallet
            driver.setWalletBalance(currentBalance - commission);
        } else {
            // Platform received money (ONLINE) → Platform adds driver's share to wallet
            driver.setWalletBalance(currentBalance + driverAmount);
        }

        userRepo.save(driver);

        // Build the Payment record
        // Note: Check if your Payment entity uses .builder() or new Payment()
        Payment payment = Payment.builder()
                .ride(ride)
                .driver(driver)
                .passenger(null) // Optional: ride.getPassenger() if your Ride entity has it
                .amount(fare)
                .commission(commission)
                .driverAmount(driverAmount)
                .method(method)
                .status(PaymentStatus.SUCCESS)
                .build();

        return paymentRepo.save(payment);
    }

    public Double getDriverWallet(Long driverId) {
        User driver = userRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // ✅ Return 0.0 if wallet is null so frontend doesn't crash
        return (driver.getWalletBalance() == null) ? 0.0 : driver.getWalletBalance();
    }
}