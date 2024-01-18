import * as React from 'react';

import { escape } from '@microsoft/sp-lodash-subset';
import ContractProfile from './ContractProfile';
import { IHRcontractProfileProps } from './IHRcontractProfileProps';

export default class HrContractProfile extends React.Component<IHRcontractProfileProps, {}> {
  public render(): React.ReactElement<IHRcontractProfileProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      ContractListID,
      siteUrl,
      MAIN_SMARTMETADATA_LISTID,
      MAIN_HR_LISTID,
      HR_EMPLOYEE_DETAILS_LIST_ID
    } = this.props;

    return (
      <div>
        <ContractProfile props={this.props}/>
      </div>
    );
  }
}
