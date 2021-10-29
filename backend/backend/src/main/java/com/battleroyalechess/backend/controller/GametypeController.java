package com.battleroyalechess.backend.controller;

import com.battleroyalechess.backend.service.GametypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/gametypes")
public class GametypeController {

    private final GametypeService gametypeService;

    public GametypeController(GametypeService gametypeService){
        this.gametypeService = gametypeService;
    }

    @GetMapping(value = "")
    public ResponseEntity<Object> getGametypes(){
        return ResponseEntity.ok().body(gametypeService.getGametypes());
    }

}
