import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from "react";
import Example from "./FroalaCommnetBoxes";
import CommentBoxComponent from './CommentBoxComponent';
import UXFeedbackComponent from './UXFeedbackComponent';
const UXDesignPopupTemplate = (props: any) => {
    let firstIndexData:any=[props?.data[0]]
    const designFeedbackData=React.useRef<any>()
  const ObjectiveDataCallback=(objectiveData:any)=>{
    firstIndexData=objectiveData
  }
  const setDesignNewTemplatesCallback=(TemplatesData:any)=>{
    let copyTemplatesData:any=[];
    if(firstIndexData?.length>0){
        copyTemplatesData = firstIndexData.concat(TemplatesData);
    }else{
        copyTemplatesData = TemplatesData;
    }
   props.DesignTemplatesCallback(copyTemplatesData)
  }
    return (
        <>
            <div>
                <span className='text-bold'>Objective</span>
                <CommentBoxComponent
                    data={props?.data}
                    callBack={ObjectiveDataCallback}
                    allUsers={props?.allUsers}
                    ApprovalStatus={props?.ApprovalStatus}
                    SmartLightStatus={props?.SmartLightStatus}
                    SmartLightPercentStatus={props?.SmartLightPercentStatus}
                    Context={props?.Context}
                    FeedbackCount={props?.FeedbackCount}
                />
                <UXFeedbackComponent
                    textItems={props?.data}
                    callBack={setDesignNewTemplatesCallback}
                    allUsers={props?.allUsers}
                    ItemId={props?.EditData.Id}
                    EditData={props?.EditData}
                    SiteUrl={props?.EditData.ComponentLink}
                    ApprovalStatus={props?.ApprovalStatus}
                    SmartLightStatus={props?.SmartLightStatus}
                    SmartLightPercentStatus={props?.SmartLightPercentStatus}
                    Context={props?.Context}
                    FeedbackCount={props?.FeedbackCount}
                    TaskListDetails={props?.TaskListDetails}
                    taskCreatedCallback={props?.taskCreatedCallback}
                    UXStatus={props?.UXStatus}
                    currentUserBackupArray={props?.currentUserBackupArray}
                />
            </div>
        </>
    )
}
export default UXDesignPopupTemplate;