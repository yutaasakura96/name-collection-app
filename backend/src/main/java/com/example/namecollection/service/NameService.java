package com.example.namecollection.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.namecollection.model.Name;
import com.example.namecollection.repository.NameRepository;

@Service
public class NameService {
    private final NameRepository nameRepository;

    public NameService(NameRepository nameRepository) {
        this.nameRepository = nameRepository;
    }

    public List<Name> getAllNames() {
        return nameRepository.findAll();
    }

    public Name saveName(Name name) {
        return nameRepository.save(name);
    }

    public Name getNameById(Long id) {
        return nameRepository.findById(id).orElse(null);
    }

    public void deleteName(Long id) {
        nameRepository.deleteById(id);
    }
}
