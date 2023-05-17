import * as React from 'react';
import { ICalendarProps } from './ICalendarProps';
import App from './Cal';

export default class BigCalendar extends React.Component<ICalendarProps, {}> {
  public render(): React.ReactElement<ICalendarProps> {

    return (
      <div>
        <App props={this.props}/>
      </div>
    );
  }
}
