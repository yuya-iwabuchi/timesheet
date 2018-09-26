import React, { Component } from 'react';
import './App.scss';

import ApiKeyComponent from './components/ApiKeyComponent';
import WeekComponent from './components/WeekComponent';

class AppComponent extends Component {
  constructor() {
    super();

    this.state = {
      todoItems: null,
    }

    this.setTodoItems = this.setTodoItems.bind(this);
  }

  setTodoItems(todoItems) {
    this.setState({ todoItems });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-light bg-quaternary">
          <span className="navbar-brand mb-0 h1 text-light">Timesheet</span>
        </nav>
        <main className="container border mt-5">
          <ApiKeyComponent setTodoItems={this.setTodoItems} />
        </main>
        {
          this.state.todoItems !== null
          ? (
            <section className="container border mt-5">
              <WeekComponent todoItems={this.state.todoItems} />
            </section>
          ) : null
        }
      </div>
    );
  }
}

  export default AppComponent;
