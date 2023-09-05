import * as React from 'react';
import GetDraft from './getTaskItem';
import { IMydraftTaskProps } from './IMydraftTaskProps';
export default class MydraftTask extends React.Component<IMydraftTaskProps, {}> {
  public render(): React.ReactElement<IMydraftTaskProps> {
    const smartMetadata= this.props;
    return (
      <>
      <GetDraft search={smartMetadata}/>
      </>
    );
  }
}
