package com.example.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.jobportal.entity.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;

    public JwtAuthResponse(String accessToken, Long id, String name, String email, Role role) {
        this.accessToken = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
