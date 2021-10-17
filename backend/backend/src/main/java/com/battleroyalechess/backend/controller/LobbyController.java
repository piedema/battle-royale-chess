package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.request.QueuePostRequest;
import com.battleroyalechess.backend.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/lobby")
public class LobbyController {

    @Autowired
    private LobbyService lobbyService;

    @GetMapping(value = "")
    public ResponseEntity<Object> getLobbies() {
        return ResponseEntity.ok("Placeholder for lobbies endpoints");
    }

    @PostMapping(value = "")
    public ResponseEntity<Object> addToQueue(@RequestBody QueuePostRequest queuePostRequest) {

        lobbyService.addToQueue(queuePostRequest);

        return ResponseEntity.ok("Player put in queue");

    }

}