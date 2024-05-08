import * as React from 'react';
import { ITeamPortfolioProps } from './ITeamPortfolioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TeamPortlioTable from './TeamPortlioTable';

export default class TeamPortfolio extends React.Component<ITeamPortfolioProps, {}> {
  public render(): React.ReactElement<ITeamPortfolioProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      Context,
      // dropdownvalue,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      PortFolioTypeID,
      SmartHelpListID,
      AdminconfigrationID,
      DocumentsListID
    } = this.props;

    return (
      <div>
        <TeamPortlioTable SelectedProp={this.props}/>
      </div>
    );
  }
}
