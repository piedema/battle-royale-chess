package com.battleroyalechess.backend.config;

import com.battleroyalechess.backend.dto.request.UserPostRequest;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.service.RegisterService;
import org.apache.catalina.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Profile("development")                     // only run when in development mode
public class PopulateDbWithGames implements CommandLineRunner {

    // create default games to test the game

    @Autowired
    RegisterService registerService;
    @Autowired
    private GameRepository gameRepository;

    @Override
    public void run(String... args) throws Exception {

        ArrayList<String> players1 = new ArrayList<>();
        players1.add("bart");
        players1.add("peter");

        HashMap<String, ArrayList<String>> board1 = new HashMap<>();
        board1.put("1:1", createTile("normal", "1", "Tower"));
        board1.put("1:2", createTile("normal", "1", "Bishop"));
        board1.put("1:3", createTile("normal", null, null));
        board1.put("1:4", createTile("normal", null, null));
        board1.put("1:5", createTile("normal", null, null));
        board1.put("1:6", createTile("normal", null, null));
        board1.put("1:7", createTile("normal", null, null));
        board1.put("1:8", createTile("normal", null, null));
        board1.put("1:9", createTile("normal", "2", "Tower"));
        board1.put("2:1", createTile("normal", null, null));
        board1.put("2:2", createTile("normal", null, null));
        board1.put("2:3", createTile("normal", "1", "Pawn"));
        board1.put("2:4", createTile("normal", null, null));
        board1.put("2:5", createTile("normal", null, null));
        board1.put("2:6", createTile("normal", "2", "Pawn"));
        board1.put("2:7", createTile("normal", null, null));
        board1.put("2:8", createTile("normal", null, null));
        board1.put("2:9", createTile("normal", null, null));
        board1.put("3:1", createTile("normal", null, null));
        board1.put("3:2", createTile("normal", null, null));
        board1.put("3:3", createTile("normal", "1", "Pawn"));
        board1.put("3:4", createTile("normal", null, null));
        board1.put("3:5", createTile("normal", null, null));
        board1.put("3:6", createTile("normal", null, null));
        board1.put("3:7", createTile("normal", "2", "Pawn"));
        board1.put("3:8", createTile("normal", "2", "Knight"));
        board1.put("3:9", createTile("normal", null, null));
        board1.put("4:1", createTile("normal", null, null));
        board1.put("4:2", createTile("normal", "1", "King"));
        board1.put("4:3", createTile("normal", null, null));
        board1.put("4:4", createTile("normal", "1", "Pawn"));
        board1.put("4:5", createTile("normal", null, null));
        board1.put("4:6", createTile("normal", "2", "Pawn"));
        board1.put("4:7", createTile("normal", "1", "Queen"));
        board1.put("4:8", createTile("normal", null, null));
        board1.put("4:9", createTile("normal", null, null));
        board1.put("5:1", createTile("normal", null, null));
        board1.put("5:2", createTile("normal", null, null));
        board1.put("5:3", createTile("normal", "1", "Pawn"));
        board1.put("5:4", createTile("normal", null, null));
        board1.put("5:5", createTile("normal", null, null));
        board1.put("5:6", createTile("normal", null, null));
        board1.put("5:7", createTile("normal", "2", "Pawn"));
        board1.put("5:8", createTile("normal", null, null));
        board1.put("5:9", createTile("normal", null, null));
        board1.put("6:1", createTile("normal", null, null));
        board1.put("6:2", createTile("normal", null, null));
        board1.put("6:3", createTile("normal", null, null));
        board1.put("6:4", createTile("normal", "1", "Knight"));
        board1.put("6:5", createTile("normal", null, null));
        board1.put("6:6", createTile("normal", null, null));
        board1.put("6:7", createTile("normal", "2", "Pawn"));
        board1.put("6:8", createTile("normal", null, null));
        board1.put("6:9", createTile("normal", null, null));
        board1.put("7:1", createTile("normal", "1", "Tower"));
        board1.put("7:2", createTile("normal", null, null));
        board1.put("7:3", createTile("normal", null, null));
        board1.put("7:4", createTile("normal", "2", "Queen"));
        board1.put("7:5", createTile("normal", null, null));
        board1.put("7:6", createTile("normal", null, null));
        board1.put("7:7", createTile("normal", null, null));
        board1.put("7:8", createTile("normal", "2", "Bishop"));
        board1.put("7:9", createTile("normal", "2", "Tower"));

        HashMap<Integer, ArrayList<String>> moves1 = new HashMap<>();
        ArrayList<String> moves;
        moves1.put(1, moves = new ArrayList<>(Arrays.asList("4:3>4:4", "2:7>2:6")));
        moves1.put(2, moves = new ArrayList<>(Arrays.asList("3:2>6:5", "1:8>6:3")));
        moves1.put(3, moves = new ArrayList<>(Arrays.asList("6:5>6:3", "6:3>7:2")));
        moves1.put(4, moves = new ArrayList<>(Arrays.asList("6:3>6:5", "4:7>4:6")));
        moves1.put(5, moves = new ArrayList<>(Arrays.asList("5:2>6:4", "5:8>4:7")));
        moves1.put(6, moves = new ArrayList<>(Arrays.asList("6:5>7:4", "4:7>6:5")));
        moves1.put(7, moves = new ArrayList<>(Arrays.asList(null, null)));
        moves1.put(8, moves = new ArrayList<>(Arrays.asList(null, null)));
        moves1.put(9, moves = new ArrayList<>(Arrays.asList("4:7>4:8", "4:8>4:7")));

        ArrayList<Integer> scores1 = new ArrayList<>();
        scores1.add(38);
        scores1.add(-13);

        createGame(
                1,
                true,
                "Small",
                9,
                1644147333,
                1644146763,
                players1,
                board1,
                moves1,
                scores1
        );

        ArrayList<String> players2 = new ArrayList<>();
        players2.add("bart");
        players2.add("peter");

        HashMap<String, ArrayList<String>> board2 = new HashMap<>();
        board2.put("1:1", createTile("faded", null, null));
        board2.put("1:2", createTile("faded", null, null));
        board2.put("1:3", createTile("faded", null, null));
        board2.put("1:4", createTile("faded", null, null));
        board2.put("1:5", createTile("faded", null, null));
        board2.put("1:6", createTile("faded", null, null));
        board2.put("1:7", createTile("faded", null, null));
        board2.put("1:8", createTile("faded", "1", "Tower"));
        board2.put("1:9", createTile("faded", "2", "Tower"));
        board2.put("2:1", createTile("faded", null, null));
        board2.put("2:2", createTile("normal", null, null));
        board2.put("2:3", createTile("normal", null, null));
        board2.put("2:4", createTile("normal", "1", "Pawn"));
        board2.put("2:5", createTile("normal", null, null));
        board2.put("2:6", createTile("normal", null, null));
        board2.put("2:7", createTile("normal", "2", "Pawn"));
        board2.put("2:8", createTile("normal", null, null));
        board2.put("2:9", createTile("faded", null, null));
        board2.put("3:1", createTile("faded", null, null));
        board2.put("3:2", createTile("normal", null, null));
        board2.put("3:3", createTile("normal", "1", "Pawn"));
        board2.put("3:4", createTile("normal", "2", "Knight"));
        board2.put("3:5", createTile("normal", null, null));
        board2.put("3:6", createTile("normal", null, null));
        board2.put("3:7", createTile("normal", "2", "Pawn"));
        board2.put("3:8", createTile("normal", null, null));
        board2.put("3:9", createTile("faded", null, null));
        board2.put("4:1", createTile("faded", null, null));
        board2.put("4:2", createTile("normal", "1", "King"));
        board2.put("4:3", createTile("normal", null, null));
        board2.put("4:4", createTile("normal", "1", "Pawn"));
        board2.put("4:5", createTile("normal", null, null));
        board2.put("4:6", createTile("normal", "2", "Pawn"));
        board2.put("4:7", createTile("normal", null, null));
        board2.put("4:8", createTile("normal", null, null));
        board2.put("4:9", createTile("faded", "2", "King"));
        board2.put("5:1", createTile("faded", null, null));
        board2.put("5:2", createTile("normal", null, null));
        board2.put("5:3", createTile("normal", "1", "Pawn"));
        board2.put("5:4", createTile("normal", null, null));
        board2.put("5:5", createTile("normal", null, null));
        board2.put("5:6", createTile("normal", "1", "Bishop"));
        board2.put("5:7", createTile("normal", "2", "Pawn"));
        board2.put("5:8", createTile("normal", null, null));
        board2.put("5:9", createTile("faded", "2", "Tower"));
        board2.put("6:1", createTile("faded", null, null));
        board2.put("6:2", createTile("normal", null, null));
        board2.put("6:3", createTile("normal", "1", "Pawn"));
        board2.put("6:4", createTile("normal", "1", "Knight"));
        board2.put("6:5", createTile("normal", null, null));
        board2.put("6:6", createTile("normal", null, null));
        board2.put("6:7", createTile("normal", "2", "Pawn"));
        board2.put("6:8", createTile("normal", null, null));
        board2.put("6:9", createTile("faded", null, null));
        board2.put("7:1", createTile("faded", "1", "Queen"));
        board2.put("7:2", createTile("faded", null, null));
        board2.put("7:3", createTile("faded", null, null));
        board2.put("7:4", createTile("faded", null, null));
        board2.put("7:5", createTile("faded", null, null));
        board2.put("7:6", createTile("faded", null, null));
        board2.put("7:7", createTile("faded", null, null));
        board2.put("7:8", createTile("faded", "2", "Bishop"));
        board2.put("7:9", createTile("faded", null, null));

        HashMap<Integer, ArrayList<String>> moves2 = new HashMap<>();
        ArrayList<String> move2;
        moves2.put(1, move2 = new ArrayList<>(Arrays.asList("4:3>4:4", "4:7>4:6")));
        moves2.put(2, move2 = new ArrayList<>(Arrays.asList("5:2>6:4", "5:8>2:5")));
        moves2.put(3, move2 = new ArrayList<>(Arrays.asList("2:3>2:4", "2:5>3:5")));
        moves2.put(4, move2 = new ArrayList<>(Arrays.asList("1:2>5:6", "3:8>2:6")));
        moves2.put(5, move2 = new ArrayList<>(Arrays.asList(null, "3:5>7:5")));
        moves2.put(6, move2 = new ArrayList<>(Arrays.asList("3:2>5:4", "7:5>7:2")));
        moves2.put(7, move2 = new ArrayList<>(Arrays.asList("5:4>6:5", "7:2>7:1")));
        moves2.put(8, move2 = new ArrayList<>(Arrays.asList("1:1>1:8", "4:8>5:8")));
        moves2.put(9, move2 = new ArrayList<>(Arrays.asList("6:5>7:6", "5:8>4:9")));
        moves2.put(10, move2 = new ArrayList<>(Arrays.asList("7:6>7:1", "7:9>5:9")));
        moves2.put(11, move2 = new ArrayList<>(Arrays.asList(null, "2:6>3:4")));
        moves2.put(12, move2 = new ArrayList<>(Arrays.asList(null, "4:8>4:7")));

        ArrayList<Integer> scores2 = new ArrayList<>();
        scores2.add(16);
        scores2.add(4);

        createGame(
                2,
                true,
                "SmallSpeedy",
                12,
                1644151164,
                1644151014,
                players2,
                board2,
                moves2,
                scores2
        );

    }

    private void createGame(
            long gameId,
            boolean finished,
            String gametype,
            Integer round,
            long nextRoundAt,
            long gameStartedAt,
            ArrayList<String> players,
            HashMap<String, ArrayList<String>> board,
            HashMap<Integer, ArrayList<String>> moves,
            ArrayList<Integer> scores
    ){

        Game game = new Game();
        game.setGameId(gameId);
        if(finished) game.setFinished();
        game.setGametype(gametype);
        game.setRound(round);
        game.setNextRoundAt(nextRoundAt);
        game.setGameStartedAt(gameStartedAt);
        game.setPlayers(players);
        game.setBoard(board);
        game.setMoves(moves);
        game.setScores(scores);

        gameRepository.save(game);

    }

    private ArrayList<String> createTile(String tileState, String playerNumber, String piece){
        ArrayList<String> tile = new ArrayList<>();
        tile.add(tileState);
        if(playerNumber != null) tile.add(playerNumber);
        if(piece != null) tile.add(piece);
        return tile;
    }
}
