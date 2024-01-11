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
import { myContextValue } from '../../../globalComponents/globalCommon'
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import GlobalCommanTable, {
  IndeterminateCheckbox
} from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import PageLoader from "../../../globalComponents/pageLoader";
import CreateActivity from "../../../globalComponents/CreateActivity";
import CreateWS from '../../../globalComponents/CreateWS';
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
let PortfolioTypeBackup:any=[]
let hasExpanded: any = true;
let isColumnDefultSortingAsc: any = false;
let hasCustomExpanded: any = true;
let isHeaderNotAvlable: any = false
let TagProjectToStructure=false;
let allgroupdata:any = [];
let isAllTaskSelected:any = false;
let loadAllTaskType:any=false;
let AllTasks: any = [];
let portfolioTypeData:any=[]
function PortfolioTable(SelectedProp: any) {
  const childRef = React.useRef<any>();
  if (childRef != null) {
    childRefdata = { ...childRef };
  }


  const refreshData = () => setData(() => renderData);
  const [loaded, setLoaded] = React.useState(false);
  const [siteConfig, setSiteConfig] = React.useState([]);
  const [data, setData] = React.useState([]);
  copyDtaArray = data;
  const [activeTile ,setActiveTile]=React.useState("")
  const [AllUsers, setTaskUser] = React.useState([]);
  const [AllMetadata, setMetadata] = React.useState([]);
  const [AllClientCategory, setAllClientCategory] = React.useState([]);
  const [IsUpdated, setIsUpdated] = React.useState("");
  const [checkedList, setCheckedList] = React.useState<any>({});
  // const [AllSiteTasksData, setAllSiteTasksData] = React.useState([]);
  const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
  //const [portfolioTypeData, setPortfolioTypeData] = React.useState([]);
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
    const [flatViewDataAll, setFlatViewDataAll] = React.useState([]);
    const [portfolioTypeDataItemBackup, setPortFolioTypeIconBackup] = React.useState([]);
    const [taskTypeDataItemBackup, setTaskTypeDataItemBackup] = React.useState([]);
    const [priorityRank, setpriorityRank] = React.useState([])
    const [precentComplete, setPrecentComplete] = React.useState([])
    const globalContextData: any = React.useContext<any>(myContextValue)
  let ComponetsData: any = {};
  let Response: any = [];
  let props = undefined;
  let AllComponetsData: any = [];

  let TaskUsers: any = [];
  let TasksItem: any = [];
  ContextValue = SelectedProp?.NextProp;
  React.useEffect(() => {
    try {
      if (SelectedProp?.NextProp != undefined && SelectedProp?.UsedFrom!='ProjectManagement') {
        SelectedProp.NextProp.isShowTimeEntry = JSON.parse(
          SelectedProp?.NextProp?.TimeEntry
        );
  
        SelectedProp.NextProp.isShowSiteCompostion = JSON.parse(
          SelectedProp?.NextProp?.SiteCompostion
        );
        ContextValue = SelectedProp?.NextProp;
      }else{
        ContextValue = SelectedProp?.NextProp;
      }
      TagProjectToStructure = SelectedProp?.UsedFrom=='ProjectManagement';
    } catch (e) {
      console.log(e);
    }
    getTaskType();
    findPortFolioIconsAndPortfolio();
    GetSmartmetadata();
    getTaskUsers();
    getPortFolioType();
  }, []);

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
    portfolioTypeData=[]
    let web = new Web(ContextValue.siteUrl);
    let PortFolioType = [];
    PortFolioType = await web.lists
      .getById(ContextValue.PortFolioTypeID)
      .items.select("Id", "Title", "Color", "IdRange")
      .get();
      portfolioTypeData = PortFolioType;
     PortfolioTypeBackup = PortFolioType
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
    let Priority: any = []
    let PrecentComplete: any = [];
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
      if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Offshore Tasks"  || newtest.Title == "Gender" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
      newtest.DataLoadNew = false;
      else if (newtest.TaxType == "Sites") siteConfigSites.push(newtest);
      if (newtest?.TaxType == 'timesheetListConfigrations') {
        timeSheetConfig = newtest;
      }
      if (newtest?.TaxType == 'Priority Rank') {
        Priority?.push(newtest)
    }
    if (newtest?.TaxType === 'Percent Complete' && newtest?.Title != 'In Preparation (0-9)' && newtest?.Title != 'Ongoing (10-89)' && newtest?.Title != 'Completed (90-100)') {
        PrecentComplete.push(newtest);
    }
    });
    if (siteConfigSites?.length > 0) {
      setSiteConfig(siteConfigSites);
    }
    Priority?.sort((a: any, b: any) => {
      return a.SortOrder - b.SortOrder;
  });
  PrecentComplete?.sort((a: any, b: any) => {
      return a.SortOrder - b.SortOrder;
  });
  setpriorityRank(Priority)
  setPrecentComplete(PrecentComplete)
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
  const FilterAllTask = ()=>{
    loadAllTaskType=true;
    LoadAllSiteTasks('CompletedTask')
   
  }
    
    let AllTasksData: any = [];
    let AllTasksMatches: any = [];

  const LoadAllSiteTasks = async function (type:any) { 
    if(loadAllTaskType == true && type == 'CompletedTask'){
      getPortFolioType();
      setLoaded(false)
      var Alldataa = []
      let filter = "PercentComplete gt '0.89'";
      AllTasksMatches = await globalCommon?.loadAllSiteTasks(ContextValue, filter)
      countsrun = 0;
      isAllTaskSelected = true;
      countAllComposubData=[]
      componentData=[]
      countAllTasksData=[]
      
    }
    else{
      if(loadAllTaskType == false){
        AllTasks = []
        countAllComposubData=[]
        countAllTasksData=[]
        componentData=[]
        countsrun = 0;
        let filter = "PercentComplete lt '0.90'";
        AllTasksMatches  = await globalCommon?.loadAllSiteTasks(ContextValue, filter)
      }
     
     }
            console.log(AllTasksMatches.length);
            if (AllTasksMatches != undefined) {
              if (AllTasksMatches?.length > 0) {
                $.each(AllTasksMatches, function (index: any, item: any) {
                  item.isDrafted = false;
                  item.flag = true;
                  item.TitleNew = item.Title;
      
                  item.childs = [];
                 
                  item.siteUrl = ContextValue.siteUrl;
                  item.fontColorTask = "#000";
                  item.SmartPriority;
                  item.TaskTypeValue = '';
                  item.projectPriorityOnHover = '';
                  item.taskPriorityOnHover = item?.PriorityRank;
                  item.showFormulaOnHover;
                });
              }
              AllTasks = AllTasks.concat(AllTasksMatches);
              AllTasks = $.grep(AllTasks, function (type: any) {
                return type.isDrafted == false;
              });
            
                map(AllTasks, (result: any) => {
                  result.Id = result.Id != undefined ? result.Id : result.ID;
                  result.TeamLeaderUser = [];
                  result.AllTeamName =
                    result.AllTeamName === undefined ? "" : result.AllTeamName;
                  result.chekbox = false;
                  result.descriptionsSearch = "";
                  result.commentsSearch = "";
                  result.TaskTypeValue = '';
                  result.portfolioItemsSearch = '';
                  result.SmartPriority = globalCommon.calculateSmartPriority(result);
                  if (result?.DueDate != null && result?.DueDate != undefined) {
                    result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
                }
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
                  //result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
                  //result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
                  result.chekbox = false;
                  
                  if (result?.FeedBack != undefined) {
                    let feedbackdata = JSON.parse(result?.FeedBack)
                    result.descriptionsSearch = globalCommon.descriptionSearchData(result);
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
                  if (result?.TaskType) {
                    result.portfolioItemsSearch = result?.TaskType?.Title;
                }
                if (result?.TaskCategories?.length > 0) {
                  result.TaskTypeValue = result?.TaskCategories?.map((val: any) => val.Title).join(",")
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
          
  };
  const timeEntryIndex: any = {};
  const smartTimeTotal = async () => {
    setLoaded(false)
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
     let portfoliodata =  portfolioTypeData.filter((port:any)=>port.Title === SelectedProp?.props?.Item_x0020_Type)
      
        componentGrouping(portfoliodata[0]?.Id, portfoliodata[0]?.Id);
        countsrun++;
    }
    setLoaded(true)
    return AllSiteTasksData;
  };

  const GetComponents = async () => {
    componentData=[]
    let componentDetails: any = [];
    let results = await globalCommon.GetServiceAndComponentAllData(SelectedProp?.NextProp)
    if (results?.AllData?.length > 0) {
        componentDetails = results?.AllData;
        ProjectData=results?.ProjectData;
        componentDetails?.map((items: any) => {
          items.SmartPriority;
      });
    }
    flatviewmastertask = JSON.parse(JSON.stringify(componentDetails));
    setAllMasterTasks(componentDetails);
    AllComponetsData = componentDetails;
    ComponetsData["allComponets"] = componentDetails;
    if (AllSiteTasksData?.length > 0 && AllComponetsData?.length > 0) {
      portfolioTypeData.forEach((port:any, index:any) => {
        componentGrouping(port?.Id, index);
        countsrun++;
      });
    }
    if (portfolioTypeData?.length === countsrun) {
      executeOnce();
    }
    // AllSiteTasksData?.length > 0 &&
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
  setFlatViewDataAll(flattenedData)
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
      LoadAllSiteTasks('AllTask');
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
    let isItems = false;
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
      temp.TaskTypeValue = "";
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
      if(temp.subRows != undefined && temp.subRows.length > 0){
        isItems = true;
      }
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

    
   
   let newArray:any = []
   if(componentData != undefined && componentData.length > 1 && isAllTaskSelected == true){
    if(componentData[0]?.Title == 'Others' || componentData[1]?.Title == 'Others' && componentData[0]?.TaskType.Title == 'Activities'){

      componentData[0]?.Title == 'Others'?componentData.splice(0,1):componentData.splice(0,2)
    }
  }
    if(isAllTaskSelected == true && componentData.length > 0){
      setData(componentData);
      setLoaded(true);
    }
    if(isAllTaskSelected == false){
      setLoaded(true);
      setData(componentData);
      console.log(countAllTasksData);
    }
    
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
      const taskLabelCountBackup: any = JSON.parse(JSON.stringify(taskTypeDataItem));
      setTaskTypeDataItemBackup(taskLabelCountBackup)
    }
  };

  const countComponentLevel = (countTaskAWTLevel: any) => {
    if (countTaskAWTLevel?.length > 0) {
      portfolioTypeDataItem?.map((type: any) => {
        countTaskAWTLevel?.map((result: any) => {
          if (result?.Item_x0020_Type === type?.Title) {
            if(isAllTaskSelected != true){
              type[type.Title + "filterNumber"] += 1;
              type[type.Title + "number"] += 1;
            }
           
          }
        });
      });
      const portfolioLabelCountBackup: any = JSON.parse(JSON.stringify(portfolioTypeDataItem));
        setPortFolioTypeIconBackup(portfolioLabelCountBackup);
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
        accessorFn: (row) => row?.portfolioItemsSearch,
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
           
          </div>
        ),
        id: "portfolioItemsSearch",
        placeholder: "Type",
        header: "",
        resetColumnFilters: false,
        size: 95,
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
        size: 410
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
        accessorFn: (row) => row?.TaskTypeValue,
        cell: ({ row, column, getValue }) => (
            <>
                <span className="columnportfoliotaskCate"><span title={row?.original?.TaskTypeValue} className="text-content"><HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></span></span>
            </>
        ),
        placeholder: "Task Type",
        header: "",
        resetColumnFilters: false,
        size: 90,
        id: "TaskTypeValue",
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
        size: 100
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
      {
        accessorFn: (row) => row?.SmartPriority,
        cell: ({ row }) => (
          <div className="boldClable" title={row?.original?.showFormulaOnHover}>{row?.original?.SmartPriority}</div>
        ),
        id: "SmartPriority",
        placeholder: "SmartPriority",
        resetColumnFilters: false,
        header: "",
        size: 42,
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
        size: 91
      },
      {
        accessorFn: (row) => row?.Created,
        cell: ({ row }) => (
          <div className="alignCenter">
            {row?.original?.Created == null ? (
              ""
            ) : (
              <>
                <div style={{ width: "70px" }} className="me-1">{row?.original?.DisplayCreateDate}</div>
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
          </div>
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
        size: 125
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
  

  function deletedDataFromPortfolios(dataArray: any, idToDelete: any, siteName: any) {
    let updatedArray = [];
    let itemDeleted = false;
    for (let item of dataArray) {
        if (item.Id === idToDelete && item.siteType === siteName) {
            itemDeleted = true;
            continue;
        }
        let newItem = { ...item };
        if (newItem.subRows && newItem.subRows.length > 0) {
            newItem.subRows = deletedDataFromPortfolios(newItem.subRows, idToDelete, siteName);
        }
        updatedArray.push(newItem);
        if (itemDeleted) {
            return updatedArray;
        }
    }
    return updatedArray;
}

const addedCreatedDataFromAWT = (arr: any, dataToPush: any) => {
  if(dataToPush?.PortfolioId === SelectedProp.props.Id && dataToPush?.ParentTask?.Id === undefined){
    arr.push(dataToPush)
    if(SelectedProp?.UsedFrom=='ProjectManagement'){
      try{
        globalContextData?.projectCallBackTask()
        globalContextData?.closeCompTaskPopup()
       }catch(e){
        console.error(e)
       }
    }
    return true;
  }else if(dataToPush?.PortfolioId === SelectedProp?.props?.Id && dataToPush?.TaskTypeId ==2 && dataToPush?.ParentTaskId === null){
    if(SelectedProp?.UsedFrom=='ProjectManagement'){
      try{
        globalContextData?.projectCallBackTask()
        globalContextData?.closeCompTaskPopup()
       }catch(e){
        console.error(e)
       }
    }
    const checkother = arr.filter((item: any) => item.Title === "Others");
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
      temp.portfolioItemsSearch = "";
      temp.descriptionsSearch = "";
      temp.ProjectTitle = "";
      temp.Status = "";
      temp.Author = "";
      temp?.subRows?.push(dataToPush);
      copyDtaArray = copyDtaArray.concat(temp)
      return true;
    } else {
      checkother[0]?.subRows?.push(dataToPush)
      return true;
    }
  }
  for (let val of arr) {
      if (dataToPush?.PortfolioId === val.Id && dataToPush?.ParentTask?.Id === undefined) {
          val.subRows = val.subRows || [];
          val?.subRows?.push(dataToPush);
          return true;
      } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
          val.subRows = val.subRows || [];
          val?.subRows?.push(dataToPush);
          return true;
      } else if (val?.subRows) {
          if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
              return true;
          }
      }
  }
  return false;
};
const updatedDataDataFromPortfolios = (copyDtaArray: any, dataToUpdate: any) => {
  for (let i = 0; i < copyDtaArray.length; i++) {
      if ((dataToUpdate?.Portfolio?.Id === copyDtaArray[i]?.Portfolio?.Id && dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType) || (dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType)) {
          copyDtaArray[i] = { ...copyDtaArray[i], ...dataToUpdate };
          return true;
      } else if (copyDtaArray[i].subRows) {
          if (updatedDataDataFromPortfolios(copyDtaArray[i].subRows, dataToUpdate)) {
              return true;
          }
      }
      if(SelectedProp?.UsedFrom=='ProjectManagement'){
        try{
          globalContextData?.portfolioCreationCallBack([dataToUpdate])
          globalContextData?.closeCompTaskPopup()
         }catch(e){
          console.error(e)
         }
      }
  }
  return false;
};
  const Call = (res: any, UpdatedData: any) => {
    if (res === "Close") {
        setIsComponent(false);
        setIsTask(false);
        setIsOpenActivity(false)
        setIsOpenWorkstream(false)
        setActivityPopup(false)
    } else if (res?.data && res?.data?.ItmesDelete != true && !UpdatedData) {
        childRef?.current?.setRowSelection({});
        setIsComponent(false);
        setIsTask(false);
        setIsOpenActivity(false)
        setIsOpenWorkstream(false)
        setActivityPopup(false)
        if (addedCreatedDataFromAWT(copyDtaArray, res.data)) {
            renderData = [];
            renderData = renderData.concat(copyDtaArray)
            refreshData();
        }
    } else if (res?.data?.ItmesDelete === true && res?.data?.Id && (res?.data?.siteName || res?.data?.siteType) && !UpdatedData) {
        setIsComponent(false);
        setIsTask(false);
        setIsOpenActivity(false)
        setIsOpenWorkstream(false)
        setActivityPopup(false)
        if (res?.data?.siteName) {
            copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteName);
        } else {
            copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteType);
        }
        renderData = [];
        renderData = renderData.concat(copyDtaArray)
        refreshData();
    } else if (res?.data?.ItmesDelete != true && res?.data?.Id && res?.data?.siteType && UpdatedData) {
        setIsComponent(false);
        setIsTask(false);
        setIsOpenActivity(false)
        setIsOpenWorkstream(false)
        setActivityPopup(false)
        if(res?.data?.PercentComplete!=0){
          res.data.PercentComplete=res?.data?.PercentComplete*100;
        }
        const updated = updatedDataDataFromPortfolios(copyDtaArray, res?.data);
        if (updated) {
            renderData = [];
            renderData = renderData.concat(copyDtaArray)
            refreshData();
        } else {
            console.log("Data with the specified PortfolioId was not found.");
        }

    }
   
}

  // new change////
  const CreateActivityPopup = (type: any) => {
    setActiveTile(type)
    if (checkedList?.TaskType === undefined) {
      SelectedProp.props.NoteCall = type;
      checkedList.NoteCall = type;
      // setIsOpenActivity(true);
    }
    if (checkedList?.TaskType?.Id == 1) {
      checkedList.NoteCall = type;
      //setIsOpenWorkstream(true);
    }
    if (checkedList?.TaskType?.Id == 3) {
      SelectedProp.props.NoteCall = type;
      checkedList.NoteCall = type;
      //setIsOpenActivity(true);
    }
    if (checkedList?.TaskType?.Id == 2) {
      alert("You can not create ny item inside Task");
    }
  };

  const Createbutton = () => {
    if (checkedList?.TaskType === undefined) {
      // SelectedProp.props.NoteCall = type;
      // checkedList.NoteCall = type;
     setIsOpenActivity(true);
     setActiveTile("")
    }
    if (checkedList?.TaskType?.Id == 1) {
      // checkedList.NoteCall = type;
      setIsOpenWorkstream(true);
      setActiveTile("")
    }
    if (checkedList?.TaskType?.Id == 3) {
      // SelectedProp.props.NoteCall = type;
      // checkedList.NoteCall = type;
    setIsOpenActivity(true);
    setActiveTile("")
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
      if (SelectedProp?.props?.PortfolioType?.Color != undefined) {
        setTimeout(() => {
          let targetDiv: any = document?.querySelector('.ms-Panel-main');
          if (targetDiv) {
            // Change the --SiteBlue variable for elements under the targetDiv
            targetDiv?.style?.setProperty('--SiteBlue', SelectedProp?.props?.PortfolioType?.Color); // Change the color to your desired value
          }
        }, 1000)
      }
    }
    if (checkedList?.TaskTypeId === 3 || checkedList?.TaskType?.Id === 3) {
      checkedList.NoteCall = "Task";
      // setIsOpenActivity(true);
        setIsOpenWorkstream(true);
          
      if (SelectedProp?.props?.PortfolioType?.Color != undefined) {
        setTimeout(() => {
          let targetDiv: any = document?.querySelector('.ms-Panel-main');
          if (targetDiv) {
            // Change the --SiteBlue variable for elements under the targetDiv
            targetDiv?.style?.setProperty('--SiteBlue', SelectedProp?.props?.PortfolioType?.Color); // Change the color to your desired value
          }
        }, 1000)
      }
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
    <myContextValue.Provider value={{ ...globalContextData,  tagProjectFromTable:TagProjectToStructure}}>
   
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
        <div className="container-fluid p-0">
          <section className="TableSection">
            <div className="container p-0">
              <div className="Alltable mt-2 ">
                <div className="col-sm-12 p-0 smart">
                  <div className="">
                    <div className="">
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
                      <GlobalCommanTable bulkEditIcon={true} priorityRank={priorityRank} precentComplete={precentComplete}
                      AllSitesTaskData={flatviewTasklist} masterTaskData={flatviewmastertask}
                        smartTimeTotalFunction={smartTimeTotal} SmartTimeIconShow={true}
                        portfolioTypeDataItemBackup={portfolioTypeDataItemBackup} taskTypeDataItemBackup={taskTypeDataItemBackup} flatViewDataAll={flatViewDataAll} setData={setData}
                        ref={childRef}
                        AddStructureFeature={
                          SelectedProp?.props?.Item_x0020_Type
                        }
                        clickFlatView={clickFlatView} switchFlatViewData={switchFlatViewData} flatView={true} switchGroupbyData={switchGroupbyData} updatedSmartFilterFlatView={false}
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
                        hideRestructureBtn={SelectedProp?.UsedFrom=='ProjectManagement'}
                        OpenAddStructureModal={OpenAddStructureModal}
                        addActivity={addActivity}
                        showFilterIcon={true} loadFilterTask={FilterAllTask}/>
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
        customWidth="620px"
        isOpen={ActivityPopup}
        onDismiss={closeActivity}
        isBlocking={false}
      >
        <div className="modal-body clearfix">
          <div className= "app component clearfix">
           <div id="portfolio" className="section-event pt-0">
                            {checkedList != undefined &&
                                checkedList?.TaskType?.Title == "Workstream" ? (
                                <div className="mt-2 clearfix">
                                    <label className="titleBorder full-width f-14"> Type</label>
                                    <div className="col p-0 taskcatgoryPannel">
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Bug")}  className={activeTile=="Bug"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Bug</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Feedback")}  className={activeTile=="Feedback"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Feedback</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Improvement")} className={activeTile=="Improvement"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Improvement</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Design")}  className={activeTile=="Design"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Design</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Task")}  className={activeTile=="Task"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Task</span>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 clearfix">
                                    <label className="titleBorder f-14 full-width">Type</label>
                                    <div className="col p-0 taskcatgoryPannel">
                                    <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Feedback")} className={activeTile=="Feedback"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Feedback</span>
                                        </a>
                                    <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Improvement")} className={activeTile=="Improvement"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Improvement</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={(e) => CreateActivityPopup("Implementation")} className={activeTile=="Implementation"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Implementation</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Development")} className={activeTile=="Development"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Development</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Activities")} className={activeTile=="Activities"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Activity</span>
                                        </a>
                                        <a id="subcategorytasks936" onClick={() => CreateActivityPopup("Task")}className={activeTile=="Task"?"active bg-siteColor subcategoryTask text-center":"bg-siteColor subcategoryTask text-center"}>
                                            <span className="tasks-label">Task</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
          </div>
          </div>
          <footer className="pull-right mt-3">
          <button
          type="button"
          className="btn btn-primary mx-2"
          onClick={() =>Createbutton()}
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
    </myContextValue.Provider>
  );
}
export default PortfolioTable;
export {myContextValue}
