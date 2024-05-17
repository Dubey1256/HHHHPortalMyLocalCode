import * as React from 'react';
import type { ITaskNotificationManagementProps } from './ITaskNotificationManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { NotificationsSearchPage } from './NotificationsSearchPage';
export default class TaskNotificationManagement extends React.Component<ITaskNotificationManagementProps, {}> {
  public render(): React.ReactElement<ITaskNotificationManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <NotificationsSearchPage props={this.props}/>
    );
  }
}
