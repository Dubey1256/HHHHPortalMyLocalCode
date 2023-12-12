import * as React from 'react';

import { escape } from '@microsoft/sp-lodash-subset';
import ContractProfile from './ContractProfile';
import { IHrContractProfileProps } from './IHRcontractProfileProps'

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
