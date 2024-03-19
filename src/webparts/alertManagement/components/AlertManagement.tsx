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
      hasTeamsContext,      
      userDisplayName,
      ContextValue
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
