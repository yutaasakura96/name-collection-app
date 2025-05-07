package com.example.namecollection.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.example.namecollection.util.PermissionUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/names")
public class NameController {
    private static final Logger logger = LoggerFactory.getLogger(NameController.class);

    private final NameService nameService;
    private final PermissionUtil permissionUtil;

    public NameController(NameService nameService, PermissionUtil permissionUtil) {
        this.nameService = nameService;
        this.permissionUtil = permissionUtil;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_read:names')")
    public ResponseEntity<List<NameResponseDTO>> getAllNames() {
        logger.info("Getting all names. User permissions: {}", permissionUtil.getUserPermissions());
        List<NameResponseDTO> names = nameService.getAllNames();
        return new ResponseEntity<>(names, HttpStatus.OK);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('SCOPE_read:names')")
    public ResponseEntity<PageDTO<NameResponseDTO>> searchNames(
            @Valid NameSearchCriteriaDTO criteria) {
        logger.info("Searching names with criteria: {}. User permissions: {}", criteria,
                permissionUtil.getUserPermissions());
        PageDTO<NameResponseDTO> page = nameService.getNames(criteria);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_create:names')")
    public ResponseEntity<NameResponseDTO> createName(@Valid @RequestBody NameDTO nameDTO) {
        logger.info("Creating name: {}. User permissions: {}", nameDTO,
                permissionUtil.getUserPermissions());
        Name name = new Name();
        name.setFirstName(nameDTO.getFirstName());
        name.setLastName(nameDTO.getLastName());

        NameResponseDTO savedName = nameService.saveName(name);
        return new ResponseEntity<>(savedName, HttpStatus.CREATED);
    }

    @PutMapping("/{uuid}")
    @PreAuthorize("hasAuthority('SCOPE_update:names')")
    public ResponseEntity<NameResponseDTO> updateName(@PathVariable String uuid,
            @Valid @RequestBody NameDTO nameDTO) {
        logger.info("Updating name with UUID: {}. User permissions: {}", uuid,
                permissionUtil.getUserPermissions());
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
    @PreAuthorize("hasAuthority('SCOPE_delete:names')")
    public ResponseEntity<HttpStatus> deleteName(@PathVariable String uuid) {
        logger.info("Deleting name with UUID: {}. User permissions: {}", uuid,
                permissionUtil.getUserPermissions());
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

    // Add a new endpoint to check user permissions
    @GetMapping("/permissions")
    public ResponseEntity<Map<String, Object>> getUserPermissions() {
        Map<String, Object> response = new HashMap<>();
        response.put("permissions", permissionUtil.getUserPermissions());
        response.put("roles", permissionUtil.getUserRoles());
        return new ResponseEntity<>(response, HttpStatus.OK);
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
