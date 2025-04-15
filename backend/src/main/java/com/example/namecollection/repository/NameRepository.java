package com.example.namecollection.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.namecollection.model.Name;

public interface NameRepository extends JpaRepository<Name, Long> {
  // Basic CRUD operations are automatically provided by JpaRepository
}
