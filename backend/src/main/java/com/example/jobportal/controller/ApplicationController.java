package com.example.jobportal.controller;

import com.example.jobportal.entity.Job;
import com.example.jobportal.entity.JobApplication;
import com.example.jobportal.entity.User;
import com.example.jobportal.repository.ApplicationRepository;
import com.example.jobportal.repository.JobRepository;
import com.example.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;

    private final Path fileStorageLocation = Paths.get("uploads/resumes").toAbsolutePath().normalize();

    public ApplicationController() {
        try { Files.createDirectories(this.fileStorageLocation); } catch (Exception e) { throw new RuntimeException("Could not create upload dir", e); }
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<?> applyToJob(
            @PathVariable String jobId,
            @RequestParam("resume") MultipartFile file,
            @RequestParam("coverLetter") String coverLetter) throws IOException {
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seeker = userRepository.findByEmail(email).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();

        if (applicationRepository.existsByJobAndSeeker(job, seeker)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already applied"));
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), this.fileStorageLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        JobApplication app = new JobApplication();
        app.setJob(job);
        app.setSeeker(seeker);
        app.setResumePath(fileName);
        app.setCoverLetter(coverLetter);
        applicationRepository.save(app);

        return ResponseEntity.ok(Map.of("message", "Applied successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seeker = userRepository.findByEmail(email).orElseThrow();
        List<JobApplication> apps = applicationRepository.findBySeeker(seeker);
        return ResponseEntity.ok(apps.stream().map(this::mapApp).collect(Collectors.toList()));
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable String id) throws IOException {
        JobApplication app = applicationRepository.findById(id).orElseThrow();
        Path filePath = this.fileStorageLocation.resolve(app.getResumePath()).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private Map<String, Object> mapApp(JobApplication app) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", app.getId());
        map.put("jobTitle", app.getJob().getTitle());
        map.put("company", app.getJob().getCompany());
        map.put("status", app.getStatus());
        map.put("appliedDate", app.getAppliedDate());
        map.put("notes", app.getNotes());
        map.put("seekerName", app.getSeeker().getFullName());
        map.put("seekerEmail", app.getSeeker().getEmail());
        map.put("coverLetter", app.getCoverLetter());
        return map;
    }
}
