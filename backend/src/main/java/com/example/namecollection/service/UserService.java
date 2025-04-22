package com.example.namecollection.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.namecollection.model.User;
import com.example.namecollection.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getOrCreateUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        String auth0Id = jwt.getSubject();
        Optional<User> existingUser = userRepository.findById(auth0Id);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setLastLogin(LocalDateTime.now());
            return userRepository.save(user);
        } else {
            User newUser = new User();
            newUser.setAuth0Id(auth0Id);
            newUser.setEmail(jwt.getClaim("email"));
            newUser.setName(jwt.getClaim("name"));
            newUser.setLastLogin(LocalDateTime.now());
            return userRepository.save(newUser);
        }
    }
}
