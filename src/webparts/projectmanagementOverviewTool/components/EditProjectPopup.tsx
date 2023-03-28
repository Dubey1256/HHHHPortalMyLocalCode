import * as React from "react";
// import ImagesC from "./Images";
import {
  arraysEqual,
  Modal,
  Panel,
  PanelType,
  TextField,
} from "office-ui-fabric-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import "bootstrap/js/dist/tab.js";
import * as moment from "moment";
import { Web } from "sp-pnp-js";
import CommentCard from "../../../globalComponents/Comments/CommentCard";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { map } from "lodash";
import DatePicker from "react-datepicker";
import { ClickAwayListener } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import Picker from "../../../globalComponents/EditTaskPopup/SmartMetaDataPicker";
import ComponentPortPolioPopup from "../../EditPopupFiles/ComponentPortfolioSelection";
import { EditorState } from "draft-js";
import HtmlEditorCard from "../../../globalComponents/HtmlEditor/HtmlEditor";
import TeamConfigurationCard from "../../../globalComponents/TeamConfiguration/TeamConfiguration";
import Tooltip from "../../../globalComponents/Tooltip";
// import ImagesC from "./Image";
import { AllOut } from "@material-ui/icons";
import VersionHistoryPopup from "../../../globalComponents/VersionHistroy/VersionHistory";
import PortfolioTagging from "./PortfolioTagging";

var PostTechnicalExplanations = "";
var PostDeliverables = "";
var PostShort_x0020_Description_x0020_On = "";
var PostBody = "";
var AllUsers: any = [];
var Assin: any = [];
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TeamMemberIds: any = [];
var Backupdata: any = [];
var BackupCat: any = "";
let portfolioType = "";
let listID = "EC34B38F-0669-480A-910C-F84E92E58ADF";
function EditProjectPopup(item: any) {
  // Id:any
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  const [CompoenetItem, setComponent] = React.useState([]);
  const [update, setUpdate] = React.useState(0);
  const [EditData, setEditData] = React.useState<any>({});
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [SharewebItemRank, setSharewebItemRank] = React.useState([]);
  const [isOpenPicker, setIsOpenPicker] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);

  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [SharewebCategory, setSharewebCategory] = React.useState("");
  const [CollapseExpend, setCollapseExpend] = React.useState(true);
  const [CategoriesData, setCategoriesData] = React.useState([]);
  const TeamConfigInfo = item.props;
  const [smartComponentData, setSmartComponentData] = React.useState([]);
  const [TeamConfig, setTeamConfig] = React.useState();
  const [date, setDate] = React.useState(undefined);
  const [siteDetails, setsiteDetails] = React.useState([]);
  const [checkedCat, setcheckedCat] = React.useState(false);
  const [linkedComponentData, setLinkedComponentData] = React.useState([]);
  const [Startdate, setStartdate] = React.useState(undefined);
  const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
  const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
  const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
  const [Completiondate, setCompletiondate] = React.useState(undefined);
  const [AssignUser, setAssignUser] = React.useState(undefined);
  const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  // $('.ms-Dialog-main .main-153').hide();
  const setModalIsOpenToTrue = (e: any) => {
    // e.preventDefault()
    setModalIsOpen(true);
  };
  const onEditorStateChange = React.useCallback(
    (rawcontent) => {
      setEditorState(rawcontent.blocks[0].text);
    },
    [editorState]
  );
  const setModalIsOpenToFalse = () => {
    EditComponentCallback();
    setModalIsOpen(false);
  };
  const handleDate = (date: any) => {
    EditData.CompletedDate = date;
    setCompletiondate(date);
    setComponent((EditData) => [...EditData]);
  };
  const handleDatestart = (date: any) => {
    EditData.StartDate = date;
    setStartdate(date);
    setComponent((EditData) => [...EditData]);
  };
  const handleDatedue = (date: any) => {
    EditData.DueDate = date;
    setDate(date);
    setComponent((EditData) => [...EditData]);
  };
  const Call = React.useCallback((item: any, type: any) => {
    setIsPortfolio(false);
    // if (type == "SmartComponent") {
    //     if (EditData != undefined && item1 != undefined) {
    //         item.props.smartComponent = item1.smartComponent;
    //         setSmartComponentData(item1.smartComponent);
    //     }

    // }

    if (type === "Service") {
      if (item?.smartService?.length > 0) {
        setLinkedComponentData(item.smartService);
      }
    }
    if (type === "Component") {
      if (item?.smartComponent?.length > 0) {
        setSmartComponentData(item.smartComponent);
      }
    }

    if (type == "Category") {
      if (item != undefined && item.Categories != "") {
        var title: any = {};
        title.Title = item.categories;
        item.categories.map((itenn: any) => {
          if (!isItemExists(CategoriesData, itenn.Id)) {
            CategoriesData.push(itenn);
          }
        });
        item.SharewebCategories.map((itenn: any) => {
          CategoriesData.push(itenn);
        });

        //  Backupdata = CategoriesData
        setCategoriesData(CategoriesData);
        //item.props.smartCategories = item1.smartCategories;
        //  item.props.smartCategories.push(title);
      }
    }
    if (type == "LinkedComponent") {
      if (item?.linkedComponent?.length > 0) {
        // Item.props.linkedComponent = item1.linkedComponent;
        // setEditData({ ...EditData, RelevantPortfolio: propsItems.linkedComponent })
        setLinkedComponentData(item.linkedComponent);
        // console.log("Popup component linkedComponent", item.linkedComponent)
      }
    }
    if (CategoriesData != undefined) {
      CategoriesData.forEach(function (type: any) {
        CheckCategory.forEach(function (val: any) {
          if (type.Id == val.Id) {
            BackupCat = type.Id;
            setcheckedCat(true);
          }
        });
      });
      setUpdate(update + 2);
    }
    setIsComponentPicker(false);
    setIsComponent(false);
    // setComponent(CompoenetItem => ([...CompoenetItem]));
  }, []);
  var isItemExists = function (arr: any, Id: any) {
    var isExists = false;
    $.each(arr, function (index: any, items: any) {
      if (items.ID === Id) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  const GetTaskUsers = async () => {
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let taskUsers = [];
    taskUsers = await web.lists.getByTitle("Task Users").items.top(4999).get();
    AllUsers = taskUsers;
    var UpdatedData: any = {};
    AllUsers.forEach(function (taskUser: any) {
      // item.props.AssignedTo.forEach(function(assign:any){
      //     if (taskUser.AssingedToUserId == assign.Id) {
      //         UpdatedData['AuthorName'] = taskUser.Title;
      //         UpdatedData['Company'] = taskUser.Company;
      //         UpdatedData['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
      //     }
      //     Assin.push(UpdatedData)
      // })
      setAssignUser(Assin);
    });
  };
  // var ConvertLocalTOServerDate = function (LocalDateTime: any, dtformat: any) {
  //     if (dtformat == undefined || dtformat == '') dtformat = "DD/MM/YYYY";

  //     // below logic works fine in all condition
  //     if (LocalDateTime != '') {
  //         var serverDateTime;
  //         var vLocalDateTime = new Date(LocalDateTime);
  //         //var offsetObj = GetServerOffset();
  //         //var IANATimeZoneName = GetIANATimeZoneName();
  //         var mDateTime = moment(LocalDateTime);
  //         // serverDateTime = mDateTime.tz('Europe/Berlin').format(dtformat); // 5am PDT
  //         //serverDateTime = mDateTime.tz('America/Los_Angeles').format(dtformat);  // 5am PDT
  //         return serverDateTime;
  //     }
  //     return '';
  // }
  var getMultiUserValues = function (item: any) {
    var users = "";
    var isuserexists = false;
    var userarray = [];
    if (item.AssignedTo != undefined && item.AssignedTo.results != undefined)
      userarray = item.AssignedTo.results;
    for (var i = 0; i < userarray.length; i++) {
      users += userarray[i].Title + ", ";
    }
    if (users.length > 0) users = users.slice(0, -2);
    return users;
  };
  var parseJSON = function (jsonItem: any) {
    var json = [];
    try {
      json = JSON.parse(jsonItem);
    } catch (err) {
      console.log(err);
    }
    return json;
  };
  var LIST_CONFIGURATIONS_TASKS =
    '[{"Title":"Gruene","listId":"2302E0CD-F41A-4855-A518-A2B1FD855E4C","siteName":"Gruene","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.gruene-washington.de","MetadataName":"SP.Data.GrueneListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/logo-gruene.png"},{"Title":"DE","listId":"3204D169-62FD-4240-831F-BCDDA77F5028","siteName":"DE","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Development-Effectiveness","MetadataName":"SP.Data.DEListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png"},{"Title":"DRR","listId":"CCBCBAFE-292E-4384-A800-7FE0AAB1F70A","siteName":"DRR","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.DRRListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_drr.png"},{"Title":"Education","listId":"CF45B0AD-7BFF-4778-AF7A-7131DAD2FD7D","siteName":"Education","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/education","MetadataName":"SP.Data.EducationListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png"},{"Title":"EI","listId":"E0E1FC6E-0E3E-47F5-8D4B-2FBCDC3A5BB7","siteName":"EI","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei","MetadataName":"SP.Data.EIListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png"},{"Title":"EPS","listId":"EC6F0AE9-4D2C-4943-9E79-067EC77AA613","siteName":"EPS","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/eps","MetadataName":"SP.Data.EPSListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png"},{"Title":"Gender","listId":"F8FD0ADA-0F3C-40B7-9914-674F63F72ABA","siteName":"Gender","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.GenderListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png"},{"Title":"Health","listId":"E75C6AA9-E987-43F1-84F7-D1818A862076","siteName":"Health","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Health","MetadataName":"SP.Data.HealthListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_health.png"},{"Title":"HHHH","listId":"091889BD-5339-4D11-960E-A8FF38DF414B","siteName":"HHHH","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.HHHHListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png"},{"Title":"KathaBeck","listId":"beb3d9d7-daf3-4c0f-9e6b-fd36d9290fb9","siteName":null,"siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://kathabeck.sharepoint.com/sites/TeamK4Bundestag","MetadataName":"SP.Data.KathaBeckListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png"},{"Title":"QA","listId":"61B71DBD-7463-4B6C-AF10-6609A23AE650","siteName":"QA","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/qa","MetadataName":"SP.Data.QAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png"},{"Title":"ALAKDigital","listId":"d70271ae-3325-4fac-9893-147ee0ba9b4d","siteName":"ALAKDigital","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei/digitaladministration","MetadataName":"SP.Data.ALAKDigitalListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_DA.png"},{"Title":"Shareweb","listId":"B7198F49-D58B-4D0A-ADAD-11995F6FADE0","siteName":"Shareweb","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/joint","MetadataName":"SP.Data.SharewebListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png"},{"Title":"Small Projects","listId":"3AFC4CEE-1AC8-4186-B139-531EBCEEA0DE","siteName":"Small Projects","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Small_x0020_ProjectsListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/small_project.png"},{"Title":"Offshore Tasks","listId":"BEB90492-2D17-4F0C-B332-790BA9E0D5D4","siteName":"Offshore Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.SharewebQAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/offshore_Tasks.png"},{"Title":"Migration","listId":"D1A5AC25-3DC2-4939-9291-1513FE5AC17E","siteName":"Migration","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Migration","MetadataName":"SP.Data.MigrationListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png"},{"Title":"Master Tasks","listId":"EC34B38F-0669-480A-910C-F84E92E58ADF","siteName":"Master Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Master_x0020_TasksListItem","ImageUrl":"","ImageInformation":[{"ItemType":"Component","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/feature_icon.png"}]}]';
  var GetIconImageUrl = function (listName: any, listUrl: any, Item: any) {
    var IconUrl = "";
    if (listName != undefined) {
      let TaskListsConfiguration = parseJSON(LIST_CONFIGURATIONS_TASKS);
      let TaskListItem = TaskListsConfiguration.filter(function (
        filterItem: any
      ) {
        let SiteRelativeUrl = filterItem.siteUrl;
        return (
          filterItem.Title.toLowerCase() == listName.toLowerCase() &&
          SiteRelativeUrl.toLowerCase() == listUrl.toLowerCase()
        );
      });
      if (TaskListItem.length > 0) {
        if (Item == undefined) {
          IconUrl = TaskListItem[0].ImageUrl;
        } else if (TaskListItem[0].ImageInformation != undefined) {
          var IconUrlItem = TaskListItem[0].ImageInformation.filter(function (
            index: any,
            filterItem: any
          ) {
            return (
              filterItem.ItemType == Item.Item_x0020_Type &&
              filterItem.PortfolioType == Item.Portfolio_x0020_Type
            );
          });
          if (IconUrlItem != undefined && IconUrlItem.length > 0) {
            IconUrl = IconUrlItem[0].ImageUrl;
          }
        }
      }
    }
    return IconUrl;
  };

  const getpriority = function (item: any) {
    if (item.Priority_x0020_Rank >= 0 && item.Priority_x0020_Rank <= 3) {
      item.Priority = "(3) Low";
    }
    if (item.Priority_x0020_Rank >= 4 && item.Priority_x0020_Rank <= 7) {
      item.Priority = "(2) Normal";
    }
    if (item.Priority_x0020_Rank >= 8) {
      item.Priority = "(1) High";
    }
  };

  var getMasterTaskListTasks = async function () {
    //  var query = "ComponentCategory/Id,ComponentCategory/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,SiteCompositionSettings,PortfolioStructureID,ItemRank,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,Deliverable_x002d_Synonyms,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title";
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let componentDetails = [];
    componentDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      // .getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getByTitle("Master Tasks")
      .items.select(
        "ComponentCategory/Id",
        "ComponentCategory/Title",
        "SiteCompositionSettings",
        "PortfolioStructureID",
        "ItemRank",
        "ShortDescriptionVerified",
        "Portfolio_x0020_Type",
        "BackgroundVerified",
        "descriptionVerified",
        "Synonyms",
        "BasicImageInfo",
        "Deliverable_x002d_Synonyms",
        "OffshoreComments",
        "OffshoreImageUrl",
        "HelpInformationVerified",
        "IdeaVerified",
        "TechnicalExplanationsVerified",
        "Deliverables",
        "DeliverablesVerified",
        "ValueAddedVerified",
        "CompletedDate",
        "Idea",
        "ValueAdded",
        "TechnicalExplanations",
        "Item_x0020_Type",
        "Sitestagging",
        "Package",
        "Parent/Id",
        "Parent/Title",
        "Short_x0020_Description_x0020_On",
        "Short_x0020_Description_x0020__x",
        "Short_x0020_description_x0020__x0",
        "Admin_x0020_Notes",
        "AdminStatus",
        "Background",
        "Help_x0020_Information",
        "SharewebComponent/Id",
        "SharewebCategories/Id",
        "SharewebCategories/Title",
        "Priority_x0020_Rank",
        "Reference_x0020_Item_x0020_Json",
        "Team_x0020_Members/Title",
        "Team_x0020_Members/Name",
        "Component/Id",
        "Services/Id",
        "Services/Title",
        "Services/ItemType",
        "Component/Title",
        "Component/ItemType",
        "Team_x0020_Members/Id",
        "Item_x002d_Image",
        "component_x0020_link",
        "IsTodaysTask",
        "AssignedTo/Title",
        "AssignedTo/Name",
        "AssignedTo/Id",
        "AttachmentFiles/FileName",
        "FileLeafRef",
        "FeedBack",
        "Title",
        "Id",
        "PercentComplete",
        "Company",
        "StartDate",
        "DueDate",
        "Comments",
        "Categories",
        "Status",
        "WebpartId",
        "Body",
        "Mileage",
        "PercentComplete",
        "Attachments",
        "Priority",
        "Created",
        "Modified",
        "Author/Id",
        "Author/Title",
        "Editor/Id",
        "Editor/Title",
        "ClientCategory/Id",
        "ClientCategory/Title"
      )
      .expand(
        "ClientCategory",
        "ComponentCategory",
        "AssignedTo",
        "Component",
        "Services",
        "AttachmentFiles",
        "Author",
        "Editor",
        "Team_x0020_Members",
        "SharewebComponent",
        "SharewebCategories",
        "Parent"
      )
      .filter("Id eq " + item.props.Id + "")
      .get();
    console.log(componentDetails);

    // var query = "ComponentCategory/Id,ComponentCategory/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,SiteCompositionSettings,PortfolioStructureID,ItemRank,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,Deliverable_x002d_Synonyms,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title&$expand=ClientCategory,ComponentCategory,AssignedTo,Component,ComponentPortfolio,ServicePortfolio,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Id eq " + item.props.Id + "";
    // $.ajax({
    //     url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items?$select=" + query + "",
    //     method: "GET",
    //     headers: {
    //         "Accept": "application/json; odata=verbose"
    //     },
    //     success: function (data) {
    var Tasks = componentDetails;
    $.each(Tasks, function (index: any, item: any) {
      item.DateTaskDueDate = new Date(item.DueDate);
      if (item.DueDate != null)
        item.TaskDueDate = moment(item.DueDate).format("DD/MM/YYYY");
      // item.TaskDueDate = ConvertLocalTOServerDate(item.DueDate, 'DD/MM/YYYY');
      item.FilteredModifiedDate = item.Modified;
      item.DateModified = new Date(item.Modified);
      item.DateCreatedNew = new Date(item.Created);

      item.DateCreated = item.CreatedDate = moment(item.Created).format(
        "DD/MM/YYYY"
      ); // ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
      item.Creatednewdate = moment(item.Created).format("DD/MM/YYYY"); //ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY HH:mm');
      // item.Modified = moment(item.Modified).format('DD/MM/YYYY');
      //ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY HH:mm');
      if (item.Priority_x0020_Rank == undefined && item.Priority != undefined) {
        switch (item.Priority) {
          case "(1) High":
            item.Priority_x0020_Rank = 8;
            break;
          case "(2) Normal":
            item.Priority_x0020_Rank = 4;
            break;
          case "(3) Low":
            item.Priority_x0020_Rank = 1;
            break;
        }
      }
      getpriority(item);
      item.assigned = getMultiUserValues(item);
      if (item.ItemRank != undefined)
        item.ItemRankTitle = TaskItemRank[0].filter(
          (option: { rank: any }) => option.rank == item.ItemRank
        )[0].rankTitle;
      item.PercentComplete =
        item.PercentComplete <= 1
          ? item.PercentComplete * 100
          : item.PercentComplete;
      if (item.PercentComplete != undefined) {
        item.PercentComplete = parseInt(item.PercentComplete.toFixed(0));
      }
      item.smartComponent = [];
      item.smartCategories = [];

      if (item.Sitestagging != undefined && item.Sitestagging != null) {
        item.Sitestagging = JSON.parse(item.Sitestagging);
        item.Sitestagging.forEach(function (site: any) {
          siteDetail.forEach(function (siteDetail: any) {
            siteDetail.isEditableSiteDate = false;
            if (siteDetail.Title == site.Title) {
              siteDetail.Date = site.Date;
              siteDetail.ClienTimeDescription = site.ClienTimeDescription;
              siteDetail.Selected = true;
              siteDetail.flag = true;
            }
          });
        });
      }

      item.AssignedUsers = [];
      AllUsers?.map((userData: any) => {
        item.AssignedTo?.map((AssignedUser: any) => {
          if (userData?.AssingedToUserId == AssignedUser.Id) {
            item.AssignedUsers.push(userData);
          }
        });
      });
      if (item.SharewebCategories != undefined) {
        if (item.SharewebCategories.results != undefined) {
          map(item.SharewebCategories.results, (bj) => {
            if (bj.Title != undefined)
              item.smartCategories.push({ Title: bj.Title, Id: bj.Id });
          });
        }
      }
      item.siteType = "Master Tasks";
      item.taskLeader = "None";
      if (
        item.AssignedTo != undefined &&
        item.AssignedTo.results != undefined &&
        item.AssignedTo.results.length > 0
      )
        item.taskLeader = getMultiUserValues(item);
      if (item.Task_x0020_Type == undefined)
        item.Task_x0020_Type = "Activity Tasks";
      if (item.DueDate != undefined) {
        item.DueDate = moment(item.DueDate).format("DD/MM/YYYY");
        // setDate(item.DueDate);
      }
      if (item.SharewebCategories != null) {
        setCategoriesData(item.SharewebCategories);
      }
      if (item.SharewebCategories != null) {
        item.SharewebCategories.forEach(function (type: any) {
          CheckCategory.forEach(function (val: any) {
            if (type.Id == val.Id) {
              BackupCat = type.Id;
              setcheckedCat(true);
            }
          });
        });
      }
      if (item.Component?.length > 0) {
        setSmartComponentData(item.Component);
      }
      if (item.Services?.length > 0) {
        setLinkedComponentData(item.Services);
      }
      var Rr: any = [];
      if (item.ServicePortfolio != undefined) {
        Rr.push(item.ServicePortfolio);
        setLinkedComponentData(Rr);
      }
      if (item.StartDate != undefined) {
        item.StartDate = moment(item.StartDate).format("DD/MM/YYYY");
        //setStartdate(item.StartDate);
      }
      if (item.component_x0020_link != null) {
        item.component_x0020_link = item.component_x0020_link.Url;
        //setStartdate(item.StartDate);
      }
      if (item.CompletedDate != undefined) {
        item.CompletedDate = moment(item.CompletedDate).format("DD/MM/YYYY");
        // item.CompletedDate = item.CompletedDate.toString();
        // setCompletiondatenew(item.CompletedDate);
      }
      item.SmartCountries = [];
      item.siteUrl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP";
      item["SiteIcon"] =
        item.siteType == "Master Tasks"
          ? GetIconImageUrl(
              item.siteType,
              "https://hhhhteams.sharepoint.com/sites/HHHH/SP/",
              undefined
            )
          : GetIconImageUrl(
              item.siteType,
              "https://hhhhteams.sharepoint.com/sites/HHHH/SP/",
              undefined
            );
      if (item.Synonyms != undefined && item.Synonyms.length > 0) {
        item.Synonyms = JSON.parse(item.Synonyms);
      }
    });
    //  deferred.resolve(Tasks);
    setComponent(Tasks);
    setEditData(Tasks[0]);
    setModalIsOpenToTrue(true);

    //  setModalIsOpenToTrue();
  };

  var ListId: any = "";
  var CurrentSiteUrl: any = "";
  //var SharewebItemRank: any = '';
  const [state, setState] = React.useState("state");

  const loadDataOnlyOnce = React.useCallback(() => {
    console.log(`I need ${state}!!`);
  }, [state]);

  var Item: any = "";
  const TaskItemRank: any = [];
  const site: any = [];
  const siteDetail: any = [];
  const GetSmartmetadata = async () => {
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let smartmetaDetails = [];
    smartmetaDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getByTitle("SmartMetadata")
      .items//.getById(this.state.itemID)
      .select(
        "ID,Title,IsVisible,ParentID,Parent/Id,Parent/Title,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable"
      )
      .expand("Parent")
      .top(4999)
      .get();

    console.log(smartmetaDetails);
    if (smartmetaDetails != undefined) {
      smartmetaDetails.forEach(function (val: any) {
        if (val.TaxType == "Sites") {
          site.push(val);
        }
      });
      site.forEach(function (val: any) {
        if (
          val.listId != undefined &&
          val.Title != "Master Tasks" &&
          val.Title != "Small Projects" &&
          val.Title != "Foundation" &&
          val.Title != "Offshore Tasks" &&
          val.Title != "DRR" &&
          val.Title != "Health" &&
          val.Title != "Gender"
        ) {
          siteDetail.push(val);
        }
      });
    }
    setsiteDetails(siteDetail);
    getMasterTaskListTasks();
  };

  React.useEffect(() => {
    GetTaskUsers();
    var initLoading = function () {
      if (item.props != undefined) {
        var Item = item.props;
        if (Item.siteType == "HTTPS:") {
          Item.siteType = "HHHH";
        }
        GetSmartmetadata();

        ListId = "ec34b38f-0669-480a-910c-f84e92e58adf";
        CurrentSiteUrl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/";
        TaskItemRank.push([
          { rankTitle: "Select Item Rank", rank: null },
          { rankTitle: "(8) Top Highlights", rank: 8 },
          { rankTitle: "(7) Featured Item", rank: 7 },
          { rankTitle: "(6) Key Item", rank: 6 },
          { rankTitle: "(5) Relevant Item", rank: 5 },
          { rankTitle: "(4) Background Item", rank: 4 },
          { rankTitle: "(2) to be verified", rank: 2 },
          { rankTitle: "(1) Archive", rank: 1 },
          { rankTitle: "(0) No Show", rank: 0 },
        ]);
        setSharewebItemRank(TaskItemRank[0]);
        // if (useeffectdata == false)
        //     setuseeffectdata(true);
        // else setuseeffectdata(false);
        //loadColumnDetails();
      }
    };
    initLoading();
  }, []);
  const EditComponent = (items: any, title: any) => {
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsComponent(true);
    setSharewebComponent(items);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };
  const GetComponents = async () => {
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let componentDetails = [];
    componentDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getByTitle("Master Tasks")
      .items//.getById(this.state.itemID)
      .select(
        "ID",
        "Title",
        "DueDate",
        "Status",
        "ItemRank",
        "Item_x0020_Type",
        "Parent/Id",
        "Author/Id",
        "Author/Title",
        "Parent/Title",
        "SharewebCategories/Id",
        "SharewebCategories/Title",
        "AssignedTo/Id",
        "AssignedTo/Title",
        "Team_x0020_Members/Id",
        "Team_x0020_Members/Title",
        "ClientCategory/Id",
        "ClientCategory/Title"
      )
      .expand(
        "Team_x0020_Members",
        "Author",
        "ClientCategory",
        "Parent",
        "SharewebCategories",
        "AssignedTo"
      )
      .top(4999)
      .filter("Item_x0020_Type eq Component")
      .get();

    console.log(componentDetails);
  };
  function EditComponentCallback() {
    item.Call();
  }
  let mentionUsers: any = [];
  //  mentionUsers = this.taskUsers.map((i:any)=>{
  //     return({id : i.Title,display: i.Title})
  // });

  var generateHierarchichalData = function (item: any, items: any) {
    var autoCompleteItem: any = {};
    autoCompleteItem["value"] = item.Title;
    autoCompleteItem["Id"] = item.Id;
    autoCompleteItem["description"] = item.Description1;
    autoCompleteItem["TaxType"] = item.TaxType;
    if (item.SiteType != undefined)
      autoCompleteItem["SiteType"] = item.SiteType;
    autoCompleteItem["label"] = item.Title;
    map(items, (parentItem) => {
      if (item.ParentID == parentItem.Id) {
        autoCompleteItem["label"] = parentItem.Title + " > " + item.Title;
        if (parentItem.ParentID > 0) {
          map(items, (gParentItem) => {
            if (parentItem.ParentID == gParentItem.Id) {
              autoCompleteItem["label"] =
                gParentItem.Title + " > " + autoCompleteItem.label;
              if (gParentItem.ParentID > 0) {
                map(items, (mParentItem) => {
                  if (gParentItem.ParentID == mParentItem.Id) {
                    autoCompleteItem["label"] =
                      mParentItem.Title + " > " + autoCompleteItem.label;

                    return false;
                  }
                });
              }
            }
          });
        }

        return false;
      }
    });

    return autoCompleteItem;
  };
  // const bindAutoCompleteId = function (countrolId:any, taxItems:any, taxType:any, service:any, CompositionSiteType:any) {
  //     var Items:any = [];
  //     $.each(taxItems, function (taxItem:any) {
  //         if (taxItem.TaxType == taxType && taxItem.TaxType != 'Components') {
  //             var item = generateHierarchichalData(taxItem, taxItems);
  //             item["Title"] = item.value;
  //             Items.push(item);
  //         }
  //         if (taxItem.TaxType == 'Components') {
  //             var item = generateHierarchichalData(taxItem, taxItems);
  //             item["Title"] = item.value;
  //             Items.push(item);
  //         }
  //     });
  //     $("#" + countrolId).autocomplete({
  //         source: function (request:any, response:any) {
  //             // delegate back to autocomplete, but extract the last term
  //             //var index= request.term.indexOf("@");
  //             // if (request.term != undefined && request.term[index] == '@')
  //             //     request.term = request.term.substr(index + 1, request.term.length);
  //             //response($.ui.autocomplete.filter(Items, $scope.extractLast(request.term)));
  //             var responseItems = $.ui.autocomplete.filter(Items, $scope.extractLast(request.term));
  //             SharewebCommonFactoryService.DynamicSortitems(responseItems, 'label', 'Text', 'Ascending')
  //             response(responseItems);

  //         },
  //         focus: function () {
  //             // prevent value inserted on focus
  //             return false;
  //         },
  //         select: function (event, ui) {
  //             var terms = $scope.split(this.value);
  //             // remove the current input
  //             terms.pop();
  //             // add the selected item
  //             terms.push(ui.item.value);
  //             // add placeholder to get the comma-and-space at the end
  //             terms.push("");
  //             this.value = terms.join("; ");
  //             if (ui.item.TaxType != undefined && service == 'Service') {
  //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.ServicesmartComponent, ui.item.Id)) {
  //                     ui.item['siteType'] = 'Master Tasks';
  //                     $scope.ServicesmartComponent[0] = ui.item;
  //                     $scope.SmartCompCopy[0] = ui.item;
  //                     $scope.$apply();
  //                 }
  //                 $('#txtServiceSharewebComponent').val('');
  //                 $('#txtServiceSharewebComponentselsction').val('');
  //             } else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Components') {
  //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartComponent, ui.item.Id)) {
  //                     ui.item['siteType'] = 'Master Tasks';
  //                     $scope.smartComponent[0] = ui.item;
  //                     $scope.SmartCompCopy[0] = ui.item;
  //                     $scope.$apply();
  //                     $scope.Item.Portfolio_x0020_Type == 'Component'
  //                 }
  //                 $('#txtSharewebComponent').val('');
  //                 $('#txtSharewebComponentselsction').val('');
  //             } else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Categories') {
  //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartCategories, ui.item.Id)) {
  //                     $scope.smartCategories.push(ui.item);
  //                     $scope.$apply();
  //                 }
  //                 $('#txtCategories').val('');
  //             } else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Sites') {
  //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.TargetedSites, ui.item.Id)) {
  //                     $scope.TargetedSites.push(ui.item);
  //                     $scope.$apply();
  //                 }
  //                 $('#txtSites').val('');
  //             }
  //             else if (ui.item.TaxType != undefined && ui.item.TaxType == 'SPComponents') {
  //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartSPComponents, ui.item.Id)) {
  //                     $scope.smartSPComponents.push(ui.item);
  //                     $scope.$apply();
  //                 }
  //                 $('#txtSPComponents').val('');
  //                 $('#txtSPComponentsselsction').val('');
  //             }
  //             else if (ui.item.TaxType != undefined && ui.item.TaxType == 'Client Category') {
  //                 $scope.IsUpdateClientCategory = true;
  //                 if (ui.item.Id != undefined && !$scope.isItemExists($scope.smartClientCategories, ui.item.Id)) {
  //                     if ($scope.smartClientCategories != undefined && $scope.smartClientCategories.length > 0) {
  //                         angular.forEach($scope.smartClientCategories, function (clientcategory, index) {
  //                             $scope.IsPushed = true;
  //                             if (clientcategory.SiteType == ui.item.SiteType && !$scope.isItemExists($scope.smartClientCategories, ui.item.Id)) {
  //                                 $scope.smartClientCategories.push(ui.item);
  //                                 $scope.IsPushed = false
  //                             }
  //                         })
  //                         if ($scope.IsPushed == true && !$scope.isItemExists($scope.smartClientCategories, ui.item.Id))
  //                             $scope.smartClientCategories.push(ui.item);
  //                     }
  //                     else {
  //                         if (!$scope.isItemExists($scope.smartClientCategories, ui.item.Id))
  //                             $scope.smartClientCategories.push(ui.item);
  //                     }
  //                 }
  //                 angular.forEach($scope.smartClientCategories, function (item) {
  //                     if (item.SiteType == 'EI' && !$scope.isItemExists($scope.EIClientCategory, item.Id)) {
  //                         $scope.EIClientCategory.push(item);
  //                     }

  //                     else if (item.SiteType == 'EPS' && !$scope.isItemExists($scope.EPSClientCategory, item.Id)) {
  //                         $scope.EPSClientCategory.push(item);
  //                     }
  //                     else if (item.SiteType == 'Education' && !$scope.isItemExists($scope.EducationClientCategory, item.Id)) {
  //                         $scope.EducationClientCategory.push(item);
  //                     }

  //                 })
  //                 $scope.$apply();
  //                 $scope.CurrentCCSiteType = CompositionSiteType;
  //                 $('#UpdateCCItem').show();
  //                 $('#txtclientCategories').val('');
  //                 $('#EItxtclientCategories').val('');
  //                 $('#EPStxtclientCategories').val('');
  //                 $('#EducationtxtclientCategories').val('');
  //                 $('#txtclientCategories1').val('');
  //             }
  //             return false;
  //         }
  //     });
  // }
  const setPriority = function (item: any, val: number) {
    item.Priority_x0020_Rank = val;
    getpriority(item);

    setComponent((EditData) => [...EditData]);
  };
  const EditPortfolio = (item: any, type: any) => {
    if (type == "Component") {
      if (item.Component != undefined) {
        item.smartComponent = [];
        if (item.smartComponent != undefined) {
          item?.Component?.map((com: any) => {
            item.smartComponent.push({ Title: com?.Title, Id: com?.Id });
          });
        }
      }
    } else if (type == "Service") {
      if (item.Services != undefined) {
        item.smartService = [];
        if (item.smartService != undefined) {
          item?.Services?.map((com: any) => {
            item.smartService.push({ Title: com?.Title, Id: com?.Id });
          });
        }
      }
    }
    portfolioType = type;
    setIsPortfolio(true);
    setSharewebComponent(item);
  };
  const setPriorityNew = function (e: any, item: any) {
    item.Priority_x0020_Rank = e.target.value;
    switch (item.Priority_x0020_Rank) {
      case "8":
        item.Priority = "(1) High";
        break;
      case "4":
        item.Priority = "(2) Normal";
        break;
      case "1":
        item.Priority = "(3) Low";
        break;
      case "":
        item.Priority = "";
        break;
    }
    // getpriority(item);
    setComponent((EditData) => [...EditData]);
  };
  const setTime = function (item: any, val: any) {
    item.Mileage = val;
    setComponent((EditData) => [...EditData]);
  };
  const setStatus = function (item: any, val: any) {
    item.AdminStatus = val;
    setComponent((EditData) => [...EditData]);
  };
  const expendcollapsAccordion = (item: any, title: any) => {
    item[title] = item[title] = item[title] == true ? false : true;
    setComponent((EditData) => [...EditData]);
  };
  const test12 = (e: any, item: any) => {
    item.SynonymsTitle = e.target.value;
    setComponent((EditData) => [...EditData]);
  };
  const createSynonyms = (item: any) => {
    if (item.SynonymsTitle == undefined || item.SynonymsTitle == "") {
      alert("You have not enter Synonym name.");
    } else {
      let flag = true;
      if (item["Synonyms"] != undefined && item["Synonyms"].length > 0) {
        if (
          item["Synonyms"][item["Synonyms"].length - 1]["Title"] ==
          item.SynonymsTitle
        ) {
          flag = false;
          alert("You have a blank synonym try to fill it first");
        } else if (
          item["Synonyms"][item["Synonyms"].length - 1]["status"] == false
        ) {
          flag = false;
          alert("You have not saved your last item.");
        }
      } else item["Synonyms"] = [];
      flag
        ? item["Synonyms"].push({
            status: true,
            Title: item.SynonymsTitle,
            Id: "",
          })
        : null;
      item.SynonymsTitle = "";
    }
    item.SynonymsTitle = "";
    setComponent((EditData) => [...EditData]);
  };
  const deleteItem = (item: any) => {
    if (item["Synonyms"] != undefined && item["Synonyms"].length > 0) {
      map(item["Synonyms"], (val, index) => {
        item["Synonyms"].splice(index, 1);
      });
    }
    setComponent((EditData) => [...EditData]);
  };
  const SaveData = async () => {
    var UploadImage: any = [];

    var item: any = {};
    var smartComponentsIds: any[] = [];
    var RelevantPortfolioIds = "";
    var Items = EditData;

    if (NewArray != undefined && NewArray.length > 0) {
      NewArray.map((NeitemA: any) => {
        CategoriesData.push(NeitemA);
      });
    }
    var categoriesItem = "";
    CategoriesData.map((category) => {
      if (category.Title != undefined) {
        categoriesItem =
          categoriesItem == ""
            ? category.Title
            : categoriesItem + ";" + category.Title;
      }
    });
    var CategoryID: any = [];
    CategoriesData.map((category) => {
      if (category.Id != undefined) {
        CategoryID.push(category.Id);
      }
    });

    if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
      TaskAssignedTo.map((taskInfo) => {
        AssignedToIds.push(taskInfo.Id);
      });
    } else {
      if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
        EditData.AssignedTo.map((taskInfo: any) => {
          AssignedToIds.push(taskInfo.Id);
        });
      }
    }
    if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
      TaskTeamMembers.map((taskInfo) => {
        TeamMemberIds.push(taskInfo.Id);
      });
    } else {
      if (
        EditData.Team_x0020_Members != undefined &&
        EditData.Team_x0020_Members?.length > 0
      ) {
        EditData.Team_x0020_Members.map((taskInfo: any) => {
          TeamMemberIds.push(taskInfo.Id);
        });
      }
    }
    if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
      TaskResponsibleTeam.map((taskInfo) => {
        ResponsibleTeamIds.push(taskInfo.Id);
      });
    } else {
      if (
        EditData.Responsible_x0020_Team != undefined &&
        EditData.Responsible_x0020_Team?.length > 0
      ) {
        EditData.Responsible_x0020_Team.map((taskInfo: any) => {
          ResponsibleTeamIds.push(taskInfo.Id);
        });
      }
    }
    let selectedComponent: any[] = [];
    if (smartComponentData !== undefined && smartComponentData.length > 0) {
      $.each(smartComponentData, function (index: any, smart: any) {
        selectedComponent.push(smart?.Id);
      });
    }
    let selectedService: any[] = [];
    if (linkedComponentData !== undefined && linkedComponentData.length > 0) {
      $.each(linkedComponentData, function (index: any, smart: any) {
        selectedService.push(smart?.Id);
      });
    }
    // if (Items.smartComponent != undefined) {
    //     Items.smartComponent.map((com: any) => {
    //         // if (com.Title != undefined) {

    //         //     component = com.Title

    //         // }

    //         if (Items.smartComponent != undefined && Items.smartComponent.length >= 0) {

    //             $.each(Items.smartComponent, function (index: any, smart: any) {

    //                 smartComponentsIds.push(smart.Id);

    //             })
    //         }
    //     })
    // }
    if (
      Items.ItemRankTitle != undefined &&
      Items.ItemRankTitle != "Select Item Rank"
    )
      var ItemRank = SharewebItemRank.filter(
        (option: { rankTitle: any }) => option.rankTitle == Items.ItemRankTitle
      )[0].rank;
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web.lists
      .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
      .items.getById(Items.ID)
      .update({
        Title: Items.Title,

        ItemRank: ItemRank,
        Priority_x0020_Rank: Items.Priority_x0020_Rank,
        ComponentId: {
          results:
            selectedComponent !== undefined && selectedComponent?.length > 0
              ? selectedComponent
              : [],
        },
        ServicesId: {
          results:
            selectedService !== undefined && selectedService?.length > 0
              ? selectedService
              : [],
        },
        Deliverable_x002d_Synonyms: Items.Deliverable_x002d_Synonyms,
        StartDate:
          Startdate != undefined
            ? new Date(Startdate).toDateString()
            : Startdate,
        DueDate: date != undefined ? new Date(date).toDateString() : date,
        CompletedDate:
          Completiondate != undefined
            ? new Date(Completiondate).toDateString()
            : Completiondate,
        // Categories:EditData.smartCategories != undefined && EditData.smartCategories != ''?EditData.smartCategories[0].Title:EditData.Categories,
        Categories: categoriesItem ? categoriesItem : null,
        SharewebCategoriesId: { results: CategoryID },
        // ClientCategoryId: { "results": RelevantPortfolioIds },
        ServicePortfolioId:
          RelevantPortfolioIds != "" ? RelevantPortfolioIds : null,
        Synonyms: JSON.stringify(Items["Synonyms"]),
        Package: Items.Package,
        AdminStatus: Items.AdminStatus,
        Priority: Items.Priority,
        Mileage: Items.Mileage,
        ValueAdded: Items.ValueAdded,
        Idea: Items.Idea,
        Background: Items.Background,
        Admin_x0020_Notes: Items.Admin_x0020_Notes,
        component_x0020_link: {
          Description:
            Items.component_x0020_link != undefined
              ? Items.component_x0020_link
              : null,
          Url:
            Items.component_x0020_link != undefined
              ? Items.component_x0020_link
              : null,
        },
        TechnicalExplanations:
          PostTechnicalExplanations != undefined &&
          PostTechnicalExplanations != ""
            ? PostTechnicalExplanations
            : EditData.TechnicalExplanations,
        Deliverables:
          PostDeliverables != undefined && PostDeliverables != ""
            ? PostDeliverables
            : EditData.Deliverables,
        Short_x0020_Description_x0020_On:
          PostShort_x0020_Description_x0020_On != undefined &&
          PostShort_x0020_Description_x0020_On != ""
            ? PostShort_x0020_Description_x0020_On
            : EditData.Short_x0020_Description_x0020_On,
        Body:
          PostBody != undefined && PostBody != "" ? PostBody : EditData.Body,
        AssignedToId: {
          results:
            AssignedToIds != undefined && AssignedToIds?.length > 0
              ? AssignedToIds
              : [],
        },
        Responsible_x0020_TeamId: {
          results:
            ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0
              ? ResponsibleTeamIds
              : [],
        },
        Team_x0020_MembersId: {
          results:
            TeamMemberIds != undefined && TeamMemberIds?.length > 0
              ? TeamMemberIds
              : [],
        },
        // PercentComplete: saveData.PercentComplete == undefined ? EditData.PercentComplete : saveData.PercentComplete,

        // Categories: Items.Categories

        // BasicImageInfo: JSON.stringify(UploadImage)
      })
      .then((res: any) => {
        console.log(res);

        setModalIsOpenToFalse();
      });
  };
  const EditComponentPicker = (item: any, title: any) => {
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsComponentPicker(true);
    setSharewebCategory(item);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };
  // const onEditorStateChange = (e: any, item: any) => {
  //     //  item.Description = e.target.value;
  //     setComponent(EditData => ([...EditData]));
  //     // const { components } = this.state;
  //     // const x = { components };
  //     // for (const i in x){
  //     //     if(x[i].id ==== id){
  //     //         x[i].contentValue.editorState = e;
  //     //     }
  //     // }
  //     // this.setState({components: x})
  // }
  const ChangeStatus = (e: any, item: any) => {
    item.AdminStatus = e.target.value;
    setComponent((EditData) => [...EditData]);
  };
  const changeTime = (e: any, item: any) => {
    item.Mileage = e.target.value;
    setComponent((EditData) => [...EditData]);
  };
  const HtmlEditorCallBack = React.useCallback((Editorvalue: any) => {
    let message: any = Editorvalue;
    EditData.Body = message;
    PostBody = EditData.Body;
    console.log("Editor Data call back ====", Editorvalue);
  }, []);
  const SortHtmlEditorCallBack = React.useCallback((Editorvalue: any) => {
    let message: any = Editorvalue;
    EditData.Short_x0020_Description_x0020_On = message;
    PostShort_x0020_Description_x0020_On =
      EditData.Short_x0020_Description_x0020_On;
    console.log("Editor Data call back ====", Editorvalue);
  }, []);
  const DeliverablesHtmlEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      EditData.Deliverables = message;
      PostDeliverables = EditData.Deliverables;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );
  const TechnicalExplanationsHtmlEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      EditData.TechnicalExplanations = message;
      PostTechnicalExplanations = EditData.TechnicalExplanations;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );
  var CheckCategory: any = [];
  CheckCategory.push(
    { TaxType: "Categories", Title: "Phone", Id: 199, ParentId: 225 },
    {
      TaxType: "Categories",
      Title: "Email Notification",
      Id: 276,
      ParentId: 225,
    },
    { TaxType: "Categories", Title: "Approval", Id: 227, ParentId: 225 },
    { TaxType: "Categories", Title: "Immediate", Id: 228, parentId: 225 }
  );

  const DDComponentCallBack = (dt: any) => {
    setTeamConfig(dt);
    console.log(TeamConfig);
    if (dt?.AssignedTo?.length > 0) {
      let tempArray: any = [];
      dt.AssignedTo?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempArray.push(arrayData.AssingedToUser);
        } else {
          tempArray.push(arrayData);
        }
      });
      setTaskAssignedTo(tempArray);
      console.log("Team Config  assigadf=====", tempArray);
    }
    if (dt?.TeamMemberUsers?.length > 0) {
      let tempArray: any = [];
      dt.TeamMemberUsers?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempArray.push(arrayData.AssingedToUser);
        } else {
          tempArray.push(arrayData);
        }
      });
      setTaskTeamMembers(tempArray);
      console.log("Team Config member=====", tempArray);
    }
    if (dt?.ResponsibleTeam?.length > 0) {
      let tempArray: any = [];
      dt.ResponsibleTeam?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempArray.push(arrayData.AssingedToUser);
        } else {
          tempArray.push(arrayData);
        }
      });
      setTaskResponsibleTeam(tempArray);
      console.log("Team Config reasponsible ===== ", tempArray);
    }
  };
  var itemInfo = {
    Portfolio_x0020_Type: TeamConfigInfo
      ? TeamConfigInfo.Portfolio_x0020_Type
      : "",
    Services: TeamConfigInfo ? TeamConfigInfo.Services : "",
    siteUrl: TeamConfigInfo
      ? TeamConfigInfo.siteUrl
      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP",
    listName: TeamConfigInfo ? TeamConfigInfo.siteType : "",
    itemID: TeamConfigInfo ? TeamConfigInfo.Id : "",
  };
  const deleteCategories = (id: any) => {
    CategoriesData.map((catId, index) => {
      if (id == catId.Id) {
        CategoriesData.splice(index, 1);
      }
    });
    setCategoriesData((CategoriesData) => [...CategoriesData]);
  };
  const deleteComponent = (type: any) => {
    if (type == "EditData.Component") {
      EditData.Component = "";
    } else {
      EditData.smartComponent = "";
    }
    setComponent((EditData) => [...EditData]);
  };
  const onRenderCustomHeader = () => {
    return (
      <>
        <div
          style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}
        >
          {`Project > ${EditData.Title}`}
        </div>
        <Tooltip />
      </>
    );
  };
  const deleteTask = async () => {
    var confirmDelete = confirm("Are you sure, you want to delete this?");
    if (confirmDelete) {
      let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
      await web.lists
        .getByTitle("Master Tasks")
        .items.getById(item.props.Id)
        .delete()
        .then((i) => {
          console.log(i);
          setComponent((EditData) => [...EditData]);
          setModalIsOpenToFalse();
          item.showProgressBar();
        });
    }
  };
  var NewArray: any = [];
  const checkCat = (type: any) => {
    CheckCategory.map((catTitle: any) => {
      setcheckedCat(false);
      if (type == catTitle.Title) {
        NewArray.push(catTitle);
      }
    });
  };
  const unTagService = (array: any, index: any) => {
    array.splice(index, 1);
    setLinkedComponentData(array);
    setEditData(EditData);
  };
  const unTagComponent = (array: any, index: any) => {
    array.splice(index, 1);
    setSmartComponentData(array);
    setEditData(EditData);
  };
  return (
    <>
      {console.log("Done")}
      <Panel
        headerText={`  Service-Portfolio > ${EditData.Title}`}
        isOpen={modalIsOpen}
        onDismiss={setModalIsOpenToFalse}
        onRenderHeader={onRenderCustomHeader}
        isBlocking={false}
        type={PanelType.large}
      >
        {EditData != undefined && EditData.Title != undefined && (
          <div id="EditGrueneContactSearch">
            <div className="modal-body">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    BASIC INFORMATION
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="cncept-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#concept"
                    type="button"
                    role="tab"
                    aria-controls="concept"
                    aria-selected="false"
                  >
                    Concept
                  </button>
                </li>
             
              </ul>
              <div
                className="tab-content border border-top-0 clearfix "
                id="myTabContent"
              >
                <div
                  className="tab-pane  show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div
                    className="tab-pane  show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <div className="row  px-3 py-2">
                      <div className="col-sm-5 ">
                        <div className="col-12">
                          <div className="input-group">
                            <label className="form-label  full-width">
                              Title
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                EditData.Title != undefined
                                  ? EditData.Title
                                  : ""
                              }
                              onChange={(e) =>
                                (EditData.Title = e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="mx-0 row ">
                          <div className="col-sm-12 mt-2">
                            <div className="input-group">
                              <label className="form-label full-width">
                                Item Rank
                              </label>
                              <select
                                className="full_width searchbox_height"
                                defaultValue={EditData.ItemRankTitle}
                                onChange={(e) =>
                                  (EditData.ItemRankTitle = e.target.value)
                                }
                              >
                                <option>
                                  {EditData.ItemRankTitle == undefined
                                    ? "select Item Rank"
                                    : EditData.ItemRankTitle}
                                </option>
                                {SharewebItemRank &&
                                  SharewebItemRank.map(function (
                                    h: any,
                                    i: any
                                  ) {
                                    return (
                                      <option
                                        key={i}
                                        defaultValue={EditData.ItemRankTitle}
                                      >
                                        {EditData.ItemRankTitle == h.rankTitle
                                          ? EditData.ItemRankTitle
                                          : h.rankTitle}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                          </div>
                          {/* <div className="col-4 ps-0  mt-2">
                <div className="input-group">
                    <label className="form-label full-width">Deliverable-Synonyms</label>

                    <input type="text" className="form-control"
                        defaultValue={EditData.Deliverable_x002d_Synonyms != undefined ? EditData.Deliverable_x002d_Synonyms : ""} onChange={(e) => EditData.Deliverable_x002d_Synonyms = e.target.value} />
                </div>
            </div> */}
                          {EditData?.Item_x0020_Type == "Project" && (
                            <div className="row ps-0 pe-0 mt-2 ">
                              <div className="col-sm-6">
                                <div className="input-group full-width">
                                  <label className="form-label full-width">
                                    Component Portfolio
                                  </label>
                                  <input type="text" className="form-control" />
                                  <span className="input-group-text">
                                    <svg
                                      onClick={(e) =>
                                        EditPortfolio(EditData, "Component")
                                      }
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z"
                                        fill="#333333"
                                      />
                                    </svg>
                                  </span>
                                </div>

                                <div className="  inner-tabb">
                                  <div>
                                    {smartComponentData
                                      ? smartComponentData?.map(
                                          (com: any, index: any) => {
                                            return (
                                              <>
                                                <div className="d-flex Component-container-edit-task">
                                                  <a
                                                    style={{
                                                      color: "#fff !important",
                                                    }}
                                                    target="_blank"
                                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}
                                                  >
                                                    {com.Title}
                                                  </a>
                                                  <a>
                                                    <img
                                                      className="mx-2"
                                                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"
                                                      onClick={() =>
                                                        unTagComponent(
                                                          smartComponentData,
                                                          index
                                                        )
                                                      }
                                                    />
                                                  </a>
                                                </div>
                                              </>
                                            );
                                          }
                                        )
                                      : null}
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="input-group full-width">
                                  <label className="form-label full-width">
                                    Service Portfolio
                                  </label>
                                  <input type="text" className="form-control" />
                                  <span className="input-group-text">
                                    <svg
                                      onClick={(e) =>
                                        EditPortfolio(EditData, "Service")
                                      }
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 48 48"
                                      fill="none"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z"
                                        fill="#333333"
                                      />
                                    </svg>
                                  </span>
                                </div>

                                <div className="inner-tabb full-width">
                                  {linkedComponentData?.length > 0 ? (
                                    <div>
                                      {linkedComponentData?.map(
                                        (com: any, index: any) => {
                                          return (
                                            <>
                                              <div className="d-flex Component-container-edit-task">
                                                <div>
                                                  <a
                                                    className="hreflink "
                                                    target="_blank"
                                                    data-interception="off"
                                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}
                                                  >
                                                    {com.Title}
                                                  </a>
                                                  <img
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"
                                                    onClick={() =>
                                                      unTagService(
                                                        linkedComponentData,
                                                        index
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </>
                                          );
                                        }
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mx-0 row mt-2">
                          <div className="col-sm-4 ps-0 ">
                            <div className="input-group">
                              <label className="form-label  full-width">
                                Start Date
                              </label>

                              <DatePicker
                                className="form-control"
                                selected={Startdate}
                                value={EditData.StartDate}
                                onChange={handleDatestart}
                                dateFormat="dd/MM/yyyy"
                                preventOpenOnFocus
                                open={EditData.StartDate == Startdate}
                              />
                            </div>
                          </div>
                          <div className="col-sm-4 ps-0">
                            <div className="input-group">
                              <label className="form-label  full-width">
                                Due Date
                              </label>
                              <DatePicker
                                className="form-control"
                                // selected={date}
                                // value={EditData.DueDate}
                                // onChange={handleDatedue}
                                dateFormat="dd/MM/yyyy"
                                selected={date}
                                onChange={(date) => setStartdate(date)}
                              />
                            </div>
                          </div>
                          <div className="col-sm-4 ps-0">
                            <div className="input-group">
                              <label className="form-label  full-width">
                                {" "}
                                Completion Date{" "}
                              </label>
                              <DatePicker
                                className="form-control"
                                name="CompletionDate"
                                selected={Completiondate}
                                dateFormat="dd/MM/yyyy"
                                value={EditData.CompletedDate}
                                onChange={handleDate}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mx-0 row mt-2 ">
                          <div className="col-sm-6 p-0">
                            <div className="input-group mb-2">
                              <label className="form-label  full-width">
                                Status
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={EditData.AdminStatus}
                                onChange={(e) => ChangeStatus(e, EditData)}
                              />
                            </div>

                            <div className="form-check">
                              <input
                                className="form-check-input"
                                name="NotStarted"
                                type="radio"
                                value="Not Started"
                                checked={
                                  EditData.AdminStatus === "Not Started"
                                    ? true
                                    : false
                                }
                                onChange={(e) =>
                                  setStatus(EditData, "Not Started")
                                }
                              ></input>
                              <label className="form-check-label">
                                Not Started{" "}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                name="NotStarted"
                                type="radio"
                                value="In Preparation"
                                onChange={(e) =>
                                  setStatus(EditData, "In Preparation")
                                }
                                checked={
                                  EditData.AdminStatus === "In Preparation"
                                    ? true
                                    : false
                                }
                              ></input>
                              <label className="form-check-label">
                                {" "}
                                In Preparation
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                name="NotStarted"
                                type="radio"
                                value="In Development"
                                onChange={(e) =>
                                  setStatus(EditData, "In Development")
                                }
                                checked={
                                  EditData.AdminStatus === "In Development"
                                    ? true
                                    : false
                                }
                              ></input>
                              <label className="form-check-label">
                                {" "}
                                In Development{" "}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                name="NotStarted"
                                type="radio"
                                value="Active"
                                onChange={(e) => setStatus(EditData, "Active")}
                                checked={
                                  EditData.AdminStatus === "Active"
                                    ? true
                                    : false
                                }
                              ></input>
                              <label className="form-check-label">Active</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                name="NotStarted"
                                type="radio"
                                value="Archived"
                                onChange={(e) =>
                                  setStatus(EditData, "Archived")
                                }
                                checked={
                                  EditData.AdminStatus === "Archived"
                                    ? true
                                    : false
                                }
                              ></input>
                              <label className="form-check-label">
                                Archived{" "}
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="input-group position-relative">
                              <label className="form-label  full-width">
                                Categories{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={
                                  EditData.Facebook != null
                                    ? EditData.Facebook.Description
                                    : ""
                                }
                              />

                              <span className="input-group-text">
                                <svg
                                  onClick={(e) =>
                                    EditComponentPicker(EditData, "Categories")
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </span>
                            </div>

                            <div className="col-sm-11  inner-tabb">
                              <div className="col">
                                <div className="col">
                                  {CheckCategory.map((type: any) => {
                                    return (
                                      <>
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            checked={
                                              BackupCat == type.Id
                                                ? checkedCat
                                                : false
                                            }
                                            type="checkbox"
                                            onClick={() => checkCat(type.Title)}
                                          />
                                          <label className="form-check-label">
                                            {type.Title}
                                          </label>
                                        </div>
                                      </>
                                    );
                                  })}

                                  {CategoriesData != undefined ? (
                                    <div>
                                      {CategoriesData?.map(
                                        (type: any, index: number) => {
                                          return (
                                            <>
                                              {type.Title != "Phone" &&
                                                type.Title !=
                                                  "Email Notification" &&
                                                type.Title != "Approval" &&
                                                type.Title != "Immediate" && (
                                                  <div className="Component-container-edit-task d-flex my-1 justify-content-between">
                                                    <a
                                                      style={{
                                                        color:
                                                          "#fff !important",
                                                      }}
                                                      target="_blank"
                                                      data-interception="off"
                                                      href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?${EditData.Id}`}
                                                    >
                                                      {type.Title}
                                                    </a>
                                                    <img
                                                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"
                                                      onClick={() =>
                                                        deleteCategories(
                                                          type.Id
                                                        )
                                                      }
                                                      className="p-1"
                                                    />
                                                  </div>
                                                )}
                                            </>
                                          );
                                        }
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="col-sm-4 ps-0 ">
                <div className="input-group">
                    <label className="form-label  full-width">Synonyms </label>
                    <input type="text" className="form-control"
                        defaultValue={EditData.SynonymsTitle} onChange={(e) => EditData.SynonymsTitle = e.target.value} />
                    <span className="input-group-text" onClick={(e) => createSynonyms(EditData)}> <img src="https://www.shareweb.ch/site/Joint/SiteCollectionImages/ICONS/24/save.png"></img></span>
                </div>
                <div className="">
                    {EditData["Synonyms"] != undefined && EditData["Synonyms"].length > 0 && map(EditData["Synonyms"], (obj, index) => {
                        return (
                            <>
                                <div className="block ">
                                    {
                                        obj.Title
                                    }
                                    <a className="input-group-text" onClick={(e) => deleteItem(EditData)}>
                                        <img src="/_layouts/images/delete.gif"></img>
                                    </a>
                                </div>
                            </>
                        )
                    })
                    }
                </div>
            </div> */}

                          {/* <div className="col-sm-4">
                <div className="input-group">
                    <label className="form-label  full-width">Client Activity </label>
                    <input type="text" className="form-control"
                        defaultValue={EditData.Twitter != null ? EditData.Twitter.Description : ""} />
                </div>
            </div>

            <div className="col-sm-4 pe-0">
                <div className="input-group">
                    <label className="form-label  full-width">Package</label>
                    <input type="text" className="form-control"
                        defaultValue={EditData.Package != null ? EditData.Package : ""} onChange={(e) => EditData.Package = e.target.value} />
                </div>
            </div> */}
                        </div>
                        <div className="row mb-2 mt-2 ">
                          {/* <div className="col-sm-6">
                <div className="input-group mb-2">
                    <label className="form-label  full-width">Time </label>
                    <input type="text" className="form-control"
                        value={EditData.Mileage != null ? EditData.Mileage : ""} onChange={(e => changeTime(e, EditData))} />
                </div>

                <div className="form-check">

                    <input className="form-check-input" name="radioTime" onChange={(e) => setTime(EditData, '05')} checked={EditData.Mileage === "05" ? true : false}
                        type="radio"></input>
                    <label className="form-check-label">Very Quick</label>

                </div>
                <div className="form-check">

                    <input className="form-check-input" name="radioTime" onChange={(e) => setTime(EditData, '15')} checked={EditData.Mileage === "15" ? true : false}
                        type="radio" ></input>

                    <label className="form-check-label">Quick </label>
                </div>
                <div className="form-check">

                    <input className="form-check-input" name="radioTime" onChange={(e) => setTime(EditData, '60')} checked={EditData.Mileage === "60" ? true : false}
                        type="radio" ></input>
                    <label className="form-check-label">Medium</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" name="radioTime" onChange={(e) => setTime(EditData, "240")} checked={EditData.Mileage === "240" ? true : false}
                        type="radio" ></input>
                    <label className="form-check-label">Long</label>
                </div>
            </div> */}
                        </div>
                      </div>
                      <div className="col-sm-3 ">
                        <div className="col" title="Priority">
                          <div className="input-group mb-2">
                            <label className="form-label  full-width">
                              Priority
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={EditData.Priority_x0020_Rank}
                              onChange={(e) => setPriorityNew(e, EditData)}
                            />
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              name="radioPriority"
                              type="radio"
                              value="(1) High"
                              onChange={(e) => setPriority(EditData, 8)}
                              checked={
                                EditData.Priority === "(1) High" ? true : false
                              }
                            ></input>
                            <label> High</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              name="radioPriority"
                              type="radio"
                              value="(2) Normal"
                              onChange={(e) => setPriority(EditData, 4)}
                              checked={
                                EditData.Priority === "(2) Normal"
                                  ? true
                                  : false
                              }
                            ></input>
                            <label> Normal</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              name="radioPriority"
                              type="radio"
                              value="(3) Low"
                              onChange={(e) => setPriority(EditData, 1)}
                              checked={
                                EditData.Priority === "(3) Low" ? true : false
                              }
                            ></input>
                            <label> Low</label>
                          </div>
                          <div className="col mt-2">
                            <div className="input-group">
                              {EditData.AssignedUsers?.map(
                                (userDtl: any, index: any) => {
                                  return (
                                    <div className="TaskUsers" key={index}>
                                      <label className="form-label full-width  mx-2">
                                        Task Users
                                      </label>
                                      <a
                                        target="_blank"
                                        href={
                                          userDtl.Item_x0020_Cover
                                            ? userDtl.Item_x0020_Cover.Url
                                            : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                        }
                                      >
                                        <img
                                          ui-draggable="true"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="bottom"
                                          title={
                                            userDtl.Title ? userDtl.Title : ""
                                          }
                                          on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                          data-toggle="popover"
                                          data-trigger="hover"
                                          style={{
                                            width: "35px",
                                            height: "35px",
                                            marginLeft: "10px",
                                            borderRadius: "50px",
                                          }}
                                          src={
                                            userDtl.Item_x0020_Cover.Url
                                              ? userDtl.Item_x0020_Cover.Url
                                              : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                          }
                                        />
                                      </a>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4  ">
                        <CommentCard
                          siteUrl={EditData.siteUrl}
                          userDisplayName={EditData.userDisplayName}
                          listName={EditData.siteType}
                          itemID={EditData.Id}
                        ></CommentCard>
                      </div>
                      <div className="col-sm-8">
                        <div className="input-group mb-2">
                          <label className="form-label  full-width">Url</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={
                              EditData.component_x0020_link != null
                                ? EditData.component_x0020_link
                                : ""
                            }
                            onChange={(e) =>
                              (EditData.component_x0020_link = e.target.value)
                            }
                            placeholder="Url"
                          ></input>
                        </div>
                        <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() =>
                                    expendcollapsAccordion(EditData, "showdes")
                                  }
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="fw-medium font-sans-serif text-900">
                                      <span className="sign">
                                        {EditData.showdes ? (
                                          <IoMdArrowDropdown />
                                        ) : (
                                          <IoMdArrowDropright />
                                        )}
                                      </span>{" "}
                                      Description
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {EditData.showdes && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <span className="form-check text-end">
                                        <input
                                          type="checkbox"
                                          defaultChecked={
                                            EditData.descriptionVerified ===
                                            true
                                          }
                                        ></input>
                                        <span className="ps-1">Verified</span>
                                      </span>

                                      <HtmlEditorCard
                                        editorValue={
                                          EditData.Body != undefined
                                            ? EditData.Body
                                            : ""
                                        }
                                        HtmlEditorStateChange={
                                          HtmlEditorCallBack
                                        }
                                      ></HtmlEditorCard>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                           
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane"
                  id="concept"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div className="row">
                    <div className="col-sm-7">
                      <div className="row">
                        <TeamConfigurationCard
                          ItemInfo={item.props}
                          parentCallback={DDComponentCallBack}
                        ></TeamConfigurationCard>
                      </div>
                      <div className="row">
                        <section className="accordionbox">
                          <div className="accordion p-0  overflow-hidden">
                            
                         

                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() =>
                                    expendcollapsAccordion(EditData, "showl")
                                  }
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {EditData.showl ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Background
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {EditData.showl && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <span className="form-check text-end">
                                        <input
                                          type="checkbox"
                                          defaultChecked={
                                            EditData.BackgroundVerified === true
                                          }
                                          onChange={(e) =>
                                            (EditData.BackgroundVerified =
                                              e.target.value)
                                          }
                                        ></input>
                                        <span className="ps-1">Verified</span>
                                      </span>
                                      <textarea
                                        className="full_width"
                                        defaultValue={EditData.Background}
                                        onChange={(e) =>
                                          (EditData.Background = e.target.value)
                                        }
                                      ></textarea>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() =>
                                    expendcollapsAccordion(EditData, "shows")
                                  }
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {EditData.shows ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Idea
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {EditData.shows && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <span className="form-check text-end">
                                        <input
                                          type="checkbox"
                                          defaultChecked={
                                            EditData.IdeaVerified === true
                                          }
                                          onChange={(e) =>
                                            (EditData.BackgroundVerified =
                                              e.target.value)
                                          }
                                        ></input>
                                        <span className="ps-1">Verified</span>
                                      </span>
                                      <textarea
                                        className="full_width"
                                        defaultValue={EditData.Idea}
                                        onChange={(e) =>
                                          (EditData.Idea = e.target.value)
                                        }
                                      ></textarea>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                           

                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() =>
                                    expendcollapsAccordion(EditData, "showm")
                                  }
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {EditData.showm ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Deliverables
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {EditData.showm && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <span className="form-check text-end">
                                        <input
                                          type="checkbox"
                                          defaultChecked={
                                            EditData.DeliverablesVerified ===
                                            true
                                          }
                                        ></input>
                                        <span className="ps-1">Verified</span>
                                      </span>
                                      <HtmlEditorCard
                                        editorValue={
                                          EditData.Deliverables != undefined
                                            ? EditData.Deliverables
                                            : ""
                                        }
                                        HtmlEditorStateChange={
                                          DeliverablesHtmlEditorCallBack
                                        }
                                      ></HtmlEditorCard>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div className="col-sm-5"></div>
                  </div>
                </div>
                
             
              </div>
            </div>

            <footer className="mt-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-left">
                    Created{" "}
                    <span ng-bind="EditData.Created | date:'dd/MM/yyyy'">
                      {" "}
                      {EditData.Created != null
                        ? moment(EditData.Created).format("DD/MM/YYYY MM:SS")
                        : ""}
                    </span>{" "}
                    by
                    <span className="panel-title ps-1">
                      {EditData.Author?.Title != undefined
                        ? EditData.Author?.Title
                        : ""}
                    </span>
                  </div>
                  <div className="text-left">
                    Last modified{" "}
                    <span>
                      {EditData.Modified != null
                        ? moment(EditData.Modified).format("DD/MM/YYYY MM:SS")
                        : ""}
                    </span>{" "}
                    by{" "}
                    <span className="panel-title">
                      {EditData.Editor.Title != undefined
                        ? EditData.Editor.Title
                        : ""}
                    </span>
                  </div>
                  <div className="text-left">
                    <a onClick={() => deleteTask()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        viewBox="0 0 48 48"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z"
                          fill="#333333"
                        />
                      </svg>{" "}
                      Delete this item
                    </a>
                    <span>
                      {" "}
                      {EditData.ID ? (
                        <VersionHistoryPopup
                          taskId={EditData.ID}
                          listId={listID}
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <div>
                    <span>
                      <a
                        target="_blank"
                        data-interception
                        href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${EditData.Id}`}
                      >
                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/15/images/ichtm.gif?rev=23" />{" "}
                        Go to Profile page
                      </a>
                      ||
                      <img
                        className="mail-width mx-2"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png"
                      />
                      <a
                        data-interception
                        href={`mailto:?subject=${"Test"}&body=${
                          EditData.component_x0020_link
                        }`}
                      >
                        {" "}
                        Share this task ||
                      </a>
                    </span>
                    <span className="p-1">|</span>
                    <a
                      data-interception
                      className="p-1"
                      href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/Master%20Tasks/EditForm.aspx?ID=${EditData.Id}`}
                      target="_blank"
                    >
                      Open out-of-the-box form
                    </a>
                    <button
                      type="button"
                      className="btn btn-primary "
                      onClick={(e) => SaveData()}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default btn-default ms-1"
                      onClick={setModalIsOpenToFalse}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </footer>

            {IsPortfolio && (
              <PortfolioTagging
                props={SharewebComponent}
                type={portfolioType}
                Call={Call}
              ></PortfolioTagging>
            )}
            {IsComponentPicker && (
              <Picker props={SharewebCategory} Call={Call}></Picker>
            )}
          </div>
        )}
      </Panel>
    </>
  );
}
export default EditProjectPopup;
