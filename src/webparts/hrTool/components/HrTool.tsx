import * as React from 'react';

import { IHrToolProps } from './IHrToolProps';
import { escape } from '@microsoft/sp-lodash-subset';
import EmployeeInfo from './EmployeeInfo';

export default class HrTool extends React.Component<IHrToolProps, {}> {
  public render(): React.ReactElement<IHrToolProps> {
 

    return (
    <EmployeeInfo/>
    );
  }
}
