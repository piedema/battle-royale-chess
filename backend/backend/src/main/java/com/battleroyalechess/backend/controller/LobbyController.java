package com.battleroyalechess.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
public class LobbyController {

    @PostMapping(value = "/lobby/ready")
    public ResponseEntity postReady(@RequestBody Integer gameStyle){
        return ResponseEntity.ok("player is ready for gameStyle:" + gameStyle);
    }
}
