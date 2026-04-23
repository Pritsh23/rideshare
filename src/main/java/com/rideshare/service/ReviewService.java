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

        // ✅ Only after completion
        if (!booking.getStatus().equals(BookingStatus.COMPLETED)) {
            throw new RuntimeException("Ride not completed yet");
        }

        User passenger = userRepository.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        // ✅ Prevent duplicate review
        if (reviewRepository.existsByBookingId(bookingId)) {
            throw new RuntimeException("Review already submitted");
        }

        Review review = Review.builder()
                .booking(booking) // ✅ FIXED (IMPORTANT)
                .rating(rating)
                .comment(comment)
                .passenger(passenger)
                .driver(booking.getRide().getDriver())
                .build();

        // ⭐ Update driver rating
        User driver = booking.getRide().getDriver();
        double newRating = (driver.getRating() + rating) / 2;
        driver.setRating(newRating);
        userRepository.save(driver);

        return reviewRepository.save(review);
    }
}
