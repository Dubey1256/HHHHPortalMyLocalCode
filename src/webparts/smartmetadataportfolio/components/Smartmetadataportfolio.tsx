import * as React from 'react';
import { ISmartmetadataportfolioProps } from './ISmartmetadataportfolioProps';
import ManageSmartMetadata from './ManageSmartMetadata';

export default class Smartmetadataportfolio extends React.Component<ISmartmetadataportfolioProps, {}> {
  public render(): React.ReactElement<ISmartmetadataportfolioProps> {
 

    return (
      <div>
      <ManageSmartMetadata AllList={this.props} />
    </div>
    );
  }
}
