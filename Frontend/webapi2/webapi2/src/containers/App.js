import React from 'react';
import './App.css';
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import Navigation from '../components/Navigation/Navigation'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  return ( 
    <BrowserRouter>
      <div>
        <Switch>
          <Route path = "/" component = {Home} exact />
          <Route path = "/Login" component = {Login} />
        </Switch>
      </div>
      </BrowserRouter>
  );
}

export default App;
