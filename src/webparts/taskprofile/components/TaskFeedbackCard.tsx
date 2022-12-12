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
        {this.state.fbData['Title'] != ''  &&
          <div>
          <span style={{float:'right'}}><a onClick={(e) =>this.showhideCommentBox()}>Add Comment</a></span>
          <div style={{width:'100%' , display:'flex'}}>
            <div className={styles.infoNo}>
              <span>{this.state.index}.</span>
              <ul style={{listStyle:'none'}}>
              <li>
              {this.state.fbData['Completed'] != null && this.state.fbData['Completed'] &&
                <img style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img>
              }
              </li>
              <li>
              {this.state.fbData['HighImportance'] != null && this.state.fbData['HighImportance'] &&
                <img style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img>
              }
              </li>
              </ul>
            </div>
            <div className={styles.infoValue}>
              <div>{this.state.fbData['Title'].replace(/<[^>]*>/g, '')}</div>
              {this.state.fbData['Comments'] != null && this.state.fbData['Comments'].length > 0 && this.state.fbData['Comments'].map( (fbComment:any,k:any)=> {
                return <div className={styles.fbCommentInfo}>
                  <div>
                    <span><img className={styles.imgAuthor} 
                            src={fbComment.AuthorImage!= undefined && fbComment.AuthorImage != '' ? 
                                  fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}>
                      </img></span>
                    <span>{fbComment.AuthorName} - </span>
                    <span>{fbComment.Created}</span>
                    <span><a onClick={()=>this.openEditModal(fbComment.Title, k, 0, false)}><img src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif'></img></a></span>
                    <span><a onClick={()=>this.clearComment(false, k, 0)}><img src='/_layouts/images/delete.gif'></img></a></span>
                  </div>
                  <div>{fbComment.Title}</div>
                  </div>
              })}
            </div>
          </div>
          <div style={{display: this.state.showcomment}}>
            <div><textarea id="txtComment" onChange={(e)=>this.handleInputChange(e)}></textarea></div>
            <div><button type="button" onClick={()=>this.PostButtonClick()}>Post</button></div>
          </div>
          
          {this.state.fbData['Subtext'] != null && this.state.fbData['Subtext'].length > 0 && this.state.fbData['Subtext'].map( (fbSubData:any,j:any)=> {
            return <div>            
              <span style={{float:'right'}}><a onClick={(e) =>this.showhideCommentBoxOfSubText()}>Add Comment</a></span>
              <div style={{width:'100%' , display:'flex'}}>
              <div className={styles.infoNo}>
                <span>{this.state.index}.{j+1}</span>
                <ul style={{listStyle:'none'}}>
              <li>
              {fbSubData.Completed != null && fbSubData.Completed &&
                <img style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img>
              }
              </li>
              <li>
              {fbSubData.HighImportance != null && fbSubData.HighImportance &&
                <img style={{width:'10px'}} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img>
              }
              </li>
              </ul>
              </div>
              <div className={styles.infoValue}>
                <div>{fbSubData.Title.replace(/<[^>]*>/g, '')}</div>
                {fbSubData.Comments != null && fbSubData.Comments.length > 0 && fbSubData.Comments.map( (fbComment:any,k:any)=> {
                return <div className={styles.fbCommentInfo}>
                  <div>
                    <span><img className={styles.imgAuthor} 
                          src={fbComment.AuthorImage!= undefined && fbComment.AuthorImage != '' ? 
                              fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}></img></span>
                    <span>{fbComment.AuthorName} - </span>
                    <span>{fbComment.Created}</span>
                    <span><a><img src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif'></img></a></span>
                    <span><a onClick={()=>this.clearComment(true, k, j)}><img src='/_layouts/images/delete.gif'></img></a></span>
                  </div>
                  <div>{fbComment.Title}</div>
                  </div>
              })}
              </div>                        
              </div>
              <div style={{display: this.state.showcomment_subtext}}>
                <div><textarea id="txtCommentSubtext" onChange={(e)=>this.handleInputChange(e)}></textarea></div>
                <div><button type="button" onClick={()=>this.SubtextPostButtonClick(j)}>Post</button></div>
              </div>
            </div>  
          })}
        </div>
        }

        
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
