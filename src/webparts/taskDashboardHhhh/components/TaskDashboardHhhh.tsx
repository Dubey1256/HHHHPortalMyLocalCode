import * as React from 'react';
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
      pageContext,
      siteUrl,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID,
      Context,
      TimeEntry,
      SiteCompostion
    } = this.props;

    return (
      <TaskDashboard pageContext={this.props.pageContext} props={this.props} />
    );
  }
}
