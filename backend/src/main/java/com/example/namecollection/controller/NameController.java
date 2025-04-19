package com.example.namecollection.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.namecollection.dto.NameDTO;
import com.example.namecollection.model.Name;
import com.example.namecollection.service.NameService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/names")
@CrossOrigin(origins = "*") // Only for development environment
public class NameController {
    private final NameService nameService;

    public NameController(NameService nameService) {
        this.nameService = nameService;
    }

    @GetMapping
    public ResponseEntity<List<Name>> getAllNames() {
        List<Name> names = nameService.getAllNames();
        return new ResponseEntity<>(names, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Name> createName(@Valid @RequestBody NameDTO nameDTO) {
        Name name = new Name();
        name.setFirstName(nameDTO.getFirstName());
        name.setLastName(nameDTO.getLastName());

        Name savedName = nameService.saveName(name);
        return new ResponseEntity<>(savedName, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Name> updateName(@PathVariable Long id,
            @Valid @RequestBody NameDTO nameDTO) {
        try {
            Name existingName = nameService.getNameById(id);
            if (existingName == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            existingName.setFirstName(nameDTO.getFirstName());
            existingName.setLastName(nameDTO.getLastName());

            Name updatedName = nameService.saveName(existingName);
            return new ResponseEntity<>(updatedName, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteName(@PathVariable Long id) {
        try {
            nameService.deleteName(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
