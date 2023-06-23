import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InlineEditingcolumns from "../../projectmanagementOverviewTool/components/inlineEditingcolumns";
import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaChevronDown, FaChevronRight, FaSort, FaSortDown, FaSortUp, } from "react-icons/fa";
import { useTable, useSortBy, useFilters, useExpanded, usePagination, HeaderGroup, } from "react-table";
import { Filter, DefaultColumnFilter, } from "../../projectmanagementOverviewTool/components/filters";
import { FaAngleDown, FaAngleUp, FaHome } from "react-icons/fa";
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
var QueryId: any = "";
let linkedComponentData: any = [];
let smartComponentData: any = [];
let portfolioType = "";
var AllUser: any = [];
var siteConfig: any = [];
var DynamicData: any = {}
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
  const [masterData, setMasterData] = React.useState([]);
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
      isShowSiteCompostion: isShowSiteCompostion
    }
    if (props?.props?.SmartInformationListID != undefined) {
      setIsSmartInfoAvailable(true)
    }
    getQueryVariable((e: any) => e);

    GetMetaData();
    GetMasterData();
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

  const getQueryVariable = async (variable: any) => {
    const params = new URLSearchParams(window.location.search);
    let query = params.get("ProjectId");
    QueryId = query;
    setProjectId(QueryId);
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
        AllUser = await loadTaskUsers();
        let web = new Web(props?.siteUrl);
        let taskUsers: any = {};
        var AllUsers: any = [];
        taskUsers = await web.lists
          .getById(AllListId?.MasterTaskListID)
          .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "Deliverable_x002d_Synonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "Admin_x0020_Notes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebComponent/Id", "SharewebCategories/Id", "SharewebCategories/Title", "Priority_x0020_Rank", "Reference_x0020_Item_x0020_Json", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Services/Id", "Services/Title", "Services/ItemType", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "Item_x002d_Image", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
          .expand("ClientCategory", "ComponentCategory", "AssignedTo", "Component", "Services", "AttachmentFiles", "Author", "Editor", "Team_x0020_Members", "SharewebComponent", "SharewebCategories", "Parent")
          .getById(QueryId)
          .get();


        if ((taskUsers.PercentComplete = undefined))
          taskUsers.PercentComplete = (taskUsers?.PercentComplete * 100).toFixed(0);
        // if (taskUsers.Body != undefined) {
        //   taskUsers.Body = taskUsers.Body.replace(/(<([^>]+)>)/gi, "");
        // }

        let allPortfolios: any[] = [];
        allPortfolios = await getPortfolio("All");

        taskUsers.smartService = [];
        taskUsers?.ServicesId?.map((item: any) => {
          allPortfolios?.map((portfolio: any) => {
            if (portfolio?.Id == item) {
              portfolio.filterActive = false;
              taskUsers.smartService.push(portfolio);
            }
          });
        });
        taskUsers.smartComponent = [];
        taskUsers?.ComponentId?.map((item: any) => {
          allPortfolios?.map((portfolio: any) => {
            if (portfolio?.Id == item) {
              portfolio.filterActive = false;
              taskUsers.smartComponent.push(portfolio);
            }
          });
        });
        AllUsers.push(taskUsers);

        AllUsers?.map((items: any) => {
          items.AssignedUser = [];
          if (items.AssignedToId != undefined) {
            items.AssignedToId.map((taskUser: any) => {
              var newuserdata: any = {};

              AllUser?.map((user: any) => {
                if (user.AssingedToUserId == taskUser) {
                  newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                  newuserdata["Suffix"] = user?.Suffix;
                  newuserdata["Title"] = user?.Title;
                  newuserdata["UserId"] = user?.AssingedToUserId;
                  items["Usertitlename"] = user?.Title;
                }
              });
              items.AssignedUser.push(newuserdata);
            });
          }
        });
        if (AllUsers?.length > 0) {

          setProjectTitle(AllUsers[0].Title);
          setCount(count + 1)
          if (AllUsers[0].smartService != undefined && AllUsers[0].smartService.length > 0) {
            smartComponentData = AllUsers[0].smartService
          }
          if (AllUsers[0].smartComponent != undefined && AllUsers[0].smartComponent.length > 0) {
            linkedComponentData = AllUsers[0].smartComponent
          }
        }
        setMasterdata(AllUsers[0]);
      } catch (error) {
        console.log(error)
      }
    } else {
      alert('Master Task List Id not present')
    }
  };

  // Load All Component And Services
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {


  }, []);

  const getPortfolio = async (type: any) => {
    let result;
    if (AllListId?.MasterTaskListID != undefined) {
      try {
        var RootComponentsData: any[] = []; var ComponentsData: any[] = [];
        var SubComponentsData: any[] = [];
        var FeatureData: any[] = [];
        if (type != undefined) {
          let web = new Web(AllListId?.siteUrl);
          let componentDetails = [];
          if (type == 'All') {
            componentDetails = await web.lists
              .getById(AllListId?.MasterTaskListID)
              .items
              .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
              .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
              .top(4999)
              .get()
          } else {
            componentDetails = await web.lists
              .getById(AllListId?.MasterTaskListID)
              .items
              .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
              .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory").filter("Portfolio_x0020_Type eq '" + type + "'")
              .top(4999)
              .get()
          }
          let Response: ArrayLike<any> = [];
          Response = await loadTaskUsers();

          $.each(componentDetails, function (index: any, result: any) {

            result.TitleNew = result.Title;
            result.TeamLeaderUser = []
            result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')

            if (result.DueDate == 'Invalid date' || '') {
              result.DueDate = result.DueDate.replaceAll("Invalid date", "")
            }
            if (result.PercentComplete != undefined)
              result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

            if (result.Short_x0020_Description_x0020_On != undefined) {
              result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
            }

            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
              $.each(result.AssignedTo, function (index: any, Assig: any) {
                if (Assig.Id != undefined) {
                  $.each(Response, function (index: any, users: any) {

                    if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                      users.ItemCover = users.Item_x0020_Cover;
                      result.TeamLeaderUser.push(users);
                    }

                  })
                }
              })
            }
            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
              $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
                if (Assig.Id != undefined) {
                  $.each(Response, function (index: any, users: any) {
                    if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                      users.ItemCover = users.Item_x0020_Cover;
                      result.TeamLeaderUser.push(users);
                    }

                  })
                }
              })
            }

            if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
              $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                result.ClientCategory.push(catego);
              })
            }
            if (result.Item_x0020_Type == 'Root Component') {
              result['Child'] = [];
              RootComponentsData.push(result);
            }
            if (result.Item_x0020_Type == 'Component') {
              result['Child'] = [];
              ComponentsData.push(result);


            }

            if (result.Item_x0020_Type == 'SubComponent') {
              result['Child'] = [];
              SubComponentsData.push(result);


            }
            if (result.Item_x0020_Type == 'Feature') {
              result['Child'] = [];
              FeatureData.push(result);
            }
          });

          $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
              $.each(FeatureData, function (index: any, featurecomp: any) {
                if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                  subcomp['Child'].push(featurecomp);;
                }
              })
            }
          })

          $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
              $.each(SubComponentsData, function (index: any, featurecomp: any) {
                if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                  subcomp['Child'].push(featurecomp);;
                }
              })
            }
          })
          result = componentDetails;
          //maidataBackup.push(ComponentsData)
          // setmaidataBackup(ComponentsData)

        }
      }
      catch (error) {
        return Promise.reject(error);
      }
    } else {
      alert('Master Task List Id not present')
    }

    return result;

  }

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
            if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites") {
              siteConfig.push(site)
            }
          })
        } else {
          siteConfig = smartmeta;
        }
        LoadAllSiteTasks();
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
    await loadAllComponent()
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
            .select("Id,Title,Priority_x0020_Rank,Remark,Project/Priority_x0020_Rank,Project/Id,Project/Title,Events/Id,EventsId,workingThisWeek,EstimatedTime,SharewebTaskLevel1No,SharewebTaskLevel2No,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Component/Id,Component/Title,Services/Id,Services/Title,PercentComplete,ComponentId,Categories,ServicesId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
            .expand('AssignedTo,Events,Project,Author,Editor,Component,Services,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory')
            .top(4999)
            .filter("ProjectId eq " + QueryId)
            .orderBy("Priority_x0020_Rank", false)
           .get();
          arraycount++;
          smartmeta.map((items: any) => {

            items.AllTeamMember = [];
            items.HierarchyData = [];
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
            if (items?.Component?.length > 0) {
              items.portfolio = items?.Component[0];
              items.PortfolioTitle = items?.Component[0]?.Title;
              items["Portfoliotype"] = "Component";
            }
            if (items?.Services?.length > 0) {
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
            items.HierarchyData = globalCommon.hierarchyData(items, MyAllData)
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
      .get().then((data) => {
        console.log(data)
        data?.forEach((val: any) => {
          MyAllData.push(val)
        })


      }).catch((error) => {
        console.log(error)
      })


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


  // const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
  //   if (functionType == 'close') {
  //     setIsComponent(false);
  //     setIsPortfolio(false);
  //   } else {
  //     if (Type === "Service") {
  //       if (DataItem.length > 0) {
  //         DataItem.map((selectedData: any) => {
  //           linkedComponentData.push(selectedData);
  //         })
  //         TagPotfolioToProject();
  //       }
  //     }
  //     if (Type === "Component") {
  //       if (DataItem?.length > 0) {
  //         DataItem.map((selectedData: any) => {
  //           smartComponentData.push(selectedData);
  //         })
  //         TagPotfolioToProject();
  //       }
  //     }
  //     console.log(Masterdata)
  //     setIsPortfolio(false);
  //   }
  // }, [])

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
              <div className='tooltipSec popover__wrapper me-1' data-bs-toggle='tooltip' data-bs-placement='auto'>
                {row.original.Services.length >= 1 ? (
                  <span className='text-success'>{row?.original?.Shareweb_x0020_ID}</span>
                ) : (
                  <span>{row?.original?.Shareweb_x0020_ID}</span>
                )}
                {row?.original?.HierarchyData != undefined && row?.original?.HierarchyData.length > 0 &&
                  <div className='popover__content'>
                    <div className='tootltip-title'>{row?.original?.Title}</div>
                    <div className='tooltip-body'>
                      <GlobalCommanTable columns={column} data={row?.original?.HierarchyData} callBackData={callBackData} />
                    </div>
                  </div>}
              </div>
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

              {row?.original?.Body !== null && (
                <span className='me-1'>
                  <div className='popover__wrapper me-1' data-bs-toggle='tooltip' data-bs-placement='auto'>
                    <span className='svg__iconbox svg__icon--info'></span>
                    <div className='popover__content'>
                      <span>
                        <p dangerouslySetInnerHTML={{ __html: row?.original?.bodys }}></p>
                      </span>
                    </div>
                  </div>
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
        size: 100
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
        canSort: false,
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "TeamMembers",
        header: "",
        size: 152
      },
      {
        accessorFn: (row) => row?.Remark,
        cell: ({ row }) => (
          <span>
            <InlineEditingcolumns
              AllListId={AllListId}
              callBack={inlineCallBack}
              columnName='Remark'
              item={row?.original}
              TaskUsers={AllUser}
              pageName={'ProjectManagment'}
            />
          </span>
        ),
        id: 'Remarks',
        canSort: false,
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Remarks",
        header: "",
        size: 125
      },
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
              <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title}></span>
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
              className='svg__iconbox svg__icon--cross hreflink'
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
                              <div className="col-md-6 p-0">
                                <dl>
                                  <dt className="bg-fxdark">Due Date</dt>
                                  <dd className="bg-light">
                                    <span>
                                      <a>
                                        {Masterdata.DueDate != null
                                          ? Moment(Masterdata.Created).format(
                                            "DD/MM/YYYY"
                                          )
                                          : ""}
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
                                    {Masterdata?.AssignedUser?.map(
                                      (image: any) => (
                                        <span
                                          className="headign"
                                          title={image.Title}
                                        >
                                          <img
                                            className="circularImage rounded-circle"
                                            src={image.useimageurl}
                                          />
                                        </span>
                                      )
                                    )}
                                  </dd>
                                </dl>
                                <dl>
                                  <dt className="bg-fxdark">% Complete</dt>
                                  <dd className="bg-light">
                                    <a>
                                      {Masterdata.PercentComplete != null
                                        ? Masterdata.PercentComplete
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
                                Masterdata?.Body != undefined ? <div className="mt-2 p-0 row">
                                  <details className="pe-0">
                                    <summary>Description</summary>
                                    <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Body }}></div>
                                  </details>
                                </div>
                                  : ''
                              }

                              {
                                Masterdata?.Background != undefined ? <div className="mt-2 p-0 row">
                                  <details className="pe-0">
                                    <summary>Background</summary>
                                    <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Background }}></div>
                                    {/* <div className="AccordionContent">{Masterdata?.Background}</div> */}
                                  </details>
                                </div> : ''
                              }

                              {
                                Masterdata?.Idea != undefined ? <div className="mt-2 p-0 row">
                                  <details className="pe-0">
                                    <summary>Idea</summary>
                                    <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Idea }}></div>
                                    {/* <div className="AccordionContent">{Masterdata?.Idea}</div> */}
                                  </details>
                                </div> : ''
                              }

                              {
                                Masterdata?.Deliverables != undefined ? <div className="mt-2 p-0 row">
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
                      <div className="row">
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
                            <GlobalCommanTable AllListId={AllListId}  columns={column2} data={data} callBackData={callBackData}  TaskUsers={AllUser}  showHeader={true} />
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
        </>
      ) : (
        <div>Project not found</div>
      )}
    </div>
  );
};
export default ProjectManagementMain;