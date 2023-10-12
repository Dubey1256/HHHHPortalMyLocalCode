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
  AllPortfolioType: any;
}

export default class CategoriesWeeklyMultipleReport extends React.Component<ICategoriesWeeklyMultipleReportProps, ICategoriesWeeklyMultipleReportState> {
  // columns: ({ accessorKey: any; placeholder: string; hasCheckbox: boolean; hasCustomExpanded: boolean; hasExpanded: boolean; size: number; id: string; header?: undefined; resetColumnFilters?: undefined; } | { accessorKey: string; placeholder: string; header: string; resetColumnFilters: boolean; size: number; id: string; hasCheckbox?: undefined; hasCustomExpanded?: undefined; hasExpanded?: undefined; })[];
  columns: any;

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
      AllPortfolioType: [{ 'Title': 'Component', 'Selected': true, 'SortOrder': 1 }, { 'Title': 'Service', 'Selected': true, 'SortOrder': 2 }],
    }
    //this.GetResult();   
    this.columns = [


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
        accessorKey: "getUserName",
        placeholder: "User Name",
        header: "",
        resetColumnFilters: false,
        size: 91,
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
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.RoundAdjustedTime !== undefined ? (
                <span>
                  {row?.original?.RoundAdjustedTime}
                </span>
              ) : (
                <span>{row?.original?.Rountfiguretime}</span>
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

    this.GetTaskUsers();
    this.LoadAllMetaDataFilter();

    this.callBackData = this.callBackData.bind(this);
  }
  rerender = () => {
    this.setState({});
  };

  callBackData(checkData: any) {
    // You can now use this.setState to update your component's state
    // if (checkData !== undefined) {
    //   this.setState({ checkedList: checkData });
    // } else {
    //   this.setState({ checkedList: {} });
    // }
  }

  private ShowAllTask(e: any, item: any) {
    console.log(item);
    this.setState({ openTaggedTaskArray: item });
    this.setState({ opentaggedtask: true });
  }
  private async GetTaskUsers() {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let taskUsers = [];
    let results = [];
    results = await web.lists
      .getByTitle('Task Users')
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
      .getByTitle('SmartMetadata')
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

  private loadSmartFilters(items: any) {
    let filterGroups = [];
    let filterItems = [];

    for (let index = 0; index < items.length; index++) {
      let filterItem = items[index];
      if (filterItem.SmartFilters != undefined && filterItem.SmartFilters.indexOf('Dashboard') > -1) {
        let item: any = {};
        item.ID = filterItem.Id;
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
    this.setState({
      filterItems: filterItems
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
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (select == true) {
      this.state.taskUsers.forEach((item: any) => {
        item.SelectedGroup = select;
        if (item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = select;
          item.childs.forEach((child: any) => {
            child.IsSelected = true;
            try {
              document.getElementById('UserImg' + child.Id).classList.add('seclected-Image');
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
              for (let k = 0; k < ImageSelectedUsers.length; k++) {
                let el = ImageSelectedUsers[k];
                if (el.Id == child.Id)
                  ImageSelectedUsers.splice(k, 1);
              }

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
      startdate: dt
    });
  }

  private setEndDate(dt: any) {
    this.setState({
      enddate: dt
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
      case 'Presettime1':
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
            .getByTitle(itemtype.ListName)
            .items
            .select('ParentTask/Title', 'ParentTask/Id', 'Portfolio/ItemType', 'ClientTime', 'Portfolio/Id', 'Portfolio/Title', 'ItemRank', 'Portfolio_x0020_Type', 'SiteCompositionSettings', 'TimeSpent', 'BasicImageInfo', 'OffshoreComments', 'OffshoreImageUrl', 'CompletedDate', 'ResponsibleTeam/Id', 'ResponsibleTeam/Title', 'ClientCategory/Id', 'ClientCategory/Title', 'TaskCategories/Id', 'TaskCategories/Title', 'ParentTask/TaskID', 'TaskType/Id', 'TaskType/Title', 'TaskType/Level', 'TaskType/Prefix', 'Priority_x0020_Rank', 'Reference_x0020_Item_x0020_Json', 'TeamMembers/Title', 'TeamMembers/Name', 'TeamMembers/Id', 'Item_x002d_Image', 'component_x0020_link', 'IsTodaysTask', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id', 'AttachmentFiles/FileName', 'FileLeafRef', 'FeedBack', 'Title', 'Id', 'PercentComplete', 'Company', 'StartDate', 'DueDate', 'Comments', 'Categories', 'Status', 'WebpartId', 'Body', 'Mileage', 'PercentComplete', 'Attachments', 'Priority', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
            .filter(queryType.replace('filter=', '').trim())
            .expand('ParentTask', 'Portfolio', 'TaskType', 'AssignedTo', 'AttachmentFiles', 'Author', 'Editor', 'TeamMembers', 'ResponsibleTeam', 'ClientCategory', 'TaskCategories')
            .orderBy('Id', false)
            .getAll(4999);
          console.log(results);
          results.forEach(function (Item) {
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
          })
        }
      }

      console.log(AllSharewebSiteTasks);

      console.log(this.state.filterItems);
      let filterItems = this.state.filterItems;
      getAllTimeEntry.forEach(function (filterItem: any) {
        AllSharewebSiteTasks.forEach(function (getItem: any) {
          if (filterItem.TaskItemID == '3018')
            debugger;
          if (filterItem.TaskItemID == getItem.Id && filterItem.selectedSiteType == getItem.siteName) {
            filterItem.clientCategory = '';
            filterItem.clientCategoryIds = '';
            //if ()
            getItem.ClientCategory.forEach(function (client: any) {
              if (client.Title != undefined && filterItem.clientCategory.indexOf(client.Title) == -1) {
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
                //     filterItem.clientCategory += client.Title + ';';
                // filterItem.clientCategoryIds += client.Id + ';';
              }
            })

            filterItem.flag = true;
            if (getItem.ClientTime != undefined && getItem.ClientTime.length > 0) {
              let Client = JSON.parse(getItem.ClientTime);
              filterItem.ClientTime = Client;
            }
            filterItem.PercentComplete = getItem.PercentComplete;
            filterItem.Priority_x0020_Rank = getItem.Priority_x0020_Rank;
            filterItem.TaskID = globalCommon.getTaskId(getItem);
            filterItem.Portfolio_x0020_Type = getItem.Portfolio_x0020_Type;
            filterItem.Created = getItem.Created;
            filterItem.siteImage = getItem.siteImage;
            // if (getItem.Component != undefined && getItem.Component.length > 0) {
            //   getItem.Component.forEach(function (cItem: any) {
            //     filterItem.ComponentTitle = cItem.Title;
            //     filterItem.ComponentIDs = cItem.Id;
            //   })
            //   filterItem.Portfoliotype = 'Component';
            // }
            // if (getItem.Services != undefined && getItem.Services.length > 0) {
            //   getItem.Services.forEach(function (sItem: any) {
            //     filterItem.ComponentTitle = sItem.Title;
            //     filterItem.ComponentIDs = sItem.Id;
            //   })
            //   filterItem.Portfoliotype = 'Service';
            // }
            if (filterItem?.Portfolio?.Title !== undefined) {
              filterItem.ComponentTitle = filterItem?.Portfolio?.Title;
              filterItem.ComponentIDs = filterItem?.Portfolio?.Id;
              filterItem.Portfoliotype = filterItem?.Portfolio?.ItemType;;
            }
            // filterItem.Component = getItem.Component;
            // filterItem.Services = getItem.Services;

          }
        })
      })

      AllTimeEntryItem = getAllTimeEntry;
      console.log('All Time Entry');
      console.log(AllTimeEntryItem);
      console.log('Filtered Items after all entry');
      console.log(filterItems);
      this.setState({
        filterItems: filterItems
      }, () => {
        this.getFilterTask(AllTimeEntryItem);
      })

      //$('#showSearchBox').show();

      //$scope.sortBy('TimeEntrykDateNew', true);
      //SharewebCommonFactoryService.hideProgressBar();

    }
    else {
      //SharewebCommonFactoryService.hideProgressBar();
      //$scope.TotalTimeEntry = 0;
      //$('#showSearchBox').show();
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
        if (item.TaskItemID == '3018')
          debugger;
        item.TimeEntryIDunique = index + 1;
        for (let i = 0; i < selectedFilters.length; i++) {
          //if (selectedFilters[i].Selected) {
          let flag = false;
          switch (selectedFilters[i].TaxType) {
            case 'Client Category':
              if (selectedFilters[i].Title != 'Other' && item.clientCategoryIds != undefined && item.clientCategoryIds != '') {
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
                      if (client.SiteName != undefined && client.SiteName == 'EI' && time.First == 'e+i')
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)
                      if (client.SiteName != undefined && client.SiteName == 'EPS' && time.First == 'PSE')
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)
                      if (client.SiteName != undefined && client.SiteName == 'Migration' && time.First == 'Migration')
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)
                      if (client.SiteName != undefined && client.SiteName == 'Education' && time.First == 'Education')
                        totalnew += ((time.Effort * client.ClienTimeDescription) / 100)

                      //  child.TotalValue = child.TotalSmartTime.toFixed(2)
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
      })
      this.AllTimeEntry = this.CategoryItemsArray;

      console.log('All Time Entry');
      console.log(this.AllTimeEntry);

      this.setState({
        AllTimeEntry: this.AllTimeEntry
      })
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
      filterItems.forEach(function (filt: any) {
        if (filt != undefined && filt.ID != undefined && filter.ID != undefined && filt.ID == filter.ID) {
          isExistsTitle = filt.Title;
          item.First = filt.Title;

        }
        if (filt.children != undefined && filt.children.length > 0) {
          filt.children.forEach(function (child: any) {
            if (child != undefined && child.ID != undefined && filter.ID != undefined && child.ID == filter.ID) {
              isExistsTitle = child.Title;
              item.Secondlevel = child.Title;
              item.First = filt.Title;
            }
            if (child.children != undefined && child.children.length > 0) {
              child.children.forEach(function (subchild: any) {
                if (subchild != undefined && subchild.ID != undefined && filter.ID != undefined && subchild.ID == filter.ID) {
                  isExistsTitle = child.Title;
                  item.Thirdlevel = subchild.Title;
                  item.Secondlevel = child.Title;
                  item.First = filt.Title;
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
    filterGroups[item.index].checked = item.checked;
    filterGroups[item.index].checkedObj = this.GetCheckedObject(filterGroups[item.index].children, checked, item.checked)
    // //// demo////
    if (filterGroups[item.index]?.children.length > 0) {
      const childrenLength = filterGroups[item.index]?.children?.reduce((total: any, obj: any) => total + (obj?.children?.length || 0), 0) + (filterGroups[item.index]?.children?.length ? filterGroups[item.index]?.children?.length : 0);
      filterGroups[item.index].selectAllChecked = childrenLength === checked?.length;
    }
    // ///end///
    this.setState({
      filterItems: filterGroups
    })
    // this.setState({ checked : item.checked});
    this.setState({ checked });
    // setFilterGroups(filterGroups);
    // rerender();
    // checkBoxColor();
    this.rerender()
  }
  private EditDataTimeEntryData = (e: any, item: any) => {
    this.setState({ IsTimeEntry: true });
    this.setState({ SharewebTimeComponent: item });
  };
  // private TimeEntryCallBack = React.useCallback((item1) => {
  //   this.setState({ IsTimeEntry: false });;
  // }, []);
  private SelectedPortfolio = (item: any) => {
    // $scope.Portfolio = item;
    // console.log($scope.Portfolio);
    // $scope.TotalTimeEntry = 0;

    this.state.AllPortfolioType.forEach((item: any) => {
      this.state.AllTimeEntry.forEach((timeTab: any) => {
        if (timeTab.Portfoliotype == item.Title) {
          // $scope.TotalTimeEntry += timeTab.Effort;
          timeTab.flag = item.Selected;

        }

      })

    })
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
          <div className="heading">Timesheet</div>
        </div>

        <div className="smartFilter bg-light border mb-3 col row">
          <div className="report-taskuser ps-0 pe-1">
            <details className='pt-1 m-0' open>
              <summary>
                <a className="hreflink pull-left mr-5">All filters :<span className='text-dark'>Task User :</span><span>
                  {this.state.SelectGroupName}
                </span> </a>
                {this.state.ImageSelectedUsers.length <= 3 ? (
                  this.state.ImageSelectedUsers.map(function (obj: any) {
                    return (<span className="marginR41">
                      <img
                        className="icon-sites-img me-1 ml20"
                        src={obj.Item_x0020_Cover.Url}
                      ></img>
                    </span>
                    )
                  })) : (
                  this.state.ImageSelectedUsers.length > 3 && <span>({this.state.ImageSelectedUsers.length})</span>)

                }


              </summary>
              <div className="BdrBoxBlue ps-30 mb-3">
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
                                        <img id={"UserImg" + item.Id} className="AssignUserPhoto rounded-circle" onClick={(e) => this.SelectUserImage(e, item, user)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                          title={item?.AssingedToUser?.Title}
                                          src={item?.Item_x0020_Cover?.Url !== undefined ? item?.Item_x0020_Cover?.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'} />
                                      </span> : <span>
                                        <img id={"UserImg" + item.Id} className="AssignUserPhoto rounded-circle" onClick={(e) => this.SelectUserImage(e, item, user)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
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
                    <div className=" BdrBoxBlue ps-30 mb-3">
                      <div className="taskTeamBox mt-10">
                        <div className="Weekly-TimeReportDays alignCenter">
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Custom'} id="selectedCustom" value="Custom" onClick={() => this.selectDate('Custom')} className="radio" />
                            <label>Custom</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Today'} id="selectedToday" value="Today" onClick={() => this.selectDate('today')} className="radio" />
                            <label>Today</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Yesterday'} id="selectedYesterday" value="Yesterday" onClick={() => this.selectDate('yesterday')} className="radio" />
                            <label> Yesterday </label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'ThisWeek'} id="selectedAll" value="ThisWeek" onClick={() => this.selectDate('ThisWeek')} className="radio" />
                            <label> This Week</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'LastWeek'} id="selectedAll" value="LastWeek" onClick={() => this.selectDate('LastWeek')} className="radio" />
                            <label> Last Week</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'EntrieMonth'} id="selectedAll" value="EntrieMonth" onClick={() => this.selectDate('EntrieMonth')} className="radio" />
                            <label>This Month</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'LastMonth'} id="selectedAll" value="LastMonth" onClick={() => this.selectDate('LastMonth')} className="radio" />
                            <label>Last Month</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Last3Month'} value="Last3Month" onClick={() => this.selectDate('Last3Month')} className="radio" />
                            <label>Last 3 Months</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'EntrieYear'} value="EntrieYear" onClick={() => this.selectDate('EntrieYear')} className="radio" />
                            <label>This Year</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'LastYear'} value="LastYear" onClick={() => this.selectDate('LastYear')} className="radio" />
                            <label>Last Year</label>
                          </span>
                          <span className='SpfxCheckRadio me-2'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'AllTime'} value="AllTime" onClick={() => this.selectDate('AllTime')} className="radio" />
                            <label>All Time</label>
                          </span>
                          <span className='SpfxCheckRadio me-2 alignCenter'>
                            <input type="radio" name="dateSelection" checked={this.state.SelecteddateChoice === 'Presettime'} value="Presettime" onClick={() => this.selectDate('Presettime')} className="radio" />
                            <label>Pre-set I</label>
                            {/* <img className="hreflink wid11 mr-5" title="open" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" /> */}
                            <span title="open" className='svg__iconbox svg__icon--editBox light'></span>
                          </span>
                          <span className='SpfxCheckRadio me-2 alignCenter'>
                            <input type="radio" id="Presettime1" checked={this.state.SelecteddateChoice === 'Presettime1'} name="dateSelection" value="Presettime1" onClick={() => this.selectDate('Presettime1')} className="radio" />
                            <label>Pre-set II</label>
                            {/* <img className="hreflink wid11 mr-5" title="open" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" /> */}
                            <span title="open" className='svg__iconbox svg__icon--editBox light'></span>
                          </span>
                        </div>
                        <div className='row mt-2'>
                          <div className='col-sm-3'>
                            <label className="full_width">Start Date</label>
                            <DatePicker selected={this.state.startdate} dateFormat="dd/MM/yyyy" onChange={(date) => this.setStartDate(date)} className="form-control" />
                          </div>
                          <div className='col-sm-3'>
                            <label className="full_width">End Date</label>
                            <DatePicker selected={this.state.enddate} dateFormat="dd/MM/yyyy" onChange={(date) => this.setEndDate(date)} className="form-control" />
                          </div>
                          <div className='col-sm-6 alignCenter'>
                            {this?.state?.AllPortfolioType?.length > 0 && this?.state?.AllPortfolioType.map((item: any) => {
                              return
                              <div>
                                <input type="checkbox" className="icon-input for_input mt-0"
                                  onClick={(e) => this.SelectedPortfolio(item)}>{item.Title} </input>
                              </div>

                            })}

                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                  <details className='p-0 m-0' open>
                    <summary>
                      <label className="toggler full_width">
                        <span className="pull-left">
                          {/* <img className="hreflink wid22" title="Filter" style={{ width: '22px' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png" /> */}
                          SmartSearch - Filters
                        </span>

                        {/* <span className="ml20">
                        </span>

                        <span className="pull-right">
                          <span className="hreflink">
                            <img className="hreflink wid10" style={{ width: '10px' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/sub_icon.png" />
                          </span>
                        </span> */}
                      </label>
                      <hr></hr>
                    </summary>
                    <div className=" BdrBoxBlue ps-30 mb-3">
                      <div className="taskTeamBox mt-10">
                        <div className="container p0 mt-10 smartSearch-Filter-Section">
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



          {/* <div className="col-sm-12 padL-0 PadR0 mt0 mb-20">
            <div className="col-sm-1 padL-0">
              <label ng-required="true" className="full_width ng-binding" ng-bind-html="GetColumnDetails('StartDate') | trustedHTML">Start Date</label>
              <DatePicker selected={this.state.startdate} dateFormat="dd/MM/yyyy" onChange={(date) => this.setStartDate(date)} className="form-control ng-pristine ng-valid ng-touched ng-not-empty" />
            </div>
            <div className="col-sm-1 padL-0">
              <label ng-required="true" className="full_width ng-binding" ng-bind-html="GetColumnDetails('EndDate') | trustedHTML" >End Date</label>
              <DatePicker selected={this.state.enddate} dateFormat="dd/MM/yyyy" onChange={(date) => this.setEndDate(date)} className="form-control ng-pristine ng-valid ng-touched ng-not-empty" />
            </div>
              <div className="" style={{ borderBottom: '1px solid #ccc;padding-bottom: 5px' }}>
              </div>
              
            <div className="clearfix"></div>
          </div> */}

          {/* <div id="showFilterBox" className="col-sm-12 tab-content mb-10 bdrbox pad10">
            <div className="togglebox">
              <span>
                <label className="toggler full_width" ng-click="filtershowHide()">
                  <span className="pull-left">
                    <img className="hreflink wid22" title="Filter" style={{ width: '22px' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png" />
                    SmartSearch – Filters
                  </span>

                  <span className="ml20">
                  </span>

                  <span className="pull-right">
                    <span className="hreflink ng-scope" ng-if="!smartfilter2.expanded">
                      <img className="hreflink wid10" style={{ width: '10px' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/sub_icon.png" />
                    </span>
                  </span>
                </label>

                <div className="togglecontent" style={{ display: "block" }}>
                  <div className="container p0 mt-10 smartSearch-Filter-Section">
                    <CheckboxTree
                      nodes={this.state.filterItems}
                      checked={this.state.checked}
                      expanded={this.state.expanded}
                      onCheck={checked => this.setState({ checked })}
                      onExpand={expanded => this.setState({ expanded })}
                      nativeCheckboxes={true}
                      showNodeIcon={false}
                      checkModel={'all'}
                    />
                  </div>

                  <div className="col-sm-12 padL-0 PadR0 mt-10 valign-middle">
                    <div className="col-sm-6"></div>
                    <div className="col-sm-3"></div>
                    <div className="col-sm-3 padL-0">
                      <button type="button" className="btn btn-default ml5 pull-right" onClick={() => this.ClearFilters()}>
                        Clear Filters
                      </button>
                      <button type="button" className="btn btn-primary pull-right" onClick={() => this.updatefilter()}>
                        Update Filters
                      </button>
                    </div>
                  </div>
                </div>

              </span>
            </div>
          </div> */}


        </div>


        <div id="showSearchBox" className="col-sm-12 padL-0 PadR0 mb-10">
          <div className='Alltable mt-5'>
            <div className='tbl-headings'>

            </div>

            {this.state.AllTimeEntry == undefined && this.state.AllTimeEntry.length == 0 &&
              <div id="contact" className="col-sm-12 padL-0 PadR0">
                <div className="current_commnet">No entries available</div>
              </div>
            }

            {this.state.AllTimeEntry != undefined && this.state.AllTimeEntry.length > 0 &&
              <div id="contact" className="col-sm-12 padL-0 PadR0">
                <div className='table-responsive fortablee'>
                  <GlobalCommanTable columns={this.columns} data={this.state.AllTimeEntry} showHeader={true} callBackData={this?.callBackData} fixedWidth={true} />
                  {/* <div className='dash-wrapper'>
                    <ul id='tasks'>
                      <li className="for-lis">
                        <div style={{ width: "2%" }}>
                          <div style={{ width: '80%' }}>
                            <a className="hreflink" title="Tap to expand the childs">
                              <img style={{ width: "10px;" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                            </a>
                            <a className="hreflink" title="Tap to Shrink the childs">
                              <img style={{ width: "10px;" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/list-icon.png" />
                            </a>
                          </div>
                        </div>
                        <div style={{ width: "16%" }} className="">
                          <div style={{ width: "94%" }} className="colm-relative">
                            <input type="text" id="searchTaskId" placeholder="User Name" title="Smart time" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "9%" }}>
                          <div style={{ width: "80%" }} className="colm-relative">
                            <input id="searchsiteType" style={{ fontWeight: "normal", width: "100%;" }} type="search" placeholder="Site" title="Smart time" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                            <span className="dropdown filer-icons">
                              <span className="filter-iconfil">
                                <i title="Site" className="fa fa-filter hreflink"></i>
                                <i title="Site" className="fa fa-filter hreflink glyphicon_active"></i>
                              </span>
                            </span>
                          </div>

                        </div>
                        <div style={{ width: "25%" }} className="padLR">
                          <div style={{ width: "99%" }} className="colm-relative">
                            <input type="text" id="searchSecondlevel" placeholder="First level" title="Smart time" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "9%" }} className="">
                          <div style={{ width: "95%" }} className="colm-relative">
                            <input id="searchTotalValue" type="text" placeholder="Time" title="Smart time" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "27%" }}>
                          <div style={{ width: "96%" }} className="colm-relative">
                            <input id="searchCategoriesItems" style={{ fontWeight: "normal;" }} type="search" placeholder="Categories" title="categories" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "5%" }}>
                          <div style={{ width: "100%" }} className="colm-relative">
                            <input id="searchTotalSmartTime" style={{ fontWeight: "normal;" }} type="search" placeholder="Smart Hours" title="Smart Hours" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "5%" }}>
                          <div style={{ width: "100%" }} className="colm-relative">
                            <input id="searchSmartHoursTime" style={{ fontWeight: "normal;" }} type="search" placeholder="Smart Hours (Roundup)" title="Smart Hours (Roundup)" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "5%" }}>
                          <div style={{ width: "100%" }} className="colm-relative">
                            <input id="searchAdjustedTime" style={{ fontWeight: "normal;" }} type="search" placeholder="Adjusted Hours" title="Adjusted Hours" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink  footerUsercolor"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "5%" }}>
                          <div style={{ width: "100%" }} className="colm-relative">
                            <input id="searchAdjustedHoursTime" style={{ fontWeight: "normal;" }} type="search" placeholder="Adjusted Hours (Roundup)" title="Adjusted Hours (Roundup)" className="full_width" />
                            <span className="searchclear-bg">X</span>
                            <span className="sortingfilter">
                              <span className="ml0">
                                <i className="fa fa-angle-up hreflink"></i>
                              </span>
                              <span className="ml0">
                                <i className="fa fa-angle-down hreflink"></i>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ width: "2%" }} className="padLR">
                          <div style={{ width: "80%" }} className=""></div>
                        </div>
                      </li>
                      {this.state.AllTimeEntry.map((item: any) => item).reverse().map((userTask: any, i: any) => {
                        return <>
                          <li className='for-lis for-c02  tdrows'>
                            <div style={{ width: "2%" }}>
                              <a className="hreflink" title="Expand  childs">
                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/right-list-icon.png" data-themekey="#" />
                              </a>
                              <a className="hreflink" title="Collapse  childs">
                                <img ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/list-icon.png" data-themekey="#" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/list-icon.png" />
                              </a>
                            </div>
                            <div style={{ width: "16%" }} className="padLR">{userTask.getUserName}</div>
                            <div style={{ width: "9%" }} className=""></div>
                            <div style={{ width: "25%" }} className="padLR"></div>
                            <div style={{ width: "9%" }} className="padLR">{userTask.TotalValue}</div>
                            <div style={{ width: "27%" }} className="padLR"></div>
                            <div style={{ width: "5%" }} className="padLR">{userTask.SmartHoursTotal}</div>
                            <div style={{ width: "5%" }} className="padLR">{userTask.SmartHoursTotal}</div>
                            <div style={{ width: "5%" }} className="padLR">{userTask.AdjustedTime}</div>
                            <div style={{ width: "5%" }} className="padLR">{userTask.RoundAdjustedTime}</div>
                            <div style={{ width: "2%" }} className="padLR"></div>
                          </li>
                          {userTask.childs.length > 0 && userTask.childs.map((child: any, j: any) => {
                            return <li className='for-lis project_actives tdrows serviceColor_Active'>
                              <div style={{ width: "2%" }}></div>
                              <div style={{ width: "16%" }} className="padLR"></div>
                              <div style={{ width: "9%" }} className="">{child.Firstlevel}</div>
                              <div style={{ width: "25%" }} className="padLR">{child.Secondlevel}</div>
                              <div style={{ width: "9%" }} className="padLR">{child.TotalValue}</div>
                              <div style={{ width: "27%" }} className="padLR">{child.clientCategory}</div>
                              <div style={{ width: "5%" }} className="padLR">{child.TotalSmartTime}</div>
                              <div style={{ width: "5%" }} className="padLR">{child.SmartHoursTime}</div>
                              <div style={{ width: "5%" }} className="padLR">{child.AdjustedTime}</div>
                              <div style={{ width: "5%" }} className="padLR">{child.Rountfiguretime}</div>
                              <div style={{ width: "2%" }} className="padLR"></div>
                            </li>
                          })
                          }
                        </>
                      })
                      }

                    </ul>
                  </div> */}
                </div>
              </div>
            }

          </div>
        </div>


        <Panel
          onRenderHeader={this.onRenderCustomHeaderMain}
          type={PanelType.custom}
          customWidth="600px"
          isOpen={this.state.opentaggedtask}
          onDismiss={this.cancelsmarttablePopup}
          isBlocking={false}
        >
          <div>
            <div className="modal-body">
              <div className="col-sm-12 tab-content bdrbox  mb-10">
                <div className=" mb-10">
                  <div className="container-new">
                    <div ng-show="AllTaskdetails.length > 0" className="section-event">
                      <table id="pexport-tablpopup" className="table table-hover SAP-Project" width="100%">
                        <thead>
                          <tr>

                            <th>
                              <div className="mt-5">
                                <span>Site</span>
                              </div>

                            </th>
                            <th  >
                              <div className="mt-5">
                                <span>Task Id</span>
                              </div>

                            </th>
                            <th >
                              <div className="mt-5">
                                <span>Title</span>
                              </div>

                            </th>
                            <th >
                              <div className="mt-5">
                                <span>Categories</span>
                              </div>

                            </th>
                            <th >
                              <div className="mt-5">
                                <span>%</span>
                              </div>

                            </th>
                            <th >
                              <div className="mt-5">
                                <span>StartDate</span>
                              </div>

                            </th>
                            <th >
                              <div className="mt-5">
                                <span>Effort</span>
                              </div>

                            </th>
                            <th >
                              <div className="mt-5">

                              </div>

                            </th>
                          </tr>
                        </thead>
                        <tbody id="copySmartTable">
                          {this?.state?.openTaggedTaskArray?.original?.AllTask?.length > 0 && (
                            this?.state?.openTaggedTaskArray?.original?.AllTask.map((item: any) => {
                              return (
                                <tr>
                                  <td>
                                    <img className="icon-sites-img ml-8"
                                      src={item.siteImage}></img>
                                  </td>
                                  <td>
                                    {item.TaskID}
                                  </td>
                                  <td>
                                    <a href={this.props.Context.pageContext.web.absoluteUrl + "/SitePages/Task-Profile.aspx?taskId=" + item?.TaskItemID + "&Site=" + item?.siteType}
                                      target="_blank" className="hreflink Report-title">
                                      <span>{item.TaskTitle}</span>
                                    </a>
                                  </td>
                                  <td>
                                    {item.clientCategory}
                                  </td>
                                  <td>
                                    {item.PercentComplete}
                                  </td>
                                  <td>
                                    {item.TaskDate}
                                  </td>
                                  <td>
                                    {item.Effort}
                                  </td>
                                  <td>
                                    <>
                                      {item?.siteType != "Master Tasks" && (
                                        <a className="alignCenter justify-content-center" onClick={(e) => this.EditDataTimeEntryData(e, item.original)}
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="auto"
                                          title="Click To Edit Timesheet"><span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
                                        </a>
                                      )}
                                    </>
                                  </td>
                                </tr>
                              )
                            }))}
                        </tbody>
                      </table>
                    </div>
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
            // CallBackTimeEntry={this?.TimeEntryCallBack}
            Context={this.context}
          ></TimeEntryPopup>
        )}
      </div>

    );
  }
}
