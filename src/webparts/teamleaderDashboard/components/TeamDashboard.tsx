import React from 'react'
import $ from 'jquery';
import "@pnp/sp/sputilities";
import * as Moment from "moment";
import pnp, { sp, Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import PageLoader from '../../../globalComponents/pageLoader';
import TeamLeaderHeader from '../../../globalComponents/TeamLeaderHeaderSection/TeamLeaderHeader';
import TeamLeaderPieChart from '../../../globalComponents/TeamLeaderHeaderSection/TeamLeaderPieChart';
import TaskDistribution from './TaskDistribution'
import TimeSummary from './TimeSummary';
var taskUsers: any = [];
var AllTeamLeadersGroup: any = [];
var siteConfig: any = [];
var AllteamMemberTask: any = [];
var AllteamMemberTaskPieChart: any = []
var allTaskteamleader: any = [];
var allTaskteamleaderPieChart: any = [];
var AllListId: any = {}
var AllTasks: any = [];
var timesheetListConfig: any = [];
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
var currentUserId: ''; var currentUser: any = [];
var currentuserdatabackup: any;
var backupTaskArray: any = {
    allTasks: []
};




const mycontext: any = React.createContext({ AllListId: {}, context: {}, AllTasks: [], currentUserId: {}, taskUsers: [] });
function TeamDashboard(props: any) {
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [currentUserTask, setcurrentUserTask] = React.useState([])
    const [pieChartData, setPieChartData] = React.useState([]);
    const [selectedMember, setSelectedMember]: any = React.useState();
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [TaskDistributionArray, setTaskDistributionArray] = React.useState([])


    React.useEffect(() => {
        try {
            isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
            isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
        } catch (error: any) {
            console.log(error)
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

        getCurrentUserDetails();
        try {
            $('#spPageCanvasContent').removeClass();
            $('#spPageCanvasContent').addClass('hundred')
            $('#workbenchPageContent').removeClass();
            $('#workbenchPageContent').addClass('hundred')
        } catch (e) {
            console.log(e);
        }

    }, []);

    const getCurrentUserDetails = async () => {
        try {
            currentUserId = props?.props?.pageContext?.legacyPageContext?.userId
            taskUsers = await loadTaskUsers();
            let TeamLeaders: any = [];
            taskUsers?.map((item: any) => {
                item.isAdmin = false;
                if (item?.TeamLeader != undefined) {
                    if (!TeamLeaders?.find((obj: any) => obj.Id === item?.TeamLeader?.Id)) {
                        item.TeamLeader.childs = [];
                        TeamLeaders.push(item.TeamLeader)
                    }
                    TeamLeaders?.map((Leader: any) => {
                        if (Leader?.Id == item?.TeamLeader?.Id) {
                            Leader.childs.push(item);
                        }
                    })
                }
                if (currentUserId == item?.AssingedToUser?.Id) {
                    currentUser = item;
                    currentUser.isLead = false;
                    setCurrentUserData(item);
                    currentuserdatabackup = item
                }
                item.expanded = false;
            })
            AllTeamLeadersGroup = TeamLeaders
            TeamLeaders?.map((Leader: any) => {
                Leader?.childs.sort((a: any, b: any) => {
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
                if (Leader?.Id == currentUser?.Id) {
                    currentUser.isLead = true;
                    Leader.isLead = true;
                    Leader = { ...currentUser, ...Leader }
                    let leadercOPY = { ...Leader }
                    setCurrentUserData(leadercOPY);
                    currentuserdatabackup = leadercOPY

                }
            })


            GetMetaData();
        } catch (error) {
            console.log(error)
        }
        console.log(AllTeamLeadersGroup);


    }
    // const getTeamLeadsMember=(TeamLead:any)=>{
    //     let completeTeam: any=[];
    //     if(TeamLead?.Id!=undefined){
    //         completeTeam.push(TeamLead?.AssingedToUser?.Id);
    //         if(TeamLead?.childs?.length>0){
    //             TeamLead?.childs?.map((child:any)=>{
    //                 completeTeam.push(child?.AssingedToUser?.Id)
    //             }) 
    //         }
    //     }
    //     let teamsTask:any={};
    //     console.log(completeTeam);
    //     setAllTeamMembers(completeTeam);
    //     if(AllTasks?.length>0 && completeTeam?.length>0&& isTeamLeader==true){
    //         AllTasks?.map((task:any)=>{
    //             let isTeamsTask =false;
    //             completeTeam?.map((teamMemberId:any)=>{
    //                 let userAssigned= task?.AssignedToIds?.includes(teamMemberId);
    //                 if(userAssigned){
    //                     if(teamsTask[teamMemberId]==undefined){
    //                         teamsTask[teamMemberId]=[task];
    //                     }else{
    //                         teamsTask[teamMemberId].push(task);
    //                     }
    //                 }
    //                 isTeamsTask=userAssigned;
    //             })
    //             if(isTeamsTask){
    //                 if(teamsTask["AllTasks"]==undefined){
    //                     teamsTask["AllTasks"]=[task];
    //                 }else{
    //                     teamsTask["AllTasks"].push(task);
    //                 }
    //             }
    //         })
    //     }
    //     setPageLoader(false);
    //     console.log(teamsTask);
    // }
    const allCurrentUserTask = () => {
        console.log(currentuserdatabackup)
        console.log(currentUserData)
        let LoginUsertask = AllTasks.filter((items: any) => items?.AssignedToIds?.find((id: any) => id == currentuserdatabackup?.AssingedToUserId))
        let TaskDistributionArray: any = AllTasks.filter((items: any) => items?.ResponsibleTeamMember?.find((id: any) => id == currentuserdatabackup?.AssingedToUserId))
        setTaskDistributionArray(TaskDistributionArray)
        let piechartloginUserDATA = AllTasks.filter((items: any) => items?.AllTaskMember?.find((id: any) => id == currentuserdatabackup?.AssingedToUserId))
        if (currentuserdatabackup.isLead) {
            currentuserdatabackup?.childs?.map((childdata: any) => {

                let child = AllTasks.filter((items: any) => items?.AssignedToIds?.find((id: any) => id == childdata?.AssingedToUserId))
                AllteamMemberTask = AllteamMemberTask.concat(child)

                let childPieChart = AllTasks.filter((items: any) => items?.AllTaskMember?.find((id: any) => id == childdata?.AssingedToUserId))
                AllteamMemberTaskPieChart = AllteamMemberTaskPieChart.concat(childPieChart)
            })
        }
        console.log(TaskDistributionArray)
        console.log(AllteamMemberTask)
        console.log(LoginUsertask)
        allTaskteamleader = allTaskteamleader.concat(LoginUsertask, AllteamMemberTask)
        allTaskteamleaderPieChart = allTaskteamleaderPieChart.concat(piechartloginUserDATA, AllteamMemberTaskPieChart)
        setcurrentUserTask(allTaskteamleader)
        setPageLoader(false)
        setPieChartData(allTaskteamleaderPieChart)
    }
    React.useMemo(() => {
        console.log(selectedMember)
        if (selectedMember != null || undefined) {
            if (selectedMember.isLead != true) {
                let selectedteamMemberpieChart = AllteamMemberTaskPieChart?.filter((items: any) => items?.AllTaskMember?.find((id: any) => id == selectedMember?.AssingedToUserId))
                let selectedmemberAllTask = AllteamMemberTask?.filter((items: any) => items?.AssignedToIds?.find((id: any) => id == selectedMember?.AssingedToUserId))
                setcurrentUserTask(selectedmemberAllTask)

                setPieChartData(selectedteamMemberpieChart)
            } else {
                setcurrentUserTask(AllteamMemberTask)
                setPieChartData(AllteamMemberTaskPieChart)
            }
        }

    }, [selectedMember])
    const loadTaskUsers = async () => {
        setPageLoader(true)
        let taskUser;
        if (AllListId?.TaskUsertListID != undefined) {
            try {
                let web = new Web(AllListId?.siteUrl);
                taskUser = await web.lists
                    .getById(AllListId?.TaskUsertListID)
                    .items
                    .select("Id,UserGroupId,Suffix,Title,Email,TeamLeader/Id,TeamLeader/Title,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=TeamLeader,AssingedToUser,Approver")
                    .get();
            }
            catch (error) {
                return Promise.reject(error);
            }
            return taskUser;
        }

    }
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
        }


    };

    const LoadAllSiteTasks = function () {

        let AllSiteTasks: any = [];

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
                            .items.select("ID", "Title", "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "EstimatedTimeDescription", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Body", "PriorityRank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Services/ItemType", "Editor/Title", "Modified")
                            .expand("TeamMembers", "Approver", "ParentTask", "AssignedTo", "TaskCategories", "Author", "ResponsibleTeam", "TaskType", "Component", "Services", "Editor")
                            .getAll().then((data: any) => {
                                smartmeta = data;
                                smartmeta.map((task: any) => {
                                    task.AllTeamMember = [];
                                    task.AllTaskMember = [];
                                    task.TaskDistribution = [];
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
                                    task["siteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                                    task.TeamMembersSearch = "";
                                    task.componentString =
                                        task.Component != undefined &&
                                            task.Component != undefined &&
                                            task.Component.length > 0
                                            ? getComponentasString(task.Component)
                                            : "";
                                    task.TaskID = globalCommon.getTaskId(task);
                                    task.ApproverIds = [];
                                    task?.Approver?.map((approverUser: any) => {
                                        task.ApproverIds.push(approverUser?.Id);
                                    })
                                    task.AssignedToIds = [];
                                    task?.AssignedTo?.map((assignedUser: any) => {
                                        task.AssignedToIds.push(assignedUser.Id)
                                        task.AllTaskMember.push(assignedUser.Id)
                                        task.TaskDistribution.push(assignedUser.Id)
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
                                        task.AllTaskMember.push(taskUser.Id)
                                        task.TaskDistribution.push(taskUser.Id)
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
                                                task.AllTeamMember.push(newuserdata);
                                            }
                                        });
                                    });
                                    task.ResponsibleTeamMember = []
                                    task.ResponsibleTeam?.map((items: any) => {
                                        task.ResponsibleTeamMember.push(items.Id)
                                        task.AllTaskMember.push(items.Id)
                                    })

                                    AllSiteTasks.push(task)
                                });
                                arraycount++;
                            });
                        let currentCount = siteConfig?.length;
                        if (arraycount === currentCount) {
                            AllTasks = AllSiteTasks;
                            allCurrentUserTask()
                            const params = new URLSearchParams(window.location.search);
                            let query = params.get("UserId");
                            let userFound = false;
                            if (query != undefined && query != null && query != '') {
                                taskUsers.map((user: any) => {
                                    if (user?.AssingedToUserId == query) {
                                        userFound = true;

                                    }
                                })
                                if (userFound == false) {
                                    if (confirm("User Not Found , Do you want to continue to your Dashboard?")) {

                                    }
                                }
                            } else {

                            }
                            backupTaskArray.allTasks = AllSiteTasks;
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
    // const sortOnCreated = (Array: any) => {
    //   Array.sort((a: any, b: any) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
    //   return Array;
    // }
    // const checkUserExistence = (item: any, Array: any) => {
    //   let result = false;
    //   Array?.map((checkItem: any) => {
    //       if (checkItem?.Title == item) {
    //           result = true;
    //       }
    //   })
    //   return result;
    // }
    const getComponentasString = function (results: any) {
        var component = "";
        $.each(results, function (cmp: any) {
            component += cmp.Title + "; ";
        });
        return component;
    };

    return (
        <>
            <mycontext.Provider value={{ ...mycontext, AllListId: AllListId, context: props?.props?.Context, AllTasks: AllTasks, currentUserId: currentUserData, taskUsers: taskUsers }}>
                <div className="Dashboardsecrtion">
                    <div className="dashboard-colm">
                        <aside className="sidebar">
                            <section className="sidebar__section sidebar__section--menu">
                                <nav className="nav__item">
                                    <ul className="nav__list">
                                        <li id="DefaultViewSelectId" className="nav__item ">
                                            <div className="nav__text" onClick={() => setSelectedMember(currentUserData)}>
                                                {currentUserData.Title}
                                            </div>

                                            {currentUserData?.isLead && currentUserData?.childs?.length > 0 && currentUserData?.childs?.map((teammember: any) => {
                                                return (
                                                    <div onClick={() => setSelectedMember(teammember)}>
                                                        {teammember.Title}
                                                    </div>
                                                )
                                            })

                                            }


                                        </li>

                                    </ul>
                                </nav>
                            </section>

                        </aside>
                        <div className="dashboard-content ps-2 full-width">
                            <article className="row">
                                <div className="col-sm-12">
                                    <TeamLeaderHeader allTaskData={currentUserTask} selectedMember={selectedMember} />
                                </div>
                                <div className="col-sm-12">
                                    <TeamLeaderPieChart allTaskData={pieChartData} />
                                </div>
                                <div className='col-sm-12'>
                                    {currentUserData.Title != undefined && <TimeSummary selectedMember={selectedMember} />}
                                </div>
                            </article>
                            {currentUserData.isLead && TaskDistributionArray.length > 0 && <TaskDistribution TaskDistributionArray={TaskDistributionArray} />}
                        </div>

                    </div>
                </div>
                {pageLoaderActive ? <PageLoader /> : ''}
            </mycontext.Provider>
        </>
    )
}

export default TeamDashboard
export { mycontext }