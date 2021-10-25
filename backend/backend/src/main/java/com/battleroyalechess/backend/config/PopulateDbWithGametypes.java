package com.battleroyalechess.backend.config;

import com.battleroyalechess.backend.dto.request.GametypePostRequest;
import com.battleroyalechess.backend.service.GametypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;

@Component
@Profile("development")
public class PopulateDbWithGametypes implements CommandLineRunner {

    @Autowired
    GametypeService gametypeService;

    @Override
    public void run(String... args) throws Exception {

        HashMap<String, ArrayList<String>> board1 = new HashMap<>();
        board1.put("1:1", createTile(null, null));
        board1.put("1:2", createTile(null, null));
        board1.put("1:3", createTile(null, null));
        board1.put("1:4", createTile(null, null));
        board1.put("1:5", createTile(null, null));
        board1.put("1:6", createTile(null, null));
        board1.put("1:7", createTile(null, null));
        board1.put("1:8", createTile(null, null));
        board1.put("1:9", createTile(null, null));
        board1.put("2:1", createTile(null, null));
        board1.put("2:2", createTile(null, null));
        board1.put("2:3", createTile(null, null));
        board1.put("2:4", createTile(null, null));
        board1.put("2:5", createTile(null, null));
        board1.put("2:6", createTile(null, null));
        board1.put("2:7", createTile(null, null));
        board1.put("2:8", createTile(null, null));
        board1.put("2:9", createTile(null, null));
        board1.put("3:1", createTile(null, null));
        board1.put("3:2", createTile(null, null));
        board1.put("3:3", createTile(null, null));
        board1.put("3:4", createTile("player2", "King"));
        board1.put("3:5", createTile("player1", "King"));
        board1.put("3:6", createTile(null, null));
        board1.put("3:7", createTile(null, null));
        board1.put("3:8", createTile(null, null));
        board1.put("3:9", createTile(null, null));
        board1.put("4:1", createTile(null, null));
        board1.put("4:2", createTile(null, null));
        board1.put("4:3", createTile(null, null));
        board1.put("4:4", createTile(null, null));
        board1.put("4:5", createTile(null, null));
        board1.put("4:6", createTile(null, null));
        board1.put("4:7", createTile(null, null));
        board1.put("4:8", createTile(null, null));
        board1.put("4:9", createTile(null, null));
        board1.put("5:1", createTile(null, null));
        board1.put("5:2", createTile(null, null));
        board1.put("5:3", createTile(null, null));
        board1.put("5:4", createTile(null, null));
        board1.put("5:5", createTile(null, null));
        board1.put("5:6", createTile(null, null));
        board1.put("5:7", createTile(null, null));
        board1.put("5:8", createTile(null, null));
        board1.put("5:9", createTile(null, null));
        ArrayList<String> playerDirections1 = new ArrayList<>();
        playerDirections1.add("east");
        playerDirections1.add("west");
        createGametype("gametype1", 2, 100, 5, 5, 1, 3, board1, playerDirections1);

        HashMap<String, ArrayList<String>> board2 = new HashMap<>();
        ArrayList<String> playerDirections2 = new ArrayList<>();
        playerDirections2.add("north");
        playerDirections2.add("east");
        playerDirections2.add("south");
        playerDirections2.add("west");
        createGametype("gametype2", 4, 200, 6, 20, 15, 20, board2, playerDirections2);

    }

    private ArrayList<String> createTile(String username, String piece){
        ArrayList<String> tile = new ArrayList<>();
        if(username != null) tile.add(username);
        if(piece != null) tile.add(piece);
        return tile;
    }

    private void createGametype(
            String gametype,
            int numberOfPlayers,
            int numberOfRounds,
            int circleShrinkAfterNRounds,
            int circleShrinkOffset,
            int timePerRound,
            int initialDelay,
            HashMap<String, ArrayList<String>> board,
            ArrayList<String> playerDirections
    ){

        GametypePostRequest gametypePostRequest = new GametypePostRequest();

        gametypePostRequest.setGametype(gametype);
        gametypePostRequest.setNumberOfPlayers(numberOfPlayers);
        gametypePostRequest.setNumberOfRounds(numberOfRounds);
        gametypePostRequest.setCircleShrinkAfterNRounds(circleShrinkAfterNRounds);
        gametypePostRequest.setCircleShrinkOffset(circleShrinkOffset);
        gametypePostRequest.setTimePerRound(timePerRound);
        gametypePostRequest.setInitialDelay(initialDelay);
        gametypePostRequest.setBoard(board);
        gametypePostRequest.setPlayerDirections(playerDirections);

        gametypeService.createGametype(gametypePostRequest);

    }

}
