import * as React from 'react';
import { IManageQuestionProps } from './IManageQuestionProps';
import ManageQuestions from './ManageQuestionTable'

export default class ManageQuestion extends React.Component<IManageQuestionProps, {}> {
  public render(): React.ReactElement<IManageQuestionProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      SmartHelpListID,
      MasterTaskListID,
      siteUrl
    } = this.props;

    return (
      <ManageQuestions props={this.props}/>
    );
  }
}
