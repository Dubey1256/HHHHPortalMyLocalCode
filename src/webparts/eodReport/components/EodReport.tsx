import * as React from 'react';
import type { IEodReportProps } from './IEodReportProps';
import { EodReportMain } from './EodReportMain';

export default class EodReport extends React.Component<IEodReportProps, {}> {
  public render(): React.ReactElement<IEodReportProps> {
    const data = this.props;


    return (
      <EodReportMain props={data} />
    );
  }
}
