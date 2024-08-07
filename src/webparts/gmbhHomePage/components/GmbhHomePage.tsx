import * as React from 'react';
import { IGmbhHomePageProps } from './IGmbhHomePageProps';
import GmbHHomePage from './NewGmbhHomePage';

export default class GmbhHomePage extends React.Component<IGmbhHomePageProps, {}> {
  public render(): React.ReactElement<IGmbhHomePageProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      context,
      siteUrl,
      SitePagesList
    } = this.props;

    return (
      <>
      <GmbHHomePage props={this.props}/>
      </> 
    );
  }
}
