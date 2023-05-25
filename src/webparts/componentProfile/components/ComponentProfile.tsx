import * as React from 'react';
import { IComponentProfileProps } from './IComponentProfileProps';
import Portfolio from './Portfoliop';

export default class ComponentProfile extends React.Component<IComponentProfileProps, {}> {
 

  public render(): React.ReactElement<IComponentProfileProps> {
    const {
      Context,
      dropdownvalue,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
    } = this.props;

   
    return (
      <div>
      <Portfolio SelectedProp={this.props} />
      </div>
    );
  }
}
