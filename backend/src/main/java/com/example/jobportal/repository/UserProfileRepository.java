package com.example.jobportal.repository;

import com.example.jobportal.entity.User;
import com.example.jobportal.entity.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    Optional<UserProfile> findByUser(User user);
}
