package com.battleroyalechess.backend.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.IntStream;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, length = 80)
    private String password;

    @Column()
    private String chessCom;

    @Column()
    private Boolean enabled;

    @Column(unique = true)
    private String email;

    @Column
    private Integer score = 0;

    @Column
    private Integer gamesPlayed = 0;

    @Column
    private final ArrayList<Integer> scores = new ArrayList<>();

    @OneToMany(
            targetEntity = Authority.class,
            mappedBy = "username",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER)
    private final Set<Authority> authorities = new HashSet<>();

    public String getUsername() { return username; }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getChessCom() { return chessCom; }
    public void setChessCom(String chessCom) {
        this.chessCom = chessCom;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Boolean getEnabled() { return enabled;}

    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email;}

    public Integer getGamesPlayed() {
        return gamesPlayed;
    }

    public void increaseGamesPlayed() {
        this.gamesPlayed++;
    }

    public ArrayList<Integer> getScores() {
        return scores;
    }

    public Set<Authority> getAuthorities() { return authorities; }

//    public void setAuthorities(Set<Authority> authorities) {
//        for(Authority authority: authorities){
//            addAuthority(authority);
//        }
//    }

    public void setAuthorities(Set<String> authorities) {
        for(String authority: authorities){
            addAuthority(authority);
        }
    }

    public void addAuthority(Authority authority) {
        this.authorities.add(authority);
    }

    public void addAuthority(String authorityString) {
        this.authorities.add(new Authority(this.username, authorityString));
    }
    public void removeAuthority(Authority authority) {
        this.authorities.remove(authority);
    }

    public void removeAuthority(String authorityString) {
        this.authorities.removeIf(authority -> authority.getAuthority().equalsIgnoreCase(authorityString));
    }

    public Integer getScore(){
        return score;
    }

    public void setScore(int points){
        if(this.scores.size() == 50) this.scores.remove(0);
        this.scores.add(points);

        int sum = 0;

        for (Integer integer : this.scores) {
            sum += integer;
        }

        this.score = sum / this.scores.size();
    }

}