package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.response.PlayerResponse;
import com.battleroyalechess.backend.exception.*;
import com.battleroyalechess.backend.model.Authority;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PlayerService {

    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    public PlayerService(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public Collection<PlayerResponse> getPlayers() {
        List<User> users = userRepository.findAll();
        List<PlayerResponse> players = new ArrayList<>();

        for(User user : users){
            players.add(modelMapper.map(user, PlayerResponse.class));
        }

        return players;

    }
}