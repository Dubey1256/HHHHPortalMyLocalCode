import * as React from 'react';
import type { ILastModifiedProps } from './ILastModifiedProps';
import { Modified } from './modifiedNew';
export default class LastModified extends React.Component<ILastModifiedProps, {}> {
  public render(): React.ReactElement<ILastModifiedProps> {
    const data=this.props;
    return (
      <Modified props={data} />
    );
  }
}
