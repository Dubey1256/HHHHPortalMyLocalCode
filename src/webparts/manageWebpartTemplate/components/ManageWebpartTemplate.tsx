import * as React from 'react';
import styles from './ManageWebpartTemplate.module.scss';
import { IManageWebpartTemplateProps } from './IManageWebpartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ManageWebpartTemplateConfig from './ManageWebpartTemplateConfig';

export default class ManageWebpartTemplate extends React.Component<IManageWebpartTemplateProps, {}> {
  public render(): React.ReactElement<IManageWebpartTemplateProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <>
        <ManageWebpartTemplateConfig props={this.props} />
      </>
    );
  }
}
