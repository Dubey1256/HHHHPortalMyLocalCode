import * as React from 'react';
// import styles from './RecruitmentLandingPage.module.scss';
import { IRecruitmentLandingPageProps } from './IRecruitmentLandingPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import LandingPage from './LandingPage';

export default class RecruitmentLandingPage extends React.Component<IRecruitmentLandingPageProps, {}> {
  public render(): React.ReactElement<IRecruitmentLandingPageProps> {
    const {   
    } = this.props;

    return (
      <LandingPage props={this.props}></LandingPage>
    );
  }
}
