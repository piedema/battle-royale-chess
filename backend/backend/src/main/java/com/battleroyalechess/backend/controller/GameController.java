package com.battleroyalechess.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/game")
public class GameController {

    @GetMapping(value = "/{id}")
    public ResponseEntity<Object> getGame() {

        return ResponseEntity.ok("Placeholder for game endpoints");

    }

}