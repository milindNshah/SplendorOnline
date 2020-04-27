import React from 'react';
import { render } from 'react-dom';
import WelcomeComponent from './components/WelcomeComponent.jsx';
import RoomGameComponent from './components/RoomGameComponent.jsx';
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
          <Route exact path='/' component={WelcomeComponent}/>
          <Route path='/room' component={RoomGameComponent}/>
        </Switch>
    );
  }
}

render(<Router><AppComponent/></Router>, document.getElementById('app'));
