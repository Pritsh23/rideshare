package com.rideshare.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.rideshare.entity.Location;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class LocationWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/location/{rideId}")
    public void sendLocation(@DestinationVariable Long rideId,
                             Location location) {

        messagingTemplate.convertAndSend(
                "/topic/location/" + rideId,
                location
        );
    }
}
