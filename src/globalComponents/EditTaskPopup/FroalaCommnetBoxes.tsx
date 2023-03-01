import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import Example from "./SubCommentComponent";
import AddCommentComponent from './AddCommentComponent'

export default function FroalaCommnetBoxes(textItems: any) {
    const TextItems = textItems.textItems;
    const callBack = textItems.callBack;
    const ItemId: any = textItems.ItemId;
    const SiteUrl = textItems.SiteUrl
    const [State, setState] = useState([]);
    const [Texts, setTexts] = useState(false);
    const [btnStatus, setBtnStatus] = useState(false);
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    let ApprovalStatus: any = textItems.ApprovalStatus;
    let SmartLightPercentStatus: any = textItems.SmartLightPercentStatus;
    let SmartLightStatus: any = textItems.SmartLightStatus;
    var Array: any = [];
    const addRow = () => {
        let testTaskIndex = State?.length + 1
        const object = {
            Completed: "",
            Title: "",
            text: "",
            taskIndex: testTaskIndex,
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: ''
        };
        State.push(object);
        Array.push(object);
        setTexts(!Texts);
        setBtnStatus(true);
    }
    useEffect(() => {
        if (TextItems != undefined && TextItems.length > 0) {
            setBtnStatus(true)
            TextItems.map((item: any, index: any) => {
                if (index > 0) {
                    item.taskIndex = index;
                    State.push(item);
                    setTexts(!Texts);
                    Array.push(item)
                }
            })
        } else {
            setBtnStatus(false)
        }
        if (SmartLightStatus) {
            setIsDisabled(true);
        }
    }, [])
    const RemoveItem = (dltItem: any) => {
        let tempArray: any = []
        State.map((array: any) => {
            if (dltItem.taskIndex != array.taskIndex) {
                tempArray.push(array);
            }
        })
        Array = [];
        tempArray?.map((tempDataItem: any) => {
            Array.push(tempDataItem);
        })

        if (tempArray?.length == 0) {
            setBtnStatus(false)
            setTimeout(() => {
                callBack("delete");
            }, 1000);
        } else {
            setTimeout(() => {
                callBack(tempArray);
            }, 1000);
        }
        setState(tempArray);
    }

    function handleChange(e: any) {
        if (e.target.matches("textarea")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...State];
            const obj = { ...State[id], [name]: value };
            copy[id] = obj;
            setState(copy);
            Array = copy;
        }
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...State];
            const obj = { ...State[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            setState(copy);
            Array = copy
        }
        setTimeout(() => {
            callBack(Array);
        }, 1000);
    }

    const subTextCallBack = useCallback((subTextData: any, commentId: any) => {
        let arrayIndex: number;
        Array?.map((data: any, index: any) => {
            if (data.Id == commentId) {
                arrayIndex = index;
            }
        })
        if (arrayIndex != undefined) {
            Array[arrayIndex].Subtext = subTextData;
        }
        setTimeout(() => {
            callBack(Array);
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
    const postBtnHandleCallBack = useCallback((status: any, dataPost: any, Index: any) => {
        if (status) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
        Array[Index].Comments = dataPost;
        setTimeout(() => {
            callBack(Array);
        }, 1000);
    }, [])

    const SmartLightUpdateSubComment = (index: any, value: any) => {
        const copy = [...State];
        const obj = { ...State[index], isShowLight: value };
        copy[index] = obj;
        setState(copy);
        Array = copy;
        setTimeout(() => {
            callBack(Array);
        }, 1000);
    }
    function createRows(state: any[]) {
        return (
            <div className="add-text-box">
                {state?.map((obj, i) => {
                    return (
                        <div className="row my-1">
                            <div
                                data-id={i}
                                className="col"
                                onChange={handleChange}
                            >
                                <div className="Task-panel d-flex justify-content-between ">
                                    <div className={isDisabled ? "my-1" : "my-1 Disabled-Link"}>{ApprovalStatus ?
                                        <span className="MR5 ng-scope" ng-disabled="Item.PercentComplete >= 80">
                                            <span title="Rejected" onClick={() => SmartLightUpdateSubComment(i, "Reject")}
                                                className={obj.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                            >
                                            </span>
                                            <span title="Maybe" onClick={() => SmartLightUpdateSubComment(i, "Maybe")} className={obj.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                            </span>
                                            <span title="Approved" onClick={() => SmartLightUpdateSubComment(i, "Approve")} className={obj.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>
                                            </span>
                                        </span> : null
                                    }
                                    </div>
                                    <div>
                                        <span className="mx-1">
                                            <input className="form-check-input mt-0 rounded-0 commentSectionLabel"
                                                type="checkbox"
                                                checked={obj.SeeAbove}
                                                value={obj.SeeAbove}
                                                name='SeeAbove'
                                            />
                                            <label className="commentSectionLabel ms-1">See Above</label>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <input className="form-check-input rounded-0 mt-0 commentSectionLabel" type="checkbox"
                                                checked={obj.Phone}
                                                value={obj.Phone}
                                                name='Phone'
                                            />
                                            <label className="commentSectionLabel ms-1">Phone</label>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mt-0 rounded-0 commentSectionLabel" />
                                            <label className="commentSectionLabel ms-1">
                                                Low Importance
                                            </label>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                                value={obj.HighImportance} className="form-check-input rounded-0 mt-0 commentSectionLabel"
                                            />
                                            <label className="commentSectionLabel ms-1">
                                                High Importance
                                            </label>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <input type="checkbox" id="" className="form-check-input rounded-0 mt-0 commentSectionLabel"
                                                name='Completed' checked={obj.Completed} value={obj.Completed} />
                                            <label className="commentSectionLabel ms-1">
                                                Mark As Completed
                                            </label>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <span className="hreflink commentSectionLabel" style={{ color: "#000066" }} onClick={() => postBtnHandle(i)}> Add Comment </span>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <a target="_blank" data-interception="off" href={SiteUrl ?
                                                `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ItemID=${ItemId}?Siteurl=${SiteUrl}`
                                                : `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ItemID=${ItemId}`}
                                                className="hreflink commentSectionLabel" style={{ color: "#000066" }}> Create Task </a>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <a className="ps-1"
                                                style={{ cursor: "pointer" }} target="_blank"
                                                onClick={() => RemoveItem(obj)}
                                            ><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                </svg>
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex">
                                        <span className="SubTestBorder p-1 me-1">{obj.taskIndex + 1}</span>
                                        <textarea
                                            style={{ width: "100%" }}
                                            className="form-control"
                                            defaultValue={obj.Title}
                                            name='Title'
                                        ></textarea>
                                    </div>
                                </div>
                            </div >
                            <div>
                                <div>
                                    <AddCommentComponent
                                        Data={obj.Comments != null ? obj.Comments : []}
                                        allFbData={TextItems}
                                        index={currentIndex}
                                        postStatus={postBtnStatus}
                                        allUsers={textItems.allUsers}
                                        callBack={postBtnHandleCallBack}
                                    />
                                </div>
                                <div>
                                    <Example
                                        SubTextItemsArray={obj.Subtext ? obj.Subtext : []}
                                        index={obj.taskIndex + 1}
                                        commentId={obj.Id}
                                        callBack={subTextCallBack}
                                        allUsers={textItems.allUsers}
                                        ApprovalStatus={ApprovalStatus}
                                        SmartLightStatus={SmartLightStatus}
                                        SmartLightPercentStatus={SmartLightPercentStatus}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
                {btnStatus ? <button className="btn btn-primary" onClick={addRow}>Add New Box</button> : null}
            </div>
        )
    }

    return (
        <div className="col mt-2">
            {State.length ? null : <button className="btn btn-primary" onClick={addRow}>Add New Box</button>}
            {/* <button onClick={showState}>Show state</button> */}
            {State.length ? createRows(State) : null}
        </div>
    );
}