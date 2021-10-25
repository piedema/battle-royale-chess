package com.battleroyalechess.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GametypePostRequest {

    private String gametype;
    private int numberOfPlayers;
    private int numberOfRounds;
    private int circleShrinkAfterNRounds;
    private int circleShrinkOffset;
    private int timePerRound;
    private int initialDelay;
    private HashMap<String, ArrayList<String>> board;
    private ArrayList<String> playerDirections;

}