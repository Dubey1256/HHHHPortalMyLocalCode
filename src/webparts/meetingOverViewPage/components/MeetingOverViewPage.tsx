import * as React from 'react';
import styles from './MeetingOverViewPage.module.scss';
import { IMeetingOverViewPageProps } from './IMeetingOverViewPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MeetingProfile from './MeetingProfile'
export default class MeetingOverViewPage extends React.Component<IMeetingOverViewPageProps, {}> {
  public render(): React.ReactElement<IMeetingOverViewPageProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      siteUrl,
      Context,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID,
     TaskTypeID,
      TimeEntry,
      SiteCompostion,
    } = this.props;

    return (
   <MeetingProfile props={this.props}/>
    );
  }
}
