package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface GameRepository extends JpaRepository<Game, Long> {

    Iterable <Game> findByFinished(Boolean finished);
    ArrayList<String> findPlayersByGameId(Long gameId);
    //String getDirections(int index);
    //void incrementPlayerScore(String username, int points);
    //void decrementPlayerScore(String username, int points);

}