package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {

    Iterable <Game> findByFinished(Boolean finished);

}