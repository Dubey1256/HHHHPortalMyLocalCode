import * as React from 'react';
import { IFeedbackProps } from './IFeedbackProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TimeReport from './TimeReport';

export default class Feedback extends React.Component<IFeedbackProps, {}> {
  public render(): React.ReactElement<IFeedbackProps> {
    const {
      Context,
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      TaskUsertListID,
      SmartMetadataListID,
    } = this.props;

    return (
     <>
<TimeReport ContextData={this.props}/>
     </>
    
    );
  }
}
