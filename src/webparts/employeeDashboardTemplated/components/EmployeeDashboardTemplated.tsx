import * as React from 'react';
// import styles from './EmployeeDashboardTemplated.module.scss';
import type { IEmployeeDashboardTemplatedProps } from './IEmployeeDashboardTemplatedProps';
import { escape } from '@microsoft/sp-lodash-subset';
import EmployeeProfile from './EmployeeProfile';

export default class EmployeeDashboardTemplated extends React.Component<IEmployeeDashboardTemplatedProps, {}> {
  public render(): React.ReactElement<IEmployeeDashboardTemplatedProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <EmployeeProfile props={this.props} />
    );
  }
}
