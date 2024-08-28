import * as React from 'react';
import { IInstitutionProfileProps } from './IInstitutionProfileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import InstitutionProfileComponent from './centralizeInstitutionProfile';

export default class InstitutionProfile extends React.Component<IInstitutionProfileProps, {}> {
  public render(): React.ReactElement<IInstitutionProfileProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      TeamContactSearchlistIds,
      TeamInstitutionlistIds,
      TeamSmartMetadatalistIds,
      siteUrl,
      MainsiteUrl,
    } = this.props;
    return (
      <InstitutionProfileComponent props={this.props}></InstitutionProfileComponent>
    );
  }
}
