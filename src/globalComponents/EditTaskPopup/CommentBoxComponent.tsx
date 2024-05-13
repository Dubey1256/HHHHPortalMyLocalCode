import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import HtmlEditorCard from "../HtmlEditor/HtmlEditor";
import AddCommentComponent from './AddCommentComponent';
import Example from "./SubCommentComponent";
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";
// import FroalaEditorComponent from '../FlorarComponents/FroalaEditorComponent';

const CommentBoxComponent = (commentData: any) => {
    const Context = commentData.Context;
    const [commentArray, setCommentArray] = useState([])
    const CallBack = commentData.callBack;
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    const [isCurrentUserApprover, setIsCurrentUserApprover] = useState(false);
    const [FirstFeedBackArray, setFirstFeedBackArray] = useState([]);
    const [currentUserData, setCurrentUserData] = useState<any>([]);
    const [ApprovalPointUserData, setApprovalPointUserData] = useState<any>([]);
    const [ApprovalPointCurrentIndex, setApprovalPointCurrentIndex] = useState('');
    const [ApprovalPointHistoryStatus, setApprovalPointHistoryStatus] = useState(false);

    var Array: any = [];
    let ApprovalStatus: any = commentData.ApprovalStatus;
    let SmartLightPercentStatus: any = commentData.SmartLightPercentStatus;
    let SmartLightStatus: any = commentData.SmartLightStatus;
    useEffect(() => {
        let data: any = [];
        if (commentData.data != undefined && commentData.data.length > 0) {
            let temp = commentData.data;
            temp.map((tempItem: any, index: 0) => {
                if (index == 0) {
                    if (tempItem.ApproverData == undefined) {
                        tempItem.ApproverData = [];
                    }
                    data.push(tempItem);
                    Array.push(tempItem);
                    FirstFeedBackArray.push(tempItem);
                }
            })
        } else {
            const object = {
                Completed: "",
                Title: "",
                text: "",
                SeeAbove: '',
                Phone: '',
                LowImportance: '',
                HighImportance: '',
                isShowLight: ''
            };
            data.push(object);
            Array.push(object);
            FirstFeedBackArray.push(object);
        }
        data?.forEach((ele: any) => {
            if (ele.ApproverData != undefined && ele.ApproverData.length > 0) {
                ele.ApproverData?.forEach((ba: any) => {
                    if (ba.isShowLight == 'Reject') {
                        ba.Status = 'Rejected by'
                    }
                    if (ba.isShowLight == 'Approve') {
                        ba.Status = 'Approved by '
                    }
                    if (ba.isShowLight == 'Maybe') {
                        ba.Status = 'For discussion with'
                    }


                })
            }
        })
        setCommentArray(data);
        setFirstFeedBackArray(data);
        if (SmartLightStatus) {
            setIsCurrentUserApprover(true);
        }
        getCurrentUserDetails();
    }, [])

    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
        if (currentUserId != undefined) {
            if (commentData.allUsers != null && commentData.allUsers?.length > 0) {
                commentData.allUsers?.map((userData: any) => {
                    if (userData.AssingedToUserId == currentUserId) {
                        let TempObject: any = {
                            Title: userData.Title,
                            Id: userData.AssingedToUserId,
                            ImageUrl: userData.Item_x0020_Cover?.Url,
                            ApprovalDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm')
                        }
                        setCurrentUserData(TempObject);
                    }
                })
            }
        }
    }


    function handleChangeComment(e: any) {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        const { name, type, checked, value } = e.target;
        let updatedValue = type === "checkbox" ? checked : value;
        if (name === "SeeAbove") {
            let newTitle = FirstFeedBackArray[id].Title;
            const seeText = ` (See ${id + 1})`;
            if (updatedValue) {
                if (!newTitle.includes(seeText)) {
                    newTitle += seeText;
                }
            } else {
                newTitle = newTitle.replace(seeText, "").trim();
            }
            FirstFeedBackArray[id].Title = newTitle;
            FirstFeedBackArray[id].SeeAbove = updatedValue;
        } else if (type === "textarea") {
            FirstFeedBackArray[id].Title = updatedValue;
        } else if (type === "checkbox") {
            FirstFeedBackArray[id][name] = updatedValue;
        }
        const updatedCommentArray = commentArray.map((item, idx) => {
            if (idx === id) {
                return {
                    ...item,
                    Title: FirstFeedBackArray[id].Title,
                    [name]: updatedValue
                };
            }
            return item;
        });
        setCommentArray(updatedCommentArray);
        CallBack(FirstFeedBackArray);
    }

    const HtmlEditorCallBack = useCallback((EditorData: any) => {
        FirstFeedBackArray[0].Title = EditorData;
        CallBack(FirstFeedBackArray);
    }, [])

    const SmartLightUpdate = (index: any, value: any) => {
        let temObject: any = {
            Title: currentUserData.Title != undefined ? currentUserData.Title : Context.pageContext._user.displayName,
            Id: currentUserData.Id,
            ImageUrl: currentUserData.ImageUrl != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
            ApprovalDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            isShowLight: value
        }
        FirstFeedBackArray[index].isShowLight = value;
        FirstFeedBackArray[index].ApproverData.push(temObject);
        let tempApproverData: any = FirstFeedBackArray[index].ApproverData;
        FirstFeedBackArray?.forEach((ele: any) => {
            if (ele.ApproverData != undefined && ele.ApproverData.length > 0) {
                ele.ApproverData?.forEach((ba: any) => {
                    if (ba.isShowLight == 'Reject') {
                        ba.Status = 'Rejected by'
                    }
                    if (ba.isShowLight == 'Approve') {
                        ba.Status = 'Approved by '
                    }
                    if (ba.isShowLight == 'Maybe') {
                        ba.Status = 'For discussion with'
                    }


                })
            }
        })
        CallBack(FirstFeedBackArray);
        const copy = [...commentArray];
        const obj = { ...commentArray[index], isShowLight: value, ApproverData: tempApproverData };
        copy[index] = obj;
        setCommentArray(copy);
        Array = copy;
    }

    const postBtnHandle = (index: any) => {
        setCurrentIndex(index)
        if (postBtnStatus) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
    }
    const postBtnHandleCallBack = useCallback((status: any, commentData: any, Index: any) => {
        if (status) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
        FirstFeedBackArray[0].Comments = commentData;
        Array[0].Comments = commentData;
        CallBack(FirstFeedBackArray);
    }, [])

    const postBtnHandleCallBackCancel = useCallback((status: any) => {
        if (status) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
    }, [])

    const subTextCallBack = useCallback((subTextData: any, commentId: any) => {
        FirstFeedBackArray[0].Subtext = subTextData;
        Array[0].Subtext = subTextData;
        CallBack(FirstFeedBackArray);
    }, [])

    // *********************** this is Approval History Popup Function *************************
    const ApprovalPopupOpenHandle = (index: any, data: any) => {
        setApprovalPointCurrentIndex(index);
        setApprovalPointHistoryStatus(true);
        setApprovalPointUserData(data);
    }

    const ApprovalHistoryPopupCallBack = useCallback(() => {
        setApprovalPointHistoryStatus(false)
    }, [])

    return (
        <div>
            <div>
                {
                    commentArray?.map((obj, i) => {
                        return (
                            <div className="row">
                                <div
                                    data-id={i}
                                    className="col"
                                    onChange={handleChangeComment}
                                >
                                    <div className="Task-panel d-flex justify-content-between">
                                        <div className="d-flex">
                                            {ApprovalStatus ?
                                                <div>

                                                    <div className={isCurrentUserApprover ? "alignCenter mt-1" : "alignCenter Disabled-Link mt-1"}>
                                                        <span className="MR5">
                                                            <span title="Rejected" onClick={() => SmartLightUpdate(i, "Reject")}
                                                                className={obj.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                            >
                                                            </span>
                                                            <span title="Maybe" onClick={() => SmartLightUpdate(i, "Maybe")} className={obj.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                            </span>
                                                            <span title="Approved" onClick={() => SmartLightUpdate(i, "Approve")} className={obj.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>
                                                            </span>
                                                        </span>
                                                    </div>

                                                </div>
                                                : null
                                            }
                                             {obj.ApproverData != undefined && obj.ApproverData.length > 0 ?
                                                <>
                                                   
                                                            <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(i, obj)}>
                                                            {obj?.ApproverData[obj?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={obj?.ApproverData[obj.ApproverData?.length - 1]?.Title}><span><a href={`${Context.pageContext.web.absoluteUrl}/SitePages/TaskDashboard.aspx?UserId=${obj.ApproverData[obj.ApproverData?.length - 1]?.Id}&Name=${obj.ApproverData[obj.ApproverData?.length - 1]?.Title}`} target="_blank" data-interception="off" title={obj.ApproverData[obj.ApproverData?.length - 1]?.Title}> <img className='imgAuthor' src={obj.ApproverData[obj.ApproverData?.length - 1]?.ImageUrl} /></a></span></a></span>
                                                      
                                                </> :
                                                null
                                            }
                                        </div>

                                        <div>
                                            <span className="mx-1">

                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="Phone"
                                                    checked={obj.Phone}

                                                />
                                                <label className="commentSectionLabel ms-1">Phone</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="LowImportance"
                                                    checked={obj.LowImportance}
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    Low Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="HighImportance"
                                                    checked={obj.HighImportance}
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    High Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">

                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="Completed"
                                                    checked={obj.Completed}

                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    Mark As Completed
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <span className="hreflink siteColor commentSectionLabel" onClick={() => postBtnHandle(i)}>Add Comment </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`d-flex`} title={obj.isShowLight}>
                                        <span className="SubTestBorder p-1 me-1">{i + 1}</span>
                                        <HtmlEditorCard
                                            editorValue={obj.Title != undefined ? obj.Title : ''}
                                            HtmlEditorStateChange={HtmlEditorCallBack}
                                        >
                                        </HtmlEditorCard>
                                        {/* <FroalaEditorComponent
                                            EditorValue={obj.Title != undefined ? obj.Title : ''}
                                            callBack={HtmlEditorCallBack}
                                        >
                                        </FroalaEditorComponent> */}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <AddCommentComponent
                                            Data={obj.Comments != null ? obj.Comments : []}
                                            allFbData={commentArray}
                                            index={currentIndex}
                                            postStatus={postBtnStatus}
                                            allUsers={commentData.allUsers}
                                            callBack={postBtnHandleCallBack}
                                            CancelCallback={postBtnHandleCallBackCancel}
                                            Context={Context}
                                            ApprovalStatus={ApprovalStatus}
                                            SmartLightStatus={obj?.isShowLight}
                                            isCurrentUserApprover={isCurrentUserApprover}
                                        />
                                    </div>
                                    <div>
                                        <Example
                                            SubTextItemsArray={obj.Subtext ? obj.Subtext : []}
                                            index={0}
                                            commentId={obj.Id}
                                            callBack={subTextCallBack}
                                            currentIndex={0}
                                            allUsers={commentData.allUsers}
                                            ApprovalStatus={ApprovalStatus}
                                            SmartLightStatus={SmartLightStatus}
                                            SmartLightPercentStatus={SmartLightPercentStatus}
                                            Context={Context}
                                            isCurrentUserApprover={isCurrentUserApprover}
                                            isFirstComment={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {ApprovalPointHistoryStatus ? <ApprovalHistoryPopup
                ApprovalPointUserData={ApprovalPointUserData}
                ApprovalPointCurrentIndex={ApprovalPointCurrentIndex}
                ApprovalPointHistoryStatus={ApprovalPointHistoryStatus}
                callBack={ApprovalHistoryPopupCallBack}
            />
                : null
            }
        </div>
    )
}
export default CommentBoxComponent;