import * as React from 'react';
// import styles from './ParentPortfolioView.module.scss';
import { IParentPortfolioViewProps } from './IParentPortfolioViewProps';
import ParentportfolioPage from "./ParentportfolioPage"

export default class ParentPortfolioView extends React.Component<IParentPortfolioViewProps, {}> {
  public render(): React.ReactElement<IParentPortfolioViewProps> {
    const MasterTaskListID = this.props;

    return (
      <>
      <ParentportfolioPage props={MasterTaskListID}/>
      </>
      
    );
  }
}
