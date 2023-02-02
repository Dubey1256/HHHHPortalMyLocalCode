import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import HtmlEditorCard from "../HtmlEditor/HtmlEditor";
import AddCommentComponent from './AddCommentComponent';
import Example from "./SubCommentComponent";


const CommentBoxComponent = (commentData: any) => {
    const [commentArray, setCommentArray] = useState([])
    const CallBack = commentData.callBack;
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    var Array: any = [];
    useEffect(() => {
        let data: any = [];
        if (commentData.data != undefined) {
            let temp = commentData.data;
            data.push(temp[0])
            Array.push(temp[0])
        }
        setCommentArray(data);
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
        setTimeout(() => {
            CallBack(Array);
        }, 1000);
    }
    const HtmlEditorCallBack = useCallback((EditorData: any) => {
        if (Array.length > 0) {
            Array[0].Title = EditorData;
        }
        setTimeout(() => {
            CallBack(Array);
        }, 1000);

    }, [])
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
        setTimeout(() => {
            CallBack(Array);
        }, 1000);

    }, [])
    const subTextCallBack = useCallback((subTextData: any, commentId: any) => {
        Array[0].Subtext = subTextData;
        setTimeout(() => {
            CallBack(Array);
        }, 1000);
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
                                <div className="Task-panel d-flex  justify-content-end ">
                                    <span className="mx-1">
                                        <input className="form-check-input mx-1" type="checkbox"
                                            checked={obj.Phone}
                                            value={obj.Phone}
                                            name='Phone'
                                        />
                                        <label>Phone</label>
                                    </span>
                                    <span> | </span>
                                    <span className="mx-1">
                                        <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mx-1"
                                        />
                                        <label>
                                            Low Importance
                                        </label>
                                    </span>
                                    <span> | </span>
                                    <span className="mx-1">
                                        <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                            value={obj.HighImportance} className="form-check-input mx-1"
                                        />
                                        <label>
                                            High Importance 
                                        </label>
                                    </span>
                                    <span> | </span>
                                    <span className="mx-1">
                                        <input type="checkbox" id="" className="form-check-input mx-1"
                                            name='Completed' checked={obj.Completed} value={obj.Completed} />
                                        <label>
                                             Mark As Completed
                                        </label>
                                    </span>
                                    <span> | </span>
                                    <span className="mx-1">
                                        <span className="hreflink" style={{color:"#000066"}} onClick={() => postBtnHandle(i)}>Add Comment </span>
                                    </span>
                                  
                                </div>
                                <div className="d-flex">
                                    <span className="border p-1 me-1">{i + 1}</span>
                                    <HtmlEditorCard
                                        editorValue={obj.Title != undefined ? obj.Title : ''}
                                        HtmlEditorStateChange={HtmlEditorCallBack}
                                    >
                                    </HtmlEditorCard>
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