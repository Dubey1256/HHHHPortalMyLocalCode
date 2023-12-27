import * as React from 'react';
import type { ITaskUserManagementProps } from './ITaskUserManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TaskUserManagementApp from './TaskUserManagementApp';

export default class TaskUserManagement extends React.Component<ITaskUserManagementProps, {}> {
  public render(): React.ReactElement<ITaskUserManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      context,
      TaskUserListId,
      SmartMetaDataId
    } = this.props;

    return (
      <>
        < TaskUserManagementApp props={this.props}/>
      </>
    );
  }
}
