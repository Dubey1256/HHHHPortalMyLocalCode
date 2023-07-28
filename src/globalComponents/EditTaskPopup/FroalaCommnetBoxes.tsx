import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import Example from "./SubCommentComponent";
import AddCommentComponent from './AddCommentComponent'
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
// import { TiMessage } from 'react-icons/ti'
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";

export default function FroalaCommnetBoxes(textItems: any) {
    const Context = textItems.Context;
    const TextItems = textItems.textItems;
    const callBack = textItems.callBack;
    const ItemId: any = textItems.ItemId;
    const SiteUrl = textItems.SiteUrl
    const [State, setState] = useState([]);
    const [Texts, setTexts] = useState(false);
    const [btnStatus, setBtnStatus] = useState(false);
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    const [ApprovalPointUserData, setApprovalPointUserData] = useState<any>([]);
    const [ApprovalPointCurrentIndex, setApprovalPointCurrentIndex] = useState('');
    const [isCurrentUserApprover, setIsCurrentUserApprover] = useState(false);
    const [ApprovalPointHistoryStatus, setApprovalPointHistoryStatus] = useState(false);
    const [currentUserData, setCurrentUserData] = useState<any>([]);
    const [UpdatedFeedBackParentArray, setUpdatedFeedBackParentArray] = useState([]);
    let [IndexCount, setIndexCount] = useState(1);

    let ApprovalStatus: any = textItems.ApprovalStatus;
    let SmartLightPercentStatus: any = textItems.SmartLightPercentStatus;
    let SmartLightStatus: any = textItems.SmartLightStatus;
    useEffect(() => {
        if (TextItems != undefined && TextItems.length > 0) {
            setBtnStatus(true)
            TextItems.map((item: any, index: any) => {
                if (index > 0) {
                    if (item.ApproverData == undefined) {
                        item.ApproverData = [];
                    }
                    item.taskIndex = index;
                    State.push(item);
                    setTexts(!Texts);
                    IndexCount = IndexCount + 1;
                    UpdatedFeedBackParentArray.push(item);
                }
            })
        } else {
            setBtnStatus(false)
        }
        if (SmartLightStatus) {
            setIsCurrentUserApprover(true);
        }
        getCurrentUserDetails();
    }, [])
    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
        if (currentUserId != undefined) {
            if (textItems.allUsers != null && textItems.allUsers?.length > 0) {
                textItems.allUsers?.map((userData: any) => {
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
    const addMainRow = () => {
        // let testTaskIndex = State?.length + 1
        let testTaskIndex = UpdatedFeedBackParentArray?.length + 1
        // setIndexCount(IndexCount + 1);
        IndexCount = IndexCount + 1;
        const object = {
            Completed: "",
            Title: "",
            text: "",
            taskIndex: testTaskIndex,
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: '',
            isShowLight: ''
        };
        State.push(object);
        UpdatedFeedBackParentArray.push(object)
        setTexts(!Texts);
        setBtnStatus(true);
    }
    const addMainRowInDiv = () => {
        // let testTaskIndex = State?.length + 1
        let testTaskIndex = UpdatedFeedBackParentArray?.length + 1
        // setIndexCount(IndexCount + 1);
        IndexCount = IndexCount + 1;
        const object = {
            Completed: "",
            Title: "",
            text: "",
            taskIndex: testTaskIndex,
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: '',
            isShowLight: ''
        };
        State.push(object);
        UpdatedFeedBackParentArray.push(object)
        setTexts(!Texts);
        setBtnStatus(true);
    }

    const RemoveItem = (dltItem: any) => {
        let tempArray: any = []
        State.map((array: any) => {
            if (dltItem.taskIndex != array.taskIndex) {
                tempArray.push(array);
            }
        })
        // ParentArray = [];
        // tempArray?.map((tempDataItem: any) => {
        //     ParentArray.push(tempDataItem);
        // })

        if (tempArray?.length == 0) {
            setBtnStatus(false)
            callBack("delete");
        } else {
            callBack(tempArray);
        }
        setState(tempArray);
    }

    function handleChange(e: any) {
        if (e.target.matches("textarea")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            UpdatedFeedBackParentArray[id].Title = value;
            const copy = [...State];
            const obj = { ...State[id], [name]: value };
            copy[id] = obj;
            setState(copy);
        }
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            if (name == "SeeAbove") {
                if (value == 'false') {
                    const { id } = e.currentTarget.dataset;
                    let Index = Number(id) + 1;
                    let NewTitle: any = "";
                    if (UpdatedFeedBackParentArray[id].Title != undefined && UpdatedFeedBackParentArray[id].Title.length > 0) {
                        NewTitle = UpdatedFeedBackParentArray[id].Title + " (See " +Index +")";
                    } else {
                        NewTitle = " (See " +Index +")"
                    }
                    UpdatedFeedBackParentArray[id].Title = NewTitle;
                    const copy = [...State];
                    const obj = { ...State[id], Title: NewTitle };
                    copy[id] = obj;
                    setState(copy);
                } else {
                    const { id } = e.currentTarget.dataset;
                    let Index = Number(id) + 1;
                    let NewTitle: any = "";
                    if (UpdatedFeedBackParentArray[id].Title != undefined && UpdatedFeedBackParentArray[id].Title.length > 0) {
                        NewTitle = UpdatedFeedBackParentArray[id].Title.replace(`(See ${Index})`, "");
                    } else {
                        NewTitle = "";
                    }
                    UpdatedFeedBackParentArray[id].Title = NewTitle;
                    const copy = [...State];
                    const obj = { ...State[id], Title: NewTitle };
                    copy[id] = obj;
                    setState(copy);
                }
                UpdatedFeedBackParentArray[id].SeeAbove = (value == "true" ? false : true)
            }
            if (name == "Phone") {
                UpdatedFeedBackParentArray[id].Phone = (value == "true" ? false : true)
            }
            if (name == "LowImportance") {
                UpdatedFeedBackParentArray[id].LowImportance = (value == "true" ? false : true)
            }
            if (name == "HighImportance") {
                UpdatedFeedBackParentArray[id].HighImportance = (value == "true" ? false : true)
            }
            if (name == "Completed") {
                UpdatedFeedBackParentArray[id].Completed = (value == "true" ? false : true)
            }
            const copy = [...State];
            const obj = { ...State[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            setState(copy);

        }
        callBack(UpdatedFeedBackParentArray);
    }

    const subTextCallBack = useCallback((subTextData: any, subTextIndex: any) => {
        // const copy = State;
        // const obj = { ...State[subTextIndex], Subtext: subTextData};    
        // copy[subTextIndex] = obj;
        // setState(copy);
        UpdatedFeedBackParentArray[subTextIndex].Subtext = subTextData
        callBack(UpdatedFeedBackParentArray);
    }, [])

    const postBtnHandle = (index: any) => {
        setCurrentIndex(index)
        if (postBtnStatus) {
            setPostBtnStatus(false);
        } else {
            setPostBtnStatus(true);
        }
    }
    const postBtnHandleCallBack = useCallback((status: any, dataPost: any, Index: any) => {
        if (status) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
        // const copy = State;
        // const obj = { ...State[Index], Comments: dataPost};    
        // copy[Index] = obj;
        // setState(copy);
        UpdatedFeedBackParentArray[Index].Comments = dataPost;
        callBack(UpdatedFeedBackParentArray);
    }, [])

    const SmartLightUpdateSubComment = (index: any, value: any) => {
        let temObject: any = {
            Title: currentUserData.Title != undefined ? currentUserData.Title : Context.pageContext._user.displayName,
            Id: currentUserData.Id,
            ImageUrl: currentUserData.ImageUrl != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
            ApprovalDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            isShowLight: value
        }
        // currentUserData.isShowLight = value;
        UpdatedFeedBackParentArray[index].isShowLight = value;
        UpdatedFeedBackParentArray[index].ApproverData.push(temObject);
        let tempApproverData: any = UpdatedFeedBackParentArray[index].ApproverData
        callBack(UpdatedFeedBackParentArray);
        const copy = [...State];
        const obj = { ...State[index], isShowLight: value, ApproverData: tempApproverData };
        copy[index] = obj;
        setState(copy);

    }
    const postBtnHandleCallBackCancel = useCallback((status: any) => {
        if (status) {
            setPostBtnStatus(false);
        } else {
            setPostBtnStatus(true);
        }
    }, [])

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

    function createRows(state: any[]) {
        return (
            <div>
                <div className="add-text-box">
                    {state?.map((obj, i) => {
                        return (
                            <div className="FeedBack-comment row my-1">
                                <div
                                    data-id={i}
                                    className="col"
                                    onChange={handleChange}
                                >
                                    <div className="Task-panel d-flex justify-content-between ">
                                        <div className="d-flex">
                                            {ApprovalStatus ?
                                                <div>
                                                    {/* {isCurrentUserApprover ? */}
                                                    <div className={isCurrentUserApprover ? "alignCenter mt-1" : "alignCenter Disabled-Link mt-1"}>
                                                        <span className="MR5 ng-scope" ng-disabled="Item.PercentComplete >= 80">
                                                            <span title="Rejected" onClick={() => SmartLightUpdateSubComment(i, "Reject")}
                                                                className={obj.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                            >
                                                            </span>
                                                            <span title="Maybe" onClick={() => SmartLightUpdateSubComment(i, "Maybe")} className={obj.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                            </span>
                                                            <span title="Approved" onClick={() => SmartLightUpdateSubComment(i, "Approve")} className={obj.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {/* :null} */}
                                                </div>
                                                : null
                                            }
                                            {obj.ApproverData != undefined && obj.ApproverData.length > 0 ?
                                                <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(i + 1, obj)}>
                                                    Pre-approved by - <span className="ms-1"><a title={obj.ApproverData[obj.ApproverData.length - 1]?.Title}>
                                                        <img className='imgAuthor' src={obj.ApproverData[obj.ApproverData.length - 1]?.ImageUrl} />
                                                    </a>
                                                    </span>
                                                </span> : null
                                            }
                                        </div>
                                        <div>
                                            <span className="mx-1">
                                                <input className="form-check-input m-0 rounded-0 commentSectionLabel"
                                                    type="checkbox"
                                                    checked={obj.SeeAbove != undefined && obj.SeeAbove == true? true : false}
                                                    value={obj.SeeAbove != undefined && obj.SeeAbove == true ? "true" : "false"}
                                                    name='SeeAbove'
                                                />
                                                <label className="commentSectionLabel ms-1">See Above</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input className="form-check-input rounded-0 m-0 commentSectionLabel" type="checkbox"
                                                    checked={obj.Phone}
                                                    value={obj.Phone}
                                                    name='Phone'
                                                />
                                                <label className="commentSectionLabel ms-1">Phone</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input m-0 rounded-0 commentSectionLabel" />
                                                <label className="commentSectionLabel ms-1">
                                                    Low Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                                    value={obj.HighImportance} className="form-check-input rounded-0 m-0 commentSectionLabel"
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    High Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" id="" className="form-check-input rounded-0 m-0 commentSectionLabel"
                                                    name='Completed' checked={obj.Completed} value={obj.Completed} />
                                                <label className="commentSectionLabel ms-1">
                                                    Mark As Completed
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <span className="hreflink siteColor commentSectionLabel" onClick={() => postBtnHandle(i)}> Add Comment </span>
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
                                        <div className="d-flex" title={obj.isShowLight}>
                                            <span className="SubTestBorder p-1 me-1">{obj.taskIndex + 1}</span>
                                            <textarea
                                                style={{ width: "100%" }}
                                                className={`form-control`}
                                                defaultValue={obj?.Title?.replace(/<[^>]*>/g, ' ')}
                                                value={obj?.Title?.replace(/<[^>]*>/g, ' ')}
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
                                            postStatus={i == Number(currentIndex) && postBtnStatus ? true : false}
                                            allUsers={textItems.allUsers}
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
                                            index={i + 1}
                                            commentId={obj.Id}
                                            currentIndex={i}
                                            callBack={subTextCallBack}
                                            allUsers={textItems.allUsers}
                                            ApprovalStatus={ApprovalStatus}
                                            SmartLightStatus={SmartLightStatus}
                                            SmartLightPercentStatus={SmartLightPercentStatus}
                                            isCurrentUserApprover={isCurrentUserApprover}
                                            Context={Context}
                                            isFirstComment ={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {btnStatus ? <button className="btn btn-primary" onClick={addMainRowInDiv}>Add New Box</button> : null}
                </div>
                {/* ********************* this is Approval History panel ****************** */}
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

    return (
        <div className="col mt-2">
            {State.length ? null : <button className="btn btn-primary" onClick={addMainRow}>Add New Box</button>}
            {/* <button onClick={showState}>Show state</button> */}
            {State.length ? createRows(State) : null}
        </div>
    );
}
