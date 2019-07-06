import React, { Component} from 'react';

import './ApiKeyComponent.scss';
import { SpinnerComponent } from './SpinnerComponent';

const DOMAIN = 'https://blanclink.teamwork.com';

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
      account: null,
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
    this.setState({ apiKey });
    this.setLocalStorage(apiKey, this.state.rememberMe);
  }

  onRememberMeChange(event) {
    const rememberMe = event.target.checked;
    this.setState({ rememberMe });
    this.setLocalStorage(this.state.apiKey, rememberMe);
  }

  getLocalStorage() {
    let apiKey = localStorage.getItem('apiKey');
    if (apiKey === null) apiKey = '';
    let rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === null) rememberMe = false;
    else rememberMe = rememberMe === 'true';
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

  async testAPIKey(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      testing: true,
      testingOutput: {
        status: 'inProgress',
        text: 'Retrieving tasks...',
      },
    });
    const tasksUrl = `${DOMAIN}/tasks.json`;
    const headers = { "Authorization": "BASIC " + window.btoa(this.state.apiKey + ":xxx") };

    const succeeded = await fetch(tasksUrl, { headers })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'OK' || res.STATUS === 'OK') {
          this.setState({
            testingOutput: {
              status: 'inProgress',
              text: 'Retrieved tasks...',
            },
          });
          const todoItems = res['todo-items'].sort((a, b) => {
            if (a.content < b.content) return -1;
            if (a.content > b.content) return 1;
            return 0;
          });
          this.props.setTodoItems(todoItems);
          return true;
        } else {
          throw Error(res.error);
        }
      })
      .catch((err) => {
        this.setState({
          testingOutput: {
            status: 'failure',
            text: err.message,
          },
        })
      });

      if (succeeded) {
        const accountUrl = `${DOMAIN}/projects/api/v2/me.json`;
        fetch(accountUrl, { headers })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'OK' || res.STATUS === 'OK') {
              this.setState({
                account: res.person,
              });
              this.setState({
                testingOutput: {
                  status: 'success',
                  text: `Connected! Hello ${res.person['first-name']}!`,
                },
              });
              this.props.setAccount(res.person);
              this.props.setApiKey(this.state.apiKey);
            } else {
              throw Error(res.error);
            }
          })
          .catch((err) => {
            this.setState({
              testingOutput: {
                status: 'failure',
                text: err.message,
              },
            })
          });
      }
      this.setState({ testing: false });  
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
      <form className="mt-3 mb-5 mx-1 mx-sm-2 mx-lg-5" onSubmit={this.testAPIKey}>
        <h5 className="mb-4 font-weight-bold">Step 1: Connect to Teamwork Project using API Key</h5>
        <div className="form-group row">
          <label htmlFor="api-key" className="col-md-2 col-form-label">API Key</label>
          <div className="col-12 col-md-8 col-lg-6">
            <input className="d-none" type="text" name="app-name" autoComplete="username" value="Timesheet App" readOnly />
            <input
              type="password"
              name="api-key"
              autoComplete="password"
              className="form-control"
              id="api-key"
              aria-describedby="api-key-help"
              placeholder="Please enter your API Key here"
              value={this.state.apiKey}
              onChange={this.onAPIKeyChange}
            />
            <small id="api-key-help" className="form-text text-muted">
              You can find the API key at your <a rel="noopener noreferrer" target="_blank" href="https://blanclink.teamwork.com/#/projects/403677">Teamwork Project</a> user account profile.
              For more details, check <a rel="noopener noreferrer" target="_blank" href="https://developer.teamwork.com/projects/finding-your-url-and-api-key/api-key-and-url">the second section of this link.</a>
            </small>
          </div>
        </div>
        <div className="custom-control custom-checkbox form-group offset-md-2">
          <input
            type="checkbox"
            className="custom-control-input"
            id="remember-me"
            checked={this.state.rememberMe}
            onChange={this.onRememberMeChange}
          />
          <label className="custom-control-label" htmlFor="remember-me">
            Remember me (Locally)
          </label>
          <small className="form-text text-muted">
            Do not check this box if you are not on secure device.
          </small>
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
