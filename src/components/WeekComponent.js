import React, { Component } from 'react';
import dayjs from 'dayjs';

import './WeekComponent.scss';
import { SpinnerComponent } from './SpinnerComponent';

const DOMAIN = 'https://blanclink.teamwork.com';

class WeekComponent extends Component {
  constructor() {
    super();
    const startOfWeek = dayjs().startOf('week'); // Sunday
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
      submitting: false,
    }

    this.onTodoItemChange = this.onTodoItemChange.bind(this);
    this.onHoursEnter = this.onHoursEnter.bind(this);
    this.onPrevWeekClick = this.onPrevWeekClick.bind(this);
    this.onNextWeekClick = this.onNextWeekClick.bind(this);
    this.onResetWeek = this.onResetWeek.bind(this);
    this.onResetHours = this.onResetHours.bind(this);
    this.onResetSubmitStatuses = this.onResetSubmitStatuses.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.populateWeek = this.populateWeek.bind(this);
  }

  componentDidMount() {
    this.mainElement.scrollIntoView({ behavior: 'smooth' });
  }

  componentWillReceiveProps() {
    this.mainElement.scrollIntoView({ behavior: 'smooth' });
  }

  onTodoItemChange(event) {
    this.onResetSubmitStatuses();
    let selectedTodoItem = this.props.todoItems.find(todoItem => todoItem.id.toString() === event.target.value);
    if (selectedTodoItem === undefined) selectedTodoItem = null;
    this.setState( { selectedTodoItem });
  }

  onHoursEnter(event, index) {
    this.onResetSubmitStatuses();
    const newHours = +event.target.value;
    this.setState({
      hours: this.state.hours.map((hour, i) => i === index ? newHours: hour),
    })

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
    const today = dayjs().startOf('week');
    this.populateWeek(today);
  }

  onResetHours() {
    this.onResetSubmitStatuses();
    this.setState({ hours: [ '', '', '', '', '', '', '' ] });
  }

  onResetSubmitStatuses() {
    this.setState({ submitStatuses: [ '', '', '', '', '', '', ''] });
  }

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ submitting: true });

    const week = this.state.days.map((day, index) => ({
      date: day,
      hours: this.state.hours[index],
    }));
    
    const createUrl = todoId => `${DOMAIN}/tasks/${todoId}/time_entries.json`;
    week
      .forEach((day, index) => {
        if (day.hours === '' || day.hours === 0) return;
        fetch(createUrl(this.state.selectedTodoItem.id), {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "BASIC " + window.btoa(this.props.apiKey + ":xxx"),
          },
          body: JSON.stringify({
            'time-entry': {
              date: day.date.format('YYYYMMDD'),
              time: '09:30',
              hours: Math.floor(day.hours),
              minutes: Math.floor((day.hours % 1) * 60),
              isbillable: '1',
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
          ;
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
        return 'far fa-times-circle  fa-lg text-danger';
      case 'success':
      default:
        return 'far fa-check-circle  fa-lg text-success';
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

  render() {
    return (
      <section className="mt-3 mb-5 mx-1 mx-sm-2 mx-lg-5" ref={ref => this.mainElement = ref}>
        <h5 className="mb-2 font-weight-bold">Step 2: Submit Timesheet</h5>
        <div className="row">
          <small id="task-select-help" className="form-text text-muted mb-4 col-12 col-md-8">
            Note - Currently many things are set by default:
            <ul>
              <li>Billable by default</li>
              <li>9:30AM start time</li>
              <li>Enter hours only by whole number</li>
            </ul>
          </small>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="form-group row">
            <label htmlFor="taskInput" className="col-md-2 col-form-label">Task</label>
            <div className="col-12 col-md-8 col-lg-auto">
              <select id="taskInput" className="form-control" onChange={this.onTodoItemChange} aria-describedby="task-select-help">
                <option value=''>Please Select</option>
                {this.props.todoItems.map(item => {
                  return (
                    <option key={item.id} value={item.id}>{item.content}</option>
                  );
                })}
              </select>
              <small id="task-select-help" className="form-text text-muted">
                Pick a task you'd like to fill. Currently you may fill only one task at a time.
              </small>
            </div>
          </div>
          <div className="mt-4 mb-5 p-4 border">
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
          <div className="d-flex justify-content-center">
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