package com.example.jobportal.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String name;
    private String email;
    private String role;
    
    private String bio;
    private String location;
    private String profilePictureUrl;
    
    // Seeker fields
    private String skills;
    private String experience;
    private String education;
    private String portfolioUrl;
    
    // Recruiter fields
    private String companyName;
    private String companyWebsite;
    private String companyDescription;
}
