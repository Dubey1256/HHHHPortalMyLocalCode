import * as React from 'react';

import type { ISMarttaskProps } from './ISMarttaskProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SmartTaskManagementMain } from './SmartTaskManagementMain';

export default class SMarttask extends React.Component<ISMarttaskProps, {}> {
  public render(): React.ReactElement<ISMarttaskProps> {
    const data = this.props;

    return (
      <SmartTaskManagementMain props={data}/>
    );
  }
}
