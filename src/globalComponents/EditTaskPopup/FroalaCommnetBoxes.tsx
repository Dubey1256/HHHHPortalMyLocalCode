import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import Example from "./SubCommentComponent";
import AddCommentComponent from './AddCommentComponent'
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
// import { TiMessage } from 'react-icons/ti'
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";
import EditTaskPopup from "./EditTaskPopup";
let globalCount = 0;
export default function FroalaCommnetBoxes(textItems: any) {
    const Context = textItems.Context;
    const TextItems = textItems.textItems;   
    const callBack = textItems.callBack;
    const taskCreatedCallback = textItems.taskCreatedCallback;
    const TaskDetails: any = textItems.TaskListDetails;
    const [State, setState] = useState([]);
    const [Texts, setTexts] = useState(false);
    const [btnStatus, setBtnStatus] = useState(false);
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    const [ApprovalPointUserData, setApprovalPointUserData] = useState<any>([]);
    const [ApprovalPointCurrentIndex, setApprovalPointCurrentIndex] = useState('');
    const [isCurrentUserApprover, setIsCurrentUserApprover] = useState(false);
    const [ApprovalPointHistoryStatus, setApprovalPointHistoryStatus] = useState(false);
    const [TaskPopupPanelStatus, UpdateTaskPopupPanelStatus] = useState(false);
    const [currentUserData, setCurrentUserData] = useState<any>([]);
    const [UpdatedFeedBackParentArray, setUpdatedFeedBackParentArray] = useState([]);
    let [IndexCount, setIndexCount] = useState(1);
    const [newlyCreatedTask, UpdateNewlyCreatedTask] = useState<any>([]);

    let ApprovalStatus: any = textItems.ApprovalStatus;
    let SmartLightPercentStatus: any = textItems.SmartLightPercentStatus;
    let SmartLightStatus: any = textItems.SmartLightStatus;
    useEffect(() => {
        if (TextItems != undefined && TextItems.length > 0) {
            setState([]);
            let testItems: any = []
            TextItems.map((item: any, index: any) => {
                if (index > 0) {
                    if (item.ApproverData == undefined) {
                        item.ApproverData = [];
                    }
                    item.taskIndex = index;
                    testItems.push(item);
                    setTexts(!Texts);
                    IndexCount = IndexCount + 1;
                    UpdatedFeedBackParentArray.push(item);
                }
            })
            setState((prev: any) => testItems);
            setBtnStatus(true)

        } else {
            setBtnStatus(false)
        }
        if (SmartLightStatus) {
            setIsCurrentUserApprover(true);
        }
        getCurrentUserDetails();
        setIndexCount(TextItems?.length)
    }, [TextItems?.length])
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
            isShowLight: '',
            TaskCreatedForThis: false
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
                        NewTitle = UpdatedFeedBackParentArray[id].Title + " (See " + Index + ")";
                    } else {
                        NewTitle = "See " + Index
                    }
                    UpdatedFeedBackParentArray[id].Title = NewTitle;
                    const copy = [...State];
                    const obj = { ...State[id], Title: NewTitle, SeeAbove: true };
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
                    const obj = { ...State[id], Title: NewTitle, SeeAbove: false };
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

    const CreateSeperateTaskFunction = async (FeedbackData: any, Index: any) => {
        let callForData = textItems?.TaskUpdatedData;
        try {
            let UpdateJSONData: any = {};
            UpdateJSONData = await callForData();
            let OldItemDataDetails: any = { ...UpdateJSONData }
            var FeedBackItem: any = {};
            let CreateTaskFor: any = FeedbackData;
            CreateTaskFor.Subtext = [];
            let param: any = Moment(new Date().toLocaleString())
            FeedBackItem['Title'] = "FeedBackPicture" + param;
            FeedBackItem['FeedBackDescriptions'] = [CreateTaskFor];
            FeedBackItem['ImageDate'] = "" + param;
            FeedBackItem['Completed'] = '';
            let FeedbackArray: any = [FeedBackItem];
            if (UpdateJSONData?.Title?.length > 1) {
                UpdateJSONData.FeedBack = FeedbackArray?.length > 0 != undefined ? JSON.stringify(FeedbackArray) : null;
            }
            let web = new Web(TaskDetails?.SiteURL);
            await web.lists.getById(TaskDetails?.ListId).items.add(UpdateJSONData).then((res: any) => {
                console.log("Created Task Successfully !!!");
                let responseData: any = res.data;
                responseData.listId = TaskDetails.ListId;
                responseData.siteUrl = TaskDetails.SiteURL;
                responseData.siteType = TaskDetails.siteType;
                UpdateNewlyCreatedTask(responseData);
                try {
                    UpdateFeedbackDetails(responseData, Index, OldItemDataDetails);

                } catch (error) {
                    console.log("Error:", error.message)
                }
                UpdateTaskPopupPanelStatus(true);
                globalCount++;
            })


        } catch (error) {
            console.log("Error :", error.message);
        }

    }

    const UpdateFeedbackDetails = async (NewTaskDetails: any, Index: any, OldItemData: any) => {
        let param: any = Moment(new Date().toLocaleString());
        let baseUrl = window.location.href;
        let TaskURL = baseUrl.replace(TaskDetails.TaskDetails?.Id, NewTaskDetails.Id)
        let CommentTitle: any = `A separate task for this point has been created and below is the URL for same. Task URL : ${TaskURL}`;
        let oldTaskDetails: any = OldItemData;
        let oldFeedbackData: any;
        if (oldTaskDetails?.FeedBack?.length > 0) {
            oldFeedbackData = JSON.parse(oldTaskDetails.FeedBack)
        }
        let FeedbackBackupArray: any = oldFeedbackData?.length > 0 ? oldFeedbackData[0].FeedBackDescriptions : [];
        let CreateTaskFor: any = [{
            AuthorImage: currentUserData.ImageUrl != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
            AuthorName: currentUserData.Title != undefined ? currentUserData.Title : Context.pageContext._user.displayName,
            Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            Title: CommentTitle,
            NewestCreated: "" + param,
            editableItem: false,
            isApprovalComment: false,
            isShowLight: ""
        }]
        let UpdateJSONIndex = Index + 1;
        FeedbackBackupArray[UpdateJSONIndex].TaskCreatedForThis = true;
        FeedbackBackupArray[UpdateJSONIndex].Completed = true;
        if (FeedbackBackupArray[UpdateJSONIndex].Comments?.length > 0) {
            FeedbackBackupArray[UpdateJSONIndex].Comments.unshift(CreateTaskFor[0]);
        } else {
            FeedbackBackupArray[UpdateJSONIndex].Comments = CreateTaskFor;
        }
        let web = new Web(TaskDetails?.SiteURL);
        oldFeedbackData[0].FeedBackDescriptions = FeedbackBackupArray;
        await web.lists.getById(TaskDetails?.ListId).items.getById(TaskDetails?.TaskId).update({
            FeedBack: oldFeedbackData?.length > 0 ? JSON.stringify(oldFeedbackData) : null
        }).then(async (res: any) => {
            console.log("Onld Feedback Updated");
        })
        const copy = [...State];
        const obj = { ...State[Index], TaskCreatedForThis: true, Comments: FeedbackBackupArray[UpdateJSONIndex].Comments, Completed: true };
        copy[Index] = obj;
        setState(copy);
        taskCreatedCallback();
    }

    // function updateTaskIdInUrl(url: any, newTaskId: any) {
    //     const urlParams = new URLSearchParams(url);
    //     urlParams.set('taskId', newTaskId);
    //     const baseUrl = url.split('?')[0];
    //     const updatedUrl = `${baseUrl}?${urlParams.toString()}`;
    //     return updatedUrl;
    // }

    const TaskPopupCallBack = () => {
        UpdateTaskPopupPanelStatus(false);
    }

    // ********************* this is for the Approval Point History Popup ************************


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
                {TextItems?.length > 0 ? <div className={IndexCount % 2 == 0 ? "add-text-box" : "add-text-box"}>
                    {state?.map((obj, i) => {
                        return (
                            <div className={"FeedBack-comment row my-1"}>
                                <div
                                    data-id={i}
                                    className={obj.TaskCreatedForThis != undefined && obj.TaskCreatedForThis == true ? "Disabled-Link bg-e9 col py-3" : "col"}
                                    onChange={handleChange}
                                >
                                    <div className="Task-panel d-flex justify-content-between">
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
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    checked={obj.SeeAbove != undefined && obj.SeeAbove == true ? true : false}
                                                    value={obj.SeeAbove != undefined && obj.SeeAbove == true ? "true" : "false"}
                                                    name='SeeAbove'
                                                />
                                                <label className="commentSectionLabel ms-1">See Above</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input className="form-check-input mt--3" type="checkbox"
                                                    checked={obj.Phone}
                                                    value={obj.Phone}
                                                    name='Phone'
                                                />
                                                <label className="commentSectionLabel ms-1">Phone</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mt--3" />
                                                <label className="commentSectionLabel ms-1">
                                                    Low Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                                    value={obj.HighImportance} className="form-check-input mt--3"
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    High Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" id="" className="form-check-input mt--3"
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
                                                <span className="siteColor hreflink" onClick={() => CreateSeperateTaskFunction(obj, i)}>
                                                    Create Task
                                                </span>
                                            </span>
                                            <span> | </span>
                                            <a className="hreflink alignIcon"
                                                style={{ cursor: "pointer" }} target="_blank"
                                                onClick={() => RemoveItem(obj)}>
                                                <span className="svg__iconbox hreflink mini dark svg__icon--trash"></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className={obj.TaskCreatedForThis != undefined && obj.TaskCreatedForThis == true ? "Disabled-Link bg-e9" : ""}>
                                        <div className="d-flex" title={obj.isShowLight}>
                                            <span className="SubTestBorder p-1 me-1">{obj.taskIndex + 1}</span>
                                            <textarea
                                                style={{ width: "100%" }}
                                                className={obj.TaskCreatedForThis != undefined && obj.TaskCreatedForThis == true ? "form-control Disabled-Link bg-e9" : "form-control"}
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
                                            SmartLightStatus={obj.isShowLight}
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
                                            isFirstComment={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {btnStatus ? <button className="btn btn-primary" onClick={addMainRowInDiv}>Add New Box</button> : null}
                </div> : null}

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
                {/* ********************* this is Task Popup panel ****************** */}
                {TaskPopupPanelStatus ?
                    <EditTaskPopup
                        Items={newlyCreatedTask}
                        context={TaskDetails.Context}
                        AllListId={TaskDetails.AllListIdData}
                        Call={TaskPopupCallBack}
                    /> : null
                }
            </div>
        )
    }

    return (
        <div className="col mt-2">
            {State.length ? null : <button className="btn btn-primary" onClick={addMainRow}>Add New Box</button>}
            {State.length ? createRows(State) : null}
        </div>
    );
}
