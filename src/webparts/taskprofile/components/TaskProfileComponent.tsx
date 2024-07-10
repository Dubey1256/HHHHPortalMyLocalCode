import React, { useState, useEffect, useRef } from 'react';
import * as moment from 'moment';
import {
    mergeStyleSets,
    FocusTrapCallout,
    FocusZone,
    FocusZoneTabbableElements,
    FontWeights,
    Stack,
    Text,
} from '@fluentui/react';
import { LuBellPlus } from "react-icons/lu";
import { Web } from "sp-pnp-js";
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as globalCommon from '../../../globalComponents/globalCommon'
import { BiInfoCircle } from 'react-icons/bi'
import SmartTimeTotal from './SmartTimeTotal';
import RelevantEmail from './ReleventEmails'
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import RelevantDocuments from './RelevantDocuments';
import SmartInformation from './SmartInformation';
import VersionHistoryPopup from '../../../globalComponents/VersionHistroy/VersionHistory';
import RadimadeTable from '../../../globalComponents/RadimadeTable'
import EmailComponenet from './emailComponent';
import AncTool from '../../../globalComponents/AncTool/AncTool'
import { myContextValue } from '../../../globalComponents/globalCommon'
import GlobalTooltip from '../../../globalComponents/Tooltip';
import { Tooltip } from "@fluentui/react-components";
import ApprovalHistoryPopup from '../../../globalComponents/EditTaskPopup/ApprovalHistoryPopup';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { ImReply } from 'react-icons/im';
import KeyDocuments from './KeyDocument';
import TaskDescriptions from './TaskDescriptionComponent';
import Uxdescriptions from './UXTaskDescription';
// import EODReportComponent from '../../../globalComponents/EOD Report Component/EODReportComponent';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import { EditableField } from "../../componentProfile/components/Portfoliop";

import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import CentralizedSiteComposition from '../../../globalComponents/SiteCompositionComponents/CentralizedSiteComposition';
import { IoHandRightOutline } from 'react-icons/io5';
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
import * as GlobalFunctionForUpdateItems from '../../../globalComponents/GlobalFunctionForUpdateItems'
import SmartPriorityHover from '../../../globalComponents/EditTaskPopup/SmartPriorityHover'; // Import your global common module
import ImageViewPanel from './ImageViewPanel';

var ClientTimeArray: any = [];

var AllListId: any;
var isShowTimeEntry: any;
// var isShowSiteCompostion: any;
var subchildcomment: any;
let countemailbutton: number;
var changespercentage = false;
var buttonId: any;
let truncatedTitle: any
let comments: any = []
let AllClientCategories: any;
let ProjectData: any = {}
let backGroundComment = true;
let listName: any = '';
let itemID = 0;
let masterTaskData: any = [];
let masterForHierarchy: any = [];
let allDataOfTask: any = [];
let smartMetaDataIcon: any = [];
let copytaskuser: any = [];
const CopyTaskProfile = (props: any) => {
    const propsValue = props?.props;
    const [TagConceptPaper, setTagConceptPaper] = useState([]);
    const [isopenProjectpopup, setisopenProjectpopup] = useState(false);
    const [isopencomonentservicepopup, setisopencomonentservicepopup] = useState(false);
    const [isShowSiteCompostion, setisShowSiteCompostion] = useState<any>('')
    const [showComposition, setshowComposition] = useState(true);
    const [SiteIcon, setSiteIcon] = useState('');
    const [OffshoreImageUrl, setOffshoreImageUrl] = useState([]);
    const [ApprovalStatus, setApprovalStatus] = useState(false);
    const [checkedImageData, SetCheckedImageData]: any = useState([])
    const [openComparePopup, SetOpenComparePopup]: any = useState(false)

    const [state, setState] = useState<any>({
        Result: {},
        isEditReplyModalOpen: false,
        replyTextComment: "",
        keydoc: [],
        FileDirRef: '',
        currentDataIndex: 0,
        buttonIdCounter: null,
        isCalloutVisible: false,
        currentArraySubTextIndex: null,
        ApprovalPointUserData: null,
        ApprovalPointCurrentParentIndex: null,
        ApprovalHistoryPopup: false,
        emailcomponentopen: false,
        emailComponentstatus: null,
        subchildParentIndex: null,
        showcomment_subtext: 'none',
        subchildcomment: null,
        TotalTimeEntry: "",
        showhideCommentBoxIndex: null,
        CommenttoUpdate: '',
        ReplyCommenttoUpdate: '',
        ApprovalCommentcheckbox: false,
        CommenttoPost: '',
        updateCommentText: {},
        updateReplyCommentText: {},
        // listName: '',
        // itemID: 0,
        isModalOpen: false,
        isEditModalOpen: false,
        imageInfo: {},
        Display: 'none',
        showcomment: 'none',
        updateComment: false,
        ShowEstimatedTimeDescription: false,
        isOpenEditPopup: false,
        TaskDeletedStatus: false,
        isopenversionHistory: false,
        isTimeEntry: false,
        emailStatus: "",
        countfeedback: 0,
        sendMail: false,
        showPopup: 'none',
        maincollection: [],
        breadCrumData: [],
        cmsTimeComponent: [],
        smarttimefunction: false,
        EditSiteCompositionStatus: false,
        showOnHoldComment: false,
        counter: 1,
    });

    const relevantDocRef = useRef(null);
    const smartInfoRef = useRef(null);
    const keyDocRef = useRef(null);

    const [taskUsers, setTaskUsers] = useState<any>([]);
    // const [smartMetaDataIcon, setSmartMetaDataIcon] = useState([]);
    // const [masterTaskData, setMasterTaskData] = useState<any>([]);
    // const [masterForHierarchy, setMasterForHierarchy] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [oldTaskLink, setOldTaskLink] = useState('');
    const [site, setSite] = useState('');

    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('taskId');
    const siteParam = params.get('Site');


    useEffect(() => {
        const capitalizeFLetter = (site: any) => site[0].toUpperCase() + site.slice(1);
        setSite(capitalizeFLetter(siteParam));

        setOldTaskLink(`${propsValue?.siteUrl}/SitePages/Task-Profile-Old.aspx?taskId=${taskId}&Site=${siteParam}`);

        // setState((prevState:any) => ({
        //     ...prevState,
        //     listName: capitalizeFLetter(siteParam),
        //     itemID: Number(taskId),
        // }));

        listName = capitalizeFLetter(siteParam);
        itemID = Number(taskId)

        GetAllComponentAndServiceData('Component');
    }, []);

    const GetAllComponentAndServiceData = async (ComponentType: any) => {
        let PropsObject = {
            MasterTaskListID: propsValue.MasterTaskListID,
            siteUrl: propsValue?.siteUrl,
            ComponentType: ComponentType,
            TaskUserListID: propsValue.TaskUserListID,
        };

        let CallBackData = await globalCommon.GetServiceAndComponentAllData(PropsObject);
        if (CallBackData?.AllData && CallBackData?.AllData.length > 0) {
            masterTaskData = masterTaskData.concat([...CallBackData?.FlatProjectData, ...CallBackData?.AllData])
            masterForHierarchy = masterForHierarchy.concat([...CallBackData?.FlatProjectData, ...CallBackData?.AllData])
            // setMasterTaskData((prevData:any) => [...prevData, ...CallBackData.FlatProjectData, ...CallBackData.AllData]);
            // setMasterForHierarchy((prevData:any) => [...prevData, ...CallBackData.FlatProjectData, ...CallBackData.AllData]);
            GetResult();
        } else {
            GetResult();
        }
    };

    // get task details
    const GetResult = async () => {
        await getsmartmetadataIcon();


        try {
            isShowTimeEntry = propsValue?.TimeEntry !== "" ? JSON.parse(propsValue?.TimeEntry) : "";
            setisShowSiteCompostion(propsValue?.SiteCompostion !== "" ? JSON.parse(propsValue?.SiteCompostion) : "");
        } catch (error) {
            console.log(error);
        }

        let web = new Web(propsValue?.siteUrl);
        let taskDetails: any = [];

        try {
            let listInfo = await web.lists.getByTitle(listName).get();
            taskDetails = await web.lists
                .getByTitle(listName)
                .items
                .getById(itemID)
                .select("ID", "Title", "Comments", "WorkingAction", "TotalTime", "Sitestagging", "ApproverHistory", "Approvee/Id", "Approvee/Title", "EstimatedTime", "SiteCompositionSettings", "TaskID", "Portfolio/Id", "Portfolio/Title", "Portfolio/PortfolioStructureID", "DueDate", "IsTodaysTask", 'EstimatedTimeDescription', "Approver/Id", "PriorityRank", "Approver/Title", "ParentTask/Id", "ParentTask/TaskID", "Project/Id", "Project/Title", "Project/PriorityRank", "Project/PortfolioStructureID", "ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Id", "TaskType/Title", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
                .expand("TeamMembers", "Project", "Approver", "Approvee", "ParentTask", "Portfolio", "SmartInformation", "AssignedTo", "TaskCategories", "Author", "ClientCategory", "ResponsibleTeam", "TaskType", "Editor", "AttachmentFiles")
                .get();

            AllListId = {
                MasterTaskListID: propsValue.MasterTaskListID,
                TaskUserListID: propsValue.TaskUserListID,
                SmartMetadataListID: propsValue.SmartMetadataListID,
                TaskTimeSheetListID: propsValue.TaskTimeSheetListID,
                DocumentsListID: propsValue.DocumentsListID,
                SmartInformationListID: propsValue.SmartInformationListID,
                PortFolioTypeID: propsValue.PortFolioTypeID,
                siteUrl: propsValue?.siteUrl,
                Context: propsValue.Context,
                TaskTypeID: propsValue.TaskTypeID,
                isShowTimeEntry: isShowTimeEntry,
                isShowSiteCompostion: propsValue?.SiteCompostion !== "" ? JSON.parse(propsValue?.SiteCompostion) : "",
                listName:listName
            };

            taskDetails["listName"] = listName;
            taskDetails["siteType"] = listName;
            taskDetails["siteUrl"] = propsValue?.siteUrl;
            taskDetails.TaskId = globalCommon.GetTaskId(taskDetails);

            let category = "";
            if (taskDetails["TaskCategories"] && taskDetails["TaskCategories"].length > 0) {
                taskDetails["TaskCategories"].forEach((item: any, index: any) => {
                    if (index === taskDetails["TaskCategories"].length - 1 || taskDetails["TaskCategories"].length === 1) {
                        category += item.Title;
                    } else {
                        category += item.Title + "; ";
                    }

                    if (category.search("Approval") >= 0) {
                        setApprovalStatus(true)
                    }
                });
            }

            var OffshoreComments: any = [];
            if (taskDetails["OffshoreComments"] != null) {
                let myarray: any = []
                myarray = JSON.parse(taskDetails["OffshoreComments"])
                if (myarray.length != 0) {
                    myarray.map((items: any) => {
                        if (items.AuthorImage != undefined && items.AuthorImage != "") {
                            items.AuthorImage = items.AuthorImage.replace(
                                "https://www.hochhuth-consulting.de",
                                "https://hhhhteams.sharepoint.com/sites/HHHH"
                            );
                            OffshoreComments.push(items);
                        }
                    });
                }

            }
            taskDetails["Categories"] = category;
            await GetTaskUsers(taskDetails);
            await GetSmartMetaData(taskDetails?.ClientCategory, taskDetails?.Sitestagging);

            const copycurrentuser = GetUserObject(propsValue?.userDisplayName)
            setCurrentUser(copycurrentuser);

            if (taskDetails["Comments"] != null && taskDetails["Comments"] != undefined) {
                try { comments = JSON.parse(taskDetails["Comments"]) }
                catch (e: any) {
                    console.log(e)
                }
            }
            let tempEstimatedArrayData: any;
            let TotalEstimatedTime: any = 0;
            if (taskDetails['EstimatedTimeDescription']?.length > 0) {
                tempEstimatedArrayData = JSON.parse(taskDetails['EstimatedTimeDescription']);
                if (tempEstimatedArrayData?.length > 0) {
                    tempEstimatedArrayData?.map((TimeDetails: any) => {
                        TotalEstimatedTime = TotalEstimatedTime + Number(TimeDetails.EstimatedTime);
                    })
                }
            } else {
                tempEstimatedArrayData = [];
            }
            const maxTitleLength: number = 75;


            if (taskDetails["Title"].length > maxTitleLength) {
                truncatedTitle = taskDetails["Title"].substring(0, maxTitleLength - 3) + "...";
            }

            let portfolio: any = [];
            if (taskDetails?.Portfolio != undefined) {
                portfolio = masterTaskData.filter((item: any) => item.Id == taskDetails?.Portfolio?.Id)
                if (portfolio?.length > 0 && portfolio[0]?.PortfolioType?.Color != undefined) {
                    document?.documentElement?.style?.setProperty('--SiteBlue', portfolio[0]?.PortfolioType?.Color);
                }
                loadTaggedConceptPaperDocument(portfolio[0])
            }

            if (taskDetails?.Project != undefined) {
                ProjectData = masterTaskData?.find((items: any) => items?.Id == taskDetails?.Project?.Id)
            }
            let feedBackData: any = JSON.parse(taskDetails["FeedBack"]);
            console.log(masterTaskData)
            let WorkingAction = taskDetails["WorkingAction"] != null ? JSON.parse(taskDetails["WorkingAction"]) : [];
            let Bottleneck: any = [];
            let Attention: any = [];
            let Phone: any = [];
            taskDetails["IsTodaysTask"] = false;

            if (WorkingAction?.length > 0) {
                WorkingAction?.map((Action: any) => {
                    if (Action?.Title == "Bottleneck") {
                        Bottleneck = Action?.InformationData;
                    }
                    if (Action?.Title == "Attention") {
                        Attention = Action?.InformationData;
                    }
                    if (Action?.Title == "Phone") {
                        Phone = Action?.InformationData;
                    }
                    if (Action?.Title == "WorkingDetails") {
                        let currentDate = moment(new Date()).format("DD/MM/YYYY")
                        Action?.InformationData?.map((isworkingToday: any) => {
                            if (isworkingToday?.WorkingDate == currentDate && isworkingToday?.WorkingMember?.length > 0) {
                                taskDetails["IsTodaysTask"] = true
                                isworkingToday?.WorkingMember?.map((itm: any) => {
                                    taskDetails['workingTodayUser'] = copytaskuser.filter((x: any) => x.AssingedToUser?.Id == itm?.Id)
                                })
                            }
                        })
                    }  
                })
            }
            let siteicon = GetSiteIcon(listName)
            let tempTask = {
                SiteIcon: siteicon,
                sitePage: propsValue.Context?._pageContext?._web?.title,
                Comments: comments != null && comments != undefined ? comments : "",
                Id: taskDetails["ID"],
                ID: taskDetails["ID"],
                Bottleneck: Bottleneck,
                Attention: Attention,
                Phone: Phone,
                SmartPriority: globalCommon.calculateSmartPriority(taskDetails),
                TaskTypeValue: '',
                projectPriorityOnHover: '',
                taskPriorityOnHover: taskDetails?.PriorityRank != undefined ? taskDetails?.PriorityRank : undefined,
                showFormulaOnHover: taskDetails?.showFormulaOnHover != undefined ? taskDetails?.showFormulaOnHover : undefined,
                Approvee: taskDetails?.Approvee != undefined ? taskUsers.find((userData: any) => userData?.AssingedToUser?.Id == taskDetails?.Approvee?.Id) : undefined,
                TaskCategories: taskDetails["TaskCategories"],
                Project: taskDetails["Project"],
                IsTodaysTask: taskDetails["IsTodaysTask"],
                PriorityRank: taskDetails["PriorityRank"],
                TotalTime: taskDetails["TotalTime"],
                EstimatedTime: taskDetails["EstimatedTime"],
                Sitestagging: taskDetails["Sitestagging"] != null ? JSON.parse(taskDetails["Sitestagging"]) : [],
                ApproverHistory: taskDetails["ApproverHistory"] != null ? JSON.parse(taskDetails["ApproverHistory"]) : "",
                OffshoreComments: OffshoreComments.length > 0 ? OffshoreComments.reverse() : null,
                OffshoreImageUrl: taskDetails["OffshoreImageUrl"] != null && JSON.parse(taskDetails["OffshoreImageUrl"]),
                workingTodayUser: taskDetails['workingTodayUser'],
                ClientCategory: taskDetails["ClientCategory"],
                siteType: taskDetails["siteType"],
                listName: taskDetails["listName"],
                siteUrl: taskDetails["siteUrl"],
                TaskId: taskDetails["TaskId"],
                TaskID: taskDetails["TaskID"],
                Title: taskDetails["Title"],
                Item_x0020_Type: 'Task',
                DueDate: taskDetails["DueDate"] != null ? moment(taskDetails["DueDate"]).format("DD/MM/YYYY") : null,
                Categories: taskDetails["Categories"],
                Status: taskDetails["Status"],
                StartDate: taskDetails["StartDate"] != null ? moment(taskDetails["StartDate"]).format("DD/MM/YYYY") : "",
                CompletedDate: taskDetails["CompletedDate"] != null ? moment(taskDetails["CompletedDate"])?.format("DD/MM/YYYY") : "",
                TeamLeader: taskDetails["ResponsibleTeam"] != null ? taskDetails["ResponsibleTeam"] : null,
                ResponsibleTeam: taskDetails["ResponsibleTeam"] != null ? taskDetails["ResponsibleTeam"] : null,
                TeamMembers: taskDetails.TeamMembers != null ? taskDetails.TeamMembers : null,
                AssignedTo: taskDetails["AssignedTo"] != null ? taskDetails["AssignedTo"] : null,
                ItemRank: taskDetails["ItemRank"],
                PercentComplete: (taskDetails["PercentComplete"] * 100),
                Priority: taskDetails["Priority"],
                Created: taskDetails["Created"],
                Author: GetUserObject(taskDetails["Author"]?.Title),
                component_url: taskDetails["ComponentLink"],
                BasicImageInfo: GetAllImages(JSON.parse(taskDetails["BasicImageInfo"])),
                FeedBack: JSON.parse(taskDetails["FeedBack"]),
                FeedBackBackup: JSON.parse(taskDetails["FeedBack"]),
                FeedBackArray: feedBackData != undefined && feedBackData?.length > 0 ? feedBackData[0]?.FeedBackDescriptions : [],
                TaskType: taskDetails["TaskType"] != null ? taskDetails["TaskType"] : '',
                TaskTypeTitle: taskDetails["TaskType"] != null ? taskDetails["TaskType"]?.Title : '',
                EstimatedTimeDescriptionArray: tempEstimatedArrayData,
                TotalEstimatedTime: TotalEstimatedTime,

                Portfolio: portfolio != undefined && portfolio.length > 0 ? portfolio[0] : undefined,
                PortfolioType: portfolio != undefined && portfolio.length > 0 ? portfolio[0]?.PortfolioType : undefined,
                Creation: taskDetails["Created"],
                Modified: taskDetails["Modified"],
                ModifiedBy: taskDetails["Editor"],
                listId: listInfo.Id,
                TaskLevel: taskDetails["TaskLevel"],
                Attachments: taskDetails["Attachments"],
                AttachmentFiles: taskDetails["AttachmentFiles"],
                SmartInformationId: taskDetails["SmartInformation"],
                Approver: taskDetails?.Approver != undefined ? copytaskuser.find((userData: any) => userData?.AssingedToUser?.Id == taskDetails?.Approver[0]?.Id) : "",
                ParentTask: taskDetails?.ParentTask,
            };

            if (tempTask?.FeedBack != null && tempTask?.FeedBack.length > 0) {
                tempTask?.FeedBack[0]?.FeedBackDescriptions?.map((items: any) => {
                    if (items?.Comments?.length > 0) {
                        items?.Comments?.map((comment: any) => {
                            comment.AuthorImage = comment?.AuthorImage?.replace(
                                "https://www.hochhuth-consulting.de",
                                "https://hhhhteams.sharepoint.com/sites/HHHH"
                            );
                        })
                    }
                })
            }

            if (tempTask?.FeedBack != null && tempTask?.FeedBack.length > 0) {
                tempTask?.FeedBack[0]?.FeedBackDescriptions?.map((items: any) => {
                    if (items?.Comments?.length > 0) {
                        items?.Comments?.map((comment: any) => {
                            comment.AuthorImage = comment?.AuthorImage?.replace(
                                "https://www.hochhuth-consulting.de",
                                "https://hhhhteams.sharepoint.com/sites/HHHH"
                            );
                        })
                    }
                })
            }

            console.log(tempTask);

            setState((prevState: any) => ({
                ...prevState,
                Result: tempTask,
                FileDirRef: taskDetails.AttachmentFiles.length > 0 ? taskDetails.AttachmentFiles[0].ServerRelativeUrl : "",
                TotalTimeEntry: taskDetails.TotalTime,
                // maincollection: globalCommon.MainCollection(taskDetails, propsValue?.siteUrl),
                // breadCrumData: globalCommon.BreadCrum(taskDetails, listName, propsValue?.siteUrl),
            }))

            updateResult(tempTask)

        } catch (error) {
            console.log(error);
        }
    };

    //getsmartmetadata icon
    const getsmartmetadataIcon = async () => {
        let web = new Web(propsValue?.siteUrl);
        try {
            let data = await web.lists
                .getById(propsValue.SmartMetadataListID)
                .items
                .select('Id', 'Title', 'Item_x0020_Cover', 'TaxType', 'siteName', 'siteUrl', 'Item_x005F_x0020_Cover')
                .filter("TaxType eq 'Sites'")
                .top(4000)
                .get();
            smartMetaDataIcon = data;
        } catch (error) {
            console.log(error);
        }
    };

    const GetTaskUsers = async (taskDetails: any) => {
        let web = new Web(propsValue?.siteUrl);
        let taskUsers: any = [];
        var taskDeatails = state?.Result;
        taskUsers = await web.lists
            // .getByTitle("Task Users")
            .getById(propsValue.TaskUserListID)
            .items
            .select('Id', 'Email', 'Approver/Id', 'Approver/Title', 'Approver/Name', 'Suffix', 'UserGroup/Id', 'UserGroup/Title', 'Team', 'Title', 'Item_x0020_Cover', 'Company', 'AssingedToUser/Title', 'AssingedToUser/Id',)
            .filter("ItemType eq 'User'")
            .expand('AssingedToUser,UserGroup,Approver')
            .get();

        taskUsers?.map((item: any) => {
            if (propsValue?.Context?.pageContext?._legacyPageContext?.userId === (item?.AssingedToUser?.Id) && item?.Company === "HHHH") {
                backGroundComment = false;
            }

        })
        setState((prevState: any) => ({
            ...prevState,
            Result: taskDeatails,
        }))
        copytaskuser = taskUsers
        setTaskUsers(taskUsers);

    }

    const GetSmartMetaData = async (ClientCategory: any, Sitestagging: any) => {
        let array2: any = [];
        ClientTimeArray = []
        if (((Sitestagging == null) && ClientTimeArray?.length == 0)) {
            var siteComp: any = {};
            siteComp.SiteName = listName,
                siteComp.ClienTimeDescription = 100,
                siteComp.SiteImages = GetSiteIcon(listName),
                ClientTimeArray.push(siteComp);
        }

        else if (Sitestagging != null) {
            ClientTimeArray = JSON.parse(Sitestagging);

        }
        let web = new Web(propsValue?.siteUrl);
        var smartMetaData = await web.lists

            .getById(propsValue.SmartMetadataListID)
            .items
            .select('Id', 'Title', 'IsVisible', 'TaxType', 'Parent/Id', 'Parent/Title', 'siteName', 'siteUrl', 'SmartSuggestions', "SmartFilters",)

            .expand('Parent').filter("TaxType eq 'Client Category'").top(4000)
            .get();
        if (smartMetaData?.length > 0) {
            AllClientCategories = smartMetaData;
        }

        if (ClientCategory?.length > 0) {
            ClientCategory?.map((item: any, index: any) => {
                smartMetaData?.map((items: any, index: any) => {
                    if (item?.Id == items?.Id) {
                        item.SiteName = items?.siteName;
                        array2.push(item)
                    }
                })
            })
            console.log(ClientCategory);
        }

        if (ClientTimeArray != undefined && ClientTimeArray.length > 0 && array2?.length > 0) {
            ClientTimeArray?.map((item: any) => {
                array2?.map((items: any) => {
                    if ((item?.SiteName == items?.SiteName) || (item?.Title == items?.SiteName)) {
                        item.SiteImages = GetSiteIcon(items?.SiteName)
                        if (item.ClientCategory == undefined) {
                            item.ClientCategory = [];
                            item.ClientCategory.push(items);
                        } else {
                            item.ClientCategory.push(items)
                        }

                    }

                })
            })
        } else {
            ClientTimeArray?.map((item: any) => {
                item.SiteImages = GetSiteIcon(item?.SiteName != undefined ? item?.SiteName : item?.Title)
            })

        }
    }
    const GetSiteIcon = (listName: string) => {
        console.log(state?.Result)
        try {
            if (listName != undefined) {
                let siteicon = '';
                smartMetaDataIcon?.map((icondata: any) => {
                    if (icondata.Title != undefined) {
                        if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x0020_Cover != undefined) {
                            siteicon = icondata.Item_x0020_Cover.Url
                        }
                        if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x005F_x0020_Cover != undefined) {
                            siteicon = icondata.Item_x005F_x0020_Cover.Url
                        }
                    }
                })

                return siteicon;
            }

        }
        catch (e) {
            console.log(e);
        }
    }

    const updateResult = async (tempTask: any) => {
        setState((prevState: any) => ({
            ...prevState,
            Result: tempTask,
            smarttimefunction: true
        }))

        if (tempTask.Portfolio !== undefined) {
            let AllItems: any = [];
            let breadCrumData1WithSubRow = await globalCommon?.getBreadCrumbHierarchyAllData(tempTask, AllListId, AllItems);
            console.log(breadCrumData1WithSubRow?.flatdata);
            let breadCrumData1 = breadCrumData1WithSubRow?.flatdata.reverse();
            setState((prevState: any) => ({
                ...prevState,
                Result: tempTask,
                breadCrumData: breadCrumData1
            }))
            getAllTaskData();
        }
    };
    const getAllTaskData = async () => {
        let breadCrumData1: any = [];
        let web = new Web(propsValue?.siteUrl);
        let results = [];
        results = await web.lists
            .getByTitle(listName)
            // .getById(propsValue.SiteTaskListID)
            .items
            .select("ID", "Title", "Comments", "ApproverHistory", "TaskID", "EstimatedTime", "Portfolio/Id", "Portfolio/Title", "Portfolio/PortfolioStructureID", "DueDate", "IsTodaysTask", 'EstimatedTimeDescription', "ParentTask/Id", "Project/Id", "Project/Title", "ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
            .expand("TeamMembers", "Project", "ParentTask", "Portfolio", "SmartInformation", "AssignedTo", "TaskCategories", "Author", "ClientCategory", "ResponsibleTeam", "TaskType", "Editor", "AttachmentFiles")
            .getAll(4000);

        for (let index = 0; index < results.length; index++) {
            let item = results[index];
            item.siteType = listName;
            item.SiteIcon = state?.Result?.SiteIcon;
            item.isLastNode = false;
            allDataOfTask.push(item);

        }
    };
    const GetUserObject = (username: any) => {
        let userDeatails = [];
        if (username != undefined) {
            let senderObject = copytaskuser.filter(function (user: any, i: any) {
                if (user?.AssingedToUser != undefined) {
                    return user?.AssingedToUser['Title'] == username
                }
            });
            if (senderObject?.length > 0) {
                userDeatails.push({
                    'Id': senderObject[0]?.AssingedToUser.Id,
                    'Name': senderObject[0]?.Email,
                    'Suffix': senderObject[0]?.Suffix,
                    'Title': senderObject[0]?.Title,
                    'userImage': senderObject[0]?.Item_x0020_Cover != null ? senderObject[0]?.Item_x0020_Cover.Url : ""
                })
            } if (senderObject.length == 0) {
                userDeatails.push({
                    'Title': username,
                    'userImage': ""
                })

            }
            return userDeatails;
        }

    }
    const GetAllImages = (BasicImageInfo: any) => {
        if (BasicImageInfo?.length > 0) {
            BasicImageInfo?.forEach(function (item: any) {
                if (item?.ImageUrl != undefined && item?.ImageUrl != "") {
                    item.ImageUrl = item?.ImageUrl?.replace(
                        "https://www.hochhuth-consulting.de",
                        "https://hhhhteams.sharepoint.com/sites/HHHH"
                    );
                }
            })
            return BasicImageInfo
        }
    }
    const showOnHoldReason = () => {
        setState((prevState: any) => ({
            ...prevState,
            showOnHoldComment: true,
        }))
    };

    const hideOnHoldReason = () => {
        setState((prevState: any) => ({
            ...prevState,
            showOnHoldComment: false,
        }))
    };

    const AncCallback = (type: any) => {
        switch (type) {
            case 'anc': {
                relevantDocRef?.current?.loadAllSitesDocuments()
                break
            }
            case 'smartInfo': {
                smartInfoRef?.current?.GetResult();
                break
            }
            default: {
                relevantDocRef?.current?.loadAllSitesDocuments()
                smartInfoRef?.current?.GetResult();
                keyDocRef?.current?.loadAllSitesDocumentsEmail()
                break
            }
        }
    }

    //open the model
    const OpenModal = (e: any, item: any) => {
        if (item.Url != undefined) {
            item.ImageUrl = item?.Url;
        }

        e.preventDefault();
        setState((prevState: any) => ({
            ...prevState,
            isModalOpen: true,
            imageInfo: item,
            showPopup: 'block'
        }))
    }

    const CloseModal = (e: any) => {
        e.preventDefault();
        setState((prevState: any) => ({
            ...prevState,
            isModalOpen: false,
            isEditModalOpen: false,
            isEditReplyModalOpen: false,
            imageInfo: {},

            showPopup: 'none'
        }))
    }
    const Closecommentpopup = () => {
        setState((prevState: any) => ({
            ...prevState,
            isModalOpen: false,
            isEditModalOpen: false,
            isEditReplyModalOpen: false,
            imageInfo: {},

            showPopup: 'none'
        }))

    }
    const showhideComposition = () => {
        if (showComposition) {
            setshowComposition(false)

        } else {
            setshowComposition(true)
        }

    }
    const showhideEstimatedTime = () => {
        if (state.ShowEstimatedTimeDescription) {
            setState((prevState: any) => ({
                ...prevState,
                ShowEstimatedTimeDescription: false
            }))
        } else {
            setState((prevState: any) => ({
                ...prevState,
                ShowEstimatedTimeDescription: true
            }))
        }

    }

    const onPost = async () => {
        let web = new Web(propsValue?.siteUrl);
        const i = await web.lists
            .getByTitle(listName)
            .items
            .getById(itemID)
            .update({
                FeedBack: JSON.stringify(state?.Result?.FeedBack),

            });
        setState((prevState: any) => ({
            ...prevState,
            updateComment: true
        }))

    }

    const OpenEditPopUp = () => {
        setState((prevState: any) => ({
            ...prevState,
            isOpenEditPopup: true
        }))
    }

    const CallBack = (FunctionType: any) => {
        if (FunctionType == "Save") {
            setState((prevState: any) => ({
                ...prevState,
                isOpenEditPopup: false,
                EditSiteCompositionStatus: false,
                counter: state.counter + 1
            }))
            // setState({                
            //     isOpenEditPopup: false,
            //     EditSiteCompositionStatus: false,
            //     counter: state.counter + 1
            // })
            setTimeout(() => {
                GetResult();
            }, 1000);
        }
        if (FunctionType == "Delete") {
            setState((prevState: any) => ({
                ...prevState,
                isOpenEditPopup: false,
                TaskDeletedStatus: true,
            }))
            window.location.href = `${propsValue?.siteUrl}/SitePages/TaskDashboard.aspx`;;
        }
        if (FunctionType == "Close") {
            setState((prevState: any) => ({
                ...prevState,
                isOpenEditPopup: false,
                EditSiteCompositionStatus: false,
            }))
        }
    }

    const approvalcallback = async () => {
        setState((prevState: any) => ({
            ...prevState,
            sendMail: false,
            emailStatus: ""
        }))
        GetResult();
    }


    //========================= mail functionality==============
    const sendEmail = (item: any) => {
        var data = state?.Result;
        if (item == "Approved") {
            // data.PercentComplete = 3
            // var data = state.Result;
            // setState({
            //   Result: data,
            // }),
            let TeamMembers: any = []
            TeamMembers.push(state.Result?.TeamMembers[0]?.Id)
            let changeData: any = {
                TeamMembers: TeamMembers,
                AssignedTo: []
            }
            ChangeApprovalMember(changeData).then((data: any) => {
                var data = state?.Result;
            }).catch((error) => {
                console.log(error)
            });
        }
        else {

            let TeamMembers: any = []
            TeamMembers.push(state?.Result?.TeamMembers[0]?.Id)
            TeamMembers.push(state?.Result?.Approvee != undefined ? state?.Result?.Approvee?.AssingedToUser?.Id : state?.Result?.Author[0]?.Id)
            let changeData: any = {

                TeamMembers: TeamMembers,
                AssignedTo: [state?.Result?.Approvee != undefined ? state?.Result?.Approvee?.AssingedToUser?.Id : state?.Result?.Author[0]?.Id]
            }


            ChangeApprovalMember(changeData).then((data: any) => {
                var data = state?.Result;
            }).catch((error) => {
                console.log(error)
            });
        }

        setState((prevState: any) => ({
            ...prevState,
            Result: data,
            emailStatus: item,
            sendMail: true,
        }))

    }

    const checkforMail = async (allfeedback: any, item: any, tempData: any) => {
        var countApprove = 0;
        var countreject = 0;
        console.log(allfeedback);
        if (allfeedback != null && allfeedback != undefined) {
            var isShowLight = 0;
            let ApproveCount = 0;
            let RejectCount = 0;
            var NotisShowLight = 0
            if (allfeedback != undefined) {
                allfeedback?.map((items: any) => {

                    if (items?.isShowLight != undefined && items?.isShowLight != "") {
                        isShowLight = isShowLight + 1;
                        if (items.isShowLight == "Approve") {
                            ApproveCount += 1;
                            changespercentage = true;
                            countApprove = countApprove + 1;
                        }
                        else {
                            countreject = countreject + 1;
                        }
                        if (items?.isShowLight == "Reject") {
                            RejectCount += 1;
                        }

                    }
                    if (items?.Subtext != undefined && items?.Subtext?.length > 0) {
                        items?.Subtext?.map((subtextItems: any) => {
                            if (subtextItems?.isShowLight != undefined && subtextItems?.isShowLight != "") {
                                isShowLight = isShowLight + 1;
                                if (subtextItems?.isShowLight == "Approve") {
                                    ApproveCount += 1;
                                    changespercentage = true;
                                    countApprove = countApprove + 1;
                                } else {
                                    countreject = countreject + 1;
                                }
                                if (subtextItems?.isShowLight == "Reject") {
                                    RejectCount += 1;
                                }

                            }
                        })
                    }
                })
            }
            if (state?.Result?.PercentComplete < 5) {
                await changepercentageStatus(item, tempData, countApprove,);
            }

            if (isShowLight > NotisShowLight) {
                if (RejectCount == 1 && item == "Reject") {
                    countemailbutton = 0;
                    setState((prevState: any) => ({
                        ...prevState,
                        emailcomponentopen: true,
                        emailComponentstatus: item
                    }))
                }
                if (countApprove == 0) {
                    let TeamMembers: any = []
                    TeamMembers.push(state?.Result?.TeamMembers[0]?.Id)
                    TeamMembers.push(state?.Result?.Approvee != undefined ? state?.Result?.Approvee?.AssingedToUser?.Id : state?.Result?.Author[0]?.Id)
                    let changeData: any = {

                        TeamMembers: TeamMembers,
                        AssignedTo: [state?.Result?.Approvee != undefined ? state?.Result?.Approvee?.AssingedToUser?.Id : state?.Result?.Author[0]?.Id]
                    }
                    ChangeApprovalMember(changeData);


                }
                if (countApprove == 1) {
                    let TeamMembers: any = []
                    TeamMembers.push(currentUser?.[0]?.Id)

                    let changeData: any = {

                        TeamMembers: TeamMembers,
                        AssignedTo: []
                    }
                    ChangeApprovalMember(changeData).then((data: any) => {
                        GetResult();
                    }).catch((error: any) => {
                        console.log(error)
                    });


                }
                if (ApproveCount == 1 && item == "Approve") {
                    countemailbutton = 0;
                    setState((prevState: any) => ({
                        ...prevState,
                        emailcomponentopen: true,
                        emailComponentstatus: item
                    }))
                } else {
                    countemailbutton = 1;
                    setState((prevState: any) => ({
                        ...prevState,
                        emailcomponentopen: false,
                    }))

                }

            }
        }
    }

    const ChangeApprovalMember = (changeData: any) => {
        return new Promise<void>((resolve, reject) => {
            const web = new Web(propsValue?.siteUrl);
            web.lists.getByTitle(state?.Result?.listName)

                .items.getById(state?.Result?.Id).update({
                    TeamMembersId: {
                        results: changeData?.TeamMembers

                    },
                    AssignedToId: {
                        results: changeData?.AssignedTo

                    },

                }).then((res: any) => {
                    resolve(res)
                    console.log("team membersetsucessfully", res);
                })
                .catch((err: any) => {
                    reject(err)
                    console.log(err.message);
                });
        })


    }

    //========================= mail functionality End ============== 

    const handleUpdateComment = (e: any) => {
        setState((prevState: any) => ({
            ...prevState,
            CommenttoUpdate: e.target.value
        }))
    }
    const updateComment = () => {
        let txtComment = state.CommenttoUpdate

        if (txtComment != '') {
            let temp: any = {
                AuthorImage: currentUser != null && currentUser.length > 0 ? currentUser[0]['userImage'] : "",
                AuthorName: currentUser != null && currentUser.length > 0 ? currentUser[0]['Title'] : "",
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment
            };

            if (state?.isEditReplyModalOpen) {
                var EditReplyData = state?.updateReplyCommentText;
                if (EditReplyData?.isSubtextComment) {
                    let feedback = state?.Result?.FeedBack[0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Subtext[EditReplyData?.indexOfSubtext].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
                    feedback.Title = state?.CommenttoUpdate;
                } else {
                    let feedback = state?.Result?.FeedBack[0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
                    feedback.Title = state?.CommenttoUpdate;
                }
            } else {
                if (state?.updateCommentText?.data?.isApprovalComment) {
                    temp.isApprovalComment = state?.updateCommentText?.data?.isApprovalComment;
                    temp.isShowLight = state?.updateCommentText?.data?.isShowLight
                    temp.ApproverData = state?.updateCommentText?.data?.ApproverData;
                }
                if (state?.updateCommentText?.isSubtextComment) {

                    state.Result.FeedBack[0].FeedBackDescriptions[state?.updateCommentText?.parentIndexOpeneditModal].Subtext[state.updateCommentText['indexOfSubtext']]['Comments'][state.updateCommentText['indexOfUpdateElement']].Title = temp.Title

                }
                else {

                    state.Result.FeedBack[0].FeedBackDescriptions[state?.updateCommentText?.parentIndexOpeneditModal]["Comments"][state?.updateCommentText['indexOfUpdateElement']].Title = temp.Title
                }
            }
            onPost();
        }
        setState((prevState: any) => ({
            ...prevState,
            isEditModalOpen: false,
            updateCommentText: {},
            CommenttoUpdate: '',
            isEditReplyModalOpen: false,
            currentDataIndex: 0,
            replyTextComment: '',
            updateReplyCommentText: {}
        }))
    }

    const SubtextPostButtonClick = (j: any, parentIndex: any) => {
        let txtComment = state.CommenttoPost;
        if (txtComment != '') {
            let temp: any = {
                AuthorImage: currentUser != null && currentUser.length > 0 ? currentUser[0]['userImage'] : "",
                AuthorName: currentUser != null && currentUser.length > 0 ? currentUser[0]['Title'] : "",

                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            if (state.ApprovalCommentcheckbox) {
                temp.isApprovalComment = state.ApprovalCommentcheckbox
                temp.isShowLight = state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight != undefined ? state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight : ""
                var approvalDataHistory = {
                    ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                    Id: currentUser[0].Id,
                    ImageUrl: currentUser[0].userImage,
                    Title: currentUser[0].Title,
                    isShowLight: state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight != undefined ? state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight : ""
                }

                if (temp.ApproverData != undefined) {
                    temp.ApproverData.push(approvalDataHistory)
                } else {
                    temp.ApproverData = [];
                    temp.ApproverData.push(approvalDataHistory);
                }

            }
            //Add object in feedback

            if (state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentIndex]["Subtext"][j].Comments != undefined) {
                state.Result.FeedBack[0].FeedBackDescriptions[parentIndex]["Subtext"][j].Comments.unshift(temp);
            }
            else {
                state.Result.FeedBack[0].FeedBackDescriptions[parentIndex]["Subtext"][j]['Comments'] = [temp];
            }
            (document.getElementById('txtCommentSubtext') as HTMLTextAreaElement).value = '';
            // setState({
            //     ...state,
            //     showcomment_subtext: 'none',
            //     CommenttoPost: '',
            // });           
            setState((prevState: any) => ({
                ...prevState,
                showcomment_subtext: 'none',
                CommenttoPost: '',
                ApprovalCommentcheckbox: false,
                subchildcomment: null,
                subchildParentIndex: null
            }))
            onPost();
        } else {
            alert('Please input some text.')
        }

    }
    const showhideCommentBoxOfSubText = (j: any, parentIndex: any) => {
        if (state.showcomment_subtext == 'none') {
            setState((prevState: any) => ({
                ...prevState,
                showcomment_subtext: 'block',
                subchildcomment: j,
                subchildParentIndex: parentIndex,
                showcomment: 'none',
                showhideCommentBoxIndex: null
            }))
        }
        else {
            setState((prevState: any) => ({
                ...prevState,
                showcomment_subtext: 'block',
                subchildcomment: j,
                subchildParentIndex: parentIndex,
                showcomment: 'none',
                showhideCommentBoxIndex: null
            }))
        }
    }
    //================================ taskfeedbackcard End===============

    //===============traffic light function ==================
    const changeTrafficLigth = async (index: any, item: any) => {
        console.log(index);
        console.log(item);
        if ((state?.Result?.Approver?.AssingedToUser?.Id == currentUser[0]?.Id) || (state?.Result?.Approver?.Approver[0]?.Id == currentUser[0]?.Id)) {
            let tempData: any = state?.Result?.FeedBack[0]?.FeedBackDescriptions[index];
            var approvalDataHistory = {
                ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Id: currentUser[0].Id,
                ImageUrl: currentUser[0].userImage,
                Title: currentUser[0].Title,
                isShowLight: item
            }
            tempData.isShowLight = item;
            if (tempData.ApproverData != undefined && tempData.ApproverData.length > 0) {

                tempData.ApproverData.push(approvalDataHistory);
            } else {
                tempData.ApproverData = [];
                tempData.ApproverData.push(approvalDataHistory)
            }

            var data: any = state?.Result;

            if (tempData?.ApproverData != undefined && tempData?.ApproverData?.length > 0) {
                tempData?.ApproverData?.forEach((ba: any) => {
                    if (ba.isShowLight == 'Reject') {
                        ba.Status = 'Rejected by'
                    }
                    if (ba.isShowLight == 'Approve') {
                        ba.Status = 'Approved by'

                    }
                    if (ba.isShowLight == 'Maybe') {
                        ba.Status = 'For discussion with'
                    }
                })
            }

            console.log(tempData);
            console.log(state?.Result?.FeedBack[0]?.FeedBackDescriptions);
            await onPost();
            if (state?.Result?.FeedBack != undefined) {
                await checkforMail(state?.Result?.FeedBack[0].FeedBackDescriptions, item, tempData);

            }
        }
    }

    const changeTrafficLigthsubtext = async (parentindex: any, subchileindex: any, status: any) => {
        console.log(parentindex);
        console.log(subchileindex);
        console.log(status);
        if ((state?.Result?.Approver?.AssingedToUser?.Id == currentUser[0]?.Id) || (state?.Result?.Approver?.Approver[0]?.Id == currentUser[0]?.Id)) {
            let tempData: any = state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentindex];
            var approvalDataHistory = {
                ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Id: currentUser[0].Id,
                ImageUrl: currentUser[0].userImage,
                Title: currentUser[0].Title,
                isShowLight: status
            }
            tempData.Subtext[subchileindex].isShowLight = status;
            if (tempData?.Subtext[subchileindex]?.ApproverData != undefined && tempData?.Subtext[subchileindex]?.ApproverData?.length > 0) {

                tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory);
            } else {
                tempData.Subtext[subchileindex].ApproverData = [];
                tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory)
            }
            var data: any = state?.Result;
            if (tempData?.Subtext[subchileindex] != undefined && tempData?.Subtext[subchileindex]?.ApproverData != undefined) {
                tempData?.Subtext[subchileindex]?.ApproverData?.forEach((ba: any) => {
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

            console.log(tempData);
            console.log(state?.Result?.FeedBack[0]?.FeedBackDescriptions);
            console.log(state?.emailcomponentopen)
            await onPost();

            if (state?.Result?.FeedBack != undefined) {
                await checkforMail(state?.Result?.FeedBack[0].FeedBackDescriptions, status, tempData?.Subtext[subchileindex]);
            }
        }
    }
    //===============traffic light function End ==================

    //================percentage changes ==========================
    const changepercentageStatus = async (percentageStatus: any, pervious: any, countApprove: any) => {
        console.log(percentageStatus)
        console.log(pervious)
        console.log(countApprove)
        let percentageComplete;
        let changespercentage1;
        if ((countApprove == 1 && percentageStatus == "Approve" && (pervious?.isShowLight == "Approve" || pervious?.isShowLight != undefined))) {
            changespercentage = true;
        }
        if ((countApprove == 0 && (percentageStatus == "Reject" || percentageStatus == "Maybe") && (pervious?.isShowLight == "Reject" && pervious?.isShowLight != undefined))) {
            changespercentage = false;
        }
        if ((countApprove == 0 && percentageStatus == "Approve" && (pervious.isShowLight == "Reject" || pervious.isShowLight == "Maybe") && pervious.isShowLight != undefined)) {
            changespercentage = true;
        }
        if ((countApprove == 0 && percentageStatus == "Maybe" && (pervious?.isShowLight == "Reject" || pervious?.isShowLight == "Maybe") && pervious.isShowLight != undefined)) {
            changespercentage = false;
        }

        let taskStatus = "";
        if (changespercentage == true) {
            percentageComplete = 0.03;
            changespercentage1 = 3
            taskStatus = "Approved"

        }
        if (changespercentage == false) {
            percentageComplete = 0.02;
            changespercentage1 = 2
            taskStatus = "Follow Up"
        }
        state.Result.PercentComplete = changespercentage1
        state.Result.Status = taskStatus
        const web = new Web(propsValue?.siteUrl);
        await web.lists.getByTitle(state?.Result?.listName)
            .items.getById(state?.Result?.Id).update({
                PercentComplete: percentageComplete,
                Status: taskStatus,
            }).then((res: any) => {
                console.log(res);
            })
            .catch((err: any) => {
                console.log(err.message);
            });
    }
    //================percentage changes End ==========================


    // ========approval history popup and callback =================
    const ShowApprovalHistory = (items: any, parentIndex: any, subChildIndex: any) => {
        console.log("currentUser is a Approval function cxall ", items)
        setState((prevState: any) => ({
            ...prevState,
            ApprovalHistoryPopup: true,
            ApprovalPointUserData: items,
            ApprovalPointCurrentParentIndex: parentIndex + 1,
            currentArraySubTextIndex: subChildIndex != null ? subChildIndex + 1 : null
        }))

    }
    const ApprovalHistoryPopupCallBack = () => {
        setState((prevState: any) => ({
            ...prevState,
            ApprovalHistoryPopup: false,
            ApprovalPointUserData: '',
            ApprovalPointCurrentParentIndex: null,
            currentArraySubTextIndex: null
        }))
    }
    // ========approval history popup and callback End =================

    /// ==============reply comment function ====================
    const updateReplyMessagesFunction = (e: any) => {
        console.log(e.target.value)
        setState((prevState: any) => ({
            ...prevState,
            replyTextComment: e.target.value
        }))

    }
    const openReplycommentPopup = (i: any, k: any) => {
        setState((prevState: any) => ({
            ...prevState,
            currentDataIndex: i + "" + k,
            isCalloutVisible: true
        }))
    }
    const openReplySubcommentPopup = (i: any, j: any, k: any) => {
        setState((prevState: any) => ({
            ...prevState,
            currentDataIndex: +i + '' + j + k,
            isCalloutVisible: true
        }))
    }

    ///// ==========save reeply comment=======================
    const SaveReplyMessageFunction = () => {
        let txt: any = state.replyTextComment;
        console.log(state.currentDataIndex)
        let txtComment: any = state.replyTextComment;
        if (txtComment != '') {

            var temp: any =
            {
                AuthorImage: currentUser != null && currentUser?.length > 0 ? currentUser[0]['userImage'] : "",
                AuthorName: currentUser != null && currentUser.length > 0 ? currentUser[0]['Title'] : "",
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            let index: any = state.currentDataIndex.split('');

            if (index.length == 2) {
                let parentIndex = parseInt(index[0])
                let commentIndex = parseInt(index[1])
                let feedback = state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentIndex].Comments[commentIndex];

                if (feedback.ReplyMessages == undefined) {
                    feedback.ReplyMessages = []
                    feedback.ReplyMessages.push(temp)
                } else {
                    feedback.ReplyMessages.push(temp)
                }

            }
            if (index.length == 3) {
                let parentIndex = parseInt(index[0])
                let subcomentIndex = parseInt(index[1])
                let commentIndex = parseInt(index[2])
                let feedback = state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentIndex].Subtext[subcomentIndex].Comments[commentIndex];

                if (feedback.ReplyMessages == undefined) {
                    feedback.ReplyMessages = []
                    feedback.ReplyMessages.push(temp)
                } else {
                    feedback.ReplyMessages.push(temp)
                }

            }
            console.log(temp)
            onPost();

            setState((prevState: any) => ({
                ...prevState,
                isCalloutVisible: false,
                replyTextComment: "",
                currentDataIndex: 0
            }))


        } else {
            alert('Please input some text.')
        }

    }
    // =========clearReplycomment===========
    const clearReplycomment = (isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any, replyIndex: any) => {
        if (confirm("Are you sure, you want to delete currentUser?")) {
            if (isSubtextComment) {
                state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentindex]["Subtext"][indexOfSubtext]?.Comments[indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1)
            } else {
                state?.Result?.FeedBack[0]?.FeedBackDescriptions[parentindex]["Comments"][indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1);
            }
            onPost();
        }

    }

    //===========EditReplyComment===============

    const EditReplyComment = (comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any, replyIndex: any) => {
        setState((prevState: any) => ({
            ...prevState,
            isEditReplyModalOpen: true,
            CommenttoUpdate: comment?.Title,
            // replyTextComment:comment?.Title,
            updateReplyCommentText: {
                'comment': comment?.Title,
                'indexOfUpdateElement': indexOfUpdateElement,
                'indexOfSubtext': indexOfSubtext,
                'isSubtextComment': isSubtextComment,
                'replyIndex': replyIndex,
                "data": comment,
                "parentIndexOpeneditModal": parentIndex
            }
        }))
    }
    const onRenderCustomHeadereditcomment = () => {
        return (
            <>
                <div className='subheading' >
                    Update Comment
                </div>
                <GlobalTooltip ComponentId='1683' />
            </>
        );
    };
    const contextCall = (data: any, path: any, releventKey: any) => {
        if (data != null && path != null) {
            setState((prevState: any) => ({
                ...prevState,
                keydoc: data,
                FileDirRef: path
            }))
        }
        if (releventKey) {
            relevantDocRef?.current?.loadAllSitesDocuments()
        }
        else if (data == null && path == null && releventKey == false) {
            keyDocRef?.current?.loadAllSitesDocumentsEmail()
            relevantDocRef?.current?.loadAllSitesDocuments()
        }
    };

    //****** remove extra space in folora editor  */

    const cleanHTML = (html: any, folora: any, index: any) => {
        if (html != undefined) {
            html = globalCommon?.replaceURLsWithAnchorTags(html)
            const div = document.createElement('div');
            div.innerHTML = html;
            const paragraphs = div.querySelectorAll('p');
            // Filter out empty <p> tags
            paragraphs.forEach((p) => {
                if (p.innerText.trim() === '') {
                    p.parentNode.removeChild(p); // Remove empty <p> tags
                }
            });
            div.innerHTML = div.innerHTML.replace(/\n/g, '<br>')  // Convert newlines to <br> tags first
            div.innerHTML = div.innerHTML.replace(/(?:<br\s*\/?>\s*)+(?=<\/?[a-z][^>]*>)/gi, '');


            return div.innerHTML;
        }

    };

    //******* End ****************************/
    const callbackTotalTime = ((Time: any) => {
        setState((prevState: any) => ({
            ...prevState,
            TotalTimeEntry: Time
        }))
    })

    //********** */ Inline editing start************
    const handleFieldChange = (fieldName: any) => (e: any) => {
        let Priority: any;

        setState((prevState: any) => ({
            Result: {
                ...prevState.Result,
                [fieldName]: fieldName == "ItemRank" ? e : e.target.value,

            }
        }));
    };
    const TaskProfilePriorityCallback = (priorityValue: any) => {
        console.log("TaskProfilePriorityCallback")
        let resultData = state?.Result;
        resultData.PriorityRank = Number(priorityValue);
        resultData.SmartPriority = ""

        setState((prevState: any) => ({
            Result: {
                ...prevState.Result,
                PriorityRank: Number(priorityValue),
                ["SmartPriority"]: globalCommon?.calculateSmartPriority(resultData),
            }
        }));

    }

    const inlineCallBack = (item: any) => {
        let resultData = state?.Result;
        resultData.Categories = item?.Categories;
        resultData.SmartPriority = ""
        resultData.TaskCategories = item?.TaskCategories
        setState((prevState: any) => ({
            Result: {
                ...prevState.Result,
                Categories: item?.Categories,
                ["SmartPriority"]: globalCommon?.calculateSmartPriority(resultData),

            }
        }));
        console.log(item)
    }

    const openPortfolioPopupFunction = (change: any) => {
        if (change == "Portfolio") {
            setisopencomonentservicepopup(true)
        } else {
            setisopenProjectpopup(true)
        }
    }
    const loadTaggedConceptPaperDocument = async (Documents: any) => {
        let web = new Web(AllListId?.siteUrl);
        try {
            let query = "Id,Title,PriorityRank,DocumentType,Year,Body,Item_x0020_Cover,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl&$expand=Author,Editor,Portfolios"
            await web.lists.getById(AllListId?.DocumentsListID)
                .items.select(query)
                .filter(`(Portfolios/Id eq ${Documents?.ID})`)
                .getAll()
                .then((Data: any[]) => {
                    var tagdoc: any = Data.filter((item: any) => item.DocumentType === "Concept Paper")
                    setTagConceptPaper(tagdoc)
                })

        } catch (e: any) {
            console.log(e)
        }
    }
    const ComponentServicePopupCallBack = async (DataItem: any, Type: any, functionType: any) => {
        console.log(DataItem)
        console.log(Type)
        console.log(functionType)
        if (DataItem.length > 0) {
            loadTaggedConceptPaperDocument(DataItem[0])
        }
        let dataUpdate: any;
        let selectedCC: any = [];
        let Sitestagging: any
        let cctag: any = []
        let TeamMembersId: any = []
        let AssignedToId: any = [];
        let ResponsibleTeamId: any = [];
        if (functionType == "Save") {
            if (isopencomonentservicepopup) {
                // DataItem[0]?.ClientCategory?.map((cc: any) => {
                //   if (cc.Id != undefined) {
                //     let foundCC = AllClientCategories?.find((allCC: any) => allCC?.Id == cc.Id)
                //     if (state?.Result?.siteType?.toLowerCase() == 'shareweb') {
                //       selectedCC.push(cc.Id)
                //       cctag.push(foundCC)
                //     } else if (state?.Result?.siteType?.toLowerCase() == foundCC?.siteName?.toLowerCase()) {
                //       selectedCC.push(cc.Id)
                //       cctag.push(foundCC)
                //     }
                //   }
                // })
                if (DataItem[0]?.Sitestagging != undefined) {
                    if (state?.Result?.siteType?.toLowerCase() == "shareweb") {
                        var sitetag = JSON.parse(DataItem[0]?.Sitestagging)
                        sitetag?.map((sitecomp: any) => {
                            if (sitecomp.Title != undefined && sitecomp.Title != "" && sitecomp.SiteName == undefined) {
                                sitecomp.SiteName = sitecomp.Title
                                let ClientCategory = cctag?.filter((data: any) => data?.siteName == sitecomp.Title)
                                if (ClientCategory.length > 0) {
                                    sitecomp.ClientCategory = ClientCategory
                                }

                            }

                        })
                        Sitestagging = JSON.stringify(sitetag)
                        ClientTimeArray = [];

                        ClientTimeArray = sitetag;
                    }
                    else {
                        var siteComp: any = {};
                        siteComp.SiteName = state?.Result?.siteType,
                            siteComp.SiteImages = GetSiteIcon(listName),
                            siteComp.localSiteComposition = true
                        siteComp.ClienTimeDescription = 100,
                            siteComp.Date = moment(new Date().toLocaleString()).format("DD-MM-YYYY");

                        Sitestagging = JSON?.stringify([siteComp]);
                        ClientTimeArray = [];
                        siteComp.ClientCategory = cctag
                        ClientTimeArray = [siteComp]
                    }


                }
                DataItem?.map((portfolio: any) => {
                    portfolio?.ClientCategory?.map((cc: any) => {
                        if (cc.Id != undefined) {
                            let foundCC = AllClientCategories?.find((allCC: any) => allCC?.Id == cc.Id)
                            if (state?.Result?.siteType?.toLowerCase() == 'shareweb') {
                                selectedCC.push(cc.Id)
                                cctag.push(foundCC)
                            } else if (state?.Result?.siteType?.toLowerCase() == foundCC?.siteName?.toLowerCase()) {
                                selectedCC.push(cc.Id)
                                cctag.push(foundCC)
                            }
                        }
                    })
                    if (portfolio?.AssignedTo?.length > 0) {
                        portfolio?.AssignedTo?.map((assignData: any) => {
                            AssignedToId.push(assignData.Id)
                        })
                    }
                    if (portfolio?.ResponsibleTeam?.length > 0) {
                        portfolio?.ResponsibleTeam?.map((resp: any) => {
                            ResponsibleTeamId.push(resp.Id)
                        })
                    }
                    if (portfolio?.TeamMembers?.length > 0) {
                        portfolio?.TeamMembers?.map((teamMemb: any) => {
                            TeamMembersId.push(teamMemb.Id)
                        })
                    }

                })

                setState((prevState: any) => ({
                    Result: {
                        ...prevState.Result,
                        Portfolio: DataItem[0],
                        ResponsibleTeam: DataItem[0]?.ResponsibleTeam,
                        TeamMembers: DataItem[0]?.TeamMembers,
                        AssignedTo: DataItem[0]?.AssignedTo,

                    }
                }))
                dataUpdate = {
                    PortfolioId: DataItem[0]?.Id || null,
                    ClientCategoryId: { results: selectedCC },
                    Sitestagging: Sitestagging,

                    TeamMembersId: {
                        results: TeamMembersId

                    },
                    AssignedToId: {
                        results: AssignedToId

                    },
                    ResponsibleTeamId: {
                        results: ResponsibleTeamId

                    },

                }
                updateProjectComponentServices(dataUpdate)
            } else {

                ProjectData = DataItem[0];
                if (DataItem[0]?.Item_x0020_Type == "Project" || DataItem[0]?.Item_x0020_Type == "Sprint") {
                    let resultData = state.Result;
                    resultData.Project = DataItem[0]
                    resultData.SmartPriority = "";
                    dataUpdate = {
                        ProjectId: DataItem[0]?.Id
                    }
                    setState((prevState: any) => ({
                        Result: {
                            ...prevState.Result,
                            ["SmartPriority"]: globalCommon?.calculateSmartPriority(resultData),

                        }
                    }));

                    // console.log(childData)
                    if (state.Result?.TaskType?.Title != "Task") {
                        await globalCommon?.AwtGroupingAndUpdatePrarticularColumn(state.Result, allDataOfTask, dataUpdate)
                    }

                }
                else {
                    dataUpdate = {
                        ProjectId: null
                    }
                }
                updateProjectComponentServices(dataUpdate)
            }
        }
        setisopencomonentservicepopup(false)
        setisopenProjectpopup(false);
    }
    const updateProjectComponentServices = async (dataUpdate: any) => {


        let web = new Web(propsValue?.siteUrl);
        await web.lists
            .getByTitle(listName)
            // .getById(currentUser.propsValue.SiteTaskListID)
            .items
            .getById(itemID)
            .update(dataUpdate).then(async (data: any) => {
                console.log(data)
                GetResult()

            }).catch((error: any) => {
                console.log(error)
            });


    }
    const SendRemindernotifications = (InfoData: any, ActionType: any) => {
        if (InfoData?.NotificationSend == true) {
            let RequiredData: any = {
                ReceiverName: InfoData.TaggedUsers?.Title,
                sendUserEmail: [InfoData.TaggedUsers?.Email],
                Context: propsValue?.Context,
                ActionType: ActionType,
                ReasonStatement: InfoData.Comment,
                UpdatedDataObject: state.Result,
                RequiredListIds: AllListId
            }
            GlobalFunctionForUpdateItems.MSTeamsReminderMessage(RequiredData);
            alert("The reminder has been sent to the user.");
        } else {
            alert(`This user has not been tagged as a ${ActionType} yet, so you cannot send a reminder now.`);
        }
    }

    //********** */ Inline editing End************

    const CheckImageData = (value: boolean, imgeData: any) => {
        console.log(value)

        let copyCheckedImageData = checkedImageData
        if (value) {
            copyCheckedImageData.push(imgeData)
        }
        else {
            copyCheckedImageData=copyCheckedImageData?.filter((data: any) => data.ImageName != imgeData.ImageName)
        }

        SetCheckedImageData([...copyCheckedImageData])
    }

    const openImageCompare = () => {
        SetOpenComparePopup(true)

    }
    return (
        <>
            <myContextValue.Provider value={{ ...myContextValue, FunctionCall: contextCall, keyDoc: state.keydoc, FileDirRef: state.FileDirRef, user: taskUsers, ColorCode: state?.Result?.Portfolio?.PortfolioType?.Color }}>
                <div className='taskprofilesection'>
                    <section className='ContentSection'> {state.breadCrumData != undefined &&
                        <div className='row m-0'>
                            <div className="col-sm-12 p-0 ">

                                <ul className="webbreadcrumbs ">
                                    {state?.Result?.Portfolio == undefined && state.breadCrumData?.length == 0 && state?.Result?.Title != undefined ?
                                        <>
                                            <li >
                                                <a target="_blank" data-interception="off" href={`${state?.Result?.siteUrl}/SitePages/Dashboard.aspx`}> <span>Dashboard</span> </a> <span><SlArrowRight /></span>
                                            </li>


                                            <li>
                                                <a  >
                                                    <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                        <span title={state?.Result?.Title}>{truncatedTitle?.length > 0 ? truncatedTitle : state?.Result?.Title}</span>
                                                        {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                                                            {state?.Result?.Title}
                                                        </span>}
                                                    </span>

                                                </a>
                                            </li></> : <>

                                            {state?.Result?.Portfolio != null && state.breadCrumData.length > 0 &&
                                                <li >
                                                    {state?.Result?.Portfolio != null &&
                                                        <a className="fw-bold" style={{ color: state?.Result?.Portfolio?.PortfolioType?.Color }} target="_blank" data-interception="off" href={`${state?.Result?.siteUrl}/SitePages/Team-Portfolio.aspx`}>Team Portfolio</a>
                                                    }
                                                    <span><SlArrowRight /></span>
                                                </li>
                                            }
                                            {state.breadCrumData?.map((breadcrumbitem: any, index: any) => {
                                                return <>
                                                    {breadcrumbitem?.siteType == "Master Tasks" && <li>
                                                        <a style={{ color: breadcrumbitem?.PortfolioType?.Color }} target="_blank" data-interception="off" href={`${state?.Result?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${breadcrumbitem?.Id}`}>{breadcrumbitem?.Title}</a>
                                                        <span><SlArrowRight /></span>
                                                    </li>}
                                                    {breadcrumbitem?.siteType !== "Master Tasks" && <li>
                                                        <a target="_blank" data-interception="off" href={`${state?.Result?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${breadcrumbitem?.Id}&Site=${breadcrumbitem?.siteType} `}>{breadcrumbitem?.Title}</a>
                                                        {breadcrumbitem?.Id != itemID && <span> <SlArrowRight /></span>}
                                                    </li>}
                                                    {state.breadCrumData.length == index &&
                                                        <li>
                                                            <a  >
                                                                <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                    <span>{truncatedTitle?.length > 0 ? truncatedTitle : state?.Result?.Title}</span>
                                                                    {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                                                                        {state?.Result?.Title}
                                                                    </span>}
                                                                </span>

                                                            </a>

                                                        </li>
                                                    }
                                                </>
                                            })
                                            }
                                        </>}
                                </ul>
                            </div>
                        </div>}
                        <section className='row m-0'>
                            <h2 className="heading d-flex p-0 justify-content-between align-items-center task-title">
                                <span className='alignCenter'>
                                    {state?.Result?.SiteIcon != "" && <img className="imgWid29 pe-1 " title={state?.Result?.siteType} src={state?.Result?.SiteIcon} />}
                                    {state?.Result?.SiteIcon === "" && <img className="imgWid29 pe-1 " src="" />}
                                    <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                        <span >{truncatedTitle?.length > 0 ? truncatedTitle : state?.Result?.Title}</span>
                                        {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                                            {state?.Result?.Title}
                                        </span>}
                                    </span>
                                    <a className="hreflink" title='Edit' onClick={() => OpenEditPopUp()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                                    </a>
                                    {state?.Result?.Approver != undefined && state?.Result?.Approver != "" && state?.Result?.Categories?.includes("Approval") && ((currentUser != undefined && currentUser?.length > 0 && state.Result?.Approver?.AssingedToUser?.Id == currentUser[0]?.Id) || (currentUser != undefined && currentUser?.length > 0 && state?.Result?.Approver?.Approver?.length > 0 && state?.Result?.Approver?.Approver[0]?.Id == currentUser[0]?.Id)) && state?.Result?.Status == "For Approval" &&
                                        state?.Result?.PercentComplete == 1 ? <span><button onClick={() => sendEmail("Approved")} className="btn btn-success ms-3 mx-2">Approve</button><span><button className="btn btn-danger" onClick={() => sendEmail("Rejected")}>Reject</button></span></span> : null
                                    }
                                    {currentUser != undefined && state.sendMail && state.emailStatus != "" && <EmailComponenet approvalcallback={() => { approvalcallback() }} Context={propsValue.Context} emailStatus={state.emailStatus} currentUser={currentUser} items={state.Result} />}
                                </span>
                                {/* {(state?.Result?.siteUrl?.includes('SP')) ? (
                                    <span className="text-end fs-6">
                                        <a className='oldtitle' target='_blank' data-interception="off" href={oldTaskLink} style={{ cursor: "pointer", fontSize: "14px" }}>Old Task Profile</a>
                                    </span>
                                ) : null} */}

                            </h2>
                        </section>
                        <section>
                            <div className='row m-0'>
                                <div className="col-9">
                                    <div className="team_member row">
                                        <div className='col-md-8 taskidsection'>
                                            <div className='bg-Ff p-2 boxshadow  rounded-1 row'>
                                                <div className='col-md-6 p-0'>
                                                    <dl>
                                                        <dt className='bg-Fa'>Task Id</dt>
                                                        <dd className='bg-Ff position-relative'>
                                                            <ReactPopperTooltipSingleLevel CMSToolId={state?.Result?.TaskId} row={state.Result} singleLevel={true} masterTaskData={masterForHierarchy} AllSitesTaskData={allDataOfTask} AllListId={AllListId} />

                                                        </dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>Due Date</dt>
                                                        <dd className='bg-Ff'>
                                                            <EditableField
                                                                listName={state?.Result?.listName}
                                                                itemId={state?.Result?.Id}
                                                                fieldName="DueDate"
                                                                value={
                                                                    state?.Result?.DueDate != undefined
                                                                        ? state?.Result?.DueDate
                                                                        : ""
                                                                }
                                                                TaskProfilePriorityCallback={null}
                                                                onChange={handleFieldChange("DueDate")}
                                                                type="Date"
                                                                web={AllListId?.siteUrl}
                                                            />

                                                        </dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>Start Date</dt>
                                                        <dd className='bg-Ff'>{state?.Result?.StartDate != undefined ? state?.Result?.StartDate : ""}</dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>Completion Date</dt>
                                                        <dd className='bg-Ff'> {state?.Result?.CompletedDate != undefined ? state?.Result?.CompletedDate : ""}</dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa' title="Task Id">Categories</dt>

                                                        <dd className='bg-Ff text-break'>
                                                            <div className='alignCenter'>
                                                                <InlineEditingcolumns
                                                                    AllListId={AllListId}
                                                                    callBack={inlineCallBack}
                                                                    columnName='TaskCategories'
                                                                    item={state?.Result}
                                                                    TaskUsers={taskUsers}
                                                                    pageName={'portfolioprofile'}
                                                                />

                                                            </div>


                                                        </dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>Item Rank</dt>
                                                        <dd className='bg-Ff'>
                                                            <EditableField
                                                                listName={state?.Result?.listName}
                                                                itemId={state?.Result?.Id}
                                                                fieldName="ItemRank"
                                                                value={
                                                                    state?.Result?.ItemRank != undefined
                                                                        ? state?.Result?.ItemRank
                                                                        : ""
                                                                }
                                                                TaskProfilePriorityCallback={null}
                                                                onChange={handleFieldChange("ItemRank")}
                                                                type=""
                                                                web={AllListId?.siteUrl}
                                                            />

                                                        </dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>SmartPriority</dt>

                                                        <dd className='bg-Ff'>
                                                            <div className="boldClable" >
                                                                <span className={state?.Result?.SmartPriority != undefined ? "hover-text hreflink m-0 r sxsvc" : "hover-text hreflink m-0 cssc"}>
                                                                    <>{state?.Result?.SmartPriority != undefined ? state?.Result?.SmartPriority : 0}</>
                                                                    <span className="tooltip-text pop-right">
                                                                        {state?.Result?.showFormulaOnHover != undefined ?
                                                                            <SmartPriorityHover editValue={state.Result} /> : ""}
                                                                    </span>
                                                                </span>
                                                            </div>

                                                        </dd>
                                                    </dl>


                                                    {isShowTimeEntry && <dl>
                                                        <dt className='bg-Fa'>SmartTime Total</dt>
                                                        <dd className='bg-Ff'>
                                                            <span className="me-1 alignCenter  pull-left"> {state.smarttimefunction ? <SmartTimeTotal AllListId={AllListId} callbackTotalTime={(data: any) => callbackTotalTime(data)} props={state.Result} Context={propsValue.Context} allTaskUsers={taskUsers} /> : null}</span>
                                                        </dd>

                                                    </dl>}

                                                </div>
                                                <div className='col-md-6 p-0'>
                                                    <dl>
                                                        <dt className='bg-Fa'>Team Members</dt>

                                                        <dd className='bg-Ff'>
                                                            <ShowTaskTeamMembers
                                                                props={state.Result}
                                                                TaskUsers={taskUsers}
                                                            />


                                                        </dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>Status</dt>
                                                        <dd className='bg-Ff'>{state?.Result?.PercentComplete != undefined ? state?.Result?.PercentComplete?.toFixed(0) : 0} <span className='me-2'>%</span> {state?.Result?.Status}<br></br>
                                                            {state?.Result?.ApproverHistory != undefined && state?.Result?.ApproverHistory.length > 1 && state?.Result?.Categories?.includes("Approval") ?
                                                                <span style={{ fontSize: "smaller" }}>Approved by
                                                                    <img className="workmember" title={state?.Result?.ApproverHistory[state.Result?.ApproverHistory.length - 2]?.ApproverName} src={(state.Result?.ApproverHistory[state.Result?.ApproverHistory?.length - 2]?.ApproverImage != null) ? (state.Result.ApproverHistory[state.Result.ApproverHistory.length - 2]?.ApproverImage) : (state.Result?.ApproverHistory[state.Result.ApproverHistory.length - 2]?.ApproverSuffix)}></img></span>

                                                                : null}</dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>Working Today</dt>
                                                        <dd className='bg-Ff position-relative' >{state?.Result?.workingTodayUser != undefined && state?.Result?.workingTodayUser?.map((user: any) => {
                                                            return (
                                                                <span className='tooltipbox'><img className='workmember' title={user?.Title} src={user?.Item_x0020_Cover?.Url} /></span>
                                                            )
                                                        })}
                                                        </dd>
                                                    </dl>
                                                    <dl>
                                                        <dt className='bg-Fa'>Priority</dt>
                                                        <dd className='bg-Ff'>

                                                            {state?.Result?.Categories != undefined && state?.Result?.Categories?.indexOf('On-Hold') >= 0 ? (
                                                                <div className="hover-text">
                                                                    <IoHandRightOutline
                                                                        onMouseEnter={showOnHoldReason}
                                                                        onMouseLeave={hideOnHoldReason}
                                                                    />
                                                                    <span className="tooltip-text tooltipboxs  pop-right">
                                                                        {state.showOnHoldComment &&
                                                                            comments.map((item: any, index: any) =>
                                                                                item.CommentFor !== undefined &&
                                                                                    item.CommentFor === "On-Hold" ? (
                                                                                    <div key={index}>
                                                                                        <span className="siteColor H-overTitle">
                                                                                            Task On-Hold by{" "}
                                                                                            <span>
                                                                                                {
                                                                                                    item.AuthorName
                                                                                                }
                                                                                            </span>{" "}
                                                                                            <span>
                                                                                                {
                                                                                                    moment(item.Created).format('DD/MM/YY')
                                                                                                }
                                                                                            </span>
                                                                                        </span>
                                                                                        {item.CommentFor !== undefined &&
                                                                                            item.CommentFor !== "" ? (
                                                                                            <div key={index}>
                                                                                                <span dangerouslySetInnerHTML={{ __html: cleanHTML(item?.Description, "folora", index) }}>
                                                                                                </span>
                                                                                            </div>
                                                                                        ) : null}
                                                                                    </div>
                                                                                ) : null
                                                                            )}
                                                                    </span>
                                                                </div>
                                                            ) : null}
                                                            <EditableField
                                                                // key={index}
                                                                listName={state?.Result?.listName}
                                                                itemId={state?.Result?.Id}
                                                                fieldName="Priority"
                                                                value={
                                                                    state?.Result?.PriorityRank != undefined
                                                                        ? state?.Result?.PriorityRank
                                                                        : ""
                                                                }
                                                                TaskProfilePriorityCallback={(priorityValue: any) => TaskProfilePriorityCallback(priorityValue)}
                                                                onChange={handleFieldChange("Priority")}
                                                                type=""
                                                                web={AllListId?.siteUrl}
                                                            />
                                                        </dd>
                                                    </dl>
                                                    {/* ////////////////this is Bottleneck section/////////////// */}

                                                    <dl>
                                                        <dt className='bg-Fa'>Bottleneck</dt>
                                                        <dd className='bg-Ff'>
                                                            {state?.Result?.Bottleneck?.length > 0 && state?.Result?.Bottleneck?.map((BottleneckData: any) => {
                                                                return (
                                                                    <div className="align-content-center alignCenter justify-content-between py-1">
                                                                        <div className="alignCenter">
                                                                            {BottleneckData.TaggedUsers.userImage != undefined && BottleneckData.TaggedUsers.userImage.length > 0 ? <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={BottleneckData.TaggedUsers?.Title}
                                                                                src={BottleneckData.TaggedUsers.userImage} />
                                                                                :
                                                                                <span title={BottleneckData.TaggedUsers?.Title != undefined ? BottleneckData.TaggedUsers?.Title : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser "></span>
                                                                            }
                                                                            <span className="ms-1">{BottleneckData?.TaggedUsers?.Title}</span>
                                                                        </div>

                                                                        <div className="alignCenter">
                                                                            <span
                                                                                className="hover-text me-1"
                                                                                onClick={() =>
                                                                                    SendRemindernotifications(BottleneckData, "Bottleneck")}
                                                                            >
                                                                                <LuBellPlus />
                                                                                <span className="tooltip-text pop-left">
                                                                                    Send reminder notifications
                                                                                </span>
                                                                            </span>
                                                                            {BottleneckData.Comment != undefined &&
                                                                                BottleneckData.Comment?.length > 1 && <span
                                                                                    className="m-0 img-info hover-text"

                                                                                >
                                                                                    <span className="svg__iconbox svg__icon--comment"></span>
                                                                                    <span className="tooltip-text pop-left">
                                                                                        {BottleneckData.Comment}
                                                                                    </span>
                                                                                </span>}

                                                                        </div>
                                                                    </div>
                                                                )

                                                            })}

                                                        </dd>
                                                    </dl>
                                                    {/* ////////////////this is Attention section/////////////// */}

                                                    <dl>
                                                        <dt className='bg-Fa'>Attention</dt>
                                                        <dd className='bg-Ff'>
                                                            {state?.Result?.Attention?.length > 0 && state?.Result?.Attention?.map((AttentionData: any) => {
                                                                return (
                                                                    <div className="align-content-center alignCenter justify-content-between py-1">
                                                                        <div className="alignCenter">
                                                                            {AttentionData.TaggedUsers.userImage != undefined && AttentionData.TaggedUsers.userImage.length > 0 ? <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={AttentionData.TaggedUsers?.Title}
                                                                                src={AttentionData.TaggedUsers.userImage} />
                                                                                :
                                                                                <span title={AttentionData.TaggedUsers?.Title != undefined ? AttentionData.TaggedUsers?.Title : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser "></span>
                                                                            }
                                                                            <span className="ms-1">{AttentionData?.TaggedUsers?.Title}</span>
                                                                        </div>

                                                                        <div className="alignCenter">
                                                                            <span
                                                                                className="hover-text me-1"
                                                                                onClick={() =>
                                                                                    SendRemindernotifications(AttentionData, "Attention")}
                                                                            >
                                                                                <LuBellPlus />
                                                                                <span className="tooltip-text pop-left">
                                                                                    Send reminder notifications
                                                                                </span>
                                                                            </span>
                                                                            {AttentionData.Comment != undefined &&
                                                                                AttentionData.Comment?.length > 1 && <span
                                                                                    className="m-0 img-info hover-text"

                                                                                >
                                                                                    <span className="svg__iconbox svg__icon--comment"></span>
                                                                                    <span className="tooltip-text pop-left">
                                                                                        {AttentionData.Comment}
                                                                                    </span>
                                                                                </span>}

                                                                        </div>
                                                                    </div>
                                                                )

                                                            })}

                                                        </dd>
                                                    </dl>
                                                    {/* ////////////////this is phone section/////////////// */}
                                                    <dl>
                                                        <dt className='bg-Fa'>Phone</dt>
                                                        <dd className='bg-Ff'>
                                                            {state?.Result?.Phone?.length > 0 && state?.Result?.Phone?.map((PhoneData: any) => {
                                                                return (
                                                                    <div className="align-content-center alignCenter justify-content-between py-1">
                                                                        <div className="alignCenter">
                                                                            {PhoneData.TaggedUsers.userImage != undefined && PhoneData.TaggedUsers.userImage.length > 0 ? <img
                                                                                className="ProirityAssignedUserPhoto m-0"
                                                                                title={PhoneData.TaggedUsers?.Title}
                                                                                src={PhoneData.TaggedUsers.userImage} />
                                                                                :
                                                                                <span title={PhoneData.TaggedUsers?.Title != undefined ? PhoneData.TaggedUsers?.Title : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser "></span>
                                                                            }
                                                                            <span className="ms-1">{PhoneData?.TaggedUsers?.Title}</span>
                                                                        </div>

                                                                        <div className="alignCenter">
                                                                            <span
                                                                                className="hover-text me-1"
                                                                                onClick={() =>
                                                                                    SendRemindernotifications(PhoneData, "Phone")}
                                                                            >
                                                                                <LuBellPlus />
                                                                                <span className="tooltip-text pop-left">
                                                                                    Send reminder notifications
                                                                                </span>
                                                                            </span>
                                                                            {PhoneData.Comment != undefined &&
                                                                                PhoneData.Comment?.length > 1 && <span
                                                                                    className="m-0 img-info hover-text"

                                                                                >
                                                                                    <span className="svg__iconbox svg__icon--comment"></span>
                                                                                    <span className="tooltip-text pop-left">
                                                                                        {PhoneData.Comment}
                                                                                    </span>
                                                                                </span>}

                                                                        </div>
                                                                    </div>
                                                                )

                                                            })}

                                                        </dd>
                                                    </dl>
                                                    {/* ////////////////this is Creaded by section/////////////// */}
                                                    <dl>
                                                        <dt className='bg-Fa'>Created</dt>
                                                        <dd className='bg-Ff alignCenter'>
                                                            {state?.Result?.Created != undefined && state?.Result?.Created != null ? moment(state?.Result?.Created).format("DD/MMM/YYYY") : ""}
                                                            {state?.Result?.Author != null && state?.Result?.Author.length > 0 &&
                                                                <a title={state?.Result?.Author[0].Title} className='alignCenter ms-1'>
                                                                    {state?.Result?.Author[0].userImage !== "" && <img className="workmember hreflink " src={state?.Result?.Author[0].userImage} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, state?.Result?.Author[0]?.Id)} ></img>
                                                                    }
                                                                    {state?.Result?.Author[0].userImage === "" && <span title={`${state?.Result?.Author != undefined ? state?.Result?.Author[0].Title : "Default user icons "}`} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser" onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, state?.Result?.Author[0]?.Id)}></span>}
                                                                </a>
                                                            }
                                                        </dd>
                                                    </dl>
                                                </div>
                                                <div className='col-12 p-0'>
                                                    <dl>
                                                        <dt className='bg-Fa p-2' style={{ width: "20.5%" }}>Url</dt>
                                                        <dt className='bg-Ff p-2 text-break ' style={{ width: "80%" }}>
                                                            {state?.Result?.component_url != null &&
                                                                <a target="_blank" data-interception="off" href={state?.Result?.component_url.Url}>{state?.Result?.component_url.Url}</a>
                                                            }
                                                        </dt>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-md-4 pe-0 Site_Compositionbox'>
                                            <div className='bg-Ff p-2 rounded-1 boxshadow h-100 '>
                                                <dl>
                                                    <dt className='bg-Fa'>Portfolio Item</dt>
                                                    <dd className='bg-Ff full-width columnFixedTitle pe-0'>
                                                        {TagConceptPaper?.length > 0 &&
                                                            <a href={`${TagConceptPaper[0].EncodedAbsUrl}?web=1`} rel="noopener noreferrer" target='_blank' data-interception="off">
                                                                <span className={`alignIcon svg__iconbox svg__icon--${TagConceptPaper[0]?.File_x0020_Type}`} title={TagConceptPaper[0]?.File_x0020_Type}></span>
                                                            </a>

                                                            // <a className='fontColor3' href={item?.File_x0020_Type == "aspx" ? `${item?.Url?.Url}` : `${item?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off">{item?.Title}.{item?.docType}</a>
                                                        }
                                                        {state?.Result?.Portfolio != null &&

                                                            <a className="hreflink text-content w-100" target="_blank" data-interception="off" href={`${state?.Result?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${state?.Result?.Portfolio.Id}`}>

                                                                {state?.Result?.Portfolio?.Title}

                                                            </a>

                                                        }
                                                        <span className="ml-auto pull-right svg__icon--editBox svg__iconbox w17" onClick={() => openPortfolioPopupFunction("Portfolio")}></span>

                                                    </dd>
                                                </dl>
                                                <dl>
                                                    <dt className='bg-Fa'>Project</dt>
                                                    <dd className='bg-Ff full-width columnFixedTitle pe-0'>

                                                        {ProjectData?.Title != undefined ? <a className="hreflink text-content w-100" target="_blank" data-interception="off" href={`${state?.Result?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${ProjectData?.Id}`}>

                                                            <ReactPopperTooltipSingleLevel CMSToolId={`${ProjectData?.PortfolioStructureID} - ${ProjectData?.Title}`} row={ProjectData} singleLevel={true} masterTaskData={masterTaskData} AllSitesTaskData={allDataOfTask} AllListId={AllListId} /></a> : null}
                                                        <span className="text-end ml-auto pull-right svg__icon--editBox svg__iconbox w17" onClick={() => openPortfolioPopupFunction("Project")}></span>

                                                    </dd>
                                                </dl>
                                                {isShowSiteCompostion && <dl className="Sitecomposition">
                                                    {ClientTimeArray != null && ClientTimeArray?.length > 0 &&
                                                        <div className='dropdown'>
                                                            <a className="sitebutton bg-fxdark d-flex">
                                                                <span className="arrowicons" onClick={() => showhideComposition()}>{showComposition ? <SlArrowDown /> : <SlArrowRight />}</span>
                                                                <div className="d-flex justify-content-between full-width">
                                                                    <p className="pb-0 mb-0">Site Composition</p>
                                                                    <p className="input-group-text mb-0 pb-0" title="Edit Site Composition" onClick={() => setState({ ...state, EditSiteCompositionStatus: true })}>
                                                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                                                    </p>
                                                                </div>

                                                            </a>
                                                            <div className="spxdropdown-menu" style={{ display: showComposition ? 'block' : 'none' }}>
                                                                <ul>
                                                                    {ClientTimeArray?.map((cltime: any, i: any) => {
                                                                        return <li className="Sitelist">
                                                                            <span>
                                                                                <img style={{ width: "22px" }} title={cltime?.SiteName} src={cltime?.SiteImages} />
                                                                            </span>
                                                                            {cltime?.ClienTimeDescription != undefined &&
                                                                                <span>
                                                                                    {Number(cltime?.ClienTimeDescription).toFixed(1)}%
                                                                                </span>
                                                                            }
                                                                            {cltime.ClientCategory != undefined && cltime.ClientCategory.length > 0 ? cltime.ClientCategory?.map((clientcat: any) => {
                                                                                return (
                                                                                    <span>{clientcat.Title}</span>
                                                                                )
                                                                            }) : null}
                                                                        </li>
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    }
                                                </dl>}

                                                {state?.Result?.EstimatedTimeDescriptionArray?.length > 0 &&
                                                    <dl className="Sitecomposition my-2">
                                                        <div className='dropdown'>
                                                            <a className="sitebutton bg-fxdark d-flex">
                                                                <span className="arrowicons" onClick={() => showhideEstimatedTime()}>{state?.ShowEstimatedTimeDescription ? <SlArrowDown /> : <SlArrowRight />}</span>
                                                                <div className="d-flex justify-content-between full-width">
                                                                    <p className="pb-0 mb-0 ">Estimated Task Time Details</p>
                                                                </div>
                                                            </a>
                                                            <div className="spxdropdown-menu" style={{ display: state?.ShowEstimatedTimeDescription ? 'block' : 'none' }}>
                                                                <div className="col-12" style={{ fontSize: "14px" }}>
                                                                    {state?.Result?.EstimatedTimeDescriptionArray != null && state?.Result?.EstimatedTimeDescriptionArray?.length > 0 ?
                                                                        <div>
                                                                            {state?.Result?.EstimatedTimeDescriptionArray?.map((EstimatedTimeData: any, Index: any) => {
                                                                                return (
                                                                                    <div className={state?.Result?.EstimatedTimeDescriptionArray?.length == Index + 1 ? "align-content-center alignCenter justify-content-between p-1 px-2" : "align-content-center justify-content-between border-bottom alignCenter p-1 px-2"}>
                                                                                        <div className='alignCenter'>
                                                                                            <span className='me-2'>{EstimatedTimeData?.Team != undefined ? EstimatedTimeData?.Team : EstimatedTimeData?.Category != undefined ? EstimatedTimeData?.Category : null}</span> |
                                                                                            <span className='mx-2'>{EstimatedTimeData?.EstimatedTime ? (EstimatedTimeData?.EstimatedTime > 1 ? EstimatedTimeData?.EstimatedTime + " hours" : EstimatedTimeData?.EstimatedTime + " hour") : "0 hour"}</span>
                                                                                            <img className="ProirityAssignedUserPhoto m-0 mx-2 hreflink " onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, EstimatedTimeData?.UserName, taskUsers)} title={EstimatedTimeData?.UserName} src={EstimatedTimeData?.UserImage != undefined && EstimatedTimeData?.UserImage?.length > 0 ? EstimatedTimeData?.UserImage : ''} />
                                                                                        </div>
                                                                                        <Tooltip withArrow content={EstimatedTimeData?.EstimatedTimeDescription} relationship="label" positioning="below">
                                                                                            {EstimatedTimeData?.EstimatedTimeDescription?.length > 0 && <div className='alignCenter hover-text'>
                                                                                                <span className="svg__iconbox svg__icon--info"></span>
                                                                                            </div>}
                                                                                        </Tooltip>

                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                        : null
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="spxdropdown-menu ps-2 py-1 " style={{ zIndex: 0 }}>
                                                                <span>Total Estimated Time : </span>
                                                                <span className="mx-1">{state?.Result?.TotalEstimatedTime > 1 ? state?.Result?.TotalEstimatedTime + " hours" : state?.Result?.TotalEstimatedTime + " hour"} </span>
                                                            </div>
                                                        </div>
                                                    </dl>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='p-0'> {state?.Result?.Id != undefined && <KeyDocuments AllListId={AllListId} Context={propsValue?.Context} siteUrl={propsValue?.siteUrl} user={taskUsers} DocumentsListID={propsValue?.DocumentsListID} ID={itemID} siteName={listName} folderName={state?.Result?.Title} keyDoc={true}></KeyDocuments>}</div>
                                    </div>
                                    <section>
                                        <div className="col mt-2">
                                            <div className="Taskaddcomment row">
                                                {state?.Result?.BasicImageInfo != null && state?.Result?.BasicImageInfo?.length > 0 &&
                                                    <div className="bg-white col-sm-4 mt-2 p-0 boxshadow mb-3">
                                                        <label className='form-label full-width fw-semibold titleheading'>Images</label>
                                                        <div className='alignCenter'>
                                                            <div className='alignCenter ml-auto pt-1 gap-1 px-3'>
                                                                <Tooltip
                                                                    withArrow
                                                                    content="Full-Screen View"
                                                                    relationship="label" positioning="below"
                                                                >
                                                                    <span onClick={() => openImageCompare()} className={`svg__iconbox svg__icon--fullScreen ${checkedImageData?.length <= 1 ? 'siteColor' : ""}`}></span>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    withArrow
                                                                    content="Compare 2 Images"
                                                                    relationship="label"
                                                                    positioning="below"
                                                                >
                                                                    <span onClick={() => openImageCompare()} className={`svg__iconbox svg__icon--compare2 ${checkedImageData?.length == 2 ? 'siteColor' : ""}`}></span>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    withArrow
                                                                    content="Compare Several Images"
                                                                    relationship="label" positioning="below"
                                                                >
                                                                    <span onClick={() => openImageCompare()} className={`svg__iconbox svg__icon--compareSeveral ${(checkedImageData?.length == 3 || checkedImageData?.length == 4) ? 'siteColor' : ""}`}></span>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    withArrow
                                                                    content="View All"
                                                                    relationship="label" positioning="below"
                                                                >
                                                                    <span onClick={() => openImageCompare()} className={`svg__iconbox svg__icon--viewAll ${(checkedImageData?.length > 4) ? 'siteColor' : ""}`}></span>
                                                                </Tooltip>



                                                            </div>
                                                        </div>
                                                        {state?.Result?.BasicImageInfo != null && state?.Result?.BasicImageInfo?.map((imgData: any, i: any) => {
                                                            return <div className="taskimage  mb-3">
                                                                <div className='input-group'><input type="checkbox" className='form-check-input me-1' onChange={(e) => CheckImageData(e.target.checked, imgData)} /> {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}</div>

                                                                <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                                                    <img alt={imgData?.ImageName} src={imgData?.ImageUrl}
                                                                        onMouseOver={(e) => OpenModal(e, imgData)}
                                                                        onMouseOut={(e) => CloseModal(e)} ></img>
                                                                </a>


                                                                <div className="Footerimg d-flex align-items-center justify-content-between p-1 ">
                                                                    <div className='usericons'>
                                                                        <span>
                                                                            <span >{imgData?.UploadeDate}</span>
                                                                            <span className='round px-1'>
                                                                                {imgData?.UserImage != null && imgData?.UserImage != "" ?
                                                                                    <img className='align-self-start hreflink ' title={imgData?.UserName} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, taskUsers)} src={imgData?.UserImage} />
                                                                                    : <span title={imgData?.UserName != undefined ? imgData?.UserName : "Default user icons"} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, taskUsers)} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
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
                                                        })}
                                                    </div>}
                                                {/*feedback comment section code */}
                                                {state?.Result?.Categories?.includes('UX-New') ? <Uxdescriptions Item={state?.Result} currentUser={currentUser} siteUrl={propsValue?.siteUrl} listName={listName} itemID={itemID} ApprovalStatus={ApprovalStatus} AllListId={AllListId} taskUsers={taskUsers} call={GetResult} userDisplayName={props?.userDisplayName} />
                                                    : <TaskDescriptions Item={state?.Result} currentUser={currentUser} siteUrl={propsValue?.siteUrl} listName={listName} itemID={itemID} ApprovalStatus={ApprovalStatus} AllListId={AllListId} taskUsers={taskUsers} call={GetResult} />
                                                }
                                            </div>
                                        </div>

                                        {/*===================Backgroundimage code and comment========== */}

                                        {backGroundComment && <div className="col mt-2">
                                            <div className="Taskaddcomment row">
                                                {state?.Result?.OffshoreImageUrl != null && state?.Result?.OffshoreImageUrl.length > 0 &&
                                                    <div className="bg-white col-sm-4 mt-2 p-0 boxshadow">
                                                        {state?.Result?.OffshoreImageUrl != null && state?.Result?.OffshoreImageUrl?.map((imgData: any, i: any) => {
                                                            return <div className="taskimage border mb-3">
                                                                <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                                                    <img alt={imgData?.ImageName} src={imgData?.Url}
                                                                        onMouseOver={(e) => OpenModal(e, imgData)}
                                                                        onMouseOut={(e) => CloseModal(e)} ></img>
                                                                </a>


                                                                <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-2 ">
                                                                    <div className='usericons'>
                                                                        <span>
                                                                            <span >
                                                                                {imgData?.ImageName?.length > 15 ? imgData?.ImageName?.substring(0, 15) + '...' : imgData?.ImageName}
                                                                            </span>


                                                                        </span>
                                                                    </div>
                                                                    <div className="expandicon">
                                                                        <span >{imgData?.UploadeDate}</span>
                                                                        <span className='round px-1'>
                                                                            {imgData?.UserImage !== null && imgData?.UserImage != "" ?
                                                                                <img className='align-self-start hreflink ' title={imgData?.UserName} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, taskUsers)} src={imgData?.UserImage} />
                                                                                : <span title={imgData?.UserName != undefined ? imgData?.UserName : "Default user icons"} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, taskUsers)} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        })}
                                                    </div>
                                                }
                                                {state?.Result?.OffshoreComments != null && state?.Result?.OffshoreComments != undefined && state?.Result?.OffshoreComments.length > 0 && <div className="col-sm-8 pe-0 mt-2">
                                                    <fieldset className='border p-1'>
                                                        <legend className="border-bottom fs-6">Background Comments</legend>
                                                        {state?.Result?.OffshoreComments != null && state?.Result?.OffshoreComments.length > 0 && state?.Result?.OffshoreComments?.map((item: any, index: any) => {
                                                            return <div>


                                                                <span className='round px-1'>
                                                                    {item.AuthorImage != null &&
                                                                        <img className='align-self-start hreflink ' title={item?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, item?.AuthorName, taskUsers)} src={item?.AuthorImage} />
                                                                    }
                                                                </span>

                                                                <span className="pe-1">{item.AuthorName}</span>
                                                                <span className="pe-1" >{moment(item?.Created).format("DD/MM/YY")}</span>
                                                                <div style={{ paddingLeft: "30px" }} className=" mb-4 text-break"><span dangerouslySetInnerHTML={{ __html: item?.Body }}></span>
                                                                </div>


                                                            </div>
                                                        })} </fieldset>

                                                </div>}
                                            </div>
                                        </div>}

                                    </section>
                                </div>
                                <div className="col-3 pe-0">
                                    <div>
                                        {state?.Result != undefined && AllListId != undefined && <CommentCard siteUrl={propsValue?.siteUrl} AllListId={AllListId} Context={propsValue.Context} counter={state.counter}></CommentCard>}
                                        {state?.Result?.Id != undefined && AllListId != undefined && <>
                                            <AncTool item={state?.Result} callBack={AncCallback} AllListId={AllListId} Context={propsValue.Context} />
                                        </>}
                                    </div>
                                    <div>{state?.Result?.Id && <SmartInformation ref={smartInfoRef} Id={state?.Result?.Id} AllListId={AllListId} Context={propsValue?.Context} taskTitle={state?.Result?.Title} listName={state?.Result?.listName} />}</div>
                                    <div> {state?.Result?.Id != undefined && <RelevantDocuments ref={relevantDocRef} AllListId={AllListId} Context={propsValue?.Context} siteUrl={propsValue?.siteUrl} DocumentsListID={propsValue?.DocumentsListID} ID={itemID} siteName={listName} folderName={state?.Result?.Title} ></RelevantDocuments>}</div>
                                    <div> {state?.Result?.Id != undefined && <RelevantEmail ref={keyDocRef} AllListId={AllListId} Context={propsValue?.Context} siteUrl={propsValue?.siteUrl} DocumentsListID={propsValue?.DocumentsListID} ID={itemID} siteName={listName} folderName={state?.Result?.Title} ></RelevantEmail>}</div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <section className='TableContentSection'>
                        {console.log("context data ================", myContextValue)}

                        <div className="row m-0">
                            {state?.Result != undefined && state?.Result?.Id != undefined && state?.Result.TaskTypeTitle != "" && state?.Result.TaskTypeTitle != undefined && state?.Result.TaskTypeTitle != 'Task' ?
                                //  <TasksTable props={state?.Result} AllMasterTasks={masterTaskData} AllSiteTasks={allDataOfTask} AllListId={AllListId} Context={propsValue?.Context} />
                                <RadimadeTable tableId="TaskProfilegit" AllListId={AllListId} configration={"AllAwt"} SelectedSiteForTask={[listName]} SelectedItem={state?.Result}></RadimadeTable>
                                : ''}
                        </div>
                        <div className='row m-0'>

                            {state?.Result != undefined &&
                                <div className="ItemInfo mb-20" style={{ paddingTop: '15px' }}>

                                    <div>Created <span >{(moment(state?.Result?.Creation).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{state?.Result?.Author != null && state?.Result?.Author?.length > 0 && state?.Result?.Author[0].Title}</span>
                                    </div>
                                    <div>Last modified <span >{(moment(state?.Result?.Modified).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{state?.Result?.ModifiedBy != null && state?.Result?.ModifiedBy?.Title}</span><span className='mx-1'>|</span>

                                        <span>{itemID ? <VersionHistoryPopup taskId={itemID} context={propsValue.Context} RequiredListIds={AllListId} listId={state?.Result.listId} siteUrls={state?.Result.siteUrl} isOpen={state.isopenversionHistory} /> : ''}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>

                    {state?.imageInfo && <div className='imghover' style={{ display: state.showPopup }}>
                        <div className="popup">
                            <div className="parentDiv">
                                <span style={{ color: 'white' }}>{state?.imageInfo?.ImageName}</span>
                                <img style={{ maxWidth: '100%' }} src={state?.imageInfo?.ImageUrl}></img>
                            </div>
                        </div>
                    </div>}
                    {state?.isCalloutVisible ? (

                        <FocusTrapCallout
                            className='p-2 replyTooltip'
                            role="alertdialog"

                            gapSpace={0}
                            target={`#${buttonId}-${state.currentDataIndex}`}
                            onDismiss={() => setState({
                                ...state,
                                isCalloutVisible: false
                            })}
                            setInitialFocus
                        >
                            <Text block variant="xLarge" className='subheading m-0 f-15'>
                                Comment Reply
                            </Text>
                            <Text block variant="small">
                                <div className="d-flex my-2">
                                    <textarea className="form-control" value={state?.replyTextComment}
                                        onChange={(e) => updateReplyMessagesFunction(e)}
                                    ></textarea>
                                </div>

                            </Text>
                            <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                                <Stack
                                    className='modal-footer'
                                    gap={8} horizontal>

                                    <button className='btn btn-default'
                                        onClick={() => setState({
                                            ...state,
                                            isCalloutVisible: false
                                        })}
                                    >Cancel</button>
                                    <button className='btn btn-primary'
                                        onClick={SaveReplyMessageFunction}
                                    >Save</button>
                                </Stack>
                            </FocusZone>
                        </FocusTrapCallout>

                    ) : null
                    }
                    {state.isOpenEditPopup ? <EditTaskPopup Items={state?.Result} context={propsValue.Context} AllListId={AllListId} Call={(Type: any) => { CallBack(Type) }} /> : ''}

                    {state.EditSiteCompositionStatus ?
                        <CentralizedSiteComposition
                            ItemDetails={state?.Result}
                            RequiredListIds={AllListId}
                            closePopupCallBack={(Type: any) => { CallBack(Type) }}
                            usedFor={"AWT"}
                            ColorCode={state?.Result?.Portfolio?.PortfolioType?.Color}
                        /> : ''}
                    {state?.emailcomponentopen && countemailbutton == 0 && <EmailComponenet approvalcallback={() => { approvalcallback() }} Context={propsValue?.Context} emailStatus={state?.emailComponentstatus} currentUser={currentUser} items={state?.Result} />}

                    {(isopencomonentservicepopup || isopenProjectpopup) &&
                        <ServiceComponentPortfolioPopup

                            props={state?.Result}
                            Dynamic={AllListId}
                            ComponentType={"Component"}
                            Call={(DataItem: any, Type: any, functionType: any) => { ComponentServicePopupCallBack(DataItem, Type, functionType) }}
                            showProject={isopenProjectpopup}
                        />
                    }
                    {(state?.CommenttoUpdate != undefined) && <Panel
                        onRenderHeader={onRenderCustomHeadereditcomment}
                        isOpen={state.isEditModalOpen ? state.isEditModalOpen : state.isEditReplyModalOpen}
                        onDismiss={Closecommentpopup}
                        isBlocking={state.isEditModalOpen ? !state.isEditModalOpen : !state.isEditReplyModalOpen}
                    >
                        <div className="modal-body">
                            <div className='col'>
                                <textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => handleUpdateComment(e)}  >{state?.CommenttoUpdate}</textarea>
                            </div>
                        </div>
                        <footer className='modal-footer mt-2'>
                            <button className="btn btn-primary ms-1" onClick={(e) => updateComment()}>Save</button>
                            <button className='btn btn-default ms-1' onClick={Closecommentpopup}>Cancel</button>
                        </footer>
                    </Panel>}
                    {state.ApprovalHistoryPopup ? <ApprovalHistoryPopup
                        ApprovalPointUserData={state.ApprovalPointUserData}
                        indexSHow={state.currentArraySubTextIndex != null ? state.ApprovalPointCurrentParentIndex + "." + state.currentArraySubTextIndex : state.ApprovalPointCurrentParentIndex}
                        ApprovalPointCurrentIndex={state.ApprovalPointCurrentParentIndex - 1}
                        ApprovalPointHistoryStatus={state.ApprovalHistoryPopup}
                        currentArrayIndex={state.currentArraySubTextIndex - 1}
                        usefor="TaskProfile"

                        callBack={() => ApprovalHistoryPopupCallBack()}
                    />
                        : null}
                        {openComparePopup &&<ImageViewPanel currentUser={currentUser} checkedImageData={checkedImageData} SetOpenComparePopup={SetOpenComparePopup} AllImageData={state?.Result?.BasicImageInfo}AllListId={AllListId}taskUsers={taskUsers}taskData={state?.Result}/>}

                </div>
            </myContextValue.Provider>
        </>
    );
};

export default CopyTaskProfile;

export { myContextValue }
