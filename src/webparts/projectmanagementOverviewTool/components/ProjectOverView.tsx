import * as React from 'react';
import PageLoader from '../../../globalComponents/pageLoader';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    ColumnDef,
} from "@tanstack/react-table";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { Web } from "sp-pnp-js";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';
import AddProject from './AddProject'
import EditProjectPopup from '../../../globalComponents/EditProjectPopup';
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import ShowTeamMembers from '../../../globalComponents/ShowTeamMember';
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import RestructuringCom from '../../../globalComponents/Restructuring/RestructuringCom';
import CompareTool from "../../../globalComponents/CompareTool/CompareTool";
import WorkingActionInformation from '../../../globalComponents/WorkingActionInformation';
var siteConfig: any = []
let AllProjectDataWithAWT: any = [];
var AllTaskUsers: any = [];
let MyAllData: any = []
let typeData: any = [];
var Idd: number;
var allSitesTasks: any = [];
let AllProject: any = [];
let timeSheetConfig: any = {};
var AllListId: any = {};
var currentUserId: '';
let todaysDrafTimeEntry = [];
var currentUser: any = [];
let AllTimeEntries: any = [];
let headerOptions: any = {
    openTab: true,
    teamsIcon: true
}
let AllSitesAllTasks: any = [];
let AllLeaves: any = [];
var isShowTimeEntry: any = "";
var isShowSiteCompostion: any = "";
let renderData: any = []
let portfolioTypeDataItemCopy: any = [];
let flatProjectsData: any
export default function ProjectOverview(props: any) {
    const [TableProperty, setTableProperty] = React.useState([]);
    const [openTimeEntryPopup, setOpenTimeEntryPopup] = React.useState(false);
    const [showTimeEntryIcon, setshowTimeEntryIcon] = React.useState(true);
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [onLeaveEmployees, setOnLeaveEmployees] = React.useState([]);
    const [CheckBoxData, setCheckBoxData] = React.useState([]);
    const rerender = React.useReducer(() => ({}), {})[1]
    const refreshData = () => setData(() => renderData);
    const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
    const [showAllAWTGrouped, setShowAllAWTGrouped] = React.useState(false);
    const [checkData, setcheckData] = React.useState([])
    const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
    const [trueRestructuring, setTrueRestructuring] = React.useState(false)
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [workingTodayFiltered, setWorkingTodayFiltered] = React.useState(false);
    const [isAddStructureOpen, setIsAddStructureOpen] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [CMSToolComponent, setCMSToolComponent] = React.useState('');
    const [categoryGroup, setCategoryGroup] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [flatData, setFlatData] = React.useState([]);
    const [AllTasks, setAllTasks]: any = React.useState([]);
    const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
    const [passdata, setpassdata] = React.useState("");
    const [selectedView, setSelectedView] = React.useState("Projects");
    const [AllSiteTasks, setAllSiteTasks]: any = React.useState([]);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [taskTimeDetails, setTaskTimeDetails] = React.useState([]);
    const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
    const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Project', Suffix: 'P', Level: 1 }, { Title: 'Sprint', Suffix: 'X', Level: 2 }]);
    const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
    const [openCompareToolPopup, setOpenCompareToolPopup] = React.useState(false);
    const [ActiveCompareToolButton, setActiveCompareToolButton] = React.useState(false);
    const [workingEmailVisibility, setWorkingEmailVisibility] = React.useState(false);

    const childRef = React.useRef<any>();
    const restructuringRef = React.useRef<any>();
    React.useEffect(() => {
        try {
            $("#spPageCanvasContent").removeClass();
            $("#spPageCanvasContent").addClass("hundred");
            $("#workbenchPageContent").removeClass();
            $("#workbenchPageContent").addClass("hundred");
            isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
            isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
            if (isShowTimeEntry == false) {
                setshowTimeEntryIcon(false)
            }
            const params = new URLSearchParams(window.location.search);
            let query = params.get("SelectedView");
            if (query == 'ProjectsTask') {
                setSelectedView('Projects')
            }
            if (query == 'TodaysTask') {
                changeToggleWorkingToday()
            }
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
            siteUrl: props?.props?.siteUrl,
            isShowTimeEntry: isShowTimeEntry,
            isShowSiteCompostion: isShowSiteCompostion,
            SmalsusLeaveCalendar: props?.props?.SmalsusLeaveCalendar,
            TaskTypeID: props?.props?.TaskTypeID,
            Context: props?.props?.Context,
            context: props?.props?.Context
        }
        workingEmailPermission()
        TaskUser()
        loadTodaysLeave();
        setPageLoader(true);
        GetMetaData()
        getTaskType()
    }, [])

    const TimeEntryCallBack = React.useCallback((item1) => {
        setOpenTimeEntryPopup(false);
    }, []);
    const EditDataTimeEntry = (e: any, item: any) => {

        setTaskTimeDetails(item);
        setOpenTimeEntryPopup(true);
    };

    const Call = React.useCallback((item1) => {
        GetMasterData();
        setIsComponent(false);
        showProgressHide();
    }, []);
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    const TaskUser = async () => {
        if (AllListId?.TaskUserListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let taskUser = [];
            taskUser = await web.lists
                .getById(AllListId?.TaskUserListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,technicalGroup,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,UserGroup/Id,ItemType,Approver/Id,Approver/Title,Approver/Name")
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
            findPortFolioIconsAndPortfolio();
        } else {
            alert('Task User List Id not available')
        }
        // console.log("all task user =====", taskUser)
    }

    const editTaskCallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
        LoadAllSiteTasks();
    }, []);

    const loadAllComponent = async () => {
        MyAllData = [];
        let PropsObject: any = {
            MasterTaskListID: AllListId.MasterTaskListID,
            siteUrl: AllListId.siteUrl,
            TaskUserListId: AllListId.TaskUserListID,
        }
        let results = await globalCommon.GetServiceAndComponentAllData(PropsObject)
        if (results?.AllData?.length > 0) {
            MyAllData = results?.AllData;
        }
    }
        ;
    const GetMetaData = async () => {
        if (AllListId?.SmartMetadataListID != undefined) {
            try {
                let web = new Web(AllListId?.siteUrl);
                let smartmeta = [];
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "Configurations", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                    .top(5000)
                    .expand("Parent")
                    .get();
                if (smartmeta.length > 0) {
                    smartmeta?.map((site: any) => {
                        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.TaxType == 'Sites') {
                            siteConfig.push(site)
                        }
                        if (site?.TaxType == 'timesheetListConfigrations') {
                            timeSheetConfig = site;
                        }
                    })
                } else {
                    siteConfig = smartmeta;
                }
                await loadAllComponent()
                LoadAllSiteTasks();
            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Smart Metadata List Id not present')
            siteConfig = [];
        }
    };
    const findUserByName = (name: any) => {
        const user = AllTaskUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url;
        } else {
            Image =
                "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
        }
        return user ? Image : null;
    };

    const loadAllTimeEntry = async () => {
        if (timeSheetConfig) {
            let startDate = getStartingDate('Last Week').toISOString();
            let timesheetLists = JSON.parse(timeSheetConfig?.Configurations);
    
            if (timesheetLists?.length > 0) {
                let todayDateToCheck = new Date().setHours(0, 0, 0, 0);
    
                const fetchPromises = timesheetLists.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    try {
                        const timeEntrydata = await web.lists
                            .getById(list?.listId)
                            .items.select(list?.query)
                            .filter(`(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`)
                            .getAll();
    
                        AllTimeEntries.push(
                            ...timeEntrydata.filter((item: any) => {
                                let entryDate = new Date(item?.Modified).setHours(0, 0, 0, 0);
                                return entryDate === todayDateToCheck;
                            })
                        );
                    } catch (error) {
                        console.log(error, 'HHHH Time');
                    }
                });
    
                await Promise.all(fetchPromises);
            }
        }
    };

    function getStartingDate(startDateOf: any) {
        const startingDate = new Date();
        let formattedDate = startingDate;
        if (startDateOf == 'This Week') {
            startingDate.setDate(startingDate.getDate() - startingDate.getDay());
            formattedDate = startingDate;
        } else if (startDateOf == 'Today') {
            formattedDate = startingDate;
        } else if (startDateOf == 'Yesterday') {
            startingDate.setDate(startingDate.getDate() - 1);
            formattedDate = startingDate;
        } else if (startDateOf == 'This Month') {
            startingDate.setDate(1);
            formattedDate = startingDate;
        } else if (startDateOf == 'Last Month') {
            const lastMonth = new Date(startingDate.getFullYear(), startingDate.getMonth() - 1);
            const startingDateOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            var change = (Moment(startingDateOfLastMonth).add(30, 'days').format())
            var b = new Date(change)
            formattedDate = b;
        } else if (startDateOf == 'Last Week') {
            const lastWeek = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
            const startingDateOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 1);
            formattedDate = startingDateOfLastWeek;
        }

        return formattedDate;
    }



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
    const projectTopIcon = (items: any) => {
        if (restructuringRef.current) {
            restructuringRef.current.projectTopIcon(items);
        }
    };


    const groupedUsers = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                size: 55,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                id: 'TaskID',
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,
                cell: ({ row, getValue }) => (
                    <div>
                        <>
                            <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.TaskID} AllListId={AllListId} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} />

                        </>
                    </div>
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
                    <div className='alignCenter'>
                        {row?.original?.type == 'Category' && row?.original?.Title != undefined ? row?.original?.Title : ''}
                        {row?.original?.Item_x0020_Type == "tasks" ?
                            <span>
                                <a className='hreflink'
                                    href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>
                                {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /></span>}
                            </span> : ''}
                    </div>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 450,
            },
            {
                accessorFn: (row) => row?.ProjectTitle,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != undefined ? <span>
                            <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.Project?.Id}`} data-interception="off" target="_blank">
                                {row?.original?.ProjectTitle}
                            </a>
                        </span> : ''}
                    </>

                ),
                id: "ProjectTitle",
                placeholder: "Project Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 250,
            },
            {
                accessorFn: (row) => row?.ProjectPriority,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.ProjectPriority != 0 ? row?.original?.ProjectPriority : ''}
                    </span>
                ),
                id: 'ProjectPriority',
                placeholder: "Project Priority",
                resetColumnFilters: false,
                enableMultiSort: true,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.ProjectPriority?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.ProjectPriority.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }

                },
                isColumnDefultSortingDesc: true,
                resetSorting: false,
                header: "",
                size: 45,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>

                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.PercentComplete?.toString()?.charAt(0) == filterValue?.toString()?.charAt(0))
                        && (row?.original?.PercentComplete?.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }

                },
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />

                    </span>
                ),
                id: 'PriorityRank',
                placeholder: "Priority",
                resetColumnFilters: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.PriorityRank?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.PriorityRank.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }

                },
                isColumnDefultSortingDesc: true,
                enableMultiSort: true,
                header: "",
                size: 50,
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUsers} pageName={'ProjectOverView'} />
                        {/* <ShowTaskTeamMembers  props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers> */}
                    </span>
                ),
                id: 'TeamMembersSearch',
                placeholder: "Team",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.AssignedTo?.map((val: any) => val?.Title)?.join()?.toLowerCase()?.includes(filterValue?.toLowerCase()) ||
                        row?.original?.ResponsibleTeam?.map((val: any) => val?.Title)?.join()?.toLowerCase()?.includes(filterValue?.toLowerCase()) ||
                        row?.original?.TeamMembers?.map((val: any) => val?.Title)?.join()?.toLowerCase()?.includes(filterValue?.toLowerCase())) {
                        return true
                    } else {
                        return false
                    }

                },
                size: 85,
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
                size: 130,
                id: "workingActionTitle",
                isColumnVisible: false
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName="DueDate"
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                    />
                ),
                id: 'DisplayDueDate',
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.DisplayDueDate?.includes(filterValue)
                },
                resetSorting: false,
                size: 80,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.Item_x0020_Type === "tasks" ?
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={CallBack}
                                columnName="EstimatedTime"
                                item={row?.original}
                                TaskUsers={AllTaskUser} /> : ''
                    }</>
                ),
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.TaskTypeValue,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.TaskTypeValue}
                    </span>
                ),
                id: 'TaskTypeValue',
                placeholder: "Task Categories",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 100
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >{row?.original?.createdImg != undefined ?
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} /> :
                                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                            }

                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
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
                        {row?.original?.siteType === "Project" ? <span title={row?.original?.Item_x0020_Type != "Project" ? "Edit Sprint" : "Edit Project"} onClick={(e) => EditComponentPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <>
                            {showTimeEntryIcon &&
                                <span onClick={(e) => EditDataTimeEntry(e, row.original)}
                                    className="svg__iconbox svg__icon--clock"
                                    title="Click To Edit Timesheet"  ></span>}
                            <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span>
                        </> : ''}
                    </>
                ),
                id: 'EditPopup',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 50,
            }
        ],
        [data]
    );


    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                size: 20,
                id: 'Id',
            },
            {
                cell: ({ row }) => (
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
                id: "siteIcon",
                placeholder: "Type",
                header: "",
                resetColumnFilters: false,
                size: 95,
                isColumnVisible: true
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                id: 'TaskID',
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,
                cell: ({ row }) => (
                    <>
                    
                    <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.TaskID} AllListId={AllListId} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} />


                    </>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <div className='alignCenter'>
                        <a className='hreflink' href={row?.original?.siteType == "Project" ? `${AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.Id}` : `${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`} data-interception="off" target="_blank">{row?.original?.Title}</a>
                        {row?.original?.descriptionsSearch?.length > 0 && <InfoIconsToolTip Discription={row?.original?.Body} row={row?.original} />}
                    </div>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 530,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>
                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetSorting: false,
                resetColumnFilters: false,
                size: 45,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.PercentComplete?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.PercentComplete.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }

                },
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <div className='alignCenter'>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectManagment'} />

                    </div>
                ),
                id: "PriorityRank",
                placeholder: "Priority",
                resetColumnFilters: false,
                size: 50,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.PriorityRank?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.PriorityRank.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }

                },
                isColumnDefultSortingDesc: true,
                resetSorting: false,
                header: ""
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns
                            AllListId={AllListId}
                            callBack={CallBack}
                            columnName='Team'
                            item={row?.original}
                            TaskUsers={AllTaskUsers}
                            pageName={'ProjectManagment'}
                        />
                    </span>
                ),
                id: 'TeamMembersSearch',
                canSort: false,
                resetColumnFilters: false,
                resetSorting: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.AssignedTo?.map((val: any) => val?.Title)?.join()?.toLowerCase()?.includes(filterValue?.toLowerCase()) ||
                        row?.original?.ResponsibleTeam?.map((val: any) => val?.Title)?.join()?.toLowerCase()?.includes(filterValue?.toLowerCase()) ||
                        row?.original?.TeamMembers?.map((val: any) => val?.Title)?.join()?.toLowerCase()?.includes(filterValue?.toLowerCase())) {
                        return true
                    } else {
                        return false
                    }

                },
                placeholder: "TeamMembers",
                header: "",
                size: 85,
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
                size: 130,
                id: "workingActionTitle",
                isColumnVisible: false
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName='DueDate'
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                        pageName={'ProjectManagment'}
                    />
                ),
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Due Date",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.DisplayDueDate?.includes(filterValue)
                },
                header: "",
                size: 80,
            },
            {
                accessorFn: (row) => row?.TaskTypeValue,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.TaskTypeValue}
                    </span>
                ),
                id: 'TaskTypeValue',
                placeholder: "Task Categories",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 100
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >{row?.original?.createdImg != undefined ?
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} /> :
                                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                            }
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
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
                header: ({ table }: any) => (
                    <>{
                        topCompoIcon ?
                            <span style={{ backgroundColor: `${''}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => projectTopIcon(true)}>
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
                        {getValue()}
                    </>
                ),
                id: "Restructure",
                canSort: false,
                placeholder: "",
                size: 1,
            },
            {

                cell: ({ row }) => (
                    <div className='alignCenter ml-auto'>
                        {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <>
                            <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span>
                        </> : ''}
                    </div>
                ),
                id: 'EditPopup',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 35,
            }
        ],
        [data]
    );


    // code by Renish 

    const workingEmailPermission = async () => {
        let IsWorkingEmailButtonVisible = await globalCommon.verifyComponentPermission("PXOverviewWorkingEmail")
        setWorkingEmailVisibility(IsWorkingEmailButtonVisible)
    }

    const workingEmailRecipients = async () => {
        let EmailRecipients = await globalCommon.LoadAllNotificationConfigrations("PXOverviewWorkingEmail", AllListId)
        return EmailRecipients
    }

    const sendAllWorkingTodayTasks = async () => {
        
        let confirmation = confirm("Are you sure you want to share the working today task of all team members?")
        
        if (confirmation) {
        setPageLoader(true);
        await loadAllTimeEntry()
        let emailRecipients = await workingEmailRecipients();
        let workingTodayEmails = emailRecipients.map((recipient: any) => {return recipient?.Email });
        workingTodayEmails = workingTodayEmails.filter((user:any)=>user != undefined);

        let to: any = workingTodayEmails;

        let finalBody: any = [];
        let userApprover = '';
        let groupedData = data;
        let body: any = '';
            var subject = "Today's Working Tasks Under Projects";
            await Promise.all(groupedData?.map(async (group: any) => {
                body += projectEmailContent(group, false)
            }))

            let sendAllTasks =
                `<div style="margin-bottom: 20px;">
               
                <strong style="color:#2f5596;font-size: 32px; font-family: Segoe UI;">Working Today Tasks by Project - ${Moment(new Date()).format("DD/MM/YYYY")}</strong>
             
                <div width="100%">
                    <table align="left" style="margin: 25px 0px;">
                        <tr>
                        <td width="260px" height="40px" align="center" style="background: #2F5596; display: flex; justify-content: center; align-items: center; gap: 8px; flex-shrink: 0; border-radius: 4px; font-family: Segoe UI; width: 260px; height: 40px; font-size: 14px; font-style: normal; font-weight: 600; line-height: normal">
                            <a style="color: #fff; font-size: 14px; text-decoration: none" href ="${AllListId?.siteUrl}/SitePages/PX-Overview.aspx?SelectedView=ProjectsTask" target="_blank">
                            View Tasks in Online Dashboard
                            </a>
                        </td>
                        </tr>
                   </table>
                </div>
                <div width="100%">
                <table width="100%">
                    <tr>
                        <td> <strong style="margin-top: 20px;font-size: 16px;font-family: Segoe UI;">Project Data</strong>
                        </td>
                    </tr>
                </table>
                </div>
               
                </div>
                ${body}
                `
            setPageLoader(false);
            sendAllTasks = sendAllTasks.replace(/(?:undefined)+/g, "");
            SendEmailFinal(to, subject, sendAllTasks);
        }


    }

    const projectEmailContent = (group: any, CreateSprint: boolean) => {
        let projectLeaderTitle = '';
        let projectLeaderId: any = '';
        let body: any = '';
        if (group?.ResponsibleTeam?.lemgth > 0) {
            projectLeaderTitle = group?.ResponsibleTeam[0]?.Title
            projectLeaderId = group?.ResponsibleTeam[0]?.Id
        }
        let tasksCopy: any = [];
        let text = '';
        tasksCopy = group?.subRows
        const uniqueObjects = [];
        const idSet = new Set();
        for (const obj of tasksCopy) {
            if (!idSet.has(obj?.Id)) {
                idSet.add(obj?.Id);
                uniqueObjects.push(obj);
            }
        }
        tasksCopy = uniqueObjects;
        if (tasksCopy?.length > 0) {
            let taskCount = 0;

            tasksCopy?.map(async (item: any) => {
                try {
                    if (item?.Item_x0020_Type != 'Sprint' || CreateSprint == true) {
                        item.smartTime = 0;

                        let EstimatedDesc: any = []

                        item.showDesc = '';
                        item.EstimatedTimeEntryDesc = ''
                        item.EstimatedTimeEntry = 0
                        let siteNameOPen= item?.siteType == "Offshore Tasks" ? "Offshore%20Tasks" : item?.siteType;
                        let siteTypeCheck = item?.siteType == "Offshore Tasks" ? "OffshoreTasks" : item?.siteType;
                        try {
                            AllTimeEntries?.map((entry: any) => {
                                if (entry[`Task${siteTypeCheck}`] != undefined && entry[`Task${siteTypeCheck}`].Id == item.Id) {
                                    let AdditionalTimeEntry = JSON.parse(entry?.AdditionalTimeEntry)
                                    AdditionalTimeEntry?.map((time: any) => {
                                        item.smartTime += parseFloat(time?.TaskTime);
                                        let parts = time?.TaskDate?.split('/');
                                        let timeEntryDate: any = new Date(parts[2], parts[1] - 1, parts[0]);
                                        if (timeEntryDate?.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)){
                                            item.EstimatedTimeEntryDesc += ' ' + time?.Description
                                            item.EstimatedTimeEntry += parseFloat(time?.TaskTime);
                                        }
                                    })
                                }
                            })
                            let parser = new DOMParser();
                            let shortDesc = parser.parseFromString(item?.bodys, "text/html");
                            EstimatedDesc = JSON.parse(item?.EstimatedTimeDescription)
                            item?.bodys?.split(' ').map((des: any, index: any) => {
                                if (index <= 10) {
                                    item.showDesc += ' ' + des;
                                }
                            })
                        } catch (error) {
                            console.log(error)
                        }

                        let memberOnLeave = false;
                        item?.AssignedTo?.map((user: any) => {
                            memberOnLeave = AllLeaves.some((emp: any) => emp == user?.Id)
                        });

                        if (!memberOnLeave && item?.AssignedTo?.length > 0) {

                            let teamUsers: any = [];
                            if (item?.AssignedTo?.length > 0) {
                                item.AssignedTitle = item?.AssignedTo?.map((elem: any) => elem?.Title).join(" ")
                            } else {
                                item.AssignedTitle = ''
                            }
                            if (item.DueDate != undefined) {
                                item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
                            }
                            if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
                                item.TaskDueDatenew = '';
                            if (item.Categories == undefined || item.Categories == '')
                                item.Categories = '';

                            if (item.EstimatedTime == undefined || item.EstimatedTime == '' || item.EstimatedTime == null) {
                                item.EstimatedTime = ''
                            }
                            let estimatedDescription = ''
                            if (EstimatedDesc?.length > 0) {
                                EstimatedDesc?.map((time: any, index: any) => {
                                    if (index == 0) {
                                        estimatedDescription += time?.EstimatedTimeDescription
                                    } else {
                                        estimatedDescription += ', ' + time?.EstimatedTimeDescription
                                    }

                                })
                            }
                            if(item.EstimatedTimeEntry>0){
                                taskCount++;
                                text +=
                                    `<tr>
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;border-left: 1px solid #ccc; font-family: Segoe UI; padding: 8px;font-size: 13px;">${siteNameOPen} </td>
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc; font-family: Segoe UI; padding: 8px;font-size: 13px;"> ${item.TaskID} </td>
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc; font-family: Segoe UI; padding: 8px;font-size: 13px;"><p style="margin:0px; color:#333;"><a href =${item?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.Id}&Site=${item?.siteType}> ${item?.Title} </a></p></td>
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc; font-family: Segoe UI; padding: 8px;font-size: 13px;"> ${item.SmartPriority != undefined ? item.SmartPriority : ''} </td>

                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc; font-family: Segoe UI; padding: 8px;font-size: 13px;"> ${item.PercentComplete} </td>
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc; font-family: Segoe UI; padding: 8px;font-size: 13px;">${item.TaskDueDatenew} </td>
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;font-family: Segoe UI; padding: 8px;font-size: 13px;"> ${(item?.AssignedTo?.length > 0 ? item?.AssignedTo?.map((AssignedUser: any) => {
                                        return (
                                            '<p style="margin:0px;">' + '<a style="text-decoration: none;" href =' + AllListId.siteUrl + '/SitePages/UserTimeEntry.aspx?userId=' + AssignedUser?.Id + '><span>' + AssignedUser?.Title + '</span></a>' + '</p>'
                                        )
                                    }) : '')} </td>
                                <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;font-family: Segoe UI; padding: 8px;font-size: 13px;">${item.smartTime} </td>
    
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;font-family: Segoe UI; padding: 8px;font-size: 13px;"> ${item?.EstimatedTimeEntryDesc} </td>
                            <td align="left" valign="middle" style="border-bottom: 1px solid #ccc;border-right: 1px solid #ccc;font-family: Segoe UI; padding: 8px;font-size: 13px;"> ${item.EstimatedTimeEntry} </td>
                            </tr>`
                                    ;
                            }

                        }
                    }

                } catch (error) {
                    setPageLoader(false);
                    console.log(error)
                }
            })
            if (taskCount > 0) {
                let bgColor = group?.Item_x0020_Type == 'Sprint' ? '#eef4ff' : '#fafafa';
                let textColor = '#ffffff'
                body +=
                    `<table cellpadding="0" height="30px" cellspacing="0" style="height:30px;" border="0">
                        <tr>
                            <td colspan="8" height="30px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td width="130px" height="12" align="left" valign="middle" bgcolor=${bgColor} style="padding: 5px 8px;border:0px;  font-family: Segoe UI;height:30px;"><strong style="font-size: 16px;margin-right: 4px;">${group?.Item_x0020_Type == 'Sprint' ? 'X' : 'P'}</strong><strong style="font-size: 14px;"> Title</strong></td>
                            <td height="12" style="padding: 5px 8px; color: #2f5596; border: 0px;font-size: 14px;"><a style="margin-right:20px; font-family: Segoe UI;height:30px;" href =${AllListId.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${group?.Id}> ${group?.PortfolioStructureID} - ${group?.Title}</a></td>
                            
                            <td width="130px" height="12" align="left" valign="middle" bgcolor=${bgColor} style="padding: 5px 8px;border: 0px;  font-family: Segoe UI;font-size: 14px;height:30px;"><strong>Project Priority</strong></td>
                            <td height="12" style="padding: 5px 8px;border: 0px;"><span style="margin-right:20px; font-family: Segoe UI;font-size: 14px;height:30px;">${group?.PriorityRank}</span></td>
                            <td width="130px" align="left" valign="middle" bgcolor=${bgColor} style="padding: 5px 8px;border: 0px;  font-family: Segoe UI;font-size: 14px;height:30px;"><strong>Due Date</strong></td>
                            <td height="12" style="padding: 5px 8px;border: 0px;"> <span style="margin-right:20px; font-family: Segoe UI;font-size: 14px;height:30px;">${group?.DisplayDueDate} </span></td>
                            <td width="130px" align="left" valign="middle" bgcolor=${bgColor} style="padding: 5px 8px;border: 0px;  font-family: Segoe UI;font-size: 14px;height:30px;"><strong>Team Leader</strong></td>
                            <td height="12" style="padding: 5px 8px;border: 0px;color: #2f5596; "><a style="margin-right:20px; font-family: Segoe UI;font-size: 14px;height:30px;" href = ${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${projectLeaderId} >${projectLeaderTitle} </a></td>
                        </tr>
                        <tr>
                            <td colspan="8" height="30px">&nbsp;</td>
                        </tr>
                    </table >
                    <table cellpadding="0" cellspacing="0" align="left" width="100%" border="0">
                    <thead>
                    <tr>
                    <th width="40" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Site</th>
                    <th width="80" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;"> Task ID</th>
                    <th width="300" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Title</th>
                    <th width="40" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Priority</th>
                    <th width="40" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Status </th>
                    <th width="80" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Duedate</th>
                    <th width="120" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Team Member</th>
                    <th width="80" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Smart Time</th>
                    <th width="300" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Time Description</th>
                    <th width="100" height="12" align="left" valign="middle" bgcolor="#fafafa" style="padding:10px 8px;border-top: 1px solid #ccc;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;font-family: Segoe UI;font-size: 13px;">Estimated Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${text}
                    </tbody>
                    </table>`
            }
            tasksCopy?.map(async (item: any) => {
                try {
                    if (item?.Item_x0020_Type == 'Sprint' && item?.subRows?.length > 0) {
                        let result = projectEmailContent(item, true)
                        body += result != undefined ? result : '';
                    }

                } catch (error) {
                    setPageLoader(false);
                    console.log(error)
                }
            })
            return body != undefined ? body : ''
        }



    }

    const SendEmailFinal = async (to: any, subject: any, body: any) => {
        let sp = spfi().using(spSPFx(props?.props?.Context));
        sp.utility.sendEmail({
            //Body of Email  
            Body: body,
            //Subject of Email  
            Subject: subject,
            //Array of string for To of Email  
            To: to,
            AdditionalHeaders: {
                "content-type": "text/html",
                'Reply-To': 'abhishek.tiwari@smalsus.com'
            },
        }).then(() => {
            console.log("Email Sent!");
            setPageLoader(false);

        }).catch((err) => {
            setPageLoader(false);
            console.log(err.message);
        });



    }


    //Inline Editing Callback
    const inlineEditingCall = (item: any) => {
        // page?.map((tasks: any) => {
        //     if (tasks.Id == item.Id) {
        //         tasks = item;
        //     }
        // })
    }
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true);
        setpassdata(item);
    }, []);
    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (column.showSortIcon ? <FaSort /> : '');
    };

    const EditComponentPopup = (item: any) => {
        item['siteUrl'] = `${props?.props?.siteUrl}`;
        item['siteUrl'] = `${AllListId?.siteUrl}`;
        item['listName'] = 'Master Tasks';
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setCMSToolComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }

    const GetMasterData = async () => {
        let portFoliotypeCount = JSON.parse(JSON.stringify(portfolioTypeDataItemCopy?.map((taskLevelcount: any) => {
            taskLevelcount[taskLevelcount.Title + 'number'] = 0;
            return taskLevelcount
        }
        )))
        if (AllListId?.MasterTaskListID != undefined) {
            try {
                let web = new Web(`${AllListId?.siteUrl}`);
                let taskUsers: any = [];
                let AllProjectItems: any = [];
                // var AllUsers: any = []
                AllProjectItems = await web.lists.getById(AllListId?.MasterTaskListID).items
                    .select("Deliverables,TechnicalExplanations,ResponsibleTeam/Id,ResponsibleTeam/Title,PortfolioLevel,PortfolioStructureID,ValueAdded,Categories,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,AdminNotes,AdminStatus,Background,Help_x0020_Information,TaskCategories/Id,TaskCategories/Title,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title")
                    .expand("ComponentCategory,AssignedTo,AttachmentFiles,ResponsibleTeam,Author,Editor,TeamMembers,TaskCategories,Parent")
                    .top(4999).filter("(Item_x0020_Type eq 'Project') or (Item_x0020_Type eq 'Sprint')")
                    .getAll();

                // if(taskUsers.ItemType=="Project"){
                // taskUsers.map((item: any) => {
                //     if (item.Item_x0020_Type != null && item.Item_x0020_Type == "Project") {
                //         Alltask.push(item)
                //     }

                AllProjectItems.map((items: any) => {
                    items.descriptionsSearch = '';
                    items.ShowTeamsIcon = false
                    items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                    items.siteUrl = AllListId?.siteUrl;
                    items.listId = AllListId?.MasterTaskListID;
                    items.AssignedUser = []
                    items.siteType = "Project"
                    items.createdImg = findUserByName(items?.Author?.Id)
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
                    items.TaskTypeValue = '';
                    if (items?.TaskCategories?.length > 0) {
                        items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
                    }
                    if (items?.TaskCategories?.length > 0) {
                        items.Categories = items.TaskTypeValue;
                    }
                    items.subRows = AllProjectItems?.filter((child: any) => child?.Item_x0020_Type == "Sprint" && child?.Parent?.Id == items?.Id)
                    // items?.subRows?.map((sprint: any) => {
                    //     sprint.subRows = allSitesTasks?.filter((child: any) => child?.Project?.Id == sprint?.Id && child?.IsTodaysTask == true)
                    // })
                    items.descriptionsSearch = globalCommon.portfolioSearchData(items)
                    items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
                    items['TaskID'] = items?.PortfolioStructureID
                    items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
                    items.DisplayCreateDate = items.Created != null ? Moment(items.Created).format("DD/MM/YYYY") : "";
                })
                AllProject = AllProjectItems?.filter((item: any) => item?.Item_x0020_Type == "Project")
                AllProject.map((items: any) => {
                    if (items?.Item_x0020_Type != undefined) {
                        portFoliotypeCount?.map((type: any) => {
                            if (items?.Item_x0020_Type === type?.Title) {
                                type[type.Title + 'filterNumber'] += 1;
                                type[type.Title + 'number'] += 1;
                            }
                        })
                        items.SiteIconTitle = items?.Item_x0020_Type.charAt(0)
                    }
                    if (items?.subRows.length > 0) {
                        items?.subRows.map((child: any) => {
                            if (child?.Item_x0020_Type != undefined) {
                                portFoliotypeCount?.map((type: any) => {
                                    if (child?.Item_x0020_Type === type?.Title) {
                                        type[type.Title + 'filterNumber'] += 1;
                                        type[type.Title + 'number'] += 1;
                                    }
                                })
                            }
                            child.SiteIconTitle = child?.Item_x0020_Type == "Sprint" ? "X" : child?.Item_x0020_Type.charAt(0);
                        })
                    }
                })
                AllProject = sortOnPriority(AllProject)
                let flatDataProjects = globalCommon.deepCopy(AllProject);
                AllProjectDataWithAWT = globalCommon.deepCopy(AllProject);
                AllProjectDataWithAWT?.map((projectData: any) => {
                    let allSprints = [];
                    if (projectData?.subRows?.length > 0 && projectData?.Item_x0020_Type == "Project") {
                        allSprints = projectData?.subRows
                        allSprints?.map((Sprint: any) => {
                            let allSprintActivities: any = []
                            allSprintActivities = allSitesTasks.filter((task: any) => {
                                if (task?.TaskType?.Id == 1 && task?.Project?.Id == Sprint?.Id) {
                                    task.isTaskPushed = true;
                                    return true
                                } else {
                                    return false
                                }
                            });
                            allSprintActivities?.map((Activity: any) => {
                                Activity.subRows = allSitesTasks.filter((workstream: any) => {
                                    if (workstream?.ParentTask?.Id == Activity?.Id && workstream?.Project?.Id == Sprint?.Id && (workstream?.TaskType?.Id == 3 || workstream?.TaskType?.Id == 2)) {
                                        workstream.isTaskPushed = true;
                                        return true
                                    } else {
                                        return false
                                    }
                                });
                                Activity?.subRows?.map((workstream: any) => {
                                    if (workstream?.TaskType?.Id == 3) {
                                        workstream.subRows = allSitesTasks.filter((task: any) => {
                                            if (task?.ParentTask?.Id == workstream?.Id && task?.TaskType?.Id == 2 && task?.Project?.Id == Sprint?.Id) {
                                                task.isTaskPushed = true;
                                                return true
                                            } else {
                                                return false
                                            }
                                        });
                                    }
                                })
                            })
                            let allSprintWorkStream: any = []
                            allSprintWorkStream = allSitesTasks.filter((task: any) => {
                                if (task?.TaskType?.Id == 3 && task?.isTaskPushed !== true && task?.Project?.Id == Sprint?.Id) {
                                    task.isTaskPushed = true;
                                    return true
                                } else {
                                    return false
                                }
                            });
                            allSprintWorkStream?.map((workstream: any) => {
                                workstream.subRows = allSitesTasks.filter((task: any) => {
                                    if (task?.ParentTask?.Id == workstream?.Id && task?.TaskType?.Id == 2 && task?.isTaskPushed !== true && task?.Project?.Id == Sprint?.Id) {
                                        task.isTaskPushed = true;
                                        return true
                                    } else {
                                        return false
                                    }
                                });
                            })
                            let AllSprintTask = allSitesTasks.filter((item: any) => {
                                if (item?.isTaskPushed !== true && item?.Project?.Id == Sprint?.Id) {
                                    item.isTaskPushed = true;
                                    return true
                                } else {
                                    return false
                                }
                            });
                            allSprintActivities = allSprintActivities.concat(allSprintWorkStream);
                            allSprintActivities = allSprintActivities.concat(AllSprintTask);
                            Sprint.subRows = allSprintActivities?.length > 0 ? allSprintActivities : [];
                        })
                    }
                    let allActivities: any = []
                    allActivities = allSitesTasks.filter((task: any) => {
                        if (task?.TaskType?.Id == 1 && task?.Project?.Id == projectData?.Id) {
                            task.isTaskPushed = true;
                            return true
                        } else {
                            return false
                        }
                    });
                    allActivities?.map((Activity: any) => {
                        Activity.subRows = allSitesTasks.filter((workstream: any) => {
                            if (workstream?.ParentTask?.Id == Activity?.Id && workstream?.Project?.Id == projectData?.Id && (workstream?.TaskType?.Id == 3 || workstream?.TaskType?.Id == 2)) {
                                workstream.isTaskPushed = true;
                                return true
                            } else {
                                return false
                            }
                        });
                        Activity?.subRows?.map((workstream: any) => {
                            if (workstream?.TaskType?.Id == 3) {
                                workstream.subRows = allSitesTasks.filter((task: any) => {
                                    if (task?.ParentTask?.Id == workstream?.Id && task?.Project?.Id == projectData?.Id && task?.TaskType?.Id == 2) {
                                        task.isTaskPushed = true;
                                        return true
                                    } else {
                                        return false
                                    }
                                });
                            }
                        })
                    })
                    let allWorkStream: any = []
                    allWorkStream = allSitesTasks.filter((task: any) => {
                        if (task?.TaskType?.Id == 3 && task?.isTaskPushed !== true && task?.Project?.Id == projectData?.Id) {
                            task.isTaskPushed = true;
                            return true
                        } else {
                            return false
                        }
                    });
                    allWorkStream?.map((workstream: any) => {
                        workstream.subRows = allSitesTasks.filter((task: any) => {
                            if (task?.ParentTask?.Id == workstream?.Id && task?.TaskType?.Id == 2 && task?.Project?.Id == projectData?.Id && task?.isTaskPushed !== true) {
                                task.isTaskPushed = true;
                                return true
                            } else {
                                return false
                            }
                        });
                    })
                    allSprints = allSprints.concat(allActivities);
                    allSprints = allSprints.concat(allWorkStream);
                    let remainingTasks = allSitesTasks.filter((item: any) => item?.isTaskPushed !== true && item?.Project?.Id == projectData?.Id);
                    allSprints = allSprints.concat(remainingTasks);
                    projectData.subRows = allSprints
                })
                setFlatData(AllProject);
                flatDataProjects.map((items: any) => {
                    allSitesTasks?.map((task: any) => {
                        if (task?.IsTodaysTask == true && task?.Project?.Id == items?.Id) {
                            items['subRows'].push(task);
                        }
                    })
                    items.subRows = items?.subRows?.filter((sprint: any) => {
                        sprint.subRows = allSitesTasks?.filter((child: any) => {
                            if (child?.Project?.Id == sprint?.Id && child?.IsTodaysTask == true) {
                                return true;
                            }
                        })
                        if (sprint?.Item_x0020_Type == 'Sprint' && sprint?.subRows?.length > 0) {
                            return true;
                        } else if (sprint?.Item_x0020_Type != 'Sprint') {
                            return true;
                        }
                    })
                    // items.subRows =  items?.subRows?.filter((sprint: any) => {
                    //     if(sprint?.Item_x0020_Type=='Sprint' && sprint?.subRows?.lenght > 0 ){
                    //         return true
                    //     }else if(sprint?.Item_x0020_Type!='Sprint'){return true }
                    // })
                })

                // })
                flatDataProjects = flatDataProjects?.filter((Project: any) => Project?.subRows?.length > 0)
                flatProjectsData = flatDataProjects
                setAllTasks(flatDataProjects);
                setPortFolioTypeIcon(portFoliotypeCount);
                setPageLoader(false);
                setData(flatDataProjects);
            } catch (e) {

            }
        } else {
            alert('Master Task List Id Not Available')
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
    //    Save data in master task list
    const [title, settitle] = React.useState('')
    const tableStyle = {
        display: "block",
        height: "600px",
        overflow: "auto"
    };
    //Just Check 
    // AssignedUser: '',

    // const page = React.useMemo(() => data, [data]);
    const [ShowingAllData, setShowingData] = React.useState([])

    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        try {
            if (elem != undefined) {
                let selectedItem: any = []
                elem?.map((Project: any) => {
                    selectedItem?.push(Project?.original)
                    //  Project = Project?.original
                })
                setCheckBoxData(selectedItem)
                setTableProperty(childRef.current.table.getSelectedRowModel().flatRows)
                if (childRef.current.table.getSelectedRowModel().flatRows.length > 0) {
                    setTrueRestructuring(true)
                }
            } else {
                setCheckBoxData([])
                if (childRef.current.table.getSelectedRowModel().flatRows.length == 0) {
                    setTrueRestructuring(false)
                }

            }
            if (ShowingData != undefined) {
                setShowingData([ShowingData])
            }
        } catch (e) {

        }
    }, []);

    React.useEffect(() => {
        if (CheckBoxData.length > 0) {
            setcheckData(TableProperty)
            setShowTeamMemberOnCheck(true)
        } else {
            setcheckData([])
            setShowTeamMemberOnCheck(false)
        }
    }, [CheckBoxData])

    React.useEffect(() => {
        let portFoliotypeCount = JSON.parse(JSON.stringify(portfolioTypeDataItemCopy?.map((taskLevelcount: any) => {
            taskLevelcount[taskLevelcount.Title + 'filterNumber'] = 0; return taskLevelcount
        }
        )))
        if (workingTodayFiltered) {
            flatProjectsData?.map((elem: any) => {
                if (elem?.Item_x0020_Type != undefined) {
                    portFoliotypeCount?.map((type: any) => {
                        if (elem?.Item_x0020_Type === type?.Title) {
                            type[type.Title + 'filterNumber'] += 1;
                            type[type.Title + 'number'] += 1;
                        }
                    })
                }
                if (elem?.subRows.length > 0) {
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
            setData(flatProjectsData);
        }
        else {
            AllProject?.map((elem: any) => {
                if (elem?.Item_x0020_Type != undefined) {
                    portFoliotypeCount?.map((type: any) => {
                        if (elem?.Item_x0020_Type === type?.Title) {
                            type[type.Title + 'filterNumber'] += 1;
                            type[type.Title + 'number'] += 1;
                        }
                    })
                }
                if (elem?.subRows.length > 0) {
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
            setFlatData(AllProject)
        }
    }, [workingTodayFiltered])



    const showTaskTeamCAllBack = React.useCallback(() => {
        setShowTeamPopup(false)

    }, []);

    const restructureCallback = React.useCallback((getData: any, topCompoIcon: any, callback: any) => {
        setTopCompoIcon(topCompoIcon);
        renderData = [];
        renderData = renderData.concat(getData)
        refreshData()
        // if (callback == true) {
        //     GetMasterData();
        // }

    }, []);

    const CallBack = React.useCallback((item: any, type: any) => {
        setIsAddStructureOpen(false)
        if (type == 'Save') {
            GetMasterData()
        }
    }, [])


    const LoadAllSiteTasks = async () => {
        typeData?.map((type: any) => {
            type[type.Title + 'number'] = 0;
        })
        let taskTypeCount = JSON.parse(JSON.stringify(typeData));
        if (siteConfig?.length > 0) {
            try {
                var AllTask: any = [];
                let smartmeta: any = [];
                let filter = 'ProjectId ne null'
                smartmeta = await globalCommon?.loadAllSiteTasks(AllListId, filter)
                smartmeta.map((items: any) => {
                    let EstimatedDesc = globalCommon.parseJSON(items?.EstimatedTimeDescription)
                    items.Item_x0020_Type = 'tasks';
                    items.ShowTeamsIcon = false
                    items.descriptionsSearch = '';
                    items.AllTeamMember = [];
                    items.SmartPriority;
                    items.SmartPriority = globalCommon.calculateSmartPriority(items);
                    items.EstimatedTime = 0
                    let estimatedDescription = ''
                    if (EstimatedDesc?.length > 0) {
                        EstimatedDesc?.map((time: any) => {
                            items.EstimatedTime += Number(time?.EstimatedTime)
                            estimatedDescription += ', ' + time?.EstimatedTimeDescription
                        })
                    }
                    if (items?.FeedBack != undefined) {

                        items.descriptionsSearch = globalCommon?.descriptionSearchData(items)
                    }
                    items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
                    // items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
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

                    if (items?.Project?.Title != undefined) {
                        items["ProjectTitle"] = items?.Project?.Title;
                        items["ProjectPriority"] = items?.Project?.PriorityRank;
                    } else {
                        items["ProjectTitle"] = '';
                        items["ProjectPriority"] = 0;
                    }
                    items.TaskTypeValue = ''
                    if (items?.TaskCategories?.length > 0) {
                        items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
                    }
                    if (items?.TaskCategories?.length > 0) {
                        items.Categories = items.TaskTypeValue;
                    }
                    items.TeamMembersSearch = "";
                    if(items?.AssignedToIds?.length>0){

                    }else{
                        items.AssignedToIds = [];
                    }
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
                    try {
                        if (items?.WorkingAction != null) {
                            items.workingActionValue = [];
                            items.workingActionValue = JSON.parse(items?.WorkingAction);
                            items.workingActionTitle = ""; items.workingActionIcon = {};
                            items?.workingActionValue?.forEach((elem: any) => {
                                if (elem.Title === "Bottleneck" || elem.Title === "Attention" || elem.Title === "Phone" || elem.Title === "Approval") {
                                    items.workingActionTitle = items.workingActionTitle ? items.workingActionTitle + " " + elem.Title : elem.Title;
                                }
                            });
                        }

                    } catch (error) {
                        console.error("An error occurred:", error);
                    }

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
                });

                let workingTodayTasks = smartmeta.filter((itms: any) => {
                    return itms.IsTodaysTask
                })

                if (workingTodayTasks && taskTypeCount && typeData) {
                    workingTodayTasks.forEach((tday: any) => {
                        taskTypeCount.forEach((countType: any) => {
                            if (tday?.TaskType?.Title === countType?.Title) {
                                countType[countType.Title + 'number'] = (countType[countType.Title + 'number'] || 0) + 1;
                                countType[countType.Title + 'filterNumber'] = (countType[countType.Title + 'filterNumber'] || 0) + 1;
                            }
                        });

                        typeData.forEach((dataType: any) => {
                            if (tday?.TaskType?.Title === dataType?.Title) {
                                dataType[dataType.Title + 'number'] = (dataType[dataType.Title + 'number'] || 0) + 1;
                            }
                        });
                    });
                }

                AllTask.sort((a: any, b: any) => {
                    return b?.PriorityRank - a?.PriorityRank;
                })
                AllTask.sort((a: any, b: any) => {
                    return b?.ProjectPriority - a?.ProjectPriority;
                })
                setAllSiteTasks(AllTask);
                const categorizedUsers: any = [];

                // Iterate over the users
                let filterTaskUser = AllListId.siteUrl.includes("GrueneWeltweit") ? (AllTaskUsers.filter((item: any) => item.technicalGroup !== "SPFx Team")) : AllTaskUsers
                for (const user of filterTaskUser) {
                    const category = user?.technicalGroup;
                    let categoryObject = categorizedUsers?.find((obj: any) => obj?.Title === category);
                    // If the category doesn't exist, create a new category object
                    if (!categoryObject) {
                        categoryObject = { Title: category, users: [], subRows: [], type: 'Category' };
                        categorizedUsers.push(categoryObject);
                    }
                    // const userTasks = AllTask?.filter((task:any) => 
                    // if(){
                    //     task?.AssignedTo?.filter((assigned:any)=>assigned?.Id=== user?.AssingedToUserId)
                    // });
                    const userTasks = AllTask?.filter((task: any) => task?.AssignedToIds?.includes(user?.AssingedToUserId) && task?.IsTodaysTask == true);
                    categoryObject.users.push({ user, tasks: userTasks });
                }
                console.log(categorizedUsers);
                for (const category of categorizedUsers) {
                    category?.users?.map((teamMember: any) => {
                        category.subRows = [...category?.subRows, ...teamMember?.tasks]
                    })
                }

                setCategoryGroup(categorizedUsers?.filter((item: any) => item?.Title != undefined))
                console.log(categorizedUsers);
                allSitesTasks = AllTask;
                GetMasterData();
                setTaskTypeDataItem(taskTypeCount)

            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Site Config Length less than 0')
        }
    };
    const sortOnPriority = (Array: any) => {
        return Array.sort((a: any, b: any) => {
            return b?.PriorityRank - a?.PriorityRank;
        })
    }
    // People on Leave Today //
    const loadTodaysLeave = async () => {
        if (AllListId?.SmalsusLeaveCalendar?.length > 0) {
            let startDate: any = new Date();
            startDate = startDate.setHours(0, 0, 0, 0);
            const web = new Web(AllListId?.siteUrl);
            const results = await web.lists
                .getById(AllListId?.SmalsusLeaveCalendar)
                .items.select(
                    "RecurrenceData,Duration,Author/Title,Editor/Title,Name,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type"
                )
                .expand("Author,Editor,Employee")
                .top(5000)
                .getAll();
            let peopleOnLeave: any = [];
            results?.map((emp: any) => {
                emp.leaveStart = new Date(emp.EventDate).setHours(0, 0, 0, 0);
                emp.leaveEnd = new Date(emp.EndDate).setHours(0, 0, 0, 0);
                if (startDate >= emp.leaveStart && startDate <= emp.leaveEnd) {
                    peopleOnLeave.push(emp?.Employee?.Id);
                }
            })
            AllLeaves = peopleOnLeave;
            setOnLeaveEmployees(peopleOnLeave)
            console.log(peopleOnLeave);
        }
    }

    const getTaskType = async () => {
        let web = new Web(AllListId.siteUrl);
        let taskTypeData = [];
        taskTypeData = await web.lists
            .getById(AllListId.TaskTypeID)
            .items.select(
                'Id',
                'Level',
                'Title',
                'SortOrder',
            )
            .get();
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
    const OpenAddStructureModal = () => {
        setIsAddStructureOpen(true);
    }
    //End
    const changeToggleAWT = () => {
        if (showAllAWTGrouped == true) {
            setFlatData(AllProject)
        } else {
            setFlatData(AllProjectDataWithAWT)
        }
        setShowAllAWTGrouped(!showAllAWTGrouped)
        setWorkingTodayFiltered(false)
    }
    const changeToggleWorkingToday = () => {
        setFlatData(AllProject)
        setShowAllAWTGrouped(false)
        setWorkingTodayFiltered(!workingTodayFiltered)
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
            {((TableProperty?.length === 1 && TableProperty[0]?.original?.Item_x0020_Type != "Feature" && TableProperty[0]?.original?.Item_x0020_Type != "Sprint" &&
                TableProperty[0]?.original?.TaskType?.Title != "Activities" && TableProperty[0]?.original?.TaskType?.Title != "Workstream" && TableProperty[0]?.original?.TaskType?.Title != "Task")
                || TableProperty?.length === 0) ?
                <button type="button" className="btn btn-primary" title=" Add Structure" onClick={() => OpenAddStructureModal()}>
                    {" "} Add Structure{" "}</button>
                :
                <button type="button" disabled className="btn btn-primary" title=" Add Structure"> {" "} Add Structure{" "}</button>}

            {trueRestructuring == true ?
                <RestructuringCom AllSitesTaskData={AllSitesAllTasks} AllMasterTasksData={MyAllData} restructureFunct={restructureFunct} ref={restructuringRef} taskTypeId={AllTaskUser} contextValue={AllListId} allData={workingTodayFiltered ? data : flatData} restructureCallBack={restructureCallback} findPage={"ProjectOverView"} restructureItem={childRef.current.table.getSelectedRowModel().flatRows} />
                : <button type="button" title="Restructure" disabled={true} className="btn btn-primary">Restructure</button>}
            <label className="switch me-2" htmlFor="checkbox">
                <input checked={showAllAWTGrouped} onChange={() => { changeToggleAWT(); }} type="checkbox" id="checkbox" />
                {showAllAWTGrouped === true ? <div className="slider round" title="Switch To Project/Sprints Only"></div> : <div title='Swtich to Show All AWT Items' className="slider round"></div>}
            </label> <label className="switch me-2" htmlFor="checkbox1">
                <input checked={workingTodayFiltered} onChange={() => { changeToggleWorkingToday(); }} type="checkbox" id="checkbox1" />
                {workingTodayFiltered === true ? <div className="slider round" title='Swtich to Show All Items'></div> : <div title="Switch To Working Today's" className="slider round"></div>}
            </label>

            {(ActiveCompareToolButton) ?
                <button type="button" className="btn btn-primary" title='Compare' style={{ color: '#fff' }} onClick={() => trigerAllEventButton("Compare")}>Compare</button> :
                <button type="button" className="btn btn-primary" style={{ color: '#fff' }} disabled={true}>Compare</button>}
        </>

    )
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

    return (
        <>
            <div>
                <div className="col-sm-12 pad0 smart">
                    <div className="section-event project-overview-Table">
                        <div >
                            <div className='align-items-center d-flex justify-content-between'>
                                <h2 className='heading'>PX Management Overview</h2>

                                {/* {showTeamMemberOnCheck === true ? <span><a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" className="svg__iconbox svg__icon--team teamIcon"></span></a></span> : ''} */}

                            </div>
                            <>
                                <div className='ProjectOverViewRadioFlat  d-flex justify-content-between SpfxCheckRadio mb-2 mt-1'>
                                    <dl className='alignCenter gap-2 mb-0'>
                                        <dt>
                                            <input className='radio' type="radio" value="Projects" name="date" checked={selectedView == 'Projects'} onClick={() => setSelectedView('Projects')} /> Projects/Sprints
                                        </dt>
                                        <dt>
                                            <input className='radio' type="radio" value="teamWise" name="date" checked={selectedView == 'teamWise'} onClick={() => setSelectedView('teamWise')} /> Team View
                                        </dt>

                                    </dl>
                                    <div className="m-0 text-end">
                                        {/* 
                                        {currentUserData?.Title == "Deepak Trivedi" || currentUserData?.Title == "Ranu Trivedi" || currentUserData?.Title == "Abhishek Tiwari" || currentUserData?.Title == "Prashant Kumar"  ?
                                            <>
                                                <a className="hreflink  ms-1" onClick={() => { sendAllWorkingTodayTasks() }}>Share Working Todays's Task</a></>
                                            : ''} */}
                                        {workingEmailVisibility ?
                                            <>
                                                <a className="hreflink  ms-1" onClick={() => { sendAllWorkingTodayTasks() }}>Share Working Todays's Task</a></>
                                            : ''
                                        }
                                    </div>
                                </div>
                                <section className="TableContentSection row taskprofilepagegreen">
                                    <div className="container-fluid p-0">
                                        <section className="TableSection">
                                            <div className="container p-0">
                                                <div className="Alltable mt-2 ">
                                                    <div className="col-sm-12 p-0 smart">
                                                        <div>
                                                            <div>
                                                                {selectedView == 'teamWise' ? <GlobalCommanTable expandIcon={true} headerOptions={headerOptions} hideShowingTaskCountToolTip={true} AllListId={AllListId} columns={groupedUsers} paginatedTable={true} data={categoryGroup} taskTypeDataItem={taskTypeDataItem} showingAllPortFolioCount={true} callBackData={callBackData} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                                                {selectedView == 'Projects' ? <GlobalCommanTable fixedWidthTable={true} expandIcon={true} ref={childRef} callChildFunction={callChildFunction} AllListId={AllListId} headerOptions={headerOptions} paginatedTable={false}
                                                                    customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons} multiSelect={true} columns={column2}
                                                                    data={workingTodayFiltered ? data : flatData} portfolioTypeData={portfolioTypeDataItem} showingAllPortFolioCount={true} callBackData={callBackData} pageName={"ProjectOverview"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </section>
                            </>
                        </div>
                    </div >
                </div >
                {
                    isOpenEditPopup ? (
                        <EditTaskPopup AllListId={AllListId} context={props?.props?.Context} Items={passdata} pageName="TaskDashBoard" Call={editTaskCallBack} />
                    ) : (
                        ""
                    )
                }
                {IsComponent && <EditProjectPopup props={CMSToolComponent} AllListId={AllListId} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup>}
                {ShowTeamPopup === true ? <ShowTeamMembers props={checkData} callBack={showTaskTeamCAllBack} TaskUsers={AllTaskUser} /> : ''}
                {openTimeEntryPopup && <TimeEntryPopup props={taskTimeDetails} CallBackTimeEntry={TimeEntryCallBack} Context={props?.props?.Context} />}
                {isAddStructureOpen && <AddProject CallBack={CallBack} items={CheckBoxData} PageName={"ProjectOverview"} AllListId={AllListId} data={data} />}
                {openCompareToolPopup && <CompareTool isOpen={openCompareToolPopup} compareToolCallBack={compareToolCallBack} compareData={childRef?.current?.table?.getSelectedRowModel()?.flatRows} contextValue={props?.props} />}
            </div >
            {pageLoaderActive ? <PageLoader /> : ''
            }
        </>
    )
}
