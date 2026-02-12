package com.rideshare.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rideshare.entity.Ride;

public interface RideRepository extends JpaRepository<Ride, Long> {

    @Query("""
SELECT r FROM Ride r
WHERE r.source = :source
AND r.destination = :destination
AND DATE(r.departureTime) = DATE(:date)
AND r.pricePerSeat <= :maxPrice
AND r.status = 'CREATED'
""")
List<Ride> searchRides(String source,
                       String destination,
                       LocalDateTime date,
                       Double maxPrice);

}