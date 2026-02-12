package com.rideshare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.entity.ChatMessage;
import com.rideshare.entity.User;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.ChatMessageRepository;
import com.rideshare.repository.UserRepository;
@Service
public class ChatService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired 
    private UserRepository userRepository; 
    @Autowired
    private ChatMessageRepository chatRepository;
    
public ChatMessage sendMessage(Long bookingId,
                               String message,
                               String senderEmail) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (!booking.getStatus().equals(BookingStatus.ACCEPTED)) {
        throw new RuntimeException("Chat not allowed");
    }

    User sender = userRepository.findByEmail(senderEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!sender.getId().equals(booking.getPassenger().getId()) &&
        !sender.getId().equals(booking.getRide().getDriver().getId())) {

        throw new RuntimeException("Not authorized to chat");
    }

    ChatMessage chat = ChatMessage.builder()
            .message(message)
            .booking(booking)
            .sender(sender)
            .build();

    return chatRepository.save(chat);
}

}
