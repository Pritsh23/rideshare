package com.rideshare.service;


import org.springframework.stereotype.Service;

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

    public Payment completePayment(Long rideId, PaymentMethod method) {

        Ride ride = rideRepo.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        double fare = ride.getPricePerSeat();
        double commission = fare * COMMISSION_RATE;
        double driverAmount = fare - commission;

        User driver = ride.getDriver();

        // ⭐ WALLET LOGIC
        if (method == PaymentMethod.COD) {
            // Driver received full cash → deduct commission
            driver.setWalletBalance(driver.getWalletBalance() - commission);
        } else {
            // Platform received money → give driver earnings
            driver.setWalletBalance(driver.getWalletBalance() + driverAmount);
        }

        userRepo.save(driver);

        Payment payment = Payment.builder()
                .ride(ride)
                .driver(driver)
                .passenger(ride.getPassenger())
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

        return driver.getWalletBalance();
    }


}