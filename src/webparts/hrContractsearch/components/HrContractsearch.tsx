import * as React from 'react';
// import styles from './HrContractsearch.module.scss';
import { IHrContractsearchProps } from './IHrContractsearchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContractData from './Contract';

export default class HrContractsearch extends React.Component<IHrContractsearchProps, {}> {
  public render(): React.ReactElement<IHrContractsearchProps> {
   
    return ( 
      <ContractData />
    );
  }
}
