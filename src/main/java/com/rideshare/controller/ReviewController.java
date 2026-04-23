package com.rideshare.controller;

import java.security.Principal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;
import com.rideshare.entity.Review;
import com.rideshare.entity.User;
import com.rideshare.repository.BookingRepository;
import com.rideshare.repository.ReviewRepository;
import com.rideshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @PostMapping("/{bookingId}")
    public String giveReview(@PathVariable Long bookingId,
                             @RequestParam int rating,
                             @RequestParam String comment,
                             Principal principal) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Ride not completed");
        }

        if (!booking.getPassenger().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Not allowed");
        }

        if (reviewRepository.existsByBookingId(bookingId)) {
            throw new RuntimeException("Already reviewed");
        }

        Review review = Review.builder()
                .booking(booking)
                .passenger(booking.getPassenger())
                .driver(booking.getRide().getDriver())
                .rating(rating)
                .comment(comment)
                .build();

        reviewRepository.save(review);

        // ⭐ update driver rating
        User driver = booking.getRide().getDriver();
        double newRating = (driver.getRating() + rating) / 2;
        driver.setRating(newRating);
        userRepository.save(driver);

        return "Review submitted";
    }
}
