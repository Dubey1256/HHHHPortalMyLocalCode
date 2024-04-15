import * as React from 'react'
import $ from 'jquery';
import { ColumnDef } from "@tanstack/react-table";
import '../../projectmanagementOverviewTool/components/styles.css'
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import "@pnp/sp/sputilities";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import * as Moment from "moment";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import PageLoader from '../../../globalComponents/pageLoader';
import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import SendEmailEODReport from './SendEmailEODReport';
import SmartPriorityToolTip from '../../../globalComponents/SmartPriorityTooltip';
var taskUsers: any = [];
var userGroups: any = [];
var siteConfig: any = [];
var AllTaskTimeEntries: any = [];
var AllTasks: any = [];
var timesheetListConfig: any = [];
var currentUserId: any = '';
let todaysDrafTimeEntry: any = [];
var RemarksData: any = []
var currentUser: any = [];
var weekTimeEntry: any = [];
var today: any = [];
var MasterListData: any = []
var MyAllData: any = []
var backupTaskArray: any = {
    AllAssignedTasks: [],
    workingTodayTasks: [],
    thisWeekTasks: [],
    bottleneckTasks: [],
    assignedApproverTasks: [],
    allTasks: []
};
var AllMetadata: any = [];
var AllListId: any = {}
var AllWorkingDayData: any = []
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
let AllLeaves: any = [];
const TaskDashboard = (props: any) => {
    const [updateContent, setUpdateContent] = React.useState(false);
    const [isSendEODReport, setisSendEODReport] = React.useState(false);
    const [selectedTimeReport, setSelectedTimeReport] = React.useState('');
    const [timeEntryTotal, setTimeEntryTotal] = React.useState(0);
    const [currentView, setCurrentView] = React.useState('Home');
    const [taskTimeDetails, setTaskTimeDetails] = React.useState([]);
    const [onLeaveEmployees, setOnLeaveEmployees] = React.useState([]);
    const [AllSitesTask, setAllSitesTask] = React.useState([]);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [selectedUser, setSelectedUser]: any = React.useState({});
    const [passdata, setpassdata] = React.useState("");
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [openTimeEntryPopup, setOpenTimeEntryPopup] = React.useState(false);
    const [isTimeEntry, setIsTimeEntry] = React.useState(false);
    const [weeklyTimeReport, setWeeklyTimeReport] = React.useState([]);
    const [sharewebTasks, setSharewebTasks] = React.useState([]);
    const [AllAssignedTasks, setAllAssignedTasks] = React.useState([]);
    const [AllImmediateTasks, setAllImmediateTasks] = React.useState([]);
    const [UserImmediateTasks, setUserImmediateTasks] = React.useState([]);
    const [AllEmailTasks, setAllEmailTasks] = React.useState([]);
    const [AllBottleNeck, setAllBottleNeck] = React.useState([]);
    const [AllPriorityTasks, setAllPriorityTasks] = React.useState([]);
    const [workingTodayTasks, setWorkingTodayTasks] = React.useState([]);
    const [thisWeekTasks, setThisWeekTasks] = React.useState([]);
    const [bottleneckTasks, setBottleneckTasks] = React.useState([]);
    const [assignedApproverTasks, setAssignedApproverTasks] = React.useState([]);
    const [value, setValue] = React.useState([]);
    const [NameTop, setNameTop] = React.useState("");
    const [groupedUsers, setGroupedUsers] = React.useState([]);
    const [sidebarStatus, setSidebarStatus] = React.useState({
        sideBarFilter: false,
        dashboard: true,
    });
    const [dragedTask, setDragedTask] = React.useState({
        task: {},
        taskId: '',
        // origin: ''
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
            isShowSiteCompostion: isShowSiteCompostion,
            SmalsusLeaveCalendar: props?.props?.SmalsusLeaveCalendar,
        }
        loadTodaysLeave();
        setPageLoader(true);
        //    loadTodaysLeave();
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
        } else if (startDateOf == 'Last Month') {
            const lastMonth = new Date(startingDate.getFullYear(), startingDate.getMonth() - 1);
            const startingDateOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            var change = (Moment(startingDateOfLastMonth).add(25, 'days').format())
            var b = new Date(change)
            formattedDate = b;
        } else if (startDateOf == 'Last Week') {
            const lastWeek = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
            const startingDateOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 1);
            formattedDate = startingDateOfLastWeek;
        }

        return formattedDate;
    }
    function getEndingDate(startDateOf: any): Date {
        const endingDate = new Date();
        let formattedDate = endingDate;

        if (startDateOf === 'This Week') {
            endingDate.setDate(endingDate.getDate() + (6 - endingDate.getDay()));
            formattedDate = endingDate;
        } else if (startDateOf === 'Today') {
            formattedDate = endingDate;
        } else if (startDateOf === 'Yesterday') {
            endingDate.setDate(endingDate.getDate() - 1);
            formattedDate = endingDate;
        } else if (startDateOf === 'This Month') {
            endingDate.setMonth(endingDate.getMonth() + 1, 0);
            formattedDate = endingDate;
        } else if (startDateOf === 'Last Month') {
            const lastMonth = new Date(endingDate.getFullYear(), endingDate.getMonth() - 1);
            endingDate.setDate(0);
            formattedDate = endingDate;
        } else if (startDateOf === 'Last Week') {
            const lastWeek = new Date(endingDate.getFullYear(), endingDate.getMonth(), endingDate.getDate() - 7);
            endingDate.setDate(lastWeek.getDate() - lastWeek.getDay() + 7);
            formattedDate = endingDate;
        }

        return formattedDate;
    }

    //End


    const loadAllTimeEntry = async () => {
        AllTaskTimeEntries = [];
        todaysDrafTimeEntry = [];
        setPageLoader(true)
        if (timesheetListConfig?.length > 0) {
            let timesheetLists: any = [];
            let startDate = getStartingDate('Last Month').toISOString();
            timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)

            if (timesheetLists?.length > 0) {
                const fetchPromises = timesheetLists.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    try {
                        let todayDateToCheck = new Date().setHours(0, 0, 0, 0,)
                        const data = await web.lists
                            .getById(list?.listId)
                            .items.select(list?.query)
                            .filter(`(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`)
                            .getAll();

                        data?.forEach((item: any) => {
                            let entryDate = new Date(item?.Modified).setHours(0, 0, 0, 0)
                            if (entryDate == todayDateToCheck) {
                                todaysDrafTimeEntry?.push(item);
                            }
                            item.taskDetails = checkTimeEntrySite(item);
                            AllTaskTimeEntries.push(item);
                        });
                        currentUserTimeEntry('This Week');
                        // console.log(todaysDrafTimeEntry);
                    } catch (error) {
                        setPageLoader(false)
                        console.log(error, 'HHHH Time');
                    }
                });
                await Promise.all(fetchPromises)
            }
        }
    }

    const checkTimeEntrySite = (timeEntry: any) => {
        let result = ''
        result = AllTasks?.filter((task: any) => {
            let site = '';
            if (task?.siteType == 'Offshore Tasks') {
                site = 'OffshoreTasks'
            } else {
                site = task?.siteType;
            }
            if (timeEntry[`Task${site}`] != undefined && task?.Id == timeEntry[`Task${site}`]?.Id) {
                return task;
            }
        });
        return result;
    }

    const currentUserTimeEntry = (start: any) => {
        setPageLoader(false)
        setPageLoader(true)
        const startDate = getStartingDate(start);
        const endDate = getEndingDate(start);
        const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
        const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));

        const { weekTimeEntries, totalTime } = AllTaskTimeEntries?.reduce(
            (acc: any, timeEntry: any) => {
                try {
                    if (timeEntry?.AdditionalTimeEntry) {
                        const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);

                        AdditionalTime?.forEach((filledTime: any) => {
                            const [day, month, year] = filledTime?.TaskDate?.split('/');
                            const timeFillDate = new Date(+year, +month - 1, +day);

                            if (
                                filledTime?.AuthorId == currentUserId &&
                                timeFillDate >= startDateMidnight &&
                                timeFillDate <= endDateMidnight &&
                                timeEntry.taskDetails[0]
                            ) {
                                const data = { ...timeEntry.taskDetails[0] } || {};
                                const taskTime = parseFloat(filledTime.TaskTime);

                                data.TaskTime = taskTime;
                                data.timeDate = filledTime.TaskDate;
                                data.Description = filledTime.Description;
                                data.timeFillDate = timeFillDate;

                                acc.weekTimeEntries.push(data);
                                acc.totalTime += taskTime;
                            }
                        });
                    }

                } catch (error) {
                    setPageLoader(false)
                }
                return acc;
            },
            { weekTimeEntries: [], totalTime: 0 }
        );
        weekTimeEntries.sort((a: any, b: any) => {
            return b.timeFillDate - a.timeFillDate;
        });
        setSelectedTimeReport(start);
        setWeeklyTimeReport(weekTimeEntries);
        setTimeEntryTotal(totalTime);
        weekTimeEntry = weekTimeEntries;
        setPageLoader(false)
    };
    const currentUserTimeEntryCalculation = () => {
        const timesheetDistribution = ['Today', 'Yesterday', 'This Week', 'This Month'];

        const allTimeCategoryTime = timesheetDistribution.reduce((totals, start) => {
            const startDate = getStartingDate(start);
            const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
            const endDate = getEndingDate(start);
            const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));

            const total = AllTaskTimeEntries?.reduce((acc: any, timeEntry: any) => {
                if (timeEntry?.AdditionalTimeEntry) {
                    const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);

                    const taskTime = AdditionalTime.reduce((taskAcc: any, filledTime: any) => {
                        const [day, month, year] = filledTime?.TaskDate?.split('/');
                        const timeFillDate = new Date(+year, +month - 1, +day);

                        if (
                            filledTime?.AuthorId == currentUserId &&
                            timeFillDate >= startDateMidnight &&
                            timeFillDate <= endDateMidnight &&
                            timeEntry.taskDetails[0]
                        ) {
                            return taskAcc + parseFloat(filledTime.TaskTime);
                        }

                        return taskAcc;
                    }, 0);

                    return acc + taskTime;
                }

                return acc;
            }, 0);

            return { ...totals, [start.toLowerCase()]: total };
        }, {
            today: 0,
            yesterday: 0,
            thisWeek: 0,
            thisMonth: 0,
        });

        return allTimeCategoryTime;
    };

    //End 


    // All Sites Task
    const LoadAllSiteTasks = async function () {
        await loadAllComponent()
        let AllSiteTasks: any = [];
        let approverTask: any = [];
        let SharewebTask: any = [];
        let AllImmediates: any = [];
        let AllEmails: any = [];
        let AllBottleNeckTasks: any = [];
        let AllPriority: any = [];
        let query =
            "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        let Counter = 0;
        let web = new Web(AllListId?.siteUrl);
        let arraycount = 0;
        try {
            if (currentUserId != undefined && siteConfig?.length > 0) {

                let smartmeta: any[] = await globalCommon?.loadAllSiteTasks(AllListId, undefined, undefined, true);
                smartmeta?.map((task: any) => {
                    try {

                        task.AllTeamMember = [];
                        let EstimatedDesc: any = [];
                        if (task?.EstimatedTimeDescription != undefined && task?.EstimatedTimeDescription != '' && task?.EstimatedTimeDescription != null) {
                            EstimatedDesc = JSON.parse(task?.EstimatedTimeDescription)
                        }
                        let workingAct:any=[]
                        if (task?.WorkingAction != undefined && task?.WorkingAction != '' && task?.WorkingAction != null) {
                            workingAct = JSON.parse(task?.WorkingAction)
                            task.WorkingAction=workingAct;
                        }
                        task.HierarchyData = [];
                        task.EstimatedTime = 0;
                        task.SmartPriority;
                        task.TaskTypeValue = '';
                        task.EstimatedTimeEntry = 0
                        task.EstimatedTimeEntryDesc = '';
                        task.projectPriorityOnHover = '';
                        task.taskPriorityOnHover = task?.PriorityRank;
                        task.showFormulaOnHover;
                        task.SmartPriority = globalCommon.calculateSmartPriority(task);
                        let estimatedDescription = ''
                        if (EstimatedDesc?.length > 0) {
                            EstimatedDesc?.map((time: any) => {
                                task.EstimatedTime += Number(time?.EstimatedTime)
                                estimatedDescription += ', ' + time?.EstimatedTimeDescription
                            })
                        }
                        if (task?.FeedBack != undefined) {
                            task.descriptionsSearch = globalCommon.descriptionSearchData(task)
                        } else {
                            task.descriptionsSearch = '';
                        }
                        // task.PercentComplete = (task.PercentComplete * 100).toFixed(2);
                        task.DisplayDueDate =
                            task.DueDate != null
                                ? Moment(task.DueDate).format("DD/MM/YYYY")
                                : "";
                        task.portfolio = {};
                        if (task?.Portfolio?.Id != undefined) {
                            task.portfolio = task?.Portfolio;
                            task.PortfolioTitle = task?.Portfolio?.Title;
                            // task["Portfoliotype"] = "Component";
                        }
                        task.TeamMembersSearch = "";
                        task.TaskID = globalCommon.GetTaskId(task);
                        if (task?.ClientCategory?.length > 0) {
                            task.ClientCategorySearch = task?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                        } else {
                            task.ClientCategorySearch = ''
                        }
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
                        task?.TeamMembers?.map((taskUser: any) => {
                            task.TeamMembersId.push(taskUser.Id);
                            var newuserdata: any = {};
                            taskUsers?.map((user: any) => {
                                if (user.AssingedToUserId == taskUser.Id) {
                                    if (user?.Title != undefined) {
                                        if(task.TeamMembersSearch?.includes(user?.Title)){
                                            task.TeamMembersSearch = task.TeamMembersSearch
                                        }
                                        else{
                                            task.TeamMembersSearch = task.TeamMembersSearch + " " + user?.Title;
                                        }
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
                        let isBottleneckTask = checkUserExistence('Bottleneck', task?.TaskCategories);
                        const isImmediate = checkUserExistence('Immediate', task?.TaskCategories);
                        const isEmailNotification = checkUserExistence('Email Notification', task?.TaskCategories);
                        const isCurrentUserApprover = task?.ApproverIds?.includes(currentUserId);
                       
                        if (task?.WorkingAction?.length > 0) {
                             task?.WorkingAction?.forEach((data:any) => {
                               if (data?.Title === "Bottleneck") {
                                isBottleneckTask=true;
                                    // data?.InformationData?.forEach((userBottleneckTasks:any) => {
                                    //      if (userBottleneckTasks?.TaggedUsers?.AssingedToUserId == currenUserAssignedToUserId) {
                                    //             // userBottleneckTasks.TaggedUsers.isBottleneck = true;
                                    //             // AllBottleNeckTasks.push(userBottleneckTasks)
                                    //             isBottleneckTask=true;
                                    //         }
                                    //   });
                                 }
                             });
                        }
  
                        if (isCurrentUserApprover && task?.PercentComplete == '1') {
                            approverTask.push(task)
                        }
                        if (isBottleneckTask) {
                            AllBottleNeckTasks.push(task)
                        }
                        if (isImmediate && task?.PercentComplete < 80) {
                            AllImmediates.push(task)
                        }
                        if (isEmailNotification && task?.PercentComplete < 80) {
                            AllEmails.push(task)
                        }
                        if (task?.ClientActivityJson != undefined) {
                            SharewebTask.push(task)
                        }
                        if (parseInt(task.PriorityRank) >= 8 && parseInt(task.PriorityRank) <= 10 && task?.PercentComplete < 80) {
                            AllPriority.push(task);
                        }
                        AllSiteTasks.push(task)
                    } catch (error) {
                        console.log(error)
                    }
                });

                setPageLoader(false);
                AllTasks = AllSiteTasks;
                backupTaskArray.assignedApproverTasks = approverTask;
                setAllPriorityTasks(sortOnCreated(AllPriority));
                setAllImmediateTasks(sortOnCreated(AllImmediates));
                setAssignedApproverTasks(sortOnCreated(approverTask));
                setAllEmailTasks(sortOnCreated(AllEmails));
                setAllSitesTask(sortOnCreated(AllSiteTasks));
                setSharewebTasks(sortOnCreated(SharewebTask));
                setAllBottleNeck(sortOnCreated(AllBottleNeckTasks));
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
                if (timesheetListConfig?.length > 0) {
                    loadAllTimeEntry()
                }

            }
        } catch (e) {
            console.log(e)
        }
    };
    const loadAllComponent = async () => {
        let web = new Web(AllListId?.siteUrl);
        MasterListData = await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "DeliverableSynonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "AdminNotes", "AdminStatus", "Background", "Help_x0020_Information", "TaskCategories/Id", "TaskCategories/Title", "PriorityRank", "Reference_x0020_Item_x0020_Json", "TeamMembers/Title", "TeamMembers/Name", "TeamMembers/Id", "Item_x002d_Image", "ComponentLink", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("ClientCategory", "ComponentCategory", "AssignedTo", "AttachmentFiles", "Author", "Editor", "TeamMembers", "TaskCategories", "Parent")
            .top(4999)
            .get().then((data) => {
                data?.forEach((val: any) => {
                    val.SmartPriority;
                    MyAllData.push(val)
                })
            }).catch((error) => {
                console.log(error)
            })
    }
    const sortOnCreated = (Array: any) => {
        Array.sort((a: any, b: any) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
        return Array;
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
        //filterCurrentUserTask();
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
        let Immediates: any = [];
        let EmailsTasks: any = [];
        let approverTask: any = [];
        if (AllTasks?.length > 0 && currentUserId != undefined && currentUserId != '') {
            AllTasks?.map((task: any) => {
                const isCurrentUserAssigned = task?.AssignedToIds?.includes(currentUserId);
                const isImmediate = checkUserExistence('Immediate', task?.TaskCategories);
                const isEmailNotfication = checkUserExistence('Email Notification', task?.TaskCategories);
                let isBottleneckTask = checkUserExistence('Bottleneck', task?.TaskCategories);
                let isBottleneckTaskNew = false;
                if (task?.WorkingAction?.length > 0) {
                    task?.WorkingAction?.forEach((data:any) => {
                      if (data?.Title === "Bottleneck") {
                       
                           data?.InformationData?.forEach((userBottleneckTasks:any) => {
                                if (userBottleneckTasks?.TaggedUsers?.AssingedToUserId == currentUserId) {
                                       // userBottleneckTasks.TaggedUsers.isBottleneck = true;
                                       // AllBottleNeckTasks.push(userBottleneckTasks)
                                       isBottleneckTaskNew=true;
                                   }
                             });
                        }
                    });
               }

                // Testing Only Please Remove Before deployement
                // const isCurrentUserApprover = task?.ApproverIds?.includes(currentUserId);
                // if ((isCurrentUserAssigned) && task?.PercentComplete == '1') {
                //     approverTask.push(task)
                // }
                //


                let alreadyPushed = false;
                if (task?.IsTodaysTask && (isCurrentUserAssigned)) {
                    workingTodayTask.push(task)
                    alreadyPushed = true;
                } else if (task?.workingThisWeek && (isCurrentUserAssigned)) {
                    workingThisWeekTask.push(task)
                    alreadyPushed = true;
                } if ((isBottleneckTask && (isCurrentUserAssigned))||isBottleneckTaskNew ) {
                    bottleneckTask.push(task)
                    alreadyPushed = true;
                } if (!alreadyPushed && (isCurrentUserAssigned)) {
                    AllAssignedTask.push(task)
                    alreadyPushed = true;
                }
                if (isImmediate && (isCurrentUserAssigned)) {
                    Immediates.push(task)
                }
                if (isEmailNotfication && (isCurrentUserAssigned)) {
                    EmailsTasks.push(task)
                }


            })
        }

        // // Testing Only Please Remove Before deployement
        // setAssignedApproverTasks(sortOnCreated(approverTask));
        // //

        backupTaskArray.AllAssignedTasks = AllAssignedTask;
        backupTaskArray.workingTodayTasks = workingTodayTask;
        backupTaskArray.thisWeekTasks = workingThisWeekTask;
        backupTaskArray.bottleneckTasks = bottleneckTask;
        setAllAssignedTasks(sortOnCreated(AllAssignedTask));
        setUserImmediateTasks(sortOnCreated(Immediates))
        setWorkingTodayTasks(sortOnCreated(workingTodayTask))
        setThisWeekTasks(sortOnCreated(workingThisWeekTask))
        setBottleneckTasks(sortOnCreated(bottleneckTask))
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
    const columnsName: any = React.useMemo<ColumnDef<any, any>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCustomExpanded: false,
                hasExpanded: false,
                size: 10,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "ID",
                id: "TaskID",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
                cell: ({ row }) => (
                    <div draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        <>
                            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesTask} AllListId={AllListId} />
                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row }: any) => (
                    <div draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        <a className='hreflink'
                            href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                            data-interception="off"
                            target="_blank"
                        >
                            {row?.original?.Title}
                        </a>
                        {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} /></span>}
                    </div>
                ),

                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <span >
                        {row?.original?.SiteIcon != undefined ?
                            <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                    </span>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.PortfolioTitle,
                cell: ({ row }: any) => (
                    <div draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        <a className='hreflink' data-interception="off"
                            target="blank"
                            href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
                        >
                            {row?.original?.portfolio?.Title}
                        </a>
                    </div>
                ),
                id: "PortfolioTitle",
                placeholder: "PortfolioTitle",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.ClientCategorySearch,
                placeholder: "Client Category",
                id: "ClientCategorySearch",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 100,
                cell: ({ row }: any) => (
                    <div draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />

                    </div>
                ),
            },
            {

                accessorFn: (row) => row?.PriorityRank,
                id: "PriorityRank",
                placeholder: "Priority",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 90,
                cell: ({ row }: any) => (
                    <div draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        <InlineEditingcolumns AllListId={AllListId} type='Task' rowIndex={row?.index} callBack={inlineCallBack} TaskUsers={taskUsers} columnName='Priority' item={row?.original} />
                        {row?.original?.priorityRank}
                    </div>
                ),
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.PriorityRank?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.PriorityRank.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }

                },
            },
            {
                accessorFn: (row) => row?.SmartPriority,
                cell: ({ row }: any) => row?.original?.SmartPriority !== null && (
                    <SmartPriorityToolTip smartPriority={row?.original?.SmartPriority} hoverFormula={row?.original?.showFormulaOnHover} />
                ),
                filterFn: (row: any, columnId: any, filterValue: any) => {

                    if ((row?.original?.SmartPriority?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.SmartPriority.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                id: "SmartPriority",
                placeholder: "Smart Priority",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.DisplayDueDate,

                cell: ({ row }: any) =>
                    <div draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        {row?.original?.DisplayDueDate}
                    </div>
                , filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },

                id: "DisplayDueDate",
                placeholder: "Due Date",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
                cell: ({ row }: any) => (
                    <div draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        {row?.original?.EstimatedTime != undefined ? row?.original?.EstimatedTime : ''}
                    </div>
                ),
                filterFn: (row: any, columnId: any, filterValue: any) => {

                    if ((row?.original?.EstimatedTime?.toString().charAt(0) == filterValue.toString().charAt(0)) &&
                        (row?.original?.EstimatedTime.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },

            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='PercentComplete' TaskUsers={taskUsers} item={row?.original} />
                        {/* {row?.original?.PercentComplete} */}
                    </span>

                ),
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.PercentComplete?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.PercentComplete.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55
            },
            {

                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }: any) => (
                    <>
                        <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='Team' item={row?.original} TaskUsers={taskUsers} />

                    </>

                ),
                id: "TeamMembersSearch",
                placeholder: "Team Members",
                header: " ",
                resetColumnFilters: false,
                resetSorting: false,
                size: 60


            },
            {
                accessorFn: (row) => row?.DisplayCreateDate,
                cell: ({ row, getValue }) => (
                    <span draggable onDragStart={() => startDrag(row?.original, row?.original?.TaskID)}>
                        <span className="ms-1">{row?.original?.DisplayCreateDate}</span>
                        {row?.original?.createdImg != undefined ?
                            <>
                                <a href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`} target="_blank"
                                    data-interception="off" >
                                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                                </a>
                            </>
                            : <span title={row?.original?.Author?.Title} className="svg__iconbox svg__icon--defaultUser grey "></span>}
                    </span>
                ),
                id: "DisplayCreateDate",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                placeholder: "Created",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 125,
            },

            {
                accessorKey: "",
                id: "EditPopup", // 'id' is required
                isSorted: false,
                showSortIcon: false,
                cell: ({ row }: any) => (
                    <span
                        title="Edit Task"
                        onClick={() => EditPopup(row?.original)}
                        className="alignIcon svg__iconbox svg__icon--edit hreflink"
                    ></span>
                ),
            },
        ],
        [AllAssignedTasks, workingTodayTasks, thisWeekTasks]
    );
    const columnTimeReport: any = React.useMemo<ColumnDef<any, any>[]>(
        () => [


            {
                accessorKey: "TaskID",
                placeholder: "Id",
                id: "TaskID",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
                cell: ({ row }) => (
                    <div>
                        <>
                            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesTask} />
                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <span>
                        {row?.original?.SiteIcon != undefined ?
                            <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                    </span>
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
                        <a className='hreflink'
                            href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                            data-interception="off"
                            target="_blank"
                        >
                            {row?.original?.Title}
                        </a>
                        {row?.original?.descriptionsSearch !== null && <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
                        }
                    </div>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.timeDate,
                cell: ({ row, getValue }) => (
                    <>
                        <span>
                            {row?.original?.timeDate}
                        </span>
                    </>

                ),
                id: "timeDate",
                placeholder: "Entry Date",
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,
                header: "",
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
                accessorFn: (row) => row?.TaskTime,
                cell: ({ row, getValue }) => (
                    <>
                        <span>
                            {row?.original?.TaskTime}
                        </span>
                    </>

                ),
                id: "TaskTime",
                placeholder: "Time",
                resetColumnFilters: false,
                resetSorting: false,
                size: 65,
                header: "",
            },
            {
                accessorFn: (row) => row?.Description,
                cell: ({ row, getValue }) => (
                    <>
                        <div
                            className="column-description"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {row?.original?.Description}
                        </div>
                    </>

                ),
                id: "Description",
                placeholder: "Description",
                resetColumnFilters: false,
                resetSorting: false,
                size: 200,
                header: "",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span>
                        {row?.original?.PercentComplete}
                        {/* <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='PercentComplete' TaskUsers={taskUsers} item={row?.original} /> */}
                    </span>

                ),
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if ((row?.original?.PercentComplete?.toString().charAt(0) == filterValue.toString().charAt(0))
                        && (row?.original?.PercentComplete.toString())?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }

                },
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55
            },
            {
                accessorFn: (row) => row?.DisplayCreateDate,
                cell: ({ row, getValue }) => (
                    <span>
                        <span className="ms-1">{row?.original?.DisplayCreateDate}</span>
                        {row?.original?.createdImg != undefined ?
                            <>
                                <a href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`} target="_blank"
                                    data-interception="off" >
                                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                                </a>
                            </>
                            : <span title={row?.original?.Author?.Title} className="svg__iconbox svg__icon--defaultUser grey "></span>}
                    </span>
                ),
                id: "DisplayCreateDate",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                placeholder: "Created",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 125,
            },
            {
                cell: ({ row }) => (
                    <>
                        <a
                            onClick={(e) => EditDataTimeEntry(e, row.original)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="auto"
                            title="Click To Edit Timesheet"
                        >
                            <span
                                className="alignIcon  svg__iconbox svg__icon--clock"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="Click To Edit Timesheet"
                            ></span>
                        </a>
                        <span
                            title="Edit Task"
                            onClick={() => EditPopup(row?.original)}
                            className="alignIcon  svg__iconbox svg__icon--edit hreflink"
                        ></span>
                    </>
                ),
                id: 'EditPopup',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 65,
            }
        ],
        []
    );
    const handleMouseEnter = (event: any) => {
        const target = event.target;
        const hasOverflow = target.scrollWidth > target.clientWidth;

        if (hasOverflow) {
            target.style.whiteSpace = 'normal';
            target.style.overflow = 'visible';
            target.style.textOverflow = 'unset';
        }
    };

    const handleMouseLeave = (event: any) => {
        const target = event.target;
        target.style.whiteSpace = 'nowrap';
        target.style.overflow = 'hidden';
        target.style.textOverflow = 'ellipsis';
    };


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
                select = 'Id,IsVisible,ParentID,Title,SmartSuggestions,Description,Configurations,TaxType,Description1,Item_x005F_x0020_Cover,Color_x0020_Tag,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title'
            } else {
                select = 'Id,IsVisible,ParentID,Title,SmartSuggestions,Configurations,TaxType,Item_x005F_x0020_Cover,Color_x0020_Tag,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title'
            }
            let TaxonomyItems = [];
            try {
                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select(select)
                    .top(5000)
                    .expand("Parent")
                    .get();
                AllMetadata = smartmeta;
                siteConfig = smartmeta.filter((data: any) => {
                    if (data?.IsVisible && data?.TaxType == 'Sites' && data?.Title != 'Master Tasks' && data?.listId != undefined && data?.listId?.length > 32) {
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
            userGroups = [];
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
                    .select("Id,UserGroupId,TimeCategory,Suffix,IsActive,Title,Email,SortOrder,Role,showAllTimeEntry,Company,Group,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
                    .filter('IsActive eq 1')
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
            if (childItem?.UserGroupId != undefined && parseInt(childItem?.UserGroupId) == item.ID) {
                item.childs.push(childItem);
            }
        })
        item.childs.sort((a: any, b: any) => {
            const titleA = a.Title.toLowerCase();
            const titleB = b.Title.toLowerCase();

            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });
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
        if (currentUserId == currentUserData?.AssingedToUserId || currentUserData?.showAllTimeEntry == true) {
            let todayTasks = workingTodayTasks;
            let thisWeekTask = thisWeekTasks;
            let allTasks = AllAssignedTasks;
            let task: any = dragedTask.task;
            if (destination == 'thisWeek' && (task?.workingThisWeek == false || task?.workingThisWeek == undefined)) {
                task.IsTodaysTask = false;
                task.workingThisWeek = true;
                UpdateTaskStatus(task);
                thisWeekTask.push(task)
                todayTasks = todayTasks.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
                allTasks = allTasks.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
            }
            if (destination == 'workingToday' && (task?.IsTodaysTask == false || task?.IsTodaysTask == undefined)) {
                task.IsTodaysTask = true;
                task.workingThisWeek = false;
                UpdateTaskStatus(task);
                todayTasks.push(task)
                thisWeekTask = thisWeekTask.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
                allTasks = allTasks.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
            }
            if (destination == 'AllTasks' && (task?.IsTodaysTask == true || task?.workingThisWeek == true)) {
                task.IsTodaysTask = false;
                task.workingThisWeek = false;
                UpdateTaskStatus(task);
                todayTasks = todayTasks.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
                thisWeekTask = thisWeekTask.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
            }
            if (destination == 'UnAssign') {
                task.IsTodaysTask = false;
                task.workingThisWeek = false;
                task.AssignedToIds = task?.AssignedToIds?.filter((user: string) => user != currentUserId)
                UpdateTaskStatus(task);
                todayTasks = todayTasks.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
                thisWeekTask = thisWeekTask.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
                allTasks = allTasks.filter(taskItem => taskItem.TaskID != dragedTask.taskId)
            }

            setAllAssignedTasks([...allTasks]);
            setThisWeekTasks([...thisWeekTask]);
            setWorkingTodayTasks([...todayTasks]);

        } else {
            alert('This Drop Is Not Allowed')
        }

    }
    const startDrag = (task: any, taskId: any) => {
        let taskDetails = {
            task: task,
            taskId: taskId,
            // origin: origin
        }
        setDragedTask(taskDetails)
        console.log(task, origin);
    }
    //region end

    // People on Leave Today //
    const toIST = (dateString: any, isEndDate: boolean, isFirstHalf: boolean, isSecondHalf: boolean) => {
        const date = new Date(dateString);
        if ((isFirstHalf !== undefined && isSecondHalf != undefined) && (isEndDate || isFirstHalf || isSecondHalf)) {
            date.setHours(date.getHours() - 5);
            date.setMinutes(date.getMinutes() - 30);
        }
        const formattedDate = date.toISOString().substring(0, 19).replace('T', ' ');
        return formattedDate;
    };

    const loadTodaysLeave = async () => {
        if (AllListId?.SmalsusLeaveCalendar?.length > 0) {
            let startDate: any = getStartingDate('Today');
            startDate = new Date(startDate).setHours(0, 0, 0, 0)
            const web = new Web(AllListId?.siteUrl);
            const results = await web.lists
                .getById(AllListId?.SmalsusLeaveCalendar)
                .items.select(
                    "RecurrenceData,Duration,Author/Title,Editor/Title,Name,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,HalfDay,HalfDayTwo"
                )
                .expand("Author,Editor,Employee")
                .top(5000)
                .getAll();
            results?.map((emp: any) => {
                emp.leaveStart = toIST(emp?.EventDate, false, emp?.HalfDay, emp?.HalfDayTwo)
                emp.leaveStart = new Date(emp?.leaveStart).setHours(0, 0, 0, 0)
                emp.leaveEnd = toIST(emp?.EndDate, true, emp?.HalfDay, emp?.HalfDayTwo);
                emp.leaveEnd = new Date(emp?.leaveEnd).setHours(0, 0, 0, 0)
                if ((startDate >= emp?.leaveStart && startDate <= emp?.leaveEnd) && (emp?.HalfDay !== null && emp?.HalfDayTwo !== null) && (emp?.HalfDay != true && emp?.HalfDayTwo != true)) {
                    AllLeaves.push(emp?.Employee?.Id);
                }
            })
            setOnLeaveEmployees(AllLeaves)
            console.log(AllLeaves);
        }
    }
    //End

    //Shareworking Today's Task In Email


    const sendEmail = () => {
        let tasksCopy: any = [];
        let newData: any = [];
        var dataa: any = []
        let taskUsersGroup = groupedUsers;
        let confirmation = confirm("Are you sure you want to share the working today task of all team members?")
        if (confirmation) {
            var subject = "Today's Working Tasks of All Team";
            taskUsersGroup?.map((userGroup: any) => {
                let teamsTaskBody: any = [];
                if (userGroup.Title == "Junior Developer Team" || userGroup.Title == "Senior Developer Team" || userGroup.Title == "Design Team" || userGroup.Title == "QA Team" || userGroup.Title == "Smalsus Lead Team" || userGroup.Title == "Business Analyst") {
                    if (userGroup.Title == "Smalsus Lead Team") {
                        userGroup.childBackup = userGroup?.childs;
                        userGroup.childs = [];
                        userGroup?.childBackup?.map((user: any) => {
                            if (user?.Title == 'Ranu Trivedi') {
                                userGroup.childs.push(user);
                            }
                        })
                    }
                    userGroup?.childs?.map((teamMember: any) => {
                        if (!onLeaveEmployees.some((emp: any) => emp == teamMember?.AssingedToUserId)) {
                            tasksCopy = filterCurrentUserWorkingTodayTask(teamMember?.AssingedToUserId)
                            tasksCopy?.forEach((val: any) => {
                                newData.push(val)
                            })
                        }
                    })

                }
            })


        }


        newData?.forEach((item: any) => {
            item.TeamMember = ''
            item.Category = ''
            item.NewJSONData = []
            item.EODData = []


            if (item.Title != undefined) {
                item.Title = item.Title?.replace(/<[^>]*><p>/g, '')
            }
            if (item.FeedBack != undefined) {
                item.FeedBackJSONData = JSON.parse(item.FeedBack)
            }
            if (item.FeedBackJSONData != undefined) {
                item.FeedBackJSONData[0]?.FeedBackDescriptions?.forEach((items: any) => {
                    items.Title?.replace(/<[^>]*><p>/g, '')
                    item.NewJSONData.push(items)
                })
            }
            if (item.TeamMembers != undefined) {
                item?.TeamMembers.forEach((val: any) => {
                    item.TeamMember += val.Title + ';'
                })
            }

            if (item.TaskCategories != undefined) {
                item?.TaskCategories.forEach((val: any) => {
                    item.Category += val.Title + ';'
                })
            }
            if (item.Body == null) {
                item.Body = ''
            }
            item.NewJSONData?.forEach((ele: any) => {
                let data: any = {}
                if (ele?.Completed == true) {
                    data['subTitle'] = ele?.Title?.replaceAll(/<[^>]*><p>/g, '')
                    data['subCompleted'] = ele?.Completed
                    data['subDeployed'] = ele?.Deployed
                    data['subQAReviews'] = ele?.QAReviews
                    data['subInProgress'] = ele?.InProgress
                    data['subRemarks'] = ele?.Remarks
                    data['subChild'] = ele?.Subtext
                    data['Title'] = item?.Title
                    data['TaskID'] = item?.TaskID
                    data['Category'] = item?.Category
                    data['TeamMember'] = item?.TeamMember
                    data['PercentComplete'] = item?.PercentComplete
                    data['siteUrl'] = item?.siteUrl
                    data['Id'] = item?.Id
                    item.EODData.push(data)
                }


            })

            RemarksData.push(item)
        })
        RemarksData?.forEach((item: any) => {
            item?.EODData.forEach((val: any) => {
                val.subChilds = []
                if (val.subRemarks != undefined && val.subRemarks != '') {
                    val.subChilds.push(val)
                }
            })

        })
        RemarksData?.forEach((item: any) => {
            item?.EODData?.forEach((val: any) => {
                if (val.subCompleted == true) {
                    val.subDeployed = true
                    val.subQAReviews = true
                    val.subInProgress = true
                    AllWorkingDayData.push(val)
                }
            })

        })
        AllWorkingDayData?.forEach((val: any) => {
            val.subChilds?.forEach((ele: any) => {
                if (ele.subCompleted == true && ele.subRemarks != undefined && ele.subRemarks != '') {
                    ele.subTitle = ele?.Title;
                    ele.subCompleted = true
                    ele.subDeployed = true
                    ele.subQAReviews = true
                    ele.subInProgress = true

                }
            })
        })

        setisSendEODReport(true)

    }
    const closeEODReport = () => {
        setisSendEODReport(false)
    }

    const shareTaskInEmail = (input: any, day: any) => {

        let currentLoginUser = currentUserData?.Title;
        let CurrentUserSpace = currentLoginUser.replace(' ', '%20');
        let currentDate = Moment(new Date()).format("DD/MM/YYYY")
        today = new Date();
        const yesterdays = new Date(today.setDate(today.getDate() - 1))
        const yesterday = Moment(yesterdays).format("DD/MM/YYYY")
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
            return b.PriorityRank - a.PriorityRank;
        });
        let confirmation = confirm('Your' + ' ' + input + ' ' + 'will be automatically shared with your approver' + ' ' + '(' + userApprover + ')' + '.' + '\n' + 'Do you want to continue?')
        if (confirmation) {
            if (input == 'today working tasks') {
                let totalTime = 0;
                var subject = currentLoginUser + '-Today Working Tasks';
                let Currentdate = new Date(); // Use your JavaScript Date object here
                let CurrentformattedDate = Moment(Currentdate).format('YYYY-MM-DD');
                tasksCopy?.map((item: any) => {
                    let teamUsers: any = [];
                    item?.TeamMembers?.map((item1: any) => {
                        teamUsers.push(item1?.Title)
                    });
                    if (item.DueDate != undefined) {
                        item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
                    }
                    if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
                        item.TaskDueDatenew = '';
                    if (item.Categories == undefined || item.Categories == '')
                        item.Categories = '';
                    if (todaysDrafTimeEntry?.length > 0) {
                        todaysDrafTimeEntry?.map((value: any) => {
                            let entryDetails: any = [];
                            try {
                                entryDetails = JSON.parse(value.AdditionalTimeEntry)
                            } catch (e) {

                            }
                            if (entryDetails?.length > 0 && value[`Task${item?.siteType}`] != undefined && value[`Task${item?.siteType}`].Id == item?.Id) {
                                entryDetails?.map((timeEntry: any) => {
                                    let parts = timeEntry?.TaskDate?.split('/');
                                    let timeEntryDate: any = new Date(parts[2], parts[1] - 1, parts[0]);
                                    if (timeEntryDate?.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0) && timeEntry?.AuthorId == currentUserData?.AssingedToUserId) {
                                        item.EstimatedTimeEntryDesc += ' ' + timeEntry?.Description
                                        item.EstimatedTimeEntry += parseFloat(timeEntry?.TaskTime)
                                        totalTime += Number(timeEntry?.TaskTime)
                                    }
                                })


                            }
                        })
                    }
                    text =
                        `<tr>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item?.siteType} </td>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.TaskID} </td>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"><p style="margin:0px; color:#333;"><a style="text-decoration: none;" href =${item?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.Id}&Site=${item?.siteType}> ${item?.Title} </a></p></td>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Categories} </td>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item?.PercentComplete} </td>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.SmartPriority != undefined ? item.SmartPriority : ''} </td>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item?.EstimatedTimeEntry} </td>
                        <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px; border-right:0px"> ${item.EstimatedTimeEntryDesc} </td>
                        </tr>`
                    body1.push(text);
                });
                body =
                    '<h2>'
                    + currentLoginUser + '- Today Working Tasks'
                    + '</h2>'
                    + ` <table cellpadding="0" cellspacing="0" align="left" width="100%" border="1" style=" border-color: #444;margin-bottom:10px">
                    <thead>
                    <tr>
                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Site</th>
                    <th width="60" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;x">Task ID</th>
                    <th width="400" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Title</th>
                    <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Category</th>
                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">% </th>
                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Smart Priority</th>
                    <th width="70" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px" >Est Time</th>
                    <th height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px; border-right:0px" >Est Desc.</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${body1}
                    </tbody>
                    </table>`
                    + '<p>' + 'For the complete Task Dashboard of ' + currentLoginUser + ' click the following link:' + '<a href =' + `${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=` + currentUserId + '><span style="font-size:13px; font-weight:600">' + `${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=` + currentUserId + '</span>' + '</a>' + '</p>'

                subject = `[Todays Working Tasks - ${currentLoginUser}] ${CurrentformattedDate}: ${tasksCopy?.length} Tasks; ${totalTime}hrs scheduled`
            }

            body = body.replaceAll('>,<', '><').replaceAll(',', '')
        }
        if (input == 'today time entries') {
            // var subject = currentLoginUser + `- ${selectedTimeReport} Time Entries`;
            let timeSheetData: any = currentUserTimeEntryCalculation();

            var updatedCategoryTime: any = {};
            for (const key in timeSheetData) {
                if (timeSheetData.hasOwnProperty(key)) {
                    let newKey = key;

                    // Replace 'this month' with 'thisMonth'
                    newKey = newKey.replace('this month', 'thisMonth');

                    // Replace 'this week' with 'thisWeek'
                    newKey = newKey.replace('this week', 'thisWeek');

                    updatedCategoryTime[newKey] = timeSheetData[key];
                }
            }
            if (day == 'Today') {
                var subject = "Daily Timesheet - " + currentLoginUser + ' - ' + currentDate + ' - ' + (updatedCategoryTime.today) + ' hours '
            }
            if (day == 'Yesterday') {
                var subject = "Daily Timesheet - " + currentLoginUser + ' - ' + yesterday + ' - ' + (updatedCategoryTime.yesterday) + ' hours '
            }

            weeklyTimeReport.map((item: any) => {
                item.ClientCategories = ''
                item.ClientCategory.forEach((val: any, index: number) => {
                    item.ClientCategories += val.Title;

                    // Add a comma only if it's not the last item
                    if (index < item.ClientCategory.length - 1) {
                        item.ClientCategories += '; ';
                    }
                });


                text =
                    '<tr>' +
                    '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:40px;text-align:center">' + item?.siteType + '</td>'
                    + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:250px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/Project-Management.aspx?ProjectId=' + item.Project?.Id + '><span style="font-size:13px">' + (item?.Project == undefined ? '' : item?.Project.Title) + '</span></a>' + '</p>' + '</td>'
                    + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:135px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/Portfolio-Profile.aspx?taskId=' + item?.Portfolio?.Id + '><span style="font-size:13px">' + (item.Portfolio == undefined ? '' : item.Portfolio.Title) + '</span></a>' + '</p>' + '</td>'

                    + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:250px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px">' + item.Title + '</span></a>' + '</p>' + '</td>'
                    + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:40px;text-align:center">' + item?.TaskTime + '</td>'
                    + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;text-align:center">' + item?.Description + '</td>'
                    + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:120px;text-align:center">' + (item?.SmartPriority !== undefined ? item?.SmartPriority : '') + '</td>'
                    + '<td style="border:1px solid #ccc;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:130px;text-align:center">' + item.ClientCategories + '</td>'

                body1.push(text);

            });
            body =
                `<table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
             <thead>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Username: </td><td style="padding: 5px 0px;"> <a style="text-decoration:none;" href='${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${currentUserId}'>${currentLoginUser}</a></td></tr>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Total hours ${day} :</td><td style="padding: 5px 0px;">${day == 'Today' ? updatedCategoryTime.today : updatedCategoryTime.yesterday} Hours</td></tr>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Total hours this week :</td><td style="padding: 5px 0px;">${updatedCategoryTime.thisWeek} Hours</td></tr>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600;padding: 5px 0px;width: 210px;">Total hours this month :</td><td style="padding: 5px 0px;">${updatedCategoryTime.thisMonth} Hours</td></tr>
             <tr valign="middle" style="font-size:15px;"><td colspan="2" style="padding: 5px 0px;"><a style="text-decoration:none;" href ='${AllListId?.siteUrl}/SitePages/UserTimeEntry.aspx?userId=${currentUserId}'>Click here to open Online-Timesheet</a></td></tr>
             </thead>
             </table> `
                + '<table style="margin-top:20px;" cellspacing="0" cellpadding="0" width="100%" border="0">'
                + '<thead>'
                + '<tr>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;width:40px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Site' + '</th>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;width:250px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Project Title' + '</th>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;width:135px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Component' + '</th>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;width:250px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Task Name' + '</th>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;width:40px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Time' + '</th>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Time Entry Description' + '</th>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;width:120px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Smart Priority' + '</th>'
                + '<th style="line-height:24px;font-size:15px;padding:5px;width:130px;border:1px solid #ccc;" bgcolor="#f5f5f5">' + 'Client Category' + '</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr>'
                + body1
                + '</tr>'
                + '</tbody>'
                + '</table>'

            body = body.replaceAll('>,<', '><').replaceAll(',', '')
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
                "content-type": "text/html",
                'Reply-To': 'abhishek.tiwari@smalsus.com'
            },
        }).then(() => {
            console.log("Email Sent!");

        }).catch((err) => {
            console.log(err.message);
        });



    }
    const sendAllWorkingTodayTasks = () => {
        let text = '';
        let to: any = ["ranu.trivedi@hochhuth-consulting.de", "prashant.kumar@hochhuth-consulting.de", "abhishek.tiwari@hochhuth-consulting.de", "deepak@hochhuth-consulting.de"];
       // let to: any = ["prashant.kumar@hochhuth-consulting.de", "abhishek.tiwari@hochhuth-consulting.de"];
        let finalBody: any = [];
        let userApprover = '';
        let taskCount = 0;
        let estimatedTimeUsersCount = 0;
        let taskUsersGroup = groupedUsers;
        let totalTime = 0;
        let confirmation = confirm("Are you sure you want to share the working today task of all team members?")
        if (confirmation) {
            var subject = `Today's Working Tasks of All Team Members: ${Moment(new Date()).zone('Asia/Kolkata').format('DD/MM/YYYY')}`;
            taskUsersGroup?.map((userGroup: any) => {
                let teamsTaskBody: any = [];
                if (userGroup.Title == "Junior Developer Team" || userGroup.Title == "Senior Developer Team" || userGroup.Title == "Mobile Team" || userGroup.Title == "Design Team" || userGroup.Title == "QA Team" || userGroup.Title == "Smalsus Lead Team" || userGroup.Title == "Business Analyst" || userGroup.Title == "Trainees") {
                    if (userGroup.Title == "Smalsus Lead Team") {
                        userGroup.childBackup = userGroup?.childs;
                        userGroup.childs = [];
                        userGroup?.childBackup?.map((user: any) => {
                            if (user?.Title == 'Ranu Trivedi') {
                                userGroup.childs.push(user);
                            }
                        })
                    }
                    userGroup?.childs?.map((teamMember: any) => {
                        if (!onLeaveEmployees.some((emp: any) => emp == teamMember?.AssingedToUserId)) {
                            if (userGroup.Title == "Junior Developer Team" || userGroup.Title == "Senior Developer Team" || userGroup.Title == "Mobile Team" || userGroup.Title == "Design Team" || userGroup.Title == "Smalsus Lead Team" || userGroup.Title == "Trainees") {
                                estimatedTimeUsersCount+=1;
                            }
                            let body: any = '';
                            let body1: any = [];
                            let tasksCopy: any = [];
                            let UserTotalTime = 0 
                            tasksCopy = filterCurrentUserWorkingTodayTask(teamMember?.AssingedToUserId)
                            if (tasksCopy?.length > 0) {
                                tasksCopy = tasksCopy?.sort((a: any, b: any) => {
                                    return b?.SmartPriority - a?.SmartPriority;
                                });
                                tasksCopy?.map((item: any) => {
                                    taskCount+=1;
                                    let teamUsers: any = [];
                                    item?.AssignedTo?.map((item1: any) => {
                                        teamUsers.push(item1?.Title)
                                    });
                                    if (item.DueDate != undefined) {
                                        item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
                                    }
                                    if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
                                        item.TaskDueDatenew = '';
                                    if (item.Categories == undefined || item.Categories == '')
                                        item.Categories = '';
                                
                                    let EstimatedTimeEntry = 0;
                                    let EstimatedTimeEntryDesc = '';
                                    if (todaysDrafTimeEntry?.length > 0) {
                                        todaysDrafTimeEntry?.map((value: any) => {
                                            let entryDetails: any = [];
                                            try {
                                                entryDetails = JSON.parse(value.AdditionalTimeEntry)

                                            } catch (e) {

                                            }
                                            if (entryDetails?.length > 0 && value[`Task${item?.siteType}`] != undefined && value[`Task${item?.siteType}`].Id == item?.Id) {
                                                entryDetails?.map((timeEntry: any) => {
                                                    let parts = timeEntry?.TaskDate?.split('/');
                                                    let timeEntryDate: any = new Date(parts[2], parts[1] - 1, parts[0]);
                                                    if (timeEntryDate?.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0) && timeEntry?.AuthorId == teamMember?.AssingedToUserId) {
                                                        EstimatedTimeEntryDesc += ' ' + timeEntry?.Description
                                                        EstimatedTimeEntry += parseFloat(timeEntry?.TaskTime)
                                                        totalTime += Number(timeEntry?.TaskTime)
                                                        UserTotalTime += Number(timeEntry?.TaskTime)
                                                    }
                                                })


                                            }
                                        })
                                    }


                                    text = `<tr>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item?.siteType} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.TaskID} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"><p style="margin:0px; color:#333;"><a style="text-decoration: none;" href =${item?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.Id}&Site=${item?.siteType}> ${item?.Title} </a></p></td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Categories} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item?.PercentComplete} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.SmartPriority != undefined ? item.SmartPriority : ''} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${EstimatedTimeEntry} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px; border-right:0px"> ${EstimatedTimeEntryDesc} </td>
                                    </tr>`
                                    body1.push(text);
                                })
                                body =
                                    '<h3><strong>'
                                    + teamMember?.Title + ` (${teamMember?.Group != null ? teamMember?.Group : ''}) - ${UserTotalTime} hrs Scheduled`
                                    + '</strong></h3>'
                                    + ` <table cellpadding="0" cellspacing="0" align="left" width="100%" border="1" style=" border-color: #444;margin-bottom:10px">
                                    <thead>
                                    <tr>
                                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Site</th>
                                    <th width="60" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;x">Task ID</th>
                                    <th width="400" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Title</th>
                                    <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Category</th>
                                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">% </th>
                                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Smart Priority</th>
                                    <th width="70" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px" >Time</th>
                                    <th height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px; border-right:0px" >Timesheet Description (Draft)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    ${body1}
                                    </tbody>
                                    </table>`
                                body = body.replaceAll('>,<', '><').replaceAll(',', '')
                            } else {
                                body = '<h3><strong>'
                                    + teamMember?.Title + ` (${teamMember?.Group != null ? teamMember?.Group : ''})`
                                    + '</strong></h3>'
                                    + '<h4>'
                                    + 'No Working Today Tasks Available '
                                    + '</h4>'


                            }
                            teamsTaskBody.push(body);
                        }
                    })
                    let TeamTitle = '<h2><strong><span style="background-color: #ffff00;">'
                        + userGroup.Title
                        + '</span></strong></h2>'
                        + teamsTaskBody
                    finalBody.push(TeamTitle)
                }
            })
            let sendAllTasks: any =
                '<span style="font-size: 18px;margin-bottom: 10px;">'
                + 'Hi there, <br><br>'
                + "Below is the today's working task of all the team members :"
                + '<p>' + '<a href =' + `${AllListId?.siteUrl}/SitePages/PX-Overview.aspx?SelectedView=TodaysTask` + ">Click here for flat overview of the today's tasks: " + '</a>' + '</p>'
                + '</span>'
                + finalBody
                + '<h3>'
                + 'Thanks.'
                + '</h3>'
                + '<h3>'
                + currentUserData?.Title
                + '</h3>'
                subject = `[Todays Working Tasks - Team Wise] ${Moment(new Date()).format('YYYY-MM-DD')} - ${taskCount} Tasks`
                SendEmailFinal(to, subject, sendAllTasks.replaceAll("," , "  "));

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
    const AllSitesDats = (Tabs: any) => {
        if (Tabs == "AllImmediateTasks") {
            setCurrentView(Tabs)
            setNameTop("Immeditate tasks")
            setValue(AllImmediateTasks)
        }
        else if (Tabs == "AllEmailTasks") {
            setNameTop("Email-Notification's Tasks ")
            setCurrentView(Tabs)
            setValue(AllEmailTasks)
        }
        else if (Tabs == "AllPriorityTasks") {
            setNameTop("Priority Tasks")
            setCurrentView(Tabs)
            setValue(AllPriorityTasks)
        }
        else if (Tabs == "assignedApproverTasks") {
            setCurrentView(Tabs)
            setNameTop("Approver Tasks")
            setValue(assignedApproverTasks)
        }
        else if (Tabs == "AllBottleNeck") {
            setCurrentView(Tabs)
            setNameTop("All Bottleneck Tasks")
            setValue(AllBottleNeck)
        }
        else if (Tabs == "AllSitesTask") {
            setCurrentView(Tabs)
            setNameTop("All Site's Tasks")
            setValue(AllSitesTask)
        }
        else if (Tabs == "sharewebTasks") {
            setCurrentView(Tabs)
            setNameTop("Shareweb Tasks")
            setValue(sharewebTasks)
        }
    }

    //End
    return (
        <>
            <div className='header-section justify-content-between'>
                <h2 className='heading'>Task Dashboard</h2>
            </div>
            <div className="TaskDashboardPage Dashboardsecrtion" style={{ minHeight: '800px' }}>
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
                                    {currentUserData?.Title == "Deepak Trivedi" || currentUserData?.Title == "Santosh Kumar"  || currentUserData?.Title == "Ranu Trivedi" || currentUserData?.Title == "Abhishek Tiwari" || currentUserData?.Title == "Prashant Kumar" ?
                                        <a className='text-white hreflink' onClick={() => sendAllWorkingTodayTasks()}>
                                            Share Everyone's Today's Task
                                        </a> : ''}
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
                        <section className="sidebar__section sidebar__section--menu">
                            {
                                (currentUserId == currentUserData?.AssingedToUserId || currentUserData?.showAllTimeEntry == true) ?
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
                            <nav className="nav__item">
                                <ul className="nav__list text-center" >
                                    <li id="DefaultViewSelectId" className={currentView == 'AllImmediateTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { AllSitesDats("AllImmediateTasks") }}>
                                        Immediate Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'AllEmailTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { AllSitesDats('AllEmailTasks') }}>
                                        Email-Notification
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'AllPriorityTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { AllSitesDats('AllPriorityTasks') }}>
                                        Priority Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'assignedApproverTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { AllSitesDats('assignedApproverTasks') }}>
                                        Approver Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'AllBottleNeck' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { AllSitesDats('AllBottleNeck') }}>
                                        Bottleneck Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'AllSitesTask' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { AllSitesDats('AllSitesTask') }}>
                                        All Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'sharewebTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { AllSitesDats('sharewebTasks') }}>
                                        Shareweb Tasks
                                    </li>

                                </ul>
                            </nav>
                        </section>
                        <section className="sidebar__section sidebar__section--menu" onClick={() => setCurrentView('Home')}>
                            <nav className="nav__item">

                                <ul className="nav__list">

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
                                    <summary> Working Today Tasks {'(' + workingTodayTasks.length + ')'}
                                        {
                                            <>
                                                {currentUserId == 242 && <span className="align-autoplay d-flex float-end" onClick={() => sendEmail()}><span className="svg__iconbox svg__icon--mail mx-1" ></span>Send EOD Email</span>}
                                                <span className="align-autoplay d-flex float-end" onClick={() => shareTaskInEmail('today working tasks', 'Today')}><span className="svg__iconbox svg__icon--mail mx-1" ></span>Share Today Working Tasks</span>
                                            </>}
                                    </summary>
                                    <div className='AccordionContent'>
                                        {workingTodayTasks?.length > 0 ?
                                            <div className='Alltable border-0 dashboardTable'>
                                                <>
                                                    <GlobalCommanTable AllListId={AllListId} wrapperHeight="100%" columns={columnsName} data={workingTodayTasks} callBackData={inlineCallBack} pageName={"ProjectOverview"} TaskUsers={taskUsers} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                                                </>
                                            </div>
                                            : <div className='text-center full-width'>
                                                <span>No Working Today Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details onDrop={(e: any) => handleDrop('thisWeek')}
                                    onDragOver={(e: any) => e.preventDefault()}>
                                    <summary> Working This Week Tasks {'(' + thisWeekTasks?.length + ')'} </summary>
                                    <div className='AccordionContent'  >
                                        {thisWeekTasks?.length > 0 ?
                                            <div className='Alltable border-0 dashboardTable' >
                                                <>
                                                    <GlobalCommanTable AllListId={AllListId} wrapperHeight="100%" columns={columnsName} data={thisWeekTasks} callBackData={inlineCallBack} pageName={"ProjectOverview"} TaskUsers={taskUsers} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                                                </>
                                            </div> : <div className='text-center full-width'>
                                                <span>No Working This Week Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details>
                                    <summary>  Immediate Tasks {'(' + UserImmediateTasks.length + ')'} </summary>
                                    <div className='AccordionContent'>
                                        {UserImmediateTasks?.length > 0 ?
                                            <div className='Alltable border-0 dashboardTable'>
                                                <>
                                                    <GlobalCommanTable AllListId={AllListId} wrapperHeight="100%" columns={columnsName} data={UserImmediateTasks} callBackData={inlineCallBack} pageName={"ProjectOverview"} TaskUsers={taskUsers} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                                                </>
                                            </div>
                                            : <div className='text-center full-width'>
                                                <span>No Immediate Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details>
                                    <summary>  Bottleneck Tasks {'(' + bottleneckTasks.length + ')'} </summary>
                                    <div className='AccordionContent'>
                                        {bottleneckTasks?.length > 0 ?
                                            <div className='Alltable border-0 dashboardTable '>
                                                <>
                                                    <GlobalCommanTable AllListId={AllListId} wrapperHeight="100%" columns={columnsName} data={bottleneckTasks} callBackData={inlineCallBack} pageName={"ProjectOverview"} TaskUsers={taskUsers} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                                                </>
                                            </div>
                                            : <div className='text-center full-width'>
                                                <span>No Bottleneck Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details onDrop={(e: any) => handleDrop('AllTasks')}
                                    onDragOver={(e: any) => e.preventDefault()}>
                                    <summary>
                                        Assigned Tasks {'(' + AllAssignedTasks.length + ')'}
                                    </summary>
                                    <div className='AccordionContent' >
                                        {AllAssignedTasks?.length > 0 ?
                                            <>
                                                <div className='Alltable border-0 dashboardTable float-none' >
                                                    <>
                                                        <GlobalCommanTable AllListId={AllListId} wrapperHeight="100%" columns={columnsName} data={AllAssignedTasks} callBackData={inlineCallBack} pageName={"ProjectOverview"} TaskUsers={taskUsers} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                                                    </>
                                                </div>

                                            </>
                                            : <div className='text-center full-width'>
                                                <span>No Assigned Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                {((currentUserId == currentUserData?.AssingedToUserId || currentUserData?.showAllTimeEntry == true) && isTimeEntry == true) ?
                                    <>
                                        <div className='workrTimeReport'>
                                            <dl>
                                                <dt className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" value="Yesterday" name="date" checked={selectedTimeReport == 'Yesterday'} onClick={() => currentUserTimeEntry('Yesterday')} /> Yesterday
                                                </dt>
                                                <dt className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" value="Today" name="date" checked={selectedTimeReport == 'Today'} onClick={() => currentUserTimeEntry('Today')} /> Today
                                                </dt>
                                                <dt className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" value="This Week" name="date" checked={selectedTimeReport == 'This Week'} onClick={() => currentUserTimeEntry('This Week')} /> This Week
                                                </dt>
                                                <dt className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" value="Last Week" name="date" checked={selectedTimeReport == 'Last Week'} onClick={() => currentUserTimeEntry('Last Week')} /> Last Week
                                                </dt>
                                                <dt className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" value="This Month" name="date" checked={selectedTimeReport == 'This Month'} onClick={() => currentUserTimeEntry('This Month')} /> This Month
                                                </dt>
                                                <dt className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" value="Last Month" name="date" checked={selectedTimeReport == 'Last Month'} onClick={() => currentUserTimeEntry('Last Month')} /> Last Month
                                                </dt>
                                            </dl>
                                        </div>
                                        <div>
                                            <a className='accordion-Btn-right mt-2' title='Refresh Time Entries' onClick={() => { loadAllTimeEntry() }}><span className="svg__iconbox svg__icon--refresh mx-1 mt--3" ></span></a>
                                            <details open>
                                                {timeEntryTotal > 1 ?
                                                    <summary>{selectedTimeReport}'s Time Entry {'(' + timeEntryTotal.toFixed(2) + ' Hours)'}
                                                        {
                                                            currentUserId == currentUserData?.AssingedToUserId && (selectedTimeReport == "Today" || selectedTimeReport == "Yesterday") ? <span className="align-autoplay d-flex float-end me-5" onClick={() => shareTaskInEmail('today time entries', selectedTimeReport)}><span className="svg__iconbox svg__icon--mail mx-1" ></span>Share {selectedTimeReport}'s Time Entry</span> : ""
                                                        }
                                                    </summary> :
                                                    <summary>{selectedTimeReport}'s Time Entry {'(' + timeEntryTotal.toFixed(2) + ' Hour)'}
                                                        {
                                                            currentUserId == currentUserData?.AssingedToUserId && (selectedTimeReport == "Today" || selectedTimeReport == "Yesterday") ? <span className="align-autoplay d-flex float-end me-5" onClick={() => shareTaskInEmail('today time entries', selectedTimeReport)}><span className="svg__iconbox svg__icon--mail mx-1 me" ></span>Share {selectedTimeReport}'s Time Entry</span> : ""
                                                        }
                                                    </summary>
                                                }
                                                <div className='AccordionContent timeEntryReport'  >
                                                    {weeklyTimeReport?.length > 0 ?
                                                        <>
                                                        <div className='Alltable border-0 dashboardTable float-none' >
                                                            <GlobalCommanTable AllListId={AllListId} wrapperHeight="100%" columns={columnTimeReport} data={weeklyTimeReport} callBackData={inlineCallBack} pageName={"ProjectOverview"} TaskUsers={taskUsers} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                                                        </div>
                                                        </> : <div className='text-center full-width border p-3'>
                                                            <span>No Time Entry Available</span>
                                                        </div>}
                                                </div>
                                            </details>
                                        </div>
                                    </>
                                    : ''
                                }

                            </div>
                        </article>
                            : ''}


                        {/* <label className='f-16 fw-semibold'>{`Shareweb Tasks - ${sharewebTasks?.length}`}</label>
                        <label className='f-16 fw-semibold'>{`Shareweb Tasks - ${sharewebTasks?.length}`}</label> */}
                        {currentView == 'AllImmediateTasks' || currentView == 'AllEmailTasks' || currentView == 'AllPriorityTasks' || currentView == 'assignedApproverTasks' || currentView == 'AllBottleNeck' || currentView == 'AllSitesTask' || currentView == 'sharewebTasks' ? <article className="row">
                            <div>
                                <div>
                                    <label className='f-16 fw-semibold'>{` ${NameTop} - ${value?.length}`}</label>
                                    <a className='align-autoplay fw-normal d-flex float-end hreflink' onClick={() => setCurrentView("Home")}>Return To Home</a>
                                </div>
                                <div className='AccordionContent'>
                                    {(value && value?.length > 0) ?

                                        <div className='Alltable dashboardTable float-none'>
                                            <>
                                                <GlobalCommanTable AllListId={AllListId} showPagination={true} columns={columnsName} data={value} callBackData={inlineCallBack} pageName={"ProjectOverview"} TaskUsers={taskUsers} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                                            </>
                                        </div>


                                        : <div className='text-center full-width border p-3'>
                                            <span>{`No ${NameTop} Task avialable`}</span>
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
            {isSendEODReport && (<SendEmailEODReport WorkingTask={AllWorkingDayData} close={closeEODReport} Context={props?.props?.Context} />)}

        </>
    )
}
export default React.memo(TaskDashboard)