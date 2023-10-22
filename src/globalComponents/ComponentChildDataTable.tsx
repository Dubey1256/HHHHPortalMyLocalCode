import * as React from "react";
import * as $ from "jquery";
import * as Moment from "moment";
import { FaCompressArrowsAlt } from "react-icons/fa";
import pnp, { Web, sp } from "sp-pnp-js";
import { map } from "jquery";
import * as globalCommon from "../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../globalComponents/ShowTaskTeamMembers";
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightableCell from "../globalComponents/GroupByReactTableComponents/highlight";
import Loader from "react-loader";
import ShowClintCatogory from "../globalComponents/ShowClintCatogory";
import ReactPopperTooltip from "../globalComponents/Hierarchy-Popper-tooltip";
import GlobalCommanTable, {
  IndeterminateCheckbox
} from "../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from "../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import PageLoader from "../globalComponents/pageLoader";

var filt: any = "";
var ContextValueGlobal: any = {};
let AllSiteTasksDataGlobal: any = [];
let isUpdatedGlobal: any = "";
let componentDataGlobal: any = [];
let childRefdataGlobal: any;
let timeSheetConfigGlobal: any = {}
let portfolioColorGlobal: any = "";
let ProjectDataGlobal: any = [];
let copyDtaArrayGlobal: any = [];
let renderDataGlobal: any = [];
let countAllTasksDataGlobal: any = [];
let countAllComposubDataGlobal: any = [];
let countsrunGlobal = 0;
let countGlobal = 1;
function ComponentChildDataTable(SelectedProp: any) {
  const usedFor = SelectedProp.usedFor;
  const childRef = React.useRef<any>();
  if (childRef != null) {
    childRefdataGlobal = { ...childRef };
  }
  try {
    if (SelectedProp?.NextProp != undefined) {
      SelectedProp.NextProp.isShowTimeEntry = JSON.parse(
        SelectedProp?.NextProp?.TimeEntry
      );

      SelectedProp.NextProp.isShowSiteCompostion = JSON.parse(
        SelectedProp?.NextProp?.SiteCompostion
      );
    }
  } catch (e) {
    console.log(e);
  }
  ContextValueGlobal = SelectedProp?.NextProp;

  const refreshData = () => setData(() => renderDataGlobal);
  const [loaded, setLoaded] = React.useState(false);
  const [siteConfig, setSiteConfig] = React.useState([]);
  const [data, setData] = React.useState([]);
  copyDtaArrayGlobal = data;
  const [AllUsers, setTaskUser] = React.useState([]);
  const [AllMetadata, setMetadata] = React.useState([]);
  const [AllClientCategory, setAllClientCategory] = React.useState([]);
  const [IsUpdated, setIsUpdated] = React.useState("");
  const [checkedList, setCheckedList] = React.useState<any>({});
  // const [AllSiteTasksDataGlobal, setAllSiteTasksData] = React.useState([]);
  const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
  const [portfolioTypeData, setPortfolioTypeData] = React.useState([]);
  const [taskTypeData, setTaskTypeData] = React.useState([]);
  const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
  const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
  const [OpenAddStructurePopup, setOpenAddStructurePopup] =
    React.useState(false);
  const [ActivityPopup, setActivityPopup] = React.useState(false);
  const [isOpenActivity, setIsOpenActivity] = React.useState(false);
  const [isOpenWorkstream, setIsOpenWorkstream] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState("");
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [checkedList1, setCheckedList1] = React.useState([]);
  const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] =
    React.useState<any>([
      { Title: "Component", Suffix: "C", Level: 1 },
      { Title: "SubComponent", Suffix: "S", Level: 2 },
      { Title: "Feature", Suffix: "F", Level: 3 }
    ]);
  let ComponetsData: any = {};
  let Response: any = [];
  let props = undefined;
  let AllTasks: any = [];
  let AllComponetsData: any = [];

  let TaskUsers: any = [];
  let TasksItem: any = [];


  // Load all time entry for smart time 




  // load all time entry end  

  const getTaskUsers = async () => {
    let web = new Web(ContextValueGlobal.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      .getById(ContextValueGlobal.TaskUsertListID)
      .items.select(
        "Id",
        "Email",
        "Suffix",
        "Title",
        "Item_x0020_Cover",
        "AssingedToUser/Title",
        "AssingedToUser/Id",
        "AssingedToUser/Name",
        "UserGroup/Id",
        "ItemType"
      )
      .expand("AssingedToUser", "UserGroup")
      .get();
    Response = taskUsers;
    TaskUsers = Response;
    setTaskUser(Response);
    console.log(Response);
  };

  const getPortFolioType = async () => {
    let web = new Web(ContextValueGlobal.siteUrl);
    let PortFolioType = [];
    PortFolioType = await web.lists
      .getById(ContextValueGlobal.PortFolioTypeID)
      .items.select("Id", "Title", "Color", "IdRange")
      .get();
    setPortfolioTypeData(PortFolioType);
  };
  const getTaskType = async () => {
    let web = new Web(ContextValueGlobal.siteUrl);
    let taskTypeData = [];
    let typeData: any = [];
    taskTypeData = await web.lists
      .getById(ContextValueGlobal.TaskTypeID)
      .items.select("Id", "Level", "Title", "SortOrder")
      .get();
    setTaskTypeData(taskTypeData);
    if (taskTypeData?.length > 0 && taskTypeData != undefined) {
      taskTypeData?.forEach((obj: any) => {
        if (obj != undefined) {
          let Item: any = {};
          Item.Title = obj.Title;
          Item.SortOrder = obj.SortOrder;
          Item[obj.Title + "number"] = 0;
          Item[obj.Title + "filterNumber"] = 0;
          Item[obj.Title + "numberCopy"] = 0;
          typeData.push(Item);
        }
      });
      console.log("Task Type retrieved:", typeData);
      typeData = typeData.sort(
        (elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder
      );
      setTaskTypeDataItem(typeData);
    }
  };

  const GetSmartmetadata = async () => {
    let siteConfigSites: any = [];
    let web = new Web(ContextValueGlobal.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      .getById(ContextValueGlobal.SmartMetadataListID)
      .items.select(
        "Id",
        "Title",
        "IsVisible",
        "ParentID",
        "SmartSuggestions",
        "TaxType",
        "Description1",
        "Configurations",
        "Item_x005F_x0020_Cover",
        "listId",
        "siteName",
        "siteUrl",
        "SortOrder",
        "SmartFilters",
        "Selectable",
        "Color_x0020_Tag",
        "Parent/Id",
        "Parent/Title"
      )
      .top(4999)
      .expand("Parent")
      .get();
    setAllClientCategory(
      smartmetaDetails?.filter(
        (metadata: any) => metadata?.TaxType == "Client Category"
      )
    );
    smartmetaDetails?.map((newtest: any) => {
      if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Offshore Tasks" || newtest.Title == "DE" || newtest.Title == "Gender" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
        newtest.DataLoadNew = false;
      else if (newtest.TaxType == "Sites") siteConfigSites.push(newtest);
      if (newtest?.TaxType == 'timesheetListConfigrations') {
        timeSheetConfigGlobal = newtest;
      }
    });
    if (siteConfigSites?.length > 0) {
      setSiteConfig(siteConfigSites);
    }
    setMetadata(smartmetaDetails);
  };

  const findPortFolioIconsAndPortfolio = async () => {
    try {
      let newarray: any = [];
      const ItemTypeColumn = "Item Type";
      console.log("Fetching portfolio icons...");
      const field = await new Web(ContextValueGlobal.siteUrl).lists
        .getById(ContextValueGlobal?.MasterTaskListID)
        .fields.getByTitle(ItemTypeColumn)
        .get();
      console.log("Data fetched successfully:", field?.Choices);

      if (field?.Choices?.length > 0 && field?.Choices != undefined) {
        field?.Choices?.forEach((obj: any) => {
          if (obj != undefined) {
            let Item: any = {};
            Item.Title = obj;
            Item[obj + "number"] = 0;
            Item[obj + "filterNumber"] = 0;
            Item[obj + "numberCopy"] = 0;
            newarray.push(Item);
          }
        });
        if (newarray.length > 0) {
          newarray = newarray.filter((findShowPort: any) => {
            let match = portfolioTypeConfrigration.find(
              (config: any) => findShowPort.Title === config.Title
            );
            if (match) {
              findShowPort.Level = match?.Level;
              findShowPort.Suffix = match?.Suffix;
              return true;
            }
            return false;
          });
        }
        console.log("Portfolio icons retrieved:", newarray);
        setPortFolioTypeIcon(newarray);
      }
    } catch (error) {
      console.error("Error fetching portfolio icons:", error);
    }
  };

  const LoadAllSiteTasks = async function () {
    let AllTasksData: any = [];
    let Counter = 0;
    if (siteConfig != undefined && siteConfig.length > 0) {
      const batch = sp.createBatch();
      for (let i = 0; i < siteConfig.length; i++) {
        const config = siteConfig[i];
        const web = new Web(ContextValueGlobal.siteUrl);
        const list = web.lists.getById(config.listId);
        list.items
          .inBatch(batch)
          .select(
            "ParentTask/Title",
            "ParentTask/Id",
            "ItemRank",
            "TaskLevel",
            "OffshoreComments",
            "TeamMembers/Id",
            "ClientCategory/Id",
            "ClientCategory/Title",
            "TaskID",
            "Created",
            "ResponsibleTeam/Id",
            "ResponsibleTeam/Title",
            "ParentTask/TaskID",
            "TaskType/Level",
            "PriorityRank",
            "TeamMembers/Title",
            "FeedBack",
            "Title",
            "Id",
            "ID",
            "ClientTime",
            "DueDate",
            "Comments",
            "Categories",
            "Status",
            "Body",
            "SiteCompositionSettings",
            "PercentComplete",
            "ClientCategory",
            "Priority",
            "TaskType/Id",
            "TaskType/Title",
            "Portfolio/Id",
            "Portfolio/ItemType",
            "Portfolio/PortfolioStructureID",
            "Portfolio/Title",
            "TaskCategories/Id",
            "TaskCategories/Title",
            "TeamMembers/Name",
            "Author/Id",
            "Author/Title",
            "Project/Id",
            "Project/PortfolioStructureID",
            "Project/DueDate",
            "Project/Title",
            "AssignedTo/Title",
            "AssignedTo/Id"
          )
          .expand(
            "AssignedTo",
            "ParentTask",
            "Portfolio",
            "Author",
            "TaskType",
            "ClientCategory",
            "TeamMembers",
            "ResponsibleTeam",
            "TaskCategories",
            "Project"
          )
          .filter("Status ne 'Completed'")
          .orderBy("orderby", false)
          .getAll(4000)

          .then((AllTasksMatches) => {
            console.log(AllTasksMatches);
            Counter++;
            console.log(AllTasksMatches.length);
            if (AllTasksMatches != undefined) {
              if (AllTasksMatches?.length > 0) {
                $.each(AllTasksMatches, function (index: any, item: any) {
                  item.isDrafted = false;
                  item.flag = true;
                  item.TitleNew = item.Title;
                  item.siteType = config.Title;
                  item.childs = [];
                  item.listId = config.listId;
                  item.siteUrl = ContextValueGlobal.siteUrl;
                  item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  item.fontColorTask = "#000";
                  let SCSettingsData: any = item["SiteCompositionSettings"];
                  let checkIsSCProctected: any = false;
                  if (SCSettingsData?.length > 0) {
                    let TempSCSettingsData: any = JSON.parse(SCSettingsData);
                    if (TempSCSettingsData?.length > 0) {
                      checkIsSCProctected = TempSCSettingsData[0].Protected;
                    }
                  }
                  if (checkIsSCProctected) {
                    item.IsSCProtected = true;
                  } else {
                    item.IsSCProtected = false;
                  }

                  // if (item.TaskCategories.results != undefined) {
                  //     if (item.TaskCategories.results.length > 0) {
                  //         $.each(
                  //             item.TaskCategories.results,
                  //             function (ind: any, value: any) {
                  //                 if (value.Title.toLowerCase() == "draft") {
                  //                     item.isDrafted = true;
                  //                 }
                  //             }
                  //         );
                  //     }
                  // }
                });
              }
              AllTasks = AllTasks.concat(AllTasksMatches);
              AllTasks = $.grep(AllTasks, function (type: any) {
                return type.isDrafted == false;
              });
              if (Counter == siteConfig.length) {
                map(AllTasks, (result: any) => {
                  result.Id = result.Id != undefined ? result.Id : result.ID;
                  result.TeamLeaderUser = [];
                  result.AllTeamName =
                    result.AllTeamName === undefined ? "" : result.AllTeamName;
                  result.chekbox = false;
                  result.descriptionsSearch = "";
                  result.commentsSearch = "";

                  result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
                  result.DisplayDueDate = Moment(result.DueDate).format("DD/MM/YYYY");
                  if (result.DisplayDueDate == "Invalid date" || "") {
                    result.DisplayDueDate = result.DisplayDueDate.replaceAll(
                      "Invalid date",
                      ""
                    );
                  }
                  if (result.DisplayCreateDate == "Invalid date" || "") {
                    result.DisplayCreateDate = result.DisplayCreateDate.replaceAll(
                      "Invalid date",
                      ""
                    );
                  }
                  result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
                  result.PercentComplete = (
                    result.PercentComplete * 100
                  ).toFixed(0);
                  result.chekbox = false;
                  if (result?.FeedBack != undefined) {
                    result.descriptionsSearch = JSON.parse(result?.FeedBack)
                  }
                  if (result?.Comments != null) {
                    result.commentsSearch = result?.Comments.replace(
                      /(<([^>]+)>)/gi,
                      ""
                    ).replace(/\n/g, "");
                  }
                  if (
                    result.AssignedTo != undefined &&
                    result.AssignedTo.length > 0
                  ) {
                    map(result.AssignedTo, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                          if (
                            Assig.Id != undefined &&
                            users.AssingedToUser != undefined &&
                            Assig.Id == users.AssingedToUser.Id
                          ) {
                            users.ItemCover = users.Item_x0020_Cover;
                            result.TeamLeaderUser.push(users);
                            result.AllTeamName += users.Title + ";";
                          }
                        });
                      }
                    });
                  }
                  if (
                    result.ResponsibleTeam != undefined &&
                    result.ResponsibleTeam.length > 0
                  ) {
                    map(result.ResponsibleTeam, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                          if (
                            Assig.Id != undefined &&
                            users.AssingedToUser != undefined &&
                            Assig.Id == users.AssingedToUser.Id
                          ) {
                            users.ItemCover = users.Item_x0020_Cover;
                            result.TeamLeaderUser.push(users);
                            result.AllTeamName += users.Title + ";";
                          }
                        });
                      }
                    });
                  }
                  if (
                    result.TeamMembers != undefined &&
                    result.TeamMembers.length > 0
                  ) {
                    map(result.TeamMembers, (Assig: any) => {
                      if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                          if (
                            Assig.Id != undefined &&
                            users.AssingedToUser != undefined &&
                            Assig.Id == users.AssingedToUser.Id
                          ) {
                            users.ItemCover = users.Item_x0020_Cover;
                            result.TeamLeaderUser.push(users);
                            result.AllTeamName += users.Title + ";";
                          }
                        });
                      }
                    });
                  }
                  if (result?.ClientCategory?.length > 0) {
                    result.ClientCategorySearch = result?.ClientCategory?.map(
                      (elem: any) => elem.Title
                    ).join(" ");
                  } else {
                    result.ClientCategorySearch = "";
                  }
                  result["TaskID"] = globalCommon.GetTaskId(result);
                  if (result.Project) {
                    result.ProjectTitle = result?.Project?.Title;
                    result.ProjectId = result?.Project?.Id;
                    result.projectStructerId = result?.Project?.PortfolioStructureID
                    const title = result?.Project?.Title || '';
                    const formattedDueDate = Moment(result?.Project?.DueDate).format('YYYY-MM');
                    result.joinedData = [];
                    if (result?.projectStructerId && title || formattedDueDate) {
                      result.joinedData.push(`Project ${result?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                    }

                  }
                  result["Item_x0020_Type"] = "Task";
                  TasksItem.push(result);
                  AllTasksData.push(result);
                });
                AllSiteTasksDataGlobal = AllTasksData;
                // GetComponents();
                if (AllSiteTasksDataGlobal?.length > 0) {
                  GetComponents();
                }
              }
            }
          });
      }
    }
  };
  const timeEntryIndex: any = {};
  const smartTimeTotal = async () => {
    countGlobal++;
    let AllTimeEntries = [];
    if (timeSheetConfigGlobal?.Id !== undefined) {
      AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfigGlobal);
    }
    AllTimeEntries?.forEach((entry: any) => {
      siteConfig.forEach((site) => {
        const taskTitle = `Task${site.Title}`;
        const key = taskTitle + entry[taskTitle]?.Id
        if (entry.hasOwnProperty(taskTitle) && entry.AdditionalTimeEntry !== null && entry.AdditionalTimeEntry !== undefined) {
          if (entry[taskTitle].Id === 168) {
            console.log(entry[taskTitle].Id);

          }
          const additionalTimeEntry = JSON.parse(entry.AdditionalTimeEntry);
          let totalTaskTime = additionalTimeEntry?.reduce((total: any, time: any) => total + parseFloat(time.TaskTime), 0);

          if (timeEntryIndex.hasOwnProperty(key)) {
            timeEntryIndex[key].TotalTaskTime += totalTaskTime
          } else {
            timeEntryIndex[`${taskTitle}${entry[taskTitle]?.Id}`] = {
              ...entry[taskTitle],
              TotalTaskTime: totalTaskTime,
              siteType: site.Title,
            };
          }
        }
      });
    });
    AllSiteTasksDataGlobal?.map((task: any) => {
      task.TotalTaskTime = 0;
      const key = `Task${task?.siteType + task.Id}`;
      if (timeEntryIndex.hasOwnProperty(key) && timeEntryIndex[key]?.Id === task.Id && timeEntryIndex[key]?.siteType === task.siteType) {
        task.TotalTaskTime = timeEntryIndex[key]?.TotalTaskTime;
      }
    })
    if (timeEntryIndex) {
      const dataString = JSON.stringify(timeEntryIndex);
      localStorage.setItem('timeEntryIndex', dataString);
    }
    console.log("timeEntryIndex", timeEntryIndex)
    if (AllSiteTasksDataGlobal?.length > 0) {
      setData([]);
      portfolioTypeData.forEach((port, index) => {
        componentGrouping(port?.Id, index);
        countsrunGlobal++;
      });
    }
    return AllSiteTasksDataGlobal;
  };

  const GetComponents = async () => {
    if (portfolioTypeData.length > 0) {
      portfolioTypeData?.map((elem: any) => {
        if (isUpdatedGlobal === "") {
          filt = "";
        } else if (
          isUpdatedGlobal === elem.Title ||
          isUpdatedGlobal?.toLowerCase() === elem?.Title?.toLowerCase()
        ) {
          filt =
            "(Item_x0020_Type eq 'SubComponent' and Item_x0020_Type eq 'Feature' )";
        }
      });
    }
    let web = new Web(ContextValueGlobal.siteUrl);
    let componentDetails = [];
    componentDetails = await web.lists
      .getById(ContextValueGlobal.MasterTaskListID)
      .items.select(
        "ID",
        "Id",
        "Title",
        "PortfolioLevel",
        "PortfolioStructureID",
        "Comments",
        "ItemRank",
        "Portfolio_x0020_Type",
        "Parent/Id",
        "Parent/Title",
        "DueDate",
        "Created",
        "Body",
        "Item_x0020_Type",
        "SiteCompositionSettings",
        "Categories",
        "Short_x0020_Description_x0020_On",
        "PriorityRank",
        "Priority",
        "AssignedTo/Title",
        "TeamMembers/Id",
        "TeamMembers/Title",
        "ClientCategory/Id",
        "ClientCategory/Title",
        "PercentComplete",
        "ResponsibleTeam/Id",
        "Author/Id",
        "Author/Title",
        "Sitestagging",
        "ResponsibleTeam/Title",
        "PortfolioType/Id",
        "PortfolioType/Color",
        "PortfolioType/IdRange",
        "PortfolioType/Title",
        "AssignedTo/Id"
      )
      .expand(
        "Parent",
        "PortfolioType",
        "AssignedTo",
        "Author",
        "ClientCategory",
        "TeamMembers",
        "ResponsibleTeam"
      )
      .top(4999)
      .get();

    console.log(componentDetails);
    ProjectDataGlobal = componentDetails.filter(
      (projectItem: any) => projectItem.Item_x0020_Type === "Project"
    );
    componentDetails.forEach((result: any) => {
      result["siteType"] = "Master Tasks";
      result.AllTeamName = "";
      result.descriptionsSearch = "";
      result.commentsSearch = "";
      result.TeamLeaderUser = [];
      if (result.Item_x0020_Type === "Component") {
        result.boldRow = "boldClable";
        result.lableColor = "f-bg";
      }
      if (result.Item_x0020_Type === "SubComponent") {
        result.lableColor = "a-bg";
      }
      if (result.Item_x0020_Type === "Feature") {
        result.lableColor = "w-bg";
      }
      if (result?.Item_x0020_Type != undefined) {
        result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
      }
      result["TaskID"] = result?.PortfolioStructureID;

      result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      result.DisplayDueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      if (result.DisplayDueDate == "Invalid date" || "") {
        result.DisplayDueDate = result.DisplayDueDate.replaceAll(
          "Invalid date",
          ""
        );
      }
      if (result.DisplayCreateDate == "Invalid date" || "") {
        result.DisplayCreateDate = result.DisplayCreateDate.replaceAll(
          "Invalid date",
          ""
        );
      }

      let SCSettingsData: any = result["SiteCompositionSettings"];
      let checkIsSCProctected: any = false;
      if (SCSettingsData?.length > 0) {
        let TempSCSettingsData: any = JSON.parse(SCSettingsData);
        if (TempSCSettingsData?.length > 0) {
          checkIsSCProctected = TempSCSettingsData[0].Protected;
        }
      }
      if (checkIsSCProctected) {
        result.IsSCProtected = true;
      } else {
        result.IsSCProtected = false;
      }

      result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");

      result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
      if (result?.Short_x0020_Description_x0020_On != undefined) {
        result.descriptionsSearch =
          result.Short_x0020_Description_x0020_On.replace(
            /(<([^>]+)>)/gi,
            ""
          ).replace(/\n/g, "");
      }
      if (result?.Comments != null) {
        result.commentsSearch = result?.Comments.replace(
          /(<([^>]+)>)/gi,
          ""
        ).replace(/\n/g, "");
      }
      result.Id = result.Id != undefined ? result.Id : result.ID;
      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
        map(result.AssignedTo, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.ResponsibleTeam != undefined &&
        result.ResponsibleTeam.length > 0
      ) {
        map(result.ResponsibleTeam, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (result.TeamMembers != undefined && result.TeamMembers.length > 0) {
        map(result.TeamMembers, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }

      if (result?.ClientCategory?.length > 0) {
        result.ClientCategorySearch = result?.ClientCategory?.map(
          (elem: any) => elem.Title
        ).join(" ");
      } else {
        result.ClientCategorySearch = "";
      }
    });
    setAllMasterTasks(componentDetails);
    AllComponetsData = componentDetails;
    ComponetsData["allComponets"] = componentDetails;
    // AllSiteTasksDataGlobal?.length > 0 &&
    if (AllSiteTasksDataGlobal?.length > 0 && AllComponetsData?.length > 0) {
      //   if (usedFor == "Site-Compositions" && copyDtaArrayGlobal?.length > 0) {
      //     console.log("Data Already Exits");
      //     setLoaded(true);
      //     setData(componentDataGlobal);
      //   } else {
      portfolioTypeData.forEach((port, index) => {
        componentGrouping(port?.Id, index);
        countsrunGlobal++;
      });
      //   }

    }
    if (portfolioTypeData?.length === countsrunGlobal) {
      executeOnce();
    }
  };


  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let query = params.get("PortfolioType");
    if (query) {
      setIsUpdated(query);
      isUpdatedGlobal = query;
    }
  }, []);

  React.useEffect(() => {
    portfolioColorGlobal = SelectedProp?.props?.PortfolioType?.Color;
  }, [AllSiteTasksDataGlobal]);

  React.useEffect(() => {
    // if (usedFor == "Site-Compositions" && componentDataGlobal?.length > 0) {
    //   console.log("Data Already Exits");
    // } else {
    getTaskType();
    findPortFolioIconsAndPortfolio();
    GetSmartmetadata();
    getTaskUsers();
    getPortFolioType();
    // }

  }, []);

  React.useEffect(() => {
    if (AllMetadata.length > 0 && portfolioTypeData.length > 0) {
      //   if (usedFor == "Site-Compositions" && componentDataGlobal?.length > 0) {
      //     console.log("Data Already Exits");
      //   } else {
      LoadAllSiteTasks();
      //   }
    }
  }, [AllMetadata.length > 0 && portfolioTypeData.length > 0]);

  const DynamicSort = function (items: any, column: any, orderby: any) {
    items?.sort(function (a: any, b: any) {
      var aID = a[column];
      var bID = b[column];
      if (orderby === "asc") return aID == bID ? 0 : aID < bID ? 1 : -1;
      // else return aID == bID ? 0 : aID > bID ? 1 : -1;
    });
  };
  const componentGrouping = (portId: any, index: any) => {
    let FinalComponent: any = [];

    let AllProtFolioData = AllComponetsData?.filter(
      (comp: any) =>
        comp?.PortfolioType?.Id === portId && comp.TaskType === undefined
    );

    // let AllComponents = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === 0 || comp?.Parent?.Id === undefined && comp?.Id === 321 );

    let subComFeat = AllProtFolioData?.filter(
      (comp: any) => comp?.Parent?.Id === SelectedProp?.props?.Id
    );
    countAllComposubDataGlobal = countAllComposubDataGlobal.concat(subComFeat);
    subComFeat?.map((masterTask: any) => {
      masterTask.subRows = [];
      taskTypeData?.map((levelType: any) => {
        if (levelType.Level === 1) componentActivity(levelType, masterTask);
      });

      let allFeattData = AllComponetsData?.filter(
        (elem: any) => elem?.Parent?.Id === masterTask?.Id
      );
      countAllComposubDataGlobal = countAllComposubDataGlobal.concat(allFeattData);
      masterTask.subRows = masterTask?.subRows?.concat(allFeattData);
      allFeattData?.forEach((subFeat: any) => {
        subFeat.subRows = [];
        taskTypeData?.map((levelType: any) => {
          if (levelType.Level === 1) componentActivity(levelType, subFeat);
        });
      });

      FinalComponent.push(masterTask);
    });

    componentDataGlobal = componentDataGlobal?.concat(FinalComponent);
    DynamicSort(componentDataGlobal, "PortfolioLevel", "");
    componentDataGlobal.forEach((element: any) => {
      if (element?.subRows?.length > 0) {
        let level = element?.subRows?.filter(
          (obj: any) =>
            obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task"
        );
        let leveltask = element?.subRows?.filter(
          (obj: any) => obj.Item_x0020_Type === "Task"
        );
        DynamicSort(level, "Item_x0020_Type", "asc");
        element.subRows = [];
        element.subRows = level.concat(leveltask);
      }
      if (element?.subRows != undefined) {
        element?.subRows?.forEach((obj: any) => {
          let level1 = obj?.subRows?.filter(
            (obj: any) =>
              obj.Item_x0020_Type != undefined && obj.Item_x0020_Type != "Task"
          );
          let leveltask1 = obj?.subRows?.filter(
            (obj: any) => obj.Item_x0020_Type === "Task"
          );
          DynamicSort(level1, "Item_x0020_Type", "asc");
          obj.subRows = [];
          obj.subRows = level1?.concat(leveltask1);
        });
      }
    });
    if ((portfolioTypeData?.length - 1 === index || index === "") && countGlobal === 1) {
      let Actatcomponent = AllSiteTasksDataGlobal?.filter(
        (elem1: any) =>
          elem1?.TaskType?.Id === 1 &&
          elem1?.ParentTask?.Id === undefined &&
          elem1?.Portfolio?.Id === SelectedProp?.props?.Id
      );
      countAllTasksDataGlobal = countAllTasksDataGlobal.concat(Actatcomponent);
      Actatcomponent?.map((masterTask1: any) => {
        masterTask1.subRows = [];
        taskTypeData?.map((levelType: any) => {
          if (levelType.Level === 1) componentWsT(levelType, masterTask1);
        });
        componentDataGlobal.push(masterTask1);
      });
      var temp: any = {};
      temp.Title = "Others";
      temp.TaskID = "";
      temp.subRows = [];
      temp.PercentComplete = "";
      temp.ItemRank = "";
      temp.DueDate = null;
      temp.Project = "";
      temp.ClientCategorySearch = "";
      temp.Created = null;
      temp.DisplayCreateDate = null;
      temp.DisplayDueDate = null;
      temp.AllTeamName = "";
      temp.DueDate = "";
      temp.descriptionsSearch = "";
      temp.ProjectTitle = "";
      temp.Status = "";
      temp.Author = "";
      temp.subRows = AllSiteTasksDataGlobal?.filter(
        (elem1: any) =>
          elem1?.TaskType?.Id != undefined &&
          elem1?.TaskType?.Level != 1 &&
          elem1?.TaskType?.Level != 2 &&
          (elem1?.ParentTask === undefined ||
            elem1?.ParentTask?.TaskID === null) &&
          elem1?.Portfolio?.Id === SelectedProp?.props?.Id
      );
      countAllTasksDataGlobal = countAllTasksDataGlobal.concat(temp.subRows);
      temp.subRows.forEach((task: any) => {
        if (task.TaskID === undefined || task.TaskID === "")
          task.TaskID = "T" + task.Id;
      });
      if (temp?.subRows?.length > 0) {
        componentDataGlobal.push(temp);
      }
    }
    setLoaded(true);
    componentDataGlobal?.map((ItemDataCheckSC: any) => {
      let SCSettingsData: any = ItemDataCheckSC["SiteCompositionSettings"];
      let checkIsSCProctected: any = false;
      if (SCSettingsData?.length > 0) {
        let TempSCSettingsData: any = JSON.parse(SCSettingsData);
        if (TempSCSettingsData?.length > 0) {
          checkIsSCProctected = TempSCSettingsData[0].Protected;
        }
      }
      if (checkIsSCProctected) {
        ItemDataCheckSC.IsSCProtected = true;
      } else {
        ItemDataCheckSC.IsSCProtected = false;
      }
      if (ItemDataCheckSC?.SiteCompositionSettings != undefined) {
        ItemDataCheckSC.compositionType = siteCompositionType(ItemDataCheckSC?.SiteCompositionSettings);

      } else {
        ItemDataCheckSC.compositionType = '';

      }

    })
    setData(componentDataGlobal);
    console.log(countAllTasksDataGlobal);
  };

  // ComponentWS
  function siteCompositionType(jsonStr: any) {
    var data = JSON.parse(jsonStr);
    try {
      data = data[0];
      for (var key in data) {
        if (data?.hasOwnProperty(key) && data[key] === true) {
          return key;
        }
      }

      return '';
    } catch (error) {
      console.log(error)
      return '';
    }
  }

  const componentWsT = (levelType: any, items: any) => {
    let findws = AllSiteTasksDataGlobal.filter(
      (elem1: any) =>
        elem1?.ParentTask?.Id === items?.Id &&
        elem1?.siteType === items?.siteType
    );
    countAllTasksDataGlobal = countAllTasksDataGlobal.concat(findws);
    findws?.forEach((act: any) => {
      act.subRows = [];
      let allTasksData = AllSiteTasksDataGlobal.filter(
        (elem1: any) =>
          elem1?.ParentTask?.Id === act?.Id && elem1?.siteType === act?.siteType
      );
      if (allTasksData.length > 0) {
        act.subRows = act?.subRows?.concat(allTasksData);
        countAllTasksDataGlobal = countAllTasksDataGlobal.concat(allTasksData);
      }
    });
    items.subRows = items?.subRows?.concat(findws);
  };


  const componentActivity = (levelType: any, items: any) => {
    let findActivity = AllSiteTasksDataGlobal?.filter(
      (elem: any) =>
        elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id
    );
    let findTasks = AllSiteTasksDataGlobal?.filter(
      (elem1: any) =>
        elem1?.TaskType?.Id != levelType.Id &&
        (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined) &&
        elem1?.Portfolio?.Id === items?.Id
    );
    countAllTasksDataGlobal = countAllTasksDataGlobal.concat(findTasks);
    countAllTasksDataGlobal = countAllTasksDataGlobal.concat(findActivity);

    findActivity?.forEach((act: any) => {
      act.subRows = [];
      let worstreamAndTask = AllSiteTasksDataGlobal?.filter(
        (taskData: any) =>
          taskData?.ParentTask?.Id === act?.Id &&
          taskData?.siteType === act?.siteType
      );
      if (worstreamAndTask.length > 0) {
        act.subRows = act?.subRows?.concat(worstreamAndTask);
        countAllTasksDataGlobal = countAllTasksDataGlobal.concat(worstreamAndTask);
      }
      worstreamAndTask?.forEach((wrkst: any) => {
        wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
        let allTasksData = AllSiteTasksDataGlobal?.filter(
          (elem: any) =>
            elem?.ParentTask?.Id === wrkst?.Id &&
            elem?.siteType === wrkst?.siteType
        );
        if (allTasksData.length > 0) {
          wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
          countAllTasksDataGlobal = countAllTasksDataGlobal.concat(allTasksData);
        }
      });
    });
    items.subRows = items?.subRows?.concat(findActivity);
    items.subRows = items?.subRows?.concat(findTasks);
  };

  const countTaskAWTLevel = (countTaskAWTLevel: any) => {
    if (countTaskAWTLevel.length > 0) {
      countTaskAWTLevel.map((result: any) => {
        taskTypeDataItem?.map((type: any) => {
          if (result?.TaskType?.Title === type.Title) {
            type[type.Title + "number"] += 1;
            type[type.Title + "filterNumber"] += 1;
          }
        });
      });
    }
  };

  const countComponentLevel = (countTaskAWTLevel: any) => {
    if (countTaskAWTLevel?.length > 0) {
      portfolioTypeDataItem?.map((type: any) => {
        countTaskAWTLevel?.map((result: any) => {
          if (result?.Item_x0020_Type === type?.Title) {
            type[type.Title + "filterNumber"] += 1;
            type[type.Title + "number"] += 1;
          }
        });
      });
    }
  };

  function executeOnce() {
    if (countAllTasksDataGlobal?.length > 0) {
      let countAllTasksData1 = countAllTasksDataGlobal?.filter(
        (ele: any, ind: any, arr: any) => {
          const isDuplicate =
            arr.findIndex((elem: any) => {
              return (
                (elem.ID === ele.ID || elem.Id === ele.Id) &&
                elem.siteType === ele.siteType
              );
            }) !== ind;
          return !isDuplicate;
        }
      );
      countTaskAWTLevel(countAllTasksData1);
    }

    if (countAllComposubDataGlobal?.length > 0) {
      let countAllTasksData11 = countAllComposubDataGlobal?.filter(
        (ele: any, ind: any, arr: any) => {
          const isDuplicate =
            arr.findIndex((elem: any) => {
              return (
                (elem.ID === ele.ID || elem.Id === ele.Id) &&
                elem.siteType === ele.siteType
              );
            }) !== ind;
          return !isDuplicate;
        }
      );
      countComponentLevel(countAllTasksData11);
    }
  }

  // For the user
  const findUserByName = (name: any) => {
    const user = AllUsers.filter(
      (user: any) => user?.AssingedToUser?.Id === name
    );
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else {
      Image =
        "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }
    return user ? Image : null;
  };

  ///react table start function//////
  const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: true,
        hasExpanded: true,
        size: 55,
        id: "Id"
      },
      {
        cell: ({ row, getValue }) => (
          <div className="alignCenter">
            {row?.original?.SiteIcon != undefined ? (
              <div className="alignCenter" title="Show All Child">
                <img
                  title={row?.original?.TaskType?.Title}
                  className={
                    row?.original?.Item_x0020_Type == "SubComponent"
                      ? "ml-12 workmember ml20 me-1"
                      : row?.original?.Item_x0020_Type == "Feature"
                        ? "ml-24 workmember ml20 me-1"
                        : row?.original?.TaskType?.Title == "Activities"
                          ? "ml-36 workmember ml20 me-1"
                          : row?.original?.TaskType?.Title == "Workstream"
                            ? "ml-48 workmember ml20 me-1"
                            : row?.original?.TaskType?.Title == "Task" ||
                              (row?.original?.Item_x0020_Type === "Task" &&
                                row?.original?.TaskType == undefined)
                              ? "ml-60 workmember ml20 me-1"
                              : "workmember ml20 me-1"
                  }
                  src={row?.original?.SiteIcon}
                ></img>
              </div>
            ) : (
              <>
                {row?.original?.Title != "Others" ? (
                  <div
                    title={row?.original?.Item_x0020_Type}
                    style={{
                      backgroundColor: `${row?.original?.PortfolioType?.Color}`
                    }}
                    className={
                      row?.original?.Item_x0020_Type == "SubComponent"
                        ? "ml-12 Dyicons"
                        : row?.original?.Item_x0020_Type == "Feature"
                          ? "ml-24 Dyicons"
                          : row?.original?.TaskType?.Title == "Activities"
                            ? "ml-36 Dyicons"
                            : row?.original?.TaskType?.Title == "Workstream"
                              ? "ml-48 Dyicons"
                              : row?.original?.TaskType?.Title == "Task"
                                ? "ml-60 Dyicons"
                                : "Dyicons"
                    }
                  >
                    {row?.original?.SiteIconTitle}
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
            {getValue()}
          </div>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 95
      },
      {
        accessorFn: (row) => row?.TaskID,
        cell: ({ row, getValue }) => (
          <>
            <ReactPopperTooltip ShareWebId={getValue()} row={row} />
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        resetColumnFilters: false,
        // isColumnDefultSortingAsc:true,
        size: 195
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <div className="alignCenter">
            <span className="column-description2">
              {row?.original?.siteType == "Master Tasks" &&
                row?.original?.Title !== "Others" && (
                  <a
                    className="text-content hreflink"
                    title={row?.original?.Title}
                    data-interception="off"
                    target="_blank"
                    style={
                      row?.original?.fontColorTask != undefined
                        ? { color: `${row?.original?.fontColorTask}` }
                        : { color: `${row?.original?.PortfolioType?.Color}` }
                    }
                    href={
                      ContextValueGlobal.siteUrl +
                      "/SitePages/Portfolio-Profile.aspx?taskId=" +
                      row?.original?.ID
                    }
                  >
                    <HighlightableCell
                      value={getValue()}
                      searchTerm={
                        column.getFilterValue() != undefined
                          ? column.getFilterValue()
                          : childRef?.current?.globalFilter
                      }
                    />
                  </a>
                )}
              {row?.original?.siteType != "Master Tasks" &&
                row?.original?.Title !== "Others" && (
                  <a
                    className="text-content hreflink"
                    title={row?.original?.Title}
                    data-interception="off"
                    target="_blank"
                    style={
                      row?.original?.fontColorTask != undefined
                        ? { color: `${row?.original?.fontColorTask}` }
                        : { color: `${row?.original?.PortfolioType?.Color}` }
                    }
                    href={
                      ContextValueGlobal.siteUrl +
                      "/SitePages/Task-Profile.aspx?taskId=" +
                      row?.original?.ID +
                      "&Site=" +
                      row?.original?.siteType
                    }
                  >
                    <HighlightableCell
                      value={getValue()}
                      searchTerm={
                        column.getFilterValue() != undefined
                          ? column.getFilterValue()
                          : childRef?.current?.globalFilter
                      }
                    />
                  </a>
                )}
              {row?.original.Title === "Others" ? (
                <span
                  className="text-content"
                  title={row?.original?.Title}
                  style={
                    row?.original?.fontColorTask != undefined
                      ? { color: `${row?.original?.fontColorTask}` }
                      : { color: `${row?.original?.PortfolioType?.Color}` }
                  }
                >
                  {row?.original?.Title}
                </span>
              ) : (
                ""
              )}
            </span>
            {row?.original?.Categories == "Draft" ? (
              <FaCompressArrowsAlt
                style={{
                  height: "11px",
                  width: "20px",
                  color: `${row?.original?.PortfolioType?.Color}`
                }}
              />
            ) : (
              ""
            )}
            {row?.original?.subRows?.length > 0 ? (
              <span className="ms-1">
                {row?.original?.subRows?.length
                  ? "(" + row?.original?.subRows?.length + ")"
                  : ""}
              </span>
            ) : (
              ""
            )}
            {row?.original?.descriptionsSearch != null &&
              row?.original?.descriptionsSearch != "" && (
                <InfoIconsToolTip
                  Discription={row?.original?.descriptionsSearch}
                  row={row?.original}
                />
              )}
          </div>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
        size: 480
      },
      {
        accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
        cell: ({ row }) => (
          <>
            {row?.original?.ProjectTitle != (null || undefined) ? (
              <span>
                <a
                  style={
                    row?.original?.fontColorTask != undefined
                      ? { color: `${row?.original?.fontColorTask}` }
                      : { color: `${row?.original?.PortfolioType?.Color}` }
                  }
                  data-interception="off"
                  target="_blank"
                  className="hreflink serviceColor_Active"
                  href={`${ContextValueGlobal.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`}
                >
                  <ReactPopperTooltip
                    ShareWebId={row?.original?.projectStructerId}
                    projectToolShow={true}
                    row={row}
                    AllListId={ContextValueGlobal}
                  />
                </a>
              </span>
            ) : (
              ""
            )}
          </>
        ),
        id: "ProjectTitle",
        placeholder: "Project",
        resetColumnFilters: false,
        header: "",
        size: 70
      },
      {
        accessorFn: (row) => row?.ClientCategorySearch,
        cell: ({ row }) => (
          <>
            <ShowClintCatogory
              clintData={row?.original}
              AllMetadata={AllMetadata}
            />
          </>
        ),
        id: "ClientCategorySearch",
        placeholder: "Client Category",
        header: "",
        resetColumnFilters: false,
        size: 100
      },
      {
        accessorFn: (row) => row?.AllTeamName,
        cell: ({ row }) => (
          <div className="alignCenter">
            <ShowTaskTeamMembers
              key={row?.original?.Id}
              props={row?.original}
              TaskUsers={AllUsers}
              Context={SelectedProp?.NextProp}
            />
          </div>
        ),
        id: "AllTeamName",
        placeholder: "Team",
        resetColumnFilters: false,
        header: "",
        size: 131
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "Status",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "PercentComplete"
      },
      {
        accessorFn: (row) => row?.IsSCProtected,
        cell: ({ row }) => (
          <span>{row?.original?.IsSCProtected == true ? "Protected" : ""}</span>
        ),
        id: 'Type',
        placeholder: "Protected",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 100,
      },
      {
        accessorFn: (row) => row?.compositionType,
        cell: ({ row }) => (
          <span>{row?.original?.compositionType}</span>
        ),
        id: 'Type',
        placeholder: "Composition Type",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 100,
      },
      {
        accessorFn: (row) => row?.DueDate,
        cell: ({ row }) => (
          <span className='ms-1'>{row?.original?.DisplayDueDate} </span>

        ),
        id: 'DueDate',
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.DisplayDueDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "DueDate",
        header: "",
        size: 100
      },
      {
        accessorFn: (row) => row?.Created,
        cell: ({ row }) => (
          <span>
            {row?.original?.Created == null ? (
              ""
            ) : (
              <>
                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                {row?.original?.Author != undefined ? (
                  <>
                    <a
                      href={`${ContextValueGlobal?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                      target="_blank"
                      data-interception="off"
                    >
                      <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                    </a>
                  </>
                ) : (
                  <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                )}
              </>
            )}
          </span>
        ),
        id: 'Created',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Created",
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        header: "",
        size: 134
      },


    ],
    [data]
  );
  //-------------------------------------------------- restructuring function start---------------------------------------------------------------

  const callBackData = React.useCallback((checkData: any) => {
    if (usedFor == "Site-Compositions") {
      SelectedProp.callback(checkData);
    }
    let array: any = [];
    if (checkData != undefined) {
      setCheckedList(checkData);
      array.push(checkData);
    } else {
      setCheckedList({});
      array = [];
    }
    setCheckedList1(array);
  }, []);

  const callBackData1 = React.useCallback((getData: any, topCompoIcon: any) => {
    setData((getData) => [...getData]);
    setTopCompoIcon(topCompoIcon);
    renderDataGlobal = [];
    renderDataGlobal = renderDataGlobal.concat(getData);
    refreshData();
  }, []);

  //  Function to call the child component's function
  const callChildFunction = (items: any) => {
    if (childRef.current) {
      childRef.current.callChildFunction(items);
    }
  };

  const trueTopIcon = (items: any) => {
    if (childRef.current) {
      childRef.current.trueTopIcon(items);
    }
  };

  //-------------------------------------------------- restructuring function end---------------------------------------------------------------
  //-------------------------------------------------------------End---------------------------------------------------------------------------------
  return (
    <section className="TableContentSection taskprofilepagegreen">
      <div className="container-fluid">
        <section className="TableSection">
          <div className="container p-0">
            <div className="Alltable mt-2 ">
              <div className="col-sm-12 p-0 smart">
                <div className="">
                  <div className="wrapper">
                    <Loader
                      loaded={loaded}
                      lines={13}
                      length={20}
                      width={10}
                      radius={30}
                      corners={1}
                      rotate={0}
                      direction={1}
                      color={portfolioColorGlobal ? portfolioColorGlobal : "#000069"}
                      speed={2}
                      trail={60}
                      shadow={false}
                      hwaccel={false}
                      className="spinner"
                      zIndex={2e9}
                      top="28%"
                      left="50%"
                      scale={1.0}
                      loadedClassName="loadedContent"
                    />
                    <GlobalCommanTable
                      smartTimeTotalFunction={smartTimeTotal} SmartTimeIconShow={true}
                      ref={childRef}
                      AddStructureFeature={
                        SelectedProp?.props?.Item_x0020_Type
                      }
                      setLoaded={setLoaded}
                      queryItems={SelectedProp?.props}
                      PortfolioFeature={SelectedProp?.props?.Item_x0020_Type}
                      AllMasterTasksData={AllMasterTasksData}
                      callChildFunction={callChildFunction}
                      AllListId={ContextValueGlobal}
                      columns={columns}
                      restructureCallBack={callBackData1}
                      data={data}
                      multiSelect={usedFor == "Site-Compositions" ? true : false}
                      callBackData={callBackData}
                      TaskUsers={AllUsers}
                      showHeader={usedFor == "Site-Compositions" ? false : true}
                      portfolioColorGlobal={portfolioColorGlobal}
                      portfolioTypeData={portfolioTypeDataItem}
                      taskTypeDataItem={taskTypeDataItem}
                      fixedWidth={true}
                      protfolioProfileButton={true}
                      portfolioTypeConfrigration={portfolioTypeConfrigration}
                      showingAllPortFolioCount={true}
                      showCreationAllButton={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
export default ComponentChildDataTable;
