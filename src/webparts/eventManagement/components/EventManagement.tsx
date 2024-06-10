import * as React from 'react';
// import styles from './EventManagement.module.scss';
import type { IEventManagementProps } from './IEventManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import EventManagementmain from './EventmanagementMain';
export default class EventManagement extends React.Component<IEventManagementProps, {}> {
  public render(): React.ReactElement<IEventManagementProps> {

    return (
      <>
        <EventManagementmain props={this.props} />
      </>
    );
  }
}
