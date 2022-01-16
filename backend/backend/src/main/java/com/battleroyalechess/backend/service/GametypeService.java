package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.GametypePostRequest;
import com.battleroyalechess.backend.exception.BadRequestException;
import com.battleroyalechess.backend.exception.GametypeNotFoundException;
import com.battleroyalechess.backend.exception.UserNotFoundException;
import com.battleroyalechess.backend.model.Gametype;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.GametypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GametypeService {

    private final GametypeRepository gametypeRepository;

    @Autowired
    public GametypeService(GametypeRepository gametypeRepository) {
        this.gametypeRepository = gametypeRepository;
    }

    public void createGametype(GametypePostRequest gametypePostRequest) {
        try {

            Gametype gametype = new Gametype();
            gametype.setGametype(gametypePostRequest.getGametype());
            gametype.setNumberOfPlayers(gametypePostRequest.getNumberOfPlayers());
            gametype.setCircleShrinkAfterNRounds(gametypePostRequest.getCircleShrinkAfterNRounds());
            gametype.setCircleShrinkOffset(gametypePostRequest.getCircleShrinkOffset());
            gametype.setTimePerRound(gametypePostRequest.getTimePerRound());
            gametype.setInitialDelay(gametypePostRequest.getInitialDelay());
            gametype.setBoard(gametypePostRequest.getBoard());
            gametype.setPlayerDirections(gametypePostRequest.getPlayerDirections());

            gametypeRepository.save(gametype);
        }
        catch (Exception ex) {
            throw new BadRequestException("Cannot create gametype.");
        }

    }

    public Optional<Gametype> getGametype(String gametype) {

        Optional<Gametype> gametypeOptional = gametypeRepository.findById(gametype);

        if (gametypeOptional.isEmpty()) {
            throw new GametypeNotFoundException(gametype);
        }

        return gametypeOptional;
    }

    public List<Gametype> getGametypes(){
        return gametypeRepository.findAll();
    }

    public void updateGametype(GametypePostRequest updatedGametype){
        System.out.println(updatedGametype);
        try {

            Optional<Gametype> gametypeOptional = gametypeRepository.findById(updatedGametype.getGametype());

            if(gametypeOptional.isPresent()) {
                Gametype gametype = gametypeOptional.get();
                gametype.setNumberOfPlayers(updatedGametype.getNumberOfPlayers());
                gametype.setCircleShrinkAfterNRounds(updatedGametype.getCircleShrinkAfterNRounds());
                gametype.setCircleShrinkOffset(updatedGametype.getCircleShrinkOffset());
                gametype.setTimePerRound(updatedGametype.getTimePerRound());
                gametype.setInitialDelay(updatedGametype.getInitialDelay());
                gametype.setBoard(updatedGametype.getBoard());
                gametype.setPlayerDirections(updatedGametype.getPlayerDirections());

                gametypeRepository.save(gametype);
            }
        }
        catch (Exception ex) {
            throw new BadRequestException("Cannot create gametype.");
        }

    }

    public boolean gametypeExists(String gametype) {
        return gametypeRepository.existsById(gametype);
    }

    public void deleteGametype(String gametype) {
        if (gametypeExists(gametype)) gametypeRepository.deleteById(gametype);
        else throw new GametypeNotFoundException(gametype);
    }
}
