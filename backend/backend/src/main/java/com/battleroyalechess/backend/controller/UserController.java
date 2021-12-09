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

    @DeleteMapping(value = "")
    public ResponseEntity<Object> deleteUser() {
        userService.deleteUser();
        return ResponseEntity.noContent().build();
    }

}