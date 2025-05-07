package com.example.namecollection.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for public endpoints that don't require authentication
 */
@RestController
@RequestMapping("/api/public")
public class PublicController {

    /**
     * Get application information
     *
     * @return application information
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Name Collection App");
        info.put("version", "1.0.0");
        info.put("description", "A simple application to collect and manage names");

        Map<String, String> roles = new HashMap<>();
        roles.put("viewer", "Can view names");
        roles.put("editor", "Can create and edit names");
        roles.put("admin", "Can delete names and manage the application");
        info.put("roles", roles);

        return ResponseEntity.ok(info);
    }
}
