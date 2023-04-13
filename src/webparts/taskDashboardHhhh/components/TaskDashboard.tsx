import * as React from 'react'
import $ from 'jquery';
import axios from 'axios';
import { Accordion, Card, Button } from "react-bootstrap";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import * as Moment from "moment";
import pnp, { sp, Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import { Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input, } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp, } from "react-icons/fa";
import { useTable, useSortBy, useFilters, useExpanded, usePagination, HeaderGroup, } from "react-table";
import { Filter, DefaultColumnFilter, } from "../../projectmanagementOverviewTool/components/filters";
import PageLoader from '../../../globalComponents/pageLoader';
var taskUsers: any = [];
var userGroups: any = [];
var siteConfig: any = [];
var AllTaskTimeEntries: any = [];
var AllTasks: any = [];
var timesheetListConfig: any = [];
var currentUserId: '';
var DataSiteIcon: any = [];
var currentUser: any = [];
var weekTimeEntry: any = [];
var today: any = [];
var backupTaskArray: any = {
    AllAssignedTasks: [],
    workingTodayTasks: [],
    thisWeekTasks: [],
    bottleneckTasks: [],
    assignedApproverTasks: [],
    allTasks: []
};
var AllListId:any={}
var selectedInlineTask: any = {};
const TaskDashboard = (props: any) => {
    const [updateContent, setUpdateContent] = React.useState(false);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [selectedUser, setSelectedUser]: any = React.useState({});
    const [passdata, setpassdata] = React.useState("");
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [AllAssignedTasks, setAllAssignedTasks] = React.useState([]);
    const [workingTodayTasks, setWorkingTodayTasks] = React.useState([]);
    const [thisWeekTasks, setThisWeekTasks] = React.useState([]);
    const [bottleneckTasks, setBottleneckTasks] = React.useState([]);
    const [assignedApproverTasks, setAssignedApproverTasks] = React.useState([]);
    const [groupedUsers, setGroupedUsers] = React.useState([]);
    const [sidebarStatus, setSidebarStatus] = React.useState({
        sideBarFilter: false,
        dashboard: true,
    });
    const [dragedTask, setDragedTask] = React.useState({
        task: {},
        taskId: '',
        origin: ''
    });
    React.useEffect(() => {
        // sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
        AllListId = {
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskUsertListID: props?.props?.TaskUsertListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            //SiteTaskListID:this.props?.props?.SiteTaskListID,
            TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
            DocumentsListID: props?.props?.DocumentsListID,
            SmartInformationListID: props?.props?.SmartInformationListID,
            siteUrl:props?.props?.siteUrl
          }
        setPageLoader(true);
        getCurrentUserDetails();
        createDisplayDate();
        try {
            $('#spPageCanvasContent').removeClass();
            $('#spPageCanvasContent').addClass('hundred')
            $('#workbenchPageContent').removeClass();
            $('#workbenchPageContent').addClass('hundred')
        } catch (e) {
            console.log(e);
        }

    }, []);
    React.useEffect(() => {
        loadAllTimeEntry()
    }, [currentUserId, timesheetListConfig]);
    React.useEffect(() => {
        let CONTENT = !updateContent;
        setUpdateContent(CONTENT);

    }, [AllAssignedTasks, thisWeekTasks, workingTodayTasks]);

    const createDisplayDate = () => {
        let displayDate = {
            day: '',
            date: '',
            month: '',
            fullDate: new Date()
        }
        displayDate.day = displayDate.fullDate.toLocaleString('en-GB', { weekday: 'short' });
        displayDate.date = displayDate.fullDate.toLocaleString('en-GB', { day: 'numeric' });
        displayDate.month = displayDate.fullDate.toLocaleString('en-GB', { month: 'long' });
        today = displayDate;
    }
    const loadAdminConfigurations = async () => {
        try {
            var CurrentSiteType = "";
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP")
            await web.lists
                .getById('e968902a-3021-4af2-a30a-174ea95cf8fa')
                .items.select("Id,Title,Value,Key,Description,DisplayTitle,Configurations&$filter=Key eq 'TaskDashboardConfiguration'")
                .top(4999)
                .get().then((response) => {
                    var SmartFavoritesConfig = [];
                    $.each(response, function (index: any, smart: any) {
                        if (smart.Configurations != undefined) {
                            DataSiteIcon = JSON.parse(smart.Configurations);
                        }
                    });
                },
                    function (error) { }
                );
        } catch (e) {
            console.log(e)
        }
    };

    //Item Exist 
    const checkUserExistence = (item: any, Array: any) => {
        let result = false;
        Array?.map((checkItem: any) => {
            if (checkItem?.Title == item) {
                result = true;
            }
        })
        return result;
    }
    //End 
    // Get Week Start Date 
    function getThisWeekStartingDate() {
        const startingDate = new Date();
        startingDate.setDate(startingDate.getDate() - startingDate.getDay());
        const formattedDate = Moment(startingDate).format('YYYY-MM-DDTHH:mm:ssZ');
        return formattedDate;
    }
    //End

    //Load This Week Time Entry 
    const loadMigrationTimeEntry = async () => {
        if (timesheetListConfig?.length > 0) {
            let timesheetLists: any = [];
            timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
            if (timesheetLists?.length > 0) {
                timesheetLists?.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    if (timesheetLists?.listName=='TasksTimesheet2') {
                    await web.lists
                    .getById(list?.listId)
                    .items.select( "Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskALAKDigital/Id,TaskALAKDigital/Title,TaskMigration/Id,TaskMigration/Title&$expand=Category,TimesheetTitle,TaskMigration,TaskALAKDigital")
                    .getAll().then((data: any) => {
                        data?.map((item: any) => {
                            AllTaskTimeEntries.push(item)
                        })
                    });
                   }
                })
            }
        }
    }
    const loadAllTimeEntry = async () => {
        if (timesheetListConfig?.length > 0) {
            let timesheetLists: any = [];
            timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
            if (timesheetLists?.length > 0) {
                timesheetLists?.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    if (timesheetLists?.listName!='TasksTimesheet2') {
                    await web.lists
                    .getById(list?.listId)
                    .items.select( 'Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskHHHH/Id,TaskHHHH/Title,TaskShareweb/Id,TaskShareweb/Title,TaskEPS/Id,TaskEPS/Title,TaskQA/Id,TaskQA/Title,TaskEI/Id,TaskEI/Title,TaskOffshoreTasks/Id,TaskOffshoreTasks/Title,TaskSmallProjects/Id,TaskSmallProjects/Title&$expand=Category,TimesheetTitle,TaskHHHH,TaskShareweb,TaskEPS,TaskQA,TaskShareweb,TaskEI,TaskOffshoreTasks,TaskSmallProjects')
                    .getAll().then((data: any) => {
                        data?.map((item: any) => {
                            AllTaskTimeEntries.push(item)
                        })
                    });
                   }
                })
                loadMigrationTimeEntry();
            }
        }
    }
    const timeEntryTaskExist = (task: any) => {

    }
    const currentUserWeekTimeEntry = () => {
        AllTaskTimeEntries?.map((taskEntry: any) => {

        })
    }
    //End 


    // All Sites Task
    const LoadAllSiteTasks = function () {
        loadAdminConfigurations();
        let AllSiteTasks: any = [];
        let query =
            "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        let Counter = 0;
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let arraycount = 0;
        try {
            if (currentUserId != undefined) {

                siteConfig.map(async (config: any) => {
                    if (config.Title != "SDC Sites") {
                        let smartmeta = [];
                        await web.lists
                            .getById(config.listId)
                            .items.select(
                                "Id,StartDate,DueDate,Title,workingThisWeek,Created,SharewebCategories/Id,SharewebCategories/Title,PercentComplete,IsTodaysTask,Categories,Approver/Id,Approver/Title,Priority_x0020_Rank,Priority,ClientCategory/Id,SharewebTaskType/Id,SharewebTaskType/Title,ClientCategory/Title,Project/Id,Project/Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title"
                            )
                            .expand(
                                "Project,SharewebCategories,AssignedTo,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,ClientCategory,Component,Services,SharewebTaskType,Approver"
                            )
                            .getAll().then((data: any) => {
                                smartmeta = data;
                                smartmeta.map((task: any) => {
                                    task.AllTeamMember = [];
                                    task.siteType = config.Title;
                                    task.listId = config.listId;
                                    task.siteUrl = config.siteUrl.Url;
                                    task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
                                    task.DisplayDueDate =
                                        task.DueDate != null
                                            ? Moment(task.DueDate).format("DD/MM/YYYY")
                                            : "";
                                    task.portfolio = {};
                                    if (task?.Component?.length > 0) {
                                        task.portfolio = task?.Component[0];
                                        task.PortfolioTitle = task?.Component[0]?.Title;
                                        task["Portfoliotype"] = "Component";
                                    }
                                    if (task?.Services?.length > 0) {
                                        task.portfolio = task?.Services[0];
                                        task.PortfolioTitle = task?.Services[0]?.Title;
                                        task["Portfoliotype"] = "Service";
                                    }
                                    if (DataSiteIcon != undefined) {
                                        DataSiteIcon.map((site: any) => {
                                            if (site.Site == task.siteType) {
                                                task["siteIcon"] = site.SiteIcon;
                                            }
                                        });
                                    }
                                    task.TeamMembersSearch = "";
                                    task.componentString =
                                        task.Component != undefined &&
                                            task.Component != undefined &&
                                            task.Component.length > 0
                                            ? getComponentasString(task.Component)
                                            : "";
                                    task.Shareweb_x0020_ID = globalCommon.getTaskId(task);
                                    task.ApproverIds = [];
                                    task?.Approver?.map((approverUser: any) => {
                                        task.ApproverIds.push(approverUser?.Id);
                                    })
                                    task.AssignedToIds = [];
                                    task?.AssignedTo?.map((assignedUser: any) => {
                                        task.AssignedToIds.push(assignedUser.Id)
                                        taskUsers?.map((user: any) => {
                                            if (user.AssingedToUserId == assignedUser.Id) {
                                                if (user?.Title != undefined) {
                                                    task.TeamMembersSearch =
                                                        task.TeamMembersSearch + " " + user?.Title;
                                                }
                                            }
                                        });
                                    });
                                    task.DisplayCreateDate =
                                        task.Created != null
                                            ? Moment(task.Created).format("DD/MM/YYYY")
                                            : "";
                                    task.TeamMembersId = [];
                                    task?.Team_x0020_Members?.map((taskUser: any) => {
                                        task.TeamMembersId.push(taskUser.Id);
                                        var newuserdata: any = {};
                                        taskUsers?.map((user: any) => {
                                            if (user.AssingedToUserId == task.Author.Id) {
                                                task.createdImg = user.Item_x0020_Cover.Url;
                                            }
                                            if (user.AssingedToUserId == taskUser.Id) {
                                                if (user?.Title != undefined) {
                                                    task.TeamMembersSearch =
                                                        task.TeamMembersSearch + " " + user?.Title;
                                                }
                                                newuserdata["useimageurl"] = user.Item_x0020_Cover.Url;
                                                newuserdata["Suffix"] = user.Suffix;
                                                newuserdata["Title"] = user.Title;
                                                newuserdata["UserId"] = user.AssingedToUserId;
                                                task["Usertitlename"] = user.Title;
                                            }
                                            task.AllTeamMember.push(newuserdata);
                                        });
                                    });
                                    AllSiteTasks.push(task)
                                });
                                arraycount++;
                            });
                        let currentCount = siteConfig?.length;
                        if (arraycount === currentCount) {
                            AllTasks = AllSiteTasks;
                            filterCurrentUserTask();
                            backupTaskArray.allTasks = AllSiteTasks;
                            setPageLoader(false);
                        }
                    } else {
                        arraycount++;
                    }
                });
            }
        } catch (e) {
            console.log(e)
        }
    };
    const getChilds1 = function (item: any, array: any) {
        item.childs = [];

        array?.map((childItem: any) => {
            childItem.selected = false;
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID && childItem.IsShowTeamLeader == true) {
                item.childs.push(childItem);
                if ((item?.Title == 'HHHH Team' || item?.Title == 'Smalsus Lead Team') && currentUser?.AssingedToUserId == childItem?.AssingedToUserId) {
                    currentUser.isAdmin = true;
                    setCurrentUserData(currentUser);
                }
            }
        })
    }

    //Edit CallBack
    const editTaskCallBack = React.useCallback(() => {
        setisOpenEditPopup(false);
    }, []);
    const inlineCallBack = React.useCallback((item: any, index: any) => {
        AllTasks?.map((task: any, index: any) => {
            if (task.Id == item.Id) {
                AllTasks[index] = { ...task, ...item };
            }
        })
        backupTaskArray.allTasks = AllTasks;
        // setUpdateContent(CONTENT);
        filterCurrentUserTask();
        setisOpenEditPopup(false);
    }, []);
    //end
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true);
        setpassdata(item);
    }, []);

    // Create React Tables For the Tasks
    // Filter User Task From All Task 
    const filterCurrentUserTask = () => {
        let AllAssignedTask: any = [];
        let workingTodayTask: any = [];
        let workingThisWeekTask: any = [];
        let bottleneckTask: any = [];
        let approverTask: any = [];

        if (AllTasks?.length > 0 && currentUserId != undefined && currentUserId != '') {
            AllTasks?.map((task: any) => {
                const isCurrentUserAssigned = task?.AssignedToIds?.includes(currentUserId);
                const isCurrentUserTeamMember = task?.TeamMembersId?.includes(currentUserId);
                const isCurrentUserApprover = task?.ApproverIds?.includes(currentUserId);
                const isBottleneckTask = checkUserExistence('Bottleneck', task?.SharewebCategories);
                let alreadyPushed = false;
                if (isCurrentUserApprover && task?.PercentComplete == '1') {
                    approverTask.push(task)
                    alreadyPushed = true;
                } else if (task?.IsTodaysTask && (isCurrentUserAssigned)) {
                    workingTodayTask.push(task)
                    alreadyPushed = true;
                } else if (task?.workingThisWeek && (isCurrentUserAssigned || isCurrentUserTeamMember)) {
                    workingThisWeekTask.push(task)
                    alreadyPushed = true;
                } else if (isBottleneckTask && (isCurrentUserAssigned || isCurrentUserTeamMember)) {
                    bottleneckTask.push(task)
                    alreadyPushed = true;
                } else if (!alreadyPushed && (isCurrentUserAssigned || isCurrentUserTeamMember)) {
                    AllAssignedTask.push(task)
                    alreadyPushed = true;
                }
            })
        }
        backupTaskArray.AllAssignedTasks = AllAssignedTask;
        backupTaskArray.workingTodayTasks = workingTodayTask;
        backupTaskArray.thisWeekTasks = workingThisWeekTask;
        backupTaskArray.bottleneckTasks = bottleneckTask;
        backupTaskArray.assignedApproverTasks = approverTask;
        setAllAssignedTasks(AllAssignedTask);
        setWorkingTodayTasks(workingTodayTask)
        setThisWeekTasks(workingThisWeekTask)
        setBottleneckTasks(bottleneckTask)
        setAssignedApproverTasks(approverTask)
    }
    //End
    const columns = React.useMemo(
        () => [
            {
                internalHeader: "Task Id",
                accessor: "Shareweb_x0020_ID",
                style: { width: '70px' },
                showSortIcon: false,
                Cell: ({ row }: any) => (
                    <span>

                        {row?.original?.Shareweb_x0020_ID}

                    </span>
                ),
            },
            {
                internalHeader: "Title",
                accessor: "Title",
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <a className='hreflink'
                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                            data-interception="off"
                            target="_blank"
                        >
                            {row?.values?.Title}
                        </a>
                    </span>
                ),
            },
            {
                internalHeader: "Site",
                accessor: 'siteType',
                id: "siteIcon", // 'id' is required
                showSortIcon: false,
                style: { width: '40px' },
                Cell: ({ row }: any) => (
                    <span>
                        <img
                            className="circularImage rounded-circle"
                            src={row?.original?.siteIcon}
                        />
                    </span>
                ),
            },
            {
                internalHeader: "Portfolio",
                accessor: "PortfolioTitle",
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <a className='hreflink' data-interception="off"
                            target="blank"
                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
                        >
                            {row?.original?.portfolio?.Title}
                        </a>
                    </span>
                ),
            },
            {
                internalHeader: "Priority",
                isSorted: true,
                isSortedDesc: true,
                accessor: "Priority_x0020_Rank",
                style: { width: '100px' },
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} type='Task' rowIndex={row?.index} callBack={inlineCallBack} TaskUsers={taskUsers} columnName='Priority' item={row?.original} />
                    </span>
                ),
            },

            {
                internalHeader: "Due Date",
                showSortIcon: true,
                accessor: "DueDate",
                style: { width: '80px' },
                Cell: ({ row }: any) => <InlineEditingcolumns
                AllListId={AllListId}
                    callBack={inlineCallBack}
                    columnName="DisplayDueDate"
                    item={row?.original}
                    TaskUsers={taskUsers}
                />,
            },

            {
                internalHeader: "% Complete",
                accessor: "PercentComplete",
                style: { width: '70px' },
                showSortIcon: true,
                Cell: ({ row }: any) => (

                    <span>
                        <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='PercentComplete' TaskUsers={taskUsers} item={row?.original} />
                    </span>
                ),
            },
            {
                internalHeader: "Team Members",
                accessor: "TeamMembersSearch",
                style: { width: '150px' },
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='Team' item={row?.original} TaskUsers={taskUsers} />
                    </span>
                ),
            },
            {
                internalHeader: "Created",
                accessor: "DisplayCreateDate",
                showSortIcon: true,
                style: { width: "125px" },
                Cell: ({ row }: any) => (
                    <span>
                        <span className="ms-1">{row?.original?.DisplayCreateDate}</span>
                        <img className="imgAuthor" src={row?.original?.createdImg} />
                    </span>
                ),
            },

            {
                internalHeader: "",
                id: "Id", // 'id' is required
                isSorted: false,
                style: { width: '35px' },
                showSortIcon: false,
                Cell: ({ row }: any) => (
                    <span
                        title="Edit Task"
                        onClick={() => EditPopup(row?.original)}
                        className="svg__iconbox svg__icon--edit"
                    ></span>
                ),
            },
        ],
        [AllAssignedTasks, thisWeekTasks, workingTodayTasks]
    );

    const {
        getTableProps: getTablePropsToday,
        getTableBodyProps: getTableBodyPropsToday,
        headerGroups: headerGroupsToday,
        page: pageToday,
        prepareRow: prepareRowToday,
        gotoPage: gotoPageToday,
        setPageSize: setPageSizeToday,
        state: { pageIndex: pageIndexToday, pageSize: pageSizeToday },
    }: any = useTable(
        {
            columns: columns,
            data: workingTodayTasks,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 100000 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const {
        getTableProps: getTablePropsApprover,
        getTableBodyProps: getTableBodyPropsApprover,
        headerGroups: headerGroupsApprover,
        page: pageApprover,
        prepareRow: prepareRowApprover,
        gotoPage: gotoPageApprover,
        setPageSize: setPageSizeApprover,
        state: { pageIndex: pageIndexApprover, pageSize: pageSizeApprover },
    }: any = useTable(
        {
            columns: columns,
            data: assignedApproverTasks,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 100000 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    const {
        getTableProps: getTablePropsBottleneck,
        getTableBodyProps: getTableBodyPropsBottleneck,
        headerGroups: headerGroupsBottleneck,
        page: pageBottleneck,
        prepareRow: prepareRowBottleneck,
        gotoPage: gotoPageBottleneck,
        setPageSize: setPageSizeBottleneck,
        state: { pageIndex: pageIndexBottleneck, pageSize: pageSizeBottleneck },
    }: any = useTable(
        {
            columns: columns,
            data: bottleneckTasks,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 100000 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const {
        getTableProps: getTablePropsWeek,
        getTableBodyProps: getTableBodyPropsWeek,
        headerGroups: headerGroupsWeek,
        page: pageWeek,
        prepareRow: prepareRowWeek,
        gotoPage: gotoPageWeek,
        setPageSize: setPageSizeWeek,
        state: { pageIndex: pageIndexWeek, pageSize: pageSizeWeek },
    }: any = useTable(
        {
            columns: columns,
            data: thisWeekTasks,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 100000 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const {
        getTableProps: getTablePropsAll,
        getTableBodyProps: getTableBodyPropsAll,
        headerGroups: headerGroupsAll,
        page: pageAll,
        prepareRow: prepareRowAll,
        gotoPage: gotoPageAll,
        setPageSize: setPageSizeAll,
        canPreviousPage: canPreviousPageAll,
        canNextPage: canNextPageAll,
        pageOptions: pageOptionsAll,
        pageCount: pageCountAll,
        nextPage: nextPageAll,
        previousPage: previousPageAll,
        state: { pageIndex: pageIndexAll, pageSize: pageSizeAll },
    }: any = useTable(
        {
            columns: columns,
            data: AllAssignedTasks,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (
            column.isSortedDesc ? (
                <FaSortDown />
            ) : (
                <FaSortUp />
            )
        ) : column.showSortIcon ? (
            <FaSort />
        ) : (
            ""
        );
    };
    //End Region 

    //Update Task After Drop
    const UpdateTaskStatus = async (task: any) => {
        let postToday = task?.IsTodaysTask != undefined ? task.IsTodaysTask : false
        let postworkingThisWeekTask = task?.workingThisWeek != undefined ? task.workingThisWeek : false
        let web = new Web(task?.siteUrl);
        await web.lists.getById(task?.listId).items.getById(task?.Id).update({
            IsTodaysTask: postToday,
            workingThisWeek: postworkingThisWeekTask
        })
            .then((res: any) => {
                console.log("Drop Updated");
            })

    }
    //end
    const GetMetaData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmeta = [];

        let TaxonomyItems = [];
        try {
            smartmeta = await web.lists
                .getById("01a34938-8c7e-4ea6-a003-cee649e8c67a")
                .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "Configurations", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                .top(5000)
                .filter("(TaxType eq 'Sites')or(TaxType eq 'timesheetListConfigrations')")
                .expand("Parent")
                .get();
            siteConfig = smartmeta.filter((data: any) => {
                if (data?.IsVisible && data?.TaxType == 'Sites') {
                    return data;
                }
            });
            timesheetListConfig = smartmeta.filter((data: any) => {
                if (data?.TaxType == 'timesheetListConfigrations') {
                    return data;
                }
            });
            LoadAllSiteTasks();

        } catch (error) {

        }

    };


    const getComponentasString = function (results: any) {
        var component = "";
        $.each(results, function (cmp: any) {
            component += cmp.Title + "; ";
        });
        return component;
    };
    // Toggle Side Bar Function
    const toggleSideBar = () => {
        setSidebarStatus({ ...sidebarStatus, dashboard: !sidebarStatus.dashboard });
        if (sidebarStatus.dashboard == false) {
            $(".sidebar").attr("collapsed", "");
        } else {
            $(".sidebar").removeAttr("collapsed");
        }
    };
    //end

    // Current User deatils
    const getCurrentUserDetails = async () => {
        await axios.get(`${props?.pageContext?.web?.absoluteUrl}/_api/web/currentuser`, {
            headers: {
                "Accept": "application/json;odata=verbose"
            }
        })
            .then(response => {
                currentUserId = response?.data?.d?.Id;
                console.log(`Current user ID: ${currentUserId}`);
            })
            .catch(error => {
                console.log(error);
            });

        taskUsers = await globalCommon.loadTaskUsers();
        taskUsers?.map((item: any) => {
            item.isAdmin = false;
            if (currentUserId == item?.AssingedToUser?.Id) {
                currentUser = item;
                setCurrentUserData(item);
            }
            item.expanded = false;
            getChilds1(item, taskUsers);
            userGroups.push(item);
        })
        setGroupedUsers(userGroups);
        GetMetaData();
    }
    const createGroupUsers = () => {
        let Groups: any = [];
        taskUsers?.map((item: any) => {
            item.expanded = false;
            item.isAdmin = false;
            getChilds1(item, taskUsers);
            Groups.push(item);
        })
        setGroupedUsers(Groups);
    }
    // End

    //Change User details 
    const changeSelectedUser = (user: any) => {
        if (!user.selected) {
            createGroupUsers();
            user.selected = !user.selected;
            if (user?.AssingedToUserId != currentUserData?.AssingedToUserId) {
                currentUserId = user?.AssingedToUserId;
                setSelectedUser(user)
                filterCurrentUserTask()
            } else {
                unSelectUser();
            }
        } else {
            user.selected = !user.selected;
            unSelectUser();
        }
    }
    const unSelectUser = () => {
        currentUserId = currentUserData?.AssingedToUserId;
        filterCurrentUserTask()
        setSelectedUser({})
        createGroupUsers();
    }
    // End

    //On Drop Handle
    const handleDrop = (destination: any) => {
        if (currentUserId == currentUserData?.AssingedToUserId || currentUserData?.isAdmin == true) {
            let todayTasks = workingTodayTasks;
            let thisWeekTask = thisWeekTasks;
            let allTasks = AllAssignedTasks;
            let task: any = dragedTask.task;
            if (destination == 'thisWeek' && (task?.workingThisWeek == false || task?.workingThisWeek == undefined)) {
                task.IsTodaysTask = false;
                task.workingThisWeek = true;
                UpdateTaskStatus(task);
                thisWeekTask.push(task)
                todayTasks = todayTasks.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
                allTasks = allTasks.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
            }
            if (destination == 'workingToday' && (task?.IsTodaysTask == false || task?.IsTodaysTask == undefined)) {
                task.IsTodaysTask = true;
                task.workingThisWeek = false;
                UpdateTaskStatus(task);
                todayTasks.push(task)
                thisWeekTask = thisWeekTask.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
                allTasks = allTasks.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
            }
            if (destination == 'AllTasks' && (task?.IsTodaysTask == true || task?.workingThisWeek == true)) {
                task.IsTodaysTask = false;
                task.workingThisWeek = false;
                UpdateTaskStatus(task);
                todayTasks = todayTasks.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
                thisWeekTask = thisWeekTask.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
            }
            setAllAssignedTasks(allTasks);
            setThisWeekTasks(thisWeekTask);
            setWorkingTodayTasks(todayTasks);
        } else {
            alert('This Drop Is Not Allowed')
        }

    }
    const startDrag = (task: any, taskId: any, origin: any) => {
        let taskDetails = {
            task: task,
            taskId: taskId,
            origin: origin
        }
        setDragedTask(taskDetails)
        console.log(task, origin);
    }
    //region end
    //Toggle Team 
    const toggleTeamUsers = (index: any) => {
        let userGroups = groupedUsers;
        let CONTENT = !updateContent;


        try {
            userGroups[index].expanded = !userGroups[index].expanded
        } catch (error) {
            console.log(error, 'Toogle Team Error')
        }
        setGroupedUsers(userGroups);
        setUpdateContent(CONTENT);
    }
    const onChangeInSelectAll = (event: any) => {
        setPageSizeAll(Number(event.target.value));
    };
    //End
    return (
        <>
            <div className="Dashboardsecrtion" style={{ minHeight: '800px' }}>
                <div className={updateContent ? "dashboard-colm" : "dashboard-colm"}>
                    <aside className="sidebar">
                        <button
                            type="button"
                            onClick={() => {
                                toggleSideBar();
                            }}
                            className="collapse-toggle"
                        ></button>
                        <section className="sidebar__section sidebar__section--menu">
                            <nav className="nav__item">
                                <ul className="nav__list">
                                    <li id="DefaultViewSelectId" className="nav__item ">
                                        <a className="nav__link border-bottom pb-1" >
                                            <span className="nav__icon nav__icon--home"></span>
                                            <span className="nav__text">
                                                Welcome, {currentUserData?.AssingedToUser?.Title}

                                            </span>
                                        </a>
                                    </li>
                                    <li className="nav__item  pb-1 pt-0">

                                    </li>
                                </ul>
                            </nav>
                        </section>
                        <section className="sidebar__section sidebar__section--menu">
                            <nav className="nav__item">
                                <ul className="nav__list">
                                    <li id="DefaultViewSelectId" className="nav__item  pt-0  ">
                                        <a className="nav__link border-bottom pb-1" >
                                            <span className="nav__icon nav__icon--home"></span>
                                            <div className="nav__text text-center">
                                                <h6>
                                                    {today.day}
                                                </h6>
                                                <h4>
                                                    {today.date}
                                                </h4>
                                                <h5>
                                                    {today.month}
                                                </h5>
                                            </div>
                                        </a>
                                    </li>
                                    <li id="DefaultViewSelectId" className="nav__item  pb-1 pt-0">

                                    </li>
                                </ul>
                            </nav>
                        </section>
                        <section className="sidebar__section sidebar__section--menu">
                       <nav className="nav__item">
                                <ul className="nav__list">
                                    {groupedUsers?.map((filterItem: any, index: any) => {
                                        if (filterItem?.childs?.length > 0) {
                                            return (
                                                <li id="DefaultViewSelectId" onClick={() => toggleTeamUsers(index)} className={updateContent ? "nav__text hreflink bg-shade  mb-1 " : "nav__text bg-shade hreflink mb-1 "}>
                                                    {filterItem?.Title}
                                                    {filterItem?.expanded ? <span className='svg__iconbox svg__icon--arrowDown  float-start me-1 '></span>: <span className='svg__iconbox svg__icon--arrowRight  float-start me-1'></span>}
                                                    {
                                                        filterItem?.expanded == true ?
                                                            <ul className="nav__list ms-2">
                                                                {filterItem?.childs?.map((childUsers: any) => {
                                                                    return (
                                                                        <li id="DefaultViewSelectId" className="nav__text  ms-3">
                                                                            <a className={childUsers?.selected ? 'bg-ee hreflink ' : 'text-white hreflink'}
                                                                                target="_blank" data-interception="off" title={childUsers.Title} onClick={() => changeSelectedUser(childUsers)}>
                                                                                {childUsers.Title}
                                                                            </a>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                            : ''
                                                    }
                                                </li>
                                            )
                                        }
                                    })}
                                </ul>
                            </nav>
                        </section>
                    </aside>
                    <div className={updateContent ? "dashboard-content ps-2 full-width" : "dashboard-content ps-2 full-width"} >
                        <article className="row">
                            {selectedUser?.Title != undefined ?
                                <div className="col-md-12 clearfix">
                                    <h5 className="d-inline-block">
                                        {`${selectedUser?.Title}'s Dashboard`}
                                    </h5>
                                    <span className='pull-right hreflink' onClick={() => unSelectUser()}>Go Back To Your Dashboard</span>
                                </div>
                                : ''}
                            <div className="col-md-12">
                                <details open>
                                    <summary> Working Today Tasks {'(' + pageToday?.length + ')'}</summary>
                                    <div className='AccordionContent' style={{ maxHeight: '300px', overflow: 'auto' }} onDrop={(e: any) => handleDrop('workingToday')}
                                        onDragOver={(e: any) => e.preventDefault()}>
                                        {workingTodayTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable" : "SortingTable"} bordered hover  {...getTablePropsToday()}>
                                                <thead>
                                                    {headerGroupsToday?.map((headerGroup: any) => (
                                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                                            {headerGroup.headers.map((column: any) => (
                                                                <th {...column.getHeaderProps()} style={column?.style}>
                                                                    <span
                                                                        class="Table-SortingIcon"
                                                                        style={{ marginTop: "-6px" }}
                                                                        {...column.getSortByToggleProps()}
                                                                    >
                                                                        {column.render("Header")}
                                                                        {generateSortingIndicator(column)}
                                                                    </span>
                                                                    <Filter column={column} />
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageToday?.length > 0 ?
                                                    <tbody className={updateContent ? 'p-0' : ''} {...getTableBodyPropsToday}>
                                                        {pageToday?.map((row: any) => {
                                                            prepareRowToday(row);
                                                            return (
                                                                <tr onClick={() => { selectedInlineTask = { table: "workingToday", taskId: row?.original?.Id } }} className={row?.original?.Services?.length > 0 ? 'serviepannelgreena' : ''} draggable data-value={row?.original}
                                                                    onDragStart={(e) => startDrag(row?.original, row?.original.Shareweb_x0020_ID, 'workingToday')}
                                                                    onDragOver={(e) => e.preventDefault()} key={row?.original.Id}{...row.getRowProps()}>
                                                                    {row.cells.map(
                                                                        (cell: {
                                                                            getCellProps: () => JSX.IntrinsicAttributes &
                                                                                React.ClassAttributes<HTMLTableDataCellElement> &
                                                                                React.TdHTMLAttributes<HTMLTableDataCellElement>;
                                                                            render: (
                                                                                arg0: string
                                                                            ) =>
                                                                                | boolean
                                                                                | React.ReactChild
                                                                                | React.ReactFragment
                                                                                | React.ReactPortal;
                                                                        }) => {
                                                                            return (
                                                                                <td {...cell.getCellProps()}>
                                                                                    {cell.render("Cell")}
                                                                                </td>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody> :
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={columns?.length}>
                                                                <div className="text-center full-width"><span>No Search Result</span></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>}
                                            </Table>
                                            : <div className='text-center full-width'>
                                                <span>No Working Today Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details>
                                    <summary> Working This Week Tasks {'(' + pageWeek?.length + ')'} </summary>
                                    <div className='AccordionContent' style={{ maxHeight: '300px', overflow: 'auto' }} onDrop={(e: any) => handleDrop('thisWeek')}
                                        onDragOver={(e: any) => e.preventDefault()}>
                                        {thisWeekTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable" : "SortingTable"} bordered hover {...getTablePropsWeek()} >
                                                <thead>
                                                    {headerGroupsWeek?.map((headerGroup: any) => (
                                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                                            {headerGroup.headers.map((column: any) => (
                                                                <th {...column.getHeaderProps()} style={column?.style}>
                                                                    <span
                                                                        class="Table-SortingIcon"
                                                                        style={{ marginTop: "-6px" }}
                                                                        {...column.getSortByToggleProps()}
                                                                    >
                                                                        {column.render("Header")}
                                                                        {generateSortingIndicator(column)}
                                                                    </span>
                                                                    <Filter column={column} />
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageWeek?.length > 0 ?
                                                    <tbody {...getTableBodyPropsWeek()}>
                                                        {pageWeek?.map((row: any) => {
                                                            prepareRowWeek(row);
                                                            return (
                                                                <tr onClick={() => { selectedInlineTask = { table: "workingThisWeek", taskId: row?.original?.Id } }} className={row?.original?.Services?.length > 0 ? 'serviepannelgreena' : ''} draggable data-value={row?.original}
                                                                    onDragStart={(e) => startDrag(row?.original, row?.original.Shareweb_x0020_ID, 'thisWeek')}
                                                                    onDragOver={(e) => e.preventDefault()} key={row?.original.Id}{...row.getRowProps()}>
                                                                    {row.cells.map(
                                                                        (cell: {
                                                                            getCellProps: () => JSX.IntrinsicAttributes &
                                                                                React.ClassAttributes<HTMLTableDataCellElement> &
                                                                                React.TdHTMLAttributes<HTMLTableDataCellElement>;
                                                                            render: (
                                                                                arg0: string
                                                                            ) =>
                                                                                | boolean
                                                                                | React.ReactChild
                                                                                | React.ReactFragment
                                                                                | React.ReactPortal;
                                                                        }) => {
                                                                            return (
                                                                                <td {...cell.getCellProps()}>
                                                                                    {cell.render("Cell")}
                                                                                </td>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody> :
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={columns?.length}>
                                                                <div className="text-center full-width"><span>No Search Result</span></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>}
                                            </Table> : <div className='text-center full-width'>
                                                <span>No Working This Week Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details>
                                    <summary>  Bottleneck Tasks {'(' + pageBottleneck?.length + ')'} </summary>
                                    <div className='AccordionContent' style={{ maxHeight: '300px', overflow: 'auto' }} >
                                        {bottleneckTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable" : "SortingTable"} bordered hover  {...getTablePropsBottleneck()}>
                                                <thead>
                                                    {headerGroupsBottleneck?.map((headerGroup: any) => (
                                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                                            {headerGroup.headers.map((column: any) => (
                                                                <th {...column.getHeaderProps()} style={column?.style}>
                                                                    <span
                                                                        class="Table-SortingIcon"
                                                                        style={{ marginTop: "-6px" }}
                                                                        {...column.getSortByToggleProps()}
                                                                    >
                                                                        {column.render("Header")}
                                                                        {generateSortingIndicator(column)}
                                                                    </span>
                                                                    <Filter column={column} />
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageBottleneck?.length > 0 ?
                                                    <tbody {...getTableBodyPropsBottleneck}>
                                                        {pageBottleneck?.map((row: any) => {
                                                            prepareRowBottleneck(row);
                                                            return (
                                                                <tr onClick={() => { selectedInlineTask = { table: "bottleneck", taskId: row?.original?.Id } }}  {...row.getRowProps()} className={row?.original?.Services?.length > 0 ? 'serviepannelgreena' : ''}>
                                                                    {row.cells.map(
                                                                        (cell: {
                                                                            getCellProps: () => JSX.IntrinsicAttributes &
                                                                                React.ClassAttributes<HTMLTableDataCellElement> &
                                                                                React.TdHTMLAttributes<HTMLTableDataCellElement>;
                                                                            render: (
                                                                                arg0: string
                                                                            ) =>
                                                                                | boolean
                                                                                | React.ReactChild
                                                                                | React.ReactFragment
                                                                                | React.ReactPortal;
                                                                        }) => {
                                                                            return (
                                                                                <td {...cell.getCellProps()}>
                                                                                    {cell.render("Cell")}
                                                                                </td>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody> :
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={columns?.length}>
                                                                <div className="text-center full-width"><span>No Search Result</span></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>}
                                            </Table>
                                            : <div className='text-center full-width'>
                                                <span>No Bottleneck Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details>
                                    <summary>     Approver Tasks {'(' + pageApprover?.length + ')'}</summary>
                                    <div className='AccordionContent' style={{ maxHeight: '300px', overflow: 'auto' }} >
                                        {assignedApproverTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable" : "SortingTable"} bordered hover  {...getTablePropsApprover()}>
                                                <thead>
                                                    {headerGroupsApprover?.map((headerGroup: any) => (
                                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                                            {headerGroup.headers.map((column: any) => (
                                                                <th {...column.getHeaderProps()} style={column?.style}>
                                                                    <span
                                                                        class="Table-SortingIcon"
                                                                        style={{ marginTop: "-6px" }}
                                                                        {...column.getSortByToggleProps()}
                                                                    >
                                                                        {column.render("Header")}
                                                                        {generateSortingIndicator(column)}
                                                                    </span>
                                                                    <Filter column={column} />
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageApprover?.length > 0 ?
                                                    <tbody {...getTableBodyPropsApprover}>
                                                        {pageApprover?.map((row: any) => {
                                                            prepareRowApprover(row);
                                                            return (
                                                                <tr onClick={() => { selectedInlineTask = { table: "approverTask", taskId: row?.original?.Id } }}  {...row.getRowProps()} className={row?.original?.Services?.length > 0 ? 'serviepannelgreena' : ''}>
                                                                    {row.cells.map(
                                                                        (cell: {
                                                                            getCellProps: () => JSX.IntrinsicAttributes &
                                                                                React.ClassAttributes<HTMLTableDataCellElement> &
                                                                                React.TdHTMLAttributes<HTMLTableDataCellElement>;
                                                                            render: (
                                                                                arg0: string
                                                                            ) =>
                                                                                | boolean
                                                                                | React.ReactChild
                                                                                | React.ReactFragment
                                                                                | React.ReactPortal;
                                                                        }) => {
                                                                            return (
                                                                                <td {...cell.getCellProps()}>
                                                                                    {cell.render("Cell")}
                                                                                </td>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody> :
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={columns?.length}>
                                                                <div className="text-center full-width"><span>No Search Result</span></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>}
                                            </Table> : <div className='text-center full-width'>
                                                <span>No Approver Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details>
                                    <summary>
                                        Assigned Tasks {'(' + backupTaskArray?.AllAssignedTasks?.length + ')'}
                                    </summary>
                                    <div className='AccordionContent' style={{ maxHeight: '300px', overflow: 'auto' }} onDrop={(e: any) => handleDrop('AllTasks')}
                                        onDragOver={(e: any) => e.preventDefault()}>
                                        {AllAssignedTasks?.length > 0 ?
                                            <>
                                                <Table className={updateContent ? "SortingTable" : "SortingTable"} bordered hover {...getTablePropsAll()} >
                                                    <thead>
                                                        {headerGroupsAll?.map((headerGroup: any) => (
                                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                                {headerGroup.headers.map((column: any) => (
                                                                    <th {...column.getHeaderProps()} style={column?.style}>
                                                                        <span
                                                                            class="Table-SortingIcon"
                                                                            style={{ marginTop: "-6px" }}
                                                                            {...column.getSortByToggleProps()}
                                                                        >
                                                                            {column.render("Header")}
                                                                            {generateSortingIndicator(column)}
                                                                        </span>
                                                                        <Filter column={column} />
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </thead>
                                                    {pageAll?.length > 0 ? <tbody {...getTableBodyPropsAll()}>
                                                        {pageAll?.map((row: any) => {
                                                            prepareRowAll(row);
                                                            return (
                                                                <tr onClick={() => { selectedInlineTask = { table: "allAssignedTask", taskId: row?.original?.Id } }} className={row?.original?.Services?.length > 0 ? 'serviepannelgreena' : ''} draggable data-value={row?.original}
                                                                    onDragStart={(e) => startDrag(row?.original, row?.original.Shareweb_x0020_ID, 'AllTasks')}
                                                                    onDragOver={(e) => e.preventDefault()} key={row?.original.Id}{...row.getRowProps()}>
                                                                    {row.cells.map(
                                                                        (cell: {
                                                                            getCellProps: () => JSX.IntrinsicAttributes &
                                                                                React.ClassAttributes<HTMLTableDataCellElement> &
                                                                                React.TdHTMLAttributes<HTMLTableDataCellElement>;
                                                                            render: (
                                                                                arg0: string
                                                                            ) =>
                                                                                | boolean
                                                                                | React.ReactChild
                                                                                | React.ReactFragment
                                                                                | React.ReactPortal;
                                                                        }) => {
                                                                            return (
                                                                                <td {...cell.getCellProps()}>
                                                                                    {cell.render("Cell")}
                                                                                </td>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody> : <tbody>
                                                        <tr>
                                                            <td colSpan={columns?.length}>
                                                                <div className="text-center full-width"><span>No Search Result</span></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>}

                                                </Table>
                                                <nav>
                                                    <Pagination>
                                                        <PaginationItem>
                                                            <PaginationLink onClick={() => previousPageAll()} disabled={!canPreviousPageAll}>
                                                                <span aria-hidden={true}>
                                                                    <FaAngleLeft aria-hidden={true} />
                                                                </span>
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink>
                                                                {pageIndexAll + 1}

                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink onClick={() => nextPageAll()} disabled={!canNextPageAll}>
                                                                <span aria-hidden={true}>
                                                                    <FaAngleRight
                                                                        aria-hidden={true}

                                                                    />
                                                                </span>
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <Col md={2}>
                                                            <Input
                                                                type='select'
                                                                value={pageSizeAll}
                                                                onChange={onChangeInSelectAll}
                                                            >

                                                                {[10, 20, 30, 40, 50].map((pageSizeAll) => (
                                                                    <option key={pageSizeAll} value={pageSizeAll}>
                                                                        Show {pageSizeAll}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                        </Col>
                                                    </Pagination>
                                                </nav>
                                            </>
                                            : <div className='text-center full-width'>
                                                <span>No Assigned Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>

                            </div>
                        </article>
                    </div>
                    <div>
                        {isOpenEditPopup ? (
                            <EditTaskPopup AllListId={AllListId} Items={passdata} Call={editTaskCallBack} />
                        ) : (
                            ""
                        )}

                    </div>

                </div>
            </div>
            {pageLoaderActive ? <PageLoader /> : ''}
        </>
    )
}
export default React.memo(TaskDashboard)