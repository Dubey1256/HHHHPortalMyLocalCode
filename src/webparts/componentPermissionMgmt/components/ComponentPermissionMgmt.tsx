import * as React from 'react';
import type { IComponentPermissionMgmtProps } from './IComponentPermissionMgmtProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ComponentPermissionSearch } from './ComponentPermissionSearch';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

export default class ComponentPermissionMgmt extends React.Component<IComponentPermissionMgmtProps, {}> {
  public render(): React.ReactElement<IComponentPermissionMgmtProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (

      <FluentProvider theme={webLightTheme}>
        <ComponentPermissionSearch props={this.props}/>
      </FluentProvider>

    );
  }
}
