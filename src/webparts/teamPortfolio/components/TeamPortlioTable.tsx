import * as React from "react";
import * as $ from "jquery";
import * as Moment from "moment";
import { Panel, PanelType } from "office-ui-fabric-react";
import { FaCompressArrowsAlt, FaFilter, } from "react-icons/fa";
import pnp, { Web } from "sp-pnp-js";
import { map } from "jquery";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import CreateActivity from "../../../globalComponents/CreateActivity";
import CreateWS from "../../../globalComponents/CreateWS";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "../../../globalComponents/Tooltip";
import { ColumnDef } from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import TeamSmartFilter from "../../../globalComponents/SmartFilterGolobalBomponents/TeamSmartFilter";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import PageLoader from "../../../globalComponents/pageLoader";
import CompareTool from "../../../globalComponents/CompareTool/CompareTool";
import TrafficLightComponent from "../../../globalComponents/TrafficLightVerification/TrafficLightComponent";
import CreateAllStructureComponent from "../../../globalComponents/CreateAllStructure";
import { myContextValue } from "../../../globalComponents/globalCommon";
import ProgressBar from 'react-bootstrap/ProgressBar';
import WorkingActionInformation from "../../../globalComponents/WorkingActionInformation";
import { Avatar } from "@fluentui/react-components";
import LabelInfoIconToolTip from "../../../globalComponents/labelInfoIconToolTip";
var filt: any = "";
var ContextValue: any = {};
let globalFilterHighlited: any;
let forceExpanded: any = [];
let isUpdated: any = "";
let componentData: any = [];
let AllDataTaskcomponentData: any = [];
let componentDataCopyBackup: any = []
let filterCount: any = 0;
let childRefdata: any;
let portfolioColor: any = '';
let ProjectData: any = [];
let copyDtaArray: any = [];
let renderData: any = [];
let countAllTasksData: any = [];
let AfterFilterTaskCount: any = [];
let allLoadeDataMasterTaskAndTask: any = [];
let allMasterTaskDataFlatLoadeViewBackup: any = [];
let allTaskDataFlatLoadeViewBackup: any = [];
let hasCustomExpanded: any = true
let hasExpanded: any = true
let isHeaderNotAvlable: any = false
let isColumnDefultSortingAsc: any = false;
let tasksDataLoadUpdate: any = []
let metaDataItem: any = [];
// let dynamicColumnsValue: any = [];
function TeamPortlioTable(SelectedProp: any) {
    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };

    }
    let MyContextdata: any = React.useContext(myContextValue);
    try {
        if (SelectedProp?.SelectedProp != undefined) {
            SelectedProp.SelectedProp.isShowTimeEntry = JSON.parse(
                SelectedProp?.SelectedProp?.TimeEntry
            );

            SelectedProp.SelectedProp.isShowSiteCompostion = JSON.parse(
                SelectedProp?.SelectedProp?.SiteCompostion
            );
        }
    } catch (e) {
        console.log(e);
    }
    ContextValue = SelectedProp?.SelectedProp;
    const refreshData = () => setData(() => renderData);
    const [loaded, setLoaded] = React.useState(false);
    const [isCallTask, setIsCallTask] = React.useState(null);
    const [isCallComponent, setIsCallComponent] = React.useState(null);
    const [siteConfig, setSiteConfig] = React.useState([]);
    const [dataAllGruping, seDataAllGruping] = React.useState([]);
    const [data, setData] = React.useState([]);
    copyDtaArray = data;
    const [activeTile, setActiveTile] = React.useState("")
    const [AllUsers, setTaskUser] = React.useState([]);
    const [AllMetadata, setMetadata] = React.useState([])
    const [AllClientCategory, setAllClientCategory] = React.useState([])
    const [IsUpdated, setIsUpdated] = React.useState("");
    const [IsSmartfavoriteId, setIsSmartfavoriteId] = React.useState("");
    const [IsSmartfavorite, setIsSmartfavorite] = React.useState("");
    const [checkedList, setCheckedList] = React.useState<any>({});
    const [AllSiteTasksData, setAllSiteTasksData] = React.useState([]);
    const [AllSiteTasksDataLoadAll, setAllSiteTasksDataLoadAll] = React.useState([]);
    const [firstTimeFullDataGroupingCallCount, setfirstTimeFullDataGroupingCallCount] = React.useState(0)
    const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
    const [smartAllFilterData, setAllSmartFilterData] = React.useState([])
    const [smartAllFilterOriginalData, setAllSmartFilterOriginalData] = React.useState([])
    const [portfolioTypeData, setPortfolioTypeData] = React.useState([])
    const [taskTypeData, setTaskTypeData] = React.useState([])
    const [filterCounters, setFilterCounters] = React.useState(false);
    const [updatedSmartFilter, setUpdatedSmartFilter] = React.useState(false);
    const [AllSmartFilterDataBackup, setAllSmartFilterDataBackup] = React.useState([]);
    const [allDataBackup, setDataBackup] = React.useState([]);
    const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
    const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
    const [portfolioTypeDataItemBackup, setPortFolioTypeIconBackup] = React.useState([]);
    const [taskTypeDataItemBackup, setTaskTypeDataItemBackup] = React.useState([]);
    const [OpenAddStructurePopup, setOpenAddStructurePopup] = React.useState(false);
    const [ActivityPopup, setActivityPopup] = React.useState(false)
    const [isOpenActivity, setIsOpenActivity] = React.useState(false)
    const [isOpenWorkstream, setIsOpenWorkstream] = React.useState(false)
    const [IsComponent, setIsComponent] = React.useState(false);
    const [CMSToolComponent, setCMSToolComponent] = React.useState("");
    const [IsTask, setIsTask] = React.useState(false);
    const [CMSTask, setCMSTask] = React.useState("");
    const [cmsTimeComponent, setCmsTimeComponent] = React.useState([]);
    const [checkedList1, setCheckedList1] = React.useState([]);
    const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
    const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
    const [smartTimeTotalFunction, setSmartTimeTotalFunction] = React.useState(null);
    const [groupByButtonClickData, setGroupByButtonClickData] = React.useState([]);
    const [clickFlatView, setclickFlatView] = React.useState(false);
    const [updatedSmartFilterFlatView, setUpdatedSmartFilterFlatView] = React.useState(false);
    const [flatViewDataAll, setFlatViewDataAll] = React.useState([]);
    const [openCompareToolPopup, setOpenCompareToolPopup] = React.useState(false);
    const [dynamicColumnsValue, setDynamicColumnsValue] = React.useState([])
    const rerender = React.useReducer(() => ({}), {})[1];
    const [ActiveCompareToolButton, setActiveCompareToolButton] = React.useState(false);
    const [taskCatagory, setTaskCatagory] = React.useState([]);
    const [smartTimelastModifiedDate, setSmartTimelastModifiedDate] = React.useState("")
    // const [showProgress, setShowProgress] = React.useState(false);
    // const [tableHeight, setTableHeight] = React.useState(window.innerHeight);
    const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Component', Suffix: 'C', Level: 1 }, { Title: 'SubComponent', Suffix: 'S', Level: 2 }, { Title: 'Feature', Suffix: 'F', Level: 3 }]);
    let ComponetsData: any = {};
    let Response: any = [];
    let props = undefined;
    let AllTasks: any = [];
    let AllTasksSiteTasks: any = [];
    let AllComponetsData: any = [];
    let TaskUsers: any = [];
    let TasksItem: any = [];
    //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------
    const getTaskUsers = async () => {
        let web = new Web(ContextValue.siteUrl);
        let taskUsers = [];
        taskUsers = await web.lists
            .getById(ContextValue.TaskUserListID)
            .items.select(
                "Id",
                "Email",
                "Suffix",
                "Title",
                "Item_x0020_Cover",
                "AssingedToUser/Title",
                "AssingedToUser/EMail",
                "AssingedToUser/Id",
                "AssingedToUser/Name",
                "UserGroup/Id",
                "ItemType"
            )
            .expand("AssingedToUser", "UserGroup")
            .get();
        Response = taskUsers;
        TaskUsers = Response;
        setTaskUser(Response);
        console.log(Response);
    };

    const getPortFolioType = async () => {
        let web = new Web(ContextValue.siteUrl);
        let PortFolioType = [];
        PortFolioType = await web.lists
            .getById(ContextValue.PortFolioTypeID)
            .items.select(
                "Id",
                "Title",
                "Color",
                "IdRange"
            )
            .get();
        setPortfolioTypeData(PortFolioType);
    };
    const getTaskType = async () => {
        let web = new Web(ContextValue.siteUrl);
        let taskTypeData = [];
        let typeData: any = [];
        taskTypeData = await web.lists
            .getById(ContextValue.TaskTypeID)
            .items.select(
                'Id',
                'Level',
                'Title',
                'SortOrder',
            ).get();
        setTaskTypeData(taskTypeData);
        if (taskTypeData?.length > 0 && taskTypeData != undefined) {
            taskTypeData?.forEach((obj: any) => {
                if (obj != undefined) {
                    let Item: any = {};
                    Item.Title = obj.Title;
                    Item.SortOrder = obj.SortOrder;
                    Item[obj.Title + 'number'] = 0;
                    Item[obj.Title + 'filterNumber'] = 0;
                    Item[obj.Title + 'numberCopy'] = 0;
                    typeData.push(Item);
                }
            })
            console.log("Task Type retrieved:", typeData);
            typeData = typeData.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);
            setTaskTypeDataItem(typeData);
        }
    };

    const GetSmartmetadata = async () => {
        let siteConfigSites: any = []
        var Priority: any = []
        // let PrecentComplete: any = [];
        // let FeatureType: any = []
        let Categories: any = [];
        let web = new Web(ContextValue.siteUrl);
        let smartmetaDetails: any = [];
        smartmetaDetails = await web.lists
            .getById(ContextValue.SmartMetadataListID)
            .items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
            .top(4999).expand("Parent").get();
        setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
        smartmetaDetails?.map((newtest: any) => {
            if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites') {
                siteConfigSites.push(newtest)
            }
            if (newtest?.TaxType == 'Priority Rank') {
                Priority?.push(newtest)
            }
            if (newtest.TaxType == 'Categories') {
                Categories.push(newtest);
            }
        })
        if (siteConfigSites?.length > 0) {
            setSiteConfig(siteConfigSites)
        }
        setTaskCatagory(Categories);
        metaDataItem.push(...smartmetaDetails)
        setMetadata(smartmetaDetails);
    };
    const findPortFolioIconsAndPortfolio = async () => {
        try {
            let newarray: any = [];
            const ItemTypeColumn = "Item Type";
            console.log("Fetching portfolio icons...");
            const field = await new Web(ContextValue.siteUrl)
                .lists.getById(ContextValue?.MasterTaskListID)
                .fields.getByTitle(ItemTypeColumn)
                .get();
            console.log("Data fetched successfully:", field?.Choices);

            if (field?.Choices?.length > 0 && field?.Choices != undefined) {
                field?.Choices?.forEach((obj: any) => {
                    if (obj != undefined) {
                        let Item: any = {};
                        Item.Title = obj;
                        Item[obj + 'number'] = 0;
                        Item[obj + 'filterNumber'] = 0;
                        Item[obj + 'numberCopy'] = 0;
                        newarray.push(Item);
                    }
                })
                if (newarray.length > 0) {
                    newarray = newarray.filter((findShowPort: any) => {
                        let match = portfolioTypeConfrigration.find((config: any) => findShowPort.Title === config.Title);
                        if (match) {
                            findShowPort.Level = match?.Level;
                            findShowPort.Suffix = match?.Suffix;
                            return true
                        }
                        return false
                    });
                }
                console.log("Portfolio icons retrieved:", newarray);
                setPortFolioTypeIcon(newarray);
            }
        } catch (error) {
            console.error("Error fetching portfolio icons:", error);
        }
    };

    function removeHtmlAndNewline(text: any) {
        if (text) {
            return text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
        } else {
            return ''; // or any other default value you prefer
        }
    }

    // const findUserByName = (name: any) => {
    //     let userInfo: any = { Image: null, Suffix: null }
    //     const user = AllUsers.filter(
    //         (user: any) => user?.AssingedToUser?.Id === name
    //     );
    //     let Image: any;
    //     let Suffix: any;
    //     if (user[0]?.Suffix != undefined) {
    //         Suffix = user[0]?.Suffix;
    //     }
    //     if (user[0]?.Item_x0020_Cover != undefined) {
    //         Image = user[0].Item_x0020_Cover.Url;
    //     }
    //     userInfo.Image = Image
    //     userInfo.Suffix = Suffix
    //     // else { Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"; }
    //     return user ? userInfo : null;
    // };
    const findUserByName = (name: any) => {
        const user = AllUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let authImg: any = { Image: "", Suffix: "" }
        if (user[0]?.Item_x0020_Cover != undefined) {
            authImg.Image = user[0]?.Item_x0020_Cover.Url;
        } else { authImg.Suffix = user[0]?.Suffix }
        return user ? authImg : null;
    };
  

    /// backGround Loade All Task Data /////
    const LoadAllSiteTasksAllData = async function () {
        let AllSiteTasksDataBackGroundLoad: any = [];
        let Counter = 0;
        if (siteConfig != undefined && siteConfig.length > 0) {
            const fetchPromises = map(siteConfig, async (config: any) => {
                let web = new Web(ContextValue.siteUrl);
                let AllTasksMatches: any = [];
                try {
                    AllTasksMatches = await web.lists
                        .getById(config.listId)
                        .items.select("ParentTask/Title", "ParentTask/Id", "ItemRank", "TaskLevel", "OffshoreComments", "TeamMembers/Id", "ClientCategory/Id", "ClientCategory/Title",
                            "TaskID", "ResponsibleTeam/Id", "ResponsibleTeam/Title", "ParentTask/TaskID", "TaskType/Level", "PriorityRank", "TeamMembers/Title", "FeedBack", "Title", "Id", "ID", "DueDate", "Comments", "Categories", "Status", "Body",
                            "PercentComplete", "ClientCategory", "Priority", "TaskType/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/PortfolioStructureID", "Portfolio/Title",
                            "TaskCategories/Id", "TaskCategories/Title", "TeamMembers/Name", "Project/Id", "Project/PortfolioStructureID", "Project/Title", "Project/PriorityRank", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                            "Created", "Modified", "IsTodaysTask", "workingThisWeek", "WorkingAction"
                        )
                        .expand(
                            "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
                            "TaskCategories", "Project",
                        ).orderBy("orderby", false).getAll();
                } catch (error) {
                    console.log("error", error);
                }
                console.log(AllTasksMatches);
                Counter++;
                console.log(AllTasksMatches.length);
                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
                    $.each(AllTasksMatches, function (index: any, item: any) {
                        item.isDrafted = false;
                        item.flag = true;
                        item.TitleNew = item.Title;
                        item.siteType = config.Title;
                        item.childs = [];
                        item.listId = config.listId;
                        item.siteUrl = ContextValue.siteUrl;
                        item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                        item.fontColorTask = "#000"
                    });
                }
                AllTasksSiteTasks = AllTasksSiteTasks.concat(AllTasksMatches);
                if (Counter == siteConfig.length) {
                    map(AllTasksSiteTasks, (result: any) => {
                        result.Id = result.Id != undefined ? result.Id : result.ID;
                        result.TeamLeaderUser = [];
                        result.AllTeamName = result.AllTeamName === undefined ? "" : result.AllTeamName;
                        result.chekbox = false;
                        result.timeSheetsDescriptionSearch = '';
                        result.SmartPriority = 0;
                        result.TaskTypeValue = '';
                        result.projectPriorityOnHover = '';
                        result.taskPriorityOnHover = result?.PriorityRank;
                        result.showFormulaOnHover;
                        result.portfolioItemsSearch = '';
                        result.commentsSearch = '';
                        result.descriptionsSearch = '';
                        result.descriptionsDeliverablesSearch = '';
                        result.descriptionsHelpInformationSarch = '';
                        result.descriptionsShortDescriptionSearch = '';
                        result.descriptionsTechnicalExplanationsSearch = '';
                        result.descriptionsBodySearch = '';
                        result.descriptionsAdminNotesSearch = '';
                        result.descriptionsValueAddedSearch = '';
                        result.descriptionsIdeaSearch = '';
                        result.descriptionsBackgroundSearch = '';
                        result.FeatureTypeTitle = ''
                        if (result?.DueDate != null && result?.DueDate != undefined) {
                            result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
                        }
                        if (result?.Modified != null && result?.Modified != undefined) {
                            result.serverModifiedDate = new Date(result?.Modified).setHours(0, 0, 0, 0)
                        }
                        if (result?.Created != null && result?.Created != undefined) {
                            result.serverCreatedDate = new Date(result?.Created).setHours(0, 0, 0, 0)
                        }
                        result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
                        if (result.DisplayCreateDate == "Invalid date" || "") {
                            result.DisplayCreateDate = result.DisplayCreateDate.replaceAll("Invalid date", "");
                        }
                        result.DisplayModifiedDate = Moment(result.Modified).format("DD/MM/YYYY");
                        if (result.Editor) {
                            let authImg = findUserByName(result.Editor?.Id);
                            if (authImg.Image != undefined && authImg.Image != "") {
                                result.Editor.autherImage = authImg.Image
                            } else {
                                result.Editor.suffix = authImg.Suffix
                            }
                        }
                        if (result.Author) {
                            let authImg = findUserByName(result.Author?.Id);
                            if (authImg.Image != undefined && authImg.Image != "") {
                                result.Author.autherImage = authImg.Image
                            } else {
                                result.Author.suffix = authImg.Suffix
                            }
                        }
                        result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
                        if (result.DisplayDueDate == "Invalid date" || "") {
                            result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
                        }
                        if (result?.TaskType) {
                            result.portfolioItemsSearch = result?.TaskType?.Title;
                        }
                        if (result?.Status === "Not Started") { result.statusColor = "#FFFFFF " } else if (result?.Status === "For Approval") {
                            result.statusColor = " #FFFFCC"
                        } else if (result?.Status === "Follow Up") { result.statusColor = " #CCFFFF" } else if (result?.Status === "Approved") { result.statusColor = "#CCFFCC " } else if (result?.Status === "Checking") {
                            result.statusColor = " #FFCCFF"
                        } else if (result?.Status === "Acknowledged") {
                            result.statusColor = " #CCFFFF"
                        } else if (result?.Status === "Ready to Go") { result.statusColor = " #FFCC99" } else if (result?.Status === "working on it") {
                            result.statusColor = " #FFCC99"
                        } else if (result?.Status === "Re-Open") { result.statusColor = " #FF9966" } else if (result?.Status === "Deployment Pending") { result.statusColor = " #FF9966" } else if (result?.Status === "In QA Review") {
                            result.statusColor = " #CC99FF"
                        } else if (result?.Status === "Task completed") { result.statusColor = " #339933" } else if (result?.Status === "For Review") { result.statusColor = " #336699" } else if (result?.Status === "Follow-up later") {
                            result.statusColor = " #339999"
                        } else if (result?.Status === "Completed") { result.statusColor = " #339933" } else if (result?.Status === " Closed") { result.statusColor = " #999999" }

                        result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                        if (result.PercentComplete != undefined && result.PercentComplete != '' && result.PercentComplete != null) {
                            result.percentCompleteValue = parseInt(result?.PercentComplete);
                        }
                        if (result?.Portfolio != undefined) {
                            allMasterTaskDataFlatLoadeViewBackup.map((item: any) => {
                                if (item.Id === result?.Portfolio?.Id) {
                                    result.Portfolio = item
                                    result.PortfolioType = item?.PortfolioType
                                }
                            })
                        }
                        result.chekbox = false;
                        if (result?.FeedBack && result?.FeedBack != undefined) {
                            const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
                            let descriptionSearchData = '';
                            try {
                                const feedbackData = JSON.parse(result.FeedBack);
                                descriptionSearchData = feedbackData[0]?.FeedBackDescriptions?.map((child: any) => {
                                    const childText = cleanText(child?.Title);
                                    const comments = (child?.Comments || [])?.map((comment: any) => {
                                        const commentText = cleanText(comment?.Title);
                                        const replyText = (comment?.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                                        return [commentText, replyText]?.filter(Boolean).join(' ');
                                    }).join(' ');

                                    const subtextData = (child.Subtext || [])?.map((subtext: any) => {
                                        const subtextComment = cleanText(subtext?.Title);
                                        const subtextReply = (subtext.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                                        const subtextComments = (subtext.Comments || [])?.map((subComment: any) => {
                                            const subCommentTitle = cleanText(subComment?.Title);
                                            const subCommentReplyText = (subComment.ReplyMessages || []).map((val: any) => cleanText(val?.Title)).join(' ');
                                            return [subCommentTitle, subCommentReplyText]?.filter(Boolean).join(' ');
                                        }).join(' ');
                                        return [subtextComment, subtextReply, subtextComments].filter(Boolean).join(' ');
                                    }).join(' ');

                                    return [childText, comments, subtextData].filter(Boolean).join(' ');
                                }).join(' ');

                                result.descriptionsSearch = descriptionSearchData;
                            } catch (error) {
                                console.error("Error:", error);
                            }
                        }
                        try {
                            if (result?.Comments != null && result?.Comments != undefined) {
                                const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
                                const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                                const commentsFormData = JSON?.parse(cleanedComments);
                                const searchData = commentsFormData?.reduce((accumulator: any, comment: any) => {
                                    return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                                }, "").trim();
                                result.commentsSearch = cleanText(searchData);
                            }
                        } catch (error) {
                            console.error("An error occurred:", error);
                        }
                        if (
                            result.AssignedTo != undefined &&
                            result.AssignedTo.length > 0
                        ) {
                            map(result.AssignedTo, (Assig: any) => {
                                if (Assig.Id != undefined) {
                                    map(AllUsers, (users: any) => {
                                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                            if(!(result.AllTeamName.includes(users.Title))){
                                                result.AllTeamName += users.Title + ";";
                                            }
                                                                                    }
                                    });
                                }
                            });
                        }
                        if (result.ResponsibleTeam != undefined && result.ResponsibleTeam.length > 0) {
                            map(result.ResponsibleTeam, (Assig: any) => {
                                if (Assig.Id != undefined) {
                                    map(AllUsers, (users: any) => {
                                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                            if(!(result.AllTeamName.includes(users.Title))){
                                                result.AllTeamName += users.Title + ";";
                                            }
                                            
                                        }
                                    });
                                }
                            });
                        }
                        if (
                            result.TeamMembers != undefined &&
                            result.TeamMembers.length > 0
                        ) {
                            map(result.TeamMembers, (Assig: any) => {
                                if (Assig.Id != undefined) {
                                    map(AllUsers, (users: any) => {
                                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                            if(!(result.AllTeamName.includes(users.Title))){
                                                result.AllTeamName += users.Title + ";";
                                            }
                                            
                                        }
                                    });
                                }
                            });
                        }
                        if (result?.TaskCategories?.length > 0) {
                            result.TaskTypeValue = result?.TaskCategories?.map((val: any) => val.Title).join(",")
                        }

                        if (result?.ClientCategory?.length > 0) {
                            result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                        } else {
                            result.ClientCategorySearch = ''
                        }
                        result["TaskID"] = globalCommon.GetTaskId(result);
                        if (result.Project) {
                            result.ProjectTitle = result?.Project?.Title;
                            result.ProjectId = result?.Project?.Id;
                            result.projectStructerId = result?.Project?.PortfolioStructureID
                            const title = result?.Project?.Title || '';
                            const formattedDueDate = Moment(result?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                            result.joinedData = [];
                            if (result?.projectStructerId && title || formattedDueDate) {
                                result.joinedData.push(`Project ${result?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                            }
                        }
                        try {
                            if (result?.WorkingAction) {
                                const workingActionValue = JSON.parse(result.WorkingAction);
                                const relevantTitles: any = ["Bottleneck", "Attention", "Phone", "Approval"];
                                result.workingActionValue = workingActionValue;
                                result.workingActionTitle = workingActionValue?.filter((elem: any) => relevantTitles?.includes(elem.Title))?.map((elem: any) => elem.Title)?.join(" ");
                                const todayStr = Moment().format('DD/MM/YYYY');
                                result.workingDetailsBottleneck = workingActionValue?.find((item: any) => item.Title === 'Bottleneck' && item?.InformationData?.length > 0);
                                result.workingDetailsAttention = workingActionValue?.find((item: any) => item.Title === 'Attention' && item?.InformationData?.length > 0);
                                result.workingDetailsPhone = workingActionValue?.find((item: any) => item.Title === 'Phone' && item?.InformationData?.length > 0);
                                const workingDetails = workingActionValue?.find((item: any) => item.Title === 'WorkingDetails');
                                if (workingDetails) { result.workingTodayUsers = workingDetails?.InformationData?.filter((detail: any) => detail.WorkingDate === todayStr); }
                            }
                        } catch (error) {
                            console.error("An error occurred:", error);
                        }
                        result = globalCommon.findTaskCategoryParent(taskCatagory, result)
                        result.SmartPriority = globalCommon.calculateSmartPriority(result);
                        result["Item_x0020_Type"] = "Task";
                        TasksItem.push(result);
                        AllSiteTasksDataBackGroundLoad.push(result)
                    });
                    smartTimeUseLocalStorage(AllSiteTasksDataBackGroundLoad)
                    // tasksDataLoadUpdate = tasksDataLoadUpdate.concat(allTaskDataFlatLoadeViewBackup);
                    tasksDataLoadUpdate = tasksDataLoadUpdate.concat(AllSiteTasksDataBackGroundLoad);
                    setAllSiteTasksDataLoadAll(tasksDataLoadUpdate);
                    let taskBackup: any = []
                    try {
                        taskBackup = JSON.parse(JSON.stringify(tasksDataLoadUpdate));
                    } catch (error) {
                        console.log("backup Json parse error backGround Loade All Task Data")
                    }
                    allLoadeDataMasterTaskAndTask = allLoadeDataMasterTaskAndTask.concat(taskBackup);
                    // let allTaskDataFlatLoadeViewBackupAllData: any = [];
                    // try {
                    //     allTaskDataFlatLoadeViewBackupAllData = JSON.parse(JSON.stringify(AllSiteTasksDataBackGroundLoad))
                    // } catch (error) {
                    //     console.log("backup Json parse error backGround Loade All Task Data")
                    // }
                    // allTaskDataFlatLoadeViewBackup = allTaskDataFlatLoadeViewBackup.concat(allTaskDataFlatLoadeViewBackupAllData);
                    allTaskDataFlatLoadeViewBackup = tasksDataLoadUpdate;
                    firstTimeFullDataGrouping();
                }
            });
            await Promise.all(fetchPromises)
            return tasksDataLoadUpdate
        }
    };

    const smartTimeUseLocalStorage = (AllSiteTasksDataBackGroundLoad: any) => {
        let timeEntryDataLocalStorage: any = localStorage.getItem('timeEntryIndex')
        if (timeEntryDataLocalStorage?.length > 0) {
            const timeEntryIndexLocalStorage = JSON.parse(timeEntryDataLocalStorage)
            AllSiteTasksDataBackGroundLoad?.map((task: any) => {
                task.TotalTaskTime = 0;
                task.timeSheetsDescriptionSearch = "";
                const key = `Task${task?.siteType + task.Id}`;
                if (timeEntryIndexLocalStorage.hasOwnProperty(key) && timeEntryIndexLocalStorage[key]?.Id === task.Id && timeEntryIndexLocalStorage[key]?.siteType === task.siteType) {
                    // task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime % 1 != 0 ? parseFloat(timeEntryIndexLocalStorage[key]?.TotalTaskTime?.toFixed(2)) : timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    // task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime % 1 != 0 ? parseFloat(timeEntryIndexLocalStorage[key]?.TotalTaskTime?.toFixed(2)) : timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    task.timeSheetsDescriptionSearch = timeEntryIndexLocalStorage[key]?.timeSheetsDescriptionSearch;
                }
            })
            console.log("timeEntryIndexLocalStorage", timeEntryIndexLocalStorage)
            return AllSiteTasksDataBackGroundLoad;
        }
    };
    // * page loade Task Data Only * ///////
    const LoadAllSiteTasks = function () {
        let AllTasksData: any = [];
        let Counter = 0;
        if (siteConfig != undefined && siteConfig.length > 0) {
            map(siteConfig, async (config: any) => {
                let web = new Web(ContextValue.siteUrl);
                let AllTasksMatches: any = [];
                AllTasksMatches = await web.lists
                    .getById(config.listId)
                    .items.select("ParentTask/Title", "ParentTask/Id", "ItemRank", "TaskLevel", "OffshoreComments", "TeamMembers/Id", "ClientCategory/Id", "ClientCategory/Title",
                        "TaskID", "ResponsibleTeam/Id", "ResponsibleTeam/Title", "ParentTask/TaskID", "TaskType/Level", "PriorityRank", "TeamMembers/Title", "FeedBack", "Title", "Id", "ID", "DueDate", "Comments", "Categories", "Status", "Body",
                        "PercentComplete", "ClientCategory", "Priority", "TaskType/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/PortfolioStructureID", "Portfolio/Title",
                        "TaskCategories/Id", "TaskCategories/Title", "TeamMembers/Name", "Project/Id", "Project/PortfolioStructureID", "Project/Title", "Project/PriorityRank", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                        "Created", "Modified", "IsTodaysTask", "workingThisWeek", "WorkingAction"
                    )
                    .expand(
                        "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
                        "TaskCategories", "Project",
                    ).orderBy("orderby", false).filter("(PercentComplete eq 0.0 or PercentComplete eq null or (PercentComplete gt 0.0 and PercentComplete lt 0.89) or PercentComplete eq 0.89)").getAll(5000);

                console.log(AllTasksMatches);
                Counter++;
                console.log(AllTasksMatches.length);
                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
                    $.each(AllTasksMatches, function (index: any, item: any) {
                        item.isDrafted = false;
                        item.flag = true;
                        item.TitleNew = item.Title;
                        item.childs = [];
                        item.siteType = config.Title;
                        item.listId = config.listId;
                        item.siteUrl = ContextValue.siteUrl;
                        item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                        item.fontColorTask = "#000"
                        // if (item?.TaskCategories?.some((category: any) => category.Title.toLowerCase() === "draft")) { item.isDrafted = true; }
                    });
                }
                AllTasks = AllTasks.concat(AllTasksMatches);
                if (Counter == siteConfig.length) {
                    // AllTasks = AllTasks?.filter((type: any) => type.isDrafted === false);
                    map(AllTasks, (result: any) => {
                        result.Id = result.Id != undefined ? result.Id : result.ID;
                        result.TeamLeaderUser = [];
                        result.AllTeamName = result.AllTeamName === undefined ? "" : result.AllTeamName;
                        result.chekbox = false;
                        result.timeSheetsDescriptionSearch = '';
                        result.SmartPriority = 0;
                        result.TaskTypeValue = '';
                        result.projectPriorityOnHover = '';
                        result.taskPriorityOnHover = result?.PriorityRank;
                        result.showFormulaOnHover;
                        result.portfolioItemsSearch = '';
                        result.descriptionsSearch = '';
                        result.commentsSearch = '';
                        result.descriptionsDeliverablesSearch = '';
                        result.descriptionsHelpInformationSarch = '';
                        result.descriptionsShortDescriptionSearch = '';
                        result.descriptionsTechnicalExplanationsSearch = '';
                        result.descriptionsBodySearch = '';
                        result.descriptionsAdminNotesSearch = '';
                        result.descriptionsValueAddedSearch = '';
                        result.descriptionsIdeaSearch = '';
                        result.descriptionsBackgroundSearch = '';
                        result.FeatureTypeTitle = ''
                        if (result?.DueDate != null && result?.DueDate != undefined) {
                            result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
                        }
                        if (result?.Modified != null && result?.Modified != undefined) {
                            result.serverModifiedDate = new Date(result?.Modified).setHours(0, 0, 0, 0)
                        }
                        if (result?.Created != null && result?.Created != undefined) {
                            result.serverCreatedDate = new Date(result?.Created).setHours(0, 0, 0, 0)
                        }
                        result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
                        if (result.DisplayCreateDate == "Invalid date" || "") {
                            result.DisplayCreateDate = result.DisplayCreateDate.replaceAll("Invalid date", "");
                        }
                        // if (result.Author) {
                        //     result.Author.autherImage = findUserByName(result.Author?.Id)

                        // }
                        // if (result.Author) {
                        //     result.Author.Suffix = findUserByName(result.Author?.Id)
                        if (result.Author) {
                            let authImg = findUserByName(result.Author?.Id);
                            if (authImg.Image != undefined && authImg.Image != "") {
                                result.Author.autherImage = authImg.Image
                            } else {
                                result.Author.suffix = authImg.Suffix
                            }
                        }

                        result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
                        if (result.DisplayDueDate == "Invalid date" || "") {
                            result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
                        }
                        result.DisplayModifiedDate = Moment(result.Modified).format("DD/MM/YYYY");
                        if (result.Editor) {
                            let authImg = findUserByName(result.Editor?.Id);
                            if (authImg.Image != undefined && authImg.Image != "") {
                                result.Editor.autherImage = authImg.Image
                            } else {
                                result.Editor.suffix = authImg.Suffix
                            }
                        }
                        if (result?.TaskType) {
                            result.portfolioItemsSearch = result?.TaskType?.Title;
                        }

                        result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                        if (result.PercentComplete != undefined && result.PercentComplete != '' && result.PercentComplete != null) {
                            result.percentCompleteValue = parseInt(result?.PercentComplete);
                        }
                        if (result?.Portfolio != undefined) {
                            allMasterTaskDataFlatLoadeViewBackup.map((item: any) => {
                                if (item.Id === result?.Portfolio?.Id) {
                                    result.Portfolio = item
                                    result.PortfolioType = item?.PortfolioType
                                }
                            })
                        }
                        if (result?.Status === "Not Started") { result.statusColor = "#FFFFFF " } else if (result?.Status === "For Approval") {
                            result.statusColor = " #FFFF00"
                        } else if (result?.Status === "Follow Up") { result.statusColor = " #00FFFF" } else if (result?.Status === "Approved") { result.statusColor = "#00FF00 " } else if (result?.Status === "Checking") {
                            result.statusColor = " #FF00FF"
                        } else if (result?.Status === "Acknowledged") {
                            result.statusColor = " #99FFFF"
                        } else if (result?.Status === "Ready to Go") { result.statusColor = " #FF9900" } else if (result?.Status === "working on it") {
                            result.statusColor = " #FF9900"
                        } else if (result?.Status === "Re-Open") { result.statusColor = " #FF3300" } else if (result?.Status === "Deployment Pending") { result.statusColor = " #FF3300" } else if (result?.Status === "In QA Review") {
                            result.statusColor = " #9900FF"
                        } else if (result?.Status === "Task completed") { result.statusColor = " #009900" } else if (result?.Status === "For Review") { result.statusColor = " #003366" } else if (result?.Status === "Follow-up later") {
                            result.statusColor = " #006666"
                        } else if (result?.Status === "Completed") { result.statusColor = " #006600" } else if (result?.Status === " Closed") { result.statusColor = " #999999" }

                        result.chekbox = false;
                        if (result?.FeedBack && result?.FeedBack != undefined) {
                            const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
                            let descriptionSearchData = '';
                            try {
                                const feedbackData = JSON.parse(result.FeedBack);
                                descriptionSearchData = feedbackData[0]?.FeedBackDescriptions?.map((child: any) => {
                                    const childText = cleanText(child?.Title);
                                    const comments = (child?.Comments || [])?.map((comment: any) => {
                                        const commentText = cleanText(comment?.Title);
                                        const replyText = (comment?.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                                        return [commentText, replyText]?.filter(Boolean).join(' ');
                                    }).join(' ');

                                    const subtextData = (child.Subtext || [])?.map((subtext: any) => {
                                        const subtextComment = cleanText(subtext?.Title);
                                        const subtextReply = (subtext.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                                        const subtextComments = (subtext.Comments || [])?.map((subComment: any) => {
                                            const subCommentTitle = cleanText(subComment?.Title);
                                            const subCommentReplyText = (subComment.ReplyMessages || []).map((val: any) => cleanText(val?.Title)).join(' ');
                                            return [subCommentTitle, subCommentReplyText]?.filter(Boolean).join(' ');
                                        }).join(' ');
                                        return [subtextComment, subtextReply, subtextComments].filter(Boolean).join(' ');
                                    }).join(' ');

                                    return [childText, comments, subtextData].filter(Boolean).join(' ');
                                }).join(' ');

                                result.descriptionsSearch = descriptionSearchData;
                            } catch (error) {
                                console.error("Error:", error);
                            }
                        }

                        try {
                            if (result?.Comments != null && result?.Comments != undefined) {
                                const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
                                const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                                const commentsFormData = JSON?.parse(cleanedComments);
                                const searchData = commentsFormData?.reduce((accumulator: any, comment: any) => {
                                    return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                                }, "").trim();
                                result.commentsSearch = cleanText(searchData);
                            }
                        } catch (error) {
                            console.error("An error occurred:", error);
                        }
                        try {
                            if (result?.WorkingAction) {
                                const workingActionValue = JSON.parse(result.WorkingAction);
                                const relevantTitles: any = ["Bottleneck", "Attention", "Phone", "Approval"];
                                result.workingActionValue = workingActionValue;
                                result.workingActionTitle = workingActionValue?.filter((elem: any) => relevantTitles?.includes(elem.Title))?.map((elem: any) => elem.Title)?.join(" ");
                                const todayStr = Moment().format('DD/MM/YYYY');
                                result.workingDetailsBottleneck = workingActionValue?.find((item: any) => item.Title === 'Bottleneck' && item?.InformationData?.length > 0);
                                result.workingDetailsAttention = workingActionValue?.find((item: any) => item.Title === 'Attention' && item?.InformationData?.length > 0);
                                result.workingDetailsPhone = workingActionValue?.find((item: any) => item.Title === 'Phone' && item?.InformationData?.length > 0);
                                const workingDetails = workingActionValue?.find((item: any) => item.Title === 'WorkingDetails');
                                if (workingDetails) { result.workingTodayUsers = workingDetails?.InformationData?.filter((detail: any) => detail.WorkingDate === todayStr); }
                            }
                        } catch (error) {
                            console.error("An error occurred:", error);
                        }
                        if (
                            result.AssignedTo != undefined &&
                            result.AssignedTo.length > 0
                        ) {
                            map(result.AssignedTo, (Assig: any) => {
                                if (Assig.Id != undefined) {
                                    map(AllUsers, (users: any) => {
                                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                            if(!(result.AllTeamName.includes(users.Title))){
                                                result.AllTeamName += users.Title + ";";
                                            }
                                            
                                        }
                                    });
                                }
                            });
                        }
                        if (result.ResponsibleTeam != undefined && result.ResponsibleTeam.length > 0) {
                            map(result.ResponsibleTeam, (Assig: any) => {
                                if (Assig.Id != undefined) {
                                    map(AllUsers, (users: any) => {
                                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                            if(!(result.AllTeamName.includes(users.Title))){
                                                result.AllTeamName += users.Title + ";";
                                            }
                                            
                                        }
                                    });
                                }
                            });
                        }
                        if (
                            result.TeamMembers != undefined &&
                            result.TeamMembers.length > 0
                        ) {
                            map(result.TeamMembers, (Assig: any) => {
                                if (Assig.Id != undefined) {
                                    map(AllUsers, (users: any) => {
                                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.TeamLeaderUser.push(users);
                                            if(!(result.AllTeamName.includes(users.Title))){
                                                result.AllTeamName += users.Title + ";";
                                            }
                                            
                                        }
                                    });
                                }
                            });
                        }
                        if (result?.TaskCategories?.length > 0) {
                            result.TaskTypeValue = result?.TaskCategories?.map((val: any) => val.Title).join(",")
                        }

                        if (result?.ClientCategory?.length > 0) {
                            result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                        } else {
                            result.ClientCategorySearch = ''
                        }
                        result["TaskID"] = globalCommon.GetTaskId(result);
                        if (result.Project) {
                            result.ProjectTitle = result?.Project?.Title;
                            result.ProjectId = result?.Project?.Id;
                            result.projectStructerId = result?.Project?.PortfolioStructureID
                            const title = result?.Project?.Title || '';
                            const formattedDueDate = Moment(result?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                            result.joinedData = [];
                            if (result?.projectStructerId && title || formattedDueDate) {
                                result.joinedData.push(`Project ${result?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                            }
                        }
                        result.SmartPriority = globalCommon.calculateSmartPriority(result);
                        result = globalCommon.findTaskCategoryParent(taskCatagory, result);
                        result["Item_x0020_Type"] = "Task";
                        TasksItem.push(result);
                        AllTasksData.push(result);
                    });
                    setAllSiteTasksData(AllTasksData);
                    countTaskAWTLevel(AllTasksData, '');
                    setIsCallTask(1);
                    // let taskBackup = JSON.parse(JSON.stringify(AllTasksData));
                    // allTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(AllTasksData))
                    try {
                        allTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(AllTasksData))
                    } catch (error) {
                        console.log("backup Json parse error Page Loade Task Data");
                    }
                    // allLoadeDataMasterTaskAndTask = allLoadeDataMasterTaskAndTask.concat(taskBackup);
                }

            });
            // GetComponents();
        }
    };
    const GetComponents = async () => {
        if (portfolioTypeData.length > 0) {
            portfolioTypeData?.map((elem: any) => {
                if (isUpdated === "") {
                    filt = "";
                } else if (isUpdated === elem.Title || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) { filt = "(PortfolioType/Title eq '" + elem.Title + "' ) or (Item_x0020_Type eq 'Project' or Item_x0020_Type eq 'Sprint')" }
                // else if (isUpdated === elem.Title || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) { filt = "(PortfolioType/Title eq '" + elem.Title + "')" }
            })
        }
        let web = new Web(ContextValue.siteUrl);
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(ContextValue.MasterTaskListID)
            .items
            .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Comments", "ItemRank", "Portfolio_x0020_Type", "Parent/Id", "Parent/Title", "HelpInformationVerifiedJson", "HelpInformationVerified",
                "DueDate", "Body", "Item_x0020_Type", "Categories", "Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
                "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", "PercentComplete",
                "ResponsibleTeam/Id", "ResponsibleTeam/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                "Created", "Modified", "Deliverables", "TechnicalExplanations", "Help_x0020_Information", "AdminNotes", "Background", "Idea", "ValueAdded", "Sitestagging", "FeatureType/Title", "FeatureType/Id"
            )
            .expand(
                "Parent", "PortfolioType", "AssignedTo", "ClientCategory", "TeamMembers", "ResponsibleTeam", "Editor", "Author", "FeatureType"
            )
            .top(4999)
            .filter(filt)
            .get();

        console.log(componentDetails);
        ProjectData = componentDetails.filter((projectItem: any) => projectItem.Item_x0020_Type === "Project" || projectItem.Item_x0020_Type === 'Sprint');
        componentDetails.forEach((result: any) => {
            result.siteUrl = ContextValue?.siteUrl;
            result["siteType"] = "Master Tasks";
            result.listId = ContextValue?.MasterTaskListID;
            result.AllTeamName = "";
            result.SmartPriority = 0;
            result.TaskTypeValue = '';
            result.timeSheetsDescriptionSearch = '';
            result.commentsSearch = '';
            result.descriptionsSearch = '';
            result.descriptionsDeliverablesSearch = '';
            result.descriptionsHelpInformationSarch = '';
            result.descriptionsShortDescriptionSearch = '';
            result.descriptionsTechnicalExplanationsSearch = '';
            result.descriptionsBodySearch = '';
            result.descriptionsAdminNotesSearch = '';
            result.descriptionsValueAddedSearch = '';
            result.descriptionsIdeaSearch = '';
            result.descriptionsBackgroundSearch = '';
            result.portfolioItemsSearch = result.Item_x0020_Type;
            result.TeamLeaderUser = [];
            if (result.Item_x0020_Type === 'Component') {
                result.boldRow = 'boldClable'
                result.lableColor = 'f-bg';
            }
            if (result.Item_x0020_Type === 'SubComponent') {
                result.lableColor = 'a-bg';
            }
            if (result.Item_x0020_Type === 'Feature') {
                result.lableColor = 'w-bg';
            }
            if (result?.Item_x0020_Type != undefined) {
                result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
            }
            result["TaskID"] = result?.PortfolioStructureID;
            result.FeatureTypeTitle = ''
            if (result?.FeatureType?.Id != undefined) {
                result.FeatureTypeTitle = result?.FeatureType?.Title
            }
            if (result?.DueDate != null && result?.DueDate != undefined) {
                result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
            }
            if (result?.Modified != null && result?.Modified != undefined) {
                result.serverModifiedDate = new Date(result?.Modified).setHours(0, 0, 0, 0)
            }
            if (result?.Created != null && result?.Created != undefined) {
                result.serverCreatedDate = new Date(result?.Created).setHours(0, 0, 0, 0)
            }
            result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
            if (result.DisplayCreateDate == "Invalid date" || "") {
                result.DisplayCreateDate = result.DisplayCreateDate.replaceAll("Invalid date", "");
            }
            result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
            if (result.DisplayDueDate == "Invalid date" || "") {
                result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
            }
            if (result.Author) {
                let authImg = findUserByName(result.Author?.Id);
                if (authImg.Image != undefined && authImg.Image != "") {
                    result.Author.autherImage = authImg.Image
                } else {
                    result.Author.suffix = authImg.Suffix
                }
            }
            result.DisplayModifiedDate = Moment(result.Modified).format("DD/MM/YYYY");
            if (result.Editor) {
                let authImg = findUserByName(result.Editor?.Id);
                if (authImg.Image != undefined && authImg.Image != "") {
                    result.Editor.autherImage = authImg.Image
                } else {
                    result.Editor.suffix = authImg.Suffix
                }
            }
            result.PercentComplete = (result?.PercentComplete * 100).toFixed(0) === "0" ? "" : (result?.PercentComplete * 100).toFixed(0);
            if (result.PercentComplete != undefined && result.PercentComplete != '' && result.PercentComplete != null) {
                result.percentCompleteValue = parseInt(result?.PercentComplete);
            }
            if (result?.Deliverables != undefined || result.Short_x0020_Description_x0020_On != undefined || result.TechnicalExplanations != undefined || result.Body != undefined || result.AdminNotes != undefined || result.ValueAdded != undefined
                || result.Idea != undefined || result.Background != undefined) {
                result.descriptionsSearch = `${removeHtmlAndNewline(result.Deliverables)} ${removeHtmlAndNewline(result.Short_x0020_Description_x0020_On)} ${removeHtmlAndNewline(result.TechnicalExplanations)} ${removeHtmlAndNewline(result.Body)} ${removeHtmlAndNewline(result.AdminNotes)} ${removeHtmlAndNewline(result.ValueAdded)} ${removeHtmlAndNewline(result.Idea)} ${removeHtmlAndNewline(result.Background)}`;
            }
            if (result?.Deliverables != undefined) {
                result.descriptionsDeliverablesSearch = `${removeHtmlAndNewline(result.Deliverables)}`;
            }
            if (result.Help_x0020_Information != undefined) {
                result.descriptionsHelpInformationSarch = `${removeHtmlAndNewline(result?.Help_x0020_Information)}`;
            }
            if (result.Short_x0020_Description_x0020_On != undefined) {
                result.descriptionsShortDescriptionSearch = ` ${removeHtmlAndNewline(result.Short_x0020_Description_x0020_On)} `;
            }
            if (result.TechnicalExplanations != undefined) {
                result.descriptionsTechnicalExplanationsSearch = `${removeHtmlAndNewline(result.TechnicalExplanations)}`;
            }
            if (result.Body != undefined) {
                result.descriptionsBodySearch = `${removeHtmlAndNewline(result.Body)}`;
            }
            if (result.AdminNotes != undefined) {
                result.descriptionsAdminNotesSearch = `${removeHtmlAndNewline(result.AdminNotes)}`;
            }
            if (result.ValueAdded != undefined) {
                result.descriptionsValueAddedSearch = `${removeHtmlAndNewline(result.ValueAdded)}`;
            }
            if (result.Idea != undefined) {
                result.descriptionsIdeaSearch = `${removeHtmlAndNewline(result.Idea)}`;
            }
            if (result.Background != undefined) {
                result.descriptionsBackgroundSearch = `${removeHtmlAndNewline(result.Background)}`;
            }
            try {
                if (result?.Comments != null && result?.Comments != undefined) {
                    const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
                    const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                    const commentsFormData = JSON?.parse(cleanedComments);
                    const searchData = commentsFormData?.reduce((accumulator: any, comment: any) => {
                        return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                    }, "").trim();
                    result.commentsSearch = cleanText(searchData);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
            result.Id = result.Id != undefined ? result.Id : result.ID;
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                map(result.AssignedTo, (Assig: any) => {
                    if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                if(!(result.AllTeamName.includes(users.Title))){
                                    result.AllTeamName += users.Title + ";";
                                }
                                
                            }
                        });
                    }
                });
            }
            if (
                result.ResponsibleTeam != undefined &&
                result.ResponsibleTeam.length > 0
            ) {
                map(result.ResponsibleTeam, (Assig: any) => {
                    if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                if(!(result.AllTeamName.includes(users.Title))){
                                    result.AllTeamName += users.Title + ";";
                                }
                            }
                        });
                    }
                });
            }
            if (result.TeamMembers != undefined && result.TeamMembers.length > 0) {
                map(result.TeamMembers, (Assig: any) => {
                    if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                if(!(result.AllTeamName.includes(users.Title))){
                                    result.AllTeamName += users.Title + ";";
                                }
                            }
                        });
                    }
                });
            }
            portfolioTypeDataItem?.map((type: any) => {
                if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                    type[type.Title + 'number'] += 1;
                    type[type.Title + 'filterNumber'] += 1;
                }
            })
            if (result?.ClientCategory?.length > 0) {
                result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
            } else {
                result.ClientCategorySearch = ''
            }
        });
        let portfolioLabelCountBackup: any = []
        try {
            portfolioLabelCountBackup = JSON.parse(JSON.stringify(portfolioTypeDataItem));
        } catch (error) {
            console.log("backup Json parse error Page Loade master Data");
        }
        setPortFolioTypeIconBackup(portfolioLabelCountBackup);
        setAllMasterTasks(componentDetails)

        try {
            allMasterTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(componentDetails));
            allLoadeDataMasterTaskAndTask = JSON.parse(JSON.stringify(componentDetails));
        } catch (error) {
            console.log("backup Json parse error Page Loade master task Data");
        }
        AllComponetsData = componentDetails;
        ComponetsData["allComponets"] = componentDetails;
        setIsCallComponent(1);
    };
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let query = params.get("PortfolioType");
        if (query) {
            setIsUpdated(query);
            isUpdated = query;
        }
        let smartFavoriteIdParam = params.get("SmartfavoriteId");
        if (smartFavoriteIdParam) {
            setIsSmartfavoriteId(smartFavoriteIdParam);
        }
        let smartFavoriteParam = params.get("smartfavorite");
        if (smartFavoriteParam) {
            setIsSmartfavorite(smartFavoriteParam);
        }
    }, [])

    React.useEffect(() => {
        if (isUpdated != "") {
            if (portfolioTypeData.length > 0) {
                portfolioTypeData?.map((elem: any) => {
                    if (elem.Title === isUpdated || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) {
                        portfolioColor = elem.Color;
                        document?.documentElement?.style?.setProperty('--SiteBlue', elem?.Color);
                        document?.documentElement?.style?.setProperty('--SiteBlue', elem?.Color);
                    }
                })
            }
        } else {
            if (portfolioTypeData.length > 0) {
                portfolioTypeData?.map((elem: any) => {
                    if (elem.Title === "Component") {
                        portfolioColor = elem.Color;
                        document?.documentElement?.style?.setProperty('--SiteBlue', elem?.Color);

                    }
                })
            }
        }

    }, [AllSiteTasksData])

    React.useEffect(() => {
        findPortFolioIconsAndPortfolio();
        GetSmartmetadata();
        getTaskUsers();
        getPortFolioType();
        getTaskType();
    }, [])

    React.useEffect(() => {
        if (AllMetadata.length > 0 && portfolioTypeData.length > 0) {
            GetComponents();
            LoadAllSiteTasks();
            // LoadAllSiteTasksAllData();
        }
    }, [AllMetadata.length > 0 && portfolioTypeData.length > 0])

    React.useEffect(() => {
        if (AllSiteTasksData?.length > 0 && AllMasterTasksData?.length > 0) {
            setFilterCounters(true);
        } else if ((isCallTask === 1 && isCallComponent === 1) && ((AllSiteTasksData?.length === 0 && AllMasterTasksData?.length === 0) || (AllSiteTasksData?.length > 0 && AllMasterTasksData?.length === 0) || (AllSiteTasksData?.length === 0 && AllMasterTasksData?.length > 0))) {
            setFilterCounters(true);
        }
    }, [(AllSiteTasksData && AllMasterTasksData) && (isCallTask && isCallComponent)])

    const firstTimeFullDataGrouping = () => {
        if (allLoadeDataMasterTaskAndTask?.length > 0) {
            countAllTasksData = [];
            let count = 0;
            if (IsUpdated === "") {
                portfolioTypeData?.map((port: any, index: any) => {
                    count = count + 1
                    AllcomponentGrouping(port?.Id, index);
                })
            } else if (IsUpdated.length) {
                portfolioTypeData?.map((port: any) => {
                    if (IsUpdated.toLowerCase() === port?.Title?.toLowerCase()) {
                        count = count + 1
                        AllcomponentGrouping(port?.Id, '');
                    }
                })
            }
            countTaskAWTLevel(allTaskDataFlatLoadeViewBackup, '');
            // countAllTasksData = countAllTasksData?.filter((ele: any, ind: any, arr: any) => {
            //     const isDuplicate = arr.findIndex((elem: any) => {
            //         return (elem.ID === ele.ID || elem.Id === ele.Id) && elem.siteType === ele.siteType;
            //     }) !== ind
            //     return !isDuplicate;
            // })
            // countTaskAWTLevel(countAllTasksData, '');
            console.log("dataAllGrupingdataAllGrupingdataAllGrupingdataAllGruping ========", dataAllGruping);
            setLoaded(true);
            rerender();
        }
    }

    const AllcomponentGrouping = (portId: any, index: any) => {
        let FinalComponentAll: any = []
        let AllProtFolioData = allLoadeDataMasterTaskAndTask?.filter((comp: any) => comp?.PortfolioType?.Id === portId && comp.TaskType === undefined);
        let AllComponents = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === 0 || comp?.Parent?.Id === undefined);
        AllComponents?.map((masterTask: any) => {
            masterTask.subRows = [];
            taskTypeData?.map((levelType: any) => {
                if (levelType.Level === 1)
                    componentAllTaskActivity(levelType, masterTask);
            })
            let subComFeat = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === masterTask?.Id)
            masterTask.subRows = masterTask?.subRows?.concat(subComFeat);
            subComFeat?.forEach((subComp: any) => {
                subComp.subRows = [];
                taskTypeData?.map((levelType: any) => {
                    if (levelType.Level === 1)
                        componentAllTaskActivity(levelType, subComp);
                })
                let allFeattData = AllProtFolioData?.filter((elem: any) => elem?.Parent?.Id === subComp?.Id);
                subComp.subRows = subComp?.subRows?.concat(allFeattData);
                allFeattData?.forEach((subFeat: any) => {
                    subFeat.subRows = [];
                    taskTypeData?.map((levelType: any) => {
                        if (levelType.Level === 1)
                            componentAllTaskActivity(levelType, subFeat);
                    })
                })
            })
            FinalComponentAll.push(masterTask)
        })
        AllDataTaskcomponentData = AllDataTaskcomponentData?.concat(FinalComponentAll);
        DynamicSort(AllDataTaskcomponentData, 'PortfolioLevel', '')
        AllDataTaskcomponentData.forEach((element: any) => {
            if (element?.subRows?.length > 0) {
                let level = element?.subRows?.filter((obj: any) => obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task");
                let leveltask = element?.subRows?.filter((obj: any) => obj.Item_x0020_Type === "Task");
                DynamicSort(level, 'Item_x0020_Type', 'asc')
                element.subRows = [];
                element.subRows = level.concat(leveltask)
            }
            if (element?.subRows != undefined) {
                element?.subRows?.forEach((obj: any) => {
                    let level1 = obj?.subRows?.filter((obj: any) => obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task");
                    let leveltask1 = obj?.subRows?.filter((obj: any) => obj.Item_x0020_Type === "Task");
                    DynamicSort(level1, 'Item_x0020_Type', 'asc')
                    obj.subRows = [];
                    obj.subRows = level1?.concat(leveltask1)
                })
            }
        });
        if (portfolioTypeData?.length - 1 === index || index === '') {
            var temp: any = {};
            temp.Title = "Others";
            temp.TaskID = "";
            temp.subRows = [];
            temp.PercentComplete = "";
            temp.ItemRank = "";
            temp.DueDate = "";
            temp.Project = "";
            temp.DisplayCreateDate = null;
            temp.DisplayDueDate = null;
            temp.DisplayModifiedDate = null;
            temp.TaskTypeValue = "";
            temp.AllTeamName = '';
            temp.ClientCategorySearch = '';
            temp.Created = null;
            temp.Author = "";
            temp.subRows = allLoadeDataMasterTaskAndTask?.filter((elem1: any) => elem1?.TaskType?.Id != undefined && elem1?.ParentTask?.Id === undefined && (elem1?.Portfolio?.Title === undefined || elem1?.Portfolio?.Title === null));
            countAllTasksData = countAllTasksData.concat(temp.subRows);
            temp.subRows.forEach((task: any) => {
                if (task.TaskID === undefined || task.TaskID === '') {
                    task.TaskID = 'T' + task.Id;
                }
                task.subRows = [];
                let worstreamAndTask = allLoadeDataMasterTaskAndTask?.filter((taskData: any) => taskData?.ParentTask?.Id === task?.Id && taskData?.siteType === task?.siteType)
                if (worstreamAndTask.length > 0) {
                    task.subRows = task?.subRows?.concat(worstreamAndTask);
                    AfterFilterTaskCount = AfterFilterTaskCount.concat(worstreamAndTask);
                }
                worstreamAndTask?.forEach((wrkst: any) => {
                    wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
                    let allTasksData = allLoadeDataMasterTaskAndTask?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
                    if (allTasksData.length > 0) {
                        wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
                        AfterFilterTaskCount = AfterFilterTaskCount.concat(allTasksData);
                    }
                })
            })
            AllDataTaskcomponentData.push(temp);
        }
        seDataAllGruping(AllDataTaskcomponentData);
        console.log(countAllTasksData);
        console.log("First Grouping Data is ", AllDataTaskcomponentData)
    }
    const componentAllTaskActivity = (levelType: any, items: any) => {
        let findActivity = allLoadeDataMasterTaskAndTask?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id);
        let findTasks = allLoadeDataMasterTaskAndTask?.filter((elem1: any) => elem1?.TaskType?.Id != levelType.Id && (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined) && elem1?.Portfolio?.Id === items?.Id);
        countAllTasksData = countAllTasksData.concat(findTasks)
        countAllTasksData = countAllTasksData.concat(findActivity)
        findActivity?.forEach((act: any) => {
            act.subRows = [];
            let worstreamAndTask = allLoadeDataMasterTaskAndTask?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
            if (worstreamAndTask.length > 0) {
                act.subRows = act?.subRows?.concat(worstreamAndTask);
                countAllTasksData = countAllTasksData.concat(worstreamAndTask)
            }
            worstreamAndTask?.forEach((wrkst: any) => {
                wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
                let allTasksData = allLoadeDataMasterTaskAndTask?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
                if (allTasksData.length > 0) {
                    wrkst.subRows = wrkst?.subRows?.concat(allTasksData)
                    countAllTasksData = countAllTasksData.concat(allTasksData)
                }
            })
        })
        items.subRows = items?.subRows?.concat(findActivity)
        items.subRows = items?.subRows?.concat(findTasks)
    }
    const smartFiltercallBackData = React.useCallback((filterData, updatedSmartFilter, smartTimeTotal, flatView) => {
        if (filterData.length > 0 && smartTimeTotal) {
            setUpdatedSmartFilter(updatedSmartFilter);
            setUpdatedSmartFilterFlatView(flatView);
            setAllSmartFilterOriginalData(filterData);
            let filterDataBackup: any = []
            try {
                filterDataBackup = JSON.parse(JSON.stringify(filterData));
            } catch (error) {
                console.log("backup Json parse error smartFiltercallBackData function");
            }
            setAllSmartFilterData(filterDataBackup);
            setSmartTimeTotalFunction(() => smartTimeTotal);
        } else if (updatedSmartFilter === true && filterData.length === 0) {
            renderData = [];
            renderData = renderData.concat(filterData)
            refreshData();
            setLoaded(true);
        }
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            const panelMain: any = document.querySelector('.ms-Panel-main');
            if (panelMain && portfolioColor) {
                $('.ms-Panel-main').css('--SiteBlue', portfolioColor); // Set the desired color value here
            }
        }, 1500)
    }, [isOpenActivity, isOpenWorkstream, openCompareToolPopup, OpenAddStructurePopup, ActivityPopup]);

    React.useEffect(() => {
        if (smartAllFilterData?.length > 0 && updatedSmartFilter === false) {
            isColumnDefultSortingAsc = false
            hasCustomExpanded = true
            hasExpanded = true
            isHeaderNotAvlable = false
            setLoaded(false);
            componentData = [];
            AfterFilterTaskCount = [];
            let count = 0;
            let afterFilter = true;
            setAllSmartFilterDataBackup(structuredClone(smartAllFilterData));
            if (IsUpdated === "") {
                portfolioTypeData?.map((port: any, index: any) => {
                    count = count + 1;
                    componentGrouping(port?.Id, index);
                })
            } else if (IsUpdated.length) {
                portfolioTypeData?.map((port: any) => {
                    if (IsUpdated.toLowerCase() === port?.Title?.toLowerCase()) {
                        count = count + 1;
                        componentGrouping(port?.Id, '');
                    }
                })
            }
            taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
            AfterFilterTaskCount = AfterFilterTaskCount?.filter((ele: any, ind: any, arr: any) => {
                const isDuplicate = arr.findIndex((elem: any) => { return (elem.ID === ele.ID || elem.Id === ele.Id) && elem.siteType === ele.siteType; }) !== ind
                return !isDuplicate;
            })
            countTaskAWTLevel(AfterFilterTaskCount, afterFilter);
            childRef?.current?.setRowSelection({});
            childRef?.current?.setColumnFilters([]);
            childRef?.current?.setGlobalFilter('');
        }
        if (smartAllFilterData?.length > 0 && updatedSmartFilter === true && updatedSmartFilterFlatView === false) {
            isColumnDefultSortingAsc = false
            hasCustomExpanded = true
            hasExpanded = true
            isHeaderNotAvlable = false
            setLoaded(false);
            filterCount = 0;
            componentDataCopyBackup = [];
            setDataBackup([]);
            setDataBackup(structuredClone(AllSmartFilterDataBackup));
            componentDataCopyBackup = structuredClone(componentData);
            filterDataAfterUpdate();
        } else if (smartAllFilterData?.length > 0 && updatedSmartFilter === true && updatedSmartFilterFlatView === true) {
            let afterFilter = true;
            taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
            countTaskAWTLevel(smartAllFilterData, afterFilter)
            portfolioTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
            countComponentLevel(smartAllFilterData, afterFilter)
            setLoaded(true);
            updatedSmartFilterFlatViewData(smartAllFilterData);
        }
    }, [smartAllFilterData]);
    function structuredClone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
    const DynamicSort = function (items: any, column: any, orderby: any) {
        items?.sort(function (a: any, b: any) {
            var aID = a[column];
            var bID = b[column];
            if (orderby === 'asc')
                return (aID == bID) ? 0 : (aID < bID) ? 1 : -1;
            else
                return aID == bID ? 0 : aID > bID ? 1 : -1;
        });
    };
    const componentGrouping = (portId: any, index: any) => {
        let FinalComponent: any = []
        let AllProtFolioData = smartAllFilterData?.filter((comp: any) => comp?.PortfolioType?.Id === portId && comp.TaskType === undefined);
        let AllComponents = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === 0 || comp?.Parent?.Id === undefined);
        AllComponents?.map((masterTask: any) => {
            masterTask.subRows = [];
            taskTypeData?.map((levelType: any) => {
                if (levelType.Level === 1)
                    componentActivity(levelType, masterTask);
            })
            let subComFeat = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === masterTask?.Id)
            masterTask.subRows = masterTask?.subRows?.concat(subComFeat);
            subComFeat?.forEach((subComp: any) => {
                subComp.subRows = [];
                taskTypeData?.map((levelType: any) => {
                    if (levelType.Level === 1)
                        componentActivity(levelType, subComp);
                })
                let allFeattData = AllProtFolioData?.filter((elem: any) => elem?.Parent?.Id === subComp?.Id);
                subComp.subRows = subComp?.subRows?.concat(allFeattData);
                allFeattData?.forEach((subFeat: any) => {
                    subFeat.subRows = [];
                    taskTypeData?.map((levelType: any) => {
                        if (levelType.Level === 1)
                            componentActivity(levelType, subFeat);
                    })
                })
            })
            FinalComponent.push(masterTask)
        })
        componentData = componentData?.concat(FinalComponent);
        DynamicSort(componentData, 'PortfolioLevel', '')
        componentData.forEach((element: any) => {
            if (element?.subRows?.length > 0) {
                let level = element?.subRows?.filter((obj: any) => obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task");
                let leveltask = element?.subRows?.filter((obj: any) => obj.Item_x0020_Type === "Task");
                DynamicSort(level, 'Item_x0020_Type', 'asc')
                element.subRows = [];
                element.subRows = level.concat(leveltask)
            }
            if (element?.subRows != undefined) {
                element?.subRows?.forEach((obj: any) => {
                    let level1 = obj?.subRows?.filter((obj: any) => obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task");
                    let leveltask1 = obj?.subRows?.filter((obj: any) => obj.Item_x0020_Type === "Task");
                    DynamicSort(level1, 'Item_x0020_Type', 'asc')
                    obj.subRows = [];
                    obj.subRows = level1?.concat(leveltask1)
                })
            }
        });
        if (portfolioTypeData?.length - 1 === index || index === '') {
            var temp: any = {};
            temp.Title = "Others";
            temp.TaskID = "";
            temp.subRows = [];
            temp.PercentComplete = "";
            temp.ItemRank = "";
            temp.DueDate = "";
            temp.Project = "";
            temp.DisplayCreateDate = null;
            temp.DisplayDueDate = null;
            temp.DisplayModifiedDate = null;
            temp.TaskTypeValue = "";
            temp.AllTeamName = '';
            temp.ClientCategorySearch = '';
            temp.Created = null;
            temp.Author = "";
            temp.subRows = smartAllFilterData?.filter((elem1: any) => elem1?.TaskType?.Id != undefined && elem1?.ParentTask?.Id === undefined && (elem1?.Portfolio?.Title === undefined || elem1?.Portfolio?.Title === null));
            AfterFilterTaskCount = AfterFilterTaskCount.concat(temp.subRows);
            temp.subRows.forEach((task: any) => {
                if (task.TaskID === undefined || task.TaskID === '') {
                    task.TaskID = 'T' + task.Id;
                }
                task.subRows = [];
                let worstreamAndTask = smartAllFilterData?.filter((taskData: any) => taskData?.ParentTask?.Id === task?.Id && taskData?.siteType === task?.siteType)
                if (worstreamAndTask.length > 0) {
                    task.subRows = task?.subRows?.concat(worstreamAndTask);
                    AfterFilterTaskCount = AfterFilterTaskCount.concat(worstreamAndTask);
                }
                worstreamAndTask?.forEach((wrkst: any) => {
                    wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
                    let allTasksData = smartAllFilterData?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
                    if (allTasksData.length > 0) {
                        wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
                        AfterFilterTaskCount = AfterFilterTaskCount.concat(allTasksData);
                    }
                })
            })
            componentData.push(temp)
        }
        setLoaded(true);
        setData(componentData);
        console.log(AfterFilterTaskCount);
    }
    const componentActivity = (levelType: any, items: any) => {
        if (items.ID === 5610) {
            console.log("items", items);
        }
        let findActivity = smartAllFilterData?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id);
        let findTasks = smartAllFilterData?.filter((elem1: any) => elem1?.TaskType?.Id != levelType.Id && (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined) && elem1?.Portfolio?.Id === items?.Id);
        AfterFilterTaskCount = AfterFilterTaskCount.concat(findTasks);
        AfterFilterTaskCount = AfterFilterTaskCount.concat(findActivity);

        findActivity?.forEach((act: any) => {
            act.subRows = [];
            let worstreamAndTask = smartAllFilterData?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
            if (worstreamAndTask.length > 0) {
                act.subRows = act?.subRows?.concat(worstreamAndTask);
                AfterFilterTaskCount = AfterFilterTaskCount.concat(worstreamAndTask);
            }
            worstreamAndTask?.forEach((wrkst: any) => {
                wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
                let allTasksData = smartAllFilterData?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
                if (allTasksData.length > 0) {
                    wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
                    AfterFilterTaskCount = AfterFilterTaskCount.concat(allTasksData);
                }
            })
        })
        items.subRows = items?.subRows?.concat(findActivity)
        items.subRows = items?.subRows?.concat(findTasks)
    }

    const countTaskAWTLevel = (countTaskAWTLevel: any, afterFilter: any) => {
        if (countTaskAWTLevel.length > 0 && afterFilter !== true) {
            taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'number'] = 0 });
            countTaskAWTLevel?.map((result: any) => {
                taskTypeDataItem?.map((type: any) => {
                    if (result?.TaskType?.Title === type.Title) {
                        type[type.Title + 'number'] += 1;
                    }
                });
            });
        } else if (countTaskAWTLevel?.length > 0 && afterFilter === true) {
            countTaskAWTLevel?.map((result: any) => {
                taskTypeDataItem?.map((type: any) => {
                    if (result?.TaskType?.Title === type.Title) {
                        type[type.Title + 'filterNumber'] += 1;
                    }
                });
            });
            let taskLabelCountBackup: any = []
            try {
                taskLabelCountBackup = JSON.parse(JSON.stringify(taskTypeDataItem));
            } catch (error) {
                console.log('Json parse error countTaskAWTLevel function');
            }
            setTaskTypeDataItemBackup(taskLabelCountBackup)
        }
    };
    const countComponentLevel = (countTaskAWTLevel: any, afterFilter: any) => {
        if (countTaskAWTLevel?.length > 0 && afterFilter === true) {
            countTaskAWTLevel?.map((result: any) => {
                portfolioTypeDataItem?.map((type: any) => {
                    if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                        type[type.Title + 'filterNumber'] += 1;
                    }
                })
            })
        }
    }

    const filterDataAfterUpdate = () => {
        setLoaded(false);
        let count = 0;
        let afterFilter = true;
        let dataAllGrupingBackup: any = [];
        if (dataAllGruping?.length > 0) {
            try {
                dataAllGrupingBackup = JSON.parse(JSON.stringify(dataAllGruping));
            } catch (error) {
                console.log('Json parse error filterDataAfterUpdate function');
            }
        } else {
            try {
                dataAllGrupingBackup = JSON.parse(JSON.stringify(componentData));
            } catch (error) {

            }
        }
        smartAllFilterData?.map((filterItem: any) => {
            count = count + 1;
            updatedSmartFilterGrouping(filterItem, dataAllGrupingBackup);
        });
        if (smartAllFilterData?.length > 0 && count === smartAllFilterData?.length && taskTypeDataItem?.length > 0) {
            taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
            countTaskAWTLevel(smartAllFilterData, afterFilter)
        }
        if (smartAllFilterData?.length > 0 && count === smartAllFilterData?.length && portfolioTypeDataItem?.length > 0) {
            portfolioTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
            countComponentLevel(smartAllFilterData, afterFilter)
        }
    }
    const updatedSmartFilterGrouping = (filterItem: any, dataAllGrupingBackup: any) => {
        filterCount = filterCount + 1;
        let finalData: any = []
        let finalDataCopy: any = []
        dataAllGrupingBackup?.map((comp: any) => {
            if (comp.Id === filterItem?.Id) {
                comp.filterFlag = true
            }
            comp?.subRows?.map((subComp: any) => {
                if (subComp?.Id === filterItem?.Id && filterItem?.siteType === subComp?.siteType) {
                    comp.filterFlag = true
                    subComp.filterFlag = true
                    if (filterItem?.TotalTaskTime) {
                        subComp.TotalTaskTime = filterItem?.TotalTaskTime
                    }
                }
                subComp?.subRows?.map((feat: any) => {
                    if (feat.Id === filterItem?.Id && filterItem?.siteType === feat?.siteType) {
                        comp.filterFlag = true
                        subComp.filterFlag = true
                        feat.filterFlag = true
                        if (filterItem?.TotalTaskTime) {
                            feat.TotalTaskTime = filterItem?.TotalTaskTime
                        }
                    }
                    feat?.subRows?.map((act: any) => {
                        if (act.Id === filterItem?.Id && filterItem?.siteType === act?.siteType) {
                            comp.filterFlag = true
                            subComp.filterFlag = true
                            feat.filterFlag = true
                            act.filterFlag = true
                            if (filterItem?.TotalTaskTime) {
                                act.TotalTaskTime = filterItem?.TotalTaskTime
                            }
                        }
                        act?.subRows?.map((works: any) => {
                            if (works.Id === filterItem?.Id && filterItem?.siteType === works?.siteType) {
                                comp.filterFlag = true
                                subComp.filterFlag = true
                                feat.filterFlag = true
                                act.filterFlag = true
                                works.filterFlag = true
                                if (filterItem?.TotalTaskTime) {
                                    works.TotalTaskTime = filterItem?.TotalTaskTime
                                }
                            }
                            works?.subRows?.map((task: any) => {
                                if (task.Id === filterItem?.Id && filterItem?.siteType === task?.siteType) {
                                    comp.filterFlag = true
                                    subComp.filterFlag = true
                                    feat.filterFlag = true
                                    act.filterFlag = true
                                    works.filterFlag = true
                                    task.filterFlag = true
                                    if (filterItem?.TotalTaskTime) {
                                        task.TotalTaskTime = filterItem?.TotalTaskTime
                                    }
                                }
                            })
                        })
                    })
                })
            })
        })
        if (filterCount === smartAllFilterData.length) {
            finalData = dataAllGrupingBackup.filter((elem: any) => elem.filterFlag === true)
            finalDataCopy = [...finalData];
            let finalDataCopyArray = finalDataCopy?.filter((ele: any, ind: any) => ind === finalDataCopy.findIndex((elem: any) => elem.ID === ele.ID || elem.Id === ele.Id && elem.siteType === ele.siteType));
            finalDataCopyArray?.map((comp: any) => {
                comp.subRows = comp?.subRows?.filter((sub: any) => sub.filterFlag === true)
                comp?.subRows?.map((subComp: any) => {
                    subComp.subRows = subComp?.subRows?.filter((subComp1: any) => subComp1.filterFlag === true)
                    subComp?.subRows?.map((feat: any) => {
                        feat.subRows = feat?.subRows?.filter((feat1: any) => feat1.filterFlag === true)
                        feat?.subRows?.map((activ: any) => {
                            activ.subRows = activ?.subRows?.filter((activ1: any) => activ1.filterFlag === true)
                            activ?.subRows?.map((works: any) => {
                                works.subRows = works?.subRows?.filter((works1: any) => works1.filterFlag === true);
                            })
                        })
                    })
                })
                if (comp.Title === "Others") {
                    const othersAllTask = smartAllFilterData?.filter((elem1) => elem1?.TaskType?.Id != undefined && elem1?.ParentTask?.Id === undefined && (elem1?.Portfolio?.Title === undefined || elem1?.Portfolio?.Title === null));
                    comp.subRows = othersAllTask;
                }
            })
            setLoaded(true);
            setData(finalDataCopyArray);
        }
    }
    const updatedSmartFilterFlatViewData = (data: any) => {
        hasCustomExpanded = false
        hasExpanded = false
        isHeaderNotAvlable = true
        isColumnDefultSortingAsc = true
        setData(data);
        // setData(smartAllFilterData);
    }
    const switchFlatViewData = (data: any) => {
        let groupedDataItems: any = []
        try {
            groupedDataItems = JSON.parse(JSON.stringify(data));
        } catch (error) {
            console.log('Json parse error switchFlatViewData function');
        }
        const flattenedData = flattenData(groupedDataItems);
        hasCustomExpanded = false
        hasExpanded = false
        isHeaderNotAvlable = true
        isColumnDefultSortingAsc = true
        setGroupByButtonClickData(data);
        setclickFlatView(true);
        setFlatViewDataAll(flattenedData)
        setData(flattenedData);
        // setData(smartAllFilterData);
    }

    function flattenData(groupedDataItems: any) {
        const flattenedData: any = [];
        function flatten(item: any) {
            if (item.Title != "Others") {
                flattenedData.push(item);
            }
            if (item?.subRows) {
                item?.subRows.forEach((subItem: any) => flatten(subItem));
                item.subRows = []
            }
        }
        groupedDataItems?.forEach((item: any) => { flatten(item) });
        return flattenedData;
    }
    const switchGroupbyData = () => {
        isColumnDefultSortingAsc = false
        hasCustomExpanded = true
        hasExpanded = true
        isHeaderNotAvlable = false
        setclickFlatView(false);
        setData(groupByButtonClickData);
    }

    // React.useEffect(() => {
    //     let dynamicColumns: any = [
    //         {
    //             DisplayName: "portfolioItemsSearch",
    //             InternalName: "portfolioItemsSearch",
    //             id: "portfolioItemsSearch",
    //             placeholder: "Type",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 95,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             sortOrder: 1,
    //         },
    //         {
    //             DisplayName: "TaskID",
    //             InternalName: "TaskID",
    //             id: "TaskID",
    //             placeholder: "ID",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 190,
    //             isColumnVisible: true,
    //             callComponent: "ReactPopperTooltipSingleLevel",
    //             isComponent: true,
    //             sortOrder: 2,
    //         },
    //         {
    //             DisplayName: "Title",
    //             InternalName: "Title",
    //             id: "Title",
    //             placeholder: "Title",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 500,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             sortOrder: 3,
    //         },
    //         {
    //             DisplayName: "ProjectTitle",
    //             InternalName: "ProjectTitle",
    //             id: "ProjectTitle",
    //             placeholder: "Project",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 70,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             sortOrder: 4,
    //         },
    //         {
    //             DisplayName: "TaskTypeValue",
    //             InternalName: "TaskTypeValue",
    //             id: "TaskTypeValue",
    //             placeholder: "Task Type",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 110,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "textMultiline",
    //             sortOrder: 5,
    //         },
    //         {
    //             DisplayName: "FeatureTypeTitle",
    //             InternalName: "FeatureTypeTitle",
    //             id: "FeatureTypeTitle",
    //             placeholder: "Feature Type",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 110,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "textMultiline",
    //             sortOrder: 6,
    //         },
    //         {
    //             DisplayName: "ClientCategorySearch",
    //             InternalName: "ClientCategorySearch",
    //             id: "ClientCategorySearch",
    //             placeholder: "Client Category",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 95,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             sortOrder: 7,
    //         },
    //         {
    //             DisplayName: "AllTeamName",
    //             InternalName: "AllTeamName",
    //             id: "AllTeamName",
    //             placeholder: "Team",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 100,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             sortOrder: 8,
    //         },
    //         {
    //             DisplayName: "PercentComplete",
    //             InternalName: "PercentComplete",
    //             id: "PercentComplete",
    //             placeholder: "Status",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 42,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "number",
    //             sortOrder: 9,
    //         },
    //         {
    //             DisplayName: "ItemRank",
    //             InternalName: "ItemRank",
    //             id: "ItemRank",
    //             placeholder: "Item Rank",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 42,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "number",
    //             sortOrder: 10,
    //         },
    //         {
    //             DisplayName: "PriorityRank",
    //             InternalName: "PriorityRank",
    //             id: "PriorityRank",
    //             placeholder: "Priority Rank",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 42,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "number",
    //             sortOrder: 11,
    //         },
    //         {
    //             DisplayName: "SmartPriority",
    //             InternalName: "SmartPriority",
    //             id: "SmartPriority",
    //             placeholder: "Smart Priority",
    //             showFormulaOnHover: "showFormulaOnHover",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 42,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "number",
    //             sortOrder: 12,
    //         },
    //         {
    //             DisplayName: "DisplayDueDate",
    //             InternalName: "DueDate",
    //             id: "DueDate",
    //             placeholder: "DueDate",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 91,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "date",
    //             iconVisible: "",
    //             sortOrder: 14,
    //         },
    //         {
    //             DisplayName: "DisplayCreateDate",
    //             InternalName: "Created",
    //             id: "Created",
    //             placeholder: "Created",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 105,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             iconVisible: "Author",
    //             columnType: "date",
    //             sortOrder: 15,
    //         },
    //         {
    //             DisplayName: "DisplayModifiedDate",
    //             InternalName: "Modified",
    //             id: "Modified",
    //             placeholder: "Modified",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 105,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             iconVisible: "Editor",
    //             columnType: "date",
    //             sortOrder: 16,
    //         },
    //         {
    //             DisplayName: "TotalTaskTime",
    //             InternalName: "TotalTaskTime",
    //             id: "TotalTaskTime",
    //             placeholder: "Smart Time",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 49,
    //             isColumnVisible: true,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "number",
    //             sortOrder: 17,
    //         },
    //         {
    //             DisplayName: "descriptionsDeliverablesSearch",
    //             InternalName: "descriptionsDeliverablesSearch",
    //             id: "descriptionsDeliverablesSearch",
    //             placeholder: "Deliverables",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 18,
    //         },
    //         {
    //             DisplayName: "descriptionsHelpInformationSarch",
    //             InternalName: "Help_x0020_Information",
    //             id: "descriptionsHelpInformationSarch",
    //             placeholder: "Help Information",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 19,
    //         },
    //         {
    //             DisplayName: "descriptionsShortDescriptionSearch",
    //             InternalName: "Short_x0020_Description_x0020_On",
    //             id: "descriptionsShortDescriptionSearch",
    //             placeholder: "Short Description",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 20,
    //         },
    //         {
    //             DisplayName: "descriptionsTechnicalExplanationsSearch",
    //             InternalName: "TechnicalExplanations",
    //             id: "descriptionsTechnicalExplanationsSearch",
    //             placeholder: "Technical Explanations",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 21,
    //         },
    //         {
    //             DisplayName: "descriptionsBodySearch",
    //             InternalName: "Body",
    //             id: "descriptionsBodySearch",
    //             placeholder: "Body",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 22,
    //         },
    //         {
    //             DisplayName: "descriptionsValueAddedSearch",
    //             InternalName: "ValueAdded",
    //             id: "descriptionsValueAddedSearch",
    //             placeholder: "Value Added",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 23,
    //         },
    //         {
    //             DisplayName: "descriptionsAdminNotesSearch",
    //             InternalName: "AdminNotes",
    //             id: "descriptionsAdminNotesSearch",
    //             placeholder: "Admin Notes",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 24,
    //         },
    //         {
    //             DisplayName: "descriptionsIdeaSearch",
    //             InternalName: "Idea",
    //             id: "descriptionsIdeaSearch",
    //             placeholder: "Idea",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 25,
    //         },
    //         {
    //             DisplayName: "descriptionsBackgroundSearch",
    //             InternalName: "Background",
    //             id: "descriptionsBackgroundSearch",
    //             placeholder: "Background",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 56,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: false,
    //             columnType: "infoIcon",
    //             sortOrder: 26,
    //         },
    //         {
    //             DisplayName: "HelpInformationVerified",
    //             InternalName: "HelpInformationVerified",
    //             id: "HelpInformationVerified",
    //             placeholder: "verified",
    //             header: "",
    //             resetColumnFilters: false,
    //             isColumnDefultSortingAsc: false,
    //             isColumnDefultSortingDesc: false,
    //             size: 130,
    //             isColumnVisible: false,
    //             callComponent: "",
    //             isComponent: true,
    //             columnType: "",
    //             sortOrder: 27,
    //         },
    //     ];
    //     const dynamicColumnsPrepareValue: any = dynamicColumns?.map((column: any) => {
    //         if (column.id === "portfolioItemsSearch") {
    //             return {
    //                 accessorFn: (row: any) => row?.portfolioItemsSearch,
    //                 cell: ({ row, getValue }: any) => (
    //                     <div className="alignCenter">
    //                         {row?.original?.SiteIcon != undefined ? (
    //                             <div className="alignCenter" title="Show All Child">
    //                                 <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
    //                                     row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
    //                                 }
    //                                     src={row?.original?.SiteIcon}>
    //                                 </img>
    //                             </div>
    //                         ) : (
    //                             <>
    //                                 {row?.original?.Title != "Others" ? (
    //                                     <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
    //                                         row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
    //                                     }>
    //                                         {row?.original?.SiteIconTitle}
    //                                     </div>
    //                                 ) : (
    //                                     ""
    //                                 )}
    //                             </>
    //                         )}
    //                     </div>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.id === "TaskID") {
    //             return {
    //                 accessorFn: (row: any) => row?.TaskID,
    //                 cell: ({ row, getValue }: any) => (
    //                     <>
    //                         <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={ContextValue} singleLevel={true} masterTaskData={allMasterTaskDataFlatLoadeViewBackup} AllSitesTaskData={allTaskDataFlatLoadeViewBackup} />
    //                     </>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.id === "Title") {
    //             return {
    //                 accessorFn: (row: any) => row?.Title,
    //                 cell: ({ row, column, getValue }: any) => (
    //                     <div className="alignCenter">
    //                         <span className="columnFixedTitle">
    //                             {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
    //                                 <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
    //                                     href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
    //                                     <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
    //                                 </a>
    //                             )}
    //                             {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
    //                                 <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
    //                                     href={ContextValue.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
    //                                     <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
    //                                 </a>
    //                             )}
    //                             {row?.original.Title === "Others" ? (
    //                                 <span className="text-content" title={row?.original?.Title} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>{row?.original?.Title}</span>
    //                             ) : (
    //                                 ""
    //                             )}
    //                         </span>
    //                         {row?.original?.Categories == 'Draft' ?
    //                             <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}
    //                         {row?.original?.subRows?.length > 0 ?
    //                             <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
    //                         {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != '' && (
    //                             <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
    //                         )}
    //                     </div>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.id === "ProjectTitle") {
    //             return {
    //                 accessorFn: (row: any) => row?.projectStructerId + "." + row?.ProjectTitle,
    //                 cell: ({ row, column, getValue }: any) => (
    //                     <>
    //                         {row?.original?.ProjectTitle != (null || undefined) &&
    //                             <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${ContextValue.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
    //                                 <ReactPopperTooltip CMSToolId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={ContextValue} /></a></span>
    //                         }
    //                     </>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.columnType === "textMultiline") {
    //             return {
    //                 accessorFn: (row: any) => row?.[column.InternalName],
    //                 cell: ({ row, column, getValue }: any) => (
    //                     <>
    //                         <span style={{ display: "flex", maxWidth: column?.size - 10 }}>
    //                             <span title={row?.original?.[column.InternalName]} style={{ flexGrow: 1, overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>
    //                                 <HighlightableCell value={row?.original?.[column.InternalName]} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
    //                             </span>
    //                         </span>
    //                     </>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.id === "ClientCategorySearch") {
    //             return {
    //                 accessorFn: (row: any) => row?.ClientCategorySearch,
    //                 cell: ({ row }: any) => (
    //                     <>
    //                         <ShowClintCatogory clintData={row?.original} AllMetadata={metaDataItem} />
    //                     </>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.id === "AllTeamName") {
    //             let columnName = column?.InternalName;
    //             return {
    //                 accessorFn: (row: any) => row?.[columnName],
    //                 cell: ({ row }: any) => (
    //                     <div className="alignCenter">
    //                         <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={TaskUsers} Context={SelectedProp?.SelectedProp} />
    //                     </div>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.columnType === "number") {
    //             return {
    //                 accessorFn: (row: any) => row?.[column.InternalName],
    //                 cell: ({ row }: any) => (
    //                     <div className="text-center" title={row?.original?.[column?.showFormulaOnHover]}>{row?.original?.[column.InternalName] != 0 ? row?.original?.[column.InternalName] : null}</div>
    //                 ),
    //                 filterFn: (row: any, columnName: any, filterValue: any) => {
    //                     if (row?.original?.[column.InternalName] == filterValue) {
    //                         return true
    //                     } else {
    //                         return false
    //                     }
    //                 },
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.columnType === "infoIcon") {
    //             return {
    //                 accessorFn: (row: any) => row?.[column.DisplayName],
    //                 cell: ({ row }: any) => (
    //                     <div className="alignCenter">
    //                         <span>{row?.original?.[column.DisplayName] ? row?.original?.[column.DisplayName]?.length : ""}</span>
    //                         {row?.original?.[column.DisplayName] && <InfoIconsToolTip row={row?.original} SingleColumnData={[column.InternalName]} />}
    //                     </div>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.id === "HelpInformationVerified") {
    //             return {
    //                 accessorFn: (row: any) => row?.HelpInformationVerified,
    //                 cell: ({ row }: any) => (
    //                     <div className="alignCenter">
    //                         {row?.original?.HelpInformationVerified && <span> <TrafficLightComponent columnName={"HelpInformationVerified"} columnData={row?.original} usedFor="GroupByComponents" /></span>}
    //                     </div>
    //                 ),
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.columnType === "date" && column?.iconVisible === "") {
    //             let columnName = column?.InternalName;
    //             let colDisplay = column?.DisplayName;
    //             return {
    //                 accessorFn: (row: any) => row?.[columnName],
    //                 cell: ({ row, column, getValue }: any) => (
    //                     <HighlightableCell value={row?.original?.[colDisplay]} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
    //                 ),
    //                 filterFn: (row: any, columnName: any, filterValue: any) => {
    //                     if (row?.original?.[colDisplay]?.includes(filterValue)) {
    //                         return true
    //                     } else {
    //                         return false
    //                     }
    //                 },
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         } else if (column.columnType === "date" && column?.iconVisible != "") {
    //             let columnName = column?.InternalName;
    //             let colDisplay = column?.DisplayName;
    //             let iconName = column.iconVisible;
    //             return {
    //                 accessorFn: (row: any) => row?.[columnName],
    //                 cell: ({ row, column }: any) => (
    //                     <div className="alignCenter">
    //                         {row?.original?.Created == null ? ("") : (
    //                             <>
    //                                 <div style={{ width: "75px" }} className="me-1"><HighlightableCell value={row?.original?.[colDisplay]} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></div>
    //                                 {row?.original?.[iconName] != undefined &&
    //                                     <>
    //                                         <a href={`${ContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.[iconName]?.Id}&Name=${row?.original?.[iconName]?.Title}`}
    //                                             target="_blank" data-interception="off">
    //                                             <img title={row?.original?.[iconName]?.Title} className="workmember ms-1" src={row?.original?.[iconName]?.autherImage} />
    //                                         </a>
    //                                     </>
    //                                 }
    //                             </>
    //                         )}
    //                     </div>
    //                 ),
    //                 filterFn: (row: any, columnName: any, filterValue: any) => {
    //                     if (row?.original?.[iconName]?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.[`${column.DisplayName}`]?.includes(filterValue)) {
    //                         return true
    //                     } else {
    //                         return false
    //                     }
    //                 },
    //                 id: column?.id,
    //                 placeholder: column?.placeholder,
    //                 header: "",
    //                 resetColumnFilters: false,
    //                 size: column?.size,
    //                 isColumnVisible: column?.isColumnVisible,
    //                 isColumnDefultSortingAsc: column?.isColumnDefultSortingAsc,
    //             };
    //         }
    //     });
    //     setDynamicColumnsValue(dynamicColumnsPrepareValue)
    //     // dynamicColumnsValue = [];
    //     // dynamicColumnsValue = dynamicColumnsValue.concat(dynamicColumnsPrepareValue);
    // }, [data])
    // const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    //     () => [
    //         {
    //             accessorKey: "",
    //             placeholder: "",
    //             hasCheckbox: true,
    //             hasCustomExpanded: hasCustomExpanded,
    //             hasExpanded: hasExpanded,
    //             isHeaderNotAvlable: isHeaderNotAvlable,
    //             size: 55,
    //             id: 'Id',
    //         },
    //         ...dynamicColumnsValue,
    //         {
    //             accessorKey: "descriptionsSearch",
    //             placeholder: "descriptionsSearch",
    //             header: "",
    //             resetColumnFilters: false,
    //             id: "descriptionsSearch",
    //             isColumnVisible: false
    //         },
    //         {
    //             accessorKey: "commentsSearch",
    //             placeholder: "commentsSearch",
    //             header: "",
    //             resetColumnFilters: false,
    //             id: "commentsSearch",
    //             isColumnVisible: false
    //         },
    //         {
    //             accessorKey: "timeSheetsDescriptionSearch",
    //             placeholder: "timeSheetsDescriptionSearch",
    //             header: "",
    //             resetColumnFilters: false,
    //             id: "timeSheetsDescriptionSearch",
    //             isColumnVisible: false
    //         },
    //         {
    //             cell: ({ row }) => (
    //                 <>
    //                     {row?.original?.siteType != "Master Tasks" && row?.original?.Title != "Others" && (
    //                         <a className="alignCenter" onClick={(e) => EditDataTimeEntryData(e, row.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
    //                             <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
    //                         </a>
    //                     )}
    //                 </>
    //             ),
    //             id: "timeShitsIcons",
    //             canSort: false,
    //             placeholder: "",
    //             size: 1,
    //             isColumnVisible: true
    //         },
    //         {
    //             header: ({ table }: any) => (
    //                 <>{
    //                     topCompoIcon ?
    //                         <span style={{ backgroundColor: `${portfolioColor}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => trueTopIcon(true)}>
    //                             <span className="svg__iconbox svg__icon--re-structure"></span>
    //                         </span>
    //                         : ''
    //                 }
    //                 </>
    //             ),
    //             cell: ({ row, getValue }) => (
    //                 <>
    //                     {row?.original?.isRestructureActive && row?.original?.Title != "Others" && (
    //                         <span className="Dyicons p-1" title="Restructure" style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} onClick={() => callChildFunction(row?.original)}>
    //                             <span className="svg__iconbox svg__icon--re-structure"> </span>
    //                         </span>
    //                     )}
    //                     {/* {getValue()} */}
    //                 </>
    //             ),
    //             id: "Restructure",
    //             canSort: false,
    //             placeholder: "",
    //             size: 1,
    //             isColumnVisible: true
    //         },
    //         {
    //             cell: ({ row, getValue }) => (
    //                 <>
    //                     {row?.original?.siteType === "Master Tasks" &&
    //                         row?.original?.Title !== "Others" && (
    //                             <a className="alignCenter"
    //                                 href="#"
    //                                 data-bs-toggle="tooltip"
    //                                 data-bs-placement="auto"
    //                                 title={'Edit ' + `${row.original.Title}`}
    //                             >
    //                                 {" "}
    //                                 <span
    //                                     className="svg__iconbox svg__icon--edit"
    //                                     onClick={(e) => EditComponentPopup(row?.original)}
    //                                 ></span>
    //                             </a>
    //                         )}
    //                     {row?.original?.siteType != "Master Tasks" &&
    //                         row?.original?.Title !== "Others" && (
    //                             <a className="alignCenter"
    //                                 href="#"
    //                                 data-bs-toggle="tooltip"
    //                                 data-bs-placement="auto"
    //                                 title={'Edit ' + `${row.original.Title}`}
    //                             >
    //                                 {" "}
    //                                 <span
    //                                     className="svg__iconbox svg__icon--edit"
    //                                     onClick={(e) => EditItemTaskPopup(row?.original)}
    //                                 ></span>
    //                             </a>
    //                         )}
    //                     {/* {getValue()} */}
    //                 </>
    //             ),
    //             id: "editIcon",
    //             canSort: false,
    //             placeholder: "",
    //             header: "",
    //             size: 30,
    //             isColumnVisible: true
    //         },
    //     ],
    //     [data]
    // );


    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: hasCustomExpanded,
                hasExpanded: hasExpanded,
                isHeaderNotAvlable: isHeaderNotAvlable,
                size: 55,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.portfolioItemsSearch,
                cell: ({ row, getValue }) => (
                    <div className="alignCenter">
                        {row?.original?.SiteIcon != undefined ? (
                            <div className="alignCenter" title="Show All Child">
                                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                                }
                                    src={row?.original?.SiteIcon}>
                                </img>
                            </div>
                        ) : (
                            <>
                                {row?.original?.Title != "Others" ? (
                                    <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                                        row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                                    }>
                                        {row?.original?.SiteIconTitle}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </div>
                ),
                id: "portfolioItemsSearch",
                placeholder: "Type",
                header: "",
                resetColumnFilters: false,
                size: 95,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.TaskID,
                cell: ({ row, getValue }) => (
                    <>
                        <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={ContextValue} singleLevel={true} masterTaskData={allMasterTaskDataFlatLoadeViewBackup} AllSitesTaskData={allTaskDataFlatLoadeViewBackup} />
                    </>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                isColumnDefultSortingAsc: isColumnDefultSortingAsc,
                size: 190,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <div className="alignCenter">
                        <span className="columnFixedTitle">
                            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={ContextValue.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original.Title === "Others" ? (
                                <span className="text-content" title={row?.original?.Title} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>{row?.original?.Title}</span>
                            ) : (
                                ""
                            )}
                        </span>
                        {row?.original?.Categories?.includes("Draft") ?
                            <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}
                        {row?.original?.subRows?.length > 0 ?
                            <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
                        {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != '' && (
                            <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
                        )}
                    </div>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 500,
                isColumnVisible: true,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.projectStructerId + " " + row?.ProjectTitle,
                cell: ({ row, column, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != (null || undefined) &&
                            <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${ContextValue.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
                                <ReactPopperTooltip CMSToolId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={ContextValue} /></a></span>
                        }
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Project",
                resetColumnFilters: false,
                header: "",
                size: 70,
                isColumnVisible: true,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.TaskTypeValue,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content"><HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></span></span>
                    </>
                ),
                placeholder: "Task Type",
                header: "",
                resetColumnFilters: false,
                size: 130,
                id: "TaskTypeValue",
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Type,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content"><HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></span></span>
                    </>
                ),
                placeholder: "Type",
                header: "",
                resetColumnFilters: false,
                size: 130,
                id: "Type",
                isColumnVisible: false
            },
            {
                accessorFn: (row) => row?.Attention,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content"><HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></span></span>
                    </>
                ),
                placeholder: "Attention",
                header: "",
                resetColumnFilters: false,
                size: 130,
                id: "Attention",
                isColumnVisible: false
            },
            {
                accessorFn: (row) => row?.Admin,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content"><HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></span></span>
                    </>
                ),
                placeholder: "Admin",
                header: "",
                resetColumnFilters: false,
                size: 130,
                id: "Admin",
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.Actions,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content"><HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></span></span>
                    </>
                ),
                placeholder: "Actions",
                header: "",
                resetColumnFilters: false,
                size: 130,
                id: "Actions",
                isColumnVisible: false
            },
            {
                accessorFn: (row) => row?.ClientCategorySearch,
                cell: ({ row }) => (
                    <>
                        <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                    </>
                ),
                id: "ClientCategorySearch",
                placeholder: "Client Category",
                header: "",
                resetColumnFilters: false,
                size: 95,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.AllTeamName,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} Context={SelectedProp?.SelectedProp} />
                    </div>
                ),
                id: "AllTeamName",
                placeholder: "Team",
                resetColumnFilters: false,
                header: "",
                size: 100,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.workingActionTitle,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        {row?.original?.workingActionValue?.map((elem: any) => {
                            const relevantTitles: any = ["Bottleneck", "Attention", "Phone", "Approval"];
                            return relevantTitles?.includes(elem?.Title) && elem?.InformationData?.length > 0 && (
                                <WorkingActionInformation workingAction={elem} actionType={elem?.Title} />
                            );
                        })}
                    </div>
                ),
                placeholder: "Working Actions",
                header: "",
                resetColumnFilters: false,
                size: 70,
                id: "workingActionTitle",
                isColumnVisible: false
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <div className="">{row?.original?.PercentComplete}</div>
                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                resetColumnFilters: false,
                header: "",
                size: 55,
                isColumnVisible: true,
                fixedColumnWidth: true,
                showProgressBar: true
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <>
                        {row?.original?.PercentComplete != "" && <div className="">{row?.original?.PercentComplete + "%"} <ProgressBar title={row?.original?.PercentComplete} style={{ height: "7px" }} className='dynamicProgreesColor' now={row?.original?.PercentComplete} /></div>}
                    </>
                ),
                id: "showProgress",
                placeholder: "Progress",
                resetColumnFilters: false,
                header: "",
                size: 60,
                isColumnVisible: false,
                fixedColumnWidth: true,
            },
            {
                accessorFn: (row) => row?.Status,
                cell: ({ row }) => (
                    <div style={{ backgroundColor: `${row?.original?.statusColor}`, borderRadius: "6px", border: `1px solid ${row?.original?.statusColor}` }} className="">{row?.original?.Status}</div>
                ),
                id: "Status",
                placeholder: "Status",
                resetColumnFilters: false,
                header: "",
                size: 80,
                isColumnVisible: false,
                fixedColumnWidth: true,
            },
            {
                accessorFn: (row) => row?.ItemRank,
                cell: ({ row }) => (
                    <div className="text-center">{row?.original?.ItemRank}</div>
                ),
                id: "ItemRank",
                placeholder: "Item Rank",
                resetColumnFilters: false,
                header: "",
                size: 55,
                isColumnVisible: true,
                fixedColumnWidth: true
            },
            {
                accessorFn: (row) => row?.SmartPriority,
                cell: ({ row }) => (
                    <div className="text-center boldClable" title={row?.original?.showFormulaOnHover}>{row?.original?.SmartPriority != 0 ? row?.original?.SmartPriority : null}</div>
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.SmartPriority == filterValue) {
                        return true
                    } else {
                        return false
                    }
                },
                id: "SmartPriority",
                placeholder: "SmartPriority",
                resetColumnFilters: false,
                header: "",
                size: 60,
                isColumnVisible: true,
                fixedColumnWidth: true
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <div className="text-center">{row?.original?.PriorityRank}</div>
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.PriorityRank == filterValue) {
                        return true
                    } else {
                        return false
                    }
                },
                id: "PriorityRank",
                placeholder: "Priority Rank",
                resetColumnFilters: false,
                header: "",
                size: 60,
                isColumnVisible: false,
                fixedColumnWidth: true
            },
            {
                accessorFn: (row) => row?.descriptionsDeliverablesSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsDeliverablesSearch ? row?.original?.descriptionsDeliverablesSearch?.length : ""}</span>
                        {row?.original?.descriptionsDeliverablesSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"descriptionsDeliverablesSearch"} />}
                    </div>
                ),
                id: "descriptionsDeliverablesSearch",
                placeholder: "Deliverables",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsHelpInformationSarch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsHelpInformationSarch ? row?.original?.descriptionsHelpInformationSarch?.length : ""}</span>
                        {row?.original?.descriptionsHelpInformationSarch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Help_x0020_Information"} />}
                    </div>
                ),
                id: "descriptionsHelpInformationSarch",
                placeholder: "Help Information",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsShortDescriptionSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsShortDescriptionSearch ? row?.original?.descriptionsShortDescriptionSearch?.length : ""}</span>
                        {row?.original?.descriptionsShortDescriptionSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Short_x0020_Description_x0020_On"} />}
                    </div>
                ),
                id: "descriptionsShortDescriptionSearch",
                placeholder: "Short Description",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsTechnicalExplanationsSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsTechnicalExplanationsSearch ? row?.original?.descriptionsTechnicalExplanationsSearch?.length : ""}</span>
                        {row?.original?.descriptionsTechnicalExplanationsSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"TechnicalExplanations"} />}
                    </div>
                ),
                id: "descriptionsTechnicalExplanationsSearch",
                placeholder: "Technical Explanations",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsBodySearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsBodySearch ? row?.original?.descriptionsBodySearch?.length : ""}</span>
                        {row?.original?.descriptionsBodySearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Body"} />}
                    </div>
                ),
                id: "descriptionsBodySearch",
                placeholder: "Body",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsAdminNotesSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsAdminNotesSearch ? row?.original?.descriptionsAdminNotesSearch?.length : ""}</span>
                        {row?.original?.descriptionsAdminNotesSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"AdminNotes"} />}
                    </div>
                ),
                id: "descriptionsAdminNotesSearch",
                placeholder: "AdminNotes",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsValueAddedSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsValueAddedSearch ? row?.original?.descriptionsValueAddedSearch?.length : ""}</span>
                        {row?.original?.descriptionsValueAddedSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"ValueAdded"} />}
                    </div>
                ),
                id: "descriptionsValueAddedSearch",
                placeholder: "ValueAdded",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsIdeaSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsIdeaSearch ? row?.original?.descriptionsIdeaSearch?.length : ""}</span>
                        {row?.original?.descriptionsIdeaSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Idea"} />}
                    </div>
                ),
                id: "descriptionsIdeaSearch",
                placeholder: "Idea",
                header: "",
                resetColumnFilters: false,
                size: 56,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.descriptionsBackgroundSearch,
                cell: ({ row }) => (
                    <>
                        <span>{row?.original?.descriptionsBackgroundSearch ? row?.original?.descriptionsBackgroundSearch?.length : ""}</span>
                        {row?.original?.descriptionsBackgroundSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Background"} />}
                    </>
                ),
                id: "descriptionsBackgroundSearch",
                placeholder: "Background",
                header: "",
                resetColumnFilters: false,
                size: 80,
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorFn: (row) => row?.HelpInformationVerified,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        {row?.original?.HelpInformationVerified && <span> <TrafficLightComponent columnName={"HelpInformationVerified"} columnData={row?.original} usedFor="GroupByComponents" /></span>}
                    </div>
                ),
                id: "HelpInformationVerified",
                placeholder: "verified",
                header: "",
                resetColumnFilters: false,
                size: 130,
                isColumnVisible: false
            },
            {
                accessorFn: (row) => row?.FeatureTypeTitle,
                cell: ({ row }) => (
                    <>
                        <span style={{ display: "flex", maxWidth: '60px' }}>
                            <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap' }} title={row?.original?.FeatureTypeTitle} >{row?.original?.FeatureTypeTitle}</span>
                        </span>
                    </>
                ),
                id: "FeatureTypeTitle",
                placeholder: "Feature Type",
                header: "",
                resetColumnFilters: false,
                size: 70,
                isColumnVisible: false
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row, column, getValue }) => (
                    <HighlightableCell value={row?.original?.DisplayDueDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "DueDate",
                header: "",
                size: 91,
                isColumnVisible: true,
                fixedColumnWidth: true
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row, column }) => (
                    <div className="alignCenter">
                        {row?.original?.Created == null ? ("") : (
                            <>
                                <div style={{ width: "75px" }} className="me-1"><HighlightableCell value={row?.original?.DisplayCreateDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></div>
                                {row?.original?.Author != undefined &&
                                    <>

                                        <a href={`${ContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank" data-interception="off">
                                            {row?.original?.Author?.autherImage || row?.original?.Author?.suffix ? <Avatar
                                                className="UserImage"
                                                title={row?.original?.Author?.Title}
                                                name={row?.original?.Author?.Title}
                                                image={{ src: row?.original?.Author?.autherImage }}
                                                initials={row?.original?.Author?.autherImage == undefined ? row.original?.Author?.suffix : undefined}

                                            /> :
                                            <Avatar  title={row?.original?.Author?.Title}
                                            name={row?.original?.Author?.Title} className="UserImage" />}
                                        </a>
                                    </>
                                }
                            </>
                        )}
                    </div>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                isColumnVisible: true,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 105,
                fixedColumnWidth: true
            },
            {
                accessorFn: (row) => row?.Modified,
                cell: ({ row, column }) => (
                    <div className="alignCenter">
                        {row?.original?.Modified == null ? ("") : (
                            <>
                                <div style={{ width: "75px" }} className="me-1"><HighlightableCell value={row?.original?.DisplayModifiedDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></div>
                                {row?.original?.Editor != undefined &&
                                    <>
                                        <a href={`${ContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Editor?.Id}&Name=${row?.original?.Editor?.Title}`}
                                            target="_blank" data-interception="off">
                                                {row?.original?.Editor?.autherImage || row?.original?.Editor?.suffix ? <Avatar
                                                className="UserImage"
                                                title={row?.original?.Editor?.Title}
                                                name={row?.original?.Editor?.Title}
                                                image={{ src: row?.original?.Editor?.autherImage }}
                                                initials={row?.original?.Editor?.autherImage == undefined ? row.original?.Editor?.suffix : undefined}

                                            /> :
                                            <Avatar  title={row?.original?.Editor?.Title}
                                            name={row?.original?.Editor?.Title} className="UserImage" />}
                                        </a>
                                    </>
                                }
                            </>
                        )}
                    </div>
                ),
                id: 'Modified',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Modified",
                isColumnVisible: false,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayModifiedDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 105,
                fixedColumnWidth: true
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "Descriptions",
                header: "",
                resetColumnFilters: false,
                id: "descriptionsSearch",
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "Comments",
                header: "",
                resetColumnFilters: false,
                id: "commentsSearch",
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorKey: "timeSheetsDescriptionSearch",
                placeholder: "Timesheets Description",
                header: "",
                resetColumnFilters: false,
                id: "timeSheetsDescriptionSearch",
                isColumnVisible: false,
                isAdvanceSearchVisible:true
            },
            {
                accessorKey: "TotalTaskTime",
                id: "TotalTaskTime",
                placeholder: "Smart Time",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true,
                fixedColumnWidth: true
            },
            {
                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType != "Master Tasks" && row?.original?.Title != "Others" && (
                            <a className="alignCenter" onClick={(e) => EditDataTimeEntryData(e, row.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
                                <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
                            </a>
                        )}
                    </>
                ),
                id: "timeShitsIcons",
                canSort: false,
                placeholder: "",
                size: 1,
                isColumnVisible: true
            },
            {
                header: ({ table }: any) => (
                    <>{
                        topCompoIcon ?
                            <span style={{ backgroundColor: `${portfolioColor}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => trueTopIcon(true)}>
                                <span className="svg__iconbox svg__icon--re-structure"></span>
                            </span>
                            : ''
                    }
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.isRestructureActive && row?.original?.Title != "Others" && (
                            <span className="Dyicons p-1" title="Restructure" style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} onClick={() => callChildFunction(row?.original)}>
                                <span className="svg__iconbox svg__icon--re-structure"> </span>
                            </span>
                        )}
                        {/* {getValue()} */}
                    </>
                ),
                id: "Restructure",
                canSort: false,
                placeholder: "",
                size: 1,
                isColumnVisible: true
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" &&
                            row?.original?.Title !== "Others" && (
                                <a className="alignCenter"
                                    href="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="auto"
                                    title={'Edit ' + `${row.original.Title}`}
                                >
                                    {" "}
                                    <span
                                        className="svg__iconbox svg__icon--edit"
                                        onClick={(e) => EditComponentPopup(row?.original)}
                                    ></span>
                                </a>
                            )}
                        {row?.original?.siteType != "Master Tasks" &&
                            row?.original?.Title !== "Others" && (
                                <a className="alignCenter"
                                    href="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="auto"
                                    title={'Edit ' + `${row.original.Title}`}
                                >
                                    {" "}
                                    <span
                                        className="svg__iconbox svg__icon--edit"
                                        onClick={(e) => EditItemTaskPopup(row?.original)}
                                    ></span>
                                </a>
                            )}
                        {/* {getValue()} */}
                    </>
                ),
                id: "editIcon",
                canSort: false,
                placeholder: "",
                header: "",
                size: 30,
                isColumnVisible: true
            },
        ],
        [data]
    );

    //-------------------------------------------------- restructuring function start---------------------------------------------------------------

    const callBackData = React.useCallback((checkData: any) => {
        let array: any = [];
        if (checkData != undefined) {
            setCheckedList(checkData);
            array.push(checkData);
        } else {
            setCheckedList({});
            array = [];
        }
        setCheckedList1(array);
    }, []);


    const callBackData1 = React.useCallback((getData: any, topCompoIcon: any) => {
        setData((getData: any) => [...getData]);
        setTopCompoIcon(topCompoIcon);
        renderData = [];
        renderData = renderData.concat(getData);
        refreshData();
      }, []);



    //  Function to call the child component's function
    const callChildFunction = (items: any) => {
        if (childRef.current) {
            childRef.current.callChildFunction(items);
        }
    };

    const trueTopIcon = (items: any) => {
        if (childRef.current) {
            childRef.current.trueTopIcon(items);
        }
    };
    //-------------------------------------------------- restructuring function end---------------------------------------------------------------

    //// popup Edit Task And Component///
    const EditComponentPopup = (item: any) => {
        item["siteUrl"] = ContextValue.siteUrl;
        item["listName"] = "Master Tasks";
        setIsComponent(true);
        setCMSToolComponent(item);
    };
    const EditItemTaskPopup = (item: any) => {
        setIsTask(true);
        setCMSTask(item);
    };
    const EditDataTimeEntryData = (e: any, item: any) => {
        setIsTimeEntry(true);
        setCmsTimeComponent(item);
    };
    const TimeEntryCallBack = React.useCallback((item1) => {
        setIsTimeEntry(false);
    }, []);
    ///////////////////////////////////

    // Code Write by RanuSir ////
    const OpenAddStructureModal = () => {
        setOpenAddStructurePopup(true);
    };
    const onRenderCustomHeaderMain1 = () => {
        return (
            <>
                <div className="subheading">
                    <>
                        {checkedList != null && checkedList != undefined && checkedList?.SiteIconTitle != undefined && checkedList?.SiteIconTitle != null ? <span className="Dyicons me-2" >{checkedList?.SiteIconTitle}</span> : ''} {`${checkedList != null && checkedList != undefined && checkedList?.Title != undefined && checkedList?.Title != null ? checkedList?.Title
                            + '- Create Child Component' : 'Create Component'}`}</>
                </div>
                <Tooltip ComponentId={'444'} />
            </>
        );
    };

    let isOpenPopup = false;

    const callbackdataAllStructure = React.useCallback((item) => {
        if (item[0]?.SelectedItem != undefined) {
            copyDtaArray.map((val: any) => {
                item[0]?.subRows?.map((childs: any) => {
                    if (item[0].SelectedItem == val.Id) {
                        val.subRows = val.subRows === undefined ? [] : val?.subRows
                        val?.subRows?.unshift(childs)
                    }
                    if (val.subRows != undefined && val.subRows.length > 0) {
                        val.subRows?.map((child: any) => {
                            if (item[0].SelectedItem == child.Id) {
                                child.subRows = child.subRows === undefined ? [] : child?.subRows
                                child?.subRows?.unshift(childs)
                            }
                            if (child.subRows != undefined && child.subRows.length > 0) {
                                child.subRows?.map((Subchild: any) => {
                                    if (item[0].SelectedItem == Subchild.Id) {
                                        Subchild.subRows = Subchild.subRows === undefined ? [] : Subchild?.subRows
                                        Subchild?.subRows.unshift(childs)
                                    }
                                })
                            }
                        })
                    }
                })
            })

        }
        if (item != undefined && item.length > 0 && item[0].SelectedItem == undefined) {
            item.forEach((value: any) => {
                copyDtaArray.unshift(value)
            })
        }
        setOpenAddStructurePopup(false);
        console.log(item)
        renderData = [];
        renderData = renderData.concat(copyDtaArray)
        refreshData();

    }, [])

    //----------------------------Code By Anshu---------------------------------------------------------------------------

    const addedCreatedDataFromAWT = (arr: any, dataToPush: any) => {
        for (let val of arr) {
            if (dataToPush?.PortfolioId === val.Id && dataToPush?.ParentTask?.Id === undefined) {
                val.subRows = val.subRows || [];
                val?.subRows?.push(dataToPush);
                return true;
            } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
                val.subRows = val.subRows || [];
                val?.subRows?.push(dataToPush);
                return true;
            } else if (val?.subRows) {
                if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
                    return true;
                }
            }
        }
        return false;
    };

      

    function deletedDataFromPortfolios(dataArray: any[], idToDelete: any, siteName: any): any[] {         
        return dataArray?.map((item) => {
          if (item?.Id === idToDelete && item?.siteType === siteName) {
            return null; 
          }
          if (item.subRows && item.subRows.length > 0) {
            item.subRows = deletedDataFromPortfolios(item?.subRows, idToDelete, siteName);
          }
      
          return item;
        }).filter(item => item !== null); 
      }

    const updatedDataDataFromPortfolios = (copyDtaArray: any, dataToUpdate: any) => {
        for (let i = 0; i < copyDtaArray.length; i++) {
            if ((dataToUpdate?.Portfolio?.Id === copyDtaArray[i]?.Portfolio?.Id && dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType) || (dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType)) {
                copyDtaArray[i] = { ...copyDtaArray[i], ...dataToUpdate };
                return true;
            } else if (copyDtaArray[i].subRows) {
                if (updatedDataDataFromPortfolios(copyDtaArray[i].subRows, dataToUpdate)) {
                    return true;
                }
            }
        }
        return false;
    };
    const Call = (res: any, UpdatedData: any) => {
        if (res === "Close") {
            setIsComponent(false);
            setIsTask(false);
            setIsOpenActivity(false)
            setIsOpenWorkstream(false)
            setActivityPopup(false)
        } else if (res?.data && res?.data?.ItmesDelete != true && !UpdatedData) {
            childRef?.current?.setRowSelection({});
            setIsComponent(false);
            setIsTask(false);
            setIsOpenActivity(false)
            setIsOpenWorkstream(false)
            setActivityPopup(false)
            if (addedCreatedDataFromAWT(copyDtaArray, res.data)) {
                renderData = [];
                renderData = renderData.concat(copyDtaArray)
                refreshData();
            }
        } else if (res?.data?.ItmesDelete === true && res?.data?.Id && (res?.data?.siteName || res?.data?.siteType) && !UpdatedData) {
            setIsComponent(false);
            setIsTask(false);
            setIsOpenActivity(false)
            setIsOpenWorkstream(false)
            setActivityPopup(false)
            if (res?.data?.siteName) {
                copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteName);
            } else {
                copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteType);
            }
            renderData = [];
            renderData = renderData.concat(copyDtaArray)
            refreshData();
        } else if (res?.data?.ItmesDelete != true && res?.data?.Id && res?.data?.siteType && UpdatedData) {
            setIsComponent(false);
            setIsTask(false);
            setIsOpenActivity(false)
            setIsOpenWorkstream(false)
            setActivityPopup(false)
            const updated = updatedDataDataFromPortfolios(copyDtaArray, res?.data);
            if (updated) {
                renderData = [];
                renderData = renderData.concat(copyDtaArray)
                refreshData();
            } else {
                console.log("Data with the specified PortfolioId was not found.");
            }

        }
    }
    // new change////
    const CreateActivityPopup = (type: any) => {
        setActiveTile(type)
        if (checkedList?.TaskType === undefined) {
            checkedList.NoteCall = type;

        }
        if (checkedList?.TaskType?.Id == 1) {
            checkedList.NoteCall = type;
        }
        if (checkedList?.TaskType?.Id == 3) {
            checkedList.NoteCall = type;
        }
        if (checkedList?.TaskType?.Id == 2) {
            alert("You can not create ny item inside Task");
        }
    };

    const Createbutton = () => {
        if (checkedList?.TaskType === undefined) {
            // SelectedProp.props.NoteCall = type;
            // checkedList.NoteCall = type;
            setIsOpenActivity(true);
            setActiveTile("")
        }
        if (checkedList?.TaskType?.Id == 1) {
            // checkedList.NoteCall = type;
            setIsOpenWorkstream(true);
            setActiveTile("")
        }
        if (checkedList?.TaskType?.Id == 3) {
            // SelectedProp.props.NoteCall = type;
            // checkedList.NoteCall = type;
            setIsOpenActivity(true);
            setActiveTile("")
        }
        if (checkedList?.TaskType?.Id == 2) {
            alert("You can not create ny item inside Task");
        }
    };
    const closeActivity = () => {
        setActivityPopup(false)
        childRef?.current?.setRowSelection({});
    }
    const addActivity = (type: any) => {
        if (checkedList?.TaskType?.Id == undefined) {
            checkedList.NoteCall = type
            setActivityPopup(true);
        }
        if (checkedList?.TaskTypeId === 3 || checkedList?.TaskType?.Id === 3) {
            checkedList.NoteCall = 'Task'
            // setIsOpenActivity(true);
            setIsOpenWorkstream(true);
        }
        if (checkedList?.TaskType?.Id == 1 || checkedList?.TaskTypeId == 1) {
            checkedList.NoteCall = 'Workstream'
            setIsOpenWorkstream(true);
        }
        if (checkedList?.TaskType?.Id == 2) {
            alert("You can not create any item inside Task")
        }

    }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span className="siteColor">{`Create Item`}</span>
                </div>
                <Tooltip ComponentId={1746} />
            </div>
        );
    };

    ////Compare tool/////
    const compareToolCallBack = React.useCallback((compareData) => {
        if (compareData != "close") {
            setOpenCompareToolPopup(false);
        } else {
            setOpenCompareToolPopup(false);
        }
    }, []);

    const trigerAllEventButton = (eventValue: any) => {
        if (eventValue === "Compare") {
            setOpenCompareToolPopup(true);
        }
    }
    React.useEffect(() => {
        if (childRef?.current?.table?.getSelectedRowModel()?.flatRows.length === 2) {
            if ((childRef?.current?.table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != undefined && childRef?.current?.table?.getSelectedRowModel()?.flatRows[1]?.original?.Item_x0020_Type != undefined) && (childRef?.current?.table?.getSelectedRowModel()?.flatRows[1]?.original?.Item_x0020_Type != 'Task' && childRef?.current?.table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != 'Task')) {
                setActiveCompareToolButton(true);
            } else if (childRef?.current?.table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType != undefined && childRef?.current?.table?.getSelectedRowModel()?.flatRows[1]?.original?.TaskType != undefined) {

                setActiveCompareToolButton(true);
            }
        } else {
            setActiveCompareToolButton(false);
        }
    }, [childRef?.current?.table?.getSelectedRowModel()?.flatRows])
    const customTableHeaderButtons = (
        (ActiveCompareToolButton) ?
            < button type="button" className="btn btn-primary" title='Compare' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => trigerAllEventButton("Compare")}>Compare</button> :
            <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} >Compare</button>
    )
    /////end////////////
    //-------------------------------------------------------------End---------------------------------------------------------------------------------


    return (
        <myContextValue.Provider value={{ ...myContextValue, allContextValueData: {} }}>
            <div id="ExandTableIds" style={{}}>
                <section className="ContentSection smartFilterSection">
                    <div className="col-sm-12 clearfix">
                        <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
                            {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("service") > -1 && (
                                <div style={{ color: `${portfolioColor}` }}>{IsUpdated} Portfolio</div>
                            )}
                            {/* {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("service") > -1 && (
                                <div className="text-end fs-6">
                                    <a data-interception="off" style={{ color: `${portfolioColor}` }} target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Service-Portfolio-Old.aspx"}>Old Service Portfolio</a>
                                </div>
                            )} */}
                            {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("event") > -1 && (
                                <div style={{ color: `${portfolioColor}` }}>{IsUpdated} Portfolio</div>
                            )}
                            {/* {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("event") > -1 && (
                                <div className="text-end fs-6">
                                    <a data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Event-Portfolio-Old.aspx"}>Old Event Portfolio</a>
                                </div>
                            )} */}
                            {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("component") > -1 && (
                                <div style={{ color: `${portfolioColor}` }}>{IsUpdated} Portfolio</div>
                            )}
                             {IsUpdated === "" && IsUpdated != undefined && (
                                <div style={{ color: `${portfolioColor}` }}><LabelInfoIconToolTip columnName={"TeamPortfolioPageTitle"} ContextInfo={ContextValue} defaultTitle={"Team Portfolio"}/></div>
                            )}
                            {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("component") > -1 && (
                                <div className="text-end fs-6">
                                    {/* {(IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) && <div className='text-end fs-6'>
                                        {(ContextValue?.siteUrl?.toLowerCase().indexOf('ksl') > -1 || ContextValue?.siteUrl?.toLowerCase().indexOf('gmbh') > -1) ? (
                                            <a data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Team-Portfolio-Old.aspx"} >Old Team Portfolio</a>
                                        ) : <a data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Component-Portfolio-Old.aspx"} >Old Component Portfolio</a>
                                        } </div>} */}
                                </div>
                            )}
                        </h2>
                    </div>
                    <div className="togglecontent mt-1">
                        {filterCounters == true ? <TeamSmartFilter  setSmartTimelastModifiedDate={setSmartTimelastModifiedDate} openTableSettingPopup={childRef?.current?.openTableSettingPopup} setSmartFabBasedColumnsSetting={childRef?.current?.setSmartFabBasedColumnsSetting} LoadAllSiteTasksAllData={LoadAllSiteTasksAllData} AllSiteTasksDataLoadAll={AllSiteTasksDataLoadAll} IsUpdated={IsUpdated} IsSmartfavorite={IsSmartfavorite} IsSmartfavoriteId={IsSmartfavoriteId} ProjectData={ProjectData} portfolioTypeData={portfolioTypeData} setLoaded={setLoaded} AllSiteTasksData={AllSiteTasksData} AllMasterTasksData={AllMasterTasksData} SelectedProp={SelectedProp.SelectedProp} ContextValue={ContextValue} smartFiltercallBackData={smartFiltercallBackData} portfolioColor={portfolioColor} /> : ''}
                    </div>
                </section>
                <section className="Tabl1eContentSection row taskprofilepagegreen">
                    <div className="container-fluid p-0">
                        <section className="TableSection">
                            <div className="container p-0">
                                <div className="Alltable mt-2 ">
                                    <div className="col-sm-12 p-0 smart">
                                        <div>
                                            <div>
                                                <GlobalCommanTable showRestructureButton={true} AllSitesTaskData={allTaskDataFlatLoadeViewBackup}
                                                    masterTaskData={allMasterTaskDataFlatLoadeViewBackup} bulkEditIcon={true} portfolioTypeDataItemBackup={portfolioTypeDataItemBackup} taskTypeDataItemBackup={taskTypeDataItemBackup}
                                                    flatViewDataAll={flatViewDataAll} setData={setData} updatedSmartFilterFlatView={updatedSmartFilterFlatView} setLoaded={setLoaded} clickFlatView={clickFlatView} switchFlatViewData={switchFlatViewData}
                                                    flatView={true} switchGroupbyData={switchGroupbyData} smartTimeTotalFunction={smartTimeTotalFunction} SmartTimeIconShow={true} AllMasterTasksData={AllMasterTasksData} ref={childRef}
                                                    callChildFunction={callChildFunction} AllListId={ContextValue} columns={columns} restructureCallBack={callBackData1} data={data} callBackData={callBackData} TaskUsers={AllUsers}
                                                    portfolioColor={portfolioColor} portfolioTypeData={portfolioTypeDataItem} taskTypeDataItem={taskTypeDataItem} fixedWidth={true} portfolioTypeConfrigration={portfolioTypeConfrigration}
                                                    showingAllPortFolioCount={true} showCreationAllButton={true} OpenAddStructureModal={OpenAddStructureModal} addActivity={addActivity}
                                                    customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons}
                                                    showHeader={true} tableId="teamPortfolio" columnSettingIcon={true} smartTimelastModifiedDate={smartTimelastModifiedDate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
                <Panel onRenderHeader={onRenderCustomHeaderMain1} type={PanelType.custom} customWidth="600px" isOpen={OpenAddStructurePopup} isBlocking={false} onDismiss={callbackdataAllStructure} >
                    {/* <PortfolioStructureCreationCard
                    CreatOpen={CreateOpenCall}el
                    Close={AddStructureCallBackCall}
                    PortfolioType={IsUpdated}
                    PropsValue={ContextValue}
                    SelectedItem={
                        checkedList != null && checkedList?.Id != undefined
                            ? checkedList
                            : props
                    }
                /> */}
                    <CreateAllStructureComponent
                        Close={callbackdataAllStructure}
                        taskUser={AllUsers}
                        portfolioTypeData={portfolioTypeData}
                        PropsValue={ContextValue}
                        SelectedItem={
                            checkedList != null && checkedList?.Id != undefined
                                ? checkedList
                                : props
                        }
                    />

                </Panel>

                {openCompareToolPopup && <CompareTool isOpen={openCompareToolPopup} compareToolCallBack={compareToolCallBack} compareData={childRef?.current?.table?.getSelectedRowModel()?.flatRows} contextValue={SelectedProp?.SelectedProp} />}

                <Panel
                    onRenderHeader={onRenderCustomHeaderMain}
                    type={PanelType.custom}
                    customWidth="620px"
                    isOpen={ActivityPopup}
                    onDismiss={closeActivity}
                    isBlocking={false}
                >
                    <div className="modal-body clearfix">
                        <div
                            className={
                                IsUpdated == "Events Portfolio"
                                    ? "app component clearfix eventpannelorange"
                                    : IsUpdated == "Service Portfolio"
                                        ? "app component clearfix serviepannelgreena"
                                        : "app component clearfix"
                            }
                        >
                            <div id="portfolio" className="section-event pt-0">
                                {checkedList != undefined &&
                                    checkedList?.TaskType?.Title == "Workstream" ? (
                                    <div className="mt-4 clearfix">
                                        <h4 className="titleBorder "> Type</h4>
                                        <div className="col p-0 taskcatgoryPannel">
                                            <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Bug")} className={activeTile == "Bug" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                                <span className="tasks-label">Bug</span>
                                            </a>
                                            <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Feedback")} className={activeTile == "Feedback" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                                <span className="tasks-label">Feedback</span>
                                            </a>
                                            <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Improvement")} className={activeTile == "Improvement" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                                <span className="tasks-label">Improvement</span>
                                            </a>
                                            <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Design")} className={activeTile == "Design" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                                <span className="tasks-label">Design</span>
                                            </a>
                                            <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Task")} className={activeTile == "Task" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                                <span className="tasks-label">Task</span>
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 clearfix">
                                    <h4 className="titleBorder "> Type</h4>
                                    <div className="col p-0 taskcatgoryPannel">
                                    <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Activities")} className={activeTile == "Activities" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Activity</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Task")} className={activeTile == "Task" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Task</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Development")} className={activeTile == "Development" ? "active bg-siteColor subcategoryTask text-center ms-3" : "bg-siteColor subcategoryTask text-center ms-3"}>
                                            <span className="tasks-label">Development</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Improvement")} className={activeTile == "Improvement" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Improvement</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Implementation")} className={activeTile == "Implementation" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Implementation</span>
                                        </a>
                                      
                                       
                                       
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <footer className="pull-right mt-3">
                        <button
                            type="button"
                            className="btn btn-primary mx-2"
                            onClick={() => Createbutton()} disabled={activeTile === "" ? true : false}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="btn btn-default btn-default ms-1 pull-right"
                            onClick={closeActivity}
                        >
                            Cancel
                        </button>
                    </footer>
                </Panel>
                {isOpenActivity && (
                    <CreateActivity
                        Call={Call}
                        AllListId={ContextValue}
                        context={SelectedProp?.SelectedProp?.Context}
                        TaskUsers={AllUsers}
                        AllClientCategory={AllClientCategory}
                        LoadAllSiteTasks={LoadAllSiteTasks}
                        selectedItem={
                            checkedList != null && checkedList?.Id != undefined
                                ? checkedList
                                : SelectedProp
                        }
                        portfolioTypeData={portfolioTypeData}
                    />
                )}
                {isOpenWorkstream && (
                    <CreateWS
                        selectedItem={checkedList}
                        Call={Call}
                        AllListId={ContextValue}
                        context={SelectedProp?.SelectedProp?.Context}
                        TaskUsers={AllUsers}
                        data={data}>
                    </CreateWS>)}
                {IsTask && (
                    <EditTaskPopup
                        Items={CMSTask}
                        Call={Call}
                        AllListId={SelectedProp?.SelectedProp}
                        context={SelectedProp?.SelectedProp?.Context}
                        pageName={"TaskFooterTable"}
                    ></EditTaskPopup>
                )}
                {IsComponent && (
                    <EditInstituton
                        item={CMSToolComponent}
                        Calls={Call}
                        SelectD={SelectedProp?.SelectedProp}
                        portfolioTypeData={portfolioTypeData}
                    >
                    </EditInstituton>
                )}
                {IsTimeEntry && (
                    <TimeEntryPopup
                        props={cmsTimeComponent}
                        CallBackTimeEntry={TimeEntryCallBack}
                        Context={SelectedProp?.SelectedProp?.Context}
                    ></TimeEntryPopup>
                )}
                {!loaded && <PageLoader />}
            </div>
        </myContextValue.Provider>
    );
}
export default TeamPortlioTable;
export { myContextValue }