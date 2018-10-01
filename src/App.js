import React, { Component } from 'react';
import './App.scss';

import InfoComponent from './components/InfoComponent';
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
          <span className="navbar-brand mb-0 d-flex flex-column flex-sm-row justify-content-center align-items-start align-items-sm-end">
            <span className="h4 text-light mb-0">Timesheet</span>
            <small className="text-light pl-2">
              v1.0
            </small>
          </span>
          <div className="div-inline d-flex flex-column flex-md-row justify-content-center align-items-end align-items-md-center">
            <a
              className="btn btn-sm btn-outline-light my-1"
              href="http://freesuggestionbox.com/pub/eagzrkh"
              rel="noopener noreferrer"
              target="_blank"
            >
              Leave a suggestion
            </a>
            <span className="text-light px-2 d-none d-md-block">or</span>
            <a
              className="btn btn-sm btn-outline-light my-1"
              href="https://github.com/Sunakujira1/timesheet/issues/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              Create new GitHub issue
            </a>
          </div>
        </nav>
        <main className="py-5 px-1 px-sm-0">
          <section className="container card mb-5">
            <InfoComponent />
          </section>
          <section className="container card mb-5">
            <ApiKeyComponent setApiKey={this.setApiKey} setTodoItems={this.setTodoItems} setAccount={this.setAccount} />
          </section>
          {
            this.state.todoItems !== null && this.state.account !== null
            ? (
                <section className="container card mb-5">
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
