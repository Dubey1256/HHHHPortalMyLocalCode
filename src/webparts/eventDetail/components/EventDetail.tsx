import * as React from 'react';
import styles from './EventDetail.module.scss';
import type { IEventDetailProps } from './IEventDetailProps';
import { escape } from '@microsoft/sp-lodash-subset';
import EventDetailmain from './EventDetailMain'
export default class EventDetail extends React.Component<IEventDetailProps, {}> {
  public render(): React.ReactElement<IEventDetailProps> {
    return (
      <>
        <EventDetailmain props={this.props} />
      </>
    );
  }
}
