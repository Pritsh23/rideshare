package com.rideshare.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RideRequestDTO {

    private String source;
    private String destination;
    private LocalDateTime departureTime;
    private Double pricePerSeat;
    private int totalSeats;
}
