package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/game")
public class GameController {

    private GameService gameService;

    public GameController(GameService gameService){
        this.gameService = gameService;
    }

    @GetMapping(value = "/{gameId}")
    public ResponseEntity<Object> getGame(@PathVariable("gameId") Long gameId) {
        return ResponseEntity.ok().body(gameService.getGame(gameId));
    }

}