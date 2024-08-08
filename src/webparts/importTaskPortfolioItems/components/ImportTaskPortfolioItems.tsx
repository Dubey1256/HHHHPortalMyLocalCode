import * as React from 'react';
import { IImportTaskPortfolioItemsProps } from './IImportTaskPortfolioItemsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ImportExcel from './ImportUpdateData';

export default class ImportTaskPortfolioItems extends React.Component<IImportTaskPortfolioItemsProps, {}> {
  public render(): React.ReactElement<IImportTaskPortfolioItemsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      Context,
      hasTeamsContext,
      userDisplayName,
      MasterTaskListID
    } = this.props;

    return (
      <ImportExcel props={this.props}></ImportExcel>
    );
  }
}
