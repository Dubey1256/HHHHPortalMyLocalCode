import * as React from "react";
import * as $ from "jquery";
import * as Moment from "moment";
import { Panel, PanelType } from "office-ui-fabric-react";
import { FaCompressArrowsAlt, FaFilter, } from "react-icons/fa";
import pnp, { Web } from "sp-pnp-js";
import { map } from "jquery";
import EditInstitution from "../webparts/EditPopupFiles/EditComponent";
import TimeEntryPopup from "./TimeEntry/TimeEntryComponent";
import EditTaskPopup from "./EditTaskPopup/EditTaskPopup";
import * as globalCommon from "./globalCommon";
import ShowTaskTeamMembers from "./ShowTaskTeamMembers";
import CreateAllStructureComponent from "./CreateAllStructure";
import CreateActivity from "./CreateActivity";
import CreateWS from "./CreateWS";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "./Tooltip";
import { ColumnDef } from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightableCell from "./GroupByReactTableComponents/highlight";
import ShowClintCatogory from "./ShowClintCatogory";
import ReactPopperTooltip from "./Hierarchy-Popper-tooltip";
import GlobalCommanTable, { IndeterminateCheckbox } from "./GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from "./InfoIconsToolTip/InfoIconsToolTip";
// import TeamSmartFilter from "../../../globalComponents/SmartFilterGolobalBomponents/TeamSmartFilter";
import ReactPopperTooltipSingleLevel from "./Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import PageLoader from "./pageLoader";
import CompareTool from "./CompareTool/CompareTool";
import TrafficLightComponent from "./TrafficLightVerification/TrafficLightComponent";
import RestructuringCom from "./Restructuring/RestructuringCom";
var filt: any = "";
var ContextValue: any = {};
let isUpdated: any = "";
let componentData: any = [];
let timeSheetConfig: any = {}
let countsrun = 0;
let count = 1;
let childRefdata: any;
let portfolioColor: any = '';
let ProjectData: any = [];
let copyDtaArray: any = [];
let renderData: any = [];
let countAllComposubData: any = [];
let countAllTasksData: any = [];
let AfterFilterTaskCount: any = [];
let allLoadeDataMasterTaskAndTask: any = [];
let allMasterTaskDataFlatLoadeViewBackup: any = [];
let allTaskDataFlatLoadeViewBackup: any = [];
let hasCustomExpanded: any = true
let hasExpanded: any = true
let isHeaderNotAvlable: any = false
let isColumnDefultSortingAsc: any = false;
 let filterTaskType:any=false;
 let AlltaskfilterData:any;
function ReadyMadeTable(SelectedProp: any) {
    const childRef = React.useRef<any>();
    const restructuringRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };

    }
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
    ContextValue = SelectedProp?.AllListId;
    const refreshData = () => setData(() => renderData);
    const [loaded, setLoaded] = React.useState(false);
    const [siteConfig, setSiteConfig] = React.useState([]);
    const [TableProperty, setTableProperty] = React.useState([]);
    const [data, setData] = React.useState([]);
    copyDtaArray = data;
    const [activeTile, setActiveTile] = React.useState("")
    const [AllUsers, setTaskUser] = React.useState([]);
    const [AllMetadata, setMetadata] = React.useState([])
    const [AllClientCategory, setAllClientCategory] = React.useState([])
    const [IsUpdated, setIsUpdated] = React.useState("");
    const [trueRestructuring, setTrueRestructuring] = React.useState(false)
    const [checkedList, setCheckedList] = React.useState<any>({});
    const [AllSiteTasksData, setAllSiteTasksData] = React.useState([]);
    const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
    const [smartAllFilterData, setAllSmartFilterData] = React.useState([])
    const [portfolioTypeData, setPortfolioTypeData] = React.useState([])
    const [taskTypeData, setTaskTypeData] = React.useState([])
    const [updatedSmartFilter, setUpdatedSmartFilter] = React.useState(false);
    const [AllSmartFilterDataBackup, setAllSmartFilterDataBackup] = React.useState([]);
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
    const checkedList1: any = React.useRef([]);
    const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
    const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
    const [smartTimeTotalFunction, setSmartTimeTotalFunction] = React.useState(null);
    const [groupByButtonClickData, setGroupByButtonClickData] = React.useState([]);
    const [clickFlatView, setclickFlatView] = React.useState(false);
    const [updatedSmartFilterFlatView, setUpdatedSmartFilterFlatView] = React.useState(false);
    const [flatViewDataAll, setFlatViewDataAll] = React.useState([]);
    const [openCompareToolPopup, setOpenCompareToolPopup] = React.useState(false);
    const rerender = React.useReducer(() => ({}), {})[1];
    const [taskCatagory, setTaskCatagory] = React.useState([]);
    const [ActiveCompareToolButton, setActiveCompareToolButton] = React.useState(false);
    const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Component', Suffix: 'C', Level: 1 }, { Title: 'SubComponent', Suffix: 'S', Level: 2 }, { Title: 'Feature', Suffix: 'F', Level: 3 }]);
    const [timeEntryDataLocalStorage, setTimeEntryDataLocalStorage] = React.useState<any>(localStorage.getItem('timeEntryIndex'));
    let Response: any = [];
    let props = undefined;
    let AllTasks: any = [];
    let AllComponetsData: any = [];
    let TaskUsers: any = [];
    let TasksItem: any = [];
    React.useEffect(() => {
        if (AllSiteTasksData?.length > 0) {
            if (isUpdated != "") {
                if (portfolioTypeData.length > 0) {
                    portfolioTypeData?.map((elem: any) => {
                        if (elem.Title === isUpdated || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) {
                            portfolioColor = elem.Color;
                        }
                    })
                }
            } else {
                if (portfolioTypeData.length > 0) {
                    portfolioTypeData?.map((elem: any) => {
                        if (elem.Title === "Component") {
                            portfolioColor = elem.Color;
                        }
                    })

                }

                if (SelectedProp?.configration == "AllAwt" && SelectedProp?.SelectedItem != undefined) {
                    if ('Parent' in SelectedProp?.SelectedItem) {
                        taskTypeData?.map((levelType: any) => {
                            if (levelType.Level === 1)
                                componentActivity(levelType, SelectedProp?.SelectedItem);
                        })
                    }
                    if ('ParentTask' in SelectedProp?.SelectedItem) {
                        let data: any = [SelectedProp?.SelectedItem]
                        data?.map((wTdata: any) => {
                            wTdata.subRows = [];
                            componentWsT(wTdata);
                        })
                        executeOnce()
                        setLoaded(true)
                        setData(data[0]?.subRows);


                    }
                    console.log(data)

                }
                else if (SelectedProp?.configration == "AllAwt" && SelectedProp?.SelectedItem == undefined) {
                    taskTypeData?.map((levelType: any) => {
                        if (levelType.Level === 1)
                            componentActivity(levelType, SelectedProp?.SelectedItem);
                    })
                }



            }
        }


    }, [AllSiteTasksData?.length > 0])

    React.useEffect(() => {
        findPortFolioIconsAndPortfolio();
        GetSmartmetadata();
        getTaskUsers();
        getPortFolioType();
        getTaskType();
    }, [])

    React.useEffect(() => {
        if (AllMetadata?.length > 0 && portfolioTypeData.length > 0) {
            if (SelectedProp?.SelectedItem != undefined) {
                setCheckedList(SelectedProp?.SelectedItem)
                checkedList1.current = [SelectedProp?.SelectedItem]
            }
            if (SelectedProp?.ComponentFilter != undefined) {
                setIsUpdated(SelectedProp?.ComponentFilter)
            }
            if (SelectedProp?.configration == "AllCSF") {
                GetComponents();
            } else if (SelectedProp?.configration == "AllAwt") {
                // GetComponents();
                // setSiteConfig()
                LoadAllSiteTasks();
            } else {
                GetComponents();

                LoadAllSiteTasks();
            }




        }
    }, [AllMetadata?.length > 0 && portfolioTypeData?.length > 0])
    const getTaskUsers = async () => {
        let web = new Web(ContextValue.siteUrl);
        let taskUsers = [];
        taskUsers = await web.lists
            .getById(ContextValue.TaskUsertListID)
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
            )
            .get();
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
        let Categories: any = [];
        // let FeatureType: any = []
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
            if (newtest?.TaxType == 'timesheetListConfigrations') {
                timeSheetConfig = newtest;
            }
        })
        if (siteConfigSites?.length > 0) {
            if (SelectedProp?.SelectedSiteForTask?.length > 0) {
                let selectedSiteConfig = siteConfigSites?.filter((configureData: any) => SelectedProp?.SelectedSiteForTask?.find((data: any) => data == configureData?.Title))
                setSiteConfig(selectedSiteConfig)
            } else {
                setSiteConfig(siteConfigSites)
            }

        }
        setTaskCatagory(Categories);
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

    const findUserByName = (name: any) => {
        const user = AllUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url;
        } else { Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"; }
        return user ? Image : null;
    };
    const countComponentLevel = (countTaskAWTLevel: any) => {
        if (countTaskAWTLevel?.length > 0) {
            portfolioTypeDataItem?.map((type: any) => {
                countTaskAWTLevel?.map((result: any) => {
                    if (result?.Item_x0020_Type === type?.Title) {
                        // if(isAllTaskSelected != true){
                        type[type.Title + "filterNumber"] += 1;
                        type[type.Title + "number"] += 1;
                        // }

                    }
                });
            });
            const portfolioLabelCountBackup: any = JSON.parse(JSON.stringify(portfolioTypeDataItem));
            setPortFolioTypeIconBackup(portfolioLabelCountBackup);
        }
    };
    const countTaskAWTLevel = (countTaskAWTLevel: any) => {
        if (countTaskAWTLevel.length > 0) {

            countTaskAWTLevel.map((result: any) => {
                taskTypeDataItem?.map((type: any) => {
                    if (result?.TaskType?.Title === type.Title) {
                        type[type.Title + "number"] += 1;
                        type[type.Title + "filterNumber"] += 1;
                    }
                  
                });
            });
    
            const taskLabelCountBackup: any = JSON.parse(JSON.stringify(taskTypeDataItem));
            setTaskTypeDataItemBackup(taskLabelCountBackup)
        }
    };

    function executeOnce() {
        if (countAllTasksData?.length > 0) {
            let countAllTasksData1 = countAllTasksData?.filter(
                (ele: any, ind: any, arr: any) => {
                    const isDuplicate =
                        arr.findIndex((elem: any) => {
                            return (
                                (elem.ID === ele.ID || elem.Id === ele.Id) &&
                                elem.siteType === ele.siteType
                            );
                        }) !== ind;
                    return !isDuplicate;
                }
            );
            countTaskAWTLevel(countAllTasksData1);
        }
 
        if (countAllComposubData?.length > 0 && filterTaskType==false) {
            let countAllTasksData11 = countAllComposubData?.filter(
                (ele: any, ind: any, arr: any) => {
                    const isDuplicate =
                        arr.findIndex((elem: any) => {
                            return (
                                (elem.ID === ele.ID || elem.Id === ele.Id) &&
                                elem.siteType === ele.siteType
                            );
                        }) !== ind;
                    return !isDuplicate;
                }
            );
            countComponentLevel(countAllTasksData11);
        }
    }

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
                        "Created", "Modified", "IsTodaysTask", "workingThisWeek"
                    )
                    .expand(
                        "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
                        "TaskCategories", "Project",
                    ).orderBy("orderby", false).filter(SelectedProp?.TaskFilter != undefined ? SelectedProp?.TaskFilter : "").getAll();

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
                    AllTasks = AllTasks.concat(AllTasksMatches);
                }
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
                            if (result.Author) {
                                result.Author.autherImage = findUserByName(result.Author?.Id)
                            }
                            result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
                            if (result.DisplayDueDate == "Invalid date" || "") {
                                result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
                            }
                            result.DisplayModifiedDate = Moment(result.Modified).format("DD/MM/YYYY");
                            if (result.Editor) {
                                result.Editor.autherImage = findUserByName(result.Editor?.Id)
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
                                    const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                                    const commentsFormData = JSON?.parse(cleanedComments);
                                    result.commentsSearch = commentsFormData?.reduce((accumulator: any, comment: any) => {
                                        return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                                    }, "").trim();
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
                                                result.AllTeamName += users.Title + ";";
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
                                                result.AllTeamName += users.Title + ";";
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
                                                result.AllTeamName += users.Title + ";";
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
                            result = globalCommon.findTaskCategoryParent(taskCatagory, result)
                         
                            result.SmartPriority = globalCommon.calculateSmartPriority(result);
                            // result = globalCommon.findTaskCategoryParent(taskCatagory, result)
                            result["Item_x0020_Type"] = "Task";
                            TasksItem.push(result);
                            AllTasksData.push(result);
                        });
                        if(filterTaskType){
                            console.log(AllSiteTasksData)
                             AlltaskfilterData=[...AllSiteTasksData,...AllTasksData]
                             await smartTimeUseLocalStorage(AlltaskfilterData)
                           
                             setAllSiteTasksData(AlltaskfilterData);
                             DataPrepareForCSFAWT()
                        }
                        
                        else{
                            await smartTimeUseLocalStorage(AllTasksData)
                            setAllSiteTasksData(AllTasksData);
                        }
                       
                        // countTaskAWTLevel(AllTasksData, '');
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
    const smartTimeUseLocalStorage = (AllTasksData:any) => {
        if (timeEntryDataLocalStorage?.length > 0) {
            const timeEntryIndexLocalStorage = JSON.parse(timeEntryDataLocalStorage)
            AllTasksData?.map((task: any) => {
                task.TotalTaskTime = 0;
                task.timeSheetsDescriptionSearch = "";
                const key = `Task${task?.siteType + task.Id}`;
                if (timeEntryIndexLocalStorage.hasOwnProperty(key) && timeEntryIndexLocalStorage[key]?.Id === task.Id && timeEntryIndexLocalStorage[key]?.siteType === task.siteType) {
                    // task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime % 1 != 0 ? parseFloat(timeEntryIndexLocalStorage[key]?.TotalTaskTime?.toFixed(2)) : timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    task.timeSheetsDescriptionSearch = timeEntryIndexLocalStorage[key]?.timeSheetsDescriptionSearch;
                }
            });
            return AllTasksData;
        }
    };
    const timeEntryIndex: any = {};
    const smartTimeTotal = async () => {
        setLoaded(false)
        count++;
        let AllTimeEntries = [];
        if (timeSheetConfig?.Id !== undefined) {
            AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfig);
        }
        AllTimeEntries?.forEach((entry: any) => {
            siteConfig.forEach((site) => {
                const taskTitle = `Task${site.Title}`;
                const key = taskTitle + entry[taskTitle]?.Id
                if (entry.hasOwnProperty(taskTitle) && entry.AdditionalTimeEntry !== null && entry.AdditionalTimeEntry !== undefined) {
                    if (entry[taskTitle].Id === 168) {
                        console.log(entry[taskTitle].Id);

                    }
                    const additionalTimeEntry = JSON.parse(entry.AdditionalTimeEntry);
                    let totalTaskTime = additionalTimeEntry?.reduce((total: any, time: any) => total + parseFloat(time.TaskTime), 0);

                    if (timeEntryIndex.hasOwnProperty(key)) {
                        timeEntryIndex[key].TotalTaskTime += totalTaskTime
                    } else {
                        timeEntryIndex[`${taskTitle}${entry[taskTitle]?.Id}`] = {
                            ...entry[taskTitle],
                            TotalTaskTime: totalTaskTime,
                            siteType: site.Title,
                        };
                    }
                }
            });
        });
        AllSiteTasksData?.map((task: any) => {
            task.TotalTaskTime = 0;
            const key = `Task${task?.siteType + task.Id}`;
            if (timeEntryIndex.hasOwnProperty(key) && timeEntryIndex[key]?.Id === task.Id && timeEntryIndex[key]?.siteType === task.siteType) {
                task.TotalTaskTime = timeEntryIndex[key]?.TotalTaskTime;
            }
        })
        if (timeEntryIndex) {
            const dataString = JSON.stringify(timeEntryIndex);
            localStorage.setItem('timeEntryIndex', dataString);
        }
        console.log("timeEntryIndex", timeEntryIndex)
        if (AllSiteTasksData?.length > 0) {
            setData([]);
            portfolioTypeData?.map((port: any, index: any) => {
                if (SelectedProp?.SelectedItem != undefined) {
                    if (port.Title === SelectedProp?.SelectedItem?.Item_x0020_Type) {
                        componentData = []
                        componentGrouping(port?.Id, port?.Id);
                    }
                    if ('ParentTask' in SelectedProp?.SelectedItem) {
                        let data: any = [SelectedProp?.SelectedItem]
                        data?.map((wTdata: any) => {
                            wTdata.subRows = [];
                            componentWsT(wTdata);
                        })
                       
                        setLoaded(true)
                        setData(data[0]?.subRows);
        
        
                    }
                    console.log(data)
        
                }else{
                    portfolioTypeData?.map((port: any, index: any) => {
                        if (SelectedProp?.SelectedItem != undefined) {
                            if (port.Title === SelectedProp?.SelectedItem?.PortfolioType?.Title) {
                                componentData = []
                                componentGrouping(port?.Id, portfolioTypeData?.length - 1);
                            }
                        } else {
                            componentData = []
                            componentGrouping(port?.Id, index);
                        }
        
                    })
                }

            })
            countsrun++;

        }

        setLoaded(true)
        return AllSiteTasksData;
    };
    const GetComponents = async () => {
        if (portfolioTypeData.length > 0) {
            portfolioTypeData?.map((elem: any) => {
                if (isUpdated === "" && SelectedProp?.ComponentFilter == undefined) {
                    filt = "";
                } else if ((isUpdated || SelectedProp?.ComponentFilter) === elem.Title || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) { filt = "(PortfolioType/Title eq '" + elem.Title + "')" }
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

            .filter(filt)
            .getAll();

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
                result.Author.autherImage = findUserByName(result.Author?.Id)
            }
            result.DisplayModifiedDate = Moment(result.Modified).format("DD/MM/YYYY");
            if (result?.Editor) {
                result.Editor.autherImage = findUserByName(result?.Editor?.Id)
            }
            if (result.PercentComplete != undefined) {
                result.PercentComplete = Number((result.PercentComplete * 100).toFixed(0));
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
                    const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                    const commentsFormData = JSON?.parse(cleanedComments);
                    result.commentsSearch = commentsFormData?.reduce((accumulator: any, comment: any) => {
                        return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                    }, "").trim();
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
                                result.AllTeamName += users.Title + ";";
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
                                result.AllTeamName += users.Title + ";";
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
                                result.AllTeamName += users.Title + ";";
                            }
                        });
                    }
                });
            }
            // portfolioTypeDataItem?.map((type: any) => {
            //     if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
            //         type[type.Title + 'number'] += 1;
            //         type[type.Title + 'filterNumber'] += 1;
            //     }
            // })
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


    };
    // React.useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     let query = params.get("PortfolioType");
    //     if (query) {
    //         setIsUpdated(query);
    //         isUpdated = query;
    //     }
    //     let smartFavoriteIdParam = params.get("SmartfavoriteId");
    //     if (smartFavoriteIdParam) {
    //         setIsSmartfavoriteId(smartFavoriteIdParam);
    //     }
    //     let smartFavoriteParam = params.get("smartfavorite");
    //     if (smartFavoriteParam) {
    //         setIsSmartfavorite(smartFavoriteParam);
    //     }
    // }, [])








    // const smartFiltercallBackData = React.useCallback((filterData, updatedSmartFilter, smartTimeTotal, flatView) => {
    //     if (filterData.length > 0 && smartTimeTotal) {
    //         setUpdatedSmartFilter(updatedSmartFilter);
    //         setUpdatedSmartFilterFlatView(flatView);
    //         setAllSmartFilterOriginalData(filterData);
    //         let filterDataBackup: any = []
    //         try {
    //             filterDataBackup = JSON.parse(JSON.stringify(filterData));
    //         } catch (error) {
    //             console.log("backup Json parse error smartFiltercallBackData function");
    //         }
    //         setAllSmartFilterData(filterDataBackup);
    //         setSmartTimeTotalFunction(() => smartTimeTotal);
    //     } else if (updatedSmartFilter === true && filterData.length === 0) {
    //         renderData = [];
    //         renderData = renderData.concat(filterData)
    //         refreshData();
    //         setLoaded(true);
    //     }
    // }, []);

    React.useEffect(() => {
        if (AllMasterTasksData?.length > 0) {
            DataPrepareForCSFAWT()
        }
    }, [(AllMasterTasksData.length > 0 && AllSiteTasksData?.length > 0)]);


    function DataPrepareForCSFAWT(){
        isColumnDefultSortingAsc = false
        hasCustomExpanded = true
        hasExpanded = true
        isHeaderNotAvlable = false
        setLoaded(false);
        componentData = [];
        AfterFilterTaskCount = [];
        let count = 0;
        let afterFilter = true;
        setAllSmartFilterDataBackup(structuredClone(AllMasterTasksData));

        portfolioTypeData?.map((port: any, index: any) => {
            count = count + 1;
            componentGrouping(port?.Id, index);
        })
        if (portfolioTypeData?.length === count) {
            executeOnce();
        }

        // if (IsUpdated === "") {

        // }
        //  else if (IsUpdated.length) {
        //     portfolioTypeData?.map((port: any) => {
        //         if (IsUpdated.toLowerCase() === port?.Title?.toLowerCase()) {
        //             count = count + 1;
        //             componentGrouping(port?.Id, '');
        //         }
        //     })
        // }
        // taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0 });
        AfterFilterTaskCount = AfterFilterTaskCount?.filter((ele: any, ind: any, arr: any) => {
            const isDuplicate = arr.findIndex((elem: any) => { return (elem.ID === ele.ID || elem.Id === ele.Id) && elem.siteType === ele.siteType; }) !== ind
            return !isDuplicate;
        })
        // countTaskAWTLevel(AfterFilterTaskCount, afterFilter);
        childRef?.current?.setRowSelection({});
        childRef?.current?.setColumnFilters([]);
        childRef?.current?.setGlobalFilter('');
    }
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

    // ********* component Grouping Function  Start*********************************
    const componentGrouping = (portId: any, index: any) => {
        let FinalComponent: any = []
        let AllComponents: any
        let AllProtFolioData = AllMasterTasksData?.filter((comp: any) => comp?.PortfolioType?.Id === portId && comp.TaskType === undefined);
        if (SelectedProp?.SelectedItem != undefined) {
            AllComponents = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === SelectedProp?.SelectedItem?.Id);
        } else {
            AllComponents = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === 0 || comp?.Parent?.Id === undefined);
        }
        AllComponents?.map((masterTask: any) => {

            countAllComposubData = countAllComposubData.concat(masterTask);
            masterTask.subRows = [];

            taskTypeData?.map((levelType: any) => {
                if (levelType.Level === 1)
                    componentActivity(levelType, masterTask);
            })


            let subComFeat = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === masterTask?.Id)
            countAllComposubData = countAllComposubData.concat(subComFeat);
            masterTask.subRows = masterTask?.subRows?.concat(subComFeat);
            subComFeat?.forEach((subComp: any) => {

                subComp.subRows = [];

                taskTypeData?.map((levelType: any) => {
                    if (levelType.Level === 1)
                        componentActivity(levelType, subComp);
                })

                let allFeattData = AllProtFolioData?.filter((elem: any) => elem?.Parent?.Id === subComp?.Id);
                countAllComposubData = countAllComposubData.concat(allFeattData);
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
                let level = element?.subRows?.filter((obj: any) => obj?.Item_x0020_Type != undefined && obj?.Item_x0020_Type != "Task");
                let leveltask = element?.subRows?.filter((obj: any) => obj?.Item_x0020_Type === "Task");
                DynamicSort(level, 'Item_x0020_Type', 'asc')
                element.subRows = [];
                element.subRows = level.concat(leveltask)
            }
            if (element?.subRows != undefined) {
                element?.subRows?.forEach((obj: any) => {
                    let level1 = obj?.subRows?.filter((obj: any) => obj?.Item_x0020_Type != undefined && obj?.Item_x0020_Type != "Task");
                    let leveltask1 = obj?.subRows?.filter((obj: any) => obj?.Item_x0020_Type === "Task");
                    DynamicSort(level1, 'Item_x0020_Type', 'asc')
                    obj.subRows = [];
                    obj.subRows = level1?.concat(leveltask1)
                })
            }
        });

        if (portfolioTypeData?.length - 1 === index || index === '') {
            if (SelectedProp?.SelectedItem != undefined) {
                let  Actatcomponent:any;
                if(filterTaskType){
                      Actatcomponent = AlltaskfilterData?.filter(
                        (elem1: any) =>
                            elem1?.TaskType?.Id === 1 &&
                            elem1?.Portfolio?.Id === SelectedProp?.SelectedItem?.Id
                    );
                }else{
                    Actatcomponent = AllSiteTasksData?.filter(
                        (elem1: any) =>
                            elem1?.TaskType?.Id === 1 &&
                            elem1?.Portfolio?.Id === SelectedProp?.SelectedItem?.Id
                    );
                }



              
                countAllTasksData = countAllTasksData.concat(Actatcomponent);
                Actatcomponent?.map((masterTask1: any) => {
                    masterTask1.subRows = [];
                    taskTypeData?.map((levelType: any) => {
                        if (levelType.Level === 1) componentWsT(masterTask1);
                    });
                    componentData.push(masterTask1);
                });
            }

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
            if(filterTaskType){
                temp.subRows =
            
                AlltaskfilterData?.filter((elem1: any) =>
                    elem1?.TaskType?.Id != undefined &&
                    elem1?.TaskType?.Level != 1 &&
                    elem1?.TaskType?.Level != 2 &&
                    (elem1?.ParentTask === undefined ||
                        elem1?.ParentTask?.TaskID === null) &&
                    elem1?.Portfolio?.Id === SelectedProp?.SelectedItem?.Id);
            countAllTasksData = countAllTasksData.concat(temp.subRows);
            temp.subRows.forEach((task: any) => {
                if (task.TaskID === undefined || task.TaskID === '')
                    task.TaskID = 'T' + task.Id;
            })
            }else{
                temp.subRows =
            
                AllSiteTasksData?.filter((elem1: any) =>
                    elem1?.TaskType?.Id != undefined &&
                    elem1?.TaskType?.Level != 1 &&
                    elem1?.TaskType?.Level != 2 &&
                    (elem1?.ParentTask === undefined ||
                        elem1?.ParentTask?.TaskID === null) &&
                    elem1?.Portfolio?.Id === SelectedProp?.SelectedItem?.Id);
            countAllTasksData = countAllTasksData.concat(temp.subRows);
            temp.subRows.forEach((task: any) => {
                if (task.TaskID === undefined || task.TaskID === '')
                    task.TaskID = 'T' + task.Id;
            }) 
            }
           
            componentData.push(temp)
        }
        setLoaded(true);
        setData(componentData);
        console.log(AfterFilterTaskCount);
    }
    //---------------------- ********* component Grouping Function  End----------------- *********************************



    // ------------*************** AWST grouping function Start -------------------------- *******************************
    const componentActivity = (levelType: any, items: any) => {
        let findActivity: any = []
        let findTasks: any = []
       if(filterTaskType){
         
         if (items?.Id != undefined) {
            findActivity = AlltaskfilterData?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id);
            findTasks = AlltaskfilterData?.filter((elem1: any) => elem1?.TaskType?.Id != levelType.Id && (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined) && elem1?.Portfolio?.Id === items?.Id);
        }

        else {
            findActivity = AlltaskfilterData?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id);
            findTasks = AlltaskfilterData?.filter((elem1: any) => {
                if (elem1?.TaskType?.Id != levelType.Id && (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined)) {

                }
            })
        }
       }else{
        if (items?.Id != undefined) {
            findActivity = AllSiteTasksData?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id);
            findTasks = AllSiteTasksData?.filter((elem1: any) => elem1?.TaskType?.Id != levelType.Id && (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined) && elem1?.Portfolio?.Id === items?.Id);
        }

        else {
            findActivity = AllSiteTasksData?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id);
            findTasks = AllSiteTasksData?.filter((elem1: any) => {
                if (elem1?.TaskType?.Id != levelType.Id && (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined)) {

                }
            })
        }
       }
       
      

        countAllTasksData = countAllTasksData.concat(findTasks);
        countAllTasksData = countAllTasksData.concat(findActivity);

        findActivity?.forEach((act: any) => {
            act.subRows = [];
            let worstreamAndTask = AllSiteTasksData?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
            countAllTasksData = countAllTasksData.concat(worstreamAndTask);
            if (worstreamAndTask.length > 0) {
                act.subRows = act?.subRows?.concat(worstreamAndTask);

            }
            worstreamAndTask?.forEach((wrkst: any) => {
                wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
                let allTasksData = AllSiteTasksData?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
                if (allTasksData.length > 0) {
                    wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
                    // AfterFilterTaskCount = AfterFilterTaskCount.concat(allTasksData);
                    countAllTasksData = countAllTasksData.concat(allTasksData);
                }
            })

        })
        if (items != undefined && SelectedProp?.configration !== "AllAwt") {
            items.subRows = items?.subRows?.concat(findActivity)
            items.subRows = items?.subRows?.concat(findTasks)
        } else {
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
            temp.subRows = findTasks
            findActivity.push(temp)
          
            setData(findActivity);
            setLoaded(true);
        }

    }
    // *************** AWST grouping function End  *******************************
    //    const otherTask=()=>{
    //     var temp: any = {};
    //     temp.Title = "Others";
    //     temp.TaskID = "";
    //     temp.subRows = [];
    //     temp.PercentComplete = "";
    //     temp.ItemRank = "";
    //     temp.DueDate = "";
    //     temp.Project = "";
    //     temp.DisplayCreateDate = null;
    //     temp.DisplayDueDate = null;
    //     temp.DisplayModifiedDate = null;
    //     temp.TaskTypeValue = "";
    //     temp.AllTeamName = '';
    //     temp.ClientCategorySearch = '';
    //     temp.Created = null;
    //     temp.Author = "";
    //     temp.subRows = 
    //     AllSiteTasksData?.filter((elem1: any) => 
    //     elem1?.TaskType?.Id != undefined &&
    //     elem1?.TaskType?.Level != 1 &&
    //     elem1?.TaskType?.Level != 2 &&
    //     (elem1?.ParentTask === undefined ||
    //       elem1?.ParentTask?.TaskID === null) &&
    //     elem1?.Portfolio?.Id ===  SelectedProp?.SelectedItem?.Id);
    //     AfterFilterTaskCount = AfterFilterTaskCount.concat(temp.subRows);
    //     temp.subRows.forEach((task: any) => {
    //         if (task.TaskID === undefined || task.TaskID === '')
    //             task.TaskID = 'T' + task.Id;
    //     })
    //    return temp;
    //    }

    //------------ *************** wst grouping function Start------------------------  *******************************
    const componentWsT = (items: any) => {
        let findws = AllSiteTasksData.filter(
            (elem1: any) =>
                elem1?.ParentTask?.Id === items?.Id &&
                elem1?.siteType === items?.siteType
        );
        countAllTasksData = countAllTasksData.concat(findws);
        findws?.forEach((act: any) => {
            act.subRows = [];
            let allTasksData = AllSiteTasksData.filter(
                (elem1: any) =>
                    elem1?.ParentTask?.Id === act?.Id && elem1?.siteType === act?.siteType
            );
            if (allTasksData.length > 0) {
                act.subRows = act?.subRows?.concat(allTasksData);
                countAllTasksData = countAllTasksData.concat(allTasksData);
            }
        });
        items.subRows = items?.subRows?.concat(findws);
    };
   
    // *************** wst grouping function End   *******************************
    // const updatedSmartFilterFlatViewData = (data: any) => {
    //     hasCustomExpanded = false
    //     hasExpanded = false
    //     isHeaderNotAvlable = true
    //     isColumnDefultSortingAsc = true
    //     setData(data);
    //     // setData(smartAllFilterData);
    // }


    // -----------------*************** Flat view Data  function Start--------------- **************************
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
    const FilterAllTask = ()=>{
        if(filterTaskType==false){
            filterTaskType=true;
            setLoaded(false)
            SelectedProp.TaskFilter= "PercentComplete gt '0.89'";
            LoadAllSiteTasks()
        }
      
       
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
    // *************** Flat view Data  function End **************************

    //--------************** SwitchToGroupData Function Start *****************----------------------
    const switchGroupbyData = () => {
        isColumnDefultSortingAsc = false
        hasCustomExpanded = true
        hasExpanded = true
        isHeaderNotAvlable = false
        setclickFlatView(false);
        setData(groupByButtonClickData);
    }
    // ************** SwitchToGroupData Function Start *****************

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
                    <div className="hreflink">
                        <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={ContextValue} singleLevel={true} masterTaskData={allMasterTaskDataFlatLoadeViewBackup} AllSitesTaskData={allTaskDataFlatLoadeViewBackup} />
                    </div>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                isColumnDefultSortingAsc: isColumnDefultSortingAsc,
                // isColumnDefultSortingAsc:true,
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
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
                cell: ({ row, column, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != (null || undefined) &&
                            <span><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.PortfolioType?.Color}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${ContextValue.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`} >
                                <ReactPopperTooltip CMSToolId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={ContextValue} /></a></span>
                        }
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Project",
                resetColumnFilters: false,
                header: "",
                size: 70,
                isColumnVisible: true
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
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <div className="text-center">{row?.original?.PercentComplete}</div>
                ),
                id: "PercentComplete",
                placeholder: "Status",
                resetColumnFilters: false,
                header: "",
                size: 42,
                fixedColumnWidth:true,
                isColumnVisible: true
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
                size: 42,
                isColumnVisible: true,
                fixedColumnWidth:true
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
                size: 42,
                isColumnVisible: true,
                fixedColumnWidth:true
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
                size: 42,
                isColumnVisible: false,
                fixedColumnWidth:true
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                isColumnVisible: false
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
                fixedColumnWidth:true
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <div style={{ width: "70px" }} className="me-1">{row?.original?.DisplayCreateDate}</div>
                                {row?.original?.Author != undefined || row?.original?.AuthoId != undefined ? (
                                    <>
                                        <a
                                            href={`${ContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.AuthorId != undefined ? row?.original?.AuthorId : row?.original?.Author?.Id)} />
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </div>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                fixedColumnWidth:true,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 105,
                isColumnVisible: true
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
                                            <img title={row?.original?.Editor?.Title} className="workmember ms-1" src={findUserByName(row?.original?.EditorId != undefined ? row?.original?.EditorId : row?.original?.Editor?.Id)} />
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
                fixedColumnWidth:true,
                isColumnVisible: false,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayModifiedDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 115
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                id: "descriptionsSearch",
                isColumnVisible: false
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                id: "commentsSearch",
                isColumnVisible: false
            },
            {
                accessorKey: "timeSheetsDescriptionSearch",
                placeholder: "timeSheetsDescriptionSearch",
                header: "",
                resetColumnFilters: false,
                id: "timeSheetsDescriptionSearch",
                isColumnVisible: false
            },
            {
                accessorKey: "TotalTaskTime",
                id: "TotalTaskTime",
                placeholder: "Smart Time",
                header: "",
                resetColumnFilters: false,
                size: 49,
                isColumnVisible: true,
                fixedColumnWidth:true
            },
            {
                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType != "Master Tasks" && row?.original?.Title != "Others" && (
                            <a className="alignCenter" onClick={(e) => EditDataTimeEntryData(e, row.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
                                <span className="svg__iconbox svg__icon--clock hreflink dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
                            </a>
                        )}
                    </>
                ),
                id: "timeShitsIcons",
                canSort: false,
                placeholder: "",
                size: 1,
                isColumnVisible: true,
                fixedColumnWidth:true
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
                                        className="svg__iconbox hreflink svg__icon--edit"
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
                                        className="svg__iconbox hreflink svg__icon--edit"
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
            setTableProperty(childRef.current.table.getSelectedRowModel().flatRows)
            if (childRef.current.table.getSelectedRowModel().flatRows.length > 0) {
                setTrueRestructuring(true)
            }
        } else {
            setCheckedList({});
            setTableProperty([])
            setTrueRestructuring(false)
            array = [];
        }
        checkedList1.current = array;
    }, []);


    const callBackData1 = React.useCallback((getData: any, topCompoIcon: any) => {
        renderData = [];
        renderData = renderData.concat(getData);
        refreshData();
        setTopCompoIcon(topCompoIcon);
    }, []);


    //  Function to call the child component's function

    const callChildFunction = (items: any) => {
        if (restructuringRef.current) {
            restructuringRef.current.OpenModal(items);
        }
    };
    const trueTopIcon = (items: any) => {
        if (restructuringRef.current) {
            restructuringRef.current.trueTopIcon(items);
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
                <div className="subheading alignCenter">
                    <>
                        {checkedList != null && checkedList != undefined && checkedList?.SiteIconTitle != undefined && checkedList?.SiteIconTitle != null ? <span className="Dyicons me-2" >{checkedList?.SiteIconTitle}</span> : ''} {`${checkedList != null && checkedList != undefined && checkedList?.Title != undefined && checkedList?.Title != null ? checkedList?.Title
                            + '- Create Child Component' : 'Create Component'}`}</>
                </div>
                <Tooltip ComponentId="444" />
            </>
        );
    };


    const AddStructureCallBackCall = React.useCallback((item) => {
        if (checkedList1?.current.length == 0) {
            item[0]?.subRows.map((childs: any) => {
                copyDtaArray.unshift(childs)

            })
        } else {
            if (item[0]?.SelectedItem != undefined) {
                copyDtaArray.map((val: any) => {
                    item[0]?.subRows.map((childs: any) => {
                        if (item[0].SelectedItem == val.Id) {
                            val.subRows.unshift(childs)
                        }
                        if (val.subRows != undefined && val.subRows.length > 0) {
                            val.subRows?.map((child: any) => {
                                if (item[0].SelectedItem == child.Id) {
                                    child.subRows.unshift(childs)
                                }
                                if (child.subRows != undefined && child.subRows.length > 0) {
                                    child.subRows?.map((Subchild: any) => {
                                        if (item[0].SelectedItem == Subchild.Id) {
                                            Subchild.subRows.unshift(childs)
                                        }
                                    })
                                }
                            })
                        }
                    })
                })

            }

        }
        if (item != undefined && item?.length > 0 && item[0].SelectedItem == undefined) {
            item.forEach((value: any) => {
                copyDtaArray.unshift(value)
            })
        }



        setOpenAddStructurePopup(false);
        console.log(item)
        renderData = [];
        renderData = renderData.concat(copyDtaArray)
        refreshData();
        checkedList1.current = []

    }, [])
    const CreateOpenCall = React.useCallback((item) => { }, []);
    /// END ////



    const addedCreatedDataFromAWT = (arr: any, dataToPush: any) => {
        if (dataToPush?.PortfolioId === SelectedProp.SelectedItem.Id && dataToPush?.ParentTask?.Id === undefined) {
            arr.push(dataToPush)
            const othersIndex = arr.findIndex((items:any) => items.Title === 'Others')
            if (othersIndex !== -1) {
                const othersItem = arr.splice(othersIndex, 1)[0];
                arr.push(othersItem);
            }
            //   if(SelectedProp?.UsedFrom=='ProjectManagement'){
            //     try{
            //       globalContextData?.projectCallBackTask()
            //       globalContextData?.closeCompTaskPopup()
            //      }catch(e){
            //       console.error(e)
            //      }
            //   }
            return true;
        }
        else if (dataToPush?.PortfolioId == SelectedProp?.SelectedItem?.Portfolio?.Id && SelectedProp?.SelectedItem?.TaskType?.Title == "Activities" && checkedList?.Id == undefined) {
            arr.push(dataToPush)
            return true;
        }
        else if (dataToPush?.PortfolioId == SelectedProp?.SelectedItem?.Portfolio?.Id && SelectedProp?.SelectedItem?.TaskType?.Title == "Workstream") {
            arr.push(dataToPush)
         return true;
        } 

        else if (dataToPush?.PortfolioId === SelectedProp?.SelectedItem?.Id && dataToPush?.TaskTypeId == 2 && dataToPush?.ParentTaskId === null) {
            //   if(SelectedProp?.UsedFrom=='ProjectManagement'){
            //     try{
            //       globalContextData?.projectCallBackTask()
            //       globalContextData?.closeCompTaskPopup()
            //      }catch(e){
            //       console.error(e)
            //      }
            //   }
            const checkother = arr.filter((item: any) => item.Title === "Others");
            if (checkother?.length === 0) {
                let temp: any = {};
                temp.Title = "Others";
                temp.TaskID = "";
                temp.subRows = [];
                temp.TaskTypeValue = '';
                temp.PercentComplete = "";
                temp.ItemRank = "";
                temp.DueDate = null;
                temp.Project = "";
                temp.ClientCategorySearch = "";
                temp.Created = null;
                temp.DisplayCreateDate = null;
                temp.DisplayDueDate = null;
                temp.AllTeamName = "";
                temp.DueDate = "";
                temp.portfolioItemsSearch = "";
                temp.descriptionsSearch = "";
                temp.ProjectTitle = "";
                temp.Status = "";
                temp.Author = "";
                temp?.subRows?.push(dataToPush);
                copyDtaArray = copyDtaArray.concat(temp)
                return true;
            } else {
                checkother[0]?.subRows?.push(dataToPush)
                return true;
            }
        }
        for (let val of arr) {
            if (dataToPush?.PortfolioId === val.Id && dataToPush?.ParentTask?.Id === undefined) {
                val.subRows = val.subRows || [];
                val?.subRows?.push(dataToPush);
                return true;
            } 
           
               else if (dataToPush?.PortfolioId === val.Id && dataToPush?.ParentTask?.Id !=undefined) {
                    val.subRows = val.subRows || [];
                    val?.subRows?.push(dataToPush);
                    return true;
                }
            
            else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
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
    function deletedDataFromPortfolios(dataArray: any, idToDelete: any, siteName: any) {
        let updatedArray = [];
        let itemDeleted = false;
        for (let item of dataArray) {
            if (item.Id === idToDelete && item.siteType === siteName) {
                itemDeleted = true;
                continue;
            }
            let newItem = { ...item };
            if (newItem.subRows && newItem.subRows.length > 0) {
                newItem.subRows = deletedDataFromPortfolios(newItem.subRows, idToDelete, siteName);
            }
            updatedArray.push(newItem);
            if (itemDeleted) {
                return updatedArray;
            }
        }
        return updatedArray;
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
            if (res?.data?.PercentComplete != 0) {
                res.data.PercentComplete = res?.data?.PercentComplete * 100;
            }
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


    const CreateActivityPopup = (type: any) => {
        setActiveTile(type)
        if(SelectedProp?.SelectedItem!=undefined && checkedList?.Id==undefined){
            if (SelectedProp?.SelectedItem?.TaskType === undefined) {
                SelectedProp.SelectedItem.NoteCall = type;
    
            }
            if (SelectedProp?.SelectedItem?.TaskType?.Id == 1) {
                SelectedProp.SelectedItem.NoteCall = type;
            }
            if (SelectedProp?.SelectedItem?.TaskType?.Id == 3) {
                SelectedProp.SelectedItem.NoteCall = type;
            }
            if (SelectedProp?.SelectedItem?.TaskType?.Id == 2) {
                alert("You can not create ny item inside Task");
            }   

        }else{
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
        }
      
    };

    const Createbutton = () => {
        if (SelectedProp?.configration == "AllAwt") {
            if(SelectedProp?.SelectedItem !=undefined && checkedList?.TaskType==undefined){
               
                 if ( SelectedProp.SelectedItem?.TaskType?.Id == 1) {
                  setIsOpenWorkstream(true);
                    setActiveTile("")
                }
                if (SelectedProp.SelectedItem?.TaskType?.Id  == 3) {
                    SelectedProp.SelectedItem.NoteCall = "Task";
                    checkedList.NoteCall = "Task";
                    setIsOpenWorkstream(true);
                    setActiveTile("")
                }  
            }else{
                if (checkedList?.TaskType === undefined) {
                    // SelectedProp.SelectedItem.NoteCall = "Activities";
                    setIsOpenActivity(true);
                   setActiveTile("")
               
                }
                if (checkedList?.TaskType?.Id == 1) {
                    SelectedProp.SelectedItem.NoteCall = "Task";
                    checkedList.NoteCall = "Task";
                    setIsOpenWorkstream(true);
                    setActiveTile("")
                }
                if (checkedList?.TaskType?.Id == 3) {
                    SelectedProp.SelectedItem.NoteCall = "Task";
                    checkedList.NoteCall = "Task";
                    setIsOpenWorkstream(true);
                    setActiveTile("")
                }
            }
            

        } else {
            if (checkedList?.TaskType === undefined) {
                // SelectedProp.props.NoteCall = "Activities";
                 setIsOpenActivity(true);
                setActiveTile("")
            }
            if (checkedList?.TaskType?.Id == 1) {
                // checkedList.NoteCall = "Activities";
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
        }

    };
    const closeActivity = () => {
        setActivityPopup(false)
        childRef?.current?.setRowSelection({});
    }
    const addActivity = () => {
        if (checkedList?.TaskType?.Id == undefined) {
            checkedList.NoteCall = "activity"
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
    const restructureFunct = (items: any) => {
        setTrueRestructuring(items);
    }
    React.useEffect(() => {
        if (childRef?.current?.table?.getSelectedRowModel()?.flatRows.length === 2) {
            if (childRef?.current?.table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != undefined && childRef?.current?.table?.getSelectedRowModel()?.flatRows[1]?.original?.Item_x0020_Type != undefined && (childRef?.current?.table?.getSelectedRowModel()?.flatRows[1]?.original?.Item_x0020_Type != 'Tasks' || childRef?.current?.table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != 'Tasks')) {
                setActiveCompareToolButton(true);
            } else if (childRef?.current?.table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType != undefined && childRef?.current?.table?.getSelectedRowModel()?.flatRows[1]?.original?.TaskType != undefined) {
                setActiveCompareToolButton(true);
            }
        } else {
            setActiveCompareToolButton(false);
        }
    }, [childRef?.current?.table?.getSelectedRowModel()?.flatRows])
    const customTableHeaderButtons = (
        <>

            {(checkedList1?.current != undefined && childRef?.current?.table?.getSelectedRowModel()?.flatRows?.length<2 && checkedList1?.current?.[0]?.Item_x0020_Type != "Feature" && checkedList1?.current?.[0]?.Item_x0020_Type !="Task") && (SelectedProp?.SelectedItem != undefined && SelectedProp?.SelectedItem?.Item_x0020_Type != "Feature" && 'Parent' in SelectedProp?.SelectedItem) ?
                <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: "#fff" }} title=" Add Structure" onClick={() => OpenAddStructureModal()}>
                    {" "} Add Structure{" "}</button> :
                <button type="button" disabled className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: "#fff" }} title=" Add Structure"> {" "} Add Structure{" "}</button>
            }
            {(childRef?.current?.table?.getSelectedRowModel()?.flatRows?.length<2) && (checkedList != undefined || SelectedProp?.SelectedItem != undefined) ?
                < button type="button" className="btn btn-primary" title='Add Activity-Task' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => addActivity()}>Add Activity-Task</button> :
                <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} >Add Activity-Task</button>
            }
            {
                trueRestructuring == true ?
                    <RestructuringCom AllSitesTaskData={allTaskDataFlatLoadeViewBackup} AllMasterTasksData={AllMasterTasksData}queryItems={SelectedProp?.SelectedItem} restructureFunct={restructureFunct} ref={restructuringRef} taskTypeId={AllUsers} contextValue={SelectedProp?.AllListId} allData={data} restructureCallBack={callBackData1} restructureItem={TableProperty} />
                    : <button type="button" title="Restructure" disabled={true} className="btn btn-primary">Restructure</button>
            }

            {ActiveCompareToolButton ?
                < button type="button" className="btn btn-primary" title='Compare' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => trigerAllEventButton("Compare")}>Compare</button> :
                <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} >Compare</button>
            } </>
    )
    const customTableHeaderButtonsAllAWT = (
        <>

            {childRef?.current?.table?.getSelectedRowModel()?.flatRows?.length<2|| SelectedProp?.SelectedItem != undefined ? <button type="button" className="btn btn-primary" onClick={() => Createbutton()} >{checkedList?.TaskType?.Title == "Workstream" || SelectedProp?.SelectedItem?.TaskType?.Title == "Workstream" ? "Add Task" : "Add Workstream-Task"}</button> :
                <button type="button" className="btn btn-primary" disabled={true} >{checkedList?.TaskType?.Title == "Workstream" || SelectedProp?.SelectedItem?.TaskType?.Title == "Workstream" ? "Add Task" : "Add Workstream-Task"}</button>}
            {
                trueRestructuring == true ?
                    <RestructuringCom AllSitesTaskData={allTaskDataFlatLoadeViewBackup} AllMasterTasksData={AllMasterTasksData}queryItems={SelectedProp?.SelectedItem} restructureFunct={restructureFunct} ref={restructuringRef} taskTypeId={AllUsers} contextValue={SelectedProp?.AllListId} allData={data} restructureCallBack={callBackData1} restructureItem={TableProperty} />
                    : <button type="button" title="Restructure" disabled={true} className="btn btn-primary">Restructure</button>
            }

            {ActiveCompareToolButton ?
                < button type="button" className="btn btn-primary" title='Compare' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => trigerAllEventButton("Compare")}>Compare</button> :
                <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} >Compare</button>
            } </>





    )



    /////end////////////
    //-------------------------------------------------------------End---------------------------------------------------------------------------------


    return (
        <div id="ExandTableIds" style={{}}>
            <section className="Tabl1eContentSection row taskprofilepagegreen">
                <div className="container-fluid p-0">
                    <section className="TableSection">
                        <div className="container p-0">
                            <div className="Alltable mt-2 ">
                                <div className="col-sm-12 p-0 smart">
                                    <div>
                                        <div>
                                            <GlobalCommanTable  tableId={SelectedProp?.tableId}columnSettingIcon={true} AllSitesTaskData={allTaskDataFlatLoadeViewBackup} showFilterIcon={SelectedProp?.configration != "AllAwt"}
                                            loadFilterTask={FilterAllTask}
                                                masterTaskData={allMasterTaskDataFlatLoadeViewBackup} bulkEditIcon={true} portfolioTypeDataItemBackup={portfolioTypeDataItemBackup} taskTypeDataItemBackup={taskTypeDataItemBackup}
                                                flatViewDataAll={flatViewDataAll} setData={setData} updatedSmartFilterFlatView={updatedSmartFilterFlatView} setLoaded={setLoaded} clickFlatView={clickFlatView} switchFlatViewData={switchFlatViewData}
                                                flatView={true} switchGroupbyData={switchGroupbyData} smartTimeTotalFunction={smartTimeTotal} SmartTimeIconShow={true} AllMasterTasksData={AllMasterTasksData} ref={childRef}
                                                callChildFunction={callChildFunction} AllListId={ContextValue} columns={columns} restructureCallBack={callBackData1} data={data} callBackData={callBackData} TaskUsers={AllUsers}
                                                showHeader={true} portfolioColor={portfolioColor} portfolioTypeData={portfolioTypeDataItem} taskTypeDataItem={taskTypeDataItem} fixedWidth={true} portfolioTypeConfrigration={portfolioTypeConfrigration}
                                                showingAllPortFolioCount={true}
                                                customHeaderButtonAvailable={true} customTableHeaderButtons={SelectedProp?.configration == "AllAwt" ? customTableHeaderButtonsAllAWT : customTableHeaderButtons} />
                                          {!loaded && <PageLoader />}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
            <Panel onRenderHeader={onRenderCustomHeaderMain1} type={PanelType.custom} customWidth="600px" isOpen={OpenAddStructurePopup} isBlocking={false} onDismiss={AddStructureCallBackCall} >
                <CreateAllStructureComponent
                    Close={AddStructureCallBackCall}
                    taskUser={AllUsers}
                    portfolioTypeData={portfolioTypeData}
                    PropsValue={ContextValue}
                    SelectedItem={
                        checkedList != null && checkedList?.Id != undefined
                            ? checkedList
                            : SelectedProp?.SelectedItem
                    }
                />

            </Panel>

            {openCompareToolPopup && <CompareTool isOpen={openCompareToolPopup} compareToolCallBack={compareToolCallBack} compareData={childRef?.current?.table?.getSelectedRowModel()?.flatRows} contextValue={SelectedProp?.AllListId} />}

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
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Feedback")} className={activeTile == "Feedback" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Feedback</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Improvement")} className={activeTile == "Improvement" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Improvement</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Implementation")} className={activeTile == "Implementation" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Implementation</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Development")} className={activeTile == "Development" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Development</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Activities")} className={activeTile == "Activities" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Activity</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Task")} className={activeTile == "Task" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Task</span>
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
                        onClick={() => Createbutton()}
                        disabled={activeTile===""?true:false}
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
                    AllListId={SelectedProp?.AllListId}
                    context={SelectedProp?.AllListId?.Context}
                    TaskUsers={AllUsers}
                    AllClientCategory={AllClientCategory}
                    LoadAllSiteTasks={LoadAllSiteTasks}
                    selectedItem={
                        checkedList != null && checkedList?.Id != undefined
                            ? checkedList
                            : SelectedProp?.SelectedItem
                    }
                    portfolioTypeData={portfolioTypeData}
                />
            )}
            {isOpenWorkstream && (
                <CreateWS
                    selectedItem={
                        checkedList != null && checkedList?.Id != undefined
                            ? checkedList
                            : SelectedProp?.SelectedItem
                    }
                    Call={Call}
                    AllListId={SelectedProp?.AllListId}
                    context={SelectedProp?.AllListId?.Context}
                    TaskUsers={AllUsers}
                    data={data}>
                </CreateWS>)}
            {IsTask && (
                <EditTaskPopup
                    Items={CMSTask}
                    Call={Call}
                    AllListId={SelectedProp?.AllListId}
                    context={SelectedProp?.AllListId?.Context}
                    pageName={"TaskFooterTable"}
                ></EditTaskPopup>
            )}
            {IsComponent && (
                <EditInstitution
                    item={CMSToolComponent}
                    Calls={Call}
                    SelectD={SelectedProp?.AllListId}
                    portfolioTypeData={portfolioTypeData}
                >
                </EditInstitution>
            )}
            {IsTimeEntry && (
                <TimeEntryPopup
                    props={cmsTimeComponent}
                    CallBackTimeEntry={TimeEntryCallBack}
                    Context={SelectedProp?.AllListId?.Context}
                ></TimeEntryPopup>
            )}
          
        </div>
    );
}
export default ReadyMadeTable;



// useCase:  

//     AllListId:{} required alllist id  siteUrl,Context,MasterTaskListID,TaskUsertListID,SmartMetadataListID,PortFolioTypeID,TaskTypeID,
//    " CSFAWT"
//    " AllAwt"
//     "AllCSF"
    
//     SelectedItem:{} we have to pass the  data and give the all child data  inside that component,

//     SelectedSiteForTask:["hhhh","de"],
//     ExcludeSiteForTask:["HHH"],
//     TaskFilter:'',// like PercentComplete gt 0.89 or (PercentComplete eq 0.0 or (PercentComplete gt 0.0 and PercentComplete lt 0.89) or PercentComplete eq 0.89)
//     ComponentFilter:""// like service ,component ,event 
  

 
//    <RadimadeTable AllListId={AllListId}configration={"CSFAWT"} TaskFilter={ "PercentComplete lt '0.90'"}/>