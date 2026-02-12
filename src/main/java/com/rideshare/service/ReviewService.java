package com.rideshare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.entity.Review;
import com.rideshare.entity.User;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.ReviewRepository;
import com.rideshare.repository.UserRepository;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
  
public Review giveReview(Long bookingId,
                         int rating,
                         String comment,
                         String passengerEmail) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (!booking.getStatus().equals(BookingStatus.COMPLETED)) {
        throw new RuntimeException("Ride not completed yet");
    }

    User passenger = userRepository.findByEmail(passengerEmail)
            .orElseThrow(() -> new RuntimeException("Passenger not found"));

    Review review = Review.builder()
            .rating(rating)
            .comment(comment)
            .passenger(passenger)
            .driver(booking.getRide().getDriver())
            .ride(booking.getRide())
            .build();

    return reviewRepository.save(review);
}

}
