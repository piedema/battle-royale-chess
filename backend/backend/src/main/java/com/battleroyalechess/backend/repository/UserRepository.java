package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.Game;
import com.battleroyalechess.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}