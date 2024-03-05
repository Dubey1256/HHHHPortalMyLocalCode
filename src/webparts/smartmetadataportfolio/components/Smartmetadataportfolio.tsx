import * as React from 'react';
import { ISmartmetadataportfolioProps } from './ISmartmetadataportfolioProps';
import ManageSmartMetadata from './ManageSmartMetadata';
import { myContextValue } from '../../../globalComponents/globalCommon';
export default class Smartmetadataportfolio extends React.Component<ISmartmetadataportfolioProps, {}> {
  public render(): React.ReactElement<ISmartmetadataportfolioProps> {
    return (
      <myContextValue.Provider value={{ ...myContextValue.defaultValue, OpenModal: null, RestructureTopIcon: true }}>
        <div>
          <ManageSmartMetadata AllList={this.props} />
        </div>
      </myContextValue.Provider>
    );
  }
}
export { myContextValue }
