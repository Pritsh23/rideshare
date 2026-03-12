package com.rideshare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.Payment;
import com.rideshare.entity.PaymentMethod;
import com.rideshare.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

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

  
}
