package com.battleroyalechess.backend.repository;

import com.battleroyalechess.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}