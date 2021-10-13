
-- PLAYER TABLE
DROP TABLE IF EXISTS players;

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username VARCHAR (32) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    emailaddress VARCHAR(255) UNIQUE,
    enabled BOOLEAN NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP
);

INSERT INTO players (username, password, emailaddress, enabled)
VALUES ('peter', '{noop}password', 'piedema@gmail.com', true),
        ('peterA', '{noop}password', 'peter@anema.com', true),
        ('Mentor', '{noop}password', 'mentor@gmail.com', true);


-- AUTHORITY TABLE
DROP TABLE IF EXISTS authorities;

CREATE TABLE authorities (
    username VARCHAR(32),
    authority VARCHAR(32),
    PRIMARY KEY (username, authority)
);

INSERT INTO authorities (username, authority)
VALUES ('peter', 'ROLE_PLAYER'),
        ('peterA', 'ROLE_ADMIN'),
        ('peterA', 'ROLE_PLAYER');