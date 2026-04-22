package com.rideshare.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method; // COD, ONLINE

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // PENDING, SUCCESS, FAILED

    private Double commission;

    private Double driverAmount;

    @ManyToOne
    private User passenger;

    @ManyToOne
    private User driver;

    @OneToOne
    private Ride ride;

    private final LocalDateTime createdAt = LocalDateTime.now();
    @ManyToOne // or @OneToOne
@JoinColumn(name = "booking_id")
private Booking booking; // This allows 'bookingId' to be recognized
}
