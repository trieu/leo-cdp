import React, { Component } from 'react';
import { color } from './styles/app.css';
import { font } from './styles/app1.scss';

export default class App extends Component {
  render() {
    return (
      <h1 className={[color, font].join(' ')}>Hello, world.</h1>
    );
  }
}
