import * as React from 'react';

import { IHrContactSearchProps } from './IHrContactSearchProps';
import EmployeeDetails from './Contact_main';

export default class HrContactSearch extends React.Component<IHrContactSearchProps, {}> {
  public render(): React.ReactElement<IHrContactSearchProps> {
     
    return (
      <div>
       <EmployeeDetails />

      </div>
    )
  }
}
