import * as React from 'react';
import ContactMainPage from './contact-search/contact-main';
import { IContactSearchProps } from './IContactSearchProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
// import { escape } from '@microsoft/sp-lodash-subset';
SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js');
SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css');

export default class ContactSearch extends React.Component<IContactSearchProps, {}> {
  public render(): React.ReactElement<IContactSearchProps> {
    const {
      userDisplayName,
      Context,
      HHHHContactListId,
      HHHHInstitutionListId,
      MAIN_SMARTMETADATA_LISTID,
      MAIN_HR_LISTID,
      ContractListID,
      GMBH_CONTACT_SEARCH_LISTID,
      HR_EMPLOYEE_DETAILS_LIST_ID,
    } = this.props;
    return (
     <div>
      {/* {escape(userDisplayName)} */}
       <ContactMainPage props={this.props} />
     </div>
    );
  }
}
