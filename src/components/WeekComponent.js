import React, { Component } from 'react';
import dayjs from 'dayjs';

import './WeekComponent.scss';

class WeekComponent extends Component {
  constructor() {
    super();
    const startOfWeek = dayjs().startOf('week'); // Sunday
    this.state = {
      days: [
        { date: startOfWeek.add(1, 'day'), hours: '' }, // Monday
        { date: startOfWeek.add(2, 'day'), hours: '' },
        { date: startOfWeek.add(3, 'day'), hours: '' },
        { date: startOfWeek.add(4, 'day'), hours: '' },
        { date: startOfWeek.add(5, 'day'), hours: '' },
        { date: startOfWeek.add(6, 'day'), hours: '' },
        { date: startOfWeek.add(7, 'day'), hours: '' }, // Sunday
      ],
      selectedTodoItem: null,
    }

    this.onTodoItemChange = this.onTodoItemChange.bind(this);
    this.onHoursEnter = this.onHoursEnter.bind(this);
  }

  onTodoItemChange(event) {
    const selectedTodoItem = this.props.todoItems.find(todoItem => todoItem.id.toString() === event.target.value);
    this.setState( { selectedTodoItem });
  }

  onHoursEnter(event, day) {
    const hours = +event.target.value;
    this.setState({
      days: this.state.days.map(oldDay => oldDay === day ? Object.assign({}, oldDay, { hours }) : oldDay),
    })

  }

  render() {
    console.log('state', this.state);
    return (
      <section className="mt-3 mb-5 mx-1 mx-sm-2 mx-lg-5">
        <h5 className="mb-4 font-weight-bold">Step 2: Submit Timesheet</h5>
        <form>
          <div className="form-group">
            <label htmlFor="taskInput">Tasks</label>
            <select id="taskInput" className="form-control" onChange={this.onTodoItemChange}>
              <option value=''>Please Select</option>
              {this.props.todoItems.map(item => {
                return (
                  <option key={item.id} value={item.id}>{item.content}</option>
                );
              })}
            </select>
          </div>
          <div className="day my-4 p-4 border">
            {this.state.days.map(day => {
              return [
                <span key={`${day.date.day()}-day-label`} className="day-day-label">
                  {day.date.format('dddd')}
                </span>,
                <span key={`${day.date.day()}-date-label`} className="day-date-label pb-3">
                  {day.date.format('MMM-DD')}
                </span>,
                <div key={`${day.date.day()}-input`} className="day-input">
                  <input
                    type="number"
                    className="form-control text-right"
                    onChange={event => this.onHoursEnter(event, day)}
                    value={day.hours}
                  />
                </div>,
              ];
            })}
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-lg btn-primary col-12 col-md-4 col-lg-2">Submit</button>
          </div>
        </form>
      </section>
    );
  }
}

export default WeekComponent;