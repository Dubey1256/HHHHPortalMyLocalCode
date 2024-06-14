import * as React from 'react';
import styles from './HhhhSmartPages.module.scss';
import type { IHhhhSmartPagesProps } from './IHhhhSmartPagesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SPSmartPages from './SPSmartPages'
export default class HhhhSmartPages extends React.Component<IHhhhSmartPagesProps, {}> {
  public render(): React.ReactElement<IHhhhSmartPagesProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <div>
      <SPSmartPages AllList={this.props} />
    </div>
    );
  }
}
