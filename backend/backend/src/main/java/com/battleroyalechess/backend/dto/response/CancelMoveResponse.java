package com.battleroyalechess.backend.dto.response;

public class CancelMoveResponse {

        private final Boolean success;
        private final String message;

        public CancelMoveResponse(Boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public Boolean getSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

    }
