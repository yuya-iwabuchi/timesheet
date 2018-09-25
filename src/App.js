import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import WeekComponent from './components/WeekComponent';

class AppComponent extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: '',
      rememberMe: false,
      todoItemsFetched: false,
      todoItems: [],
    };

    this.getLocalStorage = this.getLocalStorage.bind(this);
    this.setLocalStorage = this.setLocalStorage.bind(this);
    this.onAPIKeyChange = this.onAPIKeyChange.bind(this);
    this.onRememberMeChange = this.onRememberMeChange.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
  }

  componentWillMount() {
    this.getLocalStorage();
  }

  onAPIKeyChange(event) {
    const apiKey = event.target.value;
    console.log(apiKey);
    this.setState({ apiKey });
    this.setLocalStorage(apiKey, this.state.rememberMe);
  }

  onRememberMeChange(event) {
    const rememberMe = event.target.checked;
    console.log(rememberMe);
    this.setState({ rememberMe });
    this.setLocalStorage(this.state.apiKey, rememberMe);
  }

  getLocalStorage() {
    let apiKey = localStorage.getItem('apiKey');
    if (apiKey === null) apiKey = '';
    let rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === null) rememberMe = false;
    else rememberMe = rememberMe === 'true';
    console.log(apiKey, rememberMe);
    this.setState({ apiKey, rememberMe });
  }

  setLocalStorage(apiKey, rememberMe) {
    if (rememberMe) {
      localStorage.setItem('apiKey', apiKey);
      localStorage.setItem('rememberMe', rememberMe);
    } else {
      localStorage.clear();
    }
  }

  fetchTasks() {
    const url = 'https://blanclink.teamwork.com/tasks.json';
    const headers = { "Authorization": "BASIC " + window.btoa(this.state.apiKey + ":xxx") };

    fetch(url, { headers })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({
          todoItemsFetched: true,
          todoItems: res['todo-items'].sort((a, b) => {
            if (a.content < b.content) return -1;
            if (a.content > b.content) return 1;
            return 0;
          }),
        });
      })
  }

  render() {
    return (
      <div>
        <label>API Key</label>
        <input
          value={this.state.apiKey}
          onChange={this.onAPIKeyChange}
        />
        <br />
        <label>Remember Me</label>
        <input
          type="checkbox"
          checked={this.state.rememberMe}
          onChange={this.onRememberMeChange}
        />
        <br />
        <button
          onClick={this.fetchTasks}
          disabled={this.state.apiKey === ''}
        >
          Begin
        </button>
        <WeekComponent todoItems={this.state.todoItems} />
      </div>
    );
  }
}

  export default AppComponent;
