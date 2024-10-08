import * as React from 'react';
import { Web } from "sp-pnp-js";
import { MentionsInput, Mention } from 'react-mentions';
import mentionClass from './mention.module.scss';
import Tooltip from '../Tooltip';
import "@pnp/sp/sputilities";
import * as moment from "moment-timezone";
import HtmlEditorCard from '../HtmlEditor/HtmlEditor';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as globalCommon from '../../globalComponents/globalCommon';
import { getSP } from '../../spservices/pnpjsConfig';
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { ImReply } from 'react-icons/im';
import * as GlobalFunctionForUpdateItems from '../GlobalFunctionForUpdateItems';
// import { FocusTrapCallout, FocusZone, FocusZoneTabbableElements, Stack, Text, } from '@fluentui/react';
import { Avatar } from "@fluentui/react-components";
import { Popover, PopoverTrigger, PopoverSurface, } from "@fluentui/react-components";
import ReactDOM from "react-dom";
let color: any = false;
let Title: any = "";
let commentlength: any = 0
let emailRecipientsLengthHyphen=0;
export interface ICommentCardProps {
  siteUrl?: string;
  userDisplayName?: string;
  listName?: string;
  itemID?: number;
  Context?: any;
  AllListId?: any;
  counter?: number;
  onHoldCallBack?: any;
  commentFor?: string;
  postCommentCallBack?: any;
}
const sp = spfi();
export interface ICommentCardState {
  Result: any;
  listName: string;
  itemID: number;
  listId: any
  CommenttoPost: string;
  updateComment: boolean;
  isModalOpen: boolean;
  isCalloutVisible: boolean;
  currentDataIndex: any;
  replyTextComment: any;
  AllCommentModal: boolean;
  mentionValue: string;
  ReplymentionValue: string;
  //editorState : EditorState;
  htmlContent: any;
  updateCommentPost: any;
  editorValue: string;
  ChildLevel: boolean;
  ReplyParent: any;
  buttonId: any;
  editorChangeValue: string;
  mailReply: any;
  postButtonHide: boolean;
  topCommenterShow: boolean;
  keyPressed: boolean;
  onHoldCallBack: any;
}
export class CommentCard extends React.Component<ICommentCardProps, ICommentCardState> {
  private taskUsers: any = [];
  private currentUser: any;
  private mentionUsers: any = [];
  private topCommenters: any = [];
  private params1: any;
  constructor(props: ICommentCardProps) {
    super(props);
    this.params1 = new URLSearchParams(window.location.search);
    this.state = {
      Result: {},
      // listName: (this.params1.get('Site') != undefined ? this.params1.get('Site') : props?.listName),
      listName: (props?.listName != undefined ? props?.listName : this.params1.get('Site') != undefined ? this.params1.get('Site') : null),
      // itemID: (this.params1.get('taskId') != undefined ? Number(this.params1.get('taskId')) : props?.itemID),
      itemID: (props?.itemID != undefined ? props?.itemID : this.params1.get('taskId') != undefined ? Number(this.params1.get('taskId')) : null),
      listId: props.AllListId.listId,
      onHoldCallBack: props.onHoldCallBack,
      CommenttoPost: '',
      updateComment: false,
      isCalloutVisible: false,
      currentDataIndex: 0,
      replyTextComment: "",
      isModalOpen: false,
      AllCommentModal: false,
      mentionValue: '',
      ReplymentionValue: '',
      buttonId: '',
      topCommenterShow: false,
      mailReply: { isMailReply: false, Index: null, },
      postButtonHide: false,
      keyPressed: false,
      /*editorState:EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('').contentBlocks
        )
      ),*/
      //editorState:EditorState.createEmpty(),
      htmlContent: '',
      updateCommentPost: null,
      editorValue: '',
      ChildLevel: false,
      ReplyParent: {},
      editorChangeValue: '',
    }
    this.GetResult();
    console.log(this.props.Context);
    const sp = spfi().using(spSPFx(this.context));
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
  }
  private async GetResult() {
    let web = new Web(this.props.siteUrl);
    let taskDetails = [];
    try {
      if (this.state.listName != undefined && this.state.listName != null && this.state.listName != "") {
        if (this.state.listName == "Master Tasks") {
          taskDetails = await web.lists
            .getByTitle(this.state.listName)
            .items
            .getById(this.state.itemID)
            .select("ID", "Title", "DueDate", "ComponentLink", "PriorityRank", "PortfolioType/Id", "PortfolioType/Title", "Categories", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "Sitestagging", "Editor/Title", "Modified", "Comments")
            .expand("TeamMembers", "Author", "ResponsibleTeam", "PortfolioType", "Editor")
            .get()
        } else {
          taskDetails = await web.lists
            .getByTitle(this.state.listName)
            .items
            .getById(this.state.itemID)
            .select("ID", "Title", "DueDate", "ComponentLink", "PriorityRank", "TaskCategories/Id", "TaskCategories/Title", "PortfolioType/Id", "PortfolioType/Title", "ClientCategory/Id", "ClientCategory/Title", "Project/Id", "Project/Title", "Project/PriorityRank", "Categories", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "Sitestagging", "Portfolio/Id", "Portfolio/Title", "Portfolio/PortfolioStructureID", "Editor/Title", "Modified", "Comments")
            .expand("TeamMembers", "Author", "ClientCategory", "ResponsibleTeam", "PortfolioType", "Portfolio", "Editor", "Project", "TaskCategories")
            .get()
        }
      } else {
        taskDetails = await web.lists.getById(this.state.listId).items.getById(this.state.itemID).select("ID", "Title", "ComponentLink", "PriorityRank", "DueDate", "TaskCategories/Id", "TaskCategories/Title", "Project/Id", "Project/Title", "Project/PriorityRank", "PortfolioType/Id", "PortfolioType/Title", "ClientCategory/Id", "ClientCategory/Title", "Categories", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "Sitestagging", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "Portfolio/Id", "Portfolio/Title", "Portfolio/PortfolioStructureID", "Editor/Title", "Modified", "Comments")
          .expand("TeamMembers", "Author", "ClientCategory", "ResponsibleTeam", "Portfolio", "PortfolioType", "Editor", "Project", "TaskCategories")
          .get()
      }
    } catch (e) {
      console.log(e)
    }
    if (this?.state?.Result?.ID == undefined)
      
      await this.GetTaskUsers(taskDetails);
    console.log("this is result function")
    //this.currentUser = this.GetUserObject(this.props.Context.pageContext.user.displayName);
    Title = taskDetails["Title"];
    if (taskDetails.PriorityRank == undefined || taskDetails.PriorityRank == null || taskDetails.PriorityRank == 0) {
      if (taskDetails.Priority != undefined) {
        if (taskDetails.Priority == "(3) Low") {
          taskDetails.PriorityRank = 1;
        }
        if (taskDetails.Priority == "(2) Normal") {
          taskDetails.PriorityRank = 4;
        }
        if (taskDetails.Priority == "(1) High") {
          taskDetails.PriorityRank = 8;
        }
      }
    }
    // taskDetails.SmartPriority;
    // taskDetails.TaskTypeValue = '';
    // taskDetails.projectPriorityOnHover = '';
    // taskDetails.taskPriorityOnHover = taskDetails?.PriorityRank;
    // taskDetails.showFormulaOnHover;
    taskDetails.SmartPriority = globalCommon?.calculateSmartPriority(taskDetails);
    try {
      let tempTask = {
        ID: 'T' + taskDetails["ID"],
        TaskId: globalCommon.GetTaskId(taskDetails),
        Title: taskDetails["Title"],
        SmartPriority: taskDetails["SmartPriority"],
        ComponentLink: taskDetails["ComponentLink"],
        Portfolio: taskDetails["Portfolio"],
        DueDate: taskDetails["DueDate"] != null ? (new Date(taskDetails["DueDate"])).toLocaleDateString() : '',
        Categories: taskDetails["Categories"],
        StartDate: taskDetails["StartDate"] != null ? (new Date(taskDetails["StartDate"])).toLocaleDateString() : '',
        CompletedDate: taskDetails["CompletedDate"] != null ? (new Date(taskDetails["CompletedDate"])).toLocaleDateString() : '',
        Status: taskDetails["Status"],
        TeamLeader: taskDetails["ResponsibleTeam"] != null ? this.GetUserObjectFromCollection(taskDetails["ResponsibleTeam"]) : null,
        TeamMembers: taskDetails["TeamMembers"] != null ? this.GetUserObjectFromCollection(taskDetails["TeamMembers"]) : null,
        PercentComplete: taskDetails["PercentComplete"],
        Priority: taskDetails["Priority"],
        Created: taskDetails["Created"] != null ? (new Date(taskDetails["Created"])).toLocaleDateString() : '',
        Modified: taskDetails["Modified"] != null ? (new Date(taskDetails["Modified"])).toLocaleDateString() : '',
        ModifiedBy: this.GetUserObjectArr(taskDetails["Editor"]),
        Author: this.GetUserObjectArr(taskDetails["Author"]),
        component_url: taskDetails["component_x0020_link"],
        Comments: this?.state?.Result != undefined && this?.state?.Result?.Comments != undefined ? this?.state?.Result?.Comments : JSON.parse(taskDetails["Comments"]),
        FeedBack: JSON.parse(taskDetails["FeedBack"]),
        PortfolioType: taskDetails["PortfolioType"],
        TaskUrl: `${this.props.siteUrl}/SitePages/Task-Profile.aspx?taskId=${this.state.itemID}&Site=${this.state.listName}`
      };
      if (tempTask["PortfolioType"] != undefined && tempTask["PortfolioType"] == "Service") {
        color = true;
      }
      if (this?.state?.Result?.ID == undefined) {
        if (tempTask["Comments"] != undefined && tempTask["Comments"].length > 0) {
          commentlength = tempTask?.Comments?.length;
        }
        if (tempTask["Comments"] != undefined && tempTask["Comments"].length > 0) {
          tempTask["Comments"]?.map((item: any) => {
            if (item?.AuthorImage != undefined && item?.AuthorImage.toLowerCase().indexOf('https://www.hochhuth-consulting.de/') > -1) {
              var imgurl = item.AuthorImage.split('https://www.hochhuth-consulting.de/')[1];
              // item.AuthorImage = `${this.props.Context._pageContext._site.absoluteUrl}` + imgurl;
              item.AuthorImage = 'https://hhhhteams.sharepoint.com/sites/HHHH/' + imgurl;
            }
            // item.AuthorImage = user.Item_x0020_Cover !=undefined ?user.Item_x0020_Cover.Url:item.AuthorImage;
            // })
            // this.taskUsers.map((user: any) => {
            //   if (user.AssingedToUser !=undefined && user.AssingedToUser.Id === item.AuthorId)
            //     item.AuthorImage = user.Item_x0020_Cover !=undefined ?user.Item_x0020_Cover.Url:item.AuthorImage;
            // })
          })
          tempTask["Comments"].sort(function (a: any, b: any) {
            // let keyA = a.ID,
            //   keyB = b.ID;
            let keyA = new Date(a.Created),
              keyB = new Date(b.Created);
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
        }
      }
      this.setState({
        Result: tempTask
      });
    } catch (e) { console.log(e) }

  }
  private GetUserObjectFromCollection(UsersValues: any) {
    console.log("this is GetUserObjectFromCollection function")
    let userDeatails = [];
    if (UsersValues != undefined && UsersValues.length > 0 && this.taskUsers != undefined && this.taskUsers.length > 0) {
      for (let index = 0; index < UsersValues.length; index++) {
        let senderObject = this.taskUsers?.filter(function (user: any, i: any) {
          if (user.AssingedToUser != undefined) {
            return user?.AssingedToUser['Title'] == UsersValues[index]?.Title
          }
        });
        if (senderObject.length > 0) {
          userDeatails.push({
            'Id': senderObject[0]?.Id,
            'Name': senderObject[0]?.AssingedToUser?.EMail,
            'Suffix': senderObject[0]?.Suffix,
            'Title': senderObject[0]?.Title,
            'userImage': senderObject[0]?.Item_x0020_Cover?.Url,
            "Item_x0020_Cover":senderObject[0]?.Item_x0020_Cover,
            "AssingedToUser":senderObject[0]?.AssingedToUser
            
          })
        }
      }
      return userDeatails;
    }
  }

  private async commentCardNotificationConfig() {
    try {
      let recipientData: any = await globalCommon.LoadAllNotificationConfigrations("CommentCardNotification", this.props.AllListId)
      return recipientData;
    }
    catch (error) {
      console.log(error)
    }
  }

  private async GetTaskUsers(taskDetails:any) {
    console.log("this is GetTaskUsers function")
    let web = new Web(this.props.siteUrl);
    let currentUser = await web.currentUser?.get();
    let emailRecipients = await this.commentCardNotificationConfig()
    emailRecipientsLengthHyphen=emailRecipients?.length;
    //.then((r: any) => {  
    // console.log("Cuurent User Name - " + r['Title']);  
    //}); 
    let taskUsers = [];
    taskUsers = await web.lists.getById(this.props?.AllListId?.TaskUserListID).items.select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'UserGroup/Id', 'UserGroup/Title').filter("ItemType eq 'User'").expand('AssingedToUser', 'UserGroup').get();
    taskUsers = taskUsers?.filter((User: any) => User?.UserGroup == undefined || User?.UserGroup?.Title != "Ex Staff")
    this.taskUsers = taskUsers;
    
    let  Author:any= this.GetUserObjectArr(taskDetails["Author"])
     
    let ResponsibleTeam:any = taskDetails["ResponsibleTeam"] != null ? this.GetUserObjectFromCollection(taskDetails["ResponsibleTeam"]) : null
    let TeamMembers:any = taskDetails["TeamMembers"] != null ? this.GetUserObjectFromCollection(taskDetails["TeamMembers"]) : null;
   
   

    if (emailRecipients != undefined && emailRecipients.length > 0) {
      if(emailRecipients?.every((dupl:any)=>dupl.AssingedToUser?.Id  !=Author?.AssingedToUser?.Id)){
        emailRecipients?.push(Author);
      }
     
       if(ResponsibleTeam?.length>0){
        ResponsibleTeam?.map((resp:any)=>{
         
          if(emailRecipients?.every((dupl:any)=>dupl?.AssingedToUser?.Id !=resp?.AssingedToUser?.Id)){
            emailRecipients.push(resp)
          }
          })
        }
       if(TeamMembers?.length>0){
        TeamMembers?.map((team:any)=>{
          if(emailRecipients?.every((dupl:any)=>dupl?.AssingedToUser?.Id  !=team?.AssingedToUser?.Id)){
            emailRecipients.push(team)
          }
        })
       }
      emailRecipients.forEach((recipient: any) => {
        this.taskUsers.forEach((user: any) => {
          if (recipient.Id == user.AssingedToUserId) {
            recipient.Item_x0020_Cover = user.Item_x0020_Cover
          }
         })
        return recipient;
      })
      for (let index = 0; index < emailRecipients.length; index++) {
        this.topCommenters.push({
          id: emailRecipients[index].Title + "{" + emailRecipients[index]?.Email + "}",
          display: emailRecipients[index].Title,
          Title: emailRecipients[index].Title,
          ItemCoverURL: (emailRecipients[index].Item_x0020_Cover != undefined) ?
            emailRecipients[index].Item_x0020_Cover?.Url :
            null,
          
        })
      }
    }
    else {
      for (let index = 0; index < this.taskUsers.length; index++) {
        if (this.taskUsers[index].Title == "Deepak Trivedi" || this.taskUsers[index].Title == "Stefan Hochhuth" || this.taskUsers[index].Title == "Robert Ungethuem" || this.taskUsers[index].Title == "Mattis Hahn" || this.taskUsers[index].Title == "Prashant Kumar") {
          this.topCommenters.push({
            id: this.taskUsers[index].Title + "{" + this.taskUsers[index]?.AssingedToUser?.EMail + "}",
            display: this.taskUsers[index].Title,
            Title: this.taskUsers[index].Title,
            ItemCoverURL: (this.taskUsers[index].Item_x0020_Cover != undefined) ?
              this.taskUsers[index].Item_x0020_Cover.Url :
              null
          })
        }
      }
      if(this.topCommenters?.every((dupl:any)=>dupl.AssingedToUser?.Id  !=Author?.AssingedToUser?.Id)){
        this.topCommenters?.push(Author);
      }
     
       if(ResponsibleTeam?.length>0){
        ResponsibleTeam?.map((resp:any)=>{
        if(this.topCommenters?.every((dupl:any)=>dupl?.AssingedToUser?.Id !=resp?.AssingedToUser?.Id)){
            this.topCommenters.push(resp)
          }
          })
        }
       if(TeamMembers?.length>0){
        TeamMembers?.map((team:any)=>{
          if(this.topCommenters?.every((dupl:any)=>dupl?.AssingedToUser?.Id  !=team?.AssingedToUser?.Id)){
            this.topCommenters.push(team)
          }
        })
       }
    }

    if (this.taskUsers != undefined && this.taskUsers.length > 0) {
      for (let index = 0; index < this.taskUsers.length; index++) {
        this.mentionUsers.push({
          id: this.taskUsers[index].Title + "{" + this.taskUsers[index]?.AssingedToUser?.EMail + "}",
          display: this.taskUsers[index].Title
        });
        if (this.taskUsers[index].AssingedToUser != null && this.taskUsers[index].AssingedToUser.Title == currentUser['Title'])
          this.currentUser = this.taskUsers[index];
      }
      console.log(this.topCommenters);
      console.log(this.mentionUsers);
    }
  }
  private handleInputChange(e: any) {
    this.setState({ CommenttoPost: e.target.value });
  }
  private async PostComment(txtCommentControlId: any) {
    await this.GetResult();
    this.setState({
      postButtonHide: true
    })
    console.log("this is post comment function")
    console.log(this.state.Result["Comments"])
    commentlength = commentlength + 1;
    let txtComment = this.state.CommenttoPost;
    if (this.state?.replyTextComment != undefined && this.state?.replyTextComment != '')
      txtComment = this.state.replyTextComment;
    if (txtComment != '') {
      let temp = {
        AuthorImage: this.currentUser?.Item_x0020_Cover != null ? this.currentUser?.Item_x0020_Cover?.Url : '',
        AuthorName: this.currentUser?.Title != null ? this.currentUser['Title'] : this.props.Context.pageContext._user.displayName,
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        MsTeamCreated: moment(new Date()).format('MM/DD/YYYY, hh:mm A'),
        Description: txtComment,
        Header: this.GetMentionValues(this.state.mentionValue),
        ID: this.state.Result["Comments"] != undefined ? this.state.Result["Comments"].length + 1 : 1,
        Title: txtComment,
        editable: false,
        CommentFor: this.props.commentFor ? this.props.commentFor : ''
      };
      if (this.state?.ChildLevel == true) {
        this.state?.Result?.Comments?.forEach((element: any) => {
          if (element.isReplyMsg == true && element?.ReplyMessages != undefined) {
            temp.ID = element?.ReplyMessages != undefined ? element?.ReplyMessages.length + 1 : 1;
            temp.Header = this.GetMentionValues(this.state.ReplymentionValue);
          }
        });
      }
      //Add object in feedback
      let isPushOnRoot: any = true
      if (this.state.Result["Comments"] != undefined) {
        // if(this.state.mailReply.isMailReply && this.state.mailReply.index!=null){
        //   if( this.state.Result["Comments"][ this.state.mailReply.index].replyData!=undefined&&  this.state.Result["Comments"][ this.state.mailReply.index].replyData.length>0){
        //     this.state.Result["Comments"][ this.state.mailReply.index].replyData.push(temp)
        //   }else{
        //     this.state.Result["Comments"][ this.state.mailReply.index].replyData=[]
        //     this.state.Result["Comments"][ this.state.mailReply.index].replyData.push(temp)
        //   }
        // }else{
        if (this.state?.Result != undefined && this.state?.Result?.Comments != undefined && this.state?.Result?.Comments?.length > 0) {
          this.state?.Result?.Comments?.forEach((element: any) => {
            if (element.isReplyMsg == true && element?.ReplyMessages != undefined) {
              element?.ReplyMessages.push(temp);
              element.isReplyMsg = false;
              isPushOnRoot = false;
            }
          });
        }
        if (isPushOnRoot != false)
          this.state.Result["Comments"].push(temp);
        // }
      }
      else {
        this.state.Result["Comments"] = [temp];
      }
      this.state.Result["Comments"].sort(function (a: any, b: any) {
        let keyA = a.ID,
          keyB = b.ID;
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      console.log(this.state.Result);
      (document.getElementById(txtCommentControlId) as HTMLTextAreaElement).value = '';
      let web = new Web(this.props.siteUrl);
      if (this.state.listName != null) {
        await web.lists.getByTitle(this.state.listName)
          .items
          .getById(this.state.itemID).update({
            Comments: JSON.stringify(this.state.Result["Comments"])
          });
      }
      else {
        await web.lists.getById(this.state.listId)
          .items
          .getById(this.state.itemID).update({
            Comments: JSON.stringify(this.state.Result["Comments"])
          });
      }

      if (isPushOnRoot != false)
        this.setState({ updateComment: true }, () => this.GetEmailObjects(txtComment, this.state.mentionValue));
      else
        this.setState({ updateComment: true }, () => this.GetEmailObjects(txtComment, this.state.ReplymentionValue));
      this.setState({
        updateComment: true,
        CommenttoPost: '',
        replyTextComment: '',
        mentionValue: '',
        ReplymentionValue: '',
        mailReply: { isMailReply: false, index: null, },
        postButtonHide: false,
        topCommenterShow: true
      });
    } else {
      alert('Please input some text.')
    }
  }
  private async updateComment() {
    let updateCommentPost = this.state.updateCommentPost;
    //let txtComment = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    let txtComment = this.state.editorChangeValue;
    if (txtComment != '') {
      let temp: any = {
        AuthorImage: this.currentUser?.Item_x0020_Cover != null ? this.currentUser?.Item_x0020_Cover?.Url : '',
        AuthorName: this.currentUser?.Title != null ? this.currentUser?.Title : this.props.Context.pageContext._user.displayName,
        MsTeamCreated: updateCommentPost?.MsTeamCreated,
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Description: txtComment,
        Header: updateCommentPost.Header,
        ID: updateCommentPost.ID,
        Title: txtComment,
        editable: false,
        CommentFor: updateCommentPost?.CommentFor
      };
      if ("ReplyMessages" in updateCommentPost) {
        temp.ReplyMessages = updateCommentPost?.ReplyMessages
      }
      //Add object in feedback
      //delete the value before add new value
      let elementPosition = 0;
      try {
        if (this.state?.ChildLevel != undefined && this.state?.ChildLevel == true) {
          for (let index = 0; index < this.state.Result["Comments"].length; index++) {
            if (this.state.Result["Comments"][index]?.["ReplyMessages"] != undefined && this.state.Result["Comments"][index]?.["ReplyMessages"].length > 0) {
              for (let Childindex = 0; Childindex < this.state.Result["Comments"][index]?.["ReplyMessages"].length; Childindex++) {
                let elementId = this.state.Result["Comments"][index]?.["ReplyMessages"][Childindex].ID;
                if (elementId == temp.ID) {
                  elementPosition = Childindex;
                  this.state.Result["Comments"][index]?.ReplyMessages.splice(elementPosition, 1);
                  if (this.state?.Result["Comments"][index]?.ReplyMessages != undefined) {
                    this.state?.Result["Comments"][index]?.ReplyMessages.unshift(temp);
                  }
                  else {
                    this.state.Result["Comments"][index]["ReplyMessages"] = [temp];
                  }
                  break;
                }
                // this.state?.Result["Comments"][index]["ReplyMessages"]?.sort(function (a: any, b: any) {
                //   let keyA = a.ID,
                //     keyB = b.ID;
                //   // Compare the 2 dates
                //   if (keyA < keyB) return 1;
                //   if (keyA > keyB) return -1;
                //   return 0;
                // });
              }
            }
            //delete this.state.Result["Comments"][elementPosition];
          }
          //Add new value in 
        }
        else {
          for (let index = 0; index < this.state.Result["Comments"].length; index++) {
            let elementId = this.state.Result["Comments"][index].ID;
            if (elementId == temp.ID) {
              elementPosition = index;
              break;
            }
          }
          //delete this.state.Result["Comments"][elementPosition];
          this.state.Result["Comments"].splice(elementPosition, 1);
          //Add new value in 
          if (this.state.Result["Comments"] != undefined) {
            this.state.Result["Comments"].push(temp);
          }
          else {
            this.state.Result["Comments"] = [temp];
          }
        }
      } catch (e) { console.log(e) }
      this.state.Result["Comments"].sort(function (a: any, b: any) {
        let keyA = a.ID,
          keyB = b.ID;
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      console.log(this.state.Result);
      let web = new Web(this.props.siteUrl);
      const i = await web.lists.getByTitle(this.state.listName)
        .items
        .getById(this.state.itemID).update({
          Comments: JSON.stringify(this.state.Result["Comments"])
        });
      this.setState({
        updateComment: true,
        updateCommentPost: null,
        isModalOpen: false,
        ChildLevel: false,
      });
    } else {
      alert('Please input some text.')
    }
  }
  private GetMentionValues(MentionedValue: any) {
    let mention_str = '';
    if (MentionedValue != '') {
      let allMention: any;
      if (this.state.mailReply.isMailReply) {
        var mentionEmail = this.mentionUsers.filter((items: any) => {
          if (items.display == MentionedValue) {
            return items
          }
        })
        let regExpStr = `@[${MentionedValue}](${mentionEmail[0]?.id})`;
        let regExpLiteral = /\[(.*?)\]/gi;
        allMention = regExpStr.match(regExpLiteral);
      } else {
        let regExpStr = MentionedValue;
        let regExpLiteral = /\[(.*?)\]/gi;
        allMention = regExpStr.match(regExpLiteral);
      }

      if (allMention.length > 0) {
        for (let index = 0; index < allMention.length; index++) {
          mention_str += allMention[index].replace('[', '@').replace(']', '').trim() + ' ';
        }
      }
    }
    return mention_str.trim();
  }
  private GetUserObjectArr(username: any) {
    let userDeatails = { 'Id': '', 'Name': '', 'Suffix': '', 'Title': '', 'userImage': '','Item_x0020_Cover':{} ,'AssingedToUser':{}};
    if (username != undefined && this.taskUsers != undefined && this.taskUsers.length > 0) {
      let senderObject = this.taskUsers?.filter(function (user: any, i: any) {
        if (user.AssingedToUser != undefined) {
          return user.AssingedToUser['Title'] == username.Title //|| user.AssingedToUser['Title'] == "SPFx Developer1"
        }
        else {
          return user.Title == username.Title
        }
      });
      if (senderObject.length > 0) {
        userDeatails.Id = senderObject[0]?.Id;
        userDeatails.Name = senderObject[0]?.AssingedToUser?.EMail;
        userDeatails.Suffix = senderObject[0].Suffix;
        userDeatails.Title = senderObject[0].Title;
        userDeatails.userImage = senderObject[0]?.Item_x0020_Cover?.Url,
        userDeatails.Item_x0020_Cover=senderObject[0]?.Item_x0020_Cover,
        userDeatails.AssingedToUser=senderObject[0]?.AssingedToUser
      }
      return userDeatails;
    }
  }
  private GetUserObject(username: any) {
    let userDeatails = {};
    if (username != undefined && this.taskUsers != undefined && this.taskUsers.length > 0) {
      let senderObject = this.taskUsers.filter(function (user: any, i: any) {
        if (user.AssingedToUser != undefined) {
          return user.AssingedToUser['Title'] == username
        }
      });
      if (senderObject.length > 0) {
        userDeatails = {
          'Id': senderObject[0].Id,
          'Name': senderObject[0]?.AssingedToUser?.EMail,
          'Suffix': senderObject[0].Suffix,
          'Title': senderObject[0].Title,
          'userImage': senderObject[0]?.Item_x0020_Cover?.Url
        }
      }
      return userDeatails;
    }
  }
  private async clearComment(indexOfDeleteElement: any, ItemLevel: any, parentIndex: any) {
    if (confirm('Are you sure, you want to delete this?')) {
      if (ItemLevel != undefined && ItemLevel != '' && ItemLevel == 'childLevel')
        this.state.Result["Comments"][parentIndex]?.ReplyMessages.splice(indexOfDeleteElement, 1);
      else
        this.state.Result["Comments"].splice(indexOfDeleteElement, 1);
      let web = new Web(this.props.siteUrl);
      const i = await web.lists.getByTitle(this.state.listName)
        .items
        .getById(this.state.itemID).update({
          Comments: JSON.stringify(this.state.Result["Comments"])
        });
      this.setState({
        updateComment: true
      });
    }
  }
  private openEditModal(cmdData: any, indexOfDeleteElement: any, ItemLevel: any) {
    this.setState({
      isModalOpen: true,
      editorValue: cmdData.Description?.replace(/\n/g, '<br>'),
      ChildLevel: ItemLevel,
      updateCommentPost: cmdData
    })
  }
  private openAllCommentModal() {
    this.setState({
      AllCommentModal: true
    })
  }
  private closeAllCommentModal(e: any) {
    e.preventDefault();
    this.setState({
      AllCommentModal: false
    })
  }
  //close the model
  private CloseModal(e: any) {
    e.preventDefault();
    this.setState({
      isModalOpen: false,
      ChildLevel: false,
      ReplyParent: {}
      /*editorState : EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('').contentBlocks
        )
      )*/
      //editorState: EditorState.createEmpty()
    });
  }
  private topCommentersClick(e: any) {
    console.log(e.currentTarget.className);
    if (e.currentTarget?.className?.indexOf('active') < 0) {
      e.currentTarget?.classList?.add('active');
      this.setState({
        mentionValue: this.state.mentionValue + '@[' + e.currentTarget?.title + '](' + e.currentTarget?.id + ') '
      }, () => { console.log(this.state.mentionValue) })
    } if (this.state.topCommenterShow == true) {
      e.currentTarget?.classList?.remove('active');
      e.currentTarget?.classList?.add('active');
      this.setState({
        mentionValue: this.state.mentionValue + '@[' + e.currentTarget?.title + '](' + e.currentTarget?.id + ') ',
        topCommenterShow: false
      }, () => { console.log(this.state.mentionValue) })
    }
  }
  private setMentionValue(e: any) {
    try {
      const matches = e.target.value.split("@[")
      this.topCommenters?.map((topCmnt: any, i: any) => {
        const element = document.getElementById(topCmnt?.id);
        if (element)
          element.classList.remove("active");
        if (matches) {
          matches?.map((Email: any) => {
            if (Email != undefined)
              Email = Email?.trim()
            if (Email != undefined && Email != '' && (topCmnt?.id.toLowerCase().indexOf(Email?.trim()?.toLowerCase()) > -1 || Email.toLowerCase().indexOf(topCmnt?.id?.trim()?.toLowerCase()) > -1)) {
              if (element) {
                element.classList.add("active");
              }
            }
          })
        }
      })

    } catch (e) {
      console.log(e)
    }
    if (this.state?.Result != undefined && this.state?.Result?.Comments != undefined && this.state?.Result?.Comments?.length > 0) {
      this.state?.Result?.Comments?.forEach((element: any) => {
        element.isReplyMsg = false;
      });
    }
    this.setState({
      mentionValue: e.target.value,
      ChildLevel: false,
    }, () => { console.log(this.state.mentionValue) })
  }
  private isDecimal = (value: any) => {
    return /^\d*\.?\d+$/.test(value);
  }


  private ReduceTheContentLines: any = (Content: String, sliceFrom: number) => {
    if (Content?.length > sliceFrom) {
        let NewContent: string = Content.slice(0, sliceFrom);
        return NewContent + "..."
    } else {
        return Content;
    }
  }

  private async GetEmailObjects(txtComment: any, MentionedValue: any) {
    if (MentionedValue != '') {
      //Get All To's
      var allMention: any;
      let mention_To: any = [];
      if (this.state.mailReply.isMailReply) {
        var mentionEmail = this.mentionUsers.filter((items: any) => {
          if (items.display == MentionedValue) {
            return items
          }
        })
        let regExpStr = `@[${MentionedValue}](${mentionEmail[0].id})`;
        let regExpLiteral = /\{(.*?)\}/gi;
        allMention = regExpStr.match(regExpLiteral);
      } else {
        let regExpStr = MentionedValue;
        let regExpLiteral = /\{(.*?)\}/gi;
        allMention = regExpStr.match(regExpLiteral);
      }

      if (allMention.length > 0) {
        for (let index = 0; index < allMention.length; index++) {
          /*For Prod when mail is open for all */
          if (allMention[index].indexOf(null) < 0) {
            mention_To.push(allMention[index].replace('{', '').replace('}', '').trim());
          }
          /*testing*/
          /*if (allMention[index].indexOf('mitesh.jha@hochhuth-consulting.de') > 0 || allMention[index].indexOf('ranu.trivedi@hochhuth-consulting.de') > 0) {
            mention_To.push(allMention[index].replace('{', '').replace('}', '').trim());
          }*/
        }
        console.log(mention_To);
        if (mention_To.length > 0) {
          let emailprops = {
            To: mention_To,
            Subject: "[" + this.params1.get('Site') + " - Comment by " + this.props.Context.pageContext?.user?.displayName + "] " + this.state.Result["Title"],
            Body: this.state.Result["Title"]
          }
          console.log(emailprops);
          let TeamMsg = ''
          let MsgURL = `${this.props.siteUrl}/SitePages/Task-Profile.aspx?taskId=${this.state.itemID}&Site=${this.state.listName}`
          let MsgTitle = `${this.state?.Result?.TaskId}-${this.state?.Result?.Title}`
          if (window.location.href.toLowerCase().indexOf('project-management-profile.aspx?projectid=') > -1) {
            MsgURL = `${this.props.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${this.state.itemID}`
            MsgTitle = `${this.state?.Result?.Title}`
          }
          if (window.location.href.toLowerCase().indexOf('portfolio-profile.aspx?taskid=') > -1) {
            MsgURL = `${this.props.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${this.state.itemID}`
            MsgTitle = `${this.state?.Result?.Title}`
          }
          // if (window.location.href.toLowerCase().indexOf('workbench.aspx?projectid=') > -1) {
          //   MsgURL = `${this.props.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${this.state.itemID}`
          //   MsgTitle = `${this.state?.Result?.Title}`
          // }
          this.state.Result["CommentsArray"] = this.state?.Result?.Comments;
          if (this.isDecimal(this.state?.Result?.PercentComplete))
            this.state.Result.PercentComplete = this.state?.Result?.PercentComplete * 100;
          const TaskInformation = await GlobalFunctionForUpdateItems.GenerateMSTeamsNotification(this.state?.Result)
          const containerDiv = document.createElement('div');
          const reactElement = React.createElement(TaskInformation?.type, TaskInformation?.props);
          ReactDOM.render(reactElement, containerDiv);
          let finalTaskInfo: any = containerDiv.innerHTML;
          const nameRegex = /@\[(.*?)\]/g; // Regular expression with 'g' flag to match globally
          const matches = [];
          let match;
          while ((match = nameRegex.exec(MentionedValue)) !== null) {
            matches.push(match[1]);
          }
          const combinedNames = matches.join(', ');
          let TeamsMessage = ''
          if (this.state?.ChildLevel == true) {
            if (this.state?.ReplyParent?.MsTeamCreated == undefined)
              this.state.ReplyParent.MsTeamCreated = ''
            const PreMsg = `
               Task Comment:<span style="background-color: yellow;" title="${this.state?.ReplyParent?.Description.replace(/<\/?[^>]+(>|$)/g, '')}">${this.ReduceTheContentLines(this.state?.ReplyParent?.Description.replace(/<\/?[^>]+(>|$)/g, ''), 450)}.</span>
              <p><br/></p>
              <p></p>
              Task Link: <a href=${MsgURL}>${this.state?.Result?.TaskId}-${this?.state?.Result?.Title}</a>
              <p></p>
              <span>${finalTaskInfo}</span>
             
          `;
            const CurrentMsg = `
              Task Comment:<span style="background-color: yellow;" title="${txtComment}">${this.ReduceTheContentLines(txtComment, 450)}.</span>
              <p><br/></p>
              Task Link: <a href=${MsgURL}>${this.state?.Result?.TaskId}-${this?.state?.Result?.Title}</a>
              <p></p>
              <span>${finalTaskInfo}</span>
              <p></p>
          `;
            TeamsMessage = `<blockquote>${this.state?.ReplyParent?.AuthorName} ${this.state?.ReplyParent?.MsTeamCreated} </br> ${PreMsg} </blockquote>${CurrentMsg}`;
          }
          else {
            TeamsMessage = `
          <div style="background-color: transparent; border-top: 5px solid #2f5596;">
            <div style="margin-bottom: 16px;"></div>
            <span> You have been tagged in comment in the below task. </span>
          <div style="background-color: #DFDFDF; padding:16px; margin-top:10px; color:#333; display:block;" title="${txtComment}">
          <b style="fontSize: 18px; fontWeight: 600; marginBottom: 8px;" >Comment</b>: <span>${this.ReduceTheContentLines(txtComment, 450)}</span>
          </div>
          <div style="margin-top: 16px;font-size:16px;">  <b style="font-weight:600; font-size:16px;">Task Link: </b>
            <a style="font-size:16px;" href="${MsgURL}">
                ${this.state?.Result?.TaskId}-${this?.state?.Result?.Title}
            </a>
          </div>
          <p></p>
          <span>${finalTaskInfo}</span> 
          </div>
          `;
          }


          await globalCommon.SendTeamMessage(mention_To, TeamsMessage, this.props.Context, this.props?.AllListId)
          //  this.SendEmail(emailprops);
          this.setState({
            ChildLevel: false,
            ReplyParent: {}
          });
        }
      }
    }
    if (this.props.commentFor?.length > 0) {
      this.state.onHoldCallBack("Save");
    }
  }
  private BindHtmlBody() {
    let body = document.getElementById('htmlMailBody')
    console.log(body?.innerHTML);
    return "<style>p>br {display: none;}</style>" + body?.innerHTML;
  }
  private SendEmail(emailprops: any) {
    let sp = spfi().using(spSPFx(this.props.Context))
    sp.utility.sendEmail({
      //Body of Email  
      Body: this.BindHtmlBody(),
      //Subject of Email  
      Subject: emailprops.Subject,
      //Array of string for To of Email  
      To: emailprops.To,
      AdditionalHeaders: {
        "content-type": "text/html"
      },
    }).then(() => {
      console.log("Email Sent!");
    });
  }
  /*private onEditorStateChange = (editorState:EditorState):void => { 
    console.log('set as HTML:', draftToHtml(convertToRaw(editorState.getCurrentContent()))); 
    this.setState({  
      editorState,  
    });  
  }*/
  private customHeaderforEditCommentpopup() {
    return (
      <>
        <div className={color ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
          <div className='subheading'>
            <span className="siteColor">
              Update Comment
            </span>
          </div>
          <Tooltip ComponentId="588" />
        </div>
      </>
    )
  }
  private customHeaderforALLcomments() {
    return (
      <div className={color ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1 "}>
        <div className='subheading'>
          <span className="siteColor">
            Comment : {Title} <span className='ms-1'>{`(${commentlength})`}</span>
          </span>
        </div>
        <Tooltip ComponentId="588" />
      </div>
    )
  }
  HtmlEditorStateChange = (value: any) => {
    this.setState({
      editorChangeValue: value,
    }, () => console.log(console.log('set as HTML:', value)));
  }
  private joinObjectValues(arr: any) {
    let val = '';
    if (arr != undefined && arr.length > 0) {
      arr?.forEach((element: any) => {
        val += element?.Title + ';'
      });
      return val;
    }
  }
  private replyMailFunction = (replyData: any, index: any) => {
    console.log(replyData)
    console.log(this.mentionUsers)
    //  var mentionEmail = this.mentionUsers.filter((items:any)=>{
    //  if(items.display==replyData.AuthorName){
    //     return items.id
    //  }
    //  }) 
    // var replyData2:any={
    //   isMailReply:true,
    //   index:index
    // } 
    if (replyData?.ReplyMessages == undefined)
      replyData.ReplyMessages = []
    replyData.isReplyMsg = true
    this.setState({
      mentionValue: replyData.AuthorName, ChildLevel: true, mailReply: { isMailReply: true, index: index, }
    }, () => { console.log(this.state.mentionValue) })
  }
  private openReplycommentPopup = (replyData: any, i: any) => {
    if (replyData.ReplyMessages == undefined) {
      replyData.ReplyMessages = [];
    }
    replyData.isReplyMsg = true;
    this.setState({
      buttonId: 'ReplyBtn' + i,  // Set buttonId
      ReplymentionValue: replyData.AuthorName,
      ReplyParent: replyData,
      ChildLevel: true,
      currentDataIndex: i,
      isCalloutVisible: true,
      mailReply: { isMailReply: true, index: i }
    }, () => {
      console.log(this.state.ReplymentionValue);
    });
  };

  private updateReplyMessagesFunction = (e: any) => {
    console.log(e.target.value)
    this.setState({
      replyTextComment: e.target.value
    })
  }
  private SaveReplyMessageFunction = () => {
    this.PostComment('txtComment')
    this.setState({
      buttonId: '',
      isCalloutVisible: false
    })
  }
  private CancelReplyPopup = () => {
    if (this.state?.Result != undefined && this.state?.Result?.Comments != undefined && this.state?.Result?.Comments?.length > 0) {
      this.state?.Result?.Comments?.forEach((element: any) => {
        element.isReplyMsg = false;
      });
    }
    this.setState({
      buttonId: '',
      replyTextComment: '',
      isCalloutVisible: false
    })
  }
  private handleKeyDown = (e: any) => {
    this.setState({ keyPressed: true });
  };
  private handleMouseClick = (e: any) => {
    this.setState({ keyPressed: false });
  };

  private detectAndRenderLinks = (html: any) => {

    const div = document.createElement('div');
    div.innerHTML = html;
    const paragraphs = div.querySelectorAll('p');
    // Filter out empty <p> tags
    paragraphs.forEach((p) => {
      if (p.innerText.trim() === '') {
        p.parentNode.removeChild(p); // Remove empty <p> tags
      }
    });
    div.innerHTML = div.innerHTML.replace(/\n/g, '<br>')  // Convert newlines to <br> tags first
    div.innerHTML = div.innerHTML.replace(/(?:<br\s*\/?>\s*)+(?=<\/?[a-z][^>]*>)/gi, '');

    const anchorTags = div.querySelectorAll('a');
  

    return globalCommon?.replaceURLsWithAnchorTags(div.innerHTML);
  };
  public render(): React.ReactElement<ICommentCardProps> {
    return (
      <div >
        <div className='mb-3 card commentsection boxshadow'>
          <div className='card-header'>
            <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Comments<span><Tooltip ComponentId='586' /></span></div>
          </div>
          <div className='card-body'>
            <div className="comment-box  mb-2">
              <div className='mb-2'>
                <span> <strong>To:</strong>  </span>
                {this.topCommenters != null && this.topCommenters.length > 0 && this.topCommenters?.map((topCmnt: any, i: any) => {
                 
                  return <>
                 
               {emailRecipientsLengthHyphen ==i?'-':""}
                  <span>
                    <a target="_blank">
                      {topCmnt?.ItemCoverURL != null || topCmnt?.Suffix != null ? <Avatar
                        onClick={(e) => this.topCommentersClick(e)}
                        className="UserImage workmember"
                        title={topCmnt?.Title}
                        name={topCmnt?.Title}
                        id={topCmnt?.id}
                        image={topCmnt?.ItemCoverURL != undefined ? {
                          src: topCmnt?.ItemCoverURL,
                        } : undefined}
                        initials={topCmnt?.ItemCoverURL == undefined ? topCmnt?.Suffix : undefined}
                      /> : <Avatar
                        onClick={(e) => this.topCommentersClick(e)}
                        className="UserImage"
                        id={topCmnt?.id}
                        title={topCmnt?.Title}
                        name={topCmnt?.Title}
                      />
                      }
                    </a>
                  </span>
                  
                  </>
                })}
              </div>
              {/* onKeyDown={this.handleKeyDown} onMouseDown={this.handleMouseClick} */}
              <span className='clintlist'>
                <MentionsInput placeholder='Recipients Name' value={this.state?.mentionValue ? this.state?.mentionValue : ""} onChange={(e) => this.setMentionValue(e)}
                  className="form-control"
                  classNames={mentionClass}>
                  <Mention trigger="@" data={this.mentionUsers} appendSpaceOnAdd={true} />
                  {/* {this.state.keyPressed && this.mentionUsers && this.state?.mentionValue ? 
                    <Mention trigger="" data={this.mentionUsers} appendSpaceOnAdd={true} />:
                    <Mention trigger="" data={[]} appendSpaceOnAdd={true} />
                  } */}
                </MentionsInput>
              </span>
            </div>
            <div>
              <textarea id='txtComment' value={this.state.CommenttoPost} onChange={(e) => this.handleInputChange(e)} placeholder="Enter your comments here" style={{ padding: '5px' }} className='form-control' ></textarea>
              {this.state.postButtonHide ?
                <button disabled onClick={() => this.PostComment('txtComment')} title="Post comment" type="button" className="btn btn-primary mt-2 my-1  float-end px-3">
                  Post
                </button> :
                <button onClick={() => this.PostComment('txtComment')} title="Post comment" type="button" className="btn btn-primary mt-2 my-1  float-end px-3">
                  Post
                </button>}
            </div>
            <div className="clearfix"></div>
            <div className="commentMedia">
              {this.state.Result["Comments"] != null && this.state.Result["Comments"] != undefined && this.state.Result["Comments"].length > 0 &&
                <div>
                  <ul className="list-unstyled">
                    {this.state.Result["Comments"] != null && this.state.Result["Comments"].length > 0 && this.state.Result["Comments"]?.slice(0, 3)?.map((cmtData: any, i: any) => {
                      return cmtData?.Description && <li className="media  p-1 my-1">
                        <div className="media-bodyy">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="comment-date ng-binding">
                              <span className="round  pe-1">
                                <img className="align-self-start " title={cmtData?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(this.props?.AllListId?.siteUrl, undefined, cmtData?.AuthorName, this?.taskUsers)}
                                  src={cmtData?.AuthorImage != undefined && cmtData?.AuthorImage != '' ?
                                    cmtData?.AuthorImage :
                                    "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                />
                              </span>
                              {cmtData.Created}</span>
                            <div className="d-flex ml-auto media-icons px-1 " >
                              <a onClick={() => this.openEditModal(cmtData, i, false)}>
                                {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" /> */}
                                <span className='svg__iconbox svg__icon--edit'></span>
                              </a>
                              <Popover
                                size="medium"
                                withArrow
                                open={this.state.buttonId == "ReplyBtn" + i}
                                onOpenChange={() => this.openReplycommentPopup(cmtData, i)}
                              >
                                <PopoverTrigger disableButtonEnhancement>
                                  <span className="svg__iconbox svg__icon--reply"></span>
                                </PopoverTrigger>
                                <PopoverSurface  className="a"  tabIndex={-1}>
                                   <div>
                                      <div className='subheading m-0' style={{ minWidth: '400px' }}>Comment Reply</div>
                                      <div className="my-2">
                                        <textarea className='w-100'  rows={3}
                                          value={this.state.replyTextComment}
                                          onChange={this.updateReplyMessagesFunction}
                                        ></textarea>
                                      </div>
                                    </div>
                                    <div className="footer text-end">
                                      <button className="btnCol btn me-2 btn-primary" onClick={this.SaveReplyMessageFunction}>Save</button>
                                      <button className="btnCol btn btn-default" onClick={this.CancelReplyPopup}>Cancel</button>
                                    </div>
                                
                                </PopoverSurface>
                              </Popover>
                              {/* <a onClick={() => this.replyMailFunction(cmtData, i)}><span><ImReply /></span></a> */}

                              <a title="Delete" onClick={() => this.clearComment(i, undefined, undefined)}>
                                {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/delete.gif" /> */}
                                <span className='svg__iconbox svg__icon--trash'></span>
                              </a>
                            </div>
                          </div>
                          <div className="media-text">
                            {cmtData.Header != '' && <h6 className="userid m-0"><a className="align-top">{cmtData?.Header}</a></h6>}
                            {/* <p className='m-0'>
                            <span dangerouslySetInnerHTML={{ __html: this.detectAndRenderLinks(cmtData?.Description) }}>
                            </span></p> */}
                            <span dangerouslySetInnerHTML={{ __html: this.detectAndRenderLinks(cmtData?.Description) }}></span>
                            {/* {this.detectAndRenderLinks(cmtData?.Description)} */}
                          </div>

                        </div>
                        {/* {cmtData?.replyData!=undefined&& cmtData?.replyData.length>0 && cmtData?.replyData?.map((replyerData:any)=>{
                          return(
                            <li className="media  p-1 my-1">
                            <div className="media-bodyy">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="comment-date ng-binding">
                                <span className="round  pe-1">
                                  <img className="align-self-start " title={replyerData?.AuthorName}
                                    src={replyerData?.AuthorImage != undefined && replyerData?.AuthorImage != '' ?
                                    replyerData?.AuthorImage :
                                      "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                  />
                                </span>
                                {replyerData.Created}</span>
                              <div className="d-flex ml-auto media-icons ">
                                <a onClick={()=>this.replyMailFunction(replyerData,i)}><span className="svg__icon--mailreply svg__iconbox"></span></a>
                                <a  onClick={() => this.openEditModal(replyerData, i)}>                      
                                  <span className='svg__iconbox svg__icon--edit'></span>                           
                                </a>
                                <a title="Delete" onClick={() => this.clearComment(i)}>                             
                                  <span className='svg__iconbox svg__icon--trash'></span>
                                </a>
                              </div>
                            </div>
                            <div className="media-text">
                              {replyerData.Header != '' && <h6 className="userid m-0"><a className="ng-binding">{replyerData?.Header}</a></h6>}
                              <p className='m-0'><span dangerouslySetInnerHTML={{ __html: replyerData?.Description }}></span></p>
                            </div>
                          </div>
                          </li>
                          )
                        })} */}
                        <div className="commentMedia">
                          {cmtData?.ReplyMessages != null && cmtData?.ReplyMessages != undefined && cmtData?.ReplyMessages?.length > 0 &&
                            <div>
                              <ul className="list-unstyled subcomment">
                                {cmtData?.ReplyMessages != null && cmtData?.ReplyMessages?.length > 0 && cmtData?.ReplyMessages?.map((ReplyMsg: any, j: any) => {
                                  return <li className="media  p-1 my-1">
                                    <div className="media-bodyy">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="comment-date ng-binding">
                                          <span className="round  pe-1">
                                            <img className="align-self-start hreflink " title={ReplyMsg?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(this.props?.AllListId?.siteUrl, undefined, ReplyMsg?.AuthorName, this?.taskUsers)}
                                              src={ReplyMsg?.AuthorImage != undefined && ReplyMsg?.AuthorImage != '' ?
                                                ReplyMsg?.AuthorImage :
                                                "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                            />
                                          </span>
                                          {/* {ReplyMsg?.AuthorName} - */}{ReplyMsg?.Created}</span>
                                        <div className="d-flex ml-auto media-icons ">
                                          {/* <a onClick={() => this.replyMailFunction(ReplyMsg, j)}><span><ImReply /></span></a> */}
                                          <a onClick={() => this.openEditModal(ReplyMsg, j, true)}>
                                            <span className='svg__iconbox svg__icon--edit'></span>
                                          </a>
                                          <a title="Delete" onClick={() => this.clearComment(j, 'childLevel', i)}>
                                            <span className='svg__iconbox svg__icon--trash'></span>
                                          </a>
                                        </div>
                                      </div>
                                      <div className="media-text">
                                        {/* {ReplyMsg.Header != '' && <h6 className="userid m-0"><a className="ng-binding">{ReplyMsg?.Header}</a></h6>} */}
                                        {/* <p className='m-0'><span dangerouslySetInnerHTML={{ __html: ReplyMsg?.Description }}></span></p> */}
                                        <span dangerouslySetInnerHTML={{ __html: this.detectAndRenderLinks(ReplyMsg?.Description) }}></span>
                                        {/* {this.detectAndRenderLinks(ReplyMsg?.Description)} */}
                                      </div>
                                    </div>
                                  </li>
                                })}
                              </ul>
                            </div>
                          }
                        </div></li>
                    })}
                  </ul>
                  {this.state.Result["Comments"] != null && this.state.Result["Comments"].length > 3 &&
                    <div className="MoreComments ng-hide">
                      <a className="MoreComments ng-binding ng-hide" title="Click to Reply" onClick={() => this.openAllCommentModal()}>
                        All Comments ({this.state.Result["Comments"]?.length})
                      </a>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
        <Panel isOpen={this.state.isModalOpen} isBlocking={false}
          type={PanelType.custom}
          customWidth="500px"
          onRenderHeader={this.customHeaderforEditCommentpopup}
          onDismiss={(e) => this.CloseModal(e)}
        > <div className={color ? "serviepannelgreena" : ""}>
            <div className='modal-body updateComment'>
              <HtmlEditorCard editorValue={this.state.editorValue} HtmlEditorStateChange={this.HtmlEditorStateChange}></HtmlEditorCard>
            </div>
            <footer className='text-end'>
              <button type="button" className="btn btn-primary mx-2 mt-2" onClick={(e) => this.updateComment()} >Save</button>
              <button type="button" className="btn btn-default mt-2 " onClick={(e) => this.CloseModal(e)}>Cancel</button>
            </footer>
          </div>
        </Panel>
        <Panel
          onRenderHeader={this.customHeaderforALLcomments}
          type={PanelType.custom}
          customWidth="500px"
          onDismiss={(e) => this.closeAllCommentModal(e)}
          isOpen={this.state.AllCommentModal}
          isBlocking={false}>
          <div id='ShowAllCommentsId' className={color ? "serviepannelgreena" : ""}>
            <div className='modal-body mt-2'>
              <div className="col-sm-12 " id="ShowAllComments">
                <div className="col-sm-12">
                  <div className="row d-flex mb-2">
                    <div>
                      <textarea id="txtCommentModal" onChange={(e) => this.handleInputChange(e)} className="form-control p-1 ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required ui-autocomplete-input" rows={2} ng-required="true" style={{ padding: '5px' }} placeholder="Enter your comments here" ng-model="Feedback.comment"></textarea>
                      <span role="status" aria-live="polite" className="ui-helper-hidden-accessible"></span>
                    </div>
                    <div className='text-end mt-1'> <span className='btn btn-primary hreflink' onClick={() => this.PostComment('txtCommentModal')} >Post</span></div>
                  </div>
                  <ul className="list-unstyled">
                    {this.state.Result["Comments"] != null && this.state.Result["Comments"]?.length > 0 && this.state.Result["Comments"]?.map((cmtData: any, i: any) => {
                      return cmtData?.Description && <li className="media  p-1 my-1">
                        <div className="media-bodyy">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="comment-date ng-binding">
                              <span className="round  pe-1">
                                <img className="align-self-start " title={cmtData?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(this.props?.AllListId?.siteUrl, undefined, cmtData?.AuthorName, this?.taskUsers)}
                                  src={cmtData?.AuthorImage != undefined && cmtData?.AuthorImage != '' ?
                                    cmtData?.AuthorImage :
                                    "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                />
                              </span>
                              {cmtData.Created}</span>
                            <div className="d-flex ml-auto media-icons px-1 " >

                              <a onClick={() => this.openEditModal(cmtData, i, false)}>
                                {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" /> */}
                                <span className='svg__iconbox svg__icon--edit'></span>
                              </a>

                              {/*  <a ><div data-toggle="tooltip" id={"Reply-" + i}
                             onClick={() => this.openReplycommentPopup(cmtData, i)} data-placement="bottom"  >
                                <span className="svg__iconbox svg__icon--reply"></span>
                              </div></a> */}
                              {/* <Popover
                                size="medium"
                                withArrow
                                open={this.state.buttonId == "ReplyBtn" + i}
                                onOpenChange={() => this.openReplycommentPopup(cmtData, i)}
                              >
                                <PopoverTrigger disableButtonEnhancement>
                                  <span className="svg__iconbox svg__icon--reply"></span>
                                </PopoverTrigger>
                                <PopoverSurface  className="a"  tabIndex={-1}>
                                   <div>
                                      <div className='subheading m-0' style={{ minWidth: '400px' }}>Comment Reply</div>
                                      <div className="my-2">
                                        <textarea className='w-100'  rows={3}
                                          value={this.state.replyTextComment}
                                          onChange={this.updateReplyMessagesFunction}
                                        ></textarea>
                                      </div>
                                    </div>
                                    <div className="footer text-end">
                                      <button className="btnCol btn me-2 btn-primary" onClick={this.SaveReplyMessageFunction}>Save</button>
                                      <button className="btnCol btn btn-default" onClick={this.CancelReplyPopup}>Cancel</button>
                                    </div>
                                
                                </PopoverSurface>
                              </Popover> */}

                              {/* <a onClick={() => this.replyMailFunction(cmtData, i)}><span><ImReply /></span></a> */}
                              <a title="Delete" onClick={() => this.clearComment(i, undefined, undefined)}>
                                {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/delete.gif" /> */}
                                <span className='svg__iconbox svg__icon--trash'></span>
                              </a>

                            </div>
                          </div>
                          <div className="media-text">
                            {cmtData.Header != '' && <h6 className="userid m-0"><a className="align-top">{cmtData?.Header}</a></h6>}
                            {/* <p className='m-0'>
                        <span dangerouslySetInnerHTML={{ __html: this.detectAndRenderLinks(cmtData?.Description) }}>
                        </span></p> */}
                            <span dangerouslySetInnerHTML={{ __html: this.detectAndRenderLinks(cmtData?.Description) }}></span>
                            {/* {this.detectAndRenderLinks(cmtData?.Description)} */}
                          </div>

                        </div>
                        {/* {cmtData?.replyData!=undefined&& cmtData?.replyData.length>0 && cmtData?.replyData?.map((replyerData:any)=>{
                      return(
                        <li className="media  p-1 my-1">
                        <div className="media-bodyy">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="comment-date ng-binding">
                            <span className="round  pe-1">
                              <img className="align-self-start " title={replyerData?.AuthorName}
                                src={replyerData?.AuthorImage != undefined && replyerData?.AuthorImage != '' ?
                                replyerData?.AuthorImage :
                                  "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                              />
                            </span>
                            {replyerData.Created}</span>
                          <div className="d-flex ml-auto media-icons ">
                            <a onClick={()=>this.replyMailFunction(replyerData,i)}><span className="svg__icon--mailreply svg__iconbox"></span></a>
                            <a  onClick={() => this.openEditModal(replyerData, i)}>                      
                              <span className='svg__iconbox svg__icon--edit'></span>                           
                            </a>
                            <a title="Delete" onClick={() => this.clearComment(i)}>                             
                              <span className='svg__iconbox svg__icon--trash'></span>
                            </a>
                          </div>
                        </div>
                        <div className="media-text">
                          {replyerData.Header != '' && <h6 className="userid m-0"><a className="ng-binding">{replyerData?.Header}</a></h6>}
                          <p className='m-0'><span dangerouslySetInnerHTML={{ __html: replyerData?.Description }}></span></p>
                        </div>
                      </div>
                      </li>
                      )
                    })} */}
                        <div className="commentMedia">
                          {cmtData?.ReplyMessages != null && cmtData?.ReplyMessages != undefined && cmtData?.ReplyMessages?.length > 0 &&
                            <div>
                              <ul className="list-unstyled subcomment">
                                {cmtData?.ReplyMessages != null && cmtData?.ReplyMessages?.length > 0 && cmtData?.ReplyMessages?.map((ReplyMsg: any, j: any) => {
                                  return <li className="media  p-1 my-1">
                                    <div className="media-bodyy">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="comment-date ng-binding">
                                          <span className="round  pe-1">
                                            <img className="align-self-start hreflink " title={ReplyMsg?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(this.props?.AllListId?.siteUrl, undefined, ReplyMsg?.AuthorName, this?.taskUsers)}
                                              src={ReplyMsg?.AuthorImage != undefined && ReplyMsg?.AuthorImage != '' ?
                                                ReplyMsg?.AuthorImage :
                                                "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                            />
                                          </span>
                                          {/* {ReplyMsg?.AuthorName} - */}{ReplyMsg?.Created}</span>
                                        <div className="d-flex ml-auto media-icons ">
                                          {/* <a onClick={() => this.replyMailFunction(ReplyMsg, j)}><span><ImReply /></span></a> */}
                                          <a onClick={() => this.openEditModal(ReplyMsg, j, true)}>
                                            <span className='svg__iconbox svg__icon--edit'></span>
                                          </a>
                                          <a title="Delete" onClick={() => this.clearComment(j, 'childLevel', i)}>
                                            <span className='svg__iconbox svg__icon--trash'></span>
                                          </a>
                                        </div>
                                      </div>
                                      <div className="media-text">
                                        {/* {ReplyMsg.Header != '' && <h6 className="userid m-0"><a className="ng-binding">{ReplyMsg?.Header}</a></h6>} */}
                                        {/* <p className='m-0'><span dangerouslySetInnerHTML={{ __html: ReplyMsg?.Description }}></span></p> */}
                                        <span dangerouslySetInnerHTML={{ __html: this.detectAndRenderLinks(ReplyMsg?.Description) }}></span>
                                        {/* {this.detectAndRenderLinks(ReplyMsg?.Description)} */}
                                      </div>
                                    </div>
                                  </li>
                                })}
                              </ul>
                            </div>
                          }
                        </div></li>
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <footer className='text-end'>
              <button type="button" className="btn btn-default" onClick={(e) => this.closeAllCommentModal(e)}>Cancel</button>
            </footer>
          </div>
        </Panel>
        {
          this.state.Result != null && this.state.Result?.Comments != null && this.state.Result?.Comments.length > 0 &&
          <div id='htmlMailBody' style={{ display: 'none' }}>
            <div style={{ marginTop: "11.25pt" }}>
              <a href={this.state.Result?.TaskUrl} target="_blank">{this.state.Result?.Title}</a></div>
            <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
              <tbody>
                <tr>
                  <td width="70%" valign="top" style={{ width: '70.0%', padding: '4pt' }}>
                    <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                      <tbody>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Task Id:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["ID"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Portfolio:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}>{this.state.Result["PortfolioType"] != null || this.state.Result["PortfolioType"] != undefined &&

                              <span style={{ fontSize: '10.0pt', color: 'black' }}>
                                {this.joinObjectValues(this.state.Result["PortfolioType"])}
                              </span>
                            }
                            </p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Priority:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result?.Priority}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Start Date:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result?.StartDate}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result?.CompletedDate}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result?.DueDate}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Team Members:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}>{this.state.Result["TeamMembers"] != null &&
                              this.state.Result["TeamMembers"].length > 0 &&
                              <span style={{ fontSize: '10.0pt', color: 'black' }}>
                                {this.joinObjectValues(this.state.Result?.TeamMembers)}
                              </span>
                            }
                            </p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["StartDate"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["Author"] != null && this.state.Result["Author"] != '' && this.state.Result["Author"].Title}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Categories:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["Categories"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Status:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["Status"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{(this.state.Result["PercentComplete"] * 100).toFixed(0)}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b></p>
                          </td>
                          <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>
                              {this.state.Result["component_url"] != null &&
                                <a href={this.state.Result["component_url"].Url} target="_blank">{this.state.Result["component_url"].Url}</a>
                              }</span></p>
                          </td>
                          <td style={{ padding: '4pt' }}></td>
                        </tr>
                      </tbody>
                    </table>
                    <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '4pt' }}></td>
                        </tr>
                        {this.state.Result["FeedBack"] != null &&
                          this.state.Result["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                          this.state.Result["FeedBack"][0]?.FeedBackDescriptions[0]?.Title != '' &&
                          this.state.Result["FeedBack"][0]?.FeedBackDescriptions?.map((fbData: any, i: any) => {
                            return <>
                              <tr>
                                <td style={{ border: "1px solid #ccc", padding: "0px 2px 0px 10px" }}>
                                  <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}</span></p>
                                </td>
                                <td style={{ background: "#fbfbfb", border: "1px solid #ccc", padding: "0px 2px 0px 10px" }}><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
                                  {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments']?.map((fbComment: any) => {
                                    return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt', marginBottom: '5pt' }}>
                                      <div style={{ marginBottom: '3.75pt' }}>
                                        <p style={{ marginLeft: '1.5pt' }}>Comment by <span>{fbComment?.AuthorName} - {fbComment?.Created}</span></p>
                                      </div>
                                      <p style={{ marginLeft: '1.5pt' }}><span><span dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span></span></p>
                                    </div>
                                  })}
                                </td>
                              </tr>
                              {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                                return <>
                                  <tr>
                                    <td style={{ border: "1px solid #ccc", padding: "0px 2px 0px 10px" }}>
                                      <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}.{j + 1}.</span></p>
                                    </td>
                                    <td style={{ background: "#fbfbfb", border: "1px solid #ccc", padding: "0px 2px 0px 10px" }}><span dangerouslySetInnerHTML={{ __html: fbSubData['Title'] }}></span>
                                      {fbSubData['Comments'] != null && fbSubData['Comments'].length > 0 && fbSubData['Comments']?.map((fbSubComment: any) => {
                                        return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt', marginBottom: '5pt' }}>
                                          <div style={{ marginBottom: '3.75pt' }}>
                                            <p style={{ marginLeft: '1.5pt' }}>Comment by<span style={{ fontSize: '10.0pt', color: 'black' }}>{fbSubComment?.AuthorName} - {fbSubComment?.Created}</span></p>
                                          </div>
                                          <p style={{ marginLeft: '1.5pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }}><span dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span></span></p>
                                        </div>
                                      })}
                                    </td>
                                  </tr>
                                </>
                              })}
                            </>
                          })}
                      </tbody>
                    </table>
                  </td>
                  <td width="22%" valign="top" style={{ width: '22.0%', padding: '4pt' }}>
                    <table cellPadding={0} cellSpacing={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px' }}>
                      <tbody>
                        <tr>
                          <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: 'whitesmoke', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ color: "#333333" }}>Comments:</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'none', padding: '4pt' }}>
                            {this.state.Result["Comments"]?.map((cmtData: any, i: any) => {
                              return <div style={{ border: 'solid #cccccc 1.0pt', padding: '4pt', marginTop: '0pt', marginBottom: '4pt' }}>
                                <div style={{ marginBottom: "3.75pt" }}>
                                  <p style={{ margin: '0pt' }}>
                                    <span style={{ color: 'black' }}>{cmtData?.AuthorName} - {cmtData?.Created}</span></p>
                                </div>
                                <p style={{ marginBottom: '4pt' }}>
                                  <span style={{ color: 'black' }}>{cmtData?.Description}</span></p>
                              </div>
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      </div >
    );
  }
}
export default CommentCard;