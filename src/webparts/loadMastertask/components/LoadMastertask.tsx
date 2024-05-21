import * as React from 'react';
import type { ILoadMastertaskProps } from './ILoadMastertaskProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AllMasterTaskLoad from './AllMasterTaskLoad';

export default class LoadMastertask extends React.Component<ILoadMastertaskProps, {}> {
  public render(): React.ReactElement<ILoadMastertaskProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      Context,
      userDisplayName,
      siteUrl,
      MasterTaskListID,
      TaskTypeID,
      TaskUserListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID,
      PortFolioTypeID,
      TimeEntry,
      SiteCompostion,
      SmartHelptListID

    } = this.props;

    return (   
     
     <><AllMasterTaskLoad props={this.props}/></>
      );
    }
}
