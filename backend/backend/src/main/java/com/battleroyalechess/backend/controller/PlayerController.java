package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.response.PlayerResponse;
import com.battleroyalechess.backend.service.PlayerService;
import com.battleroyalechess.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping(value = "")
    public ResponseEntity<Object> getUsers() {
        return ResponseEntity.ok().body(playerService.getPlayers());
    }

}