import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "sp-pnp-js";
import '../../webparts/cssFolder/foundation.scss'
import '../../webparts/cssFolder/foundationmin.scss';
import './CommentStyle.scss'
import { Modal } from 'office-ui-fabric-react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
//import FloraEditor from "./TextEditor";

export interface ICommentCardProps {
  siteUrl? : string;
  userDisplayName? : string;
}

export interface ICommentCardState {  
  Result : any;
  listName : string;
  itemID : number;
  CommenttoPost : string;
  updateComment: boolean;
  isModalOpen: boolean;
  AllCommentModal: boolean;
}

export class CommentCard extends React.Component<ICommentCardProps, ICommentCardState> {
  private taskUsers : any = [];
  private currentUser: any;
  constructor(props:ICommentCardProps){
    super(props);
    const params1 = new URLSearchParams(window.location.search);    
    console.log(params1.get('taskId'));
    console.log(params1.get('Site'));

    this.state ={
      Result:{},
      listName: params1.get('Site'),
      itemID : Number(params1.get('taskId')),
      CommenttoPost: '',
      updateComment: false,
      isModalOpen: false,
      AllCommentModal: false
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
    if (tempTask["Comments"] != undefined && tempTask["Comments"].length > 0){
      tempTask["Comments"].sort(function(a:any, b:any) {
        let keyA = a.ID,
          keyB = b.ID;
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
    }   
    
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
    let txtComment = this.state.CommenttoPost;
    if (txtComment != ''){
      let temp = {
        AuthorImage: this.currentUser['userImage'] != null ? this.currentUser['userImage'] : '', 
        AuthorName: this.currentUser['Title'] != null ? this.currentUser['Title'] : '', 
        Created: (new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })).replace(',',''),
        Description:txtComment,
        Header: "",
        ID: this.state.Result["Comments"].length,
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
      
      this.state.Result["Comments"].sort(function(a:any, b:any) {
        let keyA = a.ID,
          keyB = b.ID;
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      
      console.log(this.state.Result);
      
      (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
      (document.getElementById('txtCommentModal') as HTMLTextAreaElement).value = '';
      
      let web = new Web(this.props.siteUrl);
      
      const i = await web.lists.getByTitle(this.state.listName)
              .items
              .getById(this.state.itemID).update({
                Comments: JSON.stringify(this.state.Result["Comments"])
              });
      
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

  private async clearComment(indexOfDeleteElement:any){
    if (confirm('Are you sure, you want to delete this?')){
      this.state.Result["Comments"].splice(indexOfDeleteElement,1);    
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
  private openEditModal(indexOfDeleteElement:any){
    this.setState({
      isModalOpen : true
    })
  }

  private openAllCommentModal(){
    this.setState({
      AllCommentModal : true
    })
  }

  private closeAllCommentModal(e:any){
    e.preventDefault();
    this.setState({
      AllCommentModal : false
    })
  }

  //close the model
  private CloseModal(e:any) {
    e.preventDefault();
    this.setState({ 
      isModalOpen:false
    });
  }

  public render(): React.ReactElement<ICommentCardProps> {
    const {      
      userDisplayName
    } = this.props;

    return (
      <div>
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
                {this.state.Result["Comments"] != null && this.state.Result["Comments"].length>0 && this.state.Result["Comments"].slice(0,3).map( (cmtData:any,i:any)=> {
                  return <li className="media ng-scope">
                    <span className="round pt-2">
                      <img className="align-self-start mr-3" title={cmtData.AuthorName}
                          src={cmtData.AuthorImage != undefined && cmtData.AuthorImage != '' ? 
                          cmtData.AuthorImage  :
                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                            />
                    </span>
                    <div className="media-bodyy">
                      <div className="col-sm-12 pad0 d-flex">
                        <span className="comment-date pt-2 ng-binding">{cmtData.Created}</span>
                          <div className="ml-auto media-icons pt-2">
                            <a className="mr-5" onClick={()=>this.openEditModal(i)}>
                              <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" />
                            </a>
                            <a title="Delete" onClick={()=>this.clearComment(i)}>
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
                {this.state.Result["Comments"] != null && this.state.Result["Comments"].length>3 &&
                  <div className="MoreComments ng-hide">
                        <a className="MoreComments ng-binding ng-hide" title="Click to Reply" onClick={()=>this.openAllCommentModal()}>
                            All Comments({this.state.Result["Comments"].length})
                        </a>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        
        <Modal isOpen={this.state.isModalOpen} isBlocking={false}>
              <div className='modal-dialog modal-help' style={{width: '890px'}}>
                <div className='modal-content'>
                  <div className='modal-header'>
                      <h3 className='modal-title'>Update Comment</h3>
                      <button type="button" className='close' style={{minWidth: "10px"}} onClick={(e) =>this.CloseModal(e) }>x</button>
                  </div>
                  <div className='modal-body'>
                  <Editor
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      wrapperStyle={{ width: '100%', border: "2px solid black", height:'60%' }}
                  />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" >Save</button>
                    <button type="button" className="btn btn-default" onClick={(e) =>this.CloseModal(e) }>Cancel</button>
                  </div>
                </div>
              </div>          
        </Modal>

        <Modal isOpen={this.state.AllCommentModal} isBlocking={false}>
          <div className='modal-dialog modal-help'>
          <div id='ShowAllCommentsId'>
            <div className='modal-content'>
                <div className='modal-header'>
                  {this.state.Result["Comments"] != undefined && this.state.Result["Comments"].length > 0 &&
                    <h3 className='modal-title'>Comment: {this.state.Result["Title"] +' ('+this.state.Result["Comments"].length +')'}</h3>
                  }  
                    <button type="button" className='close' style={{minWidth: "10px"}} onClick={(e) =>this.closeAllCommentModal(e) }>x</button>
                </div>
                <div className='modal-body bg-f5f5 clearfix'>
                <div className="col-sm-12  pl-10 boxbackcolor" id="ShowAllComments">                
                  <div className="col-sm-12 mt-10 mb-10 padL-0 PadR0">
                      <div className="col-sm-12 mb-10 pl-7 PadR0">
                        <div className="col-sm-11 padL-0">
                          <textarea id="txtCommentModal" onChange={(e)=>this.handleInputChange(e)} className="form-control ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required ui-autocomplete-input" rows={2} ng-required="true" placeholder="Enter your comments here" ng-model="Feedback.comment"></textarea>
                          <span role="status" aria-live="polite" className="ui-helper-hidden-accessible"></span>
                        </div>
                        <div className="col-sm-1 padL-0">
                          <div className="icon_post">
                            <img onClick={()=>this.PostComment()} title="Save changes & exit" className="ng-binding" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/Post.png"/>
                          </div>
                        </div>
                      </div>
                      {this.state.Result["Comments"] != null && this.state.Result["Comments"].length>0 && this.state.Result["Comments"].map( (cmtData:any,i:any)=> {
                        return <div className="DashboardpublicationItem ng-scope">
                        <div className="col-sm-12 pad7">
                          <div className="col-sm-1 padL-0 PadR0">
                            <img style={{height:'35px',width:'35px'}} title={cmtData.AuthorName} 
                              src={cmtData.AuthorImage != undefined && cmtData.AuthorImage != '' ? 
                              cmtData.AuthorImage  :
                                "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                              />                            
                          </div>
                          <div className="col-sm-11 padL-0 PadR0">
                            <div className="" style={{color:'#069'}}>                              
                              <span className="footerUsercolor ng-binding" style={{fontSize: 'smaller'}}>{cmtData.Created}</span>
                              <a className="hreflink" onClick={()=>this.openEditModal(i)}>
                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif" />
                              </a>
                              <a className="hreflink" title="Delete" onClick={()=>this.clearComment(i)}>
                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/delete.gif" />
                              </a>
                            </div>
                            {cmtData.Header !='' && <b className="ng-binding">{cmtData.Header}</b>}
                          </div>
                          <div className="col-sm-1"></div>
                          <div className="col-sm-11 padL-0">
                            <span id="pageContent" className="ng-binding">{cmtData.Description}</span>
                          </div>
                        </div>
                      </div>
                      })}
                      
                  </div>          

                </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" >Save</button>
                  <button type="button" className="btn btn-default" onClick={(e) =>this.closeAllCommentModal(e) }>Cancel</button>
                </div>
            </div>
          </div>          
          </div>          
        </Modal>

      </div>      
    );
  }
}

export default CommentCard;