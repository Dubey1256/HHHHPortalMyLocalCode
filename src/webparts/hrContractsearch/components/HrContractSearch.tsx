import * as React from 'react';
import { IHrContractSearchProps } from './IHrContractSearchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContractSearch from './ContractSearch'

export default class HrContractSearch extends React.Component<IHrContractSearchProps, {}> {
  public render(): React.ReactElement<IHrContractSearchProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      ContractListID,
      siteUrl
    } = this.props;

    return (
      <>
      <ContractSearch props={this.props}/>
      </>
    );
  }
}
