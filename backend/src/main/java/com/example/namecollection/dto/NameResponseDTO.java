package com.example.namecollection.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NameResponseDTO {
    private String uuid;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
}
