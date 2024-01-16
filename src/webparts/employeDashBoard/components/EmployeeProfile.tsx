import React, { useEffect, useContext, useState } from 'react';
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { myContextValue } from '../../../globalComponents/globalCommon'
import Header from './HeaderSection';
import TaskStatusTbl from './TaskStausTable';
import * as Moment from "moment";
import PageLoader from '../../../globalComponents/pageLoader';
var taskUsers: any;
let AllMasterTasks: any[] = [];
var currentUserData: any;
let DashboardConfig: any = [];
let DashboardConfigBackUp: any = [];
let allData: any = [];
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
  useEffect(() => {
    LoadAdminConfiguration(false)
    loadMasterTask();
    loadTaskUsers();
    annouceMent();
    getAllData(true)
  }, []);
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
  const LoadAdminConfiguration = async (IsLoadTask: any) => {
    if (DashboardId == undefined || DashboardId == '')
      DashboardId = 1;
    const web = new Web(props.props?.siteUrl);
    await web.lists.getById(props?.props?.AdminConfigurtionListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").getAll().then(async (data: any) => {
      data = data?.filter((config: any) => config?.Value == DashboardId)[0];
      DashboardConfig = globalCommon.parseJSON(data?.Configurations)
      DashboardConfig = DashboardConfig.sort((a: any, b: any) => {
        if (a.WebpartPosition.Row === b.WebpartPosition.Row)
          return a.WebpartPosition.Column - b.WebpartPosition.Column;
        return a.WebpartPosition.Row - b.WebpartPosition.Row;
      });
      DashboardConfigBackUp = JSON.parse(JSON.stringify(DashboardConfig));
      DashboardConfig.forEach((config: any) => {
        config.highestColumn = addHighestColumnToObject(config, DashboardConfig)
      })
      if (DashboardConfig != undefined && DashboardConfig?.length > 0) {
        DashboardConfig.map(async (item: any) => {
          item.configurationData = []
          if (item?.smartFevId != undefined && item?.smartFevId != '') {
            try {
              const results = await web.lists.getById(props?.props?.AdminConfigurtionListId).items.getById(parseInt(item?.smartFevId)).select('Id', 'Title', 'Value', 'Key', 'Description', 'DisplayTitle', 'Configurations').get()
              if (results.Configurations !== undefined) {
                item.configurationData = JSON.parse(results.Configurations);
                item.configurationData.map((elem: any) => {
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
          if (IsLoadTask != false) {
            setprogressBar(true);
            getAllData(false)
          }
        })
      }
    }).catch((err: any) => {
      console.log(err);
    })
  }
  const loadMasterTask = () => {
    globalCommon.GetServiceAndComponentAllData(props?.props).then((data: any) => {
      AllMasterTasks = data?.AllData;
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
  const loadTaskUsers = async () => {
    let taskUser;
    try {
      taskUsers = await globalCommon.loadAllTaskUsers(props?.props);
      let mailApprover: any;
      taskUsers?.map((item: any) => {
        let currentUserId: any = props?.props?.Context?.pageContext?.legacyPageContext?.userId
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
  const MakeFinalData = () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = time;
    setCurrentTime(dateTime)
    const array: any = allData
    DashboardConfig?.forEach((config: any) => {
      if (config?.Tasks == undefined)
        config.Tasks = []
      if (config?.smartFevId != undefined && config?.smartFevId != '') {
        FilterDataOnCheck(config);
      }
    })
    array?.forEach((items: any) => {
      DashboardConfig?.forEach((config: any) => {
        if (config?.Tasks == undefined)
          config.Tasks = []
        if (config.smartFevId == undefined || config.smartFevId == '') {
          if (config?.IsDraftTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsDraftTask.toLowerCase()) > -1 && items.Author?.Id == currentUserData.AssingedToUser.Id && !isTaskItemExists(config?.Tasks, items)) {
            config?.Tasks.push(items);
          }
          items.AssignedTo?.forEach((assign: any) => {
            if (assign && assign.Id === currentUserData.AssingedToUser.Id) {
              if (config.IsTodaysTask != undefined && items.IsTodaysTask === config.IsTodaysTask && !isTaskItemExists(config?.Tasks, items)) {
                config?.Tasks.push(items)
              }
              else if (config?.IsBottleneckTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsBottleneckTask.toLowerCase()) > -1 && !isTaskItemExists(config?.Tasks, items)) {
                config?.Tasks.push(items);
              }
              else if (config?.IsImmediateTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsImmediateTask.toLowerCase()) > -1 && !isTaskItemExists(config?.Tasks, items)) {
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
  const getAllData = async (IsLoad: any) => {
    if (IsLoad != undefined && IsLoad === true) {
      await globalCommon?.loadAllSiteTasks(props?.props, undefined).then((data: any) => {
        data?.map((items: any) => {
          items.descriptionsSearch = '';
          if (items?.FeedBack != undefined) {
            let DiscriptionSearchData: any = '';
            let feedbackdata: any = JSON.parse(items?.FeedBack)
            DiscriptionSearchData = feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
              const childText = child?.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '');
              const subtextText = (child?.Subtext || [])?.map((elem: any) => elem.Title?.replace(/(<([^>]+)>)/gi, '')?.replace(/\n/g, '')).join('');
              return childText + subtextText;
            }).join('');
            items.descriptionsSearch = DiscriptionSearchData
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
          items.percentage = items.PercentComplete + "%";
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
        MakeFinalData()
      }).catch((err: any) => {
        console.log("then catch error", err);
      });
    }
    else {
      MakeFinalData()
    }
  };
  const callbackFunction = () => {
    LoadAdminConfiguration(true)
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
      <myContextValue.Provider value={{ ...myContextValue, approverEmail: approverEmail, propsValue: props.props, currentTime: currentTime, annouceMents: annouceMents, siteUrl: props?.props?.siteUrl, AllSite: AllSite, currentUserData: currentUserData, AlltaskData: data, timesheetListConfig: timesheetListConfig, AllMasterTasks: AllMasterTasks, AllTaskUser: taskUsers, DashboardConfig: DashboardConfig, DashboardConfigBackUp: DashboardConfigBackUp, callbackFunction: callbackFunction }}>
        <div> <Header /></div>
        <TaskStatusTbl />
      </myContextValue.Provider>
    </>
  );
};
export default EmployeProfile;