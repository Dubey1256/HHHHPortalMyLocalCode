import * as React from "react";
import * as $ from "jquery";
import * as Moment from "moment";
import { Panel, PanelType } from "office-ui-fabric-react";
import { FaCompressArrowsAlt } from "react-icons/fa";
import pnp, { Web, sp } from "sp-pnp-js";
import { map } from "jquery";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import { PortfolioStructureCreationCard } from "../../../globalComponents/tableControls/PortfolioStructureCreation";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "../../../globalComponents/Tooltip";
import { ColumnDef } from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import Loader from "react-loader";

import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import GlobalCommanTable, {
  IndeterminateCheckbox
} from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import PageLoader from "../../../globalComponents/pageLoader";
import CreateActivity from "../../servicePortfolio/components/CreateActivity";
import CreateWS from '../../servicePortfolio/components/CreateWS';
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
//import RestructuringCom from "../../../globalComponents/Restructuring/RestructuringCom";

var filt: any = "";
var ContextValue: any = {};
let globalFilterHighlited: any;
let AllSiteTasksData: any = [];
let isUpdated: any = "";
let componentData: any = [];
let childRefdata: any;
let timeSheetConfig: any = {}
let portfolioColor: any = "";
let ProjectData: any = [];
let copyDtaArray: any = [];
let renderData: any = [];
let countAllTasksData: any = [];
let countAllComposubData: any = [];
let countsrun = 0;
let TimesheetData: any = [];
let count = 1;
let flatviewmastertask:any =[];
let flatviewTasklist:any =[];
let hasExpanded: any = true;
let isColumnDefultSortingAsc: any = false;
let hasCustomExpanded: any = true;
let isHeaderNotAvlable: any = false

let allgroupdata:any = [];
function PortfolioTable(SelectedProp: any) {
  const childRef = React.useRef<any>();
  if (childRef != null) {
    childRefdata = { ...childRef };
  }
  try {
    if (SelectedProp?.NextProp != undefined) {
      SelectedProp.NextProp.isShowTimeEntry = JSON.parse(
        SelectedProp?.NextProp?.TimeEntry
      );

      SelectedProp.NextProp.isShowSiteCompostion = JSON.parse(
        SelectedProp?.NextProp?.SiteCompostion
      );
    }
  } catch (e) {
    console.log(e);
  }
  ContextValue = SelectedProp?.NextProp;

  const refreshData = () => setData(() => renderData);
  const [loaded, setLoaded] = React.useState(false);
  const [siteConfig, setSiteConfig] = React.useState([]);
  const [data, setData] = React.useState([]);
  copyDtaArray = data;
  const [AllUsers, setTaskUser] = React.useState([]);
  const [AllMetadata, setMetadata] = React.useState([]);
  const [AllClientCategory, setAllClientCategory] = React.useState([]);
  const [IsUpdated, setIsUpdated] = React.useState("");
  const [checkedList, setCheckedList] = React.useState<any>({});
  // const [AllSiteTasksData, setAllSiteTasksData] = React.useState([]);
  const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
  const [portfolioTypeData, setPortfolioTypeData] = React.useState([]);
  const [taskTypeData, setTaskTypeData] = React.useState([]);
  const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
  const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
  const [OpenAddStructurePopup, setOpenAddStructurePopup] =
    React.useState(false);
  const [ActivityPopup, setActivityPopup] = React.useState(false);
  const [isOpenActivity, setIsOpenActivity] = React.useState(false);
  const [isOpenWorkstream, setIsOpenWorkstream] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState("");
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [checkedList1, setCheckedList1] = React.useState([]);
  const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] =
    React.useState<any>([
      { Title: "Component", Suffix: "C", Level: 1 },
      { Title: "SubComponent", Suffix: "S", Level: 2 },
      { Title: "Feature", Suffix: "F", Level: 3 }
    ]);
    const [clickFlatView, setclickFlatView] = React.useState(false);
    const [groupByButtonClickData, setGroupByButtonClickData] = React.useState([]);
  let ComponetsData: any = {};
  let Response: any = [];
  let props = undefined;
  let AllTasks: any = [];
  let AllComponetsData: any = [];

  let TaskUsers: any = [];
  let TasksItem: any = [];


  // Load all time entry for smart time 


  function removeHtmlAndNewline(text:any) {
    if (text) {
        return text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
    } else {
        return ''; // or any other default value you prefer
    }
}

  // load all time entry end  

  const getTaskUsers = async () => {
    let web = new Web(ContextValue.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      .getById(ContextValue.TaskUsertListID)
      .items.select(
        "Id",
        "Email",
        "Suffix",
        "Title",
        "Item_x0020_Cover",
        "AssingedToUser/Title",
        "AssingedToUser/Id",
        "AssingedToUser/Name",
        "UserGroup/Id",
        "ItemType"
      )
      .expand("AssingedToUser", "UserGroup")
      .get();
    Response = taskUsers;
    TaskUsers = Response;
    setTaskUser(Response);
    console.log(Response);
  };

  const getPortFolioType = async () => {
    let web = new Web(ContextValue.siteUrl);
    let PortFolioType = [];
    PortFolioType = await web.lists
      .getById(ContextValue.PortFolioTypeID)
      .items.select("Id", "Title", "Color", "IdRange")
      .get();
    setPortfolioTypeData(PortFolioType);
  };
  const getTaskType = async () => {
    let web = new Web(ContextValue.siteUrl);
    let taskTypeData = [];
    let typeData: any = [];
    taskTypeData = await web.lists
      .getById(ContextValue.TaskTypeID)
      .items.select("Id", "Level", "Title", "SortOrder")
      .get();
    setTaskTypeData(taskTypeData);
    if (taskTypeData?.length > 0 && taskTypeData != undefined) {
      taskTypeData?.forEach((obj: any) => {
        if (obj != undefined) {
          let Item: any = {};
          Item.Title = obj.Title;
          Item.SortOrder = obj.SortOrder;
          Item[obj.Title + "number"] = 0;
          Item[obj.Title + "filterNumber"] = 0;
          Item[obj.Title + "numberCopy"] = 0;
          typeData.push(Item);
        }
      });
      console.log("Task Type retrieved:", typeData);
      typeData = typeData.sort(
        (elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder
      );
      setTaskTypeDataItem(typeData);
    }
  };

  const GetSmartmetadata = async () => {
    let siteConfigSites: any = [];
    let web = new Web(ContextValue.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      .getById(ContextValue.SmartMetadataListID)
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
      .top(4999)
      .expand("Parent")
      .get();
    setAllClientCategory(
      smartmetaDetails?.filter(
        (metadata: any) => metadata?.TaxType == "Client Category"
      )
    );
    smartmetaDetails?.map((newtest: any) => {
      if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Offshore Tasks" || newtest.Title == "DE" || newtest.Title == "Gender" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
      newtest.DataLoadNew = false;
      else if (newtest.TaxType == "Sites") siteConfigSites.push(newtest);
      if (newtest?.TaxType == 'timesheetListConfigrations') {
        timeSheetConfig = newtest;
      }
    });
    if (siteConfigSites?.length > 0) {
      setSiteConfig(siteConfigSites);
    }
    setMetadata(smartmetaDetails);
  };

  const findPortFolioIconsAndPortfolio = async () => {
    try {
      let newarray: any = [];
      const ItemTypeColumn = "Item Type";
      console.log("Fetching portfolio icons...");
      const field = await new Web(ContextValue.siteUrl).lists
        .getById(ContextValue?.MasterTaskListID)
        .fields.getByTitle(ItemTypeColumn)
        .get();
      console.log("Data fetched successfully:", field?.Choices);

      if (field?.Choices?.length > 0 && field?.Choices != undefined) {
        field?.Choices?.forEach((obj: any) => {
          if (obj != undefined) {
            let Item: any = {};
            Item.Title = obj;
            Item[obj + "number"] = 0;
            Item[obj + "filterNumber"] = 0;
            Item[obj + "numberCopy"] = 0;
            newarray.push(Item);
          }
        });
        if (newarray.length > 0) {
          newarray = newarray.filter((findShowPort: any) => {
            let match = portfolioTypeConfrigration.find(
              (config: any) => findShowPort.Title === config.Title
            );
            if (match) {
              findShowPort.Level = match?.Level;
              findShowPort.Suffix = match?.Suffix;
              return true;
            }
            return false;
          });
        }
        console.log("Portfolio icons retrieved:", newarray);
        setPortFolioTypeIcon(newarray);
      }
    } catch (error) {
      console.error("Error fetching portfolio icons:", error);
    }
  };

  const LoadAllSiteTasks = async function () {
    let AllTasksData: any = [];
    let Counter = 0;
    if (siteConfig != undefined && siteConfig.length > 0) {
      const batch = sp.createBatch();
      for (let i = 0; i < siteConfig.length; i++) {
        const config = siteConfig[i];
        const web = new Web(ContextValue.siteUrl);
        const list = web.lists.getById(config.listId);
        list.items
          .inBatch(batch)
          .select(
            "ParentTask/Title",
            "ParentTask/Id",
            "ItemRank",
            "TaskLevel",
            "OffshoreComments",
            "TeamMembers/Id",
            "ClientCategory/Id",
            "ClientCategory/Title",
            "TaskID",
            "Created",
            "ResponsibleTeam/Id",
            "ResponsibleTeam/Title",
            "ParentTask/TaskID",
            "TaskType/Level",
            "PriorityRank",
            "TeamMembers/Title",
            "FeedBack",
            "Title",
            "Id",
            "ID",
            "ClientTime",
            "DueDate",
            "Comments",
            "Categories",
            "Status",
            "Body",
            "SiteCompositionSettings",
            "PercentComplete",
            "ClientCategory",
            "Priority",
            "TaskType/Id",
            "TaskType/Title",
            "Portfolio/Id",
            "Portfolio/ItemType",
            "Portfolio/PortfolioStructureID",
            "Portfolio/Title",
            "TaskCategories/Id",
            "TaskCategories/Title",
            "TeamMembers/Name",
            "Author/Id",
            "Author/Title",
            "Project/Id",
            "Project/PortfolioStructureID",
            "Project/DueDate",
            "Project/Title",
            "AssignedTo/Title",
            "AssignedTo/Id"
          )
          .expand(
            "AssignedTo",
            "ParentTask",
            "Portfolio",
            "Author",
            "TaskType",
            "ClientCategory",
            "TeamMembers",
            "ResponsibleTeam",
            "TaskCategories",
            "Project"
          )
          .filter("Status ne 'Completed'")
          .orderBy("orderby", false)
          .getAll(4000)

          .then((AllTasksMatches) => {
            console.log(AllTasksMatches);
            Counter++;
            console.log(AllTasksMatches.length);
            if (AllTasksMatches != undefined) {
              if (AllTasksMatches?.length > 0) {
                $.each(AllTasksMatches, function (index: any, item: any) {
                  item.isDrafted = false;
                  item.flag = true;
                  item.TitleNew = item.Title;
                  item.siteType = config.Title;
                  item.childs = [];
                  item.listId = config.listId;
                  item.siteUrl = ContextValue.siteUrl;
                  item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  item.fontColorTask = "#000";
                  // if (item.TaskCategories.results != undefined) {
                  //     if (item.TaskCategories.results.length > 0) {
                  //         $.each(
                  //             item.TaskCategories.results,
                  //             function (ind: any, value: any) {
                  //                 if (value.Title.toLowerCase() == "draft") {
                  //                     item.isDrafted = true;
                  //                 }
                  //             }
                  //         );
                  //     }
                  // }
                });
              }
              AllTasks = AllTasks.concat(AllTasksMatches);
              AllTasks = $.grep(AllTasks, function (type: any) {
                return type.isDrafted == false;
              });
              if (Counter == siteConfig.length) {
                map(AllTasks, (result: any) => {
                  result.Id = result.Id != undefined ? result.Id : result.ID;
                  result.TeamLeaderUser = [];
                  result.AllTeamName =
                    result.AllTeamName === undefined ? "" : result.AllTeamName;
                  result.chekbox = false;
                  result.descriptionsSearch = "";
                  result.commentsSearch = "";
                  result.TaskTypeTitle = result?.TaskType?.Title;
                  result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
                  result.DisplayDueDate = Moment(result.DueDate).format("DD/MM/YYYY");
                  if (result.DisplayDueDate == "Invalid date" || "") {
                    result.DisplayDueDate = result.DisplayDueDate.replaceAll(
                      "Invalid date",
                      ""
                    );
                  }
                  if (result.DisplayCreateDate == "Invalid date" || "") {
                    result.DisplayCreateDate = result.DisplayCreateDate.replaceAll(
                      "Invalid date",
                      ""
                    );
                  }
                  result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
                  result.PercentComplete = (
                    result.PercentComplete * 100
                  ).toFixed(0);
                  result.chekbox = false;
                  
                  if (result?.FeedBack != undefined) {
                    let feedbackdata = JSON.parse(result?.FeedBack)
                    feedbackdata[0]?.FeedBackDescriptions?.map(
                      (child: any) =>{
                       let  copyTitle=child?.Title?.replace( /(<([^>]+)>)/gi,"")?.replace(/\n/g, "");
                         if(copyTitle!=undefined && copyTitle!=null&& copyTitle!=""){
                          result.descriptionsSearch = copyTitle;
                         }
                       
                      }
                      )
                  }
                 
                  if (result?.Comments != null) {
                    result.commentsSearch = result?.Comments.replace(
                      /(<([^>]+)>)/gi,
                      ""
                    ).replace(/\n/g, "");
                  }
                  if (
                    result.AssignedTo != undefined &&
                    result.AssignedTo.length > 0
                  ) {
                    map(result.AssignedTo, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                          if (
                            Assig.Id != undefined &&
                            users.AssingedToUser != undefined &&
                            Assig.Id == users.AssingedToUser.Id
                          ) {
                            users.ItemCover = users.Item_x0020_Cover;
                            result.TeamLeaderUser.push(users);
                            result.AllTeamName += users.Title + ";";
                          }
                        });
                      }
                    });
                  }
                  if (
                    result.ResponsibleTeam != undefined &&
                    result.ResponsibleTeam.length > 0
                  ) {
                    map(result.ResponsibleTeam, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                          if (
                            Assig.Id != undefined &&
                            users.AssingedToUser != undefined &&
                            Assig.Id == users.AssingedToUser.Id
                          ) {
                            users.ItemCover = users.Item_x0020_Cover;
                            result.TeamLeaderUser.push(users);
                            result.AllTeamName += users.Title + ";";
                          }
                        });
                      }
                    });
                  }
                  if (
                    result.TeamMembers != undefined &&
                    result.TeamMembers.length > 0
                  ) {
                    map(result.TeamMembers, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                          if (
                            Assig.Id != undefined &&
                            users.AssingedToUser != undefined &&
                            Assig.Id == users.AssingedToUser.Id
                          ) {
                            users.ItemCover = users.Item_x0020_Cover;
                            result.TeamLeaderUser.push(users);
                            result.AllTeamName += users.Title + ";";
                          }
                        });
                      }
                    });
                  }
                  if (result?.ClientCategory?.length > 0) {
                    result.ClientCategorySearch = result?.ClientCategory?.map(
                      (elem: any) => elem.Title
                    ).join(" ");
                  } else {
                    result.ClientCategorySearch = "";
                  }
                  result["TaskID"] = globalCommon.GetTaskId(result);
                  if (result.Project) {
                    result.ProjectTitle = result?.Project?.Title;
                    result.ProjectId = result?.Project?.Id;
                    result.projectStructerId = result?.Project?.PortfolioStructureID
                    const title = result?.Project?.Title || '';
                    const formattedDueDate = Moment(result?.Project?.DueDate).format('YYYY-MM');
                    result.joinedData = [];
                    if (result?.projectStructerId && title || formattedDueDate) {
                        result.joinedData.push(`Project ${result?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                    }
                   
                }
                  result["Item_x0020_Type"] = "Task";
                  TasksItem.push(result);
                  AllTasksData.push(result);
                });
                flatviewTasklist = JSON.parse(JSON.stringify(AllTasksData))
                AllSiteTasksData = AllTasksData;
                // GetComponents();
                if (AllSiteTasksData?.length > 0) {
                  GetComponents();
                }
              }
            }
          });
      }
    }
  };
  const timeEntryIndex: any = {};
  const smartTimeTotal = async () => {
    count++;
    let AllTimeEntries = [];
    if (timeSheetConfig?.Id !== undefined) {
      AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfig);
    }
    AllTimeEntries?.forEach((entry: any) => {
      siteConfig.forEach((site) => {
        const taskTitle = `Task${site.Title}`;
        const key = taskTitle + entry[taskTitle]?.Id
        if (entry.hasOwnProperty(taskTitle) && entry.AdditionalTimeEntry !== null && entry.AdditionalTimeEntry !== undefined) {
          if (entry[taskTitle].Id === 168) {
            console.log(entry[taskTitle].Id);

          }
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
    AllSiteTasksData?.map((task: any) => {
      task.TotalTaskTime = 0;
      const key = `Task${task?.siteType + task.Id}`;
      if (timeEntryIndex.hasOwnProperty(key) && timeEntryIndex[key]?.Id === task.Id && timeEntryIndex[key]?.siteType === task.siteType) {
        task.TotalTaskTime = timeEntryIndex[key]?.TotalTaskTime;
      }
    })
    if (timeEntryIndex) {
      const dataString = JSON.stringify(timeEntryIndex);
      localStorage.setItem('timeEntryIndex', dataString);
    }
    console.log("timeEntryIndex", timeEntryIndex)
    if (AllSiteTasksData?.length > 0) {
      setData([]);
      portfolioTypeData.forEach((port, index) => {
        componentGrouping(port?.Id, index);
        countsrun++;
      });
    }
    return AllSiteTasksData;
  };

  const GetComponents = async () => {
    if (portfolioTypeData.length > 0) {
      portfolioTypeData?.map((elem: any) => {
        if (isUpdated === "") {
          filt = "";
        } else if (
          isUpdated === elem.Title ||
          isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()
        ) {
          filt =
            "(Item_x0020_Type eq 'SubComponent' and Item_x0020_Type eq 'Feature' )";
        }
      });
    }
    let web = new Web(ContextValue.siteUrl);
    let componentDetails = [];
    componentDetails = await web.lists
      .getById(ContextValue.MasterTaskListID)
      .items.select(
        "ID",
        "Id",
        "Title",
        "PortfolioLevel",
        "PortfolioStructureID",
        "Comments",
        "ItemRank",
        "Portfolio_x0020_Type",
        "Parent/Id",
        "Parent/Title",
        "DueDate",
        "Created",
        "Body",
        "Sitestagging",
        "Item_x0020_Type",
        "Categories",
        "Short_x0020_Description_x0020_On",
        "PriorityRank",
        "Priority",
        "AssignedTo/Title",
        "TeamMembers/Id",
        "TeamMembers/Title",
        "ClientCategory/Id",
        "ClientCategory/Title",
        "PercentComplete",
        "ResponsibleTeam/Id",
        "Author/Id",
        "Author/Title",
        "Sitestagging",
        "ResponsibleTeam/Title",
        "PortfolioType/Id",
        "PortfolioType/Color",
        "PortfolioType/IdRange",
        "PortfolioType/Title",
        "AssignedTo/Id"
      )
      .expand(
        "Parent",
        "PortfolioType",
        "AssignedTo",
        "Author",
        "ClientCategory",
        "TeamMembers",
        "ResponsibleTeam"
      )
      .top(4999)
      .get();

    console.log(componentDetails);
    ProjectData = componentDetails.filter(
      (projectItem: any) => projectItem.Item_x0020_Type === "Project"
    );
    componentDetails.forEach((result: any) => {
      result["siteType"] = "Master Tasks";
      result.AllTeamName = "";
      result.descriptionsSearch = "";
      result.commentsSearch = "";
      result.TeamLeaderUser = [];
      if (result.Item_x0020_Type === "Component") {
        result.boldRow = "boldClable";
        result.lableColor = "f-bg";
      }
      if (result.Item_x0020_Type === "SubComponent") {
        result.lableColor = "a-bg";
      }
      if (result.Item_x0020_Type === "Feature") {
        result.lableColor = "w-bg";
      }
      if (result?.Item_x0020_Type != undefined) {
        result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
      }
      result["TaskID"] = result?.PortfolioStructureID;

      result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      result.DisplayDueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      if (result.DisplayDueDate == "Invalid date" || "") {
        result.DisplayDueDate = result.DisplayDueDate.replaceAll(
          "Invalid date",
          ""
        );
      }
      if (result.DisplayCreateDate == "Invalid date" || "") {
        result.DisplayCreateDate = result.DisplayCreateDate.replaceAll(
          "Invalid date",
          ""
        );
      }
      result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");

      result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
      if (result?.Deliverables != undefined || result.Short_x0020_Description_x0020_On != undefined || result.TechnicalExplanations != undefined || result.Body != undefined || result.AdminNotes != undefined || result.ValueAdded != undefined
        || result.Idea != undefined || result.Background != undefined) {
        result.descriptionsSearch = `${removeHtmlAndNewline(result.Deliverables)} ${removeHtmlAndNewline(result.Short_x0020_Description_x0020_On)} ${removeHtmlAndNewline(result.TechnicalExplanations)} ${removeHtmlAndNewline(result.Body)} ${removeHtmlAndNewline(result.AdminNotes)} ${removeHtmlAndNewline(result.ValueAdded)} ${removeHtmlAndNewline(result.Idea)} ${removeHtmlAndNewline(result.Background)}`;
    }
      if (result?.Comments != null) {
        result.commentsSearch = result?.Comments.replace(
          /(<([^>]+)>)/gi,
          ""
        ).replace(/\n/g, "");
      }

      result.Id = result.Id != undefined ? result.Id : result.ID;
      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
        map(result.AssignedTo, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.ResponsibleTeam != undefined &&
        result.ResponsibleTeam.length > 0
      ) {
        map(result.ResponsibleTeam, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (result.TeamMembers != undefined && result.TeamMembers.length > 0) {
        map(result.TeamMembers, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }

      if (result?.ClientCategory?.length > 0) {
        result.ClientCategorySearch = result?.ClientCategory?.map(
          (elem: any) => elem.Title
        ).join(" ");
      } else {
        result.ClientCategorySearch = "";
      }
    });
    flatviewmastertask = JSON.parse(JSON.stringify(componentDetails));
    setAllMasterTasks(componentDetails);
    AllComponetsData = componentDetails;
    ComponetsData["allComponets"] = componentDetails;
    // AllSiteTasksData?.length > 0 &&
    if (AllSiteTasksData?.length > 0 && AllComponetsData?.length > 0) {
      portfolioTypeData.forEach((port, index) => {
        componentGrouping(port?.Id, index);
        countsrun++;
      });
    }
    if (portfolioTypeData?.length === countsrun) {
      executeOnce();
    }
  };


  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let query = params.get("PortfolioType");
    if (query) {
      setIsUpdated(query);
      isUpdated = query;
    }
  }, []);

  React.useEffect(() => {
    portfolioColor = SelectedProp?.props?.PortfolioType?.Color;
  }, [AllSiteTasksData]);

  React.useEffect(() => {
    getTaskType();
    findPortFolioIconsAndPortfolio();
    GetSmartmetadata();
    getTaskUsers();
    getPortFolioType();
  }, []);
// Flatview 



const switchFlatViewData = (data: any) => {
  let groupedDataItems = JSON.parse(JSON.stringify(data));
  const flattenedData = flattenData(groupedDataItems);
  hasCustomExpanded = false
  hasExpanded = false
  isHeaderNotAvlable = true
  isColumnDefultSortingAsc = true
  setGroupByButtonClickData(data);
  setclickFlatView(true);
  setData(flattenedData);
  // setData(smartAllFilterData);
}

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
  count=1;
  isColumnDefultSortingAsc = false
  hasCustomExpanded = true
  hasExpanded = true
  isHeaderNotAvlable = false
  setclickFlatView(false);
  setData(groupByButtonClickData);
}




// Flatview End




  React.useEffect(() => {
    if (AllMetadata.length > 0 && portfolioTypeData.length > 0) {
      LoadAllSiteTasks();
    }
  }, [AllMetadata.length > 0 && portfolioTypeData.length > 0]);

  const DynamicSort = function (items: any, column: any, orderby: any) {
    items?.sort(function (a: any, b: any) {
      var aID = a[column];
      var bID = b[column];
      if (orderby === "asc") return aID == bID ? 0 : aID < bID ? 1 : -1;
      // else return aID == bID ? 0 : aID > bID ? 1 : -1;
    });
  };
  const componentGrouping = (portId: any, index: any) => {
    let FinalComponent: any = [];

    let AllProtFolioData = AllComponetsData?.filter(
      (comp: any) =>
        comp?.PortfolioType?.Id === portId && comp.TaskType === undefined
    );

    // let AllComponents = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === 0 || comp?.Parent?.Id === undefined && comp?.Id === 321 );

    let subComFeat = AllProtFolioData?.filter(
      (comp: any) => comp?.Parent?.Id === SelectedProp?.props?.Id
    );
    countAllComposubData = countAllComposubData.concat(subComFeat);
    subComFeat?.map((masterTask: any) => {
      masterTask.subRows = [];
      taskTypeData?.map((levelType: any) => {
        if (levelType.Level === 1) componentActivity(levelType, masterTask);
      });

      let allFeattData = AllComponetsData?.filter(
        (elem: any) => elem?.Parent?.Id === masterTask?.Id
      );
      countAllComposubData = countAllComposubData.concat(allFeattData);
      masterTask.subRows = masterTask?.subRows?.concat(allFeattData);
      allFeattData?.forEach((subFeat: any) => {
        subFeat.subRows = [];
        taskTypeData?.map((levelType: any) => {
          if (levelType.Level === 1) componentActivity(levelType, subFeat);
        });
      });

      FinalComponent.push(masterTask);
    });

    componentData = componentData?.concat(FinalComponent);
    DynamicSort(componentData, "PortfolioLevel", "");
    componentData.forEach((element: any) => {
      if (element?.subRows?.length > 0) {
        let level = element?.subRows?.filter(
          (obj: any) =>
            obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task"
        );
        let leveltask = element?.subRows?.filter(
          (obj: any) => obj.Item_x0020_Type === "Task"
        );
        DynamicSort(level, "Item_x0020_Type", "asc");
        element.subRows = [];
        element.subRows = level.concat(leveltask);
      }
      if (element?.subRows != undefined) {
        element?.subRows?.forEach((obj: any) => {
          let level1 = obj?.subRows?.filter(
            (obj: any) =>
              obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task"
          );
          let leveltask1 = obj?.subRows?.filter(
            (obj: any) => obj.Item_x0020_Type === "Task"
          );
          DynamicSort(level1, "Item_x0020_Type", "asc");
          obj.subRows = [];
          obj.subRows = level1?.concat(leveltask1);
        });
      }
    });
    if ((portfolioTypeData?.length - 1 === index || index === "") && count === 1) {
      let Actatcomponent = AllSiteTasksData?.filter(
        (elem1: any) =>
          elem1?.TaskType?.Id === 1 &&
          elem1?.Portfolio?.Id === SelectedProp?.props?.Id
      );
      countAllTasksData = countAllTasksData.concat(Actatcomponent);
      Actatcomponent?.map((masterTask1: any) => {
        masterTask1.subRows = [];
        taskTypeData?.map((levelType: any) => {
          if (levelType.Level === 1) componentWsT(levelType, masterTask1);
        });
        componentData.push(masterTask1);
      });
      var temp: any = {};
      temp.Title = "Others";
      temp.TaskID = "";
      temp.subRows = [];
      temp.PercentComplete = "";
      temp.ItemRank = "";
      temp.DueDate = null;
      temp.Project = "";
      temp.ClientCategorySearch = "";
      temp.Created = null;
      temp.DisplayCreateDate = null;
      temp.DisplayDueDate = null;
      temp.AllTeamName = "";
      temp.DueDate = "";
      temp.descriptionsSearch = "";
      temp.ProjectTitle = "";
      temp.Status = "";
      temp.Author = "";
      temp.subRows = AllSiteTasksData?.filter(
        (elem1: any) =>
          elem1?.TaskType?.Id != undefined &&
          elem1?.TaskType?.Level != 1 &&
          elem1?.TaskType?.Level != 2 &&
          (elem1?.ParentTask === undefined ||
            elem1?.ParentTask?.TaskID === null) &&
          elem1?.Portfolio?.Id === SelectedProp?.props?.Id
      );
      countAllTasksData = countAllTasksData.concat(temp.subRows);
      temp.subRows.forEach((task: any) => {
        if (task.TaskID === undefined || task.TaskID === "")
          task.TaskID = "T" + task.Id;
      });
      if (temp?.subRows?.length > 0) {
        componentData.push(temp);
        allgroupdata = temp?.subRows;
        console.log("All group data "+ allgroupdata)
      }
    }

    setLoaded(true);
    setData(componentData);
    console.log(countAllTasksData);
  };

  // ComponentWS

  const componentWsT = (levelType: any, items: any) => {
    let findws = AllSiteTasksData.filter(
      (elem1: any) =>
        elem1?.ParentTask?.Id === items?.Id &&
        elem1?.siteType === items?.siteType
    );
    countAllTasksData = countAllTasksData.concat(findws);
    findws?.forEach((act: any) => {
      act.subRows = [];
      let allTasksData = AllSiteTasksData.filter(
        (elem1: any) =>
          elem1?.ParentTask?.Id === act?.Id && elem1?.siteType === act?.siteType
      );
      if (allTasksData.length > 0) {
        act.subRows = act?.subRows?.concat(allTasksData);
        countAllTasksData = countAllTasksData.concat(allTasksData);
      }
    });
    items.subRows = items?.subRows?.concat(findws);
  };
  // Componentwsend

  const componentActivity = (levelType: any, items: any) => {
    let findActivity = AllSiteTasksData?.filter(
      (elem: any) =>
        elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id
    );
    let findTasks = AllSiteTasksData?.filter(
      (elem1: any) =>
        elem1?.TaskType?.Id != levelType.Id &&
        (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined) &&
        elem1?.Portfolio?.Id === items?.Id
    );
    countAllTasksData = countAllTasksData.concat(findTasks);
    countAllTasksData = countAllTasksData.concat(findActivity);

    findActivity?.forEach((act: any) => {
      act.subRows = [];
      let worstreamAndTask = AllSiteTasksData?.filter(
        (taskData: any) =>
          taskData?.ParentTask?.Id === act?.Id &&
          taskData?.siteType === act?.siteType
      );
      if (worstreamAndTask.length > 0) {
        act.subRows = act?.subRows?.concat(worstreamAndTask);
        countAllTasksData = countAllTasksData.concat(worstreamAndTask);
      }
      worstreamAndTask?.forEach((wrkst: any) => {
        wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
        let allTasksData = AllSiteTasksData?.filter(
          (elem: any) =>
            elem?.ParentTask?.Id === wrkst?.Id &&
            elem?.siteType === wrkst?.siteType
        );
        if (allTasksData.length > 0) {
          wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
          countAllTasksData = countAllTasksData.concat(allTasksData);
        }
      });
    });
    items.subRows = items?.subRows?.concat(findActivity);
    items.subRows = items?.subRows?.concat(findTasks);
  };

  const countTaskAWTLevel = (countTaskAWTLevel: any) => {
    if (countTaskAWTLevel.length > 0) {
      countTaskAWTLevel.map((result: any) => {
        taskTypeDataItem?.map((type: any) => {
          if (result?.TaskType?.Title === type.Title) {
            type[type.Title + "number"] += 1;
            type[type.Title + "filterNumber"] += 1;
          }
        });
      });
    }
  };

  const countComponentLevel = (countTaskAWTLevel: any) => {
    if (countTaskAWTLevel?.length > 0) {
      portfolioTypeDataItem?.map((type: any) => {
        countTaskAWTLevel?.map((result: any) => {
          if (result?.Item_x0020_Type === type?.Title) {
            type[type.Title + "filterNumber"] += 1;
            type[type.Title + "number"] += 1;
          }
        });
      });
    }
  };

  function executeOnce() {
    if (countAllTasksData?.length > 0) {
      let countAllTasksData1 = countAllTasksData?.filter(
        (ele: any, ind: any, arr: any) => {
          const isDuplicate =
            arr.findIndex((elem: any) => {
              return (
                (elem.ID === ele.ID || elem.Id === ele.Id) &&
                elem.siteType === ele.siteType
              );
            }) !== ind;
          return !isDuplicate;
        }
      );
      countTaskAWTLevel(countAllTasksData1);
    }

    if (countAllComposubData?.length > 0) {
      let countAllTasksData11 = countAllComposubData?.filter(
        (ele: any, ind: any, arr: any) => {
          const isDuplicate =
            arr.findIndex((elem: any) => {
              return (
                (elem.ID === ele.ID || elem.Id === ele.Id) &&
                elem.siteType === ele.siteType
              );
            }) !== ind;
          return !isDuplicate;
        }
      );
      countComponentLevel(countAllTasksData11);
    }
  }

  // For the user
  const findUserByName = (name: any) => {
    const user = AllUsers.filter(
      (user: any) => user?.AssingedToUser?.Id === name
    );
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else {
      Image =
        "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }
    return user ? Image : null;
  };

  ///react table start function//////
  const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: hasCustomExpanded,
        hasExpanded: hasExpanded,
        isHeaderNotAvlable: isHeaderNotAvlable,
        size: 55,
        id: 'Id',
      },
      {
        cell: ({ row, getValue }) => (
          <div className="alignCenter">
            {row?.original?.SiteIcon != undefined ? (
              <div className="alignCenter" title="Show All Child">
                <img
                  title={row?.original?.TaskType?.Title}
                  className={
                    row?.original?.Item_x0020_Type == "SubComponent"
                      ? "workmember ml20 me-1"
                      : row?.original?.Item_x0020_Type == "Feature"
                        ? "ml-12 workmember ml20 me-1"
                        : row?.original?.TaskType?.Title == "Activities"
                          ? "ml-24 workmember ml20 me-1"
                          : row?.original?.TaskType?.Title == "Workstream"
                            ? "ml-36 workmember ml20 me-1"
                            : row?.original?.TaskType?.Title == "Task" ||
                              (row?.original?.Item_x0020_Type === "Task" &&
                                row?.original?.TaskType == undefined)
                              ? "ml-48 workmember ml20 me-1"
                              : "workmember ml20 me-1"
                  }
                  src={row?.original?.SiteIcon}
                ></img>
              </div>
            ) : (
              <>
                {row?.original?.Title != "Others" ? (
                  <div
                    title={row?.original?.Item_x0020_Type}
                    style={{
                      backgroundColor: `${row?.original?.PortfolioType?.Color}`
                    }}
                    className={
                      row?.original?.Item_x0020_Type == "SubComponent"
                        ? "Dyicons"
                        : row?.original?.Item_x0020_Type == "Feature"
                          ? "ml-12 Dyicons"
                          : row?.original?.TaskType?.Title == "Activities"
                            ? "ml-24 Dyicons"
                            : row?.original?.TaskType?.Title == "Workstream"
                              ? "ml-36 Dyicons"
                              : row?.original?.TaskType?.Title == "Task"
                                ? "ml-48 Dyicons"
                                : "Dyicons"
                    }
                  >
                    {row?.original?.SiteIconTitle}
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
            {getValue()}
          </div>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 95
      },
      {
        accessorFn: (row) => row?.TaskID,
        cell: ({ row, getValue }) => (
          <>
            {/* <ReactPopperTooltip ShareWebId={getValue()} row={row} /> */}
            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={flatviewmastertask} AllSitesTaskData={flatviewTasklist} AllListId={SelectedProp?.NextProp} />
          
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
         header: "",
         resetColumnFilters: false,
        isColumnDefultSortingAsc: isColumnDefultSortingAsc,
        // isColumnDefultSortingAsc:true,
        size: 190,
      },
  
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <div className="alignCenter">
            <span className="column-description2">
              {row?.original?.siteType == "Master Tasks" &&
                row?.original?.Title !== "Others" && (
                  <a
                    className="text-content hreflink"
                    title={row?.original?.Title}
                    data-interception="off"
                    target="_blank"
                    style={
                      row?.original?.fontColorTask != undefined
                        ? { color: `${row?.original?.fontColorTask}` }
                        : { color: `${row?.original?.PortfolioType?.Color}` }
                    }
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Portfolio-Profile.aspx?taskId=" +
                      row?.original?.ID
                    }
                  >
                    <HighlightableCell
                      value={getValue()}
                      searchTerm={
                        column.getFilterValue() != undefined
                          ? column.getFilterValue()
                          : childRef?.current?.globalFilter
                      }
                    />
                  </a>
                )}
              {row?.original?.siteType != "Master Tasks" &&
                row?.original?.Title !== "Others" && (
                  <a
                    className="text-content hreflink"
                    title={row?.original?.Title}
                    data-interception="off"
                    target="_blank"
                    style={
                      row?.original?.fontColorTask != undefined
                        ? { color: `${row?.original?.fontColorTask}` }
                        : { color: `${row?.original?.PortfolioType?.Color}` }
                    }
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Task-Profile.aspx?taskId=" +
                      row?.original?.ID +
                      "&Site=" +
                      row?.original?.siteType
                    }
                  >
                    <HighlightableCell
                      value={getValue()}
                      searchTerm={
                        column.getFilterValue() != undefined
                          ? column.getFilterValue()
                          : childRef?.current?.globalFilter
                      }
                    />
                  </a>
                )}
              {row?.original.Title === "Others" ? (
                <span
                  className="text-content"
                  title={row?.original?.Title}
                  style={
                    row?.original?.fontColorTask != undefined
                      ? { color: `${row?.original?.fontColorTask}` }
                      : { color: `${row?.original?.PortfolioType?.Color}` }
                  }
                >
                  {row?.original?.Title}
                </span>
              ) : (
                ""
              )}
            </span>
            {row?.original?.Categories == "Draft" ? (
              <FaCompressArrowsAlt
                style={{
                  height: "11px",
                  width: "20px",
                  color: `${row?.original?.PortfolioType?.Color}`
                }}
              />
            ) : (
              ""
            )}
            {row?.original?.subRows?.length > 0 ? (
              <span className="ms-1">
                {row?.original?.subRows?.length
                  ? "(" + row?.original?.subRows?.length + ")"
                  : ""}
              </span>
            ) : (
              ""
            )}
            {row?.original?.descriptionsSearch != null &&
              row?.original?.descriptionsSearch != "" && (
                <InfoIconsToolTip
                  Discription={row?.original?.descriptionsSearch}
                  row={row?.original}
                />
              )}
          </div>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
        size: 480
      },
      {
        accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
        cell: ({ row }) => (
          <>
            {row?.original?.ProjectTitle != (null || undefined) ? (
              <span>
                <a
                  style={
                    row?.original?.fontColorTask != undefined
                      ? { color: `${row?.original?.fontColorTask}` }
                      : { color: `${row?.original?.PortfolioType?.Color}` }
                  }
                  data-interception="off"
                  target="_blank"
                  className="hreflink serviceColor_Active"
                  href={`${ContextValue.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`}
                >
                  <ReactPopperTooltip
                    ShareWebId={row?.original?.projectStructerId}
                    projectToolShow={true}
                    row={row}
                    AllListId={ContextValue}
                  />
                </a>
              </span>
            ) : (
              ""
            )}
          </>
        ),
        id: "ProjectTitle",
        placeholder: "Project",
        resetColumnFilters: false,
        header: "",
        size: 70
      },
      {
        accessorFn: (row) => row?.ClientCategorySearch,
        cell: ({ row }) => (
          <>
            <ShowClintCatogory
              clintData={row?.original}
              AllMetadata={AllMetadata}
            />
          </>
        ),
        id: "ClientCategorySearch",
        placeholder: "Client Category",
        header: "",
        resetColumnFilters: false,
        size: 100
      },
      {
        accessorFn: (row) => row?.AllTeamName,
        cell: ({ row }) => (
          <div className="alignCenter">
            <ShowTaskTeamMembers
              key={row?.original?.Id}
              props={row?.original}
              TaskUsers={AllUsers}
              Context={SelectedProp?.NextProp}
            />
          </div>
        ),
        id: "AllTeamName",
        placeholder: "Team",
        resetColumnFilters: false,
        header: "",
        size: 131
      },
      {
        accessorKey: "PriorityRank",
        placeholder: "Priority",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "PriorityRank"
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "Status",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "PercentComplete"
      },
      {
        accessorKey: "ItemRank",
        placeholder: "Item Rank",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "ItemRank"
      },
      // {
      //   accessorKey: "DueDate",
      //   placeholder: "Due Date",
      //   header: "",
      //   resetColumnFilters: false,
      //   size: 100,
      //   id: "DueDate"
      // },
      {
        accessorFn: (row) => row?.DueDate,
        cell: ({ row }) => (
          <span className='ms-1'>{row?.original?.DisplayDueDate} </span>

        ),
        id: 'DueDate',
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.DisplayDueDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "DueDate",
        header: "",
        size: 100
      },
      {
        accessorFn: (row) => row?.Created,
        cell: ({ row }) => (
          <span>
            {row?.original?.Created == null ? (
              ""
            ) : (
              <>
                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                {row?.original?.Author != undefined ? (
                  <>
                    <a
                      href={`${ContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                      target="_blank"
                      data-interception="off"
                    >
                      <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                    </a>
                  </>
                ) : (
                  <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                )}
              </>
            )}
          </span>
        ),
        id: 'Created',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Created",
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        header: "",
        size: 134
      },
      {
        accessorKey: "descriptionsSearch",
        placeholder: "descriptionsSearch",
        header: "",
        resetColumnFilters: false,
        size: 100,
        id: "descriptionsSearch"
      },
      {
        accessorKey: "commentsSearch",
        placeholder: "commentsSearch",
        header: "",
        resetColumnFilters: false,
        size: 100,
        id: "commentsSearch"
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
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.siteType != "Master Tasks" && row?.original?.Title != "Others" && (
              <a
                className="alignCenter"
                onClick={(e) => EditDataTimeEntryData(e, row.original)}
                data-bs-toggle="tooltip"
                data-bs-placement="auto"
                title="Click To Edit Timesheet"
              >
                <span
                  className="svg__iconbox svg__icon--clock dark"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                ></span>
              </a>
            )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 1
      },
      {
        header: ({ table }: any) => (
          <>
            {topCompoIcon ? (
              <span
                style={{ backgroundColor: `${portfolioColor}` }}
                title="Restructure"
                className="Dyicons mb-1 mx-1 p-1"
                onClick={() => trueTopIcon(true)}
              >
                <span className="svg__iconbox svg__icon--re-structure"></span>
              </span>
            ) : (
              ""
            )}
          </>
        ),
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.isRestructureActive && row?.original?.Title != "Others" && (
              <span
                className="Dyicons p-1"
                title="Restructure"
                style={{
                  backgroundColor: `${row?.original?.PortfolioType?.Color}`
                }}
                onClick={() => callChildFunction(row?.original)}
              >
                <span className="svg__iconbox svg__icon--re-structure"> </span>
                {/* <img
                                    className="workmember"
                                    src={row?.original?.Restructuring}
                                    
                                // onClick={()=>callChildFunction(row?.original)}
                                /> */}
              </span>
            )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 1
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.siteType === "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a
                  className="alignCenter"
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title={"Edit " + `${row.original.Title}`}
                >
                  {" "}
                  <span
                    className="svg__iconbox svg__icon--edit"
                    onClick={(e) => EditComponentPopup(row?.original)}
                  ></span>
                </a>
              )}
            {row?.original?.siteType != "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a
                  className="alignCenter"
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title={"Edit " + `${row.original.Title}`}
                >
                  {" "}
                  <span
                    className="svg__iconbox svg__icon--edit"
                    onClick={(e) => EditItemTaskPopup(row?.original)}
                  ></span>
                </a>
              )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 30
      }
    ],
    [data]
  );
  //-------------------------------------------------- restructuring function start---------------------------------------------------------------

  const callBackData = React.useCallback((checkData: any) => {
    let array: any = [];
    if (checkData != undefined) {
      setCheckedList(checkData);
      array.push(checkData);
    } else {
      setCheckedList({});
      array = [];
    }
    setCheckedList1(array);
  }, []);

  const callBackData1 = React.useCallback((getData: any, topCompoIcon: any) => {
    setData((getData) => [...getData]);
    setTopCompoIcon(topCompoIcon);
    renderData = [];
    renderData = renderData.concat(getData);
    refreshData();
  }, []);

  //  Function to call the child component's function
  const callChildFunction = (items: any) => {
    if (childRef.current) {
      childRef.current.callChildFunction(items);
    }
  };

  const trueTopIcon = (items: any) => {
    if (childRef.current) {
      childRef.current.trueTopIcon(items);
    }
  };

  //-------------------------------------------------- restructuring function end---------------------------------------------------------------

  //// popup Edit Task And Component///
  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = ContextValue.siteUrl;
    item["listName"] = "Master Tasks";
    setIsComponent(true);
    setSharewebComponent(item);
  };
  const EditItemTaskPopup = (item: any) => {
    setIsTask(true);
    setSharewebTask(item);
  };
  const EditDataTimeEntryData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  };
  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);
  ///////////////////////////////////

  // Code Write by RanuSir ////
  const OpenAddStructureModal = () => {
    setOpenAddStructurePopup(true);
  };
  const onRenderCustomHeaderMain1 = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div className="subheading">
          
          <span className="siteColor">{`Create Component `}</span>
        </div>
        <Tooltip ComponentId={checkedList?.Id} />
      </div>
    );
  };

  let isOpenPopup = false;
  const AddStructureCallBackCall = React.useCallback((item) => {
    childRef?.current?.setRowSelection({});
    if (!isOpenPopup && item.CreatedItem != undefined) {
      if (item?.CreatedItem[0]?.data?.ItemType == "SubComponent") {
        item.CreatedItem.forEach((obj: any) => {
          obj.data.childs = [];
          obj.data.subRows = [];
          obj.data.flag = true;
          obj.data.TitleNew = obj.data.Title;
          obj.data.siteType = "Master Tasks";
          obj.data.SiteIconTitle = obj?.data?.Item_x0020_Type?.charAt(0);
          obj.data["TaskID"] = obj.data.PortfolioStructureID;
          if (
            item.props != undefined &&
            item.props.SelectedItem != undefined &&
            (item.props.SelectedItem.subRows == undefined || item.props.SelectedItem.subRows != undefined)
          ) {
            item.props.SelectedItem.subRows =
              item.props.SelectedItem.subRows == undefined
                ? []
                : item.props.SelectedItem.subRows;
            item.props.SelectedItem.subRows.unshift(obj.data);
            copyDtaArray = copyDtaArray.concat(item.props.SelectedItem.subRows)
          }
        });
      }
      item.CreatedItem.forEach((obj: any) => {
        obj.data.childs = [];
        obj.data.subRows = [];
        obj.data.flag = true;
        obj.data.TitleNew = obj.data.Title;
        obj.data.siteType = "Master Tasks";
        obj.data.SiteIconTitle = obj?.data?.Item_x0020_Type?.charAt(0);
        obj.data["TaskID"] = obj.data.PortfolioStructureID;
        if (
          item.props != undefined &&
          item.props.SelectedItem != undefined &&
          (item.props.SelectedItem.subRows == undefined || item.props.SelectedItem.subRows != undefined)
        ) {
          item.props.SelectedItem.subRows =
            item.props.SelectedItem.subRows == undefined
              ? []
              : item.props.SelectedItem.subRows;
          item.props.SelectedItem.subRows.unshift(obj.data);
        }
      });

      if (copyDtaArray != undefined && copyDtaArray.length > 0) {
        copyDtaArray.forEach((compnew: any, index: any) => {
          if (compnew.subRows != undefined && compnew.subRows.length > 0) {
            item.props.SelectedItem.downArrowIcon = compnew.downArrowIcon;
            item.props.SelectedItem.RightArrowIcon = compnew.RightArrowIcon;
            return false;
          }
        });
        copyDtaArray.forEach((comp: any, index: any) => {
          if (
            comp.Id != undefined &&
            item.props.SelectedItem != undefined &&
            comp.Id === item.props.SelectedItem.Id
          ) {
            comp.childsLength = item.props.SelectedItem.subRows.length;
            comp.show = comp.show == undefined ? false : comp.show;
            comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
            comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;

            //comp.childs = item.props.SelectedItem.subRows;
            comp.subRows = item.props.SelectedItem.subRows;
          }
          if (comp.subRows != undefined && comp.subRows.length > 0) {
            comp.subRows.forEach((subcomp: any, index: any) => {
              if (
                subcomp.Id != undefined &&
                item.props.SelectedItem != undefined &&
                subcomp.Id === item.props.SelectedItem.Id
              ) {
                subcomp.childsLength = item.props.SelectedItem.subRows.length;
                subcomp.show = subcomp.show == undefined ? false : subcomp.show;
                subcomp.childs = item.props.SelectedItem.childs;
                subcomp.subRows = item.props.SelectedItem.subRows;
                comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
              }
            });
          }
        });
        // }
      }
      renderData = [];
      renderData = renderData.concat(copyDtaArray);
      refreshData();
      // rerender();
    }
    if (!isOpenPopup && item.data != undefined) {
      item.data.subRows = [];
      item.data.flag = true;
      item.data.TitleNew = item.data.Title;
      item.data.siteType = "Master Tasks";
      if (portfolioTypeData != undefined && portfolioTypeData.length > 0) {
        portfolioTypeData.forEach((obj: any) => {
          if (item.data?.PortfolioTypeId != undefined)
            item.data.PortfolioType = obj;
        });
      }
      item.data.SiteIconTitle = item?.data?.Item_x0020_Type?.charAt(0);
      item.data["TaskID"] = item.data.PortfolioStructureID;
      copyDtaArray.unshift(item.data);
      renderData = [];
      renderData = renderData.concat(copyDtaArray);
      refreshData();
    }
    setOpenAddStructurePopup(false);
  }, []);

  const CreateOpenCall = React.useCallback((item) => { }, []);
  /// END ////

  //----------------------------Code By Santosh---------------------------------------------------------------------------
  const Call = (res: any) => {
    if (res?.data?.ItmesDelete == true) {
      copyDtaArray?.map((ele: any, index: any) => {
        if (ele.subRows != undefined && ele.subRows?.length > 0) {
          ele.subRows?.map((sub: any, subindex: any) => {
            if (sub.Id == res.data.Id) {
              copyDtaArray[index].subRows.splice(subindex, 1);
            }
          })
        }
        if (ele.Id == res.data.Id) {
          copyDtaArray.splice(index, 1);
        }
      })
      renderData = [];
      renderData = renderData.concat(copyDtaArray);
      refreshData();
    }
    if (res == "Close") {
      setIsTask(false);
      setIsOpenActivity(false);
      setIsOpenWorkstream(false);
      setActivityPopup(false);
      setIsComponent(false);
    }
    else if(res?.Id != undefined && res?.siteCompositionData != undefined){
      copyDtaArray.forEach((val:any, index:any) => {
        if (res?.Id === val?.Id && val?.Item_x0020_Type === res?.Item_x0020_Type) {
          const newVal = { ...res };
          copyDtaArray[index] = newVal;
        } else if (val?.subRows) {
          val.subRows.forEach((ele:any, subIndex:any) => {
            if (res?.Id === ele?.Id && ele?.Item_x0020_Type === res?.Item_x0020_Type) {
              const newVal = { ...res };
              copyDtaArray[index].subRows[subIndex] = newVal;
            } else if (ele?.subRows) {
              ele.subRows.forEach((elev:any, subSubIndex:any) => {
                if (res?.Id === elev?.Id && elev?.Item_x0020_Type === res?.Item_x0020_Type) {
                  const newVal = { ...res };
                  copyDtaArray[index].subRows[subIndex].subRows[subSubIndex] = newVal;
                }
              });
            }
          });
        }
      });
      
      renderData = [];
      renderData = renderData.concat(copyDtaArray);
      refreshData();
   
    } 
    else {
      childRef?.current?.setRowSelection({});
      setIsComponent(false);
      setIsTask(false);
      setIsOpenActivity(false);
      setIsOpenWorkstream(false);
      setActivityPopup(false);
      if (res?.data?.PortfolioId != null && res?.data?.PortfolioId === SelectedProp?.props?.Id &&res?.data?.TaskTypeId === 2 && res?.data?.ParentTaskId===null ) {
        const checkother = copyDtaArray.filter((item: any) => item.Title === "Others");
        if (checkother?.length === 0) {
          let temp: any = {};
          temp.Title = "Others";
          temp.TaskID = "";
          temp.subRows = [];
          temp.PercentComplete = "";
          temp.ItemRank = "";
          temp.DueDate = null;
          temp.Project = "";
          temp.ClientCategorySearch = "";
          temp.Created = null;
          temp.DisplayCreateDate = null;
          temp.DisplayDueDate = null;
          temp.AllTeamName = "";
          temp.DueDate = "";
          temp.descriptionsSearch = "";
          temp.ProjectTitle = "";
          temp.Status = "";
          temp.Author = "";
          temp?.subRows?.push(res.data);
          copyDtaArray = copyDtaArray.concat(temp)
        } else {
          checkother[0]?.subRows?.push(res.data)
        }
      }
      if (res?.data?.PortfolioId === SelectedProp?.props?.Id || res?.data?.TaskTypeId != null) {
        if(copyDtaArray?.length === 0){
          copyDtaArray.push(res.data);
        }else{
          copyDtaArray.forEach((val: any) => {
            if (res?.data?.ParentTask?.Id === val?.Id || res?.data?.ParentTaskId === val?.Id) {
              val.subRows = val.subRows ?? [];
              val.subRows.push(res.data);
            }
  
            if (val?.subRows) {
              val?.subRows?.forEach((ele: any) => {
                if (res?.data?.ParentTask?.Id === ele?.Id || res?.data?.ParentTaskId === ele?.Id) {
                  ele.subRows = ele.subRows ?? [];
                  ele?.subRows?.push(res.data);
                }
                if (ele?.subRows) {
                  ele?.subRows?.forEach((elev: any) => {
                    if (res?.data?.ParentTask?.Id === elev?.Id || res?.data?.ParentTaskId === elev?.Id) {
                      elev.subRows = elev.subRows ?? [];
                      elev?.subRows?.push(res.data);
                    }
                  });
                }
  
              });
            }
          });
       
        }
      }

      copyDtaArray?.forEach((val: any) => {

        if (res?.data?.PortfolioId == val.Id) {
          val.subRows = val.subRows === undefined ? [] : val.subRows;

          val.subRows.push(res.data);
        } else if (val?.subRows != undefined && val?.subRows.length > 0) {
          val.subRows?.forEach((ele: any) => {
            if (res?.data?.PortfolioId == ele?.Id) {
              ele.subRows = ele.subRows === undefined ? [] : ele.subRows;
              ele.subRows.push(res.data);
            } else {
              ele.subRows?.forEach((elev: any) => {
                if (res?.data?.PortfolioId == elev.Id) {
                  elev.subRows = elev.subRows === undefined ? [] : elev.subRows;
                  elev.subRows.push(res.data);
                } else {
                  elev.subRows?.forEach((child: any) => {
                    if (res?.data?.PortfolioId == child?.Id) {
                      child.subRows =
                        child.subRows === undefined ? [] : child.subRows;

                      child.subRows.push(res.data);
                    } else {
                      {
                        child.subRows?.forEach((Sub: any) => {
                          if (res?.data?.PortfolioId == Sub.Id) {
                            Sub.subRows =
                              Sub.subRows === undefined ? [] : Sub.subRows;

                            Sub.subRows.push(res.data);
                          }else{
                            Sub?.subRows?.forEach((nextsub:any)=>{
                              if (res?.data?.PortfolioId == nextsub.Id) {
                                nextsub.subRows =
                                nextsub.subRows === undefined ? [] : nextsub.subRows;
    
                                nextsub.subRows.push(res.data);
                              }
                            })
                            
                          }
                        });
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });


      // For the resolve the 

      renderData = [];
      renderData = renderData.concat(copyDtaArray);
      refreshData();
    }
  };
  // new change////
  const CreateActivityPopup = (type: any) => {
    if (checkedList?.TaskType === undefined) {
      SelectedProp.props.NoteCall = type;
      checkedList.NoteCall = type;
      setIsOpenActivity(true);
    }
    if (checkedList?.TaskType?.Id == 1) {
      checkedList.NoteCall = type;
      setIsOpenWorkstream(true);
    }
    if (checkedList?.TaskType?.Id == 3) {
      SelectedProp.props.NoteCall = type;
      checkedList.NoteCall = type;
      setIsOpenActivity(true);
    }
    if (checkedList?.TaskType?.Id == 2) {
      alert("You can not create ny item inside Task");
    }
  };
  const closeActivity = () => {
    setActivityPopup(false);
    childRef?.current?.setRowSelection({});
  };
  const addActivity = (type: any) => {
    if (
      checkedList?.TaskType?.Id == undefined ||
      checkedList?.TaskTypeId == undefined
    ) {
      checkedList.NoteCall = type;
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
  //-------------------------------------------------------------End---------------------------------------------------------------------------------
  return (
    <div id="ExandTableIds" style={{}}>
      <section className="ContentSection">
        <div className="col-sm-12 clearfix">
          <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("service") > -1 && (
                <div style={{ color: `${portfolioColor}` }}>
                  {IsUpdated} Portfolio
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("service") > -1 && (
                <div className="text-end fs-6">
                  <a
                    data-interception="off"
                    style={{ color: `${portfolioColor}` }}
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Service-Portfolio-Old.aspx"
                    }
                  >
                    Old Service Portfolio
                  </a>
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("event") > -1 && (
                <div style={{ color: `${portfolioColor}` }}>
                  {IsUpdated} Portfolio
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("event") > -1 && (
                <div className="text-end fs-6">
                  <a
                    data-interception="off"
                    target="_blank"
                    style={{ color: `${portfolioColor}` }}
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Event-Portfolio-Old.aspx"
                    }
                  >
                    Old Event Portfolio
                  </a>
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("component") > -1 && (
                <div style={{ color: `${portfolioColor}` }}>
                  {IsUpdated} Portfolio
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("component") > -1 && (
                <div className="text-end fs-6">
                  {IsUpdated != "" &&
                    IsUpdated != undefined &&
                    IsUpdated.toLowerCase().indexOf("component") > -1 && (
                      <div className="text-end fs-6">
                        {ContextValue?.siteUrl?.toLowerCase().indexOf("ksl") >
                          -1 ||
                          ContextValue?.siteUrl?.toLowerCase().indexOf("gmbh") >
                          -1 ? (
                          <a
                            data-interception="off"
                            target="_blank"
                            style={{ color: `${portfolioColor}` }}
                            className="hreflink serviceColor_Active"
                            href={
                              ContextValue.siteUrl +
                              "/SitePages/Team-Portfolio-Old.aspx"
                            }
                          >
                            Old Team Portfolio
                          </a>
                        ) : (
                          <a
                            data-interception="off"
                            target="_blank"
                            style={{ color: `${portfolioColor}` }}
                            className="hreflink serviceColor_Active"
                            href={
                              ContextValue.siteUrl +
                              "/SitePages/Component-Portfolio-Old.aspx"
                            }
                          >
                            Old Component Portfolio
                          </a>
                        )}{" "}
                      </div>
                    )}
                </div>
              )}
          </h2>
        </div>
      </section>

      <section className="TableContentSection taskprofilepagegreen">
        <div className="container-fluid">
          <section className="TableSection">
            <div className="container p-0">
              <div className="Alltable mt-2 ">
                <div className="col-sm-12 p-0 smart">
                  <div className="">
                    <div className="wrapper">
                      <Loader
                        loaded={loaded}
                        lines={13}
                        length={20}
                        width={10}
                        radius={30}
                        corners={1}
                        rotate={0}
                        direction={1}
                        color={portfolioColor ? portfolioColor : "#000069"}
                        speed={2}
                        trail={60}
                        shadow={false}
                        hwaccel={false}
                        className="spinner"
                        zIndex={2e9}
                        top="28%"
                        left="50%"
                        scale={1.0}
                        loadedClassName="loadedContent"
                      />
                      <GlobalCommanTable
                        smartTimeTotalFunction={smartTimeTotal} SmartTimeIconShow={true}
                        ref={childRef}
                        AddStructureFeature={
                          SelectedProp?.props?.Item_x0020_Type
                        }
                        clickFlatView={clickFlatView} switchFlatViewData={switchFlatViewData} flatView={true} switchGroupbyData={switchGroupbyData}
                        setLoaded={setLoaded}
                        queryItems={SelectedProp?.props}
                        PortfolioFeature={SelectedProp?.props?.Item_x0020_Type}
                        AllMasterTasksData={AllMasterTasksData}
                        callChildFunction={callChildFunction}
                        AllListId={ContextValue}
                        columns={columns}
                        restructureCallBack={callBackData1}
                        data={data}
                        callBackData={callBackData}
                        TaskUsers={AllUsers}
                        showHeader={true}
                        portfolioColor={portfolioColor}
                        portfolioTypeData={portfolioTypeDataItem}
                        taskTypeDataItem={taskTypeDataItem}
                        fixedWidth={true}
                        protfolioProfileButton={true}
                        portfolioTypeConfrigration={portfolioTypeConfrigration}
                        showingAllPortFolioCount={true}
                        showCreationAllButton={true}
                        OpenAddStructureModal={OpenAddStructureModal}
                        addActivity={addActivity}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Panel
        onRenderHeader={onRenderCustomHeaderMain1}
        type={PanelType.large}
        isOpen={OpenAddStructurePopup}
        isBlocking={false}
        onDismiss={AddStructureCallBackCall}
      >
        <PortfolioStructureCreationCard
          CreatOpen={CreateOpenCall}
          Close={AddStructureCallBackCall}
          PortfolioType={IsUpdated}
          PropsValue={ContextValue}
          SelectedItem={
            checkedList != null && checkedList?.Id != undefined
              ? checkedList
              : SelectedProp.props
          }
        />
      </Panel>
      <Panel
        onRenderHeader={onRenderCustomHeaderMain}
        type={PanelType.custom}
        customWidth="600px"
        isOpen={ActivityPopup}
        onDismiss={closeActivity}
        isBlocking={false}
      >
        <div className="modal-body bg-f5f5 clearfix">
          <div
            className={
              IsUpdated == "Events Portfolio"
                ? "app component clearfix eventpannelorange"
                : IsUpdated == "Service Portfolio"
                  ? "app component clearfix serviepannelgreena"
                  : "app component clearfix"
            }
          >
            <div id="portfolio" className="section-event pt-0">
              {checkedList != undefined &&
                checkedList?.TaskType?.Title == "Workstream" ? (
                <ul className="quick-actions">
                  <li>
                    <div onClick={(e) => CreateActivityPopup("Task")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png"
                        />
                      </span>
                      Bug
                    </div>
                  </li>
                  <li>
                    <div onClick={() => CreateActivityPopup("Task")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png"
                        />
                      </span>
                      Feedback
                    </div>
                  </li>
                  <li>
                    <div onClick={() => CreateActivityPopup("Task")}>
                      <span className="icon-sites">
                        <img src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" />
                      </span>
                      Improvement
                    </div>
                  </li>
                  <li>
                    <div onClick={() => CreateActivityPopup("Task")}>
                      <span className="icon-sites">
                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" />
                      </span>
                      Design
                    </div>
                  </li>
                  <li>
                    <div onClick={() => CreateActivityPopup("Task")}>
                      <span className="icon-sites"></span>
                      Task
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="quick-actions">
                  <li>
                    <div onClick={(e) => CreateActivityPopup("Implementation")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png"
                        />
                      </span>
                      Implmentation
                    </div>
                  </li>
                  <li>
                    <div onClick={() => CreateActivityPopup("Development")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png"
                        />
                      </span>
                      Development
                    </div>
                  </li>
                  <li>
                    <div onClick={() => CreateActivityPopup("Activities")}>
                      <span className="icon-sites"></span>
                      Activity
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center">
                    <div onClick={() => CreateActivityPopup("Task")}>
                      <span className="icon-sites"></span>
                      Task
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-default btn-default ms-1 pull-right"
            onClick={closeActivity}
          >
            Cancel
          </button>
        </div>
      </Panel>
      {isOpenActivity && (
      <CreateActivity
      Call={Call}
      AllListId={ContextValue}
      TaskUsers={AllUsers}
      context={ContextValue.Context}
      AllClientCategory={AllClientCategory}
      LoadAllSiteTasks={LoadAllSiteTasks}
      selectedItem={checkedList != null && checkedList?.Id != undefined? checkedList: SelectedProp.props} portfolioTypeData={portfolioTypeData}
    ></CreateActivity>
      )}
      {isOpenWorkstream && (
        <CreateWS
        selectedItem={checkedList}
        Call={Call}
        context={ContextValue.Context}
        AllListId={ContextValue}
        TaskUsers={AllUsers}
        data={data}
        ></CreateWS>
      )}
      {IsTask && (
        <EditTaskPopup
          Items={SharewebTask}
          Call={Call}
          AllListId={SelectedProp?.NextProp}
          context={SelectedProp?.NextProp.Context}
          pageName="TaskFooterTable"
        ></EditTaskPopup>
      )}
      {IsComponent && (
        <EditInstituton
          item={SharewebComponent}
          Calls={Call}
          SelectD={SelectedProp.NextProp}
          portfolioTypeData={portfolioTypeData}
        >
          {" "}
        </EditInstituton>
      )}
      {IsTimeEntry && (
        <TimeEntryPopup
          props={SharewebTimeComponent}
          CallBackTimeEntry={TimeEntryCallBack}
          Context={SelectedProp?.NextProp.Context}
        ></TimeEntryPopup>
      )}
    </div>
  );
}
export default PortfolioTable;

