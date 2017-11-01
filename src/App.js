import React, { Component } from "react";

import TodoRoot from "./TodoRoot";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="">
        <header className="App">
          <h2>Todo-Inception</h2>
        </header>
        <TodoRoot />
      </div>
    );
  }
}

export default App;
