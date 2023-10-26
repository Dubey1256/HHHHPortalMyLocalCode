import * as React from 'react';
import { ITestWebPartProps } from './ITestWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import HalfClientCategory from './HalfClientCategory';
// import DisplayDetails from './AccountView';

export default class TestWebPart extends React.Component<ITestWebPartProps, {}> {
  public render(): React.ReactElement<ITestWebPartProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      siteUrl,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID,
      TimeEntry,
      TaskTypeID,
      PortFolioTypeID,
      SiteCompostion
    } = this.props;

    return (
      <HalfClientCategory props={this.props}/>
    );
  }
}
