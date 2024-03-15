import * as React from 'react';
// import styles from './AlertManagement.module.scss';
import AlertManagementTable from './Alert-Management';
import { IAlertManagementProps } from './IAlertManagementProps';

export default class AlertManagement extends React.Component<IAlertManagementProps, {}> {
  public render(): React.ReactElement<IAlertManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      siteUrl,
      hasTeamsContext,      
      userDisplayName,
      ContextValue,
      ColumnManagementListID
    } = this.props;

    return (
     <>
        <div>
          <AlertManagementTable SelectedProp={this.props}/>        
        </div>
     </>
    );
  }
}