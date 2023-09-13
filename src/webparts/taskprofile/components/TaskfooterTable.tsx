import * as React from 'react';
import * as $ from 'jquery';
import * as globalCommon from '../../../globalComponents/globalCommon';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup'
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import CreateActivity from '../../servicePortfolio/components/CreateActivity';
import CreateWS from '../../servicePortfolio/components/CreateWS';
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
import { Web } from 'sp-pnp-js';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';

import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import ReactPopperTooltip from '../../../globalComponents/Hierarchy-Popper-tooltip';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
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

  const [loaded, setLoaded] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [data, setData] = React.useState([]);
  finalData = data;
  const refreshData = () => setData(() => finalData);
  const [checkedList, setCheckedList] = React.useState([]);
  const [AllUsers, setTaskUser] = React.useState([]);
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState('');
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [AllClientCategory, setAllClientCategory] = React.useState([])
  const [count, setCount] = React.useState(0);

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
  const [checkData, setcheckData] = React.useState(null)

  // IsUpdated = props.props.Portfolio_x0020_Type;
  IsUpdated = props.props.PortfolioType;

  const GetSmartmetadata = async () => {
    //  var metadatItem: any = []
    let smartmetaDetails: any = [];
    let AllSiteName: any = [];
    var select: any = 'Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent'
    smartmetaDetails = await globalCommon.getData(props?.AllListId?.siteUrl, props?.AllListId?.SmartMetadataListID, select);
    setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
    console.log(smartmetaDetails);
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
    if (props.props.TaskType != undefined && props.props.TaskType != undefined && props.props.TaskType === 'Activities') {
      filter += '(ParentTask/Id eq ' + props.props.Id + ' ) or '
      loadWSTasks(props.props);
    }
    else if (props.props.TaskType != undefined && props.props.TaskType != undefined && props.props.TaskType === 'Workstream') {
      filter += '(ParentTask/Id eq ' + props.props.Id + ' )'
      loadActivityTasks(props.props);

    }
  }


  const loadActivityTasks = async (task: any) => {
    let activity: any = [];
    var select = "TaskLevel,ParentTask/Title,ParentTask/Id,ClientTime,TaskLevel,ItemRank,PortfolioType/Id,PortfolioType/Title,PortfolioType/Color,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Portfolio,TaskType,AssignedTo,ClientCategory,Author,Editor,TeamMembers,PortfolioType,ResponsibleTeam,TaskCategories&$filter=Id eq " + task.ParentTask.Id + ""
    activity = await globalCommon.getData(props?.AllListId?.siteUrl, task.listId, select)
    if (activity.length > 0)
      GetComponents(activity[0])
    LoadAllSiteTasks(filter);
  }
  const loadWSTasks = async (task: any) => {
    var select = "TaskLevel,ParentTask/Title,ParentTask/Id,ClientTime,TaskLevel,ItemRank,PortfolioType/Id,PortfolioType/Title,PortfolioType/Color,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Portfolio,TaskType,AssignedTo,ClientCategory,Author,Editor,TeamMembers,PortfolioType,ResponsibleTeam,TaskCategories&$filter=ParentTask/Id eq " + task.Id + ""
    // var select = "TaskLevel,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,TaskLevel,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Component/Id,Component/Title,Component/ItemType, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,TaskType,AssignedTo,Component,ClientCategory,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories&$filter=ParentTask/Id eq " + task.Id + ""
    AllWSTasks = await globalCommon.getData(props?.AllListId?.siteUrl, task.listId, select)
    if (AllWSTasks.length === 0)
      filter += '(ParentTask/Id eq ' + props.props.Id + ' )'
    AllWSTasks.forEach((obj: any, index: any) => {
      if ((AllWSTasks.length - 1) === index)
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
      .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
      .get().then((Response: any) => {
        setTaskUser(Response);
        console.log(Response);
        taskUsers = Response
      })



  }

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

  const LoadAllSiteTasks = async (filter: any) => {
    var Response: any = []
    var Counter = 0;
    // filterarray.forEach((filter: any) => {
    // siteConfig.forEach(async (config: any) => {
    //     if (config.Title != 'Master Tasks' && config.Title != 'SDC Sites') {
    try {
      let AllTasksMatches = [];
      var select = "TaskLevel,ParentTask/Title,ParentTask/Id,ClientTime,TaskLevel,ItemRank,PortfolioType/Id,PortfolioType/Title,PortfolioType/Color,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Portfolio,TaskType,AssignedTo,ClientCategory,Author,Editor,TeamMembers,PortfolioType,ResponsibleTeam,TaskCategories&$filter=" + filter + ""
      // var select = "TaskLevel,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,TaskLevel,Services/Id, Project/Id,Project/PortfolioStructureID, Project/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,TaskID, ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level, PriorityRank, TeamMembers/Title, TeamMembers/Name, Component/Id,Component/Title,Component/ItemType, TeamMembers/Id, Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask, Project,Services,TaskType,AssignedTo,Component,ClientCategory,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories&$filter=" + filter + ""
      AllTasksMatches = await globalCommon.getData(props?.AllListId?.siteUrl, props.props.listId, select)
      console.log(AllTasksMatches);
      Counter++;
      console.log(AllTasksMatches.length);
      if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {

        $.each(AllTasksMatches, function (index: any, item: any) {
          item.isDrafted = false;
          item.flag = true;
          item.show = true;
          item.siteType = props.props.siteType;
          item.childs = [];
          item.subRows = []
          item.listId = props.props.listId;
          item.siteUrl = props?.AllListId?.siteUrl;
          if (item.TaskCategories != undefined) {
            if (item.TaskCategories.length > 0) {
              $.each(item.TaskCategories, function (ind: any, value: any) {
                if (value.Title.toLowerCase() == 'draft') {
                  item.isDrafted = true;
                }
              });
            }
          }
        })

        AllTasks = AllTasks.concat(AllTasksMatches);
        AllTasks = $.grep(AllTasks, function (type: any) { return type.isDrafted == false });


        //  if (Counter === siteConfig.length ) {
        AllTasks.forEach((result: any) => {
          //   result.TeamLeader = []
          result.CreatedDateImg = []
          result.TeamLeaderUserTitle = ''
          //  result.AllTeamMembers = []
          result.Display = 'none'
          result.DueDate = result.DueDate

          if (result.DueDate == 'Invalid date' || '') {
            result.DueDate = result.DueDate.replaceAll("Invalid date", "")
          }
          result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

          if (result.FeedBack != undefined) {

           

            let feedbackdata:any= JSON.parse(result?.FeedBack)

             

           

            let FeedbackdatatinfoIcon:any=feedbackdata[0]?.FeedBackDescriptions?.map((child:any) =>

            child?.Title + ' ' +

            child?.Subtext?.map((subChild:any) => subChild?.Title).join(' ')

            ).join(' ')

 

            result.Short_x0020_Description_x0020_On =FeedbackdatatinfoIcon.replace("undefined", "").replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '')

         

          }
          if (result.Project) {
            result.ProjectTitle = result?.Project?.Title;
            result.ProjectId = result?.Project?.Id;
            result.projectStructerId = result?.Project?.PortfolioStructureID
            const title = result?.Project?.Title || '';
            const dueDate = result?.DueDate;
            result.joinedData = [];
            if (title) result.joinedData.push(`Title: ${title}`);
            if (dueDate) result.joinedData.push(`Due Date: ${dueDate}`);
        }

          result['SiteIcon'] = GetIconImageUrl(result.siteType, props?.AllListId?.siteUrl, undefined);
          // if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
          //   result.ClientCategory.forEach((catego: any) => {
          //     result.ClientCategory.push(catego);
          //   })
          // }
          if (result.Id === 498 || result.Id === 104)
            console.log(result);
          result['TaskID'] = globalCommon.getTaskId(result);
          if (result['TaskID'] == undefined) {
            result['TaskID'] = "";
          }
          result['ItemType'] = 'Task';

          result.PortfolioType = 'Component';

        })
        let allParentTasks = $.grep(AllTasks, function (type: any) { return (type.ParentTask != undefined && type.ParentTask.Id === props.props.Id) && (type.TaskType != undefined && type.TaskType.Title != 'Workstream') });
        if (props.props.TaskType != undefined && props.props.TaskType != undefined && props.props.TaskType === 'Activities')
          allworkstreamTasks = $.grep(AllTasks, function (task: any) { return (task.TaskType != undefined && task.TaskType.Title === 'Workstream') });
        if (allworkstreamTasks != undefined && allworkstreamTasks.length > 0) {
          allworkstreamTasks.forEach((obj: any) => {
            if (obj.Id != undefined) {
              AllTasks.forEach((task: any) => {
                if (task.ParentTask != undefined && obj.Id === task.ParentTask.Id) {
                  obj.childs = obj.childs != undefined ? obj.childs : []
                  obj.subRows = obj.subRows != undefined ? obj.subRows : []
                  obj.childs.push(task);
                  obj.subRows.push(task)
                }
                if (obj.childs.length > 0 || obj.subRows.length > 0) {
                  obj.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                  obj.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                }
              })
            }
            obj.Restructuring = IsUpdated != undefined && IsUpdated == 'Service' ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
            obj.childsLength = obj.childs != undefined && obj.childs.length > 0 ? obj.childs.length : 0;
            obj.subRowsLength = obj.subRows != undefined && obj.subRows.length > 0 ? obj.subRows.length : 0;
          })
        }

        var temp: any = {};
     
        temp.flag = true;
        temp.show = true;
        temp.PercentComplete = '';
        temp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
        temp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
        temp.ItemRank = '';
        temp.DueDate = '';
        if (allworkstreamTasks === undefined)
          allworkstreamTasks = [];
        if (allParentTasks.length > 0)
          allParentTasks?.map((items) => {
            allworkstreamTasks.push(items);
          })
        // AllTasksRendar = AllTasksRendar.concat(allworkstreamTasks)
        setData(allworkstreamTasks);
        setmaidataBackup(allworkstreamTasks)
        //  }
      }
    } catch (error) {
      console.log(error)
    }
    // } else Counter++;

    //})
    // })
  }
  const GetComponents = async (Item: any) => {
    var filt = "Id eq " +Item?. Portfolio?.Id + "";
    let web = new Web(props?.AllListId?.siteUrl);
    let compo = [];
    compo = await web.lists
      .getById(props?.AllListId?.MasterTaskListID)
      .items
      .select("ID", "Id", "Title", "Mileage", "PortfolioType/Id","PortfolioType/Title","PortfolioType/Color", "ItemType",
      ).expand('PortfolioType')

      .top(4999)
      .filter(filt)
      .get()
    componentDetails = compo[0]
    IsUpdated = componentDetails.PortfoliType.Title;
    if (props.props.ParentTask != undefined && props.props.ParentTask.Title != undefined)
      props.props.ParentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
    else if (props.props.TaskType != undefined && props.props.TaskType === 'Activities')
      props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
    if (props.props.TaskType != undefined && props.props.TaskType === 'Workstream')
      props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Workstream.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Workstream.png';
    if (componentDetails.ItemType === 'Component')
      componentDetails.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';
    if (componentDetails.ItemType === 'SubComponent')
      componentDetails.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
    if (componentDetails.ItemType === 'Feature')
      componentDetails.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
    //  setData(data =>[...allworkstreamTasks])

    console.log(componentDetails);
  }
  React.useEffect(() => {
    //MeetingItems.push(props)
    getTaskUsers();

    if ((props.props.Component != undefined && props.props.Component.length > 0) || (props.props.Services != undefined && props.props.Services.length > 0 && props.props.Services[0].Id))
      GetComponents(props.props)
    if (props.props.ParentTask != undefined && props.props.ParentTask.Title != undefined)
      props.props.ParentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
    else if (props.props.TaskType != undefined && props.props.TaskType === 'Activities')
      props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
    if (props.props.TaskType != undefined && props.props.TaskType === 'Workstream')
      props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Workstream.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Workstream.png';

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
    MeetingItems = []
    var MainId: any = ''
    let ParentTaskId: any;
    if (childItem != undefined && childItem.data?.ItmesDelete == undefined) {

      childItem.data.ItemType = "Task";



      childItem.data['flag'] = true;
      // childItem.data['SiteIcon']= GetIconImageUrl(childItem.data.siteType,childItem.data.siteUrl,undefined)
      // childItem.data['TitleNew'] = childItem.data.Title;
      childItem.data['TaskType'] = { Title: 'Workstream' }
      if (childItem.data.ServicesId != undefined && childItem.data.ServicesId.length > 0) {
        MainId = childItem.data.ServicesId[0]
      }
      if (childItem.data.ComponentId != undefined && childItem.data.ComponentId.length > 0) {
        MainId = childItem.data.ComponentId[0]
      }
      if (childItem.data.ParentTaskId != undefined && childItem.data.ParentTaskId != "") {
        ParentTaskId = childItem.data.ParentTaskId;
      }
      // ==========create ws and task======================== 
      let grouping: any = true;
      if (childItem.data?.editpopup == undefined && childItem.data?.ItmesDelete == undefined) {
        finalData?.map((elem: any) => {
          if (elem?.Id === ParentTaskId || elem.ID === ParentTaskId) {
            elem.subRows = elem.subRows == undefined ? [] : elem.subRows
            elem.subRows.push(childItem.data)
            grouping = false;
          }
        })
        if (grouping === true) {
          AllTasksRendar?.push(childItem.data)
          finalData = finalData.concat(AllTasksRendar)
        }
        else if (grouping === false) {
          AllTasksRendar = AllTasksRendar?.concat(finalData)
          finalData = [];
          finalData = finalData?.concat(AllTasksRendar)
        }
      }

      //============ update the data to Edit task popup==================

      if (childItem.data?.editpopup != undefined && childItem.data?.editpopup == true && childItem.data?.ItmesDelete == undefined) {
        finalData?.map((ele: any, index: any) => {
          if (ele.subRows != undefined && ele.subRows.length > 0) {
            ele.subRows?.map((sub: any, subindex: any) => {
              if (sub.Id == childItem.data.Id) {
                finalData[index].subRows.splice(subindex, 1, childItem.data);
              }
            })
          }
          if (ele.Id == childItem.data.Id) {
            finalData.splice(index, 1, childItem.data);
          }
        })
        AllTasksRendar = AllTasksRendar?.concat(finalData)
        finalData = [];
        finalData = finalData?.concat(AllTasksRendar)
      }


      console.log(finalData)
      refreshData();
    }
    // ===============Delete the data to Edit task popup====================

    if (childItem?.data?.ItmesDelete == true) {
      finalData?.map((ele: any, index: any) => {
        if (ele.subRows != undefined && ele.subRows.length > 0) {
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
  }, []);

  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);
  let isOpenPopup = false;
  const CloseCall = React.useCallback((item) => {
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
    data.forEach((obj) => {
      obj.isRestructureActive = false;
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any) => {
          obj.isRestructureActive = false;
          if (sub.childs != undefined && sub.childs.length > 0) {
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

  const CreateOpenCall = React.useCallback((item) => {
    isOpenPopup = true;
    item.data.childs = [];
    item.data.flag = true;
    item.data.siteType = "Master Tasks"
    item.data.TitleNew = item.data.Title;
    item.data.childsLength = 0;
    item.data['TaskID'] = item.data.PortfolioStructureID;
    if (checkedList != undefined && checkedList.length > 0)
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
                <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
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
              <ReactPopperTooltip ShareWebId={getValue()} row={row} AllListId={props?.AllListId} />
              : ''}
          </div>
        ),
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== 'Others' && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
              href={props?.AllListId?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID}
            >
              <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
            </a>}
            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== 'Others' &&
              <a className="hreflink serviceColor_Active" target="_blank" data-interception="off"
                href={props?.AllListId?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType}
              >
                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
              </a>}
            {row?.original.TitleNew === "Tasks" ? (
              <span>{row?.original.TitleNew}</span>
            ) : (
              ""
            )}
            {row?.original?.Categories == 'Draft' ?
              <FaCompressArrowsAlt style={{ height: '11px', width: '20px' }} /> : ''}
            {row?.original?.subRows?.length > 0 ?
              <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}

          
              {row?.original?.Short_x0020_Description_x0020_On != null && row?.original?.Short_x0020_Description_x0020_On != '' && (
                <InfoIconsToolTip Discription={row?.original?.Short_x0020_Description_x0020_On} row={row?.original} />
            )}
              {/* <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
             
                <span className="popover__content">
                  {row?.original?.Short_x0020_Description_x0020_On}
                </span>
              </span> */}

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
        accessorFn: (row) => row?.DueDate,
        cell: ({ row }) => (
          <>
            {row?.original?.DueDate == null ? (""
            ) : (
              <>
                <span>{moment(row?.original?.DueDate).format("DD/MM/YYYY")}</span>
              </>
            )
            }
          </>
        ),
        id: 'DueDate',
        placeholder: "Due Date",
        header: "",
        size: 100,
      },
      {
        accessorFn: (row) => row?.Created,
        cell: ({ row }) => (
          <>
            {row?.original?.Created == null ? (""
            ) : (
              <>
                {row?.original?.Author != undefined ? (
                  <>
                    <span>{moment(row?.original?.Created).format("DD/MM/YYYY")}</span>
                    <img className="workmember ms-1" title={row?.original?.Author?.Title} src={findUserByName(row?.original?.Author?.Id)}
                    />

                  </>
                ) : (
                  <img
                    className="workmember ms-1"
                    src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                  />
                )}{" "}

              </>
            )
            }
          </>
        ),
        id: 'Created',
        placeholder: "Created Date",
        header: "",
        size: 110,
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.ItemType == "Task" && row?.original?.siteType != "Master Tasks" && (
              <a className='time-icons' onClick={(e) => EditData(e, row?.original)} >
                <span title='Time' className="svg__iconbox svg__icon--clock"></span>
              </a>
            )}
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
          <>
            {
              topTaskresIcon ? <span onClick={() => setTasksRestruct(true)}>
                {
                  (checkedList[0].Services != undefined && checkedList[0].Services.length > 0 ?
                    <img title='Restructure' className="icon-sites-img" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png" /> :
                    <img title='Restructure' className="icon-sites-img" src='https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png' />
                  )
                }
              </span> : <span></span>

            }

          </>
        ),
        cell: ({ row, getValue }) => (
          <>
            <a className='d-flex'>
              {row?.original?.isRestructureActive && (
                <span onClick={(e) => OpenModal(row?.original)}><img className="icon-sites-img me-2" src={row?.original?.Restructuring} /> </span>)}
              {row?.original?.ItemType == "Task" && row?.original?.siteType != "Master Tasks" && (
                <span title='Edit' onClick={(e) => EditItemTaskPopup(row?.original)} className="svg__iconbox svg__icon--edit"></span>
              )}
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


  const buttonRestructuring = () => {
    var ArrayTest: any = [];
    let array = data;
    AllTasksRendar = [];


    if (checkedList?.length > 0 && checkedList != undefined) {
      checkedList.map((items: any) => {
        array.map((obj) => {
          setTopTaskresIcon(true);
          let newobj: any;
          if (obj.TaskType?.Title != "Task") {
            obj.isRestructureActive = true;
          }


          if (obj.Id === items.Id && obj.TaskType?.Title != undefined) {
            obj.isRestructureActive = false;
            newobj = { Title: obj.Title, ItemType: obj.ItemType, Id: obj.Id, siteIcon: obj.SiteIcon, TaskType: obj.TaskType, }
            ArrayTest.push(newobj);

          }
          if (obj.childs.length > 0 && obj.childs != undefined) {
            obj.childs.map((sub: any) => {
              setTopTaskresIcon(true);
              if (obj.TaskType?.Title != "Task") {
                sub.isRestructureActive = true;
              }

              if (sub.Id === items.Id && sub.TaskType?.Title != undefined) {
                obj.isRestructureActive = false;
                sub.isRestructureActive = false;
                newobj = {
                  Title: obj.Title, ItemType: obj.ItemType, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                  newChild: {
                    Title: sub.Title, ItemType: sub.ItemType, Id: sub.Id, siteIcon: sub.SiteIcon, TaskType: sub.TaskType,
                  }
                }
                ArrayTest.push(newobj);

              }

            })
          }
        })
      })

    }
    setOldArrayBackup(ArrayTest);
    AllTasksRendar = AllTasksRendar?.concat(array)
    finalData = [];
    finalData = finalData?.concat(AllTasksRendar);
    refreshData();

  }



  const RestruringCloseCall = () => {
    setResturuningOpen(false);
    setTasksRestruct(false);
    clearreacture();
  };

  const OpenModal = (item: any) => {
    var TestArray: any = [];
    setResturuningOpen(true);
    TestArray = [item]
    setNewArrayBackup(TestArray);


  }

  const setRestructure = (e: any) => {
    let value = e.target.value;
    // let data:any = data;
    let array: any = []
    let TaskLevel: any = 0;
    let ParentTask: any;
    let TaskType: any;
    let TaskID: any;
    let dataArray = checkedList;


    if (value != undefined) {
      data?.map((obj: any) => {

        if (value == "Task") {
          TaskType = { Id: 2, Title: value, Level: 2 };
          ParentTask = obj.ParentTask;
          TaskID = obj?.ParentTask.TaskID + "-" + "T" + obj.Id;
          TaskLevel = null;
        } else {
          TaskType = { Id: 3, Title: value, Level: 3 };
          ParentTask = obj.ParentTask;
          TaskID = obj?.ParentTask.TaskID + "-" + "W" + TaskLevel;
          if (obj?.TaskType?.Title == value && (TaskLevel < obj.TaskLevel || TaskLevel == obj.TaskLevel)) {
            TaskLevel = obj.TaskLevel + 1;
          } else {
            if (TaskLevel == 0) {
              TaskLevel = 1;
            }
          }
        }
      })
    }

    if (checkedList != undefined) {
      dataArray.map((items: any) => {
        items.TaskLevel = TaskLevel;
        items.ParentTask = ParentTask;
        items.TaskType = TaskType
        items.TaskID = TaskID;
        array.push(items);
      })
    }
    setCheckedList(array);

  }



  const UpdateTopTaskRestructure = async () => {
    AllTasksRendar = [];


    let web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(checkedList[0].listId).items
      .getById(checkedList[0].Id)
      .update({
        TaskID: checkedList[0].TaskID,
        TaskLevel: checkedList[0].TaskLevel,
        TaskTypeId: checkedList[0].TaskType.Id,
        ParentTaskId: checkedList[0].ParentTask.Id
      })
      .then((res: any) => {
        let checkUpdate: number = 1;
        let checkUpdate1: number = 1;
        let backupCheckedList: any = OldArrayBackup;
        let latestCheckedList: any = checkedList;

        let array: any = [];
        data.map((items: any) => {
          array.push(items)
        })

        array.forEach((obj: any, index: any) => {
          obj.isRestructureActive = false;
          if (checkUpdate == 1) {
            array.push(...{ ...latestCheckedList });
            checkUpdate = checkUpdate + 1;
          }
          if (obj.Id === backupCheckedList[0]?.Id && obj.ItemType === backupCheckedList[0]?.ItemType && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate1 == 1) {
            array.splice(index, 1);
            checkUpdate = checkUpdate1 + 1;
          }
          if (obj.childs != undefined && obj.childs.length > 0) {
            obj.childs.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === backupCheckedList[0]?.Id && sub.ItemType === backupCheckedList[0]?.ItemType && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate1 == 1) {
                array[index]?.subRows.splice(indexsub, 1);
                array[index]?.childs.splice(indexsub, 1);
                checkUpdate = checkUpdate1 + 1;
              }
            })
          }


        })

        setTopTaskresIcon(false);
        setTasksRestruct(false);
        AllTasksRendar = AllTasksRendar?.concat(array)
        finalData = [];
        finalData = finalData?.concat(AllTasksRendar);
        refreshData();
        setNewArrayBackup([]);
        setOldArrayBackup([]);
        setRowSelection({});
        setCheckedList([]);
        setResturuningOpen(false);
      })
  }




  const UpdateTaskRestructure = async function () {
    AllTasksRendar = [];

    let numbers: any;
    let numbers1: any;
    let TaskTypeId: any;
    let ParentTaskId: any;
    let TaskID: any;

    if (NewArrayBackup.length > 0 && NewArrayBackup != undefined) {
      if (NewArrayBackup[0]?.TaskType?.Title == "Workstream") {
        ParentTaskId = NewArrayBackup[0].Id;
        TaskID = NewArrayBackup[0].TaskID + "-" + "T" + checkedList[0].Id;
        TaskTypeId = 2;
      }
    }


    let web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(checkedList[0].listId).items
      .getById(checkedList[0].Id)
      .update({
        TaskID: TaskID,
        TaskTypeId: TaskTypeId,
        ParentTaskId: ParentTaskId
      })
      .then((res: any) => {
        let checkUpdate: number = 1;
        let backupCheckedList: any = [];
        let latestCheckedList: any = [];
        checkedList.map((items: any) => {
          latestCheckedList.push({ ...items })
          backupCheckedList.push({ ...items })
        })

        latestCheckedList?.map((items: any) => {
          items.Parent = { Id: ParentTaskId, TaskID: TaskID, Title: NewArrayBackup[0]?.Title },
            items.TaskID = TaskID,
            items.TaskType = { Id: 2, Title: "Task", Level: 2 }
        })


        let array = data;
        array.forEach((obj: any, index: any) => {
          obj.isRestructureActive = false;
          if (obj.Id === NewArrayBackup[0]?.Id && obj.ItemType === NewArrayBackup[0]?.ItemType && obj.TaskType?.Title === NewArrayBackup[0]?.TaskType?.Title && checkUpdate != 3) {
            obj.subRows.push(...latestCheckedList);
            obj.childs.push(...latestCheckedList);
            checkUpdate = checkUpdate + 1;
          }
          if (obj.Id === backupCheckedList[0]?.Id && obj.ItemType === backupCheckedList[0]?.ItemType && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
            array.splice(index, 1);
            checkUpdate = checkUpdate + 1;
          }
          if (obj.childs != undefined && obj.childs.length > 0) {
            obj.childs.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === NewArrayBackup[0]?.Id && sub.ItemType === NewArrayBackup[0]?.ItemType && sub.TaskType?.Title === NewArrayBackup[0]?.TaskType?.Title && checkUpdate != 3) {
                sub.subRows.push(...latestCheckedList);
                sub.childs.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (sub.Id === backupCheckedList[0]?.Id && sub.ItemType === backupCheckedList[0]?.ItemType && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                array[index]?.subRows.splice(indexsub, 1);
                array[index]?.childs.splice(indexsub, 1);
                checkUpdate = checkUpdate + 1;
              }
              if (sub.childs != undefined && sub.childs.length > 0) {
                sub.childs.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === NewArrayBackup[0]?.Id && newsub.ItemType === NewArrayBackup[0]?.ItemType && newsub.TaskType?.Title === NewArrayBackup[0]?.TaskType?.Title && checkUpdate != 3) {
                    newsub.subRows.push(...latestCheckedList);
                    newsub.childs.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (newsub.Id === backupCheckedList[0]?.Id && newsub.ItemType === backupCheckedList[0]?.ItemType && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                    array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                    array[index]?.childs[indexsub]?.childs.splice(lastIndex, 1);
                    checkUpdate = checkUpdate + 1;
                  }
                })
              }

            })
          }


        })

        setTopTaskresIcon(false);
        AllTasksRendar = AllTasksRendar?.concat(array)
        finalData = [];
        finalData = finalData?.concat(AllTasksRendar);
        refreshData();
        setNewArrayBackup([]);
        setOldArrayBackup([]);
        setCheckedList([]);
        setRowSelection({});
        setResturuningOpen(false);
      })

  }
  function structuredClone(obj: any): any {

    return JSON.parse(JSON.stringify(obj));

  }
  const openActivity = () => {
    let data2: any = structuredClone(props?.props)
    if (checkData != undefined && checkData != null&&checkData?.TaskType!=null ) {
      if (checkData?.TaskType?.Title == 'Workstream') {
        checkData['NoteCall'] = 'Task'
        console.log(MeetingItems[MeetingItems.length - 1])
        if (MeetingItems[MeetingItems.length - 1]?.ClientTime?.length > 0 && MeetingItems[MeetingItems?.length - 1].ClientTime != undefined) {
          MeetingItems[MeetingItems.length - 1].ClientTime = JSON.parse(MeetingItems[MeetingItems?.length - 1]?.ClientTime)
        }

        setMeetingPopup(true)
      }
    }
    else {
      if (props.props.TaskType == 'Workstream') {
        props.props['NoteCall'] = 'Task'
        MeetingItems.push(props.props)
        setMeetingPopup(true)
      }
      if (props.props.TaskType == 'Activities') {
        let parentcat: any = [];

        if (data2?.ClientTime != null && data2?.ClientTime != undefined) {

          data2.ClientTime = JSON.stringify(data2?.ClientTime)
        } else {
          data2.ClientTime = null
        }

        MeetingItems.push(data2)
        setWSPopup(true)



      }
    }

  }

  const findUserByName = (Id: any) => {
    const user = AllUsers.filter((user: any) => user.AssingedToUserId == Id);
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
  }, [table?.getSelectedRowModel()?.flatRows.length])

  const CheckDataPrepre = () => {
    if (table?.getSelectedRowModel()?.flatRows.length) {
      let eTarget = false;
      let itrm: any;
      if (table?.getSelectedRowModel()?.flatRows.length > 0) {
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
      if (itrm?.ItemType == "Component") {
        // onChangeHandler(itrm, 'parent', eTarget);
      } else {
        // onChangeHandler(itrm, props, eTarget);
      }
    } else {

      setcheckData(null)
      //   setShowTeamMemberOnCheck(false)
    }

  }
  React.useEffect(() => {
    if (table.getState().columnFilters.length) {
      setExpanded(true);
    } else {
      setExpanded({});
    }
  }, [table.getState().columnFilters]);
  const callBackData = React.useCallback((checkData: any) => {
    let array: any = [];
    if (checkData != undefined) {

      if (checkData.TaskType == undefined) {
        setActivityDisable(false)
        checkData['siteUrl'] = props?.AllListId?.siteUrl;
        checkData['listName'] = 'Master Tasks';
        MeetingItems.push(checkData)
        //setMeetingItems(itrm);

      }
      if (checkData.TaskType != undefined) {
        if (checkData.TaskType.Title == 'Activities' || checkData.TaskType.Title == "Workstream") {
          setActivityDisable(false)
          // Arrays.push(itrm)
          checkData['PortfolioId'] = props?.Id;
          MeetingItems.push(checkData)
          setCount(count + 2)
        }
        if (checkData.TaskType.Title == 'Task') {
          setActivityDisable(true)
          MeetingItems.push(checkData)

        }
      }
      setcheckData(checkData);
      array.push(checkData);


    } else {
      setcheckData({});
      array = [];
    }
    // setCheckedList1(array);
  }, []);

  return (

    <div className={IsUpdated === 'Events' ? 'app component eventpannelorange' : (IsUpdated == 'Service' ? 'app component serviepannelgreena' : 'app component')}>
      <div className="Alltable mt-10">

        <div className="col-sm-12 pad0 smart" >
          <div className="">
            <div className={`${data.length > 10 ? "wrapper" : "MinHeight"}`}>
          
              <GlobalCommanTable
                //  ref={childRef}
                callChildFunction={Call}
                AllListId={props?.AllListId}
                columns={columns}
                //  restructureCallBack={callBackData1} 
                data={data}
                callBackData={callBackData}
                TaskUsers={AllUsers}
                showHeader={true}
                // portfolioColor={portfolioColor} 
                // portfolioTypeData={portfolioTypeDataItem}
                //  taskTypeDataItem={taskTypeDataItem} 
                // portfolioTypeConfrigration={portfolioTypeConfrigration } 
                showingAllPortFolioCount={false}
                showCreationAllButton={true}
                AddWorkstreamTask={openActivity}
                taskProfile={true}
                expandIcon={true}
              />
            </div>

          </div>
        </div>
      </div>


      <span>
        <Panel headerText={` ${NewArrayBackup[0]?.Title}-Restructuring Tool `} type={PanelType.medium} isOpen={ResturuningOpen} isBlocking={false} onDismiss={RestruringCloseCall}>
          <div className='mt-4 mb-3'>
            <span>{`All below selected items will be added as Task inside "${NewArrayBackup[0]?.Title}"`}</span>
            <div className='mt-2' >Old : <span><img width={"25px"} height={"25px"} src={NewArrayBackup[0]?.SiteIcon} />{NewArrayBackup[0]?.Title}</span></div>
            <div className='mt-2'>New : <span><img width={"25px"} height={"25px"} src={NewArrayBackup[0]?.SiteIcon} />{NewArrayBackup[0]?.Title}</span><span>{`>`}</span> <span><img width={"25px"} height={"25px"} src={OldArrayBackup[0]?.siteIcon} />{OldArrayBackup[0]?.Title}</span></div>
          </div>
          <footer className="mt-2 text-end">
            <button type="button" className="btn btn-primary " onClick={(e) => UpdateTaskRestructure()}>Save</button>
            <button type="button" className="btn btn-default btn-default ms-1" onClick={RestruringCloseCall}>Cancel</button>
          </footer>
        </Panel>
      </span>


      <span>
        <Panel headerText={`Restructuring Tool `} type={PanelType.medium} isOpen={tasksRestruct} isBlocking={false} onDismiss={RestruringCloseCall}>
          <div className='mt-4 mb-3'>
            <span>{`All below selected items will be added as ${checkedList[0]?.TaskType?.Title}`}</span>
            <div className='mt-2' >Select Task Type :
              <span>
                <input
                  type="radio"
                  name="fav_language"
                  value="Workstream"
                  checked={
                    checkedList[0]?.TaskType?.Title == "Workstream"
                      ? true
                      : false
                  }
                  onChange={(e) => setRestructure(e)}
                />
                <label className="ms-1"> {"Workstream"} </label>
              </span>
              <span>
                <input
                  type="radio"
                  name="fav_language"
                  value="Task"
                  checked={
                    checkedList[0]?.TaskType?.Title == "Task"
                      ? true
                      : false
                  }
                  onChange={(e) => setRestructure(e)}
                />
                <label className="ms-1"> {"Task"} </label>
              </span>
            </div>
            <div className='mt-2' >Old : <span><img width={"25px"} height={"25px"} src={OldArrayBackup[0]?.siteIcon} />{OldArrayBackup[0]?.Title}</span></div>
            <div className='mt-2'>New : <span><img width={"25px"} height={"25px"} src={OldArrayBackup[0]?.siteIcon} />{OldArrayBackup[0]?.Title}</span></div>
          </div>
          <footer className="mt-2 text-end">
            <button type="button" className="btn btn-primary " onClick={(e) => UpdateTopTaskRestructure()}>Save</button>
            <button type="button" className="btn btn-default btn-default ms-1" onClick={RestruringCloseCall}>Cancel</button>
          </footer>
        </Panel>
      </span>



      {IsTask && <EditTaskPopup Items={SharewebTask} Call={Call} AllListId={props.AllListId} context={props.Context} pageName={"TaskFooterTable"}></EditTaskPopup>}
      {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack} AllListId={props.AllListId} TimeEntryPopup Context={props.Context}></TimeEntryPopup>}
      {MeetingPopup &&
        <CreateActivity
          props={MeetingItems[MeetingItems.length - 1]}
          Call={Call}
          TaskUsers={AllUsers}
          AllClientCategory={AllClientCategory}
          LoadAllSiteTasks={LoadAllSiteTasks}
          SelectedProp={props.AllListId}>
        </CreateActivity>}
      {WSPopup && <CreateWS props={MeetingItems[MeetingItems.length - 1]} Call={Call} data={data} SelectedProp={props.AllListId}></CreateWS>}
      {addModalOpen && <Panel headerText={` Create Component `} type={PanelType.medium} isOpen={addModalOpen} isBlocking={false} onDismiss={CloseCall}>
        <PortfolioStructureCreationCard CreatOpen={CreateOpenCall} Close={CloseCall} PortfolioType={IsUpdated} PropsValue={props} SelectedItem={checkedList != null && checkedList.length > 0 ? checkedList[0] : props} />
      </Panel>
      }
    </div>
  )

}
export default TasksTable;

