import * as React from 'react';
import { IEmployeProfileProps } from './IEmployeProfileProps';
import EmployeProfileMain from './EmployeProfileMain';
export default class EmployeProfile extends React.Component<IEmployeProfileProps, {}> {
  public render(): React.ReactElement<IEmployeProfileProps> {
    const {
      userDisplayName,
      Context,
      HHHHContactListId,
      HHHHInstitutionListId,
      MAIN_SMARTMETADATA_LISTID,
      MAIN_HR_LISTID,
      GMBH_CONTACT_SEARCH_LISTID,
      HR_EMPLOYEE_DETAILS_LIST_ID,
      ContractListID,
    } = this.props;

    return (
    <EmployeProfileMain props={this?.props}/>
    );
  }
}
