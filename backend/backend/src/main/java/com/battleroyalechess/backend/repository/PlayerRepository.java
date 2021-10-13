package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.Player;
import org.springframework.data.repository.CrudRepository;

public interface PlayerRepository extends CrudRepository<Player, Long> {

    Iterable<Player> findByUsername(String username);
    Iterable<Player> findByEmailaddress(String emailaddress);
}
