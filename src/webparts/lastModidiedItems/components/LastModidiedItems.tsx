import * as React from 'react';
import { ILastModidiedItemsProps } from './ILastModidiedItemsProps';
import { Modified } from './modified';


export default class LastModidiedItems extends React.Component<ILastModidiedItemsProps, {}> {
  public render(): React.ReactElement<ILastModidiedItemsProps> {
    const data=this.props;

    return (
      <>
      <Modified props={data} />
      </>
    );
  }
}
