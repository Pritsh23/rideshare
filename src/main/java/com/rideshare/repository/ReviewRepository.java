package com.rideshare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rideshare.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
