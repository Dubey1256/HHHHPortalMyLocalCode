import * as React from 'react';
import styles from './HRjointcontactprofile.module.scss';
import { IHRjointcontactprofileProps } from './IHRjointcontactprofileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MainProfile from './Contact-Profile/MainProfile';

export default class HRjointcontactprofile extends React.Component<IHRjointcontactprofileProps, {}> {
  public render(): React.ReactElement<IHRjointcontactprofileProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
    <div>
      <MainProfile/>
    </div>
    );
  }
}
