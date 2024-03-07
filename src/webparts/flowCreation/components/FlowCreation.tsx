import * as React from 'react';
import type { IFlowCreationProps } from './IFlowCreationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import  FlowCreationCanvas  from './FlowCreationCanvas';
export default class FlowCreation extends React.Component<IFlowCreationProps, {}> {
  public render(): React.ReactElement<IFlowCreationProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <FlowCreationCanvas />
    );
  }
}
