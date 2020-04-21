import React from 'react';
import { render } from 'react-dom';
import WelcomeComponent from './WelcomeComponent.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

render(<WelcomeComponent/>, document.getElementById('app'));
