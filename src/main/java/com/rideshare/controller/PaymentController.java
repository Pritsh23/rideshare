package com.rideshare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.Payment;
import com.rideshare.entity.PaymentMethod;
import com.rideshare.entity.PaymentStatus;
import com.rideshare.repository.PaymentRepository;
import com.rideshare.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

private final PaymentRepository paymentRepository;
private final PaymentService paymentService;

    @PostMapping("/complete/{rideId}")
    public ResponseEntity<Payment> completePayment(
            @PathVariable Long rideId,
            @RequestParam PaymentMethod method
    ) {
        return ResponseEntity.ok(
                paymentService.completePayment(rideId, method)
        );
    }


    @GetMapping("/driver/wallet/{driverId}")
    public ResponseEntity<Double> getDriverWallet(@PathVariable Long driverId) {
        return ResponseEntity.ok(
                paymentService.getDriverWallet(driverId)
        );
    }
 

@GetMapping("/upi/{bookingId}")
public String generateUpiLink(@PathVariable Long bookingId) {

    Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    double amount = payment.getAmount();

   String upiId = "yelvepritish06@okicici";

String upiUrl = "upi://pay?pa=" + upiId +
        "&pn=RideShare" +
        "&am=" + amount +
        "&cu=INR";

    return upiUrl;
}

@PutMapping("/success/{bookingId}")
public String markPaymentSuccess(@PathVariable Long bookingId) {

    Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    if (payment.getStatus() == PaymentStatus.SUCCESS) {
        return "Payment already completed";
    }

    payment.setStatus(PaymentStatus.SUCCESS);
    paymentRepository.save(payment);

    return "Payment successful";
}
}
