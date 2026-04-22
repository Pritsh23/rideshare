package com.rideshare.service;

import java.util.List;

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
    User receiver;
    if (!sender.getId().equals(booking.getPassenger().getId()) &&
    !sender.getId().equals(booking.getRide().getDriver().getId())) {

    throw new RuntimeException("Not authorized to chat");
}
        // Decide receiver
        if (sender.getId().equals(booking.getPassenger().getId())) {
            receiver = booking.getRide().getDriver();
        } else {
            receiver = booking.getPassenger();
        }

    ChatMessage chat = ChatMessage.builder()
            .message(message)
            .booking(booking)
            .sender(sender)
            .receiver(receiver)
            .build();

    return chatRepository.save(chat);
}

public List<ChatMessage> getChat(Long bookingId) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (!booking.getStatus().equals(BookingStatus.ACCEPTED)) {
        throw new RuntimeException("Chat not allowed");
    }

    return chatRepository.findByBookingId(bookingId);
}

}
