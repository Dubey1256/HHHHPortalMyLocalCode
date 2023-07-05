import * as React from 'react';
import styles from './TeamPortfolio.module.scss';
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
    } = this.props;

    return (
      <div>
        <TeamPortlioTable SelectedProp={this.props}/>
      </div>
    );
  }
}
