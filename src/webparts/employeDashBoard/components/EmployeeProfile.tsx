import React, { useEffect, useContext, useState } from 'react';
import { Web } from 'sp-pnp-js';
import * as globalCommoan from '../../../globalComponents/globalCommon';
import EmployeePieChart from './EmployeePieChart';
import { myContextValue } from '../../../globalComponents/globalCommon'
import WorldClock from './worldclock2';
import Header from './HeaderSection';
import TaskStatusTbl from './TaskStausTable';
import MultipleWebpart from './MutltipleWebpart';
var taskUsers: any
var dataLength: any = [];
var count: number = 0;
var AllData: any = [];
var currentUserData: any
const EmployeProfile = (props: any) => {
  let allData: any = [];

  const [AllSite, setAllSite] = useState([]);
  const [data, setData] = React.useState({ DraftCatogary: [], TodaysTask: [], BottleneckTask: [], ThisWeekTask: [], ImmediateTask: [], ApprovalTask: [] });
  const [currentTime, setCurrentTime]: any = useState([]);
  const [annouceMents, setAnnouceMents]: any = useState([]);
  const [approverEmail, setApproverEmail]: any = useState([]);
  const [timesheetListConfig, setTimesheetListConfig] = React.useState<any>()
  useEffect(() => {
    loadTaskUsers();
    annouceMent();
  }, []);


  const annouceMent = async () => {
    const web = new Web(props.props?.siteUrl);
    await web.lists
      .getById(props?.props?.Announcements)
      .items.select("Title", "ID", "Body")
      .getAll().then(async (data: any) => {
        setAnnouceMents(data)
      }).catch((err: any) => {
        console.log(err);
      })
  }

  const smartMetaData = async () => {
    let sites = [];

    const web = new Web(props.props?.siteUrl);
    await web.lists
      .getById(props?.props?.SmartMetadataListID)
      .items.select("Configurations", "ID", "Title", "TaxType", "listId")
      .filter("TaxType eq 'Sites'or TaxType eq 'timesheetListConfigrations'")
      .getAll().then(async (data: any) => {
        var AllsiteData: any = [];

        var timesheetListConfig = data.filter((data3: any) => {
          if (data3?.TaxType == 'timesheetListConfigrations') {
            return data3;
          }
        });
        setTimesheetListConfig(timesheetListConfig)
        data?.map((item: any) => {
          if (item.TaxType == "Sites") {
            if (item.Title != "DRR" && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Configurations != null) {
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
      })



      .catch((error: any) => {
        console.log(error)
      })


  };
  const loadTaskUsers = async () => {
    // setPageLoader(true)
    let taskUser;
    try {
      let web = new Web(props.props?.siteUrl);
      taskUsers = await web.lists
        .getById(props?.props?.TaskUsertListID)
        .items
        .select("Id,UserGroupId,Suffix,Title,Email,TeamLeader/Id,TeamLeader/Title,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=TeamLeader,AssingedToUser,Approver")
        .get();
      let mailApprover: any;
      taskUsers?.map((item: any) => {
        let currentUserId: any = props?.props?.Context?.pageContext?.legacyPageContext?.userId
        if (currentUserId == item?.AssingedToUser?.Id && currentUserId != undefined) {
          currentUserData = item;
          //  setCurrentUserData(item);
          if (item?.Approver?.length > 0 && item?.Approver?.length != undefined && item?.Approver?.length != null) {
            mailApprover = item?.Approver[0];
          } else {
            mailApprover = null;
          }
          smartMetaData()
        }
        if (mailApprover != undefined && mailApprover != null) {
          if (mailApprover.Id == item.AssingedToUserId && item.Email != undefined && item.Email != null) {
            setApproverEmail(item.Email);
          } else {
            setApproverEmail("");
          }
        } else {
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

  const getAllData = async (ConfigItem: any) => {
    const web = new Web(ConfigItem.siteUrl);
    await web.lists
      .getById(ConfigItem.listId)
      .items.select("Title", "PercentComplete", "Categories", "Portfolio/Id", "Portfolio/ItemType", "Body", "Portfolio/PortfolioStructureID", "Portfolio/Title", "TaskType/Id", "TaskType/Title", "TaskType/Level", "workingThisWeek", 'TaskID', "IsTodaysTask", "Priority", "PriorityRank", "DueDate", "Created", "Modified", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ID", "Responsible_x0020_Team/Id", "Responsible_x0020_Team/Title", "Editor/Title", "Editor/Id", "Author/Title", "Author/Id", "AssignedTo/Id", "AssignedTo/Title")
      .expand("Team_x0020_Members", "Portfolio", "TaskType", "Author", "Editor", "Responsible_x0020_Team", "AssignedTo")
      .top(5000)
      .getAll()
      .then((data: any) => {
        count++;
        data?.map((items: any) => {
          if (items?.Body != undefined) {
            items.descriptionsSearch = items?.Body.replace(
              /(<([^>]+)>)/gi,
              ""
            ).replace(/\n/g, "");
          }
          items.listId = ConfigItem.listId;
          items.site = ConfigItem.Title;
          items.siteType = ConfigItem.Title;
          items.siteUrl = ConfigItem.siteUrl;
          items.percentage = items.PercentComplete * 100 + "%";
          if ((items.TaskType == undefined ? null : items.TaskType.Title) === "Activities") {
            items.TaskID = "A" + items.Id;
          } else if ((items.TaskType == undefined ? null : items.TaskType.Title) === "MileStone") {
            items.TaskID = "M" + items.Id;
          } else if ((items.TaskType == undefined ? null : items.TaskType.Title) === "Project") {
            items.TaskID = "P" + items.Id;
          } else if ((items.TaskType == undefined ? null : items.TaskType.Title) === "Step") {
            items.TaskID = "S" + items.Id;
          } else if ((items.TaskType == undefined ? null : items.TaskType.Title) === "Task") {
            items.TaskID = "T" + items.Id;
          } else if ((items.TaskType == undefined ? null : items.TaskType.Title) === "Workstream") {
            items.TaskID = "W" + items.Id;
          } else {
            items.TaskID = "T" + items.Id;
          }
          items.Team_x0020_Members?.forEach((member: any) => {
            if (member && member.Id === currentUserData.AssingedToUser.Id) {
              items.siteIcon = ConfigItem.ImageUrl;
              allData.push(items);
            }
          });

          items.Responsible_x0020_Team?.forEach((resp: any) => {
            if (resp && resp.Id === currentUserData.AssingedToUser.Id) {
              items.siteIcon = ConfigItem.ImageUrl;
              allData.push(items);
            }
          });

          items.AssignedTo?.forEach((assign: any) => {
            if (assign && assign.Id === currentUserData.AssingedToUser.Id) {
              items.siteIcon = ConfigItem.ImageUrl;
              allData.push(items);
            }
          });
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
          array?.map((items: any) => {
            items.AssignedTo?.forEach((assign: any) => {
              if (assign && assign.Id === currentUserData.AssingedToUser.Id) {
                if (items.Categories?.indexOf('Draft') > -1) {
                  DraftArray.push(items);
                } else if (items.IsTodaysTask === true) {
                  TodaysTask.push(items);
                } else if (items.Categories?.indexOf('Bottleneck') > -1) {
                  BottleneckTask.push(items);
                } else if (items.Categories?.indexOf('Immediate') > -1) {
                  ImmediateTask.push(items);
                } else if (items.workingThisWeek === true) {
                  ThisWeekTask.push(items);
                } else if (items.PercentComplete === 1) {
                  ApprovalTask.push(items);
                }
              }
            });
          });          
          // setCurrentTaskUser(currentUserData);
          setData({ DraftCatogary: DraftArray, TodaysTask: TodaysTask, BottleneckTask: BottleneckTask, ApprovalTask: ApprovalTask, ImmediateTask: ImmediateTask, ThisWeekTask: ThisWeekTask });
        }
      })
      .catch((err: any) => {
        console.log("then catch error", err);
      });
  };

  return (
    <myContextValue.Provider value={{ ...myContextValue, approverEmail: approverEmail, propsValue: props.props, annouceMents: annouceMents, siteUrl: props?.props?.siteUrl, AllSite: AllSite, currentUserData: currentUserData, AlltaskData: data, timesheetListConfig: timesheetListConfig }}>
      <div> <Header /></div>
      <TaskStatusTbl />
      <MultipleWebpart/>
    </myContextValue.Provider>
  );
};

export default EmployeProfile;
