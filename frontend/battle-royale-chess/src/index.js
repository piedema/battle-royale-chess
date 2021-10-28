import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import ServerContextProvider from './contexts/ServerContext'
import AuthenticationContextProvider from './contexts/AuthenticationContext'
import UserContextProvider from './contexts/UserContext'

import reportWebVitals from './reportWebVitals';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
      <UserContextProvider>
          <AuthenticationContextProvider>
              <ServerContextProvider>
                    <App />
            </ServerContextProvider>
        </AuthenticationContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
