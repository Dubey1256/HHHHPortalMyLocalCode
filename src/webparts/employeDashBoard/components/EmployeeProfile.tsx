import React, { useEffect, useContext, useState } from 'react';
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { myContextValue } from '../../../globalComponents/globalCommon'
import { GlobalConstants } from '../../../globalComponents/LocalCommon';
import Header from './HeaderSection';
import TaskStatusTbl from './TaskStausTable';
import * as Moment from "moment";
import Loader from "react-loader";
var taskUsers: any
var dataLength: any = [];
var count: number = 0;
let AllMasterTasks: any[] = []
var currentUserData: any
let DashboardConfig: any = []
let portfolioColor: any = '#057BD0';
const EmployeProfile = (props: any) => {
  let allData: any = [];
  const params = new URLSearchParams(window.location.search);
  let DashboardId: any = params.get('DashBoardId');
  const [progressBar, setprogressBar] = useState(false)
  const [AllSite, setAllSite] = useState([]);
  const [data, setData]: any = React.useState({ DraftCatogary: [], TodaysTask: [], BottleneckTask: [], AssignedTask: [], ThisWeekTask: [], ImmediateTask: [], ApprovalTask: [], AllTaskUser: [] });
  const [currentTime, setCurrentTime]: any = useState([]);
  const [annouceMents, setAnnouceMents]: any = useState([]);
  const [approverEmail, setApproverEmail]: any = useState([]);
  const [timesheetListConfig, setTimesheetListConfig] = React.useState<any>()
  useEffect(() => {
    LoadAdminConfiguration()
    loadMasterTask();
    loadTaskUsers();
    annouceMent();
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
  const LoadAdminConfiguration = async () => {
    if (DashboardId == undefined || DashboardId == '')
      DashboardId = 1;
    const web = new Web(props.props?.siteUrl);
    await web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").getAll().then(async (data: any) => {
      data = data?.filter((config: any) => config?.Value == DashboardId)[0];
      DashboardConfig = globalCommon.parseJSON(data?.Configurations)
      DashboardConfig = DashboardConfig.sort((a: any, b: any) => {
        if (a.WebpartPosition.Row === b.WebpartPosition.Row)
          return a.WebpartPosition.Column - b.WebpartPosition.Column;
        return a.WebpartPosition.Row - b.WebpartPosition.Row;
      });
      DashboardConfig.forEach((config: any) => {
        config.highestColumn = addHighestColumnToObject(config, DashboardConfig)
      })
    }).catch((err: any) => {
      console.log(err);
    })
  }
  const loadMasterTask = () => {
    let web = new Web(props?.props?.Context?._pageContext?._web.absoluteUrl + "/");
    web.lists.getById(props?.propsValue?.MasterTaskListID).items.select('ComponentCategory/Id', 'PortfolioStructureID', 'Item_x0020_Type', 'PortfolioType/Id', 'PortfolioType/Color', 'PortfolioType/Title', 'Id', 'ValueAdded', 'Idea', 'Sitestagging', 'TechnicalExplanations', 'Short_x0020_Description_x0020_On', 'Short_x0020_Description_x0020__x', 'Short_x0020_description_x0020__x0', 'AdminNotes', 'Background', 'Help_x0020_Information', 'ItemType', 'Title', 'Parent/Id', 'Parent/Title').expand('Parent', 'ComponentCategory', "PortfolioType").orderBy('Modified', false).getAll(4000).then((data: any) => {
      AllMasterTasks = data;
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
    const web = new Web(props.props?.siteUrl);
    await web.lists.getById(props?.props?.SmartMetadataListID).items.select("Configurations", "ID", "Title", "TaxType", "listId").filter("TaxType eq 'Sites'or TaxType eq 'timesheetListConfigrations'").getAll().then(async (data: any) => {
      var AllsiteData: any = [];
      var timesheetListConfig = data.filter((data3: any) => {
        if (data3?.TaxType == 'timesheetListConfigrations')
          return data3;
      });
      setTimesheetListConfig(timesheetListConfig)
      data?.map((item: any) => {
        if (item.TaxType == "Sites") {
          if (item.Title != "DRR" && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Title != "Offshore Tasks" && item.Configurations != null) {
            AllsiteData.push(item)
            let a: any = JSON.parse(item.Configurations);
            a?.map((newitem: any) => {
              dataLength.push(newitem);
              getAllData(newitem);
            });
          }
        }
      });
      setAllSite(AllsiteData)
    }).catch((error: any) => {
      console.log(error)
    })
  };
  const loadTaskUsers = async () => {
    let taskUser;
    try {
      let web = new Web(props.props?.siteUrl);
      taskUsers = await web.lists.getById(props?.props?.TaskUsertListID).items.select("Id,UserGroupId,UserGroup/Title,Suffix,Title,Email,TeamLeader/Id,TeamLeader/Title,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=TeamLeader,UserGroup,AssingedToUser,Approver").get();
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
    }
    catch (error) {
      return Promise.reject(error);
    }
    return taskUser;
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
      if (item.Id == items.Id && item?.siteType.toLowerCase() == items?.siteType.toLowerCase()) {
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
  const getAllData = async (ConfigItem: any) => {
    const web = new Web(ConfigItem.siteUrl);
    await web.lists.getById(ConfigItem.listId).items.select("Title", "PercentComplete", "TaskID", "Categories", "FeedBack", "Portfolio/Id", "Portfolio/ItemType", "Body", "Portfolio/PortfolioStructureID", "Portfolio/Title", "TaskType/Id", "TaskType/Title", "TaskType/Level", "workingThisWeek", 'TaskID', "IsTodaysTask", "Priority", "PriorityRank", "DueDate", "Created", "Modified", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ID", "Responsible_x0020_Team/Id", "Responsible_x0020_Team/Title", "Editor/Title", "Editor/Id", "Author/Title", "Author/Id", "AssignedTo/Id", "AssignedTo/Title", "TaskCategories/Id", "TaskCategories/Title", "ParentTask/Id", "ParentTask/Title", "ParentTask/TaskID")
      .expand("Team_x0020_Members", "Portfolio", "TaskType", "Author", "Editor", "Responsible_x0020_Team", "AssignedTo", "TaskCategories", "ParentTask").getAll().then((data: any) => {
        count++;
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
          items.listId = ConfigItem.listId;
          items.site = ConfigItem.Title;
          items.siteType = ConfigItem.Title;
          items.siteUrl = ConfigItem.siteUrl;
          items.percentage = items.PercentComplete * 100 + "%";
          items.siteIcon = ConfigItem.ImageUrl;
          items.SiteIcon = ConfigItem.ImageUrl;
          items.subRows = [];
          items.isShifted = false;
          items.TaskID = globalCommon.GetTaskId(items);
          items.Team_x0020_Members?.forEach((member: any) => {
            if (member && member.Id === currentUserData.AssingedToUser.Id)
              allData.push(items);
          });
          items.Responsible_x0020_Team?.forEach((resp: any) => {
            if (resp && resp.Id === currentUserData.AssingedToUser.Id)
              allData.push(items);
          });
          items.AssignedTo?.forEach((assign: any) => {
            if (assign && assign.Id === currentUserData.AssingedToUser.Id)
              allData.push(items);
          });
          if (items?.TaskCategories != undefined && items?.TaskCategories.length > 0) {
            items?.TaskCategories.forEach((category: any, index: any) => {
              items.Categories = '';
              if (index == 0)
                items.Categories += category.Title;
              else
                items.Categories += ';' + category.Title;
              if (category?.Title != undefined && category?.Title.toLowerCase() == 'draft' && items.Author?.Id == currentUserData.AssingedToUser.Id && !isTaskItemExists(allData, items)) {
                allData.push(items);
              }
            });
          }
        })
        if (count == dataLength.length) {
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes();
          var dateTime = time;
          setCurrentTime(dateTime)
          const seen = new Set();
          const array: any = allData.filter((item: any) => {
            const keyValue: any = item['Id'];
            if (!seen.has(keyValue)) {
              seen.add(keyValue);
              return true;
            }
            return false;
          });
          let DraftArray: any[] = [];
          let TodaysTask: any = [];
          let BottleneckTask: any = [];
          let ApprovalTask: any = [];
          let ImmediateTask: any = [];
          let ThisWeekTask: any = [];
          let AssignedTask: any = [];
          array?.map((items: any) => {
            DashboardConfig?.map((config: any) => {
              if (config?.Tasks == undefined)
                config.Tasks = []
              if (config?.IsDraftTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsDraftTask.toLowerCase()) > -1 && items.Author?.Id == currentUserData.AssingedToUser.Id) {
                DraftArray.push(items);
                config?.Tasks.push(items);
              }
              items.AssignedTo?.map((assign: any) => {
                if (assign && assign.Id === currentUserData.AssingedToUser.Id) {
                  if (config.IsTodaysTask != undefined && items.IsTodaysTask === config.IsTodaysTask) {
                    TodaysTask.push(items);
                    config?.Tasks.push(items)
                  }
                  else if (config?.IsBottleneckTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsBottleneckTask.toLowerCase()) > -1) {
                    BottleneckTask.push(items);
                    config?.Tasks.push(items);
                  }
                  else if (config?.IsImmediateTask != undefined && items.Categories?.toLowerCase().indexOf(config?.IsImmediateTask.toLowerCase()) > -1) {
                    ImmediateTask.push(items);
                    config?.Tasks.push(items);
                  }
                  else if (config?.IsApprovalTask != undefined && items.percentage == config?.IsApprovalTask) {
                    ApprovalTask.push(items);
                    config?.Tasks.push(items);
                  }
                  else if (config?.IsWorkingWeekTask != undefined && items.workingThisWeek === config?.IsWorkingWeekTask) {
                    ThisWeekTask.push(items);
                    config?.Tasks.push(items);
                  }
                  if (!isTaskItemExists(AssignedTask, items))
                    AssignedTask.push(items);
                  if (config.TileName == 'assignedTask')
                    config?.Tasks.push(items);
                }
              })
            });
          });
          DashboardConfig?.map((items: any) => {
            if (items.GroupByView != undefined && items.GroupByView == true) {
              items.Tasks = groupView(items?.Tasks)
            }
          });
          setData({ DraftCatogary: DraftArray, AssignedTask: AssignedTask, TodaysTask: TodaysTask, BottleneckTask: BottleneckTask, ApprovalTask: ApprovalTask, ImmediateTask: ImmediateTask, ThisWeekTask: ThisWeekTask, AllTaskUser: taskUsers, DashboardConfig: DashboardConfig });
          setprogressBar(true);
        }
      })
      .catch((err: any) => {
        console.log("then catch error", err);
      });
  };
  return (
    <>
      <Loader loaded={progressBar} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color={portfolioColor ? portfolioColor : "#000066"}
        speed={2} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="28%" left="50%" scale={1.0} loadedClassName="loadedContent" />
      <myContextValue.Provider value={{ ...myContextValue, approverEmail: approverEmail, propsValue: props.props, currentTime: currentTime, annouceMents: annouceMents, siteUrl: props?.props?.siteUrl, AllSite: AllSite, currentUserData: currentUserData, AlltaskData: data, timesheetListConfig: timesheetListConfig, AllMasterTasks: AllMasterTasks, AllTaskUser: taskUsers, DashboardConfig: DashboardConfig }}>
        <div> <Header /></div>
        <TaskStatusTbl />
      </myContextValue.Provider>
    </>
  );
};
export default EmployeProfile;