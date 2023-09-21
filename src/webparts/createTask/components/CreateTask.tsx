import * as React from 'react';
import { ICreateTaskProps } from './ICreateTaskProps';
import { escape } from '@microsoft/sp-lodash-subset';
import CreateTaskComponent from './CreateTaskComponent';
//import CreateTaskComponent from './CreateTaskComponent (1)';

export default class CreateTask extends React.Component<ICreateTaskProps, {}> {
  public render(): React.ReactElement<ICreateTaskProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      pageContext,
      Context,
      siteUrl,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID,
      TimeEntry,
      SiteCompostion
    } = this.props;

    return (
      <CreateTaskComponent SelectedProp={this.props} pageContext={this.props.pageContext} />
    );
  }
}