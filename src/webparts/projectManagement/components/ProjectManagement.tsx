import * as React from 'react';

import { IProjectManagementProps } from './IProjectManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ProjectManagementMain from './ProjectManagementMain';

export default class ProjectManagement extends React.Component<IProjectManagementProps, {}> {
  public render(): React.ReactElement<IProjectManagementProps> {
 

    return (
      <div>
       <ProjectManagementMain/> 
      </div>
    );
  }
}
