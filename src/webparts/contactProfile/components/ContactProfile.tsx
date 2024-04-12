import * as React from 'react';
import { IContactProfileProps } from './IContactProfileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContactProfileComponent from './ContactProfileComponent';

export default class ContactProfile extends React.Component<IContactProfileProps, {}> {
  public render(): React.ReactElement<IContactProfileProps> {
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
