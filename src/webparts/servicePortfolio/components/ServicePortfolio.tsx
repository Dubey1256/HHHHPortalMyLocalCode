import * as React from 'react';
import { IServicePortfolioProps } from './IServicePortfolioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ComponentTable from './componentTable';
//import '../../cssFolder/foundationmin.scss'
//import '../../cssFolder/foundation.scss'

export default class ServicePortfolio extends React.Component<IServicePortfolioProps, {}> {
  public render(): React.ReactElement<IServicePortfolioProps> {
      const {
        description,
        isDarkTheme,
        environmentMessage,
        hasTeamsContext,
        userDisplayName,
        Context,
      } = this.props;
    return (
    <div><ComponentTable ></ComponentTable></div> 
    );
  }
}
