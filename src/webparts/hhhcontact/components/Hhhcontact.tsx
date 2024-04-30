import * as React from 'react';
import styles from './Hhhcontact.module.scss';
import type { IHhhcontactProps } from './IHhhcontactProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContactSearch from './ContactSearch';
export default class Hhhcontact extends React.Component<IHhhcontactProps, {}> {
  public render(): React.ReactElement<IHhhcontactProps> {
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
