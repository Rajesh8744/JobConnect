package com.example.jobportal.service;

import com.example.jobportal.dto.LinkedInJobDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class LinkedInJobService {

    public List<LinkedInJobDTO> fetchJobs(String keywords, String location, int maxResults) {
        List<LinkedInJobDTO> jobs = new ArrayList<>();
        
        // This is the public facing LinkedIn jobs search endpoint
        String url = String.format("https://www.linkedin.com/jobs/search/?keywords=%s&location=%s&f_TPR=r86400", 
                                    keywords.replace(" ", "%20"), 
                                    location.replace(" ", "%20"));
        
        try {
            // Provide a real user agent to prevent basic blocking
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000) // 10s timeout
                    .get();

            // The list of job cards on the public search page
            Elements jobCards = doc.select(".base-card");
            
            for (int i = 0; i < Math.min(jobCards.size(), maxResults); i++) {
                Element card = jobCards.get(i);
                
                try {
                    String title = card.select(".base-search-card__title").text();
                    String company = card.select(".base-search-card__subtitle").text();
                    String loc = card.select(".job-search-card__location").text();
                    String link = card.select(".base-card__full-link").attr("href");
                    String postDate = card.select(".job-search-card__listdate").text();
                    
                    if (postDate == null || postDate.isEmpty()) {
                         postDate = card.select(".job-search-card__listdate--new").text();
                    }

                    LinkedInJobDTO job = new LinkedInJobDTO(title, company, loc, link, postDate);
                    jobs.add(job);
                } catch (Exception ex) {
                    // Ignore elements that might be missing certain fields and continue
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Failed to fetch jobs from LinkedIn: " + e.getMessage());
        }
        
        return jobs;
    }
}
