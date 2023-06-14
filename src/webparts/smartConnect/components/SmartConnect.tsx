import * as React from 'react';
//import styles from './SmartConnect.module.scss';
import { ISmartConnectProps } from './ISmartConnectProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SmartConnectTable from './SmartConnectTable';

export default class SmartConnect extends React.Component<ISmartConnectProps, {}> {
  public render(): React.ReactElement<ISmartConnectProps> {
    

    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      TaskUsertListID,
      SmartMetadataListID,
      MasterTaskListID,
      siteUrl,
    } = this.props;
    return (
      <div>
        <SmartConnectTable SelectedProp={this.props}></SmartConnectTable>
      </div>
    );
  }
}