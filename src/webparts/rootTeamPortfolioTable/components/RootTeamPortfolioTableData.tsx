import React, { useRef, useState } from "react";
import { Web } from "sp-pnp-js";
import * as $ from "jquery";
import * as Moment from "moment";
import { map } from "jquery";
import { ColumnDef } from "@tanstack/react-table";
import * as globalCommon from "../../../globalComponents/globalCommon";
import { FaCompressArrowsAlt, FaFilter, } from "react-icons/fa";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import TrafficLightComponent from "../../../globalComponents/TrafficLightVerification/TrafficLightComponent";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import PageLoader from "../../../globalComponents/pageLoader";
let isUpdated: any = "";
let ProjectData: any = [];
let hasCustomExpanded: any = true
let hasExpanded: any = true
let isHeaderNotAvlable: any = false
let isColumnDefultSortingAsc: any = false;
let componentData: any = [];
let AfterFilterTaskCount: any = [];
let countAllComposubData: any = [];
let countAllTasksData: any = [];
let renderData: any = [];
let childRefdata: any;
const RootTeamPortfolioTableData = (props: any) => {
    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };

    }
  let AllSiteSubSiteListDeatails: any = useRef([]);
  let timeSheetConfig: any = useRef();
  let siteConfigForAllSubSite: any = useRef()
  let AllSubSiteTaskCatagory: any = useRef()
  let AllSubSiteAllMetadata: any = useRef()
  let AllSubSiteTaskUser: any = useRef();
  let AllSubSitePortfolioTypeData: any = useRef();
  let AllSubSiteTaskTypeData:any=useRef();
  let AllSubSiteMasterTask:any=useRef();
  let AllSubSiteTaskTypeDataItem:any=useRef()
  let AllSubSiteTasksData:any =useRef()
  let AllSubSiteFinalComponent:any=useRef()
  const [AllSiteTasksData, setAllSiteTasksData] = React.useState([]);
  const [IsUpdated, setIsUpdated] = React.useState("");
  const [AllMetadata, setMetadata]:any = React.useState()
  const [portfolioTypeData, setPortfolioTypeData]:any = React.useState()
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [timeComponentData, setTimeComponentData]:any = React.useState([])
  const [loaded, setLoaded] = React.useState(false);
  const refreshData = () => setData(() => renderData);
  const [data, setData] = React.useState([]);
  console.log(props?.props)
  React.useEffect(() => {
    GetRootMetaData()
  }, [])
  const GetRootMetaData = async () => {

    if (props?.props?.SmartMetadataListID != undefined) {
      try {
        let web = new Web(props?.props?.siteUrl);
        let smartmeta = [];
        let TaxonomyItems = [];
        smartmeta = await web.lists
          .getById(props?.props?.SmartMetadataListID)
          .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "TaxType", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Configurations", "Parent/Id", "Parent/Title")
          .top(5000)
          .expand("Parent")
          .get();
        smartmeta?.map(async (item: any) => {
          if (item?.Title == 'RootDashboardConfig') {
            let dashboardConfig = JSON.parse(item?.Configurations);
            if (dashboardConfig?.length > 0) {

              AllSiteSubSiteListDeatails.current = dashboardConfig

            }
            await Promise.all(dashboardConfig.map(async (config: any) => {
              await Promise.all([
                GetSmartmetadata(config),
                getTaskUsers(config),
                getPortFolioType(config),
                getTaskType(config)
              ]);
            }));
            setMetadata(AllSubSiteAllMetadata?.current)
            setPortfolioTypeData(AllSubSitePortfolioTypeData?.current)

          }

        })

      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Smart Metadata List Id not present')
    }
  };
  const GetSmartmetadata = async (config: any) => {
    let siteConfigSites: any = []
    var Priority: any = []
    // let PrecentComplete: any = [];
    let Categories: any = [];
    
   
   
    try {
      const web = new Web(config.siteUrl);
      const smartmetaDetails = await web.lists
        .getById(config.SmartMetadataListID)
        .items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
        .top(4999).expand("Parent").get();

      await Promise.all(smartmetaDetails.map(async (newtest: any) => {
        if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks") {
          newtest.DataLoadNew = false;
        } else if (newtest.TaxType == 'Sites') {
          siteConfigSites.push(newtest);
        }
        if (newtest?.TaxType == 'Priority Rank') {
          Priority?.push(newtest);
        }
        if (newtest?.TaxType == 'timesheetListConfigrations') {
          timeSheetConfig.current = { ...timeSheetConfig.current, [config.siteName]: newtest };
        }
        if (newtest.TaxType == 'Categories') {
          Categories.push(newtest);
        }
      }));
      siteConfigForAllSubSite.current = { ...siteConfigForAllSubSite.current, [config.siteName]: siteConfigSites };
      AllSubSiteTaskCatagory.current = { ...AllSubSiteTaskCatagory.current, [config.siteName]: Categories };
      AllSubSiteAllMetadata.current = { ...AllSubSiteAllMetadata.current, [config.siteName]: smartmetaDetails };

      console.log(AllSubSiteTaskUser?.current);
    } catch (error) {
      console.log(error);
    }
  }
  const getTaskUsers = async (config: any) => {
    try {
      const web = new Web(config?.siteUrl);
      const taskUsers = await web.lists
        .getById(config?.TaskUsertListID)
        .items.select(
          "Id",
          "Email",
          "Suffix",
          "Title",
          "Item_x0020_Cover",
          "AssingedToUser/Title",
          "AssingedToUser/EMail",
          "AssingedToUser/Id",
          "AssingedToUser/Name",
          "UserGroup/Id",
          "ItemType"
        )
        .expand("AssingedToUser", "UserGroup")
        .get();

      AllSubSiteTaskUser.current = { ...AllSubSiteTaskUser?.current, [config?.siteName]: taskUsers };

      console.log(AllSubSiteTaskUser?.current);
    } catch (error) {
      console.log(error);
    }
  };
  const getPortFolioType = async (config: any) => {
    try {
      const web = new Web(config.siteUrl);
      const PortFolioType = await web.lists
        .getById(config.PortFolioTypeID)
        .items.select(
          "Id",
          "Title",
          "Color",
          "IdRange"
        )
        .get();

      AllSubSitePortfolioTypeData.current = { ...AllSubSitePortfolioTypeData.current, [config?.siteName]: PortFolioType };
    } catch (error) {
      console.log(error);
    }

  };
  const getTaskType = async (config:any) => {
    let web = new Web(config.siteUrl);
    let taskTypeData = [];
    let typeData: any = [];
    taskTypeData = await web.lists
        .getById(config.TaskTypeID)
        .items.select(
            'Id',
            'Level',
            'Title',
            'SortOrder',
        ).get();
        AllSubSiteTaskTypeData.current=  {...AllSubSiteTaskTypeData.current,[config?.siteName]:taskTypeData}
    
    if (taskTypeData?.length > 0 && taskTypeData != undefined) {
        taskTypeData?.forEach((obj: any) => {
            if (obj != undefined) {
                let Item: any = {};
                Item.Title = obj.Title;
                Item.SortOrder = obj.SortOrder;
                Item[obj.Title + 'number'] = 0;
                Item[obj.Title + 'filterNumber'] = 0;
                Item[obj.Title + 'numberCopy'] = 0;
                typeData.push(Item);
            }
        })
        console.log("Task Type retrieved:", typeData);
        typeData = typeData.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);
        AllSubSiteTaskTypeDataItem.current={...AllSubSiteTaskTypeDataItem.current,[config?.siteName]:typeData}
        
    }
};

React.useEffect(() => {
  if (AllMetadata!=undefined && portfolioTypeData!=undefined) {
    AllSubSiteComponent()
  }
}, [AllMetadata!=undefined && portfolioTypeData!=undefined])
  const AllSubSiteComponent=async()=>{
    await Promise.all(AllSiteSubSiteListDeatails?.current?.map(async (config: any) => {
      await Promise.all([
        GetComponents(config),
        LoadAllSiteTasks(config),
       
      ]);
    }));


    console.log(AllSubSiteMasterTask.current)
    console.log(AllSubSiteTasksData.current)
    DataPrepareForCSFAWT()
  }
  const findUserByName = (name: any,siteName:any) => {
    if(AllSubSiteTaskUser?.current[siteName].length>0){
      const user = AllSubSiteTaskUser?.current[siteName].filter(
        (user: any) => user?.AssingedToUser?.Id === name
    );
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
        Image = user[0].Item_x0020_Cover.Url;
    } else {Image = `${props.props.Context.pageContext.web.absoluteUrl}/PublishingImages/Portraits/icon_user.jpg`; }
    return user ? Image : null;
    }
   
};

function removeHtmlAndNewline(text: any) {
  if (text) {
      return text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
  } else {
      return ''; // or any other default value you prefer
  }
}
const GetComponents = async (config:any) => {
  let filtercomponent:any='';
  if (portfolioTypeData.length > 0) {
      portfolioTypeData?.map((elem: any) => {
          if (filtercomponent === "") {
            filtercomponent = "";
          } else if (filtercomponent === elem.Title || filtercomponent?.toLowerCase() === elem?.Title?.toLowerCase()) { filtercomponent = "(PortfolioType/Title eq '" + elem.Title + "')" }
      })
  }
  let web = new Web(config.siteUrl);
  let componentDetails = [];
  componentDetails = await web.lists
      .getById(config.MasterTaskListID)
      .items
      .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Comments", "ItemRank", "Portfolio_x0020_Type", "Parent/Id", "Parent/Title", "HelpInformationVerifiedJson", "HelpInformationVerified",
          "DueDate", "Body", "Item_x0020_Type", "Categories", "Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
          "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", "PercentComplete",
          "ResponsibleTeam/Id", "ResponsibleTeam/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
          "Created", "Modified", "Deliverables", "TechnicalExplanations", "Help_x0020_Information", "AdminNotes", "Background", "Idea", "ValueAdded", "Sitestagging", "FeatureType/Title", "FeatureType/Id"
      )
      .expand(
          "Parent", "PortfolioType", "AssignedTo", "ClientCategory", "TeamMembers", "ResponsibleTeam", "Editor", "Author", "FeatureType"
      )
    
      .filter(filtercomponent)
      .getAll();

  console.log(componentDetails);
  ProjectData = componentDetails.filter((projectItem: any) => projectItem.Item_x0020_Type === "Project" || projectItem.Item_x0020_Type === 'Sprint');
  componentDetails.forEach((result: any) => {
      result.siteUrl = config?.siteUrl;
      result["siteType"] = "Master Tasks";
      result.siteName=config.siteName;
      result.listId = config?.MasterTaskListID;
      result.AllListId= config
      result.AllTeamName = "";
      result.SmartPriority = 0;
      result.TaskTypeValue = '';
      result.timeSheetsDescriptionSearch = '';
      result.commentsSearch = '';
      result.descriptionsSearch = '';
      result.descriptionsDeliverablesSearch = '';
      result.descriptionsHelpInformationSarch = '';
      result.descriptionsShortDescriptionSearch = '';
      result.descriptionsTechnicalExplanationsSearch = '';
      result.descriptionsBodySearch = '';
      result.descriptionsAdminNotesSearch = '';
      result.descriptionsValueAddedSearch = '';
      result.descriptionsIdeaSearch = '';
      result.descriptionsBackgroundSearch = '';
      result.portfolioItemsSearch = result.Item_x0020_Type;
      result.TeamLeaderUser = [];
      if (result.Item_x0020_Type === 'Component') {
          result.boldRow = 'boldClable'
          result.lableColor = 'f-bg';
      }
      if (result.Item_x0020_Type === 'SubComponent') {
          result.lableColor = 'a-bg';
      }
      if (result.Item_x0020_Type === 'Feature') {
          result.lableColor = 'w-bg';
      }
      if (result?.Item_x0020_Type != undefined) {
          result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
      }
      result["TaskID"] = result?.PortfolioStructureID;
      result.FeatureTypeTitle = ''
      if (result?.FeatureType?.Id != undefined) {
          result.FeatureTypeTitle = result?.FeatureType?.Title
      }
      if (result?.DueDate != null && result?.DueDate != undefined) {
          result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
      }
      if (result?.Modified != null && result?.Modified != undefined) {
          result.serverModifiedDate = new Date(result?.Modified).setHours(0, 0, 0, 0)
      }
      if (result?.Created != null && result?.Created != undefined) {
          result.serverCreatedDate = new Date(result?.Created).setHours(0, 0, 0, 0)
      }
      result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
      if (result.DisplayCreateDate == "Invalid date" || "") {
          result.DisplayCreateDate = result.DisplayCreateDate.replaceAll("Invalid date", "");
      }
      result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
      if (result.DisplayDueDate == "Invalid date" || "") {
          result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
      }
      if (result.Author) {
          result.Author.autherImage = findUserByName(result.Author?.Id,config?.siteName)
      }
      result.DisplayModifiedDate = Moment(result.Modified).format("DD/MM/YYYY");
      if (result?.Editor) {
          result.Editor.autherImage = findUserByName(result?.Editor?.Id,config?.siteName)
      }
      result.PercentComplete = (result?.PercentComplete * 100).toFixed(0) === "0" ? "" : (result?.PercentComplete * 100).toFixed(0);
      if (result.PercentComplete != undefined && result.PercentComplete != '' && result.PercentComplete != null) {
          result.percentCompleteValue = parseInt(result?.PercentComplete);
      }
      if (result?.Deliverables != undefined || result.Short_x0020_Description_x0020_On != undefined || result.TechnicalExplanations != undefined || result.Body != undefined || result.AdminNotes != undefined || result.ValueAdded != undefined
          || result.Idea != undefined || result.Background != undefined) {
          result.descriptionsSearch = `${removeHtmlAndNewline(result?.Deliverables)} ${removeHtmlAndNewline(result.Short_x0020_Description_x0020_On)} ${removeHtmlAndNewline(result.TechnicalExplanations)} ${removeHtmlAndNewline(result.Body)} ${removeHtmlAndNewline(result.AdminNotes)} ${removeHtmlAndNewline(result.ValueAdded)} ${removeHtmlAndNewline(result.Idea)} ${removeHtmlAndNewline(result.Background)}`;
      }
      if (result?.Deliverables != undefined) {
          result.descriptionsDeliverablesSearch = `${removeHtmlAndNewline(result.Deliverables)}`;
      }
      if (result.Help_x0020_Information != undefined) {
          result.descriptionsHelpInformationSarch = `${removeHtmlAndNewline(result?.Help_x0020_Information)}`;
      }
      if (result.Short_x0020_Description_x0020_On != undefined) {
          result.descriptionsShortDescriptionSearch = ` ${removeHtmlAndNewline(result.Short_x0020_Description_x0020_On)} `;
      }
      if (result.TechnicalExplanations != undefined) {
          result.descriptionsTechnicalExplanationsSearch = `${removeHtmlAndNewline(result.TechnicalExplanations)}`;
      }
      if (result.Body != undefined) {
          result.descriptionsBodySearch = `${removeHtmlAndNewline(result.Body)}`;
      }
      if (result.AdminNotes != undefined) {
          result.descriptionsAdminNotesSearch = `${removeHtmlAndNewline(result.AdminNotes)}`;
      }
      if (result.ValueAdded != undefined) {
          result.descriptionsValueAddedSearch = `${removeHtmlAndNewline(result.ValueAdded)}`;
      }
      if (result.Idea != undefined) {
          result.descriptionsIdeaSearch = `${removeHtmlAndNewline(result.Idea)}`;
      }
      if (result.Background != undefined) {
          result.descriptionsBackgroundSearch = `${removeHtmlAndNewline(result.Background)}`;
      }
      try {
          if (result?.Comments != null && result?.Comments != undefined) {
              const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
              const commentsFormData = JSON?.parse(cleanedComments);
              result.commentsSearch = commentsFormData?.reduce((accumulator: any, comment: any) => {
                  return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
              }, "").trim();
          }
      } catch (error) {
          console.error("An error occurred:", error);
      }
      result.Id = result.Id != undefined ? result.Id : result.ID;
      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
          map(result.AssignedTo, (Assig: any) => {
              if (Assig.Id != undefined) {
                  map(AllSubSiteTaskUser?.current[config?.siteName], (users: any) => {
                      if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
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
                  map(AllSubSiteTaskUser?.current[config?.siteName], (users: any) => {
                      if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
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
                  map(AllSubSiteTaskUser?.current[config?.siteName], (users: any) => {
                      if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                          users.ItemCover = users.Item_x0020_Cover;
                          result.TeamLeaderUser.push(users);
                          result.AllTeamName += users.Title + ";";
                      }
                  });
              }
          });
      }
      AllSubSitePortfolioTypeData.current[config.siteName]?.map((type: any) => {
           if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
              type[type.Title + 'number'] += 1;
              type[type.Title + 'filterNumber'] += 1;
          }
      })
      if (result?.ClientCategory?.length > 0) {
          result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
      } else {
          result.ClientCategorySearch = ''
      }
  });
  let portfolioLabelCountBackup: any = []
  try {
      // portfolioLabelCountBackup = JSON.parse(JSON.stringify(portfolioTypeDataItem));
  } catch (error) {
      console.log("backup Json parse error Page Loade master Data");
  }
  // setPortFolioTypeIconBackup(portfolioLabelCountBackup);
  AllSubSiteMasterTask.current=  {...AllSubSiteMasterTask.current, [config?.siteName]:componentDetails}

  try {
      // allMasterTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(componentDetails));
      // allLoadeDataMasterTaskAndTask = JSON.parse(JSON.stringify(componentDetails));
  } catch (error) {
      console.log("backup Json parse error Page Loade master task Data");
  }
  // AllComponetsData = componentDetails;
  // ComponetsData["allComponets"] = componentDetails;
};

const LoadAllSiteTasks = async (config3:any)=> {
  let AllTasksData: any = [];
  let Counter = 0;
 let  AllTasks:any=[]
  if (siteConfigForAllSubSite.current[config3?.siteName] != undefined && siteConfigForAllSubSite.current[config3?.siteName]?.length > 0) {
    await Promise.all (map(siteConfigForAllSubSite.current[config3?.siteName], async (config: any) => {
          let web = new Web(config3.siteUrl);
          let AllTasksMatches: any = [];
          AllTasksMatches = await web.lists
              .getById(config.listId)
              .items.select("ParentTask/Title", "ParentTask/Id", "ItemRank", "TaskLevel", "OffshoreComments", "TeamMembers/Id", "ClientCategory/Id", "ClientCategory/Title",
                  "TaskID", "ResponsibleTeam/Id", "ResponsibleTeam/Title", "ParentTask/TaskID", "TaskType/Level", "PriorityRank", "TeamMembers/Title", "FeedBack", "Title", "Id", "ID", "DueDate", "Comments", "Categories", "Status", "Body",
                  "PercentComplete", "ClientCategory", "Priority", "TaskType/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/PortfolioStructureID", "Portfolio/Title",
                  "TaskCategories/Id", "TaskCategories/Title", "TeamMembers/Name", "Project/Id", "Project/PortfolioStructureID", "Project/Title", "Project/PriorityRank", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                  "Created", "Modified", "IsTodaysTask", "workingThisWeek"
              )
              .expand(
                  "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
                  "TaskCategories", "Project",
              ).orderBy("orderby", false).filter("(PercentComplete eq 0.0 or PercentComplete eq null or (PercentComplete gt 0.0 and PercentComplete lt 0.89) or PercentComplete eq 0.89)").getAll();

          console.log(AllTasksMatches);
          Counter++;
          console.log(AllTasksMatches.length);
          if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
              $.each(AllTasksMatches, function (index: any, item: any) {
                  item.isDrafted = false;
                  item.flag = true;
                  item.TitleNew = item.Title;
                  item.childs = [];
                  item.siteType = config.Title;
                  item.siteName=config3?.siteName;
                  item.AllListId=config3
                  item.listId = config.listId;
                  item.siteUrl = config3.siteUrl;
                  item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  item.fontColorTask = "#000"
                  // if (item?.TaskCategories?.some((category: any) => category.Title.toLowerCase() === "draft")) { item.isDrafted = true; }
              });
          }
          AllTasks = AllTasks.concat(AllTasksMatches);
          if (Counter == siteConfigForAllSubSite?.current[config3?.siteName]?.length) {
              // AllTasks = AllTasks?.filter((type: any) => type.isDrafted === false);
             await Promise.all( map(AllTasks, (result: any) => {
                result.Id = result.Id != undefined ? result.Id : result.ID;
                result.TeamLeaderUser = [];
                result.AllTeamName = result.AllTeamName === undefined ? "" : result.AllTeamName;
                result.chekbox = false;
                result.timeSheetsDescriptionSearch = '';
                result.SmartPriority = 0;
                result.TaskTypeValue = '';
                result.projectPriorityOnHover = '';
                result.taskPriorityOnHover = result?.PriorityRank;
                result.showFormulaOnHover;
                result.portfolioItemsSearch = '';
                result.descriptionsSearch = '';
                result.commentsSearch = '';
                result.descriptionsDeliverablesSearch = '';
                result.descriptionsHelpInformationSarch = '';
                result.descriptionsShortDescriptionSearch = '';
                result.descriptionsTechnicalExplanationsSearch = '';
                result.descriptionsBodySearch = '';
                result.descriptionsAdminNotesSearch = '';
                result.descriptionsValueAddedSearch = '';
                result.descriptionsIdeaSearch = '';
                result.descriptionsBackgroundSearch = '';
                result.FeatureTypeTitle = ''
                if (result?.DueDate != null && result?.DueDate != undefined) {
                    result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
                }
                if (result?.Modified != null && result?.Modified != undefined) {
                    result.serverModifiedDate = new Date(result?.Modified).setHours(0, 0, 0, 0)
                }
                if (result?.Created != null && result?.Created != undefined) {
                    result.serverCreatedDate = new Date(result?.Created).setHours(0, 0, 0, 0)
                }
                result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
                if (result.DisplayCreateDate == "Invalid date" || "") {
                    result.DisplayCreateDate = result.DisplayCreateDate.replaceAll("Invalid date", "");
                }
                if (result.Author) {
                    result.Author.autherImage = findUserByName(result.Author?.Id,config3?.siteName)
                }
                result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
                if (result.DisplayDueDate == "Invalid date" || "") {
                    result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
                }
                result.DisplayModifiedDate = Moment(result.Modified).format("DD/MM/YYYY");
                if (result.Editor) {
                    result.Editor.autherImage = findUserByName(result.Editor?.Id,config3?.siteName)
                }
                if (result?.TaskType) {
                    result.portfolioItemsSearch = result?.TaskType?.Title;
                }

                result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                if (result.PercentComplete != undefined && result.PercentComplete != '' && result.PercentComplete != null) {
                    result.percentCompleteValue = parseInt(result?.PercentComplete);
                }
                // if (result?.Portfolio != undefined) {
                //     allMasterTaskDataFlatLoadeViewBackup.map((item: any) => {
                //         if (item.Id === result?.Portfolio?.Id) {
                //             result.Portfolio = item
                //             result.PortfolioType = item?.PortfolioType
                //         }
                //     })
                // }

                result.chekbox = false;
                if (result?.FeedBack && result?.FeedBack != undefined) {
                    const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
                    let descriptionSearchData = '';
                    try {
                        const feedbackData = JSON.parse(result.FeedBack);
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

                        result.descriptionsSearch = descriptionSearchData;
                    } catch (error) {
                        console.error("Error:", error);
                    }
                }

                try {
                    if (result?.Comments != null && result?.Comments != undefined) {
                        const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                        const commentsFormData = JSON?.parse(cleanedComments);
                        result.commentsSearch = commentsFormData?.reduce((accumulator: any, comment: any) => {
                            return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                        }, "").trim();
                    }
                } catch (error) {
                    console.error("An error occurred:", error);
                }
                if (
                    result.AssignedTo != undefined &&
                    result.AssignedTo.length > 0
                ) {
                    map(result.AssignedTo, (Assig: any) => {
                        if (Assig.Id != undefined) {
                            map(AllSubSiteTaskUser?.current[config3?.siteName], (users: any) => {
                                if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                    result.AllTeamName += users.Title + ";";
                                }
                            });
                        }
                    });
                }
                if (result.ResponsibleTeam != undefined && result.ResponsibleTeam.length > 0) {
                    map(result.ResponsibleTeam, (Assig: any) => {
                        if (Assig.Id != undefined) {
                            map(AllSubSiteTaskUser?.current[config3?.siteName], (users: any) => {
                                if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
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
                            map(AllSubSiteTaskUser?.current[config3?.siteName], (users: any) => {
                                if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                    result.AllTeamName += users.Title + ";";
                                }
                            });
                        }
                    });
                }
                if (result?.TaskCategories?.length > 0) {
                    result.TaskTypeValue = result?.TaskCategories?.map((val: any) => val.Title).join(",")
                }

                if (result?.ClientCategory?.length > 0) {
                    result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                } else {
                    result.ClientCategorySearch = ''
                }
                result["TaskID"] = globalCommon.GetTaskId(result);
                if (result.Project) {
                    result.ProjectTitle = result?.Project?.Title;
                    result.ProjectId = result?.Project?.Id;
                    result.projectStructerId = result?.Project?.PortfolioStructureID
                    const title = result?.Project?.Title || '';
                    const formattedDueDate = Moment(result?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                    result.joinedData = [];
                    if (result?.projectStructerId && title || formattedDueDate) {
                        result.joinedData.push(`Project ${result?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                    }
                }
                result.SmartPriority = globalCommon.calculateSmartPriority(result);
                result = globalCommon.findTaskCategoryParent(AllSubSiteTaskCatagory[config3?.siteName], result);
                result["Item_x0020_Type"] = "Task";
               
                AllTasksData.push(result);
            })) 
            

              AllSubSiteTasksData.current={...AllSubSiteTasksData.current,[config3?.siteName]:AllTasksData}
              
              // countTaskAWTLevel(AllTasksData, '');
              
              try {
                  // allTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(AllTasksData))
              } catch (error) {
                  console.log("backup Json parse error Page Loade Task Data");
              }
     
          }

      }));
      // GetComponents();
  }
};

const DataPrepareForCSFAWT=async()=>{
    isColumnDefultSortingAsc = false
    hasCustomExpanded = true
    hasExpanded = true
    isHeaderNotAvlable = false
    // setLoaded(false);
  
    // AfterFilterTaskCount = [];
    let count = 0;
    let afterFilter = true;
    // setAllSmartFilterDataBackup(structuredClone(AllMasterTasksData));
    await Promise.all(AllSiteSubSiteListDeatails?.current?.map(async (config: any) => {
        componentData = [];
        await Promise.all(
            portfolioTypeData[config?.siteName]?.map(async (port: any, index: any) => {
                count = count + 1;
             await Promise.all([componentGrouping(port?.Id, index,config)])   ;
            })
           
          ) 
      
    }))
       
       console.log(AllSubSiteFinalComponent?.current)
//  let arrays :any= Object.values(AllSubSiteFinalComponent?.current)
      let combinedAllsubSitesGrouping :any =  [].concat(...Object.keys(AllSubSiteFinalComponent?.current).map(key => AllSubSiteFinalComponent?.current[key]));
        console.log(combinedAllsubSitesGrouping)

  setData(combinedAllsubSitesGrouping);
  setLoaded(true)
  console.log(AfterFilterTaskCount);
 AfterFilterTaskCount = AfterFilterTaskCount?.filter((ele: any, ind: any, arr: any) => {
        const isDuplicate = arr.findIndex((elem: any) => { return (elem.ID === ele.ID || elem.Id === ele.Id) && elem.siteType === ele.siteType; }) !== ind
        return !isDuplicate;
    })
    // if (portfolioTypeData?.length === count) {
    //     executeOnce();
    // }
    childRef?.current?.setRowSelection({});
    childRef?.current?.setColumnFilters([]);
    childRef?.current?.setGlobalFilter('');
}
//=================== counting for all CSF START ==================
// function executeOnce() {
//     if (countAllTasksData?.length > 0) {
//         let countAllTasksData1 = countAllTasksData?.filter(
//             (ele: any, ind: any, arr: any) => {
//                 const isDuplicate =
//                     arr.findIndex((elem: any) => {
//                         return (
//                             (elem.ID === ele.ID || elem.Id === ele.Id) &&
//                             elem.siteType === ele.siteType
//                         );
//                     }) !== ind;
//                 return !isDuplicate;
//             }
//         );
//         countTaskAWTLevel(countAllTasksData1);
//     }

//     if (countAllComposubData?.length > 0) {
//         let countAllTasksData11 = countAllComposubData?.filter(
//             (ele: any, ind: any, arr: any) => {
//                 const isDuplicate =
//                     arr.findIndex((elem: any) => {
//                         return (
//                             (elem.ID === ele.ID || elem.Id === ele.Id) &&
//                             elem.siteType === ele.siteType
//                         );
//                     }) !== ind;
//                 return !isDuplicate;
//             }
//         );
//         countComponentLevel(countAllTasksData11);
//     }
// } 
// const countTaskAWTLevel = (countTaskAWTLevel: any) => {
//     if (countTaskAWTLevel.length > 0) {

//         countTaskAWTLevel.map((result: any) => {
//             taskTypeDataItem?.map((type: any) => {
//                 if (result?.TaskType?.Title === type.Title) {
//                     type[type.Title + "number"] += 1;
//                     type[type.Title + "filterNumber"] += 1;
//                 }
              
//             });
//         });

//         const taskLabelCountBackup: any = JSON.parse(JSON.stringify(taskTypeDataItem));
//         setTaskTypeDataItemBackup(taskLabelCountBackup)
//     }
// };
// const countComponentLevel = (countTaskAWTLevel: any) => {
//     if (countTaskAWTLevel?.length > 0) {
//         AllSubSitePortfolioTypeData.current[config.siteName]?.map((type: any) => {
//             countTaskAWTLevel?.map((result: any) => {
//                 if (result?.Item_x0020_Type === type?.Title) {
//                     // if(isAllTaskSelected != true){
//                     type[type.Title + "filterNumber"] += 1;
//                     type[type.Title + "number"] += 1;
//                     // }

//                 }
//             });
//         });
//         const portfolioLabelCountBackup: any = JSON.parse(JSON.stringify(portfolioTypeDataItem));
//         setPortFolioTypeIconBackup(portfolioLabelCountBackup);
//     }
// };


//==========================COUNTING FOR ALL CSF  END ============================
const componentGrouping = async (portId: any, index: any,config:any) => {
    let FinalComponent: any = []
    let AllComponents: any
    let AllProtFolioData = AllSubSiteMasterTask?.current?.[config?.siteName]?.filter((comp: any) => comp?.PortfolioType?.Id === portId && comp.TaskType === undefined);
     
        AllComponents = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === 0 || comp?.Parent?.Id === undefined);
    
 
    AllComponents?.map((masterTask: any) => {
        countAllComposubData = countAllComposubData.concat(masterTask);
        masterTask.subRows = [];

        AllSubSiteTaskTypeData?.current[config?.siteName]?.map((levelType: any) => {
            if (levelType.Level === 1)
                componentActivity(levelType, masterTask,config);
        })


        let subComFeat = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === masterTask?.Id)
        countAllComposubData = countAllComposubData.concat(subComFeat);
        masterTask.subRows = masterTask?.subRows?.concat(subComFeat);
        subComFeat?.forEach((subComp: any) => {

            subComp.subRows = [];

            AllSubSiteTaskTypeData?.current[config?.siteName]?.map((levelType: any) => {
                if (levelType.Level === 1)
                    componentActivity(levelType, subComp,config);
            })

            let allFeattData = AllProtFolioData?.filter((elem: any) => elem?.Parent?.Id === subComp?.Id);
            countAllComposubData = countAllComposubData.concat(allFeattData);
            subComp.subRows = subComp?.subRows?.concat(allFeattData);
            allFeattData?.forEach((subFeat: any) => {
                subFeat.subRows = [];

                AllSubSiteTaskTypeData?.current[config?.siteName]?.map((levelType: any) => {
                    if (levelType.Level === 1)
                        componentActivity(levelType, subFeat,config);
                })

            })

        })
        
        FinalComponent.push(masterTask)
    })
   
  
    componentData = componentData?.concat(FinalComponent);
    DynamicSort(componentData, 'PortfolioLevel', '')
     componentData.forEach((element: any) => {
        if (element?.subRows?.length > 0) {
            let level = element?.subRows?.filter((obj: any) => obj?.Item_x0020_Type != undefined && obj?.Item_x0020_Type != "Task");
            let leveltask = element?.subRows?.filter((obj: any) => obj?.Item_x0020_Type === "Task");
            DynamicSort(level, 'Item_x0020_Type', 'asc')
            element.subRows = [];
            element.subRows = level.concat(leveltask)
        }
        if (element?.subRows != undefined) {
            element?.subRows?.forEach((obj: any) => {
                let level1 = obj?.subRows?.filter((obj: any) => obj?.Item_x0020_Type != undefined && obj?.Item_x0020_Type != "Task");
                let leveltask1 = obj?.subRows?.filter((obj: any) => obj?.Item_x0020_Type === "Task");
                DynamicSort(level1, 'Item_x0020_Type', 'asc')
                obj.subRows = [];
                obj.subRows = level1?.concat(leveltask1)
            })
        }
    });

    if (portfolioTypeData[config?.siteName]?.length - 1 === index || index === '') {
       

        var temp: any = {};
        temp.Title = "Others";
        temp.TaskID = "";
        temp.subRows = [];
        temp.PercentComplete = "";
        temp.ItemRank = "";
        temp.DueDate = "";
        temp.Project = "";
        temp.DisplayCreateDate = null;
        temp.DisplayDueDate = null;
        temp.DisplayModifiedDate = null;
        temp.TaskTypeValue = "";
        temp.AllTeamName = '';
        temp.ClientCategorySearch = '';
        temp.Created = null;
        temp.Author = "";
        temp.subRows =
        AllSubSiteTasksData.current[config?.siteName]?.filter((elem1: any) =>
                elem1?.TaskType?.Id != undefined &&
                elem1?.TaskType?.Level != 1 &&
                elem1?.TaskType?.Level != 2 &&
                (elem1?.ParentTask === undefined ||
                    elem1?.ParentTask?.TaskID === null) &&
                    elem1?.Portfolio?.Title === undefined);
        countAllTasksData = countAllTasksData.concat(temp.subRows);
        temp.subRows.forEach((task: any) => {
            if (task.TaskID === undefined || task.TaskID === '')
                task.TaskID = 'T' + task.Id;
        })
        componentData.push(temp)
    }
   
    AllSubSiteFinalComponent.current={...AllSubSiteFinalComponent.current,[config?.siteName]:componentData}
   
}

const componentActivity = (levelType: any, items: any,config:any) => {
    let findActivity: any = []
    let findTasks: any = []
    if (items?.Id != undefined) {
        findActivity =  AllSubSiteTasksData.current[config?.siteName]?.filter((elem: any) => elem?.TaskType?.Id === levelType.Id && elem?.Portfolio?.Id === items?.Id);
        findTasks =  AllSubSiteTasksData.current[config?.siteName]?.filter((elem1: any) => elem1?.TaskType?.Id != levelType.Id && (elem1?.ParentTask?.Id === 0 || elem1?.ParentTask?.Id === undefined) && elem1?.Portfolio?.Id === items?.Id);
    }

    countAllTasksData = countAllTasksData.concat(findTasks);
    countAllTasksData = countAllTasksData.concat(findActivity);

    findActivity?.forEach((act: any) => {
        act.subRows = [];
        let worstreamAndTask = AllSubSiteTasksData.current[config?.siteName]?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
        countAllTasksData = countAllTasksData.concat(worstreamAndTask);
        if (worstreamAndTask.length > 0) {
            act.subRows = act?.subRows?.concat(worstreamAndTask);

        }
        worstreamAndTask?.forEach((wrkst: any) => {
            wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
            let allTasksData = AllSubSiteTasksData.current[config?.siteName]?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
            if (allTasksData.length > 0) {
                wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
                // AfterFilterTaskCount = AfterFilterTaskCount.concat(allTasksData);
                countAllTasksData = countAllTasksData.concat(allTasksData);
            }
        })

    })
  
        items.subRows = items?.subRows?.concat(findActivity)
        items.subRows = items?.subRows?.concat(findTasks)
  
}
const DynamicSort = function (items: any, column: any, orderby: any) {
    items?.sort(function (a: any, b: any) {
        var aID = a[column];
        var bID = b[column];
        if (orderby === 'asc')
            return (aID == bID) ? 0 : (aID < bID) ? 1 : -1;
        else
            return aID == bID ? 0 : aID > bID ? 1 : -1;
    });
};
const EditDataTimeEntryData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setTimeComponentData(item);
};
const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
        {
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: hasCustomExpanded,
            hasExpanded: hasExpanded,
            isHeaderNotAvlable: isHeaderNotAvlable,
            size: 55,
            id: 'Id',
        },
        {
            accessorFn: (row) => row?.portfolioItemsSearch,
            cell: ({ row, getValue }) => (
                <div className="alignCenter">
                    {row?.original?.SiteIcon != undefined ? (
                        <div className="alignCenter" title="Show All Child">
                            <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                                row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                            }
                                src={row?.original?.SiteIcon}>
                            </img>
                        </div>
                    ) : (
                        <>
                            {row?.original?.Title != "Others" ? (
                                <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                                }>
                                    {row?.original?.SiteIconTitle}
                                </div>
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </div>
            ),
            id: "portfolioItemsSearch",
            placeholder: "Type",
            header: "",
            resetColumnFilters: false,
            size: 95,
            isColumnVisible: true
        },
        {
            accessorKey: "siteName",
            placeholder: "site Name",
            header: "",
            resetColumnFilters: false,
            id: "siteName",
            isColumnVisible: true,
            size: 60,
        },
        {
            accessorFn: (row) => row?.TaskID,
            cell: ({ row, getValue }) => (
                <>
               <ReactPopperTooltipSingleLevel ShareWebId={getValue()} row={row?.original} AllListId={row?.original?.AllListId} singleLevel={true} masterTaskData={AllSubSiteMasterTask.current[row?.original?.siteName]} AllSitesTaskData={AllSubSiteTasksData?.current[row?.original?.siteName]} />
                </>
            ),
            id: "TaskID",
            placeholder: "ID",
            header: "",
            resetColumnFilters: false,
            isColumnDefultSortingAsc: isColumnDefultSortingAsc,
            // isColumnDefultSortingAsc:true,
            size: 190,
            isColumnVisible: true
        },
       
        {
            accessorFn: (row) => row?.Title,
            cell: ({ row, column, getValue }) => (
                <div className="alignCenter">
                    <span className="columnFixedTitle">
                        {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
                            <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                href={row?.original?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID}
                                 >
                                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                            </a>
                        )}
                        {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                            <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                href={row?.original?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType}
                                 >
                                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                            </a>
                        )}
                        {row?.original.Title === "Others" ? (
                            <span className="text-content" title={row?.original?.Title} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>{row?.original?.Title}</span>
                        ) : (
                            ""
                        )}
                    </span>
                    {row?.original?.Categories?.includes("Draft") ?
                        <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}
                    {row?.original?.subRows?.length > 0 ?
                        <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
                    {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != '' && (
                        <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
                    )}
                </div>
            ),
            id: "Title",
            placeholder: "Title",
            resetColumnFilters: false,
            header: "",
            size: 500,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
            cell: ({ row, column, getValue }) => (
                <>
                    {row?.original?.ProjectTitle != (null || undefined) &&
                        <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${row?.original.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`} >
                         <ReactPopperTooltip ShareWebId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={row?.original?.AllListId} /> 
                             </a></span>
                    }
                </>
            ),
            id: 'ProjectTitle',
            placeholder: "Project",
            resetColumnFilters: false,
            header: "",
            size: 70,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.TaskTypeValue,
            cell: ({ row, column, getValue }) => (
                <>
                    <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content">
                      <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /> 
                        </span></span>
                </>
            ),
            placeholder: "Task Type",
            header: "",
            resetColumnFilters: false,
            size: 130,
            id: "TaskTypeValue",
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.ClientCategorySearch,
            cell: ({ row }) => (
                <>
                    <ShowClintCatogory clintData={row?.original} AllMetadata={AllSubSiteAllMetadata.current[row?.original?.siteName]} />
                </>
            ),
            id: "ClientCategorySearch",
            placeholder: "Client Category",
            header: "",
            resetColumnFilters: false,
            size: 95,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.AllTeamName,
            cell: ({ row }) => (
                <div className="alignCenter">
               <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllSubSiteTaskUser.current[row?.original?.siteName]} Context={row?.original} />
                </div>
            ),
            id: "AllTeamName",
            placeholder: "Team",
            resetColumnFilters: false,
            header: "",
            size: 100,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.PercentComplete,
            cell: ({ row }) => (
                <div className="text-center">{row?.original?.PercentComplete}</div>
            ),
            id: "PercentComplete",
            placeholder: "Status",
            resetColumnFilters: false,
            header: "",
            size: 42,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.ItemRank,
            cell: ({ row }) => (
                <div className="text-center">{row?.original?.ItemRank}</div>
            ),
            id: "ItemRank",
            placeholder: "Item Rank",
            resetColumnFilters: false,
            header: "",
            size: 42,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.SmartPriority,
            cell: ({ row }) => (
                <div className="text-center boldClable" title={row?.original?.showFormulaOnHover}>{row?.original?.SmartPriority != 0 ? row?.original?.SmartPriority : null}</div>
            ),
            filterFn: (row: any, columnName: any, filterValue: any) => {
                if (row?.original?.SmartPriority == filterValue) {
                    return true
                } else {
                    return false
                }
            },
            id: "SmartPriority",
            placeholder: "SmartPriority",
            resetColumnFilters: false,
            header: "",
            size: 42,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.PriorityRank,
            cell: ({ row }) => (
                <div className="text-center">{row?.original?.PriorityRank}</div>
            ),
            filterFn: (row: any, columnName: any, filterValue: any) => {
                if (row?.original?.PriorityRank == filterValue) {
                    return true
                } else {
                    return false
                }
            },
            id: "PriorityRank",
            placeholder: "Priority Rank",
            resetColumnFilters: false,
            header: "",
            size: 42,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsDeliverablesSearch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsDeliverablesSearch ? row?.original?.descriptionsDeliverablesSearch?.length : ""}</span>
                    {row?.original?.descriptionsDeliverablesSearch && 
                     <InfoIconsToolTip row={row?.original} SingleColumnData={"descriptionsDeliverablesSearch"} />
                    }
                </div>
            ),
            id: "descriptionsDeliverablesSearch",
            placeholder: "Deliverables",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsHelpInformationSarch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsHelpInformationSarch ? row?.original?.descriptionsHelpInformationSarch?.length : ""}</span>
                    {row?.original?.descriptionsHelpInformationSarch && 
                     <InfoIconsToolTip row={row?.original} SingleColumnData={"Help_x0020_Information"} />
                    }
                </div>
            ),
            id: "descriptionsHelpInformationSarch",
            placeholder: "Help Information",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsShortDescriptionSearch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsShortDescriptionSearch ? row?.original?.descriptionsShortDescriptionSearch?.length : ""}</span>
                    {row?.original?.descriptionsShortDescriptionSearch && 
                 <InfoIconsToolTip row={row?.original} SingleColumnData={"Short_x0020_Description_x0020_On"} />
                    }
                </div>
            ),
            id: "descriptionsShortDescriptionSearch",
            placeholder: "Short Description",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsTechnicalExplanationsSearch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsTechnicalExplanationsSearch ? row?.original?.descriptionsTechnicalExplanationsSearch?.length : ""}</span>
                    {row?.original?.descriptionsTechnicalExplanationsSearch && 
                    <InfoIconsToolTip row={row?.original} SingleColumnData={"TechnicalExplanations"} />
                    }
                </div>
            ),
            id: "descriptionsTechnicalExplanationsSearch",
            placeholder: "Technical Explanations",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsBodySearch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsBodySearch ? row?.original?.descriptionsBodySearch?.length : ""}</span>
                    {row?.original?.descriptionsBodySearch && 
                    <InfoIconsToolTip row={row?.original} SingleColumnData={"Body"} />
                    }
                </div>
            ),
            id: "descriptionsBodySearch",
            placeholder: "Body",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsAdminNotesSearch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsAdminNotesSearch ? row?.original?.descriptionsAdminNotesSearch?.length : ""}</span>
                    {row?.original?.descriptionsAdminNotesSearch &&
                     <InfoIconsToolTip row={row?.original} SingleColumnData={"AdminNotes"} />
                     }
                </div>
            ),
            id: "descriptionsAdminNotesSearch",
            placeholder: "AdminNotes",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsValueAddedSearch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsValueAddedSearch ? row?.original?.descriptionsValueAddedSearch?.length : ""}</span>
                    {row?.original?.descriptionsValueAddedSearch &&
                     <InfoIconsToolTip row={row?.original} SingleColumnData={"ValueAdded"} />
                     }
                </div>
            ),
            id: "descriptionsValueAddedSearch",
            placeholder: "ValueAdded",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsIdeaSearch,
            cell: ({ row }) => (
                <div className="alignCenter">
                    <span>{row?.original?.descriptionsIdeaSearch ? row?.original?.descriptionsIdeaSearch?.length : ""}</span>
                    {row?.original?.descriptionsIdeaSearch &&
                     <InfoIconsToolTip row={row?.original} SingleColumnData={"Idea"} />
                     }
                </div>
            ),
            id: "descriptionsIdeaSearch",
            placeholder: "Idea",
            header: "",
            resetColumnFilters: false,
            size: 56,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.descriptionsBackgroundSearch,
            cell: ({ row }) => (
                <>
                    <span>{row?.original?.descriptionsBackgroundSearch ? row?.original?.descriptionsBackgroundSearch?.length : ""}</span>
                    {row?.original?.descriptionsBackgroundSearch && 
                    <InfoIconsToolTip row={row?.original} SingleColumnData={"Background"} />
                    }
                </>
            ),
            id: "descriptionsBackgroundSearch",
            placeholder: "Background",
            header: "",
            resetColumnFilters: false,
            size: 80,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.HelpInformationVerified,
            cell: ({ row }) => (
                <div className="alignCenter">
                    {row?.original?.HelpInformationVerified && <span> 
                        <TrafficLightComponent columnName={"HelpInformationVerified"} columnData={row?.original} usedFor="GroupByComponents" />
                        </span>}
                </div>
            ),
            id: "HelpInformationVerified",
            placeholder: "verified",
            header: "",
            resetColumnFilters: false,
            size: 130,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.FeatureTypeTitle,
            cell: ({ row }) => (
                <>
                    <span style={{ display: "flex", maxWidth: '60px' }}>
                        <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap' }} title={row?.original?.FeatureTypeTitle} >{row?.original?.FeatureTypeTitle}</span>
                    </span>
                </>
            ),
            id: "FeatureTypeTitle",
            placeholder: "Feature Type",
            header: "",
            resetColumnFilters: false,
            size: 70,
            isColumnVisible: false
        },
        {
            accessorFn: (row) => row?.DueDate,
            cell: ({ row, column, getValue }) => (
                 <HighlightableCell value={row?.original?.DisplayDueDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
            ),
            filterFn: (row: any, columnName: any, filterValue: any) => {
                if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                    return true
                } else {
                    return false
                }
            },
            id: 'DueDate',
            resetColumnFilters: false,
            resetSorting: false,
            placeholder: "DueDate",
            header: "",
            size: 91,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.Created,
            cell: ({ row }) => (
                <div className="alignCenter">
                    {row?.original?.Created == null ? (
                        ""
                    ) : (
                        <>
                            <div style={{ width: "70px" }} className="me-1">{row?.original?.DisplayCreateDate}</div>
                            {row?.original?.Author != undefined || row?.original?.AuthoId != undefined ? (
                                <>
                                    <a
                                        href={`${row.original?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                        target="_blank"
                                        data-interception="off"
                                    >
                                        <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.AuthorId != undefined ? row?.original?.AuthorId : row?.original?.Author?.Id,row?.original?.siteName)} />
                                    </a>
                                </>
                            ) : (
                                <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                            )}
                        </>
                    )}
                </div>
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
            size: 105,
            isColumnVisible: true
        },
        {
            accessorFn: (row) => row?.Modified,
            cell: ({ row, column }) => (
                <div className="alignCenter">
                    {row?.original?.Modified == null ? ("") : (
                        <>
                            <div style={{ width: "75px" }} className="me-1">
                                 <HighlightableCell value={row?.original?.DisplayModifiedDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </div>
                            {row?.original?.Editor != undefined &&
                                <>
                                     <a href={`${row.original?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Editor?.Id}&Name=${row?.original?.Editor?.Title}`}
                                        target="_blank" data-interception="off">
                                        <img title={row?.original?.Editor?.Title} className="workmember ms-1" src={findUserByName(row?.original?.EditorId != undefined ? row?.original?.EditorId : row?.original?.Editor?.Id,row?.original?.siteName)} />
                                    </a> *
                                </>
                            }
                        </>
                    )}
                </div>
            ),
            id: 'Modified',
            resetColumnFilters: false,
            resetSorting: false,
            placeholder: "Modified",
            isColumnVisible: false,
            filterFn: (row: any, columnName: any, filterValue: any) => {
                if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayModifiedDate?.includes(filterValue)) {
                    return true
                } else {
                    return false
                }
            },
            header: "",
            size: 115
        },
        {
            accessorKey: "descriptionsSearch",
            placeholder: "descriptionsSearch",
            header: "",
            resetColumnFilters: false,
            id: "descriptionsSearch",
            isColumnVisible: false
        },
        {
            accessorKey: "commentsSearch",
            placeholder: "commentsSearch",
            header: "",
            resetColumnFilters: false,
            id: "commentsSearch",
            isColumnVisible: false
        },
        {
            accessorKey: "timeSheetsDescriptionSearch",
            placeholder: "timeSheetsDescriptionSearch",
            header: "",
            resetColumnFilters: false,
            id: "timeSheetsDescriptionSearch",
            isColumnVisible: false
        },
      
        {
            accessorKey: "TotalTaskTime",
            id: "TotalTaskTime",
            placeholder: "Smart Time",
            header: "",
            resetColumnFilters: false,
            size: 49,
            isColumnVisible: true
        },
        {
            cell: ({ row }) => (
                <>
                   {row?.original?.siteType != "Master Tasks" && row?.original?.Title != "Others" && (
                        <a className="alignCenter" onClick={(e) => EditDataTimeEntryData(e, row.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
                            <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
                        </a>
                        //  <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
                    )} 
                </>
            ),
            id: "timeShitsIcons",
            canSort: false,
            placeholder: "",
            size: 1,
            isColumnVisible: true
        },
        // {
        //     header: ({ table }: any) =>
        //      (
        //         <>{
        //             // topCompoIcon ?
        //             //     <span style={{ backgroundColor: `${portfolioColor}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => trueTopIcon(true)}>
        //             //         <span className="svg__iconbox svg__icon--re-structure"></span>
        //             //     </span>
        //             //     : ''
        //         }
        //         </>
        //     ),
        //     cell: ({ row, getValue }) => (
        //         <>
        //             {row?.original?.isRestructureActive && row?.original?.Title != "Others" && (
        //                 // <span className="Dyicons p-1" title="Restructure" style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} onClick={() => callChildFunction(row?.original)}>
        //                 //     <span className="svg__iconbox svg__icon--re-structure"> </span>
        //                 // </span>
        //                  <span className="svg__iconbox svg__icon--re-structure"> </span>
        //             )}
        //             {/* {getValue()} */}
        //         </>
        //     ),
        //     id: "Restructure",
        //     canSort: false,
        //     placeholder: "",
        //     size: 1,
        //     isColumnVisible: true
        // },
        // {
        //     cell: ({ row, getValue }) => (
        //         <>
        //             {row?.original?.siteType === "Master Tasks" &&
        //                 row?.original?.Title !== "Others" && (
        //                     <a className="alignCenter"
        //                         href="#"
        //                         data-bs-toggle="tooltip"
        //                         data-bs-placement="auto"
        //                         title={'Edit ' + `${row.original.Title}`}
        //                     >
        //                         {" "}
        //                         <span
        //                             className="svg__iconbox svg__icon--edit"
        //                             // onClick={(e) => EditComponentPopup(row?.original)}
        //                         ></span>
        //                     </a>
        //                 )}
        //             {row?.original?.siteType != "Master Tasks" &&
        //                 row?.original?.Title !== "Others" && (
        //                     <a className="alignCenter"
        //                         href="#"
        //                         data-bs-toggle="tooltip"
        //                         data-bs-placement="auto"
        //                         title={'Edit ' + `${row.original.Title}`}
        //                     >
        //                         {" "}
        //                         <span
        //                             className="svg__iconbox svg__icon--edit"
        //                             // onClick={(e) => EditItemTaskPopup(row?.original)}
        //                         ></span>
        //                     </a>
        //                 )}
        //             {/* {getValue()} */}
        //         </>
        //     ),
        //     id: "editIcon",
        //     canSort: false,
        //     placeholder: "",
        //     header: "",
        //     size: 30,
        //     isColumnVisible: true
        // },
    ],
    [data]
);
const callBackData = React.useCallback((checkData: any) => {
 console.log(checkData)
}, []);
const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
}, []);

  return (
     <div id="ExandTableIds" style={{}}>
      {console.log("allportfolioId", AllSubSitePortfolioTypeData)}
     
      <div><h2 className="heading">Root Team Portfolio</h2>
            </div>
          
      <section className="Tabl1eContentSection row taskprofilepagegreen">
                <div className="container-fluid p-0">
                    <section className="TableSection">
                        <div className="container p-0">
                            <div className="Alltable mt-2 ">
                                <div className="col-sm-12 p-0 smart">
                                    <div>
                                        <div>
                                        <GlobalCommanTable  tableId="RootTeamPortfolio"
                                        // showingAllPortFolioCount={true}
                                        setData={setData} data={data} callBackData={callBackData}columnSettingIcon={true}
                                          fixedWidth={true} showHeader={true} columns={columns}>
                                            </GlobalCommanTable>
                                          {!loaded && <PageLoader />}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
     
     
     
      {IsTimeEntry && (
                <TimeEntryPopup
                    props={timeComponentData}
                    CallBackTimeEntry={TimeEntryCallBack}
                    Context={props?.props?.Context}
                ></TimeEntryPopup>
            )}
    </div>
  )
}
export default RootTeamPortfolioTableData;