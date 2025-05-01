package com.example.namecollection.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.namecollection.model.Name;

public interface NameRepository extends JpaRepository<Name, Long> {
    Optional<Name> findByUuid(String uuid);

    @Transactional
    @Modifying
    @Query("DELETE FROM Name n WHERE n.uuid = :uuid")
    void deleteByUuid(@Param("uuid") String uuid);

    Page<Name> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String searchTerm,
            String searchTerm2, Pageable pageable);
}
