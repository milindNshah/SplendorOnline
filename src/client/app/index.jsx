import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home.jsx';
import WaitingRoom from './components/WaitingRoom.jsx';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'

class AppComponent extends React.Component {
  render() {
    return (
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/room' component={WaitingRoom}/>
        </Switch>
    );
  }
}

render(<Router><AppComponent/></Router>, document.getElementById('app'));
