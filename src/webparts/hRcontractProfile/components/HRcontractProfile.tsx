import * as React from 'react';
import { IHrContractProfileProps } from './IHrContractProfileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContractProfile from './ContractProfile';

export default class HrContractProfile extends React.Component<IHrContractProfileProps, {}> {
  public render(): React.ReactElement<IHrContractProfileProps> {
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
      <div>
        <ContractProfile props={this.props}/>
      </div>
    );
  }
}
