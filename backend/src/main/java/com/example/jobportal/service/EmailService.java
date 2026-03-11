package com.example.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendApplicationStatusEmail(String fromEmail, String toEmail, String seekerName, String jobTitle, String company, String status, String notes) {
        CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setReplyTo(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Application Status Update: " + jobTitle + " at " + company);
                
                StringBuilder body = new StringBuilder();
                body.append("Dear ").append(seekerName).append(",\n\n");
                body.append("Your application for the position of \"").append(jobTitle).append("\" at ").append(company)
                    .append(" has been updated.\n\n");
                body.append("New Status: ").append(status).append("\n");
                
                if (notes != null && !notes.trim().isEmpty()) {
                    body.append("\nNote from Recruiter:\n").append(notes).append("\n");
                }
                
                body.append("\nThank you for using JobConnect.\n\nBest regards,\nThe JobConnect Team");

                message.setText(body.toString());
                mailSender.send(message);
            } catch (Exception e) {
                System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            }
        });
    }
}
