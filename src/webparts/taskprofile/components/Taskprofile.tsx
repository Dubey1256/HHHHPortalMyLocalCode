import * as React from 'react';
import styles from './Taskprofile.module.scss';
import { ITaskprofileProps } from './ITaskprofileProps';
import TaskFeedbackCard from './TaskFeedbackCard';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
import { Modal } from 'office-ui-fabric-react';
import CommentCard from '../../../globalComponents/Comments/CommentCard'
import '../../cssFolder/foundation.scss';
import '../../cssFolder/foundationmin.scss';

export interface ITaskprofileState {  
  Result : any;
  listName : string;
  itemID : number;
  isModalOpen: boolean;
  imageInfo: any;
  Display: string;
  showcomment: string;
  updateComment: boolean;
}

export default class Taskprofile extends React.Component<ITaskprofileProps, ITaskprofileState> {
  
  private taskUsers : any = [];
  private currentUser: any;
  public constructor(props:ITaskprofileProps,state:ITaskprofileState){
    super(props);
    const params = new URLSearchParams(window.location.search);    
    console.log(params.get('taskId'));
    console.log(params.get('Site'));

    this.state ={
      Result:{},
      listName: params.get('Site'),
      itemID : Number(params.get('taskId')),
      isModalOpen : false,
      imageInfo : {},
      Display : 'none',
      showcomment : 'none',
      updateComment : false
    }

    this.GetResult();
  }

  public async componentDidMount(){
    //this.GetRes ult()
  }

  
  
  private async GetResult() {
    let web = new Web(this.props.siteUrl);
    let taskDetails = [];    
    taskDetails = await web.lists
      .getByTitle(this.state.listName)
      .items
      .getById(this.state.itemID)
      .select("ID","Title","DueDate","Categories","Status","StartDate","CompletedDate","Team_x0020_Members/Title","ItemRank","PercentComplete","Priority","Created","Author/Title","Author/EMail","BasicImageInfo","component_x0020_link","FeedBack","Responsible_x0020_Team/Title","SharewebTaskType/Title")
      .expand("Team_x0020_Members","Author","Responsible_x0020_Team","SharewebTaskType")
      .get()
      
    console.log(taskDetails);
    await this.GetTaskUsers();

    this.currentUser = this.GetUserObject(this.props.userDisplayName);

    let tempTask = {
      SiteIcon : this.GetSiteIcon(),
      ID: 'T'+taskDetails["ID"],
      Title: taskDetails["Title"],
      DueDate: taskDetails["DueDate"],
      Categories: taskDetails["Categories"],
      Status: taskDetails["Status"],
      StartDate: taskDetails["StartDate"] != null ? (new Date(taskDetails["StartDate"])).toLocaleDateString() : '',
      CompletedDate: taskDetails["CompletedDate"] != null ? (new Date(taskDetails["CompletedDate"])).toLocaleDateString() : '',
      TeamLeader: taskDetails["Responsible_x0020_Team"] != null ? this.GetUserObjectFromCollection(taskDetails["Responsible_x0020_Team"]) : null,
      TeamMembers: taskDetails["Team_x0020_Members"] != null ? this.GetUserObjectFromCollection(taskDetails["Team_x0020_Members"]) : null,
      ItemRank: taskDetails["ItemRank"],
      PercentComplete: taskDetails["PercentComplete"],
      Priority: taskDetails["Priority"],
      Created:  taskDetails["Created"] != null ? (new Date(taskDetails["Created"])).toLocaleDateString() : '',
      Author: this.GetUserObject(taskDetails["Author"]),
      component_url: taskDetails["component_x0020_link"],
      BasicImageInfo: JSON.parse(taskDetails["BasicImageInfo"]),
      FeedBack: JSON.parse(taskDetails["FeedBack"]),
      SharewebTaskType : taskDetails["SharewebTaskType"] !=null ? taskDetails["SharewebTaskType"].Title : ''      
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
    .filter("ItemType eq 'User'")
    .expand('AssingedToUser')
    .get();    
    this.taskUsers = taskUsers;
    console.log(this.taskUsers);

  }

  private GetSiteIcon(){
    let siteicon = '';
    if (this.state.listName.toLocaleLowerCase() == 'migration') {
      siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'eps') {
      siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'ei') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'qa') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'gender') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'education') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'development-effectiveness' || this.state.listName.toLocaleLowerCase() == 'de') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'cep') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/icon_cep.png';
    }
    if (this.state.listName.toLocaleLowerCase() == 'alakdigital') {
        siteicon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_da.png';
    }
    return siteicon;
  }

  private GetUserObjectFromCollection(UsersValues:any){  
    let userDeatails = [];
    for (let index = 0; index < UsersValues.length; index++) {
      let senderObject = this.taskUsers.filter(function (user:any, i:any){ 
        if (user.AssingedToUser != undefined){
          return user.AssingedToUser['Title'] == UsersValues[index].Title
        }
      });
      if (senderObject.length > 0){
          userDeatails.push({
            'Id' : senderObject[0].Id,
            'Name' : senderObject[0].Email,
            'Suffix' : senderObject[0].Suffix,
            'Title' : senderObject[0].Title,
            'userImage': senderObject[0].Item_x0020_Cover.Url
          })
        }
      }
    return userDeatails;
  }

  private GetUserObject(username:any){
    let userDeatails = [];
    let senderObject = this.taskUsers.filter(function (user:any, i:any){ 
      if (user.AssingedToUser != undefined ){
        
        return user.AssingedToUser['Title'] == username.Title || user.AssingedToUser['Title'] == "SPFx Developer1"
      
      }
      });
      if (senderObject.length > 0){
          userDeatails.push({
            'Id' : senderObject[0].Id,
            'Name' : senderObject[0].Email,
            'Suffix' : senderObject[0].Suffix,
            'Title' : senderObject[0].Title,
            'userImage': senderObject[0].Item_x0020_Cover.Url
          })
        }    
    return userDeatails;
  }
  

  //open the model
  private OpenModal(e:any, item:any) {
    //debugger;
    e.preventDefault();    
    console.log(item);
    this.setState({ 
      isModalOpen:true,
      imageInfo: item
    });
  }

  //close the model
  private CloseModal(e:any) {
    e.preventDefault();
    this.setState({ 
      isModalOpen:false,
      imageInfo: {} 
    });
  }

  private handleSuffixHover(){
    //e.preventDefault();
    this.setState({ 
      Display:'block'
    });
  }

  private handleuffixLeave(){
    //e.preventDefault();
    
    this.setState({ 
      Display:'none'
    });
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

  private async onPost(){
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

        <div className='col-sm-12 pad0'>
          <div className='col-lg-9 left-col'>
          <div className={styles.task_title} style={{verticalAlign:'top'}}>
              <h1 className="mb-5 ng-binding">
                <img className={styles.imgWid29} src={this.state.Result["SiteIcon"]}/>
                {this.state.Result['Title']}
              </h1>
            </div>
          
          <table className={styles.tasktable}>
            <tr>
              <td className={styles.taskNameTd}>Task Id</td>
              <td>{this.state.Result["ID"]}</td>
              <td className={styles.taskNameTd}>Due Date</td>
              <td>{this.state.Result["DueDate"] != null ? (new Date(this.state.Result["DueDate"])).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td className={styles.taskNameTd}>Categories</td>
              <td>{this.state.Result["Categories"]}</td>
              <td className={styles.taskNameTd}>Status</td>
              <td>{this.state.Result["Status"]}</td>
            </tr>
            <tr>
              <td className={styles.taskNameTd}>Start Date</td>
              <td>{this.state.Result["StartDate"]}</td>
              <td className={styles.taskNameTd}>Completion Date</td>
              <td>{this.state.Result["CompletedDate"]}</td>
            </tr>
            <tr>
              <td className={styles.taskNameTd}>Team Members</td>
              <td> <div className={styles.team_Members_Item}>
                {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length>0 && this.state.Result["TeamLeader"].map( (rcData:any,i:any)=> {
                  return  <div className={styles.user_Member_img}><img className={styles.imgAuthor} src={rcData.userImage}></img></div>                        
                })} 
                {this.state.Result["TeamLeader"] != null && this.state.Result["TeamLeader"].length>0 &&
                  <div className={styles.seperator}>|</div>
                }               

                {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 0 &&
                  <div className={styles.user_Member_img}><img className={styles.imgAuthor} src={this.state.Result["TeamMembers"][0].userImage}></img></div>                        
                }
                {this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].length > 1 &&
                  <div className={styles.user_Member_img_suffix2} onMouseOver={(e) =>this.handleSuffixHover()} onMouseLeave={(e) =>this.handleuffixLeave()}>+{this.state.Result["TeamMembers"].length - 1}
                    <span className={styles.tooltiptext} style={{display: this.state.Display, padding:'10px'}}>
                      <div>                        
                          { this.state.Result["TeamMembers"].slice(1).map( (rcData:any,i:any)=> {
                            
                            return  <div className={styles.team_Members_Item} style={{padding: '2px'}}>
                              <div><img className={styles.imgAuthor} src={rcData.userImage}></img></div>
                              <div>{rcData.Title}</div>
                            </div>
                                                    
                          })
                          }
                       
                      </div>
                    </span>
                  </div>                        
                }
                
                {/*this.state.Result["TeamMembers"] != null && this.state.Result["TeamMembers"].map( (rcData,i)=> {
                  return  <span>{ i != 0 &&
                            <img className={styles.imgAuthor} src={rcData.userImage}></img>}
                    </span>                        
                })*/}
                </div>
              </td>
              <td className={styles.taskNameTd}>SmartTime Total</td>
              <td></td>
            </tr>
            <tr>
              <td className={styles.taskNameTd}>Item Rank</td>
              <td>{this.state.Result["ItemRank"]}</td>
              <td className={styles.taskNameTd}>% Complete</td>
              <td>{this.state.Result["PercentComplete"]}</td>
            </tr>
            <tr>
              <td className={styles.taskNameTd}>Priority</td>
              <td>{this.state.Result["Priority"]}</td>
              <td className={styles.taskNameTd}>Created</td>
              <td>{this.state.Result["Created"]} | 
              <img className={styles.imgAuthor} src={this.state.Result["Author"] != null && this.state.Result["Author"].length > 0 && this.state.Result["Author"][0].userImage}></img>
              </td>
            </tr>
            <tr>
              <td className={styles.taskNameTd}>Url</td>
              <td colSpan={3}>{this.state.Result["component_url"] != null &&
                <a href={this.state.Result["component_url"].Url}>{this.state.Result["component_url"].Url}</a> 
               }
              </td>
              
            </tr>
            </table>
          <div>
              <div className={styles.imageSec}>            
              {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].map( (imgData:any,i:any)=> {
                return  <div style={{marginBottom:'5%'}}>
                          <img className={styles.sit_preview} alt={imgData.ImageName} src={imgData.ImageUrl} onMouseOver={(e) =>this.OpenModal(e, imgData)}></img>
                          <div>
                            <span>{imgData.UploadeDate}</span>
                            <span><img className={styles.imgAuthor} src={imgData.UserImage}></img></span>
                            <span>{imgData.ImageName.length > 15 ? imgData.ImageName.substring(0,15)+'...' : imgData.ImageName }</span>
                          </div>
                        </div>                        
              })}             
              </div>

              <div className={styles.feedbackSec}>
              {this.state.Result["SharewebTaskType"] !=null && this.state.Result["SharewebTaskType"] !='' && 
              this.state.Result["SharewebTaskType"] == 'Task' && this.state.Result["FeedBack"] != null && 
              this.state.Result["FeedBack"][0].FeedBackDescriptions.map( (fbData:any,i:any)=> {
                  return <TaskFeedbackCard feedback = {fbData} index={i+1} onPost={()=>{this.onPost()}} fullfeedback={this.state.Result["FeedBack"]} CurrentUser={this.currentUser}></TaskFeedbackCard> 
                })}
              </div>
          </div>
          
          <Modal isOpen={this.state.isModalOpen} isBlocking={false} containerClassName={styles.custommodalpopup}>
            <div className={styles.parentDiv}>
            <span className={styles.closeButtonRow}><img src={require('../assets/cross.png')} className={styles.modal_close_image} onClick={(e) =>this.CloseModal(e) }/></span>
                <span>{this.state.imageInfo["ImageName"]}</span>
                <img style={{maxWidth: '96%',margin: '2%'}} src={this.state.imageInfo["ImageUrl"]}></img>
            </div>
          </Modal>

          </div>
          <div className='col-md-3'>
            <CommentCard siteUrl={this.props.siteUrl} userDisplayName={this.props.userDisplayName}></CommentCard>
          </div>
        </div>
      </div>
        
    );
  }
}