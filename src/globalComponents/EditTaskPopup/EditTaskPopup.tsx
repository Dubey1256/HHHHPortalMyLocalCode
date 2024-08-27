import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";


// Used libraries imports 
import * as $ from "jquery";
import * as Moment from "moment";
import { Web, sp } from "sp-pnp-js";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { Panel, PanelType } from "office-ui-fabric-react";

// used CSS Imports 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import "bootstrap/js/dist/tab.js";
import "bootstrap/js/dist/carousel.js";
import "react-datepicker/dist/react-datepicker.css";


// Used Icons 

import { LuBellPlus } from "react-icons/lu";
import { FaExpandAlt } from "react-icons/fa";
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import { TbReplace } from "react-icons/tb";
// Used Global Common functions imports

import * as globalCommon from "../globalCommon";
import * as GlobalFunctionForUpdateItems from '../GlobalFunctionForUpdateItems';

// Used Components imports 
import LabelInfoIconToolTip from "../../globalComponents/labelInfoIconToolTip";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import ServiceComponentPortfolioPopup from "./ServiceComponentPortfolioPopup";
import Picker from "./SmartMetaDataPicker";
import Example from "./FroalaCommnetBoxes";
import NewTameSheetComponent from "./NewTimeSheet";
import CommentBoxComponent from "./CommentBoxComponent";
import TimeEntryPopup from "./TimeEntryComponent";
import VersionHistory from "../VersionHistroy/VersionHistory";
import Tooltip from "../Tooltip";
import FlorarImageUploadComponent from "../FlorarComponents/FlorarImageUploadComponent";
import PageLoader from "../pageLoader";
import SmartTotalTime from "./SmartTimeTotal";
import BackgroundCommentComponent from "./BackgroundCommentComponent";
import OnHoldCommentCard from '../Comments/OnHoldCommentCard';
import CentralizedSiteComposition from "../SiteCompositionComponents/CentralizedSiteComposition";
import SmartPriorityHover from "./SmartPriorityHover";
import UXDesignPopupTemplate from "./UXDesignPopupTemplate";
import ReactPopperTooltipSingleLevel from "../Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import RecurringTask from "../RecurringTask";
let UxTaskConfiguration:any=[];
let PortfolioItemColor: any = "";
let taskUsers: any = [];
let AllTaskUser: any = [];
let IsShowFullViewImage: any = false;
let CommentBoxData: any = [];
let SubCommentBoxData: any = [];
let timeSheetData: any = [];
let updateFeedbackArray: any = [];
let BackupTaskCategoriesData: any = [];
let tempCategoryData: any = "";
let SiteTypeBackupArray: any = [];
let currentUserBackupArray: any = [];
let AutoCompleteItemsArray: any = [];
let ValueStatus: any = "";
let SelectedSite: any = "";
let FeedBackBackupArray: any = [];
let SiteId = "";
let ChangeTaskUserStatus: any = true;
let TimeSheetlistId = "";
let newGeneratedId: any = "";
let listName = "";
let isApprovalByStatus = false;
let ApprovalStatusGlobal: any = false;
let ReplaceImageIndex: any;
let ReplaceImageData: any;
let AllProjectBackupArray: any = [];
let EditDataBackup: any;
let AllClientCategoryDataBackup: any = [];
let selectedClientCategoryData: any = [];
let GlobalServiceAndComponentData: any = [];
let AddImageDescriptionsIndex: any;
let LinkedPortfolioDataBackup: any = [];
let userSendAttentionEmails: any = [];
let TempSmartInformationIds: any = [];
let TaskCreatorApproverBackupArray: any = [];
let AllSitesData: any = [];
let TaskApproverBackupArray: any = [];
let onHoldCategory: any = [];
let globalSelectedProject: any = { PriorityRank: 1 };
let oldWorkingAction: any = []
let linkedPortfolioPopup: any;
let portfolioPopup: any;

const EditTaskPopup = (Items: any) => {
    // Task Popup Config Info 
    const Context = Items?.context;
    const AllListIdData = Items?.AllListId;
    AllListIdData.listId = Items?.Items?.listId;

    // Items.Items.Id = Items?.Items?.ID;
    Items.Items.Id =
        Items.Items.Id != undefined ? Items.Items.Id : Items.Items.ID;
    const AllDataSites = Items?.allSitesItems
    const [TaskImages, setTaskImages] = useState([]);
    const [SmartMetaDataAllItems, setSmartMetaDataAllItems] = useState<any>([]);
    const [IsComponentPicker, setIsComponentPicker] = useState(false);
    const [openTeamPortfolioPopup, setOpenTeamPortfolioPopup] = useState(false);
    const [openLinkedPortfolioPopup, setOpenLinkedPortfolioPopup] = useState(false);
    const [TaggedPortfolioData, setTaggedPortfolioData] = useState([]);
    const [linkedPortfolioData, setLinkedPortfolioData] = useState([]);
    const [TaskCategoriesData, setTaskCategoriesData] = useState([]);
    const [AllCategoryData, setAllCategoryData] = useState([]);
    const [SearchedCategoryData, setSearchedCategoryData] = useState([]);
    let [TaskAssignedTo, setTaskAssignedTo] = useState([]);
    let [TaskTeamMembers, setTaskTeamMembers] = useState([]);
    const [sendEmailNotification, setSendEmailNotification] = useState(false);
    let [TaskResponsibleTeam, setTaskResponsibleTeam] = useState([]);
    const [UpdateTaskInfo, setUpdateTaskInfo] = useState({ Title: "", PercentCompleteStatus: "", ComponentLink: "" });
    const [EditData, setEditData] = useState<any>({});
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [SmartMetaDataUsedPanel, setSmartMetaDataUsedPanel] = useState("");
    const [TimeSheetPopup, setTimeSheetPopup] = useState(false);
    const [hoverImageModal, setHoverImageModal] = useState("None");
    const [AddImageDescriptions, setAddImageDescriptions] = useState(false);
    const [AddImageDescriptionsDetails, setAddImageDescriptionsDetails] = useState<any>("");
    const [ImageComparePopup, setImageComparePopup] = useState(false);
    const [CopyAndMoveTaskPopup, setCopyAndMoveTaskPopup] = useState(false);
    const [ImageCustomizePopup, setImageCustomizePopup] = useState(false);
    const [replaceImagePopup, setReplaceImagePopup] = useState(false);
    const [ProjectManagementPopup, setProjectManagementPopup] = useState(false);
    const [compareImageArray, setCompareImageArray] = useState([]);
    const [composition, setComposition] = useState(true);
    const [PercentCompleteStatus, setPercentCompleteStatus] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [PercentCompleteCheck, setPercentCompleteCheck] = useState(true);
    const [EmailStatus, setEmailStatus] = useState(false);
    const [DesignStatus, setDesignStatus] = useState(false);
    const [OnlyCompletedStatus, setOnlyCompletedStatus] = useState(false);
    const [ImmediateStatus, setImmediateStatus] = useState(false);
    const [onHoldPanel, setOnHoldPanel] = useState(false);
    const [ApprovalStatus, setApprovalStatus] = useState(false);
    let [ApproverData, setApproverData] = useState([]);
    const [SmartLightStatus, setSmartLightStatus] = useState(false);
    const [ShowTaskDetailsStatus, setShowTaskDetailsStatus] = useState(false);
    const [currentUserData, setCurrentUserData] = useState([]);
    const [UploadBtnStatus, setUploadBtnStatus] = useState(false);
    const [HoverImageData, setHoverImageData] = useState([]);
    const [SiteTypes, setSiteTypes] = useState([]);
    const [categorySearchKey, setCategorySearchKey] = useState("");
    const [AllProjectData, SetAllProjectData] = useState([]);
    const [selectedProject, setSelectedProject] = useState([]);
    const [SearchedProjectData, setSearchedProjectData] = useState([]);
    const [ProjectSearchKey, setProjectSearchKey] = useState("");
    const [ApproverPopupStatus, setApproverPopupStatus] = useState(false);
    const [ApproverSearchKey, setApproverSearchKey] = useState("");
    const [BottleneckSearchKey, setBottleneckSearchKey] = useState("");
    const [PhoneSearchKey, setPhoneSearchKey] = useState("");
    const [AttentionSearchKey, setAttentionSearchKey] = useState("");
    const [ApproverSearchedData, setApproverSearchedData] = useState([]);
    const [BottleneckSearchedData, setBottleneckSearchedData] = useState([]);
    const [AttentionSearchedData, setAttentionSearchedData] = useState([]);
    const [PhoneSearchedData, setPhoneSearchedData] = useState([]);
    const [ApproverSearchedDataForPopup, setApproverSearchedDataForPopup] = useState([]);
    const [sendEmailStatus, setSendEmailStatus] = useState(false);
    const [sendEmailComponentStatus, setSendEmailComponentStatus] = useState(false);
    const [sendEmailGlobalCount, setSendEmailGlobalCount] = useState(0);
    const [AllEmployeeData, setAllEmployeeData] = useState([]);
    const [ApprovalTaskStatus, setApprovalTaskStatus] = useState(false);
    const [SitesTaggingData, setSitesTaggingData] = useState([]);
    const [selectedClientCategory, setSelectedClientCategory] = useState([]);
    const [AllClientCategoryData, setAllClientCategoryData] = useState([]);
    const [ApproverHistoryData, setApproverHistoryData] = useState([]);
    const [LastUpdateTaskData, setLastUpdateTaskData] = useState<any>({});
    const [SearchedServiceComponentData, setSearchedServiceComponentData] = useState<any>([]);
    const [SearchedLinkedPortfolioData, setSearchedLinkedPortfolioData] = useState<any>([]);
    const [SearchedServiceComponentKey, setSearchedServiceComponentKey] = useState<any>("");
    const [SearchedLinkedPortfolioKey, setSearchedLinkedPortfolioKey] = useState<any>("");
    const [IsUserFromHHHHTeam, setIsUserFromHHHHTeam] = useState(false);
    const [IsCopyOrMovePanel, setIsCopyOrMovePanel] = useState<any>("");
    const [EstimatedDescription, setEstimatedDescription] = useState("");
    const [EstimatedDescriptionCategory, setEstimatedDescriptionCategory] = useState("");
    const [EstimatedTime, setEstimatedTime] = useState<any>("");
    const [TotalEstimatedTime, setTotalEstimatedTime] = useState(0);
    const [SiteCompositionShow, setSiteCompositionShow] = useState(false);
    const [IsTaskStatusUpdated, setIsTaskStatusUpdated] = useState(false);
    const [IsTaskCategoryUpdated, setIsTaskCategoryUpdated] = useState(false);
    const [SendCategoryName, setSendCategoryName] = useState("");
    const [TeamMemberChanged, setTeamMemberChanged] = useState(false);
    const [TeamLeaderChanged, setTeamLeaderChanged] = useState(false);
    const [SendMsgToAuthor, setSendMsgToAuthor] = useState(false);
    const [CurrentImageIndex, setCurrentImageIndex] = useState("");
    const [loaded, setLoaded] = useState(true);
    const [IsImageUploaded, setIsImageUploaded] = useState(true);
    const [WorkingAction, setWorkingAction] = useState([]);
    const [AddDescriptionModelName, setAddDescriptionModelName] = useState("");
    const [useFor, setUseFor] = useState("")
    const [TaskNotificationConfigurationJSON, setTaskNotificationConfigurationJSON] = useState([]);
    let [WorkingActionDefaultUsers, setWorkingActionDefaultUsers] = useState([]);
    const [DesignNewTemplates, setDesignNewTemplates] = useState(false);
    const [ShowPencilIcon, setShowPencilIcon] = useState(false);
    // Edit Task Popup Local Scope Variables 
    let SiteWebConfigData: any = [];
    let FeedBackCount: any = 0;
    let ImageIndexCount: any = 0;

    let [StatusOptions, setStatusOptions] = useState([
        { value: 0, status: "0% Not Started", taskStatusComment: "Not Started" },
        { value: 1, status: "1% For Approval", taskStatusComment: "For Approval" },
        { value: 2, status: "2% Follow Up", taskStatusComment: "Follow Up" },
        { value: 3, status: "3% Approved", taskStatusComment: "Approved" },
        { value: 4, status: "4% Checking", taskStatusComment: "Checking" },
        { value: 5, status: "5% Acknowledged", taskStatusComment: "Acknowledged" },
        { value: 8, status: "8% Priority Check", taskStatusComment: "Priority Check" },
        { value: 9, status: "9% Ready To Go", taskStatusComment: "Ready To Go" },
        { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
        { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
        { value: 75, status: "75% Deployment Pending", taskStatusComment: "Deployment Pending" },
        { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
        { value: 90, status: "90% Task completed", taskStatusComment: "Task completed" },
        { value: 100, status: "100% Closed", taskStatusComment: "Closed" },
    ]);
    let ItemRankArray = [
        { rankTitle: "Select Item Rank", rank: null },
        { rankTitle: "(8) Top Highlights", rank: 8 },
        { rankTitle: "(7) Featured Item", rank: 7 },
        { rankTitle: "(6) Key Item", rank: 6 },
        { rankTitle: "(5) Relevant Item", rank: 5 },
        { rankTitle: "(4) Background Item", rank: 4 },
        { rankTitle: "(2) to be verified", rank: 2 },
        { rankTitle: "(1) Archive", rank: 1 },
        { rankTitle: "(0) No Show", rank: 0 },
    ];

    //  ************** This is used for handling Site Url for Different Cases ********************

    let siteUrls: any;
    if (Items != undefined && Items.Items.siteUrl != undefined && Items.Items.siteUrl.length < 20) {
        if (Items.Items.siteType != undefined) {
            siteUrls = `https://hhhhteams.sharepoint.com/sites/${Items.Items.siteType}${Items.Items.siteUrl}`;
        } else {
            siteUrls = AllListIdData.siteUrl;
        }
    } else {
        if (Items.Items.siteUrl != undefined && Items.Items.siteUrl.length > 15) {
            siteUrls = Items.Items.siteUrl;
        } else {
            siteUrls = AllListIdData.siteUrl;
        }
    }

    // This is maine useEffect  

    useEffect(() => {
        if (FeedBackCount == 0) {
            getTaskNotificationConfiguration();
            loadTaskUsers();
            GetExtraLookupColumnData();
            SmartMetaDataListInformation();
            GetAllComponentAndServiceData("Component");
            AddImageDescriptionsIndex = undefined;
            if (Items.Items.siteType == "Offshore Tasks") {
                Items.Items.siteType = "Offshore%20Tasks";
            }
        }

    }, [FeedBackCount]);

    // this useEffect is used for changing the panel color according to portfolio type 
    useEffect(() => {
        setTimeout(() => {
            const panelMain: any = document.querySelector(".ms-Panel-main");
            if (panelMain && PortfolioItemColor != "") {
                $(".ms-Panel-main").css("--SiteBlue", PortfolioItemColor);
            }
        }, 1000);
    }, [
        IsComponentPicker,
        openLinkedPortfolioPopup,
        openTeamPortfolioPopup,
        ImageComparePopup,
        modalIsOpen,
        TimeSheetPopup,
        ApproverPopupStatus,
        ProjectManagementPopup,
        replaceImagePopup,
        CopyAndMoveTaskPopup,
        AddImageDescriptions,
        ImageCustomizePopup,
        SmartMetaDataUsedPanel?.length,
    ]);

    // This is used for loading current task Time Sheet Data 
    const loadTime = async () => {
        let SiteId = "Task" + Items?.Items?.siteType?.split("%20")?.join("");
        let web = new Web(siteUrls);
        const TimeEntry = await web.lists
            .getByTitle("TaskTimeSheetListNew")
            .items.select(
                `${SiteId}/Id, Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title`
            )
            .expand(`${SiteId},Editor,Author,Category,TimesheetTitle`)
            .filter(`${SiteId}/Id eq '${Items?.Items?.Id}'`)
            .get();

        console.log(TimeEntry);
        TimeEntry?.forEach((item: any) => {
            if (
                item.AdditionalTimeEntry != undefined &&
                item.AdditionalTimeEntry != ""
            ) {
                timeSheetData.push(item);
            }
        });
    };

    // **************************  This is for Loading All Task Users From Back End Call Functions And validations ****************************

    const loadTaskUsers = async () => {
        let AllTaskUsers: any = [];
        let currentUserId = Context?.pageContext?._legacyPageContext?.userId;
        const web = new Web(siteUrls);
        taskUsers = await web.lists
            .getById(AllListIdData?.TaskUserListID)
            .items.select(
                "Id,UserGroupId,TimeCategory,CategoriesItemsJson,IsActive,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name,UserGroup/Id,UserGroup/Title"
            )
            .filter("IsActive eq 1")
            .expand("AssingedToUser,Approver,UserGroup")
            .orderBy("SortOrder", true)
            .orderBy("Title", true)
            .getAll();
        getAllEmployeeData();
        taskUsers?.map((user: any, index: any) => {
            let ApproverUserItem = "";
            let UserApproverMail: any = [];
            if (user.Title != undefined && user.IsShowTeamLeader === true) {
                if (user.Approver != undefined) {
                    $.each(user.Approver.results, function (ApproverUser: any, index) {
                        ApproverUserItem +=
                            ApproverUser.Title +
                            (index === user.Approver.results?.length - 1 ? "" : ",");
                        UserApproverMail.push(ApproverUser.Name.split("|")[2]);
                    });
                    user["UserManagerName"] = ApproverUserItem;
                    user["UserManagerMail"] = UserApproverMail;
                }
                AllTaskUsers.push(user);
            }
            AllTaskUser = taskUsers;
            if (user.AssingedToUserId == currentUserId) {
                let temp: any = [];
                temp.push(user);
                setCurrentUserData(temp);
                user.UserImage =
                    user.Item_x0020_Cover?.Url?.length > 0
                        ? user.Item_x0020_Cover?.Url
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                    currentUserBackupArray.push(user);
                if (user.Company == "HHHH") {
                    setIsUserFromHHHHTeam(true);
                }
            }
        });

    };

    // ********** this is for Getting All  Employees Data For Approval Function and Approval Popup  *******************

    const getAllEmployeeData = () => {
        let UsersData: any = [];
        let Groups: any = [];
        let MainArray: any = [];
        let sortedTaskUser = taskUsers?.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
        sortedTaskUser.map((EmpData: any) => {
            if (EmpData.ItemType == "Group") {
                EmpData.Child = [];
                Groups.push(EmpData);
                MainArray.push(EmpData);
            }
            if (EmpData.ItemType == "User") {
                UsersData.push(EmpData);
            }
        });
        if (UsersData.length > 0 && Groups.length > 0) {
            Groups.map((groupData: any) => {
                UsersData.map((userData: any) => {
                    if (groupData.Id == userData.UserGroupId) {
                        userData.NewLabel = groupData.Title + " > " + userData.Title;
                        groupData.Child.push(userData);
                    }
                });
            });
        }
        setAllEmployeeData(Groups);
    };



    // This is used for getting the all information data from Task Notification Management tool 

    const getTaskNotificationConfiguration = async () => {
        try {
            const web = new Web(siteUrls)
            let ResponseData: any = await web.lists.getByTitle('NotificationsConfigration').items.select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,Recipients/Id,Recipients/Title,ConfigType,ConfigrationJSON,Subject,PortfolioType/Id,PortfolioType/Title').expand('Author,Editor,Recipients ,PortfolioType').get();
            if (ResponseData?.length > 0) {
                setTaskNotificationConfigurationJSON(ResponseData);
                console.log("Task Notification Configuration ResponseData =================== :", ResponseData);
                let workingActionUsers: any = [];
                ResponseData?.map((TNMItem: any) => {
                    if (TNMItem?.Title == "workingAction") {
                        workingActionUsers = TNMItem?.Recipients;
                    }
                })
                WorkingActionDefaultUsers = workingActionUsers;

            }
        } catch (error) {
            console.log("Error in getTaskNotificationConfiguration function : ", error.message);
        }
    }


    // This is used for getting the information form smart meta data list 

    const SmartMetaDataListInformation = async () => {
        let AllSmartDataListData: any = [];
        let AllClientCategoryData: any = [];
        let AllCategoriesData: any = [];
        let AllTimesheetCategoriesData: any = [];
        let AllStatusData: any = [];
        let AllPriorityData: any = [];
        let AllPriorityRankData: any = [];
        let CategoriesGroupByData: any = [];
        let tempArray: any = [];
        let TempTimeSheetCategoryArray: any = [];
        try {
            let web = new Web(siteUrls);
            AllSmartDataListData = await web.lists
                .getById(AllListIdData.SmartMetadataListID)
                .items.select(
                    "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail"
                )
                .expand("Author,Editor,IsSendAttentionEmail")
                .getAll();

            if (AllSmartDataListData?.length > 0) {
                AllSmartDataListData?.map((SmartItemData: any, index: any) => {
                    SmartItemData.childs = []
                    if (SmartItemData.TaxType == "Client Category") {
                        if (
                            SmartItemData.Title?.toLowerCase() == "pse" &&
                            SmartItemData.TaxType == "Client Category"
                        ) {
                            SmartItemData.newTitle = "EPS";
                        } else if (
                            SmartItemData.Title?.toLowerCase() == "e+i" &&
                            SmartItemData.TaxType == "Client Category"
                        ) {
                            SmartItemData.newTitle = "EI";
                        } else if (
                            SmartItemData.Title?.toLowerCase() == "education" &&
                            SmartItemData.TaxType == "Client Category"
                        ) {
                            SmartItemData.newTitle = "Education";
                        } else {
                            SmartItemData.newTitle = SmartItemData.Title;
                        }
                    }
                    else if(SmartItemData?.TaxType == "UxTaskConfiguration"){
                       let  CopyUxTaskConfiguration :any=  JSON.parse(SmartItemData?.Configurations)
                       UxTaskConfiguration.push(...CopyUxTaskConfiguration)
                    } 
                    
                    else {
                        SmartItemData.newTitle = SmartItemData.Title;
                    }
                });
            }
            AllSitesData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Sites"
            );
            AllClientCategoryData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Client Category"
            );
            AllCategoriesData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Categories"
            );
            AllTimesheetCategoriesData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "TimesheetCategories"
            );
            AllStatusData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Status"
            );
            AllPriorityData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Priority"
            );
            AllPriorityRankData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Priority Rank"
            );

            // ########## this is for All Site Data related validations ################
            AllSitesData?.map((site: any) => {
                if (site.Title !== undefined && site.Title !== "Foundation" && site.Title !== "Master Tasks" && site.Title !== "DRR" && site.Title !== "SDC Sites") {
                    site.BtnStatus = false;
                    site.isSelected = false;
                    tempArray.push(site);
                }
                if (site.Title !== undefined && site.Title == "Shareweb") {
                    SiteWebConfigData = site.Configurations;
                }
            });
            setSiteTypes(tempArray);
            tempArray?.map((tempData: any) => {
                SiteTypeBackupArray.push(tempData);
            });

            // ########## this is for All Client Category related validations ################
            if (AllClientCategoryData?.length > 0) {
                setAllClientCategoryData(AllClientCategoryData);
                BuildClientCategoryAllDataArray(AllClientCategoryData);
            }
            // ########## this is for All Categories related validations ################
            if (AllCategoriesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(
                    AllCategoriesData,
                    "Categories"
                );
                if (AllCategoriesData?.length > 0) {
                    // This is used for prepare Auto Suggestions data for task Categories 
                    AutoCompleteItemsArray = GlobalFunctionForUpdateItems?.prepareGroupByDataForCategories(AllCategoriesData).reduce((acc: any[], current: any) => {
                        if (!acc.some(item => item.Title === current.Title)) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    console.log("flat view categories data ===", AutoCompleteItemsArray)
                }
                // ############## this is used for flittering time sheet category data from smartMetaData list ##########
                if (AllTimesheetCategoriesData?.length > 0) {
                    AllTimesheetCategoriesData = AllTimesheetCategoriesData.map(
                        (TimeSheetCategory: any) => {
                            if (TimeSheetCategory?.TaxType == "TimesheetCategories" && TimeSheetCategory.ParentId == 303) {
                                TempTimeSheetCategoryArray.push(TimeSheetCategory);
                            }
                        }
                    );
                }
                setAllCategoryData(AutoCompleteItemsArray);
                let AllSmartMetaDataGroupBy: any = {
                    TimeSheetCategory: GlobalFunctionForUpdateItems.removeDuplicates(TempTimeSheetCategoryArray, "Id"),
                    Categories: GlobalFunctionForUpdateItems.removeDuplicates(AutoCompleteItemsArray, "Id"),
                    Sites: GlobalFunctionForUpdateItems.removeDuplicates(tempArray, "Id"),
                    Status: GlobalFunctionForUpdateItems.removeDuplicates(AllStatusData, "Id"),
                    Priority: GlobalFunctionForUpdateItems.removeDuplicates(AllPriorityData, "Id"),
                    PriorityRank: GlobalFunctionForUpdateItems.removeDuplicates(AllPriorityRankData, "Id"),
                    ClientCategory: GlobalFunctionForUpdateItems.removeDuplicates(AllClientCategoryData, "Id")
                };
                setSmartMetaDataAllItems(AllSmartMetaDataGroupBy);
            }
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };


    // This is used fro getting the smart meta data list data according to taxType

    const getSmartMetadataItemsByTaxType = function (
        metadataItems: any,
        taxType: any
    ) {
        let Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType) Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    };


    // This is used for prepare client categories data group by and flatten view 

    const BuildClientCategoryAllDataArray = (DataItem: any) => {
        const buildHierarchy = (items: any, parentId = 0, parentTitle = '') => {
            return items
                .filter((item: any) => item.ParentID === parentId)
                .map((item: any) => {
                    item.siteName = parentTitle || item.newTitle;
                    item.Child = buildHierarchy(items, item.Id, item.siteName);
                    return item;
                });
        };

        const flattenHierarchy = (items: any, result: any = []) => {
            items.forEach((item: any) => {
                result.push(item);
                if (item.Child && item.Child.length > 0) {
                    flattenHierarchy(item.Child, result);
                }
            });
            return result;
        };

        if (DataItem && DataItem.length > 0) {
            const MainParentArray = buildHierarchy(DataItem);
            AllClientCategoryDataBackup = flattenHierarchy(MainParentArray);
        }
    };

    //  ######################  This is Smart Category Get Data Call From Backend and Build Nested Array According to Parent Child Categories #######################

    const loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any, SmartTaxonomy: any) => {
        try {
            const TaxonomyItems = AllTaxonomyItems?.filter((item: any) => item.ParentID === 0 && item.TaxType === SmartTaxonomy);
            TaxonomyItems.forEach((item: any) => getChild(item, AllTaxonomyItems));
            const uniqueNames = GlobalFunctionForUpdateItems?.removeDuplicates(TaxonomyItems, "Id");
            return uniqueNames;
        } catch (error) {
            console.log("Error in loadSmartTaxonomyPortfolioPopup function :", error)
        }
    };


    // this is a recursion function used to prepared group by data for smart meta data items 

    const getChild = (item: any, items: any) => {
        items.forEach((childItem: any) => {
            if (childItem.ParentID !== undefined && parseInt(childItem.ParentID) === item.ID) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChild(childItem, items);
            }
        });
    };

    // ************************** This is the Fetch All Data for the selected Task and related to Task from Backend *******************************

    // #################### this is used for getting more the 12 lookup column data for selected task from Backend ##############################

    const GetExtraLookupColumnData = async () => {
        try {
            let web = new Web(siteUrls);
            let extraLookupColumnData: any;
            if (Items.Items.listId != undefined) {
                extraLookupColumnData = await web.lists
                    .getById(Items.Items.listId)
                    .items.select(
                        "Project/Id, Project/Title,Project/PriorityRank,SmartInformation/Id, AttachmentFiles, Approver/Id, Approver/Title,ApproverHistory"
                    )
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand("Project, Approver,SmartInformation,AttachmentFiles")
                    .get();
            } else {
                extraLookupColumnData = await web.lists
                    .getByTitle(Items.Items.listName)
                    .items.select(
                        "Project/Id, Project/Title,SmartInformation/Id, AttachmentFiles/Title, Approver/Id, Approver/Title, ClientCategory/Id,ClientCategory/Title, ApproverHistory"
                    )
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand("Project, Approver, ClientCategory,SmartInformation")
                    .get();
            }

            if (extraLookupColumnData.length > 0) {
                let Data: any;
                let ApproverData: any;
                let ApproverHistoryData: any;
                Data = extraLookupColumnData[0]?.Project;
                ApproverHistoryData = extraLookupColumnData[0]?.ApproverHistory;
                ApproverData = extraLookupColumnData[0]?.Approver;
                if (Data != undefined && Data != null) {
                    let TempArray: any = [];
                    AllProjectBackupArray.map((ProjectData: any) => {
                        if (ProjectData.Id == Data.Id) {
                            ProjectData.Checked = true;
                            setSelectedProject([ProjectData]);
                            TempArray.push(ProjectData);
                        } else {
                            ProjectData.Checked = false;
                            TempArray.push(ProjectData);
                        }
                    });
                    setSelectedProject([Data]);
                    globalSelectedProject = Data;
                    SetAllProjectData(TempArray);
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
                    if (
                        ApproverHistoryData == undefined ||
                        ApproverHistoryData == null
                    ) {
                        ApproverData.map((itemData: any) => {
                            let tempObject: any = {
                                ApproverName: itemData.Title,
                                ApprovedDate: Moment(new Date())
                                    .tz("Europe/Berlin")
                                    .format("DD MMM YYYY HH:mm"),
                                ApproverId: itemData.AssingedToUserId,
                                ApproverImage:
                                    itemData.Item_x0020_Cover != undefined ||
                                        itemData.Item_x0020_Cover != null
                                        ? itemData.Item_x0020_Cover.Url
                                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                                ApproverSuffix: itemData.Suffix,
                                ApproverEmail: itemData.Email,
                            };
                            TempApproverHistory = [tempObject];
                        });
                    }
                    if (
                        TempApproverHistory != undefined &&
                        TempApproverHistory.length > 0
                    ) {
                        setApproverHistoryData(TempApproverHistory);
                    }
                }
                if (extraLookupColumnData[0]?.SmartInformation?.length > 0) {
                    extraLookupColumnData[0]?.SmartInformation?.map(
                        (smartInfo: any) => {
                            TempSmartInformationIds.push(smartInfo.Id);
                        }
                    );
                }
            }
            GetSelectedItemDetails();
        } catch (error) {
            console.log("Error in GetExtraLookupColumnData function:", error.message);
        }
    };


    // This is used for getting the Lookup List Id for any list which have lookups 

    const getLookUpColumnListId = async (siteUrl: any, ParentListId: any, lookupColumnName: any, ComponentType: any, usedFor: any) => {
        let LookUpListID: any;
        const web = new Web(siteUrl);
        try {
            await Promise.all([
                await web.lists
                    .getById(ParentListId)
                    .fields.get()
                    .then((listInfo: any) => {
                        const lookupColumn = listInfo.find(
                            (field: any) => field.InternalName === lookupColumnName
                        );
                        if (lookupColumn) {
                            LookUpListID = lookupColumn?.LookupList?.replace(/[{}]/g, "");
                            if (LookUpListID?.length > 0) {
                                GetTaskStatusOptionData(LookUpListID, ComponentType, usedFor);
                            }
                        } else {
                            console.log("Lookup column not found in the list");
                        }
                    })
                    .catch((error: any) => {
                        console.log("Error: " + error);
                    }),
            ]);
        } catch (error) {
            console.log("error in getLookUpColumnListId function:", error.message);
        }
    };

    // #################### this is used for getting All Information for selected task from Backend ##############################

    const GetSelectedItemDetails = async () => {
        let ApproverDataId = "";
        try {
            let web = new Web(siteUrls);
            let smartMeta: any;
            if (Items.Items.listId != undefined) {
                smartMeta = await web.lists
                    .getById(Items.Items.listId)
                    .items.select(
                        "Id,Title,PriorityRank,Comments,TotalTime,workingThisWeek,WorkingAction,Approvee/Id,Approvee/Title,EstimatedTime,EstimatedTimeDescription,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,Sitestagging,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,ComponentLink,RelevantPortfolio/Title,RelevantPortfolio/Id,Portfolio/Title,Portfolio/Id,Portfolio/PortfolioStructureID,PercentComplete,Categories,TaskLevel,TaskLevel,ClientActivity,ClientActivityJson,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title, ParentTask/TaskID,ParentTask/Id,TaskID"
                    )
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand(
                        "AssignedTo,Author,ParentTask,Editor,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory,RelevantPortfolio,Approvee"
                    )
                    .get();
            } else {
                smartMeta = await web.lists
                    .getByTitle(Items.Items.listName)
                    .items.select(
                        "Id,Title,PriorityRank,Comments,workingThisWeek,WorkingAction,Approvee/Id,Approvee/Title,EstimatedTime,EstimatedTimeDescription,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,Sitestagging,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,ComponentLink,RelevantPortfolio/Title,RelevantPortfolio/Id,Portfolio/Title,Portfolio/Id,Portfolio/PortfolioStructureID,PercentComplete,Categories,TaskLevel,TaskLevel,ClientActivity,ClientActivityJson,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title, ParentTask/TaskID,ParentTask/Id,TaskID"
                    )
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand(
                        "AssignedTo,Author,ParentTask,Editor,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,Approvee,ClientCategory,RelevantPortfolio"
                    )
                    .get();
            }
            let statusValue: any;
            smartMeta?.map((item: any) => {
                let saveImage = [];
                if (item?.WorkingAction?.length > 0) {
                    let WorkingActionData: any = JSON.parse(item.WorkingAction);
                    oldWorkingAction = []
                    oldWorkingAction = [...WorkingActionData]
                    WorkingActionData?.map((WAItemData: any) => {
                        if (WAItemData.Title == "Approval" && WAItemData.InformationData?.length > 0) {
                            setApprovalStatus(true);
                        }
                    })
                    setWorkingAction(WorkingActionData);
                }
                if (item.Categories != null) {

                }
                if (item.TaskCategories?.length > 0) {
                    setEmailStatus(item.TaskCategories?.some((category: any) => category.Title === "Email Notification"));
                    setImmediateStatus(item.TaskCategories?.some((category: any) => category.Title === "Immediate"));
                    setOnlyCompletedStatus(item.TaskCategories?.some((category: any) => category.Title === "Only Completed"));
                    setDesignStatus(item.TaskCategories?.some((category: any) => category.Title === "Design" || category.Title === "User Experience - UX"));
                    setDesignNewTemplates(item.TaskCategories?.some((category: any) =>UxTaskConfiguration.some((config:any)=>category.Title ===config?.Title ) ))

                }
                if (item.Portfolio != undefined && item.Portfolio?.Title != undefined) {
                    let PortfolioId: any = item.Portfolio.Id;
                    GetPortfolioSiteComposition(PortfolioId, item);
                }

                let ClientCategory = item?.ClientCategory;
                if (ClientCategory != undefined && ClientCategory.length > 0) {
                    let selectedCC: any = [];
                    ClientCategory.map((ClientData: any) => {
                        if (
                            AllClientCategoryDataBackup != undefined &&
                            AllClientCategoryDataBackup.length > 0
                        ) {
                            AllClientCategoryDataBackup.map((clientCategoryData: any) => {
                                if (ClientData.Id == clientCategoryData.ID) {
                                    ClientData.siteName = clientCategoryData.siteName;
                                    ClientData.ParentID = clientCategoryData.ParentID;
                                    selectedCC.push(ClientData);
                                }
                            });
                        }
                    });
                    setSelectedClientCategory(selectedCC);
                    selectedClientCategoryData = selectedCC;
                }

                if (item.Sitestagging != null && item.Sitestagging != undefined) {
                    let tempData: any = [];
                    tempData = JSON.parse(item.Sitestagging);
                    let tempArray3: any = [];
                    if (tempData != undefined && tempData.length > 0) {
                        tempData.map((siteData: any) => {
                            siteData.ClientCategory = [];
                            if (
                                selectedClientCategoryData != undefined &&
                                selectedClientCategoryData.length > 0
                            ) {
                                selectedClientCategoryData.map((ClientCategoryData: any) => {
                                    if (ClientCategoryData.siteName == siteData.Title) {
                                        siteData.ClientCategory.push(ClientCategoryData);
                                    }
                                });
                                tempArray3.push(siteData);
                            } else {
                                tempArray3.push(siteData);
                            }
                        });
                    }
                    setSitesTaggingData(tempArray3);
                    item.siteCompositionData = tempArray3;
                } else {
                    const object: any = {
                        ClienTimeDescription: "100",
                        Title: Items?.Items?.siteType,
                        localSiteComposition: true,
                        SiteImages: Items?.Items?.SiteIcon,
                        Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                    };
                    item.siteCompositionData = [object];
                    setSitesTaggingData([object]);
                }
                if (item.Body != undefined) {
                    item.Body = item?.Body?.replace(/(<([^>]+)>)/gi, "");
                }
                if (item.BasicImageInfo != null && item.Attachments) {
                    saveImage.push(JSON.parse(item.BasicImageInfo));
                }
                if (
                    item.PriorityRank == undefined ||
                    item.PriorityRank == null ||
                    item.PriorityRank == 0
                ) {
                    if (item.Priority != undefined) {
                        if (item.Priority == "(3) Low") {
                            item.PriorityRank = 1;
                        }
                        if (item.Priority == "(2) Normal") {
                            item.PriorityRank = 4;
                        }
                        if (item.Priority == "(1) High") {
                            item.PriorityRank = 8;
                        }
                    }
                }
                item.TaskId = globalCommon.GetTaskId(item);
                item.TaskID = globalCommon.GetTaskId(item);
                Items.Items.TotalTime = item?.TotalTime;
                item.siteUrl = siteUrls;
                item.siteType = Items?.Items?.siteType;
                item.SiteIcon = Items?.Items?.SiteIcon;
                let AssignedUsers: any = [];
                item.listId = Items.Items.listId;
                if (globalSelectedProject?.Id != undefined) {
                    item.Project = globalSelectedProject;
                }
                item.SmartPriority;
                item.TaskTypeValue = '';
                item.projectPriorityOnHover = '';
                item.taskPriorityOnHover = item?.PriorityRank;
                item.showFormulaOnHover;
                item.SmartPriority = globalCommon?.calculateSmartPriority(item);
                // let ApproverDataTemp: any = [];
                let TeamMemberTemp: any = [];
                let TaskCreatorData: any = [];

                if (StatusOptions?.length > 0) {
                    if (item.PercentComplete != undefined) {
                        statusValue = item.PercentComplete * 100;
                        item.PercentComplete = statusValue;
                        if (
                            (statusValue < 70 && statusValue > 10) ||
                            (statusValue < 80 && statusValue > 70 && statusValue !== 75)
                        ) {
                            setTaskStatus("In Progress");
                            setPercentCompleteStatus(
                                `${Number(statusValue).toFixed(0)}% In Progress`
                            );
                            setUpdateTaskInfo({
                                ...UpdateTaskInfo,
                                PercentCompleteStatus: `${statusValue}`,
                            });
                        } else {
                            StatusOptions?.map((statusItem: any) => {
                                if (statusValue == statusItem?.value) {
                                    setPercentCompleteStatus(statusItem?.status);
                                    setTaskStatus(statusItem?.taskStatusComment);
                                }
                            });
                        }
                        if (statusValue <= 2 && ApprovalStatusGlobal) {
                            ChangeTaskUserStatus = false;
                        } else {
                            ChangeTaskUserStatus = true;
                        }
                    }
                }

                if (item.Author != undefined && item.Author != null) {
                    taskUsers?.map((userData: any) => {
                        if (item.Author?.Id == userData?.AssingedToUserId) {
                            TaskCreatorData?.push(userData);
                            userData.Approver?.map((AData: any) => {
                                // ApproverDataTemp.push(AData);
                                TaskCreatorApproverBackupArray.push(AData);
                            });
                        }
                    });
                    if (statusValue <= 2 && ApprovalStatusGlobal) {
                        let tempArray: any = [];
                        const TaskApproverBackupTemp = TaskApproverBackupArray?.filter(
                            (val: any, id: any, array: any) => {
                                return array?.indexOf(val) == id;
                            }
                        );
                        const TaskCreatorApproverBackupTemp =
                            TaskCreatorApproverBackupArray?.filter(
                                (val: any, id: any, array: any) => {
                                    return array?.indexOf(val) == id;
                                }
                            );

                        if (
                            TaskApproverBackupTemp != undefined &&
                            TaskApproverBackupTemp.length > 0
                        ) {
                            taskUsers.map((userData1: any) => {
                                TaskApproverBackupTemp.map((itemData: any) => {
                                    if (itemData.Id == userData1?.AssingedToUserId) {
                                        AssignedUsers.push(userData1);
                                        TeamMemberTemp.push(userData1);
                                        tempArray.push(userData1);
                                    }
                                });
                            });
                        } else {
                            if (TaskCreatorApproverBackupTemp?.length > 0) {
                                taskUsers.map((userData1: any) => {
                                    TaskCreatorApproverBackupTemp?.map((itemData: any) => {
                                        if (itemData.Id == userData1?.AssingedToUserId) {
                                            AssignedUsers.push(userData1);
                                            TeamMemberTemp.push(userData1);
                                            tempArray.push(userData1);
                                        }
                                    });
                                });
                            }
                        }
                        if (tempArray != undefined && tempArray.length > 0) {
                            tempArray.map((itemData: any) => {
                                itemData.Id = itemData.AssingedToUserId;
                            });
                            setApproverData(tempArray);
                            if (statusValue <= 1 && ApprovalStatusGlobal) {
                                StatusOptions?.map((item: any) => {
                                    if (1 == item.value) {
                                        setPercentCompleteStatus(item.status);
                                        setTaskStatus(item.taskStatusComment);
                                        setUpdateTaskInfo({
                                            ...UpdateTaskInfo,
                                            PercentCompleteStatus: `1`,
                                        });
                                        setPercentCompleteCheck(false);
                                    }
                                });
                            }
                        }
                    } else {
                        taskUsers?.map((userData: any) => {
                            item.AssignedTo?.map((AssignedUser: any) => {
                                if (userData?.AssingedToUserId == AssignedUser.Id) {
                                    AssignedUsers.push(userData);
                                }
                            });
                        });
                    }
                }
                item.TaskCreatorData = TaskCreatorData;
                if (
                    TaskApproverBackupArray != undefined &&
                    TaskApproverBackupArray.length > 0
                ) {
                    TaskApproverBackupArray.map((itemData: any) => {
                        currentUserBackupArray?.map((currentUser: any) => {
                            taskUsers?.map((userData: any) => {
                                if (userData?.AssingedToUserId == itemData.Id)
                                    try {
                                        if (userData?.Approver?.length > 0) {
                                            ApproverDataId = userData?.Approver[0]?.Id;
                                        }
                                    }
                                    catch (error) {
                                        console.log("Error :", error.message);
                                    }
                            });
                            if (
                                itemData.Id == currentUser.AssingedToUserId ||
                                currentUser.AssingedToUserId == ApproverDataId
                            ) {
                                setSmartLightStatus(true);
                            }
                        });
                    });
                } else {
                    if (TaskCreatorApproverBackupArray?.length > 0) {
                        TaskCreatorApproverBackupArray?.map((Approver: any) => {
                            currentUserBackupArray?.map((current: any) => {
                                taskUsers?.map((userData: any) => {
                                    if (userData?.AssingedToUserId == Approver?.Id) {
                                        if (userData?.Approver?.length > 0) {
                                            ApproverDataId = userData?.Approver[0].Id;
                                        }
                                    }
                                });
                                if (
                                    Approver.Id == current.AssingedToUserId ||
                                    current.AssingedToUserId == ApproverDataId
                                ) {
                                    setSmartLightStatus(true);
                                }
                            });
                        });
                    }
                }
                if (item.ComponentLink != null) {
                    item.Relevant_Url = item.ComponentLink.Url;
                }
                setTaskAssignedTo(item.AssignedTo ? item.AssignedTo : []);
                setTaskResponsibleTeam(
                    item.ResponsibleTeam ? item.ResponsibleTeam : []
                );

                if (TeamMemberTemp != undefined && TeamMemberTemp.length > 0) {
                    setTaskTeamMembers(TeamMemberTemp);
                } else {
                    setTaskTeamMembers(item.TeamMembers ? item.TeamMembers : []);
                }

                let AssignedMember: any = item.AssignedTo ? item.AssignedTo : [];
                let TeamMembers: any = item.TeamMembers ? item.TeamMembers : [];
                let ResponsibleTeam: any = item.ResponsibleTeam ? item.ResponsibleTeam : [];
                let AllUserDataInfo: any = [...ResponsibleTeam, ...TeamMembers, ...AssignedMember]

                const removeDuplicateDataArray = AllUserDataInfo?.filter(
                    (val: any, id: any, array: any) => {
                        return array?.indexOf(val) == id;
                    }
                );
                let TempArrayDataForDU: any = WorkingActionDefaultUsers.concat(removeDuplicateDataArray);
                let FinalDataForDUforWA: any = [];
                taskUsers?.map((AllTaskUsers: any) => {
                    TempArrayDataForDU?.map((CSFUsers: any) => {
                        if (AllTaskUsers?.AssingedToUserId == CSFUsers?.Id) {
                            if (AllTaskUsers.SortOrder == null || AllTaskUsers.SortOrder == undefined) {
                                AllTaskUsers.SortOrder = AllTaskUsers.Id;
                            }
                            FinalDataForDUforWA.push(AllTaskUsers);
                        }
                    })
                })
                const OriginalData = FinalDataForDUforWA?.filter(
                    (val: any, id: any, array: any) => {
                        return array?.indexOf(val) == id;
                    }
                );
                const sortedUserData: any = OriginalData?.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
                setWorkingActionDefaultUsers(sortedUserData);
                console.log("final wokrinds fsdf sdf sdf workinbg actiond fefault user data========================= ", FinalDataForDUforWA)

                item.TaskAssignedUsers = AssignedUsers;
                if (
                    TaskCreatorApproverBackupArray != undefined &&
                    TaskCreatorApproverBackupArray.length > 0
                ) {
                    const finalData = TaskCreatorApproverBackupArray?.filter(
                        (val: any, id: any, array: any) => {
                            return array?.indexOf(val) == id;
                        }
                    );
                    TaskCreatorApproverBackupArray = finalData;

                    item.TaskApprovers = finalData;
                } else {
                    item.TaskApprovers = [];
                }
                if (item.Attachments) {
                    let tempData = [];
                    tempData = saveImage[0];
                    item.UploadedImage = saveImage ? saveImage[0] : "";
                    onUploadImageFunction(tempData, tempData?.length);
                }
                if (
                    item.TaskCategories != undefined &&
                    item.TaskCategories?.length > 0
                ) {
                    let tempArray: any = [];
                    tempArray = item.TaskCategories;
                    setTaskCategoriesData(item.TaskCategories);
                    tempArray?.map((tempData: any) => {
                        BackupTaskCategoriesData.push(tempData);
                    });
                }
                if (item.RelevantPortfolio?.length > 0) {
                    setLinkedPortfolioData(item.RelevantPortfolio);
                    LinkedPortfolioDataBackup = item.RelevantPortfolio;
                }
                if (item.FeedBack != null) {
                    let message = JSON.parse(item.FeedBack);
                    item.FeedBackBackup = message;
                    updateFeedbackArray = message;
                    let Count: any = 0;
                    let feedbackArray = message[0]?.FeedBackDescriptions;
                    if (feedbackArray != undefined && feedbackArray.length > 0) {
                        let CommentBoxText = feedbackArray[0]?.Title?.replace(
                            /(<([^>]+)>)/gi,
                            ""
                        );
                        item.CommentBoxText = CommentBoxText;
                        feedbackArray.map((FeedBackData: any) => {
                            if (
                                FeedBackData.isShowLight == "Approve" ||
                                FeedBackData.isShowLight == "Maybe" ||
                                FeedBackData.isShowLight == "Reject"
                            ) {
                                Count++;
                            }
                            if (
                                FeedBackData.Subtext != undefined &&
                                FeedBackData.Subtext.length > 0
                            ) {
                                FeedBackData.Subtext.map((ChildItem: any) => {
                                    if (
                                        ChildItem.isShowLight == "Approve" ||
                                        ChildItem.isShowLight == "Maybe" ||
                                        ChildItem.isShowLight == "Reject"
                                    ) {
                                        Count++;
                                    }
                                });
                            }
                        });
                    } else {
                        item.CommentBoxText = "<p></p>";
                    }
                    if (Count >= 1) {
                        setSendEmailStatus(true);
                    } else {
                        setSendEmailStatus(false);
                    }
                    item.FeedBackArray = feedbackArray;
                    FeedBackBackupArray = JSON.stringify(feedbackArray);
                } else {
                    let param: any = Moment(new Date().toLocaleString());
                    let FeedBackItem: any = {};
                    FeedBackItem["Title"] = "FeedBackPicture" + param;
                    FeedBackItem["FeedBackDescriptions"] = [
                        {
                            Title: "\n<p></p>",
                            Completed: false,
                        },
                    ];
                    FeedBackItem["ImageDate"] = "" + param;
                    FeedBackItem["Completed"] = "";
                    updateFeedbackArray = [FeedBackItem];
                    let tempArray: any = [FeedBackItem];
                    item.FeedBack = JSON.stringify(tempArray);
                    item.FeedBackArray = tempArray[0]?.FeedBackDescriptions;
                    item.FeedBackBackup = tempArray;
                    FeedBackBackupArray = JSON.stringify(tempArray);
                }
                if (
                    item.OffshoreComments != null ||
                    item.OffshoreComments != undefined
                ) {
                    let BackgroundComments: any = JSON.parse(item.OffshoreComments);
                    if (
                        BackgroundComments != undefined &&
                        BackgroundComments.length > 0
                    ) {
                        item.BackgroundComments = BackgroundComments;
                    } else {
                        item.BackgroundComments = [];
                    }
                }
                if (
                    item.OffshoreImageUrl != null ||
                    item.OffshoreImageUrl != undefined
                ) {
                    let BackgroundImages: any = JSON.parse(item.OffshoreImageUrl);
                    if (BackgroundImages != undefined && BackgroundImages.length > 0) {
                        item.BackgroundImages = BackgroundImages;
                    } else {
                        item.BackgroundImages = [];
                    }
                }
                if (
                    (item.EstimatedTimeDescription != undefined ||
                        item.EstimatedTimeDescription != null) &&
                    item.EstimatedTimeDescription?.length > 5
                ) {
                    item.EstimatedTimeDescriptionArray = JSON.parse(
                        item.EstimatedTimeDescription
                    );
                    let tempArray: any = JSON.parse(item.EstimatedTimeDescription);
                    let tempTimeData: any = 0;
                    tempArray?.map((itemData: any) => {
                        tempTimeData = tempTimeData + Number(itemData.EstimatedTime);
                    });
                    setTotalEstimatedTime(tempTimeData);
                }
                item.ClientCategory = selectedClientCategoryData;
                item.Approvee = item.Approvee != undefined ? taskUsers.find((userData: any) => userData?.AssingedToUser?.Id == item?.Approvee?.Id) : undefined
                setEditData(item);
                EditDataBackup = item;

                console.log("Task All Details from backend  ==================", item);
            });
        } catch (error) {
            console.log("Error :", error.message);
        }
    };

    //  ******************************* this is Service And Component Portfolio Popup Related All function and CallBack *******************
    const OpenTeamPortfolioPopupFunction = (item: any, usedFor: any) => {
        if (usedFor == "Portfolio") {
            portfolioPopup = true,
                setOpenTeamPortfolioPopup(true);
        }
        if (usedFor == "Linked-Portfolios") {
            linkedPortfolioPopup = true,
                setOpenLinkedPortfolioPopup(true);
        }
    };

    // this is used for open Select Task Category Popup 

    const EditComponentPicker = (item: any, usedFor: any) => {
        setIsComponentPicker(true);
    };

    // This is used for remove linked portfolios

    const RemoveLinkedPortfolio = (Index: any) => {
        let tempArray: any = [];
        LinkedPortfolioDataBackup?.map((item: any, index: any) => {
            if (Index != index) {
                tempArray.push(item);
            }
        });
        setLinkedPortfolioData(tempArray);
        LinkedPortfolioDataBackup = tempArray;
    };

    // ################# this is for Change Task Component And Service Component #######################

    const GetAllComponentAndServiceData = async (ComponentType: any) => {
        let PropsObject: any = {
            MasterTaskListID: AllListIdData.MasterTaskListID,
            siteUrl: AllListIdData.siteUrl,
            ComponentType: ComponentType,
            TaskUserListId: AllListIdData.TaskUserListID,
        };
        let CallBackData = await globalCommon.GetServiceAndComponentAllData(
            PropsObject
        );
        if (CallBackData?.AllData != undefined && CallBackData?.AllData?.length > 0) {
            GlobalServiceAndComponentData = CallBackData.AllData;
            SetAllProjectData(CallBackData?.FlatProjectData);
            AllProjectBackupArray = CallBackData?.FlatProjectData;
        }
    };

    // this is used for auto suggestion for Tag Portfolio Items 

    const autoSuggestionsForServiceAndComponent = (e: any, usedFor: any) => {
        let SearchedKeyWord: any = e.target.value;
        let TempArray: any = [];
        if (usedFor == "Portfolio") {
            setSearchedServiceComponentKey(SearchedKeyWord);
        }
        if (usedFor == "Linked-Portfolios") {
            setSearchedLinkedPortfolioKey(SearchedKeyWord);
        }
        if (SearchedKeyWord.length > 0) {
            if (
                GlobalServiceAndComponentData != undefined &&
                GlobalServiceAndComponentData.length > 0
            ) {
                GlobalServiceAndComponentData.map((AllDataItem: any) => {
                    if (
                        AllDataItem.Path?.toLowerCase()?.includes(
                            SearchedKeyWord.toLowerCase()
                        )
                    ) {
                        TempArray.push(AllDataItem);
                    }
                });
            }
            if (TempArray != undefined && TempArray.length > 0) {
                if (usedFor == "Portfolio") {
                    setSearchedServiceComponentData(TempArray);
                }
                if (usedFor == "Linked-Portfolios") {
                    setSearchedLinkedPortfolioData(TempArray);
                }
            }
        } else {
            setSearchedServiceComponentData([]);
            setSearchedLinkedPortfolioData([]);
            setSearchedServiceComponentKey("");
            setSearchedLinkedPortfolioKey("");
        }
    };

    const setSelectedServiceAndComponentData = (SelectedData: any, Type: any) => {
        setSearchedServiceComponentData([]);
        setSearchedLinkedPortfolioData([]);
        setSearchedServiceComponentKey("");
        setSearchedLinkedPortfolioKey("");
        ComponentServicePopupCallBack([SelectedData], Type, "Save");
    };

    //  ###################  Service And Component Portfolio Popup Call Back Functions and Validations ##################

    const ComponentServicePopupCallBack = useCallback(
        (DataItem: any, Type: any, functionType: any) => {
            if (functionType == "Close") {
                setOpenTeamPortfolioPopup(false);
                setProjectManagementPopup(false)
                setOpenLinkedPortfolioPopup(false);
            } else if (Type == "untaggedProject") {
                setSelectedProject(DataItem);
                let updatedItem = {
                    ...EditDataBackup,
                    Project: DataItem[0],
                };

                EditDataBackup = updatedItem;
                setEditData(updatedItem);
            } else if (Type == "untagged") {
                if (portfolioPopup) {
                    setTaggedPortfolioData(DataItem);
                    setOpenTeamPortfolioPopup(false);
                    portfolioPopup = false
                }
                // Check if the linked portfolio popup is open
                else if (linkedPortfolioPopup) {
                    setLinkedPortfolioData(DataItem);
                    LinkedPortfolioDataBackup = DataItem;
                    setOpenLinkedPortfolioPopup(false);
                    linkedPortfolioPopup = false
                } else {
                    setOpenTeamPortfolioPopup(false);
                    setOpenLinkedPortfolioPopup(false);
                }
            } else {
                if (DataItem != undefined && DataItem.length > 0) {
                    if (DataItem[0]?.Item_x0020_Type !== "Project" || DataItem[0]?.Item_x0020_Type !== "Sprint") {
                        if (DataItem[0].ClientCategory?.length > 0) {
                            let tempTaggedCCData: any = [];
                            AllClientCategoryDataBackup?.map((AllCCItem: any) => {
                                DataItem[0]?.ClientCategory?.map((TaggedCCItem: any) => {
                                    if (AllCCItem.Id == TaggedCCItem.Id) {
                                        tempTaggedCCData.push(AllCCItem);
                                    }
                                });
                            });
                            if (Items?.Items?.siteType == "Shareweb") {
                                setSelectedClientCategory([...tempTaggedCCData]);
                            }

                            if (
                                Items?.Items?.siteType == "EI" ||
                                Items?.Items?.siteType == "EPS" ||
                                Items?.Items?.siteType == "Education" ||
                                Items?.Items?.siteType == "Migration"
                            ) {
                                let tempArray: any = [];
                                tempTaggedCCData?.map((FinalCCItem: any) => {
                                    if (FinalCCItem.siteName == Items?.Items?.siteType) {
                                        tempArray.push(FinalCCItem);
                                    }
                                });
                                setSelectedClientCategory([...tempArray]);
                            }
                        }
                        if (
                            DataItem[0].Sitestagging != null ||
                            DataItem[0].Sitestagging != undefined
                        ) {
                            let ClientData = JSON.parse(
                                DataItem[0].Sitestagging ? DataItem[0].Sitestagging : [{}]
                            );

                            if (ClientData != undefined && ClientData.length > 0) {
                                if (Items?.Items?.siteType == "Shareweb") {
                                    setSitesTaggingData(ClientData);
                                } else {
                                    let TempObject: any = {
                                        Title: Items?.Items?.siteType,
                                        ClienTimeDescription: 100,
                                        localSiteComposition: true,
                                        SiteImages: Items.Items.SiteIcon,
                                    };
                                    setSitesTaggingData([TempObject]);
                                }
                            }
                        }

                    }
                    if (Type == "Multi") {
                        if (LinkedPortfolioDataBackup?.length > 0) {
                            LinkedPortfolioDataBackup =
                                LinkedPortfolioDataBackup.concat(DataItem);
                            const finalData = LinkedPortfolioDataBackup?.filter(
                                (val: any, id: any, array: any) => {
                                    return array?.indexOf(val) == id;
                                }
                            );
                            setLinkedPortfolioData(finalData);
                        } else {
                            setLinkedPortfolioData(DataItem);
                            LinkedPortfolioDataBackup = DataItem;
                        }
                    }
                    if (Type == "Single") {
                        if (DataItem[0]?.Item_x0020_Type == "Project" || DataItem[0]?.Item_x0020_Type == "Sprint") {

                            setSelectedProject(DataItem);
                            let updatedItem = {
                                ...EditDataBackup,
                                Project: DataItem[0],
                            };
                            let SmartPriority = globalCommon.calculateSmartPriority(updatedItem)
                            updatedItem = {
                                ...updatedItem,
                                SmartPriority: SmartPriority
                            }
                            EditDataBackup = updatedItem;
                            setEditData(updatedItem);
                            globalSelectedProject = DataItem[0];

                        } else {
                            setTaggedPortfolioData(DataItem);
                            setTaskResponsibleTeam(DataItem[0].ResponsibleTeam)
                            setTaskTeamMembers(DataItem[0].TeamMembers)
                            let ComponentType: any = DataItem[0].PortfolioType.Title;
                            getLookUpColumnListId(
                                siteUrls,
                                AllListIdData?.MasterTaskListID,
                                "PortfolioType",
                                ComponentType,
                                "Updated-phase"
                            );
                        }
                    }

                    setOpenTeamPortfolioPopup(false);
                    setOpenLinkedPortfolioPopup(false);
                    console.log("Popup component smartComponent ", DataItem);
                }
            }
            setProjectManagementPopup(false)
        },
        []
    );

    //  ###################  Smart Category Popup Call Back Functions and Validations ##################

    const SelectCategoryCallBack = useCallback(
        (selectCategoryDataCallBack: any) => {
            setSelectedCategoryData(selectCategoryDataCallBack, "For-Panel");
        },
        []
    );

    //  ###################  Smart Category selection Common Functions with Validations ##################


    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        setIsComponentPicker(false);
        let uniqueIds: any = {};
        if (selectCategoryData?.length == 0) {
            setDesignNewTemplates(false)
        }
        let checkForOnHoldAndBottleneck: any = BackupTaskCategoriesData?.some((category: any) => category.Title === "On-Hold" && category.Title === "Bottleneck");
        let checkForDesign: any = BackupTaskCategoriesData?.some((category: any) => category.Title === "Design");
        if (usedFor == "For-Panel") {
            let TempArray: any = [];
            selectCategoryData?.map((selectedData: any) => {
                if (selectedData.Title == "On-Hold" && !checkForOnHoldAndBottleneck) {
                    onHoldCategory.push(selectedData);
                    setOnHoldPanel(true);
                    setSendCategoryName(selectedData.Title);
                } else {
                    TempArray.push(selectedData);
                }


                //  code by vivek
              
                if (UxTaskConfiguration?.some((uxdata:any)=>uxdata?.Title==selectedData?.Title)) {
                    let firstIndexData: any = []
                    
                    if (UxTaskConfiguration?.some((uxdata:any)=>EditDataBackup?.Categories?.includes(uxdata?.Title))) {
                        setDesignNewTemplates(true)
                    }
                    else {
                        const RestructureData = JSON.parse(JSON.stringify(EditDataBackup))
                        if (RestructureData.FeedBackBackup[0].FeedBackDescriptions?.length > 0) {
                            console.log(EditData)
                            firstIndexData = RestructureData.FeedBackBackup[0].FeedBackDescriptions[0]
                            let imageData = RestructureData?.BasicImageInfo != null ? JSON.parse(RestructureData?.BasicImageInfo) : []
                            RestructureData.FeedBackBackup[0].FeedBackDescriptions.splice(0, 1);
                            let setDataFeedback = RestructureData.FeedBackBackup[0].FeedBackDescriptions;

                            let designTemplates: any = [firstIndexData, {
                                setTitle: "SET1",
                                setImagesInfo: imageData?.length > 0 ? imageData : [],
                                TemplatesArray: setDataFeedback
                            }]
                            RestructureData.FeedBackBackup[0].FeedBackDescriptions = designTemplates
                            let updatedItem: any = {
                                ...EditDataBackup,
                                FeedBackBackup: RestructureData.FeedBackBackup,
                                FeedBackArray: designTemplates,
                                FeedBack: JSON.stringify(RestructureData?.FeedBackBackup)
                            };
                            setEditData(updatedItem);
                            updateFeedbackArray[0].FeedBackDescriptions = designTemplates
                            EditDataBackup = updatedItem;
                        }

                        setDesignNewTemplates(true)
                    }

                }
            })
            BackupTaskCategoriesData = TempArray;
        } else {
            selectCategoryData.forEach((existingData: any) => {
                if ((existingData.Title == "On-Hold") && !checkForOnHoldAndBottleneck) {
                    onHoldCategory.push(existingData);
                    setOnHoldPanel(true);
                    setSendCategoryName(existingData.Title)
                } else {
                    BackupTaskCategoriesData.push(existingData);
                }
                // code by vivek
                
                if (UxTaskConfiguration?.some((uxdata:any)=>uxdata?.Title==existingData?.Title)) {
                    let firstIndexData: any = []
                    
                    if (UxTaskConfiguration?.some((uxdata:any)=>EditDataBackup?.Categories?.includes(uxdata?.Title))) {
                        setDesignNewTemplates(true)
                    } else {
                        const RestructureData = JSON.parse(JSON.stringify(EditDataBackup))
                        if (RestructureData.FeedBackBackup[0].FeedBackDescriptions?.length > 0) {
                            console.log(EditData)
                            firstIndexData = RestructureData.FeedBackBackup[0].FeedBackDescriptions[0]
                            let imageData = RestructureData?.BasicImageInfo != null ? JSON.parse(RestructureData?.BasicImageInfo) : []
                            RestructureData.FeedBackBackup[0].FeedBackDescriptions.splice(0, 1);
                            let setDataFeedback = RestructureData.FeedBackBackup[0].FeedBackDescriptions;

                            let designTemplates: any = [firstIndexData, {
                                setTitle: "SET1",
                                setImagesInfo: imageData?.length > 0 ? imageData : [],
                                TemplatesArray: setDataFeedback
                            }]
                            RestructureData.FeedBackBackup[0].FeedBackDescriptions = designTemplates
                            let updatedItem: any = {
                                ...EditDataBackup,
                                FeedBackBackup: RestructureData.FeedBackBackup,
                                FeedBackArray: designTemplates,
                                FeedBack: JSON.stringify(RestructureData?.FeedBackBackup)
                            };
                            setEditData(updatedItem);
                            updateFeedbackArray[0].FeedBackDescriptions = designTemplates
                            EditDataBackup = updatedItem;
                        }

                        setDesignNewTemplates(true)
                    }

                }
            });
        }
        const result: any = BackupTaskCategoriesData.filter((item: any) => {
            if (!uniqueIds[item.Id]) {
                uniqueIds[item.Id] = true;
                return true;
            }
            return false;
        });
        setIsTaskCategoryUpdated(true);
        BackupTaskCategoriesData = result;
        let updatedItem = {
            ...EditDataBackup,
            TaskCategories: BackupTaskCategoriesData,
        };
        let SmartPriority = globalCommon.calculateSmartPriority(updatedItem)
        updatedItem = {
            ...updatedItem,
            SmartPriority: SmartPriority
        }
        setEditData(updatedItem);
        EditDataBackup = updatedItem;
        setEmailStatus(result?.some((category: any) => category.Title === "Email Notification"));
        setImmediateStatus(result?.some((category: any) => category.Title === "Immediate"));
        setOnlyCompletedStatus(result?.some((category: any) => category.Title === "Only Completed"));

        if (usedFor === "For-Panel" || usedFor === "For-Auto-Search") {
            setTaskCategoriesData(result);
            if (usedFor === "For-Auto-Search") {
                setSearchedCategoryData([]);
                setCategorySearchKey("");
            }
        }
    };

    // This is used for close select category popup 

    const smartCategoryPopup = useCallback(() => {
        setIsComponentPicker(false);
    }, []);


    // This is used for on hold comment card callback 

    const editTaskPopupCallBack = useCallback(async (usedFor: any) => {
        setOnHoldPanel(false);
        if (usedFor == "Save") {
            if (onHoldCategory?.length > 0) {
                let uniqueIds: any = {};
                BackupTaskCategoriesData.push(onHoldCategory[0]);
                const result: any = BackupTaskCategoriesData.filter((item: any) => {
                    if (!uniqueIds[item.Id]) {
                        uniqueIds[item.Id] = true;
                        return true;
                    }
                    return false;
                });
                BackupTaskCategoriesData = result;
                setTaskCategoriesData(result);
            } else {
                let DynamicAssignmentInformation = await GlobalFunctionForUpdateItems.TaskNotificationConfiguration({ usedFor: "Auto-Assignment", SiteURL: siteUrls, ItemDetails: EditDataBackup, Context: Context, RequiredListIds: AllListIdData, AllTaskUser: AllTaskUser, Status: 70 })
                console.log("Dynamic Assignment Information All Details from backend  ==================", DynamicAssignmentInformation);
                StatusOptions?.map((item: any) => {
                    if (70 == item.value) {
                        if (EditDataBackup != undefined) {
                            setTaskAssignedTo(EditDataBackup.TaskAssignedUsers);
                        }
                        setPercentCompleteStatus(item.status);
                        setTaskStatus(item.taskStatusComment);
                        setUpdateTaskInfo({
                            ...UpdateTaskInfo,
                            PercentCompleteStatus: "70",
                        });
                    }
                });
            }
        }
        onHoldCategory = [];
    }, []);

    //  ###################  Smart Category Auto Suggestion Functions  ##################

    const autoSuggestionsForCategory = (e: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if (
                    itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
                ) {
                    tempArray.push(itemData);
                }
            });
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
    };

    // ################ this is for Smart category change and remove function #############

    const removeCategoryItem = (TypeCategory: any) => {
        let tempString: any;
        let tempArray2: any = [];
        BackupTaskCategoriesData = [];
        TaskCategoriesData?.map((dataType: any) => {
            if (dataType.Title != TypeCategory) {
                tempArray2.push(dataType);
                BackupTaskCategoriesData.push(dataType);
            }
        });
        if (tempArray2 != undefined && tempArray2.length > 0) {
            tempArray2.map((itemData: any) => {
                tempString =
                    tempString != undefined
                        ? tempString + ";" + itemData.Title
                        : itemData.Title;
            });
        }

        tempCategoryData = tempString;
        setTaskCategoriesData(tempArray2);
    };


    // this is used for tagging categories which is showing in Task Popup Directly like Immediate, Email-Notification EditComponentPicker.

    const CategoryChange = (e: any, typeValue: any) => {
        let statusValue: any;
        isApprovalByStatus = false;
        if (e == "false") {
            statusValue = e;
            isApprovalByStatus = true;
        } else {
            statusValue = e.target.value;
        }
        let type: any = typeValue;
        CategoryChangeUpdateFunction(statusValue, type);
    };


    // This is a common function tagging the Task Categories 

    const CategoryChangeUpdateFunction = (Status: any, type: any) => {
        if (Status == "true") {
            removeCategoryItem(type);
            if (type == "Email Notification") {
                setEmailStatus(false);
            }
            if (type == "Immediate") {
                setImmediateStatus(false);
            }
            if (type == "Approval") {
                setApprovalStatus(false);
            }
            if (type == "Only Completed") {
                setOnlyCompletedStatus(false);
            }
        } else {

            if (tempCategoryData == undefined) {
                tempCategoryData = "";
            }
            let CheckTaggedCategory = tempCategoryData?.includes(type);
            if (CheckTaggedCategory == false) {
                let CheckTaggedCategory: any = true;
                let category: any = tempCategoryData + ";" + type;

                tempCategoryData = category;
                if (
                    BackupTaskCategoriesData != undefined &&
                    BackupTaskCategoriesData.length > 0
                ) {
                    BackupTaskCategoriesData.map((tempItem: any) => {
                        if (tempItem.Title == type) {
                            CheckTaggedCategory = false;
                        }
                    });
                }
                if (
                    AutoCompleteItemsArray != undefined &&
                    AutoCompleteItemsArray.length > 0
                ) {
                    AutoCompleteItemsArray.map((dataItem: any) => {
                        if (dataItem.Title == type) {
                            if (CheckTaggedCategory) {
                                TaskCategoriesData.push(dataItem);
                                BackupTaskCategoriesData.push(dataItem);

                            }
                        }
                    });
                }


                if (type == "Email Notification") {
                    setEmailStatus(true);
                }
                if (type == "Immediate") {
                    setImmediateStatus(true);
                }
                if (type == "Approval") {
                    isApprovalByStatus = true;
                    let tempArray: any = [];
                    if (currentUserData != undefined && currentUserData.length > 0) {
                        currentUserData.map((dataItem: any) => {
                            dataItem?.Approver.map((items: any) => {
                                tempArray.push(items);
                            });
                        });
                    }

                    const finalData = tempArray.filter(
                        (val: any, id: any, array: any) => {
                            return array?.indexOf(val) == id;
                        }
                    );

                    EditData.TaskApprovers = finalData;
                    EditData.CurrentUserData = currentUserData;

                    setApprovalStatus(true);
                    Items.sendApproverMail = true;
                    StatusOptions?.map((item: any) => {
                        if (item.value == 1) {
                            setUpdateTaskInfo({
                                ...UpdateTaskInfo,
                                PercentCompleteStatus: "1",
                            });
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                            setPercentCompleteCheck(false);
                        }
                    });
                }
                if (type == "Only Completed") {
                    setOnlyCompletedStatus(true);
                }
            }

        }
        let updatedItem = {
            ...EditDataBackup,
            TaskCategories: BackupTaskCategoriesData,
        };
        let SmartPriority = globalCommon.calculateSmartPriority(updatedItem)
        updatedItem = {
            ...updatedItem,
            SmartPriority: SmartPriority
        }
        EditDataBackup = updatedItem;
        setEditData(updatedItem);
    };

    // $$$$$$$$$$$$$$$$$$$$$$$$$ End Smart Category Section Functions $$$$$$$$$$$$$$$$


    // ************************** this is used for getting Site Composition For Selected Portfolio which in Tagged into Task ***********************
    const GetPortfolioSiteComposition = async (PortfolioId: any, item: any) => {
        const web = new Web(siteUrls);
        let DataFromCall: any[] = [];
        try {
            DataFromCall = await Promise.all([
                web.lists
                    .getById(AllListIdData?.MasterTaskListID)
                    .items.filter(`Id eq ${PortfolioId}`)
                    .select(
                        "Sitestagging,SiteCompositionSettings,Title,Id,PortfolioType/Title"
                    )
                    .expand("PortfolioType")
                    .top(5000)
                    .get()
                    .then((res) => {
                        if (res?.length > 0) {
                            let TempSiteCompositionArray: any = [];
                            if (res[0]?.PortfolioType?.Title != undefined) {

                                getLookUpColumnListId(
                                    siteUrls,
                                    AllListIdData?.MasterTaskListID,
                                    "PortfolioType",
                                    res[0]?.PortfolioType.Title,
                                    "Initial-Phase"
                                );
                            }
                            setTaggedPortfolioData(res);
                            if (
                                res[0]?.Sitestagging != null &&
                                res[0]?.Sitestagging != undefined
                            ) {
                                let tempSiteComposition: any = JSON.parse(
                                    res[0].Sitestagging != undefined ? res[0].Sitestagging : [{}]
                                );
                                if (
                                    tempSiteComposition != undefined &&
                                    tempSiteComposition.length > 0
                                ) {
                                    tempSiteComposition.map((SiteData: any) => {
                                        let TempObject: any = {
                                            SiteName: SiteData.Title,
                                            ClienTimeDescription: SiteData.ClienTimeDescription,
                                            localSiteComposition: true,
                                        };
                                        TempSiteCompositionArray.push(TempObject);
                                    });
                                    if (
                                        TempSiteCompositionArray != undefined &&
                                        TempSiteCompositionArray.length > 0
                                    ) {

                                    }
                                }
                            }
                        }
                    }),
            ]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    //  ################# this is used for getting Portfolio type information #################

    const GetTaskStatusOptionData = async (
        PortfolioTypeListId: any,
        ComponentType: any,
        usedFor: any
    ) => {
        let PortfolioTypeData: any = [];
        const web = new Web(siteUrls);
        try {
            PortfolioTypeData = await Promise.all([
                web.lists
                    .getById(PortfolioTypeListId)
                    .items.select("Title,ID,Color,StatusOptions")
                    .getAll()
                    .then((res) => {
                        if (res?.length > 0) {
                            res?.map((PortfolioItem: any) => {
                                if (PortfolioItem.Title == ComponentType) {
                                    if (PortfolioItem?.StatusOptions?.length > 0) {
                                        let StatusOptionString = JSON.parse(
                                            PortfolioItem.StatusOptions
                                        );
                                        StatusOptions = StatusOptionString;
                                        setStatusOptions([...StatusOptions]);

                                        if (usedFor == "Initial-Phase" && FeedBackCount == 0) {
                                            GetSelectedItemDetails();
                                            FeedBackCount++;
                                        }
                                    }
                                    PortfolioItemColor = PortfolioItem?.Color;
                                    let targetDiv: any =
                                        document?.querySelector(".ms-Panel-main");
                                    setTimeout(() => {
                                        if (targetDiv) {
                                            // Change the --SiteBlue variable for elements under the targetDiv
                                            $(".ms-Panel-main").css(
                                                "--SiteBlue",
                                                PortfolioItem?.Color
                                            );
                                        }
                                    }, 1000);
                                }
                            });
                        }
                    }),
            ]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // ************************** this is used for getting All Projects Data From Back End ***********************


    //    ************************* This is for status section Functions **************************

    //   ######################  This is used for Status Popup Change Status #########################
    const SmartMetaDataPanelSelectDataFunction = async (
        StatusData: any,
        usedFor: any
    ) => {
        if (usedFor == "Estimated-Time") {
            setEstimatedDescriptionCategory(StatusData);
            setSmartMetaDataUsedPanel("");
        } else {
            if (!sendEmailStatus && (StatusData.value == 2 || StatusData.value == 3)) {
                alert("Please approve or reject first to update the status.")
            } else if (StatusData.value == 70) {
                setOnHoldPanel(true);
                setSendCategoryName("Reopen");
            } else {
                setUpdateTaskInfo({
                    ...UpdateTaskInfo,
                    PercentCompleteStatus: StatusData.value,
                });
                setPercentCompleteStatus(StatusData.status);
                setTaskStatus(StatusData.taskStatusComment);
                setPercentCompleteCheck(false);
                setIsTaskStatusUpdated(true);
                let DynamicAssignmentInformation = await GlobalFunctionForUpdateItems.TaskNotificationConfiguration({ usedFor: "Auto-Assignment", SiteURL: siteUrls, ItemDetails: EditDataBackup, Context: Context, RequiredListIds: AllListIdData, AllTaskUser: AllTaskUser, Status: StatusData.value })
                console.log("Dynamic Assignment Information All Details from backend  ==================", DynamicAssignmentInformation);
                const finalUsersData = EditDataBackup?.TaskAssignedUsers?.filter(
                    (val: any, id: any, array: any) => {
                        return array?.indexOf(val) == id;
                    }
                );
                if (finalUsersData?.length > 0 && StatusData.value > 2) {
                    setTaskAssignedTo(finalUsersData);
                }
                if (StatusData.value == 0) {
                    updateWAForApproval(true, "IsChecked");
                }
                if (StatusData.value == 1) {
                    updateWAForApproval(false, "IsChecked");
                }
                if (StatusData.value == 80) {
                    EditData.IsTodaysTask = false;
                    EditData.CompletedDate = undefined;
                    EditData.workingThisWeek = false;
                }
                if (StatusData.value == 5) {
                    EditData.CompletedDate = undefined;
                    EditData.IsTodaysTask = false;
                    setTeamLeaderChanged(true);
                }
                if (StatusData.value == 8) {
                    let CheckForTaskCategories: any = EditDataBackup.TaskCategories?.some((category: any) => category.Title === "Development" || category.Title === "Improvement")
                    if (CheckForTaskCategories) {
                        let AuthorId: any = EditDataBackup?.Author?.Id;
                        setWorkingMember(AuthorId);
                        setSendMsgToAuthor(true);
                    }
                }
                if (StatusData.value == 10) {
                    EditData.CompletedDate = undefined;
                    if (EditData.StartDate == undefined) {
                        EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY");
                    }
                    EditData.IsTodaysTask = true;
                }
                if (StatusData.value == 93 || StatusData.value == 96 || StatusData.value == 99) {
                    EditData.IsTodaysTask = false;
                    EditData.workingThisWeek = false;
                    StatusOptions?.map((item: any) => {
                        if (StatusData.value == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                    if (WorkingAction?.length > 0) {
                        WorkingAction?.forEach((DataItem: any) => {
                            if (DataItem.Title == "WorkingDetails") {
                                DataItem.InformationData = []
                            }
                        })
                    }
                }
                if (StatusData.value == 90) {
                    EditData.IsTodaysTask = false;
                    EditData.workingThisWeek = false;
                    EditData.CompletedDate = Moment(new Date()).format("MM-DD-YYYY");
                    StatusOptions?.map((item: any) => {
                        if (StatusData.value == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                    if (WorkingAction?.length > 0) {
                        WorkingAction?.forEach((DataItem: any) => {
                            if (DataItem.Title == "WorkingDetails") {
                                DataItem.InformationData = []
                            }
                        })
                    }
                }
                setSmartMetaDataUsedPanel("");
            }
        }
    };


    //  ###################### This is Common Function for Change The Team Members According to Change Status ######################

    const removeWorkingMembers = (workingActionValue: any, FilterType: any) => {
        workingActionValue.map((workingActions: any, index: any) => {
            if (workingActions?.Title == "WorkingDetails") {
                workingActionValue.splice(index, 1)
            }
        })
        return workingActionValue
    }


    const setWorkingMemberFromTeam = (
        filterArray: any,
        filterType: any,
        StatusID: any
    ) => {
        let tempArray: any = [];
        let updateUserArray1: any = [];
        filterArray.map((TeamItems: any) => {
            taskUsers?.map((TaskUserData: any) => {
                if (TeamItems.Id == TaskUserData.AssingedToUserId) {
                    if (filterType == "Development") {
                        if (
                            TaskUserData.TimeCategory == "Development" ||
                            TaskUserData.TimeCategory == "Design"
                        ) {
                            tempArray.push(TaskUserData);
                            EditData.TaskAssignedUsers = tempArray;
                            updateUserArray1.push(TaskUserData.AssingedToUser);
                            setTaskAssignedTo(updateUserArray1);
                        }
                    } else {
                        if (TaskUserData.TimeCategory == filterType) {
                            tempArray.push(TaskUserData);
                            EditData.TaskAssignedUsers = tempArray;
                            updateUserArray1.push(TaskUserData.AssingedToUser);
                            setTaskAssignedTo(updateUserArray1);
                        } else {
                            if (tempArray?.length == 0) {
                                setWorkingMember(143);
                            }
                        }
                    }
                }
            });
        });
    };

    //  ###################### This is Common Function for Change The Working Members According to Change Status ######################

    const setWorkingMember = (statusId: any) => {
        taskUsers.map((dataTask: any) => {
            if (dataTask.AssingedToUserId == statusId) {
                let tempArray: any = [];
                tempArray.push(dataTask);
                EditData.TaskAssignedUsers = tempArray;
                let updateUserArray: any = [];
                updateUserArray.push(tempArray[0].AssingedToUser);
                setTaskAssignedTo(updateUserArray);
            }
        });
    };


    // this is main panel close button function and callback

    const setModalIsOpenToFalse = () => {
        Items.Call("Close");
        BackupTaskCategoriesData = [];
        taskUsers = [];
        CommentBoxData = [];
        SubCommentBoxData = [];
        updateFeedbackArray = [];
        BackupTaskCategoriesData = [];
        tempCategoryData = [];
        SiteTypeBackupArray = [];
        currentUserBackupArray = [];
        AutoCompleteItemsArray = [];
        FeedBackBackupArray = [];
        TaskCreatorApproverBackupArray = [];
        TaskApproverBackupArray = [];
        ApproverIds = [];
    };


    // This is used for preparing the data for update on backend side 

    let smartComponentsIds: any = "";
    let RelevantPortfolioIds: any = [];
    let AssignedToIds: any = [];
    let ResponsibleTeamIds: any = [];
    let TeamMemberIds: any = [];
    let CategoryTypeID: any = [];
    let ClientCategoryIDs: any = [];
    let ApproverIds: any = [];

    // ******************** This is used for updating all the Task Popup details on backend side  ***************************


    const UpdateTaskInfoFunction = async (usedFor: any) => {
        let DataJSONUpdate: any = await MakeUpdateDataJSON();
        let taskPercentageValue: any = DataJSONUpdate?.PercentComplete ? DataJSONUpdate?.PercentComplete : 0;
        if (isApprovalByStatus == true) {
            let web = new Web(siteUrls);
            await web.lists
                .getById(AllListIdData.listId)
                .items.getById(Items.Items.Id)
                .update({
                    ApproveeId: currentUserData[0].AssingedToUserId,
                })
                .then((res: any) => {
                    console.log(res);
                });
        }

        try {
            let web = new Web(siteUrls);
            await web.lists
                .getById(Items.Items.listId)
                .items.getById(Items.Items.Id)
                .update(DataJSONUpdate)
                .then(async (res: any) => {
                    // Added by PB************************
                    let ClientActivityJsonMail: any = null;
                    if (EditData?.ClientActivityJson != undefined) {
                        try {
                            ClientActivityJsonMail = JSON.parse(
                                EditData?.ClientActivityJson
                            );
                            if (ClientActivityJsonMail?.length > 0) {
                                ClientActivityJsonMail = ClientActivityJsonMail[0];
                            }
                        } catch (e) { }
                    }
                    if (
                        (Items?.SDCTaskDetails != undefined &&
                            Items?.SDCTaskDetails?.SDCCreatedBy != undefined &&
                            Items?.SDCTaskDetails?.SDCCreatedBy != "" &&
                            EditData != undefined &&
                            EditData != "") ||
                        (ClientActivityJsonMail != null &&
                            ClientActivityJsonMail?.SDCCreatedBy != undefined &&
                            Number(UpdateTaskInfo?.PercentCompleteStatus) == 90)
                    ) {
                        let SDCRecipientMail: any[] = [];
                        EditData.ClientTask = Items?.SDCTaskDetails;
                        taskUsers?.map((User: any) => {
                            if (
                                User?.Title?.toLowerCase() == "robert ungethuem" ||
                                User?.Title?.toLowerCase() == "stefan hochhuth"
                            ) {
                                SDCRecipientMail.push(User);
                            }
                        });
                        await globalCommon
                            .sendImmediateEmailNotifications(
                                EditData.Id,
                                siteUrls,
                                Items.Items.listId,
                                EditData,
                                SDCRecipientMail,
                                "Client Task",
                                taskUsers,
                                Context
                            )
                            .then((response: any) => {
                                console.log(response);
                            });
                    }
                    //End Here*************************

                    let web = new Web(siteUrls);
                    let TaskDetailsFromCall: any;
                    if (Items.Items.listId != undefined) {
                        TaskDetailsFromCall = await web.lists
                            .getById(Items.Items.listId)
                            .items.select(
                                "Id,Title,PriorityRank,Comments,TotalTime,workingThisWeek,WorkingAction,Project/Id,Project/Title,Project/PriorityRank,Approvee/Id,Approvee/Title,EstimatedTime,EstimatedTimeDescription,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,Sitestagging,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,ComponentLink,Portfolio/Title,Portfolio/Id,Portfolio/PortfolioStructureID,PercentComplete,Categories,TaskLevel,TaskLevel,ClientActivity,ClientActivityJson,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title, ParentTask/TaskID,ParentTask/Id,TaskID"
                            )
                            .top(5000)
                            .filter(`Id eq ${Items.Items.Id}`)
                            .expand(
                                "AssignedTo,Author,ParentTask,Editor,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory,Project,Approvee"
                            )
                            .get();
                    } else {
                        TaskDetailsFromCall = await web.lists
                            .getById(Items.Items.listName)
                            .items.select(
                                "Id,Title,PriorityRank,TotalTime,Comments,Project/Id,WorkingAction,Project/Title,Project/PriorityRank,workingThisWeek,Approvee/Id,Approvee/Title,EstimatedTime,EstimatedTimeDescription,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,Sitestagging,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,ComponentLink,Portfolio/Title,Portfolio/Id,Portfolio/PortfolioStructureID,PercentComplete,Categories,TaskLevel,TaskLevel,ClientActivity,ClientActivityJson,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title, ParentTask/TaskID,ParentTask/Id,TaskID"
                            )
                            .top(5000)
                            .filter(`Id eq ${Items.Items.Id}`)
                            .expand(
                                "AssignedTo,Author,ParentTask,Editor,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory,Project,Approvee"
                            )
                            .get();
                    }
                    let currentUserId = Context.pageContext._legacyPageContext.userId;
                    TaskDetailsFromCall[0].TaskId = globalCommon.GetTaskId(
                        TaskDetailsFromCall[0]
                    );
                    TaskDetailsFromCall[0].TaskID = globalCommon.GetTaskId(
                        TaskDetailsFromCall[0]
                    );

                    if (
                        TaskDetailsFromCall != undefined &&
                        TaskDetailsFromCall.length > 0
                    ) {
                        TaskDetailsFromCall[0].TaskCreatorData = EditData.TaskCreatorData;
                        TaskDetailsFromCall[0].TaskApprovers = EditData.TaskApprovers;
                        TaskDetailsFromCall[0].Approver = EditData.Approver;
                        TaskDetailsFromCall[0].currentUser = EditData.CurrentUserData;
                        TaskDetailsFromCall[0].FeedBack = JSON.parse(
                            TaskDetailsFromCall[0].FeedBack
                        );
                        TaskDetailsFromCall[0].siteType = EditData.siteType;
                        TaskDetailsFromCall[0].siteUrl = siteUrls;
                        TaskDetailsFromCall[0].siteIcon = Items.Items.SiteIcon;
                        TaskDetailsFromCall[0].PercentComplete = (TaskDetailsFromCall[0].PercentComplete * 100).toFixed(0);
                        TaskDetailsFromCall[0].Comments = JSON.parse(TaskDetailsFromCall[0].Comments)
                    }
                    let UpdatedDataObject: any = TaskDetailsFromCall[0]
                    let NewSmartPriority: any = globalCommon.calculateSmartPriority(UpdatedDataObject)
                    UpdatedDataObject.SmartPriority = NewSmartPriority;
                    UpdatedDataObject.siteUrl = siteUrls;
                    UpdatedDataObject.CommentsArray = UpdatedDataObject?.Comments != null ? typeof UpdatedDataObject?.CommentsArray === "object" ? JSON.parse(UpdatedDataObject?.Comments) : UpdatedDataObject?.Comments : null
                    let WorkingActionData = UpdatedDataObject?.WorkingAction?.length > 0 ? JSON.parse(UpdatedDataObject?.WorkingAction) : [];
                    WorkingActionData?.map((ItemData: any) => {
                        ItemData.InformationData?.map(async (InfoItem: any) => {
                            if (InfoItem.NotificationSend == false) {
                                InfoItem.NotificationSend = true;
                                let DataForNotification: any = {
                                    ReceiverName: InfoItem.TaggedUsers?.Title,
                                    sendUserEmail: [InfoItem.TaggedUsers?.Email],
                                    Context: Items.context,
                                    ActionType: ItemData.Title,
                                    ReasonStatement: InfoItem.Comment,
                                    UpdatedDataObject: UpdatedDataObject,
                                    RequiredListIds: AllListIdData
                                }
                                if (ItemData?.Title == "Approval") {
                                    await GlobalFunctionForUpdateItems.TaskNotificationConfiguration({ usedFor: "Notification", SiteURL: siteUrls, ItemDetails: UpdatedDataObject, Context: Context, RequiredListIds: AllListIdData, AllTaskUser: AllTaskUser, Status: UpdatedDataObject.PercentComplete, SendUserEmail: DataForNotification.sendUserEmail })
                                } else {
                                    await GlobalFunctionForUpdateItems.SendMSTeamsNotificationForWorkingActions(DataForNotification).then(() => {
                                        console.log("Ms Teams Notifications send")
                                    })
                                }

                            }
                        })
                    })
                    if (WorkingActionData?.length > 0) {
                        setWorkingAction([...WorkingActionData])
                        UpdateWorkingActionJSON(WorkingActionData);
                    }
                    const uniqueIds: any = {};
                    const result = BackupTaskCategoriesData.filter((item: any) => {
                        if (!uniqueIds[item.Id]) {
                            uniqueIds[item.Id] = true;
                            return true;
                        }
                        return false;
                    });
                    // This used for send MS Teams and Email Notification according to Task Notification Configuration Tool

                    if (UpdatedDataObject != undefined) {
                        const assignedTo = UpdatedDataObject.AssignedTo;
                        if (assignedTo != undefined) {
                            assignedTo.map((assignedData: any) => {
                                taskUsers?.forEach((userData: any) => {
                                    if (assignedData?.Id == userData?.AssingedToUserId && userData?.AssingedToUserId != currentUserId) {
                                        assignedData.Email = userData?.AssingedToUser?.EMail;
                                    }
                                });
                            });
                        }
                    }
                    if (IsTaskStatusUpdated || IsTaskCategoryUpdated) {
                        let TaskConfigurationInformation = await GlobalFunctionForUpdateItems.TaskNotificationConfiguration({ usedFor: "Notification", SiteURL: siteUrls, ItemDetails: UpdatedDataObject, Context: Context, RequiredListIds: AllListIdData, AllTaskUser: AllTaskUser, Status: UpdatedDataObject.PercentComplete })
                        console.log("MS Teams Notification Send Successfully for Task Status and Category Change", TaskConfigurationInformation);
                    }
                    if (TeamMemberChanged) {
                        let PrepareObjectData: any = {
                            Configuration: { Notify: "Group", notifyContent: "You have been marked as a working member on the below task. Please take necessary action (Analyze the points in the task, fill up the Estimation, Set to 10%)." },
                            ItemDetails: UpdatedDataObject,
                            Context: Context,
                            RequiredListIds: AllListIdData,
                            UserEmail: []
                        }
                        let MSSendStatus: any = await GlobalFunctionForUpdateItems?.SendDynamicMSTeamsNotification(PrepareObjectData);
                        console.log("MS Teams Notification Send Successfully for Assignments", MSSendStatus);
                    }


                    if (ApproverData != undefined && ApproverData.length > 0) {
                        taskUsers.forEach((val: any) => {
                            if (
                                ApproverData[0]?.Id == val?.AssingedToUserId &&
                                ApproverData[0].Company == undefined
                            ) {
                                EditData.TaskApprovers = ApproverData;
                            }
                        });
                    }
                    if (ApproverData != undefined && ApproverData.length > 0) {
                        taskUsers.forEach((val: any) => {
                            if (
                                ApproverData[0]?.AssingedToUserId == val?.AssingedToUserId &&
                                ApproverData[0].Company != undefined
                            ) {
                                EditData.TaskApprovers = ApproverData;
                            }
                        });
                    }
                    if (ApproverData != undefined && ApproverData.length > 0) {
                        if (
                            ApproverData[0].Id == currentUserId &&
                            currentUserId != EditData?.Author.Id
                        ) {
                            EditData.TaskApprovers = EditData.TaskCreatorData;
                        }
                    }
                    setLastUpdateTaskData(TaskDetailsFromCall[0]);
                    if (usedFor == "Image-Tab") {
                        GetExtraLookupColumnData();
                    } else {
                        BackupTaskCategoriesData = [];
                        taskUsers = [];
                        CommentBoxData = [];
                        SubCommentBoxData = [];
                        updateFeedbackArray = [];
                        BackupTaskCategoriesData = [];
                        tempCategoryData = "";
                        SiteTypeBackupArray = [];
                        currentUserBackupArray = [];
                        AutoCompleteItemsArray = [];
                        FeedBackBackupArray = [];
                        TaskCreatorApproverBackupArray = [];
                        TaskApproverBackupArray = [];
                        ApproverIds = [];
                        TempSmartInformationIds = [];
                        userSendAttentionEmails = [];
                        isApprovalByStatus = false;
                        if (Items.sendApproverMail != undefined) {
                            if (Items.sendApproverMail) {
                                setSendEmailComponentStatus(true);
                            } else {
                                setSendEmailComponentStatus(false);
                            }
                        }
                        if (Items.sendRejectedMail != undefined) {
                            if (Items.sendRejectedMail) {
                                setSendEmailComponentStatus(true);
                            } else {
                                setSendEmailComponentStatus(false);
                            }
                        }
                        if (sendEmailGlobalCount > 0) {
                            if (sendEmailStatus) {
                                setSendEmailComponentStatus(false);
                            } else {
                                setSendEmailComponentStatus(true);
                            }
                        }
                        if (
                            Items?.pageName == "TaskDashBoard" ||
                            Items?.pageName == "ProjectProfile" ||
                            Items?.pageName == "TaskFooterTable"
                        ) {
                            if (Items?.pageName == "TaskFooterTable") {
                                let dataEditor: any = {};
                                dataEditor.data = TaskDetailsFromCall[0];
                                dataEditor.data.editpopup = true;
                                dataEditor.data.TaskID = EditData.TaskId;
                                dataEditor.data.listId = Items.Items.listId;
                                dataEditor.data.SiteIcon = Items?.Items?.SiteIcon;
                                dataEditor.data.DisplayCreateDate =
                                    Items?.Items?.DisplayCreateDate;
                                dataEditor.data.DisplayDueDate = Moment(EditData?.DueDate).format("DD/MM/YYYY");
                                if (dataEditor.data.DisplayDueDate == "Invalid date" || "") {
                                    dataEditor.data.DisplayDueDate = dataEditor.data.DisplayDueDate.replaceAll(
                                        "Invalid date",
                                        ""
                                    );
                                }
                                dataEditor.data.PercentComplete = Number(UpdateTaskInfo.PercentCompleteStatus);
                                dataEditor.data.FeedBack = JSON.stringify(
                                    dataEditor.data.FeedBack
                                );
                                let portfoliostructureIds = AllProjectBackupArray?.filter((item: any) => item?.Id === (selectedProject?.length > 0 ? selectedProject[0].Id : ""));
                                const structureiddata = portfoliostructureIds?.length > 0 ? portfoliostructureIds[0]?.PortfolioStructureID : "";

                                dataEditor.data.projectStructerId = structureiddata;
                                Items.Call(dataEditor, "UpdatedData");
                            } else {
                                Items.Call(DataJSONUpdate, "UpdatedData");
                            }
                        } else {
                            if (usedFor !== "TimeSheetPopup") {
                                Items.Call("Save");
                            }
                        }
                    }
                });
        } catch (error) {
            console.log("Error in Update Task Info Function:", error.messages);
        }

    };


    // this is used for the making the JSON for updating the Task Popup All Details 

    const MakeUpdateDataJSON = async () => {
        let UploadImageArray: any = [];
        let ApprovalData: any = [];
        if (TaskImages != undefined && TaskImages.length > 0) {
            TaskImages?.map((imgItem: any) => {
                if (imgItem.ImageName != undefined && imgItem.ImageName != null) {
                    if (
                        imgItem.imageDataUrl != undefined &&
                        imgItem.imageDataUrl != null
                    ) {
                        let tempObject: any = {
                            ImageName: imgItem.ImageName,
                            ImageUrl: imgItem.imageDataUrl,
                            UploadeDate: imgItem.UploadeDate,
                            UserName: imgItem.UserName,
                            UserImage: imgItem.UserImage,
                        };
                        UploadImageArray.push(tempObject);
                    } else {
                        UploadImageArray.push(imgItem);
                    }
                }
            });
        }

        let PrecentStatus: any = UpdateTaskInfo.PercentCompleteStatus
            ? Number(UpdateTaskInfo.PercentCompleteStatus)
            : 0;
        if (PrecentStatus == 3) {
            setTaskAssignedTo([])
            TaskAssignedTo = []
        }
        if (PrecentStatus == 1) {
            let tempArrayApprover: any = [];

            if (
                TaskApproverBackupArray != undefined &&
                TaskApproverBackupArray.length > 0
            ) {
                if (TaskApproverBackupArray?.length > 0) {
                    TaskApproverBackupArray.map((dataItem: any) => {
                        tempArrayApprover.push(dataItem);
                    });
                }
            } else if (
                TaskCreatorApproverBackupArray != undefined &&
                TaskCreatorApproverBackupArray.length > 0
            ) {
                if (TaskCreatorApproverBackupArray?.length > 0) {
                    TaskCreatorApproverBackupArray.map((dataItem: any) => {
                        tempArrayApprover.push(dataItem);
                    });
                }
            }

            StatusOptions?.map((item: any) => {
                if (PrecentStatus == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            });
            if (ApproverData == undefined && ApproverData.length == 0) {
                const finalData = tempArrayApprover.filter(
                    (val: any, id: any, array: any) => {
                        return array?.indexOf(val) == id;
                    }
                );
                TaskAssignedTo = finalData;
                TaskTeamMembers = finalData;
            } else {
                TaskAssignedTo = ApproverData;
                TaskTeamMembers = ApproverData;
            }
        }

        let currentUserId = Context.pageContext._legacyPageContext.userId;

        if (ApproverData != undefined && ApproverData.length > 0) {
            if (ApproverData[0].Company == undefined) {
                EditData.TaskApprovers = ApproverData;
                ApprovalData = ApproverData;
            }
        }
        if (ApproverData != undefined && ApproverData.length > 0) {
            if (ApproverData[0].Company != undefined) {
                EditData.TaskApprovers = ApproverData;
                ApproverData?.map((ApproverInfo) => {
                    if (ApproverInfo.Id == undefined) {
                        ApproverInfo.Id = ApproverInfo.AssingedToUserId;
                    }
                });
                ApprovalData = ApproverData;
            }
        }
        if (CommentBoxData?.length > 0 || SubCommentBoxData?.length > 0) {
            // for (const obj of SubCommentBoxData) {
            //     if (!idSet.has(obj?.Title)) {
            //         idSet.add(obj?.Title);
            //         uniqueObjects.push(obj);
            //     }
            // }
            // SubCommentBoxData = uniqueObjects;
            if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
                let message = JSON.parse(EditData.FeedBack);
                let feedbackArray: any = [];
                if (message != null) {
                    feedbackArray = message[0]?.FeedBackDescriptions;
                }
                let tempArray: any = [];
                if (feedbackArray[0] != undefined) {
                    tempArray.push(feedbackArray[0]);
                } else {
                    let tempObject: any = {
                        Title: "<p> </p>",
                        Completed: false,
                        isAddComment: false,
                        isShowComment: false,
                        isPageType: "",
                    };
                    tempArray.push(tempObject);
                }

                CommentBoxData = tempArray;
                let result: any = [];
                if (SubCommentBoxData == "delete") {
                    result = tempArray;
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
                        });
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
                    result = CommentBoxData;
                } else {
                    result = CommentBoxData.concat(SubCommentBoxData);
                }
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }
        } else {
            if (!DesignNewTemplates) {
                updateFeedbackArray = JSON.parse(EditData?.FeedBack);
            }

        }
        let CategoriesTitle: any = "";
        let uniqueIds: any = {};

        const result: any = BackupTaskCategoriesData.filter((item: any) => {
            if (!uniqueIds[item.Id]) {
                uniqueIds[item.Id] = true;
                return true;
            }
            return false;
        });
        if (result != undefined && result?.length > 0) {
            result.map((typeData: any) => {
                CategoryTypeID.push(typeData.Id);
                if (CategoriesTitle?.length > 2) {
                    CategoriesTitle = CategoriesTitle + ";" + typeData.Title;
                } else {
                    CategoriesTitle = typeData.Title;
                }
            });
        }
        if (TaggedPortfolioData != undefined && TaggedPortfolioData?.length > 0) {
            TaggedPortfolioData?.map((com: any) => {
                smartComponentsIds = com.Id;
            });
        }
        if (linkedPortfolioData != undefined && linkedPortfolioData?.length > 0) {
            linkedPortfolioData?.map((com: any) => {
                RelevantPortfolioIds.push(com.Id);
            });
        }

        if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
            TaskAssignedTo?.map((taskInfo) => {
                if (taskInfo.AssingedToUserId != undefined) {
                    AssignedToIds.push(taskInfo.AssingedToUserId);
                }
                else {
                    AssignedToIds.push(taskInfo.Id);
                }

            });
        }

        // if (ApproverData != undefined && ApproverData?.length > 0) {
        //     ApproverData?.map((ApproverInfo) => {
        //         if (ApproverInfo.AssingedToUserId != undefined) {
        //             ApproverIds.push(ApproverInfo.AssingedToUserId)
        //         }
        //         else {
        //             ApproverIds.push(ApproverInfo.Id);
        //         }

        //     });
        // }

        if (WorkingAction != undefined && WorkingAction?.length > 0) {
            WorkingAction?.map((item) => {
                if (item?.Title == "Approval") {
                    if (item?.InformationData?.length > 0) {
                        item?.InformationData?.map((infoItem: any) => {
                            ApproverIds.push(infoItem?.TaggedUsers?.AssingedToUserId)
                        })
                    }
                }
            })
        }

        if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
            TaskTeamMembers?.map((taskInfo) => {
                if (taskInfo.AssingedToUserId != undefined) {
                    TeamMemberIds.push(taskInfo.AssingedToUserId)
                }
                else {
                    TeamMemberIds.push(taskInfo.Id);
                }

            });
        }

        let Priority: any;
        if (EditData.PriorityRank) {
            let rank = EditData.PriorityRank;
            if (rank <= 10 && rank >= 8) {
                Priority = "(1) High";
            }
            if (rank <= 7 && rank >= 4) {
                Priority = "(2) Normal";
            }

            if (rank <= 3 && rank >= 0) {
                Priority = "(3) Low";
            }
        }

        if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
            TaskResponsibleTeam?.map((taskInfo) => {
                if (taskInfo.AssingedToUserId != undefined) {
                    ResponsibleTeamIds.push(taskInfo.AssingedToUserId)
                }
                else {
                    ResponsibleTeamIds.push(taskInfo.Id);
                }

            });
        }
        if (
            selectedClientCategory != undefined &&
            selectedClientCategory.length > 0
        ) {
            selectedClientCategory?.map((itemData: any) => {
                ClientCategoryIDs.push(itemData.Id);
            });
        }

        let UpdateDataObject: any = {
            workingThisWeek: EditData.workingThisWeek
                ? EditData.workingThisWeek
                : null,
            waitForResponse: EditData.waitForResponse
                ? EditData.waitForResponse
                : null,
            PriorityRank: EditData.PriorityRank,
            ItemRank: EditData.ItemRank,
            Title: UpdateTaskInfo.Title ? UpdateTaskInfo.Title : EditData.Title,
            Priority: Priority,
            StartDate: EditData.StartDate
                ? Moment(EditData.StartDate).format("MM-DD-YYYY")
                : null,
            PercentComplete:
                UpdateTaskInfo.PercentCompleteStatus != ""
                    ? Number(UpdateTaskInfo.PercentCompleteStatus) / 100
                    : EditData.PercentComplete
                        ? EditData.PercentComplete / 100
                        : 0,
            Categories: CategoriesTitle ? CategoriesTitle : null,
            PortfolioId: smartComponentsIds === "" ? null : smartComponentsIds,
            RelevantPortfolioId: {
                results:
                    RelevantPortfolioIds != undefined && RelevantPortfolioIds?.length > 0
                        ? RelevantPortfolioIds
                        : [],
            },
            TaskCategoriesId: {
                results:
                    CategoryTypeID != undefined && CategoryTypeID.length > 0
                        ? CategoryTypeID
                        : [],
            },

            DueDate: EditData.DueDate
                ? Moment(EditData.DueDate).format("MM-DD-YYYY")
                : null,
            CompletedDate: EditData.CompletedDate
                ? Moment(EditData.CompletedDate).format("MM-DD-YYYY")
                : null,
            Status: taskStatus
                ? taskStatus
                : EditData.Status
                    ? EditData.Status
                    : null,
            Mileage: EditData.Mileage ? EditData.Mileage : "",
            AssignedToId: {
                results: AssignedToIds != undefined && AssignedToIds?.length > 0
                    ? AssignedToIds
                    : [],
            },
            ResponsibleTeamId: {
                results:
                    ResponsibleTeamIds != undefined && ResponsibleTeamIds.length > 0
                        ? ResponsibleTeamIds
                        : [],
            },
            TeamMembersId: {
                results:
                    TeamMemberIds != undefined && TeamMemberIds.length > 0
                        ? TeamMemberIds
                        : [],
            },
            FeedBack:
                updateFeedbackArray?.length > 0
                    ? JSON.stringify(updateFeedbackArray)
                    : null,
            ComponentLink: {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: EditData.Relevant_Url ? EditData.Relevant_Url : "",
                Url: EditData.Relevant_Url ? EditData.Relevant_Url : "",
            },
            ProjectId: selectedProject.length > 0 ? selectedProject[0].Id : null,
            ApproverId: {
                results:
                    ApproverIds != undefined && ApproverIds.length > 0 ? ApproverIds : [],
            },
            Sitestagging: SitesTaggingData?.length > 0 ? JSON.stringify(SitesTaggingData) : null,
            ClientCategoryId: {
                results:
                    ClientCategoryIDs != undefined && ClientCategoryIDs.length > 0
                        ? ClientCategoryIDs
                        : [],
            },
            ApproverHistory:
                ApproverHistoryData?.length > 0
                    ? JSON.stringify(ApproverHistoryData)
                    : null,
            EstimatedTime: EditData.EstimatedTime ? EditData.EstimatedTime : null,
            EstimatedTimeDescription: EditData.EstimatedTimeDescriptionArray
                ? JSON.stringify(EditData.EstimatedTimeDescriptionArray)
                : null,
            WorkingAction: WorkingAction?.length > 0 ? JSON.stringify(WorkingAction) : null
        };
        return UpdateDataObject;
    };

    // this is for change priority status function
    const ChangePriorityStatusFunction = (e: any) => {
        let value = e.target.value;
        if (Number(value) <= 10) {
            let updatedItem = {
                ...EditDataBackup,
                PriorityRank: Number(value),
            };
            let SmartPriority = globalCommon.calculateSmartPriority(updatedItem)
            updatedItem = {
                ...updatedItem,
                SmartPriority: SmartPriority
            }
            EditDataBackup = updatedItem;
            setEditData(updatedItem);
            // setEditData({ ...EditData, PriorityRank: e.target.value });
        } else {
            alert("Priority Status not should be greater than 10");
            setEditData({ ...EditData, PriorityRank: 0 });
        }
    };

    // *************************  This is for workingThisWeek,  IsTodaysTask, and waitForResponse Functions ****************************
    const changeStatus = (e: any, type: any) => {
        if (type == "workingThisWeek") {
            if (e.target.value === "true") {
                setEditData({ ...EditData, workingThisWeek: false });
            } else {
                setEditData({ ...EditData, workingThisWeek: true });
            }
        }
        if (type == "IsTodaysTask") {
            if (e.target.value === "true") {
                setEditData({ ...EditData, IsTodaysTask: false });
            } else {
                setEditData({ ...EditData, IsTodaysTask: true });
            }
        }
        if (type == "waitForResponse") {
            if (e.target.value === "true") {
                setEditData({ ...EditData, waitForResponse: false });
            } else {
                setEditData({ ...EditData, waitForResponse: true });
            }
        }
    };

    //    ************* This is Team configuration Component call Back function **************

    const getTeamConfigData = useCallback((teamConfigData: any, Type: any) => {
        if (Type == "TimeSheet") {
            const timesheetDatass = teamConfigData;
            console.log(timesheetDatass);
        } else {
            if (teamConfigData?.dateInfo?.length > 0) {
                let storeData: any = [];
                let storeInWorkingAction: any = { "Title": "WorkingDetails", "InformationData": [] }
                if (teamConfigData?.oldWorkingDaysInfo != undefined || teamConfigData?.oldWorkingDaysInfo != null && teamConfigData?.oldWorkingDaysInfo?.length > 0) {
                    teamConfigData?.oldWorkingDaysInfo.map((oldJson: any) => {
                        storeData?.push(oldJson)
                    })
                }
                teamConfigData?.dateInfo?.map((Info: any) => {
                    let dataAccordingDays: any = {}
                    if (Info?.userInformation?.length > 0) {
                        dataAccordingDays.WorkingDate = Info?.originalDate
                        dataAccordingDays.WorkingMember = [];
                        Info?.userInformation?.map((userInfo: any) => {

                            dataAccordingDays.WorkingMember.push({ Id: userInfo?.AssingedToUserId, Title: userInfo.Title })
                        })
                        storeData?.push(dataAccordingDays)
                    }
                })
                storeInWorkingAction.InformationData = [...storeData]
                oldWorkingAction = oldWorkingAction.filter((type: any) => type?.Title != "WorkingDetails");
                // let defaultTemp: any=[]
                if (oldWorkingAction?.length == 0) {
                    oldWorkingAction = [
                        {
                            Title: "Bottleneck",
                            InformationData: []
                        },
                        {
                            Title: "Attention",
                            InformationData: []
                        },
                        {
                            Title: "Phone",
                            InformationData: []
                        },
                        {
                            Title: "Approval",
                            InformationData: []
                        }
                    ]
                }
                setWorkingAction([...oldWorkingAction, storeInWorkingAction]);

            }

            if (teamConfigData?.AssignedTo?.length > 0) {
                let tempArray: any = [];
                if (teamConfigData?.AssignedTo?.length === EditDataBackup.AssignedTo?.length) {
                    let checkSendNotification: any = areTitlesSame(teamConfigData?.AssignedTo, EditDataBackup.AssignedTo);
                    if (!checkSendNotification) {
                        setTeamMemberChanged(true);
                    }
                } else {
                    setTeamMemberChanged(true);
                }
                teamConfigData.AssignedTo?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        tempArray.push(arrayData.AssingedToUser);
                    } else {
                        tempArray.push(arrayData);
                    }
                });
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
                        tempArray.push(arrayData.AssingedToUser);
                    } else {
                        tempArray.push(arrayData);
                    }
                });
                setTaskTeamMembers(tempArray);
                EditData.TeamMembers = tempArray;
            } else {
                setTaskTeamMembers([]);
                EditData.TeamMembers = [];
            }
            if (teamConfigData?.ResponsibleTeam?.length > 0) {
                let tempArray: any = [];
                if (teamConfigData?.ResponsibleTeam?.length === EditDataBackup.ResponsibleTeam?.length) {
                    let checkSendNotification: any = areTitlesSame(teamConfigData?.ResponsibleTeam, EditDataBackup.ResponsibleTeam);
                    if (!checkSendNotification) {
                        // setTeamLeaderChanged(true);
                    }
                } else {
                    // setTeamLeaderChanged(true);
                }
                teamConfigData.ResponsibleTeam?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        tempArray.push(arrayData.AssingedToUser);
                    } else {
                        tempArray.push(arrayData);
                    }
                });
                setTaskResponsibleTeam(tempArray);
                EditData.ResponsibleTeam = tempArray;
            } else {
                setTaskResponsibleTeam([]);
                EditData.ResponsibleTeam = [];
            }
        }
    }, []);


    // This is used for identify the duplicate data 

    function areTitlesSame(CurrentDataArray: any, PrevDataArray: any) {
        if (CurrentDataArray.length > 0 && PrevDataArray.length > 0) {
            if (CurrentDataArray.length !== PrevDataArray.length) {
                return false;
            }
            for (let i = 0; i < CurrentDataArray.length; i++) {
                if (CurrentDataArray[i].Title !== PrevDataArray[i].Title) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    // *************** This is footer section share This task function ***************
    const shareThisTaskFunction = (EmailData: any) => {
        let link =
            "mailTo:" +
            "?cc:" +
            "&subject=" +
            " [" +
            Items.Items.siteType +
            "-Task ] " +
            EmailData.Title +
            "&body=" +
            `${siteUrls}/SitePages/Task-Profile.aspx?taskId=${EmailData.ID}` +
            `%26Site%3D${Items.Items.siteType}`;
        window.location.href = link;
    };

    // ****************** This is used for Delete Task Functions **********************
    const deleteTaskFunction = async (TaskID: number, FunctionsType: any) => {
        let deletePost = confirm("Do you really want to delete this Task?");
        if (deletePost) {
            deleteItemFunction(TaskID, FunctionsType);
            Items.Call("Delete-Task")

        } else {
            console.log("Your Task has not been deleted");
            Items.Call()
        }
    };


    // this is used for send item in recycle bin ( Delete Function )

    const deleteItemFunction = async (itemId: any, FnType: any) => {
        let site = SelectedSite.replace(/^"|"$/g, "");
        try {
            if (Items.Items.listId != undefined) {
                let web = new Web(siteUrls);
                await web.lists
                    .getById(Items.Items.listId)
                    .items.getById(itemId)
                    .recycle();
            } else {
                let web = new Web(siteUrls);
                await web.lists
                    .getById(Items.Items.listName)
                    .items.getById(itemId)
                    .recycle();
            }
            if (Items.Items.Action == "Move") {
                let Url = `${siteUrls}/SitePages/Task-Profile.aspx?taskId=${newGeneratedId}&Site=${site}`;
                window.location.href = Url;
            }
            let SiteName = Items.Items.siteType;
            if (Items?.pageName == "TaskFooterTable") {
                let ItmesDelete: any = {
                    data: {
                        Id: itemId,
                        ItmesDelete: true,
                        siteName: SiteName,
                    },
                };
                Items.Call(ItmesDelete);
            } else {
                if (FnType == "Delete-Task") {
                    Items.Call("Delete");
                }
            }
            if (newGeneratedId != "" && newGeneratedId != undefined) {
                let Url = `${siteUrls}/SitePages/Task-Profile.aspx?taskId=${newGeneratedId}&Site=${site}`;
                window.location.href = Url;
                if (FnType == "Delete-Task") {
                    Items.Call("Delete");
                }
            }
            console.log("Your post has been deleted successfully");
        } catch (error) {
            console.log("Error In delete Item Function:", error.message);
        }
    };

    // ************* this is for FeedBack Comment Section Functions ************
    // this is Task description first index call back

    const CommentSectionCallBack = useCallback((EditorData: any) => {
        CommentBoxData = EditorData;
        BuildFeedBackArray();
    }, []);

    // this is Task description call back 

    const SubCommentSectionCallBack = useCallback((feedBackData: any) => {
        SubCommentBoxData = feedBackData;
        BuildFeedBackArray();
    }, []);

    // This is used for prepare the feedback data ( Task Description Data )

    const BuildFeedBackArray = () => {
        let PhoneCount = 0;
        let TempFeedBackArray: any = [];
        if (CommentBoxData?.length > 0 && SubCommentBoxData?.length > 0) {
            TempFeedBackArray = CommentBoxData.concat(SubCommentBoxData);
        }
        if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
            let message = JSON.parse(FeedBackBackupArray);
            let feedbackArray: any = [];
            if (message != null) {
                feedbackArray = message[0];
            }
            let tempArray: any = [];
            if (feedbackArray != undefined) {
                tempArray.push(feedbackArray);
            } else {
                let tempObject: any = {
                    Title: "<p> </p>",
                    Completed: false,
                    isAddComment: false,
                    isShowComment: false,
                    isPageType: "",
                    isShowLight: "",
                };
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
                });
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
                    setSendEmailGlobalCount(sendEmailGlobalCount + 1);
                    if (Status <= 3) {
                        setStatusOnChangeSmartLight(3);
                    }
                }
                if (item.Phone == true) {
                    PhoneCount = PhoneCount + 1;
                }
                if (item.Subtext?.length > 0) {
                    item.Subtext.map((subItem: any) => {
                        if (subItem.isShowLight == "Approve") {
                            ApprovedStatusCount++;
                            ApprovedGlobalCount++;
                            setSendEmailGlobalCount(sendEmailGlobalCount + 1);
                            if (Status <= 3) {

                                setStatusOnChangeSmartLight(3);
                            }
                        }
                        if (subItem.Phone == true) {
                            PhoneCount = PhoneCount + 1;
                        }
                    });
                }
            });
            TempFeedBackArray?.map((item: any) => {
                if (item.isShowLight == "Reject" || item.isShowLight == "Maybe") {
                    ApprovedGlobalCount++;
                    setSendEmailGlobalCount(sendEmailGlobalCount + 1);
                    if (ApprovedStatusCount == 0) {
                        if (Status >= 2 && Status < 70) {

                            setStatusOnChangeSmartLight(2);
                        }
                    }
                }
                if (item.Subtext?.length > 0) {
                    item.Subtext.map((subItem: any) => {
                        if (
                            subItem.isShowLight == "Reject" ||
                            subItem.isShowLight == "Maybe"
                        ) {
                            ApprovedGlobalCount++;
                            setSendEmailGlobalCount(sendEmailGlobalCount + 1);
                            if (ApprovedStatusCount == 0) {
                                if (Status <= 2 && Status < 70) {

                                    setStatusOnChangeSmartLight(2);
                                }
                            }
                        }
                        if (subItem.Phone == true) {
                            PhoneCount = PhoneCount + 1;
                        }
                    });
                }
                if (item.Phone == true) {
                    PhoneCount = PhoneCount + 1;
                }
            });
            if (ApprovedStatusCount == 0 && EditDataBackup?.PercentComplete > 0 && EditDataBackup?.PercentComplete < 5 && IsTaskStatusUpdated) {
                let teamMember = [];
                let AssignedTo = [];
                if (EditDataBackup?.Categories?.includes("Approval")) {
                    Items.sendRejectedMail = true
                    setTaskAssignedTo([])
                    setTaskTeamMembers([])
                    teamMember.push(EditDataBackup?.TeamMembers[0])
                    if (EditDataBackup?.Approvee != undefined) {
                        teamMember.push(EditDataBackup?.Approvee?.AssingedToUser)
                        AssignedTo.push(EditDataBackup?.Approvee?.AssingedToUser)
                        setTaskAssignedTo(AssignedTo)
                        setTaskTeamMembers(teamMember);

                    } else {

                        teamMember.push(EditDataBackup?.Author)
                        AssignedTo.push(EditDataBackup?.Author)
                        setTaskAssignedTo(AssignedTo)
                        setTaskTeamMembers(teamMember);

                    }
                }
                setApprovalTaskStatus(false);

            }
            else {
                let teamMember = [];
                let AssignedTo = [];
                if (EditDataBackup?.Categories?.includes("Approval") && EditDataBackup?.PercentComplete > 0 && EditDataBackup?.PercentComplete < 5 && IsTaskStatusUpdated) {
                    teamMember.push(currentUserBackupArray?.[0]?.AssingedToUser)
                    AssignedTo.push(currentUserBackupArray?.[0]?.AssingedToUser)
                    setTaskAssignedTo(AssignedTo)
                    setTaskTeamMembers(teamMember);
                    setApprovalTaskStatus(true);
                }
            }
        }
        if (PhoneCount > 0) {
            CategoryChangeUpdateFunction("false", "Phone");
        }
        EditDataBackup.FeedBackArray = TempFeedBackArray
    };

    const setStatusOnChangeSmartLight = (StatusInput: any) => {
        StatusOptions.map((percentStatus: any, index: number) => {
            if (percentStatus.value == StatusInput) {
                setTaskStatus(percentStatus.taskStatusComment);
                setPercentCompleteStatus(percentStatus.status);
                setUpdateTaskInfo({
                    ...UpdateTaskInfo,
                    PercentCompleteStatus: StatusInput,
                });
            }
        });
    };

    // ************ this is for Save And Add Time sheet function *************

    const SaveAndAddTimeSheet = () => {
        UpdateTaskInfoFunction("TimeSheetPopup");
        setTimeSheetPopup(true);
        setModalIsOpen(false);
    };
    const closeTimeSheetPopup = () => {
        setTimeSheetPopup(false);
        setModalIsOpenToFalse();
    };

    //***************** This is for Image Upload Section  Functions *****************

    const FroalaImageUploadComponentCallBack = (dt: any) => {
        setUploadBtnStatus(false);
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg",
        };
        let arrayIndex: any = TaskImages?.length;
        TaskImages.push(DataObject);
        if (dt?.length > 0) {
            onUploadImageFunction(TaskImages, [arrayIndex]);
        }
    };

    // this is used for hadneling the upload and replace image functions 

    const onUploadImageFunction = async (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        let lastindexArray = imageList[imageList.length - 1];
        let fileName: any = "";
        let tempArray: any = [];
        let SiteUrl = siteUrls;
        let CurrentSiteName: any = '';
        if (Items?.Items?.siteType == "Offshore%20Tasks" || Items?.Items?.siteType == "Offshore Tasks") {
            CurrentSiteName = "SharewebQA";
        } else {
            CurrentSiteName = Items.Items.siteType;
        }

        imageList?.map(async (imgItem: any, index: number) => {
            if (imgItem.data_url != undefined && imgItem.file != undefined) {
                let date = new Date();
                let timeStamp = date.getTime();
                let imageIndex = index + 1;
                fileName =
                    "T" +
                    EditData.Id +
                    "-Image" +
                    imageIndex +
                    "-" +
                    EditData.Title?.replace(/["/':?%]/g, "")?.slice(0, 40) +
                    " " +
                    timeStamp +
                    ".jpg";
                let currentUserDataObject: any;
                if (
                    currentUserBackupArray != null &&
                    currentUserBackupArray.length > 0
                ) {
                    currentUserDataObject = currentUserBackupArray[0];
                }
                let ImgArray = {
                    ImageName: fileName,
                    UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                    imageDataUrl:
                        SiteUrl +
                        "/Lists/" +
                        CurrentSiteName +
                        "/Attachments/" +
                        EditData?.Id +
                        "/" +
                        fileName,
                    ImageUrl: imgItem.data_url,
                    UserImage:
                        currentUserDataObject != undefined &&
                            currentUserDataObject.Item_x0020_Cover?.Url?.length > 0
                            ? currentUserDataObject.Item_x0020_Cover?.Url
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                    UserName:
                        currentUserDataObject != undefined &&
                            currentUserDataObject.Title?.length > 0
                            ? currentUserDataObject.Title
                            : Items.context.pageContext._user.displayName,
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
            if (updateIndex + 1 >= imageList.length) {
                UploadImageFunction(lastindexArray, fileName, tempArray);
            } else {
                if (updateIndex < imageList.length) {
                    ReplaceImageFunction(updateImage, updateIndex);
                }
            }
        }
    };

    // this is used for upload image on backend side 

    const UploadImageFunction = (Data: any, imageName: any, DataJson: any): Promise<any> => {
        return new Promise<void>(async (resolve, reject) => {
            setIsImageUploaded(false);
            let listId = Items.Items.listId;
            let listName = Items.Items.listName;
            let Id = Items.Items.Id;
            let src = Data.data_url?.split(",")[1];
            let byteArray = new Uint8Array(
                atob(src)
                    ?.split("")
                    ?.map(function (c) {
                        return c.charCodeAt(0);
                    })
            );
            const data = byteArray;
            let fileData = "";
            for (let i = 0; i < byteArray.byteLength; i++) {
                fileData += String.fromCharCode(byteArray[i]);
            }
            setTimeout(() => {
                if (Items.Items.listId != undefined) {
                    (async () => {
                        try {
                            let web = new Web(siteUrls);
                            let item = web.lists.getById(listId).items.getById(Id);
                            await item.attachmentFiles.add(imageName, data);
                            console.log("Attachment added");
                            UpdateBasicImageInfoJSON(DataJson, "Upload", 0);
                            EditData.UploadedImage = DataJson;
                            setUploadBtnStatus(false);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    })();
                } else {
                    (async () => {
                        try {
                            let web = new Web(siteUrls);
                            let item = web.lists.getByTitle(listName).items.getById(Id);
                            await item.attachmentFiles.add(imageName, data);
                            console.log("Attachment added");
                            UpdateBasicImageInfoJSON(DataJson, "Upload", 0);
                            EditData.UploadedImage = DataJson;
                            setUploadBtnStatus(false);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    })();
                }
            }, 2000);
        });
    };


    // this is a common function for updating the basic image info on Backend side when we upload image, replace image, and remove image

    const UpdateBasicImageInfoJSON = (JsonData: any, usedFor: string, ImageIndex: any) => {
        return new Promise<void>(async (resolve, reject) => {
            let UploadImageArray: any = [];

            if (JsonData != undefined && JsonData.length > 0) {
                JsonData?.map((imgItem: any, Index: any) => {
                    if (imgItem.ImageName != undefined && imgItem.ImageName != null) {
                        if (
                            imgItem.imageDataUrl != undefined &&
                            imgItem.imageDataUrl != null
                        ) {
                            let TimeStamp = Moment(new Date().toLocaleString());
                            let ImageUpdatedURL;
                            if (usedFor == "Update" && Index == ImageIndex) {
                                ImageUpdatedURL = imgItem.imageDataUrl + "?Updated=" + TimeStamp;
                            } else {
                                ImageUpdatedURL = imgItem.imageDataUrl;
                            }
                            let tempObject = {
                                ImageName: imgItem.ImageName,
                                ImageUrl: ImageUpdatedURL,
                                UploadeDate: imgItem.UploadeDate,
                                UserName: imgItem.UserName,
                                UserImage: imgItem.UserImage,
                                Description: imgItem.Description != undefined ? imgItem.Description : "",
                            };
                            UploadImageArray.push(tempObject);
                        } else {
                            let TimeStamp = Moment(new Date().toLocaleString());
                            let ImageUpdatedURL;
                            if (usedFor == "Update" && Index == ImageIndex) {
                                ImageUpdatedURL = imgItem.ImageUrl + "?Updated=" + TimeStamp;
                            } else {
                                ImageUpdatedURL = imgItem.ImageUrl;
                            }
                            imgItem.Description = imgItem.Description != undefined ? imgItem.Description : "";
                            imgItem.ImageUrl = ImageUpdatedURL;
                            UploadImageArray.push(imgItem);
                        }
                    }
                });
            }

            try {
                let web = new Web(siteUrls);
                await web.lists
                    .getById(Items.Items.listId)
                    .items.getById(Items.Items.Id)
                    .update({ BasicImageInfo: UploadImageArray?.length > 0 ? JSON.stringify(UploadImageArray) : null }).then(() => {
                        setIsImageUploaded(true);
                    });
                console.log("Image JSON Updated !!");
                AddImageDescriptionsIndex = undefined;
                resolve();
            } catch (error) {
                console.log("Error Message for updating basic image info function:", error);
                reject(error);
            }
        });
    };


    // this is used for deleting a image and update data on backend side

    const RemoveImageFunction = (imageIndex: any, imageName: any, FunctionType: any) => {
        return new Promise<void>(async (resolve, reject) => {
            let tempArray: any = [];
            setIsImageUploaded(false);
            if (FunctionType == "Remove") {
                TaskImages?.map((imageData, index) => {
                    if (index != imageIndex) {
                        tempArray.push(imageData);
                    }
                });
                setTaskImages(tempArray);
            }
            if (Items.Items.listId != undefined) {
                (async () => {
                    try {
                        let web = new Web(siteUrls);
                        let item = web.lists
                            .getById(Items.Items.listId)
                            .items.getById(Items.Items.Id);
                        await item.attachmentFiles.getByName(imageName).recycle();
                        await UpdateBasicImageInfoJSON(tempArray, "Upload", 0);
                        EditData.UploadedImage = tempArray;
                        console.log("Attachment deleted");
                        resolve();
                    } catch (error) {
                        console.log("Error deleting attachment:", error);
                        reject(error);
                    }
                })();
            } else {
                (async () => {
                    try {
                        let web = new Web(siteUrls);
                        let item = web.lists
                            .getByTitle(Items.Items.listName)
                            .items.getById(Items.Items.Id);
                        await item.attachmentFiles.getByName(imageName).recycle();
                        await UpdateBasicImageInfoJSON(tempArray, "Upload", 0);
                        EditData.UploadedImage = tempArray;
                        console.log("Attachment deleted");
                        resolve();
                    } catch (error) {
                        console.log("Error deleting attachment:", error);
                        reject(error);
                    }
                })();
            }
        });
    };

    // this is used for replace a image and update data on backend side

    const ReplaceImageFunction = (Data: any, ImageIndex: any) => {
        return new Promise<void>(async (resolve, reject) => {
            setIsImageUploaded(false);
            let ImageName = EditData?.UploadedImage[ImageIndex]?.ImageName;
            let src = Data?.data_url?.split(",")[1];
            let byteArray = new Uint8Array(
                atob(src)
                    ?.split("")
                    ?.map(function (c) {
                        return c.charCodeAt(0);
                    })
            );
            const data = byteArray;
            let fileData = "";
            for (let i = 0; i < byteArray.byteLength; i++) {
                fileData += String.fromCharCode(byteArray[i]);
            }
            if (siteUrls != undefined) {
                (async () => {
                    try {
                        let web = new Web(siteUrls);
                        let item = web.lists
                            .getById(Items.Items.listId)
                            .items.getById(Items.Items.Id);
                        await item.attachmentFiles.getByName(ImageName).setContent(data);
                        console.log("Attachment Updated");
                        await UpdateBasicImageInfoJSON(EditData.UploadedImage, "Update", ImageIndex);
                        setTaskImages(EditData.UploadedImage);
                        resolve();
                    } catch (error) {
                        console.log("Error updating attachment:", error);
                        reject(error);
                    }
                })();
            } else {
                (async () => {
                    try {
                        let web = new Web(siteUrls);
                        let item = web.lists
                            .getById(Items.Items.listName)
                            .items.getById(Items.Items.Id);
                        await item.attachmentFiles.getByName(ImageName).setContent(data);
                        console.log("Attachment Updated");
                        await UpdateBasicImageInfoJSON(EditData.UploadedImage, "Update", ImageIndex);
                        setTaskImages(EditData.UploadedImage);
                        resolve();
                    } catch (error) {
                        console.log("Error updating attachment:", error);
                        reject(error);
                    }
                })();
            }
        });
    };

    //  This is used for opening the Image Hover Model 

    const MouseHoverImageFunction = (e: any, HoverImageData: any) => {
        e.preventDefault();
        setHoverImageModal("Block");
        setHoverImageData([HoverImageData]);
    };


    const MouseOutImageFunction = (e: any) => {
        e.preventDefault();
        setHoverImageModal("None");
    };


    // This is used for compare image functionality 

    const ImageCompareFunction = (imageData: any, index: any) => {
        TaskImages[index].Checked = true;
        const isExists: any = () => {
            let count: any = 0;
            compareImageArray?.map((ImgItem: any) => {
                if (ImgItem.ImageName == imageData.ImageName) {
                    count++;
                }
            });
            return count;
        };
        if (!isExists()) {
            compareImageArray.push(imageData);
        }
        if (compareImageArray.length == 2) {
            setImageComparePopup(true);
        }
    };

    // this is used for close compare image panel function

    const ImageCompareFunctionClosePopup = () => {
        setImageComparePopup(false);
        setCompareImageArray([]);
        let tempArray: any = [];
        TaskImages?.map((dataItem: any) => {
            dataItem.Checked = false;
            tempArray.push(dataItem);
        });
        setTaskImages(tempArray);
    };

    const ImageCustomizeFunction = async (currentImagIndex: any) => {
        UpdateTaskInfoFunction("Image-Tab");
        setImageCustomizePopup(true);
        setModalIsOpen(false);
        setCurrentImageIndex(currentImagIndex);
    };
    const ImageCustomizeFunctionClosePopup = () => {
        setImageCustomizePopup(false);
        setModalIsOpen(true);
        UpdateTaskInfoFunction("Image-Tab");
        FeedBackCount++;
    };

    const CommonClosePopupFunction = () => {
        ImageCompareFunctionClosePopup();
        ImageCustomizeFunctionClosePopup();
    };

    const openReplaceImagePopup = (index: any) => {
        setReplaceImagePopup(true);
        ReplaceImageIndex = index;
    };

    // this is used for replace Image Popup callback function 

    const FroalaImageReplaceComponentCallBack = (dt: any) => {
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg",
        };
        ReplaceImageData = DataObject;
        console.log("Replace Image Data ======", DataObject);
    };

    // this is used for updating the uploaded image 

    const UpdateImage = () => {
        if (ReplaceImageData != undefined && ReplaceImageIndex != undefined) {
            ReplaceImageFunction(ReplaceImageData, ReplaceImageIndex);
            const copy = [...TaskImages];
            const ImageUrl = TaskImages[ReplaceImageIndex].ImageUrl;
            const obj = {
                ...TaskImages[ReplaceImageIndex],
                ImageUrl: ReplaceImageData.data_url,
                imageDataUrl: ImageUrl,
            };
            copy[ReplaceImageIndex] = obj;
            setTaskImages(copy);
            setReplaceImagePopup(false);
        }
    };
    const closeReplaceImagePopup = () => {
        setReplaceImagePopup(false);
    };

    // *************** this is used for adding description for images functions ******************

    const openAddImageDescriptionFunction = (Index: any, Data: any, type: any) => {
        setAddImageDescriptions(true);
        setAddDescriptionModelName(type);
        AddImageDescriptionsIndex = Index;
        if (type == "Bottleneck" || type == "Attention" || type == "Phone" || type == "Approval") {
            setAddImageDescriptionsDetails(Data.Comment != undefined ? Data.Comment : "")
        }
        if (type == "Image") {
            setAddImageDescriptionsDetails(
                Data.Description != undefined ? Data.Description : ""
            );
        }
    };
    const closeAddImageDescriptionFunction = () => {
        setAddImageDescriptions(false);
        // setAddImageDescriptionsIndex(-1);
        AddImageDescriptionsIndex = undefined;
    };


    // this is used for add description for images 

    const UpdateImageDescription = (e: any, UsedFor: string) => {
        if (UsedFor == "Image") {
            TaskImages[AddImageDescriptionsIndex].Description = e.target.value;
        }
        if (UsedFor == "Bottleneck" || UsedFor == "Attention" || UsedFor == "Phone" || UsedFor == "Approval") {
            let copyWorkAction: any = [...WorkingAction];
            if (copyWorkAction?.length > 0) {
                copyWorkAction?.map((DataItem: any) => {
                    if (DataItem.Title == UsedFor) {
                        DataItem.InformationData?.map((InfoData: any, Index: number) => {
                            if (Index == AddImageDescriptionsIndex) {
                                InfoData.Comment = e.target.value;
                            }
                        })
                    }
                })
            }
            console.log("Comment Added in working aaray", copyWorkAction)
            oldWorkingAction = []
            oldWorkingAction = [...copyWorkAction]
            setWorkingAction([...copyWorkAction])
        }
        setAddImageDescriptionsDetails(e.target.value);
    };



    const SaveImageDescription = (usedFor: string) => {
        if (usedFor == "Image") {
            UpdateBasicImageInfoJSON(TaskImages, "Upload", 0);
        }
        closeAddImageDescriptionFunction();
    };

    // ***************** this is for the Copy and Move Task Functions ***************

    const CopyAndMovePopupFunction = (Type: any) => {
        setIsCopyOrMovePanel(Type);
        setCopyAndMoveTaskPopup(true);
    };

    const closeCopyAndMovePopup = () => {
        setCopyAndMoveTaskPopup(false);
        setIsCopyOrMovePanel("");
        let tempArray: any = [];
        if (SiteTypeBackupArray != undefined && SiteTypeBackupArray.length > 0) {
            SiteTypeBackupArray?.map((dataItem: any) => {
                dataItem.isSelected = false;
                tempArray.push(dataItem);
            });
        }
        setSiteTypes(tempArray);
    };

    const selectSiteTypeFunction = (siteData: any) => {
        let tempArray: any = [];
        if (SiteTypeBackupArray != undefined && SiteTypeBackupArray.length > 0) {
            SiteTypeBackupArray?.map((siteItem: any) => {
                if (siteItem.Id == siteData.Id) {
                    if (siteItem.isSelected) {
                        siteItem.isSelected = false;
                    } else {
                        siteItem.isSelected = true;
                    }
                    tempArray.push(siteItem);
                } else {
                    siteItem.isSelected = false;
                    tempArray.push(siteItem);
                }
            });
        }
        setSiteTypes(tempArray);
    };

    const copyAndMoveTaskFunction = async (FunctionsType: number) => {
        let CopyAndMoveTaskStatus = confirm(`Are you sure want to copy/move task`);
        if (CopyAndMoveTaskStatus) {
            copyAndMoveTaskFunctionOnBackendSide(FunctionsType);
        } else {
            console.log("Your Task has not been deleted");
        }
    };


    // this is the main function for copy and move  task function 

    const copyAndMoveTaskFunctionOnBackendSide = async (FunctionsType: any) => {
        loadTime();
        let SelectedSiteImage: any = '';
        let TaskDataJSON: any = await MakeUpdateDataJSON();
        if (SiteTypes != undefined && SiteTypes.length > 0) {
            SiteTypes.map((dataItem: any) => {
                if (dataItem.isSelected == true) {
                    SelectedSite = dataItem.Title;
                    SelectedSiteImage = dataItem?.Item_x005F_x0020_Cover?.Url
                }
            });
        }
        let TempSitesTaggingData: any = [];
        let TempCCDataIds: any = [];
        if (SelectedSite?.toLowerCase() !== "shareweb") {
            let TempObject: any = {
                Title: SelectedSite,
                ClienTimeDescription: "100",
                SiteImages: SelectedSiteImage,
                Date: Moment(new Date()).format("DD/MM/YYYY")
            }
            TempSitesTaggingData.push(TempObject);
        } else {
            TempSitesTaggingData = SitesTaggingData;
        }

        if (selectedClientCategoryData?.length > 0) {
            selectedClientCategoryData?.map((selectedCC: any) => {
                if (SelectedSite?.toLowerCase() !== "shareweb") {
                    if (selectedCC.siteName == SelectedSite) {
                        TempCCDataIds.push(selectedCC.Id)
                    }
                } else {
                    TempCCDataIds.push(selectedCC.Id);
                }

            })
        }
        let UpdatedJSON = {
            EstimatedTimeDescription: FunctionsType == 'Copy-Task' ? null : EditData.EstimatedTimeDescription,
            Comments: FunctionsType == 'Copy-Task' ? null : EditData.Comments,
            DueDate: FunctionsType == 'Copy-Task' ? null : (EditData.DueDate ? Moment(EditData.DueDate).format("MM-DD-YYYY") : null),
            StartDate: FunctionsType == 'Copy-Task' ? null : (EditData.StartDate ? Moment(EditData.StartDate).format("MM-DD-YYYY") : null),
            Status: FunctionsType == 'Copy-Task' ? null : EditData.Status,
            WorkingAction: FunctionsType == 'Copy-Task' ? null : EditData.WorkingAction,
            PercentComplete: FunctionsType == 'Move-Task' ? (EditData.PercentComplete / 100) : 0.0001,
            TotalTime: FunctionsType == 'Copy-Task' ? 0 : EditData?.TotalTime,
            SmartInformationId: {
                results:
                    TempSmartInformationIds != undefined &&
                        TempSmartInformationIds.length > 0
                        ? TempSmartInformationIds
                        : [],
            },
            Sitestagging: TempSitesTaggingData?.length > 0 ? JSON.stringify(TempSitesTaggingData) : null,
            ClientCategoryId: {
                results:
                    TempCCDataIds?.length > 0
                        ? TempCCDataIds
                        : [],
            },
            TaskTypeId: EditData.TaskType?.Id ? EditData.TaskType?.Id : null
        };

        TaskDataJSON = { ...TaskDataJSON, ...UpdatedJSON };
        try {
            if (SelectedSite.length > 0) {
                let web = new Web(siteUrls);
                await web.lists
                    .getByTitle(SelectedSite)
                    .items.add(TaskDataJSON)
                    .then(async (res: any) => {
                        newGeneratedId = res.data.Id;
                        await CopyImageData(SelectedSite, res.data);
                        CopydocumentData(SelectedSite, res.data);

                        if (FunctionsType == "Copy-Task") {
                            setLoaded(true)
                            newGeneratedId = res.data.Id;
                            console.log(`Task Copied Successfully on ${SelectedSite} !!!!!`);
                            let url = `${siteUrls}/SitePages/Task-Profile.aspx?taskId=${newGeneratedId}&Site=${SelectedSite}`;
                            window.open(url);
                        } else {
                            console.log(`Task Moved Successfully on ${SelectedSite} !!!!!`);
                            if (timeSheetData != undefined && timeSheetData.length > 0) {
                                await moveTimeSheet(SelectedSite, res.data, 'move');
                            } else {
                                Items.Items.Action = "Move";
                                deleteItemFunction(Items.Items.Id, "Move");
                            }
                        }
                    });
            }
        } catch (error) {
            console.log("Copy-Task Error :", error);
        }
        closeCopyAndMovePopup();
    };


    // this is used for copy/ move documents 

    const CopydocumentData = async (NewList: any, NewItem: any) => {
        let ArrayData: any = [];
        let RelativeUrl = Items?.context?.pageContext?.web?.serverRelativeUrl;
        let web = new Web(siteUrls);
        await web.lists
            .getById(AllListIdData?.DocumentsListID)
            .items.select(
                `Id,Title,${Items?.Items.siteType}/Id,${Items?.Items.siteType}/Title`
            )
            .filter(`${Items?.Items.siteType}/Id eq ${Items?.Items.Id}`)
            .expand(`${Items?.Items.siteType}`)
            .get()
            .then(async (res: any) => {
                console.log(res);
                let MoveDataId = res[0]?.ID;
                ArrayData.push(NewItem.Id);
                let NewListData: any = NewList + "Id";
                await web.lists
                    .getById(AllListIdData?.DocumentsListID)
                    .items.getById(res[0]?.ID)
                    .update({
                        [NewListData]: { results: ArrayData },
                    })
                    .then(async (res: any) => {
                        console.log(res);
                    });
            });
    };

    // this is used for copy image related all information 

    const CopyImageData = async (NewList: any, NewItem: any) => {
        setLoaded(false)
        let attachmentFileName: any = "";
        let web = new Web(siteUrls);
        const response = await web.lists
            .getById(`${Items?.Items?.listId}`)
            .items.getById(Items?.Items?.Id)
            .select("Id,Title,Attachments,AttachmentFiles")
            .expand("AttachmentFiles")
            .get();
        await SaveImageDataOnLoop(response, NewList, NewItem);
    };

    // this is used for copy/ move task's images data in loop 

    const SaveImageDataOnLoop = async (response: any, NewList: any, NewItem: any) => {
        let tempArrayJsonData: any = [];
        let arrangedArray: any = []

        let currentUserDataObject: any;
        for (let index = 0; index < response?.AttachmentFiles?.length; index++) {
            const value = response.AttachmentFiles[index];
            const sourceEndpoint = `${siteUrls}/_api/web/lists/getbytitle('${Items?.Items?.siteType}')/items(${Items?.Items?.Id})/AttachmentFiles/getByFileName('${value.FileName}')/$value`;

            try {
                const response = await fetch(sourceEndpoint, {
                    method: "GET",
                    headers: {
                        Accept: "application/json;odata=nometadata",
                    },
                });

                if (response.ok) {
                    const binaryData = await response.arrayBuffer();
                    console.log("Binary Data:", binaryData);
                    let uint8Array = new Uint8Array(binaryData);
                    console.log(uint8Array);

                    console.log(uint8Array);
                    let fileName: any = "";
                    let date = new Date();
                    let timeStamp = date.getTime();
                    let imageIndex = index + 1;
                    let file =
                        "T" +
                        NewItem.Id +
                        "-Image" +
                        imageIndex +
                        "-" +
                        NewItem.Title?.replace(/["/':?]/g, "")?.slice(0, 40) +
                        " " +
                        timeStamp +
                        ".jpg";

                    // Your existing code for creating ImgArray
                    let ImgArray = {
                        ImageName: file,
                        UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                        ImageUrl:
                            siteUrls +
                            "/Lists/" +
                            NewList.replace("Offshore Tasks", "SharewebQA") +
                            "/Attachments/" +
                            NewItem?.Id +
                            "/" +
                            file,
                        UserImage:
                            currentUserDataObject != undefined &&
                                currentUserDataObject.Item_x0020_Cover?.Url?.length > 0
                                ? currentUserDataObject.Item_x0020_Cover?.Url
                                : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                        UserName:
                            currentUserDataObject != undefined &&
                                currentUserDataObject.Title?.length > 0
                                ? currentUserDataObject.Title
                                : Items.context.pageContext._user.displayName,
                        Description: "",
                    };
                    tempArrayJsonData.push(ImgArray);

                    if (tempArrayJsonData.length > 9) {
                        arrangedArray = tempArrayJsonData.slice(tempArrayJsonData?.length - 9).concat(tempArrayJsonData.slice(0, tempArrayJsonData?.length - 9));
                    } else {
                        arrangedArray = tempArrayJsonData
                    }
                    const item = await sp.web.lists.getByTitle(NewList).items.getById(NewItem?.Id).get();
                    const currentETag = item ? item['@odata.etag'] : null;
                    await sp.web.lists.getByTitle(NewList).items.getById(NewItem?.Id).attachmentFiles.add(file, uint8Array),
                        currentETag, { headers: { "If-Match": currentETag } }

                    ImageIndexCount++;
                } else {
                    console.error("Error:", response.statusText);
                }
            } catch (error) {
                console.log(error, "HHHH Time");
            }
        }

        // Call another function after all attachments are added
        await SaveJSONData(NewList, NewItem, arrangedArray);
    };


    // this is used for updating the basic image info for images after image attachment

    const SaveJSONData = async (NewList: any, NewItem: any, tempArrayJsonData: any) => {
        let arraydata = []
        let c = 1
        for (let i = 0; i < tempArrayJsonData.length; i++) {
            tempArrayJsonData[i].ImageName = tempArrayJsonData[i].ImageName.replace(/Image(\d+)/, `Image${c}`);
            c++
            arraydata.push(tempArrayJsonData[i])
        }
        console.log(arraydata)
        let web = new Web(siteUrls);
        let Data = await web.lists
            .getByTitle(NewList)
            .items.getById(NewItem.Id)
            .update({
                BasicImageInfo:
                    arraydata != undefined && arraydata.length > 0
                        ? JSON.stringify(arraydata)
                        : JSON.stringify(arraydata),
            });
        console.log(Data);
    };


    // this is used for moving task time sheet 

    const moveTimeSheet = async (SelectedSite: any, newItem: any, type: any) => {
        newGeneratedId = newItem.Id;
        let TimesheetConfiguration: any = [];
        let folderUri = "";
        let web = new Web(siteUrls);
        await web.lists
            .getByTitle(SelectedSite)
            .items.select("Id,Title")
            .filter(`Id eq ${newItem.Id}`)
            .get()
            .then(async (res) => {
                SiteId = res[0].Id;
                AllSitesData?.forEach((itemss: any) => {
                    if (itemss.Title == SelectedSite && itemss.TaxType == "Sites") {
                        TimesheetConfiguration = JSON.parse(itemss.Configurations);
                    }
                });
            });
        TimesheetConfiguration?.forEach((val: any) => {
            TimeSheetlistId = val.TimesheetListId;
            listName = val.TimesheetListName;
        });
        let count = 0;
        timeSheetData?.forEach(async (val: any) => {
            if (SelectedSite == 'Offshore Tasks') {
                SelectedSite = 'OffshoreTasks'
            }
            let siteType: any = "Task" + SelectedSite + "Id";
            let SiteId = "Task" + Items.Items.siteType;
            let Data = await web.lists
                .getById(TimeSheetlistId)
                .items.getById(val.Id)
                .update({
                    [siteType]: newItem.Id,
                })
                .then((res) => {
                    count++;
                    if (count == timeSheetData.length && type == 'move') {
                        Items.Items.Action = "Move";
                        setLoaded(true)
                        deleteItemFunction(Items.Items.Id, "Move");
                    }
                });
        });
        let UpdatedData: any = {};
    };

    // ************** this is for Project Management Section Functions ************

    const autoSuggestionsForProject = (e: any) => {
        let searchedKey: any = e.target.value;
        setProjectSearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AllProjectData?.map((itemData: any) => {
                if (itemData.Path.toLowerCase().includes(searchedKey.toLowerCase()) || itemData.TaskID.toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            });
            setSearchedProjectData(tempArray);
        } else {
            setSearchedProjectData([]);
        }
    };

    const SelectProjectFromAutoSuggestion = (data: any) => {
        setProjectSearchKey("");
        setSearchedProjectData([]);
        setSelectedProject(data);
        let updatedItem = {
            ...EditDataBackup,
            Project: data,
        };
        let SmartPriority = globalCommon.calculateSmartPriority(updatedItem)
        updatedItem = {
            ...updatedItem,
            SmartPriority: SmartPriority
        }
        EditDataBackup = updatedItem;
        setEditData(updatedItem);
        globalSelectedProject = data;

    };

    // ************ this is for Approver Popup Function And Approver Related All Functions section **************
    const OpenApproverPopupFunction = () => {
        setApproverPopupStatus(true);
    };
    const closeApproverPopup = () => {
        setApproverPopupStatus(false);
        if (
            TaskApproverBackupArray != undefined &&
            TaskApproverBackupArray.length > 0
        ) {
            setApproverData(TaskApproverBackupArray);
        } else if (
            TaskCreatorApproverBackupArray != undefined &&
            TaskCreatorApproverBackupArray.length > 0
        ) {
            setApproverData(TaskCreatorApproverBackupArray);
        }
    };

    // this is used for Approval feature with working action  JSON 

    const UpdateApproverFunction = () => {
        let data: any = ApproverData;
        if (useFor == "Approval") {
            setTaskAssignedTo([...ApproverData])
            setTaskTeamMembers([...ApproverData])
            ApproverData.map((item) => {
                TaskAssignedTo.filter((assignItems) => assignItems.Id != item.Id)
                TaskTeamMembers.filter((assignItems) => assignItems.Id != item.Id)
            })
            if (ApproverData.length <= 0) {
                updateWAForApproval(true, "IsChecked")
            }
        }
        if (useFor == "Bottleneck" || useFor == "Attention" || useFor == "Phone" || useFor == "Approval") {
            let CreatorData: any = currentUserBackupArray[0];
            let workingDetail: any = WorkingAction?.filter((type: any) => type?.Title == "WorkingDetails");
            let copyWorkAction: any = [...WorkingAction]
            copyWorkAction = WorkingAction?.filter((type: any) => type?.Title != "WorkingDetails");
            if (data?.length > 0) {
                data?.map((selectedData: any) => {
                    if (selectedData?.Id != undefined) {
                        let CreateObject: any = {
                            CreatorName: CreatorData?.Title,
                            CreatorImage: CreatorData?.UserImage,
                            CreatorID: CreatorData?.Id,
                            TaggedUsers: {
                                Title: selectedData?.Title,
                                Email: selectedData?.Email,
                                AssingedToUserId: selectedData?.AssingedToUserId,
                                userImage: selectedData?.Item_x0020_Cover?.Url,
                            },
                            NotificationSend: false,
                            Comment: '',
                            CreatedOn: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY"),
                        }
                        if (copyWorkAction?.length > 0) {
                            copyWorkAction?.map((DataItem: any) => {
                                if (DataItem.Title == useFor) {
                                    CreateObject.Id = DataItem?.InformationData?.length;
                                    DataItem?.InformationData.push(CreateObject);
                                }
                            })
                        } else {
                            let TempArrya: any = [
                                {
                                    Title: "Bottleneck",
                                    InformationData: []
                                },
                                {
                                    Title: "Attention",
                                    InformationData: []
                                },
                                {
                                    Title: "Phone",
                                    InformationData: []
                                },
                                {
                                    Title: "Approval",
                                    InformationData: []
                                }
                            ]
                            TempArrya?.map((TempItem: any) => {
                                if (TempItem.Title == useFor) {
                                    CreateObject.Id = TempItem?.InformationData?.length;
                                    TempItem?.InformationData.push(CreateObject);
                                }
                            })
                            copyWorkAction = TempArrya;
                        }
                    }
                })
            }
            oldWorkingAction = [...copyWorkAction];
            setWorkingAction([...copyWorkAction, ...workingDetail]);
            console.log("Bottleneck All Details:", copyWorkAction);
            setUseFor("")
            setApproverPopupStatus(false)
        }
        else {
            setApproverPopupStatus(false);
            setApproverData(data);
            if (useFor == "Approval") {
                setTaskAssignedTo(ApproverData);
                setTaskTeamMembers(ApproverData);
            }
            StatusOptions?.map((item: any) => {
                if (item.value == 1) {
                    Items.sendApproverMail = true;
                    setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: "1" });
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            });
        }

    };

    const selectApproverFunction = (selectedData: any) => {
        let checkduplicateData: any = ApproverData.filter((data: any) => data?.AssingedToUserId == selectedData?.AssingedToUserId)
        if (checkduplicateData?.length == 0) {
            setApproverData([...ApproverData, selectedData]);
        }
    };



    const autoSuggestionsForApprover = (e: any, type: any) => {
        let searchedKey: any = e.target.value;
        if (type == "Bottleneck") {
            setBottleneckSearchKey(e.target.value)
        }
        if (type == "Attention") {
            setAttentionSearchKey(e.target.value)
        }
        if (type == "Phone") {
            setPhoneSearchKey(e.target.value)
        }
        if (type == "OnTaskPopup" || type == "Approval") {
            setApproverSearchKey(e.target.value);
        }
        if (type == "OnPanel" || type == "Approval") {
            setApproverSearchKey(e.target.value);
        }
        let tempArray: any = [];

        if (searchedKey?.length > 0) {
            AllEmployeeData?.map((itemData: any) => {
                if (itemData.Child != undefined && itemData.Child.length > 0) {
                    itemData.Child.map((childData: any) => {
                        if (
                            childData.NewLabel.toLowerCase().includes(
                                searchedKey.toLowerCase()
                            )
                        ) {
                            tempArray.push(childData);
                        }
                    });
                }
            });

            if (type == "OnTaskPopup" || type == "Approval") {
                setApproverSearchedData(tempArray);
            }
            if (type == "Bottleneck") {
                setBottleneckSearchedData(tempArray);
            }
            if (type == "Attention") {
                setAttentionSearchedData(tempArray);
            }
            if (type == "Phone") {
                setPhoneSearchedData(tempArray);
            }
            if (type == "OnPanel" || type == "Approval") {
                setApproverSearchedDataForPopup(tempArray);
            }
        } else {
            setApproverSearchedData([]);
            setBottleneckSearchedData([]);
            setAttentionSearchedData([]);
            setPhoneSearchedData([]);
            setApproverSearchedDataForPopup([]);
        }
    };



    // this is used for update working action JSOn for Approval Secanrios 


    const updateWAForApproval = (Value: any, key: string) => {
        let copyWorkAction: any = [...WorkingAction];
        const usedFor: string = "Approval";
        let CreatorData: any = currentUserBackupArray[0];
        let ApproverDataInfo: any = [];
        let CreateObject: any = {};
        if (taskUsers?.length > 0) {
            taskUsers?.forEach((UserItem: any) => {
                CreatorData?.Approver?.forEach((RecipientsItem: any) => {
                    if (UserItem.AssingedToUserId == RecipientsItem.Id) {
                        ApproverDataInfo.push(UserItem);
                    }
                });
            });
        }
        if (key == "IsChecked") {
            if (Value == true) {
                setApprovalStatus(false);
                if (copyWorkAction?.length > 0) {
                    copyWorkAction?.forEach((DataItem: any) => {
                        if (DataItem.Title == "Approval") {
                            DataItem.InformationData = [];
                            setTaskAssignedTo([]);
                            setTaskTeamMembers([]);
                            setApproverData([]);
                            DataItem[key] = false;
                            DataItem.Type = "";
                            StatusOptions?.map((item: any) => {
                                if (0 == item.value) {
                                    setPercentCompleteStatus(item.status);
                                    setTaskStatus(item.taskStatusComment);
                                    setUpdateTaskInfo({
                                        ...UpdateTaskInfo,
                                        PercentCompleteStatus: "0",
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                setApprovalStatus(true);
                isApprovalByStatus = true;
                const dataArray = ApproverDataInfo.map((approver: any) => ({
                    CreatorName: CreatorData?.Title,
                    CreatorImage: CreatorData?.UserImage,
                    CreatorID: CreatorData?.Id,
                    TaggedUsers: {
                        Title: approver?.Title,
                        Email: approver?.Email,
                        AssingedToUserId: approver?.AssingedToUserId,
                        userImage: approver?.Item_x0020_Cover?.Url,
                    },
                    NotificationSend: false,
                    Comment: '',
                    CreatedOn: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY"),
                }));

                if (copyWorkAction?.length > 0) {
                    copyWorkAction?.forEach((DataItem: any) => {
                        if (DataItem.Title == usedFor) {
                            if (DataItem.InformationData.length > 0) {
                                let aproveInfoData = dataArray.concat(DataItem.InformationData)
                                DataItem.InformationData = aproveInfoData;
                                DataItem[key] = Value;
                            } else {
                                DataItem.InformationData = dataArray;
                                DataItem[key] = Value;
                            }
                        }
                    });
                } else {
                    let TempArrya: any = [
                        {
                            Title: "Bottleneck",
                            InformationData: []
                        },
                        {
                            Title: "Attention",
                            InformationData: []
                        },
                        {
                            Title: "Phone",
                            InformationData: []
                        },
                        {
                            Title: "Approval",
                            InformationData: []
                        }
                    ]
                    TempArrya?.map((TempItem: any) => {
                        if (TempItem.Title == usedFor) {
                            CreateObject.Id = TempItem.InformationData?.length;
                            TempItem[key] = Value;
                            TempItem.InformationData = dataArray;
                        }
                    })
                    copyWorkAction = TempArrya;
                }

                let tempArray: any = [];
                if (currentUserData != undefined && currentUserData.length > 0) {
                    currentUserData.map((dataItem: any) => {
                        dataItem?.Approver.map((items: any) => {
                            tempArray.push(items);
                        });
                    });
                }
                const finalData = tempArray.filter(
                    (val: any, id: any, array: any) => {
                        return array?.indexOf(val) == id;
                    }
                );
                EditData.TaskApprovers = finalData;
                EditData.CurrentUserData = currentUserData;
                setApproverData(finalData);
                setApprovalStatus(true);
                Items.sendApproverMail = true;
                StatusOptions?.map((item: any) => {
                    if (item.value == 1) {
                        setUpdateTaskInfo({
                            ...UpdateTaskInfo,
                            PercentCompleteStatus: "1",
                        });
                        setPercentCompleteStatus(item.status);
                        setTaskStatus(item.taskStatusComment);
                        setPercentCompleteCheck(false);
                    }
                });
            }
        }
        else {
            if (copyWorkAction?.length > 0) {
                copyWorkAction?.map((DataItem: any) => {
                    if (DataItem.Title == usedFor) {
                        if (DataItem?.InformationData?.length > 0) {
                            DataItem[key] = Value;
                        } else {
                            alert("You haven’t checked the approval. First, check the approval checkbox, and then select the approval type.")
                        }
                    }
                })
            } else {
                alert("You haven’t checked the approval. First, check the approval checkbox, and then select the approval type.")
            }
        }
        setWorkingAction([...copyWorkAction]);
    }

    // this is a common function for auto suggetions for the Task Users also used for workingAction

    const SelectApproverFromAutoSuggestion = (ApproverData: any, usedFor: string) => {
        setApproverSearchedData([]);
        setApproverSearchedDataForPopup([]);
        setAttentionSearchedData([]);
        setPhoneSearchedData([]);
        setApproverSearchKey("");
        setBottleneckSearchKey("");
        setPhoneSearchKey("");
        setAttentionSearchKey("");
        setBottleneckSearchedData([]);
        if (usedFor == "Bottleneck" || usedFor == "Attention" || usedFor == "Phone" || usedFor == "Approval") {
            let CreatorData: any = currentUserBackupArray[0];
            let copyWorkAction: any = [...WorkingAction]
            let CreateObject: any = {
                CreatorName: CreatorData?.Title,
                CreatorImage: CreatorData?.UserImage,
                CreatorID: CreatorData?.Id,
                TaggedUsers: {
                    Title: ApproverData?.Title,
                    Email: ApproverData?.Email,
                    AssingedToUserId: ApproverData?.AssingedToUserId,
                    userImage: ApproverData?.Item_x0020_Cover?.Url,
                },
                NotificationSend: false,
                Comment: '',
                CreatedOn: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY"),
            }
            if (copyWorkAction?.length > 0) {
                copyWorkAction?.map((DataItem: any) => {
                    if (DataItem.Title == usedFor) {
                        CreateObject.Id = DataItem.InformationData?.length;
                        DataItem.InformationData.push(CreateObject);
                    }
                })
            } else {
                let TempArrya: any = [
                    {
                        Title: "Bottleneck",
                        InformationData: []
                    },
                    {
                        Title: "Attention",
                        InformationData: []
                    },
                    {
                        Title: "Phone",
                        InformationData: []
                    },
                    {
                        Title: "Approval",
                        InformationData: []
                    }
                ]
                TempArrya?.map((TempItem: any) => {
                    if (TempItem.Title == usedFor) {
                        CreateObject.Id = TempItem.InformationData?.length;
                        TempItem.InformationData.push(CreateObject);
                    }
                })
                copyWorkAction = TempArrya;
            }
            setWorkingAction([...copyWorkAction]);
            console.log("Bottleneck All Details:", copyWorkAction)
        }
        if (useFor == "Approval") {
            let ApproverHistoryObject: any
            selectApproverFunction(ApproverData);
            setTaskAssignedTo([ApproverData]);
            setTaskTeamMembers([ApproverData]);
            TaskApproverBackupArray = [ApproverData];
            StatusOptions?.map((item: any) => {
                if (item.value == 1) {
                    Items.sendApproverMail = true;
                    setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: "1" });
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            });
            ApproverHistoryObject = {
                ApproverName: ApproverData.Title,
                ApprovedDate: Moment(new Date())
                    .tz("Europe/Berlin")
                    .format("DD MMM YYYY HH:mm"),
                ApproverId: ApproverData.AssingedToUserId,
                ApproverImage:
                    ApproverData.Item_x0020_Cover != undefined ||
                        ApproverData.Item_x0020_Cover != null
                        ? ApproverData.Item_x0020_Cover.Url
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                ApproverSuffix: ApproverData.Suffix,
                ApproverEmail: ApproverData.Email,
            };
            ApproverHistoryData.push(ApproverHistoryObject);
        }
    };


    // *********** this is for Send Email Notification for Approval Category Task Functions ****************************

    const SendEmailNotificationCallBack = useCallback((items: any) => {
        setSendEmailComponentStatus(false);
        setSendEmailNotification(false);
        Items.Call(items);
    }, []);

    // ************************ this is for Site Composition Component Section Functions ***************************

    const SmartTotalTimeCallBack = useCallback((TotalTime: any) => {

    }, []);

    const closeSiteCompsotionPanelFunction = (FnType: any) => {
        if (FnType == "Save") {
            setTimeout(() => {
                GetExtraLookupColumnData();
            }, 1000);
        }
        setSiteCompositionShow(false);
    };


    // these functions are used for fill Estimated Task Time 

    const UpdateEstimatedTimeDescriptions = (e: any) => {
        if (e.target.name == "Description") {
            setEstimatedDescription(e.target.value);
        }
        if (e.target.name == "Time") {
            setEstimatedTime(e.target.value);
        }
    };

    const SaveEstimatedTimeDescription = () => {
        let TimeStamp: any = Moment(new Date().toLocaleString());
        let PresentDate: any = Moment(new Date()).format("MM-DD-YYYY");
        let TempTotalTimeData: any = 0;
        if (EstimatedTime > 0 && EstimatedDescriptionCategory?.length > 0) {
            let EstimatedTimeDescriptionsJSON: any = {
                EstimatedTime: EstimatedTime,
                EstimatedTimeDescription: EstimatedDescription,
                Category: EstimatedDescriptionCategory,
                CreatedDate: PresentDate,
                TimeStamp: "" + TimeStamp,
                UserName: currentUserData[0].Title,
                UserImage:
                    currentUserData[0].Item_x0020_Cover?.Url?.length > 0
                        ? currentUserData[0].Item_x0020_Cover?.Url
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                AssignedToId: currentUserData[0].AssingedToUserId,
            };
            if (
                EditData != undefined &&
                (EditData?.EstimatedTimeDescriptionArray == null ||
                    EditData?.EstimatedTimeDescriptionArray == undefined)
            ) {
                setEditData({
                    ...EditData,
                    EstimatedTimeDescriptionArray: [EstimatedTimeDescriptionsJSON],
                });
                TempTotalTimeData = EstimatedTime;
            } else {
                if (EditData?.EstimatedTimeDescriptionArray?.length > 0) {
                    EditData?.EstimatedTimeDescriptionArray?.push(
                        EstimatedTimeDescriptionsJSON
                    );
                    let tempArray: any = EditData.EstimatedTimeDescriptionArray;
                    setEditData({
                        ...EditData,
                        EstimatedTimeDescriptionArray: tempArray,
                    });
                }
            }
            if (EditData?.EstimatedTimeDescriptionArray?.length > 0) {
                EditData?.EstimatedTimeDescriptionArray?.map((ETDItem: any) => {
                    TempTotalTimeData =
                        Number(TempTotalTimeData) + Number(ETDItem.EstimatedTime);
                });
            }
            setTotalEstimatedTime(TempTotalTimeData);
            setEstimatedDescription("");
            setEstimatedTime("");
            setEstimatedDescriptionCategory("");
        } else {
            if (EstimatedTime == 0 || EstimatedTime == undefined) {
                alert("Please Enter Estimated Time");
            }
            if (
                EstimatedDescriptionCategory.length == 0 ||
                EstimatedDescriptionCategory == undefined
            ) {
                alert("Please Enter Catgory");
            }
        }
    };

    const removeAssignedMember = (value: any) => {
        const beforeItemDelete: any = ApproverData.filter((item: any) => item.Title == value.Title)
        const afterItemDelete: any = ApproverData.filter((item: any) => item.Title != value.Title)
        setApproverData(afterItemDelete)
        if (useFor == "Bottleneck" || useFor == "Attention" || useFor == "Phone" || useFor == "Approval") {
            WorkingAction.map((item: any) => {
                if (item.Title == useFor) {
                    item.InformationData.map((infoItem: any, index: any) => {
                        beforeItemDelete.map((approveItem: any) => {
                            if (infoItem.TaggedUsers.AssingedToUserId == approveItem.AssingedToUserId) {
                                item.InformationData.splice(index, 1)
                            }
                        })
                    })
                }
            })
        }
    }
    // this is used for updating workingAction JSON Data on Backedn Side 

    const UpdateWorkingActionJSON = async (DataForUpdate: any) => {
        try {
            let web = new Web(siteUrls);
            await web.lists
                .getById(Items.Items.listId)
                .items.getById(Items.Items.Id)
                .update({ WorkingAction: DataForUpdate?.length > 0 ? JSON.stringify(DataForUpdate) : null })
        } catch (error) {
            console.log("Error", error.message)
        }
    }

    // this is used for bottleneck and Attehntion category task functionality

    const BottleneckAndAttentionFunction = (InfoData: any, Index: number, usedFor: string, ActionType: string) => {
        if (usedFor == "Reminder") {
            if (InfoData?.NotificationSend == true) {
                let RequiredData: any = {
                    ReceiverName: InfoData.TaggedUsers?.Title,
                    sendUserEmail: [InfoData.TaggedUsers?.Email],
                    Context: Context,
                    ActionType: ActionType,
                    ReasonStatement: InfoData.Comment,
                    UpdatedDataObject: EditDataBackup,
                    RequiredListIds: AllListIdData
                }
                GlobalFunctionForUpdateItems.MSTeamsReminderMessage(RequiredData);
                alert("The reminder has been sent to the user.");
            } else {
                alert(`This user has not been tagged as a ${ActionType} yet, so you cannot send a reminder now.`);
            }
        }
        if (usedFor == "Remove") {
            let CopyWorkingActionData: any = [...WorkingAction];
            let TempWorkingActionData: any = removeDataFromInformationData(CopyWorkingActionData, ActionType, Index);
            EditData.WorkingAction = [...TempWorkingActionData]
            console.log("Updated Data after removing User:", TempWorkingActionData);
            setWorkingAction([...EditData.WorkingAction])
        }

        let currentApprover: any = [];

        WorkingAction?.map((WAItemData: any, ItemIndex: number) => {
            if (WAItemData.Title == "Approval" && WAItemData?.InformationData?.length > 0) {
                WAItemData?.InformationData?.map((item: any) => {
                    currentApprover.push(item?.TaggedUsers)
                })
            }
        })

        if (ActionType == "Approval") {
            if (currentApprover.length <= 0) {
                updateWAForApproval(true, "IsChecked")
            }
            setTaskAssignedTo(currentApprover)
            setTaskTeamMembers(currentApprover)
            setApproverData(currentApprover)
        }


    }


    //    This is used to remove the Tagged User Data form Bottleneck and attention
    function removeDataFromInformationData(dataArray: any, titleToRemove: any, indexToRemove: any) {
        return dataArray.map((item: any) => {
            if (item.Title === titleToRemove && Array.isArray(item.InformationData)) {
                item.InformationData.splice(indexToRemove, 1);
            }
            return item;
        });
    }

    // this is a common function for open select Task user Popup for workingAction 

    const openTaskUserPopup = (usefor: any) => {
        let selectedtagMember: any = [];
        setUseFor(usefor)
        setApproverPopupStatus(true)
        WorkingAction?.map((WAItemData: any, ItemIndex: number) => {
            if (WAItemData.Title == usefor && WAItemData?.InformationData?.length > 0) {
                WAItemData?.InformationData?.map((item: any) => {
                    item.Id = item?.TaggedUsers?.AssingedToUserId;
                    selectedtagMember.push(item?.TaggedUsers)
                })
            }
        })
        setApproverData(selectedtagMember)
    }

    const onRenderCustomHeaderMain = () => {
        return (
            <>
                <div
                    className="subheading alignCenter"
                >
                    <img className="imgWid29 pe-1" src={Items.Items.SiteIcon} />
                    <span className="siteColor">
                        {EditData.TaskId != undefined || EditData.TaskId != null ?
                            <ReactPopperTooltipSingleLevel CMSToolId={EditData.TaskId} AllListId={AllListIdData} row={EditData} singleLevel={true} masterTaskData={GlobalServiceAndComponentData} AllSitesTaskData={AllDataSites} /> : ''}
                        {`   ${EditData.Title != undefined || EditData.Title != null
                            ? `${"  "} ${EditData.Title}`
                            : ""
                            }`}
                    </span>
                </div>
                <RecurringTask props={Items} WorkingAction={WorkingAction} setWorkingAction={setWorkingAction} EditData={EditData} setEditData={setEditData}/>
                <Tooltip ComponentId="1683" isServiceTask={false} setShowPencilIcon={setShowPencilIcon} ShowPencilIcon={ShowPencilIcon} />
            </>
        );
    };
    const onRenderStatusPanelHeader = () => {
        return (
            <div
                className="d-flex full-width pb-1">
                <div className="subheading">
                    <span className="siteColor">
                        {SmartMetaDataUsedPanel == "Status"
                            ? `Update Status`
                            : `Select Category`}
                    </span>
                </div>
                <Tooltip
                    ComponentId={SmartMetaDataUsedPanel == "Status" ? "6840" : "1735"}
                    isServiceTask={false}
                />
            </div>
        );
    };

    const onRenderCustomHeaderCopyAndMoveTaskPanel = () => {
        return (
            <div
                className="d-flex full-width pb-1"
            >
                <div className="subheading">
                    <img className="imgWid29 pe-1 mb-1 " src={Items.Items.SiteIcon} />
                    <span className="siteCOlor">Select Site</span>
                </div>
                <Tooltip ComponentId="1683" isServiceTask={false} />
            </div>
        );
    };
    const onRenderCustomHeaderAddImageDescription = () => {
        return (
            <div
                className="d-flex full-width pb-1"
            >
                <div className="subheading">Add {AddDescriptionModelName} Descriptions</div>
                <Tooltip ComponentId="1683" isServiceTask={false} />
            </div>
        );
    };
    const onRenderCustomReplaceImageHeader = () => {
        return (
            <div
                className="d-flex full-width pb-1"
            >
                <div className="subheading siteColor">Replace Image</div>
                <Tooltip ComponentId="6776" isServiceTask={false} />
            </div>
        );
    };

    const onRenderCustomApproverHeader = () => {
        return (
            <>
                <div className="subheading"> {useFor != "" ? `Select ${useFor}` : `Select Approver`}</div>
                <Tooltip ComponentId="1683" isServiceTask={false} />
            </>
        );
    };

    const onRenderCustomFooterMain = () => {
        return (
            <footer
                className="bg-f4 fixed-bottom"
            >
                <div className="align-items-center d-flex justify-content-between px-4 py-2">
                    <div>
                        <div className="">
                            Created{" "}
                            <span className="font-weight-normal siteColor">
                                {" "}
                                {EditData.Created
                                    ? Moment(EditData.Created).format("DD/MM/YYYY")
                                    : ""}{" "}
                            </span>{" "}
                            By{" "}
                            <span className="font-weight-normal siteColor">
                                {EditData.Author?.Title ? EditData.Author?.Title : ""}
                            </span>
                        </div>
                        <div>
                            Last modified{" "}
                            <span className="font-weight-normal siteColor">
                                {" "}
                                {EditData.Modified
                                    ? Moment(EditData.Modified).format("DD/MM/YYYY")
                                    : ""}
                            </span>{" "}
                            By{" "}
                            <span className="font-weight-normal siteColor">
                                {EditData.Editor?.Title ? EditData.Editor.Title : ""}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink siteColor me-1">
                                <span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span>
                                <span
                                    onClick={() => deleteTaskFunction(EditData.ID, "Delete-Task")}
                                >
                                    Delete This Item
                                </span>
                            </a>
                            {SiteTypes?.length > 2 ? <>
                                <span> | </span>
                                <a
                                    className="hreflink"
                                    onClick={() => CopyAndMovePopupFunction("Copy-Task")}
                                >
                                    Copy Task
                                </a>
                                <span> | </span>
                                <a
                                    className="hreflink"
                                    onClick={() => CopyAndMovePopupFunction("Move-Task")}
                                >
                                    {" "}
                                    Move Task
                                </a>{" "}
                            </> : null}
                            |
                            <span>
                                {EditData.ID ? (
                                    <VersionHistory
                                        taskId={EditData.Id}
                                        listId={Items.Items.listId}
                                        siteUrls={siteUrls}
                                        RequiredListIds={AllListIdData}
                                    />
                                ) : null}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="footer-right">
                            <span>
                                <a
                                    className="mx-2 siteColor"
                                    target="_blank"
                                    data-interception="off"
                                    href={`${siteUrls}/SitePages/Task-Profile.aspx?taskId=${EditData.ID}&Site=${Items.Items.siteType}`}
                                >
                                    Go To Profile Page
                                </a>
                            </span>{" "}
                            ||
                            <span>
                                <a
                                    className="mx-2 hreflink siteColor"
                                    onClick={SaveAndAddTimeSheet}
                                >
                                    Save & Add Time-Sheet
                                </a>
                            </span>{" "}
                            ||
                            <span
                                className="hreflink mx-2 siteColor f-mailicons"
                                onClick={() => shareThisTaskFunction(EditData)}
                            >
                                <span
                                    title="Edit Task"
                                    className="svg__iconbox svg__icon--mail"
                                ></span>
                                Share This Task
                            </span>{" "}
                            ||

                            <a
                                target="_blank"
                                className="mx-2"
                                data-interception="off"
                                href={`${siteUrls}/Lists/${Items.Items.siteType !== "Offshore%20Tasks" ? Items.Items.siteType : "SharewebQA"}/EditForm.aspx?ID=${EditData.ID}`}
                            >
                                Open Out-Of-The-Box Form
                            </a>

                            <span>
                                <button
                                    className={IsImageUploaded ? "btn btn-primary mx-1 px-3" : "btn btn-primary disabled mx-1 px-3"}
                                    onClick={UpdateTaskInfoFunction}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-default px-3"
                                    onClick={setModalIsOpenToFalse}
                                >
                                    Cancel
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    };
    const onRenderCustomFooterOther = () => {
        return (
            <footer
                className="bg-f4 fixed-bottom"
            >
                <div className="align-items-center d-flex justify-content-between px-4 py-2">
                    <div>
                        <div className="">
                            Created{" "}
                            <span className="font-weight-normal siteColor">
                                {" "}
                                {EditData.Created
                                    ? Moment(EditData.Created).format("DD/MM/YYYY")
                                    : ""}{" "}
                            </span>{" "}
                            By{" "}
                            <span className="font-weight-normal siteColor">
                                {EditData.Author?.Title ? EditData.Author?.Title : ""}
                            </span>
                        </div>
                        <div>
                            Last modified{" "}
                            <span className="font-weight-normal siteColor">
                                {" "}
                                {EditData.Modified
                                    ? Moment(EditData.Modified).format("DD/MM/YYYY")
                                    : ""}
                            </span>{" "}
                            By{" "}
                            <span className="font-weight-normal siteColor">
                                {EditData.Editor?.Title ? EditData.Editor.Title : ""}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink">
                                <span className="me-1 mt--5">
                                    <RiDeleteBin6Line />
                                </span>
                                <span
                                    onClick={() => deleteTaskFunction(EditData.ID, "Delete-Task")}
                                >
                                    Delete This Item
                                </span>
                            </a>
                            {SiteTypes?.length > 2 ? <>
                                <span> | </span>
                                <a
                                    className="hreflink"
                                    onClick={() => CopyAndMovePopupFunction("Copy-Task")}
                                >
                                    Copy Task
                                </a>
                                <span> | </span>
                                <a
                                    className="hreflink"
                                    onClick={() => CopyAndMovePopupFunction("Move-Task")}
                                >
                                    {" "}
                                    Move Task
                                </a>{" "}
                            </> : null}
                            |
                            <span>
                                {EditData.ID ? (
                                    <VersionHistory
                                        taskId={EditData.Id}
                                        listId={Items.Items.listId}
                                        siteUrls={siteUrls}
                                        RequiredListIds={AllListIdData}
                                    />
                                ) : null}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="footer-right">
                            <span>
                                <a
                                    className="mx-2"
                                    target="_blank"
                                    data-interception="off"
                                    href={`${Items.Items.siteType}/SitePages/Task-Profile.aspx?taskId=${EditData.ID}&Site=${Items.Items.siteType}`}
                                >
                                    Go To Profile Page
                                </a>
                            </span>{" "}
                            ||
                            <span>
                                <a className="mx-2 hreflink" onClick={SaveAndAddTimeSheet}>
                                    Save & Add Time-Sheet
                                </a>
                            </span>{" "}
                            ||
                            <span
                                className="hreflink siteColor f-mailicons"
                                onClick={() => shareThisTaskFunction(EditData)}
                            >
                                <span
                                    title="Edit Task"
                                    className="svg__iconbox svg__icon--mail"
                                ></span>
                                Share This Task
                            </span>{" "}
                            ||
                            <a
                                target="_blank"
                                className="mx-2"
                                data-interception="off"
                                href={`${siteUrls}/Lists/${Items.Items.siteType !== "Offshore%20Tasks" ? Items.Items.siteType : "SharewebQA"}/EditForm.aspx?ID=${EditData.ID}`}
                            >
                                Open Out-Of-The-Box Form
                            </a>
                            <span>
                                <button
                                    type="button"
                                    className="btn btn-default ms-1 px-3"
                                    onClick={CommonClosePopupFunction}
                                >
                                    Close
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    };

    // code by vivek
    const DesignTemplatesCallback = (designFeedbackData: any) => {
        updateFeedbackArray[0].FeedBackDescriptions = designFeedbackData

    }
    return (
        <div
            className={`${EditData.Id}`}
        >

            {/* ***************** this is status panel *********** */}
            <Panel
                onRenderHeader={onRenderStatusPanelHeader}
                isOpen={SmartMetaDataUsedPanel?.length > 0}
                onDismiss={() => setSmartMetaDataUsedPanel("")}
                isBlocking={SmartMetaDataUsedPanel?.length > 0}
            >
                <div>
                    <div className="modal-body">
                        <div className="TaskStatus">
                            <div>
                                {SmartMetaDataUsedPanel === "Status" ? (
                                    <div>
                                        {StatusOptions?.map((item: any, index: any) => {
                                            return (
                                                <li key={index}>
                                                    <div
                                                        className={
                                                            IsUserFromHHHHTeam
                                                                ? "form-check"
                                                                : !IsUserFromHHHHTeam && item.value == 100
                                                                    ? "form-check Disabled-Link bg-e9 py-1"
                                                                    : "form-check"
                                                        }
                                                    >
                                                        <label className="SpfxCheckRadio">
                                                            <input
                                                                className="radio"
                                                                type="radio"
                                                                checked={
                                                                    (PercentCompleteCheck
                                                                        ? EditData.PercentComplete
                                                                        : UpdateTaskInfo.PercentCompleteStatus) ==
                                                                    item.value
                                                                }
                                                                onClick={() =>
                                                                    SmartMetaDataPanelSelectDataFunction(
                                                                        item,
                                                                        "Status"
                                                                    )
                                                                }
                                                            />
                                                            {item.status}{" "}
                                                        </label>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </div>
                                ) : null}
                                {SmartMetaDataUsedPanel === "Estimated-Time" ? (
                                    <div>
                                        {SmartMetaDataAllItems?.TimeSheetCategory?.map(
                                            (item: any, index: any) => {
                                                return (
                                                    <li key={index}>
                                                        <div className="form-check ">
                                                            <label className="SpfxCheckRadio">
                                                                <input
                                                                    className="radio"
                                                                    type="radio"
                                                                    onClick={() =>
                                                                        SmartMetaDataPanelSelectDataFunction(
                                                                            item.Title,
                                                                            "Estimated-Time"
                                                                        )
                                                                    }
                                                                />
                                                                {item.Title}
                                                            </label>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
            {/* ***************** this is Save And Time Sheet panel *********** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                isOpen={TimeSheetPopup}
                type={PanelType.custom}
                customWidth="850px"
                onDismiss={closeTimeSheetPopup}
                isBlocking={TimeSheetPopup}
            >
                <div className="modal-body">
                    <TimeEntryPopup props={Items.Items} />
                    <footer className="bg-f4">
                        <div className="card-footer">
                            <button
                                className="btn btn-primary px-4 float-end"
                                onClick={closeTimeSheetPopup}
                            >
                                OK
                            </button>
                            <button
                                type="button"
                                className="btn btn-default me-1 float-end px-3"
                                onClick={closeTimeSheetPopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </footer>
                </div>
            </Panel>

            {/* ************ this is On-Hold Panel ************ */}
            {onHoldPanel ?

                <OnHoldCommentCard
                    siteUrl={siteUrls}
                    ItemId={Items.Items.Id}
                    AllListIds={AllListIdData}
                    Context={Context}
                    callback={editTaskPopupCallBack}
                    usedFor="Task-Popup"
                    CommentFor={SendCategoryName}
                />
                : null}

            {/* ***************** this is Main Panel *********** */}
            <Panel
                type={PanelType.large}
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}
            >
                <div>
                    {!loaded ? <PageLoader /> : ''}
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
                                {/* TASK INFORMATION */}
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
                                {/* TASK PLANNING */}
                                TEAM & TIMESHEET
                            </button>
                            {IsUserFromHHHHTeam ? null : (
                                <button
                                    className="nav-link"
                                    id="BACKGROUND-COMMENT"
                                    data-bs-toggle="tab"
                                    data-bs-target="#BACKGROUNDCOMMENT"
                                    type="button"
                                    role="tab"
                                    aria-controls="BACKGROUNDCOMMENT"
                                    aria-selected="false"
                                >
                                    {/* REMARKS */}
                                    BACKGROUND
                                </button>
                            )}
                        </ul>
                        <div
                            className="border border-top-0 clearfix p-3 tab-content "
                            id="myTabContent"
                        >
                            <div
                                className="tab-pane show active"
                                id="BASICINFORMATION"
                                role="tabpanel"
                                aria-labelledby="BASICINFORMATION"
                            >
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="col-12 ">
                                            <div className="input-group">
                                                <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Title"} />
                                                {/* <div className="d-flex justify-content-between align-items-center mb-0  full-width">
                                                    Title </div> */}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Task Name"
                                                    defaultValue={EditData.Title}
                                                    onChange={(e) =>
                                                        setUpdateTaskInfo({
                                                            ...UpdateTaskInfo,
                                                            Title: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="mx-0 row taskdate ">
                                            <div className="col-6 ps-0 mt-2">
                                                <div className="input-group ">
                                                    <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"StartDate"} />
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        max="9999-12-31"
                                                        value={
                                                            EditData.StartDate
                                                                ? Moment(EditData.StartDate).format("YYYY-MM-DD")
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...EditData,
                                                                StartDate: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 mt-2">
                                                <div className="input-group ">
                                                    <div className="form-label full-width alignCenter">
                                                        <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"dueDate"} onlyText={"text"} />
                                                        <span title="Re-occurring Due Date">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input rounded-0 ms-2"
                                                            />
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        placeholder="Enter Due Date"
                                                        max="9999-12-31"
                                                        value={
                                                            EditData.DueDate
                                                                ? Moment(EditData.DueDate).format("YYYY-MM-DD")
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...EditData,
                                                                DueDate: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 mt-2">
                                                <div className="input-group ">
                                                    <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"CompletedDate"} />
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        max="9999-12-31"
                                                        value={
                                                            EditData.CompletedDate
                                                                ? Moment(EditData.CompletedDate).format("YYYY-MM-DD")
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...EditData,
                                                                CompletedDate: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 mt-2">
                                                <div className="input-group">
                                                    {/* <label className="form-label full-width">
                                                        Item Rank
                                                    </label> */}
                                                    <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"ItemRank"} />
                                                    <select
                                                        className="form-select"
                                                        defaultValue={EditData.ItemRank}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...EditData,
                                                                ItemRank: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        {ItemRankArray.map(function (h: any, i: any) {
                                                            return (
                                                                <option
                                                                    key={i}
                                                                    selected={EditData.ItemRank == h.rank}
                                                                    value={h.rank}
                                                                >
                                                                    {h.rankTitle}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mx-0 row mt-2 taskservices">
                                            <div className="col-md-6  ps-0">
                                                <div className="input-group mb-2">
                                                    <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"PortfolioItem"} />
                                                    {TaggedPortfolioData?.length > 0 ? (
                                                        <div className="full-width">
                                                            {TaggedPortfolioData?.map((com: any) => {
                                                                return (
                                                                    <div className="full-width replaceInput alignCenter">
                                                                        <a
                                                                            title={com.Title}
                                                                            target="_blank"
                                                                            data-interception="off"
                                                                            className="textDotted"
                                                                            href={`${siteUrls}/SitePages/Portfolio-Profile.aspx?taskId=${com.Id}`}
                                                                        >
                                                                            {com.Title}
                                                                        </a>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (

                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={SearchedServiceComponentKey}
                                                            onChange={(e) =>
                                                                autoSuggestionsForServiceAndComponent(
                                                                    e,
                                                                    "Portfolio"
                                                                )
                                                            }
                                                            placeholder="Search Portfolio Item"
                                                        />
                                                    )}
                                                    <span className="input-group-text">
                                                        <span
                                                            title="Component Popup"
                                                            onClick={() =>
                                                                OpenTeamPortfolioPopupFunction(
                                                                    EditData,
                                                                    "Portfolio"
                                                                )
                                                            }
                                                            className="svg__iconbox svg__icon--editBox"
                                                        ></span>
                                                    </span>
                                                    {SearchedServiceComponentData?.length > 0 ? (
                                                        <div className="SmartTableOnTaskPopup">
                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                {SearchedServiceComponentData.map((Item: any) => {
                                                                    return (
                                                                        <li
                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                            key={Item.id}
                                                                            onClick={() =>
                                                                                setSelectedServiceAndComponentData(
                                                                                    Item,
                                                                                    "Single"
                                                                                )
                                                                            }
                                                                        >
                                                                            <a>{Item.Path}</a>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="input-group mb-2">
                                                    <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Categories"} />
                                                    {TaskCategoriesData?.length > 1 ? <>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="txtCategories"
                                                            placeholder="Search Category Here"
                                                            value={categorySearchKey}
                                                            onChange={(e) => autoSuggestionsForCategory(e)}
                                                        />
                                                        {SearchedCategoryData?.length > 0 ? (
                                                            <div className="SmartTableOnTaskPopup">
                                                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                    {SearchedCategoryData.map((item: any) => {
                                                                        return (
                                                                            <li
                                                                                className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                key={item.id}
                                                                                onClick={() =>
                                                                                    setSelectedCategoryData(
                                                                                        [item],
                                                                                        "For-Auto-Search"
                                                                                    )
                                                                                }
                                                                            >
                                                                                <a>{item.Newlabel}</a>
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        ) : null}
                                                        {TaskCategoriesData?.map(
                                                            (type: any, index: number) => {

                                                                return (
                                                                    <div className="block w-100">
                                                                        <a
                                                                            style={{ color: "#fff !important" }}
                                                                            className="textDotted"
                                                                        >
                                                                            {type.Title}
                                                                        </a>
                                                                        <span
                                                                            onClick={() =>
                                                                                removeCategoryItem(
                                                                                    type.Title
                                                                                )
                                                                            }
                                                                            className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                        ></span>
                                                                    </div>
                                                                );


                                                            }
                                                        )}</> :
                                                        <>
                                                            {TaskCategoriesData?.length == 1 ?

                                                                <div className="full-width">
                                                                    {TaskCategoriesData?.map((CategoryItem: any) => {
                                                                        return (
                                                                            <div className="full-width replaceInput alignCenter">
                                                                                <a
                                                                                    title={CategoryItem.Title}
                                                                                    target="_blank"
                                                                                    data-interception="off"
                                                                                    className="textDotted"
                                                                                >
                                                                                    {CategoryItem.Title}
                                                                                </a>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                :
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="txtCategories"
                                                                        placeholder="Search Category Here"
                                                                        value={categorySearchKey}
                                                                        onChange={(e) => autoSuggestionsForCategory(e)}
                                                                    />
                                                                    {SearchedCategoryData?.length > 0 ? (
                                                                        <div className="SmartTableOnTaskPopup">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {SearchedCategoryData.map((item: any) => {
                                                                                    return (
                                                                                        <li
                                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                            key={item.id}
                                                                                            onClick={() =>
                                                                                                setSelectedCategoryData(
                                                                                                    [item],
                                                                                                    "For-Auto-Search"
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <a>{item.Newlabel}</a>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    ) : null}
                                                                </>
                                                            }

                                                        </>

                                                    }

                                                    <span
                                                        className="input-group-text"
                                                        title="Smart Category Popup"
                                                        onClick={(e) =>
                                                            EditComponentPicker(EditData, "Categories")
                                                        }
                                                    >
                                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                                    </span>
                                                </div>

                                            </div>
                                            <div className="col-6 ps-0 pe-0">
                                                <div className="row">
                                                    <div className="time-status col-md-6">
                                                        <div className="input-group">
                                                            <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Priority"} />
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Priority"
                                                                value={
                                                                    EditData.PriorityRank
                                                                        ? EditData.PriorityRank
                                                                        : ""
                                                                }
                                                                onChange={(e) => ChangePriorityStatusFunction(e)}
                                                            />
                                                        </div>
                                                        <ul className="p-0 my-1">
                                                            <li className="form-check ">
                                                                <label className="SpfxCheckRadio">
                                                                    <input
                                                                        className="radio"
                                                                        name="radioPriority"
                                                                        type="radio"
                                                                        checked={
                                                                            EditData.PriorityRank <= 10 &&
                                                                            EditData.PriorityRank >= 8
                                                                        }
                                                                        onChange={() =>
                                                                            ChangePriorityStatusFunction({
                                                                                target: {
                                                                                    value: 8
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                    High{" "}
                                                                </label>
                                                            </li>
                                                            <li className="form-check ">
                                                                <label className="SpfxCheckRadio">
                                                                    <input
                                                                        className="radio"
                                                                        name="radioPriority"
                                                                        type="radio"
                                                                        checked={
                                                                            EditData.PriorityRank <= 7 &&
                                                                            EditData.PriorityRank >= 4
                                                                        }
                                                                        onChange={() =>
                                                                            ChangePriorityStatusFunction({
                                                                                target: {
                                                                                    value: 4
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                    Normal{" "}
                                                                </label>
                                                            </li>
                                                            <li className="form-check ">
                                                                <label className="SpfxCheckRadio">
                                                                    <input
                                                                        className="radio"
                                                                        name="radioPriority"
                                                                        type="radio"
                                                                        checked={
                                                                            EditData.PriorityRank <= 3 &&
                                                                            EditData.PriorityRank > 0
                                                                        }
                                                                        onChange={() =>
                                                                            ChangePriorityStatusFunction({
                                                                                target: {
                                                                                    value: 1
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                    Low{" "}
                                                                </label>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-group">
                                                            <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"SmartPriority"} />
                                                            <div className="bg-e9 w-100 py-1 px-2" style={{ border: '1px solid #CDD4DB' }}>
                                                                <span className={EditData?.SmartPriority != undefined ? "hover-text hreflink m-0 siteColor sxsvc" : "hover-text hreflink m-0 siteColor cssc"}>
                                                                    <>{EditData?.SmartPriority != undefined ? EditData?.SmartPriority : 0}</>
                                                                    <span className="tooltip-text pop-right">
                                                                        {EditData?.showFormulaOnHover != undefined ?

                                                                            <SmartPriorityHover editValue={EditData} /> : ""}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="col-12 mb-2">
                                                    <div className="input-group ">
                                                        <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"ClientActivity"} />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Client Activity"
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-12"
                                                    title="Relevant Portfolio Items"
                                                >
                                                    <div className="input-group">
                                                        <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"LinkedComponentTask"} />
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            className="form-control "
                                                        />
                                                        <span
                                                            className="input-group-text"
                                                            title="Linked Component Task Popup"
                                                            onClick={(e) =>
                                                                alert(
                                                                    "We are working on It. This Feature Will Be Live Soon..."
                                                                )
                                                            }
                                                        >
                                                            <span className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-2 mt-2">
                                                    <div className="input-group mb-2">
                                                        <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"LinkedPortfolioItems"} />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={SearchedLinkedPortfolioKey}
                                                            onChange={(e) =>
                                                                autoSuggestionsForServiceAndComponent(
                                                                    e,
                                                                    "Linked-Portfolios"
                                                                )
                                                            }
                                                            placeholder="Search Portfolio Items"
                                                        />
                                                        <span className="input-group-text">
                                                            <span
                                                                title="Component Popup"
                                                                onClick={() =>
                                                                    OpenTeamPortfolioPopupFunction(
                                                                        EditData,
                                                                        "Linked-Portfolios"
                                                                    )
                                                                }
                                                                className="svg__iconbox svg__icon--editBox"
                                                            ></span>
                                                        </span>
                                                        {SearchedLinkedPortfolioData?.length > 0 ? (
                                                            <div className="SmartTableOnTaskPopup">
                                                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                    {SearchedLinkedPortfolioData.map(
                                                                        (Item: any) => {
                                                                            return (
                                                                                <li
                                                                                    className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                    key={Item.id}
                                                                                    onClick={() =>
                                                                                        setSelectedServiceAndComponentData(
                                                                                            Item,
                                                                                            "Multi"
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <a>{Item.Path}</a>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    {linkedPortfolioData?.length > 0 ? (
                                                        <div className="full-width">
                                                            {linkedPortfolioData?.map(
                                                                (com: any, Index: any) => {
                                                                    return (
                                                                        <>
                                                                            <div className="block w-100">
                                                                                <a
                                                                                    title={com.Title}
                                                                                    className="wid90"
                                                                                    style={{ color: "#fff !important" }}
                                                                                    target="_blank"
                                                                                    data-interception="off"
                                                                                    href={`${siteUrls}/SitePages/Portfolio-Profile.aspx?taskId=${com.Id}`}
                                                                                >
                                                                                    {com.Title}
                                                                                </a>

                                                                                <span
                                                                                    onClick={() =>
                                                                                        RemoveLinkedPortfolio(Index)
                                                                                    }
                                                                                    className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                                ></span>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="col-12">
                                                    <div className="input-group">
                                                        <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Project"} />
                                                        {selectedProject != undefined &&
                                                            selectedProject.length > 0 ? (
                                                            <>
                                                                {selectedProject?.map((ProjectData: any) => {
                                                                    return (
                                                                        <>
                                                                            {ProjectData.Title != undefined ? (
                                                                                <div className="full-width replaceInput alignCenter">
                                                                                    <a

                                                                                        target="_blank"
                                                                                        title={ProjectData.Title}
                                                                                        data-interception="off"
                                                                                        className="textDotted hreflink"
                                                                                        href={`${siteUrls}/SitePages/PX-Profile.aspx?ProjectId=${ProjectData.Id}`}
                                                                                    >
                                                                                        {ProjectData.Title}
                                                                                    </a>
                                                                                </div>
                                                                            ) : null}
                                                                        </>
                                                                    );
                                                                })}
                                                            </>
                                                        ) :
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Search Project Here"
                                                                value={ProjectSearchKey}
                                                                onChange={(e) => autoSuggestionsForProject(e)}
                                                            />
                                                        }
                                                        <span
                                                            className="input-group-text"
                                                            onClick={() => setProjectManagementPopup(true)}
                                                            title="Project Items Popup"
                                                        >
                                                            <span className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>
                                                        {SearchedProjectData?.length > 0 ? (
                                                            <div className="SmartTableOnTaskPopup" style={{ width: "max-content" }}>
                                                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                    {SearchedProjectData.map((item: any) => {
                                                                        return (
                                                                            <li
                                                                                className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                key={item.id}
                                                                                onClick={() =>
                                                                                    SelectProjectFromAutoSuggestion([item])
                                                                                }
                                                                            >
                                                                                <a>
                                                                                    <span>
                                                                                        {item?.Item_x0020_Type == "Sprint" ?
                                                                                            <div title={item?.Item_x0020_Type} style={{ backgroundColor: `${item?.PortfolioType?.Color}` }} className={"Dyicons me-1"}>
                                                                                                X
                                                                                            </div>
                                                                                            :
                                                                                            <div title={item?.Item_x0020_Type} style={{ backgroundColor: `${item?.PortfolioType?.Color}` }} className={"Dyicons me-1"}>
                                                                                                P
                                                                                            </div>
                                                                                        }
                                                                                    </span>
                                                                                    {item?.TaskID}-{item?.Path}
                                                                                </a>
                                                                            </li>
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-2 taskurl">
                                            <div className="input-group">
                                                <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"RelevantURL"} />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    defaultValue={
                                                        EditData.ComponentLink != null
                                                            ? EditData.Relevant_Url
                                                            : ""
                                                    }
                                                    placeholder="Url"
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...EditData,
                                                            Relevant_Url: e.target.value,
                                                        })
                                                    }
                                                />
                                                <span
                                                    className={
                                                        EditData.ComponentLink != null
                                                            ? "input-group-text"
                                                            : "input-group-text Disabled-Link"
                                                    }
                                                >
                                                    <a
                                                        target="_blank"
                                                        href={
                                                            EditData.ComponentLink != null
                                                                ? EditData.ComponentLink.Url
                                                                : ""
                                                        }
                                                        data-interception="off"
                                                    >
                                                        <span title="Open in New Tab" className="svg__iconbox svg__icon--link"></span>
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        {AllListIdData.isShowSiteCompostion ? (
                                            <div className="Sitecomposition mb-2">
                                                <div className="dropdown">
                                                    <a className="sitebutton bg-fxdark alignCenter justify-content-between">
                                                        <div className="alignCenter"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() =>
                                                                setComposition(composition ? false : true)
                                                            }
                                                        >
                                                            <span>
                                                                {composition ? (
                                                                    <SlArrowDown />
                                                                ) : (
                                                                    <SlArrowRight />
                                                                )}
                                                            </span>
                                                            <span className="mx-2 alignCenter">   <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"SiteComposition"} onlyText={"text"} /></span>
                                                        </div>
                                                        <span
                                                            className="svg__iconbox svg__icon--editBox hreflink"
                                                            title="Edit Site Composition"
                                                            onClick={() => setSiteCompositionShow(true)}
                                                        ></span>
                                                    </a>
                                                    {composition &&
                                                        EditData.siteCompositionData?.length > 0 ? (
                                                        <div className="spxdropdown-menu">
                                                            <ul>
                                                                {EditData.siteCompositionData != undefined &&
                                                                    EditData.siteCompositionData?.length > 0 ? (
                                                                    <>
                                                                        {EditData.siteCompositionData?.map(
                                                                            (SiteDtls: any, i: any) => {
                                                                                return (
                                                                                    <li className="Sitelist">
                                                                                        <span className="ms-2" title={SiteDtls.Title}>
                                                                                            <img
                                                                                                style={{ width: "22px" }}
                                                                                                src={SiteDtls.SiteImages}
                                                                                            />
                                                                                        </span>

                                                                                        {SiteDtls.ClienTimeDescription !=
                                                                                            undefined && (
                                                                                                <span className="mx-2">
                                                                                                    {Number(
                                                                                                        SiteDtls.ClienTimeDescription
                                                                                                    ).toFixed(1)}
                                                                                                    %
                                                                                                </span>
                                                                                            )}

                                                                                        <span className="d-inline">
                                                                                            {SiteDtls.ClientCategory != undefined && SiteDtls.ClientCategory.length > 0 ? SiteDtls.ClientCategory?.map((clientcat: any, Index: any) => {
                                                                                                return (
                                                                                                    <div className={Index == SiteDtls.ClientCategory?.length - 1 ? "mb-0" : "mb-0 border-bottom"}>{clientcat.Title}</div>
                                                                                                )
                                                                                            }) : null}
                                                                                        </span>

                                                                                    </li>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </>
                                                                ) : null}
                                                            </ul>
                                                        </div>
                                                    ) : null}
                                                    {EditData.siteCompositionData?.length > 0 ? (
                                                        <div className="bg-e9 border-1 p-1 total-time">
                                                            <label className="siteColor">Total Time</label>
                                                            {EditData.Id != null ? (
                                                                <span className="pull-right siteColor">
                                                                    <SmartTotalTime
                                                                        props={EditData}
                                                                        callBack={SmartTotalTimeCallBack}
                                                                    />{" "}
                                                                    h
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="col mt-2 clearfix">
                                            <div className="input-group taskTime">
                                                <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Status"} />
                                                <input
                                                    type="text"
                                                    maxLength={3}
                                                    placeholder="% Complete"
                                                    disabled
                                                    readOnly
                                                    className="bg-body form-control px-2"
                                                    value={PercentCompleteStatus}
                                                />

                                                <span
                                                    className="input-group-text"
                                                    title="Status Popup"
                                                    // onClick={() => openTaskStatusUpdatePopup(EditData, "Status")}
                                                    onClick={() => setSmartMetaDataUsedPanel("Status")}
                                                >
                                                    <span
                                                        title="Edit Task"
                                                        className="svg__iconbox svg__icon--editBox"
                                                    ></span>
                                                </span>
                                                {/* {PercentCompleteStatus?.length > 0 ?
                                                    <span className="full-width ">
                                                        <label className="SpfxCheckRadio">
                                                            <input type='radio' className="my-2 radio" checked />

                                                            {PercentCompleteStatus}
                                                        </label>
                                                    </span> : null} */}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col mt-2 time-status">
                                                <div>
                                                    <div className="input-group">
                                                        <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Time"} />
                                                        <input
                                                            type="text"
                                                            maxLength={3}
                                                            className="form-control"
                                                            placeholder="Time"
                                                            defaultValue={
                                                                EditData.Mileage != null ? EditData.Mileage : ""
                                                            }
                                                            onChange={(e) =>
                                                                setEditData({
                                                                    ...EditData,
                                                                    Mileage: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <ul className="p-0 mt-1">
                                                        <li className="form-check">
                                                            <label className="SpfxCheckRadio">
                                                                <input
                                                                    name="radioTime"
                                                                    className=" radio"
                                                                    checked={
                                                                        EditData.Mileage <= 15 &&
                                                                            EditData.Mileage > 0
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    type="radio"
                                                                    onChange={(e) =>
                                                                        setEditData({ ...EditData, Mileage: "15" })
                                                                    }
                                                                    defaultChecked={
                                                                        EditData.Mileage <= 15 &&
                                                                            EditData.Mileage > 0
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                Very Quick{" "}
                                                            </label>
                                                        </li>
                                                        <li className="form-check">
                                                            <label className="SpfxCheckRadio">
                                                                <input
                                                                    name="radioTime"
                                                                    className=" radio"
                                                                    checked={
                                                                        EditData.Mileage <= 60 &&
                                                                            EditData.Mileage > 15
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    type="radio"
                                                                    onChange={(e) =>
                                                                        setEditData({ ...EditData, Mileage: "60" })
                                                                    }
                                                                    defaultChecked={
                                                                        EditData.Mileage <= 60 &&
                                                                            EditData.Mileage > 15
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                Quick
                                                            </label>
                                                        </li>
                                                        <li className="form-check">
                                                            <label className="SpfxCheckRadio">
                                                                <input
                                                                    name="radioTime"
                                                                    className="radio"
                                                                    checked={
                                                                        EditData.Mileage <= 240 &&
                                                                            EditData.Mileage > 60
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    type="radio"
                                                                    onChange={(e) =>
                                                                        setEditData({ ...EditData, Mileage: "240" })
                                                                    }
                                                                    defaultChecked={
                                                                        EditData.Mileage <= 240 &&
                                                                            EditData.Mileage > 60
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                Medium
                                                            </label>
                                                        </li>
                                                        <li className="form-check">
                                                            <label className="SpfxCheckRadio">
                                                                <input
                                                                    name="radioTime"
                                                                    className=" radio"
                                                                    checked={EditData.Mileage === "480"}
                                                                    type="radio"
                                                                    onChange={(e) =>
                                                                        setEditData({ ...EditData, Mileage: "480" })
                                                                    }
                                                                    defaultChecked={
                                                                        EditData.Mileage <= 480 &&
                                                                            EditData.Mileage > 240
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                Long
                                                            </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col mt-2">
                                                <div className="input-group">
                                                    <label className="form-label full-width">
                                                        {EditData.TaskAssignedUsers?.length > 0
                                                            ? "Working Member"
                                                            : ""}
                                                    </label>
                                                    {EditData.TaskAssignedUsers?.map(
                                                        (userDtl: any, index: any) => {
                                                            return (
                                                                <div className="TaskUsers" key={index}>
                                                                    <a
                                                                        target="_blank"
                                                                        data-interception="off"
                                                                        href={`${siteUrls}/SitePages/TaskDashboard.aspx?UserId=${userDtl.AssingedToUserId}&Name=${userDtl.Title}`}
                                                                    >
                                                                        {userDtl?.Item_x0020_Cover?.Url?.length > 0
                                                                            ?
                                                                            <>
                                                                                <img
                                                                                    className="ProirityAssignedUserPhoto me-2"
                                                                                    data-bs-placement="bottom"
                                                                                    title={userDtl.Title ? userDtl.Title : ""}
                                                                                    src={
                                                                                        userDtl.Item_x0020_Cover
                                                                                            ? userDtl.Item_x0020_Cover.Url
                                                                                            : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                                                    }
                                                                                />
                                                                            </>
                                                                            : <span title={userDtl.Title ? userDtl.Title : ""} className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto "></span>
                                                                        }
                                                                    </a>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {AllListIdData.isShowTimeEntry == true ?
                                        <div className="border p-2 mb-3">
                                            <div className="alignCenter position-relative"><LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"EstimatedTaskTime"} onlyText={"text"} /></div>
                                            <div className="col-12">
                                                <div
                                                    onChange={UpdateEstimatedTimeDescriptions}
                                                    className="full-width"
                                                >
                                                    <div className="input-group mt-2">
                                                    <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"SelectCategory"} />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            defaultValue={EstimatedDescriptionCategory}
                                                            value={EstimatedDescriptionCategory}
                                                            placeholder="Select Category"
                                                            onChange={(e) =>
                                                                setEstimatedDescriptionCategory(e.target.value)
                                                            }
                                                        />
                                                        <span
                                                            className="input-group-text"
                                                            title="Status Popup"
                                                            onClick={() =>
                                                                setSmartMetaDataUsedPanel("Estimated-Time")
                                                            }
                                                        >
                                                            <span
                                                                title="Edit Task"
                                                                className="svg__iconbox svg__icon--editBox"
                                                            ></span>
                                                        </span>
                                                    </div>
                                                    <div className="gap-2 my-1 d-flex">
                                                        <input
                                                            type="number"
                                                            className="col-6 my-1 p-1"
                                                            name="Time"
                                                            defaultValue={EstimatedTime}
                                                            value={EstimatedTime}
                                                            placeholder="Estimated Hours"
                                                        />
                                                        <button
                                                            className="btn btn-primary full-width my-1"
                                                            onClick={SaveEstimatedTimeDescription}
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        className="form-control p-1"
                                                        name="Description"
                                                        defaultValue={EstimatedDescription}
                                                        value={EstimatedDescription}
                                                        rows={1}
                                                        placeholder="Add comment if necessary"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                {EditData?.EstimatedTimeDescriptionArray != null &&
                                                    EditData?.EstimatedTimeDescriptionArray?.length > 0 ? (
                                                    <div>
                                                        {EditData?.EstimatedTimeDescriptionArray?.map(
                                                            (EstimatedTimeData: any, Index: any) => {
                                                                return (
                                                                    <div className="align-content-center alignCenter justify-content-between py-1">
                                                                        <div className="alignCenter">
                                                                            <span className="me-1">
                                                                                {EstimatedTimeData?.Team != undefined
                                                                                    ? EstimatedTimeData.Team
                                                                                    : EstimatedTimeData.Category !=
                                                                                        undefined
                                                                                        ? EstimatedTimeData.Category
                                                                                        : null}
                                                                            </span>{" "}
                                                                            |
                                                                            <span className="mx-1">
                                                                                {EstimatedTimeData?.EstimatedTime
                                                                                    ? EstimatedTimeData.EstimatedTime > 1
                                                                                        ? EstimatedTimeData.EstimatedTime +
                                                                                        " Hours"
                                                                                        : EstimatedTimeData.EstimatedTime +
                                                                                        " Hour"
                                                                                    : "0 Hour"}
                                                                            </span>
                                                                            {EstimatedTimeData?.UserImage?.length > 0 ? (
                                                                                <img
                                                                                    className="ProirityAssignedUserPhoto m-0"
                                                                                    title={EstimatedTimeData.UserName}
                                                                                    src={
                                                                                        EstimatedTimeData.UserImage !=
                                                                                            undefined &&
                                                                                            EstimatedTimeData.UserImage?.length >
                                                                                            0
                                                                                            ? EstimatedTimeData.UserImage
                                                                                            : ""
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <span
                                                                                    title={EstimatedTimeData.UserName}
                                                                                    className="alignIcon svg__iconbox svg__icon--defaultUser "
                                                                                ></span>
                                                                            )}
                                                                        </div>
                                                                        {EstimatedTimeData?.EstimatedTimeDescription
                                                                            ?.length > 0 ? (
                                                                            <span className="hover-text m-0 alignIcon">
                                                                                <span className="svg__iconbox svg__icon--info"></span>
                                                                                <span className="tooltip-text pop-right">
                                                                                    {
                                                                                        EstimatedTimeData?.EstimatedTimeDescription
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                        <div className="border-top pt-1">
                                                            <span>Total Estimated Time : </span>
                                                            <span className="mx-1">
                                                                {TotalEstimatedTime > 1
                                                                    ? TotalEstimatedTime + " hours"
                                                                    : TotalEstimatedTime + " hour"}{" "}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div> :  null }
                                    </div>
                                    <div className="col-md-4">
                                        {/* This is used for bottleneck  */}
                                        <div className="col ps-0">
                                            <div className="input-group">
                                                {console.log("Working action default users data ==============", WorkingActionDefaultUsers)}
                                                <div className="form-label full-width alignCenter ">
                                                    <b className="alignCenter"><LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Bottleneck"} onlyText={"text"} />: </b>

                                                    {WorkingActionDefaultUsers?.map((userDtl: any, index: number) => {
                                                        return (
                                                            <div className="TaskUsers" key={index} onClick={() => SelectApproverFromAutoSuggestion(userDtl, "Bottleneck")}>
                                                                {userDtl?.Item_x0020_Cover?.Url?.length > 0
                                                                    ?
                                                                    <>
                                                                        <img
                                                                            className="ProirityAssignedUserPhoto me-1"
                                                                            data-bs-placement="bottom"
                                                                            title={userDtl.Title ? userDtl.Title : ""}
                                                                            src={
                                                                                userDtl.Item_x0020_Cover
                                                                                    ? userDtl.Item_x0020_Cover.Url
                                                                                    : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                                            }
                                                                        />
                                                                    </>
                                                                    : <span title={userDtl.Title ? userDtl.Title : ""} className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto "></span>
                                                                }
                                                            </div>
                                                        )
                                                    })}


                                                </div>
                                                {WorkingAction?.length > 0 ? (
                                                    <>
                                                        {WorkingAction.map((WAItemData, ItemIndex) => {
                                                            if ((WAItemData.Title === "Bottleneck") && (WAItemData?.InformationData?.length === 0 || WAItemData?.InformationData?.length > 1)) {
                                                                return (
                                                                    <>   <input
                                                                        type="text"
                                                                        value={BottleneckSearchKey}
                                                                        className="form-control"
                                                                        placeholder="Tag user for Bottleneck"
                                                                        onChange={(e) => autoSuggestionsForApprover(e, "Bottleneck")}
                                                                    />
                                                                        <span
                                                                            className="input-group-text"
                                                                            onClick={() => openTaskUserPopup("Bottleneck")}
                                                                        >
                                                                            <span
                                                                                title="Edit"
                                                                                className="svg__iconbox svg__icon--editBox"
                                                                            ></span>
                                                                        </span>
                                                                    </>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={BottleneckSearchKey}
                                                            className="form-control"
                                                            placeholder="Tag user for Attention"
                                                            onChange={(e) => autoSuggestionsForApprover(e, "Bottleneck")}
                                                        />
                                                        <span
                                                            className="input-group-text"
                                                            onClick={() => openTaskUserPopup("Attention")}
                                                        >
                                                            <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>
                                                    </>
                                                )}
                                                {BottleneckSearchedData?.length > 0 && (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                            {BottleneckSearchedData.map((item) => (
                                                                <li
                                                                    className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                    key={item.id}
                                                                    onClick={() => SelectApproverFromAutoSuggestion(item, "Bottleneck")}
                                                                >
                                                                    <a>{item.NewLabel}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                if (WAItemData.Title === "Bottleneck" && WAItemData?.InformationData?.length > 0) {
                                                    return (
                                                        <div className="border px-1 mt-1" key={ItemIndex}>
                                                            {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: any) => (
                                                                <div className="align-content-center alignCenter justify-content-between py-1" key={InfoIndex}>
                                                                    <div className="alignCenter">
                                                                        {InfoData?.TaggedUsers?.userImage?.length > 0 ? (
                                                                            <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                src={InfoData.TaggedUsers.userImage}
                                                                            />
                                                                        ) : (
                                                                            <span
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                            ></span>
                                                                        )}
                                                                        <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                    </div>

                                                                    <div className="alignCenter">
                                                                        <span
                                                                            onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Reminder", WAItemData.Title)}
                                                                            className="hover-text m-1"
                                                                        >
                                                                            <LuBellPlus></LuBellPlus>
                                                                            <span className="tooltip-text pop-left">
                                                                                Send reminder notifications
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="m-0 img-info hover-text"
                                                                            onClick={() => openAddImageDescriptionFunction(InfoIndex, InfoData, "Bottleneck")}
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--comment"></span>
                                                                            <span className="tooltip-text pop-left">
                                                                                {InfoData.Comment?.length > 1 ? InfoData.Comment : "Add Comment"}
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="hover-text m-0 alignIcon"
                                                                            onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Remove", WAItemData.Title)}
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--cross"></span>

                                                                            <span className="tooltip-text pop-left">
                                                                                Remove user from Bottleneck
                                                                            </span>
                                                                        </span>
                                                                        {WAItemData?.InformationData?.length === 1 && (
                                                                            <span className="hover-text alignCenter">
                                                                                <span onClick={() => openTaskUserPopup("Bottleneck")} className="svg__iconbox svg__icon--Plus"></span>
                                                                                <span className="tooltip-text pop-left">
                                                                                    Add User
                                                                                </span>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>

                                        {/* This is used for Attentions  */}
                                        <div className="col mt-2 ps-0">
                                            <div className="input-group">
                                                <div className="form-label full-width alignCenter ">
                                                    <b className="alignCenter"><LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Attention"} onlyText={"text"} />: </b>
                                                    {WorkingActionDefaultUsers?.map((userDtl: any, index: number) => {
                                                        return (
                                                            <div className="TaskUsers" key={index} onClick={() => SelectApproverFromAutoSuggestion(userDtl, "Attention")}>
                                                                {userDtl?.Item_x0020_Cover?.Url?.length > 0
                                                                    ?
                                                                    <>
                                                                        <img
                                                                            className="ProirityAssignedUserPhoto me-1"
                                                                            data-bs-placement="bottom"
                                                                            title={userDtl.Title ? userDtl.Title : ""}
                                                                            src={
                                                                                userDtl.Item_x0020_Cover
                                                                                    ? userDtl.Item_x0020_Cover.Url
                                                                                    : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                                            }
                                                                        />
                                                                    </>
                                                                    : <span title={userDtl.Title ? userDtl.Title : ""} className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto "></span>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                {WorkingAction?.length > 0 ? (
                                                    <>
                                                        {WorkingAction.map((WAItemData, ItemIndex) => {
                                                            if (
                                                                WAItemData.Title === "Attention" &&
                                                                (WAItemData?.InformationData?.length === 0 ||
                                                                    WAItemData?.InformationData?.length > 1)
                                                            ) {
                                                                return (
                                                                    <>   <input
                                                                        type="text"
                                                                        value={AttentionSearchKey}
                                                                        className="form-control"
                                                                        placeholder="Tag user for Attention"
                                                                        onChange={(e) => autoSuggestionsForApprover(e, "Attention")}
                                                                    />
                                                                        <span
                                                                            className="input-group-text"
                                                                            onClick={() => openTaskUserPopup("Attention")}
                                                                        >
                                                                            <span
                                                                                title="Edit"
                                                                                className="svg__iconbox svg__icon--editBox"
                                                                            ></span>
                                                                        </span>
                                                                    </>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={AttentionSearchKey}
                                                            className="form-control"
                                                            placeholder="Tag user for Attention"
                                                            onChange={(e) => autoSuggestionsForApprover(e, "Attention")}
                                                        />
                                                        <span
                                                            className="input-group-text"
                                                            onClick={() => openTaskUserPopup("Attention")}
                                                        >
                                                            <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>
                                                    </>
                                                )}

                                                {AttentionSearchedData?.length > 0 && (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                            {AttentionSearchedData.map((item) => (
                                                                <li
                                                                    className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                    key={item.id}
                                                                    onClick={() => SelectApproverFromAutoSuggestion(item, "Attention")}
                                                                >
                                                                    <a>{item.NewLabel}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                if (
                                                    WAItemData.Title === "Attention" &&
                                                    WAItemData?.InformationData?.length > 0
                                                ) {
                                                    return (
                                                        <div className="border px-1 mt-1" key={ItemIndex}>
                                                            {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: any) => (
                                                                <div
                                                                    className="align-content-center alignCenter justify-content-between py-1"
                                                                    key={InfoIndex}
                                                                >
                                                                    <div className="alignCenter">
                                                                        {InfoData?.TaggedUsers?.userImage?.length > 0 ? (
                                                                            <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                src={InfoData.TaggedUsers.userImage}
                                                                            />
                                                                        ) : (
                                                                            <span
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                            ></span>
                                                                        )}
                                                                        <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                    </div>
                                                                    <div className="alignCenter">
                                                                        <span
                                                                            onClick={() =>
                                                                                BottleneckAndAttentionFunction(
                                                                                    InfoData,
                                                                                    InfoIndex,
                                                                                    "Reminder",
                                                                                    WAItemData.Title
                                                                                )
                                                                            }
                                                                            className="hover-text m-1"
                                                                        >
                                                                            <LuBellPlus></LuBellPlus>
                                                                            <span className="tooltip-text pop-left">
                                                                                Send reminder notifications
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="m-0 img-info hover-text"
                                                                            onClick={() =>
                                                                                openAddImageDescriptionFunction(
                                                                                    InfoIndex,
                                                                                    InfoData,
                                                                                    "Attention"
                                                                                )
                                                                            }
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--comment"></span>
                                                                            <span className="tooltip-text pop-left">
                                                                                {InfoData.Comment?.length > 1
                                                                                    ? InfoData.Comment
                                                                                    : "Add Comment"}
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="hover-text m-0 alignIcon"
                                                                            onClick={() =>
                                                                                BottleneckAndAttentionFunction(
                                                                                    InfoData,
                                                                                    InfoIndex,
                                                                                    "Remove",
                                                                                    WAItemData.Title
                                                                                )
                                                                            }
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--cross"></span>
                                                                            <span className="tooltip-text pop-left">
                                                                                Remove user from Attention
                                                                            </span>
                                                                        </span>
                                                                        {WAItemData?.InformationData?.length === 1 ? (
                                                                            <span className="hover-text alignCenter">
                                                                                <span onClick={() => openTaskUserPopup("Attention")} className="svg__iconbox svg__icon--Plus"></span>
                                                                                <span className="tooltip-text pop-left">
                                                                                    Add User
                                                                                </span>
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        {/* //////////////////////////////This is phone section/////////////////////////// */}
                                        <div className="col mt-2 ps-0">
                                            <div className="input-group">
                                                <div className="form-label full-width alignCenter ">
                                                    <b className="alignCenter"><LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"Phone"} onlyText={"text"} />: </b>
                                                    {WorkingActionDefaultUsers?.map((userDtl: any, index: number) => {
                                                        return (
                                                            <div className="TaskUsers" key={index} onClick={() => SelectApproverFromAutoSuggestion(userDtl, "Phone")}>
                                                                {userDtl?.Item_x0020_Cover?.Url?.length > 0
                                                                    ?
                                                                    <>
                                                                        <img
                                                                            className="ProirityAssignedUserPhoto me-1"
                                                                            data-bs-placement="bottom"
                                                                            title={userDtl.Title ? userDtl.Title : ""}
                                                                            src={
                                                                                userDtl.Item_x0020_Cover
                                                                                    ? userDtl.Item_x0020_Cover.Url
                                                                                    : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                                            }
                                                                        />
                                                                    </>
                                                                    : <span title={userDtl.Title ? userDtl.Title : ""} className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto "></span>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                {WorkingAction?.length > 0 ? <> {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                    if ((WAItemData.Title === "Phone") && (WAItemData?.InformationData?.length === 0 || WAItemData?.InformationData?.length > 1)) {
                                                        return (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    value={PhoneSearchKey}
                                                                    className="form-control"
                                                                    placeholder="Tag user for Phone"
                                                                    onChange={(e) => autoSuggestionsForApprover(e, "Phone")}
                                                                    key={ItemIndex}
                                                                />
                                                                <span className="input-group-text" onClick={() => openTaskUserPopup("Phone")}>
                                                                    <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>
                                                                </span>
                                                            </>
                                                        );
                                                    }
                                                    return null;
                                                })}</> : <> <input
                                                    type="text"
                                                    value={PhoneSearchKey}
                                                    className="form-control"
                                                    placeholder="Tag user for Phone"
                                                    onChange={(e) => autoSuggestionsForApprover(e, "Phone")}

                                                />
                                                    <span className="input-group-text" onClick={() => openTaskUserPopup("Phone")}>

                                                        <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>

                                                    </span>
                                                </>}

                                                {PhoneSearchedData?.length > 0 && (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                            {PhoneSearchedData.map((item) => (
                                                                <li
                                                                    className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                    key={item.id}
                                                                    onClick={() => SelectApproverFromAutoSuggestion(item, "Phone")}
                                                                >
                                                                    <a>{item.NewLabel}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                if (WAItemData.Title === "Phone" && WAItemData?.InformationData?.length > 0) {
                                                    return (
                                                        <div className="border px-1 mt-1" key={ItemIndex}>
                                                            {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: any) => (
                                                                <div className="align-content-center alignCenter justify-content-between py-1" key={InfoIndex}>
                                                                    <div className="alignCenter">
                                                                        {InfoData?.TaggedUsers?.userImage?.length > 0 ? (
                                                                            <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                src={InfoData.TaggedUsers.userImage}
                                                                            />
                                                                        ) : (
                                                                            <span
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                            ></span>
                                                                        )}
                                                                        <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                    </div>

                                                                    <div className="alignCenter">
                                                                        <span
                                                                            onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Reminder", WAItemData.Title)}
                                                                            className="hover-text m-1"
                                                                        >
                                                                            <LuBellPlus />
                                                                            <span className="tooltip-text pop-left">
                                                                                Send reminder notifications
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="m-0 img-info hover-text"
                                                                            onClick={() => openAddImageDescriptionFunction(InfoIndex, InfoData, "Phone")}
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--comment"></span>
                                                                            <span className="tooltip-text pop-left">
                                                                                {InfoData.Comment?.length > 1 ? InfoData.Comment : "Add Comment"}
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="hover-text m-0 alignIcon"
                                                                            onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Remove", WAItemData.Title)}
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--cross"></span>

                                                                            <span className="tooltip-text pop-left">
                                                                                Remove user from Phone
                                                                            </span>
                                                                        </span>
                                                                        {WAItemData?.InformationData?.length === 1 ? (
                                                                            <span className="hover-text alignCenter">
                                                                                <span onClick={() => openTaskUserPopup("Phone")} className="svg__iconbox svg__icon--Plus"></span>
                                                                                <span className="tooltip-text pop-left">
                                                                                    Add User
                                                                                </span>
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        {/* //////////////////////////////This is Approval section/////////////////////////// */}
                                        <div className="col mt-2 ps-0 input-group Approvalcol " >
                                            {WorkingAction?.length > 0 ? <> {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                if ((WAItemData.Title === "Approval") && (WAItemData?.InformationData?.length === 0 || WAItemData?.InformationData?.length > 1)) {
                                                    return (
                                                        <>
                                                            <label className="full-width alignCenter justify-content-between">
                                                                <div>
                                                                    <input
                                                                        className="form-check-input rounded-0"
                                                                        type="checkbox"
                                                                        checked={ApprovalStatus}
                                                                        defaultChecked={ApprovalStatus}

                                                                        onClick={(e) =>
                                                                            updateWAForApproval(ApprovalStatus, "IsChecked")
                                                                        }
                                                                    />
                                                                    <span className="ms-1">Approval</span>
                                                                </div >
                                                                <div className="complexcol">
                                                                    <ul className="p-0 mt-1 list-none alignCenter">
                                                                        <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Normal", "Type")}>
                                                                            <input
                                                                                className="radio"
                                                                                name="ApprovalLevel"
                                                                                type="radio"
                                                                                defaultChecked={WAItemData?.Type == "Normal" ? true : false}
                                                                                checked={WAItemData?.Type == "Normal" ? true : false}

                                                                            />
                                                                            <label className="form-check-label">
                                                                                Normal
                                                                            </label>
                                                                        </li>
                                                                        <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Complex", "Type")}>
                                                                            <input
                                                                                type="radio"
                                                                                className="radio"
                                                                                name="ApprovalLevel"
                                                                                defaultChecked={WAItemData?.Type == "Complex" ? true : false}
                                                                                checked={WAItemData?.Type == "Complex" ? true : false}

                                                                            />
                                                                            <label> Complex</label>
                                                                        </li>
                                                                        <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Quick", "Type")}>
                                                                            <input
                                                                                type="radio"
                                                                                className="radio"
                                                                                name="ApprovalLevel"
                                                                                defaultChecked={WAItemData?.Type == "Quick" ? true : false}
                                                                                checked={WAItemData?.Type == "Quick" ? true : false}
                                                                                onChange={(e) => updateWAForApproval("Quick", "Type")}
                                                                            />
                                                                            <label>Quick</label>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </label>

                                                            <input
                                                                type="text"
                                                                value={ApproverSearchKey}
                                                                className={ApprovalStatus ? "form-control" : "form-control Disabled-Link"}
                                                                placeholder="Tag user for Approval"
                                                                onChange={(e) => autoSuggestionsForApprover(e, "Approval")}
                                                                key={ItemIndex}
                                                            />
                                                            <span className={ApprovalStatus ? "input-group-text" : "input-group-text Disabled-Link"} onClick={() => openTaskUserPopup("Approval")}>
                                                                <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>
                                                            </span>
                                                        </>
                                                    );
                                                } else if ((WAItemData.Title === "Approval") && (WAItemData?.InformationData?.length === 1)) {
                                                    return (
                                                        <label className="full-width alignCenter justify-content-between">
                                                            <div>
                                                                <input
                                                                    className="form-check-input rounded-0"
                                                                    type="checkbox"
                                                                    checked={ApprovalStatus}
                                                                    defaultChecked={ApprovalStatus}
                                                                    value={`${ApprovalStatus}`}
                                                                    onClick={(e) =>
                                                                        updateWAForApproval(ApprovalStatus, "IsChecked")
                                                                    }
                                                                />
                                                                <span className="ms-1">Approval</span>
                                                            </div >
                                                            <div>
                                                                <ul className="p-0 mt-1 list-none alignCenter">
                                                                    <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Normal", "Type")}>
                                                                        <input
                                                                            className="radio"
                                                                            name="ApprovalLevel"
                                                                            type="radio"
                                                                            defaultChecked={WAItemData?.Type == "Normal" ? true : false}
                                                                            checked={WAItemData?.Type == "Normal" ? true : false}

                                                                        />
                                                                        <label className="form-check-label">
                                                                            Normal
                                                                        </label>
                                                                    </li>
                                                                    <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Complex", "Type")}>
                                                                        <input
                                                                            type="radio"
                                                                            className="radio"
                                                                            name="ApprovalLevel"
                                                                            defaultChecked={WAItemData?.Type == "Complex" ? true : false}
                                                                            checked={WAItemData?.Type == "Complex" ? true : false}

                                                                        />
                                                                        <label> Complex</label>
                                                                    </li>
                                                                    <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Quick", "Type")}>
                                                                        <input
                                                                            type="radio"
                                                                            className="radio"
                                                                            name="ApprovalLevel"
                                                                            defaultChecked={WAItemData?.Type == "Quick" ? true : false}
                                                                            checked={WAItemData?.Type == "Quick" ? true : false}
                                                                            onChange={(e) => updateWAForApproval("Quick", "Type")}
                                                                        />
                                                                        <label>Quick</label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </label>
                                                    )
                                                }
                                                return null;
                                            })}</> : <>
                                                <label className="full-width alignCenter justify-content-between">
                                                    <div>
                                                        <input
                                                            className="form-check-input rounded-0"
                                                            type="checkbox"
                                                            checked={ApprovalStatus}
                                                            value={`${ApprovalStatus}`}
                                                            onClick={(e) =>
                                                                updateWAForApproval(ApprovalStatus, "IsChecked")
                                                            }
                                                        />
                                                        <span className="ms-1">Approval</span>
                                                    </div >
                                                    <div>
                                                        <ul className="p-0 mt-1 list-none alignCenter">
                                                            <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Normal", "Type")}>
                                                                <input
                                                                    className="radio"
                                                                    name="ApprovalLevel"
                                                                    type="radio"
                                                                    defaultChecked={false}

                                                                />
                                                                <label className="form-check-label">
                                                                    Normal
                                                                </label>
                                                            </li>
                                                            <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Complex", "Type")}>
                                                                <input
                                                                    type="radio"
                                                                    className="radio"
                                                                    name="ApprovalLevel"
                                                                    defaultChecked={false}

                                                                />
                                                                <label> Complex</label>
                                                            </li>
                                                            <li className="SpfxCheckRadio" onClick={() => updateWAForApproval("Quick", "Type")}>
                                                                <input
                                                                    type="radio"
                                                                    className="radio"
                                                                    name="ApprovalLevel"
                                                                    defaultChecked={false}
                                                                />
                                                                <label>Quick</label>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ApproverSearchKey}
                                                    className="form-control"
                                                    placeholder="Tag user for Approval"
                                                    onChange={(e) => autoSuggestionsForApprover(e, "Approval")}

                                                />
                                                <span className="input-group-text" onClick={() => openTaskUserPopup("Approval")}>
                                                    <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>
                                                </span>
                                            </>
                                            }
                                            {ApproverSearchedData?.length > 0 && (
                                                <div className="SmartTableOnTaskPopup">
                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                        {ApproverSearchedData.map((item) => (
                                                            <li
                                                                className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                key={item.id}
                                                                onClick={() => SelectApproverFromAutoSuggestion(item, "Approval")}
                                                            >
                                                                <a>{item.NewLabel}</a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                if (WAItemData.Title === "Approval" && WAItemData?.InformationData?.length > 0) {
                                                    return (
                                                        <div className="border full-width px-1 mt-1" key={ItemIndex}>
                                                            {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: any) => (
                                                                <div className="align-content-center alignCenter justify-content-between py-1" key={InfoIndex}>
                                                                    <div className="alignCenter">
                                                                        {InfoData?.TaggedUsers?.userImage?.length > 0 ? (
                                                                            <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                src={InfoData.TaggedUsers.userImage}
                                                                            />
                                                                        ) : (
                                                                            <span
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                            ></span>
                                                                        )}
                                                                        <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                    </div>

                                                                    <div className="alignCenter approvalicons">
                                                                        <span
                                                                            onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Reminder", WAItemData.Title)}
                                                                            className="hover-text m-1"
                                                                        >
                                                                            <LuBellPlus />
                                                                            <span className="tooltip-text pop-left">
                                                                                Send reminder notifications
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="m-0 img-info hover-text"
                                                                            onClick={() => openAddImageDescriptionFunction(InfoIndex, InfoData, "Approval")}
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--comment"></span>
                                                                            <span className="tooltip-text pop-left">
                                                                                {InfoData.Comment?.length > 1 ? InfoData.Comment : "Add Comment"}
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="hover-text m-0 alignIcon"
                                                                            onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Remove", WAItemData.Title)}
                                                                        >
                                                                            <span className="svg__iconbox svg__icon--cross"></span>
                                                                            <span className="tooltip-text pop-left">
                                                                                Remove user from Approval
                                                                            </span>
                                                                        </span>
                                                                        {WAItemData?.InformationData?.length === 1 ? (
                                                                            <span className="hover-text m-0 alignCenter">
                                                                                <span onClick={() => openTaskUserPopup("Approval")} className="svg__iconbox svg__icon--Plus"></span>
                                                                                <span className="tooltip-text pop-left">
                                                                                    Add User
                                                                                </span>
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        <div className="full_width mt-2">
                                            <CommentCard
                                                siteUrl={siteUrls}
                                                listName={Items?.Items?.siteType}
                                                itemID={Items.Items.Id}
                                                AllListId={AllListIdData}
                                                Context={Context}

                                            />
                                        </div>
                                        <div className="pull-right">
                                            <span className="">
                                                <label className="form-check-label mb-4 mx-2">
                                                    Waiting for HHHH response
                                                </label>
                                                <input
                                                    className="form-check-input rounded-0"
                                                    type="checkbox"
                                                    checked={EditData.waitForResponse}
                                                    value={EditData.waitForResponse}
                                                    onChange={(e) => changeStatus(e, "waitForResponse")}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {DesignNewTemplates != true ?
                                    <div className="d-flex">

                                        <div
                                            className={
                                                IsShowFullViewImage != true
                                                    ? "col-sm-3 me-2 padL-0 DashboardTaskPopup-Editor above"
                                                    : "col-sm-6  padL-0 DashboardTaskPopup-Editor above"
                                            }
                                        >
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
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-check-input"
                                                                                checked={ImageDtl.Checked}
                                                                                onClick={() =>
                                                                                    ImageCompareFunction(ImageDtl, index)
                                                                                }
                                                                            />
                                                                            <span className="mx-1">
                                                                                {ImageDtl.ImageName
                                                                                    ? ImageDtl.ImageName.slice(0, 24)
                                                                                    : ""}
                                                                            </span>
                                                                        </div>
                                                                        <a
                                                                            href={ImageDtl.ImageUrl}
                                                                            target="_blank"
                                                                            data-interception="off"
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    ImageDtl.ImageUrl
                                                                                        ? ImageDtl.ImageUrl
                                                                                        : ""
                                                                                }
                                                                                onMouseOver={(e) =>
                                                                                    MouseHoverImageFunction(e, ImageDtl)
                                                                                }
                                                                                onMouseOut={(e) =>
                                                                                    MouseOutImageFunction(e)
                                                                                }
                                                                                className="card-img-top"
                                                                            />
                                                                        </a>

                                                                        <div className="card-footer alignCenter justify-content-between pt-0 pb-1 px-2">
                                                                            <div className="alignCenter">
                                                                                <span className="fw-semibold">
                                                                                    {ImageDtl.UploadeDate
                                                                                        ? ImageDtl.UploadeDate
                                                                                        : ""}
                                                                                </span>
                                                                                <span className="mx-1">
                                                                                    <img
                                                                                        className="imgAuthor"
                                                                                        title={ImageDtl.UserName}
                                                                                        src={
                                                                                            ImageDtl.UserImage
                                                                                                ? ImageDtl.UserImage
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </div>
                                                                            <div className="alignCenter">
                                                                                <span
                                                                                    className="hover-text"
                                                                                    onClick={() =>
                                                                                        openReplaceImagePopup(index)
                                                                                    }
                                                                                >
                                                                                    <TbReplace />{" "}
                                                                                    <span className="tooltip-text pop-right">
                                                                                        Replace Image
                                                                                    </span>
                                                                                </span>
                                                                                <span
                                                                                    className="mx-1 hover-text"
                                                                                    onClick={() =>
                                                                                        RemoveImageFunction(
                                                                                            index,
                                                                                            ImageDtl.ImageName,
                                                                                            "Remove"
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {" "}
                                                                                    | <RiDeleteBin6Line /> |
                                                                                    <span className="tooltip-text pop-right">
                                                                                        Delete
                                                                                    </span>
                                                                                </span>
                                                                                <span
                                                                                    className="hover-text"
                                                                                    onClick={() =>
                                                                                        ImageCustomizeFunction(index)
                                                                                    }
                                                                                >
                                                                                    <FaExpandAlt /> |
                                                                                    <span className="tooltip-text pop-right">
                                                                                        Customize the Width of Page
                                                                                    </span>
                                                                                </span>
                                                                                <span
                                                                                    className="ms-1 m-0 img-info hover-text"
                                                                                    onClick={() =>
                                                                                        openAddImageDescriptionFunction(
                                                                                            index,
                                                                                            ImageDtl,
                                                                                            "Image"
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <span className="svg__iconbox svg__icon--info dark"></span>
                                                                                    <span className="tooltip-text pop-right">
                                                                                        {ImageDtl.Description != undefined &&
                                                                                            ImageDtl.Description?.length > 1
                                                                                            ? ImageDtl.Description
                                                                                            : "Add Image Description"}
                                                                                    </span>
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

                                                                {TaskImages?.length != 0 ? (
                                                                    <span
                                                                        className="siteColor"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() =>
                                                                            setUploadBtnStatus(
                                                                                UploadBtnStatus ? false : true
                                                                            )
                                                                        }
                                                                    >
                                                                        Add New Image
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                            {UploadBtnStatus ? (
                                                                <div>
                                                                    <FlorarImageUploadComponent
                                                                        callBack={FroalaImageUploadComponentCallBack}
                                                                    />
                                                                </div>
                                                            ) : null}
                                                            {TaskImages?.length == 0 && EditData?.Id != undefined ? (
                                                                <div>
                                                                    <FlorarImageUploadComponent
                                                                        callBack={FroalaImageUploadComponentCallBack}
                                                                    />
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    )}
                                                </ImageUploading>
                                            </div>
                                        </div>

                                        <div
                                            className={
                                                IsShowFullViewImage != true
                                                    ? "col-sm-9 toggle-task"
                                                    : "col-sm-6 editsectionscroll toggle-task"
                                            }
                                        >
                                            {EditData.Id != null ? (
                                                <>
                                                    <CommentBoxComponent
                                                        data={
                                                            EditData?.FeedBackBackup?.length > 0
                                                                ? EditData?.FeedBackBackup[0]
                                                                    ?.FeedBackDescriptions
                                                                : []
                                                        }
                                                        callBack={CommentSectionCallBack}
                                                        allUsers={taskUsers}
                                                        ApprovalStatus={ApprovalStatus}
                                                        SmartLightStatus={SmartLightStatus}
                                                        Context={Context}
                                                        FeedbackCount={FeedBackCount}
                                                    />
                                                    <Example
                                                        textItems={
                                                            EditData?.FeedBackBackup?.length > 0
                                                                ? EditData?.FeedBackBackup[0]
                                                                    ?.FeedBackDescriptions
                                                                : []
                                                        }
                                                        callBack={SubCommentSectionCallBack}
                                                        allUsers={taskUsers}
                                                        ItemId={EditData.Id}
                                                        SiteUrl={EditData.ComponentLink}
                                                        ApprovalStatus={ApprovalStatus}
                                                        SmartLightStatus={SmartLightStatus}
                                                        Context={Context}
                                                        FeedbackCount={FeedBackCount}
                                                        TaskUpdatedData={MakeUpdateDataJSON}
                                                        TaskListDetails={{
                                                            SiteURL: siteUrls,
                                                            ListId: Items.Items.listId,
                                                            TaskId: Items.Items.Id,
                                                            TaskDetails: EditData,
                                                            AllListIdData: AllListIdData,
                                                            Context: Context,
                                                            siteType: Items.Items.siteType,
                                                        }}
                                                        taskCreatedCallback={UpdateTaskInfoFunction}
                                                    />
                                                </>
                                            ) : null}
                                        </div>
                                    </div> :
                                    <div className="row py-3">
                                        {EditData.Id != null && <UXDesignPopupTemplate data={
                                            EditData?.FeedBackBackup?.length > 0
                                                ? EditData?.FeedBackBackup[0]
                                                    ?.FeedBackDescriptions
                                                : []
                                        }
                                            DesignTemplatesCallback={DesignTemplatesCallback}
                                            allUsers={taskUsers}
                                            ApprovalStatus={ApprovalStatus}
                                            SmartLightStatus={SmartLightStatus}
                                            Context={Context}
                                            FeedbackCount={FeedBackCount}

                                            EditData={EditData}
                                            TaskListDetails={{
                                                SiteURL: siteUrls,
                                                ListId: Items.Items.listId,
                                                TaskId: Items.Items.Id,
                                                TaskDetails: EditData,
                                                AllListIdData: AllListIdData,
                                                Context: Context,
                                                siteType: Items.Items.siteType,
                                            }}
                                            taskCreatedCallback={UpdateTaskInfoFunction}
                                            UXStatus={DesignNewTemplates}
                                            currentUserBackupArray={currentUserBackupArray}
                                        />
                                        }
                                    </div>
                                }
                            </div>
                            <div
                                className="tab-pane "
                                id="NEWTIMESHEET"
                                role="tabpanel"
                                aria-labelledby="NEWTIMESHEET"
                            >
                                <div className="">
                                    <NewTameSheetComponent
                                        props={Items}
                                        AllListId={AllListIdData}
                                        TeamConfigDataCallBack={getTeamConfigData}
                                    />
                                </div>
                            </div>
                            {IsUserFromHHHHTeam ? null : (
                                <div
                                    className="tab-pane "
                                    id="BACKGROUNDCOMMENT"
                                    role="tabpanel"
                                    aria-labelledby="BACKGROUNDCOMMENT"
                                >
                                    {EditData.Id != null || EditData.Id != undefined ? (
                                        <BackgroundCommentComponent
                                            CurrentUser={currentUserData}
                                            TaskData={EditData}
                                            Context={Context}
                                            siteUrls={siteUrls}
                                        />
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>

                    {(openTeamPortfolioPopup || ProjectManagementPopup) && (
                        <ServiceComponentPortfolioPopup
                            props={EditData}
                            Dynamic={AllListIdData}
                            ComponentType={"Component"}
                            Call={ComponentServicePopupCallBack}
                            selectionType={"Single"}
                            showProject={ProjectManagementPopup}
                        />
                    )}
                    {openLinkedPortfolioPopup && (
                        <ServiceComponentPortfolioPopup
                            props={EditData}
                            Dynamic={AllListIdData}
                            Call={ComponentServicePopupCallBack}
                            ComponentType={"Component"}
                            selectionType={"Multi"}
                        />
                    )}
                    {IsComponentPicker && (
                        <Picker
                            props={EditData}
                            selectedCategoryData={TaskCategoriesData}
                            usedFor="Task-Popup"
                            siteUrls={siteUrls}
                            AllListId={AllListIdData}
                            CallBack={SelectCategoryCallBack}
                            isServiceTask={false}
                            closePopupCallBack={smartCategoryPopup}
                        />
                    )}

                    {SiteCompositionShow ? (
                        <CentralizedSiteComposition
                            ItemDetails={EditData}
                            RequiredListIds={AllListIdData}
                            closePopupCallBack={closeSiteCompsotionPanelFunction}
                            usedFor={"AWT"}
                            ColorCode={PortfolioItemColor}
                        />
                    ) : null}
                    {/* {sendEmailComponentStatus ? (
                        <EmailComponent
                            AllTaskUser={AllTaskUser}
                            CurrentUser={currentUserData}
                            CreatedApprovalTask={Items.sendApproverMail}
                            statusUpdateMailSendStatus={
                                ImmediateStatus && sendEmailComponentStatus ? true : false
                            }
                            IsEmailCategoryTask={EmailStatus}
                            items={LastUpdateTaskData}
                            Context={Context}
                            ApprovalTaskStatus={ApprovalTaskStatus}
                            callBack={SendEmailNotificationCallBack}
                        />
                    ) : null} */}
                    {/* {sendEmailNotification ? (
                        <EmailNotificationMail
                            AllTaskUser={AllTaskUser}
                            CurrentUser={currentUserData}
                            CreatedApprovalTask={Items.sendApproverMail}
                            statusUpdateMailSendStatus={
                                ImmediateStatus && sendEmailComponentStatus ? true : false
                            }
                            IsEmailCategoryTask={EmailStatus}
                            items={LastUpdateTaskData}
                            Context={Context}
                            ApprovalTaskStatus={ApprovalTaskStatus}
                            callBack={SendEmailNotificationCallBack}
                            statusValue={ValueStatus}
                        />
                    ) : null} */}
                    {/* {OpenEODReportPopup ? <EODReportComponent TaskDetails={EditData} siteUrl={siteUrls} Context={Context} Callback={EODReportComponentCallback} /> : null} */}
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
                        <button
                            className="nav-link active"
                            id="IMAGE-INFORMATION"
                            data-bs-toggle="tab"
                            data-bs-target="#IMAGEINFORMATION"
                            type="button"
                            role="tab"
                            aria-controls="IMAGEINFORMATION"
                            aria-selected="true"
                        >
                            BASIC INFORMATION
                        </button>
                        <button
                            className="nav-link"
                            id="IMAGE-TIME-SHEET"
                            data-bs-toggle="tab"
                            data-bs-target="#IMAGETIMESHEET"
                            type="button"
                            role="tab"
                            aria-controls="IMAGETIMESHEET"
                            aria-selected="false"
                        >
                            TIMESHEET
                        </button>
                    </ul>
                    <div
                        className="border border-top-0 clearfix p-3 tab-content "
                        id="myTabContent"
                    >
                        <div
                            className="tab-pane show active"
                            id="IMAGEINFORMATION"
                            role="tabpanel"
                            aria-labelledby="IMAGEINFORMATION"
                        >
                            <div className="image-section row">
                                <div
                                    className="single-image-section col-sm-6 p-2"
                                    style={{
                                        border: "2px solid #ccc",
                                    }}
                                >
                                    <img
                                        src={
                                            compareImageArray?.length > 0
                                                ? compareImageArray[0]?.ImageUrl
                                                : ""
                                        }
                                        className="img-fluid card-img-top"
                                    />
                                    <div className="card-footer alignCenter justify-content-between pt-0 pb-1 px-2">
                                        <div className="alignCenter">
                                            <span className="mx-1">
                                                {compareImageArray[0]?.ImageName
                                                    ? compareImageArray[0]?.ImageName.slice(0, 6)
                                                    : ""}
                                            </span>
                                            <span className="fw-semibold">
                                                {compareImageArray[0]?.UploadeDate
                                                    ? compareImageArray[0]?.UploadeDate
                                                    : ""}
                                            </span>
                                            <span className="mx-1">
                                                <img
                                                    style={{ width: "25px" }}
                                                    src={
                                                        compareImageArray[0]?.UserImage
                                                            ? compareImageArray[0]?.UserImage
                                                            : ""
                                                    }
                                                />
                                            </span>
                                        </div>
                                        <div className="alignCenter">
                                            <span className="mx-1">
                                                {" "}
                                                <TbReplace /> |
                                            </span>
                                            <span>
                                                <RiDeleteBin6Line />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="slider-image-section col-sm-6 p-2"
                                    style={{
                                        border: "2px solid #ccc",
                                    }}
                                >
                                    <div
                                        id="carouselExampleControls"
                                        className="carousel slide"
                                        data-bs-interval="false"
                                    >
                                        <div className="carousel-inner">
                                            {TaskImages?.map((imgData: any, index: any) => {
                                                return (
                                                    <div
                                                        className={
                                                            index == 0
                                                                ? "carousel-item active"
                                                                : "carousel-item"
                                                        }
                                                    >
                                                        <img
                                                            src={imgData.ImageUrl}
                                                            className="d-block w-100"
                                                            alt="..."
                                                        />
                                                        <div className="card-footer alignCenter justify-content-between pt-0 pb-1 px-2">
                                                            <div className="alignCenter">
                                                                <span className="mx-1">
                                                                    {imgData.ImageName
                                                                        ? imgData.ImageName.slice(0, 6)
                                                                        : ""}
                                                                </span>
                                                                <span className="fw-semibold">
                                                                    {imgData.UploadeDate
                                                                        ? imgData.UploadeDate
                                                                        : ""}
                                                                </span>
                                                                <span className="mx-1">
                                                                    <img
                                                                        style={{ width: "25px" }}
                                                                        src={
                                                                            imgData.UserImage ? imgData.UserImage : ""
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                            <div className="alignCenter">
                                                                <span className="mx-1">
                                                                    {" "}
                                                                    <TbReplace /> |
                                                                </span>
                                                                <span>
                                                                    <RiDeleteBin6Line />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button
                                            className="carousel-control-prev h-75"
                                            type="button"
                                            data-bs-target="#carouselExampleControls"
                                            data-bs-slide="prev"
                                            data-bs-interval="false"
                                        >
                                            <span
                                                className="carousel-control-prev-icon"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button
                                            className="carousel-control-next h-75"
                                            type="button"
                                            data-bs-target="#carouselExampleControls"
                                            data-bs-slide="next"
                                            data-bs-interval="false"
                                        >
                                            <span
                                                className="carousel-control-next-icon"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <h6
                                        className="siteColor"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            alert(
                                                "we are working on it. This feature will be live soon.."
                                            )
                                        }
                                    >
                                        Upload Image
                                    </h6>
                                    <h6
                                        className="siteColor"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            alert(
                                                "we are working on it. This feature will be live soon.."
                                            )
                                        }
                                    >
                                        Add New Image
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane "
                            id="IMAGETIMESHEET"
                            role="tabpanel"
                            aria-labelledby="IMAGETIMESHEET"
                        >
                            <div>
                                <NewTameSheetComponent
                                    props={Items}
                                    AllListId={AllListIdData}
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
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterOther}
            >
                <div
                    className="modal-body mb-5"
                >
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <button
                            className="nav-link active"
                            id="IMAGE-INFORMATION"
                            data-bs-toggle="tab"
                            data-bs-target="#IMAGEINFORMATION"
                            type="button"
                            role="tab"
                            aria-controls="IMAGEINFORMATION"
                            aria-selected="true"
                        >
                            BASIC INFORMATION
                        </button>
                        <button
                            className="nav-link"
                            id="IMAGE-TIME-SHEET"
                            data-bs-toggle="tab"
                            data-bs-target="#IMAGETIMESHEET"
                            type="button"
                            role="tab"
                            aria-controls="IMAGETIMESHEET"
                            aria-selected="false"
                        >
                            TEAM & TIMESHEET
                        </button>
                        {IsUserFromHHHHTeam ? null : (
                            <button
                                className="nav-link"
                                id="IMAGE-BACKGROUND-COMMENT"
                                data-bs-toggle="tab"
                                data-bs-target="#IMAGEBACKGROUNDCOMMENT"
                                type="button"
                                role="tab"
                                aria-controls="IMAGEBACKGROUNDCOMMENT"
                                aria-selected="false"
                            >
                                {/* REMARKS */}
                                BACKGROUND
                            </button>
                        )}
                    </ul>
                    <div
                        className="border border-top-0 clearfix p-3 tab-content "
                        id="myTabContent"
                    >
                        <div
                            className="tab-pane show active"
                            id="IMAGEINFORMATION"
                            role="tabpanel"
                            aria-labelledby="IMAGEINFORMATION"
                        >
                            <div className="image-section row">
                                {ShowTaskDetailsStatus ? (
                                    <div className="p-0 mt--5">
                                        <h6 className="mb-1 mt--10 text-end siteColor hreflink"
                                            onClick={() =>
                                                setShowTaskDetailsStatus(
                                                    ShowTaskDetailsStatus ? false : true
                                                )
                                            }
                                        >
                                            Show task details <SlArrowDown />
                                        </h6>
                                        <div>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <div className="col-12 ">
                                                        <div className="input-group">
                                                            <div className="d-flex justify-content-between align-items-center mb-0  full-width">
                                                                Title
                                                                <span className="d-flex">
                                                                    <span className="form-check mx-2">
                                                                        <input
                                                                            className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={EditData.workingThisWeek}
                                                                            value={EditData.workingThisWeek}
                                                                            onChange={(e) =>
                                                                                changeStatus(e, "workingThisWeek")
                                                                            }
                                                                        />
                                                                        <label className="form-check-label">
                                                                            Working This Week
                                                                        </label>
                                                                    </span>

                                                                    <span className="form-check">
                                                                        <input
                                                                            className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={EditData.IsTodaysTask}
                                                                            value={EditData.IsTodaysTask}
                                                                            onChange={(e) =>
                                                                                changeStatus(e, "IsTodaysTask")
                                                                            }
                                                                        />
                                                                        <label className="form-check-label">
                                                                            Working Today
                                                                        </label>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Task Name"
                                                                defaultValue={EditData.Title}
                                                                onChange={(e) =>
                                                                    setUpdateTaskInfo({
                                                                        ...UpdateTaskInfo,
                                                                        Title: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mx-0 row taskdate ">
                                                        <div className="col-6 ps-0 mt-2">
                                                            <div className="input-group ">

                                                                <label className="form-label full-width">
                                                                    Start Date
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    max="9999-12-31"

                                                                    value={
                                                                        EditData.StartDate
                                                                            ? Moment(EditData.StartDate).format("YYYY-MM-DD")
                                                                            : ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...EditData,
                                                                            StartDate: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 pe-0 mt-2">
                                                            <div className="input-group ">
                                                                <div className="form-label full-width">
                                                                    Due Date
                                                                    <span title="Re-occurring Due Date">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input rounded-0 ms-2"
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    placeholder="Enter Due Date"
                                                                    max="9999-12-31"
                                                                    value={
                                                                        EditData.DueDate
                                                                            ? Moment(EditData.DueDate).format("YYYY-MM-DD")
                                                                            : ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...EditData,
                                                                            DueDate: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 mt-2">
                                                            <div className="input-group ">
                                                                <label className="form-label full-width">
                                                                    {" "}
                                                                    Completed Date{" "}
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    max="9999-12-31"

                                                                    value={
                                                                        EditData.CompletedDate
                                                                            ? Moment(EditData.CompletedDate).format("YYYY-MM-DD")
                                                                            : ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...EditData,
                                                                            CompletedDate: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 pe-0 mt-2">
                                                            <div className="input-group">
                                                                <label className="form-label full-width">
                                                                    Item Rank
                                                                </label>
                                                                <select
                                                                    className="form-select"
                                                                    defaultValue={EditData.ItemRank}
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...EditData,
                                                                            ItemRank: e.target.value,
                                                                        })
                                                                    }
                                                                >
                                                                    {ItemRankArray.map(function (h: any, i: any) {
                                                                        return (
                                                                            <option
                                                                                key={i}
                                                                                selected={EditData.ItemRank == h.rank}
                                                                                value={h.rank}
                                                                            >
                                                                                {h.rankTitle}
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mx-0 row mt-2 taskservices">
                                                        <div className="col-md-6  ps-0">
                                                            <div className="input-group mb-2">
                                                                <label className="form-label full-width">
                                                                    Portfolio Item
                                                                </label>
                                                                {TaggedPortfolioData?.length > 0 ? (
                                                                    <div className="full-width">
                                                                        {TaggedPortfolioData?.map((com: any) => {
                                                                            return (
                                                                                <div className="full-width replaceInput alignCenter">
                                                                                    <a
                                                                                        title={com.Title}
                                                                                        target="_blank"
                                                                                        data-interception="off"
                                                                                        className="textDotted"
                                                                                        href={`${siteUrls}/SitePages/Portfolio-Profile.aspx?taskId=${com.Id}`}
                                                                                    >
                                                                                        {com.Title}
                                                                                    </a>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (

                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={SearchedServiceComponentKey}
                                                                        onChange={(e) =>
                                                                            autoSuggestionsForServiceAndComponent(
                                                                                e,
                                                                                "Portfolio"
                                                                            )
                                                                        }
                                                                        placeholder="Search Portfolio Item"
                                                                    />
                                                                )}
                                                                <span className="input-group-text">
                                                                    <span
                                                                        title="Component Popup"
                                                                        onClick={() =>
                                                                            OpenTeamPortfolioPopupFunction(
                                                                                EditData,
                                                                                "Portfolio"
                                                                            )
                                                                        }
                                                                        className="svg__iconbox svg__icon--editBox"
                                                                    ></span>
                                                                </span>
                                                                {SearchedServiceComponentData?.length > 0 ? (
                                                                    <div className="SmartTableOnTaskPopup">
                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                            {SearchedServiceComponentData.map((Item: any) => {
                                                                                return (
                                                                                    <li
                                                                                        className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                        key={Item.id}
                                                                                        onClick={() =>
                                                                                            setSelectedServiceAndComponentData(
                                                                                                Item,
                                                                                                "Single"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <a>{Item.Path}</a>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                ) : null}
                                                            </div>

                                                            <div className="input-group mb-2">
                                                                <label className="form-label full-width">
                                                                    Categories
                                                                </label>
                                                                {TaskCategoriesData?.length > 1 ? <>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="txtCategories"
                                                                        placeholder="Search Category Here"
                                                                        value={categorySearchKey}
                                                                        onChange={(e) => autoSuggestionsForCategory(e)}
                                                                    />
                                                                    {SearchedCategoryData?.length > 0 ? (
                                                                        <div className="SmartTableOnTaskPopup">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {SearchedCategoryData.map((item: any) => {
                                                                                    return (
                                                                                        <li
                                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                            key={item.id}
                                                                                            onClick={() =>
                                                                                                setSelectedCategoryData(
                                                                                                    [item],
                                                                                                    "For-Auto-Search"
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <a>{item.Newlabel}</a>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    ) : null}
                                                                    {TaskCategoriesData?.map(
                                                                        (type: any, index: number) => {

                                                                            return (
                                                                                <div className="block w-100">
                                                                                    <a
                                                                                        style={{ color: "#fff !important" }}
                                                                                        className="textDotted"
                                                                                    >
                                                                                        {type.Title}
                                                                                    </a>
                                                                                    <span
                                                                                        onClick={() =>
                                                                                            removeCategoryItem(
                                                                                                type.Title
                                                                                            )
                                                                                        }
                                                                                        className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                                    ></span>
                                                                                </div>
                                                                            );

                                                                        }
                                                                    )}</> :
                                                                    <>
                                                                        {TaskCategoriesData?.length == 1 ?

                                                                            <div className="full-width">
                                                                                {TaskCategoriesData?.map((CategoryItem: any) => {
                                                                                    return (
                                                                                        <div className="full-width replaceInput alignCenter">
                                                                                            <a
                                                                                                title={CategoryItem.Title}
                                                                                                target="_blank"
                                                                                                data-interception="off"
                                                                                                className="textDotted"
                                                                                            >
                                                                                                {CategoryItem.Title}
                                                                                            </a>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                            :
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="txtCategories"
                                                                                    placeholder="Search Category Here"
                                                                                    value={categorySearchKey}
                                                                                    onChange={(e) => autoSuggestionsForCategory(e)}
                                                                                />
                                                                                {SearchedCategoryData?.length > 0 ? (
                                                                                    <div className="SmartTableOnTaskPopup">
                                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                            {SearchedCategoryData.map((item: any) => {
                                                                                                return (
                                                                                                    <li
                                                                                                        className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                                        key={item.id}
                                                                                                        onClick={() =>
                                                                                                            setSelectedCategoryData(
                                                                                                                [item],
                                                                                                                "For-Auto-Search"
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        <a>{item.Newlabel}</a>
                                                                                                    </li>
                                                                                                );
                                                                                            })}
                                                                                        </ul>
                                                                                    </div>
                                                                                ) : null}
                                                                            </>
                                                                        }

                                                                    </>

                                                                }

                                                                <span
                                                                    className="input-group-text"
                                                                    title="Smart Category Popup"
                                                                    onClick={(e) =>
                                                                        EditComponentPicker(EditData, "Categories")
                                                                    }
                                                                >
                                                                    <span className="svg__iconbox svg__icon--editBox"></span>
                                                                </span>
                                                            </div>


                                                        </div>
                                                        <div className="col-6 ps-0 pe-0">
                                                            <div className="row">
                                                                <div className="time-status col-md-6">
                                                                    <div className="input-group">
                                                                        <label className="form-label full-width">Priority</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Enter Priority"
                                                                            value={
                                                                                EditData.PriorityRank
                                                                                    ? EditData.PriorityRank
                                                                                    : ""
                                                                            }
                                                                            onChange={(e) => ChangePriorityStatusFunction(e)}
                                                                        />
                                                                    </div>
                                                                    <ul className="p-0 my-1">
                                                                        <li className="form-check ">
                                                                            <label className="SpfxCheckRadio">
                                                                                <input
                                                                                    className="radio"
                                                                                    name="radioPriority"
                                                                                    type="radio"
                                                                                    checked={
                                                                                        EditData.PriorityRank <= 10 &&
                                                                                        EditData.PriorityRank >= 8
                                                                                    }
                                                                                    onChange={() =>
                                                                                        ChangePriorityStatusFunction({
                                                                                            target: {
                                                                                                value: 8
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                />
                                                                                High{" "}
                                                                            </label>
                                                                        </li>
                                                                        <li className="form-check ">
                                                                            <label className="SpfxCheckRadio">
                                                                                <input
                                                                                    className="radio"
                                                                                    name="radioPriority"
                                                                                    type="radio"
                                                                                    checked={
                                                                                        EditData.PriorityRank <= 7 &&
                                                                                        EditData.PriorityRank >= 4
                                                                                    }
                                                                                    onChange={() =>
                                                                                        ChangePriorityStatusFunction({
                                                                                            target: {
                                                                                                value: 4
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                />
                                                                                Normal{" "}
                                                                            </label>
                                                                        </li>
                                                                        <li className="form-check ">
                                                                            <label className="SpfxCheckRadio">
                                                                                <input
                                                                                    className="radio"
                                                                                    name="radioPriority"
                                                                                    type="radio"
                                                                                    checked={
                                                                                        EditData.PriorityRank <= 3 &&
                                                                                        EditData.PriorityRank > 0
                                                                                    }
                                                                                    onChange={() =>
                                                                                        ChangePriorityStatusFunction({
                                                                                            target: {
                                                                                                value: 1
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                />
                                                                                Low{" "}
                                                                            </label>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="input-group">
                                                                        <label className="form-label full-width">SmartPriority</label>
                                                                        <div className="bg-e9 w-100 py-1 px-2" style={{ border: '1px solid #CDD4DB' }}>
                                                                            <span className={EditData?.SmartPriority != undefined ? "hover-text hreflink m-0 siteColor sxsvc" : "hover-text hreflink m-0 siteColor cssc"}>
                                                                                <>{EditData?.SmartPriority != undefined ? EditData?.SmartPriority : 0}</>
                                                                                <span className="tooltip-text pop-right">
                                                                                    {EditData?.showFormulaOnHover != undefined ?

                                                                                        <SmartPriorityHover editValue={EditData} /> : ""}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="col-12 mb-2">
                                                                <div className="input-group ">
                                                                    <label className="form-label full-width">
                                                                        Client Activity
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Client Activity"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="col-12"
                                                                title="Relevant Portfolio Items"
                                                            >
                                                                <div className="input-group">
                                                                    <label className="form-label full-width ">
                                                                        {" "}
                                                                        Linked Component Task{" "}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        className="form-control "
                                                                    />
                                                                    <span
                                                                        className="input-group-text"
                                                                        title="Linked Component Task Popup"
                                                                        onClick={(e) =>
                                                                            alert(
                                                                                "We are working on It. This Feature Will Be Live Soon..."
                                                                            )
                                                                        }
                                                                    >
                                                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mb-2 mt-2">
                                                                <div className="input-group mb-2">
                                                                    <label className="form-label full-width">
                                                                        Linked Portfolio Items
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={SearchedLinkedPortfolioKey}
                                                                        onChange={(e) =>
                                                                            autoSuggestionsForServiceAndComponent(
                                                                                e,
                                                                                "Linked-Portfolios"
                                                                            )
                                                                        }
                                                                        placeholder="Search Portfolio Items"
                                                                    />
                                                                    <span className="input-group-text">
                                                                        <span
                                                                            title="Component Popup"
                                                                            onClick={() =>
                                                                                OpenTeamPortfolioPopupFunction(
                                                                                    EditData,
                                                                                    "Linked-Portfolios"
                                                                                )
                                                                            }
                                                                            className="svg__iconbox svg__icon--editBox"
                                                                        ></span>
                                                                    </span>
                                                                    {SearchedLinkedPortfolioData?.length > 0 ? (
                                                                        <div className="SmartTableOnTaskPopup">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {SearchedLinkedPortfolioData.map(
                                                                                    (Item: any) => {
                                                                                        return (
                                                                                            <li
                                                                                                className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                                key={Item.id}
                                                                                                onClick={() =>
                                                                                                    setSelectedServiceAndComponentData(
                                                                                                        Item,
                                                                                                        "Multi"
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <a>{Item.Path}</a>
                                                                                            </li>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    ) : null}
                                                                </div>

                                                                {linkedPortfolioData?.length > 0 ? (
                                                                    <div className="full-width">
                                                                        {linkedPortfolioData?.map(
                                                                            (com: any, Index: any) => {
                                                                                return (
                                                                                    <>
                                                                                        <div className="block w-100">
                                                                                            <a
                                                                                                title={com.Title}
                                                                                                className="wid90"
                                                                                                style={{ color: "#fff !important" }}
                                                                                                target="_blank"
                                                                                                data-interception="off"
                                                                                                href={`${siteUrls}/SitePages/Portfolio-Profile.aspx?taskId=${com.Id}`}
                                                                                            >
                                                                                                {com.Title}
                                                                                            </a>

                                                                                            <span
                                                                                                onClick={() =>
                                                                                                    RemoveLinkedPortfolio(Index)
                                                                                                }
                                                                                                className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                                            ></span>
                                                                                        </div>
                                                                                    </>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="input-group">
                                                                    <label className="form-label full-width">
                                                                        Project
                                                                    </label>
                                                                    {selectedProject != undefined &&
                                                                        selectedProject.length > 0 ? (
                                                                        <>
                                                                            {selectedProject?.map((ProjectData: any) => {
                                                                                return (
                                                                                    <>
                                                                                        {ProjectData.Title != undefined ? (
                                                                                            <div className="full-width replaceInput alignCenter">
                                                                                                <a

                                                                                                    target="_blank"
                                                                                                    title={ProjectData.Title}
                                                                                                    data-interception="off"
                                                                                                    className="textDotted hreflink"
                                                                                                    href={`${siteUrls}/SitePages/PX-Profile.aspx?ProjectId=${ProjectData.Id}`}
                                                                                                >
                                                                                                    {ProjectData.Title}
                                                                                                </a>
                                                                                            </div>
                                                                                        ) : <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="Search Project Here"
                                                                                            value={ProjectSearchKey}
                                                                                            onChange={(e) => autoSuggestionsForProject(e)}
                                                                                        />}
                                                                                    </>
                                                                                );
                                                                            })}
                                                                        </>
                                                                    ) :
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Search Project Here"
                                                                            value={ProjectSearchKey}
                                                                            onChange={(e) => autoSuggestionsForProject(e)}
                                                                        />
                                                                    }
                                                                    <span
                                                                        className="input-group-text"
                                                                        onClick={() => setProjectManagementPopup(true)}
                                                                        title="Project Items Popup"
                                                                    >
                                                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                                                    </span>
                                                                    {SearchedProjectData?.length > 0 ? (
                                                                        <div className="SmartTableOnTaskPopup">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {SearchedProjectData.map((item: any) => {
                                                                                    return (
                                                                                        <li
                                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                            key={item.id}
                                                                                            onClick={() =>
                                                                                                SelectProjectFromAutoSuggestion([item])
                                                                                            }
                                                                                        >
                                                                                            <a>
                                                                                                <span>
                                                                                                    {item?.Item_x0020_Type == "Sprint" ?
                                                                                                        <div title={item?.Item_x0020_Type} style={{ backgroundColor: `${item?.PortfolioType?.Color}` }} className={"Dyicons me-1"}>
                                                                                                            X
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div title={item?.Item_x0020_Type} style={{ backgroundColor: `${item?.PortfolioType?.Color}` }} className={"Dyicons me-1"}>
                                                                                                            P
                                                                                                        </div>
                                                                                                    }
                                                                                                </span>
                                                                                                {item?.TaskID}-{item?.Path}
                                                                                            </a>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 mb-2 taskurl">
                                                        <div className="input-group">
                                                            <label className="form-label full-width ">
                                                                Relevant URL
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue={
                                                                    EditData.ComponentLink != null
                                                                        ? EditData.Relevant_Url
                                                                        : ""
                                                                }
                                                                placeholder="Url"
                                                                onChange={(e) =>
                                                                    setEditData({
                                                                        ...EditData,
                                                                        Relevant_Url: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                            <span
                                                                className={
                                                                    EditData.ComponentLink != null
                                                                        ? "input-group-text"
                                                                        : "input-group-text Disabled-Link"
                                                                }
                                                            >
                                                                <a
                                                                    target="_blank"
                                                                    href={
                                                                        EditData.ComponentLink != null
                                                                            ? EditData.ComponentLink.Url
                                                                            : ""
                                                                    }
                                                                    data-interception="off"
                                                                >
                                                                    <span title="Open in New Tab" className="svg__iconbox svg__icon--link"></span>
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    {AllListIdData.isShowSiteCompostion ? (
                                                        <div className="Sitecomposition mb-2">
                                                            <div className="dropdown">
                                                                <a className="sitebutton bg-fxdark alignCenter justify-content-between">
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() =>
                                                                            setComposition(composition ? false : true)
                                                                        }
                                                                    >
                                                                        <span>
                                                                            {composition ? (
                                                                                <SlArrowDown />
                                                                            ) : (
                                                                                <SlArrowRight />
                                                                            )}
                                                                        </span>
                                                                        <span className="mx-2">Site Composition</span>
                                                                    </div>
                                                                    <span
                                                                        className="svg__iconbox svg__icon--editBox hreflink"
                                                                        title="Edit Site Composition"
                                                                        onClick={() => setSiteCompositionShow(true)}
                                                                    ></span>
                                                                </a>
                                                                {composition &&
                                                                    EditData.siteCompositionData?.length > 0 ? (
                                                                    <div className="spxdropdown-menu">
                                                                        <ul>
                                                                            {EditData.siteCompositionData != undefined &&
                                                                                EditData.siteCompositionData?.length > 0 ? (
                                                                                <>
                                                                                    {EditData.siteCompositionData?.map(
                                                                                        (SiteDtls: any, i: any) => {
                                                                                            return (
                                                                                                <li className="Sitelist">
                                                                                                    <span className="ms-2" title={SiteDtls.Title}>
                                                                                                        <img
                                                                                                            style={{ width: "22px" }}
                                                                                                            src={SiteDtls.SiteImages}
                                                                                                        />
                                                                                                    </span>

                                                                                                    {SiteDtls.ClienTimeDescription !=
                                                                                                        undefined && (
                                                                                                            <span className="mx-2">
                                                                                                                {Number(
                                                                                                                    SiteDtls.ClienTimeDescription
                                                                                                                ).toFixed(1)}
                                                                                                                %
                                                                                                            </span>
                                                                                                        )}

                                                                                                    <span className="d-inline">
                                                                                                        {SiteDtls.ClientCategory != undefined && SiteDtls.ClientCategory.length > 0 ? SiteDtls.ClientCategory?.map((clientcat: any, Index: any) => {
                                                                                                            return (
                                                                                                                <div className={Index == SiteDtls.ClientCategory?.length - 1 ? "mb-0" : "mb-0 border-bottom"}>{clientcat.Title}</div>
                                                                                                            )
                                                                                                        }) : null}
                                                                                                    </span>

                                                                                                </li>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </>
                                                                            ) : null}
                                                                        </ul>
                                                                    </div>
                                                                ) : null}
                                                                {EditData.siteCompositionData?.length > 0 ? (
                                                                    <div className="bg-e9 border-1 p-1 total-time">
                                                                        <label className="siteColor">Total Time</label>
                                                                        {EditData.Id != null ? (
                                                                            <span className="pull-right siteColor">
                                                                                <SmartTotalTime
                                                                                    props={EditData}
                                                                                    callBack={SmartTotalTimeCallBack}
                                                                                />{" "}
                                                                                h
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                    <div className="col mt-2 clearfix">
                                                        <div className="input-group taskTime">
                                                            <label className="form-label full-width">Status</label>
                                                            <input
                                                                type="text"
                                                                maxLength={3}
                                                                placeholder="% Complete"
                                                                disabled
                                                                readOnly
                                                                className="bg-body form-control px-2"
                                                                value={PercentCompleteStatus}
                                                            />

                                                            <span
                                                                className="input-group-text"
                                                                title="Status Popup"
                                                                onClick={() => setSmartMetaDataUsedPanel("Status")}
                                                            >
                                                                <span
                                                                    title="Edit Task"
                                                                    className="svg__iconbox svg__icon--editBox"
                                                                ></span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col mt-2 time-status">
                                                            <div>
                                                                <div className="input-group">
                                                                    <label className="form-label full-width ">
                                                                        Time
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        maxLength={3}
                                                                        className="form-control"
                                                                        placeholder="Time"
                                                                        defaultValue={
                                                                            EditData.Mileage != null ? EditData.Mileage : ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            setEditData({
                                                                                ...EditData,
                                                                                Mileage: e.target.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                                <ul className="p-0 mt-1">
                                                                    <li className="form-check">
                                                                        <label className="SpfxCheckRadio">
                                                                            <input
                                                                                name="radioTime"
                                                                                className=" radio"
                                                                                checked={
                                                                                    EditData.Mileage <= 15 &&
                                                                                        EditData.Mileage > 0
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                                type="radio"
                                                                                onChange={(e) =>
                                                                                    setEditData({ ...EditData, Mileage: "15" })
                                                                                }
                                                                                defaultChecked={
                                                                                    EditData.Mileage <= 15 &&
                                                                                        EditData.Mileage > 0
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                            />
                                                                            Very Quick{" "}
                                                                        </label>
                                                                    </li>
                                                                    <li className="form-check">
                                                                        <label className="SpfxCheckRadio">
                                                                            <input
                                                                                name="radioTime"
                                                                                className=" radio"
                                                                                checked={
                                                                                    EditData.Mileage <= 60 &&
                                                                                        EditData.Mileage > 15
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                                type="radio"
                                                                                onChange={(e) =>
                                                                                    setEditData({ ...EditData, Mileage: "60" })
                                                                                }
                                                                                defaultChecked={
                                                                                    EditData.Mileage <= 60 &&
                                                                                        EditData.Mileage > 15
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                            />
                                                                            Quick
                                                                        </label>
                                                                    </li>
                                                                    <li className="form-check">
                                                                        <label className="SpfxCheckRadio">
                                                                            <input
                                                                                name="radioTime"
                                                                                className="radio"
                                                                                checked={
                                                                                    EditData.Mileage <= 240 &&
                                                                                        EditData.Mileage > 60
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                                type="radio"
                                                                                onChange={(e) =>
                                                                                    setEditData({ ...EditData, Mileage: "240" })
                                                                                }
                                                                                defaultChecked={
                                                                                    EditData.Mileage <= 240 &&
                                                                                        EditData.Mileage > 60
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                            />
                                                                            Medium
                                                                        </label>
                                                                    </li>
                                                                    <li className="form-check">
                                                                        <label className="SpfxCheckRadio">
                                                                            <input
                                                                                name="radioTime"
                                                                                className=" radio"
                                                                                checked={EditData.Mileage === "480"}
                                                                                type="radio"
                                                                                onChange={(e) =>
                                                                                    setEditData({ ...EditData, Mileage: "480" })
                                                                                }
                                                                                defaultChecked={
                                                                                    EditData.Mileage <= 480 &&
                                                                                        EditData.Mileage > 240
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                            />
                                                                            Long
                                                                        </label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col mt-2">
                                                            <div className="input-group">
                                                                <label className="form-label full-width">
                                                                    {EditData.TaskAssignedUsers?.length > 0
                                                                        ? "Working Member"
                                                                        : ""}
                                                                </label>
                                                                {EditData.TaskAssignedUsers?.map(
                                                                    (userDtl: any, index: any) => {
                                                                        return (
                                                                            <div className="TaskUsers" key={index}>
                                                                                <a
                                                                                    target="_blank"
                                                                                    data-interception="off"
                                                                                    href={`${siteUrls}/SitePages/TaskDashboard.aspx?UserId=${userDtl.AssingedToUserId}&Name=${userDtl.Title}`}
                                                                                >
                                                                                    {userDtl?.Item_x0020_Cover?.Url?.length > 0 ? (
                                                                                        <img
                                                                                            className="ProirityAssignedUserPhoto me-2"
                                                                                            data-bs-placement="bottom"
                                                                                            title={userDtl.Title ? userDtl.Title : ""}
                                                                                            src={
                                                                                                userDtl.Item_x0020_Cover
                                                                                                    ? userDtl.Item_x0020_Cover.Url
                                                                                                    : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        <span
                                                                                            title={userDtl.Title ? userDtl.Title : ""}
                                                                                            className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                                        ></span>
                                                                                    )}
                                                                                </a>

                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border p-2 mb-3">
                                                        <div className="alignCenter"><LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"EstimatedTaskTime"} onlyText={"text"} /></div>
                                                        <div className="col-12">
                                                            <div
                                                                onChange={UpdateEstimatedTimeDescriptions}
                                                                className="full-width"
                                                            >
                                                                <div className="input-group mt-2">
                                                                    <LabelInfoIconToolTip ShowPencilIcon={ShowPencilIcon} ContextInfo={Items?.AllListId} columnName={"SelectCategory"} />
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        defaultValue={EstimatedDescriptionCategory}
                                                                        value={EstimatedDescriptionCategory}
                                                                        placeholder="Select Category"
                                                                        onChange={(e) =>
                                                                            setEstimatedDescriptionCategory(e.target.value)
                                                                        }
                                                                    />
                                                                    <span
                                                                        className="input-group-text"
                                                                        title="Status Popup"
                                                                        onClick={() =>
                                                                            setSmartMetaDataUsedPanel("Estimated-Time")
                                                                        }
                                                                    >
                                                                        <span
                                                                            title="Edit Task"
                                                                            className="svg__iconbox svg__icon--editBox"
                                                                        ></span>
                                                                    </span>
                                                                </div>
                                                                <div className="gap-2 my-1 d-flex">
                                                                    <input
                                                                        type="number"
                                                                        className="col-6 my-1 p-1"
                                                                        name="Time"
                                                                        defaultValue={EstimatedTime}
                                                                        value={EstimatedTime}
                                                                        placeholder="Estimated Hours"
                                                                    />
                                                                    <button
                                                                        className="btn btn-primary full-width my-1"
                                                                        onClick={SaveEstimatedTimeDescription}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                                <textarea
                                                                    className="form-control p-1"
                                                                    name="Description"
                                                                    defaultValue={EstimatedDescription}
                                                                    value={EstimatedDescription}
                                                                    rows={1}
                                                                    placeholder="Add comment if necessary"
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            {EditData?.EstimatedTimeDescriptionArray != null &&
                                                                EditData?.EstimatedTimeDescriptionArray?.length > 0 ? (
                                                                <div>
                                                                    {EditData?.EstimatedTimeDescriptionArray?.map(
                                                                        (EstimatedTimeData: any, Index: any) => {
                                                                            return (
                                                                                <div className="align-content-center alignCenter justify-content-between py-1">
                                                                                    <div className="alignCenter">
                                                                                        <span className="me-1">
                                                                                            {EstimatedTimeData?.Team != undefined
                                                                                                ? EstimatedTimeData.Team
                                                                                                : EstimatedTimeData.Category !=
                                                                                                    undefined
                                                                                                    ? EstimatedTimeData.Category
                                                                                                    : null}
                                                                                        </span>{" "}
                                                                                        |
                                                                                        <span className="mx-1">
                                                                                            {EstimatedTimeData?.EstimatedTime
                                                                                                ? EstimatedTimeData.EstimatedTime > 1
                                                                                                    ? EstimatedTimeData.EstimatedTime +
                                                                                                    " Hours"
                                                                                                    : EstimatedTimeData.EstimatedTime +
                                                                                                    " Hour"
                                                                                                : "0 Hour"}
                                                                                        </span>
                                                                                        {EstimatedTimeData?.UserImage?.length > 0 ? (
                                                                                            <img
                                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                                title={EstimatedTimeData.UserName}
                                                                                                src={
                                                                                                    EstimatedTimeData.UserImage !=
                                                                                                        undefined &&
                                                                                                        EstimatedTimeData.UserImage?.length >
                                                                                                        0
                                                                                                        ? EstimatedTimeData.UserImage
                                                                                                        : ""
                                                                                                }
                                                                                            />
                                                                                        ) : (
                                                                                            <span
                                                                                                title={EstimatedTimeData.UserName}
                                                                                                className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                                            ></span>
                                                                                        )}
                                                                                    </div>
                                                                                    {EstimatedTimeData?.EstimatedTimeDescription
                                                                                        ?.length > 0 ? (
                                                                                        <span className="hover-text m-0 alignIcon">
                                                                                            <span className="svg__iconbox svg__icon--info"></span>
                                                                                            <span className="tooltip-text pop-right">
                                                                                                {
                                                                                                    EstimatedTimeData?.EstimatedTimeDescription
                                                                                                }
                                                                                            </span>
                                                                                        </span>
                                                                                    ) : null}
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                    <div className="border-top pt-1">
                                                                        <span>Total Estimated Time : </span>
                                                                        <span className="mx-1">
                                                                            {TotalEstimatedTime > 1
                                                                                ? TotalEstimatedTime + " hours"
                                                                                : TotalEstimatedTime + " hour"}{" "}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {/* <div className="Sitecomposition mb-3">
                                            <a className="sitebutton bg-fxdark alignCenter justify-content-between">
                                                <span className="alignCenter">
                                                    <span className="svg__iconbox svg__icon--docx"></span>
                                                    <span className="mx-2">Submit EOD Report</span>
                                                </span>
                                                <span className="svg__iconbox svg__icon--editBox hreflink" title="Submit EOD Report Popup"
                                                    onClick={() => setOpenEODReportPopup(true)}>
                                                </span>
                                            </a>
                                        </div> */}
                                                </div>
                                                <div className="col-md-4 taskservices">
                                                    {/* This is used for bottleneck  */}
                                                    <div className="col ps-0">
                                                        <div className="input-group">
                                                            <label className="form-label full-width alignCenter mb-1">
                                                                Bottleneck
                                                            </label>
                                                            {WorkingAction?.length > 0 ? (
                                                                <>
                                                                    {WorkingAction.map((WAItemData, ItemIndex) => {
                                                                        if ((WAItemData.Title === "Bottleneck") && (WAItemData?.InformationData?.length === 0 || WAItemData?.InformationData?.length > 1)) {
                                                                            return (
                                                                                <>   <input
                                                                                    type="text"
                                                                                    value={BottleneckSearchKey}
                                                                                    className="form-control"
                                                                                    placeholder="Tag user for Bottleneck"
                                                                                    onChange={(e) => autoSuggestionsForApprover(e, "Bottleneck")}
                                                                                />
                                                                                    <span
                                                                                        className="input-group-text"
                                                                                        onClick={() => openTaskUserPopup("Bottleneck")}
                                                                                    >
                                                                                        <span
                                                                                            title="Edit"
                                                                                            className="svg__iconbox svg__icon--editBox"
                                                                                        ></span>
                                                                                    </span>
                                                                                </>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={BottleneckSearchKey}
                                                                        className="form-control"
                                                                        placeholder="Tag user for Attention"
                                                                        onChange={(e) => autoSuggestionsForApprover(e, "Bottleneck")}
                                                                    />
                                                                    <span
                                                                        className="input-group-text"
                                                                        onClick={() => openTaskUserPopup("Bottleneck")}
                                                                    >
                                                                        <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>
                                                                    </span>
                                                                </>
                                                            )}
                                                            {BottleneckSearchedData?.length > 0 && (
                                                                <div className="SmartTableOnTaskPopup">
                                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                        {BottleneckSearchedData.map((item) => (
                                                                            <li
                                                                                className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                key={item.id}
                                                                                onClick={() => SelectApproverFromAutoSuggestion(item, "Bottleneck")}
                                                                            >
                                                                                <a>{item.NewLabel}</a>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                            if (WAItemData.Title === "Bottleneck" && WAItemData?.InformationData?.length > 0) {
                                                                return (
                                                                    <div className="border p-1 mt-1" key={ItemIndex}>
                                                                        {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: any) => (
                                                                            <div className="align-content-center alignCenter justify-content-between py-1" key={InfoIndex}>
                                                                                <div className="alignCenter">
                                                                                    {InfoData?.TaggedUsers?.userImage?.length > 0 ? (
                                                                                        <img
                                                                                            className="ProirityAssignedUserPhoto m-0"
                                                                                            title={InfoData.TaggedUsers?.Title}
                                                                                            src={InfoData.TaggedUsers.userImage}
                                                                                        />
                                                                                    ) : (
                                                                                        <span
                                                                                            title={InfoData.TaggedUsers?.Title}
                                                                                            className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                                        ></span>
                                                                                    )}
                                                                                    <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                                </div>

                                                                                <div className="alignCenter">
                                                                                    <span
                                                                                        onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Reminder", WAItemData.Title)}
                                                                                        className="hover-text m-1"
                                                                                    >
                                                                                        <LuBellPlus></LuBellPlus>
                                                                                        <span className="tooltip-text pop-left">
                                                                                            Send reminder notifications
                                                                                        </span>
                                                                                    </span>
                                                                                    <span
                                                                                        className="m-0 img-info hover-text"
                                                                                        onClick={() => openAddImageDescriptionFunction(InfoIndex, InfoData, "Bottleneck")}
                                                                                    >
                                                                                        <span className="svg__iconbox svg__icon--comment"></span>
                                                                                        <span className="tooltip-text pop-left">
                                                                                            {InfoData.Comment?.length > 1 ? InfoData.Comment : "Add Comment"}
                                                                                        </span>
                                                                                    </span>
                                                                                    <span
                                                                                        className="hover-text m-0 alignIcon"
                                                                                        onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Remove", WAItemData.Title)}
                                                                                    >
                                                                                        <span className="svg__iconbox svg__icon--cross"></span>

                                                                                        <span className="tooltip-text pop-left">
                                                                                            Remove user from Bottleneck
                                                                                        </span>
                                                                                    </span>
                                                                                    {WAItemData?.InformationData?.length === 1 && (
                                                                                        <span className="hover-text alignCenter">
                                                                                            <span onClick={() => openTaskUserPopup("Bottleneck")} className="svg__iconbox svg__icon--Plus"></span>
                                                                                            <span className="tooltip-text pop-left">
                                                                                                Add User
                                                                                            </span>
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                    {/* This is used for Attentions  */}
                                                    <div className="col mt-2 ps-0">
                                                        <div className="input-group">
                                                            <label className="form-label full-width alignCenter mb-1">Attention</label>
                                                            {WorkingAction?.length > 0 ? (
                                                                <>
                                                                    {WorkingAction.map((WAItemData, ItemIndex) => {
                                                                        if (
                                                                            WAItemData.Title === "Attention" &&
                                                                            (WAItemData?.InformationData?.length === 0 ||
                                                                                WAItemData?.InformationData?.length > 1)
                                                                        ) {
                                                                            return (
                                                                                <>   <input
                                                                                    type="text"
                                                                                    value={AttentionSearchKey}
                                                                                    className="form-control"
                                                                                    placeholder="Tag user for Attention"
                                                                                    onChange={(e) => autoSuggestionsForApprover(e, "Attention")}
                                                                                />
                                                                                    <span
                                                                                        className="input-group-text"
                                                                                        onClick={() => openTaskUserPopup("Attention")}
                                                                                    >
                                                                                        <span
                                                                                            title="Edit"
                                                                                            className="svg__iconbox svg__icon--editBox"
                                                                                        ></span>
                                                                                    </span>
                                                                                </>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={AttentionSearchKey}
                                                                        className="form-control"
                                                                        placeholder="Tag user for Attention"
                                                                        onChange={(e) => autoSuggestionsForApprover(e, "Attention")}
                                                                    />
                                                                    <span
                                                                        className="input-group-text"
                                                                        onClick={() => openTaskUserPopup("Attention")}
                                                                    >
                                                                        <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>
                                                                    </span>
                                                                </>
                                                            )}

                                                            {AttentionSearchedData?.length > 0 && (
                                                                <div className="SmartTableOnTaskPopup">
                                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                        {AttentionSearchedData.map((item) => (
                                                                            <li
                                                                                className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                key={item.id}
                                                                                onClick={() => SelectApproverFromAutoSuggestion(item, "Attention")}
                                                                            >
                                                                                <a>{item.NewLabel}</a>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                            if (
                                                                WAItemData.Title === "Attention" &&
                                                                WAItemData?.InformationData?.length > 0
                                                            ) {
                                                                return (
                                                                    <div className="border p-1 mt-1" key={ItemIndex}>
                                                                        {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: any) => (
                                                                            <div
                                                                                className="align-content-center alignCenter justify-content-between py-1"
                                                                                key={InfoIndex}
                                                                            >
                                                                                <div className="alignCenter">
                                                                                    {InfoData?.TaggedUsers?.userImage?.length > 0 ? (
                                                                                        <img
                                                                                            className="ProirityAssignedUserPhoto m-0"
                                                                                            title={InfoData.TaggedUsers?.Title}
                                                                                            src={InfoData.TaggedUsers.userImage}
                                                                                        />
                                                                                    ) : (
                                                                                        <span
                                                                                            title={InfoData.TaggedUsers?.Title}
                                                                                            className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                                        ></span>
                                                                                    )}
                                                                                    <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                                </div>

                                                                                <div className="alignCenter">
                                                                                    <span
                                                                                        onClick={() =>
                                                                                            BottleneckAndAttentionFunction(
                                                                                                InfoData,
                                                                                                InfoIndex,
                                                                                                "Reminder",
                                                                                                WAItemData.Title
                                                                                            )
                                                                                        }
                                                                                        className="hover-text m-1"
                                                                                    >
                                                                                        <LuBellPlus />
                                                                                        <span className="tooltip-text pop-left">
                                                                                            Send reminder notifications
                                                                                        </span>
                                                                                    </span>
                                                                                    <span
                                                                                        className="m-0 img-info hover-text"
                                                                                        onClick={() =>
                                                                                            openAddImageDescriptionFunction(
                                                                                                InfoIndex,
                                                                                                InfoData,
                                                                                                "Attention"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <span className="svg__iconbox svg__icon--comment"></span>
                                                                                        <span className="tooltip-text pop-left">
                                                                                            {InfoData.Comment?.length > 1
                                                                                                ? InfoData.Comment
                                                                                                : "Add Comment"}
                                                                                        </span>
                                                                                    </span>
                                                                                    <span
                                                                                        className="hover-text m-0 alignIcon"
                                                                                        onClick={() =>
                                                                                            BottleneckAndAttentionFunction(
                                                                                                InfoData,
                                                                                                InfoIndex,
                                                                                                "Remove",
                                                                                                WAItemData.Title
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <span className="svg__iconbox svg__icon--cross"></span>
                                                                                        <span className="tooltip-text pop-left">
                                                                                            Remove user from Attention
                                                                                        </span>
                                                                                    </span>
                                                                                    {WAItemData?.InformationData?.length === 1 ? (
                                                                                        <span className="hover-text alignCenter">
                                                                                            <span onClick={() => openTaskUserPopup("Attention")} className="svg__iconbox svg__icon--Plus"></span>
                                                                                            <span className="tooltip-text pop-left">
                                                                                                Add User
                                                                                            </span>
                                                                                        </span>
                                                                                    ) : null}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                    {/* //////////////////////////////this is used for phone section/////////////////////////// */}
                                                    <div className="col mt-2 ps-0">
                                                        <div className="input-group">
                                                            <label className="form-label full-width alignCenter mb-1">
                                                                Phone
                                                            </label>
                                                            {WorkingAction?.length > 0 ? <> {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                                if ((WAItemData.Title === "Phone") && (WAItemData?.InformationData?.length === 0 || WAItemData?.InformationData?.length > 1)) {
                                                                    return (
                                                                        <>   <input
                                                                            type="text"
                                                                            value={PhoneSearchKey}
                                                                            className="form-control"
                                                                            placeholder="Tag user for Phone"
                                                                            onChange={(e) => autoSuggestionsForApprover(e, "Phone")}
                                                                            key={ItemIndex}
                                                                        /><span className="input-group-text" onClick={() => openTaskUserPopup("Phone")}>

                                                                                <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>

                                                                            </span></>

                                                                    );
                                                                }
                                                                return null;
                                                            })}</> : <> <input
                                                                type="text"
                                                                value={PhoneSearchKey}
                                                                className="form-control"
                                                                placeholder="Tag user for Phone"
                                                                onChange={(e) => autoSuggestionsForApprover(e, "Phone")}

                                                            />
                                                                <span className="input-group-text" onClick={() => openTaskUserPopup("Phone")}>

                                                                    <span title="Edit" className="svg__iconbox svg__icon--editBox"></span>

                                                                </span>
                                                            </>}

                                                            {PhoneSearchedData?.length > 0 && (
                                                                <div className="SmartTableOnTaskPopup">
                                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                        {PhoneSearchedData.map((item) => (
                                                                            <li
                                                                                className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                key={item.id}
                                                                                onClick={() => SelectApproverFromAutoSuggestion(item, "Phone")}
                                                                            >
                                                                                <a>{item.NewLabel}</a>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {WorkingAction?.map((WAItemData, ItemIndex) => {
                                                            if (WAItemData.Title === "Phone" && WAItemData?.InformationData?.length > 0) {
                                                                return (
                                                                    <div className="border p-1 mt-1" key={ItemIndex}>
                                                                        {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: any) => (
                                                                            <div className="align-content-center alignCenter justify-content-between py-1" key={InfoIndex}>
                                                                                <div className="alignCenter">
                                                                                    {InfoData?.TaggedUsers?.userImage?.length > 0 ? (
                                                                                        <img
                                                                                            className="ProirityAssignedUserPhoto m-0"
                                                                                            title={InfoData.TaggedUsers?.Title}
                                                                                            src={InfoData.TaggedUsers.userImage}
                                                                                        />
                                                                                    ) : (
                                                                                        <span
                                                                                            title={InfoData.TaggedUsers?.Title}
                                                                                            className="alignIcon svg__iconbox svg__icon--defaultUser ProirityAssignedUserPhoto"
                                                                                        ></span>
                                                                                    )}
                                                                                    <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                                </div>

                                                                                <div className="alignCenter">
                                                                                    <span
                                                                                        onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Reminder", WAItemData.Title)}
                                                                                        className="hover-text m-1"
                                                                                    >
                                                                                        <LuBellPlus />
                                                                                        <span className="tooltip-text pop-left">
                                                                                            Send reminder notifications
                                                                                        </span>
                                                                                    </span>
                                                                                    <span
                                                                                        className="m-0 img-info hover-text"
                                                                                        onClick={() => openAddImageDescriptionFunction(InfoIndex, InfoData, "Phone")}
                                                                                    >
                                                                                        <span className="svg__iconbox svg__icon--comment"></span>
                                                                                        <span className="tooltip-text pop-left">
                                                                                            {InfoData.Comment?.length > 1 ? InfoData.Comment : "Add Comment"}
                                                                                        </span>
                                                                                    </span>
                                                                                    <span
                                                                                        className="hover-text m-0 alignIcon"
                                                                                        onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Remove", WAItemData.Title)}
                                                                                    >
                                                                                        <span className="svg__iconbox svg__icon--cross"></span>

                                                                                        <span className="tooltip-text pop-left">
                                                                                            Remove user from Phone
                                                                                        </span>
                                                                                    </span>
                                                                                    {WAItemData?.InformationData?.length === 1 ? (
                                                                                        <span className="hover-text alignCenter">
                                                                                            <span onClick={() => openTaskUserPopup("Phone")} className="svg__iconbox svg__icon--Plus"></span>
                                                                                            <span className="tooltip-text pop-left">
                                                                                                Add User
                                                                                            </span>
                                                                                        </span>
                                                                                    ) : null}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>

                                                    <div className="full_width mt-2">
                                                        <CommentCard
                                                            siteUrl={siteUrls}
                                                            listName={Items?.Items?.siteType}
                                                            itemID={Items.Items.Id}
                                                            AllListId={AllListIdData}
                                                            Context={Context}
                                                        />
                                                    </div>
                                                    <div className="full-width  text-end">
                                                        <span className="">
                                                            <label className="form-check-label mx-2 mb-4">
                                                                Waiting for HHHH response
                                                            </label>
                                                            <input
                                                                className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={EditData.waitForResponse}
                                                                value={EditData.waitForResponse}
                                                                onChange={(e) => changeStatus(e, "waitForResponse")}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {ShowTaskDetailsStatus ? null : (
                                    <div className="p-0 mt--5">
                                        <h6 className="mb-1 mt--10 text-end siteColor hreflink"
                                            onClick={() =>
                                                setShowTaskDetailsStatus(
                                                    ShowTaskDetailsStatus ? false : true
                                                )
                                            }
                                        >
                                            Show task details <SlArrowRight />
                                        </h6>
                                    </div>
                                )}

                                <div
                                    className="slider-image-section col-sm-6 p-2"
                                    style={{
                                        border: "2px solid #ccc",
                                    }}
                                >
                                    <div
                                        id="carouselExampleControls"
                                        className="carousel slide"
                                        data-bs-interval="false"
                                    >
                                        <div className="carousel-inner">
                                            {TaskImages?.map((imgData: any, index: any) => {
                                                return (
                                                    <div
                                                        className={
                                                            index == CurrentImageIndex
                                                                ? "carousel-item active"
                                                                : "carousel-item"
                                                        }
                                                    >
                                                        <img
                                                            src={imgData.ImageUrl}
                                                            className="d-block w-100"
                                                            alt="..."
                                                        />
                                                        <div className="card-footer alignCenter justify-content-between pt-0 pb-1 px-2">
                                                            <div className="alignCenter">
                                                                <span className="mx-1">
                                                                    {imgData.ImageName
                                                                        ? imgData.ImageName.slice(0, 6)
                                                                        : ""}
                                                                </span>
                                                                <span className="fw-semibold">
                                                                    {imgData.UploadeDate
                                                                        ? imgData.UploadeDate
                                                                        : ""}
                                                                </span>
                                                                <span className="mx-1">
                                                                    <img
                                                                        className="imgAuthor"
                                                                        title={
                                                                            imgData.UserName ? imgData.UserName : ""
                                                                        }
                                                                        src={
                                                                            imgData.UserImage ? imgData.UserImage : ""
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                            <div className="alignCenter">
                                                                <span
                                                                    onClick={() => openReplaceImagePopup(index)}
                                                                    title="Replace Image"
                                                                >
                                                                    <TbReplace />{" "}
                                                                </span>
                                                                <span
                                                                    className="mx-1"
                                                                    title="Delete"
                                                                    onClick={() =>
                                                                        RemoveImageFunction(
                                                                            index,
                                                                            imgData.ImageName,
                                                                            "Remove"
                                                                        )
                                                                    }
                                                                >
                                                                    {" "}
                                                                    | <RiDeleteBin6Line /> |{" "}
                                                                </span>
                                                                <span
                                                                    title={
                                                                        imgData.Description != undefined &&
                                                                            imgData.Description?.length > 1
                                                                            ? imgData.Description
                                                                            : "Add Image Description"
                                                                    }
                                                                    className="img-info"
                                                                    onClick={() =>
                                                                        openAddImageDescriptionFunction(
                                                                            index,
                                                                            imgData,
                                                                            "Image"
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="svg__iconbox svg__icon--info"></span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button
                                            className="carousel-control-prev h-75"
                                            type="button"
                                            data-bs-target="#carouselExampleControls"
                                            data-bs-slide="prev"
                                            data-bs-interval="false"
                                        >
                                            <span
                                                className="carousel-control-prev-icon"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button
                                            className="carousel-control-next h-75"
                                            type="button"
                                            data-bs-target="#carouselExampleControls"
                                            data-bs-slide="next"
                                            data-bs-interval="false"
                                        >
                                            <span
                                                className="carousel-control-next-icon"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        {/* <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Upload Image</h6> */}
                                        {UploadBtnStatus == false ? (
                                            <h6
                                                className="siteColor"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setUploadBtnStatus(true)}
                                            >
                                                Add New Image
                                            </h6>
                                        ) : null}
                                    </div>
                                    <div>
                                        {UploadBtnStatus ? (
                                            <div>
                                                <FlorarImageUploadComponent
                                                    callBack={FroalaImageUploadComponentCallBack}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div
                                    className="comment-section col-sm-6 p-2"
                                    style={{
                                        border: "2px solid #ccc",
                                    }}
                                >
                                    <div>
                                        {EditData.Id != null ? (
                                            <>
                                                <CommentBoxComponent
                                                    data={
                                                        EditData?.FeedBackBackup?.length > 0
                                                            ? EditData?.FeedBackBackup[0]
                                                                ?.FeedBackDescriptions
                                                            : []
                                                    }
                                                    callBack={CommentSectionCallBack}
                                                    allUsers={taskUsers}
                                                    ApprovalStatus={ApprovalStatus}
                                                    SmartLightStatus={SmartLightStatus}
                                                    SmartLightPercentStatus={false}
                                                    Context={Context}
                                                    FeedbackCount={FeedBackCount}
                                                />
                                                <Example
                                                    textItems={
                                                        EditData?.FeedBackBackup?.length > 0
                                                            ? EditData?.FeedBackBackup[0]
                                                                ?.FeedBackDescriptions
                                                            : []
                                                    }
                                                    callBack={SubCommentSectionCallBack}
                                                    allUsers={taskUsers}
                                                    ItemId={EditData.Id}
                                                    SiteUrl={EditData.ComponentLink}
                                                    ApprovalStatus={ApprovalStatus}
                                                    SmartLightStatus={SmartLightStatus}
                                                    SmartLightPercentStatus={false}
                                                    Context={Context}
                                                    FeedbackCount={FeedBackCount}
                                                    TaskUpdatedData={MakeUpdateDataJSON}
                                                    TaskListDetails={{
                                                        SiteURL: siteUrls,
                                                        ListId: Items.Items.listId,
                                                        TaskId: Items.Items.Id,
                                                        TaskDetails: EditData,
                                                        AllListIdData: AllListIdData,
                                                        Context: Context,
                                                        siteType: Items.Items.siteType,
                                                    }}
                                                    taskCreatedCallback={UpdateTaskInfoFunction}
                                                />
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane "
                            id="IMAGETIMESHEET"
                            role="tabpanel"
                            aria-labelledby="IMAGETIMESHEET"
                        >
                            <div>
                                <NewTameSheetComponent
                                    props={Items}
                                    AllListId={AllListIdData}
                                    TeamConfigDataCallBack={getTeamConfigData}
                                />
                            </div>
                        </div>
                        {IsUserFromHHHHTeam ? null : (
                            <div
                                className="tab-pane "
                                id="IMAGEBACKGROUNDCOMMENT"
                                role="tabpanel"
                                aria-labelledby="IMAGEssBACKGROUNDCOMMENT"
                            >
                                {EditData.Id != null || EditData.Id != undefined ? (
                                    <BackgroundCommentComponent
                                        CurrentUser={currentUserData}
                                        TaskData={EditData}
                                        Context={Context}
                                        siteUrls={siteUrls}
                                    />
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </Panel>

            {/* ********************** this in hover image modal ****************** */}
            <div
                className="hoverImageModal"
                style={{ display: hoverImageModal }}
            >
                <div className="hoverImageModal-popup">
                    <div className="hoverImageModal-container">
                        <span style={{ color: "white" }}>
                            {HoverImageData[0]?.ImageName}
                        </span>
                        <img
                            className="img-fluid"
                            style={{ width: "100%", height: "450px" }}
                            src={HoverImageData[0]?.ImageUrl}
                        ></img>
                    </div>
                    {HoverImageData[0]?.Description != undefined &&
                        HoverImageData[0]?.Description.length > 0 ? (
                        <div className="bg-Ff mx-2 p-2 text-start">
                            <span>
                                {HoverImageData[0]?.Description
                                    ? HoverImageData[0]?.Description
                                    : ""}
                            </span>
                        </div>
                    ) : null}
                    <footer
                        className="justify-content-between d-flex py-2 mx-2"
                        style={{ color: "white" }}
                    >
                        <span className="mx-1">
                            {" "}
                            Uploaded By :
                            <span className="mx-1">
                                <img
                                    style={{ width: "25px", borderRadius: "25px" }}
                                    src={
                                        HoverImageData[0]?.UserImage
                                            ? HoverImageData[0]?.UserImage
                                            : ""
                                    }
                                />
                            </span>
                            {HoverImageData[0]?.UserName ? HoverImageData[0]?.UserName : ""}
                        </span>
                        <span className="fw-semibold">
                            Uploaded Date :{" "}
                            {HoverImageData[0]?.UploadeDate
                                ? HoverImageData[0]?.UploadeDate
                                : ""}
                        </span>
                    </footer>
                </div>
            </div>

            {/* ********************** This in Add Image Description, Bottleneck and Attention Model ****************** */}
            <Panel
                isOpen={AddImageDescriptions}
                onRenderHeader={onRenderCustomHeaderAddImageDescription}
                type={PanelType.custom}
                customWidth="600px"
                onDismiss={closeAddImageDescriptionFunction}
                isBlocking={false}
            >
                <div>
                    <div className="modal-body">
                        <div className="col">
                            <textarea
                                id="txtUpdateComment"
                                rows={6}
                                value={
                                    AddImageDescriptionsDetails != undefined
                                        ? AddImageDescriptionsDetails
                                        : ""
                                }
                                className="full-width"
                                onChange={(e) => UpdateImageDescription(e, AddDescriptionModelName)}
                            ></textarea>
                        </div>
                    </div>
                    <footer className="text-end mt-2">
                        <button
                            className="btn btnPrimary mx-1 "
                            onClick={() => SaveImageDescription(AddDescriptionModelName)}
                        >
                            Save
                        </button>
                        <button
                            className="btn btn-default"
                            onClick={closeAddImageDescriptionFunction}
                        >
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>

            {/* ********************* this is Copy Task And Move Task panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderCopyAndMoveTaskPanel}
                isOpen={CopyAndMoveTaskPopup}
                type={PanelType.custom}
                customWidth="700px"
                onDismiss={closeCopyAndMovePopup}
                isBlocking={true}
            >
                <div className="modal-body">
                    <div>
                        <div className="col-md-12 p-3 select-sites-section">
                            <div className="card rounded-0 mb-10">
                                <div className="card-header">
                                    <h6>Sites</h6>
                                </div>
                                <div className="card-body">
                                    {!loaded ? <PageLoader /> : ''}
                                    <ul className="quick-actions">
                                        {SiteTypes?.map((siteData: any, index: number) => {
                                            if (siteData.Title !== "QA") {
                                                return (
                                                    <li
                                                        key={siteData.Id}
                                                        className={`mx-1 p-2 position-relative  text-center  mb-2 ${siteData.isSelected
                                                            ? "selectedSite"
                                                            : "bg-siteColor"
                                                            }`}
                                                    >
                                                        <a
                                                            className="text-white text-decoration-none"
                                                            onClick={() => selectSiteTypeFunction(siteData)}
                                                            style={{ fontSize: "12px" }}
                                                        >
                                                            <span className="icon-sites">
                                                                <img
                                                                    className="icon-sites"
                                                                    src={
                                                                        siteData.Item_x005F_x0020_Cover
                                                                            ? siteData.Item_x005F_x0020_Cover.Url
                                                                            : ""
                                                                    }
                                                                />
                                                            </span>{" "}
                                                            {siteData.Title}
                                                        </a>
                                                    </li>
                                                );
                                            }
                                        })}
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <button
                                        className="btn btn-primary px-3 float-end"
                                        onClick={() => copyAndMoveTaskFunction(IsCopyOrMovePanel)}
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
                isBlocking={true}
                type={PanelType.custom}
                customWidth="500px"
            >
                <div>
                    <div className="modal-body">
                        <FlorarImageUploadComponent
                            callBack={FroalaImageReplaceComponentCallBack}
                        />
                    </div>
                    <footer className="float-end mt-1">
                        <button
                            type="button"
                            className="btn btn-primary px-3 mx-1"
                            onClick={UpdateImage}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="btn btn-default px-3"
                            onClick={closeReplaceImagePopup}
                        >
                            Cancel
                        </button>
                    </footer>
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
                <div>
                    <div className="modal-body">
                        <div className="col-sm-12 categScroll" style={{ height: "auto" }}>
                            <input
                                className="form-control my-2"
                                type="text"
                                placeholder="Search Name Here!"
                                value={ApproverSearchKey}
                                onChange={(e) => autoSuggestionsForApprover(e, "OnPanel")}
                            />
                            {ApproverSearchedDataForPopup?.length > 0 ? (
                                <div className="SearchTableCategoryComponent">
                                    <ul className="list-group">
                                        {ApproverSearchedDataForPopup.map((item: any) => {
                                            return (
                                                <li
                                                    className="hreflink list-group-item rounded-0 list-group-item-action"
                                                    key={item.id}
                                                    onClick={() => SelectApproverFromAutoSuggestion(item, "Approver")}
                                                >
                                                    <a>{item.NewLabel}</a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : null}
                            {ApproverData?.length > 0 ? (
                                <div className="ps-0 full-width my-1 p-1">
                                    {ApproverData?.map((val: any) => {
                                        return (
                                            <a className="hreflink block me-1">
                                                {" "}
                                                {val.Title}
                                                <span
                                                    onClick={() => removeAssignedMember(val)}
                                                    className="bg-light hreflink ms-1 svg__icon--cross svg__iconbox"
                                                ></span>
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : null}

                            <ul className="categories-menu p-0">
                                {AllEmployeeData.map(function (item: any) {
                                    return (
                                        <>
                                            <li>
                                                <p className="mb-0 hreflink">
                                                    <a>{item.Title}</a>
                                                </p>
                                                <ul className="sub-menu clr mar0">
                                                    {item.Child?.map(function (child1: any) {
                                                        return (
                                                            <>
                                                                {child1.Title != null ? (
                                                                    <li>
                                                                        <p
                                                                            onClick={() =>
                                                                                selectApproverFunction(child1)
                                                                            }
                                                                            className="mb-0 hreflink"
                                                                        >
                                                                            <a>
                                                                                {child1.Item_x0020_Cover ? (
                                                                                    <img
                                                                                        className="flag_icon"
                                                                                        style={{
                                                                                            height: "20px",
                                                                                            borderRadius: "10px",
                                                                                            border: "1px solid #000069",
                                                                                        }}
                                                                                        src={
                                                                                            child1.Item_x0020_Cover
                                                                                                ? child1.Item_x0020_Cover.Url
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                ) : null}
                                                                                {child1.Title}
                                                                            </a>
                                                                        </p>
                                                                    </li>
                                                                ) : null}
                                                            </>
                                                        );
                                                    })}
                                                </ul>
                                            </li>
                                        </>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <footer className="bg-f4 fixed-bottom position-absolute">
                        <div className="d-flex ml-auto pull-right px-4 py-2">
                            <button
                                type="button"
                                className="btn btn-primary px-3 mx-1"
                                onClick={UpdateApproverFunction}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-default px-3"
                                onClick={closeApproverPopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </footer>
                </div>
            </Panel>
        </div>
    );
};
export default React.memo(EditTaskPopup);

// How to use this component and require parameters

// step-1 : import this component where you need to use
// step-2 : call this component and pass some parameters follow step:2A and step:2B

// step-2A :
// let Items = {
// siteUrl:{Enter Site url here},
// siteType: {Enter Site type here},
// listId:{Enter Site listId here},
// siteIcon:{Enter Site siteIcon here}
// ***** OR *****
// listName:{Enter Site listName here},
// Context:{Context}
// AllListIdData: { AllListIdData with site url,  }
// context:{Page Context}
// }

// step-2B :
// <EditTaskPopup Items={Items} ></EditTaskPopup>