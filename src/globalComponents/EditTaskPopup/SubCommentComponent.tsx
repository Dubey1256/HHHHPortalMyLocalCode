import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import AddCommentComponent from './AddCommentComponent'

export default function subCommentComponent(SubTextItemsArray: any) {
    const SubTextItems = SubTextItemsArray.SubTextItemsArray;
    const callBack = SubTextItemsArray.callBack
    const Context = SubTextItemsArray.Context;
    const [Texts, setTexts] = useState(false);
    const [subCommentsData, setSubCommentsData] = useState([]);
    const [UpdatedFeedBackChildArray, setUpdatedFeedBackChildArray] = useState([]);
    const [btnStatus, setBtnStatus] = useState(false);
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const currentArrayIndex = SubTextItemsArray.currentIndex
    let ApprovalStatus: any = SubTextItemsArray.ApprovalStatus;
    let SmartLightPercentStatus: any = SubTextItemsArray.SmartLightPercentStatus;
    let SmartLightStatus: any = SubTextItemsArray.SmartLightStatus;
    let ChildArray: any = [];

    useEffect(() => {
        if (SubTextItems != undefined && SubTextItems.length > 0) {
            SubTextItems.map((subItem: any) => {
                ChildArray.push(subItem);
                UpdatedFeedBackChildArray.push(subItem);
                subCommentsData.push(subItem);
            })
            setBtnStatus(true)
        } else {
            setBtnStatus(false)
        }
        if (ChildArray?.length == 0) {
            setBtnStatus(false)
        }
        if (SmartLightStatus) {
            setIsDisabled(true);
        }
    }, [])
    const addSubRow = () => {
        const object = {
            Completed: "",
            Title: "",
            text: "",
            Phone: "",
            LowImportance: "",
            HighImportance: "",
            isShowLight: ""
        };
        subCommentsData.push(object);
        setTexts(!Texts)
        UpdatedFeedBackChildArray.push(object)
        setBtnStatus(true);
    }

    const addSubRowInDiv = () => {
        const object = {
            Completed: "",
            Title: "",
            text: "",
            Phone: "",
            LowImportance: "",
            HighImportance: "",
            isShowLight: ""
        };
        subCommentsData.push(object);
        setTexts(!Texts)
        UpdatedFeedBackChildArray.push(object)
        setBtnStatus(true);
    }
    const RemoveSubtexTItem = (dltItem: any, Index: number) => {
        let tempArray: any = []
        subCommentsData.map((array: any, index: number) => {
            if (index != Index) {
                tempArray.push(array);
            }
        });
        // tempArray?.map((tempData: any) => {
        //     ChildArray.push(tempData);
        // })
        callBack(tempArray, currentArrayIndex);
        setSubCommentsData(tempArray);
    }

    function handleChangeChild(e: any) {
        // let tempArray: any = [];
        if (e.target.matches("textarea")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...subCommentsData];
            const obj = { ...subCommentsData[id], [name]: value };
            copy[id] = obj;
            setSubCommentsData(copy);
            UpdatedFeedBackChildArray[id].Title = value;

        }
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...subCommentsData];
            const obj = { ...subCommentsData[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            setSubCommentsData(copy);
            if (name == "Phone") {
                UpdatedFeedBackChildArray[id].Phone = (value == "true" ? false : true)
            }
            if (name == "LowImportance") {
                UpdatedFeedBackChildArray[id].LowImportance = (value == "true" ? false : true)
            }
            if (name == "HighImportance") {
                UpdatedFeedBackChildArray[id].HighImportance = (value == "true" ? false : true)
            }
            if (name == "Completed") {
                UpdatedFeedBackChildArray[id].Completed = (value == "true" ? false : true)
            }
        }
        callBack(UpdatedFeedBackChildArray, currentArrayIndex);
    }

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
        // const copy = [...subCommentsData];
        // const obj = { ...subCommentsData[Index], Comments: dataPost };
        // copy[Index] = obj;
        // setSubCommentsData(copy);
        UpdatedFeedBackChildArray[Index].Comments = dataPost;
        callBack(UpdatedFeedBackChildArray, currentArrayIndex);
    }, [])
    const SmartLightUpdateSubChildComment = (index: any, value: any) => {
        const copy = [...subCommentsData];
        const obj = { ...subCommentsData[index], isShowLight: value };
        copy[index] = obj;
        setSubCommentsData(copy);
        UpdatedFeedBackChildArray[index].isShowLight = value;
        callBack(UpdatedFeedBackChildArray, currentArrayIndex);
    }
    const postBtnHandleCallBackCancel = useCallback((status: any) => {
        if (status) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
    }, [])
    function createSubRows(state: any[]) {
        return (
            <div className="add-text-box">
                {state?.map((obj, index) => {
                    return (
                        <div className="row ms-1">
                            <div
                                data-id={index}
                                className="col"
                                onChange={handleChangeChild}
                            >
                                <div className="Task-panel alignCenter justify-content-between ">

                                    <div className="alignCenter">
                                        <span className="me-1">{`${SubTextItemsArray.index}.${index + 1}`}</span>
                                        <span className={isDisabled ? "my-1" : "my-1 Disabled-Link"}>
                                            {ApprovalStatus ?
                                                <span className="MR5 ng-scope" ng-disabled="Item.PercentComplete >= 80">
                                                    <span title="Rejected" onClick={() => SmartLightUpdateSubChildComment(index, "Reject")}
                                                        className={obj.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                    >
                                                    </span>
                                                    <span title="Maybe" onClick={() => SmartLightUpdateSubChildComment(index, "Maybe")} className={obj.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                    </span>
                                                    <span title="Approved" onClick={() => SmartLightUpdateSubChildComment(index, "Approve")} className={obj.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>
                                                    </span>
                                                </span> : null
                                            }</span>
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
                                        <span className="mx-1" >
                                            <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input m-0 rounded-0 commentSectionLabel "
                                            />
                                            <label className="commentSectionLabel ms-1">Low Importance</label>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                                value={obj.HighImportance} className="form-check-input m-0 rounded-0 commentSectionLabel "
                                            />
                                            <label className="commentSectionLabel ms-1">High Importance </label>
                                        </span>
                                        <span> | </span>
                                        <span className="mx-1">
                                            <input type="checkbox" id="" className="form-check-input m-0 rounded-0 commentSectionLabel "
                                                name='Completed' checked={obj.Completed} value={obj.Completed} />
                                            <label className="commentSectionLabel ms-1">Mark As Completed</label>
                                        </span>
                                        <span> | </span>
                                        <span className="hreflink siteColor mx-1 commentSectionLabel">
                                            <span onClick={() => postBtnHandle(index)}> Add Comment </span>
                                        </span>
                                        <span> | </span>
                                        <span className="">
                                            <a className="ps-1 hreflink"
                                                target="_blank"
                                                onClick={() => RemoveSubtexTItem(obj, index)}
                                            ><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                </svg>
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex">

                                        <textarea
                                            style={{ width: "100%" }}
                                            className="form-control SubTestLeftBorder "
                                            defaultValue={obj?.Title?.replace(/<[^>]*>/g, ' ')}
                                            name='Title'
                                        ></textarea>
                                    </div>
                                    {/* <button onClick={addRow}>Add New Box</button> */}
                                    {/* {subCommentsData.length==1 || 2 || 3 ?<button className="btn btn-primary" onClick={addRow}>Add New Box</button>:""} */}
                                </div>
                            </div >
                            <div>
                                <div>
                                    <AddCommentComponent
                                        Data={obj.Comments != null ? obj.Comments : []}
                                        allFbData={SubTextItems}
                                        index={index}
                                        postStatus={index == Number(currentIndex) && postBtnStatus ? true : false}
                                        allUsers={SubTextItemsArray.allUsers}
                                        callBack={postBtnHandleCallBack}
                                        CancelCallback={postBtnHandleCallBackCancel}
                                        Context={Context}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
                {btnStatus ? <div className="float-end">
                    <button className="btn btn-primary my-1"
                        onClick={addSubRowInDiv}>Add Sub-Text Box
                    </button>
                </div>

                    : null}
            </div>
        )
    }
    return (
        <div className="col ms-5">
            {subCommentsData.length ? null :
                <div className="float-end">
                    <button className="btn btn-primary my-1" onClick={addSubRow}>Add Sub-Text Box</button>
                </div>
            }
            {subCommentsData.length ? createSubRows(subCommentsData) : null}
        </div>
    );
}  