import * as React from 'react'
import { IPermissionManagementProps } from './IPermissionManagementProps';
import Permission_management from './Permission_management';

var Sitegroup: any = [];
export default class PermissionManagement extends React.Component<IPermissionManagementProps, {}> {
  public render(): React.ReactElement<IPermissionManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      context,
      TilesManagementListID
    } = this.props;

    return (
    <Permission_management context={this.props} />
    );
  }
}
