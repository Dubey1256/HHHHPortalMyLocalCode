import * as React from "react";
import { useState, useEffect } from 'react';
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { SystemUpdateTwoTone } from "@material-ui/icons";


const AddCommentComponent = (FbData: any) => {
    const FeedBackData = FbData.Data;
    const [FeedBackArray, setFeedBackArray] = useState([]);
    const [postTextInput, setPostTextInput] = useState('');
    const [currentUserData, setCurrentUserData] = useState([]);
    const [editPostPanel, setEditPostPanel] = useState(false);
    const [updateComment, setUpdateComment] = useState('');
    var Array: any = [];
    useEffect(() => {
        console.log(FeedBackData);
        if (FeedBackData != null && FeedBackData?.length > 0) {
            FeedBackData.map((dataItem: any) => {
                Array.push(dataItem);
            })
            setFeedBackArray(FeedBackData);
        }
        getCurrentUserDetails();
    }, [])

    const openEditModal = (comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any) => {
        setUpdateComment(comment);
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

    const PostButtonClick = (status: any, Index: any) => {
        let txtComment = postTextInput;
        if (txtComment != '') {
            let temp = {
                AuthorImage: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Item_x0020_Cover?.Url : "",
                AuthorName: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Title : "",
                Created: Moment(new Date().toLocaleString()).format('DD MMM YYYY HH:mm'),
                Title: txtComment
            };
            FeedBackArray.push(temp);

        }
        FbData.callBack(status, FeedBackArray, Index);
    }
    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });

        if (currentUserId != undefined) {
            if (FbData.allUsers != null && FbData.allUsers?.length > 0) {
                FbData.allUsers?.map((userData: any) => {
                    if (userData.AssingedToUserId == currentUserId) {
                        let temp: any = [];
                        temp.push(userData)
                        setCurrentUserData(temp);
                    }
                })
            }
        }
    }

    const editPostCloseFunction = () => {
        setEditPostPanel(false);
    }

    const updateCommentFunction = () => {

    }

    return (
        <div>
            <section className="previous-FeedBack-section">
                {FeedBackArray != null && FeedBackArray?.length > 0 ?
                    <div>
                        {FeedBackArray?.map((commentDtl: any, index: number) => {
                            return (
                                <div>
                                    <div className="col d-flex add_cmnt my-1">
                                        <div className="col-1 p-0">
                                            <img className="AssignUserPhoto1" src={commentDtl.AuthorImage != undefined && commentDtl.AuthorImage != '' ?
                                                commentDtl.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                        </div>
                                        <div className="col-11 pe-0" >
                                            <div className='d-flex justify-content-between align-items-center'>
                                                {commentDtl.AuthorName} - {commentDtl.Created}
                                                <span>
                                                    <a className="ps-1" onClick={() => openEditModal(commentDtl.Title, index, 0, false)}><img src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif'></img></a>
                                                    <a className="ps-1" onClick={() => clearComment(true, index, 0)}><img src='/_layouts/images/delete.gif'></img></a>
                                                </span>
                                            </div>
                                            <div><span dangerouslySetInnerHTML={{ __html: commentDtl.Title }}></span></div>
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
                        <section className="Post-FeedBack-section">
                            <div className="border pb-5">
                                <div className="col mt-2 mx-3">
                                    <textarea id="txtComment" onChange={(e) => handleChangeInput(e)} className="form-control full-width" ></textarea>
                                </div>
                                <div className="float-end pt-1 me-3">
                                    <button type="button" className="post btn btn-primary " onClick={() => PostButtonClick(FbData.postStatus, FbData.index)}>Post</button>
                                </div>
                            </div>
                        </section>
                        : null
                }
            </div>
            <section className="Update-FeedBack-section">
                <Panel headerText={`Update Comment`}
                    isOpen={editPostPanel}
                    onDismiss={editPostCloseFunction}
                    isBlocking={false}
                    type={PanelType.custom}
                    customWidth="500px"
                >
                    <div className="parentDiv">
                        <div style={{ width: '99%', marginTop: '2%', padding: '2%' }}>
                            <textarea id="txtUpdateComment" rows={6} onChange={(e) => setUpdateComment(e.target.value)} style={{ width: '100%', marginLeft: '3px' }} defaultValue={updateComment ? updateComment : ''}>
                            </textarea>
                        </div>
                        <footer className="float-end">
                            <button className="btn btnPrimary" onClick={updateCommentFunction}>
                                Save
                            </button>
                            <button className='btn btn-default mx-1' onClick={editPostCloseFunction}>
                                Cancel
                            </button>

                        </footer>
                    </div>
                </Panel>
            </section>
        </div>
    )
}
export default AddCommentComponent;