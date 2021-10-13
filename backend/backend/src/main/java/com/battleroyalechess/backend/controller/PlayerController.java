package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.model.Player;
import com.battleroyalechess.backend.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
public class PlayerController {

    private PlayerService playerService;

    public PlayerController(PlayerService playerService){

        this.playerService = playerService;

    }

    @GetMapping(value = "/players")
    public ResponseEntity getPlayers(@RequestParam(required=false) String username, @RequestParam(required=false) String emailaddress){

        Iterable<Player> players;

        if(username != null){

            players = playerService.findByUsername(username);

        }
        else if(emailaddress != null){

            players = playerService.findByEmailaddress(emailaddress);

        }
        else{

            players = playerService.findAll();

        }

        return ResponseEntity.ok().body(players);
    }

    @GetMapping(value = "/players/{id}")
    public ResponseEntity getPlayerById(@PathVariable long id){

        Player player = playerService.findById(id);

        return ResponseEntity.ok().body(player);

    }

    @PostMapping(value = "/players")
    public ResponseEntity postUserById(@RequestBody Player player){

        long newId = playerService.save(player);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newId).toUri();

        return ResponseEntity.created(location).build();

    }

    @PutMapping(value = "/players/{id}")
    public ResponseEntity putUserById(@PathVariable long id, @RequestBody Player player){

        playerService.updateById(id, player);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(value = "/players/{id}")
    public ResponseEntity deleteUserById(@PathVariable long id){

        playerService.deleteById(id);

        return ResponseEntity.noContent().build();

    }
}
