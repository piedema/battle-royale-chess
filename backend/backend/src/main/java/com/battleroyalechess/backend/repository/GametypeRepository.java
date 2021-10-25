package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.Gametype;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface GametypeRepository extends JpaRepository<Gametype, String> {

    ArrayList<String> findPlayerDirectionsByGametype(String gametype);
    //ArrayList<String> getPlayerDirections();
    //String getPlayerDirections(int index);
    //void setPlayerDirections(ArrayList<String> playerDirections);

}