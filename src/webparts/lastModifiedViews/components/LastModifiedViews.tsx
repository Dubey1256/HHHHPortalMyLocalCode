import * as React from 'react';
import { ILastModifiedViewsProps } from './ILastModifiedViewsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Modified } from './modified';

export default class LastModifiedViews extends React.Component<ILastModifiedViewsProps, {}> {
  public render(): React.ReactElement<ILastModifiedViewsProps> {
    const data=this.props;
    return (
      <>
      <Modified props={data} />
      </>
    );
  }
}
