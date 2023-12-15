import * as React from 'react';
import  InterviewFeedbackForm  from '../../helloSpfx/components/InterviewFeedbackForm';
// import styles from './HelloSpfx.module.scss';
import { IHelloSpfxProps } from './IHelloSpfxProps';
// import { escape } from '@microsoft/sp-lodash-subset';

function HelloSpfx(props: IHelloSpfxProps) {
  const {
  description,
  isDarkTheme,
  environmentMessage,
  hasTeamsContext,
  userDisplayName,
  Context,
  HHHHContactListId,
  HHHHInstitutionListId,
  MAIN_SMARTMETADATA_LISTID,
  MAIN_HR_LISTID,
  GMBH_CONTACT_SEARCH_LISTID,
  HR_EMPLOYEE_DETAILS_LIST_ID,
  InterviewFeedbackFormListId,
  ContractListID
  } = props;
  return (
    <InterviewFeedbackForm props ={props}/>
  );
}

export default HelloSpfx;