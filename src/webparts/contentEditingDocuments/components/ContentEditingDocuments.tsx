import * as React from 'react';
import styles from './ContentEditingDocuments.module.scss';
import { IContentEditingDocumentsProps } from './IContentEditingDocumentsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContentEditingDocumentsTable from '../components/ContentEditingDocumentsTool';

export default class ContentEditingDocuments extends React.Component<IContentEditingDocumentsProps, {}> {
  public render(): React.ReactElement<IContentEditingDocumentsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <>
      <ContentEditingDocumentsTable props={this.props}></ContentEditingDocumentsTable>
   </>
    );
  }
}
