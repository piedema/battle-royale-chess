package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.exception.RecordNotFoundException;
import com.battleroyalechess.backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/games")
public class GamesController {

    private GameService gameService;

    public GamesController(GameService gameService){
        this.gameService = gameService;
    }

    @GetMapping(value = "")
    public ResponseEntity getGames(@RequestParam(required = false) Boolean finished){
        if(finished == null || !finished){
            return ResponseEntity.ok("all games which are not finished");
        }
        else{
            return ResponseEntity.ok("all games");
        }
    }

    @GetMapping(value = "/{gameId}")
    public ResponseEntity getGame(@PathVariable("gameId") Long gameId){
        try {
            return ResponseEntity.ok().body(gameService.getGame(gameId));
        }
        catch (Exception ex){
            throw new RecordNotFoundException();
        }
    }

}
