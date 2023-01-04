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
      userDisplayName
    } = this.props;
    return (
     <div>
      {/* {escape(userDisplayName)} */}
       <ContactMainPage loggedInUserName={userDisplayName} />
     </div>
    );
  }
}
