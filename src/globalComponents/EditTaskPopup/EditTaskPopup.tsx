
import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import * as $ from "jquery";
import * as Moment from "moment";
import { Web, sp } from "sp-pnp-js";
import Picker from "./SmartMetaDataPicker";
import Example from "./FroalaCommnetBoxes";
import * as globalCommon from "../globalCommon";
import ImageUploading, { ImageListType } from "react-images-uploading";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import ServiceComponentPortfolioPopup from "./ServiceComponentPortfolioPopup";
import "bootstrap/js/dist/tab.js";
import "bootstrap/js/dist/carousel.js";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import {
    Panel,
    PanelType
} from "office-ui-fabric-react";
import { LuBellPlus } from "react-icons/lu";
import { FaExpandAlt } from "react-icons/fa";
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { SlArrowDown, SlArrowRight, SlUserUnfollow } from "react-icons/sl";
import { TbReplace } from "react-icons/tb";
import NewTameSheetComponent from "./NewTimeSheet";
import CommentBoxComponent from "./CommentBoxComponent";
import TimeEntryPopup from "./TimeEntryComponent";
import VersionHistory from "../VersionHistroy/VersionHistory";
import Tooltip from "../Tooltip";
import FlorarImageUploadComponent from "../FlorarComponents/FlorarImageUploadComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import PageLoader from "../pageLoader";
import EmailComponent from "../EmailComponents";
import SmartTotalTime from "./SmartTimeTotal";
import "react-datepicker/dist/react-datepicker.css";
import BackgroundCommentComponent from "./BackgroundCommentComponent";
import EmailNotificationMail from "./EmailNotificationMail";
import OnHoldCommentCard from '../Comments/OnHoldCommentCard';
import CentralizedSiteComposition from "../SiteCompositionComponents/CentralizedSiteComposition";
import * as GlobalFunctionForUpdateItems from '../GlobalFunctionForUpdateItems';
import SmartPriorityHover from "./SmartPriorityHover";
let PortfolioItemColor: any = "";
var AllMetaData: any = [];
var taskUsers: any = [];
var AllTaskUser: any = [];
var IsShowFullViewImage = false;
var CommentBoxData: any = [];
var SubCommentBoxData: any = [];
var timesheetData: any = [];
var updateFeedbackArray: any = [];
let BackupTaskCategoriesData: any = [];
var tempCategoryData: any = "";
var SiteTypeBackupArray: any = [];
var currentUserBackupArray: any = [];
let AutoCompleteItemsArray: any = [];
let ValueStatus: any = "";
let SelectedSite: any = "";
var FeedBackBackupArray: any = [];
var SiteId = "";
var ChangeTaskUserStatus: any = true;
var TimeSheetlistId = "";
let siteConfig: any = [];
let siteConfigs: any = [];
var TimeSheets: any = [];

var MigrationListId = "";
var newGeneratedId: any = "";
var siteUrl = "";
var listName = "";
var isApprovalByStatus = false;
let ApprovalStatusGlobal: any = false;
let SiteCompositionPrecentageValue: any = 0;

// var TaskCreatorApproverBackupArray: any = [];
var ReplaceImageIndex: any;
var ReplaceImageData: any;
var AllProjectBackupArray: any = [];
var EditDataBackup: any;
var AllClientCategoryDataBackup: any = [];
var selectedClientCategoryData: any = [];
var GlobalServiceAndComponentData: any = [];
var AddImageDescriptionsIndex: any;
var LinkedPortfolioDataBackup: any = [];
var userSendAttentionEmails: any = [];
var TempSmartInformationIds: any = [];
let StatusOptionsBackupArray: any = [];
var TaskCreatorApproverBackupArray: any = [];
var AllSitesData: any = [];
var TaskApproverBackupArray: any = [];
let categoryTitle: any = "";
let onHoldCategory: any = [];
let globalSelectedProject: any = { PriorityRank: 1 };
const EditTaskPopup = (Items: any) => {
    const Context = Items?.context;
    const AllListIdData = Items?.AllListId;
    AllListIdData.listId = Items?.Items?.listId;
    // Items.Items.Id = Items?.Items?.ID;
    Items.Items.Id =
        Items.Items.Id != undefined ? Items.Items.Id : Items.Items.ID;
    let SiteWebConfigData: any = [];
    const [TaskImages, setTaskImages] = useState([]);
    const [SmartMetaDataAllItems, setSmartMetaDataAllItems] = useState<any>([]);
    const [IsComponentPicker, setIsComponentPicker] = useState(false);
    const [openTeamPortfolioPopup, setOpenTeamPortfolioPopup] = useState(false);
    const [openLinkedPortfolioPopup, setopenLinkedPortfolioPopup] =
        useState(false);
    const [TaggedPortfolioData, setTaggedPortfolioData] = useState([]);
    const [linkedPortfolioData, setLinkedPortfolioData] = useState([]);
    const [CategoriesData, setCategoriesData] = useState("");
    const [TaskCategoriesData, setTaskCategoriesData] = useState([]);
    const [BasicImageData, setBasicImageData] = useState([]);
    const [AllCategoryData, setAllCategoryData] = useState([]);
    const [SearchedCategoryData, setSearchedCategoryData] = useState([]);
    let [TaskAssignedTo, setTaskAssignedTo] = useState([]);
    let [TaskTeamMembers, setTaskTeamMembers] = useState([]);
    const [sendEmailNotification, setSendEmailNotification] = useState(false);
    let [TaskResponsibleTeam, setTaskResponsibleTeam] = useState([]);
    const [UpdateTaskInfo, setUpdateTaskInfo] = useState({
        Title: "",
        PercentCompleteStatus: "",
        ComponentLink: "",
    });
    const [EditData, setEditData] = useState<any>({});
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [SmartMedaDataUsedPanel, setSmartMedaDataUsedPanel] = useState("");
    const [TimeSheetPopup, setTimeSheetPopup] = useState(false);
    const [hoverImageModal, setHoverImageModal] = useState("None");
    const [AddImageDescriptions, setAddImageDescriptions] = useState(false);
    const [AddImageDescriptionsDetails, setAddImageDescriptionsDetails] =
        useState<any>("");
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
    const [PriorityStatus, setPriorityStatus] = useState();
    const [PhoneStatus, setPhoneStatus] = useState(false);
    const [EmailStatus, setEmailStatus] = useState(false);
    const [DesignStatus, setDesignStatus] = useState(false);
    const [OnlyCompletedStatus, setOnlyCompletedStatus] = useState(false);
    const [ImmediateStatus, setImmediateStatus] = useState(false);
    const [onHoldPanel, setOnHoldPanel] = useState(false);
    const [ApprovalStatus, setApprovalStatus] = useState(false);
    let [ApproverData, setApproverData] = useState([]);
    let [CheckApproverData, setCheckApproverData] = useState([]);
    const [SmartLightStatus, setSmartLightStatus] = useState(false);
    const [SmartLightPercentStatus, setSmartLightPercentStatus] = useState(false);
    const [ShowTaskDetailsStatus, setShowTaskDetailsStatus] = useState(false);
    const [currentUserData, setCurrentUserData] = useState([]);
    const [UploadBtnStatus, setUploadBtnStatus] = useState(false);
    const [InputFieldDisable, setInputFieldDisable] = useState(false);
    const [HoverImageData, setHoverImageData] = useState([]);
    const [SiteTypes, setSiteTypes] = useState([]);
    const [categorySearchKey, setCategorySearchKey] = useState("");
    const [ServicesTaskCheck, setServicesTaskCheck] = useState(false);
    const [EventTaskCheck, setEventTaskCheck] = useState(false);
    const [ComponentTaskCheck, setComponentTaskCheck] = useState(false);
    const [AllProjectData, SetAllProjectData] = useState([]);
    const [selectedProject, setSelectedProject] = useState([]);
    const [SearchedProjectData, setSearchedProjectData] = useState([]);
    const [ProjectSearchKey, setProjectSearchKey] = useState("");
    const [ApproverPopupStatus, setApproverPopupStatus] = useState(false);
    const [ApproverSearchKey, setApproverSearchKey] = useState("");
    const [BottleneckSearchKey, setBottleneckSearchKey] = useState("");
    const [AttentionSearchKey, setAttentionSearchKey] = useState("");
    const [ApproverSearchedData, setApproverSearchedData] = useState([]);
    const [BottleneckSearchedData, setBottleneckSearchedData] = useState([]);
    const [AttentionSearchedData, setAttentionSearchedData] = useState([]);
    const [ApproverSearchedDataForPopup, setApproverSearchedDataForPopup] =
        useState([]);
    const [sendEmailStatus, setSendEmailStatus] = useState(false);
    const [sendEmailComponentStatus, setSendEmailComponentStatus] =
        useState(false);
    const [sendEmailGlobalCount, setSendEmailGlobalCount] = useState(0);
    const [AllEmployeeData, setAllEmployeeData] = useState([]);
    const [ApprovalTaskStatus, setApprovalTaskStatus] = useState(false);
    const [SmartTotalTimeData, setSmartTotalTimeData] = useState(0);
    const [ClientTimeData, setClientTimeData] = useState([]);
    const [selectedClientCategory, setSelectedClientCategory] = useState([]);
    const [SiteCompositionSetting, setSiteCompositionSetting] = useState([]);
    const [AllClientCategoryData, setAllClientCategoryData] = useState([]);
    const [ApproverHistoryData, setApproverHistoryData] = useState([]);
    const [LastUpdateTaskData, setLastUpdateTaskData] = useState<any>({});
    const [SitesTaggingData, setSitesTaggingData] = useState<any>([]);
    const [SearchedServiceCompnentData, setSearchedServiceCompnentData] =
        useState<any>([]);
    const [SearchedLinkedPortfolioData, setSearchedLinkedPortfolioData] =
        useState<any>([]);
    const [SearchedServiceCompnentKey, setSearchedServiceCompnentKey] =
        useState<any>("");
    const [SearchedLinkedPortfolioKey, setSearchedLinkedPortfolioKey] =
        useState<any>("");
    const [IsUserFromHHHHTeam, setIsUserFromHHHHTeam] = useState(false);
    const [IsCopyOrMovePanel, setIsCopyOrMovePanel] = useState<any>("");
    const [EstimatedDescription, setEstimatedDescription] = useState("");
    const [EstimatedDescriptionCategory, setEstimatedDescriptionCategory] =
        useState("");
    const [EstimatedTime, setEstimatedTime] = useState<any>("");
    const [TotalEstimatedTime, setTotalEstimatedTime] = useState(0);
    const [SiteCompositionShow, setSiteCompositionShow] = useState(false);
    const [IsSendAttentionMsgStatus, setIsSendAttentionMsgStatus] =
        useState(false);
    const [IsTaskStatusUpdated, setIsTaskStatusUpdated] = useState(false);
    const [SendCategoryName, setSendCategoryName] = useState("");
    const [TeamMemberChanged, setTeamMemberChanged] = useState(false);
    const [TeamLeaderChanged, setTeamLeaderChanged] = useState(false);
    const [SendMsgToAuthor, setSendMsgToAuthor] = useState(false);
    const [SendDesignEmailStatus, setSendDesignEmailStatus] = useState(false);
    const [CurrentImageIndex, setCurrentImageIndex] = useState("");
    const [loaded, setLoaded] = useState(true);
    const [IsImageUploaded, setIsImageUploaded] = useState(true);
    const [WorkingAction, setWorkingAction] = useState([]);
    const [AddDescriptionModelName, setAddDescriptionModelName] = useState("");
    const [useFor, setUseFor] = useState("")
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

    const [counter, setCounter] = useState(1);


    const handlePostComment = () => {
        setCounter(counter + 1);
    };

    let FeedBackCount: any = 0;
    // const StatusArray = [
    //     { value: 0, status: "0% Not Started", taskStatusComment: "Not Started" },
    //     { value: 1, status: "1% For Approval", taskStatusComment: "For Approval" },
    //     { value: 2, status: "2% Follow Up", taskStatusComment: "Follow Up" },
    //     { value: 3, status: "3% Approved", taskStatusComment: "Approved" },
    //     { value: 5, status: "5% Acknowledged", taskStatusComment: "Acknowledged" },
    //     { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
    //     { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
    //     { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
    //     { value: 90, status: "90% Task completed", taskStatusComment: "Task completed" },
    //     { value: 93, status: "93% For Review", taskStatusComment: "For Review" },
    //     { value: 96, status: "96% Follow-up later", taskStatusComment: "Follow-up later" },
    //     { value: 99, status: "99% Completed", taskStatusComment: "Completed" },
    //     { value: 100, status: "100% Closed", taskStatusComment: "Closed" }
    // ]


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

    //  ************** This is used for handeling Site Url for Diffrent Cases ********************

    var siteUrls: any;
    if (
        Items != undefined &&
        Items.Items.siteUrl != undefined &&
        Items.Items.siteUrl.length < 20
    ) {
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
    const loadTime = async () => {
        var SiteId = "Task" + Items.Items.siteType;
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
                timesheetData.push(item);
            }
        });
    };
    useEffect(() => {
        if (FeedBackCount == 0) {
            loadTaskUsers();
            GetExtraLookupColumnData();
            SmartMetaDataListInformations();
            GetAllComponentAndServiceData("Component");
            AddImageDescriptionsIndex = undefined;
            if (Items.Items.siteType == "Offshore Tasks") {
                Items.Items.siteType = "Offshore%20Tasks";
            }
        }

    }, [FeedBackCount]);



    useEffect(() => {
        setTimeout(() => {
            const panelMain: any = document.querySelector(".ms-Panel-main");
            if (panelMain && PortfolioItemColor != "") {
                $(".ms-Panel-main").css("--SiteBlue", PortfolioItemColor); // Set the desired color value here
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
        SmartMedaDataUsedPanel?.length,
    ]);

    const SmartMetaDataListInformations = async () => {
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
                    } else {
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
                if (
                    site.Title !== undefined &&
                    site.Title !== "Foundation" &&
                    site.Title !== "Master Tasks" &&
                    site.Title !== "DRR" &&
                    site.Title !== "SDC Sites"
                ) {
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
                BuildClieantCategoryAllDataArray(AllClientCategoryData);
            }
            // ########## this is for All Categories related validations ################
            if (AllCategoriesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(
                    AllCategoriesData,
                    "Categories"
                );
                if (CategoriesGroupByData?.length > 0) {
                    CategoriesGroupByData?.map((item: any) => {
                        if (item.newTitle != undefined) {
                            item["Newlabel"] = item.newTitle;
                            AutoCompleteItemsArray.push(item);
                            if (
                                item.childs != null &&
                                item.childs != undefined &&
                                item.childs.length > 0
                            ) {
                                item.childs.map((childitem: any) => {
                                    if (childitem.newTitle != undefined) {
                                        childitem["Newlabel"] =
                                            item["Newlabel"] + " > " + childitem.Title;
                                        AutoCompleteItemsArray.push(childitem);
                                    }
                                    if (childitem.childs.length > 0) {
                                        childitem.childs.map((subchilditem: any) => {
                                            if (subchilditem.newTitle != undefined) {
                                                subchilditem["Newlabel"] =
                                                    childitem["Newlabel"] + " > " + subchilditem.Title;
                                                AutoCompleteItemsArray.push(subchilditem);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if (AutoCompleteItemsArray?.length > 0) {
                    AutoCompleteItemsArray = AutoCompleteItemsArray.reduce(function (
                        previous: any,
                        current: any
                    ) {
                        var alredyExists =
                            previous.filter(function (item: any) {
                                return item.Title === current.Title;
                            }).length > 0;
                        if (!alredyExists) {
                            previous.push(current);
                        }
                        return previous;
                    },
                        []);
                }

                // ############## this is used for filttering time sheet category data from smart medatadata list ##########
                if (AllTimesheetCategoriesData?.length > 0) {
                    AllTimesheetCategoriesData = AllTimesheetCategoriesData.map(
                        (TimeSheetCategory: any) => {
                            if (TimeSheetCategory.ParentId == 303) {
                                TempTimeSheetCategoryArray.push(TimeSheetCategory);
                            }
                        }
                    );
                }
                console.log("Timesheet Category Data ====", TempTimeSheetCategoryArray);
                setAllCategoryData(AutoCompleteItemsArray);
                let AllSmartMetaDataGroupBy: any = {
                    TimeSheetCategory: TempTimeSheetCategoryArray,
                    Categories: AutoCompleteItemsArray,
                    Sites: tempArray,
                    Status: AllStatusData,
                    Priority: AllPriorityData,
                    PriorityRank: AllPriorityRankData,
                    ClientCategory: AllClientCategoryData,
                };
                setSmartMetaDataAllItems(AllSmartMetaDataGroupBy);
            }
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };
    var getSmartMetadataItemsByTaxType = function (
        metadataItems: any,
        taxType: any
    ) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType) Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    };

    const BuildClieantCategoryAllDataArray = (DataItem: any) => {
        let MainParentArray: any = [];
        let FinalArray: any = [];
        if (DataItem != undefined && DataItem.length > 0) {
            DataItem.map((Item: any) => {
                if (Item.ParentID == 0) {
                    Item.Child = [];
                    MainParentArray.push(Item);
                }
            });
        }
        if (MainParentArray?.length > 0) {
            MainParentArray.map((ParentArray: any) => {
                if (DataItem?.length > 0) {
                    DataItem.map((ChildArray: any) => {
                        if (ParentArray.Id == ChildArray.ParentID) {
                            ChildArray.siteName = ParentArray.newTitle;
                            ChildArray.Child = [];
                            ParentArray.Child.push(ChildArray);
                        }
                    });
                }
            });
        }
        if (MainParentArray?.length > 0) {
            MainParentArray.map((ParentArray: any) => {
                if (ParentArray?.Child?.length > 0) {
                    ParentArray?.Child.map((ChildLevelFirst: any) => {
                        if (DataItem?.length > 0) {
                            DataItem.map((ChildArray: any) => {
                                if (ChildLevelFirst.Id == ChildArray.ParentID) {
                                    ChildArray.siteName = ParentArray.newTitle;
                                    ChildArray.Child = [];
                                    ChildLevelFirst.Child.push(ChildArray);
                                }
                            });
                        }
                    });
                }
            });
        }
        if (MainParentArray?.length > 0) {
            MainParentArray.map((ParentArray: any) => {
                if (ParentArray?.Child?.length > 0) {
                    ParentArray?.Child.map((ChildLevelFirst: any) => {
                        if (ChildLevelFirst.Child?.length > 0) {
                            ChildLevelFirst.Child.map((lastChild: any) => {
                                if (DataItem?.length > 0) {
                                    DataItem.map((ChildArray: any) => {
                                        if (lastChild.Id == ChildArray.ParentID) {
                                            ChildArray.siteName = ParentArray.newTitle;
                                            ChildArray.Child = [];
                                            lastChild.Child.push(ChildArray);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        if (MainParentArray?.length > 0) {
            MainParentArray.map((ParentArray: any) => {
                if (ParentArray?.Child?.length > 0) {
                    ParentArray?.Child.map((ChildLevelFirst: any) => {
                        if (ChildLevelFirst.Child?.length > 0) {
                            ChildLevelFirst.Child.map((lastChild: any) => {
                                if (lastChild.Child?.length > 0) {
                                    lastChild.Child?.map((endChild: any) => {
                                        if (DataItem?.length > 0) {
                                            DataItem.map((ChildArray: any) => {
                                                if (endChild.Id == ChildArray.ParentID) {
                                                    ChildArray.siteName = ParentArray.newTitle;
                                                    ChildArray.Child = [];
                                                    endChild.Child.push(ChildArray);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        if (MainParentArray?.length > 0) {
            MainParentArray.map((finalItem: any) => {
                FinalArray.push(finalItem);
                if (finalItem.Child?.length > 0) {
                    finalItem.Child.map((FinalChild: any) => {
                        FinalArray.push(FinalChild);
                        if (FinalChild.Child?.length > 0) {
                            FinalChild.Child.map((LastChild: any) => {
                                FinalArray.push(LastChild);
                                if (LastChild.Child?.length > 0) {
                                    LastChild.Child?.map((endChild: any) => {
                                        FinalArray.push(endChild);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        AllClientCategoryDataBackup = FinalArray;
    };

    //  ######################  This is Smart Category Get Data Call From Backend and Bulid Nested Array According to Parent Child Categories #######################

    var loadSmartTaxonomyPortfolioPopup = (
        AllTaxonomyItems: any,
        SmartTaxonomy: any
    ) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item);
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array?.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    };
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (
                childItem.ParentID != undefined &&
                parseInt(childItem.ParentID) == item.ID
            ) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    };

    // ************************** This is the Fetch All Data for the slected Task and related to Task from Backend *******************************

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
                GetSelectedTaskDetails();
            } else {
                extraLookupColumnData = await web.lists
                    .getByTitle(Items.Items.listName)
                    .items.select(
                        "Project/Id, Project/Title,SmartInformation/Id, AttachmentFiles/Title, Approver/Id, Approver/Title, ClientCategory/Id,ClientCategory/Title, ApproverHistory"
                    )
                    .top(5000)
                    .filter(`Id eq ${Items.Items.Id}`)
                    .expand("Project, Approver, ClientCategory")
                    .get();
                if (extraLookupColumnData.length > 0) {
                    let Data: any;

                    let ApproverData: any;
                    let ApproverHistoryData: any;
                    Data = extraLookupColumnData[0]?.Project;
                    ApproverHistoryData = extraLookupColumnData[0]?.ApproverHistory;
                    ApproverData = extraLookupColumnData[0]?.Approver;

                    if (Data != undefined && Data != null) {
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
                    }
                }
                GetSelectedTaskDetails();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const getLookUpColumnListId = async (
        siteUrl: any,
        ParentListId: any,
        lookupColumnName: any,
        ComponentType: any,
        usedFor: any
    ) => {
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
            console.log("error :", error.message);
        }
    };

    // #################### this is used for getting All Information for selected task from Backend ##############################

    const GetSelectedTaskDetails = async () => {
        var ApprovarDataId = "";
        try {
            let web = new Web(siteUrls);
            let smartMeta: any;
            let extraLookupColumnData: any;
            if (Items.Items.listId != undefined) {
                smartMeta = await web.lists
                    .getById(Items.Items.listId)
                    .items.select(
                        "Id,Title,PriorityRank,Comments,workingThisWeek,WorkingAction,Approvee/Id,Approvee/Title,EstimatedTime,EstimatedTimeDescription,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,Sitestagging,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,ComponentLink,RelevantPortfolio/Title,RelevantPortfolio/Id,Portfolio/Title,Portfolio/Id,Portfolio/PortfolioStructureID,PercentComplete,Categories,TaskLevel,TaskLevel,ClientActivity,ClientActivityJson,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title, ParentTask/TaskID,ParentTask/Id,TaskID"
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
                    setWorkingAction(WorkingActionData);
                }
                if (item.Categories != null) {
                    setCategoriesData(item.Categories);
                }
                if (item.TaskCategories?.length > 0) {
                    setPhoneStatus(item.TaskCategories?.some((category: any) => category.Title === "Phone"));
                    setEmailStatus(item.TaskCategories?.some((category: any) => category.Title === "Email Notification"));
                    setImmediateStatus(item.TaskCategories?.some((category: any) => category.Title === "Immediate"));
                    setOnlyCompletedStatus(item.TaskCategories?.some((category: any) => category.Title === "Only Completed"));
                    setDesignStatus(item.TaskCategories?.some((category: any) => category.Title === "Design"));
                    let checkForApproval: any = item.TaskCategories?.some((category: any) => category.Title === "Approval")
                    if (checkForApproval) {
                        setApprovalStatus(true);
                        ApprovalStatusGlobal = true;
                    } else {
                        setApprovalStatus(false);
                        ApprovalStatusGlobal = false;
                        setApproverData([]);
                    }
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
                    setClientTimeData(tempArray3);
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
                    setClientTimeData([object]);
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
                                            ApprovarDataId = userData?.Approver[0]?.Id;
                                        }
                                    }
                                    catch (error) {
                                        console.log("Error :", error.message);
                                    }
                            });
                            if (
                                itemData.Id == currentUser.AssingedToUserId ||
                                currentUser.AssingedToUserId == ApprovarDataId
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
                                            ApprovarDataId = userData?.Approver[0].Id;
                                        }
                                    }
                                });
                                if (
                                    Approver.Id == current.AssingedToUserId ||
                                    current.AssingedToUserId == ApprovarDataId
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
                    var FeedBackItem: any = {};
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
                setBasicImageData(saveImage);
                EditDataBackup = item;
                setPriorityStatus(item.Priority);
                console.log("Task All Details from backend  ==================", item);
            });
        } catch (error) {
            console.log("Error :", error.message);
        }
    };

    //  ******************************* this is Service And Component Portfolio Popup Related All function and CallBack *******************
    const OpenTeamPortfolioPopupFunction = (item: any, usedFor: any) => {
        if (usedFor == "Portfolio") {
            setOpenTeamPortfolioPopup(true);
        }
        if (usedFor == "Linked-Portfolios") {
            setopenLinkedPortfolioPopup(true);
        }
    };
    const EditComponentPicker = (item: any, usedFor: any) => {
        setIsComponentPicker(true);
    };

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
            TaskUserListId: AllListIdData.TaskUsertListID,
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

    const autoSuggestionsForServiceAndComponent = (e: any, usedFor: any) => {
        let SearchedKeyWord: any = e.target.value;
        let TempArray: any = [];
        if (usedFor == "Portfolio") {
            setSearchedServiceCompnentKey(SearchedKeyWord);
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
                    setSearchedServiceCompnentData(TempArray);
                }
                if (usedFor == "Linked-Portfolios") {
                    setSearchedLinkedPortfolioData(TempArray);
                }
            }
        } else {
            setSearchedServiceCompnentData([]);
            setSearchedLinkedPortfolioData([]);
            setSearchedServiceCompnentKey("");
            setSearchedLinkedPortfolioKey("");
        }
    };

    const setSelectedServiceAndCompnentData = (SelectedData: any, Type: any) => {
        setSearchedServiceCompnentData([]);
        setSearchedLinkedPortfolioData([]);
        setSearchedServiceCompnentKey("");
        setSearchedLinkedPortfolioKey("");
        ComponentServicePopupCallBack([SelectedData], Type, "Save");
    };

    //  ###################  Service And Component Portfolio Popup Call Back Functions and Validations ##################

    const ComponentServicePopupCallBack = useCallback(
        (DataItem: any, Type: any, functionType: any) => {
            if (functionType == "Close") {
                setOpenTeamPortfolioPopup(false);
                setProjectManagementPopup(false)
                setopenLinkedPortfolioPopup(false);
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
                                    setClientTimeData(ClientData);
                                } else {
                                    let TempObject: any = {
                                        Title: Items?.Items?.siteType,
                                        ClienTimeDescription: 100,
                                        localSiteComposition: true,
                                        SiteImages: Items.Items.SiteIcon,
                                    };
                                    setClientTimeData([TempObject]);
                                }
                            }
                        }
                        if (DataItem[0].SiteCompositionSettings) {
                            setSiteCompositionSetting(DataItem[0].SiteCompositionSettings);
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
                    setopenLinkedPortfolioPopup(false);
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

    //  ###################  Smart Category slection Common Functions with Validations ##################


    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        setIsComponentPicker(false);
        let uniqueIds: any = {};
        let checkForOnHoldAndBottleneck: any = BackupTaskCategoriesData?.some((category: any) => category.Title === "On-Hold" && category.Title === "Bottleneck");
        let checkForDesign: any = BackupTaskCategoriesData?.some((category: any) => category.Title === "Design");
        if (usedFor == "For-Panel") {
            let TempArrya: any = [];
            selectCategoryData?.map((selectedData: any) => {
                if ((selectedData.Title == "On-Hold" || selectedData.Title == "Bottleneck") && !checkForOnHoldAndBottleneck) {
                    onHoldCategory.push(selectedData);
                    setOnHoldPanel(true);
                    setSendCategoryName(selectedData.Title)
                } else {
                    TempArrya.push(selectedData);
                }
                if (!checkForDesign && selectedData.Title == "Design") {
                    setSendDesignEmailStatus(true);
                } else {
                    setSendDesignEmailStatus(false);
                }
                if (selectedData?.IsSendAttentionEmail?.Id != undefined) {
                    setIsSendAttentionMsgStatus(true);
                    userSendAttentionEmails.push(selectedData?.IsSendAttentionEmail?.EMail);
                    setSendCategoryName("Attention");
                }
                if (selectedData?.Title == "Bottleneck") {
                    setIsSendAttentionMsgStatus(true);
                    if (EditData?.TaskAssignedUsers?.length > 0) {
                        EditData?.TaskAssignedUsers?.map((AssignedUser: any, Index: any) => {
                            userSendAttentionEmails.push(AssignedUser.Email);
                        });
                    }
                    setSendCategoryName(selectedData?.Title);
                }
            })
            BackupTaskCategoriesData = TempArrya;
        } else {
            selectCategoryData.forEach((existingData: any) => {
                if ((existingData.Title == "On-Hold" || existingData.Title == "Bottleneck") && !checkForOnHoldAndBottleneck) {
                    onHoldCategory.push(existingData);
                    setOnHoldPanel(true);
                    setSendCategoryName(existingData.Title)
                } else {
                    BackupTaskCategoriesData.push(existingData);
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
        setPhoneStatus(result?.some((category: any) => category.Title === "Phone"));
        setEmailStatus(result?.some((category: any) => category.Title === "Email Notification"));
        setImmediateStatus(result?.some((category: any) => category.Title === "Immediate"));
        setOnlyCompletedStatus(result?.some((category: any) => category.Title === "Only Completed"));
        let checkForApproval: any = result?.some((category: any) => category.Title === "Approval")
        if (checkForApproval) {
            setApprovalStatus(true);
            setApproverData(TaskApproverBackupArray);
        } else {
            setApprovalStatus(false);
            setApproverData([]);
        }
        if (usedFor === "For-Panel" || usedFor === "For-Auto-Search") {
            setTaskCategoriesData(result);
            if (usedFor === "For-Auto-Search") {
                setSearchedCategoryData([]);
                setCategorySearchKey("");
            }
        }
    };


    const smartCategoryPopup = useCallback(() => {
        setIsComponentPicker(false);
    }, []);

    const editTaskPopupCallBack = useCallback((usedFor: any) => {
        setOnHoldPanel(false);
        if (usedFor == "Save") {
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
        }
        onHoldCategory = [];
    }, []);

    //  ###################  Smart Category Auto Suggesution Functions  ##################

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

    const removeCategoryItem = (TypeCategory: any, TypeId: any) => {
        let tempString: any;
        let tempArray2: any = [];
        BackupTaskCategoriesData = [];
        TaskCategoriesData?.map((dataType: any) => {
            if (dataType.Id != TypeId) {
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
        setCategoriesData(tempString);
        tempCategoryData = tempString;
        setTaskCategoriesData(tempArray2);
    };
    const CategoryChange = (e: any, typeValue: any, IdValue: any) => {
        isApprovalByStatus = false;
        if (e == "false") {
            var statusValue: any = e;
            isApprovalByStatus = true;
        } else {
            var statusValue: any = e.target.value;
        }
        let type: any = typeValue;
        let Id: any = IdValue;
        CategoryChangeUpdateFunction(statusValue, type, Id);
    };

    const CategoryChangeUpdateFunction = (Status: any, type: any, Id: any) => {
        if (Status == "true") {
            removeCategoryItem(type, Id);
            if (type == "Phone") {
                setPhoneStatus(false);
            }
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
            // if (tempCategoryData != undefined) {
            if (tempCategoryData == undefined) {
                tempCategoryData = "";
            }
            var CheckTaggedCategory = tempCategoryData?.includes(type);
            if (CheckTaggedCategory == false) {
                let CheckTaagedCategory: any = true;
                let category: any = tempCategoryData + ";" + type;
                setCategoriesData(category);
                tempCategoryData = category;
                if (
                    BackupTaskCategoriesData != undefined &&
                    BackupTaskCategoriesData.length > 0
                ) {
                    BackupTaskCategoriesData.map((tempItem: any) => {
                        if (tempItem.Title == type) {
                            CheckTaagedCategory = false;
                        }
                    });
                }
                if (
                    AutoCompleteItemsArray != undefined &&
                    AutoCompleteItemsArray.length > 0
                ) {
                    AutoCompleteItemsArray.map((dataItem: any) => {
                        if (dataItem.Title == type) {
                            if (CheckTaagedCategory) {
                                TaskCategoriesData.push(dataItem);
                                BackupTaskCategoriesData.push(dataItem);

                            }
                        }
                    });
                }
                // setSearchedCategoryData(BackupTaskCategoriesData);
                if (type == "Phone") {
                    setPhoneStatus(true);
                }
                if (type == "Email Notification") {
                    setEmailStatus(true);
                }
                if (type == "Immediate") {
                    setImmediateStatus(true);
                }
                if (type == "Approval") {
                    isApprovalByStatus = true;

                    var tempArray: any = [];
                    if (currentUserData != undefined && currentUserData.length > 0) {
                        currentUserData.map((dataItem: any) => {
                            dataItem?.Approver.map((items: any) => {
                                tempArray.push(items);
                            });
                        });
                    }
                    // else if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
                    //     TaskCreatorApproverBackupArray.map((dataItem: any) => {
                    //         tempArray.push(dataItem);
                    //     })
                    // }
                    const finalData = tempArray.filter(
                        (val: any, id: any, array: any) => {
                            return array?.indexOf(val) == id;
                        }
                    );

                    EditData.TaskApprovers = finalData;
                    EditData.CurrentUserData = currentUserData;
                    setApproverData(finalData);
                    setCheckApproverData(finalData);
                    setApprovalStatus(true);
                    // setApprovalTaskStatus(true)
                    // if(isApprovalByStatus == false){
                    //     setApproverData(TaskApproverBackupArray);
                    // }

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
            // }
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

    // **************************  This is for Loading All Task Users From Back End Call Functions And validations ****************************
    var count = 0;
    const loadTaskUsers = async () => {
        var AllTaskUsers: any = [];
        let currentUserId = Context.pageContext._legacyPageContext.userId;
        const web = new Web(siteUrls);
        taskUsers = await web.lists
            .getById(AllListIdData?.TaskUsertListID)
            .items.select(
                "Id,UserGroupId,TimeCategory,CategoriesItemsJson,IsActive,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name"
            )
            .filter("IsActive eq 1")
            .expand("AssingedToUser,Approver")
            .orderBy("SortOrder", true)
            .orderBy("Title", true)
            .getAll();
        getAllEmployeeData();
        taskUsers?.map((user: any, index: any) => {
            var ApproverUserItem = "";
            var UserApproverMail: any = [];
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
                if (user.UserGroupId == 7) {
                    setIsUserFromHHHHTeam(true);
                }
            }
        });
        if (AllMetaData != undefined && AllMetaData?.length > 0) {
            GetSelectedTaskDetails();
        }
    };

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
    // ************************** this is used for getting Site Composition For Selected Portfolio which in Taaged into Task ***********************
    const GetPortfolioSiteComposition = async (ProtfolioId: any, item: any) => {
        const web = new Web(siteUrls);
        let DataFromCall: any[] = [];
        try {
            DataFromCall = await Promise.all([
                web.lists
                    .getById(AllListIdData?.MasterTaskListID)
                    .items.filter(`Id eq ${ProtfolioId}`)
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
                                if (res[0].PortfolioType?.Title === "Component") {
                                    setComponentTaskCheck(true);
                                }
                                if (res[0].PortfolioType?.Title === "Service") {
                                    setServicesTaskCheck(true);
                                }
                                if (res[0].PortfolioType?.Title === "Event") {
                                    setEventTaskCheck(true);
                                }
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
                                        setSitesTaggingData(TempSiteCompositionArray);
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

    //  ################# this is used for getting Portfolio type informations #################

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
                                        StatusOptionsBackupArray = StatusOptionString;
                                        if (usedFor == "Initial-Phase" && FeedBackCount == 0) {
                                            GetSelectedTaskDetails();
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
    //   ###################### This is used for Status Auto Suggesution Function #########################

    const StatusAutoSuggestion = (e: any) => {
        let StatusInput = e.target.value;
        let value = Number(e.target.value);
        if (value <= 100) {
            if (StatusInput.length > 0) {
                setIsTaskStatusUpdated(true);
                if (StatusInput == 0) {
                    setTaskStatus("Not Started");
                    setPercentCompleteStatus("0% Not Started");
                    setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: "0" });
                }
                if (
                    (StatusInput < 70 && StatusInput > 10) ||
                    (StatusInput < 80 && StatusInput > 70)
                ) {
                    setTaskStatus("In Progress");
                    setPercentCompleteStatus(
                        `${Number(StatusInput).toFixed(0)}% In Progress`
                    );
                    setUpdateTaskInfo({
                        ...UpdateTaskInfo,
                        PercentCompleteStatus: StatusInput,
                    });
                    EditData.IsTodaysTask = false;
                } else {
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
                }
                if (StatusInput == 80) {
                    if (
                        EditData.TeamMembers != undefined &&
                        EditData.TeamMembers?.length > 0
                    ) {
                        setWorkingMemberFromTeam(EditData.TeamMembers, "QA", 143);
                    } else {
                        setWorkingMember(143);
                    }
                    EditData.IsTodaysTask = false;
                    EditData.workingThisWeek = false;
                    EditData.CompletedDate = undefined;
                    StatusOptions?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                }
                if (StatusInput == 70) {
                    if (
                        EditData.TeamMembers != undefined &&
                        EditData.TeamMembers?.length > 0
                    ) {
                        setWorkingMemberFromTeam(EditData.TeamMembers, "Development", 0);
                    } else if (EditData.ResponsibleTeam?.length > 0) {
                        setWorkingMemberFromTeam(EditData.ResponsibleTeam, "Development", 0);
                    }
                    StatusOptions?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                }
                if (StatusInput == 5) {
                    EditData.CompletedDate = undefined;
                    EditData.IsTodaysTask = false;
                    StatusOptions?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                }
                if (StatusInput == 8) {
                    let CheckForTaskCategories: any = EditDataBackup.TaskCategories?.some((category: any) => category.Title === "Development" || category.Title === "Improvement")
                    if (CheckForTaskCategories) {
                        let AuthorId: any = EditDataBackup?.Author?.Id;
                        setWorkingMember(AuthorId);
                        setSendMsgToAuthor(true);
                    }
                }
                if (StatusInput == 10) {
                    EditData.CompletedDate = undefined;
                    if (EditData.StartDate == undefined) {
                        EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY");
                    }
                    EditData.IsTodaysTask = true;
                    StatusOptions?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                }
                if (StatusInput == 93 || StatusInput == 96 || StatusInput == 99) {
                    setWorkingMember(32);
                    EditData.IsTodaysTask = false;
                    EditData.workingThisWeek = false;
                    StatusOptions?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                }
                if (StatusInput == 90) {
                    EditData.IsTodaysTask = false;
                    EditData.workingThisWeek = false;
                    if (EditData.siteType == "Offshore%20Tasks") {
                        setWorkingMember(36);
                    } else if (DesignStatus) {
                        setWorkingMember(301);
                    } else {
                        setWorkingMember(42);
                    }

                    EditData.CompletedDate = Moment(new Date()).format("MM-DD-YYYY");
                    StatusOptions?.map((item: any) => {
                        if (StatusInput == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    });
                }
                if (StatusInput == 2) {
                    setInputFieldDisable(true);
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
                }
                if (StatusInput != 2) {
                    setInputFieldDisable(false);
                }
                if (StatusInput <= 2 && ApprovalStatusGlobal) {
                    ChangeTaskUserStatus = false;
                } else {
                    ChangeTaskUserStatus = true;
                }
            } else {
                setTaskStatus("");
                setPercentCompleteStatus("");
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: "0" });
            }
        } else {
            alert("Status not should be greater than 100");
            setEditData({ ...EditData, PriorityRank: 0 });
        }
    };

    //   ######################  This is used for Status Popup Chnage Status #########################
    const SmartMetaDataPanelSelectDataFunction = (
        StatusData: any,
        usedFor: any
    ) => {
        if (usedFor == "Estimated-Time") {
            setEstimatedDescriptionCategory(StatusData);
        } else {
            setUpdateTaskInfo({
                ...UpdateTaskInfo,
                PercentCompleteStatus: StatusData.value,
            });
            setPercentCompleteStatus(StatusData.status);
            setTaskStatus(StatusData.taskStatusComment);
            setPercentCompleteCheck(false);
            setIsTaskStatusUpdated(true);
            if (StatusData.value == 1) {
                let tempArray: any = [];
                if (
                    TaskApproverBackupArray != undefined &&
                    TaskApproverBackupArray.length > 0
                ) {
                    TaskApproverBackupArray.map((dataItem: any) => {
                        tempArray.push(dataItem);
                    });
                } else if (
                    TaskCreatorApproverBackupArray != undefined &&
                    TaskCreatorApproverBackupArray.length > 0
                ) {
                    TaskCreatorApproverBackupArray.map((dataItem: any) => {
                        tempArray.push(dataItem);
                    });
                }
                const finalData = tempArray.filter((val: any, id: any, array: any) => {
                    return array?.indexOf(val) == id;
                });
                setTaskAssignedTo(finalData);
                setTaskTeamMembers(finalData);
                setApproverData(finalData);
                var e: any = "false";
                EditData.TaskApprovers = finalData;
                EditData.CurrentUserData = currentUserData;
                CategoryChange(e, "Approval", 227);
            }
            if (StatusData.value == 2) {
                setInputFieldDisable(true);
            }
            if (StatusData.value != 2) {
                setInputFieldDisable(false);
            }

            if (StatusData.value == 80) {
                // let tempArray: any = [];
                EditData.IsTodaysTask = false;
                EditData.workingThisWeek = false;
                if (
                    EditData.TeamMembers != undefined &&
                    EditData.TeamMembers?.length > 0
                ) {
                    setWorkingMemberFromTeam(EditData.TeamMembers, "QA", 143);
                } else {
                    setWorkingMember(143);
                }
                EditData.IsTodaysTask = false;
                EditData.CompletedDate = undefined;
            }
            if (StatusData.value == 70) {
                if (
                    EditData.TeamMembers != undefined &&
                    EditData.TeamMembers?.length > 0
                ) {
                    setWorkingMemberFromTeam(EditData.TeamMembers, "Development", 0);
                } else {
                    setWorkingMember(0);
                }
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
            if (
                StatusData.value == 93 ||
                StatusData.value == 96 ||
                StatusData.value == 99
            ) {
                EditData.IsTodaysTask = false;
                EditData.workingThisWeek = false;
                setWorkingMember(32);
                StatusOptions?.map((item: any) => {
                    if (StatusData.value == item.value) {
                        setPercentCompleteStatus(item.status);
                        setTaskStatus(item.taskStatusComment);
                    }
                });
            }
            if (StatusData.value == 90) {
                EditData.IsTodaysTask = false;
                EditData.workingThisWeek = false;
                if (EditData.siteType == "Offshore%20Tasks") {
                    setWorkingMember(36);
                } else if (DesignStatus) {
                    setWorkingMember(301);
                } else {
                    setWorkingMember(42);
                }
                EditData.CompletedDate = Moment(new Date()).format("MM-DD-YYYY");
                StatusOptions?.map((item: any) => {
                    if (StatusData.value == item.value) {
                        setPercentCompleteStatus(item.status);
                        setTaskStatus(item.taskStatusComment);
                    }
                });
            }
        }
        setSmartMedaDataUsedPanel("");
    };

    //  ###################### This is Common Function for Chnage The Team Members According to Change Status ######################

    const setWorkingMemberFromTeam = (
        filterArray: any,
        filterType: any,
        StatusID: any
    ) => {
        let tempArray: any = [];
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
                            let updateUserArray1: any = [];
                            updateUserArray1.push(tempArray[0].AssingedToUser);
                            setTaskAssignedTo(updateUserArray1);
                        }
                    } else {
                        if (TaskUserData.TimeCategory == filterType) {
                            tempArray.push(TaskUserData);
                            EditData.TaskAssignedUsers = tempArray;
                            let updateUserArray1: any = [];
                            updateUserArray1.push(tempArray[0].AssingedToUser);
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

    //  ###################### This is Common Function for Chnage The Working Members According to Change Status ######################

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

    const setModalIsOpenToFalse = () => {
        Items.Call("Close");
        // callBack();
        BackupTaskCategoriesData = [];
        AllMetaData = [];
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

    var smartComponentsIds: any = "";
    var RelevantPortfolioIds: any = [];
    var AssignedToIds: any = [];
    var ResponsibleTeamIds: any = [];
    var TeamMemberIds: any = [];
    var CategoryTypeID: any = [];
    var ClientCategoryIDs: any = [];
    var SmartServicesId: any = [];
    var ApproverIds: any = [];

    // ******************** This is Task All Details Update Function  ***************************

    const UpdateTaskInfoFunction = async (usedFor: any) => {
        let TaskShuoldBeUpdate = true;
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


        if (TaskShuoldBeUpdate) {
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
                                    //  if (User?.Title?.toLowerCase() == 'abhishek tiwari') {
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
                                    "Id,Title,PriorityRank,Comments,workingThisWeek,WorkingAction,Project/Id,Project/Title,Project/PriorityRank,Approvee/Id,Approvee/Title,EstimatedTime,EstimatedTimeDescription,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,Sitestagging,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,ComponentLink,Portfolio/Title,Portfolio/Id,Portfolio/PortfolioStructureID,PercentComplete,Categories,TaskLevel,TaskLevel,ClientActivity,ClientActivityJson,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title, ParentTask/TaskID,ParentTask/Id,TaskID"
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
                                    "Id,Title,PriorityRank,Comments,Project/Id,WorkingAction,Project/Title,Project/PriorityRank,workingThisWeek,Approvee/Id,Approvee/Title,EstimatedTime,EstimatedTimeDescription,waitForResponse,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,BasicImageInfo,Sitestagging,Attachments,AttachmentFiles,Priority,Mileage,CompletedDate,FeedBack,Status,ItemRank,IsTodaysTask,Body,ComponentLink,Portfolio/Title,Portfolio/Id,Portfolio/PortfolioStructureID,PercentComplete,Categories,TaskLevel,TaskLevel,ClientActivity,ClientActivityJson,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title, ParentTask/TaskID,ParentTask/Id,TaskID"
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
                            TaskDetailsFromCall[0].Approvere = EditData.Approvere;
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
                                        UpdatedDataObject: UpdatedDataObject
                                    }
                                    await GlobalFunctionForUpdateItems.SendMSTeamsNotificationForWorkingActions(DataForNotification).then(() => {
                                        console.log("Ms Teams Notifications send")
                                    })
                                }
                            })
                        })
                        if (WorkingActionData?.length > 0) {
                            setWorkingAction([...WorkingActionData])
                            UpdateWorkinActionJSON(WorkingActionData);
                        }
                        const uniqueIds: any = {};
                        const result = BackupTaskCategoriesData.filter((item: any) => {
                            if (!uniqueIds[item.Id]) {
                                uniqueIds[item.Id] = true;
                                return true;
                            }
                            return false;
                        });
                        const TaskCategories = result.map((item: any) => item.Title).join(', ');
                        const CheckForInformationRequestCategory: any = TaskCategories.includes("Information Request");
                        let checkStatusUpdate = Number(taskPercentageValue) * 100;


                        // This is used for send MS Teams Notification 
                       
                            try {
                                const sendUserEmails: string[] = [];
                                let AssignedUserName = '';
                                const addEmailAndUserName = (userItem: any) => {
                                    if (userItem?.AssingedToUserId !== currentUserId) {
                                        sendUserEmails.push(userItem.Email);
                                        AssignedUserName = AssignedUserName ? "Team" : userItem?.Title;
                                    }
                                };

                                if (SendMsgToAuthor || (checkStatusUpdate === 90 && CheckForInformationRequestCategory)) {
                                    taskUsers?.forEach((allUserItem: any) => {
                                        if (UpdatedDataObject?.Author?.Id === allUserItem?.AssingedToUserId) {
                                            addEmailAndUserName(allUserItem);
                                        }
                                    });
                                } else {
                                    const usersToCheck = TeamLeaderChanged && TeamMemberChanged ? TaskResponsibleTeam?.concat(TaskAssignedTo) :
                                        TeamLeaderChanged ? UpdatedDataObject?.ResponsibleTeam :
                                            TeamMemberChanged || IsTaskStatusUpdated ? TaskAssignedTo : [];

                                    usersToCheck.forEach((userDtl: any) => {
                                        taskUsers?.forEach((allUserItem: any) => {
                                            if (userDtl.Id === allUserItem?.AssingedToUserId) {
                                                addEmailAndUserName(allUserItem);
                                            }
                                        });
                                    });
                                }
                                let CommonMsg = '';
                                const sendMSGCheck = (checkStatusUpdate === 80 || checkStatusUpdate === 70) && IsTaskStatusUpdated;
                                const SendUserEmailFinal: any = sendUserEmails?.filter((item: any, index: any) => sendUserEmails?.indexOf(item) === index);

                                if (SendMsgToAuthor || (checkStatusUpdate === 90 && CheckForInformationRequestCategory)) {
                                    CommonMsg = ` Task created from your end has been set to 8%. Please take necessary action.`;
                                    let functionType: any = '';
                                    if (checkStatusUpdate === 90 && CheckForInformationRequestCategory) {
                                        functionType = "Information-Request"
                                    } else {
                                        functionType = "Priority-Check"
                                    }
                                    let RequiredDataForNotification: any = {
                                        ItemDetails: UpdatedDataObject,
                                        ReceiverEmail: SendUserEmailFinal,
                                        Context: Context,
                                        usedFor: functionType,
                                        ReceiverName: AssignedUserName
                                    }
                                    GlobalFunctionForUpdateItems.SendEmailNotificationForIRCTasksAndPriorityCheck(RequiredDataForNotification);
                                } 
                                
                                else if (TeamMemberChanged && TeamLeaderChanged) {
                                    CommonMsg = `You have been marked as TL/working member in the below task. Please take necessary action.`;
                                } else if (TeamMemberChanged) {
                                    CommonMsg = `You have been marked as a working member on the below task. Please take necessary action (Analyse the points in the task, fill up the Estimation, Set to 10%).`;
                                } else if (TeamLeaderChanged) {
                                    CommonMsg = `You have been marked as a Lead on the below task. Please take necessary action.`;
                                } else if (IsTaskStatusUpdated) {
                                    switch (checkStatusUpdate) {
                                        case 80:
                                            CommonMsg = `Below task has been set to 80%, please review it.`;
                                            break;
                                        case 70:
                                            CommonMsg = `Below task has been re-opened. Please review it and take necessary action on priority basis.`;
                                            break;
                                    }
                                }
                                
                                const emailMessage = GlobalFunctionForUpdateItems?.GenerateMSTeamsNotification(UpdatedDataObject);
                                const containerDiv = document.createElement('div');
                                const reactElement = React.createElement(emailMessage?.type, emailMessage?.props);
                                ReactDOM.render(reactElement, containerDiv);

                                const SendMessage = `<p><b>Hi ${AssignedUserName},</b> </p></br><p>${CommonMsg}</p> 
                                </br> 
                                    ${containerDiv.innerHTML}
                                    <p>
                                    Task Link:  
                                    <a href=${siteUrls + "/SitePages/Task-Profile.aspx?taskId=" + UpdatedDataObject?.Id + "&Site=" + UpdatedDataObject?.siteType}>
                                     Click-here
                                    </a>
                                    </p>
                                    <p></p>
                                    <b>
                                    Thanks, </br>
                                    Task Management Team
                                    </b>
                                    `;


                                if ((sendMSGCheck || SendMsgToAuthor || TeamMemberChanged || TeamLeaderChanged) && ((Number(taskPercentageValue) * 100) + 1 <= 85 || taskPercentageValue == 0)) {
                                    if (sendUserEmails.length > 0) {
                                        // await sendTeamMessagePromise(SendUserEmailFinal, SendMessage, Items.context)
                                        globalCommon.SendTeamMessage(SendUserEmailFinal, SendMessage, Items.context).then(() => {
                                            console.log("MS Teams Message Send Succesfully !!!!")
                                        }).catch((error) => {
                                            console.log("MS Teams Message Not Send !!!!", error.message)
                                        })
                                    }
                                }
                            } catch (error) {
                                console.log("Error", error.message);
                            }
                        
                        let Createtordata: any = []
                        if (IsTaskStatusUpdated  && (checkStatusUpdate == 80 || checkStatusUpdate == 5) && UpdatedDataObject?.Categories?.indexOf('Immediate') != -1) {
                            taskUsers?.forEach((allUserItem: any) => {
                                if (UpdatedDataObject?.Author?.Id === allUserItem?.AssingedToUserId) {
                                    Createtordata.push(allUserItem);
                                }

                            });

                            Createtordata?.map((InfoItem: any) => {
                                let DataForNotification: any = {
                                    ReceiverName: InfoItem?.Title,
                                    sendUserEmail: [InfoItem?.Email],
                                    Context: Items.context,
                                    ActionType: "Immediate",
                                    ReasonStatement: '',
                                    UpdatedDataObject: UpdatedDataObject
                                }
                                GlobalFunctionForUpdateItems.SendMSTeamsNotificationForWorkingActions(DataForNotification).then(() => {
                                    console.log("Ms Teams Notifications send")
                                })

                            })



                        }
                        if (Items?.pageType == 'createTask' && checkStatusUpdate == 0 && UpdatedDataObject?.Categories?.indexOf('Immediate') != -1) {
                            taskUsers?.forEach((allUserItem: any) => {
                                if (UpdatedDataObject?.Author?.Id === allUserItem?.AssingedToUserId) {
                                    Createtordata.push(allUserItem);
                                }

                            });

                            Createtordata?.map((InfoItem: any) => {
                                let DataForNotification: any = {
                                    ReceiverName: InfoItem?.Title,
                                    sendUserEmail: [InfoItem?.Email],
                                    Context: Items.context,
                                    ActionType: "Immediate",
                                    ReasonStatement: '',
                                    UpdatedDataObject: UpdatedDataObject
                                }
                                GlobalFunctionForUpdateItems.SendMSTeamsNotificationForWorkingActions(DataForNotification).then(() => {
                                    console.log("Ms Teams Notifications send")
                                })

                            })



                        }

                        if (IsTaskStatusUpdated && checkStatusUpdate == 90 && UpdatedDataObject?.Categories?.indexOf('Design') != -1) {
                            taskUsers?.forEach((allUserItem: any) => {
                                if (UpdatedDataObject?.Author?.Id === allUserItem.AssingedToUserId) {
                                    Createtordata.push(allUserItem);
                                }

                            });

                            Createtordata?.map((InfoItem: any) => {

                                let DataForNotification: any = {
                                    ReceiverName: 'kristina',
                                    sendUserEmail: ['kristina.kovach@hochhuth-consulting.de'],
                                    Context: Items.context,
                                    ActionType: "Design",
                                    ReasonStatement: "",
                                    UpdatedDataObject: UpdatedDataObject
                                }
                                GlobalFunctionForUpdateItems.SendMSTeamsNotificationForWorkingActions(DataForNotification).then(() => {
                                    console.log("Ms Teams Notifications send")
                                })

                            })



                        }

                        if (Items?.pageType == 'createTask' && checkStatusUpdate == 0 && UpdatedDataObject?.Categories?.indexOf('User Experience - UX') != -1) {
                            taskUsers?.forEach((allUserItem: any) => {
                                if (UpdatedDataObject?.Author?.Id === allUserItem.AssingedToUserId) {
                                    Createtordata.push(allUserItem);
                                }

                            });

                            Createtordata?.map((InfoItem: any) => {

                                let DataForNotification: any = {
                                    ReceiverName: 'Robert',
                                    sendUserEmail: ['robert.ungethuem@hochhuth-consulting.de'],
                                    Context: Items.context,
                                    ActionType: "User Experience - UX",
                                    ReasonStatement: "",
                                    UpdatedDataObject: UpdatedDataObject
                                }
                                GlobalFunctionForUpdateItems.SendMSTeamsNotificationForWorkingActions(DataForNotification).then(() => {
                                    console.log("Ms Teams Notifications send")
                                })

                            })



                        }

                        if (checkStatusUpdate == 90 && UpdatedDataObject?.Categories?.indexOf('User Experience - UX') != -1) {
                            taskUsers?.forEach((allUserItem: any) => {
                                if (UpdatedDataObject?.Author?.Id === allUserItem.AssingedToUserId) {
                                    Createtordata.push(allUserItem);
                                }

                            });

                            Createtordata?.map((InfoItem: any) => {

                                let DataForNotification: any = {
                                    ReceiverName: 'kristina',
                                    sendUserEmail: ['kristina.kovach@hochhuth-consulting.de'],
                                    Context: Items.context,
                                    ActionType: "User Experience - UX",
                                    ReasonStatement: "",
                                    UpdatedDataObject: UpdatedDataObject
                                }
                                GlobalFunctionForUpdateItems.SendMSTeamsNotificationForWorkingActions(DataForNotification).then(() => {
                                    console.log("Ms Teams Notifications send")
                                })

                            })



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
                                //EditData.TaskApprovers.push(EditData?.Author)
                            }
                        }
                        let spaceIndex = EditData.TaskCreatorData[0]?.Title?.lastIndexOf(' ');
                        if (spaceIndex !== -1) {
                            TaskDetailsFromCall[0].CreatorTitle = EditData.TaskCreatorData[0]?.Title?.substring(0, spaceIndex);
                        } else {
                            console.log("No last name found");
                        }
                        let CalculateStatusPercentages: any = TaskDetailsFromCall[0].PercentComplete ? TaskDetailsFromCall[0].PercentComplete
                            : 0;
                        if (IsTaskStatusUpdated && CalculateStatusPercentages == 90 && EmailStatus == true) {
                            setLastUpdateTaskData(TaskDetailsFromCall[0]);
                            ValueStatus = "90";
                            setSendEmailNotification(true);
                        }
                        setLastUpdateTaskData(TaskDetailsFromCall[0]);
                        if (usedFor == "Image-Tab") {
                            GetExtraLookupColumnData();
                        } else {
                            BackupTaskCategoriesData = [];
                            AllMetaData = [];
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
                            SiteCompositionPrecentageValue = 0;

                            let CalculateStatusPercentage: any = TaskDetailsFromCall[0].PercentComplete ? TaskDetailsFromCall[0].PercentComplete
                                : 0;
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
                            if (
                                (CalculateStatusPercentage == 5 || CalculateStatusPercentage == 10 || CalculateStatusPercentage == 80 ||
                                    CalculateStatusPercentage == 90) && ImmediateStatus && EditData.PercentComplete != CalculateStatusPercentage) {
                                ValueStatus = CalculateStatusPercentage;
                                setSendEmailNotification(true);
                                Items.StatusUpdateMail = true;
                            }
                            if (TaskDetailsFromCall[0]?.Categories?.indexOf('Immediate') != -1 && CalculateStatusPercentage == 0 && Items?.pageType == 'createTask') {
                                ValueStatus = CalculateStatusPercentage;
                                setSendEmailNotification(true);
                                Items.StatusUpdateMail = true;
                            }
                            else {
                                setSendEmailComponentStatus(false);
                                Items.StatusUpdateMail = false;
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
                                Items.Call("Save");
                            }
                        }
                    });
            } catch (error) {
                console.log("Error:", error.messages);
            }
        }
    };


    const MakeUpdateDataJSON = async () => {
        var UploadImageArray: any = [];
        var ApprovalData: any = [];
        // const uniqueObjects = [];
        // const idSet = new Set();
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
            updateFeedbackArray = JSON.parse(EditData?.FeedBack);
        }
        // FeedBackBackupArray = [];
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

        if (ApproverData != undefined && ApproverData?.length > 0) {
            ApproverData?.map((ApproverInfo) => {
                if (ApproverInfo.AssingedToUserId != undefined) {
                    ApproverIds.push(ApproverInfo.AssingedToUserId)
                }
                else {
                    ApproverIds.push(ApproverInfo.Id);
                }

            });
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

        if (ClientTimeData?.length > 0) {
            ClientTimeData?.map((SCItems: any) => {
                SiteCompositionPrecentageValue =
                    SiteCompositionPrecentageValue +
                    Number(SCItems.ClienTimeDescription);
                delete SCItems?.ClientCategory;
            });
        }

        let UpdateDataObject: any = {
            IsTodaysTask: EditData.IsTodaysTask ? EditData.IsTodaysTask : null,
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
                results:
                    AssignedToIds != undefined && AssignedToIds.length > 0
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
            //BasicImageInfo: UploadImageArray != undefined && UploadImageArray.length > 0 ? JSON.stringify(UploadImageArray) : JSON.stringify(UploadImageArray),
            ProjectId: selectedProject.length > 0 ? selectedProject[0].Id : null,
            ApproverId: {
                results:
                    ApproverIds != undefined && ApproverIds.length > 0 ? ApproverIds : [],
            },
            Sitestagging: ClientTimeData?.length > 0 ? JSON.stringify(ClientTimeData) : null,
            ClientCategoryId: {
                results:
                    ClientCategoryIDs != undefined && ClientCategoryIDs.length > 0
                        ? ClientCategoryIDs
                        : [],
            },
            // SiteCompositionSettings: SiteCompositionSetting,
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

    //    ************* This is team configuration call Back function **************

    const getTeamConfigData = useCallback((teamConfigData: any, Type: any) => {
        if (Type == "TimeSheet") {
            const timesheetDatass = teamConfigData;
            console.log(timesheetDatass);
        } else {

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
        var link =
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
        } else {
            console.log("Your Task has not been deleted");
        }
    };
    const deleteItemFunction = async (itemId: any, FnType: any) => {
        var site = SelectedSite.replace(/^"|"$/g, "");
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
                var ItmesDelete: any = {
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
            console.log("Error:", error.message);
        }
    };

    // ************* this is for FeedBack Comment Section Functions ************

    const CommentSectionCallBack = useCallback((EditorData: any) => {
        CommentBoxData = EditorData;
        BuildFeedBackArray();
    }, []);
    const SubCommentSectionCallBack = useCallback((feedBackData: any) => {
        SubCommentBoxData = feedBackData;
        BuildFeedBackArray();
    }, []);

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
                        setInputFieldDisable(false);
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
                                setInputFieldDisable(false);
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
                            setInputFieldDisable(true);
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
                                    setInputFieldDisable(true);
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
                if (EditDataBackup?.Categories?.includes("Approval") && EditDataBackup?.PercentComplete > 0 && EditDataBackup?.PercentComplete <  5  && IsTaskStatusUpdated) {
                    teamMember.push(currentUserBackupArray?.[0]?.AssingedToUser)
                    AssignedTo.push(currentUserBackupArray?.[0]?.AssingedToUser)
                    setTaskAssignedTo(AssignedTo)
                    setTaskTeamMembers(teamMember);
                    setApprovalTaskStatus(true);
                }



            }
        }
        if (PhoneCount > 0) {
            CategoryChangeUpdateFunction("false", "Phone", 199);
        }
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

    const FlorarImageUploadComponentCallBack = (dt: any) => {
        setUploadBtnStatus(false);
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg",
        };
        let arrayIndex: any = TaskImages?.length;
        TaskImages.push(DataObject);
        if (dt.length > 0) {
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
        if (Items.Items.siteType == "Offshore%20Tasks") {
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


    // this is a common function for updating the basic inmage info on Backend side when we upload image, replace image, and remove image

    const UpdateBasicImageInfoJSON = (JsonData: any, usedFor: string, ImageIndex: any) => {
        return new Promise<void>(async (resolve, reject) => {
            var UploadImageArray: any = [];

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
                console.log("Error Message :", error);
                reject(error);
            }
        });
    };


    // this is used for deleteing a image and update data on backend side

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
            var src = Data?.data_url?.split(",")[1];
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

    const FlorarImageReplaceComponentCallBack = (dt: any) => {
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg",
        };
        ReplaceImageData = DataObject;
        console.log("Replace Image Data ======", DataObject);
        // let arrayIndex: any = TaskImages?.length
        // TaskImages.push(DataObject)
        // if (dt.length > 0) {
        //     onUploadImageFunction(TaskImages, [arrayIndex]);
        // }
    };
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
        if (type == "Bottleneck" || type == "Attention") {
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

    const UpdateImageDescription = (e: any, UsedFor: string) => {
        if (UsedFor == "Image") {
            TaskImages[AddImageDescriptionsIndex].Description = e.target.value;
        }
        if (UsedFor == "Bottleneck" || UsedFor == "Attention") {
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
            TempSitesTaggingData = ClientTimeData;
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
            Comments: EditData.Comments,
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
                            if (timesheetData != undefined && timesheetData.length > 0) {
                                await moveTimeSheet(SelectedSite, res.data, 'copy');
                            }
                            newGeneratedId = res.data.Id;
                            console.log(`Task Copied Successfully on ${SelectedSite} !!!!!`);
                            let url = `${siteUrls}/SitePages/Task-Profile.aspx?taskId=${newGeneratedId}&Site=${SelectedSite}`;
                            window.open(url);
                        } else {
                            console.log(`Task Moved Successfully on ${SelectedSite} !!!!!`);
                            if (timesheetData != undefined && timesheetData.length > 0) {
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

    const CopydocumentData = async (NewList: any, NewItem: any) => {
        var ArrayData: any = [];
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
                var MoveDataId = res[0]?.ID;
                ArrayData.push(NewItem.Id);
                var NewListData: any = NewList + "Id";
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
    const CopyImageData = async (NewList: any, NewItem: any) => {
        setLoaded(false)
        var attachmentFileName: any = "";
        let web = new Web(siteUrls);
        const response = await web.lists
            .getById(`${Items?.Items?.listId}`)
            .items.getById(Items?.Items?.Id)
            .select("Id,Title,Attachments,AttachmentFiles")
            .expand("AttachmentFiles")
            .get();
        await SaveImageDataOnLoop(response, NewList, NewItem);
    };
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
                    var uint8Array = new Uint8Array(binaryData);
                    console.log(uint8Array);

                    console.log(uint8Array);
                    let fileName: any = "";
                    let date = new Date();
                    let timeStamp = date.getTime();
                    let imageIndex = index + 1;
                    var file =
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
                            NewList +
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

                    count++;
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
        var Data = await web.lists
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

    const moveTimeSheet = async (SelectedSite: any, newItem: any, type: any) => {
        newGeneratedId = newItem.Id;
        var TimesheetConfiguration: any = [];
        var folderUri = "";
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
            siteUrl = val.siteUrl;
            listName = val.TimesheetListName;
        });
        var count = 0;
        timesheetData?.forEach(async (val: any) => {
            var siteType: any = "Task" + SelectedSite + "Id";
            var SiteId = "Task" + Items.Items.siteType;
            var Data = await web.lists
                .getById(TimeSheetlistId)
                .items.getById(val.Id)
                .update({
                    [siteType]: newItem.Id,
                })
                .then((res) => {
                    count++;
                    if (count == timesheetData.length && type == 'move') {
                        Items.Items.Action = "Move";
                        setLoaded(true)
                        deleteItemFunction(Items.Items.Id, "Move");
                    }
                });
        });
        var UpdatedData: any = {};
    };

    // ************** this is for Project Management Section Functions ************

    const autoSuggestionsForProject = (e: any) => {
        let searchedKey: any = e.target.value;
        setProjectSearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AllProjectData?.map((itemData: any) => {
                if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
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

    const UpdateApproverFunction = () => {
        var data: any = ApproverData;
        if (useFor == "Bottleneck" || useFor == "Attention") {
            let CreatorData: any = currentUserBackupArray[0];
            let copyWorkAction: any = [...WorkingAction]
            if (data?.length > 0) {
                data?.map((selectedData: any) => {
                    if (selectedData?.Id != undefined) {
                        let CreateObject: any = {
                            CreatorName: CreatorData?.Title,
                            CreatorImage: CreatorData.UserImage,
                            CreatorID: CreatorData.Id,
                            TaggedUsers: {
                                Title: selectedData.Title,
                                Email: selectedData.Email,
                                AssingedToUserId: selectedData.AssingedToUserId,
                                userImage: selectedData.Item_x0020_Cover?.Url,
                            },
                            NotificationSend: false,
                            Comment: '',
                            CreatedOn: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY"),
                        }
                        if (copyWorkAction?.length > 0) {
                            copyWorkAction?.map((DataItem: any) => {
                                if (DataItem.Title == useFor) {
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
                                }
                            ]
                            TempArrya?.map((TempItem: any) => {
                                if (TempItem.Title == useFor) {
                                    CreateObject.Id = TempItem.InformationData?.length;
                                    TempItem.InformationData.push(CreateObject);
                                }
                            })

                            copyWorkAction = TempArrya;
                        }
                    }

                })
            }


            setWorkingAction([...copyWorkAction]);
            console.log("Bottleneck All Details:", copyWorkAction)
            setUseFor("")
            setApproverPopupStatus(false)
            setApproverData([])
        }
        else {
            setApproverPopupStatus(false);
            setTaskAssignedTo(ApproverData);
            setApproverData(data);
            setTaskTeamMembers(ApproverData);
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
        if (type == "OnTaskPopup") {
            setApproverSearchKey(e.target.value);
        }
        if (type == "OnPanel") {
            setApproverSearchKey(e.target.value);
        }

        BottleneckSearchKey
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

            if (type == "OnTaskPopup") {
                setApproverSearchedData(tempArray);
            }
            if (type == "Bottleneck") {
                setBottleneckSearchedData(tempArray);
            }
            if (type == "Attention") {
                setAttentionSearchedData(tempArray);
            }
            if (type == "OnPanel") {
                setApproverSearchedDataForPopup(tempArray);
            }
        } else {
            setApproverSearchedData([]);
            setBottleneckSearchedData([]);
            setAttentionSearchedData([]);
            setApproverSearchedDataForPopup([]);
        }
    };



    const SelectApproverFromAutoSuggestion = (ApproverData: any, usedFor: string) => {
        setApproverSearchedData([]);
        setApproverSearchedDataForPopup([]);
        setAttentionSearchedData([]);
        setApproverSearchKey("");
        setBottleneckSearchKey("");
        setAttentionSearchKey("");
        setBottleneckSearchedData([]);
        if (usedFor == "Bottleneck" || usedFor == "Attention") {
            let CreatorData: any = currentUserBackupArray[0];
            let copyWorkAction: any = [...WorkingAction]
            let CreateObject: any = {
                CreatorName: CreatorData?.Title,
                CreatorImage: CreatorData.UserImage,
                CreatorID: CreatorData.Id,
                TaggedUsers: {
                    Title: ApproverData.Title,
                    Email: ApproverData.Email,
                    AssingedToUserId: ApproverData.AssingedToUserId,
                    userImage: ApproverData.Item_x0020_Cover?.Url,
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
        } else {
            let ApproverHistoryObject: any
            selectApproverFunction(ApproverData);
            setTaskAssignedTo([ApproverData]);
            setTaskTeamMembers([ApproverData]);
            TaskApproverBackupArray = [ApproverData];
            if (useFor == "Bottleneck" || useFor == "Attention") {
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
            } else {
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
            }

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
        let Time: any = TotalTime;
        setSmartTotalTimeData(Time);
    }, []);

    const closeSiteCompsotionPanelFunction = (FnType: any) => {
        if (FnType == "Save") {
            setTimeout(() => {
                GetExtraLookupColumnData();
            }, 1000);
        }
        setSiteCompositionShow(false);
    };




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
            console.log("Data JSON =======", EstimatedTimeDescriptionsJSON);
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
        const afterItemDelete: any = ApproverData.filter((item: any) => item.Title != value.Title)
        setApproverData(afterItemDelete)
    }

    // this is used for updating workingAction JSON Data on Backedn Side 

    const UpdateWorkinActionJSON = async (DataForUpdate: any) => {

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
            console.log("Updated Data after removing User:", TempWorkingActionData);
            setWorkingAction([...TempWorkingActionData])
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
    //  This is the end of the function 
    const openBottleneckPopup = (usefor: any) => {
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
                    className={
                        ServicesTaskCheck
                            ? "serviepannelgreena subheading alignCenter"
                            : "subheading alignCenter"
                    }
                >
                    <img className="imgWid29 pe-1" src={Items.Items.SiteIcon} />
                    <span className="siteColor">
                        {`${EditData.TaskId != undefined || EditData.TaskId != null
                            ? EditData.TaskId
                            : ""
                            } ${EditData.Title != undefined || EditData.Title != null
                                ? EditData.Title
                                : ""
                            }`}
                    </span>
                </div>
                <Tooltip ComponentId="1683" isServiceTask={ServicesTaskCheck} />
            </>
        );
    };
    const onRenderStatusPanelHeader = () => {
        return (
            <div
                className={
                    ServicesTaskCheck
                        ? "d-flex full-width pb-1 serviepannelgreena"
                        : "d-flex full-width pb-1"
                }
            >
                <div className="subheading">
                    <span className="siteColor">
                        {SmartMedaDataUsedPanel == "Status"
                            ? `Update Status`
                            : `Select Category`}
                    </span>
                </div>
                <Tooltip
                    ComponentId={SmartMedaDataUsedPanel == "Status" ? "6840" : "1735"}
                    isServiceTask={ServicesTaskCheck}
                />
            </div>
        );
    };

    const onRenderCustomHeaderCopyAndMoveTaskPanel = () => {
        return (
            <div
                className={
                    ServicesTaskCheck
                        ? "d-flex full-width pb-1 serviepannelgreena"
                        : "d-flex full-width pb-1"
                }
            >
                <div className="subheading">
                    <img className="imgWid29 pe-1 mb-1 " src={Items.Items.SiteIcon} />
                    <span className="siteCOlor">Select Site</span>
                </div>
                <Tooltip ComponentId="1683" isServiceTask={ServicesTaskCheck} />
            </div>
        );
    };
    const onRenderCustomHeaderAddImageDescription = () => {
        return (
            <div
                className={
                    ServicesTaskCheck
                        ? "d-flex full-width pb-1 serviepannelgreena"
                        : "d-flex full-width pb-1"
                }
            >
                <div className="subheading">Add {AddDescriptionModelName} Descriptions</div>
                <Tooltip ComponentId="1683" isServiceTask={ServicesTaskCheck} />
            </div>
        );
    };
    const onRenderCustomReplaceImageHeader = () => {
        return (
            <div
                className={
                    ServicesTaskCheck
                        ? "d-flex full-width pb-1 serviepannelgreena"
                        : "d-flex full-width pb-1"
                }
            >
                <div className="subheading siteColor">Replace Image</div>
                <Tooltip ComponentId="6776" isServiceTask={ServicesTaskCheck} />
            </div>
        );
    };

    const onRenderCustomApproverHeader = () => {
        return (
            <div
                className={
                    ServicesTaskCheck
                        ? "d-flex full-width pb-1 serviepannelgreena"
                        : "d-flex full-width pb-1"
                }
            >
                <div className="subheading siteColor"> {useFor != "" ? `Select${useFor}` : `Select Approver`}</div>
                <Tooltip ComponentId="1683" isServiceTask={ServicesTaskCheck} />
            </div>
        );
    };

    const onRenderCustomFooterMain = () => {
        return (
            <footer
                className={
                    ServicesTaskCheck
                        ? "serviepannelgreena bg-f4 fixed-bottom"
                        : "bg-f4 fixed-bottom"
                }
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
                            <a className="hreflink siteColor">
                                <span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span>
                                <span
                                    onClick={() => deleteTaskFunction(EditData.ID, "Delete-Task")}
                                >
                                    Delete This Item
                                </span>
                            </a>
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
                                href={`${siteUrls}/Lists/${Items.Items.siteType}/EditForm.aspx?ID=${EditData.ID}`}
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
                className={
                    ServicesTaskCheck
                        ? "serviepannelgreena bg-f4 fixed-bottom"
                        : "bg-f4 fixed-bottom"
                }
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
                            <span> | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}>
                                Copy Task
                            </a>
                            <span> | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}>
                                {" "}
                                Move Task
                            </a>{" "}
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
                                href={`${Items.Items.siteType}/Lists/${Items.Items.siteType}/EditForm.aspx?ID=${EditData.ID}`}
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


    return (
        <div
            className={
                ServicesTaskCheck
                    ? `serviepannelgreena ${EditData.Id}`
                    : `${EditData.Id}`
            }
        >

            {/* ***************** this is status panel *********** */}
            <Panel
                onRenderHeader={onRenderStatusPanelHeader}
                isOpen={SmartMedaDataUsedPanel?.length > 0}
                onDismiss={() => setSmartMedaDataUsedPanel("")}
                isBlocking={SmartMedaDataUsedPanel?.length > 0}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
                    <div className="modal-body">
                        <div className="TaskStatus">
                            <div>
                                {SmartMedaDataUsedPanel === "Status" ? (
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
                                {SmartMedaDataUsedPanel === "Estimated-Time" ? (
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
                <div
                    className={
                        ServicesTaskCheck ? "modal-body serviepannelgreena" : "modal-body"
                    }
                >
                    <TimeEntryPopup props={Items.Items} />
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
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
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
                                                                Working This Week?
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
                                                                Working Today?
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
                                                    {/* <CDatePicker date={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : ''}/> */}
                                                    {/* <DatePicker value={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : null} onChange={(date) => setEditData({
                                                        ...EditData, StartDate: date
                                                    })} /> */}
                                                    <label className="form-label full-width">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        max="9999-12-31"
                                                        // min={
                                                        //     EditData.Created
                                                        //         ? Moment(EditData.Created).format("YYYY-MM-DD")
                                                        //         : ""
                                                        // }
                                                        defaultValue={
                                                            EditData.StartDate
                                                                ? Moment(EditData.StartDate).format(
                                                                    "YYYY-MM-DD"
                                                                )
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
                                                        // min={
                                                        //     EditData.Created
                                                        //         ? Moment(EditData.Created).format("YYYY-MM-DD")
                                                        //         : ""
                                                        // }
                                                        defaultValue={
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
                                                        // min={
                                                        //     EditData.Created
                                                        //         ? Moment(EditData.Created).format("YYYY-MM-DD")
                                                        //         : ""
                                                        // }
                                                        defaultValue={
                                                            EditData.CompletedDate
                                                                ? Moment(EditData.CompletedDate).format(
                                                                    "YYYY-MM-DD"
                                                                )
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
                                                            value={SearchedServiceCompnentKey}
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
                                                    {SearchedServiceCompnentData?.length > 0 ? (
                                                        <div className="SmartTableOnTaskPopup">
                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                {SearchedServiceCompnentData.map((Item: any) => {
                                                                    return (
                                                                        <li
                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                            key={Item.id}
                                                                            onClick={() =>
                                                                                setSelectedServiceAndCompnentData(
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
                                                                if (
                                                                    type.Title != "Phone" &&
                                                                    type.Title != "Email Notification" &&
                                                                    type.Title != "Immediate" &&
                                                                    type.Title != "Approval" &&
                                                                    type.Title != "Email" &&
                                                                    type.Title != "Only Completed"
                                                                ) {
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
                                                                                        type.Title,
                                                                                        type.Id
                                                                                    )
                                                                                }
                                                                                className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                            ></span>
                                                                        </div>
                                                                    );
                                                                }
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

                                                <div className="col">
                                                    <div className="col">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input rounded-0"
                                                                name="Phone"
                                                                type="checkbox"
                                                                checked={PhoneStatus}
                                                                value={`${PhoneStatus}`}
                                                                onClick={(e) => CategoryChange(e, "Phone", 199)}
                                                            />
                                                            <label className="form-check-label">Phone</label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={EmailStatus}
                                                                value={`${EmailStatus}`}
                                                                onClick={(e) =>
                                                                    CategoryChange(e, "Email Notification", 276)
                                                                }
                                                            />
                                                            <label>Email Notification</label>
                                                            <div className="form-check ms-2">
                                                                <input
                                                                    className="form-check-input rounded-0"
                                                                    type="checkbox"
                                                                    checked={OnlyCompletedStatus}
                                                                    value={`${OnlyCompletedStatus}`}
                                                                    onClick={(e) =>
                                                                        CategoryChange(e, "Only Completed", 565)
                                                                    }
                                                                />
                                                                <label>Only Completed</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={ImmediateStatus}
                                                                value={`${ImmediateStatus}`}
                                                                onClick={(e) =>
                                                                    CategoryChange(e, "Immediate", 228)
                                                                }
                                                            />
                                                            <label>Immediate</label>
                                                        </div>
                                                        {/* {TaskCategoriesData != undefined &&
                                                            TaskCategoriesData?.length > 0 ? (
                                                            <div>
                                                                {TaskCategoriesData?.map(
                                                                    (type: any, index: number) => {
                                                                        if (
                                                                            type.Title != "Phone" &&
                                                                            type.Title != "Email Notification" &&
                                                                            type.Title != "Immediate" &&
                                                                            type.Title != "Approval" &&
                                                                            type.Title != "Email" &&
                                                                            type.Title != "Only Completed"
                                                                        ) {
                                                                            return (
                                                                                <div className="block w-100">
                                                                                    <a
                                                                                        style={{ color: "#fff !important" }}
                                                                                        className="wid90"
                                                                                    >
                                                                                        {type.Title}
                                                                                    </a>
                                                                                    <span
                                                                                        onClick={() =>
                                                                                            removeCategoryItem(
                                                                                                type.Title,
                                                                                                type.Id
                                                                                            )
                                                                                        }
                                                                                        className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                                    ></span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    }
                                                                )}
                                                            </div>
                                                        ) : null} */}
                                                    </div>
                                                    <div className="form-check mt-2">
                                                        <label className="full-width">Approval</label>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input rounded-0"
                                                            name="Approval"
                                                            checked={ApprovalStatus}
                                                            value={`${ApprovalStatus}`}
                                                            onClick={(e) =>
                                                                CategoryChange(e, "Approval", 227)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col ps-4 mb-1">
                                                        <ul className="p-0 mt-1 list-none">
                                                            <li className="SpfxCheckRadio">
                                                                <input
                                                                    className="radio"
                                                                    name="ApprovalLevel"
                                                                    type="radio"
                                                                />
                                                                <label className="form-check-label">
                                                                    Normal Approval
                                                                </label>
                                                            </li>
                                                            <li className="SpfxCheckRadio">
                                                                <input
                                                                    type="radio"
                                                                    className="radio"
                                                                    name="ApprovalLevel"
                                                                />
                                                                <label> Complex Approval</label>
                                                            </li>
                                                            <li className="SpfxCheckRadio">
                                                                <input
                                                                    type="radio"
                                                                    className="radio"
                                                                    name="ApprovalLevel"
                                                                />
                                                                <label>Quick Approval</label>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    {ApprovalStatus ? (
                                                        <div>
                                                            <div className="input-group mb-2">
                                                                <label className="form-label full-width"></label>
                                                                {ApproverData?.length > 1 ? <>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Search Approver's Name Here"
                                                                        value={ApproverSearchKey}
                                                                        onChange={(e) =>
                                                                            autoSuggestionsForApprover(e, "OnTaskPopup")
                                                                        }
                                                                    />
                                                                    {ApproverSearchedData?.length > 0 ? (
                                                                        <div className="SmartTableOnTaskPopup">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {ApproverSearchedData.map((item: any) => {
                                                                                    return (
                                                                                        <li
                                                                                            className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                            key={item.id}
                                                                                            onClick={() =>
                                                                                                SelectApproverFromAutoSuggestion(
                                                                                                    item, "Approver"
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <a>{item.NewLabel}</a>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    ) : null}
                                                                    {ApproverData?.map(
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
                                                                                        onClick={() => removeAssignedMember(type)}
                                                                                        className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                                    ></span>
                                                                                </div>
                                                                            );
                                                                        }

                                                                    )}</> :
                                                                    <>
                                                                        {ApproverData?.length == 1 ?

                                                                            <div className="full-width">

                                                                                {ApproverData.map(
                                                                                    (Approver: any, index: number) => {
                                                                                        return (
                                                                                            <div className="full-width replaceInput alignCenter">
                                                                                                <a
                                                                                                    className="hreflink"
                                                                                                    target="_blank"
                                                                                                    data-interception="off"
                                                                                                >
                                                                                                    {Approver.Title}
                                                                                                </a>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </div>
                                                                            :
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="txtApprover"
                                                                                    // onChange={(e) => autoSuggestionsForCategory(e)}
                                                                                    placeholder="Search Name Here!"
                                                                                    value={ApproverSearchKey}
                                                                                    onChange={(e) => autoSuggestionsForApprover(e, "OnTaskPopup")}
                                                                                />
                                                                                {ApproverSearchedDataForPopup?.length > 0 ? (
                                                                                    <div className="SmartTableOnTaskPopup">
                                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
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
                                                                            </>
                                                                        }
                                                                    </>

                                                                }

                                                                <span
                                                                    className="input-group-text mt--10"
                                                                    onClick={OpenApproverPopupFunction}
                                                                    title="Approver Data Popup"
                                                                >
                                                                    <span className="svg__iconbox svg__icon--editBox mt--10"></span>
                                                                </span>
                                                            </div>
                                                            <div className="Approval-History-section my-2">
                                                                {ApproverHistoryData != undefined &&
                                                                    ApproverHistoryData.length > 1 ? (
                                                                    <div className="border p-1">
                                                                        <div className="siteBdrBottom">
                                                                            <p className="mb-1">Previous Approver</p>
                                                                        </div>
                                                                        {ApproverHistoryData.map(
                                                                            (HistoryData: any, index: any) => {
                                                                                if (
                                                                                    index <
                                                                                    ApproverHistoryData.length - 1
                                                                                ) {
                                                                                    return (
                                                                                        <div
                                                                                            className={
                                                                                                index + 1 ==
                                                                                                    ApproverHistoryData.length - 1
                                                                                                    ? "alignCenter full-width justify-content-between py-1"
                                                                                                    : "alignCenter  border-bottom full-width justify-content-between py-1"
                                                                                            }
                                                                                        >
                                                                                            <div>
                                                                                                {HistoryData.ApprovedDate}
                                                                                            </div>
                                                                                            <div>
                                                                                                <img
                                                                                                    title={
                                                                                                        HistoryData.ApproverName
                                                                                                    }
                                                                                                    className="workmember ms-1"
                                                                                                    src={
                                                                                                        HistoryData?.ApproverImage
                                                                                                            ?.length > 0
                                                                                                            ? HistoryData?.ApproverImage
                                                                                                            : ""
                                                                                                    }
                                                                                                />
                                                                                            </div>

                                                                                        </div>

                                                                                    );
                                                                                }
                                                                            }
                                                                        )}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    ) : null}
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
                                                            <div className="bg-e9 w-100 py-1 px-2" style={{border:'1px solid #CDD4DB'}}>
                                                                <span className={EditData?.SmartPriority != undefined ? "hover-text hreflink m-0 siteColor sxsvc" : "hover-text hreflink m-0 siteColor cssc"}>
                                                                    <>{EditData?.SmartPriority != undefined ? EditData?.SmartPriority : 0}</>
                                                                    <span className="tooltip-text pop-right">
                                                                        {EditData?.showFormulaOnHover != undefined ?
                                                
                                                                        <SmartPriorityHover editValue={EditData}/> : ""}
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
                                                                                        setSelectedServiceAndCompnentData(
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
                                                                                        href={`${siteUrls}/SitePages/Project-Management-Profile.aspx?ProjectId=${ProjectData.Id}`}
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
                                                                                <a>{item?.Path}</a>
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
                                                        <span className="svg__iconbox svg__icon--link"></span>
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
                                                    //  disabled={InputFieldDisable}
                                                    disabled
                                                    readOnly
                                                    className="bg-body form-control px-2"
                                                    // defaultValue={PercentCompleteCheck ? (EditData.PercentComplete != undefined && Math.floor(EditData.PercentComplete) === EditData.PercentComplete ? Number(EditData.PercentComplete).toFixed(0) : null) : (UpdateTaskInfo.PercentCompleteStatus ? UpdateTaskInfo.PercentCompleteStatus : null)}
                                                    value={PercentCompleteStatus}
                                                    onChange={(e) => StatusAutoSuggestion(e)}
                                                />

                                                <span
                                                    className="input-group-text"
                                                    title="Status Popup"
                                                    // onClick={() => openTaskStatusUpdatePopup(EditData, "Status")}
                                                    onClick={() => setSmartMedaDataUsedPanel("Status")}
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
                                                                    </a>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border p-2 mb-3">
                                            <div>Estimated Task Time Details</div>
                                            <div className="col-12">
                                                <div
                                                    onChange={UpdateEstimatedTimeDescriptions}
                                                    className="full-width"
                                                >
                                                    <div className="input-group mt-2">
                                                        <label className="form-label full-width">
                                                            Select Category
                                                        </label>
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
                                                                setSmartMedaDataUsedPanel("Estimated-Time")
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
                                    <div className="col-md-4">
                                        {/* This is used for bottleneck  */}
                                        <div className="col ps-0">
                                            <div className="input-group">
                                                <label className="form-label full-width ">
                                                    Bottleneck
                                                </label>
                                                <input
                                                    type="text"
                                                    value={BottleneckSearchKey}
                                                    className="form-control"
                                                    placeholder="Tag user for Bottleneck"
                                                    onChange={(e) => autoSuggestionsForApprover(e, "Bottleneck")}
                                                />
                                                <span
                                                    className="input-group-text"
                                                    // onClick={() => openTaskStatusUpdatePopup(EditData, "Status")}
                                                    onClick={() => openBottleneckPopup("Bottleneck")}
                                                >
                                                    <span
                                                        title="Add Comment"
                                                        className="svg__iconbox svg__icon--editBox"
                                                    ></span>
                                                </span>
                                                {BottleneckSearchedData?.length > 0 ? (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                            {BottleneckSearchedData.map((item: any) => {
                                                                return (
                                                                    <li
                                                                        className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                        key={item.id}
                                                                        onClick={() =>
                                                                            SelectApproverFromAutoSuggestion(
                                                                                item, "Bottleneck"
                                                                            )
                                                                        }
                                                                    >
                                                                        <a>{item.NewLabel}</a>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                ) : null}
                                            </div>
                                            {WorkingAction?.map((WAItemData: any, ItemIndex: number) => {
                                                if (WAItemData.Title == "Bottleneck" && WAItemData?.InformationData?.length > 0) {
                                                    return (
                                                        <div className="border p-1 mt-1">
                                                            {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: number) => {
                                                                return (
                                                                    <div className="align-content-center alignCenter justify-content-between py-1">
                                                                        <div className="alignCenter">
                                                                            <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                src={
                                                                                    InfoData.TaggedUsers.userImage !=
                                                                                        undefined &&
                                                                                        InfoData.TaggedUsers.userImage.length >
                                                                                        0
                                                                                        ? InfoData.TaggedUsers.userImage
                                                                                        : ""
                                                                                }
                                                                            />
                                                                            <span className="ms-1">{InfoData?.TaggedUsers?.Title}</span>
                                                                        </div>

                                                                        <div className="alignCenter">
                                                                            <span
                                                                                className="hover-text m-1"
                                                                                onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Reminder", WAItemData.Title)}
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
                                                                                        "Bottleneck"
                                                                                    )
                                                                                }
                                                                            >
                                                                                <span className="svg__iconbox svg__icon--comment"></span>
                                                                                <span className="tooltip-text pop-left">
                                                                                    {InfoData.Comment != undefined &&
                                                                                        InfoData.Comment?.length > 1
                                                                                        ? InfoData.Comment
                                                                                        : "Add Comment"}
                                                                                </span>
                                                                            </span>
                                                                            <span
                                                                                className="hover-text m-0 alignIcon"
                                                                                onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Remove", WAItemData.Title)}
                                                                            >
                                                                                <span className="svg__iconbox svg__icon--cross"></span>
                                                                                <span className="tooltip-text pop-left">
                                                                                    Remove user from bottleneck
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                        {/* This is used for Attentions  */}
                                        <div className="col mt-2 ps-0">
                                            <div className="input-group">
                                                <label className="form-label full-width ">
                                                    Attention
                                                </label>
                                                <input
                                                    type="text"
                                                    value={AttentionSearchKey}
                                                    className="form-control"
                                                    placeholder="Tag user for attention"
                                                    onChange={(e) => autoSuggestionsForApprover(e, "Attention")}
                                                />
                                                <span
                                                    className="input-group-text"
                                                    // onClick={() => openTaskStatusUpdatePopup(EditData, "Status")}
                                                    onClick={() => openBottleneckPopup("Attention")}
                                                >
                                                    <span
                                                        title="Add Comment"
                                                        className="svg__iconbox svg__icon--editBox"
                                                    ></span>
                                                </span>
                                                {AttentionSearchedData?.length > 0 ? (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                            {AttentionSearchedData.map((item: any) => {
                                                                return (
                                                                    <li
                                                                        className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                        key={item.id}
                                                                        onClick={() =>
                                                                            SelectApproverFromAutoSuggestion(
                                                                                item, "Attention"
                                                                            )
                                                                        }
                                                                    >
                                                                        <a>{item.NewLabel}</a>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                ) : null}
                                            </div>
                                            {WorkingAction?.map((WAItemData: any, ItemIndex: number) => {
                                                if (WAItemData.Title == "Attention" && WAItemData?.InformationData?.length > 0) {
                                                    return (
                                                        <div className="border p-1 mt-1">
                                                            {WAItemData?.InformationData?.map((InfoData: any, InfoIndex: number) => {
                                                                return (
                                                                    <div className="align-content-center alignCenter justify-content-between py-1">
                                                                        <div className="alignCenter">
                                                                            <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={InfoData.TaggedUsers?.Title}
                                                                                src={
                                                                                    InfoData.TaggedUsers.userImage !=
                                                                                        undefined &&
                                                                                        InfoData.TaggedUsers.userImage?.length >
                                                                                        0
                                                                                        ? InfoData.TaggedUsers.userImage
                                                                                        : ""
                                                                                }
                                                                            />
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
                                                                                    {InfoData.Comment != undefined &&
                                                                                        InfoData.Comment?.length > 1
                                                                                        ? InfoData.Comment
                                                                                        : "Add Comment"}
                                                                                </span>
                                                                            </span>
                                                                            <span
                                                                                className="hover-text m-0 alignIcon"
                                                                                onClick={() => BottleneckAndAttentionFunction(InfoData, InfoIndex, "Remove", WAItemData.Title)}
                                                                            >
                                                                                <span className="svg__iconbox svg__icon--cross"></span>
                                                                                <span className="tooltip-text pop-left">
                                                                                    Remove user from bottleneck
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                        <div className="full_width mt-2">
                                            <CommentCard
                                                siteUrl={siteUrls}
                                                listName={Items?.Items?.siteType}
                                                itemID={Items.Items.Id}
                                                AllListId={AllListIdData}
                                                Context={Context}
                                                counter={counter}
                                            />
                                        </div>
                                        <div className="pull-right">
                                            <span className="">
                                                <label className="form-check-label mx-2">
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
                                <div className="row py-3">
                                    <div
                                        className={
                                            IsShowFullViewImage != true
                                                ? "col-sm-3 padL-0 DashboardTaskPopup-Editor above"
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
                                                                    callBack={FlorarImageUploadComponentCallBack}
                                                                />
                                                            </div>
                                                        ) : null}
                                                        {TaskImages?.length == 0 && EditData?.Id != undefined ? (
                                                            <div>
                                                                <FlorarImageUploadComponent
                                                                    callBack={FlorarImageUploadComponentCallBack}
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
                                                    SmartLightPercentStatus={SmartLightPercentStatus}
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
                                                    SmartLightPercentStatus={SmartLightPercentStatus}
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
                            isServiceTask={ServicesTaskCheck}
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
                    {sendEmailComponentStatus ? (
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
                    ) : null}
                    {sendEmailNotification ? (
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
                    ) : null}
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
                    className={
                        ServicesTaskCheck
                            ? "modal-body mb-5 serviepannelgreena"
                            : "modal-body mb-5"
                    }
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
                                                                            Working This Week?
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
                                                                            Working Today?
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
                                                                    setEditData({
                                                                        ...EditData,
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
                                                                    // min={
                                                                    //     EditData.Created
                                                                    //         ? Moment(EditData.Created).format(
                                                                    //             "YYYY-MM-DD"
                                                                    //         )
                                                                    //         : ""
                                                                    // }
                                                                    defaultValue={
                                                                        EditData.StartDate
                                                                            ? Moment(EditData.StartDate).format(
                                                                                "YYYY-MM-DD"
                                                                            )
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
                                                                    // min={
                                                                    //     EditData.Created
                                                                    //         ? Moment(EditData.Created).format(
                                                                    //             "YYYY-MM-DD"
                                                                    //         )
                                                                    //         : ""
                                                                    // }
                                                                    defaultValue={
                                                                        EditData.DueDate
                                                                            ? Moment(EditData.DueDate).format(
                                                                                "YYYY-MM-DD"
                                                                            )
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
                                                                    // min={
                                                                    //     EditData.Created
                                                                    //         ? Moment(EditData.Created).format(
                                                                    //             "YYYY-MM-DD"
                                                                    //         )
                                                                    //         : ""
                                                                    // }
                                                                    defaultValue={
                                                                        EditData.CompletedDate
                                                                            ? Moment(EditData.CompletedDate).format(
                                                                                "YYYY-MM-DD"
                                                                            )
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
                                                        <div className="col-md-6 ps-0">
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
                                                                        value={SearchedServiceCompnentKey}
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
                                                                {SearchedServiceCompnentData?.length > 0 ? (
                                                                    <div className="SmartTableOnTaskPopup">
                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                            {SearchedServiceCompnentData.map(
                                                                                (Item: any) => {
                                                                                    return (
                                                                                        <li
                                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                            key={Item.id}
                                                                                            onClick={() =>
                                                                                                setSelectedServiceAndCompnentData(
                                                                                                    Item,
                                                                                                    "Single"
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <a className="siteColor">
                                                                                                {Item.Path}
                                                                                            </a>
                                                                                        </li>
                                                                                    );
                                                                                }
                                                                            )}
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
                                                                            if (
                                                                                type.Title != "Phone" &&
                                                                                type.Title != "Email Notification" &&
                                                                                type.Title != "Immediate" &&
                                                                                type.Title != "Approval" &&
                                                                                type.Title != "Email" &&
                                                                                type.Title != "Only Completed"
                                                                            ) {
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
                                                                                                    type.Title,
                                                                                                    type.Id
                                                                                                )
                                                                                            }
                                                                                            className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                                        ></span>
                                                                                    </div>
                                                                                );
                                                                            }
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
                                                                                                        className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
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
                                                            <div className="col">
                                                                <div className="col">
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input rounded-0"
                                                                            name="Phone"
                                                                            type="checkbox"
                                                                            checked={PhoneStatus}
                                                                            value={`${PhoneStatus}`}
                                                                            onClick={(e) =>
                                                                                CategoryChange(e, "Phone", 199)
                                                                            }
                                                                        />
                                                                        <label className="form-check-label">
                                                                            Phone
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={EmailStatus}
                                                                            value={`${EmailStatus}`}
                                                                            onClick={(e) =>
                                                                                CategoryChange(
                                                                                    e,
                                                                                    "Email Notification",
                                                                                    276
                                                                                )
                                                                            }
                                                                        />
                                                                        <label>Email Notification</label>
                                                                        <div className="form-check ms-2">
                                                                            <input
                                                                                className="form-check-input rounded-0"
                                                                                type="checkbox"
                                                                                checked={OnlyCompletedStatus}
                                                                                value={`${OnlyCompletedStatus}`}
                                                                                onClick={(e) =>
                                                                                    CategoryChange(
                                                                                        e,
                                                                                        "Only Completed",
                                                                                        565
                                                                                    )
                                                                                }
                                                                            />
                                                                            <label>Only Completed</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={ImmediateStatus}
                                                                            value={`${ImmediateStatus}`}
                                                                            onClick={(e) =>
                                                                                CategoryChange(e, "Immediate", 228)
                                                                            }
                                                                        />
                                                                        <label>Immediate</label>
                                                                    </div>
                                                                    {TaskCategoriesData != undefined &&
                                                                        TaskCategoriesData?.length > 0 ? (
                                                                        <div>
                                                                            {TaskCategoriesData?.map(
                                                                                (type: any, index: number) => {
                                                                                    if (
                                                                                        type.Title != "Phone" &&
                                                                                        type.Title !=
                                                                                        "Email Notification" &&
                                                                                        type.Title != "Immediate" &&
                                                                                        type.Title != "Approval" &&
                                                                                        type.Title != "Email" &&
                                                                                        type.Title != "Only Completed"
                                                                                    ) {
                                                                                        return (
                                                                                            <div className="block w-100">
                                                                                                <a
                                                                                                    className="wid90"
                                                                                                    style={{
                                                                                                        color: "#fff !important",
                                                                                                    }}
                                                                                                >
                                                                                                    {type.Title}
                                                                                                </a>
                                                                                                <span
                                                                                                    onClick={() =>
                                                                                                        removeCategoryItem(
                                                                                                            type.Title,
                                                                                                            type.Id
                                                                                                        )
                                                                                                    }
                                                                                                    className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"
                                                                                                ></span>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                                <div className="form-check mt-1">
                                                                    <label className="full-width">Approval</label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input rounded-0"
                                                                        name="Approval"
                                                                        checked={ApprovalStatus}
                                                                        value={`${ApprovalStatus}`}
                                                                        onClick={(e) =>
                                                                            CategoryChange(e, "Approval", 227)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="col ps-3 mb-1">
                                                                    <ul className="p-0 mt-1 list-none ">
                                                                        <li className="SpfxCheckRadio ">
                                                                            <input
                                                                                className="radio"
                                                                                name="ApprovalLevel"
                                                                                type="radio"
                                                                            />
                                                                            <label className="form-check-label">
                                                                                Normal Approval
                                                                            </label>
                                                                        </li>
                                                                        <li className="SpfxCheckRadio ">
                                                                            <input
                                                                                type="radio"
                                                                                className="radio"
                                                                                name="ApprovalLevel"
                                                                            />
                                                                            <label> Complex Approval</label>
                                                                        </li>
                                                                        <li className="SpfxCheckRadio">
                                                                            <input
                                                                                type="radio"
                                                                                className="radio"
                                                                                name="ApprovalLevel"
                                                                            />
                                                                            <label>Quick Approval</label>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                {ApprovalStatus ? (
                                                                    <div>
                                                                        <div className="col-12">
                                                                            <div className="input-group">
                                                                                <label className="form-label full-width"></label>
                                                                                {ApproverData != undefined &&
                                                                                    ApproverData.length > 0 ? (
                                                                                    <>
                                                                                        {ApproverData.map(
                                                                                            (Approver: any, index: number) => {
                                                                                                return (
                                                                                                    <div className="full-width replaceInput alignCenter">
                                                                                                        <a
                                                                                                            className="hreflink textDotted"
                                                                                                            target="_blank"
                                                                                                            data-interception="off"
                                                                                                        >
                                                                                                            {Approver.Title}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                    </>
                                                                                ) :
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Search Approver's Name Here"
                                                                                        value={ApproverSearchKey}
                                                                                        onChange={(e) =>
                                                                                            autoSuggestionsForApprover(
                                                                                                e,
                                                                                                "OnTaskPopup"
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                }
                                                                                <span
                                                                                    className="input-group-text mt--10"
                                                                                    onClick={OpenApproverPopupFunction}
                                                                                    title="Approver Data Popup"
                                                                                >
                                                                                    <span className="svg__iconbox svg__icon--editBox mt--10"></span>
                                                                                </span>
                                                                                {ApproverSearchedData?.length > 0 ? (
                                                                                    <div className="SmartTableOnTaskPopup">
                                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                            {ApproverSearchedData.map(
                                                                                                (item: any) => {
                                                                                                    return (
                                                                                                        <li
                                                                                                            className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                                            key={item.id}
                                                                                                            onClick={() =>
                                                                                                                SelectApproverFromAutoSuggestion(
                                                                                                                    item, "Approver"
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <a>{item.NewLabel}</a>
                                                                                                        </li>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                        </ul>
                                                                                    </div>
                                                                                ) : null}
                                                                            </div>



                                                                        </div>
                                                                        <div className="Approval-History-section my-2">
                                                                            {ApproverHistoryData != undefined &&
                                                                                ApproverHistoryData.length > 1 ? (
                                                                                <div className="border p-1">
                                                                                    <div className="siteBdrBottom">
                                                                                        <p className="mb-1">Previous Approver</p>
                                                                                    </div>
                                                                                    {ApproverHistoryData.map(
                                                                                        (HistoryData: any, index: any) => {
                                                                                            if (
                                                                                                index <
                                                                                                ApproverHistoryData.length - 1
                                                                                            ) {
                                                                                                return (
                                                                                                    <div
                                                                                                        className={
                                                                                                            index + 1 ==
                                                                                                                ApproverHistoryData.length - 1
                                                                                                                ? "alignCenter full-width justify-content-between py-1"
                                                                                                                : "alignCenter  border-bottom full-width justify-content-between py-1"
                                                                                                        }
                                                                                                    >
                                                                                                        <div>
                                                                                                            {HistoryData.ApprovedDate}
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <img
                                                                                                                title={
                                                                                                                    HistoryData.ApproverName
                                                                                                                }
                                                                                                                className="workmember ms-1"
                                                                                                                src={
                                                                                                                    HistoryData?.ApproverImage
                                                                                                                        ?.length > 0
                                                                                                                        ? HistoryData?.ApproverImage
                                                                                                                        : ""
                                                                                                                }
                                                                                                            />
                                                                                                        </div>

                                                                                                    </div>

                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    )}
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-6 ps-0 pe-0 pt-4">
                                                            <div className="time-status">
                                                                <div className="input-group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Enter Priority"
                                                                        value={
                                                                            EditData.PriorityRank
                                                                                ? EditData.PriorityRank
                                                                                : ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            ChangePriorityStatusFunction(e)
                                                                        }
                                                                    />
                                                                </div>
                                                                <ul className="p-0 mt-1">
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
                                                                                    setEditData({
                                                                                        ...EditData,
                                                                                        PriorityRank: 8,
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
                                                                                    setEditData({
                                                                                        ...EditData,
                                                                                        PriorityRank: 4,
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
                                                                                    setEditData({
                                                                                        ...EditData,
                                                                                        PriorityRank: 1,
                                                                                    })
                                                                                }
                                                                            />
                                                                            Low{" "}
                                                                        </label>
                                                                    </li>
                                                                </ul>
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
                                                                        Linked Portfolios
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
                                                                        placeholder="Search Portfolio Components"
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
                                                                                                className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                                key={Item.id}
                                                                                                onClick={() =>
                                                                                                    setSelectedServiceAndCompnentData(
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
                                                                                                className="wid90"
                                                                                                title={com.Title}
                                                                                                style={{
                                                                                                    color: "#fff !important",
                                                                                                }}
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
                                                                                                className="bg-light ml-auto hreflink svg__icon--cross svg__iconbox"
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
                                                                            {selectedProject.map((ProjectData: any) => {
                                                                                return (
                                                                                    <>
                                                                                        {ProjectData.Title != undefined ? (
                                                                                            <div className="replaceInput alignCenter w-100">
                                                                                                <a
                                                                                                    className="hreflink textDotted"
                                                                                                    target="_blank"
                                                                                                    title={ProjectData.Title}
                                                                                                    data-interception="off"
                                                                                                    href={`${siteUrls}/SitePages/Project-Management-Profile.aspx?ProjectId=${ProjectData.Id}`}
                                                                                                >
                                                                                                    {ProjectData.Title}
                                                                                                </a>
                                                                                            </div>
                                                                                        ) : null}
                                                                                    </>
                                                                                );
                                                                            })}
                                                                        </>
                                                                    ) : <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Search Project Here"
                                                                        value={ProjectSearchKey}
                                                                        onChange={(e) =>
                                                                            autoSuggestionsForProject(e)
                                                                        }
                                                                    />}

                                                                    <span
                                                                        className="input-group-text"
                                                                        onClick={() =>
                                                                            setProjectManagementPopup(true)
                                                                        }
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
                                                                                                SelectProjectFromAutoSuggestion([
                                                                                                    item,
                                                                                                ])
                                                                                            }
                                                                                        >
                                                                                            <a>{item?.Path}</a>
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
                                                                    <span className="svg__iconbox svg__icon--link"></span>
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    {AllListIdData.isShowSiteCompostion ? (
                                                        <div className="Sitecomposition">
                                                            <div className="dropdown">
                                                                <a className="sitebutton bg-fxdark d-flex justify-content-between">
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
                                                                        <span className="mx-2">
                                                                            Site Composition
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span
                                                                            className="svg__iconbox svg__icon--editBox hreflink"
                                                                            title="Edit Site Composition"
                                                                            onClick={() =>
                                                                                setSiteCompositionShow(true)
                                                                            }
                                                                        ></span>
                                                                    </div>
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
                                                                                                                ).toFixed(2)}
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
                                                            <label className="form-label full-width">
                                                                Status
                                                            </label>
                                                            <input
                                                                type="text"
                                                                maxLength={3}
                                                                placeholder="% Complete"
                                                                //  disabled={InputFieldDisable}
                                                                disabled
                                                                readOnly
                                                                className="bg-body form-control px-2"
                                                                // defaultValue={PercentCompleteCheck ? (EditData.PercentComplete != undefined && Math.floor(EditData.PercentComplete) === EditData.PercentComplete ? Number(EditData.PercentComplete).toFixed(0) : null) : (UpdateTaskInfo.PercentCompleteStatus ? UpdateTaskInfo.PercentCompleteStatus : null)}
                                                                value={PercentCompleteStatus}
                                                                onChange={(e) => StatusAutoSuggestion(e)}
                                                            />

                                                            <span
                                                                className="input-group-text"
                                                                title="Status Popup"
                                                                // onClick={() => openTaskStatusUpdatePopup(EditData, "Status")}
                                                                onClick={() =>
                                                                    setSmartMedaDataUsedPanel("Status")
                                                                }
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
                                                                    <label className="form-label full-width ">
                                                                        Time
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        maxLength={3}
                                                                        className="form-control"
                                                                        placeholder="Time"
                                                                        defaultValue={
                                                                            EditData.Mileage != null
                                                                                ? EditData.Mileage
                                                                                : ""
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
                                                                                    setEditData({
                                                                                        ...EditData,
                                                                                        Mileage: "15",
                                                                                    })
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
                                                                                    setEditData({
                                                                                        ...EditData,
                                                                                        Mileage: "60",
                                                                                    })
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
                                                                                    setEditData({
                                                                                        ...EditData,
                                                                                        Mileage: "240",
                                                                                    })
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
                                                                                    setEditData({
                                                                                        ...EditData,
                                                                                        Mileage: "480",
                                                                                    })
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
                                                        <div className="col mt-2 ps-0">
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
                                                                                    <img
                                                                                        className="ProirityAssignedUserPhoto me-2"
                                                                                        data-bs-placement="bottom"
                                                                                        title={
                                                                                            userDtl.Title ? userDtl.Title : ""
                                                                                        }
                                                                                        src={
                                                                                            userDtl.Item_x0020_Cover
                                                                                                ? userDtl.Item_x0020_Cover.Url
                                                                                                : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                                                        }
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 mb-2">
                                                        <div className="input-group ">
                                                            <label className="form-label full-width">
                                                                Estimated Task Time Details
                                                            </label>
                                                            <div
                                                                onChange={UpdateEstimatedTimeDescriptions}
                                                                className="full-width"
                                                            >
                                                                <textarea
                                                                    className="form-control p-1"
                                                                    name="Description"
                                                                    defaultValue={EstimatedDescription}
                                                                    value={EstimatedDescription}
                                                                    rows={1}
                                                                    placeholder="Estimated Time Description"
                                                                ></textarea>
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
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 mb-2">
                                                        {EditData?.EstimatedTimeDescriptionArray != null &&
                                                            EditData?.EstimatedTimeDescriptionArray?.length >
                                                            0 ? (
                                                            <div className="border p-1">
                                                                {EditData?.EstimatedTimeDescriptionArray?.map(
                                                                    (EstimatedTimeData: any, Index: any) => {
                                                                        return (
                                                                            <div>
                                                                                <div className="align-content-center border-bottom d-flex justify-content-between p-1">
                                                                                    <img
                                                                                        className="ProirityAssignedUserPhoto m-0"
                                                                                        title={EstimatedTimeData.UserName}
                                                                                        src={
                                                                                            EstimatedTimeData.UserImage !=
                                                                                                undefined &&
                                                                                                EstimatedTimeData.UserImage
                                                                                                    ?.length > 0
                                                                                                ? EstimatedTimeData.UserImage
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                    <span>
                                                                                        {EstimatedTimeData.Team
                                                                                            ? EstimatedTimeData.Team
                                                                                            : null}
                                                                                    </span>{" "}
                                                                                    |
                                                                                    <span>
                                                                                        Time :{" "}
                                                                                        {EstimatedTimeData.EstimatedTime
                                                                                            ? EstimatedTimeData.EstimatedTime >
                                                                                                1
                                                                                                ? EstimatedTimeData.EstimatedTime +
                                                                                                " hours"
                                                                                                : EstimatedTimeData.EstimatedTime +
                                                                                                " hour"
                                                                                            : "0 hour"}
                                                                                    </span>
                                                                                    <span className="hover-text m-0 alignIcon">
                                                                                        <span className="svg__iconbox svg__icon--info"></span>
                                                                                        <span className="tooltip-text pop-right">
                                                                                            {
                                                                                                EstimatedTimeData.EstimatedTimeDescription
                                                                                            }
                                                                                        </span>
                                                                                    </span>
                                                                                    {/* <span title="Edit" className="svg__iconbox svg__icon--editBox" onClick={() => alert("We are working on this feature. It will be live soon..")}></span> */}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                                <div className="text-end">
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
                                                <div className="col-md-4">
                                                    <div className="full_width ">
                                                        <CommentCard
                                                            siteUrl={siteUrls}
                                                            listName={Items?.Items?.siteType}
                                                            itemID={Items.Items.Id}
                                                            AllListId={AllListIdData}
                                                            Context={Context}
                                                            counter={counter}
                                                        />
                                                    </div>
                                                    <div className="pull-right">
                                                        <span className="">
                                                            <label className="form-check-label mx-2">
                                                                Waiting for HHHH response
                                                            </label>
                                                            <input
                                                                className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={EditData.waitForResponse}
                                                                value={EditData.waitForResponse}
                                                                onChange={(e) =>
                                                                    changeStatus(e, "waitForResponse")
                                                                }
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
                                                    callBack={FlorarImageUploadComponentCallBack}
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
                                                    SmartLightPercentStatus={SmartLightPercentStatus}
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
                                                    SmartLightPercentStatus={SmartLightPercentStatus}
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
                className={
                    ServicesTaskCheck
                        ? "hoverImageModal serviepannelgreena"
                        : "hoverImageModal"
                }
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
                    <div className={ServicesTaskCheck ? " serviepannelgreena" : ""}>
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
                                        // onClick={() => alert("We are working on it. This feature will be live soon .....")}
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
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
                    <div className="modal-body">
                        <FlorarImageUploadComponent
                            callBack={FlorarImageReplaceComponentCallBack}
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
                className="mb-2">
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
                    <div className="">
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
                                <div className="border full-width my-1 p-1">
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
                    <footer className="fixed-bottom">
                        <div className="align-items-center d-flex pull-right px-4 py-2">
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
// var Items = {
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