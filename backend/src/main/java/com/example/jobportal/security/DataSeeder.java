package com.example.jobportal.security;

import com.example.jobportal.entity.Role;
import com.example.jobportal.entity.User;
import com.example.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> existingAdmin = userRepository.findByEmail("admin@jobconnect.com");
        if (existingAdmin.isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@jobconnect.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setFullName("Admin User");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user seeded: admin@jobconnect.com / password");
        } else {
            // Force reset password to be sure
            User admin = existingAdmin.get();
            admin.setPassword(passwordEncoder.encode("password"));
            userRepository.save(admin);
            System.out.println("Admin user password reset: admin@jobconnect.com / password");
        }
    }
}
