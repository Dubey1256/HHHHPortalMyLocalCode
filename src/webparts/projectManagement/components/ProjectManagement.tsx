import * as React from 'react';

import { IProjectManagementProps } from './IProjectManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ProjectManagementMain from './ProjectManagementMain';
// import TaggedPortfolio from './TaggedPortfolio';


export default class ProjectManagement extends React.Component<IProjectManagementProps, {}> {
  public render(): React.ReactElement<IProjectManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      pageContext
    } = this.props;
    return (
      <div>
       <ProjectManagementMain pageContext={this.props.pageContext}/> 
      </div>
    );
  }
}
