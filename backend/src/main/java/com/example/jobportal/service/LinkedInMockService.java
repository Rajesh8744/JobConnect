package com.example.jobportal.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LinkedInMockService {

    public List<Map<String, String>> fetchLinkedInJobs(String keywords, String location) {
        List<Map<String, String>> jobs = new ArrayList<>();

        String[][] mockData = {
            {"Senior Java Developer", "Google", "Mountain View, CA", "https://logo.clearbit.com/google.com", "Design and build scalable Java applications for Google Cloud. 5+ years experience required.", "Java, Spring Boot, Microservices, GCP", "120000", "180000"},
            {"Full Stack Engineer", "Microsoft", "Redmond, WA", "https://logo.clearbit.com/microsoft.com", "Build end-to-end features for Azure services using React and .NET.", "React, TypeScript, C#, .NET, Azure", "130000", "190000"},
            {"Frontend Developer", "Meta", "Menlo Park, CA", "https://logo.clearbit.com/meta.com", "Create stunning user interfaces for billions of users worldwide.", "React, JavaScript, CSS, GraphQL", "140000", "200000"},
            {"DevOps Engineer", "Amazon", "Seattle, WA", "https://logo.clearbit.com/amazon.com", "Automate infrastructure and CI/CD pipelines for AWS services at scale.", "AWS, Kubernetes, Docker, Terraform, Python", "125000", "175000"},
            {"Data Scientist", "Netflix", "Los Gatos, CA", "https://logo.clearbit.com/netflix.com", "Analyze viewing patterns and build recommendation algorithms.", "Python, TensorFlow, SQL, Spark, Statistics", "150000", "220000"},
            {"Mobile Developer", "Apple", "Cupertino, CA", "https://logo.clearbit.com/apple.com", "Build native iOS applications with cutting-edge technologies.", "Swift, SwiftUI, Objective-C, Xcode", "140000", "210000"},
            {"Backend Engineer", "Stripe", "San Francisco, CA", "https://logo.clearbit.com/stripe.com", "Design payment infrastructure that powers the internet economy.", "Ruby, Go, PostgreSQL, AWS, APIs", "135000", "195000"},
            {"ML Engineer", "OpenAI", "San Francisco, CA", "https://logo.clearbit.com/openai.com", "Train and deploy large language models at unprecedented scale.", "Python, PyTorch, CUDA, Distributed Systems", "200000", "350000"},
            {"Security Engineer", "CrowdStrike", "Austin, TX", "https://logo.clearbit.com/crowdstrike.com", "Detect and prevent cyber threats using advanced threat intelligence.", "Cybersecurity, Python, Cloud Security, SIEM", "120000", "170000"},
            {"Platform Engineer", "Spotify", "Stockholm, Sweden", "https://logo.clearbit.com/spotify.com", "Build and maintain the platform that delivers music to 500M+ users.", "Java, Kubernetes, GCP, Microservices", "110000", "160000"},
        };

        for (String[] data : mockData) {
            if (keywords != null && !keywords.isEmpty()) {
                String lower = (data[0] + " " + data[1] + " " + data[5]).toLowerCase();
                if (!lower.contains(keywords.toLowerCase())) continue;
            }
            if (location != null && !location.isEmpty()) {
                if (!data[2].toLowerCase().contains(location.toLowerCase())) continue;
            }

            Map<String, String> job = new LinkedHashMap<>();
            job.put("title", data[0]);
            job.put("company", data[1]);
            job.put("location", data[2]);
            job.put("logo", data[3]);
            job.put("description", data[4]);
            job.put("requirements", data[5]);
            job.put("salaryMin", data[6]);
            job.put("salaryMax", data[7]);
            job.put("sourceUrl", "https://linkedin.com/jobs/" + UUID.randomUUID().toString().substring(0, 8));
            jobs.add(job);
        }

        return jobs;
    }
}
