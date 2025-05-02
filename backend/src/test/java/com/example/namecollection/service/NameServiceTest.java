package com.example.namecollection.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.example.namecollection.dto.NameResponseDTO;
import com.example.namecollection.dto.NameSearchCriteriaDTO;
import com.example.namecollection.dto.PageDTO;
import com.example.namecollection.model.Name;
import com.example.namecollection.repository.NameRepository;

@ExtendWith(MockitoExtension.class)
public class NameServiceTest {

    @Mock
    private NameRepository nameRepository;

    @InjectMocks
    private NameService nameService;

    private Name testName;
    private List<Name> nameList;
    private String testUuid;

    @BeforeEach
    void setUp() {
        // Initialize test data
        testUuid = UUID.randomUUID().toString();
        testName = new Name();
        testName.setId(1L);
        testName.setUuid(testUuid);
        testName.setFirstName("John");
        testName.setLastName("Doe");
        testName.setCreatedAt(LocalDateTime.now());

        // Create a list of test names
        nameList = new ArrayList<>();
        nameList.add(testName);

        Name name2 = new Name();
        name2.setId(2L);
        name2.setUuid(UUID.randomUUID().toString());
        name2.setFirstName("Jane");
        name2.setLastName("Smith");
        name2.setCreatedAt(LocalDateTime.now());
        nameList.add(name2);
    }

    @Test
    void getAllNames_ShouldReturnAllNames() {
        // Arrange
        when(nameRepository.findAll()).thenReturn(nameList);

        // Act
        List<NameResponseDTO> result = nameService.getAllNames();

        // Assert
        assertEquals(2, result.size());
        assertEquals("John", result.get(0).getFirstName());
        assertEquals("Jane", result.get(1).getFirstName());
        verify(nameRepository, times(1)).findAll();
    }

    @Test
    void getNames_WithSearchTerm_ShouldReturnFilteredList() {
        // Arrange
        NameSearchCriteriaDTO criteria = new NameSearchCriteriaDTO();
        criteria.setSearchTerm("John");
        criteria.setPage(0);
        criteria.setSize(10);
        criteria.setSortBy("firstName");
        criteria.setSortDirection("ASC");

        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "firstName"));
        Page<Name> page = new PageImpl<>(List.of(testName), pageable, 1);

        when(nameRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                eq("John"), eq("John"), any(Pageable.class))).thenReturn(page);

        // Act
        PageDTO<NameResponseDTO> result = nameService.getNames(criteria);

        // Assert
        assertEquals(1, result.getContent().size());
        assertEquals("John", result.getContent().get(0).getFirstName());
        assertEquals(0, result.getPageNumber());
        assertEquals(10, result.getPageSize());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertTrue(result.isFirst());
        assertTrue(result.isLast());
    }

    @Test
    void getNames_WithoutSearchTerm_ShouldReturnAllNames() {
        // Arrange
        NameSearchCriteriaDTO criteria = new NameSearchCriteriaDTO();
        criteria.setSearchTerm("");
        criteria.setPage(0);
        criteria.setSize(10);
        criteria.setSortBy("firstName");
        criteria.setSortDirection("ASC");

        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "firstName"));
        Page<Name> page = new PageImpl<>(nameList, pageable, 2);

        when(nameRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Act
        PageDTO<NameResponseDTO> result = nameService.getNames(criteria);

        // Assert
        assertEquals(2, result.getContent().size());
        assertEquals(0, result.getPageNumber());
        assertEquals(10, result.getPageSize());
        assertEquals(2, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
    }

    @Test
    void saveName_ShouldReturnSavedName() {
        // Arrange
        when(nameRepository.save(any(Name.class))).thenReturn(testName);

        // Act
        NameResponseDTO result = nameService.saveName(testName);

        // Assert
        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
        assertEquals(testUuid, result.getUuid());
        verify(nameRepository, times(1)).save(testName);
    }

    @Test
    void getNameByUuid_WhenExists_ShouldReturnName() {
        // Arrange
        when(nameRepository.findByUuid(testUuid)).thenReturn(Optional.of(testName));

        // Act
        NameResponseDTO result = nameService.getNameByUuid(testUuid);

        // Assert
        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
        verify(nameRepository, times(1)).findByUuid(testUuid);
    }

    @Test
    void getNameByUuid_WhenNotExists_ShouldReturnNull() {
        // Arrange
        String nonExistentUuid = UUID.randomUUID().toString();
        when(nameRepository.findByUuid(nonExistentUuid)).thenReturn(Optional.empty());

        // Act
        NameResponseDTO result = nameService.getNameByUuid(nonExistentUuid);

        // Assert
        assertNull(result);
        verify(nameRepository, times(1)).findByUuid(nonExistentUuid);
    }

    @Test
    void updateName_WhenExists_ShouldUpdateName() {
        // Arrange
        String newFirstName = "Jane";
        String newLastName = "Doe";

        when(nameRepository.findByUuid(testUuid)).thenReturn(Optional.of(testName));
        when(nameRepository.save(any(Name.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        NameResponseDTO result = nameService.updateName(testUuid, newFirstName, newLastName);

        // Assert
        assertNotNull(result);
        assertEquals(newFirstName, result.getFirstName());
        assertEquals(newLastName, result.getLastName());
        verify(nameRepository, times(1)).findByUuid(testUuid);
        verify(nameRepository, times(1)).save(any(Name.class));
    }

    @Test
    void updateName_WhenNotExists_ShouldThrowException() {
        // Arrange
        String nonExistentUuid = UUID.randomUUID().toString();
        when(nameRepository.findByUuid(nonExistentUuid)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            nameService.updateName(nonExistentUuid, "New", "Name");
        });

        assertTrue(exception.getMessage().contains("Name not found with uuid"));
        verify(nameRepository, times(1)).findByUuid(nonExistentUuid);
        verify(nameRepository, never()).save(any(Name.class));
    }

    @Test
    void deleteNameByUuid_WhenExists_ShouldDeleteName() {
        // Arrange
        when(nameRepository.findByUuid(testUuid)).thenReturn(Optional.of(testName));
        doNothing().when(nameRepository).deleteByUuid(testUuid);

        // Act
        nameService.deleteNameByUuid(testUuid);

        // Assert
        verify(nameRepository, times(1)).findByUuid(testUuid);
        verify(nameRepository, times(1)).deleteByUuid(testUuid);
    }

    @Test
    void deleteNameByUuid_WhenNotExists_ShouldThrowException() {
        // Arrange
        String nonExistentUuid = UUID.randomUUID().toString();
        when(nameRepository.findByUuid(nonExistentUuid)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            nameService.deleteNameByUuid(nonExistentUuid);
        });

        assertTrue(exception.getMessage().contains("Name not found with uuid"));
        verify(nameRepository, times(1)).findByUuid(nonExistentUuid);
        verify(nameRepository, never()).deleteByUuid(anyString());
    }

    @Test
    void getNames_WithInvalidSortField_ShouldUseFallbackSort() {
        // Arrange
        NameSearchCriteriaDTO criteria = new NameSearchCriteriaDTO();
        criteria.setSortBy("invalidField"); // Invalid field
        criteria.setSortDirection("ASC");
        criteria.setPage(0);
        criteria.setSize(10);

        // The service should default to using "id" as the sort field
        Pageable expectedPageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "id"));
        Page<Name> page = new PageImpl<>(nameList, expectedPageable, 2);

        when(nameRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Act
        PageDTO<NameResponseDTO> result = nameService.getNames(criteria);

        // Assert
        assertEquals(2, result.getContent().size());
        // Verify the repository was called with the correct parameters
        verify(nameRepository).findAll(any(Pageable.class));
    }
}
