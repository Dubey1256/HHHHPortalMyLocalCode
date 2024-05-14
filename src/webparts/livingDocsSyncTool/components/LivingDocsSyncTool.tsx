import * as React from 'react';

import type { ILivingDocsSyncToolProps } from './ILivingDocsSyncToolProps';
import LivingDocsSyncToolTable from './LivingDocsSyncToolsTable';


export default class LivingDocsSyncTool extends React.Component<ILivingDocsSyncToolProps, {}> {
  public render(): React.ReactElement<ILivingDocsSyncToolProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      siteUrl,
      Context,
      SharewebNews,
      SharewebEvent,
      SharewebDocument,
      LivingNews,
      LivingEvent,
      LivingDocument,
    } = this.props;

    return (
      <>
     <LivingDocsSyncToolTable props={this.props}></LivingDocsSyncToolTable>
      </>
    );
  }
}
