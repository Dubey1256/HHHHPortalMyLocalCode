import * as React from 'react';
// import styles from './GmbhCalendar.module.scss';
import type { IGmbhCalendarProps } from './IGmbhCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Apps from './TestRecurrence';

export default class GmbhCalendar extends React.Component<IGmbhCalendarProps, {}> {
  public render(): React.ReactElement<IGmbhCalendarProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
   <>
    <Apps props={this.props}/>
   </>
    );
  }
}
