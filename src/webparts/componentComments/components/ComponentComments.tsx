import * as React from 'react';
import styles from './ComponentComments.module.scss';
import { IComponentCommentsProps } from './IComponentCommentsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "sp-pnp-js";
import '../../cssFolder/foundation.scss';
import '../../cssFolder/foundationmin.scss';
import './commentCustomStyle.scss'
import { Modal } from 'office-ui-fabric-react';

export interface IComponentCommentsState {  
  Result : any;
  listName : string;
  itemID : number;
  CommenttoPost : string;
  updateComment: boolean;
}

export default class ComponentComments extends React.Component<IComponentCommentsProps, IComponentCommentsState> {
  private taskUsers : any = [];
  private currentUser: any;
  public constructor(props:IComponentCommentsProps,state:IComponentCommentsState){
    super(props);
    const params = new URLSearchParams(window.location.search);    
    console.log(params.get('taskId'));
    console.log(params.get('Site'));

    this.state ={
      Result:{},
      listName: params.get('Site'),
      itemID : Number(params.get('taskId')),
      CommenttoPost: '',
      updateComment: false
    }
    this.GetResult();
  }

  private async GetResult() {
    let web = new Web(this.props.siteUrl);
    let taskDetails = [];    
    taskDetails = await web.lists
      .getByTitle(this.state.listName)
      .items
      .getById(this.state.itemID)
      .select("ID","Title","Comments")
      .get()
      
    console.log(taskDetails);
    await this.GetTaskUsers();

    this.currentUser = this.GetUserObject(this.props.userDisplayName);

    let tempTask = {      
      ID: 'T'+taskDetails["ID"],
      Title: taskDetails["Title"],      
      Comments: JSON.parse(taskDetails["Comments"])      
    };
    
    console.log(tempTask);
    
    this.setState({
      Result : tempTask
    });
  }

  private async GetTaskUsers(){
    let web = new Web(this.props.siteUrl);
    let taskUsers = [];    
    taskUsers = await web.lists
      .getByTitle('Task Users')
      .items
      .select('Id','Email','Suffix','Title','Item_x0020_Cover','AssingedToUser/Title')
      .expand('AssingedToUser')
      .get();    
    this.taskUsers = taskUsers;  

  }

  private handleInputChange(e:any){
    this.setState({CommenttoPost: e.target.value}); 
   }

  private async PostComment(){
    /*
    AuthorId: 225
    AuthorImage: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/ChetanChauhan.png"
    AuthorName: "Chetan Chauhan "
    Created: "08 Dec 2022 17:06"
    Description: "hello"
    Header: ""
    ID: 2
    Title: "hello"
    editable: false
    */
    let txtComment = this.state.CommenttoPost;
    if (txtComment != ''){
      let temp = {
        AuthorImage: this.currentUser['userImage'] != null ? this.currentUser['userImage'] : '', 
        AuthorName: this.currentUser['Title'] != null ? this.currentUser['Title'] : '', 
        Created: (new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })).replace(',',''),
        Description:txtComment,
        Header: "",
        ID: this.state.Result["Comments"].length + 1,
        Title: txtComment,
        editable: false
      };
      //Add object in feedback
      
      if (this.state.Result["Comments"] != undefined){
        this.state.Result["Comments"].push(temp);
      }
      else{
        this.state.Result["Comments"] = [temp];
      }   
      
      console.log(this.state.Result);
      
      (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
      /*
      let web = new Web(this.props.siteUrl);
      
      const i = await web.lists.getByTitle(this.state.listName)
              .items
              .getById(this.state.itemID).update({
                Comments: JSON.stringify(this.state.Result["FeedBack"])
              });
      */
      this.setState({ 
        updateComment: true
      });
      

    }else{
      alert('Please input some text.')
    }  
    
  }

  private GetUserObject(username:any){
    let userDeatails = {};
    let senderObject = this.taskUsers.filter(function (user:any, i:any){ 
      if (user.AssingedToUser != undefined){
        return user.AssingedToUser['Title'] == username
      }
      
    });
      if (senderObject.length > 0){
          userDeatails = {
            'Id' : senderObject[0].Id,
            'Name' : senderObject[0].Email,
            'Suffix' : senderObject[0].Suffix,
            'Title' : senderObject[0].Title,
            'userImage': senderObject[0].Item_x0020_Cover.Url
          }
        }    
    return userDeatails;
  }

  public render(): React.ReactElement<IComponentCommentsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <div className="col-md-3">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Comments</h3>
          </div>

          <div className="panel-body">
           
            <div className="TopRecipients">
                <span className="mt-2 mr-5"> <strong>To:</strong>  </span>
                <span className="RecipientsNameField mt-0  mb-5">
                    <textarea autoComplete='off' placeholder="Recipients Name" rows={1} className="form-control ng-valid ui-autocomplete-input ng-dirty ng-touched ng-valid-parse ui-autocomplete-loading ng-not-empty" id="taskprofile" style={{width: '161px', height: '43px'}}></textarea>
                </span>
            </div>            
            <div className="RecipientsCommentsField ">
                <textarea id='txtComment' onChange={(e)=>this.handleInputChange(e)} className="form-control ui-autocomplete-input ng-valid ng-touched ng-dirty ng-empty" rows={3} placeholder="Enter your comments here" autoComplete="off" style={{width: '286px', height: '58px'}}></textarea>
                               
                <button onClick={()=>this.PostComment()} title="Post comment" type="button" className="btn btn-primary pull-right mt-5 mb-5">
                    Post
                </button>

            </div>
            <div className="clearfix"></div>

            <div className="commentMedia">
              <div className="card">
                <ul className="list-unstyled">
                {this.state.Result["Comments"] != null && this.state.Result["Comments"].length>0 && this.state.Result["Comments"].map( (cmtData:any,i:any)=> {
                  return <li className="media ng-scope">
                    <span className="round pt-2">
                      <img className="align-self-start mr-3" title={cmtData.AuthorName}
                          src={cmtData.AuthorImage != undefined && cmtData.AuthorImage != '' ? 
                            "https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/ChetanChauhan.png" :
                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                            />
                    </span>
                    <div className="media-bodyy">
                      <div className="col-sm-12 pad0 d-flex">
                        <span className="comment-date pt-2 ng-binding">{cmtData.Created}</span>
                          <div className="ml-auto media-icons pt-2">
                            <a className="mr-5">
                              <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" />
                            </a>
                            <a title="Delete">
                              <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/delete.gif" />
                            </a>
                          </div>
                      </div>
                      <div className="col-sm-12 pad0 d-flex">
                        { cmtData.Header !='' && <h6 className="userid pt-2"><a className="ng-binding">{cmtData.Header}</a></h6>}
                      </div>
                      <p className="media-text ng-binding">{cmtData.Description}</p>
                    </div>
                  </li>
                })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>      
    );
  }
}
