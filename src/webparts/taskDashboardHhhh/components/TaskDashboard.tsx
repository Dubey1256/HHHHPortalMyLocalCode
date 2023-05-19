import * as React from 'react'
import $ from 'jquery';
import axios from 'axios';
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
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
var AllListId: any = {}
var selectedInlineTask: any = {};
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
const TaskDashboard = (props: any) => {
    const [updateContent, setUpdateContent] = React.useState(false);
    const [selectedTimeReport, setSelectedTimeReport] = React.useState('');
    const [currentView, setCurrentView] = React.useState('Home');
    const [taskTimeDetails, setTaskTimeDetails] = React.useState([]);
    const [AllSitesTask, setAllSitesTask] = React.useState([]);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [selectedUser, setSelectedUser]: any = React.useState({});
    const [passdata, setpassdata] = React.useState("");
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [openTimeEntryPopup, setOpenTimeEntryPopup] = React.useState(false);
    const [isTimeEntry, setIsTimeEntry] = React.useState(false);
    const [weeklyTimeReport, setWeeklyTimeReport] = React.useState([]);
    const [AllAssignedTasks, setAllAssignedTasks] = React.useState([]);
    const [AllBottleNeck, setAllBottleNeck] = React.useState([]);
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
    const TimeEntryCallBack = React.useCallback((item1) => {
        setOpenTimeEntryPopup(false);
    }, []);
    const EditDataTimeEntry = (e: any, item: any) => {

        setTaskTimeDetails(item);
        setOpenTimeEntryPopup(true);
    };
    React.useEffect(() => {
        try {
            isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
            isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
        } catch (error: any) {
            console.log(error)
        }
        if (props?.props?.TaskTimeSheetListID != undefined && props?.props?.TaskTimeSheetListID != '') {
            setIsTimeEntry(true)
        } else {
            setIsTimeEntry(false)
        }
        // sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
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
        if (AllListId?.isShowTimeEntry == true) {
            loadAllTimeEntry()
        }

    }, [timesheetListConfig]);
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
        displayDate.day = displayDate.fullDate.toLocaleString('en-GB', { weekday: 'long' });
        displayDate.date = displayDate.fullDate.toLocaleString('en-GB', { day: 'numeric' });
        displayDate.month = displayDate.fullDate.toLocaleString('en-GB', { month: 'long' });
        today = displayDate;
    }
    const loadAdminConfigurations = async () => {
        if (AllListId?.AdminConfigrationListID != undefined) {
            try {
                var CurrentSiteType = "";
                let web = new Web(AllListId?.siteUrl)
                await web.lists
                    .getById(AllListId?.AdminConfigrationListID)
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
        } else {
            alert("Admin Configration List Id not present")
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
        }
        return formattedDate;
    }
    //End

    //Load This Week Time Entry 
    const loadMigrationTimeEntry = async () => {
        if (timesheetListConfig?.length > 0) {
            let timesheetLists: any = [];
            let taskLists: any = [];
            let startDate = getStartingDate('This Month').toISOString();
            timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
            taskLists = JSON.parse(timesheetListConfig[0]?.Description)
            if (timesheetLists?.length > 0) {
                timesheetLists?.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    if (timesheetLists?.listName == 'TasksTimesheet2') {
                        await web.lists
                            .getById(list?.listId)
                            .items.select("Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskALAKDigital/Id,TaskALAKDigital/Title,TaskMigration/Id,TaskMigration/Title&$expand=Category,TimesheetTitle,TaskMigration,TaskALAKDigital")
                            .filter("Modified gt '" + startDate + "'")
                            .getAll().then((data: any) => {
                                data?.map((item: any) => {
                                    item.taskDetails = checkTimeEntrySite(item, taskLists)
                                    AllTaskTimeEntries.push(item)
                                })
                                currentUserTimeEntry('This Week')
                            });
                    }
                })
            }
        }
    }
    const loadAllTimeEntry = async () => {
        if (timesheetListConfig?.length > 0) {
            let timesheetLists: any = [];
            let startDate = getStartingDate('This Month').toISOString();
            let taskLists: any = [];
            timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
            taskLists = JSON.parse(timesheetListConfig[0]?.Description)
            if (timesheetLists?.length > 0) {
                timesheetLists?.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    if (timesheetLists?.listName != 'TasksTimesheet2') {
                        await web.lists
                            .getById(list?.listId)
                            .items.select('Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskHHHH/Id,TaskHHHH/Title,TaskShareweb/Id,TaskShareweb/Title,TaskEPS/Id,TaskEPS/Title,TaskQA/Id,TaskQA/Title,TaskEI/Id,TaskEI/Title,TaskOffshoreTasks/Id,TaskOffshoreTasks/Title,TaskSmallProjects/Id,TaskSmallProjects/Title&$expand=Category,TimesheetTitle,TaskHHHH,TaskShareweb,TaskEPS,TaskQA,TaskShareweb,TaskEI,TaskOffshoreTasks,TaskSmallProjects')
                            .filter("Modified gt '" + startDate + "'")
                            .getAll().then((data: any) => {
                                data?.map((item: any) => {
                                    item.taskDetails = checkTimeEntrySite(item, taskLists)
                                    AllTaskTimeEntries.push(item)
                                })
                                currentUserTimeEntry('This Week')
                            });
                    }
                })
                loadMigrationTimeEntry();
            }
        }
    }
    const checkTimeEntrySite = (timeEntry: any, sitesArray: any) => {
        let result = ''
        sitesArray?.map((site: any) => {
            if (timeEntry[site.Tasklist]?.Id != undefined) {
                result = AllTasks?.filter((task: any) => {
                    if (task?.Id == timeEntry[site.Tasklist]?.Id && task?.siteType.toLowerCase() == site.siteType.toLowerCase()) {
                        return task;
                    }
                });
                //  = getTaskDetails(timeEntry[site.Tasklist].Id, site.siteType)
            }
        })
        return result;
    }
    const currentUserTimeEntry = (start: any) => {
        setSelectedTimeReport(start)
        let startDate = getStartingDate(start);
        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        let weekTimeEntries: any = [];
        AllTaskTimeEntries?.map((timeEntry: any) => {
            if (timeEntry?.AdditionalTimeEntry != undefined) {
                let AdditionalTime = JSON.parse(timeEntry?.AdditionalTimeEntry)
                AdditionalTime?.map((filledTime: any) => {
                    let [day, month, year] = filledTime?.TaskDate?.split('/')
                    const timeFillDate = new Date(+year, +month - 1, +day)
                    // let timeFillDate = new Date(filledTime?.TaskDate);
                    // if (filledTime?.AuthorId == currentUserId && timeFillDate > startDate && timeEntry?.taskDetails != '' && timeEntry?.taskDetails != undefined) {
                    if (start == 'Today' || start == 'Yesterday') {
                        if (filledTime?.AuthorId == currentUserId && timeFillDate == startDate) {
                            let data = { ...timeEntry?.taskDetails[0] };
                            if (data == '' || data == undefined)
                                data = {};
                            data.TaskTime = filledTime?.TaskTime;
                            data.timeDate = filledTime?.TaskDate;
                            data.Description = filledTime?.Description
                            data.timeFillDate = timeFillDate;
                            weekTimeEntries.push(data);
                        }

                    } else {
                        if (filledTime?.AuthorId == currentUserId && timeFillDate >= startDate) {
                            let data = { ...timeEntry?.taskDetails[0] };
                            if (data == '' || data == undefined)
                                data = {};
                            data.TaskTime = filledTime?.TaskTime;
                            data.timeDate = filledTime?.TaskDate;
                            data.Description = filledTime?.Description
                            data.timeFillDate = timeFillDate;
                            weekTimeEntries.push(data);
                        }
                    }
                })
            }
        })
        weekTimeEntries.sort((a: any, b: any) => {
            return b.timeFillDate - a.timeFillDate;
        });
        setWeeklyTimeReport(weekTimeEntries)
        weekTimeEntry = weekTimeEntries;
    }

    //End 


    // All Sites Task
    const LoadAllSiteTasks = function () {
        loadAdminConfigurations();
        let AllSiteTasks: any = [];
        let AllBottleNeckTasks: any = [];
        let query =
            "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        let Counter = 0;
        let web = new Web(AllListId?.siteUrl);
        let arraycount = 0;
        try {
            if (currentUserId != undefined && siteConfig?.length > 0) {

                siteConfig.map(async (config: any) => {
                    if (config.Title != "SDC Sites") {
                        let smartmeta = [];
                        await web.lists
                            .getById(config.listId)
                            .items.select("ID", "Title", "Comments", "DueDate", "EstimatedTime", "EstimatedTimeDescription", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "SharewebTaskLevel1No", "SharewebTaskLevel2No", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "SharewebCategories/Id", "SharewebCategories/Title", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Body", "Priority_x0020_Rank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Services/ItemType", "Editor/Title", "Modified")
                            .expand("Team_x0020_Members", "Approver", "ParentTask", "AssignedTo", "SharewebCategories", "Author", "Responsible_x0020_Team", "SharewebTaskType", "Component", "Services", "Editor")
                            .getAll().then((data: any) => {
                                smartmeta = data;
                                smartmeta.map((task: any) => {
                                    task.AllTeamMember = [];
                                    task.siteType = config.Title;
                                    task.bodys = task.Body != null && task.Body.split('<p><br></p>').join('');
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
                                            if (site.Site?.toLowerCase() == task.siteType?.toLowerCase()) {
                                                task["siteIcon"] = site.SiteIcon;
                                            }
                                        });
                                    }
                                    if(task.siteType=="Kathabeck"){
                                        task["siteIcon"] = "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png";
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
                                    taskUsers?.map((user: any) => {
                                        if (user.AssingedToUserId == task.Author.Id) {
                                            task.createdImg = user?.Item_x0020_Cover?.Url;
                                        }
                                    })

                                    const isBottleneckTask = checkUserExistence('Bottleneck', task?.SharewebCategories);
                                    task?.Team_x0020_Members?.map((taskUser: any) => {
                                        task.TeamMembersId.push(taskUser.Id);
                                        var newuserdata: any = {};
                                        taskUsers?.map((user: any) => {
                                            if (user.AssingedToUserId == taskUser.Id) {
                                                if (user?.Title != undefined) {
                                                    task.TeamMembersSearch =
                                                        task.TeamMembersSearch + " " + user?.Title;
                                                }
                                                newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                                                newuserdata["Suffix"] = user?.Suffix;
                                                newuserdata["Title"] = user?.Title;
                                                newuserdata["UserId"] = user?.AssingedToUserId;
                                                task["Usertitlename"] = user?.Title;
                                            }
                                            task.AllTeamMember.push(newuserdata);
                                        });
                                    });
                                    if (isBottleneckTask) {
                                        AllBottleNeckTasks.push(task)
                                    }
                                    AllSiteTasks.push(task)
                                });
                                arraycount++;
                            });
                        let currentCount = siteConfig?.length;
                        if (arraycount === currentCount) {
                            AllTasks = AllSiteTasks;
                            setAllSitesTask(AllSiteTasks)
                            setAllBottleNeck(AllBottleNeckTasks)
                            const params = new URLSearchParams(window.location.search);
                            let query = params.get("UserId");
                            let userFound = false;
                            if (query != undefined && query != null && query != '') {
                                taskUsers.map((user: any) => {
                                    if (user?.AssingedToUserId == query) {
                                        userFound = true;
                                        changeSelectedUser(user)
                                    }
                                })
                                if (userFound == false) {
                                    if (confirm("User Not Found , Do you want to continue to your Dashboard?")) {
                                        filterCurrentUserTask()
                                    }
                                }
                            } else {
                                filterCurrentUserTask();
                            }
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
            childItem.UserManagerMail = [];
            childItem.UserManagerName = ''
            childItem?.Approver?.map((Approver: any, index: any) => {
                if (index == 0) {

                    childItem.UserManagerName = Approver?.Title;
                } else {
                    childItem.UserManagerName += ' ,' + Approver?.Title
                }
                let Mail = Approver?.Name?.split('|')[2]
                childItem.UserManagerMail.push(Mail)
            })
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
    const editTaskCallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
        inlineCallBack(item)
    }, []);
    const inlineCallBack = React.useCallback((item: any) => {
        AllTasks?.map((task: any, index: any) => {
            if (task?.Id == item?.Id && task?.siteType == item?.siteType) {
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
                } else if (task?.workingThisWeek && (isCurrentUserAssigned)) {
                    workingThisWeekTask.push(task)
                    alreadyPushed = true;
                } if (isBottleneckTask && (isCurrentUserAssigned)) {
                    bottleneckTask.push(task)
                    alreadyPushed = true;
                } if (!alreadyPushed && (isCurrentUserAssigned)) {
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
    const filterCurrentUserWorkingTodayTask = (UserId: any) => {
        let workingTodayTask: any = [];
        if (AllTasks?.length > 0) {
            AllTasks?.map((task: any) => {
                const isCurrentUserAssigned = task?.AssignedToIds?.includes(UserId);
                if (task?.IsTodaysTask && (isCurrentUserAssigned)) {
                    workingTodayTask.push(task)
                }
            })
        }
        return workingTodayTask;
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
                            href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                            data-interception="off"
                            target="_blank"
                        >
                            {row?.values?.Title}
                        </a>

                        {row?.original?.Body !== null && <span className="me-1">
                            <div className="popover__wrapper me-1" data-bs-toggle="tooltip" data-bs-placement="auto">
                                <span className="svg__iconbox svg__icon--info " ></span>
                                <div className="popover__content">
                                    <span>
                                        <p
                                            dangerouslySetInnerHTML={{ __html: row?.original?.bodys }}
                                        ></p>
                                    </span>
                                </div>
                            </div>
                        </span>
                        }
                    </span>
                ),
            },
            {
                internalHeader: "Site",
                accessor: 'siteType',
                id: "siteIcon", // 'id' is required
                showSortIcon: false,
                style: { width: '65px' },
                Cell: ({ row }: any) => (
                    <span>
                        {row?.original?.siteIcon != undefined ?
                            <img title={row?.original?.siteType} className="workmember" src={row?.original?.siteIcon} /> : ''}
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
                            href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
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
                    columnName="DueDate"
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
                accessor: "Created",
                showSortIcon: true,
                style: { width: "125px" },
                Cell: ({ row }: any) => (
                    <span>
                        <span className="ms-1">{row?.original?.DisplayCreateDate}</span>
                        {row?.original?.createdImg != undefined ?
                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                            : <span title={row?.original?.Author?.Title} className="svg__iconbox svg__icon--defaultUser "></span>}

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
                        className="svg__iconbox svg__icon--edit hreflink"
                    ></span>
                ),
            },
        ],
        [AllAssignedTasks, thisWeekTasks, workingTodayTasks]
    );
    const columnTimeReport = React.useMemo(
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
                    <span className="d-flex">
                        <a className='hreflink'
                            href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                            data-interception="off"
                            target="_blank"
                        >
                            {row?.values?.Title}
                        </a>
                        {
                            row?.original?.Body !== null && <span className="me-1">
                                <div className="popover__wrapper me-1" data-bs-toggle="tooltip" data-bs-placement="auto">
                                    <span className="svg__iconbox svg__icon--info " ></span>
                                    <div className="popover__content">
                                        <span>
                                            <p
                                                dangerouslySetInnerHTML={{ __html: row?.original?.bodys }}
                                            ></p>
                                        </span>
                                    </div>
                                </div>
                            </span>
                        }

                    </span>
                ),
            },
            {
                internalHeader: "Site",
                accessor: 'siteType',
                id: "siteIcon", // 'id' is required
                showSortIcon: false,
                style: { width: '65px' },
                Cell: ({ row }: any) => (
                    <span>
                        {row?.original?.siteIcon != undefined ?
                            <img title={row?.original?.siteType} className="workmember" src={row?.original?.siteIcon} /> : ''}
                    </span>
                ),
            },
            // {
            //     internalHeader: "Priority",
            //     isSorted: true,
            //     isSortedDesc: true,
            //     accessor: "Priority_x0020_Rank",
            //     style: { width: '100px' },
            //     showSortIcon: true,
            //     Cell: ({ row }: any) => (
            //         <span>
            //             <InlineEditingcolumns AllListId={AllListId} type='Task' rowIndex={row?.index} callBack={inlineCallBack} TaskUsers={taskUsers} columnName='Priority' item={row?.original} />
            //         </span>
            //     ),
            // },

            // {
            //     internalHeader: "Due Date",
            //     showSortIcon: true,
            //     accessor: "DueDate",
            //     style: { width: '80px' },
            //     Cell: ({ row }: any) => <InlineEditingcolumns
            //         AllListId={AllListId}
            //         callBack={inlineCallBack}
            //         columnName="DueDate"
            //         item={row?.original}
            //         TaskUsers={taskUsers}
            //     />,
            // },
            {
                internalHeader: "Entry Date",
                showSortIcon: true,
                accessor: "timeDate",
                style: { width: '80px' },
            },

            {
                internalHeader: "Time",
                showSortIcon: true,
                accessor: "TaskTime",
                style: { width: '65px' },
            },
            {
                internalHeader: "Description",
                showSortIcon: true,
                accessor: "Description",
                style: { width: '200px' },
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
                internalHeader: "Created",
                accessor: "Created",
                showSortIcon: true,
                style: { width: "125px" },
                Cell: ({ row }: any) => (
                    <span>
                        <span className="ms-1">{row?.original?.DisplayCreateDate}</span>
                        {row?.original?.createdImg != undefined ?
                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                            : <span title={row?.original?.Author?.Title} className="svg__iconbox svg__icon--defaultUser "></span>}
                    </span>
                ),
            },

            {
                internalHeader: "",
                id: "Id", // 'id' is required
                isSorted: false,
                style: { width: '65px' },
                showSortIcon: false,
                Cell: ({ row }: any) => (
                    <>
                        <a
                            onClick={(e) => EditDataTimeEntry(e, row.original)}
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
                        <span
                            title="Edit Task"
                            onClick={() => EditPopup(row?.original)}
                            className="svg__iconbox svg__icon--edit hreflink"
                        ></span>
                    </>

                ),
            },
        ],
        [weeklyTimeReport]
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
        getTableProps: getTablePropsTimeReport,
        getTableBodyProps: getTableBodyPropsTimeReport,
        headerGroups: headerGroupsTimeReport,
        page: pageTimeReport,
        prepareRow: prepareRowTimeReport,
        gotoPage: gotoPageTimeReport,
        setPageSize: setPageSizeTimeReport,
        state: { pageIndex: pageIndexTimeReport, pageSize: pageSizeTimeReport },
    }: any = useTable(
        {
            columns: columnTimeReport,
            data: weeklyTimeReport,
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

    const {
        getTableProps: getTablePropsAllSite,
        getTableBodyProps: getTableBodyPropsAllSite,
        headerGroups: headerGroupsAllSite,
        page: pageAllSite,
        prepareRow: prepareRowAllSite,
        gotoPage: gotoPageAllSite,
        setPageSize: setPageSizeAllSite,
        canPreviousPage: canPreviousPageAllSite,
        canNextPage: canNextPageAllSite,
        pageOptions: pageOptionsAllSite,
        pageCount: pageCountAllSite,
        nextPage: nextPageAllSite,
        previousPage: previousPageAllSite,
        state: { pageIndex: pageIndexAllSite, pageSize: pageSizeAllSite },
    }: any = useTable(
        {
            columns: columns,
            data: AllSitesTask,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    const {
        getTableProps: getTablePropsAllBottle,
        getTableBodyProps: getTableBodyPropsAllBottle,
        headerGroups: headerGroupsAllBottle,
        page: pageAllBottle,
        prepareRow: prepareRowAllBottle,
        gotoPage: gotoPageAllBottle,
        setPageSize: setPageSizeAllBottle,
        canPreviousPage: canPreviousPageAllBottle,
        canNextPage: canNextPageAllBottle,
        pageOptions: pageOptionsAllBottle,
        pageCount: pageCountAllBottle,
        nextPage: nextPageAllBottle,
        previousPage: previousPageAllBottle,
        state: { pageIndex: pageIndexAllBottle, pageSize: pageSizeAllBottle },
    }: any = useTable(
        {
            columns: columns,
            data: AllBottleNeck,
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
        let AssignedUsers = task?.AssignedToIds?.length > 0 ? task?.AssignedToIds : [];
        let postworkingThisWeekTask = task?.workingThisWeek != undefined ? task.workingThisWeek : false
        let web = new Web(task?.siteUrl);
        await web.lists.getById(task?.listId).items.getById(task?.Id).update({
            IsTodaysTask: postToday,
            workingThisWeek: postworkingThisWeekTask,
            AssignedToId: { "results": AssignedUsers }
        }).then((res: any) => {
            console.log("Drop Updated");
        })

    }
    //end
    const GetMetaData = async () => {
        if (AllListId?.SmartMetadataListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let smartmeta = [];
            let select: any = '';
            if (AllListId?.TaskTimeSheetListID != undefined && AllListId?.TaskTimeSheetListID != '') {
                select = 'Id,IsVisible,ParentID,Title,SmartSuggestions,Description,Configurations,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title'
            } else {
                select = 'Id,IsVisible,ParentID,Title,SmartSuggestions,Configurations,TaxType,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title'
            }
            let TaxonomyItems = [];
            try {
                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select(select)
                    .top(5000)
                    .filter("(TaxType eq 'Sites')or(TaxType eq 'timesheetListConfigrations')")
                    .expand("Parent")
                    .get();
                siteConfig = smartmeta.filter((data: any) => {
                    if (data?.IsVisible && data?.TaxType == 'Sites' && data?.Title != 'Master Tasks') {
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
        } else {
            alert("Smart Metadata List Id Not available")
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
        try {
            currentUserId = props?.pageContext?.legacyPageContext?.userId
            taskUsers = await loadTaskUsers();
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
            userGroups?.sort((a: any, b: any) => a.SortOrder - b.SortOrder)
            setGroupedUsers(userGroups);
            GetMetaData();
        } catch (error) {
            console.log(error)
        }

    }
    const loadTaskUsers = async () => {
        let taskUser;
        if (AllListId?.TaskUsertListID != undefined) {
            try {
                let web = new Web(AllListId?.siteUrl);
                taskUser = await web.lists
                    .getById(AllListId?.TaskUsertListID)
                    .items
                    .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
                    .get();
            }
            catch (error) {
                return Promise.reject(error);
            }
            return taskUser;
        } else {
            alert('Task User List Id not Available')
        }
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
                setSelectedUser(user);
                filterCurrentUserTask();
                currentUserTimeEntry('This Week');
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
        currentUserTimeEntry('This Week');
        setCurrentView("Home")
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
            if (destination == 'UnAssign') {
                task.IsTodaysTask = false;
                task.workingThisWeek = false;
                task.AssignedToIds = task?.AssignedToIds?.filter((user: string) => user != currentUserId)
                UpdateTaskStatus(task);
                todayTasks = todayTasks.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
                thisWeekTask = thisWeekTask.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
                allTasks = allTasks.filter(taskItem => taskItem.Shareweb_x0020_ID != dragedTask.taskId)
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

    //Shareworking Today's Task In Email
    const shareTaskInEmail = (input: any) => {
        let currentLoginUser = currentUserData?.Title;
        let CurrentUserSpace = currentLoginUser.replace(' ', '%20');
        let body: any = '';
        let text = '';
        let to: any = [];
        let body1: any = [];
        let userApprover = '';
        let tasksCopy = workingTodayTasks;
        taskUsers?.map((user: any) => {
            if (user?.Title == currentLoginUser && user?.Title != undefined) {
                to = user?.UserManagerMail;
                userApprover = user?.UserManagerName;
            }
        });
        tasksCopy.sort((a: any, b: any) => {
            return b.Priority_x0020_Rank - a.Priority_x0020_Rank;
        });
        let confirmation = confirm('Your' + ' ' + input + ' ' + 'will be automatically shared with your approver' + ' ' + '(' + userApprover + ')' + '.' + '\n' + 'Do you want to continue?')
        if (confirmation) {
            if (input == 'today working tasks') {
                var subject = currentLoginUser + '-Today Working Tasks';
                tasksCopy?.map((item: any) => {
                    let teamUsers: any = [];
                    item?.Team_x0020_Members?.map((item1: any) => {
                        teamUsers.push(item1?.Title)
                    });
                    if (item.DueDate != undefined) {
                        item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
                    }
                    if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
                        item.TaskDueDatenew = '';
                    if (item.Categories == undefined || item.Categories == '')
                        item.Categories = '';
                    if (item.EstimatedTimeDescription != undefined && item.EstimatedTimeDescription != '') {
                        item['DescriptionaAndCategory'] = JSON.parse(item.EstimatedTimeDescription)
                        item['shortDescription'] = item.DescriptionaAndCategory[0].shortDescription;
                    }
                    if (item.EstimatedTime == undefined || item.EstimatedTime == '' || item.EstimatedTime == null) {
                        item.EstimatedTime = ''
                    }


                    text =
                        '<tr>' +
                        '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.siteType + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Shareweb_x0020_ID + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + '<p style="margin-top:0px; margin-bottom:2px;font-size:14px; color:#333;">' + '<a href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px; font-weight:600">' + item.Title + '</span></a>' + '</p>' + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Categories + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.PercentComplete + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Priority_x0020_Rank + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + teamUsers + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.TaskDueDatenew + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.EstimatedTime + '</td>'
                    body1.push(text);
                });
                body =
                    '<h2>'
                    + currentLoginUser + '- Today Working Tasks'
                    + '</h2>'
                    + '<table style="border: 1px solid #ccc;" border="1" cellspacing="0" cellpadding="0" width="100%">'
                    + '<thead>'
                    + '<tr>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Site' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Task ID' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Title' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Category' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + '% Complete' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Priority' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Team' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Duedate' + '</th>'
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Estimated Time' + '</th>'
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>'
                    + body1
                    + '</tbody>'
                    + '</table>'
                    + '<p>' + 'For the complete Task Dashboard of ' + currentLoginUser + ' click the following link:' + '<a href =' + AllListId?.siteUrl + '/SitePages/TaskDashboard.aspx?UserName=' + CurrentUserSpace + '><span style="font-size:13px; font-weight:600">' + AllListId?.siteUrl + '/SitePages/TaskDashboard.aspx?UserName=' + currentLoginUser + '</span>' + '</a>' + '</p>'


            }
            body = body.replaceAll('>,<', '><')
        }

        if (body1.length > 0 && body1 != undefined) {
            if (currentUserData?.Email != undefined) {
                to.push(currentUserData?.Email)
            }
            SendEmailFinal(to, subject, body);
        } else {
            alert("No entries available");
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
                "content-type": "text/html"
            },
        }).then(() => {
            console.log("Email Sent!");

        }).catch((err) => {
            console.log(err.message);
        });
    }
    const sendAllWorkingTodayTasks = () => {


        let text = '';
        let to: any = ["ranu.trivedi@hochhuth-consulting.de"];
        let finalBody: any = [];
        let userApprover = '';

        let confirmation = confirm("Are you sure you want to share the working today task of all team members?")
        if (confirmation) {
            var subject = "Today's Working Tasks of All Team";
            groupedUsers?.map((userGroup: any) => {
                let teamsTaskBody: any = [];
                if (userGroup.Title == "Junior Developer Team" || userGroup.Title == "Senior Developer Team" || userGroup.Title == "Design Team" || userGroup.Title == "QA Team") {

                    userGroup?.childs?.map((teamMember: any) => {
                        let body: any = '';
                        let body1: any = [];
                        let tasksCopy: any = [];
                        tasksCopy = filterCurrentUserWorkingTodayTask(teamMember?.AssingedToUserId)
                        if (tasksCopy?.length > 0) {
                            tasksCopy?.map((item: any) => {
                                let teamUsers: any = [];
                                item?.Team_x0020_Members?.map((item1: any) => {
                                    teamUsers.push(item1?.Title)
                                });
                                if (item.DueDate != undefined) {
                                    item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
                                }
                                if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
                                    item.TaskDueDatenew = '';
                                if (item.Categories == undefined || item.Categories == '')
                                    item.Categories = '';
                                if (item.EstimatedTimeDescription != undefined && item.EstimatedTimeDescription != '') {
                                    item['DescriptionaAndCategory'] = JSON.parse(item.EstimatedTimeDescription)
                                    item['shortDescription'] = item.DescriptionaAndCategory[0].shortDescription;
                                }
                                if (item.EstimatedTime == undefined || item.EstimatedTime == '' || item.EstimatedTime == null) {
                                    item.EstimatedTime = ''
                                }


                                text =
                                    '<tr>' +
                                    '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.siteType + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Shareweb_x0020_ID + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + '<p style="margin-top:0px; margin-bottom:2px;font-size:14px; color:#333;">' + '<a href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px; font-weight:600">' + item.Title + '</span></a>' + '</p>' + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Categories + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.PercentComplete + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Priority_x0020_Rank + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + teamUsers + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.TaskDueDatenew + '</td>'
                                    + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.EstimatedTime + '</td>'
                                body1.push(text);
                            })
                            body =
                                '<h3>'
                                + teamMember?.Title
                                + '</h3>'
                                + '<table style="border: 1px solid #ccc;" border="1" cellspacing="0" cellpadding="0" width="100%">'
                                + '<thead>'
                                + '<tr>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Site' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Task ID' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Title' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Category' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + '% Complete' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Priority' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Team' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Duedate' + '</th>'
                                + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Estimated Time' + '</th>'
                                + '</tr>'
                                + '</thead>'
                                + '<tbody>'
                                + body1
                                + '</tbody>'
                                + '</table>'
                            body = body.replaceAll('>,<', '><')
                        } else {
                            body = '<h3>'
                                + teamMember?.Title
                                + '</h3>'
                                + '<h4>'
                                + 'No Working Today Tasks Available '
                                + '</h4>'


                        }



                        teamsTaskBody.push(body);
                    })
                    let TeamTitle = '<h2>'
                        + userGroup.Title
                        + '</h2>'
                        + teamsTaskBody
                    finalBody.push(TeamTitle)
                }
            })
            let sendAllTasks =
                '<h3>'
                + 'Please Find the Working Today Tasks of all the Team members mentioned Below.'
                + '</h3>'
                + finalBody
                + '<h3>'
                + 'Thanks And regards'
                + '</h3>'
            SendEmailFinal(to, subject, sendAllTasks);

        }


    }

    //end

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
    const onChangeInSelectAllSite = (event: any) => {
        setPageSizeAllSite(Number(event.target.value));
    };
    const onChangeInSelectAllBottle = (event: any) => {
        setPageSizeAllBottle(Number(event.target.value));
    };
    //End
    return (
        <>
            <div className='header-section justify-content-between'>
                <h2 style={{ color: "#000066", fontWeight: "600" }}>Task Dashboard</h2>
            </div>
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
                                <ul className="nav__list mb-0">
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
                                                <h5>
                                                    {today.date} {today.month}
                                                </h5>
                                            </div>
                                        </a>
                                    </li>
                                    <li id="DefaultViewSelectId" className="nav__item  pb-1 pt-0">

                                    </li>
                                </ul>
                            </nav>
                        </section>
                        <section className="sidebar__section sidebar__section--menu" onClick={() => setCurrentView('Home')}>
                            <nav className="nav__item">
                                {
                                    (currentUserId == currentUserData?.AssingedToUserId || currentUserData?.isAdmin == true) ?
                                        <>
                                            <div onDrop={(e: any) => handleDrop('UnAssign')} className="mb-2 nontag text-center drophere nav__text" onDragOver={(e: any) => e.preventDefault()}>
                                                Drop here to Un-Assign
                                            </div>
                                            {/* <a className='text-white hreflink' onClick={() => sendAllWorkingTodayTasks()}>
                                                Share Everyone Today's Task
                                            </a> */}
                                            <></>
                                        </> : ""
                                }
                                <ul className="nav__list">
                                    {currentUserData?.Title == "Ranu Trivedi" || currentUserData?.Title == "Abhishek" ?
                                        <a className='text-white hreflink' onClick={() => sendAllWorkingTodayTasks()}>
                                            Share Everyone's Today's Task
                                        </a> : ''}

                                    {groupedUsers?.map((filterItem: any, index: any) => {
                                        if (filterItem?.childs?.length > 0) {
                                            return (
                                                <li id="DefaultViewSelectId" onClick={() => toggleTeamUsers(index)} className={updateContent ? "nav__text hreflink bg-shade  mb-1 " : "nav__text bg-shade hreflink mb-1 "}>
                                                    {filterItem?.Title}
                                                    {filterItem?.expanded ? <span className='svg__iconbox svg__icon--arrowDown  float-start me-1 '></span> : <span className='svg__iconbox svg__icon--arrowRight  float-start me-1'></span>}
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
                        <section className="sidebar__section sidebar__section--menu">
                            <nav className="nav__item">
                                <ul className="nav__list ms-2" >
                                    <li id="DefaultViewSelectId" className="nav__text  ms-3 hreflink" onClick={() => { setCurrentView('allBottlenecks') }}>
                                        All Bottlenecks
                                    </li>
                                    <li id="DefaultViewSelectId" className="nav__text  ms-3 hreflink" onClick={() => { setCurrentView('allTasksView') }}>
                                        All Tasks
                                    </li>
                                </ul>
                            </nav>
                        </section>
                    </aside>
                    <div className={updateContent ? "dashboard-content ps-2 full-width" : "dashboard-content ps-2 full-width"} >
                        {currentView == 'Home' ? <article className="row">
                            {selectedUser?.Title != undefined ?
                                <div className="col-md-12 clearfix">
                                    <h5 className="d-inline-block">
                                        {`${selectedUser?.Title}'s Dashboard`}
                                    </h5>
                                    <span className='pull-right hreflink' onClick={() => unSelectUser()}>Go Back To Your Dashboard</span>
                                </div>
                                : ''}
                            <div className="col-md-12">
                                <details open onDrop={(e: any) => handleDrop('workingToday')}
                                    onDragOver={(e: any) => e.preventDefault()}>
                                    <summary> Working Today Tasks {'(' + pageToday?.length + ')'}
                                        {
                                            currentUserId == currentUserData?.AssingedToUserId ? <span className="align-autoplay d-flex float-end" onClick={() => shareTaskInEmail('today working tasks')}><span className="svg__iconbox svg__icon--mail mx-1" ></span>Share Today Working Tasks</span> : ""
                                        }</summary>
                                    <div className='AccordionContent mx-height'>
                                        {workingTodayTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover  {...getTablePropsToday()}>
                                                <thead className="fixed-Header">
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
                                <details onDrop={(e: any) => handleDrop('thisWeek')}
                                    onDragOver={(e: any) => e.preventDefault()}>
                                    <summary> Working This Week Tasks {'(' + pageWeek?.length + ')'} </summary>
                                    <div className='AccordionContent mx-height'  >
                                        {thisWeekTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover {...getTablePropsWeek()} >
                                                <thead className="fixed-Header">
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
                                    <div className='AccordionContent mx-height'  >
                                        {bottleneckTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover  {...getTablePropsBottleneck()}>
                                                <thead className="fixed-Header">
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
                                    <div className='AccordionContent mx-height'  >
                                        {assignedApproverTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover  {...getTablePropsApprover()}>
                                                <thead className="fixed-Header">
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
                                <details onDrop={(e: any) => handleDrop('AllTasks')}
                                    onDragOver={(e: any) => e.preventDefault()}>
                                    <summary>
                                        Assigned Tasks {'(' + backupTaskArray?.AllAssignedTasks?.length + ')'}
                                    </summary>
                                    <div className='AccordionContent mx-height' >
                                        {AllAssignedTasks?.length > 0 ?
                                            <>
                                                <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover {...getTablePropsAll()} >
                                                    <thead className="fixed-Header">
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
                                {
                                    ((currentUserId == currentUserData?.AssingedToUserId || currentUserData?.isAdmin == true) && isTimeEntry == true) ?
                                        <>
                                            <div>
                                                <span className='m-1'>
                                                    <input className='me-1' type="radio" value="Male" name="date" checked={selectedTimeReport == 'Yesterday'} onClick={() => currentUserTimeEntry('Yesterday')} /> Yesterday</span>
                                                <span className='m-1'>
                                                    <input className='me-1' type="radio" value="Female" name="date" checked={selectedTimeReport == 'Today'} onClick={() => currentUserTimeEntry('Today')} /> Today
                                                </span>
                                                <span className='m-1'>
                                                    <input className='me-1' type="radio" value="Other" name="date" checked={selectedTimeReport == 'This Week'} onClick={() => currentUserTimeEntry('This Week')} /> This Week
                                                </span>
                                                <span className='m-1'>
                                                    <input className='me-1' type="radio" value="Female" name="date" checked={selectedTimeReport == 'This Month'} onClick={() => currentUserTimeEntry('This Month')} /> This Month
                                                </span>
                                            </div>
                                            <details>
                                                <summary>{selectedTimeReport}'s Time Entry {'(' + pageTimeReport?.length + ')'}</summary>
                                                <div className='AccordionContent mx-height'  >
                                                    {weeklyTimeReport?.length > 0 ?
                                                        <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover  {...getTablePropsApprover()}>
                                                            <thead className="fixed-Header">
                                                                {headerGroupsTimeReport?.map((headerGroup: any) => (
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
                                                            {pageTimeReport?.length > 0 ?
                                                                <tbody {...getTableBodyPropsTimeReport}>
                                                                    {pageTimeReport?.map((row: any) => {
                                                                        prepareRowTimeReport(row);
                                                                        return (
                                                                            <tr onClick={() => { selectedInlineTask = { table: "timeEntry Task", taskId: row?.original?.Id } }}  {...row.getRowProps()} className={row?.original?.Services?.length > 0 ? 'serviepannelgreena' : ''}>
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
                                                            <span>No Time Entry Available</span>
                                                        </div>}
                                                </div>
                                            </details>
                                        </> : ''}

                            </div>
                        </article> : ''}
                        {currentView == 'allBottlenecks' ? <article className="row">
                            <div>
                                <div className='' >
                                    <div className="col-md-12 clearfix">
                                        <h5 className="d-inline-block">
                                            {`All Bottleneck Tasks - ${AllBottleNeck?.length}`}
                                        </h5>
                                        <span className='pull-right hreflink' onClick={() => setCurrentView("Home")}>Return To Home</span>
                                    </div>
                                    {AllBottleNeck?.length > 0 ?
                                        <>
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover {...getTablePropsAllBottle()} >
                                                <thead className="fixed-Header">
                                                    {headerGroupsAllBottle?.map((headerGroup: any) => (
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
                                                {pageAllBottle?.length > 0 ? <tbody {...getTableBodyPropsAllBottle()}>
                                                    {pageAllBottle?.map((row: any) => {
                                                        prepareRowAllBottle(row);
                                                        return (
                                                            <tr >
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
                                                        <PaginationLink onClick={() => previousPageAllBottle()} disabled={!canPreviousPageAllBottle}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndexAllBottle + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPageAllBottle()} disabled={!canNextPageAllBottle}>
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
                                                            value={pageSizeAllBottle}
                                                            onChange={onChangeInSelectAllBottle}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSizeAllBottle) => (
                                                                <option key={pageSizeAllBottle} value={pageSizeAllBottle}>
                                                                    Show {pageSizeAllBottle}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                </Pagination>
                                            </nav>
                                        </>
                                        : <div className='text-center full-width'>
                                            <span>No Bottleneck Tasks Available</span>
                                        </div>}
                                </div>
                            </div>
                        </article> : ''}
                        {currentView == 'allTasksView' ? <article className="row">
                            <div>
                                <div className='' >
                                    <div className="col-md-12 clearfix">
                                        <h5 className="d-inline-block">
                                            {`All Site's Tasks - ${AllSitesTask?.length}`}
                                        </h5>
                                        <span className='pull-right hreflink' onClick={() => setCurrentView("Home")}>Return To Home</span>
                                    </div>
                                    {AllSitesTask?.length > 0 ?
                                        <>
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} bordered hover {...getTablePropsAllSite()} >
                                                <thead className="fixed-Header">
                                                    {headerGroupsAllSite?.map((headerGroup: any) => (
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
                                                {pageAllSite?.length > 0 ? <tbody {...getTableBodyPropsAllSite()}>
                                                    {pageAllSite?.map((row: any) => {
                                                        prepareRowAllSite(row);
                                                        return (
                                                            <tr >
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
                                                        <PaginationLink onClick={() => previousPageAllSite()} disabled={!canPreviousPageAllSite}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndexAllSite + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPageAllSite()} disabled={!canNextPageAllSite}>
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
                                                            value={pageSizeAllSite}
                                                            onChange={onChangeInSelectAllSite}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSizeAllSite) => (
                                                                <option key={pageSizeAllSite} value={pageSizeAllSite}>
                                                                    Show {pageSizeAllSite}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                </Pagination>
                                            </nav>
                                        </>
                                        : <div className='text-center full-width'>
                                            <span>No All Sites Tasks Available</span>
                                        </div>}
                                </div>
                            </div>
                        </article> : ''}
                    </div>
                    <div>
                        {isOpenEditPopup ? (
                            <EditTaskPopup AllListId={AllListId} context={props?.props?.Context} Items={passdata} pageName="TaskDashBoard" Call={editTaskCallBack} />
                        ) : (
                            ""
                        )}

                    </div>

                </div>
            </div>
            {pageLoaderActive ? <PageLoader /> : ''}
            {openTimeEntryPopup && (<TimeEntryPopup props={taskTimeDetails} CallBackTimeEntry={TimeEntryCallBack} Context={props?.props?.Context} />)}

        </>
    )
}
export default React.memo(TaskDashboard)