import * as React from 'react';
import styles from './Taskprofile.module.scss';
import { ITaskprofileProps } from './ITaskprofileProps';
import TaskFeedbackCard from './TaskFeedbackCard';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
import { Modal } from 'office-ui-fabric-react';
import CommentCard from '../../../globalComponents/Comments/CommentCard'
//import '../../cssFolder/foundation.scss';
//import '../../cssFolder/foundationmin.scss';
import './Taskprofile.module.scss';
import '../../cssFolder/Style.scss';
import '../../cssFolder/site_color.scss';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';

export interface ITaskprofileState {  
  Result : any;
  listName : string;
  itemID : number;
  isModalOpen: boolean;
  imageInfo: any;
  Display: string;
  showcomment: string;
  updateComment: boolean;
  showComposition: boolean;
}

export default class Taskprofile extends React.Component<ITaskprofileProps, ITaskprofileState> {
  
  private taskUsers : any = [];
  private currentUser: any;
  private oldTaskLink:any;
  public constructor(props:ITaskprofileProps,state:ITaskprofileState){
    super(props);
    const params = new URLSearchParams(window.location.search);    
    console.log(params.get('taskId'));
    console.log(params.get('Site'));

    this.oldTaskLink = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId="+ params.get('taskId') +"&Site="+ params.get('Site');
    this.state ={
      Result:{},
      listName: params.get('Site'),
      itemID : Number(params.get('taskId')),
      isModalOpen : false,
      imageInfo : {},
      Display : 'none',
      showcomment : 'none',
      updateComment : false,
      showComposition: true
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
      .select("ID","Title","DueDate","Categories","Status","StartDate","CompletedDate","Team_x0020_Members/Title","ItemRank","PercentComplete","Priority","Created","Author/Title","Author/EMail","BasicImageInfo","component_x0020_link","FeedBack","Responsible_x0020_Team/Title","SharewebTaskType/Title","ClientTime","Component/Title")
      .expand("Team_x0020_Members","Author","Responsible_x0020_Team","SharewebTaskType","Component")
      .get()
      
    console.log(taskDetails);
    await this.GetTaskUsers();

    this.currentUser = this.GetUserObject(this.props.userDisplayName);

    let tempTask = {
      SiteIcon : this.GetSiteIcon(this.state.listName),
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
      SharewebTaskType : taskDetails["SharewebTaskType"] !=null ? taskDetails["SharewebTaskType"].Title : '',
      ClientTime: taskDetails["ClientTime"] != null && JSON.parse(taskDetails["ClientTime"]),
      Component:  taskDetails["Component"]  
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

  private GetSiteIcon(listName:string){
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

  private showhideComposition(){    
    if (this.state.showComposition){
      this.setState({ 
        showComposition:false
      });
    }else{
      this.setState({ 
        showComposition:true
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
      
        <section className='col-sm-12 pad0'>
            <h2 className="headign">
              <img className={styles.imgWid29} src={this.state.Result["SiteIcon"]}/>
                {this.state.Result['Title']}
              </h2>
        </section>
<section>
  <div className="col-md-9 bg-white">
  <div className="team_member row  py-2">
            <div className='col-md-4 p-0'>
              <dl>
                <dt className='bg-fxdark'>Task Id</dt>
                <dd className='bg-light' ng-show="Task.Shareweb_x0020_ID!=undefined" ng-repeat="taskId in maincollection">{this.state.Result["ID"]}</dd>
              </dl>
              <dl>
                <dt className='bg-fxdark'>Due Date</dt>
                <dd className='bg-light'>{this.state.Result["DueDate"] != null ? (new Date(this.state.Result["DueDate"])).toLocaleDateString() : ''}</dd>
              </dl>
              <dl>
                <dt className='bg-fxdark'>Start Date</dt>
                <dd className='bg-light'>{this.state.Result["StartDate"]}</dd>
              </dl>
              <dl>
                <dt className='bg-fxdark'>Completion Date</dt>
                <dd className='bg-light'> {this.state.Result["CompletedDate"]}</dd>
              </dl>
              <dl>
                <dt className='bg-fxdark' title="Task Id">Categories</dt>
                <dd className='bg-light'>{this.state.Result["Categories"]}</dd>
              </dl>
              <dl>
                <dt className='bg-fxdark'>SmartTime Total</dt>
                <dd className='bg-light'></dd>
              </dl>
            </div>
            <div className='col-md-4 p-0'>
            <dl>
                <dt className='bg-fxdark'>Team Members</dt>
                <dd className='bg-light'>
                <div className={styles.team_Members_Item}>
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
                <span className="ng-binding">{this.state.Result["Created"]} | 
                      <img className={styles.imgAuthor} src={this.state.Result["Author"] != null && this.state.Result["Author"].length > 0 && this.state.Result["Author"][0].userImage}></img></span>
                </dd>
              </dl>
              
              

            </div>
            <div className='col-md-4 p-0'>
            <dl className='d-grid text-right'><span className="pull-right"> <a  target='_blank' href={this.oldTaskLink} style={{cursor: "pointer"}}>Old Task Profile</a></span></dl>
            <dl>

                <dt className='bg-fxdark'>Portfolio</dt>
                <dd className='bg-light full-width'>
                {this.state.Result["Component"] != null && this.state.Result["Component"].length>0 && this.state.Result["Component"].map( (componentdt:any,i:any)=> {
                    return (
                                <a className="hreflink ng-binding" target="_blank" href="">{componentdt.Title}</a>
                                   
                                )})} 

                </dd>
              </dl>
              <dl className="Sitecomposition">
                {this.state.Result["ClientTime"] !=null && this.state.Result["ClientTime"].length > 0 &&
                  <div className='dropdown'>
                 <a className="btn btn-secondary bg-fxdark " onClick={()=>this.showhideComposition()}>
                      <span >{this.state.showComposition ?<IoMdArrowDropdown /> :  <IoMdArrowDropright />}</span><span>Site Composition</span>
                    </a>
                  <div  className="spxdropdown-menu"  style={{display:this.state.showComposition ? 'block': 'none'}}>
                    <ul>
                     {this.state.Result["ClientTime"].map( (cltime:any,i:any)=> { 
                       return <li className="dropdown-item">
                         <span>
                          <img style={{width:"22px"}} src={this.GetSiteIcon(cltime.SiteName)} />
                         </span>
                          {cltime.ClienTimeDescription !=undefined &&
                         <span>
                            {cltime.ClienTimeDescription}%
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
              <div className='bg-light p-2 text-break'>
              {this.state.Result["component_url"] != null &&
                      <a href={this.state.Result["component_url"].Url}>{this.state.Result["component_url"].Url}</a> 
                    }
              </div>
                
              </div> 
          </div>
          <section>
          <div className="row">
                <div className="Taskaddcomment ps-0">
                {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].length > 0 &&
                  <div className="col-sm-4 bg-white col-sm-4 pt-3 ps-0">
                  {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"].map( (imgData:any,i:any)=> {
                  return <div className="taskimage border mb-3">
                          
                                <a className='images' target="_blank" href={imgData.ImageUrl}>
                                  <img alt={imgData.ImageName} src={imgData.ImageUrl} onMouseOver={(e) =>this.OpenModal(e, imgData)}></img>
                                </a>
                             
              
                            <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-2 ">
                              <div className='usericons'>
                                <span  ng-show="attachedFiles.FileName==imageInfo.ImageName" ng-repeat="imageInfo in BasicImageInfo">
                                  <span >{imgData.UploadeDate}</span>                                 
                                  <img className='ms-2'  title={imgData.UserName} src={imgData.UserImage}/>
                                </span>
                              </div>
                              <div>
                                <span >
                                {imgData.ImageName.length > 15 ? imgData.ImageName.substring(0,15)+'...' : imgData.ImageName }
                                </span>
                                <span>|</span>
                              </div>
                              
                            </div>
                    </div>
                  })}
                  </div>
                  }
                  <div className="col-sm-8">
                    {this.state.Result["SharewebTaskType"] !=null && (this.state.Result["SharewebTaskType"] =='' || 
                    this.state.Result["SharewebTaskType"] == 'Task') && this.state.Result["FeedBack"] != null && 
                    this.state.Result["FeedBack"][0].FeedBackDescriptions.length > 0 && 
                    this.state.Result["FeedBack"][0].FeedBackDescriptions[0].Title!='' &&
                      <div className="Addcomment">
                        {this.state.Result["FeedBack"][0].FeedBackDescriptions.map( (fbData:any,i:any)=> {
                          return <TaskFeedbackCard feedback = {fbData} index={i+1} 
                                                  onPost={()=>{this.onPost()}} 
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
          <Modal isOpen={this.state.isModalOpen} isBlocking={false} containerClassName={styles.custommodalpopup}>
            <div className={styles.parentDiv}>
            <span className={styles.closeButtonRow}><img src={require('../assets/cross.png')} className={styles.modal_close_image} onClick={(e) =>this.CloseModal(e) }/></span>
                <span>{this.state.imageInfo["ImageName"]}</span>
                <img style={{maxWidth: '96%',margin: '2%'}} src={this.state.imageInfo["ImageUrl"]}></img>
            </div>
          </Modal>
          </div>
          </section>
    
  </div>
  <div className="col-md-3">
  <CommentCard siteUrl={this.props.siteUrl} Context={this.props.Context}></CommentCard>
  </div>
</section>


  
       </div> 
    );
  }
}