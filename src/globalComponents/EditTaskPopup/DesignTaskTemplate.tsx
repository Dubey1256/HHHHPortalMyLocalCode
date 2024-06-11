import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from "react";
import Example from "./FroalaCommnetBoxes";
import CommentBoxComponent from './CommentBoxComponent';
const DesignTaskTemplate = (props: any) => {
  
    return (
        <>
            <div>
                <span className='text-bold'>Objective</span>
                <CommentBoxComponent
                    data={props?.data}
                    callBack={props?.callBack}
                    allUsers={props?.allUsers}
                    ApprovalStatus={props?.ApprovalStatus}
                    SmartLightStatus={props?.SmartLightStatus}
                    SmartLightPercentStatus={props?.SmartLightPercentStatus}
                    Context={props?.Context}
                    FeedbackCount={props?.FeedbackCount}
                />
                <Example
                    textItems={props?.data}
                    callBack={props?.SubCommentSectionCallBack}
                    allUsers={props?.allUsers}
                    ItemId={props?.EditData.Id}
                    EditData={props?.EditData}
                    SiteUrl={props?.EditData.ComponentLink}
                    ApprovalStatus={props?.ApprovalStatus}
                    SmartLightStatus={props?.SmartLightStatus}
                    SmartLightPercentStatus={props?.SmartLightPercentStatus}
                    Context={props?.Context}
                    FeedbackCount={props?.FeedbackCount}
                    TaskUpdatedData={props?.MakeUpdateDataJSON}
                    TaskListDetails={props?.TaskListDetails}
                    taskCreatedCallback={props?.taskCreatedCallback}
                    DesignStatus={props?.DesignStatus}
                    currentUserBackupArray={props?.currentUserBackupArray}
                />
            </div>
        </>
    )
}
export default DesignTaskTemplate;