import * as React from 'react';
//import styles from './Taskprofile.module.scss';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
// import * as moment from 'moment';
import { Modal } from '@fluentui/react';
import * as moment from "moment-timezone";
import EmailComponenet from './emailComponent';
import Tooltip from '../../../globalComponents/Tooltip'
import ApprovalHistoryPopup from '../../../globalComponents/EditTaskPopup/ApprovalHistoryPopup';
// import * as moment from "moment-timezone";
var sunchildcomment: any;
var countemailbutton:number;
 var changespercentage=false;

export interface ITaskFeedbackProps {
  fullfeedback: any;
  feedback: any;
  index: 0;
  onPost: () => void;
  // approvalcallbacktask: () => any;
  CurrentUser: any;
  ApprovalStatus: boolean;
  // SiteTaskListID:any
  Approver:any;
  Result:any;
  Context:any;
}

export interface ITaskFeedbackState {
  showcomment: string;
  showcomment_subtext: string;
  fbData: any;
  percentage:any;
  index: number;
  CommenttoPost: string;
  isModalOpen: boolean;
  updateCommentText: any;
  CommenttoUpdate: string;
  emailcomponentopen:boolean;
  emailComponentstatus:String;
  ApprovalCommentcheckbox:boolean;
  ApprovalHistoryPopup:boolean;
 ApprovalPointUserData:any
  ApprovalPointCurrentIndex:any
 
  
}

export class TaskFeedbackCard extends React.Component<ITaskFeedbackProps, ITaskFeedbackState> {

  constructor(props: ITaskFeedbackProps) {
    super(props);

  

    this.state = {
      showcomment: 'none',
      showcomment_subtext: 'none',
      fbData: this.props.feedback,
      index: this.props.index,
      percentage:this.props.Result.PercentComplete,
      CommenttoPost: '',
      isModalOpen: false,
      emailcomponentopen:false,
      emailComponentstatus:"",
      updateCommentText: {},
      CommenttoUpdate: '',
      ApprovalCommentcheckbox:false,
      ApprovalHistoryPopup:false,
      ApprovalPointUserData:'',
    ApprovalPointCurrentIndex:this.props.index,
    
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
      var temp:any = {
        AuthorImage: this.props?.CurrentUser != null && this.props?.CurrentUser.length > 0 ? this.props?.CurrentUser[0]['userImage'] : "",
        AuthorName: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "",
        // Created: new Date().toLocaleString('default',{ month: 'short',day:'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,
        // isApprovalComment:this.state.ApprovalCommentcheckbox,
        // isShowLight:this.props?.feedback?.isShowLight?this.props?.feedback?.isShowLight:""
      };
      if(this.state.ApprovalCommentcheckbox){
        temp.isApprovalComment=this.state.ApprovalCommentcheckbox
        temp.isShowLight=this.props?.feedback?.isShowLight?this.props?.feedback?.isShowLight:"";
        var approvalDataHistory={
           ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
          Id: this.props.CurrentUser[0].Id,
           ImageUrl: this.props.CurrentUser[0].userImage,
            Title: this.props.CurrentUser[0].Title,
           isShowLight: this.props?.feedback?.isShowLight?this.props?.feedback?.isShowLight:""
        }
       
        if(temp.ApproverData!=undefined){
          temp.ApproverData.push(approvalDataHistory)
        }else{
          temp.ApproverData=[];
          temp.ApproverData.push(approvalDataHistory);
        }
      }
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
      this.setState({
        ApprovalCommentcheckbox:false
      })
    } else {
      alert('Please input some text.')
    }

  }

  private SubtextPostButtonClick(j: any) {
    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {
      let temp :any= {
        AuthorImage: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "",
        AuthorName: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "",
        // Created: new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,
        // isApprovalComment:this.state.ApprovalCommentcheckbox,
        // isShowLight:this.props?.feedback?.Subtext[j].isShowLight!=undefined?this.props?.feedback?.Subtext[j].isShowLight:""
      };
      if(this.state.ApprovalCommentcheckbox){
        temp.isApprovalComment=this.state.ApprovalCommentcheckbox
        temp.isShowLight=this.props?.feedback?.Subtext[j].isShowLight!=undefined?this.props?.feedback?.Subtext[j].isShowLight:""
        var approvalDataHistory={
           ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'), 
          Id: this.props.CurrentUser[0].Id,
           ImageUrl: this.props.CurrentUser[0].userImage,
            Title: this.props.CurrentUser[0].Title,
           isShowLight: this.props?.feedback?.Subtext[j].isShowLight!=undefined?this.props?.feedback?.Subtext[j].isShowLight:""
        }
       
        if(temp.ApproverData!=undefined){
          temp.ApproverData.push(approvalDataHistory)
        }else{
          temp.ApproverData=[];
          temp.ApproverData.push(approvalDataHistory);
        }

      }
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
      this.setState({
        ApprovalCommentcheckbox:false
      })
    } else {
      alert('Please input some text.')
    }

  }

  private clearComment(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any) {
    if (confirm("Are you sure, you want to delete this?")) {
      if (isSubtextComment) {
        this.props.feedback["Subtext"][indexOfSubtext]?.Comments?.splice(indexOfDeleteElement, 1)
      } else {
        this.props.feedback["Comments"]?.splice(indexOfDeleteElement, 1);
      }
      this.props.onPost();
    }
    
  }

  private openEditModal(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any) {
    this.setState({
      isModalOpen: true,
      CommenttoUpdate: comment?.Title,
      updateCommentText: {
        'comment': comment?.Title,
        'indexOfUpdateElement': indexOfUpdateElement,
        'indexOfSubtext': indexOfSubtext,
        'isSubtextComment': isSubtextComment,
        "data":comment
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
      let temp :any= {
        AuthorImage: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['userImage'] : "",
        AuthorName: this.props.CurrentUser != null && this.props.CurrentUser.length > 0 ? this.props.CurrentUser[0]['Title'] : "",
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment
      };
      if(this.state?.updateCommentText?.data?.isApprovalComment){
        temp.isApprovalComment=this.state?.updateCommentText?.data?.isApprovalComment;
        temp.isShowLight=this.state?.updateCommentText?.data?.isShowLight
        temp.ApproverData=this.state?.updateCommentText?.data?.ApproverData;
        }
      if (this.state?.updateCommentText?.isSubtextComment) {
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
  //================ checkMailfunction===========

  private async checkforMail(allfeedback:any,item:any,tempData:any){
    var countApprove=0;
    var countreject=0;
    console.log(allfeedback);
    if( allfeedback!=null&& allfeedback!=undefined){
    var  isShowLight=0;
      var NotisShowLight=0
      if(allfeedback!=undefined){
        allfeedback?.map((items:any)=>{

          if(items?.isShowLight!=undefined&&items?.isShowLight!=""){
            isShowLight=isShowLight+1;
            if(items.isShowLight=="Approve"){
              changespercentage=true;
              countApprove=countApprove+1;
            }else{
              countreject=countreject+1;
            }
           
            
          }
          if(items?.Subtext!=undefined&&items?.Subtext?.length>0){
            items?.Subtext?.map((subtextItems:any)=>{
              if(subtextItems?.isShowLight!=undefined&&subtextItems?.isShowLight!=""){
                isShowLight=isShowLight+1;
                if(subtextItems?.isShowLight=="Approve"){
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
      if( this.state.percentage<5){
        await this.changepercentageStatus(item,tempData,countApprove,);
      }
     
      if(isShowLight>NotisShowLight){
        if(item=="Reject"){
          countemailbutton=0;
          this.setState({
            emailcomponentopen:true,
          }
         
          )
        }else{
          countemailbutton=1;
        }
         
      }else{
        countemailbutton=0;
        this.setState({
          emailcomponentopen:true,
        })
       
      }
    }
  }

  //===========here we have to changes the percentages==============
  private async changepercentageStatus(percentageStatus:any,pervious:any,countApprove:any){
    console.log(percentageStatus)
    console.log(pervious)
    console.log(countApprove)
 
    if((countApprove==0&&percentageStatus=="Approve"&&(pervious?.isShowLight==""||pervious?.isShowLight==undefined))){
      changespercentage=true;
    }
    if((countApprove==1&&(percentageStatus=="Reject"||percentageStatus=="Maybe")&&(pervious?.isShowLight=="Approve"&&pervious?.isShowLight!=undefined))){
      changespercentage=false;
    }
    if((countApprove==0&&percentageStatus=="Approve"&&(pervious.isShowLight=="Reject"||pervious.isShowLight=="Maybe")&&pervious.isShowLight!=undefined)){
      changespercentage=true;
    }
    let percentageComplete;
   
    let taskStatus=""; 
    if(changespercentage==true){
    percentageComplete=0.03;
    taskStatus="Approved"

    }
   if(changespercentage==false){
     percentageComplete=0.02;
     taskStatus="Follow Up"
      }
   
      const web = new Web( this.props.Result.siteUrl);
      await web.lists.getByTitle(this.props.Result.listName)
     
      .items.getById(this.props.Result.Id).update({
        PercentComplete: percentageComplete,
        Status:taskStatus,
      }).then((res:any)=>{
       console.log(res);
     
       })
     .catch((err:any) => {
       console.log(err.message);
    });
   
 
  }
private async changeTrafficLigth  (index:any,item:any){
  console.log(index);
  console.log(item);
  if(  this.props?.Approver?.Id==this.props?.CurrentUser[0]?.Id){
    let tempData:any=this.state?.fbData;
    var approvalDataHistory={
      ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'), 
      Id: this.props.CurrentUser[0].Id,
       ImageUrl: this.props.CurrentUser[0].userImage,
        Title: this.props.CurrentUser[0].Title,
       isShowLight: item
   }
   tempData.isShowLight = item;
   if(tempData.ApproverData!=undefined &&  tempData.ApproverData.length>0){

     tempData.ApproverData.push(approvalDataHistory);
   }else{
     tempData.ApproverData=[];
     tempData.ApproverData .push(approvalDataHistory)
   }
   console.log(tempData);
 
   this.setState({
       fbData: tempData,
       index: index,
      
       emailComponentstatus:item
   });
  
   console.log(this.state?.fbData);
    await this.onPost("trafficlight",index-1,null);
    if(this.props.fullfeedback!=undefined){
      await this.checkforMail(this.props?.fullfeedback[0]?.FeedBackDescriptions,item,tempData);
      
   }
   }
}
private async changeTrafficLigthsubtext(parentindex:any,subchileindex:any,status:any){
  console.log(parentindex);
  console.log(subchileindex);
  console.log(status);
  if(  this.props?.Approver?.Id==this.props?.CurrentUser[0]?.Id){
  let tempData:any=this.state?.fbData;
  var approvalDataHistory={
    ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'), 
    Id: this.props.CurrentUser[0].Id,
     ImageUrl: this.props.CurrentUser[0].userImage,
      Title: this.props.CurrentUser[0].Title,
     isShowLight: status
  }
  tempData.Subtext[subchileindex].isShowLight = status;
  if(tempData.Subtext[subchileindex].ApproverData!=undefined &&  tempData.Subtext[subchileindex].ApproverData.length>0){
  
    tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory);
  }else{
    tempData.Subtext[subchileindex].ApproverData=[];
    tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory)
  }
  
  console.log(tempData);
  this.setState({
   fbData: tempData,
     index: parentindex,
   
     emailComponentstatus:status
  });
  console.log(this.state.emailcomponentopen)
  await this.onPost("trafficlightSubtext",parentindex-1,subchileindex);
  
  if(this.props.fullfeedback!=undefined){
  await this.checkforMail(this.props?.fullfeedback[0]?.FeedBackDescriptions,status,tempData?.Subtext[subchileindex]);
  }
   }
  }

private async onPost (trafficlight:any,parentindex:any,subchileindex:any){
 let fullfeedbackbackup:any=this.props?.fullfeedback
if(trafficlight=="trafficlight"){
  fullfeedbackbackup[0]?.FeedBackDescriptions.map((indexfeedback:any)=>{
  if(indexfeedback===parentindex){
    fullfeedbackbackup[0]?.FeedBackDescriptions.splice(indexfeedback, 1,this.state.fbData);
  }
  })
}
if(trafficlight=="trafficlightSubtext"){
  fullfeedbackbackup[0]?.FeedBackDescriptions.map((indexfeedback:any)=>{
    if(indexfeedback===parentindex){
     fullfeedbackbackup[0]?.FeedBackDescriptions.splice(indexfeedback, 1,this.state.fbData);
    }
    })
}
console.log(fullfeedbackbackup)

  let web = new Web(this.props.Result.siteUrl);
   await web.lists
    .getByTitle(this.props.Result.listName)
    
    .items
    .getById(this.props.Result.Id)
    .update({
      FeedBack: JSON.stringify(fullfeedbackbackup)
    }).then((data:any)=>{
   console.log(data)
    }).catch((error:any)=>{
   console.log(error)
    });


}

private ShowApprovalHistory(items:any){
console.log("this is a Approval function cxall ",items)
this.setState({
  ApprovalHistoryPopup:true,
  ApprovalPointUserData:items,
  ApprovalPointCurrentIndex:this.props.index-1,
   
})

}
private ApprovalHistoryPopupCallBack(){
this.setState({
    ApprovalHistoryPopup:false,
    ApprovalPointUserData:'',
    ApprovalPointCurrentIndex:null,
     
  })
}
// private ApprovalHistoryPopupCallBack= React.useCallback(()=>{
//   this.setState({
//     ApprovalHistoryPopup:false,
//     ApprovalPointUserData:null,
//     ApprovalPointCurrentIndex:null,
     
//   })
// },[])
private approvalcallback(){
  this.setState({
   emailcomponentopen:false,
    });

   }
  public render(): React.ReactElement<ITaskFeedbackProps> {
    return (
      <div>
        { this.state?.emailcomponentopen && countemailbutton==0 &&<EmailComponenet approvalcallback={() => { this.approvalcallback() }}  Context={this.props?.Context} emailStatus={this.state?.emailComponentstatus}  currentUser={this.props?.CurrentUser} items={this.props?.Result} />}
        <div className="col mb-2">
          <div className='justify-content-between d-flex'>
            <div className="pt-1">
              {this.props?.ApprovalStatus?
                <span className="MR5">
                  <span title="Rejected" onClick={()=> this.changeTrafficLigth(this.state.index,"Reject")}
                    className={this.state?.fbData['isShowLight'] == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                  >
                  </span>
                  <span onClick={()=> this.changeTrafficLigth(this.state.index,"Maybe")} title="Maybe" className={this.state.fbData['isShowLight'] == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                  </span>
                  <span title="Approved" onClick={()=> this.changeTrafficLigth(this.state.index,"Approve")} className={this.state.fbData['isShowLight'] == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                  </span>
                  {this.state?.fbData['ApproverData']!=undefined && this.state?.fbData?.ApproverData.length>0 &&<span className='px-3'>
                    <a  onClick={()=>this.ShowApprovalHistory(this.state?.fbData)}>Pre-approved by -</a>
                    <img  className="workmember"src={this.state?.fbData?.ApproverData[this.state?.fbData?.ApproverData?.length-1]?.ImageUrl}></img> 
                    </span>}
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


          <div className="d-flex p-0 FeedBack-comment ">
            <div className="border p-1 me-1">
              <span>{this.state.index}.</span>
              <ul className='list-none'>
                <li>
                  {this.state.fbData['Completed'] != null && this.state.fbData['Completed'] && 

                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                  }
                </li>
                <li>
                  {this.state.fbData['HighImportance'] != null && this.state.fbData['HighImportance'] &&
                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                  }
                </li>
                <li>
                  {this.state.fbData['LowImportance'] != null && this.state.fbData['LowImportance'] &&
                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                  }
                </li>
                <li>
                  {this.state.fbData['Phone'] != null && this.state.fbData['Phone'] &&
                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                  }
                </li>
              </ul>
            </div>

            <div className="border p-2 full-width text-break"
             title={this.state.fbData.ApproverData!=undefined&&this.state.fbData.ApproverData.length>0? this.state.fbData.ApproverData[this.state.fbData.ApproverData.length-1].isShowLight:""}>

              <span dangerouslySetInnerHTML={{ __html: this.state.fbData.Title }}></span>
              <div className="col">
                {this.state.fbData['Comments'] != null && this.state.fbData['Comments'].length > 0 && this.state.fbData['Comments']?.map((fbComment: any, k: any) => {
                  return <div className={fbComment.isShowLight!=undefined && fbComment.isApprovalComment?`col d-flex add_cmnt my-1 ${fbComment.isShowLight}`:"col d-flex add_cmnt my-1"}>
                    <div className="col-1 p-0">
                      <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                        fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                    </div>
                    <div className="col-11 pe-0" >
                      <div className='d-flex justify-content-between align-items-center'>
                        {fbComment?.AuthorName} - {fbComment?.Created}
                        <span className='d-flex'>
                          <a  title='Edit' onClick={() => this.openEditModal(fbComment, k, 0, false)}>
                        
                            <span className='svg__iconbox svg__icon--edit'></span>
                            </a>
                          <a  title='Delete' onClick={() => this.clearComment(false, k, 0)}><span className='svg__iconbox svg__icon--trash'></span></a>
                        </span>
                      </div>
                      <div><span dangerouslySetInnerHTML={{ __html: fbComment?.Title }}></span></div>
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>
          <div className='d-flex'>
            <div className="col-sm-11 mt-2 p-0" style={{ display: this.state.showcomment }}>
           {this.props?.Approver?.Id==this.props?.CurrentUser[0]?.Id && <span><input type='checkbox'name='approval' checked={this.state.ApprovalCommentcheckbox} onChange={(e)=>this.setState({ApprovalCommentcheckbox:e.target.checked})}/>
            <span className='mx-2'>Mark as Approval Comment</span></span>}
              <textarea id="txtComment" onChange={(e) => this.handleInputChange(e)} className="form-control full-width" ></textarea>
            </div>

            <div className="col-sm-1 full-width mt-2 ps-1 text-end " style={{ display: this.state.showcomment }}>
              <button type="button" className={this.props?.Approver?.Id==this.props?.CurrentUser[0]?.Id?"btn-primary mt-4 postbtn px-3":"btn-primary postbtn px-3"} onClick={() => this.PostButtonClick()}>Post</button>
            </div>
          </div>

        </div>

        {this.state.fbData['Subtext'] != null && this.state.fbData['Subtext'].length > 0 && this.state.fbData['Subtext']?.map((fbSubData: any, j: any) => {
          return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>
            <div className='justify-content-between d-flex'>
              <div>
                {this.props.ApprovalStatus ?
                  <span className="MR5">
                    <span title="Rejected"onClick={()=> this.changeTrafficLigthsubtext(this.state.index,j,"Reject")}
                      className={fbSubData.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                    >
                    </span>
                    <span title="Maybe"onClick={()=> this.changeTrafficLigthsubtext(this.state.index,j,"Maybe")} className={fbSubData?.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                    </span>
                    <span title="Approved" onClick={()=> this.changeTrafficLigthsubtext(this.state.index,j,"Approve")} className={fbSubData?.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                    </span>
                  {fbSubData.ApproverData!=undefined && fbSubData.ApproverData.length>0 &&<span className='px-3'>
                    <a  onClick={()=>this.ShowApprovalHistory(fbSubData)}>Pre-approved by -</a>
                    <img  className="workmember"src={fbSubData?.ApproverData[fbSubData?.ApproverData?.length-1]?.ImageUrl}></img> 
                    </span>}
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

            <div className="d-flex pe-0 FeedBack-comment">
              <div className="border p-1 me-1">
                <span >{this.state.index}.{j + 1}</span>
                <ul className="list-none">
                  <li>
                    {fbSubData?.Completed != null && fbSubData?.Completed &&
                      <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                    }
                  </li>
                  <li>
                    {fbSubData?.HighImportance != null && fbSubData?.HighImportance &&
                      <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                    }
                  </li>
                  <li>
                    {fbSubData?.LowImportance != null && fbSubData?.LowImportance &&
                      <span><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                    }
                  </li>
                  <li>
                    {fbSubData?.Phone != null && fbSubData?.Phone &&
                      <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                    }
                  </li>
                </ul>
              </div>

              <div className="border p-2 full-width text-break"
                title={fbSubData?.ApproverData!=undefined&&fbSubData?.ApproverData?.length>0? fbSubData?.ApproverData[fbSubData?.ApproverData.length-1]?.isShowLight:""}>
                <span ><span dangerouslySetInnerHTML={{ __html: fbSubData?.Title?.replace(/<[^>]*>/g, '') }}></span></span>
                <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                  {fbSubData?.Comments != null && fbSubData.Comments.length > 0 && fbSubData?.Comments?.map((fbComment: any, k: any) => {
                    return <div className={fbComment?.isShowLight!=undefined && fbComment.isApprovalComment?`col-sm-12 d-flex mb-2 add_cmnt my-1 ${fbComment?.isShowLight}`:"col-sm-12 d-flex mb-2 add_cmnt my-1 "}>
                      <div className="col-sm-1 padL-0 wid35">
                        <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                          fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                      </div>
                      <div className="col-sm-11 pad0" key={k}>
                        <div className="d-flex justify-content-between align-items-center">
                          {fbComment?.AuthorName} - {fbComment?.Created}
                          <span className='d-flex'>
                            <a  title="Edit" onClick={() => this.openEditModal(fbComment, k, j, true)}>
                           
                             <span className='svg__iconbox svg__icon--edit'></span>
                              </a>
                            <a title='Delete' onClick={() => this.clearComment(true, k, j)}><span className='svg__iconbox svg__icon--trash'></span></a>
                          </span>
                        </div>
                        <div ><span dangerouslySetInnerHTML={{ __html: fbComment?.Title }}></span></div>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            </div>
            {sunchildcomment == j ? <div className='d-flex ' >
              <div className="col-sm-11  mt-2 p-0  " style={{ display: this.state.showcomment_subtext }}>
              {this.props?.Approver?.Id==this.props?.CurrentUser[0]?.Id&&<span><input type='checkbox'  checked={this.state?.ApprovalCommentcheckbox}  onChange={(e)=>this.setState({ApprovalCommentcheckbox:e.target?.checked})}/><span className='mx-2'>Mark as Approval Comment</span></span>}
                <textarea id="txtCommentSubtext" onChange={(e) => this.handleInputChange(e)}  className="form-control full-width" ></textarea>
              </div>

              <div className="col-sm-1 mt-2 ps-1 full-width text-end  " style={{ display: this.state.showcomment_subtext }}>
                <button type="button" className={this.props?.Approver?.Id==this.props?.CurrentUser[0]?.Id?"btn-primary mt-4 postbtn px-3":"btn-primary postbtn px-3"} onClick={() => this.SubtextPostButtonClick(j)}>Post</button>
              </div>
            </div> : null}

          </div>
        })}
        <Modal isOpen={this.state.isModalOpen} isBlocking={false} containerClassName="custommodalpopup p-2">

          <div className="modal-header mb-1">
            <h5 className="modal-title">Update Comment</h5>
           <span className='mx-1'> <Tooltip ComponentId='1683' /></span>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => this.CloseModal(e)}></button>
          </div>
          <div className="modal-body">
            <div className='col'><textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => this.handleUpdateComment(e)}  >{this.state?.CommenttoUpdate}</textarea></div>
          </div>
          <footer className='text-end mt-2'>
            <button className="btn btnPrimary " onClick={(e) => this.updateComment()}>Save</button>
            <button className='btn btn-default ms-1' onClick={(e) => this.CloseModal(e)}>Cancel</button>
          </footer>
        </Modal>
        {this.state.ApprovalHistoryPopup?<ApprovalHistoryPopup  
                         ApprovalPointUserData={this.state.ApprovalPointUserData}
                        ApprovalPointCurrentIndex={this.state.ApprovalPointCurrentIndex}
                        ApprovalPointHistoryStatus={this.state.ApprovalHistoryPopup}
                        callBack={()=>this.ApprovalHistoryPopupCallBack()}
                        />
                        :null}
      </div>
     
    );
  }

}
export default TaskFeedbackCard;
