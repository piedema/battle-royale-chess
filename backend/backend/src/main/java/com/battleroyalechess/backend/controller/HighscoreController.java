package com.battleroyalechess.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/highscores")
public class HighscoreController {

    @GetMapping(value = "/")
    public ResponseEntity<Object> getHighscores() {
        return ResponseEntity.ok("Placeholder for highscores endpoints");
    }

}