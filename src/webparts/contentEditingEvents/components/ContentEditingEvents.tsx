import * as React from 'react';
import styles from './ContentEditingEvents.module.scss';
import { IContentEditingEventsProps } from './IContentEditingEventsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContentEditingEventsTable from '../components/ContentEditingEventsTool';

export default class ContentEditingEvents extends React.Component<IContentEditingEventsProps, {}> {
  public render(): React.ReactElement<IContentEditingEventsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <>
      <ContentEditingEventsTable props={this.props}></ContentEditingEventsTable>
   </>
    );
  }
}
