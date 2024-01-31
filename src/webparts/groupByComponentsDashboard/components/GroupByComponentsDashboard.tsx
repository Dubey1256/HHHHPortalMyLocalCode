import * as React from 'react';
import { IGroupByComponentsDashboardProps } from './IGroupByComponentsDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import GroupByDashboard from './GroupByDashboard';

export default class GroupByComponentsDashboard extends React.Component<IGroupByComponentsDashboardProps, {}> {
  public render(): React.ReactElement<IGroupByComponentsDashboardProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      Context,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      PortFolioTypeID,
    } = this.props;

    return (
      <div>
        <GroupByDashboard  SelectedProp={this.props}/>
      </div>
    );
  }
}
