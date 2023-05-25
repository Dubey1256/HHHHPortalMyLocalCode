import * as React from "react";
import * as $ from 'jquery';
import * as Moment from 'moment';
import { Web } from "sp-pnp-js";
import pnp from 'sp-pnp-js';
import Picker from "./SmartMetaDataPicker";
import Example from "./FroalaCommnetBoxes";
import * as globalCommon from "../globalCommon";
import ImageUploading, { ImageListType } from "react-images-uploading";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
// import ComponentPortPolioPopup from "../../webparts/EditPopupFiles/ComponentPortfolioSelection";
import ServiceComponentPortfolioPopup from './ServiceComponentPortfolioPopup';
import axios, { AxiosResponse } from 'axios';
import "bootstrap/js/dist/tab.js";
import "bootstrap/js/dist/carousel.js";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import LinkedComponent from './LinkedComponent';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { FaExpandAlt } from 'react-icons/fa'
import { RiDeleteBin6Line, RiH6 } from 'react-icons/ri'
import { TbReplace } from 'react-icons/tb'
import NewTameSheetComponent from "./NewTimeSheet";
import CommentBoxComponent from "./CommentBoxComponent";
import TimeEntryPopup from './TimeEntryComponent';
import VersionHistory from "../VersionHistroy/VersionHistory";
import Tooltip from "../Tooltip";
import FlorarImageUploadComponent from '../FlorarComponents/FlorarImageUploadComponent';
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "reactstrap";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    useTable,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
    HeaderGroup,
} from 'react-table';
import { Filter, DefaultColumnFilter } from '../ReactTableComponents/filters';
import ShowTaskTeamMembers from "../ShowTaskTeamMembers";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import EmailComponent from "../EmailComponents";
import SiteCompositionComponent from "./SiteCompositionComponent";
import SmartTotalTime from './SmartTimeTotal';
// import {DatePicker} from 'react-date-picker';
// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import {CDatePicker} from '@coreui/react';
// import SiteComposition from "../SiteComposition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BackgroundCommentComponent from "./BackgroundCommentComponent";


var AllMetaData: any = []
var taskUsers: any = []
var IsShowFullViewImage = false;
var CommentBoxData: any = [];
var SubCommentBoxData: any = [];
var updateFeedbackArray: any = [];
var tempShareWebTypeData: any = [];
var tempCategoryData: any;
var SiteTypeBackupArray: any = [];
var currentUserBackupArray: any = [];
let AutoCompleteItemsArray: any = [];
var FeedBackBackupArray: any = [];
var ChangeTaskUserStatus: any = true;
let ApprovalStatusGlobal: any = false;
var TaskApproverBackupArray: any = [];
var TaskCreatorApproverBackupArray: any = [];
var ReplaceImageIndex: any;
var ReplaceImageData: any;
var AllProjectBackupArray: any = [];
var EditDataBackup: any;
var AllClientCategoryDataBackup: any = [];
var selectedClientCategoryData: any = [];
var GlobalServiceAndComponentData: any = [];
const EditTaskPopup = (Items: any) => {
    const Context = Items.context;
    const AllListIdData = Items.AllListId;
    Items.Items.Id = Items.Items.ID;
    const [TaskImages, setTaskImages] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [IsServices, setIsServices] = React.useState(false);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [smartServicesData, setSmartServicesData] = React.useState([]);
    const [CategoriesData, setCategoriesData] = React.useState('');
    const [ShareWebTypeData, setShareWebTypeData] = React.useState([]);
    const [AllCategoryData, setAllCategoryData] = React.useState([]);
    const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]);
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    let [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    let [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    let [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const maxNumber = 69;
    const [UpdateTaskInfo, setUpdateTaskInfo] = React.useState(
        {
            Title: '', PercentCompleteStatus: '', ComponentLink: ''
        }
    )
    const [EditData, setEditData] = React.useState<any>({});
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [modalIsOpen, setModalIsOpen] = React.useState(true);
    const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
    const [TimeSheetPopup, setTimeSheetPopup] = React.useState(false);
    const [hoverImageModal, setHoverImageModal] = React.useState('None');
    const [ImageComparePopup, setImageComparePopup] = React.useState(false);
    const [CopyAndMoveTaskPopup, setCopyAndMoveTaskPopup] = React.useState(false);
    const [ImageCustomizePopup, setImageCustomizePopup] = React.useState(false);
    const [replaceImagePopup, setReplaceImagePopup] = React.useState(false);
    const [ProjectManagementPopup, setProjectManagementPopup] = React.useState(false);
    const [compareImageArray, setCompareImageArray] = React.useState([]);
    const [composition, setComposition] = React.useState(true);
    const [PercentCompleteStatus, setPercentCompleteStatus] = React.useState('');
    const [taskStatus, setTaskStatus] = React.useState('');
    const [PercentCompleteCheck, setPercentCompleteCheck] = React.useState(true)
    const [itemRank, setItemRank] = React.useState('');
    const [PriorityStatus, setPriorityStatus] = React.useState();
    const [PhoneStatus, setPhoneStatus] = React.useState(false);
    const [EmailStatus, setEmailStatus] = React.useState(false);
    const [DesignStatus, setDesignStatus] = React.useState(false);
    const [OnlyCompletedStatus, setOnlyCompletedStatus] = React.useState(false);
    const [ImmediateStatus, setImmediateStatus] = React.useState(false);
    const [ApprovalStatus, setApprovalStatus] = React.useState(false);
    const [ApproverData, setApproverData] = React.useState([]);
    const [SmartLightStatus, setSmartLightStatus] = React.useState(false);
    const [SmartLightPercentStatus, setSmartLightPercentStatus] = React.useState(false);
    const [ShowTaskDetailsStatus, setShowTaskDetailsStatus] = React.useState(false);
    const [currentUserData, setCurrentUserData] = React.useState([]);
    const [UploadBtnStatus, setUploadBtnStatus] = React.useState(false);
    const [InputFieldDisable, setInputFieldDisable] = React.useState(false);
    const [HoverImageData, setHoverImageData] = React.useState([]);
    const [SiteTypes, setSiteTypes] = React.useState([]);
    const [categorySearchKey, setCategorySearchKey] = React.useState('');
    const [ServicesTaskCheck, setServicesTaskCheck] = React.useState(false);
    const [ComponentTaskCheck, setComponentTaskCheck] = React.useState(false);
    const [ServicePopupType, setServicePopupType] = React.useState('');
    const [AllProjectData, SetAllProjectData] = React.useState([]);
    const [selectedProject, setSelectedProject] = React.useState([]);
    const [SearchedProjectData, setSearchedProjectData] = React.useState([]);
    const [ProjectSearchKey, setProjectSearchKey] = React.useState('');
    const [ApproverPopupStatus, setApproverPopupStatus] = React.useState(false);
    const [ApproverSearchKey, setApproverSearchKey] = React.useState('');
    const [ApproverSearchedData, setApproverSearchedData] = React.useState([]);
    const [ApproverSearchedDataForPopup, setApproverSearchedDataForPopup] = React.useState([]);
    const [sendEmailStatus, setSendEmailStatus] = React.useState(false);
    const [sendEmailComponentStatus, setSendEmailComponentStatus] = React.useState(false);
    const [sendEmailGlobalCount, setSendEmailGlobalCount] = React.useState(0);
    const [AllEmployeeData, setAllEmployeeData] = React.useState([]);
    const [ApprovalTaskStatus, setApprovalTaskStatus] = React.useState(false);
    const [SmartTotalTimeData, setSmartTotalTimeData] = React.useState(0);
    const [ClientTimeData, setClientTimeData] = React.useState([]);
    const [selectedClientCategory, setSelectedClientCategory] = React.useState([]);
    const [SiteCompositionSetting, setSiteCompositionSetting] = React.useState([]);
    const [AllClientCategoryData, setAllClientCategoryData] = React.useState([]);
    const [ApproverHistoryData, setApproverHistoryData] = React.useState([]);
    const [LastUpdateTaskData, setLastUpdateTaskData] = React.useState<any>({});
    const [SitesTaggingData, setSitesTaggingData] = React.useState<any>([]);
    const [SearchedServiceCompnentData, setSearchedServiceCompnentData] = React.useState<any>([]);
    const [SearchedServiceCompnentKey, setSearchedServiceCompnentKey] = React.useState<any>('');
    const [IsUserFromHHHHTeam, setIsUserFromHHHHTeam] = React.useState(false);

    const StatusArray = [
        { value: 1, status: "1% For Approval", taskStatusComment: "For Approval" },
        { value: 2, status: "2% Follow Up", taskStatusComment: "Follow Up" },
        { value: 3, status: "3% Approved", taskStatusComment: "Approved" },
        { value: 5, status: "5% Acknowledged", taskStatusComment: "Acknowledged" },
        { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
        { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
        { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
        { value: 90, status: "90% Task completed", taskStatusComment: "Task completed" },
        { value: 93, status: "93% For Review", taskStatusComment: "For Review" },
        { value: 96, status: "96% Follow-up later", taskStatusComment: "Follow-up later" },
        { value: 99, status: "99% Completed", taskStatusComment: "Completed" },
        { value: 100, status: "100% Closed", taskStatusComment: "Closed" }
    ]
    let ItemRankArray = [
        { rankTitle: 'Select Item Rank', rank: null },
        { rankTitle: '(8) Top Highlights', rank: 8 },
        { rankTitle: '(7) Featured Item', rank: 7 },
        { rankTitle: '(6) Key Item', rank: 6 },
        { rankTitle: '(5) Relevant Item', rank: 5 },
        { rankTitle: '(4) Background Item', rank: 4 },
        { rankTitle: '(2) to be verified', rank: 2 },
        { rankTitle: '(1) Archive', rank: 1 },
        { rankTitle: '(0) No Show', rank: 0 }
    ]

    //  ************** This is used for handeling Site Url for Diffrent Cases ******************** 

    var siteUrls: any;
    if (Items != undefined && Items.Items.siteUrl != undefined && Items.Items.siteUrl.length < 20) {
        if (Items.Items.siteType != undefined) {
            siteUrls = `https://hhhhteams.sharepoint.com/sites/${Items.Items.siteType}${Items.Items.siteUrl}`
        } else {
            siteUrls = AllListIdData.siteUrl;
        }
    } else {
        siteUrls = AllListIdData.siteUrl
    }
    React.useEffect(() => {
        loadTaskUsers();
        // getCurrentUserDetails();
        GetExtraLookupColumnData();
        getCurrentUserDetails();
        getAllSitesData();
        loadAllCategoryData("Categories");
        loadAllClientCategoryData("Client Category");
        GetMasterData();
    }, [])



    // ************************** This is the Fetch All Data for the slected Task and related to Task from Backend *******************************


    // #################### this is used for getting more the 12 lookup column data for selected task from Backend ##############################

    const GetExtraLookupColumnData = async () => {
        try {
            let web = new Web(siteUrls);
            let extraLookupColumnData: any;
            if (Items.Items.listId != undefined) {
                extraLookupColumnData = await web.lists
                    .getById(Items.Items.listId)
                    .items
                    .select("Project/Id, Project/Title, AttachmentFiles/Title, Approver/Id, Approver/Title, ClientCategory/Id,ClientCategory/Title, ApproverHistory")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand('Project, Approver, ClientCategory')
                    .get();
                if (extraLookupColumnData.length > 0) {
                    console.log("Extra Lookup Data =======", extraLookupColumnData);
                    let Data: any;
                    let ApproverData: any;
                    let ApproverHistoryData: any;
                    let ClientCategory: any;
                    Data = extraLookupColumnData[0]?.Project;
                    ApproverHistoryData = extraLookupColumnData[0]?.ApproverHistory;
                    ApproverData = extraLookupColumnData[0]?.Approver;
                    ClientCategory = extraLookupColumnData[0].ClientCategory
                    if (Data != undefined && Data != null) {
                        // let TempArray: any = [];
                        // AllProjectBackupArray.map((ProjectData: any) => {
                        //     if (ProjectData.Id == Data.Id) {
                        //         ProjectData.Checked = true;
                        //         setSelectedProject([ProjectData]);
                        //         TempArray.push(ProjectData);
                        //     } else {
                        //         ProjectData.Checked = false;
                        //         TempArray.push(ProjectData);
                        //     }
                        // })
                        setSelectedProject([Data]);
                    }
                    if (ApproverHistoryData != undefined || ApproverHistoryData != null) {
                        let tempArray = JSON.parse(ApproverHistoryData);
                        if (tempArray != undefined && tempArray.length > 0) {
                            setApproverHistoryData(tempArray);
                        }
                    }

                    if (ApproverData != undefined && ApproverData.length > 0) {
                        setApproverData(ApproverData);
                        TaskApproverBackupArray = ApproverData;
                        let TempApproverHistory: any = [];
                        if (ApproverHistoryData == undefined || ApproverHistoryData == null) {
                            ApproverData.map((itemData: any) => {
                                let tempObject: any = {
                                    ApproverName: itemData.Title,
                                    ApprovedDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                                    ApproverId: itemData.AssingedToUserId,
                                    ApproverImage: (itemData.Item_x0020_Cover != undefined || itemData.Item_x0020_Cover != null ? itemData.Item_x0020_Cover.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'),
                                    ApproverSuffix: itemData.Suffix,
                                    ApproverEmail: itemData.Email
                                }
                                TempApproverHistory.push(tempObject);
                            })
                        }
                        if (TempApproverHistory != undefined && TempApproverHistory.length > 0) {
                            setApproverHistoryData(TempApproverHistory);
                        }

                    }
                    if (ClientCategory != undefined && ClientCategory.length > 0) {
                        let TempArray: any = [];
                        ClientCategory.map((ClientData: any) => {
                            if (AllClientCategoryDataBackup != undefined && AllClientCategoryDataBackup.length > 0) {
                                AllClientCategoryDataBackup.map((clientCategoryData: any) => {
                                    if (ClientData.Id == clientCategoryData.Id) {
                                        ClientData.siteName = clientCategoryData.siteName;
                                    }
                                })
                                TempArray.push(ClientData)
                            }
                        })
                        setSelectedClientCategory(TempArray);
                        selectedClientCategoryData = TempArray;
                        console.log("selected client category form backend ==========", TempArray)
                    }
                }
                GetSelectedTaskDetails();
            } else {
                extraLookupColumnData = await web.lists
                    .getByTitle(Items.Items.listName)
                    .items
                    .select("Project/Id, Project/Title,AttachmentFiles/Title, Approver/Id, Approver/Title, ClientCategory/Title, ApproverHistory")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand('Project, Approver, ClientCategory')
                    .get();
                if (extraLookupColumnData.length > 0) {
                    let Data: any;
                    let ClientCategory: any;
                    let ApproverData: any;
                    let ApproverHistoryData: any;
                    Data = extraLookupColumnData[0]?.Project;
                    ApproverHistoryData = extraLookupColumnData[0]?.ApproverHistory;
                    ApproverData = extraLookupColumnData[0]?.Approver;
                    ClientCategory = extraLookupColumnData[0].ClientCategory
                    if (Data != undefined && Data != null) {
                        // let TempArray: any = [];
                        // AllProjectBackupArray.map((ProjectData: any) => {
                        //     if (ProjectData.Id == Data.Id) {
                        //         ProjectData.Checked = true;
                        //         setSelectedProject([ProjectData]);
                        //         TempArray.push(ProjectData);
                        //     } else {
                        //         ProjectData.Checked = false;
                        //         TempArray.push(ProjectData);
                        //     }
                        // })
                        // SetAllProjectData(Data);
                        setSelectedProject([Data])
                    }
                    if (ApproverHistoryData != undefined || ApproverHistoryData != null) {
                        let tempArray = JSON.parse(ApproverHistoryData);
                        if (tempArray != undefined && tempArray.length > 0) {
                            setApproverHistoryData(tempArray);
                        }

                    }
                    if (ApproverData != undefined && ApproverData.length > 0) {
                        setApproverData(ApproverData);
                        TaskApproverBackupArray = ApproverData;
                    }
                    if (ClientCategory != undefined && ClientCategory.length > 0) {
                        setSelectedClientCategory(ClientCategory);
                    }
                }
                GetSelectedTaskDetails();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    // #################### this is used for getting All Information for selected task from Backend ##############################

    const GetSelectedTaskDetails = async () => {
        try {
            let web = new Web(siteUrls);
            let smartMeta: any;
            let extraLookupColumnData: any;
            if (Items.Items.listId != undefined) {
                smartMeta = await web.lists
                    .getById(Items.Items.listId)
                    .items
                    .select("Id,Title,Priority_x0020_Rank,workingThisWeek,EstimatedTime,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,ClientTime,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                    .get();
            }
            else {
                smartMeta = await web.lists
                    .getByTitle(Items.Items.listName)
                    .items
                    .select("Id,Title,Priority_x0020_Rank,BasicImageInfo,EstimatedTime,workingThisWeek,OffshoreImageUrl,OffshoreComments,waitForResponse,SiteCompositionSettings,ClientTime,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                    .get();
            }
            let statusValue: any
            smartMeta?.map((item: any) => {
                let saveImage = []
                if (item.Categories != null) {
                    setCategoriesData(item.Categories);
                    tempCategoryData = item.Categories;
                    let phoneCheck = item.Categories.search("Phone");
                    let emailCheck = item.Categories.search("Email");
                    let ImmediateCheck = item.Categories.search("Immediate");
                    let ApprovalCheck = item.Categories.search("Approval");
                    let OnlyCompletedCheck = item.Categories.search("Only Completed");
                    let DesignCheck = item.Categories.search("Design")
                    if (phoneCheck >= 0) {
                        setPhoneStatus(true)
                    } else {
                        setPhoneStatus(false)
                    }
                    if (emailCheck >= 0) {
                        setEmailStatus(true)
                    } else {
                        setEmailStatus(false)
                    }
                    if (ImmediateCheck >= 0) {
                        setImmediateStatus(true)
                    } else {
                        setImmediateStatus(false)
                    }
                    if (ApprovalCheck >= 0) {
                        setApprovalStatus(true)
                        ApprovalStatusGlobal = true
                    } else {
                        setApprovalStatus(false)
                        ApprovalStatusGlobal = false
                    }
                    if (OnlyCompletedCheck >= 0) {
                        setOnlyCompletedStatus(true);
                    } else {
                        setOnlyCompletedStatus(false);
                    }
                    if (DesignCheck >= 0) {
                        setDesignStatus(true);
                    } else {
                        setDesignStatus(false);
                    }
                }
                if (item.ClientTime != null && item.ClientTime != undefined) {
                    let tempData: any = JSON.parse(item.ClientTime);
                    let tempData2: any = [];
                    if (tempData != undefined && tempData.length > 0) {
                        tempData.map((siteData: any) => {
                            let siteName: any;
                            if (siteData != undefined) {
                                if (siteData.SiteName != undefined) {
                                    siteName = siteData.SiteName.toLowerCase();
                                } else {
                                    siteName = siteData.Title.toLowerCase();
                                }
                            }
                            if (siteName == "migration" || siteName == "health" || siteName == "eps" || siteName == "qa" || siteName == "ei" || siteName == "gender" || siteName == "education" || siteName == "cep" || siteName == "shareweb" || siteName == "small projects" || siteName == 'offshore tasks') {
                                siteData.siteIcons = `https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_${siteName}.png`
                            }
                            if (siteName == 'alakdigital' || siteName == 'da e+e') {
                                siteData.siteIcons = `https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_da.png`
                            }
                            if (siteName == 'development-effectiveness' || siteName == 'de') {
                                siteData.siteIcons = `https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png`
                            }
                            if (siteName == "kathabeck") {
                                siteData.siteIcons = `https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png`
                            }
                            if (siteName == "gruene") {
                                siteData.siteIcons = `https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/logo-gruene.png`
                            }
                            if (siteName == "hhhh") {
                                siteData.siteIcons = `https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png`
                            }
                            tempData2.push(siteData);
                        })
                    }

                    let tempArray3: any = [];
                    if (tempData2 != undefined && tempData2.length > 0) {
                        tempData2.map((siteData: any) => {
                            siteData.ClientCategory = [];
                            if (selectedClientCategoryData != undefined && selectedClientCategoryData.length > 0) {
                                selectedClientCategoryData.map((ClientCategoryData: any) => {
                                    if (ClientCategoryData.siteName == siteData.SiteName) {
                                        siteData.ClientCategory.push(ClientCategoryData)
                                    }
                                })
                                tempArray3.push(siteData);
                            } else {
                                tempArray3.push(siteData);
                            }

                        })
                    }
                    setClientTimeData(tempArray3)
                    item.siteCompositionData = tempArray3;
                } else {
                    const object: any = {
                        SiteName: Items.Items.siteType,
                        ClienTimeDescription: 100,
                        localSiteComposition: true,
                        siteIcons: Items.Items.SiteIcon
                    }
                    item.siteCompositionData = [object];
                    setClientTimeData([object]);
                }

                if (item.PercentComplete != undefined) {
                    statusValue = item.PercentComplete * 100;
                    item.PercentComplete = statusValue;
                    if (statusValue < 70 && statusValue > 10 || statusValue < 80 && statusValue > 70) {
                        setTaskStatus("In Progress");
                        setPercentCompleteStatus(`${statusValue}% In Progress`);
                        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: `${statusValue}` })

                    } else {
                        StatusArray?.map((item: any) => {
                            if (statusValue == item.value) {
                                setPercentCompleteStatus(item.status);
                                setTaskStatus(item.taskStatusComment);
                            }
                        })
                    }

                    if (statusValue == 0) {
                        setTaskStatus('Not Started');
                        setPercentCompleteStatus('Not Started');
                        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '0' })
                    }

                    if (statusValue <= 3 && ApprovalStatusGlobal) {
                        ChangeTaskUserStatus = false;
                    } else {
                        ChangeTaskUserStatus = true;
                    }
                }
                if (item.Body != undefined) {
                    item.Body = item.Body.replace(/(<([^>]+)>)/ig, '');
                }
                if (item.BasicImageInfo != null && item.Attachments) {
                    saveImage.push(JSON.parse(item.BasicImageInfo))
                }
                // if (item.Priority_x0020_Rank != undefined) {
                //     if (ItemRankArray != undefined) {
                //         ItemRankArray?.map((rank: any) => {
                //             if (rank.rank == item.Priority_x0020_Rank) {
                //                 item.Priority_x0020_Rank = rank.rank;
                //             }
                //         })
                //     }
                // }
                item.TaskId = globalCommon.getTaskId(item);
                item.siteUrl = siteUrls;
                item.siteType = Items.Items.siteType;
                let AssignedUsers: any = [];
                item.listId = Items.Items.listId;
                // let ApproverDataTemp: any = [];
                let TeamMemberTemp: any = [];
                let TaskCreatorData: any = [];
                if (item.Author != undefined && item.Author != null) {
                    taskUsers.map((userData: any) => {
                        if (item.Author.Id == userData?.AssingedToUserId) {
                            TaskCreatorData.push(userData);
                            userData.Approver?.map((AData: any) => {
                                // ApproverDataTemp.push(AData);
                                TaskCreatorApproverBackupArray.push(AData);
                            })
                        }
                    })
                    if ((statusValue <= 2) && ApprovalStatusGlobal) {
                        let tempArray: any = [];
                        if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                            taskUsers.map((userData1: any) => {
                                TaskApproverBackupArray.map((itemData: any) => {
                                    if (itemData.Id == userData1?.AssingedToUserId) {
                                        AssignedUsers.push(userData1);
                                        TeamMemberTemp.push(userData1);
                                        tempArray.push(userData1);
                                    }
                                })
                            })
                        } else {
                            if (TaskCreatorApproverBackupArray?.length > 0) {
                                taskUsers.map((userData1: any) => {
                                    TaskCreatorApproverBackupArray?.map((itemData: any) => {
                                        if (itemData.Id == userData1?.AssingedToUserId) {
                                            AssignedUsers.push(userData1);
                                            TeamMemberTemp.push(userData1);
                                            tempArray.push(userData1);
                                        }
                                    })
                                })
                            }
                        }
                        if (tempArray != undefined && tempArray.length > 0) {
                            tempArray.map((itemData: any) => {
                                itemData.Id = itemData.AssingedToUserId
                            })
                            setApproverData(tempArray);
                            if ((statusValue <= 1) && ApprovalStatusGlobal) {
                                StatusArray?.map((item: any) => {
                                    if (1 == item.value) {
                                        setPercentCompleteStatus(item.status);
                                        setTaskStatus(item.taskStatusComment);
                                        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: `1` })
                                    }
                                })
                            }
                        }
                    } else {
                        taskUsers?.map((userData: any) => {
                            item.AssignedTo?.map((AssignedUser: any) => {
                                if (userData?.AssingedToUserId == AssignedUser.Id) {
                                    AssignedUsers.push(userData);
                                }
                            })
                        })
                    }
                }
                item.TaskCreatorData = TaskCreatorData;
                if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                    TaskApproverBackupArray.map((itemData: any) => {
                        currentUserBackupArray?.map((currentUser: any) => {
                            if (itemData.Id == currentUser.AssingedToUserId) {
                                setSmartLightStatus(true);
                            }
                        })
                    })
                } else {
                    if (TaskCreatorApproverBackupArray?.length > 0) {
                        TaskCreatorApproverBackupArray?.map((Approver: any) => {
                            currentUserBackupArray?.map((current: any) => {
                                if (Approver.Id == current.AssingedToUserId) {
                                    setSmartLightStatus(true);
                                }
                            })
                        })
                    }
                }
                if (item.component_x0020_link != null) {
                    item.Relevant_Url = item.component_x0020_link.Url
                }
                setTaskAssignedTo(item.AssignedTo ? item.AssignedTo : []);
                setTaskResponsibleTeam(item.Responsible_x0020_Team ? item.Responsible_x0020_Team : []);

                if (TeamMemberTemp != undefined && TeamMemberTemp.length > 0) {
                    setTaskTeamMembers(TeamMemberTemp);
                } else {
                    setTaskTeamMembers(item.Team_x0020_Members ? item.Team_x0020_Members : []);
                }
                item.TaskAssignedUsers = AssignedUsers;
                if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
                    item.TaskApprovers = TaskCreatorApproverBackupArray;
                } else {
                    item.TaskApprovers = [];
                }
                if (item.Attachments) {
                    let tempData = []
                    tempData = saveImage[0];
                    item.UploadedImage = saveImage ? saveImage[0] : '';
                    onUploadImageFunction(tempData, tempData?.length);
                }
                if (item.SharewebCategories != undefined && item.SharewebCategories?.length > 0) {
                    let tempArray: any = [];
                    tempArray = item.SharewebCategories;
                    setShareWebTypeData(item.SharewebCategories);
                    tempArray?.map((tempData: any) => {
                        tempShareWebTypeData.push(tempData);
                    })
                }
                if (item.RelevantPortfolio?.length > 0) {
                    setLinkedComponentData(item.RelevantPortfolio)
                }
                if (item.FeedBack != null) {
                    let message = JSON.parse(item.FeedBack);
                    item.FeedBackBackup = message;
                    updateFeedbackArray = message;
                    let Count: any = 0;
                    let feedbackArray = message[0]?.FeedBackDescriptions
                    if (feedbackArray != undefined && feedbackArray.length > 0) {
                        let CommentBoxText = feedbackArray[0].Title?.replace(/(<([^>]+)>)/ig, '');
                        item.CommentBoxText = CommentBoxText;
                        feedbackArray.map((FeedBackData: any) => {
                            if (FeedBackData.isShowLight == "Approve" || FeedBackData.isShowLight == "Maybe" || FeedBackData.isShowLight == "Reject") {
                                Count++;
                            } if (FeedBackData.Subtext != undefined && FeedBackData.Subtext.length > 0) {
                                FeedBackData.Subtext.map((ChildItem: any) => {
                                    if (ChildItem.isShowLight == "Approve" || ChildItem.isShowLight == "Maybe" || ChildItem.isShowLight == "Reject") {
                                        Count++;
                                    }
                                })
                            }
                        })
                    } else {
                        item.CommentBoxText = "<p></p>"
                    }
                    if (Count >= 1) {
                        setSendEmailStatus(true)
                    } else {
                        setSendEmailStatus(false)
                    }
                    item.FeedBackArray = feedbackArray;
                    FeedBackBackupArray = JSON.stringify(feedbackArray);
                } else {
                    let param: any = Moment(new Date().toLocaleString())
                    var FeedBackItem: any = {};
                    FeedBackItem['Title'] = "FeedBackPicture" + param;
                    FeedBackItem['FeedBackDescriptions'] = [];
                    FeedBackItem['ImageDate'] = "" + param;
                    FeedBackItem['Completed'] = '';
                    updateFeedbackArray = [FeedBackItem]
                    let tempArray: any = [FeedBackItem]
                    item.FeedBack = JSON.stringify(tempArray);
                    FeedBackBackupArray = JSON.stringify(tempArray);
                }
                if (item.Component?.length > 0) {
                    setComponentTaskCheck(true)
                    setSmartComponentData(item.Component);
                } else {
                    setComponentTaskCheck(false)
                }
                if (item.Services?.length > 0) {
                    setServicesTaskCheck(true)
                    setSmartServicesData(item.Services);
                } else {
                    setServicesTaskCheck(false)
                }

                if (item.OffshoreComments != null || item.OffshoreComments != undefined) {
                    let BackgroundComments: any = JSON.parse(item.OffshoreComments);
                    if (BackgroundComments != undefined && BackgroundComments.length > 0) {
                        item.BackgroundComments = BackgroundComments
                    } else {
                        item.BackgroundComments = []
                    }
                }

                if (item.OffshoreImageUrl != null || item.OffshoreImageUrl != undefined) {
                    let BackgroundImages: any = JSON.parse(item.OffshoreImageUrl);
                    if (BackgroundImages != undefined && BackgroundImages.length > 0) {
                        item.BackgroundImages = BackgroundImages
                    } else {
                        item.BackgroundImages = []
                    }
                }

                setEditData(item)
                if (item.Component != undefined && item.Component.length > 0) {
                    let PortfolioId: any = item.Component[0].Id;
                    GetPortfolioSiteComposition(PortfolioId)
                }

                EditDataBackup = item;
                setPriorityStatus(item.Priority)
                console.log("Task All Details form backend  ==================", item)
            })
        } catch (error) {
            console.log("Error :", error.message);
        }
    }

    //  ******************************* this is Service And Component Portfolio Popup Related All function and CallBack *******************
    const EditComponent = (item: any, title: any) => {
        setIsComponent(true);
        setShareWebComponent(item);
    }
    const EditComponentPicker = (item: any, title: any) => {
        setIsComponentPicker(true);
        setShareWebComponent(item);
    }
    const EditLinkedServices = (item: any, title: any) => {
        setIsServices(true);
        setShareWebComponent(item);
        setServicePopupType(title);
    }


    // ################# this is for Change Task Component And Service Component #######################

    const ChangeComponentStatus = (e: any, Type: any) => {
        if (Type == "Component") {
            setServicesTaskCheck(false);
            setComponentTaskCheck(true);
            GetAllComponentAndServiceData(Type)
        }
        if (Type == "Service") {
            setServicesTaskCheck(true);
            setComponentTaskCheck(false);
            GetAllComponentAndServiceData(Type)
        }
    }

    const GetAllComponentAndServiceData = async (ComponentType: any) => {
        let PropsObject: any = {
            MasterTaskListID: AllListIdData.MasterTaskListID,
            siteUrl: AllListIdData.siteUrl,
            ComponentType: ComponentType,
            TaskUserListId: AllListIdData.TaskUsertListID
        }
        let CallBackData = await globalCommon.GetServiceAndComponentAllData(PropsObject);
        if (CallBackData.AllData != undefined && CallBackData.AllData.length > 0) {
            GlobalServiceAndComponentData = CallBackData.AllData;
        }
    }

    const autoSuggestionsForServiceAndComponent = (e: any) => {
        if (ServicesTaskCheck || ComponentTaskCheck) {
            if (GlobalServiceAndComponentData == undefined || GlobalServiceAndComponentData.length == 0) {
                if (ServicesTaskCheck) {
                    GetAllComponentAndServiceData("Service");
                }
                if (ComponentTaskCheck) {
                    GetAllComponentAndServiceData("Component");
                }
            }
            let SearchedKeyWord: any = e.target.value;
            setSearchedServiceCompnentKey(SearchedKeyWord);
            let TempArray: any = [];
            if (SearchedKeyWord.length > 0) {
                if (GlobalServiceAndComponentData != undefined && GlobalServiceAndComponentData.length > 0) {
                    GlobalServiceAndComponentData.map((AllDataItem: any) => {
                        if ((AllDataItem.NewLeble?.toLowerCase()).includes(SearchedKeyWord.toLowerCase())) {
                            TempArray.push(AllDataItem);
                        }
                    })
                }
                if (TempArray != undefined && TempArray.length > 0) {
                    setSearchedServiceCompnentData(TempArray);
                }
            } else {
                setSearchedServiceCompnentData([]);
                setSearchedServiceCompnentKey("");
            }
        } else {
            alert("Please Choose Component / Service For Searching!!!")
        }
    }

    const setSelectedServiceAndCompnentData = (SelectedData: any) => {
        console.log("selected Data form auto suggestion from Auto Suggesution Service and comonente==========", SelectedData);
        setSearchedServiceCompnentData([]);
        setSearchedServiceCompnentKey("");
        if (ServicesTaskCheck) {
            ComponentServicePopupCallBack([SelectedData], "Service", "Save");
        }
        if (ComponentTaskCheck) {
            ComponentServicePopupCallBack([SelectedData], "Component", "Save");
        }

    }

    //  ###################  Service And Component Portfolio Popup Call Back Functions and Validations ##################

    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        if (functionType == "Close") {
            if (Type == "Service") {
                setIsServices(false);
            } else {
                setIsComponent(false)
            }
        } else {
            if (Type == "Service") {
                if (DataItem != undefined && DataItem.length > 0) {
                    setLinkedComponentData(DataItem);
                    setSmartServicesData(DataItem);
                    setSmartComponentData([]);
                    console.log("Popup component linkedComponent", DataItem);
                }
                setIsServices(false);
            }
            if (Type == "Component") {
                if (DataItem != undefined && DataItem.length > 0) {
                    if (DataItem[0].Sitestagging != null || DataItem[0].Sitestagging != undefined) {
                        let ClientData = JSON.parse(DataItem[0].Sitestagging ? DataItem[0].Sitestagging : [{}]);
                        let TempSiteCompositionArray: any = [];
                        if (ClientData != undefined && ClientData.length > 0) {
                            ClientData.map((SiteData: any) => {
                                let TempObject: any = {
                                    SiteName: SiteData.Title,
                                    ClienTimeDescription: SiteData.ClienTimeDescription,
                                    localSiteComposition: true
                                }
                                TempSiteCompositionArray.push(TempObject);
                            })
                            if (TempSiteCompositionArray != undefined && TempSiteCompositionArray.length > 0) {
                                setSitesTaggingData(TempSiteCompositionArray);
                            }
                        }
                    }
                    setSmartComponentData(DataItem);
                    setSmartServicesData([])
                    console.log("Popup component smartComponent ", DataItem)
                }
                setIsComponent(false)
            }
        }
    }, [])

    // ********** this is for smart category Related all function and callBack function for Picker Component Popup ********


    //  ######################  This is  Client Category Get Data Call From Backend  #######################

    const loadAllClientCategoryData = function (SmartTaxonomy: any) {
        var AllTaskusers = []
        var AllMetaData: any = []
        var TaxonomyItems: any = []
        var url = (`${siteUrls}/_api/web/lists/getbyid('${AllListIdData?.SmartMetadataListID}')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '` + SmartTaxonomy + "'")
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                AllTaskusers = data.d.results;
                $.each(AllTaskusers, function (index: any, item: any) {
                    if (item.Title.toLowerCase() == 'pse' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EPS';
                    }
                    else if (item.Title.toLowerCase() == 'e+i' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EI';
                    }
                    else if (item.Title.toLowerCase() == 'education' && item.TaxType == 'Client Category') {
                        item.newTitle = 'Education';
                    }
                    else {
                        item.newTitle = item.Title;
                    }
                    AllMetaData.push(item);
                })
                if (SmartTaxonomy == "Client Category") {
                    setAllClientCategoryData(AllMetaData);
                    AllClientCategoryDataBackup = AllMetaData;
                }
            },
            error: function (error: any) {
                console.log('Error:', error)
            }
        })
    };
    var AutoCompleteItems: any = [];
    const loadAllCategoryData = function (SmartTaxonomy: any) {
        var AllTaskusers = []
        var AllMetaData: any = []
        var TaxonomyItems: any = []
        var url = (`${siteUrls}/_api/web/lists/getbyid('${AllListIdData?.SmartMetadataListID}')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '` + SmartTaxonomy + "'")
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                AllTaskusers = data.d.results;
                $.each(AllTaskusers, function (index: any, item: any) {
                    if (item.Title.toLowerCase() == 'pse' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EPS';
                    }
                    else if (item.Title.toLowerCase() == 'e+i' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EI';
                    }
                    else if (item.Title.toLowerCase() == 'education' && item.TaxType == 'Client Category') {
                        item.newTitle = 'Education';
                    }
                    else {
                        item.newTitle = item.Title;
                    }
                    AllMetaData.push(item);

                })
                if (SmartTaxonomy == "Categories") {
                    TaxonomyItems = loadSmartTaxonomyPortfolioPopup(AllMetaData, SmartTaxonomy);
                    setAllCategoryData(TaxonomyItems)
                }
            },
            error: function (error: any) {
                console.log('Error:', error)
            }
        })
    };
    // **************** this is for Smart Category Data fetch from Backend and Call Back functions ******************

    //  ######################  This is Smart Category Get Data Call From Backend and Bulid Nested Array According to Parent Child Categories #######################

    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any, SmartTaxonomy: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item)
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }

    if (AllCategoryData?.length > 0) {
        AllCategoryData?.map((item: any) => {
            if (item.newTitle != undefined) {
                item['Newlabel'] = item.newTitle;
                AutoCompleteItems.push(item)
                if (item.childs != null && item.childs != undefined && item.childs.length > 0) {
                    item.childs.map((childitem: any) => {
                        if (childitem.newTitle != undefined) {
                            childitem['Newlabel'] = item['Newlabel'] + ' > ' + childitem.Title;
                            AutoCompleteItems.push(childitem)
                        }
                        if (childitem.childs.length > 0) {
                            childitem.childs.map((subchilditem: any) => {
                                if (subchilditem.newTitle != undefined) {
                                    subchilditem['Newlabel'] = childitem['Newlabel'] + ' > ' + subchilditem.Title;
                                    AutoCompleteItems.push(subchilditem)
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    AutoCompleteItemsArray = AutoCompleteItems.reduce(function (previous: any, current: any) {
        var alredyExists = previous.filter(function (item: any) {
            return item.Title === current.Title
        }).length > 0
        if (!alredyExists) {
            previous.push(current)
        }
        return previous
    }, [])


    //  ###################  Smart Category Popup Call Back Functions and Validations ##################

    const SelectCategoryCallBack = React.useCallback((selectCategoryDataCallBack: any) => {
        setSelectedCategoryData(selectCategoryDataCallBack, "For-Panel");
    }, [])

    //  ###################  Smart Category slection Common Functions with Validations ##################

    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        setIsComponentPicker(false);
        let TempArray: any = [];
        selectCategoryData.map((existingData: any) => {
            let elementFoundCount: any = 0;
            if (tempShareWebTypeData != undefined && tempShareWebTypeData.length > 0) {
                tempShareWebTypeData.map((currentData: any) => {
                    if (existingData.Title == currentData.Title) {
                        elementFoundCount++;
                    }
                })
            }
            if (elementFoundCount == 0) {
                let category: any;
                if (selectCategoryData != undefined && selectCategoryData.length > 0) {
                    selectCategoryData.map((categoryData: any) => {
                        if (usedFor == "For-Auto-Search") {
                            tempShareWebTypeData.push(categoryData);
                        }
                        TempArray.push(categoryData)
                        let isExists: any = 0;
                        if (tempCategoryData != undefined) {
                            isExists = tempCategoryData.search(categoryData.Title);
                        } else {
                            category = category != undefined ? category + ";" + categoryData.Title : categoryData.Title
                        }
                        if (isExists < 0) {
                            category = tempCategoryData ? tempCategoryData + ";" + categoryData.Title : categoryData.Title;
                        }
                    })
                }
                setCategoriesData(category);
                let phoneCheck = category.search("Phone");
                let emailCheck = category.search("Email");
                let ImmediateCheck = category.search("Immediate");
                let ApprovalCheck = category.search("Approval");
                let OnlyCompletedCheck = category.search("Only Completed");
                if (phoneCheck >= 0) {
                    setPhoneStatus(true)
                } else {
                    setPhoneStatus(false)
                }
                if (emailCheck >= 0) {
                    setEmailStatus(true)
                } else {
                    setEmailStatus(false)
                }
                if (ImmediateCheck >= 0) {
                    setImmediateStatus(true)
                } else {
                    setImmediateStatus(false)
                }
                if (ApprovalCheck >= 0) {
                    setApprovalStatus(true);
                    setApproverData(TaskApproverBackupArray);
                } else {
                    setApprovalStatus(false)
                }
                if (OnlyCompletedCheck >= 0) {
                    setOnlyCompletedStatus(true);
                } else {
                    setOnlyCompletedStatus(false);
                }
            }
        })

        if (usedFor == "For-Panel") {
            setShareWebTypeData(selectCategoryData);
            tempShareWebTypeData = selectCategoryData;
        }
        if (usedFor == "For-Auto-Search") {
            setShareWebTypeData(tempShareWebTypeData);
            setSearchedCategoryData([])
            setCategorySearchKey("");
        }
    }

    const smartCategoryPopup = React.useCallback(() => {
        setIsComponentPicker(false);
    }, [])


    //  ###################  Smart Category Auto Suggesution Functions  ##################

    const autoSuggestionsForCategory = (e: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if (itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            })
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
    }

    // ################ this is for Smart category change and remove function #############

    const removeCategoryItem = (TypeCategory: any, TypeId: any) => {
        let tempString: any;

        let tempArray2: any = [];
        tempShareWebTypeData = [];
        ShareWebTypeData?.map((dataType: any) => {
            if (dataType.Id != TypeId) {
                tempArray2.push(dataType)
                tempShareWebTypeData.push(dataType);
            }
        })
        if (tempArray2 != undefined && tempArray2.length > 0) {
            tempArray2.map((itemData: any) => {
                tempString = tempString != undefined ? tempString + ";" + itemData.Title : itemData.Title
            })
        }
        setCategoriesData(tempString);
        tempCategoryData = tempString;
        setShareWebTypeData(tempArray2);
    }
    const CategoryChange = (e: any, typeValue: any, IdValue: any) => {
        let statusValue: any = e.target.value;
        let type: any = typeValue;
        let Id: any = IdValue;
        CategoryChangeUpdateFunction(statusValue, type, Id)
    }

    const CategoryChangeUpdateFunction = (Status: any, type: any, Id: any) => {
        if (Status == "true") {
            removeCategoryItem(type, Id);
            if (type == "Phone") {
                setPhoneStatus(false)
            }
            if (type == "Email Notification") {
                setEmailStatus(false)
            }
            if (type == "Immediate") {
                setImmediateStatus(false)
            }
            if (type == "Approval") {
                setApprovalStatus(false)
            }
            if (type == "Only Completed") {
                setOnlyCompletedStatus(false)
            }
        } else {
            if (tempCategoryData != undefined) {
                let CheckTaggedCategory = tempCategoryData.includes(type)
                if (CheckTaggedCategory == false) {
                    let CheckTaagedCategory: any = true;
                    let category: any = tempCategoryData + ";" + type;
                    setCategoriesData(category);
                    tempCategoryData = category;
                    if (tempShareWebTypeData != undefined && tempShareWebTypeData.length > 0) {
                        tempShareWebTypeData.map((tempItem: any) => {
                            if (tempItem.Title == type) {
                                CheckTaagedCategory = false;
                            }
                        })
                    }
                    if (AutoCompleteItemsArray != undefined && AutoCompleteItemsArray.length > 0) {
                        AutoCompleteItemsArray.map((dataItem: any) => {
                            if (dataItem.Title == type) {
                                if (CheckTaagedCategory) {
                                    ShareWebTypeData.push(dataItem);
                                    tempShareWebTypeData.push(dataItem);
                                }
                            }
                        })
                    }
                    // setSearchedCategoryData(tempShareWebTypeData);
                    if (type == "Phone") {
                        setPhoneStatus(true)
                    }
                    if (type == "Email Notification") {
                        setEmailStatus(true)
                    }
                    if (type == "Immediate") {
                        setImmediateStatus(true)
                    }
                    if (type == "Approval") {
                        setApprovalStatus(true);
                        setApproverData(TaskApproverBackupArray);
                        StatusArray?.map((item: any) => {
                            if (item.value == 1) {
                                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '1' })
                                setPercentCompleteStatus(item.status);
                                setTaskStatus(item.taskStatusComment);
                            }
                        })
                    }
                    if (type == "Only Completed") {
                        setOnlyCompletedStatus(true)
                    }
                }
            }
        }
    }

    // $$$$$$$$$$$$$$$$$$$$$$$$$ End Smart Category Section Functions $$$$$$$$$$$$$$$$

    //  ******************  This is All Site Details Get Data Call From Backend **************

    const getAllSitesData = async () => {
        let web = new Web(siteUrls);
        let MetaData: any = [];
        let siteConfig: any = [];
        let tempArray: any = [];
        MetaData = await web.lists
            .getById(AllListIdData.SmartMetadataListID)
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
            .top(4999)
            .expand('Author,Editor')
            .get()

        siteConfig = getSmartMetadataItemsByTaxType(MetaData, 'Sites');
        siteConfig?.map((site: any) => {
            if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== "SDC Sites") {
                site.BtnStatus = false;
                tempArray.push(site);
            }
        })
        setSiteTypes(tempArray);
        tempArray?.map((tempData: any) => {
            SiteTypeBackupArray.push(tempData);
        })
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }

    // **************************  This is for Loading All Task Users From Back End Call Functions And validations ****************************
    var count = 0;
    const loadTaskUsers = async () => {
        var AllTaskUsers: any = []
        axios.get(`${siteUrls}/_api/web/lists/getbyid('${AllListIdData?.TaskUsertListID}')/items?$select=Id,UserGroupId,TimeCategory,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver&$orderby=SortOrder asc,Title asc`)
            .then((response: AxiosResponse) => {
                taskUsers = response.data.value;
                getAllEmployeeData();
                $.each(taskUsers, function (index: any, user: any) {
                    var ApproverUserItem = '';
                    var UserApproverMail: any = []
                    if (user.Title != undefined && user.IsShowTeamLeader === true) {
                        if (user.Approver != undefined) {
                            $.each(user.Approver.results, function (ApproverUser: any, index) {
                                ApproverUserItem += ApproverUser.Title + (index === user.Approver.results?.length - 1 ? '' : ',');
                                UserApproverMail.push(ApproverUser.Name.split('|')[2]);
                            })
                            user['UserManagerName'] = ApproverUserItem;
                            user['UserManagerMail'] = UserApproverMail;
                        }
                        AllTaskUsers.push(user);
                    }
                });
                if (AllMetaData != undefined && AllMetaData?.length > 0) {
                    GetSelectedTaskDetails();
                }
            },
                function (data) {
                });
    }


    // **************** this is for Getting current user Data ************* 

    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
        if (currentUserId != undefined) {
            if (taskUsers != null && taskUsers?.length > 0) {
                taskUsers?.map((userData: any) => {
                    if (userData.AssingedToUserId == currentUserId) {
                        let temp: any = [];
                        temp.push(userData)
                        setCurrentUserData(temp);
                        currentUserBackupArray.push(userData);
                        if (userData.UserGroupId == 7) {
                            setIsUserFromHHHHTeam(true);
                        }
                    }
                })
            }
        }
    }

    // ********** this is for Getting All  Employees Data For Approval Function and Approval Popup  *******************

    const getAllEmployeeData = () => {
        let UsersData: any = [];
        let Groups: any = [];
        let MainArray: any = [];
        taskUsers.map((EmpData: any) => {
            if (EmpData.ItemType == "Group") {
                EmpData.Child = [];
                Groups.push(EmpData);
                MainArray.push(EmpData);
            }
            if (EmpData.ItemType == "User") {
                UsersData.push(EmpData);
            }
        })
        if (UsersData.length > 0 && Groups.length > 0) {
            Groups.map((groupData: any) => {
                UsersData.map((userData: any) => {
                    if (groupData.Id == userData.UserGroupId) {
                        userData.NewLabel = groupData.Title + " > " + userData.Title;
                        groupData.Child.push(userData);
                    }
                })
            })
        }
        setAllEmployeeData(Groups);
    }


    // ************************** this is used for getting Site Composition For Selected Portfolio which in Taaged into Task ***********************

    const GetPortfolioSiteComposition = async (ProtfolioId: any) => {
        let DataFromCall: any;
        let web = new Web(siteUrls);
        try {
            DataFromCall = await web.lists
                .getById(AllListIdData?.MasterTaskListID).items.select("Sitestagging,SiteCompositionSettings, Title, Id").top(5000).filter(`Id eq ${ProtfolioId}`).get();
            if (DataFromCall != undefined) {
                let TempSiteCompositionArray: any = [];
                if (DataFromCall[0].Sitestagging != undefined) {
                    let tempSiteComposition: any = JSON.parse(DataFromCall[0].Sitestagging != undefined ? DataFromCall[0].Sitestagging : [{}])
                    if (tempSiteComposition != undefined && tempSiteComposition.length > 0) {
                        tempSiteComposition.map((SiteData: any) => {
                            let TempObject: any = {
                                SiteName: SiteData.Title,
                                ClienTimeDescription: SiteData.ClienTimeDescription,
                                localSiteComposition: true
                            }
                            TempSiteCompositionArray.push(TempObject);
                        })
                        if (TempSiteCompositionArray != undefined && TempSiteCompositionArray.length > 0) {
                            setSitesTaggingData(TempSiteCompositionArray);
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Error :", error)
        }
    }

    // ************************** this is used for getting All Projects Data From Back End ***********************

    const GetMasterData = async () => {
        try {
            let web = new Web(siteUrls);
            let AllProjects: any = [];
            AllProjects = await web.lists.getById(AllListIdData?.MasterTaskListID)
                .items
                .select("Deliverables,TechnicalExplanations,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title")
                .expand("ComponentPortfolio,ServicePortfolio,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent")
                .top(4999)
                .filter("Item_x0020_Type eq 'Project'")
                .getAll();
            AllProjects.map((items: any) => {
                items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                items.AssignedUser = []
                items.TeamMembersSearch = '';
                if (items.AssignedTo != undefined) {
                    items.AssignedTo.map((taskUser: any) => {
                        taskUsers.map((user: any) => {
                            if (user.AssingedToUserId == taskUser.Id) {
                                if (user?.Title != undefined) {
                                    items.TeamMembersSearch = items.TeamMembersSearch + ' ' + user?.Title
                                }
                            }
                        })
                    })
                }
                items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : "";
                items.Checked = false;
            })
            SetAllProjectData(AllProjects);
            AllProjectBackupArray = AllProjects;
            console.log("All Project Data ======", AllProjects);
        } catch (error) {
            console.log("Error:", error.message)
        }
    }



    //    ************************* This is for status section Functions **************************

    const openTaskStatusUpdatePopup = (itemData: any) => {
        setTaskStatusPopup(true);
    }

    //   ###################### This is used for Status Auto Suggesution Function #########################

    const StatusAutoSuggestion = (e: any) => {
        let StatusInput = e.target.value;
        let value = Number(e.target.value)
        if (value <= 100) {
            if (StatusInput.length > 0) {
                if (StatusInput == 0) {
                    setTaskStatus('Not Started');
                    setPercentCompleteStatus('Not Started');
                    setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '0' })
                }
                if (StatusInput < 70 && StatusInput > 10 || StatusInput < 80 && StatusInput > 70) {
                    setTaskStatus("In Progress");
                    setPercentCompleteStatus(`${StatusInput}% In Progress`);
                    setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
                    EditData.IsTodaysTask = false;
                } else {
                    StatusArray.map((percentStatus: any, index: number) => {
                        if (percentStatus.value == StatusInput) {
                            setTaskStatus(percentStatus.taskStatusComment);
                            setPercentCompleteStatus(percentStatus.status);
                            setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
                        }
                    })
                }
                if (StatusInput == 80) {
                    // let tempArray: any = [];
                    if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
                        setWorkingMemberFromTeam(EditData.Team_x0020_Members, "QA", 143);
                    } else {
                        setWorkingMember(143);
                    }
                    EditData.IsTodaysTask = false;
                    EditData.CompletedDate = undefined;
                    StatusArray?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    })
                }
                if (StatusInput == 5) {
                    // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
                    //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
                    // } else if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
                    //     setWorkingMemberFromTeam(EditData.Team_x0020_Members, "Development", 156);

                    // } else {
                    //     setWorkingMember(156);
                    // }
                    EditData.CompletedDate = undefined;
                    EditData.IsTodaysTask = false;
                    StatusArray?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    })
                }
                if (StatusInput == 10) {
                    EditData.CompletedDate = undefined;
                    if (EditData.StartDate == undefined) {
                        EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY")
                    }
                    EditData.IsTodaysTask = true;
                    StatusArray?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    })
                    // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
                    //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
                    // } else {
                    //     setWorkingMember(156);
                    // }
                }
                if (StatusInput == 93 || StatusInput == 96 || StatusInput == 99) {
                    setWorkingMember(9);
                    EditData.IsTodaysTask = false;
                    StatusArray?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    })
                }
                if (StatusInput == 90) {
                    EditData.IsTodaysTask = false;
                    if (EditData.siteType == 'Offshore Tasks') {
                        setWorkingMember(36);
                    } else if (DesignStatus) {
                        setWorkingMember(172);
                    } else {
                        setWorkingMember(42);
                    }
                    EditData.CompletedDate = Moment(new Date()).format("MM-DD-YYYY")
                    StatusArray?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    })
                }
                if (StatusInput == 2) {
                    setInputFieldDisable(true)
                    StatusArray.map((percentStatus: any, index: number) => {
                        if (percentStatus.value == StatusInput) {
                            setTaskStatus(percentStatus.taskStatusComment);
                            setPercentCompleteStatus(percentStatus.status);
                            setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
                        }
                    })
                }
                if (StatusInput != 2) {
                    setInputFieldDisable(false)
                }
                if (StatusInput <= 3 && ApprovalStatusGlobal) {
                    ChangeTaskUserStatus = false;
                } else {
                    ChangeTaskUserStatus = true;
                }
                // if (StatusInput == 1) {
                //     let tempArray: any = [];
                //     if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                //         if (TaskApproverBackupArray?.length > 0) {
                //             TaskApproverBackupArray.map((dataItem: any) => {
                //                 tempArray.push(dataItem);
                //             })
                //         }
                //     } else if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
                //         if (TaskCreatorApproverBackupArray?.length > 0) {
                //             TaskCreatorApproverBackupArray.map((dataItem: any) => {
                //                 tempArray.push(dataItem);
                //             })
                //         }
                //     }
                //     StatusArray?.map((item: any) => {
                //         if (StatusInput == item.value) {
                //             setPercentCompleteStatus(item.status);
                //             setTaskStatus(item.taskStatusComment);
                //         }
                //     })
                //     setTaskAssignedTo(tempArray);
                //     setTaskTeamMembers(tempArray);
                //     setApproverData(tempArray);
                // }
            } else {
                setTaskStatus('');
                setPercentCompleteStatus('');
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '0' })
            }
        } else {
            alert("Status not should be greater than 100");
            setEditData({ ...EditData, Priority_x0020_Rank: 0 })
        }


        // value: 5, status: "05% Acknowledged", taskStatusComment: "Acknowledged"
    }

    //   ######################  This is used for Status Popup Chnage Status #########################
    const PercentCompleted = (StatusData: any) => {
        setTaskStatusPopup(false);
        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusData.value })
        setPercentCompleteStatus(StatusData.status);
        setTaskStatus(StatusData.taskStatusComment);
        setPercentCompleteCheck(false);
        if (StatusData.value == 1) {
            let tempArray: any = [];
            if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                TaskApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            } else if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
                TaskCreatorApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            }
            setTaskAssignedTo(tempArray);
            setTaskTeamMembers(tempArray);
            setApproverData(tempArray);
        }
        if (StatusData.value == 2) {
            setInputFieldDisable(true)
        }
        if (StatusData.value != 2) {
            setInputFieldDisable(false)
        }

        if (StatusData.value == 80) {
            // let tempArray: any = [];
            EditData.IsTodaysTask = false;
            if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
                setWorkingMemberFromTeam(EditData.Team_x0020_Members, "QA", 143);
            } else {
                setWorkingMember(143);
            }
            EditData.IsTodaysTask = false;
            EditData.CompletedDate = undefined;
        }

        if (StatusData.value == 5) {
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.Team_x0020_Members, "Development", 156);

            // } else {
            //     setWorkingMember(156);
            // }
            EditData.CompletedDate = undefined;
            EditData.IsTodaysTask = false;
        }
        if (StatusData.value == 10) {
            EditData.CompletedDate = undefined;
            if (EditData.StartDate == undefined) {
                EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY")
            }
            EditData.IsTodaysTask = true;
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else {
            //     setWorkingMember(156);
            // }
        }
        // if (StatusData.value == 70) {
        // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
        //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
        // } else if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
        //     setWorkingMemberFromTeam(EditData.Team_x0020_Members, "Development", 156);
        // } else {
        //     setWorkingMember(156);
        // }
        // }

        if (StatusData.value == 93 || StatusData.value == 96 || StatusData.value == 99) {
            EditData.IsTodaysTask = false;
            setWorkingMember(9);
            StatusArray?.map((item: any) => {
                if (StatusData.value == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
        if (StatusData.value == 90) {
            EditData.IsTodaysTask = false;
            if (EditData.siteType == 'Offshore Tasks') {
                setWorkingMember(36);
            } else if (DesignStatus) {
                setWorkingMember(172);
            } else {
                setWorkingMember(42);
            }
            EditData.CompletedDate = Moment(new Date()).format("MM-DD-YYYY")
            StatusArray?.map((item: any) => {
                if (StatusData.value == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
    }


    //  ###################### This is Common Function for Chnage The Team Members According to Change Status ######################

    const setWorkingMemberFromTeam = (filterArray: any, filterType: any, StatusID: any) => {
        let tempArray: any = [];
        filterArray.map((TeamItems: any) => {
            taskUsers?.map((TaskUserData: any) => {
                if (TeamItems.Id == TaskUserData.AssingedToUserId) {
                    if (TaskUserData.TimeCategory == filterType) {
                        tempArray.push(TaskUserData)
                        EditData.TaskAssignedUsers = tempArray;
                        let updateUserArray1: any = [];
                        updateUserArray1.push(tempArray[0].AssingedToUser)
                        setTaskAssignedTo(updateUserArray1);
                    }
                    else {
                        if (tempArray?.length == 0) {
                            setWorkingMember(143);
                        }
                    }
                }
            })
        })
    }

    //  ###################### This is Common Function for Chnage The Working Members According to Change Status ######################

    const setWorkingMember = (statusId: any) => {
        taskUsers.map((dataTask: any) => {
            if (dataTask.AssingedToUserId == statusId) {
                let tempArray: any = [];
                tempArray.push(dataTask)
                EditData.TaskAssignedUsers = tempArray;
                let updateUserArray: any = [];
                updateUserArray.push(tempArray[0].AssingedToUser)
                setTaskAssignedTo(updateUserArray);
            }
        })
    }



    const closeTaskStatusUpdatePopup = () => {
        setTaskStatusPopup(false)
        // setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: (EditData.PercentComplete ? EditData.PercentComplete : null) })
        // StatusArray?.map((array: any) => {
        //     if (EditData.PercentComplete == array.value) {
        //         setPercentCompleteStatus(array.status);
        //         setTaskStatus(array.taskStatusComment);
        //     }
        // })
        // setPercentCompleteCheck(false);
    }
    const setModalIsOpenToFalse = () => {
        let callBack = Items.Call
        callBack();
        tempShareWebTypeData = [];
        AllMetaData = []
        taskUsers = []
        CommentBoxData = []
        SubCommentBoxData = []
        updateFeedbackArray = []
        tempShareWebTypeData = []
        tempCategoryData = []
        SiteTypeBackupArray = []
        currentUserBackupArray = []
        AutoCompleteItemsArray = []
        FeedBackBackupArray = []
        TaskCreatorApproverBackupArray = []
        TaskApproverBackupArray = []
        ApproverIds = []
    }

    var smartComponentsIds: any = [];
    var RelevantPortfolioIds: any = [];
    var AssignedToIds: any = [];
    var ResponsibleTeamIds: any = [];
    var TeamMemberIds: any = [];
    var CategoryTypeID: any = [];
    var ClientCategoryIDs: any = [];
    var SmartServicesId: any = [];
    var ApproverIds: any = [];




    // ******************** This is Task All Details Update Function  ***************************

    const UpdateTaskInfoFunction = async (typeFunction: any) => {
        var UploadImageArray: any = []
        if (TaskImages != undefined && TaskImages.length > 0) {
            TaskImages?.map((imgItem: any) => {
                if (imgItem.ImageName != undefined && imgItem.ImageName != null) {
                    if (imgItem.imageDataUrl != undefined && imgItem.imageDataUrl != null) {
                        let tempObject: any = {
                            ImageName: imgItem.ImageName,
                            ImageUrl: imgItem.imageDataUrl,
                            UploadeDate: imgItem.UploadeDate,
                            UserName: imgItem.UserName,
                            UserImage: imgItem.UserImage
                        }
                        UploadImageArray.push(tempObject)
                    } else {
                        UploadImageArray.push(imgItem);
                    }
                }

            })
        }
        let PrecentStatus: any = UpdateTaskInfo.PercentCompleteStatus ? (Number(UpdateTaskInfo.PercentCompleteStatus)) : 0;

        if (PrecentStatus == 1) {
            let tempArrayApprover: any = [];
            if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                if (TaskApproverBackupArray?.length > 0) {
                    TaskApproverBackupArray.map((dataItem: any) => {
                        tempArrayApprover.push(dataItem);
                    })
                }
            } else if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
                if (TaskCreatorApproverBackupArray?.length > 0) {
                    TaskCreatorApproverBackupArray.map((dataItem: any) => {
                        tempArrayApprover.push(dataItem);
                    })
                }
            }
            StatusArray?.map((item: any) => {
                if (PrecentStatus == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
            TaskAssignedTo = tempArrayApprover;
            TaskTeamMembers = tempArrayApprover;
        }

        // images?.map((imgDtl: any) => {
        //     if (imgDtl.dataURL != undefined) {
        //         var imgUrl = siteUrls + '/Lists/' + EditData.siteType + '/Attachments/' + EditData.Id + '/' + imgDtl.file.name;
        //     }
        //     // else {
        //     //     imgUrl = EditData.Item_x002d_Image != undefined ? EditData.Item_x002d_Image.Url : null;
        //     // }
        //     if (imgDtl.file != undefined) {
        //         item['ImageName'] = imgDtl.file.name
        //         item['ImageUrl'] = imgUrl
        //         item['UploadeDate'] = EditData.Created
        //         item['UserImage'] = EditData.Author?.Title
        //         item['UserName'] = EditData.Author?.Title
        //     }
        //     UploadImage.push(item)
        // })

        if (CommentBoxData?.length > 0 || SubCommentBoxData?.length > 0) {
            if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
                let message = JSON.parse(EditData.FeedBack);
                let feedbackArray: any = [];
                if (message != null) {
                    feedbackArray = message[0]?.FeedBackDescriptions
                }
                let tempArray: any = [];
                if (feedbackArray[0] != undefined) {
                    tempArray.push(feedbackArray[0])
                } else {
                    let tempObject: any =
                    {
                        "Title": '<p> </p>',
                        "Completed": false,
                        "isAddComment": false,
                        "isShowComment": false,
                        "isPageType": '',
                    }
                    tempArray.push(tempObject);
                }

                CommentBoxData = tempArray;
                let result: any = [];
                if (SubCommentBoxData == "delete") {
                    result = tempArray
                } else {
                    result = tempArray.concat(SubCommentBoxData);
                }
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }
            if (CommentBoxData?.length > 0 && SubCommentBoxData?.length == 0) {
                let result: any = [];
                if (SubCommentBoxData == "delete") {
                    result = CommentBoxData;
                } else {
                    let message = JSON.parse(EditData.FeedBack);
                    if (message != null) {
                        let feedbackArray = message[0]?.FeedBackDescriptions;
                        feedbackArray?.map((array: any, index: number) => {
                            if (index > 0) {
                                SubCommentBoxData.push(array);
                            }
                        })
                        result = CommentBoxData.concat(SubCommentBoxData);
                    } else {
                        result = CommentBoxData;
                    }
                }
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }
            if (CommentBoxData?.length > 0 && SubCommentBoxData?.length > 0) {
                let result: any = [];
                if (SubCommentBoxData == "delete") {
                    result = CommentBoxData
                } else {
                    result = CommentBoxData.concat(SubCommentBoxData)
                }
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }
        } else {
            updateFeedbackArray = JSON.parse(EditData.FeedBack);
        }
        FeedBackBackupArray = [];
        if (tempShareWebTypeData != undefined && tempShareWebTypeData?.length > 0) {
            tempShareWebTypeData.map((typeData: any) => {
                CategoryTypeID.push(typeData.Id)
            })
        }
        if (smartComponentData != undefined && smartComponentData?.length > 0) {
            smartComponentData?.map((com: any) => {
                if (smartComponentData != undefined && smartComponentData?.length >= 0) {
                    $.each(smartComponentData, function (index: any, smart: any) {
                        smartComponentsIds.push(smart.Id);
                    })
                }
            })
        }
        if (smartServicesData != undefined && smartServicesData?.length > 0) {
            smartServicesData?.map((com: any) => {
                if (smartServicesData != undefined && smartServicesData?.length >= 0) {
                    $.each(smartServicesData, function (index: any, smart: any) {
                        SmartServicesId.push(smart.Id);
                    })
                }
            })
        }
        if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
            linkedComponentData?.map((com: any) => {
                if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
                    $.each(linkedComponentData, function (index: any, smart: any) {
                        RelevantPortfolioIds.push(smart.Id);
                    })
                }
            })
        }

        if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
            TaskAssignedTo?.map((taskInfo) => {
                AssignedToIds.push(taskInfo.Id);
            })
        }

        if (ApproverData != undefined && ApproverData?.length > 0) {
            ApproverData?.map((ApproverInfo) => {
                ApproverIds.push(ApproverInfo.Id);
            })
        }
        // else {
        //     if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
        //         EditData.AssignedTo?.map((taskInfo: any) => {
        //             AssignedToIds.push(taskInfo.Id);
        //         })
        //     }
        // }
        if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
            TaskTeamMembers?.map((taskInfo) => {
                TeamMemberIds.push(taskInfo.Id);
            })
        }

        // (3) Low
        // (2) Normal

        let Priority: any;
        if (EditData.Priority_x0020_Rank) {
            let rank = EditData.Priority_x0020_Rank
            if (rank <= 10 && rank >= 8) {
                Priority = "(1) High"
            }
            if (rank <= 7 && rank >= 4) {
                Priority = "(2) Normal"
            }

            if (rank <= 3 && rank >= 0) {
                Priority = "(3) Low"
            }

        }
        // else {
        //     if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
        //         EditData.Team_x0020_Members?.map((taskInfo: any) => {
        //             TeamMemberIds.push(taskInfo.Id);
        //         })
        //     }
        // }
        if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
            TaskResponsibleTeam?.map((taskInfo) => {
                ResponsibleTeamIds.push(taskInfo.Id);
            })
        }
        if (selectedClientCategory != undefined && selectedClientCategory.length > 0) {
            selectedClientCategory?.map((itemData: any) => {
                ClientCategoryIDs.push(itemData.Id)
            })
        }

        let ClientCategoryData: any = [];

        if (ClientTimeData != undefined && ClientTimeData.length > 0) {
            let SiteIconStatus: any = false
            ClientTimeData?.map((ClientTimeItems: any) => {
                if (ClientTimeItems.siteIcons != undefined) {
                    if (ClientTimeItems.siteIcons?.length > 0 || ClientTimeItems.siteIcons?.Url?.length > 0) {
                        SiteIconStatus = true;
                    }
                }
                if (ClientTimeItems.ClientCategory != undefined || SiteIconStatus) {
                    let newObject: any = {
                        SiteName: ClientTimeItems.SiteName,
                        ClienTimeDescription: ClientTimeItems.ClienTimeDescription,
                        localSiteComposition: true
                    }
                    ClientCategoryData.push(newObject);
                } else {
                    ClientCategoryData.push(ClientTimeItems);
                }
            })
        }

        // else {
        //     if (EditData.Responsible_x0020_Team != undefined && EditData.Responsible_x0020_Team?.length > 0) {
        //         EditData.Responsible_x0020_Team?.map((taskInfo: any) => {
        //             ResponsibleTeamIds.push(taskInfo.Id);
        //         })
        //     }
        // }
        let UpdateDataObject: any = {
            IsTodaysTask: (EditData.IsTodaysTask ? EditData.IsTodaysTask : null),
            workingThisWeek: (EditData.workingThisWeek ? EditData.workingThisWeek : null),
            waitForResponse: (EditData.waitForResponse ? EditData.waitForResponse : null),
            Priority_x0020_Rank: EditData.Priority_x0020_Rank,
            ItemRank: EditData.ItemRank,
            Title: UpdateTaskInfo.Title ? UpdateTaskInfo.Title : EditData.Title,
            Priority: Priority,
            StartDate: EditData.StartDate ? Moment(EditData.StartDate).format("MM-DD-YYYY") : null,
            PercentComplete: UpdateTaskInfo.PercentCompleteStatus ? (Number(UpdateTaskInfo.PercentCompleteStatus) / 100) : (EditData.PercentComplete ? (EditData.PercentComplete / 100) : null),
            ComponentId: { "results": (smartComponentsIds != undefined && smartComponentsIds.length > 0) ? smartComponentsIds : [] },
            Categories: CategoriesData ? CategoriesData : null,
            // RelevantPortfolioId: { "results": (RelevantPortfolioIds != undefined && RelevantPortfolioIds?.length > 0) ? RelevantPortfolioIds : [] },
            SharewebCategoriesId: { "results": (CategoryTypeID != undefined && CategoryTypeID.length > 0) ? CategoryTypeID : [] },
            DueDate: EditData.DueDate ? Moment(EditData.DueDate).format("MM-DD-YYYY") : null,
            CompletedDate: EditData.CompletedDate ? Moment(EditData.CompletedDate).format("MM-DD-YYYY") : null,
            Status: taskStatus ? taskStatus : (EditData.Status ? EditData.Status : null),
            Mileage: (EditData.Mileage ? EditData.Mileage : ''),
            ServicesId: { "results": (SmartServicesId != undefined && SmartServicesId.length > 0) ? SmartServicesId : [] },
            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds.length > 0) ? AssignedToIds : [] },
            Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds.length > 0) ? ResponsibleTeamIds : [] },
            Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds.length > 0) ? TeamMemberIds : [] },
            FeedBack: updateFeedbackArray?.length > 0 ? JSON.stringify(updateFeedbackArray) : null,
            component_x0020_link: {
                "__metadata": { type: "SP.FieldUrlValue" },
                Description: EditData.Relevant_Url ? EditData.Relevant_Url : '',
                Url: EditData.Relevant_Url ? EditData.Relevant_Url : ''
            },
            BasicImageInfo: UploadImageArray != undefined && UploadImageArray.length > 0 ? JSON.stringify(UploadImageArray) : JSON.stringify(UploadImageArray),
            ProjectId: (selectedProject.length > 0 ? selectedProject[0].Id : null),
            ApproverId: { "results": (ApproverIds != undefined && ApproverIds.length > 0) ? ApproverIds : [] },
            ClientTime: JSON.stringify(ClientCategoryData),
            ClientCategoryId: { "results": (ClientCategoryIDs != undefined && ClientCategoryIDs.length > 0) ? ClientCategoryIDs : [] },
            SiteCompositionSettings: (SiteCompositionSetting != undefined && SiteCompositionSetting.length > 0) ? JSON.stringify(SiteCompositionSetting) : EditData.SiteCompositionSettings,
            ApproverHistory: ApproverHistoryData?.length > 0 ? JSON.stringify(ApproverHistoryData) : null,
            EstimatedTime: EditData.EstimatedTime ? EditData.EstimatedTime : null
        }


        try {
            let web = new Web(siteUrls);
            await web.lists.getById(Items.Items.listId).items.getById(Items.Items.Id).update(UpdateDataObject).then(async (res: any) => {
                let web = new Web(siteUrls);
                let smartMetaCall: any;

                if (Items.Items.listId != undefined) {
                    smartMetaCall = await web.lists
                        .getById(Items.Items.listId)
                        .items
                        .select("Id,Title,Priority_x0020_Rank,workingThisWeek,waitForResponse,SiteCompositionSettings,BasicImageInfo,ClientTime,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                        .top(5000)
                        .filter(`Id eq ${Items.Items.Id}`)
                        .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                        .get();
                } else {
                    smartMetaCall = await web.lists
                        .getById(Items.Items.listName)
                        .items
                        .select("Id,Title,Priority_x0020_Rank,workingThisWeek,waitForResponse,SiteCompositionSettings,BasicImageInfo,ClientTime,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                        .top(5000)
                        .filter(`Id eq ${Items.Items.Id}`)
                        .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                        .get();

                }
                if (smartMetaCall != undefined && smartMetaCall.length > 0) {
                    smartMetaCall[0].TaskCreatorData = EditData.TaskCreatorData;
                    smartMetaCall[0].TaskApprovers = EditData.TaskApprovers;
                    smartMetaCall[0].FeedBack = JSON.parse(smartMetaCall[0].FeedBack)
                    smartMetaCall[0].siteType = EditData.siteType;
                }
                setLastUpdateTaskData(smartMetaCall[0]);
                tempShareWebTypeData = [];
                AllMetaData = []
                taskUsers = []
                CommentBoxData = []
                SubCommentBoxData = []
                updateFeedbackArray = []
                tempShareWebTypeData = []
                tempCategoryData = []
                SiteTypeBackupArray = []
                currentUserBackupArray = []
                AutoCompleteItemsArray = []
                FeedBackBackupArray = []
                TaskCreatorApproverBackupArray = []
                TaskApproverBackupArray = []
                ApproverIds = []
                if (Items.sendApproverMail != undefined) {
                    if (Items.sendApproverMail) {
                        setSendEmailComponentStatus(true)
                    } else {
                        setSendEmailComponentStatus(false)
                    }
                }
                if (sendEmailGlobalCount > 0) {
                    if (sendEmailStatus) {
                        setSendEmailComponentStatus(false)
                    } else {
                        setSendEmailComponentStatus(true)
                    }
                }
                if (
                    typeFunction != "TimeSheetPopup" &&
                    Items?.pageName != "TaskDashBoard" &&
                    Items?.pageName != "ProjectProfile"
                ) {
                    Items.Call();
                }

                if (
                    Items?.pageName == "TaskDashBoard" ||
                    Items?.pageName == "ProjectProfile"
                ) {
                    Items.Call(UpdateDataObject);
                }
            })
        } catch (error) {
            console.log("Error:", error.messages)
        }

    }

    // this is for change priority status function 

    const ChangePriorityStatusFunction = (e: any) => {
        let value = e.target.value;
        if (Number(value) <= 10) {
            setEditData({ ...EditData, Priority_x0020_Rank: e.target.value })
        } else {
            alert("Priority Status not should be greater than 10");
            setEditData({ ...EditData, Priority_x0020_Rank: 0 })
        }

    }

    // *************************  This is for workingThisWeek,  IsTodaysTask, and waitForResponse Functions ****************************
    const changeStatus = (e: any, type: any) => {
        if (type == "workingThisWeek") {
            if (e.target.value === 'true') {
                setEditData({ ...EditData, workingThisWeek: false })
            } else {
                setEditData({ ...EditData, workingThisWeek: true })
            }
        }
        if (type == "IsTodaysTask") {
            if (e.target.value === 'true') {
                setEditData({ ...EditData, IsTodaysTask: false })
            } else {
                setEditData({ ...EditData, IsTodaysTask: true })
            }
        }
        if (type == "waitForResponse") {
            if (e.target.value === 'true') {
                setEditData({ ...EditData, waitForResponse: false })
            } else {
                setEditData({ ...EditData, waitForResponse: true })
            }
        }
    }


    //    ************* This is team configuration call Back function **************

    const getTeamConfigData = React.useCallback((teamConfigData: any) => {
        if (ChangeTaskUserStatus) {
            if (teamConfigData?.AssignedTo?.length > 0) {
                let tempArray: any = [];
                teamConfigData.AssignedTo?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        tempArray.push(arrayData.AssingedToUser)
                    } else {
                        tempArray.push(arrayData);
                    }
                })
                setTaskAssignedTo(tempArray);
                EditData.AssignedTo = tempArray;
            } else {
                setTaskAssignedTo([]);
                EditData.AssignedTo = [];
            }
            if (teamConfigData?.TeamMemberUsers?.length > 0) {
                let tempArray: any = [];
                teamConfigData.TeamMemberUsers?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        tempArray.push(arrayData.AssingedToUser)
                    } else {
                        tempArray.push(arrayData);
                    }
                })
                setTaskTeamMembers(tempArray);
                EditData.Team_x0020_Members = tempArray;
            } else {
                setTaskTeamMembers([]);
                EditData.Team_x0020_Members = [];
            }
            if (teamConfigData?.ResponsibleTeam?.length > 0) {
                let tempArray: any = [];
                teamConfigData.ResponsibleTeam?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        tempArray.push(arrayData.AssingedToUser)
                    } else {
                        tempArray.push(arrayData);
                    }
                })
                setTaskResponsibleTeam(tempArray);
                EditData.Responsible_x0020_Team = tempArray;
            } else {
                setTaskResponsibleTeam([]);
                EditData.Responsible_x0020_Team = [];
            }
        }
    }, [])


    // *************** This is footer section share This task function ***************

    const shareThisTaskFunction = (EmailData: any) => {
        var link = "mailTo:"
            + "?cc:"
            + "&subject=" + " [" + Items.Items.siteType + "-Task ] " + EmailData.Title
            + "&body=" + `${siteUrls}/SitePages/Task-Profile-spfx.aspx?taskId=${EmailData.ID}` + "&" + `Site=${Items.Items.siteType}`;
        window.location.href = link;
    }

    // ****************** This is used for Delete Task Functions **********************
    const deleteTaskFunction = async (TaskID: number) => {
        let deletePost = confirm("Do you really want to delete this Task?")
        if (deletePost) {
            deleteItemFunction(TaskID);
        } else {
            console.log("Your Task has not been deleted");
        }
    }
    const deleteItemFunction = async (itemId: any) => {
        try {
            if (Items.Items.listId != undefined) {
                let web = new Web(siteUrls);
                await web.lists.getById(Items.Items.listId).items.getById(itemId).recycle();
            } else {
                let web = new Web(siteUrls);
                await web.lists.getById(Items.Items.listName).items.getById(itemId).recycle();
            }
            Items.Call();
            console.log("Your post has been deleted successfully");
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    // ************* this is for FeedBack Comment Section Functions ************

    const CommentSectionCallBack = React.useCallback((EditorData: any) => {
        CommentBoxData = EditorData
        BuildFeedBackArray();

    }, [])
    const SubCommentSectionCallBack = React.useCallback((feedBackData: any) => {
        SubCommentBoxData = feedBackData;
        console.log("Sub text callback array ====================", feedBackData)
        BuildFeedBackArray();
    }, [])

    const BuildFeedBackArray = () => {
        let PhoneCount = 0;
        let TempFeedBackArray: any = [];
        if (CommentBoxData?.length > 0 && SubCommentBoxData?.length > 0) {
            TempFeedBackArray = CommentBoxData.concat(SubCommentBoxData)
        }
        if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
            let message = JSON.parse(FeedBackBackupArray);
            let feedbackArray: any = [];
            if (message != null) {
                feedbackArray = message[0]
            }
            let tempArray: any = [];
            if (feedbackArray != undefined) {
                tempArray.push(feedbackArray)
            } else {
                let tempObject: any =
                {
                    "Title": '<p> </p>',
                    "Completed": false,
                    "isAddComment": false,
                    "isShowComment": false,
                    "isPageType": '',
                    "isShowLight": ""
                }
                tempArray.push(tempObject);
            }
            CommentBoxData = tempArray;
            TempFeedBackArray = tempArray.concat(SubCommentBoxData);
        }
        if (CommentBoxData?.length > 0 && SubCommentBoxData?.length == 0) {
            let message = JSON.parse(FeedBackBackupArray);
            if (message != null) {
                let feedbackArray = message[0]?.FeedBackDescriptions;
                feedbackArray?.map((array: any, index: number) => {
                    if (index > 0) {
                        SubCommentBoxData.push(array);
                    }
                })
                TempFeedBackArray = CommentBoxData.concat(SubCommentBoxData);
            } else {
                TempFeedBackArray = CommentBoxData;
            }
        }
        let ApprovedStatusCount: any = 0;
        let ApprovedGlobalCount: any = 0;
        let Status: any;
        if (EditDataBackup.PercentComplete != undefined) {
            Status = EditDataBackup.PercentComplete;
        } else {
            Status = 0;
        }
        if (TempFeedBackArray?.length > 0) {
            TempFeedBackArray?.map((item: any) => {
                if (item.isShowLight == "Approve") {
                    ApprovedStatusCount++;
                    ApprovedGlobalCount++;
                    setSendEmailGlobalCount(sendEmailGlobalCount + 1)
                    if (Status <= 3) {
                        setInputFieldDisable(false)
                        setStatusOnChangeSmartLight(3);
                        // setTaskAssignedTo([]);
                        // EditData.TaskAssignedUsers = [];
                        // setTaskTeamMembers([]);
                        // EditData.Team_x0020_Members = [];
                    }
                }
                if (item.Phone) {
                    // CategoryChange("Phone", 199);
                    // CategoryChangeUpdateFunction("false", "Phone", 199)
                }
                if (item.Subtext?.length > 0) {
                    item.Subtext.map((subItem: any) => {
                        if (subItem.isShowLight == "Approve") {
                            ApprovedStatusCount++;
                            ApprovedGlobalCount++;
                            setSendEmailGlobalCount(sendEmailGlobalCount + 1)
                            if (Status <= 3) {
                                setInputFieldDisable(false)
                                setStatusOnChangeSmartLight(3);
                                // setTaskAssignedTo([]);
                                // EditData.TaskAssignedUsers = [];
                                // setTaskTeamMembers([]);
                                // EditData.Team_x0020_Members = [];
                            }
                        }
                        if (item.Phone) {
                            PhoneCount = PhoneCount + 1;
                            // CategoryChangeUpdateFunction("false", "Phone", 199)
                        }
                    })
                }
            })
            TempFeedBackArray?.map((item: any) => {
                if (item.isShowLight == "Reject" || item.isShowLight == "Maybe") {
                    ApprovedGlobalCount++;
                    setSendEmailGlobalCount(sendEmailGlobalCount + 1)
                    if (ApprovedStatusCount == 0) {
                        if (Status >= 2) {
                            setInputFieldDisable(true)
                            setStatusOnChangeSmartLight(2);
                        }
                    }
                }
                if (item.Subtext?.length > 0) {
                    item.Subtext.map((subItem: any) => {
                        if (subItem.isShowLight == "Reject" || subItem.isShowLight == "Maybe") {
                            ApprovedGlobalCount++;
                            setSendEmailGlobalCount(sendEmailGlobalCount + 1)
                            if (ApprovedStatusCount == 0) {
                                if (Status <= 2) {
                                    setInputFieldDisable(true)
                                    setStatusOnChangeSmartLight(2);
                                }
                            }
                        }
                        if (subItem.Phone == true) {
                            PhoneCount = PhoneCount + 1;
                        }
                    })
                }
                if (item.Phone == true) {
                    PhoneCount = PhoneCount + 1;
                }
            })
            if (ApprovedStatusCount == 0) {
                setApprovalTaskStatus(false)
            } else {
                setApprovalTaskStatus(true)
            }
        }
        if (PhoneCount > 0) {
            CategoryChangeUpdateFunction("false", "Phone", 199)
        }
    }

    const setStatusOnChangeSmartLight = (StatusInput: any) => {
        StatusArray.map((percentStatus: any, index: number) => {
            if (percentStatus.value == StatusInput) {
                setTaskStatus(percentStatus.taskStatusComment);
                setPercentCompleteStatus(percentStatus.status);
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
            }
        })
    }



    // ************ this is for Save And Add Time sheet function *************

    const SaveAndAddTimeSheet = () => {
        UpdateTaskInfoFunction("TimeSheetPopup");
        setTimeSheetPopup(true);
        setModalIsOpen(false);
    }
    const closeTimeSheetPopup = () => {
        setTimeSheetPopup(false);
        setModalIsOpenToFalse();
    }

    //***************** This is for Image Upload Section  Functions *****************

    const FlorarImageUploadComponentCallBack = (dt: any) => {
        setUploadBtnStatus(false);
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg"
        }
        let arrayIndex: any = TaskImages?.length
        TaskImages.push(DataObject)
        if (dt.length > 0) {
            onUploadImageFunction(TaskImages, [arrayIndex]);
        }
    }
    const onUploadImageFunction = async (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined) => {
        let lastindexArray = imageList[imageList.length - 1];
        let fileName: any = '';
        let tempArray: any = [];
        let SiteUrl = siteUrls;
        imageList?.map(async (imgItem: any, index: number) => {
            if (imgItem.data_url != undefined && imgItem.file != undefined) {
                let date = new Date()
                let timeStamp = date.getTime();
                let imageIndex = index + 1
                fileName = 'Image' + imageIndex + "-" + EditData.Title + " " + EditData.Title + timeStamp + ".jpg"
                let ImgArray = {
                    ImageName: fileName,
                    UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                    imageDataUrl: SiteUrl + '/Lists/' + Items.Items.siteType + '/Attachments/' + EditData?.Id + '/' + fileName,
                    ImageUrl: imgItem.data_url,
                    UserImage: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Item_x0020_Cover?.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                    UserName: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Title : Items.context.pageContext._user.displayName,
                    // UserImage: 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/Samir%20Gayatri.jpg?updated=194315',
                    // UserName: "Test Dev",
                };
                tempArray.push(ImgArray);
            } else {
                tempArray.push(imgItem);
            }
        })
        tempArray?.map((tempItem: any) => {
            tempItem.Checked = false
        })
        setTaskImages(tempArray);
        // UploadImageFunction(lastindexArray, fileName);
        if (addUpdateIndex != undefined) {
            let updateIndex: any = addUpdateIndex[0]
            let updateImage: any = imageList[updateIndex];
            if (updateIndex + 1 >= imageList.length) {
                UploadImageFunction(lastindexArray, fileName, tempArray);

            }
            else {
                if (updateIndex < imageList.length) {
                    ReplaceImageFunction(updateImage, updateIndex);
                }
            }
        }
    };
    const UploadImageFunction = (Data: any, imageName: any, DataJson: any) => {
        let listId = Items.Items.listId;
        let listName = Items.Items.listName;
        let Id = Items.Items.Id
        var src = Data.data_url?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        setTimeout(() => {
            if (Items.Items.listId != undefined) {
                (async () => {
                    let web = new Web(siteUrls);
                    let item = web.lists.getById(listId).items.getById(Id);
                    item.attachmentFiles.add(imageName, data).then(() => {
                        console.log("Attachment added");
                        UpdateBasicImageInfoJSON(DataJson);
                    });
                    setUploadBtnStatus(false);
                })().catch(console.log)
            } else {
                (async () => {
                    let web = new Web(siteUrls);
                    let item = web.lists.getByTitle(listName).items.getById(Id);
                    item.attachmentFiles.add(imageName, data).then(() => {
                        console.log("Attachment added");
                        UpdateBasicImageInfoJSON(DataJson);
                    });
                    setUploadBtnStatus(false);
                })().catch(console.log)
            }
        }, 2500);
    }


    const UpdateBasicImageInfoJSON = async (JsonData: any) => {
        var UploadImageArray: any = []
        if (JsonData != undefined && JsonData.length > 0) {
            JsonData?.map((imgItem: any) => {
                if (imgItem.ImageName != undefined && imgItem.ImageName != null) {
                    if (imgItem.imageDataUrl != undefined && imgItem.imageDataUrl != null) {
                        let tempObject: any = {
                            ImageName: imgItem.ImageName,
                            ImageUrl: imgItem.imageDataUrl,
                            UploadeDate: imgItem.UploadeDate,
                            UserName: imgItem.UserName,
                            UserImage: imgItem.UserImage
                        }
                        UploadImageArray.push(tempObject)
                    } else {
                        UploadImageArray.push(imgItem);
                    }
                }
            })
        }
        if (UploadImageArray != undefined && UploadImageArray.length > 0) {
            try {
                let web = new Web(siteUrls);
                await web.lists.getById(Items.Items.listId).items.getById(Items.Items.Id).update({ BasicImageInfo: JSON.stringify(UploadImageArray) }).then((res: any) => { console.log("Image JSON Updated !!") })
            } catch (error) {
                console.log("Error Message :", error);
            }
        }
    }
    const RemoveImageFunction = (imageIndex: number, imageName: any, FunctionType: any) => {
        let tempArray: any = [];
        if (FunctionType == "Remove") {
            TaskImages?.map((imageData: any, index: number) => {
                if (index != imageIndex) {
                    tempArray.push(imageData)
                }
            })
            setTaskImages(tempArray);
        }
        if (Items.Items.listId != undefined) {
            (async () => {
                let web = new Web(siteUrls);
                let item = web.lists.getById(Items.Items.listId).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(imageName).recycle();
                UpdateBasicImageInfoJSON(tempArray);
                console.log("Attachment deleted");

            })().catch(console.log)
        } else {
            (async () => {
                let web = new Web(siteUrls);
                let item = web.lists.getByTitle(Items.Items.listName).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(imageName).recycle();
                UpdateBasicImageInfoJSON(tempArray);
                console.log("Attachment deleted");

            })().catch(console.log)
        }
    }
    const ReplaceImageFunction = (Data: any, ImageIndex: any) => {
        let ImageName = EditData.UploadedImage[ImageIndex].ImageName
        var src = Data?.data_url?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        if (siteUrls != undefined) {
            (async () => {
                let web = new Web(siteUrls);
                let item = web.lists.getById(Items.Items.listId).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(ImageName).setContent(data);
                console.log("Attachment Updated");
            })().catch(console.log)
        } else {
            (async () => {
                let web = new Web(siteUrls);
                let item = web.lists.getById(Items.Items.listName).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(ImageName).setContent(data);
                console.log("Attachment Updated");
            })().catch(console.log)
        }
        setTaskImages(EditData.UploadedImage);
    }

    const MouseHoverImageFunction = (e: any, HoverImageData: any) => {
        e.preventDefault();
        setHoverImageModal("Block");
        // let tempArray:any =[];
        // tempArray.push(HoverImageData)
        setHoverImageData([HoverImageData]);
    }
    const MouseOutImageFunction = (e: any) => {
        e.preventDefault();
        setHoverImageModal("None");
    }

    const ImageCompareFunction = (imageData: any, index: any) => {
        TaskImages[index].Checked = true;
        // // if(TaskImages[index].Checked){
        // //     TaskImages[index].Checked = false;
        // // }else{
        // //     TaskImages[index].Checked = true;
        // // }

        // if(compareImageArray.length >= 1){
        //     if(compareImageArray[0].Title != imageData.Title){
        //         compareImageArray.push(imageData)
        //     }
        // }else{
        //     compareImageArray.push(imageData);
        // }
        compareImageArray.push(imageData)
        if (compareImageArray.length == 2) {
            setImageComparePopup(true);
        }
    }
    const ImageCompareFunctionClosePopup = () => {
        setImageComparePopup(false);
        setCompareImageArray([]);
        let tempArray: any = [];
        TaskImages?.map((dataItem: any) => {
            dataItem.Checked = false
            tempArray.push(dataItem);
        })
        setTaskImages(tempArray);

    }
    const ImageCustomizeFunction = (currentImagIndex: any) => {
        setImageCustomizePopup(true)
    }
    const ImageCustomizeFunctionClosePopup = () => {
        setImageCustomizePopup(false)
    }

    const CommonClosePopupFunction = () => {
        ImageCompareFunctionClosePopup();
        ImageCustomizeFunctionClosePopup();
    }

    const openReplaceImagePopup = (index: any) => {
        setReplaceImagePopup(true);
        ReplaceImageIndex = index;
    }


    const FlorarImageReplaceComponentCallBack = (dt: any) => {
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg"
        }
        ReplaceImageData = DataObject;
        console.log("Replace Image Data ======", DataObject)
        // let arrayIndex: any = TaskImages?.length
        // TaskImages.push(DataObject)
        // if (dt.length > 0) {
        //     onUploadImageFunction(TaskImages, [arrayIndex]);
        // }
    }
    const UpdateImage = () => {
        if (ReplaceImageData != undefined && ReplaceImageIndex != undefined) {
            ReplaceImageFunction(ReplaceImageData, ReplaceImageIndex);
            const copy = [...TaskImages];
            const ImageUrl = TaskImages[ReplaceImageIndex].ImageUrl;
            const obj = { ...TaskImages[ReplaceImageIndex], ImageUrl: ReplaceImageData.data_url, imageDataUrl: ImageUrl };
            copy[ReplaceImageIndex] = obj;
            setTaskImages(copy);
            setReplaceImagePopup(false);
        }
    }
    const closeReplaceImagePopup = () => {
        setReplaceImagePopup(false)
    }

    // ***************** this is for the Copy and Move Task Functions ***************

    const CopyAndMovePopupFunction = () => {
        setCopyAndMoveTaskPopup(true)
    }

    const closeCopyAndMovePopup = () => {
        setCopyAndMoveTaskPopup(false)
    }

    const selectSiteTypeFunction = (siteData: any) => {
        let tempArray: any = [];
        SiteTypeBackupArray?.map((siteItem: any) => {
            if (siteItem.Id == siteData.Id) {
                siteItem.BtnStatus = true;
                tempArray.push(siteItem);
            } else {
                siteItem.BtnStatus = false;
                tempArray.push(siteItem);
            }
        })
        setSiteTypes(tempArray);
    }

    const copyAndMoveTaskFunction = (FunctionsType: string) => {
        if (FunctionsType == "Move Task") {

        }
        if (FunctionsType == "Move Task") {

        }
    }




    // ************** this is for Project Management Section Functions ************
    const closeProjectManagementPopup = () => {
        let TempArray: any = [];
        setProjectManagementPopup(false);
        AllProjectBackupArray.map((ProjectData: any) => {
            ProjectData.Checked = false;
            TempArray.push(ProjectData);
        })
        SetAllProjectData(TempArray);
    }
    const SelectProjectFunction = (selectedData: any) => {
        let TempArray: any = [];
        AllProjectBackupArray.map((ProjectData: any) => {
            if (ProjectData.Id == selectedData.Id) {
                ProjectData.Checked = true;
                TempArray.push(ProjectData);
                // setSelectedProject([ProjectData])
            } else {
                ProjectData.Checked = false;
                TempArray.push(ProjectData);
            }
        })
        SetAllProjectData(TempArray);
    }

    const saveSelectedProject = () => {
        if (AllProjectData != undefined && AllProjectData.length > 0) {
            AllProjectData.map((dataItem: any) => {
                if (dataItem.Checked) {
                    setSelectedProject([dataItem]);
                }
            })
        }
        // setSelectedProject([tempSelectedProjectData]);
        setProjectManagementPopup(false);
    }


    const autoSuggestionsForProject = (e: any) => {
        let searchedKey: any = e.target.value;
        setProjectSearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AllProjectData?.map((itemData: any) => {
                if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            })
            setSearchedProjectData(tempArray);
        } else {
            setSearchedProjectData([]);
        }

    }

    const SelectProjectFromAutoSuggestion = (data: any) => {
        setProjectSearchKey('');
        setSearchedProjectData([]);
        setSelectedProject(data);
    }

    const columns = React.useMemo(
        () => [
            {
                internalHeader: '',
                id: 'Id', // 'id' is required
                isSorted: false,
                showSortIcon: false,
                Cell: ({ row }: any) => (
                    <span>
                        <input type='checkbox' checked={row.original.Checked} onClick={() => SelectProjectFunction(row.original)} />
                    </span>
                ),
            },
            {
                internalHeader: 'Title',
                accessor: 'Title',
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <a style={{ textDecoration: "none", color: "#000066" }} href={`${siteUrls}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.values?.Title}</a>
                    </span>
                )
            },
            {
                internalHeader: 'Status',
                accessor: 'PercentComplete',
                showSortIcon: true,
            },
            {
                internalHeader: 'Priority',
                accessor: 'Priority_x0020_Rank',
                showSortIcon: true,
            },
            {
                internalHeader: 'Team Members',
                accessor: 'TeamMembersSearch',
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <ShowTaskTeamMembers props={row?.original} TaskUsers={taskUsers}></ShowTaskTeamMembers>
                    </span>
                )
            },
            {
                internalHeader: 'Due Date',
                showSortIcon: true,
                accessor: 'DisplayDueDate',
            },

        ],
        [AllProjectData]
    );

    const data = AllProjectData;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        visibleColumns,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    }: any = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 10000 }
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (column.showSortIcon ? <FaSort /> : '');
    };

    const onChangeInSelect = (event: any) => {
        setPageSize(Number(event.target.value));
    };

    // ************ this is for Approver Popup Function And Approver Related All Functions section ************** 
    const OpenApproverPopupFunction = () => {
        setApproverPopupStatus(true);
    }
    const closeApproverPopup = () => {
        setApproverPopupStatus(false);
        if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
            setApproverData(TaskApproverBackupArray);
        } else if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
            setApproverData(TaskCreatorApproverBackupArray);
        }
    }

    const UpdateApproverFunction = () => {
        setApproverPopupStatus(false);
        setTaskAssignedTo(ApproverData);
        setTaskTeamMembers(ApproverData);
        StatusArray?.map((item: any) => {
            if (item.value == 1) {
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '1' })
                setPercentCompleteStatus(item.status);
                setTaskStatus(item.taskStatusComment);
            }
        })
    }

    const selectApproverFunction = (selectedData: any) => {
        selectedData.Id = selectedData.AssingedToUserId;
        setApproverData([selectedData]);
    }
    // const removeApproverFunction = (Title: any, Id: any) => {
    //     let tempArray: any = [];
    //     if (ApproverBackupArray != null && ApproverBackupArray.length > 0) {
    //         ApproverBackupArray?.map((item: any) => {
    //             if (item.Id == Id) {
    //                 tempArray.push(item);
    //             }
    //         })
    //     }
    //     setApproverData(tempArray);
    // }


    const autoSuggestionsForApprover = (e: any, type: any) => {
        let searchedKey: any = e.target.value;
        setApproverSearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AllEmployeeData?.map((itemData: any) => {
                if (itemData.Child != undefined && itemData.Child.length > 0) {
                    itemData.Child.map((childData: any) => {
                        if (childData.NewLabel.toLowerCase().includes(searchedKey.toLowerCase())) {
                            tempArray.push(childData);
                        }
                    })
                }
            })
            if (type == "OnTaskPopup") {
                setApproverSearchedData(tempArray);
            } else {
                setApproverSearchedDataForPopup(tempArray)
            }

        } else {
            setApproverSearchedData([]);
            setApproverSearchedDataForPopup([]);
        }
    }

    const SelectApproverFromAutoSuggestion = (ApproverData: any) => {
        selectApproverFunction(ApproverData);
        setApproverSearchedData([]);
        setApproverSearchedDataForPopup([]);
        setApproverSearchKey('');
        setTaskAssignedTo([ApproverData]);
        setTaskTeamMembers([ApproverData]);
        TaskApproverBackupArray = [ApproverData];
        StatusArray?.map((item: any) => {
            if (item.value == 1) {
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '1' })
                setPercentCompleteStatus(item.status);
                setTaskStatus(item.taskStatusComment);
            }
        })
        let ApproverHistoryObject: any = {
            ApproverName: ApproverData.Title,
            ApprovedDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            ApproverId: ApproverData.AssingedToUserId,
            ApproverImage: (ApproverData.Item_x0020_Cover != undefined || ApproverData.Item_x0020_Cover != null ? ApproverData.Item_x0020_Cover.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'),
            ApproverSuffix: ApproverData.Suffix,
            ApproverEmail: ApproverData.Email
        }
        ApproverHistoryData.push(ApproverHistoryObject);
    }

    // *********** this is for Send Email Notification for Approval Category Task Functions ****************************

    const SendEmailNotificationCallBack = React.useCallback(() => {
        setSendEmailComponentStatus(false);
    }, [])
    // ************************ this is for Site Composition Component Section Functions ***************************

    const SmartTotalTimeCallBack = React.useCallback((TotalTime: any) => {
        let Time: any = TotalTime;
        setSmartTotalTimeData(Time)
    }, [])

    const SiteCompositionCallBack = React.useCallback((Data: any) => {
        if (Data.ClientTime != undefined && Data.ClientTime.length > 0) {
            let tempArray: any = [];
            Data.ClientTime?.map((ClientTimeItems: any) => {
                if (ClientTimeItems.ClientCategory != undefined || ClientTimeItems.siteIcons?.length > 0 || ClientTimeItems.siteIcons?.Url.length > 0) {
                    let newObject: any = {
                        SiteName: ClientTimeItems.SiteName,
                        ClienTimeDescription: ClientTimeItems.ClienTimeDescription,
                        localSiteComposition: true
                    }
                    tempArray.push(newObject);
                } else {
                    tempArray.push(ClientTimeItems);
                }
            })
            setClientTimeData(tempArray);
        }
        if (Data.selectedClientCategory != undefined && Data.selectedClientCategory.length > 0) {
            setSelectedClientCategory(Data.selectedClientCategory);
        } else {
            setSelectedClientCategory([]);
        }
        if (Data.SiteCompositionSettings != undefined && Data.SiteCompositionSettings.length > 0) {
            setSiteCompositionSetting(Data.SiteCompositionSettings);
        }
        console.log("Site Composition final Call back Data =========", Data);
    }, [])



    // This is for the Background Comment section Functions 


    // ************** this is custom header and custom Footers section functions for panel *************

    const onRenderCustomHeaderMain = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <img className="imgWid29 pe-1 mb-1 " src={Items.Items.SiteIcon} />
                    <span className="siteColor">
                        {`${EditData.TaskId != undefined || EditData.TaskId != null ? EditData.TaskId : ""} ${EditData.Title != undefined || EditData.Title != null ? EditData.Title : ""}`}
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        );
    };

    const onRenderCustomHeaderCopyAndMoveTaskPanel = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <img className="imgWid29 pe-1 mb-1 " src={Items.Items.SiteIcon} />
                    <span className="siteColor">
                        Select Site
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        );
    };


    const onRenderCustomReplaceImageHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        Replace Image
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        )
    }
    const onRenderCustomProjectManagementHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        Select Project
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        )
    }
    const onRenderCustomApproverHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        Select Approver
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        )
    }

    const onRenderCustomFooterMain = () => {
        return (
            <footer className={ServicesTaskCheck ? "serviepannelgreena bg-f4 fixed-bottom" : "bg-f4 fixed-bottom"}>
                <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">
                    <div>
                        <div className="">
                            Created <span className="font-weight-normal siteColor">  {EditData.Created ? Moment(EditData.Created).format("DD/MM/YYYY") : ""}  </span> By <span className="font-weight-normal siteColor">
                                {EditData.Author?.Title ? EditData.Author?.Title : ''}
                            </span>
                        </div>
                        <div>
                            Last modified <span className="font-weight-normal siteColor"> {EditData.Modified ? Moment(EditData.Modified).format("DD/MM/YYYY") : ''}
                            </span> By <span className="font-weight-normal siteColor">
                                {EditData.Editor?.Title ? EditData.Editor.Title : ''}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" style={{ marginLeft: "-5px" }} fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                </svg>
                                {/* <RiDeleteBin6Line /> */}
                                <span onClick={() => deleteTaskFunction(EditData.ID)}>Delete This Item</span>
                            </a>
                            <span> | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}>
                                Copy
                                Task
                            </a>
                            <span > | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}> Move Task</a> |
                            <span>
                                {EditData.ID ?
                                    <VersionHistory taskId={EditData.Id} listId={Items.Items.listId} siteUrls={siteUrls} /> : null}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>
                                <a className="mx-2" target="_blank" data-interception="off"
                                    href={`${siteUrls}/SitePages/Task-Profile.aspx?taskId=${EditData.ID}&Site=${Items.Items.siteType}`}>
                                    Go To Profile Page
                                </a>
                            </span> ||
                            <span>
                                <a className="mx-2 hreflink" onClick={SaveAndAddTimeSheet} >
                                    Save & Add Time-Sheet
                                </a>
                            </span> ||

                            <span className="hreflink siteColor" onClick={() => shareThisTaskFunction(EditData)} >
                                <img className="mail-width mx-2"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png" />
                                Share This Task
                            </span> ||
                            <a target="_blank" className="mx-2" data-interception="off"
                                href={`${siteUrls}/Lists/${Items.Items.siteType}/EditForm.aspx?ID=${EditData.ID}`}>
                                Open Out-Of-The-Box Form
                            </a>
                            <span >
                                <button className="btn btn-primary px-3"
                                    onClick={UpdateTaskInfoFunction}>
                                    Save
                                </button>
                                <button type="button" className="btn btn-default ms-1 px-3" onClick={setModalIsOpenToFalse}>
                                    Cancel
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
    const onRenderCustomFooterOther = () => {
        return (
            <footer className={ServicesTaskCheck ? "serviepannelgreena bg-f4 fixed-bottom" : "bg-f4 fixed-bottom"}>
                <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">
                    <div>
                        <div className="">
                            Created <span className="font-weight-normal siteColor">  {EditData.Created ? Moment(EditData.Created).format("DD/MM/YYYY") : ""}  </span> By <span className="font-weight-normal siteColor">
                                {EditData.Author?.Title ? EditData.Author?.Title : ''}
                            </span>
                        </div>
                        <div>
                            Last modified <span className="font-weight-normal siteColor"> {EditData.Modified ? Moment(EditData.Modified).format("DD/MM/YYYY") : ''}
                            </span> By <span className="font-weight-normal siteColor">
                                {EditData.Editor?.Title ? EditData.Editor.Title : ''}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" style={{ marginLeft: "-5px" }} fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                </svg>
                                {/* <RiDeleteBin6Line /> */}
                                <span onClick={() => deleteTaskFunction(EditData.ID)}>Delete This Item</span>
                            </a>
                            <span> | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}>
                                Copy
                                Task
                            </a>
                            <span > | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}> Move Task</a> |
                            <span>
                                {EditData.ID ?
                                    <VersionHistory taskId={EditData.Id} listId={Items.Items.listId} siteUrls={siteUrls} /> : null}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>
                                <a className="mx-2" target="_blank" data-interception="off"
                                    href={`${Items.Items.siteType}/SitePages/Task-Profile.aspx?taskId=${EditData.ID}&Site=${Items.Items.siteType}`}>
                                    Go To Profile Page
                                </a>
                            </span> ||
                            <span>
                                <a className="mx-2 hreflink" onClick={SaveAndAddTimeSheet} >
                                    Save & Add Time-Sheet
                                </a>
                            </span> ||

                            <span className="hreflink siteColor" onClick={() => shareThisTaskFunction(EditData)} >
                                <img className="mail-width mx-2"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png" />
                                Share This Task
                            </span> ||
                            <a target="_blank" className="mx-2" data-interception="off"
                                href={`${Items.Items.siteType}/Lists/${Items.Items.siteType}/EditForm.aspx?ID=${EditData.ID}`}>
                                Open Out-Of-The-Box Form
                            </a>
                            <span >
                                <button type="button" className="btn btn-default ms-1 px-3" onClick={CommonClosePopupFunction}>
                                    Cancel
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

    const customFooterForProjectManagement = () => {
        return (
            <footer className={ServicesTaskCheck ? "serviepannelgreena text-end me-4" : "text-end me-4"}>
                <button type="button" className="btn btn-primary">
                    <a target="_blank" className="text-light" data-interception="off"
                        href={`${siteUrls}/SitePages/Project-Management-Overview.aspx`}>
                        <span className="text-light">Create New One</span>
                    </a>
                </button>
                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveSelectedProject} >
                    Save
                </button>
                <button type="button" className="btn btn-default px-3" onClick={closeProjectManagementPopup}>
                    Cancel
                </button>
            </footer>
        )
    }

    return (
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
            {/* ***************** this is status panel *********** */}
            <Panel
                headerText={`Update Task Status`}
                isOpen={TaskStatusPopup}
                onDismiss={closeTaskStatusUpdatePopup}
                isBlocking={TaskStatusPopup}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="modal-body">
                        <table className="table table-hover" style={{ marginBottom: "0rem !important" }}>
                            <tbody>
                                {StatusArray?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="form-check l-radio">
                                                    <input className="form-check-input"
                                                        type="radio" checked={(PercentCompleteCheck ? EditData.PercentComplete : UpdateTaskInfo.PercentCompleteStatus) == item.value}
                                                        onClick={() => PercentCompleted(item)} />
                                                    <label className="form-check-label mx-2">{item.status}</label>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => setTaskStatusPopup(false)}>
                            OK
                        </button>
                    </footer> */}
                </div>
            </Panel>
            {/* ***************** this is Save And Time Sheet panel *********** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                isOpen={TimeSheetPopup}
                type={PanelType.custom}
                customWidth="850px"
                onDismiss={closeTimeSheetPopup}
                isBlocking={false}
            >
                <div className={ServicesTaskCheck ? "modal-body serviepannelgreena" : "modal-body"}>
                    <TimeEntryPopup props={Items.Items} />
                </div>
            </Panel>
            {/* ***************** this is Main Panel *********** */}
            <Panel
                type={PanelType.large}
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >

                    <div className="modal-body mb-5">
                        <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                            <button
                                className="nav-link active"
                                id="BASIC-INFORMATION"
                                data-bs-toggle="tab"
                                data-bs-target="#BASICINFORMATION"
                                type="button"
                                role="tab"
                                aria-controls="BASICINFORMATION"
                                aria-selected="true"
                            >
                                BASIC INFORMATION
                            </button>
                            <button
                                className="nav-link"
                                id="NEW-TIME-SHEET"
                                data-bs-toggle="tab"
                                data-bs-target="#NEWTIMESHEET"
                                type="button"
                                role="tab"
                                aria-controls="NEWTIMESHEET"
                                aria-selected="false"
                            >
                                TEAM & TIMESHEET
                            </button>
                            {IsUserFromHHHHTeam ? null : <button
                                className="nav-link"
                                id="BACKGROUND-COMMENT"
                                data-bs-toggle="tab"
                                data-bs-target="#BACKGROUNDCOMMENT"
                                type="button"
                                role="tab"
                                aria-controls="BACKGROUNDCOMMENT"
                                aria-selected="false"
                            >
                                BACKGROUND
                            </button>}

                        </ul>
                        <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                            <div className="tab-pane  show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="col-12 ">
                                            <div className="input-group">
                                                <div className="d-flex justify-content-between align-items-center mb-0  full-width">Title
                                                    <span className="d-flex">
                                                        <span className="form-check mx-2">
                                                            <input className="form-check-input rounded-0" type="checkbox"
                                                                checked={EditData.workingThisWeek}
                                                                value={EditData.workingThisWeek}
                                                                onChange={(e) => changeStatus(e, "workingThisWeek")} />
                                                            <label className="form-check-label">Working This Week?</label>
                                                        </span>

                                                        <span className="form-check">
                                                            <input className="form-check-input rounded-0" type="checkbox"
                                                                checked={EditData.IsTodaysTask}
                                                                value={EditData.IsTodaysTask}
                                                                onChange={(e) => changeStatus(e, "IsTodaysTask")} />
                                                            <label className="form-check-label">Working Today?</label>
                                                        </span>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="Task Name"
                                                    defaultValue={EditData.Title} onChange={(e) => setUpdateTaskInfo({ ...UpdateTaskInfo, Title: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="mx-0 row  ">
                                            <div className="col-6 ps-0 mt-2">
                                                <div className="input-group ">
                                                    {/* <CDatePicker date={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : ''}/> */}
                                                    {/* <DatePicker value={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : null} onChange={(date) => setEditData({
                                                        ...EditData, StartDate: date
                                                    })} /> */}
                                                    <label className="form-label full-width" >Start Date</label>
                                                    <input type="date" className="form-control" max="9999-12-31" min={EditData.Created ? Moment(EditData.Created).format("YYYY-MM-DD") : ""}
                                                        defaultValue={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : ''}
                                                        onChange={(e) => setEditData({
                                                            ...EditData, StartDate: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 mt-2">
                                                <div className="input-group ">
                                                    <div className="form-label full-width">Due Date<span title="Re-occurring Due Date">
                                                        <input type="checkbox" className="form-check-input rounded-0 ms-2"
                                                        />
                                                    </span></div>

                                                    <input type="date" className="form-control" placeholder="Enter Due Date" max="9999-12-31" min={EditData.Created ? Moment(EditData.Created).format("YYYY-MM-DD") : ""}
                                                        defaultValue={EditData.DueDate ? Moment(EditData.DueDate).format("YYYY-MM-DD") : ''}
                                                        onChange={(e) => setEditData({
                                                            ...EditData, DueDate: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 mt-2">
                                                <div className="input-group ">
                                                    <label className="form-label full-width" > Completed Date </label>
                                                    <input type="date" className="form-control" max="9999-12-31" min={EditData.Created ? Moment(EditData.Created).format("YYYY-MM-DD") : ""}
                                                        defaultValue={EditData.CompletedDate ? Moment(EditData.CompletedDate).format("YYYY-MM-DD") : ''}
                                                        onChange={(e) => setEditData({
                                                            ...EditData, CompletedDate: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 mt-2">
                                                <div className="input-group">
                                                    <label className="form-label full-width">Item Rank</label>
                                                    <select className="form-select" defaultValue={EditData.ItemRank} onChange={(e) => setEditData({ ...EditData, ItemRank: e.target.value })}>
                                                        {ItemRankArray.map(function (h: any, i: any) {
                                                            return (
                                                                <option key={i} selected={EditData.ItemRank == h.rank} value={h.rank} >{h.rankTitle}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mx-0 row mt-2">
                                            <div className="col ps-0">
                                                <div className="input-group mb-2">
                                                    <label className="full-width">
                                                        <span className="form-check form-check-inline mb-0 l-radio">
                                                            <input type="radio" id="Components"
                                                                name="Portfolios" checked={ComponentTaskCheck}
                                                                onClick={(e) => ChangeComponentStatus(e, "Component")}
                                                                title="Component"

                                                                className="form-check-input" />
                                                            <label className="form-check-label mb-0">Component</label>
                                                        </span>
                                                        <span className="form-check form-check-inline mb-0 l-radio">
                                                            <input type="radio" id="Services"
                                                                name="Portfolios" value="Services"
                                                                title="Services"
                                                                checked={ServicesTaskCheck}
                                                                onClick={(e) => ChangeComponentStatus(e, "Service")}
                                                                className="form-check-input" />
                                                            <label className="form-check-label mb-0">Services</label>
                                                        </span>
                                                    </label>
                                                    {smartComponentData?.length > 0 && ComponentTaskCheck || smartServicesData?.length > 0 && ServicesTaskCheck ? null :
                                                        <>
                                                            <input type="text"
                                                                className="form-control"
                                                                value={SearchedServiceCompnentKey}
                                                                onChange={(e) => autoSuggestionsForServiceAndComponent(e)}
                                                                placeholder="Select Componets / Service And Search Here"
                                                            />
                                                        </>
                                                    }
                                                    {smartComponentData.length > 0 && ComponentTaskCheck ? smartComponentData?.map((com: any) => {
                                                        return (
                                                            <>
                                                                <div className="d-flex justify-content-between block px-2 py-1" style={{ width: "88%" }}>
                                                                    <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                    <a>
                                                                        <span onClick={() => setSmartComponentData([])} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                        {/* <svg onClick={() => setSmartComponentData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg> */}
                                                                    </a>
                                                                </div>
                                                            </>
                                                        )
                                                    }) : null}
                                                    {
                                                        smartServicesData?.length > 0 && ServicesTaskCheck ? smartServicesData?.map((com: any) => {
                                                            return (
                                                                <>
                                                                    <div className="d-flex justify-content-between block px-2 py-1" style={{ width: "88%" }}>
                                                                        <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                        <a>
                                                                            <span onClick={() => setSmartServicesData([])} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                            {/* <svg onClick={() => setSmartServicesData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg> */}
                                                                        </a>
                                                                    </div>
                                                                </>
                                                            )
                                                        }) : null
                                                    }

                                                    <span className="input-group-text">
                                                        {ComponentTaskCheck ?
                                                            <span title="Component Popup" onClick={() => EditComponent(EditData, 'Component')} className="svg__iconbox svg__icon--editBox"></span>
                                                            // <svg onClick={() => EditComponent(EditData, 'Component')} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                            : null}

                                                        {ServicesTaskCheck ?
                                                            <span title="Service Popup" onClick={(e) => EditLinkedServices(EditData, 'Services')} className="svg__iconbox svg__icon--editBox"></span>
                                                            // <svg onClick={(e) => EditLinkedServices(EditData, 'Services')} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> 
                                                            : null}
                                                        {ComponentTaskCheck == false && ServicesTaskCheck == false ?
                                                            <span title="Component/Service Popup" onClick={(e) => alert("Please select anyone from Portfolio/Services")}
                                                                className="svg__iconbox svg__icon--editBox"></span>
                                                            // <svg onClick={(e) => alert("Please select anyone from Portfolio/Services")} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                            : null}

                                                    </span>
                                                </div>
                                                {SearchedServiceCompnentData?.length > 0 ? (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="list-group">
                                                            {SearchedServiceCompnentData.map((Item: any) => {
                                                                return (
                                                                    <li className="hreflink list-group-item rounded-0 list-group-item-action" key={Item.id} onClick={() => setSelectedServiceAndCompnentData(Item)} >
                                                                        <a>{Item.NewLeble}</a>
                                                                    </li>
                                                                )
                                                            }
                                                            )}
                                                        </ul>
                                                    </div>) : null}
                                                <div className="input-group mb-2">
                                                    <label className="form-label full-width">
                                                        Categories
                                                    </label>
                                                    <input type="text" className="form-control"
                                                        id="txtCategories" placeholder="Search Category Here" value={categorySearchKey} onChange={(e) => autoSuggestionsForCategory(e)} />
                                                    <span className="input-group-text" title="Smart Category Popup" onClick={(e) => EditComponentPicker(EditData, 'Categories')}>
                                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> */}
                                                    </span>
                                                </div>
                                                {SearchedCategoryData?.length > 0 ? (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="list-group">
                                                            {SearchedCategoryData.map((item: any) => {
                                                                return (
                                                                    <li className="hreflink list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                                        <a>{item.Newlabel}</a>
                                                                    </li>
                                                                )
                                                            }
                                                            )}
                                                        </ul>
                                                    </div>) : null}
                                                <div className="col">
                                                    <div className="col">
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input rounded-0"
                                                                name="Phone"
                                                                type="checkbox" checked={PhoneStatus}
                                                                value={`${PhoneStatus}`}
                                                                onClick={(e) => CategoryChange(e, "Phone", 199)}
                                                            />
                                                            <label className="form-check-label">Phone</label>
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={EmailStatus}
                                                                value={`${EmailStatus}`}
                                                                onClick={(e) => CategoryChange(e, "Email Notification", 276)}
                                                            />
                                                            <label>Email Notification</label>
                                                            <div className="form-check ms-2">
                                                                <input className="form-check-input rounded-0"
                                                                    type="checkbox"
                                                                    checked={OnlyCompletedStatus}
                                                                    value={`${OnlyCompletedStatus}`}
                                                                    onClick={(e) => CategoryChange(e, "Only Completed", 565)}
                                                                />
                                                                <label>Only Completed</label>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={ImmediateStatus}
                                                                value={`${ImmediateStatus}`}
                                                                onClick={(e) => CategoryChange(e, "Immediate", 228)} />
                                                            <label>Immediate</label>
                                                        </div>
                                                        {ShareWebTypeData != undefined && ShareWebTypeData?.length > 0 ?
                                                            <div>
                                                                {ShareWebTypeData?.map((type: any, index: number) => {
                                                                    if (type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Immediate" && type.Title != "Approval" && type.Title != "Email" && type.Title != "Only Completed") {
                                                                        return (
                                                                            <div className="block px-2 py-2 d-flex my-1 justify-content-between">
                                                                                <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?${EditData.Id}`}>
                                                                                    {type.Title}
                                                                                </a>
                                                                                <span onClick={() => removeCategoryItem(type.Title, type.Id)} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                {/* <svg onClick={() => removeCategoryItem(type.Title, type.Id)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg> */}
                                                                            </div>
                                                                        )
                                                                    }

                                                                })}
                                                            </div> : null
                                                        }
                                                    </div>
                                                    <div className="form-check ">
                                                        <label className="full-width">Approval</label>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input rounded-0"
                                                            name="Approval"
                                                            checked={ApprovalStatus}
                                                            value={`${ApprovalStatus}`}
                                                            onClick={(e) => CategoryChange(e, "Approval", 227)}

                                                        />
                                                    </div>
                                                    <div className="col ps-4">
                                                        <ul className="p-0 mt-1">
                                                            <li className="form-check l-radio">
                                                                <input className="form-check-input"
                                                                    name="ApprovalLevel"
                                                                    type="radio"
                                                                />
                                                                <label className="form-check-label">Normal Approval</label>
                                                            </li>
                                                            <li
                                                                className="form-check l-radio">
                                                                <label> Complex Approval</label>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    name="ApprovalLevel" />
                                                            </li>
                                                            <li
                                                                className="form-check l-radio">
                                                                <label>Quick Approval</label>
                                                                <input
                                                                    type="radio"
                                                                    className="form-check-input"
                                                                    name="ApprovalLevel" />
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {ApprovalStatus ?
                                                        <div>
                                                            <div className="col-12">
                                                                <div className="input-group">
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        placeholder="Search Approver's Name Here"
                                                                        value={ApproverSearchKey}
                                                                        onChange={(e) => autoSuggestionsForApprover(e, "OnTaskPopup")}
                                                                    />
                                                                    <span className="input-group-text" onClick={OpenApproverPopupFunction} title="Approver Data Popup">
                                                                        <span className="svg__iconbox svg__icon--editBox"></span>

                                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> */}

                                                                    </span>
                                                                </div>
                                                                {ApproverSearchedData?.length > 0 ? (
                                                                    <div className="SmartTableOnTaskPopup">
                                                                        <ul className="list-group">
                                                                            {ApproverSearchedData.map((item: any) => {
                                                                                return (
                                                                                    <li className="hreflink list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectApproverFromAutoSuggestion(item)} >
                                                                                        <a>{item.NewLabel}</a>
                                                                                    </li>
                                                                                )
                                                                            }
                                                                            )}
                                                                        </ul>
                                                                    </div>) : null}

                                                                {ApproverData != undefined && ApproverData.length > 0 ?
                                                                    <div>
                                                                        {ApproverData.map((Approver: any, index: number) => {
                                                                            return (
                                                                                <div className="block mt-1 px-2 py-2">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <a className="hreflink " target="_blank" data-interception="off" >
                                                                                            {Approver.Title}
                                                                                        </a>
                                                                                        <span onClick={() => setApproverData([])} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                        {/* <svg onClick={() => setApproverData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" />
                                                                                    </svg> */}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div> : null}
                                                            </div>
                                                            <div className="Approval-History-section my-2">
                                                                {ApproverHistoryData != undefined && ApproverHistoryData.length > 1 ?
                                                                    <div>
                                                                        {ApproverHistoryData.map((HistoryData: any, index: any) => {
                                                                            if (index < ApproverHistoryData.length - 1) {
                                                                                return (
                                                                                    <div className="d-flex full-width justify-content-between">
                                                                                        <div className="d-flex">
                                                                                            Approved by-
                                                                                            <span className="siteColor mx-1">{HistoryData.ApproverName}</span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span>{HistoryData.ApprovedDate}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </div>
                                                                    : null
                                                                }
                                                            </div>
                                                        </div>
                                                        : null
                                                    }

                                                    {/* {ApprovalStatus ?
                                                        <div className="input-group-text p-0">
                                                            {ApproverData?.map((Approver: any, index: number) => {
                                                                return (
                                                                    <div className="block d-flex full-width justify-content-between">
                                                                       

                                                                        <a style={{ color: "#fff !important" }} target="_blank" data-interception="off">
                                                                            {Approver.Title}
                                                                        </a>

                                                                        <svg onClick={() => removeApproverFunction(Approver.Title, Approver.Id)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>

                                                                        {index == 0 ?
                                                                            <span className="input-group-text">
                                                                                <svg onClick={OpenApproverPopupFunction} xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                                            </span>
                                                                            : null}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div> : null
                                                    } */}
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 pt-4">
                                                <div>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control"
                                                            placeholder="Enter Priority"
                                                            value={EditData.Priority_x0020_Rank ? EditData.Priority_x0020_Rank : ''}
                                                            onChange={(e) => ChangePriorityStatusFunction(e)}
                                                        />
                                                    </div>
                                                    <ul className="p-0 mt-1">
                                                        <li className="form-check l-radio">
                                                            <input className="form-check-input"
                                                                name="radioPriority" type="radio"
                                                                checked={EditData.Priority_x0020_Rank <= 10 && EditData.Priority_x0020_Rank >= 8}
                                                                onChange={() => setEditData({ ...EditData, Priority_x0020_Rank: 8 })}
                                                            />
                                                            <label className="form-check-label">High</label>
                                                        </li>
                                                        <li className="form-check l-radio">
                                                            <input className="form-check-input" name="radioPriority"
                                                                type="radio" checked={EditData.Priority_x0020_Rank <= 7 && EditData.Priority_x0020_Rank >= 4}
                                                                onChange={() => setEditData({ ...EditData, Priority_x0020_Rank: 4 })}
                                                            />
                                                            <label className="form-check-label">Normal</label>
                                                        </li>
                                                        <li className="form-check l-radio">
                                                            <input className="form-check-input" name="radioPriority"
                                                                type="radio" checked={EditData.Priority_x0020_Rank <= 3 && EditData.Priority_x0020_Rank >= 0}
                                                                onChange={() => setEditData({ ...EditData, Priority_x0020_Rank: 1 })}
                                                            />
                                                            <label className="form-check-label">Low</label>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="col-12 mb-2">
                                                    <div className="input-group ">
                                                        <label className="form-label full-width">Client Activity</label>
                                                        <input type="text" className="form-control" placeholder="Client Activity"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12" title="Relevant Portfolio Items">
                                                    <div className="input-group">
                                                        <label className="form-label full-width "> Linked Component Task </label>
                                                        <input type="text" readOnly
                                                            className="form-control "
                                                        />
                                                        <span className="input-group-text" title="Linked Component Task Popup" onClick={(e) => alert("We are working on It. This Feature Will Be Live Soon...")}>
                                                            <span className="svg__iconbox svg__icon--editBox"></span>
                                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> */}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-2 mt-2">
                                                    {ComponentTaskCheck ?
                                                        <div>
                                                            <div className="input-group">
                                                                <label className="form-label full-width">
                                                                    Linked Service
                                                                </label>
                                                                <input type="text"
                                                                    className="form-control"
                                                                />
                                                                <span className="input-group-text" title="Linked Service Popup" onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")}>
                                                                    <span className="svg__iconbox svg__icon--editBox"></span>
                                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> */}
                                                                </span>
                                                            </div>
                                                            {
                                                                smartServicesData?.length > 0 ?
                                                                    <div>
                                                                        {smartServicesData?.map((com: any) => {
                                                                            return (
                                                                                <div>
                                                                                    <div className="d-flex justify-content-between block px-2 py-2 mt-1">
                                                                                        <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                            {com.Title}
                                                                                        </a>
                                                                                        <a>
                                                                                            <span onClick={() => setSmartServicesData([])} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                            {/* <svg onClick={() => setSmartServicesData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg> */}
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div> :
                                                                    null
                                                            }

                                                        </div> : null}
                                                    {ServicesTaskCheck ? <div >
                                                        <div className="input-group">
                                                            <label className="form-label full-width">
                                                                Linked Component
                                                            </label>
                                                            <input type="text"
                                                                className="form-control "
                                                            />
                                                            <span className="input-group-text" title="Linked Component Popup" onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")}>
                                                                <span className="svg__iconbox svg__icon--editBox"></span>
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> */}
                                                            </span>
                                                        </div>

                                                        {
                                                            smartComponentData?.length > 0 ? <div>
                                                                {smartComponentData?.map((com: any) => {
                                                                    return (
                                                                        <div>
                                                                            <div className="d-flex justify-content-between block px-2 py-2 mt-1">

                                                                                <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                    {com.Title}
                                                                                </a>
                                                                                <a>
                                                                                    <span onClick={() => setSmartComponentData([])} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                    {/* <svg onClick={() => setSmartComponentData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg> */}
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div> :
                                                                null
                                                        }
                                                    </div> : null}
                                                </div>
                                                <div className="col-12">
                                                    <div className="input-group">
                                                        <label className="form-label full-width">
                                                            Project
                                                        </label>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder="Search Project Here"
                                                            value={ProjectSearchKey}
                                                            onChange={(e) => autoSuggestionsForProject(e)}
                                                        />
                                                        {ComponentTaskCheck == false && ServicesTaskCheck == false ?
                                                            <span className="input-group-text" title="Project Popup" onClick={(e) => alert("Please select anyone from Portfolio/Services")}>
                                                                <span className="svg__iconbox svg__icon--editBox"></span>
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" />
                                                                </svg> */}
                                                            </span>

                                                            : <span className="input-group-text" onClick={() => setProjectManagementPopup(true)} title="Project Items Popup" >
                                                                <span className="svg__iconbox svg__icon--editBox">
                                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> */}
                                                                </span>
                                                            </span>}
                                                    </div>
                                                    {SearchedProjectData?.length > 0 ? (
                                                        <div className="SmartTableOnTaskPopup">
                                                            <ul className="list-group">
                                                                {SearchedProjectData.map((item: any) => {
                                                                    return (
                                                                        <li className="hreflink list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectProjectFromAutoSuggestion([item])} >
                                                                            <a>{item.Title}</a>
                                                                        </li>
                                                                    )
                                                                }
                                                                )}
                                                            </ul>
                                                        </div>) : null}
                                                    {selectedProject != undefined && selectedProject.length > 0 ?
                                                        <div>
                                                            {selectedProject.map((ProjectData: any) => {
                                                                return (
                                                                    <div className="block mt-1 px-2 py-2">
                                                                        <div className="d-flex justify-content-between">
                                                                            <a className="hreflink " target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${ProjectData.Id}`}>
                                                                                {ProjectData.Title}
                                                                            </a>
                                                                            <svg onClick={() => setSelectedProject([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-2">
                                            <div className="input-group">
                                                <label className="form-label full-width ">Relevant URL</label>
                                                <input type="text" className="form-control" defaultValue={EditData.component_x0020_link != null ? EditData.Relevant_Url : ''} placeholder="Url" onChange={(e) => setEditData({ ...EditData, Relevant_Url: e.target.value })}
                                                />
                                                <span className={EditData.component_x0020_link != null ? "input-group-text" : "input-group-text Disabled-Link"}>
                                                    <a target="_blank" href={EditData.component_x0020_link != null ? EditData.component_x0020_link.Url : ''} data-interception="off"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3677 13.2672C11.023 13.7134 9.87201 14.4471 8.99831 15.4154C6.25928 18.4508 6.34631 23.1488 9.19578 26.0801C10.6475 27.5735 12.4385 28.3466 14.4466 28.3466H15.4749V27.2499V26.1532H14.8471C12.6381 26.1532 10.4448 24.914 9.60203 23.1898C8.93003 21.8151 8.9251 19.6793 9.5906 18.3208C10.4149 16.6384 11.9076 15.488 13.646 15.1955C14.7953 15.0022 22.5955 14.9933 23.7189 15.184C26.5649 15.6671 28.5593 18.3872 28.258 21.3748C27.9869 24.0644 26.0094 25.839 22.9861 26.1059L21.9635 26.1961V27.2913V28.3866L23.2682 28.3075C27.0127 28.0805 29.7128 25.512 30.295 21.6234C30.8413 17.9725 28.3779 14.1694 24.8492 13.2166C24.1713 13.0335 23.0284 12.9942 18.5838 13.0006C13.785 13.0075 13.0561 13.0388 12.3677 13.2672ZM23.3224 19.8049C18.7512 20.9519 16.3624 26.253 18.4395 30.6405C19.3933 32.6554 20.9948 34.0425 23.1625 34.7311C23.9208 34.9721 24.5664 35 29.3689 35C34.1715 35 34.8171 34.9721 35.5754 34.7311C38.1439 33.9151 39.9013 32.1306 40.6772 29.5502C41 28.4774 41.035 28.1574 40.977 26.806C40.9152 25.3658 40.8763 25.203 40.3137 24.0261C39.0067 21.2919 36.834 19.8097 33.8475 19.6151L32.5427 19.53V20.6267V21.7236L33.5653 21.8132C35.9159 22.0195 37.6393 23.0705 38.4041 24.7641C39.8789 28.0293 38.2035 31.7542 34.8532 32.6588C33.8456 32.9309 25.4951 32.9788 24.1462 32.7205C22.4243 32.3904 21.0539 31.276 20.2416 29.5453C19.8211 28.6492 19.7822 28.448 19.783 27.1768C19.7837 26.0703 19.8454 25.6485 20.0853 25.1039C20.4635 24.2463 21.3756 23.2103 22.1868 22.7175C22.8985 22.2851 24.7121 21.7664 25.5124 21.7664H26.0541V20.6697V19.573L25.102 19.5851C24.5782 19.5919 23.7775 19.6909 23.3224 19.8049Z" fill="#333333" />
                                                        </svg>
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        {EditData.siteCompositionData != undefined && EditData.siteCompositionData.length > 0 && AllListIdData.isShowSiteCompostion ?
                                            <div className="Sitecomposition">
                                                <div className='dropdown'>
                                                    <a className="sitebutton bg-fxdark" style={{ cursor: "pointer" }} onClick={() => setComposition(composition ? false : true)}>
                                                        <span>{composition ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span>Site Composition</span>
                                                    </a>
                                                    {composition ?
                                                        <div className="mt-1 spxdropdown-menu">
                                                            <ul>
                                                                {EditData.siteCompositionData != undefined && EditData.siteCompositionData.length > 0 ?
                                                                    <>
                                                                        {EditData.siteCompositionData?.map((SiteDtls: any, i: any) => {
                                                                            return <li className="Sitelist">
                                                                                <span className="ms-2">
                                                                                    <img style={{ width: "22px" }} src={SiteDtls.siteIcons} />
                                                                                </span>

                                                                                {SiteDtls.ClienTimeDescription != undefined &&
                                                                                    <span className="mx-2">
                                                                                        {Number(SiteDtls.ClienTimeDescription).toFixed(2)}%
                                                                                    </span>
                                                                                }
                                                                                {SiteDtls.ClientCategory != undefined && SiteDtls.ClientCategory.length > 0 ?
                                                                                    <>
                                                                                        {SiteDtls.ClientCategory?.map((ClData: any) => {
                                                                                            return (
                                                                                                <span className="mx-2">
                                                                                                    {ClData.Title}
                                                                                                </span>
                                                                                            )
                                                                                        })}
                                                                                    </>
                                                                                    : null
                                                                                }
                                                                            </li>
                                                                        })}
                                                                    </> : null
                                                                }
                                                            </ul>
                                                        </div> : null
                                                    }
                                                    <div className="bg-e9 border-1 p-2">
                                                        <label className="siteColor">Total Time</label>
                                                        {EditData.Id != null ? <span className="pull-right siteColor"><SmartTotalTime props={EditData} callBack={SmartTotalTimeCallBack} /> h</span> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            : null}

                                        <div className="col mt-2">
                                            <div className="input-group">
                                                <label className="form-label full-width">Status</label>
                                                <input type="text" maxLength={3} placeholder="% Complete" disabled={InputFieldDisable} className="form-control px-2"
                                                    defaultValue={PercentCompleteCheck ? (EditData.PercentComplete != undefined ? EditData.PercentComplete : null) : (UpdateTaskInfo.PercentCompleteStatus ? UpdateTaskInfo.PercentCompleteStatus : null)}
                                                    onChange={(e) => StatusAutoSuggestion(e)} />
                                                <span className="input-group-text" title="Status Popup" onClick={() => openTaskStatusUpdatePopup(EditData)}>
                                                    <span title="Edit Task" className="svg__iconbox svg__icon--editBox"></span>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> */}
                                                </span>
                                                {PercentCompleteStatus?.length > 0 ?
                                                    <span className="full-width l-radio">
                                                        <input type='radio' className="form-check-input my-2" checked />
                                                        <label className="ps-2 pt-1">
                                                            {PercentCompleteStatus}
                                                        </label>
                                                    </span> : null}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col mt-2 time-status">
                                                <div>
                                                    <div className="input-group">
                                                        <label className="form-label full-width ">Time</label>
                                                        <input type="text" maxLength={3} className="form-control" placeholder="Time"
                                                            defaultValue={EditData.Mileage != null ? EditData.Mileage : ""} onChange={(e) => setEditData({ ...EditData, Mileage: e.target.value })} />
                                                    </div>
                                                    <ul className="p-0 mt-1">
                                                        <li className="form-check l-radio">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage <= 15 && EditData.Mileage > 0 ? true : false} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '15' })}
                                                                defaultChecked={EditData.Mileage <= 15 && EditData.Mileage > 0 ? true : false}
                                                            />
                                                            <label className="form-check-label">Very Quick</label>
                                                        </li>
                                                        <li className="form-check l-radio">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage <= 60 && EditData.Mileage > 15 ? true : false} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '60' })}
                                                                defaultChecked={EditData.Mileage <= 60 && EditData.Mileage > 15 ? true : false}
                                                            />
                                                            <label className="form-check-label">Quick</label>
                                                        </li>
                                                        <li className="form-check l-radio">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage <= 240 && EditData.Mileage > 60 ? true : false} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '240' })}
                                                                defaultChecked={EditData.Mileage <= 240 && EditData.Mileage > 60 ? true : false}
                                                            />
                                                            <label className="form-check-label">Medium</label>
                                                        </li>
                                                        <li className="form-check l-radio">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage === '480'} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '480' })}
                                                                defaultChecked={EditData.Mileage <= 480 && EditData.Mileage > 240 ? true : false}
                                                            />
                                                            <label className="form-check-label">Long</label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col mt-2">
                                                <div className="input-group">
                                                    <label className="form-label full-width  mx-2">Working Member</label>
                                                    {EditData.TaskAssignedUsers?.map((userDtl: any, index: any) => {
                                                        return (
                                                            <div className="TaskUsers" key={index}>
                                                                <a
                                                                    target="_blank"
                                                                    data-interception="off"
                                                                    href={`${Items.Items.siteType}/SitePages/TeamLeader-Dashboard.aspx?UserId=${userDtl.AssingedToUserId}&Name=${userDtl.Title}`} >
                                                                    <img ui-draggable="true" data-bs-toggle="tooltip" data-bs-placement="bottom" title={userDtl.Title ? userDtl.Title : ''}
                                                                        on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                                                        data-toggle="popover" data-trigger="hover" style={{ width: "35px", height: "35px", marginLeft: "10px", borderRadius: "50px" }}
                                                                        src={userDtl.Item_x0020_Cover ? userDtl.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                                    />
                                                                </a>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-2">
                                            <div className="input-group ">
                                                <label className="form-label full-width">Estimated Time</label>
                                                <input type="text" className="form-control"
                                                    defaultValue={EditData.EstimatedTime}
                                                    placeholder="Enter Estimated Time"
                                                    onChange={(e) => setEditData({ ...EditData, EstimatedTime: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="full_width ">
                                            <CommentCard siteUrl={siteUrls} AllListId={AllListIdData} Context={Context} />
                                        </div>
                                        <div className="pull-right">
                                            <span className="">
                                                <label className="form-check-label mx-2">Waiting for HHHH response</label>
                                                <input className="form-check-input rounded-0" type="checkbox"
                                                    checked={EditData.waitForResponse}
                                                    value={EditData.waitForResponse}
                                                    onChange={(e) => changeStatus(e, "waitForResponse")}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row py-3">
                                    {/* {ImageSection.map(function (Image: any) {
                                        return (
                                            <div>
                                                <div className="col-sm-12  mt-5">
                                                    <span className="">
                                                        {Image.ImageName}
                                                        <a title="Delete" data-toggle="modal"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                            </svg>
                                                        </a>
                                                    </span>
                                                    <div className="img">
                                                        <a className="sit-preview hreflink preview" target="_blank"
                                                            rel="{{BasicImageUrl.Url}}" href="{{BasicImageUrl.Url}}">
                                                            <img id="sit-sharewebImagePopup-demo"
                                                                data-toggle="popover" data-trigger="hover"
                                                                data-content="{{attachedFile.FileLeafRef}}"
                                                            />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    } */}
                                    <div className={IsShowFullViewImage != true ?
                                        'col-sm-3 padL-0 DashboardTaskPopup-Editor above' :
                                        'col-sm-6  padL-0 DashboardTaskPopup-Editor above'}>
                                        <div className="image-upload">
                                            <ImageUploading
                                                multiple
                                                value={TaskImages}
                                                onChange={onUploadImageFunction}
                                                dataURLKey="data_url"
                                            >
                                                {({
                                                    imageList,
                                                    onImageUpload,
                                                    onImageRemoveAll,
                                                    onImageUpdate,
                                                    onImageRemove,
                                                    isDragging,
                                                    dragProps,
                                                }) => (
                                                    <div className="upload__image-wrapper">

                                                        {imageList.map((ImageDtl, index) => (
                                                            <div key={index} className="image-item">
                                                                <div className="my-1">
                                                                    <div>
                                                                        <input type="checkbox" className="rounded-0" checked={ImageDtl.Checked} onClick={() => ImageCompareFunction(ImageDtl, index)} />
                                                                        <span className="mx-1">{ImageDtl.ImageName ? ImageDtl.ImageName.slice(0, 24) : ''}</span>
                                                                    </div>
                                                                    <a href={ImageDtl.ImageUrl} target="_blank" data-interception="off">
                                                                        <img src={ImageDtl.ImageUrl ? ImageDtl.ImageUrl : ''} onMouseOver={(e) => MouseHoverImageFunction(e, ImageDtl)}
                                                                            onMouseOut={(e) => MouseOutImageFunction(e)}
                                                                            className="card-img-top" />
                                                                    </a>

                                                                    <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                                        <div>
                                                                            <span className="fw-semibold">{ImageDtl.UploadeDate ? ImageDtl.UploadeDate : ''}</span>
                                                                            <span className="mx-1">
                                                                                <img className="imgAuthor" title={ImageDtl.UserName} src={ImageDtl.UserImage ? ImageDtl.UserImage : ''} />
                                                                            </span>
                                                                        </div>
                                                                        <div>

                                                                            <span onClick={() => openReplaceImagePopup(index)} title="Replace image"><TbReplace /> </span>
                                                                            <span className="mx-1" title="Delete" onClick={() => RemoveImageFunction(index, ImageDtl.ImageName, "Remove")}> | <RiDeleteBin6Line /> | </span>
                                                                            <span title="Customize the width of page" onClick={() => ImageCustomizeFunction(index)}>
                                                                                <FaExpandAlt />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="d-flex justify-content-between py-1 border-top ">
                                                            {/* <span className="siteColor"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => alert("We are working on it. This Feature will be live soon ..")}>
                                                                Upload Item-Images
                                                            </span> */}

                                                            {TaskImages?.length != 0 ?
                                                                <span className="siteColor"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => setUploadBtnStatus(UploadBtnStatus ? false : true)}>
                                                                    Add New Image
                                                                </span>
                                                                : null}
                                                        </div>
                                                        {UploadBtnStatus ?
                                                            <div>
                                                                {/* <div className="drag-upload-image mt-1"
                                                                    style={isDragging ? { border: '1px solid red' } : undefined}
                                                                    onClick={onImageUpload}
                                                                    {...dragProps}
                                                                >
                                                                    Drop here Or <span className="siteColor" style={{ cursor: "pointer" }} >Click Here To Upload</span>
                                                                </div> */}
                                                                <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />

                                                            </div> : null}
                                                        {TaskImages?.length == 0 ? <div>
                                                            {/* <div className="drag-upload-image mt-1"
                                                                style={isDragging ? { border: '1px solid red' } : undefined}
                                                                onClick={onImageUpload}
                                                                {...dragProps}
                                                            >
                                                                Drop here Or <span className="siteColor" style={{ cursor: "pointer" }} >Click Here To Upload</span>
                                                            </div> */}
                                                            <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />

                                                        </div> : null}
                                                        {/* <div>
                                                            <FlorarImageUploadComponent />
                                                        </div> */}

                                                        {/* <button onClick={onImageRemoveAll}>Upload item-images</button> */}

                                                    </div>

                                                )}
                                            </ImageUploading>
                                        </div>
                                    </div>
                                    <div className={IsShowFullViewImage != true ? 'col-sm-9 toggle-task' : 'col-sm-6 editsectionscroll toggle-task'}>
                                        {EditData.Id != null ? <>
                                            <CommentBoxComponent
                                                data={EditData.FeedBackArray}
                                                callBack={CommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                                SmartLightPercentStatus={SmartLightPercentStatus}
                                                Context={Context}
                                            />
                                            <Example
                                                textItems={EditData.FeedBackArray}
                                                callBack={SubCommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ItemId={EditData.Id}
                                                SiteUrl={EditData.component_x0020_link}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                                SmartLightPercentStatus={SmartLightPercentStatus}
                                                Context={Context}
                                            />
                                        </>
                                            : null}
                                    </div>
                                    {/* <div className="form-group">
                                                    <div className="col-sm-6">
                                                        <div ng-if="attachments.length > 0"
                                                            ng-repeat="attachedFiles in attachments">
                                                            <div ng-show="ImageName != attachedFiles.FileName">
                                                                <div
                                                                    ng-if="attachedFiles.FileName.toLowerCase().indexOf('.txt'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.docx'.toLowerCase())> -1  || attachedFiles.FileName.toLowerCase().indexOf('.pdf'.toLowerCase())> -1  || attachedFiles.FileName.toLowerCase().indexOf('.doc'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.msg'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.pptx'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.xls'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.xlsx'.toLowerCase())> -1">
                                                                    <a
                                                                        ng-href="{{CurrentSiteUrl}}/Lists/{{Item.siteType}}/Attachments/{{attachedItemId}}/{{attachedFiles.FileName}}?web=1">attachedFiles.FileName </a>
                                                                    <a style={{ cursor: "pointer" }} title="Delete" data-toggle="modal"
                                                                        ng-click="deleteFile(attachedFiles)">
                                                                        <img ng-src="/_layouts/images/delete.gif" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div> */}
                                    {/* </div>
                                     </div> */}
                                </div>
                            </div>
                            {/* <div className="tab-pane " id="TIMESHEET" role="tabpanel" aria-labelledby="TIMESHEET">
                                <div>
                                    <TeamComposition props={Items} />
                                </div>
                            </div> */}
                            <div className="tab-pane " id="NEWTIMESHEET" role="tabpanel" aria-labelledby="NEWTIMESHEET">
                                <div className="d-flex justify-content-between">
                                    <div className="col-sm-7">
                                        <NewTameSheetComponent props={Items} AllListId={AllListIdData}
                                            TeamConfigDataCallBack={getTeamConfigData}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        {EditData.Id != null && AllListIdData.isShowSiteCompostion ?
                                            <>
                                                {SiteTypes != undefined && SiteTypes.length > 0 ?
                                                    <SiteCompositionComponent
                                                        AllListId={AllListIdData}
                                                        siteUrls={siteUrls}
                                                        SiteTypes={SiteTypes}
                                                        ClientTime={EditData.siteCompositionData}
                                                        SiteCompositionSettings={EditData.SiteCompositionSettings}
                                                        SmartTotalTimeData={SmartTotalTimeData}
                                                        currentListName={EditData.siteType}
                                                        callBack={SiteCompositionCallBack}
                                                        isServiceTask={ServicesTaskCheck}
                                                        SelectedClientCategory={selectedClientCategory}
                                                        isPortfolioConncted={ComponentTaskCheck || ServicesTaskCheck ? true : false}
                                                        SitesTaggingData={SitesTaggingData}
                                                    /> : null
                                                }
                                            </>
                                            : null
                                        }

                                    </div>
                                </div>
                            </div>
                            {IsUserFromHHHHTeam ? null :
                                <div className="tab-pane " id="BACKGROUNDCOMMENT" role="tabpanel" aria-labelledby="BACKGROUNDCOMMENT">
                                    {
                                        EditData.Id != null || EditData.Id != undefined ?
                                            <BackgroundCommentComponent
                                                CurrentUser={currentUserData}
                                                TaskData={EditData}
                                                Context={Context}
                                                siteUrls={siteUrls}
                                            />
                                            : null
                                    }

                                </div>
                            }
                        </div>
                        {/* </>
                                    )
                                })} */}
                    </div>

                    {IsComponent &&
                        <ServiceComponentPortfolioPopup
                            props={ShareWebComponent}
                            Dynamic={AllListIdData}
                            ComponentType={"Component"}
                            Call={ComponentServicePopupCallBack}
                            selectionType={"Single"}
                        />
                    }
                    {IsServices &&
                        <ServiceComponentPortfolioPopup
                            props={ShareWebComponent}
                            Dynamic={AllListIdData}
                            Call={ComponentServicePopupCallBack}
                            ComponentType={"Service"}
                            selectionType={"Single"}
                        />
                    }
                    {IsComponentPicker &&
                        <Picker
                            props={ShareWebComponent}
                            selectedCategoryData={ShareWebTypeData}
                            usedFor="Task-Popup"
                            siteUrls={siteUrls}
                            AllListId={AllListIdData}
                            CallBack={SelectCategoryCallBack}
                            isServiceTask={ServicesTaskCheck}
                            closePopupCallBack={smartCategoryPopup}
                        />
                    }

                    {sendEmailComponentStatus ? <EmailComponent CurrentUser={currentUserData} CreatedApprovalTask={Items.sendApproverMail} items={LastUpdateTaskData} Context={Context} ApprovalTaskStatus={ApprovalTaskStatus} callBack={SendEmailNotificationCallBack} /> : null}
                </div>
            </Panel>
            {/* ***************** this is Image compare panel *********** */}
            <Panel
                isOpen={ImageComparePopup}
                type={PanelType.custom}
                customWidth="100%"
                onRenderHeader={onRenderCustomHeaderMain}
                onDismiss={ImageCompareFunctionClosePopup}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterOther}
            >
                <div className="modal-body mb-5">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <button className="nav-link active" id="IMAGE-INFORMATION" data-bs-toggle="tab" data-bs-target="#IMAGEINFORMATION" type="button" role="tab" aria-controls="IMAGEINFORMATION" aria-selected="true">
                            BASIC INFORMATION
                        </button>
                        <button className="nav-link" id="IMAGE-TIME-SHEET" data-bs-toggle="tab" data-bs-target="#IMAGETIMESHEET" type="button" role="tab" aria-controls="IMAGETIMESHEET" aria-selected="false">TIMESHEET</button>
                    </ul>
                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                        <div className="tab-pane show active" id="IMAGEINFORMATION" role="tabpanel" aria-labelledby="IMAGEINFORMATION">
                            <div className="image-section row">
                                <div className="single-image-section col-sm-6 p-2" style={{
                                    border: "2px solid #ccc"
                                }}>
                                    <img src={compareImageArray?.length > 0 ? compareImageArray[0]?.ImageUrl : ""} className='img-fluid card-img-top' />
                                    <div className="card-footer d-flex justify-content-between p-1 px-2">
                                        <div>
                                            <span className="mx-1">{compareImageArray[0]?.ImageName ? compareImageArray[0]?.ImageName.slice(0, 6) : ''}</span>
                                            <span className="fw-semibold">{compareImageArray[0]?.UploadeDate ? compareImageArray[0]?.UploadeDate : ''}</span>
                                            <span className="mx-1">
                                                <img style={{ width: "25px" }} src={compareImageArray[0]?.UserImage ? compareImageArray[0]?.UserImage : ''} />
                                            </span>
                                        </div>
                                        <div>
                                            <span className="mx-1"> <TbReplace /> |</span>
                                            <span><RiDeleteBin6Line /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="slider-image-section col-sm-6 p-2" style={{
                                    border: "2px solid #ccc"
                                }}>
                                    <div id="carouselExampleControls" className="carousel slide" data-bs-interval="false">
                                        <div className="carousel-inner">
                                            {TaskImages?.map((imgData: any, index: any) => {
                                                return (
                                                    <div className={index == 0 ? "carousel-item active" : "carousel-item"}>
                                                        <img src={imgData.ImageUrl} className="d-block w-100" alt="..." />
                                                        <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                            <div>
                                                                <span className="mx-1">{imgData.ImageName ? imgData.ImageName.slice(0, 6) : ''}</span>
                                                                <span className="fw-semibold">{imgData.UploadeDate ? imgData.UploadeDate : ''}</span>
                                                                <span className="mx-1">
                                                                    <img style={{ width: "25px" }} src={imgData.UserImage ? imgData.UserImage : ''} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="mx-1"> <TbReplace /> |</span>
                                                                <span><RiDeleteBin6Line /></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" data-bs-interval="false">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" data-bs-interval="false">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Upload Image</h6>
                                    <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Add New Image</h6>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane " id="IMAGETIMESHEET" role="tabpanel" aria-labelledby="IMAGETIMESHEET">
                            <div>
                                <NewTameSheetComponent props={Items} AllListId={AllListIdData}
                                    TeamConfigDataCallBack={getTeamConfigData}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </Panel>
            {/* ***************** this is Image customize panel *********** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                isOpen={ImageCustomizePopup}
                type={PanelType.custom}
                customWidth="100%"
                onDismiss={ImageCustomizeFunctionClosePopup}
                isBlocking={ImageCustomizePopup}
                onRenderFooter={onRenderCustomFooterOther}
            >
                <div className={ServicesTaskCheck ? "modal-body mb-5 serviepannelgreena" : "modal-body mb-5"}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <button className="nav-link active" id="IMAGE-INFORMATION" data-bs-toggle="tab" data-bs-target="#IMAGEINFORMATION" type="button" role="tab" aria-controls="IMAGEINFORMATION" aria-selected="true">
                            BASIC INFORMATION
                        </button>
                        <button className="nav-link" id="IMAGE-TIME-SHEET" data-bs-toggle="tab" data-bs-target="#IMAGETIMESHEET" type="button" role="tab" aria-controls="IMAGETIMESHEET" aria-selected="false">TIMESHEET</button>
                    </ul>
                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                        <div className="tab-pane show active" id="IMAGEINFORMATION" role="tabpanel" aria-labelledby="IMAGEINFORMATION">
                            <div className="image-section row">
                                {ShowTaskDetailsStatus ?
                                    <div>
                                        <h6 className="siteColor mb-3" style={{ cursor: "pointer" }} onClick={() => setShowTaskDetailsStatus(ShowTaskDetailsStatus ? false : true)}>
                                            Show task details -
                                        </h6>
                                        <div>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <div className="col-12 ">
                                                        <div className="input-group">
                                                            <div className="d-flex justify-content-between align-items-center mb-0  full-width">Title
                                                                <span className="d-flex">
                                                                    <span className="form-check mx-2">
                                                                        <input className="form-check-input rounded-0" type="checkbox"
                                                                            checked={EditData.workingThisWeek}
                                                                            value={EditData.workingThisWeek}
                                                                            onChange={(e) => changeStatus(e, "workingThisWeek")} />
                                                                        <label className="form-check-label">Working This Week?</label>
                                                                    </span>
                                                                    <span className="form-check">
                                                                        <input className="form-check-input rounded-0" type="checkbox"
                                                                            checked={EditData.IsTodaysTask}
                                                                            value={EditData.IsTodaysTask}
                                                                            onChange={(e) => changeStatus(e, "IsTodaysTask")} />
                                                                        <label className="form-check-label">Working Today?</label>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <input type="text" className="form-control" placeholder="Task Name"
                                                                defaultValue={EditData.Title} onChange={(e) => setUpdateTaskInfo({ ...UpdateTaskInfo, Title: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="mx-0 row  ">
                                                        <div className="col-6 ps-0 mt-2">
                                                            <div className="input-group ">
                                                                <label className="form-label full-width" >Start Date</label>
                                                                <input type="date" className="form-control start-date" max="9999-12-31" min="2000-01-01"
                                                                    defaultValue={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : ''}
                                                                    onChange={(e) => setEditData({
                                                                        ...EditData, StartDate: e.target.value
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 pe-0 mt-2">
                                                            <div className="input-group ">
                                                                <div className="form-label full-width">Due Date<span title="Re-occurring Due Date">
                                                                    <input type="checkbox" className="form-check-input rounded-0 ms-2"
                                                                    />
                                                                </span></div>

                                                                <input type="date" className="form-control due-date" max="9999-12-31" min={EditData.Created ? Moment(EditData.Created).format("YYYY-MM-DD") : ''}
                                                                    defaultValue={EditData.DueDate ? Moment(EditData.DueDate).format("YYYY-MM-DD") : ''}
                                                                    onChange={(e) => setEditData({
                                                                        ...EditData, DueDate: e.target.value
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 mt-2">
                                                            <div className="input-group ">
                                                                <label className="form-label full-width"
                                                                >Completed Date</label>
                                                                <input type="date" className="form-control complete-Date " max="9999-12-31" min={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : ''}
                                                                    defaultValue={EditData.CompletedDate ? Moment(EditData.CompletedDate).format("YYYY-MM-DD") : ''}
                                                                    onChange={(e) => setEditData({
                                                                        ...EditData, CompletedDate: e.target.value
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 pe-0 mt-2">
                                                            <div className="input-group">
                                                                <label className="form-label full-width">Item Rank</label>
                                                                <select className="form-select" defaultValue={EditData.ItemRank} onChange={(e) => setItemRank(e.target.value)}>
                                                                    {ItemRankArray.map(function (h: any, i: any) {
                                                                        return (
                                                                            <option key={i} selected={EditData.ItemRank == h.rank} value={h.rank} >{h.rankTitle}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mx-0 row mt-2">
                                                        <div className="col ps-0">
                                                            <div className="input-group mb-2">
                                                                <label className="full-width">
                                                                    <span className="form-check l-radio form-check-inline mb-0">
                                                                        <input type="radio" id="Components"
                                                                            name="Portfolios" checked={ComponentTaskCheck}
                                                                            title="Component"

                                                                            className="form-check-input " />
                                                                        <label className="form-check-label mb-0">Component</label>
                                                                    </span>
                                                                    <span className="form-check l-radio form-check-inline mb-0">
                                                                        <input type="radio" id="Services"
                                                                            name="Portfolios" value="Services"
                                                                            title="Services"
                                                                            checked={ServicesTaskCheck}
                                                                            className="form-check-input" />
                                                                        <label className="form-check-label mb-0">Services</label>
                                                                    </span>
                                                                </label>
                                                                {smartComponentData?.length > 0 || smartServicesData?.length > 0 ? null :
                                                                    <>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            id="{{PortfoliosID}}" autoComplete="off"
                                                                        />
                                                                    </>
                                                                }
                                                                {smartComponentData.length > 0 && ComponentTaskCheck ? smartComponentData?.map((com: any) => {
                                                                    return (
                                                                        <>
                                                                            <div className="block d-flex justify-content-between px-2 py-1" style={{ width: "88%" }}>
                                                                                <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                <a>

                                                                                    <svg onClick={() => setSmartComponentData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>
                                                                                </a>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                }) : <>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        id="{{PortfoliosID}}" autoComplete="off"
                                                                    />
                                                                </>}
                                                                {
                                                                    smartServicesData?.length > 0 && ServicesTaskCheck ? smartServicesData?.map((com: any) => {
                                                                        return (
                                                                            <>
                                                                                <div className="block d-flex justify-content-between px-2 py-1" style={{ width: "88%" }}>
                                                                                    <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                    <a>
                                                                                        <svg onClick={() => setSmartServicesData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" />
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }) : <>
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            id="{{PortfoliosID}}" autoComplete="off"
                                                                        />
                                                                    </>
                                                                }
                                                                <span className="input-group-text">
                                                                    {ComponentTaskCheck ? <svg onClick={() => EditComponent(EditData, 'Component')} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> : null}
                                                                    {ServicesTaskCheck ? <svg onClick={() => EditLinkedServices(EditData, 'Services')} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> : null}
                                                                    {ComponentTaskCheck == false && ServicesTaskCheck == false ? <svg onClick={() => alert("Please select anyone from Portfolio/Services")} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg> : null}

                                                                </span>
                                                            </div>
                                                            <div className="input-group mb-2">
                                                                <label className="form-label full-width">
                                                                    Categories
                                                                </label>

                                                                <input type="text" className="form-control"
                                                                    id="txtCategories" placeholder="Search Category Here" value={categorySearchKey} onChange={(e) => autoSuggestionsForCategory(e)} />
                                                                <span className="input-group-text">
                                                                    <svg onClick={(e) => EditComponentPicker(EditData, 'Categories')} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                                </span>
                                                            </div>
                                                            {SearchedCategoryData?.length > 0 ? (
                                                                <div className="SmartTableOnTaskPopup">
                                                                    <ul className="list-group">
                                                                        {SearchedCategoryData.map((item: any) => {
                                                                            return (
                                                                                <li className="hreflink list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                                                    <a>{item.Newlabel}</a>
                                                                                </li>
                                                                            )
                                                                        }
                                                                        )}
                                                                    </ul>
                                                                </div>) : null}
                                                            <div className="col">
                                                                <div className="col">
                                                                    <div
                                                                        className="form-check">
                                                                        <input className="form-check-input rounded-0"
                                                                            name="Phone"
                                                                            type="checkbox" checked={PhoneStatus}
                                                                            value={`${PhoneStatus}`}
                                                                            onClick={(e) => CategoryChange(e, "Phone", 199)}
                                                                        />
                                                                        <label className="form-check-label">Phone</label>
                                                                    </div>
                                                                    <div
                                                                        className="form-check">
                                                                        <input className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={EmailStatus}
                                                                            value={`${EmailStatus}`}
                                                                            onClick={(e) => CategoryChange(e, "Email Notification", 276)}
                                                                        />
                                                                        <label>Email Notification</label>
                                                                        <div className="form-check ms-2">
                                                                            <input className="form-check-input rounded-0"
                                                                                type="checkbox"
                                                                                checked={OnlyCompletedStatus}
                                                                                value={`${OnlyCompletedStatus}`}
                                                                                onClick={(e) => CategoryChange(e, "Only Completed", 565)}
                                                                            />
                                                                            <label>Only Completed</label>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="form-check">
                                                                        <input className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={ImmediateStatus}
                                                                            value={`${ImmediateStatus}`}
                                                                            onClick={(e) => CategoryChange(e, "Immediate", 228)} />
                                                                        <label>Immediate</label>
                                                                    </div>
                                                                    {ShareWebTypeData != undefined && ShareWebTypeData?.length > 0 ?
                                                                        <div>
                                                                            {ShareWebTypeData?.map((type: any, index: number) => {
                                                                                if (type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Immediate" && type.Title != "Approval" && type.Title != "Email" && type.Title != "Only Completed") {
                                                                                    return (
                                                                                        <div className="block px-2 py-2 d-flex my-1 justify-content-between">
                                                                                            <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?${EditData.Id}`}>
                                                                                                {type.Title}
                                                                                            </a>
                                                                                            <svg onClick={() => removeCategoryItem(type.Title, type.Id)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>

                                                                                        </div>
                                                                                    )
                                                                                }

                                                                            })}
                                                                        </div> : null
                                                                    }
                                                                </div>
                                                                <div className="form-check ">
                                                                    <label className="full-width">Approval</label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input rounded-0"
                                                                        name="Approval"
                                                                        checked={ApprovalStatus}
                                                                        value={`${ApprovalStatus}`}
                                                                        onClick={(e) => CategoryChange(e, "Approval", 227)}

                                                                    />
                                                                </div>
                                                                <div className="col ps-4">
                                                                    <ul className="p-0 mt-1">
                                                                        <li
                                                                            className="form-check l-radio">
                                                                            <label>Normal Approval</label>
                                                                            <input
                                                                                type="radio"
                                                                                name="ApprovalLevel"
                                                                                className="form-check-input" />
                                                                        </li>
                                                                        <li
                                                                            className="form-check l-radio">
                                                                            <label> Complex Approval</label>
                                                                            <input
                                                                                type="radio"
                                                                                name="ApprovalLevel"
                                                                                className="form-check-input" />
                                                                        </li>
                                                                        <li
                                                                            className="form-check l-radio">
                                                                            <label> Quick Approval</label>
                                                                            <input
                                                                                type="radio"
                                                                                name="ApprovalLevel"
                                                                                className="form-check-input " />
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                {ApprovalStatus ?
                                                                    <div>
                                                                        {ApproverData?.map((Approver: any, index: number) => {
                                                                            return (
                                                                                <div className="block px-2 py-1 d-flex my-1 justify-content-between">
                                                                                    {/* href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?${EditData.Id}`} */}
                                                                                    <div>
                                                                                        <a style={{ color: "#fff !important" }} target="_blank" data-interception="off">
                                                                                            {Approver.Title}
                                                                                        </a>

                                                                                        <svg onClick={() => setApproverData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>
                                                                                    </div>
                                                                                    {index == 0 ? <span className="float-end " onClick={OpenApproverPopupFunction} >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                                                    </span> : null}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div> : null
                                                                }

                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 pe-0 pt-4">
                                                            <div>
                                                                <div className="input-group">
                                                                    <input type="text" className="form-control"
                                                                        placeholder="Enters Priority" defaultValue={PriorityStatus ? PriorityStatus : ''}
                                                                    />
                                                                </div>
                                                                <ul className="p-0 mt-1">
                                                                    <li className="form-check l-radio">
                                                                        <input className="form-check-input"
                                                                            name="radioPriority" type="radio"
                                                                            value="(1) High" checked={PriorityStatus === "(1) High"}

                                                                        />
                                                                        <label className="form-check-label">High</label>
                                                                    </li>
                                                                    <li className="form-check l-radio">
                                                                        <input className="form-check-input" name="radioPriority"
                                                                            type="radio" value="(2) Normal"
                                                                            checked={PriorityStatus === "(2) Normal"}
                                                                        />
                                                                        <label className="form-check-label">Normal</label>
                                                                    </li>
                                                                    <li className="form-check l-radio">
                                                                        <input className="form-check-input" name="radioPriority"
                                                                            type="radio" value="(3) Low"
                                                                            checked={PriorityStatus === "(3) Low"}
                                                                        />
                                                                        <label className="form-check-label">Low</label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="col-12 mb-2">
                                                                <div className="input-group ">
                                                                    <label className="form-label full-width">Client Activity</label>
                                                                    <input type="text" className="form-control" placeholder="Client Activity"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mb-2">
                                                                {ComponentTaskCheck ?
                                                                    <div className="input-group">
                                                                        <label className="form-label full-width">
                                                                            Linked Service
                                                                        </label>
                                                                        {
                                                                            smartServicesData?.length > 0 ? <div>
                                                                                {smartServicesData?.map((com: any) => {
                                                                                    return (
                                                                                        <>
                                                                                            <div className="d-flex block px-2 py-1">

                                                                                                <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                    {com.Title}
                                                                                                </a>

                                                                                                <svg onClick={() => setSmartServicesData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>

                                                                                            </div>
                                                                                        </>
                                                                                    )
                                                                                })}
                                                                            </div> :
                                                                                <input type="text"
                                                                                    className="form-control"
                                                                                />
                                                                        }
                                                                        <span className="input-group-text" onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>

                                                                        </span>
                                                                    </div> : null}
                                                                {ServicesTaskCheck ? <div className="input-group">
                                                                    <label className="form-label full-width">
                                                                        Linked Component
                                                                    </label>
                                                                    {
                                                                        smartComponentData?.length > 0 ? <div>
                                                                            {smartComponentData?.map((com: any) => {
                                                                                return (
                                                                                    <>
                                                                                        <div className="d-flex block px-2 py-1">

                                                                                            <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                {com.Title}
                                                                                            </a>

                                                                                            <svg onClick={() => setSmartComponentData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>

                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                            })}
                                                                        </div> :
                                                                            <input type="text"
                                                                                className="form-control"
                                                                            />
                                                                    }
                                                                    <span className="input-group-text" onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                                    </span>
                                                                </div> : null}

                                                            </div>

                                                            <div className="col-12" title="Relevant Portfolio Items">
                                                                <div className="input-group">
                                                                    <label className="form-label full-width "> Linked Component Task </label>
                                                                    <input type="text"
                                                                        className="form-control "
                                                                        readOnly
                                                                        autoComplete="off" />
                                                                    <span className="input-group-text">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mb-2">
                                                                {ComponentTaskCheck ?
                                                                    <div >
                                                                        <div className="input-group">
                                                                            <label className="form-label full-width">
                                                                                Linked Service
                                                                            </label>
                                                                            <input type="text"
                                                                                className="form-control "
                                                                            />
                                                                            <span className="input-group-text" onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>

                                                                            </span>
                                                                        </div>
                                                                        {
                                                                            smartServicesData?.length > 0 ?
                                                                                <div>
                                                                                    {smartServicesData?.map((com: any) => {
                                                                                        return (
                                                                                            <div>
                                                                                                <div className="d-flex justify-content-between block px-2 py-2 mt-1">
                                                                                                    <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                        {com.Title}
                                                                                                    </a>
                                                                                                    <a>
                                                                                                        <svg onClick={() => setSmartServicesData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>
                                                                                                    </a>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div> :
                                                                                null
                                                                        }

                                                                    </div> : null}
                                                                {ServicesTaskCheck ? <div >
                                                                    <div className="input-group">
                                                                        <label className="form-label full-width">
                                                                            Linked Component
                                                                        </label>
                                                                        <input type="text"
                                                                            className="form-control "
                                                                        />
                                                                        <span className="input-group-text" onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")}>

                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                                        </span>
                                                                    </div>

                                                                    {
                                                                        smartComponentData?.length > 0 ? <div>
                                                                            {smartComponentData?.map((com: any) => {
                                                                                return (
                                                                                    <div>
                                                                                        <div className="d-flex justify-content-between block px-2 py-2 mt-1">
                                                                                            <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                {com.Title}
                                                                                            </a>
                                                                                            <a>
                                                                                                <svg onClick={() => setSmartComponentData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none">
                                                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" />
                                                                                                </svg>
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div> :
                                                                            null
                                                                    }

                                                                </div> : null}

                                                            </div>
                                                            <div className="col-12">
                                                                <div className="input-group">
                                                                    <label className="form-label full-width">
                                                                        Project
                                                                    </label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        placeholder="Search Project Here"
                                                                        value={ProjectSearchKey}
                                                                        onChange={(e) => autoSuggestionsForProject(e)}
                                                                    />
                                                                    {ComponentTaskCheck == false && ServicesTaskCheck == false ? <span className="input-group-text" onClick={(e) => alert("Please select anyone from Portfolio/Services")}> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg></span> : <span className="input-group-text" onClick={() => setProjectManagementPopup(true)} title="Project Items Popup" >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                                                    </span>}
                                                                </div>
                                                                {SearchedProjectData?.length > 0 ? (
                                                                    <div className="SmartTableOnTaskPopup">
                                                                        <ul className="list-group">
                                                                            {SearchedProjectData.map((item: any) => {
                                                                                return (
                                                                                    <li className="hreflink list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectProjectFromAutoSuggestion([item])} >
                                                                                        <a>{item.Title}</a>
                                                                                    </li>
                                                                                )
                                                                            }
                                                                            )}
                                                                        </ul>
                                                                    </div>) : null}
                                                                {selectedProject != undefined && selectedProject.length > 0 ?
                                                                    <div>
                                                                        {selectedProject.map((ProjectData: any) => {
                                                                            return (
                                                                                <div className="block mt-1 px-2 py-2">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <a className="hreflink " target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${ProjectData.Id}`}>
                                                                                            {ProjectData.Title}
                                                                                        </a>

                                                                                        <svg onClick={() => setSelectedProject([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}

                                                                    </div> : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 mb-2">
                                                        <div className="input-group">
                                                            <label className="form-label full-width ">Relevant URL</label>
                                                            <input type="text" className="form-control" defaultValue={EditData.component_x0020_link != null ? EditData.Relevant_Url : ''} placeholder="Url" onChange={(e) => setEditData({ ...EditData, Relevant_Url: e.target.value })}
                                                            />
                                                            <span className={EditData.component_x0020_link != null ? "input-group-text " : "input-group-text Disabled-Link"}>
                                                                <a target="_blank" href={EditData.component_x0020_link != null ? EditData.component_x0020_link.Url : ''} data-interception="off"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3677 13.2672C11.023 13.7134 9.87201 14.4471 8.99831 15.4154C6.25928 18.4508 6.34631 23.1488 9.19578 26.0801C10.6475 27.5735 12.4385 28.3466 14.4466 28.3466H15.4749V27.2499V26.1532H14.8471C12.6381 26.1532 10.4448 24.914 9.60203 23.1898C8.93003 21.8151 8.9251 19.6793 9.5906 18.3208C10.4149 16.6384 11.9076 15.488 13.646 15.1955C14.7953 15.0022 22.5955 14.9933 23.7189 15.184C26.5649 15.6671 28.5593 18.3872 28.258 21.3748C27.9869 24.0644 26.0094 25.839 22.9861 26.1059L21.9635 26.1961V27.2913V28.3866L23.2682 28.3075C27.0127 28.0805 29.7128 25.512 30.295 21.6234C30.8413 17.9725 28.3779 14.1694 24.8492 13.2166C24.1713 13.0335 23.0284 12.9942 18.5838 13.0006C13.785 13.0075 13.0561 13.0388 12.3677 13.2672ZM23.3224 19.8049C18.7512 20.9519 16.3624 26.253 18.4395 30.6405C19.3933 32.6554 20.9948 34.0425 23.1625 34.7311C23.9208 34.9721 24.5664 35 29.3689 35C34.1715 35 34.8171 34.9721 35.5754 34.7311C38.1439 33.9151 39.9013 32.1306 40.6772 29.5502C41 28.4774 41.035 28.1574 40.977 26.806C40.9152 25.3658 40.8763 25.203 40.3137 24.0261C39.0067 21.2919 36.834 19.8097 33.8475 19.6151L32.5427 19.53V20.6267V21.7236L33.5653 21.8132C35.9159 22.0195 37.6393 23.0705 38.4041 24.7641C39.8789 28.0293 38.2035 31.7542 34.8532 32.6588C33.8456 32.9309 25.4951 32.9788 24.1462 32.7205C22.4243 32.3904 21.0539 31.276 20.2416 29.5453C19.8211 28.6492 19.7822 28.448 19.783 27.1768C19.7837 26.0703 19.8454 25.6485 20.0853 25.1039C20.4635 24.2463 21.3756 23.2103 22.1868 22.7175C22.8985 22.2851 24.7121 21.7664 25.5124 21.7664H26.0541V20.6697V19.573L25.102 19.5851C24.5782 19.5919 23.7775 19.6909 23.3224 19.8049Z" fill="#333333" />
                                                                    </svg>
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    {AllListIdData.isShowSiteCompostion ?
                                                        <div className="Sitecomposition">
                                                            <div className='dropdown'>
                                                                <a className="sitebutton bg-fxdark" style={{ cursor: "pointer" }} onClick={() => setComposition(composition ? false : true)}>
                                                                    <span>{composition ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span>Site Composition</span>
                                                                </a>
                                                                {composition ?
                                                                    <div className="mt-1 spxdropdown-menu">
                                                                        <ul>
                                                                            {EditData.siteCompositionData != undefined && EditData.siteCompositionData.length > 0 ?
                                                                                <>
                                                                                    {EditData.siteCompositionData?.map((SiteDtls: any, i: any) => {
                                                                                        return (<li className="Sitelist">
                                                                                            <span className="ms-2">
                                                                                                <img style={{ width: "22px" }} src={SiteDtls.siteIcons} />
                                                                                            </span>

                                                                                            {SiteDtls.ClienTimeDescription != undefined &&
                                                                                                <span className="mx-2">
                                                                                                    {Number(SiteDtls.ClienTimeDescription).toFixed(2)}%
                                                                                                </span>
                                                                                            }
                                                                                        </li>)
                                                                                    })}
                                                                                </> : null
                                                                            }

                                                                        </ul>
                                                                    </div> : null
                                                                }
                                                            </div>
                                                            <div className="bg-e9 border-1 p-2">
                                                                <label className="siteColor">Total Time</label>
                                                                {EditData.Id != null ? <span className="pull-right siteColor"><SmartTotalTime props={EditData} callBack={SmartTotalTimeCallBack} /> h</span> : null}
                                                            </div>

                                                        </div> : null}

                                                    <div className="col mt-2">
                                                        <div className="input-group">
                                                            <label className="form-label full-width">Status</label>
                                                            <input type="text" placeholder="% Complete" className="form-control px-2" disabled={InputFieldDisable}
                                                                defaultValue={PercentCompleteCheck ? (EditData.PercentComplete != undefined ? EditData.PercentComplete : null) : (UpdateTaskInfo.PercentCompleteStatus ? UpdateTaskInfo.PercentCompleteStatus : null)}
                                                                onChange={(e) => StatusAutoSuggestion(e)} />
                                                            <span className="input-group-text" onClick={() => openTaskStatusUpdatePopup(EditData)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 48 48" fill="none">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                                </svg>
                                                            </span>

                                                            {PercentCompleteStatus?.length > 0 ?
                                                                <span className="full-width">
                                                                    <input type='radio' className="my-2" checked />
                                                                    <label className="ps-2">
                                                                        {PercentCompleteStatus}
                                                                    </label>
                                                                </span> : null}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col mt-2 time-status">
                                                            <div>
                                                                <div className="input-group">
                                                                    <label className="form-label full-width ">Time</label>
                                                                    <input type="text" className="form-control" placeholder="Time"
                                                                        defaultValue={EditData.Mileage != null ? EditData.Mileage : ""} />
                                                                </div>
                                                                <ul className="p-0 mt-1">
                                                                    <li className="form-check l-radio">
                                                                        <input name="radioTime" className="form-check-input"
                                                                            checked={EditData.Mileage === '15'} type="radio"
                                                                            onChange={(e) => setEditData({ ...EditData, Mileage: '15' })}
                                                                            defaultChecked={EditData.Mileage == "15" ? true : false}
                                                                        />
                                                                        <label className="form-check-label">Very Quick</label>
                                                                    </li>
                                                                    <li className="form-check l-radio">
                                                                        <input name="radioTime" className="form-check-input"
                                                                            checked={EditData.Mileage === '60'} type="radio"
                                                                            onChange={(e) => setEditData({ ...EditData, Mileage: '60' })}
                                                                            defaultChecked={EditData.Mileage == "60"}
                                                                        />
                                                                        <label className="form-check-label">Quick</label>
                                                                    </li>
                                                                    <li className="form-check l-radio">
                                                                        <input name="radioTime" className="form-check-input"
                                                                            checked={EditData.Mileage === '240'} type="radio"
                                                                            onChange={(e) => setEditData({ ...EditData, Mileage: '240' })}
                                                                            defaultChecked={EditData.Mileage == "240"}
                                                                        />
                                                                        <label className="form-check-label">Medium</label>
                                                                    </li>
                                                                    <li className="form-check l-radio">
                                                                        <input name="radioTime" className="form-check-input"
                                                                            checked={EditData.Mileage === '480'} type="radio"
                                                                            onChange={(e) => setEditData({ ...EditData, Mileage: '480' })}
                                                                            defaultChecked={EditData.Mileage == "480"}
                                                                        />
                                                                        <label className="form-check-label">Long</label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col mt-2">
                                                            <div className="input-group">
                                                                <label className="form-label full-width  mx-2">Working Member</label>
                                                                {EditData.TaskAssignedUsers?.map((userDtl: any, index: any) => {
                                                                    return (
                                                                        <div className="TaskUsers" key={index}>
                                                                            <a
                                                                                target="_blank"
                                                                                data-interception="off"
                                                                                href={`${Items.Items.siteType}/SitePages/TeamLeader-Dashboard.aspx?UserId=${userDtl.AssingedToUserId}&Name=${userDtl.Title}`} >
                                                                                <img ui-draggable="true" data-bs-toggle="tooltip" data-bs-placement="bottom" title={userDtl.Title ? userDtl.Title : ''}
                                                                                    on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                                                                    data-toggle="popover" data-trigger="hover" style={{ width: "35px", height: "35px", marginLeft: "10px", borderRadius: "50px" }}
                                                                                    src={userDtl.Item_x0020_Cover ? userDtl.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                                                />
                                                                            </a>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="full_width ">
                                                        <CommentCard siteUrl={siteUrls} userDisplayName={Items.Items.userDisplayName} listName={Items.Items.siteType} itemID={Items.Items.Id} />
                                                    </div>
                                                    <div className="pull-right">
                                                        <span className="">
                                                            <label className="form-check-label mx-2">Waiting for HHHH response</label>
                                                            <input className="form-check-input rounded-0" type="checkbox"
                                                                checked={EditData.waitForResponse}
                                                                value={EditData.waitForResponse}
                                                                onChange={(e) => changeStatus(e, "waitForResponse")}
                                                            />
                                                        </span>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> : null
                                }
                                <div className="slider-image-section col-sm-6 p-2" style={{
                                    border: "2px solid #ccc"
                                }}>
                                    {
                                        ShowTaskDetailsStatus ? null : <div className="mb-3">
                                            <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => setShowTaskDetailsStatus(ShowTaskDetailsStatus ? false : true)}>
                                                Show task details +
                                            </h6>
                                        </div>
                                    }

                                    <div id="carouselExampleControls" className="carousel slide" data-bs-interval="false">
                                        <div className="carousel-inner">
                                            {TaskImages?.map((imgData: any, index: any) => {
                                                return (
                                                    <div className={index == 0 ? "carousel-item active" : "carousel-item"}>
                                                        <img src={imgData.ImageUrl} className="d-block w-100" alt="..." />
                                                        <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                            <div>
                                                                <span className="mx-1">{imgData.ImageName ? imgData.ImageName.slice(0, 6) : ''}</span>
                                                                <span className="fw-semibold">{imgData.UploadeDate ? imgData.UploadeDate : ''}</span>
                                                                <span className="mx-1">
                                                                    <img style={{ width: "25px" }} src={imgData.UserImage ? imgData.UserImage : ''} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="mx-1"><TbReplace /> |</span>
                                                                <span><RiDeleteBin6Line /></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" data-bs-interval="false">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" data-bs-interval="false">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Upload Image</h6>
                                        <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Add New Image</h6>
                                    </div>
                                </div>
                                <div className="comment-section col-sm-6 p-2" style={{
                                    overflowY: "auto",
                                    height: "600px",
                                    overflowX: "hidden",
                                    border: "2px solid #ccc"
                                }}>
                                    <div>
                                        {EditData.Title != null ? <>
                                            <CommentBoxComponent
                                                data={EditData.FeedBackArray}
                                                callBack={CommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                            />
                                            <Example textItems={EditData.FeedBackArray}
                                                callBack={SubCommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ItemId={EditData.Id}
                                                SiteUrl={EditData.component_x0020_link}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                            />
                                        </>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane " id="IMAGETIMESHEET" role="tabpanel" aria-labelledby="IMAGETIMESHEET">
                            <div>
                                <NewTameSheetComponent props={Items} AllListId={AllListIdData}
                                    TeamConfigDataCallBack={getTeamConfigData}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </Panel>

            {/* ********************** this in hover image modal ****************** */}
            <div className={ServicesTaskCheck ? "hoverImageModal serviepannelgreena" : "hoverImageModal"} style={{ display: hoverImageModal }}>
                <div className="hoverImageModal-popup">
                    <div className="hoverImageModal-container">
                        <span style={{ color: 'white' }}>{HoverImageData[0]?.ImageName}</span>
                        <img className="img-fluid" style={{ width: '100%', height: "450px" }} src={HoverImageData[0]?.ImageUrl}></img>
                    </div>
                    <footer className="justify-content-between d-flex pb-1 mx-2" style={{ color: "white" }}>
                        <span className="mx-1"> Uploaded By :
                            <span className="mx-1">
                                <img style={{ width: "25px", borderRadius: "25px" }} src={HoverImageData[0]?.UserImage ? HoverImageData[0]?.UserImage : ''} />
                            </span>
                            {HoverImageData[0]?.UserName ? HoverImageData[0]?.UserName : ''}
                        </span>
                        <span className="fw-semibold">
                            Uploaded Date : {HoverImageData[0]?.UploadeDate ? HoverImageData[0]?.UploadeDate : ''}
                        </span>
                    </footer>
                </div>
            </div>

            {/* ********************* this is Copy Task And Move Task panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderCopyAndMoveTaskPanel}
                isOpen={CopyAndMoveTaskPopup}
                type={PanelType.custom}
                customWidth="700px"
                onDismiss={closeCopyAndMovePopup}
                isBlocking={CopyAndMoveTaskPopup}
            >
                <div className="modal-body">
                    <div className={ServicesTaskCheck ? " serviepannelgreena" : ""} >
                        <div className="col-md-12 p-3 select-sites-section">
                            <div className="card rounded-0 mb-10">
                                <div className="card-header">
                                    <h6>Sites</h6>
                                </div>
                                <div className="card-body">
                                    <ul className="quick-actions">
                                        {SiteTypes?.map((siteData: any, index: number) => {
                                            if (siteData.Title !== "QA") {
                                                return (
                                                    <li key={siteData.Id} className={`mx-1 p-2 position-relative  text-center  mb-2 ${siteData.BtnStatus ? "selectedSite" : "bg-siteColor"}`}>
                                                        <a className="text-white text-decoration-none" onClick={() => selectSiteTypeFunction(siteData)} style={{ fontSize: "12px" }}>
                                                            <span className="icon-sites">
                                                                <img className="icon-sites" src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} />
                                                            </span> {siteData.Title}
                                                        </a>
                                                    </li>
                                                )
                                            }
                                        })}
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary px-3 float-end" onClick={() => alert("We are working on it. This feature will be live soon .....")}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-default me-1 float-end px-3"
                                        onClick={closeCopyAndMovePopup}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>

            {/* ********************* this is Replace Image panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomReplaceImageHeader}
                isOpen={replaceImagePopup}
                onDismiss={closeReplaceImagePopup}
                isBlocking={replaceImagePopup}
                type={PanelType.custom}
                customWidth="500px"

            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="modal-body">
                        <FlorarImageUploadComponent callBack={FlorarImageReplaceComponentCallBack} />
                    </div>
                    <footer className="float-end mt-1">
                        <button type="button" className="btn btn-primary px-3 mx-1" onClick={UpdateImage} >
                            Update
                        </button>
                        <button type="button" className="btn btn-default px-3" onClick={closeReplaceImagePopup}>
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>

            {/* ********************* this is Project Management Image panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomProjectManagementHeader}
                isOpen={ProjectManagementPopup}
                onDismiss={closeProjectManagementPopup}
                isBlocking={ProjectManagementPopup}
                type={PanelType.custom}
                customWidth="1100px"
                onRenderFooter={customFooterForProjectManagement}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena SelectProjectTable " : 'SelectProjectTable '}>
                    <div className="modal-body wrapper p-0 mt-2">
                        <Table className="SortingTable table table-hover" bordered hover {...getTableProps()}>
                            <thead className="fixed-Header">
                                {headerGroups.map((headerGroup: any) => (
                                    <tr  {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column: any) => (
                                            <th  {...column.getHeaderProps()}>
                                                <span class="Table-SortingIcon" style={{ marginTop: '-6px' }} {...column.getSortByToggleProps()} >
                                                    {column.render('Header')}
                                                    {generateSortingIndicator(column)}
                                                </span>
                                                <Filter column={column} />
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody {...getTableBodyProps()}>
                                {page.map((row: any) => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()}  >
                                            {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            })}
                                        </tr>
                                    )

                                })}
                            </tbody>
                        </Table>
                    </div>

                </div>
            </Panel>

            {/* ********************* this is Approval panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomApproverHeader}
                isOpen={ApproverPopupStatus}
                onDismiss={closeApproverPopup}
                isBlocking={ApproverPopupStatus}
                type={PanelType.medium}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="">
                        <div className='col-sm-12 categScroll' style={{ height: "auto" }}>
                            <input className="form-control my-2" type='text' placeholder="Search Name Here!" value={ApproverSearchKey} onChange={(e) => autoSuggestionsForApprover(e, "OnPanel")} />
                            {ApproverSearchedDataForPopup?.length > 0 ? (
                                <div className="SearchTableCategoryComponent">
                                    <ul className="list-group">
                                        {ApproverSearchedDataForPopup.map((item: any) => {
                                            return (
                                                <li className="hreflink list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectApproverFromAutoSuggestion(item)} >
                                                    <a>{item.NewLabel}</a>
                                                </li>
                                            )
                                        }
                                        )}
                                    </ul>
                                </div>) : null}

                            <div className="border full-width my-2 p-2">
                                {ApproverData?.map((val: any) => {
                                    return (
                                        <>
                                            <span>
                                                <a className="hreflink block p-1 px-2 mx-1" > {val.Title}
                                                    <svg onClick={() => setApproverData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>
                                                </a>
                                            </span>
                                        </>
                                    )
                                })}
                            </div>
                            <ul className="categories-menu p-0">
                                {AllEmployeeData.map(function (item: any) {
                                    return (
                                        <>
                                            <li>
                                                <p className='mb-0 hreflink' >
                                                    <a>
                                                        {item.Title}
                                                    </a>
                                                </p>
                                                <ul className="sub-menu clr mar0">
                                                    {item.Child?.map(function (child1: any) {
                                                        return (
                                                            <>
                                                                {child1.Title != null ?
                                                                    <li>
                                                                        <p onClick={() => selectApproverFunction(child1)} className='mb-0 hreflink'>
                                                                            <a>
                                                                                {child1.Item_x0020_Cover ? <img className="flag_icon"
                                                                                    style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                    src={child1.Item_x0020_Cover ? child1.Item_x0020_Cover.Url : ''} /> :
                                                                                    null}
                                                                                {child1.Title}
                                                                            </a>
                                                                        </p>


                                                                    </li> : null
                                                                }
                                                            </>
                                                        )
                                                    })}
                                                </ul>
                                            </li>
                                        </>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <footer className="float-end mt-1">
                        <button type="button" className="btn btn-primary px-3 mx-1" onClick={UpdateApproverFunction}>
                            Save
                        </button>
                        <button type="button" className="btn btn-default px-3" onClick={closeApproverPopup}>
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>
        </div>
    )
}
export default React.memo(EditTaskPopup);

// How to use this component and require parameters

// step-1 : import this component where you need to use
// step-2 : call this component and pass some parameters follow step:2A and step:2B

// step-2A :
// var Items = {
    // siteUrl:{Enter Site url here},
    // siteType: {Enter Site type here},
    // listId:{Enter Site listId here},
    // ***** OR *****
    // listName:{Enter Site listName here},
    // Context:{Context}
    // AllListIdData: { AllListIdData with site url,  }
    // context:{Page Context}
// }

// step-2B :
// <EditTaskPopup Items={Items} ></EditTaskPopup>
