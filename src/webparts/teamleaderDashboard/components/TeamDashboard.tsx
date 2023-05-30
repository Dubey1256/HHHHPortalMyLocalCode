import React from 'react'
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
import TeamLeaderHeader from '../../../globalComponents/TeamLeaderHeaderSection/TeamLeaderHeader';
import TeamLeaderPieChart from '../../../globalComponents/TeamLeaderHeaderSection/TeamLeaderPieChart';
var taskUsers: any = [];
var AllTeamLeadersGroup: any = [];
var siteConfig: any = [];
var isTeamLeader=false;
var AllTaskTimeEntries: any = [];
var AllTasks: any = [];
var timesheetListConfig: any = [];
var currentUserId: '';var currentUser: any = [];
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
function TeamDashboard(props:any) {
  const [currentUserData, setCurrentUserData]: any = React.useState({});
  const [AllTeamMembers, setAllTeamMembers] = React.useState([]);
  const [AllTeamLeaders, setAllTeamLeaders] = React.useState([]);
  const [selectedTeamLeader, setSelectedTeamLeader] = React.useState({});
  const [showContent, setShowContent] = React.useState(false);


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
// Current User ,Task User and Grouped User
const getCurrentUserDetails = async () => {
    try {
        currentUserId = props?.props?.pageContext?.legacyPageContext?.userId
        taskUsers = await loadTaskUsers();
        let TeamLeaders: any=[];
       
        taskUsers?.map((item: any) => {
            item.isAdmin = false;
              if(item?.TeamLeader!=undefined){
                  if(!TeamLeaders?.find((obj:any) => obj.Id === item?.TeamLeader?.Id)){
                      item.TeamLeader.childs=[];
                      TeamLeaders.push(item.TeamLeader)
                  }
                  TeamLeaders?.map((Leader:any)=>{
                      if(Leader?.Id==item?.TeamLeader?.Id){
                          Leader.childs.push(item);
                      }
                  })
              }
            if (currentUserId == item?.AssingedToUser?.Id) {
                currentUser = item;
                setCurrentUserData(item);
            }
            item.expanded = false;
        })
        AllTeamLeadersGroup=TeamLeaders
        TeamLeaders?.map((Leader:any)=>{
            if(Leader?.Id==currentUser?.Id){
                isTeamLeader=true;
                setSelectedTeamLeader(Leader);
            }
        })
        setShowContent(isTeamLeader)
        if(isTeamLeader==false){
          alert("You are not authorized to visit this page.")
        }
        
        GetMetaData();
    } catch (error) {
        console.log(error)
    }
    console.log(AllTeamLeadersGroup);
    console.log(selectedTeamLeader);
  }
const getTeamLeadsMember=(TeamLead:any)=>{

}
const loadTaskUsers = async () => {
  let taskUser;
  if (AllListId?.TaskUsertListID != undefined) {
      try {
          let web = new Web(AllListId?.siteUrl);
          taskUser = await web.lists
              .getById(AllListId?.TaskUsertListID)
              .items
              .select("Id,UserGroupId,Suffix,Title,Email,TeamLeader/Id,TeamLeader/Title,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=TeamLeader,AssingedToUser,Approver")
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
// Region end
// Load Metadata 
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
// End Metadata
// All Sites Task
const LoadAllSiteTasks = function () {

  let AllSiteTasks: any = [];
  let approverTask: any = [];
  let SharewebTask: any = [];
  let AllImmediates: any = [];
  let AllEmails: any = [];
  let AllBottleNeckTasks: any = [];
  let AllPriority:any=[];
  let query =
      "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
  let Counter = 0;
  let web = new Web(AllListId?.siteUrl);
  let arraycount = 0;
  try {
      if (currentUserId != undefined && siteConfig?.length > 0&&showContent) {

          siteConfig.map(async (config: any) => {
              if (config.Title != "SDC Sites") {
                  let smartmeta = [];
                  await web.lists
                      .getById(config.listId)
                      .items.select("ID", "Title", "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "EstimatedTimeDescription", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "SharewebTaskLevel1No", "SharewebTaskLevel2No", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "SharewebCategories/Id", "SharewebCategories/Title", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Body", "Priority_x0020_Rank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Services/ItemType", "Editor/Title", "Modified")
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
                              task["siteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
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
                                          task.AllTeamMember.push(newuserdata);
                                      }
                                  });
                              });

                              const isBottleneckTask = checkUserExistence('Bottleneck', task?.SharewebCategories);
                              const isImmediate = checkUserExistence('Immediate', task?.SharewebCategories);
                              const isEmailNotification = checkUserExistence('Email Notification', task?.SharewebCategories);
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
                              if (task.ClientActivityJson != undefined) {
                                  SharewebTask.push(task)
                              }
                              if(parseInt(task.Priority_x0020_Rank)>=8&&parseInt(task.Priority_x0020_Rank)<=10){
                                  AllPriority.push(task);
                              }
                              AllSiteTasks.push(task)
                          });
                          arraycount++;
                      });
                  let currentCount = siteConfig?.length;
                  if (arraycount === currentCount) {
                      AllTasks = AllSiteTasks;
                      backupTaskArray.assignedApproverTasks = approverTask;
                      // setAllPriorityTasks(sortOnCreated(AllPriority))
                      // setAllImmediateTasks(sortOnCreated(AllImmediates));
                      // setAssignedApproverTasks(sortOnCreated(approverTask));
                      // setAllEmailTasks(sortOnCreated(AllEmails));
                      // setAllSitesTask(sortOnCreated(AllSiteTasks));
                      // setSharewebTasks(sortOnCreated(SharewebTask));
                      // setAllBottleNeck(sortOnCreated(AllBottleNeckTasks));
                      const params = new URLSearchParams(window.location.search);
                      let query = params.get("UserId");
                      let userFound = false;
                      if (query != undefined && query != null && query != '') {
                          taskUsers.map((user: any) => {
                              if (user?.AssingedToUserId == query) {
                                  userFound = true;
                                 // changeSelectedUser(user)
                              }
                          })
                          if (userFound == false) {
                              if (confirm("User Not Found , Do you want to continue to your Dashboard?")) {
                                 // filterCurrentUserTask()
                              }
                          }
                      } else {
                         // filterCurrentUserTask();
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
const sortOnCreated = (Array: any) => {
  Array.sort((a: any, b: any) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
  return Array;
}
const checkUserExistence = (item: any, Array: any) => {
  let result = false;
  Array?.map((checkItem: any) => {
      if (checkItem?.Title == item) {
          result = true;
      }
  })
  return result;
}
const getComponentasString = function (results: any) {
  var component = "";
  $.each(results, function (cmp: any) {
      component += cmp.Title + "; ";
  });
  return component;
};
// Region End
  return (
<>
{showContent?   <div className="Dashboardsecrtion">
            <div className="dashboard-colm">
              <aside className="sidebar">
                <section className="sidebar__section sidebar__section--menu">
                  <nav className="nav__item">
                    <ul className="nav__list">
                      <li id="DefaultViewSelectId" className="nav__item ">
                      <div className="nav__text">
                         Test
                        </div>
                      </li>
                     
                    </ul>
                  </nav>
                </section>
            
              </aside>
              <div className="dashboard-content ps-2 full-width">
                <article className="row">
               <div className="col-md-12">
                <TeamLeaderHeader/>
               </div>
               <div className="col-md-12">
                <TeamLeaderPieChart />
               </div>
                </article>
              </div>
             
            </div>
          </div>:
          <div>Access Denied</div>        }</>
  )
}

export default TeamDashboard