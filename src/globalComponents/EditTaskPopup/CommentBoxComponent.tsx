import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import HtmlEditorCard from "../HtmlEditor/HtmlEditor";
import AddCommentComponent from './AddCommentComponent';
import Example from "./SubCommentComponent";
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";
// import FroalaCommentBox from '../FlorarComponents/FroalaCommentBoxComponent'

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
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...commentArray];
            const obj = { ...commentArray[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            if (name == "Phone") {
                FirstFeedBackArray[id].Phone = (value == "true" ? false : true)
            }
            if (name == "LowImportance") {
                FirstFeedBackArray[id].LowImportance = (value == "true" ? false : true)
            }
            if (name == "HighImportance") {
                FirstFeedBackArray[id].HighImportance = (value == "true" ? false : true)
            }
            if (name == "Completed") {
                FirstFeedBackArray[id].Completed = (value == "true" ? false : true)
            }
            setCommentArray(copy);
            Array = copy;
        }
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
        // currentUserData.isShowLight = value;
        FirstFeedBackArray[index].isShowLight = value;
        FirstFeedBackArray[index].ApproverData.push(temObject);
        let tempApproverData: any = FirstFeedBackArray[index].ApproverData;
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
                                                    {/* {isCurrentUserApprover ? */}
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
                                                    {/* : null } */}
                                                </div>
                                                : null
                                            }
                                            {obj.ApproverData != undefined && obj.ApproverData.length > 0 ?
                                                <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(i, obj)}>
                                                    Pre-approved by - <span className="ms-1"><a title={obj.ApproverData[obj.ApproverData.length - 1]?.Title}><img className='imgAuthor' src={obj.ApproverData[obj.ApproverData.length - 1]?.ImageUrl} /></a></span>
                                                </span> :
                                                null
                                            }
                                        </div>

                                        <div>
                                            <span className="mx-1">
                                                <input className="form-check-input m-0 rounded-0 commentSectionLabel " type="checkbox"
                                                    checked={obj.Phone}
                                                    value={obj.Phone}
                                                    name='Phone'
                                                />
                                                <label className="commentSectionLabel ms-1">Phone</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input m-0 rounded-0 commentSectionLabel "
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    Low Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                                    value={obj.HighImportance} className="form-check-input m-0 rounded-0 commentSectionLabel "
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    High Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" id="" className="form-check-input m-0 rounded-0 commentSectionLabel "
                                                    name='Completed' checked={obj.Completed} value={obj.Completed} />
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
                                        {/* <FroalaCommentBox
                                            EditorValue={obj.Title != undefined ? obj.Title : ''}
                                            callBack={HtmlEditorCallBack}
                                        >
                                        </FroalaCommentBox> */}

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
                                            isCurrentUserApprover={isCurrentUserApprover}
                                        />
                                    </div>
                                    <div>
                                        <Example
                                            SubTextItemsArray={obj.Subtext ? obj.Subtext : []}
                                            index={1}
                                            commentId={obj.Id}
                                            callBack={subTextCallBack}
                                            currentIndex={0}
                                            allUsers={commentData.allUsers}
                                            ApprovalStatus={ApprovalStatus}
                                            SmartLightStatus={SmartLightStatus}
                                            SmartLightPercentStatus={SmartLightPercentStatus}
                                            Context={Context}
                                            isCurrentUserApprover={isCurrentUserApprover}
                                            isFirstComment = {true}
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