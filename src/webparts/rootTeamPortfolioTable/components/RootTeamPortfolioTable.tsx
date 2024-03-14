import * as React from 'react';

import type { IRootTeamPortfolioTableProps } from './IRootTeamPortfolioTableProps';
import { escape } from '@microsoft/sp-lodash-subset';
import RootTeamPortfolioTableData from './RootTeamPortfolioTableData';

export default class RootTeamPortfolioTable extends React.Component<IRootTeamPortfolioTableProps, {}> {
  public render(): React.ReactElement<IRootTeamPortfolioTableProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      siteUrl,
      Context,
      SmartMetadataListID,
    } = this.props;

    return (
      <>
      <RootTeamPortfolioTableData props={this.props}/>
     </>
    );
  }
}
