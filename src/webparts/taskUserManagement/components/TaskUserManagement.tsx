import * as React from 'react';

import { ITaskUserManagementProps } from './ITaskUserManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TaskUser from './TaskUser'

export default class TaskUserManagement extends React.Component<ITaskUserManagementProps, {}> {
  public render(): React.ReactElement<ITaskUserManagementProps> {
   

    return (
      <section>
        <TaskUser/>
      </section>
    );
  }
}
