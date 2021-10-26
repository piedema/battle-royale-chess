package com.battleroyalechess.backend.config;

import org.springframework.stereotype.Component;

@Component
public class JwtSecret {

    private static String key;

    public JwtSecret(){

        key = "qd7978tWhZbtnM80LC24";

    }

    public static String getKey(){

        return key;

    }
}
