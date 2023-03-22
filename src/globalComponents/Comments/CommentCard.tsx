import * as React from 'react';
import { Web } from "sp-pnp-js";

/*
import 'setimmediate'; 
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw,Modifier, ContentState, convertFromHTML } from 'draft-js';  
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html'; 
*/
import { MentionsInput, Mention } from 'react-mentions';
import mentionClass from './mention.module.scss';
import Tooltip from '../Tooltip';
import "@pnp/sp/sputilities";
import * as moment from "moment-timezone";
import HtmlEditorCard from '../HtmlEditor/HtmlEditor';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { getSP } from '../../spservices/pnpjsConfig';
import { spfi, SPFx as spSPFx } from "@pnp/sp";
let color:any=false;
let Title:any="";
let commentlength:any=0
export interface ICommentCardProps {
  siteUrl?: string;
  userDisplayName?: string;
  listName?: string;
  itemID?: number;
  Context?: any;

}
const sp = spfi();

export interface ICommentCardState {
  Result: any;
  listName: string;
  itemID: number;
  CommenttoPost: string;
  updateComment: boolean;
  isModalOpen: boolean;
  AllCommentModal: boolean;
  mentionValue: string;
  //editorState : EditorState;
  htmlContent: any;
  updateCommentPost: any;
  editorValue: string;
  editorChangeValue: string;
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
      listName: (this.params1.get('Site') != undefined ? this.params1.get('Site') : props.listName),
      itemID: (this.params1.get('taskId') != undefined ? Number(this.params1.get('taskId')) : props.itemID),

      CommenttoPost: '',
      updateComment: false,
      isModalOpen: false,
      AllCommentModal: false,
      mentionValue: '',
      /*editorState:EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('').contentBlocks
        )
      ),*/
      //editorState:EditorState.createEmpty(),
      htmlContent: '',
      updateCommentPost: null,
      editorValue: '',
      editorChangeValue: ''
    }
    this.GetResult();
    console.log(this.props.Context);
    // sp.setup({
    //   spfxContext: this.props.Context
    // });
    const sp = spfi().using(spSPFx(this.context));
  }

  private async GetResult() {
    let web = new Web(this.props.siteUrl);
    let taskDetails = [];
    taskDetails = await web.lists
      .getByTitle(this.state.listName)
      .items
      .getById(this.state.itemID)
      .select("ID", "Title", "DueDate","Portfolio_x0020_Type", "ClientCategory/Id", "ClientCategory/Title", "Categories", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Editor/Title", "Modified", "Comments")
      .expand("Team_x0020_Members", "Author", "ClientCategory", "Responsible_x0020_Team", "SharewebTaskType", "Component", "Services", "Editor")
      .get()

    await this.GetTaskUsers();

    //this.currentUser = this.GetUserObject(this.props.Context.pageContext.user.displayName);
    Title=taskDetails["Title"];
    let tempTask = {
      ID: 'T' + taskDetails["ID"],
      Title: taskDetails["Title"],
      DueDate: taskDetails["DueDate"] != null ? (new Date(taskDetails["DueDate"])).toLocaleDateString() : '',
      Categories: taskDetails["Categories"],
      StartDate: taskDetails["StartDate"] != null ? (new Date(taskDetails["StartDate"])).toLocaleDateString() : '',
      CompletedDate: taskDetails["CompletedDate"] != null ? (new Date(taskDetails["CompletedDate"])).toLocaleDateString() : '',
      Status: taskDetails["Status"],
      TeamLeader: taskDetails["Responsible_x0020_Team"] != null ? this.GetUserObjectFromCollection(taskDetails["Responsible_x0020_Team"]) : null,
      TeamMembers: taskDetails["Team_x0020_Members"] != null ? this.GetUserObjectFromCollection(taskDetails["Team_x0020_Members"]) : null,
      PercentComplete: (taskDetails["PercentComplete"] * 100),
      Priority: taskDetails["Priority"],
      Created: taskDetails["Created"] != null ? (new Date(taskDetails["Created"])).toLocaleDateString() : '',
      Modified: taskDetails["Modified"] != null ? (new Date(taskDetails["Modified"])).toLocaleDateString() : '',
      ModifiedBy: this.GetUserObjectArr(taskDetails["Editor"]),
      Author: this.GetUserObjectArr(taskDetails["Author"]),
      component_url: taskDetails["component_x0020_link"],
      Comments: JSON.parse(taskDetails["Comments"]),
      FeedBack: JSON.parse(taskDetails["FeedBack"]),
      SharewebTaskType: taskDetails["SharewebTaskType"] != null ? taskDetails["SharewebTaskType"].Title : '',
      Component: taskDetails["Component"],
      Services: taskDetails["Services"],
      Portfolio_x0020_Type:taskDetails["Portfolio_x0020_Type"],
      TaskUrl: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + this.state.itemID + "&Site=" + this.state.listName
    };
    if(tempTask["Portfolio_x0020_Type"]!=undefined&&tempTask["Portfolio_x0020_Type"]=="Service"){
      color=true;
    }
    if(tempTask["Comments"]!=undefined&&tempTask["Comments"].length>0){
      commentlength=tempTask.Comments.length;
    }
    
    if (tempTask["Comments"] != undefined && tempTask["Comments"].length > 0) {
      tempTask["Comments"].map((item: any) => {
        if (item.AuthorImage != undefined && item.AuthorImage.toLowerCase().indexOf('https://www.hochhuth-consulting.de/') > -1) {
          var imgurl = item.AuthorImage.split('https://www.hochhuth-consulting.de/')[1];
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

    this.setState({
      Result: tempTask
    });
  }

  private GetUserObjectFromCollection(UsersValues: any) {
    let userDeatails = [];
    for (let index = 0; index < UsersValues.length; index++) {
      let senderObject = this.taskUsers.filter(function (user: any, i: any) {
        if (user.AssingedToUser != undefined) {
          return user.AssingedToUser['Title'] == UsersValues[index].Title
        }
      });
      if (senderObject.length > 0) {
        userDeatails.push({
          'Id': senderObject[0].Id,
          'Name': senderObject[0].Email,
          'Suffix': senderObject[0].Suffix,
          'Title': senderObject[0].Title,
          'userImage': senderObject[0]?.Item_x0020_Cover?.Url
        })
      }
    }
    return userDeatails;
  }


  private async GetTaskUsers() {
    let web = new Web(this.props.siteUrl);
    let currentUser = await web.currentUser.get();
    //.then((r: any) => {  
    // console.log("Cuurent User Name - " + r['Title']);  
    //}); 
    let taskUsers = [];
    taskUsers = await web.lists
      .getByTitle('Task Users')
      .items
      .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail')
      .filter("ItemType eq 'User'")
      .expand('AssingedToUser')
      .get();
    this.taskUsers = taskUsers;

    for (let index = 0; index < this.taskUsers.length; index++) {
      this.mentionUsers.push({
        id: this.taskUsers[index].Title + "{" + this.taskUsers[index].Email + "}",
        display: this.taskUsers[index].Title
      });

      if (this.taskUsers[index].Title == "Deepak Trivedi" || this.taskUsers[index].Title == "Stefan Hochhuth" || this.taskUsers[index].Title == "Robert Ungethuem" || this.taskUsers[index].Title == "Mattis Hahn"||this.taskUsers[index].Title=="Ksenia Kozhukhar"||this.taskUsers[index].Title=="Mayank Pal") {
        this.topCommenters.push({
          id: this.taskUsers[index].Title + "{" + this.taskUsers[index].Email + "}",
          display: this.taskUsers[index].Title,
          Title: this.taskUsers[index].Title,
          ItemCoverURL: (this.taskUsers[index].Item_x0020_Cover != undefined) ?
            this.taskUsers[index].Item_x0020_Cover.Url :
            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"
        })
      }

      if (this.taskUsers[index].AssingedToUser != null && this.taskUsers[index].AssingedToUser.Title == currentUser['Title'])
        this.currentUser = this.taskUsers[index];
    }
    console.log(this.topCommenters);
    console.log(this.mentionUsers);
  }

  private handleInputChange(e: any) {
    this.setState({ CommenttoPost: e.target.value });
  }

  private async PostComment(txtCommentControlId: any) {
    commentlength=commentlength+1;
    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {
      let temp = {
        AuthorImage: this.currentUser['Item_x0020_Cover'] != null ? this.currentUser['Item_x0020_Cover']['Url'] : '',
        AuthorName: this.currentUser['Title'] != null ? this.currentUser['Title'] : '',
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Description: txtComment,
        Header: this.GetMentionValues(),
        ID: this.state.Result["Comments"] != undefined ? this.state.Result["Comments"].length + 1 : 1,
        Title: txtComment,
        editable: false
      };
      //Add object in feedback

      if (this.state.Result["Comments"] != undefined) {
        this.state.Result["Comments"].push(temp);
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
      const i = await web.lists.getByTitle(this.state.listName)
        .items
        .getById(this.state.itemID).update({
          Comments: JSON.stringify(this.state.Result["Comments"])
        });
      this.setState({
        updateComment: true
      }, () => this.GetEmailObjects());

      this.setState({
        updateComment: true,
        CommenttoPost: '',
        mentionValue: ''
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
      let temp = {
        AuthorImage: this.currentUser['Item_x0020_Cover'] != null ? this.currentUser['Item_x0020_Cover']['Url'] : '',
        AuthorName: this.currentUser['Title'] != null ? this.currentUser['Title'] : '',
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Description: txtComment,
        Header: updateCommentPost.Header,
        ID: updateCommentPost.ID,
        Title: txtComment,
        editable: false
      };
      //Add object in feedback

      //delete the value before add new value
      let elementPosition = 0;
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
        isModalOpen: false
      });
    } else {
      alert('Please input some text.')
    }

  }

  private GetMentionValues() {
    let mention_str = '';
    if (this.state.mentionValue != '') {
      let regExpStr = this.state.mentionValue;
      let regExpLiteral = /\[(.*?)\]/gi;
      let allMention = regExpStr.match(regExpLiteral);
      if (allMention.length > 0) {
        for (let index = 0; index < allMention.length; index++) {
          mention_str += allMention[index].replace('[', '@').replace(']', '').trim() + ' ';
        }
      }
    }
    return mention_str.trim();
  }

  private GetUserObjectArr(username: any) {
    let userDeatails = [];
    let senderObject = this.taskUsers.filter(function (user: any, i: any) {
      if (user.AssingedToUser != undefined) {
        return user.AssingedToUser['Title'] == username.Title //|| user.AssingedToUser['Title'] == "SPFx Developer1"
      }
      else {
        return user.Title == username.Title
      }
    });
    if (senderObject.length > 0) {
      userDeatails.push({
        'Id': senderObject[0].Id,
        'Name': senderObject[0].Email,
        'Suffix': senderObject[0].Suffix,
        'Title': senderObject[0].Title,
        'userImage': senderObject[0]?.Item_x0020_Cover?.Url
      })
    }
    return userDeatails;
  }

  private GetUserObject(username: any) {
    let userDeatails = {};
    let senderObject = this.taskUsers.filter(function (user: any, i: any) {
      if (user.AssingedToUser != undefined) {
        return user.AssingedToUser['Title'] == username
      }

    });
    if (senderObject.length > 0) {
      userDeatails = {
        'Id': senderObject[0].Id,
        'Name': senderObject[0].Email,
        'Suffix': senderObject[0].Suffix,
        'Title': senderObject[0].Title,
        'userImage': senderObject[0]?.Item_x0020_Cover?.Url
      }
    }
    return userDeatails;
  }

  private async clearComment(indexOfDeleteElement: any) {
    if (confirm('Are you sure, you want to delete this?')) {
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
  private openEditModal(cmdData: any, indexOfDeleteElement: any) {
    this.setState({
      isModalOpen: true,
      editorValue: cmdData.Description,
      /*editorState : EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML('<p>'+cmdData.Description+'</p>').contentBlocks
        )
      ),*/
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
    if (e.currentTarget.className.indexOf('active') < 0) {
      e.currentTarget.classList.add('active');
      this.setState({
        mentionValue: this.state.mentionValue + '@[' + e.currentTarget.title + '](' + e.currentTarget.id + ') '
      }, () => { console.log(this.state.mentionValue) })
    }

  }

  private setMentionValue(e: any) {
    this.setState({
      mentionValue: e.target.value
    }, () => { console.log(this.state.mentionValue) })
  }

  private GetEmailObjects() {

    if (this.state.mentionValue != '') {
      //Get All To's
      let mention_To: any = [];
      let regExpStr = this.state.mentionValue;
      let regExpLiteral = /\{(.*?)\}/gi;
      let allMention = regExpStr.match(regExpLiteral);
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
            Subject: "[" + this.params1.get('Site') + " - Comment by " + this.props.Context.pageContext.user.displayName + "] " + this.state.Result["Title"],
            Body: this.state.Result["Title"]
          }
          console.log(emailprops);

          this.SendEmail(emailprops);

        }
      }
    }
  }

  private BindHtmlBody() {
    let body = document.getElementById('htmlMailBody')
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
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
      // <div className={(this.state?.Result?.Portfolio_x0020_Type!=undefined&&this.state?.Result?.Portfolio_x0020_Type=="Service")?"d-flex full-width pb-1 serviepannelgreena":"d-flex full-width pb-1"}>
      //   <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
          
      //     <span className="siteColor">
      //       Update Comment
      //     </span>
      //   </div>
      //   <Tooltip ComponentId="588" />
      // </div>
      <>
   <div className={color?"d-flex full-width pb-1 serviepannelgreena":"d-flex full-width pb-1"}>
        <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
          
          <span className="siteColor">
            Update Comment
          </span>
        </div>
        <Tooltip ComponentId="588" />
      </div>
      </>

    )
  }
  private customHeaderforALLcomments(){
    return (
      <div className={color?"d-flex full-width pb-1 serviepannelgreena":"d-flex full-width pb-1 "}>
        <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
          
          <span className="siteColor">
          Comment:{Title}{commentlength}
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
    arr.forEach((element: any) => {
      val += element.Title + ';'
    });
    return val;
  }

  public render(): React.ReactElement<ICommentCardProps> {
    //const { editorState } = this.state;
    return (
      <div >
        <div className='mb-3 card commentsection'>
          <div className='card-header'>
            {/* <div className='card-actions float-end'>  <Tooltip /></div> */}
            <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Comments<span><Tooltip ComponentId='586' /></span></div>

          </div>
          <div className='card-body'>
            <div className="comment-box  mb-2">
              <div className='mb-1'>
                <span> <strong>To:</strong>  </span>
                {this.topCommenters != null && this.topCommenters.length > 0 && this.topCommenters.map((topCmnt: any, i: any) => {
                  return <span>
                    <a target="_blank">
                      <img onClick={(e) => this.topCommentersClick(e)} className="circularImage rounded-circle " title={topCmnt.Title}
                        id={topCmnt.id} src={topCmnt.ItemCoverURL} />
                    </a>
                  </span>
                })}
              </div>

              <span className='clintlist'>
                <MentionsInput placeholder='Recipients Name' value={this.state.mentionValue ? this.state.mentionValue : ""} onChange={(e) => this.setMentionValue(e)}
                  className="form-control"
                  classNames={mentionClass}>
                  <Mention trigger="@" data={this.mentionUsers} appendSpaceOnAdd={true} />
                </MentionsInput>
              </span>

            </div>
            <div>
              <textarea id='txtComment' value={this.state.CommenttoPost} onChange={(e) => this.handleInputChange(e)} placeholder="Enter your comments here" className='form-control' ></textarea>
              {/* <p className="ng-hide">
                                            <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                                            Comment shouldn't be empty
                                        </p> */}
              <button onClick={() => this.PostComment('txtComment')} title="Post comment" type="button" className="btn btn-primary mt-2 my-1  float-end px-3">
                Post
              </button>
            </div>

            <div className="clearfix"></div>

            <div className="commentMedia">
              {this.state.Result["Comments"] != null && this.state.Result["Comments"].length > 0 &&
                <div>
                  <ul className="list-unstyled">
                    {this.state.Result["Comments"] != null && this.state.Result["Comments"].length > 0 && this.state.Result["Comments"].slice(0, 3).map((cmtData: any, i: any) => {
                      return <li className="media border p-1 my-1">

                        <div className="media-bodyy">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="comment-date ng-binding">
                              <span className="round  pe-1">
                                <img className="align-self-start " title={cmtData.AuthorName}
                                  src={cmtData.AuthorImage != undefined && cmtData.AuthorImage != '' ?
                                    cmtData.AuthorImage :
                                    "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                />
                              </span>
                              {cmtData.Created}</span>
                            <div className="ml-auto media-icons ">
                              <a className="mx-1" onClick={() => this.openEditModal(cmtData, i)}>
                                {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg>
                              </a>
                              <a title="Delete" onClick={() => this.clearComment(i)}>
                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/delete.gif" />
                              </a>
                            </div>
                          </div>

                          <div className="media-text">
                            {cmtData.Header != '' && <h6 className="userid m-0"><a className="ng-binding">{cmtData.Header}</a></h6>}
                            <p className='m-0'><span dangerouslySetInnerHTML={{ __html: cmtData.Description }}></span></p>
                          </div>

                        </div>
                      </li>
                    })}
                  </ul>
                  {this.state.Result["Comments"] != null && this.state.Result["Comments"].length > 3 &&
                    <div className="MoreComments ng-hide">
                      <a className="MoreComments ng-binding ng-hide" title="Click to Reply" onClick={() => this.openAllCommentModal()}>
                        All Comments({this.state.Result["Comments"].length})
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
          // headerText='Update Comment'
          onRenderHeader={this.customHeaderforEditCommentpopup }
          onDismiss={(e) => this.CloseModal(e)}
        >


          {/* <div> */}
            {/* <div className='modal-header mb-2'>
              <h3 className='modal-title'>Update Comment</h3>

              <span><Tooltip /> </span> <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => this.CloseModal(e)}></button>
            </div> */}
            <div className={color?"serviepannelgreena":""}>
            <div className='modal-body'>
              <HtmlEditorCard editorValue={this.state.editorValue} HtmlEditorStateChange={this.HtmlEditorStateChange}></HtmlEditorCard>
            </div>
            <footer className='text-end'>
              <button type="button" className="btn btn-primary mt-2" onClick={(e) => this.updateComment()} >Save</button>
              <button type="button" className="btn btn-default ms-2 mt-2 " onClick={(e) => this.CloseModal(e)}>Cancel</button>
            </footer>
            </div>
          {/* </div> */}

        </Panel>



        <Panel
          // headerText={`Comment:${this.state.Result["Title"]}(${this.state.Result["Comments"]?.length})`}
          onRenderHeader={this.customHeaderforALLcomments}
          type={PanelType.custom}
          customWidth="500px"
          onDismiss={(e) => this.closeAllCommentModal(e)}
          isOpen={this.state.AllCommentModal}
          isBlocking={false}>

          <div id='ShowAllCommentsId'className={color?"serviepannelgreena":""}>

            {/* <div className='modal-header mb-2'>
              {this.state.Result["Comments"] != undefined && this.state.Result["Comments"].length > 0 &&
                <h3 className='modal-title'></h3>
              }
             <span><Tooltip /> </span> <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => this.closeAllCommentModal(e)}></button>

            </div> */}
            <div className='modal-body mt-2'>
              <div className="col-sm-12 " id="ShowAllComments">
                <div className="col-sm-12">
                  <div className="row d-flex mb-2">
                    <div>
                      <textarea id="txtCommentModal" onChange={(e) => this.handleInputChange(e)} className="form-control ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required ui-autocomplete-input" rows={2} ng-required="true" placeholder="Enter your comments here" ng-model="Feedback.comment"></textarea>
                      <span role="status" aria-live="polite" className="ui-helper-hidden-accessible"></span>
                    </div>
                    <div className='text-end mt-1'> <a className=' btn btn-primary ' onClick={() => this.PostComment('txtCommentModal')} >Post</a></div>

                  </div>
                  {this.state.Result["Comments"] != null && this.state.Result["Comments"]?.length > 0 && this.state.Result["Comments"].map((cmtData: any, i: any) => {
                    return <div className="border p-1 mb-2">
                      <div>
                        <div className='d-flex justify-content-between align-items-center'>
                          <span className='comment-date'>
                            <span className='round  pe-1'> <img className='align-self-start me-1' style={{ height: '35px', width: '35px' }} title={cmtData.AuthorName}
                              src={cmtData.AuthorImage != undefined && cmtData.AuthorImage != '' ?
                                cmtData.AuthorImage :
                                "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                            />
                              {cmtData.Created}

                            </span>
                          </span>
                          <div className='ml-auto media-icons '>
                            <a className="hreflink me-1" onClick={() => this.openEditModal(cmtData, i)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg>
                            </a>
                            <a className="hreflink" title="Delete" onClick={() => this.clearComment(i)}>
                              <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/delete.gif" />
                             
                            </a>

                          </div>


                        </div>

                        <div className="media-text">
                          <h6 className='userid m-0 fs-6'>   {cmtData.Header != '' && <b>{cmtData.Header}</b>}</h6>
                          <p className='m-0' id="pageContent">  <span dangerouslySetInnerHTML={{ __html: cmtData.Description }}></span></p>
                        </div>
                      </div>
                    </div>
                  })}

                </div>

              </div>
            </div>
            <footer className='text-end'>

              <button type="button" className="btn btn-default" onClick={(e) => this.closeAllCommentModal(e)}>Cancel</button>
            </footer>

          </div>

        </Panel>

        {this.state.Result != null && this.state.Result["Comments"] != null && this.state.Result["Comments"].length > 0 &&
          <div id='htmlMailBody' style={{ display: 'none' }}>

            <div style={{ marginTop: "11.25pt" }}>
              <a href={this.state.Result["TaskUrl"]} target="_blank">{this.state.Result["Title"]}</a><u></u><u></u></div>
            <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
              <tbody>
                <tr>
                  <td width="70%" valign="top" style={{ width: '70.0%', padding: '.75pt .75pt .75pt .75pt' }}>
                    <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: ".75pt .75pt .75pt .75pt" }}></td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Task Id:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["ID"]}</span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Component:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p>{this.state.Result["Component"] != null &&
                              this.state.Result["Component"].length > 0 &&
                              <span style={{ fontSize: '10.0pt', color: 'black' }}>
                                {this.joinObjectValues(this.state.Result["Component"])}
                              </span>
                            }
                              <span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Priority:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["Priority"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Start Date:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["StartDate"]}</span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["CompletedDate"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["DueDate"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Team Members:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p>{this.state.Result["TeamMembers"] != null &&
                              this.state.Result["TeamMembers"].length > 0 &&
                              <span style={{ fontSize: '10.0pt', color: 'black' }}>
                                {this.joinObjectValues(this.state.Result["TeamMembers"])}
                              </span>
                            }
                              <span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["StartDate"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["Author"] != null && this.state.Result["Author"].length > 0 && this.state.Result["Author"][0].Title}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Categories:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["Categories"]}</span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Status:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["Status"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</span></b><u></u><u></u></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{this.state.Result["PercentComplete"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                          <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p><span style={{ fontSize: '10.0pt', color: 'black' }}>
                              {this.state.Result["component_url"] != null &&
                                <a href={this.state.Result["component_url"].Url} target="_blank">{this.state.Result["component_url"].Url}</a>
                              }</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                          </td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                        </tr>
                        <tr>
                          <td width="91" style={{ border: "none" }}></td>
                          <td width="46" style={{ border: "none" }}></td>
                          <td width="46" style={{ border: "none" }}></td>
                          <td width="100" style={{ border: "none" }}></td>
                          <td width="53" style={{ border: "none" }}></td>
                          <td width="51" style={{ border: "none" }}></td>
                          <td width="74" style={{ border: "none" }}></td>
                          <td width="32" style={{ border: "none" }}></td>
                          <td width="33" style={{ border: "none" }}></td>
                        </tr>
                      </tbody>
                    </table>
                    <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                        </tr>


                        {this.state.Result["FeedBack"] != null &&
                          this.state.Result["FeedBack"][0].FeedBackDescriptions.length > 0 &&
                          this.state.Result["FeedBack"][0].FeedBackDescriptions[0].Title != '' &&
                          this.state.Result["FeedBack"][0].FeedBackDescriptions.map((fbData: any, i: any) => {
                            return <>
                              <tr>
                                <td>
                                  <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}.<u></u><u></u></span></p>
                                </td>
                                <td><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
                                  {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments'].map((fbComment: any) => {
                                    return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                      <div style={{ marginBottom: '3.75pt' }}>
                                        <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span>{fbComment.AuthorName} - {fbComment.Created}<u></u><u></u></span></p>
                                      </div>
                                      <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span><span dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span><u></u><u></u></span></p>
                                    </div>

                                  })}
                                </td>
                              </tr>
                              {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext'].map((fbSubData: any, j: any) => {
                                return <>
                                  <tr>
                                    <td>
                                      <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}.{j + 1}.<u></u><u></u></span></p>
                                    </td>
                                    <td><span dangerouslySetInnerHTML={{ __html: fbSubData['Title'] }}></span>
                                      {fbSubData['Comments'] != null && fbSubData['Comments'].length > 0 && fbSubData['Comments'].map((fbSubComment: any) => {
                                        return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                          <div style={{ marginBottom: '3.75pt' }}>
                                            <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{fbSubComment.AuthorName} - {fbSubComment.Created}<u></u><u></u></span></p>
                                          </div>
                                          <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }}><span dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span><u></u><u></u></span></p>
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
                  <td width="22%" style={{ width: '22.0%', padding: '.75pt .75pt .75pt .75pt' }}>
                    <table cellPadding={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px' }}>
                      <tbody>
                        <tr>
                          <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: 'whitesmoke', padding: '.75pt .75pt .75pt .75pt' }}>
                            <p style={{ marginBottom: '1.25pt' }}><span style={{ color: "#333333" }}>Comments:<u></u><u></u></span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'none', padding: '.75pt .75pt .75pt .75pt' }}>
                            {this.state.Result["Comments"].map((cmtData: any, i: any) => {
                              return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                <div style={{ marginBottom: "3.75pt" }}>
                                  <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                                    <span style={{ color: 'black' }}>{cmtData.AuthorName} - {cmtData.Created}</span></p>
                                </div>
                                <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                                  <span style={{ color: 'black' }}>{cmtData.Description}</span></p>
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


      </div>
    );
  }
}

export default CommentCard;
