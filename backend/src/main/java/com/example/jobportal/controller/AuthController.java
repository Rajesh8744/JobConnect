package com.example.jobportal.controller;

import com.example.jobportal.dto.AuthResponse;
import com.example.jobportal.entity.User;
import com.example.jobportal.repository.UserRepository;
import com.example.jobportal.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        System.out.println("DEBUG: Registering user: " + user.getEmail());
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already taken"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(com.example.jobportal.entity.Role.SEEKER);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found after auth"));
            String token = jwtTokenProvider.generateToken(authentication);

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getRole().name(),
                    user.getFullName()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }
}
