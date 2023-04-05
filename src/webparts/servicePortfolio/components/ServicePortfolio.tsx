import * as React from 'react';
import { IServicePortfolioProps } from './IServicePortfolioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ComponentTable from './componentTable';
//import '../../cssFolder/foundationmin.scss'
//import '../../cssFolder/foundation.scss'
// import { SPComponentLoader } from '@microsoft/sp-loader'
// SPComponentLoader.loadCss("https://hhhhteams.sharepoint.com/sites/HHHH/Style%20Library/SPFx/CSS/site_color.css");
// SPComponentLoader.loadCss("https://hhhhteams.sharepoint.com/sites/HHHH/Style%20Library/SPFx/CSS/Style.css");
export default class ServicePortfolio extends React.Component<IServicePortfolioProps, {}> {
  public render(): React.ReactElement<IServicePortfolioProps> {
      const {
        description,
        isDarkTheme,
        environmentMessage,
        hasTeamsContext,
        userDisplayName,
        Context,
        dropdownvalue,
        MasterTaskListID,
        TaskUsertListID,
        SmartMetadataListID,
      } = this.props;
    return (
    <div>
      {/* {escape(this.props.dropdownvalue)} */}
      <ComponentTable SelectedProp={this.props}></ComponentTable></div> 
    );
  }
}
