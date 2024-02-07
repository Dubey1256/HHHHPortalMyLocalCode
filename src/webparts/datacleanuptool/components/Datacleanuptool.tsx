import * as React from 'react';
import styles from './Datacleanuptool.module.scss';
import type { IDatacleanuptoolProps } from './IDatacleanuptoolProps';
import { escape } from '@microsoft/sp-lodash-subset';
import DataCleancupTool from './TestDataCleanupTool';

export default class Datacleanuptool extends React.Component<IDatacleanuptoolProps, {}> {
  public render(): React.ReactElement<IDatacleanuptoolProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      BackupConfigurationsListID,
      TaskUserListID,
      siteUrl,
    } = this.props;

    return (
      <div>
      <DataCleancupTool SelectedProp={this.props}/>
    </div>
    );
  }
}
