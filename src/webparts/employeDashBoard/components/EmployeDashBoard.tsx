import * as React from 'react';

import { IEmployeDashBoardProps } from './IEmployeDashBoardProps';


import EmployeeProfile from './EmployeeProfile'

export default class EmployeDashBoard extends React.Component<IEmployeDashBoardProps, {}> {
  public render(): React.ReactElement<IEmployeDashBoardProps> {
   
    return (
   <>
   
   <EmployeeProfile props={this.props} />

   </>
    );
  }
}
