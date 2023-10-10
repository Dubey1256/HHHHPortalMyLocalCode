import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"; import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    ColumnDef,
} from "@tanstack/react-table";
import PageLoader from '../../../globalComponents/pageLoader';
import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import { Web } from "sp-pnp-js";
import { useTable, useSortBy, useFilters, useExpanded, usePagination, HeaderGroup, } from "react-table";
import { Filter, DefaultColumnFilter, } from "../../projectmanagementOverviewTool/components/filters";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';
import EditInstituton from "../../EditPopupFiles/EditComponent";
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import ShowTeamMembers from '../../../globalComponents/ShowTeamMember';
import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';

var siteConfig: any = []
var AllTaskUsers: any = []
var Idd: number;
let AllMasterTaskItems: any = [];
var allSitesTasks: any = [];
var AllListId: any = {};
var currentUserId: '';
var currentUser: any = [];
let headerOptions: any = {
    openTab: true,
    teamsIcon: true
}
var isShowTimeEntry: any = "";
var AllMetadata: any = [];
var isShowSiteCompostion: any = "";
const HalfClientCategory = (props: any) => {
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [SharewebComponent, setSharewebComponent] = React.useState("");
    const [IsComponent, setIsComponent] = React.useState(false);
    const [selectedView, setSelectedView] = React.useState("MasterTask");
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [AllSiteTasks, setAllSiteTasks]: any = React.useState([]);
    const [AllMasterTasks, setAllMasterTasks]: any = React.useState([]);
    const [passdata, setpassdata] = React.useState("");
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    React.useEffect(() => {
        try {
            $("#spPageCanvasContent").removeClass();
            $("#spPageCanvasContent").addClass("hundred");
            $("#workbenchPageContent").removeClass();
            $("#workbenchPageContent").addClass("hundred");
            isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
            isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
        } catch (error: any) {
            console.log(error)
        }
        AllListId = {
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskUsertListID: props?.props?.TaskUsertListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            //SiteTaskListID:this.props?.props?.SiteTaskListID,
            TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
            DocumentsListID: props?.props?.DocumentsListID,
            SmartInformationListID: props?.props?.SmartInformationListID,
            AdminConfigrationListID: props?.props?.AdminConfigrationListID,
            siteUrl: props?.props?.siteUrl,
            isShowTimeEntry: isShowTimeEntry,
            isShowSiteCompostion: isShowSiteCompostion
        }
        TaskUser()
        GetMetaData()

    }, [])

    const TaskUser = async () => {
        if (AllListId?.TaskUsertListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let taskUser = [];
            taskUser = await web.lists
                .getById(AllListId?.TaskUsertListID)
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
                    .get();
                if (smartmeta.length > 0) {
                    smartmeta?.map((site: any) => {
                        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.TaxType == 'Sites') {
                            siteConfig.push(site)
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
    function siteCompositionDetails(jsonStr: any) {
        var data = JSON.parse(jsonStr);
        let result = '';
        try {
            data?.map((site: any, index: any) => {
                if (site?.SiteName != undefined) {
                    if (index == 0) {
                        result = site?.SiteName + '-' + parseFloat(site?.ClienTimeDescription).toFixed(2)
                    } else {
                        result += ' ; ' + site?.SiteName + '-' + parseFloat(site?.ClienTimeDescription).toFixed(2);
                    }
                } else if (site?.Title != undefined) {
                    if (index == 0) {
                        result = site?.Title + '-' + parseFloat(site?.ClienTimeDescription).toFixed(2);
                    } else {
                        result += ' ; ' + site?.Title + '-' + parseFloat(site?.ClienTimeDescription).toFixed(2);
                    }
                }

            })

            return result;
        } catch (error) {
            console.log(error)
            return result;
        }
    }

    const LoadAllSiteTasks = function () {
        allSitesTasks = [];
        setPageLoader(true);
        if (siteConfig?.length > 0) {
            try {
                var AllTask: any = [];
                let web = new Web(AllListId?.siteUrl);
                var arraycount = 0;
                siteConfig.map(async (config: any) => {
                    let smartmeta = [];
                    smartmeta = await web.lists
                        .getById(config.listId)
                        .items
                        .select("Id,Title,PriorityRank,Project/PriorityRank,Portfolio/PortfolioStructureID,Project/Id,Project/Title,workingThisWeek,ParentTask/TaskID,ParentTask/Title,ParentTask/Id,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,SiteCompositionSettings,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title")
                        .expand('AssignedTo,Project,Author,Editor,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ParentTask,ClientCategory')
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
                            items.bodys = items.Body != null && items.Body.split('<p><br></p>').join('');
                            items.listId = config.listId;
                            items.siteUrl = config.siteUrl.Url;
                            items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
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
                            if (items?.SiteCompositionSettings != undefined) {
                                items.compositionType = siteCompositionType(items?.SiteCompositionSettings);
                            } else {
                                items.compositionType = '';
                            }
                            if (items?.ClientTime != undefined) {
                                items.siteCompositionSearch = siteCompositionDetails(items?.ClientTime);
                            } else {
                                items.siteCompositionSearch = '';
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
                                items.ClientCategorySearch = items?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                            } else {
                                items.ClientCategorySearch = ''
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
                            AllTask.push(items);
                        }
                    });
                    let setCount = siteConfig?.length
                    if (arraycount === setCount) {
                        AllTask.sort((a: any, b: any) => {
                            return b?.PriorityRank - a?.PriorityRank;
                        })
                        console.log(AllTask)
                        setAllSiteTasks(AllTask);
                        setPageLoader(false);
                        GetMasterData();
                        allSitesTasks = AllTask;
                    }

                });
            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Site Config Length less than 0')
        }
    };
    const GetMasterData = async () => {
        setPageLoader(true);
        let AllMasterTasks: any = [];
        if (AllListId?.MasterTaskListID != undefined) {
            let web = new Web(`${AllListId?.siteUrl}`);
            let taskUsers: any = [];

            AllMasterTaskItems = [];
            // var AllUsers: any = []
            AllMasterTaskItems = await web.lists.getById(AllListId?.MasterTaskListID).items
                .select("Deliverables,PortfolioStructureID,ClientCategory/Id,ClientCategory/Title,TechnicalExplanations,ValueAdded,Categories,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,SiteCompositionSettings,ClientTime,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,AdminNotes,AdminStatus,Background,Help_x0020_Information,TaskCategories/Id,TaskCategories/Title,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title")
                .filter("Item_x0020_Type ne 'Project'")
                .expand("ComponentCategory,ClientCategory,AssignedTo,AttachmentFiles,Author,Editor,TeamMembers,TaskCategories,Parent").top(4999).getAll();

            AllMasterTaskItems.map((items: any) => {
                if (items?.ClientCategory?.length > 0 || items?.SiteCompositionSettings != undefined || items?.Sitestagging != undefined) {
                    items.ShowTeamsIcon = false
                    items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                    items.siteUrl = AllListId?.siteUrl;
                    items.listId = AllListId?.MasterTaskListID;
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
                    if (items?.SiteCompositionSettings != undefined) {
                        items.compositionType = siteCompositionType(items?.SiteCompositionSettings);
                    } else {
                        items.compositionType = '';
                    }
                    if (items?.Sitestagging != undefined) {
                        items.siteCompositionSearch = siteCompositionDetails(items?.Sitestagging);
                    } else {
                        items.siteCompositionSearch = '';
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
                    items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
                    AllMasterTasks.push(items)
                }
            })
            setPageLoader(false);
            setAllMasterTasks(AllMasterTasks)
            console.log(AllMasterTasks);

        } else {
            alert('Master Task List Id Not Available')
        }

    }
    const getComponentasString = function (results: any) {
        var component = "";
        $.each(results, function (cmp: any) {
            component += cmp.Title + "; ";
        });
        return component;
    };

    const editTaskCallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
        CallBack(item)
    }, []);
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true);
        setpassdata(item);
    }, []);
    const EditComponentPopup = (item: any) => {
        item["siteUrl"] = AllListId.siteUrl;
        item["listName"] = "Master Tasks";
        setIsComponent(true);
        setSharewebComponent(item);
    };
    const EditComponentCallback = (item: any) => {

        setIsComponent(false);
    };
    const CallBack = (item: any) => {

    }

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                size: 20,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 70,
                cell: ({ row, getValue }) => (
                    <span className="d-flex">
                        <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={AllMasterTaskItems} AllSitesTaskData={allSitesTasks} />
                    </span>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <span>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </span> : ''
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

                        {row?.original?.siteType !== "Master Tasks" ? <span>
                            <a className='hreflink'
                                href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>
                            <span className="alignIcon">
                                {" "}
                                <InfoIconsToolTip
                                    Discription={row?.original?.bodys}
                                    row={row?.original}
                                />{" "}
                            </span>

                        </span> : ''}
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (

                    <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />


                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
            },
            {
                accessorFn: (row) => row?.siteCompositionSearch,
                cell: ({ row }) => (
                    <span>{row?.original?.siteCompositionSearch}</span>
                ),
                id: 'siteCompositionSearch',
                placeholder: "Site Composition",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
            },
            {
                accessorFn: (row) => row?.ClientCategorySearch,
                cell: ({ row }) => (
                    <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                ),
                id: 'ClientCategory',
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
                id: 'Type',
                placeholder: "Composition Type",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span className="d-flex">
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
                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                        )}
                    </span>
                ),
                id: 'Created',
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
                size: 105
            },
            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" ? <span title="Edit" onClick={() => { EditComponentPopup(row?.original) }} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.siteType !== "Master Tasks" ? <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
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
        [AllSiteTasks]
    );
    const columnsMaster = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                size: 20,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 70,
                cell: ({ row, getValue }) => (
                    <span className="d-flex">
                        <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={AllMasterTaskItems} AllSitesTaskData={allSitesTasks} />
                    </span>
                ),
            },

            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <span className='d-flex'>
                            <a
                                className="hreflink"
                                href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.Id}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>

                            {row?.original?.Body !== null && (
                                <span className="alignIcon">
                                    {" "}
                                    <InfoIconsToolTip
                                        Discription={row?.original?.bodys}
                                        row={row?.original}
                                    />{" "}
                                </span>
                            )}
                        </span>
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
                    <span>{row?.original?.siteCompositionSearch}</span>
                ),
                id: 'siteCompositionSearch',
                placeholder: "Site Composition",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
            },
            {
                accessorFn: (row) => row?.ClientCategorySearch,
                cell: ({ row }) => (
                    <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                ),
                id: 'ClientCategory',
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
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span className="d-flex">
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
                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                        )}
                    </span>
                ),
                id: 'Created',
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
                size: 105
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
    return (
        <div className='TaskView-Any-CC'>
            <div className='ProjectOverViewRadioFlat  d-flex justify-content-between'>
                <dl className='alignCenter gap-2 mb-0'>
                    <dt className='form-check l-radio'>
                        <input className='form-check-input' type="radio" value="grouped" name="date" checked={selectedView == 'MasterTask'} onClick={() => setSelectedView('MasterTask')} /> Portfolio View
                    </dt>
                    <dt className='form-check l-radio'>
                        <input className='form-check-input' type="radio" value="flat" name="date" checked={selectedView == 'AllSiteTasks'} onClick={() => setSelectedView('AllSiteTasks')} /> All Sites Task View
                    </dt>

                </dl>

            </div>
            <div className="Alltable p-2">
                {selectedView == 'MasterTask' ? <div>
                    <GlobalCommanTable headerOptions={headerOptions} AllListId={AllListId} columns={columnsMaster} data={AllMasterTasks} showPagination={true} callBackData={CallBack} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} />

                </div> : ''}
                {selectedView == 'AllSiteTasks' ? <div>
                    <GlobalCommanTable headerOptions={headerOptions} AllListId={AllListId} columns={columns} data={AllSiteTasks} showPagination={true} callBackData={CallBack} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} />


                </div> : ''}
            </div>
            {isOpenEditPopup ? (
                <EditTaskPopup AllListId={AllListId} context={props?.props?.Context} Items={passdata} pageName="TaskDashBoard" Call={editTaskCallBack} />
            ) : (
                ""
            )}
            {IsComponent && (
                <EditInstituton
                    item={SharewebComponent}
                    Calls={EditComponentCallback}
                    SelectD={AllListId}
                >
                    {" "}
                </EditInstituton>
            )}
            {pageLoaderActive ? <PageLoader /> : ''}
        </div>
    )
}
export default HalfClientCategory;