import * as React from 'react';
import styles from './HhhhProfile.module.scss';
import type { IHhhhProfileProps } from './IHhhhProfileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SPProfilePages from './ProfilePages'

export default class HhhhProfile extends React.Component<IHhhhProfileProps, {}> {
  public render(): React.ReactElement<IHhhhProfileProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <div>
        <SPProfilePages AllList={this.props} />
      </div>
    );
  }
}
