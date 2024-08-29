import * as React from 'react';
import type { IDocumentOutlookMailsProps } from './IDocumentOutlookMailsProps';
import AllOutlookMails from './AllOutlookMails';


export default class DocumentOutlookMails extends React.Component<IDocumentOutlookMailsProps, {}> {
  public render(): React.ReactElement<IDocumentOutlookMailsProps> {
   
    return (
      <>
       <AllOutlookMails AllData={this.props} />
      </>
    );
  }
}
