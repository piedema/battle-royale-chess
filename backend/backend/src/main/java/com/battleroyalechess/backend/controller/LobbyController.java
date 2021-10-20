package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.request.QueuePostRequest;
import com.battleroyalechess.backend.exception.BadRequestException;
import com.battleroyalechess.backend.exception.GametypeNotFoundException;
import com.battleroyalechess.backend.exception.UserNotFoundException;
import com.battleroyalechess.backend.service.GameService;
import com.battleroyalechess.backend.service.LobbyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/lobby")
public class LobbyController {

    private final LobbyService lobbyService;
    private final GameService gameService;

    public LobbyController(LobbyService lobbyService, GameService gameService){
        this.lobbyService = lobbyService;
        this.gameService = gameService;
    }

    @PostMapping(value = "/addInQueue")
    public ResponseEntity<Object> addInQueue(@RequestBody QueuePostRequest queuePostRequest) {
        lobbyService.addInQueue(queuePostRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/getPlayerGameStatus/{username}")
    public ResponseEntity<Object> getPlayerGameStatus(@PathVariable("username") String username) {
        return ResponseEntity.ok().body(lobbyService.findGameIdByUsername(username));
    }

}