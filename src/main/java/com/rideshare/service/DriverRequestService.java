package com.rideshare.service;

import org.springframework.stereotype.Service;

import com.rideshare.entity.DriverRequest;
import com.rideshare.entity.RequestStatus;
import com.rideshare.entity.Role;
import com.rideshare.entity.User;
import com.rideshare.repository.DriverRequestRepository;
import com.rideshare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverRequestService {

    private final DriverRequestRepository driverRequestRepository;
    private final UserRepository userRepository;

    // Passenger applies
    public DriverRequest applyForDriver(String email,
                                        String licenseNumber,
                                        String vehicleNumber) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.DRIVER) {
            throw new RuntimeException("Already a driver");
        }

        DriverRequest request = DriverRequest.builder()
                .licenseNumber(licenseNumber)
                .vehicleNumber(vehicleNumber)
                .status(RequestStatus.PENDING)
                .user(user)
                .build();

        return driverRequestRepository.save(request);
    }

    // Admin approves or rejects
    public DriverRequest updateStatus(Long requestId,
                                      RequestStatus status) {

        DriverRequest request =
                driverRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException("Request not found"));

        request.setStatus(status);

        if (status == RequestStatus.APPROVED) {
            User user = request.getUser();
            user.setRole(Role.DRIVER);
            userRepository.save(user);
        }

        return driverRequestRepository.save(request);
    }
}
