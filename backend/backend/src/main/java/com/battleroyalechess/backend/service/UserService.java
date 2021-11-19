package com.battleroyalechess.backend.service;

import com.battleroyalechess.backend.exception.*;
import com.battleroyalechess.backend.model.Authority;
import com.battleroyalechess.backend.model.User;
import com.battleroyalechess.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String getCurrentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }

    public Collection<User> getUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUser() {

        String username = getCurrentUserName();

        Optional<User> userOptional = userRepository.findById(username);

        if (userOptional.isEmpty()) {
            throw new UserNotFoundException(username);
        }

        return userOptional;
    }

    public Optional<User> getUser(String username) {

        String ownUsername = getCurrentUserName();

        Set<Authority> authorities = getAuthorities(ownUsername);

        Optional<User> userOptional = Optional.empty();

        for(Authority authority : authorities){
            if(authority.getAuthority().equals("ROLE_ADMIN")){

                userOptional = userRepository.findById(username);

                if (userOptional.isEmpty()) {
                    throw new UserNotFoundException(username);
                }

            }
        }

        return userOptional;
    }

    public boolean userExists(String username) {
        return userRepository.existsById(username);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public void deleteUser() {
        String currentUserName = getCurrentUserName();
        deleteUser(currentUserName);
    }

    public void deleteUser(String username) {
        if (userExists(username)) userRepository.deleteById(username);
        else throw new UserNotFoundException(username);
    }

    public void updateUser(User newUser) {

        System.out.println("updateUser " + newUser);

        /// to check later: password does not seem to be changed on update

        String email = newUser.getEmail();
        String password = newUser.getPassword();

        Optional<User> userWithThisEmailOptional = userRepository.findByEmail(email);

        String currentUserName = getCurrentUserName();

        System.out.println("updateUser2 " + email);
        System.out.println("updateUser2 " + password);
        System.out.println("updateUser2 " + userWithThisEmailOptional);
        System.out.println("updateUser2 " + currentUserName);

        if(userWithThisEmailOptional.isPresent()){

            String otherUserUsername = userWithThisEmailOptional.get().getUsername();

            if(!currentUserName.equals(otherUserUsername)){

                throw new EmailNotAvailableException(email);

            }

        }

        System.out.println("updateUser3 " + password);

        if(!password.isEmpty()){

            setPassword(password);

        }

        Optional<User> userOptional = userRepository.findById(currentUserName);

        System.out.println("updateUser4 " + userOptional.get());

        if(userOptional.isPresent()) {

            User user = userOptional.get();

            System.out.println("updateUser5 " + user);

            if (!email.isEmpty()) {

                user.setEmail(email);

            }

            System.out.println("updateUser6 " + user);

            userRepository.save(user);

        }

    }

    public Set<Authority> getAuthorities(String username) {
        Optional<User> userOptional = userRepository.findById(username);
        if (userOptional.isEmpty())  throw new UserNotFoundException(username);
        else {
            User user = userOptional.get();
            return user.getAuthorities();
        }
    }

    public void addAuthority(String username, Authority authority) {
        try {
            Optional<User> userOptional = userRepository.findById(username);
            if (userOptional.isEmpty()) throw new UserNotFoundException(username);
            else {
                User user = userOptional.get();
                user.addAuthority(authority.getAuthority());
                userRepository.save(user);
            }
        }
        catch (Exception ex) {

            throw new BadRequestException("Cannot add authority");

        }
    }

    public void removeAuthority(String username, String authority) {
        try {
            Optional<User> userOptional = userRepository.findById(username);
            if (userOptional.isEmpty()) throw new UserNotFoundException(username);
            else {
                User user = userOptional.get();
                user.removeAuthority(authority);
                userRepository.save(user);
            }
        }
        catch (Exception ex) {

            throw new BadRequestException("Cannot add authority");

        }
    }
    
    private boolean isValidPassword(String password) {
        final int MIN_LENGTH = 8;
        final int MIN_DIGITS = 1;
        final int MIN_LOWER = 1;
        final int MIN_UPPER = 1;
        final int MIN_SPECIAL = 1;
        final String SPECIAL_CHARS = "@#$%&*!()+=-_";

        long countDigit = password.chars().filter(ch -> ch >= '0' && ch <= '9').count();
        long countLower = password.chars().filter(ch -> ch >= 'a' && ch <= 'z').count();
        long countUpper = password.chars().filter(ch -> ch >= 'A' && ch <= 'Z').count();
        long countSpecial = password.chars().filter(ch -> SPECIAL_CHARS.indexOf(ch) >= 0).count();

        boolean validPassword = true;
        if (password.length() < MIN_LENGTH) validPassword = false;
        if (countLower < MIN_LOWER) validPassword = false;
        if (countUpper < MIN_UPPER) validPassword = false;
        if (countDigit < MIN_DIGITS) validPassword = false;
        if (countSpecial < MIN_SPECIAL) validPassword = false;

        return validPassword;
    }

    public void setPassword(String password) {

        String currentUserName = getCurrentUserName();
        setPassword(currentUserName, password);

    }

    public void setPassword(String username, String password) {
        if (isValidPassword(password)) {
            Optional<User> userOptional = userRepository.findById(username);
            if (userOptional.isPresent()) {
                System.out.println("test " + password);
                User user = userOptional.get();
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
            }
            else {
                throw new UserNotFoundException(username);
            }
        }
        else {
            throw new InvalidPasswordException();
        }
    }

}