import * as React from 'react';
import styles from './TaskDashboardHhhh.module.scss';
import { ITaskDashboardHhhhProps } from './ITaskDashboardHhhhProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TaskDashboard from './TaskDashboard';

export default class TaskDashboardHhhh extends React.Component<ITaskDashboardHhhhProps, {}> {
  public render(): React.ReactElement<ITaskDashboardHhhhProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      pageContext
    } = this.props;

    return (
     <TaskDashboard pageContext={this.props.pageContext}/>
    );
  }
}
