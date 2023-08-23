import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InlineEditingcolumns from "../../projectmanagementOverviewTool/components/inlineEditingcolumns";
import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaChevronDown, FaChevronRight, FaSort, FaSortDown, FaSortUp, } from "react-icons/fa";
import { useTable, useSortBy, useFilters, useExpanded, usePagination, HeaderGroup, } from "react-table";
import { Filter, DefaultColumnFilter, } from "../../projectmanagementOverviewTool/components/filters";
import { FaAngleDown, FaAngleUp, FaHome } from "react-icons/fa";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import { Web } from "sp-pnp-js";
import EditProjectPopup from "../../projectmanagementOverviewTool/components/EditProjectPopup";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import * as Moment from "moment";
import {
  ColumnDef,
} from "@tanstack/react-table";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import axios, { AxiosResponse } from "axios";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import TagTaskToProjectPopup from "./TagTaskToProjectPopup";
import CreateTaskFromProject from "./CreateTaskFromProject";
import * as globalCommon from "../../../globalComponents/globalCommon";
//// import PortfolioTagging from "../../projectmanagementOverviewTool/components/PortfolioTagging"; // replace
import ServiceComponentPortfolioPopup from "../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import CommentCard from "../../../globalComponents/Comments/CommentCard";
import SmartInformation from "../../taskprofile/components/SmartInformation";
import Accordion from 'react-bootstrap/Accordion';
//import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import { reject } from "lodash";
var QueryId: any = "";
let linkedComponentData: any = [];
let smartComponentData: any = [];
let portfolioType = "";
var AllUser: any = [];
var siteConfig: any = [];
let headerOptions: any = {
  openTab: true,
  teamsIcon: true
}
var allSmartInfo: any = [];
var DynamicData: any = {}
var AllSitesAllTasks: any = [];
var ChildData: any = []
var Parent: any = []
var SubChild: any = []
var AllData: any = []
let AllComponentData: any = []
var AllListId: any = {};
var backupAllTasks: any = [];
var MasterListData: any = []
//var isCall = false;
var MyAllData: any = []
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
const ProjectManagementMain = (props: any) => {
  const [item, setItem] = React.useState({});
  const [AllTaskUsers, setAllTaskUsers] = React.useState([]);
  const [icon, seticon] = React.useState(false);
  const [isCall, setIsCall] = React.useState(false);
  const [ShareWebCoseticonmponent, setShareWebComponent] = React.useState("");
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [AllTasks, setAllTasks] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
  const [isOpenCreateTask, setisOpenCreateTask] = React.useState(false);
  const [Masterdata, setMasterdata] = React.useState<any>({});
  const [passdata, setpassdata] = React.useState("");
  const [projectTitle, setProjectTitle] = React.useState("");
  const [count, setCount] = React.useState(0)
  const [projectId, setProjectId] = React.useState(null);
  const [starIcon, setStarIcon]: any = React.useState(false);
  const [createTaskId, setCreateTaskId] = React.useState({});
  const [isSmartInfoAvailable, setIsSmartInfoAvailable]: any = React.useState(false);
  // const[allSmartInfo,setAllSmartInfo]=React.useState([])
  const [remark, setRemark] = React.useState(false)
  const [remarkData, setRemarkData] = React.useState(null)
  const [editSmartInfo, setEditSmartInfo] = React.useState(false)
  const StatusArray = [
    { value: 1, status: "01% For Approval", taskStatusComment: "For Approval" },
    { value: 2, status: "02% Follow Up", taskStatusComment: "Follow Up" },
    { value: 3, status: "03% Approved", taskStatusComment: "Approved" },
    { value: 5, status: "05% Acknowledged", taskStatusComment: "Acknowledged" },
    { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
    { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
    { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
    { value: 90, status: "90% Project completed", taskStatusComment: "Task completed" },
    { value: 93, status: "93% For Review", taskStatusComment: "For Review" },
    { value: 96, status: "96% Follow-up later", taskStatusComment: "Follow-up later" },
    { value: 99, status: "99% Completed", taskStatusComment: "Completed" },
    { value: 100, status: "100% Closed", taskStatusComment: "Closed" }
  ]
  const getPercentCompleteTitle = (percent: any) => {
    let result = '';
    StatusArray?.map((status: any) => {
      if (status?.value == percent) {
        result = status?.status;
      }
    })
    if (result.length <= 0) {
      result = percent + "% Completed"
    }
    return result
  }
  const [expendcollapsAccordion, setExpendcollapsAccordion]: any =
    React.useState({
      description: false,
      background: false,
      deliverables: false,
      idea: false,
    });
  const [sidebarStatus, setSidebarStatus] = React.useState({
    sideBarFilter: false,
    dashboard: true,
    compoonents: true,
    services: true,
  });

  React.useEffect(() => {

    try {
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
      siteUrl: props?.props?.siteUrl,
      AdminConfigrationListID: props?.props?.AdminConfigrationListID,
      isShowTimeEntry: isShowTimeEntry,
      isShowSiteCompostion: isShowSiteCompostion,
      TaskTypeID:props?.props?.TaskTypeID
    }
    if (props?.props?.SmartInformationListID != undefined) {
      setIsSmartInfoAvailable(true)
    }

    getQueryVariable((e: any) => e);

    loadAllSmartInformation().then((Data: any) => {
      LoadAllSiteAllTasks()
    }).catch((error: any) => {
      LoadAllSiteAllTasks()
    })

    try {
      $("#spPageCanvasContent").removeClass();
      $("#spPageCanvasContent").addClass("hundred");
      $("#workbenchPageContent").removeClass();
      $("#workbenchPageContent").addClass("hundred");
    } catch (e) {
      console.log(e);
    }
  }, []);
  var showProgressBar = () => {
    $(" #SpfxProgressbar").show();
  };
  var showProgressHide = () => {
    $(" #SpfxProgressbar").hide();
  };
  const loadAllSmartInformation = async () => {
    return new Promise((resolve, reject) => {
      const web = new Web(props?.siteUrl);
      // var Data = await web.lists.getByTitle("SmartInformation")
      web.lists.getById(AllListId?.SmartInformationListID)
        .items.select('Id,Title,Description,SelectedFolder,URL,Acronym,InfoType/Id,InfoType/Title,Created,Modified,Author/Name,Author/Title,Author/Title,Author/Id,Editor/Name,Editor/Title,Editor/Id')
        .expand("InfoType,Author,Editor").filter("(InfoType/Title eq 'Remarks')")
        .get().then((Data: any) => {
          console.log(Data)
          allSmartInfo = [];
          allSmartInfo = Data
          resolve(Data)
        }).catch((error: any) => {
          reject(error)
        })

    })


  }
  const getQueryVariable = async (variable: any) => {
    const params = new URLSearchParams(window.location.search);
    let query = params.get("ProjectId");
    QueryId = query;
    await loadAllComponent()
    AllUser = await loadTaskUsers();
    setAllTaskUsers(AllUser);
    setProjectId(QueryId);
    GetMasterData();
    GetMetaData();
    console.log(query); //"app=article&act=news_content&aid=160990"
    return false;
  };
  const loadTaskUsers = async () => {
    let taskUser;
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
  }

  const GetMasterData = async () => {
    if (AllListId?.MasterTaskListID != undefined) {
      try {
        let web = new Web(props?.siteUrl);
        await web.lists
          .getById(AllListId?.MasterTaskListID)
          .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "Deliverable_x002d_Synonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "Admin_x0020_Notes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebComponent/Id", "SharewebCategories/Id", "SharewebCategories/Title", "Priority_x0020_Rank", "Reference_x0020_Item_x0020_Json", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Services/Id", "Services/Title", "Services/ItemType", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "Item_x002d_Image", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
          .expand("ClientCategory", "ComponentCategory", "AssignedTo", "Component", "Services", "AttachmentFiles", "Author", "Editor", "Team_x0020_Members", "SharewebComponent", "SharewebCategories", "Parent")
          .getById(QueryId)
          .get().then((fetchedProject: any) => {
            if ((fetchedProject.PercentComplete != undefined)) {
              fetchedProject.PercentComplete = (fetchedProject?.PercentComplete * 100).toFixed(0)
            }
            // if (taskUsers.Body != undefined) {
            //   taskUsers.Body = taskUsers.Body.replace(/(<([^>]+)>)/gi, "");
            // }


            if (fetchedProject?.DueDate != undefined) {
              fetchedProject.DisplayDueDate = fetchedProject.DueDate != null
                ? Moment(fetchedProject.DueDate).format("DD/MM/YYYY")
                : "";
            } else {
              fetchedProject.DisplayDueDate = '';
            }
            fetchedProject.smartService = [];
            fetchedProject?.ServicesId?.map((item: any) => {
              MasterListData?.map((portfolio: any) => {
                if (portfolio?.Id == item) {
                  portfolio.filterActive = false;
                  fetchedProject?.smartService?.push(portfolio);
                }
              });
            });
            fetchedProject.smartComponent = [];
            fetchedProject?.ComponentId?.map((item: any) => {
              MasterListData?.map((portfolio: any) => {
                if (portfolio?.Id == item) {
                  portfolio.filterActive = false;
                  fetchedProject?.smartComponent?.push(portfolio);
                }
              });
            });
            fetchedProject.AssignedUser = [];
            fetchedProject.AssignedTo = [];
            fetchedProject.Team_x0020_Members = [];
            fetchedProject.Responsible_x0020_Team = [];
            AllUser?.map((user: any) => {
              if (fetchedProject?.Team_x0020_MembersId != undefined) {
                fetchedProject?.Team_x0020_MembersId?.map((taskUser: any) => {
                  if (user.AssingedToUserId == taskUser) {
                    user.Id = user?.AssingedToUserId;
                    fetchedProject?.Team_x0020_Members?.push(user)
                  }
                })
              }
              if (fetchedProject?.Responsible_x0020_TeamId != undefined) {
                fetchedProject?.Responsible_x0020_TeamId?.map((taskUser: any) => {
                  if (user.AssingedToUserId == taskUser) {
                    user.Id = user.AssingedToUserId;
                    fetchedProject?.Responsible_x0020_Team?.push(user)
                  }
                })
              }
              if (fetchedProject.AssignedToId != undefined) {
                fetchedProject.AssignedToId.map((taskUser: any) => {
                  var newuserdata: any = {};
                  if (user.AssingedToUserId == taskUser) {
                    user.Id = user.AssingedToUserId;
                    fetchedProject.AssignedTo.push(user);
                    newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                    newuserdata["Suffix"] = user?.Suffix;
                    newuserdata["Title"] = user?.Title;
                    newuserdata["UserId"] = user?.AssingedToUserId;
                    fetchedProject["Usertitlename"] = user?.Title;
                  }
                  fetchedProject?.AssignedUser?.push(newuserdata);
                });
              }
            });
            setProjectTitle(fetchedProject?.Title);
            if (fetchedProject?.smartService != undefined) {
              smartComponentData = fetchedProject.smartService
            }
            if (fetchedProject?.smartComponent != undefined) {
              linkedComponentData = fetchedProject.smartComponent
            }
            setMasterdata((prev: any) => fetchedProject);
          })


      } catch (error) {
        console.log(error)
      }
    } else {
      alert('Master Task List Id not present')
    }
  };

  const callBackData = React.useCallback((elem: any, ShowingData: any) => {


  }, []);


  const CallBack = React.useCallback((item: any) => {
    setisOpenEditPopup(false);
  }, []);

  const GetMetaData = async () => {
    if (AllListId?.SmartMetadataListID != undefined) {
      try {
        let web = new Web(props?.siteUrl);
        let smartmeta = [];
        let TaxonomyItems = [];
        smartmeta = await web.lists
          .getById(AllListId?.SmartMetadataListID)
          .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
          .top(5000)
          .filter("TaxType eq 'Sites'")
          .expand("Parent")
          .get();
        if (smartmeta.length > 0) {
          smartmeta?.map((site: any) => {
            if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.IsVisible == true) {
              siteConfig.push(site)
            }
          })
          LoadAllSiteTasks();
        } else {
          siteConfig = smartmeta;
        }

      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Smart Metadata List Id not present')
      siteConfig = [];
    }
  };

  const EditPopup = React.useCallback((item: any) => {
    setisOpenEditPopup(true);
    setpassdata(item);
  }, []);

  const untagTask = async (item: any) => {
    let confirmation = confirm(
      "Are you sure you want to untag " + `${item?.Shareweb_x0020_ID} - ${item?.Title}` + " from this project ?"
    );
    if (confirmation == true) {
      const web = new Web(item?.siteUrl);
      await web.lists
        .getById(item?.listId)
        .items.getById(item?.Id)
        .update({
          ProjectId: null,
        })
        .then((e: any) => {
          LoadAllSiteTasks();
        })
        .catch((err: { message: any }) => {
          console.log(err.message);
        });
    }
  };

  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = props?.siteUrl;
    item["listName"] = "Master Tasks";
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsComponent(true);
    setSharewebComponent(item);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };

  const tagAndCreateCallBack = React.useCallback(() => {
    LoadAllSiteTasks();
  }, []);
  const CreateTask = React.useCallback(() => {
    setisOpenCreateTask(false)
  }, []);
  const inlineCallBack = React.useCallback((item: any) => {
    setAllTasks(prevTasks => {
      const updatedTasks = prevTasks.map((task: any) => {
        if (task.Id === item.Id && task.siteType === item.siteType) {
          return { ...task, ...item };
        }
        return task;
      });
      setData(updatedTasks);
      return updatedTasks;
    });
  }, []);

  const LoadAllSiteTasks = async function () {
    let taskComponent: any = [];
    let taskServices: any = [];
    if (siteConfig?.length > 0) {
      try {
        var AllTask: any = [];
        var query =
          "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        var Counter = 0;
        let web = new Web(props?.siteUrl);
        var arraycount = 0;
        siteConfig.map(async (config: any) => {

          let smartmeta = [];
          smartmeta = await web.lists
            .getById(config.listId)
            .items
            .select("Id,Title,Priority_x0020_Rank,Remark,Project/Priority_x0020_Rank,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,Events/Id,EventsId,workingThisWeek,EstimatedTime,SharewebTaskLevel1No,SharewebTaskLevel2No,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Component/Id,Component/Title,Services/Id,Services/Title,PercentComplete,ComponentId,Categories,ServicesId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
            .expand('AssignedTo,Events,Project,SmartInformation,Author,Component,Services,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory')
            .top(4999)
            .filter("ProjectId eq " + QueryId)
            .orderBy("Priority_x0020_Rank", false)
            .get();
          arraycount++;
          smartmeta.map((items: any) => {
            if (items?.SmartInformation?.length > 0) {
              allSmartInfo?.map((smart: any) => {
                if (smart?.Id == items?.SmartInformation[0]?.Id) {
                  // var smartdata=[]
                  // smartdata.push(smart)
                  items.SmartInformation = [smart]
                }

              })
            }
            items.AllTeamMember = [];
            items.HierarchyData = [];
            items.descriptionsSearch = '';
            items.siteType = config.Title;
            items.bodys = items.Body != null && items.Body.split('<p><br></p>').join('');
            if (items?.Body != undefined && items?.Body != null) {
              items.descriptionsSearch = items?.Body.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
            }
            items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
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
            if (items?.Component?.length > 0) {
              if (!taskComponent?.some((id: any) => id == items?.Component[0].Id)) {
                taskComponent.push(items?.Component[0].Id)
              }
              items.portfolio = items?.Component[0];
              items.PortfolioTitle = items?.Component[0]?.Title;
              items["Portfoliotype"] = "Component";
            }
            if (items?.Services?.length > 0) {
              if (!taskServices?.some((id: any) => id == items?.Services[0].Id)) {
                taskServices.push(items?.Services[0].Id)
              }
              items.portfolio = items?.Services[0];
              items.PortfolioTitle = items?.Services[0]?.Title;
              items["Portfoliotype"] = "Service";
            }
            items["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;

            items.TeamMembersSearch = "";
            if (items.AssignedTo != undefined) {
              items?.AssignedTo?.map((taskUser: any) => {
                AllUser.map((user: any) => {
                  if (user.AssingedToUserId == taskUser.Id) {
                    if (user?.Title != undefined) {
                      items.TeamMembersSearch =
                        items.TeamMembersSearch + " " + user?.Title;
                    }
                  }
                });
              });
            }
            items.componentString =
              items.Component != undefined &&
                items.Component != undefined &&
                items.Component.length > 0
                ? getComponentasString(items.Component)
                : "";
            items.Shareweb_x0020_ID = globalCommon.getTaskId(items);
            AllUser?.map((user: any) => {
              if (user.AssingedToUserId == items.Author.Id) {
                items.createdImg = user?.Item_x0020_Cover?.Url;
              }
              if (items.Team_x0020_Members != undefined) {
                items.Team_x0020_Members.map((taskUser: any) => {
                  var newuserdata: any = {};
                  if (user.AssingedToUserId == taskUser.Id) {
                    newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                    newuserdata["Suffix"] = user?.Suffix;
                    newuserdata["Title"] = user?.Title;
                    newuserdata["UserId"] = user?.AssingedToUserId;
                    items["Usertitlename"] = user?.Title;
                  }
                  items.AllTeamMember.push(newuserdata);
                });
              }
            });
            AllTask.push(items);
          });
          let setCount = siteConfig?.length
          if (arraycount === setCount) {
            setAllTasks(AllTask);
            setData(AllTask);
            backupAllTasks = AllTask;
            console.log(taskComponent)
            console.log(taskServices)
          }

        });
      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Site Config Length less than 0')
    }
  };
  const getComponentasString = function (results: any) {
    var component = "";
    $.each(results, function (cmp: any) {
      component += cmp.Title + "; ";
    });
    return component;
  };
  const loadAllComponent = async () => {

    let web = new Web(AllListId?.siteUrl);
    MasterListData = await web.lists
      .getById(AllListId?.MasterTaskListID)
      .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "Deliverable_x002d_Synonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "Admin_x0020_Notes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebComponent/Id", "SharewebCategories/Id", "SharewebCategories/Title", "Priority_x0020_Rank", "Reference_x0020_Item_x0020_Json", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Services/Id", "Services/Title", "Services/ItemType", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "Item_x002d_Image", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
      .expand("ClientCategory", "ComponentCategory", "AssignedTo", "Component", "Services", "AttachmentFiles", "Author", "Editor", "Team_x0020_Members", "SharewebComponent", "SharewebCategories", "Parent")
      .top(4999)
      .get()

  }
  React.useEffect(() => {
    if (Masterdata?.Id != undefined) {
      setItem(Masterdata);

      linkedComponentData = Masterdata?.smartService;
      smartComponentData = Masterdata?.smartComponent;
    }
  }, [Masterdata]);
  const EditPortfolio = (item: any, type: any) => {
    portfolioType = type;
    setSharewebComponent(item);
    setIsPortfolio(true);
  };
  const ClosePopup = () => {
    setIsCall(false)
  }
  const Call = (propsItems: any, type: any) => {
    setIsComponent(false);
    setIsPortfolio(false);
    if (type === "Service") {
      if (propsItems?.smartService?.length > 0) {
        linkedComponentData = propsItems.smartService;
        TagPotfolioToProject();
      }
    }
    if (type === "Component") {
      if (propsItems?.smartComponent?.length > 0) {
        smartComponentData = propsItems.smartComponent;
        TagPotfolioToProject();
      }
    }
    if (type === "EditPopup") {
      GetMasterData();
    }
  };


  const LoadAllSiteAllTasks = async function () {
    let AllSiteTasks: any = [];
    "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
    let Counter = 0;
    let web = new Web(AllListId?.siteUrl);
    let arraycount = 0;
    try {
      if (siteConfig?.length > 0) {

        siteConfig.map(async (config: any) => {
          if (config.Title != "SDC Sites") {
            let smartmeta = [];
            await web.lists
              .getById(config.listId)
              .items.select("ID", "Title", "ClientCategory/Id", "ClientCategory/Title", 'ClientCategory', "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "SharewebTaskLevel1No", "SharewebTaskLevel2No", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "SharewebCategories/Id", "SharewebCategories/Title", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Body", "Priority_x0020_Rank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Services/ItemType", "Modified")
              .expand("Team_x0020_Members", "Approver", "ParentTask", "ClientCategory", "AssignedTo", "SharewebCategories", "Author", "Responsible_x0020_Team", "SharewebTaskType", "Component", "Services")
              .getAll().then((data: any) => {
                smartmeta = data;
                smartmeta.map((task: any) => {
                  task.AllTeamMember = [];
                  task.HierarchyData = [];
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
                  task["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  task.TeamMembersSearch = "";
                  task.componentString =
                    task.Component != undefined &&
                      task.Component != undefined &&
                      task.Component.length > 0
                      ? getComponentasString(task.Component)
                      : "";
                  task.Shareweb_x0020_ID = globalCommon.getTaskId(task);


                  AllSiteTasks.push(task)
                });
                arraycount++;
              });
            let currentCount = siteConfig?.length;
            if (arraycount === currentCount) {
              AllSitesAllTasks = AllSiteTasks;

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

  const ChangeIcon = () => {
    seticon(!icon)
  }
  const callParentItem = (item: any) => {
    setSharewebComponent(item);
    setIsCall(true)
  }
  const TagPotfolioToProject = async () => {
    if (QueryId != undefined && AllListId?.MasterTaskListID != undefined) {
      let selectedComponent: any[] = [];
      if (smartComponentData !== undefined && smartComponentData.length > 0) {
        $.each(smartComponentData, function (index: any, smart: any) {
          selectedComponent.push(smart?.Id);
        });
      }
      let selectedService: any[] = [];
      if (linkedComponentData !== undefined && linkedComponentData.length > 0) {
        $.each(linkedComponentData, function (index: any, smart: any) {
          selectedService.push(smart?.Id);
        });
      }
      let web = new Web(props?.siteUrl);
      await web.lists
        .getById(AllListId?.MasterTaskListID)
        .items.getById(QueryId)
        .update({
          ComponentId: {
            results:
              selectedComponent !== undefined && selectedComponent?.length > 0
                ? selectedComponent
                : [],
          },
          ServicesId: {
            results:
              selectedService !== undefined && selectedService?.length > 0
                ? selectedService
                : [],
          },
        })
        .then((res: any) => {
          GetMasterData();
          smartComponentData = []
          linkedComponentData = []
          console.log(res);
        });
    }
  };
  // const toggleSideBar = () => {
  //   setSidebarStatus({ ...sidebarStatus, dashboard: !sidebarStatus.dashboard });
  //   if (sidebarStatus.dashboard == false) {
  //     $(".sidebar").attr("collapsed", "");
  //   } else {
  //     $(".sidebar").removeAttr("collapsed");
  //   }
  // };
  //React.useEffect(() => {table.getIsAllRowsExpanded(); }, [])
  const createOpenTask = (items: any) => {
    setCreateTaskId({ portfolioData: items, portfolioType: 'Component' });
    setisOpenCreateTask(true)
  }
  const openRemark = (items: any) => {
    setRemarkData(items)
    if (items.SmartInformation.length > 0) {
      setEditSmartInfo(true);
    } else {
      setEditSmartInfo(false);
    }
    setRemark(true);
  }
  const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
    if (functionType == 'close') {
      setIsComponent(false);
      setIsPortfolio(false);
    } else {
      if (Type === "Service") {
        if (DataItem.length > 0) {
          DataItem.map((selectedData: any) => {
            linkedComponentData.push(selectedData);
          })
          TagPotfolioToProject();
        }
      }
      if (Type === "Component") {
        if (DataItem?.length > 0) {
          DataItem.map((selectedData: any) => {
            smartComponentData.push(selectedData);
          })
          TagPotfolioToProject();
        }
      }
      console.log(Masterdata)
      setIsPortfolio(false);
    }
  }, [])
  const column = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        size: 7,
        canSort: false,
        placeholder: "",
        id: 'PortfolioStructureID',
        // header: ({ table }: any) => (
        //   <>
        //     <button className='border-0 bg-Ff'
        //       {...{
        //         onClick: table.getToggleAllRowsExpandedHandler(),
        //       }}
        //     >
        //       {table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
        //     </button>{" "}
        //   </>
        // ),
        cell: ({ row, getValue }) => (
          <div
            style={row.getCanExpand() ? {
              paddingLeft: `${row.depth * 5}px`,
            } : {
              paddingLeft: "18px",
            }}
          >
            <>
              {row.getCanExpand() ? (
                <span className=' border-0'
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              ) : (
                ""
              )}{" "}

              <> {row?.original?.SiteIcon != undefined ?
                <a className="hreflink" title="Show All Child" data-toggle="modal">
                  <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
                </a> : <>{row?.original?.Title != "Others" ? <div className='Dyicons'>{row?.original?.SiteIconTitle}</div> : ""}</>
              }
                <span>{row?.original?.PortfolioStructureID}</span></>

              {getValue()}
            </>
          </div>
        ),
      },
      {
        cell: ({ row }) => (
          <>
            <span>{row.original.Title}</span>
          </>
        ),
        id: "Title",
        canSort: false,
        placeholder: "",
        header: "",
        size: 15,
      },
      {
        cell: ({ row }) => (
          <>
            <span className="hreflink" onClick={() => createOpenTask(row.original)}>+</span>
          </>
        ),
        id: "Title",
        canSort: false,
        placeholder: "",
        header: "",
        size: 5,
      },
    ],
    [data]
  );
  function IndeterminateCheckbox({
    indeterminate,
    className = "",
    ...rest
  }: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);
    React.useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate]);
    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + "  cursor-pointer form-check-input rounded-0"}
        {...rest}
      />
    );
  }

  const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        header: ({ table }: any) => (
          <>
            <IndeterminateCheckbox className=" "
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />{" "}
          </>
        ),
        cell: ({ row, getValue }) => (
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
              )}

              {getValue()}
            </span>
          </>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        resetColumnFilters: false,
        resetSorting: false,
        canSort: false,
        placeholder: "",
        size: 35
      },
      {
        accessorKey: "Shareweb_x0020_ID",
        placeholder: "Task Id",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 70,
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.Shareweb_x0020_ID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} />
            </span>
          </>
        ),
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            <span className='d-flex'>
              {row.original.Services.length >= 1 ? (
                <a
                  className="hreflink text-success"
                  href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
              ) : (
                <a
                  className="hreflink"
                  href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
              )}
              {row?.original?.Body !== null && row?.original?.Body != undefined ? <InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /> : ''}
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
        accessorFn: (row) => row?.Site,
        cell: ({ row }) => (
          <span>
            <img className='circularImage rounded-circle' src={row?.original?.SiteIcon} />
          </span>
        ),
        id: "Site",
        placeholder: "Site",
        header: "",
        resetSorting: false,
        resetColumnFilters: false,
        size: 50
      },
      {
        accessorFn: (row) => row?.Portfolio,
        cell: ({ row }) => (
          <span>
            {row.original.Services.length >= 1 ? (
              <a
                className="hreflink text-success"
                data-interception="off"
                target="blank"
                href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
              >
                {row?.original?.portfolio?.Title}
              </a>
            ) : (
              <a
                className="hreflink"
                data-interception="off"
                target="blank"
                href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
              >
                {row?.original?.portfolio?.Title}
              </a>
            )}
          </span>
        ),
        id: "Portfolio",
        placeholder: "Portfolio",
        resetColumnFilters: false,
        resetSorting: false,
        header: ""
      },
      {
        accessorFn: (row) => row?.Priority_x0020_Rank,
        cell: ({ row }) => (
          <span>
            <InlineEditingcolumns
              AllListId={AllListId}
              type='Task'
              callBack={inlineCallBack}
              columnName='Priority'
              item={row?.original}
              TaskUsers={AllUser}
              pageName={'ProjectManagment'}
            />
          </span>
        ),
        placeholder: "Priority",
        id: 'Priority',
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 75
      },
      {
        accessorFn: (row) => row?.DueDate,
        cell: ({ row }) => (
          <InlineEditingcolumns
            AllListId={AllListId}
            callBack={inlineCallBack}
            columnName='DueDate'
            item={row?.original}
            TaskUsers={AllUser}
            pageName={'ProjectManagment'}
          />
        ),
        id: 'DueDate',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Due Date",
        header: "",
        size: 80
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
        accessorFn: (row) => row?.PercentComplete,
        cell: ({ row }) => (
          <span>
            <InlineEditingcolumns
              AllListId={AllListId}
              callBack={inlineCallBack}
              columnName='PercentComplete'
              item={row?.original}
              TaskUsers={AllUser}
              pageName={'ProjectManagment'}
            />
          </span>
        ),
        id: 'PercentComplete',
        placeholder: "% Complete",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        size: 55
      },
      {
        accessorFn: (row) => row?.TeamMembers?.map((elem: any) => elem.Title).join('-'),
        cell: ({ row }) => (
          <span>
            <InlineEditingcolumns
              AllListId={AllListId}
              callBack={inlineCallBack}
              columnName='Team'
              item={row?.original}
              TaskUsers={AllUser}
              pageName={'ProjectManagment'}
            />
          </span>
        ),
        id: 'TeamMembers',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "TeamMembers",
        header: "",
        size: 110
      },
      {
        accessorFn: (row) => row?.SmartInformation[0]?.Title,
        cell: ({ row }) => (
          <span style={{ display: "flex", width: "100%", height: "100%" }} className='d-flex' onClick={() => openRemark(row?.original)}>
            &nbsp; {row?.original?.SmartInformation[0]?.Title}
          </span>
        ),
        id: 'SmartInformation',
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "Remarks",
        header: '',
        size: 125
      },
      // {
      //   accessorFn: (row) => row?.Remark,
      //   cell: ({ row }) => (
      //     <div   className='svg__iconbox svg__icon--edit hreflink' onClick={()=>openRemark(row?.original)}>
      //       {/* <InlineEditingcolumns
      //         AllListId={AllListId}
      //         callBack={inlineCallBack}
      //         columnName='Remark'
      //         item={row?.original}
      //         TaskUsers={AllUser}
      //         pageName={'ProjectManagment'}
      //       /> */}
      //     </div>
      //   ),
      //   id: 'Remarks',
      //   canSort: false,
      //   resetColumnFilters: false,
      //   resetSorting: false,
      //   placeholder: "Remarks",
      //   header: "",
      //   size: 125
      // },
      {
        accessorFn: (row) => row?.Created,
        cell: ({ row }) => (
          <span>
            {row.original.Services.length >= 1 ? (
              <span className='ms-1 text-success'>{row?.original?.DisplayCreateDate} </span>
            ) : (
              <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>
            )}

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
        header: "",
        size: 125
      },
      {
        cell: ({ row }) => (
          <span className='d-flex'>
            <span
              title='Edit Task'
              onClick={() => EditPopup(row?.original)}
              className='svg__iconbox svg__icon--edit hreflink'
            ></span>
            <span
              style={{ marginLeft: '6px' }}
              title='Remove Task'
              onClick={() => untagTask(row?.original)}
              className='svg__iconbox svg__icon--cross dark hreflink'
            ></span>
          </span>
        ),
        id: 'Actions',
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 35
      },
    ],
    [data]
  );
  const clearPortfolioFilter = () => {
    let projectData = Masterdata;
    projectData?.smartComponent?.map((item: any, index: any) => {
      item.filterActive = false;
    });
    projectData?.smartService?.map((item: any, index: any) => {
      item.filterActive = false;
    });
    setMasterdata(projectData);
    setData(AllTasks);
    setSidebarStatus({ ...sidebarStatus, sideBarFilter: false });
  };
  const filterPotfolioTasks = (
    portfolio: any,
    clickedIndex: any,
    type: any
  ) => {
    setCreateTaskId({ portfolioData: portfolio, portfolioType: type });
    let projectData = Masterdata;
    let displayTasks = AllTasks;
    projectData?.smartComponent?.map((item: any, index: any) => {
      if (type == "Component" && clickedIndex == index) {
        item.filterActive = true;
        setSidebarStatus({ ...sidebarStatus, sideBarFilter: true });
        displayTasks = AllTasks.filter((items: any) => {
          if (
            items?.Component?.length > 0 &&
            items?.Component[0]?.Id == portfolio?.Id
          ) {
            return true;
          }
          return false;
        });
      } else {
        item.filterActive = false;
      }
    });
    projectData?.smartService?.map((item: any, index: any) => {
      if (type == "Service" && clickedIndex == index) {
        item.filterActive = true;
        setSidebarStatus({ ...sidebarStatus, sideBarFilter: true });
        displayTasks = AllTasks.filter((items: any) => {
          if (
            items?.Services?.length > 0 &&
            items?.Services[0]?.Id == portfolio?.Id
          ) {
            return true;
          }
          return false;
        });
      } else {
        item.filterActive = false;
      }
    });
    setMasterdata(projectData);
    setData(displayTasks);
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

  return (
    <div>
      {QueryId != "" ? (
        <>
          <div className="row">
            <div
              className="d-flex justify-content-between p-0"
            >
              <ul className="spfxbreadcrumb mb-2 ms-2 p-0">
                <li>
                  <a href={`${props?.siteUrl}/SitePages/Project-Management-Overview.aspx`}>
                    Project Management
                  </a>
                </li>
                <li>
                  {" "}
                  <a>{Masterdata.Title}</a>{" "}
                </li>
              </ul>
            </div>
          </div>
          <div className="ProjectManagementPage Dashboardsecrtion">
            <div className="dashboard-colm">
              <aside className="sidebar">
                {/* <button
              type="button"
              onClick={() => {
                toggleSideBar();
              }}
              className="collapse-toggle"
            ></button> */}
                <section className="sidebar__section sidebar__section--menu">
                  <nav className="nav__item">
                    <ul className="nav__list">
                      <li id="DefaultViewSelectId" className="nav__item ">
                        <a
                          ng-click="ChangeView('DefaultView','DefaultViewSelectId')"
                          className="nav__link border-bottom pb-1"
                        >
                          <span className="nav__icon nav__icon--home"></span>
                          <span className="nav__text">
                            Components{" "}
                            <span
                              className="float-end "
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                EditPortfolio(Masterdata, "Component")
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 48 48"
                                fill="none"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.8746 14.3436C22.8774 18.8722 22.8262 22.6308 22.7608 22.6962C22.6954 22.7616 18.9893 22.8128 14.525 22.8101C10.0606 22.8073 6.32545 22.8876 6.22467 22.9884C5.99582 23.2172 6.00541 24.6394 6.23742 24.8714C6.33182 24.9658 10.0617 25.0442 14.526 25.0455C18.9903 25.0469 22.6959 25.1009 22.7606 25.1657C22.8254 25.2304 22.8808 28.9921 22.8834 33.5248L22.8884 41.7663L23.9461 41.757L25.0039 41.7476L25.0012 33.3997L24.9986 25.0516L33.2932 25.0542C37.8555 25.0556 41.6431 25.0017 41.7105 24.9343C41.8606 24.7842 41.8537 23.0904 41.7024 22.9392C41.6425 22.8793 37.8594 22.8258 33.2955 22.8204L24.9975 22.8104L24.9925 14.4606L24.9874 6.11084L23.9285 6.11035L22.8695 6.10998L22.8746 14.3436Z"
                                  fill="#fff"
                                />
                              </svg>
                            </span>
                          </span>
                        </a>
                      </li>
                      <li className="nav__item  pb-1 pt-0">
                        <div className="nav__text">
                          {Masterdata?.smartComponent?.length > 0 ? (
                            <ul className="nav__subList scrollbarCustom pt-1 ps-0">
                              {Masterdata?.smartComponent?.map(
                                (component: any, index: any) => {
                                  return (
                                    <li
                                      className={
                                        component?.filterActive
                                          ? "nav__item bg-ee"
                                          : "nav__item"
                                      }
                                    >
                                      <span>
                                        <a
                                          className={
                                            component?.filterActive
                                              ? "hreflink "
                                              : "text-white hreflink"
                                          }
                                          data-interception="off"
                                          target="blank"
                                          onClick={() =>
                                            filterPotfolioTasks(
                                              component,
                                              index,
                                              "Component"
                                            )
                                          }
                                        >
                                          {component?.Title}
                                        </a>
                                      </span>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          ) : (
                            <div className="nontag mt-2 text-center">
                              No Tagged Component
                            </div>
                          )}
                        </div>
                      </li>
                    </ul>
                  </nav>
                </section>
                <section className="sidebar__section sidebar__section--menu">
                  <nav className="nav__item">
                    <ul className="nav__list">
                      <li
                        id="DefaultViewSelectId"
                        className="nav__item  pt-0  "
                      >
                        <a
                          ng-click="ChangeView('DefaultView','DefaultViewSelectId')"
                          className="nav__link border-bottom pb-1"
                        >
                          <span className="nav__icon nav__icon--home"></span>
                          <span className="nav__text">
                            Services{" "}
                            <span
                              className="float-end "
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                EditPortfolio(Masterdata, "Service")
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 48 48"
                                fill="none"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.8746 14.3436C22.8774 18.8722 22.8262 22.6308 22.7608 22.6962C22.6954 22.7616 18.9893 22.8128 14.525 22.8101C10.0606 22.8073 6.32545 22.8876 6.22467 22.9884C5.99582 23.2172 6.00541 24.6394 6.23742 24.8714C6.33182 24.9658 10.0617 25.0442 14.526 25.0455C18.9903 25.0469 22.6959 25.1009 22.7606 25.1657C22.8254 25.2304 22.8808 28.9921 22.8834 33.5248L22.8884 41.7663L23.9461 41.757L25.0039 41.7476L25.0012 33.3997L24.9986 25.0516L33.2932 25.0542C37.8555 25.0556 41.6431 25.0017 41.7105 24.9343C41.8606 24.7842 41.8537 23.0904 41.7024 22.9392C41.6425 22.8793 37.8594 22.8258 33.2955 22.8204L24.9975 22.8104L24.9925 14.4606L24.9874 6.11084L23.9285 6.11035L22.8695 6.10998L22.8746 14.3436Z"
                                  fill="#fff"
                                />
                              </svg>
                            </span>
                          </span>
                        </a>
                      </li>
                      <li
                        id="DefaultViewSelectId"
                        className="nav__item  pb-1 pt-0"
                      >
                        <div className="nav__text">
                          {Masterdata?.smartService?.length > 0 ? (
                            <ul className="nav__subList scrollbarCustom pt-1 ps-0">
                              {Masterdata?.smartService?.map(
                                (service: any, index: any) => {
                                  return (
                                    <li
                                      className={
                                        service?.filterActive
                                          ? "nav__item bg-ee"
                                          : "nav__item"
                                      }
                                    >
                                      <span>
                                        <a
                                          className={
                                            service?.filterActive
                                              ? "hreflink "
                                              : "text-white hreflink"
                                          }
                                          data-interception="off"
                                          target="blank"
                                          onClick={() =>
                                            filterPotfolioTasks(
                                              service,
                                              index,
                                              "Service"
                                            )
                                          }
                                        >
                                          {service?.Title}
                                        </a>
                                      </span>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          ) : (
                            <div className="nontag mt-2 text-center">
                              No Tagged Service
                            </div>
                          )}
                        </div>
                      </li>
                    </ul>
                  </nav>
                </section>
              </aside>
              <div className="dashboard-content ps-2 full-width">
                <article className="row">
                  <div className="col-md-12">
                    <section>
                      <div>
                        <div className="align-items-center d-flex justify-content-between">
                          <div className="align-items-center d-flex">
                            <h2 className="heading">
                              <img
                                className="circularImage rounded-circle "
                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Icon_Project.png"
                              />
                              <>
                                <a>{Masterdata?.Title} </a>
                              </>
                            </h2>
                            <span
                              onClick={() => EditComponentPopup(Masterdata)}
                              className="mx-2 svg__iconbox svg__icon--edit"
                              title="Edit Project"
                            ></span>
                          </div>
                          <div>
                            <div className="d-flex">
                              {isOpenCreateTask && (
                                <CreateTaskFromProject
                                  projectItem={Masterdata}
                                  SelectedProp={props?.props}
                                  pageContext={props.pageContext}
                                  projectId={projectId}
                                  callBack={CreateTask}
                                  createComponent={createTaskId}
                                />
                              )}
                              {/* {projectId && (
                            <TagTaskToProjectPopup
                              projectItem={Masterdata}
                              className="ms-2"
                              projectId={projectId}
                              callBack={tagAndCreateCallBack}
                              projectTitle={projectTitle}
                            />
                          )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section>
                      <div>
                        <div className="row">
                          <div className="col-md-12 bg-white">
                            <div className="team_member row  py-2">
                              <div className="col-md-6  pe-0">
                                <dl>
                                  <dt className="bg-fxdark">Due Date</dt>
                                  <dd className="bg-light">
                                    <span>
                                      <a>
                                        {Masterdata?.DisplayDueDate}
                                      </a>
                                    </span>
                                    <span
                                      className="pull-right"
                                      title="Edit Inline"
                                      ng-click="EditContents(Task,'editableDueDate')"
                                    >
                                      <i
                                        className="fa fa-pencil siteColor"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </dd>
                                </dl>
                                <dl>
                                  <dt className="bg-fxdark">Priority</dt>
                                  <dd className="bg-light">
                                    <a>
                                      {Masterdata.Priority != null
                                        ? Masterdata.Priority
                                        : ""}
                                    </a>
                                    <span
                                      className="hreflink pull-right"
                                      title="Edit Inline"
                                    >
                                      <i
                                        className="fa fa-pencil siteColor"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </dd>
                                </dl>
                              </div>
                              <div className="col-md-6 p-0">
                                <dl>
                                  <dt className="bg-fxdark">Assigned To</dt>
                                  <dd className="bg-light">
                                    {Masterdata?.AssignedTo?.length > 0 || Masterdata?.Team_x0020_Members?.length > 0 || Masterdata?.Responsible_x0020_Team?.length > 0 ? <ShowTaskTeamMembers props={Masterdata} TaskUsers={AllTaskUsers} /> : ''}
                                  </dd>
                                </dl>
                                <dl>
                                  <dt className="bg-fxdark">Status</dt>
                                  <dd className="bg-light">
                                    <a>
                                      {Masterdata.PercentComplete != null
                                        ? getPercentCompleteTitle(Masterdata.PercentComplete)
                                        : ""}
                                    </a>
                                    <span className="pull-right">
                                      <span className="pencil_icon">
                                        <span
                                          ng-show="isOwner"
                                          className="hreflink"
                                          title="Edit Inline"
                                        >
                                          <i
                                            className="fa fa-pencil"
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </span>
                                    </span>
                                  </dd>
                                </dl>
                              </div>



                              {
                                Masterdata?.Body != undefined ? <div className="mt-2 row pe-0 detailsbox">
                                  <details className="pe-0" open>
                                    <summary>Description</summary>
                                    <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Body }}></div>
                                  </details>
                                </div>
                                  : ''
                              }

                              {
                                Masterdata?.Background != undefined ? <div className="mt-2 row pe-0 detailsbox">
                                  <details className="pe-0">
                                    <summary>Background</summary>
                                    <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Background }}></div>
                                    {/* <div className="AccordionContent">{Masterdata?.Background}</div> */}
                                  </details>
                                </div> : ''
                              }

                              {
                                Masterdata?.Idea != undefined ? <div className="mt-2 row pe-0 detailsbox">
                                  <details className="pe-0">
                                    <summary>Idea</summary>
                                    <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Idea }}></div>
                                    {/* <div className="AccordionContent">{Masterdata?.Idea}</div> */}
                                  </details>
                                </div> : ''
                              }

                              {
                                Masterdata?.Deliverables != undefined ? <div className="mt-2 row pe-0 detailsboxp 41_
                                0=][9\
                                -p/\otyty5/">
                                  <details className="pe-0">
                                    <summary>Deliverables</summary>
                                    <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Deliverables }}></div>
                                  </details>
                                </div> : ''
                              }

                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <div>
                      <div className="Alltable">
                        <div className="section-event ps-0">
                          <div className="wrapper project-management-Table">
                            {sidebarStatus.sideBarFilter ? (
                              <div className="text-end">
                                <a onClick={() => clearPortfolioFilter()}>
                                  Clear Portfolio Filter
                                </a>
                              </div>
                            ) : (
                              ""
                            )}
                            <GlobalCommanTable AllListId={AllListId} headerOptions={headerOptions} columns={column2} data={data} callBackData={callBackData} TaskUsers={AllUser} showHeader={true} />
                          </div>

                        </div>
                      </div>
                    </div>
                    <div id="SpfxProgressbar" style={{ display: "none" }}>
                      <img
                        id="sharewebprogressbar-image"
                        src={`${AllListId?.siteUrl}/SiteCollectionImages/ICONS/32/loading_apple.gif`}
                        alt="Loading..."
                      />
                    </div>
                    {isOpenEditPopup ? (
                      <EditTaskPopup AllListId={AllListId} Items={passdata} context={props?.props?.Context} pageName="ProjectProfile" Call={CallBack} />
                    ) : (
                      ""
                    )}
                    {IsComponent ? (
                      <EditProjectPopup
                        AllListId={AllListId}
                        props={SharewebComponent}
                        Call={Call}
                        showProgressBar={showProgressBar}
                      >
                        {" "}
                      </EditProjectPopup>
                    ) : (
                      ""
                    )}
                  </div>
                </article>
              </div>
              <div>
                <span>
                  {QueryId && (
                    <CommentCard
                      AllListId={AllListId}
                      Context={props.Context}
                      siteUrl={props.siteUrl}
                      listName={"Master Tasks"}
                      itemID={QueryId}
                    />
                  )}
                </span>
                <span>
                  {(QueryId != undefined && isSmartInfoAvailable) ?
                    <SmartInformation
                      AllListId={AllListId}
                      listName={"Master Tasks"}
                      Context={props?.Context}
                      siteurl={props?.siteUrl}
                      Id={QueryId}
                      spPageContext={props?.Context?.pageContext?._web}
                    /> : ""
                  }
                </span>
              </div>
            </div>
          </div>

          {IsPortfolio && (
            <ServiceComponentPortfolioPopup
              props={SharewebComponent}
              Dynamic={AllListId}
              ComponentType={portfolioType}
              Call={ComponentServicePopupCallBack}
              selectionType={"Multi"}
            ></ServiceComponentPortfolioPopup>
          )}
          {remark && <SmartInformation Id={remarkData?.Id}
            AllListId={AllListId}
            Context={props?.Context}
            taskTitle={remarkData?.Title}
            listName={remarkData?.siteType}
            showHide={"projectManagement"}
            setRemark={setRemark}
            editSmartInfo={editSmartInfo}
            RemarkData={remarkData}
          />}
        </>
      ) : (
        <div>Project not found</div>
      )}
    </div>
  );
};
export default ProjectManagementMain;