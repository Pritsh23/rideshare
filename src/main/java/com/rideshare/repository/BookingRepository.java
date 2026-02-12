package com.rideshare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rideshare.entity.Booking;
import com.rideshare.entity.BookingStatus;

public interface BookingRepository extends  JpaRepository<Booking, Long>{

    List<Booking> findByRideIdAndStatus(Long rideId, BookingStatus accepted);

}
