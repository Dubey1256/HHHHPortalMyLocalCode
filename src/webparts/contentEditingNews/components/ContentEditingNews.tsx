import * as React from 'react';
import { IContentEditingNewsProps } from './IContentEditingNewsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ContentEditingNewsTable from '../components/ContentEditingNewsTool';

export default class ContentEditingNews extends React.Component<IContentEditingNewsProps, {}> {
  public render(): React.ReactElement<IContentEditingNewsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
     <>
        <ContentEditingNewsTable props={this.props}></ContentEditingNewsTable>
     </>
    );
  }
}
