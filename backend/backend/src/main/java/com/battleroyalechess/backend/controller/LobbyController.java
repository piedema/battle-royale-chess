package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.request.QueuePostRequest;
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

    @PostMapping(value = "/addInQueue")
    public ResponseEntity<Object> addInQueue(@RequestBody QueuePostRequest queuePostRequest) {
        lobbyService.addInQueue(queuePostRequest);
        return ResponseEntity.noContent().build();
    }

}