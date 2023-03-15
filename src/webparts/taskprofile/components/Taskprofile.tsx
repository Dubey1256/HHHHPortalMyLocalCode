import * as React from 'react';
// import * as Moment from 'moment';
import * as moment from 'moment';
///import styles from './Taskprofile.module.scss';
import { ITaskprofileProps } from './ITaskprofileProps';
import TaskFeedbackCard from './TaskFeedbackCard';
// import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "sp-pnp-js";
// import { Modal } from 'office-ui-fabric-react';
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
// import  {GlobalConstants} from '../../../globalComponents/LocalCommon'
import * as globalCommon from '../../../globalComponents/globalCommon'
import TimeEntry from './TimeEntry';
import SmartTimeTotal from './SmartTimeTotal';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import RelevantDocuments from './RelevantDocuments';
import SmartInformation from './SmartInformation';
import VersionHistoryPopup from '../../../globalComponents/VersionHistroy/VersionHistory';
import { Sync } from '@material-ui/icons';
import TasksTable from './TaskfooterTable';
import EmailComponenet from './emailComponent';
// import { forEach } from 'lodash';
// import { Item } from '@pnp/sp/items';
// var smartTime: Number = 0                                   ;
var ClientTimeArray: any = [];

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
  showPopup: any;
  maincollection: any;
  SharewebTimeComponent: any;
  isopenversionHistory: boolean;
  smarttimefunction: boolean;
  ApprovalStatus: boolean;
}

export default class Taskprofile extends React.Component<ITaskprofileProps, ITaskprofileState> {
  private taskUsers: any = [];
  private smartMetaData: any = [];
  private currentUser: any;
  private oldTaskLink: any;
  private site: any;
  count: number = 0;
  backGroundComment = false;
  this: any;
  public constructor(props: ITaskprofileProps, state: ITaskprofileState) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    console.log(params.get('taskId'));
    console.log(params.get('Site'));
    this.site = params.get('Site');
    this.oldTaskLink = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-Old.aspx?taskId=" + params.get('taskId') + "&Site=" + params.get('Site');
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
      showPopup: 'none',
      maincollection: [],
      SharewebTimeComponent: [],
      smarttimefunction: false,
      ApprovalStatus: false,
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
      // console.log('Array for Breadcrumb');
      // console.log(this.maincollection);
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
      // console.log('Array for Breadcrumb');
      // console.log(this.maincollection);
      this.setState({
        maincollection: this.maincollection
      })
    }
    else if (task.Services.length == 0 && task.Component.length == 0) {
      await this.loadComponentsDataForTasks(task);
      await this.getAllTaskData();
      if (this.count == 0) {
        this.breadcrumb();
        this.count++;
      }
      // console.log('Array for Breadcrumb');
      // console.log(this.maincollection);
      this.setState({
        maincollection: this.maincollection
      })
    }
  }

  private async loadComponentsDataForTasks(Items: any) {
    let DataForQuery = [];
    if (Items.Component != undefined && Items.Component.length > 0) {
      DataForQuery = Items.Component;
    }
    if (Items.Services != undefined && Items.Services.length > 0) {
      DataForQuery = Items.Services;
    }

    if (DataForQuery.length > 0) {
      let query = 'filter=';
      DataForQuery.forEach(function (item: any) {
        query += "(Id eq '" + item.Id + "')or";
      });
      query = query.slice(0, query.length - 2);

      let web = new Web(this.props.siteUrl);
      let AllDataMatches = [];
      AllDataMatches = await web.lists
        .getByTitle("Master Tasks")
        .items
        .select('ComponentCategory/Id', 'Portfolio_x0020_Type', 'ComponentCategory/Title', 'Id', 'ValueAdded', 'Idea', 'Sitestagging', 'TechnicalExplanations', 'Short_x0020_Description_x0020_On', 'Short_x0020_Description_x0020__x', 'Short_x0020_description_x0020__x0', 'Admin_x0020_Notes', 'Background', 'Help_x0020_Information', 'Item_x0020_Type', 'Title', 'Parent/Id', 'Parent/Title')
        .expand('Parent', 'ComponentCategory')
        .filter(query.replace('filter=', ''))
        .orderBy('Modified', false)
        .getAll(4000);

      // console.log(AllDataMatches);
      this.gAllDataMatches = AllDataMatches;
      
      // console.log('All Component : ');
      // console.log(this.gAllDataMatches)
      if (AllDataMatches[0] != undefined && AllDataMatches[0].Item_x0020_Type != undefined && AllDataMatches[0].Item_x0020_Type == 'Component') {
        return AllDataMatches;
      }
      else {
        let query = 'filter=';
        AllDataMatches.forEach(function (item: any) {
          query += "(Id eq '" + item.Parent.Id + "')or";
        });
        query = query.slice(0, query.length - 2);

        await this.loadOtherComponentsData(query, AllDataMatches);

      }
    }
  }

  private async loadOtherComponentsData(query: any, AllDataMatches: any) {
    let web = new Web(this.props.siteUrl);
    let Data = await web.lists
      .getByTitle("Master Tasks")
      .items
      .select('ComponentCategory/Id', 'Portfolio_x0020_Type', 'ComponentCategory/Title', 'Id', 'ValueAdded', 'Idea', 'Sitestagging', 'TechnicalExplanations', 'Short_x0020_Description_x0020_On', 'Short_x0020_Description_x0020__x', 'Short_x0020_description_x0020__x0', 'Admin_x0020_Notes', 'Background', 'Help_x0020_Information', 'Item_x0020_Type', 'Title', 'Parent/Id', 'Parent/Title')
      .expand('Parent', 'ComponentCategory')
      .filter(query.replace('filter=', ''))
      .orderBy('Modified', false)
      .getAll(4000);

    Data.forEach(function (Item: any) {
    // Item['Shareweb_x0020_ID'] = globalCommon.getTaskId( Item)
      AllDataMatches.push(Item);
    });

    if (Data[0] != undefined && Data[0].Item_x0020_Type != undefined && Data[0].Item_x0020_Type == 'SubComponent') {
      let query = 'filter=';
      Data.forEach(function (item: any) {
        query += "(Id eq '" + item.Parent.Id + "')or";
      })
      query = query.slice(0, query.length - 2);
      await this.loadOtherComponentsData(query, AllDataMatches);
    }
    else {
      return AllDataMatches;
    }
  }

  private async GetResult() {
    let web = new Web(this.props.siteUrl);
    let taskDetails: any = [];
    let listInfo = await web.lists.getByTitle(this.state.listName).get();
    // console.log(listInfo);
    taskDetails = await web.lists
      .getByTitle(this.state.listName)
      .items
      .getById(this.state.itemID)
      .select("ID", "Title", "Comments", "DueDate", "Approver/Id", "Approver/Title","ParentTask/Id","ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "SharewebTaskLevel1No", "SharewebTaskLevel2No", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "SharewebCategories/Id", "SharewebCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
      .expand("Team_x0020_Members", "Approver","ParentTask", "SmartInformation", "AssignedTo", "SharewebCategories", "Author", "ClientCategory", "Responsible_x0020_Team", "SharewebTaskType", "Component", "Services", "Editor", "AttachmentFiles")
      .get()

    taskDetails["listName"] = this.state.listName;
    taskDetails["siteType"] = this.state.listName;
    taskDetails["siteUrl"] = this.props.siteUrl;
    // console.log(taskDetails);
    taskDetails.TaskId = globalCommon.getTaskId(taskDetails);
    var category = ""

    taskDetails["SharewebCategories"].map((item: any, index: any) => {
      category = category + item.Title + ";"
      let ApprovalCheck = category.search("Approval");
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

    if (taskDetails["AssignedTo"] != undefined) {
      taskDetails["AssignedTo"].map((item: any, index: any) => {
        if (taskDetails["Team_x0020_Members"] != undefined) {
          for (let i = 0; i < taskDetails["Team_x0020_Members"].length; i++) {
            if (item.Id == taskDetails["Team_x0020_Members"][i].Id) {
              taskDetails["Team_x0020_Members"].splice(i, true);
              i--;
            }
          }
        }

        item.workingMember = "activeimg";

      });
    }

    var array2: any = taskDetails["AssignedTo"] != undefined ? taskDetails["AssignedTo"] : []
    if (taskDetails["Team_x0020_Members"] != undefined) {
      taskDetails.array = array2.concat(taskDetails["Team_x0020_Members"].filter((item: any) => array2.Id != item.Id))
      // console.log(taskDetails.array);
    }
    var OffshoreComments: any = [];
    if (taskDetails["OffshoreComments"] != null) {
      OffshoreComments = JSON.parse(taskDetails["OffshoreComments"])
    }
    // console.log(taskDetails)
    // console.log(category);
    taskDetails["Categories"] = category;
    this.taskResult = taskDetails;
    await this.GetTaskUsers();
    await this.GetSmartMetaData(taskDetails.ClientCategory, taskDetails.ClientTime);

    this.currentUser = this.GetUserObject(this.props.userDisplayName);

    let tempTask = {
      SiteIcon: this.GetSiteIcon(this.state.listName),
      sitePage: this.props.Context?._pageContext?._web?.title,
      Comments: taskDetails["Comments"] != null ? JSON.parse(taskDetails["Comments"]) : "",
      Id: taskDetails["ID"],
      ID: taskDetails["ID"],
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
      CompletedDate: taskDetails["CompletedDate"] != null ? moment(taskDetails["CompletedDate"]).format("DD/MM/YYYY") : "",
      TeamLeader: taskDetails["Responsible_x0020_Team"] != null ? this.GetUserObjectFromCollection(taskDetails["Responsible_x0020_Team"]) : null,
      TeamMembers: taskDetails.array != null ? this.GetUserObjectFromCollection(taskDetails.array) : null,
      ItemRank: taskDetails["ItemRank"],
      PercentComplete: (taskDetails["PercentComplete"] * 100),
      Priority: taskDetails["Priority"],
      Created: taskDetails["Created"] != null ? (new Date(taskDetails["Created"])).toLocaleDateString() : '',
      Author: this.GetUserObject(taskDetails["Author"].Title),
      component_url: taskDetails["component_x0020_link"],
      //BasicImageInfo: JSON.parse(taskDetails["BasicImageInfo"]),
      BasicImageInfo: this.GetAllImages(JSON.parse(taskDetails["BasicImageInfo"]), taskDetails["AttachmentFiles"], taskDetails["Attachments"]),
      FeedBack: JSON.parse(taskDetails["FeedBack"]),
      SharewebTaskType: taskDetails["SharewebTaskType"] != null ? taskDetails["SharewebTaskType"].Title : '',
      ClientTime: taskDetails["ClientTime"] != null && JSON.parse(taskDetails["ClientTime"]),
      Component: taskDetails["Component"],
      Services: taskDetails["Services"],
      Creation: taskDetails["Created"],
      Modified: taskDetails["Modified"],
      ModifiedBy: taskDetails["Editor"],
      listId: listInfo.Id,
      Attachments: taskDetails["Attachments"],
      AttachmentFiles: taskDetails["AttachmentFiles"],
      SmartInformationId: taskDetails["SmartInformation"],
      Approver: taskDetails.Approver != undefined ? taskDetails.Approver[0] : "",
      ParentTask:taskDetails?.ParentTask,
    };

    // console.log(tempTask);

    this.setState({
      Result: tempTask
    }, () => {
      this.getSmartTime();
      this.loadOtherDetailsForComponents(this.taskResult);

    });
  }
  //  private shortBackgroundComment=(a:any,b:any)=>a.Created-b.Created;
  private sortAlphaNumericAscending = (a: any, b: any) => a.FileName.localeCompare(b.FileName, 'en', { numeric: true });

  private GetAllImages(BasicImageInfo: any, AttachmentFiles: any, Attachments: any) {
    let ImagesInfo: any = [];

    if (Attachments) {
      AttachmentFiles.map((items: any) => {
        var regex = items.FileName.substring(0, 20);
        items.newFileName = regex;
      })
      AttachmentFiles.sort(this.sortAlphaNumericAscending)

      AttachmentFiles.forEach(function (Attach: any) {
        let attachdata: any = [];
        if (BasicImageInfo != null || BasicImageInfo != undefined) {
          attachdata = BasicImageInfo.filter(function (ingInfo: any, i: any) {
            return ingInfo.ImageName == Attach.FileName
          });
        }
        if (attachdata.length > 0) {
          BasicImageInfo.forEach(function (item: any) {
            // if(item.ImageUrl!=undefined && item.ImageUrl.toLowerCase().indexOf('https://www.hochhuth-consulting.de/') > -1) {
            //   var imgurl = item.AuthorImage.split('https://www.hochhuth-consulting.de/')[1];
            //     item.ImageUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/' + imgurl;
            // }
            if (item.ImageName == Attach.FileName) {
              ImagesInfo.push({
                ImageName: Attach.FileName,
                ImageUrl: Attach.ServerRelativeUrl,
                UploadeDate: item.UploadeDate,
                UserImage: item.UserImage,
                UserName: item.UserName
              })
            }
          })
        }
        if (attachdata.length == 0) {
          ImagesInfo.push({
            ImageName: Attach.FileName,
            ImageUrl: Attach.ServerRelativeUrl,
            UploadeDate: '',
            UserImage: null,
            UserName: null
          })
        }


      });
      // ImagesInfo = ImagesInfo.concat(BasicImageInfo);
      ImagesInfo = ImagesInfo;

    }
    else {
      ImagesInfo = BasicImageInfo
    }
    return ImagesInfo;
  }

  private async GetTaskUsers() {
    let web = new Web(this.props.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      .getByTitle("Task Users")
      .items
      .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'Company', 'AssingedToUser/Title', 'AssingedToUser/Id',)
      .filter("ItemType eq 'User'")
      .expand('AssingedToUser')
      .get();
    taskUsers.map((item: any, index: any) => {
      if (this.props.Context?._pageContext?._user.loginName === item.Email && item.Company == "Smalsus") {
        this.backGroundComment = true;
      }
    })
    this.taskUsers = taskUsers;

    // console.log(this.taskUsers);

  }

  private async GetSmartMetaData(ClientCategory: any, ClientTime: any) {
    let array2: any = [];

    if ((ClientTime == null && ClientTimeArray.length == 0)) {
      var siteComp: any = {};
      siteComp.SiteName = this.state.listName,
        siteComp.ClienTimeDescription = 100,
        siteComp.SiteIcon = this.state.listName
      ClientTimeArray.push(siteComp);
    }

    else if (ClientTime != null) {
      ClientTimeArray = JSON.parse(ClientTime);
      //  console.log(ClientTimeArray);
    }




    let web = new Web(this.props.siteUrl);
    var smartMetaData = await web.lists
      .getByTitle('SmartMetadata')
      .items
      .select('Id', 'Title', 'IsVisible', 'TaxType', 'Parent/Id', 'Parent/Title', 'siteName', 'siteUrl', 'SmartSuggestions', "SmartFilters",)

      .expand('Parent').filter("TaxType eq 'Client Category'").top(4000)
      .get();
    // console.log(smartMetaData);
    ClientCategory.map((item: any, index: any) => {
      smartMetaData.map((items: any, index: any) => {
        if (item.Id == items.Id) {
          item.SiteName = items.siteName;
          array2.push(item)
        }
      })
    })
    if (ClientTimeArray != undefined && ClientTimeArray != null) {
      ClientTimeArray.map((item: any) => {
        array2.map((items: any) => {
          if (item.SiteName == items.SiteName) {
            item.ClientCategory = items.Title;
          }
        })
      })
    }




  }


  private GetSiteIcon(listName: string) {
    console.log(this.state.Result)
    if (listName != undefined) {
      let siteicon = '';
      if (listName.toLowerCase() == 'migration') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png';
      }
      if (listName.toLowerCase() == 'health') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_health.png';
      }
      if (listName.toLowerCase() == 'eps') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png';
      }
      if (listName.toLowerCase() == 'ei') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png';
      }
      if (listName.toLowerCase() == 'qa') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png';
      }
      if (listName.toLowerCase() == 'gender') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png';
      }
      if (listName.toLowerCase() == 'education') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png';
      }
      if (listName.toLowerCase() == 'development-effectiveness' || listName.toLowerCase() == 'de') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png';
      }
      if (listName.toLowerCase() == 'cep') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/icon_cep.png';
      }
      if (listName.toLowerCase() == 'alakdigital' || listName.toLowerCase() == 'da e+e') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_da.png';
      }
      if (listName.toLowerCase() == 'hhhh')
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png';

      if (listName.toLowerCase() == 'gruene')
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/logo-gruene.png';

      if (listName.toLowerCase() == 'shareweb')
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png';

      if (listName.toLowerCase() == 'small projects')
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/small_project.png';

      if (listName.toLowerCase() == 'offshore tasks')
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/offshore_Tasks.png';

      if (listName.toLowerCase() == 'kathabeck')
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png';
      if (listName.toLowerCase() == 'tasks' && this.props.Context._pageContext._web.title == "SH") {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SH/SiteCollectionImages/ICONS/Foundation/SH_icon.png';
      }
      return siteicon;
    }

  }

  private GetUserObjectFromCollection(UsersValues: any) {
    let userDeatails = [];
    for (let index = 0; index < UsersValues.length; index++) {
      let senderObject = this.taskUsers.filter(function (user: any, i: any) {
        if (user.AssingedToUser != undefined) {
          return user.AssingedToUser["Id"] == UsersValues[index].Id
        }
      });
      if (senderObject.length > 0) {
        userDeatails.push({
          'Id': senderObject[0].AssingedToUser.Id,
          'Name': senderObject[0].Email,
          'Suffix': senderObject[0].Suffix,
          'Title': senderObject[0].Title,
          'userImage': senderObject[0]?.Item_x0020_Cover?.Url,
          'activeimg2': UsersValues[index].workingMember ? UsersValues[index]?.workingMember : "",
        })
      }
    }
    return userDeatails;
  }

  private GetUserObject(username: any) {
    //username = username.Title != undefined ? username.Title : username;
    let userDeatails = [];
    let senderObject = this.taskUsers.filter(function (user: any, i: any) {
      if (user.AssingedToUser != undefined) {
        return user.AssingedToUser['Title'] == username
      }
    });
    if (senderObject.length > 0) {
      userDeatails.push({
        'Id': senderObject[0].AssingedToUser.Id,
        'Name': senderObject[0].Email,
        'Suffix': senderObject[0].Suffix,
        'Title': senderObject[0].Title,
        'userImage': senderObject[0].Item_x0020_Cover != null ? senderObject[0].Item_x0020_Cover.Url : ""
      })
    }
    return userDeatails;
  }




  //open the model
  private OpenModal(e: any, item: any) {
    if (item.Url != undefined) {
      item.ImageUrl = item.Url;
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
    const i = await web.lists.getByTitle(this.state.listName)
      .items
      .getById(this.state.itemID).update({
        FeedBack: JSON.stringify(this.state.Result["FeedBack"])
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
    this.setState({
      isOpenEditPopup: false
    })
    this.GetResult();
  }
  private approvalcallback(){
    this.GetResult();
  }
  // private CallBackSumSmartTime(item: any) {

  //   smartTime = item


  // }
  // private CallBackTimesheet() {
  //   this.setState({
  //     isTimeEntry: false
  //   })
  //    this.getSmartTime();
  // }
  private ConvertLocalTOServerDate(LocalDateTime: any, dtformat: any) {
    if (dtformat == undefined || dtformat == '')
      dtformat = "DD/MM/YYYY";
    if (LocalDateTime != '') {
      let serverDateTime;
      let mDateTime = moment(LocalDateTime);
      serverDateTime = mDateTime.format(dtformat);
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

    if (this.taskResult != undefined) {
      //this.loadOtherDetailsForComponents();
    }

  }

  private breadcrumb() {
    let breadcrumbitem: any = {};
    let flag = false;
    let gAllDataMatches = this.gAllDataMatches;
    let self = this;
    if (this.taskResult != undefined && this.taskResult.Component != undefined && this.taskResult.Component.length > 0) {
      this.taskResult.Component.forEach(function (item: any) {
        flag = false;
        gAllDataMatches.forEach(function (value: any) {
          if (item.Id == value.Id) {

            if (value.Parent != undefined && value.Parent.Id != undefined) {
              gAllDataMatches.forEach(function (component: any) {
                if (component.Id == value.Parent.Id) {
                  if (value.Item_x0020_Type == "SubComponent") {
                    flag = true;
                    breadcrumbitem.Parentitem = component;
                    breadcrumbitem.Child = item;
                  } else {
                    gAllDataMatches.forEach(function (subchild: any) {
                      if (component.Parent.Id == subchild.Id) {
                        flag = true;
                        breadcrumbitem.Parentitem = subchild;
                        breadcrumbitem.Child = component;
                        breadcrumbitem.Subchild = item;
                      } else if (component.Parent.Id == undefined && self.taskResult.Component[0].ItemType == "Feature") {
                        flag = true
                        breadcrumbitem.Parentitem = subchild;
                        breadcrumbitem.Child = undefined;
                        breadcrumbitem.Subchild = item;
                      }
                    })
                  }
                }
              })
            } else if (value.Parent == undefined || value.Parent.Id == undefined) {
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
    if (this.taskResult != undefined && this.taskResult.Services != undefined && this.taskResult.Services.length > 0) {
      this.taskResult.Services.forEach(function (item: any) {
        flag = false;
        gAllDataMatches.forEach(function (value: any) {

          if (item.Id == value.Id) {

            if (value.Parent != undefined && value.Parent.Id != undefined) {
              gAllDataMatches.forEach(function (component: any) {
                if (component.Id == value.Parent.Id) {
                  flag = true;
                  if (value.Item_x0020_Type == "SubComponent") {
                    breadcrumbitem.Parentitem = component;
                    breadcrumbitem.Child = item;
                  } else {
                    gAllDataMatches.forEach(function (subchild: any) {
                      if (component.Parent.Id == subchild.Id) {
                        flag = true;
                        breadcrumbitem.Parentitem = subchild;
                        breadcrumbitem.Child = component;
                        breadcrumbitem.Subchild = item;
                      } else if (component.Parent.Id == undefined && self.taskResult.Services[0].ItemType == "Feature") {
                        flag = true
                        breadcrumbitem.Parentitem = subchild;
                        breadcrumbitem.Child = undefined;
                        breadcrumbitem.Subchild = item;
                      }
                    })
                  }
                }
              })
            } else if (value.Parent !=undefined && value.Parent.Id == undefined) {
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
    if (this.taskResult != undefined && this.taskResult.Events != undefined && this.taskResult.Events.length > 0) {
      this.taskResult.Events.forEach(function (item: any) {
        flag = false;
        gAllDataMatches.forEach(function (value: any) {

          if (item.Id == value.Id) {

            if (value.Parent.Id != undefined) {
              gAllDataMatches.forEach(function (component: any) {
                if (component.Id == value.Parent.Id) {
                  if (value.Item_x0020_Type == "SubComponent") {
                    flag = true;
                    breadcrumbitem.Parentitem = component;
                    breadcrumbitem.Child = item;
                  } else {
                    gAllDataMatches.forEach(function (subchild: any) {
                      if (component.Parent.Id == subchild.Id) {
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
    this.allDataOfTask.forEach(function (value: any) {
      if (self.taskResult.SharewebTaskType != undefined) {
        if (self.taskResult.SharewebTaskType.Title == 'Activities' || self.taskResult.SharewebTaskType.Title == 'Project') {
          if (value.Id == self.taskResult.Id) {
            value.isLastNode = true;
            breadcrumbitem.ParentTask = value;
          }
        } else if (self.taskResult.SharewebTaskType.Title == 'Workstream' || self.taskResult.SharewebTaskType.Title == 'Step') {
          if (self.taskResult.ParentTask.Id != undefined) {
            if (self.taskResult.ParentTask.Id == value.Id) {
              self.taskResult.isLastNode = true;
              breadcrumbitem.ParentTask = value;
              breadcrumbitem.ChildTask = self.taskResult;
            }
          }
        } else if (self.taskResult.SharewebTaskType.Title == 'Task' || self.taskResult.SharewebTaskType.Title == 'MileStone') {
          if (self.taskResult.ParentTask != undefined && self.taskResult.ParentTask.Id != undefined) {
            if (self.taskResult.ParentTask.Id == value.Id && (value.SharewebTaskType.Title == 'Activities' || value.SharewebTaskType.Title == 'Project')) {
              self.taskResult.isLastNode = true;
              breadcrumbitem.ParentTask = value;
              breadcrumbitem.ChildTask = self.taskResult;
            }
            if (self.taskResult.ParentTask.Id == value.Id && (value.SharewebTaskType.Title == 'Workstream' || value.SharewebTaskType.Title == 'Step')) {
              self.taskResult.isLastNode = true;
              breadcrumbitem.ChildTask = value;
              breadcrumbitem.SubChildTask = self.taskResult;

            }
            if (breadcrumbitem.ChildTask != undefined) {
              self.allDataOfTask.forEach(function (values: any) {
                if (breadcrumbitem.ChildTask.ParentTask.Id == values.Id && (breadcrumbitem.ChildTask.SharewebTaskType.Title == 'Workstream' || breadcrumbitem.ChildTask.SharewebTaskType.Title == 'Step')) {
                  breadcrumbitem.ParentTask = values;
                }
              });
            }
          } else {
            self.taskResult.isLastNode = true;
            breadcrumbitem.ParentTask = self.taskResult;
          }
        }
      }
    })
    if (this.taskResult.SharewebTaskType == undefined) {
      this.taskResult.isLastNode = true;
      breadcrumbitem.ParentTask = this.taskResult;
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
            <div className="col-sm-12 p-0 ng-scope">
              <ul className="spfxbreadcrumb m-0 p-0">
                {this.state.maincollection.map((breadcrumbitem: any) => {
                  return <>
                    {(this.state.Result["Component"] != null && this.state.Result["Component"].length > 0) || (this.state.Result["Services"] != null && this.state.Result["Services"].length > 0) &&
                      <li>
                        {this.state.Result["Component"] != null && this.state.Result["Component"].length > 0 &&
                          <a target="_blank" data-interception="off" href="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Component-Portfolio.aspx">Component Portfolio</a>
                        }
                        {this.state.Result["Services"] != null && this.state.Result["Services"].length > 0 &&
                          <a target="_blank" data-interception="off" href="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Service-Portfolio.aspx">Service Portfolio</a>
                        }
                      </li>
                    }


                    {breadcrumbitem.Parentitem != undefined &&
                      <li>

                        <a target="_blank" data-interception="off" className="ng-binding" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + breadcrumbitem.Parentitem.Id}>{breadcrumbitem.Parentitem.Title}</a>
                      </li>
                    }
                    {breadcrumbitem.Child != undefined &&
                      <li>

                        <a target="_blank" data-interception="off" className="ng-binding" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + breadcrumbitem.Child.Id}>{breadcrumbitem.Child.Title}</a>
                      </li>
                    }
                    {breadcrumbitem.Subchild != undefined &&
                      <li className="ng-scope" ng-if="breadcrumbitem.Subchild!=undefined">

                        <a target="_blank" data-interception="off" className="ng-binding" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + breadcrumbitem.Subchild.Id}>{breadcrumbitem.Subchild.Title}</a>
                      </li>
                    }
                    {breadcrumbitem.Subchild == undefined && breadcrumbitem.Child == undefined && this.state.Result["Services"].length == 0 &&
                      this.state.Result["Component"].length == 0 && breadcrumbitem.ParentTask != undefined &&
                      <li className="ng-scope" ng-if="breadcrumbitem.Subchild!=undefined">
                        <a target="_blank" data-interception="off" className="ng-binding" href="https://hhhhteams.sharepoint.com/sites/HHHH/SH/SitePages/Dashboard.aspx"> <span className="ng-binding">Dashboard</span> </a>
                      </li>
                    }
                    {breadcrumbitem.ParentTask != undefined &&
                      <li>
                        <a >
                          <span className="ng-binding">{this.state.Result['Title']}</span>
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
          <h2 className="heading d-flex ps-0 justify-content-between align-items-center">
            <span>
              {this.state.Result["SiteIcon"] != "" && <img className="imgWid29 pe-1 " src={this.state.Result["SiteIcon"]} />}
              {this.state.Result["SiteIcon"] === "" && <img className="imgWid29 pe-1 " src="" />}
              {this.state.Result['Title']}
              {/* {this.props.Context._pageContext.web.title=="SH"} */}
              <a className="hreflink ng-scope ps-2" onClick={() => this.OpenEditPopUp()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"/></svg>
                {/* <img style={{ width: '16px', height: '16px', borderRadius: '0' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" /> */}
              </a>
              {/* {this.currentUser!=undefined && this.state.Result["Approver"]!=undefined&&this.currentUser[0].Title==this.state.Result["Approver"].Title &&<span><button>Approve</button><span><button>Reject</button></span></span>} */}
              {this.currentUser!=undefined && this.state.Result["Approver"]!=undefined &&<EmailComponenet  siteUrl={this.props.siteUrl} Context={this.props.Context} Approver={this.state.Result["Approver"]} currentUser={this.currentUser} items={this.state.Result}/>}
            </span>
            {this.state.Result.sitePage == "SP" && <span className="text-end fs-6"> <a target='_blank' data-interception="off" href={this.oldTaskLink} style={{ cursor: "pointer", fontSize: "14px" }}>Old Task Profile</a></span>}
            {this.state.Result.sitePage == "SH" && <span className="text-end fs-6"> <a target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SH/SitePages/Task-Profile.aspx?taskId=${this.state.Result.Id}&Site=${this.state.Result.listName}`} style={{ cursor: "pointer", fontSize: "14px" }}>Old Task Profile</a></span>}
          </h2>
        </section>
        <section>
          <div className='row'>
            <div className="col-9 bg-white">
              <div className="team_member row">
                <div className='col-md-4 p-0'>
                  <dl>
                    <dt className='bg-fxdark'>Task Id</dt>
                    <dd className='bg-light' ng-show="Task.Shareweb_x0020_ID!=undefined" ng-repeat="taskId in maincollection">{this.state.Result["TaskId"]}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark'>Due Date</dt>
                    <dd className='bg-light'>{this.state.Result["DueDate"] != null ? moment(this.state.Result["DueDate"]).format("DD/MM/YYYY") : ''}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark'>Start Date</dt>
                    <dd className='bg-light'>{this.state.Result["StartDate"] != undefined ? this.state.Result["StartDate"] : ""}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark'>Completion Date</dt>
                    <dd className='bg-light'> {this.state.Result["CompletedDate"] != undefined ? this.state.Result["CompletedDate"] : ""}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark' title="Task Id">Categories</dt>

                    <dd className='bg-light text-break'>{this.state.Result["Categories"]}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark'>SmartTime Total</dt>
                    <dd className='bg-light '>
                      <span className="me-1"> {this.state.smarttimefunction ? <SmartTimeTotal props={this.state.Result} /> : null}</span>
                    </dd>

                  </dl>
                </div>

                <div className='col-md-4 p-0'>
                  <dl>
                    <dt className='bg-fxdark'>Team Members</dt>
                    <dd className='bg-light'>
                      <div className="d-flex align-items-center">
                        {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length > 0 && this.state.Result["TeamLeader"].map((rcData: any, i: any) => {
                          return <div className="user_Member_img"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off" title={rcData.Title}>
                            {rcData.userImage != null && <img className="imgAuthor" src={rcData.userImage}></img>}
                            {rcData.userImage == null && <span className="imgAuthor bg-fxdark" >{rcData.Suffix}</span>}
                          </a>
                          </div>
                        })}
                        {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length > 0 &&
                          <div></div>
                        }

                        {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 0 &&
                          <div className="img  "><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${this.state.Result["TeamMembers"][0].Id}&Name=${this.state.Result["TeamMembers"][0].Title}`} target="_blank" data-interception="off" title={this.state.Result["TeamMembers"][0].Title}>
                            {this.state.Result["TeamMembers"][0].userImage != null && <img className={`imgAuthor ${this.state.Result["TeamMembers"][0].activeimg2}`} src={this.state.Result["TeamMembers"][0].userImage}></img>}
                            {this.state.Result["TeamMembers"][0].userImage == null && <span className={`imgAuthor ${this.state.Result["TeamMembers"][0].activeimg2}`} >{this.state.Result["TeamMembers"][0].Suffix}</span>}
                          </a>
                          </div>
                        }

                        {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length == 2 && <div className="img mx-2"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${this.state.Result["TeamMembers"][1].Id}&Name=${this.state.Result["TeamMembers"][1].Title}`} target="_blank" data-interception="off" title={this.state.Result["TeamMembers"][1].Title}>
                          {this.state.Result["TeamMembers"][1].userImage != null && <img className={`imgAuthor ${this.state.Result["TeamMembers"][1].activeimg2}`} src={this.state.Result["TeamMembers"][1].userImage}></img>}
                          {this.state.Result["TeamMembers"][1].userImage == null && <span className={`imgAuthor ${this.state.Result["TeamMembers"][1].activeimg2}`} >{this.state.Result["TeamMembers"][1].Suffix}</span>}
                        </a>
                        </div>
                        }
                        {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 2 &&
                          <div className="position-relative user_Member_img_suffix2" onMouseOver={(e) => this.handleSuffixHover()} onMouseLeave={(e) => this.handleuffixLeave()}>+{this.state.Result["TeamMembers"].length - 1}
                            <span className="tooltiptext" style={{ display: this.state.Display, padding: '10px' }}>
                              <div>
                                {this.state.Result["TeamMembers"].slice(1).map((rcData: any, i: any) => {

                                  return <div className="team_Members_Item" style={{ padding: '2px' }}>
                                    <a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off">

                                      {rcData.userImage != null && <img className={`imgAuthor ${rcData.activeimg2}`} src={rcData.userImage}></img>}
                                      {rcData.userImage == null && <span className={`imgAuthor ${rcData.activeimg2}bg-fxdark`}>{rcData.Suffix}</span>}

                                      <span className='mx-2'>{rcData.Title}</span>
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
                    <dt className='bg-fxdark'>Status</dt>
                    <dd className='bg-light'>{this.state.Result["Status"]}</dd>
                  </dl>

                  <dl>
                    <dt className='bg-fxdark'>Item Rank</dt>
                    <dd className='bg-light'>{this.state.Result["ItemRank"]}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark'>% Complete</dt>
                    <dd className='bg-light'>{this.state.Result["PercentComplete"]}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark'>Priority</dt>
                    <dd className='bg-light'>{this.state.Result["Priority"]}</dd>
                  </dl>
                  <dl>
                    <dt className='bg-fxdark'>Created</dt>
                    <dd className='bg-light'>
                      {moment(this.state.Result["Created"]).format("DD/MM/YYYY")}  <span className='ms-1'>
                        {this.state.Result["Author"] != null && this.state.Result["Author"].length > 0 &&
                          <a title={this.state.Result["Author"][0].Title} >
                            {this.state.Result["Author"][0].userImage !== "" && <img className="imgAuthor" src={this.state.Result["Author"][0].userImage} ></img>}
                            {this.state.Result["Author"][0].userImage === "" && <span className="imgAuthor">{this.state.Result["Author"][0].Suffix}</span>}
                          </a>

                        }
                      </span>

                    </dd>
                  </dl>
                </div>
                <div className='col-md-4 p-0'>

                  <dl>

                    <dt className='bg-fxdark'>Portfolio</dt>
                    <dd className='bg-light full-width'>
                      {this.state.Result["Component"] != null && this.state.Result["Component"].length > 0 && this.state.Result["Component"].map((componentdt: any, i: any) => {
                        return (
                          <a className="hreflink ng-binding" target="_blank" data-interception="off" href={("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + componentdt.Id)}>{componentdt.Title}</a>

                        )
                      })}
                      {this.state.Result["Services"] != null && this.state.Result["Services"].length > 0 && this.state.Result["Services"].map((Servicesdt: any, i: any) => {
                        return (
                          <a className="hreflink ng-binding" target="_blank" data-interception="off" href={("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + Servicesdt.Id)}>{Servicesdt.Title}</a>

                        )
                      })}

                    </dd>
                  </dl>
                  <dl className="Sitecomposition">
                    {ClientTimeArray != null && ClientTimeArray.length > 0 &&
                      <div className='dropdown'>
                        <a className="sitebutton bg-fxdark " onClick={() => this.showhideComposition()}>
                          <span >{this.state.showComposition ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span>Site Composition</span>
                        </a>
                        <div className="spxdropdown-menu" style={{ display: this.state.showComposition ? 'block' : 'none' }}>
                          <ul>
                            {ClientTimeArray.map((cltime: any, i: any) => {
                              return <li className="Sitelist">
                                <span>
                                  <img style={{ width: "22px" }} src={this.GetSiteIcon(cltime.SiteName)} />
                                </span>
                                {cltime.ClienTimeDescription != undefined &&
                                  <span>
                                    {cltime.ClienTimeDescription}%
                                  </span>
                                }
                                {cltime.ClientCategory != undefined || cltime.ClientCategory != null ? <span>{cltime.ClientCategory}</span> : null}
                              </li>
                            })}
                          </ul>
                        </div>
                      </div>
                    }
                    {/* {this.state.Result["ClientTime"] != null && this.state.Result["ClientTime"].length > 0 &&
                      <div className='dropdown'>
                        <a className="sitebutton bg-fxdark " onClick={() => this.showhideComposition()}>
                          <span >{this.state.showComposition ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span>Site Composition</span>
                        </a>
                        <div className="spxdropdown-menu" style={{ display: this.state.showComposition ? 'block' : 'none' }}>
                          <ul>
                            {this.state.Result["ClientTime"].map((cltime: any, i: any) => {
                              return <li className="dropdown-item">
                                <span>
                                  <img style={{ width: "22px" }} src={this.GetSiteIcon(cltime.SiteName)} />
                                </span>
                                {cltime.ClienTimeDescription != undefined &&
                                  <span>
                                    {cltime.ClienTimeDescription}.00%
                                  </span>
                                }
                              </li>
                            })}
                          </ul>
                        </div>
                      </div>
                    } */}

                  </dl>



                </div>
              </div>
              <div className='row'>
                <div className="d-flex p-0">
                  <div className='bg-fxdark p-2'><label>Url</label></div>
                  <div className='bg-light p-2 text-break full-width'>
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
                        {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].map((imgData: any, i: any) => {
                          return <div className="taskimage border mb-3">
                            {/*  <BannerImageCard imgData={imgData}></BannerImageCard> */}

                            <a className='images' target="_blank" data-interception="off" href={imgData.ImageUrl}>
                              <img alt={imgData.ImageName} src={imgData.ImageUrl}
                                onMouseOver={(e) => this.OpenModal(e, imgData)}
                                onMouseOut={(e) => this.CloseModal(e)} ></img>
                            </a>


                            <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-2 ">
                              <div className='usericons'>
                                <span ng-show="attachedFiles.FileName==imageInfo.ImageName" ng-repeat="imageInfo in BasicImageInfo">
                                  <span >{imgData.UploadeDate}</span>
                                  <span className='round px-1'>
                                    {imgData.UserImage != null &&
                                      <img className='align-self-start' title={imgData.UserName} src={imgData.UserImage} />
                                    }
                                  </span>

                                </span>
                              </div>
                              <div>
                              <a className='images' target="_blank" data-interception="off" href={imgData.ImageUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>
                                <span >
                                  {imgData.ImageName.length > 15 ? imgData.ImageName.substring(0, 15) + '...' : imgData.ImageName}
                                </span>
                                <span>|</span>
                              </div>

                            </div>

                          </div>
                        })}
                      </div>
                    }
                    <div className={this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].length > 0 ? "col-sm-8 pe-0 mt-2" : "col-sm-12 pe-0 ps-0 mt-2"}>
                      {this.state.Result["SharewebTaskType"] != null && (this.state.Result["SharewebTaskType"] == '' ||
                        this.state.Result["SharewebTaskType"] == 'Task' || this.state.Result["SharewebTaskType"] == "Activities") && this.state.Result["FeedBack"] != null &&
                        this.state.Result["FeedBack"][0].FeedBackDescriptions.length > 0 &&
                        this.state.Result["FeedBack"][0].FeedBackDescriptions[0].Title != '' &&
                        <div className={"Addcomment " + "manage_gap"}>
                          {this.state.Result["FeedBack"][0].FeedBackDescriptions.map((fbData: any, i: any) => {
                            try {
                              if (fbData.Title != undefined) {
                                fbData.Title = fbData.Title.replace(/\n/g, '<br/>');
                              }
                            } catch (e) {
                            }
                            return <TaskFeedbackCard feedback={fbData} index={i + 1}
                              onPost={() => { this.onPost() }}
                              fullfeedback={this.state.Result["FeedBack"]}
                              CurrentUser={this.currentUser}
                              ApprovalStatus={this.state.ApprovalStatus}
                              Approver={this.state.Result["Approver"]}
                            >
                            </TaskFeedbackCard>
                          })}
                        </div>
                      }
                    </div>

                  </div>
                </div>

                {/* Backgroundimage code and comment */}

                {this.backGroundComment ? <div className="col">
                  <div className="Taskaddcomment row">
                    {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"].length > 0 &&
                      <div className="col-sm-5 bg-white col-sm-5 pt-3 p-0">
                        {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"].map((imgData: any, i: any) => {
                          return <div className="taskimage border mb-3">
                            <a className='images' target="_blank" data-interception="off" href={imgData.ImageUrl}>
                              <img alt={imgData.ImageName} src={imgData.Url}
                                onMouseOver={(e) => this.OpenModal(e, imgData)}
                                onMouseOut={(e) => this.CloseModal(e)} ></img>
                            </a>


                            <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-2 ">
                              <div className='usericons'>
                                <span ng-show="attachedFiles.FileName==imageInfo.ImageName" ng-repeat="imageInfo in BasicImageInfo">
                                  <span >
                                    {imgData.ImageName.length > 15 ? imgData.ImageName.substring(0, 15) + '...' : imgData.ImageName}
                                  </span>
                                  

                                </span>
                              </div>
                              <div>
                                <span >{imgData.UploadeDate}</span>
                                <span className='round px-1'>
                                  {imgData.UserImage !== null &&
                                    <img className='align-self-start' title={imgData.UserName} src={imgData.UserImage} />
                                  }
                                </span>
                               
                              </div>
                              {/* <div>
                                <span >
                                  {imgData.ImageName.length > 15 ? imgData.ImageName.substring(0, 15) + '...' : imgData.ImageName}
                                </span>
                                <span>|</span>
                              </div> */}

                            </div>

                          </div>
                        })}
                      </div>
                    }
                    {this.state.Result["OffshoreComments"] != null && this.state.Result["OffshoreComments"] != undefined && this.state.Result["OffshoreComments"].length > 0 && <div className="col-sm-7 pe-0 mt-2">
                      <fieldset className='border p-1'>
                        <legend className="border-bottom fs-6">Background Comments</legend>
                        {this.state.Result["OffshoreComments"] != null && this.state.Result["OffshoreComments"].length > 0 && this.state.Result["OffshoreComments"].map((item: any, index: any) => {
                          return <div>


                            <span className='round px-1'>
                              {item.AuthorImage != null &&
                                <img className='align-self-start' title={item.AuthorName} src={item.AuthorImage} />
                              }
                            </span>

                            <span className="pe-1">{item.AuthorName}</span>
                            <span className="pe-1" >{moment(item.Created).format("DD/MM/YY")}</span>
                            <div style={{ paddingLeft: "30px" }} className=" mb-4 text-break"><span dangerouslySetInnerHTML={{ __html: item.Body }}></span>
                            </div>


                          </div>
                        })} </fieldset>

                    </div>}
                  </div>
                </div> : null}


                <div className="row">
                  {this.state.Result != undefined && this.state.Result.Id != undefined && this.state.Result.SharewebTaskType !="" && this.state.Result.SharewebTaskType !=undefined &&  this.state.Result.SharewebTaskType != 'Task' ? <TasksTable props={this.state.Result} /> : ''}
                </div>

                <div className='row'>
                {/* {this.state.Result?.Portfolio_x0020_Type!=undefined &&<TaskWebparts props={this.state.Result}/>} */}
                  {this.state.Result != undefined &&
                    <div className="ItemInfo mb-20" style={{ paddingTop: '15px' }}>
                      <div>Created <span className="ng-binding">{this.ConvertLocalTOServerDate(this.state.Result['Creation'], 'DD MMM YYYY HH:mm')}</span> by <span className="siteColor ng-binding">{this.state.Result['Author'] != null && this.state.Result['Author'].length > 0 && this.state.Result['Author'][0].Title}</span>
                      </div>
                      <div>Last modified <span className="ng-binding">{this.ConvertLocalTOServerDate(this.state.Result['Modified'], 'DD MMM YYYY HH:mm')}</span> by <span className="siteColor ng-binding">{this.state.Result['ModifiedBy'] != null && this.state.Result['ModifiedBy'].Title}</span>
                        <span>{this.state.itemID ? <VersionHistoryPopup taskId={this.state.itemID} listId={this.state.Result.listId} isOpen={this.state.isopenversionHistory} /> : ''}</span>
                      </div>

                    </div>


                  }


                </div>

              </section>

            </div>
            <div className="col-3">
              <div>
                <CommentCard siteUrl={this.props.siteUrl} Context={this.props.Context}></CommentCard>
              </div>
              <div>{this.state.Result.Id && <SmartInformation Id={this.state.Result.Id} siteurl={this.state.Result.siteUrl} listName={this.state.Result.listName} spPageContext={this.props.Context._pageContext._web} />}</div>
              <div>  <RelevantDocuments siteUrl={this.props.siteUrl} ID={this.state.itemID} siteName={this.state.listName} folderName={this.state.Result['Title']} ></RelevantDocuments></div>

            </div>

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

        {this.state.isOpenEditPopup ? <EditTaskPopup Items={this.state.Result} Call={() => { this.CallBack() }} /> : ''}
        {/* {this.state.isTimeEntry ? <TimeEntry props={this.state.Result} isopen={this.state.isTimeEntry} CallBackTimesheet={() => { this.CallBackTimesheet() }} /> : ''} */}

      </div>
    );
  }
}

