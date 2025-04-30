package com.example.namecollection.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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
import com.example.namecollection.dto.NameResponseDTO;
import com.example.namecollection.dto.NameSearchCriteriaDTO;
import com.example.namecollection.dto.PageDTO;
import com.example.namecollection.model.Name;
import com.example.namecollection.service.NameService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/names")
public class NameController {
    private static final Logger logger = LoggerFactory.getLogger(NameController.class);

    private final NameService nameService;

    public NameController(NameService nameService) {
        this.nameService = nameService;
    }

    @GetMapping
    public ResponseEntity<List<NameResponseDTO>> getAllNames() {
        List<NameResponseDTO> names = nameService.getAllNames();
        return new ResponseEntity<>(names, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<PageDTO<NameResponseDTO>> searchNames(
            @Valid NameSearchCriteriaDTO criteria) {
        PageDTO<NameResponseDTO> page = nameService.getNames(criteria);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<NameResponseDTO> createName(@Valid @RequestBody NameDTO nameDTO) {
        Name name = new Name();
        name.setFirstName(nameDTO.getFirstName());
        name.setLastName(nameDTO.getLastName());

        NameResponseDTO savedName = nameService.saveName(name);
        return new ResponseEntity<>(savedName, HttpStatus.CREATED);
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<NameResponseDTO> updateName(@PathVariable String uuid,
            @Valid @RequestBody NameDTO nameDTO) {
        try {
            NameResponseDTO updatedName =
                    nameService.updateName(uuid, nameDTO.getFirstName(), nameDTO.getLastName());
            return new ResponseEntity<>(updatedName, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Error updating name with UUID: {}", uuid, e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Unexpected error updating name with UUID: {}", uuid, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<HttpStatus> deleteName(@PathVariable String uuid) {
        try {
            nameService.deleteNameByUuid(uuid);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            logger.error("Error deleting name with UUID: {}", uuid, e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Unexpected error deleting name with UUID: {}", uuid, e);
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
