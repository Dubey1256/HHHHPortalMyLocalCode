import * as React from 'react';
import styles from './MeetingOverview.module.scss';
import { IMeetingOverviewProps } from './IMeetingOverviewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MeetingOverviewMain from './MeetingOverviewMain';

export default class MeetingOverview extends React.Component<IMeetingOverviewProps, {}> {
  public render(): React.ReactElement<IMeetingOverviewProps> {
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
      SiteCompostion,
      SmalsusLeaveCalendar,
      TaskTypeID
    } = this.props;

    return (
      <MeetingOverviewMain props={this.props}/>
    );
  }
}
