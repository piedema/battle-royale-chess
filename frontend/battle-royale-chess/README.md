# Battle Royale Chess
## Chess, but better

Battle Royale Chess is a game designed to take chess to the next level. It features chess piece movement but with some additional rules on an ever decreasing gameboard size. Pieces will need to move to the middle to survive and the last King standing takes the win!

<img src="markdownmonstericon.png"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px;" />


## Necessities


## Installation

##### Frontend

- Battle Royale Chess requires NodeJS to run.
- The frontend will run on [localhost:3000]
- Make sure the backend runs as well as an instance of postgreSQL.
- Installation for the backend is written below.

```sh
    npm install                 // to install npm packages
    npm start                   // to start the development server
```



##### Backend

- The backend will run on [localhost:8080]
- The backend requires an active postgreSQL server to run
- The postgreSQL server url, username and password should match the specified url, username and password in the application.properties file
- De database name should match 'battleroyalechess'
- On every run the database tables are dropped and recreated with fresh data. This behaviour can be changed to not dropping and recreating by setting spring.profiles.active to production in the application.properties file. spring.profiles.active=development recreates the tables on every run
- This fresh data comes from the 'Populate' files in the config folder

```sh
    to run the backend, open IntelliJ, load the project and press 'run'
```




## Credentials

The following credentials can be used to log in to Battle Royale Chess frontend
| Username | Password |  Role  |
| ------ | ------ | ------ |
| admin | password1 | admin |
| peter | password1 | user |
| bart | password1 | user |
| robin | password1 | user |
| laurens | password1 | user |
| maaike | password1 | user |




## API endpoints




## NPM commandos

The following table contains some npm commandos and their actions
| Name | Commando | Action |
| ------ | ------ | ------ |
| start | `react-scripts start` | Start an instance of the delopment server to view the application in the browser
| build | `react-scripts build` | Build the application to the build folder to host on a production server
| test | `npx jest` | Run unit tests with Jest
| test:watch | `npx jest --watch` | Automatically run unit tests on every file change
| eject | `react-scripts eject` | Eject will copy all dependencies and configuration files into the project. It can be used to edit the current react configuration. This is a one way operation.

[localhost:3000]: <http://localhost:3000>
[localhost:8080]: <http://localhost:8080>
