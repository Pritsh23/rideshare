package com.rideshare.dto;

import java.time.LocalDateTime;

import com.rideshare.entity.RideStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideResponseDTO {

    private Long id;
    private String source;
    private String destination;
    private LocalDateTime departureTime;
    private Double pricePerSeat;
    private Integer availableSeats;
    private RideStatus status;
}

