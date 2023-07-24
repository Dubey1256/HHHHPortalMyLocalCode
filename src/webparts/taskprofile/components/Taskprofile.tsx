import * as React from 'react';
import * as moment from 'moment';
import { ITaskprofileProps } from './ITaskprofileProps';
import TaskFeedbackCard from './TaskFeedbackCard';
import { Web } from "sp-pnp-js";
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as globalCommon from '../../../globalComponents/globalCommon'
import { BiInfoCircle } from 'react-icons/bi'
import SmartTimeTotal from './SmartTimeTotal';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import RelevantDocuments from './RelevantDocuments';
import SmartInformation from './SmartInformation';
import VersionHistoryPopup from '../../../globalComponents/VersionHistroy/VersionHistory';
import TasksTable from './TaskfooterTable';
import EmailComponenet from './emailComponent';
import EditSiteComposition from './EditSiteComposition';
import AncTool from '../../../globalComponents/AncTool/AncTool';
var ClientTimeArray: any = [];
var TaskIdCSF: any = "";
var TaskIdAW = "";
var AllListId: any;
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
export interface ITaskprofileState {
  Result: any;
  listName: string;
  itemID: number;
  isModalOpen: boolean;
  imageInfo: any;
  Display: string;
  showcomment: string;
  updateComment: boolean;
  showComposition: boolean;
  isOpenEditPopup: boolean;
  isTimeEntry: boolean,
  emailStatus: String,
  countfeedback: any ,
  sendMail: boolean,
  showPopup: any;
  EditSiteCompositionStatus: any;
  maincollection: any;
  SharewebTimeComponent: any;
  isopenversionHistory: boolean;
  smarttimefunction: boolean;
  ApprovalStatus: boolean;
}

export default class Taskprofile extends React.Component<ITaskprofileProps, ITaskprofileState> {
  private taskUsers: any = [];
  private smartMetaDataIcon: any;
  private currentUser: any;
  private oldTaskLink: any;
  private site: any;

  count: number = 0;

  countemailbutton: number = 0;
  backGroundComment = false;
  this: any;
  public constructor(props: ITaskprofileProps, state: ITaskprofileState) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    console.log(params.get('taskId'));
    console.log(params.get('Site'));
    this.site = params.get('Site');
     
    this.oldTaskLink = `${props.siteUrl}/SitePages/Task-Profile-Old.aspx?taskId=` + params.get('taskId') + "&Site=" + params.get('Site');
    this.state = {
      Result: {},
      listName: params.get('Site'),
      itemID: Number(params.get('taskId')),
      isModalOpen: false,
      imageInfo: {},
      Display: 'none',
      showcomment: 'none',
      updateComment: false,
      showComposition: true,
      isOpenEditPopup: false,
      isopenversionHistory: false,
      isTimeEntry: false,
      emailStatus: "",
      countfeedback:0,
      // TaskIdHover:"",
      sendMail: false,
      showPopup: 'none',
      maincollection: [],
      SharewebTimeComponent: [],
      smarttimefunction: false,
      ApprovalStatus: false,
      EditSiteCompositionStatus: false,
    }

    this.GetResult();
  }

  // public async componentDidMount() {


  // }

  private gAllDataMatches: any = [];
  private taskResult: any;
  private async loadOtherDetailsForComponents(task: any) {

    if (task.Component.length > 0) {
      await this.loadComponentsDataForTasks(task);
      await this.getAllTaskData();
      if (this.count == 0) {
        this.breadcrumb();
        this.count++;
      }
      console.log('Array for Breadcrumb');
      console.log(this.maincollection);
      this.setState({
        maincollection: this.maincollection
      })

    }
    else if (task.Services.length > 0) {
      await this.loadComponentsDataForTasks(task);
      await this.getAllTaskData();
      if (this.count == 0) {
        this.breadcrumb();
        this.count++;
      }

      this.setState({
        maincollection: this.maincollection
      })
    }
    else if (task?.Services?.length == 0 && task?.Component?.length == 0) {
      await this.loadComponentsDataForTasks(task);
      await this.getAllTaskData();
      if (this.count == 0) {
        this.breadcrumb();
        this.count++;
      }

      this.setState({
        maincollection: this.maincollection
      })
    }
  }

  private async loadComponentsDataForTasks(Items: any) {
    let DataForQuery = [];
    if (Items?.Component != undefined && Items?.Component?.length > 0) {
      DataForQuery = Items?.Component;
    }
    if (Items?.Services != undefined && Items?.Services?.length > 0) {
      DataForQuery = Items.Services;
    }

    if (DataForQuery?.length > 0) {
      let query = 'filter=';
      DataForQuery.forEach(function (item: any) {
        query += "(Id eq '" + item?.Id + "')or";
      });
      query = query.slice(0, query?.length - 2);

      let web = new Web(this.props?.siteUrl);
      let AllDataMatches = [];
      AllDataMatches = await web.lists
        // .getByTitle("Master Tasks")
        .getById(this.props.MasterTaskListID)
        .items
        .select('ComponentCategory/Id', 'PortfolioStructureID', 'SharewebTaskType/Id', "SharewebTaskType/Title", 'Portfolio_x0020_Type', 'ComponentCategory/Title', 'Id', 'ValueAdded', 'Idea', 'Sitestagging', 'TechnicalExplanations', 'Short_x0020_Description_x0020_On', 'Short_x0020_Description_x0020__x', 'Short_x0020_description_x0020__x0', 'Admin_x0020_Notes', 'Background', 'Help_x0020_Information', 'Item_x0020_Type', 'Title', 'Parent/Id', 'Parent/Title')
        .expand('Parent', 'ComponentCategory', 'SharewebTaskType')
        .filter(query.replace('filter=', ''))
        .orderBy('Modified', false)
        .getAll(4000);
      this.gAllDataMatches = AllDataMatches;

      TaskIdCSF = (AllDataMatches[0]?.PortfolioStructureID)?.replace("-", ">");
      console.log(TaskIdCSF);


      if (AllDataMatches[0] != undefined && AllDataMatches[0]?.Item_x0020_Type != undefined && AllDataMatches[0]?.Item_x0020_Type == 'Component') {

        return AllDataMatches;
      }

      else {
        let query = 'filter=';
        AllDataMatches?.forEach(function (item: any) {
          query += "(Id eq '" + item?.Parent?.Id + "')or";
        });
        query = query.slice(0, query?.length - 2);
        await this.loadOtherComponentsData(query, AllDataMatches);
      }
    }
  }

  private async loadOtherComponentsData(query: any, AllDataMatches: any) {
    let web = new Web(this.props?.siteUrl);
    let Data = await web.lists
      // .getByTitle("Master Tasks")
      .getById(this.props.MasterTaskListID)
      .items
      .select('ComponentCategory/Id', 'PortfolioStructureID', "SharewebTaskType/Id", "SharewebTaskType/Title", 'Portfolio_x0020_Type', 'ComponentCategory/Title', 'Id', 'ValueAdded', 'Idea', 'Sitestagging', 'TechnicalExplanations', 'Short_x0020_Description_x0020_On', 'Short_x0020_Description_x0020__x', 'Short_x0020_description_x0020__x0', 'Admin_x0020_Notes', 'Background', 'Help_x0020_Information', 'Item_x0020_Type', 'Title', 'Parent/Id', 'Parent/Title')
      .expand('Parent', 'ComponentCategory', 'SharewebTaskType')
      .filter(query.replace('filter=', ''))
      .orderBy('Modified', false)
      .getAll(4000);

    Data.forEach(function (Item: any) {
      // Item['Shareweb_x0020_ID'] = globalCommon.getTaskId( Item)
      AllDataMatches.push(Item);
    });

    if (Data[0] != undefined && Data[0]?.Item_x0020_Type != undefined && Data[0]?.Item_x0020_Type == 'SubComponent') {
      let query = 'filter=';
      Data.forEach(function (item: any) {
        query += "(Id eq '" + item?.Parent?.Id + "')or";
      })
      query = query.slice(0, query?.length - 2);
      await this.loadOtherComponentsData(query, AllDataMatches);
    }
    else {
      return AllDataMatches;
    }
  }
  private getsmartmetadataIcon=async()=>{
    let web = new Web(this.props?.siteUrl);
    await web.lists
    // .getByTitle('SmartMetadata')
    .getById(this.props.SmartMetadataListID)
    .items
    .select('Id', 'Title', 'Item_x0020_Cover', 'TaxType',  'siteName', 'siteUrl', 'Item_x005F_x0020_Cover')

    .filter("TaxType eq 'Sites'").top(4000)
    .get().then((data:any)=>{
     this. smartMetaDataIcon=data;

    }).catch((error:any)=>{
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
      .select("ID", "Title", "Comments","ApproverHistory","EstimatedTime", "DueDate","IsTodaysTask", "Approver/Id", "Approver/Title", "ParentTask/Id","Project/Id","Project/Title", "ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "SharewebTaskLevel1No", "SharewebTaskLevel2No", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "SharewebCategories/Id", "SharewebCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Services/ItemType", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
      .expand("Team_x0020_Members", "Project","Approver", "ParentTask", "SmartInformation", "AssignedTo", "SharewebCategories", "Author", "ClientCategory", "Responsible_x0020_Team", "SharewebTaskType", "Component", "Services", "Editor", "AttachmentFiles")
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
      TaskTypeID:this.props.TaskTypeID,
      isShowTimeEntry: isShowTimeEntry,
      isShowSiteCompostion: isShowSiteCompostion
    }
    taskDetails["listName"] = this.state?.listName;
    taskDetails["siteType"] = this.state?.listName;
    taskDetails["siteUrl"] = this.props?.siteUrl;

    taskDetails.TaskId = globalCommon.getTaskId(taskDetails);
    var category = ""
    if (taskDetails["SharewebCategories"] != undefined && taskDetails["SharewebCategories"].length > 0) {
      taskDetails["SharewebCategories"]?.map((item: any, index: any) => {
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
        if (taskDetails?.Team_x0020_Members != undefined) {
          for (let i = 0; i < taskDetails?.Team_x0020_Members?.length; i++) {
            if (item.Id == taskDetails?.Team_x0020_Members[i]?.Id) {
              taskDetails?.Team_x0020_Members?.splice(i, true);
              i--;
            }
          }
        }

        item.workingMember = "activeimg";

      });
    }

    var array2: any = taskDetails["AssignedTo"] != undefined ? taskDetails["AssignedTo"] : []
    if (taskDetails["Team_x0020_Members"] != undefined) {
      taskDetails.array = array2.concat(taskDetails["Team_x0020_Members"]?.filter((item: any) => array2?.Id != item?.Id))

    }
    var OffshoreComments: any = [];
    if (taskDetails["OffshoreComments"] != null) {
      let myarray:any=[]
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
    let tempTask = {
      SiteIcon: this.GetSiteIcon(this.state?.listName),
      sitePage: this.props.Context?._pageContext?._web?.title,
      Comments: comment != null && comment != undefined ? comment : "",
      Id: taskDetails["ID"],
      ID: taskDetails["ID"],
      Project:taskDetails["Project"],
      IsTodaysTask:taskDetails["IsTodaysTask"],
      EstimatedTime:taskDetails["EstimatedTime"],
      ClientTime: taskDetails["ClientTime"] != null && JSON.parse(taskDetails["ClientTime"]),
      ApproverHistory:taskDetails["ApproverHistory"]!=null?JSON.parse(taskDetails["ApproverHistory"]):"",
      OffshoreComments: OffshoreComments.length > 0 ? OffshoreComments.reverse() : null,
      OffshoreImageUrl: taskDetails["OffshoreImageUrl"] != null && JSON.parse(taskDetails["OffshoreImageUrl"]),
      AssignedTo: taskDetails["AssignedTo"] != null ? this.GetUserObjectFromCollection(taskDetails["AssignedTo"]) : null,
      ClientCategory: taskDetails["ClientCategory"],
      siteType: taskDetails["siteType"],
      listName: taskDetails["listName"],
      siteUrl: taskDetails["siteUrl"],
      TaskId: taskDetails["TaskId"],
      Title: taskDetails["Title"],
      DueDate: taskDetails["DueDate"],
      Categories: taskDetails["Categories"],
      Status: taskDetails["Status"],
      StartDate: taskDetails["StartDate"] != null ? moment(taskDetails["StartDate"]).format("DD/MM/YYYY") : "",
      CompletedDate: taskDetails["CompletedDate"] != null ? moment(taskDetails["CompletedDate"])?.format("DD/MM/YYYY") : "",
      TeamLeader: taskDetails["Responsible_x0020_Team"] != null ? this.GetUserObjectFromCollection(taskDetails["Responsible_x0020_Team"]) : null,
      TeamMembers: taskDetails.array != null ? this.GetUserObjectFromCollection(taskDetails.array) : null,
      ItemRank: taskDetails["ItemRank"],
      PercentComplete: (taskDetails["PercentComplete"] * 100),
      Priority: taskDetails["Priority"],
      Created: taskDetails["Created"],
      Author: this.GetUserObject(taskDetails["Author"]?.Title),
      component_url: taskDetails["component_x0020_link"],
      BasicImageInfo: this.GetAllImages(JSON.parse(taskDetails["BasicImageInfo"]), taskDetails["AttachmentFiles"], taskDetails["Attachments"]),
      FeedBack: JSON.parse(taskDetails["FeedBack"]),
      SharewebTaskType: taskDetails["SharewebTaskType"] != null ? taskDetails["SharewebTaskType"]?.Title : '',

      Component: taskDetails["Component"],
      Services: taskDetails["Services"],
      Creation: taskDetails["Created"],
      Modified: taskDetails["Modified"],
      ModifiedBy: taskDetails["Editor"],
      listId: listInfo.Id,
      SharewebTaskLevel1No: taskDetails["SharewebTaskLevel1No"],
      SharewebTaskLevel2No:taskDetails['SharewebTaskLevel2No'],
      Attachments: taskDetails["Attachments"],
      AttachmentFiles: taskDetails["AttachmentFiles"],
      SmartInformationId: taskDetails["SmartInformation"],
      Approver: taskDetails.Approver != undefined ? taskDetails.Approver[0] : "",
      ParentTask: taskDetails?.ParentTask,
    };

    console.log(tempTask);

    this.setState({
      Result: tempTask,


    }, () => {
      // this.showhideapproval();
      this.getSmartTime();
      this.loadOtherDetailsForComponents(this.taskResult);

    });
  }

  private sortAlphaNumericAscending = (a: any, b: any) => a.FileName.localeCompare(b.FileName, 'en', { numeric: true });

  private GetAllImages(BasicImageInfo: any, AttachmentFiles: any, Attachments: any) {
    let ImagesInfo: any = [];

    if (Attachments) {

      AttachmentFiles?.map((items: any) => {
        var regex = items?.FileName?.substring(0, 20);
        items.newFileName = regex;
      })
      AttachmentFiles?.sort(this.sortAlphaNumericAscending)

      AttachmentFiles?.forEach(function (Attach: any) {
        let attachdata: any = [];
        if (BasicImageInfo != null || BasicImageInfo != undefined) {
          attachdata = BasicImageInfo?.filter(function (ingInfo: any, i: any) {
            return ingInfo.ImageName == Attach?.FileName
          });
        }
        if (attachdata.length > 0) {
          BasicImageInfo?.forEach(function (item: any) {
            // if(item.ImageUrl!=undefined && item.ImageUrl.toLowerCase().indexOf('https://www.hochhuth-consulting.de/') > -1) {
            //   var imgurl = item.AuthorImage.split('https://www.hochhuth-consulting.de/')[1];
            //     item.ImageUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/' + imgurl;
            // }
            if (item?.ImageName == Attach?.FileName) {
              ImagesInfo.push({
                ImageName: Attach?.FileName,
                ImageUrl: Attach?.ServerRelativeUrl,
                UploadeDate: item?.UploadeDate,
                UserImage: item?.UserImage,
                UserName: item?.UserName,
                Description:item?.Description
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
    else {
      ImagesInfo = BasicImageInfo
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

    // console.log(this.taskUsers);

  }

  private async GetSmartMetaData(ClientCategory: any, ClientTime: any) {
    let array2: any = [];
    ClientTimeArray=[]
    if (((ClientTime == null ||ClientTime=="false") && ClientTimeArray?.length == 0)) {
      var siteComp: any = {};
      siteComp.SiteName = this.state?.listName,
        siteComp.ClienTimeDescription = 100,
        siteComp.SiteIcon = this.state?.listName
      ClientTimeArray.push(siteComp);
    }

    else if (ClientTime != null &&ClientTime!="false" ) {
      ClientTimeArray = JSON.parse(ClientTime);
      //  console.log(ClientTimeArray);
    }
    let web = new Web(this.props?.siteUrl);
    var smartMetaData = await web.lists
      // .getByTitle('SmartMetadata')
      .getById(this.props.SmartMetadataListID)
      .items
      .select('Id', 'Title', 'IsVisible', 'TaxType', 'Parent/Id', 'Parent/Title', 'siteName', 'siteUrl', 'SmartSuggestions', "SmartFilters",)

      .expand('Parent').filter("TaxType eq 'Client Category'").top(4000)
      .get();
    // console.log(smartMetaData);
    if(ClientCategory.length>0){
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
 
    if (ClientTimeArray != undefined && ClientTimeArray.length>0) {
      ClientTimeArray?.map((item: any) => {
        array2?.map((items: any) => {
          if (item?.SiteName == items?.SiteName) {
            if(item.ClientCategory==undefined){
              item.ClientCategory=[];
              item.ClientCategory.push(items);
            }else{
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
      else{
       this.smartMetaDataIcon?.map((icondata:any)=>{
          if(icondata.Title!=undefined){
            if(icondata.Title.toLowerCase()==listName?.toLowerCase()&&icondata.Item_x0020_Cover!=undefined){
              siteicon=icondata.Item_x0020_Cover.Url
            }
            if(icondata.Title.toLowerCase()==listName?.toLowerCase()&&icondata.Item_x005F_x0020_Cover!=undefined){
              siteicon=icondata.Item_x005F_x0020_Cover.Url
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
    //username = username.Title != undefined ? username.Title : username;
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

  private CallBack() {
    // ClientTimeArray=[];
    this.setState({
      isOpenEditPopup: false,
      countfeedback: this.state.countfeedback+1,
      EditSiteCompositionStatus: false
    })
    this.GetResult();
  }
  // private showhideapproval() {

  //   if (this.state.Result?.FeedBack != null || this.state.Result?.FeedBack != undefined) {
  //     let isShowLight = 0;
  //     let NotisShowLight = 0
  //     this.state.Result?.FeedBack?.map((item: any) => {
  //       if (item?.FeedBackDescriptions != undefined) {
  //         item?.FeedBackDescriptions?.map((feedback: any) => {
  //           if (feedback != null && feedback != undefined) {
  //             if (feedback?.Subtext != undefined && feedback?.Subtext.length > 0) {
  //               feedback?.Subtext?.map((subtextitem: any) => {
  //                 if (subtextitem?.isShowLight != "" && subtextitem?.isShowLight != undefined) {
  //                   // count=1
  //                   isShowLight = isShowLight + 1;

  //                 }
  //               })
  //             }
  //             if (isShowLight == 0) {
  //               if (feedback?.isShowLight != "" && feedback?.isShowLight != undefined) {
  //                 // count=1
  //                 isShowLight = isShowLight + 1;
  //               }
  //             }
  //           }
  //         })
  //       }
  //     })
  //     if (isShowLight > NotisShowLight) {
  //       this.countemailbutton = 1;
  //     }
  //   }
  // }
  private async approvalcallback() {
    this.setState({
      sendMail: false,
      emailStatus: ""
    })
    this.GetResult();
  }
  // private async approvalcallbackfeedback() {
  //   // this.showhideapproval();

  //   this.setState({
  //     sendMail: false,
  //     emailStatus: ""
  //   })
  // }
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
    let web = new Web(this.props.siteUrl);
    let results = [];
    results = await web.lists
      .getByTitle(this.site)
      // .getById(this.props.SiteTaskListID)
      .items
      .select('Shareweb_x0020_ID', 'SharewebTaskType/Id', "AssignedTo/Id", "AssignedTo/Title", 'SharewebTaskType/Title', 'Team_x0020_Members/Id', 'Team_x0020_Members/Title', 'Team_x0020_Members/Name', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id', 'AttachmentFiles/FileName', 'Component/Id', 'Component/Title', 'Component/ItemType', 'Services/Id', 'Services/Title', 'Services/ItemType', 'OffshoreComments', 'Portfolio_x0020_Type', 'Categories', 'FeedBack', 'component_x0020_link', 'FileLeafRef', 'Title', 'Id', 'Comments', 'CompletedDate', 'StartDate', 'DueDate', 'Status', 'Body', 'Company', 'Mileage', 'PercentComplete', 'FeedBack', 'Attachments', 'Priority', 'Created', 'Modified', 'BasicImageInfo', 'SharewebCategories/Id', 'SharewebCategories/Title', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title', 'Events/Id', 'Events/Title', 'Events/ItemType', 'SharewebTaskLevel1No', 'SharewebTaskLevel2No', 'ParentTask/Id', 'ParentTask/Title', 'Responsible_x0020_Team/Id', 'Responsible_x0020_Team/Title', 'Responsible_x0020_Team/Name')
      .filter("(SharewebTaskType/Title eq 'Activities') or (SharewebTaskType/Title eq 'Workstream') or (SharewebTaskType/Title eq 'Task') or (SharewebTaskType/Title eq 'Project') or (SharewebTaskType/Title eq 'Step') or (SharewebTaskType/Title eq 'MileStone')")
      .expand('Responsible_x0020_Team', "AssignedTo", 'ParentTask', 'AssignedTo', 'Component', 'Services', 'Events', 'AttachmentFiles', 'Author', 'Team_x0020_Members', 'Editor', 'SharewebCategories', 'SharewebTaskType')
      .getAll(4000);

    for (let index = 0; index < results.length; index++) {
      let item = results[index];
      item.siteType = this.site;
      item.isLastNode = false;
      this.allDataOfTask.push(item);
    }
  }

  private breadcrumb() {
    let breadcrumbitem: any = {};
    let flag = false;
    let gAllDataMatches = this.gAllDataMatches;
    let self = this;
    if (this.taskResult != undefined && this.taskResult?.Component != undefined && this.taskResult?.Component?.length > 0) {
      this.taskResult?.Component?.forEach(function (item: any) {
        flag = false;
        gAllDataMatches?.forEach(function (value: any) {
          if (item?.Id == value?.Id) {

            if (value?.Parent != undefined && value?.Parent?.Id != undefined) {
              gAllDataMatches.forEach(function (component: any) {
                if (component?.Id == value?.Parent?.Id) {
                  if (value?.Item_x0020_Type == "SubComponent") {
                    flag = true;
                    breadcrumbitem.Parentitem = component;
                    breadcrumbitem.Child = item;
                  } else {
                    gAllDataMatches?.forEach(function (subchild: any) {
                      if (component?.Parent?.Id == subchild?.Id) {
                        flag = true;
                        breadcrumbitem.Parentitem = subchild;
                        breadcrumbitem.Child = component;
                        breadcrumbitem.Subchild = item;
                      } else if (component?.Parent?.Id == undefined && self.taskResult?.Component[0]?.ItemType == "Feature") {
                        flag = true
                        breadcrumbitem.Parentitem = subchild;
                        breadcrumbitem.Child = undefined;
                        breadcrumbitem.Subchild = item;
                      }
                    })
                  }
                }
              })
            } else if (value.Parent == undefined) {
              if (value?.Item_x0020_Type == 'Component') {
                flag = true;
                breadcrumbitem.Parentitem = value;
              }
            }
          }
        })
        if (flag) {
          self.breadcrumbOtherHierarchy(breadcrumbitem);
        }
        breadcrumbitem = {};
      })

    }
    if (this.taskResult != undefined && this.taskResult?.Services != undefined && this.taskResult?.Services?.length > 0) {
      this.taskResult?.Services?.forEach(function (item: any) {
        flag = false;
        gAllDataMatches?.forEach(function (value: any) {

          if (item?.Id == value?.Id) {

            if (value?.Parent != undefined && value?.Parent?.Id != undefined) {
              gAllDataMatches?.forEach(function (component: any) {
                if (component?.Id == value?.Parent?.Id) {
                  flag = true;
                  if (value?.Item_x0020_Type == "SubComponent") {
                    breadcrumbitem.Parentitem = component;
                    breadcrumbitem.Child = item;
                  } else {
                    gAllDataMatches?.forEach(function (subchild: any) {
                      if (component?.Parent != undefined) {
                        if (component?.Parent?.Id == subchild?.Id) {
                          flag = true;
                          breadcrumbitem.Parentitem = subchild;
                          breadcrumbitem.Child = component;
                          breadcrumbitem.Subchild = item;
                        }
                      }
                      else if (component?.Parent?.Id == undefined && self.taskResult?.Services[0]?.ItemType == "Feature") {
                        flag = true
                        breadcrumbitem.Parentitem = subchild;

                        breadcrumbitem.Subchild = item;
                      }
                    })
                  }
                }
              })
            } else if (value.Parent == undefined) {
              if (value?.Item_x0020_Type == 'Component') {
                flag = true;
                breadcrumbitem.Parentitem = value;
              }
            }
          }
        })
        if (flag) {
          self.breadcrumbOtherHierarchy(breadcrumbitem);
        }
        breadcrumbitem = {};
      })
    }
    if (this.taskResult != undefined && this.taskResult?.Events != undefined && this.taskResult?.Events?.length > 0) {
      this.taskResult?.Events?.forEach(function (item: any) {
        flag = false;
        gAllDataMatches?.forEach(function (value: any) {

          if (item?.Id == value?.Id) {

            if (value?.Parent?.Id != undefined) {
              gAllDataMatches.forEach(function (component: any) {
                if (component?.Id == value?.Parent?.Id) {
                  if (value?.Item_x0020_Type == "SubComponent") {
                    flag = true;
                    breadcrumbitem.Parentitem = component;
                    breadcrumbitem.Child = item;
                  } else {
                    gAllDataMatches?.forEach(function (subchild: any) {
                      if (component?.Parent?.Id == subchild?.Id) {
                        flag = true;
                        breadcrumbitem.Parentitem = subchild;
                        breadcrumbitem.Child = component;
                        breadcrumbitem.Subchild = item;
                      }
                    })
                  }
                }
              })
            } else if (value.Parent.Id == undefined) {
              if (value.Item_x0020_Type == 'Component') {
                flag = true;
                breadcrumbitem.Parentitem = value;
              }
            }
          }
        })
        if (flag) {
          self.breadcrumbOtherHierarchy(breadcrumbitem);
        }
        breadcrumbitem = {};
      })
    }
    if (this.taskResult.Component.length == 0 && this.taskResult.Services.length == 0 && this.taskResult != undefined && this.taskResult.Events == undefined) {
      self.breadcrumbOtherHierarchy(breadcrumbitem);
      breadcrumbitem = {};
    }
  }

  private breadcrumbOtherHierarchy(breadcrumbitem: any) {
    let self = this;
    this.allDataOfTask?.forEach(function (value: any) {
      if (self.taskResult?.SharewebTaskType != undefined) {
        if (self.taskResult?.SharewebTaskType?.Title == 'Activities' || self.taskResult?.SharewebTaskType?.Title == 'Project') {
          if (self.taskResult?.ParentTask == undefined) {
            if (value?.Id == self.taskResult?.Id) {
              value.isLastNode = true;
              breadcrumbitem.ParentTask = value;
            }
          }

        } else if (self.taskResult?.SharewebTaskType?.Title == 'Workstream' || self.taskResult?.SharewebTaskType?.Title == 'Step') {
          if (self.taskResult?.ParentTask?.Id != undefined) {
            if (self.taskResult?.ParentTask?.Id == value?.Id) {
              self.taskResult.isLastNode = true;
              breadcrumbitem.ParentTask = value;
              breadcrumbitem.ChildTask = self.taskResult;
            }
          }
        } else if (self.taskResult?.SharewebTaskType?.Title == 'Task' || self.taskResult?.SharewebTaskType?.Title == 'MileStone') {
          if (self.taskResult?.ParentTask != undefined && self.taskResult?.ParentTask?.Id != undefined) {
            if (self.taskResult?.ParentTask?.Id == value?.Id && (value?.SharewebTaskType?.Title == 'Activities' || value?.SharewebTaskType?.Title == 'Project')) {
              self.taskResult.isLastNode = true;
              breadcrumbitem.ParentTask = value;
              breadcrumbitem.ChildTask = self.taskResult;
            }
            if (self.taskResult?.ParentTask?.Id == value?.Id && (value?.SharewebTaskType?.Title == 'Workstream' || value?.SharewebTaskType?.Title == 'Step')) {
              self.taskResult.isLastNode = true;
              breadcrumbitem.ChildTask = value;
              breadcrumbitem.SubChildTask = self.taskResult;

            }
            if (breadcrumbitem?.ChildTask != undefined) {
              self.allDataOfTask?.forEach(function (values: any) {
                if (breadcrumbitem?.ChildTask?.ParentTask?.Id == values?.Id && (breadcrumbitem?.ChildTask?.SharewebTaskType?.Title == 'Workstream' || breadcrumbitem?.ChildTask?.SharewebTaskType?.Title == 'Step')) {
                  breadcrumbitem.ParentTask = values;
                }
              });
            }
          } else {
            self.taskResult.isLastNode = true;
            breadcrumbitem.ParentTask = self?.taskResult;
          }
        }
      }
    })
    if (this.taskResult.SharewebTaskType == undefined) {
      this.taskResult.isLastNode = true;
      breadcrumbitem.ParentTask = this.taskResult;
    }
    if (breadcrumbitem != undefined) {
      if (breadcrumbitem?.ParentTask != undefined && breadcrumbitem?.ParentTask?.Shareweb_x0020_ID != undefined && breadcrumbitem?.ChildTask == undefined && breadcrumbitem?.SubChildTask == undefined) {

        TaskIdAW = (breadcrumbitem?.ParentTask?.Shareweb_x0020_ID).replace("-", ">")
      }
      if (breadcrumbitem.ChildTask != undefined && breadcrumbitem.SubChildTask == undefined) {
        if (breadcrumbitem.ChildTask.Shareweb_x0020_ID != undefined) {
          if (TaskIdAW != "" || TaskIdAW == "") {
            TaskIdAW = TaskIdAW + ">" + breadcrumbitem?.ChildTask?.Shareweb_x0020_ID;
          }
        }
        else if (breadcrumbitem?.ChildTask != undefined && breadcrumbitem?.ChildTask?.TaskId != undefined && breadcrumbitem?.SubChildTask == undefined) {
          TaskIdAW = (breadcrumbitem?.ChildTask?.TaskId).replace("-", ">")
        }
      }
      else if (breadcrumbitem?.SubChildTask != undefined && breadcrumbitem?.SubChildTask?.TaskId != undefined) {
        TaskIdAW = (breadcrumbitem?.SubChildTask?.TaskId).replace("-", ">")
      }
    }
    this.maincollection.push(breadcrumbitem);
    breadcrumbitem = {};

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

    console.log(item);
    this.setState({
      sendMail: true,
    });
    this.setState({
      emailStatus: item,
    });

  }




  public render(): React.ReactElement<ITaskprofileProps> {
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
      <div className={this.state.Result["Services"] != undefined && this.state.Result["Services"].length > 0 ? 'app component serviepannelgreena' : "app component"}>
        {this.state.maincollection != null && this.state.maincollection.length > 0 &&
          <div className='row'>
            <div className="col-sm-12 p-0 ">
              <ul className="spfxbreadcrumb m-0 p-0">
                {this.state.maincollection?.map((breadcrumbitem: any) => {
                  return <>
                    {(this.state.Result["Component"] != null && this.state.Result["Component"].length > 0) || (this.state.Result["Services"] != null && this.state.Result["Services"].length > 0) ?
                      <li >
                        {this.state.Result["Component"] != null && this.state.Result["Component"].length > 0 &&
                          <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Component-Portfolio.aspx`}>Component Portfolio</a>
                        }
                        {this.state.Result["Services"] != null && this.state.Result["Services"].length > 0 &&
                          <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Service-Portfolio.aspx`}>Service Portfolio</a>
                        }
                      </li> : null
                    }
                    {breadcrumbitem.Subchild == undefined && breadcrumbitem.Child == undefined && this.state.Result["Services"].length == 0 &&
                      this.state.Result["Component"].length == 0 && breadcrumbitem.ParentTask != undefined &&
                      <li  >
                        <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Dashboard.aspx`}> <span>Dashboard</span> </a>
                      </li>
                    }
                    {breadcrumbitem.Parentitem != undefined &&
                      <li>

                        <a target="_blank" data-interception="off"  href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${breadcrumbitem?.Parentitem?.Id}`}>{breadcrumbitem?.Parentitem?.Title}</a>
                      </li>
                    }
                    {breadcrumbitem.Child != undefined &&
                      <li>

                        <a target="_blank" data-interception="off"  href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${breadcrumbitem?.Child?.Id}`}>{breadcrumbitem?.Child?.Title}</a>
                      </li>
                    }
                    {breadcrumbitem.Subchild != undefined &&
                      <li >

                        <a target="_blank" data-interception="off"  href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${breadcrumbitem.Subchild.Id}`}>{breadcrumbitem?.Subchild?.Title}</a>
                      </li>
                    }
                    {breadcrumbitem.ParentTask != undefined && breadcrumbitem.ParentTask.Shareweb_x0020_ID != undefined && this.state.Result["ParentTask"] != undefined &&
                      <li  >

                        <a target="_blank" data-interception="off"  href={`${this.state.Result["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${breadcrumbitem.ParentTask.Id}&Site=${breadcrumbitem?.ParentTask?.siteType}`}>{breadcrumbitem?.ParentTask?.Title}</a>
                      </li>
                    }
                    {/* {breadcrumbitem.ChildTask != undefined &&
                      <li >

                        <a target="_blank" data-interception="off"  href={`${this.state.Result["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${breadcrumbitem.ChildTask.Id}&Site=${breadcrumbitem?.ChildTask?.siteType}`}>{breadcrumbitem?.ChildTask?.Title}</a>
                      </li>
                    } */}

                    {breadcrumbitem.ParentTask != undefined  && 
                      <li>
                        <a >
                          <span>{this.state.Result['Title']}</span>
                        </a>
                      </li>
                    }
                  </>
                })

                }
              </ul>
            </div>
          </div>

        }

        <section className='row p-0'>
          <h2 className="heading d-flex ps-0 justify-content-between align-items-center mainheading">
            <span>
              {this.state.Result["SiteIcon"] != "" && <img className="imgWid29 pe-1 " title={this?.state?.Result?.siteType} src={this.state.Result["SiteIcon"]} />}
              {this.state.Result["SiteIcon"] === "" && <img className="imgWid29 pe-1 " src="" />}
              {this.state.Result['Title']}

              <a className="hreflink ms-1 " title='Edit' onClick={() => this.OpenEditPopUp()}>
                 <span className ="svg__iconbox svg__icon--edit"></span>
                
                {/* <img style={{ width: '16px', height: '16px', borderRadius: '0' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" /> */}
              </a>
              {this.state.Result["Approver"] != undefined && this.state.Result["Categories"].includes("Approval") && this.currentUser != undefined && this.currentUser.length > 0 && this.state.Result.Approver.Id == this.currentUser[0].Id && this.state.Result["Status"]== "For Approval"&&
               this.state.Result["PercentComplete"]==1 && <span><button onClick={() => this.sendEmail("Approved")} className="btn btn-success ms-3 mx-2">Approve</button><span><button className="btn btn-danger" onClick={() => this.sendEmail("Rejected")}>Reject</button></span></span>
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
                      {TaskIdCSF != "" && <span className="idhide bg-fxdark siteColor">{TaskIdCSF?.replace("-", ">")}{TaskIdAW == "" && this.state.Result["TaskId"] != undefined && <span className='text-body'>{">" + this.state.Result["TaskId"]}</span>} {TaskIdAW != "" && <span className='text-body'>{">" + TaskIdAW.replace("-", ">")}</span>}</span>}

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
                    <dt className='bg-Fa'>Estimated Time</dt>
                    <dd className='bg-Ff position-relative' ><span className='tooltipbox' title="hours">{this.state.Result["EstimatedTime"]!=undefined?this.state.Result["EstimatedTime"].toFixed(1):"0.0"} </span>
                     </dd>
                   </dl>
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
                            {this.state.Result["TeamMembers"][0].userImage == null && <span className={`workmember ${this.state.Result["TeamMembers"][0].activeimg2}bg-fxdark border bg-e9 p-1 `} >{this.state.Result["TeamMembers"][0]?.Suffix}</span>}
                          </a>
                          </div>
                        }

                        {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length == 2 && <div className="img mx-2"><a href={`${this.state.Result["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${this.state.Result["TeamMembers"][1]?.Id}&Name=${this.state.Result["TeamMembers"][1]?.Title}`} target="_blank" data-interception="off" title={this.state.Result["TeamMembers"][1]?.Title}>
                          {this.state.Result["TeamMembers"][1]?.userImage != null && <img className={`workmember ${this.state.Result["TeamMembers"][1]?.activeimg2}`} src={this.state.Result["TeamMembers"][1]?.userImage}></img>}
                          {this.state.Result["TeamMembers"][1]?.userImage == null && <span className={`workmember ${this.state.Result["TeamMembers"][1]?.activeimg2}bg-fxdark border bg-e9 p-1`} >{this.state.Result["TeamMembers"][1]?.Suffix}</span>}
                        </a>
                        </div>
                        }
                        {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 2 &&
                          <div className="position-relative user_Member_img_suffix2" onMouseOver={(e) => this.handleSuffixHover()} onMouseLeave={(e) => this.handleuffixLeave()}>+{this.state.Result["TeamMembers"].length - 1}
                            <span className="tooltiptext" style={{ display: this.state.Display, padding: '10px' }}>
                              <div>
                                {this.state.Result["TeamMembers"].slice(1)?.map((rcData: any, i: any) => {

                                  return <div className=" mb-1 team_Members_Item" style={{ padding: '2px' }}>
                                    <a href={`${this.state.Result["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`} target="_blank" data-interception="off">

                                      {rcData?.userImage != null && <img className={`workmember ${rcData?.activeimg2}`} src={rcData?.userImage}></img>}
                                      {rcData?.userImage == null && <span className={`workmember ${rcData?.activeimg2}bg-fxdark border bg-e9 p-1`}>{rcData?.Suffix}</span>}
                                     
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
                    {this.state.Result["ApproverHistory"]!=undefined && this.state.Result["ApproverHistory"].length>1 && this.state.Result["Categories"].includes("Approval")?
                    <span style={{fontSize:"smaller"}}>Pre-Approved by
                    <img className="workmember"  title={this.state.Result["ApproverHistory"][this.state.Result.ApproverHistory.length-2]?.ApproverName} src={(this.state.Result?.ApproverHistory[this.state.Result?.ApproverHistory?.length-2]?.ApproverImage!=null)?(this.state.Result.ApproverHistory[this.state.Result.ApproverHistory.length-2]?.ApproverImage):(this.state.Result?.ApproverHistory[this.state.Result.ApproverHistory.length-2]?.ApproverSuffix)}></img></span>
                    // {this.state.Result["ApproverHistory"][this.state.Result.ApproverHistory.length-1].Title}
                    :null}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-Fa'>Working Today</dt>
                    <dd className='bg-Ff position-relative' ><span className='tooltipbox'>{this.state.Result["IsTodaysTask"]?"Yes":"No"} </span>
                     </dd>
                   </dl>
                  <dl>
                    <dt className='bg-Fa'>Item Rank</dt>
                    <dd className='bg-Ff'>{this.state.Result["ItemRank"]}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-Fa'>% Complete</dt>
                    <dd className='bg-Ff'>{this.state.Result["PercentComplete"]!=undefined?this.state.Result["PercentComplete"].toFixed(0):0}</dd>
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
                      {this.state.Result["Component"] != null && this.state.Result["Component"].length > 0 && this.state.Result["Component"]?.map((componentdt: any, i: any) => {
                        return (
                          <a className="hreflink" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${componentdt.Id}`}>{componentdt.Title}</a>

                        )
                      })}
                      {this.state.Result["Services"] != null && this.state.Result["Services"].length > 0 && this.state.Result["Services"]?.map((Servicesdt: any, i: any) => {
                        return (
                          <a className="hreflink" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${Servicesdt.Id}`}>{Servicesdt.Title}</a>

                        )
                      })}

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
                          <span onClick={() => this.showhideComposition()}>{this.state.showComposition ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>
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
                                {cltime.ClientCategory != undefined && cltime.ClientCategory.length>0 ?cltime.ClientCategory?.map((clientcat:any)=>{
                                return(
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



                </div>
              </div>
              <div className='row'>
                <div className="d-flex p-0">
                  <div className='bg-Fa p-2'><label>Url</label></div>
                  <div className='bg-Ff border p-2 text-break full-width'>
                    {this.state.Result["component_url"] != null &&
                      <a target="_blank" data-interception="off" href={this.state.Result["component_url"].Url}>{this.state.Result["component_url"].Url}</a>
                    }
                  </div>

                </div>
              </div>
              <section>
                <div className="col">
                  <div className="Taskaddcomment row">
                    {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].length > 0 &&
                      <div className="col-sm-4 bg-white col-sm-4 pt-3 p-0">
                        {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"]?.map((imgData: any, i: any) => {
                          return <div className="taskimage  mb-3">
                            {/*  <BannerImageCard imgData={imgData}></BannerImageCard> */}

                            <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                              <img alt={imgData?.ImageName} src={imgData?.ImageUrl}
                                onMouseOver={(e) => this.OpenModal(e, imgData)}
                                onMouseOut={(e) => this.CloseModal(e)} ></img>
                            </a>


                            <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between ">
                              <div className='usericons'>
                                <span>
                                  <span >{imgData?.UploadeDate}</span>
                                  <span className='round px-1'>
                                    {imgData?.UserImage != null &&
                                      <img className='align-self-start' title={imgData?.UserName} src={imgData?.UserImage} />
                                    }
                                  </span>
                                 {imgData?.Description != undefined&& imgData?.Description!="" &&<span title={ imgData?.Description} className="mx-1" >
                                    <BiInfoCircle />

                                    </span>}

                                </span>
                              </div>
                              <div>
                               
                                <span >
                                  {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                </span>
                                <span>|</span>
                                <a className='images'  title="Expand Image"target="_blank" data-interception="off" href={imgData?.ImageUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>
                              </div>

                            </div>

                          </div>
                        })}
                      </div>
                    }
                    <div className={this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].length > 0 ? "col-sm-8 pe-0 mt-2" : "col-sm-12 pe-0 ps-0 mt-2"}>
                      {this.state.Result["SharewebTaskType"] != null && (this.state.Result["SharewebTaskType"] == '' ||
                        this.state.Result["SharewebTaskType"] == 'Task'|| this.state.Result["SharewebTaskType"]=="Workstream" || this.state.Result["SharewebTaskType"] == "Activities") && this.state.Result["FeedBack"] != undefined && this.state.Result["FeedBack"].length > 0 && this.state.Result["FeedBack"][0].FeedBackDescriptions != undefined &&
                        this.state.Result["FeedBack"][0].FeedBackDescriptions.length > 0 &&
                        this.state.Result["FeedBack"][0].FeedBackDescriptions[0].Title != ''&& this.state.countfeedback>=0 &&
                        <div className={"Addcomment " + "manage_gap"}>
                          {this.state.Result["FeedBack"][0]?.FeedBackDescriptions?.map((fbData: any, i: any) => {
                            let userdisplay: any = [];
                            userdisplay.push({ Title: this.props?.userDisplayName })
                            if (fbData != null && fbData != undefined) {

                              try {
                                if (fbData?.Title != undefined) {
                                  fbData.Title = fbData?.Title?.replace(/\n/g, '<br/>');
                                  
                                }
                              } catch (e) {
                              }
                              return (
                                <>
                              <TaskFeedbackCard feedback={...fbData} index={i + 1}
                                onPost={() => { this.onPost() }}
                                // approvalcallbacktask={() => { this.approvalcallbackfeedback() }}
                                fullfeedback={this.state.Result["FeedBack"]}
                                CurrentUser={this.currentUser != undefined && this.currentUser?.length > 0 ? this.currentUser : userdisplay}
                                ApprovalStatus={this.state.ApprovalStatus}
                                Approver={this.state.Result["Approver"]}
                                Result={this.state.Result}
                                Context={this.props?.Context}

                              >
                              </TaskFeedbackCard>

                              {console.log("You")}
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

                {this.backGroundComment ? <div className="col">
                  <div className="Taskaddcomment row">
                    {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"].length > 0 &&
                      <div className="col-sm-5 bg-white col-sm-5 pt-3 p-0">
                        {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"]?.map((imgData: any, i: any) => {
                          return <div className="taskimage border mb-3">
                            <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                              <img alt={imgData?.ImageName} src={imgData?.Url}
                                onMouseOver={(e) => this.OpenModal(e, imgData)}
                                onMouseOut={(e) => this.CloseModal(e)} ></img>
                            </a>


                            <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between ">
                              <div className='usericons'>
                                <span>
                                  <span >
                                    {imgData?.ImageName?.length > 15 ? imgData?.ImageName?.substring(0, 15) + '...' : imgData?.ImageName}
                                  </span>


                                </span>
                              </div>
                              <div>
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
                    {this.state.Result["OffshoreComments"] != null && this.state.Result["OffshoreComments"] != undefined && this.state.Result["OffshoreComments"].length > 0 && <div className="col-sm-7 pe-0 mt-2">
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
                </div> : null}

              </section>

            </div>
            <div className="col-3">
              <div>
                {this.state.Result != undefined && AllListId != undefined && <CommentCard siteUrl={this.props.siteUrl} AllListId={AllListId} Context={this.props.Context}></CommentCard>}
                {this.state.Result?.Id != undefined && AllListId != undefined && <>
                  <AncTool item={this?.state?.Result}  AllListId={AllListId} Context={this.props.Context}/>
                </>}
              </div>
              <div>{this.state.Result.Id && <SmartInformation Id={this.state.Result.Id} AllListId={AllListId} Context={this.props?.Context} taskTitle={this.state.Result?.Title} listName={this.state.Result?.listName} />}</div>
              <div> {this.state.Result != undefined && <RelevantDocuments siteUrl={this.props.siteUrl} DocumentsListID={this.props?.DocumentsListID} ID={this.state?.itemID} siteName={this.state.listName} folderName={this.state.Result['Title']} ></RelevantDocuments>}</div>

            </div>

          </div>
        </section>
        <section>
          <div className="row">
            {this.state.Result != undefined && this.state.Result.Id != undefined && this.state.Result.SharewebTaskType != "" && this.state.Result.SharewebTaskType != undefined && this.state.Result.SharewebTaskType != 'Task' ? <TasksTable props={this.state.Result}AllListId={AllListId} Context={this.props?.Context}  /> : ''}
          </div>
          <div className='row'>
            {/* {this.state.Result?.Portfolio_x0020_Type!=undefined &&<TaskWebparts props={this.state.Result}/>} */}
            {this.state.Result != undefined &&
              <div className="ItemInfo mb-20" style={{ paddingTop: '15px' }}>
                
                <div>Created <span >{(moment(this.state.Result['Creation']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{this.state.Result['Author'] != null && this.state.Result['Author'].length > 0 && this.state.Result['Author'][0].Title}</span>
                </div>
                <div>Last modified <span >{(moment(this.state.Result['Modified']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{this.state.Result['ModifiedBy'] != null && this.state.Result['ModifiedBy'].Title}</span>
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

        {this.state.isOpenEditPopup ? <EditTaskPopup Items={this.state.Result} context={this.props.Context} AllListId={AllListId} Call={() => { this.CallBack() }} /> : ''}
        {this.state.EditSiteCompositionStatus ? <EditSiteComposition EditData={this.state.Result} context={this.props.Context} AllListId={AllListId} Call={() => { this.CallBack() }} /> : ''}
        {/* {this.state.isTimeEntry ? <TimeEntry props={this.state.Result} isopen={this.state.isTimeEntry} CallBackTimesheet={() => { this.CallBackTimesheet() }} /> : ''} */}
 

      </div>
    );
  }
}

