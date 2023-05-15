import * as React from 'react';

import { IProjectmanagementOverviewToolProps } from './IProjectmanagementOverviewToolProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ProjectOverview from './ProjectOverView';

export default class ProjectmanagementOverviewTool extends React.Component<IProjectmanagementOverviewToolProps, {}> {
  public render(): React.ReactElement<IProjectmanagementOverviewToolProps> {
    const {
      description,
      Context,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      siteUrl,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID
    } = this.props;

    return (
    <div>
    <ProjectOverview props={this.props} /> 
    </div>
    );
  }
}
