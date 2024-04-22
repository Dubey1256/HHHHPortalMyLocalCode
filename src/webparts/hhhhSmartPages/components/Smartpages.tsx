import * as React from 'react';
import type { ISmartpagesProps } from './ISmartpagesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import GrueneSmartPages from './SPSmartPages'

export default class Smartpages extends React.Component<ISmartpagesProps, {}> {
  public render(): React.ReactElement<ISmartpagesProps> {
    return (
      <div>
        <GrueneSmartPages AllList={this.props} />
      </div>
    );
  }
}
