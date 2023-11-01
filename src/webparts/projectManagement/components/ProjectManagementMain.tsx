import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InlineEditingcolumns from "../../projectmanagementOverviewTool/components/inlineEditingcolumns";
import { FaSort, FaSortDown, FaSortUp, } from "react-icons/fa";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import { Web } from "sp-pnp-js";
import EditProjectPopup from "../../projectmanagementOverviewTool/components/EditProjectPopup";
import * as Moment from "moment";
import {
  ColumnDef,
} from "@tanstack/react-table";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import TagTaskToProjectPopup from "./TagTaskToProjectPopup";
import CreateTaskFromProject from "./CreateTaskFromProject";
import TaggedComponentTask from "./TaggedComponentTask";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ServiceComponentPortfolioPopup from "../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import CommentCard from "../../../globalComponents/Comments/CommentCard";
import SmartInformation from "../../taskprofile/components/SmartInformation";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import { BiCommentDetail } from "react-icons/bi";
import { BsTag, BsTagFill } from "react-icons/bs";
//import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs";
var QueryId: any = "";
let smartPortfoliosData: any = [];
let portfolioType = "";
var AllUser: any = [];
var siteConfig: any = [];
let headerOptions: any = {
  openTab: true,
  teamsIcon: true
}
var allSmartInfo: any = [];
var AllSitesAllTasks: any = [];
var AllListId: any = {};
var backupAllTasks: any = [];
let groupedComponentData: any = [];
var MasterListData: any = []
let taskTaggedComponents: any = []
let TaggedPortfoliosToProject: any = [];
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
const ProjectManagementMain = (props: any) => {
  // const [item, setItem] = React.useState({});
  const [AllTaskUsers, setAllTaskUsers] = React.useState([]);
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [AllTasks, setAllTasks] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
  const [isOpenCreateTask, setisOpenCreateTask] = React.useState(false);
  const [Masterdata, setMasterdata] = React.useState<any>({});
  const [passdata, setpassdata] = React.useState("");
  const [TaskTaggedPortfolios, setTaskTaggedPortfolios] = React.useState([]);
  const [projectTitle, setProjectTitle] = React.useState("");
  const [projectId, setProjectId] = React.useState(null);
  const [IsTaggedCompTask, setIsTaggedCompTask] = React.useState(false);
  const [SelectedItem, setSelectedItem] = React.useState({});

  const [createTaskId, setCreateTaskId] = React.useState({ portfolioData: null, portfolioType: null });
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
      TaskTypeID: props?.props?.TaskTypeID
    }
    if (props?.props?.SmartInformationListID != undefined) {
      setIsSmartInfoAvailable(true)
    }

    getQueryVariable((e: any) => e);

    loadAllSmartInformation()

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

  const GetMasterData = async (loadtask: any) => {
    if (AllListId?.MasterTaskListID != undefined) {
      try {
        let web = new Web(props?.siteUrl);
        await web.lists
          .getById(AllListId?.MasterTaskListID)
          .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "PortfoliosId", "Portfolios/Id", "Portfolios/Title", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "DeliverableSynonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "AdminNotes", "AdminStatus", "Background", "Help_x0020_Information", "TaskCategories/Id", "TaskCategories/Title", "PriorityRank", "Reference_x0020_Item_x0020_Json", "TeamMembers/Title", "TeamMembers/Name", "TeamMembers/Id", "Item_x002d_Image", "ComponentLink", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
          .expand("ClientCategory", "ComponentCategory", "AssignedTo", "AttachmentFiles", "Author", "Editor", "TeamMembers", "Portfolios", "TaskCategories", "Parent")
          .getById(QueryId)
          .get().then((fetchedProject: any) => {
            if ((fetchedProject.PercentComplete != undefined)) {
              fetchedProject.PercentComplete = (fetchedProject?.PercentComplete * 100).toFixed(0)
            } if (fetchedProject?.DueDate != undefined) {
              fetchedProject.DisplayDueDate = fetchedProject.DueDate != null
                ? Moment(fetchedProject.DueDate).format("DD/MM/YYYY")
                : "";
            } else {
              fetchedProject.DisplayDueDate = '';
            }
            TaggedPortfoliosToProject = fetchedProject?.PortfoliosId?.length > 0 ? fetchedProject?.PortfoliosId : [];

            fetchedProject.taggedPortfolios = [];
            fetchedProject?.PortfoliosId?.map((item: any) => {
              MasterListData?.map((portfolio: any) => {
                if (portfolio?.Id == item) {
                  fetchedProject?.taggedPortfolios?.push(portfolio);
                }
              });
            });
            fetchedProject.AssignedUser = [];
            fetchedProject.AssignedTo = [];
            fetchedProject.TeamMembers = [];
            fetchedProject.ResponsibleTeam = [];
            AllUser?.map((user: any) => {
              if (fetchedProject?.TeamMembersId != undefined) {
                fetchedProject?.TeamMembersId?.map((taskUser: any) => {
                  if (user.AssingedToUserId == taskUser) {
                    user.Id = user?.AssingedToUserId;
                    fetchedProject?.TeamMembers?.push(user)
                  }
                })
              }
              if (fetchedProject?.ResponsibleTeamId != undefined) {
                fetchedProject?.ResponsibleTeamId?.map((taskUser: any) => {
                  if (user.AssingedToUserId == taskUser) {
                    user.Id = user.AssingedToUserId;
                    fetchedProject?.ResponsibleTeam?.push(user)
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
            if (fetchedProject?.taggedPortfolios != undefined) {
              smartPortfoliosData = fetchedProject.taggedPortfolios
            }
            if (loadtask == true) {
              LoadAllSiteTasks();
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
    setIsTaggedCompTask(false);
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
          GetMasterData(true);
          LoadAllSiteAllTasks()
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
      "Are you sure you want to untag " + `${item?.TaskID} - ${item?.Title}` + " from this project ?"
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
    setIsComponent(true);
    setSharewebComponent(item);
  };

  const tagAndCreateCallBack = React.useCallback(() => {
    setIsTaggedCompTask(false)
    setCreateTaskId({ portfolioData: null, portfolioType: null })
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
    let taskComponent: any = TaggedPortfoliosToProject;

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
            .select("Id,Title,FeedBack,PriorityRank,Remark,Project/PriorityRank,ParentTask/Id,ParentTask/Title,ParentTask/TaskID,TaskID,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title")
            .expand('AssignedTo,Project,ParentTask,SmartInformation,Author,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory')
            .top(4999)
            .filter("ProjectId eq " + QueryId)
            .orderBy("PriorityRank", false)
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
            if (items?.TaskCategories?.length > 0) {
              items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
            }
            if(items?.TaskCategories?.length > 0){
              items.Categories = items.TaskTypeValue;
            }
            items.AllTeamMember = [];
            items.HierarchyData = [];
            items.descriptionsSearch = '';
            items.siteType = config.Title;
            if (items?.FeedBack != undefined) {
              let DiscriptionSearchData: any = '';
              let feedbackdata: any = JSON.parse(items?.FeedBack)
              DiscriptionSearchData = feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
                const childText = child?.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '');
                const subtextText = (child?.Subtext || [])?.map((elem: any) =>
                  elem.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '')
                ).join('');
                return childText + subtextText;
              }).join('');
              items.descriptionsSearch = DiscriptionSearchData
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
            if (items?.Portfolio?.Id != undefined) {
              items.Portfolio = MasterListData?.find((masterItem: any) => masterItem?.Id == items?.Portfolio?.Id)
              if (!taskComponent?.some((id: any) => id == items?.Portfolio?.Id)) {
                let comp = items?.Portfolio
                taskComponent.push(comp?.Id)
                taskTaggedComponents.push(comp)
              }
              items.portfolio = items?.Portfolio;
              items.PortfolioTitle = items?.Portfolio?.Title;
              // items["Portfoliotype"] = "Component";
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
            items.TaskID = globalCommon.GetTaskId(items);
            AllUser?.map((user: any) => {
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
                  }
                  items.AllTeamMember.push(newuserdata);
                });
              }
            });
            items.subRows = [];
            AllTask.push(items);
          });
          let setCount = siteConfig?.length
          if (arraycount === setCount) {
            backupAllTasks = JSON.parse(JSON.stringify(AllTask));
            setAllTasks(backupAllTasks);
            let allActivities: any = []
            allActivities = AllTask.filter((task: any) => {
              if (task?.TaskType?.Id == 1) {
                task.isTaskPushed = true;
                return true
              } else {
                return false
              }
            });
            allActivities?.map((Activity: any) => {
              Activity.subRows = AllTask.filter((workstream: any) => {
                if (workstream?.ParentTask?.Id == Activity?.Id && (workstream?.TaskType?.Id == 3 || workstream?.TaskType?.Id == 2)) {
                  workstream.isTaskPushed = true;
                  return true
                } else {
                  return false
                }
              });
              Activity?.subRows?.map((workstream: any) => {
                if (workstream?.TaskType?.Id == 3) {
                  workstream.subRows = AllTask.filter((task: any) => {
                    if (task?.ParentTask?.Id == workstream?.Id && task?.TaskType?.Id == 2) {
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
            allWorkStream = AllTask.filter((task: any) => {
              if (task?.TaskType?.Id == 3 && task?.isTaskPushed !== true) {
                task.isTaskPushed = true;
                return true
              } else {
                return false
              }
            });
            allWorkStream?.map((workstream: any) => {
              workstream.subRows = AllTask.filter((task: any) => {
                if (task?.ParentTask?.Id == workstream?.Id && task?.TaskType?.Id == 2 && task?.isTaskPushed !== true) {
                  task.isTaskPushed = true;
                  return true
                } else {
                  return false
                }
              });
            })
            allActivities = allActivities.concat(allWorkStream);
            AllTask = AllTask.filter((item: any) => item?.isTaskPushed !== true);
            allActivities = allActivities.concat(AllTask);

            setData(allActivities);
            setTaskTaggedPortfolios(taskTaggedComponents)

          }

        });
      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Site Config Length less than 0')
    }
  };

  const getChilds = (item: any, items: any) => {
    items?.map((sub: any) => {
      if (sub?.Id == item?.ParentTask?.Id && sub?.isFlag != true) {
        sub.isFlag = true;
        sub.subRows.push(item);
        item.removeFlag = true;
      }
    });
  };

  const loadAllComponent = async () => {
    let PropsObject: any = {
      MasterTaskListID: AllListId.MasterTaskListID,
      siteUrl: AllListId.siteUrl,
      TaskUserListId: AllListId.TaskUsertListID,
    }
    let componentDetails: any = [];
    let results = await globalCommon.GetServiceAndComponentAllData(PropsObject)
    if (results?.AllData?.length > 0) {
      componentDetails = results?.AllData;
      groupedComponentData = results?.GroupByData;
    }
    MasterListData = componentDetails

  }
  const EditPortfolio = (item: any, type: any) => {
    portfolioType = type;
    setSharewebComponent(item);
    setIsPortfolio(true);
  };
  const Call = (propsItems: any, type: any) => {
    GetMasterData(false);
    setIsComponent(false);
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
              .items.select("ID", "Title", "ClientCategory/Id", "ClientCategory/Title", 'ClientCategory', "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "ParentTask/Id", "ParentTask/Title", "ParentTask/TaskID", "TaskID", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Body", "PriorityRank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Portfolio/Id", "Portfolio/Title", "Modified")
              .expand("TeamMembers", "ParentTask", "ClientCategory", "AssignedTo", "TaskCategories", "Author", "ResponsibleTeam", "TaskType", "Portfolio")
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
                  if (task?.Portfolio?.Id != undefined) {
                    task.portfolio = task?.Portfolio;
                    task.PortfolioTitle = task?.Portfolio?.Title;
                    // task["Portfoliotype"] = "Component";
                  }
                  task["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  task.TeamMembersSearch = "";
                  task.TaskID = globalCommon.GetTaskId(task);
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

  const TagPotfolioToProject = async () => {
    if (QueryId != undefined && AllListId?.MasterTaskListID != undefined) {
      let selectedComponent: any[] = [];
      if (smartPortfoliosData !== undefined && smartPortfoliosData.length > 0) {
        $.each(smartPortfoliosData, function (index: any, smart: any) {
          selectedComponent.push(smart?.Id);
        });
      }
      let web = new Web(props?.siteUrl);
      await web.lists
        .getById(AllListId?.MasterTaskListID)
        .items.getById(QueryId)
        .update({
          PortfoliosId: {
            results:
              selectedComponent !== undefined && selectedComponent?.length > 0
                ? selectedComponent
                : [],
          }

        })
        .then((res: any) => {
          GetMasterData(false);
          smartPortfoliosData = []
          console.log(res);
        });
    }
  };

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
    if (DataItem?.length > 0) {
      DataItem.map((selectedData: any) => {
        smartPortfoliosData.push(selectedData);
      })
      TagPotfolioToProject();
    }
    console.log(Masterdata)
    setIsComponent(false);
    setIsPortfolio(false);

  }, [])

  const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCustomExpanded: true,
        hasExpanded: true,
        hasCheckbox: true,
        size: 10,
        id: 'Id',
      },
      {
        accessorKey: "TaskID",
        placeholder: "Task Id",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 125,
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MasterListData} AllSitesTaskData={AllSitesAllTasks} />
            </span>
          </>
        ),
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            <span>
              <a
                className="hreflink"
                href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                data-interception="off"
                target="_blank"
              >
                {row?.original?.Title}
              </a>
              {row?.original?.descriptionsSearch?.length > 0 ? (
                <span className="alignIcon">
                  <InfoIconsToolTip
                    Discription={row?.original?.bodys}
                    row={row?.original}
                  />
                </span>
              ) : (
                ""
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
        accessorFn: (row) => row?.TaskTypeValue,
        cell: ({ row }) => (
          <>
           <span>
            <InlineEditingcolumns
              AllListId={AllListId}
              callBack={inlineCallBack}
              columnName='TaskCategories'
              item={row?.original}
              TaskUsers={AllUser}
              pageName={'ProjectManagment'}
            />
          </span>
          </>
        ),
        placeholder: "Task Type",
        header: "",
        resetColumnFilters: false,
        size: 120,
        id: "TaskTypeValue",
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
          <a
            className="hreflink"
            data-interception="off"
            target="blank"
            href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
          >
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.portfolio?.Title} row={row?.original?.Portfolio} singleLevel={true} masterTaskData={MasterListData} AllSitesTaskData={AllSitesAllTasks} />
            </span>
          </a>
        ),
        id: "Portfolio",
        placeholder: "Portfolio",
        resetColumnFilters: false,
        resetSorting: false,
        header: ""
      },
      {
        accessorFn: (row) => row?.PriorityRank,
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
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.PriorityRank == filterValue
        },
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
        isColumnDefultSortingDesc: true,
        resetSorting: false,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.DisplayDueDate?.includes(filterValue)
        },
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
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.PercentComplete == filterValue
        },
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
          <span className='d-flex hreflink' >
            &nbsp; {row?.original?.SmartInformation?.length > 0 ? <span onClick={() => openRemark(row?.original)} className="commentDetailFill-active"><BiCommentDetail /></span> : <span onClick={() => openRemark(row?.original)} className="commentDetailFill"><BiCommentDetail /></span>}
          </span>
        ),
        id: 'SmartInformation',
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "Remarks",
        header: '',
        size: 50
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
          <span className="text-end">
            <span
              title="Edit Task"
              onClick={() => EditPopup(row?.original)}
              className="alignIcon  svg__iconbox svg__icon--edit hreflink"
            ></span>
            <span
              style={{ marginLeft: '6px' }}
              title='Un-Tag Task From Project'
              onClick={() => untagTask(row?.original)}
            ><BsTagFill /></span>
          </span>
        ),
        id: 'Actions',
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 55
      }
    ],
    [data]
  );
  const filterPotfolioTasks = (portfolio: any, clickedIndex: any, type: any) => {
    let projectData = Masterdata;
    let displayTasks = AllTasks;
    if (type == 'Component' || type == 'taskComponent') {
      if (createTaskId?.portfolioData?.Id != portfolio?.Id) {
        setCreateTaskId({ portfolioData: portfolio, portfolioType: 'Component' });
        setIsTaggedCompTask(true);
      } else if (createTaskId?.portfolioData?.Id == portfolio?.Id) {
        setCreateTaskId({ portfolioData: null, portfolioType: null })
        setIsTaggedCompTask(true);
      }
    }
    setSelectedItem(portfolio)
    setMasterdata(projectData);
    setData(displayTasks);
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
                  <a>{Masterdata?.Title}</a>{" "}
                </li>
              </ul>
            </div>
          </div>
          <div className="ProjectManagementPage Dashboardsecrtion">
            <div className="dashboard-colm">
              <aside className="sidebar">
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
                            Portfolios Item{" "}
                            <span
                              className="float-end "
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                EditPortfolio(Masterdata, "Portfolios")
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
                      <li className="nav__item  pb-1 pt-0 mt-1">
                        <div className="nav__text">
                          {Masterdata?.taggedPortfolios?.length > 0 || TaskTaggedPortfolios?.length > 0 ? (
                            <ul className="nav__subList wrapper  ps-0 pe-2">
                              {Masterdata?.taggedPortfolios?.map(
                                (component: any, index: any) => {
                                  return (
                                    <li className={component?.Id == createTaskId?.portfolioData?.Id ? "nav__item bg-ee ps-1" : "mb-1 bg-shade hreflink"}>
                                      <span>
                                        <a className={component?.Id == createTaskId?.portfolioData?.Id ? "hreflink " : "text-white hreflink"} data-interception="off" target="blank"
                                          onClick={() => filterPotfolioTasks(component, index, "Component")}>{component?.Title}</a>
                                      </span>
                                    </li>
                                  );
                                }
                              )}
                              {TaskTaggedPortfolios?.map(
                                (component: any, index: any) => {
                                  return (
                                    <li className={component?.Id == createTaskId?.portfolioData?.Id ? "nav__item bg-ee ps-1" : "mb-1 bg-shade hreflink"} >
                                      <span>
                                        <a className={component?.Id == createTaskId?.portfolioData?.Id ? "hreflink " : "text-white hreflink"} data-interception="off" target="blank"
                                          onClick={() => filterPotfolioTasks(component, index, "taskComponent")}>{component?.Title}</a>
                                      </span>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          ) : (
                            <div className="nontag mt-2 text-center">
                              No Tagged Portfolio
                            </div>
                          )}
                        </div>
                      </li>
                    </ul>
                  </nav>
                </section>

              </aside>
              <div className="dashboard-contentbox ps-2 full-width">
                <article className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-9">
                        <section>
                          <div>
                            <div className="align-items-center d-flex justify-content-between">
                              <h2 className="heading alignCenter">
                                <img
                                  className="circularImage rounded-circle "
                                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Icon_Project.png"
                                />
                                <span>
                                {`${Masterdata?.PortfolioStructureID} - ${Masterdata?.Title}`}
                                <span
                                  onClick={() => EditComponentPopup(Masterdata)}
                                  className="mx-1 svg__iconbox svg__icon--edit alignIcon hreflink"
                                  title="Edit Project"
                                ></span>
                                </span>
                                
                              </h2>
                              <div>
                                <div className="d-flex">
                                  {projectId && (
                                    <TagTaskToProjectPopup
                                      projectItem={Masterdata}
                                      className="ms-2"
                                      projectId={projectId}
                                      AllListId={AllListId}
                                      callBack={tagAndCreateCallBack}
                                      projectTitle={projectTitle}
                                    />
                                  )}</div>
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
                                        {Masterdata?.AssignedTo?.length > 0 || Masterdata?.TeamMembers?.length > 0 || Masterdata?.ResponsibleTeam?.length > 0 ? <ShowTaskTeamMembers props={Masterdata} TaskUsers={AllTaskUsers} /> : ''}
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
                      </div>
                      <div className="col-md-3">
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
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="TableSection">
                        <div className="Alltable">
                          <div className="section-event ps-0">
                            <div className="wrapper project-management-Table">

                              <GlobalCommanTable AllListId={AllListId} headerOptions={headerOptions} columns={column2} data={data} callBackData={callBackData} TaskUsers={AllUser} showHeader={true} expendedTrue={false} />
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="SpfxProgressbar" style={{ display: "none" }}>
                      <img id="sharewebprogressbar-image" src={`${AllListId?.siteUrl}/SiteCollectionImages/ICONS/32/loading_apple.gif`} alt="Loading..." />
                    </div>
                    {isOpenEditPopup ? (
                      <EditTaskPopup AllListId={AllListId} Items={passdata} context={props?.props?.Context} pageName="ProjectProfile" Call={CallBack} />) : ("")}
                    {IsComponent ? (
                      <EditProjectPopup AllListId={AllListId} props={SharewebComponent} Call={Call} showProgressBar={showProgressBar}  > {" "} </EditProjectPopup>) : ("")}
                  </div>
                </article>
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
              groupedData={groupedComponentData}
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
          {IsTaggedCompTask && (
            <TaggedComponentTask projectItem={Masterdata} SelectedItem={SelectedItem} createComponent={createTaskId} SelectedProp={props?.props} AllSitesTaskData={AllSitesAllTasks} context={props?.props?.Context} MasterListData={MasterListData} AllListId={AllListId} AllUser={AllUser} callBack={tagAndCreateCallBack}
            />
          )}

        </>) : (<div>Project not found</div>)}
    </div>
  );
};
export default ProjectManagementMain; 