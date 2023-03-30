import * as React from 'react';
//import styles from './Taskprofile.module.scss';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
// import * as moment from 'moment';
import { Modal } from '@fluentui/react';
import * as moment from "moment-timezone";
import EmailComponenet from './emailComponent';
// import * as moment from "moment-timezone";
var sunchildcomment: any;
var countemailbutton=0;
 var changespercentage=false;
var countApprove=0;
 var countreject=0;
export interface ITaskFeedbackProps {
  fullfeedback: any;
  feedback: any;
  index: 0;
  onPost: () => void;
  approvalcallbacktask: () => any;
  CurrentUser: any;
  ApprovalStatus: boolean;
 
  Approver:any;
  Result:any;
  Context:any;
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
  emailcomponentopen:boolean;
  emailComponentstatus:String;
}

export class TaskFeedbackCard extends React.Component<ITaskFeedbackProps, ITaskFeedbackState> {

  constructor(props: ITaskFeedbackProps) {
    super(props);

  

    this.state = {
      showcomment: 'none',
      showcomment_subtext: 'none',
      fbData: this.props.feedback,
      index: this.props.index,
      CommenttoPost: '',
      isModalOpen: false,
      emailcomponentopen:false,
      emailComponentstatus:"",
      updateCommentText: {},
      CommenttoUpdate: ''
    };
  }
  private showhideCommentBox() {
    if (this.state.showcomment == 'none') {
      this.setState({
        showcomment: 'block'
      });
    } else {
      this.setState({
        showcomment: 'none'
      });
    }
  }


  private showhideCommentBoxOfSubText(j: any) {
    sunchildcomment = j;

    if (this.state.showcomment == 'none') {
      this.setState({
        showcomment_subtext: 'block'
      });
    } else {
      this.setState({
        showcomment_subtext: 'none'
      });
    }
  }

  private handleInputChange(e: any) {
    this.setState({ CommenttoPost: e.target.value });
  }

  private PostButtonClick() {

    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {
      //  var date= moment(new Date()).format('dd MMM yyyy HH:mm')
      let temp = {
        AuthorImage: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "",
        AuthorName: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "",
        // Created: new Date().toLocaleString('default',{ month: 'short',day:'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment
      };
      //Add object in feedback

      if (this.props.feedback["Comments"] != undefined) {
        this.props.feedback["Comments"].unshift(temp);
      }
      else {
        this.props.feedback["Comments"] = [temp];
      }
      (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
      this.setState({
        showcomment: 'none',
        CommenttoPost: '',
      });
      this.props.onPost();
    } else {
      alert('Please input some text.')
    }

  }

  private SubtextPostButtonClick(j: any) {
    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {
      let temp = {
        AuthorImage: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "",
        AuthorName: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "",
        // Created: new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment
      };
      //Add object in feedback

      if (this.props.feedback["Subtext"][j].Comments != undefined) {
        this.props.feedback["Subtext"][j].Comments.unshift(temp);
      }
      else {
        this.props.feedback["Subtext"][j]['Comments'] = [temp];
      }
      (document.getElementById('txtCommentSubtext') as HTMLTextAreaElement).value = '';
      this.setState({
        showcomment_subtext: 'none',
        CommenttoPost: '',
      });
      this.props.onPost();
    } else {
      alert('Please input some text.')
    }

  }

  private clearComment(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any) {
    if (isSubtextComment) {
      this.props.feedback["Subtext"][indexOfSubtext].Comments.splice(indexOfDeleteElement, 1)
    } else {
      this.props.feedback["Comments"].splice(indexOfDeleteElement, 1);
    }
    this.props.onPost();
  }

  private openEditModal(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any) {
    this.setState({
      isModalOpen: true,
      CommenttoUpdate: comment,
      updateCommentText: {
        'comment': comment,
        'indexOfUpdateElement': indexOfUpdateElement,
        'indexOfSubtext': indexOfSubtext,
        'isSubtextComment': isSubtextComment
      }
    })
  }

  //close the model
  private CloseModal(e: any) {
    e.preventDefault();
    this.setState({
      isModalOpen: false,
      updateCommentText: {},
      CommenttoUpdate: ''
    });
  }

  private handleUpdateComment(e: any) {
    this.setState({ CommenttoUpdate: e.target.value });
  }

  private updateComment() {
    let txtComment = this.state.CommenttoUpdate

    if (txtComment != '') {
      let temp = {
        AuthorImage: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "",
        AuthorName: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "",
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment
      };
      if (this.state.updateCommentText.isSubtextComment) {
        this.props.feedback.Subtext[this.state.updateCommentText['indexOfSubtext']]['Comments'][this.state.updateCommentText['indexOfUpdateElement']] = temp;

      }
      else {
        this.props.feedback["Comments"][this.state.updateCommentText['indexOfUpdateElement']] = temp;
      }

      this.props.onPost();
    }
    this.setState({
      isModalOpen: false,
      updateCommentText: {},
      CommenttoUpdate: ''
    });
  }

  private ConvertStringToHTML(str: any) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  }
  private checkforMail(allfeedback:any){
    console.log(allfeedback);
    if( allfeedback!=null&& allfeedback!=undefined){
    var  isShowLight=0;
      var NotisShowLight=0
      if(allfeedback!=undefined){
        allfeedback.map((items:any)=>{

          if(items.isShowLight!=undefined&&items.isShowLight!=""){
            isShowLight=isShowLight+1;
            if(items.isShowLight=="Approve"){
              changespercentage=true;
              countApprove=countApprove+1;
            }else{
              countreject=countreject+1;
            }
           
            
          }
          if(items.Subtext!=undefined&&items.Subtext.length>0){
            items.Subtext.map((subtextItems:any)=>{
              if(subtextItems.isShowLight!=undefined&&subtextItems.isShowLight!=""){
                isShowLight=isShowLight+1;
                if(subtextItems.isShowLight=="Approve"){
                  changespercentage=true;
                  countApprove=countApprove+1;
                }else{
                  countreject=countreject+1;
                }
                
              }
            })
          }
        })
      }
      
      if(isShowLight>NotisShowLight){
         countemailbutton=1;
      }
    }
  }
  private async changepercentageStatus(percentageStatus:any,pervious:any){
    console.log(percentageStatus)
    console.log(pervious)
    console.log(countApprove)
    console.log(countreject)
    if((countApprove==0&&percentageStatus=="Approve"&&(pervious.isShowLight==""||pervious.isShowLight==undefined))){
      changespercentage=true;
    }
    if((countApprove==1&&(percentageStatus=="Reject"||percentageStatus=="Maybe")&&(pervious.isShowLight=="Approve"&&pervious.isShowLight!=undefined))){
      changespercentage=false;
    }
    if((countApprove==0&&percentageStatus=="Approve"&&(pervious.isShowLight=="Reject"||pervious.isShowLight=="Maybe")&&pervious.isShowLight!=undefined)){
      changespercentage=true;
    }
    let percentageComplete;
    if(changespercentage==true){
    percentageComplete=0.03;
    }
   if(changespercentage==false){
     percentageComplete=0.02;
      }
   
      const web = new Web( this.props.Result?.siteUrl );
      await web.lists.getByTitle(this.props.Result.listName).items.getById(this.props.Result.Id).update({
        PercentComplete: percentageComplete,
        
      }).then((res:any)=>{
       console.log(res);
      //  this.props.approvalcallbacktask();
       })
     .catch((err) => {
       console.log(err.message);
    });
   
 
  }
private changeTrafficLigth(index:any,item:any){
  console.log(index);
  console.log(item);
  if(  this.props.Approver.Id==this.props.CurrentUser[0].Id){
   
    let tempData:any=this.state.fbData;
    if(this.props.fullfeedback!=undefined){
      this.checkforMail(this.props.fullfeedback[0]?.FeedBackDescriptions);
    }
    if(countemailbutton>0){
      this.changepercentageStatus(item,tempData);
    }
   
    tempData.isShowLight = item;
    console.log(tempData);
    this.setState({
      fbData: tempData,
        index: index,
        emailcomponentopen:true,
        emailComponentstatus:item
    });
    console.log(this.state.fbData);
    this.props.onPost();
    
   
  }
}

private changeTrafficLigthsubtext(parentindex:any,subchileindex:any,status:any){
console.log(parentindex);
console.log(subchileindex);
console.log(status);
if(  this.props.Approver.Id==this.props.CurrentUser[0].Id){
 
let tempData:any=this.state.fbData;
if(this.props.fullfeedback!=undefined){
  this.checkforMail(this.props.fullfeedback[0]?.FeedBackDescriptions);
}
if(countemailbutton>0){
  this.changepercentageStatus(status,tempData.Subtext[subchileindex]);
}

tempData.Subtext[subchileindex].isShowLight = status;
console.log(tempData);
this.setState({
  fbData: tempData,
    index: parentindex,
    emailcomponentopen:true,
    emailComponentstatus:status
});
console.log(this.state.emailcomponentopen)
this.props.onPost();


}
}
private approvalcallback(){
   this.props.approvalcallbacktask();
  this.setState({
    emailcomponentopen:false,
     });
    }
  public render(): React.ReactElement<ITaskFeedbackProps> {
    return (
      <div>
        { this.state.emailcomponentopen && countemailbutton==0&&<EmailComponenet approvalcallback={() => { this.approvalcallback() }}  Context={this.props.Context} emailStatus={this.state.emailComponentstatus}  currentUser={this.props.CurrentUser} items={this.props.Result} />}
        <div className="col mb-2">
          <div className='justify-content-between d-flex'>
            <div className="pt-2">
              {this.props.ApprovalStatus ?
                <span className="MR5 ng-scope" ng-disabled="Item.PercentComplete >= 80">
                  <span title="Rejected" onClick={()=> this.changeTrafficLigth(this.state.index,"Reject")}
                    className={this.state.fbData['isShowLight'] == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                  >
                  </span>
                  <span onClick={()=> this.changeTrafficLigth(this.state.index,"Maybe")} title="Maybe" className={this.state.fbData['isShowLight'] == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                  </span>
                  <span title="Approved" onClick={()=> this.changeTrafficLigth(this.state.index,"Approve")} className={this.state.fbData['isShowLight'] == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                  </span>
                </span>
                : null
              }
            </div>
            <div className='pb-1'>
              <span className="d-block">
                <a style={{ cursor: 'pointer' }} onClick={(e) => this.showhideCommentBox()}>Add Comment</a>
              </span>
            </div>
          </div>


          <div className="d-flex p-0">
            <div className="border p-1 me-1">
              <span>{this.state.index}.</span>
              <ul className='list-none'>
                <li>
                  {this.state.fbData['Completed'] != null && this.state.fbData['Completed'] &&
                    <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                  }
                </li>
                <li>
                  {this.state.fbData['HighImportance'] != null && this.state.fbData['HighImportance'] &&
                    <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                  }
                </li>
                <li>
                  {this.state.fbData['LowImportance'] != null && this.state.fbData['LowImportance'] &&
                    <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                  }
                </li>
                <li>
                  {this.state.fbData['Phone'] != null && this.state.fbData['Phone'] &&
                    <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                  }
                </li>
              </ul>
            </div>

            <div className="border p-2 full-width text-break">

              <span dangerouslySetInnerHTML={{ __html: this.state.fbData.Title }}></span>
              <div className="col">
                {this.state.fbData['Comments'] != null && this.state.fbData['Comments'].length > 0 && this.state.fbData['Comments'].map((fbComment: any, k: any) => {
                  return <div className="col d-flex add_cmnt my-1">
                    <div className="col-1 p-0">
                      <img className="AssignUserPhoto1" src={fbComment.AuthorImage != undefined && fbComment.AuthorImage != '' ?
                        fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                    </div>
                    <div className="col-11 pe-0" >
                      <div className='d-flex justify-content-between align-items-center'>
                        {fbComment.AuthorName} - {fbComment.Created}
                        <span>
                          <a className="ps-1" onClick={() => this.openEditModal(fbComment.Title, k, 0, false)}>
                            {/* <img src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif'></img> */}
                            <img src={require('../../../Assets/ICON/edit_page.svg')} width="25"></img>
                            
                            </a>
                          <a className="ps-1" onClick={() => this.clearComment(false, k, 0)}><img src='/_layouts/images/delete.gif'></img></a>
                        </span>
                      </div>
                      <div><span dangerouslySetInnerHTML={{ __html: fbComment.Title }}></span></div>
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>
          <div className='d-flex'>
            <div className="col-sm-11 mt-2 p-0" style={{ display: this.state.showcomment }}>
              <textarea id="txtComment" onChange={(e) => this.handleInputChange(e)} className="form-control full-width" ></textarea>
            </div>

            <div className="col-sm-1 ps-1 mt-2 text-end " style={{ display: this.state.showcomment }}>
              <button type="button" className="post btn btn-primary " onClick={() => this.PostButtonClick()}>Post</button>
            </div>
          </div>

        </div>

        {this.state.fbData['Subtext'] != null && this.state.fbData['Subtext'].length > 0 && this.state.fbData['Subtext'].map((fbSubData: any, j: any) => {
          return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>
            <div className='justify-content-between d-flex'>
              <div>
                {this.props.ApprovalStatus ?
                  <span className="MR5 ng-scope" ng-disabled="Item.PercentComplete >= 80">
                    <span title="Rejected"onClick={()=> this.changeTrafficLigthsubtext(this.state.index,j,"Reject")}
                      className={fbSubData.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                    >
                    </span>
                    <span title="Maybe"onClick={()=> this.changeTrafficLigthsubtext(this.state.index,j,"Maybe")} className={fbSubData.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                    </span>
                    <span title="Approved" onClick={()=> this.changeTrafficLigthsubtext(this.state.index,j,"Approve")} className={fbSubData.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                    </span>
                  </span>
                  : null
                }
              </div>
              <div>
                <span className="d-block text-end">
                  <a style={{ cursor: 'pointer' }} onClick={(e) => this.showhideCommentBoxOfSubText(j)}>Add Comment</a>
                </span>
              </div>
            </div>

            <div className="d-flex pe-0">
              <div className="border p-1 me-1">
                <span className="ng-binding">{this.state.index}.{j + 1}</span>
                <ul className="list-none">
                  <li>
                    {fbSubData.Completed != null && fbSubData.Completed &&
                      <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                    }
                  </li>
                  <li>
                    {fbSubData.HighImportance != null && fbSubData.HighImportance &&
                      <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                    }
                  </li>
                  <li>
                    {fbSubData.LowImportance != null && fbSubData.LowImportance &&
                      <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                    }
                  </li>
                  <li>
                    {fbSubData.Phone != null && fbSubData.Phone &&
                      <span className="ng-scope"><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                    }
                  </li>
                </ul>
              </div>

              <div className="border p-2 full-width text-break">
                <span className="ng-binding"><span dangerouslySetInnerHTML={{ __html: fbSubData.Title.replace(/<[^>]*>/g, '') }}></span></span>
                <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                  {fbSubData.Comments != null && fbSubData.Comments.length > 0 && fbSubData.Comments.map((fbComment: any, k: any) => {
                    return <div className="col-sm-12 d-flex mb-2 add_cmnt my-1 ng-scope">
                      <div className="col-sm-1 padL-0 wid35">
                        <img className="AssignUserPhoto1" src={fbComment.AuthorImage != undefined && fbComment.AuthorImage != '' ?
                          fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                      </div>
                      <div className="col-sm-11 pad0" key={k}>
                        <div className="d-flex justify-content-between align-items-center">
                          {fbComment.AuthorName} - {fbComment.Created}
                          <span>
                            <a className="ps-1" onClick={() => this.openEditModal(fbComment.Title, k, j, true)}>
                              {/* <img src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/edititem.gif'></img> */}
                             <img  src={require('../../../Assets/ICON/edit_page.svg')} width="25"></img>
                              </a>
                            <a className="ps-1" onClick={() => this.clearComment(true, k, j)}><img src='/_layouts/images/delete.gif'></img></a>
                          </span>
                        </div>
                        <div className="ng-binding"><span dangerouslySetInnerHTML={{ __html: fbComment.Title }}></span></div>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            </div>
            {sunchildcomment == j ? <div className='d-flex ' >
              <div className="col-sm-11  mt-2 p-0  " style={{ display: this.state.showcomment_subtext }}>
                <textarea id="txtCommentSubtext" onChange={(e) => this.handleInputChange(e)} style={{ width: '99%' }} className="form-control ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched" ></textarea>
              </div>

              <div className="col-sm-1 mt-2 text-end  " style={{ display: this.state.showcomment_subtext }}>
                <button type="button" className="post btn btn-primary" onClick={() => this.SubtextPostButtonClick(j)}>Post</button>
              </div>
            </div> : null}

          </div>
        })}
        <Modal isOpen={this.state.isModalOpen} isBlocking={false} containerClassName="custommodalpopup p-2">

          <div className="modal-header mb-1">
            <h5 className="modal-title">Update Comment</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => this.CloseModal(e)}></button>
          </div>
          <div className="modal-body">
            <div className='col'><textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => this.handleUpdateComment(e)}  >{this.state.CommenttoUpdate}</textarea></div>
          </div>
          <footer className='text-end mt-2'>
            <button className="btn btnPrimary " onClick={(e) => this.updateComment()}>Save</button>
            <button className='btn btn-default ms-1' onClick={(e) => this.CloseModal(e)}>Cancel</button>
          </footer>
        </Modal>
      </div>
    );
  }

}
export default TaskFeedbackCard;
