import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";

const AddCommentComponent = (FbData: any) => {
    const FeedBackData = FbData.Data;
    const Context = FbData.Context;
    const isCurrentUserApprover: any = FbData.isCurrentUserApprover;
    const [FeedBackArray, setFeedBackArray] = useState([]);
    const [postTextInput, setPostTextInput] = useState('');
    const [currentUserData, setCurrentUserData] = useState<any>([]);
    const [editPostPanel, setEditPostPanel] = useState(false);
    const [MarkAsApproval, setMarkAsApproval] = useState(false);
    const [updateComment, setUpdateComment] = useState({
        Title: "",
        Index: "",
        SubTextIndex: "",
        isApprovalComment: false,
    });
    const [ApprovalPointUserData, setApprovalPointUserData] = useState<any>([]);
    const [ApprovalPointCurrentIndex, setApprovalPointCurrentIndex] = useState('');
    const [ApprovalPointHistoryStatus, setApprovalPointHistoryStatus] = useState(false);
    const ApprovalStatus = FbData.ApprovalStatus;
    var Array: any = [];
    useEffect(() => {
        console.log(FeedBackData);
        let tempArray: any = [];
        if (FeedBackData != null && FeedBackData?.length > 0) {
            FeedBackData.map((dataItem: any) => {
                if (dataItem.ApproverData == undefined) {
                    dataItem.ApproverData = [];
                }
                Array.push(dataItem);
                tempArray.push(dataItem);
            })
            setFeedBackArray(tempArray);
        }
        getCurrentUserDetails();
    }, [])

    const openEditModal = (comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any) => {
        const commentDetails: any = {
            Title: comment,
            Index: indexOfUpdateElement,
            SubTextIndex: indexOfSubtext,
            isApprovalComment: false,
        }
        setUpdateComment(commentDetails);
        setEditPostPanel(true);
    }
    const clearComment = (isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any) => {
        let tempArray: any = [];
        FeedBackArray?.map((item: any, index: any) => {
            if (index != indexOfDeleteElement) {
                tempArray.push(item);
            }
        })
        setFeedBackArray(tempArray);
        FbData.callBack(isSubtextComment, tempArray, indexOfDeleteElement);
    }
    const handleChangeInput = (e: any) => {
        setPostTextInput(e.target.value)
    }

    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
        if (currentUserId != undefined) {
            if (FbData.allUsers != null && FbData.allUsers?.length > 0) {
                FbData.allUsers?.map((userData: any) => {
                    if (userData.AssingedToUserId == currentUserId) {
                        let TempObject: any = {
                            Title: userData.Title,
                            Id: userData.AssingedToUserId,
                            ImageUrl: userData.Item_x0020_Cover?.Url,
                            ApprovalDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                        }
                        setCurrentUserData(TempObject);
                    }
                })
            }
        }
    }
    const PostButtonClick = (status: any, Index: any) => {
        let txtComment = postTextInput;
        let date = new Date()
        let timeStamp = date.getTime()
        if (txtComment != '') {
            let temp = {
                AuthorImage: currentUserData != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                AuthorName: currentUserData != null && currentUserData.length > 0 ? currentUserData.Title : Context.pageContext._user.displayName,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,
                NewestCreated: timeStamp,
                editableItem: false,
                isApprovalComment: MarkAsApproval,
                isShowLight: '',
            };
            FeedBackArray.push(temp);
        }
        FbData.callBack(status, FeedBackArray, Index);
        setMarkAsApproval(false)
    }
    const editPostCloseFunction = () => {
        setEditPostPanel(false);
    }
    const updateCommentFunction = (e: any, CommentData: any) => {
        FeedBackArray[CommentData.Index].Title = e.target.value;
        FbData.callBack(true, FeedBackArray, 0);
    }
    const cancelCommentBtn = () => {
        FbData.CancelCallback(true);
    }
    const UpdateIsApprovalStatus = (index: any) => {
        FeedBackArray[index].isApprovalComment = false;
        FeedBackArray[index].isShowLight = '';
        FbData.callBack(true, FeedBackArray, 0);
    }
    const SmartLightUpdateSubComment = (index: any, value: any) => {
        let temObject: any = {
            Title: currentUserData.Title != undefined ? currentUserData.Title : Context.pageContext._user.displayName,
            Id: currentUserData.Id,
            ImageUrl: currentUserData.ImageUrl != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
            ApprovalDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            isShowLight: value
        }
        currentUserData.isShowLight = value;
        FeedBackArray[index].isShowLight = value;
        FeedBackArray[index].ApproverData?.push(temObject);
        FbData.callBack(true, FeedBackArray, 0);
        let ApproverDataTemp: any = FeedBackArray[index].ApproverData;
        const copy = [...FeedBackArray];
        const obj = { ...FeedBackArray[index], isShowLight: value, ApproverData: ApproverDataTemp };
        copy[index] = obj;
        setFeedBackArray(copy);
    }

    // ********************* this is for the Approval Point History Popup ************************

    // const ApprovalPointPopupClose = () => {
    //     setApprovalPointHistoryStatus(false)
    // }

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
                <section className="previous-FeedBack-section clearfix">
                    {FeedBackArray != null && FeedBackArray?.length > 0 ?
                        <div>
                            {FeedBackArray?.map((commentDtl: any, index: number) => {
                                return (
                                    <div className="FeedBack-comment">
                                        {ApprovalStatus ?
                                            <>
                                                {commentDtl.isApprovalComment != undefined && commentDtl.isApprovalComment == true ?
                                                    <div className='add_cmnt borde-0 border-0 col-10 d-flex float-end justify-content-between m-0 my-1 p-0 align-autoplay'>
                                                        <div className={isCurrentUserApprover ? "alignCenter" : "alignCenter Disabled-Link"}>
                                                            {/* {isCurrentUserApprover ?  */}
                                                            <span className="MR5">
                                                                <span title="Rejected"
                                                                    onClick={() => SmartLightUpdateSubComment(index, "Reject")}
                                                                    className={commentDtl.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                                >
                                                                </span>
                                                                <span title="Maybe" onClick={() => SmartLightUpdateSubComment(index, "Maybe")} className={commentDtl.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                                </span>
                                                                <span title="Approved" onClick={() => SmartLightUpdateSubComment(index, "Approve")} className={commentDtl.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>
                                                                </span>
                                                            </span>
                                                            {/* : null } */}
                                                            {commentDtl.ApproverData != undefined && commentDtl.ApproverData.length > 0 ?
                                                                <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(index, commentDtl)}>
                                                                    Pre-approved by - <span className="ms-1"><a title={commentDtl.ApproverData[commentDtl.ApproverData.length - 1]?.Title}><img className='imgAuthor' src={commentDtl.ApproverData[commentDtl.ApproverData.length - 1]?.ImageUrl} /></a></span>
                                                                </span> : null
                                                            }
                                                        </div>
                                                        <div className="">
                                                            <input type="checkbox" defaultChecked={commentDtl.isApprovalComment} onClick={() => UpdateIsApprovalStatus(index)} className="form-check-input m-0 me-1 mt-1 rounded-0" />
                                                            <label>Mark as Approval Comment</label>
                                                        </div>
                                                    </div>
                                                    : null}
                                            </> :
                                            null}
                                        <div className={`col-10 d-flex float-end add_cmnt my-1 ${commentDtl.isShowLight}`} title={commentDtl.isShowLight}>
                                            <div className="">
                                                <img style={{ width: "40px", borderRadius: "50%", height: "40px", margin: "5px" }} src={commentDtl.AuthorImage != undefined && commentDtl.AuthorImage != '' ?
                                                    commentDtl.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                            </div>
                                            <div className="col-11 pe-0 mt-2 ms-1" >
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <span className=" font-weight-normal">
                                                        {commentDtl.AuthorName} - {commentDtl.Created}
                                                    </span>
                                                    <span>
                                                        <a className="ps-1" onClick={() => openEditModal(commentDtl.Title, index, 0, false)}><img src={require('../../Assets/ICON/edit_page.svg')} width="25" /></a>
                                                        <a className="ps-1" onClick={() => clearComment(true, index, 0)}><img src={require('../../Assets/ICON/cross.svg')} width="25"></img></a>
                                                    </span>
                                                </div>
                                                <div>
                                                    <span dangerouslySetInnerHTML={{ __html: commentDtl.Title }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        : null
                    }
                </section>
                <div>
                    {
                        FbData.postStatus ?
                            <section className="mt-1 clearfix">
                                {ApprovalStatus ? <div className="col-10 d-flex float-end">
                                    <input type="checkbox" onClick={() => setMarkAsApproval(true)} className="form-check-input m-0 me-1 mt-1 rounded-0" />
                                    <label className="siteColor">Mark as Approval Comment</label>
                                </div> : null}
                                <div className="col-10 d-flex float-end my-1">
                                    <textarea id="txtComment SubTestBorder" style={{ height: "40px" }} onChange={(e) => handleChangeInput(e)} className="full-width" ></textarea>
                                    <button type="button" className="post btn btn-primary mx-1" onClick={() => PostButtonClick(FbData.postStatus, FbData.index)}>Post</button>
                                    <button type="button" className="post btn btn-default" onClick={cancelCommentBtn}>Cancel</button>
                                </div>
                            </section>
                            : null
                    }
                </div>
                <section className="Update-FeedBack-section">
                    <Panel headerText={`Update Comment`}
                        isOpen={editPostPanel}
                        onDismiss={editPostCloseFunction}
                        isBlocking={editPostPanel}
                        type={PanelType.custom}
                        customWidth="500px"
                    >
                        <div className="parentDiv">
                            <div style={{ width: '99%', marginTop: '2%', padding: '2%' }}>
                                <textarea id="txtUpdateComment" rows={6} onChange={(e) => updateCommentFunction(e, updateComment)} style={{ width: '100%', marginLeft: '3px' }} defaultValue={updateComment ? updateComment.Title : ''}>
                                </textarea>
                            </div>
                            <footer className="d-flex justify-content-between ms-3 mx-2">
                                <div className="d-flex">
                                    <input type="checkbox" defaultChecked={updateComment ? (updateComment.isApprovalComment ? true : false) : false} className="form-check-input m-0 me-1 mt-1 rounded-0" />
                                    <label className="siteColor">Mark as Approval Comment</label>
                                </div>
                                <div>
                                    <button className="btn btnPrimary" onClick={editPostCloseFunction}>
                                        Save
                                    </button>
                                    <button className='btn btn-default mx-1' onClick={editPostCloseFunction}>
                                        Cancel
                                    </button>
                                </div>
                            </footer>
                        </div>
                    </Panel>
                </section>
            </div>
            {ApprovalPointHistoryStatus ?
                <ApprovalHistoryPopup
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
export default AddCommentComponent;