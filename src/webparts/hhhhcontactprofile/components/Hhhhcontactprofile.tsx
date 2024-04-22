import * as React from 'react';
import styles from './Hhhhcontactprofile.module.scss';
import type { IHhhhcontactprofileProps } from './IHhhhcontactprofileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContactProfileComponent from './ContactProfileComponent';
export default class Hhhhcontactprofile extends React.Component<IHhhhcontactprofileProps, {}> {
  public render(): React.ReactElement<IHhhhcontactprofileProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      Context,
      userDisplayName,
      TeamContactSearchlistIds,
      TeamSmartMetadatalistIds
    } = this.props;

    return (
      <ContactProfileComponent props={this.props}></ContactProfileComponent>
    );
  }
}
