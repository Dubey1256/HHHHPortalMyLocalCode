import * as React from 'react';
// import styles from './ComponentPortfolio.module.scss';
import { IComponentPortfolioProps } from './IComponentPortfolioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Groupby from './GroupBy';

export default class ComponentPortfolio extends React.Component<IComponentPortfolioProps, {}> {
  public render(): React.ReactElement<IComponentPortfolioProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      Context,
      dropdownvalue,
    } = this.props;

    return (
      <div className="container" >
      < Groupby SelectedProp={this.props.dropdownvalue}/>
    </div>
    );
  }
}
