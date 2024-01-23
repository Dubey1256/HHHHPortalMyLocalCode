import * as React from 'react';
import type { IManagedashboardconfigProps } from './IManagedashboardconfigProps';
import DashboardConfiguration from './DashboardConfiguration';

export default class Managedashboardconfig extends React.Component<IManagedashboardconfigProps, {}> {
  public render(): React.ReactElement<IManagedashboardconfigProps> {    
    return (
      <>
        <DashboardConfiguration props={this.props} />
      </>
    );
  }
}
