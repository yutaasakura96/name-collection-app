package com.example.namecollection.repository;

import com.example.namecollection.model.Name;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class NameRepositoryTest {

    @Autowired
    private NameRepository nameRepository;

    private Name testName1;
    private Name testName2;
    private String uuid1;
    private String uuid2;

    @BeforeEach
    void setUp() {
        // Clear the repository before each test
        nameRepository.deleteAll();

        // Create test data
        uuid1 = UUID.randomUUID().toString();
        testName1 = new Name();
        testName1.setUuid(uuid1);
        testName1.setFirstName("John");
        testName1.setLastName("Doe");
        testName1.setCreatedAt(LocalDateTime.now());

        uuid2 = UUID.randomUUID().toString();
        testName2 = new Name();
        testName2.setUuid(uuid2);
        testName2.setFirstName("Jane");
        testName2.setLastName("Smith");
        testName2.setCreatedAt(LocalDateTime.now());

        // Save test data
        nameRepository.save(testName1);
        nameRepository.save(testName2);
    }

    @Test
    void findByUuid_ShouldReturnName() {
        // Act
        Optional<Name> result = nameRepository.findByUuid(uuid1);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());
        assertEquals("Doe", result.get().getLastName());
    }

    @Test
    void findByUuid_WhenUuidDoesNotExist_ShouldReturnEmpty() {
        // Arrange
        String nonExistentUuid = UUID.randomUUID().toString();

        // Act
        Optional<Name> result = nameRepository.findByUuid(nonExistentUuid);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase_ShouldReturnMatchingNames() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending());

        // Act - Search by first name
        Page<Name> result1 =
                nameRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        "Jo", "Jo", pageable);

        // Act - Search by last name
        Page<Name> result2 =
                nameRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        "Sm", "Sm", pageable);

        // Assert
        assertEquals(1, result1.getContent().size());
        assertEquals("John", result1.getContent().get(0).getFirstName());

        assertEquals(1, result2.getContent().size());
        assertEquals("Jane", result2.getContent().get(0).getFirstName());
    }

    @Test
    void deleteByUuid_ShouldRemoveName() {
        // Act
        nameRepository.deleteByUuid(uuid1);

        // Assert
        assertEquals(1, nameRepository.count());
        assertTrue(nameRepository.findByUuid(uuid1).isEmpty());
        assertTrue(nameRepository.findByUuid(uuid2).isPresent());
    }
}
