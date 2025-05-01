package com.example.namecollection.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.namecollection.dto.NameResponseDTO;
import com.example.namecollection.dto.NameSearchCriteriaDTO;
import com.example.namecollection.dto.PageDTO;
import com.example.namecollection.model.Name;
import com.example.namecollection.repository.NameRepository;

@Service
public class NameService {
    private final NameRepository nameRepository;

    public NameService(NameRepository nameRepository) {
        this.nameRepository = nameRepository;
    }

    public List<NameResponseDTO> getAllNames() {
        return nameRepository.findAll().stream().map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PageDTO<NameResponseDTO> getNames(NameSearchCriteriaDTO criteria) {
        Sort sort = createSort(criteria);
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);

        Page<Name> resultPage;

        if (StringUtils.hasText(criteria.getSearchTerm())) {
            resultPage = nameRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            criteria.getSearchTerm(), criteria.getSearchTerm(), pageable);
        } else {
            resultPage = nameRepository.findAll(pageable);
        }

        return convertToPageDTO(resultPage);
    }

    private Sort createSort(NameSearchCriteriaDTO criteria) {
        String sortBy = criteria.getSortBy();
        // Validate sortBy field to prevent injection
        if (!isValidSortField(sortBy)) {
            sortBy = "id";
        }

        Sort.Direction direction =
                "DESC".equalsIgnoreCase(criteria.getSortDirection()) ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        return Sort.by(direction, sortBy);
    }

    private boolean isValidSortField(String field) {
        return field != null && (field.equals("id") || field.equals("firstName")
                || field.equals("lastName") || field.equals("createdAt"));
    }

    private PageDTO<NameResponseDTO> convertToPageDTO(Page<Name> page) {
        List<NameResponseDTO> content =
                page.getContent().stream().map(this::convertToDTO).collect(Collectors.toList());

        PageDTO<NameResponseDTO> pageDTO = new PageDTO<>();
        pageDTO.setContent(content);
        pageDTO.setPageNumber(page.getNumber());
        pageDTO.setPageSize(page.getSize());
        pageDTO.setTotalElements(page.getTotalElements());
        pageDTO.setTotalPages(page.getTotalPages());
        pageDTO.setLast(page.isLast());
        pageDTO.setFirst(page.isFirst());

        return pageDTO;
    }

    public NameResponseDTO saveName(Name name) {
        Name savedName = nameRepository.save(name);
        return convertToDTO(savedName);
    }

    public NameResponseDTO getNameByUuid(String uuid) {
        return nameRepository.findByUuid(uuid).map(this::convertToDTO).orElse(null);
    }

    @Transactional
    public NameResponseDTO updateName(String uuid, String firstName, String lastName) {
        Optional<Name> existingNameOpt = nameRepository.findByUuid(uuid);
        if (existingNameOpt.isEmpty()) {
            throw new RuntimeException("Name not found with uuid: " + uuid);
        }

        Name existingName = existingNameOpt.get();
        existingName.setFirstName(firstName);
        existingName.setLastName(lastName);

        Name updatedName = nameRepository.save(existingName);
        return convertToDTO(updatedName);
    }

    @Transactional
    public void deleteNameByUuid(String uuid) {
        Optional<Name> existingName = nameRepository.findByUuid(uuid);
        if (existingName.isEmpty()) {
            throw new RuntimeException("Name not found with uuid: " + uuid);
        }
        nameRepository.deleteByUuid(uuid);
    }

    private NameResponseDTO convertToDTO(Name name) {
        NameResponseDTO dto = new NameResponseDTO();
        dto.setUuid(name.getUuid());
        dto.setFirstName(name.getFirstName());
        dto.setLastName(name.getLastName());
        dto.setCreatedAt(name.getCreatedAt());
        return dto;
    }
}
