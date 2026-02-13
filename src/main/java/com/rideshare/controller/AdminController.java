package com.rideshare.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.DriverRequest;
import com.rideshare.entity.RequestStatus;
import com.rideshare.repository.DriverRequestRepository;
import com.rideshare.service.DriverRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DriverRequestService service;
    private final DriverRequestRepository repository;

    @GetMapping("/driver-requests")
    public List<DriverRequest> getPendingRequests() {
        return repository.findByStatus(RequestStatus.PENDING);
    }

    @PutMapping("/driver-requests/{id}")
    public DriverRequest updateRequest(@PathVariable Long id,
                                       @RequestParam RequestStatus status) {

        return service.updateStatus(id, status);
    }
}
