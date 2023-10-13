import * as React from 'react';
import * as moment from 'moment';
import { ITaskprofileProps } from './ITaskprofileProps';
import {
  mergeStyleSets,
  FocusTrapCallout,
  FocusZone,
  FocusZoneTabbableElements,
  FontWeights,
  Stack,
  Text,
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import TaskFeedbackCard from './TaskFeedbackCard';
import { Web } from "sp-pnp-js";
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as globalCommon from '../../../globalComponents/globalCommon'
import { BiInfoCircle } from 'react-icons/bi'
import SmartTimeTotal from './SmartTimeTotal';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import RelevantDocuments from './RelevantDocuments';
import SmartInformation from './SmartInformation';
import VersionHistoryPopup from '../../../globalComponents/VersionHistroy/VersionHistory';
import TasksTable from './TaskfooterTable';
import EmailComponenet from './emailComponent';
import EditSiteComposition from '../../../globalComponents/EditTaskPopup/EditSiteComposition'
import AncTool from '../../../globalComponents/AncTool/AncTool'

import Tooltip from '../../../globalComponents/Tooltip'
import ApprovalHistoryPopup from '../../../globalComponents/EditTaskPopup/ApprovalHistoryPopup';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { ImReply } from 'react-icons/im';
import KeyDocuments from './KeyDocument';
import EODReportComponent from '../../../globalComponents/EOD Report Component/EODReportComponent';


// import {MyContext} from './myContext'
const MyContext: any = React.createContext<any>({})
var ClientTimeArray: any = [];
var TaskIdCSF: any = "";
var TaskIdAW = "";
var AllListId: any;
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
var subchildcomment: any;
let countemailbutton: number;
var changespercentage = false;
var buttonId: any;
let truncatedTitle: any
export interface ITaskprofileState {
  Result: any;
  listName: string;
  itemID: number;
  isModalOpen: boolean;
  isEditModalOpen: boolean
  isEditReplyModalOpen: boolean
  ReplyCommenttoUpdate: string;
  imageInfo: any;
  Display: string;
  showcomment: string;
  showcomment_subtext: string,
  subchildcomment: any,
  updateComment: boolean;
  showComposition: boolean;
  ShowEstimatedTimeDescription: boolean;
  isOpenEditPopup: boolean;
  TaskDeletedStatus: boolean;
  isTimeEntry: boolean,
  emailStatus: String,
  countfeedback: any,
  subchildParentIndex: any
  sendMail: boolean,
  showPopup: any;
  emailcomponentopen: boolean,
  OpenEODReportPopup: boolean,
  showhideCommentBoxIndex: any
  ApprovalCommentcheckbox: boolean;
  CommenttoPost: string;
  maincollection: any;
  breadCrumData: any;
  SharewebTimeComponent: any;
  isopenversionHistory: boolean;
  smarttimefunction: boolean;
  ApprovalStatus: boolean;
  EditSiteCompositionStatus: any
  CommenttoUpdate: string;
  keydoc: any;
  FileDirRef: any;
  updateCommentText: any;
  updateReplyCommentText: any
  emailComponentstatus: any;
  ApprovalHistoryPopup: boolean;
  ApprovalPointUserData: any;
  ApprovalPointCurrentParentIndex: number;
  currentArraySubTextIndex: number;
  isCalloutVisible: boolean
  currentDataIndex: any
  buttonIdCounter: number
  replyTextComment: any;
}

class Taskprofile extends React.Component<ITaskprofileProps, ITaskprofileState> {
  private relevantDocRef: any;
  private smartInfoRef: any;
  private taskUsers: any = [];
  private smartMetaDataIcon: any;
  private masterTaskData: any = [];
  private currentUser: any;
  private oldTaskLink: any;
  private site: any;

  count: number = 0;

  countemailbutton: number = 0;
  backGroundComment = false;
  this: any;
  public constructor(props: ITaskprofileProps, state: ITaskprofileState) {
    super(props);
    this.relevantDocRef = React.createRef();
    this.smartInfoRef = React.createRef();
    const params = new URLSearchParams(window.location.search);
    console.log(params.get('taskId'));
    console.log(params.get('Site'));
    this.site = params.get('Site');

    this.oldTaskLink = `${props.siteUrl}/SitePages/Task-Profile-Old.aspx?taskId=` + params.get('taskId') + "&Site=" + params.get('Site');
    this.state = {
      Result: {},
      isEditReplyModalOpen: false,
      replyTextComment: "",
      keydoc: [],
      FileDirRef: '',
      currentDataIndex: 0,
      buttonIdCounter: null,
      isCalloutVisible: false,
      currentArraySubTextIndex: null,
      ApprovalPointUserData: null,
      ApprovalPointCurrentParentIndex: null,
      ApprovalHistoryPopup: false,
      emailcomponentopen: false,
      OpenEODReportPopup: false,
      emailComponentstatus: null,
      subchildParentIndex: null,
      showcomment_subtext: 'none',
      subchildcomment: null,
      showhideCommentBoxIndex: null,
      CommenttoUpdate: '',
      ReplyCommenttoUpdate: '',
      ApprovalCommentcheckbox: false,
      CommenttoPost: '',
      updateCommentText: {},
      updateReplyCommentText: {},
      listName: params.get('Site'),
      itemID: Number(params.get('taskId')),
      isModalOpen: false,
      isEditModalOpen: false,
      imageInfo: {},
      Display: 'none',
      showcomment: 'none',
      updateComment: false,
      showComposition: true,
      ShowEstimatedTimeDescription: false,
      isOpenEditPopup: false,
      TaskDeletedStatus: false,
      isopenversionHistory: false,
      isTimeEntry: false,
      emailStatus: "",
      countfeedback: 0,
      // TaskIdHover:"",
      sendMail: false,
      showPopup: 'none',
      maincollection: [],
      breadCrumData: [],
      SharewebTimeComponent: [],
      smarttimefunction: false,
      ApprovalStatus: false,
      EditSiteCompositionStatus: false
    }
    let web = new Web(this.props?.siteUrl);
    web.lists
      // .getByTitle("Master Tasks")
      .getById(this.props.MasterTaskListID)
      .items
      .select('ComponentCategory/Id', 'PortfolioStructureID', 'PortfolioType/Id', 'PortfolioType/Color', 'PortfolioType/Title', 'Id', 'ValueAdded', 'Idea', 'Sitestagging', 'TechnicalExplanations', 'Short_x0020_Description_x0020_On', 'Short_x0020_Description_x0020__x', 'Short_x0020_description_x0020__x0', 'AdminNotes', 'Background', 'Help_x0020_Information', 'ItemType', 'Title', 'Parent/Id', 'Parent/Title')
      .expand('Parent', 'ComponentCategory', "PortfolioType")

      .orderBy('Modified', false)
      .getAll(4000).then((data: any) => {
        this.masterTaskData = this.masterTaskData.concat(data)
        this.GetResult();
      }).catch((error: any) => {
        console.log(error)
      })


  }

  // public async componentDidMount() {


  // }


  private taskResult: any;

  private generateButtonId = () => {

    return `callout-button`;
  };

  private getsmartmetadataIcon = async () => {
    let web = new Web(this.props?.siteUrl);
    await web.lists
      // .getByTitle('SmartMetadata')
      .getById(this.props.SmartMetadataListID)
      .items
      .select('Id', 'Title', 'Item_x0020_Cover', 'TaxType', 'siteName', 'siteUrl', 'Item_x005F_x0020_Cover')

      .filter("TaxType eq 'Sites'").top(4000)
      .get().then((data: any) => {

        this.smartMetaDataIcon = data;

      }).catch((error: any) => {
        console.log(error)
      });
  }

  private async GetResult() {
    await this.getsmartmetadataIcon();
    try {
      isShowTimeEntry = this.props.TimeEntry != "" ? JSON.parse(this.props.TimeEntry) : "";
      isShowSiteCompostion = this.props.SiteCompostion != "" ? JSON.parse(this.props.SiteCompostion) : ""
    } catch (error: any) {
      console.log(error)
    }

    let web = new Web(this.props.siteUrl);
    let taskDetails: any = [];
    let listInfo = await web.lists.getByTitle(this.state?.listName).get();
    // console.log(listInfo);

    taskDetails = await web.lists
      // .getById(this.props.SiteTaskListID)
      .getByTitle(this.state?.listName)
      .items
      .getById(this.state?.itemID)
      .select("ID", "Title", "Comments", "ApproverHistory", "EstimatedTime", "TaskID", "Portfolio/Id", "Portfolio/Title", "Portfolio/PortfolioStructureID", "PortfolioType/Id", "DueDate", "IsTodaysTask", 'EstimatedTimeDescription', "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/TaskID", "Project/Id", "Project/Title", "ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
      .expand("TeamMembers", "Project", "Approver", "ParentTask", "Portfolio", "PortfolioType", "SmartInformation", "AssignedTo", "TaskCategories", "Author", "ClientCategory", "ResponsibleTeam", "TaskType", "Editor", "AttachmentFiles")
      .get()
    AllListId = {
      MasterTaskListID: this.props.MasterTaskListID,
      TaskUsertListID: this.props.TaskUsertListID,
      SmartMetadataListID: this.props.SmartMetadataListID,
      //SiteTaskListID:this.props.SiteTaskListID,
      TaskTimeSheetListID: this.props.TaskTimeSheetListID,
      DocumentsListID: this.props.DocumentsListID,
      SmartInformationListID: this.props.SmartInformationListID,
      siteUrl: this.props.siteUrl,
      TaskTypeID: this.props.TaskTypeID,
      isShowTimeEntry: isShowTimeEntry,
      isShowSiteCompostion: isShowSiteCompostion
    }
    taskDetails["listName"] = this.state?.listName;
    taskDetails["siteType"] = this.state?.listName;
    taskDetails["siteUrl"] = this.props?.siteUrl;

    taskDetails.TaskId = globalCommon.GetTaskId(taskDetails);
    var category = ""
    if (taskDetails["TaskCategories"] != undefined && taskDetails["TaskCategories"].length > 0) {
      taskDetails["TaskCategories"]?.map((item: any, index: any) => {
        category = category + item?.Title + ";"
        let ApprovalCheck = category?.search("Approval");
        if (ApprovalCheck >= 0) {
          this.setState({
            ApprovalStatus: true
          })
        } else {
          this.setState({
            ApprovalStatus: false
          })
        }

      });
    }


    if (taskDetails["AssignedTo"] != undefined) {
      taskDetails["AssignedTo"]?.map((item: any, index: any) => {
        if (taskDetails?.TeamMembers != undefined) {
          for (let i = 0; i < taskDetails?.TeamMembers?.length; i++) {
            if (item.Id == taskDetails?.TeamMembers[i]?.Id) {
              taskDetails?.TeamMembers?.splice(i, true);
              i--;
            }
          }
        }

        item.workingMember = "activeimg";

      });
    }

    var array2: any = taskDetails["AssignedTo"] != undefined ? taskDetails["AssignedTo"] : []
    if (taskDetails["TeamMembers"] != undefined) {
      taskDetails.array = array2.concat(taskDetails["TeamMembers"]?.filter((item: any) => array2?.Id != item?.Id))
    } else {
      taskDetails.array = array2;
    }
    var OffshoreComments: any = [];
    if (taskDetails["OffshoreComments"] != null) {
      let myarray: any = []
      myarray = JSON.parse(taskDetails["OffshoreComments"])
      if (myarray.length != 0) {
        myarray.map((items: any) => {
          if (items.AuthorImage != undefined && items.AuthorImage != "") {
            items.AuthorImage = items.AuthorImage.replace(
              "https://www.hochhuth-consulting.de",
              "https://hhhhteams.sharepoint.com/sites/HHHH"
            );
            OffshoreComments.push(items);
          }
        });
      }

    }

    taskDetails["Categories"] = category;
    this.taskResult = taskDetails;
    await this.GetTaskUsers();
    await this.GetSmartMetaData(taskDetails?.ClientCategory, taskDetails?.ClientTime);

    this.currentUser = this.GetUserObject(this.props?.userDisplayName);
    let comment: any;
    if (taskDetails["Comments"] != null && taskDetails["Comments"] != undefined) {
      try { comment = JSON.parse(taskDetails["Comments"]) }
      catch (e: any) {
        console.log(e)
      }
    }
    let tempEstimatedArrayData: any;
    let TotalEstimatedTime: any = 0;
    if (taskDetails['EstimatedTimeDescription']?.length > 0) {
      tempEstimatedArrayData = JSON.parse(taskDetails['EstimatedTimeDescription']);
      if (tempEstimatedArrayData?.length > 0) {
        tempEstimatedArrayData?.map((TimeDetails: any) => {
          TotalEstimatedTime = TotalEstimatedTime + Number(TimeDetails.EstimatedTime);
        })
      }
    } else {
      tempEstimatedArrayData = [];
    }
    const maxTitleLength: number = 65;


    if (taskDetails["Title"].length > maxTitleLength) {
      truncatedTitle = taskDetails["Title"].substring(0, maxTitleLength - 3) + "...";
    }

    let portfolio: any = [];
    if (taskDetails?.Portfolio != undefined) {

      portfolio = this.masterTaskData.filter((item: any) => item.Id == taskDetails?.Portfolio?.Id)
    }
    let feedBackData: any = JSON.parse(taskDetails["FeedBack"]);
    console.log(this.masterTaskData)
    let tempTask = {
      SiteIcon: this.GetSiteIcon(this.state?.listName),
      sitePage: this.props.Context?._pageContext?._web?.title,
      Comments: comment != null && comment != undefined ? comment : "",
      Id: taskDetails["ID"],
      ID: taskDetails["ID"],

      Project: taskDetails["Project"],
      IsTodaysTask: taskDetails["IsTodaysTask"],
      EstimatedTime: taskDetails["EstimatedTime"],
      ClientTime: taskDetails["ClientTime"] != null && JSON.parse(taskDetails["ClientTime"]),
      ApproverHistory: taskDetails["ApproverHistory"] != null ? JSON.parse(taskDetails["ApproverHistory"]) : "",
      OffshoreComments: OffshoreComments.length > 0 ? OffshoreComments.reverse() : null,
      OffshoreImageUrl: taskDetails["OffshoreImageUrl"] != null && JSON.parse(taskDetails["OffshoreImageUrl"]),
      AssignedTo: taskDetails["AssignedTo"] != null ? this.GetUserObjectFromCollection(taskDetails["AssignedTo"]) : null,
      ClientCategory: taskDetails["ClientCategory"],
      siteType: taskDetails["siteType"],
      listName: taskDetails["listName"],
      siteUrl: taskDetails["siteUrl"],
      TaskId: taskDetails["TaskId"],
      TaskID: taskDetails["TaskID"],
      Title: taskDetails["Title"],
      Item_x0020_Type: 'Task',
      DueDate: taskDetails["DueDate"],
      Categories: taskDetails["Categories"],
      Status: taskDetails["Status"],
      StartDate: taskDetails["StartDate"] != null ? moment(taskDetails["StartDate"]).format("DD/MM/YYYY") : "",
      CompletedDate: taskDetails["CompletedDate"] != null ? moment(taskDetails["CompletedDate"])?.format("DD/MM/YYYY") : "",
      TeamLeader: taskDetails["ResponsibleTeam"] != null ? this.GetUserObjectFromCollection(taskDetails["ResponsibleTeam"]) : null,
      TeamMembers: taskDetails.array != null ? this.GetUserObjectFromCollection(taskDetails.array) : null,
      ItemRank: taskDetails["ItemRank"],
      PercentComplete: (taskDetails["PercentComplete"] * 100),
      Priority: taskDetails["Priority"],
      Created: taskDetails["Created"],
      Author: this.GetUserObject(taskDetails["Author"]?.Title),
      component_url: taskDetails["ComponentLink"],
      BasicImageInfo: this.GetAllImages(JSON.parse(taskDetails["BasicImageInfo"]), taskDetails["AttachmentFiles"], taskDetails["Attachments"]),
      FeedBack: JSON.parse(taskDetails["FeedBack"]),
      FeedBackBackup: JSON.parse(taskDetails["FeedBack"]),
      FeedBackArray: feedBackData != undefined && feedBackData?.length > 0 ? feedBackData[0]?.FeedBackDescriptions:[],
      TaskType: taskDetails["TaskType"] != null ? taskDetails["TaskType"]?.Title : '',
      EstimatedTimeDescriptionArray: tempEstimatedArrayData,
      TotalEstimatedTime: TotalEstimatedTime,

      Portfolio: portfolio != undefined ? portfolio[0] : undefined,
      PortfolioType: taskDetails["PortfolioType"],
      Creation: taskDetails["Created"],
      Modified: taskDetails["Modified"],
      ModifiedBy: taskDetails["Editor"],
      listId: listInfo.Id,
      TaskLevel: taskDetails["TaskLevel"],
      Attachments: taskDetails["Attachments"],
      AttachmentFiles: taskDetails["AttachmentFiles"],
      SmartInformationId: taskDetails["SmartInformation"],
      Approver: taskDetails.Approver != undefined ? taskDetails.Approver[0] : "",
      ParentTask: taskDetails?.ParentTask,
    };
    if (tempTask?.FeedBack != null && tempTask?.FeedBack.length > 0) {
      tempTask?.FeedBack[0]?.FeedBackDescriptions?.map((items: any) => {
        if (items?.Comments?.length > 0) {
          items?.Comments?.map((comment: any) => {
            comment.AuthorImage = comment?.AuthorImage?.replace(
              "https://www.hochhuth-consulting.de",
              "https://hhhhteams.sharepoint.com/sites/HHHH"
            );
          })
        }
      })
    }

    console.log(tempTask);

    this.setState({
      Result: tempTask,


    }, () => {
      this.getSmartTime();
      if (tempTask.Portfolio != undefined) {
        this.getAllTaskData();
      }




    });
  }

  private sortAlphaNumericAscending = (a: any, b: any) => a.FileName.localeCompare(b.FileName, 'en', { numeric: true });
  private AncCallback = (type: any) => {
    switch (type) {
      case 'anc': {
        this?.relevantDocRef?.current?.loadAllSitesDocuments()
        break
      }
      case 'smartInfo': {
        this?.smartInfoRef?.current?.GetResult();
        break
      }
      default: {
        this?.relevantDocRef?.current?.loadAllSitesDocuments()
        this?.smartInfoRef?.current?.GetResult();
        break
      }
    }
  }
  private GetAllImages(BasicImageInfo: any, AttachmentFiles: any, Attachments: any) {
    let ImagesInfo: any = [];

    if (Attachments) {

      AttachmentFiles?.map((items: any) => {
        var regex = items?.FileName?.substring(0, 20);
        items.newFileName = regex;
      })
      // AttachmentFiles?.sort(this.sortAlphaNumericAscending)

      AttachmentFiles?.forEach(function (Attach: any) {
        let attachdata: any = [];
        if (BasicImageInfo != null || BasicImageInfo != undefined) {
          attachdata = BasicImageInfo?.filter(function (ingInfo: any, i: any) {
            return ingInfo.ImageName == Attach?.FileName
          });
        }
        if (attachdata.length > 0) {
          BasicImageInfo?.forEach(function (item: any) {
            if (item?.ImageUrl != undefined && item?.ImageUrl != "") {
              item.ImageUrl = item?.ImageUrl?.replace(
                "https://www.hochhuth-consulting.de",
                "https://hhhhteams.sharepoint.com/sites/HHHH"
              );
            }

            if (item?.ImageName == Attach?.FileName) {
              ImagesInfo.push({
                ImageName: Attach?.FileName,
                ImageUrl: item?.ImageUrl,
                UploadeDate: item?.UploadeDate,
                UserImage: item?.UserImage,
                UserName: item?.UserName,
                Description: item?.Description
              })
            }
          })
        }
        if (attachdata?.length == 0) {
          ImagesInfo.push({
            ImageName: Attach?.FileName,
            ImageUrl: Attach?.ServerRelativeUrl,
            UploadeDate: '',
            UserImage: null,
            UserName: null
          })
        }


      });

      ImagesInfo = ImagesInfo;

    }
    return ImagesInfo;
  }

  private async GetTaskUsers() {
    let web = new Web(this.props?.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      // .getByTitle("Task Users")
      .getById(this.props.TaskUsertListID)
      .items
      .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'Company', 'AssingedToUser/Title', 'AssingedToUser/Id',)
      .filter("ItemType eq 'User'")
      .expand('AssingedToUser')
      .get();
    taskUsers?.map((item: any, index: any) => {
      if (this.props?.Context?.pageContext?._legacyPageContext?.userId === (item?.AssingedToUser?.Id) && item?.Company == "Smalsus") {
        this.backGroundComment = true;
      }
    })
    this.taskUsers = taskUsers;


  }

  private async GetSmartMetaData(ClientCategory: any, ClientTime: any) {
    let array2: any = [];
    ClientTimeArray = []
    if (((ClientTime == null || ClientTime == "false") && ClientTimeArray?.length == 0)) {
      var siteComp: any = {};
      siteComp.SiteName = this.state?.listName,
        siteComp.ClienTimeDescription = 100,
        siteComp.SiteIcon = this.state?.listName
      ClientTimeArray.push(siteComp);
    }

    else if (ClientTime != null && ClientTime != "false") {
      ClientTimeArray = JSON.parse(ClientTime);

    }
    let web = new Web(this.props?.siteUrl);
    var smartMetaData = await web.lists

      .getById(this.props.SmartMetadataListID)
      .items
      .select('Id', 'Title', 'IsVisible', 'TaxType', 'Parent/Id', 'Parent/Title', 'siteName', 'siteUrl', 'SmartSuggestions', "SmartFilters",)

      .expand('Parent').filter("TaxType eq 'Client Category'").top(4000)
      .get();

    if (ClientCategory.length > 0) {
      ClientCategory?.map((item: any, index: any) => {
        smartMetaData?.map((items: any, index: any) => {
          if (item?.Id == items?.Id) {
            item.SiteName = items?.siteName;
            array2.push(item)
          }
        })
      })
      console.log(ClientCategory);
    }

    if (ClientTimeArray != undefined && ClientTimeArray.length > 0) {
      ClientTimeArray?.map((item: any) => {
        array2?.map((items: any) => {
          if ((item?.SiteName == items?.SiteName) || (item?.Title == items?.SiteName)) {
            if (item.ClientCategory == undefined) {
              item.ClientCategory = [];
              item.ClientCategory.push(items);
            } else {
              item.ClientCategory.push(items)
            }

          }

        })
      })
    }
  }
  private GetSiteIcon(listName: string) {
    console.log(this.state.Result)
    if (listName != undefined) {
      let siteicon = '';
      if (listName?.toLowerCase() == 'migration') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_migration.png`;
      }
      if (listName?.toLowerCase() == 'health') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_health.png`;
      }
      if (listName?.toLowerCase() == 'eps') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_eps.png`;
      }
      if (listName?.toLowerCase() == 'ei') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_ei.png`;
      }
      if (listName?.toLowerCase() == 'qa') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_qa.png`;
      }
      if (listName?.toLowerCase() == 'gender') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_gender.png`;
      }
      if (listName?.toLowerCase() == 'education') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_education.png`;
      }
      if (listName?.toLowerCase() == 'development-effectiveness' || listName?.toLowerCase() == 'de') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_de.png`;
      }
      if (listName?.toLowerCase() == 'cep') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/icon_cep.png`;
      }
      if (listName?.toLowerCase() == 'alakdigital' || listName?.toLowerCase() == 'da e+e') {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_da.png`;
      }
      if (listName?.toLowerCase() == 'hhhh')
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png`;

      if (listName?.toLowerCase() == 'gruene')
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Foundation/logo-gruene.png`;

      if (listName?.toLowerCase() == 'shareweb')
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png`;

      if (listName?.toLowerCase() == 'small projects')
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/small_project.png`;

      if (listName?.toLowerCase() == 'offshore tasks')
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Shareweb/offshore_Tasks.png`;

      if (listName?.toLowerCase() == 'kathabeck')
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png`;
      if (listName?.toLowerCase() == 'tasks' && this.props.Context?._pageContext?._web.title == "SH") {
        siteicon = `${this.props.Context?._pageContext?._site?.absoluteUrl}/SH/SiteCollectionImages/ICONS/Foundation/SH_icon.png`;
      }
      else {
        this.smartMetaDataIcon?.map((icondata: any) => {
          if (icondata.Title != undefined) {
            if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x0020_Cover != undefined) {
              siteicon = icondata.Item_x0020_Cover.Url
            }
            if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x005F_x0020_Cover != undefined) {
              siteicon = icondata.Item_x005F_x0020_Cover.Url
            }
          }
        })
      }
      return siteicon;
    }

  }

  private GetUserObjectFromCollection(UsersValues: any) {
    let userDeatails = [];
    for (let index = 0; index < UsersValues?.length; index++) {
      let senderObject = this.taskUsers?.filter(function (user: any, i: any) {
        if (user?.AssingedToUser != undefined) {
          return user?.AssingedToUser["Id"] == UsersValues[index]?.Id
        }
      });
      if (senderObject.length > 0) {
        userDeatails.push({
          'Id': senderObject[0]?.AssingedToUser.Id,
          'Name': senderObject[0]?.Email,
          'Suffix': senderObject[0]?.Suffix,
          'Title': senderObject[0]?.Title,
          'userImage': senderObject[0]?.Item_x0020_Cover?.Url,
          'activeimg2': UsersValues[index]?.workingMember ? UsersValues[index]?.workingMember : "",
        })
      }

    }
    return userDeatails;
  }

  private GetUserObject(username: any) {

    let userDeatails = [];
    if (username != undefined) {
      let senderObject = this.taskUsers.filter(function (user: any, i: any) {
        if (user?.AssingedToUser != undefined) {
          return user?.AssingedToUser['Title'] == username
        }
      });
      if (senderObject?.length > 0) {
        userDeatails.push({
          'Id': senderObject[0]?.AssingedToUser.Id,
          'Name': senderObject[0]?.Email,
          'Suffix': senderObject[0]?.Suffix,
          'Title': senderObject[0]?.Title,
          'userImage': senderObject[0]?.Item_x0020_Cover != null ? senderObject[0]?.Item_x0020_Cover.Url : ""
        })
      } if (senderObject.length == 0) {
        userDeatails.push({
          'Title': username,
          'userImage': "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"
        })

      }
      return userDeatails;
    }

  }
  //open the model
  private OpenModal(e: any, item: any) {
    if (item.Url != undefined) {
      item.ImageUrl = item?.Url;
    }
    //debugger;
    e.preventDefault();
    // console.log(item);
    this.setState({
      isModalOpen: true,
      imageInfo: item,
      showPopup: 'block'
    });
  }

  //close the model
  private CloseModal(e: any) {
    e.preventDefault();
    this.setState({
      isModalOpen: false,
      isEditModalOpen: false,
      isEditReplyModalOpen: false,
      imageInfo: {},

      showPopup: 'none'
    });
  }
  private Closecommentpopup = () => {
    this.setState({
      isModalOpen: false,
      isEditModalOpen: false,
      isEditReplyModalOpen: false,
      imageInfo: {},

      showPopup: 'none'
    });
  }

  private handleSuffixHover() {
    //e.preventDefault();
    this.setState({
      Display: 'block'
    });
  }

  private handleuffixLeave() {
    //e.preventDefault();

    this.setState({
      Display: 'none'
    });
  }

  private showhideComposition() {
    if (this.state.showComposition) {
      this.setState({
        showComposition: false
      });
    } else {
      this.setState({
        showComposition: true
      });
    }

  }
  private showhideEstimatedTime() {
    if (this.state.ShowEstimatedTimeDescription) {
      this.setState({
        ShowEstimatedTimeDescription: false
      });
    } else {
      this.setState({
        ShowEstimatedTimeDescription: true
      });
    }

  }

  private async onPost() {


    let web = new Web(this.props.siteUrl);
    const i = await web.lists
      .getByTitle(this.state?.listName)
      // .getById(this.props.SiteTaskListID)
      .items
      .getById(this.state?.itemID)
      .update({
        FeedBack: JSON.stringify(this.state?.Result?.FeedBack)
      });

    this.setState({
      updateComment: true
    });

  }
  private openVersionHistory() {

    this.setState({
      isopenversionHistory: true
    })
  }
  private OpenEditPopUp() {
    this.setState({
      isOpenEditPopup: true
    })
  }

  private CallBack(FunctionType: any) {
    // ClientTimeArray=[];
    if (FunctionType == "Save") {
      this.setState({
        isOpenEditPopup: false,
        EditSiteCompositionStatus: false,
      })
      this.GetResult();
    }
    if (FunctionType == "Delete") {
      this.setState({
        isOpenEditPopup: false,
        TaskDeletedStatus: true,
      })
      window.location.href = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskDashboard.aspx";
    }
    if (FunctionType == "Close") {
      this.setState({
        isOpenEditPopup: false,
        EditSiteCompositionStatus: false,
      })
    }
  }

  private async approvalcallback() {
    this.setState({
      sendMail: false,
      emailStatus: ""
    })
    this.GetResult();
  }
  private async EODReportComponentCallback() {
    this.setState({
      OpenEODReportPopup: false,
    })
    this.GetResult();
  }
  private ConvertLocalTOServerDate(LocalDateTime: any, dtformat: any) {
    if (dtformat == undefined || dtformat == '')
      dtformat = "DD/MM/YYYY";
    if (LocalDateTime != '') {
      let serverDateTime;
      let mDateTime = moment(LocalDateTime);
      serverDateTime = mDateTime?.format(dtformat);
      return serverDateTime;
    }
    return '';
  }

  private allDataOfTask: any = [];
  private maincollection: any = [];

  private async getAllTaskData() {
    let breadCrumData1: any = [];
    let web = new Web(this.props.siteUrl);
    let results = [];
    results = await web.lists
      .getByTitle(this.state?.listName)
      // .getById(this.props.SiteTaskListID)
      .items
      .select("ID", "Title", "Comments", "ApproverHistory", "EstimatedTime", "Portfolio/Id", "Portfolio/Title", "PortfolioType/Id", "Portfolio/PortfolioStructureID", "DueDate", "IsTodaysTask", 'EstimatedTimeDescription', "ParentTask/Id", "Project/Id", "Project/Title", "ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
      .expand("TeamMembers", "Project", "ParentTask", "Portfolio", "PortfolioType", "SmartInformation", "AssignedTo", "TaskCategories", "Author", "ClientCategory", "ResponsibleTeam", "TaskType", "Editor", "AttachmentFiles")
      .getAll(4000);

    for (let index = 0; index < results.length; index++) {
      let item = results[index];
      item.siteType = this.state?.listName;
      item.isLastNode = false;
      this.allDataOfTask.push(item);
      this.masterTaskData.push(item)
    }
    let breadCrumData1WithSubRow: any = globalCommon.findTaskHierarchy(this.state.Result, this.masterTaskData)
    console.log(breadCrumData1WithSubRow)


    let array: any = [];
    const getValueSubRow = (row: any) => {

      row?.map((items: any) => {
        array?.push(row[0])
        if (items?.subRows?.length > 0 && items?.subRows != undefined) {
          return getValueSubRow(items?.subRows)
        }
      })
      return array
    }
    if (breadCrumData1WithSubRow.length > 0) {
      breadCrumData1 = getValueSubRow(breadCrumData1WithSubRow)
    }
    this.setState({
      breadCrumData: breadCrumData1
    })


  }


  private EditData = (e: any, item: any) => {
    this.setState({
      isTimeEntry: true,
      SharewebTimeComponent: item,

    });

  }

  private getSmartTime = () => {
    this.setState({
      smarttimefunction: true
    })

  }

  private sendEmail(item: any) {
    var data = this.state.Result;
    if (item == "Approved") {
      data.PercentComplete = 3
    } else {
      data.PercentComplete = 2
    }
    var data = this.state.Result;
    this.setState({
      Result: data,
    }),
      console.log(item);
    this.setState({
      sendMail: true,
    });
    this.setState({
      emailStatus: item,
    });

  }
  //================================ taskfeedbackcard===============
  private showhideCommentBox(index: any) {
    if (this.state.showcomment == 'none') {
      this.setState({
        showcomment: 'block',
        showhideCommentBoxIndex: index,
        showcomment_subtext: 'none',
        subchildcomment: null,
      });
    }
    else {
      this.setState({
        showcomment: 'block',
        showhideCommentBoxIndex: index,
        showcomment_subtext: 'none',
        subchildcomment: null,
      });
    }
  }
  private handleInputChange(e: any) {
    this.setState({ CommenttoPost: e.target.value });
  }
  private PostButtonClick(fbData: any, i: any) {

    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {
      //  var date= moment(new Date()).format('dd MMM yyyy HH:mm')
      var temp: any = {
        AuthorImage: this.currentUser != null && this.currentUser?.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['Title'] : "",
        // Created: new Date().toLocaleString('default',{ month: 'short',day:'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,
        // isApprovalComment:this.state.ApprovalCommentcheckbox,
        // isShowLight:this.props?.feedback?.isShowLight?this.props?.feedback?.isShowLight:""
      };
      if (this.state.ApprovalCommentcheckbox) {
        temp.isApprovalComment = this.state.ApprovalCommentcheckbox
        temp.isShowLight = fbData?.isShowLight ? fbData?.isShowLight : "";
        var approvalDataHistory = {
          ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
          Id: this.currentUser[0].Id,
          ImageUrl: this.currentUser[0].userImage,
          Title: this.currentUser[0].Title,
          isShowLight: fbData?.isShowLight ? fbData?.isShowLight : ""
        }

        if (temp.ApproverData != undefined) {
          temp.ApproverData.push(approvalDataHistory)
        } else {
          temp.ApproverData = [];
          temp.ApproverData.push(approvalDataHistory);
        }
      }
      //Add object in feedback

      if (fbData["Comments"] != undefined) {
        fbData["Comments"].unshift(temp);
      }
      else {
        fbData["Comments"] = [temp];
      }
      (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
      this.setState({
        showcomment: 'none',
        CommenttoPost: '',
      });
      this.onPost();
      this.setState({
        ApprovalCommentcheckbox: false,
        showhideCommentBoxIndex: null
      })
    } else {
      alert('Please input some text.')
    }

  }
  private openEditModal(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any) {
    this.setState({
      isEditModalOpen: true,
      CommenttoUpdate: comment?.Title,
      updateCommentText: {
        'comment': comment?.Title,
        'indexOfUpdateElement': indexOfUpdateElement,
        'indexOfSubtext': indexOfSubtext,
        'isSubtextComment': isSubtextComment,
        "data": comment,
        "parentIndexOpeneditModal": parentIndex
      }
    })
  }

  private clearComment(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any) {
    if (confirm("Are you sure, you want to delete this?")) {
      if (isSubtextComment) {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Subtext"][indexOfSubtext]?.Comments?.splice(indexOfDeleteElement, 1)
      } else {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Comments"]?.splice(indexOfDeleteElement, 1);
      }
      this.onPost();
    }

  }
  private handleUpdateComment(e: any) {
    this.setState({ CommenttoUpdate: e.target.value });
  }
  private updateComment() {
    let txtComment = this.state.CommenttoUpdate

    if (txtComment != '') {
      let temp: any = {
        AuthorImage: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['Title'] : "",
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment
      };

      if (this?.state?.isEditReplyModalOpen) {
        var EditReplyData = this?.state?.updateReplyCommentText;
        if (EditReplyData?.isSubtextComment) {
          let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Subtext[EditReplyData?.indexOfSubtext].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
          feedback.Title = this.state?.CommenttoUpdate;
        } else {
          let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
          feedback.Title = this.state?.CommenttoUpdate;
        }
      } else {
        if (this.state?.updateCommentText?.data?.isApprovalComment) {
          temp.isApprovalComment = this.state?.updateCommentText?.data?.isApprovalComment;
          temp.isShowLight = this.state?.updateCommentText?.data?.isShowLight
          temp.ApproverData = this.state?.updateCommentText?.data?.ApproverData;
        }
        if (this.state?.updateCommentText?.isSubtextComment) {
          // this.props.feedback.Subtext[this.state.updateCommentText['indexOfSubtext']]['Comments'][this.state.updateCommentText['indexOfUpdateElement']] = temp;
          this.state.Result["FeedBack"][0].FeedBackDescriptions[this.state?.updateCommentText?.parentIndexOpeneditModal].Subtext[this.state.updateCommentText['indexOfSubtext']]['Comments'][this.state.updateCommentText['indexOfUpdateElement']].Title = temp.Title

        }
        else {
          // this.props.feedback["Comments"][this.state.updateCommentText['indexOfUpdateElement']] = temp;
          this.state.Result["FeedBack"][0].FeedBackDescriptions[this.state?.updateCommentText?.parentIndexOpeneditModal]["Comments"][this.state?.updateCommentText['indexOfUpdateElement']].Title = temp.Title
        }
      }
      this.onPost();
    }
    this.setState({
      isEditModalOpen: false,
      updateCommentText: {},
      CommenttoUpdate: '',
      isEditReplyModalOpen: false,
      currentDataIndex: 0,
      replyTextComment: '',
      updateReplyCommentText: {}
    });
  }

  private SubtextPostButtonClick(j: any, parentIndex: any) {
    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {
      let temp: any = {
        AuthorImage: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['Title'] : "",
        // Created: new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,
        // isApprovalComment:this.state.ApprovalCommentcheckbox,
        // isShowLight:this.props?.feedback?.Subtext[j].isShowLight!=undefined?this.props?.feedback?.Subtext[j].isShowLight:""
      };
      if (this.state.ApprovalCommentcheckbox) {
        temp.isApprovalComment = this.state.ApprovalCommentcheckbox
        temp.isShowLight = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight != undefined ? this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight : ""
        var approvalDataHistory = {
          ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
          Id: this.currentUser[0].Id,
          ImageUrl: this.currentUser[0].userImage,
          Title: this.currentUser[0].Title,
          isShowLight: this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight != undefined ? this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight : ""
        }

        if (temp.ApproverData != undefined) {
          temp.ApproverData.push(approvalDataHistory)
        } else {
          temp.ApproverData = [];
          temp.ApproverData.push(approvalDataHistory);
        }

      }
      //Add object in feedback

      if (this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]["Subtext"][j].Comments != undefined) {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]["Subtext"][j].Comments.unshift(temp);
      }
      else {
        this.state.Result["FeedBack"][0].FeedBackDescriptions[parentIndex]["Subtext"][j]['Comments'] = [temp];
      }
      (document.getElementById('txtCommentSubtext') as HTMLTextAreaElement).value = '';
      this.setState({
        showcomment_subtext: 'none',
        CommenttoPost: '',
      });
      this.onPost();
      // sunchildcomment=null
      this.setState({
        ApprovalCommentcheckbox: false,
        subchildcomment: null,
        subchildParentIndex: null

      })
    } else {
      alert('Please input some text.')
    }

  }
  private showhideCommentBoxOfSubText(j: any, parentIndex: any) {
    // sunchildcomment = j;

    if (this.state.showcomment_subtext == 'none') {
      this.setState({
        showcomment_subtext: 'block',
        subchildcomment: j,
        subchildParentIndex: parentIndex,
        showcomment: 'none',
        showhideCommentBoxIndex: null

      });
    }
    else {
      this.setState({
        showcomment_subtext: 'block',
        subchildcomment: j,
        subchildParentIndex: parentIndex,
        showcomment: 'none',
        showhideCommentBoxIndex: null

      });
    }
  }

  //===============traffic light function==================
  private async changeTrafficLigth(index: any, item: any) {
    console.log(index);
    console.log(item);
    if (this.state.Result["Approver"]?.Id == this?.currentUser[0]?.Id) {
      let tempData: any = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[index];
      var approvalDataHistory = {
        ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Id: this.currentUser[0].Id,
        ImageUrl: this.currentUser[0].userImage,
        Title: this.currentUser[0].Title,
        isShowLight: item
      }
      tempData.isShowLight = item;
      if (tempData.ApproverData != undefined && tempData.ApproverData.length > 0) {

        tempData.ApproverData.push(approvalDataHistory);
      } else {
        tempData.ApproverData = [];
        tempData.ApproverData.push(approvalDataHistory)
      }
      console.log(tempData);
      console.log(this.state.Result["FeedBack"][0]?.FeedBackDescriptions);
      await this.onPost();
      if (this.state.Result["FeedBack"] != undefined) {
        await this.checkforMail(this.state.Result["FeedBack"][0].FeedBackDescriptions, item, tempData);

      }
    }
  }
  private async changeTrafficLigthsubtext(parentindex: any, subchileindex: any, status: any) {
    console.log(parentindex);
    console.log(subchileindex);
    console.log(status);
    if (this.state.Result["Approver"]?.Id == this.currentUser[0]?.Id) {
      let tempData: any = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex];
      var approvalDataHistory = {
        ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Id: this.currentUser[0].Id,
        ImageUrl: this.currentUser[0].userImage,
        Title: this.currentUser[0].Title,
        isShowLight: status
      }
      tempData.Subtext[subchileindex].isShowLight = status;
      if (tempData.Subtext[subchileindex].ApproverData != undefined && tempData.Subtext[subchileindex].ApproverData.length > 0) {

        tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory);
      } else {
        tempData.Subtext[subchileindex].ApproverData = [];
        tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory)
      }

      console.log(tempData);

      console.log(this.state.emailcomponentopen)
      await this.onPost();

      if (this.state.Result["FeedBack"] != undefined) {
        await this.checkforMail(this.state.Result["FeedBack"][0].FeedBackDescriptions, status, tempData?.Subtext[subchileindex]);
      }
    }
  }
  //========================= mail functionality==============
  private async checkforMail(allfeedback: any, item: any, tempData: any) {
    var countApprove = 0;
    var countreject = 0;
    console.log(allfeedback);
    if (allfeedback != null && allfeedback != undefined) {
      var isShowLight = 0;
      var NotisShowLight = 0
      if (allfeedback != undefined) {
        allfeedback?.map((items: any) => {

          if (items?.isShowLight != undefined && items?.isShowLight != "") {
            isShowLight = isShowLight + 1;
            if (items.isShowLight == "Approve") {
              changespercentage = true;
              countApprove = countApprove + 1;
            } else {
              countreject = countreject + 1;
            }


          }
          if (items?.Subtext != undefined && items?.Subtext?.length > 0) {
            items?.Subtext?.map((subtextItems: any) => {
              if (subtextItems?.isShowLight != undefined && subtextItems?.isShowLight != "") {
                isShowLight = isShowLight + 1;
                if (subtextItems?.isShowLight == "Approve") {
                  changespercentage = true;
                  countApprove = countApprove + 1;
                } else {
                  countreject = countreject + 1;
                }

              }
            })
          }
        })
      }
      if (this.state.Result.PercentComplete < 5) {
        await this.changepercentageStatus(item, tempData, countApprove,);
      }

      if (isShowLight > NotisShowLight) {
        if (item == "Reject") {
          countemailbutton = 0;
          this.setState({
            emailcomponentopen: true,
            emailComponentstatus: item
          }

          )
        }
        if (isShowLight == 1 && item == "Approve") {
          countemailbutton = 0;
          this.setState({
            emailcomponentopen: true,
            emailComponentstatus: item
          })
        } else {
          countemailbutton = 1;
          this.setState({
            emailcomponentopen: false,

          })

        }

      }
    }
  }
  //================percentage changes ==========================
  private async changepercentageStatus(percentageStatus: any, pervious: any, countApprove: any) {
    console.log(percentageStatus)
    console.log(pervious)
    console.log(countApprove)
    let percentageComplete;
    let changespercentage1;
    if ((countApprove == 1 && percentageStatus == "Approve" && (pervious?.isShowLight == "Approve" || pervious?.isShowLight != undefined))) {
      changespercentage = true;
    }
    if ((countApprove == 0 && (percentageStatus == "Reject" || percentageStatus == "Maybe") && (pervious?.isShowLight == "Reject" && pervious?.isShowLight != undefined))) {
      changespercentage = false;
    }
    if ((countApprove == 0 && percentageStatus == "Approve" && (pervious.isShowLight == "Reject" || pervious.isShowLight == "Maybe") && pervious.isShowLight != undefined)) {
      changespercentage = true;
    }


    let taskStatus = "";
    if (changespercentage == true) {
      percentageComplete = 0.03;
      changespercentage1 = 3
      taskStatus = "Approved"

    }
    if (changespercentage == false) {
      percentageComplete = 0.02;
      changespercentage1 = 2
      taskStatus = "Follow Up"
    }
    this.state.Result.PercentComplete = changespercentage1
    const web = new Web(this.props.siteUrl);
    await web.lists.getByTitle(this.state.Result.listName)

      .items.getById(this.state.Result.Id).update({
        PercentComplete: percentageComplete,
        Status: taskStatus,
      }).then((res: any) => {
        console.log(res);



      })
      .catch((err: any) => {
        console.log(err.message);
      });


  }
  // ========approval history popup =================
  private ShowApprovalHistory(items: any, parentIndex: any, subChildIndex: any) {
    console.log("this is a Approval function cxall ", items)
    this.setState({
      ApprovalHistoryPopup: true,
      ApprovalPointUserData: items,
      ApprovalPointCurrentParentIndex: parentIndex,
      currentArraySubTextIndex: subChildIndex

    })

  }
  //  ===========Appproval history popup call back ==================
  private ApprovalHistoryPopupCallBack() {
    this.setState({
      ApprovalHistoryPopup: false,
      ApprovalPointUserData: '',
      ApprovalPointCurrentParentIndex: null,
      currentArraySubTextIndex: null

    })
  }
  /// ==============reply comment function ====================
  private updateReplyMessagesFunction = (e: any) => {
    console.log(e.target.value)
    this.setState({
      replyTextComment: e.target.value
    })

  }
  private openReplycommentPopup = (i: any, k: any) => {
    this.setState({
      currentDataIndex: i + "" + k,
      isCalloutVisible: true
    })
  }
  private openReplySubcommentPopup = (i: any, j: any, k: any) => {
    this.setState({
      currentDataIndex: +i + '' + j + k,
      isCalloutVisible: true
    })
  }
  ///// ==========save reeply comment=======================
  private SaveReplyMessageFunction = () => {
    let txt: any = this.state.replyTextComment;
    console.log(this.state.currentDataIndex)
    let txtComment: any = this.state.replyTextComment;
    if (txtComment != '') {
      //  var date= moment(new Date()).format('dd MMM yyyy HH:mm')
      var temp: any =
      {
        AuthorImage: this.currentUser != null && this.currentUser?.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['Title'] : "",
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,

      };
      let index: any = this.state.currentDataIndex.split('');

      if (index.length == 2) {
        let parentIndex = parseInt(index[0])
        let commentIndex = parseInt(index[1])
        let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex].Comments[commentIndex];

        if (feedback.ReplyMessages == undefined) {
          feedback.ReplyMessages = []
          feedback.ReplyMessages.push(temp)
        } else {
          feedback.ReplyMessages.push(temp)
        }

      }
      if (index.length == 3) {
        let parentIndex = parseInt(index[0])
        let subcomentIndex = parseInt(index[1])
        let commentIndex = parseInt(index[2])
        let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex].Subtext[subcomentIndex].Comments[commentIndex];

        if (feedback.ReplyMessages == undefined) {
          feedback.ReplyMessages = []
          feedback.ReplyMessages.push(temp)
        } else {
          feedback.ReplyMessages.push(temp)
        }

      }
      console.log(temp)
      this.onPost();

      this.setState({
        isCalloutVisible: false,
        replyTextComment: "",
        currentDataIndex: 0
      })


    } else {
      alert('Please input some text.')
    }

  }
  // =========clearReplycomment===========
  private clearReplycomment(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any, replyIndex: any) {
    if (confirm("Are you sure, you want to delete this?")) {
      if (isSubtextComment) {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Subtext"][indexOfSubtext]?.Comments[indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1)
      } else {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Comments"][indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1);
      }
      this.onPost();
    }

  }
  //===========EditReplyComment===============

  private EditReplyComment(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any, replyIndex: any) {
    this.setState({
      isEditReplyModalOpen: true,
      CommenttoUpdate: comment?.Title,
      // replyTextComment:comment?.Title,
      updateReplyCommentText: {
        'comment': comment?.Title,
        'indexOfUpdateElement': indexOfUpdateElement,
        'indexOfSubtext': indexOfSubtext,
        'isSubtextComment': isSubtextComment,
        'replyIndex': replyIndex,
        "data": comment,
        "parentIndexOpeneditModal": parentIndex
      }
    })
  }
  private onRenderCustomHeadereditcomment = () => {
    return (
      <>

        <div className='siteColor subheading' >
          Update Comment
        </div>
        <Tooltip ComponentId='1683' />
      </>
    );
  };
  private contextCall = (data: any, path: any, component: any) => {
    if (data != null && path != null) {
      this.setState({
        keydoc: data,
        FileDirRef: path
      })
    }
    if (component) {
      this?.relevantDocRef?.current?.loadAllSitesDocuments()
    }
  };

  public render(): React.ReactElement<ITaskprofileProps> {
    buttonId = this.generateButtonId();
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    if (this.state.Result["TaskId"] != undefined && this.state.Result['Title'] != undefined) {
      document.title = `${this.state.Result["TaskId"]}-${this.state.Result['Title']}`
    } else {
      document.title = "Task Profile"
    }
    return (
      <MyContext.Provider value={{ ...MyContext, FunctionCall: this.contextCall, keyDoc: this.state.keydoc, FileDirRef: this.state.FileDirRef }}>
        <div
        //  style={{color:`${this.state.Result["serviceComponentColor"]}`}}
        >
          <section className='ContentSection'> {this.state.breadCrumData != undefined &&
            <div className='row'>
              <div className="col-sm-12 p-0 ">

                <ul className="spfxbreadcrumb m-0 p-0">
                  {this.state?.Result["Portfolio"] == undefined && this.state.breadCrumData?.length == 0 && this.state.Result.Title != undefined ?
                    <>
                      <li  >
                        <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Dashboard.aspx`}> <span>Dashboard</span> </a>
                      </li>


                      <li>
                        <a  >
                          <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                            <span title={this.state.Result['Title']}>{truncatedTitle?.length > 0 ? truncatedTitle : this.state.Result['Title']}</span>
                            {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                              {this.state.Result['Title']}
                            </span>}
                          </span>

                        </a>
                      </li></> : <>

                      {this.state.Result["Portfolio"] != null && this.state.breadCrumData.length > 0 &&
                        <li >
                          {this.state.Result["Portfolio"] != null &&
                            <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Team-Portfolio.aspx`}>Team Portfolio</a>
                          }

                        </li>
                      }
                      {this.state.breadCrumData?.map((breadcrumbitem: any, index: any) => {
                        return <>
                          {breadcrumbitem?.siteType == undefined && <li>

                            <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${breadcrumbitem?.Id}`}>{breadcrumbitem?.Title}</a>
                          </li>}
                          {breadcrumbitem?.siteType != undefined && <li>

                            <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${breadcrumbitem?.Id}&Site=${breadcrumbitem?.siteType} `}>{breadcrumbitem?.Title}</a>
                          </li>}
                          {this.state.breadCrumData.length == index &&
                            <li>
                              <a  >
                                <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                  <span>{truncatedTitle?.length > 0 ? truncatedTitle : this.state.Result['Title']}</span>
                                  {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                                    {this.state.Result['Title']}
                                  </span>}
                                </span>

                              </a>
                            </li>
                          }
                        </>
                      })
                      }</>}
                </ul>
              </div>
            </div>
          }
            <section className='row p-0'>
              <h2 className="heading d-flex ps-0 justify-content-between align-items-center">
                <span>
                  {this.state.Result["SiteIcon"] != "" && <img className="imgWid29 pe-1 " title={this?.state?.Result?.siteType} src={this.state.Result["SiteIcon"]} />}
                  {this.state.Result["SiteIcon"] === "" && <img className="imgWid29 pe-1 " src="" />}
                  <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                    <span >{truncatedTitle?.length > 0 ? truncatedTitle : this.state.Result['Title']}</span>
                    {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                      {this.state.Result['Title']}
                    </span>}
                  </span>
                  <a className="hreflink" title='Edit' onClick={() => this.OpenEditPopUp()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>
                    {/* <img style={{ width: '16px', height: '16px', borderRadius: '0' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" /> */}
                  </a>
                  {this.state.Result["Approver"] != undefined && this.state.Result["Categories"].includes("Approval") && this.currentUser != undefined && this.currentUser.length > 0 && this.state.Result.Approver.Id == this.currentUser[0].Id && this.state.Result["Status"] == "For Approval" &&
                    this.state.Result["PercentComplete"] == 1 && <span><button onClick={() => this.sendEmail("Approved")} className="btn btn-success ms-3 mx-2">Approve</button><span><button className="btn btn-danger" onClick={() => this.sendEmail("Rejected")}>Reject</button></span></span>
                  }
                  {this.currentUser != undefined && this.state.sendMail && this.state.emailStatus != "" && <EmailComponenet approvalcallback={() => { this.approvalcallback() }} Context={this.props.Context} emailStatus={this.state.emailStatus} currentUser={this.currentUser} items={this.state.Result} />}
                </span>
                <span className="text-end fs-6"> <a target='_blank' data-interception="off" href={this.oldTaskLink} style={{ cursor: "pointer", fontSize: "14px" }}>Old Task Profile</a></span>
                {/* {this.state.Result.sitePage == "SH" && <span className="text-end fs-6"> <a target='_blank' data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${this.state.Result.Id}&Site=${this.state.Result.listName}`} style={{ cursor: "pointer", fontSize: "14px" }}>Old Task Profile</a></span>} */}
              </h2>
            </section>
            <section>
              <div className='row'>
                <div className="col-9 bg-white">
                  <div className="team_member row">
                    <div className='col-md-4 p-0'>
                      <dl>
                        <dt className='bg-Fa'>Task Id</dt>
                        <dd className='bg-Ff position-relative' ><span className='tooltipbox'>{this.state.Result["TaskId"]} </span>
                          {TaskIdCSF != "" && <span className="idhide bg-fxdark siteColor">{TaskIdCSF?.replace("-", ">")}{TaskIdAW == "" && this.state.Result["TaskId"] != undefined && <span className='text-body'>{">" + this.state.Result["TaskId"]}</span>} {TaskIdAW != "" && <span className='text-body'>{">" + TaskIdAW?.replace("-", ">")}</span>}</span>}
                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Due Date</dt>
                        <dd className='bg-Ff'>{this.state.Result["DueDate"] != null && this.state.Result["DueDate"] != undefined ? moment(this.state.Result["DueDate"]).format("DD/MM/YYYY") : ''}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Start Date</dt>
                        <dd className='bg-Ff'>{this.state.Result["StartDate"] != undefined ? this.state.Result["StartDate"] : ""}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Completion Date</dt>
                        <dd className='bg-Ff'> {this.state.Result["CompletedDate"] != undefined ? this.state.Result["CompletedDate"] : ""}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa' title="Task Id">Categories</dt>

                        <dd className='bg-Ff text-break'>{this.state.Result["Categories"]}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Item Rank</dt>
                        <dd className='bg-Ff'>{this.state.Result["ItemRank"]}</dd>
                      </dl>
                      {/* <dl>
                        <dt className='bg-Fa'>Estimated Time</dt>
                        <dd className='bg-Ff position-relative' >
                          <span className='tooltipbox' title="hours">{this.state.Result["EstimatedTime"] != undefined ? (this.state.Result["EstimatedTime"].toFixed(1) > 1 ? this.state.Result["EstimatedTime"].toFixed(1) + " hours" : this.state.Result["EstimatedTime"].toFixed(1) + " hour") : "0.0 hour"} </span>
                        
                        </dd>
                      </dl> */}
                      {isShowTimeEntry && <dl>
                        <dt className='bg-Fa'>SmartTime Total</dt>
                        <dd className='bg-Ff'>
                          <span className="me-1 alignCenter  pull-left"> {this.state.smarttimefunction ? <SmartTimeTotal AllListId={AllListId} props={this.state.Result} Context={this.props.Context} /> : null}</span>
                        </dd>

                      </dl>}
                    </div>

                    <div className='col-md-4 p-0'>
                      <dl>
                        <dt className='bg-Fa'>Team Members</dt>
                        <dd className='bg-Ff'>
                          <div className="d-flex align-items-center">
                            {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length > 0 && this.state.Result["TeamLeader"]?.map((rcData: any, i: any) => {
                              return <div className="user_Member_img"><a href={`${this.state.Result["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`} target="_blank" data-interception="off" title={rcData?.Title}>
                                {rcData.userImage != null && <img className="workmember" src={rcData?.userImage}></img>}
                                {rcData.userImage == null && <span className="workmember bg-fxdark" >{rcData?.Suffix}</span>}
                              </a>
                              </div>
                            })}
                            {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length > 0 &&
                              <div></div>
                            }

                            {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 0 &&
                              <div className="img  "><a href={`${this.state.Result["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${this.state.Result["TeamMembers"][0]?.Id}&Name=${this.state.Result["TeamMembers"][0]?.Title}`} target="_blank" data-interception="off" title={this.state.Result["TeamMembers"][0]?.Title}>
                                {this.state.Result["TeamMembers"][0].userImage != null && <img className={`workmember ${this.state.Result["TeamMembers"][0].activeimg2}`} src={this.state.Result["TeamMembers"][0]?.userImage}></img>}
                                {this.state.Result["TeamMembers"][0].userImage == null && <span className={`workmember ${this.state.Result["TeamMembers"][0].activeimg2}  suffix_Usericon bg-e9 p-1 `} >{this.state.Result["TeamMembers"][0]?.Suffix}</span>}
                              </a> 
                              </div>
                            }

                            {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length == 2 && <div className="img mx-2"><a href={`${this.state.Result["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${this.state.Result["TeamMembers"][1]?.Id}&Name=${this.state.Result["TeamMembers"][1]?.Title}`} target="_blank" data-interception="off" title={this.state.Result["TeamMembers"][1]?.Title}>
                              {this.state.Result["TeamMembers"][1]?.userImage != null && <img className={`workmember ${this.state.Result["TeamMembers"][1]?.activeimg2}`} src={this.state.Result["TeamMembers"][1]?.userImage}></img>}
                              {this.state.Result["TeamMembers"][1]?.userImage == null && <span className={`workmember ${this.state.Result["TeamMembers"][1]?.activeimg2} suffix_Usericon bg-e9 p-1`} >{this.state.Result["TeamMembers"][1]?.Suffix}</span>}
                            </a>
                            </div>
                            }
                            {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 2 &&
                              <div className="position-relative user_Member_img_suffix2 ms-1 alignCenter" onMouseOver={(e) => this.handleSuffixHover()} onMouseLeave={(e) => this.handleuffixLeave()}>+{this.state.Result["TeamMembers"].length - 1}
                                <span className="tooltiptext" style={{ display: this.state.Display, padding: '10px' }}>
                                  <div>
                                    {this.state.Result["TeamMembers"].slice(1)?.map((rcData: any, i: any) => {

                                      return <div className=" mb-1 team_Members_Item" style={{ padding: '2px' }}>
                                        <a href={`${this.state.Result["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`} target="_blank" data-interception="off">

                                          {rcData?.userImage != null && <img className={`workmember ${rcData?.activeimg2}`} src={rcData?.userImage}></img>}
                                          {rcData?.userImage == null && <span className={`workmember ${rcData?.activeimg2} suffix_Usericon bg-e9 p-1`}>{rcData?.Suffix}</span>}

                                          <span className='mx-2'>{rcData?.Title}</span>
                                        </a>
                                      </div>

                                    })
                                    }

                                  </div>
                                </span>
                              </div>
                            }

                          </div>

                        </dd>
                      </dl>



                      <dl>
                        <dt className='bg-Fa'>Status</dt>
                        <dd className='bg-Ff'>{this.state.Result["Status"]}<br></br>
                          {this.state.Result["ApproverHistory"] != undefined && this.state.Result["ApproverHistory"].length > 1 && this.state.Result["Categories"].includes("Approval") ?
                            <span style={{ fontSize: "smaller" }}>Approved by
                              <img className="workmember" title={this.state.Result["ApproverHistory"][this.state.Result.ApproverHistory.length - 2]?.ApproverName} src={(this.state.Result?.ApproverHistory[this.state.Result?.ApproverHistory?.length - 2]?.ApproverImage != null) ? (this.state.Result.ApproverHistory[this.state.Result.ApproverHistory.length - 2]?.ApproverImage) : (this.state.Result?.ApproverHistory[this.state.Result.ApproverHistory.length - 2]?.ApproverSuffix)}></img></span>
                            // {this.state.Result["ApproverHistory"][this.state.Result.ApproverHistory.length-1].Title}
                            : null}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Working Today</dt>
                        <dd className='bg-Ff position-relative' ><span className='tooltipbox'>{this.state.Result["IsTodaysTask"] ? "Yes" : "No"} </span>
                        </dd>
                      </dl>

                      <dl>
                        <dt className='bg-Fa'>% Complete</dt>
                        <dd className='bg-Ff'>{this.state.Result["PercentComplete"] != undefined ? this.state.Result["PercentComplete"].toFixed(0) : 0}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Priority</dt>
                        <dd className='bg-Ff'>{this.state.Result["Priority"]}</dd>
                      </dl>

                      <dl>
                        <dt className='bg-Fa'>Created</dt>
                        <dd className='bg-Ff'>
                          {this.state.Result["Created"] != undefined && this.state.Result["Created"] != null ? moment(this.state.Result["Created"]).format("DD/MM/YYYY") : ""}  <span className='ms-1'>
                            {this.state.Result["Author"] != null && this.state.Result["Author"].length > 0 &&
                              <a title={this.state.Result["Author"][0].Title} >
                                {this.state.Result["Author"][0].userImage !== "" && <img className="workmember" src={this.state.Result["Author"][0].userImage} ></img>}
                                {this.state.Result["Author"][0].userImage === "" && <span className="workmember">{this.state.Result["Author"][0].Suffix}</span>}
                              </a>

                            }
                          </span>

                        </dd>
                      </dl>
                    </div>
                    <div className='col-md-4 p-0'>

                      <dl>

                        <dt className='bg-Fa'>Portfolio</dt>
                        <dd className='bg-Ff full-width'>
                          {/* {this.state.Result["Component"] != null && this.state.Result["Component"].length > 0 && this.state.Result["Component"]?.map((componentdt: any, i: any) => {
                            return (
                              <a className="hreflink" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${componentdt.Id}`}>{componentdt.Title}</a>

                            )
                          })} */}
                          {this.state?.Result["Portfolio"] != null &&

                            <a className="hreflink" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${this.state?.Result["Portfolio"].Id}`}>{this.state?.Result["Portfolio"]?.Title}</a>
                          }

                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Project</dt>
                        <dd className='bg-Ff full-width'>
                          <a className="hreflink" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Project-Management.aspx?ProjectId=${this.state.Result["Project"]?.Id}`}>{this.state.Result["Project"]?.Title}</a>
                        </dd>
                      </dl>
                      {isShowSiteCompostion && <dl className="Sitecomposition">
                        {ClientTimeArray != null && ClientTimeArray.length > 0 &&
                          <div className='dropdown'>
                            <a className="sitebutton bg-fxdark d-flex">
                              <span className="arrowicons" onClick={() => this.showhideComposition()}>{this.state.showComposition ? <SlArrowDown /> : <SlArrowRight />}</span>
                              <div className="d-flex justify-content-between full-width">
                                <p className="pb-0 mb-0">Site Composition</p>
                                <p className="input-group-text mb-0 pb-0" title="Edit Site Composition" onClick={() => this.setState({ EditSiteCompositionStatus: true })}>
                                  <span className="svg__iconbox svg__icon--editBox"></span>
                                </p>
                              </div>

                            </a>
                            <div className="spxdropdown-menu" style={{ display: this.state.showComposition ? 'block' : 'none' }}>
                              <ul>
                                {ClientTimeArray?.map((cltime: any, i: any) => {
                                  return <li className="Sitelist">
                                    <span>
                                      <img style={{ width: "22px" }} title={cltime?.SiteName} src={this.GetSiteIcon(cltime?.SiteName) ? this.GetSiteIcon(cltime?.SiteName) : this.GetSiteIcon(cltime?.Title)} />
                                    </span>
                                    {cltime?.ClienTimeDescription != undefined &&
                                      <span>
                                        {Number(cltime?.ClienTimeDescription).toFixed(2)}%
                                      </span>
                                    }
                                    {cltime.ClientCategory != undefined && cltime.ClientCategory.length > 0 ? cltime.ClientCategory?.map((clientcat: any) => {
                                      return (
                                        <span>{clientcat.Title}</span>
                                      )
                                    }) : null}
                                  </li>
                                })}
                              </ul>
                            </div>
                          </div>
                        }
                      </dl>}
                      <div className="Sitecomposition my-2">
                        <a className="sitebutton bg-fxdark alignCenter justify-content-between">
                          <span className="alignCenter">
                            <span className="svg__iconbox svg__icon--docx"></span>
                            <span className="mx-2">Submit EOD Report</span>
                          </span>
                          <span className="svg__iconbox svg__icon--editBox hreflink" title="Submit EOD Report Popup"
                            onClick={() => this.setState({ OpenEODReportPopup: true })}>
                          </span>
                        </a>
                      </div>
                      {this.state.Result?.EstimatedTimeDescriptionArray?.length > 0 &&
                        <dl className="Sitecomposition my-2">
                          <div className='dropdown'>
                            <a className="sitebutton bg-fxdark d-flex">
                              <span className="arrowicons" onClick={() => this.showhideEstimatedTime()}>{this.state.ShowEstimatedTimeDescription ? <SlArrowDown /> : <SlArrowRight />}</span>
                              <div className="d-flex justify-content-between full-width">
                                <p className="pb-0 mb-0 ">Estimated Task Time Details</p>
                              </div>
                            </a>
                            <div className="spxdropdown-menu" style={{ display: this.state.ShowEstimatedTimeDescription ? 'block' : 'none' }}>
                              <div className="col-12" style={{ fontSize: "14px" }}>
                                {this.state.Result?.EstimatedTimeDescriptionArray != null && this.state.Result?.EstimatedTimeDescriptionArray?.length > 0 ?
                                  <div>
                                    {this.state.Result?.EstimatedTimeDescriptionArray?.map((EstimatedTimeData: any, Index: any) => {
                                      return (
                                        <div className={this.state.Result?.EstimatedTimeDescriptionArray?.length == Index + 1 ? "align-content-center alignCenter justify-content-between p-1 px-2" : "align-content-center justify-content-between border-bottom alignCenter p-1 px-2"}>
                                          <div className='alignCenter'>
                                            <span className='me-2'>{EstimatedTimeData?.Team != undefined ? EstimatedTimeData?.Team : EstimatedTimeData?.Category != undefined ? EstimatedTimeData?.Category : null}</span> |
                                            <span className='mx-2'>{EstimatedTimeData.EstimatedTime ? (EstimatedTimeData.EstimatedTime > 1 ? EstimatedTimeData.EstimatedTime + " hours" : EstimatedTimeData.EstimatedTime + " hour") : "0 hour"}</span>
                                            <img className="ProirityAssignedUserPhoto m-0 mx-2" title={EstimatedTimeData.UserName} src={EstimatedTimeData.UserImage != undefined && EstimatedTimeData.UserImage?.length > 0 ? EstimatedTimeData.UserImage : ''} />
                                          </div>
                                          {EstimatedTimeData.EstimatedTimeDescription.length > 0 && <div className='alignCenter hover-text'>
                                            <span className="svg__iconbox svg__icon--info"></span>
                                            <span className='tooltip-text pop-right'>{EstimatedTimeData.EstimatedTimeDescription} </span>
                                          </div>}
                                        </div>
                                      )
                                    })}
                                  </div>
                                  : null
                                }
                              </div>
                            </div>
                            <div className="boldClable border border-top-0 ps-2 py-1">
                              <span>Total Estimated Time : </span><span className="mx-1">{this.state.Result.TotalEstimatedTime > 1 ? this.state.Result.TotalEstimatedTime + " hours" : this.state.Result.TotalEstimatedTime + " hour"} </span>
                            </div>
                          </div>
                        </dl>
                      }
                    </div>
                  </div>
                  <div className='row url'>
                    <div className="d-flex p-0">
                      <div className='bg-Fa p-2'><label>Url</label></div>
                      <div className='bg-Ff p-2 text-break full-width'>
                        {this.state.Result["component_url"] != null &&
                          <a target="_blank" data-interception="off" href={this.state.Result["component_url"].Url}>{this.state.Result["component_url"].Url}</a>
                        }
                      </div>
                    </div>
                  </div>
                  <section>
                    <div className="col mt-2">
                      <div className="Taskaddcomment row">
                        {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].length > 0 &&
                          <div className="bg-white col-sm-4 mt-2 p-0">
                            {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"]?.map((imgData: any, i: any) => {
                              return <div className="taskimage border mb-3">
                                {/*  <BannerImageCard imgData={imgData}></BannerImageCard> */}

                                <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                  <img alt={imgData?.ImageName} src={imgData?.ImageUrl}
                                    onMouseOver={(e) => this.OpenModal(e, imgData)}
                                    onMouseOut={(e) => this.CloseModal(e)} ></img>
                                </a>


                                <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-1 ">
                                  <div className='usericons'>
                                    <span>
                                      <span >{imgData?.UploadeDate}</span>
                                      <span className='round px-1'>
                                        {imgData?.UserImage != null &&
                                          <img className='align-self-start' title={imgData?.UserName} src={imgData?.UserImage} />
                                        }
                                      </span>
                                      {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                        <BiInfoCircle />
                                      </span>}

                                    </span>
                                  </div>
                                  <div className="expandicon">

                                    <span >
                                      {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                    </span>
                                    <span>|</span>
                                    <a className='images' title="Expand Image" target="_blank" data-interception="off" href={imgData?.ImageUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>
                                  </div>

                                </div>

                              </div>
                            })}
                          </div>
                        }
                        {/*feedback comment section code */}
                        <div className={this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"]?.length > 0 ? "col-sm-8 pe-0 mt-2" : "col-sm-12 p-0 mt-2"}>
                          {this.state.Result["TaskType"] != null && (this.state.Result["TaskType"] == '' ||
                            this.state.Result["TaskType"] == 'Task' || this.state.Result["TaskType"] == "Workstream" || this.state.Result["TaskType"] == "Activities") && this.state.Result["FeedBack"] != undefined && this.state.Result["FeedBack"].length > 0 && this.state.Result["FeedBack"][0].FeedBackDescriptions != undefined &&
                            this.state.Result["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                            this.state.Result["FeedBack"][0]?.FeedBackDescriptions[0]?.Title != '' && this.state.countfeedback >= 0 &&
                            <div className={"Addcomment " + "manage_gap"}>
                              {this.state.Result["FeedBack"][0]?.FeedBackDescriptions?.map((fbData: any, i: any) => {
                                let userdisplay: any = [];
                                userdisplay.push({ Title: this.props?.userDisplayName })


                                if (fbData != null && fbData != undefined && fbData?.Title != "") {

                                  try {
                                    if (fbData?.Title != undefined) {
                                      fbData.Title = fbData?.Title?.replace(/\n/g, '<br>');

                                    }
                                  } catch (e) {
                                  }
                                  return (
                                    <>
                                      <div>
                                        {/* { this.state?.emailcomponentopen && countemailbutton==0 &&<EmailComponenet approvalcallback={() => { this.approvalcallback() }}  Context={this.props?.Context} emailStatus={this.state?.emailComponentstatus}  currentUser={this.props?.CurrentUser} items={this.props?.Result} />} */}
                                        <div className="col mb-2">
                                          <div className='justify-content-between d-flex'>
                                            <div className="alignCenter m-0">
                                              {this.state.ApprovalStatus ?
                                                <span className="alignCenter">
                                                  <span title="Rejected"
                                                    onClick={() => this.changeTrafficLigth(i, "Reject")}
                                                    className={fbData['isShowLight'] == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                  >
                                                  </span>
                                                  <span
                                                    onClick={() => this.changeTrafficLigth(i, "Maybe")}
                                                    title="Maybe" className={fbData['isShowLight'] == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                  </span>
                                                  <span title="Approved"
                                                    onClick={() => this.changeTrafficLigth(i, "Approve")}
                                                    className={fbData['isShowLight'] == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                                  </span>
                                                  {fbData['ApproverData'] != undefined && fbData?.ApproverData.length > 0 &&
                                                    <>
                                                      <a className='hreflink mt--2 mx-2'
                                                        onClick={() => this.ShowApprovalHistory(fbData, i, null)}
                                                      >Approved by -</a>
                                                      <img className="workmember" src={fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.ImageUrl}></img>
                                                    </>}
                                                </span>

                                                : null
                                              }
                                            </div>
                                            <div className='m-0'>
                                              <span className="d-block">
                                                <a style={{ cursor: 'pointer' }} onClick={(e) => this.showhideCommentBox(i)}>Add Comment</a>
                                              </span>
                                            </div>
                                          </div>


                                          <div className="d-flex p-0 FeedBack-comment ">
                                            <div className="border p-1 me-1">
                                              <span>{i + 1}.</span>
                                              <ul className='list-none'>
                                                <li>
                                                  {fbData['Completed'] != null && fbData['Completed'] &&

                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                                                  }
                                                </li>
                                                <li>
                                                  {fbData['HighImportance'] != null && fbData['HighImportance'] &&
                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                                                  }
                                                </li>
                                                <li>
                                                  {fbData['LowImportance'] != null && fbData['LowImportance'] &&
                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                                                  }
                                                </li>
                                                <li>
                                                  {fbData['Phone'] != null && fbData['Phone'] &&
                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                                                  }
                                                </li>
                                              </ul>
                                            </div>

                                            <div className="border p-2 full-width text-break"
                                            // title={fbData.ApproverData != undefined && fbData.ApproverData.length > 0 ? fbData.ApproverData[fbData.ApproverData.length - 1].isShowLight : ""}
                                            >

                                              <span dangerouslySetInnerHTML={{ __html: fbData?.Title?.replace(/\n/g, "<br>") }}></span>
                                              <div className="col">
                                                {fbData['Comments'] != null && fbData['Comments']?.length > 0 && fbData['Comments']?.map((fbComment: any, k: any) => {
                                                  return <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col add_cmnt my-1 ${fbComment.isShowLight}` : "col add_cmnt my-1"} title={fbComment.isShowLight != undefined ? fbComment.isShowLight : ""}>
                                                    <div className="">
                                                      <div className="d-flex p-0">
                                                        <div className="col-1 p-0 wid30">
                                                          <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                                                            fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                        </div>
                                                        <div className="col-11 pe-0" >
                                                          <div className='d-flex justify-content-between align-items-center'>
                                                            {fbComment?.AuthorName} - {fbComment?.Created}
                                                            <span className='d-flex'>
                                                              <a className="ps-1" title="Comment Reply" >
                                                                <div data-toggle="tooltip" id={buttonId + "-" + i + k}
                                                                  onClick={() => this.openReplycommentPopup(i, k)}
                                                                  data-placement="bottom"
                                                                >
                                                                  <span className="svg__iconbox svg__icon--reply"></span>
                                                                </div>
                                                              </a>
                                                              <a title='Edit'
                                                                onClick={() => this.openEditModal(fbComment, k, 0, false, i)}
                                                              >
                                                                <span className='svg__iconbox svg__icon--edit'></span>
                                                              </a>
                                                              <a title='Delete'
                                                                onClick={() => this.clearComment(false, k, 0, i)}
                                                              >
                                                                <span className='svg__iconbox svg__icon--trash'></span></a>
                                                            </span>
                                                          </div>
                                                          <div><span dangerouslySetInnerHTML={{ __html: fbComment?.Title.replace(/\n/g, "<br>") }}></span></div>
                                                        </div>
                                                      </div>
                                                      <div className="col-12 ps-3 pe-0 mt-1">
                                                        {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                          return (
                                                            <div className="d-flex border ms-3 p-2  mb-1">
                                                              <div className="col-1 p-0 wid30">
                                                                <img className="workmember" src={replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ?
                                                                  replymessage.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                              </div>
                                                              <div className="col-11 pe-0" >
                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                  {replymessage?.AuthorName} - {replymessage?.Created}
                                                                  <span className='d-flex'>
                                                                    <a title='Edit'
                                                                      onClick={() => this.EditReplyComment(replymessage, k, 0, false, i, index)
                                                                      }
                                                                    >
                                                                      <span className='svg__iconbox svg__icon--edit'></span>
                                                                    </a>
                                                                    <a title='Delete'
                                                                      onClick={() => this.clearReplycomment(false, k, 0, i, index)
                                                                      }
                                                                    >
                                                                      <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                  </span>
                                                                </div>
                                                                <div><span dangerouslySetInnerHTML={{ __html: replymessage?.Title.replace(/\n/g, "<br>") }}></span></div>
                                                              </div>
                                                            </div>

                                                          )
                                                        })}
                                                      </div>
                                                    </div>


                                                  </div>


                                                })}
                                              </div>

                                            </div>
                                          </div>
                                          {this.state.showhideCommentBoxIndex == i && <div className='SpfxCheckRadio'>
                                            <div className="col-sm-12 mt-2 p-0" style={{ display: this.state.showcomment }} >
                                              {this.state.Result["Approver"]?.Id == this?.currentUser[0]?.Id && <label className='label--checkbox'><input type='checkbox' className='checkbox' name='approval' checked={this.state.ApprovalCommentcheckbox} onChange={(e) => this.setState({ ApprovalCommentcheckbox: e.target.checked })} />
                                                Mark as Approval Comment</label>}
                                            </div>
                                            <div className="align-items-center d-flex"
                                              style={{ display: this.state.showcomment }}
                                            >  <textarea id="txtComment" onChange={(e) => this.handleInputChange(e)} className="form-control full-width"></textarea>
                                              <button type="button" className={this.state.Result["Approver"]?.Id == this.currentUser[0]?.Id ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => this.PostButtonClick(fbData, i)}>Post</button>
                                            </div>
                                          </div>}

                                        </div>

                                        {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                                          return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>
                                            <div className='justify-content-between d-flex'>
                                              <div className='alignCenter m-0'>
                                                {this.state.ApprovalStatus ?
                                                  <span className="alignCenter">
                                                    <span title="Rejected"
                                                      onClick={() => this.changeTrafficLigthsubtext(i, j, "Reject")}
                                                      className={fbSubData.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                    >
                                                    </span>
                                                    <span title="Maybe"
                                                      onClick={() => this.changeTrafficLigthsubtext(i, j, "Maybe")}
                                                      className={fbSubData?.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                    </span>
                                                    <span title="Approved"
                                                      onClick={() => this.changeTrafficLigthsubtext(i, j, "Approve")}
                                                      className={fbSubData?.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                                    </span>
                                                    {fbSubData.ApproverData != undefined && fbSubData.ApproverData.length > 0 && <>
                                                      <a className='hreflink mt--2 mx-2'
                                                        onClick={() => this.ShowApprovalHistory(fbSubData, i, j)}
                                                      >Approved by -</a>
                                                      <img className="workmember" src={fbSubData?.ApproverData[fbSubData?.ApproverData?.length - 1]?.ImageUrl}></img>
                                                    </>}
                                                  </span>
                                                  : null
                                                }
                                              </div>
                                              <div className='m-0'>
                                                <a className="d-block text-end">
                                                  <a style={{ cursor: 'pointer' }}
                                                    onClick={(e) => this.showhideCommentBoxOfSubText(j, i)}
                                                  >Add Comment</a>
                                                </a>
                                              </div>
                                            </div>

                                            <div className="d-flex pe-0 FeedBack-comment">
                                              <div className="border p-1 me-1">
                                                <span >{i + 1}.{j + 1}</span>
                                                <ul className="list-none">
                                                  <li>
                                                    {fbSubData?.Completed != null && fbSubData?.Completed &&
                                                      <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                                                    }
                                                  </li>
                                                  <li>
                                                    {fbSubData?.HighImportance != null && fbSubData?.HighImportance &&
                                                      <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                                                    }
                                                  </li>
                                                  <li>
                                                    {fbSubData?.LowImportance != null && fbSubData?.LowImportance &&
                                                      <span><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                                                    }
                                                  </li>
                                                  <li>
                                                    {fbSubData?.Phone != null && fbSubData?.Phone &&
                                                      <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                                                    }
                                                  </li>
                                                </ul>
                                              </div>

                                              <div className="border p-2 full-width text-break"
                                              // title={fbSubData?.ApproverData != undefined && fbSubData?.ApproverData?.length > 0 ? fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.isShowLight : ""}
                                              >
                                                <span ><span dangerouslySetInnerHTML={{ __html: fbSubData?.Title?.replace(/\n/g, "<br>") }}></span></span>
                                                <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                                                  {fbSubData?.Comments != null && fbSubData.Comments.length > 0 && fbSubData?.Comments?.map((fbComment: any, k: any) => {
                                                    return <div className={fbComment?.isShowLight != undefined && fbComment.isApprovalComment ? `col-sm-12  mb-2 add_cmnt my-1 ${fbComment?.isShowLight}` : "col-sm-12  mb-2 add_cmnt my-1 "} title={fbComment?.isShowLight != undefined ? fbComment?.isShowLight : ""}>
                                                      <div className="">
                                                        <div className="d-flex p-0">
                                                          <div className="col-1 p-0 wid30">
                                                            <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                                                              fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                          </div>
                                                          <div className="col-11 pad0" key={k}>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                              {fbComment?.AuthorName} - {fbComment?.Created}
                                                              <span className='d-flex'>
                                                                <a className="ps-1" title="Comment Reply" >
                                                                  <div data-toggle="tooltip" id={buttonId + "-" + i + j + k}
                                                                    onClick={() => this.openReplySubcommentPopup(i, j, k)}
                                                                    data-placement="bottom"
                                                                  >
                                                                    <span className="svg__iconbox svg__icon--reply"></span>
                                                                  </div>
                                                                </a>
                                                                <a title="Edit"
                                                                  onClick={() => this.openEditModal(fbComment, k, j, true, i)}
                                                                >

                                                                  <span className='svg__iconbox svg__icon--edit'></span>
                                                                </a>
                                                                <a title='Delete'
                                                                  onClick={() => this.clearComment(true, k, j, i)}
                                                                ><span className='svg__iconbox svg__icon--trash'></span></a>
                                                              </span>
                                                            </div>
                                                            <div ><span dangerouslySetInnerHTML={{ __html: fbComment?.Title.replace(/\n/g, "<br>") }}></span></div>
                                                          </div>
                                                        </div>
                                                        <div className="col-12 ps-3 pe-0 mt-1">
                                                          {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, ReplyIndex: any) => {
                                                            return (
                                                              <div className="d-flex border ms-3 p-2  mb-1">
                                                                <div className="col-1 p-0 wid30">
                                                                  <img className="workmember" src={replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ?
                                                                    replymessage.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                </div>
                                                                <div className="col-11 pe-0" >
                                                                  <div className='d-flex justify-content-between align-items-center'>
                                                                    {replymessage?.AuthorName} - {replymessage?.Created}
                                                                    <span className='d-flex'>
                                                                      <a title='Edit'

                                                                        onClick={() => this.EditReplyComment(replymessage, k, 0, true, i, ReplyIndex)
                                                                        }
                                                                      >
                                                                        <span className='svg__iconbox svg__icon--edit'></span>
                                                                      </a>
                                                                      <a title='Delete'
                                                                        onClick={() => this.clearReplycomment(true, k, j, i, ReplyIndex)}

                                                                      >
                                                                        <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                    </span>
                                                                  </div>
                                                                  <div><span dangerouslySetInnerHTML={{ __html: replymessage?.Title.replace(/\n/g, "<br>") }}></span></div>
                                                                </div>
                                                              </div>

                                                            )
                                                          })}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                            {this.state?.subchildcomment == j && this.state?.subchildParentIndex == i ? <div className='SpfxCheckRadio' >
                                              <div className="col-sm-12 mt-2 p-0  "
                                              //  style={{ display: this.state.showcomment_subtext }}
                                              >
                                                {this.state.Result["Approver"]?.Id == this.currentUser[0]?.Id && <label className='label--checkbox'><input type='checkbox' className='checkbox' checked={this.state?.ApprovalCommentcheckbox} onChange={(e) => this.setState({ ApprovalCommentcheckbox: e.target?.checked })} />Mark as Approval Comment</label>}

                                              </div>

                                              <div className="align-items-center d-flex"
                                              //  style={{ display: this.state.showcomment_subtext }}
                                              >  <textarea id="txtCommentSubtext" onChange={(e) => this.handleInputChange(e)} className="form-control full-width" ></textarea>
                                                <button type="button" className={this.state.Result["Approver"]?.Id == this.currentUser[0]?.Id ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => this.SubtextPostButtonClick(j, i)}>Post</button>
                                              </div>
                                            </div> : null}

                                          </div>
                                        })}

                                        <Panel
                                          onRenderHeader={this.onRenderCustomHeadereditcomment}
                                          isOpen={this.state.isEditModalOpen ? this.state.isEditModalOpen : this.state.isEditReplyModalOpen}
                                          onDismiss={this.Closecommentpopup}
                                          isBlocking={this.state.isEditModalOpen ? !this.state.isEditModalOpen : !this.state.isEditReplyModalOpen}>
                                          <div className="modal-body">
                                            <div className='col'><textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => this.handleUpdateComment(e)}  >{this.state?.CommenttoUpdate}</textarea></div>
                                          </div>
                                          <footer className='modal-footer'>
                                            <button className="btn btn-primary ms-1" onClick={(e) => this.updateComment()}>Save</button>
                                            <button className='btn btn-default ms-1' onClick={this.Closecommentpopup}>Cancel</button>


                                          </footer>


                                        </Panel>

                                        {this.state.ApprovalHistoryPopup ? <ApprovalHistoryPopup
                                          ApprovalPointUserData={this.state.ApprovalPointUserData}
                                          ApprovalPointCurrentIndex={this.state.ApprovalPointCurrentParentIndex}
                                          ApprovalPointHistoryStatus={this.state.ApprovalHistoryPopup}
                                          currentArrayIndex={this.state.currentArraySubTextIndex}
                                          callBack={() => this.ApprovalHistoryPopupCallBack()}
                                        />
                                          : null}
                                      </div>


                                    </>
                                  )
                                }
                              })}
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                    {/*===================Backgroundimage code and comment========== */}

                    {this.backGroundComment && <div className="col mt-2">
                      <div className="Taskaddcomment row">
                        {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"].length > 0 &&
                          <div className="bg-white col-sm-4 mt-2 p-0">
                            {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"]?.map((imgData: any, i: any) => {
                              return <div className="taskimage border mb-3">
                                <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                  <img alt={imgData?.ImageName} src={imgData?.Url}
                                    onMouseOver={(e) => this.OpenModal(e, imgData)}
                                    onMouseOut={(e) => this.CloseModal(e)} ></img>
                                </a>


                                <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-2 ">
                                  <div className='usericons'>
                                    <span>
                                      <span >
                                        {imgData?.ImageName?.length > 15 ? imgData?.ImageName?.substring(0, 15) + '...' : imgData?.ImageName}
                                      </span>


                                    </span>
                                  </div>
                                  <div className="expandicon">
                                    <span >{imgData?.UploadeDate}</span>
                                    <span className='round px-1'>
                                      {imgData?.UserImage !== null &&
                                        <img className='align-self-start' title={imgData?.UserName} src={imgData?.UserImage} />
                                      }
                                    </span>
                                  </div>
                                </div>

                              </div>
                            })}
                          </div>
                        }
                        {this.state.Result["OffshoreComments"] != null && this.state.Result["OffshoreComments"] != undefined && this.state.Result["OffshoreComments"].length > 0 && <div className="col-sm-8 pe-0 mt-2">
                          <fieldset className='border p-1'>
                            <legend className="border-bottom fs-6">Background Comments</legend>
                            {this.state.Result["OffshoreComments"] != null && this.state.Result["OffshoreComments"].length > 0 && this.state.Result["OffshoreComments"]?.map((item: any, index: any) => {
                              return <div>


                                <span className='round px-1'>
                                  {item.AuthorImage != null &&
                                    <img className='align-self-start' title={item?.AuthorName} src={item?.AuthorImage} />
                                  }
                                </span>

                                <span className="pe-1">{item.AuthorName}</span>
                                <span className="pe-1" >{moment(item?.Created).format("DD/MM/YY")}</span>
                                <div style={{ paddingLeft: "30px" }} className=" mb-4 text-break"><span dangerouslySetInnerHTML={{ __html: item?.Body }}></span>
                                </div>


                              </div>
                            })} </fieldset>

                        </div>}
                      </div>
                    </div>}

                  </section>
                  <div className="row">
                    <div className='p-0'> {this.state.Result.Id != undefined && <KeyDocuments ref={this?.relevantDocRef} AllListId={AllListId} Context={this.props?.Context} siteUrl={this.props.siteUrl} DocumentsListID={this.props?.DocumentsListID} ID={this.state?.itemID} siteName={this.state.listName} folderName={this.state.Result['Title']} keyDoc={true}></KeyDocuments>}</div>
                  </div>
                </div>
                <div className="col-3">
                  <div>
                    {this.state.Result != undefined && AllListId != undefined && <CommentCard siteUrl={this.props.siteUrl} AllListId={AllListId} Context={this.props.Context}></CommentCard>}
                    {this.state.Result?.Id != undefined && AllListId != undefined && <>
                      <AncTool item={this?.state?.Result} callBack={this.AncCallback} AllListId={AllListId} Context={this.props.Context} />
                    </>}
                  </div>
                  <div>{this.state.Result.Id && <SmartInformation ref={this.smartInfoRef} Id={this.state.Result.Id} AllListId={AllListId} Context={this.props?.Context} taskTitle={this.state.Result?.Title} listName={this.state.Result?.listName} />}</div>
                  <div> {this.state.Result.Id != undefined && <RelevantDocuments ref={this?.relevantDocRef} AllListId={AllListId} Context={this.props?.Context} siteUrl={this.props.siteUrl} DocumentsListID={this.props?.DocumentsListID} ID={this.state?.itemID} siteName={this.state.listName} folderName={this.state.Result['Title']} ></RelevantDocuments>}</div>

                </div>

              </div>
            </section></section>
          <section className='TableContentSection'>
            {console.log("context data ================", MyContext)}

            <div className="row">
              {this.state.Result != undefined && this.state.Result.Id != undefined && this.state.Result.TaskType != "" && this.state.Result.TaskType != undefined && this.state.Result.TaskType != 'Task' ? <TasksTable props={this.state.Result} AllListId={AllListId} Context={this.props?.Context} /> : ''}
            </div>
            <div className='row'>
              {/* {this.state.Result?.PortfolioType!=undefined &&<TaskWebparts props={this.state.Result}/>} */}
              {this.state.Result != undefined &&
                <div className="ItemInfo mb-20" style={{ paddingTop: '15px' }}>

                  <div>Created <span >{(moment(this.state.Result['Creation']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{this.state.Result['Author'] != null && this.state.Result['Author'].length > 0 && this.state.Result['Author'][0].Title}</span>
                  </div>
                  <div>Last modified <span >{(moment(this.state.Result['Modified']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{this.state.Result['ModifiedBy'] != null && this.state.Result['ModifiedBy'].Title}</span><span className='mx-1'>|</span>
                    {/* <div>Last modified <span >{this.ConvertLocalTOServerDate(this.state.Result['Modified'], 'DD MMM YYYY hh:mm')}</span> by <span className="siteColor">{this.state.Result['ModifiedBy'] != null && this.state.Result['ModifiedBy'].Title}</span> */}
                    <span>{this.state.itemID ? <VersionHistoryPopup taskId={this.state.itemID} listId={this.state.Result.listId} siteUrls={this.state.Result.siteUrl} isOpen={this.state.isopenversionHistory} /> : ''}</span>
                  </div>
                </div>
              }
            </div>
          </section>

          <div className='imghover' style={{ display: this.state.showPopup }}>
            <div className="popup">
              <div className="parentDiv">
                <span style={{ color: 'white' }}>{this.state.imageInfo["ImageName"]}</span>
                <img style={{ maxWidth: '100%' }} src={this.state.imageInfo["ImageUrl"]}></img>
              </div>
            </div>
          </div>
          {this?.state?.isCalloutVisible ? (

            <FocusTrapCallout
              className='p-2 replyTooltip'
              role="alertdialog"
              // className={this.styles.callout}
              gapSpace={0}
              target={`#${buttonId}-${this.state.currentDataIndex}`}
              onDismiss={() => this.setState({
                isCalloutVisible: false
              })}
              setInitialFocus
            >
              <Text block variant="xLarge" className='subheading m-0 f-15'
              //  className={this.styles.title}
              >
                Comment Reply
              </Text>
              <Text block variant="small">
                <div className="d-flex my-2">
                  <textarea className="form-control" value={this?.state?.replyTextComment}
                    onChange={(e) => this.updateReplyMessagesFunction(e)}
                  ></textarea>
                </div>

              </Text>
              <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                <Stack
                  className='modal-footer'
                  gap={8} horizontal>

                  <button className='btn btn-default'
                    onClick={() => this.setState({
                      isCalloutVisible: false
                    })}
                  >Cancel</button>
                  <button className='btn btn-primary'
                    onClick={this.SaveReplyMessageFunction}
                  >Save</button>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>

          ) : null
          }
          {this.state.isOpenEditPopup ? <EditTaskPopup Items={this.state.Result} context={this.props.Context} AllListId={AllListId} Call={(Type: any) => { this.CallBack(Type) }} /> : ''}
          {/* {this.state.isTimeEntry ? <TimeEntry props={this.state.Result} isopen={this.state.isTimeEntry} CallBackTimesheet={() => { this.CallBackTimesheet() }} /> : ''} */}
          {this.state.EditSiteCompositionStatus ? <EditSiteComposition EditData={this.state.Result} context={this.props.Context} AllListId={AllListId} Call={(Type: any) => { this.CallBack(Type) }} /> : ''}
          {this.state?.emailcomponentopen && countemailbutton == 0 && <EmailComponenet approvalcallback={() => { this.approvalcallback() }} Context={this.props?.Context} emailStatus={this.state?.emailComponentstatus} currentUser={this?.currentUser} items={this.state?.Result} />}
          {this.state?.OpenEODReportPopup ? <EODReportComponent TaskDetails={this.state.Result} siteUrl={this.props?.siteUrl} Callback={() => { this.EODReportComponentCallback() }} /> : null}
        </div>
      </MyContext.Provider>
    );
  }
}
export default Taskprofile
export { MyContext }
