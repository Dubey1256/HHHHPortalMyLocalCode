import * as React from 'react';
import { IHrContractSearchProps } from './IHrContractSearchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContractSearch from './ContractSearch'

export default class HrContractSearch extends React.Component<IHrContractSearchProps, {}> {
  public render(): React.ReactElement<IHrContractSearchProps> {
    const {
    
      ContractListID,
      siteUrl,
      userDisplayName,
      Context,
      HHHHContactListId,
      HHHHInstitutionListId,
      MAIN_SMARTMETADATA_LISTID,
      MAIN_HR_LISTID,
      GMBH_CONTACT_SEARCH_LISTID,
      HR_EMPLOYEE_DETAILS_LIST_ID,

    } = this.props;

    return (
      <>
      <ContractSearch props={this.props}/>
      </>
    );
  }
}
