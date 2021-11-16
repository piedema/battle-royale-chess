package com.battleroyalechess.backend.gameEngine;

import com.battleroyalechess.backend.dto.request.NewMovePostRequest;
import com.battleroyalechess.backend.dto.response.CancelMoveResponse;
import com.battleroyalechess.backend.dto.response.NewMoveResponse;
import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.model.Gametype;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.GameRepository;
import com.battleroyalechess.backend.repository.GametypeRepository;
import com.battleroyalechess.backend.repository.UserRepository;
import com.battleroyalechess.backend.service.GamesService;
import com.battleroyalechess.backend.service.UserService;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GameEngine {

    private Game game;
    private Gametype gametype;
    private Long gameId;
    private Boolean hasGameStarted = false;
    private HashMap<String, ArrayList<String>> board = new HashMap<>();
    private final Map<String, String> nextMoves = new HashMap<>();
    private GamesService gamesService;
    private final Map<String, Integer> pieces = new HashMap<>();
    private int currentRound = 0;
    private int timePerRound;

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

        int initialDelay = this.gametype.getInitialDelay() * 1000;
        this.timePerRound = this.gametype.getTimePerRound() * 1000;

        Game game = new Game();
        game.setGametype(gametype);
        game.setPlayers(players);
        game.setBoard(this.board);
        game.setGameStartedAt(new Date().getTime());
        game.setNextRoundAt(new Date().getTime() + initialDelay);

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

    public Boolean hasGameStarted(){
        return this.hasGameStarted;
    }

    public void startGame(){
        this.hasGameStarted = true;

        currentRound = 1;
        game.setRound(currentRound);
        game.setNextRoundAt(new Date().getTime() + timePerRound);
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
        // if 2 pieces move to the same tile the weakest gets removed. If there are multiple of same value they all get removed
        ArrayList<Map<String, String>> removals = new ArrayList<>();
        Map<String, ArrayList<String>> movingTo = new HashMap<>();

        for (Map.Entry<String, String> move : nextMoves.entrySet()) {

            String from = move.getValue().split(">")[0];
            String to = move.getValue().split(">")[1];
            String movingPlayer = move.getKey();
            String piece = getPieceOnTile(from);

            // processing moving to occupied tile
            if(isTileOccupied(to)){
                String occupiedPiece = getPieceOnTile(to);
                String removedFrom = getPlayerOnTile(to);
                Map<String, String> removed = new HashMap<>();
                removed.put("tile", to);
                removed.put("piece", occupiedPiece);
                removed.put("removedBy", movingPlayer);
                removed.put("removedFrom", removedFrom);
                removals.add(removed);
            }

            // if moved piece would have been removed from tile it was on, remove that removal since it moved
            removals.removeIf(removal -> removal.get("tile").equals(from));

            // if there isnt any move planned to new tile yet then queue this move
            if(!movingTo.containsKey(to)){
                ArrayList<String> details = new ArrayList<>();
                details.add(movingPlayer);
                details.add(from);
                details.add(piece);
                movingTo.put(to, details);
            }

            // processing multiple moves to same tile where own move has better piece than other persons moved piece.
            // also works if multiple people go to same tile but it always has to check against last approved piece

            if(!movingTo.get(to).get(0).equals(movingPlayer) && this.pieces.get(piece) > this.pieces.get(movingTo.get(to).get(2))){
                ArrayList<String> details = new ArrayList<>();
                details.add(movingPlayer);
                details.add(from);

                Map<String, String> removed = new HashMap<>();
                removed.put("tile", to);
                removed.put("piece", movingTo.get(to).get(1));
                removed.put("removedBy", movingPlayer);
                removed.put("removedFrom", movingTo.get(to).get(0));

                removals.add(removed);
                movingTo.put(to, details);
            }

            // processing multiple moves to same tile where other piece has better piece then current players move
            if(!movingTo.get(to).get(0).equals(movingPlayer) && this.pieces.get(piece) < this.pieces.get(movingTo.get(to).get(1))){

                Map<String, String> removed = new HashMap<>();
                removed.put("tile", to);
                removed.put("piece", piece);
                removed.put("removedBy", movingTo.get(to).get(0));
                removed.put("removedFrom", movingPlayer);

                removals.add(removed);
            }

            // processing multiple moves to same tile where both pieces are of same worth
            if(!movingTo.get(to).get(0).equals(movingPlayer) && this.pieces.get(piece).equals(this.pieces.get(movingTo.get(to).get(1)))){

                Map<String, String> removedCurrentUser = new HashMap<>();
                removedCurrentUser.put("tile", to);
                removedCurrentUser.put("piece", piece);
                removedCurrentUser.put("removedBy", movingTo.get(to).get(0));
                removedCurrentUser.put("removedFrom", movingPlayer);

                removals.add(removedCurrentUser);

                Map<String, String> removedOtherUser = new HashMap<>();
                removedOtherUser.put("tile", to);
                removedOtherUser.put("piece", movingTo.get(to).get(1));
                removedOtherUser.put("removedBy", movingPlayer);
                removedOtherUser.put("removedFrom", movingTo.get(to).get(0));

                removals.add(removedOtherUser);
            }

        }

        // remove all removed positions from board
        for (Map<String, String> removal : removals) {
            ArrayList<String> tileAfterRemoval = new ArrayList<>();
            tileAfterRemoval.add("normal");
            board.put(removal.get("tile"), tileAfterRemoval);
        }

        // move all pieces to new position on board
        for (Map.Entry<String, ArrayList<String>> move : movingTo.entrySet()) {
            String from = move.getValue().get(1);
            String to = move.getKey();

            ArrayList<String> fromBoard = board.get(from);
            ArrayList<String> toBoard = board.get(to);

            board.put(to, fromBoard);
            board.put(from, toBoard);
        }

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
        if(currentRound % this.gametype.getCircleShrinkAfterNRounds() == 0 && currentRound > this.gametype.getCircleShrinkOffset()){
            // make board smaller

            int topLine = 0;
            int bottomLine = 0;
            int leftLine = 0;
            int rightLine = 0;

            for(Map.Entry<String, ArrayList<String>> tile: board.entrySet()){

                if(tile.getValue().get(0).equals("faded")) continue;

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

                if(yIndex == topLine && board.containsKey(tile.getKey()) && topLine != bottomLine) tile.getValue().set(0, "faded");
                if(yIndex == bottomLine && board.containsKey(tile.getKey()) && topLine != bottomLine) tile.getValue().set(0, "faded");
                if(xIndex == leftLine && board.containsKey(tile.getKey()) && leftLine != rightLine) tile.getValue().set(0, "faded");
                if(xIndex == rightLine && board.containsKey(tile.getKey()) && leftLine != rightLine) tile.getValue().set(0, "faded");
            }
        }

        this.game.setBoard(board);

        // if there is only 1 king or 0 kings left end game
        int numberOfKingsAlive = 0;

        for (Map.Entry<String, ArrayList<String>> tile : board.entrySet()) {
            if(tile.getValue().contains("King") && tile.getValue().contains("normal")){
                numberOfKingsAlive++;
            }
        }

        if(numberOfKingsAlive <= 1) {
            endGame();
        }

        if(numberOfKingsAlive > 1) {

            this.game.setRound(++currentRound);
            this.game.setNextRoundAt(new Date().getTime() + timePerRound);

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

        // store game in db
        this.gameRepository.save(this.game);

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

    public NewMoveResponse newMove(NewMovePostRequest newMovePostRequest){

        if(!hasGameStarted()) return new NewMoveResponse(false, "Game has not started yet");

        String username = this.userService.getCurrentUserName();
        String from = newMovePostRequest.getFrom();
        String to = newMovePostRequest.getTo();

        // check if players king is still alive
        boolean isKingAlive = false;
        int playerIndex = this.game.players.indexOf(username);
        for (Map.Entry<String, ArrayList<String>> tile : board.entrySet()) {
            if (tile.getValue().contains(String.valueOf(playerIndex + 1)) && tile.getValue().contains("King")) {
                isKingAlive = true;
                break;
            }
        }

        // exit if king is not alive
        if(!isKingAlive) return new NewMoveResponse(false, "King is not alive");

        // create list with path for piece. list must be empty if path is not possible, then return
        String piece = board.get(from).get(2);
        String direction = this.gametype.playerDirections.get(playerIndex);
        List<String> path = buildPath(piece, from, to, username, direction);

        // if path list is empty then there was no legal path found, then discard move
        if(path.size() == 0) return new NewMoveResponse(false,"Path is not valid");

        // check if whole path are tiles
        if(!isWholePathTiles(path)){
            return new NewMoveResponse(false,"Not whole path is tiles");
        }

        // check if there are no interuptions (other pieces) in the path. this does not count for knight
        if(!piece.equals("Knight") && isPathBlocked(path)){
            return new NewMoveResponse(false,"Path is blocked");
        }

        // store move locally. at end of round moves are stored in db. Not before, so other users cant see move before end of round
        String currentMove = from + ">" + to;

        // if user already has a move registered for this round, throw away old move
        nextMoves.remove(username);

        nextMoves.put(username, currentMove);

        return new NewMoveResponse(true,"Move successfully queued");
    }

    public CancelMoveResponse cancelMove(String username){

        nextMoves.remove(username);

        return new CancelMoveResponse(true,"Move successfully removed");
    }

    public List<String> buildPath(String piece, String from, String to, String username, String direction){
        ArrayList<String> path = new ArrayList<>();

        int fromH = Integer.parseInt(from.split(":")[1]);
        int fromV = Integer.parseInt(from.split(":")[0]);
        int toH = Integer.parseInt(to.split(":")[1]);
        int toV = Integer.parseInt(to.split(":")[0]);

        boolean horizontalPath = fromV == toV;
        boolean verticalPath = fromH == toH;
        boolean diagonalPath = Math.abs(fromH - toH) == Math.abs(fromV - toV);

        switch (piece){
            case "King":
                path.add(from);
                path.add(to);
                break;
            case "Queen":
                if(horizontalPath){
                    path.addAll(createPath(from, to, "horizontal"));
                }
                if(verticalPath){
                    path.addAll(createPath(from, to, "vertical"));
                }
                if(diagonalPath){
                    path.addAll(createPath(from, to, "diagonal"));
                }
                break;
            case "Tower":
                if(horizontalPath){
                    path.addAll(createPath(from, to, "horizontal"));
                }
                if(verticalPath){
                    path.addAll(createPath(from, to, "vertical"));
                }
                break;
            case "Bishop":
                if(diagonalPath){
                    path.addAll(createPath(from, to, "diagonal"));
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
                    if(Math.abs(fromH - toH) == 1 && fromV - toV == 1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
                if(direction.equals("east")){
                    if(fromV == toV && fromH - toH == -1 && !isTileOccupied(to)){
                        path.add(from);
                        path.add(to);
                    }
                    if(Math.abs(fromV - toV) == 1 && fromH - toH == -1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
                if(direction.equals("south")){
                    if(fromH == toH && fromV - toV == -1 && !isTileOccupied(to)){
                        path.add(from);
                        path.add(to);
                    }
                    if(Math.abs(fromH - toH) == 1 && fromV - toV == -1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
                if(direction.equals("west")){
                    if(fromV == toV && fromH - toH == 1 && !isTileOccupied(to)){
                        path.add(from);
                        path.add(to);
                    }
                    if(Math.abs(fromV - toV) == 1 && fromH - toH == 1 && isTileOccupied(to) && !getPlayerOnTile(to).equals(username)){
                        path.add(from);
                        path.add(to);
                    }
                }
                break;
        }

        return path;
    }

    public List<String> createPath(String from, String to, String pathType){

        ArrayList<String> path = new ArrayList<>();

        int fromH = Integer.parseInt(from.split(":")[1]);
        int fromV = Integer.parseInt(from.split(":")[0]);
        int toH = Integer.parseInt(to.split(":")[1]);
        int toV = Integer.parseInt(to.split(":")[0]);

        if(pathType.equals("horizontal")){
            if(fromH < toH) {
                for (int i = fromH; i <= toH; i++) {
                    path.add(fromV + ":" + i);
                }
            }
            if(fromH > toH) {
                for (int i = fromH; i >= toH; i--) {
                    path.add(fromV + ":" + i);
                }
            }
        }

        if(pathType.equals("vertical")){
            if(fromV < toV) {
                for (int i = fromV; i <= toV; i++) {
                    path.add(i + ":" + fromH);
                }
            }
            if(fromV > toV) {
                for (int i = fromV; i >= toV; i--) {
                    path.add(i + ":" + fromH);
                }
            }
        }

        if(pathType.equals("diagonal")){
            if(fromH < toH && fromV < toV) {
                for (int i = fromH, j = fromV; i <= toH; i++, j++) {
                    path.add(j + ":" + i);
                }
            }
            if(fromH > toH && fromV < toV) {
                for (int i = fromH, j = fromV; i >= toH; i--, j++) {
                    path.add(j + ":" + i);
                }
            }
            if(fromH < toH && fromV > toV) {
                for (int i = fromH, j = fromV; i <= toH; i++, j--) {
                    path.add(j + ":" + i);
                }
            }
            if(fromH > toH && fromV > toV) {
                for (int i = fromH, j = fromV; i >= toH; i--, j--) {
                    path.add(j + ":" + i);
                }
            }
        }

        return path;

    }

    public Boolean isWholePathTiles(List<String> path){
        for(String tile: path){
            if(!board.containsKey(tile) || !board.get(tile).get(0).equals("normal")){
                return false;
            }
        }
        return true;
    }

    public Boolean isPathBlocked(List<String> path){

        // piece moves only 1 tile, so path cant be blocked
        if(path.size() == 2) return false;

        String from = path.get(0);
        String to = path.get(path.size() - 1);

        for(String tile: path){
            // tile is not starting or finishing tile and has a piece so therefor is blocking
            if(!tile.equals(from) && !tile.equals(to) && board.get(tile).size() > 1){
                return true;
            }
        }
        return false;
    }

    public String getPieceOnTile(String tile){
        return board.get(tile).get(2);
    }

    public String getPlayerOnTile(String tile){
        int playerIndex = Integer.parseInt(board.get(tile).get(1));
        return this.game.getPlayers().get(playerIndex - 1);
    }

    public Boolean isTileOccupied(String tile){
        if(board.containsKey(tile)){
            return board.get(tile).size() > 1;
        }
        return false;
    }

}