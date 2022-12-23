import * as React from 'react';
// import styles from './HRjointcontactserach.module.scss';
import { IHRjointcontactserachProps } from './IHRjointcontactserachProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class HRjointcontactserach extends React.Component<IHRjointcontactserachProps, {}> {
  public render(): React.ReactElement<IHRjointcontactserachProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <div>
        
      </div>
    );
  }
}
