import * as React from 'react';
//import styles from './TaskDashboard.module.scss';
import { ITaskDashboardProps } from './ITaskDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TaskDashboards from './TaskBoard';

export default class TaskDashboard extends React.Component<ITaskDashboardProps, {}> {
  public render(): React.ReactElement<ITaskDashboardProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section>
         <h5>Welcome {escape(userDisplayName)}</h5>
       <TaskDashboards props={userDisplayName}/>
      </section>
    );
  }
}
