import * as React from 'react';
import { IRootDashboardProps } from './IRootDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import RootLevelDashboard from './RootLevelDashboard';

export default class RootDashboard extends React.Component<IRootDashboardProps, {}> {
  public render(): React.ReactElement<IRootDashboardProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      Context,
      siteUrl,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID,
      TimeEntry,
      SiteCompostion
    } = this.props;

    return (
     <RootLevelDashboard props={this.props}/>
    );
  }
}
