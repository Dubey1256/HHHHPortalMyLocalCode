import * as React from 'react';
// import styles from './HRcontractProfile.module.scss';
import { IHRcontractProfileProps } from './IHRcontractProfileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContractProfileTable from './contractProfile/ContractProfileTable';

export default class HRcontractProfile extends React.Component<IHRcontractProfileProps, {}> {
  public render(): React.ReactElement<IHRcontractProfileProps> {
  
    return (
     <div>
<ContractProfileTable/>
     </div>
    );
  }
}
