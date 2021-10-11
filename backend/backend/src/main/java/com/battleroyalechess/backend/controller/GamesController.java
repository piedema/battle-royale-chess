package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.exception.RecordNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class GamesController {

    @GetMapping(value = "/games/status")
    public ResponseEntity getGamesStatus(@RequestParam(required = false) Boolean finished){
        if(finished == null || !finished){
            return ResponseEntity.ok("all games which are not finished");
        }
        else{
            return ResponseEntity.ok("all games which are finished");
        }
    }

    @GetMapping(value = "/games/{id}/status")
    public ResponseEntity getGameStatusPerId(@PathVariable int id){
        try {
            return ResponseEntity.ok("game status of game with id:" + id);
        }
        catch (Exception ex){
            throw new RecordNotFoundException();
        }
    }

    @GetMapping(value = "/games/{id}/gamedata")
    public ResponseEntity getGameDataPerId(@PathVariable int id){
        try {
            return ResponseEntity.ok("gamedata of game with id:" + id);
        }
        catch (Exception ex){
            throw new RecordNotFoundException();
        }
    }

    @GetMapping(value = "/games/{id}/players")
    public ResponseEntity getGamePlayersPerId(@PathVariable int id){
        try {
            return ResponseEntity.ok("players of game with id:" + id);
        }
        catch (Exception ex){
            throw new RecordNotFoundException();
        }
    }

}
