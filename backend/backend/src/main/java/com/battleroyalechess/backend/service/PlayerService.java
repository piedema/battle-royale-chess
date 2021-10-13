package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.exception.RecordNotFoundException;
import com.battleroyalechess.backend.model.Player;
import com.battleroyalechess.backend.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlayerService {

    private PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository){
        this.playerRepository = playerRepository;
    }

    public Iterable<Player> findAll(){

        Iterable<Player> players = playerRepository.findAll();

        return players;

    }

    public Player findById(long id){

        Optional<Player> player = playerRepository.findById(id);

        if(player.isPresent()){

            return player.get();
        }
        else{

            throw new RecordNotFoundException();

        }

    }

    public long save(Player player){

        Player newPlayer = playerRepository.save(player);

        return newPlayer.getId();

    }

    public void deleteById(long id){

        if(!playerRepository.existsById(id)){

            throw new RecordNotFoundException();

        }

        playerRepository.deleteById(id);

    }

    public void updateById(long id, Player updatedPlayer){

        if(!playerRepository.existsById(id)){

            throw new RecordNotFoundException();

        }

        Player player = playerRepository.findById(id).get();

        player.setUsername(updatedPlayer.getUsername());
        player.setEmailaddress(updatedPlayer.getEmailaddress());

        playerRepository.save(player);

    }

    public Iterable<Player> findByUsername(String username){

        Iterable<Player> players = playerRepository.findByUsername(username);

        return players;

    }

    public Iterable<Player> findByEmailaddress(String emailaddress){

        Iterable<Player> players = playerRepository.findByEmailaddress(emailaddress);

        return players;

    }
}
