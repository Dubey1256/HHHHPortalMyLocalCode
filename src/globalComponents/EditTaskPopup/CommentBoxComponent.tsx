import * as React from "react";
import { useState, useEffect, useCallback } from 'react';
import HtmlEditorCard from "../HtmlEditor/HtmlEditor";

const CommentBoxComponent = (commentData: any) => {
    const [commentArray, setCommentArray] = useState([])
    useEffect(() => {
        let data: any = [];
        if (commentData.data != undefined) {
            let temp = commentData.data;
            data.push(temp[0])
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
            console.log("comment box object =====", commentArray);
        }
    }
    const HtmlEditorCallBack = useCallback((EditorData: any) => {
        const copy = [...commentArray];
        const obj = { ...commentArray[0], 
            Title: EditorData,
            Completed: commentArray[0].Completed,
            text: commentArray[0].text,
            Phone: commentArray[0].Phone,
            LowImportance: commentArray[0].LowImportance,
            HighImportance: commentArray[0].HighImportance,
            Id:commentArray[0].Id,
            Comments:commentArray[0].Comments,
            isAddComment:commentArray[0].isAddComment,
            isShowComment:commentArray[0].isShowComment,
            isPageType:commentArray[0].isPageType
         };
        copy[0] = obj;
        setCommentArray(copy);
        console.log("comment html box object =====", commentArray);
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
                                    <span className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                            checked={obj.Phone}
                                            value={obj.Phone}
                                            name='Phone'
                                        />
                                        <label>Phone</label>
                                    </span>
                                    <span className="form-check">
                                        <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input"
                                        />
                                        <label>
                                            Low Importance
                                        </label>
                                    </span>
                                    <span>|</span>
                                    <span className="form-check">
                                        <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                            value={obj.HighImportance} className="form-check-input"
                                        />
                                        <label>
                                            High Importance
                                        </label>
                                    </span>
                                    <span>|</span>
                                    <span className="form-check">
                                        <input type="checkbox" id="" className="form-check-input"
                                            name='Completed' checked={obj.Completed} value={obj.Completed} />
                                        <label>
                                            Mark As Completed
                                        </label>
                                    </span>
                                    <span>|</span>
                                    <span className="form-check">
                                        <a href="#"> Add Comment </a>
                                    </span>
                                    <span>|</span>

                                </div>
                                <div className="d-flex">
                                    <span className="border p-1 me-1">{i + 1}</span>
                                    <HtmlEditorCard
                                        editorValue={obj.Title != undefined ? obj.Title : ''}
                                        HtmlEditorStateChange={HtmlEditorCallBack}
                                    >
                                    </HtmlEditorCard>
                                </div>
                            </div >
                        </div>
                    )
                })
            }

        </div>
    )
}
export default CommentBoxComponent;