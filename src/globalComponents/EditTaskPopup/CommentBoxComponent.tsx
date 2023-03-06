import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
// import HtmlEditorCard from "../HtmlEditor/HtmlEditor";
import AddCommentComponent from './AddCommentComponent';
import Example from "./SubCommentComponent";
import FroalaCommentBox from '../FlorarComponents/FroalaCommentBoxComponent'

const CommentBoxComponent = (commentData: any) => {
    const [commentArray, setCommentArray] = useState([])
    const CallBack = commentData.callBack;
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    var Array: any = [];
    let ApprovalStatus: any = commentData.ApprovalStatus;
    let SmartLightPercentStatus: any = commentData.SmartLightPercentStatus;
    let SmartLightStatus: any = commentData.SmartLightStatus;
    useEffect(() => {
        let data: any = [];
        if (commentData.data != undefined) {
            let temp = commentData.data;
            temp.map((tempItem: any, index: 0) => {
                if (index == 0) {
                    data.push(tempItem);
                    Array.push(tempItem);
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
            Array.push(object)
        }
        setCommentArray(data);
        if (SmartLightStatus) {
            setIsDisabled(true);
        }
    }, [])

    function handleChangeComment(e: any) {
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...commentArray];
            const obj = { ...commentArray[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            setCommentArray(copy);
            Array = copy;
        }
        CallBack(Array);
    }
    const HtmlEditorCallBack = useCallback((EditorData: any) => {
        if (Array.length > 0) {
            Array[0].Title = EditorData;
        }
        CallBack(Array);
    }, [])

    const SmartLightUpdate = (index: any, value: any) => {
        const copy = [...commentArray];
        const obj = { ...commentArray[index], isShowLight: value };
        copy[index] = obj;
        setCommentArray(copy);
        Array = copy;
        CallBack(Array);
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
        Array[0].Comments = commentData;
        CallBack(Array);
    }, [])
    const subTextCallBack = useCallback((subTextData: any, commentId: any) => {
        Array[0].Subtext = subTextData;
        CallBack(Array);
    }, [])
    return (
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
                                <div className="Task-panel d-flex  justify-content-between">
                                    <div className={isDisabled ? "my-1" : "my-1 Disabled-Link"}>
                                        {ApprovalStatus ?
                                            <span className="MR5 ng-scope">
                                                <span title="Rejected" onClick={() => SmartLightUpdate(i, "Reject")}
                                                    className={obj.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                >
                                                </span>
                                                <span title="Maybe" onClick={() => SmartLightUpdate(i, "Maybe")} className={obj.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                </span>
                                                <span title="Approved" onClick={() => SmartLightUpdate(i, "Approve")} className={obj.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                                </span>
                                            </span>
                                            : null
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
                                <div className="d-flex">
                                    <span className="SubTestBorder p-1 me-1">{i + 1}</span>
                                    {/* <HtmlEditorCard
                                        editorValue={obj.Title != undefined ? obj.Title : ''}
                                        HtmlEditorStateChange={HtmlEditorCallBack}
                                    >
                                    </HtmlEditorCard> */}
                                    <FroalaCommentBox
                                        EditorValue={obj.Title != undefined ? obj.Title : ''}
                                        callBack={HtmlEditorCallBack}
                                    >
                                    </FroalaCommentBox>

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
                                    />
                                </div>
                                <div>
                                    <Example
                                        SubTextItemsArray={obj.Subtext ? obj.Subtext : []}
                                        index={1}
                                        commentId={obj.Id}
                                        callBack={subTextCallBack}
                                        allUsers={commentData.allUsers}
                                        ApprovalStatus={ApprovalStatus}
                                        SmartLightStatus={SmartLightStatus}
                                        SmartLightPercentStatus={SmartLightPercentStatus}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default CommentBoxComponent;