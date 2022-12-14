import * as React from 'react';
import { IServicePortfolioProps } from './IServicePortfolioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ComponentTable from './componentTable';
import '../../cssFolder/foundationmin.scss'
import '../../cssFolder/foundation.scss'

export default class ServicePortfolio extends React.Component<IServicePortfolioProps, {}> {
  public render(): React.ReactElement<IServicePortfolioProps> {
   
    return (
    <div><ComponentTable></ComponentTable></div>
    );
  }
}
