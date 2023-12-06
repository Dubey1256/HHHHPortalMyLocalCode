import * as React from 'react';
// import styles from './DocumentSearch.module.scss';
import { IDocumentSearchProps } from './IDocumentSearchProps';
import DocumentSearchPage from './DocumentSearchPage'
export default class DocumentSearch extends React.Component<IDocumentSearchProps, {}> {
  public render(): React.ReactElement<IDocumentSearchProps> {

    return (
      <DocumentSearchPage Selectedprops={this.props} />
    );
  }
}
