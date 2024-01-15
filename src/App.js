import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { FormControl } from '@mui/material';


function App() {
  const [games, setGames] = useState([])
  useEffect(() => {
    fetch(`https://www.balldontlie.io/api/v1/games?dates[]='2024-01-14'`)
      .then(resp => resp.json())
      .then(data => {
        const teams = data.data.map(game => {
          const home = game.home_team.name
          const away = game.visitor_team.name
          const gameId = game.id
          return {home, away, gameId}
        })
        setGames(teams)
      })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
