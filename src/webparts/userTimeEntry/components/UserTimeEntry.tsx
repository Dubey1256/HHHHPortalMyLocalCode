import * as React from 'react';
import * as Moment from 'moment';
import { IUserTimeEntryProps } from './IUserTimeEntryProps';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {
  ColumnDef,
} from "@tanstack/react-table";
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import { Col, Row } from 'react-bootstrap';
import Loader from "react-loader";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import EditInstituton from "../../EditPopupFiles/EditComponent";
var AllListId: any;
export interface IUserTimeEntryState {
  Result: any;
  taskUsers: any;
  checked: any;
  expanded: any;
  checkedSites: any;
  expandedSites: any;
  filterItems: any;
  filterSites: any;
  ImageSelectedUsers: any;
  startdate: Date;
  enddate: Date;
  SitesConfig: any;
  AllTimeEntry: any;
  BackupAllTimeEntry: any;
  SelectGroupName: string;
  checkedAll: boolean;
  checkedAllSites: boolean;
  checkedParentNode: any;
  resultSummary: any;
  ShowingAllData: any;
  loaded: any;
  expandIcons: boolean;
  columns: ColumnDef<any, unknown>[];
  IsTask: any;
  IsMasterTask: any;
}
var user: any = ''
var userIdByQuery: any = ''
let portfolioColor: any = '';

export default class UserTimeEntry extends React.Component<IUserTimeEntryProps, IUserTimeEntryState> {
  public constructor(props: IUserTimeEntryProps, state: IUserTimeEntryState) {
    super(props);
    this.state = {
      Result: {},
      taskUsers: [],
      checked: [],
      expanded: [],
      checkedSites: [],
      expandedSites: [],
      filterItems: [],
      filterSites: [],
      ImageSelectedUsers: [],
      startdate: new Date(),
      enddate: new Date(),
      SitesConfig: [],
      AllTimeEntry: [],
      BackupAllTimeEntry: [],
      SelectGroupName: '',
      checkedAll: false,
      expandIcons: false,
      checkedAllSites: false,
      checkedParentNode: [],
      resultSummary: {},
      ShowingAllData: [],
      loaded: false,
      columns: [],
      IsTask: '',
      IsMasterTask: '',
    }
    this.GetResult();
  }

  private SelectedProp = this.props;
  private BackupAllTimeEntry: any = [];
  private AllTimeEntry: any = [];
  private TotalTimeEntry: any;
  private TotalDays: any;
  private AllYearMonth: any = [];
  private CategoryItemsArray: any = [];
  private StartWeekday: any;
  private endweekday: any;

  private async GetResult() {
    var queryString = window.location.search;

    // Create a URLSearchParams object to parse the query string
    var params = new URLSearchParams(queryString);

    // Get the value of the 'userId' parameter from the query string
    userIdByQuery = params.get('userId');
    console.log(userIdByQuery)
    await this.GetTaskUsers();
    await this.LoadAllMetaDataFilter();
    await this.DefaultValues()
    AllListId = this.props;
    AllListId.isShowTimeEntry = this.props.TimeEntry;
    AllListId.isShowSiteCompostion = this.props.SiteCompostion
  }

  private async DefaultValues() {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);

    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (userIdByQuery != undefined && userIdByQuery != '') {
      user = { "Id": userIdByQuery }
    }
    else {
      user = await web.currentUser.get();

    }
    if (user?.Id != null) {
      for (let i = 0; i < this.state.taskUsers.length; i++) {
        let item = this.state.taskUsers[i];
        for (let j = 0; j < item.childs.length; j++) {
          let it = item.childs[j];
          if (it.AssingedToUserId != null && it.AssingedToUserId == user?.Id) {
            item.activeUser = true;
            ImageSelectedUsers.push(it);
            document.getElementById('UserImg' + it.Id).classList.add('seclected-Image');
            break;
          }
        }
      }
    }
    document.getElementById('rdThisWeek').click();

    this.setState({ ImageSelectedUsers }, () => {
      this.updatefilter(true);
    });

  }


  private async GetTaskUsers() {
    this.setState({
      loaded: false,
    })
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let taskUsers = [];
    let results = [];
    results = await web.lists
      .getById(this.props.TaskUsertListID)
      .items
      .select('Id', 'IsShowReportPage', 'UserGroupId', 'Suffix', 'SmartTime', 'Title', 'Email', 'SortOrder', 'Role', 'Company', 'ParentID1', 'TaskStatusNotification', 'Status', 'Item_x0020_Cover', 'AssingedToUserId', 'isDeleted', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'ItemType')
      //.filter("ItemType eq 'User'")
      .expand('AssingedToUser')
      .orderBy('SortOrder', true)
      .orderBy("Title", true)
      .get();

    for (let index = 0; index < results.length; index++) {
      let element = results[index];
      if (element.UserGroupId == undefined) {
        this.getChilds(element, results);
        taskUsers.push(element);
      }
    }
    console.log(taskUsers);
    this.GetTimeEntry();
    this.setState({
      taskUsers: taskUsers
    })
  }


  private GetTimeEntry() {
    /*if ($scope.getUserID != undefined && $scope.getUserID != '') {
      let startweeked = getMonday(new Date());     
      $scope.StartWeekday = $scope.StartYearCurrent + '/01/01';
      $scope.endweekday = new Date().format("yyyy/MM/dd");
      //SharewebCommonFactoryService.showProgressBar();
  }
  else {    
    */
    this.StartWeekday = (new Date().getFullYear()).toString() + '/01/01';
    this.endweekday = Moment(new Date()).format("YYYY/MM/DD");
    //}
  }

  private getChilds(item: any, items: any) {
    item.childs = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
        childItem.IsSelected = false
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
    }, () => this.loadSmartFilters(ccResults, sitesResult))

  }

  private loadSmartFilters(items: any, siteItems: any) {
    let filterGroups = [];
    let filterItems = [];
    let filterSites = [];

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

    for (let index = 0; index < siteItems.length; index++) {
      let filterItem = siteItems[index];
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
          if (!this.IsExistsData(filterSites, item))
            filterSites.push(item);
          this.getChildsOfFilter(item, siteItems);
          if (item.children != undefined && item.children.length > 0) {
            for (let j = 0; j < item.children.length; j++) {
              let obj = item.children[j];
              if (obj.Title == 'Other')
                obj.ParentTitle = item.Title;
            }
          }

        }
      }
    }

    //console.log(filterGroups);
    console.log(filterItems);
    console.log(filterSites);
    this.setState({
      filterItems, filterSites
    })
  }

  private SelectAllCategories(ev: any) {
    let filterItem = this.state.filterItems;
    let checked: any = [];
    let select = ev.currentTarget.checked;
    if (select) {
      if (filterItem.length > 0) {
        filterItem.forEach((child: any) => {
          child.isExpand = false;
          checked.push(child.ID);
          if (child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              checked.push(subchild.Id);
              if (subchild.children.length > 0) {
                subchild.children.forEach((subchild2: any) => {
                  checked.push(subchild2.Id);
                  if (subchild2.children.length > 0) {
                    subchild2.children.forEach((subchild3: any) => {
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
      checkedAll: select
    });

  }

  private SelectAllSits(ev: any) {
    let filterItem = this.state.filterSites;
    let checked: any = [];
    let select = ev.currentTarget.checked;
    if (select) {
      if (filterItem.length > 0) {
        filterItem.forEach((child: any) => {
          checked.push(child.ID);
          if (child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              checked.push(subchild.Id);
              if (subchild.children.length > 0) {
                subchild.children.forEach((subchild2: any) => {
                  checked.push(subchild2.Id);
                  if (subchild2.children.length > 0) {
                    subchild2.children.forEach((subchild3: any) => {
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
      checkedSites: checked,
      checkedAllSites: select
    });

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
    if (item.children == undefined || item.children.length === 0)
      delete item.children;
  }

  private SelectAllGroupMember(ev: any) {
    let SelectGroupName = '';
    let select = ev.currentTarget.checked;
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (select == true) {
      this.state.taskUsers.forEach((item: any) => {
        if (item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = select;
          for (let index = 0; index < item.childs.length; index++) {
            let child = item.childs[index];
            child.IsSelected = true;
            try {
              document.getElementById('UserImg' + child.Id).classList.add('seclected-Image');
              if (child.Id != undefined && !this.isItemExists(ImageSelectedUsers, child.Id))
                ImageSelectedUsers.push(child)
            } catch (error) { }
          }
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

    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + ' ,';
    })
    SelectGroupName = SelectGroupName.replace(/.$/, "");

    this.setState({
      ImageSelectedUsers,
      SelectGroupName
    }, () => console.log(this.state.ImageSelectedUsers));

  }

  private SelectUserImage(ev: any, item: any) {
    let SelectGroupName = '';
    console.log(`The option ${ev.currentTarget.title}.`);
    console.log(item);
    //console.log(Parent);
    let ImageSelectedUsers = this.state.ImageSelectedUsers;

    const collection = document.getElementsByClassName("AssignUserPhoto mr-5");
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove('seclected-Image');
    }
    if (ev.currentTarget.className.indexOf('seclected-Image') > -1) {
      ev.currentTarget.classList.remove('seclected-Image');
      document.getElementById('UserImg' + item.Id).classList.remove('activeimg');
      item.IsSelected = false;
      //uncheck the group checkbox if any one child is unchecked
      // if (ev.currentTarget.closest('.ng-binding').children[0].checked) {
      //   ev.currentTarget.closest('.ng-binding').children[0].checked = false
      // }
      //remove element from array
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
      if (ImageSelectedUsers == undefined)
        ImageSelectedUsers = [];
      ImageSelectedUsers.push(item);
    }

    //need to check uncheck the group
    /*       
    this.state.taskUsers.forEach((user:any) => {
      if (Parent.Id == user.Id && user.childs != undefined && user.childs.length > 0) {
        let IsNeedToCheckParent = true;
        let IsNeedToUncheckParent = true;          
          user.childs.forEach((child:any) => {
              if (child.IsSelected == true) {
                IsNeedToCheckParent = true
              }
              if (child.IsSelected == false) {
                  IsNeedToCheckParent = false
              }
          })
          if (IsNeedToUncheckParent == true)
            ev.currentTarget.closest('.ng-binding').children[0].checked  = false;
          if (IsNeedToCheckParent == true)
            ev.currentTarget.closest('.ng-binding').children[0].checked  = true;
      }
    })  
    */
    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + ' ,'
    })
    SelectGroupName = SelectGroupName.replace(/.$/, "")

    this.setState({
      ImageSelectedUsers,
      SelectGroupName
    }, () => console.log(this.state.ImageSelectedUsers));
  }

  private SelectedGroup(ev: any, user: any) {
    let SelectGroupName = '';
    console.log(ev.currentTarget.checked)
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    let selected = ev.currentTarget.checked;
    if (selected) {
      for (let index = 0; index < this.state.taskUsers.length; index++) {
        let item = this.state.taskUsers[index];
        if (item.Title == user.Title && item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = selected;
          for (let j = 0; j < item.childs.length; j++) {
            let child = item.childs[j];
            child.IsSelected = true;
            document.getElementById('UserImg' + child.Id).classList.add('seclected-Image');
            if (child.Id != undefined && !this.isItemExists(this.state.ImageSelectedUsers, child.Id))
              ImageSelectedUsers.push(child)
          }
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
                ImageSelectedUsers.splice(k, 1);
            }
          })
        }
      }
    }

    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + ' ,'
    })
    SelectGroupName = SelectGroupName.replace(/.$/, "")

    this.setState({
      ImageSelectedUsers,
      SelectGroupName
    }, () => console.log(this.state.ImageSelectedUsers))

  }

  private isItemExists(array: any, items: any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.TaskItemID == items.TaskItemID) {
        if ((item.Effort != undefined && items.Effort != undefined) && (item.Effort == items.Effort)) {
          isExists = true;
          return false;
        }
      }
    }
    return isExists;
  }

  /*private isItemExists(array:any, Id:any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.Id == Id) {
        isExists = true;
        return true;
      }   
    }   
    return isExists;
  }
  */

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
    let diff: number, lastday: number;
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

    startdt.setHours(0, 0, 0, 0);
    enddt.setHours(0, 0, 0, 0);

    this.setState({
      startdate: startdt,
      enddate: enddt
    })
  }

  private updatefilter(IsLoader: any) {
    if (this.state.ImageSelectedUsers == undefined || this.state.ImageSelectedUsers.length == 0) {
      alert('Please Select User');
      return false;
    }
    else {
      if (IsLoader == true) {
        this.setState({
          loaded: false,
        })
      }
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
      .getById(this.props.TaskTimeSheet2ListID)
      .items
      .select('Id', 'Title', 'TaskDate', 'TaskTime', 'AdditionalTimeEntry', 'Description', 'Modified', 'TaskMigration/Id', 'TaskMigration/Title', 'TaskMigration/Created', 'AuthorId')
      .filter(filters)
      .expand('TaskMigration')
      .getAll(4999);
    console.log(resultsOfTimeSheet2);

    let resultsofTimeSheetNew = await web.lists
      .getById(this.props.TaskTimeSheetListNewListID)
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
    let countered = 0;
    AllTimeSheetResult.forEach(function (timeTab: any) {
      for (let i = 0; i < getSites.length; i++) {
        let config = getSites[i];

        if (config.Title != undefined && config.Title.toLowerCase() == "offshore tasks")
          config.Title = config.Title.replace(" ", "");

        let ColumnName = "Task" + config.Title.replace(" ", "");

        if (timeTab[ColumnName] != undefined && timeTab[ColumnName].Title != undefined) {
          timeTab.selectedSiteType = config.Title;
          timeTab.siteType = config.Title;
          //timeTab.getUserName = '';
          timeTab.newSiteUrl = config?.siteUrl?.Url; //timeTab.__metadata.uri.split('/_api')[0]
          timeTab.SiteUrl = timeTab.newSiteUrl;
          timeTab.SiteIcon = config?.Item_x005F_x0020_Cover?.Url;
          timeTab.listId = config?.listId;
          timeTab.Site = config.Title;
          timeTab.ImageUrl = config.ImageUrl;
          timeTab.TaskItemID = timeTab[ColumnName].Id;
          timeTab.TaskTitle = timeTab[ColumnName].Title;
          timeTab.TaskCreated = timeTab[ColumnName].Created;
          timeTab.NewTimeEntryDate = timeTab[ColumnName].TaskDate;
          timeTab.uniqueTimeEntryID = countered;
          AllTimeSpentDetails.push(timeTab);
        }
      }
      countered++;

    })
    console.log(AllTimeSpentDetails);
    const ids = AllTimeSpentDetails.map((o: { uniqueTimeEntryID: any; }) => o.uniqueTimeEntryID)
    AllTimeSpentDetails = AllTimeSpentDetails.filter(({ uniqueTimeEntryID }: any, index: number) => !ids.includes(uniqueTimeEntryID, index + 1))

    let getAllTimeEntry = [];
    for (let i = 0; i < AllTimeSpentDetails.length; i++) {
      let time = AllTimeSpentDetails[i];
      time.MileageJson = 0;
      let totletimeparent = 0;
      if (time.AdditionalTimeEntry != undefined) {
        let Additionaltimeentry = JSON.parse(time.AdditionalTimeEntry);

        if (Additionaltimeentry != undefined && Additionaltimeentry.length > 0) {
          let TimeTaskId = 0;
          let sortArray = Additionaltimeentry;
          this.DynamicSortitems(sortArray, 'ID', 'Number', 'Descending');
          TimeTaskId = sortArray[0].ID;
          TimeTaskId = TimeTaskId + 1;

          sortArray.forEach(function (first: { ID: any; }, index: any) {
            let count = 0;
            Additionaltimeentry.forEach(function (second: { ID: number; TimeEntryId: number; }) {
              if (second.ID != 0 && second.ID == undefined) {
                second.TimeEntryId = TimeTaskId;
                TimeTaskId = TimeTaskId + 1;
              }
              else if (second.ID != undefined && first.ID == second.ID) {
                if (count != 0) {
                  second.TimeEntryId = TimeTaskId;
                  TimeTaskId = TimeTaskId + 1;
                }
                second.TimeEntryId = second.ID;
                count++;
              }
            })
          })
        }

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
              addtime.TimeEntryDate = addtime.TaskDate;
              addtime.NewTimeEntryDate = TaskDate;
              let datesplite = addtime.TaskDate.split("/");
              addtime.TimeEntrykDateNew = new Date(parseInt(datesplite[2], 10), parseInt(datesplite[1], 10) - 1, parseInt(datesplite[0], 10));
              //addtime.TimeEntrykDateNewback = datesplite[1] + '/' + datesplite[0] + '/' + datesplite[2];
              addtime.TaskTitle = time.TaskTitle;
              addtime.ID = time.ID;
              addtime.Title = time.Title;
              addtime.selectedSiteType = time.selectedSiteType;
              addtime.siteType = time.siteType;
              addtime.Site = time?.siteType;
              addtime.SiteIcon = time?.SiteIcon;//SharewebCommonFactoryService.GetIconImageUrl(addtime.selectedSiteType, _spPageContextInfo.webAbsoluteUrl);
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
          ListId: confi.listId,
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
      let serverDateTime: string;
      let mDateTime = Moment(LocalDateTime);
      serverDateTime = mDateTime.format(dtformat);
      return serverDateTime;
    }
    return '';
  }
  private Call = (res: any) => {
    this.updatefilter(false);
    this.setState({
      IsTask: '',
      IsMasterTask: ''
    })
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
        if (itemtype.ListName == 'OffshoreTasks') {
          itemtype.ListName = 'Offshore Tasks'
        }
        for (let j = 0; j < itemtype.Query.length; j++) {
          let queryType = itemtype.Query[j];
          let results = await web.lists
            .getByTitle(itemtype.ListName)
            .items
            .select('ParentTask/Title', 'ParentTask/Id', 'ClientTime', 'ItemRank', 'Portfolio/Id', 'Portfolio/Title', 'SiteCompositionSettings', 'TaskLevel', 'TaskLevel', 'TimeSpent', 'BasicImageInfo', 'OffshoreComments', 'OffshoreImageUrl', 'CompletedDate', 'TaskID', 'ResponsibleTeam/Id', 'ResponsibleTeam/Title', 'ClientCategory/Id', 'ClientCategory/Title', 'TaskCategories/Id', 'TaskCategories/Title', 'ParentTask/TaskID', 'TaskType/Id', 'TaskType/Title', 'TaskType/Level', 'TaskType/Prefix', 'PriorityRank', 'Reference_x0020_Item_x0020_Json', 'TeamMembers/Title', 'TeamMembers/Name', 'Component/Id', 'Component/Title', 'Component/ItemType', 'TeamMembers/Id', 'Item_x002d_Image', 'ComponentLink', 'IsTodaysTask', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id', 'AttachmentFiles/FileName', 'FileLeafRef', 'FeedBack', 'Title', 'Id', 'PercentComplete', 'Company', 'StartDate', 'DueDate', 'Comments', 'Categories', 'Status', 'WebpartId', 'Body', 'Mileage', 'PercentComplete', 'Attachments', 'Priority', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
            .filter(queryType.replace('filter=', '').trim())
            .expand('ParentTask', 'TaskType', 'AssignedTo', 'Component', 'AttachmentFiles', 'Author', 'Editor', 'TeamMembers', 'ResponsibleTeam', 'ClientCategory', 'TaskCategories', 'Portfolio')
            .orderBy('Id', false)
            .getAll(4999);
          console.log(results);
          callcount++;
          let self = this;
          results.forEach(function (Item) {
            Item.siteName = itemtype.ListName;
            Item.listId = itemtype.ListId;
            Item.ClientTime = JSON.parse(Item.ClientTime);
            Item.PercentComplete = Item.PercentComplete <= 1 ? Item.PercentComplete * 100 : Item.PercentComplete;
            if (Item.PercentComplete != undefined) {
              Item.PercentComplete = parseInt((Item.PercentComplete).toFixed(0));
            }
            Item.NewCompletedDate = Item.CompletedDate;
            Item.NewCreated = Item.Created;
            //Item.listId = '';//Item.__metadata.uri.split("(guid'")[1].split("')/Items")[0];

            if (Item.Created != undefined)
              Item.FiltercreatedDate = self.ConvertLocalTOServerDate(Item.Created, "DD/MM/YYYY");
            if (Item.CompletedDate != undefined)
              Item.FilterCompletedDate = self.ConvertLocalTOServerDate(Item.CompletedDate, "DD/MM/YYYY");
            AllSharewebSiteTasks.push(Item);
          })
        }
      }

      console.log(AllSharewebSiteTasks);

      console.log(this.state.filterItems);
      let filterItems = this.state.filterItems;
      getAllTimeEntry.forEach(function (filterItem: any) {
        filterItem.clientCategory = '';
        filterItem.clientCategoryIds = '';
        AllSharewebSiteTasks.forEach(function (getItem: any) {
          if (filterItem.TaskItemID == getItem.Id && filterItem.selectedSiteType == getItem.siteName) {
            if (filterItem.siteType != undefined && filterItem.siteType == 'ALAK_Digital') {
              filterItem.siteType = 'ALAKDigital'
            }
            getItem['siteType'] = filterItem.siteType;

            filterItem.CategoryParentId = 0;
            let cate = '';
            if (getItem?.ClientCategory != undefined && getItem?.ClientCategory?.length > 0) {
              getItem?.ClientCategory.forEach(function (category: any) {
                if (category != undefined && category?.Title != undefined)
                  cate += category?.Title + '; ';
              })
            }
            filterItem.ClientCategory = cate
            //  filterItem.ClientCategory = getItem.ClientCategory;
            // getItem?.ClientCategory.forEach(function (client: any, index: any) {
            //   if (!this.isExistsclient(filterItem?.ClientCategory, client?.Id))
            //     filterItem.clientCategory += client.Title + '; ';
            //   filterItem.clientCategoryIds += client.Id + '; ';
            //   if (index == 0 && client.ParentID != undefined)
            //     filterItem.CategoryParentId = client.ParentID;
            // })

            let clientTimeArr: any = [];
            getItem.ClientTime.forEach(function (val: { [x: string]: number; ClienTimeDescription: number; }) {
              val['releventTime'] = (filterItem.Effort / 100) * val.ClienTimeDescription;;
              if (val.ClienTimeDescription != undefined && val.ClienTimeDescription != 100) {
                clientTimeArr.push(val);
              }
            })
            filterItem.clientTimeInfo = clientTimeArr;
            filterItem.flag = true;

            filterItem.PercentComplete = getItem.PercentComplete;
            filterItem.ItemRank = getItem.ItemRank;
            filterItem.PriorityRank = getItem?.PriorityRank;
            filterItem.TaskID = ''//SharewebCommonFactoryService.getSharewebId(getItem);
            filterItem.Portfolio = getItem?.Portfolio?.Title;
            filterItem.Created = getItem.Created;
            //filterItem.ListId = getItem.ListId
            filterItem.listId = getItem.listId

            if (getItem.Portfolio != undefined) {

              filterItem.ComponentTitle = getItem.Portfolio?.Title;
              filterItem.ComponentIDs = getItem.Portfolio?.Id;
              filterItem.PortfolioItem = getItem?.Portfolio
              filterItem.Portfolio = getItem?.Portfolio?.Title

            }
            // if (getItem.Services != undefined && getItem.Services.length > 0) {
            //   getItem.Services.forEach(function (sItem: any) {
            //     filterItem.ComponentTitle = sItem.Title;
            //     filterItem.ComponentIDs = sItem.Id;
            //   })
            //   filterItem.Portfoliotype = 'Service';
            // }
            // if (getItem.Events != undefined && getItem.Events.results != undefined && getItem.Events.results.length > 0) {
            //   getItem.Events.forEach(function (eItem: any) {
            //     filterItem.ComponentTitle = eItem.Title;
            //     filterItem.ComponentIDs = eItem.Id;
            //   })
            //   filterItem.Portfoliotype = 'Event';
            // }
            // filterItem.Component = getItem.Component;
            // filterItem.Services = getItem.Services;
            // filterItem.Events = getItem.Events;

          }
        })
      })
      getAllTimeEntry.forEach(function (item: { [x: string]: any; }, index: number) {
        item['uniqueTimeId'] = index + 1;
      })
      AllTimeEntryItem = getAllTimeEntry;
      let CopyAllTimeEntry = [...AllTimeEntryItem]
      this.BackupAllTimeEntry = CopyAllTimeEntry;
      console.log('All Time Entry');
      console.log(AllTimeEntryItem);
      this.TotalTimeEntry = 0;
      for (let index = 0; index < AllTimeEntryItem.length; index++) {
        this.TotalTimeEntry += AllTimeEntryItem[index].Effort;
      }

      this.TotalTimeEntry = (this.TotalTimeEntry).toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = (this.TotalDays).toFixed(2);
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
    let filterCheckedSites = this.state.checkedSites;
    let filterSites = this.state.filterSites;

    // if (this.state.checked.length == 0) {
    //   filterCheckedItem = [];
    //   //set All values in filterCheckedItem
    //   if (filterItems.length > 0) {
    //     filterItems.forEach((child: any) => {
    //       filterCheckedItem.push(child.ID);
    //       if (child.children.length > 0) {
    //         child.children.forEach((subchild: any) => {
    //           filterCheckedItem.push(subchild.Id);
    //           if (subchild.children.length > 0) {
    //             subchild.children.forEach((subchild2: any) => {
    //               filterCheckedItem.push(subchild2.Id);
    //               if (subchild2.children.length > 0) {
    //                 subchild2.children.forEach((subchild3: any) => {
    //                   filterCheckedItem.push(subchild3.Id);
    //                 });
    //               }
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }
    // }
    // if (this.state.checkedSites.length == 0) {
    //   filterCheckedSites = [];
    //   //set All values in filterSites
    //   if (filterSites.length > 0) {
    //     filterSites.forEach((child: any) => {
    //       filterCheckedSites.push(child.ID);
    //       if (child.children.length > 0) {
    //         child.children.forEach((subchild: any) => {
    //           filterCheckedSites.push(subchild.Id);
    //           if (subchild.children.length > 0) {
    //             subchild.children.forEach((subchild2: any) => {
    //               filterCheckedSites.push(subchild2.Id);
    //               if (subchild2.children.length > 0) {
    //                 subchild2.children.forEach((subchild3: any) => {
    //                   filterCheckedSites.push(subchild3.Id);
    //                 });
    //               }
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }

    // }
    //Get Selected filters of category
    if (filterCheckedSites != undefined && filterCheckedItem?.length > 0) {
      for (let index = 0; index < filterCheckedItem?.length; index++) {
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
    }
    //Get Selected filters of sites
    if (filterCheckedSites != undefined && filterCheckedSites?.length > 0) {
      for (let index = 0; index < filterCheckedSites?.length; index++) {
        let id = filterCheckedSites[index];
        filterSites.forEach(function (filterItem: any) {
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
    }
    console.log('Selected Filter checkbox');
    console.log(selectedFilters);

    let SitesItems = [];
    let isSitesSelected = false;
    let CategoryItems = [];
    let isCategorySelected = false;
    let ParentsArray = [];
    let count = 1
    if (selectedFilters.length > 0) {
      let isSitesSelected = false;
      for (let index = 0; index < filterTask.length; index++) {
        let item = filterTask[index];
        //item.TimeEntryIDunique = index + 1;
        for (let i = 0; i < selectedFilters.length; i++) {
          //if (selectedFilters[i].Selected) {
          let flag = false;
          switch (selectedFilters[i].TaxType) {
            case 'Client Category':
              if (item.clientCategoryIds != undefined && item.clientCategoryIds != '') {
                let Category = item.clientCategoryIds.split(';');
                //let title = selectedFilters[i].ParentTitle == 'PSE' ? 'EPS' : (selectedFilters[i].ParentTitle == 'e+i' ? 'EI' : selectedFilters[i].ParentTitle);
                let title = selectedFilters[i].Title == 'PSE' ? 'EPS' : (selectedFilters[i].Title == 'e+i' ? 'EI' : selectedFilters[i].Title);
                for (let j = 0; j < Category.length; j++) {
                  let type = Category[j]
                  if ((type == selectedFilters[i].Id) && !this.issmartExistsIds(CategoryItems, item)) {
                    if (item.clientTimeInfo != undefined && item.clientTimeInfo.length > 0) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (obj.SiteName == title && obj.releventTime != undefined) {
                          item.Effort = obj.releventTime;
                        }
                      }
                    }
                    item['uniqueTimeId'] = count
                    CategoryItems.push(item);
                    count++;
                  }
                  else if ((type == selectedFilters[i].Id) && this.issmartExistsIds(CategoryItems, item)) {
                    if (item.clientTimeInfo != undefined && item.clientTimeInfo.length > 0) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (obj.SiteName == title && obj.releventTime != undefined) {
                          item.Effort = obj.releventTime;
                        }
                      }
                    }
                    item['uniqueTimeId'] = count
                    CategoryItems.push(item);
                    count++;
                  }
                }
              }

              if (item.clientCategoryIds == '') {
                //let title = selectedFilters[i].ParentTitle == 'PSE' ? 'EPS' : (selectedFilters[i].ParentTitle == 'e+i' ? 'EI' : selectedFilters[i].ParentTitle);
                let title = selectedFilters[i].Title == 'PSE' ? 'EPS' : (selectedFilters[i].Title == 'e+i' ? 'EI' : selectedFilters[i].Title);
                if (selectedFilters[i].Title == 'Other') {
                  if ((item.siteType != undefined && item.siteType == title && (item.ClientCategory.results == undefined || item.ClientCategory.results.length == 0) && !this.issmartExistsIds(CategoryItems, item))) {
                    if (item.clientTimeInfo != undefined && item.clientTimeInfo.length > 0) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (obj.SiteName == title && obj.releventTime != undefined) {
                          item.Effort = obj.releventTime;
                        }
                      }
                    }
                    item['uniqueTimeId'] = count
                    CategoryItems.push(item);
                    count++;
                  }
                }
              }
              if (item.siteType != undefined && selectedFilters[i].TaxType == 'Client Category' && item.siteType == selectedFilters[i].Title) {
                item['uniqueTimeId'] = count
                CategoryItems.push(item);
                count++;
              }

              isCategorySelected = true;
              const ids: any = CategoryItems.map(o => o.uniqueTimeId);
              CategoryItems = CategoryItems.filter(({ uniqueTimeId }, index) => !ids.includes(uniqueTimeId, index + 1))

              break;

            case 'Sites':

              if ((item.selectedSiteType != undefined && item.selectedSiteType != '') && (item.selectedSiteType.toLowerCase().indexOf(selectedFilters[i].Title.toLowerCase()) > -1) && (!this.issmartExistsIds(SitesItems, item))) {
                SitesItems.push(item);
              }
              isSitesSelected = true;
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
      if (isSitesSelected) {
        isOtherselected = true;
        if (commonItems.length > 0) {
          commonItems = this.getAllowCommonItems(commonItems, SitesItems);
          if (commonItems.length == 0) {
            CategoryItems = null;
            SitesItems = null;
          }
        }
        else
          commonItems = SitesItems;
      }
      console.log('Common Items');
      console.log(commonItems);

      let commonItemsbackup = commonItems;
      this.DynamicSortitems(commonItemsbackup, 'TimeEntrykDateNew', 'DateTime', 'Descending');
      console.log('Sorted items based on time');
      console.log(commonItemsbackup);


      this.TotalTimeEntry = 0;
      //  $scope.TotalTimeEntry 

      this.AllTimeEntry = commonItemsbackup;

      console.log('All Time Entry');
      console.log(this.AllTimeEntry);

      this.TotalTimeEntry = 0;
      for (let index = 0; index < this.AllTimeEntry.length; index++) {
        let timeitem = this.AllTimeEntry[index];
        this.TotalTimeEntry += timeitem.Effort;

      }
      this.TotalTimeEntry = (this.TotalTimeEntry).toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = (this.TotalDays).toFixed(2);
      let resultSummary = {}

      let TotalValue = 0, SmartHoursTotal = 0, AdjustedTime = 0, RoundAdjustedTime = 0, totalEntries = 0;
      if (this.AllTimeEntry.length > 0) {
        for (let index = 0; index < this.AllTimeEntry.length; index++) {
          let element = this.AllTimeEntry[index];
          TotalValue += parseFloat(element.TotalValue);
          SmartHoursTotal += parseFloat(element.SmartHoursTotal);
          AdjustedTime += parseFloat(element.AdjustedTime);
          RoundAdjustedTime += parseFloat(element.RoundAdjustedTime);
          /*
          element.childs.forEach(function(ele) {
            totalEntries += ele.AllTask.length;
          });
          */
        }
        resultSummary = {
          totalTime: this.TotalTimeEntry,
          totalDays: this.TotalDays,
          totalEntries: this.AllTimeEntry.length
        }
      }

      console.log(resultSummary);

      this.setState({
        AllTimeEntry: this.AllTimeEntry,
        resultSummary,
      }, () => this.createTableColumns())
      //$scope.CopyAllTimeEntry = SharewebCommonFactoryService.ArrayCopy($scope.AllTimeEntry);

    }
    else {
      this.AllTimeEntry = filterTask;
      console.log('All Time Entry');
      console.log(this.AllTimeEntry);
      this.TotalTimeEntry = 0;
      for (let index = 0; index < this.AllTimeEntry.length; index++) {
        let timeitem = this.AllTimeEntry[index];
        this.TotalTimeEntry += timeitem.Effort;

      }
      this.TotalTimeEntry = (this.TotalTimeEntry).toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = (this.TotalDays).toFixed(2);
      let resultSummary = {}
      let TotalValue = 0, SmartHoursTotal = 0, AdjustedTime = 0, RoundAdjustedTime = 0, totalEntries = 0;
      if (this.AllTimeEntry.length > 0) {
        for (let index = 0; index < this.AllTimeEntry.length; index++) {
          let element = this.AllTimeEntry[index];
          TotalValue += parseFloat(element.TotalValue);
          SmartHoursTotal += parseFloat(element.SmartHoursTotal);
          AdjustedTime += parseFloat(element.AdjustedTime);
          RoundAdjustedTime += parseFloat(element.RoundAdjustedTime);
        }
        resultSummary = {
          totalTime: this.TotalTimeEntry,
          totalDays: this.TotalDays,
          totalEntries: this.AllTimeEntry.length
        }
      }
      console.log(resultSummary);
      this.setState({
        AllTimeEntry: this.AllTimeEntry,
        resultSummary,
      }, () => this.createTableColumns())
    }
    this.setState({
      loaded: true,
    }, () => this.createTableColumns())
  }

  private issmartExistsIds(array: any[], Ids: { TaskItemID: any; ID: any; TimeEntryId: any; }) {
    var isExists = false;
    array.forEach(function (item: { TaskItemID: any; ID: any; TimeEntryId: any; }) {
      if (item.TaskItemID == Ids.TaskItemID) {
        if ((item.ID == Ids.ID) && (item.TimeEntryId == Ids.TimeEntryId)) {
          isExists = true;
        }
      }
    });
    return isExists;
  }

  private isExistsclient(array: string | any[], Id: any) {
    var isExists = false;
    if (array != '' && array.indexOf(Id) > -1) {
      isExists = true;
    }
    return isExists;
  }

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
                if (item.AssingedToUserId == user?.Id) {
                  item.isActiveUser = true;
                }
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
      AllTimeEntry: this.BackupAllTimeEntry,
      checked: [],
      checkedSites: []
    }, () => this.createTableColumns())
  }

  private getAllSubChildenCount(item: any) {
    let count = 1;
    if (item.children.length > 0) {
      count += item.children.length;
      item.children.forEach((subchild: any) => {
        //checked.push(subchild.Id);
        if (subchild.children.length > 0) {
          count += subchild.children.length;
          subchild.children.forEach((subchild2: any) => {
            //checked.push(subchild2.Id);
            if (subchild2.children.length > 0) {
              count += subchild2.children.length;
              subchild2.children.forEach((subchild3: any) => {
                //checked.push(subchild3.Id);                                            
              });
            }
          });
        }
      });
    }

    return count;

  }

  private onCheck(checked: any) {
    debugger;
    this.setState({ checked }, () => {
      //Set/unset the selected checkbox parent name
      let filterItems = this.state.filterItems;
      let checkedIds = this.state.checked;
      let checkedParentNode: any = [];
      if (filterItems.length > 0) {
        filterItems.forEach((filterItem: any) => {
          let checked = false;
          checkedIds.forEach((element: any) => {
            if (filterItem.ID == element)
              checked = true;
          });
          if (checked)
            checkedParentNode.push(filterItem);
        })
      }

      this.setState({
        checkedParentNode,
        checkedAll: (filterItems.length == checkedParentNode.length) ? true : false
      })

    });
  }

  private sortBy(propertyName: any, order: any) {
    let AllTimeEntry = this.state.AllTimeEntry;
    AllTimeEntry.sort(function (a: any, b: any) {
      let aID = a[propertyName];
      let bID = b[propertyName];
      if (order)
        return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
      else
        return (aID == bID) ? 0 : (aID < bID) ? 1 : -1;
    });
    this.setState({
      AllTimeEntry
    })
  }
  private EditComponentPopup = (item: any) => {
    item["siteUrl"] = this.props?.Context?.pageContext?.web?.absoluteUrl;
    item["listName"] = "Master Tasks";
    this.setState({
      IsMasterTask: item
    });
  };
  private EditPopup = (item: any) => {
    item.Id = item?.TaskItemID;
    item.ID = item?.TaskItemID
    this.setState({
      IsTask: item
    });
  };

  private sortByChild(propertyName: any, order: any) {
    let AllTimeEntry = this.state.AllTimeEntry;
    AllTimeEntry.forEach(function (entry: any) {
      entry.childs.sort(function (a: any, b: any) {
        let aID = a[propertyName];
        let bID = b[propertyName];
        if (order)
          return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
        else
          return (aID == bID) ? 0 : (aID < bID) ? 1 : -1;
      });
    });
    this.setState({
      AllTimeEntry
    })
  }

  private createTableColumns() {

    let dt = [
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
        accessorFn: (info: any) => info?.Site,
        cell: (info: any) => <span>
          <img className='circularImage rounded-circle' src={info?.row?.original?.SiteIcon} />
        </span>,
        id: "Site",
        placeholder: "Site",
        header: "",
        resetSorting: false,
        resetColumnFilters: false,
        size: 90
      },
      {
        accessorKey: "TaskItemID",
        placeholder: "Task",
        id: "TaskItemID",
        header: "",
        size: 90,
      },

      {
        accessorKey: 'TaskTitle',
        id: "TaskTitle",
        header: "",
        placeholder: "Task Title",
        cell: (info: any) => <a data-interception="off" className="hreflink serviceColor_Active" target="_blank"
          href={this.props.Context.pageContext.web.absoluteUrl + "/SitePages/Task-Profile.aspx?taskId=" + info.row.original.TaskItemID + "&Site=" + info.row.original.siteType}>
          {info.row.original.TaskTitle}
        </a>,
        size: 175,
      },

      /*
       {
         accessorKey: "TaskTitle",
         placeholder: "Title",
         header: "",
         size: 175,
     },*/
      {
        accessorKey: "ClientCategory",
        id: "ClientCategory",
        placeholder: "Client Category",
        header: "",
        size: 90,
      },
      {
        accessorKey: "PercentComplete",
        id: "PercentComplete",
        placeholder: "%",
        header: "",
        size: 90,
      },

      {
        accessorKey: 'ComponentTitle',
        id: "ComponentTitle",
        header: "",
        placeholder: "Component",
        cell: (info: any) => <><a data-interception="off" className="hreflink serviceColor_Active" target="_blank"
          href={this.props.Context.pageContext.web.absoluteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + info.row?.original?.ComponentIDs}>
          {info.row?.original?.ComponentTitle}
        </a><span
          className="svg__iconbox svg__icon--edit alignIcon"
          onClick={(e) => this.EditComponentPopup(info.row?.original?.PortfolioItem)}>
          </span></>,
        size: 100,
      },

      {
        accessorKey: "Description",
        id: "Description",
        placeholder: "Time Description",
        header: "",
        size: 175,
      },
      {
        accessorKey: "TimeEntryDate",
        id: "TimeEntryDate",
        placeholder: "Time Entry",
        header: "",
        size: 175,
      },
      {
        accessorKey: "TaskTime",
        id: "TaskTime",
        placeholder: "Time",
        header: "",
        size: 90,
      }, {
        cell: (info: any) => (
          <span
            title="Edit Task"
            onClick={() => this.EditPopup(info?.row?.original)}
            className="alignIcon  svg__iconbox svg__icon--edit hreflink"
          ></span>
        ),
        id: 'Actions',
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 55
      }

    ]

    this.setState({
      columns: dt
    })

  }

  callBackData = (elem: any, ShowingData: any) => {
    this.setState({
      ShowingAllData: ShowingData
    }, () => console.log(this.state.ShowingAllData))
  }

  public render(): React.ReactElement<IUserTimeEntryProps> {

    //SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    //SPComponentLoader.loadCss("https://hhhhteams.sharepoint.com/sites/HHHH/Style%20Library/css/SPfoudationSupport.css");
    //SPComponentLoader.loadCss("https://hhhhteams.sharepoint.com/sites/HHHH/Style%20Library/css/SPfoundation.css");
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    console.log('Checked Categories === ', this.state.checked);
    console.log('Checked Sites === ', this.state.checkedSites);
    return (
      <div>
        <div className="p-0  " style={{ verticalAlign: "top" }}><h2 className="heading d-flex justify-content-between align-items-center"><span> <a>Timesheet</a> </span><span className="text-end fs-6"><a target="_blank" data-interception="off" href={`${this.props.Context.pageContext.web.absoluteUrl}/SitePages/UserTimeEntry-Old.aspx`}>Old UserTimeEntry</a></span></h2></div>
        <Col className='smartFilter bg-light border mb-3 '>
          <details className='p-0 m-0' open>
            <summary className='hyperlink'><a className="hreflink pull-left mr-5 pe-2 ">All Filters - <span className='me-1'>Task User :</span> </a>
              {this.state.ImageSelectedUsers != null && this.state.ImageSelectedUsers.length > 0 && this.state.ImageSelectedUsers.map((user: any, i: number) => {
                return <span className="ng-scope">
                  <img className="AssignUserPhoto mr-5" title={user.AssingedToUser.Title} src={user?.Item_x0020_Cover?.Url} />
                </span>
              })
              }
              {/* <span className="pull-right"><a href="#">Add smart favorite</a></span> */}

            </summary>

            <Col>
              <details open className='p-0'>
                <span className="pull-right" style={{ display: 'none' }}>
                  <input type="checkbox" className="" onClick={(e) => this.SelectAllGroupMember(e)} />
                  <label>Select All </label>
                </span>
                {/* <span className="plus-icon hreflink pl-10 pull-left ng-scope" >
                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/list-icon.png" />
            </span> */}
                {/* <summary><a className="hreflink pull-left mr-5">Task User : </a>
              {this.state.ImageSelectedUsers != null && this.state.ImageSelectedUsers.length > 0 && this.state.ImageSelectedUsers.map((user: any, i: number) => {
                return <span className="ng-scope">
                  <img className="AssignUserPhoto mr-5" title={user.AssingedToUser.Title} src={user?.Item_x0020_Cover?.Url} />
                </span>
              })
              }
              <span className="ng-binding ng-hide"> </span>
            </summary> */}
                <summary className='hyperlink'>
                  Team members
                  <hr></hr>
                </summary>

                <div style={{ display: "block" }}>
                  <div className="taskTeamBox ps-40 ">
                    {this.state.taskUsers != null && this.state.taskUsers.length > 0 && this.state.taskUsers.map((users: any, i: number) => {
                      return <div className="top-assign">
                        <div className="team ">
                          <label className="BdrBtm">
                            <input style={{ display: 'none' }} className="" type="checkbox" onClick={(e) => this.SelectedGroup(e, users)} />
                            {users.childs.length > 0 &&
                              <>
                                {users.Title}
                              </>

                            }

                          </label>
                          <div className='d-flex'>
                            {users.childs.length > 0 && users.childs.map((item: any, i: number) => {
                              return <div className="alignCenter">
                                {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined ?
                                  <span>
                                    <img id={"UserImg" + item.Id} className={item?.AssingedToUserId == user?.Id ? 'activeimg seclected-Image ProirityAssignedUserPhoto' : 'ProirityAssignedUserPhoto'} onClick={(e) => this.SelectUserImage(e, item)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                      title={item.AssingedToUser.Title}
                                      src={item.Item_x0020_Cover.Url} />
                                  </span> :
                                  <span className={item?.AssingedToUserId == user?.Id ? 'activeimg seclected-Image suffix_Usericon' : 'suffix_Usericon'} onClick={(e) => this.SelectUserImage(e, item)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                    title={item?.AssingedToUser?.Title}
                                  >{item?.Suffix}</span>
                                }
                              </div>
                            })}
                          </div>

                        </div>
                      </div>
                    })

                    }


                  </div>

                </div>
              </details>
              <details open>
                <summary className='hyperlink'>
                  Date
                  <hr></hr>
                </summary>
                <Row className="ps-30">
                  <div>
                    <div className="col TimeReportDays">
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" className="radio" name="dateSelection" id="rdCustom" value="Custom" ng-checked="unSelectToday=='Custom'" onClick={() => this.selectDate('Custom')} ng-model="radio" />
                        <label>Custom</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdToday" value="Today" onClick={() => this.selectDate('today')} ng-model="unSelectToday" className="radio" />
                        <label>Today</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdYesterday" value="Yesterday" onClick={() => this.selectDate('yesterday')} ng-model="unSelectYesterday" className="radio" />
                        <label> Yesterday </label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" defaultChecked={true} id="rdThisWeek" value="ThisWeek" onClick={() => this.selectDate('ThisWeek')} ng-model="unThisWeek" className="radio" />
                        <label> This Week</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdLastWeek" value="LastWeek" onClick={() => this.selectDate('LastWeek')} ng-model="unLastWeek" className="radio" />
                        <label> Last Week</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdThisMonth" value="EntrieMonth" onClick={() => this.selectDate('EntrieMonth')} ng-model="unEntrieMonth" className="radio" />
                        <label>This Month</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdLastMonth" value="LastMonth" onClick={() => this.selectDate('LastMonth')} ng-model="unLastMonth" className="radio" />
                        <label>Last Month</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdLast3Month" onClick={() => this.selectDate('Last3Month')} ng-model="unLast3Month" className="radio" />
                        <label>Last 3 Months</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdEntrieYear" onClick={() => this.selectDate('EntrieYear')} ng-model="unEntrieYear" className="radio" />
                        <label>This Year</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdLastYear" onClick={() => this.selectDate('LastYear')} ng-model="unLastYear" className="radio" />
                        <label>Last Year</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdAllTime" onClick={() => this.selectDate('AllTime')} ng-model="unAllTime" className="radio" />
                        <label>All Time</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="Presettime" onClick={() => this.selectDate('Presettime')} ng-model="unAllTime" className="radio" />
                        <label>Pre-set</label>
                        <span className="svg__iconbox svg__icon--editBox alignIcon" ng-click="OpenPresetDatePopup('Presettime')"></span>
                        {/* <img className="hreflink " title="open" ng-click="OpenPresetDatePopup('Presettime')" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" /> */}
                      </span>

                    </div>
                  </div>

                </Row>
                <Row className='ps-30 mt-2'>
                  <div className="col">
                    <label>Start Date</label>
                    <span style={{ display: 'inline-block' }}>
                      <DatePicker selected={this.state.startdate} dateFormat="dd/MM/yyyy" onChange={(date: any) => this.setStartDate(date)} className="full-width" />
                    </span>
                  </div>
                  <div className="col">
                    <label>End Date</label>
                    <span style={{ display: 'inline-block' }}>
                      <DatePicker selected={this.state.enddate} dateFormat="dd/MM/yyyy" onChange={(date: any) => this.setEndDate(date)} className="full-width" />
                    </span>
                  </div>
                  <div className='col'>
                    <label></label>
                    <div className='mt-1'>
                      <label> <input type="checkbox" className="form-check-input" ng-click="SelectedPortfolio('Component',PortfolioComponent)" /> Component</label>
                      <label><input type="checkbox" className="form-check-input" ng-click="SelectedPortfolio('Service',PortfolioComponent)" /> Service</label>
                    </div>
                  </div>
                </Row>
              </details>


              <div id="showFilterBox" className="col mb-2 p-0 ">
                <div className="togglebox">
                  <details open>
                    <summary className='hyperlink' ng-click="filtershowHide()">

                      {/* <img className="hreflink wid22" title="Filter" style={{width:'22px'}} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png"/> */}
                      SmartSearch – Filters
                      <hr></hr>


                      <span>
                        {this.state.checkedAll && this.state.filterItems != null && this.state.filterItems.length > 0 &&
                          this.state.filterItems.map((obj: any) => {
                            return <span> {obj.Title}
                              <span>
                                : ({this.getAllSubChildenCount(obj)})
                              </span>
                            </span>
                          })
                        }
                        {this.state.checkedAllSites && this.state.filterSites != null && this.state.filterSites.length > 0 &&
                          this.state.filterSites.map((obj: any) => {
                            return <span> {obj.Title}
                              <span>
                                : ({this.getAllSubChildenCount(obj)})
                              </span>
                            </span>
                          })
                        }
                        {this.state.checkedParentNode != null && !this.state.checkedAll && this.state.checkedParentNode.length > 0 &&
                          this.state.checkedParentNode.map((obj: any) => {
                            return <span> {obj.Title}
                              <span>
                                : ({this.getAllSubChildenCount(obj)})
                              </span>
                            </span>
                          })
                        }
                      </span>

                      {/* <span className="pull-right">
                    <span className="hreflink ng-scope" ng-if="!smartfilter2.expanded">
                      <img className="hreflink wid10" style={{width:'10px'}} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/sub_icon.png"/>
                    </span>
                  </span> */}
                    </summary>

                    <div className="togglecontent ps-30" style={{ display: "block" }}>
                      <div className="smartSearch-Filter-Section">
                        <table width="100%" className="indicator_search">
                          <tbody>
                            <tr>
                              <td valign="top">
                                <div>
                                  <label className='border-bottom full-width pb-1'>
                                    <input id='chkAllCategory' defaultChecked={this.state.checkedAll} onClick={(e) => this.SelectAllCategories(e)} type="checkbox" ng-model="item.Selected" className="form-check-input me-1" />
                                    Client Category
                                  </label>

                                  <CheckboxTree
                                    nodes={this.state.filterItems}
                                    checked={this.state.checked}
                                    expanded={this.state.expanded}
                                    onCheck={checked => this.setState({ checked })}
                                    onExpand={expanded => this.setState({ expanded })}
                                    nativeCheckboxes={true}
                                    showNodeIcon={false}
                                    checkModel={'all'}
                                    icons={{ expandOpen: <SlArrowDown />, expandClose: <SlArrowRight />, parentClose: null, parentOpen: null, leaf: null, }}
                                  />
                                </div>
                              </td>
                              <td valign="top">
                                <div>
                                  <label className='border-bottom full-width pb-1'>
                                    <input type="checkbox" id='chkAllSites' defaultChecked={this.state.checkedAllSites} onClick={(e) => this.SelectAllSits(e)} ng-model="item.Selected" className="form-check-input me-1" />
                                    Sites
                                  </label>

                                  <CheckboxTree
                                    nodes={this.state.filterSites}
                                    checked={this.state.checkedSites}
                                    expanded={this.state.expandedSites}
                                    onCheck={checkedSites => this.setState({ checkedSites })}
                                    onExpand={expandedSites => this.setState({ expandedSites })}
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
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </div>
                      <div className="col text-end mb-2 ">

                        <button type="button" className="btnCol btn btn-primary me-1" onClick={(e) => this.updatefilter(true)}>
                          Update Filters
                        </button>
                        <button type="button" className="btn btn-default me-1" onClick={() => this.ClearFilters()}>
                          Clear Filters
                        </button>
                      </div>

                    </div>

                  </details>
                </div>
              </div>
            </Col>
          </details>
        </Col>
        {this.state.AllTimeEntry != undefined && this.state.AllTimeEntry.length > 0 &&
          <div className='col'>
            <div className="Alltable p-0">
              <div className="wrapper">
                <Loader loaded={this.state.loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color={portfolioColor ? portfolioColor : "#000066"}
                  speed={2} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="28%" left="50%" scale={1.0} loadedClassName="loadedContent" />
                <GlobalCommanTable showHeader={true} showDateTime={' | Time: ' + this.state.resultSummary.totalTime + ' | Days: (' + this.state.resultSummary.totalDays + ')'} columns={this.state.columns} data={this.state.AllTimeEntry} callBackData={this.callBackData} />
              </div>
            </div>
          </div>
        }
        {this.state.IsTask && (
          <EditTaskPopup
            Items={this.state.IsTask}
            Call={this.Call}
            AllListId={AllListId}
            context={this?.props?.Context}
          ></EditTaskPopup>
        )}
        {this.state?.IsMasterTask && (
          <EditInstituton
            item={this.state.IsMasterTask}
            Calls={this.Call}
            SelectD={this?.props}
          >
            {" "}
          </EditInstituton>
        )}

      </div>
    );
  }
}
