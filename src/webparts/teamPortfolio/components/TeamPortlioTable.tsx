import * as React from "react";
import { Component } from "react";
import * as $ from "jquery";
import * as Moment from "moment";
//import '../../cssFolder/foundation.scss';
import { Modal, Panel, PanelType } from "office-ui-fabric-react";
//import "bootstrap/dist/css/bootstrap.min.css";
import {
    FaPrint,
    FaFileExcel,
    FaPaintBrush,
    FaSearch,
    FaSort,
    FaSortDown,
    FaSortUp,
    FaInfoCircle,
    FaChevronRight,
    FaChevronDown,
    FaMinus,
    FaPlus,
    FaCompressArrowsAlt,
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
//import SmartFilter from './SmartFilter';
//import '../../cssFolder/foundation.scss';
import { map } from "jquery";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import ExpndTable from "../../../globalComponents/ExpandTable/Expandtable";
import { GlobalConstants } from "../../../globalComponents/LocalCommon";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import { PortfolioStructureCreationCard } from "../../../globalComponents/tableControls/PortfolioStructureCreation";
import CreateActivity from "../../servicePortfolio/components/CreateActivity";
import CreateWS from "../../servicePortfolio/components/CreateWS";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "../../../globalComponents/Tooltip";
import * as XLSX from "xlsx";
import {
    Column, Table,
    ExpandedState, useReactTable, getCoreRowModel, getFilteredRowModel, getExpandedRowModel, ColumnDef, flexRender, getSortedRowModel, SortingState,
    ColumnFiltersState, FilterFn, getFacetedUniqueValues, getFacetedRowModel
} from "@tanstack/react-table";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import "bootstrap/dist/css/bootstrap.min.css";
import { HTMLProps } from "react";
import HighlightableCell from "../../componentPortfolio/components/highlight";
import Loader from "react-loader";
import ShowTeamMembers from "../../../globalComponents/ShowTeamMember";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";

import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import SmartFilterSearchGlobal from "../../../globalComponents/SmartFilterGolobalBomponents/SmartFilterGlobalComponents";
import { concat } from "lodash";
import saveAs from "file-saver";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
// import Excel from 'exceljs';
var filt: any = "";
var ContextValue: any = {};
let globalFilterHighlited: any;
let forceExpanded: any = [];
let activity = 0;
let workstrim = 0;
let task = 0;
let isUpdated: any = "";
let componentData: any = []; let subComponentData: any = []; let featureData: any = [];
let activityData: any = []; let workstreamData: any = []; let tasksData: any = [];
let componentDataCopyBackup: any = []
let filterCount: any = 0;
let FinalFilterData: any = [];
let portfolioColor: any = '';
// ReactTable Part/////

// ReactTable Part end/////

function TeamPortlioTable(SelectedProp: any) {
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
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [loaded, setLoaded] = React.useState(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    globalFilterHighlited = globalFilter;
    const [checkData, setcheckData] = React.useState([])
    const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
    const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
    const [siteConfig, setSiteConfig] = React.useState([]);
    const [maidataBackup, setmaidataBackup] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [AllMetadata, setMetadata] = React.useState([])
    const [AllClientCategory, setAllClientCategory] = React.useState([])
    const [IsUpdated, setIsUpdated] = React.useState("");
    const [tablecontiner, settablecontiner]: any = React.useState("hundred");
    const [checkedList, setCheckedList] = React.useState([]);
    const [AllSiteTasksData, setAllSiteTasksData] = React.useState([]);
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
    const [AllCountItems, setAllCountItems] = React.useState({
        AllComponentItems: [],
        AllSubComponentItems: [],
        AllFeaturesItems: [],
        AfterSearchComponentItems: [],
        AfterSearchSubComponentItems: [],
        AfterSearchFeaturesItems: [],
    });
    let ComponetsData: any = {};
    let Response: any = [];
    let props = undefined;
    let AllTasks: any = [];
    let CopyTaskData: any = [];
    let AllComponetsData: any = [];
    let TaskUsers: any = [];
    let TasksItem: any = [];


    //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------



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
            .getById('c21ab0e4-4984-4ef7-81b5-805efaa3752e')
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
        let PortFolioType = [];
        PortFolioType = await web.lists
            .getById('21b55c7b-5748-483a-905a-62ef663972dc')
            .items.select(
                "Id",
                "Level"
            )
            .get();
        setTaskTypeData(PortFolioType);
    };

    const GetSmartmetadata = async () => {
        let siteConfigSites: any = []
        let web = new Web(ContextValue.siteUrl);
        let smartmetaDetails: any = [];
        smartmetaDetails = await web.lists
            .getById(ContextValue.SmartMetadataListID)
            .items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
            .top(4999).expand("Parent").get();
        setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
        smartmetaDetails?.map((newtest: any) => {
            if (newtest.Title == "SDC Sites" || newtest.Title == "Tasks" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites')
                siteConfigSites.push(newtest)
        })
        if (siteConfigSites?.length > 0) {
            setSiteConfig(siteConfigSites)
        }
        setMetadata(smartmetaDetails);
    };


    const findPortFolioIconsAndPortfolio = async () => {
        try {
            let newarray: any = [];
            const ItemTypeColumn = "Item Type";
            console.log("Fetching portfolio icons...");

            // Fetching the field data
            const field = await new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP")
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
                        Item[obj + 'numberCopy'] = 0;
                        newarray.push(Item);
                    }
                })
                console.log("Portfolio icons retrieved:", newarray);
                setPortFolioTypeIcon(newarray);
            }
        } catch (error) {
            console.error("Error fetching portfolio icons:", error);
        }
    };


    const LoadAllSiteTasks = function () {
        let Response: any = [];
        let AllTasksData: any = [];
        let Counter = 0;
        if (siteConfig != undefined && siteConfig.length > 0) {
            map(siteConfig, async (config: any) => {
                let web = new Web(ContextValue.siteUrl);
                let AllTasksMatches = [];
                AllTasksMatches = await web.lists
                    .getById(config.listId)
                    .items.select("ParentTask/Title", "ParentTask/Id", "ClientTime",
                        "ItemRank", "Portfolio_x0020_Type", "SiteCompositionSettings", "SharewebTaskLevel1No", "SharewebTaskLevel2No", "TimeSpent", "BasicImageInfo", "OffshoreComments", "OffshoreImageUrl", "CompletedDate",
                        "Shareweb_x0020_ID", "Responsible_x0020_Team/Id", "Responsible_x0020_Team/Title", "ParentTask/Shareweb_x0020_ID",
                        "SharewebTaskType/Id", "SharewebTaskType/Title", "SharewebTaskType/Level", "Priority_x0020_Rank", "Team_x0020_Members/Title", "Team_x0020_Members/Name",
                        "Team_x0020_Members/Id", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "ClientCategory/Id", "ClientCategory/Title",
                        "FileLeafRef", "FeedBack", "Title", "Id", "ID", "PercentComplete", "StartDate", "DueDate", "Comments", "Categories", "Status", "Body", "Mileage",
                        "PercentComplete", "ClientCategory", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "TaskType/Id", "Portfolio/Id",
                        "Services/Id", "Events/Id", "Events/Title", "Services/Title", "Component/Id", "Component/Title", "Component/ItemType", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange",
                        // "SharewebCategories/Id", "SharewebCategories/Title",
                    )
                    .expand(
                        "ParentTask", "PortfolioType", "Portfolio", "TaskType", "SharewebTaskType", "AssignedTo", "ClientCategory", "Author", "Editor", "Team_x0020_Members", "Responsible_x0020_Team",
                        "Component",
                        "Events",
                        "Services",
                        // "SharewebCategories",
                    )
                    .filter("Status ne 'Completed'")
                    .orderBy("orderby", false)
                    .getAll(4000);

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
                        // if (item.SharewebCategories.results != undefined) {
                        //     if (item.SharewebCategories.results.length > 0) {
                        //         $.each(
                        //             item.SharewebCategories.results,
                        //             function (ind: any, value: any) {
                        //                 if (value.Title.toLowerCase() == "draft") {
                        //                     item.isDrafted = true;
                        //                 }
                        //             }
                        //         );
                        //     }
                        // }
                    });
                    AllTasks = AllTasks.concat(AllTasksMatches);
                    AllTasks = $.grep(AllTasks, function (type: any) {
                        return type.isDrafted == false;
                    });
                    if (Counter == siteConfig.length) {
                        map(AllTasks, (result: any) => {
                            result.Id = result.Id != undefined ? result.Id : result.ID;
                            result.TeamLeaderUser = [];
                            result.AllTeamName =
                                result.AllTeamName === undefined ? "" : result.AllTeamName;
                            result.chekbox = false;
                            result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");

                            if (result.DueDate == "Invalid date" || "") {
                                result.DueDate = result.DueDate.replaceAll("Invalid date", "");
                            }
                            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
                            result.chekbox = false;
                            if (result.Short_x0020_Description_x0020_On != undefined) {
                                result.Short_x0020_Description_x0020_On =
                                    result.Short_x0020_Description_x0020_On.replace(
                                        /(<([^>]+)>)/gi,
                                        ""
                                    );
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
                            if (result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team.length > 0) {
                                map(result.Responsible_x0020_Team, (Assig: any) => {
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
                                result.Team_x0020_Members != undefined &&
                                result.Team_x0020_Members.length > 0
                            ) {
                                map(result.Team_x0020_Members, (Assig: any) => {
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
                            if (result?.ClientCategory?.length > 0) {
                                result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                            } else {
                                result.ClientCategorySearch = ''
                            }
                            if (result.Id === 1441) console.log(result);
                            result["Shareweb_x0020_ID"] = globalCommon.getTaskId(result);
                            if (result["Shareweb_x0020_ID"] == undefined) {
                                result["Shareweb_x0020_ID"] = "";
                            }
                            result["Item_x0020_Type"] = "Task";
                            TasksItem.push(result);
                            AllTasksData.push(result)
                        });
                        setAllSiteTasksData(AllTasksData)
                    }
                }
            });
        }
    };
    const GetComponents = async () => {
        if (portfolioTypeData.length > 0) {
            portfolioTypeData?.map((elem: any) => {
                if (isUpdated === "") {
                    filt = "";
                } else if (isUpdated === elem.Title || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) {
                    filt = "(Portfolio_x0020_Type eq '" + elem.Title + "')"
                }
            })
        }

        // if (isUpdated === "") {
        //     filt = "(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature') and ((Portfolio_x0020_Type eq 'Service') or (Portfolio_x0020_Type eq 'Component'))";
        // }
        // if (isUpdated != undefined && isUpdated.toLowerCase().indexOf("service") > -1)
        //     filt =
        //         "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Service'))";
        // if (
        //     isUpdated != undefined &&
        //     isUpdated.toLowerCase().indexOf("event") > -1
        // )
        //     filt =
        //         "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Events'))";
        // if (
        //     isUpdated != undefined &&
        //     isUpdated.toLowerCase().indexOf("component") > -1
        // )
        //     filt =
        //         "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Component'))";
        let web = new Web(ContextValue.siteUrl);
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(ContextValue.MasterTaskListID)
            //.getByTitle('Master Tasks')
            .items//.getById(this.state.itemID)
            .select("ID", "Id", "Title", "Mileage", "TaskListId",
                "TaskListName", "WorkspaceType", "PortfolioLevel", "PortfolioStructureID", "component_x0020_link", "Package", "Comments",
                "DueDate", "Sitestagging", "Body", "Deliverables", "SiteCompositionSettings", "StartDate", "Created", "Item_x0020_Type",
                "Help_x0020_Information", "Background", "Categories", "Short_x0020_Description_x0020_On", "TechnicalExplanations", "Idea",
                "ValueAdded", "CategoryItem", "Priority_x0020_Rank", "Priority", "TaskDueDate", "PercentComplete",
                "Modified", "CompletedDate", "ItemRank", "Portfolio_x0020_Type", "ClientTime", "Parent/Id", "Parent/Title",

                "Author/Title", "Editor/Title",
                "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title",
                "Responsible_x0020_Team/Id", "Responsible_x0020_Team/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange",
                "Component/Title", "Component/ItemType", "Services/Id", "Services/Title", "Services/ItemType", "Events/Id", "Events/Title", "Events/ItemType", "AssignedTo/Id", "Component/Id",
                // 'ClientCategory/Color_x0020_Tag',//"SharewebCategories/Id", "SharewebTaskType/Title","SharewebCategories/Title",
            )
            .expand(
                "Parent", "PortfolioType", "AssignedTo", "ClientCategory", "Author", "Editor", "Team_x0020_Members", "Responsible_x0020_Team",
                "Events",
                "Services",
                "Component",
                // "SharewebTaskType",
                // "SharewebCategories"
            )
            .top(4999)
            .filter(filt)
            .get();

        console.log(componentDetails);
        componentDetails.forEach((result: any) => {
            result["siteType"] = "Master Tasks";
            result.AllTeamName = "";
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
            result["Shareweb_x0020_ID"] = result?.PortfolioStructureID;

            result.DueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
            if (result.DueDate == "Invalid date" || "") {
                result.DueDate = result?.DueDate.replaceAll("Invalid date", "");
            }
            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
            if (result?.Short_x0020_Description_x0020_On != undefined) {
                result.Short_x0020_Description_x0020_On =
                    result?.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "");
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
                result.Responsible_x0020_Team != undefined &&
                result.Responsible_x0020_Team.length > 0
            ) {
                map(result.Responsible_x0020_Team, (Assig: any) => {
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
            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                map(result.Team_x0020_Members, (Assig: any) => {
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
            portfolioTypeDataItem?.map((type: any) => {
                if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                    type[type.Title + 'number'] += 1;
                }
            })
            if (result?.ClientCategory?.length > 0) {
                result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
            } else {
                result.ClientCategorySearch = ''
            }

        });
        setAllMasterTasks(componentDetails)
        AllComponetsData = componentDetails;
        ComponetsData["allComponets"] = componentDetails;
        LoadAllSiteTasks();
    };

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let query = params.get("PortfolioType");
        if (query) {
            setIsUpdated(query);
            isUpdated = query;
        }
    }, [])

    React.useEffect(() => {
        if (portfolioTypeData.length > 0) {
            portfolioTypeData?.map((elem: any) => {
                if (elem.Title === isUpdated || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) {
                    portfolioColor = elem.Color;
                }
            })
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
        }
    }, [AllMetadata.length > 0 && portfolioTypeData.length > 0])

    React.useEffect(() => {
        if (AllSiteTasksData.length > 0 && AllMasterTasksData.length > 0) {
            setFilterCounters(true)
        }
    }, [AllSiteTasksData.length > 0 && AllMasterTasksData.length > 0])

    const smartFiltercallBackData = React.useCallback((filterData, updatedSmartFilter) => {
        setUpdatedSmartFilter(updatedSmartFilter);
        setAllSmartFilterOriginalData(filterData);
        let filterDataBackup = JSON.parse(JSON.stringify(filterData));
        setAllSmartFilterData(filterDataBackup);
    }, []);

    React.useEffect(() => {
        if (smartAllFilterData?.length > 0 && updatedSmartFilter === false) {
            setLoaded(false);
            componentData = [];
            setAllSmartFilterDataBackup(structuredClone(smartAllFilterData));
            if (IsUpdated === "") {
                portfolioTypeData?.map((port: any) => {
                    componentGrouping(port?.Id);
                })
            } else if (IsUpdated.length) {
                portfolioTypeData?.map((port: any) => {
                    componentGrouping(port?.Id);
                })
            }
        }
        if (smartAllFilterData?.length > 0 && updatedSmartFilter === true) {
            // updatedSmartFilterGrouping()
            setLoaded(false);
            filterCount = 0;
            componentDataCopyBackup = [];
            setDataBackup([]);
            let AllSmartFilterDataBackupCopy = AllSmartFilterDataBackup?.filter((elem: any) => elem.PortfolioType != undefined);
            setDataBackup(structuredClone(AllSmartFilterDataBackupCopy));
            componentDataCopyBackup = structuredClone(componentData);
            filterDataAfterUpdate();
            // portfolioTypeData?.map((port: any) => {
            //     updatedSmartFilterGrouping(port?.Id);
            // })
        }
    }, [smartAllFilterData])

    function structuredClone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    const DynamicSort = function (items: any, column: any) {

        items?.sort(function (a: any, b: any) {
            // return   a[column] - b[column];
            var aID = a[column];
            var bID = b[column];
            return aID == bID ? 0 : aID > bID ? 1 : -1;
        });

    };

    const componentGrouping = (portId: any) => {
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
            subComFeat?.forEach((subComp) => {
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
        DynamicSort(componentData, 'PortfolioLevel')
        componentData.forEach((element: any) => {
            if (element?.subRows?.length > 0) {
                let level = element?.subRows?.filter((obj: any) => obj.PortfolioLevel != undefined);
                let leveltask = element?.subRows?.filter((obj: any) => obj.PortfolioLevel === undefined);
                DynamicSort(level, 'PortfolioLevel')
                element.subRows = [];
                element.subRows = level.concat(leveltask)
            }
            if (element?.subRows != undefined) {
                element?.subRows?.forEach((obj: any) => {
                    let level1 = obj?.subRows?.filter((obj: any) => obj.PortfolioLevel != undefined);
                    let leveltask1 = obj?.subRows?.filter((obj: any) => obj.PortfolioLevel === undefined);
                    DynamicSort(level1, 'PortfolioLevel')
                    obj.subRows = [];
                    obj.subRows = level1?.concat(leveltask1)
                })
            }
        });
        setLoaded(true);
        setData(componentData);
    }

    const componentActivity = (levelType: any, items: any) => {
        if (items.ID === 5610) {
            console.log("items", items);
        }
        let findActivity = smartAllFilterData?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id);
        let findTasks = smartAllFilterData?.filter((elem1: any) => elem1?.TaskType?.Id != levelType.Id && elem1?.ParentTask?.Id === items?.Id);
        findActivity?.forEach((act: any) => {
            act.subRows = [];
            let worstreamAndTask = smartAllFilterData?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
            if (worstreamAndTask.length > 0) {
                act.subRows = act?.subRows?.concat(worstreamAndTask);
                // act.subRows.push(worstreamAndTask);
            }
            worstreamAndTask?.forEach((wrkst: any) => {
                wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
                let allTasksData = smartAllFilterData?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
                if (allTasksData.length > 0) {
                    wrkst.subRows = wrkst?.subRows?.concat(allTasksData)
                    // wrkst.subRows.push(allTasksData);
                }
            })
        })
        items.subRows = items?.subRows?.concat(findActivity)
        items.subRows = items?.subRows?.concat(findTasks)
    }

    const filterDataAfterUpdate = () => {
        smartAllFilterData?.map((filterItem: any) => {
            updatedSmartFilterGrouping(filterItem)
        })
    }
    const updatedSmartFilterGrouping = (filterItem: any) => {
        filterCount = filterCount + 1;
        let finalData: any = []
        let finalDataCopy: any = []
        componentDataCopyBackup?.map((comp: any) => {
            if (comp.Id === filterItem?.Portfolio?.Id) {
                comp.filterFlag = true
            }
            comp?.subRows?.map((subComp: any) => {
                if (subComp?.Id === filterItem?.Id && filterItem?.siteType === subComp?.siteType) {
                    comp.filterFlag = true
                    subComp.filterFlag = true
                }
                subComp?.subRows?.map((feat: any) => {
                    if (feat.Id === filterItem?.Id && filterItem?.siteType === feat?.siteType) {
                        comp.filterFlag = true
                        subComp.filterFlag = true
                        feat.filterFlag = true
                    }
                    feat?.subRows?.map((act: any) => {
                        if (act.Id === filterItem?.Id && filterItem?.siteType === act?.siteType) {
                            comp.filterFlag = true
                            subComp.filterFlag = true
                            feat.filterFlag = true
                            act.filterFlag = true
                        }
                        act?.subRows?.map((works: any) => {
                            if (works.Id === filterItem?.Id && filterItem?.siteType === works?.siteType) {
                                comp.filterFlag = true
                                subComp.filterFlag = true
                                feat.filterFlag = true
                                act.filterFlag = true
                                works.filterFlag = true
                            }
                            works?.subRows?.map((task: any) => {
                                if (task.Id === filterItem?.Id && filterItem?.siteType === task?.siteType) {
                                    comp.filterFlag = true
                                    subComp.filterFlag = true
                                    feat.filterFlag = true
                                    act.filterFlag = true
                                    works.filterFlag = true
                                    task.filterFlag = true
                                }
                            })
                        })
                    })
                })
            })
        })
        if (filterCount === smartAllFilterData.length) {
            finalData = componentDataCopyBackup.filter((elem: any) => elem.filterFlag === true)
            finalDataCopy = [...finalData];
            let finalDataCopyArray = finalDataCopy?.filter((ele: any, ind: any) => ind === finalDataCopy.findIndex((elem: any) => elem.ID === ele.ID));
            finalDataCopyArray?.map((comp: any) => {
                comp.subRows = comp?.subRows?.filter((ele: any, ind: any) => ind === comp?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                comp.subRows = comp?.subRows?.filter((sub: any) => sub.filterFlag === true)

                comp?.subRows?.map((subComp: any) => {
                    subComp.subRows = subComp?.subRows?.filter((ele: any, ind: any) => ind === subComp?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                    subComp.subRows = subComp?.subRows?.filter((subComp1: any) => subComp1.filterFlag === true)

                    subComp?.subRows?.map((feat: any) => {
                        feat.subRows = feat?.subRows?.filter((ele: any, ind: any) => ind === feat?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                        feat.subRows = feat?.subRows?.filter((feat1: any) => feat1.filterFlag === true)

                        feat?.subRows?.map((activ: any) => {
                            activ.subRows = activ?.subRows?.filter((ele: any, ind: any) => ind === activ?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                            activ.subRows = activ?.subRows?.filter((activ1: any) => activ1.filterFlag === true)

                            activ?.subRows?.map((works: any) => {
                                works.subRows = works?.subRows?.filter((ele: any, ind: any) => ind === works?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                                works.subRows = works?.subRows?.filter((works1: any) => works1.filterFlag === true)

                            })
                        })
                    })
                })
            })
            setLoaded(true);
            setData(finalDataCopyArray);
        }
    }
    // ---------------------Export to Excel-------------------------------------------------------------------------------------
    const expndpopup = (e: any) => {
        settablecontiner(e);
    };

    ///react table start function//////
    /////////////////////Table Column Start///////////////////////////////
    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                size: 35,
                id: 'Id',
                header: ({ table }: any) => (
                    <>
                        <button
                            className="border-0 bg-Ff"
                            {...{
                                onClick: table.getToggleAllRowsExpandedHandler(),
                            }}
                        >
                            {table.getIsAllRowsExpanded() ? (
                                <FaChevronDown style={{ color: `${portfolioColor}` }} />) : (<FaChevronRight style={{ color: `${portfolioColor}` }} />)}
                        </button>{" "}
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <div className="d-flex">
                        <>
                            {row.getCanExpand() ? (
                                <span
                                    className="border-0"
                                    {...{
                                        onClick: row.getToggleExpandedHandler(),
                                        style: { cursor: "pointer" },
                                    }}
                                >
                                    {row.getIsExpanded() ? <FaChevronDown style={{ color: `${row?.original?.PortfolioType?.Color}` }} /> : <FaChevronRight style={{ color: `${row?.original?.PortfolioType?.Color}` }} />}
                                </span>
                            ) : (
                                ""
                            )}{" "}
                            {getValue()}
                        </>
                    </div>
                ),
            },


            {
                header: ({ table }: any) => (
                    <>
                        <IndeterminateCheckbox className="mx-1 "
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />{" "}
                    </>
                ),
                cell: ({ row, getValue, table }) => (
                    <>
                        <span className="d-flex">
                            {row?.original?.Title != "Others" ? (
                                <IndeterminateCheckbox
                                    {...{
                                        checked: row.getIsSelected(),
                                        indeterminate: row.getIsSomeSelected(),
                                        onChange: row.getToggleSelectedHandler(),
                                    }}
                                />
                            ) : (
                                ""
                            )}{" "}
                            {row?.original?.SiteIcon != undefined ? (
                                <a className="hreflink" title="Show All Child" data-toggle="modal" >
                                    <img className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 icon-sites-img ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Activities" ? "ml-36 icon-sites-img ml20 me-1" :
                                        row?.original?.SharewebTaskType?.Title == "Workstream" ? "ml-48 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.SharewebTaskType == undefined ? "ml-60 icon-sites-img ml20 me-1" : "icon-sites-img ml20 me-1"
                                    }
                                        src={row?.original?.SiteIcon}>
                                    </img>
                                </a>
                            ) : (
                                <>
                                    {row?.original?.Title != "Others" ? (
                                        <div style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.SharewebTaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                                            row?.original?.SharewebTaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.SharewebTaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                                        }>
                                            {row?.original?.SiteIconTitle}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </>
                            )}


                            {/* ////////// Plush Icons////// */}
                            {/* <span>
                                {((row.getCanExpand() &&
                                    row.subRows?.length !== row.original.subRows?.length) ||
                                    !row.getCanExpand() ||
                                    forceExpanded.includes(row.id)) &&
                                    row.original.subRows?.length ? (
                                    <span className="mx-1"
                                        {...{
                                            onClick: () => {
                                                if (!forceExpanded.includes(row.id)) {
                                                    const coreIds = table.getCoreRowModel().rowsById;
                                                    row.subRows = coreIds[row.id].subRows;
                                                    const rowModel = table.getRowModel();
                                                    const updateRowModelRecursively = (item: any) => {
                                                        item.subRows?.forEach((elem: any) => {
                                                            if (!rowModel.rowsById[elem.id]) {
                                                                rowModel.flatRows.push(elem);
                                                                rowModel.rowsById[elem.id] = elem;
                                                            }
                                                            elem?.subRows?.length &&
                                                                updateRowModelRecursively(elem);
                                                        });
                                                    }
                                                    updateRowModelRecursively(row);
                                                    const temp = Object.keys(coreIds).filter(
                                                        (item: any) =>
                                                            item === row.id ||
                                                            item.startsWith(row.id + ".")
                                                    );
                                                    forceExpanded = [...forceExpanded, ...temp];
                                                    setExpanded((prev: any) => ({
                                                        ...prev,
                                                        [row.id]: true,
                                                    }));
                                                } else {
                                                    row.getToggleExpandedHandler()();
                                                }
                                            },
                                            style: { cursor: "pointer" },
                                        }}
                                    >
                                        {!row.getCanExpand() ||
                                            (row.getCanExpand() &&
                                                row.subRows?.length !== row.original.subRows?.length)
                                            ? <FaPlus style={{ fontSize: '10px' }} className={IsUpdated != "Service Portfolio" && IsUpdated != "Component Portfolio" ? row?.original?.dynamicColor : ''} />
                                            : row.getIsExpanded()
                                                ? <FaMinus className={IsUpdated != "Service Portfolio" && IsUpdated != "Component Portfolio" ? row?.original?.dynamicColor : ''} />
                                                : <FaPlus style={{ fontSize: '10px' }} className={IsUpdated != "Service Portfolio" && IsUpdated != "Component Portfolio" ? row?.original?.dynamicColor : ''} />}
                                    </span>
                                ) : (
                                    ""
                                )}{" "}
                            </span> */}
                            {getValue()}
                        </span>
                    </>
                ),
                accessorKey: "",
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                size: 145,
            },
            {
                accessorFn: (row) => row?.Shareweb_x0020_ID,
                cell: ({ row, getValue }) => (
                    <>
                        <ReactPopperTooltip ShareWebId={getValue()} row={row} />
                    </>
                ),
                id: "Shareweb_x0020_ID",
                placeholder: "ID",
                header: "",
                size: 130,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
                            <a data-interception="off" target="_blank" style={{ color: `${row?.original?.PortfolioType?.Color}` }} href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} />
                            </a>
                        )}
                        {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                            <a data-interception="off" target="_blank" style={{ color: `${row?.original?.PortfolioType?.Color}` }}
                                href={ContextValue.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} />
                            </a>
                        )}
                        {row?.original.Title === "Others" ? (
                            <span style={{ color: `${row?.original?.PortfolioType?.Color + '!important'}` }}>{row?.original.Title}</span>
                        ) : (
                            ""
                        )}
                        {row?.original?.Categories == 'Draft' ?
                            <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}
                        {row?.original?.subRows?.length > 0 ?
                            <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
                        {/* {<span className='ms-1'>{'(' + row?.original?.ChlidLenghtVal + ')'}</span> : ''} */}

                        {row?.original?.Short_x0020_Description_x0020_On != null && (
                            <span className="popover__wrapper ms-1" data-bs-toggle="tooltip" data-bs-placement="auto" >
                                <span
                                    title="Edit"
                                    className="svg__iconbox svg__icon--info"
                                ></span>
                                <span
                                    className="popover__content"
                                    dangerouslySetInnerHTML={{
                                        __html: row?.original?.Short_x0020_Description_x0020_On,
                                    }}
                                ></span>
                            </span>
                        )}
                    </>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
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
                size: 100,
            },
            {
                accessorFn: (row) => row?.AllTeamName,
                cell: ({ row }) => (
                    <div>
                        <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} Context={SelectedProp?.SelectedProp} />
                    </div>
                ),
                id: "AllTeamName",
                placeholder: "Team",
                resetColumnFilters: false,
                header: "",
                size: 131,
            },
            {
                accessorKey: "PercentComplete",
                placeholder: "Status",
                header: "",
                resetColumnFilters: false,
                size: 42,
                id: "PercentComplete",
            },
            {
                accessorKey: "ItemRank",
                placeholder: "Item Rank",
                header: "",
                resetColumnFilters: false,
                size: 42,
                id: "ItemRank",
            },
            {
                accessorKey: "DueDate",
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "DueDate",
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.siteType != "Master Tasks" && (
                            <a
                                // onClick={(e) => EditDataTimeEntryData(e, row.original)}
                                data-bs-toggle="tooltip"
                                data-bs-placement="auto"
                                title="Click To Edit Timesheet"
                            >
                                <span
                                    className="svg__iconbox svg__icon--clock"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Click To Edit Timesheet"
                                ></span>
                            </a>
                        )}
                        {getValue()}
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                header: "",
                size: 1,
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" &&
                            row?.original?.Title !== "Others" &&
                            row?.original?.isRestructureActive && (
                                <a
                                    href="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="auto"
                                    title="Edit"
                                >
                                    <img
                                        className="icon-sites-img"
                                        src={row?.original?.Restructuring}
                                    // onClick={(e) => OpenModal(row?.original)}
                                    />
                                </a>
                            )}
                        {getValue()}
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                header: "",
                size: 1,
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" &&
                            row?.original?.Title !== "Others" && (
                                <a
                                    href="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="auto"
                                    title="Edit"
                                >
                                    {" "}
                                    <span
                                        title="Edit"
                                        className="svg__iconbox svg__icon--edit"
                                    // onClick={(e) => EditComponentPopup(row?.original)}
                                    ></span>
                                </a>
                            )}
                        {row?.original?.siteType != "Master Tasks" &&
                            row?.original?.Title !== "Others" && (
                                <a
                                    href="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="auto"
                                    title="Edit"
                                >
                                    {" "}
                                    <span
                                        title="Edit"
                                        className="svg__iconbox svg__icon--edit"
                                    // onClick={(e) => EditItemTaskPopup(row?.original)}
                                    ></span>
                                </a>
                            )}
                        {getValue()}
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                header: "",
                size: 30,
            },
        ],
        [data]
    );

    // React.useEffect(() => {
    //     if (table.getState().columnFilters.length || table.getState()?.globalFilter?.length > 0) {
    //         const allKeys = Object.keys(table.getFilteredRowModel().rowsById).reduce(
    //             (acc: any, cur: any) => {
    //                 if (table.getFilteredRowModel().rowsById[cur].subRows?.length) {
    //                     acc[cur] = true;
    //                 }
    //                 return acc;
    //             },
    //             {}
    //         );
    //         setExpanded(allKeys);
    //     } else {
    //         setExpanded({});
    //     }
    //     forceExpanded = [];
    // }, [table.getState().columnFilters, table.getState().globalFilter]);

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

    }, []);



    return (
        <div id="ExandTableIds" style={{}}>

            <section className="ContentSection">
                <div className="col-sm-12 clearfix">
                    <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
                        {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("service") > -1 && (
                            <div style={{ color: `${portfolioColor}` }}>{IsUpdated} Portfolio</div>
                        )}
                        {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("service") > -1 && (
                            <div className="text-end fs-6">
                                <a data-interception="off" style={{ color: `${portfolioColor}` }} target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Service-Portfolio-Old.aspx"}>Old Service Portfolio</a>
                            </div>
                        )}
                        {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("event") > -1 && (
                            <div style={{ color: `${portfolioColor}` }}>{IsUpdated} Portfolio</div>
                        )}
                        {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("event") > -1 && (
                            <div className="text-end fs-6">
                                <a data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Event-Portfolio-Old.aspx"}>Old Event Portfolio</a>
                            </div>
                        )}
                        {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("component") > -1 && (
                            <div style={{ color: `${portfolioColor}` }}>{IsUpdated} Portfolio</div>
                        )}
                        {IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf("component") > -1 && (
                            <div className="text-end fs-6">
                                {(IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) && <div className='text-end fs-6'>
                                    {(ContextValue?.siteUrl?.toLowerCase().indexOf('ksl') > -1 || ContextValue?.siteUrl?.toLowerCase().indexOf('gmbh') > -1) ? (
                                        <a data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Team-Portfolio-Old.aspx"} >Old Team Portfolio</a>
                                    ) : <a data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Component-Portfolio-Old.aspx"} >Old Component Portfolio</a>
                                    } </div>}
                            </div>
                        )}
                    </h2>
                </div>
                <div className="togglecontent mt-1">
                    {filterCounters == true ? <SmartFilterSearchGlobal AllSiteTasksData={AllSiteTasksData} AllMasterTasksData={AllMasterTasksData} SelectedProp={SelectedProp.SelectedProp} ContextValue={ContextValue} smartFiltercallBackData={smartFiltercallBackData} portfolioColor={portfolioColor} /> : ''}
                </div>
            </section>

            <section className="TableContentSection taskprofilepagegreen" id={tablecontiner} >
                <div className="container-fluid">
                    <section className="TableSection">
                        <div className="container p-0">
                            <div className="Alltable mt-2">
                                <div className="col-sm-12 p-0 smart">
                                    <div className="">
                                        <div className="wrapper">
                                            <Loader loaded={loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1}
                                                color={
                                                    IsUpdated == "Events Portfolio"
                                                        ? "#f98b36"
                                                        : IsUpdated == "Service Portfolio"
                                                            ? "#228b22"
                                                            : "#000069"
                                                }
                                                speed={2}
                                                trail={60}
                                                shadow={false}
                                                hwaccel={false}
                                                className="spinner"
                                                zIndex={2e9}
                                                top="28%"
                                                left="50%"
                                                scale={1.0}
                                                loadedClassName="loadedContent"
                                            />
                                            <GlobalCommanTable AllListId={ContextValue} columns={columns} data={data} callBackData={callBackData} TaskUsers={AllUsers} showHeader={true} portfolioColor={portfolioColor} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
export default TeamPortlioTable;
