import * as React from 'react';
import ContractData from './Contract';
import { IContractSearchProps } from './IContractSearchProps';


export default class ContractSearch extends React.Component<IContractSearchProps, {}> {
  public render(): React.ReactElement<IContractSearchProps> {
    
    return (
     <div>
      <ContractData />
    
     </div>
    );
  }
}
