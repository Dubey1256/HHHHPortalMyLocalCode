import * as React from 'react';
import {IHhhhHrToolProps} from './IHhhhHrToolProps';
import EmployeeInfo from './EmployeeInfo';
export default class HhhhHrTool extends React.Component<IHhhhHrToolProps, {}> {
    public render(): React.ReactElement<IHhhhHrToolProps> {
        return(
         <div>
          <EmployeeInfo />
         </div>
         );
    }
}

