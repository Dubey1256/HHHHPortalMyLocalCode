import * as React from 'react';
import { ISmartDynamicTableProps } from './ISmartDynamicTableProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SmartTable from './SmartTable';

export default class SmartDynamicTable extends React.Component<ISmartDynamicTableProps, {}> {
  public render(): React.ReactElement<ISmartDynamicTableProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      Context,
      TableConfrigrationListId,
      siteUrl
    } = this.props;

    return (
      <>
        <SmartTable SelectedProp={this.props} />
      </>
    );
  }
}
