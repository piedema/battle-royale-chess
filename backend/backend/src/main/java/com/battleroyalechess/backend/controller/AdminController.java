package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.request.GametypePostRequest;
import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.model.Authority;
import com.battleroyalechess.backend.service.RegisterService;
import com.battleroyalechess.backend.service.UserService;
import com.battleroyalechess.backend.service.GametypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping(value = "/admin")
public class AdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private GametypeService gametypeService;
    @Autowired
    private RegisterService registerService;

    @GetMapping(value = "/users")
    public ResponseEntity<Object> getUsers() {
        return ResponseEntity.ok().body(userService.getUsers());
    }

//    @GetMapping(value = "/gametypes")
//    public ResponseEntity<Object> getGametypes() {
//        return ResponseEntity.ok().body(gametypeService.getGametypes());
//    }

    @GetMapping(value = "/user/{username}")
    public ResponseEntity<Object> getUser(@PathVariable String username) {
        return ResponseEntity.ok().body(userService.getUser(username));
    }

    @DeleteMapping(value = "/user/{username}")
    public ResponseEntity<Object> deleteUser(@PathVariable("username") String username) {
        userService.deleteUser(username);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping(value = "/gametype/{gametype}")
//    public ResponseEntity<Object> getGametype(@PathVariable String gametype) {
//        return ResponseEntity.ok().body(gametypeService.getGametype(gametype));
//    }

    @PostMapping(value = "/user")
    public ResponseEntity<Object> createUser(@RequestBody UserPostRequest userPostRequest) {
        String newUsername = registerService.create(true, userPostRequest);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/user/{username}")
                .buildAndExpand(newUsername).toUri();
        return ResponseEntity.created(location).build();
    }

    @PostMapping(value = "/gametype")
    public ResponseEntity<Object> createGametype(@RequestBody GametypePostRequest gametypePostRequest) {
        gametypeService.createGametype(gametypePostRequest);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/gametype")
    public ResponseEntity<Object> updateGametype(@RequestBody GametypePostRequest gametypePostRequest) {
        gametypeService.updateGametype(gametypePostRequest);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(value = "/gametype/{gametype}")
    public ResponseEntity<Object> deleteGametype(@PathVariable("gametype") String gametype) {
        gametypeService.deleteGametype(gametype);
        return ResponseEntity.noContent().build();
    }

}