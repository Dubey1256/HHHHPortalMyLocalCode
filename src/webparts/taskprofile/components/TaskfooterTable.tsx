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
      className={className + " cursor-pointer"}
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
    <input style={{ width: "100%" }} className="me-1 mb-1 on-search-cross"

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

  IsUpdated = props.props.Portfolio_x0020_Type;


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
    if (props.props.SharewebTaskType != undefined && props.props.SharewebTaskType != undefined && props.props.SharewebTaskType === 'Activities') {
      filter += '(ParentTask/Id eq ' + props.props.Id + ' ) or '
      loadWSTasks(props.props);
    }
    else if (props.props.SharewebTaskType != undefined && props.props.SharewebTaskType != undefined && props.props.SharewebTaskType === 'Workstream') {
      filter += '(ParentTask/Id eq ' + props.props.Id + ' )'
      loadActivityTasks(props.props);

    }
  }


  const loadActivityTasks = async (task: any) => {
    let activity: any = [];
    var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=Id eq " + task.ParentTask.Id + ""
    activity = await globalCommon.getData(props?.AllListId?.siteUrl, task.listId, select)
    if (activity.length > 0)
      GetComponents(activity[0])
    LoadAllSiteTasks(filter);
  }
  const loadWSTasks = async (task: any) => {

    var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=ParentTask/Id eq " + task.Id + ""
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
      var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" + filter + ""
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
          if (item.SharewebCategories != undefined) {
            if (item.SharewebCategories.length > 0) {
              $.each(item.SharewebCategories, function (ind: any, value: any) {
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

          if (result.Short_x0020_Description_x0020_On != undefined) {
            result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
          }

          result['SiteIcon'] = GetIconImageUrl(result.siteType, props?.AllListId?.siteUrl, undefined);
          // if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
          //   result.ClientCategory.forEach((catego: any) => {
          //     result.ClientCategory.push(catego);
          //   })
          // }
          if (result.Id === 498 || result.Id === 104)
            console.log(result);
          result['Shareweb_x0020_ID'] = globalCommon.getTaskId(result);
          if (result['Shareweb_x0020_ID'] == undefined) {
            result['Shareweb_x0020_ID'] = "";
          }
          result['Item_x0020_Type'] = 'Task';

          result.Portfolio_x0020_Type = 'Component';

        })
        let allParentTasks = $.grep(AllTasks, function (type: any) { return (type.ParentTask != undefined && type.ParentTask.Id === props.props.Id) && (type.SharewebTaskType != undefined && type.SharewebTaskType.Title != 'Workstream') });
        if (props.props.SharewebTaskType != undefined && props.props.SharewebTaskType != undefined && props.props.SharewebTaskType === 'Activities')
          allworkstreamTasks = $.grep(AllTasks, function (task: any) { return (task.SharewebTaskType != undefined && task.SharewebTaskType.Title === 'Workstream') });
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
            obj.Restructuring = IsUpdated != undefined && IsUpdated == 'Service' ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
            obj.childsLength = obj.childs != undefined && obj.childs.length > 0 ? obj.childs.length : 0;
            obj.subRowsLength = obj.subRows != undefined && obj.subRows.length > 0 ? obj.subRows.length : 0;
          })
        }

        var temp: any = {};
        // temp.Title = 'Tasks';
        // temp.childs = allParentTasks;
        // temp.subRows = allParentTasks
        // temp.childsLength = allParentTasks.length;
        // temp.subRowsLength = allParentTasks.length
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
    var filt = "Id eq " + (Item.Component.length > 0 ? Item.Component[0].Id : Item.Services[0].Id) + "";
    let web = new Web(props?.AllListId?.siteUrl);
    let compo = [];
    compo = await web.lists
      .getById(props?.AllListId?.MasterTaskListID)
      .items
      .select("ID", "Id", "Title", "Mileage", "Portfolio_x0020_Type", "ItemType",
      )

      .top(4999)
      .filter(filt)
      .get()
    componentDetails = compo[0]
    IsUpdated = componentDetails.Portfolio_x0020_Type;
    if (props.props.ParentTask != undefined && props.props.ParentTask.Title != undefined)
      props.props.ParentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
    else if (props.props.SharewebTaskType != undefined && props.props.SharewebTaskType === 'Activities')
      props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
    if (props.props.SharewebTaskType != undefined && props.props.SharewebTaskType === 'Workstream')
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
    else if (props.props.SharewebTaskType != undefined && props.props.SharewebTaskType === 'Activities')
      props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
    if (props.props.SharewebTaskType != undefined && props.props.SharewebTaskType === 'Workstream')
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
    if (childItem != undefined && childItem.data?.ItmesDelete==undefined) {
     
        childItem.data.Item_x0020_Type = "Task";
      
      
      
      childItem.data['flag'] = true;
      // childItem.data['SiteIcon']= GetIconImageUrl(childItem.data.siteType,childItem.data.siteUrl,undefined)
      // childItem.data['TitleNew'] = childItem.data.Title;
      childItem.data['SharewebTaskType'] = { Title: 'Workstream' }
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
      let grouping:any = true;
      if(childItem.data?.editpopup==undefined&&childItem.data?.ItmesDelete==undefined){
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
        else if(grouping === false){
          AllTasksRendar = AllTasksRendar?.concat(finalData)
          finalData=[];
          finalData = finalData?.concat(AllTasksRendar)
        }
      }

      //============ update the data to Edit task popup==================

      if(childItem.data?.editpopup!=undefined&&childItem.data?.editpopup==true&&childItem.data?.ItmesDelete==undefined){
        finalData?.map((ele:any,index:any)=>{
          if(ele.subRows!=undefined&&ele.subRows.length>0){
            ele.subRows?.map((sub:any,subindex:any)=>{
              if(sub.Id==childItem.data.Id){
                finalData[index].subRows.splice(subindex, 1,childItem.data);
              }
            })
          }
          if(ele.Id==childItem.data.Id){
            finalData.splice(index, 1,childItem.data);
          }
        })
        AllTasksRendar = AllTasksRendar?.concat(finalData)
        finalData=[];
        finalData = finalData?.concat(AllTasksRendar)
       }
      

      console.log(finalData)
      refreshData();
    }
     // ===============Delete the data to Edit task popup====================

     if(childItem?.data?.ItmesDelete==true){
      finalData?.map((ele:any,index:any)=>{
        if(ele.subRows!=undefined&&ele.subRows.length>0){
          ele.subRows?.map((sub:any,subindex:any)=>{
            if(sub.Id==childItem.data.Id){
              finalData[index].subRows.splice(subindex, 1);
            }
          })
        }
        if(ele.Id==childItem.data.Id){
          finalData.splice(index, 1);
        }
      })
      AllTasksRendar = AllTasksRendar?.concat(finalData)
      finalData=[];
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
        // obj.data.Team_x0020_Members=item.TeamMembersIds;
        // obj.AssignedTo =item.AssignedIds;
        obj.data.siteType = "Master Tasks";
        obj.data['Shareweb_x0020_ID'] = obj.data.PortfolioStructureID;
        if (item.props != undefined && item.props.SelectedItem != undefined && item.props.SelectedItem.childs != undefined) {
          item.props.SelectedItem.childs = item.props.SelectedItem.childs == undefined ? [] : item.props.SelectedItem.childs;
          item.props.SelectedItem.childs.unshift(obj.data);
        }

      })
      // if (ComponentsData != undefined && ComponentsData.length > 0) {
      //     ComponentsData.forEach((comp: any, index: any) => {
      //         if (comp.Id != undefined && item.props.SelectedItem != undefined && comp.Id === item.props.SelectedItem.Id){
      //             comp.childsLength =item.props.SelectedItem.childs.length;
      //             comp.show = comp.show ==undefined ?false : comp.show
      //             comp.childs = item.props.SelectedItem.childs;
      //         }
      //         if (comp.childs != undefined && comp.childs.length > 0) { 
      //             comp.childs.forEach((subcomp: any, index: any) => {
      //                 if (subcomp.Id != undefined && item.props.SelectedItem != undefined && subcomp.Id === item.props.SelectedItem.Id){
      //                     subcomp.childsLength =item.props.SelectedItem.childs.length;
      //                     subcomp.show = subcomp.show ==undefined ?false : subcomp.show
      //                     subcomp.childs = item.props.SelectedItem.childs;
      //                 }
      //             })
      //         }

      //     })
      //     // }
      // }
      // setData((data) => [...ComponentsData]);
    }
    if (!isOpenPopup && item.data != undefined) {
      item.data.childs = [];
      item.data.flag = true;
      item.data.TitleNew = item.data.Title;
      item.data.siteType = "Master Tasks"
      item.data.childsLength = 0;
      // item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;
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
    finalData=[];
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
    item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;
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
        accessorKey: "Shareweb_x0020_ID",
        placeholder: "ID",
        size: 17,
        header: ({ table }: any) => (
          <>
            <button className='border-0 bg-Ff'
              {...{
                onClick: table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
            </button>{" "}
            <IndeterminateCheckbox {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }} />{" "}
          </>
        ),
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
                <span className='border-0'
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              ) : ""}{" "}
              {row?.original?.TitleNew != 'Tasks' ? <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()

                }}
              /> : ""}{" "}
              {row?.original?.SiteIcon != undefined ?
                <a className="hreflink" title="Show All Child" data-toggle="modal">
                  <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
                  {/* </a> : <>{row?.original?.TitleNew != "Tasks" ? <div className='Dyicons'>{row?.original?.SiteIconTitle}</div> : ""}</> */}
                </a> : <>{row?.original?.TitleNew != "Tasks" ? <div className='Dyicons'>T</div> : ""}</>
              }
              {getValue()}
            </>
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

            {row?.original?.Short_x0020_Description_x0020_On != null &&
              <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
                {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /> */}
                <span className="popover__content">
                  {row?.original?.Short_x0020_Description_x0020_On}
                </span>
              </span>}

          </>
        ),
        id: "Title",
        placeholder: "Title",
        header: "",
        size: 28,
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
        size: 8,
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
        size: 5,
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "Status",
        header: "",
        size: 3,
      },
      {
        accessorKey: "ItemRank",
        placeholder: "Item Rank",
        header: "",
        size: 3,
      },
      {
        accessorFn: (row) => row?.DueDate,
        cell: ({ row, getValue }) => (
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
        size: 4,
      },
      {
        accessorFn: (row) => row?.Created,
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.Created == null ? (""
            ) : (
              <>
                {row?.original?.Author != undefined ? (
                  <>
                    <span>{moment(row?.original?.Created).format("DD/MM/YYYY")}</span>
                    <img className="AssignUserPhoto" title={row?.original?.Author?.Title} src={findUserByName(row?.original?.Author?.Id)}
                    />

                  </>
                ) : (
                  <img
                    className="AssignUserPhoto"
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
        size: 9,
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.Item_x0020_Type == "Task" && row?.original?.siteType != "Master Tasks" && (
              <a onClick={(e) => EditData(e, row?.original)} >
                <span className="svg__iconbox svg__icon--clock"></span>
              </a>
            )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 0,
      },
     
      {
        header: ({ table }: any) => (
          <>
          {
             topTaskresIcon?<span onClick={()=>setTasksRestruct(true)}>
               { 
                 (checkedList[0].Services != undefined &&  checkedList[0].Services.length > 0 ? 
                  <img className="icon-sites-img" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png" /> :
                 <img className="icon-sites-img" src='https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png' />
              )
               } 
              </span>:<span></span> 
              
          }
            
          </>
        ),
        cell: ({ row, getValue }) => (
          <>
            <a className='d-flex'>
              {row?.original?.isRestructureActive && (
              <span onClick={(e) => OpenModal(row?.original)}><img className="icon-sites-img me-2" src={row?.original?.Restructuring} /> </span>)}
              {row?.original?.Item_x0020_Type == "Task" && row?.original?.siteType != "Master Tasks" && (
                <span onClick={(e) => EditItemTaskPopup(row?.original)} className="svg__iconbox svg__icon--edit"></span>
              )}
            </a>
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 1,
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
    
   
    if(checkedList?.length > 0 && checkedList != undefined){
      checkedList.map((items:any)=>{
        array.map((obj) => {
          setTopTaskresIcon(true);
          let newobj:any;
          if(obj.SharewebTaskType?.Title != "Task"){
            obj.isRestructureActive = true; 
          }
         
            
          if(obj.Id === items.Id && obj.SharewebTaskType?.Title != undefined){
                         obj.isRestructureActive = false; 
                         newobj={Title:obj.Title,Item_x0020_Type:obj.Item_x0020_Type,Id:obj.Id,siteIcon:obj.SiteIcon,SharewebTaskType:obj.SharewebTaskType,} 
                         ArrayTest.push(newobj);   
                          
          }
          if(obj.childs.length > 0 && obj.childs != undefined){
                obj.childs.map((sub:any)=>{
                  setTopTaskresIcon(true);
                  if(obj.SharewebTaskType?.Title != "Task"){
                    sub.isRestructureActive = true; 
                  }
                  
                  if(sub.Id === items.Id && sub.SharewebTaskType?.Title != undefined){
                    obj.isRestructureActive = false; 
                sub.isRestructureActive = false; 
                    newobj={Title:obj.Title,Item_x0020_Type:obj.Item_x0020_Type,Id:obj.Id,siteIcon:obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,SharewebTaskType:obj.SharewebTaskType,
                      newChild:{Title:sub.Title,Item_x0020_Type:sub.Item_x0020_Type,Id:sub.Id,siteIcon:sub.SiteIcon,SharewebTaskType:sub.SharewebTaskType,
                     }} 
                     ArrayTest.push(newobj); 
                   
               }
               
                })
          }
        })
      })
     
    }
    setOldArrayBackup(ArrayTest);
    AllTasksRendar = AllTasksRendar?.concat(array)
    finalData=[];
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
    let array:any = []
    let SharewebTaskLevel2No:any = 0;
    let ParentTask:any;
    let SharewebTaskType:any;
    let Shareweb_x0020_ID:any;
    let dataArray = checkedList;

    
    if(value != undefined){
      data?.map((obj:any)=>{
           
            if(value == "Task"){
            SharewebTaskType = {Id:2,Title:value,Level:2};
            ParentTask = obj.ParentTask;
            Shareweb_x0020_ID = obj?.ParentTask.Shareweb_x0020_ID + "-" + "T" + obj.Id;
                SharewebTaskLevel2No = null;
              }else{
              SharewebTaskType = {Id:3,Title:value,Level:3};
              ParentTask = obj.ParentTask;
              Shareweb_x0020_ID = obj?.ParentTask.Shareweb_x0020_ID + "-" + "W" + SharewebTaskLevel2No;
              if(obj?.SharewebTaskType?.Title == value && (SharewebTaskLevel2No < obj.SharewebTaskLevel2No || SharewebTaskLevel2No == obj.SharewebTaskLevel2No)){
                SharewebTaskLevel2No = obj.SharewebTaskLevel2No + 1;
              }else{
                if(SharewebTaskLevel2No == 0){
                  SharewebTaskLevel2No = 1;
                }
              }
            }
      })
     }

     if(checkedList != undefined){
      dataArray.map((items:any)=>{
        items.SharewebTaskLevel2No = SharewebTaskLevel2No;
        items.ParentTask = ParentTask;
        items.SharewebTaskType = SharewebTaskType
        items.Shareweb_x0020_ID = Shareweb_x0020_ID;
         array.push(items);
      })
    }
     setCheckedList(array);  
       
   }



   const UpdateTopTaskRestructure=async ()=>{
    AllTasksRendar = [];


    let web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(checkedList[0].listId).items
    .getById(checkedList[0].Id)
    .update({
          Shareweb_x0020_ID:checkedList[0].Shareweb_x0020_ID,
          SharewebTaskLevel2No:checkedList[0].SharewebTaskLevel2No,
          SharewebTaskTypeId:checkedList[0].SharewebTaskType.Id,
          ParentTaskId : checkedList[0].ParentTask.Id
    })
    .then((res: any) => {
      let checkUpdate : number = 1;
      let checkUpdate1 : number = 1;
      let backupCheckedList :any = OldArrayBackup;
      let latestCheckedList:any = checkedList ; 

      let array :any = [];
              data.map((items:any)=>{       
                   array.push(items)
              })
          
         array.forEach((obj:any , index:any) => {
            obj.isRestructureActive = false;
            if(checkUpdate == 1){
              array.push(...{...latestCheckedList});
              checkUpdate = checkUpdate + 1;
     }
     if(obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate1 == 1){
                   array.splice(index,1);
                   checkUpdate = checkUpdate1 + 1;
     }
            if (obj.childs != undefined && obj.childs.length > 0) {
              obj.childs.forEach((sub: any,indexsub:any) => {
                sub.isRestructureActive = false;
         if(sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate1 == 1){
                       array[index]?.subRows.splice(indexsub,1);
                       array[index]?.childs.splice(indexsub,1);
                       checkUpdate = checkUpdate1 + 1;
         }      
              })
            }
      
      
          })
      
          setTopTaskresIcon(false);
          setTasksRestruct(false);
          AllTasksRendar = AllTasksRendar?.concat(array)
          finalData=[];
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
   
    let numbers :any ;
    let numbers1 :any ;
  let  SharewebTaskTypeId : any;
   let ParentTaskId :any ;
   let Shareweb_x0020_ID : any ;

   if(NewArrayBackup.length > 0 && NewArrayBackup != undefined ){
    if(NewArrayBackup[0]?.SharewebTaskType?.Title == "Workstream"){
      ParentTaskId = NewArrayBackup[0].Id;
      Shareweb_x0020_ID = NewArrayBackup[0].Shareweb_x0020_ID + "-" + "T"+checkedList[0].Id;
      SharewebTaskTypeId = 2; 
    }
   }


   let web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(checkedList[0].listId).items
    .getById(checkedList[0].Id)
    .update({
          Shareweb_x0020_ID:Shareweb_x0020_ID,
          SharewebTaskTypeId:SharewebTaskTypeId,
          ParentTaskId : ParentTaskId
    })
    .then((res: any) => {
      let checkUpdate : number = 1;
      let backupCheckedList :any =[];
      let latestCheckedList:any =[] ; 
      checkedList.map((items:any)=>{
        latestCheckedList.push({...items})
        backupCheckedList.push({...items})
      })
      
      latestCheckedList?.map((items:any)=>{
          items.Parent = {Id:ParentTaskId,Shareweb_x0020_ID:Shareweb_x0020_ID,Title:NewArrayBackup[0]?.Title},
          items.Shareweb_x0020_ID = Shareweb_x0020_ID,
          items.SharewebTaskType = {Id:2,Title:"Task",Level:2}       
   })

         
          let array = data;
          array.forEach((obj:any , index:any) => {
            obj.isRestructureActive = false;
            if(obj.Id === NewArrayBackup[0]?.Id && obj.Item_x0020_Type === NewArrayBackup[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === NewArrayBackup[0]?.SharewebTaskType?.Title && checkUpdate != 3 ){
              obj.subRows.push(...latestCheckedList);
              obj.childs.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
     }
     if(obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3){
                   array.splice(index,1);
                   checkUpdate = checkUpdate + 1;
     }
            if (obj.childs != undefined && obj.childs.length > 0) {
              obj.childs.forEach((sub: any,indexsub:any) => {
                sub.isRestructureActive = false;
                if(sub.Id === NewArrayBackup[0]?.Id && sub.Item_x0020_Type === NewArrayBackup[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === NewArrayBackup[0]?.SharewebTaskType?.Title  && checkUpdate != 3){
                  sub.subRows.push(...latestCheckedList) ;
                  sub.childs.push(...latestCheckedList) ;
                  checkUpdate = checkUpdate + 1;
         }
         if(sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3){
                       array[index]?.subRows.splice(indexsub,1);
                       array[index]?.childs.splice(indexsub,1);
                       checkUpdate = checkUpdate + 1;
         }
                if (sub.childs != undefined && sub.childs.length > 0) {
                  sub.childs.forEach((newsub: any,lastIndex:any) => {
                    newsub.isRestructureActive = false;
                    if(newsub.Id === NewArrayBackup[0]?.Id && newsub.Item_x0020_Type === NewArrayBackup[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === NewArrayBackup[0]?.SharewebTaskType?.Title  && checkUpdate != 3){
                      newsub.subRows.push(...latestCheckedList);
                      newsub.childs.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
             }
             if(newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3){
                           array[index]?.subRows[indexsub]?.subRows.splice(lastIndex,1);
                           array[index]?.childs[indexsub]?.childs.splice(lastIndex,1);
                           checkUpdate = checkUpdate + 1;
             }
                  })
                }
      
              })
            }
      
      
          })
      
          setTopTaskresIcon(false);
          AllTasksRendar = AllTasksRendar?.concat(array)
          finalData=[];
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
    let data2:any= structuredClone(props?.props)
    if (checkData != undefined && checkData != null) {
      if (checkData?.SharewebTaskType?.Title == 'Workstream') {
        checkData['NoteCall'] = 'Task'
       console.log(MeetingItems[MeetingItems.length - 1]) 
       if(MeetingItems[MeetingItems.length - 1]?.ClientTime?.length>0 && MeetingItems[MeetingItems?.length - 1].ClientTime!=undefined){
        MeetingItems[MeetingItems.length - 1].ClientTime=JSON.parse(MeetingItems[MeetingItems?.length - 1]?.ClientTime)
       }
    
        setMeetingPopup(true)
      }
    }
    else {
      if (props.props.SharewebTaskType == 'Workstream') {
        props.props['NoteCall'] = 'Task'
        MeetingItems.push(props.props)
        setMeetingPopup(true)
      }
      if (props.props.SharewebTaskType == 'Activities') {
        let parentcat:any=[];
    
        if(data2?.ClientTime!=null && data2?.ClientTime!=undefined){

          data2.ClientTime=JSON.stringify(data2?.ClientTime)
        }else{
          data2.ClientTime=null
        }
       
        MeetingItems.push(data2)
       setWSPopup(true)
       
    

      }
    }

  }


  // ===========REACT TABLE ==========
  const onChangeHandler = (itrm: any, child: any, e: any) => {
    let checked = e
    if (checked == true) {
      setcheckData(itrm)

      itrm.chekBox = true

      if (itrm.SharewebTaskType == undefined) {
        setActivityDisable(false)
        itrm['siteUrl'] = props?.AllListId?.siteUrl;
        itrm['listName'] = 'Master Tasks';
        MeetingItems.push(itrm)
        //setMeetingItems(itrm);

      }
      if (itrm.SharewebTaskType != undefined) {
        if (itrm.SharewebTaskType.Title == 'Activities' || itrm.SharewebTaskType.Title == "Workstream") {
          setActivityDisable(false)
          // Arrays.push(itrm)
          itrm['PortfolioId'] = child.Id;
          MeetingItems.push(itrm)
          setCount(count + 2)
        }
        if (itrm.SharewebTaskType.Title == 'Task') {
          setActivityDisable(true)
          MeetingItems.push(itrm)

        }
      }
    }
    // if (checked == false) {
    //     itrm.chekBox = false;
    //     setcheckData(null)
    //     MeetingItems?.forEach((val: any, index: any) => {
    //         if (val.Id == itrm.Id) {
    //             MeetingItems.splice(index, 1)
    //         }
    //     })
    //     if (itrm.SharewebTaskType != undefined) {
    //         if (itrm.SharewebTaskType.Title == 'Task') {
    //             setActivityDisable(false)

    //         }
    //     }
    //     setCount(count + 2)
    // }
    var list: any = []
    if (checkedList.length > 0) {
      list = checkedList;
    }

    var flag = true;
    list?.forEach((obj: any, index: any) => {
      if (obj.Id != undefined && itrm?.Id != undefined && obj.Id === itrm.Id) {
        flag = false;
        list.splice(index, 1);
      }
    })
    if (itrm.SharewebTaskType?.Title == 'Task') {
      setActivityDisable(false)
    }
    if (flag)
      list.push(itrm);
    console.log(list);
    // list?.forEach((items:any)=>{
    //     checkedList.push(items)
    // })
   
    setCheckedList(checkedList => (list));
    // if (list.length === 0)
    //   clearreacture();
  };
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
      if (itrm?.Item_x0020_Type == "Component") {
        onChangeHandler(itrm, 'parent', eTarget);
      } else {
        onChangeHandler(itrm, props, eTarget);
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
  return (

    <div className={IsUpdated === 'Events' ? 'app component eventpannelorange' : (IsUpdated == 'Service' ? 'app component serviepannelgreena' : 'app component')}>
      <div className="Alltable mt-10">
        <div className="tbl-headings">
          <span className="leftsec">
            <span className=''>
              {componentDetails !== undefined && props.props.ParentTask != undefined && props.props.ParentTask.Title != undefined &&
                <>
                  <img className='icon-sites-img ml20' src={componentDetails.SiteIcon} />
                  {'>'} <img className='icon-sites-img ml20' src={props.props.ParentIcon} />
                  {'>'} <img className='icon-sites-img ml20' src={props.props.CurrentIcon} /> <a>{props.props.Title}</a>
                </>
              }
              {componentDetails === undefined && props.props.ParentTask != undefined && props.props.ParentTask.Title != undefined &&
                <>

                  <img className='icon-sites-img ml20' src={props.props.ParentIcon} />
                  {'>'} <img className='icon-sites-img ml20' src={props.props.CurrentIcon} /> <a>{props.props.Title}</a>
                </>
              }
              {componentDetails !== undefined && props.props.ParentTask === undefined &&
                <>
                  <img className='icon-sites-img ml20' src={componentDetails.SiteIcon} />
                  {'>'} <img className='icon-sites-img ml20' src={props.props.CurrentIcon} /> <a>{props.props.Title}</a>
                </>
              }
            </span>
            <span className="g-search">
              <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all"
                ng-model="SearchComponent.GlobalSearch" />
              <span className="gsearch-btn" ng-click="SearchAll_Item()"><i className="fa fa-search"></i></span>
            </span>
          </span>
          <span className="toolbox mx-auto">

            <button type="button"
              className="btn btn-primary"
              onClick={() => openActivity()}
              disabled={checkData?.SharewebTaskType?.Title === "Task" ? true : false}>
              Add Workstream-Task
            </button>
            <button type="button"
              className="btn btn-primary" disabled={table?.getSelectedRowModel()?.flatRows.length === 0 || table?.getSelectedRowModel()?.flatRows.length > 1 ? true : false}
              onClick={buttonRestructuring}>
              Restructure
            </button>
            {/* <button type="button"
                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                            disabled={true}>
                            Compare
                        </button> */}
            {/* <a className='expand'>
                                            <ExpndTable prop={expndpopup} prop1={tablecontiner} />
                                        </a>
                        <a>
                            <Tooltip ComponentId='1748'/>
                            
                        </a> */}
          </span>
        </div>
        <div className="col-sm-12 pad0 smart" >
          <div className="">
            <div className={`${data.length > 10 ? "wrapper" : "MinHeight"}`}>
              <table className="SortingTable table table-hover" style={{ width: "100%" }}>
                <thead className='fixed-Header top-0'>
                  {table.getHeaderGroups().map((headerGroup: any) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header: any) => {
                        return (
                          <th key={header.id} colSpan={header.colSpan} style={{ width: header.column.columnDef.size + "%" }}>
                            {header.isPlaceholder ? null : (
                              <div className='position-relative' style={{ display: "flex" }}>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getCanFilter() ? (

                                  <Filter column={header.column} table={table} placeholder={header.column.columnDef} />

                                ) : null}
                                {header.column.getCanSort() ? <div
                                  {...{
                                    className: header.column.getCanSort()
                                      ? "cursor-pointer select-none shorticon"
                                      : "",
                                    onClick: header.column.getToggleSortingHandler(),
                                  }}
                                >
                                  {header.column.getIsSorted()
                                    ? { asc: <FaSortDown />, desc: <FaSortUp /> }[
                                    header.column.getIsSorted() as string
                                    ] ?? null
                                    : <FaSort />}
                                </div> : ""}
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  <Loader loaded={loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color={IsUpdated == 'Events Portfolio' ? '#f98b36' : (IsUpdated == 'Service Portfolio' ? '#228b22' : '#000069')} speed={2} trail={60} shadow={false}
                    hwaccel={false} className="spinner" zIndex={2e9} top="28%" left="50%" scale={1.0} loadedClassName="loadedContent" />

                  {table.getRowModel().rows.map((row: any) => {
                    return (
                      <tr
                        key={row.id}>
                        {row.getVisibleCells().map((cell: any) => {
                          return (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
           <span>{`All below selected items will be added as ${checkedList[0]?.SharewebTaskType?.Title}`}</span>
           <div className='mt-2' >Select Task Type : 
           <span>
           <input
                  type="radio"
                   name="fav_language"
                   value="Workstream"
                   checked={
                    checkedList[0]?.SharewebTaskType?.Title == "Workstream"
                       ? true
                       : false
                   }
                   onChange={(e) =>setRestructure(e)}
                 />
                 <label className="ms-1"> {"Workstream"} </label>
           </span>
           <span>
           <input
                  type="radio"
                   name="fav_language"
                   value="Task"
                   checked={
                    checkedList[0]?.SharewebTaskType?.Title == "Task"
                       ? true
                       : false
                   }
                   onChange={(e) =>setRestructure(e)}
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
      <CreateActivity props={MeetingItems[MeetingItems.length - 1]} 
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

