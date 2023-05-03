import * as React from 'react';
// import styles from './BigCalendar.module.scss';
import { IBigCalendarProps } from './IBigCalendarProps';
import App from './Cal';

// import { escape } from '@microsoft/sp-lodash-subset';

export default class BigCalendar extends React.Component<IBigCalendarProps, {}> {
  public render(): React.ReactElement<IBigCalendarProps> {
    console.log(this.props);

    return (
      <div>
        <App props={this.props}/>
      </div>
    );
  }
}
