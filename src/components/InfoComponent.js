import React, { Component } from 'react';
import './InfoComponent.scss';

class InfoComponent extends Component {

  render() {
    return (
      <div className="mt-3 mb-5 mx-1 mx-sm-2 mx-lg-5">
        <h5 className="mb-2 font-weight-bold">Notes</h5>
        <small className="form-text">
          <p className="col-12 col-lg-10 px-0">
            This web app was built to make my timesheet-entering life easier.<br />
            It leverages <a rel="noopener noreferrer" target="_blank" href="https://developer.teamwork.com/projects/introduction/welcome-to-the-teamwork-projects-api">
              Teamwork Projects API
            </a> to communicate directly without any server intervension.<br />
            It should do it's job but there still may be some bugs,
            therefore it is highly recommended to double check the outcome at Teamwork Project every time after you use this web app.<br />
            If you do find some bugs or have some suggestions/feedbacks, feel free to click on the buttons at top right corner and fill them in.<br />
            You are free to use this web app, but please do so at your own risk.<br />
          </p>
          <p className="text-right">- Yuya</p>
        </small>
      </div>
    );
  }
}

export default InfoComponent;
