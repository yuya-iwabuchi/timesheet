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
    return (
      <section>
        <label>Weeks:</label>
        <select>
          {this.props.todoItems.map(item => {
            return (
              <option value={item.id}>{item.content}</option>
            );
          })}
        </select>
        <div className="week">
          {this.state.days.map(day => {
            return (
              <div className="day" key={day.format()}>
                <label>
                  &nbsp;
                  {day.format('MM-DD')}
                  &nbsp;<wbr />&nbsp;
                  {day.format('ddd')}
                  &nbsp;
                </label>
                <input className="day-input" />
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}

export default WeekComponent;