import * as React from 'react';
import styles from './TestWebPart.module.scss';
import { ITestWebPartProps } from './ITestWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import DisplayDetails from './AccountView';

export default class TestWebPart extends React.Component<ITestWebPartProps, {}> {
  public render(): React.ReactElement<ITestWebPartProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <DisplayDetails />
    );
  }
}
