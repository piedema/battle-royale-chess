package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.service.LobbyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/lobby")
public class LobbyController {

    private final LobbyService lobbyService;

    public LobbyController(LobbyService lobbyService){
        this.lobbyService = lobbyService;
    }

    @GetMapping(value = "/queue")
    public ResponseEntity<Object> getQueue() {
        return ResponseEntity.ok().body(lobbyService.getQueue());
    }

    @GetMapping(value = "/queue/{gametype}")
    public ResponseEntity<Object> placeInQueue(@PathVariable String gametype) {
        lobbyService.placeInQueue(gametype);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(value = "/queue")
    public ResponseEntity<Object> removeFromQueue() {
        lobbyService.removeFromQueue();
        return ResponseEntity.noContent().build();
    }

}