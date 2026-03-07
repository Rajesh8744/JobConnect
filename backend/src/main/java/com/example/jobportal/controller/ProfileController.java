package com.example.jobportal.controller;

import com.example.jobportal.entity.UserProfile;
import com.example.jobportal.entity.User;
import com.example.jobportal.repository.UserProfileRepository;
import com.example.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired private UserProfileRepository profileRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = profileRepository.findByUser(user).orElseGet(() -> {
            UserProfile newProfile = new UserProfile();
            newProfile.setUser(user);
            return profileRepository.save(newProfile);
        });
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> data) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = profileRepository.findByUser(user).orElseThrow();

        if (data.containsKey("skills")) profile.setSkills(data.get("skills"));
        if (data.containsKey("experience")) profile.setExperience(data.get("experience"));
        if (data.containsKey("education")) profile.setEducation(data.get("education"));
        if (data.containsKey("bio")) profile.setBio(data.get("bio"));
        
        profileRepository.save(profile);
        return ResponseEntity.ok(Map.of("message", "Profile updated"));
    }
}
