package com.rideshare.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rideshare.entity.AuthRequest;
import com.rideshare.entity.Role;
import com.rideshare.entity.User;
import com.rideshare.repository.UserRepository;
import com.rideshare.utils.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
           if (user.getRole() == null) {
        user.setRole(Role.PASSENGER);
    }
        userRepository.save(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        return jwtUtil.generateToken(request.getEmail());
    }
    @GetMapping("/admin/users")
public List<User> getAllUsers() {
    return userRepository.findAll();
}

@GetMapping("/me")
public ResponseEntity<?> getCurrentUser(java.security.Principal principal) {
    // 1. Check if the principal (session) exists
    if (principal == null) {
        return ResponseEntity.status(401).body("No session found");
    }

    // 2. Fetch user from database
    java.util.Optional<User> userOptional = userRepository.findByEmail(principal.getName());

    // 3. Handle the result manually to avoid stream/Optional errors
    if (userOptional.isPresent()) {
        User user = userOptional.get();
        user.setPassword(null); // Security: hide password
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.status(404).body("User not found");
    }
}
}
