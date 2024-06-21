import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import Example from "./SubCommentComponent";
import AddCommentComponent from './AddCommentComponent'
import * as Moment from 'moment';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";
import CreateTaskCompareTool from '../CreateTaskCompareTool/CreateTaskCompareTool';
   // code by vivek
   import { Panel,PanelType} from "office-ui-fabric-react";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Web } from "sp-pnp-js";
import { BiInfoCircle } from "react-icons/bi";
import FlorarImageUploadComponent from "../FlorarComponents/FlorarImageUploadComponent";
import { Height } from "@material-ui/icons";
import { withWidth } from "@material-ui/core";

//   End====
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
    
 //  =======code by vivek new design functionality========
 const [TaskImages, setTaskImages] = useState([]);
 const [currentActiveTab, setCurrentActiveTab] = React.useState(0);
 const [openAddMoreImagePopup, setopenAddMoreImagePopup] = useState(false)
 const [imageIndex, setImageIndex]: any = useState()
 var settings = {
     dots: false,
     infinite: false,
     speed: 500,
     slidesToShow: 1,
     slidesToScroll: 1,
     adaptiveHeight: true,

     prevArrow: <FaAngleLeft />,
     nextArrow: <FaAngleRight />
 };
 //======End===============
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
        const object:any = {
            Completed: "",
            Title: "",
            text: "",
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: '',
            isShowLight: '',
            TaskCreatedForThis: false,
            setTitle:`set${testTaskIndex}`,
            setImagesInfo: []
           };
       
        // State.push(object);
        UpdatedFeedBackParentArray.push(object)
        setState(UpdatedFeedBackParentArray);
        setCurrentActiveTab(0)
        setTexts(!Texts);
        setBtnStatus(true);
    }
    const addMainRowInDiv = () => {
        let testTaskIndex :any= State?.length + 1
        IndexCount = IndexCount + 1;
        const object:any = {
            Completed: "",
            Title: "",
            text: "",
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: '',
            isShowLight: '',
            TaskCreatedForThis: false,
            setTitle:`set${testTaskIndex}`,
            setImagesInfo: [],
        };
    
        UpdatedFeedBackParentArray.push(object);
        setCurrentActiveTab(currentActiveTab + 1)
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
        setCurrentActiveTab(currentActiveTab - 1)
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
        return (
            <div>
                {TextItems?.length > 0 ? <div className={IndexCount % 2 == 0 ? "add-text-box" : "add-text-box"}>
                    {state?.map((obj, i) => {
                        let index: any = i + 1;
                        return (
                            <div className={"FeedBack-comment row my-1"}>
                                <div
                                    data-id={i}
                                    className= "col"
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
                                                <>

                                                    <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(i, obj)}>
                                                        {obj.ApproverData[obj.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={obj.ApproverData[obj.ApproverData?.length - 1]?.Title}><span><a href={`${Context.pageContext.web.absoluteUrl}/SitePages/TaskDashboard.aspx?UserId=${obj.ApproverData[obj.ApproverData?.length - 1]?.Id}&Name=${obj.ApproverData[obj.ApproverData?.length - 1]?.Title}`} target="_blank" data-interception="off" title={obj.ApproverData[obj.ApproverData?.length - 1]?.Title}> <img className='imgAuthor' src={obj.ApproverData[obj.ApproverData?.length - 1]?.ImageUrl} /></a></span></a></span>

                                                </> :
                                                null
                                            }
                                        </div>
                                        <div>
                                            <span className="mx-1">
                                                {/* <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    checked={obj.SeeAbove != undefined && obj.SeeAbove == true ? true : false}
                                                    value={obj.SeeAbove != undefined && obj.SeeAbove == true ? "true" : "false"}
                                                    name='SeeAbove'
                                                /> */}
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="SeeAbove"
                                                    checked={obj.SeeAbove}
                                                />

                                                {/* Similar setup for other checkboxes like Phone, LowImportance, etc. */}

                                                <label className="commentSectionLabel ms-1">See Above</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                {/* <input className="form-check-input mt--3" type="checkbox"
                                                    checked={obj.Phone}
                                                    value={obj.Phone}
                                                    name='Phone'
                                                /> */}
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="Phone"
                                                    checked={obj.Phone}
                                                />
                                                <label className="commentSectionLabel ms-1">Phone</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                {/* <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mt--3" /> */}
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="LowImportance"
                                                    checked={obj.LowImportance}
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    Low Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                {/* <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                                    value={obj.HighImportance} className="form-check-input mt--3"
                                                /> */}
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="HighImportance"
                                                    checked={obj.HighImportance}
                                                />
                                                <label className="commentSectionLabel ms-1">
                                                    High Importance
                                                </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                {/* <input type="checkbox" id="" className="form-check-input mt--3"
                                                    name='Completed' checked={obj.Completed} value={obj.Completed} /> */}
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={i}
                                                    name="Completed"
                                                    checked={obj.Completed}
                                                />
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
                                                <span className={obj.TaskCreatedForThis != undefined && obj.TaskCreatedForThis == true ? "Disabled-Link bg-e9 siteColor hreflink commentSectionLabel" : "siteColor hreflink commentSectionLabel"}
                                                 onClick={() => CreateSeparateTaskFunction(obj, i)}>
                                                    Create Task
                                                </span>
                                            </span>
                                            <span> | </span>
                                            <a className="hreflink alignIcon"
                                                style={{ cursor: "pointer" }} target="_blank"
                                                onClick={() => RemoveItem(obj, i)}>
                                                <span className="svg__iconbox hreflink mini svg__icon--trash"></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex" title={obj.isShowLight}>
                                            <span className="SubTestBorder p-1 me-1">{index + 1}</span>
                                            <textarea
                                                style={{ width: "100%" }}
                                                className="form-control"
                                                defaultValue={obj?.Title?.replace(/<[^>]*>/g, ' ')}
                                                value={obj?.Title?.replace(/<[^>]*>/g, ' ')}
                                                name='Title'
                                            ></textarea>
                                        </div>
                                    </div>
                                </div >
                                <div>
                                    <div>
                                        {globalCount && <AddCommentComponent
                                            Data={obj.Comments != null ? obj.Comments : []}
                                            allFbData={TextItems}
                                            index={i}
                                            postStatus={i == Number(currentIndex) && postBtnStatus ? true : false}
                                            allUsers={textItems.allUsers}
                                            callBack={postBtnHandleCallBack}
                                            CancelCallback={postBtnHandleCallBackCancel}
                                            Context={Context}
                                            ApprovalStatus={ApprovalStatus}
                                            isCurrentUserApprover={isCurrentUserApprover}
                                            SmartLightStatus={obj?.isShowLight}
                                            FeedbackCount={globalCount}
                                        />}
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
                                            SmartLightStatus={obj?.isShowLight}
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

               
            </div>
        )
    }

   // code by vivek for new template  design  Start 
// ==================Image upload function Start by vivek===========
const FlorarImageUploadComponentCallBack = (dt: any, imageIndex: any) => {
    let TaskImages = []
    let DataObject: any = {
        data_url: dt,
        file: "Image/jpg",
    };

    TaskImages.push(DataObject);
    if (dt.length > 0) {
        onUploadImageFunction(TaskImages, imageIndex, false);
    }
};

const FlorarAddMoreImageComponentCallBack = (dt: any, imageIndex: any) => {
    let TaskImages = []
    let DataObject: any = {
        data_url: dt,
        file: "Image/jpg",
    };

    TaskImages.push(DataObject);
    if (dt.length > 0) {
        onUploadImageFunction(TaskImages, imageIndex, true);
    }
}

// this is used for hadneling the upload and replace image functions 

const onUploadImageFunction = async (imageList: any, addUpdateIndex: any, AddMoreImage: any) => {
    let lastindexArray = imageList[imageList.length - 1];
    let fileName: any = "";
    let tempArray: any = [];
    let SiteUrl = textItems?.EditData?.SiteUrl;
    let CurrentSiteName: any = '';
    if (textItems?.EditData?.siteType == "Offshore%20Tasks" || textItems?.EditData?.siteType == "Offshore Tasks") {
        CurrentSiteName = "SharewebQA";
    } else {
        CurrentSiteName = textItems?.EditData?.siteType;
    }

    imageList?.map(async (imgItem: any, index: number) => {
        if (imgItem.data_url != undefined && imgItem.file != undefined) {
            let date = new Date();
            let timeStamp = date.getTime();
            let imageIndex = addUpdateIndex + 2;
            fileName =
                "T" +
                textItems?.EditData?.Id +
                "-Image" +
                imageIndex +
                "-" +
                textItems?.EditData?.Title?.replace(/["/':?%]/g, "")?.slice(0, 40) +
                " " +
                timeStamp +
                ".jpg";
            let currentUserDataObject: any;
            if (
                textItems?.currentUserBackupArray != null &&
                textItems?.currentUserBackupArray.length > 0
            ) {
                currentUserDataObject = textItems?.currentUserBackupArray[0];
            }
            let ImgArray = {
                ImageName: fileName,
                UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                imageDataUrl:
                    textItems?.EditData?.siteUrl +
                    "/Lists/" +
                    CurrentSiteName +
                    "/Attachments/" +
                    textItems?.EditData?.Id +
                    "/" +
                    fileName,
                ImageUrl:  textItems?.EditData?.siteUrl +
                "/Lists/" +
                CurrentSiteName +
                "/Attachments/" +
                textItems?.EditData?.Id +
                "/" +
                fileName,
                UserImage:
                    currentUserDataObject != undefined &&
                        currentUserDataObject.Item_x0020_Cover?.Url?.length > 0
                        ? currentUserDataObject.Item_x0020_Cover?.Url
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                UserName:
                    currentUserDataObject != undefined &&
                        currentUserDataObject.Title?.length > 0
                        ? currentUserDataObject.Title
                        : textItems?.context?.pageContext._user.displayName,
                Description:
                    imgItem.Description != undefined ? imgItem.Description : "",
            };
            tempArray.push(ImgArray);
        } else {
            imgItem.Description =
                imgItem.Description != undefined ? imgItem.Description : "";
            tempArray.push(imgItem);
        }
    });
    tempArray?.map((tempItem: any) => {
        tempItem.Checked = false;
    });
    setTaskImages(tempArray);
    // UploadImageFunction(lastindexArray, fileName);
    if (addUpdateIndex != undefined) {
        let updateIndex: any = addUpdateIndex[0];
        let updateImage: any = imageList[updateIndex];
        // if (updateIndex + 1 >= imageList.length) {
        UploadImageFunction(lastindexArray, fileName, tempArray, addUpdateIndex, AddMoreImage);
        // } 
        // else {
        //     if (updateIndex < imageList.length) {
        //         ReplaceImageFunction(updateImage, updateIndex);
        //     }
        // }
    }
};



const UploadImageFunction = (Data: any, imageName: any, DataJson: any, imageIndex: any, AddMoreImage: any): Promise<any> => {
    return new Promise<void>(async (resolve, reject) => {
        // setIsImageUploaded(false);
        let listId = textItems?.EditData.listId;
        let listName = textItems?.EditData.listName;
        let Id = textItems?.EditData.Id;
        var src = Data.data_url?.split(",")[1];
        var byteArray = new Uint8Array(
            atob(src)
                ?.split("")
                ?.map(function (c) {
                    return c.charCodeAt(0);
                })
        );
        const data = byteArray;
        var fileData = "";
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        setTimeout(() => {
            if (textItems?.EditData.listId != undefined) {
                (async () => {
                    try {
                        let web = new Web(textItems?.EditData?.siteUrl);
                        let item = web.lists.getById(listId).items.getById(Id);
                        await item.attachmentFiles.add(imageName, data);
                        console.log("Attachment added");
                        console.log(DataJson)
                        console.log(TaskImages)
                        if (AddMoreImage) {


                        } else {
                            UpdatedFeedBackParentArray = State;
                            UpdatedFeedBackParentArray[imageIndex].setImagesInfo = DataJson
                            setState([...UpdatedFeedBackParentArray]);
                            callBack(UpdatedFeedBackParentArray);
                        }

                        // UpdateBasicImageInfoJSON(DataJson, "Upload", 0);
                        // EditData.UploadedImage = DataJson;
                        // setUploadBtnStatus(false);
                        // resolve();
                    } catch (error) {
                        reject(error);
                    }
                })();
            } else {
                (async () => {
                    try {
                        let web = new Web(textItems?.EditData?.siteUrl);
                        let item = web.lists.getByTitle(listName).items.getById(Id);
                        await item.attachmentFiles.add(imageName, data);
                        UpdatedFeedBackParentArray = State;
                        UpdatedFeedBackParentArray[imageIndex].setImagesInfo = DataJson
                        setState(UpdatedFeedBackParentArray);
                        callBack(UpdatedFeedBackParentArray);
                        // console.log("Attachment added");
                        // UpdateBasicImageInfoJSON(DataJson, "Upload", 0);
                        // EditData.UploadedImage = DataJson;
                        // setUploadBtnStatus(false);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })();
            }
        }, 2000);
    });
};
//===========Addm more image functionality=========
const AddMoreImages = (index: any) => {
    setImageIndex(index)
    setopenAddMoreImagePopup(true)
}
const UpdateMoreImage = () => {
    UpdatedFeedBackParentArray = State;
    UpdatedFeedBackParentArray[imageIndex].setImagesInfo.push(TaskImages[0])

    setState([...UpdatedFeedBackParentArray]);
    callBack(UpdatedFeedBackParentArray);
    setopenAddMoreImagePopup(false)
}
const onRenderCustomAddMoreImageHeader = () => {
    return (
        <div
            className="d-flex full-width pb-1"

        >
            <div className="subheading siteColor">Add More Image</div>
            {/* <Tooltip ComponentId="6776" isServiceTask={ServicesTaskCheck} /> */}
        </div>
    );
};

//=====================End Image upload function ===============

const handleChangeTab = (event: any, newValue: any) => {
    setCurrentActiveTab(newValue)
}
const ChangeSetTitle=(index:any,value:any)=>{

    UpdatedFeedBackParentArray = State;
    UpdatedFeedBackParentArray[index].setTitle=value;
    
       setState((prevItems:any) =>(
        prevItems.map((item:any, idx:any) => idx === index ?  UpdatedFeedBackParentArray[index] : item)
       )  );
       setState([...UpdatedFeedBackParentArray]);
       callBack(UpdatedFeedBackParentArray);
   
}
const DesignCategoriesTask = (state: any) => {
    return (
        <div>
           <TabContext value={currentActiveTab}>
                <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                    {state?.map((tab: any, index: any) => (
                        <Tab key={index} label={tab?.setTitle!=""?tab?.setTitle:`Set${index + 1}`} value={index} />
                    ))}
                    <div className="alignCenter">
                    {btnStatus?<a className="alignCenter ms-2 hreflink" onClick={addMainRowInDiv}><span className="svg__iconbox svg__icon--Plus hreflink mini" title="Add set" ></span> Add New Set</a>:""}
                    {/* {btnStatus ? <button className="btn btn-primary" onClick={addMainRowInDiv}>{textItems?.DesignStatus ? "Add set" : "Add New Box"}</button> : null} */}
                    </div>
                </TabList>
                {TextItems?.length > 0 ?
                    <div className={IndexCount % 2 == 0 ? "DesignCategoriesTask" : "DesignCategoriesTask"}>
                        {state.map((obj: any, i: any) => {
                            let index: any = i;
                            return (
                                <TabPanel key={i} value={i}>
                                    <div className="col-sm-12 row">
                                    <div className="full-width my-2">
                                        <span className="alignCenter">
                                        <input placeholder="Set Title"value={obj?.setTitle}onChange={(e)=>ChangeSetTitle(i,e.target.value)} />
                                        <a className="ms-2 alignCenter hreflink" onClick={() => AddMoreImages(i)}><span className="svg__iconbox svg__icon--Plus hreflink mini" title="Add set" ></span> Add Images</a></span>
                                        </div>
                                        {
                                            obj?.setImagesInfo?.length == 0 && <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} imageIndex={i} />}
                                        {obj?.setImagesInfo?.length == 1 ?
                                         obj?.setImagesInfo?.map((imgData: any) => {

                                            return (

                                                <div className="bg-white mt-2 p-0 boxshadow mb-3">

                                                    <img className="img-fluid"
                                                        alt={imgData?.ImageName}
                                                        src={imgData?.ImageUrl}
                                                        loading="lazy"
                                                    ></img>
                                                    <div className="Footerimg d-flex align-items-center justify-content-between p-1 ">
                                                        <div className='usericons'>
                                                            <span>
                                                                {/* <span className="svg__iconbox svg__icon--Plus hreflink" title="Add More Image" onClick={() => AddMoreImages(i)}></span> */}
                                                                <span >{imgData?.UploadeDate}</span>
                                                                <span className='round px-1'>
                                                                    {imgData?.UserImage != null && imgData?.UserImage != "" ?
                                                                        <img className='align-self-start hreflink ' title={imgData?.UserName} src={imgData?.UserImage} />
                                                                        : <span title={imgData?.UserName != undefined ? imgData?.UserName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
                                                                    }
                                                                </span>
                                                                {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                                                    <BiInfoCircle />
                                                                </span>}

                                                            </span>
                                                        </div>
                                                        <div className="expandicon">

                                                            <span >
                                                                {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                                            </span>
                                                            <span>|</span>
                                                            <a className='images' title="Expand Image" target="_blank" data-interception="off" href={imgData?.ImageUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>
                                                        </div>

                                                    </div>
                                                </div>

                                            )
                                        }) :
                                            <div className="carouselSlider taskImgTemplate">
                                                <Slider {...settings}>

                                                    {obj?.setImagesInfo?.map((imgData: any, indeximage: any) => {
                                                        return (
                                                            <div key={indeximage} className="carouselHeight">
                                                                <img className="img-fluid"
                                                                    alt={imgData?.ImageName}
                                                                    src={imgData?.ImageUrl}
                                                                    loading="lazy"
                                                                ></img>
                                                                <div className="Footerimg d-flex align-items-center justify-content-between p-1 ">
                                                                    <div className='usericons'>

                                                                        <div className="d-flex">
                                                                            {/* <span className="svg__iconbox svg__icon--Plus hreflink" title="Add More Image" onClick={() => AddMoreImages(i)}></span> */}
                                                                            <span className="mx-2" >{imgData?.UploadeDate}</span>
                                                                            <span className='round px-1'>
                                                                                {imgData?.UserImage != null && imgData?.UserImage != "" ?
                                                                                    <img className='align-self-start hreflink ' title={imgData?.UserName} src={imgData?.UserImage} />
                                                                                    : <span title={imgData?.UserName != undefined ? imgData?.UserName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
                                                                                }
                                                                            </span>
                                                                            {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                                                                <BiInfoCircle />
                                                                            </span>}

                                                                        </div>
                                                                    </div>
                                                                    <div className="expandicon">

                                                                        <span >
                                                                            {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                                                        </span>
                                                                        <span>|</span>
                                                                        <a className='images' title="Expand Image" target="_blank" data-interception="off" href={imgData?.imageDataUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        )



                                                    })}
                                                </Slider>
                                            </div>
                                        }

                                        <div className="FeedBack-comment row my-1">


                                            <div
                                                data-id={i}
                                                className={obj.TaskCreatedForThis != undefined && obj.TaskCreatedForThis == true ? "Disabled-Link bg-e9 col py-3" : "col"}
                                                onChange={handleChange}
                                            >
                                                <div className="Task-panel d-flex justify-content-between">
                                                    <div className="d-flex">
                                                        {ApprovalStatus ?
                                                            <div>

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

                                                            </div>
                                                            : null
                                                        }
                                                        {obj.ApproverData != undefined && obj.ApproverData.length > 0 ?
                                                            <>

                                                                <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(i, obj)}>
                                                                    {obj.ApproverData[obj.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={obj.ApproverData[obj.ApproverData?.length - 1]?.Title}><span><a href={`${Context.pageContext.web.absoluteUrl}/SitePages/TaskDashboard.aspx?UserId=${obj.ApproverData[obj.ApproverData?.length - 1]?.Id}&Name=${obj.ApproverData[obj.ApproverData?.length - 1]?.Title}`} target="_blank" data-interception="off" title={obj.ApproverData[obj.ApproverData?.length - 1]?.Title}> <img className='imgAuthor' src={obj.ApproverData[obj.ApproverData?.length - 1]?.ImageUrl} /></a></span></a></span>

                                                            </> :
                                                            null
                                                        }
                                                    </div>
                                                    <div>
                                                        <span className="mx-1">

                                                            <input className="form-check-input mt--3"
                                                                type="checkbox"
                                                                data-id={i}
                                                                name="SeeAbove"
                                                                checked={obj.SeeAbove}
                                                            />



                                                            <label className="commentSectionLabel ms-1">See Above</label>
                                                        </span>
                                                        <span> | </span>
                                                        <span className="mx-1">

                                                            <input className="form-check-input mt--3"
                                                                type="checkbox"
                                                                data-id={i}
                                                                name="Phone"
                                                                checked={obj.Phone}
                                                            />
                                                            <label className="commentSectionLabel ms-1">Phone</label>
                                                        </span>
                                                        <span> | </span>
                                                        <span className="mx-1">
                                                            <input className="form-check-input mt--3"
                                                                type="checkbox"
                                                                data-id={i}
                                                                name="LowImportance"
                                                                checked={obj.LowImportance}
                                                            />
                                                            <label className="commentSectionLabel ms-1">
                                                                Low Importance
                                                            </label>
                                                        </span>
                                                        <span> | </span>
                                                        <span className="mx-1">

                                                            <input className="form-check-input mt--3"
                                                                type="checkbox"
                                                                data-id={i}
                                                                name="HighImportance"
                                                                checked={obj.HighImportance}
                                                            />
                                                            <label className="commentSectionLabel ms-1">
                                                                High Importance
                                                            </label>
                                                        </span>
                                                        <span> | </span>
                                                        <span className="mx-1">

                                                            <input className="form-check-input mt--3"
                                                                type="checkbox"
                                                                data-id={i}
                                                                name="Completed"
                                                                checked={obj.Completed}
                                                            />
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
                                                            <span className="siteColor hreflink commentSectionLabel" onClick={() => CreateSeparateTaskFunction(obj, i)}>
                                                                Create Task
                                                            </span>
                                                        </span>
                                                        <span> | </span>
                                                        <a className="hreflink alignIcon"
                                                            style={{ cursor: "pointer" }} target="_blank"
                                                            onClick={() => RemoveItem(obj, i)}>
                                                            <span className="svg__iconbox hreflink mini svg__icon--trash"></span>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className={obj.TaskCreatedForThis != undefined && obj.TaskCreatedForThis == true ? "Disabled-Link bg-e9" : ""}>
                                                    <div className="d-flex" title={obj.isShowLight}>
                                                        <span className="SubTestBorder p-1 me-1">{1}</span>
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
                                                    {globalCount && <AddCommentComponent
                                                        Data={obj.Comments != null ? obj.Comments : []}
                                                        allFbData={TextItems}
                                                        index={0}
                                                        postStatus={i == Number(currentIndex) && postBtnStatus ? true : false}
                                                        allUsers={textItems.allUsers}
                                                        callBack={postBtnHandleCallBack}
                                                        CancelCallback={postBtnHandleCallBackCancel}
                                                        Context={Context}
                                                        ApprovalStatus={ApprovalStatus}
                                                        isCurrentUserApprover={isCurrentUserApprover}
                                                        SmartLightStatus={obj?.isShowLight}
                                                        FeedbackCount={globalCount}
                                                    />}
                                                </div>
                                                <div>
                                                    <Example
                                                        SubTextItemsArray={obj.Subtext ? obj.Subtext : []}
                                                        index={0}
                                                        commentId={obj.Id}
                                                        currentIndex={i}
                                                        callBack={subTextCallBack}
                                                        allUsers={textItems.allUsers}
                                                        ApprovalStatus={ApprovalStatus}
                                                        SmartLightStatus={obj?.isShowLight}
                                                        SmartLightPercentStatus={SmartLightPercentStatus}
                                                        isCurrentUserApprover={isCurrentUserApprover}
                                                        Context={Context}
                                                        isFirstComment={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            )
                        })}
                    </div> : null}

            </TabContext>
         </div>
          )
        }

   // ======End ====
    return (
        <div className="col mt-2">
             {State?.length?null:<button className="btn btn-primary" onClick={()=>addMainRow()}>{textItems?.DesignStatus ? "Add New Set" : "Add New Box"}</button>} 
            {State?.length && textItems?.DesignStatus==undefined ?createRows(State) : ""}
            {State?.length && textItems?.DesignStatus?DesignCategoriesTask(State): ""}
             {/* ********************* this is Approval History panel ****************** */}
             {ApprovalPointHistoryStatus ?
                <ApprovalHistoryPopup
                    ApprovalPointUserData={ApprovalPointUserData}
                    ApprovalPointCurrentIndex={ApprovalPointCurrentIndex + 1}
                    ApprovalPointHistoryStatus={ApprovalPointHistoryStatus}
                    callBack={ApprovalHistoryPopupCallBack}
                />
                : null
            }
            {/* ********************* this is Task Popup panel ****************** */}
            {IsOpenCreateTaskPanel ?
                <CreateTaskCompareTool
                    ItemDetails={ItemDetails}
                    RequiredListIds={TaskDetails.AllListIdData}
                    CallbackFunction={CreateTaskCallBack}
                    CreateTaskForThisPoint={CreateTaskForThis}
                    Context={Context}
                /> : null
            }
            {/* ********************* this is Add more  Image panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomAddMoreImageHeader}
                isOpen={openAddMoreImagePopup}
                onDismiss={() => setopenAddMoreImagePopup(false)}
                isBlocking={true}
                type={PanelType.custom}
                customWidth="500px"
            >
                <div>
                    <div className="modal-body">
                        <FlorarImageUploadComponent callBack={FlorarAddMoreImageComponentCallBack} imageIndex={imageIndex}
                        />
                    </div>
                    <footer className="float-end mt-1">
                        <button
                            type="button"
                            className="btn btn-primary px-3 mx-1"
                            onClick={() => UpdateMoreImage()}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-default px-3"
                            onClick={() => setopenAddMoreImagePopup(false)}
                        >
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>
        </div>
    );
}


