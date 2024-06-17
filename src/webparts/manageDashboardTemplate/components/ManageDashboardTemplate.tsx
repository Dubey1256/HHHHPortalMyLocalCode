import * as React from 'react';
//import styles from './ManageDashboardTemplate.module.scss';
import { IManageDashboardTemplateProps } from './IManageDashboardTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ManageDashboardTemplateTable from '../components/ManageDashboardTemplateTool';

export default class ManageDashboardTemplate extends React.Component<IManageDashboardTemplateProps, {}> {
  public render(): React.ReactElement<IManageDashboardTemplateProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <>
        <ManageDashboardTemplateTable props={this.props}></ManageDashboardTemplateTable>
     </>
    );
  }
}
