import * as React from 'react';
import { ITeamleaderDashboardProps } from './ITeamleaderDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TeamDashboard from './TeamDashboard';

export default class TeamleaderDashboard extends React.Component<ITeamleaderDashboardProps, {}> {
  public render(): React.ReactElement<ITeamleaderDashboardProps> {
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
   <TeamDashboard props={this.props} />
    );
  }
}
