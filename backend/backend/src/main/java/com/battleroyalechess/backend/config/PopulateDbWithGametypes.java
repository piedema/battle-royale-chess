package com.battleroyalechess.backend.config;

import com.battleroyalechess.backend.dto.request.GametypePostRequest;
import com.battleroyalechess.backend.service.GametypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@Profile("development")
public class PopulateDbWithGametypes implements CommandLineRunner {

    @Autowired
    GametypeService gametypeService;

    @Override
    public void run(String... args) throws Exception {

        ArrayList<String> board1 = new ArrayList<>();
        createGametype("gametype1", 2, 100, 5, 10, board1);

    }

    private void createGametype(String name, int numberOfPlayers, int numberOfRounds, int circleShrinkAfterNRounds, int circleShrinkOffset, ArrayList<String> board){

        GametypePostRequest gametypePostRequest = new GametypePostRequest();

        gametypePostRequest.setName(name);
        gametypePostRequest.setNumberOfPlayers(numberOfPlayers);
        gametypePostRequest.setNumberOfRounds(numberOfRounds);
        gametypePostRequest.setCircleShrinkAfterNRounds(circleShrinkAfterNRounds);
        gametypePostRequest.setCircleShrinkOffset(circleShrinkOffset);
        gametypePostRequest.setBoard(board);

        gametypeService.createGametype(gametypePostRequest);

    }

}
