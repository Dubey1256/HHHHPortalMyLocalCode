import React from 'react'
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {
    ColumnDef,
} from "@tanstack/react-table";
import PageLoader from '../../../globalComponents/pageLoader';
import CentralizedSiteComposition from '../../../globalComponents/SiteCompositionComponents/CentralizedSiteComposition';
import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import EditComponentProtfolio from '../../EditPopupFiles/EditComponent';
import EditInstituton from "../../EditPopupFiles/EditComponent";
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import TeamSmartFilter from '../../../globalComponents/SmartFilterGolobalBomponents/TeamSmartFilter';
import Loader from "react-loader";
var siteConfig: any = []
var AllTaskUsers: any = []
var Idd: number;
let AllMasterTaskItems: any = [];
let ProtectedMasterTask: any = [];
var allSitesTasks: any = [];
var AllListId: any = {};
let typeData: any = [];
var currentUserId: '';
var currentUser: any = [];
let headerOptions: any = {
    openTab: true,
    teamsIcon: true
}
let siteSortOrder: any = {}
let AllCSFMasterTasks: any = [];
var isShowTimeEntry: any = "";
var AllMetadata: any = [];
let BackUpAllCCTask: any = [];
var isShowSiteCompostion: any = "";
let ProjectData: any = [];
let portfolioColor: any = "#000069";
let portfolioTypeDataItemCopy: any = [];
const HalfClientCategory = (props: any) => {
    const rerender = React.useReducer(() => ({}), {})[1]
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [protectedView, setProtectedView] = React.useState(false)
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [CMSToolComponent, setCMSToolComponent] = React.useState("");
    const [IsComponent, setIsComponent] = React.useState(false);
    const [selectedView, setSelectedView] = React.useState("MasterTask");
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [EditSiteCompositionStatus, setEditSiteCompositionStatus] = React.useState(false);
    const [EditSiteCompositionMaster, setEditSiteCompositionMaster] = React.useState(false);
    const [AllSiteTasks, setAllSiteTasks]: any = React.useState([]);
    const [AllMasterTasks, setAllMasterTasks]: any = React.useState([]);
    const [passdata, setpassdata] = React.useState("");
    const [selectedItem, setSelectedItem]: any = React.useState(null);
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [smartAllFilterData, setAllSmartFilterData] = React.useState([])
    const [smartTimeTotalFunction, setSmartTimeTotalFunction] = React.useState(null);
    const [filterCounters, setFilterCounters] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
    const [AllSiteTasksData, setAllSiteTasksData]: any = React.useState([]);
    const [taskTypeData, setTaskTypeData] = React.useState([])
    const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
    const [AllMasterTasksData, setAllMasterTasksData]: any = React.useState([]);
    const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Component', Suffix: 'C', Level: 1 }, { Title: 'SubComponent', Suffix: 'S', Level: 2 }, { Title: 'Feature', Suffix: 'F', Level: 3 }]);
    const [IsSmartfavoriteId, setIsSmartfavoriteId] = React.useState("");
    const [IsSmartfavorite, setIsSmartfavorite] = React.useState("");
    const [IsUpdated, setIsUpdated] = React.useState("");
    React.useEffect(() => {
        try {
            $("#spPageCanvasContent").removeClass();
            $("#spPageCanvasContent").addClass("sixtyHundred");
            $("#workbenchPageContent").removeClass();
            $("#workbenchPageContent").addClass("sixtyHundred");
            isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
            isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
        } catch (error: any) {
            console.log(error)
        }
        AllListId = {
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskUserListID: props?.props?.TaskUserListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            //SiteTaskListID:this.props?.props?.SiteTaskListID,
            TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
            DocumentsListID: props?.props?.DocumentsListID,
            SmartInformationListID: props?.props?.SmartInformationListID,
            AdminConfigrationListID: props?.props?.AdminConfigrationListID,
            PortFolioTypeID: props?.props?.PortFolioTypeID,
            TaskTypeID: props?.props?.TaskTypeID,
            siteUrl: props?.props?.siteUrl,
            isShowTimeEntry: isShowTimeEntry,
            isShowSiteCompostion: isShowSiteCompostion,
            Context: props?.props?.Context
        }
        TaskUser()
        GetMetaData()
        getTaskType()
    }, [])


    const TaskUser = async () => {
        if (AllListId?.TaskUserListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let taskUser = [];
            taskUser = await web.lists
                .getById(AllListId?.TaskUserListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,technicalGroup,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,UserGroup/Id,ItemType,Approver/Id,Approver/Title,Approver/Name")
                .top(5000)
                .expand("AssingedToUser,Approver, UserGroup")
                .get();
            setAllTaskUser(taskUser);
            try {
                currentUserId = props?.props?.pageContext?.legacyPageContext?.userId
                taskUser?.map((item: any) => {
                    if (currentUserId == item?.AssingedToUser?.Id) {
                        currentUser = item;
                        setCurrentUserData(item);
                    }
                })
            } catch (error) {
                console.log(error)
            }
            findPortFolioIconsAndPortfolio();
            AllTaskUsers = taskUser;
        } else {
            alert('Task User List Id not available')
        }
        // console.log("all task user =====", taskUser)
    }

    const GetMetaData = async () => {
        if (AllListId?.SmartMetadataListID != undefined) {
            try {
                let web = new Web(AllListId?.siteUrl);
                let smartmeta = [];
                let TaxonomyItems = [];

                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select("Id", "IsVisible", "ParentID", "Color_x0020_Tag", "Title", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                    .top(5000)
                    .expand("Parent")
                    .getAll();
                if (smartmeta.length > 0) {
                    smartmeta?.map((site: any) => {
                        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.TaxType == 'Sites') {
                            siteConfig.push(site)
                            siteSortOrder[site?.Title?.toLowerCase()] = site?.SortOrder;
                        }
                    })
                } else {
                    siteConfig = smartmeta;
                }
                AllMetadata = smartmeta;
                LoadAllSiteTasks();

            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Smart Metadata List Id not present')
            siteConfig = [];
        }
    };
    function itemProtected(jsonStr: any) {
        var data = JSON.parse(jsonStr);
        try {
            data = data[0];
            for (var key in data) {
                if (data?.hasOwnProperty(key) && data[key] === true && key == 'Protected') {
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    function siteCompositionType(jsonStr: any) {
        var data = JSON.parse(jsonStr);
        try {
            data = data[0];
            for (var key in data) {
                if (data?.hasOwnProperty(key) && data[key] === true) {
                    return key;
                }
            }

            return '';
        } catch (error) {
            console.log(error)
            return '';
        }
    }
    const sortAccordingSite = (data: any, key: any) => {
        return data?.sort((a: any, b: any) => {
            const orderA = siteSortOrder[a[key]?.toLowerCase()] || Infinity;
            const orderB = siteSortOrder[b[key]?.toLowerCase()] || Infinity;
            return orderA - orderB;
        });
    }
    function siteCompositionDetails(jsonStr: any): any {
        let totalPercent: number = 0;
        let result: string[] = [];
        try {
            const data = JSON.parse(jsonStr);
            if (data?.length > 0) {
                const sortedData = sortAccordingSite(data, 'Title')
                sortedData?.forEach((site: any, index: number) => {
                    if (site?.SiteName || site?.Title) {
                        let parsedValue: number = parseFloat(site?.ClienTimeDescription || '0');
                        if (!isNaN(parsedValue)) {
                            totalPercent += parsedValue;
                        }
                        let name = site?.SiteName || site?.Title || '';
                        result.push(`${name}-${parsedValue?.toFixed(2)}`);
                    }
                });
                totalPercent = parseFloat(totalPercent?.toFixed(2));
                return {
                    result: result.join(' ; '),
                    total: totalPercent
                };
            }
        } catch (error) {
            console.error(error);
            return {
                result: result.join(' ; '),
                total: totalPercent
            };
        }
    }
    const getParentTitles = (parentId: any, titles: any = []) => {
        const matchingParent = AllMetadata?.find((elem: any) => elem?.Id === parentId);
        if (matchingParent) {
            titles.unshift(matchingParent?.Title);
            if (matchingParent?.Parent != null) {
                getParentTitles(matchingParent?.Parent?.Id, titles);
            }
        }
        return titles;
    };

    const LoadAllSiteTasks = function () {
        typeData?.map((type: any) => {
            type[type.Title + 'number'] = 0;
        })
        allSitesTasks = [];
        let taskTypeCount = JSON.parse(JSON.stringify(typeData));
        setPageLoader(true);
        if (siteConfig?.length > 0) {
            try {
                BackUpAllCCTask = [];
                let web = new Web(AllListId?.siteUrl);
                var arraycount = 0;
                siteConfig.map(async (config: any) => {
                    let smartmeta = [];
                    smartmeta = await web.lists
                        .getById(config.listId)
                        .items
                        .select("ID", "Title", "ClientCategory/Id", "Portfolio/PortfolioStructureID", "Sitestagging", "TaskID", "ParentTask/TaskID", "ParentTask/Title", "ParentTask/Id", "ClientCategory/Title", "EstimatedTimeDescription", 'ClientCategory', "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "FeedBack", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Body", "PriorityRank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/Title", "Modified")
                        .expand("TeamMembers", "Approver", "ParentTask", "ClientCategory", "AssignedTo", "TaskCategories", "Author", "ResponsibleTeam", "ParentTask", "TaskType", "Portfolio")
                        .top(4999)
                        .get();
                    arraycount++;
                    smartmeta.map((items: any) => {
                        allSitesTasks.push(items)
                        if (items?.ClientCategory?.length > 0 || items?.SiteCompositionSettings != undefined) {
                            items.Item_x0020_Type = 'tasks';
                            items.ShowTeamsIcon = false
                            items.AllTeamMember = [];
                            items.siteType = config.Title;
                            items.ClientCatTitle = [];
                            items.descriptionsSearch = globalCommon.descriptionSearchData(items);
                            items.listId = config.listId;
                            items.siteUrl = config.siteUrl.Url;
                            items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                            if (items.PercentComplete != undefined && items.PercentComplete != '' && items.PercentComplete != null) {
                                items.percentCompleteValue = parseInt(items?.PercentComplete);
                            }
                            if (items?.DueDate != null && items?.DueDate != undefined) {
                                items.serverDueDate = new Date(items?.DueDate).setHours(0, 0, 0, 0)
                            }
                            if (items?.Modified != null && items?.Modified != undefined) {
                                items.serverModifiedDate = new Date(items?.Modified).setHours(0, 0, 0, 0)
                            }
                            if (items?.Created != null && items?.Created != undefined) {
                                items.serverCreatedDate = new Date(items?.Created).setHours(0, 0, 0, 0)
                            }
                            items.DisplayDueDate =
                                items.DueDate != null
                                    ? Moment(items.DueDate).format("DD/MM/YYYY")
                                    : "";
                            items.DisplayCreateDate =
                                items.Created != null
                                    ? Moment(items.Created).format("DD/MM/YYYY")
                                    : "";
                            items.portfolio = {};
                            if (items?.Portfolio?.Id != undefined) {
                                items.portfolio = items?.Portfolio;
                                items.PortfolioTitle = items?.Portfolio?.Title;
                                //  items["Portfoliotype"] = "Component";
                            }

                            items["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                            if (items?.Project?.Title != undefined) {
                                items["ProjectTitle"] = items?.Project?.Title;
                                items["ProjectPriority"] = items?.Project?.PriorityRank;
                            } else {
                                items["ProjectTitle"] = '';
                                items["ProjectPriority"] = 0;
                            }
                            items.TeamMembersSearch = "";
                            items.AssignedToIds = [];
                            if (items.AssignedTo != undefined) {
                                items?.AssignedTo?.map((taskUser: any) => {
                                    items.AssignedToIds.push(taskUser?.Id)
                                    AllTaskUsers.map((user: any) => {
                                        if (user.AssingedToUserId == taskUser.Id) {
                                            if (user?.Title != undefined) {
                                                items.TeamMembersSearch =
                                                    items.TeamMembersSearch + " " + user?.Title;
                                            }
                                        }
                                    });
                                });
                            }
                            if (items?.ClientCategory?.length > 0) {
                                items?.ClientCategory?.map((dataCat: any) => {
                                    const matchingItem = AllMetadata?.find((elem: any) => elem?.Id === dataCat?.Id);
                                    if (matchingItem) {
                                        dataCat.siteName = matchingItem?.siteName
                                        const titles = [];
                                        if (matchingItem?.Parent == null) {
                                            titles.push(matchingItem?.Title);     // No parent, push the title directly
                                        } else {
                                            const parentTitles = getParentTitles(matchingItem?.Parent?.Id);     // Has parent, get the parent titles recursively
                                            titles.push(...parentTitles, matchingItem?.Title);
                                        }
                                        if (titles?.length > 0) {
                                            dataCat.Titles = titles?.join(' > ');
                                            items.ClientCatTitle.push(dataCat.Titles)
                                        }  // Set the titles array to the dataCat
                                        dataCat.Color_x0020_Tag = matchingItem.Color_x0020_Tag;
                                    }
                                });
                                items.ClientCategory = sortAccordingSite(items.ClientCategory, 'siteName')
                            }
                            if (items?.ClientCatTitle?.length > 0) {
                                items.CCSearch = items?.ClientCatTitle?.join(' ; ');
                            } else {
                                items.CCSearch = ''
                            }
                            items.componentString =
                                items.Component != undefined &&
                                    items.Component != undefined &&
                                    items.Component.length > 0
                                    ? getComponentasString(items.Component)
                                    : "";
                            items.TaskID = globalCommon.GetTaskId(items);
                            AllTaskUsers?.map((user: any) => {
                                if (user.AssingedToUserId == items.Author.Id) {
                                    items.createdImg = user?.Item_x0020_Cover?.Url;
                                }
                                if (items.TeamMembers != undefined) {
                                    items.TeamMembers.map((taskUser: any) => {
                                        var newuserdata: any = {};
                                        if (user.AssingedToUserId == taskUser.Id) {
                                            newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                                            newuserdata["Suffix"] = user?.Suffix;
                                            newuserdata["Title"] = user?.Title;
                                            newuserdata["UserId"] = user?.AssingedToUserId;
                                            items["Usertitlename"] = user?.Title;
                                            items.AllTeamMember.push(newuserdata);
                                        }

                                    });
                                }
                            });
                            try {
                                if (items?.SiteCompositionSettings != undefined) {
                                    items.compositionType = siteCompositionType(items?.SiteCompositionSettings);
                                    items.isProtectedItem = itemProtected(items?.SiteCompositionSettings)
                                    if (items.isProtectedItem) {
                                        items.isProtectedValue = 'Protected'
                                    } else {
                                        items.isProtectedValue = ''
                                    }

                                } else {
                                    items.compositionType = '';
                                    items.isProtectedValue = '';
                                    items.isProtectedItem = false;
                                }
                                if (items?.Sitestagging != undefined) {
                                    let result = siteCompositionDetails(items?.Sitestagging);
                                    items.Sitestagging = JSON.parse(items?.Sitestagging);
                                    items.siteCompositionSearch = result?.result;
                                    items.siteCompositionTotal = result?.total;
                                    items.siteCompositionTotal = items?.siteCompositionTotal.toString();
                                } else {
                                    items.siteCompositionSearch = ' ';
                                    items.siteCompositionTotal = null;
                                }
                                taskTypeCount?.map((type: any) => {
                                    if (items?.TaskType?.Title === type?.Title) {
                                        type[type.Title + 'number'] += 1;
                                        type[type.Title + 'filterNumber'] += 1;
                                    }
                                })
                                typeData?.map((type: any) => {
                                    if (items?.TaskType?.Title === type?.Title) {
                                        type[type.Title + 'number'] += 1;
                                    }
                                })
                            } catch (error) {

                            }

                            BackUpAllCCTask.push(items);
                        }
                    });
                    let setCount = siteConfig?.length
                    if (arraycount === setCount) {
                        BackUpAllCCTask.sort((a: any, b: any) => {
                            return b?.PriorityRank - a?.PriorityRank;
                        })
                        console.log(BackUpAllCCTask)
                        setAllSiteTasks(BackUpAllCCTask);
                        setAllSiteTasksData(BackUpAllCCTask);
                        setTaskTypeDataItem(taskTypeCount)
                        setPageLoader(false);
                        GetMasterData();
                        allSitesTasks = BackUpAllCCTask;
                    }

                });
            } catch (error) {
                console.log(error)
                setPageLoader(false);
            }
        } else {
            setPageLoader(false);
            alert('Site Config Length less than 0')
        }
    };
    const GetMasterData = async () => {
        let portFoliotypeCount = JSON.parse(JSON.stringify(portfolioTypeDataItemCopy?.map((taskLevelcount: any) => {
            taskLevelcount[taskLevelcount.Title + 'number'] = 0;
            return taskLevelcount
        }
        )))
        setPageLoader(true);
        AllCSFMasterTasks = [];
        if (AllListId?.MasterTaskListID != undefined) {
            let web = new Web(`${AllListId?.siteUrl}`);
            let taskUsers: any = [];

            AllMasterTaskItems = [];
            // var AllUsers: any = []
            AllMasterTaskItems = await web.lists.getById(AllListId?.MasterTaskListID).items
                .select("Deliverables,PortfolioStructureID,ClientCategory/Id,ClientCategory/Title,TechnicalExplanations,ValueAdded,Categories,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,Body,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,AdminNotes,AdminStatus,Background,Help_x0020_Information,TaskCategories/Id,TaskCategories/Title,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,PortfolioType/Id,PortfolioType/Color,PortfolioType/IdRange,PortfolioType/Title")
                .expand("ComponentCategory,ClientCategory,AssignedTo,AttachmentFiles,Author,Editor,TeamMembers,TaskCategories,Parent,PortfolioType").top(4999).getAll();

            ProjectData = AllMasterTaskItems.filter((projectItem: any) => projectItem.Item_x0020_Type === "Project" || projectItem.Item_x0020_Type === 'Sprint');
            AllMasterTaskItems.map((items: any) => {
                if (items?.ClientCategory?.length > 0 || items?.SiteCompositionSettings != undefined || items?.Sitestagging != undefined) {
                    items.ShowTeamsIcon = false
                    items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                    if (items.PercentComplete != undefined && items.PercentComplete != '' && items.PercentComplete != null) {
                        items.percentCompleteValue = parseInt(items?.PercentComplete);
                    }
                    if (items?.DueDate != null && items?.DueDate != undefined) {
                        items.serverDueDate = new Date(items?.DueDate).setHours(0, 0, 0, 0)
                    }
                    if (items?.Modified != null && items?.Modified != undefined) {
                        items.serverModifiedDate = new Date(items?.Modified).setHours(0, 0, 0, 0)
                    }
                    if (items?.Created != null && items?.Created != undefined) {
                        items.serverCreatedDate = new Date(items?.Created).setHours(0, 0, 0, 0)
                    }
                    items.siteUrl = AllListId?.siteUrl;
                    items.listId = AllListId?.MasterTaskListID;
                    items.ClientCatTitle = [];
                    if (items?.ClientCategory?.length > 0) {
                        items?.ClientCategory?.map((dataCat: any) => {
                            const matchingItem = AllMetadata?.find((elem: any) => elem?.Id === dataCat?.Id);
                            if (matchingItem) {
                                dataCat.siteName = matchingItem?.siteName
                                const titles = [];
                                if (matchingItem?.Parent == null) {
                                    titles.push(matchingItem?.Title);     // No parent, push the title directly
                                } else {
                                    const parentTitles = getParentTitles(matchingItem?.Parent?.Id);     // Has parent, get the parent titles recursively
                                    titles.push(...parentTitles, matchingItem?.Title);
                                }
                                if (titles?.length > 0) {
                                    dataCat.Titles = titles?.join(' > ');
                                    items.ClientCatTitle.push(dataCat.Titles)
                                }  // Set the titles array to the dataCat
                                dataCat.Color_x0020_Tag = matchingItem.Color_x0020_Tag;
                            }
                        });
                        items.ClientCategory = sortAccordingSite(items.ClientCategory, 'siteName')
                    }

                    if (items?.ClientCatTitle?.length > 0) {
                        items.CCSearch = items?.ClientCatTitle?.join(' ; ');
                    } else {
                        items.CCSearch = ''
                    }
                    items.AssignedUser = []
                    items.TaskID = items?.PortfolioStructureID;
                    items.TeamMembersSearch = '';
                    if (items.AssignedTo != undefined) {
                        items.AssignedTo.map((taskUser: any) => {
                            AllTaskUsers.map((user: any) => {
                                if (user.AssingedToUserId == taskUser.Id) {
                                    if (user?.Title != undefined) {
                                        items.TeamMembersSearch = items.TeamMembersSearch + ' ' + user?.Title
                                    }
                                }
                            })
                        })
                    }
                    AllTaskUsers?.map((user: any) => {
                        if (user.AssingedToUserId == items.Author.Id) {
                            items.createdImg = user?.Item_x0020_Cover?.Url;
                        }
                    });
                    items.DisplayCreateDate =
                        items.Created != null
                            ? Moment(items.Created).format("DD/MM/YYYY")
                            : "";
                    items.siteType = 'Master Tasks';
                    items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : "";
                    try {
                        items.descriptionsSearch = globalCommon.portfolioSearchData(items)
                        if (items?.SiteCompositionSettings != undefined) {
                            items.compositionType = siteCompositionType(items?.SiteCompositionSettings);
                            items.isProtectedItem = itemProtected(items?.SiteCompositionSettings)
                            if (items.isProtectedItem) {
                                items.isProtectedValue = 'Protected'
                            } else {
                                items.isProtectedValue = ''
                            }
                        } else {
                            items.compositionType = '';
                            items.isProtectedValue = ''
                            items.isProtectedItem = false;
                        }
                        if (items?.Sitestagging != undefined) {
                            let result = siteCompositionDetails(items?.Sitestagging);
                            items.Sitestagging = JSON.parse(items?.Sitestagging)
                            items.siteCompositionSearch = result?.result;
                            items.siteCompositionTotal = result?.total;
                            items.siteCompositionTotal = items?.siteCompositionTotal.toString();
                        } else {
                            items.siteCompositionSearch = ' ';
                            items.siteCompositionTotal = null;
                        }
                        if (items?.PortfolioType?.Id != undefined && items?.TaskType === undefined) {
                            portFoliotypeCount?.map((type: any) => {
                                if (items?.Item_x0020_Type === type?.Title && items.PortfolioType != undefined) {
                                    type[type.Title + 'filterNumber'] += 1;
                                    type[type.Title + 'number'] += 1;
                                }
                            })

                        }
                    } catch (error) {
                        setPageLoader(false);
                    }
                    AllCSFMasterTasks.push(items)
                }
            })
            setPageLoader(false);
            setPortFolioTypeIcon(portFoliotypeCount);
            setAllMasterTasks(AllCSFMasterTasks)
            setAllMasterTasksData(AllCSFMasterTasks)
            //  console.log(AllCSFMasterTasks);

        } else {
            setPageLoader(false);
            alert('Master Task List Id Not Available')
        }

    };


    const getComponentasString = function (results: any) {
        var component = "";
        $.each(results, function (cmp: any) {
            component += cmp.Title + "; ";
        });
        return component;
    };

    const editTaskCallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
        TaskSiteComp(item)
    }, []);
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true);
        setpassdata(item);
    }, []);
    const EditComponentPopup = (item: any) => {
        item["siteUrl"] = AllListId.siteUrl;
        item["listName"] = "Master Tasks";
        setIsComponent(true);
        setCMSToolComponent(item);
    };
    const EditComponentCallback = (item: any) => {

        setIsComponent(false);
    };
    const TaskSiteComp = (saveType: any) => {
        if (saveType == "Save") {
            LoadAllSiteTasks();
        }
        setEditSiteCompositionStatus(false);
        setSelectedItem(null)
    }
    const MasterSiteComp = (saveType: any) => {
        if (saveType == "Save") {
            LoadAllSiteTasks();
        }
        setEditSiteCompositionMaster(false);
        setSelectedItem(null)
    }
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let smartFavoriteIdParam = params.get("SmartfavoriteId");
        if (smartFavoriteIdParam) {
            setIsSmartfavoriteId(smartFavoriteIdParam);
        }
        let smartFavoriteParam = params.get("smartfavorite");
        if (smartFavoriteParam) {
            setIsSmartfavorite(smartFavoriteParam);
        }
    }, [])
    ////////////////////////////////////////// Smart filter Part//////////////////////
    React.useEffect(() => {
        if (AllSiteTasks.length > 0 && AllMasterTasks.length > 0) {
            setFilterCounters(true);
        }
    }, [AllSiteTasks.length > 0 && AllMasterTasks.length > 0])



    const smartFiltercallBackData = React.useCallback((filterData, updatedSmartFilter, smartTimeTotal, flatView) => {
        if (filterData.length > 0 && smartTimeTotal) {
            let filterDataBackup = JSON.parse(JSON.stringify(filterData));
            setAllSmartFilterData(filterDataBackup);
            setSmartTimeTotalFunction(() => smartTimeTotal);

        } else if (filterData.length === 0) {
            setAllSiteTasks([]);
            setAllMasterTasks([]);
            setLoaded(true);
        }
    }, []);

    React.useEffect(() => {
        let taskTypeCount = JSON.parse(JSON.stringify(typeData));
        let portFoliotypeCount = JSON.parse(JSON.stringify(portfolioTypeDataItemCopy?.map((taskLevelcount: any) => {
            taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0; return taskLevelcount
        }
        )))

        if (smartAllFilterData?.length > 0) {
            let findAllProtFolioData = smartAllFilterData?.filter((elem: any) => {
                if (elem?.PortfolioType?.Id != undefined && elem?.TaskType === undefined) {
                    portFoliotypeCount?.map((type: any) => {
                        if (elem?.Item_x0020_Type === type?.Title && elem.PortfolioType != undefined) {
                            type[type.Title + 'filterNumber'] += 1;
                        }
                    })
                    return elem
                }
            });
            let findAllTaskData = smartAllFilterData?.filter((elem: any) => {
                if (elem?.PortfolioType?.Id === undefined && elem?.TaskType != undefined) {
                    taskTypeCount?.map((type: any) => {
                        if (elem?.TaskType?.Title === type?.Title) {
                            type[type.Title + 'filterNumber'] += 1;
                        }
                    })
                    return elem
                }
            });
            setTaskTypeDataItem(taskTypeCount)
            // setPortFolioTypeIcon(portFoliotypeCount)
            setAllSiteTasks(findAllTaskData);
            setAllMasterTasks(findAllProtFolioData);
            setLoaded(true);
        }
    }, [smartAllFilterData]);


    const countComponentLevel = (countTaskAWTLevel: any, afterFilter: any) => {
        if (countTaskAWTLevel?.length > 0 && afterFilter === true) {
            countTaskAWTLevel?.map((result: any) => {
                portfolioTypeDataItem?.map((type: any) => {
                    if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                        type[type.Title + 'filterNumber'] += 1;
                    }
                })
            })
        } if (countTaskAWTLevel?.length > 0 && afterFilter != true) {
            countTaskAWTLevel?.map((result: any) => {
                portfolioTypeDataItem?.map((type: any) => {
                    if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                        type[type.Title + 'number'] += 1;
                    }
                })
            })
        }
    }
    const countTaskAWTLevel = (countTaskAWTLevel: any, afterFilter: any) => {
        if (countTaskAWTLevel.length > 0 && afterFilter !== true) {
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
        }
    };

    ////////////////////////////////////////// Smart filter Part End//////////////////////

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                size: 25,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                id: "TaskID",
                resetColumnFilters: false,
                resetSorting: false,
                size: 120,
                cell: ({ row, getValue }) => (
                    <div className="d-flex hreflink">
                        <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={AllMasterTaskItems} AllSitesTaskData={allSitesTasks} AllListId={AllListId} />
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <div>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </div> : ''
                    }</>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.siteType !== "Master Tasks" ? <div className='alignCenter'>
                            <span className="columnFixedTitle">
                                <a className='hreflink text-content'
                                    title={row?.original?.Title}
                                    href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>
                            </span>


                            {row?.original?.descriptionsSearch?.length > 0 ? (
                                <InfoIconsToolTip
                                    Discription={row?.original?.bodys}
                                    row={row?.original}
                                />
                            ) : (
                                ""
                            )}

                        </div> : ''}
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 500,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (

                    <InlineEditingcolumns AllListId={AllListId} callBack={TaskSiteComp} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />


                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PercentComplete == filterValue
                },
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
            },
            {
                accessorFn: (row) => row?.siteCompositionSearch,
                cell: ({ row }) => (
                    <div className='mt--3'>
                        <span>{row?.original?.siteCompositionSearch}</span>
                        {row?.original?.Sitestagging?.length > 0 ?
                            <span title="Edit Site Composition" onClick={() => { setSelectedItem(row?.original), setEditSiteCompositionStatus(true) }} className="alignIcon ms-1 svg__iconbox svg__icon--editBox"></span>
                            : ''}
                    </div>
                ),
                id: 'siteCompositionSearch',
                placeholder: "Site Composition",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
            },
            {
                accessorFn: (row) => row?.siteCompositionTotal,
                cell: ({ row }) => (
                    <div className="">
                        <span>{row?.original?.siteCompositionTotal == 0 ? ' ' : row?.original?.siteCompositionTotal}</span>
                    </div>

                ),
                id: 'siteCompositionTotal',
                placeholder: "Composition Total",
                header: "",
                resetColumnFilters: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.siteCompositionTotal?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                resetSorting: false,
                size: 60,
            },
            {
                accessorFn: (row) => row?.CCSearch,
                cell: ({ row }) => (
                    <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                ),
                id: 'CCSearch',
                placeholder: "Client Category",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.compositionType,
                cell: ({ row }) => (
                    <span>{row?.original?.compositionType}</span>
                ),
                id: 'compositionType',
                placeholder: "Composition Type",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.isProtectedValue,
                cell: ({ row }) => (
                    <span>{row?.original?.isProtectedValue}</span>
                ),
                id: 'isProtectedValue',
                placeholder: "Protected",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <div className='alignCenter'>
                        <span>{row?.original?.DisplayCreateDate} </span>

                        {row?.original?.createdImg != undefined ? (
                            <>
                                <a
                                    href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                    target="_blank"
                                    data-interception="off"
                                >
                                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                                </a>
                            </>
                        ) : (
                            <span className=' ms-1 workmember svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                        )}
                    </div>
                ),
                id: 'DisplayCreateDate',
                canSort: false,
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 115
            },
            {

                cell: ({ row }) => (
                    <div className='alignCenter'>
                        {row?.original?.siteType === "Master Tasks" ? <span title="Edit" onClick={() => { EditComponentPopup(row?.original) }} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.siteType !== "Master Tasks" ? <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                    </div>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 35,
            }
        ],
        [AllSiteTasks]
    );
    const columnsMaster = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                size: 25,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                id: "TaskID",
                resetColumnFilters: false,
                resetSorting: false,
                size: 95,
                cell: ({ row, getValue }) => (
                    <div className='alignCenter hreflink'>
                        <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={AllMasterTaskItems} AllSitesTaskData={allSitesTasks} AllListId={AllListId} />
                    </div>
                ),
            },

            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <div className='alignCenter'>
                            <a
                                className="hreflink"
                                href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.Id}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>

                            {row?.original?.descriptionsSearch?.length > 0 ? (
                                <InfoIconsToolTip
                                    Discription={row?.original?.bodys}
                                    row={row?.original}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.siteCompositionSearch,
                cell: ({ row }) => (
                    <div className='mt--3'>
                        <span>{row?.original?.siteCompositionSearch}</span>
                        {row?.original?.Sitestagging?.length > 0 ?
                            <span title="Edit Site Composition" onClick={() => { setSelectedItem(row?.original), setEditSiteCompositionMaster(true) }} className="alignIcon ms-1 svg__iconbox svg__icon--editBox"></span>
                            : ''}
                    </div>
                ),
                id: 'siteCompositionSearch',
                placeholder: "Site Composition",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
            },
            {
                accessorFn: (row) => row?.siteCompositionTotal,
                cell: ({ row }) => (
                    <div className="">
                        <span>{row?.original?.siteCompositionTotal == 0 ? ' ' : row?.original?.siteCompositionTotal}</span>
                    </div>

                ),
                id: 'siteCompositionTotal',
                placeholder: "Composition Total",
                header: "",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.siteCompositionTotal?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                resetColumnFilters: false,
                resetSorting: false,
                size: 60,
            },
            {
                accessorFn: (row) => row?.CCSearch,
                cell: ({ row }) => (
                    <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                ),
                id: 'CCSearch',
                placeholder: "Client Category",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.Item_x0020_Type,
                cell: ({ row }) => (
                    <span>{row?.original?.Item_x0020_Type}</span>
                ),
                id: 'Item_x0020_Type',
                placeholder: "Portfolio Type",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.compositionType,
                cell: ({ row }) => (
                    <span>{row?.original?.compositionType}</span>
                ),
                id: 'compositionType',
                placeholder: "Composition Type",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.isProtectedValue,
                cell: ({ row }) => (
                    <span>{row?.original?.isProtectedValue}</span>
                ),
                id: 'isProtectedValue',
                placeholder: "Protected",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <div className='alignCenter'>
                        <span>{row?.original?.DisplayCreateDate} </span>

                        {row?.original?.createdImg != undefined ? (
                            <>
                                <a
                                    href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                    target="_blank"
                                    data-interception="off"
                                >
                                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                                </a>
                            </>
                        ) : (
                            <span className='alignIcon workmember svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                        )}
                    </div>
                ),
                id: 'DisplayCreateDate',
                canSort: false,
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 115
            },
            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" ? <span title="Edit" onClick={() => { EditComponentPopup(row?.original) }} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 35,
            }
        ],
        [AllMasterTasks]
    );

    React.useEffect(() => {
        let portFoliotypeCount = JSON.parse(JSON.stringify(portfolioTypeDataItemCopy?.map((taskLevelcount: any) => {
            taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0; return taskLevelcount
        }
        )))
        if (protectedView) {
            ProtectedMasterTask?.map((elem: any) => {
                if (elem?.Item_x0020_Type != undefined) {
                    portFoliotypeCount?.map((type: any) => {
                        if (elem?.Item_x0020_Type === type?.Title) {
                            type[type.Title + 'filterNumber'] += 1;
                            type[type.Title + 'number'] += 1;
                        }
                    })
                }
                if (elem?.subRows?.length > 0) {
                    elem?.subRows.map((child: any) => {
                        if (child?.Item_x0020_Type != undefined) {
                            portFoliotypeCount?.map((type: any) => {
                                if (child?.Item_x0020_Type === type?.Title) {
                                    type[type.Title + 'filterNumber'] += 1;
                                    type[type.Title + 'number'] += 1;
                                }
                            })
                        }
                    })
                }
            });
            setPortFolioTypeIcon(portFoliotypeCount)
           
        }
        else {
            AllMasterTaskItems?.map((elem: any) => {
                if (elem?.Item_x0020_Type != undefined) {
                    portFoliotypeCount?.map((type: any) => {
                        if (elem?.Item_x0020_Type === type?.Title) {
                            type[type.Title + 'filterNumber'] += 1;
                            type[type.Title + 'number'] += 1;
                        }
                    })
                }
                if (elem?.subRows?.length > 0) {
                    elem?.subRows.map((child: any) => {
                        if (child?.Item_x0020_Type != undefined) {
                            portFoliotypeCount?.map((type: any) => {
                                if (child?.Item_x0020_Type === type?.Title) {
                                    type[type.Title + 'filterNumber'] += 1;
                                    type[type.Title + 'number'] += 1;
                                }
                            })
                        }
                    })
                }
            });
            setPortFolioTypeIcon(portFoliotypeCount)
           
        }
    }, [protectedView])

    const filterProtectedView = (checked: any) => {

        if (!checked) {
            ProtectedMasterTask = AllCSFMasterTasks?.filter((item: any) => item?.isProtectedItem == true)
            AllCSFMasterTasks = AllMasterTasks;
            BackUpAllCCTask = AllSiteTasks;
            setAllMasterTasks(AllCSFMasterTasks?.filter((item: any) => item?.isProtectedItem == true))
            setAllSiteTasks(BackUpAllCCTask?.filter((item: any) => item?.isProtectedItem == true))
            setProtectedView(!checked)
        } else {
            setAllMasterTasks(AllCSFMasterTasks);
            setAllSiteTasks(BackUpAllCCTask);
            setProtectedView(!checked)
        }
    }
    const findPortFolioIconsAndPortfolio = async () => {
        try {
            let newarray: any = [];
            const ItemTypeColumn = "Item Type";
            console.log("Fetching portfolio icons...");
            const field = await new Web(AllListId.siteUrl)
                .lists.getById(AllListId?.MasterTaskListID)
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
                portfolioTypeDataItemCopy = portfolioTypeDataItemCopy.concat(newarray)
                setPortFolioTypeIcon(newarray);
            }
        } catch (error) {
            console.error("Error fetching portfolio icons:", error);
        }
    };
    const getTaskType = async () => {
        let web = new Web(AllListId.siteUrl);
        let taskTypeData = [];
        typeData = [];
        taskTypeData = await web.lists
            .getById(AllListId.TaskTypeID)
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
            let setTypeData = JSON.parse(JSON.stringify(typeData))
            setTaskTypeDataItem(setTypeData);
            rerender()
        }
    };
    return (
        <div className='TaskView-Any-CC'>
            <div id='ExandTableIds'>
                <section className="ContentSection smartFilterSection">
                    <div className="align-items-center d-flex justify-content-between  mt-1">
                        <h2 className="heading">
                            Client Category Verification Tool
                        </h2>
                    </div>
                    <div className="togglecontent ">
                        {filterCounters == true ? <TeamSmartFilter ProjectData={ProjectData} IsSmartfavorite={IsSmartfavorite} IsSmartfavoriteId={IsSmartfavoriteId} setLoaded={setLoaded} AllSiteTasksData={AllSiteTasksData} AllMasterTasksData={AllMasterTasksData} ContextValue={AllListId} smartFiltercallBackData={smartFiltercallBackData} portfolioColor={portfolioColor} /> : ''}
                    </div>
                </section>
                <div className='ProjectOverViewRadioFlat SpfxCheckRadio  justify-content-between mb-2'>
                    <dl className='alignCenter gap-2 mb-0'>
                        <dt>
                            <input className="radio" type="radio" value="grouped" name="date" checked={selectedView == 'MasterTask'} onClick={() => setSelectedView('MasterTask')} /> Portfolio View
                        </dt>
                        <dt>
                            <input className="radio" type="radio" value="flat" name="date" checked={selectedView == 'AllSiteTasks'} onClick={() => setSelectedView('AllSiteTasks')} /> All Sites Task View
                        </dt>
                        <dt>
                            <input className="form-check-input" type="checkbox" checked={protectedView == true} onClick={() => filterProtectedView(protectedView)} /> Protected View
                        </dt>

                    </dl>
                </div>
                <div className='Tabl1eContentSection row taskprofilepagegreen'>
                    <div className='container-fluid p-0'>
                        <section className='TableSection'>
                            <div className='container p-0'>
                                <div className="Alltable ">
                                    {selectedView == 'MasterTask' ? <div>
                                        <GlobalCommanTable headerOptions={headerOptions} AllListId={AllListId} columns={columnsMaster} data={AllMasterTasks} bulkEditIcon={true} columnSettingIcon={true} portfolioTypeData={portfolioTypeDataItem} showingAllPortFolioCount={true} showPagination={true} callBackData={TaskSiteComp} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} />

                                    </div> : ''}
                                    {selectedView == 'AllSiteTasks' ? <div>
                                        <GlobalCommanTable headerOptions={headerOptions} AllListId={AllListId} columns={columns} data={AllSiteTasks} bulkEditIcon={true} columnSettingIcon={true} showPagination={true} callBackData={TaskSiteComp} taskTypeDataItem={taskTypeDataItem} showingAllPortFolioCount={true} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} />


                                    </div> : ''}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>


            {isOpenEditPopup ? (
                <EditTaskPopup AllListId={AllListId} context={props?.props?.Context} Items={passdata} pageName="TaskDashBoard" Call={editTaskCallBack} />
            ) : (
                ""
            )}
            {IsComponent && (
                <EditInstituton
                    item={CMSToolComponent}
                    Calls={EditComponentCallback}
                    SelectD={AllListId}
                >
                    {" "}
                </EditInstituton>
            )}
            {EditSiteCompositionStatus ? <CentralizedSiteComposition ItemDetails={selectedItem} usedFor={'AWT'} RequiredListIds={AllListId} closePopupCallBack={TaskSiteComp} /> : ''}
            {EditSiteCompositionMaster ?
                <CentralizedSiteComposition ItemDetails={selectedItem} usedFor={'CSF'} closePopupCallBack={MasterSiteComp} RequiredListIds={AllListId} />
                : null
            }
            {pageLoaderActive ? <PageLoader /> : ''}
        </div>
    )
}
export default HalfClientCategory;
