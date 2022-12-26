
import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaHome, FaRegTimesCircle } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import { Modal } from 'office-ui-fabric-react';
import '../../cssFolder/Style.scss'

var siteConfig:any=[]
var AllTaskUser:any=[]
export default function ProjectOverview(){
    

    const [AllTasks,setAllTasks] = React.useState([])
    
    const [EditmodalIsOpen, setEditmodalIsOpen] = React.useState(false);
    
    const [AddmodalIsOpen, setAddmodalIsOpen] = React.useState(false);
    // const [Masterdata,setMasterdata] = React.useState([])
   
    //const [QueryId, setQueryId] = React.useState()

    React.useEffect(() => {
        
        TaskUser()
        GetMasterData();
      
      
    }, [])

    const TaskUser=async()=>{
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUser = [];
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
            .top(5000)
            .expand("AssingedToUser,Approver")
            .get();
            
            AllTaskUser=taskUser;
       }
    const GetMasterData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        let Alltask: any = [];
        var AllUsers: any = []
        taskUsers = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Deliverables,TechnicalExplanations,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title").expand("ComponentPortfolio,ServicePortfolio,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent").top(4999).get();
            taskUsers.PercentComplete = (taskUsers.PercentComplete * 100).toFixed(0);
            // if(taskUsers.ItemType=="Project"){
           
            taskUsers.map((item:any)=>{
                if(item.Item_x0020_Type != null && item.Item_x0020_Type == "Project"){
                    Alltask.push(item)
                }
                Alltask.map((items: any) => {

                    items.AssignedUser = []
        
                    if (items.AssignedTo != undefined) {
        
                        items.AssignedTo.map((taskUser: any) => {
        
                            var newuserdata: any = {};
        
                            AllTaskUser.map((user: any) => {
        
                                if (user.AssingedToUserId == taskUser.Id) {
        
        
        
                                    newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
        
                                    newuserdata['Suffix'] = user.Suffix;
        
                                    newuserdata['Title'] = user.Title;
        
                                    newuserdata['UserId'] = user.AssingedToUserId;
        
                                    items['Usertitlename'] = user.Title;
        
                                }
        
        
        
                            })
        
                            items.AssignedUser.push(newuserdata);
        
                        })
        
        
        
                    }
        
                })
            })
            
            
        // }
        setAllTasks(Alltask)

    }

    const setEditmodalIsOpenToTrue = () => {
        setEditmodalIsOpen(true)
    }
    const setEditmodalIsOpenToFalse = () => {
        setEditmodalIsOpen(false)
    }
    const setAddmodalIsOpenToTrue = () => {
        setAddmodalIsOpen(true)
    }
    const setAddmodalIsOpenToFalse = () => {
        setAddmodalIsOpen(false)
    }

    console.log(AllTasks);
    return(
        <div>
          {/* Edit Popup */}
          {AllTasks.length > 0 && AllTasks && AllTasks.map(function (item, index) {
            return(
           <Modal 
                isOpen={EditmodalIsOpen}
                onDismiss={setEditmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
             <span >
             <h4 className="col-sm-12 siteColor quickheader">
                                                    Edit Task <span title="Close popup" className="pull-right hreflink"
                                                                      onClick={setEditmodalIsOpenToFalse}>
                                                        <i className="fa fa-times-circle"  ><FaRegTimesCircle/></i>
                                                    </span>
                                                </h4>
                                            <div>
                                                <span>
                                                    <input type='text' value={item.Title}/>
                                                </span>
                                                <span>
                                                    <input type='text' value={item.PercentComplete}/>
                                                </span>
                                            </div>
                                            <div>
                                            <span>
                                                    <input type='text'/>
                                                </span>
                                                <span>
                                                    <input type='text' value={item.DueDate!=null?Moment(item.DueDate).format('DD/MM/YYYY'):""}/>
                                                </span>
                                            </div>
                                            <div>
                                                <span><input type='text'/></span>
                                            </div>
                                            <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                                                    <button type="button" ng-click="FilterData('SmartTime')"
                                                            className="btn btn-primary">
                                                        Update
                                                    </button>
                                                    <button type="button" className="btn btn-primary"
                                                            ng-click="Filtercancel('SmartTime')" onClick={setEditmodalIsOpenToFalse}>
                                                        Cancel
                                                    </button>
                                                </div>

                                        </span>
             
                
            </Modal>
          )})}
{/* Edit Popup End*/}
 {/* Add Popup */}
 <Modal 
                isOpen={AddmodalIsOpen}
                onDismiss={setAddmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
                          <h4 className="col-sm-12 siteColor quickheader">
                                                    ADD Task <span title="Close popup" className="pull-right hreflink"
                                                                      onClick={setAddmodalIsOpenToFalse}>
                                                        <i className="fa fa-times-circle"  ><FaRegTimesCircle/></i>
                                                    </span>
                                                </h4>
             <span >
                                            <div>
                                                <span>
                                                    <input type='text'/>
                                                </span>
                                                <span>
                                                    <input type='text'/>
                                                </span>
                                            </div>
                                            <div>
                                            <span>
                                                    <input type='text'/>
                                                </span>
                                                <span>
                                                    <input type='text'/>
                                                </span>
                                            </div>
                                            <div>
                                                <span><input type='text'/></span>
                                            </div>
                                            <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                                                    <button type="button" ng-click="FilterData('SmartTime')"
                                                            className="btn btn-primary">
                                                     Create 
                                                    </button>
                                                    <button type="button" className="btn btn-primary"
                                                            ng-click="Filtercancel('SmartTime')" onClick={setAddmodalIsOpenToFalse}>
                                                        Cancel
                                                    </button>
                                                </div>
                                        </span>
             
                
            </Modal>
{/* Add Popup End*/}

        

         <div className="col-sm-12 pad0 smart">
                                    <div className="section-event">
                                        <div className="wrapper">
                                        <h1>Project Management Overview</h1>
                                        
                                        <div><button type='button' onClick={setAddmodalIsOpenToTrue}>Add Popup</button></div>
                                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                            <thead>
                                                    <tr>
                                                      
                                                      
                                                        <th style={{ width: "40%" }}>
                                                            <div className="smart-relative">
                                                                <input type="search" placeholder="Title" className="full_width searchbox_height" />

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "15%" }}>
                                                            <div  className="smart-relative">
                                                                <input type="search" placeholder="% Complete" className="full_width searchbox_height"/>
   

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "15%" }}>
                                                            <div className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Priority"
                                                                    title="Client Category" className="full_width searchbox_height"/>
                                                               
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "15%" }}>
                                                            <div className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                                    title="Client Category" className="full_width searchbox_height"/>
                                                               
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "13%" }}>
                                                            <div className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Due Date"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    />
                                                           
                                                                
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "2%" }}>
                                                        </th>
                                                      
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    <div id="SpfxProgressbar" style={{ display: "none" }}>

                                                        <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />

                                                    </div>
                                                    {AllTasks.length > 0 && AllTasks && AllTasks.map(function (item, index) {
                                                      
                                                     
                                                            return (
                                                                <>
                                                                    <tr >
                                                                                    <td>
                                                                                    <span><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${item.Id}`}>{item.Title}</a></span>

                                                                                    </td>
                                                                                    <td><span className="ml-2">{item.PercentComplete}</span></td>    
                                                                                    <td>{item.Priority}</td>

                                                                                 <td>
                                                                                    {item.AssignedUser != undefined &&
                                                                                       item.AssignedUser.map((Userda:any)=>{
                                                                                        return(
                                                                                            <span className="headign">
                                                                                            <img  src={Userda.useimageurl} title={Userda.Title}/>
                                                                                            
                                                                                        </span>
                                                                                        )
                                                                                       })
                                                                                    }
                                                                                 </td>

                                                                                    <td><span className="ml-2">{item.DueDate!=null?Moment(item.DueDate).format('DD/MM/YYYY'):""}</span></td>
                                                                                    <td><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={setEditmodalIsOpenToTrue}></img></td>
                                                                                  
                                                                            
                                                                       

                                                                    </tr>
                                                                
                                                                </>


                                                            )
                                                       
                                                    })}



                                                </tbody>



                                            </table>
                                        </div>
                                    </div>
                                </div>

        </div>
    )
}