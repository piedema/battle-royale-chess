package com.battleroyalechess.backend.model;

import com.battleroyalechess.backend.exception.InvalidAuthorityException;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Arrays;

@Entity
@IdClass(AuthorityKey.class)
@Table(name = "authorities")
public class Authority implements Serializable {

    @Id
    @Column(nullable = false)
    private String username;

    @Id
    @Column(nullable = false)
    private String authority;

    public static final String[] availableAuthorities = new String[] { "ROLE_ADMIN", "ROLE_USER" };

    public Authority() {}
    public Authority(String username, String authority) {
        if(authorityExists(authority)) {
            this.username = username;
            this.authority = authority;
        }
    }

    public Boolean authorityExists(String authorityString){
        if(!Arrays.toString(availableAuthorities).contains(authorityString)) throw new InvalidAuthorityException(authorityString);
        return true;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getAuthority() {
        return authority;
    }
    public void setAuthority(String authority) {
        if(authorityExists(authority)) {
            this.authority = authority;
        }
    }

}