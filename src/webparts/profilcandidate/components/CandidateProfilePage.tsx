import * as React from 'react';
import { IProfilcandidateProps } from './IProfilcandidateProps';
import Profilcandidate from './CandiadteProfileWeb';

export default class ProfileCandidatePage extends React.Component<IProfilcandidateProps, {}> {
  public render(): React.ReactElement<IProfilcandidateProps> {
    const {   
      SkillsPortfolioListID,
      InterviewFeedbackFormListId,
      siteUrl
    } = this.props;

    return (
      <Profilcandidate props={this.props}/>
    );
  }
}