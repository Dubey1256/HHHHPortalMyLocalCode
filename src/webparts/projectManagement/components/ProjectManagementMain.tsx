import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InlineEditingcolumns from "../../../globalComponents/inlineEditingcolumns";
import { Panel, PanelType } from "office-ui-fabric-react";
import { FaSort, FaSortDown, FaSortUp, } from "react-icons/fa";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import { Web } from "sp-pnp-js";
import EditProjectPopup from "../../../globalComponents/EditProjectPopup";
import * as Moment from "moment";
import { myContextValue } from '../../../globalComponents/globalCommon'
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
import MSTeamsChat from "../../../globalComponents/MSTeamsChat";
import SmartInformation from "../../taskprofile/components/SmartInformation";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import { BiCommentDetail } from "react-icons/bi";
import { BsTag, BsTagFill } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
import PageLoader from "../../../globalComponents/pageLoader";
import AddProject from "../../projectmanagementOverviewTool/components/AddProject";
import CreateActivity from "../../../globalComponents/CreateActivity";
import CreateWS from "../../../globalComponents/CreateWS";
import AncTool from '../../../globalComponents/AncTool/AncTool'
import RelevantDocuments from "../../taskprofile/components/RelevantDocuments";
import RelevantEmail from '../../taskprofile/components/./ReleventEmails'
import KeyDocuments from '../../taskprofile/components/KeyDocument';
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import WorkingActionInformation from '../../../globalComponents/WorkingActionInformation';
import Tooltip from "../../../globalComponents/Tooltip";
import { Avatar } from "@fluentui/react-components";

//import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs";
var QueryId: any = "";
let smartPortfoliosData: any = [];
let portfolioType = "";
let AllFlatProject: any = [];
var AllUser: any = [];
let allBackupSprintAndTask: any = []
var siteConfig: any = [];
let Groupusers: any = [];
let headerOptions: any = {
  openTab: true,
  teamsIcon: true
}
let backupTableData: any = [];
let timeSheetConfig: any = {}
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
let renderData: any = []
let projectData: any = {}
let CurrentUserData: any = {};
let hasCustomExpanded: any = true
let hasExpanded: any = true
let isHeaderNotAvlable: any = false
let isColumnDefultSortingAsc: any = false;
let relevantDocRef: any;
let smartInfoRef: any;
let keyDocRef: any;
let suggestedPortfolioItems: any;
let keyRelevantPortfolioItems: any;
let selectedItem: any
let taggedPortfolioItem: any
let taskTypeDataItem: any;
let keyTaggedDocs: any;
let tempmetadata: any;
let weekTotalTime: any = 0
let monthTotalTime: any = 0
let totalTime: any = 0
let PXTasks: any
const ProjectManagementMain = (props: any) => {
  const [openServiceComponent, setopenServiceComponent]= React.useState(false)
  relevantDocRef = React.useRef();
  smartInfoRef = React.useRef();
  keyDocRef = React.useRef();
  const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
  const [showTimeEntryIcon, setshowTimeEntryIcon] = React.useState(true);
  const [keydoc, Setkeydoc] = React.useState([]);
  const [FileDirRef, SetFileDirRef] = React.useState('');
  // const [item, setItem] = React.useState({});
  const [AllTaskUsers, setAllTaskUsers] = React.useState([]);
  const [groupByButtonClickData, setGroupByButtonClickData] = React.useState([]);
  const [openTimeEntryPopup, setOpenTimeEntryPopup] = React.useState(false);
  const [taskTimeDetails, setTaskTimeDetails] = React.useState([]);
  const [clickFlatView, setclickFlatView] = React.useState(false);
  const [flatViewDataAll, setFlatViewDataAll] = React.useState([]);
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  const [isAddStructureOpen, setIsAddStructureOpen] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [workingTodayFiltered, setWorkingTodayFiltered] = React.useState(false);
  const [pageLoaderActive, setPageLoader] = React.useState(false)
  const [CMSComponent, setCMSComponent] = React.useState("");
  const [tagPortfolio, setTagPortfolio] = React.useState("")
  const [AllTasks, setAllTasks] = React.useState([]);
  const rerender = React.useReducer(() => ({}), {})[1]
  const refreshData = () => setProjectTableData(() => renderData);
  const [ProjectTableData, setProjectTableData] = React.useState([]);
  const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
  const [isOpenCreateTask, setisOpenCreateTask] = React.useState(false);
  const [Masterdata, setMasterdata] = React.useState<any>({});
  const [isOpenActivity, setIsOpenActivity] = React.useState(false);
  const [isOpenWorkstream, setIsOpenWorkstream] = React.useState(false);
  const [passdata, setpassdata] = React.useState("");
  const [TaskTaggedPortfolios, setTaskTaggedPortfolios] = React.useState([]);
  const [suggestedPortfolios, setSuggestedPortfolios] = React.useState([]);
  const [projectTitle, setProjectTitle] = React.useState("");
  const [projectId, setProjectId] = React.useState(null);
  const [IsTaggedCompTask, setIsTaggedCompTask] = React.useState(false);
  const [SelectedItem, setSelectedItem] = React.useState({});
  const [checkedList, setCheckedList] = React.useState<any>({});
  const [createTaskId, setCreateTaskId] = React.useState({ portfolioData: null, portfolioType: null });
  const [isSmartInfoAvailable, setIsSmartInfoAvailable]: any = React.useState(false);
  // const[allSmartInfo,setAllSmartInfo]=React.useState([])
  const [remark, setRemark] = React.useState(false)
  const [remarkData, setRemarkData] = React.useState(null);
  const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
  const [editSmartInfo, setEditSmartInfo] = React.useState(false)
  const [suggestedPortfolio, setSuggestedPortfolio] = React.useState("")
  const [searchedKeyPortfolios, setSearchedkeyPortfolios] = React.useState([])
  const [ActivityPopup, setActivityPopup] = React.useState(false);
  const [activeTile, setActiveTile] = React.useState("")
  const [keyRelevantPortfolios, setKeyRelevantPortfolios] = React.useState(false)
  const [keyTaggedDoc, setKeyTaggedDoc] = React.useState([])
  const [filteredTask, setFilteredTasks] = React.useState([])
  const [taggedPortfolio, setTaggedPortfolio] = React.useState([])
  const [timeEntries, setTimeEntries] = React.useState([])
  const childRef = React.useRef<any>();
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
      if (isShowTimeEntry == false) {
        setshowTimeEntryIcon(false)
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
      siteUrl: props?.props?.siteUrl,
      AdminConfigrationListID: props?.props?.AdminConfigrationListID,
      isShowTimeEntry: isShowTimeEntry,
      isShowSiteCompostion: isShowSiteCompostion,
      PortFolioTypeID: props?.props?.PortFolioTypeID,
      Context: props?.props?.Context,
      TaskTypeID: props?.props?.TaskTypeID
    }
    if (props?.props?.SmartInformationListID != undefined) {
      setIsSmartInfoAvailable(true)
    }
    getQueryVariable((e: any) => e);
    getTaskType()
    loadAllSmartInformation()
    LoadSmartmetadata();
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
        .getById(AllListId?.TaskUserListID)
        .items
        .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
        .get();
      CurrentUserData = taskUser?.find((user: any) => {
        if (AllListId?.Context?.pageContext?.legacyPageContext?.userId == user?.AssingedToUser?.Id) {
          return true
        }
      })
    }
    catch (error) {
      return Promise.reject(error);
    }
    return taskUser;
  }

  const getTaskType = async () => {
    let web = new Web(AllListId.siteUrl);
    let taskTypeData = [];
    let typeData: any = [];
    taskTypeData = await web.lists
      .getById(AllListId.TaskTypeID)
      .items.select(
        'Id',
        'Level',
        'Title',
        'SortOrder',
      ).get();
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

      taskTypeDataItem = typeData.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);

    }
  };

  const GetMasterData = async (loadtask: any) => {
    if (AllListId?.MasterTaskListID != undefined) {
      try {
        let web = new Web(props?.siteUrl);
        await web.lists
          .getById(AllListId?.MasterTaskListID)
          .items.select("ComponentCategory/Id", "ComponentLink", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "PortfoliosId", "Portfolios/Id", "Portfolios/Title", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "DeliverableSynonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "AdminNotes", "AdminStatus", "Background", "Help_x0020_Information", "TaskCategories/Id", "TaskCategories/Title", "PriorityRank", "Reference_x0020_Item_x0020_Json", "TeamMembers/Title", "TeamMembers/Name", "TeamMembers/Id", "Item_x002d_Image", "ComponentLink", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
          .expand("ClientCategory", "ComponentCategory", "TeamsGroup", "AssignedTo", "AttachmentFiles", "Author", "Editor", "TeamMembers", "Portfolios", "TaskCategories", "Parent")
          .getById(QueryId)
          .get().then((fetchedProject: any) => {
            fetchedProject.siteUrl = props?.siteUrl;
            fetchedProject.listId = AllListId?.MasterTaskListID;
            fetchedProject.TaskID = fetchedProject.PortfolioStructureID;
            fetchedProject.SmartPriority;
            if ((fetchedProject.PercentComplete != undefined)) {
              fetchedProject.PercentComplete = (fetchedProject?.PercentComplete * 100).toFixed(0)
            } if (fetchedProject?.DueDate != undefined) {
              fetchedProject.DisplayDueDate = fetchedProject.DueDate != null
                ? Moment(fetchedProject.DueDate).format("DD/MM/YYYY")
                : "";
            } else {
              fetchedProject.DisplayDueDate = '';
            }
            if (fetchedProject?.PortfolioStructureID != undefined) {
              fetchedProject.TaskID = fetchedProject?.PortfolioStructureID;
            } else {
              fetchedProject.TaskID = ''
            }
            if (fetchedProject?.Item_x0020_Type == "Project") {
              fetchedProject.subRows = AllFlatProject?.filter((data: any) => data?.Parent?.Id == fetchedProject?.Id && data?.Item_x0020_Type == "Sprint")
              fetchedProject.subRows?.map((item: any) => {
                let itemAuthor = AllUser?.find((user: any) => {
                  if (user?.AssingedToUser?.Id == item?.Author?.Id) {
                    return true
                  }
                })
                item.createdImg = itemAuthor?.Item_x0020_Cover?.Url

                let itemEditor = AllUser?.find((user: any) => {
                  if (user?.AssingedToUser?.Id == item?.Editor?.Id) {
                    return true
                  }
                })
                item.modifiedImg = itemEditor?.Item_x0020_Cover?.Url

                if (item?.Modified != undefined) {
                  item.DisplayModifiedDate = item.Modified != null
                    ? Moment(item.Modified).format("DD/MM/YYYY")
                    : "";
                } else {
                  item.DisplayModifiedDate = '';
                }
              })
            }
            if (fetchedProject?.ParentId != undefined && fetchedProject?.Item_x0020_Type == "Sprint") {
              fetchedProject.Parent = AllFlatProject?.find((data: any) => data?.Id == fetchedProject?.ParentId)
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
            if (fetchedProject?.Title != undefined) {
              const suggestedKeywords = fetchedProject?.Title.toLowerCase().split(/\s+/);
              if (suggestedKeywords.length > 0) {
                suggestedPortfolioItems = MasterListData.filter((masterItm: any) => {
                  const titleWords = masterItm?.Title?.toLowerCase();
                  const includesAnyKeyword = suggestedKeywords?.some((keyword: any) => titleWords?.includes(keyword));
                  const isNotMatchingTitles = titleWords !== fetchedProject?.Title?.toLowerCase() && titleWords !== 'latest annual report';
                  return includesAnyKeyword && isNotMatchingTitles && masterItm?.Item_x0020_Type !== 'Project' && masterItm?.Item_x0020_Type !== 'Sprint';
                });
              }
            }
            projectData = fetchedProject;
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
  const timeEntryIndex: any = {};

  function getStartingDate(startDateOf: any) {
    const startingDate = new Date();
    let formattedDate = startingDate;
    if (startDateOf == 'This Week') {
      startingDate.setDate(startingDate.getDate() - startingDate.getDay());
      formattedDate = startingDate;
    } else if (startDateOf == 'This Month') {
      startingDate.setDate(1);
      formattedDate = startingDate;
    }

    return formattedDate;
  }
  function getEndingDate(startDateOf: any): Date {
    const endingDate = new Date();
    let formattedDate = endingDate;

    if (startDateOf === 'This Week') {
      endingDate.setDate(endingDate.getDate() + (6 - endingDate.getDay()));
      formattedDate = endingDate;
    } else if (startDateOf === 'This Month') {
      endingDate.setMonth(endingDate.getMonth() + 1, 0);
      formattedDate = endingDate;
    }

    return formattedDate;
  }

  const smartTimeTotal = async () => {
    setPageLoader(true);
    try {
      let AllTimeEntries = [];
      if (timeSheetConfig?.Id !== undefined) {
        AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfig);
      }

      AllTimeEntries?.forEach((entry: any) => {
        siteConfig.forEach((site: any) => {
          const taskTitle = `Task${site.Title}`;
          const key = taskTitle + entry[taskTitle]?.Id
          if (entry.hasOwnProperty(taskTitle) && entry.AdditionalTimeEntry !== null && entry.AdditionalTimeEntry !== undefined) {
            const additionalTimeEntry = JSON.parse(entry.AdditionalTimeEntry);
            let totalTaskTime = additionalTimeEntry?.reduce((total: any, time: any) => total + parseFloat(time.TaskTime), 0);

            if (timeEntryIndex.hasOwnProperty(key)) {
              timeEntryIndex[key].TotalTaskTime += totalTaskTime
            } else {
              timeEntryIndex[`${taskTitle}${entry[taskTitle]?.Id}`] = {
                ...entry[taskTitle],
                TotalTaskTime: totalTaskTime,
                siteType: site.Title,
              };
            }
          }
        });
      });
      backupAllTasks?.map((task: any) => {
        task.TotalTaskTime = 0;
        const key = `Task${task?.siteType + task.Id}`;
        if (timeEntryIndex.hasOwnProperty(key) && timeEntryIndex[key]?.Id === task.Id && timeEntryIndex[key]?.siteType === task.siteType) {
          task.TotalTaskTime = timeEntryIndex[key]?.TotalTaskTime;
        }
      })
      backupTableData = backupAllTasks;
      setProjectTableData(backupAllTasks);
      setPageLoader(false)
      if (timeEntryIndex) {
        try {
          const dataString = JSON.stringify(timeEntryIndex);
          localStorage.setItem('timeEntryIndex', dataString);
        } catch (e) { console.log(e) }
      }
    } catch (error) {
      setPageLoader(false)
    }
  };
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

  const checkTimeEntrySite = (timeEntry: any) => {
    let result: any
    result = PXTasks?.filter((task: any) => {
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
  
const loadAllPXTimeEntries = async () => {
  let startingWeekDate = getStartingDate("This Week").setHours(0, 0, 0, 0);
  let endingWeekDate = getEndingDate("This Week").setHours(0, 0, 0, 0);
  let startingMonthDate = getStartingDate("This Month").setHours(0, 0, 0, 0);
  let endingMonthDate = getEndingDate("This Month").setHours(0, 0, 0, 0);
  setPageLoader(true);

  const parseDate = (dateStr: any) => {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]).setHours(0, 0, 0, 0);
  };

  try {
    let AllTimeEntries = [];
    if (timeSheetConfig?.Id !== undefined) {
      AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfig);
    }

    AllTimeEntries?.map((entry: any) => {
      entry.taskDetails = checkTimeEntrySite(entry)
    });

    const { PXtimeEntries, weekTime, monthTime } = AllTimeEntries?.reduce(
      (acc: any, timeEntry: any) => {
          try {
              if (timeEntry?.AdditionalTimeEntry) {
                  const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);

                  AdditionalTime?.forEach((filledTime: any) => {
                      const [day, month, year] = filledTime?.TaskDate?.split('/');
                      const timeFillDate = new Date(+year, +month - 1, +day);

                      if (
                          timeEntry.taskDetails[0]
                      ) {
                          const data = { ...timeEntry.taskDetails[0] } || {};

                          data.TaskTime = parseFloat(filledTime?.TaskTime);
                          data.TimeDate = filledTime.TaskDate;
                          data.TimeDescription = filledTime.Description;
                          data.TimeEntryAuthorImage = filledTime.AuthorImage
                          data.TimeEntryAuthorName = filledTime.AuthorName
                          acc.PXtimeEntries.push(data);

                          if (timeFillDate?.setHours(0, 0, 0, 0) >= startingWeekDate && timeFillDate?.setHours(0, 0, 0, 0) <= endingWeekDate) {
                            acc.weekTime += Number(filledTime?.TaskTime)
                          }
                          if (timeFillDate?.setHours(0, 0, 0, 0) >= startingMonthDate && timeFillDate?.setHours(0, 0, 0, 0) <= endingMonthDate) {
                            acc.monthTime += Number(filledTime?.TaskTime)
                          }
                      }
                  });
              }

          } catch (error) {
              setPageLoader(false)
          }
          return acc;
      },
      { PXtimeEntries: [], weekTime: 0, monthTime: 0 }
  );

    PXtimeEntries.sort((a: any, b: any) => parseDate(b.TimeDate) - parseDate(a.TimeDate));
    weekTotalTime = weekTime;
    monthTotalTime = monthTime;
    setTimeEntries(PXtimeEntries);
    setPageLoader(false);
  } catch (error) {
    console.log(error);
    setPageLoader(false);
  }
};
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {
    if (elem?.TaskType != undefined) {
      setCheckedList(elem);
    }
    else if (elem?.TaskType == undefined) {
      selectedItem = elem
    }
    else {
      setCheckedList({});
    }
  }, []);
  const onRenderCustomHeaderMain = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div className="subheading">
          <span className="siteColor">{`Create Item`}</span>
        </div>
        <Tooltip ComponentId={1746} />
      </div>
    );
  };

  const closeActivity = () => {
    setActivityPopup(false)
    setActiveTile("")
    setSearchedkeyPortfolios([])
    childRef?.current?.setRowSelection({});
  }

  const LoadSmartmetadata = async () => {
    let web = new Web(AllListId?.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      .getById(AllListId?.SmartMetadataListID)
      .items.select(
        "Id",
        "Title",
        "IsVisible",
        "ParentID",
        "SmartSuggestions",
        "TaxType",
        "Description1",
        "Configurations",
        "Item_x005F_x0020_Cover",
        "listId",
        "siteName",
        "siteUrl",
        "SortOrder",
        "SmartFilters",
        "Selectable",
        "Color_x0020_Tag",
        "Parent/Id",
        "Parent/Title"
      )
      .filter("TaxType eq 'Documentquery'")
      .top(4999)
      .expand("Parent")
      .get();

    tempmetadata = JSON.parse(smartmetaDetails[0].Configurations)
  };

  const loadTaggedDocuments = async () => {
    let taggedDocs: any = []
    let AllDocs: any
    let uniqueIds: any = {}
    const web = new Web(AllListId?.siteUrl);
    try {
      await web.lists.getById(AllListId?.DocumentsListID)
        .items
        .select(tempmetadata[0]?.query)
        .getAll()
        .then((Data: any) => {
          let flatTableData = globalCommon.deepCopy(backupTableData)
          let flatData = flattenData(flatTableData)
          flatData.push(projectData)
          AllDocs = Data
          AllDocs.forEach((doc: any) => {
            flatData.forEach((item: any) => {
              // Check for TaskType and matching Id
              if (item.TaskType) {
                if (doc[item.siteType] && doc[item.siteType][0]?.Id == item.Id) {
                  doc.Reference = item
                  taggedDocs.push(doc);
                }
              }
              // Check for Portfolios and matching Id
              if (doc.Portfolios) {
                doc.Portfolios.forEach((docItem: any) => {
                  if (docItem.Id == item.Id) {
                    doc.Reference = item
                    taggedDocs.push(doc);
                  }

                });
              }
            });
          });
        })
      taggedDocs = taggedDocs.filter((items: any) => {
        if (!uniqueIds[items.Id]) {
          uniqueIds[items.Id] = true;
          return true;
        }
        return false;
      })
      console.log("All Tagged Documents", taggedDocs)
      keyTaggedDocs = taggedDocs.filter((doc: any) => doc.ItemRank == 6)

      if (keyTaggedDocs.length > 0) {
        keyTaggedDocs.map((docs: any) => {
          AllUser.map((user: any) => {
            if (user?.AssingedToUser != undefined && user?.AssingedToUser?.Id != undefined) {
              if (user?.AssingedToUser?.Id == docs?.Author?.Id) {
                docs.UserImage = user?.Item_x0020_Cover?.Url
              }
              if (user?.AssingedToUser?.Id == docs?.Editor?.Id) {
                docs.EditorImage = user?.Item_x0020_Cover?.Url
              }
              if (docs.Reference) {
                if (docs.Reference.Item_x0020_Type == "Project" || docs.Reference.Item_x0020_Type == "Sprint") {
                  docs.ReferenceID = docs.Reference.PortfolioStructureID
                }
                else if (docs.Reference.TaskType) {
                  docs.ReferenceID = docs.Reference.TaskID
                }
              }
            }
          })
        })
      }
      console.log(keyTaggedDocs)
      setKeyTaggedDoc(keyTaggedDocs)

    } catch (e: any) {
      console.log(e);
    }
  }

  const CallBack = React.useCallback((item: any, type: any) => {
    setIsAddStructureOpen(false)
    if (type == 'Save') {
      if (item?.Item_x0020_Type == "Sprint") {
        // let allData = data;
        if (CurrentUserData?.Id != undefined) {
          item.createdImg = CurrentUserData?.Item_x0020_Cover?.Url
          item.Author = CurrentUserData
        }
        allBackupSprintAndTask.unshift(item)
        renderData = [];
        renderData = renderData.concat(allBackupSprintAndTask)
        refreshData();
      }
      GetMasterData(false)
    } else {
      if (type == "UpdatedData") {
        setpassdata(item);
      }
      LoadAllSiteTasks();
      setisOpenEditPopup(false);
    }

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
          .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "Configurations", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
          .top(5000)
          .expand("Parent")
          .get();
        if (smartmeta.length > 0) {
          smartmeta?.map((site: any) => {
            if (site?.TaxType == 'Sites' && site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.IsVisible == true && site?.listId != undefined && site?.listId?.length >= 32) {
              siteConfig.push(site)
            }
            if (site?.TaxType == 'timesheetListConfigrations') {
              timeSheetConfig = site;
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
    if (item?.Item_x0020_Type != "Sprint") {
      setisOpenEditPopup(true);
      setpassdata(item);
    } else {
      EditComponentPopup(item)
    }

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
  const TimeEntryCallBack = React.useCallback((item1) => {
    setOpenTimeEntryPopup(false);
  }, []);
  const EditDataTimeEntry = (e: any, item: any) => {
    setTaskTimeDetails(item);
    setOpenTimeEntryPopup(true);
  };

  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = props?.siteUrl;
    item["listName"] = "Master Tasks";
    setIsComponent(true);
    setCMSComponent(item);
  };

  const tagAndCreateCallBack = React.useCallback(() => {
    setIsTaggedCompTask(false)
    setCreateTaskId({ portfolioData: null, portfolioType: null })
    renderData = backupTableData;
    LoadAllSiteTasks();
    refreshData()
  }, []);
  const CreateTask = React.useCallback(() => {
    setisOpenCreateTask(false)
  }, []);
  const inlineCallBack = React.useCallback((item: any) => {
    setProjectTableData(prevTasks => {
      return prevTasks.map((task: any) => {
        if (task.Id === item.Id && task.siteType === item.siteType) {
          return { ...task, ...item };
        }
        return task;
      });
    });
    backupTableData = ProjectTableData;
  }, []);



  const LoadAllSiteTasks = async function () {
    setPageLoader(true);
    let taskComponent: any = [];
    try {
      taskComponent = JSON.parse(JSON.stringify(TaggedPortfoliosToProject));
    } catch (e) {

    }

    taskTaggedComponents = [];
    let localtimeEntryIndex: any;
    try {
      localtimeEntryIndex = localStorage.getItem('timeEntryIndex')
      localtimeEntryIndex = JSON?.parse(localtimeEntryIndex);
    } catch (error) {

    }
    try {
      var AllTask: any = [];
      allBackupSprintAndTask = [];
      let web = new Web(props?.siteUrl);
      var arraycount = 0;

      let smartmeta: any = [];
      let AllProjectTasks: any = [];
      if (projectData?.Item_x0020_Type == "Sprint") {
        AllProjectTasks = smartmeta = await globalCommon?.loadAllSiteTasks(AllListId, `Project/Id eq ${projectData?.Id}`)
        console.log(AllProjectTasks)
      } else {

        if (projectData?.subRows == undefined || projectData?.subRows?.length == 0) {
          AllProjectTasks = smartmeta = await globalCommon?.loadAllSiteTasks(AllListId, `Project/Id eq ${projectData?.Id}`)
        } else if (projectData?.subRows?.length > 0 && projectData?.subRows?.length < 7) {
          let filterQuery = ''
          try {
            filterQuery = projectData?.subRows?.map((Sprint: any) => `Project/Id eq ${Sprint?.Id}`).join(' or ');
            filterQuery += ` or Project/Id eq ${projectData?.Id}`
          } catch (e) {

          }
          AllProjectTasks = smartmeta = await globalCommon?.loadAllSiteTasks(AllListId, filterQuery)
        } else {
          AllProjectTasks = smartmeta = await globalCommon?.loadAllSiteTasks(AllListId, `Project/Id ne null`)
        }
      }
      AllProjectTasks.map((items: any) => {
        items.SmartPriority = globalCommon.calculateSmartPriority(items);
        if (items?.SmartInformation?.length > 0) {
          allSmartInfo?.map((smart: any) => {
            if (smart?.Id == items?.SmartInformation[0]?.Id) {
              // var smartdata=[]
              // smartdata.push(smart)
              items.SmartInformation = [smart]
            }

          })
          items.SmartInformationTitle = items.SmartInformation[0].Title
        } else {
          items.SmartInformationTitle = ''
        }
        items.TotalTaskTime = 0;
        const key = `Task${items?.siteType + items.Id}`;
        try {
          if (localtimeEntryIndex?.hasOwnProperty(key) && localtimeEntryIndex[key]?.Id === items.Id && localtimeEntryIndex[key]?.siteType === items.siteType) {
            items.TotalTaskTime = localtimeEntryIndex[key]?.TotalTaskTime;
          }
        } catch (error) {

        }
        items.TaskTypeValue = ''
        if (items?.TaskCategories?.length > 0) {
          items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
        }
        if (items?.TaskCategories?.length > 0) {
          items.Categories = items.TaskTypeValue;
        }
        items.AllTeamMember = [];
        items.HierarchyData = [];
        items.descriptionsSearch = '';
        if (items?.FeedBack != undefined) {
          items.descriptionsSearch = globalCommon.descriptionSearchData(items)
        } else {
          items.descriptionsSearch = '';
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
        items.DisplayModifiedDate =
          items.Modified != null
            ? Moment(items.Modified).format("DD/MM/YYYY")
            : "";
        items.portfolio = {};
        if (items?.Portfolio?.Id != undefined) {
          items.Portfolio = MasterListData?.find((masterItem: any) => masterItem?.Id == items?.Portfolio?.Id)
          items.PortfolioTitle = '';
          items.portfolio = items?.Portfolio;
          items.PortfolioTitle = items?.Portfolio?.Title;
          items.ProjectTitle = '';
          items.ProjectID = items?.Project?.PortfolioStructureID
          items.project = items?.Project;
          items.ProjectTitle = items?.Project?.Title;
          // items["Portfoliotype"] = "Component";
        }
        if (items?.Project?.Id != undefined) {
          items.Project = AllFlatProject?.find((Project: any) => Project?.Id == items?.Project?.Id)
        }


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
        AllUser?.map((item: any) => {
          if (item?.AssingedToUserId == items.Editor.Id) {
            items.modifiedImg = item?.Item_x0020_Cover?.Url;
          }
        })
        items.subRows = [];
        AllTask.push(items);
      });
      try {

        backupAllTasks = globalCommon?.deepCopy(AllTask);
        setAllTasks(backupAllTasks);
      } catch (error) {

      }

      let allSprints = [];
      if (projectData?.subRows?.length > 0 && projectData?.Item_x0020_Type == "Project") {
        allSprints = projectData?.subRows
        allSprints?.map((Sprint: any) => {

          let allSprintActivities: any = []
          allSprintActivities = AllTask.filter((task: any) => {
            if (task?.TaskType?.Id == 1 && task?.Project?.Id == Sprint?.Id) {
              task.isTaskPushed = true;
              task.project = Sprint;
              task.portfolio = Sprint?.Portfolio
              return true
            } else {
              return false
            }
          });
          allSprintActivities?.map((Activity: any) => {
            Activity.subRows = AllTask.filter((workstream: any) => {
              if (workstream?.ParentTask?.Id == Activity?.Id && workstream?.Project?.Id == Sprint?.Id && (workstream?.TaskType?.Id == 3 || workstream?.TaskType?.Id == 2)) {
                workstream.isTaskPushed = true;
                workstream.project = Sprint;
                workstream.portfolio = Sprint?.Portfolio
                return true
              } else {
                return false
              }
            });
            Activity?.subRows?.map((workstream: any) => {
              if (workstream?.TaskType?.Id == 3) {
                workstream.subRows = AllTask.filter((task: any) => {
                  if (task?.ParentTask?.Id == workstream?.Id && task?.TaskType?.Id == 2 && task?.Project?.Id == Sprint?.Id) {
                    task.isTaskPushed = true;
                    task.project = Sprint;
                    task.portfolio = Sprint?.Portfolio
                    return true
                  } else {
                    return false
                  }
                });
              }
            })
          })
          let allSprintWorkStream: any = []
          allSprintWorkStream = AllTask.filter((task: any) => {
            if (task?.TaskType?.Id == 3 && task?.isTaskPushed !== true && task?.Project?.Id == Sprint?.Id) {
              task.isTaskPushed = true;
              task.project = Sprint;
              task.portfolio = Sprint?.Portfolio
              return true
            } else {
              return false
            }
          });
          allSprintWorkStream?.map((workstream: any) => {
            workstream.subRows = AllTask.filter((task: any) => {
              if (task?.ParentTask?.Id == workstream?.Id && task?.TaskType?.Id == 2 && task?.isTaskPushed !== true && task?.Project?.Id == Sprint?.Id) {
                task.isTaskPushed = true;
                task.project = Sprint;
                task.portfolio = Sprint?.Portfolio
                return true
              } else {
                return false
              }
            });
          })
          let AllSprintTask = AllTask.filter((item: any) => {
            if (item?.isTaskPushed !== true && item?.Project?.Id == Sprint?.Id) {
              item.isTaskPushed = true;
              item.project = Sprint;
              item.portfolio = Sprint?.Portfolio
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
      allActivities = AllTask.filter((task: any) => {
        if (task?.TaskType?.Id == 1 && task?.Project?.Id == projectData?.Id) {
          task.isTaskPushed = true;
          return true
        } else {
          return false
        }
      });
      allActivities?.map((Activity: any) => {
        Activity.subRows = AllTask.filter((workstream: any) => {
          if (workstream?.ParentTask?.Id == Activity?.Id && workstream?.Project?.Id == projectData?.Id && (workstream?.TaskType?.Id == 3 || workstream?.TaskType?.Id == 2)) {
            workstream.isTaskPushed = true;
            return true
          } else {
            return false
          }
        });
        Activity?.subRows?.map((workstream: any) => {
          if (workstream?.TaskType?.Id == 3) {
            workstream.subRows = AllTask.filter((task: any) => {
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
      allWorkStream = AllTask.filter((task: any) => {
        if (task?.TaskType?.Id == 3 && task?.isTaskPushed !== true && task?.Project?.Id == projectData?.Id) {
          task.isTaskPushed = true;
          return true
        } else {
          return false
        }
      });
      allWorkStream?.map((workstream: any) => {
        workstream.subRows = AllTask.filter((task: any) => {
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
      let AllTaskToBePushed: any = AllTask.filter((item: any) => {
        if (item?.isTaskPushed !== true && item?.Project?.Id == projectData?.Id) {
          item.isTaskPushed = true;
          return true;
        }
      });
      AllTask?.map((task: any) => {
        if (task?.isTaskPushed == true) {
          if (!taskComponent?.some((id: any) => id == task?.Portfolio?.Id)) {
            let comp = task?.Portfolio
            taskComponent.push(comp?.Id)
            taskTaggedComponents.push(comp)
          }
          suggestedPortfolioItems = suggestedPortfolioItems.filter((itms: any) => {
            if (smartPortfoliosData !== undefined || taskTaggedComponents !== undefined) {
              const isKeyTitleMatch = smartPortfoliosData.some((tagPort: any) => tagPort?.Title === itms?.Title);
              const isRelevantTitleMatch = taskTaggedComponents.some((taskTag: any) => taskTag?.Title === itms?.Title);
              const isProjectOrSprint = itms?.Item_x0020_Type === 'Project' || itms?.Item_x0020_Type === 'Sprint';
              if (isKeyTitleMatch || isRelevantTitleMatch || isProjectOrSprint) {
                return false;
              }
            }
            return itms?.Item_x0020_Type !== 'Project' && itms?.Item_x0020_Type !== 'Sprint';
          });
        }
      })
      allSprints = allSprints.concat(AllTaskToBePushed);
      allBackupSprintAndTask = allSprints
      let allRowInfo = getAllRowInfo(allSprints)
      countAWT(allRowInfo)
      countPoject(allRowInfo)
      setProjectTableData(allSprints);
      backupTableData = allSprints;
      let groupedDataItems = globalCommon.deepCopy(backupTableData);
      let flattenedData = flattenData(groupedDataItems)
      PXTasks = flattenedData.filter((item: any) => item.TaskType)
      totalTime = PXTasks?.reduce((total: any, time: any) => total + time.TotalTime, 0);
      totalTime = totalTime/60;
      totalTime = totalTime.toFixed(2)
      setTaskTaggedPortfolios(taskTaggedComponents)
      setSuggestedPortfolios(suggestedPortfolioItems)
      loadTaggedDocuments();
      filteredTasks("Week")
      setPageLoader(false);
    } catch (error) {
      console.log(error)
      setPageLoader(false);

    }

  }

  const filteredTasks = (filterType: any) => {
    let currentDate: any = Moment();
    let date: any = new Date();
    if (filterType == "Week") {
      let weekDates: any = []
      let startWeekDay = currentDate.day()
      let conditionRun = 6 - startWeekDay;
      while (conditionRun > 0) {
        weekDates.push(currentDate.format('DD/MM/YYYY'))
        currentDate.add(1, 'day');
        conditionRun--;
      }
      let groupedDataItems = globalCommon.deepCopy(backupTableData);
      let flattenedData = flattenData(groupedDataItems)
      let tasksData = flattenedData.filter((item: any) => item.TaskType && item.WorkingAction != undefined)
      let filterTasksinfo = tasksData.filter((task: any) => task.WorkingActionParsed.some((workingAct: any) => workingAct.Title == "WorkingDetails" && workingAct.InformationData.some((taskInfo: any) => weekDates.includes(taskInfo.WorkingDate))))
      const startingDate = new Date();
      startingDate.setDate(startingDate.getDate() + 1);
      filterTasksinfo.map((tasks: any) => {
        tasks.WorkingActionParsed.map((workingAct: any) => {
          if (workingAct.Title == "WorkingDetails" && workingAct.InformationData) {
            workingAct.InformationData.map((taskInfo: any) => {
              if (taskInfo.WorkingDate == Moment(date).format('DD/MM/YYYY') && weekDates.includes(taskInfo.WorkingDate)) {
                tasks.workingTaskDate = `Today`
              } else if (taskInfo.WorkingDate == Moment(startingDate).format('DD/MM/YYYY') && weekDates.includes(taskInfo.WorkingDate)) {
                tasks.workingTaskDate = `Tomorrow`
              }
              else if (taskInfo.WorkingDate != Moment(date).format('DD/MM/YYYY') && weekDates.includes(taskInfo.WorkingDate)) {
                tasks.workingTaskDate = `This Week`
              }
            })
          }
        })
      })
      console.log(filterTasksinfo)
      setFilteredTasks(filterTasksinfo)
    }
  }


  const getAllRowInfo = (allSprints: any) => {
    let allrowInfo: any = [];
    function getallRows(value: any) {
      value?.map((item: any) => {
        allrowInfo.push(item)
        if (item?.subRows?.length > 0) {
          getallRows(item?.subRows)
        }
      })

    }
    getallRows(allSprints)
    return allrowInfo;
  }
  const countAWT = (countTaskAWTLevel: any) => {
    countTaskAWTLevel?.map((result: any) => {
      taskTypeDataItem?.map((type: any) => {
        if (result?.TaskType?.Title === type.Title) {
          type[type?.Title + 'filterNumber'] += 1;
          type[type?.Title + 'number'] += 1;
        }
      });
    })
  }
  const countPoject = (projectCount: any) => {
    let portfolioTypeData: any = []
    let Item: any = {};
    Item.Title = "Sprint";
    Item.Sprintnumber = 0;
    Item.SprintfilterNumber = 0;
    Item.SprintnumberCopy = 0;
    portfolioTypeData?.push(Item);
    projectCount?.map((item: any) => {
      portfolioTypeData?.map((showPortFolio: any) => {
        if (item?.Item_x0020_Type == showPortFolio?.Title) {
          showPortFolio[showPortFolio.Title + 'filterNumber'] += 1;
          showPortFolio[showPortFolio.Title + 'number'] += 1;
        }
      })

    })
    setPortFolioTypeIcon(portfolioTypeData)
  }

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
      TaskUserListId: AllListId.TaskUserListID,
    }
    let componentDetails: any = [];
    let results = await globalCommon.GetServiceAndComponentAllData(PropsObject)
    if (results?.AllData?.length > 0 || results?.AllData?.length == 0) {
      componentDetails = results?.AllData;
      groupedComponentData = results?.GroupByData;
      AllFlatProject = results?.FlatProjectData
    }
    MasterListData = componentDetails
    if (AllFlatProject?.length > 0)
      MasterListData = MasterListData.concat(AllFlatProject)

  }
  const EditPortfolio = (item: any, type: any) => {
    portfolioType = type;
    setCMSComponent(item);
    setIsPortfolio(true);
  };

  const EditKeyRelevantPortfolio = (item: any) => {
    setTagPortfolio(item);
    setKeyRelevantPortfolios(true);
  };
  const OpenAddStructureModal = () => {
    setIsAddStructureOpen(true);
  }
  const CreateActivityPopup = (type: any) => {
    setActiveTile(type)
    if (Masterdata != null && Masterdata != undefined) {
      Masterdata.NoteCall = type;
    }
    if (checkedList?.TaskType === undefined) {
      checkedList.NoteCall = type;
      selectedItem.NoteCall = type;
    }
    if (checkedList?.TaskType?.Id == 1) {
      checkedList.NoteCall = type;
    }
    if (checkedList?.TaskType?.Id == 3) {
      checkedList.NoteCall = type;
    }
    if (checkedList?.TaskType?.Id == 2) {
      alert("You can not create ny item inside Task");
    }
  };
  const addActivity = (type: any) => {
    keyRelevantPortfolioItems = [...Masterdata?.taggedPortfolios, ...TaskTaggedPortfolios]
    if (checkedList?.TaskType?.Id == undefined) {
      checkedList.NoteCall = type
      setActivityPopup(true);
    }
    if (checkedList?.TaskTypeId === 3 || checkedList?.TaskType?.Id === 3) {
      checkedList.NoteCall = "Task";
      setIsOpenActivity(true);
    }
    if (checkedList?.TaskType?.Id == 1 || checkedList?.TaskTypeId == 1) {
      checkedList.NoteCall = "Workstream";
      setIsOpenWorkstream(true);
    }
    if (checkedList?.TaskType?.Id == 2) {
      alert("You can not create ny item inside Task");
    }
  };
  const Createbutton = () => {
    if (checkedList?.TaskType === undefined) {
      setIsOpenActivity(true);
      setActiveTile("")
    }
    if (checkedList?.TaskType?.Id == 1) {
      setIsOpenWorkstream(true);
      setActiveTile("")
    }
    if (checkedList?.TaskType?.Id == 3) {
      setIsOpenActivity(true);
      setActiveTile("")
    }
    if (checkedList?.TaskType?.Id == 2) {
      alert("You can not create ny item inside Task");
    }
    setSearchedkeyPortfolios([])
    setSuggestedPortfolio("")
  };
  const Call = (propsItems: any, type: any) => {
    if (propsItems?.Id != undefined) {
      if (propsItems?.DueDate != undefined) {
        propsItems.DisplayDueDate = propsItems.DueDate != null
          ? Moment(propsItems.DueDate).format("DD/MM/YYYY")
          : "";
      } else {
        propsItems.DisplayDueDate = '';
      }
      if (propsItems?.Created != undefined) {
        propsItems.DisplayCreateDate = propsItems.Created != null
          ? Moment(propsItems.Created).format("DD/MM/YYYY")
          : "";
      } else {
        propsItems.DisplayCreateDate = '';
      }
      if (propsItems?.Modified != undefined) {
        propsItems.DisplayModifiedDate = propsItems.Modified != null
          ? Moment(propsItems.Modified).format("DD/MM/YYYY")
          : "";
      } else {
        propsItems.DisplayModifiedDate = '';
      }
      if (propsItems?.taggedPortfolios != undefined) {
        let filteredSmartPortfolios = propsItems?.taggedPortfolios.filter((tagPort: any) => tagPort?.Id !== undefined).map((tagPort: any) => smartPortfoliosData.find((port: any) => port?.Id === tagPort?.Id));
        smartPortfoliosData = filteredSmartPortfolios
      }
    }
    if (propsItems?.Item_x0020_Type == "Project") {
      setMasterdata(propsItems)
    } else if (propsItems?.Item_x0020_Type == "Sprint") {

      setProjectTableData((prev: any) => {
        return prev?.map((object: any) => {
          if (object?.Id === propsItems?.Id) {
            return { ...object, ...propsItems };
          }
          return object; // Return the object whether it's modified or not
        });
      });
      backupTableData = ProjectTableData
    }
    if (propsItems === "Close") {
      setIsComponent(false);
      setIsOpenActivity(false)
      setIsOpenWorkstream(false)
      setActivityPopup(false)
    }
    if (propsItems?.data && propsItems?.data?.ItmesDelete != true && (propsItems?.data?.TaskTypeId == 1 || propsItems?.data?.TaskType?.Id == 2 || propsItems?.data?.TaskType?.Id == 3)) {
      setIsOpenActivity(false)
      setIsOpenWorkstream(false)
      setActivityPopup(false)
      LoadAllSiteTasks();
    }
    setIsComponent(false);
    GetMasterData(false)
  };

  const LoadAllSiteAllTasks = async function () {
    try {
      AllSitesAllTasks = await globalCommon?.loadAllSiteTasks(AllListId);
      return AllSitesAllTasks
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
    if (items?.SmartInformation?.length > 0) {
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
    setopenServiceComponent(false)
  }, [])

  const keyRelevantPortfolioPopupCallback = React.useCallback((DataItem: any, Type: any, functionType: any) => {
    if (DataItem?.length > 0 && Type == "Single") {
      DataItem?.forEach((data: any) => {
        taggedPortfolioItem = data
        setTaggedPortfolio([data])
      })
    }
    setKeyRelevantPortfolios(false);
  }, [])


  const callChildFunction = (items: any) => {
    if (childRef.current) {
      childRef.current.callChildFunction(items);
    }
  };
  const isUserExists = function (arr: any, Email: any) {
    var isExists = false;
    arr.forEach((item: any) => {
      if (item?.toLowerCase() == Email?.toLowerCase()) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  }
  const ShowTeamFunc = async () => {
    let mention_To: any = [];
    Masterdata?.AssignedTo?.map((item_data: any) => {
      let email: any = item_data?.EMail !== undefined && item_data?.EMail !== '' ? item_data?.EMail : item_data?.Email;
      if (email !== undefined && email !== '') {
        if (!isUserExists(mention_To, email))
          mention_To.push(email);
      }
    });
    Masterdata?.TeamMembers?.map((team_data: any) => {
      let email: any = team_data?.EMail !== undefined && team_data?.EMail !== '' ? team_data?.EMail : team_data?.Email;
      if (email !== undefined && email !== '') {
        if (!isUserExists(mention_To, email))
          mention_To.push(email);
      }
    });
    Masterdata?.ResponsibleTeam.map((resmemb_data: any) => {
      let email: any = resmemb_data?.EMail !== undefined && resmemb_data?.EMail !== '' ? resmemb_data?.EMail : resmemb_data?.Email;
      if (email !== undefined && email !== '') {
        if (!isUserExists(mention_To, email))
          mention_To.push(email);
      }
    });
    mention_To?.map((main_data: any, index: any) => {
      if (main_data.toLowerCase() === CurrentUserData?.Email?.toLowerCase())
        mention_To.splice(index, 1);
    });
    let Group_Title: any = `${Masterdata?.PortfolioStructureID} - ${Masterdata?.Title}`;
    let TeamsMessage = `<span> You have been added in this Group ${Group_Title} </span> `;
    SendTeamMessageforPXProject(mention_To, TeamsMessage, props?.Context, AllListId, Group_Title);
  }
  const SendTeamMessageforPXProject = async (mention_To: any, txtComment: any, Context: any, AllListId: any, Group_Title: any) => {
    if(mention_To?.length === 0){
      alert('Please select Group member to create a PX-Profile Group');
      return false;
    }
    let currentUser: any = {};
    let ExistingGrp: any = {};
    try {
      let pageContent = await globalCommon.pageContext()
      let web = new Web(pageContent?.WebFullUrl);
      currentUser.Email = Context.pageContext._legacyPageContext.userPrincipalName
      const client = await Context.msGraphClientFactory.getClient();
      let res = await client.api(`/users`).version("v1.0").get();
      if (Masterdata?.TeamsGroup !== undefined && Masterdata?.TeamsGroup !== '' && Masterdata?.TeamsGroup !== null) {
        ExistingGrp = await client.api('/chats/' + Masterdata?.TeamsGroup).get();
        Groupusers = await client.api('/chats/' + Masterdata?.TeamsGroup + '/members').get();
      }
      let TeamUser: any[] = [];
      let participants: any = [];
      TeamUser = res?.value;
      let CurrentUserChatInfo = TeamUser.filter((items: any) => {
        if (items.userPrincipalName != undefined && currentUser.Email != undefined && items.userPrincipalName?.toLowerCase() == currentUser?.Email?.toLowerCase())
          return items
      })
      currentUser.ChatId = CurrentUserChatInfo[0]?.id;
      var SelectedUser: any[] = [];
      for (let index = 0; index < mention_To?.length; index++) {
        for (let TeamUserIndex = 0; TeamUserIndex < TeamUser?.length; TeamUserIndex++) {
          if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index]?.toLowerCase() == TeamUser[TeamUserIndex].userPrincipalName?.toLowerCase())
            SelectedUser.push(TeamUser[TeamUserIndex])
          if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index]?.toLowerCase() == 'stefan.hochhuth@hochhuth-consulting.de' && TeamUser[TeamUserIndex].id == 'b0f99ab1-aef3-475c-98bd-e68229168489')
            SelectedUser.push(TeamUser[TeamUserIndex])
        }
      }
      let obj = {
        "@odata.type": "#microsoft.graph.aadUserConversationMember", "roles": ["owner"], "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${currentUser?.ChatId}')`
      }
      participants.push(obj)
      if (SelectedUser != undefined && SelectedUser.length > 0) {
        SelectedUser?.forEach((item: any) => {
          let obj = {
            "@odata.type": "#microsoft.graph.aadUserConversationMember", "roles": ["owner"], "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${item?.id}')`
          }
          participants.push(obj)
        })
      }
      let IsSendTeamMessage = 0;
      if (mention_To != undefined && AllUser != undefined && AllUser?.length > 0 && mention_To?.length > 0) {
        mention_To?.map((TeamUser: any) => {
          AllUser?.map((User: any) => {
            if (User?.AssingedToUser != undefined && User?.AssingedToUser?.EMail != undefined && User?.AssingedToUser?.EMail != '' && User?.AssingedToUser?.EMail?.toLowerCase() == TeamUser?.toLowerCase()) {
              IsSendTeamMessage += 1;
            }
          });
        });
      }
      if (IsSendTeamMessage == mention_To?.length) {
        if (ExistingGrp !== undefined && Object.keys(ExistingGrp).length > 0 && ExistingGrp !== '') {
          let RemoveCurrentUser: any = Groupusers?.value?.filter((itemexists: any) => { return itemexists.email.toLowerCase() !== CurrentUserData?.Email?.toLowerCase() });
          RemoveCurrentUser?.map(async (check_mail: any) => {
            SelectedUser?.map(async (exist_user: any, index: any) => {
              exist_user.userFound = false;
              if (check_mail?.email?.toLowerCase() === exist_user?.userPrincipalName?.toLowerCase()) {
                exist_user.userFound = true;
                SelectedUser.splice(index, 1);
              }
            });
          });
          let count: any = 0;
          if (SelectedUser?.length > 0) {
            Context.msGraphClientFactory.getClient()
              .then((client: any) => {
                SelectedUser?.map((item_iter: any) => {
                  client.api(`/chats/${ExistingGrp?.id}/members`).version('beta').post({
                    '@odata.id': `https://graph.microsoft.com/beta/users/${item_iter?.id}`,
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    "roles": ["owner"],
                    "user@odata.bind": `https://graph.microsoft.com/beta/users('${item_iter?.id}')`
                  })
                    .then((response: any) => {
                      console.log('User added to group chat:', response);
                      count++;
                      if (SelectedUser.length === count) {
                        alert('User added successfully in ' + ExistingGrp.topic)
                      }
                    })
                    .catch((error: any) => {
                      count++;
                      console.error('Error adding user to group chat:', error);
                      if (SelectedUser.length === count) {
                        alert('User not added in ' + ExistingGrp.topic)
                      }
                    });
                });
              });
          }
          else {
            alert('Assigned Users and group are already exists')
          }
        }
        if (Object.keys(ExistingGrp).length == 0 || (ExistingGrp === undefined || ExistingGrp === '' || ExistingGrp === null)) {
          const chat_payload: any = {
            "members": participants,
          }
          if (Group_Title !== undefined && Group_Title !== '') {
            chat_payload.topic = Group_Title;
          }
          mention_To != undefined && mention_To?.length == 1 ? chat_payload.chatType = 'oneOnOne' : chat_payload.chatType = 'group'
          let new_chat_resp = await client.api('/chats').version('v1.0').post(chat_payload);
          var PostData = {
            TeamsGroup: new_chat_resp.id
          }
          web.lists.getById(AllListId?.MasterTaskListID).items.getById(Masterdata?.Id).update(PostData)
            .then(async (updatedFile: any) => {
              console.log('Item Saved Successfully');
              const message_payload = {
                "body": {
                  contentType: 'html',
                  content: `${txtComment}`,
                  //content: 'test',
                }
              }
              let result = await client.api('/chats/' + new_chat_resp?.id + '/messages').post(message_payload)
              if (!result)
                alert('Group created successfully' + Group_Title);
              return result;
            }).catch((e) => {
              console.log(e);
              alert('Group is not created for this' + Group_Title);
            })
        }
      }
      else {
        console.log("Error In Global Common SendTeamMessage Function")
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  const projectTopIcon = (items: any) => {
    if (childRef.current) {
      childRef.current.projectTopIcon(items);
    }
  };

  const callBackData1 = React.useCallback((getData: any, topCompoIcon: any, callback: any) => {
    setTopCompoIcon(topCompoIcon);
    if (callback) {
      LoadAllSiteTasks();
    } else {
      if (callback == undefined) {

        renderData = [];
        renderData = renderData.concat(getData);
        refreshData();
      }
    }
  }, []);


  const switchFlatViewData = (data?: any | null, workingToday?: boolean | null) => {
    let groupedDataItems = [];
    if (workingToday == undefined) {

      try {
        groupedDataItems = globalCommon.deepCopy(data);
      } catch (e) {

      }
      const flattenedData = flattenData(groupedDataItems);
      hasCustomExpanded = false
      hasExpanded = false
      isHeaderNotAvlable = true
      isColumnDefultSortingAsc = true
      setGroupByButtonClickData(data);
      setclickFlatView(true);
      setFlatViewDataAll(flattenedData)
      setProjectTableData(flattenedData);

    } else {
      if (workingToday) {
        groupedDataItems = globalCommon.deepCopy(backupTableData);
        let flattenedData: any = []
        try {
          flattenedData = flattenData(groupedDataItems)
        } catch (e) {

        }
        let filteredTodayTak = flattenedData?.filter((task: any) => {
          if (task?.IsTodaysTask == true) {
            return true
          }
        })
        setFlatViewDataAll(filteredTodayTak)
        setProjectTableData(filteredTodayTak);
      } else {
        setFlatViewDataAll(backupTableData)
        setProjectTableData(backupTableData);
      }
      setWorkingTodayFiltered(workingToday)
    }


    // setProjectTableData(smartAllFilterData);
  }

  const customTableHeaderButtons = (
    <button type="button" className={`btn btn-${workingTodayFiltered ? 'primary' : 'grey'}`} onClick={() => { switchFlatViewData(ProjectTableData, !workingTodayFiltered) }}> Working-Today </button>
  )

  function flattenData(groupedDataItems: any) {
    const flattenedData: any = [];
    function flatten(item: any) {
      if (item.Title != "Others") {
        flattenedData.push(item);
      }
      if (item?.subRows) {
        item?.subRows.forEach((subItem: any) => flatten(subItem));
        item.subRows = []
      }
    }
    groupedDataItems?.forEach((item: any) => { flatten(item) });
    return flattenedData;
  }
  const switchGroupbyData = () => {
    isColumnDefultSortingAsc = false
    hasCustomExpanded = true
    hasExpanded = true
    isHeaderNotAvlable = false
    setclickFlatView(false);
    setProjectTableData(groupByButtonClickData);
  }

  const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: hasCustomExpanded,
        hasExpanded: hasExpanded,
        isHeaderNotAvlable: isHeaderNotAvlable,
        size: 12,
        id: 'Id',
      },
      {
        accessorFn: (row) => row?.Site,
        cell: ({ row }) => (

          <span>
            {row?.original?.Item_x0020_Type == "Sprint" ?
              <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={"Dyicons me-1"}>
                X
              </div>
              : <img className='circularImage rounded-circle' src={row?.original?.SiteIcon} />}

          </span>
        ),
        id: "Site",
        placeholder: "Site",
        header: "",
        resetSorting: false,
        resetColumnFilters: false,
        size: 50,
        isColumnVisible: true,
        fixedColumnWidth: true,
      },
      {
        accessorKey: "TaskID",
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel AllListId={AllListId} CMSToolId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MasterListData} AllSitesTaskData={AllSitesAllTasks} />
            </span>
          </>
        ),
        id: "TaskID",
        placeholder: "Task Id",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 125,
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            {row?.original?.Item_x0020_Type == "Sprint" ?
              <div className="alignCenter">
                <a
                  className="hreflink"
                  href={`${props?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.Id}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
                {row?.original?.descriptionsSearch?.length > 0 ? (
                    <InfoIconsToolTip
                      Discription={row?.original?.bodys}
                      row={row?.original}
                    />
                ) : (
                  ""
                )}
              </div>
              : <div className="alignCenter">
                <a
                  className="hreflink"
                  href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
                {row?.original?.descriptionsSearch?.length > 0 ? (
                    <InfoIconsToolTip
                      Discription={row?.original?.bodys}
                      row={row?.original}
                    />
                ) : (
                  ""
                )}
              </div>}

          </>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.PortfolioTitle,
        cell: ({ row }) => (
          <a
            className="hreflink"
            data-interception="off"
            target="blank"
            href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
          >
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel AllListId={AllListId} onclickPopup={false} CMSToolId={row?.original?.portfolio?.Title} row={row?.original?.Portfolio} singleLevel={true} masterTaskData={MasterListData} AllSitesTaskData={AllSitesAllTasks} />
            </span>
          </a>
        ),
        id: "Portfolio",
        placeholder: "Portfolio Item",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.ProjectID + " " + row?.ProjectTitle,
        cell: ({ row }) => (
          <>
            {row.original.ProjectTitle != (null || undefined) &&
              <a
                className="hreflink"
                data-interception="off"
                target="blank"
                href={`${props?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.project?.Id}`}
              >
                <span className="d-flex">
                  <ReactPopperTooltipSingleLevel
                    AllListId={AllListId}
                    onclickPopup={false}
                    CMSToolId={row?.original?.project?.PortfolioStructureID}
                    row={row?.original?.Project}
                    singleLevel={true}
                    masterTaskData={MasterListData}
                    AllSitesTaskData={AllSitesAllTasks}
                  />
                </span>
              </a>}
          </>
        ),
        id: "ProjectTitle",
        placeholder: "Project",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        size: 70,
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.TaskTypeValue,
        cell: ({ row }) => (
          <>
            <span className="columnFixedTaskCate">
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
        accessorFn: (row) => row?.PriorityRank,
        cell: ({ row }) => (
          <span>
            <InlineEditingcolumns
              AllListId={AllListId}
              type='Task'
              TaskUsers={AllUser}
              columnName='Priority'
              item={row?.original} />
          </span>
        ),
        placeholder: "Priority",
        id: 'Priority',
        header: "",
        resetColumnFilters: false,
        isColumnVisible: true,
        fixedColumnWidth: true,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.PriorityRank == filterValue
        },
        resetSorting: false,
        size: 55,
      },
      {
        accessorFn: (row) => row?.SmartPriority,
        cell: ({ row }) => (
          <div className="text-center boldClable" title={row?.original?.showFormulaOnHover}>{row?.original?.SmartPriority}</div>
        ),
        id: "SmartPriority",
        placeholder: "SmartPriority",
        resetColumnFilters: false,
        isColumnVisible: true,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.SmartPriority == filterValue
        },
        header: "",
        size: 57,
        fixedColumnWidth: true
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
        fixedColumnWidth: true,
        resetSorting: false,
        isColumnVisible: true,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.DisplayDueDate?.includes(filterValue)
        },
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
        isColumnVisible: true,
        fixedColumnWidth: true,
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
        size: 110,
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.workingActionTitle,
        cell: ({ row }) => (
          <div className="alignCenter">
            {Array.isArray(row?.original?.workingActionValue) && row.original.workingActionValue.map((elem: any) => {
              const relevantTitles: any = ["Bottleneck", "Attention", "Phone", "Approval"];
              return relevantTitles.includes(elem?.Title) && elem?.InformationData?.length > 0 && (
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
        accessorFn: (row) => row?.SmartInformationTitle,
        cell: ({ row }) => (
          <span className='d-flex hreflink' >
            &nbsp; {row?.original?.SmartInformation?.length > 0 ? (
              <>
                <span onClick={() => openRemark(row?.original)} className="commentDetailFill-active svg__iconbox svg__icon--commentBlank"></span>
              </>
            ) : (
              <>
                <span onClick={() => openRemark(row?.original)} className="commentDetailFill svg__iconbox svg__icon--commentBlank"></span>
              </>
            )}
          </span>
        ),
        id: 'SmartInformation',
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "Remarks",
        header: '',
        size: 55,
        isColumnVisible: true
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
        isColumnVisible: true,
        fixedColumnWidth: true,
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
        accessorFn: (row) => row?.Modified,
        cell: ({ row }) => (
          <span className="d-flex">
            <span>{row?.original?.DisplayModifiedDate} </span>

            {row?.original?.modifiedImg != undefined ? (
              <>
                <a
                  href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Editor?.Id}&Name=${row?.original?.Editor?.Title}`}
                  target="_blank"
                  data-interception="off"
                >
                  <img title={row?.original?.Editor?.Title} className="workmember ms-1" src={row?.original?.modifiedImg} />
                </a>
              </>
            ) : (
              <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Editor?.Title}></span>
            )}
          </span>
        ),
        id: 'Modified',
        canSort: false,
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Modified",
        isColumnVisible: true,
        fixedColumnWidth: true,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayModifiedDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        header: "",
        size: 105
      },
      {
        accessorFn: (row) => row?.TotalTaskTime,
        cell: ({ row }) => (
          <span> {row?.original?.TotalTaskTime}</span>
        ),
        id: "TotalTaskTime",
        placeholder: "Smart Time",
        header: "",
        resetColumnFilters: false,
        size: 49,
        isColumnVisible: true,
        fixedColumnWidth: true,
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
          <div className="alignCenter">
            {row?.original?.TaskType != undefined &&
              (row?.original?.TaskType?.Title == "Activities" ||
                row?.original?.TaskType?.Title == "Workstream" ||
                row?.original?.TaskType?.Title == "Task") ? (
              <>
                {showTimeEntryIcon && <span
                  onClick={(e) => EditDataTimeEntry(e, row.original)}
                  className="ml-auto svg__iconbox svg__icon--clock"
                  title="Click To Edit Timesheet"
                ></span>}
                <span
                  title="Edit Task"
                  onClick={(e) => EditPopup(row?.original)}
                  className="ml-auto svg__iconbox svg__icon--edit hreflink"
                ></span>
              </>
            ) : (
              <span
                title="Edit Project"
                onClick={(e) => EditPopup(row?.original)}
                className="ml-auto svg__iconbox svg__icon--edit hreflink"
              ></span>
            )}
          </div>
        ),
        id: "EditPopup",
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 55,
      }
    ],
    [ProjectTableData]
  );

  const workingThisWeekColumns = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: false,
        hasCustomExpanded: hasCustomExpanded,
        hasExpanded: hasExpanded,
        isHeaderNotAvlable: isHeaderNotAvlable,
        size: 12,
        id: 'Id',
      },
      {
        accessorFn: (row) => row?.Site,
        cell: ({ row }) => (

          <span>
            {row?.original?.Item_x0020_Type == "Sprint" ?
              <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={"Dyicons me-1"}>
                X
              </div>
              : <img className='circularImage rounded-circle' src={row?.original?.SiteIcon} />}

          </span>
        ),
        id: "Site",
        placeholder: "Site",
        header: "",
        resetSorting: false,
        resetColumnFilters: false,
        size: 50,
        isColumnVisible: true,
        fixedColumnWidth: true,
      },
      {
        accessorKey: "TaskID",
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel AllListId={AllListId} CMSToolId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MasterListData} AllSitesTaskData={AllSitesAllTasks} />
            </span>
          </>
        ),
        id: "TaskID",
        placeholder: "Task Id",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 125,
        isColumnVisible: true
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
            </span>
          </>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.workingTaskDate,
        cell: ({ row, column, getValue }) => (
          <span>
            {row?.original?.workingTaskDate}
          </span>
        ),
        id: "workingTaskDate",
        placeholder: "Working Date",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        isColumnVisible: true,
        size: 100,
      },
      {
        accessorFn: (row) => row?.PriorityRank,
        cell: ({ row }) => (
          <span>
            <InlineEditingcolumns
              AllListId={AllListId}
              type='Task'
              TaskUsers={AllUser}
              columnName='Priority'
              item={row?.original} />
          </span>
        ),
        placeholder: "Priority",
        id: 'Priority',
        header: "",
        resetColumnFilters: false,
        isColumnVisible: true,
        fixedColumnWidth: true,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.PriorityRank == filterValue
        },
        resetSorting: false,
        size: 55,
      },
      {
        accessorFn: (row) => row?.SmartPriority,
        cell: ({ row }) => (
          <div className="text-center boldClable" title={row?.original?.showFormulaOnHover}>{row?.original?.SmartPriority}</div>
        ),
        id: "SmartPriority",
        placeholder: "SmartPriority",
        resetColumnFilters: false,
        isColumnVisible: true,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.SmartPriority == filterValue
        },
        header: "",
        size: 57,
        fixedColumnWidth: true
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
        isColumnVisible: true,
        fixedColumnWidth: true,
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
        size: 110,
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.TotalTaskTime,
        cell: ({ row }) => (
          <span> {row?.original?.TotalTaskTime}</span>
        ),
        id: "TotalTaskTime",
        placeholder: "Smart Time",
        header: "",
        resetColumnFilters: false,
        size: 49,
        isColumnVisible: true,
        fixedColumnWidth: true,
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
          <div className="alignCenter ml-auto">
            {row?.original?.TaskType != undefined &&
              (row?.original?.TaskType?.Title == "Activities" ||
                row?.original?.TaskType?.Title == "Workstream" ||
                row?.original?.TaskType?.Title == "Task") ? (
              <>
                {showTimeEntryIcon && <span
                  onClick={(e) => EditDataTimeEntry(e, row.original)}
                  className="svg__iconbox svg__icon--clock"
                  title="Click To Edit Timesheet"
                ></span>}
                <span
                  title="Edit Task"
                  onClick={(e) => EditPopup(row?.original)}
                  className="svg__iconbox svg__icon--edit hreflink"
                ></span>
              </>
            ) : (
              <span
                title="Edit Project"
                onClick={(e) => EditPopup(row?.original)}
                className="svg__iconbox svg__icon--edit hreflink"
              ></span>
            )}
          </div>
        ),
        id: "EditPopup",
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 55,
      }
    ],
    [filteredTask]
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
          <>
            <span className="alignCentre">{row?.original?.TaskID}</span>
          </>
        ),
      },
      {
        accessorFn: (row) => row?.siteType,
        cell: ({ row, getValue }) => (
          <span>
            {row?.original?.SiteIcon != undefined ? (
              <img
                title={row?.original?.siteType}
                className="workmember"
                src={row?.original?.SiteIcon}
              />
            ) : (
              ""
            )}
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
          <div>
            <a
              className="hreflink"
              href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
              data-interception="off"
              target="_blank"
            >
              {row?.original?.Title}
            </a>
          </div>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
      },
      {
        accessorFn: (row) => row?.TimeDate,
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              {row?.original?.TimeDate}
              {row?.original?.TimeEntryAuthorImage ||
              row?.original.Suffix ? (
                <Avatar
                  className="UserImage"
                  title={row?.original?.TimeEntryAuthorName}
                  name={row?.original?.TimeEntryAuthorName}
                  image={{ src: row?.original?.TimeEntryAuthorImage }}
                  initials={
                    row?.original?.TimeEntryAuthorImage == undefined
                      ? row.original?.Suffix
                      : undefined
                  }
                />
              ) : (
                <Avatar
                  title={row?.original?.TimeEntryAuthorName}
                  name={row?.original?.TimeEntryAuthorName}
                  className="UserImage"
                />
              )}
            </span>
          </>
        ),
        id: "TimeDate",
        placeholder: "Entry Date",
        resetColumnFilters: false,
        resetSorting: false,
        size: 80,
        header: "",
      },
      {
        accessorFn: (row) => row?.TaskTime,
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">{row?.original?.TaskTime}</span>
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
        accessorFn: (row) => row?.TimeDescription,
        cell: ({ row, getValue }) => (
          <>
            <div
              className="column-description"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {row?.original?.TimeDescription}
            </div>
          </>
        ),
        id: "TimeDescription",
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
          if (
            row?.original?.PercentComplete?.toString().charAt(0) ==
              filterValue.toString().charAt(0) &&
            row?.original?.PercentComplete.toString()?.includes(filterValue)
          ) {
            return true;
          } else {
            return false;
          }
        },
        id: "PercentComplete",
        placeholder: "% Complete",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 55,
      },
      {
        cell: ({ row }) => (
          <>
            {showTimeEntryIcon && (
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
            )}
          </>
        ),
        id: "EditPopup",
        canSort: false,
        placeholder: "",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 65,
      },
    ],
    []
  );
  const filterPotfolioTasks = (portfolio: any, clickedIndex: any, type: any) => {
    let projectData = Masterdata;
    let displayTasks = AllTasks;
    backupTableData = ProjectTableData;
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
    // setProjectTableData(displayTasks);
    // backupTableData = displayTasks;
  };
  const AncCallback = (type: any) => {
    switch (type) {
      case 'anc': {
        relevantDocRef?.current?.loadAllSitesDocuments()
        break
      }
      case 'smartInfo': {
        smartInfoRef?.current?.GetResult();
        break
      }
      default: {
        relevantDocRef?.current?.loadAllSitesDocuments()
        smartInfoRef?.current?.GetResult();
        keyDocRef?.current?.loadAllSitesDocumentsEmail()
        break
      }
    }
  }

  const inlineCallBackMasterTask = React.useCallback((item: any) => {
    item.taggedPortfolios = Masterdata?.taggedPortfolios
    setMasterdata(item);
  }, []);
  const contextCall = React.useCallback((data: any, path: any, releventKey: any) => {
    if (data != null && path != null && path != "") {
      Setkeydoc(data)
      SetFileDirRef(path)
    }
    if (releventKey) {
      relevantDocRef?.current?.loadAllSitesDocuments()

    }
    else if (data == null && path == null && releventKey == false) {
      keyDocRef?.current?.loadAllSitesDocumentsEmail()
      relevantDocRef?.current?.loadAllSitesDocuments()
    }
  }, [])

  const searchSuggestedPortfolio2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let SearchedKeyWord: any = e.target.value;
    let TempArray: any = [];
    if (SearchedKeyWord.length > 0) {
      if (
        keyRelevantPortfolioItems != undefined &&
        keyRelevantPortfolioItems.length > 0
      ) {
        keyRelevantPortfolioItems.map((AllDataItem: any) => {
          if (
            AllDataItem.Path?.toLowerCase()?.includes(
              SearchedKeyWord.toLowerCase()
            )
          ) {
            TempArray.push(AllDataItem);
          }
        });
      }
      if (TempArray != undefined && TempArray.length > 0) {
        setSearchedkeyPortfolios(TempArray)
      }
    } else {
      setSearchedkeyPortfolios([]);
    }
  };

  const setTaggedPortfolioItem = (item: any) => {
    taggedPortfolioItem = item
    setTaggedPortfolio([item])
    setSearchedkeyPortfolios([]);
  }
  return (
    <myContextValue.Provider value={{ ...myContextValue, user: AllUser, ProjectLandingPageDetails: Masterdata, FunctionCall: contextCall, keyDoc: keydoc, FileDirRef: FileDirRef, closeCompTaskPopup: tagAndCreateCallBack, projectCallBackTask: LoadAllSiteTasks, portfolioCreationCallBack: ComponentServicePopupCallBack, tagProjectFromTable: true }}>

      <div>
        {QueryId != "" ? (
          <>
            <div className="row">
              <div
                className="d-flex justify-content-between p-0"
              >
                <ul className="spfxbreadcrumb mb-2 ms-2 mt-16 p-0">
                  <li>
                    <a data-interception="off" target="_blank" href={`${props?.siteUrl}/SitePages/PX-Overview.aspx`}>
                      PX Management Overview
                    </a>
                  </li>
                  {Masterdata?.Item_x0020_Type != "Project" && Masterdata?.Parent?.Title ?
                    <li>
                      {" "}
                      <a data-interception="off" target="_blank" href={`${props?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${Masterdata?.Parent?.Id}`}>{Masterdata?.Parent?.Title}</a>{" "}
                    </li> : ''}
                  <li>
                    {" "}
                    <a>{Masterdata?.Title}</a>{" "}
                  </li>
                </ul>
              </div>
            </div>
            <div className="ProjectManagementPage Dashboardsecrtion">
              <div className="dashboard-colm">
                <div className="dashboard-contentbox ps-2 full-width">
                  <article className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-9">
                          <section>
                            <div>
                              <div className="align-items-center d-flex justify-content-between">
                                <h2 className="heading alignCenter">
                                  <div
                                    title={Masterdata?.Item_x0020_Type}
                                    className={"Dyicons me-1"}
                                  >
                                    {Masterdata?.Item_x0020_Type !== "Sprint"
                                      ? `${Masterdata?.Item_x0020_Type?.charAt(
                                        0
                                      )}`
                                      : "X"}
                                  </div>

                                  {`${Masterdata?.PortfolioStructureID} - ${Masterdata?.Title}`}
                                  <span
                                    onClick={() => EditComponentPopup(Masterdata)}
                                    className="mx-1 svg__iconbox svg__icon--edit hreflink" style={{ width: '24px', height: '24px' }}
                                    title="Edit Project"
                                  ></span>

                                </h2>
                                <div>
                                  <div className="d-flex">

                                    {projectId && (
                                      <TagTaskToProjectPopup
                                        projectItem={Masterdata}
                                        masterTaskData={MasterListData}
                                        className="ms-2"
                                        projectId={projectId}
                                        AllListId={AllListId}
                                        callBack={tagAndCreateCallBack}
                                        projectTitle={projectTitle}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                          <section>
                            <div className="row">
                              <div className="col-md-12 bg-white">
                                <div className="team_member row  py-2">
                                  <div className="col-md-6  pe-0">
                                    <dl>
                                      <dt className="bg-fxdark">Due Date</dt>
                                      <dd className="bg-light">
                                        <span>
                                          <InlineEditingcolumns
                                            AllListId={AllListId}
                                            callBack={inlineCallBackMasterTask}
                                            columnName='DueDate'
                                            item={Masterdata}
                                            TaskUsers={AllUser}
                                            pageName={'ProjectManagmentMaster'}
                                          />
                                        </span>
                                        {/* <span className="" >
                                          <span title="Edit Due Date" className="svg__iconbox svg__icon--editBox pull-right"></span>
                                        </span> */}
                                      </dd>
                                    </dl>
                                    <dl>
                                      <dt className="bg-fxdark">Priority</dt>
                                      <dd className="bg-light">
                                        <InlineEditingcolumns
                                          mypriority={true}
                                          AllListId={AllListId}
                                          callBack={inlineCallBackMasterTask}
                                          columnName='Priority'
                                          item={Masterdata}
                                          TaskUsers={AllUser}
                                          pageName={'ProjectManagmentMaster'}
                                        />
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
                                    <dl>
                                      <dt className="bg-fxdark">Key Portfolio Items</dt>
                                      <dd className="bg-light">
                                        {openServiceComponent ? <ServiceComponentPortfolioPopup
                                          props={{ Portfolios: Masterdata?.taggedPortfolios }}
                                          Portfolios={Masterdata.taggedPortfolios}
                                          Relevant={TaskTaggedPortfolios}
                                          Suggested={suggestedPortfolioItems}
                                          Dynamic={AllListId}
                                          ComponentType={portfolioType}
                                          Call={ComponentServicePopupCallBack}
                                          selectionType={"Multi"}
                                          groupedData={groupedComponentData}
                                          pageName={"projectManagement"}
                                        /> : null}
                                        {smartPortfoliosData?.map((component: any, index: any) => (`${component?.Title};`))}
                                        <a className="ml-auto pull-right" onClick={() => setopenServiceComponent(true)}>
                                          <span className="svg__iconbox svg__icon--editBox alignIcon"  ></span>
                                        </a>
                                      </dd>
                                    </dl>
                                  </div>
                                  <div className="col-md-6 p-0">
                                    <dl>
                                      <dt className="bg-fxdark">Project Team
                                        <a className="teamIcon hover-text m-0 ms-2" onClick={() => ShowTeamFunc()}>
                                          <span style={{ backgroundColor: "sky-blue" }} className="svg__iconbox svg__icon--team"></span>
                                          <span className='tooltip-text pop-right'>Create Teams Group</span>
                                        </a>
                                      </dt>
                                      <dd className="bg-light">
                                        <InlineEditingcolumns
                                          AllListId={AllListId}
                                          callBack={inlineCallBackMasterTask}
                                          columnName='Team'
                                          item={Masterdata}
                                          TaskUsers={AllUser}
                                          pageName={'ProjectManagmentMaster'}
                                        /></dd>
                                    </dl>
                                    <dl>
                                      <dt className="bg-fxdark">Status</dt>
                                      <dd className="bg-light">
                                        <InlineEditingcolumns
                                          AllListId={AllListId}
                                          callBack={inlineCallBackMasterTask}
                                          columnName='PercentComplete'
                                          item={Masterdata}
                                          TaskUsers={AllUser}
                                          pageName={'ProjectManagmentMaster'}
                                        />

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
                                      <dl>
                                        <dt className="bg-fxdark">Total PX Time</dt>
                                        <dd className="bg-light">
                                          {(totalTime != undefined && totalTime != 0) && <span title="Total Time">{`${totalTime} hrs;`}</span>}
                                          {(monthTotalTime != undefined && monthTotalTime != 0) && <span title="This Month Time">{`${monthTotalTime} hrs; `}</span>}
                                          {(weekTotalTime != undefined && weekTotalTime != 0)&& <span title="This Week Time">{`${weekTotalTime} hrs; `}</span>}
                                          <a className="smartTotalTime hover-text m-0 float-end" onClick={() => loadAllPXTimeEntries()}><BsClock/><span className='tooltip-text pop-left'>Load Time Entries</span></a>
                                        </dd>
                                      </dl>
                                    </div>
                                    {/* <div className="col-md-12 url"><div className="d-flex p-0"><div className="bg-fxdark p-2"><label>Url</label></div><div className="bg-light p-2 text-break full-width"><a target="_blank" data-interception="off" href={Masterdata?.ComponentLink?.Url != undefined ? Masterdata?.ComponentLink?.Url : ''}>  {Masterdata?.ComponentLink?.Url != undefined ? Masterdata?.ComponentLink?.Url : ''}</a></div></div></div> */}
                                    <div className="col-md-12 pe-1"><dl><dt className="bg-fxdark UrlLabel">Url</dt><dd className="bg-light UrlField" style={{ width: '93.9%' }}><a target="_blank" data-interception="off" href={Masterdata?.ComponentLink?.Url != undefined ? Masterdata?.ComponentLink?.Url : ''}>  {Masterdata?.ComponentLink?.Url != undefined ? Masterdata?.ComponentLink?.Url : ''}</a></dd></dl></div>
                                    {
                                      Masterdata?.Body != undefined ? <div className="col-md-12 detailsbox mt-2 pe-1">
                                        <details className="pe-0" open>
                                          <summary>Description</summary>
                                          <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Body }}></div>
                                        </details>
                                      </div>
                                        : ''
                                    }

                                  {
                                    Masterdata?.Background != undefined ? <div className="mt-2 col-md-12  detailsbox pe-1">
                                      <details className="pe-0">
                                        <summary>Background</summary>
                                        <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Background }}></div>
                                        {/* <div className="AccordionContent">{Masterdata?.Background}</div> */}
                                      </details>
                                    </div> : ''
                                  }

                                  {
                                    Masterdata?.Idea != undefined ? <div className="mt-2 col-md-12  detailsbox pe-1">
                                      <details className="pe-0">
                                        <summary>Idea</summary>
                                        <div className="AccordionContent p-2" dangerouslySetInnerHTML={{ __html: Masterdata?.Idea }}></div>
                                        {/* <div className="AccordionContent">{Masterdata?.Idea}</div> */}
                                      </details>
                                    </div> : ''
                                  }

                                  {
                                    Masterdata?.Deliverables != undefined ? <div className="mt-2 col-md-12 pe-1 detailsbox  41_
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
                              <div className='col-md-12 bg-white pe-1'>
                                {keyTaggedDoc.length > 0 && (
                                  <KeyDocuments
                                    keyTaggedDocs={keyTaggedDoc}
                                    pageName={keydoc.length == 0 ? "ProjectManagement" : ""}
                                    ref={relevantDocRef}
                                    AllListId={AllListId}
                                    Context={props?.Context}
                                    siteUrl={AllListId?.siteUrl}
                                    DocumentsListID={
                                      AllListId.DocumentsListID
                                    }
                                    siteName={"Master Tasks"}
                                    folderName={Masterdata?.Title}
                                    keyDoc={true}
                                  ></KeyDocuments>
                                )}
                                <div className='col-md-12 bg-white  pe-1'>
                                  <details>
                                    <summary> Working This Week {'(' + filteredTask?.length + ')'} </summary>
                                    <div className='AccordionContent'  >
                                      {filteredTask?.length > 0 ?
                                        <div className='Alltable border-0 dashboardTable' >
                                          <>
                                            <GlobalCommanTable columns={workingThisWeekColumns} data={filteredTask} wrapperHeight="175px" callBackData={callBackData} />
                                          </>
                                        </div> : <div className='text-center full-width'>
                                          <span>No Working Tasks Available</span>
                                        </div>}
                                    </div>
                                </details>
                                <details open={timeEntries.length > 0}>
                                    <summary> Time Entries </summary>
                                    <div className='AccordionContent'  >
                                        {timeEntries?.length > 0 ?
                                            <div className='Alltable border-0 dashboardTable' >
                                                <>
                                                    <GlobalCommanTable columns={columnTimeReport} data={timeEntries} wrapperHeight="175px" callBackData={callBackData}/>
                                                </>
                                            </div> : <div className='text-center full-width'>
                                                <span>No Time Entries Available</span>
                                            </div>}
                                    </div>
                                </details>
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
                          <div>
                            <div>
                              <span>
                                {Masterdata?.TeamsGroup && (
                                  <MSTeamsChat
                                    AllListId={AllListId}
                                    Context={props.Context}
                                    siteUrl={props.siteUrl}
                                    listName={"Master Tasks"}
                                    itemID={QueryId}
                                    Groupusers={Groupusers}
                                    TaskUsers={AllUser}
                                    Currentuser={CurrentUserData}
                                    ExistingGroup={Masterdata?.TeamsGroup}
                                  />
                                )}
                              </span>
                            </div>
                          </div>
                          <div>
                            {Masterdata?.Id != undefined && <AncTool item={Masterdata} callBack={AncCallback} AllListId={AllListId} Context={props.Context} listName={"Master Tasks"} />}
                          </div>
                          <div>{Masterdata?.Id && <SmartInformation ref={smartInfoRef} Id={Masterdata?.Id} AllListId={AllListId} Context={props?.Context} taskTitle={Masterdata?.Title} listName={"Master Tasks"} />}</div>
                          <div> {Masterdata?.Id != undefined && <RelevantDocuments ref={relevantDocRef} AllListId={AllListId} Context={props?.Context} siteUrl={AllListId?.siteUrl} DocumentsListID={AllListId.DocumentsListID} ID={Masterdata?.Id} siteName={"Master Tasks"} folderName={Masterdata?.Title} Keydoc={true}></RelevantDocuments>}</div>
                          <div> {Masterdata?.Id != undefined && <RelevantEmail ref={keyDocRef} AllListId={AllListId} Context={props?.Context} siteUrl={AllListId?.siteUrl} DocumentsListID={AllListId?.DocumentsListID} ID={Masterdata?.Id} siteName={"Master Tasks"} folderName={Masterdata?.Title} ></RelevantEmail>}</div>
                        </div>
                      </div>

                      <div>
                        <div className="TableSection">
                          <div className="Alltable">
                            <div className="section-event ps-0">
                              <div className="wrapper project-management-Table">
                                {(ProjectTableData?.length == 0 || ProjectTableData?.length > 0) && <GlobalCommanTable AllListId={AllListId} headerOptions={headerOptions} updatedSmartFilterFlatView={false}
                                  projectmngmnt={"projectmngmnt"}
                                  portfolioTypeData={portfolioTypeDataItem}
                                  showingAllPortFolioCount={true}
                                  taskTypeDataItem={taskTypeDataItem}
                                  masterTaskData={MasterListData}
                                  PortfolioFeature={Masterdata?.Item_x0020_Type == "Sprint" ? 'Feature' : ''}
                                  AllSitesTaskData={AllSitesAllTasks}
                                  MasterdataItem={Masterdata}
                                  columns={column2} data={ProjectTableData} callBackData={callBackData}
                                  smartTimeTotalFunction={smartTimeTotal} SmartTimeIconShow={true}
                                  TaskUsers={AllUser} showHeader={true} expendedTrue={false}
                                  showCreationAllButton={true}
                                  flatViewDataAll={flatViewDataAll}
                                  clickFlatView={clickFlatView} switchFlatViewData={switchFlatViewData}
                                  flatView={true}
                                  customHeaderButtonAvailable={true}
                                  bulkEditIcon={true} setData={setProjectTableData} setLoaded={setPageLoader}
                                  customTableHeaderButtons={customTableHeaderButtons}
                                  showRestructureButton={true}
                                  columnSettingIcon={true}
                                  tableId="pxlandingpage"
                                  switchGroupbyData={switchGroupbyData}
                                  restructureCallBack={callBackData1}
                                  ref={childRef} callChildFunction={callChildFunction}
                                  OpenAddStructureModal={OpenAddStructureModal}
                                  addActivity={addActivity} />}
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
                        <EditProjectPopup AllListId={AllListId} props={CMSComponent} Call={Call} showProgressBar={showProgressBar}  > {" "} </EditProjectPopup>) : ("")}
                    </div>
                  </article>
                </div>

              </div>
            </div>
            {IsPortfolio && (
              <ServiceComponentPortfolioPopup
                props={CMSComponent}
                Dynamic={AllListId}
                ComponentType={portfolioType}
                Call={ComponentServicePopupCallBack}
                selectionType={"Multi"}
                groupedData={groupedComponentData}
              ></ServiceComponentPortfolioPopup>
            )}
            {keyRelevantPortfolios && (
              <ServiceComponentPortfolioPopup
                props={tagPortfolio}
                Dynamic={AllListId}
                ComponentType={"Component"}
                Call={keyRelevantPortfolioPopupCallback}
                selectionType={"Single"}
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
            {Masterdata?.Id && isAddStructureOpen && <AddProject CallBack={CallBack} items={[Masterdata]} AllListId={AllListId} />}
            {IsTaggedCompTask && (
              <TaggedComponentTask projectItem={Masterdata} SelectedItem={SelectedItem} createComponent={createTaskId} SelectedProp={props?.props} AllSitesTaskData={AllSitesAllTasks} context={props?.props?.Context} MasterListData={MasterListData} AllListId={AllListId} AllUser={AllUser} callBack={tagAndCreateCallBack}
              />
            )}
            {pageLoaderActive ? <PageLoader /> : ''}
            <Panel
              onRenderHeader={onRenderCustomHeaderMain}
              type={PanelType.custom}
              customWidth="620px"
              isOpen={ActivityPopup}
              onDismiss={closeActivity}
              isBlocking={false}
            >
              <div className="modal-body clearfix">
                <div
                  className={"app component clearfix"}
                >
                  <div id="portfolio" className="section-event pt-0">
                    {checkedList != undefined &&
                      checkedList?.TaskType?.Title == "Workstream" ? (
                      <div className="mt-4 clearfix">
                        <h4 className="titleBorder "> Type</h4>
                        <div className="col p-0 taskcatgoryPannel">
                          <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Bug")} className={activeTile == "Bug" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                            <span className="tasks-label">Bug</span>
                          </a>
                          <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Feedback")} className={activeTile == "Feedback" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                            <span className="tasks-label">Feedback</span>
                          </a>
                          <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Improvement")} className={activeTile == "Improvement" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                            <span className="tasks-label">Improvement</span>
                          </a>
                          <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Design")} className={activeTile == "Design" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                            <span className="tasks-label">Design</span>
                          </a>
                          <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Task")} className={activeTile == "Task" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                            <span className="tasks-label">Task</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4 clearfix">
                          <h4 className="titleBorder "> Type</h4>
                          <div className="col p-0 taskcatgoryPannel">
                            <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Activities")} className={activeTile == "Activities" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                              <span className="tasks-label">Activity</span>
                            </a>
                            <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Task")} className={activeTile == "Task" ? "active bg-siteColor subcategoryTask text-center" : "bg-siteColor subcategoryTask text-center"}>
                              <span className="tasks-label">Task</span>
                            </a>
                          </div>

                        </div>
                        <div className="clearfix col-12 mt-3 position-relative">
                          <h4 className="titleBorder">Key/Relevant Portfolios</h4>
                          <div className="clearfix col-12">
                            {taggedPortfolio.length > 0 ? (
                              <span className="full-width">
                                {taggedPortfolio?.map((com: any) => {
                                  return (
                                    <>
                                      <div
                                        className="full-width replaceInput pe-0 alignCenter"
                                        style={{ width: "90%" }}
                                      >
                                        <a
                                          title={com?.Title}
                                          target="_blank"
                                          data-interception="off"
                                          className="textDotted"
                                          href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com?.Id}`}
                                        >
                                          {com?.Title}
                                        </a>
                                        <span
                                          title="Remove Component"
                                          onClick={() => setTaggedPortfolio([])}
                                          style={{ backgroundColor: "black" }}
                                          className="svg__iconbox svg__icon--cross hreflink mx-2"
                                        ></span>
                                      </div>
                                    </>
                                  );
                                })}
                              </span>
                            ) : (
                              <input
                                type="text"
                                className="form-control"
                                onChange={(e) => searchSuggestedPortfolio2(e)}
                                placeholder="Search Portfolio Item"
                              />
                            )}
                            <span className="input-group-text">
                              <span
                                onClick={() =>
                                  EditKeyRelevantPortfolio(checkedList)
                                }
                                title="Edit Portfolios"
                                className="hreflink svg__iconbox svg__icon--editBox mt-15"
                              ></span>
                            </span>
                          </div>
                          {searchedKeyPortfolios?.length > 0 ? (
                            <div className="SmartTableOnTaskPopup p-0 position-static">
                              <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                {searchedKeyPortfolios.map((Item: any) => {
                                  return (
                                    <li
                                      className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                      key={Item.id}
                                      onClick={() =>
                                        setTaggedPortfolioItem(Item)
                                      }
                                    >
                                      <a>{Item.Path}</a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <footer className="pull-right mt-3">
                <button
                  type="button"
                  className="btn btn-primary mx-2"
                  onClick={() => Createbutton()}
                  disabled={activeTile === "" || taggedPortfolio.length == 0}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-default ms-1 pull-right"
                  onClick={closeActivity}
                >
                  Cancel
                </button>
              </footer>
            </Panel>
            {isOpenActivity && (
              <CreateActivity
                Call={Call}
                AllListId={AllListId}
                TaskUsers={AllUser}
                UsedFrom={"ProjectManagement"}
                context={AllListId.Context}
                LoadAllSiteTasks={LoadAllSiteTasks}
                selectedItem={
                  checkedList != null && checkedList.Id != null
                    ? checkedList
                    : selectedItem
                      ? selectedItem
                      : Masterdata
                }
                taggedPortfolioItem={taggedPortfolioItem}
              ></CreateActivity>
            )}
            {isOpenWorkstream && (
              <CreateWS
                selectedItem={checkedList}
                Call={Call}
                context={AllListId.Context}
                AllListId={AllListId}
                UsedFrom={"ProjectManagement"}
                TaskUsers={AllUser}
                data={ProjectTableData}
              ></CreateWS>
            )}
          </>
        ) : (
          <div>Project not found</div>
        )}
      </div>
      {openTimeEntryPopup && (
        <TimeEntryPopup
          props={taskTimeDetails}
          CallBackTimeEntry={TimeEntryCallBack}
          Context={props?.props?.Context}
        />
      )}
    </myContextValue.Provider>
  );
};
export default ProjectManagementMain;
export { myContextValue }
