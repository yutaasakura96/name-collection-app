package com.example.namecollection.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.namecollection.model.Name;
import com.example.namecollection.service.NameService;


@RestController
@RequestMapping("/api/names")
@CrossOrigin(origins = "*") //Only for development environment should be replaced for production environment
public class NameController {
  private final NameService nameService;

    public NameController(NameService nameService) {
        this.nameService = nameService;
    }
    @GetMapping
    public ResponseEntity<List<Name>> getAllName() {
      List<Name> names = nameService.getAllNames();
      return new ResponseEntity<>(names, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Name> createName(@RequestBody Name name) {
      Name savedName = nameService.saveName(name);
      return new ResponseEntity<>(savedName, HttpStatus.CREATED);
    }
}
