import * as React from 'react';
import type { IEventHomeSpFxProps } from './IEventHomeSpFxProps';
import EventHome from './EventHome';


export default class EventHomeSpFx extends React.Component<IEventHomeSpFxProps, {}> {
  public render(): React.ReactElement<IEventHomeSpFxProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      siteUrl,
      siteType,
      EventsListID,
      SitePagesList
    } = this.props;

    return (
      <div>
       <EventHome props={this.props} />
      </div>
    );
  }
}
