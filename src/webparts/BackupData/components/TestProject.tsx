import * as React from "react";
import { ITestProjectProps } from "./ITestProjectProps";
import GetMethod from "./SiteDataBackupTool";

export default class TestProject extends React.Component<
  ITestProjectProps,
  {}
> {
  public render(): React.ReactElement<ITestProjectProps> {
    //const { TestListID } = this.props;
    return (
      <div>
        <GetMethod AllList={this.props} />
      </div>
    );
  }
}
