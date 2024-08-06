import * as React from 'react';
import { IRootUpdateTopNavigationProps } from './IRootUpdateTopNavigationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TopNavigation from './TopNavigation';

export default class RootUpdateTopNavigation extends React.Component<IRootUpdateTopNavigationProps, {}> {
  public render(): React.ReactElement<IRootUpdateTopNavigationProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      TopNavigationListID,
      TaskUserListID,
      siteUrl
    } = this.props;

    return (
      <div>
<TopNavigation dynamicData={this.props}/>
      </div>
    );
  }
}
