import * as React from 'react';
import { IContactDatabaseProps } from './IContactDatabaseProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContactSearch from './ContactSearch';

export default class ContactDatabase extends React.Component<IContactDatabaseProps, {}> {
  public render(): React.ReactElement<IContactDatabaseProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      Context,
      hasTeamsContext,
      userDisplayName,
      TeamContactSearchlistIds,
      TeamSmartMetadatalistIds
    } = this.props;

    return (
      <ContactSearch props={this.props}></ContactSearch>
    );
  }
}
