package com.rideshare.dto;

import java.time.LocalDateTime;

import com.rideshare.entity.RideStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RideResponseDTO {

    private Long id;
    private String source;
    private String destination;
    private LocalDateTime departureTime;
    private Double pricePerSeat;
    private int availableSeats;
    private RideStatus status;
}

