package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/game")
public class GameController {

    private LobbyService lobbyService;

    public GameController(LobbyService lobbyService){
        this.lobbyService = lobbyService;
    }

    @GetMapping(value = "/{gameId}")
    public ResponseEntity<Object> getGame(@PathVariable("gameId") Long gameId) {
        return ResponseEntity.ok().body(lobbyService.getGame(gameId));
    }

}