import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import My_navbar from './things/nav/navbar.js';
import Sp_game from './things/sp_game/sp_game.js';
import './App.css';

function App() {
  return (
    <Router>
      <My_navbar></My_navbar>

      <Switch>
        <Route path='/sp'>
          <Sp_game></Sp_game>
        </Route>  
      </Switch>
      
    </Router>
  );
}

export default App;