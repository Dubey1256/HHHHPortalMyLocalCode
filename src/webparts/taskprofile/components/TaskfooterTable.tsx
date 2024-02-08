import * as React from 'react';
import * as $ from 'jquery';
import * as globalCommon from '../../../globalComponents/globalCommon';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup'
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import CreateActivity from '../../../globalComponents/CreateActivity';
import CreateWS from '../../../globalComponents/CreateWS';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import Loader from "react-loader";
import * as moment from 'moment';
import { SlArrowRight } from "react-icons/sl";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import {
  FaChevronRight,
  FaChevronDown,
  FaSortDown,
  FaSortUp,
  FaSort,
  FaCompressArrowsAlt,
} from "react-icons/fa";
import {
  Column,
  Table,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import PortfolioStructureCreationCard from '../../../globalComponents/tableControls/PortfolioStructureCreation';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web, sp } from 'sp-pnp-js';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';

import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import ReactPopperTooltip from '../../../globalComponents/Hierarchy-Popper-tooltip';
import BulkeditTask from './BulkeditTask';
var AllTasks: any = [];
let AllTasksRendar: any = [];
let siteConfig: any = [];
var IsUpdated: any = '';
var MeetingItems: any = []
let AllWSTasks = [];
let allworkstreamTasks: any = []
var filter: any = '';
var Array: any = []
let taskUsers: any = [];
let IsShowRestru: any = false;
let componentDetails: any = '';
let siteIconAllTask: any = [];
let finalData: any = [];
let childRefdata: any;
let TasksItem: any = [];
let AllTasksData: any = [];
let BulkTaskUpdate: any[] = [];
let smartmetaDetailsall:any[] = [];
function IndeterminateCheckbox(
  {
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
      className={className + "cursor-pointer form-check-input me-1 "}
      {...rest}
    />
  );
}
function Filter({
  column,
  table,
  placeholder
}: {
  column: Column<any, any>;
  table: Table<any>;
  placeholder: any
}): any {
  const columnFilterValue = column.getFilterValue();

  return (
    <input style={{ width: "100%" }} className="me-1 mb-1 mt-1 on-search-cross form-control "

      title={placeholder?.placeholder}
      type="search"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`${placeholder?.placeholder}`}

    />
  );
}
function TasksTable(props: any) {
  const childRef = React.useRef<any>();
  if (childRef != null) {
    childRefdata = { ...childRef };

  }
  const [loaded, setLoaded] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [data, setData] = React.useState([]);
  finalData = data;
  const refreshData = () => setData(() => finalData);
  const [checkedList, setCheckedList]: any = React.useState([]);
  const [AllUsers, setTaskUser] = React.useState([]);
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState('');
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [AllClientCategory, setAllClientCategory] = React.useState([])
  const [count, setCount] = React.useState(0);
  const [AllMasterTasksData, setAllMasterTasksData] = React.useState(props?.AllSiteTasksAndMaster)
  const [ActivityDisable, setActivityDisable] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const [maidataBackup, setmaidataBackup] = React.useState([])
  const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
  const [MeetingPopup, setMeetingPopup] = React.useState(false);
  const [WSPopup, setWSPopup] = React.useState(false);

  const [NewArrayBackup, setNewArrayBackup] = React.useState([]);
  const [ResturuningOpen, setResturuningOpen] = React.useState(false);
  const [topTaskresIcon, setTopTaskresIcon] = React.useState(false);
  const [tasksRestruct, setTasksRestruct] = React.useState(false);
  const [smartmetaDetails, setsmartmetaDetails] = React.useState([]);
  const [checkData, setcheckData]: any = React.useState(null)
  const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
  // IsUpdated = props.props.Portfolio_x0020_Type;
  IsUpdated = props.props.PortfolioType;


  const GetSmartmetadata = async () => {

    //  var metadatItem: any = []
    let smartmetaDetails: any = [];
    let AllSiteName: any = [];
    var select: any = 'Id,Title,IsVisible,ParentID,SmartSuggestions,Configurations,Color_x0020_Tag,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent'
    smartmetaDetails = await globalCommon.getData(props?.AllListId?.siteUrl, props?.AllListId?.SmartMetadataListID, select);
    setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
    console.log(smartmetaDetails);
    smartmetaDetailsall = smartmetaDetails;
    setsmartmetaDetails(smartmetaDetails)

    smartmetaDetails.forEach((newtest: any) => {
      newtest.Id = newtest.ID;
      if (newtest.TaxType == 'Sites' && newtest.Title != 'Master Tasks' && newtest.Title != 'SDC Sites') {
        siteConfig.push(newtest)
      }
      if (newtest.TaxType == 'Sites' && newtest.Item_x005F_x0020_Cover != undefined) {
        siteIconAllTask.push(newtest)

      }
    });

    // var filter: any = '';
    if (props?.props?.TaskType != undefined && props?.props?.TaskType?.Title === 'Activities') {
      filter += '(ParentTask/Id eq ' + props.props.Id + ' ) or '
      loadWSTasks(props.props);
    }
    else if (props?.props?.TaskType != undefined && props?.props?.TaskType?.Title === 'Workstream') {
      filter += '(ParentTask/Id eq ' + props.props.Id + ' )'
      loadActivityTasks(props.props);

    }
  }


  const loadActivityTasks = async (task: any) => {
    let activity: any = [];
    var select = "TaskLevel,ParentTask/Title,ParentTask/Id,ClientTime,TaskLevel,ItemRank,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Portfolio,TaskType,AssignedTo,ClientCategory,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories&$filter=Id eq " + task.ParentTask.Id + ""
    activity = await globalCommon.getData(props?.AllListId?.siteUrl, task.listId, select)
    if (activity?.length > 0)
      GetComponents(activity[0])
    LoadAllSiteTasks(filter);
  }
  const loadWSTasks = async (task: any) => {
    var select = "TaskLevel,ParentTask/Title,ParentTask/Id,ClientTime,TaskLevel,ItemRank,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Portfolio,TaskType,AssignedTo,ClientCategory,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories&$filter=ParentTask/Id eq " + task.Id + ""
    // var select = "TaskLevel,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,TaskLevel,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Component/Id,Component/Title,Component/Item_x0020_Type, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,TaskType,AssignedTo,Component,ClientCategory,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories&$filter=ParentTask/Id eq " + task.Id + ""
    AllWSTasks = await globalCommon.getData(props?.AllListId?.siteUrl, task.listId, select)
    if (AllWSTasks?.length === 0)
      filter += '(ParentTask/Id eq ' + props.props.Id + ' )'
    AllWSTasks.forEach((obj: any, index: any) => {
      if ((AllWSTasks?.length - 1) === index)
        filter += '(ParentTask/Id eq ' + obj.Id + ' )'
      else filter += '(ParentTask/Id eq ' + obj.Id + ' ) or '

    })
    LoadAllSiteTasks(filter);
    console.log(AllWSTasks);
  }
  var Response: any = []
  const getTaskUsers = async () => {
    let web = new Web(props?.AllListId?.siteUrl);
    await web.lists
      .getById(props?.AllListId?.TaskUsertListID)
      .items
      .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,IsApprovalMail,CategoriesItemsJson,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover, ItemType,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
      .get().then((Response: any) => {
        setTaskUser(Response);
        console.log(Response);
        taskUsers = Response
      })



  }
// Loadsmarttime

const SmartTimeData = async <T extends { siteType: string; Id: number }>(items: any): Promise<number> => {
  let FinalTotalTime: number = 0;
  let AllTimeSpentDetails: any[] = [];
  let filteres: string;
  let TimeSheetlistId: any;
  let siteUrl: any;
  let listName: any;

  // Get the list Name
  let TimesheetConfiguration: any[] = [];
  if (smartmetaDetailsall.length > 0) {
    smartmetaDetailsall.forEach((itemss: any) => {
      if (itemss.Title == items.siteType && itemss.TaxType == 'Sites') {
        TimesheetConfiguration = JSON.parse(itemss.Configurations);
      }
    });

    TimesheetConfiguration?.forEach((val: any) => {
      TimeSheetlistId = val.TimesheetListId;
      siteUrl = val.siteUrl;
      listName = val.TimesheetListName;
    });
  }

  if (items.siteType === "Offshore Tasks") {
    const siteType = "OffshoreTasks";
    filteres = `Task${siteType}/Id eq ${items.Id}`;
  } else {
    filteres = `Task${items.siteType}/Id eq ${items.Id}`;
  }

  const select =
    "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,Author/Id,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres;

  let count = 0;
  let allurls: { Url: string }[] = [];

  if (items.siteType === "Migration" || items.siteType === "ALAKDigital") {
    allurls = [
      {
        Url:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select,
      },
    ];
  } else if (items.siteType === "SH") {
    allurls = [
      { Url: `${items.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select=${select}` },
    ];
  } else {
    if (listName !== undefined) {
      allurls = [
        { Url: `${items.siteUrl}/_api/web/lists/getbyTitle('${listName}')/items?$select=${select}` },
      ];
    }
  }

  for (const item of allurls) {
    try {
      const response = await $.ajax({
        url: item.Url,
        method: "GET",
        headers: {
          Accept: "application/json; odata=verbose",
        },
      });

      count++;
      let tempArray: any[] = [];

      if (response.d.results !== undefined && response.d.results.length > 0) {
        AllTimeSpentDetails = AllTimeSpentDetails.concat(response.d.results);

        AllTimeSpentDetails.forEach((item: any) => {
          if (item.AdditionalTimeEntry !== null) {
            const data = JSON.parse(item.AdditionalTimeEntry);

            if (data !== undefined && data.length > 0) {
              data.forEach((timeData: any) => {
                tempArray.push(timeData);
              });
            }
          }
        });
      }

      let TotalTimeData: number = 0;

      if (tempArray.length > 0) {
        tempArray.forEach((tempItem: any) => {
          if (typeof tempItem.TaskTimeInMin === "string") {
            const timeValue = Number(tempItem.TaskTimeInMin);

            if (timeValue > 0) {
              TotalTimeData += timeValue;
            }
          } else {
            if (tempItem.TaskTimeInMin > 0) {
              TotalTimeData += tempItem.TaskTimeInMin;
            }
          }
        });
      }

      if (TotalTimeData > 0) {
        FinalTotalTime = TotalTimeData / 60;
      }
    } catch (error) {
      // console.error("Error:", error);
    }
  }

  // console.log(FinalTotalTime);
  return FinalTotalTime;
  refreshData();
};

// Loadsmarttimeend
  const GetIconImageUrl = (siteType: any, siteUrl: any, undefined: any) => {
    let siteIcon = '';
    siteIconAllTask?.map((items: any) => {
      if (items?.Title == siteType) {
        siteIcon = items?.Item_x005F_x0020_Cover?.Url
        // return siteIcon;
      }
    })
    return siteIcon;
  }


  const LoadAllSiteTasks = async function (filter: any) {
    AllTasksData = [];
    let Counter = 0;
    if (siteConfig != undefined && siteConfig?.length > 0) {
      const batch = sp.createBatch();
      for (let i = 0; i < siteConfig?.length; i++) {
        const config = siteConfig[i];
        var select = "TaskLevel,ParentTask/Title,ParentTask/Id,ClientTime,PriorityRank,SiteCompositionSettings,TaskLevel,ItemRank,Project/Id,Project/PortfolioStructureID, Project/Title,Project/PriorityRank,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Project,Portfolio,TaskType,AssignedTo,ClientCategory,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories&$filter=" + filter + ""

        const web = new Web(props?.AllListId?.siteUrl);
        const list = web.lists.getById(config.listId);
        list.items
          .inBatch(batch)
          .select(select).orderBy("orderby", false)
          .getAll(4000)

          .then((AllTasksMatches) => {
            console.log(AllTasksMatches);
            Counter++;
            console.log(AllTasksMatches?.length);
            if (AllTasksMatches != undefined) {
              if (AllTasksMatches?.length > 0) {
                $.each(AllTasksMatches, function (index: any, item: any) {
                  item.isDrafted = false;
                  item.flag = true;
                  item.TitleNew = item.Title;
                  item.siteType = config.Title;
                  item.childs = [];
                  item.listId = config.listId;
                  item.siteUrl = props?.AllListId?.siteUrl;
                  item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  item.fontColorTask = "#000";
                  item.SmartPriority;
                  item.TaskTypeValue = '';
                  item.projectPriorityOnHover = '';
                  item.taskPriorityOnHover = item?.PriorityRank;
                  item.showFormulaOnHover;

                });
              }
              AllTasks = AllTasks.concat(AllTasksMatches);
              AllTasksData = AllTasksData.concat(AllTasksMatches);
              AllTasks = $.grep(AllTasks, function (type: any) {
                return type.isDrafted == false;
              });
              if (Counter == siteConfig?.length) {
                $.map(AllTasks, (result: any) => {
                  result.Id = result.Id != undefined ? result.Id : result.ID;
                  result.TeamLeaderUser = [];
                  result.AllTeamName =
                    result.AllTeamName === undefined ? "" : result.AllTeamName;
                  result.chekbox = false;
                  result.descriptionsSearch = '';
                  result.commentsSearch = "";
                  // result.DueDate = moment(result.DueDate).format("DD/MM/YYYY");
                  result.DisplayDueDate = moment(result.DueDate).format("DD/MM/YYYY");
                  result.DisplayCreateDate = moment(result.Created).format("DD/MM/YYYY");
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
                  result.SmartPriority = globalCommon.calculateSmartPriority(result);
                
                  result.PercentComplete = (
                    result.PercentComplete * 100
                  ).toFixed(0);
                  result.chekbox = false;
                  if (result?.FeedBack != undefined) {
                    let DiscriptionSearchData: any = '';
                    let feedbackdata: any = JSON.parse(result?.FeedBack)
                    DiscriptionSearchData = feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
                      const childText = child?.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '');
                      const subtextText = (child?.Subtext || [])?.map((elem: any) =>
                        elem.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '')
                      ).join('');
                      return childText + subtextText;
                    }).join('');
                    result.descriptionsSearch = DiscriptionSearchData
                  }

                  if (result?.Comments != null) {
                    result.commentsSearch = result?.Comments?.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, "");
                  }
                  if (
                    result.AssignedTo != undefined &&
                    result?.AssignedTo?.length > 0
                  ) {
                    $.map(result.AssignedTo, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        $.map(taskUsers, (users: any) => {
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
                    result?.ResponsibleTeam?.length > 0
                  ) {
                    $.map(result?.ResponsibleTeam, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        $.map(taskUsers, (users: any) => {
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
                    result.TeamMembers?.length > 0
                  ) {
                    $.map(result.TeamMembers, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        $.map(taskUsers, (users: any) => {
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
                    result.projectStructerId =
                      result?.Project?.PortfolioStructureID;
                    const title = result?.Project?.Title || "";
                    const dueDate = moment(new Date(result?.DueDate)).format(
                      "DD/MM/YYYY"
                  );
                    result.joinedData = [];
                    if (title) result.joinedData.push(`Title: ${title}`);
                    if (dueDate) result.joinedData.push(`Due Date: ${dueDate}`);
                  }
                  result["Item_x0020_Type"] = "Task";
                })
                let allParentTasks = $.grep(AllTasks, function (type: any) { return (type.ParentTask != undefined && type.ParentTask.Id === props.props.Id && type?.siteType == props?.props?.siteType) && (type.TaskType != undefined && type.TaskType.Title != 'Workstream') });
                if (props?.props?.TaskType != undefined && props.props.TaskType != undefined && props.props.TaskType?.Title === 'Activities')
                  allworkstreamTasks = $.grep(AllTasks, function (task: any) { return (task.TaskType != undefined && task?.TaskType?.Title === 'Workstream' && task?.siteType == props?.props?.siteType) });

                if (allworkstreamTasks != undefined && allworkstreamTasks?.length > 0) {
                  allworkstreamTasks.forEach((obj: any) => {
                    SmartTimeData(obj)
                    .then((returnresult) => {
                      obj.smartTime = String(returnresult)
                      // console.log("Final Total Time:", returnresult);
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });
                    if (obj.Id != undefined) {
                      AllTasks.forEach((task: any) => {
                        if (task?.ParentTask != undefined && obj?.Id === task?.ParentTask?.Id && task?.siteType == props?.props?.siteType) {
                          obj.subRows = obj?.subRows != undefined ? obj?.subRows : []
                          SmartTimeData(task)
                          .then((returnresult) => {
                            task.smartTime = String(returnresult)
                            // console.log("Final Total Time:", returnresult);
                          })
                          .catch((error) => {
                            console.error("Error:", error);
                          });
                          obj.subRows.push(task)
                        }

                      })
                    }
                    obj.Restructuring = IsUpdated != undefined && IsUpdated == 'Service' ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    obj.childsLength = obj?.childs != undefined && obj?.childs?.length > 0 ? obj?.childs?.length : 0;
                    obj.subRowsLength = obj?.subRows != undefined && obj?.subRows?.length > 0 ? obj.subRows?.length : 0;
                  })
                }

                var temp: any = {};

                temp.flag = true;
                temp.show = true;
                temp.PercentComplete = '';

                temp.ItemRank = '';
                temp.DueDate = '';
                if (allworkstreamTasks === undefined)
                  allworkstreamTasks = [];
                if (allParentTasks.length > 0)
                  allParentTasks?.map((items) => {
                    allworkstreamTasks.push(items);
                  })

                setData(allworkstreamTasks);
                setmaidataBackup(allworkstreamTasks)

              }
            }
          });
      }
    }
  };

  const GetComponents = async (Item: any) => {
    // var filt = "Id eq " + Item?.Portfolio?.Id + "";
    let web = new Web(props?.AllListId?.siteUrl);
    let compo = [];
    compo = await web.lists
      .getById(props?.AllListId?.MasterTaskListID)
      .items
      .select("ID", "Id", "Title", "Mileage", "PortfolioType/Id", "PortfolioType/Title", "PortfolioType/Color", "Item_x0020_Type",
      ).expand('PortfolioType')

      // .top(4999)
      // .filter(filt)
      .getAll()
    compo?.map((items: any) => {
      items.SmartPriority;
    })
    componentDetails = compo?.filter((items: any) => {
      items.Id == Item?.Portfolio?.Id
    })
    setAllMasterTasksData(compo)
    IsUpdated = componentDetails[0]?.PortfoliType?.Title;


    console.log(componentDetails);
  }
  React.useEffect(() => {

    getTaskUsers();

    if (props.props.Portfolio != undefined)
      GetComponents(props.props)

    GetSmartmetadata();

  }, []);


  const EditItemTaskPopup = (item: any) => {

    setIsTask(true);
    setSharewebTask(item);
  }
  const EditData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  }

  //=================== callback function to all the poup handle ================
  const Call = React.useCallback((childItem: any) => {
    
    AllTasksRendar = [];
    setIsTask(false);
    setRowSelection({});
    setMeetingPopup(false);
    setWSPopup(false);
    if (childItem !== "Close") {
      MeetingItems = []
    }
    var MainId: any = ''
    let ParentTaskId: any;
    if (childItem != null && childItem.data?.ItmesDelete == null && childItem?.[0]?.NewBulkUpdate == null) {
     
      childItem.data['flag'] = true;
      childItem.data['TaskType'] = { Title: 'Workstream' };
    
      if (childItem.data.PortfolioId != null) {
        MainId = childItem.data.PortfolioId;
      }
    
      if (childItem.data.ParentTaskId != null && childItem.data.ParentTaskId !== "") {
        ParentTaskId = childItem.data.ParentTaskId;
      }
    
      // ==========create ws and task========================
      let grouping = true;
    
      if (childItem.data?.editpopup == null && childItem.data?.ItmesDelete == null) {
     
        finalData?.forEach((elem: any) => {
          if (elem?.Id === ParentTaskId || elem.ID === ParentTaskId) {
            elem.subRows = elem.subRows ?? [];
            elem.subRows.push(childItem.data);
            grouping = false;
          }
        });
    
        if (grouping) {
          AllTasksRendar?.push(childItem.data);
          finalData = finalData.concat(AllTasksRendar);
        } else {
          AllTasksRendar = AllTasksRendar?.concat(finalData);
          finalData = [];
          finalData = finalData?.concat(AllTasksRendar);
        }
      }
    
      //============ update the data to Edit task popup==================
      if (childItem.data?.editpopup != null && childItem.data?.editpopup == true && childItem.data?.ItmesDelete == null) {
        
        finalData?.forEach((ele: any, index: any) => {

          if (ele.subRows != null && ele.subRows?.length > 0) {
            ele.subRows?.forEach((sub: any, subindex: any) => {
              if (sub.Id == childItem.data.Id) {
                // Update the data without removing existing subRows
                finalData[index].subRows[subindex] = { ...sub, ...childItem.data };
              }
            });
          }
          if (ele.Id == childItem.data.Id) {
            // Update the data without removing existing data
           
            finalData[index] = { ...ele, ...childItem.data };
          }
        });
    
        AllTasksRendar = AllTasksRendar?.concat(finalData);
        finalData = [];
        finalData = finalData?.concat(AllTasksRendar);
      }
    
      console.log(finalData);
      refreshData();
    }
    
    // ===============Delete the data to Edit task popup====================

    if (childItem?.data?.ItmesDelete == true) {
      finalData?.map((ele: any, index: any) => {
        if (ele.subRows != undefined && ele.subRows?.length > 0) {
          ele.subRows?.map((sub: any, subindex: any) => {
            if (sub.Id == childItem.data.Id) {
              finalData[index].subRows.splice(subindex, 1);
            }
          })
        }
        if (ele.Id == childItem.data.Id) {
          finalData.splice(index, 1);
        }
      })
      AllTasksRendar = AllTasksRendar?.concat(finalData)
      finalData = [];
      finalData = finalData?.concat(AllTasksRendar)
      console.log(finalData)
      refreshData();
    }
    //====================Update Table Value===========================
    if (childItem != undefined && childItem[0].NewBulkUpdate == true) {
      childItem.map((childelem: any) => {
        finalData?.map((elem: any) => {
          if (elem?.Id === childelem?.Id || elem.ID === childelem?.Id) {
            if (childelem?.NewDueDate != '') {
              elem.DueDate = childelem?.NewDueDate
        
            }
            if (childelem?.NewStatus != '') {
              elem.PercentComplete = childelem?.NewStatus
            }
            if (childelem?.NewItemRank != '') {
              elem.ItemRank = childelem?.NewItemRank
            }

          }
        })
      })
      AllTasksRendar = AllTasksRendar?.concat(finalData)
      finalData = [];
      finalData = finalData?.concat(AllTasksRendar)
      console.log(finalData)
      refreshData();
    }
  }, []);

  const TimeEntryCallBack = React.useCallback((item1: any) => {
    setIsTimeEntry(false);
  }, []);
  let isOpenPopup = false;
  const CloseCall = React.useCallback((item: any) => {
    if (!isOpenPopup && item.CreatedItem != undefined) {
      item.CreatedItem.forEach((obj: any) => {
        obj.data.childs = [];
        obj.data.flag = true;
        obj.data.TitleNew = obj.data.Title;
        // obj.data.TeamMembers=item.TeamMembersIds;
        // obj.AssignedTo =item.AssignedIds;
        obj.data.siteType = "Master Tasks";
        obj.data['TaskID'] = obj.data.PortfolioStructureID;
        if (item.props != undefined && item.props.SelectedItem != undefined && item.props.SelectedItem.childs != undefined) {
          item.props.SelectedItem.childs = item.props.SelectedItem.childs == undefined ? [] : item.props.SelectedItem.childs;
          item.props.SelectedItem.childs.unshift(obj.data);
        }

      })

    }
    if (!isOpenPopup && item.data != undefined) {
      item.data.childs = [];
      item.data.flag = true;
      item.data.TitleNew = item.data.Title;
      item.data.siteType = "Master Tasks"
      item.data.childsLength = 0;
      // item.data['TaskID'] = item.data.PortfolioStructureID;
      // ComponentsData.unshift(item.data);
      // setData((data) => [...ComponentsData]);
    }
    setAddModalOpen(false)
  }, []);



  function clearreacture() {
    AllTasksRendar = [];
    data.forEach((obj: any) => {
      obj.isRestructureActive = false;
      if (obj.childs != undefined && obj.childs?.length > 0) {
        obj.childs.forEach((sub: any) => {
          obj.isRestructureActive = false;
          if (sub.childs != undefined && sub.childs?.length > 0) {
            sub.childs.forEach((subchild: any) => {
              obj.isRestructureActive = false;
            })
          }

        })
      }


    })

    setTopTaskresIcon(false);
    AllTasksRendar = AllTasksRendar?.concat(data)
    finalData = [];
    finalData = finalData?.concat(AllTasksRendar);
    refreshData();

  }

  const CreateOpenCall = React.useCallback((item: any) => {
    isOpenPopup = true;
    item.data.childs = [];
    item.data.flag = true;
    item.data.siteType = "Master Tasks"
    item.data.TitleNew = item.data.Title;
    item.data.childsLength = 0;
    item.data['TaskID'] = item.data.PortfolioStructureID;
    if (checkedList != undefined && checkedList?.length > 0)
      checkedList[0].childs.unshift(item.data);
    // else ComponentsData.unshift(item.data);

    // setSharewebComponent(item.data)
    // setIsComponent(true);
    // setData((data) => [...ComponentsData]);
    // setSharewebComponent(item);
  }, []);

  const columns = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: true,
        hasExpanded: true,
        size: 55,
        id: 'Id',
      },
      {
        accessorKey: "",
        placeholder: "",
        id: 'icons',
        size: 90,
        cell: ({ row, getValue }) => (
          <div>
            {row?.original?.SiteIcon != undefined &&
              <a className="hreflink" title="Show All Child" data-toggle="modal">
                <img className={row?.original?.TaskType?.Title === "Workstream"?"icon-sites-img ml20 me-1":row?.original?.TaskType?.Title === "Task"?"ml-12 workmember ml20 me-1":""} src={row?.original?.SiteIcon}></img>
              </a>
            }
            {getValue()}
          </div>
        ),
      },
      {
        accessorKey: "TaskID",
        placeholder: "ID",
        id: 'TaskID',
        size: 145,
        cell: ({ row, getValue }) => (
          <div>
            {row?.original?.TitleNew != "Tasks" ?
              <span className="d-flex hreflink">
                <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={props?.AllMasterTasks} AllSitesTaskData={props?.AllSiteTasks} AllListId={props.AllListId} />
              </span>
              : ''}
          </div>
        ),
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
          <span className='columnFixedTitle'>
            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== 'Others' && <a data-interception="off" target="_blank" className="hreflink text-content serviceColor_Active"
              href={props?.AllListId?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID}
            >
              <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
            </a>}
            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== 'Others' &&
              <a className="hreflink text-content serviceColor_Active" target="_blank" data-interception="off"
                href={props?.AllListId?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType}
              >
                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
              </a>}
            {row?.original.TitleNew === "Tasks" ? (
              <span>{row?.original.TitleNew}</span>
            ) : (
              ""
            )}
            </span>
            {row?.original?.Categories?.includes("Draft")?
              <FaCompressArrowsAlt style={{ height: '11px', width: '20px' }} /> : ''}
            {row?.original?.subRows?.length > 0 ?
              <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
            {row?.original?.descriptionsSearch != '' && <InfoIconsToolTip className="alignIcon"
              Discription={row?.original?.descriptionsSearch}
              row={row?.original}
            />}
          </>
        ),
        id: "Title",
        placeholder: "Title",
        header: "",
      },
      {
        accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
        cell: ({ row }) => (
          <>
            {row?.original?.ProjectTitle != (null || undefined) ?
              <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${props?.AllListId.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`} >
                <ReactPopperTooltip ShareWebId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={props?.AllListId} /></a></span>
              : ""}
          </>
        ),
        id: 'ProjectTitle',
        placeholder: "Project",
        resetColumnFilters: false,
        header: "",
        size: 70,
      },
      {
        accessorFn: (row) => row?.ClientCategory?.map((elem: any) => elem.Title).join("-"),
        cell: ({ row }) => (
          <>
            <ShowClintCatogory clintData={row?.original} AllMetadata={smartmetaDetails} />

          </>
        ),
        id: 'ClientCategory',
        placeholder: "Client Category",
        header: "",
        size: 120,
      },
      {
        accessorFn: (row) => row?.TeamLeaderUser?.map((val: any) => val.Title).join("-"),
        cell: ({ row }) => (
          <div>
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} />
          </div>
        ),
        id: 'TeamLeaderUser',
        placeholder: "Team",
        header: "",
        size: 100,
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "Status",
        header: "",
        size: 42,
      },
      {
        accessorKey: "ItemRank",
        placeholder: "Item Rank",
        header: "",
        size: 42,
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
      // {
      //   accessorKey: "DueDate",
      //   placeholder: "DueDate",
      //   header: "",
      //   size: 120,
      // },
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
                      href={`${props?.AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
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
        size: 129
      },
      {
        accessorFn: (row) => row?.smartTime,
        cell: ({ row }) => (
          <span> {row?.original?.smartTime}</span>
        ),
        id: "smartTime",
        placeholder: "Smart Time",
        header: "",
        resetColumnFilters: false,
        size: 49,
      },
      {
        cell: ({ row, getValue }) => (
          <>

            <a onClick={(e) => EditData(e, row?.original)} >
              <span title='Time' className="svg__iconbox svg__icon--clock mt-1"></span>
            </a>

            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 2,
      },



      {
        header: ({ table }: any) => (
          <>{
            topCompoIcon ?
              <span
                // style={{ backgroundColor: `${portfolioColor}` }}
                title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => trueTopIcon(true)}>
                <span className="svg__iconbox svg__icon--re-structure"></span>
              </span>
              : ''
          }
          </>
        ),
        cell: ({ row, getValue }) => (
          <>
            <a className='d-flex'>
              {row?.original?.isRestructureActive && (
                <span className="Dyicons p-1" title="Restructure" style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} onClick={() => callChildFunction(row?.original)}>
                  <span className="svg__iconbox svg__icon--re-structure"></span>
                </span>)}


              <span title='Edit' onClick={(e) => EditItemTaskPopup(row?.original)} className="ml-auto svg__iconbox svg__icon--edit"></span>

            </a>
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 2,
      },

    ],
    [data]
  );
  const table: any = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      expanded,
      sorting,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    filterFromLeafRows: true,
    enableSubRowSelection: false,
    filterFns: undefined
  });





  const RestruringCloseCall = () => {
    setResturuningOpen(false);
    setTasksRestruct(false);
    clearreacture();
  };

  // function structuredClone(obj: any): any {

  //   return JSON.parse(JSON.stringify(obj));

  // }

  const openActivity = () => {
    let data2 = props?.props
    // if (MeetingItems.length === 0) {
    //   MeetingItems.push(checkData);
    // }
    // let data2: any = structuredClone(props?.props)
    if (checkData != undefined && checkData != null && checkData?.TaskType != null) {
      if (checkData?.TaskType?.Title == 'Workstream') {
        checkData['NoteCall'] = 'Task'
        console.log(MeetingItems[MeetingItems?.length - 1])
        if (MeetingItems[MeetingItems?.length - 1]?.ClientTime?.length > 0 && MeetingItems[MeetingItems?.length - 1].ClientTime != undefined) {
          // MeetingItems[MeetingItems?.length - 1].ClientTime = JSON.parse(MeetingItems[MeetingItems?.length - 1]?.ClientTime)
          MeetingItems[MeetingItems?.length - 1].ClientTime = MeetingItems[MeetingItems?.length - 1]?.ClientTime
        }

        // setMeetingPopup(true)
        setWSPopup(true)
      }
    }
    else {
      if (props?.props?.TaskType?.Title == 'Workstream') {
        props.props['NoteCall'] = 'Task'
        MeetingItems.push(props.props)
        // setMeetingPopup(true)
        setWSPopup(true)
      }
      if (props?.props?.TaskType?.Title == 'Activities') {
        let parentcat: any = [];

        if (data2?.ClientTime != null && data2?.ClientTime != undefined) {
          if (typeof data2?.ClientTime == "object") {
            data2.ClientTime = JSON.stringify(data2?.ClientTime);
          }

        } else {
          data2.ClientTime = null
        }

        MeetingItems.push(data2)
        setWSPopup(true)



      }
    }

  }



  const findUserByName = (Id: any) => {
    const user: any = AllUsers.filter((user: any) => user?.AssingedToUser?.Id == Id);
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else {
      Image =
        "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }
    return user ? Image : null;
  };


  React.useEffect(() => {
    CheckDataPrepre()
  }, [table?.getSelectedRowModel()?.flatRows?.length])

  const CheckDataPrepre = () => {
    if (table?.getSelectedRowModel()?.flatRows?.length) {
      let eTarget = false;
      let itrm: any;
      if (table?.getSelectedRowModel()?.flatRows?.length > 0) {
        table?.getSelectedRowModel()?.flatRows?.map((value: any) => {
          value.original.Id = value.original.ID
          itrm = value.original;
          if (value?.getCanSelect() == true) {
            eTarget = true
          } else {
            eTarget = false
          }
        });
      }

    } else {

      setcheckData(null)

    }

  }
  React.useEffect(() => {
    if (table.getState().columnFilters?.length) {
      setExpanded(true);
    } else {
      setExpanded({});
    }
  }, [table.getState().columnFilters]);
  const callBackData = React.useCallback((checkData: any) => {
    let array: any = [];
    BulkTaskUpdate = []
    if (checkData != undefined || checkData?.length > 0) {
      checkData.map((item: any) => {
        BulkTaskUpdate.push(item.original);
        BulkTaskUpdate.map((taskitem: any) => {
          if (taskitem?.TaskType == undefined) {
            setActivityDisable(false)
            taskitem['siteUrl'] = props?.AllListId?.siteUrl;
            taskitem['listName'] = 'Master Tasks';
            MeetingItems.push(taskitem)
            //setMeetingItems(itrm);

          }
          if (taskitem.TaskType != undefined) {
            if (taskitem.TaskType?.Title == 'Activities' || taskitem.TaskType?.Title == "Workstream") {
              setActivityDisable(false)
              // Arrays.push(itrm)
              taskitem['PortfolioId'] = props?.Id;
              MeetingItems.push(taskitem)
              setCount(count + 2)
            }
            if (taskitem.TaskType?.Title == 'Task') {
              setActivityDisable(true)
              MeetingItems.push(taskitem)

            }
          }
        })
      })
      setcheckData(checkData[0]?.original);
      array.push(checkData[0]?.original);

    } else {
      setcheckData({});
      array = [];
      BulkTaskUpdate = []
    }
    // setCheckedList1(array);
  }, []);
  const callBackData1 = React.useCallback((getData: any, topCompoIcon: any ,checkSelectionItem:any) => {
    if (getData != undefined && getData?.length > 0 && checkSelectionItem != false) {
      setTopCompoIcon(topCompoIcon);
      finalData = [];
      finalData = finalData?.concat(getData)
      console.log(finalData)
      refreshData();
      }
 
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

  return (

    <div
    // className={IsUpdated === 'Events' ? 'app component eventpannelorange' : (IsUpdated == 'Service' ? 'app component serviepannelgreena' : 'app component')}
    >
      <div className="Alltable mt-10">
        <div className="col-sm-12 pad0 smart tableheight" >
            <div className={`${data?.length > 10 ? "wrapper" : "MinHeight tableheight"}`}>
              <div> <BulkeditTask SelectedTask={BulkTaskUpdate} Call={Call}></BulkeditTask></div>

              <GlobalCommanTable
              AllSitesTaskData={props?.AllSiteTasks} masterTaskData={props?.AllMasterTasks}
                queryItems={props?.props}
                SmartTimeIconShow={true}
                ref={childRef}
                callChildFunction={callChildFunction}
                AllListId={props?.AllListId}
                columns={columns}
                restructureCallBack={callBackData1}
                data={data}
                callBackData={callBackData}
                TaskUsers={AllUsers}
                showHeader={true}
                AllMasterTasksData={AllMasterTasksData}
                // portfolioColor={portfolioColor} 
                // portfolioTypeData={portfolioTypeDataItem}
                //  taskTypeDataItem={taskTypeDataItem} 
                // portfolioTypeConfrigration={portfolioTypeConfrigration } 
                showingAllPortFolioCount={false}
                showCreationAllButton={true}
                AddWorkstreamTask={openActivity}
                taskProfile={true}
                expandIcon={true}
                multiSelect={true}
              />
            </div>

      
        </div>
      </div>


      {IsTask && <EditTaskPopup Items={SharewebTask} Call={Call} AllListId={props.AllListId} context={props.Context} pageName={"TaskFooterTable"}></EditTaskPopup>}
      {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack} AllListId={props.AllListId} TimeEntryPopup Context={props.Context}></TimeEntryPopup>}
      {MeetingPopup &&
        <CreateActivity
          portfolioTypeData={props.props.PortfolioType}
          selectedItem={MeetingItems[MeetingItems.length - 1]}
          Call={Call}
          TaskUsers={AllUsers}
          AllClientCategory={AllClientCategory}
          LoadAllSiteTasks={LoadAllSiteTasks}
          AllListId={props.AllListId}
          context={props.Context}>

        </CreateActivity>}
      {WSPopup && <CreateWS
        portfolioTypeData={props.props.PortfolioType}
        selectedItem={MeetingItems[MeetingItems.length - 1]}
        Call={Call}
        data={data}
        TaskUsers={AllUsers}
        AllListId={props.AllListId}
        context={props.Context}
      ></CreateWS>}
      {addModalOpen && <Panel headerText={` Create Component `} type={PanelType.medium} isOpen={addModalOpen} isBlocking={false} onDismiss={CloseCall}>
        <PortfolioStructureCreationCard CreatOpen={CreateOpenCall} Close={CloseCall} PortfolioType={IsUpdated} PropsValue={props} SelectedItem={checkedList != null && checkedList.length > 0 ? checkedList[0] : props} />
      </Panel>
      }
    </div>
  )

}
export default TasksTable;