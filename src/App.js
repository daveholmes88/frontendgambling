import React, { useState, useEffect } from 'react';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Container, Button, TextField } from '@mui/material';
import moment from 'moment'


function App() {
  const [games, setGames] = useState([]);
  const [date, setDate] = useState('');
  const [today, setToday] = useState(true);
  const [data, setData] = useState([0]);

  useEffect(() => {
    const d = moment()
    setDate(d.format('YYYY-MM-DD'))
  }, [])

  const scoredClicked = (event, game, team) => {
    const newGames = [...games]
    const index = games.findIndex(g => g.home.name === game.home.name)
    game[team].scored = event.target.checked;
    newGames[index] = game
    setGames(newGames)
  }

  const insertCheckboxes = (game, team) => {
    return <>
      <h4>{game[team].name}</h4>
      <FormControlLabel control={<Checkbox onChange={(event) => scoredClicked(event, game, team)}/>} label="Scored" />
    </>;
  }

  const getGames = async () => {
    const dateResp = await fetch(`https://www.balldontlie.io/api/v1/games?dates[]=${date}'`)
    const gameData = await dateResp.json()
    const games = gameData.data
    const teams = games.map(game => {
      const home = game.home_team.name
      const away = game.visitor_team.name
      const gameId = game.id
      return {home: {name: home}, away: {name: away}, gameId}
    })
    const notPlayed = games[0].home_team_score === 0
    const gamesData = []
    if (notPlayed) {
      const teamResp = await fetch('http://localhost:3000/teams')
      const teamData = await teamResp.json()
      teamData.forEach(gameData => {
        const playingToday = teams.find(team => team.home.name === gameData.name || team.away.name === gameData.name)
        if (playingToday) gamesData.push(gameData)
      })
    }
        setToday(notPlayed)
        setGames(teams)
        setData(gamesData)
  }

  const submit = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(games)
    };
    fetch('http://localhost:3000/teams', options)
  }

  const showData = () => {
    return games.map(game => {
      const home = data.find(team => game.home.name === team.name);
      const away = data.find(team => game.away.name === team.name);
      const homeScore = (home.off_score/home.games_played + away.def_score/away.games_played) / 2;
      const awayScore = (home.def_score/home.games_played + away.off_score/away.games_played) / 2;
      return <>
      <h4>{home.name}: Offense: {homeScore.toFixed(2)}</h4>
      <h4>{away.name}: Offense: {awayScore.toFixed(2)}</h4>
      <p>_____________________________________________</p>
      <br></br>
      </>;
    })
  }
  return (
    <Container>
      <br></br>
    <FormControl>
    <TextField id="outlined-basic" label="Date" variant="outlined" value={date} onChange={(e) => setDate(e.target.value)} />
    <Button onClick={getGames} variant='outlined'>Go</Button>
      {today ? showData() : <>
      {games.map(game => {
        return <FormGroup>
          {insertCheckboxes(game, 'home')}
          {insertCheckboxes(game, 'away')}
          <p>_____________________________________________</p>
          <br></br>
        </FormGroup>
      })}
      <Button onClick={submit} variant='outlined'>Submit</Button>
      </>}
    </FormControl>
    </Container>
  )
}

export default App;
