import React, { Component } from 'react';
import dayjs from 'dayjs';

import './WeekComponent.scss';

const DOMAIN = 'https://blanclink.teamwork.com';

class WeekComponent extends Component {
  constructor() {
    super();
    const today = dayjs().startOf('week'); // Sunday
    this.state = {
      startOfWeek: today,
      days: [
        today.add(1, 'day'), // Monday
        today.add(2, 'day'),
        today.add(3, 'day'),
        today.add(4, 'day'),
        today.add(5, 'day'),
        today.add(6, 'day'),
        today.add(7, 'day'), // Sunday
      ],
      hours: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      submitStatuses: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      selectedTodoItem: null,
    }

    this.onTodoItemChange = this.onTodoItemChange.bind(this);
    this.onHoursEnter = this.onHoursEnter.bind(this);
    this.onPrevWeekClick = this.onPrevWeekClick.bind(this);
    this.onNextWeekClick = this.onNextWeekClick.bind(this);
    this.onResetWeek = this.onResetWeek.bind(this);
    this.onResetHours = this.onResetHours.bind(this);
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
    let selectedTodoItem = this.props.todoItems.find(todoItem => todoItem.id.toString() === event.target.value);
    if (selectedTodoItem === undefined) selectedTodoItem = null;
    this.setState( { selectedTodoItem });
  }

  onHoursEnter(event, index) {
    const newHours = +event.target.value;
    this.setState({ 
      hours: this.state.hours.map((hour, i) => i === index ? newHours: hour),
    })

  }

  onPrevWeekClick() {
    this.populateWeek(this.state.startOfWeek.subtract(7, 'days'));
  }
  onNextWeekClick() {
    this.populateWeek(this.state.startOfWeek.add(7, 'days'));
  }

  onResetWeek() {
    const today = dayjs().startOf('week');
    this.populateWeek(today);
  }

  onResetHours() {
    this.setState({
      hours: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    });
  }

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const week = this.state.days.map((day, index) => ({
      date: day,
      hours: this.state.hours[index],
    }));
    console.log(week, this.props);
    
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
    return todoItemSelected && someHoursEntered;
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

  render() {
    console.log('state', this.state);
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
            <div className="col-md-10 col-lg-auto">
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
              <div className="week-button d-flex align-items-center justify-content-center">
                <button className="btn btn-outline-secondary" onClick={this.onPrevWeekClick}>
                  <span className="fas fa-chevron-left">
                  </span>
                </button>
              </div>
              {this.state.submitStatuses.map((submitStatuses, index) => {
                return (
                  <div key={`status-${index}`} className="submit-status d-flex align-items-center justify-content-center">
                    <span className={this.statusToClass(submitStatuses)}>
                    </span>
                  </div>

                )
              })}
              {this.state.days.map((day, index) => {
                return [
                  <span key={`${day.day()}-day-label`} className="day-day-label">
                    {day.format('dddd')}
                  </span>,
                  <span key={`${day.day()}-date-label`} className="day-date-label pb-3">
                    {day.format('MMM-DD')}
                  </span>,
                  <div key={`${day.day()}-input`} className="day-input pb-4">
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
              <div className="week-button d-flex align-items-center justify-content-center">
                <button className="btn btn-outline-secondary" onClick={this.onNextWeekClick}>
                  <span className="fas fa-chevron-right">
                  </span>
                </button>
              </div>
              <div className="reset-buttons pb-2">
                <button className="btn btn-secondary mr-2" onClick={this.onResetWeek}>
                  Reset Week
                </button>
                <button className="btn btn-secondary ml-2" onClick={this.onResetHours}>
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
              Submit
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default WeekComponent;