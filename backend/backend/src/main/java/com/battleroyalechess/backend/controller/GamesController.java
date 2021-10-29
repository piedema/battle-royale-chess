package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.request.NewMovePostRequest;
import com.battleroyalechess.backend.exception.RecordNotFoundException;
import com.battleroyalechess.backend.service.GamesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/games")
public class GamesController {

    private final GamesService gamesService;

    public GamesController(GamesService gamesService){
        this.gamesService = gamesService;
    }

    @GetMapping(value = "")
    public ResponseEntity<Object> getGames(){
        return ResponseEntity.ok().body(gamesService.getGames());
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

    @PostMapping(value = "/{gameId}/newMove}")
    public ResponseEntity<Object> newMove(@PathVariable("gameId") Long gameId, @RequestBody NewMovePostRequest newMovePostRequest) {
        gamesService.newMove(gameId, newMovePostRequest);
        return ResponseEntity.noContent().build();
    }

}
