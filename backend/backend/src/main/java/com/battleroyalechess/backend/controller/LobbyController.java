package com.battleroyalechess.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/lobby")
public class LobbyController {

    @GetMapping(value = "")
    public ResponseEntity<Object> getLobbies() {
        return ResponseEntity.ok("Placeholder for lobbies endpoints");
    }

}