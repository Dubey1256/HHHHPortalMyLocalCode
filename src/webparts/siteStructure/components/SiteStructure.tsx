import * as React from 'react';
import { ISiteStructureProps } from './ISiteStructureProps';
import SiteStructureTool from './SiteStructureManagement'
export default class SiteStructure extends React.Component<ISiteStructureProps, {}> {
  public render(): React.ReactElement<ISiteStructureProps> {

    return (
      <>
        <SiteStructureTool Selectedprops={this.props} />
      </>
    );
  }
}
