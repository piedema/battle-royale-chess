package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.GametypePostRequest;
import com.battleroyalechess.backend.exception.BadRequestException;
import com.battleroyalechess.backend.model.Gametype;
import com.battleroyalechess.backend.repository.GametypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GametypeService {

    private GametypeRepository gametypeRepository;

    @Autowired
    public GametypeService(GametypeRepository gametypeRepository) {
        this.gametypeRepository = gametypeRepository;
    }

    public void createGametype(GametypePostRequest gametypePostRequest) {
        try {

            Gametype gametype = new Gametype();
            gametype.setGametype(gametypePostRequest.getGametype());
            gametype.setNumberOfPlayers(gametypePostRequest.getNumberOfPlayers());
            gametype.setNumberOfRounds(gametypePostRequest.getNumberOfRounds());
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
}
