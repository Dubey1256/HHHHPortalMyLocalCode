import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import Example from "./SubCommentComponent";
import AddCommentComponent from './AddCommentComponent'
import * as Moment from 'moment';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";
import CreateTaskCompareTool from '../CreateTaskCompareTool/CreateTaskCompareTool';
// code by vivek
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { Panel, PanelType } from "office-ui-fabric-react";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Web } from "sp-pnp-js";
import { BiInfoCircle } from "react-icons/bi";
import FlorarImageUploadComponent from "../FlorarComponents/FlorarImageUploadComponent";

import MoveSetComponent from "./MoveSetComponent";
let arrayOfChar = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',]
//   End====
let globalCount = 1;
let CreateTaskIndex: any;
let currentUserData: any;

let UpdatedFeedBackParentArray: any = []
let designTemplatesArray: any[];
let copyCurrentActiveTab= 0;
export default function UXFeedbackComponent(textItems: any) {
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
     const [enableSelectForMove,setEnableSelectForMove]=useState(false)
    const [TaskImages, setTaskImages] = useState([]);
    const [sectedMoveImageData,setSectedMoveImageData]=useState([])
    const [selectedMoveData,setSelectedMoveData]=useState([])
  
    const [moveTo,setMoveTo]=useState(false)
    const [currentActiveTab, setCurrentActiveTab] :any= React.useState();
    const [openAddMoreImagePopup, setopenAddMoreImagePopup] = useState(false)
    const [imageIndex, setImageIndex]: any = useState()
    const [isEditing, setIsEditing] = useState({editable:false,index:0});
    var settings = {
        dots: false,
        infinite: true,
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
            designTemplatesArray = [];
            TextItems?.map((items: any, indexs: any) => {
                if (indexs > 0) {
                    if (typeof items == "object") {
                        items?.TemplatesArray?.map((item: any, index: any) => {
                            if (item?.ApproverData == undefined) {
                                item.ApproverData = [];
                            }
                            item.taskIndex = index;
                            // testItems.push(item?.TemplatesArray);

                            item?.TemplatesArray?.forEach((ele: any) => {
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
                           

                        })

                        designTemplatesArray.push(items)

                    }

                }
            })
            setCurrentActiveTab(0)
            setState((prev: any) => designTemplatesArray);
            setBtnStatus(true)

        } else {
            setBtnStatus(false)
        }
        if (SmartLightStatus) {
            setIsCurrentUserApprover(true);
        }
        copyCurrentActiveTab=0
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
    const addSet = () => {

      
            let designTemplates: any = {
                setTitle: `set${designTemplatesArray?.length + 1}`,
                setImagesInfo: [],
                TemplatesArray: []
            }
            designTemplatesArray.push(designTemplates);
      

        IndexCount = IndexCount + 1;
        const object: any = {
            Completed: "",
            Title: "",
            text: "",
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: '',
            isShowLight: '',
            TaskCreatedForThis: false,

        };

        // State.push(object);
        let dummyArray = []
        dummyArray.push(object)

        designTemplatesArray[designTemplatesArray?.length - 1].TemplatesArray = dummyArray;

        setState([...designTemplatesArray]);


        setCurrentActiveTab(designTemplatesArray?.length - 1)
        copyCurrentActiveTab=designTemplatesArray?.length - 1
        setTexts(!Texts);
        setBtnStatus(true);
    }
    const addMainRowInDiv = () => {
        let testTaskIndex: any = State?.length + 1
        let oldDesignArray = designTemplatesArray[copyCurrentActiveTab].TemplatesArray
        IndexCount = IndexCount + 1;
        const object: any = {
            Completed: "",
            Title: "",
            text: "",
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: '',
            isShowLight: '',
            TaskCreatedForThis: false,

        };
        oldDesignArray.push(object)
        designTemplatesArray[copyCurrentActiveTab].TemplatesArray = oldDesignArray
        setState(designTemplatesArray);

        setTexts(!Texts);
        setBtnStatus(true);
    }

    const RemoveItem = (dltItem: any, Index: any) => {
        let tempArray: any = []
        IndexCount--;

        designTemplatesArray[copyCurrentActiveTab].TemplatesArray?.map((array: any, ItemIndex: any) => {
            if (dltItem.Title != array.Title || ItemIndex != Index) {
                tempArray.push(array);
            }
        })
        // if (tempArray?.length == 0) {
        //     setBtnStatus(false)
        //     callBack("delete");
        // } else {

            designTemplatesArray[copyCurrentActiveTab].TemplatesArray = tempArray
            
            callBack(designTemplatesArray);
        // }
        designTemplatesArray[copyCurrentActiveTab].TemplatesArray = tempArray
        setState([...designTemplatesArray]);
    }

    function handleChange(e: any) {
        designTemplatesArray = State;
        UpdatedFeedBackParentArray = designTemplatesArray[copyCurrentActiveTab].TemplatesArray;
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
            if (idx === copyCurrentActiveTab) {
                item.TemplatesArray?.map((data: any, index: any) => {
                    if (index == id) {
                        return {
                            ...data,
                            Title: UpdatedFeedBackParentArray[id].Title,
                            [name]: updatedValue
                        };
                    }
                })

            }
            return item;
        });
        designTemplatesArray = updatedState
        setState(updatedState);
        callBack(updatedState);
    }
    const subTextCallBack = useCallback((subTextData: any, subTextIndex: any) => {

        console.log(textItems?.copyAlldescription)
        designTemplatesArray[copyCurrentActiveTab].TemplatesArray[subTextIndex].Subtext = subTextData;
        // UpdatedFeedBackParentArray[subTextIndex].Subtext = subTextData
        callBack(designTemplatesArray);
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
        UpdatedFeedBackParentArray = State?.length > 0 ? State : designTemplatesArray;
        UpdatedFeedBackParentArray[copyCurrentActiveTab].TemplatesArray[Index].Comments = dataPost;
        designTemplatesArray = UpdatedFeedBackParentArray
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
        const copy =  designTemplatesArray[copyCurrentActiveTab].TemplatesArray;
        let tempApproverData: any = copy[index].ApproverData;
        const obj = { ...copy[index], isShowLight: value, ApproverData: tempApproverData };
        copy[index] = obj;
  
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
        designTemplatesArray[copyCurrentActiveTab].TemplatesArray=copy
        setState([...designTemplatesArray]);
        callBack(designTemplatesArray);
       
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
                    ImageUrl: textItems?.EditData?.siteUrl +
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
                            if (AddMoreImage == false) {
                                UpdatedFeedBackParentArray = State;
                                UpdatedFeedBackParentArray[copyCurrentActiveTab].setImagesInfo = DataJson
                                setState([...UpdatedFeedBackParentArray]);
                                callBack(UpdatedFeedBackParentArray);
                            }

                        }
                        catch (error) {
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
                            UpdatedFeedBackParentArray[copyCurrentActiveTab].setImagesInfo = DataJson
                            setState(UpdatedFeedBackParentArray);
                            callBack(UpdatedFeedBackParentArray);

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
        UpdatedFeedBackParentArray[copyCurrentActiveTab].setImagesInfo.push(TaskImages[0])
        designTemplatesArray=UpdatedFeedBackParentArray
        setState(UpdatedFeedBackParentArray);
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
    const DeleteImageFunction = (imageIndex: any, imageName: any, FunctionType: any) => {
      
            let tempArray: any = [];
            
            if (FunctionType == "Remove") {
                designTemplatesArray[copyCurrentActiveTab]?.setImagesInfo?.map((imageData:any, index:any) => {
                    if (index != imageIndex) {
                        tempArray.push(imageData);
                    }
                });
                setTaskImages(tempArray);
            }
            if (textItems?.TaskListDetails?.ListId != undefined) {
                (async () => {
                    try {
                        let web = new Web(textItems?.TaskListDetails?.SiteURL);
                        let item = web.lists
                            .getById(textItems?.TaskListDetails?.ListId)
                            .items.getById(textItems?.TaskListDetails?.TaskId);
                        await item.attachmentFiles.getByName(imageName).recycle();
                       designTemplatesArray[copyCurrentActiveTab].setImagesInfo = tempArray;
                       setState([...designTemplatesArray]);
                       callBack(designTemplatesArray);
                        console.log("Attachment deleted");
                      
                    } catch (error) {
                        console.log("Error deleting attachment:", error);
                        designTemplatesArray[copyCurrentActiveTab].setImagesInfo = tempArray;
                        setState([...designTemplatesArray]);
                        callBack(designTemplatesArray);
                    }
                })();
            } else {
                (async () => {
                    try {
                        let web = new Web(textItems?.TaskListDetails?.SiteURL);
                        let item = web.lists
                            .getByTitle(textItems?.TaskListDetails?.siteType)
                            .items.getById(textItems?.TaskListDetails?.TaskId);
                        await item.attachmentFiles.getByName(imageName).recycle();
                        designTemplatesArray[copyCurrentActiveTab].setImagesInfo = tempArray;
                       
                        setState([...designTemplatesArray]);
                        console.log("Attachment deleted");
                       
                    } catch (error) {
                        console.log("Error deleting attachment:", error);
                        designTemplatesArray[copyCurrentActiveTab].setImagesInfo = tempArray;
                        setState([...designTemplatesArray]);
                        callBack(designTemplatesArray);
                       
                    }
                })();
            }
        
    };
    //=====================End Image upload function ===============

// -----------  change the tab name and its function strat -----------------
    const handleChangeTab = (newValue: any) => {
        setCurrentActiveTab(newValue)
            copyCurrentActiveTab=newValue
            if(currentActiveTab!=newValue){
            setIsEditing({...isEditing,editable:false,index:0})
        }
      
    }

    const handleEditClick = (index:any) => {
        // let editablefield=!isEditing.editable
        setIsEditing({...isEditing,editable:true,index:index});
    };
    const handleTitleInputChange = (index: any, value: any) => {
          UpdatedFeedBackParentArray = State;
        UpdatedFeedBackParentArray[index].setTitle = value;

        setState((prevItems: any) => (
            prevItems.map((item: any, idx: any) => idx === index ? UpdatedFeedBackParentArray[index] : item)
        ));
        designTemplatesArray=UpdatedFeedBackParentArray
        setState([...UpdatedFeedBackParentArray]);
        callBack(UpdatedFeedBackParentArray);

    }
    //------End tab chnages function -------------

    //-------------Move set function start ---------------
    const moveToCallbackFunction=(data:any)=>{
       
        if(data?.length>0){
            designTemplatesArray=data;
        setState([...data])
        }
        setMoveTo(false);
        setSelectedMoveData([]);
        setSectedMoveImageData([]);
    }
    const handleCheckboxImageChange = (data:any, isChecked:any) => {
        if (isChecked) {
            setSectedMoveImageData([...sectedMoveImageData, data]);
        } else {
            setSectedMoveImageData(sectedMoveImageData.filter(item => item.ImageName !== data.ImageName));
        }
    };
    const handleCheckboxsetChange=(data:any, isChecked:any)=>{
        if (isChecked) {
            setSelectedMoveData([...selectedMoveData, data]);
        } else {
            setSelectedMoveData(selectedMoveData.filter(item => item.Title !== data.Title));
        }
    }
    //------------------move set function End-------------
     

    //--------------Delete set Fuctionality----------------
    const DeleteSet=(index:any)=>{
        designTemplatesArray.splice(index,1) 
        if(index==0){
            setCurrentActiveTab(index)   
        }else{
            setCurrentActiveTab(index-1)
        }
       setState([...designTemplatesArray]);
        callBack(designTemplatesArray);

    }
    //------------Delete set Data end -----------------
    
    const DesignCategoriesTask = (state: any) => {
        return (
            <div className="UXDesignTabs">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {state?.map((tab:any, index: any) => (
                        <div className="position-relative">
                            <button
                            className={`nav-link ${currentActiveTab == index ? 'active' : ''}`}
                            id={tab?.setTitle}
                            data-bs-toggle="tab"
                            data-bs-target={`#${tab?.setTitle}`}
                            type="button"
                            role="tab"
                            aria-controls={tab?.setTitle}
                            aria-selected="true"
                            onClick={() => { handleChangeTab(index) }}
                        >
                         
                   {isEditing?.editable &&  isEditing?.index==index?<input
                        type="text"
                        value={tab?.setTitle}
                        onChange={(e)=>handleTitleInputChange(index,e.target.value)}
                        autoFocus
                    />:
                    
                   arrayOfChar[index]+"."+tab?.setTitle}
                   
                    
                 </button>
                 <div className="alignCenter editTab">
                 <span className="svg__iconbox svg__icon--editBox hreflink" title="Edit set Title" onClick={()=>handleEditClick(index)}></span>
                 <span  className="svg__iconbox hreflink mini svg__icon--trash" title="Delete Set"onClick={() => DeleteSet(index) } > </span>
                    </div>
                        </div>
                    

                    ))}
                    {btnStatus ? <a className="alignCenter ms-2 hreflink" onClick={addSet}><span className="svg__iconbox svg__icon--Plus hreflink mini" title="Add set" ></span> Add New Set</a> : ""}
                    <div className="alignCenter ml-auto">{<a className="hreflink" onClick={()=>setEnableSelectForMove(true)}>Enable move</a>}
                    <span className="mx-2"> | </span>
                    {<a className="hreflink" onClick={()=>setMoveTo(true)}>Move to Set</a>}</div>
                </ul>


                <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                    {TextItems?.length > 0 ?
                        <>

                            {state.map((designdata: any, j: any) => {
                                let index: any = j;
                                return (
                                    <div
                                        className={currentActiveTab == j ? 'tab-pane active' : 'tab-pane '}
                                        id={designdata?.setTitle}
                                        role="tabpanel"
                                        aria-labelledby={designdata?.setTitle}
                                    >
                                        <div className="full-width my-2">
                                            <span className="alignCenter">
                                               
                                                <a className="ms-2 alignCenter hreflink" onClick={() => AddMoreImages(j)}><span className="svg__iconbox svg__icon--Plus hreflink mini" title="Add set" ></span> Add Images</a></span>
                                        </div>
                                        {
                                            designdata?.setImagesInfo?.length == 0 && <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} imageIndex={j} />}
                                        {designdata?.setImagesInfo?.length == 1 ?
                                            designdata?.setImagesInfo?.map((imgData: any,imageIndex:any) => {
                                                const isChecked = sectedMoveImageData.some(item => item.ImageName === imgData.ImageName);
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
                                                                    <span
                                                                                className="mx-1 hover-text"
                                                                                onClick={() =>
                                                                                    DeleteImageFunction(
                                                                                        imageIndex,
                                                                                        imgData.ImageName,
                                                                                        "Remove"
                                                                                    )
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                | <RiDeleteBin6Line /> 
                                                                                <span className="tooltip-text pop-right">
                                                                                    Delete
                                                                                </span>
                                                                            </span>

                                                                </span>
                                                            </div>
                                                            <div className="expandicon">

                                                                <span >
                                                                    {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                                                </span>
                                                                {enableSelectForMove && <span key={imageIndex}className="ms-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`checkbox-${imageIndex}`}
                                                                        name={`checkbox-${imageIndex}`}
                                                                        value={imgData?.ImageName}
                                                                        checked={isChecked}
                                                                        onChange={(e) => handleCheckboxImageChange(imgData, e.target.checked)}
                                                                    />
                                                                    <label className="ms-1" htmlFor={`checkbox-${imageIndex}`}>Select for Move</label><br />
                                                                </span>}
                                                            </div>

                                                        </div>
                                                    </div>

                                                )
                                            }) :
                                            <div className="carouselSlider taskImgTemplate">
                                                <Slider {...settings}>

                                                    {designdata?.setImagesInfo?.map((imgData: any, indeximage: any) => {
                                                     const isChecked = sectedMoveImageData.some(item => item.ImageName === imgData.ImageName);
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
                                                                            <span
                                                                                className="mx-1 hover-text"
                                                                                onClick={() =>
                                                                                    DeleteImageFunction(
                                                                                        indeximage,
                                                                                        imgData.ImageName,
                                                                                        "Remove"
                                                                                    )
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                | <RiDeleteBin6Line /> 
                                                                                <span className="tooltip-text pop-right">
                                                                                    Delete
                                                                                </span>
                                                                            </span>

                                                                        </div>
                                                                    </div>
                                                                    <div className="expandicon">

                                                                        <span >
                                                                            {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                                                        </span>
                                                                        {enableSelectForMove && <span key={imageIndex}className="ms-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`checkbox-${imageIndex}`}
                                                                        name={`checkbox-${imageIndex}`}
                                                                        value={imgData?.ImageName}
                                                                        checked={isChecked}
                                                                        onChange={(e) => handleCheckboxImageChange(imgData, e.target.checked)}
                                                                    />
                                                                    <label className="ms-1" htmlFor={`checkbox-${imageIndex}`}>Select for Move</label><br />
                                                                </span> } 
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        )



                                                    })}
                                                </Slider>
                                            </div>
                                        }
                                        {designdata?.TemplatesArray?.length > 0 && designdata?.TemplatesArray?.map((obj: any, i: any) => {
                                            const isChecked = selectedMoveData.some(item => item.Title === obj.Title);
                                            return (
                                                <div className="col-sm-12 row">


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
                                                                    <span>|</span>
                                                                    {enableSelectForMove &&  <span  key={i}className="mx-1">
                                                                    
                                                                    <input
                                                                    className="form-check-input mt--3"
                                                                        type="checkbox"
                                                                        id={`checkbox-${i}`}
                                                                        name={`checkbox-${i}`}
                                                                        value={obj?.Title}
                                                                        checked={isChecked}
                                                                        onChange={(e) => handleCheckboxsetChange(obj, e.target.checked)}
                                                                    />
                                                                    <label className="ms-1" htmlFor={`checkbox-${imageIndex}`}>Select for Move</label>
                                                                </span>  }
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
                                                                    <span className="SubTestBorder p-1 me-1">{`${arrayOfChar[currentActiveTab]}.${i + 1}`}</span>
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
                                                                    index={i}
                                                                    postStatus={i == Number(currentIndex) && postBtnStatus ? true : false}
                                                                    allUsers={textItems.allUsers}
                                                                    callBack={postBtnHandleCallBack}
                                                                    CancelCallback={postBtnHandleCallBackCancel}
                                                                    Context={Context}
                                                                    ApprovalStatus={ApprovalStatus}
                                                                    isCurrentUserApprover={isCurrentUserApprover}
                                                                    SmartLightStatus={obj?.isShowLight}
                                                                    UXStatus={true}
                                                                />}
                                                            </div>
                                                            <div>
                                                                <Example
                                                                    SubTextItemsArray={obj.Subtext ? obj.Subtext : []}
                                                                    index={i}
                                                                    commentId={obj.Id}
                                                                    currentIndex={i}
                                                                    callBack={subTextCallBack}
                                                                    allUsers={textItems.allUsers}
                                                                    ApprovalStatus={ApprovalStatus}
                                                                    SmartLightStatus={obj?.isShowLight}
                                                                    SmartLightPercentStatus={SmartLightPercentStatus}
                                                                    isCurrentUserApprover={isCurrentUserApprover}
                                                                    Context={Context}
                                                                    SetChar={`${arrayOfChar[currentActiveTab]}.`}
                                                                    isFirstComment={false}
                                                                
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        })}

                                    </div>
                                )


                            })}
                            {btnStatus ? <button className="btn btn-primary" onClick={addMainRowInDiv}>Add New Box</button> : null}
                        </> : null}

                </div>

            </div>
        )
    }

    // ======End ====
    return (
        <div className="col mt-2">
            {State?.length ? null : <button className="btn btn-primary" onClick={() => addSet()}>Add New Set</button>}

            {State?.length && textItems?.UXStatus ? DesignCategoriesTask(State) : ""}
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
            {/**************End************************************* */}
                {/* ********************* this is MovesetPanel ****************** */}
               {moveTo&& <MoveSetComponent AllSetData={State}moveToCallbackFunction={moveToCallbackFunction}
                selectedMoveData={selectedMoveData}
                 sectedMoveImageData={sectedMoveImageData}
                ></MoveSetComponent>}
                {/*********Moves set panel End***************** */}
        </div>
    );
}


