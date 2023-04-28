import * as React from 'react';
import styles from './UpdateTopNavigation.module.scss';
import { IUpdateTopNavigationProps } from './IUpdateTopNavigationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TopNavigation from './TopNavigation';

export default class UpdateTopNavigation extends React.Component<IUpdateTopNavigationProps, {}> {
  public render(): React.ReactElement<IUpdateTopNavigationProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <div>
      <TopNavigation dynamicData={this.props}></TopNavigation>
      </div>
      
    );
  }
}
