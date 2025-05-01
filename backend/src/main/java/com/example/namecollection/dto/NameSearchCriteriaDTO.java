package com.example.namecollection.dto;

import lombok.Data;

@Data
public class NameSearchCriteriaDTO {
    private String searchTerm;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
    private int page = 0;
    private int size = 10;
}
