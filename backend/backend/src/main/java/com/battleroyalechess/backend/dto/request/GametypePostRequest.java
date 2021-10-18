package com.battleroyalechess.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GametypePostRequest {

    private String name;
    private int numberOfPlayers;
    private int numberOfRounds;
    private int circleShrinkAfterNRounds;
    private int circleShrinkOffset;
    private ArrayList<String> board;

}