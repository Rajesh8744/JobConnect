package com.example.jobportal.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdzunaResponse {
    private List<AdzunaJob> results;

    @Data
    public static class AdzunaJob {
        private String title;
        private String description;
        private AdzunaCompany company;
        private AdzunaLocation location;
        private Double salary_min;
        private Double salary_max;
        
        @Data
        public static class AdzunaCompany {
            private String display_name;
        }
        
        @Data
        public static class AdzunaLocation {
            private String display_name;
        }
    }
}
