package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.exception.RecordNotFoundException;
import com.battleroyalechess.backend.service.GameService;
import com.battleroyalechess.backend.service.GamesService;
import com.battleroyalechess.backend.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/games")
public class GamesController {

    private final GamesService gamesService;

    public GamesController(GamesService gamesService){
        this.gamesService = gamesService;
    }

    @GetMapping(value = "")
    public ResponseEntity<Object> getGames(@RequestParam(required = false) Boolean finished){
        if(finished == null || !finished){
            return ResponseEntity.ok("all games which are not finished");
        }
        else{
            return ResponseEntity.ok("all games");
        }
    }

    @GetMapping(value = "/getGameIdForPlayer/{username}")
    public ResponseEntity<Object> getPlayerGameStatus(@PathVariable("username") String username) {
        return ResponseEntity.ok().body(gamesService.findGameIdByUsername(username));
    }

    @GetMapping(value = "/{gameId}")
    public ResponseEntity<Object> getGame(@PathVariable("gameId") Long gameId){
        try {
            return ResponseEntity.ok().body(gamesService.getGamedata(gameId));
        }
        catch (Exception ex){
            throw new RecordNotFoundException();
        }
    }

}
