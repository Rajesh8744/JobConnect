package com.example.jobportal.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.example.jobportal.entity.Role;

@Data
public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private Role role; // Added role selection for registration
}
