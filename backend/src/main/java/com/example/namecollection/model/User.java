package com.example.namecollection.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @Column(name = "auth0_id")
    private String auth0Id;

    private String email;
    private String name;

    @Column(name = "last_login")
    private java.time.LocalDateTime lastLogin;
}
