import React from 'react';
import { render } from 'react-dom';
import {createGlobalStyle} from "styled-components";
import WebFont from 'webfontloader';
import Home from './components/Home.jsx';
import WaitingRoom from './components/WaitingRoom.jsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

WebFont.load({
  google: {
    families: ['Raleway:300,400', 'sans-serif']
  }
});

import 'font-awesome/css/font-awesome.min.css'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Raleway', sans-serif;
  }
`;

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <GlobalStyle/>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/room' component={WaitingRoom}/>
        </Switch>
      </div>
    );
  }
}

render(<Router><AppComponent/></Router>, document.getElementById('app'));
