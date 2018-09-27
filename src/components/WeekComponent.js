import React, { Component } from 'react';
import dayjs from 'dayjs';

import './WeekComponent.scss';

class WeekComponent extends Component {
  constructor() {
    super();
    const startOfWeek = dayjs().startOf('week'); // Sunday
    this.state = {
      days: [
        startOfWeek.add(1, 'day'), // Monday
        startOfWeek.add(2, 'day'),
        startOfWeek.add(3, 'day'),
        startOfWeek.add(4, 'day'),
        startOfWeek.add(5, 'day'),
        startOfWeek.add(6, 'day'),
        startOfWeek.add(7, 'day'), // Sunday
      ],
    }
  }
  render() {
    console.log('props', this.props)
    return (
      <section className="mt-3 mb-5 mx-1 mx-md-5">
        <h5 className="mb-4 font-weight-bold">Step 2: Submit Timesheet</h5>
        <form>
          <div className="form-group">
            <label htmlFor="taskInput">Tasks</label>
            <select id="taskInput" className="form-control">
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
                <span key={`${day.day()}-day-label`} className="day-day-label">
                  {day.format('dddd')}
                </span>,
                <span key={`${day.day()}-date-label`} className="day-date-label pb-3">
                  {day.format('MMM-DD')}
                </span>,
                <div key={`${day.day()}-input`} className="day-input">
                  <input type="number" className="form-control text-right" />
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