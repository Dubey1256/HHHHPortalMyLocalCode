import React, { useEffect, useContext, useState } from 'react'; Moment
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { myContextValue } from '../../../globalComponents/globalCommon'
import Header from './HeaderSection';
import TaskStatusTbl from './TaskStausTable';
import * as Moment from "moment";
import PageLoader from '../../../globalComponents/pageLoader';
import { map } from "jquery";
var taskUsers: any;
let GroupByUsers: any = [];
let AllUsers: any = [];
let AllMasterTasks: any = [];
let AllProjectData: any = [];
let CurrentUserProjectData: any = [];
let CurrentUserWorkingToday: any = [];
let CurrentUserInfo: any = {};
var currentUserData: any = {};
let DashboardConfig: any = [];
let DashboardConfigBackUp: any = [];
let allData: any = [];
let LoginUserTeamMembers: any = [];
let ActiveTile = ''
let DashboardTitle: any = '';
let DashboardValue: any = '';
let timeSheetConfig: any = {};
let TimeSheetLists: any = [];
let dates: any = [];
let AllTimeEntry: any = [];
let CurrentMatchableDate = new Date();
let todaysDrafTimeEntry: any = [];
var AllTaskTimeEntries: any = [];
let currentUserId: any
let CurrentConfigItem: any = [];
CurrentMatchableDate.setHours(0, 0, 0, 0)
const EmployeProfile = (props: any) => {
  const params = new URLSearchParams(window.location.search);
  let DashboardId: any = params.get('DashBoardId');
  if (DashboardId == undefined || DashboardId == '')
    DashboardId = params.get('dashBoardId');
  const [progressBar, setprogressBar] = useState(true)
  const [AllSite, setAllSite] = useState([]);
  const [data, setData]: any = React.useState({ AllTaskUser: [] });
  const [currentTime, setCurrentTime]: any = useState([]);
  const [approverEmail, setApproverEmail]: any = useState([]);
  const [timesheetListConfig, setTimesheetListConfig] = React.useState<any>()
  const [smartmetaDataDetails, setSmartmetaDataDetails] = React.useState([])
  const [IsCallContext, setIsCallContext] = React.useState(false)
  const [LoadHeaderSection, setLoadHeaderSection] = React.useState<any>('')
  try {
    $("#spPageCanvasContent").removeClass();
    $("#spPageCanvasContent").addClass("hundred");
    $("#workbenchPageContent").removeClass();
    $("#workbenchPageContent").addClass("hundred");
  } catch (e) {
    console.log(e);
  }
  useEffect(() => {
    GetSmartmetadata();
    LoadAdminConfiguration(false, undefined)
    loadMasterTask();
    loadTaskUsers(undefined);
    getAllData(true);
    generateDateRange()
  }, []);
  const generateDateRange = () => {
    let Count = 0;
    // You can adjust the number of days displayed in the carousel
    const daysToDisplay = 60;
    while (Count < daysToDisplay) {
      let today: any = new Date();
      const currentDate = today;
      currentDate.setDate(today.getDate() + Count);
      currentDate.setHours(0, 0, 0, 0);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        let DateObject = { "DisplayDate": '', "ServerDate": '', IsShowTask: false }
        DateObject.DisplayDate = Moment(currentDate).format("DD/MM/YYYY");
        DateObject.ServerDate = currentDate
        if (Count == 0) {
          DateObject.DisplayDate = 'Today';
          dates.push(DateObject);
        }
        else if (Count == 1) {
          DateObject.DisplayDate = 'Tomorrow';
          dates.push(DateObject);
        }
        else {
          dates.push(DateObject);
        }
      }
      Count++;
    }
    dates.unshift({ "DisplayDate": 'Un-Assigned', "ServerDate": undefined, IsShowTask: false });
  };
  const timeEntryIndex: any = {};
  const smartTimeTotal = async () => {
    let AllTimeEntries = [];
    if (timeSheetConfig?.Id !== undefined) {
      AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfig);
    }
    let allSites = smartmetaDataDetails.filter((e) => e.TaxType == "Sites")
    AllTimeEntries?.forEach((entry: any) => {
      allSites.forEach((site) => {
        const taskTitle = `Task${site.Title}`;
        const key = taskTitle + entry[taskTitle]?.Id
        if (entry.hasOwnProperty(taskTitle) && entry.AdditionalTimeEntry !== null && entry.AdditionalTimeEntry !== undefined) {
          if (entry[taskTitle].Id == 168) {
            console.log(entry[taskTitle].Id);
          }
          const additionalTimeEntry = JSON.parse(entry.AdditionalTimeEntry);
          let totalTaskTime = additionalTimeEntry?.reduce((total: any, time: any) => total + parseFloat(time.TaskTime), 0);
          let timeSheetsDescriptionSearch = additionalTimeEntry?.reduce((accumulator: any, entry: any) => `${accumulator} ${entry?.Description?.replace(/(<([^>]+)>|\n)/gi, "").trim()}`, "").trim();
          if (timeEntryIndex.hasOwnProperty(key)) {
            timeEntryIndex[key].TotalTaskTime += totalTaskTime;
            timeEntryIndex[key].timeSheetsDescriptionSearch = (timeEntryIndex[key]?.timeSheetsDescriptionSearch || '') + ' ' + timeSheetsDescriptionSearch;
          } else {
            timeEntryIndex[`${taskTitle}${entry[taskTitle]?.Id}`] = {
              ...entry[taskTitle],
              TotalTaskTime: totalTaskTime,
              siteType: site.Title,
              timeSheetsDescriptionSearch: timeSheetsDescriptionSearch
            };
          }
        }
      });
    });
    if (timeEntryIndex) {
      const dataString = JSON.stringify(timeEntryIndex);
      localStorage.setItem('timeEntryIndex', dataString);
    }
    console.log("timeEntryIndex", timeEntryIndex)
    getAllData(true);
  };
  const GetSmartmetadata = async () => {
    const web = new Web(props.props?.siteUrl);
    let smartmetaDetails: any = [];
    var AllsiteData: any = []
    smartmetaDetails = await web.lists.getById(props.props?.SmartMetadataListID).items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
      .top(4999).expand("Parent").get();
    smartmetaDetails?.map((newtest: any) => {
      if (newtest?.TaxType == "Sites" && newtest?.Title != "" && newtest?.Title != "Master Tasks" && newtest?.Title != "SDC Sites" && newtest?.Title != "Offshore Tasks" && newtest?.Configurations != null) {
        AllsiteData.push(newtest)
      }
      if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
        newtest.DataLoadNew = false;
      if (newtest?.TaxType == 'timesheetListConfigrations') {
        timeSheetConfig = newtest;
        TimeSheetLists = JSON.parse(timeSheetConfig?.Configurations)
      }
    })
    setAllSite(AllsiteData)
    setTimesheetListConfig(timeSheetConfig)
    setSmartmetaDataDetails(smartmetaDetails);
  };
  const addHighestColumnToObject = (obj: any, array: any) => {
    const { Row } = obj.WebpartPosition;
    let highestColumn = -1;
    array.forEach((item: any) => {
      const { WebpartPosition } = item;
      if (WebpartPosition.Row == Row && WebpartPosition.Column > highestColumn)
        highestColumn = WebpartPosition.Column;
    });
    return highestColumn;
  }
  const LoadAdminConfiguration = async (IsLoadTask: any, Type: any) => {
    if (DashboardId == undefined || DashboardId == '')
      DashboardId = 1;
    const web = new Web(props.props?.siteUrl);
    await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").getAll().then(async (data: any) => {
      data = data?.filter((config: any) => config?.Value == DashboardId)[0];
      CurrentConfigItem = JSON.parse(JSON.stringify(data))
      CurrentConfigItem.Configurations = globalCommon.parseJSON(CurrentConfigItem?.Configurations)
      DashboardTitle = data?.Title
      DashboardValue = data?.Value;
      DashboardConfig = globalCommon.parseJSON(data?.Configurations)
      DashboardConfig = DashboardConfig.sort((a: any, b: any) => {
        if (a.WebpartPosition.Row == b.WebpartPosition.Row)
          return a.WebpartPosition.Column - b.WebpartPosition.Column;
        return a.WebpartPosition.Row - b.WebpartPosition.Row;
      });
      DashboardConfigBackUp = JSON.parse(JSON.stringify(DashboardConfig));
      DashboardConfigBackUp.map((config: any) => {
        config.UpdatedId = data?.Id
      })
      DashboardConfig.forEach((config: any) => {
        if (config?.onDropAction != undefined && config?.onDropAction?.length > 0) {
          config?.onDropAction?.map((filterColumn: any) => {
            filterColumn.SelectedEmail = [];
            if (filterColumn?.SelectedField == 'TeamLeader' || filterColumn?.SelectedField == 'TeamMember' || filterColumn?.SelectedField == 'WorkingMember') {
              if (filterColumn?.SelectedValue != undefined && filterColumn?.SelectedValue?.length) {
                filterColumn?.SelectedValue?.map((User: any) => {
                  filterColumn?.SelectedEmail?.push(User?.email)
                })
              }
            }
          });
        }
        if (config?.AdditonalHeader != undefined && config?.AdditonalHeader == true)
          ActiveTile = config?.TileName
        config.highestColumn = addHighestColumnToObject(config, DashboardConfig)
      })
      if (DashboardConfig != undefined && DashboardConfig?.length > 0) {
        let TotalCSmartFav = DashboardConfig?.filter((x: any) => x.smartFevId != undefined && x.smartFevId != '')
        let countCall = 0;
        DashboardConfig.map(async (item: any, index: any) => {
          item.configurationData = []
          if (item?.smartFevId != undefined && item?.smartFevId != '') {
            try {
              const results = await web.lists.getById(props?.props?.AdminConfigurationListId).items.getById(parseInt(item?.smartFevId)).select('Id', 'Title', 'Value', 'Key', 'Description', 'DisplayTitle', 'Configurations').get()
              countCall++;
              if (results.Configurations !== undefined) {
                item.configurationData = JSON.parse(results.Configurations);
                item.configurationData.map((elem: any) => {
                  item.CurrentUserID = elem?.CurrentUserID;
                  item.isShowEveryone = elem?.isShowEveryone
                  elem.Id = results.Id;
                  if (elem.startDate != null && elem.startDate != undefined && elem.startDate != "") {
                    elem.startDate = new Date(elem.startDate);
                  }
                  if (elem.endDate != null && elem.endDate != undefined && elem.endDate != "") {
                    elem.endDate = new Date(elem.endDate);
                  }
                })
              }
              if (IsLoadTask != false && TotalCSmartFav?.length == countCall) {
                setprogressBar(true);
                if (Type != false && Type != "OtherUserSelected")
                  smartTimeTotal();
                else
                  getAllData(Type)
              }
            } catch (error) {
              console.log(error);
            }
          }
          else {
            if (index == DashboardConfig?.length - 1) {
              if (IsLoadTask != false) {
                setprogressBar(true);
                if (Type != false && Type != "OtherUserSelected")
                  smartTimeTotal();
                else
                  getAllData(Type)
              }
            }
          }
        })
      }
    }).catch((err: any) => {
      console.log(err);
    })
  }
  function removeHtmlAndNewline(text: any) {
    if (text) {
      return text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
    } else {
      return ''; // or any other default value you prefer
    }
  }
  const LoggedinUserInfo = () => {
    CurrentUserProjectData = [];
    CurrentUserWorkingToday = [];
    let currentDate: any = new Date();
    currentDate.setDate(currentDate.getDate());
    currentDate.setHours(0, 0, 0, 0);
    AllProjectData?.map((item: any) => {
      if (item?.ResponsibleTeam != undefined && item?.ResponsibleTeam?.length) {
        item?.ResponsibleTeam?.map((Assigned: any) => {
          if (currentUserId != undefined && currentUserId == Assigned?.Id) {
            CurrentUserProjectData.push(item);
          }
        })
      }
    })
    taskUsers?.map((item: any) => {
      if (currentUserId != undefined && currentUserId == item?.AssingedToUser?.Id) {
        CurrentUserInfo = item;
      }
    })
    let FilteredTask: any = allData.filter((person: any) => person.WorkingAction != undefined && person.WorkingAction != '' && person.WorkingAction != null)
    if (FilteredTask != undefined && FilteredTask?.length) {
      FilteredTask?.map((items: any) => {
        if (items?.WorkingAction != undefined && items?.WorkingAction?.length > 0) {
          for (const workingDetails of items.WorkingAction ?? []) {
            if (workingDetails?.Title != undefined && workingDetails?.InformationData != undefined && workingDetails?.Title == "WorkingDetails" && workingDetails?.InformationData.length > 0) {
              for (const workingTask of workingDetails?.InformationData ?? []) {
                if (workingTask?.WorkingMember != undefined && workingTask?.WorkingMember?.length > 0) {
                  for (const assign of workingTask?.WorkingMember ?? []) {
                    let WorkingDate: any = Moment(workingTask?.WorkingDate, 'DD/MM/YYYY');
                    WorkingDate?._d.setHours(0, 0, 0, 0);
                    if (assign != undefined && assign?.Id == currentUserId && WorkingDate?._d.getTime() == currentDate?.getTime() && !isTaskItemExists(CurrentUserWorkingToday, items)) {
                      CurrentUserWorkingToday.push(items);
                    }
                  }
                }
              }
            }
          }
        }
      })
    }
    setLoadHeaderSection(true);
  }
  const loadMasterTask = () => {
    globalCommon.GetServiceAndComponentAllData(props?.props).then((data: any) => {
      AllMasterTasks = data?.AllData;
      AllProjectData = data?.ProjectData;
      AllMasterTasks = AllMasterTasks.concat(data?.ProjectData)
      AllMasterTasks?.map((items: any) => {
        items.descriptionsSearch = '';
        items.SiteIconTitle = items?.Item_x0020_Type == "Sprint" ? "X" : items?.Item_x0020_Type.charAt(0);
        if (items?.Deliverables != undefined || items?.Short_x0020_Description_x0020_On != undefined || items?.TechnicalExplanations != undefined || items?.Body != undefined || items?.AdminNotes != undefined || items?.ValueAdded != undefined
          || items.Idea != undefined || items.Background != undefined) {
          items.descriptionsSearch = `${removeHtmlAndNewline(items?.Deliverables)} ${removeHtmlAndNewline(items?.Short_x0020_Description_x0020_On)} ${removeHtmlAndNewline(items?.TechnicalExplanations)} ${removeHtmlAndNewline(items?.Body)} ${removeHtmlAndNewline(items?.AdminNotes)} ${removeHtmlAndNewline(items?.ValueAdded)} ${removeHtmlAndNewline(items?.Idea)} ${removeHtmlAndNewline(items?.Background)}`;
        }

        let EstimatedDesc: any = [];
        items.EstimatedTime = 0;
        if (items?.EstimatedTimeDescription != undefined && items?.EstimatedTimeDescription != '' && items?.EstimatedTimeDescription != null) {
          EstimatedDesc = JSON.parse(items?.EstimatedTimeDescription)
        }
        items.workingDetailsBottleneck = [];
        items.workingDetailsAttention = [];
        items.workingDetailsPhone = [];
        items.workingTodayUsers = [];
        try {
          if (items?.WorkingAction != undefined && items?.WorkingAction != '' && items?.WorkingAction != null) {
            items.WorkingAction = JSON.parse(items?.WorkingAction)
            const todayStr = Moment().format('DD/MM/YYYY');
            items.workingDetailsBottleneck = items?.WorkingAction?.find((item: any) => item.Title === 'Bottleneck' && item?.InformationData?.length > 0);
            items.workingDetailsAttention = items?.WorkingAction?.find((item: any) => item.Title === 'Attention' && item?.InformationData?.length > 0);
            items.workingDetailsPhone = items?.WorkingAction?.find((item: any) => item.Title === 'Phone' && item?.InformationData?.length > 0);
            const workingDetails = items?.WorkingAction?.find((item: any) => item.Title === 'WorkingDetails');
            if (workingDetails) { items.workingTodayUsers = workingDetails?.InformationData?.filter((detail: any) => detail.WorkingDate === todayStr); }
          }
        } catch (e) { }

        if (EstimatedDesc?.length > 0) {
          EstimatedDesc?.map((time: any) => {
            items.EstimatedTime += Number(time?.EstimatedTime)
          })
        }
        items.portfolioItemsSearch = '';
        if (items?.TaskType) {
          items.portfolioItemsSearch = items?.TaskType?.Title;
        }
        items.TaskTypeValue = '';
        if (items?.TaskCategories?.length > 0) {
          items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
        }
        items.ClientCategorySearch = ''
        if (items?.ClientCategory?.length > 0) {
          items.ClientCategorySearch = items?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
        }
        items.AllTeamName = "";
        if (items.AssignedTo != undefined && items.AssignedTo.length > 0) {
          map(items.AssignedTo, (Assig: any) => {
            if (Assig.Id != undefined) {
              map(taskUsers, (users: any) => {
                if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                  users.ItemCover = users.Item_x0020_Cover;
                  items.AllTeamName += users.Title + ";";
                }
              });
            }
          });
        }
        if (items.ResponsibleTeam != undefined && items.ResponsibleTeam.length > 0) {
          map(items.ResponsibleTeam, (Assig: any) => {
            if (Assig.Id != undefined) {
              map(taskUsers, (users: any) => {
                if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                  users.ItemCover = users.Item_x0020_Cover;
                  items.AllTeamName += users.Title + ";";
                }
              });
            }
          });
        }
        if (items.TeamMembers != undefined && items.TeamMembers.length > 0) {
          map(items.TeamMembers, (Assig: any) => {
            if (Assig.Id != undefined) {
              map(taskUsers, (users: any) => {
                if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                  users.ItemCover = users.Item_x0020_Cover;
                  items.AllTeamName += users.Title + ";";
                }
              });
            }
          });
        }
        if (items.Project) {
          items.ProjectTitle = items?.Project?.Title;
          items.ProjectId = items?.Project?.Id;
          items.projectStructerId = items?.Project?.PortfolioStructureID
          const title = items?.Project?.Title || '';
          const formattedDueDate = Moment(items?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
          items.joinedData = [];
          if (items?.projectStructerId && title || formattedDueDate) {
            items.joinedData.push(`Project ${items?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
          }
        }
        if (items?.Created != null && items?.Created != undefined)
          items.serverCreatedDate = new Date(items?.Created).setHours(0, 0, 0, 0)
        items.DisplayCreateDate = Moment(items.Created).format("DD/MM/YYYY");
        if (items.DisplayCreateDate == "Invalid date" || "")
          items.DisplayCreateDate = items.DisplayCreateDate.replaceAll("Invalid date", "");
        if (items.Author)
          items.Author.autherImage = findUserByName(items.Author?.Id)
        if (items?.DueDate != null && items?.DueDate != undefined)
          items.serverDueDate = new Date(items?.DueDate).setHours(0, 0, 0, 0)
        items.DisplayDueDate = Moment(items?.DueDate).format("DD/MM/YYYY");
        if (items.DisplayDueDate == "Invalid date" || "")
          items.DisplayDueDate = items?.DisplayDueDate.replaceAll("Invalid date", "");
        if (items?.Modified != null && items?.Modified != undefined)
          items.serverModifiedDate = new Date(items?.Modified).setHours(0, 0, 0, 0)
        items.DisplayModifiedDate = Moment(items?.Modified).format("DD/MM/YYYY");
        if (items.Editor) {
          items.Editor.autherImage = findUserByName(items.Editor?.Id)
        }
        items.percentage = items.PercentComplete
        //  + "%";
        if (items.PercentComplete != undefined && items.PercentComplete != '' && items.PercentComplete != null)
          items.percentCompleteValue = parseInt(items?.PercentComplete);
        items.site = items.siteType;
        items.subRows = [];
        items.isShifted = false;
        items.TaskID = items?.PortfolioStructureID;
        items.SmartPriority = globalCommon.calculateSmartPriority(items);
        if (items.SmartPriority != undefined && items.SmartPriority != '')
          items.SmartPriority = items.SmartPriority.toString()
        if (items?.TaskCategories != undefined && items?.TaskCategories.length > 0) {
          items.Categories = '';
          items?.TaskCategories.forEach((category: any, index: any) => {
            if (index == 0)
              items.Categories += category.Title;
            else
              items.Categories += ';' + category.Title;
          });
        }
      })
    }).catch((error: any) => {
      console.log(error)
    })
  }
  const getChilds = (item: any, items: any) => {
    item.childs = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
        item.childs.push(childItem);
        getChilds(childItem, items);
      }
    }
  }
  const loadTaskUsers = async (IsOtherUser: any) => {
    try {
      taskUsers = await globalCommon.loadAllTaskUsers(props?.props);
      let mailApprover: any;
      currentUserId = props?.props?.Context?.pageContext?.legacyPageContext?.userId
      let OtherLoggedInUserId: any = localStorage.getItem('CurrentUserId')
      if (OtherLoggedInUserId != undefined && OtherLoggedInUserId != '' && DashboardId == 5)
        currentUserId = OtherLoggedInUserId;
      AllUsers = taskUsers?.filter((user: any) => user?.AssingedToUserId != undefined && user?.AssingedToUserId != '' && user?.UserGroup != undefined && user?.UserGroup?.Title != undefined && user?.UserGroup?.Title != '' && user?.UserGroup?.Title != "Ex Staff" && user?.UserGroup?.Title != 'External Staff' && user?.UserGroup?.Title != 'HR' && user?.ItemType == 'User');
      taskUsers?.map((item: any) => {
        item.Tasks = [];
        item.IsShowTask = false;
        if (item.UserGroupId == undefined) {
          getChilds(item, taskUsers);
          GroupByUsers.push(item);
        }
        if (currentUserId != undefined && currentUserId == item?.AssingedToUser?.Id) {
          currentUserData = item;
          if (item?.Approver?.length > 0 && item?.Approver?.length != undefined && item?.Approver?.length != null)
            mailApprover = item?.Approver[0];
          else
            mailApprover = null;
        }
        if (mailApprover != undefined && mailApprover != null) {
          if (mailApprover.Id == item.AssingedToUserId && item.Email != undefined && item.Email != null)
            setApproverEmail(item.Email);
          else
            setApproverEmail("");
        }
        else {
          setApproverEmail("");
        }
        item.expanded = false;
      })
      if (GroupByUsers != undefined && GroupByUsers.length > 0) {
        GroupByUsers?.map((User: any) => {
          if (User.childs != undefined && User.childs.length > 0) {
            User.childs.map((ChildUser: any) => {
              if (ChildUser.Item_x0020_Cover == null || ChildUser.Item_x0020_Cover == undefined) {
                let tempObject: any = {
                  Description: '/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg',
                  Url: '/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'
                }
                ChildUser.Item_x0020_Cover = tempObject;
              }
            })
          }
        })
      }
      setData({ AllTaskUser: taskUsers });
    }
    catch (error) {
      return Promise.reject(error);
    }
  }
  const findUserByName = (name: any) => {
    const user = taskUsers.filter((user: any) => user?.AssingedToUser?.Id == name);
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else { Image = props?.props?.Context?._pageContext?._site?.absoluteUrl + "/PublishingImages/Portraits/icon_user.jpg"; }
    return user ? Image : null;
  };
  const isTaskItemExists = (array: any, items: any) => {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.Id == items.Id && items?.siteType != undefined && items?.siteType != '' && item?.siteType != undefined && item?.siteType != '' && item?.siteType.toLowerCase() == items?.siteType.toLowerCase()) {
        isExists = true;
        break;
      }
    }
    return isExists;
  }
  const isTaskUserExist = (array: any, items: any) => {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (items?.AssingedToUserId != undefined && item?.AssingedToUserId != undefined && items?.AssingedToUserId == item?.AssingedToUserId) {
        isExists = true;
        break;
      }
    }
    return isExists;
  }
  const groupView = (Tasks: any) => {
    Tasks.map((item: any) => {
      Tasks.map((val: any) => {
        if (val.ParentTask != undefined && val.ParentTask.Id != undefined && val.ParentTask.Id == item.Id && val.siteType == item.siteType) {
          val.isShifted = true;
          item.subRows.push(val);
        }
      })
    })
    return Tasks = Tasks.filter((type: any) => type.isShifted == false);
  }
  const getStartingDate = (startDateOf: any) => {
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
      var change = (Moment(startingDateOfLastMonth).add(10, 'days').format())
      var b = new Date(change)
      formattedDate = b;
    } else if (startDateOf == 'Last Week') {
      const lastWeek = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
      const startingDateOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 1);
      formattedDate = startingDateOfLastWeek;
    }

    return formattedDate;
  }
  var isItemExists = function (array: any, Id: any) {
    var isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.Id == Id) {
        isExists = true;
        return false;
      }
    };
    return isExists;
  };
  const MakeFinalData = () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = time;
    setCurrentTime(dateTime)
    const array: any = allData;
    const filteredConfig = DashboardConfig.find((item: any) => item.DataSource === 'TimeSheet');
    DashboardConfig.forEach((config: any) => {
      if (config.Tasks === undefined) {
        config.Tasks = [];
      }
      if (config.DataSource === 'Tasks' || config.DataSource === 'Project') {
        if (config.selectFilterType !== 'custom') {
          if (config.smartFevId !== undefined && config.smartFevId !== '' && !config.isShowEveryone) {
            if (currentUserData?.AssingedToUser?.Id === config.CurrentUserID) {
              config.LoadDefaultFilter = false;
              FilterDataOnCheck(config);
            }
          } else if (config.smartFevId !== undefined && config.smartFevId !== '' && config.isShowEveryone) {
            config.LoadDefaultFilter = false;
            FilterDataOnCheck(config);
          }
        }
        else if (config.selectFilterType === 'custom') {
          config.LoadDefaultFilter = false;
          if (config?.DataSource == 'Tasks') {
            if (Array.isArray(array) && array.length > 0) {
              if (config['selectUserFilterType']) {
                array.filter(item => item?.PercentComplete == config?.Status && Array.isArray(item[config['selectUserFilterType']])).forEach(task => {
                  if (task[config['selectUserFilterType']].some((AssignUser: any) => AssignUser.Id == currentUserData?.AssingedToUser?.Id)) {
                    config.Tasks.push(task);
                  }
                });
              }
              if (!config['selectUserFilterType']) {
                config.Tasks = array.filter((item: any) => item?.PercentComplete == config?.Status);
              }
            }
          }
          else if (config?.DataSource == 'Project') {
            if (Array.isArray(AllMasterTasks) && AllMasterTasks.length > 0) {
              let filteredProject = AllMasterTasks.filter((item: any) => item.Item_x0020_Type == 'Project');
              filteredProject.filter(item => item?.PercentComplete == config?.Status && Array.isArray(item[config['selectUserFilterType']])).forEach(task => {
                if (task[config['selectUserFilterType']].some((AssignUser: any) => AssignUser.Id == currentUserData?.AssingedToUser?.Id)) {
                  config.Tasks.push(task);
                }
              });
            }
          }
        }
        if (!filteredConfig) {
          setIsCallContext(true);
        }
      }
      else if (config.DataSource === 'TaskUsers') {
        config.LoadDefaultFilter = false;
        if (config.selectFilterType === 'custom') {
          if (!isTaskUserExist(AllUsers, currentUserData)) {
            AllUsers.unshift(currentUserData);
          }
          if (AllUsers && AllUsers.length > 0) {
            const currentDate = CurrentMatchableDate.getTime();
            for (let User of AllUsers) {
              User.TotalTask = 0;
              User.TotalEstimatedTime = 0;
              User.dates = JSON.parse(JSON.stringify(dates));
              User.dates.map((Date: any) => {
                Date.ServerDate = Moment(Date?.ServerDate)
                Date.ServerDate = Date.ServerDate?._d;
                Date.ServerDate.setHours(0, 0, 0, 0)
                if (Date?.DisplayDate == 'Un-Assigned')
                  Date.ServerDate = undefined;
                if (Date?.Tasks == undefined)
                  Date.Tasks = [];
                Date.TotalTask = 0;
                Date.TotalEstimatedTime = 0
              })
              for (let Task of array) {
                Task.WorkingDate = ''
                let taskAssigned = false;
                if (Task.AssignedTo && Task.AssignedTo.some((assign: any) => assign.Id === User.AssingedToUserId)) {
                  for (let workingMember of Task.WorkingAction || []) {
                    if (workingMember.Title === 'WorkingDetails' && workingMember.InformationData) {
                      for (let workingDetails of workingMember.InformationData) {
                        let WorkingDate: any = Moment(workingDetails.WorkingDate, 'DD/MM/YYYY');
                        WorkingDate?._d.setHours(0, 0, 0, 0)
                        if (workingDetails.WorkingMember) {
                          for (let workingUser of workingDetails.WorkingMember) {
                            if (workingUser.Id === User.AssingedToUserId && WorkingDate?._d.getTime() >= currentDate) {
                              taskAssigned = true;
                            }
                            if (User.AssingedToUserId != undefined && workingUser?.Id == User.AssingedToUserId) {
                              Task.WorkingDate += workingDetails?.WorkingDate + ' | '
                            }
                            let CopyTask = { ...Task };
                            for (let Date of User?.dates) {
                              if (User.AssingedToUserId != undefined && workingUser?.Id == User.AssingedToUserId && Date.ServerDate?.getTime() == WorkingDate?._d.getTime() && !isTaskItemExists(Date.Tasks, Task)) {
                                Date.Tasks.push(CopyTask)
                                Date.TotalTask += 1;
                                Date.TotalEstimatedTime += Task?.EstimatedTime;
                              }
                              if (User.AssingedToUserId != undefined && workingUser?.Id == User.AssingedToUserId && Date.ServerDate?.getTime() == WorkingDate?._d.getTime() && !isTaskItemExists(User.Tasks, Task)) {
                                if (User?.Tasks == undefined)
                                  User.Tasks = [];
                                User.Tasks.push(CopyTask)
                                User.TotalTask += 1;
                                User.TotalEstimatedTime += Task?.EstimatedTime;
                              }
                            };
                          }
                        }
                      }
                    }
                  }
                }
                if (!taskAssigned && User.AssingedToUserId && Task.AssignedTo) {
                  for (let assign of Task.AssignedTo) {
                    if (assign.Id === User.AssingedToUserId && !isTaskItemExists(User.Tasks, Task)) {
                      let CopyTask = { ...Task, WorkingDate: '' };
                      User.dates.forEach((date: any) => {
                        if (date.DisplayDate === 'Un-Assigned') {
                          date.Tasks.push(CopyTask);
                          date.TotalTask += 1;
                          date.TotalEstimatedTime += Task.EstimatedTime;
                        }
                      });
                    }
                  }
                }
              }
            }
          }

          for (let item of AllUsers) {
            if (item[config.Status]) {
              if (Array.isArray(item[config.Status])) {
                for (let teamMember of item[config.Status]) {
                  if (teamMember.Id == currentUserId && !isTaskUserExist(LoginUserTeamMembers, item) && item.ItemType !== 'Group') {
                    LoginUserTeamMembers.push(item);
                  }
                }
              } else if (typeof item[config.Status] === 'object' && item[config.Status] !== null) {
                if ((item[config.Status].Id == currentUserId || item[config.Status].Id == currentUserData.Id) && !isTaskUserExist(LoginUserTeamMembers, item) && item.ItemType !== 'Group') {
                  LoginUserTeamMembers.push(item);
                }
              }
            }
          }
          let loggedInUser = AllUsers.find((user: any) => user.AssingedToUserId && user.AssingedToUserId == currentUserData.AssingedToUser.Id);
          if (loggedInUser && !isTaskUserExist(LoginUserTeamMembers, loggedInUser)) {
            LoginUserTeamMembers.unshift(loggedInUser);
          }
          config.Tasks = LoginUserTeamMembers;
          config.BackupTask = LoginUserTeamMembers;
          config.AllUserTask = AllUsers;
        }
        else if (config.selectFilterType === 'GroupByUser') {
          config.Tasks = GroupByUsers;
        }
        if (!filteredConfig) {
          setIsCallContext(true);
        }
      }
      else if (config?.DataSource == 'TimeSheet') {
        config.LoadDefaultFilter = false;
        let CurrentDate = new Date();
        CurrentDate.setHours(0, 0, 0, 0)
        let arraycount = 0;
        let TempArray: any = []
        let ServerThisWeek: any = getStartingDate('This Week')
        let ThisWeek = getStartingDate('This Week').toISOString();
        if (TimeSheetLists != undefined && TimeSheetLists?.length > 0) {
          TimeSheetLists.map((site: any) => {
            let web = new Web(site?.siteUrl);
            web.lists.getById(site?.listId).items.select(site?.query).filter(`(Modified ge '${ThisWeek}') and (TimesheetTitle/Id ne null)`).getAll()
              .then((data: any) => {
                console.log(data);
                data.map((entry: any) => {
                  try {
                    if (entry?.AdditionalTimeEntry != undefined && entry?.AdditionalTimeEntry != null && entry?.AdditionalTimeEntry != '') {
                      entry.AdditionalTimeEntry = JSON.parse(entry?.AdditionalTimeEntry)
                      entry.AuthorName = '';
                      entry.AuthorImage = ''
                      entry.TaskTime = 0
                      entry.TaskDate = undefined
                      entry.CreatedServerDate = undefined
                      if (entry.AdditionalTimeEntry != undefined && entry.AdditionalTimeEntry?.length > 0) {
                        entry.AdditionalTimeEntry?.map((TimeEntry: any, index: any) => {
                          TimeEntry.SiteIcon = '';
                          TimeEntry.TaskID = '';
                          if (array?.length) {
                            array?.map((task: any) => {
                              if (task?.siteType != undefined && task?.siteType?.toLowerCase() == "offshore tasks")
                                task.LookupColumn = "Offshore Tasks";
                              task.LookupColumn = task?.siteType;
                              let ColumnName = "Task" + task?.LookupColumn.replace(" ", "");
                              if (entry[ColumnName] != undefined && entry[ColumnName].Title != undefined) {
                                if (entry[ColumnName].Id != undefined && entry[ColumnName].Id == task?.Id) {
                                  TimeEntry.SiteIcon = task?.SiteIcon;
                                  TimeEntry.TaskID = task?.TaskID;
                                  TimeEntry.Site = task?.siteType;
                                  TimeEntry.TaskItem = task;
                                }
                              }
                            })
                          }
                          TimeEntry.timeSheetsDescriptionSearch = '';
                          TimeEntry.UpdatedId = entry?.Id;
                          TimeEntry.timeSheetsDescriptionSearch = TimeEntry?.Description
                          if ((TimeEntry?.Id == undefined || TimeEntry?.Id == '') && TimeEntry?.ID != undefined && TimeEntry?.ID != '')
                            TimeEntry.Id = TimeEntry?.ID;
                          else if ((TimeEntry?.ID == undefined || TimeEntry?.ID == '') && TimeEntry?.Id != undefined && TimeEntry?.Id != '')
                            TimeEntry.ID = TimeEntry?.Id;
                          else {
                            TimeEntry.Id = index;
                            TimeEntry.ID = index;
                          }
                          if (TimeEntry.TaskDate != null) {
                            var dateValues = TimeEntry?.TaskDate?.split("/");
                            var dp = dateValues[1] + "/" + dateValues[0] + "/" + dateValues[2];
                            var NewDate = new Date(dp);
                            TimeEntry.sortTaskDate = NewDate;
                            TimeEntry.TaskDates = Moment(NewDate).format("ddd, DD/MM/YYYY");
                            TimeEntry.sortTaskDate.setHours(0, 0, 0, 0);
                            TimeEntry.Title = TimeEntry?.AuthorName;
                          }
                          entry.listId = site?.listId;
                          entry.siteUrl = site?.siteUrl
                          if (site?.taskSites != undefined && site?.taskSites?.length > 0) {
                            site?.taskSites?.forEach((Site: any) => {
                              if (entry['Task' + Site] != undefined && entry['Task' + Site]?.Id != undefined) {
                                entry.TaskListType = Site;
                              }
                            })
                          }
                          if (TimeEntry?.sortTaskDate != undefined && ServerThisWeek != undefined && TimeEntry?.sortTaskDate.getTime() >= ServerThisWeek.getTime()) {
                            if (TimeEntry?.Status == 'For Approval' && config?.Status != "My TimSheet") {
                              TempArray.push(TimeEntry)
                              if (!isItemExists(AllTimeEntry, entry.Id))
                                AllTimeEntry.push(entry);
                            }
                          }
                          if (TimeEntry?.sortTaskDate != undefined && CurrentDate != undefined && CurrentDate.getTime() == TimeEntry?.sortTaskDate.getTime()) {
                            if (TimeEntry?.Status == 'Draft' && config?.Status == "My TimSheet") {
                              TempArray.push(TimeEntry)
                              if (!isItemExists(AllTimeEntry, entry.Id))
                                AllTimeEntry.push(entry);
                            }
                          }
                        })
                      }
                    }
                  } catch (e) {
                    console.log(entry)
                  }
                });
                arraycount++;
                let currentCount = TimeSheetLists?.length;
                if (arraycount == currentCount) {
                  let TeamMember: any = []
                  taskUsers?.map((item: any) => {
                    if (item[config['Status']] != undefined && Array.isArray(item[config['Status']]) && item[config['Status']]?.length > 0) {
                      item[config['Status']].forEach((teamMember: any) => {
                        if (teamMember?.Id == currentUserId && !isTaskUserExist(TeamMember, item) && item?.ItemType != 'Group')
                          TeamMember.push(item)
                      })
                    }
                    else if (item[config['Status']] != undefined && typeof item[config['Status']] == 'object' && item[config['Status']] !== null) {
                      if ((item[config['Status']]?.Id == currentUserId || item[config['Status']]?.Id == currentUserData?.Id) && !isTaskUserExist(TeamMember, item) && item?.ItemType != 'Group')
                        TeamMember.push(item)
                    }
                  })
                  if (config?.Status == "My TimSheet") {
                    TeamMember = [];
                    TeamMember.push(currentUserData)
                  }
                  if (TempArray != undefined && TempArray?.length > 0 && TeamMember?.length > 0) {
                    TeamMember?.map((User: any) => {
                      TempArray?.map((TimeEntry: any) => {
                        if (User?.AssingedToUserId != undefined && TimeEntry?.AuthorId != undefined && TimeEntry?.AuthorId == User?.AssingedToUserId) {
                          config.Tasks.push(TimeEntry)
                        }
                      })
                    })
                  }
                  setIsCallContext(true);
                }
              }).catch((error: any) => {
                console.log(error)
              })

          })
        }
      }
    });
    let todayDate: any = new Date();
    const currentDate = todayDate;
    currentDate.setDate(today.getDate());
    currentDate.setHours(0, 0, 0, 0);
    // if (DashboardId == 1 || DashboardId == 27) {
    for (const items of array ?? []) {
      for (const config of DashboardConfig ?? []) {
        if (config?.Tasks == undefined) {
          config.Tasks = [];
        }
        if (config?.LoadDefaultFilter !== false) {
          if (config?.IsDraftTask != undefined && items.Categories?.toLowerCase().includes(config?.IsDraftTask.toLowerCase()) && items.Author?.Id == currentUserData?.AssingedToUser?.Id && !isTaskItemExists(config?.Tasks, items)) {
            config?.Tasks.push(items);
          }
          if (items?.WorkingAction != undefined && items?.WorkingAction?.length > 0) {
            for (const workingDetails of items.WorkingAction ?? []) {
              if (config?.IsBottleneckTask != undefined && workingDetails?.Title != undefined && workingDetails?.InformationData != undefined && workingDetails?.Title == config?.IsBottleneckTask && workingDetails?.InformationData.length > 0) {
                for (const botteleckInfo of workingDetails?.InformationData ?? []) {
                  if (botteleckInfo?.TaggedUsers != undefined && botteleckInfo?.TaggedUsers?.AssingedToUserId != undefined && botteleckInfo?.TaggedUsers?.AssingedToUserId == currentUserData?.AssingedToUser?.Id && !isTaskItemExists(config?.Tasks, items)) {
                    config?.Tasks.push(items);
                  }
                }
              }
              if (config?.IsTodaysTask != undefined && workingDetails?.Title != undefined && workingDetails?.InformationData != undefined && workingDetails?.Title == "WorkingDetails" && workingDetails?.InformationData.length > 0) {
                for (const workingTask of workingDetails?.InformationData ?? []) {
                  if (workingTask?.WorkingMember != undefined && workingTask?.WorkingMember?.length > 0) {
                    for (const assign of workingTask?.WorkingMember ?? []) {
                      let WorkingDate: any = Moment(workingTask?.WorkingDate, 'DD/MM/YYYY');
                      WorkingDate?._d.setHours(0, 0, 0, 0);
                      if (assign != undefined && assign?.Id == currentUserData?.AssingedToUser?.Id && WorkingDate?._d.getTime() == currentDate?.getTime() && !isTaskItemExists(config?.Tasks, items)) {
                        items.WorkingDate = workingTask?.WorkingDate;
                        config?.Tasks.push(items);
                        items.IsPushAssignedTask = false;
                      }
                    }
                  }
                }
              }
            }
          }
          for (const assign of items.AssignedTo ?? []) {
            if (assign && assign.Id == currentUserData?.AssingedToUser?.Id) {
              if (config?.IsImmediateTask != undefined && items.Categories?.toLowerCase().includes(config?.IsImmediateTask.toLowerCase()) && items?.PercentComplete != undefined && items?.PercentComplete < 80 && !isTaskItemExists(config?.Tasks, items)) {
                config?.Tasks.push(items);
              }
              else if (config?.IsApprovalTask != undefined && items.percentage == config?.IsApprovalTask && !isTaskItemExists(config?.Tasks, items)) {
                config?.Tasks.push(items);
              }
              else if (config?.IsWorkingWeekTask != undefined && items?.WorkingAction != undefined && items?.WorkingAction?.length > 0) {
                for (const workingDetails of items?.WorkingAction ?? []) {
                  if (workingDetails?.InformationData?.length > 0) {
                    for (const objDetails of workingDetails?.InformationData ?? []) {
                      if (objDetails?.WorkingDate != undefined) {
                        const givenDate = Moment(objDetails?.WorkingDate, "DD/MM/YYYY");
                        const givenDateAsDate = givenDate.toDate();
                        const greaterThanToday = givenDateAsDate > new Date();
                        const startOfWeek: any = new Date();
                        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                        const endOfWeek = new Date(startOfWeek);
                        endOfWeek.setDate(startOfWeek.getDate() + 6);
                        const inCurrentWeek = givenDateAsDate >= startOfWeek && givenDateAsDate <= endOfWeek;
                        if (greaterThanToday && inCurrentWeek) {
                          for (const user of objDetails?.WorkingMember ?? []) {
                            if (user?.Id == currentUserData?.AssingedToUser?.Id && !isTaskItemExists(config?.Tasks, items))
                              config?.Tasks.push(items);
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (config?.IsAssignedTask === true && items?.IsPushAssignedTask != false && !isTaskItemExists(config?.Tasks, items))
                config?.Tasks.push(items);
            }
          }
        }
      }
    }
    // }
    setprogressBar(false);
  };
  const smartTimeUseLocalStorage = () => {
    let timeEntryDataLocalStorage: any = localStorage.getItem('timeEntryIndex')
    if (timeEntryDataLocalStorage?.length > 0) {
      const timeEntryIndexLocalStorage = JSON.parse(timeEntryDataLocalStorage)
      allData?.map((task: any) => {
        task.TotalTaskTime = 0;
        task.timeSheetsDescriptionSearch = "";
        const key = `Task${task?.siteType + task.Id}`;
        if (timeEntryIndexLocalStorage.hasOwnProperty(key) && timeEntryIndexLocalStorage[key]?.Id == task.Id && timeEntryIndexLocalStorage[key]?.siteType == task.siteType) {
          task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime;
          task.timeSheetsDescriptionSearch = timeEntryIndexLocalStorage[key]?.timeSheetsDescriptionSearch;
        }
      })
      console.log("timeEntryIndexLocalStorage", timeEntryIndexLocalStorage)
    }
  };
  const checkTimeEntrySite = (timeEntry: any) => {
    let result = ''
    result = allData?.filter((task: any) => {
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
  const loadAllTimeEntry = async () => {
    AllTaskTimeEntries = [];
    todaysDrafTimeEntry = [];
    if (TimeSheetLists?.length > 0) {
      let startDate = getStartingDate('This Week').toISOString();
      if (TimeSheetLists?.length > 0) {
        const fetchPromises = TimeSheetLists.map(async (list: any) => {
          let web = new Web(list?.siteUrl);
          try {
            let todayDateToCheck = new Date().setHours(0, 0, 0, 0,)
            const data = await web.lists
              .getById(list?.listId)
              .items.select(list?.query)
              .filter(`(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`)
              .getAll();
            data?.forEach((item: any) => {
              let entryDate = new Date(item?.Modified).setHours(0, 0, 0, 0)
              if (entryDate == todayDateToCheck) {
                todaysDrafTimeEntry?.push(item);
              }
              item.taskDetails = checkTimeEntrySite(item);
              AllTaskTimeEntries.push(item);
            });
          } catch (error) {
            console.log(error, 'HHHH Time');
          }
        });
        await Promise.all(fetchPromises)
      }
    }
  }
  const getAllData = async (IsLoad: any) => {
    if (IsLoad != undefined && IsLoad == true) {
      await globalCommon?.loadAllSiteTasks(props?.props, undefined).then((data: any) => {
        if (DashboardId == 1 || DashboardId == 27)
          loadAllTimeEntry();
        data?.map((items: any) => {
          items.descriptionsSearch = '';
          let descriptionSearchData = '';
          const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
          try {
            const feedbackData = JSON.parse(items.FeedBack);
            if (feedbackData != undefined && feedbackData[0] != undefined && feedbackData[0]?.FeedBackDescriptions != undefined && feedbackData[0]?.FeedBackDescriptions?.length) {
              descriptionSearchData = feedbackData[0]?.FeedBackDescriptions?.map((child: any) => {
                const childText = cleanText(child?.Title);
                const comments = (child?.Comments || [])?.map((comment: any) => {
                  const commentText = cleanText(comment?.Title);
                  const replyText = (comment?.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                  return [commentText, replyText]?.filter(Boolean).join(' ');
                }).join(' ');

                const subtextData = (child.Subtext || [])?.map((subtext: any) => {
                  const subtextComment = cleanText(subtext?.Title);
                  const subtextReply = (subtext.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                  const subtextComments = (subtext.Comments || [])?.map((subComment: any) => {
                    const subCommentTitle = cleanText(subComment?.Title);
                    const subCommentReplyText = (subComment.ReplyMessages || []).map((val: any) => cleanText(val?.Title)).join(' ');
                    return [subCommentTitle, subCommentReplyText]?.filter(Boolean).join(' ');
                  }).join(' ');
                  return [subtextComment, subtextReply, subtextComments].filter(Boolean).join(' ');
                }).join(' ');

                return [childText, comments, subtextData].filter(Boolean).join(' ');
              }).join(' ');
            }
            items.descriptionsSearch = descriptionSearchData;
          } catch (error) {
            console.error("Error:", error);
          }
          let EstimatedDesc: any = [];
          items.EstimatedTime = 0;
          items.EstimatedTimeDescr = '';
          if (items?.EstimatedTimeDescription != undefined && items?.EstimatedTimeDescription != '' && items?.EstimatedTimeDescription != null) {
            EstimatedDesc = JSON.parse(items?.EstimatedTimeDescription)
          }
          items.workingDetailsBottleneck = [];
          items.workingDetailsAttention = [];
          items.workingDetailsPhone = [];
          items.workingTodayUsers = [];
          items.WorkingDate = '';
          items.fontColorTask = "#000"
          try {
            if (items?.WorkingAction != undefined && items?.WorkingAction != '' && items?.WorkingAction != null) {
              items.WorkingAction = JSON.parse(items?.WorkingAction)
              for (let workingMember of items?.WorkingAction || []) {
                if (workingMember.Title === 'WorkingDetails' && workingMember.InformationData) {
                  for (let workingDetails of workingMember.InformationData) {
                    if (workingDetails.WorkingMember) {
                      items.WorkingDate += workingDetails?.WorkingDate + ' | '
                    }
                  }
                }
              }
              const todayStr = Moment().format('DD/MM/YYYY');
              items.workingDetailsBottleneck = items?.WorkingAction?.find((item: any) => item.Title === 'Bottleneck' && item?.InformationData?.length > 0);
              items.workingDetailsAttention = items?.WorkingAction?.find((item: any) => item.Title === 'Attention' && item?.InformationData?.length > 0);
              items.workingDetailsPhone = items?.WorkingAction?.find((item: any) => item.Title === 'Phone' && item?.InformationData?.length > 0);
              const workingDetails = items?.WorkingAction?.find((item: any) => item.Title === 'WorkingDetails');
              if (workingDetails) { items.workingTodayUsers = workingDetails?.InformationData?.filter((detail: any) => detail.WorkingDate === todayStr); }
            }
          } catch (e) { }
          if (EstimatedDesc?.length > 0) {
            EstimatedDesc?.map((time: any) => {
              items.EstimatedTime += Number(time?.EstimatedTime)
              if (time?.EstimatedTimeDescription != undefined && time?.EstimatedTimeDescription != '') {
                items.EstimatedTimeDescr += time?.EstimatedTimeDescription;
              }
            })
          }
          items.portfolioItemsSearch = '';
          if (items?.TaskType) {
            items.portfolioItemsSearch = items?.TaskType?.Title;
          }
          items.TaskTypeValue = '';
          if (items?.TaskCategories?.length > 0) {
            items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
          }
          items.ClientCategorySearch = ''
          if (items?.ClientCategory?.length > 0) {
            items.ClientCategorySearch = items?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
          }
          items.AllTeamName = "";
          if (items.AssignedTo != undefined && items.AssignedTo.length > 0) {
            map(items.AssignedTo, (Assig: any) => {
              if (Assig.Id != undefined) {
                map(taskUsers, (users: any) => {
                  if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                    users.ItemCover = users.Item_x0020_Cover;
                    items.AllTeamName += users.Title + ";";
                  }
                });
              }
            });
          }
          if (items.ResponsibleTeam != undefined && items.ResponsibleTeam.length > 0) {
            map(items.ResponsibleTeam, (Assig: any) => {
              if (Assig.Id != undefined) {
                map(taskUsers, (users: any) => {
                  if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                    users.ItemCover = users.Item_x0020_Cover;
                    items.AllTeamName += users.Title + ";";
                  }
                });
              }
            });
          }
          if (items.TeamMembers != undefined && items.TeamMembers.length > 0) {
            map(items.TeamMembers, (Assig: any) => {
              if (Assig.Id != undefined) {
                map(taskUsers, (users: any) => {
                  if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                    users.ItemCover = users.Item_x0020_Cover;
                    items.AllTeamName += users.Title + ";";
                  }
                });
              }
            });
          }
          if (items.Project) {
            items.ProjectTitle = items?.Project?.Title;
            items.ProjectId = items?.Project?.Id;
            items.projectStructerId = items?.Project?.PortfolioStructureID
            const title = items?.Project?.Title || '';
            const formattedDueDate = Moment(items?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
            items.joinedData = [];
            if (items?.projectStructerId && title || formattedDueDate) {
              items.joinedData.push(`Project ${items?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
            }
          }
          if (items?.Created != null && items?.Created != undefined)
            items.serverCreatedDate = new Date(items?.Created).setHours(0, 0, 0, 0)
          items.DisplayCreateDate = Moment(items.Created).format("DD/MM/YYYY");
          if (items.DisplayCreateDate == "Invalid date" || "")
            items.DisplayCreateDate = items.DisplayCreateDate.replaceAll("Invalid date", "");
          if (items.Author)
            items.Author.autherImage = findUserByName(items.Author?.Id)
          if (items?.DueDate != null && items?.DueDate != undefined)
            items.serverDueDate = new Date(items?.DueDate).setHours(0, 0, 0, 0)
          items.DisplayDueDate = Moment(items?.DueDate).format("DD/MM/YYYY");
          if (items.DisplayDueDate == "Invalid date" || "")
            items.DisplayDueDate = items?.DisplayDueDate.replaceAll("Invalid date", "");
          if (items?.Modified != null && items?.Modified != undefined)
            items.serverModifiedDate = new Date(items?.Modified).setHours(0, 0, 0, 0)
          items.DisplayModifiedDate = Moment(items?.Modified).format("DD/MM/YYYY");
          if (items.Editor) {
            items.Editor.autherImage = findUserByName(items.Editor?.Id)
          }
          items.percentage = items.PercentComplete
          //  + "%";
          if (items.PercentComplete != undefined && items.PercentComplete != '' && items.PercentComplete != null)
            items.percentCompleteValue = parseInt(items?.PercentComplete);
          items.site = items.siteType;
          items.subRows = [];
          items.isShifted = false;
          items.TaskID = globalCommon.GetTaskId(items);
          items.SmartPriority = globalCommon.calculateSmartPriority(items);
          if (items.SmartPriority != undefined && items.SmartPriority != '')
            items.SmartPriority = items.SmartPriority.toString()
          if (items?.TaskCategories != undefined && items?.TaskCategories.length > 0) {
            items.Categories = '';
            items?.TaskCategories.forEach((category: any, index: any) => {
              if (index == 0)
                items.Categories += category.Title;
              else
                items.Categories += ';' + category.Title;
            });
          }
          allData.push(items);
        })
        LoggedinUserInfo();
        smartTimeUseLocalStorage()
        MakeFinalData()
      }).catch((err: any) => {
        console.log("then catch error", err);
      });
    }
    else {
      LoggedinUserInfo();
      MakeFinalData()
    }

  };
  const callbackFunction = (Type: any, UserId: any) => {
    if (Type == "OtherUserSelected") {
      currentUserId = UserId;
      taskUsers?.map((item: any) => {
        if (currentUserId != undefined && currentUserId == item?.AssingedToUser?.Id)
          currentUserData = item;
      })
      LoggedinUserInfo();
    }
    LoadAdminConfiguration(true, Type)
  }
  /*smartFavId filter functionaloity*/
  const updatedCheckClintCategoryMatch = (data: any, clientCategory: any) => {
    try {
      if (clientCategory.length == 0) {
        return true;
      }
      if (data?.ClientCategory?.length > 0 && data?.ClientCategory != undefined && data?.ClientCategory != null) {
        let result = data?.ClientCategory?.some((item: any) => clientCategory.some((filter: any) => filter.Title == item.Title));
        if (result == true) {
          return true;
        }
      } else {
        let result = clientCategory.some((filter: any) => filter.Title == "Blank" && data?.ClientCategory?.length == 0)
        if (result == true) {
          return true;
        }
      }
      return false;
    } catch (error) {

    }
  };
  const updatedCheckMatch = (data: any, ItemProperty: any, FilterProperty: any, filterArray: any) => {
    try {
      if (filterArray.length == 0) {
        return true;
      }
      if (Array.isArray(data[ItemProperty])) {
        return data[ItemProperty]?.some((item: any) => filterArray.some((filter: any) => filter.Title == item.Title));
      } else {
        return filterArray.some((filter: any) => data[ItemProperty] !== undefined && data[ItemProperty] !== '' && filter[FilterProperty] === data[ItemProperty]);
      }
    } catch (error) { }
  };
  const updatedCheckCategoryMatch = (data: any, Categories: any) => {
    try {
      if (Categories.length == 0) {
        return true;
      }
      if (data?.TaskCategories?.length > 0 && data?.TaskCategories != undefined && data?.TaskCategories != null) {
        let result = data?.TaskCategories?.some((item: any) => Categories.some((filter: any) => filter.Title == item.Title));
        if (result == true) {
          return true;
        }
      } else {
        let result = Categories.some((filter: any) => filter.Title == "Other" && data?.Categories == null && data?.TaskCategories?.length == 0)
        if (result == true) {
          return true;
        }
      }
      return false;
    } catch (error) { }
  };
  const updatedCheckProjectMatch = (data: any, selectedProject: any) => {
    try {
      if (selectedProject?.length == 0) {
        return true;
      }
      if (data?.Project) {
        return selectedProject.some((value: any) => data?.Project?.Id == value.Id);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const updatedCheckTeamMembers = (data: any, teamMembers: any, Config: any) => {
    try {
      const currentDate: any = new Date();
      switch (Config?.configurationData[0]?.selectedFilterWorkingAction) {
        case "today":
          Config.configurationData[0].startDateWorkingAction = currentDate;
          Config.configurationData[0].endDateWorkingAction = currentDate;
          break;
        case "tomorrow":
          const tomorrow = new Date(currentDate);
          tomorrow.setDate(currentDate.getDate() + 1);
          Config.configurationData[0].startDateWorkingAction = tomorrow;
          Config.configurationData[0].endDateWorkingAction = tomorrow;
          break;
        case "thisweek":
          const dayOfWeek: any = currentDate.getDay();
          const startOfWeek: any = new Date(currentDate);
          const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          startOfWeek.setDate(currentDate.getDate() - daysToSubtract);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          Config.configurationData[0].startDateWorkingAction = startOfWeek;
          Config.configurationData[0].endDateWorkingAction = endOfWeek;
          break;
        case "nextweek":
          const dayOfWeeks: any = currentDate.getDay();
          const startOfNextWeek: any = new Date(currentDate);
          startOfNextWeek.setDate(currentDate.getDate() + (7 - dayOfWeeks + 1));
          const endOfNextWeek = new Date(startOfNextWeek);
          endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
          Config.configurationData[0].startDateWorkingAction = startOfNextWeek;
          Config.configurationData[0].endDateWorkingAction = endOfNextWeek;
          break;
        case "thismonth":
          const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          Config.configurationData[0].startDateWorkingAction = monthStartDate;
          Config.configurationData[0].endDateWorkingAction = monthEndDate;
          break;
        case "nextmonth":
          const nextMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
          const nextMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
          Config.configurationData[0].startDateWorkingAction = nextMonthStartDate;
          Config.configurationData[0].endDateWorkingAction = nextMonthEndDate;
          break;
        case "custom":
          Config.configurationData[0].startDateWorkingAction = Config?.configurationData[0]?.startDateWorkingAction;
          Config.configurationData[0].endDateWorkingAction = Config?.configurationData[0]?.endDateWorkingAction;
          break;
        default:
          Config.configurationData[0].startDateWorkingAction = null;
          Config.configurationData[0].endDateWorkingAction = null;
          break;
      }
      if (teamMembers.length === 0) {
        if (Config?.configurationData[0]?.isWorkingDate === true) {
          try {
            if (data?.WorkingAction) {
              const workingActionValue: any = [...data?.WorkingAction];
              const workingDetails = workingActionValue?.find((item: any) => item.Title === 'WorkingDetails');
              if (workingDetails?.InformationData) {
                const isWithinDateRange = (date: any) => {
                  if (Config?.configurationData[0]?.startDateWorkingAction && Config?.configurationData[0]?.endDateWorkingAction) {
                    let startDates = Config?.configurationData[0]?.startDateWorkingAction?.setHours(0, 0, 0, 0);
                    let endDates = Config?.configurationData[0]?.endDateWorkingAction?.setHours(0, 0, 0, 0);
                    const workingDate = new Date(Moment(date, 'DD/MM/YYYY').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')).setHours(0, 0, 0, 0)
                    return workingDate >= startDates && workingDate <= endDates;
                  } else {
                    let DefultDate = new Date().setHours(0, 0, 0, 0);
                    const workingDate = new Date(Moment(date, 'DD/MM/YYYY').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')).setHours(0, 0, 0, 0)
                    return workingDate >= DefultDate;
                  }
                };
                const result = workingDetails?.InformationData?.some((infoData: any) =>
                  isWithinDateRange(infoData?.WorkingDate) && infoData?.WorkingMember?.length > 0
                );
                if (result) {
                  return true;
                }
              }
            }
          } catch (error) {
            console.error("An error occurred:", error);
          }
        }
        if (Config?.configurationData[0]?.isPhone === true) {
          if (data?.workingDetailsPhone?.InformationData?.length > 0) {
            const result = data?.workingDetailsPhone?.InformationData?.length > 0 ? true : false
            if (result) {
              return true
            }
          }
        }
        if (Config?.configurationData[0]?.isBottleneck === true) {
          if (data?.workingDetailsBottleneck?.InformationData?.length > 0) {
            const result = data?.workingDetailsBottleneck?.InformationData?.length > 0 ? true : false
            if (result) {
              return true
            }
          }
        }
        if (Config?.configurationData[0]?.isAttention === true) {
          if (data?.workingDetailsAttention?.InformationData?.length > 0) {
            const result = data?.workingDetailsAttention?.InformationData?.length > 0 ? true : false
            if (result) {
              return true
            }
          }
        }
        if (Config?.configurationData[0]?.isWorkingDate === true || Config?.configurationData[0]?.isAttention === true || Config?.configurationData[0]?.isBottleneck === true || Config?.configurationData[0]?.isPhone === true) {
          return false
        }
        return true;
      }
      if (Config?.configurationData[0]?.isCreatedBy === true) {
        // let result = teamMembers.some((member: any) => member.Title === data?.Author?.Title?.replace(/\s+/g, ' '));
        let result = teamMembers.some((member: any) => member.Id === data?.Author?.Id);
        if (result === true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isModifiedby === true) {
        // let result = teamMembers.some((member: any) => member.Title === data?.Editor?.Title?.replace(/\s+/g, ' '));
        let result = teamMembers.some((member: any) => member.Id === data?.Editor?.Id);
        if (result === true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isAssignedto === true) {
        if (data?.AssignedTo?.length > 0) {
          // let result = data?.AssignedTo?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
          let result = data?.AssignedTo?.some((elem0: any) => teamMembers.some((filter: any) => filter?.Id === elem0?.Id));
          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isTeamLead === true) {
        if (data?.ResponsibleTeam.length > 0) {
          // let result = data?.ResponsibleTeam?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
          let result = data?.ResponsibleTeam?.some((elem: any) => teamMembers.some((filter: any) => filter?.Id === elem?.Id));

          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isTeamMember === true) {
        if (data?.TeamMembers?.length > 0) {
          // let result = data?.TeamMembers?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
          let result = data?.TeamMembers?.some((elem1: any) => teamMembers.some((filter: any) => filter?.Id === elem1?.Id));
          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isWorkingDate === true) {
        try {
          if (data?.WorkingAction) {
            const workingActionValue: any = [...data?.WorkingAction];
            const workingDetails = workingActionValue?.find((item: any) => item.Title === 'WorkingDetails');
            if (workingDetails) {
              const isWithinDateRange = (date: any) => {
                let startDates = Config?.configurationData[0]?.startDateWorkingAction?.setHours(0, 0, 0, 0);
                let endDates = Config?.configurationData[0]?.endDateWorkingAction?.setHours(0, 0, 0, 0);
                const workingDate = new Date(Moment(date, 'DD/MM/YYYY').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')).setHours(0, 0, 0, 0)
                return workingDate >= startDates && workingDate <= endDates;
              };
              const result = workingDetails?.InformationData?.some((infoData: any) =>
                infoData?.WorkingMember?.some((workingMember: any) =>
                  teamMembers?.some((teamMember: any) =>
                    isWithinDateRange(infoData?.WorkingDate) && teamMember?.Id === workingMember?.Id
                  )
                )
              );
              if (result) {
                return true;
              }
            }
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
      if (Config?.configurationData[0]?.isPhone === true) {
        if (data?.workingDetailsPhone?.InformationData?.length > 0) {
          let result = data?.workingDetailsPhone?.InformationData?.some((elem0: any) => teamMembers?.some((filter: any) => filter?.Id === elem0?.TaggedUsers?.AssingedToUserId));
          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isBottleneck === true) {
        if (data?.workingDetailsBottleneck?.InformationData?.length > 0) {
          let result = data?.workingDetailsBottleneck?.InformationData?.some((elem0: any) => teamMembers?.some((filter: any) => filter?.Id === elem0?.TaggedUsers?.AssingedToUserId));
          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isAttention === true) {
        if (data?.workingDetailsAttention?.InformationData?.length > 0) {
          let result = data?.workingDetailsAttention?.InformationData?.some((elem0: any) => teamMembers?.some((filter: any) => filter?.Id === elem0?.TaggedUsers?.AssingedToUserId));
          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isCreatedBy === false && Config?.configurationData[0]?.isModifiedby === false && Config?.configurationData[0]?.isAssignedto === false && Config?.configurationData[0]?.isTeamMember === false && Config?.configurationData[0]?.isTeamLead === false && Config?.configurationData[0]?.isWorkingDate === false && Config?.configurationData[0]?.isPhone === false && Config?.configurationData[0]?.sBottleneck === false && Config?.configurationData[0]?.isAttention === false) {
        let result = data?.TeamLeaderUser?.some((elem3: any) => teamMembers.some((filter: any) => filter?.Id === elem3?.Id));
        if (result === true) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  const updatedCheckTaskType = (data: any, type: any) => {
    try {
      if (type?.length == 0) {
        return true;
      }
      if (data?.TaskType) {
        return type.some((value: any) => data?.TaskType?.Title == value.Title);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const updatedCheckPriority = (data: any, priorityType: any) => {
    try {
      if (priorityType?.length == 0) {
        return true;
      }
      if (data.Priority !== undefined && data.Priority !== '' && data.Priority !== null) {
        return priorityType.some((value: any) => value.Title == data.Priority || value.Title == data.PriorityRank);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const updatedCheckDateSection = (data: any, startDate: any, endDate: any, Config: any, selectedFilter: any) => {
    let startdt = new Date(),
      enddt = new Date(),
      tempdt = new Date();
    let diff: number, lastday: number;
    let MatchstartDate: any = startDate;
    let MatchendDate: any = endDate;
    try {
      if (MatchstartDate == null && MatchendDate == null) {
        return true;
      }
      MatchstartDate = MatchstartDate.setHours(0, 0, 0, 0);
      MatchendDate = MatchendDate.setHours(0, 0, 0, 0);
      if (selectedFilter) {
        switch (selectedFilter) {
          case "today":
            MatchstartDate = startdt.setHours(0, 0, 0, 0);
            MatchendDate = enddt.setHours(0, 0, 0, 0);
            break;
          case "yesterday":
            MatchstartDate = startdt.setDate(startdt.getDate() - 1);
            MatchendDate = enddt.setDate(enddt.getDate() - 1);
            break;
          case "thisweek":
            diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
            MatchstartDate = new Date(startdt.setDate(diff));
            lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
            MatchendDate = new Date(enddt.setDate(lastday));
            break;
          case "last7days":
            tempdt = new Date();
            tempdt = new Date(tempdt.getFullYear(), tempdt.getMonth(), tempdt.getDate() - 7);
            diff = tempdt.getDate() - tempdt.getDay() + (tempdt.getDay() === 0 ? -6 : 1);
            MatchstartDate = new Date(tempdt.setDate(diff));
            lastday = tempdt.getDate() - (tempdt.getDay() - 1) + 6;
            MatchendDate = new Date(tempdt.setDate(lastday));
            break;
          case "thismonth":
            MatchstartDate = new Date(startdt.getFullYear(), startdt.getMonth(), 1);
            MatchendDate = new Date(enddt.getFullYear(), enddt.getMonth() + 1, 0);
            break;
          case "last30days":
            MatchstartDate = new Date(startdt.getFullYear(), startdt.getMonth() - 1);
            MatchendDate = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
            break;
          case "last3months":
            startdt.setMonth(startdt.getMonth() - 3);
            startdt.setDate(1);
            MatchstartDate = startdt;
            MatchendDate = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
            break;
          case "thisyear":
            MatchstartDate = new Date(new Date().getFullYear(), 0, 1);
            MatchendDate = new Date(new Date().getFullYear(), 11, 31);
            break;
          case "lastyear":
            MatchstartDate = new Date(new Date().getFullYear() - 1, 0, 1);
            MatchendDate = new Date(new Date().getFullYear() - 1, 11, 31);
            break;
          case "Pre-set":
            let storedDataStartDate: any
            let storedDataEndDate: any
            try {
              storedDataStartDate = JSON.parse(localStorage.getItem('startDate'));
              storedDataEndDate = JSON.parse(localStorage.getItem('endDate'))
            } catch (error) { }
            if (storedDataStartDate && storedDataStartDate != null && storedDataStartDate != "Invalid Date" && storedDataEndDate && storedDataEndDate != null && storedDataEndDate != "Invalid Date") {
              MatchstartDate = new Date(storedDataStartDate);
              MatchendDate = new Date(storedDataEndDate);
            }
            break;
          case "custom":
            MatchstartDate = startDate;
            MatchendDate = endDate;
            break;
          default:
            MatchstartDate = null;
            MatchendDate = null;
            break;
        }
      }
      if (Config?.configurationData[0]?.isCreatedDateSelected == true) {
        let result = (data?.serverCreatedDate && data.serverCreatedDate >= MatchstartDate && data.serverCreatedDate <= MatchendDate);
        if (result == true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isModifiedDateSelected == true) {
        let result = (data?.serverModifiedDate && data.serverModifiedDate >= MatchstartDate && data.serverModifiedDate <= MatchendDate);
        if (result == true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isDueDateSelected == true) {
        if (data?.serverDueDate != undefined) {
          let result = (data?.serverDueDate && data.serverDueDate >= MatchstartDate && data.serverDueDate <= MatchendDate);
          if (result == true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isCreatedDateSelected == false && Config?.configurationData[0]?.isModifiedDateSelected == false && Config?.configurationData[0]?.isDueDateSelected == false) {
        return true;
        // if (data?.serverDueDate != undefined || data.serverModifiedDate != undefined || data.serverCreatedDate != undefined) {
        //   let result = ((data?.serverDueDate && data.serverDueDate >= MatchstartDate && data.serverDueDate <= MatchendDate) || (data?.serverModifiedDate && data.serverModifiedDate >= MatchstartDate && data.serverModifiedDate <= MatchendDate)
        //     || (data?.serverCreatedDate && data.serverCreatedDate >= MatchstartDate && data.serverCreatedDate <= MatchendDate));
        //   if (result == true) {
        //     return true;
        //   }
        // }
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  const FilterDataOnCheck = function (Config: any) {
    let portFolio: any[] = [];
    let site: any[] = [];
    let type: any[] = [];
    let teamMember: any[] = [];
    let priorityType: any[] = [];
    let percentComplete: any[] = [];
    let clientCategory: any[] = [];
    let Categories: any[] = [];
    Config?.configurationData[0]?.filterGroupsData.forEach(function (filter: any) {
      if (filter.Title == 'Portfolio Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (port: any) { return portFolio.push(port); });
      }
      else if (filter.Title == 'Task Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (elem1: any) { return type.push(elem1); });
      }

      if (filter.Title == 'Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter?.checkedObj?.map((elem: any) => {
          if (elem.TaxType == 'Task Types') {
            portFolio.push(elem);
          } else if (elem.TaxType == 'Type') {
            type.push(elem);
          }
        })
      }
      else if (filter.Title == 'Categories' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (elem2: any) { return Categories.push(elem2); });
      }
      else if (filter.Title == 'Priority' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (elem3: any) {
          if (elem3.Title != '(1) High' && elem3.Title != '(2) Normal' && elem3.Title != '(3) Low') {
            elem3.Title = parseInt(elem3.Title);
          }
          priorityType.push(elem3);
        });
      }
      else if (filter.Title == 'Status' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (elem4: any) {
          if (elem4.Title) {
            const match = elem4.Title.match(/(\d+)%/);
            if (match) {
              elem4.TaskStatus = parseInt(match[1]);
            }
          }
          return percentComplete.push(elem4);
        });
      }
    });
    if (Config?.configurationData[0]?.allFilterClintCatogryData.length > 0) {
      clientCategory = Config?.configurationData[0]?.allFilterClintCatogryData.reduce((acc: any, item: any) => [...acc, ...item.checkedObj], []);
    }
    if (Config?.configurationData[0]?.allStites.length > 0) {
      site = Config?.configurationData[0]?.allStites.reduce((acc: any, item: any) => [...acc, ...item.checkedObj], []);
    }
    if (Config?.configurationData[0]?.TaskUsersData.length > 0) {
      teamMember = Config?.configurationData[0]?.TaskUsersData.reduce((acc: any, item: any) => [...acc, ...item.checkedObj], []);
      if (Config?.configurationData[0]?.isCreatedBy == true) { teamMember.push(Config?.configurationData[0]?.isCreatedBy) } else if (Config?.configurationData[0]?.isModifiedby == true) { teamMember.push(Config?.configurationData[0]?.isModifiedby) } else if (Config?.configurationData[0]?.isAssignedto == true) { teamMember.push(Config?.configurationData[0]?.isAssignedto) }
    }
    let filteredMasterTaskData: any = []
    if (portFolio.length > 0) {
      filteredMasterTaskData = AllMasterTasks.filter((data: any) =>
        updatedCheckMatch(data, 'Item_x0020_Type', 'Title', portFolio) &&
        updatedCheckClintCategoryMatch(data, clientCategory) &&
        updatedCheckTeamMembers(data, teamMember, Config) &&
        updatedCheckDateSection(data, Config?.configurationData[0]?.startDate, Config?.configurationData[0]?.endDate, Config, Config?.configurationData[0]?.selectedFilter)
      );
    }
    let filteredTaskData: any = [];
    if (type.length > 0) {
      filteredTaskData = allData.filter((data: any) =>
        updatedCheckMatch(data, 'siteType', 'Title', site) &&
        updatedCheckTaskType(data, type) &&
        updatedCheckProjectMatch(data, Config?.configurationData[0]?.selectedProject) &&
        updatedCheckMatch(data, 'percentCompleteValue', 'TaskStatus', percentComplete) &&
        updatedCheckClintCategoryMatch(data, clientCategory) &&
        updatedCheckCategoryMatch(data, Categories) &&
        updatedCheckTeamMembers(data, teamMember, Config) &&
        updatedCheckDateSection(data, Config?.configurationData[0]?.startDate, Config?.configurationData[0]?.endDate, Config, Config?.configurationData[0]?.selectedFilter) &&
        updatedCheckPriority(data, priorityType)
      );
    }
    let allFinalResult = filteredMasterTaskData.concat(filteredTaskData);
    Config.Tasks = allFinalResult
  };
  /*End here*/
  return (
    <>
      {progressBar && <PageLoader />}
      <myContextValue.Provider value={{ ...myContextValue, smartmetaDataDetails: smartmetaDataDetails, CurrentUserProjectData: CurrentUserProjectData, CurrentUserInfo: CurrentUserInfo, CurrentUserWorkingToday: CurrentUserWorkingToday, currentUserId: currentUserId, todaysDrafTimeEntry: todaysDrafTimeEntry, CurrentConfigItem: CurrentConfigItem, AllTimeEntry: AllTimeEntry, DataRange: dates, AllMetadata: smartmetaDataDetails, DashboardId: DashboardId, DashboardTitle: DashboardTitle, DashboardValue: DashboardValue, GroupByUsers: GroupByUsers, ActiveTile: ActiveTile, approverEmail: approverEmail, propsValue: props.props, currentTime: currentTime, siteUrl: props?.props?.siteUrl, AllSite: AllSite, currentUserData: currentUserData, AlltaskData: data, timesheetListConfig: timesheetListConfig, AllMasterTasks: AllMasterTasks, AllTaskUser: taskUsers, DashboardConfig: DashboardConfig, DashboardConfigBackUp: DashboardConfigBackUp, callbackFunction: callbackFunction }}>
        <div>
          {LoadHeaderSection != undefined && (<Header />)}
        </div>
        {IsCallContext == true && <TaskStatusTbl />}
      </myContextValue.Provider >
    </>
  );
};
export default EmployeProfile;