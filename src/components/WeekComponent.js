import React, { Component } from 'react';
import dayjs from 'dayjs';

import './WeekComponent.scss';
import { SpinnerComponent } from './SpinnerComponent';

const DOMAIN = 'https://blanclink.teamwork.com';
const PROJECT_ID = 403677; // Limit to tasks under Timesheet Project

class WeekComponent extends Component {
  constructor() {
    super();
    const startOfWeek = dayjs().startOf('week').add(12, 'hour'); // Sunday
    this.state = {
      startOfWeek,
      days: [
        startOfWeek.add(1, 'day'), // Monday
        startOfWeek.add(2, 'day'),
        startOfWeek.add(3, 'day'),
        startOfWeek.add(4, 'day'),
        startOfWeek.add(5, 'day'),
        startOfWeek.add(6, 'day'),
        startOfWeek.add(7, 'day'), // Sunday
      ],
      hours: [ '', '', '', '', '', '', '' ],
      submitStatuses: [ '', '', '', '', '', '', '' ],
      selectedTodoItem: null,
      isBillable: true,
      startHour: 9,
      startMinute: 30,
      selectedPeriod: 'am',
      submitting: false,
    }

    this.onTodoItemChange = this.onTodoItemChange.bind(this);
    this.onHoursEnter = this.onHoursEnter.bind(this);
    this.onPrevWeekClick = this.onPrevWeekClick.bind(this);
    this.onNextWeekClick = this.onNextWeekClick.bind(this);
    this.onResetWeek = this.onResetWeek.bind(this);
    this.onResetHours = this.onResetHours.bind(this);
    this.onResetSubmitStatuses = this.onResetSubmitStatuses.bind(this);
    this.resetWeek = this.resetWeek.bind(this);
    this.resetHours = this.resetHours.bind(this);
    this.resetSelectedTask = this.resetSelectedTask.bind(this);
    this.resetSubmitStatuses = this.resetSubmitStatuses.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.populateWeek = this.populateWeek.bind(this);
    this.onIsBillableChange = this.onIsBillableChange.bind(this);
    this.onStartHourEnter = this.onStartHourEnter.bind(this);
    this.onStartMinuteEnter = this.onStartMinuteEnter.bind(this);
    this.onPeriodClick = this.onPeriodClick.bind(this);
  }

  componentDidMount() {
    this.mainElement.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  componentWillReceiveProps() {
    this.mainElement.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onTodoItemChange(event) {
    this.onResetSubmitStatuses();
    let selectedTodoItem = this.props.todoItems.find(todoItem => todoItem.id.toString() === event.target.value);
    if (selectedTodoItem === undefined) selectedTodoItem = null;
    this.setState( { selectedTodoItem });
  }

  onHoursEnter(event, index) {
    this.onResetSubmitStatuses();
    let newHours = parseFloat(event.target.value);
    if (isNaN(newHours)) {
      newHours = '';
    }
    this.setState({
      hours: this.state.hours.map((hour, i) => i === index ? newHours : hour),
    })
  }

  onIsBillableChange(event) {
    const isBillable = event.target.checked;
    this.setState({ isBillable });
  }

  onStartHourEnter(event) {
    let startHour = +event.target.value;
    if (startHour === 13) startHour = 1;
    else if (startHour === 0) startHour = 12;
    this.setState({ startHour });
  }
  onStartMinuteEnter(event) {
    let startMinute = +event.target.value;
    if (startMinute === 60) startMinute = 0;
    else if (startMinute === -5) startMinute = 55;
    this.setState({ startMinute });

  }
  onPeriodClick(event) {
    const selectedPeriod = event.target.value;
    this.setState({ selectedPeriod });
  }

  onPrevWeekClick() {
    this.onResetSubmitStatuses();
    this.populateWeek(this.state.startOfWeek.subtract(7, 'days'));
  }
  onNextWeekClick() {
    this.onResetSubmitStatuses();
    this.populateWeek(this.state.startOfWeek.add(7, 'days'));
  }

  onResetWeek() {
    this.onResetSubmitStatuses();
    this.resetWeek();
  }

  onResetHours() {
    this.onResetSubmitStatuses();
    this.resetHours();
  }
  
  onResetSubmitStatuses() {
    this.resetSubmitStatuses();
  }

  resetWeek() {
    const today = dayjs().startOf('week');
    this.populateWeek(today);
  }

  resetHours() {
    this.setState({ hours: ['', '', '', '', '', '', ''] });
  }
  
  resetSelectedTask() {
    this.setState({ selectedTodoItem: null });
  }

  resetSubmitStatuses() {
    this.setState({ submitStatuses: ['', '', '', '', '', '', ''] });
  }

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ submitting: true });

    const week = this.state.days.map((day, index) => ({
      date: day,
      hours: this.state.hours[index],
    }));

    const startTime = dayjs()
      .set('hour', this.state.startHour + (this.state.selectedPeriod === 'pm' ? 12 : 0))
      .set('minute', this.state.startMinute)
      .format('HH:mm');

    const isbillable = this.state.isBillable ? '1' : '0';

    const createUrl = todoId => `${DOMAIN}/tasks/${todoId}/time_entries.json`;
    const allSubmits = Promise.all(week.map((day, index) => {
      if (day.hours === '' || day.hours === 0) return null;
      return fetch(createUrl(this.state.selectedTodoItem.id), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "BASIC " + window.btoa(this.props.apiKey + ":xxx"),
        },
        body: JSON.stringify({
          'time-entry': {
            date: day.date.format('YYYYMMDD'),
            time: startTime,
            hours: Math.floor(day.hours),
            minutes: Math.floor((day.hours % 1) * 60),
            isbillable,
          },
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.status === 'OK' || res.STATUS === 'OK') {
            this.setState({
              submitStatuses: this.state.submitStatuses.map((submitStatus, i) => i === index ? 'success' : submitStatus),
              submitting: false,
            });
          } else {
            throw Error(res.error);
          }
        })
        .catch((err) => {
          this.setState({
            submitStatuses: this.state.submitStatuses.map((submitStatus, i) => i === index ? 'failure' : submitStatus),
          })
        });
    }).filter(promise => promise !== null));
    allSubmits.then(() => {
      this.resetSelectedTask();
      this.resetWeek();
      this.resetHours();
    })
  }

  populateWeek(startOfWeek) {
    this.setState({
      startOfWeek,
      days: [
        startOfWeek.add(1, 'day'), // Monday
        startOfWeek.add(2, 'day'),
        startOfWeek.add(3, 'day'),
        startOfWeek.add(4, 'day'),
        startOfWeek.add(5, 'day'),
        startOfWeek.add(6, 'day'),
        startOfWeek.add(7, 'day'), // Sunday
      ],
    });
  }

  canSubmit() {
    const todoItemSelected = this.state.selectedTodoItem !== null && this.state.selectedTodoItem !== '';
    const someHoursEntered = this.state.hours.some(hours => hours !== '' && hours !== 0);
    return todoItemSelected && someHoursEntered && !this.state.submitting;
  }

  statusToClass(status) {
    switch(status) {
      case '':
      case null:
        return '';
      case 'failure':
        return 'far fa-times-circle fa-lg text-danger';
      case 'success':
      default:
        return 'far fa-check-circle fa-lg text-success';
    }
  }

  getDaySuffix(day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return "st";
      case 2:
      case 22:
        return "nd";
      case 3:
      case 23:
        return "rd";
      default:
        return "th";
    }
  }

  renderStatusIcon(success, total) {
    if (total === success) {
      return <i className="fas fa-check text-success mr-2"></i>;
    } else if (success > 0) {
      return <i class="fas fa-exclamation text-warning mr-2"></i>;
    } else {
      return <i className="fas fa-times text-danger mr-2"></i>;
    }
  }

  statusSuffix(success, total) {
    if (total === success) {
      return 'submitted successfully!';
    } else {
      return 'submitted successfully.';
    }
  }

  renderSubmittedMessage() {
    const total = this.state.submitStatuses.filter(status => status !== '').length;
    const success = this.state.submitStatuses.filter(status => status === 'success').length;
    const submitted = total > 0;
    return (
      <div className={`d-flex flex-column align-items-center mb-3 ${submitted ? 'visible' : 'invisible'}`}>
        <span>
          {this.renderStatusIcon(success, total)}
          <span className="text-primary">
            <b>{success} / {total}</b> {this.statusSuffix(success, total)}
          </span>
        </span>
        <span className="text-primary">
          Please verify the results at <a rel="noopener noreferrer" target="_blank" href="https://blanclink.teamwork.com/#/projects/403677">Timesheet Project</a>.
        </span>
      </div>
    );
  }

  render() {
    return (
      <section className="mt-3 mb-5 mx-1 mx-sm-2 mx-lg-5" ref={ref => this.mainElement = ref}>
        <h5 className="mb-2 font-weight-bold">Step 2: Submit Timesheet</h5>
        <div className="row mb-4">
          <small id="task-select-help" className="form-text text-muted col-12 col-md-8">
            Note - Currently you can only submit one task at a time. Hours can be entered with decimal number.
          </small>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="form-group row mb-5">
            <label htmlFor="taskInput" className="col-md-2 col-form-label">Task</label>
            <div className="col-12 col-md-8 col-lg-auto">
              <select
                id="taskInput"
                className="form-control"
                onChange={this.onTodoItemChange}
                aria-describedby="task-select-help"
                value={this.state.selectedTodoItem ? this.state.selectedTodoItem.id : ''}
              >
                <option value="">Please Select</option>
                {this.props.todoItems.filter(item => item['project-id'] === PROJECT_ID).map(item => {
                  return (
                    <option key={item.id} value={item.id}>{item.content}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 p-4 border">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center mb-4">
              <div className="col-12 d-flex flex-wrap align-items-center justify-content-end">
                <div className="w-100 d-flex justify-content-end">
                  <div className="custom-control custom-checkbox custom-checkbox-secondary">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="is-billable"
                      checked={this.state.isBillable}
                      onChange={this.onIsBillableChange}
                    />
                    <label className="custom-control-label" htmlFor="is-billable">Billable</label>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                  <label className="col-12 col-md-auto text-center mb-0">Start time</label>
                  <div className="d-flex align-items-center">
                    <div className="start-time col-auto">
                      <input
                        type="number"
                        min="0"
                        max="13"
                        className="form-control text-center"
                        placeholder="hh"
                        value={this.state.startHour}
                        onChange={this.onStartHourEnter}
                      />
                    </div>
                    <span className="font-weight-bold">:</span>
                    <div className="start-time col-auto">
                      <input
                        type="number"
                        min="-5"
                        max="60"
                        step="5"
                        className="form-control text-center"
                        placeholder="mm"
                        value={this.state.startMinute}
                        onChange={this.onStartMinuteEnter}
                      />
                    </div>
                  </div>
                  <div className="btn-group btn-group-toggle my-2" data-toggle="buttons">
                    <label className={`btn btn-sm btn-secondary ${this.state.selectedPeriod === 'am' ? 'active' : ''}`}>
                      <input type="radio" value="am" onClick={this.onPeriodClick}/> AM
                    </label>
                    <label className={`btn btn-sm btn-secondary ${this.state.selectedPeriod === 'pm' ? 'active' : ''}`}>
                      <input type="radio" value="pm" onClick={this.onPeriodClick}/> PM
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <section className="day">
              {this.state.submitStatuses.map((submitStatuses, index) => {
                return (
                  <div key={`status-${index}`} className={`submit-status d-flex align-items-center justify-content-center status-${index}`}>
                    <span className={this.statusToClass(submitStatuses)}>
                    </span>
                  </div>
                )
              })}
              {this.state.days.map((day, index) => {
                return [
                  <span key={`day-label-${index}`} className={`day-label day-label-${index}`}>
                    <span className="d-none d-md-block">{day.format('dddd')}</span>
                    <span className="d-block d-md-none">{day.format('dddd')},</span>
                  </span>,
                  <span key={`date-label-${index}`} className={`date-label pb-md-3 date-label-${index}`}>
                    <span className="d-none d-md-block">{day.format('MMM-DD')}</span>
                    <span className="d-block d-md-none">{`${day.format('MMMM D')}${this.getDaySuffix(day.day())}`}</span>
                    
                  </span>,
                  <div key={`hours-input-${index}`} className={`hours-input pb-md-4 hours-input-${index}`}>
                    <input
                      type="number"
                      className="form-control text-right"
                      onChange={event => this.onHoursEnter(event, index)}
                      value={this.state.hours[index]}
                      min="0"
                      max="24"
                      step="any"
                    />
                  </div>,
                ];
              })}
              <div className="week-button prev-button d-flex align-items-center justify-content-center mb-3 mb-md-0">
                <button type="button" className="btn btn-outline-secondary" onClick={this.onPrevWeekClick}>
                  <span className="fas fa-chevron-left">
                  </span>
                </button>
              </div>
              <div className="week-button next-button d-flex align-items-center justify-content-center mb-3 mb-md-0">
                <button type="button" className="btn btn-outline-secondary" onClick={this.onNextWeekClick}>
                  <span className="fas fa-chevron-right">
                  </span>
                </button>
              </div>
              <div className="reset-buttons mt-3 mt-md-0">
                <button type="button" className="btn btn-secondary" onClick={this.onResetWeek}>
                  Reset Week
                </button>
                <button type="button" className="btn btn-secondary" onClick={this.onResetHours}>
                  Reset Hours
                </button>
              </div>
            </section>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center">
            {this.renderSubmittedMessage()}
            <button
              type="submit"
              className="btn btn-lg btn-primary col-12 col-md-4 col-lg-2"
              disabled={!this.canSubmit()}
            >
              {
                this.state.submitting
                ? <SpinnerComponent />
                : <span>Submit</span>
              }
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default WeekComponent;