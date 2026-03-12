package com.rideshare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rideshare.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByDriverId(Long driverId);

}
