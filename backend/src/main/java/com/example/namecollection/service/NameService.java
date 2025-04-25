package com.example.namecollection.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.namecollection.dto.NameResponseDTO;
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
