import * as React from 'react';
import styles from './MaterialUi.module.scss';
import { IMaterialUiProps } from './IMaterialUiProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Table from './MaterialU';


export default class MaterialUi extends React.Component<IMaterialUiProps, {}> {
  public render(): React.ReactElement<IMaterialUiProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <Table/>
    );
  }
}
