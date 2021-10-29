package com.battleroyalechess.backend.gameEngine;

import com.battleroyalechess.backend.dto.request.NewMovePostRequest;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.model.Gametype;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.repository.UserRepository;
import com.battleroyalechess.backend.service.GamesService;
import com.battleroyalechess.backend.service.UserService;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Component
public class GameEngine {

    private Game game;
    private Gametype gametype;
    private Long gameId;
    private Boolean hasGameStarted = false;
    private HashMap<String, ArrayList<String>> board = new HashMap<>();
    private Map<String, String> nextMoves = new HashMap<>();
    private ScheduledFuture<?> scheduledTask;
    private GamesService gamesService;
    private final Map<String, Integer> pieces = new HashMap<>();
    private int currentRound = 0;
    private int initialDelay;
    private int timePerRound;
//    private GameEngineTimer gameEngineTimerService;
//    private ScheduledExecutorService executor;
    //private final Timer timer = new Timer();

    private final UserService userService;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final GametypeRepository gametypeRepository;

    public GameEngine(UserService userService, GameRepository gameRepository, UserRepository userRepository, GametypeRepository gametypeRepository) {
        this.userService = userService;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.gametypeRepository = gametypeRepository;
    }

    public Long initialize(String gametype, ArrayList<String> players, GamesService gamesService){

        Optional<Gametype> gametypeFromDb = this.gametypeRepository.findById(gametype);
        gametypeFromDb.ifPresent(value -> this.gametype = value);

        this.board = this.gametype.getBoard();

        this.gamesService = gamesService;

        this.pieces.put("Pawn", 1);
        this.pieces.put("Knight", 2);
        this.pieces.put("Bishop", 3);
        this.pieces.put("Tower", 5);
        this.pieces.put("Queen", 9);
        this.pieces.put("King", 18);

        this.initialDelay = this.gametype.getInitialDelay() * 1000;
        this.timePerRound = this.gametype.getTimePerRound() * 1000;

        Game game = new Game();
        game.setGametype(gametype);
        game.setPlayers(players);
        game.setBoard(this.board);
        game.setGameStartedAt(new Date().getTime());
        game.setCurrentRoundFinishedAt(new Date().getTime() + initialDelay);

        Game savedGame = gameRepository.save(game);

        this.game = savedGame;
        this.gameId = savedGame.getGameId();


        Timer timer = new Timer();
        timer.schedule(
                new TimerTask(){

                    @Override
                    public void run(){
                        startGame();
                        timer.cancel();
                    }
                }, initialDelay
        );

        return this.gameId;
    }

    public void newMove(NewMovePostRequest newMovePostRequest){

        if(!hasGameStarted()) return;

        String username = this.userService.getCurrentUserName();
        String from = newMovePostRequest.getFrom();
        String to = newMovePostRequest.getTo();

        // check if players king is still alive
        for (Map.Entry<String, ArrayList<String>> tile : board.entrySet()) {
            if(tile.getValue().contains(username) && tile.getValue().contains("King")){
                return;
            }
        }

        // create list with path for piece. list must be empty if path is not possible, then return
        String piece = board.get(from).get(1);
        int playerIndex = this.gameRepository.findPlayersByGameId(this.gameId).indexOf(username);
        String direction = this.gametype.playerDirections.get(playerIndex);
        List<String> path = createPath(piece, from, to, username, direction);

        // if path list is empty then there was no legal path found, then discard move
        if(path.size() == 0) return;

        // check if whole path are tiles
        if(!isWholePathTiles(path)){
            return;
        }

        // check if there are no interuptions (other pieces) in the path. this does not count for knight
        if(!piece.equals("Knight") && isPathBlocked(path)){
            return;
        }

        // store move locally. at end of round moves are stored in db. Not before, so other users cant see move before end of round
        String currentMove = from + ">" + to;

        // if user already has a move registered for this round, throw away old move
        nextMoves.remove(username);

        nextMoves.put(username, currentMove);
    }

    public Boolean hasGameStarted(){
        return this.hasGameStarted;
    }

    public void startGame(){
        this.hasGameStarted = true;

        currentRound = 1;
        game.setRound(currentRound);
        game.setCurrentRoundFinishedAt(this.game.getCurrentRoundFinishedAt() + timePerRound);
        this.gameRepository.save(this.game);

        //this.scheduledTask = executor.schedule(gameEngineTimerService, timePerRound, TimeUnit.SECONDS);timer.schedule(
        Timer timer = new Timer();
        timer.schedule(
                new TimerTask(){

                    @Override
                    public void run(){
                        finishRound();
                        timer.cancel();
                    }
                }, timePerRound
        );
    }

    public void finishRound(){

        // perform and store all moves
        // if a piece moves to a tile which is occupied already, it removes that piece
        // if 2 pieces move to the same tile the weakest gets removed. If they are of same value they both get removed
        ArrayList<Map<String, String>> removals = new ArrayList<Map<String, String>>();
        Map<String, ArrayList<String>> movingTo = new HashMap<>();

        for (Map.Entry<String, String> move : nextMoves.entrySet()) {

            String from = move.getValue().split(">")[0];
            String to = move.getValue().split(">")[1];
            String piece = getPieceOnTile(to);
            String removedBy = move.getKey();
            String removedFrom = getPlayerOnTile(to);

            // processing moving to occupied tile
            if(isTileOccupied(to)){
                Map<String, String> removed = new HashMap<>();
                removed.put("tile", to);
                removed.put("piece", piece);
                removed.put("removedBy", removedBy);
                removed.put("removedFrom", removedFrom);
                removals.add(removed);
            }

            // if moved piece would have been removed from tile it was on, remove that removal since it moved
            removals.removeIf(removal -> removal.get("tile").equals(from));

            // if there isnt any move planned to new tile then queue this move
            if(!movingTo.containsKey(to)){
                ArrayList<String> details = new ArrayList<>();
                details.add(removedBy);
                details.add(piece);
                movingTo.put(to, details);
            }

            // processing multiple moves to same tile where own move has better piece than other persons moved piece
            if(!movingTo.get(to).get(0).equals(removedBy) && this.pieces.get(piece) > this.pieces.get(movingTo.get(to).get(1))){
                ArrayList<String> details = new ArrayList<String>();
                details.add(removedBy);
                details.add(piece);

                Map<String, String> removed = new HashMap<>();
                removed.put("tile", to);
                removed.put("piece", movingTo.get(to).get(1));
                removed.put("removedBy", removedBy);
                removed.put("removedFrom", movingTo.get(to).get(0));

                removals.add(removed);
                movingTo.put(to, details);
            }

            // processing multiple moves to same tile where other piece has better piece then current players move
            if(!movingTo.get(to).get(0).equals(removedBy) && this.pieces.get(piece) < this.pieces.get(movingTo.get(to).get(1))){

                Map<String, String> removed = new HashMap<>();
                removed.put("tile", to);
                removed.put("piece", piece);
                removed.put("removedBy", movingTo.get(to).get(0));
                removed.put("removedFrom", removedFrom);

                removals.add(removed);
            }

            // processing multiple moves to same tile where both pieces are of same worth
            if(!movingTo.get(to).get(0).equals(removedBy) && this.pieces.get(piece).equals(this.pieces.get(movingTo.get(to).get(1)))){

                Map<String, String> removedCurrentUser = new HashMap<>();
                removedCurrentUser.put("tile", to);
                removedCurrentUser.put("piece", piece);
                removedCurrentUser.put("removedBy", movingTo.get(to).get(0));
                removedCurrentUser.put("removedFrom", removedFrom);

                removals.add(removedCurrentUser);

                Map<String, String> removedOtherUser = new HashMap<>();
                removedOtherUser.put("tile", to);
                removedOtherUser.put("piece", piece);
                removedOtherUser.put("removedBy", removedBy);
                removedOtherUser.put("removedFrom", movingTo.get(to).get(0));

                removals.add(removedOtherUser);
            }
        }

        // process all legitimate moves on the board
        board.putAll(movingTo);

        // store all moves in database
        this.game.storeMoves(currentRound, nextMoves);

        // create a new empty list of moves
        nextMoves.clear();

        // for every players move that removed another players pieces, award points to that player
        for(Map<String, String> removal: removals){
            // award points to removedBy player
            int pieceWorth = this.pieces.get(removal.get("piece"));
            String winningPlayer = removal.get("removedBy");
            int winningScore = pieceWorth * 2;
            String losingPlayer = removal.get("removedFrom");

            this.game.incrementPlayerScore(winningPlayer, winningScore);
            this.game.decrementPlayerScore(losingPlayer, pieceWorth);
        }

        // decrease board in finishing x amounts of round and decrease players score for pieces removed
        if(currentRound % this.gametype.getCircleShrinkAfterNRounds() == 0){
            // make board smaller

            int topLine = 0;
            int bottomLine = 0;
            int leftLine = 0;
            int rightLine = 0;

            Set<String> tilesToRemove = new HashSet<>();

            for(Map.Entry<String, ArrayList<String>> tile: board.entrySet()){

                int xIndex = Integer.parseInt(tile.getKey().split(":")[0]);
                int yIndex = Integer.parseInt(tile.getKey().split(":")[1]);

                if(topLine == 0 || yIndex < topLine) topLine = yIndex;
                if(bottomLine == 0 || yIndex > bottomLine) bottomLine = yIndex;
                if(leftLine == 0 || xIndex < leftLine) leftLine = xIndex;
                if(rightLine == 0 || xIndex > rightLine) rightLine = xIndex;
            }

            for(Map.Entry<String, ArrayList<String>> tile: board.entrySet()){

                int xIndex = Integer.parseInt(tile.getKey().split(":")[0]);
                int yIndex = Integer.parseInt(tile.getKey().split(":")[1]);

                if(yIndex == topLine && board.containsKey(tile.getKey()) && topLine != bottomLine) tilesToRemove.add(tile.getKey());
                if(yIndex == bottomLine && board.containsKey(tile.getKey()) && topLine != bottomLine) tilesToRemove.add(tile.getKey());
                if(xIndex == leftLine && board.containsKey(tile.getKey()) && leftLine != rightLine) tilesToRemove.add(tile.getKey());
                if(xIndex == rightLine && board.containsKey(tile.getKey()) && leftLine != rightLine) tilesToRemove.add(tile.getKey());
            }

            board.keySet().removeAll(tilesToRemove);
        }

        currentRound++;

        Long finishTime = this.game.getCurrentRoundFinishedAt() + timePerRound;

        this.game.setRound(currentRound);
        this.game.setBoard(board);
        this.game.setCurrentRoundFinishedAt(finishTime);

        // store game in db
        this.gameRepository.save(this.game);

        // if there is only 1 king or 0 kings left end game
        int numberOfKingsAlive = 0;

        for (Map.Entry<String, ArrayList<String>> tile : board.entrySet()) {
            if(tile.getValue().contains("King")){
                numberOfKingsAlive++;
            }
        }

        if(numberOfKingsAlive <= 1) {
            endGame();
        }

        if(numberOfKingsAlive > 1) {

            Timer timer = new Timer();
            timer.schedule(
                    new TimerTask(){

                        @Override
                        public void run(){
                            finishRound();
                            timer.cancel();
                        }
                    }, timePerRound
            );
        }

    }

    public void endGame(){

        // calculate new total scores for players (add this score to their previous scores)

        // setting game on finished
        this.game.setFinished();
        this.game.setGameEndedAt(new Date().getTime());
        this.gameRepository.save(this.game);

        // calculate new average scores for players in user table
        ArrayList<String> players = this.game.getPlayers();
        for(int i = 0; i < players.size(); i++) {
            Optional<User> userOptional = this.userRepository.findById(players.get(i));
            if(userOptional.isPresent()){
                User user = userOptional.get();
                user.setScore(this.game.getScore(i));
                this.userRepository.save(user);
            }
        }

        // orphan Game instance
        this.gamesService.orphanGame(this.gameId);

    }

    public List<String> createPath(String piece, String from, String to, String username, String direction){
        ArrayList<String> path = new ArrayList<>();

        int fromH = Integer.parseInt(from.split(":")[0]);
        int fromV = Integer.parseInt(from.split(":")[1]);
        int toH = Integer.parseInt(to.split(":")[0]);
        int toV = Integer.parseInt(to.split(":")[1]);

        boolean horizontalPath = fromH == toH;
        boolean verticalPath = fromV == toV;
        boolean diagonalPath = fromH - toH == fromV - toV;

        switch (piece){
            case "King":
                path.add(from);
                path.add(to);
                break;
            case "Queen":
                if(horizontalPath){
                    path.add(from);
                    path.add(to);
                }
                if(verticalPath){
                    path.add(from);
                    path.add(to);
                }
                if(diagonalPath){
                    path.add(from);
                    path.add(to);
                }
                break;
            case "Tower":
                if(horizontalPath){
                    path.add(from);
                    path.add(to);
                }
                if(verticalPath){
                    path.add(from);
                    path.add(to);
                }
                break;
            case "Bishop":
                if(diagonalPath){
                    path.add(from);
                    path.add(to);
                }
                break;
            case "Knight":
                if((fromH - toH == 2 || fromH - toH == -2) && (fromV - toV == 1 || fromV - toV == -1)){
                    path.add(from);
                    path.add(to);
                }
                if((fromV - toV == 2 || fromV - toV == -2) && (fromH - toH == 1 || fromH - toH == -1)){
                    path.add(from);
                    path.add(to);
                }
                break;
            case "Pawn":
                if(direction.equals("north")){
                    if(fromH == toH && fromV - toV == 1 && !isTileOccupied(to)){
                        path.add(from);
                        path.add(to);
                    }
                    if((fromH - toH == -1 || fromH - toH == 1) && fromV - toV == 1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
                if(direction.equals("east")){
                    if(fromV == toV && fromH - toH == -1 && !isTileOccupied(to)){
                        path.add(from);
                        path.add(to);
                    }
                    if((fromV - toV == -1 || fromV - toV == 1) && fromH - toH == -1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
                if(direction.equals("south")){
                    if(fromH == toH && fromV - toV == -1 && !isTileOccupied(to)){
                        path.add(from);
                        path.add(to);
                    }
                    if((fromH - toH == -1 || fromH - toH == 1) && fromV - toV == -1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
                if(direction.equals("west")){
                    if(fromV == toV && fromH - toH == 1 && !isTileOccupied(to)){
                        path.add(from);
                        path.add(to);
                    }
                    if((fromV - toV == -1 || fromV - toV == 1) && fromH - toH == 1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
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

    public String getPieceOnTile(String tile){
        return board.get(tile).get(1);
    }

    public String getPlayerOnTile(String tile){
        return board.get(tile).get(0);
    }

    public Boolean isTileOccupied(String tile){
        if(board.containsKey(tile)){
            return board.get(tile).size() != 0;
        }
        return false;
    }

}