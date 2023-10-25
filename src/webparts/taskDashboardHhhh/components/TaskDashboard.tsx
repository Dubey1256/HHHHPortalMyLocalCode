import * as React from 'react'
import $ from 'jquery';
import {
    ColumnDef,
} from "@tanstack/react-table";
import '../../projectmanagementOverviewTool/components/styles.css'
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import axios from 'axios';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import { Accordion, Card, Button } from "react-bootstrap";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs";
import * as Moment from "moment";
import pnp, { sp, Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
//import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import { Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input, } from "reactstrap";
import {
    FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaChevronDown,
    FaChevronRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp,
} from "react-icons/fa";
import { useTable, useSortBy, useFilters, useExpanded, usePagination, HeaderGroup, } from "react-table";
//import { Filter, DefaultColumnFilter, } from "../../projectmanagementOverviewTool/components/filters";
import PageLoader from '../../../globalComponents/pageLoader';
import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import SendEmailEODReport from './SendEmailEODReport';
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
var selectedInlineTask: any = {};
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
const TaskDashboard = (props: any) => {
    const [updateContent, setUpdateContent] = React.useState(false);
    const [createTaskId, setCreateTaskId] = React.useState({});
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
    const [AllSmartMetadata, setAllSmartMetadata] = React.useState([]);
    const [AllImmediateTasks, setAllImmediateTasks] = React.useState([]);
    const [UserImmediateTasks, setUserImmediateTasks] = React.useState([]);
    const [AllEmailTasks, setAllEmailTasks] = React.useState([]);
    const [UserEmailTasks, setUserEmailTasks] = React.useState([]);
    const [AllBottleNeck, setAllBottleNeck] = React.useState([]);
    const [AllPriorityTasks, setAllPriorityTasks] = React.useState([]);
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
            var change = (Moment(startingDateOfLastMonth).add(2, 'days').format())
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
        AllTaskTimeEntries=[];
        setPageLoader(true)
        if (timesheetListConfig?.length > 0) {
            let timesheetLists: any = [];
            let startDate = getStartingDate('Last Month').toISOString();
            let taskLists: any = [];
            timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
            taskLists = JSON.parse(timesheetListConfig[0]?.Description)

            if (timesheetLists?.length > 0) {
                const fetchPromises = timesheetLists.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    try {
                        const data = await web.lists
                            .getById(list?.listId)
                            .items.select(list?.query)
                            .filter(`(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`)
                            .getAll();

                        data?.forEach((item: any) => {
                            item.taskDetails = checkTimeEntrySite(item);
                            AllTaskTimeEntries.push(item);
                        });
                        currentUserTimeEntry('This Week');
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
            if (timeEntry[`Task${task?.siteType}`]!=undefined && task?.Id == timeEntry[`Task${task?.siteType}`]?.Id) {
                return task;
            }
        });    
        return result;
    }

    const currentUserTimeEntry = (start:any) => {
        setPageLoader(false)
        setPageLoader(true)
        const startDate = getStartingDate(start);
        const endDate = getEndingDate(start);
        const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
        const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));
      
        const { weekTimeEntries, totalTime } = AllTaskTimeEntries?.reduce(
          (acc:any, timeEntry:any) => {
           try {
            if (timeEntry?.AdditionalTimeEntry) {
                const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);
        
                AdditionalTime?.forEach((filledTime:any) => {
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
        const timesheetDistribution = ['Today', 'This Week', 'This Month'];
      
        const allTimeCategoryTime = timesheetDistribution.reduce((totals, start) => {
          const startDate = getStartingDate(start);
          const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
      
          const total = AllTaskTimeEntries?.reduce((acc:any, timeEntry:any) => {
            if (timeEntry?.AdditionalTimeEntry) {
              const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);
      
              const taskTime = AdditionalTime.reduce((taskAcc:any, filledTime:any) => {
                const [day, month, year] = filledTime?.TaskDate?.split('/');
                const timeFillDate = new Date(+year, +month - 1, +day);
      
                if (
                  filledTime?.AuthorId === currentUserId &&
                  timeFillDate.getTime() === startDateMidnight.getTime() &&
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

                siteConfig.map(async (config: any) => {
                    if (config.Title != "SDC Sites") {
                        let smartmeta = [];
                        await web.lists
                            .getById(config.listId)
                            .items.select("ID", "Title", "ClientCategory/Id","Portfolio/PortfolioStructureID","TaskID", "ParentTask/TaskID","ParentTask/Title","ParentTask/Id","ClientCategory/Title","EstimatedTimeDescription", 'ClientCategory', "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title","FeedBack", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Body", "PriorityRank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Portfolio/Id", "Portfolio/Title", "Modified")
                            .expand("TeamMembers", "Approver", "ParentTask", "ClientCategory", "AssignedTo", "TaskCategories", "Author", "ResponsibleTeam", "ParentTask","TaskType", "Portfolio")
                            .getAll().then((data: any) => {
                                smartmeta = data;
                                smartmeta?.map((task: any) => {
                                    try {

                                        task.AllTeamMember = [];
                                        let EstimatedDesc: any = [];
                                        if (task?.EstimatedTimeDescription != undefined && task?.EstimatedTimeDescription != '' && task?.EstimatedTimeDescription != null) {
                                            EstimatedDesc = JSON.parse(task?.EstimatedTimeDescription)
                                        }
                                        task.HierarchyData = [];
                                        task.EstimatedTime = 0
                                        let estimatedDescription = ''
                                        if (EstimatedDesc?.length > 0) {
                                            EstimatedDesc?.map((time: any) => {
                                                task.EstimatedTime += Number(time?.EstimatedTime)
                                                estimatedDescription += ', ' + time?.EstimatedTimeDescription
                                            })
                                        }
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
                                        if (task?.Portfolio?.Id != undefined) {
                                            task.portfolio = task?.Portfolio;
                                            task.PortfolioTitle = task?.Portfolio?.Title;
                                            // task["Portfoliotype"] = "Component";
                                        }

                                        task["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
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

                                        const isBottleneckTask = checkUserExistence('Bottleneck', task?.TaskCategories);
                                        const isImmediate = checkUserExistence('Immediate', task?.TaskCategories);
                                        const isEmailNotification = checkUserExistence('Email Notification', task?.TaskCategories);
                                        const isCurrentUserApprover = task?.ApproverIds?.includes(currentUserId);
                                        if (isCurrentUserApprover && task?.PercentComplete == '1') {
                                            approverTask.push(task)
                                        }
                                        if (isBottleneckTask) {
                                            AllBottleNeckTasks.push(task)
                                        }
                                        if (isImmediate) {
                                            AllImmediates.push(task)
                                        }
                                        if (isEmailNotification) {
                                            AllEmails.push(task)
                                        }
                                        if (task?.ClientActivityJson != undefined) {
                                            SharewebTask.push(task)
                                        }
                                        if (parseInt(task.PriorityRank) >= 8 && parseInt(task.PriorityRank) <= 10) {
                                            AllPriority.push(task);
                                        }
                                        AllSiteTasks.push(task)

                                    } catch (error) {
                                        console.log(error)
                                    }
                                });
                                arraycount++;
                            });
                        let currentCount = siteConfig?.length;
                        if (arraycount === currentCount) {
                            setPageLoader(false);
                            AllTasks = AllSiteTasks;
                            backupTaskArray.assignedApproverTasks = approverTask;
                            setAllPriorityTasks(sortOnCreated(AllPriority))
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
                           
                            if(timesheetListConfig?.length > 0){
                                loadAllTimeEntry()
                            }
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
    const loadAllComponent = async () => {
        let web = new Web(AllListId?.siteUrl);
        MasterListData = await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "DeliverableSynonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "AdminNotes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebComponent/Id", "TaskCategories/Id", "TaskCategories/Title", "PriorityRank", "Reference_x0020_Item_x0020_Json", "TeamMembers/Title", "TeamMembers/Name", "TeamMembers/Id", "Item_x002d_Image", "ComponentLink", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("ClientCategory", "ComponentCategory", "AssignedTo", "AttachmentFiles", "Author", "Editor", "TeamMembers", "SharewebComponent", "TaskCategories", "Parent")
            .top(4999)
            .get().then((data) => {
                data?.forEach((val: any) => {
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
        let Immediates: any = [];
        let EmailsTasks: any = [];
        let approverTask: any = [];
        if (AllTasks?.length > 0 && currentUserId != undefined && currentUserId != '') {
            AllTasks?.map((task: any) => {
                const isCurrentUserAssigned = task?.AssignedToIds?.includes(currentUserId);
                const isImmediate = checkUserExistence('Immediate', task?.TaskCategories);
                const isEmailNotfication = checkUserExistence('Email Notification', task?.TaskCategories);
                const isBottleneckTask = checkUserExistence('Bottleneck', task?.TaskCategories);

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
                } if (isBottleneckTask && (isCurrentUserAssigned)) {
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
        setUserEmailTasks(sortOnCreated(EmailsTasks))
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
    const columns = React.useMemo(
        () => [
            {
                internalHeader: "Task Id",
                accessor: "TaskID",
                style: { width: '70px' },
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesTask} AllListId={props?.props} />
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
                        {row?.original?.Body !== null && <InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} />
                        }
                    </span>
                ),
            },
            {
                internalHeader: "Site",
                accessor: 'siteType',
                id: "SiteIcon", // 'id' is required
                showSortIcon: true,
                style: { width: '50px' },
                Cell: ({ row }: any) => (
                    <span>
                        {row?.original?.SiteIcon != undefined ?
                            <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
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
                accessor: "ClientCategorySearch",
                internalHeader: "Client Category",
                id: "ClientCategory",
                header: "",
                style: { width: '100px' },
                showSortIcon: true,
                size: 100,
                Cell: ({ row }: any) => (
                    <>
                        <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                    </>
                ),
            },
            {
                internalHeader: "Priority",
                isSorted: true,
                isSortedDesc: true,
                accessor: "PriorityRank",
                style: { width: '100px' },
                showSortIcon: true,
                // Cell: ({ row }: any) => (
                //     <InlineEditingcolumns AllListId={AllListId} type='Task' rowIndex={row?.index} callBack={inlineCallBack} TaskUsers={taskUsers} columnName='Priority' item={row?.original} />

                // ),
            },

            {
                internalHeader: "Due Date",
                showSortIcon: true,
                accessor: "DueDate",
                style: { width: '80px' },
                // Cell: ({ row }: any) => <InlineEditingcolumns
                //     AllListId={AllListId}
                //     callBack={inlineCallBack}
                //     columnName="DueDate"
                //     item={row?.original}
                //     TaskUsers={taskUsers}
                // />,
            },
            {
                internalHeader: "Estimated Time",
                showSortIcon: true,
                accessor: "EstimatedTime",
                style: { width: '80px' },
                Cell: ({ row }: any) => (
                    <span>
                        {row?.original?.EstimatedTime != undefined ? row?.original?.EstimatedTime : ''}
                    </span>
                ),
            },
            {
                internalHeader: "% Complete",
                accessor: "PercentComplete",
                style: { width: '55px' },
                showSortIcon: true,
                // Cell: ({ row }: any) => (


                //     <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='PercentComplete' TaskUsers={taskUsers} item={row?.original} />

                // ),
            },
            {
                internalHeader: "Team Members",
                accessor: "TeamMembersSearch",
                style: { width: '150px' },
                showSortIcon: true,
                // Cell: ({ row }: any) => (

                //     <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='Team' item={row?.original} TaskUsers={taskUsers} />

                // ),
            },
            {
                internalHeader: "Created",
                accessor: "Created",
                showSortIcon: true,
                filterFn: (row:any, filterValue:any) => {
                    if(row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase())|| row?.original?.DisplayCreateDate?.includes(filterValue)){
                      return  true
                    }else{
                      return false
                    }
                  },
                style: { width: "125px" },
                Cell: ({ row }: any) => (
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
        [AllAssignedTasks, workingTodayTasks, thisWeekTasks]
    );
    const columnTimeReport = React.useMemo(
        () => [
            {
                internalHeader: "Task Id",
                accessor: "TaskID",
                style: { width: '70px' },
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>

                        <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesTask} AllListId={props?.props} />

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
                        {row?.original?.Body !== null && <InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} />
                        }

                    </span>
                ),
            },
            {
                internalHeader: "Site",
                accessor: 'siteType',
                id: "SiteIcon", // 'id' is required
                showSortIcon: true,
                style: { width: '50px' },
                Cell: ({ row }: any) => (
                    <span>
                        {row?.original?.SiteIcon != undefined ?
                            <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                    </span>
                ),
            },
            // {
            //     internalHeader: "Priority",
            //     isSorted: true,
            //     isSortedDesc: true,
            //     accessor: "PriorityRank",
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
                Cell: ({ value }: any) => (
                    <div
                        className="column-description"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {value}
                    </div>
                ),
            },

            {
                internalHeader: "% Complete",
                accessor: "PercentComplete",
                style: { width: '55px' },
                showSortIcon: true,
                // Cell: ({ row }: any) => (

                //     <span>
                //         <InlineEditingcolumns AllListId={AllListId} rowIndex={row?.index} callBack={inlineCallBack} columnName='PercentComplete' TaskUsers={taskUsers} item={row?.original} />
                //     </span>
                // ),
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
                            <>
                                <a href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`} target="_blank"
                                    data-interception="off" >
                                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                                </a>
                            </>
                            : <span title={row?.original?.Author?.Title} className="svg__iconbox svg__icon--defaultUser grey "></span>}
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
            //defaultColumn: { Filter: DefaultColumnFilter },
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
            //defaultColumn: { Filter: DefaultColumnFilter },
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
            //defaultColumn: { Filter: DefaultColumnFilter },
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
        canPreviousPage: canPreviousPageApprover,
        canNextPage: canNextPageApprover,
        pageOptions: pageOptionsApprover,
        pageCount: pageCountApprover,
        nextPage: nextPageApprover,
        previousPage: previousPageApprover,
        state: { pageIndex: pageIndexApprover, pageSize: pageSizeApprover },
    }: any = useTable(
        {
            columns: columns,
            data: assignedApproverTasks,
            //defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 30 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const {
        getTableProps: getTablePropsAllPriority,
        getTableBodyProps: getTableBodyPropsAllPriority,
        headerGroups: headerGroupsAllPriority,
        page: pageAllPriority,
        prepareRow: prepareRowAllPriority,
        gotoPage: gotoPageAllPriority,
        setPageSize: setPageSizeAllPriority,
        canPreviousPage: canPreviousPageAllPriority,
        canNextPage: canNextPageAllPriority,
        pageOptions: pageOptionsAllPriority,
        pageCount: pageCountAllPriority,
        nextPage: nextPageAllPriority,
        previousPage: previousPageAllPriority,
        state: { pageIndex: pageIndexAllPriority, pageSize: pageSizeAllPriority },
    }: any = useTable(
        {
            columns: columns,
            data: AllPriorityTasks,
            //defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 30 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );

    const {
        getTableProps: getTablePropsImmediate,
        getTableBodyProps: getTableBodyPropsImmediate,
        headerGroups: headerGroupsImmediate,
        page: pageImmediate,
        prepareRow: prepareRowImmediate,
        gotoPage: gotoPageImmediate,
        setPageSize: setPageSizeImmediate,
        state: { pageIndex: pageIndexImmediate, pageSize: pageSizeImmediate },
    }: any = useTable(
        {
            columns: columns,
            data: UserImmediateTasks,
           // defaultColumn: { Filter: DefaultColumnFilter },
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
            //defaultColumn: { Filter: DefaultColumnFilter },
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
            //defaultColumn: { Filter: DefaultColumnFilter },
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
            //defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 30 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    const {
        getTableProps: getTablePropsAllImmediate,
        getTableBodyProps: getTableBodyPropsAllImmediate,
        headerGroups: headerGroupsAllImmediate,
        page: pageAllImmediate,
        prepareRow: prepareRowAllImmediate,
        gotoPage: gotoPageAllImmediate,
        setPageSize: setPageSizeAllImmediate,
        canPreviousPage: canPreviousPageAllImmediate,
        canNextPage: canNextPageAllImmediate,
        pageOptions: pageOptionsAllImmediate,
        pageCount: pageCountAllImmediate,
        nextPage: nextPageAllImmediate,
        previousPage: previousPageAllImmediate,
        state: { pageIndex: pageIndexAllImmediate, pageSize: pageSizeAllImmediate },
    }: any = useTable(
        {
            columns: columns,
            data: AllImmediateTasks,
            //defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 30 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    const {
        getTableProps: getTablePropsAllEmail,
        getTableBodyProps: getTableBodyPropsAllEmail,
        headerGroups: headerGroupsAllEmail,
        page: pageAllEmail,
        prepareRow: prepareRowAllEmail,
        gotoPage: gotoPageAllEmail,
        setPageSize: setPageSizeAllEmail,
        canPreviousPage: canPreviousPageAllEmail,
        canNextPage: canNextPageAllEmail,
        pageOptions: pageOptionsAllEmail,
        pageCount: pageCountAllEmail,
        nextPage: nextPageAllEmail,
        previousPage: previousPageAllEmail,
        state: { pageIndex: pageIndexAllEmail, pageSize: pageSizeAllEmail },
    }: any = useTable(
        {
            columns: columns,
            data: AllEmailTasks,
            //defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 30 },
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
            //defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 30 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    const {
        getTableProps: getTablePropsSharewebTask,
        getTableBodyProps: getTableBodyPropsSharewebTask,
        headerGroups: headerGroupsSharewebTask,
        page: pageSharewebTask,
        prepareRow: prepareRowSharewebTask,
        gotoPage: gotoPageSharewebTask,
        setPageSize: setPageSizeSharewebTask,
        canPreviousPage: canPreviousPageSharewebTask,
        canNextPage: canNextPageSharewebTask,
        pageOptions: pageOptionsSharewebTask,
        pageCount: pageCountSharewebTask,
        nextPage: nextPageSharewebTask,
        previousPage: previousPageSharewebTask,
        state: { pageIndex: pageIndexSharewebTask, pageSize: pageSizeSharewebTask },
    }: any = useTable(
        {
            columns: columns,
            data: sharewebTasks,
            //defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 30 },
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
                setAllSmartMetadata(AllMetadata)
                siteConfig = smartmeta.filter((data: any) => {
                    if (data?.IsVisible && data?.TaxType == 'Sites' && data?.Title != 'Master Tasks' && data?.listId!=undefined && data?.listId?.length>32) {
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
                    .select("Id,UserGroupId,Suffix,IsActive,Title,Email,SortOrder,Role,showAllTimeEntry,Company,Group,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
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
            if (childItem?.UserGroupId != undefined && parseInt(childItem?.UserGroupId) == item.ID  ) {
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

    // People on Leave Today //
    const loadTodaysLeave = async () => {
        if (AllListId?.SmalsusLeaveCalendar?.length > 0) {
            let startDate: any = getStartingDate('Today');
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
            setOnLeaveEmployees(peopleOnLeave)
            console.log(peopleOnLeave);
        }
    }
    //End

    //Shareworking Today's Task In Email


    const sendEmail=()=>{
        var RemarksData:any = []
        workingTodayTasks?.forEach((item: any) => {
            item.TeamMember = ''
            item.Category = ''
            item.NewJSONData = []
            
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
            item.NewJSONData?.forEach((ele: any) => {
                item.subTitle = ele?.Title?.replaceAll(/<[^>]*><p>/g, '')
                item.subCompleted = ele?.Completed
                item.subDeployed = ele?.Deployed
                item.subQAReviews = ele?.QAReviews
                item.subInProgress = ele?.InProgress
                item.subRemarks = ele?.Remarks
                item.subChild = ele?.Subtext
            })
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
            RemarksData.push(item)
        })
        RemarksData?.forEach((val:any)=>{
            val.subChilds=[]
            if(val.subRemarks != undefined && val.subRemarks != '' ){
                AllWorkingDayData.push(val)
            }
        })
        AllWorkingDayData?.forEach((val:any)=>{
            if(val.subCompleted == true){
                val.subDeployed = true
                val.subQAReviews = true
                val.subInProgress = true
            }
            
            val.subChild?.forEach((ele:any)=>{
                ele.subTitle = ele?.Title?.replaceAll(/<[^>]*><p>/g, '')
                ele.subCompleted = ele?.Completed
                ele.subDeployed = ele?.Deployed
                ele.subQAReviews = ele?.QAReviews
                ele.subInProgress = ele?.InProgress
                ele.subRemarks = ele?.Remarks
            })
        })
        
        setisSendEODReport(true)
      
    }
    const closeEODReport=()=>{
        setisSendEODReport(false)
    }
  
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
            return b.PriorityRank - a.PriorityRank;
        });
        let confirmation = confirm('Your' + ' ' + input + ' ' + 'will be automatically shared with your approver' + ' ' + '(' + userApprover + ')' + '.' + '\n' + 'Do you want to continue?')
        if (confirmation) {
            if (input == 'today working tasks') {

                var subject = currentLoginUser + '-Today Working Tasks';
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
                    if (item.EstimatedTime == undefined || item.EstimatedTime == '' || item.EstimatedTime == null) {
                        item.EstimatedTime = ''
                    }


                    text =
                        '<tr>' +
                        '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.siteType + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.TaskID + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + '<p style="margin-top:0px; margin-bottom:2px;font-size:14px; color:#333;">' + '<a href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px; font-weight:600">' + item.Title + '</span></a>' + '</p>' + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Categories + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.PercentComplete + '</td>'
                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.PriorityRank + '</td>'
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
                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Estimated Time (In Hrs)' + '</th>'
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>'
                    + body1
                    + '</tbody>'
                    + '</table>'
                    + '<p>' + 'For the complete Task Dashboard of ' + currentLoginUser + ' click the following link:' + '<a href =' + `${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=` + currentUserId + '><span style="font-size:13px; font-weight:600">' + `${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=` + currentUserId + '</span>' + '</a>' + '</p>'


            }
            body = body.replaceAll('>,<', '><').replaceAll(',', '')
        }
        if (input == 'today time entries') {
            var subject = currentLoginUser + `- ${selectedTimeReport} Time Entries`;
            let timeSheetData = currentUserTimeEntryCalculation();
            weeklyTimeReport.map((item: any) => {
                if (item?.Categories == undefined || item.Categories == '')
                    item.Categories = '';

                text =
                    '<tr>'
                    + '<td style="line-height:18px;font-size:13px;padding:15px;;">' + item?.siteType + '</td>'
                    + '<td style="line-height:18px;font-size:13px;padding:15px;;">' + item?.TaskID + '</td>'
                    + '<td style="line-height:18px;font-size:13px;padding:15px;;">' + '<p style="margin-top:0px; margin-bottom:2px;font-size:14px; color:#333;">' + '<a href =' + item?.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item?.Id + '&Site=' + item?.siteType + '><span style="font-size:13px; font-weight:600">' + item?.Title + '</span></a>' + '</p>' + '</td>'
                    + '<td style="line-height:18px;font-size:13px;padding:15px;">' + item?.TaskTime + '</td>'
                    + '<td style="line-height:18px;font-size:13px;padding:15px;">' + item?.Description + '</td>'
                body1.push(text);

            });
            body =
                `<table width="100%" align="center" cellpadding="0" cellspacing="0" style="border:1px solid #eee">
            <thead>
            <tr>
            <th colspan="3" bgcolor="#eee" style="font-size:22px; padding:10px;"> Time report </th> 
            </tr>
            <tr>
            <th colspan="3" align="center" valign="middle" style="font-size:18px; padding:10px;">
            <p style="margin-top:0px; margin-bottom:5px">${currentLoginUser}</p>
            </th>
            </tr>
            </thead>
            <tbody style="border:1px solid #eee;">
            <tr>
            <th height="20" align="center" valign="middle" style="font-size:15px ; border-right:1px solid #eee; border-top: 1px solid #eee; padding: 5px 0px 0px 0px;">Today</th>
            <th height="20" align="center" valign="middle" style="font-size:15px ; border-right:1px solid #eee; border-top: 1px solid #eee; padding: 5px 0px 0px 0px;">This week</th>
            <th height="20" align="center" valign="middle" style="font-size:15px ; border-right:1px solid #eee; border-top: 1px solid #eee; padding: 5px 0px 0px 0px;">This Month</th>
            </tr>
            <tr>
            <th height="20" align="center" valign="middle" style="font-size:14px ; border-right:1px solid #eee;padding: 0px 0px 5px 0px;">${timeSheetData.today} Hour</th>
            <th height="20" align="center" valign="middle" style="font-size:14px ; border-right:1px solid #eee;padding: 0px 0px 5px 0px;">${timeSheetData.thisWeek} Hour</th>
            <th height="20" align="center" valign="middle" style="font-size:14px ; border-right:1px solid #eee;padding: 0px 0px 5px 0px;">${timeSheetData.thisMonth} Hour</th>
            </tr>
            </tbody>
            </table> `
                + '<table style="border: 1px solid #ccc; margin-top:5px;" border="0" cellspacing="0" cellpadding="0" width="100%">'
                + '<thead>'
                + '<tr>'
                + '<th align="left"  bgcolor="#f5f5f5" style="line-height:18px;font-size:15px;padding:15px;width:5%">'
                + 'Site'
                + '</th>'
                + '<th align="left" style="line-height:18px;font-size:15px;padding:15px;width:10%" bgcolor="#f5f5f5">'
                + 'Task ID'
                + '</th>'
                + '<th align="left" style="line-height:18px;font-size:15px;padding:15px;width:40%" bgcolor="#f5f5f5">'
                + 'Title'
                + '</th>'
                + '<th align="left" style="line-height:18px;font-size:15px;padding:15px;width:5%" bgcolor="#f5f5f5">'
                + 'Time'
                + '</th>'
                + '<th align="left" style="line-height:18px;font-size:15px;padding:15px;width:40%" bgcolor="#f5f5f5">'
                + 'Description'
                + '</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr>'
                + body1
                + '</tr>'
                + '</tbody>'
                + '</table>'
                + '<p>' + '<a href =' + `${AllListId?.siteUrl}/SitePages/UserTimeEntry.aspx?userId=${currentUserId}` + '>Click here to open the Complete time entry' + '</a>' + '</p>'
                + '<p>' + '<a href =' + `${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=` + currentUserId + '>' + 'Click here to open Task Dashboard of ' + currentLoginUser + '</a>' + '</p>'
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
        let finalBody: any = [];
        let userApprover = '';
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
                            let body: any = '';
                            let body1: any = [];
                            let tasksCopy: any = [];
                            tasksCopy = filterCurrentUserWorkingTodayTask(teamMember?.AssingedToUserId)
                            if (tasksCopy?.length > 0) {
                                tasksCopy?.map((item: any) => {
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
                                    if (item.EstimatedTime == undefined || item.EstimatedTime == '' || item.EstimatedTime == null) {
                                        item.EstimatedTime = ''
                                    }


                                    text =
                                        '<tr>' +
                                        '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.siteType + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.TaskID + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + '<p style="margin-top:0px; margin-bottom:2px;font-size:14px; color:#333;">' + '<a href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px; font-weight:600">' + item.Title + '</span></a>' + '</p>' + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Categories + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.PercentComplete + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.PriorityRank + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + teamUsers + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.TaskDueDatenew + '</td>'
                                        + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.EstimatedTime + '</td>'
                                    body1.push(text);
                                })
                                body =
                                    '<h3><strong>'
                                    + teamMember?.Title + ` (${teamMember?.Group != null ? teamMember?.Group : ''})`
                                    + '</strong></h3>'
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
                                    + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Estimated Time (In Hrs)' + '</th>'
                                    + '</tr>'
                                    + '</thead>'
                                    + '<tbody>'
                                    + body1
                                    + '</tbody>'
                                    + '</table>'
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
                    let TeamTitle = '<h2><strong>'
                        + userGroup.Title
                        + '</strong></h2>'
                        + teamsTaskBody
                    finalBody.push(TeamTitle)
                }
            })
            let sendAllTasks =
                '<span style="font-size: 18px;margin-bottom: 10px;">'
                + 'Hi there, <br><br>'
                + "Below is the today's working task of all the team members :"
                + '<p>' + '<a href =' + `${AllListId?.siteUrl}/SitePages/Project-Management-Overview.aspx?SelectedView=TodaysTask` + ">Click here for flat overview of the today's tasks: " + '</a>' + '</p>'
                + '</span>'
                + finalBody
                + '<h3>'
                + 'Thanks.'
                + '</h3>'
                + '<h3>'
                + currentUserData?.Title
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
    const onChangeInSelectAllPriority = (event: any) => {
        setPageSizeAllPriority(Number(event.target.value));
    };
    const onChangeInSelectApprover = (event: any) => {
        setPageSizeApprover(Number(event.target.value));
    };
    const onChangeInSelectAllSite = (event: any) => {
        setPageSizeAllSite(Number(event.target.value));
    };
    const onChangeInSelectAllBottle = (event: any) => {
        setPageSizeAllBottle(Number(event.target.value));
    };
    const onChangeInSelectSharewebTask = (event: any) => {
        setPageSizeSharewebTask(Number(event.target.value));
    };
    const onChangeInSelectAllImmediate = (event: any) => {
        setPageSizeAllImmediate(Number(event.target.value));
    };
    const onChangeInSelectAllEmail = (event: any) => {
        setPageSizeAllEmail(Number(event.target.value));
    };
    //End
    return (
        <>
            <div className='header-section justify-content-between'>
                <h2 style={{ color: "#000066", fontWeight: "600" }}>Task Dashboard</h2>
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
                                    {currentUserData?.Title == "Deepak Trivedi" || currentUserData?.Title == "Ranu Trivedi" || currentUserData?.Title == "Abhishek Tiwari" || currentUserData?.Title == "Prashant Kumar" ?
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
                                    <li id="DefaultViewSelectId" className={currentView == 'AllImmediateTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { setCurrentView('AllImmediateTasks') }}>
                                        Immediate Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'AllEmailTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { setCurrentView('AllEmailTasks') }}>
                                        Email-Notification
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'AllPriorityTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { setCurrentView('AllPriorityTasks') }}>
                                        Priority Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'allApproverView' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { setCurrentView('allApproverView') }}>
                                        Approver Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'allBottlenecks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { setCurrentView('allBottlenecks') }}>
                                        Bottleneck Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'allTasksView' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { setCurrentView('allTasksView') }}>
                                        All Tasks
                                    </li>
                                    <li id="DefaultViewSelectId" className={currentView == 'sharewebTasks' ? "nav__text bg-secondary mb-1 hreflink" : "nav__text mb-1 bg-shade hreflink "} onClick={() => { setCurrentView('sharewebTasks') }}>
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
                                    <summary> Working Today Tasks {'(' + pageToday?.length + ')'}
                                        {
                                            <>
                                             <span className="align-autoplay d-flex float-end" onClick={() => sendEmail()}><span className="svg__iconbox svg__icon--mail mx-1" ></span>Send EOD Email</span>
                                            <span className="align-autoplay d-flex float-end" onClick={() => shareTaskInEmail('today working tasks')}><span className="svg__iconbox svg__icon--mail mx-1" ></span>Share Today Working Tasks</span> 
                                            </>}</summary>
                                    <div className='AccordionContent mx-height'>
                                        {workingTodayTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover  {...getTablePropsToday()}>
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
                                                                    {/* <Filter column={column} /> */}
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
                                                                <tr onClick={() => { selectedInlineTask = { table: "workingToday", taskId: row?.original?.Id } }} draggable data-value={row?.original}
                                                                    onDragStart={(e) => startDrag(row?.original, row?.original.TaskID, 'workingToday')}
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
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover {...getTablePropsWeek()} >
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
                                                                    {/* <Filter column={column} /> */}
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
                                                                <tr onClick={() => { selectedInlineTask = { table: "workingThisWeek", taskId: row?.original?.Id } }} draggable data-value={row?.original}
                                                                    onDragStart={(e) => startDrag(row?.original, row?.original.TaskID, 'thisWeek')}
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
                                    <summary>  Immediate Tasks {'(' + pageImmediate?.length + ')'} </summary>
                                    <div className='AccordionContent mx-height'  >
                                        {UserImmediateTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover  {...getTablePropsImmediate()}>
                                                <thead className="fixed-Header">
                                                    {headerGroupsImmediate?.map((headerGroup: any) => (
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
                                                                    {/* <Filter column={column} /> */}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageImmediate?.length > 0 ?
                                                    <tbody {...getTableBodyPropsImmediate}>
                                                        {pageImmediate?.map((row: any) => {
                                                            prepareRowImmediate(row);
                                                            return (
                                                                <tr {...row.getRowProps()}>
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
                                                <span>No Immediate Tasks Available</span>
                                            </div>}
                                    </div>
                                </details>
                                <details>
                                    <summary>  Bottleneck Tasks {'(' + pageBottleneck?.length + ')'} </summary>
                                    <div className='AccordionContent mx-height'  >
                                        {bottleneckTasks?.length > 0 ?
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover  {...getTablePropsBottleneck()}>
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
                                                                    {/* <Filter column={column} /> */}
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
                                                                <tr onClick={() => { selectedInlineTask = { table: "bottleneck", taskId: row?.original?.Id } }}  {...row.getRowProps()} >
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
                                <details onDrop={(e: any) => handleDrop('AllTasks')}
                                    onDragOver={(e: any) => e.preventDefault()}>
                                    <summary>
                                        Assigned Tasks {'(' + backupTaskArray?.AllAssignedTasks?.length + ')'}
                                    </summary>
                                    <div className='AccordionContent mx-height' >
                                        {AllAssignedTasks?.length > 0 ?
                                            <>
                                                <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover {...getTablePropsAll()} >
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
                                                                        {/* <Filter column={column} /> */}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </thead>
                                                    {pageAll?.length > 0 ? <tbody {...getTableBodyPropsAll()}>
                                                        {pageAll?.map((row: any) => {
                                                            prepareRowAll(row);
                                                            return (
                                                                <tr onClick={() => { selectedInlineTask = { table: "allAssignedTask", taskId: row?.original?.Id } }} draggable data-value={row?.original}
                                                                    onDragStart={(e) => startDrag(row?.original, row?.original.TaskID, 'AllTasks')}
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
                                            <a className='accordion-Btn-right mt-1' title='Refresh Time Entries' onClick={() => { loadAllTimeEntry() }}><span className="svg__iconbox svg__icon--refresh mx-1" ></span></a>
                                            <details open>
                                                {timeEntryTotal > 1 ?
                                                    <summary>{selectedTimeReport}'s Time Entry {'(' + timeEntryTotal.toFixed(2) + ' Hours)'}
                                                        {
                                                            currentUserId == currentUserData?.AssingedToUserId && selectedTimeReport == "Today" ? <span className="align-autoplay d-flex float-end me-5" onClick={() => shareTaskInEmail('today time entries')}><span className="svg__iconbox svg__icon--mail mx-1" ></span>Share {selectedTimeReport}'s Time Entry</span> : ""
                                                        }
                                                    </summary> :
                                                    <summary>{selectedTimeReport}'s Time Entry {'(' + timeEntryTotal.toFixed(2) + ' Hour)'}
                                                        {
                                                            currentUserId == currentUserData?.AssingedToUserId && selectedTimeReport == "Today" ? <span className="align-autoplay d-flex float-end me-5" onClick={() => shareTaskInEmail('today time entries')}><span className="svg__iconbox svg__icon--mail mx-1 me" ></span>Share {selectedTimeReport}'s Time Entry</span> : ""
                                                        }
                                                    </summary>
                                                }

                                                <div className='AccordionContent mx-height timeEntryReport'  >
                                                    {weeklyTimeReport?.length > 0 ?
                                                        <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover  {...getTablePropsApprover()}>
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
                                                                                {/* <Filter column={column} /> */}
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
                                        </div>
                                    </>
                                    : ''
                                }

                            </div>
                        </article>
                            : ''}
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
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover {...getTablePropsAllBottle()} >
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
                                                                    {/* <Filter column={column} /> */}
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
                                            <nav className="pull-right">
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
                                                    {/* <Col md={2}>
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
                                                    </Col> */}
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
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover {...getTablePropsAllSite()} >
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
                                                                    {/* <Filter column={column} /> */}
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
                                            <nav className="pull-right">
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
                                                    {/* <Col md={2}>
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
                                                    </Col> */}
                                                </Pagination>
                                            </nav>
                                        </>
                                        : <div className='text-center full-width'>
                                            <span>No All Sites Tasks Available</span>
                                        </div>}
                                </div>
                            </div>
                        </article> : ''}
                        {currentView == 'allApproverView' ? <article className="row">
                            <div>
                                <div className='' >
                                    <div className="col-md-12 clearfix">
                                        <h5 className="d-inline-block">
                                            {`Approver Tasks - ${pageApprover?.length}`}
                                        </h5>
                                        <span className='pull-right hreflink' onClick={() => setCurrentView("Home")}>Return To Home</span>
                                    </div>
                                    {assignedApproverTasks?.length > 0 ?
                                        <> <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover  {...getTablePropsApprover()}>
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
                                                                {/* <Filter column={column} /> */}
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
                                                            <tr onClick={() => { selectedInlineTask = { table: "approverTask", taskId: row?.original?.Id } }}  >
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
                                            <nav className="pull-right">
                                                <Pagination>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => previousPageApprover()} disabled={!canPreviousPageApprover}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndexApprover + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPageApprover()} disabled={!canNextPageApprover}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleRight
                                                                    aria-hidden={true}

                                                                />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    {/* <Col md={2}>
                                                        <Input
                                                            type='select'
                                                            value={pageSizeApprover}
                                                            onChange={onChangeInSelectApprover}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSizeApprover) => (
                                                                <option key={pageSizeApprover} value={pageSizeApprover}>
                                                                    Show {pageSizeApprover}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col> */}
                                                </Pagination>
                                            </nav>
                                        </>

                                        : <div className='text-center full-width'>
                                            <span>No Approver Tasks Available</span>
                                        </div>}
                                </div>
                            </div>
                        </article> : ''}
                        {currentView == 'AllPriorityTasks' ? <article className="row">
                            <div>
                                <div className='' >
                                    <div className="col-md-12 clearfix">
                                        <h5 className="d-inline-block">
                                            {`Priority Tasks - ${AllPriorityTasks?.length}`}
                                        </h5>
                                        <span className='pull-right hreflink' onClick={() => setCurrentView("Home")}>Return To Home</span>
                                    </div>
                                    {AllPriorityTasks?.length > 0 ?
                                        <> <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover  {...getTablePropsAllPriority()}>
                                            <thead className="fixed-Header">
                                                {headerGroupsAllPriority?.map((headerGroup: any) => (
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
                                                                {/* <Filter column={column} /> */}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            {pageAllPriority?.length > 0 ?
                                                <tbody {...getTableBodyPropsAllPriority}>
                                                    {pageAllPriority?.map((row: any) => {
                                                        prepareRowAllPriority(row);
                                                        return (
                                                            <tr onClick={() => { selectedInlineTask = { table: "approverTask", taskId: row?.original?.Id } }}  {...row.getRowProps()} >
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
                                            <nav className="pull-right">
                                                <Pagination>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => previousPageAllPriority()} disabled={!canPreviousPageAllPriority}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndexAllPriority + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPageAllPriority()} disabled={!canNextPageAllPriority}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleRight
                                                                    aria-hidden={true}

                                                                />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    {/* <Col md={2}>
                                                        <Input
                                                            type='select'
                                                            value={pageSizeAllPriority}
                                                            onChange={onChangeInSelectAllPriority}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSizeAllPriority) => (
                                                                <option key={pageSizeAllPriority} value={pageSizeAllPriority}>
                                                                    Show {pageSizeAllPriority}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col> */}
                                                </Pagination>
                                            </nav>
                                        </>

                                        : <div className='text-center full-width'>
                                            <span>No Priority Tasks Available</span>
                                        </div>}
                                </div>
                            </div>
                        </article> : ''}
                        {currentView == 'sharewebTasks' ? <article className="row">
                            <div>
                                <div className='' >
                                    <div className="col-md-12 clearfix">
                                        <h5 className="d-inline-block">
                                            {`Shareweb Tasks - ${sharewebTasks?.length}`}
                                        </h5>
                                        <span className='pull-right hreflink' onClick={() => setCurrentView("Home")}>Return To Home</span>
                                    </div>
                                    {sharewebTasks?.length > 0 ?
                                        <>
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover {...getTablePropsAllSite()} >
                                                <thead className="fixed-Header">
                                                    {headerGroupsSharewebTask?.map((headerGroup: any) => (
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
                                                                    {/* <Filter column={column} /> */}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageSharewebTask?.length > 0 ? <tbody {...getTableBodyPropsSharewebTask()}>
                                                    {pageSharewebTask?.map((row: any) => {
                                                        prepareRowSharewebTask(row);
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
                                            <nav className="pull-right">
                                                <Pagination>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => previousPageSharewebTask()} disabled={!canPreviousPageSharewebTask}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndexSharewebTask + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPageSharewebTask()} disabled={!canNextPageSharewebTask}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleRight
                                                                    aria-hidden={true}

                                                                />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    {/* <Col md={2}>
                                                        <Input
                                                            type='select'
                                                            value={pageSizeSharewebTask}
                                                            onChange={onChangeInSelectSharewebTask}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSizeSharewebTask) => (
                                                                <option key={pageSizeSharewebTask} value={pageSizeSharewebTask}>
                                                                    Show {pageSizeSharewebTask}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col> */}
                                                </Pagination>
                                            </nav>
                                        </>
                                        : <div className='text-center full-width'>
                                            <span>No Shareweb Tasks Available</span>
                                        </div>}
                                </div>
                            </div>
                        </article> : ''}
                        {currentView == 'AllImmediateTasks' ? <article className="row">
                            <div>
                                <div className='' >
                                    <div className="col-md-12 clearfix">
                                        <h5 className="d-inline-block">
                                            {`Immediate Tasks - ${AllImmediateTasks?.length}`}
                                        </h5>
                                        <span className='pull-right hreflink' onClick={() => setCurrentView("Home")}>Return To Home</span>
                                    </div>
                                    {AllImmediateTasks?.length > 0 ?
                                        <>
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover {...getTablePropsAllImmediate()} >
                                                <thead className="fixed-Header">
                                                    {headerGroupsAllImmediate?.map((headerGroup: any) => (
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
                                                                    {/* <Filter column={column} /> */}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageAllImmediate?.length > 0 ? <tbody {...getTableBodyPropsAllImmediate()}>
                                                    {pageAllImmediate?.map((row: any) => {
                                                        prepareRowAllImmediate(row);
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
                                            <nav className="pull-right">
                                                <Pagination>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => previousPageAllImmediate()} disabled={!canPreviousPageAllImmediate}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndexAllImmediate + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPageAllImmediate()} disabled={!canNextPageAllImmediate}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleRight
                                                                    aria-hidden={true}

                                                                />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    {/* <Col md={2}>
                                                        <Input
                                                            type='select'
                                                            value={pageSizeAllImmediate}
                                                            onChange={onChangeInSelectAllImmediate}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSizeAllImmediate) => (
                                                                <option key={pageSizeAllImmediate} value={pageSizeAllImmediate}>
                                                                    Show {pageSizeAllImmediate}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col> */}
                                                </Pagination>
                                            </nav>
                                        </>
                                        : <div className='text-center full-width'>
                                            <span>No Immediate Tasks Available</span>
                                        </div>}
                                </div>
                            </div>
                        </article> : ''}
                        {currentView == 'AllEmailTasks' ? <article className="row">
                            <div>
                                <div className='' >
                                    <div className="col-md-12 clearfix">
                                        <h5 className="d-inline-block">
                                            {`Email-Notification's Tasks - ${AllEmailTasks?.length}`}
                                        </h5>
                                        <span className='pull-right hreflink' onClick={() => setCurrentView("Home")}>Return To Home</span>
                                    </div>
                                    {AllEmailTasks?.length > 0 ?
                                        <>
                                            <Table className={updateContent ? "SortingTable mb-0" : "SortingTable mb-0"} hover {...getTablePropsAllEmail()} >
                                                <thead className="fixed-Header">
                                                    {headerGroupsAllEmail?.map((headerGroup: any) => (
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
                                                                    {/* <Filter column={column} /> */}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </thead>
                                                {pageAllEmail?.length > 0 ? <tbody {...getTableBodyPropsAllEmail()}>
                                                    {pageAllEmail?.map((row: any) => {
                                                        prepareRowAllEmail(row);
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
                                            <nav className="pull-right">
                                                <Pagination>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => previousPageAllEmail()} disabled={!canPreviousPageAllEmail}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndexAllEmail + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPageAllEmail()} disabled={!canNextPageAllEmail}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleRight
                                                                    aria-hidden={true}

                                                                />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    {/* <Col md={2}>
                                                        <Input
                                                            type='select'
                                                            value={pageSizeAllEmail}
                                                            onChange={onChangeInSelectAllEmail}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSizeAllEmail) => (
                                                                <option key={pageSizeAllEmail} value={pageSizeAllEmail}>
                                                                    Show {pageSizeAllEmail}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col> */}
                                                </Pagination>
                                            </nav>
                                        </>
                                        : <div className='text-center full-width'>
                                            <span>No E-Mail Tasks Available</span>
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
            {isSendEODReport && (<SendEmailEODReport WorkingTask={AllWorkingDayData} close={closeEODReport} Context={props?.props?.Context}/>)}

        </>
    )
}
export default React.memo(TaskDashboard)