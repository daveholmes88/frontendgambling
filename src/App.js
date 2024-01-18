import React, { useState, useEffect } from 'react';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Container, Button, TextField } from '@mui/material';
import moment from 'moment'


function App() {
  const [games, setGames] = useState([])
  const [date, setDate] = useState('')

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

  const getGames = () => {
    fetch(`https://www.balldontlie.io/api/v1/games?dates[]=${date}'`)
      .then(resp => resp.json())
      .then(data => {
        const teams = data.data.map(game => {
          const home = game.home_team.name
          const away = game.visitor_team.name
          const gameId = game.id
          return {home: {name: home}, away: {name: away}, gameId}
        })
        setGames(teams)
      })
  }

  const submit = () => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(games)
    };
    fetch('http://localhost:3000/teams', options)
  }

  console.log('games', games)
  return (
    <Container>
      <br></br>
    <FormControl>
    <TextField id="outlined-basic" label="Date" variant="outlined" value={date} onChange={(e) => setDate(e.target.value)} />
    <Button onClick={getGames} variant='outlined'>Go</Button>
      {games.map(game => {
        return <FormGroup>
          {insertCheckboxes(game, 'home')}
          {insertCheckboxes(game, 'away')}
          <p>_____________________________________________</p>
          <br></br>
        </FormGroup>
      })}
      <Button onClick={submit} variant='outlined'>Submit</Button>
    </FormControl>
    </Container>
  )
}

export default App;
