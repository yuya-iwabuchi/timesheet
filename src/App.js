import React, { Component } from 'react';
import './App.scss';

import ApiKeyComponent from './components/ApiKeyComponent';
import WeekComponent from './components/WeekComponent';

class AppComponent extends Component {
  constructor() {
    super();

    this.state = {
      apiKey: null,
      todoItems: null,
      account: null,
    }

    this.setApiKey = this.setApiKey.bind(this);
    this.setTodoItems = this.setTodoItems.bind(this);
    this.setAccount = this.setAccount.bind(this);
  }

  setApiKey(apiKey) {
    this.setState({ apiKey });
  }

  setTodoItems(todoItems) {
    this.setState({ todoItems });
  }

  setAccount(account) {
    this.setState({ account });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-light bg-quaternary">
          <span className="navbar-brand mb-0">
            <span className="h4 text-light">Timesheet</span>
            <small className="text-light pl-2">
              v1.0
            </small>
          </span>
          <div className="div-inline d-flex justify-content-center align-items-center">
            <a
              className="btn btn-sm btn-outline-light"
              href="http://freesuggestionbox.com/pub/eagzrkh"
              rel="noopener noreferrer"
              target="_blank"
            >
              Leave a suggestion
            </a>
            <span className="text-light px-2">or</span>
            <a
              className="btn btn-sm btn-outline-light"
              href="https://github.com/Sunakujira1/timesheet/issues/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              create new GitHub issue
            </a>
          </div>
        </nav>
        <main className="py-5">
          <section className="container border">
            <ApiKeyComponent setApiKey={this.setApiKey} setTodoItems={this.setTodoItems} setAccount={this.setAccount} />
          </section>
          {
            this.state.todoItems !== null && this.state.account !== null
            ? (
              <section className="container border my-5">
                  <WeekComponent apiKey={this.state.apiKey} todoItems={this.state.todoItems} account={this.state.account} />
              </section>
            ) : null
          }
        </main>
      </div>
    );
  }
}

  export default AppComponent;
