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
        board1.put("1:1", createTile("1", "Tower"));
        board1.put("1:2", createTile("1", "Bishop"));
        board1.put("1:3", createTile(null, null));
        board1.put("1:4", createTile(null, null));
        board1.put("1:5", createTile(null, null));
        board1.put("1:6", createTile(null, null));
        board1.put("1:7", createTile(null, null));
        board1.put("1:8", createTile("2", "Bishop"));
        board1.put("1:9", createTile("2", "Tower"));
        board1.put("2:1", createTile(null, null));
        board1.put("2:2", createTile(null, null));
        board1.put("2:3", createTile("1", "Pawn"));
        board1.put("2:4", createTile(null, null));
        board1.put("2:5", createTile(null, null));
        board1.put("2:6", createTile(null, null));
        board1.put("2:7", createTile("2", "Pawn"));
        board1.put("2:8", createTile(null, null));
        board1.put("2:9", createTile(null, null));
        board1.put("3:1", createTile(null, null));
        board1.put("3:2", createTile("1", "Queen"));
        board1.put("3:3", createTile("1", "Pawn"));
        board1.put("3:4", createTile(null, null));
        board1.put("3:5", createTile(null, null));
        board1.put("3:6", createTile(null, null));
        board1.put("3:7", createTile("2", "Pawn"));
        board1.put("3:8", createTile("2", "Knight"));
        board1.put("3:9", createTile(null, null));
        board1.put("4:1", createTile(null, null));
        board1.put("4:2", createTile("1", "King"));
        board1.put("4:3", createTile("1", "Pawn"));
        board1.put("4:4", createTile(null, null));
        board1.put("4:5", createTile(null, null));
        board1.put("4:6", createTile(null, null));
        board1.put("4:7", createTile("2", "Pawn"));
        board1.put("4:8", createTile("2", "King"));
        board1.put("4:9", createTile(null, null));
        board1.put("5:1", createTile(null, null));
        board1.put("5:2", createTile("1", "Knight"));
        board1.put("5:3", createTile("1", "Pawn"));
        board1.put("5:4", createTile(null, null));
        board1.put("5:5", createTile(null, null));
        board1.put("5:6", createTile(null, null));
        board1.put("5:7", createTile("2", "Pawn"));
        board1.put("5:8", createTile("2", "Queen"));
        board1.put("5:9", createTile(null, null));
        board1.put("6:1", createTile(null, null));
        board1.put("6:2", createTile(null, null));
        board1.put("6:3", createTile("1", "Pawn"));
        board1.put("6:4", createTile(null, null));
        board1.put("6:5", createTile(null, null));
        board1.put("6:6", createTile(null, null));
        board1.put("6:7", createTile("2", "Pawn"));
        board1.put("6:8", createTile(null, null));
        board1.put("6:9", createTile(null, null));
        board1.put("7:1", createTile("1", "Tower"));
        board1.put("7:2", createTile("1", "Bishop"));
        board1.put("7:3", createTile(null, null));
        board1.put("7:4", createTile(null, null));
        board1.put("7:5", createTile(null, null));
        board1.put("7:6", createTile(null, null));
        board1.put("7:7", createTile(null, null));
        board1.put("7:8", createTile("2", "Bishop"));
        board1.put("7:9", createTile("2", "Tower"));
        ArrayList<String> playerDirections1 = new ArrayList<>();
        playerDirections1.add("east");
        playerDirections1.add("west");
        createGametype("2Player", 2, 5, 5, 15, 15, board1, playerDirections1);

        HashMap<String, ArrayList<String>> board2 = new HashMap<>();
        board2.put("1:6", createTile(null, null));
        board2.put("1:7", createTile(null, null));
        board2.put("1:8", createTile("2", "Knight"));
        board2.put("1:9", createTile(null, null));
        board2.put("1:10", createTile(null, null));
        board2.put("2:6", createTile("2", "Tower"));
        board2.put("2:7", createTile(null, null));
        board2.put("2:8", createTile("2", "Queen"));
        board2.put("2:9", createTile(null, null));
        board2.put("2:10", createTile("2", "Tower"));
        board2.put("3:6", createTile("2", "Bishop"));
        board2.put("3:7", createTile(null, null));
        board2.put("3:8", createTile("2", "King"));
        board2.put("3:9", createTile(null, null));
        board2.put("3:10", createTile("2", "Bishop"));
        board2.put("4:6", createTile(null, null));
        board2.put("4:7", createTile("2", "Pawn"));
        board2.put("4:8", createTile("2", "Knight"));
        board2.put("4:9", createTile("2", "Pawn"));
        board2.put("4:10", createTile(null, null));
        board2.put("5:6", createTile(null, null));
        board2.put("5:7", createTile(null, null));
        board2.put("5:8", createTile("2", "Pawn"));
        board2.put("5:9", createTile(null, null));
        board2.put("5:10", createTile(null, null));
        board2.put("6:1", createTile(null, null));
        board2.put("6:2", createTile("1", "Tower"));
        board2.put("6:3", createTile("1", "Bishop"));
        board2.put("6:4", createTile(null, null));
        board2.put("6:5", createTile(null, null));
        board2.put("6:6", createTile(null, null));
        board2.put("6:7", createTile(null, null));
        board2.put("6:8", createTile(null, null));
        board2.put("6:9", createTile(null, null));
        board2.put("6:10", createTile(null, null));
        board2.put("6:11", createTile(null, null));
        board2.put("6:12", createTile(null, null));
        board2.put("6:13", createTile("3", "Bishop"));
        board2.put("6:14", createTile("3", "Tower"));
        board2.put("6:15", createTile(null, null));
        board2.put("7:1", createTile(null, null));
        board2.put("7:2", createTile(null, null));
        board2.put("7:3", createTile(null, null));
        board2.put("7:4", createTile("1", "Pawn"));
        board2.put("7:5", createTile(null, null));
        board2.put("7:6", createTile(null, null));
        board2.put("7:7", createTile(null, null));
        board2.put("7:8", createTile(null, null));
        board2.put("7:9", createTile(null, null));
        board2.put("7:10", createTile(null, null));
        board2.put("7:11", createTile(null, null));
        board2.put("7:12", createTile("3", "Pawn"));
        board2.put("7:13", createTile(null, null));
        board2.put("7:14", createTile(null, null));
        board2.put("7:15", createTile(null, null));
        board2.put("8:1", createTile("1", "Knight"));
        board2.put("8:2", createTile("1", "Queen"));
        board2.put("8:3", createTile("1", "King"));
        board2.put("8:4", createTile("1", "Knight"));
        board2.put("8:5", createTile("1", "Pawn"));
        board2.put("8:6", createTile(null, null));
        board2.put("8:7", createTile(null, null));
        board2.put("8:8", createTile(null, null));
        board2.put("8:9", createTile(null, null));
        board2.put("8:10", createTile(null, null));
        board2.put("8:11", createTile("3", "Pawn"));
        board2.put("8:12", createTile("3", "Knight"));
        board2.put("8:13", createTile("3", "King"));
        board2.put("8:14", createTile("3", "Queen"));
        board2.put("8:15", createTile("3", "Knight"));
        board2.put("9:1", createTile(null, null));
        board2.put("9:2", createTile(null, null));
        board2.put("9:3", createTile(null, null));
        board2.put("9:4", createTile("1", "Pawn"));
        board2.put("9:5", createTile(null, null));
        board2.put("9:6", createTile(null, null));
        board2.put("9:7", createTile(null, null));
        board2.put("9:8", createTile(null, null));
        board2.put("9:9", createTile(null, null));
        board2.put("9:10", createTile(null, null));
        board2.put("9:11", createTile(null, null));
        board2.put("9:12", createTile("3", "Pawn"));
        board2.put("9:13", createTile(null, null));
        board2.put("9:14", createTile(null, null));
        board2.put("9:15", createTile(null, null));
        board2.put("10:1", createTile(null, null));
        board2.put("10:2", createTile("1", "Tower"));
        board2.put("10:3", createTile("1", "Bishop"));
        board2.put("10:4", createTile(null, null));
        board2.put("10:5", createTile(null, null));
        board2.put("10:6", createTile(null, null));
        board2.put("10:7", createTile(null, null));
        board2.put("10:8", createTile(null, null));
        board2.put("10:9", createTile(null, null));
        board2.put("10:10", createTile(null, null));
        board2.put("10:11", createTile(null, null));
        board2.put("10:12", createTile(null, null));
        board2.put("10:13", createTile("3", "Bishop"));
        board2.put("10:14", createTile("3", "Tower"));
        board2.put("10:15", createTile(null, null));
        board2.put("11:6", createTile(null, null));
        board2.put("11:7", createTile(null, null));
        board2.put("11:8", createTile("4", "Pawn"));
        board2.put("11:9", createTile(null, null));
        board2.put("11:10", createTile(null, null));
        board2.put("12:6", createTile(null, null));
        board2.put("12:7", createTile("4", "Pawn"));
        board2.put("12:8", createTile("4", "Knight"));
        board2.put("12:9", createTile("4", "Pawn"));
        board2.put("12:10", createTile(null, null));
        board2.put("13:6", createTile("4", "Bishop"));
        board2.put("13:7", createTile(null, null));
        board2.put("13:8", createTile("4", "King"));
        board2.put("13:9", createTile(null, null));
        board2.put("13:10", createTile("4", "Bishop"));
        board2.put("14:6", createTile("4", "Tower"));
        board2.put("14:7", createTile(null, null));
        board2.put("14:8", createTile("4", "Queen"));
        board2.put("14:9", createTile(null, null));
        board2.put("14:10", createTile("4", "Tower"));
        board2.put("15:6", createTile(null, null));
        board2.put("15:7", createTile(null, null));
        board2.put("15:8", createTile("4", "Knight"));
        board2.put("15:9", createTile(null, null));
        board2.put("15:10", createTile(null, null));
        ArrayList<String> playerDirections2 = new ArrayList<>();
        playerDirections2.add("east");
        playerDirections2.add("west");
        createGametype("4PlayerBig+", 4, 3, 20, 10, 15, board2, playerDirections2);

    }

    private ArrayList<String> createTile(String playerNumber, String piece){
        ArrayList<String> tile = new ArrayList<>();
        tile.add("normal");
        if(playerNumber != null) tile.add(playerNumber);
        if(piece != null) tile.add(piece);
        return tile;
    }

    private void createGametype(
            String gametype,
            int numberOfPlayers,
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
        gametypePostRequest.setCircleShrinkAfterNRounds(circleShrinkAfterNRounds);
        gametypePostRequest.setCircleShrinkOffset(circleShrinkOffset);
        gametypePostRequest.setTimePerRound(timePerRound);
        gametypePostRequest.setInitialDelay(initialDelay);
        gametypePostRequest.setBoard(board);
        gametypePostRequest.setPlayerDirections(playerDirections);

        gametypeService.createGametype(gametypePostRequest);

    }

}
