import * as React from 'react';
import * as Moment from 'moment';
import { ICategoriesWeeklyMultipleReportProps } from './ICategoriesWeeklyMultipleReportProps';
import './SPfoudationSupport.scss';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { SPComponentLoader } from '@microsoft/sp-loader';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ColumnDef } from '@tanstack/react-table';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import Tooltip from "../../../globalComponents/Tooltip";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { Panel, PanelType } from "office-ui-fabric-react";
import * as globalCommon from "../../../globalComponents/globalCommon";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import * as XLSX from "xlsx";
import FileSaver from 'file-saver';
import PreSetDatePikerPannel from "../../../globalComponents/SmartFilterGolobalBomponents/PreSetDatePiker"
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';
import PreSetDatePikerPannel2 from '../../../globalComponents/SmartFilterGolobalBomponents/PreSetDatePikerCate';
//import alasql from 'alasql';
let AllMasterTasks: any = [];
let portfolioColor: any = '';
var AllListId: any;
export interface ICategoriesWeeklyMultipleReportState {
  Result: any;
  taskUsers: any;
  checked: any;
  expanded: any;
  filterItems: any;
  ImageSelectedUsers: any;
  startdate: Date;
  enddate: Date;
  SitesConfig: any;
  AllTimeEntry: any;
  SelectGroupName: any;
  opentaggedtask: any;
  openTaggedTaskArray: any;
  IsTimeEntry: any;
  SharewebTimeComponent: any;
  SelecteddateChoice: any;
  PresetData: any;
  AllTimeEntryItem: any;
  PresetPopup: any;
  showDateTime: any;
  AdjustedTimePopup: any;
  AdjustedTimeArray: any;
  AdjustedTimeType: any;
  filledeDays: any;
  AdjustedTimeCalcuValue: any;
  AllTimeEntryBackup: any;
  QuickEditItem: any;
  defaultValuequick: any;
  IsCheckedComponent: boolean;
  IsCheckedService: boolean;
  StartDatePicker: any;
  StartEndPicker: any;
  isFocused: any;
  checkedAll: boolean;
  IsTask: boolean;
  checkedItems: any;
  EditTaskItem: any;
  Preset2Popup:any;
  StartDatePicker2: any;
  EndDatePicker2: any;

}

export default class CategoriesWeeklyMultipleReport extends React.Component<ICategoriesWeeklyMultipleReportProps, ICategoriesWeeklyMultipleReportState> {
  // columns: ({ accessorKey: any; placeholder: string; hasCheckbox: boolean; hasCustomExpanded: boolean; hasExpanded: boolean; size: number; id: string; header?: undefined; resetColumnFilters?: undefined; } | { accessorKey: string; placeholder: string; header: string; resetColumnFilters: boolean; size: number; id: string; hasCheckbox?: undefined; hasCustomExpanded?: undefined; hasExpanded?: undefined; })[];
  columns: any;
  timePopup: any;
  public constructor(props: ICategoriesWeeklyMultipleReportProps, state: ICategoriesWeeklyMultipleReportState) {
    super(props);

    this.state = {
      Result: {},
      taskUsers: [],
      checked: [],
      expanded: [],
      filterItems: [],
      ImageSelectedUsers: [],
      startdate: new Date(),
      enddate: new Date(),
      SitesConfig: [],
      AllTimeEntry: [],
      SelectGroupName: '',
      opentaggedtask: false,
      openTaggedTaskArray: [],
      IsTimeEntry: false,
      SharewebTimeComponent: [],
      SelecteddateChoice: 'Last3Month',

      PresetData: {},
      AllTimeEntryItem: [],
      PresetPopup: false,
      showDateTime: '',
      AdjustedTimePopup: false,
      AdjustedTimeArray: [{ 'Title': 'Percentage', 'rank': 1 }, { 'Title': 'Divide', 'rank': 2 }],
      AdjustedTimeType: 'Divide',
      filledeDays: '',
      AdjustedTimeCalcuValue: 1,
      AllTimeEntryBackup: [],
      QuickEditItem: {},
      defaultValuequick: 0,
      IsCheckedComponent: true,
      IsCheckedService: true,
      StartDatePicker: new Date(),
      StartEndPicker: new Date(),
      isFocused: false,
      checkedAll: false,
      IsTask: false,
      checkedItems: [],
      EditTaskItem: '',
      Preset2Popup:false,
      StartDatePicker2: new Date(),
      EndDatePicker2: new Date(),
    }
    //this.GetResult();   
    this.columns = [


      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: false,
        hasCustomExpanded: true,
        hasExpanded: true,
        size: 55,
        id: 'Id',
      },
      {
        accessorKey: "getUserName",
        placeholder: "User Name",
        header: "",
        resetColumnFilters: false,
        size: 190,
        id: "getUserName",
      },
      {
        accessorKey: "Firstlevel",
        placeholder: "Site",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "Firstlevel",
      },
      {

        accessorKey: "Secondlevel",
        placeholder: "First level",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "Secondlevel",
      },
      {
        accessorFn: (row: any) => row?.Secondlevel,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.childs?.length === 0 ? (
                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank"
                  onClick={(e) => this.ShowAllTask(e, row)} >
                  {row?.original?.TotalValue}
                </a>
              ) : (
                <span>{row?.original?.TotalValue}</span>
              )}
            </span>
          </div>
        ),
        accessorKey: "TotalValue",
        placeholder: "Time",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "TotalValue",
      },
      {
        accessorFn: (row: any) => row?.CategoriesItems,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.CategoriesItems !== undefined ? (
                <span>
                  {row?.original?.CategoriesItems}
                </span>
              ) : (
                <span>{row?.original?.clientCategory}</span>
              )}
            </span>
          </div>
        ),
        accessorKey: "clientCategory",
        placeholder: "Categories",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "clientCategory",
      },
      {
        accessorFn: (row: any) => row?.TotalValue,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.TotalValue !== undefined ? (
                <span>
                  {row?.original?.TotalValue}
                </span>
              ) : (
                <span>{row?.original?.TotalSmartTime}</span>
              )}
            </span>
          </div>
        ),
        accessorKey: "TotalSmartTime",
        placeholder: "Smart Hours",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "TotalSmartTime",
      },
      {
        accessorFn: (row: any) => row?.SmartHoursTotal,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.SmartHoursTotal !== undefined ? (
                <span>
                  {row?.original?.SmartHoursTotal}
                </span>
              ) : (
                <span>{row?.original?.SmartHoursTime}</span>
              )}
            </span>
          </div>
        ),
        accessorKey: "SmartHoursTime",
        placeholder: "Smart Hours (Roundup)",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "SmartHoursTime",
      },
      {
        accessorKey: "AdjustedTime",
        placeholder: "Adjusted Hours ",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "AdjustedTime",
      },
      {
        accessorFn: (row: any) => row?.SmartHoursTotal,
        cell: ({ row }: any) => (
          <div className="alignCenter" >
            {/* //  */}
            <span className="columnFixedTitle">
              {row?.original?.RoundAdjustedTime !== undefined ? (

                <span  >
                  {row?.original?.RoundAdjustedTime}
                </span>


              ) : (
                <span>
                  {row?.original?.QuickEditItem != undefined && row?.original?.QuickEditItem === false && <span className={row?.original?.IsColor === true ? "NumberchangeGreen" : ""} onDoubleClick={(e) => this.InlineUpdate(e, row?.original, row)}>{row?.original?.Rountfiguretime}</span>}
                  {row?.original?.QuickEditItem != undefined && row?.original?.QuickEditItem === true && <span>
                    <input type="text" className="width-75" defaultValue={row?.original?.Rountfiguretime} onMouseOut={(e) => this.hideItems(e, row)} onChange={(e) => { this.changeRoutfigureTime(e, row?.original) }}></input>
                  </span>}
                </span>
              )}
            </span>
          </div>
        ),
        accessorKey: "Rountfiguretime",
        placeholder: "Adjusted Hours (Roundup)",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "Rountfiguretime",
      },

    ]
    this.timePopup = [


      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: false,
        hasCustomExpanded: false,
        hasExpanded: false,
        isHeaderNotAvlable: true,
        size: 55,
        id: 'Id',
      },
      {
        cell: ({ row }: any) => (
          <div className="alignCenter">
            {row?.original?.siteImage != undefined && (
              <div className="alignCenter" title="Show All Child">
                <img className='Dyicons' title={row?.original?.TaskType?.Title}
                  src={row?.original?.siteImage}>
                </img>
              </div>
            )}
          </div>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 95,
      },
      {
        accessorKey: "TaskID",
        placeholder: "Task ID",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "TaskID",
      },
      {
        accessorFn: (row: any) => row?.TaskTitle,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                href={this.props.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.TaskItemID + "&Site=" + row?.original?.siteType} >
                {row?.original?.TaskTitle}
                {/* <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /> */}
              </a>

            </span>
          </div>
        ),
        accessorKey: "TaskTitle",
        placeholder: "Title",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "TaskTitle",
      },
      {
        accessorFn: (row: any) => row?.clientCategory,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.clientCategory !== undefined ? (
                <span>
                  {row?.original?.clientCategory}
                </span>
              ) : (
                <span>{row?.original?.clientCategory}</span>
              )}
            </span>
          </div>
        ),
        accessorKey: "clientCategory",
        placeholder: "Categories",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "clientCategory",
      },
      {
        accessorFn: (row: any) => row?.TaskDate,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.TaskDate !== undefined ? (
                <span>
                  {row?.original?.TaskDate}
                </span>
              ) : (
                <span>{row?.original?.TaskDate}</span>
              )}
            </span>
          </div>
        ),
        accessorKey: "TaskDate",
        placeholder: "StartDate",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "TaskDate",
      },
      {
        accessorFn: (row: any) => row?.Effort,
        cell: ({ row }: any) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.Effort !== undefined ? (
                <span>
                  {row?.original?.Effort}
                </span>
              ) : (
                <span>{row?.original?.Effort}</span>
              )}
            </span>
          </div>
        ),
        accessorKey: "Effort",
        placeholder: "Effort",
        header: "",
        resetColumnFilters: false,
        size: 91,
        id: "Effort",
      },
      {
        accessorFn: (row: any) => row?.TotalTaskTime,
        cell: ({ row }: any) => (
          <>
            {row?.original?.siteType != "Master Tasks" && (
              <a className="alignCenter justify-content-center" onClick={(e) => this.EditDataTimeEntryData(e, row.original)}
                data-bs-toggle="tooltip"
                data-bs-placement="auto"
                title="Click To Edit Timesheet"><span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : {}} >{row?.original?.TotalTaskTime}</span><span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
              </a>
            )}
          </>
        ),
        id: "TotalTaskTime",
        placeholder: "Smart Time",
        header: "",
        resetColumnFilters: false,
        size: 50,
      }, {
        cell: ({ row }: any) => (
          <>
            {row?.original?.siteType != "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a className="alignCenter"
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title={'Edit ' + `${row.original.Title}`}
                >
                  {" "}
                  <span
                    className="svg__iconbox svg__icon--edit"
                    onClick={(e) => this.EditItemTaskPopup(row?.original)}
                  ></span>
                </a>
              )}

          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 30,
      },


    ]
    AllListId = this.props;
    AllListId.isShowTimeEntry = this.props.TimeEntry;
    AllListId.isShowSiteCompostion = this.props.SiteCompostion
    this.GetComponents();
    this.GetTaskUsers();
    this.LoadAllMetaDataFilter();
    this.SelectedPortfolioItem = this.SelectedPortfolioItem.bind(this);
    this.GetAllSiteTaskData = this.GetAllSiteTaskData.bind(this);
    this.callBackData = this.callBackData.bind(this);
    
  }
  rerender = () => {
    this.setState({});
  };
  private renderData: any = [];
  // private inputClassName = this?.state?.isFocused ? 'NumberchangeGreen' : '';
  private changeRoutfigureTime = (e: any, item: any) => {
    this.setState({ defaultValuequick: item.Rountfiguretime });
    item.Rountfiguretime = e.target.value;
    this.rerender();
  }
  callBackData(checkData: any) {
    // You can now use this.setState to update your component's state
    // if (checkData !== undefined) {
    //   this.setState({ checkedList: checkData });
    // } else {
    //   this.setState({ checkedList: {} });
    // }
  }
  private EditItemTaskPopup = (item: any) => {
    this.setState({ IsTask: true, EditTaskItem: item });
  };
  private refreshData = () => this.setState(() => this.renderData);
  private InlineUpdate = (e: any, item: any, parent: any) => {

    console.log(item);
    item.QuickEditItem = item.QuickEditItem === false ? true : item.QuickEditItem;
    item.IsColor = true;
    this.setState({ QuickEditItem: JSON.stringify(item) })
    this.setState({
      isFocused: true,
    })

  }
  private hideItems = function (e: any, item: any) {
    let falg: any = false;
    let QuickEditItem = JSON.parse(this?.state?.QuickEditItem);
    item?.getParentRows()[0]?.original?.subRows?.forEach((obj: any) => {
      if (obj.QuickEditItem === true) {
        item.getParentRows()[0].original.RoundAdjustedTime = ((parseFloat(item?.getParentRows()[0]?.original?.RoundAdjustedTime || 0) + parseFloat(obj?.Rountfiguretime || 0)))
        item.getParentRows()[0].original.RoundAdjustedTime = ((parseFloat(item?.getParentRows()[0]?.original?.RoundAdjustedTime || 0) - parseFloat(QuickEditItem?.Rountfiguretime || 0)))// + (parseFloat(item?.RoundAdjustedTime) + parseFloat(obj.Rountfiguretime)))
        this.RoundAdjustedTimeTimeEntry = (parseFloat(this.RoundAdjustedTimeTimeEntry || 0) - parseFloat(QuickEditItem?.Rountfiguretime || 0))
        this.RoundAdjustedTimeTimeEntry = (parseFloat(this.RoundAdjustedTimeTimeEntry || 0) + parseFloat(obj.Rountfiguretime || 0))
        obj.QuickEditItem = false;
        obj.IsColor = true;

      }
    })
    this.setState({
      showDateTime: (
        <span className='alignCenter'>
          <label className='ms-1'> | Time: {this?.TotalTimeEntry} | hours ({this?.TotalTimeEntry / 8} days)</label>
          <label className="mx-1">|</label>
          <label>
            <div className="">Smart Hours: {this?.SmartTotalTimeEntry} ({this?.SmartTotalTimeEntry / 8} days)</div>
            <div className="">Smart Hours (Roundup): {this?.RoundSmartTotalTimeEntry} ({this?.RoundSmartTotalTimeEntry / 8} days)</div>
          </label>
          <label className="mx-1">|</label>
          <label>
            <div className="">Adjusted Hours: {this?.AdjustedimeEntry} hours ({this?.AdjustedimeEntry / 8} days)</div>
            <div className={this?.state?.isFocused === true ? 'NumberchangeGreen' : ''}>Adjusted Hours (Roundup): {this?.RoundAdjustedTimeTimeEntry} ({this?.RoundAdjustedTimeTimeEntry / 8} days)</div>
          </label>
        </span>
      ),
    });
    this.renderData = [];
    this.renderData = this.renderData.concat(this.state.showDateTime)
    this.refreshData();
  }
  private ShowAllTask(e: any, item: any) {
    console.log(item);
    this.setState({ openTaggedTaskArray: item });
    this.setState({ opentaggedtask: true });
  }
  private async GetComponents() {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let componentDetails = [];
    componentDetails = await web.lists
     // .getByTitle('Master Tasks')
      .getById(this.props.MasterTaskListID)
      .items
      .select("ID", "Id", "Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title",
      )
      .expand(
        "PortfolioType"
      )
      .top(4999)
      .get();

    console.log(componentDetails);

    AllMasterTasks = componentDetails

  }
  private async GetTaskUsers() {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let taskUsers = [];
    let results = [];
    results = await web.lists
     // .getByTitle('Task Users')
      .getById(this.props.TaskUsertListID)
      .items
      .select('Id', 'IsShowReportPage', 'UserGroupId', 'UserGroup/Title', 'Suffix', 'SmartTime', 'Title', 'Email', 'SortOrder', 'Role', 'Company', 'ParentID1', 'TaskStatusNotification', 'Status', 'Item_x0020_Cover', 'AssingedToUserId', 'isDeleted', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'ItemType')
      //.filter("ItemType eq 'User'")
      .expand('AssingedToUser', 'UserGroup')
      .orderBy('SortOrder', true)
      .orderBy("Title", true)
      .get();

    for (let index = 0; index < results.length; index++) {
      let element = results[index];
      if (element.UserGroupId == undefined) {
        this.getChilds(element, results);
        if (element?.childs?.length > 0)
          taskUsers.push(element);
      }
    }
    console.log(taskUsers);
    this.GetTimeEntry();
    this.setState({
      taskUsers: taskUsers
    })
  }

  private StartWeekday: any; private endweekday: any;
  private GetTimeEntry() {
    this.selectDate(this.state.SelecteddateChoice);
  }

  private getChilds(item: any, items: any) {
    item.childs = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
        childItem.IsSelected = false
        item.GroupName = childItem?.UserGroup?.Title;
        //if (this.props.Context.pageContext.user. == childItem.AssingedToUserId)
        //childItem.IsSelected = true
        item.childs.push(childItem);
        this.getChilds(childItem, items);
      }
    }

  }




  private async LoadAllMetaDataFilter() {
    //Get Site data and task data
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let AllMetaData = [];
    let ccResults: any = [];
    let sitesResult: any = [];
    let results = [];
    results = await web.lists
      //.getByTitle('SmartMetadata')
      .getById(this.props.SmartMetadataListID)
      .items
      .select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
      .filter("TaxType eq 'Client Category' or TaxType eq 'Sites'")
      .expand('Parent')
      .orderBy('SortOrder', true)
      .orderBy("Title", true)
      .top(1000)
      .get();

    //seperate the items Client Category and Sites
    results.forEach(function (obj: any, index: any) {

      if (obj.TaxType == 'Client Category')
        ccResults.push(obj);
      else
        sitesResult.push(obj)
    });

    this.setState({
      SitesConfig: sitesResult
    }, () => this.loadSmartFilters(ccResults))

  }
  private removeEmptyChildren = (items: any) => {
    return items.map((obj: any) => {
      if (obj.children && obj.children.length === 0) {
        // If 'children' array is empty, remove the 'children' property
        const { children, ...rest } = obj;
        return rest;
      }
      if (obj.children && obj.children.length > 0) {
        // If 'children' array is not empty, recursively process the children
        return {
          ...obj,
          children: this.removeEmptyChildren(obj.children),
        };
      }
      return obj;
    });
  };

  private loadSmartFilters(items: any) {
    let filterGroups = [];
    let filterItems = [];

    for (let index = 0; index < items.length; index++) {
      let filterItem = items[index];
      if (filterItem.SmartFilters != undefined && filterItem.SmartFilters.indexOf('Dashboard') > -1) {
        let item: any = {};
        item.ID = filterItem.Id;
        item.Id = filterItem.Id;
        item.Title = filterItem.Title;
        item.value = filterItem.Id;
        item.label = filterItem.Title;
        item.Group = filterItem.TaxType;
        item.TaxType = filterItem.TaxType;
        //item.Selected = true;
        if (filterItem.ParentID == 0) {
          if (!this.IsExistsData(filterItems, item))
            filterItems.push(item);
          this.getChildsOfFilter(item, items);
          if (item.children != undefined && item.children.length > 0) {
            for (let j = 0; j < item.children.length; j++) {
              let obj = item.children[j];
              if (obj.Title == 'Other')
                obj.ParentTitle = item.Title;
            }
          }
          if (filterGroups.length == 0 || filterGroups.indexOf(filterItem.TaxType) == -1) {
            filterGroups.push(filterItem.TaxType);
          }
        }
      }
    }

    console.log(filterGroups);
    console.log(filterItems);
    const updatedItems = this.removeEmptyChildren(filterItems);
    this.setState({
      filterItems: updatedItems
    })
  }

  private IsExistsData(array: any, Id: any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.Id == Id) {
        isExists = true;
        return false;
      }
    }
    return isExists;
  }

  private getChildsOfFilter(item: any, items: any) {
    item.children = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      childItem.value = items[index].Id;
      childItem.label = items[index].Title;
      if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
        item.children.push(childItem);
        this.getChildsOfFilter(childItem, items);
      }
    }
  }

  private SelectAllGroupMember(ev: any) {
    //$scope.SelectGroupName = ''
    let select = ev.currentTarget.checked;
    let ImageSelectedUsers: any = [];
    if (select == true) {
      this.state.taskUsers.forEach((item: any) => {
        item.SelectedGroup = select;
        if (item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = select;
          item.childs.forEach((child: any) => {
            child.IsSelected = true;
            try {
              document.getElementById('UserImg' + child.Id).classList.add('seclected-Image');
              document.getElementById('UserImg' + child.Id).classList.add('activeimg');
              if (child.Id != undefined && !this.isItemExists(ImageSelectedUsers, child.Id))
                ImageSelectedUsers.push(child)
            } catch (error) {

            }

          })
        }
      })
    }
    else if (select == false) {
      this.state.taskUsers.forEach((item: any) => {
        if (item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = select;
          item.childs.forEach((child: any) => {
            child.IsSelected = false;
            try {
              document.getElementById('UserImg' + child.Id).classList.remove('seclected-Image');
              document.getElementById('UserImg' + child.Id).classList.remove('activeimg');
              ImageSelectedUsers = [];

            } catch (error) {

            }

          })
        }
      })
    }
    let SelectGroupName: any = '';
    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.GroupName + ' ,'
    })
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    this.setState({
      SelectGroupName
    }, () => console.log(this.state.ImageSelectedUsers));
    this.setState({
      ImageSelectedUsers
    }, () => console.log(this.state.ImageSelectedUsers));
    this.rerender();

  }

  private SelectUserImage(ev: any, item: any, Parent: any) {
    console.log(`The option ${ev.currentTarget.title}.`);
    console.log(item);
    console.log(Parent);
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (ev.currentTarget.className.indexOf('seclected-Image') > -1) {
      ev.currentTarget.classList.remove('seclected-Image');
      document.getElementById('UserImg' + item.Id).classList.remove('activeimg');
      item.IsSelected = false;
      for (let index = 0; index < ImageSelectedUsers.length; index++) {
        let sel = ImageSelectedUsers[index];
        if (sel.Id != undefined && item.Id != undefined && sel.Id == item.Id) {
          item.IsSelected = false;
          ImageSelectedUsers.splice(index, true);
          break;
        }
      }
    }
    else {
      ev.currentTarget.classList.add('seclected-Image'); //add element
      document.getElementById('UserImg' + item.Id).classList.add('activeimg');
      item.IsSelected = true;
      ImageSelectedUsers.push(item);
    }

    //need to check uncheck the group       
    this.state.taskUsers.forEach((user: any) => {
      if (Parent.Id == user.Id && user.childs != undefined && user.childs.length > 0) {
        let IsNeedToCheckParent = true;
        let IsNeedToUncheckParent = true;
        user.childs.forEach((child: any) => {
          if (child.IsSelected == true) {
            IsNeedToCheckParent = true
          }
          if (child.IsSelected == false) {
            IsNeedToCheckParent = false
          }
        })
      }
    })
    let SelectGroupName: any = '';
    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.GroupName + ' ,'
    })
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    this.setState({
      SelectGroupName
    }, () => console.log(this.state.ImageSelectedUsers));
    this.setState({
      ImageSelectedUsers
    }, () => console.log(this.state.ImageSelectedUsers));
    this.rerender();
  }

  private SelectedGroup(ev: any, user: any) {
    console.log(ev.currentTarget.checked)
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    let selected = ev.currentTarget.checked;
    if (selected) {
      for (let index = 0; index < this.state.taskUsers.length; index++) {
        let item = this.state.taskUsers[index];
        if (item.Title == user.Title && item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = selected;
          item.childs.forEach((child: any) => {
            child.IsSelected = true;
            document.getElementById('UserImg' + child.Id).classList.add('seclected-Image');
            document.getElementById('UserImg' + child.Id).classList.add('activeimg');
            if (child.Id != undefined && !this.isItemExists(this.state.ImageSelectedUsers, child.Id))
              ImageSelectedUsers.push(child)
          })
        }
      }
    } else {
      for (let index = 0; index < this.state.taskUsers.length; index++) {
        let item = this.state.taskUsers[index];
        if (item.Title == user.Title && item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = selected;
          item.childs.forEach((child: any) => {
            child.IsSelected = false;
            document.getElementById('UserImg' + child.Id).classList.remove('seclected-Image');
            document.getElementById('UserImg' + child.Id).classList.remove('activeimg');
            for (let k = 0; k < ImageSelectedUsers.length; k++) {
              let el = ImageSelectedUsers[k];
              if (el.Id == child.Id)
                ImageSelectedUsers.splice(k, true);
            }
          })
        }
      }
    }
    let SelectGroupName: any = '';
    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.GroupName + ' ,'
    })
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    this.setState({
      SelectGroupName
    }, () => console.log(this.state.ImageSelectedUsers));
    this.setState({
      ImageSelectedUsers: ImageSelectedUsers
    }, () => console.log(this.state.ImageSelectedUsers))
    this.rerender();
  }

  private isItemExists(array: any, items: any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.ID == items)
        return true;
      else return false;
    }
    return isExists;
  }

  private setStartDate(dt: any) {
    this.setState({
      startdate: dt,
      SelecteddateChoice: 'Custom',
    });
  }

  private setEndDate(dt: any) {
    this.setState({
      enddate: dt,
      SelecteddateChoice: 'Custom',
    });
  }

  private selectDate(type: string) {
    let startdt = new Date(), enddt = new Date(), tempdt = new Date();
    let diff, lastday;
    switch (type) {
      case 'Custom':
        break;

      case 'today':
        break;

      case 'yesterday':
        startdt.setDate(startdt.getDate() - 1);
        enddt.setDate(enddt.getDate() - 1);
        break;

      case 'ThisWeek':
        diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(startdt.setDate(diff));

        lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
        enddt = new Date(enddt.setDate(lastday));;
        enddt = new Date();
        break;

      case 'LastWeek':
        tempdt = new Date();
        tempdt = new Date(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate() - 7);

        diff = tempdt.getDate() - tempdt.getDay() + (tempdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(tempdt.setDate(diff));

        lastday = tempdt.getDate() - (tempdt.getDay() - 1) + 6;
        enddt = new Date(tempdt.setDate(lastday));
        break;

      case 'EntrieMonth':
        startdt = new Date(startdt.getFullYear(), startdt.getMonth(), 1);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth() + 1, 0);
        break;

      case 'LastMonth':
        startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 1);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
        break;

      case 'Last3Month':
        startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 3);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
        break;

      case 'EntrieYear':
        startdt = new Date(new Date().getFullYear(), 0, 1);
        enddt = new Date(new Date().getFullYear(), 11, 31);
        break;

      case 'LastYear':
        startdt = new Date(new Date().getFullYear() - 1, 0, 1);
        enddt = new Date(new Date().getFullYear() - 1, 11, 31);
        break;

      case 'AllTime':
        startdt = new Date('2017/01/01');
        enddt = new Date();
        break;

      case 'Presettime':
        startdt = new Date(this.state?.StartDatePicker);
        enddt = new Date(this.state?.StartEndPicker);
        break;
      case 'Presettime1':
        startdt = new Date(this.state?.StartDatePicker2);
        enddt = new Date(this.state?.EndDatePicker2);
        break;
    }

    this.setState({
      startdate: startdt,
      enddate: enddt,
      SelecteddateChoice: type,
    })
    this.rerender();
  }

  private updatefilter() {
    if (this.state.ImageSelectedUsers == undefined || this.state.ImageSelectedUsers.length == 0) {
      alert('Please Select User');
      return false;
    }
    else {
      this.generateTimeEntry();
    }
  }

  private async generateTimeEntry() {
    //Create filter Creteria based on Dates and Selected users
    //let filters = '(('; //use when with date filter
    let filters = '('; //use when without date filter
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (ImageSelectedUsers != undefined && ImageSelectedUsers.length > 0) {
      ImageSelectedUsers.forEach(function (obj: any, index: any) {
        if (obj != undefined && obj.AssingedToUserId != undefined) {
          if (ImageSelectedUsers != undefined && ImageSelectedUsers.length - 1 == index)
            filters += "(Author eq '" + obj.AssingedToUserId + "')";
          else
            filters += "(Author eq '" + obj.AssingedToUserId + "') or ";
        }
      });
      //filters += ") and ((TaskDate le '"+ this.state.enddate.toISOString()  +"') and ";
      //filters += "(TaskDate ge '"+ this.state.startdate.toISOString()  +"'))";   
      filters += ")";
    }

    console.log(filters);

    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let resultsOfTimeSheet2 = await web.lists
      .getByTitle('TasksTimesheet2')
      .items
      .select('Id', 'Title', 'TaskDate', 'TaskTime', 'AdditionalTimeEntry', 'Description', 'Modified', 'TaskMigration/Id', 'TaskMigration/Title', 'TaskMigration/Created', 'AuthorId')
      .filter(filters)
      .expand('TaskMigration')
      .getAll(4999);
    console.log(resultsOfTimeSheet2);

    let resultsofTimeSheetNew = await web.lists
      .getByTitle('TaskTimeSheetListNew')
      .items
      .select('Id', 'Title', 'TaskDate', 'TaskTime', 'AdditionalTimeEntry', 'Description', 'Modified', 'AuthorId', 'TaskGruene/Id', 'TaskGruene/Title', 'TaskGruene/Created', 'TaskDE/Id', 'TaskDE/Title', 'TaskDE/Created', 'TaskEducation/Id', 'TaskEducation/Title', 'TaskEducation/Created', 'TaskEI/Id', 'TaskEI/Title', 'TaskEI/Created', 'TaskEPS/Id', 'TaskEPS/Title', 'TaskEPS/Created', 'TaskGender/Id', 'TaskGender/Title', 'TaskGender/Created', 'TaskHealth/Id', 'TaskHealth/Title', 'TaskHealth/Created', 'TaskHHHH/Id', 'TaskHHHH/Title', 'TaskHHHH/Created', 'TaskKathaBeck/Id', 'TaskKathaBeck/Title', 'TaskKathaBeck/Created', 'TaskQA/Id', 'TaskQA/Title', 'TaskQA/Created', 'TaskShareweb/Id', 'TaskShareweb/Title', 'TaskShareweb/Created', 'TaskOffshoreTasks/Id', 'TaskOffshoreTasks/Title', 'TaskOffshoreTasks/Created')
      .filter(filters)
      .expand('TaskGruene', 'TaskDE', 'TaskEducation', 'TaskEI', 'TaskEPS', 'TaskGender', 'TaskHealth', 'TaskHHHH', 'TaskKathaBeck', 'TaskQA', 'TaskShareweb', 'TaskOffshoreTasks')
      .getAll(4999);
    console.log(resultsofTimeSheetNew);

    let AllTimeSheetResult = (resultsOfTimeSheet2).concat(resultsofTimeSheetNew);
    console.log(AllTimeSheetResult);

    this.LoadTimeSheetData(AllTimeSheetResult);

  }

  private LoadTimeSheetData(AllTimeSheetResult: any) {
    let AllTimeSpentDetails: any = [];
    let getSites = this.state.SitesConfig;
    AllTimeSheetResult.forEach(function (timeTab: any) {
      for (let i = 0; i < getSites.length; i++) {
        let config = getSites[i];
        let ColumnName = ""
        if (config.Title != undefined && config.Title.toLowerCase() == "offshore tasks")
          ColumnName = "Taskoffshoretasks";
        else ColumnName = "Task" + config.Title
        if (timeTab[ColumnName] != undefined && timeTab[ColumnName].Title != undefined) {
          timeTab.selectedSiteType = config.Title;
          timeTab.getUserName = '';
          timeTab.siteType = config.Title;
          timeTab.SiteIcon = '';
          timeTab.ImageUrl = config.ImageUrl;
          timeTab.TaskItemID = timeTab[ColumnName].Id;
          timeTab.TaskTitle = timeTab[ColumnName].Title;
          timeTab.TaskCreated = timeTab[ColumnName].Created;

          AllTimeSpentDetails.push(timeTab);
        }
      }
    })
    console.log(AllTimeSpentDetails);

    let getAllTimeEntry = [];
    for (let i = 0; i < AllTimeSpentDetails.length; i++) {
      let time = AllTimeSpentDetails[i];
      time.MileageJson = 0;
      let totletimeparent = 0;
      if (time.AdditionalTimeEntry != undefined) {
        let Additionaltimeentry = JSON.parse(time.AdditionalTimeEntry);
        for (let index = 0; index < Additionaltimeentry.length; index++) {
          let addtime = Additionaltimeentry[index];
          if (addtime.TaskDate != undefined) {
            let TaskDateConvert = addtime.TaskDate.split("/");
            let TaskDate = new Date(TaskDateConvert[2] + '/' + TaskDateConvert[1] + '/' + TaskDateConvert[0]);
            if (TaskDate >= this.state.startdate && TaskDate <= this.state.enddate) {
              let hours = addtime.TaskTime;
              let minutes = hours * 60;
              addtime.TaskItemID = time.TaskItemID;
              addtime.SiteUrl = time.SiteUrl;
              totletimeparent = minutes;
              addtime.MileageJson = totletimeparent;
              addtime.getUserName = ''//$scope.getUserName;
              addtime.Effort = parseInt(addtime.MileageJson) / 60;
              addtime.Effort = addtime.Effort.toFixed(2);
              addtime.Effort = parseFloat(addtime.Effort);
              addtime.TimeEntrykDate = addtime.TaskDate;
              let datesplite = addtime.TaskDate.split("/");
              addtime.TimeEntrykDateNew = new Date(parseInt(datesplite[2], 10), parseInt(datesplite[1], 10) - 1, parseInt(datesplite[0], 10));
              addtime.TimeEntrykDateNewback = datesplite[1] + '/' + datesplite[0] + '/' + datesplite[2];
              addtime.TaskTitle = time.TaskTitle;
              addtime.ID = time.ID;
              addtime.Title = time.Title;
              addtime.selectedSiteType = time.selectedSiteType;
              addtime.siteType = time.siteType;
              addtime.SiteIcon = ''//SharewebCommonFactoryService.GetIconImageUrl(addtime.selectedSiteType, _spPageContextInfo.webAbsoluteUrl);
              addtime.ImageUrl = time.ImageUrl;
              if (time.TaskCreated != undefined)
                addtime.TaskCreatednew = this.ConvertLocalTOServerDate(time.TaskCreated, 'DD/MM/YYYY');
              getAllTimeEntry.push(addtime);
            }
          }
        }
      }
    }

    console.log(getAllTimeEntry);
    this.getJSONTimeEntry(getAllTimeEntry);
  }

  private getJSONTimeEntry(getAllTimeEntry: any) {
    let requestcounter = 0;
    let filterItemTimeTab = [];
    let copysitesConfi = this.state.SitesConfig;
    copysitesConfi.forEach(function (confi: any) {
      confi.CopyTitle = confi.Title;
      if (confi.Title != undefined && confi.Title.toLowerCase() == "offshore tasks")
        confi.Title = confi.Title.replace(" ", "");
      confi['Sitee' + confi.Title] = 'filter=';
    })

    copysitesConfi.forEach(function (confi: any) {
      getAllTimeEntry.forEach(function (tab: any) {
        if (tab.siteType == confi.Title)
          if (confi['Sitee' + confi.Title].indexOf('(Id eq ' + tab.TaskItemID + ')') < 0)
            confi['Sitee' + confi.Title] += '(Id eq ' + tab.TaskItemID + ') or';
      })
    })

    for (let index = 0; index < copysitesConfi.length; index++) {
      let confi = copysitesConfi[index];
      if (confi['Sitee' + confi.Title].length > 7) {
        let objgre = {
          ListName: confi.CopyTitle,
          listId: confi.listId,
          siteImage: confi?.Item_x005F_x0020_Cover?.Url,
          Query: this.SpiltQueryString(confi['Sitee' + confi.Title].slice(0, confi['Sitee' + confi.Title].length - 2))
          //requestcounter += objgre.Query.length;
        }
        filterItemTimeTab.push(objgre);
      }
    }
    console.log(filterItemTimeTab);
    this.GetAllSiteTaskData(filterItemTimeTab, getAllTimeEntry);
  }

  private SpiltQueryString(selectedquery: any) {
    let queryfrist = '';
    let Querystringsplit = selectedquery.split('or');
    let countIn = 0;
    let querystringSplit1 = [];
    Querystringsplit.forEach(function (value: any) {
      countIn++;
      if (countIn <= 22) {
        queryfrist += value + 'or'
      }
      if (countIn == 22) {
        querystringSplit1.push(queryfrist.slice(0, queryfrist.length - 2));
        queryfrist = 'filter=';
        countIn = 0;
      }
    })
    if (queryfrist.length > 7 && countIn > 0)
      querystringSplit1.push(queryfrist.slice(0, queryfrist.length - 2));
    return querystringSplit1;

  }

  private ConvertLocalTOServerDate(LocalDateTime: any, dtformat: any) {
    if (dtformat == undefined || dtformat == '')
      dtformat = "DD/MM/YYYY";
    if (LocalDateTime != '') {
      let serverDateTime;
      let mDateTime = Moment(LocalDateTime);
      serverDateTime = mDateTime.format(dtformat);
      return serverDateTime;
    }
    return '';
  }
  private setStateAsync(state: any) {
    return new Promise<void>((resolve) => {
      this.setState(state, () => {
        resolve();
      });
    });
  }
  private async GetAllSiteTaskData(filterItemTimeTab: any, getAllTimeEntry: any) {
    let callcount = 0;
    let AllSharewebSiteTasks: any = [];
    let AllTimeEntryItem: any = [];
    let getAllSharewebSiteTasks = [];
    let PortfolioComponent = true;
    let PortfolioService = true;
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    if (filterItemTimeTab.length > 0) {
      for (let index = 0; index < filterItemTimeTab.length; index++) {
        let itemtype = filterItemTimeTab[index];
        for (let j = 0; j < itemtype.Query.length; j++) {
          let queryType = itemtype.Query[j];
          let results = await web.lists
           // .getByTitle(itemtype.ListName)
            .getById(itemtype.listId)
            .items
            .select('ParentTask/Title', 'ParentTask/Id','TaskID', 'Portfolio/ItemType', 'Portfolio/PortfolioStructureID', 'ClientTime', 'Portfolio/Id', 'Portfolio/Title', 'ItemRank', 'Portfolio_x0020_Type', 'SiteCompositionSettings', 'TimeSpent', 'BasicImageInfo', 'OffshoreComments', 'OffshoreImageUrl', 'CompletedDate', 'ResponsibleTeam/Id', 'ResponsibleTeam/Title', 'ClientCategory/Id', 'ClientCategory/Title', 'TaskCategories/Id', 'TaskCategories/Title', 'ParentTask/TaskID', 'TaskType/Id', 'TaskType/Title', 'TaskType/Level', 'TaskType/Prefix', 'Priority_x0020_Rank', 'Reference_x0020_Item_x0020_Json', 'TeamMembers/Title', 'TeamMembers/Name', 'TeamMembers/Id', 'Item_x002d_Image', 'component_x0020_link', 'IsTodaysTask', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id', 'AttachmentFiles/FileName', 'FileLeafRef', 'FeedBack', 'Title', 'Id', 'PercentComplete', 'Company', 'StartDate', 'DueDate', 'Comments', 'Categories', 'Status', 'WebpartId', 'Body', 'Mileage', 'PercentComplete', 'Attachments', 'Priority', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
            .filter(queryType.replace('filter=', '').trim())
            .expand('ParentTask', 'Portfolio', 'TaskType', 'AssignedTo', 'AttachmentFiles', 'Author', 'Editor', 'TeamMembers', 'ResponsibleTeam', 'ClientCategory', 'TaskCategories')
            .orderBy('Id', false)
            .getAll(4999);
          console.log(results);
          await this.setStateAsync(this.state);

          // Now you can safely access this.state.IsCheckedComponent
          const isCheckedComponent = this?.state?.IsCheckedComponent;
          const IsCheckedService = this?.state?.IsCheckedService;
          results.forEach(function (Item) {
            if (Item.ID == 4090)
              console.log(Item)
            if (Item?.Portfolio?.Title !== undefined) {
              Item.ComponentTitle = Item?.Portfolio?.Title;
              Item.listId = itemtype.listId
              Item.ComponentIDs = Item?.Portfolio?.Id;
              let ProtFolioData = AllMasterTasks?.filter((comp: any) => comp?.Id === Item?.Portfolio?.Id);
              Item.Portfoliotype = ProtFolioData[0]?.PortfolioType.Title;;
              if (Item.Portfoliotype === 'Component')
                Item.IsCheckedComponent = true;
              else if (Item.Portfoliotype === 'Service') Item.IsCheckedService = true
              if (Item.IsCheckedComponent === isCheckedComponent || Item.IsCheckedService === IsCheckedService) {
                Item.siteName = itemtype.ListName;
                Item.siteImage = itemtype.siteImage;
                Item.TaskID = globalCommon.GetTaskId(Item);
                Item.PercentComplete = Item.PercentComplete <= 1 ? Item.PercentComplete * 100 : Item.PercentComplete;
                if (Item.PercentComplete != undefined) {
                  Item.PercentComplete = parseInt((Item.PercentComplete).toFixed(0));
                }
                Item.NewCompletedDate = Item.CompletedDate;
                Item.NewCreated = Item.Created;
                if (Item.Created != undefined)
                  Item.FiltercreatedDate = ''//SharewebCommonFactoryService.ConvertLocalTOServerDate(Item.Created, "DD/MM/YYYY");
                if (Item.CompletedDate != undefined)
                  Item.FilterCompletedDate = ''//SharewebCommonFactoryService.ConvertLocalTOServerDate(Item.CompletedDate, "DD/MM/YYYY");
                AllSharewebSiteTasks.push(Item);
              }
            }

          })
        }
      }

      console.log(AllSharewebSiteTasks);

      console.log(this.state.filterItems);
      let filterItems = this.state.filterItems;
      getAllTimeEntry.forEach(function (filterItem: any) {
        AllSharewebSiteTasks.forEach(function (getItem: any) {
          if (getItem.ID == 4090)
            console.log(getItem)
          if (getItem.ID == 3227)
            console.log(getItem);
          if (getItem.ID == 2880)
            console.log(getItem);
          if (filterItem.TaskItemID == getItem.Id && filterItem.selectedSiteType == getItem.siteName) {
            filterItem.clientCategory = '';
            filterItem.clientCategoryIds = '';
            //if ()
            getItem.ClientCategory.forEach(function (client: any) {
              if (client.Title != undefined && filterItem.clientCategoryIds.indexOf(client.Id.toString()) == -1) {
                filterItems.forEach(function (filt: any) {
                  if (filt.Title != undefined && client.Title != undefined && client.Title != '' && filt.checked == true && filt.Title.toLowerCase().indexOf(client.Title.toLowerCase()) > -1) {
                    filterItem.clientCategory += client.Title + ';';
                    filterItem.clientCategoryIds += client.Id + ';';
                  }
                  if (filt.children != undefined && filt.children.length > 0) {
                    filt.children.forEach(function (child: any) {
                      if (child.Title != undefined && client.Title != undefined && client.Title != '' && child.checked == true && child.Title.toLowerCase().indexOf(client.Title.toLowerCase()) > -1) {
                        filterItem.clientCategory += client.Title + ';';
                        filterItem.clientCategoryIds += client.Id + ';';
                      }
                      if (child.children != undefined && child.children.length > 0) {
                        child.children.forEach(function (subchild: any) {
                          if (subchild.Title != undefined && client.Title != undefined && client.Title != '' && subchild.checked == true && subchild.Title.toLowerCase().indexOf(client.Title.toLowerCase()) > -1) {
                            filterItem.clientCategory += client.Title + ';';
                            filterItem.clientCategoryIds += client.Id + ';';
                          }
                        })
                      }
                    })
                  }

                })
              }
            })

            filterItem.flag = true;
            if (getItem.ClientTime != undefined && getItem.ClientTime.length > 0) {
              let Client = JSON.parse(getItem.ClientTime);
              filterItem.ClientTime = Client;
            }
            filterItem.PercentComplete = getItem.PercentComplete;
            filterItem.Priority_x0020_Rank = getItem.Priority_x0020_Rank;
            filterItem.TaskID = getItem.TaskID;
            filterItem.Portfolio_x0020_Type = getItem.Portfolio_x0020_Type;
            filterItem.Created = getItem.Created;
            filterItem.Id = getItem.Id;
            filterItem.listId = getItem.listId;
            filterItem.siteImage = getItem.siteImage;

          }
        })
      })

      AllTimeEntryItem = getAllTimeEntry;
      console.log('All Time Entry');
      console.log(AllTimeEntryItem);
      console.log('Filtered Items after all entry');
      console.log(filterItems);
      this.setState({
        filterItems: filterItems,
        AllTimeEntryItem: AllTimeEntryItem
      }, () => {
        this.getFilterTask(AllTimeEntryItem);
      })
    }

  }

  private getFilterTask(filterTask: any) {
    let selectedFilters: any = [];
    let filterItems = this.state.filterItems;
    let filterCheckedItem = this.state.checked;
    //Get Selected filters of category
    for (let index = 0; index < filterCheckedItem.length; index++) {
      let id = filterCheckedItem[index];
      filterItems.forEach(function (filterItem: any) {
        if (filterItem.value == id)
          selectedFilters.push(filterItem);
        if (filterItem.children != undefined && filterItem.children.length > 0) {
          filterItem.children.forEach(function (child: any) {
            if (child.value == id)
              selectedFilters.push(child);
            if (child.children != undefined && child.children.length > 0) {
              child.children.forEach(function (subchild: any) {
                if (subchild.value == id)
                  selectedFilters.push(subchild);
              });
            }
          });
        }
      });
    }

    console.log('Selected Filter checkbox');
    console.log(selectedFilters);

    let CategoryItems = [];
    let isCategorySelected = false;
    let ParentsArray = [];
    if (selectedFilters.length > 0) {
      let isSitesSelected = false;
      for (let index = 0; index < filterTask.length; index++) {
        let item = filterTask[index];
        if (item.TaskItemID == 2880)
          console.log(item);
        if (item.TaskItemID == 441)
          console.log(item);
        if (item.TaskItemID == 4090)
          console.log(item);
        item.TimeEntryIDunique = index + 1;
        for (let i = 0; i < selectedFilters.length; i++) {
          //if (selectedFilters[i].Selected) {
          let flag = false;
          switch (selectedFilters[i].TaxType) {
            case 'Client Category':
              if (selectedFilters[i].Title != 'Other' && item.clientCategoryIds != undefined && item.clientCategoryIds != '') {

                if (item.Id === 2883) {
                  console.log(item);
                }
                let Category = item.clientCategoryIds.split(';');
                for (let j = 0; j < Category.length; j++) {
                  let type = Category[j];
                  if (type == selectedFilters[i].ID) {
                    item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                    flag = true;
                    item.Secondlevel = item.ParentTitle;
                  }
                  else if (selectedFilters[i].ID == '569' && item.siteType == "Migration") {
                    item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                    flag = true;
                    item.Secondlevel = item.ParentTitle;
                  }
                  else if (selectedFilters[i].ID == '572' && item.siteType == "ALAKDigital") {
                    item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                    flag = true;
                    item.Secondlevel = item.ParentTitle;
                  }
                  else if (selectedFilters[i].ID == '573' && item.siteType == "KathaBeck") {
                    item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                    flag = true;
                    item.Secondlevel = item.ParentTitle;
                  }
                  else if (selectedFilters[i].ID == '575' && item.siteType == "HHHH") {
                    item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                    flag = true;
                    item.Secondlevel = item.ParentTitle;
                  }
                  else if (selectedFilters[i].ID == '574' && item.siteType == "Gruene") {
                    item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                    flag = true;
                    item.Secondlevel = item.ParentTitle;
                  }

                }
                if (flag) {
                  if (!this.isItemExistsTimeEntry(CategoryItems, item.TimeEntryIDunique, item.siteType)) {
                    CategoryItems.push(item);
                  }
                  //  return false;
                }
              }
              if (selectedFilters[i].Title == 'Other' && (item.clientCategoryIds == undefined || item.clientCategoryIds == '')) {
                let title = selectedFilters[i].ParentTitle == 'PSE' ? 'EPS' : (selectedFilters[i].ParentTitle == 'e+i' ? 'EI' : selectedFilters[i].ParentTitle);
                if (selectedFilters[i].Title == 'Other') {
                  if ((item.siteType != undefined && item.siteType == title)) {
                    CategoryItems.push(item);
                  } else if ((item.siteType != undefined && title === undefined)) {
                    item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                    flag = true;
                    item.Secondlevel = item.ParentTitle;
                    CategoryItems.push(item);
                  }
                }
              }
              else if (selectedFilters[i].ID == '569' && item.siteType == "Migration") {
                item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                flag = true;
                item.Secondlevel = item.ParentTitle;
                if (!this.isItemExistsTimeEntry(CategoryItems, item.TimeEntryIDunique, item.siteType))
                  CategoryItems.push(item);
              }
              else if (selectedFilters[i].ID == '572' && item.siteType == "ALAKDigital") {
                item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                flag = true;
                item.Secondlevel = item.ParentTitle;
                if (!this.isItemExistsTimeEntry(CategoryItems, item.TimeEntryIDunique, item.siteType))
                  CategoryItems.push(item);
              }
              else if (selectedFilters[i].ID == '574' && item.siteType == "Gruene") {
                item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                flag = true;
                item.Secondlevel = item.ParentTitle;
                if (!this.isItemExistsTimeEntry(CategoryItems, item.TimeEntryIDunique, item.siteType))
                  CategoryItems.push(item);
              }
              else if (selectedFilters[i].ID == '575' && item.siteType == "HHHH") {
                item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                flag = true;
                item.Secondlevel = item.ParentTitle;
                if (!this.isItemExistsTimeEntry(CategoryItems, item.TimeEntryIDunique, item.siteType))
                  CategoryItems.push(item);
              }
              else if (selectedFilters[i].ID == '573' && item.siteType == "KathaBeck") {
                item.ParentTitle = this.getParentTitle(item, selectedFilters[i]);
                flag = true;
                item.Secondlevel = item.ParentTitle;
                if (!this.isItemExistsTimeEntry(CategoryItems, item.TimeEntryIDunique, item.siteType))
                  CategoryItems.push(item);
              }
              isCategorySelected = true;
              break;
          }
          //}
        }

      }

      let commonItems: any = [];
      let isOtherselected = false;
      if (isCategorySelected) {
        isOtherselected = true;
        if (commonItems.length > 0) {
          commonItems = this.getAllowCommonItems(commonItems, CategoryItems);
          if (commonItems.length == 0) {
            CategoryItems = null;
          }
        }
        else
          commonItems = CategoryItems;
      }

      console.log('Common Items');
      console.log(commonItems);

      let commonItemsbackup = commonItems;
      this.CategoryItemsArray = [];
      this.DynamicSortitems(commonItemsbackup, 'TimeEntrykDateNew', 'DateTime', 'Ascending');
      console.log('Sorted items based on time');
      console.log(commonItemsbackup);

      if (commonItems != undefined && commonItems.length > 0) {
        let weekStart = '';
        let NotUndefineddate;
        for (let index = 0; index < commonItemsbackup.length; index++) {
          if (commonItemsbackup[index].TimeEntrykDateNewback != '' && commonItemsbackup[index].TimeEntrykDateNewback != "undefined//undefined" && commonItemsbackup[index].TimeEntrykDateNewback != undefined) {
            NotUndefineddate = commonItemsbackup[index].TimeEntrykDateNewback;
            break;
          }
        }
        if (NotUndefineddate != '') {
          let selectedDate = Moment(NotUndefineddate);
          weekStart = selectedDate.clone().startOf('week').format('MM/DD/YYYY');
        }
        this.groupby_accordingTo_dateNew(commonItemsbackup, NotUndefineddate);
      }

      let AdjustedimeEntry: any;

      if (this.CategoryItemsArray != undefined && this.CategoryItemsArray.length > 0) {
        let smattime = 0;
        let roudfigersmattime = 0;
        let SmartHoursTimetotal = 0;

        this.CategoryItemsArray.forEach(function (filte: any) {
          let total = 0;
          let Roundfigurtotal = 0;
          let SmartHoursTimetotal = 0;
          let TimeInExcel = 0;
          if (filte.childs != undefined) {
            filte.childs.forEach(function (child: any) {
              let totalnew = 0;
              if (child.AllTask != undefined && child.AllTask.length > 0) {
                child.AllTask.forEach(function (time: any) {
                  if (time.ClientTime != undefined && time.ClientTime.length > 0 && time.siteType == 'Shareweb') {
                    time.ClientTime.forEach(function (client: any) {
                      if (client.SiteName != undefined && client.SiteName == 'EI' && time?.First?.indexOf('e+i') > -1)
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)
                      if (client.SiteName != undefined && client.SiteName == 'EPS' && time.First?.indexOf('PSE') > -1)
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)
                      if (client.SiteName != undefined && client.SiteName == 'Migration' && time.First?.indexOf('Migration') > -1)
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)
                      if (client.SiteName != undefined && client.SiteName == 'Education' && time.First?.indexOf('Education') > -1)
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)
                    })
                  } else totalnew += time.Effort;
                })

              }
              child.AdjustedTime = totalnew;
              child.TotalValue = totalnew;
              child.TotalSmartTime = totalnew;
              child.SmartHoursTime = parseFloat(totalnew.toString()).toFixed(2);
              child.Rountfiguretime = parseFloat(totalnew.toString()).toFixed(2);
              if (child.Rountfiguretime != undefined && child.Rountfiguretime.toString().indexOf('.') > -1) {
                let Rountfiguretime = child.Rountfiguretime.toString().split('.')[1];
                let RoundAdvalue = child.Rountfiguretime.toString().split('.')[0];
                let Rountfiguretimenew = child.AdjustedTime.toString().split('.')[0];
                if (Rountfiguretime < 25) {
                  child.Rountfiguretime = parseInt(RoundAdvalue);
                }
                if (Rountfiguretime >= 25 && Rountfiguretime < 75)
                  child.Rountfiguretime = parseInt(RoundAdvalue) + 0.5

                if (Rountfiguretime >= 75)
                  child.Rountfiguretime = parseInt(RoundAdvalue) + 1;
              }
              if (child.SmartHoursTime != undefined && child.SmartHoursTime.toString().indexOf('.') > -1) {
                let Rountfiguretime = child.SmartHoursTime.toString().split('.')[1];
                let Rountfiguretime1 = child.SmartHoursTime.toString().split('.')[0];
                if (Rountfiguretime < 25)
                  child.SmartHoursTime = parseInt(Rountfiguretime1);
                if (Rountfiguretime >= 25 && Rountfiguretime < 75)
                  child.SmartHoursTime = parseInt(Rountfiguretime1) + 0.5;
                if (Rountfiguretime >= 75)
                  child.SmartHoursTime = parseInt(Rountfiguretime1) + 1;
              }
              if (child.TotalSmartTime != 0 && child.TotalSmartTime != undefined) {
                smattime += child.TotalSmartTime;
                TimeInExcel += child.TotalSmartTime;
              }
              if (child.TotalValue != undefined && child.TotalValue != 0)
                total += child.TotalValue;
              if (child.Rountfiguretime != 0 && child.Rountfiguretime != undefined)
                roudfigersmattime += child.Rountfiguretime;
              if (child.Rountfiguretime != undefined && child.Rountfiguretime != 0)
                Roundfigurtotal += child.Rountfiguretime;
              if (child.SmartHoursTime != 0 && child.SmartHoursTime != undefined)
                SmartHoursTimetotal += child.SmartHoursTime;
              // if (child.SmartHoursTime != undefined && child.SmartHoursTime != 0)
              //     SmartHoursTimetotal += child.SmartHoursTime;
            })
          }
          filte.TotalValue = total;
          filte.AdjustedTime = filte.TotalValue;
          filte.RoundAdjustedTime = Roundfigurtotal;
          filte.TimeInExcel = TimeInExcel;
          filte.SmartHoursTotal = SmartHoursTimetotal;

          if (AdjustedimeEntry == undefined || AdjustedimeEntry == '')
            AdjustedimeEntry = 0
          AdjustedimeEntry += filte.AdjustedTime;
        })

        this.AdjustedimeEntry = 0;
        this.SmartTotalTimeEntry = 0;
        this.RoundSmartTotalTimeEntry = 0;
        this.SmartHoursTimetotalTimeEntry = 0;
        this.RoundAdjustedTimeTimeEntry = 0;
        this.TotalTimeEntry = 0;
        this.AllTimeEntry = 0;

        this.SmartTotalTimeEntry = 0; this.RoundSmartTotalTimeEntry = 0; this.SmartHoursTimetotalTimeEntry = 0; this.RoundAdjustedTimeTimeEntry = 0;
        this.AdjustedimeEntry = 0; this.TotalTimeEntry = 0; this.AllTimeEntry = 0;
        this.SmartTotalTimeEntry = parseFloat(smattime.toString()).toFixed(2);
        this.RoundSmartTotalTimeEntry = parseFloat(roudfigersmattime.toString()).toFixed(2);
        this.SmartHoursTimetotalTimeEntry = parseFloat(SmartHoursTimetotal.toString()).toFixed(2);
        this.RoundAdjustedTimeTimeEntry = parseFloat(roudfigersmattime.toString()).toFixed(2);


      }
      this.SmartTotalTimeEntry = parseFloat(this.SmartTotalTimeEntry).toFixed(2);;
      this.AdjustedimeEntry = AdjustedimeEntry?.toFixed(2);
      this.TotalTimeEntry = this.SmartTotalTimeEntry;
      //  $scope.TotalTimeEntry 
      this.CategoryItemsArray.forEach(function (filte: any) {
        if (filte.AdjustedTime != undefined) {
          filte.AdjustedTime = filte?.AdjustedTime?.toFixed(2);;
        }
        if (filte.TotalValue != undefined) {
          filte.TotalValue = filte.TotalValue?.toFixed(2);;
        }
        if (filte.childs != undefined) {
          filte.childs.forEach(function (child: any) {
            child.TotalValue = child.TotalValue?.toFixed(2);;
            child.TotalSmartTime = child.TotalSmartTime?.toFixed(2);;
            child.AdjustedTime = child.AdjustedTime?.toFixed(2);;

          })
        }
      })
      this.CategoryItemsArray.forEach((obj: any) => {
        obj.subRows = obj.childs;
        obj?.subRows?.forEach((chil: any) => {
          chil.QuickEditItem = false;
        })
      })
      this.AllTimeEntry = this.CategoryItemsArray;
      this.setState({
        showDateTime: (
          <span className='alignCenter'>
           <label className='ms-1'> | Time: {this?.TotalTimeEntry} | hours ({this?.TotalTimeEntry / 8} days)</label>
            <label className="mx-1">|</label>
            <label>
              <div className="">Smart Hours: {this?.SmartTotalTimeEntry} ({this?.SmartTotalTimeEntry / 8} days)</div>
              <div className="">Smart Hours (Roundup): {this?.RoundSmartTotalTimeEntry} ({this?.RoundSmartTotalTimeEntry / 8} days)</div>
            </label>
            <label className="mx-1">|</label>
            <label>
              <div className="">Adjusted Hours: {this?.AdjustedimeEntry} hours ({this?.AdjustedimeEntry / 8} days)</div>
              <div className={this?.state?.isFocused === true ? 'NumberchangeGreen' : ''}>Adjusted Hours (Roundup): {this?.RoundAdjustedTimeTimeEntry} ({this?.RoundAdjustedTimeTimeEntry / 8} days)</div>
            </label>
          </span>
        ),
      });
      console.log('All Time Entry');
      console.log(this.AllTimeEntry);

      this.setState({
        AllTimeEntry: this.AllTimeEntry,
        AllTimeEntryBackup: JSON.parse(JSON.stringify(this.AllTimeEntry))
      })
      // this.AllTimeEntryBackup = JSON.parse(JSON.stringify(this.AllTimeEntry));
      this.rerender();
      //$scope.CopyAllTimeEntry = SharewebCommonFactoryService.ArrayCopy($scope.AllTimeEntry);

    }
  }

  private AdjustedimeEntry: any;
  private SmartTotalTimeEntry: any;
  private RoundSmartTotalTimeEntry: any;
  private SmartHoursTimetotalTimeEntry: any;
  private RoundAdjustedTimeTimeEntry: any;
  private TotalTimeEntry: any;
  private AllTimeEntry: any = [];

  private getParentTitle(item: any, filter: any) {
    let isExistsTitle = '';
    let filterItems = this.state.filterItems;
    if (filter.Title != undefined) {
      if (item.First === undefined) {
        item.First = '';
      }
      filterItems.forEach(function (filt: any) {
        if (filt != undefined && filt.ID != undefined && filter.ID != undefined && filt.ID == filter.ID) {
          isExistsTitle = filt.Title;
          item.First += filt.Title + ';';

        }
        if (filt.children != undefined && filt.children.length > 0) {
          filt.children.forEach(function (child: any) {
            if (child != undefined && child.ID != undefined && filter.ID != undefined && child.ID == filter.ID) {
              isExistsTitle = child.Title;
              item.Secondlevel = child.Title;
              if (item?.First?.indexOf(filt.Title) == -1)
                item.First += filt.Title + ';';
              // if (item?.First?.indexOf(filt.Title) == -1)
              //   item.First += filt.Title + ';';
              // else if (filt.Title != undefined) item.First = filt.Title + ';';
            }
            if (child.children != undefined && child.children.length > 0) {
              child.children.forEach(function (subchild: any) {
                if (subchild != undefined && subchild.ID != undefined && filter.ID != undefined && subchild.ID == filter.ID) {
                  isExistsTitle = child.Title;
                  item.Thirdlevel = subchild.Title;
                  item.Secondlevel = child.Title;
                  if (item?.First?.indexOf(filt.Title) == -1)
                    item.First += filt.Title + ';';
                  // if (item?.First?.indexOf(filt.Title) == -1)
                  //   item.First += filt.Title + ';';
                  // else if (filt.Title != undefined) item.First = filt.Title + ';';
                }
              })
            }
          })
        }

      })
    }
    return isExistsTitle;

  }

  private isItemExistsTimeEntry(arr: any, Id: any, siteType: any) {
    let isExists = false;
    arr.forEach(function (item: any) {
      if (item.TimeEntryIDunique == Id && item.siteType == siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  }

  private getAllowCommonItems(arr1: any, arr2: any) {
    let commonItems: any = [];
    arr1.forEach(function (item1: any) {
      arr2.forEach(function (item2: any) {
        if (item1.ID === item2.ID) {
          commonItems.push(item2);
          return false;
        }
      });
    });
    return commonItems;
  }

  private DynamicSortitems(items: any, column: any, type: any, order: any) {
    if (order == 'Ascending') {
      if (type == 'DateTime') {
        items.sort(function (a: any, b: any) {
          let aDate = new Date(a[column]);
          let bDate = new Date(b[column]);
          return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
        });
      }
      if (type == 'Number') {
        items.sort(function (a: any, b: any) {
          return a[column] - b[column];
        });
      } else
        items.sort(function (a: any, b: any) {
          let aID = a[column];
          let bID = b[column];
          return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
        });
    }
    if (order == 'Descending') {
      if (type == 'DateTime') {
        items.sort(function (a: any, b: any) {
          let aDate = new Date(a[column]);
          let bDate = new Date(b[column]);
          return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
        });
      }
      if (type == 'Number') {
        items.sort(function (a: any, b: any) {
          return b[column] - a[column];
        });
      } else
        items.sort(function (a: any, b: any) {
          let aID = a[column];
          let bID = b[column];
          return (aID == bID) ? 0 : (aID < bID) ? 1 : -1;
        });
    }
  }

  private groupby_accordingTo_dateNew(arrays: any, StartDate: any) {
    let dayscount = new Date(StartDate).getDay();
    let dateEndnew = new Date(StartDate);
    dateEndnew.setDate(dateEndnew.getDate() + (7 - dayscount));
    let EndDate = Moment(dateEndnew).format("MM/DD/YYYY");
    this.childarray(arrays, StartDate, EndDate);
    console.log('child Array');
    console.log(arrays);
    let result = arrays.filter((m: any) => new Date(m.TimeEntrykDateNew) >= new Date(EndDate));
    if (result != undefined && result.length > 0) {
      let againStart = new Date(EndDate);
      againStart.setDate(againStart.getDate() + 1);
      let NewStart = Moment(againStart).format("MM/DD/YYYY");
      this.groupby_accordingTo_date(arrays, NewStart);
    }

    console.log('Week group by data');
    console.log(this.CategoryItemsArray);
  }

  private groupby_accordingTo_date(arrays: any, StartDate: any) {
    let dateEndnew = new Date(StartDate);
    dateEndnew.setDate(dateEndnew.getDate() + 6);
    let EndDate = Moment(dateEndnew).format('MM/DD/YYYY');
    let flag = false;
    if (new Date(EndDate) > new Date(this.endweekday)) {
      EndDate = Moment(new Date(this.endweekday)).format('MM/DD/YYYY');
      flag = true;
    }
    this.childarray(arrays, StartDate, EndDate)
    let result = arrays.filter((m: any) => new Date(m.TimeEntrykDateNew) >= new Date(EndDate));
    if (result != undefined && result.length > 0) {
      let againStart = new Date(EndDate);
      againStart.setDate(againStart.getDate() + 1);
      let NewStart = Moment(againStart).format('MM/DD/YYYY');
      if (!flag)
        this.groupby_accordingTo_date(arrays, NewStart);
    }
  }

  private childarray(arrays: any, StartDate: any, EndDate: any) {
    let Item: any = {};
    let DateItem: any = [];
    //let selectedMembers = arrays.filter(m => new Date(m.TimeEntrykDateNew) >= new Date(StartDate) && new Date(m.TimeEntrykDateNew) <= new Date(EndDate));
    let selectedMembers = arrays.filter(function (m: any, i: any) {
      return new Date(m.TimeEntrykDateNew) >= new Date(StartDate) && new Date(m.TimeEntrykDateNew) <= new Date(EndDate)
    });
    Item["childs"] = [];
    let arrayItem = [];
    if (selectedMembers != undefined && selectedMembers.length > 0) {
      for (let index = 0; index < selectedMembers.length; index++) {
        let client = selectedMembers[index];
        if (client.Secondlevel != undefined && client.Secondlevel != "") {
          if (!this.isItemExistsItems(arrayItem, client.Secondlevel, 'Secondlevel'))
            arrayItem.push(client);
        }
      }
    }
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (arrayItem != undefined && arrayItem.length > 0) {
      arrayItem.forEach(function (obj) {
        if (obj != undefined && obj != "") {
          let result = selectedMembers.filter((type: any) => type.Secondlevel != '' && obj.Secondlevel != undefined && type.Secondlevel == obj.Secondlevel);
          if (result != undefined && result.length > 0) {
            let cate = '';
            let totalValue = 0;
            let First = ''; let Secondlevel = ''; let Thirdlevel = '';
            let ChildItem: any = {};
            result.forEach(function (obj: any) {
              if (obj.clientCategory != undefined) {
                let Category = obj.clientCategory.split(';');
                Category.forEach(function (type: any) {
                  if (type != undefined && cate.indexOf(type) == -1)
                    cate += type + '; ';
                })
              }
              totalValue += obj.Effort
              First = obj.First;
              Secondlevel = obj.Secondlevel;
              Thirdlevel = obj.Thirdlevel
              ChildItem['SiteUrl'] = obj.SiteUrl;
              Item['SiteUrl'] = obj.SiteUrl;
            })
            let smarttotalvalue = 0;
            let smarttotalvalueNew = 0;

            if (ImageSelectedUsers != undefined && ImageSelectedUsers.length > 0) {
              ImageSelectedUsers.forEach(function (item: any) {
                let results = selectedMembers.filter((itemnew: any) => itemnew.Secondlevel != '' && obj.Secondlevel != undefined && itemnew.Secondlevel == obj.Secondlevel && itemnew.AuthorId == item.AssingedToUserId);
                if (results != undefined && results.length > 0) {
                  let smarttotalvalue = 0;
                  let smarttotalvalueNew = 0;
                  results.forEach(function (resu: any) {
                    if (resu.Effort != undefined && resu.Effort && item.SmartTime != undefined)
                      smarttotalvalue += resu.Effort;
                    else if (item.SmartTime == undefined)
                      smarttotalvalueNew += resu.Effort;
                  })
                  if (item.SmartTime != undefined) {
                    if (ChildItem['TotalSmartTime'] == undefined || ChildItem['TotalSmartTime'] == '')
                      ChildItem['TotalSmartTime'] = 0;
                    ChildItem['TotalSmartTime'] += ((smarttotalvalue * item.SmartTime) / 100);
                  }

                  else if (item['SmartTime'] == undefined) {
                    if (ChildItem['TotalSmartTime'] == undefined || ChildItem['TotalSmartTime'] == '')
                      ChildItem['TotalSmartTime'] = 0;
                    ChildItem['TotalSmartTime'] += smarttotalvalueNew
                  }

                  ChildItem['getUserName'] = item.Title;
                }
              })
            }

            ChildItem['Firstlevel'] = First;
            ChildItem['Thirdlevel'] = Thirdlevel;
            ChildItem['Secondlevel'] = Secondlevel;
            ChildItem['TotalValue'] = totalValue;
            ChildItem['AdjustedTime'] = ChildItem['TotalValue'];
            ChildItem['AllTask'] = result;
            //$scope.TotalTimeEntry += totalValue; - will check later
            ChildItem['expanded'] = true;
            ChildItem['flag'] = true;
            ChildItem['childs'] = [];
            ChildItem['clientCategory'] = cate;
            ChildItem['getUserName'] = '';//$scope.getUserName; - will check later
            if (ChildItem['TotalSmartTime'] != undefined) {
              ChildItem['TotalSmartTime'] = ChildItem['TotalSmartTime'].toFixed(2);
              ChildItem['TotalSmartTime'] = parseFloat(ChildItem['TotalSmartTime'])
            }
            Item['childs'].push(ChildItem);
          }
        }

      })

    }
    let st = StartDate.split('/');
    Item['getUserName'] = 'Week ' + Moment(new Date(StartDate)).format('YYYY-MM-DD');
    //Item['getUserName']
    Item['getMonthYearDate'] = new Date(StartDate).toLocaleDateString('en-us', { year: "numeric", month: "short" });
    if (this.AllYearMonth.length == 0) {
      let YearCollection: any = {};
      YearCollection['getMonthYearDate'] = Item['getMonthYearDate'];
      this.AllYearMonth.push(YearCollection);
    }

    if (!this.isItemExistsItems(this.AllYearMonth, Item['getMonthYearDate'], 'getMonthYearDate')) {
      let YearCollection: any = {};
      YearCollection['getMonthYearDate'] = Item['getMonthYearDate'];
      this.AllYearMonth.push(YearCollection);
    }
    Item['flag'] = true;
    Item['expanded'] = true;
    if (Item['childs'] != undefined && Item['childs'].length > 0) {
      this.sortitems(Item['childs'], 'Secondlevel', 'Descending');
      this.CategoryItemsArray.push(Item);
    }
  }


  private AllYearMonth: any = []; private CategoryItemsArray: any = [];

  private isItemExistsItems(arr: any, title: any, titname: any) {
    let isExists = false;
    arr.forEach(function (item: any) {
      if (item[titname] == title) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  }

  private sortitems(items: any, column: any, type: any) {
    if (type == 'DateTime') {
      items.sort(function (a: any, b: any) {
        let aDate = new Date(a[column]);
        let bDate = new Date(b[column]);
        return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
      });
    } else
      items.sort(function (a: any, b: any) {
        let aID = a[column];
        let bID = b[column];
        return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
      });
  }

  private ClearFilters() {
    this.setState({
      checked: []
    })
  }
  private GetCheckedObject = (arr: any, checked: any, isCheckedValue: any) => {
    let checkObj: any = [];
    checked?.forEach((value: any) => {
      arr?.forEach((element: any) => {
        if (value == element.Id) {
          element.checked = isCheckedValue;
          checkObj.push({
            Id: element?.Id,
            Title: element?.Title
          })
        }
        if (element?.children != undefined && element?.children?.length > 0) {
          element?.children?.forEach((chElement: any) => {
            if (value == chElement?.Id) {
              chElement.checked = isCheckedValue;
              checkObj?.push({
                Id: chElement?.Id,
                Title: chElement?.Title
              })
            }
          });
        }
      });
    });
    return checkObj;
  }
  private onCheck = (checked: any, item: any) => {
    let filterGroups = this.state.filterItems;
    let checkedItems: any = [];
    filterGroups[item.index].checked = item.checked;
    filterGroups[item.index].checkedObj = this.GetCheckedObject(filterGroups[item.index]?.children, checked, item.checked)
    // //// demo////
    if (filterGroups[item.index]?.children?.length > 0) {
      const childrenLength = filterGroups[item.index]?.children?.reduce((total: any, obj: any) => total + (obj?.children?.length || 0), 0) + (filterGroups[item.index]?.children?.length ? filterGroups[item.index]?.children?.length : 0);
      filterGroups[item.index].selectAllChecked = childrenLength === checked?.length;
    }
    filterGroups.forEach((obj: any) => {
      if (obj?.checked === true && !this.IsExistsData(checkedItems, obj.Id)) {
        checkedItems.push(obj);
        return;
      }
      // if (obj?.children?.length > 0) {
      //   obj?.children?.forEach((subobj:any)=>{
      //     if(subobj?.checked ===true && !this.IsExistsData(checkedItems,obj.Id)){
      //       checkedItems.push(obj);
      //       return;
      //     }
      //     if (subobj?.children?.length > 0) {
      //       subobj?.children?.forEach((subchildobj:any)=>{
      //         if(subchildobj?.checked ===true && !this.IsExistsData(checkedItems,obj.Id)){
      //           checkedItems.push(obj);
      //         }
      //       })
      //     }
      //   })
      // }
    })


    this.setState({
      filterItems: filterGroups,
      checkedItems: checkedItems
    })
    this.setState({ checked });
    this.rerender()
  }
  private EditDataTimeEntryData = (e: any, item: any) => {
    this.setState({ IsTimeEntry: true });
    this.setState({ SharewebTimeComponent: item });
  };

  private cancelPresetPopup = (type: any) => {
    this.setState({ PresetPopup: false });
  }
  private cancelPreset2Popup = (type: any) => {
    this.setState({ Preset2Popup: false });
  }
  private cancelAdjustedTimePopup = (type: any) => {
    this.setState({ AdjustedTimePopup: false });
  }
  private OpenPresetDatePopup = async (type: any) => {
    this.setState({ PresetPopup: true });
  }
  private OpenPresetDate2Popup = async (type: any) => {
    this.setState({ Preset2Popup: true });
  }
  private OpenAdjustedTimePopup = async () => {
    this.setState({ AdjustedTimePopup: true });
  }
  private onRenderCustomHeaderMain = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px",
          }}
        >
          <span> <h3>
            Task Details {this?.state?.openTaggedTaskArray?.getParentRow().original?.getUserName}
          </h3></span>
        </div>
        <Tooltip ComponentId={1746} />
      </div>
    );
  };

  private cancelsmarttablePopup = () => {
    this.setState({ opentaggedtask: false });

  }

  private SaveAdjustedTime = () => {
    this.AdjustedimeEntry = 0;
    this.AllTimeEntry = this.state.AllTimeEntryBackup;
    this.AllTimeEntry.forEach((value: any) => {
      if (value.TotalValue != undefined && value.TotalValue != '') {
        if (this.state.AdjustedTimeType == 'Divide' && this.state.AdjustedTimeCalcuValue != 0) {
          value.AdjustedTime = value.TotalValue / this.state.AdjustedTimeCalcuValue;
          value.AdjustedTime = value.AdjustedTime.toFixed(2)
          if (value.AdjustedTime != undefined && value.AdjustedTime != '') {
            value.AdjustedTime = parseFloat(value.AdjustedTime);
          }
        }

        this.AdjustedimeEntry += value.AdjustedTime;
      }
      if (value.subRows != undefined && value.subRows.length > 0) {
        value.subRows.forEach((val: any) => {
          if (val.TotalValue != undefined && val.TotalValue != '') {
            if (this.state.AdjustedTimeType == 'Divide' && this.state.AdjustedTimeCalcuValue != 0) {
              val.AdjustedTime = val.TotalValue / this.state.AdjustedTimeCalcuValue;
              val.AdjustedTime = val.AdjustedTime.toFixed(2)
              if (val.AdjustedTime != undefined && val.AdjustedTime != '') {
                val.AdjustedTime = parseFloat(val.AdjustedTime).toFixed(2);
              }
            }

          }

        });
      }
    });
    let RoundfigurtotalNew: any = 0;
    let DaysAdjusted: any = 0;
    this.AllTimeEntry.forEach((filte: any) => {
      let Roundfigurtotal: any = 0;
      let DayRoundof: any = 0;
      if (filte.subRows != undefined) {
        filte.subRows.forEach((child: any) => {
          if (child.AdjustedTime != undefined && child.AdjustedTime.toString().indexOf('.') > -1) {
            var Rountfiguretime = child.AdjustedTime.toString().split('.')[1];
            var Rountfiguretime = (Rountfiguretime.charAt(0));
            var Rountfiguretimenew = child.AdjustedTime.toString().split('.')[0];
            if (Rountfiguretime == 0 || Rountfiguretime == 5)
              child.Rountfiguretime = parseFloat(child.AdjustedTime)
            else if ((Rountfiguretime != undefined && Rountfiguretime != '' && Rountfiguretime < 5))
              child.Rountfiguretime = parseFloat(Rountfiguretimenew) + 0.5//Rountfiguretime !=undefined ?(Rountfiguretime <6 ?5: (Rountfiguretimenew +1)) :Rountfiguretimenew;
            else if (Rountfiguretime != undefined && Rountfiguretime != '' && Rountfiguretime > 5)
              child.Rountfiguretime = parseFloat(Rountfiguretimenew) + 1//Rountfiguretime !=undefined ?(Rountfiguretime <6 ?5: (Rountfiguretimenew +1)) :Rountfiguretimenew;
          }
          Roundfigurtotal += parseFloat(child.Rountfiguretime); RoundfigurtotalNew += parseFloat(child.Rountfiguretime);
          if (child.AdjustedTime != undefined) {
            let adjusteddaycolumn: any = (child.AdjustedTime / 8);
            if (adjusteddaycolumn != undefined && adjusteddaycolumn.toString().indexOf('.') > -1) {
              var adjusteddaycolumn1 = adjusteddaycolumn.toString().split('.')[1];
              var adjusteddaycolumn1 = (adjusteddaycolumn1.charAt(0));
              let adjusteddayDay: any = (child.AdjustedTime / 8);
              var RadjusteddayDaynew = adjusteddayDay.toString().split('.')[0];
              if (adjusteddaycolumn1 == 0 || adjusteddaycolumn1 == 5)
                child['Adjusted Day (Roundup)'] = (child.AdjustedTime / 8)
              else if ((adjusteddaycolumn1 != undefined && adjusteddaycolumn1 != '' && adjusteddaycolumn1 < 5))
                child['Adjusted Day (Roundup)'] = parseInt(RadjusteddayDaynew) + 0.5//Rountfiguretime !=undefined ?(Rountfiguretime <6 ?5: (Rountfiguretimenew +1)) :Rountfiguretimenew;
              else if (adjusteddaycolumn1 != undefined && adjusteddaycolumn1 != '' && adjusteddaycolumn1 > 5)
                child['Adjusted Day (Roundup)'] = parseInt(RadjusteddayDaynew) + 1//Rountfiguretime !=undefined ?(Rountfiguretime <6 ?5: (Rountfiguretimenew +1)) :Rountfiguretimenew;
            }
            DayRoundof += parseFloat(child['Adjusted Day (Roundup)']); DaysAdjusted += parseFloat(child['Adjusted Day (Roundup)']);
          }

        })
      }
      filte.RoundAdjustedTime = parseFloat(Roundfigurtotal).toFixed(2);
      filte['Adjusted Day (Roundup)'] = parseFloat(DayRoundof).toFixed(2);
    })
    this.AdjustedimeEntry = this.AdjustedimeEntry.toFixed(2); this.RoundAdjustedTimeTimeEntry = RoundfigurtotalNew.toFixed(1);
    if (this.AdjustedimeEntry != undefined && this.AdjustedimeEntry != '') {
      this.AdjustedimeEntry = parseFloat(this.AdjustedimeEntry);
    }
    this.setState({ AllTimeEntry: this.AllTimeEntry });
    this.setState({ AdjustedTimePopup: false });
    this.rerenderEntire(this.state.AllTimeEntry);
  }

  private AdjustedimeEntrytotal = 0;

  private rerenderEntire = (array: any) => {
    this.setState({
      showDateTime: (
        <span className='alignCenter'>
          <label className='ms-1'> | Time: {this?.TotalTimeEntry} | hours ({this?.TotalTimeEntry / 8} days)</label>
          <label className="mx-1">|</label>
          <label>
            <div className="">Smart Hours: {this?.SmartTotalTimeEntry} ({this?.SmartTotalTimeEntry / 8} days)</div>
            <div className="">Smart Hours (Roundup): {this?.RoundSmartTotalTimeEntry} ({this?.RoundSmartTotalTimeEntry / 8} days)</div>
          </label>
          <label className="mx-1">|</label>
          <label>
            <div className="">Adjusted Hours: {this?.AdjustedimeEntry} hours ({this?.AdjustedimeEntry / 8} days)</div>
            <div className={this?.state?.isFocused === true ? 'NumberchangeGreen' : ''}>Adjusted Hours (Roundup): {this?.RoundAdjustedTimeTimeEntry} ({this?.RoundAdjustedTimeTimeEntry / 8} days)</div>
          </label>
        </span>
      ),
    });
    this.renderData = [];
    this.renderData = this.renderData.concat(array)
    this.refreshData();
    // this.rerender();
    // this.rerenderEntire(this.AllTimeEntry);
  }

  private ApplyCalculatedDays = () => {
    this.AdjustedimeEntrytotal = this.SmartTotalTimeEntry;
    this.AdjustedimeEntry = 0;
    this.RoundAdjustedTimeTimeEntry = 0;
    this.AllTimeEntry = this.state.AllTimeEntryBackup;
    this.AllTimeEntry.forEach((value: any) => {
      value.AdjustedTime = 0;
      if (value.TotalValue != undefined && value.TotalValue != '') {
        if (this.state.filledeDays != 0) {
          value.AdjustedTime = (this.state.filledeDays / (this.AdjustedimeEntrytotal / 8)) * value.TotalValue;
          value.AdjustedTime = value.AdjustedTime.toFixed(2)
          if (value.AdjustedTime != undefined && value.AdjustedTime != '') {
            value.AdjustedTime = parseFloat(value.AdjustedTime).toFixed(2);
          }
          value.RoundAdjustedTime = (this.state.filledeDays / (this.AdjustedimeEntrytotal / 8)) * value.RoundAdjustedTime;
          value.RoundAdjustedTime = parseFloat(value.RoundAdjustedTime).toFixed(2)
        }
        this.AdjustedimeEntry += parseFloat(value.AdjustedTime);
        this.RoundAdjustedTimeTimeEntry += parseFloat(value.RoundAdjustedTime);
      }
      if (value.subRows != undefined && value.childs.length > 0) {
        value.subRows.forEach((val: any) => {
          // val.AdjustedTime = 0;
          if (val.TotalValue != undefined && val.TotalValue != '') {
            if (this.state.AdjustedTimeType == 'Divide' && this.state.AdjustedTimeCalcuValue != 0) {
              val.AdjustedTime = (this.state.filledeDays / (this.AdjustedimeEntrytotal / 8)) * val.AdjustedTime;
              val.Rountfiguretime = (this.state.filledeDays / (this.AdjustedimeEntrytotal / 8)) * val.Rountfiguretime;
              val.Rountfiguretime = val.Rountfiguretime.toFixed(1)
              if (val.AdjustedTime != undefined && val.AdjustedTime != '') {
                val.AdjustedTime = parseFloat(val.AdjustedTime).toFixed(2);
              }
            }
          }

        });
      }
    });
    var RoundfigurtotalNew = 0;
    this.AllTimeEntry.forEach((filte: any) => {
      var DaysAdjusted = 0;
      var Roundfigurtotal = 0;
      var DayRoundof = 0;
      if (filte.subRows != undefined) {
        filte.subRows.forEach((child: any) => {
          if (child.AdjustedTime != undefined && child.AdjustedTime.toString().indexOf('.') > -1) {
            var Rountfiguretime = child.AdjustedTime.toString().split('.')[1];
            var RoundAdvalue = child.AdjustedTime.toString().split('.')[0];
            var Rountfiguretimenew = child.AdjustedTime.toString().split('.')[0];
            if (Rountfiguretime < 25) {
              child.Rountfiguretime = parseInt(RoundAdvalue);

            }
            if (Rountfiguretime >= 25 && Rountfiguretime < 75)
              child.Rountfiguretime = parseInt(RoundAdvalue) + 0.5

            if (Rountfiguretime >= 75)
              child.Rountfiguretime = parseInt(RoundAdvalue) + 1//Rountfiguretime !=undefined ?(Rountfiguretime <6 ?5: (Rountfiguretimenew +1)) :Rountfiguretimenew;

            Roundfigurtotal += (child.Rountfiguretime); RoundfigurtotalNew += (child.Rountfiguretime);
          }
          if (child.AdjustedTime != undefined) {
            let adjusteddaycolumn: any = (child.AdjustedTime / 8);
            // child['Adjusted Day (Roundup)'] = parseInt(adjusteddaycolumn);
            adjusteddaycolumn = adjusteddaycolumn.toFixed(2);
            if (adjusteddaycolumn != undefined && adjusteddaycolumn.toString().indexOf('.') > -1) {
              var adjusteddaycolumn1 = adjusteddaycolumn.toString().split('.')[1];
              var adjusteddaycol = adjusteddaycolumn.toString().split('.')[0];
              if (adjusteddaycolumn1 < 25) {
                child['Adjusted Day (Roundup)'] = parseInt(adjusteddaycol);
                //child['Adjusted Day (Roundup)'] = parseFloat(child['Adjusted Day (Roundup)']);
              }
              if (adjusteddaycolumn1 >= 25 && adjusteddaycolumn1 < 75)
                child['Adjusted Day (Roundup)'] = parseInt(adjusteddaycol) + 0.5;
              if (adjusteddaycolumn1 >= 75)
                child['Adjusted Day (Roundup)'] = parseInt(adjusteddaycol) + 1;

              DayRoundof += (child['Adjusted Day (Roundup)']); DaysAdjusted += (child['Adjusted Day (Roundup)']);
            }

          }


        })
      }
      filte.RoundAdjustedTime = (Roundfigurtotal);
      filte['Adjusted Day (Roundup)'] = (DayRoundof);
    })
    this.AdjustedimeEntry = this.AdjustedimeEntry.toFixed(2); this.RoundAdjustedTimeTimeEntry = RoundfigurtotalNew.toFixed(1);
    if (this.AdjustedimeEntry != undefined && this.AdjustedimeEntry != '') {
      this.AdjustedimeEntry = parseFloat(this.AdjustedimeEntry);
    }
    this.setState({ AllTimeEntry: this.AllTimeEntry });
    this.rerenderEntire(this.state.AllTimeEntry);
    this.setState({ AdjustedTimePopup: false });
    //  $scope.CopyAllTimeEntry = SharewebCommonFactoryService.ArrayCopy($scope.AllTimeEntry);
    // $('#OpenAdjustedTimePopup').hide()
  }
  private getexportChilds = (item: any) => {
    if (item != undefined || item != null) {
      for (let i = 0; i < item.length; i++) {
        var childItem = item[i];
        if (childItem != undefined && childItem.IsRemoved != true) {
          // angular.forEach(item, function (childItem) {
          var contentItem: any = {};
          if (childItem.getUserName != undefined) {
            if (this.state.ImageSelectedUsers != undefined && this.state.ImageSelectedUsers.length <= 1) {
              contentItem['User Name'] = this.state.ImageSelectedUsers.length == 1 ? '' : childItem.getUserName;
            }
            else {
              contentItem['User Name'] = '';
            }
          }
          else {
            contentItem['User Name'] = '';
          }
          if (childItem.Firstlevel != undefined) {
            contentItem['Site'] = childItem.Firstlevel;
          } else {
            contentItem['Site'] = '';
          }
          if (childItem.Secondlevel != undefined) {
            contentItem['First Level'] = childItem.Secondlevel;
          } else {
            contentItem['First Level'] = '';
          }
          if (childItem.Thirdlevel != undefined) {
            contentItem['Second Level'] = childItem.Thirdlevel;
          } else {
            contentItem['Second Level'] = '';
          }
          if (childItem.TotalValue != undefined) {
            contentItem['Hours Actual'] = childItem.TotalValue;
            if (contentItem['Hours Actual'] != undefined && contentItem['Hours Actual'] != '')
              contentItem['Hours Actual'] = parseFloat(contentItem['Hours Actual']);
            contentItem['Days Actual'] = childItem.TotalValue / 8;
            contentItem['Days Actual'] = contentItem['Days Actual'];
            if (contentItem['Days Actual'] != undefined && contentItem['Days Actual'] != '') {
              contentItem['Days Actual'] = parseFloat(contentItem['Days Actual']);
              contentItem['Smart Days'] = parseFloat(contentItem['Days Actual']);
            }
          } else {
            contentItem['Hours Actual'] = '';
            contentItem['Days Actual'] = 0;
            contentItem['Smart Days'] = 0;
          }
          if (childItem.AdjustedTime != undefined) {
            contentItem['Adjusted Days'] = childItem.AdjustedTime / 8
            contentItem['Adjusted Days'] = parseFloat(contentItem['Adjusted Days']);
            if (contentItem['Adjusted Days'] != undefined && contentItem['Adjusted Days'] != '')
              contentItem['Adjusted Days'] = parseFloat(contentItem['Adjusted Days']);
          }
          else {
            contentItem['Adjusted Days'] = ''
          }
          if (childItem.AdjustedTime != undefined) {
            contentItem['Adjusted Hours'] = parseFloat(childItem.AdjustedTime);
            //   if ($scope.RoundFigureNumber == true)
            contentItem['Adjusted Hours (Roundup)'] = parseFloat(childItem.Rountfiguretime);
            contentItem['Hours'] = contentItem['Adjusted Hours (Roundup)'];
            // if (contentItem['Adjusted Hours'] != undefined && contentItem['Adjusted Hours'] != '')
            //     contentItem['Adjusted Hours'] = parseFloat(contentItem['Adjusted Hours'])
          }
          else {
            contentItem['Adjusted Hours'] = '';
            contentItem['Hours'] = '';
            contentItem['Adjusted Hours (Roundup)'] = '';
          }
          contentItem['Client Category'] = childItem.clientCategory != undefined ? childItem.clientCategory : '';
          if (childItem.TotalSmartTime != undefined) {
            contentItem['Smart Hours'] = parseFloat(childItem.TotalSmartTime);
            contentItem['Smart Hours (Roundup)'] = parseFloat(childItem.SmartHoursTime);

            contentItem['Smart Days (Roundup)'] = (contentItem['Smart Hours (Roundup)'] / 8);
            contentItem['Adjusted Hours Roundup (In days)'] = (contentItem['Adjusted Hours (Roundup)'] / 8);
            contentItem['Days'] = contentItem['Adjusted Hours Roundup (In days)'];
            //childItem['Adjusted Day (Roundup)'] == undefined ? (contentItem['Smart Hours (Roundup)'] / 8) : childItem['Adjusted Day (Roundup)'];;
          } else {
            contentItem['Smart Hours'] = '';
            contentItem['Smart Hours (Roundup)'] = '';
            contentItem['Days'] = '';
            // contentItem['Hours'] = '';
            contentItem['Smart Days (Roundup)'] = '';
            contentItem['Adjusted Hours Roundup (In days)'] = '';
          }

          this.sheetsItems.push(contentItem);
        }
        // $scope.getexportSubChilds(childItem.childs);
      }
    }

  }
  private sheetsItems: any = [];
  private exportToExcel = () => {
    this.sheetsItems = [];
    var AllExporttoExcelDataNew = this.state.AllTimeEntry;
    var AllExporttoExcelData: any = [];
    var AllExporttoExcelData1: any = [];
    var totalCountDays = 0;
    var AdjustedDays = 0
    var RoundTime = 0;
    var RoundAdjustedTimeAll = 0
    var DayRoundof = 0;
    var TotalValueAll: any = 0;
    var AllYearMonth = this.AllYearMonth;

    var firstTitle = ""; var lastTitle = "";
    AllYearMonth.forEach((yearttile: any, index: any) => {
      var totalDays = 0;
      var RoundAdjustedTime = 0;
      var totalDays = 0;
      var Firstlevel = '';
      var dayroundeup: any = 0;
      var TotalValue = 0;
      AllExporttoExcelData.push(yearttile)
      if (yearttile.getMonthYearDate != undefined) {
        var AllItems = $.grep(AllExporttoExcelDataNew, function (obj: any) { return yearttile.getMonthYearDate == obj.getMonthYearDate });
        if (AllItems != undefined && AllItems.length > 0) {
          AllItems.forEach((objnew: any) => {
            totalDays += parseFloat(objnew.RoundAdjustedTime);
            RoundAdjustedTimeAll += (objnew.RoundAdjustedTime);
            RoundAdjustedTime += (objnew.RoundAdjustedTime);
            TotalValue += (objnew.TimeInExcel);
            TotalValueAll += (objnew.TimeInExcel);
            if (objnew['Adjusted Day (Roundup)'] != undefined) {
              DayRoundof += parseFloat(objnew['Adjusted Day (Roundup)']);
              dayroundeup += parseFloat(objnew['Adjusted Day (Roundup)']);
            }
            AllExporttoExcelData.push(objnew)
            AllExporttoExcelData1.push(objnew)
            if (objnew.subRows != undefined && objnew.subRows.length > 0) {
              objnew.subRows.forEach((objchild: any) => {
                if (objchild.Firstlevel) {
                  if (Firstlevel == "")
                    Firstlevel = objchild.Firstlevel;
                  else if (Firstlevel.indexOf(objchild.Firstlevel) == -1)
                    Firstlevel +=  objchild.Firstlevel;
                }
              })
            }

          })

        }
        if (index == 0)
          firstTitle = yearttile.getMonthYearDate;
        lastTitle = yearttile.getMonthYearDate;
        totalCountDays = totalCountDays + (totalDays / 8);
        yearttile.getUserName = 'Total ' + yearttile.getMonthYearDate;
        yearttile.TotalValue = totalDays;
        yearttile.AdjustedTime = RoundAdjustedTime;
        yearttile.TotalValueHours = TotalValue;
        yearttile.SmartHoursTotal = RoundAdjustedTime;
        yearttile.Firstlevel = Firstlevel;
        if (dayroundeup != 0)
          yearttile['Adjusted Day (Roundup)'] = parseFloat(dayroundeup);
        // yearttile.AdjustedTime="";
      }

    })
    var alldaysround = 0;
    AllExporttoExcelData.forEach((timevale: any) => {
      if (timevale.AdjustedTime != undefined && timevale.childs != undefined) {
        RoundTime += parseFloat(timevale.AdjustedTime);
        if (timevale['Adjusted Day (Roundup)'] != undefined)
          alldaysround += parseFloat(timevale['Adjusted Day (Roundup)']);
      }
    })
    var contentItemNew: any = {};
    contentItemNew['User Name'] = 'Total ' + firstTitle + ' to ' + lastTitle;
    contentItemNew['Site'] = this.state.ImageSelectedUsers.length == 1 ? this.state.ImageSelectedUsers[0].Title : '';
    contentItemNew['First Level'] = '';
    contentItemNew['Second Level'] = '';
    contentItemNew['Hours Actual'] = TotalValueAll;
    contentItemNew['Days Actual'] = (TotalValueAll / 8);
    contentItemNew['Smart Days'] = (TotalValueAll / 8);
    contentItemNew['Adjusted Days'] = (RoundTime / 8);
    contentItemNew['Smart Hours'] = parseFloat(TotalValueAll || 0);;
    contentItemNew['Smart Hours (Roundup)'] = parseFloat(this.RoundSmartTotalTimeEntry);
    contentItemNew['Adjusted Hours'] = parseFloat(this.AdjustedimeEntry);;
    contentItemNew['Adjusted Hours (Roundup)'] = parseFloat(this.RoundAdjustedTimeTimeEntry);
    contentItemNew['Smart Days (Roundup)'] = (TotalValueAll / 8);
    contentItemNew['Adjusted Hours Roundup (In days)'] = (contentItemNew['Adjusted Hours (Roundup)'] / 8)
    contentItemNew['Days'] = contentItemNew['Adjusted Hours Roundup (In days)'];
    contentItemNew['Hours'] = contentItemNew['Adjusted Hours (Roundup)']; //(alldaysround == 0 || alldaysround == NaN) ? parseFloat($scope.RoundSmartTotalTimeEntry / 8) : parseFloat(alldaysround);


    this.sheetsItems.push(contentItemNew);
    var contentItemNew: any = {};
    contentItemNew['User Name'] = '';
    contentItemNew['Site'] = '';
    contentItemNew['First Level'] = '';
    contentItemNew['Second Level'] = '';
    contentItemNew['Hours Actual'] = '';
    contentItemNew['Days Actual'] = '';

    this.sheetsItems.push(contentItemNew);
    AllYearMonth.forEach((item: any, index: any) => {
      var contentItem: any = {};
      if (item.getUserName != undefined) {
        //if (ImageSelectedUsers != undefined && ImageSelectedUsers.length <= 1) {
        contentItem['User Name'] = item.getUserName;
        //}
        //else {
        //    contentItem['User Name'] = '';
        //}
      }
      else {
        contentItem['User Name'] = '';
      }
      if (item.Firstlevel != undefined) {
        contentItem['Site'] = item.Firstlevel;
      } else {
        contentItem['Site'] = '';
      }
      if (item.Secondlevel != undefined) {
        contentItem['First Level'] = item.Secondlevel;
      } else {
        contentItem['First Level'] = '';
      }
      if (item.Thirdlevel != undefined) {
        contentItem['Second Level'] = item.Thirdlevel;
      } else {
        contentItem['Second Level'] = '';
      }
      if (item.TotalValue != undefined) {
        contentItem['Hours Actual'] = item.TotalValue;
        // contentItem['Total Time'] = contentItem['Total Time'].toFixed(2);
        if (contentItem['Hours Actual'] != undefined && contentItem['Hours Actual'] != '')
          contentItem['Hours Actual'] = parseFloat(contentItem['Hours Actual'])

        contentItem['Days Actual'] = item.TotalValueHours / 8;
        contentItem['Days Actual'] = contentItem['Days Actual'].toFixed(2);
        if (contentItem['Days Actual'] != undefined && contentItem['Days Actual'] != '') {
          contentItem['Days Actual'] = parseFloat(contentItem['Days Actual'])
          contentItem['Smart Days'] = parseFloat(contentItem['Days Actual']);
        }
      }
      else {
        contentItem['Hours Actual'] = '';
        contentItem['Days Actual'] = 0;
        contentItem['Smart Days'] = 0;
      }
      if (item.AdjustedTime != undefined) {

        contentItem['Adjusted Hours'] = parseFloat(item.AdjustedTime);;
        contentItem['Adjusted Hours (Roundup)'] = parseFloat(item.SmartHoursTotal);;
        contentItem['Hours'] = contentItem['Adjusted Hours (Roundup)']
      }
      else {
        contentItem['Adjusted Hours'] = ''
        contentItem['Hours'] = '';
        contentItem['Adjusted Hours (Roundup)'] = ''
      }
      if (item.AdjustedTime != undefined) {
        contentItem['Adjusted Days'] = (parseFloat(item.AdjustedTime) / 8 || 0);// parseFloat((item.AdjustedTime / 8) || 0)
        // contentItem['Adjusted Days'] = parseFloat(contentItem['Adjusted Days'].toFixed(2));
        if (contentItem['Adjusted Days'] != undefined && contentItem['Adjusted Days'] != '')
          contentItem['Adjusted Days'] = parseFloat(contentItem['Adjusted Days']);
      }
      else {
        contentItem['Adjusted Days'] = ''
      }
      if (item.Categories != undefined) {
        contentItem['Client Category'] = ''
        item.clientCategory.split(';').forEach((clientCategory: any) => {
          if (clientCategory != undefined)
            clientCategory = clientCategory.trim()
          this.state.filterItems.forEach((filt: any) => {
            if (filt.Title != undefined && clientCategory != undefined && clientCategory != '' && filt.Selected == true && filt.Title.toLowerCase().indexOf(clientCategory.toLowerCase()) > -1) {
              if (contentItem['Client Category'] == '')
                contentItem['Client Category'] = filt.Title;
              else
                contentItem['Client Category'] = contentItem['Client Category'] + '; ' + filt.Title;
            }
            if (filt.subRows != undefined && filt.subRows.length > 0) {
              filt.subRows.forEach((child: any) => {
                if (child.Title != undefined && clientCategory != undefined && clientCategory != '' && child.Selected == true && child.Title.toLowerCase().indexOf(clientCategory.toLowerCase()) > -1) {
                  if (contentItem['Client Category'] == '')
                    contentItem['Client Category'] = child.Title;
                  else
                    contentItem['Client Category'] = contentItem['Client Category'] + '; ' + child.Title;
                }
                if (child.subRows != undefined && child.subRows.length > 0) {
                  child.subRows.forEach((subchild: any) => {
                    if (subchild.Title != undefined && clientCategory != undefined && clientCategory != '' && subchild.Selected == true && subchild.Title.toLowerCase().indexOf(clientCategory.toLowerCase()) > -1) {
                      if (contentItem['Client Category'] == '')
                        contentItem['Client Category'] = subchild.Title;
                      else
                        contentItem['Client Category'] = contentItem['Client Category'] + '; ' + subchild.Title;
                    }
                  })
                }
              })
            }

          })

        })
        contentItem['Client Category'] = contentItem['Client Category']
      } else {
        contentItem['Client Category'] = '';
      }
      if (item.SmartHoursTotal != undefined && item.SmartHoursTotal != undefined) {
        contentItem['Smart Hours'] = parseFloat(item.TotalValueHours);
        // contentItem['TotalSmartTime'] = contentItem['TotalSmartTime'].toFixed(2);
        contentItem['Smart Hours (Roundup)'] = parseFloat(item.TotalValueHours);

        contentItem['Smart Days (Roundup)'] = (contentItem['Smart Hours (Roundup)'] / 8);;

        contentItem['Adjusted Hours Roundup (In days)'] = (contentItem['Adjusted Hours (Roundup)'] / 8);
        contentItem['Days'] = contentItem['Adjusted Hours Roundup (In days)'];
        //item['Adjusted Day (Roundup)'] == undefined ? (contentItem['Smart Hours (Roundup)'] / 8) : item['Adjusted Day (Roundup)'];;
      } else {
        contentItem['Smart Hours'] = '';
        contentItem['Smart Hours (Roundup)'] = '';
        contentItem['Days'] = '';
        //contentItem['Hours'] = '';
        contentItem['Smart Days (Roundup)'] = ''; contentItem['Adjusted Hours Roundup (In days)'] = '';
      }

      this.sheetsItems.push(contentItem);
    })
    var contentItemNew: any = {};
    contentItemNew['User Name'] = '';
    contentItemNew['Site'] = '';
    contentItemNew['First Level'] = '';
    contentItemNew['Second Level'] = '';
    contentItemNew['Hours'] = '';
    contentItemNew['Days'] = '';

    this.sheetsItems.push(contentItemNew);
    console.log(this.sheetsItems);
    AllExporttoExcelData1.forEach((item: any) => {
      var contentItem: any = {};
      if (item.getUserName != undefined) {
        //if (ImageSelectedUsers != undefined && ImageSelectedUsers.length <= 1) {
        contentItem['User Name'] = item.getUserName;
        //}
        //else {
        //    contentItem['User Name'] = '';
        //}
      }
      else {
        contentItem['User Name'] = '';
      }
      if (item.Firstlevel != undefined) {
        contentItem['Site'] = item.Firstlevel;
      } else {
        contentItem['Site'] = '';
      }
      if (item.Secondlevel != undefined) {
        contentItem['First Level'] = item.Secondlevel;
      } else {
        contentItem['First Level'] = '';
      }
      if (item.Thirdlevel != undefined) {
        contentItem['Second Level'] = item.Thirdlevel;
      } else {
        contentItem['Second Level'] = '';
      }
      if (item.TotalValue != undefined) {
        contentItem['Hours Actual'] = item.TotalValue;
        // contentItem['Total Time'] = contentItem['Total Time'].toFixed(2);
        if (contentItem['Hours Actual'] != undefined && contentItem['Hours Actual'] != '')
          contentItem['Hours Actual'] = parseFloat(contentItem['Hours Actual'])

        contentItem['Days Actual'] = item.TimeInExcel / 8;
        contentItem['Days Actual'] = contentItem['Days Actual'].toFixed(2);
        if (contentItem['Days Actual'] != undefined && contentItem['Days Actual'] != '') {
          contentItem['Days Actual'] = parseFloat(contentItem['Days Actual'])
          contentItem['Smart Days'] = parseFloat(contentItem['Days Actual']);
        }
      }
      else {
        contentItem['Hours Actual'] = '';
        contentItem['Days Actual'] = 0;
        contentItem['Smart Days'] = 0;
      }
      if (item.AdjustedTime != undefined) {

        contentItem['Adjusted Hours'] = parseFloat(item.AdjustedTime);;
        contentItem['Adjusted Hours (Roundup)'] = parseFloat(item.RoundAdjustedTime != undefined ? item.RoundAdjustedTime : item.SmartHoursTotal);;
        contentItem['Hours'] = contentItem['Adjusted Hours (Roundup)']
      }
      else {
        contentItem['Adjusted Hours'] = ''
        contentItem['Hours'] = '';
        contentItem['Adjusted Hours (Roundup)'] = ''
      }
      if (item.AdjustedTime != undefined) {
        contentItem['Adjusted Days'] = (parseFloat(item.AdjustedTime) / 8 || 0);//parseFloat((item.AdjustedTime / 8) || 0)
        // contentItem['Adjusted Days'] = parseFloat(contentItem['Adjusted Days'].toFixed(2));
        if (contentItem['Adjusted Days'] != undefined && contentItem['Adjusted Days'] != '')
          contentItem['Adjusted Days'] = parseFloat(contentItem['Adjusted Days']);
      }
      else {
        contentItem['Adjusted Days'] = ''
      }
      if (item.Categories != undefined) {
        contentItem['Client Category'] = ''
        item.clientCategory.split(';').forEach((clientCategory: any) => {
          if (clientCategory != undefined)
            clientCategory = clientCategory.trim()
          this.state.filterItems.forEach((filt: any) => {
            if (filt.Title != undefined && clientCategory != undefined && clientCategory != '' && filt.Selected == true && filt.Title.toLowerCase().indexOf(clientCategory.toLowerCase()) > -1) {
              if (contentItem['Client Category'] == '')
                contentItem['Client Category'] = filt.Title;
              else
                contentItem['Client Category'] = contentItem['Client Category'] + '; ' + filt.Title;
            }
            if (filt.subRows != undefined && filt.subRows.length > 0) {
              filt.subRows.forEach((child: any) => {
                if (child.Title != undefined && clientCategory != undefined && clientCategory != '' && child.Selected == true && child.Title.toLowerCase().indexOf(clientCategory.toLowerCase()) > -1) {
                  if (contentItem['Client Category'] == '')
                    contentItem['Client Category'] = child.Title;
                  else
                    contentItem['Client Category'] = contentItem['Client Category'] + '; ' + child.Title;
                }
                if (child.subRows != undefined && child.subRows.length > 0) {
                  child.subRows.forEach((subchild: any) => {
                    if (subchild.Title != undefined && clientCategory != undefined && clientCategory != '' && subchild.Selected == true && subchild.Title.toLowerCase().indexOf(clientCategory.toLowerCase()) > -1) {
                      if (contentItem['Client Category'] == '')
                        contentItem['Client Category'] = subchild.Title;
                      else
                        contentItem['Client Category'] = contentItem['Client Category'] + '; ' + subchild.Title;
                    }
                  })
                }
              })
            }

          })

        })
        contentItem['Client Category'] = contentItem['Client Category']
      } else {
        contentItem['Client Category'] = '';
      }
      if (item.SmartHoursTotal != undefined && item.SmartHoursTotal != undefined) {
        contentItem['Smart Hours'] = parseFloat(item.AdjustedTime);
        // contentItem['TotalSmartTime'] = contentItem['TotalSmartTime'].toFixed(2);
        contentItem['Smart Hours (Roundup)'] = parseFloat(item.SmartHoursTotal);

        contentItem['Smart Days (Roundup)'] = (contentItem['Smart Hours (Roundup)'] / 8);;
        contentItem['Adjusted Hours Roundup (In days)'] = (contentItem['Adjusted Hours (Roundup)'] / 8);
        contentItem['Days'] = contentItem['Adjusted Hours Roundup (In days)'];

      } else {
        contentItem['Smart Hours'] = '';
        contentItem['Smart Hours (Roundup)'] = '';
        contentItem['Days'] = '';
        // contentItem['Hours'] = '';
        contentItem['Smart Days (Roundup)'] = ''; contentItem['Adjusted Hours Roundup (In days)'] = '';
      }

      this.sheetsItems.push(contentItem);
      this.getexportChilds(item.childs);


    });
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";


    if (this?.sheetsItems?.length > 0) {
      var fileName = 'Time Entry';
      const ws = XLSX.utils.json_to_sheet(this.sheetsItems);
      const fileExtension = ".xlsx";
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // Define the file type
      XLSX.utils.sheet_add_aoa(ws, [["User Name", "Site", "First Level", "Hours", "Days", "Client Category", "Smart Hours", "Smart Days", "Adjusted Hours (Roundup)", "Adjusted Hours Roundup (In days)"]], { origin: "A1" });
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    }

  };

  private SelectedPortfolioItem(data: any, Type: any) {
    if (Type == 'Component') {
      this.setState({
        IsCheckedComponent: data?.target?.checked,
      })
    }
    else {
      this.setState({
        IsCheckedService: data?.target?.checked,
      })
    }

  }
  private PreSetPikerCallBack = (preSetStartDate: any, preSetEndDate: any) => {
    if (preSetStartDate != undefined) {
      this.setState({
        startdate: preSetStartDate,
      })
    }
    if (preSetEndDate != undefined) {
      this.setState({
        enddate: preSetEndDate,
      })
    }

    this.setState({
      PresetPopup: false,
    })
    if (preSetStartDate != undefined || preSetEndDate != undefined) {
      this.setState({
        SelecteddateChoice: 'Presettime',
      })

      this.refreshData();
    }
  };
  private PreSetPikerCallBack2 = (preSetStartDate: any, preSetEndDate: any) => {
    if (preSetStartDate != undefined) {
      this.setState({
        startdate: preSetStartDate,
      })
    }
    if (preSetEndDate != undefined) {
      this.setState({
        enddate: preSetEndDate,
      })
    }

    this.setState({
      Preset2Popup: false,
    })
    if (preSetStartDate != undefined || preSetEndDate != undefined) {
      this.setState({
        SelecteddateChoice: 'Presettime1',
      })

      this.refreshData();
    }
  };
  private SelectAllCategories(ev: any) {
    let filterItem = this.state.filterItems;
    let checkedItems: any = [];
    let checked: any = [];
    let select = ev.currentTarget.checked;
    if (select) {
      if (filterItem != undefined && filterItem.length > 0) {
        filterItem.forEach((child: any) => {
          child.isExpand = false;
          child.checked = select;
          checkedItems.push(child);
          checked.push(child.Id);
          if (child.children != undefined && child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              subchild.checked = select;
              // checkedItems.push(subchild);
              checked.push(subchild.Id);
              if (subchild.children != undefined && subchild.children.length > 0) {
                subchild.children.forEach((subchild2: any) => {
                  subchild2.checked = select;
                  // checkedItems.push(subchild2);
                  checked.push(subchild2.Id);
                  if (subchild2.children != undefined && subchild2.children.length > 0) {
                    subchild2.children.forEach((subchild3: any) => {
                      subchild3.checked = select;
                      //   checkedItems.push(subchild3);
                      checked.push(subchild3.Id);
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
    else {
    }
    this.setState({
      checked,
      checkedAll: select,
      checkedItems: checkedItems,
    });
  }
  private getAllSubChildenCount(item: any) {
    let count = 1;
    if (item.children != undefined && item.children.length > 0) {
      count += item.children.length;
      item.children.forEach((subchild: any) => {
        if (subchild.children != undefined && subchild.children.length > 0) {
          count += subchild.children.length;
          subchild.children.forEach((subchild2: any) => {
            if (subchild2.children != undefined && subchild2.children.length > 0) {
              count += subchild2.children.length;
              subchild2.children.forEach((subchild3: any) => {
              });
            }
          });
        }
      });
    }
    return count;
  }
  private onRenderCustomHeaderMains = () => {
    return (
      <div className="subheading siteColor">
        Select Adjusted Time
      </div>
    );
  };
  private Call = (res: any) => {
    this.setState({ IsTask: false });
  }
  private TimeEntryCallBack = () => {
    this.setState({ IsTimeEntry: false });
  }
  public render(): React.ReactElement<ICategoriesWeeklyMultipleReportProps> {
    const { AllTimeEntry } = this?.state;

    SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");

    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    console.log('Checked === ', this.state.checked);
    return (
      <div>
        <div className="col-sm-12 padL-0">
          <h2 className="heading">Timesheet</h2>
        </div>

        <div className="smartFilter bg-light border mb-3 col row">
          <div className="report-taskuser ps-0 pe-1" id="TimeSheet-Section">
            <details className='pt-1 m-0 allfilter' open>
              <summary>
                <a className="fw-semibold hreflink mr-5 pe-2 pull-left">All filters :<span className='text-dark'>Task User :</span><span>
                  {this.state.SelectGroupName}
                </span> </a>
                {this.state.ImageSelectedUsers.length <= 3 ? (
                  this.state.ImageSelectedUsers.map(function (obj: any) {
                    return (<span className="marginR41">
                      <img
                        className="AssignUserPhoto"
                        src={obj.Item_x0020_Cover.Url}
                      ></img>
                    </span>
                    )
                  })) : (
                  this.state.ImageSelectedUsers.length > 3 && <span>({this.state.ImageSelectedUsers.length})</span>)

                }


              </summary>
              <div className="subfilters BdrBoxBlue mb-3">
                <div className="taskTeamBox mt-10">
                  <details className='p-0 m-0' open>
                    <summary>
                      <div className='alignCenter'>
                        <a className="hreflink pull-left mr-5">Team Members</a>
                        <span className='alignCenter ml-auto'>
                          <input type="checkbox" className="form-check-input m-0" onClick={(e) => this.SelectAllGroupMember(e)} />
                          <label className='ms-1 f-14'>Select All </label>
                        </span>
                      </div>
                      <hr></hr>
                    </summary>
                    <div className="BdrBoxBlue ps-30 mb-3">
                      <div className="taskTeamBox mt-10">
                        {this.state.taskUsers != null && this.state.taskUsers.length > 0 && this.state.taskUsers.map((user: any, i: number) => {
                          return <div className="top-assign">
                            <fieldset className="team">
                              <label className="BdrBtm">
                                <input className="form-check-input m-0" checked={user.SelectedGroup === true} type="checkbox" onClick={(e) => this.SelectedGroup(e, user)} />
                                {user.Title}
                              </label>
                              <div className='alignCenter'>
                                {user.childs.length > 0 && user.childs.map((item: any, i: number) => {
                                  return <div className="alignCenter">
                                    {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined ?
                                      <span>
                                        <img id={"UserImg" + item.Id} className={item?.AssingedToUserId == user?.Id ? 'activeimg seclected-Image ProirityAssignedUserPhoto' : 'ProirityAssignedUserPhoto'} onClick={(e) => this.SelectUserImage(e, item, user)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                          title={item?.AssingedToUser?.Title}
                                          src={item?.Item_x0020_Cover?.Url !== undefined ? item?.Item_x0020_Cover?.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'} />
                                      </span> : <span>
                                        <img id={"UserImg" + item.Id} className={item?.AssingedToUserId == user?.Id ? 'activeimg seclected-Image ProirityAssignedUserPhoto' : 'ProirityAssignedUserPhoto'} onClick={(e) => this.SelectUserImage(e, item, user)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                          title={item?.AssingedToUser?.Title}
                                          src={'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'} />
                                      </span>
                                    }

                                  </div>
                                })}
                              </div>
                            </fieldset>
                          </div>
                        })

                        }
                      </div>
                    </div>
                  </details>
                  <details className='p-0 m-0' open>
                    <summary>
                      <a>Date</a>
                      <hr></hr>
                    </summary>

                    <div className="BdrBoxBlue ps-30 mb-3">
                      <div className="taskTeamBox mt-10">
                        <div className="Weekly-TimeReportDays">
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Custom'} id="selectedCustom" value="Custom" onClick={() => this.selectDate('Custom')} className="radio" />
                            <label>Custom</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'today'} id="selectedToday" value="today" onClick={() => this.selectDate('today')} className="radio" />
                            <label>Today</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'yesterday'} id="selectedYesterday" value="yesterday" onClick={() => this.selectDate('yesterday')} className="radio" />
                            <label> Yesterday </label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'ThisWeek'} id="selectedAll" value="ThisWeek" onClick={() => this.selectDate('ThisWeek')} className="radio" />
                            <label> This Week</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'LastWeek'} id="selectedAll" value="LastWeek" onClick={() => this.selectDate('LastWeek')} className="radio" />
                            <label> Last Week</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'EntrieMonth'} id="selectedAll" value="EntrieMonth" onClick={() => this.selectDate('EntrieMonth')} className="radio" />
                            <label>This Month</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'LastMonth'} id="selectedAll" value="LastMonth" onClick={() => this.selectDate('LastMonth')} className="radio" />
                            <label>Last Month</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Last3Month'} value="Last3Month" onClick={() => this.selectDate('Last3Month')} className="radio" />
                            <label>Last 3 Months</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'EntrieYear'} value="EntrieYear" onClick={() => this.selectDate('EntrieYear')} className="radio" />
                            <label>This Year</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'LastYear'} value="LastYear" onClick={() => this.selectDate('LastYear')} className="radio" />
                            <label>Last Year</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'AllTime'} value="AllTime" onClick={() => this.selectDate('AllTime')} className="radio" />
                            <label>All Time</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Presettime'} value="Presettime" onClick={() => this.selectDate('Presettime')} className="radio" />
                            <label>Pre-set I</label>
                            {/* <img className="hreflink wid11 mr-5"  title="open" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" /> */}
                            <span title="open" onClick={(e) => this.OpenPresetDatePopup('Presettime')} className='hreflink alignIcon ms-1 svg__iconbox svg__icon--editBox'></span>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" id="Presettime1" checked={this.state.SelecteddateChoice === 'Presettime1'} name="dateSelection" value="Presettime1" onClick={() => this.selectDate('Presettime1')} className="radio" />
                            <label>Pre-set II</label>
                           
                            <span title="open" onClick={(e) => this.OpenPresetDate2Popup('Presettime1')} className='hreflink alignIcon ms-1 svg__iconbox svg__icon--editBox'></span>
                          </span>
                        </div>
                        <div className='row mt-2'>
                          <div className='col-2 ps-0'>
                            <div className='input-group'>
                              <label className="full_width form-label">Start Date</label>
                              <DatePicker selected={this.state.startdate} dateFormat="dd/MM/yyyy" onChange={(date) => this.setStartDate(date)} className="form-control" />
                            </div>
                          </div>
                          <div className='col-2'>
                            <div className='input-group'>
                              <label className="full_width form-label">End Date</label>
                              <DatePicker selected={this.state.enddate} dateFormat="dd/MM/yyyy" onChange={(date) => this.setEndDate(date)} className="form-control" />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='mt-1'>
                              <label className='full_width'>Portfolio Item</label>
                              <div className='alignCenter'>
                                <label className='SpfxCheckRadio alignCenter'><input type="checkbox" checked={this.state?.IsCheckedComponent} className="form-check-input me-1" onClick={(e) => this.SelectedPortfolioItem(e, 'Component')} /> Component</label>
                                <label className='SpfxCheckRadio alignCenter'><input type="checkbox" checked={this.state?.IsCheckedService} className="form-check-input ms-2 me-1" onClick={(e) => this.SelectedPortfolioItem(e, 'Service')} /> Service </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                  <details className='p-0 m-0' open>
                    <summary>
                      <label className="toggler full_width">
                        <a className="pull-left">
                          SmartSearch - Filters  
                        </a>
                        <span className='ms-3'>
                        {this?.state?.checkedItems != null && this.state.checkedItems.length > 0 &&
                              this.state.checkedItems.map((obj: any) => {
                                return <span> {obj.Title}
                                  <span className='me-1'>
                                    : ({this.getAllSubChildenCount(obj)})
                                  </span>
                                </span>
                              })
                            }
                        </span>
                      </label>
                      <hr className='m-0'></hr>
                    </summary>
                    <div className=" BdrBoxBlue ps-30 mb-3">
                      <div className="taskTeamBox mt-10">
                        <div className="p-0 mt-10 smartSearch-Filter-Section">
                          <label className='border-bottom full-width alignCenter pb-1'>
                            <input defaultChecked={this.state.checkedAll} onClick={(e) => this.SelectAllCategories(e)} id='chkAllCategory' type="checkbox" className="form-check-input me-1 mt-1" />
                            Client Category

                           
                          </label>
                          <CheckboxTree
                            nodes={this.state.filterItems}
                            checked={this.state.checked}
                            expanded={this.state.expanded}
                            onCheck={(e, checked) => this.onCheck(e, checked)}
                            onExpand={expanded => this.setState({ expanded })}
                            nativeCheckboxes={true}
                            showNodeIcon={false}
                            checkModel={'all'}
                            icons={{
                              expandOpen: <SlArrowDown />,
                              expandClose: <SlArrowRight />,
                              parentClose: null,
                              parentOpen: null,
                              leaf: null,
                            }}
                          />
                        </div>

                        <div className="col-sm-12 mt-10 pe-1 text-end">
                          <button type="button" className="btnCol btn btn-primary" onClick={() => this.updatefilter()}>
                            Update Filters
                          </button>
                          <button type="button" className="btn btn-default ms-2" onClick={() => this.ClearFilters()}>
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </details>
          </div>




        </div>


        <div id="showSearchBox" className="col-sm-12 p-0 mb-10">
          <div className='Alltable'>
            {this.state.AllTimeEntry == undefined && this.state.AllTimeEntry.length == 0 &&
              <div id="contact" className="col-sm-12 p-0">
                <div className="current_commnet">No entries available</div>
              </div>
            }

            {this.state.AllTimeEntry != undefined && this.state.AllTimeEntry.length > 0 &&

              <div id="contact" className="col-sm-12 p-0">
                <div className='table-responsive fortablee'>
                  <GlobalCommanTable catogryDataLength={this?.state?.AllTimeEntryItem?.length} columns={this.columns} expendedTrue={true} data={this.state.AllTimeEntry} showHeader={true} showCatIcon={true} exportToExcelCategoryReport={this.exportToExcel} OpenAdjustedTimePopupCategory={this.OpenAdjustedTimePopup} callBackData={this?.callBackData} showDateTime={this.state.showDateTime} fixedWidth={true} /> </div>
              </div>
            }

          </div>
        </div>


        <Panel
          onRenderHeader={this.onRenderCustomHeaderMain}
          type={PanelType.custom}
          customWidth="800px"
          isOpen={this.state.opentaggedtask}
          onDismiss={this.cancelsmarttablePopup}
          isBlocking={false}
        >
          <div>
            <div className="modal-body">
              <div className="col-sm-12 tab-content bdrbox  mb-10">
                <div className=" mb-10">
                  <div className="container-new">
                    <GlobalCommanTable columns={this.timePopup} data={this?.state?.openTaggedTaskArray?.original?.AllTask} showCatIcon={true} callBackData={this?.callBackData} fixedWidth={true} />

                  </div>


                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this.cancelsmarttablePopup}>Cancel</button>
            </div>
          </div>
        </Panel>
        {this?.state?.IsTimeEntry && (
          <TimeEntryPopup
            props={this?.state?.SharewebTimeComponent}
             CallBackTimeEntry={this?.TimeEntryCallBack}
            Context={AllListId.Context}
          ></TimeEntryPopup>
        )}
        <Panel onRenderHeader={this.onRenderCustomHeaderMains}
          type={PanelType.custom}
          customWidth="600px"
          isOpen={this.state?.AdjustedTimePopup}
          onDismiss={this.cancelAdjustedTimePopup}
          isBlocking={false}
        >

          <div className="modal-body  clearfix">
            <div className="bdrbox allsites clearfix p-2">
              <div className="row" >
                <div className="col-sm-3">
                  {/* <select className="searchbox_height" name="AdjustedTime" id="cars" onSelect={AdjustedTimeType}>
                    <option value="Percentage">Percentage</option>
                    <option value="Divide">Divide</option>
                  </select> */}
                  <select className="form-select form-control p-1" defaultValue={this?.state?.AdjustedTimeType} onChange={(e) => this.setState({ AdjustedTimeType: e.target.value })}>
                    {this.state.AdjustedTimeArray.map(function (h: any, i: any) {
                      return (
                        <option key={i} selected={this?.state?.AdjustedTimeType == h.Title} value={h.Title} >{h.Title}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="col-sm-6">
                  <div className='input-group'>
                    <input id="AdjustedTime" type="search" defaultValue={this?.state?.AdjustedTimeCalcuValue}
                      placeholder="Adjusted Time" className="form-control" onChange={(e) => this.setState({ AdjustedTimeCalcuValue: e.target.value })} autoComplete="off"></input>
                  </div>
                </div>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-primary pull-right" onClick={this.SaveAdjustedTime}
                    title="Save changes & exit">
                    Save
                  </button>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-sm-3">
                  <div className='input-group'>
                    <label className="form-control">Target</label>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className='input-group'>
                    <input type="search" defaultValue={this.state.filledeDays} onChange={(e) => this.setState({ filledeDays: e.target.value })} placeholder="days" className="form-control"
                      autoComplete="off"></input>
                  </div>
                </div>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-primary pull-right"
                    onClick={this.ApplyCalculatedDays} title="Save changes & exit">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

        </Panel>

        {
          this.state.PresetPopup &&
          (<PreSetDatePikerPannel isOpen={this.state.PresetPopup} PreSetPikerCallBack={this.PreSetPikerCallBack} portfolioColor={portfolioColor} ></PreSetDatePikerPannel>)
        }
         {
          this.state.Preset2Popup &&
          (<PreSetDatePikerPannel2 isOpen={this.state.Preset2Popup} PreSetPikerCallBack={this.PreSetPikerCallBack2} portfolioColor={portfolioColor} ></PreSetDatePikerPannel2>)
        }
        {this?.state?.IsTask && (
          <EditTaskPopup
            Items={this.state.EditTaskItem}
            Call={this.Call}
            AllListId={AllListId}
            context={this?.props?.Context}
          ></EditTaskPopup>
        )}
      </div>

    );
  }
}




