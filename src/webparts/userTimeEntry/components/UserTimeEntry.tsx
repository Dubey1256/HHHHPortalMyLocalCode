import * as React from 'react';
import * as Moment from 'moment';
import { IUserTimeEntryProps } from './IUserTimeEntryProps';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { ColumnDef } from "@tanstack/react-table";
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import { Col, Row } from 'react-bootstrap';
import FileSaver from 'file-saver';
import * as XLSX from "xlsx";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import * as globalCommon from "../../../globalComponents/globalCommon";
import PreSetDatePikerPannel from "../../../globalComponents/SmartFilterGolobalBomponents/PreSetDatePiker"
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import PageLoader from "../../../globalComponents/pageLoader";
import CentralizedSiteComposition from "../../../globalComponents/SiteCompositionComponents/CentralizedSiteComposition";
import ShareTimeSheet from '../../../globalComponents/ShareTimeSheet';
var AllListId: any;
var siteConfig: any[] = []
var AllPortfolios: any[] = [];
var AllSitesAllTasks: any[] = [];
var AllTimeSheetResult: any[] = [];
var AllTaskUser: any[] = [];
let totalTimedata: any = []
let QueryStringId: any = '';
let DateType: any = 'This Week'
export interface IUserTimeEntryState {
  Result: any; taskUsers: any; checked: any; expanded: any; DateType: any, IsShareTimeEntry: boolean, checkedSites: any; expandedSites: any; filterItems: any; filterSites: any; ImageSelectedUsers: any; startdate: Date;
  enddate: Date; SitesConfig: any; AllTimeEntry: any; SelectGroupName: string; checkedAll: boolean; checkedAllSites: boolean; checkedParentNode: any; resultSummary: any;
  ShowingAllData: any; loaded: any; expandIcons: boolean; columns: ColumnDef<any, unknown>[]; IsMasterTask: any; IsTask: any; IsPresetPopup: any; PresetEndDate: any;
  PresetStartDate: any; PreSetItem: any; isStartDatePickerOne: boolean; isEndDatePickerOne: boolean; IsCheckedComponent: boolean; IsCheckedService: boolean; selectedRadio: any;
  IsTimeEntry: boolean; showShareTimesheet: boolean; SharewebTimeComponent: any; AllMetadata: any; isDirectPopup: boolean; TimeSheetLists: any
}
var user: any = ''
let portfolioColor: any = '#000066';
export default class UserTimeEntry extends React.Component<IUserTimeEntryProps, IUserTimeEntryState> {
  openPanel: any;
  closePanel: any;
  sheetsItems: any[];
  showShareTimesheet: any;
  public constructor(props: IUserTimeEntryProps, state: IUserTimeEntryState) {
    super(props);
    this.state = {
      Result: {}, taskUsers: [], DateType: '', IsShareTimeEntry: false, showShareTimesheet: true, checked: [], expanded: [], checkedSites: [], expandedSites: [], filterItems: [], filterSites: [], ImageSelectedUsers: [], startdate: new Date(),
      enddate: new Date(), SitesConfig: [], AllTimeEntry: [], SelectGroupName: '', checkedAll: false, expandIcons: false, checkedAllSites: false, checkedParentNode: [],
      resultSummary: { totalTime: 0, totalDays: 0 }, ShowingAllData: [], loaded: true, columns: [], IsTask: '', IsMasterTask: '', IsPresetPopup: false, PresetEndDate: new Date(),
      PresetStartDate: new Date(), PreSetItem: {}, isStartDatePickerOne: true, isEndDatePickerOne: false, IsCheckedComponent: true, IsCheckedService: true, selectedRadio: 'ThisWeek',
      IsTimeEntry: false, SharewebTimeComponent: {}, AllMetadata: [], isDirectPopup: false, TimeSheetLists: []
    }
    this.OpenPresetDatePopup = this.OpenPresetDatePopup.bind(this);
    this.SelectedPortfolioItem = this.SelectedPortfolioItem.bind(this);
    this.EditDataTimeEntryData = this.EditDataTimeEntryData.bind(this);
    this.TimeEntryCallBack = this.TimeEntryCallBack.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.GetResult();
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(event: any) {
    let selectedDate: any = undefined
    if (event.target.dataset.inputType == 'StartDate')
      selectedDate = this.state.startdate;
    else if (event.target.dataset.inputType == 'EndDate')
      selectedDate = this.state.enddate;
    let newDate = selectedDate;
    switch (event.key) {
      case 'ArrowLeft':
        newDate.setDate(selectedDate.getDate() - 1);
        break;
      case 'ArrowRight':
        newDate.setDate(selectedDate.getDate() + 1);
        break;
      case 'ArrowUp':
        newDate.setDate(selectedDate.getDate() - 7);
        break;
      case 'ArrowDown':
        newDate.setDate(selectedDate.getDate() + 7);
        break;
      case 'PageUp':
        newDate.setMonth(selectedDate.getMonth() + 1);
        break;
      case 'PageDown':
        newDate.setMonth(selectedDate.getMonth() - 1);
        break;
      case 'Home':
        let startdt = new Date();
        let diff: number;
        diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(startdt.setDate(diff));
        newDate = startdt;
        break;
      case 'End':
        let enddt = new Date();
        let lastday: number;
        lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
        enddt = new Date(enddt.setDate(lastday));
        newDate = enddt;
        break;
      case '/':
        const PickerPopup: any = document.getElementsByClassName('react-datepicker__tab-loop');
        for (let i = 0; i < PickerPopup.length; i++) {
          PickerPopup[i].style.display = 'block';
        }
        break;
      case 'Enter':
        const elements: any = document.getElementsByClassName('react-datepicker__tab-loop');
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none';
        }
        break;
      default:
        return;
    }
    if (event.target.dataset.inputType == 'StartDate') {
      this.setState({
        startdate: newDate
      });
    }
    else if (event.target.dataset.inputType == 'EndDate') {
      this.setState({
        enddate: newDate
      });
    }
  }
  private BackupAllTimeEntry: any = [];
  private AllTimeEntry: any = [];
  private TotalTimeEntry: any;
  private TotalDays: any;
  private StartWeekday: any;
  private endweekday: any;
  private async GetResult() {
    var params = new URLSearchParams(window.location.search);
    user = { "Id": params.get('userId') }
    QueryStringId = params.get('userId');
    if (user == undefined || user?.Id == undefined || user?.Id == '') {
      user = { "Id": params.get('UserId') }
      QueryStringId = params.get('UserId');
    }
    if (user == undefined || user?.Id == undefined || user?.Id == '') {
      let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
      user = await web.currentUser.get();
    }
    await this.LoadPortfolio()
    await this.GetTaskUsers();
    await this.LoadAllMetaDataFilter();
    AllListId = this.props;
    AllListId.isShowTimeEntry = this.props.TimeEntry;
    AllListId.isShowSiteCompostion = this.props.SiteCompostion
  }
  private LoadAllSiteAllTasks = async () => {
    let AllSiteTasks: any = [];
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let arraycount = 0;
    try {
      if (siteConfig?.length > 0) {
        siteConfig.map(async (config: any) => {
          if (config.Title != "SDC Sites") {
            let smartmeta = [];
            await web.lists.getById(config.listId).items.select("ID", "Title", "ClientCategory/Id", "ClientCategory/Title", "Project/Id", "Project/Title", "Project/PriorityRank", 'ClientCategory', "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "ParentTask/Id", "ParentTask/Title", "ParentTask/TaskID", "TaskID", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Body", "PriorityRank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Portfolio/Id", "Portfolio/Title", "Modified")
              .expand("TeamMembers", "ParentTask", "ClientCategory", "AssignedTo", "Project", "TaskCategories", "Author", "ResponsibleTeam", "TaskType", "Portfolio")
              .getAll().then((data: any) => {
                smartmeta = data;
                smartmeta.map((task: any) => {
                  task.AllTeamMember = [];
                  task.HierarchyData = [];
                  task.siteType = config.Title;
                  task.descriptionsSearch = '';
                  task.listId = config.listId;
                  task.siteUrl = config.siteUrl.Url;
                  task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
                  task.SmartPriority = globalCommon.calculateSmartPriority(task);
                  if (task?.ClientCategory?.length > 0) {
                    task.ClientCategorySearch = task?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                  } else {
                    task.ClientCategorySearch = ''
                  }
                  task.DisplayDueDate = task.DueDate != null ? Moment(task.DueDate).format("DD/MM/YYYY") : "";
                  task.portfolio = {};
                  if (task?.Portfolio?.Id != undefined) {
                    task.portfolio = task?.Portfolio;
                    task.Status = task?.Status;
                    task.PortfolioTitle = task?.Portfolio?.Title;
                  }
                  task["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  task.TeamMembersSearch = "";
                  task.TaskID = globalCommon.GetTaskId(task);
                  AllSiteTasks.push(task)
                });
                arraycount++;
              });
            let currentCount = siteConfig?.length;
            if (arraycount === currentCount) {
              AllSitesAllTasks = AllSiteTasks;
              totalTimedata?.map((data: any) => {
                data.taskDetails = this.checkTimeEntrySite(data);
              })
            
            }
          } else {
            arraycount++;
          }
        });
      }
    } catch (e) {
      console.log(e)
    }
  };
  private checkTimeEntrySite = (timeEntry: any) => {
    let result: any = ''
    result = AllSitesAllTasks?.filter((task: any) => {
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
  private checkBoxColor = (className: any) => {
    try {
      if (className != undefined) {
        setTimeout(() => {
          const inputElement = document.getElementsByClassName(className);
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
          const BtnElement = document.getElementsByClassName("rct-collapse rct-collapse-btn");
          if (BtnElement) {
            for (let j = 0; j < BtnElement.length; j++) {
              BtnElement[j].classList.add('mt--5');
            }
          }
        }, 1000);
      }
      else {
        setTimeout(() => {
          const inputElementSubchild = document.getElementsByClassName('rct-node rct-node-parent rct-node-collapsed');
          if (inputElementSubchild) {
            for (let j = 0; j < inputElementSubchild.length; j++) {
              const checkboxContainer = inputElementSubchild[j]
              const childElements = checkboxContainer.getElementsByTagName('input');
              const childElements2 = checkboxContainer.getElementsByClassName('rct-title');
              for (let i = 0; i < childElements.length; i++) {
                const checkbox = childElements[i];
                const lable: any = childElements2[i];
                if (lable?.style)
                  lable.style.color = portfolioColor;
                checkbox.classList.add('form-check-input', 'cursor-pointer');
              }
            }
          }

          const inputElementleaf = document.getElementsByClassName('rct-node rct-node-leaf');
          if (inputElementleaf) {
            for (let j = 0; j < inputElementleaf.length; j++) {
              const checkboxContainer = inputElementleaf[j]
              const childElements = checkboxContainer.getElementsByTagName('input');
              const childElements2 = checkboxContainer.getElementsByClassName('rct-title');
              for (let i = 0; i < childElements.length; i++) {
                const checkbox = childElements[i];
                const lable: any = childElements2[i];
                if (lable?.style) {
                  lable.style.color = portfolioColor;
                }
                checkbox.classList.add('form-check-input', 'cursor-pointer');
              }
            }
          }
          const AllCheckBox = document.querySelectorAll('[type="checkbox"]')
          if (AllCheckBox) {
            for (let j = 0; j < AllCheckBox.length; j++) {
              AllCheckBox[j].classList.add('form-check-input', 'cursor-pointer');
            }
          }
          const BtnElement = document.getElementsByClassName("rct-collapse rct-collapse-btn");
          if (BtnElement) {
            for (let j = 0; j < BtnElement.length; j++) {
              BtnElement[j].classList.add('mt--5');
            }
          }

        }, 30);
      }
    } catch (e: any) {
      console.log(e)
    }
  }
  private async DefaultValues() {
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
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
  }
  private async LoadPortfolio() {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    AllPortfolios = await web.lists.getById(this.props?.MasterTaskListID).items.select("ID", "Title", "DueDate", "Status", "Sitestagging", "ItemRank", "Item_x0020_Type", 'PortfolioStructureID', 'ClientTime', 'SiteCompositionSettings', "PortfolioType/Title", "PortfolioType/Id", "PortfolioType/Color", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "TaskCategories/Id", "TaskCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title")
      .expand("TeamMembers", "Author", "ClientCategory", "Parent", "TaskCategories", "AssignedTo", "ClientCategory", "PortfolioType").top(4999).filter("(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')").get();
    if (AllPortfolios != undefined && AllPortfolios?.length > 0) {
      AllPortfolios?.map((item: any) => {
        item.listId = this.props?.MasterTaskListID
      })
    }
  }
  private async GetTaskUsers() {
    this.setState({
      loaded: true,
    })
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let taskUsers = [];
    let results = [];
    results = await web.lists.getById(this.props.TaskUsertListID).items.select('Id', 'IsShowReportPage', 'UserGroupId', "UserGroup/Id", "UserGroup/Title", 'Suffix', 'SmartTime', 'Title', 'Email', 'SortOrder', 'Role', 'Company', 'ParentID1', 'TaskStatusNotification', 'Status', 'Item_x0020_Cover', 'AssingedToUserId', 'isDeleted','TimeCategory', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'ItemType', 'Approver/Id', 'Approver/Title', 'Approver/Name')
      .expand('AssingedToUser,UserGroup,Approver').orderBy('SortOrder', true).orderBy("Title", true).get();
    AllTaskUser = results;
    for (let index = 0; index < results.length; index++) {
      let element = results[index];
      if (element.UserGroupId == undefined) {
        this.getChilds(element, results);
        taskUsers.push(element);
      }
    }
    this.GetTimeEntry();
    this.setState({
      taskUsers: taskUsers
    })
    if (user != undefined && user?.Id != undefined && user?.Id != '') {
      await this.DefaultValues();
    }
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
        item.childs.push(childItem);
        this.getChilds(childItem, items);
      }
    }
  }
  private async LoadAllMetaDataFilter() {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let ccResults: any = [];
    let sitesResult: any = [];
    let TimeSheetResult: any[] = []
    let results = [];
    let className: any = "custom-checkbox-tree"
    results = await web.lists.getById(this.props.SmartMetadataListID).items.select("Id", "Title", "IsVisible", "ParentID", "Color_x0020_Tag", "Configurations", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
      .expand('Parent').orderBy('SortOrder', true).orderBy("Title", true).top(4999).get();
    this.checkBoxColor(className)
    results.forEach(function (obj: any, index: any) {
      if (obj.TaxType == 'Client Category') {
        ccResults.push(obj);
      } else if (obj.TaxType == 'Sites') {
        sitesResult.push(obj)
      } else if (obj.TaxType == 'timesheetListConfigrations' && obj.Configurations != undefined && obj.Configurations != '') {
        TimeSheetResult = globalCommon.parseJSON(obj.Configurations)
      }
    });
    if (sitesResult.length > 0) {
      sitesResult?.map((site: any) => {
        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.IsVisible == true) {
          siteConfig.push(site)
        }
      })
    }
    let startdt = new Date(), enddt = new Date();
    let diff: number, lastday: number;
    diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
    startdt = new Date(startdt.setDate(diff));
    lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
    enddt = new Date(enddt.setDate(lastday));
    startdt.setHours(0, 0, 0, 0);
    enddt.setHours(0, 0, 0, 0);
    this.setState({
      startdate: startdt, enddate: enddt, SitesConfig: sitesResult, AllMetadata: results, TimeSheetLists: TimeSheetResult, loaded: false,
    }, () => this.loadSmartFilters(ccResults, sitesResult))
    if (QueryStringId != undefined && QueryStringId != '') {
      await this.LoadAllTimeSheetaData();
    }
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
              if (obj.Title == 'Blank')
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
              if (obj.Title == 'Blank')
                obj.ParentTitle = item.Title;
            }
          }

        }
      }
    }
    filterItems = filterItems.filter((type: any) => type.Title != 'Other');
    filterItems.forEach((filterItem: any) => {
      filterItem.ParentTitle = filterItem.Title;
      if (filterItem.ParentTitle == 'DA E+E')
        filterItem.ParentTitle = 'ALAKDigital';
      if (filterItem.children != undefined && filterItem.children.length > 0) {
        filterItem.children.forEach((child: any) => {
          child.ParentTitle = filterItem.Title;
          if (child.ParentTitle == 'DA E+E')
            child.ParentTitle = 'ALAKDigital';
          if (child.children != undefined && child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              subchild.ParentTitle = filterItem.Title;
              if (subchild.ParentTitle == 'DA E+E')
                subchild.ParentTitle = 'ALAKDigital';
            });
          }
        });
      }
    });
    this.setState({ filterItems, filterSites })
  }
  private SelectAllCategories(ev: any) {
    let filterItem = this.state.filterItems;
    let checked: any = [];
    let select = ev.currentTarget.checked;
    if (select) {
      if (filterItem != undefined && filterItem.length > 0) {
        filterItem.forEach((child: any) => {
          child.isExpand = false;
          checked.push(child.ID);
          if (child.children != undefined && child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              checked.push(subchild.Id);
              if (subchild.children != undefined && subchild.children.length > 0) {
                subchild.children.forEach((subchild2: any) => {
                  checked.push(subchild2.Id);
                  if (subchild2.children != undefined && subchild2.children.length > 0) {
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
    this.setState({ checked, checkedAll: select });
  }
  private SelectAllSits(ev: any) {
    let filterItem = this.state.filterSites;
    let checked: any = [];
    let select = ev.currentTarget.checked;
    if (select) {
      if (filterItem != undefined && filterItem.length > 0) {
        filterItem.forEach((child: any) => {
          checked.push(child.ID);
          if (child.children != undefined && child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              checked.push(subchild.Id);
              if (subchild.children != undefined && subchild.children.length > 0) {
                subchild.children.forEach((subchild2: any) => {
                  checked.push(subchild2.Id);
                  if (subchild2.children != undefined && subchild2.children.length > 0) {
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
    this.setState({ checkedSites: checked, checkedAllSites: select });
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
    this.setState({ ImageSelectedUsers, SelectGroupName });
  }
  private SelectUserImage(ev: any, item: any) {
    let SelectGroupName = '';
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
      ImageSelectedUsers, SelectGroupName
    });
  }
  private SelectedGroup(ev: any, user: any) {
    let SelectGroupName = '';
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
    this.setState({ ImageSelectedUsers, SelectGroupName })
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
  private isTaskItemExists(array: any, items: any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.TaskItemID == items.TaskItemID && item?.siteType.toLowerCase() == items?.siteType.toLowerCase()) {
        isExists = true;
        break;
      }
    }
    return isExists;
  }
  private ChangeRadiobtn() {
    let RadioType = ''
    let startdt = new Date(), enddt = new Date(), tempdt = new Date();
    let diff: number, lastday: number;
    startdt.setHours(0, 0, 0, 0);
    enddt.setHours(0, 0, 0, 0);
    this.state.startdate.setHours(0, 0, 0, 0);
    this.state.enddate.setHours(0, 0, 0, 0);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'today';
    }
    startdt.setDate(startdt.getDate() - 1);
    enddt.setDate(enddt.getDate() - 1);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'yesterday';
    }
    diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
    startdt = new Date(startdt.setDate(diff));
    lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
    enddt = new Date(enddt.setDate(lastday));;
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'ThisWeek';
    }
    tempdt = new Date();
    tempdt = new Date(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate() - 7);
    diff = tempdt.getDate() - tempdt.getDay() + (tempdt.getDay() === 0 ? -6 : 1);
    startdt = new Date(tempdt.setDate(diff));
    lastday = tempdt.getDate() - (tempdt.getDay() - 1) + 6;
    enddt = new Date(tempdt.setDate(lastday));
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'LastWeek';
    }
    startdt = new Date(startdt.getFullYear(), startdt.getMonth(), 1);
    enddt = new Date(enddt.getFullYear(), enddt.getMonth() + 1, 0);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'EntrieMonth';
    }
    startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 1);
    enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'LastMonth';
    }
    startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 3);
    enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'Last3Month';
    }
    startdt = new Date(new Date().getFullYear(), 0, 1);
    enddt = new Date(new Date().getFullYear(), 11, 31);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'EntrieYear';
    }
    startdt = new Date(new Date().getFullYear() - 1, 0, 1);
    enddt = new Date(new Date().getFullYear() - 1, 11, 31);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'LastYear';
    }
    startdt = new Date('2017/01/01');
    enddt = new Date();
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'AllTime';
    }
    startdt = new Date(this.state?.PresetStartDate);
    enddt = new Date(this.state?.PresetEndDate);
    if (this.state.startdate.getTime() == startdt.getTime() && this.state.enddate.getTime() == enddt.getTime()) {
      RadioType = 'Presettime';
    }
    this.setState({
      selectedRadio: RadioType,
    })
  }
  private setStartDate(dt: any) {
    this.setState({
      startdate: dt
    });
    setTimeout(() => {
      this.ChangeRadiobtn()
    }, 700);
    this.ChangeRadiobtn()
  }
  private setEndDate(dt: any) {
    this.setState({
      enddate: dt
    });
    setTimeout(() => {
      this.ChangeRadiobtn()
    }, 700);
  }
  private async OpenPresetDatePopup() {
    this.setState({
      IsPresetPopup: true,
    })
  }
  private selectDate(type: string) {
    let startdt = new Date(), enddt = new Date(), tempdt = new Date();
    let diff: number, lastday: number;
    switch (type) {
      case 'Custom':
        DateType = 'Custom';
        this.setState({ showShareTimesheet: true })
        this.setState({ showShareTimesheet: false })
        break;

      case 'today':
        DateType = 'Today';
        this.setState({ showShareTimesheet: true })
        break;

      case 'yesterday':
        DateType = 'Yesterday';
        this.setState({ showShareTimesheet: true })
        startdt.setDate(startdt.getDate() - 1);
        enddt.setDate(enddt.getDate() - 1);
        break;

      case 'ThisWeek':
        DateType = 'This Week';
        this.setState({ showShareTimesheet: true })
        diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(startdt.setDate(diff));
        lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
        enddt = new Date(enddt.setDate(lastday));;
        break;

      case 'LastWeek':
        DateType = 'Last Week';
        this.setState({ showShareTimesheet: true })
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
        DateType = 'LastMonth';
        this.setState({ showShareTimesheet: true })
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
    //let StartDate: any
    //StartDate = Moment(startdt).format("YYYY/MM/DD");
    //let EndDate: any
    // EndDate = Moment(enddt).format("YYYY/MM/DD");
    this.setState({
      selectedRadio: type,
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
          loaded: true,
        })
      }
      this.generateTimeEntry();
    }
  }
  private getStartingDate(startDateOf: any) {
    const startingDate = new Date();
    let formattedDate = startingDate;
    if (startDateOf == 'This Week') {
        startingDate.setDate(startingDate.getDate() - startingDate.getDay());
        formattedDate = startingDate;
    } else if (startDateOf == 'Today') {
        formattedDate = startingDate;
    } else if (startDateOf == 'Yesterday') {
        startingDate.setDate(startingDate.getDate() - 1);
        formattedDate = startingDate;
    } else if (startDateOf == 'This Month') {
        startingDate.setDate(1);
        formattedDate = startingDate;
    } else if (startDateOf == 'Last Month') {
        const lastMonth = new Date(startingDate.getFullYear(), startingDate.getMonth() - 1);
        const startingDateOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        var change = (Moment(startingDateOfLastMonth).add(27, 'days').format())
        var b = new Date(change)
        formattedDate = b;
    } else if (startDateOf == 'Last Week') {
        const lastWeek = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
        const startingDateOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 1);
        formattedDate = startingDateOfLastWeek;
    }

    return formattedDate;
}
  private async LoadAllTimeSheetaData() {
    let AllTimeEntry: any = [];
    let arraycount = 0;
    this.setState({
      loaded: true,
    })
    if (AllTimeSheetResult == undefined || AllTimeSheetResult?.length == 0) {
      let startDate = this.getStartingDate('Last Month').toISOString();
      
      try {
        if(DateType == 'Today' || DateType == 'Yesterday' || DateType == 'This Week' || DateType == 'Last Week' || DateType == 'This Month'){
          if (this?.state?.TimeSheetLists != undefined && this?.state?.TimeSheetLists.length > 0) {
            this?.state?.TimeSheetLists.map(async (site: any) => {
              let web = new Web(site?.siteUrl);
              let TimeEntry = []
              await web.lists.getById(site?.listId).items.select(site?.query).filter(`(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`).getAll()
              .then((data: any) => {
                TimeEntry = data
                console.log(data);
                TimeEntry.map((entry: any) => {
                  AllTimeEntry.push(entry)
                });
                arraycount++;
              })
              let currentCount = this?.state?.TimeSheetLists?.length;
              if (arraycount === currentCount) {
                AllTimeSheetResult = AllTimeEntry;
                this.LoadAllSiteAllTasks()
                this.updatefilter(true);
  
              }
            })
          }
        }
        else{
          if (this?.state?.TimeSheetLists != undefined && this?.state?.TimeSheetLists.length > 0) {
            this?.state?.TimeSheetLists.map(async (site: any) => {
              let web = new Web(site?.siteUrl);
              let TimeEntry = []
              await web.lists.getById(site?.listId).items.select(site?.query).getAll()
              .then((data: any) => {
                TimeEntry = data
                console.log(data);
                TimeEntry.map((entry: any) => {
                  AllTimeEntry.push(entry)
                });
                arraycount++;
              })
              let currentCount = this?.state?.TimeSheetLists?.length;
              if (arraycount === currentCount) {
                AllTimeSheetResult = AllTimeEntry;
                this.LoadAllSiteAllTasks()
                this.updatefilter(true);
  
              }
            })
          }
        }
       
      } catch (e) {
        console.log(e)
      }
    }
    else {
      this.updatefilter(true);
    }
  }
  private async generateTimeEntry() {
    let FilterTimeEntry: any[] = []
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (AllTimeSheetResult != undefined && AllTimeSheetResult?.length > 0)
      FilterTimeEntry = AllTimeSheetResult.filter((item) => ImageSelectedUsers.find((items: any) => item.AuthorId == items.AssingedToUserId))
    totalTimedata = FilterTimeEntry;
    this.LoadTimeSheetData(FilterTimeEntry);
  }
  private findUserByName = (name: any) => {
    const user = AllTaskUser.filter((user: any) => user?.AssingedToUser?.Id === name);
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else { Image = "/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"; }
    return user ? Image : null;
  };
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
          timeTab.newSiteUrl = config?.siteUrl?.Url;
          timeTab.SiteUrl = timeTab.newSiteUrl;
          timeTab.SiteIcon = config?.Item_x005F_x0020_Cover?.Url;
          timeTab.listId = config?.listId;
          timeTab.Site = config.Title;
          timeTab.ImageUrl = config.ImageUrl;
          timeTab.TaskItemID = timeTab[ColumnName].Id;
          timeTab.DisplayTaskId = timeTab[ColumnName].DisplayTaskId;
          timeTab.TaskType = timeTab[ColumnName]?.TaskType;
          timeTab.ParentTask = timeTab[ColumnName]?.ParentTask
          timeTab.TaskTitle = timeTab[ColumnName].Title;
          timeTab.TaskCreated = timeTab[ColumnName].Created;
          timeTab.NewTimeEntryDate = timeTab[ColumnName].TaskDate;
          timeTab.uniqueTimeEntryID = countered;
          AllTimeSpentDetails.push(timeTab);
        }
      }
      countered++;
    })
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
            Additionaltimeentry.forEach(function (second: { ID: number; TimeEntryId: number; }, TimeEntryIndex: any) {
              if (second.ID != 0 && second.ID == undefined) {
                second.TimeEntryId = TimeTaskId + i + TimeEntryIndex;
                TimeTaskId = TimeTaskId + 1;
              }
              else if (second.ID != undefined && first.ID == second.ID) {
                if (count != 0) {
                  second.TimeEntryId = TimeTaskId + i + TimeEntryIndex;
                  TimeTaskId = TimeTaskId + 1;
                }
                second.TimeEntryId = second.ID + i + TimeEntryIndex;
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
            if (this.state?.ImageSelectedUsers != undefined && this.state?.ImageSelectedUsers?.length > 0) {
              for (let userIndex = 0; userIndex < this.state.ImageSelectedUsers?.length; userIndex++) {
                if (this.state?.ImageSelectedUsers[userIndex].AssingedToUserId != undefined && Additionaltimeentry[index]?.AuthorId != undefined && TaskDate >= this.state.startdate && TaskDate <= this.state.enddate && Additionaltimeentry[index]?.AuthorId == this.state?.ImageSelectedUsers[userIndex].AssingedToUserId) {
                  let hours = addtime.TaskTime;
                  let minutes = hours * 60;
                  addtime.TaskItemID = time.TaskItemID;
                  addtime.DisplayTaskId = time.DisplayTaskId;
                  addtime.TaskType = time?.TaskType;
                  addtime.ParentTask = time?.ParentTask
                  addtime.SiteUrl = time.SiteUrl;
                  totletimeparent = minutes;
                  addtime.MileageJson = totletimeparent;
                  addtime.getUserName = '';
                  addtime.Effort = parseInt(addtime.MileageJson) / 60;
                  addtime.Effort = addtime.Effort.toFixed(2);
                  addtime.DispEffort = addtime.Effort;
                  addtime.Effort = parseFloat(addtime.Effort);
                  addtime.TimeEntryDate = addtime.TaskDate;
                  addtime.NewTimeEntryDate = TaskDate;
                  let datesplite = addtime.TaskDate.split("/");
                  addtime.TimeEntrykDateNew = new Date(parseInt(datesplite[2], 10), parseInt(datesplite[1], 10) - 1, parseInt(datesplite[0], 10));
                  const maxTitleLength: number = 70;
                  if (addtime["Description"] != undefined && addtime["Description"].length > maxTitleLength)
                    addtime.truncatedTitle = addtime["Description"].substring(0, maxTitleLength - 3) + "...";
                  addtime.TaskTitle = time.TaskTitle;
                  addtime.ID = time.ID;
                  addtime.Title = time.Title;
                  addtime.Status = time.Status;
                  addtime.selectedSiteType = time.selectedSiteType;
                  addtime.siteType = time.siteType;
                  addtime.Site = time?.siteType;
                  addtime.SiteIcon = time?.SiteIcon;
                  addtime.ImageUrl = time.ImageUrl;
                  if (time.TaskCreated != undefined)
                    addtime.TaskCreatednew = this.ConvertLocalTOServerDate(time.TaskCreated, 'DD/MM/YYYY');
                  if (addtime.AuthorId)
                    addtime.autherImage = this.findUserByName(addtime.AuthorId)
                  addtime.Author = {}
                  addtime.Author.Id = addtime.AuthorId
                  addtime.Author.autherImage = addtime.autherImage
                  addtime.Author.Title = addtime.AuthorName
                  getAllTimeEntry.push(addtime);
                }
              }
            }
          }
        }
      }
    }
    getAllTimeEntry?.forEach(function (item: any, index: any) {
      item.TimeEntryId = index;
    })
    this.getJSONTimeEntry(getAllTimeEntry);
    if (getAllTimeEntry == undefined || getAllTimeEntry?.length == 0) {
      this.setState({
        AllTimeEntry: getAllTimeEntry,
      })
    }
  }
  private getJSONTimeEntry(getAllTimeEntry: any) {
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
        }
        filterItemTimeTab.push(objgre);
      }
    }
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
  private Call = (Type: any) => {
    this.updatefilter(false);
    this.setState({
      IsTask: '', IsMasterTask: '', isDirectPopup: false
    })
    if (Type == 'Master Task')
      this.LoadPortfolio()
  }
  private async GetAllSiteTaskData(filterItemTimeTab: any, getAllTimeEntry: any) {
    let callcount = 0;
    let AllSharewebSiteTasks: any = [];
    let AllTimeEntryItem: any = [];
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    if (filterItemTimeTab.length > 0) {
      for (let index = 0; index < filterItemTimeTab.length; index++) {
        let itemtype = filterItemTimeTab[index];
        if (itemtype.ListName == 'OffshoreTasks') {
          itemtype.ListName = 'Offshore Tasks'
        }
        // if (this.state.ImageSelectedUsers.length > 2) {
        //   let self = this;
        //   AllSitesAllTasks?.forEach(function (Item) {
        //     Item.siteName = itemtype.ListName;
        //     Item.DisplayTaskId = globalCommon.GetTaskId(Item)
        //     Item.listId = itemtype.ListId;
        //     //Item.ClientTime = JSON.parse(Item?.ClientTime);
        //     // Item.PercentComplete = Item.PercentComplete <= 1 ? Item.PercentComplete * 100 : Item.PercentComplete;
        //     // if (Item.PercentComplete != undefined) {
        //     //   Item.PercentComplete = parseInt((Item.PercentComplete).toFixed(0));
        //     // }
        //     Item.NewCompletedDate = Item?.CompletedDate;
        //     Item.NewCreated = Item?.Created;
        //     if (Item.Created != undefined)
        //       Item.FiltercreatedDate = self.ConvertLocalTOServerDate(Item.Created, "DD/MM/YYYY");
        //     if (Item.CompletedDate != undefined)
        //       Item.FilterCompletedDate = self.ConvertLocalTOServerDate(Item.CompletedDate, "DD/MM/YYYY");
        //     Item.descriptionsSearch = '';
        //     if (Item?.FeedBack != undefined) {
        //       let DiscriptionSearchData: any = '';
        //       let feedbackdata: any = JSON.parse(Item?.FeedBack)
        //       DiscriptionSearchData = feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
        //         const childText = child?.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '');
        //         const subtextText = (child?.Subtext || [])?.map((elem: any) => elem.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '')).join('');
        //         return childText + subtextText;
        //       }).join('');
        //       Item.descriptionsSearch = DiscriptionSearchData
        //     }
        //     AllSharewebSiteTasks.push(Item);
        //   })
        // }
        
          for (let j = 0; j < itemtype.Query.length; j++) {
            let queryType = itemtype.Query[j];
            let results = await web.lists.getByTitle(itemtype.ListName).items.select('ParentTask/Title', 'ParentTask/Id', 'ClientTime', 'ItemRank', 'Portfolio/Id', 'Portfolio/Title', 'SiteCompositionSettings', 'TaskLevel', 'TaskLevel', 'TimeSpent', 'BasicImageInfo', 'OffshoreComments', 'OffshoreImageUrl', 'CompletedDate', 'TaskID', 'ResponsibleTeam/Id', 'ResponsibleTeam/Title', 'ClientCategory/Id', 'ClientCategory/Title', 'ClientCategory/ParentID', 'TaskCategories/Id', 'TaskCategories/Title', 'ParentTask/TaskID', 'TaskType/Id', 'TaskType/Title', 'TaskType/Level', 'TaskType/Prefix', 'PriorityRank', 'Reference_x0020_Item_x0020_Json', 'TeamMembers/Title', 'TeamMembers/Name', 'Component/Id', 'Component/Title', 'Component/ItemType', 'TeamMembers/Id', 'Item_x002d_Image', 'ComponentLink', 'IsTodaysTask', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id', 'AttachmentFiles/FileName', 'FileLeafRef', 'FeedBack', 'Title', 'Id', 'PercentComplete', 'Company', 'StartDate', 'DueDate', 'Comments', 'Categories', 'Status', 'WebpartId', 'Body', 'Mileage', 'PercentComplete', 'Attachments', 'Priority', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
              .filter(queryType.replace('filter=', '').trim()).expand('ParentTask', 'TaskType', 'AssignedTo', 'Component', 'AttachmentFiles', 'Author', 'Editor', 'TeamMembers', 'ResponsibleTeam', 'ClientCategory', 'TaskCategories', 'Portfolio')
              .orderBy('Id', false).getAll(4999);
            callcount++;
            let self = this;
            results.forEach(function (Item) {
              Item.siteName = itemtype.ListName;
              Item.DisplayTaskId = globalCommon.GetTaskId(Item)
              Item.listId = itemtype.ListId;
              // Item.ClientTime = JSON.parse(Item.ClientTime);
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
              Item.descriptionsSearch = '';
              if (Item?.FeedBack != undefined) {
                let DiscriptionSearchData: any = '';
                let feedbackdata: any = JSON.parse(Item?.FeedBack)
                DiscriptionSearchData = feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
                  const childText = child?.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '');
                  const subtextText = (child?.Subtext || [])?.map((elem: any) => elem.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '')).join('');
                  return childText + subtextText;
                }).join('');
                Item.descriptionsSearch = DiscriptionSearchData
              }
              AllSharewebSiteTasks.push(Item);
            })

          }
        


      }
      let filterItems = this.state.filterItems;
      getAllTimeEntry.forEach(function (filterItem: any) {
        filterItem.ClientCategorySearch = ''
        filterItem.clientCategory = '';
        filterItem.clientCategoryIds = '';
        AllSharewebSiteTasks.forEach(function (copygetval: any) {
          var getItem: any = JSON.stringify(copygetval)
          getItem = globalCommon.parseJSON(getItem);
          if (filterItem.TaskItemID == getItem.Id && filterItem.selectedSiteType == getItem.siteName) {
            if (filterItem.siteType != undefined && filterItem.siteType == 'ALAK_Digital') {
              filterItem.siteType = 'ALAKDigital'
            }
            getItem['siteType'] = filterItem.siteType;
            filterItem.CategoryParentId = 0;
            let cate = '';
            let cateId = ''
            filterItem.ClientCategory = getItem?.ClientCategory;
            if (getItem?.ClientCategory != undefined && getItem?.ClientCategory?.length > 0) {
              getItem?.ClientCategory.forEach(function (category: any) {
                if (category != undefined && category?.Title != undefined)
                  cate += category?.Title + '; ';
                if (category != undefined && category?.Id != undefined)
                  cateId += category?.Id + '; ';
              })
            }
            if (getItem?.ClientCategory?.length > 0) {
              filterItem.ClientCategorySearch = getItem?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
            } else {
              filterItem.ClientCategorySearch = ''
            }
            filterItem.clientCategory = cate;
            filterItem.clientCategoryIds = cateId;
            let clientTimeArr: any = [];
            // if (getItem.ClientTime != undefined && getItem.ClientTime != '' && getItem.ClientTime?.length > 0) {
            //   getItem.ClientTime.forEach(function (val: { [x: string]: number; ClienTimeDescription: number; }) {
            //     val['releventTime'] = (filterItem.Effort / 100) * val.ClienTimeDescription;;
            //     if (val.ClienTimeDescription != undefined && val.ClienTimeDescription != 100) {
            //       clientTimeArr.push(val);
            //     }
            //   })
            // }
            //filterItem.clientTimeInfo = clientTimeArr;
            filterItem.flag = true;
            filterItem.DisplayTaskId = getItem?.DisplayTaskId;
            filterItem.Body = getItem?.Body;
            filterItem.descriptionsSearch = getItem?.descriptionsSearch
            filterItem.FeedBack = getItem?.FeedBack;
            filterItem.TaskType = getItem?.TaskType;
            filterItem.ParentTask = getItem?.ParentTask;
            filterItem.PercentComplete = getItem.PercentComplete;
            filterItem.ItemRank = getItem.ItemRank;
            filterItem.PriorityRank = getItem?.PriorityRank;
            filterItem.TaskID = filterItem.DisplayTaskId
            filterItem.Portfolio = getItem?.Portfolio;
            filterItem.Title = getItem?.Title;
            filterItem.Status = getItem?.Status;

            filterItem.ID = getItem?.Id;
            filterItem.Id = getItem?.Id;
            filterItem.Created = getItem.Created;
            filterItem.listId = getItem.listId
            filterItem.PortfolioTypeTitle = "Component";
            filterItem.fontColorTask = '#0000BC'
            if (getItem.Portfolio != undefined) {
              if (AllPortfolios != undefined && AllPortfolios?.length > 0) {
                let result = AllPortfolios.filter((type: any) => type.Id != undefined && getItem.Portfolio != undefined && getItem.Portfolio?.Id != undefined && getItem.Portfolio?.Id == type.Id)[0];
                if (result != undefined && result != '') {
                  filterItem.PortfolioTypeTitle = result?.PortfolioType?.Title;
                  filterItem.fontColorTask = result?.PortfolioType?.Color;
                }
              }
              filterItem.ComponentName = getItem.Portfolio?.Title;
              filterItem.ComponentIDs = getItem.Portfolio?.Id;
              filterItem.PortfolioItem = getItem?.Portfolio
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
      this.TotalTimeEntry = 0;
      for (let index = 0; index < AllTimeEntryItem.length; index++) {
        this.TotalTimeEntry += AllTimeEntryItem[index].Effort;
      }
      this.TotalTimeEntry = (this.TotalTimeEntry).toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = (this.TotalDays).toFixed(2);
      this.setState({
        filterItems: filterItems
      }, () => {
        this.getFilterTask(AllTimeEntryItem);
      })
    }
    else {
      this.TotalTimeEntry = 0;
      for (let index = 0; index < AllTimeEntryItem.length; index++) {
        let timeitem = AllTimeEntryItem[index];
        this.TotalTimeEntry += timeitem.Effort;
      }
      this.TotalTimeEntry = (this.TotalTimeEntry).toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = (this.TotalDays).toFixed(2);
      let resultSummary = {}
      resultSummary = {
        totalTime: this.TotalTimeEntry, totalDays: this.TotalDays, totalEntries: AllTimeEntryItem.length
      }
      this.setState({
        loaded: false, resultSummary
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
    let SitesItems = [];
    let isSitesSelected = false;
    let CategoryItems = [];
    let isCategorySelected = false;
    let count = 1
    if (selectedFilters.length > 0) {
      let isSitesSelected = false;
      for (let index = 0; index < filterTask.length; index++) {
        let item = filterTask[index];
        for (let i = 0; i < selectedFilters.length; i++) {
          switch (selectedFilters[i].TaxType) {
            case 'Client Category':
              if (item.clientCategoryIds != undefined && item.clientCategoryIds != '') {
                let Category = item.clientCategoryIds.split(';');
                let title = selectedFilters[i].ParentTitle == 'PSE' ? 'EPS' : (selectedFilters[i].ParentTitle == 'e+i' ? 'EI' : selectedFilters[i].ParentTitle);
                for (let j = 0; j < Category.length; j++) {
                  let type = Category[j]
                  if ((type == selectedFilters[i].Id) && !this.issmartExistsIds(CategoryItems, item)) {
                    if (item.clientTimeInfo != undefined && item.clientTimeInfo.length > 0) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (obj.SiteName == title && obj.releventTime != undefined) {
                          item.Effort = obj.releventTime;
                          item.DispEffort = obj.releventTime.toFixed(2);
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
                          item.DispEffort = obj.releventTime.toFixed(2);
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
                let title = selectedFilters[i].ParentTitle == 'PSE' ? 'EPS' : (selectedFilters[i].ParentTitle == 'e+i' ? 'EI' : selectedFilters[i].ParentTitle);
                if (selectedFilters[i].Title == 'Other') {
                  if (selectedFilters[i]?.ParentTitle == 'Other' && (item.ClientCategory == undefined || item.ClientCategory.length == 0) && !this.issmartExistsIds(CategoryItems, item)) {
                    if (item.clientTimeInfo != undefined && item.clientTimeInfo.length > 0) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (obj.SiteName == title && obj.releventTime != undefined) {
                          item.Effort = obj.releventTime;
                          item.DispEffort = obj.releventTime.toFixed(2);
                        }
                      }
                    }
                    item['uniqueTimeId'] = count
                    CategoryItems.push(item);
                    count++;
                  }
                }
                if (selectedFilters[i].Title != 'Other') {
                  if ((item.siteType != undefined && item.siteType == title && (item.ClientCategory == undefined || item.ClientCategory.length == 0) && !this.issmartExistsIds(CategoryItems, item))) {
                    if (item.clientTimeInfo != undefined && item.clientTimeInfo.length > 0) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (obj.SiteName == title && obj.releventTime != undefined) {
                          item.Effort = obj.releventTime;
                          item.DispEffort = obj.releventTime.toFixed(2);
                        }
                      }
                    }
                    item['uniqueTimeId'] = count
                    CategoryItems.push(item);
                    count++;
                  }
                }
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
      let commonItemsbackup = commonItems;
      this.DynamicSortitems(commonItemsbackup, 'TimeEntrykDateNew', 'DateTime', 'Descending');
      this.AllTimeEntry = commonItemsbackup;
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
      }
      resultSummary = {
        totalTime: this.TotalTimeEntry, totalDays: this.TotalDays, totalEntries: this.AllTimeEntry.length
      }
      this.setState({
        AllTimeEntry: this.AllTimeEntry, resultSummary,
      }, () => this.createTableColumns());
    }
    else {
      this.AllTimeEntry = filterTask;
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
      }
      resultSummary = {
        totalTime: this.TotalTimeEntry, totalDays: this.TotalDays, totalEntries: this.AllTimeEntry.length
      }
      this.setState({
        AllTimeEntry: this.AllTimeEntry, resultSummary,
      }, () => this.createTableColumns())
    }
    this.setState({
      loaded: false,
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
  private ClearFilters() {
    this.AllTimeEntry = this.BackupAllTimeEntry;
    this.TotalTimeEntry = 0;
    for (let index = 0; index < this.AllTimeEntry.length; index++) {
      let timeitem = this.AllTimeEntry[index];
      timeitem.Effort = parseFloat(timeitem.TaskTime)
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
    }
    resultSummary = {
      totalTime: this.TotalTimeEntry, totalDays: this.TotalDays, totalEntries: this.AllTimeEntry.length
    }
    this.setState({
      AllTimeEntry: this.AllTimeEntry, resultSummary,
    }, () => this.createTableColumns())
    this.setState({
      AllTimeEntry: this.BackupAllTimeEntry, checked: [], checkedSites: []
    }, () => this.createTableColumns())
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
        checkedParentNode, checkedAll: (filterItems.length == checkedParentNode.length) ? true : false
      })
    });
  }
  private EditDataTimeEntryData = (e: any, item: any) => {
    item.Id = item?.TaskItemID;
    item.ID = item?.TaskItemID
    item.Title = item?.TaskTitle
    this.setState({
      IsTimeEntry: true
    })
    this.setState({
      SharewebTimeComponent: item
    })
  };
  private TimeEntryCallBack() {
    this.setState({
      IsTimeEntry: false
    })
  }
  private EditComponentPopup = (item: any) => {
    let PortfolioItem = AllPortfolios.filter(type => type?.Id == item?.Id)[0]
    PortfolioItem["siteUrl"] = this.props?.Context?.pageContext?.web?.absoluteUrl;
    PortfolioItem["listName"] = "Master Tasks";
    this.setState({
      IsMasterTask: PortfolioItem, isDirectPopup: true
    });
  };
  private EditPopup = (item: any) => {
    item.Id = item?.TaskItemID;
    item.ID = item?.TaskItemID
    this.setState({
      IsTask: item
    });
  };
  private createTableColumns() {
    let dt = [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: false,
        hasExpanded: false,
        isHeaderNotAvlable: true,
        size: 25,
        id: 'Id',
      }, {
        accessorFn: (info: any) => info?.Site,
        cell: (info: any) => <span>
          <img className='circularImage rounded-circle' src={info?.row?.original?.SiteIcon} />
        </span>,
        id: "Site",
        placeholder: "Site",
        header: "",
        resetSorting: false,
        resetColumnFilters: false,
        size: 30
      }, {
        accessorKey: "DisplayTaskId",
        placeholder: "Task",
        id: "DisplayTaskId",
        header: "",
        size: 90,
        cell: (info: any) => <>
          <span className="d-flex">
            <ReactPopperTooltipSingleLevel AllListId={AllListId} ShareWebId={info?.row?.original?.DisplayTaskId} row={info?.row?.original} singleLevel={true} masterTaskData={AllPortfolios} AllSitesTaskData={AllSitesAllTasks} />
          </span>
        </>
      }, {
        accessorKey: 'TaskTitle',
        id: "TaskTitle",
        header: "",
        placeholder: "Task Title",
        cell: (info: any) =>
          <span>
            <a data-interception="off" className="hreflink serviceColor_Active" target="_blank" style={info?.row?.original?.fontColorTask != undefined ? { color: `${info?.row?.original?.fontColorTask}` } : { color: `${info?.row?.original?.PortfolioType?.Color}` }}
              href={this.props.Context.pageContext.web.absoluteUrl + "/SitePages/Task-Profile.aspx?taskId=" + info.row.original.TaskItemID + "&Site=" + info.row.original.siteType}>
              {info.row.original.TaskTitle}
            </a>
            {info?.row?.original?.descriptionsSearch !== null && info?.row?.original?.descriptionsSearch != undefined ? (
              <span className="alignIcon">{" "}<InfoIconsToolTip Discription={info?.row?.original?.descriptionsSearch} row={info?.row?.original} />{" "}
              </span>) : ("")}
          </span>,
        size: 275,
      }, {
        accessorFn: (info: any) => info?.ClientCategorySearch,
        cell: (info: any) => (
          <>
            <ShowClintCatogory clintData={info?.row?.original} AllMetadata={this.state?.AllMetadata} />
          </>
        ),
        id: "ClientCategorySearch",
        placeholder: "Client Category",
        header: "",
        resetColumnFilters: false,
        size: 90,
      }, {
        accessorKey: "PercentComplete",
        id: "PercentComplete",
        placeholder: "%",
        header: "",
        size: 35,
      }, {
        accessorKey: 'ComponentName',
        id: "ComponentName",
        header: "",
        placeholder: "Component",
        cell: (info: any) => <><a data-interception="off" className="hreflink serviceColor_Active" target="_blank" style={info?.row?.original?.fontColorTask != undefined ? { color: `${info?.row?.original?.fontColorTask}` } : { color: `${info?.row?.original?.PortfolioType?.Color}` }}
          href={this.props.Context.pageContext.web.absoluteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + info.row?.original?.ComponentIDs}>
          {info.row?.original?.ComponentName}
        </a><span
          className="svg__iconbox svg__icon--edit alignIcon hreflink"
          onClick={(e) => this.EditComponentPopup(info.row?.original?.PortfolioItem)}>
          </span></>,
        size: 275,
      }, {
        accessorKey: "Description",
        cell: (info: any) => <><span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
          <span>{info?.row?.original.truncatedTitle?.length > 0 ? info?.row?.original?.truncatedTitle : info?.row?.original?.Description}</span>
          {info?.row?.original.truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
            {info?.row?.original?.Description}
          </span>}
        </span></>,
        id: "Description",
        placeholder: "Time Description",
        header: "",
      },
      {
        accessorFn: (info: any) => info?.NewTimeEntryDate,
        cell: (info: any) => (
          <div className="alignCenter">
            {info?.row?.original?.NewTimeEntryDate == null ? ("") : (
              <>
                <span>{info?.row?.original?.TimeEntryDate}</span>
                {info?.row?.original?.Author != undefined &&
                  <>
                    <a href={`${this.props.Context.pageContext.web.absoluteUrl}/SitePages/TaskDashboard.aspx?UserId=${info?.row?.original?.Author?.Id}&Name=${info?.row?.original?.Author?.Title}`}
                      target="_blank" data-interception="off">
                      <img title={info?.row?.original?.Author?.Title} className="workmember ms-1" src={info?.row?.original?.Author?.autherImage} />
                    </a>
                  </>
                }
              </>
            )}
          </div>
        ),
        filterFn: (info: any, columnName: any, filterValue: any) => {
          if (info?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || info?.original?.TimeEntryDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        id: 'NewTimeEntryDate',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Time Entry",
        isColumnDefultSortingDesc: true,
        header: "",
        size: 91
      }, {
        accessorKey: "DispEffort",
        id: "DispEffort",
        placeholder: "Time",
        header: "",
        size: 45,
      }, {
        cell: (info: any) => (
          <>
            <a className="alignCenter" onClick={(e) => this.EditDataTimeEntryData(e, info?.row?.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
              <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
            </a></>
        ),
        id: 'AllEntry',
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 25
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
        size: 25
      }
    ]
    this.setState({
      columns: dt
    })
  }
  private ExampleCustomInputStrat = React.forwardRef(({ value, onClick }: any, ref: any) => (
    <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
      <input type="text" id="datepicker" data-input-type="StartDate" className="form-control date-picker ps-2" placeholder="DD/MM/YYYY" value={value} />
      <span style={{ position: "absolute", top: "50%", right: "7px", transform: "translateY(-50%)", cursor: "pointer" }}>
        <span className="svg__iconbox svg__icon--calendar"></span>
      </span>
    </div>
  ));
  private ExampleCustomInputEnd = React.forwardRef(({ value, onClick }: any, ref: any) => (
    <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
      <input type="text" id="datepicker" data-input-type="EndDate" className="form-control date-picker ps-2" placeholder="DD/MM/YYYY" value={value} />
      <span style={{ position: "absolute", top: "50%", right: "7px", transform: "translateY(-50%)", cursor: "pointer" }}>
        <span className="svg__iconbox svg__icon--calendar"></span>
      </span>
    </div>
  ));
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
    setTimeout(() => {
      if (this.state?.IsCheckedComponent == true) {
        if (this.BackupAllTimeEntry != undefined && this.BackupAllTimeEntry?.length > 0) {
          let result = this.BackupAllTimeEntry.filter((type: any) => type.PortfolioTypeTitle != undefined && Type != undefined && type.PortfolioTypeTitle.toLowerCase() == 'component');
          this.setState({
            AllTimeEntry: result,
          })
        }
      }
      if (this.state?.IsCheckedService == true) {
        if (this.BackupAllTimeEntry != undefined && this.BackupAllTimeEntry?.length > 0) {
          let result = this.BackupAllTimeEntry.filter((type: any) => type.PortfolioTypeTitle != undefined && Type != undefined && type.PortfolioTypeTitle.toLowerCase() == 'service');
          this.setState({
            AllTimeEntry: result,
          })
        }
      }
      if (this.state?.IsCheckedComponent == true && this.state?.IsCheckedService == true) {
        this.setState({
          AllTimeEntry: this.BackupAllTimeEntry,
        })
      }
      this.AllTimeEntry = this.state?.AllTimeEntry;
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
      }
      resultSummary = {
        totalTime: this.TotalTimeEntry, totalDays: this.TotalDays, totalEntries: this.AllTimeEntry.length
      }
      this.setState({
        AllTimeEntry: this.AllTimeEntry, resultSummary,
      }, () => this.createTableColumns())
    }, 700);
  }
  private PreSetPikerCallBack = (preSetStartDate: any, preSetEndDate: any) => {
    if (preSetStartDate != undefined) {
      this.setState({
        PresetStartDate: preSetStartDate, selectedRadio: 'Presettime', startdate: preSetStartDate,
      })
    }
    if (preSetEndDate != undefined) {
      this.setState({
        PresetEndDate: preSetEndDate, selectedRadio: 'Presettime', enddate: preSetEndDate,
      })
    }
    this.setState({
      IsPresetPopup: false,
    })
  };
  private ExpandClientCategory = (expanded: any) => {
    this.checkBoxColor(undefined)
    this.setState({ expanded })
  }
  private ExpandSite = (expandedSites: any) => {
    this.checkBoxColor(undefined)
    this.setState({ expandedSites })
  }
  private getclientitemValue = function (client: any, item: any) {
    this.state?.AllMetadata?.forEach((smart: any) => {
      if (smart.Id == client.ParentID) {
        if (smart.ParentID != undefined && smart.ParentID != 0) {
          this.state?.AllMetadata?.forEach((child: any) => {
            if (child.Id == smart.ParentID) {
              if (!this.isExistsclient(item.Client, child.Title))
                item.Client += child.Title + '; ';
              item.CategoryLevel2 += smart.Title + '; ';
              item.CategoryLevel3 += client.Title + '; ';
            }
          })
        }
        else {
          if (!this.isExistsclient(item.Client, smart.Title))
            item.Client += smart.Title + '; ';
          if (!this.isExistsclient(item.CategoryLevel2, client.Title))
            item.CategoryLevel2 += client.Title + '; ';
        }
      }
    })
  }
  private exportToExcel = () => {
    this.sheetsItems = [];
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var AllItems = this.state.AllTimeEntry
    AllItems.forEach((item: any) => {
      var contentItemNew: any = {};
      contentItemNew['TaskTitle'] = item.TaskTitle;
      contentItemNew['TimeEntryDate'] = item.TimeEntryDate;
      contentItemNew['DispEffort'] = item.DispEffort;
      contentItemNew['Client'] = '';
      contentItemNew['CategoryLevel2'] = '';
      contentItemNew['CategoryLevel3'] = '';
      item['Client'] = '';
      item['CategoryLevel2'] = '';
      item['CategoryLevel3'] = '';
      if (item.ClientCategory != undefined && item.ClientCategory.length > 0) {
        item?.ClientCategory.forEach((client: any, index: any) => {
          if (client.ParentID != undefined && client.ParentID != 0) {
            this.getclientitemValue(client, item);
            contentItemNew.CategoryLevel2 = item.CategoryLevel2;
            contentItemNew.CategoryLevel3 = item.CategoryLevel3;
          }
          else {
            if (client.ParentID != undefined && client.ParentID == 0)
              item.Client += client.Title + '; ';
            contentItemNew.Client += client.Title + '; ';
          }
        })
      }
      contentItemNew['Client'] = item.Client;
      contentItemNew['CategoryLevel2'] = item.CategoryLevel2;
      contentItemNew['CategoryLevel3'] = item.CategoryLevel3;
      contentItemNew['Component Name'] = item.ComponentName;
      this?.sheetsItems.push(contentItemNew)
    })
    if (this?.sheetsItems?.length > 0) {
      var fileName = 'Time Entry';
      const ws = XLSX.utils.json_to_sheet(this.sheetsItems);
      const fileExtension = ".xlsx";
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      XLSX.utils.sheet_add_aoa(ws, [["TaskTitle", "TimeEntryDate", "Effort", "Client", "CategoryLevel2", "CategoryLevel3", "Component Name"]], { origin: "A1" });
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    }
  };
  callBackData = (elem: any, ShowingData: any) => {
    this.setState({
      ShowingAllData: ShowingData
    })
  }
  private SelectedAllTeam = (e: any) => {
    let currentuserId = this.props.Context.pageContext?._legacyPageContext.userId
    if (e.target.checked == true) {
      AllTaskUser?.forEach((val: any) => {
        let user: any = []
        if ((val?.UserGroup?.Title == 'Senior Developer Team' || val?.UserGroup?.Title == 'Smalsus Lead Team' || val?.UserGroup?.Title == 'Junior Developer Team' || val?.UserGroup?.Title == 'Design Team' || val?.UserGroup?.Title == 'QA Team' || val?.UserGroup?.Title == 'Trainees') && (val?.AssingedToUserId != currentuserId)) {
          this.state.ImageSelectedUsers.push(val)
        }
      })
    }
    else {
      
      
      const filteredArray:any = []
      this.state.ImageSelectedUsers.forEach((user:any) => {
        if(user?.AssingedToUserId == currentuserId){
          filteredArray.push(user)
        }
      });
      // Update state with the filtered array
      this.setState({ ImageSelectedUsers: filteredArray });
      
    }
   

    this.setState({ showShareTimesheet: true })
  }
  private shareTaskInEmail = () => {

    if (totalTimedata.length == 0) {
      alert('Data is not available in table')
    }
    else {
      this.setState({ IsShareTimeEntry: true })
      if (this.state.ImageSelectedUsers.length == 1) {
        globalCommon.ShareTimeSheet(totalTimedata, AllTaskUser, this?.props?.Context, DateType)
      }
      else {
        globalCommon.ShareTimeSheetMultiUser(this.state.AllTimeEntry, AllTaskUser, this?.props?.Context, DateType, this.state.ImageSelectedUsers)
      }

    }

  }
  public render(): React.ReactElement<IUserTimeEntryProps> {
    const {
      description, isDarkTheme, environmentMessage, hasTeamsContext, userDisplayName, } = this.props;
    return (
      <div id="TimeSheet-Section" >
        {this.state.loaded && <PageLoader />}
        <div>
          <div className="p-0" style={{ verticalAlign: "top" }}><h2 className="heading d-flex justify-content-between align-items-center"><span> <a>All Timesheets</a> </span><span className="text-end fs-6"><a target="_blank" data-interception="off" href={`${this.props.Context.pageContext.web.absoluteUrl}/SitePages/UserTimeEntry-Old.aspx`}>Old UserTimeEntry</a></span></h2></div>
          <Col className='smartFilter bg-light border mb-3 '>
            <details className='p-0 m-0 allfilter' open>
              <summary className='hyperlink'><a className="fw-semibold hreflink mr-5 pe-2 pull-left ">All Filters - <span className='me-1 fw-normal'>Task User :</span> </a>
                {this.state.ImageSelectedUsers != null && this.state.ImageSelectedUsers.length > 0 && this.state.ImageSelectedUsers.map((user: any, i: number) => {
                  return user?.Item_x0020_Cover != undefined && user.Item_x0020_Cover?.Url != undefined ?
                    <span>  <img className="AssignUserPhoto mr-5" title={user?.AssingedToUser?.Title} src={user?.Item_x0020_Cover?.Url} /> </span>
                    : <span className="suffix_Usericon showSuffixIcon m-1" title={user?.Title} >{user?.Suffix}</span>
                })
                }
                <label> <input type="checkbox" className="form-check-input" onClick={(e) => this.SelectedAllTeam(e)} /> Select All</label>
              </summary>
              <Col className='allfilter'>
                <Col className='subfilters'>
                  <details open className='p-0 m-0'>
                    <span className="pull-right" style={{ display: 'none' }}>
                      <input type="checkbox" className="" onClick={(e) => this.SelectAllGroupMember(e)} />
                      <label>Select All </label>
                    </span>
                    <summary><span className='fw-semibold f-15 fw-semibold'>Team members</span></summary>
                    <hr style={{ width: "98%", marginLeft: "30px" }}></hr>
                    <div style={{ display: "block" }}>
                      <div className="taskTeamBox ps-30 my-2">
                        {this.state.taskUsers != null && this.state.taskUsers.length > 0 && this.state.taskUsers.map((users: any, i: number) => {
                          return users?.childs?.length > 0 && <div className="top-assign">
                            <div className="team ">
                              <label className="BdrBtm">
                                <input style={{ display: 'none' }} className="" type="checkbox" onClick={(e) => this.SelectedGroup(e, users)} />
                                {users.childs.length > 0 &&
                                  <> {users.Title}  </>
                                }
                              </label>
                              <div className='d-flex'>
                                {users.childs.length > 0 && users.childs.map((item: any, i: number) => {
                                  return item.AssingedToUser != undefined && <div className="alignCenter">
                                    {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined ?
                                      <span>
                                        <img id={"UserImg" + item.Id} className={item?.AssingedToUserId == user?.Id ? 'activeimg seclected-Image ProirityAssignedUserPhoto' : 'ProirityAssignedUserPhoto'} onClick={(e) => this.SelectUserImage(e, item)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                          title={item.AssingedToUser.Title}
                                          src={item.Item_x0020_Cover.Url} />
                                      </span> :
                                      <span id={"UserImg" + item.Id} className={item?.AssingedToUserId == user?.Id ? 'activeimg newDynamicUserIcon' : 'newDynamicUserIcon'} title={item.Title} onClick={(e) => this.SelectUserImage(e, item)} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)"
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
                  <details className='m-0' open>
                    <summary><span className='fw-semibold f-15 fw-semibold'> Date</span> </summary>
                    <hr style={{ width: "98%", marginLeft: "30px" }}></hr>
                    <Row className="ps-30 my-2">
                      <div>
                        <div className="col TimeReportDays">
                          <span className='SpfxCheckRadio'>
                            <input type="radio" className="radio" name="dateSelection" id="rdCustom" value="Custom" checked={this.state.selectedRadio === "Custom" || (this.state.startdate !== null && this.state.enddate !== null && !this.state.selectedRadio)} onClick={() => this.selectDate('Custom')} />
                            <label>Custom</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="today" id="rdToday" checked={this.state.selectedRadio === "today"} onClick={() => this.selectDate('today')} className="radio" />
                            <label>Today</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="yesterday" id="rdYesterday" checked={this.state.selectedRadio === "yesterday"} onClick={() => this.selectDate('yesterday')} className="radio" />
                            <label> Yesterday </label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" defaultChecked={true} id="rdThisWeek" value="ThisWeek" checked={this.state.selectedRadio === "ThisWeek"} onClick={() => this.selectDate('ThisWeek')} className="radio" />
                            <label> This Week</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="LastWeek" id="rdLastWeek" checked={this.state.selectedRadio === "LastWeek"} onClick={() => this.selectDate('LastWeek')} className="radio" />
                            <label> Last Week</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" id="rdThisMonth" value="EntrieMonth" checked={this.state.selectedRadio === "EntrieMonth"} onClick={() => this.selectDate('EntrieMonth')} className="radio" />
                            <label>This Month</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" id="rdLastMonth" value="LastMonth" checked={this.state.selectedRadio === "LastMonth"} onClick={() => this.selectDate('LastMonth')} className="radio" />
                            <label>Last Month</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="Last3Month" checked={this.state.selectedRadio === "Last3Month"} onClick={() => this.selectDate('Last3Month')} className="radio" />
                            <label>Last 3 Months</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="EntrieYear" checked={this.state.selectedRadio === "EntrieYear"} onClick={() => this.selectDate('EntrieYear')} className="radio" />
                            <label>This Year</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="LastYear" checked={this.state.selectedRadio === "LastYear"} onClick={() => this.selectDate('LastYear')} className="radio" />
                            <label>Last Year</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="AllTime" checked={this.state.selectedRadio === "AllTime"} onClick={() => this.selectDate('AllTime')} className="radio" />
                            <label>All Time</label>
                          </span>
                          <span className='SpfxCheckRadio'>
                            <input type="radio" name="dateSelection" value="Presettime" checked={this.state.selectedRadio === "Presettime"} onClick={() => this.selectDate('Presettime')} className="radio" />
                            <label>Pre-set</label>
                            <span className="svg__iconbox svg__icon--editBox alignIcon hreflink" onClick={() => this.OpenPresetDatePopup()}></span>
                          </span>
                        </div>
                      </div>
                    </Row>
                    <Row className='ps-30 mb-2'>
                      <div className="col-2">
                        <div className='input-group'>
                          <label className='full-width'>Start Date</label>
                          <span>
                            <DatePicker selected={this.state.startdate} data-input-type="First" onChange={(date: any) => this.setStartDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                              className="form-control date-picker p-1" popperPlacement="bottom-start" customInput={<this.ExampleCustomInputStrat />}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="col-2">
                        <div className='input-group'>
                          <label className='full-width'>End Date</label>
                          <span>
                            <DatePicker selected={this.state.enddate} onChange={(date: any) => this.setEndDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                              className="form-control date-picker p-1" popperPlacement="bottom-start" customInput={<this.ExampleCustomInputEnd />}
                            />
                          </span>
                        </div>
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
                  <div id="showFilterBox" className="col m-0 p-0 ">
                    <div className="togglebox">
                      <details open>
                        <summary>
                          <span className='fw-semibold f-15 fw-semibold'> SmartSearch – Filters</span>
                          <span className='f-14 ps-2'>
                            {this.state.checkedAll && this.state.filterItems != null && this.state.filterItems.length > 0 &&
                              this.state.filterItems.map((obj: any) => {
                                return <span> {obj.Title}
                                  <span>  : ({this.getAllSubChildenCount(obj)})  </span>
                                </span>
                              })
                            }
                            {this.state.checkedAllSites && this.state.filterSites != null && this.state.filterSites.length > 0 &&
                              this.state.filterSites.map((obj: any) => {
                                return <span> {obj.Title}
                                  <span>  : ({this.getAllSubChildenCount(obj)}) </span>
                                </span>
                              })
                            }
                            {this.state.checkedParentNode != null && !this.state.checkedAll && this.state.checkedParentNode.length > 0 &&
                              this.state.checkedParentNode.map((obj: any) => {
                                return <span> {obj.Title}
                                  <span>  : ({this.getAllSubChildenCount(obj)})  </span>
                                </span>
                              })
                            }
                          </span>
                        </summary>
                        <hr style={{ width: "98%", marginLeft: "30px" }}></hr>
                        <div className="togglecontent my-2" style={{ display: "block", paddingLeft: "24px" }}>
                          <div className="smartSearch-Filter-Section">
                            <table width="100%" className="indicator_search">
                              <tbody>
                                <tr>
                                  <td valign="top">
                                    <div className='row'>
                                      <div className='col-md-4'>
                                        <div className='col-md-10'>
                                          <label className='border-bottom full-width pb-1'>
                                            <input id='chkAllCategory' defaultChecked={this.state.checkedAll} onClick={(e) => this.SelectAllCategories(e)} type="checkbox" className="form-check-input me-1" />
                                            Client Category
                                          </label>
                                          <div className="custom-checkbox-tree">
                                            <CheckboxTree nodes={this.state.filterItems} checked={this.state.checked} expanded={this.state.expanded} onCheck={checked => this.setState({ checked })}
                                              onExpand={expanded => this.ExpandClientCategory(expanded)} nativeCheckboxes={true} showNodeIcon={false} checkModel={'all'}
                                              icons={{ expandOpen: <SlArrowDown />, expandClose: <SlArrowRight />, parentClose: null, parentOpen: null, leaf: null, }}
                                            />
                                          </div></div>
                                      </div>
                                      <div className='col-md-4'>
                                        <div className='col-md-10'>
                                          <label className='border-bottom full-width pb-1'>
                                            <input type="checkbox" id='chkAllSites' defaultChecked={this.state.checkedAllSites} onClick={(e) => this.SelectAllSits(e)} className="form-check-input me-1" />
                                            Sites
                                          </label>
                                          <div className="custom-checkbox-tree">
                                            <CheckboxTree nodes={this.state.filterSites} checked={this.state.checkedSites} expanded={this.state.expandedSites}
                                              onCheck={checkedSites => this.setState({ checkedSites })} onExpand={expandedSites => this.ExpandSite(expandedSites)} nativeCheckboxes={true} showNodeIcon={false}
                                              checkModel={'all'} icons={{ expandOpen: <SlArrowDown />, expandClose: <SlArrowRight />, parentClose: null, parentOpen: null, leaf: null, }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                  {/* {this.state.IsShareTimeEntry && <ShareTimeSheet  close={this.closeTimesheetCom} AllTaskTimeEntries={totalTimedata} taskUser={AllTaskUser} Context={this?.props?.Context} props={this?.props} type={DateType}/>} */}
                  <div className="col text-end mb-2">
                    <button type="button" className="btnCol btn btn-primary me-1" onClick={(e) => this.LoadAllTimeSheetaData()}>
                      Update Filters
                    </button>
                    <button type="button" className="btn btn-default me-1" onClick={() => this.ClearFilters()}>
                      Clear Filters
                    </button>
                  </div>
                </Col>
              </Col>
            </details>
            {this.state.showShareTimesheet && <span className="align-autoplay d-flex float-end my-1" onClick={() => this.shareTaskInEmail()}><span className="svg__iconbox svg__icon--mail ms-1" ></span>Share {DateType}'s Time Entry</span>}
          </Col>
          <div className='col'>
            <section className='TableContentSection'>
              <div className="Alltable p-0">
                <div className="wrapper">
                  <GlobalCommanTable expandIcon={true} showCatIcon={true} exportToExcelCategoryReport={this.exportToExcel} showHeader={true} showDateTime={' | Time: ' + this.state.resultSummary.totalTime + ' | Days: (' + this.state.resultSummary.totalDays + ')'} columns={this.state.columns} data={this.state.AllTimeEntry} callBackData={this.callBackData} TaskUsers={AllTaskUser} AllListId={this?.props} portfolioColor={portfolioColor} />
                </div>
              </div>
            </section>
          </div>
        </div>
        {
          this.state.IsTask &&
          (<EditTaskPopup Items={this.state.IsTask} Call={() => { this.Call(undefined) }} AllListId={AllListId} context={this?.props?.Context} ></EditTaskPopup>)
        }
        {this.state?.IsMasterTask &&
          (<CentralizedSiteComposition ItemDetails={this.state?.IsMasterTask} RequiredListIds={AllListId} closePopupCallBack={() => { this.Call('Master Task') }} usedFor={"CSF"} />)
        }
        {this.state.IsPresetPopup &&
          (<PreSetDatePikerPannel isOpen={this.state.IsPresetPopup} PreSetPikerCallBack={this.PreSetPikerCallBack} portfolioColor={portfolioColor}></PreSetDatePikerPannel>)
        }
        {this.state.IsTimeEntry &&
          (<TimeEntryPopup props={this.state.SharewebTimeComponent} CallBackTimeEntry={this.TimeEntryCallBack} Context={this?.props?.Context}></TimeEntryPopup>)
        }
        <div className='clearfix'></div>
      </div >
    );
  }
}