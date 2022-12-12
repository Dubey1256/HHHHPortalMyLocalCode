import * as React from 'react';
import styles from './Taskprofile.module.scss';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
import {Modal} from '@fluentui/react';

export interface ITaskFeedbackProps {
    fullfeedback: any;
    feedback: any;
    index:0;
    onPost:()=>void;
    CurrentUser:any;
  }

export interface ITaskFeedbackState {   
    showcomment: string;
    showcomment_subtext: string;
    fbData: any;
    index: number;
    CommenttoPost: string;
    isModalOpen: boolean;
    updateCommentText: any;
    CommenttoUpdate: string;
  }

export class TaskFeedbackCard extends React.Component<ITaskFeedbackProps, ITaskFeedbackState> {
 
  constructor(props: ITaskFeedbackProps) {
    super(props);
    console.log('In Task Feedback Component');
    console.log(this.props.feedback);
    this.state = {
        showcomment : 'none',
        showcomment_subtext : 'none',
        fbData: this.props.feedback,
        index: this.props.index,
        CommenttoPost: '',
        isModalOpen: false,
        updateCommentText:{},
        CommenttoUpdate:''
    };
  }
  private showhideCommentBox(){    
    if (this.state.showcomment == 'none'){
      this.setState({ 
        showcomment:'block'
      });
    }else{
      this.setState({ 
        showcomment:'none'
      });
    }    
  }

  
  private showhideCommentBoxOfSubText(){    
    if (this.state.showcomment == 'none'){
      this.setState({ 
        showcomment_subtext:'block'
      });
    }else{
      this.setState({ 
        showcomment_subtext:'none'
      });
    }    
  }

  private handleInputChange(e:any){
    this.setState({CommenttoPost: e.target.value}); 
   }

  private PostButtonClick(){
    
    let txtComment = this.state.CommenttoPost;
    if (txtComment != ''){
      let temp = {
        AuthorImage: this.props.CurrentUser != null &&  this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "", 
        AuthorName: this.props.CurrentUser != null &&  this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "", 
        Created: new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Title:txtComment
      };
      //Add object in feedback
      
      if (this.props.feedback["Comments"] != undefined){
        this.props.feedback["Comments"].push(temp);
      }
      else{
        this.props.feedback["Comments"] = [temp];
      }
      (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
      this.setState({ 
        showcomment:'none',
        CommenttoPost: '',
      });
      this.props.onPost();
    }else{
      alert('Please input some text.')
    }    
    
  }
  
  private SubtextPostButtonClick(j:any){
    let txtComment = this.state.CommenttoPost;
    if (txtComment != ''){
      let temp = {
        AuthorImage: this.props.CurrentUser != null &&  this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "", 
        AuthorName: this.props.CurrentUser != null &&  this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "", 
        Created: new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Title:txtComment
      };
      //Add object in feedback
      
      if (this.props.feedback["Subtext"][j].Comments != undefined){
        this.props.feedback["Subtext"][j].Comments.push(temp);
      }
      else{
        this.props.feedback["Subtext"][j]['Comments'] = [temp];
      }
      (document.getElementById('txtCommentSubtext') as HTMLTextAreaElement).value = '';
      this.setState({ 
        showcomment_subtext:'none',
        CommenttoPost: '',
      });
      this.props.onPost();
    }else{
      alert('Please input some text.')
    }    
    
  }

  private clearComment(isSubtextComment:any, indexOfDeleteElement:any, indexOfSubtext:any){
    if(isSubtextComment){
      this.props.feedback["Subtext"][indexOfSubtext].Comments.splice(indexOfDeleteElement,1)
    }else{
      this.props.feedback["Comments"].splice(indexOfDeleteElement,1);
    } 
    this.props.onPost();
  }

  private openEditModal(comment:any, indexOfUpdateElement:any,indexOfSubtext:any, isSubtextComment:any){
    this.setState({
      isModalOpen : true,
      CommenttoUpdate:comment,
      updateCommentText: {
        'comment': comment,
        'indexOfUpdateElement' : indexOfUpdateElement,
        'indexOfSubtext' : indexOfSubtext,
        'isSubtextComment':isSubtextComment
      }
    })
  }

  //close the model
  private CloseModal(e:any) {
    e.preventDefault();
    this.setState({ 
      isModalOpen:false,
      updateCommentText: {},
      CommenttoUpdate:''
    });
  }

  private handleUpdateComment(e:any){
    this.setState({CommenttoUpdate: e.target.value}); 
   }

  private updateComment(){
    let txtComment = this.state.CommenttoUpdate
    
    if (txtComment != ''){
      let temp = {
        AuthorImage: this.props.CurrentUser != null &&  this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "", 
        AuthorName: this.props.CurrentUser != null &&  this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "", 
        Created: new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Title:txtComment
      };

      this.props.feedback["Comments"][this.state.updateCommentText['indexOfUpdateElement']] = temp;
      this.props.onPost();
    }
    this.setState({ 
      isModalOpen:false,
      updateCommentText: {},
      CommenttoUpdate:''
    });
  }
  
  public render(): React.ReactElement<ITaskFeedbackProps> {
    return (
      <div>
        <div className="col-sm-12  pad0 manage_gap ng-scope" style={{width: '100%'}}>
          <span className="pull-right">
            <a className="md2 ng-binding" style={{cursor:'pointer'}} onClick={(e) =>this.showhideCommentBox()}>Add Comment</a>
          </span>

          <div className="col-sm-12 pad0" style={{width:'100%' , display:'flex'}}>
            <div className="col-sm-1 mb-5 tmvalue impact-info5 pad0 bdrbox back-fb">
              <span className="ng-binding">{this.state.index}.</span>
              <ul className="padL-0 list-non">
              <li>
              {this.state.fbData['Completed'] != null && this.state.fbData['Completed'] &&
                <span className="ng-scope"><img className="wid10" style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
              }
              </li>
              <li>
              {this.state.fbData['HighImportance'] != null && this.state.fbData['HighImportance'] &&
                <span className="ng-scope"><img className="wid10" style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
              }
              </li>
              </ul>
            </div>

            <div className="col-sm-12 mb-5 ml2 tmvalue impact-info95 padLR bdrbox">
              <span className="ng-binding">{this.state.fbData['Title'].replace(/<[^>]*>/g, '')}</span>
              <div className="feedbackcomment col-sm-12 PadR0 mt-10">
              {this.state.fbData['Comments'] != null && this.state.fbData['Comments'].length > 0 && this.state.fbData['Comments'].map( (fbComment:any,k:any)=> {
                return <div className="col-sm-12 mb-2 add_cmnt ng-scope">
                          <div>
                            <div className="col-sm-1 padL-0 wid35">
                              <img className="AssignUserPhoto1" src={fbComment.AuthorImage!= undefined && fbComment.AuthorImage != '' ? 
                                  fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}/>
                            </div>
                            <div className="col-sm-11 pad0">
                              <div className="ng-binding">
                              {fbComment.AuthorName} - {fbComment.Created}
                                <a onClick={()=>this.openEditModal(fbComment.Title, k, 0, false)}><img src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif'></img></a>
                                <a onClick={()=>this.clearComment(false, k, 0)}><img src='/_layouts/images/delete.gif'></img></a>
                              </div>
                              <div className="ng-binding">{fbComment.Title}</div>
                            </div>
                          </div>
                        </div>
              })}
            </div>
            </div>
          </div>

          <div  className="col-sm-11  ng-scope" style={{display: this.state.showcomment}}>
            <textarea id="txtComment" onChange={(e)=>this.handleInputChange(e)} style={{width:'100%'}} className="form-control ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched" ></textarea>
          </div>

          <div  className="col-sm-1 pad0  ng-scope" style={{display: this.state.showcomment}}>
            <button type="button"  className="post btn btn-primary pull-right ng-binding" onClick={()=>this.PostButtonClick()}>Post</button>
          </div>

          <div className="clearfix"></div>
        </div>
              
        {this.state.fbData['Subtext'] != null && this.state.fbData['Subtext'].length > 0 && this.state.fbData['Subtext'].map( (fbSubData:any,j:any)=> {
        return <div className="col-sm-12 pad0 manage_gap ng-scope" style={{width: '100%'}}>
            <span className="pull-right">
            <a className="md2 ng-binding" style={{cursor:'pointer'}} onClick={(e) =>this.showhideCommentBoxOfSubText()}>Add Comment</a>
          </span>

          <div className="col-sm-12 pad0" style={{width:'100%' , display:'flex'}}>
            <div className="col-sm-1 mb-5 tmvalue impact-info5 pad0 bdrbox back-fb">
              <span className="ng-binding">{this.state.index}.{j+1}</span>
              <ul className="padL-0 list-non">
              <li>
              {fbSubData.Completed != null && fbSubData.Completed &&
                <span className="ng-scope"><img className="wid10" style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
              }
              </li>
              <li>
              {fbSubData.Completed != null && fbSubData.Completed &&
                <span className="ng-scope"><img className="wid10" style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
              }
              </li>
              </ul>
            </div>

            <div className="col-sm-12 mb-5 ml2 tmvalue impact-info95 padLR bdrbox">
              <span className="ng-binding">{fbSubData.Title.replace(/<[^>]*>/g, '')}</span>
              <div className="feedbackcomment col-sm-12 PadR0 mt-10">
              {fbSubData.Comments != null && fbSubData.Comments.length > 0 && fbSubData.Comments.map( (fbComment:any,k:any)=> {
                return <div className="col-sm-12 mb-2 add_cmnt ng-scope">
                          <div>
                            <div className="col-sm-1 padL-0 wid35">
                              <img className="AssignUserPhoto1" src={fbComment.AuthorImage!= undefined && fbComment.AuthorImage != '' ? 
                                  fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}/>
                            </div>
                            <div className="col-sm-11 pad0">
                              <div className="ng-binding">
                              {fbComment.AuthorName} - {fbComment.Created}
                                <a onClick={()=>this.openEditModal(fbComment.Title, k, 0, false)}><img src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif'></img></a>
                                <a onClick={()=>this.clearComment(true, k, j)}><img src='/_layouts/images/delete.gif'></img></a>
                              </div>
                              <div className="ng-binding">{fbComment.Title}</div>
                            </div>
                          </div>
                        </div>
              })}
            </div>
            </div>
          </div>

          <div  className="col-sm-11  ng-scope" style={{display: this.state.showcomment_subtext}}>
            <textarea id="txtCommentSubtext" onChange={(e)=>this.handleInputChange(e)} style={{width:'100%'}} className="form-control ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched" ></textarea>
          </div>

          <div  className="col-sm-1 pad0  ng-scope" style={{display: this.state.showcomment_subtext}}>
            <button type="button"  className="post btn btn-primary pull-right ng-binding" onClick={()=>this.SubtextPostButtonClick(j)}>Post</button>
          </div>

          <div className="clearfix"></div>


        </div>
        })}

                
        <Modal isOpen={this.state.isModalOpen} isBlocking={false} containerClassName={styles.custommodalpopup}>
            <div className={styles.parentDiv}>
            <span className={styles.closeButtonRow}><img src={require('../assets/cross.png')} className={styles.modal_close_image} onClick={(e) =>this.CloseModal(e) }/></span>
                <span><h6>Update Comment</h6></span>
                <div style={{width:'99%', marginTop:'2%', padding:'2%'}}><textarea id="txtUpdateComment" rows={6} onChange={(e)=>this.handleUpdateComment(e)} style={{width: '100%',  marginLeft: '3px'}} >{this.state.CommenttoUpdate}</textarea></div>
                <div style={{display:'flex', marginTop: '2%',float: 'right', width:'19%', marginBottom:'2%'}}>
                  <div><button className={styles.btnPrimary} onClick={(e) =>this.updateComment() }>Save</button></div>
                  <div style={{marginLeft: '5%'}}><button onClick={(e) =>this.CloseModal(e) }>Cancel</button></div>
                </div>
            </div>
          </Modal>
      </div> 
    );
  }

}
export default TaskFeedbackCard;
