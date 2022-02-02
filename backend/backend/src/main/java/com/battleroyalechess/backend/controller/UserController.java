package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.exception.BadRequestException;
import com.battleroyalechess.backend.model.Authority;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping(value = "")
    public ResponseEntity<Object> getUser() {
        return ResponseEntity.ok().body(userService.getUser());
    }

    @PutMapping(value = "")
    public ResponseEntity<Object> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(value = "/{username}")
    public ResponseEntity<Object> deleteUser(@PathVariable("username") String username) {
        userService.deleteUser(username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/usernameExists")
    public ResponseEntity<Object> usernameExists(@RequestBody UserPostRequest userPostRequest) {
        String username = userPostRequest.getUsername();
        return ResponseEntity.ok().body(userService.userExists(username));
    }

    @PostMapping(value = "/emailExists")
    public ResponseEntity<Object> emailExists(@RequestBody UserPostRequest userPostRequest) {
        String email = userPostRequest.getEmail();
        return ResponseEntity.ok().body(userService.emailExists(email));
    }

}