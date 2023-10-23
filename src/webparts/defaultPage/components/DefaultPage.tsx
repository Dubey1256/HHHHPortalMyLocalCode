import * as React from 'react';
import styles from './DefaultPage.module.scss';
import { IDefaultPageProps } from './IDefaultPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import HomeDefaultPage from './HomeDefaultPage';

export default class DefaultPage extends React.Component<IDefaultPageProps, {}> {
  public render(): React.ReactElement<IDefaultPageProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <HomeDefaultPage></HomeDefaultPage>
    );
  }
}
