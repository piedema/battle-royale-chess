package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.dto.request.AuthenticationRequest;
import com.battleroyalechess.backend.dto.response.AuthenticationResponse;
import com.battleroyalechess.backend.service.UserAuthenticateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
public class AuthenticationController {

    UserAuthenticateService userAuthenticateService;

    @Autowired
    public AuthenticationController(UserAuthenticateService userAuthenticateService) {
        this.userAuthenticateService = userAuthenticateService;
    }

    @PostMapping(value = "/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest, HttpServletResponse res) {
        AuthenticationResponse authenticationResponse = userAuthenticateService.authenticateUser(authenticationRequest);
        Cookie cookie = new Cookie("jwt", authenticationResponse.getJwt());
        cookie.setPath("/");
        //cookie.setSecure(true);
        cookie.setHttpOnly(true);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.addCookie(cookie);
        return ResponseEntity.ok(authenticationResponse);
    }

}