package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.dto.request.NewMovePostRequest;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Component
public class GameEngineService {

    private String gametype;
    private ArrayList<String> players;
    private Long gameId;
    private Boolean hasGameStarted = false;
    private final Map<String, List<String>> board = new HashMap<>();
    private final Map<String, List<String>> nextMoves = new HashMap<>();
    private ScheduledFuture<?> scheduledTask;
    private GamesService gamesService;

    private final UserService userService;
    private final GameRepository gameRepository;
    private final GametypeRepository gametypeRepository;

    public GameEngineService(UserService userService, GameRepository gameRepository, GametypeRepository gametypeRepository) {
        this.userService = userService;
        this.gameRepository = gameRepository;
        this.gametypeRepository = gametypeRepository;
    }

    public Long initialize(String gametype, ArrayList<String> players, GamesService gamesService){
        this.gametype = gametype;
        this.players = players;
        this.gamesService = gamesService;

        Game game = new Game();
        game.setGametype(gametype);
        game.setPlayers(players);

        Game savedGame = gameRepository.save(game);

        this.gameId = savedGame.getGameId();

        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        GameEngineTimerService gameEngineTimerService = new GameEngineTimerService(this.userService, this.gameRepository, this.gametypeRepository, this);
        this.scheduledTask = executor.scheduleAtFixedRate(gameEngineTimerService, 2, 5, TimeUnit.SECONDS);

        return this.gameId;
    }

    public String getGametype() {
        return gametype;
    }

    public ArrayList<String> getPlayers() {
        return players;
    }

    public Long getGameId(){
        return gameId;
    }

    public void newMove(NewMovePostRequest newMovePostRequest){

        String username = this.userService.getCurrentUserName();
        String from = newMovePostRequest.getFrom();
        String to = newMovePostRequest.getTo();

        // check if players king is still alive
        for (Map.Entry<String, List<String>> tile : board.entrySet()) {
            if(tile.getValue().contains(username) && tile.getValue().contains("King")){
                return;
            }
        }

        // create list with path for piece. list must be empty if path is not possible, then return
        String piece = board.get(from).get(1);
        List<String> path = createPath(piece, from, to);

        // check if whole path are tiles
        if(!isWholePathTiles(path)){
            return;
        }

        // check if there are no interuptions (other pieces) in the path. this does not count for knight
        if(!piece.equals("Knight") && isPathBlocked(path)){
            return;
        }

        // store move locally. at end of round moves are stored in db. Not before, so other users cant see move before end of round
        ArrayList<String> currentMove = new ArrayList<>();
        currentMove.add(from);
        currentMove.add(to);

        nextMoves.put(username, currentMove);
    }

    public Boolean hasGameStarted(){
        return this.hasGameStarted;
    }

    public void startGame(){

        this.hasGameStarted = true;

    }

    // store results of this round
    public void endRound(){

        // perform all moves

        // for every move that removed another players pieces, award points to that player

        // calculate scores

        // store game in db

        // create a new empty list of moves
        nextMoves.clear();

        // if there is only 1 king or 0 kings left that is not dead end game
        int numberOfKingsAlive = 0;

        for (Map.Entry<String, List<String>> tile : board.entrySet()) {
            if(tile.getValue().contains("King")){
                numberOfKingsAlive++;
            }
        }

        if(numberOfKingsAlive <= 1) {
            endGame();
        }

    }

    public void endGame(){
        // remove all references (timer and instance) to apply for garbage collection

        // remove timer
        this.scheduledTask.cancel(true);

        // orphan Game instance
        this.gamesService.orphanGame(this.gameId);

    }

    public List<String> createPath(String piece, String from, String to){
        ArrayList<String> path = new ArrayList<>();

        switch (piece){
            case "King":

                break;
            case "Queen":

                break;
            case "Tower":

                break;
            case "Bishop":

                break;
            case "Knight":

                break;
            case "Pawn":

                break;
        }

        return path;
    }

    public Boolean isWholePathTiles(List<String> path){
        for(String tile: path){
            if(!board.containsKey(tile)){
                return false;
            }
        }
        return true;
    }

    public Boolean isPathBlocked(List<String> path){
        String from = path.get(0);
        String to = path.get(path.size() - 1);
        for(String tile: path){
            if(!tile.equals(from) && !tile.equals(to) && board.get(tile).size() > 0){
                return false;
            }
        }
        return true;
    }

}