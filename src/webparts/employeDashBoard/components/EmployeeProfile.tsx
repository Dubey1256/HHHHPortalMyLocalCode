import React, { useEffect, useContext, useState } from 'react'; Moment
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { myContextValue } from '../../../globalComponents/globalCommon'
import Header from './HeaderSection';
import TaskStatusTbl from './TaskStausTable';
import * as Moment from "moment";
import PageLoader from '../../../globalComponents/pageLoader';
import { map } from "jquery";
//import { Filter } from '../../../globalComponents/GlobalCommanTable';

var taskUsers: any;
let GroupByUsers: any = [];
let AllMasterTasks: any[] = [];
var currentUserData: any = {};
let DashboardConfig: any = [];
let DashboardConfigBackUp: any = [];
let allData: any = [];
let LoginUserTeamMembers: any = [];
let ActiveTile = ''
let DashboardTitle: any = '';
let timeSheetConfig: any = {};
let TimeSheetLists: any = [];
let dates: any = [];
let AllTimeEntry: any = [];
const EmployeProfile = (props: any) => {
  const params = new URLSearchParams(window.location.search);
  let DashboardId: any = params.get('DashBoardId');
  const [progressBar, setprogressBar] = useState(true)
  const [AllSite, setAllSite] = useState([]);
  const [data, setData]: any = React.useState({ AllTaskUser: [] });
  const [currentTime, setCurrentTime]: any = useState([]);
  const [annouceMents, setAnnouceMents]: any = useState([]);
  const [approverEmail, setApproverEmail]: any = useState([]);
  const [timesheetListConfig, setTimesheetListConfig] = React.useState<any>()
  const [smartmetaDataDetails, setSmartmetaDataDetails] = React.useState([])
  const [IsCallContext, setIsCallContext] = React.useState(false)
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
    loadTaskUsers();
    annouceMent();
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
    let allSites = smartmetaDataDetails.filter((e) => e.TaxType === "Sites")
    AllTimeEntries?.forEach((entry: any) => {
      allSites.forEach((site) => {
        const taskTitle = `Task${site.Title}`;
        const key = taskTitle + entry[taskTitle]?.Id
        if (entry.hasOwnProperty(taskTitle) && entry.AdditionalTimeEntry !== null && entry.AdditionalTimeEntry !== undefined) {
          if (entry[taskTitle].Id === 168) {
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
    smartmetaDetails = await web.lists.getById(props.props?.SmartMetadataListID).items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
      .top(4999).expand("Parent").get();
    smartmetaDetails?.map((newtest: any) => {
      // if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
      if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
        newtest.DataLoadNew = false;
      if (newtest?.TaxType == 'timesheetListConfigrations') {
        timeSheetConfig = newtest;
        TimeSheetLists = JSON.parse(timeSheetConfig?.Configurations)
      }
    })
    setSmartmetaDataDetails(smartmetaDetails);
  };
  const addHighestColumnToObject = (obj: any, array: any) => {
    const { Row } = obj.WebpartPosition;
    let highestColumn = -1;
    array.forEach((item: any) => {
      const { WebpartPosition } = item;
      if (WebpartPosition.Row === Row && WebpartPosition.Column > highestColumn)
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
      DashboardTitle = data?.Title
      DashboardConfig = globalCommon.parseJSON(data?.Configurations)
      DashboardConfig = DashboardConfig.sort((a: any, b: any) => {
        if (a.WebpartPosition.Row === b.WebpartPosition.Row)
          return a.WebpartPosition.Column - b.WebpartPosition.Column;
        return a.WebpartPosition.Row - b.WebpartPosition.Row;
      });
      DashboardConfigBackUp = JSON.parse(JSON.stringify(DashboardConfig));
      DashboardConfig.forEach((config: any) => {
        if (config?.AdditonalHeader != undefined && config?.AdditonalHeader === true)
          ActiveTile = config?.TileName
        config.highestColumn = addHighestColumnToObject(config, DashboardConfig)
      })
      if (DashboardConfig != undefined && DashboardConfig?.length > 0) {
        DashboardConfig.map(async (item: any) => {
          item.configurationData = []
          if (item?.smartFevId != undefined && item?.smartFevId != '') {
            try {
              const results = await web.lists.getById(props?.props?.AdminConfigurationListId).items.getById(parseInt(item?.smartFevId)).select('Id', 'Title', 'Value', 'Key', 'Description', 'DisplayTitle', 'Configurations').get()
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
            } catch (error) {
              console.log(error);
            }
          }
        })
        if (IsLoadTask != false) {
          setprogressBar(true);
          if (Type != false)
            smartTimeTotal();
          else
            getAllData(Type)
        }
      }
    }).catch((err: any) => {
      console.log(err);
    })
  }
  const loadMasterTask = () => {
    globalCommon.GetServiceAndComponentAllData(props?.props).then((data: any) => {
      AllMasterTasks = data?.AllData;
      AllMasterTasks = AllMasterTasks.concat(data?.ProjectData)
      AllMasterTasks?.map((items: any) => {
        items.descriptionsSearch = '';
        items.SiteIconTitle = items?.Item_x0020_Type == "Sprint" ? "X" : items?.Item_x0020_Type.charAt(0);
        if (items?.FeedBack != undefined && Array.isArray(items?.FeedBack)) {
          let DiscriptionSearchData: any = '';
          let feedbackdata: any = JSON.parse(items?.FeedBack)
          DiscriptionSearchData = feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
            const childText = child?.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '');
            const subtextText = (child?.Subtext || [])?.map((elem: any) => elem.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '')).join('');
            return childText + subtextText;
          }).join('');
          items.descriptionsSearch = DiscriptionSearchData
        }
        let EstimatedDesc: any = [];
        items.EstimatedTime = 0;
        if (items?.EstimatedTimeDescription != undefined && items?.EstimatedTimeDescription != '' && items?.EstimatedTimeDescription != null) {
          EstimatedDesc = JSON.parse(items?.EstimatedTimeDescription)
        }
        if (items?.WorkingAction != undefined && items?.WorkingAction != '' && items?.WorkingAction != null) {
          items.WorkingAction = JSON.parse(items?.WorkingAction)
        }
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
  const annouceMent = async () => {
    const web = new Web(props.props?.siteUrl);
    await web.lists.getById(props?.props?.Announcements).items.select("Title", "ID", "Body", "isShow").filter("isShow eq 1").getAll().then(async (data: any) => {
      setAnnouceMents(data)
    }).catch((err: any) => {
      console.log(err);
    })
  }
  const smartMetaData = async () => {
    var AllsiteData: any = []
    var timesheetListConfig = await globalCommon?.loadSmartMetadata(props?.props, 'timesheetListConfigrations')
    setTimesheetListConfig(timesheetListConfig)
    AllsiteData = await globalCommon?.loadSmartMetadata(props?.props, 'Sites')
    AllsiteData = AllsiteData?.filter((item: any) => item.Title != "" && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Title != "Offshore Tasks" && item.Configurations != null)
    setAllSite(AllsiteData)
  };
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
  const loadTaskUsers = async () => {
    try {
      taskUsers = await globalCommon.loadAllTaskUsers(props?.props);
      let mailApprover: any;
      let currentUserId: any = props?.props?.Context?.pageContext?.legacyPageContext?.userId
      taskUsers?.map((item: any) => {
        item.Tasks = [];
        item.IsShowTask = false;
        if (item.UserGroupId == undefined) {
          getChilds(item, taskUsers);
          GroupByUsers.push(item);
        }
        if (currentUserId == item?.AssingedToUser?.Id && currentUserId != undefined) {
          currentUserData = item;
          if (item?.Approver?.length > 0 && item?.Approver?.length != undefined && item?.Approver?.length != null)
            mailApprover = item?.Approver[0];
          else
            mailApprover = null;
          smartMetaData()
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
    const user = taskUsers.filter((user: any) => user?.AssingedToUser?.Id === name);
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
      if (item.Id === Id) {
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
    const filteredConfig = DashboardConfig.filter((item: any) => item.DataSource === 'TimeSheet')[0];
    DashboardConfig?.forEach((config: any) => {
      if (config?.Tasks == undefined)
        config.Tasks = [];
      if (config?.DataSource == 'Tasks' || config?.DataSource == 'Project') {
        if (config?.selectFilterType != 'custom') {
          if (config?.smartFevId != undefined && config?.smartFevId != '' && config?.isShowEveryone === false && currentUserData?.AssingedToUser?.Id == config?.CurrentUserID) {
            config.LoadDefaultFilter = false;
            FilterDataOnCheck(config);
          }
          else if (config?.smartFevId != undefined && config?.smartFevId != '' && config?.isShowEveryone === true) {
            config.LoadDefaultFilter = false;
            FilterDataOnCheck(config);
          }
        }
        else if (config?.selectFilterType == 'custom') {
          config.LoadDefaultFilter = false;
          if (config?.DataSource == 'Tasks') {
            if (Array.isArray(array) && array.length > 0) {
              if (config['selectUserFilterType'] && !config['FilterType']) {
                array.filter(item => item?.PercentComplete == config?.Status && Array.isArray(item[config['selectUserFilterType']])).forEach(task => {
                  if (task[config['selectUserFilterType']].some((AssignUser: any) => AssignUser.Id === currentUserData?.AssingedToUser?.Id)) {
                    config.Tasks.push(task);
                  }
                });
              }
              if (!config['selectUserFilterType'] && !config['FilterType']) {
                config.Tasks = array.filter((item: any) => item?.PercentComplete == config?.Status);
              }
              if (config['FilterType']) {
                if (config['FilterType'] == 'Priority') {
                  config.Tasks = array.filter((item: any) => item?.PriorityRank == config?.Status);
                }
                if (config['FilterType'] == 'Sites') {
                  config.Tasks = array.filter((item: any) => item?.siteType == config?.Status);
                }
                if (config['FilterType'] == 'Actions') {
                  if (Array.isArray(array) && array.length) {
                    array.forEach((task: any) => {
                      if (task?.WorkingAction?.length) {
                        task?.WorkingAction?.forEach((Action: any) => {
                          if (Action?.Title != undefined && config?.Status != undefined && Action?.Title == config?.Status) {
                            if ((config?.UserId == undefined || config?.UserId == '') && !isTaskItemExists(config.Tasks, task))
                              config.Tasks.push(task);
                            if (config?.UserId != undefined && config?.UserId != '' && Action?.InformationData?.length) {
                              Action?.InformationData?.map((UserInfo: any) => {
                                if (UserInfo?.TaggedUsers?.AssingedToUserId != undefined && config?.UserId == UserInfo?.TaggedUsers?.AssingedToUserId && !isTaskItemExists(config.Tasks, task)) {
                                  config.Tasks.push(task);
                                }
                              })
                            }
                          }
                        });
                      }
                    });
                  }
                }
                if (config['FilterType'] == 'Categories') {
                  if (config?.Status && Array.isArray(array) && array.length) {
                    config.Status.forEach((FilterCat: any) => {
                      array.forEach((task: any) => {
                        if (task?.TaskCategories?.length) {
                          task.TaskCategories.forEach((category: any) => {
                            if (category?.Id && FilterCat?.Id && category.Id === FilterCat.Id && !isTaskItemExists(config.Tasks, task)) {
                              config.Tasks.push(task);
                            }
                          });
                        }
                      });
                    });
                  }
                }
              }
            }
          }
          if (config?.DataSource == 'Project') {
            if (Array.isArray(AllMasterTasks) && AllMasterTasks.length > 0) {
              let filteredProject = AllMasterTasks.filter((item: any) => item.Item_x0020_Type == 'Project');
              filteredProject.filter(item => item?.PercentComplete == config?.Status && Array.isArray(item[config['selectUserFilterType']])).forEach(task => {
                if (task[config['selectUserFilterType']].some((AssignUser: any) => AssignUser.Id === currentUserData?.AssingedToUser?.Id)) {
                  config.Tasks.push(task);
                }
              });
            }
          }
        }
        if (filteredConfig == undefined || filteredConfig == '')
          setIsCallContext(true);
      }
      else if (config?.DataSource == 'TaskUsers') {
        if (config?.selectFilterType != 'custom') {
          config.LoadDefaultFilter = false;
          config.Tasks = GroupByUsers.filter((User: any) => User?.Id == config?.smartFevId);
        }
        else if (config?.selectFilterType == 'custom') {
          config.LoadDefaultFilter = false;
          taskUsers?.map((item: any) => {
            if (item[config['Status']] != undefined && Array.isArray(item[config['Status']]) && item[config['Status']]?.length > 0) {
              item[config['Status']].forEach((teamMember: any) => {
                if (teamMember?.Id === props?.props?.Context?.pageContext?.legacyPageContext?.userId && !isTaskUserExist(LoginUserTeamMembers, item) && item?.ItemType != 'Group')
                  LoginUserTeamMembers.push(item)
              })
            }
            else if (item[config['Status']] != undefined && typeof item[config['Status']] === 'object' && item[config['Status']] !== null) {
              if ((item[config['Status']]?.Id == props?.props?.Context?.pageContext?.legacyPageContext?.userId || item[config['Status']]?.Id == currentUserData?.Id) && !isTaskUserExist(LoginUserTeamMembers, item) && item?.ItemType != 'Group')
                LoginUserTeamMembers.push(item)
            }
          })
          if (!isTaskUserExist(LoginUserTeamMembers, currentUserData))
            LoginUserTeamMembers.unshift(currentUserData)
          config.Tasks = LoginUserTeamMembers;
          if (config?.Tasks != undefined && config?.Tasks?.length > 0) {
            config?.Tasks.map((User: any) => {
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
                array.map((Task: any) => {
                  Task.WorkingDate = ''
                  let IsUnAssigedTask: any = true;
                  if (Task?.WorkingAction != undefined && Task?.WorkingAction != '' && Task?.WorkingAction?.length > 0) {
                    Task?.WorkingAction?.map((workingMember: any) => {
                      if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails' && workingMember?.InformationData?.length > 0) {
                        workingMember?.InformationData?.map((workingDetails: any) => {
                          if (workingDetails?.WorkingMember != undefined && workingDetails?.WorkingMember?.length > 0) {
                            workingDetails?.WorkingMember?.forEach((workingUser: any) => {
                              if (Task?.AssignedTo != undefined && Task?.AssignedTo?.length > 0) {
                                Task?.AssignedTo?.forEach((assign: any) => {
                                  if (assign.Id != undefined && User.AssingedToUserId != undefined && assign.Id === User.AssingedToUserId && assign.Id == workingUser?.Id) {
                                    IsUnAssigedTask = false
                                  }
                                })
                              }
                              if (User.AssingedToUserId != undefined && workingUser?.Id === User.AssingedToUserId) {
                                Task.WorkingDate += workingDetails?.WorkingDate + ' | '
                              }
                            })
                          }
                        })
                        let CopyTask = { ...Task }
                        workingMember?.InformationData?.map((workingDetails: any) => {
                          if (workingDetails?.WorkingMember != undefined && workingDetails?.WorkingMember?.length > 0) {
                            let WorkingDate: any = Moment(workingDetails.WorkingDate, 'DD/MM/YYYY');
                            WorkingDate?._d.setHours(0, 0, 0, 0)
                            workingDetails?.WorkingMember?.forEach((workingUser: any) => {
                              if (User.AssingedToUserId != undefined && workingUser?.Id === User.AssingedToUserId && Date.ServerDate?.getTime() == WorkingDate?._d.getTime() && !isTaskItemExists(Date.Tasks, Task)) {
                                Date.Tasks.push(CopyTask)
                                Date.TotalTask += 1;
                                Date.TotalEstimatedTime += Task?.EstimatedTime;
                              }
                              if (User.AssingedToUserId != undefined && workingUser?.Id === User.AssingedToUserId && !isTaskItemExists(User.Tasks, Task)) {
                                if (User?.Tasks == undefined)
                                  User.Tasks = [];
                                User.Tasks.push(CopyTask)
                                User.TotalTask += 1;
                                User.TotalEstimatedTime += Task?.EstimatedTime;
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                  if (IsUnAssigedTask == true && Date?.DisplayDate == 'Un-Assigned') {
                    if (Task?.AssignedTo != undefined && Task?.AssignedTo?.length > 0) {
                      Task?.AssignedTo?.forEach((assign: any) => {
                        if (assign.Id != undefined && User.AssingedToUserId != undefined && assign.Id === User.AssingedToUserId && !isTaskItemExists(User?.Tasks, Task)) {
                          let CopyTask = { ...Task }
                          CopyTask.WorkingDate = '';
                          Date.Tasks.push(CopyTask)
                          Date.TotalTask += 1;
                          Date.TotalEstimatedTime += Task?.EstimatedTime;
                        }
                      })
                    }
                  }
                })
              })
              // array.map((Task: any) => {
              //   if (Task?.AssignedTo != undefined && Task?.AssignedTo?.length > 0) {
              //     Task?.AssignedTo?.forEach((assign: any) => {
              //       if (assign.Id != undefined && User.AssingedToUserId != undefined && assign.Id === User.AssingedToUserId && Task.IsTodaysTask === true && !isTaskItemExists(User?.Tasks, Task)) {
              //         User.Tasks.push(Task);
              //         User.TotalTask += 1;
              //         User.TotalEstimatedTime += Task?.EstimatedTime;
              //       }
              //     })
              //   }
              // })
            })
          }
        }
        if (filteredConfig == undefined || filteredConfig == '')
          setIsCallContext(true);
      }
      else if (config?.DataSource == 'TimeSheet') {
        config.LoadDefaultFilter = false;
        let CurrentDate = new Date();
        CurrentDate.setHours(0, 0, 0, 0)
        let arraycount = 0;
        let TempArray: any = []
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
                          if (TimeEntry?.sortTaskDate != undefined && CurrentDate != undefined && CurrentDate.getTime() == TimeEntry?.sortTaskDate.getTime() && TimeEntry?.Status == 'For Approval') {
                            TempArray.push(TimeEntry)
                            if (!isItemExists(AllTimeEntry, entry.Id))
                              AllTimeEntry.push(entry);
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
                if (arraycount === currentCount) {
                  let TeamMember: any = []
                  taskUsers?.map((item: any) => {
                    if (item[config['Status']] != undefined && Array.isArray(item[config['Status']]) && item[config['Status']]?.length > 0) {
                      item[config['Status']].forEach((teamMember: any) => {
                        if (teamMember?.Id === props?.props?.Context?.pageContext?.legacyPageContext?.userId && !isTaskUserExist(TeamMember, item) && item?.ItemType != 'Group')
                          TeamMember.push(item)
                      })
                    }
                    else if (item[config['Status']] != undefined && typeof item[config['Status']] === 'object' && item[config['Status']] !== null) {
                      if ((item[config['Status']]?.Id == props?.props?.Context?.pageContext?.legacyPageContext?.userId || item[config['Status']]?.Id == currentUserData?.Id) && !isTaskUserExist(TeamMember, item) && item?.ItemType != 'Group')
                        TeamMember.push(item)
                    }
                  })
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
    })
    let todayDate: any = new Date();
    const currentDate = todayDate;
    currentDate.setDate(today.getDate());
    currentDate.setHours(0, 0, 0, 0);
    array?.forEach((items: any) => {
      DashboardConfig?.forEach((config: any) => {
        if (config?.Tasks == undefined)
          config.Tasks = []
        if (config?.LoadDefaultFilter != false) {
          if (config?.IsDraftTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsDraftTask.toLowerCase()) > -1 && items.Author?.Id == currentUserData?.AssingedToUser?.Id && !isTaskItemExists(config?.Tasks, items)) {
            config?.Tasks.push(items);
          }

          if (items?.WorkingAction != undefined && items?.WorkingAction?.length > 0) {
            items?.WorkingAction?.map((workingDetails: any) => {
              if (config?.IsBottleneckTask != undefined && workingDetails?.Title != undefined && workingDetails?.InformationData != undefined && workingDetails?.Title === config?.IsBottleneckTask && workingDetails?.InformationData.length > 0) {
                workingDetails?.InformationData?.map((botteleckInfo: any) => {
                  if (botteleckInfo?.TaggedUsers != undefined && botteleckInfo?.TaggedUsers?.AssingedToUserId != undefined && botteleckInfo?.TaggedUsers?.AssingedToUserId == currentUserData?.AssingedToUser?.Id && !isTaskItemExists(config?.Tasks, items)) {
                    config?.Tasks.push(items);
                  }
                })
              }
              if (config?.IsTodaysTask != undefined && workingDetails?.Title != undefined && workingDetails?.InformationData != undefined && workingDetails?.Title === "WorkingDetails" && workingDetails?.InformationData.length > 0) {
                workingDetails?.InformationData?.map((workingTask: any) => {
                  if (workingTask?.WorkingMember != undefined && workingTask?.WorkingMember?.length > 0) {
                    workingTask?.WorkingMember?.map((assign: any) => {
                      let WorkingDate: any = Moment(workingTask?.WorkingDate, 'DD/MM/YYYY');
                      WorkingDate?._d.setHours(0, 0, 0, 0)

                      if (assign != undefined && assign?.Id == currentUserData?.AssingedToUser?.Id && WorkingDate?._d.getTime() == currentDate?.getTime() && !isTaskItemExists(config?.Tasks, items)) {
                        items.WorkingDate = workingTask?.WorkingDate;
                        config?.Tasks.push(items);
                      }
                    })
                  }
                })
              }
            })
          }
          items.AssignedTo?.forEach((assign: any) => {
            if (assign && assign.Id === currentUserData?.AssingedToUser?.Id) {
              // if (config.IsTodaysTask != undefined && items.IsTodaysTask === config.IsTodaysTask && !isTaskItemExists(config?.Tasks, items)) {
              //   config?.Tasks.push(items)
              // }
              if (config?.IsImmediateTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsImmediateTask.toLowerCase()) > -1 && !isTaskItemExists(config?.Tasks, items)) {
                config?.Tasks.push(items);
              }
              else if (config?.IsApprovalTask != undefined && items.percentage == config?.IsApprovalTask && !isTaskItemExists(config?.Tasks, items)) {
                config?.Tasks.push(items);
              }
              else if (config?.IsWorkingWeekTask != undefined && items.workingThisWeek === config?.IsWorkingWeekTask && !isTaskItemExists(config?.Tasks, items)) {
                config?.Tasks.push(items);
              }
              if (config.TileName == 'AssignedTask' && !isTaskItemExists(config?.Tasks, items))
                config?.Tasks.push(items);
            }
          })
        }
      });
    });
    DashboardConfig?.forEach((items: any) => {
      if (items.GroupByView != undefined && items.GroupByView == true) {
        items.Tasks = groupView(items?.Tasks)
      }
    });
    setprogressBar(false);
  }
  const smartTimeUseLocalStorage = () => {
    let timeEntryDataLocalStorage: any = localStorage.getItem('timeEntryIndex')
    if (timeEntryDataLocalStorage?.length > 0) {
      const timeEntryIndexLocalStorage = JSON.parse(timeEntryDataLocalStorage)
      allData?.map((task: any) => {
        task.TotalTaskTime = 0;
        task.timeSheetsDescriptionSearch = "";
        const key = `Task${task?.siteType + task.Id}`;
        if (timeEntryIndexLocalStorage.hasOwnProperty(key) && timeEntryIndexLocalStorage[key]?.Id === task.Id && timeEntryIndexLocalStorage[key]?.siteType === task.siteType) {
          task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime;
          task.timeSheetsDescriptionSearch = timeEntryIndexLocalStorage[key]?.timeSheetsDescriptionSearch;
        }
      })
      console.log("timeEntryIndexLocalStorage", timeEntryIndexLocalStorage)
    }
  };
  const getAllData = async (IsLoad: any) => {
    if (IsLoad != undefined && IsLoad === true) {
      await globalCommon?.loadAllSiteTasks(props?.props, undefined).then((data: any) => {
        data?.map((items: any) => {
          items.descriptionsSearch = '';
          if (items?.FeedBack != undefined && Array.isArray(items?.FeedBack)) {
            let DiscriptionSearchData: any = '';
            let feedbackdata: any = JSON.parse(items?.FeedBack)
            DiscriptionSearchData = feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
              const childText = child?.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '');
              const subtextText = (child?.Subtext || [])?.map((elem: any) => elem.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '')).join('');
              return childText + subtextText;
            }).join('');
            items.descriptionsSearch = DiscriptionSearchData
          }
          let EstimatedDesc: any = [];
          items.EstimatedTime = 0;
          items.EstimatedTimeDescr = '';
          if (items?.EstimatedTimeDescription != undefined && items?.EstimatedTimeDescription != '' && items?.EstimatedTimeDescription != null) {
            EstimatedDesc = JSON.parse(items?.EstimatedTimeDescription)
          }
          if (items?.WorkingAction != undefined && items?.WorkingAction != '' && items?.WorkingAction != null) {
            items.WorkingAction = JSON.parse(items?.WorkingAction)
          }
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
        smartTimeUseLocalStorage()
        MakeFinalData()
      }).catch((err: any) => {
        console.log("then catch error", err);
      });
    }
    else {
      MakeFinalData()
    }

  };
  const callbackFunction = (Type: any) => {
    // getAllData(true)
    LoadAdminConfiguration(true, Type)
  }
  /*smartFavId filter functionaloity*/
  const updatedCheckClintCategoryMatch = (data: any, clientCategory: any) => {
    try {
      if (clientCategory.length === 0) {
        return true;
      }
      if (data?.ClientCategory?.length > 0 && data?.ClientCategory != undefined && data?.ClientCategory != null) {
        let result = data?.ClientCategory?.some((item: any) => clientCategory.some((filter: any) => filter.Title === item.Title));
        if (result === true) {
          return true;
        }
      } else {
        let result = clientCategory.some((filter: any) => filter.Title === "Blank" && data?.ClientCategory?.length == 0)
        if (result === true) {
          return true;
        }
      }
      return false;
    } catch (error) {

    }
  };
  const updatedCheckMatch = (data: any, ItemProperty: any, FilterProperty: any, filterArray: any) => {
    try {
      if (filterArray.length === 0) {
        return true;
      }
      if (Array.isArray(data[ItemProperty])) {
        return data[ItemProperty]?.some((item: any) => filterArray.some((filter: any) => filter.Title === item.Title));
      } else {
        return filterArray.some((filter: any) => filter[FilterProperty] === data[ItemProperty]);
      }
    } catch (error) {

    }
  };
  const updatedCheckCategoryMatch = (data: any, Categories: any) => {
    try {
      if (Categories.length === 0) {
        return true;
      }
      if (data?.TaskCategories?.length > 0 && data?.TaskCategories != undefined && data?.TaskCategories != null) {
        let result = data?.TaskCategories?.some((item: any) => Categories.some((filter: any) => filter.Title === item.Title));
        if (result === true) {
          return true;
        }
      } else {
        let result = Categories.some((filter: any) => filter.Title === "Other" && data?.Categories === null && data?.TaskCategories?.length == 0)
        if (result === true) {
          return true;
        }
      }
      return false;
    } catch (error) {

    }
  };
  const updatedCheckProjectMatch = (data: any, selectedProject: any) => {
    try {
      if (selectedProject?.length === 0) {
        return true;
      }
      if (data?.Project) {
        return selectedProject.some((value: any) => data?.Project?.Id === value.Id);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const updatedCheckTeamMembers = (data: any, teamMembers: any, Config: any) => {
    try {
      if (teamMembers.length === 0) {
        return true;
      }
      if (Config?.configurationData[0]?.isCreatedBy === true) {
        let result = teamMembers.some((member: any) => member.Title === data?.Author?.Title?.replace(/\s+/g, ' '));
        if (result === true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isModifiedby === true) {
        let result = teamMembers.some((member: any) => member.Title === data?.Editor?.Title?.replace(/\s+/g, ' '));
        if (result === true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isAssignedto === true && Config?.configurationData[0]?.isTodaysTask === false) {
        if (data?.AssignedTo.length > 0) {
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
      if (Config?.configurationData[0]?.isTodaysTask === true && Config?.configurationData[0]?.isAssignedto === true || Config?.configurationData[0]?.isTodaysTask === true && Config?.configurationData[0]?.isAssignedto === false) {
        if (data?.IsTodaysTask === true) {
          // let result = data?.AssignedTo?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ') && data?.IsTodaysTask === true));
          let result = data?.AssignedTo?.some((elem2: any) => teamMembers.some((filter: any) => filter?.Id === elem2?.Id && data?.IsTodaysTask === true));
          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isCreatedBy === false && Config?.configurationData[0]?.isModifiedby === false && Config?.configurationData[0]?.isAssignedto === false && Config?.configurationData[0]?.isTeamMember === false && Config?.configurationData[0]?.isTeamLead === false && Config?.configurationData[0]?.isTodaysTask === false) {
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
      if (type?.length === 0) {
        return true;
      }
      if (data?.TaskType) {
        return type.some((value: any) => data?.TaskType?.Title === value.Title);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const updatedCheckPriority = (data: any, priorityType: any) => {
    try {
      if (priorityType?.length === 0) {
        return true;
      }
      if (data.Priority !== undefined && data.Priority !== '' && data.Priority !== null) {
        return priorityType.some((value: any) => value.Title === data.Priority || value.Title === data.PriorityRank);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const updatedCheckDateSection = (data: any, startDate: any, endDate: any, Config: any) => {
    try {
      if (startDate === null && endDate === null) {
        return true;
      }
      startDate = startDate.setHours(0, 0, 0, 0);
      endDate = endDate.setHours(0, 0, 0, 0);
      if (Config?.configurationData[0]?.isCreatedDateSelected === true) {
        let result = (data?.serverCreatedDate && data.serverCreatedDate >= startDate && data.serverCreatedDate <= endDate);
        if (result === true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isModifiedDateSelected === true) {
        let result = (data?.serverModifiedDate && data.serverModifiedDate >= startDate && data.serverModifiedDate <= endDate);
        if (result === true) {
          return true;
        }
      }
      if (Config?.configurationData[0]?.isDueDateSelected === true) {
        if (data?.serverDueDate != undefined) {
          let result = (data?.serverDueDate && data.serverDueDate >= startDate && data.serverDueDate <= endDate);
          if (result === true) {
            return true;
          }
        }
      }
      if (Config?.configurationData[0]?.isCreatedDateSelected === false && Config?.configurationData[0]?.isModifiedDateSelected === false && Config?.configurationData[0]?.isDueDateSelected === false) {
        if (data?.serverDueDate != undefined || data.serverModifiedDate != undefined || data.serverCreatedDate != undefined) {
          let result = ((data?.serverDueDate && data.serverDueDate >= startDate && data.serverDueDate <= endDate) || (data?.serverModifiedDate && data.serverModifiedDate >= startDate && data.serverModifiedDate <= endDate)
            || (data?.serverCreatedDate && data.serverCreatedDate >= startDate && data.serverCreatedDate <= endDate));
          if (result === true) {
            return true;
          }
        }
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
      if (filter.Title === 'Portfolio Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (port: any) { return portFolio.push(port); });
      }
      else if (filter.Title === 'Task Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (elem1: any) { return type.push(elem1); });
      }

      if (filter.Title === 'Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter?.checkedObj?.map((elem: any) => {
          if (elem.TaxType === 'Task Types') {
            portFolio.push(elem);
          } else if (elem.TaxType === 'Type') {
            type.push(elem);
          }
        })
      }
      else if (filter.Title === 'Categories' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (elem2: any) { return Categories.push(elem2); });
      }
      else if (filter.Title === 'Priority' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
        filter.checkedObj.map(function (elem3: any) {
          if (elem3.Title != '(1) High' && elem3.Title != '(2) Normal' && elem3.Title != '(3) Low') {
            elem3.Title = parseInt(elem3.Title);
          }
          priorityType.push(elem3);
        });
      }
      else if (filter.Title === 'Status' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
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
      if (Config?.configurationData[0]?.isCreatedBy === true) { teamMember.push(Config?.configurationData[0]?.isCreatedBy) } else if (Config?.configurationData[0]?.isModifiedby === true) { teamMember.push(Config?.configurationData[0]?.isModifiedby) } else if (Config?.configurationData[0]?.isAssignedto === true) { teamMember.push(Config?.configurationData[0]?.isAssignedto) }
    }
    let filteredMasterTaskData: any = []
    if (portFolio.length > 0) {
      filteredMasterTaskData = AllMasterTasks.filter((data: any) =>
        updatedCheckMatch(data, 'Item_x0020_Type', 'Title', portFolio) &&
        updatedCheckClintCategoryMatch(data, clientCategory) &&
        updatedCheckTeamMembers(data, teamMember, Config) &&
        updatedCheckDateSection(data, Config?.configurationData[0]?.startDate, Config?.configurationData[0]?.endDate, Config)
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
        updatedCheckDateSection(data, Config?.configurationData[0]?.startDate, Config?.configurationData[0]?.endDate, Config) &&
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
      <myContextValue.Provider value={{ ...myContextValue, AllTimeEntry: AllTimeEntry, DataRange: dates, AllMetadata: smartmetaDataDetails, DashboardId: DashboardId, DashboardTitle: DashboardTitle, GroupByUsers: GroupByUsers, ActiveTile: ActiveTile, approverEmail: approverEmail, propsValue: props.props, currentTime: currentTime, annouceMents: annouceMents, siteUrl: props?.props?.siteUrl, AllSite: AllSite, currentUserData: currentUserData, AlltaskData: data, timesheetListConfig: timesheetListConfig, AllMasterTasks: AllMasterTasks, AllTaskUser: taskUsers, DashboardConfig: DashboardConfig, DashboardConfigBackUp: DashboardConfigBackUp, callbackFunction: callbackFunction }}>
        <div> <Header /></div>
        {IsCallContext == true && <TaskStatusTbl />}
      </myContextValue.Provider >
    </>
  );
};
export default EmployeProfile;