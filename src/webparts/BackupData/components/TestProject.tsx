import * as React from "react";
import { ITestProjectProps } from "./ITestProjectProps";
import SiteDataBackupTool from "./SiteDataBackupTool";

export default class TestProject extends React.Component<
  ITestProjectProps,
  {}
> {
  public render(): React.ReactElement<ITestProjectProps> {
    //const { TestListID } = this.props;
    return (
      <div>
        <SiteDataBackupTool AllList={this.props} />
      </div>
    );
  }
}
