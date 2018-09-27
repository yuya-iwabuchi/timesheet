import React, { Component} from 'react';

import './ApiKeyComponent.scss';
import { SpinnerComponent } from './SpinnerComponent';

class AppComponent extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: '',
      rememberMe: false,
      testing: false,
      testingOutput: {
        status: null,
        text: '',
      },
    };

    this.getLocalStorage = this.getLocalStorage.bind(this);
    this.setLocalStorage = this.setLocalStorage.bind(this);
    this.onAPIKeyChange = this.onAPIKeyChange.bind(this);
    this.onRememberMeChange = this.onRememberMeChange.bind(this);
    this.testAPIKey = this.testAPIKey.bind(this);
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

  testAPIKey(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      testing: true,
      testingOutput: {
        status: 'inProgress',
        text: 'Retrieving tasks...',
      },
    });
    const url = 'https://blanclink.teamwork.com/tasks.json';
    const headers = { "Authorization": "BASIC " + window.btoa(this.state.apiKey + ":xxx") };

    fetch(url, { headers })
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
        if (res.status === 'OK' || res.STATUS === 'OK') {
          this.setState({
            testingOutput: {
              status: 'success',
              text: 'Complete!',
            },
          });
          const todoItems = res['todo-items'].sort((a, b) => {
            if (a.content < b.content) return -1;
            if (a.content > b.content) return 1;
            return 0;
          });
          this.props.setTodoItems(todoItems);
        } else {
          throw Error(res.error);
        }
      })
      .catch((err) => {
        console.log(err, err.message);
        this.setState({
          testingOutput: {
            status: 'failure',
            text: err.message,
          },
        })
      })
      .finally(() => {
        this.setState({ testing: false });
      });
  }

  renderStatusIcon(status) {
    switch(status) {
      case 'success':
        return <span className="text-success mr-2">&#10004;</span>;
      case 'failure':
        return <span className="text-danger mr-2">&#10006;</span>;
      case null:
      default:
        return null;
      
    }
  }

  render() {
    return (
      <form className="my-5 mx-1 mx-md-5" onSubmit={this.testAPIKey}>
        <div className="form-group row">
          <label htmlFor="api-key" className="col-md-2 col-form-label">API Key</label>
          <div className="col-md-10 col-lg-6">
            <input
              type="text"
              className="form-control"
              id="api-key"
              aria-describedby="api-key-help"
              placeholder="Please enter your API Key here"
              value={this.state.apiKey}
              onChange={this.onAPIKeyChange}
            />
            <small id="api-key-help" className="form-text text-muted">You can find from your Teamwork Project user account profile.</small>
          </div>
        </div>
        <div className="form-check form-group offset-md-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="remember-me"
            checked={this.state.rememberMe}
            onChange={this.onRememberMeChange}
          />
          <label className="form-check-label" htmlFor="remember-me">Remember me (Locally)</label>
        </div>
        <div className="form-group d-flex flex-wrap offset-md-2">
          <button
            type="submit"
            className="btn btn-primary col-12 col-md-4 col-lg-2"
            disabled={this.state.apiKey === ''}
          >
            {
              this.state.testing
              ? <SpinnerComponent />
              : <span>Connect</span>
            }
          </button>
          {
            this.state.testingOutput.status !== null
            ? (
              <div className="d-flex align-items-center ml-3 my-2 my-md-0">
                  {this.renderStatusIcon(this.state.testingOutput.status)}
                <span className="text-primary">
                  {
                    this.state.testingOutput.text
                  }
                </span>
              </div>
            ) : null
          }
        </div>
      </form>
    );
  }
}

export default AppComponent;
