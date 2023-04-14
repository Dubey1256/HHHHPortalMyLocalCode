import * as React from 'react';
import styles from './CreateTask.module.scss';
import { ICreateTaskProps } from './ICreateTaskProps';
import { escape } from '@microsoft/sp-lodash-subset';
import CreateTaskComponent from './CreateTaskComponent';

export default class CreateTask extends React.Component<ICreateTaskProps, {}> {
  public render(): React.ReactElement<ICreateTaskProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      pageContext,
      siteUrl,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID
    } = this.props;

    return (
      <CreateTaskComponent pageContext={this.props.pageContext} props={this.props}/>
    );
  }
}
