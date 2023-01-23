import * as React from 'react';
import ContractProfileTable from './ContractProfileTable';
// import styles from './ContractProfile.module.scss';
import { IContractProfileProps } from './IContractProfileProps';
// import { escape } from '@microsoft/sp-lodash-subset';

export default class ContractProfile extends React.Component<IContractProfileProps, {}> {
  public render(): React.ReactElement<IContractProfileProps> {
    
    return (
      <>
      <ContractProfileTable/>
      </>
    );
  }
}
