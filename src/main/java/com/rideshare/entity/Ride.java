package com.rideshare.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;

  
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
private LocalDateTime departureTime;

@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
private LocalDateTime availabilityEndTime;

    private Double pricePerSeat;

    private Integer totalSeats;
    private Integer availableSeats;
    private Integer bookedSeats=0;

    @Enumerated(EnumType.STRING)
    private RideStatus status; // CREATED, STARTED, COMPLETED, CANCELLED

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;



 @ManyToOne
@JoinColumn(name = "passenger_id")
private User passenger;
}
