package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.request.AuthenticationRequest;
import com.battleroyalechess.backend.dto.response.AuthenticationResponse;
import com.battleroyalechess.backend.service.UserAuthenticateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthenticationController {

    UserAuthenticateService userAuthenticateService;

    @Autowired
    public AuthenticationController(UserAuthenticateService userAuthenticateService) {
        this.userAuthenticateService = userAuthenticateService;
    }

    @PostMapping(value = "/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {

        try {

            System.out.println(authenticationRequest.getUsername() + " " + authenticationRequest.getPassword());

            AuthenticationResponse authenticationResponse = userAuthenticateService.authenticateUser(authenticationRequest);

            return ResponseEntity.ok(authenticationResponse);
        }
        catch (Exception ex){
            System.out.println(ex);
            throw ex;
        }
    }

}