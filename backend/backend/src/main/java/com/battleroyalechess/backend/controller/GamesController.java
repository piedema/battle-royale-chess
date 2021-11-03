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
        return ResponseEntity.ok().body(gamesService.getGamedata(gameId));
    }

    @PostMapping(value = "/{gameId}/newMove")
    public ResponseEntity<Object> newMove(@PathVariable("gameId") Long gameId, @RequestBody NewMovePostRequest newMovePostRequest) {
        return ResponseEntity.ok().body(gamesService.newMove(gameId, newMovePostRequest));
    }

    @GetMapping(value = "/{gameId}/cancelMove")
    public ResponseEntity<Object> cancelMove(@PathVariable("gameId") Long gameId) {
        gamesService.cancelMove(gameId);
        return ResponseEntity.ok().body(gamesService.cancelMove(gameId));
    }

}
