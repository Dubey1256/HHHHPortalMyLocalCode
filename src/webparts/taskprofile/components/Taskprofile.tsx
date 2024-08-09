

import * as React from 'react';
import type { ITaskprofileProps } from './ITaskprofileProps';
import TaskProfileComponent from './TaskProfileComponent';
export default class Taskprofile extends React.Component<ITaskprofileProps, {}> {
  public render(): React.ReactElement<ITaskprofileProps> {   
    return (
      <>
        <TaskProfileComponent props={this.props} />
      </>
    );
  }
}
