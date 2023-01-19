import * as React from 'react';
import * as Moment from 'moment';
import * as moment from 'moment';
///import styles from './Taskprofile.module.scss';
import { ITaskprofileProps } from './ITaskprofileProps';
import TaskFeedbackCard from './TaskFeedbackCard';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
import { Modal } from 'office-ui-fabric-react';
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import TimeEntry from './TimeEntry';
import SmartTimeTotal from './SmartTimeTotal';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { forEach } from 'lodash';
import { Item } from '@pnp/sp/items';
var smartTime: Number = 0;
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
  smartTimeTotalas: any
  smarttimefunction: boolean;
}

export default class Taskprofile extends React.Component<ITaskprofileProps, ITaskprofileState> {

  private taskUsers: any = [];
  private currentUser: any;
  private oldTaskLink: any;
  private site: any;
  public constructor(props: ITaskprofileProps, state: ITaskprofileState) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    console.log(params.get('taskId'));
    console.log(params.get('Site'));
    this.site = params.get('Site');
    this.oldTaskLink = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + params.get('taskId') + "&Site=" + params.get('Site');
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
      smartTimeTotalas: 0,
      isTimeEntry: false,
      showPopup: 'none',
      maincollection: [],
      SharewebTimeComponent: [],
      smarttimefunction: false
    }

    this.GetResult();
  }

  public async componentDidMount() {
    //this.GetRes ult()
  }

  private gAllDataMatches: any = [];
  private taskResult: any;
  private async loadOtherDetailsForComponents(task: any) {

    if (task.Component.length > 0) {
      await this.loadComponentsDataForTasks(task);
      await this.getAllTaskData();
      this.breadcrumb();
      console.log('Array for Breadcrumb');
      console.log(this.maincollection);
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

      console.log(AllDataMatches);
      this.gAllDataMatches = AllDataMatches;
      console.log('All Component : ');
      console.log(this.gAllDataMatches)
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
    let taskDetails = [];
    let listInfo = await web.lists.getByTitle(this.state.listName).get();
    console.log(listInfo);
    taskDetails = await web.lists
      .getByTitle(this.state.listName)
      .items
      .getById(this.state.itemID)
      .select("ID", "Title", "DueDate", "Categories", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
      .expand("Team_x0020_Members", "Author", "Responsible_x0020_Team", "SharewebTaskType", "Component", "Services", "Editor", "AttachmentFiles")
      .get()

    taskDetails["listName"] = this.state.listName;
    taskDetails["siteType"] = this.state.listName;
    taskDetails["siteUrl"] = this.props.siteUrl;
    console.log(taskDetails);
    this.taskResult = taskDetails;
    await this.GetTaskUsers();

    this.currentUser = this.GetUserObject(this.props.userDisplayName);

    let tempTask = {
      SiteIcon: this.GetSiteIcon(this.state.listName),
      Id: taskDetails["ID"],
      ID: taskDetails["ID"],
      siteType: taskDetails["siteType"],
      listName: taskDetails["listName"],
      siteUrl: taskDetails["siteUrl"],
      TaskId: "T" + taskDetails["ID"],
      Title: taskDetails["Title"],
      DueDate: taskDetails["DueDate"],
      Categories: taskDetails["Categories"],
      Status: taskDetails["Status"],
      StartDate: taskDetails["StartDate"] != null ? moment( taskDetails["StartDate"]).format("DD/MM/YYYY") : "",
      CompletedDate: taskDetails["CompletedDate"] != null ? moment(this.state.Result["CompletedDate"]).format("DD/MM/YYYY") : "",
      TeamLeader: taskDetails["Responsible_x0020_Team"] != null ? this.GetUserObjectFromCollection(taskDetails["Responsible_x0020_Team"]) : null,
      TeamMembers: taskDetails["Team_x0020_Members"] != null ? this.GetUserObjectFromCollection(taskDetails["Team_x0020_Members"]) : null,
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
      AttachmentFiles: taskDetails["AttachmentFiles"]
    };

    console.log(tempTask);

    this.setState({
      Result: tempTask
    }, () => {
      this.loadOtherDetailsForComponents(this.taskResult);
    });
  }

  private GetAllImages(BasicImageInfo: any, AttachmentFiles: any, Attachments: any) {
    let ImagesInfo: any = [];
    if (Attachments) {
      AttachmentFiles.forEach(function (Attach: any) {
        let attachdata = BasicImageInfo.filter(function (ingInfo: any, i: any) {
          return ingInfo.ImageName == Attach.FileName
        });
        if (attachdata.length > 0) {
          BasicImageInfo.forEach(function(item:any){
            if(item.ImageName==Attach.FileName){
              ImagesInfo.push({
                ImageName: Attach.FileName,
                ImageUrl: Attach.ServerRelativeUrl,
                UploadeDate: item.UploadeDate,
                UserImage: item.UserImage,
                UserName: item.UserName
              })
            }
          })
          
          // ImagesInfo.push({
          //   ImageName: Attach.FileName,
          //   ImageUrl: Attach.ServerRelativeUrl,
          //   UploadeDate: '',
          //   UserImage: null,
          //   UserName: null
          // })
        }
      });
      ImagesInfo = ImagesInfo;
      // ImagesInfo = ImagesInfo;
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
      .getByTitle('Task Users')
      .items
      .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id',)
      .filter("ItemType eq 'User'")
      .expand('AssingedToUser')
      .get();
    this.taskUsers = taskUsers;
    console.log(this.taskUsers);

  }

  private GetSiteIcon(listName: string) {
    let siteicon = '';
    if (listName.toLowerCase() == 'migration') {
      siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png';
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
    if (listName.toLowerCase() == 'alakdigital') {
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

    return siteicon;
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
          'userImage': senderObject[0].Item_x0020_Cover.Url
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
        'userImage': senderObject[0].Item_x0020_Cover.Url
      })
    }
    return userDeatails;
  }




  //open the model
  private OpenModal(e: any, item: any) {
    //debugger;
    e.preventDefault();
    console.log(item);
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
    console.log('post');
    console.log(this.state.Result["FeedBack"]);

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
  private CallBackSumSmartTime(item: any) {
    smartTime = item
  }
  private CallBackTimesheet() {
    this.setState({
      isTimeEntry: false
    })
    this.GetResult();
  }
  private ConvertLocalTOServerDate(LocalDateTime: any, dtformat: any) {
    if (dtformat == undefined || dtformat == '')
      dtformat = "DD/MM/YYYY";
    if (LocalDateTime != '') {
      let serverDateTime;
      let mDateTime = Moment(LocalDateTime);
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
      .select('Shareweb_x0020_ID', 'SharewebTaskType/Id', 'SharewebTaskType/Title', 'Team_x0020_Members/Id', 'Team_x0020_Members/Title', 'Team_x0020_Members/Name', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id', 'AttachmentFiles/FileName', 'Component/Id', 'Component/Title', 'Component/ItemType', 'Services/Id', 'Services/Title', 'Services/ItemType', 'OffshoreComments', 'Portfolio_x0020_Type', 'Categories', 'FeedBack', 'component_x0020_link', 'FileLeafRef', 'Title', 'Id', 'Comments', 'CompletedDate', 'StartDate', 'DueDate', 'Status', 'Body', 'Company', 'Mileage', 'PercentComplete', 'FeedBack', 'Attachments', 'Priority', 'Created', 'Modified', 'BasicImageInfo', 'SharewebCategories/Id', 'SharewebCategories/Title', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title', 'Events/Id', 'Events/Title', 'Events/ItemType', 'SharewebTaskLevel1No', 'SharewebTaskLevel2No', 'ParentTask/Id', 'ParentTask/Title', 'Responsible_x0020_Team/Id', 'Responsible_x0020_Team/Title', 'Responsible_x0020_Team/Name')
      .filter("(SharewebTaskType/Title eq 'Activities') or (SharewebTaskType/Title eq 'Workstream') or (SharewebTaskType/Title eq 'Task') or (SharewebTaskType/Title eq 'Project') or (SharewebTaskType/Title eq 'Step') or (SharewebTaskType/Title eq 'MileStone')")
      .expand('Responsible_x0020_Team', 'ParentTask', 'AssignedTo', 'Component', 'Services', 'Events', 'AttachmentFiles', 'Author', 'Team_x0020_Members', 'Editor', 'SharewebCategories', 'SharewebTaskType')
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

            if (value.Parent.Id != undefined) {
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
    if (this.taskResult.Component.length == 0 && this.taskResult.Services.length == 0 && this.taskResult != undefined && this.taskResult.Events != undefined && this.taskResult.Events.length == 0) {
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
    return (
      <div>


        {this.state.maincollection != null && this.state.maincollection.length > 0 &&
          <div className='row'>
            <div className="col-sm-12 p-0 ng-scope" id="Breadcrumb">
              <ul>
                {this.state.maincollection.map((breadcrumbitem: any) => {
                  return <>

                    <span className="">
                      {this.state.Result["Component"] != null && this.state.Result["Component"].length > 0 &&
                        <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Component-Portfolio.aspx">Component Portfolio</a>
                      }
                      {this.state.Result["Services"] != null && this.state.Result["Services"].length > 0 &&
                        <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Service-Portfolio.aspx">Service Portfolio</a>
                      }
                    </span>

                    {breadcrumbitem.Parentitem != undefined &&
                      <span className="ng-scope">
                        <span className="before after ng-scope">&gt;</span>
                        <a className="ng-binding" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + breadcrumbitem.Parentitem.Id}>{breadcrumbitem.Parentitem.Title}</a>
                      </span>
                    }
                    {breadcrumbitem.Child != undefined &&
                      <span className="ng-scope">
                        <span ng-if="breadcrumbitem.Child!=undefined" className="ng-scope">&gt;</span>
                        <a className="ng-binding" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + breadcrumbitem.Child.Id}>{breadcrumbitem.Child.Title}</a>
                      </span>
                    }
                    {breadcrumbitem.Subchild != undefined &&
                      <span className="ng-scope" ng-if="breadcrumbitem.Subchild!=undefined">
                        <span ng-if="breadcrumbitem.Subchild!=undefined" className="ng-scope">&gt;</span>
                        <a className="ng-binding" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + breadcrumbitem.Subchild.Id}>{breadcrumbitem.Subchild.Title}</a>
                      </span>
                    }
                    {breadcrumbitem.ParentTask != undefined &&
                      <span className="ng-scope">
                        <span className="ng-scope">&gt;</span>
                        <span className="ng-binding">{this.state.Result['Title']}</span>
                      </span>
                    }
                  </>
                })

                }
              </ul>
            </div>
          </div>

        }

        <section className='row p-0'>
          <h2 className="headign ps-0">
            <img className="imgWid29 " src={this.state.Result["SiteIcon"]} />
            {this.state.Result['Title']}
            <a className="hreflink ng-scope ps-2" onClick={() => this.OpenEditPopUp()}>
              <img style={{ width: '16px', height: '16px', borderRadius: '0' }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" />
            </a>
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
                      <span className="me-1">{smartTime}</span>
                      <a onClick={(e) => this.EditData(e, this.state.Result)}><img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png" style={{ width: "22px" }} /></a>
                    </dd>
                    {this.state.Result.Id ? <SmartTimeTotal props={this.state.Result} CallBackSumSmartTime={this.CallBackSumSmartTime} /> : null}
                  </dl>
                </div>

                <div className='col-md-4 p-0'>
                  <dl>
                    <dt className='bg-fxdark'>Team Members</dt>
                    <dd className='bg-light'>
                      <div className="d-flex align-items-center">
                        {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length > 0 && this.state.Result["TeamLeader"].map((rcData: any, i: any) => {
                          return <div className="user_Member_img"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off" title={rcData.Title}><img className="imgAuthor" src={rcData.userImage}></img></a></div>
                        })}
                        {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length > 0 &&
                          <div></div>
                        }

                        {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 0 &&
                          <div className="user_Member_img"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${this.state.Result["TeamMembers"][0].Id}&Name=${this.state.Result["TeamMembers"][0].Title}`} target="_blank" data-interception="off" title={this.state.Result["TeamMembers"][0].Title}><img className="imgAuthor" src={this.state.Result["TeamMembers"][0].userImage}></img></a></div>
                        }
                        {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 1 &&
                          <div className="user_Member_img_suffix2" onMouseOver={(e) => this.handleSuffixHover()} onMouseLeave={(e) => this.handleuffixLeave()}>+{this.state.Result["TeamMembers"].length - 1}
                            <span className="tooltiptext" style={{ display: this.state.Display, padding: '10px' }}>
                              <div>
                                {this.state.Result["TeamMembers"].slice(1).map((rcData: any, i: any) => {

                                  return <div className="team_Members_Item" style={{ padding: '2px' }}>
                                    <div><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off">
                                      <img className="imgAuthor" src={rcData.userImage}></img></a></div>
                                    <div className='mx-2'>{rcData.Title}</div>
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
                      {moment(this.state.Result["Created"]).format("DD/MM/YYYY")} | <span className='ms-1'>
                        {this.state.Result["Author"] != null && this.state.Result["Author"].length > 0 &&
                          <img className="imgAuthor" src={this.state.Result["Author"][0].userImage}></img>
                        }
                      </span>

                    </dd>
                  </dl>



                </div>
                <div className='col-md-4 p-0'>
                  <dl className='d-grid text-right'><span className="pull-right"> <a target='_blank' href={this.oldTaskLink} style={{ cursor: "pointer" }}>Old Task Profile</a></span></dl>
                  <dl>

                    <dt className='bg-fxdark'>Portfolio</dt>
                    <dd className='bg-light full-width'>
                      {this.state.Result["Component"] != null && this.state.Result["Component"].length > 0 && this.state.Result["Component"].map((componentdt: any, i: any) => {
                        return (
                          <a className="hreflink ng-binding" target="_blank" href={("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + componentdt.Id)}>{componentdt.Title}</a>

                        )
                      })}

                    </dd>
                  </dl>
                  <dl className="Sitecomposition">
                    {this.state.Result["ClientTime"] != null && this.state.Result["ClientTime"].length > 0 &&
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
                    }

                  </dl>



                </div>
              </div>
              <div className='row'>
                <div className="d-flex p-0">
                  <div className='bg-fxdark p-2'><label>Url</label></div>
                  <div className='bg-light p-2 text-break full-width'>
                    {this.state.Result["component_url"] != null &&
                      <a href={this.state.Result["component_url"].Url}>{this.state.Result["component_url"].Url}</a>
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

                            <a className='images' target="_blank" href={imgData.ImageUrl}>
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
                    <div className="col-sm-8 pe-0 mt-2">
                      {this.state.Result["SharewebTaskType"] != null && (this.state.Result["SharewebTaskType"] == '' ||
                        this.state.Result["SharewebTaskType"] == 'Task') && this.state.Result["FeedBack"] != null &&
                        this.state.Result["FeedBack"][0].FeedBackDescriptions.length > 0 &&
                        this.state.Result["FeedBack"][0].FeedBackDescriptions[0].Title != '' &&
                        <div className={"Addcomment " + "manage_gap"}>
                          {this.state.Result["FeedBack"][0].FeedBackDescriptions.map((fbData: any, i: any) => {
                            return <TaskFeedbackCard feedback={fbData} index={i + 1}
                              onPost={() => { this.onPost() }}
                              fullfeedback={this.state.Result["FeedBack"]}
                              CurrentUser={this.currentUser}>
                            </TaskFeedbackCard>
                          })}
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <div className='row'>
                  {this.state.Result != undefined &&
                    <div className="ItemInfo mb-20" style={{ paddingTop: '15px' }}>
                      <div>Created <span className="ng-binding">{this.ConvertLocalTOServerDate(this.state.Result['Creation'], 'DD MMM YYYY HH:mm')}</span> by <span className="siteColor ng-binding">{this.state.Result['Author'] != null && this.state.Result['Author'].length > 0 && this.state.Result['Author'][0].Title}</span>
                      </div>
                      <div>Last modified <span className="ng-binding">{this.ConvertLocalTOServerDate(this.state.Result['Modified'], 'DD MMM YYYY HH:mm')}</span> by <span className="siteColor ng-binding">{this.state.Result['ModifiedBy'] != null && this.state.Result['ModifiedBy'].Title}</span>
                      </div>
                    </div>
                  }

                </div>

              </section>

            </div>
            <div className="col-3">
              <CommentCard siteUrl={this.props.siteUrl} Context={this.props.Context}></CommentCard>
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
        {this.state.isTimeEntry ? <TimeEntry props={this.state.Result} isopen={this.state.isTimeEntry} CallBackTimesheet={() => { this.CallBackTimesheet() }} /> : ''}

      </div>
    );
  }
}


