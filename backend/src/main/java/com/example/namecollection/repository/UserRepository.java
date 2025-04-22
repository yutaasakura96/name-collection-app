package com.example.namecollection.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.namecollection.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    // Repository interface for User entity, extending JpaRepository to provide basic CRUD operations and additional JPA functionalities.
}
