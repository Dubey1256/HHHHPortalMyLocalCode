import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import Example from "./SubCommentComponent";
import AddCommentComponent from './AddCommentComponent'
import * as Moment from 'moment';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";
import CreateTaskCompareTool from '../CreateTaskCompareTool/CreateTaskCompareTool';

let globalCount = 1;
let CreateTaskIndex: any;
let currentUserData: any;

  let UpdatedFeedBackParentArray:any=[]
export default function FroalaCommnetBoxes(textItems: any) {
    console.log(textItems?.copyAlldescription)
    const Context = textItems.Context;
    const TextItems = textItems.textItems;
    const callBack = textItems.callBack;
    const taskCreatedCallback = textItems.taskCreatedCallback;
    const TaskDetails: any = textItems.TaskListDetails;
    const ItemDetails: any = TaskDetails?.TaskDetails;
    const [State, setState] = useState<any>([]);
    const [Texts, setTexts] = useState<any>(false);
    const [btnStatus, setBtnStatus] = useState<any>(false);
    const [postBtnStatus, setPostBtnStatus] = useState<any>(false);
    const [currentIndex, setCurrentIndex] = useState<any>('');
    const [ApprovalPointUserData, setApprovalPointUserData] = useState<any>([]);
    const [ApprovalPointCurrentIndex, setApprovalPointCurrentIndex] = useState<any>('');
    const [isCurrentUserApprover, setIsCurrentUserApprover] = useState<any>(false);
    const [ApprovalPointHistoryStatus, setApprovalPointHistoryStatus] = useState<any>(false);
    const [IsOpenCreateTaskPanel, setIsOpenCreateTaskPanel] = useState<any>(false);
    const [CreateTaskForThis, setCreateTaskForThis] = useState<any>();
    

    let [IndexCount, setIndexCount] = useState<any>(1);
    let ApprovalStatus: any = textItems.ApprovalStatus;
    let SmartLightPercentStatus: any = textItems.SmartLightPercentStatus;
    let SmartLightStatus: any = textItems.SmartLightStatus;


    useEffect(() => {
        if (TextItems != undefined && TextItems?.length > 0) {
            setState([]);
            let testItems: any = []
            UpdatedFeedBackParentArray = []
            TextItems?.map((item: any, index: any) => {
                if (index > 0) {
                    if (typeof item == "object") {
                        if (item?.ApproverData == undefined) {
                            item.ApproverData = [];
                        }
                        item.taskIndex = index;
                        testItems.push(item);

                        testItems?.forEach((ele: any) => {
                            if (ele?.ApproverData != undefined && ele?.ApproverData?.length > 0) {
                                ele.ApproverData?.forEach((ba: any) => {
                                    if (ba.isShowLight == 'Reject') {
                                        ba.Status = 'Rejected by'
                                    }
                                    if (ba.isShowLight == 'Approve') {
                                        ba.Status = 'Approved by '
                                    }
                                    if (ba.isShowLight == 'Maybe') {
                                        ba.Status = 'For discussion with'
                                    }


                                })
                            }
                        })
                        setTexts(!Texts);
                        IndexCount = IndexCount + 1;
                        UpdatedFeedBackParentArray.push(item);
                    }

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
        let currentUserId = Context.pageContext._legacyPageContext.userId;
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
                        currentUserData = TempObject;
                    }
                })
            }
        }
    }
    const addMainRow = () => {
        let testTaskIndex = UpdatedFeedBackParentArray?.length + 1
        IndexCount = IndexCount + 1;
        const object = {
            Completed: "",
            Title: "",
            text: "",
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
        let testTaskIndex = State?.length + 1
        IndexCount = IndexCount + 1;
        const object = {
            Completed: "",
            Title: "",
            text: "",
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: '',
            isShowLight: '',
            TaskCreatedForThis: false
        };
    
     UpdatedFeedBackParentArray.push(object);
     setState(UpdatedFeedBackParentArray)
      
        setTexts(!Texts);
        setBtnStatus(true);
    }

    const RemoveItem = (dltItem: any, Index: any) => {
        let tempArray: any = []
        IndexCount--;
        State.map((array: any, ItemIndex: any) => {
            if (dltItem.Title != array.Title || ItemIndex != Index) {
                tempArray.push(array);
            }
        })
        if (tempArray?.length == 0) {
            setBtnStatus(false)
            callBack("delete");
        } else {
            UpdatedFeedBackParentArray = []
            UpdatedFeedBackParentArray=tempArray
            callBack(tempArray);
        }
        UpdatedFeedBackParentArray = []
        UpdatedFeedBackParentArray=tempArray
        setState(tempArray);
    }

    function handleChange(e: any) {
        UpdatedFeedBackParentArray = State;
        const id = parseInt(e.currentTarget.dataset.id, 10);
        const { name, type, checked, value } = e.target;
        let updatedValue = type === "checkbox" ? checked : value;
        if (name === "SeeAbove") {
            let newTitle = UpdatedFeedBackParentArray[id].Title;
            const seeText = ` (See ${id + 1})`;
            if (updatedValue) {
                if (!newTitle.includes(seeText)) {
                    newTitle += seeText;
                }
            } else {
                newTitle = newTitle.replace(seeText, "").trim();
            }
            UpdatedFeedBackParentArray[id].Title = newTitle;
            UpdatedFeedBackParentArray[id].SeeAbove = updatedValue;
        } else if (type === "textarea") {
            UpdatedFeedBackParentArray[id].Title = updatedValue;
        } else if (type === "checkbox") {
            UpdatedFeedBackParentArray[id][name] = updatedValue;
        }
        const updatedState = State.map((item: any, idx: any) => {
            if (idx === id) {
                return {
                    ...item,
                    Title: UpdatedFeedBackParentArray[id].Title,
                    [name]: updatedValue
                };
            }
            return item;
        });
        setState(updatedState);
        callBack(UpdatedFeedBackParentArray);
    }
    const subTextCallBack = useCallback((subTextData: any, subTextIndex: any) => {
      
        console.log(textItems?.copyAlldescription)
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
        const copy = [...State];
        let tempApproverData: any = copy[index].ApproverData;
        const obj = { ...State[index], isShowLight: value, ApproverData: tempApproverData };
        copy[index] = obj;
        setState(copy);
        copy[index].isShowLight = value;
        copy[index].ApproverData.push(temObject);
        copy?.forEach((ele: any) => {
            if (ele.ApproverData != undefined && ele.ApproverData.length > 0) {
                ele.ApproverData?.forEach((ba: any) => {
                    if (ba.isShowLight == 'Reject') {
                        ba.Status = 'Rejected by'
                    }
                    if (ba.isShowLight == 'Approve') {
                        ba.Status = 'Approved by '
                    }
                    if (ba.isShowLight == 'Maybe') {
                        ba.Status = 'For discussion with'
                    }
                })
            }
        })
        callBack(copy);
        UpdatedFeedBackParentArray = copy;
    }
    const postBtnHandleCallBackCancel = useCallback((status: any) => {
        if (status) {
            setPostBtnStatus(false);
        } else {
            setPostBtnStatus(true);
        }
    }, [])

    // ********************* this is for the Approval Point History Popup ************************


    const CreateSeparateTaskFunction = async (FeedbackData: any, Index: any) => {
        setIsOpenCreateTaskPanel(true);
        setCreateTaskForThis(UpdatedFeedBackParentArray[Index]);
        CreateTaskIndex = Index;
        const updatedState = [...State];
        updatedState[Index].TaskCreatedForThis = true;
        setState(updatedState);
    }


    const UpdateFeedbackDetails = async (NewTaskDetails: any, Index: any) => {
        let param: any = Moment(new Date().toLocaleString());
        let TaskURL: any = `${TaskDetails?.SiteURL}/SitePages/Task-Profile.aspx?taskId=${NewTaskDetails?.Id}&Site=${TaskDetails?.siteType}`;
        let CommentTitle: any = `A new task was created to address this issue: ${TaskURL} Created by ${currentUserData.Title != undefined ? currentUserData.Title : Context.pageContext._user.displayName}`;
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
        let UpdateJSONIndex = Index;
        UpdatedFeedBackParentArray[UpdateJSONIndex].Completed = true;
         UpdatedFeedBackParentArray[Index].TaskCreatedForThis = true;
            if (UpdatedFeedBackParentArray[UpdateJSONIndex].Comments?.length > 0) {
            UpdatedFeedBackParentArray[UpdateJSONIndex].Comments.unshift(CreateTaskFor[0]);
        } else {
            UpdatedFeedBackParentArray[UpdateJSONIndex].Comments = CreateTaskFor;
        }
        callBack(UpdatedFeedBackParentArray);
        setState([...UpdatedFeedBackParentArray]);
        taskCreatedCallback("Image-Tab");
        globalCount++;
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

    const CreateTaskCallBack = useCallback((Status: string, NewlyCreatedData: any) => {
        if (Status == "Save") {
            console.log("NewlyCreatedData ====", NewlyCreatedData)
            UpdateFeedbackDetails(NewlyCreatedData, CreateTaskIndex);
        }
        setIsOpenCreateTaskPanel(false);
    }, [])

    function createRows(state: any[]) {
    }

    return (
        <div className="col mt-2">
            {State.length ? null : <button className="btn btn-primary" onClick={addMainRow}>Add New Box</button>}
            {State.length ? createRows(State) : null}
        </div>
    );
}