package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.Gametype;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GametypeRepository extends JpaRepository<Gametype, String> {

    String getPlayerDirection(int id);

}