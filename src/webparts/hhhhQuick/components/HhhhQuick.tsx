import * as React from 'react';
import { IHhhhQuickProps } from './IHhhhQuickProps';
import HHHHQuickPanel from './HHHHQuickPanel';

export default class HhhhQuick extends React.Component<IHhhhQuickProps, {}> {
  public render(): React.ReactElement<IHhhhQuickProps> {
    return (
      <HHHHQuickPanel {...this.props}/>
    );
  }
}
