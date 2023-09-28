import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";
import Tooltip from '../Tooltip';
import { ImReply } from 'react-icons/im';
import {
    mergeStyleSets,
    FocusTrapCallout,
    FocusZone,
    FocusZoneTabbableElements,
    FontWeights,
    Stack,
    Text,
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

const AddCommentComponent = (FbData: any) => {
    const FeedBackData = FbData.Data;
    const Context = FbData.Context;
    const isCurrentUserApprover: any = FbData.isCurrentUserApprover;
    const [FeedBackArray, setFeedBackArray] = useState([]);
    const [postTextInput, setPostTextInput] = useState('');
    const [currentUserData, setCurrentUserData] = useState<any>([]);
    const [editPostPanel, setEditPostPanel] = useState(false);
    const [MarkAsApproval, setMarkAsApproval] = useState(false);
    const [updateComment, setUpdateComment] = useState<any>({
        Title: "",
        Index: "",
        SubTextIndex: "",
        isApprovalComment: false,
        ReplyMessages: []
    });
    const ApprovalStatus = FbData.ApprovalStatus;
    const SmartLightStatus = FbData.SmartLightStatus;
    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
    const [currentDataIndex, setCurrentDataIndex] = useState<any>(0);
    const [ReplyMessageText, setReplyMessageText] = useState('');
    const buttonId = useId(`callout-button`);
    const [EditModelUsedFor, setEditModelUsedFor] = useState('');
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
    }, [FbData.FeedbackCount])

    const openEditModal = (comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, usedFor: any) => {
        const commentDetails: any = {
            Title: comment,
            Index: indexOfUpdateElement,
            SubTextIndex: indexOfSubtext,
            isApprovalComment: false
        }
        setUpdateComment(commentDetails);
        setEditPostPanel(true);
        setEditModelUsedFor(usedFor)
    }
    const clearComment = (isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any) => {
        let tempArray: any = [];
        FeedBackArray?.map((item: any, index: any) => {
            if (index != indexOfDeleteElement) {
                tempArray.push(item);
            }
        })
        setFeedBackArray(tempArray);
        FbData.callBack(isSubtextComment, tempArray, indexOfSubtext);
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
            let temp: any = {
                AuthorImage: currentUserData != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                AuthorName: currentUserData != null && currentUserData.length > 0 ? currentUserData.Title : Context.pageContext._user.displayName,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,
                NewestCreated: timeStamp,
                editableItem: false,
                isApprovalComment: MarkAsApproval,
                isShowLight: MarkAsApproval ? SmartLightStatus : '',
                ReplyMessages: []
            };
            FeedBackArray.unshift(temp);
        }
        FbData.callBack(status, FeedBackArray, Index);
        setMarkAsApproval(false)
    }
    const editPostCloseFunction = () => {
        setEditPostPanel(false);
    }
    const updateCommentFunction = (e: any, CommentData: any, usedFor: any) => {
        if (usedFor == "ParentComment") {
            FeedBackArray[CommentData.Index].Title = e.target.value;
            FbData.callBack(true, FeedBackArray, 0);
        }
        if (usedFor == "ReplyComment") {
            FeedBackArray[CommentData.SubTextIndex].ReplyMessages[CommentData.Index].Title = e.target.value;
            FbData.callBack(true, FeedBackArray, 0);
        }

    }
    const cancelCommentBtn = () => {
        FbData.CancelCallback(true);
    }
   
   

    // ********************* this is for the Approval Point History Popup ************************

 
    const onRenderCustomHeader = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div className="subheading siteColor">
                        {`Update Comment`}
                </div>
                <Tooltip ComponentId='1683' />
            </div>
        );
    }

    // this is used for the Reply Comment Section 

    const OpenCallOutFunction = (IndexData: any) => {
        setCurrentDataIndex(IndexData);
        toggleIsCalloutVisible();
    }

    const updateReplyMessagesFunction = (e: any) => {
        setReplyMessageText(e.target.value);
    }

    const SaveReplyMessageFunction = () => {
        let ReplyMessageObject: any = {
            AuthorImage: currentUserData != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
            AuthorName: currentUserData != null && currentUserData.length > 0 ? currentUserData.Title : Context.pageContext._user.displayName,
            Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            Title: ReplyMessageText,
        }
        if (FeedBackArray[currentDataIndex].ReplyMessages == undefined) {
            FeedBackArray[currentDataIndex].ReplyMessages = [];
        }
        FeedBackArray[currentDataIndex].ReplyMessages.push(ReplyMessageObject);
        FbData.callBack(true, FeedBackArray, 0);
        toggleIsCalloutVisible();
    }

    const DeleteReplyMessageFunction = (ReplyMsgIndex: any, ParentIndex: any) => {
        let tempArray: any = [];
        FeedBackArray?.map((item: any, index: any) => {
            if (index == ParentIndex) {
                item.ReplyMessages.splice(ReplyMsgIndex, 1);
                tempArray.push(item)
            } else {
                tempArray.push(item)
            }
        })
        setFeedBackArray(tempArray);
        FbData.callBack(true, tempArray, 0);
        // FbData.callBack(isSubtextComment, tempArray, indexOfSubtext);
    }
    const styles = mergeStyleSets({
        callout: {
            width: 700,
            padding: '20px 24px',
        },
        title: {
            fontWeight: 500,
            fontSize:21,
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 20,
        },
    });

    return (
        <div>
            <div>
                <section className="previous-FeedBack-section clearfix">
                    {FeedBackArray != null && FeedBackArray?.length > 0 ?
                        <div>
                            {FeedBackArray?.map((commentDtl: any, index: number) => {
                                return (
                                    <div className="FeedBack-comment">
                                        <div className={`col-12 d-flex float-end add_cmnt my-1 ${commentDtl.isShowLight}`} title={commentDtl.isShowLight}>
                                            <div className="">
                                                <img className="workmember" src={commentDtl.AuthorImage != undefined && commentDtl.AuthorImage != '' ?
                                                    commentDtl.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                            </div>
                                            <div className="col-11 pe-0 ms-2" >
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <span className="font-weight-normal">
                                                        {commentDtl.AuthorName} - {commentDtl.Created}
                                                    </span>
                                                    <span className="align-baseline d-flex">
                                                        <a className="ps-1" title="Comment Reply" >
                                                            <div data-toggle="tooltip" id={buttonId + "-" + index}
                                                                onClick={() => OpenCallOutFunction(index)}
                                                                data-placement="bottom">
                                                               <span className="svg__iconbox svg__icon--reply"></span>
                                                            </div>
                                                        </a>
                                                        <a className="ps-1" title="Edit Comment" onClick={() => openEditModal(commentDtl.Title, index, FbData?.index, false, "ParentComment")}><span className="svg__iconbox svg__icon--editBox"></span></a>
                                                        <a className="ps-1" title="Delete Comment" onClick={() => clearComment(true, index, FbData?.index)}><span className="svg__icon--trash svg__iconbox"></span></a>
                                                    </span>
                                                </div>
                                                <div>
                                                    <span dangerouslySetInnerHTML={{ __html: commentDtl.Title }}></span>
                                                </div>
                                                {commentDtl.ReplyMessages != undefined && commentDtl.ReplyMessages?.length > 0 ?
                                                    <div>
                                                        {commentDtl.ReplyMessages?.map((ReplyDtl: any, ReplyIndex: any) => {
                                                            return (
                                                                <div key={ReplyIndex} className="border d-flex my-2 p-1">
                                                                    <div>
                                                                        <img className="workmember" src={ReplyDtl.AuthorImage != undefined && ReplyDtl.AuthorImage != '' ?
                                                                            ReplyDtl.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                                        />
                                                                    </div>
                                                                    <div className="full-width">
                                                                        <div className='d-flex justify-content-between align-items-center'>
                                                                            <span className="font-weight-normal ms-2">
                                                                                {ReplyDtl.AuthorName} - {ReplyDtl.Created}
                                                                            </span>
                                                                            <span className="align-baseline d-flex">
                                                                                <a className="ps-1" title="Edit Comment" onClick={() => openEditModal(ReplyDtl.Title, ReplyIndex, index, false, "ReplyComment")}><span className="svg__iconbox svg__icon--editBox"></span></a>
                                                                                <a className="ps-1" title="Delete Comment" onClick={() => DeleteReplyMessageFunction(ReplyIndex, index)}><span className="svg__icon--trash svg__iconbox"></span></a>
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span dangerouslySetInnerHTML={{ __html: ReplyDtl.Title }}></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}

                                                    </div> : null
                                                }
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
                                {ApprovalStatus ? <div className="col-10 d-flex float-end my-1 align-autoplay">
                                    <input type="checkbox" onClick={() => setMarkAsApproval(true)} className="form-check-input m-0 me-1 mt-1 rounded-0" />
                                    <label className="siteColor">Mark as Approval Comment</label>
                                </div> : null}
                                <div className="col-10 d-flex float-end my-1 align-autoplay">
                                    <textarea id="txtComment SubTestBorder" style={{ height: "33px" }} onChange={(e) => handleChangeInput(e)} className="full-width" ></textarea>
                                    <button type="button" className="post btn btn-primary mx-1" onClick={() => PostButtonClick(FbData.postStatus, FbData.index)}>Post</button>
                                    <button type="button" className="post btn btn-default" onClick={cancelCommentBtn}>Cancel</button>
                                </div>
                            </section>
                            : null
                    }
                </div>
                <section className="Update-FeedBack-section">
                    <Panel
                        onRenderHeader={onRenderCustomHeader}
                        isOpen={editPostPanel}
                        onDismiss={editPostCloseFunction}
                        isBlocking={editPostPanel}
                        type={PanelType.custom}
                        customWidth="500px"
                    >
                            <div>
                                <textarea className="full-width" id="txtUpdateComment" rows={6} onChange={(e) => updateCommentFunction(e, updateComment, EditModelUsedFor)} defaultValue={updateComment ? updateComment.Title : ''}>
                                </textarea>
                            </div>
                            <footer className="d-flex justify-content-between mt-1 float-end">
                                <div>
                                    <button className="btn btnPrimary mx-1" onClick={editPostCloseFunction}>
                                        Save
                                    </button>
                                    <button className='btn btn-default' onClick={editPostCloseFunction}>
                                        Cancel
                                    </button>
                                </div>
                            </footer>
                    </Panel>
                </section>
            </div>
          
            {isCalloutVisible ? (
                <FocusTrapCallout
                    role="alertdialog"
                    className={styles.callout}
                    gapSpace={0}
                    target={`#${buttonId}-${currentDataIndex}`}
                    onDismiss={toggleIsCalloutVisible}
                    setInitialFocus
                >
                    <Text block variant="xLarge" className={styles.title}>
                        <span className="siteColor">Comment Reply</span>
                    </Text>
                    <Text block variant="small">
                        <div className="d-flex">
                            <textarea className="form-control" onChange={(e) => updateReplyMessagesFunction(e)}></textarea>
                        </div>

                    </Text>
                    <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                        <Stack className={styles.buttons} gap={8} horizontal>
                            {/* <PrimaryButton onClick={SaveReplyMessageFunction}>Save</PrimaryButton>
                            <DefaultButton onClick={toggleIsCalloutVisible}>Cancel</DefaultButton> */}
                            <button type="button" className="btnCol btn btn-primary" onClick={SaveReplyMessageFunction}>Save</button>
                            <button type="button" className="btnCol btn btn-default" onClick={toggleIsCalloutVisible}>Cancel</button>
                        </Stack>
                    </FocusZone>
                </FocusTrapCallout>
            ) : null
            }
        </div>
    )
}
export default AddCommentComponent;