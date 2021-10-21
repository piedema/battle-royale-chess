package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {

    Iterable <Game> findByFinished(Boolean finished);

}