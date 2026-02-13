package com.rideshare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rideshare.entity.DriverRequest;
import com.rideshare.entity.RequestStatus;

@Repository
public interface DriverRequestRepository 
        extends JpaRepository<DriverRequest, Long> {

    List<DriverRequest> findByStatus(RequestStatus status);

    Optional<DriverRequest> findByUserId(Long userId);
}
