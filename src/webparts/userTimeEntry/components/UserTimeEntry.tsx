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
import * as globalCommon from "../../../globalComponents/globalCommon";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
var AllListId: any;
var AllPortfolios: any[] = [];
var AllPortfolioType = [{ 'Title': 'Component', 'Selected': true, }, { 'Title': 'Service', 'Selected': true, }];
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
  IsMasterTask: any;
  IsTask: any;
  IsPresetPopup: any;
  PresetEndDate: any,
  PresetStartDate: any,
  PreSetItem: any,
  isStartDatePickerOne: boolean;
  isEndDatePickerOne: boolean;
  IsCheckedComponent: boolean;
  IsCheckedService: boolean;
}
var user: any = ''
var userIdByQuery: any = ''
let portfolioColor: any = '';

export default class UserTimeEntry extends React.Component<IUserTimeEntryProps, IUserTimeEntryState> {
  openPanel: any;
  closePanel: any;
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
      IsPresetPopup: false,
      PresetEndDate: new Date(),
      PresetStartDate: new Date(),
      PreSetItem: {},
      isStartDatePickerOne: true,
      isEndDatePickerOne: false,
      IsCheckedComponent: true,
      IsCheckedService: true,
    }
    this.OpenPresetDatePopup = this.OpenPresetDatePopup.bind(this);
    this.ClosePopup = this.ClosePopup.bind(this);
    this.SavePresetDate = this.SavePresetDate.bind(this);
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
    await this.LoadPortfolio()
    await this.loadAdminConfigurations()
    await this.GetTaskUsers();
    await this.LoadAllMetaDataFilter();
    await this.DefaultValues()
    AllListId = this.props;
    AllListId.isShowTimeEntry = this.props.TimeEntry;
    AllListId.isShowSiteCompostion = this.props.SiteCompostion
  }
  private checkBoxColor = () => {
    setTimeout(() => {
      const inputElement = document.getElementsByClassName('custom-checkbox-tree');
      if (inputElement) {
        for (let j = 0; j < inputElement.length; j++) {
          const checkboxContainer = inputElement[j]
          const childElements = checkboxContainer.getElementsByTagName('input');
          const childElements2 = checkboxContainer.getElementsByClassName('rct-title');
          for (let i = 0; i < childElements.length; i++) {
            const checkbox = childElements[i];
            const lable: any = childElements2[i];
            if (lable?.style) {
              lable.style.color = portfolioColor;
            }
            checkbox.classList.add('form-check-input', 'cursor-pointer');
            if (lable?.innerHTML === "DE" || lable?.innerHTML === "QA" || lable?.innerHTML === "Health" || lable?.innerHTML === "DA E+E" || lable?.innerHTML === "Kathabeck"
              || lable?.innerHTML === "Gruene" || lable?.innerHTML === "HHHH" || lable?.innerHTML === "Other") {
              checkbox.classList.add('smartFilterAlignMarginQD');
            }
          }
        }
      }
    }, 1000);
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
  private async LoadPortfolio() {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    AllPortfolios = await web.lists.getById(this.props?.MasterTaskListID).items.select("ID", "Id", "Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/Title").expand("PortfolioType").top(4999).filter("(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')").get();
  }
  private async loadAdminConfigurations() {
    let web = new Web(this.props.Context.pageContext._site.absoluteUrl);
    let results = [];
    results = await web.lists.getById(this.props.AdminConfiguraionListId).items.select("Id,Title,Value,Key,Description,DisplayTitle,Configurations").filter("Key eq 'PreSetUserTimeEntry'").get();
    if (results[0] != undefined && results[0].Configurations != undefined) {
      results[0].Configurations = globalCommon.parseJSON(results[0]?.Configurations)
    }
    this.setState({
      PreSetItem: results[0],
    })
    this.setState({
      PresetEndDate: results[0]?.Configurations?.PreStartEnd,
      PresetStartDate: results[0]?.Configurations?.PreStartDate,
    })
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
    this.StartWeekday = (new Date().getFullYear()).toString() + '/01/01';
    this.endweekday = Moment(new Date()).format("YYYY/MM/DD");
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
    this.checkBoxColor()
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
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    const collection = document.getElementsByClassName("AssignUserPhoto mr-5");
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove('seclected-Image');
    }
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
      if (ImageSelectedUsers == undefined)
        ImageSelectedUsers = [];
      ImageSelectedUsers.push(item);
    }
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
    dt = new Date(dt);
    dt = Moment(dt).format("MM/DD/YYYY")
    this.setState({
      startdate: dt
    });
  }
  private setEndDate(dt: any) {
    dt = new Date(dt);
    dt = Moment(dt).format("MM/DD/YYYY")
    this.setState({
      enddate: dt
    });
  }
  private setPresetStartDate(PreStartDate: any) {
    PreStartDate = new Date(PreStartDate);
    PreStartDate = Moment(PreStartDate).format("MM/DD/YYYY")
    this.setState({
      PresetStartDate: PreStartDate,
      isStartDatePickerOne: true,
      isEndDatePickerOne: false,
    });
  }
  private setPresetEndDate(PreEndtDate: any) {
    PreEndtDate = new Date(PreEndtDate);
    PreEndtDate = Moment(PreEndtDate).format("MM/DD/YYYY")
    this.setState({
      PresetEndDate: PreEndtDate,
      isStartDatePickerOne: false,
      isEndDatePickerOne: true,
    });
  }
  private async OpenPresetDatePopup() {
    await this.loadAdminConfigurations();
    this.setState({
      IsPresetPopup: true,
    })
  }
  private ClosePopup() {
    this.setState({
      IsPresetPopup: false,
    })
  }
  private async SavePresetDate() {
    try {
      let web = new Web(this.props.Context.pageContext._site.absoluteUrl);
      let flag = true;
      var JsonItem: any = {};
      let ServerStartDate = new Date(this.state?.PresetStartDate);
      let ServerEndDate = new Date(this.state?.PresetEndDate);
      JsonItem.PreStartDate = this.state?.PresetStartDate;
      JsonItem.PreStartEnd = this.state?.PresetEndDate;
      if (ServerEndDate.getTime() <= ServerStartDate.getTime()) {
        flag = false
      }
      const PresetItem = {
        Configurations: JSON.stringify(JsonItem),
      }
      if (flag) {
        await web.lists.getById(this.props.AdminConfiguraionListId).items.getById(this?.state?.PreSetItem?.Id).update(PresetItem).then((res: any) => {
          this.loadAdminConfigurations()
        })
      }
      if (!flag) {
        window.alert("!Please re-enter the 'End date',It should be bigger then the 'Start Date'");
      }
      this.setState({
        IsPresetPopup: false,
      })
    } catch (error) {
      this.setState({
        IsPresetPopup: false,
      })
      console.log("Error:", error.messages)
    }
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
        startdt = new Date(this.state?.PresetStartDate);
        enddt = new Date(this.state?.PresetEndDate);
        break;
    }
    startdt.setHours(0, 0, 0, 0);
    enddt.setHours(0, 0, 0, 0);
    let StartDate: any
    StartDate = Moment(startdt).format("YYYY/MM/DD");
    let EndDate: any
    EndDate = Moment(enddt).format("YYYY/MM/DD");
    this.setState({
      startdate: StartDate,
      enddate: EndDate
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
      .select('Id', 'Title', 'TaskDate', 'TaskTime', 'AdditionalTimeEntry', 'Description', 'Modified', 'TaskMigration/Id', 'TaskMigration/Title', 'TaskMigration/Created', 'TaskALAKDigital/Id', 'TaskALAKDigital/Title', 'TaskALAKDigital/Created', 'AuthorId')
      .filter(filters)
      .expand('TaskMigration', 'TaskALAKDigital')
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
          timeTab.DisplayTaskId = timeTab[ColumnName].DisplayTaskId;
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
            let startDateConvert: any = this.state.startdate;
            startDateConvert = startDateConvert.split("/");
            let startdate = new Date(startDateConvert[0] + '/' + startDateConvert[1] + '/' + startDateConvert[2]);
            let endDateConvert: any = this.state.enddate;
            endDateConvert = endDateConvert.split("/");
            let enddate = new Date(endDateConvert[0] + '/' + endDateConvert[1] + '/' + endDateConvert[2]);
            if (TaskDate >= startdate && TaskDate <= enddate) {
              let hours = addtime.TaskTime;
              let minutes = hours * 60;
              addtime.TaskItemID = time.TaskItemID;
              addtime.DisplayTaskId = time.DisplayTaskId;
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
            Item.DisplayTaskId = globalCommon.GetTaskId(Item)
            Item.listId = itemtype.ListId;
            Item.ClientTime = JSON.parse(Item.ClientTime);
            Item.PercentComplete = Item.PercentComplete <= 1 ? Item.PercentComplete * 100 : Item.PercentComplete;
            if (Item.PercentComplete != undefined) {
              Item.PercentComplete = parseInt((Item.PercentComplete).toFixed(0));
            }
            Item.NewCompletedDate = Item.CompletedDate;
            Item.NewCreated = Item.Created;
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
            let clientTimeArr: any = [];
            if (getItem.ClientTime != undefined && getItem.ClientTime != '' && getItem.ClientTime?.length > 0) {
              getItem.ClientTime.forEach(function (val: { [x: string]: number; ClienTimeDescription: number; }) {
                val['releventTime'] = (filterItem.Effort / 100) * val.ClienTimeDescription;;
                if (val.ClienTimeDescription != undefined && val.ClienTimeDescription != 100) {
                  clientTimeArr.push(val);
                }
              })
            }
            filterItem.clientTimeInfo = clientTimeArr;
            filterItem.flag = true;
            filterItem.DisplayTaskId = getItem?.DisplayTaskId;
            filterItem.PercentComplete = getItem.PercentComplete;
            filterItem.ItemRank = getItem.ItemRank;
            filterItem.PriorityRank = getItem?.PriorityRank;
            filterItem.TaskID = ''
            filterItem.Portfolio = getItem?.Portfolio?.Title;
            filterItem.Created = getItem.Created;
            filterItem.listId = getItem.listId

            if (getItem.Portfolio != undefined) {
              if (AllPortfolios != undefined && AllPortfolios?.length > 0) {
                let result = AllPortfolios.filter((type: any) => type.Id != undefined && getItem.Portfolio != undefined && getItem.Portfolio?.Id != undefined && getItem.Portfolio?.Id == type.Id)[0];
                filterItem.PortfolioTypeTitle = "Component";
                if (result != undefined && result != '')
                  filterItem.PortfolioTypeTitle = result?.Title;
              }
              filterItem.ComponentTitle = getItem.Portfolio?.Title;
              filterItem.ComponentIDs = getItem.Portfolio?.Id;
              filterItem.PortfolioItem = getItem?.Portfolio
              filterItem.Portfolio = getItem?.Portfolio?.Title

            }
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
    }
    else {
      this.setState({
        loaded: true,
      })
    }
  }

  private getFilterTask(filterTask: any) {
    let selectedFilters: any = [];
    let filterItems = this.state.filterItems;
    let filterCheckedItem = this.state.checked;
    let filterCheckedSites = this.state.checkedSites;
    let filterSites = this.state.filterSites;
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
        for (let i = 0; i < selectedFilters.length; i++) {
          let flag = false;
          switch (selectedFilters[i].TaxType) {
            case 'Client Category':
              if (item.clientCategoryIds != undefined && item.clientCategoryIds != '') {
                let Category = item.clientCategoryIds.split(';');
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
      }, () => this.createTableColumns());
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
    this.AllTimeEntry = this.BackupAllTimeEntry;
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
        accessorKey: "DisplayTaskId",
        placeholder: "Task",
        id: "DisplayTaskId",
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
  private onRenderCustomHeaderMain = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div
          style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: "20px", }}  >
          <span>{`Select Pre-Set Date `}</span>
        </div>
        <Tooltip ComponentId={2330} />
      </div>
    );
  };
  private InlineChangeDate = function (Type: any) {
    if (this.state?.isStartDatePickerOne == true && this.state?.isEndDatePickerOne == false) {
      if (this.state?.PresetStartDate != undefined && this.state?.PresetStartDate != '') {
        let currentInput = this.state?.PresetStartDate.split('/')
        var currentInputMonth = currentInput[0];
        var currentInputYear = currentInput[2];
        let newDate;
        if (Type == 'today') {
          newDate = Moment(new Date()).format("MM/DD/YYYY");
        }
        else if (Type == 'year') {
          newDate = "01" + "/" + "01" + "/" + currentInputYear;
        }
        else if (Type == 'fifteenthOfMonth') {
          newDate = currentInputMonth + "/" + "15" + "/" + currentInputYear;
        }
        else if (Type == 'firstOfMonth') {
          newDate = currentInputMonth + "/" + "01" + "/" + currentInputYear
        }
        this.setState({
          PresetStartDate: newDate,
        })
      }
    }
    if (this.state?.isStartDatePickerOne == false && this.state?.isEndDatePickerOne == true) {
      let currentInput = this.state?.PresetEndDate.split('/')
      var currentInputMonth = currentInput[0];
      var currentInputYear = currentInput[2];
      let newDate;
      if (Type == 'today') {
        newDate = Moment(new Date()).format("MM/DD/YYYY");
      }
      else if (Type == 'year') {
        newDate = "01" + "/" + "01" + "/" + currentInputYear;
      }
      else if (Type == 'fifteenthOfMonth') {
        newDate = currentInputMonth + "/" + "15" + "/" + currentInputYear;
      }
      else if (Type == 'firstOfMonth') {
        newDate = currentInputMonth + "/" + "01" + "/" + currentInputYear
      }
      this.setState({
        PresetEndDate: newDate,
      })
    }
  }
  private IncreaseDecreaseDate = function (Type: any, addDate: any) {
    if (this.state?.isStartDatePickerOne == true && this.state?.isEndDatePickerOne == false) {
      let newDate;
      if (Type == "Increase") {
        if (this.state?.PresetStartDate != undefined && this.state?.PresetStartDate != undefined) {
          if (addDate == 'Month') {
            let ServerDate: any = new Date(this.state?.PresetStartDate)
            ServerDate = ServerDate.setMonth(ServerDate.getMonth() + 1);
            newDate = Moment(ServerDate).format("MM/DD/YYYY")
          }
          else if (addDate == 'Year') {
            let ServerDate: any = new Date(this.state?.PresetStartDate)
            ServerDate = ServerDate.setFullYear(ServerDate.getFullYear() + 1);
            newDate = Moment(ServerDate).format("MM/DD/YYYY")
          }
          else {
            let ServerDate: any = new Date(this.state?.PresetStartDate)
            ServerDate = ServerDate.setDate(ServerDate.getDate() + 1);
            newDate = Moment(ServerDate).format("MM/DD/YYYY")
          }
        }
      }
      else {
        if (addDate == 'Month') {
          let ServerDate: any = new Date(this.state?.PresetStartDate)
          ServerDate = ServerDate.setMonth(ServerDate.getMonth() - 1);
          newDate = Moment(ServerDate).format("MM/DD/YYYY")
        }
        else if (addDate == 'Year') {
          let ServerDate: any = new Date(this.state?.PresetStartDate)
          ServerDate = ServerDate.setFullYear(ServerDate.getFullYear() - 1);
          newDate = Moment(ServerDate).format("MM/DD/YYYY")
        }
        else {
          let ServerDate: any = new Date(this.state?.PresetStartDate)
          ServerDate = ServerDate.setDate(ServerDate.getDate() - 1);
          newDate = Moment(ServerDate).format("MM/DD/YYYY")
        }
      }
      this.setState({
        PresetStartDate: newDate,
      })
    }
    if (this.state?.isEndDatePickerOne == true && this.state?.isStartDatePickerOne == false) {
      let newDate;
      if (Type == "Increase") {
        if (this.state?.PresetEndDate != undefined && this.state?.PresetEndDate != undefined) {
          if (addDate == 'Month') {
            let ServerDate: any = new Date(this.state?.PresetEndDate)
            ServerDate = ServerDate.setMonth(ServerDate.getMonth() + 1);
            newDate = Moment(ServerDate).format("MM/DD/YYYY")
          }
          else if (addDate == 'Year') {
            let ServerDate: any = new Date(this.state?.PresetEndDate)
            ServerDate = ServerDate.setFullYear(ServerDate.getFullYear() + 1);
            newDate = Moment(ServerDate).format("MM/DD/YYYY")
          }
          else {
            let ServerDate: any = new Date(this.state?.PresetEndDate)
            ServerDate = ServerDate.setDate(ServerDate.getDate() + 1);
            newDate = Moment(ServerDate).format("MM/DD/YYYY")
          }
        }
      }
      else {
        if (addDate == 'Month') {
          let ServerDate: any = new Date(this.state?.PresetEndDate)
          ServerDate = ServerDate.setMonth(ServerDate.getMonth() - 1);
          newDate = Moment(ServerDate).format("MM/DD/YYYY")
        }
        else if (addDate == 'Year') {
          let ServerDate: any = new Date(this.state?.PresetEndDate)
          ServerDate = ServerDate.setFullYear(ServerDate.getFullYear() - 1);
          newDate = Moment(ServerDate).format("MM/DD/YYYY")
        }
        else {
          let ServerDate: any = new Date(this.state?.PresetEndDate)
          ServerDate = ServerDate.setDate(ServerDate.getDate() - 1);
          newDate = Moment(ServerDate).format("MM/DD/YYYY")
        }
      }
      this.setState({
        PresetEndDate: newDate,
      })
    }
  }
  private SelectedPortfolioItem(data: any, Type: any) {
    // if (Type == 'Component') {
    //   this.setState({
    //     IsCheckedComponent: data?.target?.checked,
    //   })
    // }
    // else {
    //   this.setState({
    //     IsCheckedService: data?.target?.checked,
    //   })
    // }
    // if (this.state?.IsCheckedComponent == true || this.state?.IsCheckedService == false) {
    //   if (this.BackupAllTimeEntry != undefined && this.BackupAllTimeEntry?.length > 0) {
    //     let result = this.BackupAllTimeEntry.filter((type: any) => type.PortfolioTypeTitle != undefined && Type != undefined && type.PortfolioTypeTitle.toLowerCase() == Type.toLowerCase());
    //     this.setState({
    //       AllTimeEntry: result,         
    //     })
    //   }
    // }
    // if (this.state?.IsCheckedComponent == false || this.state?.IsCheckedService == true) {
    //   if (this.BackupAllTimeEntry != undefined && this.BackupAllTimeEntry?.length > 0) {
    //     let result = this.BackupAllTimeEntry.filter((type: any) => type.PortfolioTypeTitle != undefined && Type != undefined && type.PortfolioTypeTitle.toLowerCase() == Type.toLowerCase());
    //     this.setState({
    //       AllTimeEntry: result,       
    //     })
    //   }
    // }
    // if (this.state?.IsCheckedComponent == true && this.state?.IsCheckedService == true) {
    //   this.setState({
    //     AllTimeEntry: this.BackupAllTimeEntry,
    //   })
    // }

  }
  callBackData = (elem: any, ShowingData: any) => {
    this.setState({
      ShowingAllData: ShowingData
    }, () => console.log(this.state.ShowingAllData))
  }
  public render(): React.ReactElement<IUserTimeEntryProps> {
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
        <div className="p-0  " style={{ verticalAlign: "top" }}><h2 className="heading d-flex justify-content-between align-items-center"><span> <a>All Timesheets</a> </span><span className="text-end fs-6"><a target="_blank" data-interception="off" href={`${this.props.Context.pageContext.web.absoluteUrl}/SitePages/UserTimeEntry-Old.aspx`}>Old UserTimeEntry</a></span></h2></div>
        <Col className='smartFilter bg-light border mb-3 '>
          <details className='p-0 m-0' open>
            <summary className='hyperlink'><a className="f-16 fw-semibold hreflink mr-5 pe-2 pull-left allfilter"> All Filters - <span className='me-1 fw-normal'>Task User :</span> </a>
              {this.state.ImageSelectedUsers != null && this.state.ImageSelectedUsers.length > 0 && this.state.ImageSelectedUsers.map((user: any, i: number) => {
                return <span>
                  <img className="AssignUserPhoto mr-5" title={user.AssingedToUser.Title} src={user?.Item_x0020_Cover?.Url} />
                </span>
              })
              }
            </summary>

            <Col className='SubFilters'>
              <details open className='p-0'>
                <span className="pull-right" style={{ display: 'none' }}>
                  <input type="checkbox" className="" onClick={(e) => this.SelectAllGroupMember(e)} />
                  <label>Select All </label>
                </span>
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
                        <input type="radio" className="radio" name="dateSelection" id="rdCustom" value="Custom" onClick={() => this.selectDate('Custom')} />
                        <label>Custom</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdToday" value="Today" onClick={() => this.selectDate('today')} className="radio" />
                        <label>Today</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdYesterday" value="Yesterday" onClick={() => this.selectDate('yesterday')} className="radio" />
                        <label> Yesterday </label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" defaultChecked={true} id="rdThisWeek" value="ThisWeek" onClick={() => this.selectDate('ThisWeek')} className="radio" />
                        <label> This Week</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdLastWeek" value="LastWeek" onClick={() => this.selectDate('LastWeek')} className="radio" />
                        <label> Last Week</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdThisMonth" value="EntrieMonth" onClick={() => this.selectDate('EntrieMonth')} className="radio" />
                        <label>This Month</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" id="rdLastMonth" value="LastMonth" onClick={() => this.selectDate('LastMonth')} className="radio" />
                        <label>Last Month</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdLast3Month" onClick={() => this.selectDate('Last3Month')} className="radio" />
                        <label>Last 3 Months</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdEntrieYear" onClick={() => this.selectDate('EntrieYear')} className="radio" />
                        <label>This Year</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdLastYear" onClick={() => this.selectDate('LastYear')} className="radio" />
                        <label>Last Year</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="rdAllTime" onClick={() => this.selectDate('AllTime')} className="radio" />
                        <label>All Time</label>
                      </span>
                      <span className='SpfxCheckRadio me-2'>
                        <input type="radio" name="dateSelection" value="Presettime" onClick={() => this.selectDate('Presettime')} className="radio" />
                        <label>Pre-set</label>
                        <span className="svg__iconbox svg__icon--editBox alignIcon hreflink" onClick={() => this.OpenPresetDatePopup()}></span>
                      </span>

                    </div>
                  </div>

                </Row>
                <Row className='ps-30 mt-2'>
                  <div className="col">
                    <label>Start Date</label>
                    <span>
                      {/* <DatePicker selected={this.state.startdate} dateFormat="dd/MM/yyyy" onChange={(date: any) => this.setStartDate(date)} className="full-width" /> */}
                      <input type="date" className="form-control" max="9999-12-31" min="1856-12-31"
                        value={this.state.startdate ? Moment(this.state.startdate).format("YYYY-MM-DD") : ''}
                        onChange={(date: any) => this.setStartDate(date.target?.value)} />
                    </span>
                  </div>
                  <div className="col">
                    <label>End Date</label>
                    <span>
                      {/* <DatePicker selected={this.state.enddate} dateFormat="dd/MM/yyyy" onChange={(date: any) => this.setEndDate(date)} className="full-width" /> */}
                      <input type="date" className="form-control" max="9999-12-31" min="1856-12-31"
                        value={this.state.enddate ? Moment(this.state.enddate).format("YYYY-MM-DD") : ''}
                        onChange={(date: any) => this.setEndDate(date.target?.value)} />
                    </span>
                  </div>
                  <div className='col'>
                    <div className='mt-1'>
                      <label className='full_width'>Portfolio Item</label>
                      <label> <input type="checkbox" checked={this.state?.IsCheckedComponent} className="form-check-input" onClick={(e) => this.SelectedPortfolioItem(e, 'Component')} /> Component</label>
                      <label><input type="checkbox" checked={this.state?.IsCheckedService} className="form-check-input ml-12" onClick={(e) => this.SelectedPortfolioItem(e, 'Service')} /> Service</label>
                    </div>
                  </div>
                </Row>
              </details>
              <div id="showFilterBox" className="col mb-2 p-0 ">
                <div className="togglebox">
                  <details open>
                    <summary className='hyperlink'>
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
                    </summary>
                    <div className="togglecontent ps-30" style={{ display: "block" }}>
                      <div className="smartSearch-Filter-Section">
                        <table width="100%" className="indicator_search">
                          <Loader loaded={this.state.loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color={portfolioColor ? portfolioColor : "#000066"}
                            speed={2} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="28%" left="50%" scale={1.0} loadedClassName="loadedContent" />
                          <tbody>
                            <tr>
                              <td valign="top">
                                <div>
                                  <label className='border-bottom full-width pb-1'>
                                    <input id='chkAllCategory' defaultChecked={this.state.checkedAll} onClick={(e) => this.SelectAllCategories(e)} type="checkbox" className="form-check-input me-1" />
                                    Client Category
                                  </label>
                                  <div className="custom-checkbox-tree">
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
                                </div>
                              </td>
                              <td valign="top">
                                <div>
                                  <label className='border-bottom full-width pb-1'>
                                    <input type="checkbox" id='chkAllSites' defaultChecked={this.state.checkedAllSites} onClick={(e) => this.SelectAllSits(e)} className="form-check-input me-1" />
                                    Sites
                                  </label>
                                  <div className="custom-checkbox-tree">
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
        {
          this.state.AllTimeEntry != undefined && this.state.AllTimeEntry.length > 0 &&
          <div className='col'>
            <div className="Alltable p-0">
              <div className="wrapper">
                <GlobalCommanTable showHeader={true} showDateTime={' | Time: ' + this.state.resultSummary.totalTime + ' | Days: (' + this.state.resultSummary.totalDays + ')'} columns={this.state.columns} data={this.state.AllTimeEntry} callBackData={this.callBackData} />
              </div>
            </div>
          </div>
        }
        {
          this.state.IsTask && (
            <EditTaskPopup
              Items={this.state.IsTask}
              Call={this.Call}
              AllListId={AllListId}
              context={this?.props?.Context}
            ></EditTaskPopup>
          )
        }
        {
          this.state?.IsMasterTask && (
            <EditInstituton
              item={this.state.IsMasterTask}
              Calls={this.Call}
              SelectD={this?.props}
            >
              {" "}
            </EditInstituton>
          )
        }
        {
          this.state.IsPresetPopup &&
          <Panel onRenderHeader={this.onRenderCustomHeaderMain} type={PanelType.medium} isOpen={this.state.IsPresetPopup} isBlocking={false} onDismiss={this.ClosePopup} >
            <div className=''>
              <div className=''>
                <div className='modal-body clearfix'>
                  <div className="row">
                    <div className="col-md-6">
                      <div>
                        <div>
                          <span className="href" id="selectedYear" onClick={() => this.InlineChangeDate('firstOfMonth')}>1st</span>
                          |<span className="href" id="selectedYear" onClick={() => this.InlineChangeDate('fifteenthOfMonth')}>15th</span>
                          | <span className="href" id="selectedYear" onClick={() => this.InlineChangeDate('year')}>1 Jan</span>
                          | <span className="href" id="selectedToday" onClick={() => this.InlineChangeDate('today')}>Today</span>
                        </div>
                        <div className="col-md-6">
                          <label>Start Date</label>
                          <input type="date" className="form-control" max="9999-12-31" min="1856-12-31"
                            value={this.state?.PresetStartDate ? Moment(this.state?.PresetStartDate).format("YYYY-MM-DD") : ''}
                            onChange={(date: any) => this.setPresetStartDate(date.target?.value)} />
                        </div>
                        <div className="col-md-6">
                          <label ng-required="true" className="full_width">End Date</label>
                          <input type="date" className="form-control" max="9999-12-31" min="1856-12-31"
                            value={this.state?.PresetEndDate ? Moment(this.state.PresetEndDate).format("YYYY-MM-DD") : ''}
                            onChange={(date: any) => this.setPresetEndDate(date.target?.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div>
                        <button type="button" id="DayPlus" className="top-container plus-button plus-minus" onClick={() => this.IncreaseDecreaseDate('Increase', 'Day')}>
                          <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                        <span className="min-input">Day</span>
                        <button type="button" id="DayMinus" className="top-container minus-button plus-minus" onClick={() => this.IncreaseDecreaseDate('Decrease', 'Day')}>
                          <i className="fa fa-minus" aria-hidden="true"></i>
                        </button>
                      </div>
                      <div>
                        <button type="button" id="MonthPlus" className="top-container plus-button plus-minus" onClick={() => this.IncreaseDecreaseDate('Increase', 'Month')}>
                          <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                        <span className="min-input">Month</span>
                        <button type="button" id="MonthMinus" className="top-container minus-button plus-minus" onClick={() => this.IncreaseDecreaseDate('Decrease', 'Month')}>
                          <i className="fa fa-minus" aria-hidden="true"></i>
                        </button>
                      </div>
                      <div>
                        <button type="button" id="YearPlus" className="top-container plus-button plus-minus" onClick={() => this.IncreaseDecreaseDate('Increase', 'Year')}>
                          <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                        <span className="min-input">Year</span>
                        <button type="button" id="YearMinus" className="top-container minus-button plus-minus" onClick={() => this.IncreaseDecreaseDate('Decrease', 'Year')}>
                          <i className="fa fa-minus" aria-hidden="true"></i>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
                <div className='modal-footer'>
                  <button type="button" className="btn btn-primary ms-1" title="Save changes & exit" onClick={this.SavePresetDate}>Save</button>
                </div>
              </div>
            </div>
          </Panel>
        }
      </div >
    );
  }
}
